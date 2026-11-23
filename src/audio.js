import fs from "node:fs";
import { execFileSync } from "node:child_process";

export const SAMPLE_RATE = 48000;

export function decodeToFloat(file) {
  const buf = execFileSync(
    "ffmpeg",
    ["-v", "error", "-i", file, "-f", "f32le", "-ac", "1", "-ar", String(SAMPLE_RATE), "pipe:1"],
    { maxBuffer: 1 << 30 },
  );
  return new Float32Array(buf.buffer, buf.byteOffset, buf.byteLength / 4).slice();
}

const NOTE = (n) => 440 * 2 ** ((n - 69) / 12);

// C - Am - F - G, one bar each, gentle music-box arpeggios.
const CHORDS = [
  [60, 64, 67, 72],
  [57, 60, 64, 69],
  [53, 57, 60, 65],
  [55, 59, 62, 67],
];
const PATTERN = [0, 1, 2, 3, 2, 1, 2, 1];

function addNote(out, startSec, freq, dur, gain) {
  const s0 = Math.floor(startSec * SAMPLE_RATE);
  const n = Math.floor(dur * SAMPLE_RATE);
  for (let i = 0; i < n && s0 + i < out.length; i++) {
    const t = i / SAMPLE_RATE;
    const env = Math.min(1, t / 0.01) * Math.exp(-t * 3.2);
    const v =
      Math.sin(2 * Math.PI * freq * t) * 0.7 +
      Math.sin(2 * Math.PI * freq * 2 * t) * 0.2 +
      Math.sin(2 * Math.PI * freq * 3 * t) * 0.06;
    out[s0 + i] += v * env * gain;
  }
}

export function makeMusic(totalSec) {
  const out = new Float32Array(Math.ceil(totalSec * SAMPLE_RATE));
  const beat = 60 / 96 / 2;
  const barLen = beat * PATTERN.length;
  for (let bar = 0; bar * barLen < totalSec; bar++) {
    const chord = CHORDS[bar % CHORDS.length];
    addNote(out, bar * barLen, NOTE(chord[0] - 12), barLen * 1.2, 0.5);
    PATTERN.forEach((p, i) => addNote(out, bar * barLen + i * beat, NOTE(chord[p] + 12), 1.4, 0.32));
  }
  return out;
}

/**
 * clips: [{ samples: Float32Array, at: seconds }]
 * Voice clips are placed sample-exactly; music is ducked while anyone speaks.
 */
export function mixTrack(clips, totalSec, outWav) {
  const len = Math.ceil(totalSec * SAMPLE_RATE);
  const voice = new Float32Array(len);
  const speaking = new Uint8Array(len);
  for (const c of clips) {
    const s0 = Math.round(c.at * SAMPLE_RATE);
    for (let i = 0; i < c.samples.length && s0 + i < len; i++) {
      voice[s0 + i] += c.samples[i];
      speaking[s0 + i] = 1;
    }
  }

  let peak = 0;
  for (const v of voice) peak = Math.max(peak, Math.abs(v));
  const voiceGain = peak > 0 ? 0.89 / peak : 1;

  const music = makeMusic(totalSec);
  const fade = 1.5 * SAMPLE_RATE;
  const pcm = Buffer.alloc(len * 2);
  let duck = 1;
  for (let i = 0; i < len; i++) {
    const target = speaking[i] ? 0.08 : 0.16;
    duck += (target - duck) * 0.0004;
    const edge = Math.min(1, i / fade, (len - i) / fade);
    const v = voice[i] * voiceGain + music[i] * duck * edge;
    pcm.writeInt16LE(Math.round(Math.max(-1, Math.min(1, v)) * 32767), i * 2);
  }

  const header = Buffer.alloc(44);
  header.write("RIFF", 0);
  header.writeUInt32LE(36 + pcm.length, 4);
  header.write("WAVE", 8);
  header.write("fmt ", 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20);
  header.writeUInt16LE(1, 22);
  header.writeUInt32LE(SAMPLE_RATE, 24);
  header.writeUInt32LE(SAMPLE_RATE * 2, 28);
  header.writeUInt16LE(2, 32);
  header.writeUInt16LE(16, 34);
  header.write("data", 36);
  header.writeUInt32LE(pcm.length, 40);
  fs.writeFileSync(outWav, Buffer.concat([header, pcm]));
}
