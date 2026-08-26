"use client";

import { Library } from "lucide-react";
import { useI18n } from "@/i18n/context";
import { ui } from "@/i18n/ui";
import { sources } from "@/data/sources";
import { cn } from "@/lib/utils";

const kindColor: Record<string, string> = {
  book: "text-amber-300 border-amber-500/30 bg-amber-500/10",
  paper: "text-cyan-300 border-cyan-500/30 bg-cyan-500/10",
  standard: "text-emerald-300 border-emerald-500/30 bg-emerald-500/10",
  industry: "text-violet-300 border-violet-500/30 bg-violet-500/10",
};

export function SourcesSection() {
  const { t } = useI18n();

  return (
    <section id="sources" className="relative py-20 sm:py-32 px-4 sm:px-6 border-t border-slate-800/50">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <Library className="w-6 h-6 text-amber-400" />
          <h2 className="text-3xl md:text-4xl font-bold">{t(ui.sourcesTitle)}</h2>
        </div>
        <p className="text-slate-400 mb-10 max-w-3xl leading-relaxed">{t(ui.sourcesSubtitle)}</p>

        <div className="grid sm:grid-cols-2 gap-4">
          {sources.map((s) => (
            <article
              key={s.id}
              id={`source-${s.id}`}
              className="glass rounded-xl p-4 sm:p-5 scroll-mt-28"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <h3 className="text-sm font-semibold text-slate-100 leading-snug">
                  {t(s.title)}
                </h3>
                <span
                  className={cn(
                    "shrink-0 text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded border",
                    kindColor[s.kind]
                  )}
                >
                  {s.kind}
                </span>
              </div>
              <p className="text-xs font-mono text-amber-400/90 mb-2">{s.cite}</p>
              <p className="text-xs text-slate-400 leading-relaxed">{t(s.detail)}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
