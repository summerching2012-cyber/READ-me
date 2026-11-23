import {
  W, H, clamp, lerp, easeOut, easeInOut, pop, fillRR, circle, label, sky, cloud, hills, tree,
  house, drop, sparkle, arrow, polyline, flow, check, titleCard, face, warning,
} from "./common.js";

const WATER = "#4FC3F7";

const waterFlow = (ctx, pts, t, opts = {}) =>
  flow(ctx, pts, t, { color: "#E1F5FE", glow: "rgba(79,195,247,0.9)", r: 7, gap: 34, speed: 140, ...opts });

function pipe(ctx, pts, lw = 34, color = "#90A4AE") {
  polyline(ctx, pts, "#607D8B", lw + 8);
  polyline(ctx, pts, color, lw);
  polyline(ctx, pts, "rgba(255,255,255,0.35)", lw * 0.25);
}

function waterPath(ctx, pts, lw, k = 1) {
  if (k <= 0) return;
  ctx.save();
  ctx.globalAlpha = k;
  polyline(ctx, pts, WATER, lw);
  ctx.restore();
}

function tap(ctx, x, y, s, t, flowK = 0, handle = 0) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  if (flowK > 0) {
    const g = ctx.createLinearGradient(0, 30, 0, 260);
    g.addColorStop(0, "rgba(129,212,250,0.95)");
    g.addColorStop(1, "rgba(79,195,247,0.6)");
    ctx.fillStyle = g;
    const len = 230 * flowK;
    ctx.beginPath();
    ctx.moveTo(90, 40);
    ctx.lineTo(120, 40);
    ctx.lineTo(118 + Math.sin(t * 20) * 2, 40 + len);
    ctx.lineTo(92 + Math.sin(t * 20 + 1) * 2, 40 + len);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.8)";
    ctx.lineWidth = 3;
    for (let i = 0; i < 3; i++) {
      const yy = 40 + ((t * 260 + i * 70) % Math.max(1, len));
      ctx.beginPath();
      ctx.moveTo(100, yy);
      ctx.lineTo(100, yy + 20);
      ctx.stroke();
    }
  }
  fillRR(ctx, -30, -20, 60, 50, 10, "#CFD8DC", "#78909C", 4);
  fillRR(ctx, 0, -10, 130, 34, 17, "#CFD8DC", "#78909C", 4);
  fillRR(ctx, 88, 10, 34, 34, 8, "#B0BEC5", "#78909C", 4);
  ctx.save();
  ctx.translate(0, -30);
  ctx.rotate(handle * 0.9);
  fillRR(ctx, -10, -30, 20, 30, 6, "#B0BEC5", "#78909C", 3);
  fillRR(ctx, -45, -42, 90, 20, 10, "#4FC3F7", "#0277BD", 4);
  ctx.restore();
  ctx.restore();
}

function sink(ctx, x, y, s) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  ctx.beginPath();
  ctx.moveTo(-200, 0);
  ctx.lineTo(200, 0);
  ctx.quadraticCurveTo(190, 130, 0, 140);
  ctx.quadraticCurveTo(-190, 130, -200, 0);
  ctx.fillStyle = "#FAFAFA";
  ctx.fill();
  ctx.lineWidth = 6;
  ctx.strokeStyle = "#B0BEC5";
  ctx.stroke();
  fillRR(ctx, -220, -16, 440, 22, 11, "#ECEFF1", "#B0BEC5", 4);
  fillRR(ctx, -30, 140, 60, 180, 6, "#ECEFF1", "#B0BEC5", 4);
  ctx.restore();
}

function bathroom(ctx) {
  ctx.fillStyle = "#E0F7FA";
  ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = "#B2EBF2";
  ctx.lineWidth = 3;
  for (let x = 0; x < W; x += 80) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 520);
    ctx.stroke();
  }
  for (let y = 0; y < 520; y += 80) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(W, y);
    ctx.stroke();
  }
  ctx.fillStyle = "#80DEEA";
  ctx.fillRect(0, 520, W, 200);
}

function bubbles(ctx, x, y, t, n = 10, spread = 120) {
  for (let i = 0; i < n; i++) {
    const p = (t * 0.5 + i / n) % 1;
    const bx = x + Math.sin(i * 2.3 + t) * spread * 0.6;
    const by = y - p * spread * 1.4;
    ctx.globalAlpha = 1 - p;
    circle(ctx, bx, by, 8 + (i % 3) * 5, "rgba(255,255,255,0.6)", "#B3E5FC", 2);
  }
  ctx.globalAlpha = 1;
}

function iconBubble(ctx, x, y, k, draw) {
  if (k <= 0) return;
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(pop(k), pop(k));
  circle(ctx, 0, 0, 62, "#fff", "#4FC3F7", 5);
  draw();
  ctx.restore();
}

