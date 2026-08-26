"use client";

import { Printer } from "lucide-react";
import { useI18n } from "@/i18n/context";
import { ui } from "@/i18n/ui";
import { loc } from "@/i18n/context";

const rows = [
  {
    topic: loc("Setup slack", "Setup slack"),
    formula: "S_setup = Tclk − Tco − Tpd − Tsu + skew − unc",
    note: loc("Corner lento / max delay", "Slow corner / max delay"),
  },
  {
    topic: loc("Hold slack", "Hold slack"),
    formula: "S_hold = Tco + Tpd − Thold − skew_hold − unc",
    note: loc("Corner veloce / min delay; no Tclk", "Fast corner / min delay; no Tclk"),
  },
  {
    topic: loc("WNS / TNS", "WNS / TNS"),
    formula: "WNS = min(slack); TNS = Σ min(0, slack)",
    note: loc("Signoff: entrambi → 0", "Signoff: both → 0"),
  },
  {
    topic: loc("Utilization", "Utilization"),
    formula: "U = area_celle / area_core",
    note: loc("Tipico 55–75% pre-CTS", "Typical 55–75% pre-CTS"),
  },
  {
    topic: loc("IR drop statico", "Static IR drop"),
    formula: "ΔV = I · R_eff",
    note: loc("Budget tipico ≤5% VDD", "Typical budget ≤5% VDD"),
  },
  {
    topic: loc("Antenna ratio", "Antenna ratio"),
    formula: "AR = A_metal / A_gate",
    note: loc("Fix: jumper / diode, non widen", "Fix: jumper / diode, not widen"),
  },
  {
    topic: loc("Useful skew", "Useful skew"),
    formula: "skew = Tclk_capture − Tclk_launch",
    note: loc("Aiuta setup, mangia hold", "Helps setup, eats hold"),
  },
  {
    topic: loc("Z-target PDN", "PDN Z-target"),
    formula: "Z_target = ΔV_allowed / ΔI_step",
    note: loc("Es. 40 mV / 4 A = 10 mΩ", "E.g. 40 mV / 4 A = 10 mΩ"),
  },
  {
    topic: loc("Decap (ordine)", "Decap (order)"),
    formula: "C ≥ I · Δt / ΔV",
    note: loc("Locale all’hotspot; non fixa R_dc", "Local to hotspot; does not fix R_dc"),
  },
  {
    topic: loc("Package L·di/dt", "Package L·di/dt"),
    formula: "ΔV_L = L_loop · di/dt",
    note: loc("CPA: stessa bump map del tapeout", "CPA: same bump map as tapeout"),
  },
];

export function CheatSheetSection() {
  const { t } = useI18n();

  return (
    <section
      id="cheat-sheet"
      className="scroll-mt-24 relative py-16 sm:py-24 px-4 sm:px-6 border-t border-slate-800/50 print:border-0 print:py-4"
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-2 print:mb-4">
          <div className="flex items-center gap-3">
            <Printer className="w-6 h-6 text-slate-400 print:hidden" />
            <h2 className="text-3xl font-bold text-slate-100 sm:text-4xl print:text-black">
              {t(ui.cheatTitle)}
            </h2>
          </div>
          <button
            type="button"
            onClick={() => window.print()}
            className="print:hidden px-4 py-2 rounded-xl text-sm border border-slate-700/50 text-slate-300 hover:text-white hover:border-cyan-500/40"
          >
            {t(ui.cheatPrint)}
          </button>
        </div>
        <p className="text-slate-400 mb-6 max-w-3xl print:text-slate-700 print:mb-4">
          {t(ui.cheatLead)}
        </p>

        <div className="overflow-x-auto glass rounded-2xl print:border print:border-slate-300 print:shadow-none print:bg-white">
          <table className="w-full min-w-[36rem] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-700/40 print:border-slate-300 text-xs uppercase tracking-wide text-slate-500 print:text-slate-700">
                <th className="px-4 py-3 font-medium">{t(ui.cheatTopic)}</th>
                <th className="px-4 py-3 font-medium">{t(ui.cheatFormula)}</th>
                <th className="px-4 py-3 font-medium">{t(ui.cheatNote)}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr
                  key={t(r.topic)}
                  className="border-b border-slate-800/50 last:border-0 print:border-slate-200"
                >
                  <td className="px-4 py-3 font-medium text-slate-200 print:text-black">
                    {t(r.topic)}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs sm:text-sm text-cyan-300/90 print:text-black">
                    {r.formula}
                  </td>
                  <td className="px-4 py-3 text-slate-400 print:text-slate-700">{t(r.note)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
