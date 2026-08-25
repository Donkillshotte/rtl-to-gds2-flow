export interface SubSection {
  title: string;
  content: string;
  bullets?: string[];
}

export interface ExitCriterion {
  name: string;
  description: string;
}

export interface CheckGroup {
  category: string;
  items: string[];
}

export type StageId =
  | "rtl"
  | "verification"
  | "synthesis"
  | "floorplan"
  | "pdn"
  | "placement"
  | "cts"
  | "routing"
  | "layout"
  | "sta"
  | "pv"
  | "power"
  | "package"
  | "tapeout";

export interface Stage {
  id: StageId;
  step: number;
  title: string;
  subtitle: string;
  description: string;
  deepDive: string[];
  inputs: string[];
  outputs: string[];
  tools: string[];
  keyConcepts: string[];
  subsections: SubSection[];
  exitCriteria?: ExitCriterion[];
  checks?: CheckGroup[];
  practicalNotes?: string[];
  color: string;
  glowColor: string;
}

export const stages: Stage[] = [
  {
    id: "rtl",
    step: 1,
    title: "Design RTL",
    subtitle: "Register Transfer Level — Front-End",
    description:
      "Il design RTL descrive il comportamento del circuito a livello di registri e logica combinatoria, tipicamente in SystemVerilog o VHDL. È l'astrazione più alta prima della sintesi: definisce architettura, datapath, control logic, interfacce e power intent preliminare. Un RTL di qualità industriale riduce drasticamente i cicli di debug downstream in sintesi, PD e silicon.",
    deepDive: [
      "In un flusso ASIC industriale, il RTL non è solo 'codice che simula': deve essere sintetizzabile, lint-clean, CDC-safe e allineato alle specifiche di potenza (UPF/CPF). Ogni modulo dovrebbe avere interfacce chiare, clock domain ben definiti, reset strategy documentata e constraint SDC preliminari.",
      "Le decisioni architetturali prese a RTL — pipeline depth, width dei bus, numero di clock domain, strategia di clock gating — impattano direttamente area, timing closure e consumo nel physical design. Un datapath troppo profondo crea critical path lunghi; troppi clock domain aumentano la complessità CDC e CTS.",
      "Prima di passare alla sintesi, il team FE deve garantire: netlist uniqueness, assenza di multi-driven nets, scan chain completa, assenza di connessioni dirette pad→standard cell, e SDC pulito (clocks, uncertainty, false/multicycle path giustificati).",
    ],
    inputs: [
      "Micro-architecture spec & MAS (Micro-Architecture Spec)",
      "IP catalog (memories, PLL, ADC/DAC, bus fabric)",
      "Target PPA budget (freq, area, power)",
      "Clock/reset specification",
      "UPF/CPF preliminare per design multi-voltage",
    ],
    outputs: [
      "RTL verificato funzionalmente",
      "Testbench UVM + coverage report",
      "SDC preliminare",
      "UPF/CPF per low-power",
      "Documentazione CDC/RDC",
    ],
    tools: [
      "SystemVerilog / VHDL",
      "Questa / VCS / Xcelium",
      "UVM",
      "Verdi",
      "SpyGlass (lint preliminare)",
    ],
    keyConcepts: [
      "Modularità gerarchica e design partitioning",
      "Clock domain & reset domain strategy",
      "Synthesizability (no latch inferiti, no loop combinatori)",
      "Power intent: isolation, level shifter, retention",
      "DFT readiness (scan, compression, BIST hooks)",
    ],
    subsections: [
      {
        title: "Architettura e Partitioning",
        content:
          "Il chip viene suddiviso in blocchi logici (CPU core, cache, interconnect, peripherals) con confini chiari. Ogni blocco avrà un owner PD separato in design gerarchici. Il partitioning influenza il floorplan: blocchi ad alto traffico devono essere adiacenti fisicamente.",
        bullets: [
          "Definire top-level e sub-block hierarchy",
          "Identificare interfacce critiche (AXI, AHB, custom)",
          "Pianificare clock domains per blocchi",
          "Riservare area budget per macro IP",
        ],
      },
      {
        title: "Coding Guidelines Industriali",
        content:
          "Standard di codifica (Synopsys, ARM, internal) garantiscono codice sintetizzabile e verificabile. Errori comuni: latch inferiti da assegnazioni incomplete in always_comb, non-blocking vs blocking misuse, reset asincrono non sincronizzato.",
        bullets: [
          "Un solo clock per always_ff (salvo eccezioni documentate)",
          "Reset sincronizzato preferito (async assert, sync deassert)",
          "Parametri per width configurabili",
          "No delay (#) nel codice sintetizzabile",
        ],
      },
    ],
    color: "#22d3ee",
    glowColor: "rgba(34, 211, 238, 0.4)",
  },
  {
    id: "verification",
    step: 2,
    title: "Verifica RTL & Formal",
    subtitle: "Simulation, Formal Verification, Lint, CDC, RDC",
    description:
      "La verifica RTL è il gatekeeper qualitativo prima della sintesi. Comprende simulazione dinamica (UVM), formal verification per proprietà critiche, lint statico, analisi CDC (Clock Domain Crossing) e RDC (Reset Domain Crossing). L'RTL signoff non è il silicon signoff, ma produce evidenze che il design è strutturalmente corretto e pronto per l'implementazione.",
    deepDive: [
      "Formal Verification usa tecniche matematiche (model checking, equivalence checking) per provare o confutare proprietà su TUTTI gli input legali, non solo sui pattern di stimolo simulati. È essenziale per protocolli (AXI, PCIe), arbitri, FSM critici e proprietà di sicurezza.",
      "Lint (SpyGlass, VC SpyGlass, Verible) analizza staticamente il codice HDL senza simulazione. Trova: latch inferiti, segnali non connessi, mismatch simulazione-sintesi, problemi FSM (stati irraggiungibili), clock/reset mal usati.",
      "CDC verification identifica segnali che attraversano clock domain asincroni senza sincronizzazione adeguata. Metastabilità, glitch e perdita di coerenza dati sono cause comuni di failure in silicon. Tecniche: 2-FF synchronizer, handshake, FIFO async, MUX sync.",
      "RDC (Reset Domain Crossing) verifica che reset asincroni e sequenze power-up siano sicuri. Un flop può uscire da reset prima di un altro, causando stati inconsistenti invisibili in simulazione RTL.",
    ],
    inputs: ["RTL", "Test plan & verification plan", "Assertion (SVA) library", "SDC con clock definitions", "UPF per LP verification"],
    outputs: [
      "Lint clean report (con waivers documentati)",
      "CDC/RDC clean report",
      "Formal proofs / bounded proofs",
      "Functional coverage closure report",
      "RTL signoff checklist completata",
    ],
    tools: [
      "VC SpyGlass / Questa Lint",
      "JasperGold / VC Formal",
      "Questa CDC / SpyGlass CDC",
      "VCS / Xcelium + UVM",
      "Conformal Low Power (CLP)",
    ],
    keyConcepts: [
      "RTL Signoff vs Functional Signoff vs Silicon Signoff",
      "Assertion-Based Verification (SVA)",
      "Coverage-driven verification (code + functional)",
      "Reconvergence CDC (multi-bit async)",
      "X-propagation e reset sequencing",
    ],
    subsections: [
      {
        title: "Formal Verification",
        content:
          "Il formal prove properties like: 'grant is one-hot', 'FIFO never overflows', 'AXI valid/ready handshake respected'. Bounded proofs coprono N cicli; unbounded proofs coprono tutti i cicli (decidibilità dipende dalla complessità).",
        bullets: [
          "Assumption/constraint sul environment",
          "Cover properties per reachability",
          "Formal apps: connectivity, X-prop, FSM",
          "Abstraction per ridurre state space",
        ],
      },
      {
        title: "Lint — Structural Signoff",
        content:
          "Lint è il primo filtro di qualità. In produzione si usano goal specifici: lint_rtl, lint_turbo, adv_lint. Ogni violation va classificata: bug reale, false positive, o waiver con giustificazione e approvazione.",
        bullets: [
          "W415a: latch inferito",
          "Clock con reset mancante su flop",
          "Multi-driven net / undriven port",
          "Simulation-synthesis mismatch (casex, initial)",
        ],
      },
      {
        title: "CDC & RDC Analysis",
        content:
          "Per ogni crossing async: verificare synchronizer type, MTBF (Mean Time Between Failures) per metastabilità, data stability window per multi-bit. RDC: verificare reset ordering tra domini.",
        bullets: [
          "2-FF sync per single-bit control",
          "Async FIFO per multi-bit data (gray code pointer)",
          "Quasi-static signals: handshake obbligatorio",
          "Reset sync: async assert, sync deassert",
        ],
      },
      {
        title: "Gate Keeper Check (GKC) — Front-End",
        content:
          "Il GKC (Gate Keeper Check) è la review strutturata prima di rilasciare il RTL alla sintesi. Non è un tool singolo ma un checkpoint di team: lint/CDC/formal/coverage devono essere verdi o waiver approvati. Analogamente esiste GKC pre-tapeout lato PD.",
        bullets: [
          "Checklist RTL signoff firmata",
          "Waivers review con architetto",
          "SDC review con timing owner",
          "UPF review con LP team",
        ],
      },
    ],
    checks: [
      {
        category: "RTL Quality Gates",
        items: [
          "Lint: zero errori non waivati",
          "CDC: zero crossing non sincronizzati",
          "RDC: reset sequencing verificato",
          "Coverage: code + functional target raggiunto",
          "Formal: proprietà critiche proven o bounded",
          "No inferred latches in synthesizable code",
        ],
      },
    ],
    color: "#818cf8",
    glowColor: "rgba(129, 140, 248, 0.4)",
  },
  {
    id: "synthesis",
    step: 3,
    title: "Sintesi Logica",
    subtitle: "RTL → Gate-Level Netlist + LEC",
    description:
      "La sintesi logica traduce RTL in netlist gate-level mappato su standard cells della tecnologia target. Ottimizza timing (setup/hold), area e potenza rispettando SDC. Include Logic Equivalence Check (LEC) tra RTL e netlist per garantire equivalenza funzionale. È il ponte tra front-end e back-end.",
    deepDive: [
      "Design Compiler (Synopsys) e Genus (Cadence) sono i tool industriali dominanti. La sintesi opera in fasi: elaboration → mapping → optimization (timing/area/power). Il risultato è un netlist Verilog con istanze di celle dalla .lib del PDK.",
      "Gli SDC constraints guidano tutto: create_clock, set_input_delay, set_output_delay, set_false_path, set_multicycle_path, set_max_transition/capacitance/fanout. Constraint errati qui si propagano fino al tapeout.",
      "LEC (Formality, Conformal) verifica che il netlist sintetizzato sia logicamente equivalente al RTL. Qualsiasi mismatch indica un bug di sintesi o un RTL non sintetizzabile che è passato i check.",
      "Per design low-power: UPF viene applicato durante la sintesi. Isolation cells, level shifters e retention registers vengono inseriti. Conformal Low Power verifica la correttezza dell'implementazione LP.",
    ],
    inputs: [
      "RTL signoff + testbench",
      "Technology library (.lib) per tutti i corner PVT",
      "LEF abstract delle standard cells",
      "SDC completo (MMMC views)",
      "UPF/CPF per multi-voltage",
      "dont_use / dont_touch lists",
    ],
    outputs: [
      "Gate-level netlist (.v / .ddc)",
      "SDC post-sintesi",
      "Netlist con scan chains (post-DFT)",
      "Report timing/area/power",
      "LEC clean report (RTL ↔ netlist)",
    ],
    tools: [
      "Design Compiler / Fusion Compiler",
      "Genus",
      "Formality / Conformal LEC",
      "Conformal Low Power",
      "PrimeTime (pre-layout STA)",
    ],
    keyConcepts: [
      "Technology mapping & cell selection",
      "Timing optimization: WNS, TNS, hold fixing",
      "Area recovery & power optimization (clock gating)",
      "Multi-Mode Multi-Corner (MMMC)",
      "Scan insertion & DFT constraints",
    ],
    subsections: [
      {
        title: "Flow di Sintesi Dettagliato",
        content:
          "read_verilog → link → read_sdc → compile_ultra (DC) → write netlist. compile_ultra esegue: high-level optimization, mapping, incremental optimization. Per design grandi: top-down o bottom-up con budget di timing tra blocchi.",
        bullets: [
          "Elaboration: risoluzione parametri, generate blocks",
          "Link: connessione con technology library",
          "compile_ultra -gate_clock per clock gating",
          "Incremental compile per ECO",
        ],
      },
      {
        title: "Logic Equivalence Check (LEC)",
        content:
          "Formality confronta RTL (golden) vs netlist (revised). Match = equivalente. Fail = debug con compare point. LEC va ripetuto dopo ogni ECO significativa e prima del handoff al PD.",
        bullets: [
          "RTL vs post-synthesis netlist",
          "Post-synthesis vs post-DFT netlist",
          "Post-route vs post-ECO netlist",
          "PAFV checks durante BTO/MTO",
        ],
      },
      {
        title: "Physical Synthesis (Advanced Nodes)",
        content:
          "Per nodi ≤7nm, Fusion Compiler e Innovus integrano sintesi fisica: placement preliminare durante la sintesi per ridurre disconnect tra logica e fisica. Il netlist post-phys-synth è più realistico per il timing.",
      },
    ],
    exitCriteria: [
      { name: "Timing pre-layout", description: "WNS ≥ 0 e TNS = 0 su corner target (con ideal clock)" },
      { name: "LEC clean", description: "Equivalenza RTL ↔ netlist verificata con Formality/Conformal" },
      { name: "Area budget", description: "Area entro ±5% del budget allocato" },
      { name: "Power estimate", description: "Leakage + dynamic power entro budget" },
      { name: "Scan ready", description: "Scan chains inserite, DFT constraints rispettati" },
    ],
    color: "#a78bfa",
    glowColor: "rgba(167, 139, 250, 0.4)",
  },
  {
    id: "floorplan",
    step: 4,
    title: "Floorplanning",
    subtitle: "Die layout, macro, IO, power planning iniziale",
    description:
      "Il floorplanning definisce la struttura fisica del chip: dimensioni die/core, posizione macro (memories, analog IP, PLL), IO pin placement, regioni di power domain e canali di routing. È la fase più critica per prevenire problemi downstream — la maggior parte dei problemi di timing, congestion e routing nasce qui.",
    deepDive: [
      "Un buon floorplan riduce settimane di timing closure. Un cattivo floorplan causa congestion irrecuperabile, routing detours, IR drop e failure di timing non fixabili con ECO. Regola d'oro: il 70% del successo PD si decide al floorplan.",
      "Metriche chiave: core utilization (60-80%), aspect ratio (~1:1 preferito), core-to-die ratio, halo/channel spacing tra macro, row utilization. Per wire-bond: macro power-hungry lontano dal centro del die.",
      "Il pin placement (block IO) influenza direttamente il routing tra blocchi. Pin su layer preferiti (H-V-H alternati), posizionati per minimizzare wirelength e rispettare timing budget tra blocchi.",
    ],
    inputs: [
      "Netlist post-sintesi (.v / .ddc)",
      "Technology LEF + macro LEF/DEF",
      "SDC + UPF",
      "IO pin list / bump map preliminare",
      "Integration guidelines da full-chip",
    ],
    outputs: [
      "Floorplan DEF con macro FIXED",
      "Power rings preliminari",
      "Pin placement DEF",
      "Placement blockages & regions",
      "Floorplan review report",
    ],
    tools: ["Innovus", "ICC2 / Fusion Compiler", "OpenROAD", "Calibre (FEOL DRC preliminare)"],
    keyConcepts: [
      "Core vs die area definition",
      "Macro placement & halo/keepout",
      "IO planning (wirebond vs flip-chip)",
      "Channel planning per routing",
      "Floorplan utilization & aspect ratio",
    ],
    subsections: [
      {
        title: "Sanity Check Pre-Floorplan",
        content:
          "Prima di iniziare il floorplan, verificare: netlist uniqueness, no undriven/multi-driven nets, SDC pulito, no clock buffer/inverter nel netlist, scan stitched, no connessioni dirette pad→cell.",
        bullets: [
          "check_design -netlist",
          "Verifica SDC: tutti i clock definiti",
          "UPF/CPF consistency check",
          "Macro LEF/DEF disponibili e versionati",
        ],
      },
      {
        title: "Macro Placement Guidelines",
        content:
          "Macro grandi ai bordi del core, mai negli angoli (routing killer). Orientamento con pin accessibili. Spacing sufficiente per buffer insertion. Blocchi sensibili (analog, RF) lontani da digital ad alta frequenza.",
        bullets: [
          "Halo: 2-5μm per lato (dipende dal node)",
          "Channel spacing: ≥ N routing tracks",
          "FIXED status su macro dopo placement",
          "Decap cells attorno ai macro ad alta attività",
        ],
      },
      {
        title: "Floorplan Exit — Criteri di Uscita",
        content:
          "Il Floorplan Exit è il milestone formale che sblocca il placement. Tutti i check devono passare prima di procedere. Saltare questo gate causa iterazioni costose nelle fasi successive.",
      },
    ],
    exitCriteria: [
      { name: "Macro placement legal", description: "Tutti i macro FIXED, no overlap, dentro core area, FEOL DRC clean" },
      { name: "IO/Pin placement", description: "Tutti i pin piazzati su preferred layer/track, no pin a origine (0,0)" },
      { name: "Power grid skeleton", description: "Power rings e stripes preliminari, PG connectivity ai macro verificata" },
      { name: "check_legality clean", description: "Nessuna violation di legalità (ICC2: check_legality, Innovus: verifyGeometry)" },
      { name: "Pre-placement timing", description: "IO timing, macro-to-macro timing con margine accettabile" },
      { name: "Congestion estimate", description: "Congestion map preliminare reviewata, no red zones critiche" },
      { name: "LP/MV checks", description: "Power domain boundaries, isolation regions, level shifter placement" },
      { name: "Utilization target", description: "Core utilization 65-75%, aspect ratio accettabile" },
    ],
    checks: [
      {
        category: "Floorplan Sanity (Synopsys ICC2)",
        items: [
          "check_floorplan — consistency check",
          "check_legality — no overlap, within boundary",
          "check_pin_placement — pin su track corretti",
          "verify_pg_connection — power ai macro",
          "report_congestion — stima pre-placement",
        ],
      },
    ],
    practicalNotes: [
      "Congestion al floorplan spesso deriva da: alta placement density, celle ad alta pin density (AOI/OAI), macro mal posizionati, power straps che consumano track.",
      "Per design networking (switch/router): data path tra macro SRAM e logic deve essere corto e diretto.",
      "Documentare ogni decisione di macro placement con rationale di connectivity.",
    ],
    color: "#f472b6",
    glowColor: "rgba(244, 114, 182, 0.4)",
  },
  {
    id: "pdn",
    step: 5,
    title: "PDN — Power Delivery Network",
    subtitle: "Power grid, IR drop prevention, EM budget",
    description:
      "La PDN (Power Delivery Network) distribuisce VDD e VSS a ogni cella del chip attraverso anelli (rings), strisce (stripes), rail e vias. Una PDN mal progettata causa IR drop (degradazione timing), electromigration e failure in silicon. Si progetta in conjunction con floorplan e viene raffinata fino al signoff.",
    deepDive: [
      "La PDN è una rete resistiva/induttiva: V_drop = I × R. Correnti di switching di centinaia di mA attraverso resistenze di mΩ producono drop di decine-hundreds mV — sufficienti a far fallire setup timing.",
      "Static IR drop: corrente media × resistenza del path. Dynamic IR drop: L × dI/dt da simultaneous switching di milioni di FF al clock edge. I decoupling capacitors (decap) limitano il droop dinamico.",
      "Power planning include: core rings (VDD/VSS attorno al core), stripes (strisce orizzontali/verticali), follow-pin connections, vias tra layer, e power switches per power gating domains.",
    ],
    inputs: ["Floorplan DEF", "Power budget per domain", "Metal stack del PDK", "Switch cell LEF per power gating", "Activity factors (toggle rates)"],
    outputs: ["Power grid completa", "PG netlist", "IR drop report preliminare", "EM budget analysis", "Decap placement"],
    tools: ["Innovus (add_rings, add_stripes)", "ICC2 (create_power_straps)", "RedHawk / Voltus", "Static IR analysis"],
    keyConcepts: [
      "Power rings, stripes, mesh",
      "IR drop: static vs dynamic",
      "Decap cells & filler decap",
      "Power gating & power switches",
      "Multi-voltage domain PG",
    ],
    subsections: [
      {
        title: "Architettura PDN",
        content:
          "Struttura tipica: pad/frame → core ring → vertical stripes → horizontal rails → cell pins. Layer più spessi (M6-M9) per power, layer sottili (M1-M3) per signal. Via arrays ai junction points.",
        bullets: [
          "Ring width: tipicamente 5-20μm (dipende da corrente)",
          "Stripe pitch: bilanciare IR vs routing resource",
          "Via stitching ogni N μm per ridurre R",
          "Separate ring per ogni voltage domain",
        ],
      },
      {
        title: "IR Drop Budget",
        content:
          "Limiti industriali: static IR < 5% VDD, dynamic IR < 10% VDD. Per VDD=0.8V: max 40mV static, 80mV dynamic. Violation → aggiungere stripes, widen rings, più vias, decap cells.",
      },
      {
        title: "Electromigration (EM) — Preview",
        content:
          "Black's Equation: MTTF = A × J^(-n) × exp(Ea/kT). Corrente eccessiva in wire sottili → void/hillock → open circuit. EM peggiora esponenzialmente con temperatura. Signoff EM a 125°C per consumer, 150°C+ per automotive.",
      },
    ],
    color: "#e879f9",
    glowColor: "rgba(232, 121, 249, 0.4)",
  },
  {
    id: "placement",
    step: 6,
    title: "Placement",
    subtitle: "Global, legalization, optimization — verso il PRO Exit",
    description:
      "Il placement posiziona ogni standard cell del netlist su siti legali nelle row, ottimizzando wirelength, timing e congestion. Include global placement (approssimato), legalization (snap to grid) e optimization (sizing, buffering). Il PRO Exit (Placement Route Optimization exit) segna la readiness per CTS.",
    deepDive: [
      "Global placement divide il core in bin e posiziona celle con density target (~80% per bin). Non è legalizzato — le posizioni sono approssimative. HPWL (Half Perimeter Wire Length) è la metrica di costo.",
      "Detailed placement legalizza: snap to row sites, fix orientation, resolve overlaps. Poi optimization: cell sizing, buffer insertion, timing-driven moves.",
      "Comando tipico Synopsys: place_opt (placement + optimization). Cadence Innovus: placeDesign + optDesign -preCTS.",
      "PRO Exit: milestone interno che certifica placement timing-clean (pre-CTS), congestion accettabile, density uniforme, e design pronto per clock tree synthesis.",
    ],
    inputs: ["Floorplan DEF (post floorplan exit)", "Netlist + SDC", "Placement constraints", "Dont touch lists"],
    outputs: ["Placed DEF", "Congestion map", "Pre-CTS timing report", "Placement density report"],
    tools: ["Innovus placeDesign", "ICC2 place_opt", "OpenROAD RePlAce", "Tempus (pre-CTS analysis)"],
    keyConcepts: [
      "Global vs detailed placement",
      "Timing-driven placement",
      "Congestion-driven spreading",
      "PRO Exit criteria",
      "Filler & decap insertion",
    ],
    subsections: [
      {
        title: "Placement Flow",
        content:
          "1) Global placement → 2) Legalization → 3) Detailed placement → 4) Timing optimization → 5) Congestion fix → 6) Filler insertion. Iterazioni tra step 4-5 fino a convergence.",
        bullets: [
          "place_opt -incremental per ECO placement",
          "setPlaceMode -congEffort high per design congestionati",
          "Spreading cells in red congestion zones",
          "Pre-place critical cells vicino ai driver",
        ],
      },
      {
        title: "PRO Exit — Placement Route Optimization Exit",
        content:
          "Il PRO Exit verifica che il placement sia sufficientemente maturo per CTS e routing. Non è uno standard foundry ma un gate interno del team PD. Fallire il PRO Exit significa iterare placement prima di investire tempo in CTS/routing.",
      },
    ],
    exitCriteria: [
      { name: "Legal placement", description: "check_legality clean, no overlap, all cells placed" },
      { name: "Pre-CTS timing", description: "Setup WNS ≥ -0.1ns (margine pre-CTS), no gross violations" },
      { name: "Congestion", description: "Global routing congestion < 5% overflow in critical regions" },
      { name: "Density uniform", description: "No extreme density hotspots (>90%) o deserts (<30%)" },
      { name: "Power connections", description: "All cells connected to PG, no floating rails" },
      { name: "Scan chain integrity", description: "Scan chains routable, no broken chains" },
    ],
    checks: [
      {
        category: "Post-Placement Checks",
        items: [
          "check_legality / verifyGeometry",
          "report_congestion -overflow",
          "report_timing -preCTS",
          "report_design_physical -density",
          "check_design -netlist vs floorplan",
        ],
      },
    ],
    color: "#34d399",
    glowColor: "rgba(52, 211, 153, 0.4)",
  },
  {
    id: "cts",
    step: 7,
    title: "Clock Tree Synthesis",
    subtitle: "Skew, latency, useful skew, clock gating",
    description:
      "La CTS costruisce l'albero di distribuzione del clock da root ai sink (flip-flop). Obiettivi: minimizzare skew (differenza max-min di clock arrival), controllare latency, rispettare transition/capacitance limits, integrare clock gating. Una CTS mal fatta rende impossibile il timing closure.",
    deepDive: [
      "Clock spec definisce: root pin, excluded pins, target skew, max transition, max capacitance, clock gating cells. Non-clock buffers (NCB) e clock buffers (CB) hanno regole diverse.",
      "Useful skew: skew intenzionale per migliorare setup su critical paths (arrivare clock prima al capture, dopo al launch). Tool come Innovus supportano useful skew optimization.",
      "CTS consuma routing resource significativa — il floorplan deve riservare spazio per clock spine e buffer. CTS-friendly floorplan: clock source centrale, sink distribuiti uniformemente.",
      "Post-CTS: hold violations spesso emergono (clock arriva troppo presto). Fix con delay cells, buffer insertion, o useful skew adjustment.",
    ],
    inputs: ["Placed design (post PRO exit)", "Clock definitions (SDC)", "CTS spec file", "Buffer/inverter cells per CTS"],
    outputs: ["CTS netlist + DEF", "Clock tree report (skew, latency)", "Post-CTS timing", "Clock power report"],
    tools: ["Innovus ccopt_design", "ICC2 clock_opt", "Tempus", "ClockExplorer"],
    keyConcepts: [
      "Clock skew & latency",
      "Useful skew optimization",
      "Clock gating integration",
      "Hold fixing post-CTS",
      "Multi-source CTS (MSCTS)",
    ],
    subsections: [
      {
        title: "Parametri CTS Critici",
        content:
          "Target skew: tipicamente ±50ps per design consumer, ±20ps per high-performance. Max transition: 100-200ps. Max capacitance: dipende dal buffer drive strength. Clock gating: integrare ICG cells nel tree.",
        bullets: [
          "Root: clock pad o PLL output",
          "Excluded: analog blocks, test mode clocks",
          "Through pins: per clock domain crossing",
          "Ndr (non-default rules) per clock nets",
        ],
      },
    ],
    exitCriteria: [
      { name: "Target skew met", description: "Clock skew within spec per clock domain" },
      { name: "Max transition", description: "Clock transition < limit on all clock nets" },
      { name: "Hold margin", description: "Hold WNS ≥ 0 post-CTS (or fixable)" },
      { name: "Clock buffer count", description: "Buffer count ragionevole (power budget)" },
      { name: "DRV clean", description: "No design rule violations on clock nets" },
    ],
    color: "#fbbf24",
    glowColor: "rgba(251, 191, 36, 0.4)",
  },
  {
    id: "routing",
    step: 8,
    title: "Routing",
    subtitle: "Global routing, detailed routing, post-route optimization",
    description:
      "Il routing crea le interconnessioni fisiche tra celle su layer metallici (M1-Mn). Global routing alloca regioni di canale; detailed routing traccia wire e vias effettivi. Post-route optimization (PRO) fixa timing, DRC e SI violations. Il routing è la fase più compute-intensive del PD flow.",
    deepDive: [
      "Global routing opera su G-cell grid: assegna path approssimativi minimizzando congestion. Overflow > 0 indica regioni non routable — richiede placement spreading o floorplan change.",
      "Detailed routing: maze routing, track assignment, via insertion, DRC fixing. Tool: NanoRoute (Innovus), ZRoute (ICC2). NDR (Non-Default Rules) per net critici: wider wires, double spacing, shielding.",
      "Signal Integrity: crosstalk delay e noise. Aggressor/victim analysis, spacing increase, shielding con VSS/VDD, layer promotion per net critici.",
      "Post-Route Optimization (PRO): ECO routing, buffer insertion, cell sizing, via optimization. Il PRO Exit post-routing certifica timing + DRC clean prima del signoff.",
    ],
    inputs: ["Post-CTS design", "Routing rules (tech file)", "NDR rules", "Antenna rules", "SDC post-CTS"],
    outputs: ["Routed DEF", "SPEF (parasitic extraction)", "Post-route timing", "DRC report (internal)"],
    tools: ["Innovus routeDesign", "ICC2 route_opt", "StarRC (extraction)", "NanoRoute / ZRoute"],
    keyConcepts: [
      "Global vs detailed routing",
      "Routing congestion & overflow",
      "NDR & shielding",
      "Antenna effect prevention",
      "Post-route optimization (PRO)",
    ],
    subsections: [
      {
        title: "Global Routing",
        content:
          "Divide il chip in G-cells, assegna routing guides per ogni net. Congestion map mostra overflow per G-cell. Target: zero overflow before detailed routing.",
        bullets: [
          "routeDesign -globalDetail per Innovus",
          "reportCongestion -overflow",
          "Rip-up & reroute se overflow persistente",
          "Layer assignment H-V-H alternato",
        ],
      },
      {
        title: "Detailed Routing",
        content:
          "Tracciamento effettivo su track con vias. DRC in-route fixing. Antenna diode insertion per net con ratio eccessivo. Via doubling per EM-critical nets.",
      },
      {
        title: "Antenna Effect",
        content:
          "Durante plasma etching, wire lunghi non connessi accumulano carica che danneggia gate oxide. Fix: diode antenna collegata al gate, o metal jumpers a layer superiore. Ratio antenna = area gate / area metal — must be < foundry limit.",
      },
      {
        title: "PRO Exit — Post-Route Optimization",
        content:
          "Dopo routing e post-route opt: verificare setup/hold timing, DRC (internal tool check), antenna, congestion zero. PRO Exit sblocca il flusso di signoff (STA, PV, power).",
      },
    ],
    exitCriteria: [
      { name: "Routing complete", description: "100% nets routed, zero opens" },
      { name: "Congestion zero", description: "No routing overflow" },
      { name: "Post-route timing", description: "Setup WNS ≥ 0, Hold WNS ≥ 0 (pre-signoff)" },
      { name: "Antenna clean", description: "All antenna ratios within limits" },
      { name: "Internal DRC", description: "Tool-internal DRC clean (pre-Calibre)" },
    ],
    color: "#fb923c",
    glowColor: "rgba(251, 146, 60, 0.4)",
  },
  {
    id: "layout",
    step: 9,
    title: "Layout & Finishing",
    subtitle: "Metal fill, seal ring, chip assembly",
    description:
      "Dopo il routing, il layout richiede finishing: metal fill per CMP uniformity, seal ring per protezione del die, scribe line, filler cells, ECO routing. Il layout finale deve essere DRC-clean e pronto per merge GDSII e physical verification.",
    deepDive: [
      "Metal fill (dummy fill): inserisce poligoni di metallo per mantenere density entro limiti min/max del processo. CMP (Chemical Mechanical Polishing) richiede density uniforme — altrimenti dishing/erosion.",
      "Seal ring: anello protettivo attorno al die che previene moisture ingress e cracking. Obbligatorio per tapeout.",
      "ECO (Engineering Change Order): modifiche locali post-route senza ripetere l'intero flow. Metal-only ECO per fix timing minimi. Functional ECO richiede re-synthesis parziale.",
      "Hierarchy management: preservare hierarchy per debug vs flatten per foundry merge. Top-level assembly integra tutti i block GDS + IO + seal ring + filler.",
    ],
    inputs: ["Routed DEF (post PRO exit)", "Fill rules dal PDK", "Seal ring template", "ECO netlist (se applicabile)"],
    outputs: ["Layout DEF con fill", "Seal ring integrato", "Pre-merge GDSII", "ECO documentation"],
    tools: ["Innovus addFiller", "Calibre fill", "KLayout", "Virtuoso (custom layout)"],
    keyConcepts: [
      "Metal fill & density rules",
      "CMP uniformity",
      "Seal ring & scribe line",
      "ECO flow (metal-only vs functional)",
      "Hierarchy vs flatten",
    ],
    subsections: [
      {
        title: "Metal Fill Strategy",
        content:
          "Insert fill dopo routing, prima di signoff DRC. Min density (es. 25%), max density (es. 75%) per layer. Fill non deve creare new DRC o impact timing (floating fill con spacing).",
      },
      {
        title: "Layout vs Schematic — Concetto",
        content:
          "Il layout è la rappresentazione geometrica del circuito. Ogni transistor è un insieme di poligoni su layer attivo, poly, diffusion, contatti e metalli. LVS verifica che il layout implementi esattamente il netlist.",
      },
    ],
    color: "#2dd4bf",
    glowColor: "rgba(45, 212, 191, 0.4)",
  },
  {
    id: "sta",
    step: 10,
    title: "STA — Static Timing Analysis",
    subtitle: "Signoff timing multi-corner multi-mode",
    description:
      "La STA verifica che ogni path logico rispetti i timing constraints (setup, hold, recovery, removal) su tutti i corner PVT e mode operativi. È il signoff timing ufficiale con parasitics estratti (SPEF) da layout reale. PrimeTime è il tool gold standard.",
    deepDive: [
      "Setup check: data arrival + setup ≤ clock arrival. Violation = path troppo lento. Hold check: data arrival ≥ clock arrival + hold. Violation = path troppo veloce (fix con delay cells).",
      "MMMC (Multi-Mode Multi-Corner): ogni combinazione mode×corner produce un timing view. Tipico: 3-5 modes (func, scan, low-power) × 12+ corners (SS/TT/FF × voltage × temperature).",
      "OCV (On-Chip Variation): derating per accounting process variation. AOCV/POCV/CPPR per accuracy crescente. Clock path e data path derated separatamente.",
      "SI (Signal Integrity) timing: crosstalk delta delay aggiunto ai path. Aggressor nets possono speed up o slow down victim paths. SI-aware STA obbligatoria per nodi ≤28nm.",
      "Post-PEX STA: parasitics estratti da layout (StarRC, Quantus) in formato SPEF. È il timing 'vero' — pre-layout STA usa wire load models (meno accurato).",
    ],
    inputs: ["Post-route netlist", "SPEF (parasitic extraction)", "SDC signoff", "Liberty .lib per tutti i corner", "MMMC scenario definitions"],
    outputs: ["STA signoff report (WNS, TNS per corner)", "Timing ECO list", "Slack histogram", "Path reports per violation"],
    tools: ["PrimeTime (STA gold)", "Tempus", "OpenSTA", "StarRC / Quantus (extraction)"],
    keyConcepts: [
      "Setup / Hold / Recovery / Removal",
      "MMMC: multi-mode multi-corner",
      "OCV / AOCV / POCV derating",
      "SI-aware timing (crosstalk)",
      "CPPR (Clock Path Pessimism Removal)",
    ],
    subsections: [
      {
        title: "Corner Analysis",
        content:
          "SS (Slow-Slow): setup critical, worst case delay. FF (Fast-Fast): hold critical, best case delay. TT (Typical-Typical): nominal. FS/SF: un NMOS slow + PMOS fast (e viceversa). Ogni corner ha .lib e RC corner associati.",
        bullets: [
          "Setup signoff: SS corner, high temp, low voltage",
          "Hold signoff: FF corner, low temp, high voltage",
          "12-30+ corners per design production",
          "CRPR/CPPR per rimuovere pessimismo clock",
        ],
      },
      {
        title: "Timing ECO",
        content:
          "Fix timing violations con minimal changes: upsize cell (drive strength), insert buffer, reroute net, useful skew adjustment. ECO loop: fix → re-extract → re-STA → verify. Metal-only ECO preferito per velocità.",
      },
    ],
    exitCriteria: [
      { name: "Setup signoff", description: "WNS ≥ 0, TNS = 0 su tutti i setup-critical corners" },
      { name: "Hold signoff", description: "WNS ≥ 0, TNS = 0 su tutti i hold-critical corners" },
      { name: "SI clean", description: "No crosstalk violations (delta delay within budget)" },
      { name: "Noise", description: "Glitch height < threshold on all nets" },
    ],
    color: "#facc15",
    glowColor: "rgba(250, 204, 21, 0.4)",
  },
  {
    id: "pv",
    step: 11,
    title: "PV — Physical Verification",
    subtitle: "DRC, LVS, ERC, density, antenna",
    description:
      "La Physical Verification (PV) è il signoff geometrico elettrico del layout. DRC verifica regole geometriche del processo, LVS verifica corrispondenza layout↔netlist, ERC verifica regole elettriche (short, open, floating). Zero violations — non 'quasi zero'. Calibre è lo standard industriale.",
    deepDive: [
      "DRC (Design Rule Check): migliaia di regole dal DRM (Design Rule Manual) del foundry. Min width, min spacing, min enclosure, density, antenna, latch-up, fin alignment (FinFET). Runset Calibre certificato dal foundry — NON usare regole interne del tool.",
      "LVS (Layout Versus Schematic): estrae netlist dal layout (device recognition) e confronta con gate netlist. CORRECT = match perfetto. Ogni transistor, ogni connessione, ogni size.",
      "ERC (Electrical Rule Check): floating gates, short to power, weak pull-up/down, high fanout. Softcheck e connectivity check facilitano debug LVS.",
      "Base DRC vs Metal DRC: per tapeout multi-stage (BTO/MTO), Base DRC verifica FEOL (active, poly, diffusion) al floorplan/placement; Metal DRC verifica BEOL (metalli, vias) al routing.",
    ],
    inputs: ["Final GDSII / DEF", "Gate-level netlist", "Calibre rule deck (.svrf)", "LVS rule deck", "Layer map file"],
    outputs: ["DRC clean report (zero violations)", "LVS CORRECT report", "ERC clean report", "Waiver documentation"],
    tools: ["Calibre nmDRC / nmLVS", "Pegasus (Synopsys)", "PVS (Cadence)", "KLayout (open PDK)", "Magic/netgen (open)"],
    keyConcepts: [
      "DRC: geometric manufacturing rules",
      "LVS: layout ↔ netlist equivalence",
      "ERC: electrical rule checking",
      "Base DRC vs Metal DRC (BTO/MTO)",
      "Waivers: foundry-approved only",
    ],
    subsections: [
      {
        title: "DRC — Design Rule Check",
        content:
          "Ogni violation ha un ID regola (es. M1.W.1 = M1 min width). Debug: zoom alla violation, capire root cause (routing, placement, fill). Waivers solo con lettera di approvazione foundry.",
        bullets: [
          "Zero violations at tapeout — no exceptions",
          "Run on merged GDS (design + fill + seal ring)",
          "Hierarchical vs flat DRC run",
          "Recommended vs mandatory rules",
        ],
      },
      {
        title: "LVS — Layout Versus Schematic",
        content:
          "Device recognition: trova transistor (W/L), resistor, capacitor nel layout. Net extraction: mappa connessioni. Compare con netlist: match per device count, net connectivity, parameter values.",
        bullets: [
          "CORRECT = pass, INCORRECT = debug",
          "Common failures: missing via, wrong W/L, short, open",
          "Softchk per power/ground connectivity",
          "LVS on post-fill, post-ECO netlist",
        ],
      },
      {
        title: "Altri Check PV",
        content:
          "Antenna check, metal density (min/max), latch-up, ESD rule check, fin alignment (advanced nodes), off-grid detection, zero-area cells.",
      },
    ],
    exitCriteria: [
      { name: "DRC zero", description: "Zero violations con foundry-certified runset" },
      { name: "LVS CORRECT", description: "Layout netlist matches gate netlist exactly" },
      { name: "ERC clean", description: "No floating gates, no power shorts" },
      { name: "Density", description: "All layers within min/max density window" },
      { name: "Antenna", description: "All antenna ratios < foundry limit" },
    ],
    color: "#f87171",
    glowColor: "rgba(248, 113, 113, 0.4)",
  },
  {
    id: "power",
    step: 12,
    title: "Power Signoff",
    subtitle: "IR Drop, EM, power integrity",
    description:
      "Il power signoff verifica che la PDN supporti le correnti di switching senza degradare funzionalità (IR drop) e che i wire non falliscano per electromigration nel lifetime del prodotto. Analisi statica (DC) e dinamica (transient) con vector set realistici.",
    deepDive: [
      "Static IR: V_drop = I_avg × R_path. Tool: Voltus, RedHawk. Input: SPEF + switching activity (VCD/SAIF). Limit: < 5% VDD.",
      "Dynamic IR: droop da L × dI/dt al clock edge. Milioni di FF switch simultaneamente. Decap limita droop. Limit: < 10% VDD per < 500ps.",
      "EM (Electromigration): Black's Equation MTTF = A × J^(-n) × exp(Ea/kT). Ogni wire/via verificato vs J_max per layer. Fix: widen wire, add parallel vias, layer promotion.",
      "Dynamic IR è il 'silent timing killer': chip passa STA con VDD nominale ma fallisce in silicon perché VDD reale è VDD - 100mV al clock edge.",
    ],
    inputs: ["Routed layout + SPEF", "Switching activity (VCD/FSDB)", "PDN extraction", "EM rules from PDK"],
    outputs: ["Static IR report", "Dynamic IR waveform", "EM violation report", "Fix recommendations"],
    tools: ["Voltus (Cadence)", "RedHawk (Ansys/Synopsys)", "PrimePower", "Totem"],
    keyConcepts: [
      "Static vs dynamic IR drop",
      "Black's Equation (EM)",
      "Decap effectiveness",
      "Power grid resistance analysis",
      "Vector-based power analysis",
    ],
    subsections: [
      {
        title: "Limiti Industriali",
        content:
          "Static IR: max 5% VDD drop. Dynamic IR: max 10% VDD droop. EM: MTTF ≥ 10 anni @ Tmax (125°C consumer, 150°C automotive). RMS current per signal nets.",
      },
    ],
    exitCriteria: [
      { name: "Static IR", description: "Max voltage drop < 5% VDD on all instances" },
      { name: "Dynamic IR", description: "Max droop < 10% VDD, duration < 500ps" },
      { name: "EM", description: "All wires/vias within J_max for 10-year MTTF" },
    ],
    color: "#fb7185",
    glowColor: "rgba(251, 113, 133, 0.4)",
  },
  {
    id: "package",
    step: 13,
    title: "Package & Bump Assignment",
    subtitle: "PKG co-design, RDL, flip-chip, IO planning",
    description:
      "Il package collega il die al mondo esterno (PCB). Bump assignment mappa IO pad del die a bump balls per flip-chip. RDL (Redistribution Layer) routing connette pad a bumps. Co-design chip-package è essenziale per signal integrity, power delivery e thermal management.",
    deepDive: [
      "Wire-bond vs flip-chip: wire-bond usa pad periferici e fili dorati; flip-chip usa bump array area-I/O con connessione diretta al substrate. Flip-chip abilita >1000 IO e minore inductance.",
      "Bump assignment: mappa ogni IO buffer a un bump location rispettando pitch, power/ground ratio, signal grouping. Constraint: capacità tra bump adiacenti, escape routing dal core al bump.",
      "RDL routing: layer metallico aggiuntivo sopra il die per redistribuire segnali da pad positions a bump positions. Network-flow algorithms per 100% routability.",
      "Package types: BGA, CSP, QFN, 2.5D (interposer), 3D (TSV). Scelta impatta bump map, thermal, cost.",
    ],
    inputs: ["IO pad locations (DEF)", "Bump pitch & array spec", "Package substrate design rules", "Power/ground bump requirements", "Signal integrity budget"],
    outputs: ["Bump assignment map", "RDL routing", "Package netlist", "Co-design SI report", "Thermal analysis"],
    tools: ["Cadence SIP (SiP)", "Redistribution routing tools", "ANSYS SIwave", "Package design tools"],
    keyConcepts: [
      "Wire-bond vs flip-chip",
      "Bump assignment & pitch",
      "RDL (Redistribution Layer)",
      "Chip-package co-design",
      "SSO (Simultaneous Switching Output)",
    ],
    subsections: [
      {
        title: "Bump Assignment Flow",
        content:
          "1) Define bump array grid → 2) Assign power/ground bumps (priorità) → 3) Assign signal bumps by proximity/connectivity → 4) RDL routing pad-to-bump → 5) Verify SI, IR, escape routing.",
        bullets: [
          "Power bump ratio: tipicamente 1:4 power:signal",
          "Critical interfaces: minimizzare wirelength RDL",
          "Differential pairs: bump adiacenti, matched length",
          "SSO analysis per bus ad alta frequenza",
        ],
      },
      {
        title: "Package (PKG) Integration",
        content:
          "Il package fornisce: mechanical support, thermal dissipation, power delivery dal PCB al die, signal routing. Co-design iterativo tra chip PD team e package team.",
      },
    ],
    color: "#c084fc",
    glowColor: "rgba(192, 132, 252, 0.4)",
  },
  {
    id: "tapeout",
    step: 14,
    title: "Tapeout — BTO, MTO, GDSII, GKC",
    subtitle: "Base Tape-Out, Metal Tape-Out, Gate Keeper Check",
    description:
      "Il tapeout è il momento in cui il design lascia il mondo digitale e va in fabbricazione. BTO (Base Tape-Out) congela i layer FEOL (active, poly, diffusion); MTO (Metal Tape-Out) finalizza i layer BEOL (metalli, vias). GKC (Gate Keeper Check) e TOR (Tapeout Review) sono i gate finali prima del rilascio GDSII.",
    deepDive: [
      "BTO (Base Tape-Out): congela transistor-level layers — OD (oxide diffusion), poly (gate), active area, well implants. Permette parallelizzazione: FEOL masks vanno in fab mentre BEOL design continua.",
      "MTO (Metal Tape-Out): finalizza tutti i metal layers e vias. GDSII completo con fill, seal ring, scribe line. È il tapeout 'vero' per la maggior parte del flusso.",
      "GKC (Gate Keeper Check): review strutturata multi-disciplinare. Checklist firmata da FE, PD, PV, STA, DFT, package. Nessun rilascio senza GKC pass.",
      "TOR (Tapeout Review): meeting finale con tutti gli stakeholder. Ogni disciplina presenta signoff status. Un solo 'no' blocca il tapeout.",
      "GDSII: formato binario gerarchico con poligoni per ogni layer mask. SoC moderni: 50-500 GB, trilioni di poligoni, 60-100 mask layers. Alternativa: OASIS (più compatto).",
      "Costo tapeout advanced node: $2-5M+ per mask set. 3-4 mesi fab. Nessun undo — bug trovati solo quando arriva il silicon.",
    ],
    inputs: [
      "Signoff-clean layout (DRC, LVS, STA, IR, EM)",
      "Final netlist + SDC + UPF",
      "Layer map + foundry submission kit",
      "Waiver list (foundry-approved)",
      "PDK version locked & documented",
    ],
    outputs: [
      "GDSII / OASIS file",
      "Tapeout documentation package",
      "Signoff reports archive",
      "Mask data (via foundry OPC/RET)",
      "Engineering wafer (first silicon)",
    ],
    tools: ["Calibre xRC", "Calibre Merge", "KLayout", "Foundry portal", "OPC/RET (foundry-side)"],
    keyConcepts: [
      "BTO: Base Tape-Out (FEOL freeze)",
      "MTO: Metal Tape-Out (BEOL finalize)",
      "GKC: Gate Keeper Check",
      "TOR: Tapeout Review meeting",
      "GDSII / OASIS format",
      "MPW vs Full Mask tapeout",
    ],
    subsections: [
      {
        title: "BTO — Base Tape-Out",
        content:
          "Congela layer FEOL: diffusion (OD), polysilicon (poly), active, well, contact. Base DRC eseguito al floorplan/placement stage. Automazione DRC durante BTO riduce effort manuale e accelera il tapeout.",
        bullets: [
          "FEOL layers: transistor formation",
          "Base DRC: orientation cells, tap cells, tie cells, density",
          "Softcheck + ERC per power shorts",
          "ESD clamp cell verification",
        ],
      },
      {
        title: "MTO — Metal Tape-Out",
        content:
          "Finalizza tutti i metal layers (M1-Mn), vias, passivation, fill. Metal DRC al routing stage. Merge GDS: design + standard cells + IO + fill + seal ring.",
        bullets: [
          "Metal DRC: spacing, width, via enclosure",
          "Density fill verification",
          "Merged GDS DRC (not intermediate DB)",
          "Post-fill, post-ECO LVS",
        ],
      },
      {
        title: "GKC — Gate Keeper Check",
        content:
          "Checkpoint multi-disciplinare pre-tapeout. Non è un singolo tool ma un processo: ogni team certifica il proprio dominio. Include review waivers, PDK lock, e data package completeness.",
        bullets: [
          "FE: RTL↔netlist LEC, CDC/CDC signoff",
          "PD: timing/power/physical signoff",
          "PV: DRC/LVS/ERC zero violations",
          "DFT: scan/MBIST/BIST verified",
          "Package: bump map approved",
        ],
      },
      {
        title: "Tapeout Checklist (30 punti)",
        content:
          "Checklist produzione tipica: PDK locked, DRC zero, LVS CORRECT, STA all corners green, IR/EM signed off, antenna clean, fill inserted, formal equiv verified, CDC verified, GDS merged, layer map verified, waivers approved, TOR completed.",
      },
    ],
    exitCriteria: [
      { name: "All signoff green", description: "DRC, LVS, STA, IR, EM, antenna — all pass" },
      { name: "GKC approved", description: "Gate Keeper Check firmato da tutte le discipline" },
      { name: "TOR completed", description: "Tapeout Review meeting: go/no-go unanimous" },
      { name: "PDK locked", description: "PDK version documented, no pending updates" },
      { name: "GDS merged & verified", description: "Final merged GDS passes DRC/LVS" },
      { name: "Data package delivered", description: "GDSII + netlist + reports → foundry portal" },
    ],
    color: "#60a5fa",
    glowColor: "rgba(96, 165, 250, 0.4)",
  },
];
