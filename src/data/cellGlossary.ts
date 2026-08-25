import { loc, type Localized } from "@/i18n/context";

export interface CellType {
  id: string;
  name: Localized;
  category: Localized;
  function: Localized;
  placement: Localized;
  whenUsed: Localized;
  technicalNotes: Localized<string[]>;
  relatedCells?: string[];
}

export const cellCategories = [
  loc("Logica Combinatoria", "Combinational Logic"),
  loc("Sequential & Scan", "Sequential & Scan"),
  loc("Clock & Buffer", "Clock & Buffer"),
  loc("Power & Ground", "Power & Ground"),
  loc("Low Power", "Low Power"),
  loc("Filler & Physical", "Filler & Physical"),
  loc("DFT & Test", "DFT & Test"),
];

export const cellGlossary: CellType[] = [
  {
    id: "inv",
    name: loc("INV — Inverter", "INV — Inverter"),
    category: loc("Logica Combinatoria", "Combinational Logic"),
    function: loc(
      "Inverte il segnale logico: Y = ¬A. Cella fondamentale con varianti di drive strength (X1, X2, X4, X8, X16, X32).",
      "Inverts logic signal: Y = ¬A. Fundamental cell with drive strength variants (X1, X2, X4, X8, X16, X32)."
    ),
    placement: loc(
      "Qualsiasi sito legale in standard cell row. Sizing per fanout e timing.",
      "Any legal site in standard cell row. Sized for fanout and timing."
    ),
    whenUsed: loc(
      "Fix timing (buffering), logica combinatoria, clock inversion, CTS.",
      "Timing fix (buffering), combinational logic, clock inversion, CTS."
    ),
    technicalNotes: loc(
      [
        "Input capacitance Cin e output resistance Rout dalla .lib",
        "Leakage power aumenta con drive strength",
        "Varianti threshold: HVT, SVT, LVT, ULVT per trade-off speed/leakage",
      ],
      [
        "Input capacitance Cin and output resistance Rout from .lib",
        "Leakage power increases with drive strength",
        "Threshold variants: HVT, SVT, LVT, ULVT for speed/leakage trade-off",
      ]
    ),
    relatedCells: ["BUF", "CLKINV"],
  },
  {
    id: "buf",
    name: loc("BUF — Buffer", "BUF — Buffer"),
    category: loc("Logica Combinatoria", "Combinational Logic"),
    function: loc(
      "Buffer non-inverting: Y = A. Isola capacitive load, ripristina slew rate. Non modifica la logica.",
      "Non-inverting buffer: Y = A. Isolates capacitive load, restores slew rate. Does not change logic."
    ),
    placement: loc("Row legale, spesso inserito da CTS o timing optimization.", "Legal row, often inserted by CTS or timing optimization."),
    whenUsed: loc(
      "Fix max transition/capacitance, clock tree buffering, long wire driving.",
      "Fix max transition/capacitance, clock tree buffering, long wire driving."
    ),
    technicalNotes: loc(
      [
        "BUFX1, BUFX2, ... BUFX32 per drive strength crescente",
        "Inserimento automatico da optDesign per DRV fix",
        "Area ∝ drive strength; CTS ne inserisce centinaia/migliaia",
      ],
      [
        "BUFX1, BUFX2, ... BUFX32 for increasing drive strength",
        "Automatic insertion by optDesign for DRV fix",
        "Area ∝ drive strength; CTS inserts hundreds/thousands",
      ]
    ),
    relatedCells: ["INV", "CLKBUF"],
  },
  {
    id: "aoi",
    name: loc("AOI — And-Or-Invert", "AOI — And-Or-Invert"),
    category: loc("Logica Combinatoria", "Combinational Logic"),
    function: loc(
      "Porta combinatorsia AOI: Y = ¬((A·B) + (C·D) + ...). Implementa funzioni NAND-OR in una sola cella fisica.",
      "AOI combinational gate: Y = ¬((A·B) + (C·D) + ...). Implements NAND-OR functions in single physical cell."
    ),
    placement: loc("Row standard. Alta pin density → può causare congestion locale.", "Standard row. High pin density → may cause local congestion."),
    whenUsed: loc("Mapping post-sintesi per area/timing optimization. AOI21, AOI22, AOI211, etc.", "Post-synthesis mapping for area/timing optimization. AOI21, AOI22, AOI211, etc."),
    technicalNotes: loc(
      [
        "Meno area e delay vs rete equivalente di INV+AND+OR",
        "Pin access da M1/M2 — congestion hotspot in placement denso",
        "Liberty: timing arc per ogni input→output",
      ],
      [
        "Less area and delay vs equivalent INV+AND+OR network",
        "Pin access from M1/M2 — congestion hotspot in dense placement",
        "Liberty: timing arc for each input→output",
      ]
    ),
    relatedCells: ["OAI", "NAND", "NOR"],
  },
  {
    id: "oai",
    name: loc("OAI — Or-And-Invert", "OAI — Or-And-Invert"),
    category: loc("Logica Combinatoria", "Combinational Logic"),
    function: loc(
      "Y = ¬((A+B) · (C+D) · ...). Dual di AOI. Complemento logico per implementare NOR-AND.",
      "Y = ¬((A+B) · (C+D) · ...). Dual of AOI. Logic complement for NOR-AND implementation."
    ),
    placement: loc("Row standard, attenzione a pin density e routing access.", "Standard row, watch pin density and routing access."),
    whenUsed: loc("Synthesis mapping, specialmente in datapath e control logic.", "Synthesis mapping, especially in datapath and control logic."),
    technicalNotes: loc(
      ["OAI21, OAI22, OAI222 — numero = fan-in per gruppo", "Spesso preferiti ad AND+OR chains per timing"],
      ["OAI21, OAI22, OAI222 — number = fan-in per group", "Often preferred over AND+OR chains for timing"]
    ),
    relatedCells: ["AOI"],
  },
  {
    id: "clkbuf",
    name: loc("CLKBUF — Clock Buffer", "CLKBUF — Clock Buffer"),
    category: loc("Clock & Buffer", "Clock & Buffer"),
    function: loc(
      "Buffer dedicato al clock tree. Y = A con caratteristiche ottimizzate per min skew, min delay variation, controlled transition.",
      "Dedicated clock tree buffer. Y = A with characteristics optimized for min skew, min delay variation, controlled transition."
    ),
    placement: loc(
      "Solo nel clock tree — NON usare come data buffer. Posizionato da CTS engine.",
      "Clock tree only — NOT for data buffering. Placed by CTS engine."
    ),
    whenUsed: loc("Clock Tree Synthesis — ogni livello dell'albero clock.", "Clock Tree Synthesis — every level of the clock tree."),
    technicalNotes: loc(
      [
        "Balance skew: delay matching tra rami",
        "Max transition/capacitance constraints più stringenti",
        "Non-clock buffer (NCB) vietati nel clock path",
        "Varianti: CLKBUF, CLKBUFX2, CLKBUFX4",
      ],
      [
        "Skew balance: delay matching between branches",
        "Stricter max transition/capacitance constraints",
        "Non-clock buffers (NCB) forbidden in clock path",
        "Variants: CLKBUF, CLKBUFX2, CLKBUFX4",
      ]
    ),
    relatedCells: ["CLKINV", "ICG"],
  },
  {
    id: "trunk",
    name: loc("Trunk Buffer / Clock Trunk Cell", "Trunk Buffer / Clock Trunk Cell"),
    category: loc("Clock & Buffer", "Clock & Buffer"),
    function: loc(
      "Buffer ad alta drive strength per spine/trunk del clock tree o power trunk. Distribuisce clock/power su distanze lunghe con minima degradazione.",
      "High drive strength buffer for clock tree spine/trunk or power trunk. Distributes clock/power over long distances with minimal degradation."
    ),
    placement: loc(
      "Lungo clock spine centrale o power trunk. Spesso su layer metal alti con wide wire.",
      "Along central clock spine or power trunk. Often on upper metal layers with wide wire."
    ),
    whenUsed: loc(
      "Design grandi con clock ad alto fanout. MSCTS (Multi-Source CTS). Power trunk routing.",
      "Large designs with high fanout clock. MSCTS (Multi-Source CTS). Power trunk routing."
    ),
    technicalNotes: loc(
      [
        "Drive strength X16-X32 tipico",
        "NDR (non-default rules) per trunk nets: wider wire, double spacing",
        "Minimizza insertion delay e skew variation",
      ],
      [
        "Drive strength X16-X32 typical",
        "NDR (non-default rules) for trunk nets: wider wire, double spacing",
        "Minimizes insertion delay and skew variation",
      ]
    ),
    relatedCells: ["CLKBUF", "BUFX32"],
  },
  {
    id: "icg",
    name: loc("ICG — Integrated Clock Gating Cell", "ICG — Integrated Clock Gating Cell"),
    category: loc("Clock & Buffer", "Clock & Buffer"),
    function: loc(
      "Clock gating: GCLK = CLK · EN (latch-based o AND-based). Disabilita clock a registri inattivi → riduce dynamic power.",
      "Clock gating: GCLK = CLK · EN (latch-based or AND-based). Disables clock to inactive registers → reduces dynamic power."
    ),
    placement: loc(
      "Nel clock tree, tra root e sink FF. Un ICG per gruppo di registri con stesso enable.",
      "In clock tree, between root and sink FF. One ICG per register group with same enable."
    ),
    whenUsed: loc(
      "Power optimization — design con clock gating RTL (enable signal).",
      "Power optimization — designs with RTL clock gating (enable signal)."
    ),
    technicalNotes: loc(
      [
        "Latch-based ICG: evita glitch (EN sampled quando CLK=0)",
        "Setup/hold su enable signal rispetto a clock",
        "CTS integra ICG nel tree — non aggiungere manualmente",
      ],
      [
        "Latch-based ICG: prevents glitch (EN sampled when CLK=0)",
        "Setup/hold on enable signal relative to clock",
        "CTS integrates ICG in tree — do not add manually",
      ]
    ),
    relatedCells: ["CLKBUF", "DFF"],
  },
  {
    id: "dff",
    name: loc("DFF — D Flip-Flop", "DFF — D Flip-Flop"),
    category: loc("Sequential & Scan", "Sequential & Scan"),
    function: loc(
      "Registro edge-triggered: Q = D @ posedge CLK. Elemento sequenziale base del design sincrono.",
      "Edge-triggered register: Q = D @ posedge CLK. Basic sequential element of synchronous design."
    ),
    placement: loc("Row standard, allineato al clock tree sink.", "Standard row, aligned to clock tree sink."),
    whenUsed: loc("Ogni stato sequenziale nel design RTL.", "Every sequential state in RTL design."),
    technicalNotes: loc(
      [
        "Setup: T_clk - T_data ≥ T_setup. Hold: T_data ≥ T_hold",
        "Varianti scan: SDFF (scan DFF) con SI (scan in)",
        "Retention DFF: doppia alimentazione per low power",
      ],
      [
        "Setup: T_clk - T_data ≥ T_setup. Hold: T_data ≥ T_hold",
        "Scan variants: SDFF (scan DFF) with SI (scan in)",
        "Retention DFF: dual supply for low power",
      ]
    ),
    relatedCells: ["SDFF", "LAT"],
  },
  {
    id: "tap",
    name: loc("Tap Cell — Well Tie", "Tap Cell — Well Tie"),
    category: loc("Power & Ground", "Power & Ground"),
    function: loc(
      "Connette N-well e P-substrate a VDD/VSS per prevenire latch-up. Non ha funzione logica.",
      "Connects N-well and P-substrate to VDD/VSS to prevent latch-up. No logic function."
    ),
    placement: loc(
      "OBBLIGATORIO: ogni N righe di standard cells (typical ogni 2-15 rows, dipende dal PDK). Inserito automaticamente dal tool.",
      "MANDATORY: every N rows of standard cells (typical every 2-15 rows, PDK dependent). Auto-inserted by tool."
    ),
    whenUsed: loc(
      "Sempre — requisito di processo per well bias. Mancanza → latch-up failure.",
      "Always — process requirement for well bias. Missing → latch-up failure."
    ),
    technicalNotes: loc(
      [
        "Spacing rule dal DRM: max distance between taps",
        "Tap cell non ha signal pins — solo PG",
        "Well tap vs substrate tap variants",
        "DRC: tap spacing violation se troppo distanti",
      ],
      [
        "Spacing rule from DRM: max distance between taps",
        "Tap cell has no signal pins — PG only",
        "Well tap vs substrate tap variants",
        "DRC: tap spacing violation if too far apart",
      ]
    ),
    relatedCells: ["ENDCAP", "FILLER"],
  },
  {
    id: "endcap",
    name: loc("Endcap / Edge Cell", "Endcap / Edge Cell"),
    category: loc("Filler & Physical", "Filler & Physical"),
    function: loc(
      "Chiude le righe di standard cells ai bordi del core/macro. Protegge l'ultima cella della row da damage e garantisce continuità del power rail.",
      "Closes standard cell rows at core/macro boundaries. Protects last row cell from damage and ensures power rail continuity."
    ),
    placement: loc(
      "Agli estremi di ogni row (left/right end). Obbligatorio ai confini core e attorno ai macro.",
      "At each row extremity (left/right end). Mandatory at core boundaries and around macros."
    ),
    whenUsed: loc(
      "Post-placement, pre-routing. Inserito da addEndCap / insert_endcap.",
      "Post-placement, pre-routing. Inserted by addEndCap / insert_endcap."
    ),
    technicalNotes: loc(
      [
        "Left endcap (LE) e Right endcap (RE) — orientamento importa",
        "Previene etching damage alle celle periferiche",
        "Necessario per DRC clean alle row boundaries",
      ],
      [
        "Left endcap (LE) and Right endcap (RE) — orientation matters",
        "Prevents etching damage to peripheral cells",
        "Required for DRC clean at row boundaries",
      ]
    ),
    relatedCells: ["TAP", "FILLER"],
  },
  {
    id: "filler",
    name: loc("Filler Cell", "Filler Cell"),
    category: loc("Filler & Physical", "Filler & Physical"),
    function: loc(
      "Riempie gap nelle row tra celle standard per garantire continuità power rail (VDD/VSS) e density uniforme.",
      "Fills gaps in rows between standard cells to ensure power rail (VDD/VSS) continuity and uniform density."
    ),
    placement: loc(
      "Nei gap tra celle nelle row. Multi-height filler (1x, 2x, 4x height) per match row height.",
      "In gaps between cells in rows. Multi-height filler (1x, 2x, 4x height) to match row height."
    ),
    whenUsed: loc(
      "Post-placement, pre-routing. addFiller / insert_filler.",
      "Post-placement, pre-routing. addFiller / insert_filler."
    ),
    technicalNotes: loc(
      [
        "FILL1, FILL2, FILL4 — width in multipli di site width",
        "Power rail continuity: gap senza filler → open rail DRC",
        "Non confondere con DECAP filler",
      ],
      [
        "FILL1, FILL2, FILL4 — width in multiples of site width",
        "Power rail continuity: gap without filler → open rail DRC",
        "Do not confuse with DECAP filler",
      ]
    ),
    relatedCells: ["DECAP", "ENDCAP"],
  },
  {
    id: "decap",
    name: loc("Decap Cell — Decoupling Capacitor", "Decap Cell — Decoupling Capacitor"),
    category: loc("Filler & Physical", "Filler & Physical"),
    function: loc(
      "Capacità on-chip tra VDD-VSS che stabilizza alimentazione durante switching transients. C_decap limita dynamic IR droop.",
      "On-chip capacitance between VDD-VSS that stabilizes supply during switching transients. C_decap limits dynamic IR droop."
    ),
    placement: loc(
      "Attorno a macro ad alta attività, near power switches, in regioni con dynamic IR violations. Non in ogni gap.",
      "Around high-activity macros, near power switches, in regions with dynamic IR violations. Not in every gap."
    ),
    whenUsed: loc(
      "Power planning e post-IR analysis. Inserimento mirato per dynamic IR fix.",
      "Power planning and post-IR analysis. Targeted insertion for dynamic IR fix."
    ),
    technicalNotes: loc(
      [
        "C_decap tipico: 100fF - 1pF per cella",
        "Trade-off: area vs IR droop reduction",
        "Placed by addDecap / insert_decap_cap_cells",
      ],
      [
        "C_decap typical: 100fF - 1pF per cell",
        "Trade-off: area vs IR droop reduction",
        "Placed by addDecap / insert_decap_cap_cells",
      ]
    ),
    relatedCells: ["FILLER", "TAP"],
  },
  {
    id: "tie",
    name: loc("TIEHI / TIELO — Tie Cell", "TIEHI / TIELO — Tie Cell"),
    category: loc("Power & Ground", "Power & Ground"),
    function: loc(
      "Fornisce costante logica 1 (TIEHI → VDD) o 0 (TIELO → VSS) per input non driven. Evita floating inputs.",
      "Provides constant logic 1 (TIEHI → VDD) or 0 (TIELO → VSS) for undriven inputs. Prevents floating inputs."
    ),
    placement: loc(
      "Distribuiti nel core — tipicamente ogni N μm (PDK rule). Pre-placed al floorplan in alcuni flow.",
      "Distributed in core — typically every N μm (PDK rule). Pre-placed at floorplan in some flows."
    ),
    whenUsed: loc(
      "Input tied to 0/1, default values, unused pin tie-off.",
      "Input tied to 0/1, default values, unused pin tie-off."
    ),
    technicalNotes: loc(
      [
        "Resistenza interna alta — non per drive, solo tie-off",
        "DRC: max distance to tie cell per input",
        "FEOL check al floorplan per tie cell presence",
      ],
      [
        "High internal resistance — not for driving, tie-off only",
        "DRC: max distance to tie cell per input",
        "FEOL check at floorplan for tie cell presence",
      ]
    ),
    relatedCells: ["TAP"],
  },
  {
    id: "psw",
    name: loc("Power Switch (Header/Footer)", "Power Switch (Header/Footer)"),
    category: loc("Low Power", "Low Power"),
    function: loc(
      "Transistori PMOS (header) o NMOS (footer) che controllano alimentazione a switched domain. ON: R_on ≈ mΩ. OFF: leakage only.",
      "PMOS (header) or NMOS (footer) transistors controlling switched domain supply. ON: R_on ≈ mΩ. OFF: leakage only."
    ),
    placement: loc(
      "Al confine del voltage island, in switch column/strip. Vicino al switched domain.",
      "At voltage island boundary, in switch column/strip. Near switched domain."
    ),
    whenUsed: loc(
      "Power gating UPF domains. create_power_switch in UPF.",
      "Power gating UPF domains. create_power_switch in UPF."
    ),
    technicalNotes: loc(
      [
        "Fine-grain vs coarse-grain (lib attribute switch_cell_type)",
        "Header PMOS: VDD → VDD_SW (standard industriale)",
        "Inrush current limitato con daisy-chain enable",
      ],
      [
        "Fine-grain vs coarse-grain (lib attribute switch_cell_type)",
        "Header PMOS: VDD → VDD_SW (industry standard)",
        "Inrush current limited with daisy-chain enable",
      ]
    ),
    relatedCells: ["ISO", "LS"],
  },
  {
    id: "iso",
    name: loc("ISO — Isolation Cell", "ISO — Isolation Cell"),
    category: loc("Low Power", "Low Power"),
    function: loc(
      "Isola output di domain power-down: clamp a 0/1/retain quando domain OFF. Previene floating outputs verso always-on logic.",
      "Isolates power-down domain output: clamp to 0/1/retain when domain OFF. Prevents floating outputs to always-on logic."
    ),
    placement: loc(
      "Nel parent always-on domain, al confine con switched domain. Tra driver (OFF domain) e receiver (ON domain).",
      "In parent always-on domain, at switched domain boundary. Between driver (OFF domain) and receiver (ON domain)."
    ),
    whenUsed: loc(
      "Ogni segnale che attraversa power domain boundary con shutoff.",
      "Every signal crossing power domain boundary with shutoff."
    ),
    technicalNotes: loc(
      [
        "Enable signal (isolation_enable) da power controller",
        "Clamp value: 0, 1, or retain last value",
        "Conformal Low Power verifica isolation strategy",
      ],
      [
        "Enable signal (isolation_enable) from power controller",
        "Clamp value: 0, 1, or retain last value",
        "Conformal Low Power verifies isolation strategy",
      ]
    ),
    relatedCells: ["LS", "PSW"],
  },
  {
    id: "ls",
    name: loc("LS — Level Shifter", "LS — Level Shifter"),
    category: loc("Low Power", "Low Power"),
    function: loc(
      "Converte segnale tra voltage domains diversi (es. 1.0V ↔ 0.8V). Previene overstress e garantisce level compatibility.",
      "Converts signal between different voltage domains (e.g. 1.0V ↔ 0.8V). Prevents overstress and ensures level compatibility."
    ),
    placement: loc(
      "Al confine tra domini a voltage diverso. Always-on domain side.",
      "At boundary between different voltage domains. Always-on domain side."
    ),
    whenUsed: loc(
      "Multi-voltage design (DVFS, always-on ↔ switched, core ↔ IO voltage).",
      "Multi-voltage design (DVFS, always-on ↔ switched, core ↔ IO voltage)."
    ),
    technicalNotes: loc(
      [
        "High-to-low (H2L) e Low-to-high (L2H) variants",
        "Enable signal per power-aware level shifter",
        "Timing penalty: additional delay at domain crossing",
      ],
      [
        "High-to-low (H2L) and Low-to-high (L2H) variants",
        "Enable signal for power-aware level shifter",
        "Timing penalty: additional delay at domain crossing",
      ]
    ),
    relatedCells: ["ISO"],
  },
  {
    id: "gdhs",
    name: loc("GDHS — Guard Band / High-Strength Drive Cell", "GDHS — Guard Band / High-Strength Drive Cell"),
    category: loc("Filler & Physical", "Filler & Physical"),
    function: loc(
      "Celle di guardia ad alta drive strength usate come buffer di confine tra regioni (es. analog/digital) o per isolamento noise. Variante PDK-specific: possono implementare guard band fisico tra power domains o high-drive buffer per trunk locali.",
      "High drive strength guard cells used as boundary buffers between regions (e.g. analog/digital) or for noise isolation. PDK-specific variant: may implement physical guard band between power domains or high-drive buffer for local trunks."
    ),
    placement: loc(
      "Al confine tra regioni sensibili (analog/digital, noise-sensitive blocks). Inserite manualmente o via region constraint.",
      "At boundary between sensitive regions (analog/digital, noise-sensitive blocks). Inserted manually or via region constraint."
    ),
    whenUsed: loc(
      "Mixed-signal design, separazione analog/digital, noise isolation tra blocks.",
      "Mixed-signal design, analog/digital separation, noise isolation between blocks."
    ),
    technicalNotes: loc(
      [
        "Naming varia per foundry/PDK — verificare library guide",
        "Non confondere con endcap (funzione diversa)",
        "Possono servire come decoupling boundary",
      ],
      [
        "Naming varies by foundry/PDK — check library guide",
        "Do not confuse with endcap (different function)",
        "May serve as decoupling boundary",
      ]
    ),
    relatedCells: ["ENDCAP", "DECAP", "BUFX32"],
  },
  {
    id: "antenna",
    name: loc("Antenna Diode Cell", "Antenna Diode Cell"),
    category: loc("DFT & Test", "DFT & Test"),
    function: loc(
      "Diodo che dissipa carica plasma durante manufacturing su gate oxide. Ratio = A_gate / A_metal deve essere < limit.",
      "Diode that dissipates plasma charge during manufacturing on gate oxide. Ratio = A_gate / A_metal must be < limit."
    ),
    placement: loc(
      "Vicino a gate pins con long metal durante routing. Inserito da antenna fix engine.",
      "Near gate pins with long metal during routing. Inserted by antenna fix engine."
    ),
    whenUsed: loc(
      "Post-routing antenna check violation fix.",
      "Post-routing antenna check violation fix."
    ),
    technicalNotes: loc(
      [
        "Antenna ratio AR = Σ(A_metal)/A_gate < AR_max",
        "Fix: diode, metal jumper to higher layer, or buffer insertion",
        "Calibre antenna rule deck",
      ],
      [
        "Antenna ratio AR = Σ(A_metal)/A_gate < AR_max",
        "Fix: diode, metal jumper to higher layer, or buffer insertion",
        "Calibre antenna rule deck",
      ]
    ),
    relatedCells: ["DIODE"],
  },
  {
    id: "spare",
    name: loc("Spare Cell", "Spare Cell"),
    category: loc("DFT & Test", "DFT & Test"),
    function: loc(
      "Celle logica pre-posizionate (tipicamente 2-4 gate) riservate per ECO metal-only post-tapeout o pre-tapeout fix.",
      "Pre-placed logic cells (typically 2-4 gates) reserved for metal-only ECO post-tapeout or pre-tapeout fix."
    ),
    placement: loc(
      "Distribuite nel core al floorplan/placement. Regioni dedicate spare cell area.",
      "Distributed in core at floorplan/placement. Dedicated spare cell regions."
    ),
    whenUsed: loc(
      "ECO flow — fix funzionali senza re-spin completo (metal-only change).",
      "ECO flow — functional fixes without full re-spin (metal-only change)."
    ),
    technicalNotes: loc(
      [
        "Spare cells pre-connected a VDD/VSS, inputs floating",
        "ECO: metal-only route to connect spare logic",
        "Riservare 1-2% area per spare in floorplan",
      ],
      [
        "Spare cells pre-connected to VDD/VSS, inputs floating",
        "ECO: metal-only route to connect spare logic",
        "Reserve 1-2% area for spare in floorplan",
      ]
    ),
    relatedCells: ["FILLER", "BUF"],
  },
  {
    id: "nand2",
    name: loc("NAND2 — NAND a 2 ingressi", "NAND2 — 2-input NAND"),
    category: loc("Logica Combinatoria", "Combinational Logic"),
    function: loc(
      "Y = ¬(A·B). Cella combinatoria più usata dopo INV: area minima, delay basso, mapping naturale della sintesi.",
      "Y = ¬(A·B). Most-used combinational cell after INV: minimal area, low delay, natural synthesis mapping."
    ),
    placement: loc("Qualsiasi sito legale. Drive X1–X16. Varianti HVT/SVT/LVT.", "Any legal site. Drive X1–X16. HVT/SVT/LVT variants."),
    whenUsed: loc("Logica generale, De Morgan (AND via NAND+INV), datapath.", "General logic, De Morgan (AND via NAND+INV), datapath."),
    technicalNotes: loc(
      [
        "Stack NMOS in serie → rise/fall asimmetrico; sizing P/N nel .lib",
        "NAND3/NAND4 esistono ma pin-access e stack peggiorano delay",
        "FO4 delay del NAND2 è metrica di processo",
      ],
      [
        "Series NMOS stack → asymmetric rise/fall; P/N sizing in .lib",
        "NAND3/NAND4 exist but pin-access and stack worsen delay",
        "NAND2 FO4 delay is a process metric",
      ]
    ),
    relatedCells: ["NOR2", "INV", "AOI"],
  },
  {
    id: "nor2",
    name: loc("NOR2 — NOR a 2 ingressi", "NOR2 — 2-input NOR"),
    category: loc("Logica Combinatoria", "Combinational Logic"),
    function: loc(
      "Y = ¬(A+B). Dual del NAND. PMOS in serie → più lento del NAND2 a pari area (mobilità hole).",
      "Y = ¬(A+B). Dual of NAND. Series PMOS → slower than NAND2 at same area (hole mobility)."
    ),
    placement: loc("Row legale. Preferire NAND+INV se timing stretto.", "Legal row. Prefer NAND+INV if timing is tight."),
    whenUsed: loc("Control logic, reset-tree locale, mapping sintesi.", "Control logic, local reset-tree, synthesis mapping."),
    technicalNotes: loc(
      ["NOR2 più debole in pull-up: attenzione max trans su net lunghe", "NOR3 raro in timing-critical path"],
      ["NOR2 weaker on pull-up: watch max trans on long nets", "NOR3 rare on timing-critical paths"]
    ),
    relatedCells: ["NAND2", "INV", "OAI"],
  },
  {
    id: "mux2",
    name: loc("MUX2 — Multiplexer 2:1", "MUX2 — 2:1 Multiplexer"),
    category: loc("Logica Combinatoria", "Combinational Logic"),
    function: loc(
      "Y = S ? D1 : D0. Transmission-gate o AOI. Pin density alta → congestion e pin-access critici.",
      "Y = S ? D1 : D0. Transmission-gate or AOI. High pin density → congestion and pin-access critical."
    ),
    placement: loc("Evitarne cluster densi senza extra routing tracks. Halo su bus MUX.", "Avoid dense clusters without extra routing tracks. Halo on MUX buses."),
    whenUsed: loc("Datapath, scan mux (SDFF interno), clock mux (celle dedicate!).", "Datapath, scan mux (inside SDFF), clock mux (dedicated cells!)."),
    technicalNotes: loc(
      [
        "NON usare MUX2 di data path sul clock — glitch e duty distortion",
        "Clock mux: celle CLKMX / glitch-free con make-before-break",
        "MUX4 = due MUX2 o cella dedicata, peggior pin access",
      ],
      [
        "Do NOT use datapath MUX2 on clock — glitch and duty distortion",
        "Clock mux: CLKMX / glitch-free cells with make-before-break",
        "MUX4 = two MUX2 or dedicated cell, worse pin access",
      ]
    ),
    relatedCells: ["SDFF", "AOI", "CLKBUF"],
  },
  {
    id: "xor2",
    name: loc("XOR2 / XNOR2", "XOR2 / XNOR2"),
    category: loc("Logica Combinatoria", "Combinational Logic"),
    function: loc(
      "Y = A ⊕ B (XOR) o ¬(A ⊕ B) (XNOR). Datapath (adder, CRC, parity, crypto). Cella grande, molti transistor.",
      "Y = A ⊕ B (XOR) or ¬(A ⊕ B) (XNOR). Datapath (adder, CRC, parity, crypto). Large cell, many transistors."
    ),
    placement: loc("Datapath aligned (bit-slice). XOR in timing path è spesso il bottleneck.", "Datapath-aligned (bit-slice). XOR on a timing path is often the bottleneck."),
    whenUsed: loc("ALU, ECC, hash, comparator. XNOR per equality.", "ALU, ECC, hash, comparator. XNOR for equality."),
    technicalNotes: loc(
      ["Pass-transistor XOR: rischio threshold drop — preferire CMOS statico in .lib", "Half-adder = XOR + AND; full-adder ha cella FA dedicata"],
      ["Pass-transistor XOR: threshold-drop risk — prefer static CMOS in .lib", "Half-adder = XOR + AND; full-adder has a dedicated FA cell"]
    ),
    relatedCells: ["NAND2", "AOI"],
  },
  {
    id: "sdff",
    name: loc("SDFF — Scan D Flip-Flop", "SDFF — Scan D Flip-Flop"),
    category: loc("Sequential & Scan", "Sequential & Scan"),
    function: loc(
      "DFF con mux scan: SI/SE. In shift, Q segue SI. Obbligatorio per ATPG. Varianti: async set/reset, enable, scan-enable local.",
      "DFF with scan mux: SI/SE. In shift, Q follows SI. Mandatory for ATPG. Variants: async set/reset, enable, local scan-enable."
    ),
    placement: loc("Come DFF. Scan stitching post-place riordina SI→Q per wirelength.", "Like DFF. Post-place scan stitching reorders SI→Q for wirelength."),
    whenUsed: loc("Quasi tutti i FF di produzione. Coverage stuck-at/transition.", "Almost all production FFs. Stuck-at/transition coverage."),
    technicalNotes: loc(
      [
        "SE è high-fanout net — buffer tree o SE-enable locale",
        "Hold su scan path: spesso il primo hold da chiudere post-CTS",
        "Lock-up latch su dominio crossing della chain",
      ],
      [
        "SE is a high-fanout net — buffer tree or local SE enable",
        "Hold on scan path: often the first hold to close post-CTS",
        "Lock-up latch on chain domain crossings",
      ]
    ),
    relatedCells: ["DFF", "MUX2", "LATCH"],
  },
  {
    id: "latch",
    name: loc("LATCH / DLAT", "LATCH / DLAT"),
    category: loc("Sequential & Scan", "Sequential & Scan"),
    function: loc(
      "Livello-sensitive: trasparente quando EN=1. Time borrowing. Pericoloso se inferito da RTL incompleto.",
      "Level-sensitive: transparent while EN=1. Time borrowing. Dangerous if inferred from incomplete RTL."
    ),
    placement: loc("Solo dove l'architettura lo prevede (pulsed latch, lock-up). Mai da lint residual.", "Only where architecture requires it (pulsed latch, lock-up). Never from residual lint."),
    whenUsed: loc("Lock-up in scan, pulsed-latch CPU, isolation clamp-latch.", "Scan lock-up, pulsed-latch CPU, isolation clamp-latch."),
    technicalNotes: loc(
      ["STA: transparent latch apre path combinatori attraverso il latch", "Duty cycle e pulse width diventano constraint"],
      ["STA: transparent latch opens combinational paths through the latch", "Duty cycle and pulse width become constraints"]
    ),
    relatedCells: ["DFF", "SDFF"],
  },
  {
    id: "delay",
    name: loc("DLY / Delay Cell", "DLY / Delay Cell"),
    category: loc("Clock & Buffer", "Clock & Buffer"),
    function: loc(
      "Cella a ritardo calibrato (DLY1–DLY16) per hold fix. Non è un buffer di drive: Cin alta, Rout alta.",
      "Calibrated delay cell (DLY1–DLY16) for hold fix. Not a drive buffer: high Cin, high Rout."
    ),
    placement: loc("Sul data path corto (hold). Mai sul clock tree (skew incontrollato).", "On short data paths (hold). Never on the clock tree (uncontrolled skew)."),
    whenUsed: loc("Post-CTS / post-route hold ECO. Preferire buffer se serve anche drive.", "Post-CTS / post-route hold ECO. Prefer buffers if drive is also needed."),
    technicalNotes: loc(
      ["Delay vs PVT: DLY peggiora al FF — proprio il corner hold", "Troppe DLY = area e leakage; meglio useful skew se possibile"],
      ["Delay vs PVT: DLY gets worse at FF — exactly the hold corner", "Too many DLY = area and leakage; prefer useful skew if possible"]
    ),
    relatedCells: ["BUF", "CLKBUF"],
  },
  {
    id: "clkinv",
    name: loc("CLKINV — Clock Inverter", "CLKINV — Clock Inverter"),
    category: loc("Clock & Buffer", "Clock & Buffer"),
    function: loc(
      "Inverter qualified per clock: matching rise/fall, low variation. Per H-tree balanced e clock inversion intenzionale.",
      "Clock-qualified inverter: matched rise/fall, low variation. For balanced H-trees and intentional clock inversion."
    ),
    placement: loc("Solo clock net (CTS). Non usare INV di data path sul clock.", "Clock nets only (CTS). Do not use datapath INV on clock."),
    whenUsed: loc("CTS inversion, mesh spine, local clock inversion per useful skew.", "CTS inversion, mesh spine, local clock inversion for useful skew."),
    technicalNotes: loc(
      ["Duty cycle: rise≠fall accumula distortion lungo il tree", "Liberty clock_gating_integrated / clock cell group"],
      ["Duty cycle: rise≠fall accumulates distortion along the tree", "Liberty clock_gating_integrated / clock cell group"]
    ),
    relatedCells: ["CLKBUF", "INV", "ICG"],
  },
  {
    id: "diode",
    name: loc("DIODE — Antenna Diode", "DIODE — Antenna Diode"),
    category: loc("Filler & Physical", "Filler & Physical"),
    function: loc(
      "Diodo di scarica verso substrate/well. Identico scopo all'antenna cell; naming PDK-specific (ANTENNA vs DIODE).",
      "Discharge diode to substrate/well. Same purpose as antenna cell; PDK-specific naming (ANTENNA vs DIODE)."
    ),
    placement: loc("Vicino al gate pin della vittima. Inserito da antenna repair.", "Near the victim gate pin. Inserted by antenna repair."),
    whenUsed: loc("Violazioni antenna post-route.", "Post-route antenna violations."),
    technicalNotes: loc(
      ["Non confondere con ESD diode degli IO (scala diversa)", "Area diodo vs AR_max nel DRM"],
      ["Do not confuse with IO ESD diodes (different scale)", "Diode area vs AR_max in the DRM"]
    ),
    relatedCells: ["ANTENNA"],
  },
  {
    id: "welltap",
    name: loc("WELLTAP — Well Tap dedicato", "WELLTAP — Dedicated Well Tap"),
    category: loc("Power & Ground", "Power & Ground"),
    function: loc(
      "Variante TAP con well/substrate pick-up dimensionato per distanza max DRM. A volte distinto da TAPCELL nel LEF.",
      "TAP variant with well/substrate pick-up sized for DRM max distance. Sometimes distinct from TAPCELL in LEF."
    ),
    placement: loc("Griglia regolare (es. ogni 30–60 µm). Checkerboard N-well / P-sub.", "Regular grid (e.g. every 30–60 µm). Checkerboard N-well / P-sub."),
    whenUsed: loc("Latch-up prevention. Obbligatorio, non opzionale.", "Latch-up prevention. Mandatory, not optional."),
    technicalNotes: loc(
      ["Distanza max è regola DRC — tap missing = ERC/DRC fail", "In FinFET il tap pitch è nel DRM del nodo"],
      ["Max distance is a DRC rule — missing tap = ERC/DRC fail", "In FinFET, tap pitch is in the node DRM"]
    ),
    relatedCells: ["TAP", "ENDCAP"],
  },
  {
    id: "fa",
    name: loc("FA / HA — Full / Half Adder", "FA / HA — Full / Half Adder"),
    category: loc("Logica Combinatoria", "Combinational Logic"),
    function: loc(
      "Cella datapath: HA = SUM+COUT da 2 bit; FA da 3 bit (A,B,CIN). Mapping diretto in adder/CLA.",
      "Datapath cell: HA = SUM+COUT from 2 bits; FA from 3 bits (A,B,CIN). Direct mapping in adder/CLA."
    ),
    placement: loc("Bit-slice alignment verticale/orizzontale per carry chain corta.", "Bit-slice alignment vertical/horizontal for a short carry chain."),
    whenUsed: loc("ALU, address gen, popcount. Critico per timing dell'adder.", "ALU, address gen, popcount. Critical for adder timing."),
    technicalNotes: loc(
      ["Carry chain è spesso il WNS del core", "Brent-Kung/Sklansky usano AOI/OAI più che FA atomici"],
      ["Carry chain is often the core WNS", "Brent-Kung/Sklansky use AOI/OAI more than atomic FA"]
    ),
    relatedCells: ["XOR2", "AOI", "NAND2"],
  },
  {
    id: "clkmux",
    name: loc("CLKMUX — Glitch-free Clock Mux", "CLKMUX — Glitch-free Clock Mux"),
    category: loc("Clock & Buffer", "Clock & Buffer"),
    function: loc(
      "Mux clock con sincronizzazione select (make-before-break / synchronizer). Evita glitch di un MUX2 datapath.",
      "Clock mux with synchronized select (make-before-break / synchronizer). Avoids datapath MUX2 glitches."
    ),
    placement: loc("Vicino alla clock source / PLL. NDR sul net di uscita.", "Near clock source / PLL. NDR on the output net."),
    whenUsed: loc("Clock switching runtime, scan vs functional clock, DFT mux.", "Runtime clock switching, scan vs functional clock, DFT mux."),
    technicalNotes: loc(
      ["STA: generated clock per ogni input del mux", "Glitch durante switch = functional fail — cella dedicata obbligatoria"],
      ["STA: generated clock per mux input", "Glitch during switch = functional fail — dedicated cell mandatory"]
    ),
    relatedCells: ["MUX2", "CLKBUF", "ICG"],
  },
];
