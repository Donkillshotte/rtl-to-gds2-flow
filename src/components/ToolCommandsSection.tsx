"use client";

import { useMemo, useState } from "react";
import { Terminal } from "lucide-react";
import { toolCommands } from "@/data/toolCommands";
import { useStages } from "@/hooks/useStages";
import { useI18n } from "@/i18n/context";
import { ui } from "@/i18n/ui";
import { cn } from "@/lib/utils";
import type { StageId } from "@/data/stages";

export function ToolCommandsSection() {
  const { t } = useI18n();
  const stages = useStages();
  const [filter, setFilter] = useState<StageId | "all">("all");

  const items = useMemo(
    () => (filter === "all" ? toolCommands : toolCommands.filter((c) => c.stage === filter)),
    [filter]
  );

  const stageIds = useMemo(
    () => [...new Set(toolCommands.map((c) => c.stage))],
    []
  );

  return (
    <section id="tool-commands" className="scroll-mt-24 relative py-16 sm:py-24 px-4 sm:px-6 border-t border-slate-800/50">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-2">
          <Terminal className="w-6 h-6 text-cyan-400" />
          <h2 className="text-3xl font-bold text-slate-100 sm:text-4xl">{t(ui.toolsTitle)}</h2>
        </div>
        <p className="text-slate-400 mb-6 max-w-3xl">{t(ui.toolsLead)}</p>

        <div className="flex flex-wrap gap-2 mb-6">
          <FilterChip active={filter === "all"} onClick={() => setFilter("all")} label="ALL" />
          {stageIds.map((id) => (
            <FilterChip
              key={id}
              active={filter === id}
              onClick={() => setFilter(id)}
              label={id.toUpperCase()}
            />
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {items.map((cmd) => {
            const stage = stages.find((s) => s.id === cmd.stage);
            return (
              <article key={cmd.id} className="glass rounded-2xl p-4 sm:p-5 flex flex-col gap-3">
                <div className="flex flex-wrap items-center gap-2 justify-between">
                  <h3 className="font-semibold text-slate-100">{t(cmd.title)}</h3>
                  <a
                    href={`#stage-${cmd.stage}`}
                    className="text-[10px] font-mono uppercase text-cyan-400/90 hover:text-cyan-300"
                  >
                    {stage?.title ?? cmd.stage}
                  </a>
                </div>
                <p className="text-[11px] font-mono text-slate-500">{cmd.tool}</p>
                <pre className="overflow-x-auto rounded-xl bg-slate-950/80 border border-slate-800 px-3 py-2.5 text-[11px] sm:text-xs font-mono text-emerald-300/90 leading-relaxed whitespace-pre-wrap">
                  {cmd.command}
                </pre>
                <div>
                  <p className="text-[10px] uppercase tracking-wide text-slate-500 mb-1">
                    {t(ui.toolsLook)}
                  </p>
                  <p className="text-sm text-slate-400 leading-relaxed">{t(cmd.whatToLook)}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wide text-amber-500/80 mb-1">
                    {t(ui.toolsPitfall)}
                  </p>
                  <p className="text-sm text-slate-400 leading-relaxed">{t(cmd.pitfalls)}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function FilterChip({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "px-2.5 py-1 rounded-lg text-[11px] font-mono border",
        active
          ? "text-cyan-300 border-cyan-500/40 bg-cyan-500/10"
          : "text-slate-500 border-slate-700/40 hover:text-slate-300"
      )}
    >
      {label}
    </button>
  );
}
