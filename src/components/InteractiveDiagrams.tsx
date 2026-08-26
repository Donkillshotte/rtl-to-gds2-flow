"use client";

import { useState } from "react";
import { GitBranch } from "lucide-react";
import { useI18n, loc, type Localized } from "@/i18n/context";
import { ui } from "@/i18n/ui";
import { cn } from "@/lib/utils";

type DiagramId = "pdn" | "cts" | "scan" | "setup-hold";

const tabs: { id: DiagramId; label: Localized }[] = [
  { id: "pdn", label: loc("PDN straps", "PDN straps") },
  { id: "cts", label: loc("CTS tree", "CTS tree") },
  { id: "scan", label: loc("Scan chain", "Scan chain") },
  { id: "setup-hold", label: loc("Setup / Hold", "Setup / Hold") },
];

export function InteractiveDiagrams() {
  const { t } = useI18n();
  const [tab, setTab] = useState<DiagramId>("pdn");

  return (
    <section id="diagrams" className="scroll-mt-24 relative py-16 sm:py-24 px-4 sm:px-6 border-t border-slate-800/50">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-2">
          <GitBranch className="w-6 h-6 text-violet-400" />
          <h2 className="text-3xl font-bold text-slate-100 sm:text-4xl">{t(ui.diagramTitle)}</h2>
        </div>
        <p className="text-slate-400 mb-6 max-w-3xl">{t(ui.diagramLead)}</p>

        <div className="flex flex-wrap gap-2 mb-6">
          {tabs.map((tb) => (
            <button
              key={tb.id}
              type="button"
              onClick={() => setTab(tb.id)}
              className={cn(
                "px-3 py-1.5 rounded-xl text-sm border transition-colors",
                tab === tb.id
                  ? "bg-violet-500/15 text-violet-300 border-violet-500/40"
                  : "text-slate-400 border-slate-700/40 hover:text-slate-200"
              )}
            >
              {t(tb.label)}
            </button>
          ))}
        </div>

        <div className="glass rounded-2xl p-4 sm:p-6">
          {tab === "pdn" && <PdnDiagram />}
          {tab === "cts" && <CtsDiagram />}
          {tab === "scan" && <ScanDiagram />}
          {tab === "setup-hold" && <SetupHoldDiagram />}
        </div>
      </div>
    </section>
  );
}

function PdnDiagram() {
  const { t } = useI18n();
  const [layer, setLayer] = useState<"rails" | "straps" | "rings">("rails");

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <svg viewBox="0 0 320 220" className="w-full max-h-64 text-slate-600" aria-hidden>
        <rect x="20" y="20" width="280" height="180" fill="none" stroke="currentColor" strokeWidth="1" rx="4" />
        {(layer === "rings" || layer === "straps" || layer === "rails") && (
          <>
            <rect x="20" y="20" width="280" height="10" fill="#22d3ee" opacity={layer === "rings" ? 0.9 : 0.25} />
            <rect x="20" y="190" width="280" height="10" fill="#64748b" opacity={layer === "rings" ? 0.9 : 0.25} />
            <rect x="20" y="20" width="10" height="180" fill="#22d3ee" opacity={layer === "rings" ? 0.7 : 0.2} />
            <rect x="290" y="20" width="10" height="180" fill="#64748b" opacity={layer === "rings" ? 0.7 : 0.2} />
          </>
        )}
        {(layer === "straps" || layer === "rails") &&
          [70, 120, 170].map((y) => (
            <rect
              key={y}
              x="40"
              y={y}
              width="240"
              height="6"
              fill="#22d3ee"
              opacity={layer === "straps" ? 0.85 : 0.3}
            />
          ))}
        {layer === "rails" &&
          Array.from({ length: 8 }).map((_, i) => (
            <rect
              key={i}
              x={50 + i * 28}
              y="40"
              width="4"
              height="140"
              fill={i % 2 === 0 ? "#22d3ee" : "#94a3b8"}
              opacity={0.9}
            />
          ))}
      </svg>
      <div>
        <p className="text-sm text-slate-400 mb-4 leading-relaxed">{t(ui.diagramPdnHint)}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {(
            [
              ["rails", t(ui.diagramPdnRails)],
              ["straps", t(ui.diagramPdnStraps)],
              ["rings", t(ui.diagramPdnRings)],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setLayer(id)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs border",
                layer === id
                  ? "border-cyan-500/40 text-cyan-300 bg-cyan-500/10"
                  : "border-slate-700/40 text-slate-500"
              )}
            >
              {label}
            </button>
          ))}
        </div>
        <a href="#stage-pdn" className="text-sm text-cyan-400 hover:text-cyan-300">
          → {t(ui.diagramGotoStage)} PDN
        </a>
      </div>
    </div>
  );
}

