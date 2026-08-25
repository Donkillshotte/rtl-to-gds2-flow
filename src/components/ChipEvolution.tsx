"use client";

import { useEffect, useRef } from "react";
import { useI18n } from "@/i18n/context";
import { ui } from "@/i18n/ui";
import { useIsMobile } from "@/hooks/useIsMobile";
import type { StageId } from "@/data/stages";

const STAGE_ORDER: StageId[] = [
  "rtl", "verification", "synthesis", "floorplan", "pdn", "placement",
  "cts", "routing", "layout", "sta", "pv", "power", "package", "tapeout",
];

const STAGE_LABELS = {
  it: [
    "RTL — Schema a blocchi", "Verifica funzionale", "Sintesi → Netlist gate",
    "Floorplan — Die, IO, Macro", "PDN — Ring + Straps", "Placement — Std cell rows",
    "CTS — Clock H-Tree", "Routing — Segnali M1-M9", "Finishing — Fill + Seal ring",
    "STA — Critical path", "PV — DRC/LVS scan", "Power — IR drop heatmap",
    "Package — Bump array", "Tapeout — GDSII",
  ],
  en: [
    "RTL — Block diagram", "Functional verification", "Synthesis → Gate netlist",
    "Floorplan — Die, IO, Macros", "PDN — Rings + Straps", "Placement — Std cell rows",
    "CTS — Clock H-Tree", "Routing — Signals M1-M9", "Finishing — Fill + Seal ring",
    "STA — Critical path", "PV — DRC/LVS scan", "Power — IR drop heatmap",
    "Package — Bump array", "Tapeout — GDSII",
  ],
};

