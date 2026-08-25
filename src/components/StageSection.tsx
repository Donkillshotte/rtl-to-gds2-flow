"use client";

import { ArrowDownToLine, ArrowUpFromLine, Cpu, Lightbulb, CheckCircle2, AlertTriangle, Wrench } from "lucide-react";
import type { Stage } from "@/data/stages";
import { StageAnimation } from "./StageAnimation";

interface StageSectionProps {
  stage: Stage;
  index: number;
}

export function StageSection({ stage, index }: StageSectionProps) {
  const isEven = index % 2 === 0;

  return (
    <section
      id={`stage-${stage.id}`}
      className="relative py-24 md:py-32 px-6 overflow-hidden"
    >
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          background: `radial-gradient(ellipse at ${isEven ? "20%" : "80%"} 50%, ${stage.color}, transparent 60%)`,
        }}
      />

      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center font-mono font-bold text-lg"
            style={{
              background: `${stage.color}15`,
              border: `1px solid ${stage.color}40`,
              color: stage.color,
            }}
          >
            {String(stage.step).padStart(2, "0")}
          </div>
          <div>
            <p className="text-sm font-mono tracking-wider" style={{ color: stage.color }}>
              FASE {stage.step} / 14
            </p>
            <h2 className="text-2xl md:text-4xl font-bold">{stage.title}</h2>
          </div>
        </div>

        <div className={`grid lg:grid-cols-2 gap-12 lg:gap-16 items-start ${isEven ? "" : ""}`}>
          <div className={`space-y-6 ${isEven ? "" : "lg:order-2"}`}>
            <div>
              <p className="text-sm font-mono mb-3" style={{ color: stage.color }}>
                {stage.subtitle}
              </p>
              <p className="text-slate-400 text-base md:text-lg leading-relaxed">
                {stage.description}
              </p>
            </div>

            {/* Deep Dive */}
            <div className="glass rounded-xl p-5">
              <h3 className="text-sm font-semibold text-slate-300 mb-4 flex items-center gap-2">
                <span style={{ color: stage.color }}>📖</span> Approfondimento
              </h3>
              <div className="space-y-3">
                {stage.deepDive.map((paragraph, i) => (
                  <p key={i} className="text-sm text-slate-400 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            {/* Subsections */}
            {stage.subsections.map((sub) => (
              <div key={sub.title} className="glass rounded-xl p-5">
                <h3 className="text-sm font-semibold mb-2" style={{ color: stage.color }}>
                  {sub.title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed mb-3">{sub.content}</p>
                {sub.bullets && (
                  <ul className="space-y-1.5">
                    {sub.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2 text-xs text-slate-500">
                        <span style={{ color: stage.color }} className="mt-0.5">▸</span>
                        {b}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}

            <div className="grid sm:grid-cols-2 gap-4">
              <InfoCard
                icon={<ArrowDownToLine className="w-4 h-4" />}
                title="Input"
                items={stage.inputs}
                color={stage.color}
              />
              <InfoCard
                icon={<ArrowUpFromLine className="w-4 h-4" />}
                title="Output"
                items={stage.outputs}
                color={stage.color}
              />
            </div>

            <div className="glass rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <Cpu className="w-4 h-4" style={{ color: stage.color }} />
                <h3 className="text-sm font-semibold text-slate-300">Tool EDA</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {stage.tools.map((tool) => (
                  <span
                    key={tool}
                    className="px-3 py-1 rounded-lg text-xs font-mono"
                    style={{
                      background: `${stage.color}10`,
                      color: stage.color,
                      border: `1px solid ${stage.color}25`,
                    }}
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>

            <div className="glass rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="w-4 h-4" style={{ color: stage.color }} />
                <h3 className="text-sm font-semibold text-slate-300">Concetti Chiave</h3>
              </div>
              <ul className="space-y-2">
                {stage.keyConcepts.map((concept) => (
                  <li key={concept} className="flex items-start gap-2 text-sm text-slate-400">
                    <span style={{ color: stage.color }} className="mt-1 shrink-0">▸</span>
                    {concept}
                  </li>
                ))}
              </ul>
            </div>

            {stage.exitCriteria && (
              <div className="glass rounded-xl p-5 border border-green-500/20">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                  <h3 className="text-sm font-semibold text-green-300">Exit Criteria / Milestone</h3>
                </div>
                <div className="space-y-3">
                  {stage.exitCriteria.map((ec) => (
                    <div key={ec.name} className="border-l-2 border-green-500/30 pl-3">
                      <p className="text-sm font-medium text-slate-300">{ec.name}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{ec.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {stage.checks && (
              <div className="glass rounded-xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <h3 className="text-sm font-semibold text-amber-300">Check & Comandi</h3>
                </div>
                {stage.checks.map((group) => (
                  <div key={group.category} className="mb-4 last:mb-0">
                    <p className="text-xs font-mono text-slate-500 mb-2">{group.category}</p>
                    <ul className="space-y-1">
                      {group.items.map((item) => (
                        <li key={item} className="text-xs text-slate-400 font-mono">
                          → {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}

            {stage.practicalNotes && (
              <div className="glass rounded-xl p-5 border border-amber-500/10">
                <div className="flex items-center gap-2 mb-3">
                  <Wrench className="w-4 h-4 text-amber-400" />
                  <h3 className="text-sm font-semibold text-amber-300">Note di Lavoro</h3>
                </div>
                <ul className="space-y-2">
                  {stage.practicalNotes.map((note) => (
                    <li key={note} className="text-xs text-slate-400 leading-relaxed">
                      💡 {note}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className={`sticky top-24 ${isEven ? "" : "lg:order-1"}`}>
            <div
              className="glass rounded-2xl p-6 md:p-8 aspect-[4/3] flex items-center justify-center relative overflow-hidden"
              style={{ boxShadow: `0 0 60px ${stage.glowColor}` }}
            >
              <div
                className="absolute inset-0 opacity-[0.06]"
                style={{
                  backgroundImage: `linear-gradient(${stage.color}20 1px, transparent 1px), linear-gradient(90deg, ${stage.color}20 1px, transparent 1px)`,
                  backgroundSize: "24px 24px",
                }}
              />
              <div className="relative w-full h-full min-h-[200px]">
                <StageAnimation stageId={stage.id} color={stage.color} />
              </div>
            </div>
          </div>
        </div>

        {index < 13 && (
          <div className="flex justify-center mt-16">
            <div className="flex flex-col items-center gap-2">
              <div className="w-px h-12 bg-gradient-to-b from-slate-600 to-transparent" />
              <div className="text-slate-500 animate-float">↓</div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function InfoCard({
  icon,
  title,
  items,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  items: string[];
  color: string;
}) {
  return (
    <div className="glass rounded-xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <span style={{ color }}>{icon}</span>
        <h3 className="text-sm font-semibold text-slate-300">{title}</h3>
      </div>
      <ul className="space-y-1.5">
        {items.map((item) => (
          <li key={item} className="text-xs text-slate-400 leading-relaxed">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
