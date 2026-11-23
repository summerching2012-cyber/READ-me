export const W = 1280;
export const H = 720;
export const FONT = '"ZCOOL KuaiLe", "WenQuanYi Micro Hei", sans-serif';

export const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
export const lerp = (a, b, k) => a + (b - a) * k;
export const easeOut = (k) => 1 - (1 - clamp(k)) ** 3;
export const easeInOut = (k) => {
  k = clamp(k);
  return k < 0.5 ? 4 * k * k * k : 1 - (-2 * k + 2) ** 3 / 2;
};
export const pop = (k) => {
  k = clamp(k);
  const c = 1.70158 * 1.4;
  return 1 + (c + 1) * (k - 1) ** 3 + c * (k - 1) ** 2;
};

export function rrect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
}

export function fillRR(ctx, x, y, w, h, r, fill, stroke, lw = 4) {
  rrect(ctx, x, y, w, h, r);
  if (fill) {
    ctx.fillStyle = fill;
    ctx.fill();
  }
  if (stroke) {
    ctx.lineWidth = lw;
    ctx.strokeStyle = stroke;
    ctx.stroke();
  }
}

export function circle(ctx, x, y, r, fill, stroke, lw = 4) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  if (fill) {
    ctx.fillStyle = fill;
    ctx.fill();
  }
  if (stroke) {
    ctx.lineWidth = lw;
    ctx.strokeStyle = stroke;
    ctx.stroke();
  }
}

export function label(ctx, text, x, y, size, color = "#fff", outline = "#3a2a1a", align = "center") {
  ctx.font = `${size}px ${FONT}`;
  ctx.textAlign = align;
  ctx.textBaseline = "middle";
  ctx.lineJoin = "round";
  ctx.lineWidth = size * 0.18;
  ctx.strokeStyle = outline;
  ctx.strokeText(text, x, y);
  ctx.fillStyle = color;
  ctx.fillText(text, x, y);
}

export function sky(ctx, top = "#8FD3FF", bottom = "#DFF4FF") {
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, top);
  g.addColorStop(1, bottom);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
}

