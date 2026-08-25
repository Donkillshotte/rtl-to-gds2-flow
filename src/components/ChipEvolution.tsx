"use client";

import { useEffect, useRef, useCallback } from "react";
import { useI18n } from "@/i18n/context";
import { ui } from "@/i18n/ui";
import type { StageId } from "@/data/stages";

const STAGE_ORDER: StageId[] = [
  "rtl", "verification", "synthesis", "floorplan", "pdn", "placement",
  "cts", "routing", "layout", "sta", "pv", "power", "package", "tapeout",
];

const STAGE_LABELS = {
  it: [
    "RTL — Logica", "Verifica", "Sintesi → Gate", "Floorplan + Macro",
    "PDN Mesh", "Placement", "Clock Tree", "Routing M1-Mn",
    "Fill + Seal", "STA Paths", "DRC/LVS Scan", "IR/EM", "Bump/PKG", "GDSII",
  ],
  en: [
    "RTL — Logic", "Verification", "Synth → Gate", "Floorplan + Macro",
    "PDN Mesh", "Placement", "Clock Tree", "Routing M1-Mn",
    "Fill + Seal", "STA Paths", "DRC/LVS Scan", "IR/EM", "Bump/PKG", "GDSII",
  ],
};

interface ChipEvolutionProps {
  activeStageIndex: number;
  compact?: boolean;
}

