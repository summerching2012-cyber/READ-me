import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { MsEdgeTTS, OUTPUT_FORMAT } from "msedge-tts";

export const VOICE = { name: "zh-CN-XiaoyiNeural", rate: "-12%", pitch: "+0Hz" };

const TICKS_PER_SECOND = 1e7;
const PUNCT = /[，。！？、：；“”‘’（）…—,.!?:;"'()\s]/;

export const isPunct = (ch) => PUNCT.test(ch);

function cacheKey(text) {
  return crypto
    .createHash("sha1")
    .update(JSON.stringify([VOICE, text]))
    .digest("hex")
    .slice(0, 16);
}

async function synthesizeOnce(text, dir) {
  const tts = new MsEdgeTTS();
  try {
    await tts.setMetadata(VOICE.name, OUTPUT_FORMAT.AUDIO_24KHZ_96KBITRATE_MONO_MP3, {
      wordBoundaryEnabled: true,
    });
    return await tts.toFile(dir, text, { rate: VOICE.rate, pitch: VOICE.pitch });
  } finally {
    tts.close();
  }
}

/**
 * Maps each TTS word boundary onto character positions of `text`.
 * Throws unless every non-punctuation character is covered, so the subtitle
 * can never show a character that the voice does not say (or vice versa).
 */
export function alignWords(text, boundaries) {
  const words = [];
  let cursor = 0;
  for (const b of boundaries) {
    const w = b.text;
    const idx = text.indexOf(w, cursor);
    if (idx < 0) throw new Error(`TTS word "${w}" not found in "${text}" after ${cursor}`);
    const skipped = text.slice(cursor, idx);
    if ([...skipped].some((ch) => !isPunct(ch))) {
      throw new Error(`Characters "${skipped}" in "${text}" have no spoken word boundary`);
    }
    words.push({ text: w, charStart: idx, charEnd: idx + w.length, start: b.start, end: b.end });
    cursor = idx + w.length;
  }
  const rest = text.slice(cursor);
  if ([...rest].some((ch) => !isPunct(ch))) {
    throw new Error(`Trailing characters "${rest}" in "${text}" have no spoken word boundary`);
  }
  return words;
}

export async function synthesize(text, cacheDir) {
  const key = cacheKey(text);
  const dir = path.join(cacheDir, key);
  const mp3 = path.join(dir, "audio.mp3");
  const meta = path.join(dir, "words.json");

  if (!fs.existsSync(meta)) {
    fs.mkdirSync(dir, { recursive: true });
    let lastErr;
    for (let attempt = 0; attempt < 5; attempt++) {
      try {
        const res = await synthesizeOnce(text, dir);
        const raw = JSON.parse(fs.readFileSync(res.metadataFilePath, "utf8"));
        const boundaries = raw.Metadata.filter((m) => m.Type === "WordBoundary").map((m) => ({
          text: m.Data.text.Text,
          start: m.Data.Offset / TICKS_PER_SECOND,
          end: (m.Data.Offset + m.Data.Duration) / TICKS_PER_SECOND,
        }));
        if (!boundaries.length) throw new Error("no word boundaries returned");
        if (res.audioFilePath !== mp3) fs.renameSync(res.audioFilePath, mp3);
        fs.writeFileSync(meta, JSON.stringify({ text, voice: VOICE, boundaries }, null, 2));
        lastErr = null;
        break;
      } catch (err) {
        lastErr = err;
        await new Promise((r) => setTimeout(r, 1000 * 2 ** attempt));
      }
    }
    if (lastErr) throw lastErr;
  }

  const { boundaries } = JSON.parse(fs.readFileSync(meta, "utf8"));
  return { mp3, words: alignWords(text, boundaries) };
}