export function cloud(ctx, x, y, s = 1, color = "#fff") {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(0, 0, 34, 0, Math.PI * 2);
  ctx.arc(38, -16, 42, 0, Math.PI * 2);
  ctx.arc(82, 0, 32, 0, Math.PI * 2);
  ctx.arc(40, 14, 34, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

export function drifting(ctx, t, items) {
  for (const [x, y, s, speed] of items) {
    const xx = ((x + t * speed) % (W + 300)) - 150;
    cloud(ctx, xx, y, s);
  }
}

export function face(ctx, x, y, s, t, { blinkOffset = 0, mouth = "smile", cheek = "#FF8FA3" } = {}) {
  const blink = (t + blinkOffset) % 3.2 < 0.12;
  ctx.fillStyle = "#2B2118";
  for (const dx of [-1, 1]) {
    if (blink) {
      ctx.fillRect(x + dx * 14 * s - 7 * s, y - 2 * s, 14 * s, 4 * s);
    } else {
      circle(ctx, x + dx * 14 * s, y, 6.5 * s, "#2B2118");
      circle(ctx, x + dx * 14 * s + 2 * s, y - 2.5 * s, 2.2 * s, "#fff");
    }
  }
  ctx.globalAlpha = 0.55;
  circle(ctx, x - 25 * s, y + 12 * s, 7 * s, cheek);
  circle(ctx, x + 25 * s, y + 12 * s, 7 * s, cheek);
  ctx.globalAlpha = 1;
  ctx.beginPath();
  ctx.lineCap = "round";
  ctx.lineWidth = 4 * s;
  ctx.strokeStyle = "#2B2118";
  if (mouth === "open") {
    ctx.arc(x, y + 12 * s, 8 * s, 0, Math.PI);
    ctx.fillStyle = "#C2413B";
    ctx.fill();
    ctx.stroke();
  } else if (mouth === "o") {
    ctx.arc(x, y + 15 * s, 5 * s, 0, Math.PI * 2);
    ctx.fillStyle = "#C2413B";
    ctx.fill();
    ctx.stroke();
  } else {
    ctx.arc(x, y + 9 * s, 9 * s, 0.15 * Math.PI, 0.85 * Math.PI);
    ctx.stroke();
  }
}

/** The electricity guide: a smiling yellow lightning bolt. */
export function spark(ctx, x, y, s, t, opts = {}) {
  const bob = Math.sin(t * 4) * 8 * s;
  ctx.save();
  ctx.translate(x, y + bob);
  ctx.rotate(Math.sin(t * 2.3) * 0.06);
  ctx.scale(s, s);
  ctx.shadowColor = "rgba(255,200,0,0.8)";
  ctx.shadowBlur = 30;
  ctx.beginPath();
  ctx.moveTo(10, -95);
  ctx.lineTo(-52, 8);
  ctx.lineTo(-6, 8);
  ctx.lineTo(-24, 95);
  ctx.lineTo(54, -20);
  ctx.lineTo(8, -20);
  ctx.lineTo(34, -95);
  ctx.closePath();
  ctx.fillStyle = "#FFD43B";
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.lineJoin = "round";
  ctx.lineWidth = 6;
  ctx.strokeStyle = "#E8A200";
  ctx.stroke();
  face(ctx, -2, -12, 0.8, t, { mouth: opts.talking && Math.sin(t * 18) > 0 ? "open" : "smile" });
  ctx.restore();
}

/** The water guide: a smiling blue drop. */
export function drop(ctx, x, y, s, t, opts = {}) {
  const bob = Math.sin(t * 4) * 8 * s;
  const squish = 1 + Math.sin(t * 8) * 0.03;
  ctx.save();
  ctx.translate(x, y + bob);
  ctx.scale(s * squish, s / squish);
  const g = ctx.createRadialGradient(-20, 0, 10, 0, 20, 90);
  g.addColorStop(0, "#9BE0FF");
  g.addColorStop(1, "#2C9BEF");
  ctx.beginPath();
  ctx.moveTo(0, -95);
  ctx.bezierCurveTo(30, -50, 70, -10, 70, 30);
  ctx.bezierCurveTo(70, 75, 35, 100, 0, 100);
  ctx.bezierCurveTo(-35, 100, -70, 75, -70, 30);
  ctx.bezierCurveTo(-70, -10, -30, -50, 0, -95);
  ctx.fillStyle = g;
  ctx.fill();
  ctx.lineWidth = 6;
  ctx.strokeStyle = "#1B78C2";
  ctx.stroke();
  ctx.globalAlpha = 0.7;
  ctx.beginPath();
  ctx.ellipse(-34, 10, 9, 20, 0.3, 0, Math.PI * 2);
  ctx.fillStyle = "#fff";
  ctx.fill();
  ctx.globalAlpha = 1;
  face(ctx, 0, 35, 0.9, t, { mouth: opts.talking && Math.sin(t * 18) > 0 ? "open" : "smile" });
  ctx.restore();
}

export function sun(ctx, x, y, r, t, withFace = true) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(t * 0.4);
  ctx.fillStyle = "#FFB627";
  for (let i = 0; i < 12; i++) {
    ctx.rotate(Math.PI / 6);
    ctx.beginPath();
    ctx.moveTo(r * 1.1, -10);
    ctx.lineTo(r * 1.5 + Math.sin(t * 3 + i) * 6, 0);
    ctx.lineTo(r * 1.1, 10);
    ctx.fill();
  }
  ctx.restore();
  const g = ctx.createRadialGradient(x - r * 0.3, y - r * 0.3, 5, x, y, r);
  g.addColorStop(0, "#FFF3A0");
  g.addColorStop(1, "#FFC93C");
  circle(ctx, x, y, r, g, "#F5A300", 5);
  if (withFace) face(ctx, x, y, r / 55, t, { blinkOffset: 1.3 });
}

export function hills(ctx, y, colors = ["#8BD17C", "#6CBF5E"], t = 0) {
  colors.forEach((c, i) => {
    ctx.fillStyle = c;
    ctx.beginPath();
    ctx.moveTo(0, H);
    for (let x = 0; x <= W; x += 20) {
      const yy = y + i * 40 + Math.sin(x / (180 - i * 40) + i * 2) * (30 - i * 8);
      ctx.lineTo(x, yy);
    }
    ctx.lineTo(W, H);
    ctx.closePath();
    ctx.fill();
  });
}

export function tree(ctx, x, y, s = 1) {
  ctx.fillStyle = "#9C6B3E";
  ctx.fillRect(x - 8 * s, y - 40 * s, 16 * s, 40 * s);
  circle(ctx, x, y - 70 * s, 36 * s, "#4CAF50");
  circle(ctx, x - 22 * s, y - 52 * s, 24 * s, "#5CBF60");
  circle(ctx, x + 22 * s, y - 52 * s, 24 * s, "#43A047");
}

export function house(ctx, x, y, s = 1, { wall = "#FFE3B3", roof = "#E85D4A", lit = 0 } = {}) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  fillRR(ctx, -70, -100, 140, 100, 6, wall, "#7A4E2D", 4);
  ctx.beginPath();
  ctx.moveTo(-90, -95);
  ctx.lineTo(0, -170);
  ctx.lineTo(90, -95);
  ctx.closePath();
  ctx.fillStyle = roof;
  ctx.fill();
  ctx.lineWidth = 4;
  ctx.strokeStyle = "#7A4E2D";
  ctx.stroke();
  fillRR(ctx, -15, -55, 30, 55, 4, "#B5703A", "#7A4E2D", 3);
  for (const wx of [-50, 22]) {
    const c = lit > 0 ? `rgba(255, 230, 110, ${0.4 + lit * 0.6})` : "#BFE6FF";
    fillRR(ctx, wx, -80, 28, 26, 3, c, "#7A4E2D", 3);
    if (lit > 0) {
      ctx.save();
      ctx.globalAlpha = lit * 0.35;
      circle(ctx, wx + 14, -67, 30, "#FFE66E");
      ctx.restore();
    }
  }
  ctx.restore();
}

