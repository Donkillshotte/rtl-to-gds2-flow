"use client";

import { useState } from "react";
import { Zap } from "lucide-react";
import { powerPkgTopics } from "@/data/powerPkgDeepDive";
import { sourceById } from "@/data/sources";
import { useI18n } from "@/i18n/context";
import { ui } from "@/i18n/ui";
import { TermText } from "@/components/TermPopup";
import { cn } from "@/lib/utils";

export function PowerPkgDeepSection() {
  const { t, locale } = useI18n();
  const [active, setActive] = useState(powerPkgTopics[0].id);
  const topic = powerPkgTopics.find((x) => x.id === active) ?? powerPkgTopics[0];

  return (
    <section
      id="power-pkg-deep"
      className="scroll-mt-24 relative py-16 sm:py-24 px-4 sm:px-6 border-t border-slate-800/50"
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-2">
          <Zap className="w-6 h-6 text-emerald-400" />
          <h2 className="text-3xl font-bold text-slate-100 sm:text-4xl">{t(ui.powerPkgTitle)}</h2>
        </div>
        <p className="text-slate-400 mb-8 max-w-3xl leading-relaxed">{t(ui.powerPkgLead)}</p>

        <div className="flex flex-wrap gap-2 mb-8">
          {powerPkgTopics.map((tp) => (
            <button
              key={tp.id}
              type="button"
              onClick={() => setActive(tp.id)}
              className={cn(
                "px-3 py-1.5 rounded-xl text-sm border transition-colors",
                active === tp.id
                  ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/40"
                  : "text-slate-400 border-slate-700/40 hover:text-slate-200"
              )}
            >
              {t(tp.title).split("—")[0]?.trim() ?? t(tp.title)}
            </button>
          ))}
        </div>

        <article id={`power-pkg-${topic.id}`} className="glass rounded-2xl p-5 sm:p-7 scroll-mt-28">
          <h3 className="text-xl sm:text-2xl font-bold text-slate-100 mb-2">{t(topic.title)}</h3>
          <p className="text-sm text-emerald-300/90 mb-5 leading-relaxed">{t(topic.kicker)}</p>

          <div className="flex flex-wrap gap-2 mb-6">
            {topic.stageLinks.map((lnk) => (
              <a
                key={lnk.href}
                href={lnk.href}
                className="text-xs px-2.5 py-1 rounded-lg border border-slate-600/50 text-slate-300 hover:border-emerald-500/40 hover:text-emerald-300"
              >
                {locale === "it" ? lnk.labelIt : lnk.labelEn}
              </a>
            ))}
          </div>

          <div className="space-y-5">
            {topic.paragraphs.map((para, i) => (
              <div key={i}>
                <p className="text-sm sm:text-[15px] text-slate-300 leading-relaxed">
                  <TermText>{t(para.body)}</TermText>
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-500/70">
                    {t(ui.sourcedRefs)}
                  </span>
                  {para.refs.map((rid) => {
                    const src = sourceById(rid);
                    return (
                      <a
                        key={rid}
                        href={`#source-${rid}`}
                        className="text-[10px] font-mono px-1.5 py-0.5 rounded border border-emerald-500/25 text-emerald-300/90 hover:bg-emerald-500/10"
                        title={src ? t(src.title) : rid}
                      >
                        {src?.cite ?? rid}
                      </a>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-5 border-t border-slate-700/40">
            <p className="text-[10px] uppercase tracking-wide text-slate-500 mb-2">
              {t(ui.powerPkgTakeaways)}
            </p>
            <ul className="space-y-2">
              {topic.takeaways.map((line) => (
                <li key={t(line)} className="text-sm text-slate-300 leading-relaxed flex gap-2">
                  <span className="text-emerald-400 shrink-0">▸</span>
                  <span>{t(line)}</span>
                </li>
              ))}
            </ul>
          </div>
        </article>
      </div>
    </section>
  );
}