/* Deterministic RNG so the layout never jumps around */
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function rr(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

interface Rect { x0: number; y0: number; x1: number; y1: number }

/* Macro floorplan — normalized die coordinates, hand-placed like a real SoC */
const MACROS: (Rect & { label: string; kind: "sram" | "analog" | "hatch" | "lanes" })[] = [
  { x0: 0.105, y0: 0.105, x1: 0.30, y1: 0.325, label: "SRAM0", kind: "sram" },
  { x0: 0.105, y0: 0.355, x1: 0.30, y1: 0.575, label: "SRAM1", kind: "sram" },
  { x0: 0.105, y0: 0.605, x1: 0.225, y1: 0.725, label: "ROM", kind: "sram" },
  { x0: 0.685, y0: 0.55, x1: 0.775, y1: 0.645, label: "PLL", kind: "analog" },
  { x0: 0.805, y0: 0.55, x1: 0.905, y1: 0.725, label: "SERDES", kind: "hatch" },
  { x0: 0.105, y0: 0.765, x1: 0.905, y1: 0.905, label: "DDR PHY", kind: "lanes" },
];

const REGIONS: (Rect & { label: string })[] = [
  { x0: 0.335, y0: 0.105, x1: 0.655, y1: 0.50, label: "CPU" },
  { x0: 0.69, y0: 0.105, x1: 0.905, y1: 0.50, label: "GPU" },
  { x0: 0.335, y0: 0.54, x1: 0.655, y1: 0.725, label: "DSP" },
];

const CORE: Rect = { x0: 0.085, y0: 0.085, x1: 0.915, y1: 0.915 };
const HALO = 0.014;

function inMacro(u: number, v: number, halo = HALO): boolean {
  for (const m of MACROS) {
    if (u > m.x0 - halo && u < m.x1 + halo && v > m.y0 - halo && v < m.y1 + halo) return true;
  }
  return false;
}

interface Geo {
  S: number; dx: number; dy: number;
  X: (u: number) => number; Y: (v: number) => number; L: (u: number) => number;
}

function geom(w: number, h: number): Geo {
  const S = Math.min(w, h) * 0.92;
  const dx = (w - S) / 2;
  const dy = (h - S) / 2;
  return { S, dx, dy, X: (u) => dx + u * S, Y: (v) => dy + v * S, L: (u) => u * S };
}

/* ================= schematic view — stages 0..2 ================= */

const BLOCKS: (Rect & { label: string })[] = [
  { x0: 0.06, y0: 0.10, x1: 0.44, y1: 0.34, label: "CPU_CLUSTER" },
  { x0: 0.56, y0: 0.10, x1: 0.94, y1: 0.34, label: "GPU" },
  { x0: 0.06, y0: 0.62, x1: 0.30, y1: 0.90, label: "L2_SRAM" },
  { x0: 0.38, y0: 0.62, x1: 0.62, y1: 0.90, label: "DDR_CTRL" },
  { x0: 0.70, y0: 0.62, x1: 0.94, y1: 0.90, label: "PERIPH_IO" },
];
const BUS: Rect = { x0: 0.06, y0: 0.45, x1: 0.94, y1: 0.51 };

function drawSchematic(ctx: CanvasRenderingContext2D, g: Geo, stage: number, compact: boolean) {
  const { X, Y, L } = g;
  const fs = Math.max(8, L(0.032));

  // Bus (NoC)
  const grad = ctx.createLinearGradient(X(BUS.x0), 0, X(BUS.x1), 0);
  grad.addColorStop(0, "rgba(34,211,238,0.25)");
  grad.addColorStop(0.5, "rgba(34,211,238,0.45)");
  grad.addColorStop(1, "rgba(34,211,238,0.25)");
  ctx.fillStyle = grad;
  rr(ctx, X(BUS.x0), Y(BUS.y0), L(BUS.x1 - BUS.x0), L(BUS.y1 - BUS.y0), 3);
  ctx.fill();
  ctx.strokeStyle = "rgba(34,211,238,0.8)";
  ctx.lineWidth = 1;
  ctx.stroke();
  if (!compact) {
    ctx.fillStyle = "#67e8f9";
    ctx.font = `${fs * 0.85}px ui-monospace, monospace`;
    ctx.textAlign = "center";
    ctx.fillText("AXI NoC", X(0.5), Y((BUS.y0 + BUS.y1) / 2) + fs * 0.32);
  }

  // Connections block ↔ bus
  ctx.strokeStyle = "rgba(148,163,184,0.55)";
  ctx.lineWidth = 1.2;
  for (const b of BLOCKS) {
    const cx = X((b.x0 + b.x1) / 2);
    const from = b.y1 < BUS.y0 ? Y(b.y1) : Y(b.y0);
    const to = b.y1 < BUS.y0 ? Y(BUS.y0) : Y(BUS.y1);
    ctx.beginPath();
    ctx.moveTo(cx, from);
    ctx.lineTo(cx, to);
    ctx.stroke();
    // port marker
    ctx.fillStyle = "rgba(148,163,184,0.9)";
    ctx.fillRect(cx - 2, (from + to) / 2 - 2, 4, 4);
  }

  // Blocks
  for (const b of BLOCKS) {
    const bx = X(b.x0), by = Y(b.y0), bw = L(b.x1 - b.x0), bh = L(b.y1 - b.y0);
    ctx.fillStyle = "rgba(30,41,59,0.85)";
    rr(ctx, bx, by, bw, bh, 5);
    ctx.fill();
    ctx.strokeStyle = stage >= 2 ? "rgba(167,139,250,0.9)" : "rgba(100,116,139,0.9)";
    ctx.lineWidth = 1.3;
    if (stage < 2) ctx.setLineDash([5, 3]);
    ctx.stroke();
    ctx.setLineDash([]);

    // Stage 0: RTL pseudo-code lines / Stage 2: gate texture
    if (stage >= 2) {
      // netlist: fine gate grid
      ctx.save();
      rr(ctx, bx + 3, by + 3, bw - 6, bh - 6, 3);
      ctx.clip();
      ctx.strokeStyle = "rgba(167,139,250,0.22)";
      ctx.lineWidth = 0.6;
      const cell = Math.max(4, L(0.02));
      for (let yy = by + 4; yy < by + bh; yy += cell) {
        for (let xx = bx + 4; xx < bx + bw; xx += cell * 1.6) {
          ctx.strokeRect(xx, yy, cell * 1.1, cell * 0.7);
        }
      }
      ctx.restore();
    } else {
      // RTL text bars
      ctx.fillStyle = "rgba(148,163,184,0.28)";
      const lh = Math.max(3, bh * 0.09);
      const rnd = mulberry32(b.label.length * 7 + 13);
      for (let i = 0; i < 4; i++) {
        const wFrac = 0.35 + rnd() * 0.45;
        ctx.fillRect(bx + bw * 0.08, by + bh * 0.28 + i * lh * 1.7, bw * wFrac, lh);
      }
    }

    if (!compact) {
      ctx.fillStyle = stage >= 2 ? "#c4b5fd" : "#94a3b8";
      ctx.font = `bold ${fs * 0.8}px ui-monospace, monospace`;
      ctx.textAlign = "center";
      ctx.fillText(b.label, bx + bw / 2, by + fs * 1.1);
    }

    // Stage 1: verification badges
    if (stage >= 1) {
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
  }

  // Stage 1: waveform strip
  if (stage >= 1 && !compact) {
    const wy = Y(0.975);
    ctx.strokeStyle = "rgba(52,211,153,0.8)";
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    let px = X(0.06);
    let level = 0;
    ctx.moveTo(px, wy - level * 5);
    const rnd = mulberry32(42);
    while (px < X(0.72)) {
      const seg = 6 + rnd() * 14;
      px += seg;
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

  // Stage 2: netlist stats
  if (stage >= 2 && !compact) {
    ctx.fillStyle = "#a78bfa";
    ctx.font = `${fs * 0.75}px ui-monospace, monospace`;
    ctx.textAlign = "center";
    ctx.fillText("1.2M std cells · LEC PASS", X(0.5), Y(0.585));
  }
}

/* ================= die view — stages 3..13 ================= */

function drawDie(ctx: CanvasRenderingContext2D, g: Geo, stage: number, compact: boolean) {
  const { S, X, Y, L } = g;
  const fs = Math.max(7, L(0.026));

  /* Package substrate under the die */
  if (stage >= 12) {
    const pad = L(0.055);
    ctx.fillStyle = "#131c2b";
    rr(ctx, X(0) - pad, Y(0) - pad, S + pad * 2, S + pad * 2, 8);
    ctx.fill();
    ctx.strokeStyle = "rgba(71,85,105,0.9)";
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }

  /* Die substrate */
  const dieGrad = ctx.createLinearGradient(X(0), Y(0), X(1), Y(1));
  dieGrad.addColorStop(0, "#111a2c");
  dieGrad.addColorStop(1, "#0a1220");
  ctx.fillStyle = dieGrad;
  ctx.fillRect(X(0), Y(0), S, S);
  ctx.strokeStyle = "rgba(56,189,248,0.55)";
  ctx.lineWidth = 1.4;
  ctx.strokeRect(X(0), Y(0), S, S);

  /* Seal ring (finishing) */
  if (stage >= 8) {
    ctx.strokeStyle = "rgba(148,163,184,0.65)";
    ctx.lineWidth = 2.2;
    ctx.strokeRect(X(0) - 3.5, Y(0) - 3.5, S + 7, S + 7);
    ctx.strokeStyle = "rgba(148,163,184,0.3)";
    ctx.lineWidth = 1;
    ctx.strokeRect(X(0) - 6.5, Y(0) - 6.5, S + 13, S + 13);
  }

  /* IO pad ring */
  const padW = L(0.030), padH = L(0.036), gap = L(0.014);
  ctx.fillStyle = "rgba(51,65,85,0.95)";
  ctx.strokeStyle = "rgba(100,116,139,0.8)";
  ctx.lineWidth = 0.7;
  for (let u = 0.09; u < 0.89; u += (padW + gap) / S) {
    // top + bottom
    ctx.fillRect(X(u), Y(0.012), padW, padH);
    ctx.strokeRect(X(u), Y(0.012), padW, padH);
    ctx.fillRect(X(u), Y(0.988) - padH, padW, padH);
    ctx.strokeRect(X(u), Y(0.988) - padH, padW, padH);
    // left + right
    ctx.fillRect(X(0.012), Y(u), padH, padW);
    ctx.strokeRect(X(0.012), Y(u), padH, padW);
    ctx.fillRect(X(0.988) - padH, Y(u), padH, padW);
    ctx.strokeRect(X(0.988) - padH, Y(u), padH, padW);
  }

  /* Core boundary */
  ctx.strokeStyle = "rgba(34,211,238,0.35)";
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 3]);
  ctx.strokeRect(X(CORE.x0), Y(CORE.y0), L(CORE.x1 - CORE.x0), L(CORE.y1 - CORE.y0));
  ctx.setLineDash([]);

  /* ---- Placement: standard cell rows (before macros so macros overlap cleanly) ---- */
  if (stage >= 5) {
    const rowH = Math.max(3, L(0.016));
    const rnd = mulberry32(777);
    for (let y = Y(CORE.y0) + 1; y < Y(CORE.y1) - rowH; y += rowH) {
      const v = (y - g.dy) / S;
      // subtle row background
      ctx.fillStyle = "rgba(20,32,48,0.5)";
      let x = X(CORE.x0) + 1;
      const xEnd = X(CORE.x1) - 1;
      while (x < xEnd) {
        const cw = Math.max(2.5, rowH * (0.5 + rnd() * 1.8));
        const u = (x - g.dx) / S;
        if (!inMacro(u, v) && !inMacro(u + cw / S, v)) {
          const isSeq = rnd() < 0.12;
          const shade = 0.32 + rnd() * 0.3;
          ctx.fillStyle = isSeq
            ? `rgba(167,139,250,${shade})`
            : `rgba(45,180,140,${shade})`;
          ctx.fillRect(x, y + 0.6, cw - 0.8, rowH - 1.2);
        }
        x += cw;
      }
    }
  }

  /* ---- Region boundaries + labels ---- */
  for (const r of REGIONS) {
    ctx.strokeStyle = "rgba(34,211,238,0.28)";
    ctx.lineWidth = 0.8;
    ctx.setLineDash([3, 3]);
    ctx.strokeRect(X(r.x0), Y(r.y0), L(r.x1 - r.x0), L(r.y1 - r.y0));
    ctx.setLineDash([]);
    if (!compact) {
      ctx.fillStyle = "rgba(103,232,249,0.75)";
      ctx.font = `bold ${fs}px ui-monospace, monospace`;
      ctx.textAlign = "left";
      ctx.fillText(r.label, X(r.x0) + 3, Y(r.y0) + fs + 2);
    }
  }

  /* ---- Macros ---- */
  for (const m of MACROS) {
    const mx = X(m.x0), my = Y(m.y0), mw = L(m.x1 - m.x0), mh = L(m.y1 - m.y0);
    ctx.fillStyle = "rgba(24,32,50,0.97)";
    ctx.fillRect(mx, my, mw, mh);

    // internal texture per macro type
    ctx.save();
    ctx.beginPath();
    ctx.rect(mx + 1.5, my + 1.5, mw - 3, mh - 3);
    ctx.clip();
    if (m.kind === "sram") {
      // memory banks: horizontal word-line stripes + decoder column
      ctx.fillStyle = "rgba(244,114,182,0.13)";
      const bankH = mh / 4;
      for (let i = 0; i < 4; i++) {
        if (i % 2 === 0) ctx.fillRect(mx, my + i * bankH, mw, bankH);
      }
      ctx.strokeStyle = "rgba(244,114,182,0.25)";
      ctx.lineWidth = 0.5;
      for (let yy = my + 3; yy < my + mh; yy += Math.max(2.5, mh * 0.045)) {
        ctx.beginPath();
        ctx.moveTo(mx + mw * 0.16, yy);
        ctx.lineTo(mx + mw - 2, yy);
        ctx.stroke();
      }
      // decoder strip
      ctx.fillStyle = "rgba(244,114,182,0.28)";
      ctx.fillRect(mx + 2, my + 2, mw * 0.11, mh - 4);
    } else if (m.kind === "analog") {
      // PLL: concentric rings (inductor look)
      ctx.strokeStyle = "rgba(251,191,36,0.5)";
      ctx.lineWidth = 1;
      const cx = mx + mw / 2, cy = my + mh / 2;
      for (let r = Math.min(mw, mh) * 0.36; r > 2; r -= Math.max(2.5, mh * 0.12)) {
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.stroke();
      }
    } else if (m.kind === "hatch") {
      ctx.strokeStyle = "rgba(96,165,250,0.3)";
      ctx.lineWidth = 0.8;
      for (let d = -mh; d < mw; d += Math.max(3, mw * 0.12)) {
        ctx.beginPath();
        ctx.moveTo(mx + d, my + mh);
        ctx.lineTo(mx + d + mh, my);
        ctx.stroke();
      }
    } else if (m.kind === "lanes") {
      // DDR byte lanes: repeated vertical blocks
      const laneW = mw / 8;
      for (let i = 0; i < 8; i++) {
        ctx.fillStyle = i % 2 ? "rgba(96,165,250,0.10)" : "rgba(96,165,250,0.18)";
        ctx.fillRect(mx + i * laneW + 1.5, my + 2, laneW - 3, mh - 4);
        ctx.strokeStyle = "rgba(96,165,250,0.35)";
        ctx.lineWidth = 0.6;
        ctx.strokeRect(mx + i * laneW + 1.5, my + 2, laneW - 3, mh - 4);
      }
    }
    ctx.restore();

    // macro border + pins facing core
    ctx.strokeStyle = "rgba(244,114,182,0.85)";
    ctx.lineWidth = 1.2;
    ctx.strokeRect(mx, my, mw, mh);
    ctx.fillStyle = "rgba(244,114,182,0.7)";
    const pinN = Math.max(4, Math.floor(mw / 9));
    for (let i = 1; i < pinN; i++) {
      ctx.fillRect(mx + (i * mw) / pinN - 1, my - 2.5, 2, 2.5);
      ctx.fillRect(mx + (i * mw) / pinN - 1, my + mh, 2, 2.5);
    }

    if (!compact || mw > 50) {
      ctx.fillStyle = "#f9a8d4";
      ctx.font = `bold ${Math.min(fs, mh * 0.4)}px ui-monospace, monospace`;
      ctx.textAlign = "center";
      ctx.fillText(m.label, mx + mw / 2, my + mh / 2 + fs * 0.35);
    }
  }

  /* ---- PDN: rings + straps ---- */
  if (stage >= 4) {
    // core ring: VDD (red) outer, VSS (blue) inner
    const ringOff = L(0.006);
    ctx.lineWidth = Math.max(1.6, L(0.006));
    ctx.strokeStyle = "rgba(239,68,68,0.6)";
    ctx.strokeRect(X(CORE.x0) - ringOff, Y(CORE.y0) - ringOff, L(CORE.x1 - CORE.x0) + ringOff * 2, L(CORE.y1 - CORE.y0) + ringOff * 2);
    ctx.strokeStyle = "rgba(59,130,246,0.6)";
    ctx.strokeRect(X(CORE.x0) + ringOff, Y(CORE.y0) + ringOff, L(CORE.x1 - CORE.x0) - ringOff * 2, L(CORE.y1 - CORE.y0) - ringOff * 2);

    // vertical straps M8 (VDD/VSS pairs)
    const strapW = Math.max(1.6, L(0.007));
    for (let u = 0.145; u < 0.90; u += 0.096) {
      ctx.fillStyle = "rgba(239,68,68,0.42)";
      ctx.fillRect(X(u), Y(CORE.y0), strapW, L(CORE.y1 - CORE.y0));
      ctx.fillStyle = "rgba(59,130,246,0.42)";
      ctx.fillRect(X(u + 0.024), Y(CORE.y0), strapW, L(CORE.y1 - CORE.y0));
    }
    // horizontal straps M7 (thinner)
    for (let v = 0.14; v < 0.90; v += 0.115) {
      ctx.fillStyle = "rgba(239,68,68,0.26)";
      ctx.fillRect(X(CORE.x0), Y(v), L(CORE.x1 - CORE.x0), strapW * 0.7);
      ctx.fillStyle = "rgba(59,130,246,0.26)";
      ctx.fillRect(X(CORE.x0), Y(v + 0.028), L(CORE.x1 - CORE.x0), strapW * 0.7);
    }
    // via arrays at intersections
    ctx.fillStyle = "rgba(255,255,255,0.35)";
    for (let u = 0.145; u < 0.90; u += 0.096) {
      for (let v = 0.14; v < 0.90; v += 0.115) {
        ctx.fillRect(X(u) - 0.5, Y(v) - 0.5, strapW + 1, strapW * 0.7 + 1);
      }
    }
  }

  /* ---- CTS: H-tree ---- */
  if (stage >= 6) {
    ctx.strokeStyle = "rgba(251,191,36,0.85)";
    const cx0 = 0.5, cy0 = 0.5;
    // root feed from top clock pad
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
        ctx.fillStyle = "rgba(251,191,36,0.9)";
        ctx.beginPath();
        ctx.arc(X(cx), Y(cy), 1.6, 0, Math.PI * 2);
        ctx.fill();
        return;
      }
      ctx.lineWidth = Math.max(0.7, depth * 0.7);
      ctx.strokeStyle = `rgba(251,191,36,${0.35 + depth * 0.16})`;
      // horizontal bar
      ctx.beginPath();
      ctx.moveTo(X(cx - half), Y(cy));
      ctx.lineTo(X(cx + half), Y(cy));
      ctx.stroke();
      // vertical bars at both ends
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
  }

  /* ---- Routing ---- */
  if (stage >= 7) {
    const rnd = mulberry32(1234);
    const nSeg = compact ? 130 : 320;
    // M2 horizontal (cyan)
    ctx.lineWidth = 0.7;
    for (let i = 0; i < nSeg; i++) {
      const u = CORE.x0 + rnd() * (CORE.x1 - CORE.x0 - 0.1);
      const v = CORE.y0 + rnd() * (CORE.y1 - CORE.y0);
      const len = 0.03 + rnd() * 0.09;
      if (inMacro(u, v, 0.004) || inMacro(u + len, v, 0.004)) continue;
      ctx.strokeStyle = `rgba(34,211,238,${0.14 + rnd() * 0.18})`;
      ctx.beginPath();
      ctx.moveTo(X(u), Y(v));
      ctx.lineTo(X(u + len), Y(v));
      ctx.stroke();
    }
    // M3 vertical (violet)
    for (let i = 0; i < nSeg; i++) {
      const u = CORE.x0 + rnd() * (CORE.x1 - CORE.x0);
      const v = CORE.y0 + rnd() * (CORE.y1 - CORE.y0 - 0.1);
      const len = 0.03 + rnd() * 0.09;
      if (inMacro(u, v, 0.004) || inMacro(u, v + len, 0.004)) continue;
      ctx.strokeStyle = `rgba(167,139,250,${0.12 + rnd() * 0.16})`;
      ctx.beginPath();
      ctx.moveTo(X(u), Y(v));
      ctx.lineTo(X(u), Y(v + len));
      ctx.stroke();
    }
    // highlighted global nets with vias
    const nets: [number, number][][] = [
      [[0.30, 0.21], [0.40, 0.21], [0.40, 0.30], [0.50, 0.30]],
      [[0.30, 0.46], [0.47, 0.46], [0.47, 0.60], [0.60, 0.60]],
      [[0.655, 0.28], [0.69, 0.28]],
      [[0.50, 0.50], [0.50, 0.63], [0.42, 0.63]],
      [[0.62, 0.72], [0.62, 0.765]],
    ];
    for (const net of nets) {
      ctx.strokeStyle = "rgba(103,232,249,0.85)";
      ctx.lineWidth = 1.3;
      ctx.beginPath();
      ctx.moveTo(X(net[0][0]), Y(net[0][1]));
      for (let i = 1; i < net.length; i++) ctx.lineTo(X(net[i][0]), Y(net[i][1]));
      ctx.stroke();
      ctx.fillStyle = "#e0f2fe";
      for (let i = 1; i < net.length - 1; i++) {
        ctx.fillRect(X(net[i][0]) - 1.5, Y(net[i][1]) - 1.5, 3, 3);
      }
    }
  }

  /* ---- Metal fill stipple ---- */
  if (stage >= 8) {
    const rnd = mulberry32(555);
    ctx.fillStyle = "rgba(148,163,184,0.09)";
    const n = compact ? 80 : 180;
    for (let i = 0; i < n; i++) {
      const u = CORE.x0 + rnd() * (CORE.x1 - CORE.x0);
      const v = CORE.y0 + rnd() * (CORE.y1 - CORE.y0);
      if (inMacro(u, v, 0)) continue;
      ctx.fillRect(X(u), Y(v), 2, 2);
    }
  }

  /* ---- STA critical path ---- */
  if (stage >= 9) {
    const path: [number, number][] = [
      [0.30, 0.42], [0.40, 0.42], [0.40, 0.24], [0.55, 0.24], [0.55, 0.19], [0.72, 0.19],
    ];
    ctx.save();
    ctx.shadowColor = "rgba(251,113,133,0.9)";
    ctx.shadowBlur = 7;
    ctx.strokeStyle = "#fb7185";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(X(path[0][0]), Y(path[0][1]));
    for (let i = 1; i < path.length; i++) ctx.lineTo(X(path[i][0]), Y(path[i][1]));
    ctx.stroke();
    ctx.restore();
    // launch FF (square) / capture FF (circle)
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
  }

  /* ---- PV check pills ---- */
  if (stage >= 10 && !compact) {
    const labels = ["DRC 0", "LVS ✓", "ANT ✓"];
    ctx.font = `${fs * 0.78}px ui-monospace, monospace`;
    labels.forEach((lab, i) => {
      const bx = X(0.665) + i * L(0.09);
      const by = Y(0.035);
      ctx.fillStyle = "rgba(6,78,59,0.85)";
      rr(ctx, bx, by - fs * 0.85, L(0.082), fs * 1.3, 3);
      ctx.fill();
      ctx.fillStyle = "#6ee7b7";
      ctx.textAlign = "center";
      ctx.fillText(lab, bx + L(0.041), by);
    });
  }

  /* ---- IR heatmap ---- */
  if (stage >= 11) {
    const hot = (u: number, v: number, r: number, c: string, a: number) => {
      const gradH = ctx.createRadialGradient(X(u), Y(v), 0, X(u), Y(v), L(r));
      gradH.addColorStop(0, c.replace("A", String(a)));
      gradH.addColorStop(0.55, c.replace("A", String(a * 0.4)));
      gradH.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = gradH;
      ctx.fillRect(X(CORE.x0), Y(CORE.y0), L(CORE.x1 - CORE.x0), L(CORE.y1 - CORE.y0));
    };
    hot(0.50, 0.30, 0.22, "rgba(239,68,68,A)", 0.4);
    hot(0.80, 0.28, 0.16, "rgba(251,146,60,A)", 0.32);
    hot(0.50, 0.84, 0.18, "rgba(251,191,36,A)", 0.2);
    // colorbar
    if (!compact) {
      const cbX = X(0.925) + 6, cbY = Y(0.35), cbH = L(0.3);
      const cb = ctx.createLinearGradient(0, cbY, 0, cbY + cbH);
      cb.addColorStop(0, "#ef4444");
      cb.addColorStop(0.5, "#fbbf24");
      cb.addColorStop(1, "#34d399");
      ctx.fillStyle = cb;
      ctx.fillRect(cbX, cbY, 5, cbH);
      ctx.fillStyle = "#94a3b8";
      ctx.font = `${fs * 0.68}px ui-monospace, monospace`;
      ctx.textAlign = "left";
      ctx.fillText("mV", cbX - 2, cbY - 4);
    }
  }

  /* ---- Bump array ---- */
  if (stage >= 12) {
    const n = 10;
    const r = Math.max(2.2, L(0.015));
    for (let i = 0; i <= n; i++) {
      for (let j = 0; j <= n; j++) {
        const u = 0.10 + (i * 0.80) / n;
        const v = 0.10 + (j * 0.80) / n;
        const isPwr = (i + j) % 3 === 0;
        ctx.beginPath();
        ctx.arc(X(u), Y(v), r, 0, Math.PI * 2);
        ctx.fillStyle = isPwr ? "rgba(234,179,8,0.85)" : "rgba(192,132,252,0.75)";
        ctx.fill();
        ctx.strokeStyle = "rgba(15,23,42,0.9)";
        ctx.lineWidth = 0.8;
        ctx.stroke();
        // highlight
        ctx.beginPath();
        ctx.arc(X(u) - r * 0.3, Y(v) - r * 0.3, r * 0.3, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255,0.45)";
        ctx.fill();
      }
    }
  }

  /* ---- GDSII final ---- */
  if (stage >= 13) {
    ctx.save();
    ctx.shadowColor = "rgba(96,165,250,0.9)";
    ctx.shadowBlur = 16;
    ctx.strokeStyle = "#60a5fa";
    ctx.lineWidth = 2;
    ctx.strokeRect(X(0), Y(0), S, S);
    ctx.restore();
    if (!compact) {
      ctx.fillStyle = "rgba(30,58,138,0.85)";
      rr(ctx, X(0.70), Y(0.935), L(0.215), fs * 1.6, 3);
      ctx.fill();
      ctx.fillStyle = "#93c5fd";
      ctx.font = `bold ${fs * 0.85}px ui-monospace, monospace`;
      ctx.textAlign = "center";
      ctx.fillText("design.gds ✓", X(0.8075), Y(0.935) + fs * 1.12);
    }
  }
}

function drawScene(ctx: CanvasRenderingContext2D, w: number, h: number, stage: number, compact: boolean) {
  ctx.clearRect(0, 0, w, h);
  // canvas background
  ctx.fillStyle = "#060b16";
  ctx.fillRect(0, 0, w, h);
  const g = geom(w, h);
  if (stage < 3) drawSchematic(ctx, g, stage, compact);
  else drawDie(ctx, g, stage, compact);
}

function buildScene(w: number, h: number, dpr: number, stage: number, compact: boolean): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = Math.max(1, Math.round(w * dpr));
  c.height = Math.max(1, Math.round(h * dpr));
  const ctx = c.getContext("2d")!;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  drawScene(ctx, w, h, stage, compact);
  return c;
}

