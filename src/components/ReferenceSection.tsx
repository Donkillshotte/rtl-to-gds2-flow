"use client";

import { useState } from "react";
import { FileStack, Layers, Thermometer } from "lucide-react";
import { useI18n } from "@/i18n/context";
import { ui } from "@/i18n/ui";
import { edaArtifacts, metalStack, pvtCorners, pvtNotes } from "@/data/edaReference";
import { cn } from "@/lib/utils";

type Tab = "files" | "stack" | "pvt";

export function ReferenceSection() {
  const { locale, t } = useI18n();
  const [tab, setTab] = useState<Tab>("files");

  return (
    <section id="eda-reference" className="relative py-20 sm:py-32 px-4 sm:px-6 border-t border-slate-800/50">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <FileStack className="w-6 h-6 text-sky-400" />
          <h2 className="text-3xl md:text-4xl font-bold">{t(ui.refTitle)}</h2>
        </div>
        <p className="text-slate-400 mb-8 max-w-3xl">{t(ui.refSubtitle)}</p>

        <div className="flex flex-wrap gap-2 mb-8">
          {(
            [
              ["files", t(ui.refFiles), FileStack],
              ["stack", t(ui.refStack), Layers],
              ["pvt", t(ui.refPvt), Thermometer],
            ] as const
          ).map(([id, label, Icon]) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors border",
                tab === id
                  ? "bg-sky-500/15 text-sky-300 border-sky-500/40"
                  : "text-slate-400 border-slate-700/40 hover:text-slate-200"
              )}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {tab === "files" && (
          <div className="overflow-x-auto -mx-4 px-4">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="text-xs font-mono text-slate-500 border-b border-slate-700/50">
                  <th className="py-2 pr-4">{t(ui.refExt)}</th>
                  <th className="py-2 pr-4">{t(ui.refName)}</th>
                  <th className="py-2 pr-4">{t(ui.refPhase)}</th>
                  <th className="py-2">{t(ui.refRole)}</th>
                </tr>
              </thead>
              <tbody>
                {edaArtifacts.map((a) => (
                  <tr key={a.ext} className="border-b border-slate-800/80 align-top">
                    <td className="py-3 pr-4 font-mono text-sky-300 whitespace-nowrap">{a.ext}</td>
                    <td className="py-3 pr-4 text-slate-200">{t(a.name)}</td>
                    <td className="py-3 pr-4 text-xs font-mono text-slate-500 whitespace-nowrap">{t(a.phase)}</td>
                    <td className="py-3 text-slate-400 text-xs leading-relaxed">{t(a.description)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === "stack" && (
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            <div className="space-y-2">
              {[...metalStack].reverse().map((layer) => (
                <div
                  key={layer.name}
                  className="rounded-lg px-4 py-3 border border-slate-700/40"
                  style={{
                    background: `${layer.color}14`,
                    borderColor: `${layer.color}40`,
                  }}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-mono font-bold text-sm" style={{ color: layer.color }}>
                      {layer.name}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">{layer.pitch}</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{t(layer.role)}</p>
                </div>
              ))}
            </div>
            <div className="glass rounded-2xl p-5 space-y-3 text-sm text-slate-400 leading-relaxed">
              <p>{t(ui.refStackNote1)}</p>
              <p>{t(ui.refStackNote2)}</p>
              <p>{t(ui.refStackNote3)}</p>
            </div>
          </div>
        )}

        {tab === "pvt" && (
          <div>
            <div className="overflow-x-auto -mx-4 px-4 mb-6">
              <table className="w-full min-w-[560px] text-left text-sm">
                <thead>
                  <tr className="text-xs font-mono text-slate-500 border-b border-slate-700/50">
                    <th className="py-2 pr-4">Corner</th>
                    <th className="py-2 pr-4">Process</th>
                    <th className="py-2 pr-4">V</th>
                    <th className="py-2 pr-4">T</th>
                    <th className="py-2">{t(ui.refUsedFor)}</th>
                  </tr>
                </thead>
                <tbody>
                  {pvtCorners.map((c) => (
                    <tr key={c.name} className="border-b border-slate-800/80">
                      <td className="py-3 pr-4 font-mono font-bold text-amber-300">{c.name}</td>
                      <td className="py-3 pr-4 text-slate-300">{c.process}</td>
                      <td className="py-3 pr-4 text-slate-400 text-xs">{t(c.voltage)}</td>
                      <td className="py-3 pr-4 font-mono text-xs text-slate-500">{c.temp}</td>
                      <td className="py-3 text-slate-400 text-xs">{t(c.usedFor)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <ul className="space-y-2">
              {pvtNotes[locale].map((n) => (
                <li key={n} className="text-sm text-slate-400 leading-relaxed flex gap-2">
                  <span className="text-amber-400 shrink-0">▸</span>
                  {n}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
