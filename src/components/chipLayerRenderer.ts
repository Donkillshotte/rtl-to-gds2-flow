/**
 * Layer-by-layer chip renderer.
 * Each of the 14 PD stages adds one composited layer.
 * Previous layers render at reduced opacity; the active layer stays at full brightness.
 */

import {
  geom, rr, mulberry32, inMacro, CORE, REGIONS, BLOCKS, BUS,
  drawDieFoundation, drawSchematicBase,
} from "./chipGeometry";

export const NUM_LAYERS = 14;

export const LAYER_META = [
  { color: "#94a3b8", short: "RTL" },
  { color: "#34d399", short: "VER" },
  { color: "#a78bfa", short: "SYN" },
  { color: "#22d3ee", short: "FP" },
  { color: "#ef4444", short: "PDN" },
  { color: "#2dd4bf", short: "PLC" },
  { color: "#fbbf24", short: "CTS" },
  { color: "#67e8f9", short: "RT" },
  { color: "#94a3b8", short: "LAY" },
  { color: "#fb7185", short: "STA" },
  { color: "#6ee7b7", short: "PV" },
  { color: "#f97316", short: "PWR" },
  { color: "#eab308", short: "PKG" },
  { color: "#60a5fa", short: "GDS" },
];

/** Opacity: current layer = 1.0, older layers fade progressively with age */
export function layerAlpha(layer: number, current: number, t: number): number {
  if (layer > current) return 0;
  if (layer === current) return 0.96 + 0.04 * Math.sin(t * 0.005);
  const age = current - layer;
  // Older layers become increasingly transparent (min 0.06)
  return Math.max(0.06, 0.72 - age * 0.055);
}

/** Schematic layers ghost out once die floorplan appears */
export function schematicFade(layer: number, current: number): number {
  if (layer > 2 || current < 3) return 1;
  return 0.05;
}

