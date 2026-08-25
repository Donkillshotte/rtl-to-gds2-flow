export interface GlossaryTerm {
  term: string;
  fullName?: string;
  definition: string;
  category: string;
}

export const glossary: GlossaryTerm[] = [
  { term: "RTL", fullName: "Register Transfer Level", definition: "Livello di astrazione HDL che descrive il trasferimento dati tra registri e logica combinatoria.", category: "Front-End" },
  { term: "SDC", fullName: "Synopsys Design Constraints", definition: "Formato standard per timing constraints: clock, I/O delay, false path, multicycle path.", category: "Timing" },
  { term: "UPF", fullName: "Unified Power Format", definition: "Standard IEEE 1801 per descrivere power intent: domini, isolation, level shifter, retention.", category: "Low Power" },
  { term: "LEC", fullName: "Logic Equivalence Check", definition: "Verifica formale che due rappresentazioni (RTL vs netlist) siano logicamente equivalenti.", category: "Verification" },
  { term: "CDC", fullName: "Clock Domain Crossing", definition: "Analisi dei segnali che attraversano clock domain asincroni. Richiede synchronizer.", category: "Verification" },
  { term: "RDC", fullName: "Reset Domain Crossing", definition: "Verifica sicurezza dei crossing tra reset domain diversi durante power-up/reset.", category: "Verification" },
  { term: "GKC", fullName: "Gate Keeper Check", definition: "Review strutturata multi-disciplinare che blocca il passaggio alla fase successiva se i criteri non sono soddisfatti.", category: "Milestone" },
  { term: "Floorplan Exit", definition: "Milestone che certifica il floorplan pronto per placement: macro fixed, pin placed, PG connected, legality clean.", category: "Milestone" },
  { term: "PRO Exit", fullName: "Placement/Post-Route Optimization Exit", definition: "Gate interno che certifica placement o post-route optimization completata con timing e congestion accettabili.", category: "Milestone" },
  { term: "BTO", fullName: "Base Tape-Out", definition: "Tapeout parziale che congela layer FEOL (active, poly, diffusion) per parallelizzare con BEOL design.", category: "Tapeout" },
  { term: "MTO", fullName: "Metal Tape-Out", definition: "Tapeout finale dei layer BEOL (metalli, vias). GDSII completo per fabbricazione.", category: "Tapeout" },
  { term: "TOR", fullName: "Tapeout Review", definition: "Meeting finale multi-disciplinare con go/no-go decision prima del rilascio GDSII al foundry.", category: "Tapeout" },
  { term: "PDN", fullName: "Power Delivery Network", definition: "Rete di distribuzione VDD/VSS: rings, stripes, rails, vias. Critica per IR drop e EM.", category: "Power" },
  { term: "PDK", fullName: "Process Design Kit", definition: "Kit fornito dal foundry: DRM, LEF, LIB, tech file, DRC/LVS decks, EM rules.", category: "Foundry" },
  { term: "DRC", fullName: "Design Rule Check", definition: "Verifica geometrica del layout vs regole di manufacturing del processo. Zero violations at tapeout.", category: "PV" },
  { term: "LVS", fullName: "Layout Versus Schematic", definition: "Verifica che il layout estratto corrisponda al netlist: device count, connectivity, parameters.", category: "PV" },
  { term: "ERC", fullName: "Electrical Rule Check", definition: "Verifica regole elettriche: floating gates, power shorts, weak connections.", category: "PV" },
  { term: "PV", fullName: "Physical Verification", definition: "Insieme di check geometrici/elettrici: DRC, LVS, ERC, antenna, density.", category: "PV" },
  { term: "STA", fullName: "Static Timing Analysis", definition: "Analisi timing statica su tutti i path logici, corner PVT, con parasitics estratti.", category: "Timing" },
  { term: "MMMC", fullName: "Multi-Mode Multi-Corner", definition: "Analisi timing su tutte le combinazioni mode operativi × corner PVT.", category: "Timing" },
  { term: "SPEF", fullName: "Standard Parasitic Exchange Format", definition: "Formato per parasitic RC estratti dal layout, usato in STA signoff.", category: "Timing" },
  { term: "OCV", fullName: "On-Chip Variation", definition: "Derating timing per process variation on-chip. Estensioni: AOCV, POCV.", category: "Timing" },
  { term: "CTS", fullName: "Clock Tree Synthesis", definition: "Costruzione albero di distribuzione clock con target skew, latency, transition.", category: "PD" },
  { term: "ECO", fullName: "Engineering Change Order", definition: "Modifica localizzata post-route: metal-only ECO (veloce) o functional ECO (con re-synthesis).", category: "PD" },
  { term: "NDR", fullName: "Non-Default Rules", definition: "Regole di routing speciali per net critici: wider wire, double spacing, shielding.", category: "Routing" },
  { term: "RDL", fullName: "Redistribution Layer", definition: "Layer metallico per redistribuire segnali da IO pad a bump in flip-chip designs.", category: "Package" },
  { term: "PKG", definition: "Package — contenitore che collega il die al PCB: BGA, CSP, QFN, 2.5D/3D.", category: "Package" },
  { term: "GDSII", definition: "Formato standard binario per layout data. Contiene poligoni per ogni mask layer.", category: "Tapeout" },
  { term: "IR Drop", definition: "Caduta di tensione sulla PDN: V_drop = I × R. Static (DC) e dynamic (transient).", category: "Power" },
  { term: "EM", fullName: "Electromigration", definition: "Degradazione metal interconnect per flusso elettroni. Black's Equation per MTTF.", category: "Power" },
  { term: "CMP", fullName: "Chemical Mechanical Polishing", definition: "Processo fab che richiede metal density uniforme. Fill inserito per compliance.", category: "Layout" },
  { term: "MPW", fullName: "Multi-Project Wafer", definition: "Tapeout condiviso: più design sullo stesso wafer. Costo ridotto per prototipi.", category: "Tapeout" },
  { term: "DFT", fullName: "Design For Test", definition: "Scan chains, compression, MBIST, BIST — strutture per test in produzione.", category: "Test" },
  { term: "FEOL", fullName: "Front End Of Line", definition: "Layer di fabbricazione transistor: active, poly, diffusion, well, contact.", category: "Process" },
  { term: "BEOL", fullName: "Back End Of Line", definition: "Layer di interconnessione: metalli (M1-Mn), vias, passivation.", category: "Process" },
];

