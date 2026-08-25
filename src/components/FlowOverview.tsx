"use client";

import { motion } from "framer-motion";
import { useStages } from "@/hooks/useStages";
import { useI18n } from "@/i18n/context";
import { ui } from "@/i18n/ui";

export function FlowOverview() {
  const stages = useStages();
  const { t } = useI18n();

  return (
    <section id="flow-overview" className="relative py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">{t(ui.flowTitle)}</h2>
          <p className="text-slate-400 text-lg max-w-3xl mx-auto">{t(ui.flowSubtitle)}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {[
            { label: t(ui.feGroup), range: [1, 3], color: "#22d3ee" },
            { label: t(ui.pdGroup), range: [4, 9], color: "#a78bfa" },
            { label: t(ui.signoffGroup), range: [10, 14], color: "#60a5fa" },
          ].map((group) => (
            <div key={group.label} className="glass rounded-xl p-5">
              <h3 className="text-sm font-mono mb-4" style={{ color: group.color }}>
                {group.label.toUpperCase()}
              </h3>
              <div className="space-y-2">
                {stages
                  .filter((s) => s.step >= group.range[0] && s.step <= group.range[1])
                  .map((stage) => (
                    <a
                      key={stage.id}
                      href={`#stage-${stage.id}`}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors group"
                    >
                      <span
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-mono font-bold shrink-0"
                        style={{
                          background: `${stage.color}15`,
                          color: stage.color,
                          border: `1px solid ${stage.color}30`,
                        }}
                      >
                        {stage.step}
                      </span>
                      <span className="text-sm text-slate-400 group-hover:text-white transition-colors">
                        {stage.title}
                      </span>
                    </a>
                  ))}
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {stages.map((stage) => (
            <motion.a
              key={stage.id}
              href={`#stage-${stage.id}`}
              whileHover={{ y: -4, scale: 1.03 }}
              className="group glass rounded-xl p-3 flex flex-col items-center text-center"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center font-mono font-bold text-sm mb-2"
                style={{
                  background: `${stage.color}15`,
                  border: `1px solid ${stage.color}40`,
                  color: stage.color,
                }}
              >
                {stage.step}
              </div>
              <span className="text-[11px] font-medium text-slate-300 group-hover:text-white leading-tight">
                {stage.title}
              </span>
            </motion.a>
          ))}
        </div>

        <div className="mt-16 glass rounded-2xl p-6 md:p-8">
          <h3 className="text-lg font-semibold mb-4 text-slate-200">{t(ui.milestones)}</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: "GKC", desc: t(ui.milestoneGkDesc), color: "#818cf8" },
              { name: "Floorplan Exit", desc: t(ui.milestoneFpDesc), color: "#f472b6" },
              { name: "PRO Exit", desc: t(ui.milestoneProDesc), color: "#34d399" },
              { name: "BTO / MTO", desc: t(ui.milestoneBtoDesc), color: "#60a5fa" },
            ].map((m) => (
              <div
                key={m.name}
                className="rounded-xl p-4 border"
                style={{ borderColor: `${m.color}30`, background: `${m.color}08` }}
              >
                <p className="font-mono font-bold text-sm" style={{ color: m.color }}>
                  {m.name}
                </p>
                <p className="text-xs text-slate-500 mt-1">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