export function sparkle(ctx, x, y, r, color = "#fff") {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = color;
  ctx.beginPath();
  for (let i = 0; i < 8; i++) {
    const rr = i % 2 === 0 ? r : r * 0.3;
    const a = (i * Math.PI) / 4;
    ctx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr);
  }
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

export function arrow(ctx, x1, y1, x2, y2, color = "#FF7A45", lw = 10) {
  const a = Math.atan2(y2 - y1, x2 - x1);
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = lw;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2 - Math.cos(a) * lw * 1.5, y2 - Math.sin(a) * lw * 1.5);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x2, y2);
  ctx.lineTo(x2 - Math.cos(a - 0.5) * lw * 2.6, y2 - Math.sin(a - 0.5) * lw * 2.6);
  ctx.lineTo(x2 - Math.cos(a + 0.5) * lw * 2.6, y2 - Math.sin(a + 0.5) * lw * 2.6);
  ctx.closePath();
  ctx.fill();
}

/** Point at distance `d` along a polyline. */
export function along(points, d) {
  for (let i = 1; i < points.length; i++) {
    const [x1, y1] = points[i - 1];
    const [x2, y2] = points[i];
    const len = Math.hypot(x2 - x1, y2 - y1);
    if (d <= len) return [x1 + ((x2 - x1) * d) / len, y1 + ((y2 - y1) * d) / len];
    d -= len;
  }
  return points[points.length - 1];
}

export function polyLength(points) {
  let L = 0;
  for (let i = 1; i < points.length; i++)
    L += Math.hypot(points[i][0] - points[i - 1][0], points[i][1] - points[i - 1][1]);
  return L;
}

export function polyline(ctx, points, color, lw) {
  ctx.beginPath();
  ctx.moveTo(...points[0]);
  for (const p of points.slice(1)) ctx.lineTo(...p);
  ctx.strokeStyle = color;
  ctx.lineWidth = lw;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  ctx.stroke();
}

/** Glowing dots travelling along a path, used for both electricity and water flow. */
export function flow(ctx, points, t, { speed = 160, gap = 60, r = 7, color = "#FFE14D", glow = "rgba(255,220,0,0.9)", upto = 1 } = {}) {
  const L = polyLength(points) * upto;
  ctx.save();
  ctx.shadowColor = glow;
  ctx.shadowBlur = 16;
  for (let d = (t * speed) % gap; d < L; d += gap) {
    const [x, y] = along(points, d);
    circle(ctx, x, y, r, color);
  }
  ctx.restore();
}