const icons = {
  hands(ctx) {
    fillRR(ctx, -32, -28, 26, 56, 13, "#FAD3B0", "#D9A07A", 3);
    fillRR(ctx, 6, -28, 26, 56, 13, "#FAD3B0", "#D9A07A", 3);
    circle(ctx, -24, -36, 9, "rgba(255,255,255,0.9)", "#81D4FA", 2);
    circle(ctx, 22, -40, 7, "rgba(255,255,255,0.9)", "#81D4FA", 2);
  },
  brush(ctx) {
    ctx.save();
    ctx.rotate(-0.6);
    fillRR(ctx, -45, -7, 90, 14, 7, "#F06292");
    fillRR(ctx, 22, -22, 26, 16, 4, "#fff", "#90A4AE", 2);
    ctx.restore();
  },
  bath(ctx) {
    fillRR(ctx, -44, -4, 88, 34, 14, "#fff", "#4FC3F7", 4);
    circle(ctx, -10, -14, 14, "#FFD54F");
    circle(ctx, 2, -28, 10, "#FFD54F");
    ctx.fillStyle = "#FF8F00";
    ctx.beginPath();
    ctx.moveTo(10, -28);
    ctx.lineTo(20, -24);
    ctx.lineTo(10, -21);
    ctx.fill();
  },
  pot(ctx) {
    fillRR(ctx, -38, -10, 76, 44, 10, "#EF5350", "#B71C1C", 3);
    fillRR(ctx, -46, -18, 92, 12, 6, "#E57373", "#B71C1C", 3);
    for (let i = -1; i <= 1; i++) {
      ctx.strokeStyle = "#B0BEC5";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(i * 16, -26);
      ctx.bezierCurveTo(i * 16 - 8, -36, i * 16 + 8, -44, i * 16, -54);
      ctx.stroke();
    }
  },
};

function questionMark(ctx, x, y, k) {
  if (k <= 0) return;
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(pop(k), pop(k));
  circle(ctx, 0, 0, 56, "#fff", "#29B6F6", 6);
  label(ctx, "？", 0, 4, 80, "#0288D1", "#fff");
  ctx.restore();
}

function mountains(ctx) {
  ctx.fillStyle = "#90A4AE";
  ctx.beginPath();
  ctx.moveTo(-50, 420);
  ctx.lineTo(180, 140);
  ctx.lineTo(380, 380);
  ctx.lineTo(520, 200);
  ctx.lineTo(760, 430);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#fff";
  for (const [x, y] of [[180, 140], [520, 200]]) {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x - 48, y + 58);
    ctx.lineTo(x - 18, y + 46);
    ctx.lineTo(x, y + 62);
    ctx.lineTo(x + 20, y + 46);
    ctx.lineTo(x + 50, y + 60);
    ctx.closePath();
    ctx.fill();
  }
}

function rainCloud(ctx, x, y, s, t, rain) {
  cloud(ctx, x, y, s, "#B0BEC5");
  if (rain <= 0) return;
  ctx.save();
  ctx.globalAlpha = rain;
  ctx.strokeStyle = "#4FC3F7";
  ctx.lineWidth = 4;
  ctx.lineCap = "round";
  for (let i = 0; i < 9; i++) {
    const rx = x - 20 * s + i * 14 * s;
    const ry = y + 30 * s + ((t * 300 + i * 37) % 160);
    ctx.beginPath();
    ctx.moveTo(rx, ry);
    ctx.lineTo(rx - 4, ry + 16);
    ctx.stroke();
  }
  ctx.restore();
}

function reservoir(ctx, x, y, w, h, t) {
  const g = ctx.createLinearGradient(0, y, 0, y + h);
  g.addColorStop(0, "#4FC3F7");
  g.addColorStop(1, "#0277BD");
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.moveTo(x, y);
  for (let xx = x; xx <= x + w; xx += 20) ctx.lineTo(xx, y + Math.sin(xx / 30 + t * 2) * 4);
  ctx.lineTo(x + w - 40, y + h);
  ctx.lineTo(x + 40, y + h);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.6)";
  ctx.lineWidth = 3;
  for (let i = 0; i < 4; i++) {
    const wx = x + 50 + ((t * 30 + i * 90) % (w - 100));
    ctx.beginPath();
    ctx.arc(wx, y + 30 + i * 12, 14, 1.1 * Math.PI, 1.9 * Math.PI);
    ctx.stroke();
  }
}

function plantBuilding(ctx, x, y, s) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  fillRR(ctx, -150, -200, 300, 200, 12, "#E1F5FE", "#0277BD", 5);
  for (let i = 0; i < 4; i++) fillRR(ctx, -125 + i * 65, -170, 44, 40, 6, "#B3E5FC", "#0277BD", 3);
  fillRR(ctx, -30, -90, 60, 90, 8, "#4FC3F7", "#0277BD", 4);
  ctx.save();
  ctx.translate(0, -235);
  ctx.scale(0.55, 0.55);
  drop(ctx, 0, 0, 0.6, 0);
  ctx.restore();
  ctx.restore();
}