function CtsDiagram() {
  const { t } = useI18n();
  const [level, setLevel] = useState(0);
  const levels = [
    t(ui.diagramCtsL0),
    t(ui.diagramCtsL1),
    t(ui.diagramCtsL2),
    t(ui.diagramCtsL3),
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <svg viewBox="0 0 320 220" className="w-full max-h-64" aria-hidden>
        <circle cx="160" cy="30" r="10" fill="#fbbf24" opacity={level >= 0 ? 1 : 0.2} />
        <line x1="160" y1="40" x2="80" y2="90" stroke="#64748b" strokeWidth="2" opacity={level >= 1 ? 1 : 0.2} />
        <line x1="160" y1="40" x2="240" y2="90" stroke="#64748b" strokeWidth="2" opacity={level >= 1 ? 1 : 0.2} />
        <circle cx="80" cy="95" r="8" fill="#a78bfa" opacity={level >= 1 ? 1 : 0.2} />
        <circle cx="240" cy="95" r="8" fill="#a78bfa" opacity={level >= 1 ? 1 : 0.2} />
        {[40, 90, 140, 190, 230, 280].map((x, i) => (
          <g key={x} opacity={level >= 2 ? 1 : 0.15}>
            <line
              x1={i < 3 ? 80 : 240}
              y1="103"
              x2={x}
              y2="150"
              stroke="#475569"
              strokeWidth="1.5"
            />
            <circle cx={x} cy="155" r="6" fill="#22d3ee" />
          </g>
        ))}
        {level >= 3 &&
          [40, 90, 140, 190, 230, 280].map((x) =>
            [-12, 0, 12].map((dx) => (
              <rect
                key={`${x}-${dx}`}
                x={x + dx - 3}
                y="175"
                width="6"
                height="10"
                rx="1"
                fill="#34d399"
                opacity={0.85}
              />
            ))
          )}
      </svg>
      <div>
        <p className="text-sm text-slate-400 mb-4">{levels[level]}</p>
        <input
          type="range"
          min={0}
          max={3}
          value={level}
          onChange={(e) => setLevel(Number(e.target.value))}
          className="w-full accent-violet-400"
        />
        <p className="mt-2 text-xs font-mono text-slate-500">
          {t(ui.diagramCtsLevel)}: {level}
        </p>
        <a href="#stage-cts" className="mt-4 inline-block text-sm text-cyan-400 hover:text-cyan-300">
          → {t(ui.diagramGotoStage)} CTS
        </a>
      </div>
    </div>
  );
}

