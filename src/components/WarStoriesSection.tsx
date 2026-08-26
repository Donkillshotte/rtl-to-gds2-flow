"use client";

import { Flame } from "lucide-react";
import { warStories } from "@/data/warStories";
import { useStages } from "@/hooks/useStages";
import { useI18n } from "@/i18n/context";
import { ui } from "@/i18n/ui";

export function WarStoriesSection() {
  const { t } = useI18n();
  const stages = useStages();

  return (
    <section id="war-stories" className="scroll-mt-24 relative py-16 sm:py-24 px-4 sm:px-6 border-t border-slate-800/50">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-2">
          <Flame className="w-6 h-6 text-orange-400" />
          <h2 className="text-3xl font-bold text-slate-100 sm:text-4xl">{t(ui.warTitle)}</h2>
        </div>
        <p className="text-slate-400 mb-8 max-w-3xl">{t(ui.warLead)}</p>

        <div className="space-y-5">
          {warStories.map((ws) => {
            const stage = stages.find((s) => s.id === ws.stage);
            return (
              <article key={ws.id} className="glass rounded-2xl p-5 sm:p-6">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <h3 className="text-lg font-semibold text-slate-100">{t(ws.title)}</h3>
                  <a
                    href={`#stage-${ws.stage}`}
                    className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-md border border-orange-500/30 text-orange-300/90 hover:text-orange-200"
                  >
                    {stage?.title ?? ws.stage}
                  </a>
                  {ws.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-800 text-slate-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <dl className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <dt className="text-[10px] uppercase tracking-wide text-red-400/80 mb-1">
                      {t(ui.warSymptom)}
                    </dt>
                    <dd className="text-sm text-slate-400 leading-relaxed">{t(ws.symptom)}</dd>
                  </div>
                  <div>
                    <dt className="text-[10px] uppercase tracking-wide text-amber-400/80 mb-1">
                      {t(ui.warCause)}
                    </dt>
                    <dd className="text-sm text-slate-400 leading-relaxed">{t(ws.rootCause)}</dd>
                  </div>
                  <div>
                    <dt className="text-[10px] uppercase tracking-wide text-emerald-400/80 mb-1">
                      {t(ui.warLesson)}
                    </dt>
                    <dd className="text-sm text-slate-300 leading-relaxed">{t(ws.lesson)}</dd>
                  </div>
                </dl>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
