import {
  W, H, clamp, lerp, easeOut, easeInOut, pop, fillRR, circle, label, sky, cloud, drifting, hills,
  house, sun, spark, sparkle, arrow, polyline, flow, noSign, check, person, titleCard, face, warning,
} from "./common.js";

const BOLT_YELLOW = "#FFE14D";

function room(ctx, dark = 0) {
  ctx.fillStyle = "#FBE7C6";
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = "#F3D5A5";
  for (let x = 0; x < W; x += 80) ctx.fillRect(x, 0, 40, 470);
  ctx.fillStyle = "#C98B55";
  ctx.fillRect(0, 470, W, H - 470);
  ctx.fillStyle = "#B57A47";
  for (let x = 0; x < W; x += 160) ctx.fillRect(x, 470, 4, H - 470);
  ctx.fillStyle = "#E9C089";
  ctx.fillRect(0, 462, W, 14);
  if (dark > 0) {
    ctx.fillStyle = `rgba(20, 20, 60, ${dark})`;
    ctx.fillRect(0, 0, W, H);
  }
}

function lamp(ctx, x, y, on, s = 1) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  if (on > 0) {
    const g = ctx.createRadialGradient(0, -230, 10, 0, -150, 330);
    g.addColorStop(0, `rgba(255, 236, 140, ${0.75 * on})`);
    g.addColorStop(1, "rgba(255, 236, 140, 0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(0, -150, 330, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = "#6D4C41";
  ctx.fillRect(-6, -220, 12, 220);
  fillRR(ctx, -50, -10, 100, 14, 7, "#5D4037");
  ctx.beginPath();
  ctx.moveTo(-60, -210);
  ctx.lineTo(-40, -300);
  ctx.lineTo(40, -300);
  ctx.lineTo(60, -210);
  ctx.closePath();
  ctx.fillStyle = on > 0.5 ? "#FFF3B0" : "#F6C76B";
  ctx.fill();
  ctx.lineWidth = 4;
  ctx.strokeStyle = "#B7791F";
  ctx.stroke();
  circle(ctx, 0, -205, 16, on > 0.5 ? "#FFF59D" : "#EEE", "#B7791F", 3);
  ctx.restore();
}

function lightSwitch(ctx, x, y, on, s = 1) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  fillRR(ctx, -28, -40, 56, 80, 10, "#fff", "#9E9E9E", 4);
  fillRR(ctx, -12, on ? -26 : 2, 24, 26, 5, on ? "#66BB6A" : "#BDBDBD", "#757575", 3);
  ctx.restore();
}

function tv(ctx, x, y, s, t, on = 1) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  fillRR(ctx, -20, 70, 40, 30, 4, "#555");
  fillRR(ctx, -60, 96, 120, 12, 6, "#444");
  fillRR(ctx, -120, -80, 240, 160, 16, "#37474F", "#263238", 5);
  if (on > 0) {
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(-104, -66, 208, 132, 8);
    ctx.clip();
    const g = ctx.createLinearGradient(0, -66, 0, 66);
    g.addColorStop(0, "#81D4FA");
    g.addColorStop(1, "#C5E1A5");
    ctx.globalAlpha = on;
    ctx.fillStyle = g;
    ctx.fillRect(-104, -66, 208, 132);
    const colors = ["#F44336", "#FF9800", "#FFEB3B", "#4CAF50", "#2196F3", "#9C27B0"];
    colors.forEach((c, i) => {
      ctx.beginPath();
      ctx.arc(0, 70, 110 - i * 12, Math.PI, 0);
      ctx.lineWidth = 12;
      ctx.strokeStyle = c;
      ctx.stroke();
    });
    const bx = Math.sin(t * 2) * 60;
    const by = 20 - Math.abs(Math.sin(t * 5)) * 50;
    circle(ctx, bx, by, 20, "#FF7043");
    face(ctx, bx, by - 2, 0.4, t);
    ctx.restore();
  } else {
    fillRR(ctx, -104, -66, 208, 132, 8, "#1C2A30");
  }
  ctx.restore();
}

function fridge(ctx, x, y, s, t, cold = 0) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  fillRR(ctx, -70, -260, 140, 260, 16, "#E3F2FD", "#90A4AE", 5);
  ctx.strokeStyle = "#90A4AE";
  ctx.beginPath();
  ctx.moveTo(-70, -170);
  ctx.lineTo(70, -170);
  ctx.stroke();
  fillRR(ctx, 44, -235, 10, 40, 5, "#90A4AE");
  fillRR(ctx, 44, -150, 10, 60, 5, "#90A4AE");
  if (cold > 0) {
    ctx.globalAlpha = cold;
    for (let i = 0; i < 6; i++) {
      const a = t * 1.5 + i;
      const sx = Math.cos(a) * 100;
      const sy = -150 + Math.sin(a * 1.3) * 120;
      sparkle(ctx, sx, sy, 14, "#B3E5FC");
    }
    ctx.globalAlpha = 1;
  }
  face(ctx, -5, -100, 0.7, t, { blinkOffset: 0.7 });
  ctx.restore();
}

