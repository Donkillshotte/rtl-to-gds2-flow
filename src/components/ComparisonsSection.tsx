"use client";

import { comparisons } from "@/data/comparisons";
import { useI18n } from "@/i18n/context";
import { ui } from "@/i18n/ui";

export function ComparisonsSection() {
  const { t } = useI18n();

  return (
    <section id="compare" className="scroll-mt-24 relative py-16 sm:py-24 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-cyan-400">
            {t(ui.compareEyebrow)}
          </p>
          <h2 className="mt-2 text-3xl font-bold text-slate-100 sm:text-4xl">
            {t(ui.compareTitle)}
          </h2>
          <p className="mt-2 max-w-3xl text-slate-400">{t(ui.compareLead)}</p>
        </div>

        <div className="space-y-8">
          {comparisons.map((c) => (
            <article key={c.id} className="glass overflow-hidden rounded-2xl">
              <div className="border-b border-slate-700/40 px-4 py-3 sm:px-5">
                <h3 className="text-xl font-bold text-slate-100">{t(c.title)}</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[28rem] text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-700/40 text-xs uppercase tracking-wide text-slate-500">
                      <th className="px-4 py-2 font-medium sm:px-5">{t(ui.compareAspect)}</th>
                      <th className="px-4 py-2 font-medium text-cyan-400/90 sm:px-5">
                        {t(c.leftLabel)}
                      </th>
                      <th className="px-4 py-2 font-medium text-emerald-400/90 sm:px-5">
                        {t(c.rightLabel)}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {c.rows.map((row) => (
                      <tr
                        key={t(row.aspect)}
                        className="border-b border-slate-800/60 last:border-0"
                      >
                        <td className="px-4 py-3 font-medium text-slate-300 sm:px-5">
                          {t(row.aspect)}
                        </td>
                        <td className="px-4 py-3 text-slate-400 sm:px-5">{t(row.left)}</td>
                        <td className="px-4 py-3 text-slate-400 sm:px-5">{t(row.right)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="border-t border-slate-700/40 bg-slate-900/40 px-4 py-3 sm:px-5">
                <p className="text-sm text-slate-300">
                  <span className="font-semibold text-slate-200">{t(ui.compareTakeaway)}: </span>
                  {t(c.summary)}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
