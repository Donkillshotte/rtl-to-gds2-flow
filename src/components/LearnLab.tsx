"use client";

import { useMemo, useState } from "react";
import { GraduationCap, Calculator, Layers, ListChecks, FlipHorizontal, Swords, BookOpen } from "lucide-react";
import { useI18n } from "@/i18n/context";
import { ui } from "@/i18n/ui";
import { quizBank, workedExamples } from "@/data/quizBank";
import { extraInterview } from "@/data/interviewExtra";
import { stageInterview } from "@/data/stageFormulas";
import { scenarios } from "@/data/scenarios";
import { playbook } from "@/data/playbook";
import { playbookMore } from "@/data/playbookMore";
import { playbookEvenMore } from "@/data/playbookEvenMore";
import type { StageId } from "@/data/stages";
import { cn } from "@/lib/utils";

const allPlaybook = [...playbook, ...playbookMore, ...playbookEvenMore];

type Tab = "quiz" | "cards" | "scenarios" | "playbook" | "calc" | "examples";

const STAGE_OPTS: { id: StageId | "all"; label: string }[] = [
  { id: "all", label: "ALL" },
  { id: "sta", label: "STA" },
  { id: "cts", label: "CTS" },
  { id: "floorplan", label: "FP" },
  { id: "pdn", label: "PDN" },
  { id: "placement", label: "PLC" },
  { id: "routing", label: "RT" },
  { id: "power", label: "IR" },
  { id: "pv", label: "PV" },
  { id: "package", label: "PKG" },
  { id: "tapeout", label: "TO" },
  { id: "rtl", label: "RTL" },
];

export function LearnLab() {
  const { t } = useI18n();
  const [tab, setTab] = useState<Tab>("quiz");

  return (
    <section id="learn-lab" className="relative py-16 sm:py-24 px-4 sm:px-6 border-t border-slate-800/50">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-3">
          <GraduationCap className="w-6 h-6 text-amber-400" />
          <h2 className="text-3xl md:text-4xl font-bold">{t(ui.learnTitle)}</h2>
        </div>
        <p className="text-slate-400 mb-8 max-w-3xl">{t(ui.learnSubtitle)}</p>

        <div className="flex flex-wrap gap-2 mb-8">
          {(
            [
              ["quiz", t(ui.learnQuiz), ListChecks],
              ["cards", t(ui.learnCards), FlipHorizontal],
              ["scenarios", t(ui.learnScenarios), Swords],
              ["playbook", t(ui.learnPlaybook), BookOpen],
              ["calc", t(ui.learnCalc), Calculator],
              ["examples", t(ui.learnExamples), Layers],
            ] as const
          ).map(([id, label, Icon]) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-colors",
                tab === id
                  ? "bg-amber-500/15 text-amber-300 border-amber-500/40"
                  : "text-slate-400 border-slate-700/40 hover:text-slate-200"
              )}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {tab === "quiz" && <QuizPanel />}
        {tab === "cards" && <CardPanel />}
        {tab === "scenarios" && <ScenarioPanel />}
        {tab === "playbook" && <PlaybookPanel />}
        {tab === "calc" && <CalcPanel />}
        {tab === "examples" && <ExamplePanel />}
      </div>
    </section>
  );
}

