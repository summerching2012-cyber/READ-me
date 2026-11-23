import { W, H, FONT, clamp, fillRR } from "./common.js";
import { isPunct } from "../tts.js";

const SIZE = 48;
const MAX_WIDTH = 1080;
const TRAILING = /[，。、：；,.:;]+$/;

export const displayText = (text) => text.replace(TRAILING, "");

/** Per-character highlight progress (0..1) of `line` at absolute time `T`. */
export function charProgress(line, T) {
  const chars = [...displayText(line.text)];
  const prog = new Array(chars.length).fill(0);
  for (const w of line.words) {
    const n = w.charEnd - w.charStart;
    const p = clamp((T - (line.start + w.start)) / Math.max(0.05, w.end - w.start));
    for (let k = 0; k < n && w.charStart + k < chars.length; k++) prog[w.charStart + k] = clamp(p * n - k);
  }
  for (let i = 0; i < chars.length; i++) if (isPunct(chars[i])) prog[i] = i > 0 ? prog[i - 1] : 0;
  return { chars, prog };
}

function splitRows(ctx, chars) {
  const widths = chars.map((c) => ctx.measureText(c).width);
  const total = widths.reduce((a, b) => a + b, 0);
  if (total <= MAX_WIDTH) return { rows: [[0, chars.length]], widths };
  let best = Math.floor(chars.length / 2);
  let bestScore = Infinity;
  let acc = 0;
  for (let i = 0; i < chars.length - 1; i++) {
    acc += widths[i];
    const score = Math.abs(acc - total / 2) - (isPunct(chars[i]) ? 200 : 0);
    if (score < bestScore) {
      bestScore = score;
      best = i + 1;
    }
  }
  return { rows: [[0, best], [best, chars.length]], widths };
}

export function drawSubtitle(ctx, line, T, { accent, ink = "#3E2723" }) {
  if (!line || T < line.subStart || T > line.subEnd) return;
  const fade = clamp(Math.min((T - line.subStart) / 0.12, (line.subEnd - T) / 0.12));
  const { chars, prog } = charProgress(line, T);
  ctx.save();
  ctx.font = `${SIZE}px ${FONT}`;
  ctx.textBaseline = "middle";
  ctx.textAlign = "left";
  const { rows, widths } = splitRows(ctx, chars);
  const rowH = SIZE * 1.3;
  const boxH = rows.length * rowH + 30;
  const rowW = rows.map(([a, b]) => widths.slice(a, b).reduce((x, y) => x + y, 0));
  const boxW = Math.max(...rowW) + 70;
  const boxY = H - boxH - 18;
  ctx.globalAlpha = fade;
  fillRR(ctx, (W - boxW) / 2, boxY, boxW, boxH, 26, "rgba(255,255,255,0.92)", accent, 5);

  rows.forEach(([a, b], r) => {
    let x = (W - rowW[r]) / 2;
    const y = boxY + 15 + rowH * (r + 0.5);
    for (let i = a; i < b; i++) {
      const c = chars[i];
      ctx.fillStyle = ink;
      ctx.fillText(c, x, y);
      if (prog[i] > 0) {
        ctx.save();
        ctx.beginPath();
        ctx.rect(x - 1, y - SIZE, (widths[i] + 2) * prog[i], SIZE * 2);
        ctx.clip();
        ctx.lineWidth = 3;
        ctx.strokeStyle = accent;
        ctx.strokeText(c, x, y);
        ctx.fillStyle = accent;
        ctx.fillText(c, x, y);
        ctx.restore();
      }
      x += widths[i];
    }
  });
  ctx.restore();
}
