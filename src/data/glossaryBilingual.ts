import { loc, type Localized } from "@/i18n/context";

export interface BilingualGlossaryTerm {
  term: string;
  fullName?: Localized;
  definition: Localized;
  category: Localized;
}

export const bilingualGlossary: BilingualGlossaryTerm[] = [
  {
    term: "RTL",
    fullName: loc("Register Transfer Level", "Register Transfer Level"),
    definition: loc(
      "Livello di astrazione HDL che descrive il trasferimento dati tra registri e logica combinatoria.",
      "HDL abstraction level describing data transfer between registers and combinational logic."
    ),
    category: loc("Front-End", "Front-End"),
  },
  {
    term: "SDC",
    fullName: loc("Synopsys Design Constraints", "Synopsys Design Constraints"),
    definition: loc(
      "Formato standard per timing constraints: clock, I/O delay, false path, multicycle path.",
      "Standard format for timing constraints: clock, I/O delay, false path, multicycle path."
    ),
    category: loc("Timing", "Timing"),
  },
  {
    term: "UPF",
    fullName: loc("Unified Power Format", "Unified Power Format"),
    definition: loc(
      "Standard IEEE 1801 per power intent: domini, isolation, level shifter, retention.",
      "IEEE 1801 standard for power intent: domains, isolation, level shifter, retention."
    ),
    category: loc("Low Power", "Low Power"),
  },
  {
    term: "GKC",
    fullName: loc("Gate Keeper Check", "Gate Keeper Check"),
    definition: loc(
      "Review strutturata multi-disciplinare che blocca il passaggio alla fase successiva se i criteri non sono soddisfatti.",
      "Structured multi-disciplinary review blocking progression if criteria are not met."
    ),
    category: loc("Milestone", "Milestone"),
  },
  {
    term: "PDN",
    fullName: loc("Power Delivery Network", "Power Delivery Network"),
    definition: loc(
      "Rete di distribuzione VDD/VSS: rings, stripes, mesh, vias. Include primary PG e secondary PG.",
      "VDD/VSS distribution network: rings, stripes, mesh, vias. Includes primary and secondary PG."
    ),
    category: loc("Power", "Power"),
  },
  {
    term: "DRC",
    fullName: loc("Design Rule Check", "Design Rule Check"),
    definition: loc(
      "Verifica geometrica del layout vs regole di manufacturing. Zero violations at tapeout.",
      "Geometric layout verification vs manufacturing rules. Zero violations at tapeout."
    ),
    category: loc("PV", "PV"),
  },
  {
    term: "LVS",
    fullName: loc("Layout Versus Schematic", "Layout Versus Schematic"),
    definition: loc(
      "Verifica che il layout estratto corrisponda al netlist: device count, connectivity, parameters.",
      "Verifies extracted layout matches netlist: device count, connectivity, parameters."
    ),
    category: loc("PV", "PV"),
  },
  {
    term: "STA",
    fullName: loc("Static Timing Analysis", "Static Timing Analysis"),
    definition: loc(
      "Analisi timing statica su tutti i path logici, corner PVT, con parasitics estratti.",
      "Static timing analysis on all logic paths, PVT corners, with extracted parasitics."
    ),
    category: loc("Timing", "Timing"),
  },
  {
    term: "CTS",
    fullName: loc("Clock Tree Synthesis", "Clock Tree Synthesis"),
    definition: loc(
      "Costruzione albero di distribuzione clock con target skew, latency, transition.",
      "Clock distribution tree construction with skew, latency, transition targets."
    ),
    category: loc("PD", "PD"),
  },
  {
    term: "BTO",
    fullName: loc("Base Tape-Out", "Base Tape-Out"),
    definition: loc(
      "Tapeout parziale che congela layer FEOL (active, poly, diffusion) per parallelizzare con BEOL.",
      "Partial tapeout freezing FEOL layers (active, poly, diffusion) to parallelize with BEOL."
    ),
    category: loc("Tapeout", "Tapeout"),
  },
  {
    term: "MTO",
    fullName: loc("Metal Tape-Out", "Metal Tape-Out"),
    definition: loc(
      "Tapeout finale dei layer BEOL (metalli, vias). GDSII completo per fabbricazione.",
      "Final BEOL layer tapeout (metals, vias). Complete GDSII for fabrication."
    ),
    category: loc("Tapeout", "Tapeout"),
  },
  {
    term: "GDSII",
    definition: loc(
      "Formato standard binario per layout data. Contiene poligoni per ogni mask layer.",
      "Standard binary format for layout data. Contains polygons for each mask layer."
    ),
    category: loc("Tapeout", "Tapeout"),
  },
  {
    term: "IR Drop",
    definition: loc(
      "Caduta di tensione sulla PDN: V_drop = I × R. Static (DC) e dynamic (transient).",
      "Voltage drop on PDN: V_drop = I × R. Static (DC) and dynamic (transient)."
    ),
    category: loc("Power", "Power"),
  },
  {
    term: "EM",
    fullName: loc("Electromigration", "Electromigration"),
    definition: loc(
      "Degradazione metal interconnect per flusso elettroni. Black's Equation per MTTF.",
      "Metal interconnect degradation from electron flow. Black's Equation for MTTF."
    ),
    category: loc("Power", "Power"),
  },
  {
    term: "PRO Exit",
    fullName: loc("Placement/Post-Route Optimization Exit", "Placement/Post-Route Optimization Exit"),
    definition: loc(
      "Gate interno che certifica placement o post-route optimization completata con timing e congestion accettabili.",
      "Internal gate certifying placement or post-route optimization with acceptable timing and congestion."
    ),
    category: loc("Milestone", "Milestone"),
  },
];

