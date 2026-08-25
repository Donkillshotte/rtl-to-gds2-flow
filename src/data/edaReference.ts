import { loc, type Localized } from "@/i18n/context";

export interface EdaArtifact {
  ext: string;
  name: Localized;
  phase: Localized;
  description: Localized;
}

export const edaArtifacts: EdaArtifact[] = [
  {
    ext: ".sv / .v",
    name: loc("RTL SystemVerilog", "SystemVerilog RTL"),
    phase: loc("Front-End", "Front-End"),
    description: loc(
      "Sorgente sintetizzabile. Handoff FE: unico golden insieme a UPF e SDC preliminare.",
      "Synthesizable source. FE handoff: golden together with UPF and preliminary SDC."
    ),
  },
  {
    ext: ".sdc",
    name: loc("Timing constraints", "Timing constraints"),
    phase: loc("FE → STA", "FE → STA"),
    description: loc(
      "Clock, I/O delay, false/multicycle, uncertainty, derate. Evolue: ideale in sintesi, propagated in PD/STA.",
      "Clocks, I/O delay, false/multicycle, uncertainty, derate. Evolves: ideal in synthesis, propagated in PD/STA."
    ),
  },
  {
    ext: ".upf",
    name: loc("Power intent (IEEE 1801)", "Power intent (IEEE 1801)"),
    phase: loc("FE → LP signoff", "FE → LP signoff"),
    description: loc(
      "Domini, isolation, level shifter, retention, switch. Deve matchare il netlist (CLP) fino al GDS.",
      "Domains, isolation, level shifter, retention, switch. Must match the netlist (CLP) through GDS."
    ),
  },
  {
    ext: ".lib",
    name: loc("Liberty timing/power", "Liberty timing/power"),
    phase: loc("Sintesi → STA", "Synthesis → STA"),
    description: loc(
      "Un file per corner PVT × Vt library. NLDM early, CCS/LVF per signoff. Contiene anche power e noise.",
      "One file per PVT corner × Vt library. NLDM early, CCS/LVF for signoff. Also holds power and noise."
    ),
  },
  {
    ext: ".lef",
    name: loc("LEF tecnologico + celle", "Tech + cell LEF"),
    phase: loc("Floorplan → Route", "Floorplan → Route"),
    description: loc(
      "SITE, TRACKS, MACRO pin/obs, layer pitch. Senza LEF il P&R non piazza né route.",
      "SITE, TRACKS, MACRO pin/obs, layer pitch. Without LEF, P&R cannot place or route."
    ),
  },
  {
    ext: ".v (gate)",
    name: loc("Netlist gate-level", "Gate-level netlist"),
    phase: loc("Sintesi → PD", "Synthesis → PD"),
    description: loc(
      "Istanze di celle + connettività. Deve LEC-matchare l'RTL. Scan già inserted nel flusso DFT.",
      "Cell instances + connectivity. Must LEC-match RTL. Scan already inserted in the DFT flow."
    ),
  },
  {
    ext: ".def",
    name: loc("Design Exchange Format", "Design Exchange Format"),
    phase: loc("Floorplan → Tapeout", "Floorplan → Tapeout"),
    description: loc(
      "Snapshot fisico: die, rows, components (FIXED/PLACED), special nets PG, blockage. Scambio tra tool.",
      "Physical snapshot: die, rows, components (FIXED/PLACED), PG special nets, blockage. Inter-tool exchange."
    ),
  },
  {
    ext: ".spef",
    name: loc("Parasitics RC", "RC parasitics"),
    phase: loc("Post-route STA / IR", "Post-route STA / IR"),
    description: loc(
      "R, Cground, Ccoupling per net. C-only per early STA; coupled RC per signoff e RedHawk/Voltus.",
      "R, Cground, Ccoupling per net. C-only for early STA; coupled RC for signoff and RedHawk/Voltus."
    ),
  },
  {
    ext: ".sdf",
    name: loc("Delay annotation", "Delay annotation"),
    phase: loc("Gate sim", "Gate sim"),
    description: loc(
      "Delay min:typ:max per timing check in simulazione. Non sostituisce PrimeTime/Tempus.",
      "min:typ:max delays for simulation timing checks. Does not replace PrimeTime/Tempus."
    ),
  },
  {
    ext: ".saif / .vcd / .fsdb",
    name: loc("Activity per power/IR", "Activity for power/IR"),
    phase: loc("Power signoff", "Power signoff"),
    description: loc(
      "Toggle per power analysis. VCD/FSDB per dynamic IR (ciclo-ciclo); SAIF per media.",
      "Toggles for power analysis. VCD/FSDB for dynamic IR (cycle-by-cycle); SAIF for averages."
    ),
  },
  {
    ext: ".gds / .oas",
    name: loc("Mask layout", "Mask layout"),
    phase: loc("PV → Foundry", "PV → Foundry"),
    description: loc(
      "Poligoni per layer di mask. Merge: std cells + macros + fill + seal ring + IO. OASIS più compatto.",
      "Polygons per mask layer. Merge: std cells + macros + fill + seal ring + IO. OASIS is more compact."
    ),
  },
];

