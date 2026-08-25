/**
 * Shared geometry, constants, and base drawing helpers for chip visualization.
 */

export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function rr(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

export interface Rect {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
}

export interface Geo {
  S: number;
  dx: number;
  dy: number;
  X: (u: number) => number;
  Y: (v: number) => number;
  L: (u: number) => number;
}

export function geom(w: number, h: number): Geo {
  const S = Math.min(w, h) * 0.92;
  const dx = (w - S) / 2;
  const dy = (h - S) / 2;
  return { S, dx, dy, X: (u) => dx + u * S, Y: (v) => dy + v * S, L: (u) => u * S };
}

export const CORE: Rect = { x0: 0.085, y0: 0.085, x1: 0.915, y1: 0.915 };
const HALO = 0.014;

export const MACROS: (Rect & { label: string; kind: "sram" | "analog" | "hatch" | "lanes" })[] = [
  { x0: 0.105, y0: 0.105, x1: 0.30, y1: 0.325, label: "SRAM0", kind: "sram" },
  { x0: 0.105, y0: 0.355, x1: 0.30, y1: 0.575, label: "SRAM1", kind: "sram" },
  { x0: 0.105, y0: 0.605, x1: 0.225, y1: 0.725, label: "ROM", kind: "sram" },
  { x0: 0.685, y0: 0.55, x1: 0.775, y1: 0.645, label: "PLL", kind: "analog" },
  { x0: 0.805, y0: 0.55, x1: 0.905, y1: 0.725, label: "SERDES", kind: "hatch" },
  { x0: 0.105, y0: 0.765, x1: 0.905, y1: 0.905, label: "DDR PHY", kind: "lanes" },
];

export const REGIONS: (Rect & { label: string })[] = [
  { x0: 0.335, y0: 0.105, x1: 0.655, y1: 0.50, label: "CPU" },
  { x0: 0.69, y0: 0.105, x1: 0.905, y1: 0.50, label: "GPU" },
  { x0: 0.335, y0: 0.54, x1: 0.655, y1: 0.725, label: "DSP" },
];

export const BLOCKS: (Rect & { label: string })[] = [
  { x0: 0.06, y0: 0.10, x1: 0.44, y1: 0.34, label: "CPU_CLUSTER" },
  { x0: 0.56, y0: 0.10, x1: 0.94, y1: 0.34, label: "GPU" },
  { x0: 0.06, y0: 0.62, x1: 0.30, y1: 0.90, label: "L2_SRAM" },
  { x0: 0.38, y0: 0.62, x1: 0.62, y1: 0.90, label: "DDR_CTRL" },
  { x0: 0.70, y0: 0.62, x1: 0.94, y1: 0.90, label: "PERIPH_IO" },
];

export const BUS: Rect = { x0: 0.06, y0: 0.45, x1: 0.94, y1: 0.51 };

export function inMacro(u: number, v: number, halo = HALO): boolean {
  for (const m of MACROS) {
    if (u > m.x0 - halo && u < m.x1 + halo && v > m.y0 - halo && v < m.y1 + halo) return true;
  }
  return false;
}

/** RTL block diagram — base layer (no verification / synthesis overlays) */
export function drawSchematicBase(
  ctx: CanvasRenderingContext2D,
  g: Geo,
  compact: boolean,
  dashed = true
) {
  const { X, Y, L } = g;
  const fs = Math.max(8, L(0.032));

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
    ctx.fillStyle = "rgba(148,163,184,0.9)";
    ctx.fillRect(cx - 2, (from + to) / 2 - 2, 4, 4);
  }

  for (const b of BLOCKS) {
    const bx = X(b.x0),
      by = Y(b.y0),
      bw = L(b.x1 - b.x0),
      bh = L(b.y1 - b.y0);
    ctx.fillStyle = "rgba(30,41,59,0.85)";
    rr(ctx, bx, by, bw, bh, 5);
    ctx.fill();
    ctx.strokeStyle = "rgba(100,116,139,0.9)";
    ctx.lineWidth = 1.3;
    if (dashed) ctx.setLineDash([5, 3]);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = "rgba(148,163,184,0.28)";
    const lh = Math.max(3, bh * 0.09);
    const rnd = mulberry32(b.label.length * 7 + 13);
    for (let i = 0; i < 4; i++) {
      const wFrac = 0.35 + rnd() * 0.45;
      ctx.fillRect(bx + bw * 0.08, by + bh * 0.28 + i * lh * 1.7, bw * wFrac, lh);
    }

    if (!compact) {
      ctx.fillStyle = "#94a3b8";
      ctx.font = `bold ${fs * 0.8}px ui-monospace, monospace`;
      ctx.textAlign = "center";
      ctx.fillText(b.label, bx + bw / 2, by + fs * 1.1);
    }
  }
}

