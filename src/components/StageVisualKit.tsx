"use client";

import { motion } from "framer-motion";
import type { StageId } from "@/data/stages";
import { stageVisualMeta } from "@/data/stageVisualMeta";
import { StageAnimation } from "@/components/StageAnimation";
import { useI18n } from "@/i18n/context";
import { ui } from "@/i18n/ui";

interface StageVisualKitProps {
  stageId: StageId;
  color: string;
  /** diagram = only SVG; metrics = steps+chart; full = all */
  variant?: "full" | "diagram" | "metrics";
}

export function StageVisualKit({ stageId, color, variant = "full" }: StageVisualKitProps) {
  const { t } = useI18n();
  const meta = stageVisualMeta[stageId];

  if (variant === "diagram") {
    return (
      <div className="glass rounded-2xl overflow-hidden">
        <p className="px-4 pt-3 text-[10px] font-mono uppercase tracking-wider text-slate-500">
          {t(meta.diagramTitle)}
        </p>
        <div className="aspect-[400/220] w-full p-2">
          <StageAnimation stageId={stageId} color={color} />
        </div>
      </div>
    );
  }

  const maxAbs = Math.max(...meta.chart.map((c) => Math.abs(c.value)), 1);
  const showDiagram = variant === "full";

  return (
    <div className="space-y-4">
      {showDiagram && (
        <div className="glass rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-4 pt-3">
            <p className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
              {t(meta.diagramTitle)}
            </p>
            <span className="text-[10px] font-mono" style={{ color }}>
              {t(ui.visualExplain)}
            </span>
          </div>
          <div className="aspect-[400/220] w-full p-2 sm:p-3">
            <StageAnimation stageId={stageId} color={color} />
          </div>
        </div>
      )}

      <div className="glass rounded-2xl p-4">
        <p className="text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-3">
          {t(meta.stepsTitle)}
        </p>
        <ol className="grid gap-2 sm:grid-cols-2">
          {meta.steps.map((step, i) => (
            <motion.li
              key={t(step.label)}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="flex gap-3 rounded-xl border border-slate-700/40 bg-slate-900/40 p-3"
            >
              <span
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-mono font-bold"
                style={{ background: `${color}20`, color, border: `1px solid ${color}40` }}
              >
                {i + 1}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-200">{t(step.label)}</p>
                <p className="text-xs text-slate-500 leading-snug mt-0.5">{t(step.detail)}</p>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>

      <div className="glass rounded-2xl p-4">
        <div className="flex items-baseline justify-between gap-2 mb-3">
          <p className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
            {t(meta.chartTitle)}
          </p>
          <span className="text-[10px] font-mono text-slate-600">{t(meta.chartUnit)}</span>
        </div>
        <div className="flex items-end gap-2 sm:gap-3 h-28">
          {meta.chart.map((bar, i) => {
            const h = Math.max(8, (Math.abs(bar.value) / maxAbs) * 100);
            const negative = bar.value < 0;
            return (
              <div key={bar.label} className="flex-1 flex flex-col items-center justify-end h-full gap-1">
                <span className="text-[10px] font-mono text-slate-400">{bar.value}</span>
                <motion.div
                  className="w-full max-w-[3rem] rounded-t-md"
                  initial={{ scaleY: 0 }}
                  whileInView={{ scaleY: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 + i * 0.08, type: "spring", stiffness: 120 }}
                  style={{
                    transformOrigin: "bottom",
                    background: negative
                      ? "linear-gradient(180deg,#f87171,#ef4444)"
                      : `linear-gradient(180deg, ${color}, ${color}55)`,
                    height: `${h}%`,
                  }}
                />
                <span className="text-[10px] font-mono text-slate-500 truncate w-full text-center">
                  {bar.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