function germ(ctx, x, y, r, t, i) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(Math.sin(t * 3 + i) * 0.3);
  ctx.fillStyle = ["#81C784", "#AED581", "#BA68C8"][i % 3];
  ctx.beginPath();
  for (let k = 0; k < 16; k++) {
    const a = (k / 16) * Math.PI * 2;
    const rr = r * (k % 2 ? 0.85 : 1.1);
    ctx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr);
  }
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#2B2118";
  circle(ctx, -r * 0.3, -r * 0.1, r * 0.15, "#2B2118");
  circle(ctx, r * 0.3, -r * 0.1, r * 0.15, "#2B2118");
  ctx.lineWidth = r * 0.12;
  ctx.strokeStyle = "#2B2118";
  ctx.beginPath();
  ctx.arc(0, r * 0.45, r * 0.25, 1.15 * Math.PI, 1.85 * Math.PI);
  ctx.stroke();
  ctx.restore();
}

function tank(ctx, x, y, w, h, waterColor, level = 0.85) {
  fillRR(ctx, x - 8, y - 8, w + 16, h + 16, 18, "#ECEFF1", "#78909C", 6);
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, 12);
  ctx.clip();
  ctx.fillStyle = "#F5F5F5";
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = waterColor;
  ctx.fillRect(x, y + h * (1 - level), w, h * level);
  ctx.restore();
}

const rand = (i, salt) => {
  const x = Math.sin(i * 127.1 + salt * 311.7) * 43758.5453;
  return x - Math.floor(x);
};

const mix = (c1, c2, k) => {
  const p = (c) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
  const a = p(c1);
  const b = p(c2);
  return `rgb(${a.map((v, i) => Math.round(lerp(v, b[i], clamp(k)))).join(",")})`;
};

function pump(ctx, x, y, s, t, on) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  fillRR(ctx, -70, -70, 140, 140, 18, "#FFB74D", "#E65100", 6);
  circle(ctx, 0, 0, 46, "#FFF3E0", "#E65100", 5);
  ctx.rotate(t * 8 * on);
  for (let i = 0; i < 4; i++) {
    ctx.rotate(Math.PI / 2);
    fillRR(ctx, -6, -40, 12, 36, 6, "#E65100");
  }
  ctx.restore();
}

function apartment(ctx, x, y, s) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  fillRR(ctx, -170, -460, 340, 460, 10, "#FFE0B2", "#8D6E63", 6);
  for (let f = 0; f < 4; f++) {
    const fy = -460 + f * 115;
    ctx.fillStyle = "#8D6E63";
    ctx.fillRect(-170, fy + 112, 340, 6);
    fillRR(ctx, -140, fy + 25, 70, 60, 6, "#B3E5FC", "#8D6E63", 3);
    fillRR(ctx, 70, fy + 25, 70, 60, 6, "#B3E5FC", "#8D6E63", 3);
  }
  ctx.restore();
}

function kettle(ctx, x, y, s, t, steam) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  fillRR(ctx, -110, 40, 220, 30, 8, "#455A64");
  if (steam > 0) {
    ctx.fillStyle = "#FF7043";
    for (let i = -2; i <= 2; i++) {
      const fh = 18 + Math.sin(t * 12 + i) * 6;
      ctx.beginPath();
      ctx.moveTo(i * 30 - 10, 40);
      ctx.quadraticCurveTo(i * 30, 40 - fh * 2, i * 30 + 10, 40);
      ctx.fill();
    }
  }
  ctx.beginPath();
  ctx.moveTo(-80, 30);
  ctx.quadraticCurveTo(-90, -80, 0, -90);
  ctx.quadraticCurveTo(90, -80, 80, 30);
  ctx.closePath();
  ctx.fillStyle = "#E57373";
  ctx.fill();
  ctx.lineWidth = 5;
  ctx.strokeStyle = "#B71C1C";
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(70, -20);
  ctx.lineTo(130, -60);
  ctx.lineTo(120, -40);
  ctx.lineTo(75, 0);
  ctx.fillStyle = "#E57373";
  ctx.fill();
  ctx.stroke();
  circle(ctx, 0, -95, 12, "#B71C1C");
  face(ctx, 0, -20, 0.8, t, { blinkOffset: 0.5 });
  if (steam > 0) {
    ctx.globalAlpha = steam;
    for (let i = 0; i < 4; i++) {
      const p = (t * 0.6 + i / 4) % 1;
      ctx.globalAlpha = steam * (1 - p);
      cloud(ctx, 120 + Math.sin(p * 6 + i) * 12, -80 - p * 140, 0.35 + p * 0.3);
    }
    ctx.globalAlpha = 1;
  }
  ctx.restore();
}