export const bilingualSignoffChecklist = [
  {
    category: loc("Front-End Signoff", "Front-End Signoff"),
    items: loc(
      ["Lint clean (waivers documentati)", "CDC/RDC clean", "Formal verification su proprietà critiche", "Functional coverage chiusa", "RTL ↔ synthesis LEC pass", "UPF/CLP verification pass"],
      ["Lint clean (documented waivers)", "CDC/RDC clean", "Formal verification on critical properties", "Functional coverage closed", "RTL ↔ synthesis LEC pass", "UPF/CLP verification pass"]
    ),
  },
  {
    category: loc("Floorplan Exit", "Floorplan Exit"),
    items: loc(
      ["Macro FIXED, no overlap, FEOL DRC clean", "IO pins placed su preferred track", "Primary PG skeleton (rings + straps/mesh)", "Secondary PG regions per voltage islands", "Power switch columns riservate", "check_legality clean"],
      ["Macros FIXED, no overlap, FEOL DRC clean", "IO pins placed on preferred track", "Primary PG skeleton (rings + straps/mesh)", "Secondary PG regions per voltage islands", "Power switch columns reserved", "check_legality clean"]
    ),
  },
  {
    category: loc("STA Signoff", "STA Signoff"),
    items: loc(
      ["Setup WNS ≥ 0, TNS = 0 (all setup corners)", "Hold WNS ≥ 0, TNS = 0 (all hold corners)", "SI/crosstalk clean", "Post-PEX SPEF timing", "CPPR/AOCV applicato"],
      ["Setup WNS ≥ 0, TNS = 0 (all setup corners)", "Hold WNS ≥ 0, TNS = 0 (all hold corners)", "SI/crosstalk clean", "Post-PEX SPEF timing", "CPPR/AOCV applied"]
    ),
  },
  {
    category: loc("Physical Verification (PV)", "Physical Verification (PV)"),
    items: loc(
      ["DRC: ZERO violations (foundry runset)", "LVS: CORRECT status", "ERC: no floating gates/shorts", "Antenna: all ratios < limit", "Metal density: min/max compliant"],
      ["DRC: ZERO violations (foundry runset)", "LVS: CORRECT status", "ERC: no floating gates/shorts", "Antenna: all ratios < limit", "Metal density: min/max compliant"]
    ),
  },
  {
    category: loc("Power Signoff", "Power Signoff"),
    items: loc(
      ["Static IR drop < 5% VDD", "Dynamic IR: VCD-based WORST_POWER + WORST_DPDT", "Dynamic droop < 10% VDD, duration < 500ps", "Power EM: avg current within J_max", "Signal EM: RMS + peak within limits"],
      ["Static IR drop < 5% VDD", "Dynamic IR: VCD-based WORST_POWER + WORST_DPDT", "Dynamic droop < 10% VDD, duration < 500ps", "Power EM: avg current within J_max", "Signal EM: RMS + peak within limits"]
    ),
  },
  {
    category: loc("Tapeout (BTO/MTO/GKC)", "Tapeout (BTO/MTO/GKC)"),
    items: loc(
      ["PDK version locked & documented", "BTO: Base DRC clean (FEOL)", "MTO: Metal DRC clean (BEOL)", "GDS merged (design + fill + seal ring)", "GKC firmato da tutte le discipline", "TOR meeting: unanimous go"],
      ["PDK version locked & documented", "BTO: Base DRC clean (FEOL)", "MTO: Metal DRC clean (BEOL)", "GDS merged (design + fill + seal ring)", "GKC signed by all disciplines", "TOR meeting: unanimous go"]
    ),
  },
];
