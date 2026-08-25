export function SummarySection() {
  return (
    <section className="relative py-32 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <div>
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Dal Silicio alla Geometria
          </h2>
          <p className="text-slate-400 text-lg leading-relaxed mb-12 max-w-2xl mx-auto">
            Il flusso RTL → GDSII rappresenta la transizione dalla descrizione
            astratta del comportamento di un circuito alla sua realizzazione fisica
            su un wafer di silicio. Ogni fase aggiunge un livello di dettaglio
            geometrico e fisico, fino a produrre il file GDSII che la fonderia
            utilizzerà per creare le maschere fotolitografiche.
          </p>

          <div className="grid sm:grid-cols-3 gap-6 mb-16">
            {[
              { value: "8", label: "Fasi del flusso", color: "#22d3ee" },
              { value: "nm", label: "Scale di tecnologia", color: "#a78bfa" },
              { value: "GDSII", label: "Formato output", color: "#60a5fa" },
            ].map((stat) => (
              <div key={stat.label} className="glass rounded-xl p-6">
                <div
                  className="text-3xl font-bold font-mono mb-1"
                  style={{ color: stat.color }}
                >
                  {stat.value}
                </div>
                <div className="text-sm text-slate-400">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="glass rounded-2xl p-8 text-left">
            <h3 className="text-lg font-semibold mb-4 text-slate-200">
              Iterazioni e Closure
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">
              In un flusso reale, le fasi non sono sempre lineari. Il timing
              closure può richiedere iterazioni tra placement, CTS e routing.
              Le ECO (Engineering Change Order) permettono modifiche locali
              senza ripetere l&apos;intero flusso. Il power optimization e la
              signal integrity analysis possono innescare ulteriori cicli di
              refinement fino al signoff completo.
            </p>
            <div className="flex flex-wrap gap-2">
              {["Timing Closure", "ECO Flow", "Power Optimization", "SI Fix", "DFM"].map(
                (tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-lg text-xs font-mono bg-slate-800/50 text-slate-400 border border-slate-700/50"
                  >
                    {tag}
                  </span>
                )
              )}
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
        <p className="text-xs text-slate-600 font-mono">
          Educational reference · Not affiliated with any EDA vendor
        </p>
      </div>
    </footer>
  );
}