export function noSign(ctx, x, y, r, k = 1) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(k, k);
  ctx.lineWidth = r * 0.2;
  ctx.strokeStyle = "#E53935";
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(-r * 0.7, -r * 0.7);
  ctx.lineTo(r * 0.7, r * 0.7);
  ctx.stroke();
  ctx.restore();
}

export function check(ctx, x, y, r, k = 1) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(k, k);
  circle(ctx, 0, 0, r, "#43A047");
  ctx.lineWidth = r * 0.22;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.strokeStyle = "#fff";
  ctx.beginPath();
  ctx.moveTo(-r * 0.45, 0);
  ctx.lineTo(-r * 0.1, r * 0.35);
  ctx.lineTo(r * 0.5, -r * 0.35);
  ctx.stroke();
  ctx.restore();
}

export function person(ctx, x, y, s, t, { shirt = "#FF7A9C", hair = "#3B2A20", adult = false, wave = 0 } = {}) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  const h = adult ? 1.35 : 1;
  ctx.lineCap = "round";
  ctx.strokeStyle = "#F2C29B";
  ctx.lineWidth = 14;
  ctx.beginPath();
  ctx.moveTo(-14, -10);
  ctx.lineTo(-16, 40 * h);
  ctx.moveTo(14, -10);
  ctx.lineTo(16, 40 * h);
  ctx.stroke();
  fillRR(ctx, -32, -70 * h, 64, 70 * h, 18, shirt);
  ctx.strokeStyle = "#F2C29B";
  ctx.beginPath();
  ctx.moveTo(-30, -55 * h);
  ctx.lineTo(-48, -10 * h);
  ctx.moveTo(30, -55 * h);
  const wa = Math.sin(t * 8) * wave;
  ctx.lineTo(48 + wa * 8, (-10 - wave * 70) * h);
  ctx.stroke();
  circle(ctx, 0, -70 * h - 36, 38, "#FAD3B0");
  ctx.fillStyle = hair;
  ctx.beginPath();
  ctx.arc(0, -70 * h - 44, 40, Math.PI, 0);
  ctx.fill();
  face(ctx, 0, -70 * h - 30, 0.75, t, { blinkOffset: x / 100 });
  ctx.restore();
}

/** Shared title card with the guide character and the video title. */
export function titleCard(ctx, s, { title, guide, bg1, bg2, ring }) {
  sky(ctx, bg1, bg2);
  ctx.save();
  ctx.globalAlpha = 0.25;
  for (let i = 0; i < 14; i++) {
    const a = (i / 14) * Math.PI * 2 + s.t * 0.15;
    ctx.fillStyle = i % 2 ? ring : "#fff";
    ctx.beginPath();
    ctx.moveTo(W / 2, 300);
    ctx.arc(W / 2, 300, 1200, a, a + Math.PI / 14);
    ctx.fill();
  }
  ctx.restore();
  drifting(ctx, s.t, [
    [100, 90, 1, 20],
    [700, 60, 0.8, 14],
    [1000, 150, 1.1, 18],
  ]);
  const k = pop(s.t / 0.8);
  guide(ctx, W / 2, 230, 1.25 * k, s.t, { talking: s.speaking });
  const k2 = pop((s.t - 0.3) / 0.8);
  ctx.save();
  ctx.translate(W / 2, 445);
  ctx.scale(k2, k2);
  label(ctx, title, 0, 0, 78, "#fff", "#2B4A6F");
  ctx.restore();
}

export function warning(ctx, x, y, k) {
  if (k <= 0) return;
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(k, k);
  ctx.beginPath();
  ctx.moveTo(0, -80);
  ctx.lineTo(80, 60);
  ctx.lineTo(-80, 60);
  ctx.closePath();
  ctx.fillStyle = "#FFD600";
  ctx.fill();
  ctx.lineJoin = "round";
  ctx.lineWidth = 12;
  ctx.strokeStyle = "#E65100";
  ctx.stroke();
  label(ctx, "！", 0, 10, 90, "#E65100", "#FFD600");
  ctx.restore();
}
