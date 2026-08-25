export function SummarySection() {
  return (
    <section className="relative py-32 px-6 border-t border-slate-800/50">
      <div className="max-w-4xl mx-auto text-center">
        <div>
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Dal Silicio alla Geometria
          </h2>
          <p className="text-slate-400 text-lg leading-relaxed mb-12 max-w-2xl mx-auto">
            Il flusso RTL → GDSII attraversa front-end (RTL, formal, sintesi),
            physical design (floorplan, PDN, placement, CTS, routing, layout),
            e signoff (STA, PV, power, package, tapeout). Ogni fase ha exit criteria
            formali — Floorplan Exit, PRO Exit, GKC, BTO/MTO — che garantiscono
            qualità prima di procedere.
          </p>

          <div className="grid sm:grid-cols-4 gap-4 mb-16">
            {[
              { value: "14", label: "Fasi del flusso", color: "#22d3ee" },
              { value: "35+", label: "Termini nel glossario", color: "#a78bfa" },
              { value: "50+", label: "Check di signoff", color: "#34d399" },
              { value: "GDSII", label: "Output finale", color: "#60a5fa" },
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
              <h3 className="text-lg font-semibold mb-3 text-slate-200">
                Iterazioni e Timing Closure
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                In un flusso reale, le fasi non sono sempre lineari. Il timing closure
                richiede iterazioni tra placement, CTS e routing. Le ECO (Engineering Change Order)
                permettono fix locali. Il power optimization e la signal integrity possono
                innescare ulteriori cicli fino al signoff completo su tutti i corner PVT.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3 text-slate-200">
                Costo del Tapeout
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Per nodi avanzati (≤7nm), un mask set costa $2-5M+. La fabbricazione richiede
                3-4 mesi. Dopo il tapeout non c&apos;è undo — ogni bug scoperto solo con il silicon
                richiede un respin. Per prototipi si usa MPW (Multi-Project Wafer) con costi ridotti.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                "Timing Closure", "ECO Flow", "Formal Verification", "CDC/RDC",
                "Floorplan Exit", "PRO Exit", "BTO/MTO", "GKC", "DFM", "MPW",
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
  return (
    <footer className="border-t border-slate-800/50 py-12 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center">
            <span className="text-cyan-400 font-mono text-[8px] font-bold">PD</span>
          </div>
          <span className="text-sm text-slate-500">
            Physical Design Flow — RTL to GDSII
          </span>
        </div>
        <p className="text-xs text-slate-600 font-mono text-center">
          Riferimento educativo · Contenuti basati su flussi industriali EDA (Synopsys, Cadence, Calibre)
        </p>
      </div>
    </footer>
  );
}