/** Draw exactly one layer onto ctx (transparent bg except L0 and L3) */
export function drawSingleLayer(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  layer: number,
  compact: boolean
) {
  const g = geom(w, h);
  const { S, X, Y, L } = g;
  const fs = Math.max(7, L(0.026));

  ctx.clearRect(0, 0, w, h);

  switch (layer) {
    case 0: {
      ctx.fillStyle = "#060b16";
      ctx.fillRect(0, 0, w, h);
      drawSchematicBase(ctx, g, compact, false);
      break;
    }
    case 1: {
      // Verification badges + waveform
      for (const b of BLOCKS) {
        const bx = X(b.x0), by = Y(b.y0), bw = L(b.x1 - b.x0);
        ctx.fillStyle = "#34d399";
        ctx.beginPath();
        ctx.arc(bx + bw - 8, by + 8, 5.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#052e22";
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(bx + bw - 10.5, by + 8);
        ctx.lineTo(bx + bw - 8.5, by + 10);
        ctx.lineTo(bx + bw - 5.5, by + 5.5);
        ctx.stroke();
      }
      if (!compact) {
        const wy = Y(0.975);
        ctx.strokeStyle = "rgba(52,211,153,0.85)";
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        let px = X(0.06);
        let level = 0;
        ctx.moveTo(px, wy - level * 5);
        const rnd = mulberry32(42);
        while (px < X(0.72)) {
          px += 6 + rnd() * 14;
          ctx.lineTo(px, wy - level * 5);
          level = level ? 0 : 1;
          ctx.lineTo(px, wy - level * 5);
        }
        ctx.stroke();
        ctx.fillStyle = "#34d399";
        ctx.font = `${fs * 0.72}px ui-monospace, monospace`;
        ctx.textAlign = "left";
        ctx.fillText("SVA PASS · COV 98.7%", X(0.745), wy + 1);
      }
      break;
    }
    case 2: {
      // Synthesis gate overlay
      for (const b of BLOCKS) {
        const bx = X(b.x0), by = Y(b.y0), bw = L(b.x1 - b.x0), bh = L(b.y1 - b.y0);
        ctx.strokeStyle = "rgba(167,139,250,0.85)";
        ctx.lineWidth = 1.3;
        rr(ctx, bx, by, bw, bh, 5);
        ctx.stroke();
        ctx.save();
        rr(ctx, bx + 3, by + 3, bw - 6, bh - 6, 3);
        ctx.clip();
        ctx.strokeStyle = "rgba(167,139,250,0.28)";
        ctx.lineWidth = 0.6;
        const cell = Math.max(4, L(0.02));
        for (let yy = by + 4; yy < by + bh; yy += cell) {
          for (let xx = bx + 4; xx < bx + bw; xx += cell * 1.6) {
            ctx.strokeRect(xx, yy, cell * 1.1, cell * 0.7);
          }
        }
        ctx.restore();
      }
      if (!compact) {
        ctx.fillStyle = "#a78bfa";
        ctx.font = `${fs * 0.75}px ui-monospace, monospace`;
        ctx.textAlign = "center";
        ctx.fillText("1.2M std cells · LEC PASS", X(0.5), Y(0.585));
      }
      break;
    }
    case 3: {
      ctx.fillStyle = "#060b16";
      ctx.fillRect(0, 0, w, h);
      drawDieFoundation(ctx, g, compact);
      break;
    }
    case 4: {
      // PDN rings + straps
      const ringOff = L(0.006);
      const strapW = Math.max(1.6, L(0.007));
      ctx.lineWidth = Math.max(1.6, L(0.006));
      ctx.strokeStyle = "rgba(239,68,68,0.75)";
      ctx.strokeRect(X(CORE.x0) - ringOff, Y(CORE.y0) - ringOff, L(CORE.x1 - CORE.x0) + ringOff * 2, L(CORE.y1 - CORE.y0) + ringOff * 2);
      ctx.strokeStyle = "rgba(59,130,246,0.75)";
      ctx.strokeRect(X(CORE.x0) + ringOff, Y(CORE.y0) + ringOff, L(CORE.x1 - CORE.x0) - ringOff * 2, L(CORE.y1 - CORE.y0) - ringOff * 2);
      for (let u = 0.145; u < 0.90; u += 0.096) {
        ctx.fillStyle = "rgba(239,68,68,0.55)";
        ctx.fillRect(X(u), Y(CORE.y0), strapW, L(CORE.y1 - CORE.y0));
        ctx.fillStyle = "rgba(59,130,246,0.55)";
        ctx.fillRect(X(u + 0.024), Y(CORE.y0), strapW, L(CORE.y1 - CORE.y0));
      }
      for (let v = 0.14; v < 0.90; v += 0.115) {
        ctx.fillStyle = "rgba(239,68,68,0.35)";
        ctx.fillRect(X(CORE.x0), Y(v), L(CORE.x1 - CORE.x0), strapW * 0.7);
        ctx.fillStyle = "rgba(59,130,246,0.35)";
        ctx.fillRect(X(CORE.x0), Y(v + 0.028), L(CORE.x1 - CORE.x0), strapW * 0.7);
      }
      ctx.fillStyle = "rgba(255,255,255,0.45)";
      for (let u = 0.145; u < 0.90; u += 0.096) {
        for (let v = 0.14; v < 0.90; v += 0.115) {
          ctx.fillRect(X(u) - 0.5, Y(v) - 0.5, strapW + 1, strapW * 0.7 + 1);
        }
      }
      break;
    }
    case 5: {
      const rowH = Math.max(3, L(0.016));
      const rnd = mulberry32(777);
      for (let y = Y(CORE.y0) + 1; y < Y(CORE.y1) - rowH; y += rowH) {
        const v = (y - g.dy) / S;
        let x = X(CORE.x0) + 1;
        while (x < X(CORE.x1) - 1) {
          const cw = Math.max(2.5, rowH * (0.5 + rnd() * 1.8));
          const u = (x - g.dx) / S;
          if (!inMacro(u, v) && !inMacro(u + cw / S, v)) {
            const isSeq = rnd() < 0.12;
            const shade = 0.45 + rnd() * 0.35;
            ctx.fillStyle = isSeq ? `rgba(167,139,250,${shade})` : `rgba(45,180,140,${shade})`;
            ctx.fillRect(x, y + 0.6, cw - 0.8, rowH - 1.2);
          }
          x += cw;
        }
      }
      break;
    }
    case 6: {
      ctx.strokeStyle = "rgba(251,191,36,0.9)";
      const cx0 = 0.5, cy0 = 0.5;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(X(cx0), Y(0.05));
      ctx.lineTo(X(cx0), Y(cy0));
      ctx.stroke();
      ctx.fillStyle = "#fbbf24";
      ctx.beginPath();
      ctx.arc(X(cx0), Y(0.05), 3, 0, Math.PI * 2);
      ctx.fill();
      const drawH = (cx: number, cy: number, half: number, depth: number) => {
        if (depth === 0) {
          ctx.fillStyle = "rgba(251,191,36,0.95)";
          ctx.beginPath();
          ctx.arc(X(cx), Y(cy), 1.8, 0, Math.PI * 2);
          ctx.fill();
          return;
        }
        ctx.lineWidth = Math.max(0.8, depth * 0.75);
        ctx.strokeStyle = `rgba(251,191,36,${0.45 + depth * 0.15})`;
        ctx.beginPath();
        ctx.moveTo(X(cx - half), Y(cy));
        ctx.lineTo(X(cx + half), Y(cy));
        ctx.stroke();
        const vh = half * 0.72;
        for (const ex of [cx - half, cx + half]) {
          ctx.beginPath();
          ctx.moveTo(X(ex), Y(cy - vh));
          ctx.lineTo(X(ex), Y(cy + vh));
          ctx.stroke();
          drawH(ex, cy - vh, half / 2, depth - 1);
          drawH(ex, cy + vh, half / 2, depth - 1);
        }
      };
      drawH(cx0, cy0, 0.21, 3);
      break;
    }
    case 7: {
      const rnd = mulberry32(1234);
      const nSeg = compact ? 130 : 320;
      ctx.lineWidth = 0.7;
      for (let i = 0; i < nSeg; i++) {
        const u = CORE.x0 + rnd() * (CORE.x1 - CORE.x0 - 0.1);
        const v = CORE.y0 + rnd() * (CORE.y1 - CORE.y0);
        const len = 0.03 + rnd() * 0.09;
        if (inMacro(u, v, 0.004) || inMacro(u + len, v, 0.004)) continue;
        ctx.strokeStyle = `rgba(34,211,238,${0.2 + rnd() * 0.25})`;
        ctx.beginPath();
        ctx.moveTo(X(u), Y(v));
        ctx.lineTo(X(u + len), Y(v));
        ctx.stroke();
      }
      for (let i = 0; i < nSeg; i++) {
        const u = CORE.x0 + rnd() * (CORE.x1 - CORE.x0);
        const v = CORE.y0 + rnd() * (CORE.y1 - CORE.y0 - 0.1);
        const len = 0.03 + rnd() * 0.09;
        if (inMacro(u, v, 0.004) || inMacro(u, v + len, 0.004)) continue;
        ctx.strokeStyle = `rgba(167,139,250,${0.18 + rnd() * 0.2})`;
        ctx.beginPath();
        ctx.moveTo(X(u), Y(v));
        ctx.lineTo(X(u), Y(v + len));
        ctx.stroke();
      }
      const nets: [number, number][][] = [
        [[0.30, 0.21], [0.40, 0.21], [0.40, 0.30], [0.50, 0.30]],
        [[0.30, 0.46], [0.47, 0.46], [0.47, 0.60], [0.60, 0.60]],
        [[0.655, 0.28], [0.69, 0.28]],
        [[0.50, 0.50], [0.50, 0.63], [0.42, 0.63]],
      ];
      for (const net of nets) {
        ctx.strokeStyle = "rgba(103,232,249,0.9)";
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(X(net[0][0]), Y(net[0][1]));
        for (let i = 1; i < net.length; i++) ctx.lineTo(X(net[i][0]), Y(net[i][1]));
        ctx.stroke();
        ctx.fillStyle = "#e0f2fe";
        for (let i = 1; i < net.length - 1; i++) {
          ctx.fillRect(X(net[i][0]) - 1.5, Y(net[i][1]) - 1.5, 3, 3);
        }
      }
      break;
    }
    case 8: {
      ctx.strokeStyle = "rgba(148,163,184,0.7)";
      ctx.lineWidth = 2.2;
      ctx.strokeRect(X(0) - 3.5, Y(0) - 3.5, S + 7, S + 7);
      ctx.strokeStyle = "rgba(148,163,184,0.35)";
      ctx.lineWidth = 1;
      ctx.strokeRect(X(0) - 6.5, Y(0) - 6.5, S + 13, S + 13);
      const rnd = mulberry32(555);
      ctx.fillStyle = "rgba(148,163,184,0.14)";
      for (let i = 0; i < (compact ? 80 : 180); i++) {
        const u = CORE.x0 + rnd() * (CORE.x1 - CORE.x0);
        const v = CORE.y0 + rnd() * (CORE.y1 - CORE.y0);
        if (inMacro(u, v, 0)) continue;
        ctx.fillRect(X(u), Y(v), 2, 2);
      }
      break;
    }
    case 9: {
      const path: [number, number][] = [
        [0.30, 0.42], [0.40, 0.42], [0.40, 0.24], [0.55, 0.24], [0.55, 0.19], [0.72, 0.19],
      ];
      ctx.save();
      ctx.shadowColor = "rgba(251,113,133,0.95)";
      ctx.shadowBlur = 9;
      ctx.strokeStyle = "#fb7185";
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(X(path[0][0]), Y(path[0][1]));
      for (let i = 1; i < path.length; i++) ctx.lineTo(X(path[i][0]), Y(path[i][1]));
      ctx.stroke();
      ctx.restore();
      ctx.fillStyle = "#fb7185";
      ctx.fillRect(X(path[0][0]) - 3, Y(path[0][1]) - 3, 6, 6);
      ctx.beginPath();
      ctx.arc(X(path[path.length - 1][0]), Y(path[path.length - 1][1]), 3.2, 0, Math.PI * 2);
      ctx.fill();
      if (!compact) {
        ctx.fillStyle = "#fda4af";
        ctx.font = `${fs * 0.82}px ui-monospace, monospace`;
        ctx.textAlign = "left";
        ctx.fillText("WNS -0.012ns", X(0.56), Y(0.155));
      }
      break;
    }
    case 10: {
      if (!compact) {
        const labels = ["DRC 0", "LVS ✓", "ANT ✓"];
        ctx.font = `${fs * 0.78}px ui-monospace, monospace`;
        labels.forEach((lab, i) => {
          const bx = X(0.665) + i * L(0.09);
          const by = Y(0.035);
          ctx.fillStyle = "rgba(6,78,59,0.9)";
          rr(ctx, bx, by - fs * 0.85, L(0.082), fs * 1.3, 3);
          ctx.fill();
          ctx.fillStyle = "#6ee7b7";
          ctx.textAlign = "center";
          ctx.fillText(lab, bx + L(0.041), by);
        });
      }
      break;
    }
    case 11: {
      const hot = (u: number, v: number, r: number, c: string, a: number) => {
        const gradH = ctx.createRadialGradient(X(u), Y(v), 0, X(u), Y(v), L(r));
        gradH.addColorStop(0, c.replace("A", String(a)));
        gradH.addColorStop(0.55, c.replace("A", String(a * 0.4)));
        gradH.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = gradH;
        ctx.fillRect(X(CORE.x0), Y(CORE.y0), L(CORE.x1 - CORE.x0), L(CORE.y1 - CORE.y0));
      };
      hot(0.50, 0.30, 0.22, "rgba(239,68,68,A)", 0.5);
      hot(0.80, 0.28, 0.16, "rgba(251,146,60,A)", 0.38);
      hot(0.50, 0.84, 0.18, "rgba(251,191,36,A)", 0.25);
      break;
    }
    case 12: {
      const pad = L(0.055);
      ctx.fillStyle = "#131c2b";
      rr(ctx, X(0) - pad, Y(0) - pad, S + pad * 2, S + pad * 2, 8);
      ctx.fill();
      ctx.strokeStyle = "rgba(71,85,105,0.9)";
      ctx.lineWidth = 1.5;
      ctx.stroke();
      const n = 10;
      const r = Math.max(2.2, L(0.015));
      for (let i = 0; i <= n; i++) {
        for (let j = 0; j <= n; j++) {
          const u = 0.10 + (i * 0.80) / n;
          const v = 0.10 + (j * 0.80) / n;
          const isPwr = (i + j) % 3 === 0;
          ctx.beginPath();
          ctx.arc(X(u), Y(v), r, 0, Math.PI * 2);
          ctx.fillStyle = isPwr ? "rgba(234,179,8,0.9)" : "rgba(192,132,252,0.8)";
          ctx.fill();
          ctx.strokeStyle = "rgba(15,23,42,0.9)";
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
      break;
    }
    case 13: {
      ctx.save();
      ctx.shadowColor = "rgba(96,165,250,0.95)";
      ctx.shadowBlur = 18;
      ctx.strokeStyle = "#60a5fa";
      ctx.lineWidth = 2.5;
      ctx.strokeRect(X(0), Y(0), S, S);
      ctx.restore();
      if (!compact) {
        ctx.fillStyle = "rgba(30,58,138,0.9)";
        rr(ctx, X(0.70), Y(0.935), L(0.215), fs * 1.6, 3);
        ctx.fill();
        ctx.fillStyle = "#93c5fd";
        ctx.font = `bold ${fs * 0.85}px ui-monospace, monospace`;
        ctx.textAlign = "center";
        ctx.fillText("design.gds ✓", X(0.8075), Y(0.935) + fs * 1.12);
      }
      break;
    }
  }
}

/** Animated effects drawn on top of the active layer each frame */
export function drawLayerAnimation(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  layer: number,
  t: number
) {
  const g = geom(w, h);
  const { S, X, Y, L } = g;

  switch (layer) {
    case 0: {
      // RTL packets with staggered phases
      for (let k = 0; k < BLOCKS.length; k++) {
        const b = BLOCKS[k];
        const phase = ((t / 2800) + k * 0.18) % 1;
        const cx = X((b.x0 + b.x1) / 2);
        const from = b.y1 < BUS.y0 ? Y(b.y1) : Y(b.y0);
        const to = b.y1 < BUS.y0 ? Y(BUS.y0) : Y(BUS.y1);
        const py = from + (to - from) * phase;
        ctx.fillStyle = "rgba(34,211,238,0.9)";
        ctx.beginPath();
        ctx.arc(cx, py, 2.4, 0, Math.PI * 2);
        ctx.fill();
      }
      // packets along the bus
      const busPhase = (t % 2200) / 2200;
      const bx = X(BUS.x0 + busPhase * (BUS.x1 - BUS.x0));
      const by = Y((BUS.y0 + BUS.y1) / 2);
      ctx.fillStyle = "#67e8f9";
      ctx.beginPath();
      ctx.arc(bx, by, 3, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case 1: {
      // Animated waveform scroll
      const wy = Y(0.975);
      const offset = (t * 0.04) % 20;
      ctx.strokeStyle = "rgba(52,211,153,0.5)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let px = X(0.06) - offset; px < X(0.72); px += 4) {
        const level = Math.sin(px * 0.08 + t * 0.008) > 0 ? 5 : 0;
        ctx.lineTo(px, wy - level);
      }
      ctx.stroke();
      break;
    }
    case 2: {
      // Synthesis cell placement shimmer
      const pulse = 0.4 + 0.6 * Math.sin(t * 0.01);
      for (const b of BLOCKS) {
        const bx = X(b.x0), by = Y(b.y0), bw = L(b.x1 - b.x0), bh = L(b.y1 - b.y0);
        ctx.strokeStyle = `rgba(167,139,250,${0.15 + pulse * 0.25})`;
        ctx.lineWidth = 0.8;
        ctx.strokeRect(bx + 4, by + 4, bw - 8, bh - 8);
      }
      break;
    }
    case 3: {
      // Floorplan region highlight sweep
      const idx = Math.floor((t / 1800) % REGIONS.length);
      const r = REGIONS[idx];
      ctx.strokeStyle = "rgba(34,211,238,0.55)";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 3]);
      ctx.strokeRect(X(r.x0), Y(r.y0), L(r.x1 - r.x0), L(r.y1 - r.y0));
      ctx.setLineDash([]);
      break;
    }
    case 4: {
      // Current pulse along power straps
      const phase = (t % 2400) / 2400;
      const py = Y(CORE.y0 + phase * (CORE.y1 - CORE.y0));
      ctx.fillStyle = "rgba(239,68,68,0.25)";
      ctx.fillRect(X(CORE.x0), py - 2, L(CORE.x1 - CORE.x0), 4);
      break;
    }
    case 5: {
      // Placement density scan line
      const sy = Y(CORE.y0 + ((t % 2400) / 2400) * (CORE.y1 - CORE.y0));
      ctx.fillStyle = "rgba(45,212,191,0.12)";
      ctx.fillRect(X(CORE.x0), sy - 3, L(CORE.x1 - CORE.x0), 6);
      break;
    }
    case 6: {
      // Clock pulse: trunk then H-tree arms
      const phase = (t % 2400) / 2400;
      ctx.fillStyle = "rgba(251,191,36,0.9)";
      if (phase < 0.35) {
        const local = phase / 0.35;
        ctx.beginPath();
        ctx.arc(X(0.5), Y(0.05 + local * 0.45), 3.2, 0, Math.PI * 2);
        ctx.fill();
      } else {
        const local = (phase - 0.35) / 0.65;
        const spread = 0.21 * Math.min(1, local * 1.4);
        for (const sx of [-1, 1]) {
          ctx.beginPath();
          ctx.arc(X(0.5 + sx * spread), Y(0.5), 2.6, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.arc(X(0.5 + sx * spread), Y(0.5 - spread * 0.72), 2.1, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.arc(X(0.5 + sx * spread), Y(0.5 + spread * 0.72), 2.1, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      break;
    }
    case 7: {
      const nets: [number, number][][] = [
        [[0.30, 0.21], [0.40, 0.21], [0.40, 0.30], [0.50, 0.30]],
        [[0.30, 0.46], [0.47, 0.46], [0.47, 0.60], [0.60, 0.60]],
        [[0.655, 0.28], [0.69, 0.28]],
        [[0.50, 0.50], [0.50, 0.63], [0.42, 0.63]],
      ];
      nets.forEach((net, ni) => {
        const speed = 550 + ni * 90;
        const idx = Math.floor((t / speed + ni * 0.3) % (net.length - 1));
        const frac = ((t / speed) % 1);
        const a = net[idx], b = net[idx + 1];
        const px = a[0] + (b[0] - a[0]) * frac;
        const py = a[1] + (b[1] - a[1]) * frac;
        ctx.fillStyle = ni % 2 ? "#c4b5fd" : "#67e8f9";
        ctx.beginPath();
        ctx.arc(X(px), Y(py), 2.4, 0, Math.PI * 2);
        ctx.fill();
      });
      break;
    }
    case 8: {
      // Seal ring corner pulse
      const pulse = 0.3 + 0.7 * Math.sin(t * 0.008);
      ctx.strokeStyle = `rgba(148,163,184,${pulse * 0.5})`;
      ctx.lineWidth = 2;
      ctx.strokeRect(X(0) - 3.5, Y(0) - 3.5, S + 7, S + 7);
      break;
    }
    case 9: {
      const path: [number, number][] = [
        [0.30, 0.42], [0.40, 0.42], [0.40, 0.24], [0.55, 0.24], [0.55, 0.19], [0.72, 0.19],
      ];
      let dist = 0;
      const seglen: number[] = [];
      for (let i = 0; i < path.length - 1; i++) {
        const dx = path[i + 1][0] - path[i][0];
        const dy = path[i + 1][1] - path[i][1];
        const d = Math.hypot(dx, dy);
        seglen.push(d);
        dist += d;
      }
      let remain = ((t / 1400) % 1) * dist;
      let px = path[0][0], py = path[0][1];
      for (let i = 0; i < seglen.length; i++) {
        if (remain <= seglen[i]) {
          const f = seglen[i] === 0 ? 0 : remain / seglen[i];
          px = path[i][0] + (path[i + 1][0] - path[i][0]) * f;
          py = path[i][1] + (path[i + 1][1] - path[i][1]) * f;
          break;
        }
        remain -= seglen[i];
        px = path[i + 1][0];
        py = path[i + 1][1];
      }
      ctx.fillStyle = "#fb7185";
      ctx.shadowColor = "rgba(251,113,133,0.9)";
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(X(px), Y(py), 3.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
      break;
    }
    case 10: {
      const phase = (t % 2800) / 2800;
      const sy = Y(0.06) + phase * S * 0.88;
      ctx.strokeStyle = "rgba(52,211,153,0.9)";
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(X(0), sy);
      ctx.lineTo(X(1), sy);
      ctx.stroke();
      ctx.strokeStyle = "rgba(110,231,183,0.9)";
      ctx.beginPath();
      ctx.arc(X(0.5), sy, 11, 0, Math.PI * 2);
      ctx.stroke();
      break;
    }
    case 11: {
      const pulse = 0.5 + 0.5 * Math.sin(t * 0.006);
      const gradH = ctx.createRadialGradient(X(0.5), Y(0.30), 0, X(0.5), Y(0.30), L(0.15 + pulse * 0.08));
      gradH.addColorStop(0, `rgba(239,68,68,${0.15 + pulse * 0.15})`);
      gradH.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = gradH;
      ctx.fillRect(X(CORE.x0), Y(CORE.y0), L(CORE.x1 - CORE.x0), L(CORE.y1 - CORE.y0));
      break;
    }
    case 12: {
      // Bump power ripple
      const pulse = 0.5 + 0.5 * Math.sin(t * 0.007);
      const n = 10;
      for (let i = 0; i <= n; i += 3) {
        for (let j = 0; j <= n; j += 3) {
          const u = 0.10 + (i * 0.80) / n;
          const v = 0.10 + (j * 0.80) / n;
          ctx.beginPath();
          ctx.arc(X(u), Y(v), 3 + pulse * 2, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(234,179,8,${0.2 + pulse * 0.3})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
      break;
    }
    case 13: {
      const phase = (t % 3600) / 3600;
      const bx = X(-0.4 + phase * 1.8);
      const grad = ctx.createLinearGradient(bx, 0, bx + S * 0.25, 0);
      grad.addColorStop(0, "rgba(255,255,255,0)");
      grad.addColorStop(0.5, "rgba(186,230,253,0.1)");
      grad.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = grad;
      ctx.fillRect(X(0), Y(0), S, S);
      break;
    }
  }
}

export function buildLayerCanvas(
  w: number,
  h: number,
  dpr: number,
  layer: number,
  compact: boolean
): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = Math.max(1, Math.round(w * dpr));
  c.height = Math.max(1, Math.round(h * dpr));
  const ctx = c.getContext("2d")!;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  drawSingleLayer(ctx, w, h, layer, compact);
  return c;
}

export function compositeLayers(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  layers: HTMLCanvasElement[],
  current: number,
  t: number,
  dpr: number,
  revealStart = 0
) {
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = "#060b16";
  ctx.fillRect(0, 0, w, h);

  const reveal = Math.min(1, Math.max(0, (t - revealStart) / 850));

  for (let i = 0; i <= current; i++) {
    let alpha = layerAlpha(i, current, t) * schematicFade(i, current);
    if (i === current) alpha *= 0.35 + 0.65 * reveal;
    if (alpha <= 0.01) continue;
    ctx.globalAlpha = alpha;
    ctx.drawImage(layers[i], 0, 0, layers[i].width, layers[i].height, 0, 0, w, h);
  }
  ctx.globalAlpha = 1;

  const g = geom(w, h);
  const pulse = 0.35 + 0.25 * Math.sin(t * 0.006);
  const meta = LAYER_META[current];
  ctx.strokeStyle = meta?.color ?? "#22d3ee";
  ctx.globalAlpha = 0.35 + pulse * 0.45;
  ctx.lineWidth = 2;
  ctx.strokeRect(g.dx - 2, g.dy - 2, g.S + 4, g.S + 4);
  ctx.globalAlpha = 1;

  drawLayerAnimation(ctx, w, h, current, t);
}
