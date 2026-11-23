import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { createCanvas, GlobalFonts } from "@napi-rs/canvas";

import electricity from "./scripts/electricity.js";
import water from "./scripts/water.js";
import { scenes as electricityScenes } from "./draw/electricity.js";
import { scenes as waterScenes } from "./draw/water.js";
import { drawSubtitle, displayText } from "./draw/subtitle.js";
import { W, H } from "./draw/common.js";
import { synthesize } from "./tts.js";
import { decodeToFloat, mixTrack, SAMPLE_RATE } from "./audio.js";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CACHE = path.join(ROOT, "build", "tts-cache");
const OUT = path.join(ROOT, "output");
const FPS = 30;

const LEAD_IN = 0.6;
const PAUSE_AFTER_LINE = 0.45;
const PAUSE_AFTER_SCENE = 0.8;
const TAIL = 1.8;
const CROSSFADE = 0.4;

GlobalFonts.registerFromPath(path.join(ROOT, "assets/fonts/ZCOOLKuaiLe-Regular.ttf"), "ZCOOL KuaiLe");

const VIDEOS = {
  electricity: { script: electricity, draw: electricityScenes, accent: "#F57C00" },
  water: { script: water, draw: waterScenes, accent: "#0277BD" },
};

/**
 * Lays every narrated line on one clock. A line's subtitle is visible only
 * while its own clip is speaking, and per-word timings come from the TTS
 * engine itself, so captions and voice share a single source of truth.
 */
async function buildTimeline(script) {
  let t = LEAD_IN;
  const scenes = [];
  const lines = [];
  const clips = [];
  for (const sc of script.scenes) {
    const scene = { id: sc.id, start: t, lines: [] };
    for (const text of sc.lines) {
      const { mp3, words } = await synthesize(text, CACHE);
      const samples = decodeToFloat(mp3);
      const clipDur = samples.length / SAMPLE_RATE;
      const first = words[0];
      const last = words[words.length - 1];
      const line = {
        text,
        start: t,
        clipDur,
        words,
        scene: scenes.length,
        subStart: t + Math.max(0, first.start - 0.15),
        subEnd: t + last.end + 0.4,
      };
      clips.push({ samples, at: t });
      scene.lines.push(line);
      lines.push(line);
      t += Math.max(last.end + PAUSE_AFTER_LINE, 0.5);
    }
    t += PAUSE_AFTER_SCENE;
    scene.end = t;
    scenes.push(scene);
  }
  const lastClipEnd = Math.max(...clips.map((c) => c.at + c.samples.length / SAMPLE_RATE));
  const total = Math.max(t, lastClipEnd) + TAIL;
  scenes[scenes.length - 1].end = total;
  for (let i = 0; i < lines.length - 1; i++) {
    lines[i].subEnd = Math.min(lines[i].subEnd, lines[i + 1].subStart - 0.02);
  }
  return { scenes, lines, clips, total };
}

const srtTime = (sec) => {
  const ms = Math.round(sec * 1000);
  const p = (n, w = 2) => String(n).padStart(w, "0");
  return `${p(Math.floor(ms / 3600000))}:${p(Math.floor(ms / 60000) % 60)}:${p(Math.floor(ms / 1000) % 60)},${p(ms % 1000, 3)}`;
};

function writeSrt(lines, file) {
  const body = lines
    .map((l, i) => `${i + 1}\n${srtTime(l.subStart)} --> ${srtTime(l.subEnd)}\n${displayText(l.text)}\n`)
    .join("\n");
  fs.writeFileSync(file, body);
}

function sceneState(scene, T) {
  const t = T - scene.start;
  const cue = scene.lines.map((l) => l.start - scene.start);
  let line = -1;
  for (let i = 0; i < cue.length; i++) if (t >= cue[i]) line = i;
  const active = scene.lines[line];
  const speaking =
    !!active && active.words.some((w) => T >= active.start + w.start && T <= active.start + w.end);
  return {
    t,
    dur: scene.end - scene.start,
    cue,
    line,
    speaking,
    at(i, word) {
      const l = scene.lines[i];
      if (!l) throw new Error(`scene ${scene.id} has no line ${i}`);
      const idx = l.text.indexOf(word);
      const w = l.words.find((x) => idx >= x.charStart && idx < x.charEnd);
      if (idx < 0 || !w) throw new Error(`"${word}" not spoken in line "${l.text}"`);
      return l.start + w.start - scene.start;
    },
  };
}

