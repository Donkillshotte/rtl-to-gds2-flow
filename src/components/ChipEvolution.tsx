"use client";

import { useEffect, useRef } from "react";
import { useI18n } from "@/i18n/context";
import { ui } from "@/i18n/ui";
import { useIsMobile } from "@/hooks/useIsMobile";
import type { StageId } from "@/data/stages";
import {
  NUM_LAYERS,
  LAYER_META,
  buildLayerCanvas,
  compositeLayers,
  layerAlpha,
  schematicFade,
} from "./chipLayerRenderer";

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
    let layers: HTMLCanvasElement[] = [];
    let W = 0,
      H = 0,
      DPR = 1;
    let revealStart = 0;

    const rebuild = () => {
      W = canvas.offsetWidth;
      H = canvas.offsetHeight;
      DPR = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.round(W * DPR);
      canvas.height = Math.round(H * DPR);
      layers = Array.from({ length: NUM_LAYERS }, (_, i) =>
        buildLayerCanvas(W, H, DPR, i, isCompact)
      );
    };

    const frame = (now: number) => {
      if (!visible || layers.length === 0) return;
      compositeLayers(ctx, W, H, layers, activeStageIndex, now, DPR, revealStart);
      raf = requestAnimationFrame(frame);
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && !visible) {
            visible = true;
            rebuild();
            revealStart = performance.now();
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
            className="h-1 flex-1 rounded-full transition-colors duration-500"
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
      {/* layer stack legend — active layer bright, older layers faded */}
      <div className="flex flex-wrap justify-center gap-1 mt-2 px-1">
        {LAYER_META.map((meta, i) => {
          if (i > activeStageIndex) return null;
          const isActive = i === activeStageIndex;
          const alpha = isActive ? 1 : layerAlpha(i, activeStageIndex, 0) * schematicFade(i, activeStageIndex);
          return (
            <span
              key={meta.short}
              className="text-[8px] sm:text-[9px] font-mono px-1.5 py-0.5 rounded transition-all duration-500"
              style={{
                color: meta.color,
                opacity: Math.max(0.25, alpha),
                background: isActive ? `${meta.color}22` : "transparent",
                border: isActive ? `1px solid ${meta.color}66` : "1px solid transparent",
                fontWeight: isActive ? 700 : 400,
              }}
            >
              {meta.short}
            </span>
          );
        })}
      </div>
      <p className="text-[10px] sm:text-xs font-mono text-slate-400 mt-2 text-center truncate">
        {labels[activeStageIndex] ?? ""}
      </p>
    </div>
  );
}

export { STAGE_ORDER };
