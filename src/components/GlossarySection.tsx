"use client";

import { useState, useMemo } from "react";
import { ChevronDown, ClipboardCheck, BookOpen, Search } from "lucide-react";
import { cn, glossaryTermId } from "@/lib/utils";
import { useI18n } from "@/i18n/context";
import { ui } from "@/i18n/ui";
import { bilingualSignoffChecklist } from "@/data/glossaryBilingual";
import { getUniqueGlossary } from "@/lib/glossaryLookup";

export function GlossarySection() {
  const { t } = useI18n();
  const [openTerm, setOpenTerm] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const glossary = useMemo(() => getUniqueGlossary(), []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return glossary;
    return glossary.filter((g) => {
      const hay = [
        g.term,
        g.fullName ? t(g.fullName) : "",
        t(g.definition),
        t(g.category),
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [query, t, glossary]);

  const categories = useMemo(
    () => [...new Set(filtered.map((g) => t(g.category)))],
    [filtered, t]
  );

  return (
    <section id="glossary" className="relative py-20 sm:py-32 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <BookOpen className="w-6 h-6 text-cyan-400" />
          <h2 className="text-3xl md:text-4xl font-bold">{t(ui.glossaryTitle)}</h2>
        </div>
        <p className="text-slate-400 mb-6 max-w-2xl">{t(ui.glossarySubtitle)}</p>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-10">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t(ui.glossarySearch)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/60 border border-slate-700/50 text-sm text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/50"
            />
          </div>
          <span className="text-xs font-mono text-slate-500">
            {filtered.length} {t(ui.glossaryCount)}
          </span>
        </div>

        {categories.length === 0 && (
          <p className="text-sm text-slate-500">{t(ui.glossaryEmpty)}</p>
        )}

        <div className="space-y-8">
          {categories.map((cat) => (
            <div key={cat}>
              <h3 className="text-sm font-mono text-cyan-400 mb-4 tracking-wider">{cat.toUpperCase()}</h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {filtered
                  .filter((g) => t(g.category) === cat)
                  .map((term) => (
                    <button
                      key={term.term}
                      id={glossaryTermId(term.term)}
                      onClick={() => setOpenTerm(openTerm === term.term ? null : term.term)}
                      className={cn(
                        "glass rounded-xl p-4 text-left transition-all hover:border-cyan-500/30 scroll-mt-28",
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
        <p className="text-slate-400 mb-8 max-w-3xl">{t(ui.signoffSubtitle)}</p>

        <div className="space-y-3">
          {bilingualSignoffChecklist.map((group, i) => {
            const items = group.items[locale];
            const open = expanded === i;
            return (
              <div key={t(group.category)} className="glass rounded-xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => setExpanded(open ? -1 : i)}
                  className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left"
                >
                  <span className="font-semibold text-slate-200">{t(group.category)}</span>
                  <span className="flex items-center gap-2 shrink-0">
                    <span className="text-xs font-mono text-green-400/80">
                      {items.length}
                    </span>
                    <ChevronDown className={cn("w-4 h-4 text-slate-500 transition-transform", open && "rotate-180")} />
                  </span>
                </button>
                {open && (
                  <ul className="px-5 pb-4 space-y-2">
                    {items.map((item) => (
                      <li key={item} className="flex gap-2 text-sm text-slate-400">
                        <span className="text-green-400 shrink-0">✓</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
