import { loc, type Localized } from "@/i18n/context";
import type { StageId } from "./stages";

export interface StageFormula {
  label: Localized;
  latex: string;
  explanation: Localized;
}

export const stageFormulas: Record<StageId, StageFormula[]> = {
  rtl: [
    {
      label: loc("Elmore Delay (RC tree)", "Elmore Delay (RC tree)"),
      latex: "\\tau = \\sum_{i} R_i \\cdot C_i",
      explanation: loc(
        "Somma dei prodotti resistenza×capacità lungo il percorso dal driver al sink. Stima conservativa del delay prima del layout fisico.",
        "Sum of resistance×capacitance products along the path from driver to sink. Conservative delay estimate before physical layout."
      ),
    },
    {
      label: loc("Potenza dinamica", "Dynamic power"),
      latex: "P_{dyn} = \\alpha \\cdot C_L \\cdot V_{DD}^2 \\cdot f",
      explanation: loc(
        "α = activity factor (toggle rate). Decisioni RTL su width e clock gating impattano direttamente P_dyn.",
        "α = activity factor (toggle rate). RTL decisions on width and clock gating directly impact P_dyn."
      ),
    },
  ],
  verification: [
    {
      label: loc("MTBF Sincronizzatore 2-FF", "2-FF Synchronizer MTBF"),
      latex: "MTBF = \\frac{e^{t_r/\\tau}}{f_{clk} \\cdot f_{data} \\cdot T_0}",
      explanation: loc(
        "t_r = resolution time, τ = costante di metastabilità, f_clk e f_data = frequenze di toggle. MTBF deve superare la vita del prodotto.",
        "t_r = resolution time, τ = metastability time constant, f_clk and f_data = toggle rates. MTBF must exceed product lifetime."
      ),
    },
    {
      label: loc("Coverage Functionale", "Functional coverage"),
      latex: "Coverage = \\frac{|\\text{hit bins}|}{|\\text{target bins}|} \\times 100\\%",
      explanation: loc(
        "Misura quanto lo spazio di stato del design è stato esercitato dai test. Target tipico: 95–100% per signoff.",
        "Measures how much of the design state space was exercised by tests. Typical target: 95–100% for signoff."
      ),
    },
  ],
  synthesis: [
    {
      label: loc("Setup Timing Constraint", "Setup Timing Constraint"),
      latex: "T_{clk} - T_{data} \\geq T_{setup} + T_{skew} + T_{uncertainty}",
      explanation: loc(
        "Il dato deve arrivare al FF prima del clock edge meno il setup time. Violazione = path troppo lento.",
        "Data must arrive at FF before clock edge minus setup time. Violation = path too slow."
      ),
    },
    {
      label: loc("Hold Timing Constraint", "Hold Timing Constraint"),
      latex: "T_{data} - T_{clk} \\geq T_{hold} - T_{skew} + T_{uncertainty}",
      explanation: loc(
        "Il dato deve rimanere stabile dopo il clock edge. Violazione = race condition (path troppo veloce).",
        "Data must remain stable after clock edge. Violation = race condition (path too fast)."
      ),
    },
    {
      label: loc("Slack Setup", "Setup Slack"),
      latex: "Slack_{setup} = T_{clk} - T_{data} - T_{setup} - T_{uncertainty}",
      explanation: loc(
        "Slack ≥ 0 richiesto per signoff. WNS = Worst Negative Slack, TNS = Total Negative Slack.",
        "Slack ≥ 0 required for signoff. WNS = Worst Negative Slack, TNS = Total Negative Slack."
      ),
    },
  ],
  floorplan: [
    {
      label: loc("Core Utilization", "Core Utilization"),
      latex: "U_{core} = \\frac{A_{std\\ cells} + A_{macros}}{A_{core}}",
      explanation: loc(
        "Target industriale 60–80%. Troppo alto → congestion irrecuperabile; troppo basso → spreco di area die.",
        "Industrial target 60–80%. Too high → irrecoverable congestion; too low → wasted die area."
      ),
    },
    {
      label: loc("Aspect Ratio", "Aspect Ratio"),
      latex: "AR = \\frac{W_{core}}{H_{core}}",
      explanation: loc(
        "AR ≈ 1 preferito per routing uniforme. AR estremi penalizzano clock spine o power mesh.",
        "AR ≈ 1 preferred for uniform routing. Extreme AR penalizes clock spine or power mesh."
      ),
    },
  ],
  pdn: [
    {
      label: loc("IR Drop Statico", "Static IR Drop"),
      latex: "V_{drop} = I_{avg} \\cdot R_{path}",
      explanation: loc(
        "R_path = resistenza cumulativa dal bump/pad alla cella lungo la PDN. Limite: < 5% VDD.",
        "R_path = cumulative resistance from bump/pad to cell along PDN. Limit: < 5% VDD."
      ),
    },
    {
      label: loc("Dynamic Voltage Droop", "Dynamic Voltage Droop"),
      latex: "\\Delta V = L \\cdot \\frac{dI}{dt} + \\frac{I \\cdot \\Delta t}{C_{decap}}",
      explanation: loc(
        "Primo termine: induttanza package/on-die. Secondo: capacità di decoupling. Limite: < 10% VDD.",
        "First term: package/on-die inductance. Second: decoupling capacitance. Limit: < 10% VDD."
      ),
    },
    {
      label: loc("Black's Equation (EM)", "Black's Equation (EM)"),
      latex: "MTTF = A \\cdot J^{-n} \\cdot \\exp\\left(\\frac{E_a}{kT}\\right)",
      explanation: loc(
        "J = current density, n ≈ 2, E_a = activation energy. MTTF deve superare 10 anni @ T_max.",
        "J = current density, n ≈ 2, E_a = activation energy. MTTF must exceed 10 years @ T_max."
      ),
    },
  ],
  placement: [
    {
      label: loc("HPWL Wirelength", "HPWL Wirelength"),
      latex: "HPWL = (\\max_x - \\min_x) + (\\max_y - \\min_y)",
      explanation: loc(
        "Half-Perimeter Wire Length: stima rapida della lunghezza wire di una net. Metrica di costo del global placement.",
        "Half-Perimeter Wire Length: fast wirelength estimate for a net. Global placement cost metric."
      ),
    },
    {
      label: loc("Placement Density", "Placement Density"),
      latex: "\\rho_{bin} = \\frac{N_{cells} \\cdot A_{cell}}{A_{bin}}",
      explanation: loc(
        "Densità per bin nel global placement. Target ~80% per bin; >90% causa congestion locale.",
        "Density per bin in global placement. Target ~80% per bin; >90% causes local congestion."
      ),
    },
  ],
  cts: [
    {
      label: loc("Clock Skew", "Clock Skew"),
      latex: "Skew = \\max(T_{clk,i}) - \\min(T_{clk,i})",
      explanation: loc(
        "Differenza max-min di clock arrival time tra tutti i sink. Target: ±50ps consumer, ±20ps HPC.",
        "Max-min difference of clock arrival time across all sinks. Target: ±50ps consumer, ±20ps HPC."
      ),
    },
    {
      label: loc("Clock Latency", "Clock Latency"),
      latex: "Latency = T_{clk,sink} - T_{clk,root}",
      explanation: loc(
        "Ritardo totale dal root clock al sink. Impatta OCV derating e useful skew budget.",
        "Total delay from clock root to sink. Impacts OCV derating and useful skew budget."
      ),
    },
  ],
  routing: [
    {
      label: loc("Antenna Ratio", "Antenna Ratio"),
      latex: "R_{ant} = \\frac{A_{metal,connected}}{A_{gate}}",
      explanation: loc(
        "Area metallica connessa al gate durante etch plasma / area gate. Deve essere < limite foundry per layer.",
        "Metal area connected to gate during plasma etch / gate area. Must be < foundry limit per layer."
      ),
    },
    {
      label: loc("RC Wire Delay", "RC Wire Delay"),
      latex: "t_{wire} = 0.69 \\cdot R_{wire} \\cdot C_{wire}",
      explanation: loc(
        "Delay di un segmento RC. Routing su layer alti (meno R) o wire wider riduce t_wire.",
        "Delay of an RC segment. Routing on upper layers (less R) or wider wires reduces t_wire."
      ),
    },
  ],
  layout: [
    {
      label: loc("Metal Density", "Metal Density"),
      latex: "\\rho_{layer} = \\frac{A_{metal}}{A_{window}}",
      explanation: loc(
        "Densità metallica in finestra di analisi. Deve rispettare ρ_min ≤ ρ ≤ ρ_max per CMP uniforme.",
        "Metal density in analysis window. Must satisfy ρ_min ≤ ρ ≤ ρ_max for uniform CMP."
      ),
    },
  ],
  sta: [
    {
      label: loc("Setup Slack", "Setup Slack"),
      latex: "Slack_{setup} = T_{clk} - T_{data} - T_{setup} - T_{uncertainty}",
      explanation: loc(
        "Analizzato al corner lento (SS, low V, high T). WNS ≥ 0 e TNS = 0 richiesti per signoff.",
        "Analyzed at slow corner (SS, low V, high T). WNS ≥ 0 and TNS = 0 required for signoff."
      ),
    },
    {
      label: loc("Hold Slack", "Hold Slack"),
      latex: "Slack_{hold} = T_{data} - T_{clk} - T_{hold} + T_{uncertainty}",
      explanation: loc(
        "Analizzato al corner veloce (FF, high V, low T). Hold violations post-CTS sono comuni.",
        "Analyzed at fast corner (FF, high V, low T). Hold violations post-CTS are common."
      ),
    },
    {
      label: loc("Crosstalk Delta Delay", "Crosstalk Delta Delay"),
      latex: "\\Delta t = k \\cdot \\frac{C_{coupling}}{C_{total}} \\cdot V_{aggressor}",
      explanation: loc(
        "Ritardo aggiuntivo su victim net causato da aggressor switching. Fix: spacing, shielding, NDR.",
        "Additional delay on victim net caused by aggressor switching. Fix: spacing, shielding, NDR."
      ),
    },
  ],
  pv: [
    {
      label: loc("Antenna Ratio (PV)", "Antenna Ratio (PV)"),
      latex: "R_{ant,i} = \\frac{\\sum_{j=1}^{i} A_{M_j}}{A_{gate}} < R_{max,i}",
      explanation: loc(
        "Somma cumulativa area metal per layer fino al gate. Calibre verifica per ogni net/layer.",
        "Cumulative metal area sum per layer up to gate. Calibre verifies per net/layer."
      ),
    },
    {
      label: loc("Minimum Width Rule", "Minimum Width Rule"),
      latex: "W_{metal} \\geq W_{min,layer}",
      explanation: loc(
        "Regola DRC fondamentale: ogni segmento metallico deve rispettare larghezza minima del processo.",
        "Fundamental DRC rule: every metal segment must meet process minimum width."
      ),
    },
  ],
  power: [
    {
      label: loc("Static IR Drop", "Static IR Drop"),
      latex: "V_{drop,static} = I_{DC} \\cdot R_{PDN}",
      explanation: loc(
        "Analisi DC con corrente media. RedHawk/Voltus risolvono la rete RC della PDN.",
        "DC analysis with average current. RedHawk/Voltus solve the PDN RC network."
      ),
    },
    {
      label: loc("Decap Effectiveness", "Decap Effectiveness"),
      latex: "\\Delta V = \\frac{I_{peak} \\cdot \\Delta t}{C_{on-chip} + C_{decap}}",
      explanation: loc(
        "Decap cells aumentano C_on-chip riducendo droop dinamico. Placement vicino a high-activity blocks.",
        "Decap cells increase C_on-chip reducing dynamic droop. Place near high-activity blocks."
      ),
    },
    {
      label: loc("Current Density (EM)", "Current Density (EM)"),
      latex: "J = \\frac{I_{avg}}{W_{metal} \\cdot t_{metal}} \\leq J_{max}",
      explanation: loc(
        "Corrente media per unità di sezione trasversale. Violazione → widen strap o parallel wires.",
        "Average current per cross-sectional area. Violation → widen strap or parallel wires."
      ),
    },
  ],
  package: [
    {
      label: loc("Package Inductance", "Package Inductance"),
      latex: "V_{bounce} = L_{pkg} \\cdot \\frac{dI_{IO}}{dt}",
      explanation: loc(
        "Ground bounce e SSO causati da induttanza package. Co-design chip-package mitiga il problema.",
        "Ground bounce and SSO caused by package inductance. Chip-package co-design mitigates this."
      ),
    },
  ],
  tapeout: [
    {
      label: loc("GDSII Hierarchy", "GDSII Hierarchy"),
      latex: "|GDS| = \\sum_{layers} |polygons_{layer}| + |references|",
      explanation: loc(
        "SoC moderni: 50–500 GB GDS, trilioni di poligoni, 60–100 mask layers. OASIS più compatto.",
        "Modern SoCs: 50–500 GB GDS, trillions of polygons, 60–100 mask layers. OASIS more compact."
      ),
    },
  ],
};