/* Animated overlays (scan line, shimmer) */
function drawOverlays(ctx: CanvasRenderingContext2D, w: number, h: number, stage: number, t: number) {
  const g = geom(w, h);
  const { S, X, Y } = g;
  if (stage === 10) {
    const phase = (t % 2800) / 2800;
    const sy = Y(0.06) + phase * S * 0.88;
    const grad = ctx.createLinearGradient(0, sy - 26, 0, sy);
    grad.addColorStop(0, "rgba(52,211,153,0)");
    grad.addColorStop(1, "rgba(52,211,153,0.16)");
    ctx.fillStyle = grad;
    ctx.fillRect(X(0), sy - 26, S, 26);
    ctx.strokeStyle = "rgba(52,211,153,0.85)";
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(X(0), sy);
    ctx.lineTo(X(1), sy);
    ctx.stroke();
    // magnifier
    ctx.strokeStyle = "rgba(110,231,183,0.9)";
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.arc(X(0.5), sy, 11, 0, Math.PI * 2);
    ctx.stroke();
  }
  if (stage === 13) {
    const phase = (t % 3600) / 3600;
    const bx = X(-0.4 + phase * 1.8);
    const grad = ctx.createLinearGradient(bx, 0, bx + S * 0.25, 0);
    grad.addColorStop(0, "rgba(255,255,255,0)");
    grad.addColorStop(0.5, "rgba(186,230,253,0.07)");
    grad.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = grad;
    ctx.fillRect(X(0), Y(0), S, S);
  }
}