export function ChipEvolution({ activeStageIndex, compact = false }: ChipEvolutionProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { locale, t } = useI18n();
  const labels = locale === "it" ? STAGE_LABELS.it : STAGE_LABELS.en;

  const draw = useCallback(
    (ctx: CanvasRenderingContext2D, w: number, h: number, stage: number) => {
      ctx.clearRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;
      const dieW = w * 0.72;
      const dieH = h * 0.72;
      const dx = cx - dieW / 2;
      const dy = cy - dieH / 2;

      // Substrate
      ctx.fillStyle = "#0f172a";
      ctx.fillRect(0, 0, w, h);

      // Die outline (always visible from stage 0)
      if (stage >= 3) {
        ctx.strokeStyle = "rgba(34, 211, 238, 0.8)";
        ctx.lineWidth = 2;
        ctx.strokeRect(dx, dy, dieW, dieH);

        // Seal ring (stage >= 8 layout)
        if (stage >= 8) {
          ctx.strokeStyle = "rgba(96, 165, 250, 0.5)";
          ctx.lineWidth = 4;
          ctx.strokeRect(dx - 4, dy - 4, dieW + 8, dieH + 8);
        }
      }

      // RTL abstract blocks (stage >= 0)
      if (stage >= 0) {
        const blocks = [
          { x: 0.15, y: 0.2, w: 0.25, h: 0.2, c: "#22d3ee", l: "ALU" },
          { x: 0.45, y: 0.15, w: 0.2, h: 0.25, c: "#a78bfa", l: "REG" },
          { x: 0.2, y: 0.55, w: 0.3, h: 0.18, c: "#34d399", l: "FSM" },
          { x: 0.55, y: 0.5, w: 0.25, h: 0.22, c: "#f472b6", l: "MEM IF" },
        ];
        blocks.forEach((b) => {
          ctx.fillStyle = `${b.c}30`;
          ctx.strokeStyle = `${b.c}90`;
          ctx.lineWidth = 1.5;
          ctx.fillRect(dx + b.x * dieW, dy + b.y * dieH, b.w * dieW, b.h * dieH);
          ctx.strokeRect(dx + b.x * dieW, dy + b.y * dieH, b.w * dieW, b.h * dieH);
          if (!compact) {
            ctx.fillStyle = b.c;
            ctx.font = `${Math.max(8, w * 0.025)}px monospace`;
            ctx.textAlign = "center";
            ctx.fillText(b.l, dx + (b.x + b.w / 2) * dieW, dy + (b.y + b.h / 2) * dieH + 4);
          }
        });
      }

      // Synthesis: gate grid overlay (stage >= 2)
      if (stage >= 2 && stage < 5) {
        ctx.fillStyle = "rgba(167, 139, 250, 0.15)";
        const gs = 12;
        for (let i = 0; i < gs; i++) {
          for (let j = 0; j < gs; j++) {
            if ((i + j) % 2 === 0) {
              ctx.fillRect(
                dx + (i / gs) * dieW + 2,
                dy + (j / gs) * dieH + 2,
                dieW / gs - 4,
                dieH / gs - 4
              );
            }
          }
        }
      }

      // Floorplan macros (stage >= 3)
      if (stage >= 3) {
        const macros = [
          { x: 0.02, y: 0.05, w: 0.22, h: 0.28, l: "SRAM" },
          { x: 0.72, y: 0.05, w: 0.22, h: 0.28, l: "PLL" },
          { x: 0.02, y: 0.65, w: 0.18, h: 0.28, l: "IO" },
          { x: 0.72, y: 0.62, w: 0.22, h: 0.3, l: "ADC" },
        ];
        macros.forEach((m) => {
          ctx.fillStyle = "rgba(244, 114, 182, 0.35)";
          ctx.strokeStyle = "#f472b6";
          ctx.lineWidth = 2;
          ctx.fillRect(dx + m.x * dieW, dy + m.y * dieH, m.w * dieW, m.h * dieH);
          ctx.strokeRect(dx + m.x * dieW, dy + m.y * dieH, m.w * dieW, m.h * dieH);
          if (!compact) {
            ctx.fillStyle = "#f472b6";
            ctx.font = `bold ${Math.max(7, w * 0.022)}px monospace`;
            ctx.textAlign = "center";
            ctx.fillText(m.l, dx + (m.x + m.w / 2) * dieW, dy + (m.y + m.h / 2) * dieH + 3);
          }
        });
      }

      // PDN power mesh (stage >= 4)
      if (stage >= 4) {
        ctx.strokeStyle = "rgba(239, 68, 68, 0.35)";
        ctx.lineWidth = 2;
        const pitch = dieW / 8;
        for (let i = 0; i <= 8; i++) {
          ctx.beginPath();
          ctx.moveTo(dx + i * pitch, dy);
          ctx.lineTo(dx + i * pitch, dy + dieH);
          ctx.stroke();
        }
        ctx.strokeStyle = "rgba(59, 130, 246, 0.35)";
        for (let j = 0; j <= 8; j++) {
          ctx.beginPath();
          ctx.moveTo(dx, dy + j * (dieH / 8));
          ctx.lineTo(dx + dieW, dy + j * (dieH / 8));
          ctx.stroke();
        }
      }

      // Placement std cell rows (stage >= 5)
      if (stage >= 5) {
        const coreX = dx + dieW * 0.22;
        const coreY = dy + dieH * 0.28;
        const coreW = dieW * 0.52;
        const coreH = dieH * 0.38;
        const rows = 6;
        const cols = 14;
        for (let r = 0; r < rows; r++) {
          ctx.fillStyle = "rgba(52, 211, 153, 0.08)";
          ctx.fillRect(coreX, coreY + r * (coreH / rows), coreW, coreH / rows - 2);
          for (let c = 0; c < cols; c++) {
            ctx.fillStyle = "rgba(52, 211, 153, 0.55)";
            ctx.fillRect(
              coreX + c * (coreW / cols) + 1,
              coreY + r * (coreH / rows) + 2,
              coreW / cols - 3,
              coreH / rows - 6
            );
          }
        }
      }

      // Clock tree (stage >= 6)
      if (stage >= 6) {
        const rootX = cx;
        const rootY = dy + dieH * 0.12;
        ctx.strokeStyle = "rgba(251, 191, 36, 0.7)";
        ctx.lineWidth = 1.5;
        const sinks = [
          [dx + dieW * 0.3, dy + dieH * 0.45],
          [dx + dieW * 0.5, dy + dieH * 0.5],
          [dx + dieW * 0.7, dy + dieH * 0.45],
          [dx + dieW * 0.35, dy + dieH * 0.65],
          [dx + dieW * 0.65, dy + dieH * 0.65],
        ];
        sinks.forEach(([sx, sy]) => {
          ctx.beginPath();
          ctx.moveTo(rootX, rootY);
          ctx.lineTo(rootX, rootY + dieH * 0.15);
          ctx.lineTo(sx, sy - 10);
          ctx.lineTo(sx, sy);
          ctx.stroke();
        });
        ctx.fillStyle = "#fbbf24";
        ctx.beginPath();
        ctx.arc(rootX, rootY, 5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Clock mesh alternative highlight at stage >= 6
      if (stage >= 6) {
        ctx.strokeStyle = "rgba(251, 191, 36, 0.2)";
        ctx.lineWidth = 1;
        for (let i = 1; i < 4; i++) {
          ctx.beginPath();
          ctx.moveTo(dx + dieW * 0.2, dy + dieH * (0.35 + i * 0.08));
          ctx.lineTo(dx + dieW * 0.8, dy + dieH * (0.35 + i * 0.08));
          ctx.stroke();
        }
      }

      // Routing (stage >= 7)
      if (stage >= 7) {
        ctx.strokeStyle = "rgba(34, 211, 238, 0.6)";
        ctx.lineWidth = 1;
        const routes = [
          [dx + dieW * 0.25, dy + dieH * 0.35, dx + dieW * 0.25, dy + dieH * 0.55, dx + dieW * 0.45, dy + dieH * 0.55],
          [dx + dieW * 0.55, dy + dieH * 0.35, dx + dieW * 0.55, dy + dieH * 0.5, dx + dieW * 0.7, dy + dieH * 0.5],
          [dx + dieW * 0.4, dy + dieH * 0.4, dx + dieW * 0.6, dy + dieH * 0.4, dx + dieW * 0.6, dy + dieH * 0.6],
        ];
        routes.forEach((r) => {
          ctx.beginPath();
          ctx.moveTo(r[0], r[1]);
          for (let i = 2; i < r.length; i += 2) ctx.lineTo(r[i], r[i + 1]);
          ctx.stroke();
        });
        // Vias
        ctx.fillStyle = "#a78bfa";
        routes.forEach((r) => {
          for (let i = 2; i < r.length; i += 2) {
            ctx.beginPath();
            ctx.arc(r[i], r[i + 1], 2, 0, Math.PI * 2);
            ctx.fill();
          }
        });
      }

      // Metal fill dots (stage >= 8) — fixed positions for stable render
      if (stage >= 8) {
        ctx.fillStyle = "rgba(148, 163, 184, 0.15)";
        for (let i = 0; i < 40; i++) {
          const fx = dx + ((i * 17 + 7) % 100) / 100 * dieW;
          const fy = dy + ((i * 23 + 11) % 100) / 100 * dieH;
          ctx.fillRect(fx, fy, 3, 3);
        }
      }

      // STA critical path (stage >= 9)
      if (stage >= 9) {
        ctx.strokeStyle = "rgba(248, 113, 113, 0.9)";
        ctx.lineWidth = 2.5;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(dx + dieW * 0.15, dy + dieH * 0.4);
        ctx.lineTo(dx + dieW * 0.35, dy + dieH * 0.42);
        ctx.lineTo(dx + dieW * 0.55, dy + dieH * 0.48);
        ctx.lineTo(dx + dieW * 0.75, dy + dieH * 0.52);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // PV scan (stage >= 10)
      if (stage >= 10) {
        const scanY = dy + dieH * (0.2 + (Date.now() % 3000) / 3000 * 0.6);
        ctx.strokeStyle = "rgba(52, 211, 153, 0.6)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(dx, scanY);
        ctx.lineTo(dx + dieW, scanY);
        ctx.stroke();
        // Check marks
        if (!compact) {
          ["DRC", "LVS", "ERC"].forEach((chk, i) => {
            ctx.fillStyle = "#34d399";
            ctx.font = `${Math.max(7, w * 0.02)}px monospace`;
            ctx.fillText(`✓${chk}`, dx + dieW + 4, dy + 20 + i * 14);
          });
        }
      }

      // IR heatmap overlay (stage >= 11)
      if (stage >= 11) {
        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, dieW * 0.4);
        grad.addColorStop(0, "rgba(239, 68, 68, 0.25)");
        grad.addColorStop(0.5, "rgba(251, 191, 36, 0.1)");
        grad.addColorStop(1, "transparent");
        ctx.fillStyle = grad;
        ctx.fillRect(dx, dy, dieW, dieH);
      }

      // Package bumps (stage >= 12)
      if (stage >= 12) {
        ctx.fillStyle = "rgba(192, 132, 252, 0.7)";
        const bPitch = dieW / 10;
        for (let i = 1; i < 10; i++) {
          for (let j = 1; j < 10; j++) {
            if ((i + j) % 3 === 0) {
              ctx.beginPath();
              ctx.arc(dx + i * bPitch, dy - 8, 3, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        }
      }

      // GDSII glow (stage >= 13)
      if (stage >= 13) {
        ctx.shadowColor = "#60a5fa";
        ctx.shadowBlur = 20;
        ctx.strokeStyle = "#60a5fa";
        ctx.lineWidth = 3;
        ctx.strokeRect(dx, dy, dieW, dieH);
        ctx.shadowBlur = 0;
        if (!compact) {
          ctx.fillStyle = "#60a5fa";
          ctx.font = `bold ${Math.max(9, w * 0.028)}px monospace`;
          ctx.textAlign = "center";
          ctx.fillText("design.gds", cx, dy + dieH + 18);
        }
      }

      // Layer legend
      if (!compact) {
        const legend = labels.slice(0, stage + 1);
        ctx.fillStyle = "rgba(15, 23, 42, 0.85)";
        ctx.fillRect(dx, dy + dieH + 4, dieW, 14 + legend.length * 11);
        legend.forEach((l, i) => {
          ctx.fillStyle = i === stage ? "#22d3ee" : "#64748b";
          ctx.font = `${Math.max(7, w * 0.018)}px monospace`;
          ctx.textAlign = "left";
          ctx.fillText(`${i + 1}. ${l}`, dx + 4, dy + dieH + 16 + i * 11);
        });
      }
    },
    [compact, labels]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const render = () => {
      const dpr = devicePixelRatio;
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw(ctx, w, h, activeStageIndex);
      if (activeStageIndex >= 10) animId = requestAnimationFrame(render);
    };
    render();

    const onResize = () => render();
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
    };
  }, [activeStageIndex, draw]);

  return (
    <div className="glass rounded-2xl p-4">
      <h3 className="text-sm font-semibold text-cyan-400 mb-1">{t(ui.chipEvolution)}</h3>
      <p className="text-xs text-slate-500 mb-3">{t(ui.chipEvolutionDesc)}</p>
      <canvas
        ref={canvasRef}
        className={`w-full rounded-xl bg-slate-950 ${compact ? "h-48" : "h-64 md:h-80"}`}
      />
      <p className="text-xs font-mono text-slate-400 mt-2 text-center">
        {labels[activeStageIndex] ?? ""} ({activeStageIndex + 1}/14)
      </p>
    </div>
  );
}

export { STAGE_ORDER };