function washer(ctx, x, y, s, t, on = 0) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  fillRR(ctx, -70, -150, 140, 150, 14, "#FAFAFA", "#9E9E9E", 5);
  circle(ctx, 0, -70, 46, "#B3E5FC", "#78909C", 6);
  if (on > 0) {
    ctx.save();
    ctx.translate(0, -70);
    ctx.rotate(t * 6);
    for (let i = 0; i < 4; i++) {
      ctx.rotate(Math.PI / 2);
      circle(ctx, 22, 0, 9, ["#F48FB1", "#FFF176", "#81C784", "#64B5F6"][i]);
    }
    ctx.restore();
  }
  circle(ctx, -45, -130, 6, "#EF5350");
  circle(ctx, -25, -130, 6, "#66BB6A");
  ctx.restore();
}

function questionMark(ctx, x, y, k) {
  if (k <= 0) return;
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(pop(k), pop(k));
  circle(ctx, 0, 0, 56, "#fff", "#FFB300", 6);
  label(ctx, "？", 0, 4, 80, "#FF8F00", "#fff");
  ctx.restore();
}

function powerPlant(ctx, x, y, s, t, glow = 1) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  for (const [cx, w] of [[-170, 90], [170, 90]]) {
    ctx.beginPath();
    ctx.moveTo(cx - w / 2 - 20, 0);
    ctx.quadraticCurveTo(cx - w / 2 + 15, -110, cx - w / 2, -200);
    ctx.lineTo(cx + w / 2, -200);
    ctx.quadraticCurveTo(cx + w / 2 - 15, -110, cx + w / 2 + 20, 0);
    ctx.closePath();
    ctx.fillStyle = "#CFD8DC";
    ctx.fill();
    ctx.lineWidth = 5;
    ctx.strokeStyle = "#78909C";
    ctx.stroke();
    for (let i = 0; i < 3; i++) {
      const p = (t * 0.4 + i / 3) % 1;
      ctx.globalAlpha = 0.8 * (1 - p);
      cloud(ctx, cx - 40 + Math.sin(p * 6 + i) * 10, -220 - p * 140, 0.5 + p * 0.5);
      ctx.globalAlpha = 1;
    }
  }
  fillRR(ctx, -120, -240, 240, 240, 14, "#FFCC80", "#8D6E63", 5);
  for (let r = 0; r < 2; r++)
    for (let c = 0; c < 3; c++) fillRR(ctx, -95 + c * 70, -210 + r * 60, 50, 38, 6, "#FFF8E1", "#8D6E63", 3);
  fillRR(ctx, -30, -80, 60, 80, 8, "#A1887F", "#6D4C41", 4);
  ctx.save();
  ctx.translate(0, -300);
  const k = 1 + Math.sin(t * 6) * 0.06 * glow;
  ctx.scale(k * 0.55, k * 0.55);
  ctx.shadowColor = "rgba(255,210,0,0.9)";
  ctx.shadowBlur = 40 * glow;
  ctx.beginPath();
  ctx.moveTo(10, -95);
  ctx.lineTo(-52, 8);
  ctx.lineTo(-6, 8);
  ctx.lineTo(-24, 95);
  ctx.lineTo(54, -20);
  ctx.lineTo(8, -20);
  ctx.lineTo(34, -95);
  ctx.closePath();
  ctx.fillStyle = BOLT_YELLOW;
  ctx.fill();
  ctx.restore();
  ctx.restore();
}

function turbine(ctx, x, y, s, angle) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  ctx.beginPath();
  ctx.moveTo(-8, 0);
  ctx.lineTo(-4, -260);
  ctx.lineTo(4, -260);
  ctx.lineTo(8, 0);
  ctx.closePath();
  ctx.fillStyle = "#FAFAFA";
  ctx.fill();
  ctx.lineWidth = 3;
  ctx.strokeStyle = "#90A4AE";
  ctx.stroke();
  ctx.translate(0, -260);
  ctx.rotate(angle);
  for (let i = 0; i < 3; i++) {
    ctx.rotate((Math.PI * 2) / 3);
    ctx.beginPath();
    ctx.moveTo(0, -6);
    ctx.quadraticCurveTo(30, -60, 6, -150);
    ctx.lineTo(-6, -150);
    ctx.quadraticCurveTo(-10, -60, 0, -6);
    ctx.fillStyle = "#fff";
    ctx.fill();
    ctx.stroke();
  }
  circle(ctx, 0, 0, 12, "#ECEFF1", "#90A4AE", 3);
  ctx.restore();
}

function windLines(ctx, t, strength) {
  if (strength <= 0) return;
  ctx.save();
  ctx.globalAlpha = 0.8 * strength;
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 6;
  ctx.lineCap = "round";
  for (let i = 0; i < 7; i++) {
    const y = 90 + i * 55;
    const x = ((t * 500 + i * 230) % (W + 400)) - 200;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.bezierCurveTo(x + 60, y - 20, x + 120, y + 20, x + 180, y);
    ctx.stroke();
  }
  ctx.restore();
}

