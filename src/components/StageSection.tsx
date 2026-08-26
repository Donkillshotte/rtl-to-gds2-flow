"use client";

import { ArrowDownToLine, ArrowUpFromLine, Cpu, Lightbulb, CheckCircle2, AlertTriangle, Wrench, MessageCircleQuestion } from "lucide-react";
import type { Stage } from "@/data/stages";
import { ChipEvolution } from "./ChipEvolution";
import { FormulaBlock } from "./Formula";
import { useI18n } from "@/i18n/context";
import { ui } from "@/i18n/ui";
import { stageFormulas, stageInterview } from "@/data/stageFormulas";
import { extraInterview } from "@/data/interviewExtra";
import { interviewExtraMore } from "@/data/interviewExtraMore";
import { interviewExtraMore2 } from "@/data/interviewExtraMore2";
import { stageEssays } from "@/data/stageEssays";
import { stageEssayExtras } from "@/data/stageEssayExtras";
import { stageEssayExtras3 } from "@/data/stageEssayExtras3";
import { stageDeepDiveExtras } from "@/data/stageDeepDiveExtras";
import { stageDeepDiveExtras2 } from "@/data/stageDeepDiveExtras2";
import { stageDeepDiveSourced } from "@/data/stageDeepDiveSourced";
import { stageSubsectionExtras } from "@/data/stageSubsectionExtras";
import { practicalNotesExtras } from "@/data/practicalNotesExtras";
import { stageDescriptionExtras } from "@/data/stageDescriptionExtras";
import { workedExamples } from "@/data/quizBank";
import { workedExamplesMore } from "@/data/workedExamplesMore";
import { TermText } from "@/components/TermPopup";
import { stageSourcedEssays } from "@/data/stageSourcedEssays";
import { sourceById } from "@/data/sources";

interface StageSectionProps {
  stage: Stage;
  index: number;
}