function ScanDiagram() {
  const { t } = useI18n();
  const [se, setSe] = useState(false);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <svg viewBox="0 0 340 160" className="w-full max-h-56" aria-hidden>
        {[0, 1, 2, 3].map((i) => {
          const x = 40 + i * 75;
          return (
            <g key={i}>
              <rect x={x} y="50" width="50" height="40" rx="4" fill="#1e293b" stroke="#22d3ee" />
              <text x={x + 25} y="74" textAnchor="middle" fill="#94a3b8" fontSize="11" fontFamily="monospace">
                FF{i}
              </text>
              {i < 3 && (
                <path
                  d={`M${x + 50} 70 H${x + 75}`}
                  stroke={se ? "#fbbf24" : "#334155"}
                  strokeWidth="2"
                  markerEnd="url(#arrow)"
                />
              )}
            </g>
          );
        })}
        <defs>
          <marker id="arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill={se ? "#fbbf24" : "#334155"} />
          </marker>
        </defs>
        <text x="20" y="30" fill="#94a3b8" fontSize="12" fontFamily="monospace">
          SI →
        </text>
        <text x="300" y="30" fill="#94a3b8" fontSize="12" fontFamily="monospace">
          SO
        </text>
        <text x="140" y="130" fill={se ? "#fbbf24" : "#64748b"} fontSize="13" fontFamily="monospace">
          SE = {se ? "1 (shift)" : "0 (func)"}
        </text>
      </svg>
      <div>
        <p className="text-sm text-slate-400 mb-4 leading-relaxed">{t(ui.diagramScanHint)}</p>
        <button
          type="button"
          onClick={() => setSe((v) => !v)}
          className={cn(
            "px-4 py-2 rounded-xl text-sm border font-mono",
            se
              ? "border-amber-500/40 bg-amber-500/15 text-amber-300"
              : "border-slate-700/50 text-slate-400"
          )}
        >
          {t(ui.diagramScanToggle)}
        </button>
        <a href="#stage-cts" className="mt-4 block text-sm text-cyan-400 hover:text-cyan-300">
          → {t(ui.diagramGotoStage)} DFT / CTS
        </a>
      </div>
    </div>
  );
}

function SetupHoldDiagram() {
  const { t } = useI18n();
  const [mode, setMode] = useState<"setup" | "hold">("setup");

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <svg viewBox="0 0 340 180" className="w-full max-h-56" aria-hidden>
        <line x1="20" y1="90" x2="320" y2="90" stroke="#334155" strokeWidth="1" />
        <line x1="80" y1="40" x2="80" y2="140" stroke="#22d3ee" strokeWidth="2" />
        <line x1="240" y1="40" x2="240" y2="140" stroke="#22d3ee" strokeWidth="2" />
        <text x="80" y="30" textAnchor="middle" fill="#22d3ee" fontSize="11" fontFamily="monospace">
          launch
        </text>
        <text x="240" y="30" textAnchor="middle" fill="#22d3ee" fontSize="11" fontFamily="monospace">
          capture
        </text>
        {mode === "setup" ? (
          <>
            <path d="M90 100 Q160 130 230 100" fill="none" stroke="#f472b6" strokeWidth="2" />
            <text x="160" y="145" textAnchor="middle" fill="#f472b6" fontSize="11">
              Tco + Tpd ≤ Tclk − Tsu
            </text>
          </>
        ) : (
          <>
            <path d="M90 80 Q120 50 150 80" fill="none" stroke="#fb923c" strokeWidth="2" />
            <text x="160" y="145" textAnchor="middle" fill="#fb923c" fontSize="11">
              Tco + Tpd ≥ Thold (+skew)
            </text>
          </>
        )}
      </svg>
      <div>
        <div className="flex gap-2 mb-4">
          <button
            type="button"
            onClick={() => setMode("setup")}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs border",
              mode === "setup"
                ? "border-pink-500/40 text-pink-300 bg-pink-500/10"
                : "border-slate-700/40 text-slate-500"
            )}
          >
            Setup
          </button>
          <button
            type="button"
            onClick={() => setMode("hold")}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs border",
              mode === "hold"
                ? "border-orange-500/40 text-orange-300 bg-orange-500/10"
                : "border-slate-700/40 text-slate-500"
            )}
          >
            Hold
          </button>
        </div>
        <p className="text-sm text-slate-400 leading-relaxed">
          {mode === "setup" ? t(ui.diagramSetupHint) : t(ui.diagramHoldHint)}
        </p>
        <a href="#stage-sta" className="mt-4 inline-block text-sm text-cyan-400 hover:text-cyan-300">
          → {t(ui.diagramGotoStage)} STA
        </a>
        <a href="#compare" className="mt-2 block text-sm text-slate-500 hover:text-slate-300">
          → {t(ui.compareTitle)}
        </a>
      </div>
    </div>
  );
}