function cup(ctx, x, y, s) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  ctx.beginPath();
  ctx.moveTo(-40, -50);
  ctx.lineTo(40, -50);
  ctx.lineTo(30, 40);
  ctx.lineTo(-30, 40);
  ctx.closePath();
  ctx.fillStyle = "rgba(225,245,254,0.9)";
  ctx.fill();
  ctx.lineWidth = 4;
  ctx.strokeStyle = "#4FC3F7";
  ctx.stroke();
  ctx.fillStyle = "#81D4FA";
  ctx.beginPath();
  ctx.moveTo(-36, -20);
  ctx.lineTo(36, -20);
  ctx.lineTo(30, 38);
  ctx.lineTo(-30, 38);
  ctx.fill();
  ctx.restore();
}

function confetti(ctx, t, k) {
  const colors = ["#FF6B6B", "#FFD93D", "#6BCB77", "#4D96FF", "#C77DFF"];
  for (let i = 0; i < 60; i++) {
    const x = (i * 97) % W;
    const y = ((t * (80 + (i % 5) * 30) + i * 53) % (H + 40)) - 20;
    ctx.save();
    ctx.globalAlpha = k;
    ctx.translate(x + Math.sin(t * 2 + i) * 20, y);
    ctx.rotate(t * 3 + i);
    ctx.fillStyle = colors[i % colors.length];
    ctx.fillRect(-7, -4, 14, 8);
    ctx.restore();
  }
}

function sign(ctx, text, x, y, k, color = "#29B6F6", dark = "#01579B") {
  if (k <= 0) return;
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(pop(k), pop(k));
  ctx.font = `60px sans-serif`;
  const w = 70 + text.length * 62;
  fillRR(ctx, -w / 2, -45, w, 90, 45, color, "#fff", 6);
  label(ctx, text, 0, 2, 60, "#fff", dark);
  ctx.restore();
}

function ground(ctx, y) {
  ctx.fillStyle = "#8D6E63";
  ctx.fillRect(0, y, W, H - y);
  ctx.fillStyle = "#7CB342";
  ctx.fillRect(0, y - 14, W, 22);
  ctx.fillStyle = "#795548";
  for (let i = 0; i < 40; i++) circle(ctx, (i * 131) % W, y + 40 + ((i * 71) % (H - y - 40)), 5 + (i % 3) * 2, "#795548");
}