export function StageSection({ stage, index }: StageSectionProps) {
  const { t, locale } = useI18n();
  const isEven = index % 2 === 0;
  const formulas = stageFormulas[stage.id] ?? [];
  const interview = [
    ...(stageInterview[stage.id] ?? []),
    ...(extraInterview[stage.id] ?? []),
    ...(interviewExtraMore[stage.id] ?? []),
    ...(interviewExtraMore2[stage.id] ?? []),
  ];
  const essay = stageEssays[stage.id];
  const essayExtras = [
    ...(stageEssayExtras[stage.id] ?? []),
    ...(stageEssayExtras3[stage.id] ?? []),
  ];
  const sourced = stageSourcedEssays[stage.id];
  const deepDiveExtras = [
    ...(stageDeepDiveExtras[stage.id] ?? []),
    ...(stageDeepDiveExtras2[stage.id] ?? []),
  ];
  const deepDiveSourced = stageDeepDiveSourced[stage.id] ?? [];
  const subsectionExtras = stageSubsectionExtras[stage.id] ?? [];
  const workNotesExtras = practicalNotesExtras[stage.id] ?? [];
  const descriptionExtras = stageDescriptionExtras[stage.id] ?? [];
  const examples = [...workedExamples, ...workedExamplesMore].filter((e) => e.stage === stage.id);

  return (
    <section
      id={`stage-${stage.id}`}
      className="relative py-14 sm:py-20 md:py-32 px-4 sm:px-6 overflow-hidden"
    >
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          background: `radial-gradient(ellipse at ${isEven ? "20%" : "80%"} 50%, ${stage.color}, transparent 60%)`,
        }}
      />

      <div className="max-w-6xl mx-auto">
        <div className="flex items-start sm:items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center font-mono font-bold text-base sm:text-lg shrink-0"
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
            <h2 className="text-xl sm:text-2xl md:text-4xl font-bold leading-tight">{stage.title}</h2>
          </div>
        </div>

        {/* Chip preview — top on mobile, sticky sidebar on desktop */}
        <div className="mb-6 lg:hidden">
          <ChipEvolution activeStageIndex={index} />
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-start">
          <div className={`space-y-6 ${isEven ? "" : "lg:order-2"}`}>
            <div>
              <p className="text-sm font-mono mb-3" style={{ color: stage.color }}>
                {stage.subtitle}
              </p>
              <div className="space-y-4">
                <p className="text-slate-400 text-base md:text-lg leading-relaxed">
                  <TermText>{stage.description}</TermText>
                </p>
                {descriptionExtras.map((p, i) => (
                  <p key={i} className="text-slate-400 text-base md:text-lg leading-relaxed">
                    <TermText>{t(p)}</TermText>
                  </p>
                ))}
              </div>
            </div>

            {sourced && (
              <div
                id={`stage-${stage.id}-literature`}
                className="glass rounded-xl p-5 border-2 border-sky-500/40 bg-sky-500/[0.04] scroll-mt-28"
              >
                <h3 className="text-sm font-semibold text-sky-300 mb-1">{t(ui.sourcedEssay)}</h3>
                <p className="text-xs text-slate-500 mb-4 leading-relaxed">{t(sourced.kicker)}</p>
                <div className="space-y-5">
                  {sourced.paragraphs.map((para, i) => (
                    <div key={i}>
                      <p className="text-sm text-slate-300 leading-relaxed">
                        <TermText>{t(para.body)}</TermText>
                      </p>
                      <div className="mt-2 flex flex-wrap items-center gap-1.5">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-sky-500/70">
                          {t(ui.sourcedRefs)}
                        </span>
                        {para.refs.map((rid) => {
                          const src = sourceById(rid);
                          return (
                            <a
                              key={rid}
                              href={`#source-${rid}`}
                              className="text-[10px] font-mono px-1.5 py-0.5 rounded border border-sky-500/25 text-sky-300/90 hover:bg-sky-500/10"
                              title={src ? t(src.title) : rid}
                            >
                              {src?.cite ?? rid}
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="glass rounded-xl p-5">
              <h3 className="text-sm font-semibold text-slate-300 mb-4 flex items-center gap-2">
                <span style={{ color: stage.color }}>📖</span> {t(ui.deepDive)}
              </h3>
              <div className="space-y-3">
                {[...stage.deepDive, ...deepDiveExtras.map((p) => t(p))].map((paragraph, i) => (
                  <p key={i} className="text-sm text-slate-400 leading-relaxed">
                    <TermText>{paragraph}</TermText>
                  </p>
                ))}
                {deepDiveSourced.map((para, i) => (
                  <div key={`src-dd-${i}`} className="pt-1">
                    <p className="text-sm text-slate-400 leading-relaxed">
                      <TermText>{t(para.body)}</TermText>
                    </p>
                    <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                      {para.refs.map((rid) => {
                        const src = sourceById(rid);
                        return (
                          <a
                            key={rid}
                            href={`#source-${rid}`}
                            className="text-[10px] font-mono px-1.5 py-0.5 rounded border border-slate-600/50 text-slate-400 hover:text-sky-300 hover:border-sky-500/30"
                            title={src ? t(src.title) : rid}
                          >
                            {src?.cite ?? rid}
                          </a>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {essay && (
              <div className="glass rounded-xl p-5 border border-amber-500/15">
                <h3 className="text-sm font-semibold text-amber-300 mb-3">{t(essay.kicker)}</h3>
                <div className="space-y-3">
                  {[...essay.paragraphs, ...essayExtras].map((p, i) => (
                    <p key={i} className="text-sm text-slate-400 leading-relaxed">
                      <TermText>{t(p)}</TermText>
                    </p>
                  ))}
                </div>
              </div>
            )}

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

            {[...stage.subsections, ...subsectionExtras].map((sub, subIdx) => {
              const title =
                typeof sub.title === "object" ? t(sub.title) : sub.title;
              const content =
                typeof sub.content === "object" ? t(sub.content) : sub.content;
              const bullets = sub.bullets?.map((b) =>
                typeof b === "object" ? t(b) : b
              );
              return (
                <div key={`${stage.id}-sub-${subIdx}`} className="glass rounded-xl p-5">
                  <h3 className="text-sm font-semibold mb-2" style={{ color: stage.color }}>
                    {title}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed mb-3">
                    <TermText>{content}</TermText>
                  </p>
                  {bullets && bullets.length > 0 && (
                    <ul className="space-y-1.5">
                      {bullets.map((b) => (
                        <li key={b} className="flex items-start gap-2 text-xs text-slate-500">
                          <span style={{ color: stage.color }} className="mt-0.5">▸</span>
                          <TermText muted>{b}</TermText>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}

            {examples.length > 0 &&
              examples.map((ex) => (
                <div key={ex.id} className="glass rounded-xl p-5 border border-cyan-500/15">
                  <h3 className="text-sm font-semibold text-cyan-300 mb-3">{t(ui.exampleTitle)}</h3>
                  <p className="text-sm font-medium text-slate-200 mb-2">{t(ex.title)}</p>
                  <ul className="mb-3 space-y-1">
                    {ex.given[locale].map((g) => (
                      <li key={g} className="text-xs text-slate-500">
                        ▸ <TermText muted>{g}</TermText>
                      </li>
                    ))}
                  </ul>
                  {ex.steps.map((s) => (
                    <div key={t(s.title)} className="mb-2">
                      <p className="text-xs font-medium text-cyan-400/90">{t(s.title)}</p>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        <TermText muted>{t(s.body)}</TermText>
                      </p>
                    </div>
                  ))}
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                    <TermText muted>{t(ex.result)}</TermText>
                  </p>
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
                      <p className="text-sm font-medium text-slate-300">
                        Q: <TermText>{t(qa.question)}</TermText>
                      </p>
                      <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                        A: <TermText muted>{t(qa.answer)}</TermText>
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    <TermText>{concept}</TermText>
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
                      <p className="text-sm font-medium text-slate-300">
                        <TermText>{ec.name}</TermText>
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        <TermText muted>{ec.description}</TermText>
                      </p>
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
                          <TermText muted>{item}</TermText>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}

            {((stage.practicalNotes && stage.practicalNotes.length > 0) || workNotesExtras.length > 0) && (
              <div className="glass rounded-xl p-5 border border-amber-500/10">
                <div className="flex items-center gap-2 mb-3">
                  <Wrench className="w-4 h-4 text-amber-400" />
                  <h3 className="text-sm font-semibold text-amber-300">{t(ui.workNotes)}</h3>
                </div>
                <ul className="space-y-2">
                  {(stage.practicalNotes ?? []).map((note) => (
                    <li key={note} className="text-xs text-slate-400 leading-relaxed">
                      💡 <TermText muted>{note}</TermText>
                    </li>
                  ))}
                  {workNotesExtras.map((note) => (
                    <li key={t(note)} className="text-xs text-slate-400 leading-relaxed">
                      💡 <TermText muted>{t(note)}</TermText>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className={`hidden lg:block lg:sticky lg:top-24 ${isEven ? "" : "lg:order-1"}`}>
            <div
              className="relative overflow-hidden rounded-2xl"
              style={{ boxShadow: `0 0 40px ${stage.glowColor}` }}
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
            <TermText muted>{item}</TermText>
          </li>
        ))}
      </ul>
    </div>
  );
}