export const signoffChecklist = [
  { category: "Front-End Signoff", items: ["Lint clean (waivers documentati)", "CDC/RDC clean", "Formal verification su proprietà critiche", "Functional coverage chiusa", "RTL ↔ synthesis LEC pass", "UPF/CLP verification pass"] },
  { category: "Floorplan Exit", items: ["Macro FIXED, no overlap, FEOL DRC clean", "IO pins placed su preferred track", "Power grid skeleton, PG ai macro", "check_legality clean", "Pre-placement timing con margine", "Congestion map reviewata"] },
  { category: "Placement PRO Exit", items: ["Legal placement, density uniforme", "Pre-CTS timing WNS ≥ -0.1ns", "Congestion < 5% overflow", "Scan chains integre", "Power connections complete"] },
  { category: "CTS Exit", items: ["Target skew met per clock domain", "Max transition rispettato", "Hold WNS ≥ 0 (o fixable)", "Clock buffer count nel budget"] },
  { category: "Routing PRO Exit", items: ["100% nets routed, zero opens", "Zero congestion overflow", "Post-route setup/hold WNS ≥ 0", "Antenna ratios clean", "Internal DRC clean"] },
  { category: "STA Signoff", items: ["Setup WNS ≥ 0, TNS = 0 (all setup corners)", "Hold WNS ≥ 0, TNS = 0 (all hold corners)", "SI/crosstalk clean", "Post-PEX SPEF timing", "CPPR/AOCV applicato"] },
  { category: "Physical Verification (PV)", items: ["DRC: ZERO violations (foundry runset)", "LVS: CORRECT status", "ERC: no floating gates/shorts", "Antenna: all ratios < limit", "Metal density: min/max compliant", "Seal ring DRC continuous"] },
  { category: "Power Signoff", items: ["Static IR drop < 5% VDD", "Dynamic IR droop < 10% VDD", "EM: all wires/vias within J_max", "10-year MTTF @ Tmax"] },
  { category: "Tapeout (BTO/MTO/GKC)", items: ["PDK version locked & documented", "BTO: Base DRC clean (FEOL)", "MTO: Metal DRC clean (BEOL)", "GDS merged (design + fill + seal ring)", "GKC firmato da tutte le discipline", "TOR meeting: unanimous go", "Data package delivered to foundry"] },
];