export const scenes = {
  title(ctx, s) {
    titleCard(ctx, s, {
      title: "家里的水是从哪里来的？",
      guide: drop,
      bg1: "#81D4FA",
      bg2: "#E1F5FE",
      ring: "#4FC3F7",
    });
  },

  tap(ctx, s) {
    bathroom(ctx);
    sink(ctx, 420, 380, 1.1);
    const open = easeOut((s.t - s.at(0, "拧开")) / 0.5);
    const flowK = easeOut((s.t - s.at(0, "哗啦啦")) / 0.4);
    tap(ctx, 300, 250, 1.1, s.t, flowK, open);
    const items = [
      ["洗手", icons.hands, 800, 150],
      ["刷牙", icons.brush, 960, 150],
      ["洗澡", icons.bath, 800, 310],
      ["做饭", icons.pot, 960, 310],
    ];
    if (s.line >= 1) {
      for (const [w, draw, x, y] of items) {
        const k = (s.t - s.at(1, w)) / 0.4;
        iconBubble(ctx, x, y, s.line === 1 ? k : clamp(1 - (s.t - s.cue[2]) / 0.3), () => draw(ctx));
      }
    }
    questionMark(ctx, 880, 220, s.line === 2 ? (s.t - s.cue[2]) / 0.5 : s.line === 3 ? 1 - (s.t - s.cue[3]) / 0.3 : 0);
    drop(ctx, 1130, 330, 0.85, s.t, { talking: s.speaking });
    if (s.line === 3) {
      ctx.save();
      ctx.globalAlpha = clamp((s.t - s.cue[3]) / 0.4);
      arrow(ctx, 980, 160, 1180, 160, "#29B6F6", 12);
      ctx.restore();
    }
  },

  nature(ctx, s) {
    sky(ctx, "#90CAF9", "#E3F2FD");
    mountains(ctx);
    hills(ctx, 430, ["#A5D6A7", "#81C784"]);
    const rain = clamp((s.t - s.at(1, "下雨啦")) / 0.4);
    rainCloud(ctx, 160, 90, 1.1, s.t, rain);
    rainCloud(ctx, 430, 120, 0.9, s.t, rain);
    const riverK = clamp((s.t - s.at(1, "小河")) / 1.2);
    const river = [[200, 330], [300, 400], [480, 420], [600, 470], [760, 480], [870, 470]];
    waterPath(ctx, river, 34, clamp(riverK * 2));
    if (riverK > 0) waterFlow(ctx, river, s.t, { upto: riverK, r: 5 });
    reservoir(ctx, 860, 430, 380, 150, s.t);
    sign(ctx, "水库", 1050, 360, (s.t - s.at(2, "水库")) / 0.5);
    for (const x of [80, 600, 680]) tree(ctx, x, 470, 0.9);
    drop(ctx, 1150, 170, 0.6, s.t, { talking: s.speaking });
  },

  toPlant(ctx, s) {
    sky(ctx, "#B3E5FC", "#E1F5FE");
    hills(ctx, 470, ["#C5E1A5", "#AED581"]);
    reservoir(ctx, 0, 440, 360, 150, s.t);
    const p = [[300, 500], [480, 500], [560, 450], [900, 450]];
    pipe(ctx, p, 40);
    const k = clamp((s.t - s.cue[0]) / (s.cue[1] - s.cue[0] + 0.01));
    waterFlow(ctx, p, s.t, { upto: k, r: 8 });
    plantBuilding(ctx, 1040, 560, 1);
    sign(ctx, "自来水厂", 1040, 200, (s.t - s.at(1, "自来水厂")) / 0.5);
    drop(ctx, lerp(260, 830, easeInOut(k)), 370, 0.5, s.t, { talking: s.speaking });
  },

  settle(ctx, s) {
    ctx.fillStyle = "#E1F5FE";
    ctx.fillRect(0, 0, W, H);
    const settle = easeInOut((s.t - s.cue[3]) / Math.max(1, s.dur - s.cue[3] - 0.3));
    const color = mix("#A1887F", "#81D4FA", settle * 0.8);
    tank(ctx, 300, 140, 560, 400, color);
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(300, 140, 560, 400, 12);
    ctx.clip();
    for (let i = 0; i < 46; i++) {
      const bx = 320 + rand(i, 1) * 520;
      const swirlY = 220 + rand(i, 2) * 280 + Math.sin(s.t * 1.5 + i) * 14;
      const by = lerp(swirlY, 515 + rand(i, 3) * 18, easeInOut(clamp(settle * (1.6 - rand(i, 4)))));
      circle(ctx, bx + Math.sin(s.t + i) * 8 * (1 - settle), by, 5 + (i % 3) * 2, "#6D4C41");
    }
    ctx.fillStyle = "#8D6E63";
    ctx.fillRect(300, 540 - 30 * settle, 560, 30 * settle);
    ctx.restore();
    const kM = clamp((s.t - s.at(0, "看不见的")) / 0.5) * (1 - clamp((s.t - s.cue[1]) / 0.4));
    if (kM > 0) {
      ctx.save();
      ctx.globalAlpha = kM;
      circle(ctx, 960, 260, 90, "rgba(255,255,255,0.7)", "#5D4037", 12);
      ctx.save();
      ctx.beginPath();
      ctx.arc(960, 260, 84, 0, Math.PI * 2);
      ctx.clip();
      for (let i = 0; i < 4; i++) germ(ctx, 920 + (i % 2) * 80, 225 + Math.floor(i / 2) * 70, 22, s.t, i);
      ctx.restore();
      ctx.lineWidth = 22;
      ctx.lineCap = "round";
      ctx.strokeStyle = "#5D4037";
      ctx.beginPath();
      ctx.moveTo(1025, 325);
      ctx.lineTo(1090, 395);
      ctx.stroke();
      ctx.restore();
    }
    const kB = clamp((s.t - s.cue[1]) / 0.4) * (1 - clamp((s.t - s.cue[2]) / 0.4));
    if (kB > 0) {
      ctx.save();
      ctx.globalAlpha = kB;
      bubbles(ctx, 580, 300, s.t, 16, 200);
      ctx.restore();
    }
    const kQ = clamp((s.t - s.cue[2]) / 0.4);
    if (kQ > 0 && settle < 0.5) {
      ctx.save();
      ctx.globalAlpha = kQ * (1 - settle * 2);
      label(ctx, "嘘！", 1030, 200, 64, "#fff", "#0277BD");
      ctx.restore();
    }
    drop(ctx, 1060, 470, 0.6, s.t, { talking: s.speaking });
  },

  filter(ctx, s) {
    ctx.fillStyle = "#E1F5FE";
    ctx.fillRect(0, 0, W, H);
    const x = 420;
    const w = 340;
    fillRR(ctx, x - 10, 90, w + 20, 480, 16, "#ECEFF1", "#78909C", 6);
    ctx.fillStyle = "#E1F5FE";
    ctx.fillRect(x, 100, w, 120);
    ctx.fillStyle = "#F0D9A8";
    ctx.fillRect(x, 220, w, 110);
    ctx.fillStyle = "#E3C27F";
    for (let i = 0; i < 70; i++) circle(ctx, x + 6 + ((i * 47) % (w - 12)), 226 + ((i * 29) % 98), 3, "#D4A85A");
    ctx.fillStyle = "#B0BEC5";
    ctx.fillRect(x, 330, w, 110);
    for (let i = 0; i < 26; i++) {
      const gx = x + 20 + ((i * 61) % (w - 40));
      const gy = 345 + ((i * 37) % 84);
      ctx.beginPath();
      ctx.ellipse(gx, gy, 16, 11, i, 0, Math.PI * 2);
      ctx.fillStyle = ["#90A4AE", "#78909C", "#A1887F"][i % 3];
      ctx.fill();
    }
    ctx.fillStyle = "#4FC3F7";
    ctx.fillRect(x, 440, w, 120);
    label(ctx, "沙子", x - 90, 275, 44, "#fff", "#8D6E63");
    label(ctx, "石子", x - 90, 385, 44, "#fff", "#546E7A");
    const k = clamp((s.t - s.cue[0]) / 0.4);
    for (let i = 0; i < 14; i++) {
      const p = (s.t * 0.25 + i / 14) % 1;
      const y = lerp(60, 540, p);
      const dx = x + 30 + ((i * 53) % (w - 60)) + Math.sin(p * 20 + i) * 6;
      const c = mix("#8D6E63", "#E1F5FE", clamp((y - 220) / 220));
      ctx.globalAlpha = k;
      ctx.beginPath();
      ctx.moveTo(dx, y - 14);
      ctx.quadraticCurveTo(dx + 10, y, dx, y + 8);
      ctx.quadraticCurveTo(dx - 10, y, dx, y - 14);
      ctx.fillStyle = c;
      ctx.fill();
      ctx.globalAlpha = 1;
    }
    const kC = clamp((s.t - s.at(1, "清清亮亮")) / 0.4);
    if (kC > 0) {
      ctx.globalAlpha = kC;
      for (let i = 0; i < 6; i++) sparkle(ctx, x + 40 + i * 55, 480 + Math.sin(s.t * 3 + i) * 20, 14 + Math.sin(s.t * 6 + i) * 4);
      ctx.globalAlpha = 1;
    }
    drop(ctx, 1000, 380, 0.75, s.t, { talking: s.speaking });
  },

  disinfect(ctx, s) {
    ctx.fillStyle = "#E1F5FE";
    ctx.fillRect(0, 0, W, H);
    const clean = clamp((s.t - s.cue[2]) / 0.6);
    tank(ctx, 260, 140, 620, 400, mix("#81D4FA", "#4FC3F7", clean));
    const tRun = s.at(1, "赶跑");
    for (let i = 0; i < 7; i++) {
      const bx = 330 + ((i * 97) % 480);
      const by = 240 + ((i * 61) % 240);
      const run = clamp((s.t - tRun) / 1.2);
      const dir = i % 2 ? 1 : -1;
      const gx = bx + dir * easeInOut(run) * 1400 + Math.sin(s.t * 3 + i) * 10;
      const gy = by - Math.sin(run * Math.PI) * 120 + Math.cos(s.t * 2 + i) * 8;
      germ(ctx, gx, gy, 28, s.t, i);
    }
    const kS = clamp((s.t - s.at(0, "消消毒")) / 0.5);
    if (kS > 0) {
      ctx.save();
      ctx.globalAlpha = kS;
      bubbles(ctx, 560, 520, s.t, 20, 340);
      ctx.restore();
    }
    if (clean > 0) {
      ctx.globalAlpha = clean;
      for (let i = 0; i < 10; i++) sparkle(ctx, 300 + i * 60, 250 + Math.sin(s.t * 2 + i) * 120, 14 + Math.sin(s.t * 5 + i) * 5);
      ctx.globalAlpha = 1;
    }
    drop(ctx, 1060, 360, 0.8 + clean * 0.1, s.t, { talking: s.speaking });
  },

  pipes(ctx, s) {
    sky(ctx, "#B3E5FC", "#E1F5FE");
    ground(ctx, 300);
    const housesX = [480, 700, 920, 1140];
    for (const hx of housesX) house(ctx, hx, 290, 0.75);
    pump(ctx, 150, 430, 0.9, s.t, clamp((s.t - s.cue[0]) / 0.3));
    const main = [[215, 430], [1180, 430]];
    pipe(ctx, main, 36);
    const branches = housesX.map((hx) => [[hx, 430], [hx, 300]]);
    const kB = clamp((s.t - s.cue[2]) / 1.0);
    for (const b of branches) if (kB > 0) pipe(ctx, b, 20 * kB);
    const kMain = clamp((s.t - s.at(1, "钻进")) / 1.8);
    waterFlow(ctx, main, s.t, { upto: kMain, r: 9, gap: 40 });
    const kUp = clamp((s.t - s.cue[3]) / 1.4);
    if (kB > 0) {
      for (const b of branches) waterFlow(ctx, [b[0], b[1]], s.t, { upto: kUp, r: 6, gap: 28, speed: 90 });
    }
    sign(ctx, "像大树一样", 640, 90, (s.t - s.at(3, "大树")) / 0.5, "#66BB6A", "#1B5E20");
    drop(ctx, 150, 190, 0.6, s.t, { talking: s.speaking });
  },

  building(ctx, s) {
    sky(ctx, "#B3E5FC", "#E1F5FE");
    ctx.fillStyle = "#9CCC65";
    ctx.fillRect(0, 620, W, 100);
    apartment(ctx, 640, 620, 1.2);
    const up = [[880, 700], [880, 160]];
    pipe(ctx, up, 24);
    const k0 = clamp((s.t - s.cue[0]) / Math.max(0.5, s.cue[1] - s.cue[0]));
    const floorY = 620 - 1.2 * 115 * 2.5;
    waterFlow(ctx, [[880, 700], [880, floorY]], s.t, { upto: k0, r: 7, gap: 30 });
    const inPipe = [[880, floorY], [700, floorY]];
    const k1 = clamp((s.t - s.cue[1]) / 0.8);
    if (k1 > 0) {
      pipe(ctx, inPipe, 18);
      waterFlow(ctx, inPipe, s.t, { upto: k1, r: 6, gap: 26 });
    }
    const k2 = clamp((s.t - s.cue[2]) / 0.5);
    if (k2 > 0) {
      ctx.save();
      ctx.translate(640, floorY);
      ctx.scale(pop(k2), pop(k2));
      circle(ctx, 0, 0, 105, "#fff", "#4FC3F7", 6);
      tap(ctx, -40, 0, 0.55, s.t, 0, 0);
      drop(ctx, 22, 30, 0.3, s.t);
      ctx.restore();
    }
    const climbY = lerp(640, floorY - 20, easeInOut(k0));
    drop(ctx, 1000, s.line >= 2 ? floorY : climbY, 0.5, s.t, { talking: s.speaking });
  },

  wash(ctx, s) {
    bathroom(ctx);
    sink(ctx, 640, 400, 1.2);
    const open = easeOut((s.t - s.at(0, "拧开")) / 0.4);
    const fl = easeOut((s.t - s.at(0, "水就出来")) / 0.4);
    tap(ctx, 510, 255, 1.2, s.t, fl, open);
    const k = clamp((s.t - s.cue[1]) / 0.5);
    if (k > 0) {
      const rub = Math.sin(s.t * 10) * 10;
      ctx.save();
      ctx.globalAlpha = k;
      fillRR(ctx, 560 + rub, 400, 60, 110, 30, "#FAD3B0", "#D9A07A", 4);
      fillRR(ctx, 680 - rub, 400, 60, 110, 30, "#FAD3B0", "#D9A07A", 4);
      fillRR(ctx, 540 + rub, 500, 90, 80, 30, "#FF8A80");
      fillRR(ctx, 670 - rub, 500, 90, 80, 30, "#FF8A80");
      bubbles(ctx, 650, 420, s.t, 14, 140);
      ctx.restore();
    }
    const kS = clamp((s.t - s.at(1, "香香")) / 0.4);
    if (kS > 0) {
      ctx.globalAlpha = kS;
      for (let i = 0; i < 5; i++) sparkle(ctx, 500 + i * 70, 340 + Math.sin(s.t * 4 + i) * 20, 16, "#FFF59D");
      ctx.globalAlpha = 1;
    }
    drop(ctx, 1080, 300, 0.8, s.t, { talking: s.speaking });
  },

  drain(ctx, s) {
    sky(ctx, "#E1F5FE", "#E1F5FE");
    ground(ctx, 330);
    fillRR(ctx, 90, 120, 260, 210, 10, "#FFF3E0", "#8D6E63", 5);
    sink(ctx, 220, 220, 0.45);
    const p1 = [[220, 290], [220, 450], [560, 450]];
    const p2 = [[560, 450], [760, 450]];
    const p3 = [[1000, 450], [1100, 450], [1100, 600], [1280, 600]];
    pipe(ctx, p1, 28, "#A1887F");
    pipe(ctx, p2, 28, "#A1887F");
    const k1 = clamp((s.t - s.cue[1]) / 1.2);
    flow(ctx, [...p1, ...p2.slice(1)], s.t, { color: "#8D6E63", glow: "rgba(0,0,0,0)", r: 7, gap: 32, speed: 120, upto: k1 });
    const kP = clamp((s.t - s.at(2, "污水处理厂")) / 0.5);
    if (kP > 0) {
      ctx.save();
      ctx.translate(880, 470);
      ctx.scale(pop(kP), pop(kP));
      fillRR(ctx, -120, -120, 240, 140, 12, "#C8E6C9", "#2E7D32", 5);
      circle(ctx, -55, -40, 40, mix("#A1887F", "#4FC3F7", (Math.sin(s.t * 2) + 1) / 2), "#2E7D32", 4);
      circle(ctx, 55, -40, 40, "#4FC3F7", "#2E7D32", 4);
      ctx.restore();
      sign(ctx, "污水处理厂", 880, 230, (s.t - s.at(2, "污水处理厂")) / 0.5, "#66BB6A", "#1B5E20");
    }
    const kR = clamp((s.t - s.cue[3]) / 1.2);
    if (kR > 0) {
      ctx.fillStyle = "#4FC3F7";
      ctx.fillRect(1120, 580, 160, 60);
      pipe(ctx, p3, 24);
      waterFlow(ctx, p3, s.t, { upto: kR, r: 7 });
      for (let i = 0; i < 3; i++) {
        ctx.globalAlpha = kR;
        sparkle(ctx, 1150 + i * 45, 560 + Math.sin(s.t * 4 + i) * 10, 12);
        ctx.globalAlpha = 1;
      }
    }
    drop(ctx, 520, 200, 0.6, s.t, { talking: s.speaking });
  },

  tips(ctx, s) {
    ctx.fillStyle = "#E1F5FE";
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = "#B3E5FC";
    ctx.fillRect(0, 500, W, 220);
    const intro = clamp((s.t - s.cue[1]) / 0.6);
    drop(ctx, 640, lerp(300, 140, intro), lerp(1.1, 0.55, intro) * pop(s.t / 0.5), s.t, { talking: s.speaking });
    if (intro < 1) warning(ctx, 860, 200, pop((s.t - 0.2) / 0.5) * (1 - intro));
    if (s.line >= 1) {
      const k = pop((s.t - s.cue[1]) / 0.5);
      const boil = clamp((s.t - s.at(1, "烧开")) / 0.5);
      ctx.save();
      ctx.translate(300, 420);
      ctx.scale(k, k);
      kettle(ctx, 0, 0, 1, s.t, boil);
      ctx.restore();
      const kC = pop((s.t - s.at(1, "才能喝")) / 0.5);
      if (kC > 0) {
        cup(ctx, 480, 450, 0.8 * kC);
        check(ctx, 480, 330, 34, kC);
      }
    }
    if (s.line >= 2) {
      const k = pop((s.t - s.cue[2]) / 0.5);
      const close = easeOut((s.t - s.at(2, "关紧")) / 0.5);
      ctx.save();
      ctx.translate(800, 280);
      ctx.scale(k * 1.4, k * 1.4);
      tap(ctx, 0, 0, 1, s.t, 1 - close, 1 - close);
      ctx.restore();
      const kC = pop((s.t - s.at(2, "节约用水")) / 0.5);
      if (kC > 0) check(ctx, 1130, 240, 50, kC);
    }
  },

  recap(ctx, s) {
    sky(ctx, "#E1F5FE", "#B3E5FC");
    const xs = [170, 490, 800, 1110];
    const active = s.line - 1;
    const icon = (i, draw) => {
      const on = active === i;
      const done = active > i;
      const k = on ? 1 + 0.12 * Math.sin(Math.PI * clamp((s.t - s.cue[i + 1]) / 0.6)) : 1;
      ctx.save();
      ctx.globalAlpha = on || done || s.line >= 4 ? 1 : 0.4;
      if (on) circle(ctx, xs[i], 330, 130, "rgba(129, 212, 250, 0.6)");
      ctx.translate(xs[i], 330);
      ctx.scale(k, k);
      draw();
      ctx.restore();
    };
    icon(0, () => {
      ctx.translate(-150, -20);
      reservoir(ctx, 0, 0, 300, 110, s.t);
    });
    icon(1, () => plantBuilding(ctx, 0, 90, 0.6));
    icon(2, () => {
      pipe(ctx, [[-110, 40], [-20, 40], [-20, -40], [110, -40]], 30);
      waterFlow(ctx, [[-110, 40], [-20, 40], [-20, -40], [110, -40]], s.t, { r: 6, gap: 26 });
    });
    icon(3, () => tap(ctx, -70, -20, 0.9, s.t, s.line >= 4 ? 1 : 0.6, 1));
    for (let i = 0; i < 3; i++) {
      const k = clamp((s.t - s.cue[i + 2]) / 0.4);
      if (k > 0) {
        ctx.globalAlpha = k;
        arrow(ctx, xs[i] + 95, 490, xs[i + 1] - 95, 490, "#29B6F6", 10);
        ctx.globalAlpha = 1;
      }
    }
    const names = ["水库", "自来水厂", "水管", "水龙头"];
    names.forEach((n, i) => {
      if (active >= i || s.line >= 4) label(ctx, n, xs[i], 540, 40, "#fff", "#01579B");
    });
    if (s.line >= 4 && s.t > s.at(4, "水龙头")) {
      for (let i = 0; i < 8; i++) {
        const a = s.t * 2 + i;
        sparkle(ctx, xs[3] + Math.cos(a) * 140, 320 + Math.sin(a) * 120, 14, "#FFF59D");
      }
    }
    drop(ctx, 640, 110, 0.45, s.t, { talking: s.speaking });
  },

  ending(ctx, s) {
    sky(ctx, "#B3E5FC", "#E1F5FE");
    const k = clamp(s.t / 0.5);
    confetti(ctx, s.t, k);
    drop(ctx, 640, 260, 1.1 * pop(k), s.t, { talking: s.speaking });
    const kB = pop((s.t - s.at(0, "再见")) / 0.6);
    if (kB > 0) {
      ctx.save();
      ctx.translate(640, 470);
      ctx.scale(kB, kB);
      label(ctx, "下次再见！", 0, 0, 80, "#29B6F6", "#01579B");
      ctx.restore();
    }
  },
};

