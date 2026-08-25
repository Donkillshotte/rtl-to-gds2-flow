"use client";

import { ArrowDownToLine, ArrowUpFromLine, Cpu, Lightbulb, CheckCircle2, AlertTriangle, Wrench, MessageCircleQuestion } from "lucide-react";
import type { Stage } from "@/data/stages";
import { ChipEvolution } from "./ChipEvolution";
import { FormulaBlock } from "./Formula";
import { useI18n } from "@/i18n/context";
import { ui } from "@/i18n/ui";
import { stageFormulas, stageInterview } from "@/data/stageFormulas";

interface StageSectionProps {
  stage: Stage;
  index: number;
}

export function StageSection({ stage, index }: StageSectionProps) {
  const { t } = useI18n();
  const isEven = index % 2 === 0;
  const formulas = stageFormulas[stage.id] ?? [];
  const interview = stageInterview[stage.id] ?? [];

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
              {t(ui.phase)} {stage.step} / 14
            </p>
            <h2 className="text-2xl md:text-4xl font-bold">{stage.title}</h2>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          <div className={`space-y-6 ${isEven ? "" : "lg:order-2"}`}>
            <div>
              <p className="text-sm font-mono mb-3" style={{ color: stage.color }}>
                {stage.subtitle}
              </p>
              <p className="text-slate-400 text-base md:text-lg leading-relaxed">
                {stage.description}
              </p>
            </div>

            <div className="glass rounded-xl p-5">
              <h3 className="text-sm font-semibold text-slate-300 mb-4 flex items-center gap-2">
                <span style={{ color: stage.color }}>📖</span> {t(ui.deepDive)}
              </h3>
              <div className="space-y-3">
                {stage.deepDive.map((paragraph, i) => (
                  <p key={i} className="text-sm text-slate-400 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            {formulas.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-slate-300 mb-4 flex items-center gap-2">
                  <span className="text-cyan-400 font-mono">∑</span> {t(ui.formulas)}
                </h3>
                {formulas.map((f) => (
                  <FormulaBlock
                    key={t(f.label)}
                    label={t(f.label)}
                    latex={f.latex}
                    explanation={t(f.explanation)}
                  />
                ))}
              </div>
            )}

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

            {interview.length > 0 && (
              <div className="glass rounded-xl p-5 border border-indigo-500/20">
                <div className="flex items-center gap-2 mb-4">
                  <MessageCircleQuestion className="w-4 h-4 text-indigo-400" />
                  <h3 className="text-sm font-semibold text-indigo-300">{t(ui.interview)}</h3>
                </div>
                <div className="space-y-4">
                  {interview.map((qa) => (
                    <div key={t(qa.question)} className="border-l-2 border-indigo-500/30 pl-3">
                      <p className="text-sm font-medium text-slate-300">Q: {t(qa.question)}</p>
                      <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">A: {t(qa.answer)}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="grid sm:grid-cols-2 gap-4">
              <InfoCard
                icon={<ArrowDownToLine className="w-4 h-4" />}
                title={t(ui.inputs)}
                items={stage.inputs}
                color={stage.color}
              />
              <InfoCard
                icon={<ArrowUpFromLine className="w-4 h-4" />}
                title={t(ui.outputs)}
                items={stage.outputs}
                color={stage.color}
              />
            </div>

            <div className="glass rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <Cpu className="w-4 h-4" style={{ color: stage.color }} />
                <h3 className="text-sm font-semibold text-slate-300">{t(ui.tools)}</h3>
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
                <h3 className="text-sm font-semibold text-slate-300">{t(ui.concepts)}</h3>
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
                  <h3 className="text-sm font-semibold text-green-300">{t(ui.exitCriteria)}</h3>
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
                  <h3 className="text-sm font-semibold text-amber-300">{t(ui.checksTitle)}</h3>
                </div>
                {stage.checks.map((group) => (
                  <div key={group.category} className="mb-4 last:mb-0">
                    <p className="text-xs font-mono text-slate-500 mb-2">{group.category}</p>
                    <ul className="space-y-1.5">
                      {group.items.map((item) => (
                        <li key={item} className="text-xs text-slate-400 leading-relaxed flex items-start gap-2">
                          <span className="text-amber-400 shrink-0 mt-0.5">✓</span>
                          {item}
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
                  <h3 className="text-sm font-semibold text-amber-300">{t(ui.workNotes)}</h3>
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
              className="relative overflow-hidden rounded-2xl"
              style={{ boxShadow: `0 0 60px ${stage.glowColor}` }}
            >
              <ChipEvolution activeStageIndex={index} />
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
