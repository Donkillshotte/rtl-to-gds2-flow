"use client";

import { useI18n } from "@/i18n/context";
import { ui } from "@/i18n/ui";
import { bilingualGlossary, bilingualSignoffChecklist } from "@/data/glossaryBilingual";
import { cellGlossary } from "@/data/cellGlossary";

export function SummarySection() {
  const { locale, t } = useI18n();
  const checkCount = bilingualSignoffChecklist.reduce((n, g) => n + g.items[locale].length, 0);

  return (
    <section className="relative py-20 sm:py-32 px-4 sm:px-6 border-t border-slate-800/50">
      <div className="max-w-4xl mx-auto text-center">
        <div>
          <h2 className="text-3xl md:text-5xl font-bold mb-6">{t(ui.summaryTitle)}</h2>
          <p className="text-slate-400 text-lg leading-relaxed mb-12 max-w-2xl mx-auto">
            {t(ui.summaryDesc)}
          </p>

          <div className="grid sm:grid-cols-4 gap-4 mb-16">
            {[
              { value: "14", label: t(ui.statPhases), color: "#22d3ee" },
              { value: String(bilingualGlossary.length), label: t(ui.statTerms), color: "#a78bfa" },
              { value: String(checkCount), label: t(ui.statChecks), color: "#34d399" },
              { value: String(cellGlossary.length), label: t(ui.statCells), color: "#60a5fa" },
            ].map((stat) => (
              <div key={stat.label} className="glass rounded-xl p-5">
                <div className="text-2xl font-bold font-mono mb-1" style={{ color: stat.color }}>
                  {stat.value}
                </div>
                <div className="text-xs text-slate-400">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="glass rounded-2xl p-8 text-left space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3 text-slate-200">{t(ui.summaryIterTitle)}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{t(ui.summaryIterDesc)}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3 text-slate-200">{t(ui.summaryCostTitle)}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{t(ui.summaryCostDesc)}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                "Timing Closure", "ECO Flow", "Formal Verification", "CDC/RDC",
                "Floorplan Exit", "PRO Exit", "BTO/MTO", "GKC", "DFM", "MPW",
                "AOCV/POCV", "SPEF", "UPF", "ATPG",
              ].map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-lg text-xs font-mono bg-slate-800/50 text-slate-400 border border-slate-700/50"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  const { t } = useI18n();

  return (
    <footer className="border-t border-slate-800/50 py-12 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center">
            <span className="text-cyan-400 font-mono text-[8px] font-bold">PD</span>
          </div>
          <span className="text-sm text-slate-500">Physical Design Flow — RTL to GDSII</span>
        </div>
        <p className="text-xs text-slate-600 font-mono text-center">{t(ui.footerEdu)}</p>
      </div>
    </footer>
  );
}