function solarPanel(ctx, x, y, s, shine) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  ctx.fillStyle = "#78909C";
  ctx.fillRect(-6, -40, 12, 40);
  ctx.transform(1, 0, -0.35, 1, 0, 0);
  fillRR(ctx, -80, -110, 160, 80, 6, "#1E3A8A", "#CFD8DC", 5);
  ctx.strokeStyle = "#93C5FD";
  ctx.lineWidth = 2;
  for (let i = 1; i < 4; i++) {
    ctx.beginPath();
    ctx.moveTo(-80 + i * 40, -110);
    ctx.lineTo(-80 + i * 40, -30);
    ctx.stroke();
  }
  ctx.beginPath();
  ctx.moveTo(-80, -70);
  ctx.lineTo(80, -70);
  ctx.stroke();
  if (shine > 0) {
    ctx.globalAlpha = 0.5 * shine;
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.moveTo(-60, -110);
    ctx.lineTo(-30, -110);
    ctx.lineTo(-70, -30);
    ctx.lineTo(-100, -30);
    ctx.fill();
    ctx.globalAlpha = 1;
  }
  ctx.restore();
}

function waterWheel(ctx, x, y, r, angle) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  circle(ctx, 0, 0, r, "#FFB74D", "#8D6E63", 6);
  for (let i = 0; i < 8; i++) {
    ctx.rotate(Math.PI / 4);
    fillRR(ctx, -8, -r - 18, 16, 36, 4, "#8D6E63");
  }
  circle(ctx, 0, 0, r * 0.25, "#8D6E63");
  ctx.restore();
}

function tower(ctx, x, y, s = 1) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  ctx.strokeStyle = "#78909C";
  ctx.lineWidth = 6;
  ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(-50, 0);
  ctx.lineTo(-10, -230);
  ctx.lineTo(10, -230);
  ctx.lineTo(50, 0);
  for (let k = 0; k < 4; k++) {
    const y1 = -k * 55;
    const y2 = -(k + 1) * 55;
    const w1 = 50 - k * 10;
    const w2 = 50 - (k + 1) * 10;
    ctx.moveTo(-w1, y1);
    ctx.lineTo(w2, y2);
    ctx.moveTo(w1, y1);
    ctx.lineTo(-w2, y2);
  }
  ctx.moveTo(-70, -180);
  ctx.lineTo(70, -180);
  ctx.moveTo(-55, -215);
  ctx.lineTo(55, -215);
  ctx.stroke();
  ctx.restore();
}

function substationBox(ctx, x, y, s, t) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  fillRR(ctx, -170, -40, 340, 40, 6, "#B0BEC5");
  for (const dx of [-90, 0, 90]) {
    fillRR(ctx, dx - 35, -170, 70, 130, 10, "#90A4AE", "#546E7A", 4);
    for (let i = 0; i < 4; i++) fillRR(ctx, dx - 42, -150 + i * 26, 84, 10, 5, "#607D8B");
    for (const ix of [-16, 16]) {
      fillRR(ctx, dx + ix - 5, -215, 10, 45, 4, "#D7CCC8", "#8D6E63", 2);
      for (let j = 0; j < 3; j++) fillRR(ctx, dx + ix - 10, -210 + j * 13, 20, 6, 3, "#BCAAA4");
    }
  }
  ctx.strokeStyle = "#9E9E9E";
  ctx.lineWidth = 3;
  for (let fx = -190; fx <= 190; fx += 20) {
    ctx.beginPath();
    ctx.moveTo(fx, 0);
    ctx.lineTo(fx, -70);
    ctx.stroke();
  }
  ctx.beginPath();
  ctx.moveTo(-195, -70);
  ctx.lineTo(195, -70);
  ctx.moveTo(-195, -35);
  ctx.lineTo(195, -35);
  ctx.stroke();
  fillRR(ctx, -40, -60, 80, 40, 6, "#FFEB3B", "#F57F17", 3);
  ctx.fillStyle = "#212121";
  ctx.beginPath();
  ctx.moveTo(4, -56);
  ctx.lineTo(-10, -38);
  ctx.lineTo(0, -38);
  ctx.lineTo(-4, -24);
  ctx.lineTo(10, -42);
  ctx.lineTo(0, -42);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function jaggedBolt(ctx, x1, y1, x2, y2, t, color, lw, seed = 0) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  const n = 10;
  for (let i = 1; i < n; i++) {
    const k = i / n;
    const j = Math.sin(t * 30 + i * 7 + seed) * 22;
    ctx.lineTo(lerp(x1, x2, k), lerp(y1, y2, k) + j);
  }
  ctx.lineTo(x2, y2);
  ctx.strokeStyle = color;
  ctx.lineWidth = lw;
  ctx.lineJoin = "round";
  ctx.shadowColor = color;
  ctx.shadowBlur = 25;
  ctx.stroke();
  ctx.shadowBlur = 0;
}

function socket(ctx, x, y, s) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  fillRR(ctx, -60, -60, 120, 120, 18, "#fff", "#9E9E9E", 5);
  fillRR(ctx, -26, -24, 10, 30, 4, "#424242");
  fillRR(ctx, 16, -24, 10, 30, 4, "#424242");
  fillRR(ctx, -6, 18, 12, 22, 4, "#424242");
  ctx.restore();
}