export interface MetalLayer {
  name: string;
  role: Localized;
  pitch: string;
  color: string;
}

/** Typical 7 nm-class digital stack (indicative — PDK-specific) */
export const metalStack: MetalLayer[] = [
  {
    name: "M0 / LI",
    role: loc("Local interconnect, contact a fin/gate", "Local interconnect, fin/gate contact"),
    pitch: "~24–30 nm",
    color: "#64748b",
  },
  {
    name: "M1",
    role: loc("Std-cell pin access, rail VDD/VSS di row", "Std-cell pin access, row VDD/VSS rails"),
    pitch: "~36–40 nm",
    color: "#94a3b8",
  },
  {
    name: "M2–M3",
    role: loc("Signal locale, preferred H/V alternati", "Local signals, alternating H/V preferred"),
    pitch: "~40–48 nm",
    color: "#22d3ee",
  },
  {
    name: "M4–M5",
    role: loc("Semi-global, bus, scan, parte di clock", "Semi-global, buses, scan, some clock"),
    pitch: "~48–76 nm",
    color: "#67e8f9",
  },
  {
    name: "M6–M7",
    role: loc("Global signals, clock spine, PG strap", "Global signals, clock spine, PG straps"),
    pitch: "~76–160 nm",
    color: "#a78bfa",
  },
  {
    name: "M8–M9",
    role: loc("Power mesh, clock mesh, bassa R", "Power mesh, clock mesh, low R"),
    pitch: "~160–320 nm",
    color: "#ef4444",
  },
  {
    name: "AP / RDL",
    role: loc("Aluminum pad, bump / wire-bond, IR verticale", "Aluminum pad, bump / wire-bond, vertical IR"),
    pitch: "µm-scale",
    color: "#eab308",
  },
];

export interface PvtCorner {
  name: string;
  process: string;
  voltage: Localized;
  temp: string;
  usedFor: Localized;
}

export const pvtCorners: PvtCorner[] = [
  {
    name: "SS",
    process: "Slow-Slow",
    voltage: loc("Vmin (es. 0.72 V)", "Vmin (e.g. 0.72 V)"),
    temp: "125 °C",
    usedFor: loc("Setup, max trans, IR statico pessimistico", "Setup, max trans, pessimistic static IR"),
  },
  {
    name: "TT",
    process: "Typical",
    voltage: loc("Vnom (es. 0.80 V)", "Vnom (e.g. 0.80 V)"),
    temp: "25 °C / 85 °C",
    usedFor: loc("Power media, correlazione silicon", "Average power, silicon correlation"),
  },
  {
    name: "FF",
    process: "Fast-Fast",
    voltage: loc("Vmax (es. 0.88 V)", "Vmax (e.g. 0.88 V)"),
    temp: "−40 °C",
    usedFor: loc("Hold, min pulse, noise, leakage max", "Hold, min pulse, noise, max leakage"),
  },
  {
    name: "FS / SF",
    process: "Skewed",
    voltage: loc("Vnom", "Vnom"),
    temp: "var",
    usedFor: loc("Hold cross-corner, analog, mismatch", "Cross-corner hold, analog, mismatch"),
  },
];

export const pvtNotes: Localized<string[]> = loc(
  [
    "Temperature inversion: a nodi FinFET il SS può essere peggiore a −40 °C su alcuni path — si aggiunge un corner SS-cold.",
    "Mode × corner: functional, scan_shift, scan_capture, sleep, retention. Ogni combo è uno scenario MMMC.",
    "RC corner (Cmax/Cmin, RCmax/RCmin) è indipendente dal transistor corner — si combina (es. SS + Cmax per setup).",
    "Derate OCV/AOCV/POCV si applica sopra il corner, non al posto del corner.",
  ],
  [
    "Temperature inversion: at FinFET nodes SS can be worse at −40 °C on some paths — add an SS-cold corner.",
    "Mode × corner: functional, scan_shift, scan_capture, sleep, retention. Each combo is an MMMC scenario.",
    "RC corner (Cmax/Cmin, RCmax/RCmin) is independent of transistor corner — combine (e.g. SS + Cmax for setup).",
    "OCV/AOCV/POCV derate applies on top of the corner, not instead of it.",
  ]
);