export function drawMacroBlock(
  ctx: CanvasRenderingContext2D,
  g: Geo,
  m: (typeof MACROS)[number],
  compact: boolean
) {
  const { X, Y, L } = g;
  const fs = Math.max(7, L(0.026));
  const mx = X(m.x0),
    my = Y(m.y0),
    mw = L(m.x1 - m.x0),
    mh = L(m.y1 - m.y0);

  ctx.fillStyle = "rgba(24,32,50,0.97)";
  ctx.fillRect(mx, my, mw, mh);

  ctx.save();
  ctx.beginPath();
  ctx.rect(mx + 1.5, my + 1.5, mw - 3, mh - 3);
  ctx.clip();
  if (m.kind === "sram") {
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
    ctx.fillStyle = "rgba(244,114,182,0.28)";
    ctx.fillRect(mx + 2, my + 2, mw * 0.11, mh - 4);
  } else if (m.kind === "analog") {
    ctx.strokeStyle = "rgba(251,191,36,0.5)";
    ctx.lineWidth = 1;
    const cx = mx + mw / 2,
      cy = my + mh / 2;
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

/** Die floorplan foundation — substrate, IO ring, regions, macros */
export function drawDieFoundation(
  ctx: CanvasRenderingContext2D,
  g: Geo,
  compact: boolean
) {
  const { S, X, Y, L } = g;
  const fs = Math.max(7, L(0.026));

  const dieGrad = ctx.createLinearGradient(X(0), Y(0), X(1), Y(1));
  dieGrad.addColorStop(0, "#111a2c");
  dieGrad.addColorStop(1, "#0a1220");
  ctx.fillStyle = dieGrad;
  ctx.fillRect(X(0), Y(0), S, S);
  ctx.strokeStyle = "rgba(56,189,248,0.55)";
  ctx.lineWidth = 1.4;
  ctx.strokeRect(X(0), Y(0), S, S);

  const padW = L(0.030),
    padH = L(0.036),
    gap = L(0.014);
  ctx.fillStyle = "rgba(51,65,85,0.95)";
  ctx.strokeStyle = "rgba(100,116,139,0.8)";
  ctx.lineWidth = 0.7;
  for (let u = 0.09; u < 0.89; u += (padW + gap) / S) {
    ctx.fillRect(X(u), Y(0.012), padW, padH);
    ctx.strokeRect(X(u), Y(0.012), padW, padH);
    ctx.fillRect(X(u), Y(0.988) - padH, padW, padH);
    ctx.strokeRect(X(u), Y(0.988) - padH, padW, padH);
    ctx.fillRect(X(0.012), Y(u), padH, padW);
    ctx.strokeRect(X(0.012), Y(u), padH, padW);
    ctx.fillRect(X(0.988) - padH, Y(u), padH, padW);
    ctx.strokeRect(X(0.988) - padH, Y(u), padH, padW);
  }

  ctx.strokeStyle = "rgba(34,211,238,0.35)";
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 3]);
  ctx.strokeRect(X(CORE.x0), Y(CORE.y0), L(CORE.x1 - CORE.x0), L(CORE.y1 - CORE.y0));
  ctx.setLineDash([]);

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

  for (const m of MACROS) {
    drawMacroBlock(ctx, g, m, compact);
  }
}