function QuizPanel() {
  const { t, locale } = useI18n();
  const [filter, setFilter] = useState<StageId | "all" | "cross">("all");
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState({ ok: 0, n: 0 });

  const items = useMemo(() => {
    const pool = filter === "all" ? quizBank : quizBank.filter((q) => q.stage === filter);
    return pool.length ? pool : quizBank;
  }, [filter]);

  const q = items[idx % items.length];
  const choices = q.choices[locale];

  const choose = (i: number) => {
    if (picked !== null) return;
    setPicked(i);
    setScore((s) => ({ ok: s.ok + (i === q.correct ? 1 : 0), n: s.n + 1 }));
  };

  const next = () => {
    setPicked(null);
    setIdx((i) => (i + 1) % items.length);
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-4">
        {STAGE_OPTS.map((o) => (
          <button
            key={o.id}
            type="button"
            onClick={() => {
              setFilter(o.id === "all" ? "all" : o.id);
              setIdx(0);
              setPicked(null);
            }}
            className={cn(
              "px-2.5 py-1 rounded-lg text-[11px] font-mono border",
              filter === o.id
                ? "text-amber-300 border-amber-500/40 bg-amber-500/10"
                : "text-slate-500 border-slate-700/40"
            )}
          >
            {o.label}
          </button>
        ))}
        <span className="ml-auto text-xs font-mono text-slate-500 self-center">
          {score.n ? `${score.ok}/${score.n}` : t(ui.learnScore)}
        </span>
      </div>

      <div className="glass rounded-2xl p-5 sm:p-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[10px] font-mono uppercase text-amber-400/80">{q.stage}</span>
          <span className="text-[10px] font-mono text-slate-500">{q.difficulty}</span>
        </div>
        <p className="text-slate-200 font-medium mb-4 leading-relaxed">{t(q.question)}</p>
        <div className="space-y-2">
          {choices.map((c, i) => {
            const show = picked !== null;
            const good = i === q.correct;
            const bad = show && i === picked && i !== q.correct;
            return (
              <button
                key={c}
                type="button"
                onClick={() => choose(i)}
                className={cn(
                  "w-full text-left px-4 py-3 rounded-xl text-sm border transition-colors",
                  !show && "border-slate-700/50 hover:border-amber-500/30 text-slate-300",
                  show && good && "border-green-500/50 bg-green-500/10 text-green-200",
                  bad && "border-red-500/40 bg-red-500/10 text-red-200"
                )}
              >
                {c}
              </button>
            );
          })}
        </div>
        {picked !== null && (
          <div className="mt-4">
            <p className="text-sm text-slate-400 leading-relaxed">{t(q.explain)}</p>
            <button
              type="button"
              onClick={next}
              className="mt-4 px-4 py-2 rounded-lg text-sm bg-amber-500/20 text-amber-300 border border-amber-500/30"
            >
              {t(ui.learnNext)}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function CardPanel() {
  const { t } = useI18n();
  const cards = useMemo(() => {
    const fromStages = (Object.keys(stageInterview) as StageId[]).flatMap((id) =>
      stageInterview[id].map((q) => ({ stage: id, question: q.question, answer: q.answer }))
    );
    const extra = (Object.keys(extraInterview) as StageId[]).flatMap((id) =>
      extraInterview[id].map((q) => ({ stage: id, question: q.question, answer: q.answer }))
    );
    return [...fromStages, ...extra];
  }, []);
  const [i, setI] = useState(0);
  const [flip, setFlip] = useState(false);
  const c = cards[i % cards.length];

  return (
    <div>
      <button
        type="button"
        onClick={() => setFlip((f) => !f)}
        className="w-full glass rounded-2xl p-8 min-h-[220px] text-left"
      >
        <p className="text-[10px] font-mono text-amber-400 mb-3">{c.stage.toUpperCase()}</p>
        <p className="text-lg text-slate-200 leading-relaxed">
          {flip ? t(c.answer) : t(c.question)}
        </p>
        <p className="text-xs text-slate-500 mt-6">{flip ? t(ui.learnQ) : t(ui.learnTap)}</p>
      </button>
      <div className="flex justify-between mt-4">
        <button
          type="button"
          className="px-4 py-2 text-sm text-slate-400"
          onClick={() => {
            setFlip(false);
            setI((x) => (x - 1 + cards.length) % cards.length);
          }}
        >
          ←
        </button>
        <span className="text-xs font-mono text-slate-500 self-center">
          {(i % cards.length) + 1}/{cards.length}
        </span>
        <button
          type="button"
          className="px-4 py-2 text-sm text-slate-400"
          onClick={() => {
            setFlip(false);
            setI((x) => (x + 1) % cards.length);
          }}
        >
          →
        </button>
      </div>
    </div>
  );
}

function ScenarioPanel() {
  const { t, locale } = useI18n();
  const [sid, setSid] = useState(scenarios[0].id);
  const sc = scenarios.find((s) => s.id === sid) ?? scenarios[0];
  const [step, setStep] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState({ ok: 0, n: 0 });
  const done = step >= sc.steps.length;
  const st = !done ? sc.steps[step] : null;
  const choices = st ? st.choices[locale] : [];

  const reset = (id = sid) => {
    setSid(id);
    setStep(0);
    setPicked(null);
    setScore({ ok: 0, n: 0 });
  };

  const choose = (i: number) => {
    if (!st || picked !== null) return;
    setPicked(i);
    setScore((s) => ({ ok: s.ok + (i === st.correct ? 1 : 0), n: s.n + 1 }));
  };

  const next = () => {
    setPicked(null);
    setStep((s) => s + 1);
  };

  return (
    <div className="grid lg:grid-cols-[240px_1fr] gap-6">
      <div>
        <p className="text-[11px] font-mono text-slate-500 mb-2">{t(ui.learnPickScenario)}</p>
        <div className="flex lg:flex-col gap-2 overflow-x-auto pb-2">
          {scenarios.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => reset(s.id)}
              className={cn(
                "text-left px-3 py-2 rounded-lg text-xs border shrink-0",
                s.id === sid
                  ? "border-amber-500/40 text-amber-300 bg-amber-500/10"
                  : "border-slate-700/40 text-slate-400"
              )}
            >
              <span className="block font-mono text-[10px] text-slate-500 mb-0.5">{s.stage}</span>
              {t(s.title)}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="glass rounded-2xl p-5 sm:p-6">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="text-[10px] font-mono uppercase text-amber-400/80">{sc.stage}</span>
            <span className="text-[10px] font-mono text-slate-500 ml-auto">
              {done ? `${score.ok}/${score.n}` : `${t(ui.learnStepOf)} ${step + 1}/${sc.steps.length}`}
              {score.n > 0 && !done ? ` · ${score.ok}/${score.n}` : ""}
            </span>
          </div>
          <h3 className="text-lg font-semibold text-slate-100 mb-1">{t(sc.title)}</h3>
          <p className="text-xs font-mono text-amber-300/80 mb-3">{t(sc.role)}</p>
          <p className="text-sm text-slate-300 leading-relaxed">{t(sc.briefing)}</p>
          <p className="text-[11px] font-mono text-slate-500 mt-4 mb-2">{t(ui.learnSymptoms)}</p>
          <ul className="space-y-1">
            {sc.symptoms[locale].map((line) => (
              <li key={line} className="text-sm text-slate-400 font-mono">
                ▸ {line}
              </li>
            ))}
          </ul>
        </div>

        {!done && st && (
          <div className="glass rounded-2xl p-5 sm:p-6">
            <p className="text-slate-200 font-medium mb-4 leading-relaxed">{t(st.prompt)}</p>
            <div className="space-y-2">
              {choices.map((c, i) => {
                const show = picked !== null;
                const good = i === st.correct;
                const bad = show && i === picked && i !== st.correct;
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => choose(i)}
                    className={cn(
                      "w-full text-left px-4 py-3 rounded-xl text-sm border transition-colors",
                      !show && "border-slate-700/50 hover:border-amber-500/30 text-slate-300",
                      show && good && "border-green-500/50 bg-green-500/10 text-green-200",
                      bad && "border-red-500/40 bg-red-500/10 text-red-200"
                    )}
                  >
                    {c}
                  </button>
                );
              })}
            </div>
            {picked !== null && (
              <div className="mt-4">
                <p className="text-[11px] font-mono text-amber-400/80 mb-1">{t(ui.learnDebrief)}</p>
                <p className="text-sm text-slate-400 leading-relaxed">{t(st.debrief)}</p>
                <button
                  type="button"
                  onClick={next}
                  className="mt-4 px-4 py-2 rounded-lg text-sm bg-amber-500/20 text-amber-300 border border-amber-500/30"
                >
                  {step + 1 < sc.steps.length ? t(ui.learnNextStep) : t(ui.learnClosing)}
                </button>
              </div>
            )}
          </div>
        )}

        {done && (
          <div className="glass rounded-2xl p-5 sm:p-6 border border-amber-500/20">
            <p className="text-[11px] font-mono text-amber-400/80 mb-2">{t(ui.learnClosing)}</p>
            <p className="text-sm text-slate-200 leading-relaxed mb-4">{t(sc.closing)}</p>
            <p className="text-xs font-mono text-slate-500 mb-4">
              {score.ok}/{score.n}
            </p>
            <button
              type="button"
              onClick={() => reset(sid)}
              className="px-4 py-2 rounded-lg text-sm bg-amber-500/20 text-amber-300 border border-amber-500/30"
            >
              {t(ui.learnRestart)}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function PlaybookPanel() {
  const { t } = useI18n();
  const [id, setId] = useState(allPlaybook[0].id);
  const ch = allPlaybook.find((c) => c.id === id) ?? allPlaybook[0];

  return (
    <div className="grid lg:grid-cols-[220px_1fr] gap-6">
      <div className="flex lg:flex-col gap-2 overflow-x-auto">
        {allPlaybook.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setId(c.id)}
            className={cn(
              "text-left px-3 py-2 rounded-lg text-xs border shrink-0",
              c.id === id ? "border-amber-500/40 text-amber-300 bg-amber-500/10" : "border-slate-700/40 text-slate-400"
            )}
          >
            {t(c.title)}
          </button>
        ))}
      </div>
      <article className="glass rounded-2xl p-5 sm:p-6 space-y-4">
        <h3 className="text-xl font-semibold text-slate-100">{t(ch.title)}</h3>
        <p className="text-sm text-amber-300/90 leading-relaxed">{t(ch.kicker)}</p>
        {ch.paragraphs.map((p, i) => (
          <p key={i} className="text-sm text-slate-400 leading-relaxed">
            {t(p)}
          </p>
        ))}
      </article>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  unit,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
  unit: string;
}) {
  return (
    <label className="block">
      <span className="text-[11px] font-mono text-slate-500">{label}</span>
      <div className="flex items-center gap-2 mt-1">
        <input
          type="number"
          step="any"
          value={Number.isFinite(value) ? value : 0}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="w-full px-3 py-2 rounded-lg bg-slate-900/70 border border-slate-700/50 text-sm text-slate-200"
        />
        <span className="text-xs text-slate-500 w-10">{unit}</span>
      </div>
    </label>
  );
}

function CalcPanel() {
  const { t } = useI18n();
  const [mode, setMode] = useState<"sta" | "ir" | "util" | "ant">("sta");

  const [tclk, setTclk] = useState(1000);
  const [tco, setTco] = useState(80);
  const [tpd, setTpd] = useState(720);
  const [tsu, setTsu] = useState(40);
  const [th, setTh] = useState(25);
  const [tl, setTl] = useState(310);
  const [tc, setTc] = useState(350);
  const [uSu, setUSu] = useState(50);
  const [uH, setUH] = useState(20);

  const skew = tc - tl;
  const at = tl + tco + tpd;
  const rt = tc + tclk - tsu - uSu;
  const setup = rt - at;
  const holdNeed = th + skew + uH;
  const holdHave = tco + tpd;
  const hold = holdHave - holdNeed;

  const [vdd, setVdd] = useState(0.8);
  const [cur, setCur] = useState(1.2);
  const [res, setRes] = useState(25);
  const vdrop = cur * (res / 1000);
  const pct = vdd > 0 ? (vdrop / vdd) * 100 : 0;

  const [acell, setAcell] = useState(2.1);
  const [acore, setAcore] = useState(3.0);
  const util = acore > 0 ? (acell / acore) * 100 : 0;

  const [am, setAm] = useState(6);
  const [ag, setAg] = useState(0.02);
  const [rmax, setRmax] = useState(200);
  const ratio = ag > 0 ? am / ag : 0;

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-5">
        {(
          [
            ["sta", "STA slack"],
            ["ir", "IR drop"],
            ["util", "Utilization"],
            ["ant", "Antenna"],
          ] as const
        ).map(([id, lab]) => (
          <button
            key={id}
            type="button"
            onClick={() => setMode(id)}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-mono border",
              mode === id ? "text-amber-300 border-amber-500/40 bg-amber-500/10" : "text-slate-500 border-slate-700/40"
            )}
          >
            {lab}
          </button>
        ))}
      </div>

      {mode === "sta" && (
        <div className="grid sm:grid-cols-2 gap-6">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Tclk" value={tclk} onChange={setTclk} unit="ps" />
            <Field label="Tco" value={tco} onChange={setTco} unit="ps" />
            <Field label="Tpd" value={tpd} onChange={setTpd} unit="ps" />
            <Field label="Tsu" value={tsu} onChange={setTsu} unit="ps" />
            <Field label="Thold" value={th} onChange={setTh} unit="ps" />
            <Field label="Tclk launch" value={tl} onChange={setTl} unit="ps" />
            <Field label="Tclk capture" value={tc} onChange={setTc} unit="ps" />
            <Field label="Unc setup" value={uSu} onChange={setUSu} unit="ps" />
            <Field label="Unc hold" value={uH} onChange={setUH} unit="ps" />
          </div>
          <div className="glass rounded-2xl p-5 space-y-3 font-mono text-sm">
            <Row k="Skew (cap−lnch)" v={`${skew.toFixed(1)} ps`} />
            <Row k="Arrival" v={`${at.toFixed(1)} ps`} />
            <Row k="Required (setup)" v={`${rt.toFixed(1)} ps`} />
            <Row k="Setup slack" v={`${setup.toFixed(1)} ps`} ok={setup >= 0} />
            <Row k="Hold slack" v={`${hold.toFixed(1)} ps`} ok={hold >= 0} />
            <p className="text-xs text-slate-500 font-sans leading-relaxed pt-2">{t(ui.learnStaHint)}</p>
          </div>
        </div>
      )}

      {mode === "ir" && (
        <div className="grid sm:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Field label="VDD" value={vdd} onChange={setVdd} unit="V" />
            <Field label="I avg" value={cur} onChange={setCur} unit="A" />
            <Field label="R path" value={res} onChange={setRes} unit="mΩ" />
          </div>
          <div className="glass rounded-2xl p-5 space-y-3 font-mono text-sm">
            <Row k="Vdrop = I·R" v={`${(vdrop * 1000).toFixed(1)} mV`} />
            <Row k="% VDD" v={`${pct.toFixed(2)} %`} ok={pct <= 5} />
            <p className="text-xs text-slate-500 font-sans leading-relaxed pt-2">{t(ui.learnIrHint)}</p>
          </div>
        </div>
      )}

      {mode === "util" && (
        <div className="grid sm:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Field label="A std+macro" value={acell} onChange={setAcell} unit="mm²" />
            <Field label="A core" value={acore} onChange={setAcore} unit="mm²" />
          </div>
          <div className="glass rounded-2xl p-5 space-y-3 font-mono text-sm">
            <Row k="U core" v={`${util.toFixed(1)} %`} ok={util >= 55 && util <= 80} />
            <p className="text-xs text-slate-500 font-sans leading-relaxed pt-2">{t(ui.learnUtilHint)}</p>
          </div>
        </div>
      )}

      {mode === "ant" && (
        <div className="grid sm:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Field label="A metal" value={am} onChange={setAm} unit="µm²" />
            <Field label="A gate" value={ag} onChange={setAg} unit="µm²" />
            <Field label="Rmax" value={rmax} onChange={setRmax} unit="" />
          </div>
          <div className="glass rounded-2xl p-5 space-y-3 font-mono text-sm">
            <Row k="Ratio" v={ratio.toFixed(1)} ok={ratio < rmax} />
            <p className="text-xs text-slate-500 font-sans leading-relaxed pt-2">{t(ui.learnAntHint)}</p>
          </div>
        </div>
      )}
    </div>
  );
}

