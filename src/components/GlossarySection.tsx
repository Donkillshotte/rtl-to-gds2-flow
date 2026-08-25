"use client";

import { useState, useMemo } from "react";
import { ChevronDown, ClipboardCheck, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/i18n/context";
import { ui } from "@/i18n/ui";
import { bilingualGlossary, bilingualSignoffChecklist } from "@/data/glossaryBilingual";

export function GlossarySection() {
  const { t } = useI18n();
  const [openTerm, setOpenTerm] = useState<string | null>(null);

  const categories = useMemo(
    () => [...new Set(bilingualGlossary.map((g) => t(g.category)))],
    [t]
  );

  return (
    <section id="glossary" className="relative py-20 sm:py-32 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <BookOpen className="w-6 h-6 text-cyan-400" />
          <h2 className="text-3xl md:text-4xl font-bold">{t(ui.glossaryTitle)}</h2>
        </div>
        <p className="text-slate-400 mb-12 max-w-2xl">{t(ui.glossarySubtitle)}</p>

        <div className="space-y-8">
          {categories.map((cat) => (
            <div key={cat}>
              <h3 className="text-sm font-mono text-cyan-400 mb-4 tracking-wider">{cat.toUpperCase()}</h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {bilingualGlossary
                  .filter((g) => t(g.category) === cat)
                  .map((term) => (
                    <button
                      key={term.term}
                      onClick={() => setOpenTerm(openTerm === term.term ? null : term.term)}
                      className={cn(
                        "glass rounded-xl p-4 text-left transition-all hover:border-cyan-500/30",
                        openTerm === term.term && "border-cyan-500/40 bg-cyan-500/5"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-cyan-300">{term.term}</span>
                        <ChevronDown
                          className={cn(
                            "w-4 h-4 text-slate-500 transition-transform",
                            openTerm === term.term && "rotate-180"
                          )}
                        />
                      </div>
                      {term.fullName && (
                        <p className="text-xs text-slate-500 mt-0.5">{t(term.fullName)}</p>
                      )}
                      {openTerm === term.term && (
                        <p className="text-sm text-slate-400 mt-2 leading-relaxed">{t(term.definition)}</p>
                      )}
                    </button>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function SignoffChecklistSection() {
  const { locale, t } = useI18n();
  const [expanded, setExpanded] = useState<number>(0);

  return (
    <section id="signoff-checklist" className="relative py-20 sm:py-32 px-4 sm:px-6 border-t border-slate-800/50">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <ClipboardCheck className="w-6 h-6 text-green-400" />
          <h2 className="text-3xl md:text-4xl font-bold">{t(ui.signoffTitle)}</h2>
        </div>
        <p className="text-slate-400 mb-12 max-w-2xl">{t(ui.signoffSubtitle)}</p>

        <div className="space-y-3">
          {bilingualSignoffChecklist.map((group, idx) => {
            const cat = t(group.category);
            const items = group.items[locale];
            return (
              <div key={cat} className="glass rounded-xl overflow-hidden">
                <button
                  onClick={() => setExpanded(expanded === idx ? -1 : idx)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-white/2 transition-colors"
                >
                  <span className="font-semibold text-slate-200">{cat}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-slate-500">
                      {items.length} {t(ui.checkCount)}
                    </span>
                    <ChevronDown
                      className={cn(
                        "w-5 h-5 text-slate-500 transition-transform",
                        expanded === idx && "rotate-180"
                      )}
                    />
                  </div>
                </button>
                {expanded === idx && (
                  <div className="px-5 pb-5 border-t border-slate-700/30">
                    <ul className="space-y-2 mt-4">
                      {items.map((item) => (
                        <li key={item} className="flex items-start gap-3 text-sm text-slate-400">
                          <span className="text-green-400 mt-0.5 shrink-0">☐</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
