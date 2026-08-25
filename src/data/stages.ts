export type StageId =
  | "rtl"
  | "synthesis"
  | "floorplan"
  | "placement"
  | "cts"
  | "routing"
  | "verification"
  | "gds2";

export interface Stage {
  id: StageId;
  step: number;
  title: string;
  subtitle: string;
  description: string;
  inputs: string[];
  outputs: string[];
  tools: string[];
  keyConcepts: string[];
  color: string;
  glowColor: string;
}

export const stages: Stage[] = [
  {
    id: "rtl",
    step: 1,
    title: "Design RTL",
    subtitle: "Register Transfer Level",
    description:
      "Il punto di partenza del flusso di physical design. Il design RTL descrive il comportamento del circuito integrato usando linguaggi hardware (Verilog, SystemVerilog, VHDL). A questo livello si definiscono registri, logica combinatoria, macchine a stati finiti e interfacce — senza ancora preoccuparsi della geometria fisica del silicio.",
    inputs: ["Specifiche funzionali", "Architettura di sistema", "Constraint di timing preliminari"],
    outputs: ["Codice RTL verificato", "Testbench", "Specifiche di sintesi"],
    tools: ["SystemVerilog / VHDL", "UVM", "Formal Verification", "Lint (SpyGlass)"],
    keyConcepts: [
      "Modularità gerarchica del design",
      "Clock domains e reset strategy",
      "Sincronizzazione e CDC (Clock Domain Crossing)",
      "Power intent (UPF) preliminare",
    ],
    color: "#22d3ee",
    glowColor: "rgba(34, 211, 238, 0.4)",
  },
  {
    id: "synthesis",
    step: 2,
    title: "Sintesi Logica",
    subtitle: "RTL → Gate-Level Netlist",
    description:
      "La sintesi logica traduce il codice RTL in un netlist a livello di gate, mappando le operazioni logiche sulle celle standard della tecnologia target (standard cells). Il tool di sintesi ottimizza area, timing e potenza rispettando i constraint SDC (Synopsys Design Constraints).",
    inputs: ["RTL verificato", "Technology library (.lib)", "SDC constraints", "UPF (opzionale)"],
    outputs: ["Gate-level netlist (.v)", "SDC aggiornato", "Report timing/area/power"],
    tools: ["Design Compiler", "Genus", "Yosys (open source)"],
    keyConcepts: [
      "Technology mapping su standard cells",
      "Timing optimization (setup/hold)",
      "Area recovery e power optimization",
      "Dont_touch e size_only constraints",
    ],
    color: "#a78bfa",
    glowColor: "rgba(167, 139, 250, 0.4)",
  },
  {
    id: "floorplan",
    step: 3,
    title: "Floorplanning",
    subtitle: "Definizione del layout del die",
    description:
      "Il floorplanning definisce la struttura macroscopica del chip: dimensioni del die, posizione dei macro block (memorie, IP, analog), regioni di power, placement dei pin I/O e creazione del power grid. È la fase che stabilisce l'architettura fisica su cui poggieranno placement e routing.",
    inputs: ["Netlist post-sintesi", "LEF/DEF della tecnologia", "Floorplan constraints", "IO pin list"],
    outputs: ["Floorplan DEF", "Power grid", "Placement regions", "Pin assignment"],
    tools: ["Innovus", "ICC2", "OpenROAD"],
    keyConcepts: [
      "Aspect ratio e core utilization",
      "Macro placement e channel spacing",
      "Power planning (rings, stripes, vias)",
      "Halo e keepout regions",
    ],
    color: "#f472b6",
    glowColor: "rgba(244, 114, 182, 0.4)",
  },
  {
    id: "placement",
    step: 4,
    title: "Placement",
    subtitle: "Posizionamento delle celle standard",
    description:
      "Durante il placement, ogni cella standard del netlist viene posizionata fisicamente sul die in righe (rows) allineate al power grid. L'obiettivo è minimizzare la lunghezza totale del wire (wirelength) e rispettare i timing constraint, bilanciando densità e congestion.",
    inputs: ["Floorplan DEF", "Netlist", "SDC", "Placement constraints"],
    outputs: ["Placed DEF", "Congestion map", "Timing report pre-CTS"],
    tools: ["Innovus Place", "ICC2 Place", "OpenROAD RePlAce"],
    keyConcepts: [
      "Global placement vs detailed placement",
      "Timing-driven placement",
      "Cell density e filler cells",
      "Congestion analysis e spreading",
    ],
    color: "#34d399",
    glowColor: "rgba(52, 211, 153, 0.4)",
  },
  {
    id: "cts",
    step: 5,
    title: "Clock Tree Synthesis",
    subtitle: "Distribuzione del clock",
    description:
      "La CTS costruisce l'albero di distribuzione del clock che alimenta sincronamente tutti i flip-flop del design. Deve minimizzare lo skew (differenza di arrivo del clock tra registri) e il latency, rispettando i constraint di transition e capacitance sui buffer del clock tree.",
    inputs: ["Placed design", "Clock definitions (SDC)", "CTS spec", "Buffer/inverter cells"],
    outputs: ["CTS netlist", "Clock tree report", "Skew/latency metrics"],
    tools: ["Innovus CTS", "ICC2 CTS", "Tempus (analysis)"],
    keyConcepts: [
      "Clock skew e latency balancing",
      "Useful skew optimization",
      "Clock gating integration",
      "Multi-mode multi-corner (MMMC) analysis",
    ],
    color: "#fbbf24",
    glowColor: "rgba(251, 191, 36, 0.4)",
  },
  {
    id: "routing",
    step: 6,
    title: "Routing",
    subtitle: "Interconnessione fisica",
    description:
      "Il routing crea le connessioni fisiche tra le celle usando i layer metallici disponibili (M1, M2, ... Mn). Si divide in global routing (allocazione delle regioni di canale) e detailed routing (tracciamento effettivo dei wire con vias). Deve rispettare design rules (DRC) e minimizzare crosstalk e delay.",
    inputs: ["Post-CTS design", "Routing rules (tech file)", "NDR (non-default rules)", "SDC"],
    outputs: ["Routed DEF", "SPEF (parasitics)", "DRC clean layout", "Timing signoff report"],
    tools: ["Innovus Route", "ICC2 Route", "StarRC (extraction)"],
    keyConcepts: [
      "Global vs detailed routing",
      "Layer assignment e track allocation",
      "Via optimization e antenna fixing",
      "Signal integrity (crosstalk, SI)",
    ],
    color: "#fb923c",
    glowColor: "rgba(251, 146, 60, 0.4)",
  },
  {
    id: "verification",
    step: 7,
    title: "Verifica Fisica",
    subtitle: "Signoff pre-tapeout",
    description:
      "Prima del tapeout, il layout deve superare tutte le verifiche di signoff: DRC (Design Rule Check) verifica il rispetto delle regole geometriche del processo, LVS (Layout vs Schematic) conferma la corrispondenza tra layout e netlist, e il timing/power signoff garantisce che il chip funzionerà al target frequency.",
    inputs: ["Layout finale (DEF/GDS)", "Netlist", "SDC", "Technology rules"],
    outputs: ["DRC clean report", "LVS match report", "Timing signoff", "IR drop analysis"],
    tools: ["Calibre (DRC/LVS)", "Pegasus", "PrimeTime", "RedHawk (power)"],
    keyConcepts: [
      "Foundry design rules (min width, spacing)",
      "Layout vs Schematic equivalence",
      "Static Timing Analysis (STA) signoff",
      "Electromigration e IR drop",
    ],
    color: "#f87171",
    glowColor: "rgba(248, 113, 113, 0.4)",
  },
  {
    id: "gds2",
    step: 8,
    title: "Output GDSII",
    subtitle: "Tapeout finale",
    description:
      "Il formato GDSII (GDS2) è lo standard industriale per rappresentare la geometria del layout integrato. Contiene poligoni organizzati per layer (attivo, poly, contatti, metalli) che definiscono ogni transistor e interconnessione. Questo file viene inviato alla fonderia per la fabbricazione del wafer di silicio.",
    inputs: ["Layout verificato", "Layer map", "Seal ring / scribe line", "Foundry submission kit"],
    outputs: ["GDSII file (.gds)", "OASIS (alternativa)", "Tapeout documentation"],
    tools: ["Calibre xRC", "KLayout", "Foundry merge tools"],
    keyConcepts: [
      "Layer/datatype hierarchy",
      "Hierarchy flattening vs preservation",
      "Chip assembly e top-level integration",
      "Mask data preparation (OPC, RET)",
    ],
    color: "#60a5fa",
    glowColor: "rgba(96, 165, 250, 0.4)",
  },
];