function Row({ k, v, ok }: { k: string; v: string; ok?: boolean }) {
  return (
    <div className="flex justify-between gap-3">
      <span className="text-slate-500">{k}</span>
      <span className={ok === undefined ? "text-slate-200" : ok ? "text-green-400" : "text-red-400"}>{v}</span>
    </div>
  );
}

function ExamplePanel() {
  const { t, locale } = useI18n();
  const [id, setId] = useState(workedExamples[0].id);
  const ex = workedExamples.find((e) => e.id === id) ?? workedExamples[0];
  const [open, setOpen] = useState(0);

  return (
    <div className="grid lg:grid-cols-[220px_1fr] gap-6">
      <div className="flex lg:flex-col gap-2 overflow-x-auto">
        {workedExamples.map((e) => (
          <button
            key={e.id}
            type="button"
            onClick={() => {
              setId(e.id);
              setOpen(0);
            }}
            className={cn(
              "text-left px-3 py-2 rounded-lg text-xs border shrink-0",
              e.id === id ? "border-amber-500/40 text-amber-300 bg-amber-500/10" : "border-slate-700/40 text-slate-400"
            )}
          >
            {t(e.title)}
          </button>
        ))}
      </div>
      <div className="glass rounded-2xl p-5 space-y-4">
        <h3 className="font-semibold text-slate-200">{t(ex.title)}</h3>
        <div>
          <p className="text-[11px] font-mono text-slate-500 mb-2">GIVEN</p>
          <ul className="space-y-1">
            {ex.given[locale].map((g) => (
              <li key={g} className="text-sm text-slate-400">
                ▸ {g}
              </li>
            ))}
          </ul>
        </div>
        {ex.steps.map((s, i) => (
          <button
            key={t(s.title)}
            type="button"
            onClick={() => setOpen(i)}
            className="block w-full text-left"
          >
            <p className="text-sm font-medium text-amber-300/90">
              {i + 1}. {t(s.title)}
            </p>
            {open >= i && <p className="text-sm text-slate-400 mt-1 leading-relaxed">{t(s.body)}</p>}
          </button>
        ))}
        <div className="border-t border-slate-700/40 pt-3">
          <p className="text-sm text-slate-300 leading-relaxed">{t(ex.result)}</p>
        </div>
      </div>
    </div>
  );
}
