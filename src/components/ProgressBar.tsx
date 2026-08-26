"use client";

import { useProgress } from "@/hooks/useProgress";
import { useStages } from "@/hooks/useStages";
import { useI18n } from "@/i18n/context";
import { ui } from "@/i18n/ui";

export function ProgressBar() {
  const { progress, resetProgress, completionPct } = useProgress();
  const stages = useStages();
  const { t } = useI18n();
  const pct = completionPct(stages.length);

  return (
    <section
      id="progress"
      className="scroll-mt-24 mx-auto max-w-6xl px-4 sm:px-6 py-8"
    >
      <div className="glass rounded-2xl p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-cyan-400">
              {t(ui.progressEyebrow)}
            </p>
            <h2 className="mt-1 text-2xl font-bold text-slate-100">{t(ui.progressTitle)}</h2>
            <p className="mt-1 text-sm text-slate-400">{t(ui.progressLead)}</p>
          </div>
          <button
            type="button"
            onClick={resetProgress}
            className="rounded-lg border border-slate-700/50 px-3 py-1.5 text-xs text-slate-500 hover:text-slate-200"
          >
            {t(ui.progressReset)}
          </button>
        </div>

        <div className="mt-4">
          <div className="mb-1 flex justify-between text-xs text-slate-500">
            <span>
              {t(ui.progressStages)}: {progress.readStages.length}/{stages.length}
            </span>
            <span>{pct}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full rounded-full bg-cyan-500 transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <Stat label={t(ui.progressQuiz)} value={String(progress.quizDone)} />
          <Stat label={t(ui.progressDrill)} value={String(progress.drillsDone.length)} />
          <Stat
            label={t(ui.progressInterview)}
            value={progress.interviewBest > 0 ? `${progress.interviewBest}%` : "—"}
          />
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-700/40 bg-slate-900/50 px-3 py-2">
      <p className="text-[10px] uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-0.5 text-xl font-bold text-slate-100">{value}</p>
    </div>
  );
}
