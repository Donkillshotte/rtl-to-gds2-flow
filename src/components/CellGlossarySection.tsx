"use client";

import { useState, useMemo } from "react";
import { Cpu, ChevronDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/i18n/context";
import { ui } from "@/i18n/ui";
import { cellGlossary, cellCategories } from "@/data/cellGlossary";

export function CellGlossarySection() {
  const { locale, t } = useI18n();
  const [openId, setOpenId] = useState<string | null>("inv");
  const [filter, setFilter] = useState("");
  const [catFilter, setCatFilter] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = filter.toLowerCase();
    return cellGlossary.filter((cell) => {
      const name = t(cell.name).toLowerCase();
      const cat = t(cell.category).toLowerCase();
      const matchQ = !q || name.includes(q) || cat.includes(q) || cell.id.includes(q);
      const matchCat = !catFilter || t(cell.category) === catFilter;
      return matchQ && matchCat;
    });
  }, [filter, catFilter, t]);

  const categories = cellCategories.map((c) => t(c));

  return (
    <section id="cells-glossary" className="relative py-32 px-6 border-t border-slate-800/50">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <Cpu className="w-6 h-6 text-purple-400" />
          <h2 className="text-3xl md:text-4xl font-bold">{t(ui.cellsTitle)}</h2>
        </div>
        <p className="text-slate-400 mb-8 max-w-3xl">{t(ui.cellsSubtitle)}</p>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="INV, TAP, AOI, CLKBUF..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/60 border border-slate-700/50 text-sm text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-purple-500/50"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setCatFilter(null)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-mono transition-colors",
                !catFilter ? "bg-purple-500/20 text-purple-300 border border-purple-500/40" : "text-slate-500 hover:text-slate-300"
              )}
            >
              ALL
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCatFilter(cat === catFilter ? null : cat)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs transition-colors",
                  catFilter === cat ? "bg-purple-500/20 text-purple-300 border border-purple-500/40" : "text-slate-500 hover:text-slate-300"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {filtered.map((cell) => (
            <div
              key={cell.id}
              className={cn(
                "glass rounded-xl overflow-hidden transition-all",
                openId === cell.id && "border-purple-500/30"
              )}
            >
              <button
                onClick={() => setOpenId(openId === cell.id ? null : cell.id)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-white/2 transition-colors"
              >
                <div>
                  <span className="font-mono font-bold text-purple-300">{t(cell.name)}</span>
                  <p className="text-xs text-slate-500 mt-0.5">{t(cell.category)}</p>
                </div>
                <ChevronDown
                  className={cn("w-5 h-5 text-slate-500 transition-transform shrink-0", openId === cell.id && "rotate-180")}
                />
              </button>

              {openId === cell.id && (
                <div className="px-5 pb-5 border-t border-slate-700/30 space-y-4">
                  <div className="grid md:grid-cols-2 gap-4 mt-4">
                    <CellField label={t(ui.function)} value={t(cell.function)} color="#a78bfa" />
                    <CellField label={t(ui.placementRules)} value={t(cell.placement)} color="#34d399" />
                    <CellField label={t(ui.whenUsed)} value={t(cell.whenUsed)} color="#fbbf24" />
                  </div>

                  <div>
                    <p className="text-xs font-mono text-slate-500 mb-2 uppercase tracking-wider">
                      Technical Notes
                    </p>
                    <ul className="space-y-1.5">
                      {cell.technicalNotes[locale].map((note) => (
                        <li key={note} className="flex items-start gap-2 text-sm text-slate-400">
                          <span className="text-purple-400 mt-0.5 shrink-0">▸</span>
                          {note}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {cell.relatedCells && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      <span className="text-xs text-slate-500">Related:</span>
                      {cell.relatedCells.map((rel) => (
                        <span
                          key={rel}
                          className="px-2 py-0.5 rounded-md text-xs font-mono bg-purple-500/10 text-purple-300 border border-purple-500/20"
                        >
                          {rel}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CellField({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="rounded-lg p-4 bg-slate-900/40 border border-slate-700/30">
      <p className="text-xs font-mono mb-1.5" style={{ color }}>
        {label}
      </p>
      <p className="text-sm text-slate-400 leading-relaxed">{value}</p>
    </div>
  );
}