function hand(ctx, x, y, s) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  ctx.fillStyle = "#FAD3B0";
  ctx.strokeStyle = "#D9A07A";
  ctx.lineWidth = 3;
  fillRR(ctx, 0, -30, 90, 60, 26, "#FAD3B0", "#D9A07A", 3);
  fillRR(ctx, -50, -14, 70, 22, 11, "#FAD3B0", "#D9A07A", 3);
  fillRR(ctx, 60, -10, 120, 46, 20, "#FF8A80");
  ctx.restore();
}

function iceCream(ctx, x, y, s) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  ctx.beginPath();
  ctx.moveTo(-30, 0);
  ctx.lineTo(0, 80);
  ctx.lineTo(30, 0);
  ctx.closePath();
  ctx.fillStyle = "#E0A458";
  ctx.fill();
  circle(ctx, 0, -10, 32, "#F8BBD0");
  circle(ctx, -14, -38, 22, "#FFF59D");
  circle(ctx, 14, -38, 22, "#C5E1A5");
  ctx.restore();
}

function townSkyline(ctx, x, y, s, lit) {
  const blds = [[-160, 120], [-90, 180], [-20, 140], [50, 210], [120, 150], [190, 110]];
  for (const [bx, h] of blds) {
    fillRR(ctx, x + bx * s, y - h * s, 60 * s, h * s, 6, "#90CAF9", "#5C7FA3", 3);
    for (let wy = y - h * s + 15 * s; wy < y - 20 * s; wy += 28 * s)
      for (const wx of [10, 34])
        fillRR(ctx, x + (bx + wx) * s, wy, 14 * s, 14 * s, 2, lit ? "#FFF176" : "#E3F2FD");
  }
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

export const scenes = {
  title(ctx, s) {
    titleCard(ctx, s, {
      title: "家里的电是从哪里来的？",
      guide: spark,
      bg1: "#FFE082",
      bg2: "#FFF8E1",
      ring: "#FFCA28",
    });
  },

  home(ctx, s) {
    const tOn = s.at(0, "啪");
    const on = easeOut((s.t - tOn) / 0.25);
    room(ctx, 0.45 * (1 - on));
    lightSwitch(ctx, 250, 300, on > 0.5, 1.1);
    lamp(ctx, 140, 470, on, 1);
    const kTv = (s.t - s.at(1, "电视")) / 0.5;
    const kFr = (s.t - s.at(1, "冰箱")) / 0.5;
    const kWa = (s.t - s.at(1, "洗衣机")) / 0.5;
    const bump = (k) => 1 + 0.18 * Math.sin(Math.PI * clamp(k));
    tv(ctx, 520, 360, 0.95 * bump(kTv), s.t, clamp(kTv * 2));
    fridge(ctx, 770, 470, 0.95 * bump(kFr), s.t, clamp(kFr));
    washer(ctx, 940, 470, 0.85 * bump(kWa), s.t, clamp(kWa));
    const kQ = (s.t - s.cue[2]) / 0.6;
    const go = easeInOut((s.t - s.cue[3]) / 1.2);
    spark(ctx, lerp(1130, 1100, go), lerp(320, 260, go), 0.85, s.t, { talking: s.speaking });
    questionMark(ctx, 1150, 120, s.line === 2 ? kQ : s.line > 2 ? 1 - (s.t - s.cue[3]) / 0.3 : 0);
    if (s.line === 3) {
      ctx.save();
      ctx.globalAlpha = clamp((s.t - s.cue[3]) / 0.4);
      arrow(ctx, 980, 180, 1180, 180, "#FF7A45", 12);
      ctx.restore();
    }
  },

  plant(ctx, s) {
    sky(ctx, "#90CAF9", "#E3F2FD");
    drifting(ctx, s.t, [[100, 100, 0.9, 20], [600, 70, 0.7, 15], [1000, 130, 1, 18]]);
    hills(ctx, 470, ["#A5D6A7", "#81C784"]);
    const z = lerp(0.85, 1.05, easeInOut(s.t / s.dur));
    powerPlant(ctx, 640, 520, z, s.t);
    const kL = (s.t - s.at(1, "发电厂")) / 0.6;
    if (kL > 0) {
      ctx.save();
      ctx.translate(640, 110);
      ctx.scale(pop(kL), pop(kL));
      fillRR(ctx, -150, -45, 300, 90, 45, "#FF7043", "#fff", 6);
      label(ctx, "发电厂", 0, 2, 60, "#fff", "#BF360C");
      ctx.restore();
    }
    spark(ctx, 1110, 400, 0.7, s.t, { talking: s.speaking });
  },

  wind(ctx, s) {
    sky(ctx, "#81D4FA", "#E1F5FE");
    const blow = clamp((s.t - s.at(1, "大风")) / 0.8);
    drifting(ctx, s.t * (1 + blow * 3), [[50, 90, 0.8, 30], [500, 60, 0.6, 25], [900, 120, 0.9, 28]]);
    hills(ctx, 480, ["#9CCC65", "#7CB342"]);
    const speed = 0.6 + blow * 4.5;
    const ang = s.t * speed;
    turbine(ctx, 330, 520, 1.1, ang);
    turbine(ctx, 640, 490, 0.9, ang + 1);
    turbine(ctx, 920, 530, 1.15, ang + 2);
    windLines(ctx, s.t, blow);
    const kE = clamp((s.t - s.cue[2]) / 0.6);
    if (kE > 0) {
      ctx.globalAlpha = kE;
      for (const [x, y, sc] of [[330, 234, 1.1], [640, 256, 0.9], [920, 231, 1.15]]) {
        for (let i = 0; i < 5; i++) {
          const a = s.t * 2 + i * 1.3;
          const r = 60 + ((s.t * 80 + i * 40) % 120);
          sparkle(ctx, x + Math.cos(a) * r * sc, y + Math.sin(a) * r * 0.6 * sc, 12, BOLT_YELLOW);
        }
      }
      ctx.globalAlpha = 1;
    }
    spark(ctx, 1150, 420, 0.6, s.t, { talking: s.speaking });
  },

  solar(ctx, s) {
    sky(ctx, "#4FC3F7", "#FFF9C4");
    sun(ctx, 190, 140, 85, s.t);
    hills(ctx, 470, ["#C5E1A5", "#AED581"]);
    const rays = clamp((s.t - s.cue[1]) / 0.6);
    const panels = [[560, 520], [760, 520], [960, 520], [660, 620], [860, 620], [1060, 620]];
    if (rays > 0) {
      ctx.save();
      ctx.globalAlpha = 0.7 * rays;
      ctx.strokeStyle = "#FFEB3B";
      ctx.lineWidth = 6;
      ctx.setLineDash([24, 18]);
      ctx.lineDashOffset = -s.t * 120;
      for (const [px, py] of panels) {
        ctx.beginPath();
        ctx.moveTo(250, 190);
        ctx.lineTo(px - 20, py - 80);
        ctx.stroke();
      }
      ctx.restore();
    }
    for (const [px, py] of panels) solarPanel(ctx, px, py, 0.85, rays * (0.5 + 0.5 * Math.sin(s.t * 4 + px)));
    const kE = clamp((s.t - s.at(2, "变成电")) / 0.5);
    if (kE > 0) {
      for (const [px, py] of panels) {
        for (let i = 0; i < 3; i++) {
          const p = (s.t * 0.8 + i / 3 + px / 500) % 1;
          ctx.globalAlpha = kE * (1 - p);
          sparkle(ctx, px - 30 + Math.sin(i + px) * 30, py - 100 - p * 120, 14, BOLT_YELLOW);
        }
      }
      ctx.globalAlpha = 1;
    }
    spark(ctx, 1160, 300, 0.6, s.t, { talking: s.speaking });
  },

  hydro(ctx, s) {
    sky(ctx, "#90CAF9", "#E3F2FD");
    ctx.fillStyle = "#8D9C7A";
    ctx.beginPath();
    ctx.moveTo(0, 230);
    ctx.lineTo(260, 160);
    ctx.lineTo(520, 220);
    ctx.lineTo(520, H);
    ctx.lineTo(0, H);
    ctx.fill();
    const lake = ctx.createLinearGradient(0, 270, 0, 560);
    lake.addColorStop(0, "#4FC3F7");
    lake.addColorStop(1, "#0277BD");
    ctx.fillStyle = lake;
    ctx.beginPath();
    ctx.moveTo(0, 270 + Math.sin(s.t * 2) * 4);
    for (let x = 0; x <= 520; x += 20) ctx.lineTo(x, 270 + Math.sin(x / 40 + s.t * 2) * 4);
    ctx.lineTo(520, 560);
    ctx.lineTo(0, 560);
    ctx.fill();
    ctx.fillStyle = "#B0BEC5";
    ctx.beginPath();
    ctx.moveTo(500, 230);
    ctx.lineTo(580, 230);
    ctx.lineTo(680, 580);
    ctx.lineTo(480, 580);
    ctx.closePath();
    ctx.fill();
    ctx.lineWidth = 5;
    ctx.strokeStyle = "#78909C";
    ctx.stroke();
    ctx.fillStyle = "#9CCC65";
    ctx.fillRect(680, 560, W - 680, H - 560);
    const gush = clamp((s.t - s.at(1, "哗啦啦")) / 0.5);
    const river = ctx.createLinearGradient(680, 0, W, 0);
    river.addColorStop(0, "#29B6F6");
    river.addColorStop(1, "#4FC3F7");
    ctx.fillStyle = river;
    ctx.fillRect(660, 560, W - 660, 40);
    if (gush > 0) {
      ctx.save();
      ctx.globalAlpha = gush;
      for (let i = 0; i < 6; i++) {
        const y0 = 440 + i * 20;
        ctx.strokeStyle = i % 2 ? "#E1F5FE" : "#4FC3F7";
        ctx.lineWidth = 14;
        ctx.lineCap = "round";
        ctx.setLineDash([30, 20]);
        ctx.lineDashOffset = -s.t * 300;
        ctx.beginPath();
        ctx.moveTo(640, y0);
        ctx.quadraticCurveTo(720, y0 - 10, 760, 560);
        ctx.stroke();
      }
      ctx.restore();
    }
    const spin = gush * (s.t - s.at(1, "哗啦啦")) * 3;
    waterWheel(ctx, 820, 520, 70, Math.max(0, spin));
    const kE = clamp((s.t - s.at(2, "也能发电")) / 0.5);
    if (kE > 0) {
      ctx.globalAlpha = kE;
      for (let i = 0; i < 6; i++) {
        const a = s.t * 2 + i;
        sparkle(ctx, 820 + Math.cos(a) * 120, 420 + Math.sin(a * 1.4) * 60, 14, BOLT_YELLOW);
      }
      ctx.globalAlpha = 1;
    }
    spark(ctx, 1110, 300, 0.65, s.t, { talking: s.speaking });
  },

  lines(ctx, s) {
    sky(ctx, "#81D4FA", "#E1F5FE");
    const cam = s.t * 110;
    ctx.fillStyle = "#B39DDB";
    ctx.beginPath();
    ctx.moveTo(0, H);
    for (let x = 0; x <= W; x += 10) {
      const wx = x + cam * 0.3;
      ctx.lineTo(x, 330 - Math.abs(Math.sin(wx / 260)) * 140);
    }
    ctx.lineTo(W, H);
    ctx.fill();
    ctx.fillStyle = "#9CCC65";
    ctx.beginPath();
    ctx.moveTo(0, H);
    for (let x = 0; x <= W; x += 10) ctx.lineTo(x, 500 + Math.sin((x + cam * 0.7) / 200) * 18);
    ctx.lineTo(W, H);
    ctx.fill();
    ctx.fillStyle = "#FFD54F";
    for (let i = -1; i < 12; i++) {
      const x = ((i * 140 - cam) % (W + 140) + W + 140) % (W + 140) - 70;
      fillRR(ctx, x, 560, 90, 26, 13, "#AED581");
    }
    const spacing = 360;
    const first = Math.floor(cam / spacing) - 1;
    const pts = [];
    for (let i = first; i < first + 6; i++) {
      const x0 = i * spacing - cam;
      for (let k = 0; k < 12; k++) {
        const u = k / 12;
        pts.push([x0 + u * spacing, 300 + Math.sin(u * Math.PI) * 50]);
      }
    }
    for (const dy of [0, 35]) {
      polyline(ctx, pts.map(([x, y]) => [x, y + dy]), "#455A64", 4);
    }
    for (let i = first; i < first + 6; i++) tower(ctx, i * spacing - cam, 530, 1.05);
    const k0 = clamp((s.t - s.cue[1]) / 0.5);
    const sagY = (sx) => {
      const u = ((((sx + cam) % spacing) + spacing) % spacing) / spacing;
      return 300 + Math.sin(u * Math.PI) * 50;
    };
    if (k0 > 0) {
      ctx.save();
      ctx.globalAlpha = k0;
      ctx.shadowColor = "rgba(255,220,0,0.9)";
      ctx.shadowBlur = 16;
      const run = s.t * 150;
      for (let wx = Math.floor((cam - run) / 60) * 60; wx + run - cam < W + 60; wx += 60) {
        const sx = wx + run - cam;
        for (const dy of [0, 35]) circle(ctx, sx, sagY(sx) + dy, 7, BOLT_YELLOW);
      }
      ctx.restore();
    }
    const rideX = lerp(200, 1050, easeInOut(s.t / s.dur));
    spark(ctx, rideX, sagY(rideX) - 75, 0.55, s.t, { talking: s.speaking });
  },

  substation(ctx, s) {
    sky(ctx, "#B3E5FC", "#E1F5FE");
    hills(ctx, 500, ["#C5E1A5", "#AED581"]);
    substationBox(ctx, 620, 540, 1.05, s.t);
    const kL = (s.t - s.at(1, "变电站")) / 0.6;
    if (kL > 0) {
      ctx.save();
      ctx.translate(620, 120);
      ctx.scale(pop(kL), pop(kL));
      fillRR(ctx, -150, -45, 300, 90, 45, "#5C6BC0", "#fff", 6);
      label(ctx, "变电站", 0, 2, 60, "#fff", "#283593");
      ctx.restore();
    }
    const strong = 1 - clamp((s.t - s.at(2, "变得小")) / 1.2);
    jaggedBolt(ctx, 0, 280, 420, 330, s.t, "#FF7043", 10 + strong * 10, 1);
    jaggedBolt(ctx, 0, 330, 420, 360, s.t, "#FFCA28", 8 + strong * 8, 3);
    if (strong > 0.05) {
      ctx.save();
      ctx.translate(180, 230);
      ctx.scale(0.8 + strong * 0.4, 0.8 + strong * 0.4);
      label(ctx, "哇！", 0, 0, 48, "#FF7043", "#fff");
      ctx.restore();
    }
    const gentle = clamp((s.t - s.at(2, "变得小")) / 0.8);
    const outPts = [[820, 350], [950, 380], [1080, 400]];
    polyline(ctx, outPts, "#455A64", 4);
    if (gentle > 0) {
      ctx.globalAlpha = gentle;
      flow(ctx, outPts, s.t, { speed: 70, gap: 45, r: 6, color: "#FFF59D" });
      ctx.globalAlpha = 1;
    }
    townSkyline(ctx, 1110, 540, 0.55, gentle > 0.5 && s.line >= 2 && s.t > s.at(2, "才能进城"));
    spark(ctx, 870, 220, 0.55, s.t, { talking: s.speaking });
  },

  house(ctx, s) {
    sky(ctx, "#B3E5FC", "#E1F5FE");
    ctx.fillStyle = "#9CCC65";
    ctx.fillRect(0, 600, W, 120);
    ctx.fillStyle = "#8D6E63";
    ctx.fillRect(110, 200, 16, 400);
    ctx.fillRect(70, 215, 96, 10);
    fillRR(ctx, 330, 180, 720, 420, 10, "#FFF3E0", "#8D6E63", 8);
    ctx.beginPath();
    ctx.moveTo(300, 190);
    ctx.lineTo(690, 50);
    ctx.lineTo(1080, 190);
    ctx.closePath();
    ctx.fillStyle = "#EF6C57";
    ctx.fill();
    ctx.lineWidth = 6;
    ctx.strokeStyle = "#8D6E63";
    ctx.stroke();
    ctx.fillStyle = "#FFE0B2";
    ctx.fillRect(345, 195, 690, 390);
    const path1 = [[126, 220], [345, 240], [370, 240], [370, 330], [530, 330], [530, 300]];
    const path2 = [[370, 330], [800, 330], [800, 450], [880, 450]];
    const k0 = clamp((s.t - s.cue[1]) / (s.cue[2] - s.cue[1] + 0.01));
    const k1 = clamp((s.t - s.cue[2]) / 2);
    ctx.save();
    ctx.setLineDash([12, 10]);
    polyline(ctx, path1, "#FFB74D", 6);
    polyline(ctx, path2, "#FFB74D", 6);
    ctx.restore();
    const reach = clamp((s.t - s.cue[0]) / 1.5);
    flow(ctx, [[126, 220], [345, 240]], s.t, { speed: 120, gap: 40, upto: reach });
    flow(ctx, path1.slice(1), s.t, { speed: 120, gap: 40, upto: k0 });
    flow(ctx, path2, s.t, { speed: 120, gap: 40, upto: k1 });
    lightSwitch(ctx, 530, 300, k1 > 0.3, 0.8);
    socket(ctx, 880, 450, 0.55);
    const pulse = (k) => (k > 0.95 ? 1 + 0.1 * Math.sin(s.t * 8) : 1);
    if (k0 > 0.95) circle(ctx, 530, 300, 46 * pulse(k0), "rgba(255,235,59,0.25)");
    if (k1 > 0.95) circle(ctx, 880, 450, 50 * pulse(k1), "rgba(255,235,59,0.25)");
    spark(ctx, 200, 420, 0.5, s.t, { talking: s.speaking });
  },

  appliances(ctx, s) {
    room(ctx, 0);
    const kL = clamp((s.t - s.at(0, "灯亮了")) / 0.3);
    const show0 = pop((s.t - s.cue[0]) / 0.5);
    const show1 = pop((s.t - s.cue[1]) / 0.5);
    const show2 = pop((s.t - s.cue[2]) / 0.5);
    if (show0 > 0) {
      ctx.save();
      ctx.translate(250, 520);
      ctx.scale(show0, show0);
      lamp(ctx, 0, 0, kL, 1.1);
      ctx.restore();
    }
    if (show1 > 0) tv(ctx, 640, 330, 1.25 * show1, s.t, clamp((s.t - s.at(1, "电视")) / 0.3));
    if (show2 > 0) {
      ctx.save();
      ctx.translate(1030, 540);
      ctx.scale(show2, show2);
      fridge(ctx, 0, 0, 1.15, s.t, 1);
      const kI = pop((s.t - s.at(2, "冰淇淋")) / 0.5);
      if (kI > 0) iceCream(ctx, -150, -230, 0.9 * kI);
      ctx.restore();
    }
  },

  safety(ctx, s) {
    ctx.fillStyle = "#FFF3E0";
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = "#FFE0B2";
    ctx.fillRect(0, 480, W, 240);
    const show = (i) => clamp((s.t - s.cue[i]) / 0.5);
    const intro = show(1);
    spark(ctx, 640, lerp(300, 150, intro), lerp(1.1, 0.6, intro) * pop(s.t / 0.5), s.t, { talking: s.speaking });
    if (intro < 1) warning(ctx, 860, 220, pop((s.t - 0.2) / 0.5) * (1 - intro));
    if (s.line >= 1) {
      const k = show(1);
      socket(ctx, 260, 330, 1.1);
      const hx = lerp(560, 360, easeInOut(k));
      hand(ctx, hx, 340, 0.9);
      const kN = pop((s.t - s.at(1, "不能摸")) / 0.5);
      if (kN > 0) noSign(ctx, 280, 330, 110, kN);
    }
    if (s.line >= 2) {
      ctx.save();
      ctx.translate(640, 330);
      ctx.strokeStyle = "#424242";
      ctx.lineWidth = 10;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(-90, 120);
      ctx.bezierCurveTo(-60, 0, 60, 80, 80, -40);
      ctx.stroke();
      fillRR(ctx, 50, -110, 60, 70, 12, "#ECEFF1", "#757575", 4);
      fillRR(ctx, 62, -140, 10, 32, 3, "#BDBDBD");
      fillRR(ctx, 88, -140, 10, 32, 3, "#BDBDBD");
      ctx.restore();
      const kN = pop((s.t - s.at(2, "不能拉")) / 0.5);
      if (kN > 0) noSign(ctx, 650, 320, 110, kN);
    }
    if (s.line >= 3) {
      const k = pop(show(3));
      ctx.save();
      ctx.translate(1010, 540);
      ctx.scale(k * 1.25, k * 1.25);
      person(ctx, -60, 0, 0.95, s.t, { adult: true, shirt: "#64B5F6", hair: "#4E342E", wave: 0.5 });
      person(ctx, 70, 30, 0.8, s.t, { shirt: "#FF8A80" });
      ctx.restore();
      const kC = pop((s.t - s.at(3, "帮忙")) / 0.5);
      if (kC > 0) check(ctx, 1170, 170, 50, kC);
    }
  },

  recap(ctx, s) {
    sky(ctx, "#FFF8E1", "#FFECB3");
    const xs = [170, 490, 800, 1110];
    const active = s.line - 1;
    const icon = (i, draw) => {
      const on = active === i;
      const done = active > i || s.line === -1 && s.t > s.cue[4];
      const k = on ? 1 + 0.12 * Math.sin(Math.PI * clamp((s.t - s.cue[i + 1]) / 0.6)) : 1;
      ctx.save();
      ctx.globalAlpha = on || done || s.line >= 4 ? 1 : 0.4;
      if (on) circle(ctx, xs[i], 330, 130, "rgba(255, 213, 79, 0.55)");
      ctx.translate(xs[i], 330);
      ctx.scale(k, k);
      draw();
      ctx.restore();
    };
    icon(0, () => powerPlant(ctx, 0, 90, 0.45, s.t, active === 0 ? 1 : 0.3));
    icon(1, () => {
      tower(ctx, 0, 110, 0.8);
      flow(ctx, [[-120, -60], [120, -60]], s.t, { gap: 40, r: 6 });
    });
    icon(2, () => substationBox(ctx, 0, 100, 0.55, s.t));
    icon(3, () => house(ctx, 0, 100, 0.95, { lit: s.line >= 4 ? 1 : 0 }));
    for (let i = 0; i < 3; i++) {
      const k = clamp((s.t - s.cue[i + 2]) / 0.4);
      if (k > 0) {
        ctx.globalAlpha = k;
        arrow(ctx, xs[i] + 95, 470, xs[i + 1] - 95, 470, "#FF8A65", 10);
        ctx.globalAlpha = 1;
      }
    }
    const names = ["发电厂", "电线", "变电站", "我们家"];
    names.forEach((n, i) => {
      const vis = active >= i || s.line >= 4;
      if (vis) label(ctx, n, xs[i], 520, 40, "#fff", "#6D4C41");
    });
    if (s.line >= 4 && s.t > s.at(4, "我们家")) {
      for (let i = 0; i < 8; i++) {
        const a = s.t * 2 + i;
        sparkle(ctx, xs[3] + Math.cos(a) * 140, 300 + Math.sin(a) * 120, 14, "#FFC107");
      }
    }
    spark(ctx, 640, 110, 0.45, s.t, { talking: s.speaking });
  },

  ending(ctx, s) {
    const off = clamp((s.t - s.at(0, "关灯")) / 0.25);
    room(ctx, 0.15 + 0.35 * off);
    lamp(ctx, 220, 470, 1 - off, 1);
    lightSwitch(ctx, 360, 300, off < 0.5, 1.1);
    if (off > 0) {
      ctx.globalAlpha = off;
      check(ctx, 360, 180, 44, pop((s.t - s.at(0, "关灯")) / 0.5));
      ctx.globalAlpha = 1;
    }
    const k = clamp((s.t - s.cue[1]) / 0.5);
    if (k > 0) {
      ctx.fillStyle = `rgba(255, 248, 225, ${k * 0.85})`;
      ctx.fillRect(0, 0, W, H);
      confetti(ctx, s.t, k);
      spark(ctx, 640, 260, 1.1 * pop(k), s.t, { talking: s.speaking });
      const kB = pop((s.t - s.at(1, "再见")) / 0.6);
      if (kB > 0) {
        ctx.save();
        ctx.translate(640, 470);
        ctx.scale(kB, kB);
        label(ctx, "下次再见！", 0, 0, 80, "#FFB300", "#5D4037");
        ctx.restore();
      }
    } else {
      spark(ctx, 900, 320, 0.7, s.t, { talking: s.speaking });
    }
  },
};