interface ChipEvolutionProps {
  activeStageIndex: number;
  compact?: boolean;
}

export function ChipEvolution({ activeStageIndex, compact = false }: ChipEvolutionProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { locale, t } = useI18n();
  const isMobile = useIsMobile();
  const isCompact = compact || isMobile;
  const labels = locale === "it" ? STAGE_LABELS.it : STAGE_LABELS.en;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let visible = false;
    let revealStart = 0;
    let base: HTMLCanvasElement | null = null;
    let top: HTMLCanvasElement | null = null;
    let W = 0, H = 0, DPR = 1;

    const rebuild = () => {
      W = canvas.offsetWidth;
      H = canvas.offsetHeight;
      DPR = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.round(W * DPR);
      canvas.height = Math.round(H * DPR);
      base = activeStageIndex > 0 ? buildScene(W, H, DPR, activeStageIndex - 1, isCompact) : null;
      top = buildScene(W, H, DPR, activeStageIndex, isCompact);
    };

    const frame = (now: number) => {
      if (!visible) return;
      if (!top) rebuild();
      const reveal = Math.min(1, (now - revealStart) / 750);
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      ctx.clearRect(0, 0, W, H);
      if (base && reveal < 1) {
        ctx.globalAlpha = 1;
        ctx.drawImage(base, 0, 0, base.width, base.height, 0, 0, W, H);
      }
      ctx.globalAlpha = base ? reveal : 1;
      if (top) ctx.drawImage(top, 0, 0, top.width, top.height, 0, 0, W, H);
      ctx.globalAlpha = 1;
      drawOverlays(ctx, W, H, activeStageIndex, now);

      const needsLoop = reveal < 1 || activeStageIndex === 10 || activeStageIndex === 13;
      if (needsLoop) raf = requestAnimationFrame(frame);
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && !visible) {
            visible = true;
            revealStart = performance.now();
            rebuild();
            raf = requestAnimationFrame(frame);
          } else if (!e.isIntersecting) {
            visible = false;
            cancelAnimationFrame(raf);
          }
        }
      },
      { threshold: 0.15 }
    );
    io.observe(canvas);

    const onResize = () => {
      if (!visible) return;
      rebuild();
      revealStart = performance.now() - 750;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(frame);
    };
    window.addEventListener("resize", onResize);

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, [activeStageIndex, isCompact, locale]);

  return (
    <div className="glass rounded-2xl p-3 sm:p-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs sm:text-sm font-semibold text-cyan-400">{t(ui.chipEvolution)}</h3>
        <span className="text-[10px] sm:text-xs font-mono text-slate-500">
          {activeStageIndex + 1}/14
        </span>
      </div>
      <canvas
        ref={canvasRef}
        className={`w-full rounded-xl ${isCompact ? "h-56 sm:h-64" : "h-72 md:h-96"}`}
      />
      {/* stage progress segments */}
      <div className="flex gap-0.5 mt-2.5">
        {STAGE_ORDER.map((id, i) => (
          <div
            key={id}
            className="h-1 flex-1 rounded-full transition-colors"
            style={{
              background:
                i < activeStageIndex
                  ? "rgba(34,211,238,0.45)"
                  : i === activeStageIndex
                    ? "#22d3ee"
                    : "rgba(51,65,85,0.6)",
            }}
          />
        ))}
      </div>
      <p className="text-[10px] sm:text-xs font-mono text-slate-400 mt-2 text-center truncate">
        {labels[activeStageIndex] ?? ""}
      </p>
    </div>
  );
}

export { STAGE_ORDER };