function makeRenderer(video, timeline) {
  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext("2d");
  const prevCanvas = createCanvas(W, H);
  const prevCtx = prevCanvas.getContext("2d");
  const { scenes, lines } = timeline;

  const drawScene = (c, scene, T) => {
    const fn = video.draw[scene.id];
    if (!fn) throw new Error(`no drawing for scene "${scene.id}"`);
    c.save();
    fn(c, sceneState(scene, T));
    c.restore();
  };

  return (T) => {
    let si = scenes.findIndex((s) => T >= s.start && T < s.end);
    if (si < 0) si = T < scenes[0].start ? 0 : scenes.length - 1;
    drawScene(ctx, scenes[si], T);
    const intoScene = T - scenes[si].start;
    if (si > 0 && intoScene < CROSSFADE) {
      drawScene(prevCtx, scenes[si - 1], T);
      ctx.save();
      ctx.globalAlpha = 1 - intoScene / CROSSFADE;
      ctx.drawImage(prevCanvas, 0, 0);
      ctx.restore();
    }
    const line = lines.find((l) => T >= l.subStart && T <= l.subEnd);
    drawSubtitle(ctx, line, T, { accent: video.accent });
    return canvas;
  };
}

async function renderVideo(name, { stills = false } = {}) {
  const video = VIDEOS[name];
  if (!video) throw new Error(`unknown video "${name}"`);
  fs.mkdirSync(OUT, { recursive: true });
  console.log(`[${name}] synthesizing narration...`);
  const timeline = await buildTimeline(video.script);
  console.log(`[${name}] ${timeline.lines.length} lines, ${timeline.total.toFixed(1)}s`);
  const render = makeRenderer(video, timeline);

  if (stills) {
    const dir = path.join(ROOT, "build", "stills", name);
    fs.mkdirSync(dir, { recursive: true });
    timeline.lines.forEach((l, i) => {
      const w = l.words;
      const T = l.start + (w[0].start + w[w.length - 1].end) / 2;
      fs.writeFileSync(path.join(dir, `${String(i).padStart(2, "0")}.png`), render(T).toBuffer("image/png"));
    });
    console.log(`[${name}] stills written to ${dir}`);
    return;
  }

  const wav = path.join(ROOT, "build", `${name}.wav`);
  mixTrack(timeline.clips, timeline.total, wav);
  writeSrt(timeline.lines, path.join(OUT, `${name}.srt`));
  fs.writeFileSync(
    path.join(ROOT, "build", `${name}.timeline.json`),
    JSON.stringify(timeline.lines.map(({ text, start, subStart, subEnd, words }) => ({ text, start, subStart, subEnd, words })), null, 2),
  );

  const mp4 = path.join(OUT, `${name}.mp4`);
  const ff = spawn(
    "ffmpeg",
    [
      "-y", "-v", "error",
      "-f", "rawvideo", "-pix_fmt", "rgba", "-s", `${W}x${H}`, "-r", String(FPS), "-i", "pipe:0",
      "-i", wav,
      "-c:v", "libx264", "-preset", "medium", "-crf", "22", "-pix_fmt", "yuv420p",
      "-c:a", "aac", "-b:a", "160k",
      "-shortest", "-movflags", "+faststart",
      mp4,
    ],
    { stdio: ["pipe", "inherit", "inherit"] },
  );
  const done = new Promise((res, rej) => ff.on("close", (code) => (code === 0 ? res() : rej(new Error(`ffmpeg exited ${code}`)))));

  const frames = Math.ceil(timeline.total * FPS);
  for (let f = 0; f < frames; f++) {
    const buf = Buffer.from(render(f / FPS).data());
    if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once("drain", r));
    if (f % (FPS * 10) === 0) process.stdout.write(`\r[${name}] frame ${f}/${frames}`);
  }
  ff.stdin.end();
  await done;
  console.log(`\r[${name}] wrote ${mp4}            `);
}

const args = process.argv.slice(2);
const stills = args.includes("--stills");
const names = args.filter((a) => !a.startsWith("--"));
for (const n of names.length ? names : Object.keys(VIDEOS)) await renderVideo(n, { stills });