export interface InterviewQuestion {
  question: Localized;
  answer: Localized;
}

export const stageInterview: Record<StageId, InterviewQuestion[]> = {
  rtl: [
    {
      question: loc(
        "Perché un latch inferito è pericoloso in un flusso ASIC?",
        "Why is an inferred latch dangerous in an ASIC flow?"
      ),
      answer: loc(
        "Il latch crea un percorso asincrono non intenzionale che la sintesi tratta diversamente dalla simulazione RTL. Causa mismatch LEC, timing imprevedibile e failure in silicon. Fix: complete assignments in always_comb, default assignment.",
        "The latch creates an unintentional asynchronous path that synthesis treats differently from RTL simulation. Causes LEC mismatch, unpredictable timing, and silicon failure. Fix: complete assignments in always_comb, default assignment."
      ),
    },
    {
      question: loc(
        "Come impatta il clock gating a livello RTL sul PD downstream?",
        "How does RTL-level clock gating impact downstream PD?"
      ),
      answer: loc(
        "ICG cells inserite in sintesi/CTS. Riduce power ma aggiunge enable timing paths e complessità CTS. UPF definisce quali domini possono essere gated.",
        "ICG cells inserted in synthesis/CTS. Reduces power but adds enable timing paths and CTS complexity. UPF defines which domains can be gated."
      ),
    },
  ],
  verification: [
    {
      question: loc(
        "Quando il formal verification è preferibile alla simulazione?",
        "When is formal verification preferred over simulation?"
      ),
      answer: loc(
        "Proprietà su TUTTI gli input legali: protocolli (AXI handshake), arbitri one-hot, FSM safety. Simulazione campiona; formal prova o confuta completamente (se decidibile).",
        "Properties over ALL legal inputs: protocols (AXI handshake), one-hot arbiters, FSM safety. Simulation samples; formal proves or disproves completely (if decidable)."
      ),
    },
    {
      question: loc(
        "Spiega MTBF di un sincronizzatore 2-FF.",
        "Explain MTBF of a 2-FF synchronizer."
      ),
      answer: loc(
        "Metastabilità: primo FF può essere meta-stable; secondo FF risolve se t_r > τ. MTBF cresce esponenzialmente con t_r. Per multi-bit: usare async FIFO con gray pointer, non 2-FF parallelo.",
        "Metastability: first FF may be meta-stable; second FF resolves if t_r > τ. MTBF grows exponentially with t_r. For multi-bit: use async FIFO with gray pointer, not parallel 2-FF."
      ),
    },
  ],
  synthesis: [
    {
      question: loc(
        "Differenza tra WNS e TNS?",
        "Difference between WNS and TNS?"
      ),
      answer: loc(
        "WNS = Worst Negative Slack (path più critico). TNS = somma di tutti gli slack negativi. WNS=0 non basta se TNS<0 — ci sono multiple violations.",
        "WNS = Worst Negative Slack (most critical path). TNS = sum of all negative slacks. WNS=0 insufficient if TNS<0 — multiple violations exist."
      ),
    },
    {
      question: loc(
        "Perché LEC è obbligatorio post-sintesi?",
        "Why is LEC mandatory post-synthesis?"
      ),
      answer: loc(
        "La sintesi applica ottimizzazioni (retiming, restructuring) che possono introdurre bug. LEC prova equivalenza formale RTL↔netlist. Qualsiasi fail blocca handoff al PD.",
        "Synthesis applies optimizations (retiming, restructuring) that can introduce bugs. LEC formally proves RTL↔netlist equivalence. Any fail blocks PD handoff."
      ),
    },
  ],
  floorplan: [
    {
      question: loc(
        "Perché il floorplan è la fase più critica del PD?",
        "Why is floorplan the most critical PD phase?"
      ),
      answer: loc(
        "70% del successo PD si decide qui: macro placement fissa wirelength, congestion, IR drop paths. Un cattivo floorplan non è fixabile con ECO — richiede re-spin o accettazione PPA degradata.",
        "70% of PD success is decided here: macro placement fixes wirelength, congestion, IR drop paths. Bad floorplan unfixable by ECO — requires re-spin or degraded PPA acceptance."
      ),
    },
    {
      question: loc(
        "Cos'è il Floorplan Exit e cosa verifica?",
        "What is Floorplan Exit and what does it verify?"
      ),
      answer: loc(
        "Milestone interna: macro FIXED, IO placed, PG skeleton connected, legality clean, voltage islands mapped, congestion reviewed. Gate prima del placement.",
        "Internal milestone: macros FIXED, IO placed, PG skeleton connected, legality clean, voltage islands mapped, congestion reviewed. Gate before placement."
      ),
    },
  ],
  pdn: [
    {
      question: loc(
        "Primary PG vs Secondary PG — differenza?",
        "Primary PG vs Secondary PG — difference?"
      ),
      answer: loc(
        "Primary: always-on backbone (VDD/VSS globali). Secondary: domain-specific (VDD_SW switched, VDD_RET retention, VDD_AON islands). Secondary alimentata via power switches dalla primary.",
        "Primary: always-on backbone (global VDD/VSS). Secondary: domain-specific (VDD_SW switched, VDD_RET retention, VDD_AON islands). Secondary fed via power switches from primary."
      ),
    },
    {
      question: loc(
        "Header vs Footer power switch?",
        "Header vs Footer power switch?"
      ),
      answer: loc(
        "Header (PMOS): tra VDD e VDD_SW — standard industriale, migliore noise immunity. Footer (NMOS): virtual ground — ground bounce risk. Header preferito salvo constraint specifici.",
        "Header (PMOS): between VDD and VDD_SW — industry standard, better noise immunity. Footer (NMOS): virtual ground — ground bounce risk. Header preferred unless specific constraints."
      ),
    },
  ],
  placement: [
    {
      question: loc(
        "Cos'è il PRO Exit nel placement?",
        "What is PRO Exit in placement?"
      ),
      answer: loc(
        "Placement Route Optimization Exit: gate interno che certifica placement legal, pre-CTS timing accettabile (WNS ≥ -0.1ns), congestion <5%, density uniforme. Sblocca CTS.",
        "Placement Route Optimization Exit: internal gate certifying legal placement, acceptable pre-CTS timing (WNS ≥ -0.1ns), congestion <5%, uniform density. Unlocks CTS."
      ),
    },
    {
      question: loc(
        "A cosa servono tap cells e endcap cells?",
        "What are tap cells and endcap cells for?"
      ),
      answer: loc(
        "Tap: connessione substrate/N-well ogni N siti — previene latch-up, richiesto da DRC. Endcap: terminano le row — definiscono confine, prevengono DRC edge effects. Entrambi obbligatori.",
        "Tap: substrate/N-well connection every N sites — prevents latch-up, DRC required. Endcap: terminate rows — define boundary, prevent DRC edge effects. Both mandatory."
      ),
    },
  ],
  cts: [
    {
      question: loc(
        "Clock tree vs Clock mesh — trade-off?",
        "Clock tree vs Clock mesh — trade-off?"
      ),
      answer: loc(
        "Tree: basso power, area contenuta, skew ±50ps, OCV 20-25%. Mesh: skew <15ps, OCV ~5%, ma 2-3× power e area metal. Mesh per CPU/GPU multi-GHz.",
        "Tree: low power, compact area, skew ±50ps, OCV 20-25%. Mesh: skew <15ps, OCV ~5%, but 2-3× power and metal area. Mesh for multi-GHz CPU/GPU."
      ),
    },
    {
      question: loc(
        "Perché emergono hold violations post-CTS?",
        "Why do hold violations emerge post-CTS?"
      ),
      answer: loc(
        "CTS aggiunge clock delay ai sink. Data path invariato ma clock arrival cambia → hold slack ridotto. Fix: delay cells, buffer insertion, useful skew adjustment.",
        "CTS adds clock delay to sinks. Data path unchanged but clock arrival changes → reduced hold slack. Fix: delay cells, buffer insertion, useful skew adjustment."
      ),
    },
  ],
  routing: [
    {
      question: loc(
        "Spiega l'antenna effect e come si fixa.",
        "Explain antenna effect and how to fix it."
      ),
      answer: loc(
        "Durante plasma etch, wire lunghi non connessi accumulano carica che danneggia gate oxide. Ratio A_metal/A_gate > limit. Fix: diode antenna, metal jumper a layer superiore, via connection.",
        "During plasma etch, long unconnected wires accumulate charge damaging gate oxide. Ratio A_metal/A_gate > limit. Fix: antenna diode, metal jumper to upper layer, via connection."
      ),
    },
    {
      question: loc(
        "Cos'è NDR e quando si usa?",
        "What is NDR and when is it used?"
      ),
      answer: loc(
        "Non-Default Rules: wire più larghi, double spacing, shielding con VSS/VDD. Per clock nets, reset, critical bus. Riduce crosstalk e EM ma consuma più routing resource.",
        "Non-Default Rules: wider wires, double spacing, VSS/VDD shielding. For clock nets, reset, critical bus. Reduces crosstalk and EM but consumes more routing resource."
      ),
    },
  ],
  layout: [
    {
      question: loc(
        "Perché serve metal fill?",
        "Why is metal fill needed?"
      ),
      answer: loc(
        "CMP (Chemical Mechanical Polishing) richiede densità metallica uniforme. Senza fill: dishing (area sparse) o erosion (area dense). Fill dummy soddisfa ρ_min ≤ ρ ≤ ρ_max.",
        "CMP requires uniform metal density. Without fill: dishing (sparse areas) or erosion (dense areas). Dummy fill satisfies ρ_min ≤ ρ ≤ ρ_max."
      ),
    },
  ],
  sta: [
    {
      question: loc(
        "Setup vs Hold — corner di analisi?",
        "Setup vs Hold — analysis corners?"
      ),
      answer: loc(
        "Setup al corner lento (SS, low V, high T): path deve essere abbastanza veloce. Hold al corner veloce (FF, high V, low T): path non deve essere troppo veloce.",
        "Setup at slow corner (SS, low V, high T): path must be fast enough. Hold at fast corner (FF, high V, low T): path must not be too fast."
      ),
    },
    {
      question: loc(
        "Cos'è CPPR e perché importa?",
        "What is CPPR and why does it matter?"
      ),
      answer: loc(
        "Clock Path Pessimism Removal: rimuove doppio conteggio OCV su common clock path. Riduce pessimismo setup su path same-domain. PrimeTime lo applica automaticamente.",
        "Clock Path Pessimism Removal: removes double-counting OCV on common clock path. Reduces setup pessimism on same-domain paths. PrimeTime applies automatically."
      ),
    },
  ],
  pv: [
    {
      question: loc(
        "DRC vs LVS — cosa verificano?",
        "DRC vs LVS — what do they verify?"
      ),
      answer: loc(
        "DRC: regole geometriche manufacturing (width, spacing, density). LVS: correttezza circuitale — layout estratto ≡ netlist sorgente (device count, connectivity).",
        "DRC: manufacturing geometric rules (width, spacing, density). LVS: circuit correctness — extracted layout ≡ source netlist (device count, connectivity)."
      ),
    },
    {
      question: loc(
        "Perché DRC va runnato su GDS merged?",
        "Why must DRC run on merged GDS?"
      ),
      answer: loc(
        "Intermediate DB non include fill, seal ring, IO cells. Violations su merged GDS possono differire. Signoff Calibre usa GDS finale mergeato.",
        "Intermediate DB lacks fill, seal ring, IO cells. Violations on merged GDS may differ. Signoff Calibre uses final merged GDS."
      ),
    },
  ],
  power: [
    {
      question: loc(
        "Static vs Dynamic IR drop?",
        "Static vs Dynamic IR drop?"
      ),
      answer: loc(
        "Static: I_avg × R, analisi DC. Dynamic: transient con VCD, cattura dI/dt e surge. Dynamic è più critico per timing (effective VDD drop durante switching).",
        "Static: I_avg × R, DC analysis. Dynamic: transient with VCD, captures dI/dt and surge. Dynamic more critical for timing (effective VDD drop during switching)."
      ),
    },
    {
      question: loc(
        "Power EM vs Signal EM?",
        "Power EM vs Signal EM?"
      ),
      answer: loc(
        "Power EM: J_avg su VDD/VSS straps (DC). Signal EM: J_RMS e J_peak su clock/bus (AC/repetitive). Regole e limiti diversi per layer e net type.",
        "Power EM: J_avg on VDD/VSS straps (DC). Signal EM: J_RMS and J_peak on clock/bus (AC/repetitive). Different rules and limits per layer and net type."
      ),
    },
  ],
  package: [
    {
      question: loc(
        "Wire-bond vs Flip-chip?",
        "Wire-bond vs Flip-chip?"
      ),
      answer: loc(
        "Wire-bond: pad periferici, fili dorati, <500 IO, costo basso. Flip-chip: bump array area-I/O, >1000 IO, minore inductance, richiede RDL e package co-design.",
        "Wire-bond: peripheral pads, gold wires, <500 IO, lower cost. Flip-chip: area-I/O bump array, >1000 IO, lower inductance, requires RDL and package co-design."
      ),
    },
  ],
  tapeout: [
    {
      question: loc(
        "BTO vs MTO — perché separati?",
        "BTO vs MTO — why separated?"
      ),
      answer: loc(
        "BTO congela FEOL (transistor layers) → mask FEOL in fab mentre BEOL design continua. MTO finalizza metalli/vias. Parallelizza il flow riducendo time-to-silicon.",
        "BTO freezes FEOL (transistor layers) → FEOL masks to fab while BEOL design continues. MTO finalizes metals/vias. Parallelizes flow reducing time-to-silicon."
      ),
    },
    {
      question: loc(
        "Cos'è GKC e chi partecipa?",
        "What is GKC and who participates?"
      ),
      answer: loc(
        "Gate Keeper Check: review multi-disciplinare pre-tapeout. Partecipano FE, PD, PV, STA, DFT, LP, Package. Ogni team firma il proprio dominio. Un veto blocca tapeout.",
        "Gate Keeper Check: multi-disciplinary pre-tapeout review. FE, PD, PV, STA, DFT, LP, Package participate. Each team signs their domain. One veto blocks tapeout."
      ),
    },
  ],
};
