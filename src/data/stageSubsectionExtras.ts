import { loc, type Localized } from "@/i18n/context";
import type { StageId } from "./stages";

export interface SubSectionExtra {
  title: Localized;
  content: Localized;
  bullets?: Localized[];
}

/** Additional subsections merged after base stage.subsections in StageSection. */
export const stageSubsectionExtras: Record<StageId, SubSectionExtra[]> = {
  rtl: [
    {
      title: loc("FO4 budget e pipeline depth", "FO4 budget and pipeline depth"),
      content: loc(
        "Il delay di una porta logica si misura in unità FO4 (Fan-Out of 4): il ritardo di un inverter che guida quattro carichi FO4-equivalenti. A 7 nm SS@0.75 V, t_FO4 ≈ 10–14 ps; a 5 nm può scendere a 8–10 ps. Il periodo di clock Tclk = 1/f. Dopo overhead di clock tree (~150–200 ps a 1 GHz), margini OCV/AOCV (~5–10%), e setup del FF (~30–50 ps), restano tipicamente 40–60 FO4 di logica combinatoria per ciclo. Un moltiplicatore 64×64 non pipeline può richiedere 80+ FO4: il PD non può comprimere matematica con effort. La decisione è architetturale a RTL.",
        "Logic delay is measured in FO4 units (Fan-Out of 4): the delay of an inverter driving four FO4-equivalent loads. At 7 nm SS@0.75 V, t_FO4 ≈ 10–14 ps; at 5 nm it may drop to 8–10 ps. Clock period Tclk = 1/f. After clock-tree overhead (~150–200 ps at 1 GHz), OCV/AOCV margins (~5–10%), and FF setup (~30–50 ps), typically 40–60 FO4 of combinational logic remain per cycle. An unpipelined 64×64 multiplier may need 80+ FO4: PD cannot compress math with effort. The decision is architectural at RTL."
      ),
      bullets: [
        loc("Calcola FO4 budget per macro-block prima del freeze", "Compute FO4 budget per macro-block before freeze"),
        loc("Pipeline depth vs frequenza: trade-off esplicito in MAS", "Pipeline depth vs frequency: explicit trade-off in MAS"),
        loc("Critical path report pre-synth come sanity check", "Pre-synth critical path report as sanity check"),
        loc("Retime solo con LEC e arch approval", "Retiming only with LEC and architecture approval"),
      ],
    },
    {
      title: loc("UPF e power intent a RTL", "UPF and power intent at RTL"),
      content: loc(
        "IEEE 1801 (UPF) descrive domini di alimentazione, isolation cells, level shifters, retention registers, power switches e sequenze di power-on/off. Ogni crossing tra domini a tensione diversa richiede LS; tra domini spenti e accesi richiede ISO. Le retention FF mantengono stato durante sleep; le SRAM hanno celle retention dedicate — non sono intercambiabili. CLP (Conformal Low Power) verifica che netlist e UPF corrispondano. Se il PD inserisce LS manualmente in Innovus, LEC e UPF divergono e il GKC LP veta il tapeout.",
        "IEEE 1801 (UPF) describes power domains, isolation cells, level shifters, retention registers, power switches, and power-on/off sequences. Every crossing between different voltage domains needs an LS; between powered-off and powered-on domains needs ISO. Retention FFs hold state during sleep; SRAMs have dedicated retention cells — they are not interchangeable. CLP verifies netlist↔UPF correspondence. If PD hand-inserts LS in Innovus, LEC and UPF diverge and GKC LP vetoes tapeout."
      ),
      bullets: [
        loc("create_power_domain / set_isolation / map_isolation_cell", "create_power_domain / set_isolation / map_isolation_cell"),
        loc("Retention strategy documentata per ogni SRAM e FF critico", "Retention strategy documented for every SRAM and critical FF"),
        loc("Power-switch enable sequence in UPF state transitions", "Power-switch enable sequence in UPF state transitions"),
        loc("CLP clean prima del handoff PD", "CLP clean before PD handoff"),
      ],
    },
    {
      title: loc("Interfacce bus e handshake", "Bus interfaces and handshakes"),
      content: loc(
        "AXI4, AHB, APB, TileLink, CHI: ogni protocollo ha regole di valid/ready, burst, outstanding transactions. Un'interfaccia da 512 bit tra due blocchi fisicamente lontani è un disastro di routing e di timing: si negozia il floorplan a RTL. I parametri WIDTH, ID_WIDTH, USER_WIDTH impattano area e pin count. Per PD, ogni bus è un ratsnest: più bit = più flyline = più congestione M3–M5. Black box IP con timing sui pin è un contratto: se il .lib mente, il chip non chiude.",
        "AXI4, AHB, APB, TileLink, CHI: each protocol has valid/ready rules, bursts, outstanding transactions. A 512-bit interface between two physically distant blocks is a routing and timing disaster: negotiate floorplan at RTL. WIDTH, ID_WIDTH, USER_WIDTH parameters impact area and pin count. For PD, every bus is a ratsnest: more bits = more flylines = more M3–M5 congestion. Black-box IP with pin timing is a contract: if the .lib lies, the chip will not close."
      ),
      bullets: [
        loc("Documentare bandwidth requirement per interfaccia critica", "Document bandwidth requirement per critical interface"),
        loc("Outstanding transaction depth vs buffer area", "Outstanding transaction depth vs buffer area"),
        loc("Clock domain per interfaccia o CDC esplicito", "Clock domain per interface or explicit CDC"),
        loc("Abstract LEF per IP incompleti con pin timing realistici", "Abstract LEF for incomplete IP with realistic pin timing"),
      ],
    },
    {
      title: loc("DFT hooks e scan readiness", "DFT hooks and scan readiness"),
      content: loc(
        "Scan non si aggiunge in P&R: è un'operazione di DFT Compiler / Tessent durante la sintesi. Ogni FF deve essere scan-able (SDFF), con lock-up cell sui crossing di scan chain tra clock domain diversi. OCC (On-Chip Clock Controller) per at-speed test. MBIST wrapper su ogni SRAM. Compression (XOR/MISR) per ridurre pin count. Occupazione tipica: +5–12% area, + hold paths post-CTS. IEEE 1149.1 JTAG su TCK/TMS/TDI/TDO per boundary scan e accesso interno.",
        "Scan is not added in P&R: it is a DFT Compiler / Tessent step during synthesis. Every FF must be scan-able (SDFF), with lock-up cells on scan-chain crossings between different clock domains. OCC for at-speed test. MBIST wrapper on every SRAM. Compression (XOR/MISR) to reduce pin count. Typical overhead: +5–12% area, plus hold paths post-CTS. IEEE 1149.1 JTAG on TCK/TMS/TDI/TDO for boundary scan and internal access."
      ),
      bullets: [
        loc("Scan chain plan con max length e lock-up map", "Scan chain plan with max length and lock-up map"),
        loc("Test mode: shift, capture, at-speed con OCC", "Test modes: shift, capture, at-speed with OCC"),
        loc("MBIST algorithm (March, checkerboard) per SRAM", "MBIST algorithm (March, checkerboard) for SRAM"),
        loc("TAP controller e boundary scan su IO pad", "TAP controller and boundary scan on IO pads"),
      ],
    },
  ],
  verification: [
    {
      title: loc("Coverage closure industriale", "Industrial coverage closure"),
      content: loc(
        "Functional coverage (SystemVerilog covergroups) misura scenari di test; code coverage (line, branch, FSM, toggle, expression) misura quanto codice è esercitato. Target produzione tipico: ≥95% functional bins hit, 100% code con waiver documentati. Un buco in coverage è un buco in silicon confidence. Il PD non esegue sim, ma deve esigere che i mode STA (scan, retention, low-power) abbiano vettori VCD rappresentativi — altrimenti IR e power signoff sono basati su attività irrealistica.",
        "Functional coverage (SystemVerilog covergroups) measures test scenarios; code coverage (line, branch, FSM, toggle, expression) measures exercised code. Typical production target: ≥95% functional bins hit, 100% code with documented waivers. A coverage hole is a silicon-confidence hole. PD does not run sim, but must demand representative VCD vectors for STA modes (scan, retention, low-power) — otherwise IR and power signoff use unrealistic activity."
      ),
      bullets: [
        loc("Coverage plan firmato prima di RTL freeze", "Signed coverage plan before RTL freeze"),
        loc("Cross coverage per combinazioni di mode", "Cross coverage for mode combinations"),
        loc("Waiver process con owner e scadenza", "Waiver process with owner and expiry"),
        loc("VCD/SAIF per power signoff allineati a use-case", "VCD/SAIF for power signoff aligned to use-case"),
      ],
    },
    {
      title: loc("Formal verification in produzione", "Formal verification in production"),
      content: loc(
        "Formal prova proprietà su TUTTI gli input legali (bounded o unbounded se converge). Uso classico: one-hot FSM, AXI handshake (valid non cala senza ready), mutex arbiter, no deadlock su credit counter, security properties (no unauthorized access). JasperGold, VC Formal, OneSpin. Se il formal esplode in stato, si restringe con assume. Un assert in sim è un check runtime; in formal è una prova matematica. Il PD beneficia: handshake provato formalmente = meno false path creativi in STA.",
        "Formal proves properties over ALL legal inputs (bounded, or unbounded if it converges). Classic uses: FSM one-hot, AXI handshake (valid does not drop without ready), arbiter mutex, no deadlock on credit counter, security properties. JasperGold, VC Formal, OneSpin. If formal state explodes, constrain with assume. An assert in sim is a runtime check; in formal it is a mathematical proof. PD benefits: formally proven handshake = fewer creative false paths in STA."
      ),
      bullets: [
        loc("Property library riusabile per protocolli standard", "Reusable property library for standard protocols"),
        loc("Bounded vs unbounded proof strategy", "Bounded vs unbounded proof strategy"),
        loc("Formal signoff su IP critici (arbiter, CDC controller)", "Formal signoff on critical IP (arbiter, CDC controller)"),
        loc("Assume/restrict per ridurre state space", "Assume/restrict to reduce state space"),
      ],
    },
    {
      title: loc("CDC e RDC signoff", "CDC and RDC signoff"),
      content: loc(
        "CDC: ogni segnale che attraversa clock domain asincroni deve avere uno schema nominato (2-FF, handshake, async FIFO con puntatori Gray). Un bus multi-bit con 2-FF per bit è un bug: ogni bit si risolve in un ciclo diverso. MTBF del sincronizzatore: MTBF = exp(t_r/τ)/(f_clk·f_data·T_0). RDC: reset async rilasciato vicino a clock edge è metastabilità mascherata. Power-on sequence: POR → PLL lock → clock release → per-domain sync reset deassert.",
        "CDC: every signal crossing asynchronous clock domains must have a named scheme (2-FF, handshake, async FIFO with Gray pointers). A multi-bit bus with 2-FF per bit is a bug: each bit resolves in a different cycle. Synchronizer MTBF: MTBF = exp(t_r/τ)/(f_clk·f_data·T_0). RDC: async reset released near a clock edge is masked metastability. Power-on sequence: POR → PLL lock → clock release → per-domain sync reset deassert."
      ),
      bullets: [
        loc("SpyGlass/Questa CDC con schema per crossing", "SpyGlass/Questa CDC with scheme per crossing"),
        loc("MTBF calculation con τ da .lib o datasheet", "MTBF calculation with τ from .lib or datasheet"),
        loc("RDC report su multi-reset design", "RDC report on multi-reset designs"),
        loc("CDC review meeting con arch e PD", "CDC review meeting with arch and PD"),
      ],
    },
    {
      title: loc("Gate-level sim e equivalence", "Gate-level sim and equivalence"),
      content: loc(
        "LEC (Logic Equivalence Checking): RTL↔gate post-synth, gate↔gate post-ECO. Conformal, Formality. Un mismatch post-ECO metal-only di solito è: spare non modellata, pin invertito, constant tie sbagliato, boundary gerarchica cambiata. Gate-level sim con SDF annotato: più lenta del RTL ma cattura race che il formal bounded non vede. Usata per signoff su IP critici e post-layout su path marginali. SDF corner devono allinearsi a MMMC.",
        "LEC: RTL↔gate post-synth, gate↔gate post-ECO. Conformal, Formality. A post-ECO metal-only mismatch is usually: unmodeled spare, inverted pin, wrong constant tie, changed hierarchical boundary. Gate-level sim with annotated SDF: slower than RTL but catches races bounded formal may miss. Used for signoff on critical IP and post-layout on marginal paths. SDF corners must align with MMMC."
      ),
      bullets: [
        loc("LEC clean su ogni ECO prima del commit netlist", "LEC clean on every ECO before netlist commit"),
        loc("SDF corner TT/SS/FF allineati a STA", "SDF corners TT/SS/FF aligned to STA"),
        loc("X-propagation analysis su unresolved CDC", "X-propagation analysis on unresolved CDC"),
        loc("Regression verde sul tag golden netlist", "Green regression on golden netlist tag"),
      ],
    },
  ],
  synthesis: [
    {
      title: loc("Technology mapping e VT swap", "Technology mapping and VT swap"),
      content: loc(
        "La sintesi mappa RTL su celle dalla Liberty (.lib): sceglie drive strength (X1–X32) e threshold voltage (HVT/SVT/LVT/ULVT) per chiudere WNS target sotto vincoli di area e power. HVT riduce leakage ma aumenta delay; LVT accelera ma aumenta leakage e potenzialmente variability. compile_ultra / Genus -effort high itera sizing, buffering, logic restructuring. Un vincolo di area stretto che forza HVT ovunque esplode il timing post-route — il trade-off si negozia a synth, non con false path in STA.",
        "Synthesis maps RTL onto Liberty (.lib) cells: picks drive strength (X1–X32) and threshold voltage (HVT/SVT/LVT/ULVT) to close WNS under area and power constraints. HVT reduces leakage but increases delay; LVT speeds up but increases leakage and potentially variability. compile_ultra / Genus -effort high iterates sizing, buffering, logic restructuring. Tight area forcing HVT everywhere explodes post-route timing — negotiate the trade-off at synth, not with false paths in STA."
      ),
      bullets: [
        loc("Lib corner SS/TT/FF per multi-corner synth", "Lib corners SS/TT/FF for multi-corner synth"),
        loc("dont_use list per celle DFM-problematiche", "dont_use list for DFM-problematic cells"),
        loc("VT swap report: % LVT vs leakage budget", "VT swap report: % LVT vs leakage budget"),
        loc("Max transition/capacitance come hard constraint", "Max transition/capacitance as hard constraints"),
      ],
    },
    {
      title: loc("NLDM vs CCS/LVF", "NLDM vs CCS/LVF"),
      content: loc(
        "NLDM (Non-Linear Delay Model) è una tabella slew×load: veloce ma grossolana a nodi avanzati (7 nm e sotto) dove SI e waveform reali contano. CCS (Composite Current Source) modella la corrente del driver; LVF (Liberty Variation Format) aggiunge derate OCV/AOCV/POCV. Un path con max_tran violato non ha delay 'vero': il .lib è fuori caratterizzazione. Per questo DRV=0 (max transition, max capacitance, max fanout) è exit criterion, non nice-to-have. A 5 nm molti team usano CCS per signoff STA.",
        "NLDM is a slew×load table: fast but crude at advanced nodes (7 nm and below) where SI and real waveforms matter. CCS models driver current; LVF adds OCV/AOCV/POCV derate. A path with violated max_tran has no 'true' delay: the .lib is out of characterization. That is why DRV=0 is an exit criterion, not nice-to-have. At 5 nm many teams use CCS for signoff STA."
      ),
      bullets: [
        loc("CCS lib per signoff, NLDM per iteration veloce", "CCS lib for signoff, NLDM for fast iteration"),
        loc("LVF per statistical timing (POCV)", "LVF for statistical timing (POCV)"),
        loc("Waveform propagation in Tempus/PrimeTime", "Waveform propagation in Tempus/PrimeTime"),
        loc("SI analysis con CCS noise models", "SI analysis with CCS noise models"),
      ],
    },
    {
      title: loc("WNS, TNS e strategia di fix", "WNS, TNS and fix strategy"),
      content: loc(
        "WNS (Worst Negative Slack) è il path peggiore; TNS (Total Negative Slack) è la somma di tutti i violazioni. WNS −5 ps con TNS −80 ns = migliaia di path: non si sistema con un buffer. WNS −80 ps con TNS −80 ps = un solo path: VT-swap, resize, o retime. Al colloquio vogliono questa distinzione operativa. TNS recovery: fix_paths -from/-to, incremental compile, poi handoff al PD con budget realistico. Synth WNS positivo non garantisce route WNS positivo: il PD eredita ~30–50% del timing budget.",
        "WNS is the worst path; TNS is the sum of all violations. WNS −5 ps with TNS −80 ns = thousands of paths: one buffer will not fix it. WNS −80 ps with TNS −80 ps = a single path: VT-swap, resize, or retime. Interviewers want this operational distinction. TNS recovery: fix_paths -from/-to, incremental compile, then handoff to PD with realistic budget. Positive synth WNS does not guarantee positive route WNS: PD inherits ~30–50% of timing budget."
      ),
      bullets: [
        loc("Report WNS/TNS per corner prima del handoff", "WNS/TNS report per corner before handoff"),
        loc("Critical path list con 20 worst paths", "Critical path list with 20 worst paths"),
        loc("Incremental compile dopo ECO RTL minori", "Incremental compile after minor RTL ECOs"),
        loc("Synth-to-route timing budget documentato", "Documented synth-to-route timing budget"),
      ],
    },
    {
      title: loc("Retiming e hierarchical synthesis", "Retiming and hierarchical synthesis"),
      content: loc(
        "Retiming sposta registri attraverso logica combinatoria per bilanciare pipeline depth — LEC obbligatorio, arch approval. Utile quando RTL ha path lunghi ma pochi registri disponibili. Non confondere con 'aggiungi buffer in PD'. Hierarchical synthesis: compile block-level, poi top-level integrate con budget timing per interface. Abstract per block incompleti. Il top PD integra DEF con fence, region, e timing budget per block. Interface timing è il punto di rottura più comune in design gerarchici.",
        "Retiming moves registers through combinational logic to balance pipeline depth — LEC mandatory, architecture approval. Useful when RTL has long paths but few available registers. Do not confuse with 'add buffers in PD'. Hierarchical synthesis: block-level compile, then top-level integrate with interface timing budgets. Abstracts for incomplete blocks. Top PD integrates DEF with fence, region, and per-block timing budget. Interface timing is the most common breakage point in hierarchical designs."
      ),
      bullets: [
        loc("Retiming report con register move list", "Retiming report with register move list"),
        loc("Interface budget: setup/hold per pin block", "Interface budget: setup/hold per block pin"),
        loc("Abstract LEF con pin timing e blockage", "Abstract LEF with pin timing and blockage"),
        loc("Top-level LEC dopo integrate", "Top-level LEC after integrate"),
      ],
    },
  ],
  floorplan: [
    {
      title: loc("Macro placement e halo rules", "Macro placement and halo rules"),
      content: loc(
        "SRAM in bank verso il controller, pin verso il canale di routing, halo 2–5 µm attorno alla macro (no standard cell placement). PLL/analog lontano da digital noisy e da IO switching. SERDES sul bordo verso il bump correlato. Un hard macro è un buco nel routing da M1 a Mn interni: i layer sopra possono passare, i pin no. Rotazione 90°/180° può salvare un canale. Flyline (ratsnest) dopo il primo pass: se vedi un arco che attraversa tutto il die, hai già perso il 70% del PPA.",
        "SRAM in a bank toward the controller, pins facing the routing channel, 2–5 µm halo around the macro (no standard cell placement). PLL/analog away from noisy digital and switching IO. SERDES on the edge toward its bump. A hard macro is a routing hole from internal M1 to Mn: upper layers may pass, pins will not. 90°/180° rotation can save a channel. Flylines after the first pass: if you see an arc crossing the whole die, you already lost 70% of PPA."
      ),
      bullets: [
        loc("Macro pin toward channel, never toward wall", "Macro pins toward channel, never toward wall"),
        loc("Halo size da DRC e analog isolation req", "Halo size from DRC and analog isolation requirements"),
        loc("Flyline analysis pre-place commitment", "Flyline analysis before place commitment"),
        loc("Abstract pin block match GDS reale", "Abstract pin block matches real GDS"),
      ],
    },
    {
      title: loc("Utilization e die sizing", "Utilization and die sizing"),
      content: loc(
        "Utilization si misura sul CORE, non sul die. Il die include IO ring, seal ring, scribe keepout. Formula: A_core = (A_std + A_macro) / U_target. Tipico U_target: 65–75% pre-place, 70–80% post-place. U troppo alta → congestione routing irrecuperabile; troppo bassa → costo wafer. Aspect ratio (H/W) influenza package e bump map. Un interviewer che chiede 'utilization 70%' e tu rispondi 'die 70%' hai già sbagliato l'unità.",
        "Utilization is measured on CORE, not die. Die includes IO ring, seal ring, scribe keepout. Formula: A_core = (A_std + A_macro) / U_target. Typical U_target: 65–75% pre-place, 70–80% post-place. Too high → irrecoverable routing congestion; too low → wafer cost. Aspect ratio (H/W) affects package and bump map. An interviewer asking '70% utilization' and you answer 'die 70%' already used the wrong unit."
      ),
      bullets: [
        loc("Core area vs die area in floorplan report", "Core area vs die area in floorplan report"),
        loc("Target utilization per technology node", "Target utilization per technology node"),
        loc("Whitespace budget per ECO e filler", "Whitespace budget for ECO and filler"),
        loc("Aspect ratio constraint da package team", "Aspect ratio constraint from package team"),
      ],
    },
    {
      title: loc("Fence, region e voltage island", "Fence, region and voltage island"),
      content: loc(
        "Fence delimita un blocco per multi-owner PD: le celle non escono dal fence. Region è un'area preferenziale (soft fence). Voltage island = region + power switch boundary: ogni island ha VDD, VDD_SW, GND propri. Non mischiare domini nella stessa region senza LS strip. Level shifter strip lungo il confine tra domini a tensione diversa. Retention region per logica che deve sopravvivere a sleep. Il floorplan definisce dove vivono ISO, LS, e power header — non si aggiungono dopo il route.",
        "Fence delimits a block for multi-owner PD: cells do not leave the fence. Region is a preferential area (soft fence). Voltage island = region + power-switch boundary: each island has its own VDD, VDD_SW, GND. Do not mix domains in one region without an LS strip. Level-shifter strip along the boundary between different voltage domains. Retention region for logic that must survive sleep. Floorplan defines where ISO, LS, and power headers live — they are not added after route."
      ),
      bullets: [
        loc("Fence per CPU, GPU, NPU block owners", "Fence per CPU, GPU, NPU block owners"),
        loc("LS strip width e cell count per crossing", "LS strip width and cell count per crossing"),
        loc("Power header row placement in floorplan", "Power header row placement in floorplan"),
        loc("Retention region map in UPF alignment", "Retention region map aligned to UPF"),
      ],
    },
    {
      title: loc("IO ring e bump assignment", "IO ring and bump assignment"),
      content: loc(
        "IO pad ring sul perimetro del die: digital IO, analog IO, power pad, ESD cell. Flip-chip: bump map su RDL (redistribution layer) collega pad logici a bump package. SSO (Simultaneous Switching Output) noise: troppi IO che switchano insieme causano ground bounce. DDR interface: DQS/DQ gruppi verso bump correlati. Power bump count da IR analysis preliminare. Il floorplan preliminare include bump map draft — package team valida.",
        "IO pad ring on die perimeter: digital IO, analog IO, power pads, ESD cells. Flip-chip: bump map on RDL connects logical pads to package bumps. SSO noise: too many IO switching together causes ground bounce. DDR interface: DQS/DQ groups toward correlated bumps. Power bump count from preliminary IR analysis. Preliminary floorplan includes draft bump map — package team validates."
      ),
      bullets: [
        loc("Bump pitch e array da package spec", "Bump pitch and array from package spec"),
        loc("Power/ground bump ratio da IR budget", "Power/ground bump ratio from IR budget"),
        loc("Analog IO isolation da digital switching", "Analog IO isolation from digital switching"),
        loc("ESD cell placement per IO bank", "ESD cell placement per IO bank"),
      ],
    },
  ],
  pdn: [
    {
      title: loc("Mesh design e strap width", "Mesh design and strap width"),
      content: loc(
        "Primary PG: bump/pad → RDL/AP → ring → mesh M8/M9 → straps → via ladder → M1 rail → cell pin. Strap width da corrente peak e IR budget: W_strap ≥ I_peak · R_sheet · L / V_drop_budget. Mesh pitch tipico: 10–50 µm a seconda del node. Via ladder: ogni salto M1→M8 ha R_via — una ladder da 20 via su path hot è significativa. Via doubling/tripling non è solo DFM, è resistenza. Triple/quadruple via array su strap che portano > 1 A.",
        "Primary PG: bump/pad → RDL/AP → ring → M8/M9 mesh → straps → via ladder → M1 rail → cell pin. Strap width from peak current and IR budget: W_strap ≥ I_peak · R_sheet · L / V_drop_budget. Typical mesh pitch: 10–50 µm depending on node. Via ladder: each M1→M8 step has R_via — a 20-via ladder on a hot path is significant. Via doubling/tripling is not only DFM, it is resistance. Triple/quadruple via arrays on straps carrying > 1 A."
      ),
      bullets: [
        loc("IR drop target: <5% VDD su path critico", "IR drop target: <5% VDD on critical path"),
        loc("Mesh pitch vs strap width trade-off", "Mesh pitch vs strap width trade-off"),
        loc("Via array rule per current density", "Via array rule per current density"),
        loc("Redundant mesh per reliability", "Redundant mesh for reliability"),
      ],
    },
    {
      title: loc("Power switch e UPF alignment", "Power switch and UPF alignment"),
      content: loc(
        "Power header (switch cell) collega VDD alla rail switched VDD_SW. Width del header da corrente del dominio e rush current. Sequence: isolate → save retention → disable clock → power off. Wake: power on → wait stable → release isolation → restore. Rush current durante power-on può causare IR drop globale. Decap (decoupling capacitor) vicino al header mitiga. CLP verifica che UPF power switch map corrisponda al layout.",
        "Power header (switch cell) connects VDD to switched rail VDD_SW. Header width from domain current and rush current. Sequence: isolate → save retention → disable clock → power off. Wake: power on → wait stable → release isolation → restore. Rush current during power-on can cause global IR drop. Decap near the header mitigates. CLP verifies UPF power-switch map matches layout."
      ),
      bullets: [
        loc("Header width = I_domain / (V_drop · R_on)", "Header width = I_domain / (V_drop · R_on)"),
        loc("Rush current simulation con UPF states", "Rush current simulation with UPF states"),
        loc("Decap placement per power domain", "Decap placement per power domain"),
        loc("Power switch enable timing in STA mode", "Power switch enable timing in STA mode"),
      ],
    },
    {
      title: loc("EM su power grid", "EM on power grid"),
      content: loc(
        "Electromigration (EM): corrente alta per tempo lungo danneggia il metall. Regola: J ≤ J_max(T, lifetime). Strap sottodimensionato → failure in field. Via EM: ogni via ha J_max — array di via per distribuire corrente. Tool: Voltus, RedHawk, ANSYS. EM signoff è obbligatorio prima del tapeout. Metal width upgrade o via doubling per fix. Il PDN non è solo IR drop istantaneo, è affidabilità a 10 anni.",
        "Electromigration (EM): high current for long time damages metal. Rule: J ≤ J_max(T, lifetime). Undersized strap → field failure. Via EM: each via has J_max — via arrays distribute current. Tools: Voltus, RedHawk, ANSYS. EM signoff is mandatory before tapeout. Metal width upgrade or via doubling to fix. PDN is not only instantaneous IR drop, it is 10-year reliability."
      ),
      bullets: [
        loc("J_max da foundry DRM per ogni metal layer", "J_max from foundry DRM per metal layer"),
        loc("Lifetime target: 10 yr @ T_junction max", "Lifetime target: 10 yr @ T_junction max"),
        loc("Via current density vs strap width", "Via current density vs strap width"),
        loc("EM hotspot map post-route", "EM hotspot map post-route"),
      ],
    },
    {
      title: loc("Secondary PG e always-on domain", "Secondary PG and always-on domain"),
      content: loc(
        "Always-on domain: PLL, bandgap, retention logic, power management controller. Non passa per power switch. VDD_AO separato da VDD_SW. Secondary PG per domini a tensione diversa (0.8 V core, 1.8 V IO). Level shifter strip tra domini. Floating rail (PG disconnect) è LVS/ERC violation e IR infinito. verify_pg_connection è check obbligatorio, non speranza.",
        "Always-on domain: PLL, bandgap, retention logic, power management controller. Does not go through power switch. VDD_AO separate from VDD_SW. Secondary PG for different voltage domains (0.8 V core, 1.8 V IO). Level-shifter strip between domains. Floating rail (PG disconnect) is LVS/ERC violation and infinite IR. verify_pg_connection is a mandatory check, not hope."
      ),
      bullets: [
        loc("AON domain list in UPF", "AON domain list in UPF"),
        loc("Separate ring/mesh per voltage domain", "Separate ring/mesh per voltage domain"),
        loc("PG connectivity check pre-CTS", "PG connectivity check pre-CTS"),
        loc("Floating net report = zero tolerance", "Floating net report = zero tolerance"),
      ],
    },
  ],
  placement: [
    {
      title: loc("Global vs detailed placement", "Global vs detailed placement"),
      content: loc(
        "Global placement: posiziona celle in griglia grossolana minimizzando wirelength e congestione stimata. Detailed placement: legalizza (allinea a row, rimuove overlap), ottimizza timing locale. Density screen: area troppo piena → overflow post-route. Placement blockages per macro halo, analog keepout, routing channel reserve. Timing-driven placement: pesa net critiche. Un placement che ignora timing produce TNS enorme post-route anche con buon WNS a synth.",
        "Global placement: positions cells on coarse grid minimizing wirelength and estimated congestion. Detailed placement: legalizes (aligns to rows, removes overlap), optimizes local timing. Density screen: overcrowded area → post-route overflow. Placement blockages for macro halo, analog keepout, routing channel reserve. Timing-driven placement: weights critical nets. Placement ignoring timing produces huge TNS post-route even with good synth WNS."
      ),
      bullets: [
        loc("Congestion map review pre-route commit", "Congestion map review pre-route commit"),
        loc("Critical net weight 5–10× per timing path", "Critical net weight 5–10× for timing paths"),
        loc("Blockage per macro halo e analog", "Blockage for macro halo and analog"),
        loc("Density < target utilization per region", "Density < target utilization per region"),
      ],
    },
    {
      title: loc("Hold fixing pre-CTS", "Hold fixing pre-CTS"),
      content: loc(
        "Hold violation: data arriva troppo presto rispetto al clock. Fix: delay cell (buffer con delay intenzionale), useful skew (avanzare clock al sink). Pre-CTS hold fix con buffer è comune; post-CTS con useful skew è più preciso. Troppi buffer hold → area e power overhead. Hold corner tipicamente FF@low V, fast process, cold temp. Un design con WNS ok ma hold violato a FF è un tapeout blocker.",
        "Hold violation: data arrives too early relative to clock. Fix: delay cell (buffer with intentional delay), useful skew (advance clock at sink). Pre-CTS hold fix with buffers is common; post-CTS useful skew is more precise. Too many hold buffers → area and power overhead. Hold corner typically FF@low V, fast process, cold temp. A design with OK WNS but hold violated at FF is a tapeout blocker."
      ),
      bullets: [
        loc("Hold report FF corner pre-CTS", "Hold report FF corner pre-CTS"),
        loc("Delay cell count budget per block", "Delay cell count budget per block"),
        loc("No hold fix on clock net (CTS job)", "No hold fix on clock net (CTS job)"),
        loc("Scan chain hold post-DFT", "Scan chain hold post-DFT"),
      ],
    },
    {
      title: loc("Congestion e routability", "Congestion and routability"),
      content: loc(
        "Congestion: troppe net che competono per le stesse track. Gcell overflow > 0 post-route = failure. Cause: utilization troppo alta, macro mal posizionate, pin access blocked. Fix: rip-up placement, widen channel, reduce utilization, macro rotation. Innovus/Caravel: congestion map GRC/RUDY. Un placement con GRC > 0.8 in hotspot è red flag. Routing non risolve congestione strutturale — si torna al floorplan.",
        "Congestion: too many nets competing for the same tracks. Gcell overflow > 0 post-route = failure. Causes: utilization too high, badly placed macros, blocked pin access. Fix: rip-up placement, widen channel, reduce utilization, macro rotation. Innovus/Caravel: congestion map GRC/RUDY. Placement with GRC > 0.8 in hotspot is a red flag. Routing does not fix structural congestion — return to floorplan."
      ),
      bullets: [
        loc("GRC/RUDY map threshold < 0.7 average", "GRC/RUDY map threshold < 0.7 average"),
        loc("Hotspot GRC > 0.8 → placement rework", "Hotspot GRC > 0.8 → placement rework"),
        loc("Pin access check per macro", "Pin access check per macro"),
        loc("Channel width reserve 2–3 tracks min", "Channel width reserve 2–3 tracks minimum"),
      ],
    },
    {
      title: loc("ECO placement e spare cells", "ECO placement and spare cells"),
      content: loc(
        "Spare cells (filler con logica NAND/NOR/INV) inserite durante placement per ECO metal-only future. Posizionate in cluster vicino a logica modificabile. ECO placement: nuove celle in whitespace o sostituzione filler. Metal-only ECO: no new via, solo reroute M2+. Gate-count ECO: nuove celle + route. LEC obbligatorio su ogni ECO. Il placement iniziale deve lasciare whitespace per ECO — tipico 2–5% area.",
        "Spare cells (filler with NAND/NOR/INV logic) inserted during placement for future metal-only ECO. Placed in clusters near modifiable logic. ECO placement: new cells in whitespace or filler replacement. Metal-only ECO: no new vias, only M2+ reroute. Gate-count ECO: new cells + route. LEC mandatory on every ECO. Initial placement must leave whitespace for ECO — typically 2–5% area."
      ),
      bullets: [
        loc("Spare cell cluster per 50k gates", "Spare cell cluster per 50k gates"),
        loc("ECO whitespace 2–5% core area", "ECO whitespace 2–5% core area"),
        loc("Filler cell con spare function", "Filler cells with spare function"),
        loc("ECO route layer reserve M3–M5", "ECO route layer reserve M3–M5"),
      ],
    },
  ],
  cts: [
    {
      title: loc("Clock tree topology", "Clock tree topology"),
      content: loc(
        "CTS costruisce albero clock da root (PLL output) a sink (FF clock pin). Topologie: H-tree, fishbone, cluster. Target: skew < 5% periodo, latency controllata, power minima. Clock gating integration: ICG inseriti nel tree. Non-clock (reset, scan enable) trattati separatamente. Useful skew: intenzionalmente sbilanciare per chiudere setup. CTS è il passo che più impatta hold: ogni sink riceve clock con timing diverso.",
        "CTS builds clock tree from root (PLL output) to sinks (FF clock pins). Topologies: H-tree, fishbone, cluster. Targets: skew < 5% of period, controlled latency, minimum power. Clock gating integration: ICGs inserted in tree. Non-clock (reset, scan enable) handled separately. Useful skew: intentionally unbalance to close setup. CTS is the step that most impacts hold: every sink receives clock at different timing."
      ),
      bullets: [
        loc("Skew target < 50 ps @ 1 GHz", "Skew target < 50 ps @ 1 GHz"),
        loc("Clock latency report per domain", "Clock latency report per domain"),
        loc("ICG placement nel tree", "ICG placement in tree"),
        loc("Exclude async reset da CTS", "Exclude async reset from CTS"),
      ],
    },
    {
      title: loc("Clock uncertainty e OCV", "Clock uncertainty and OCV"),
      content: loc(
        "Clock uncertainty in SDC: set_clock_uncertainty include skew, jitter, margin. Pre-CTS: uncertainty alta (~200 ps); post-CTS: aggiornare con skew reale + jitter PLL. OCV (On-Chip Variation): stesso path, celle vicine, delay correlato. AOCV/POCV: tabelle derate per depth e location. Senza aggiornare uncertainty post-CTS, STA è o troppo pessimistico o troppo ottimistico. Il colloquio chiede: 'quando aggiorni uncertainty?'",
        "Clock uncertainty in SDC: set_clock_uncertainty includes skew, jitter, margin. Pre-CTS: high uncertainty (~200 ps); post-CTS: update with real skew + PLL jitter. OCV: same path, nearby cells, correlated delay. AOCV/POCV: derate tables by depth and location. Without updating uncertainty post-CTS, STA is either too pessimistic or too optimistic. Interview question: 'when do you update uncertainty?'"
      ),
      bullets: [
        loc("Pre-CTS uncertainty = placeholder", "Pre-CTS uncertainty = placeholder"),
        loc("Post-CTS: skew measured + jitter budget", "Post-CTS: measured skew + jitter budget"),
        loc("AOCV table per technology node", "AOCV table per technology node"),
        loc("POCV per 5 nm e sotto", "POCV for 5 nm and below"),
      ],
    },
    {
      title: loc("Hold post-CTS", "Hold post-CTS"),
      content: loc(
        "Dopo CTS, hold violations esplodono: ogni sink ha clock arrival diverso. Fix: delay cell sul data path, useful skew (ritardare clock al launch), clock tree restructuring. Hold corner FF@0.99V, fast process, −40°C. Tipico: 10–30% dei path setup-critical diventano hold-critical post-CTS. Non fixare hold con buffer sul clock net (rompe skew). CTS-opt hold fixing è iterativo con STA.",
        "After CTS, hold violations explode: every sink has different clock arrival. Fix: delay cell on data path, useful skew (delay clock at launch), clock tree restructuring. Hold corner FF@0.99V, fast process, −40°C. Typical: 10–30% of setup-critical paths become hold-critical post-CTS. Do not fix hold with buffers on clock net (breaks skew). CTS-opt hold fixing is iterative with STA."
      ),
      bullets: [
        loc("Hold report immediatamente post-CTS", "Hold report immediately post-CTS"),
        loc("Delay cell budget post-CTS", "Delay cell budget post-CTS"),
        loc("Useful skew limit per skew target", "Useful skew limit per skew target"),
        loc("Scan mode hold separate check", "Scan mode hold separate check"),
      ],
    },
    {
      title: loc("Multi-mode CTS", "Multi-mode CTS"),
      content: loc(
        "Functional mode, scan shift, scan capture, at-speed, low-power. Ogni mode ha clock tree potenzialmente diverso (OCC bypass, clock mux). CTS deve chiudere tutti i mode. Scan shift: clock lento, hold facile. At-speed: clock veloce, setup critico. STA multi-mode: set_case_analysis per mode. Il mode peggiore determina il signoff.",
        "Functional mode, scan shift, scan capture, at-speed, low-power. Each mode may have a different clock tree (OCC bypass, clock mux). CTS must close all modes. Scan shift: slow clock, easy hold. At-speed: fast clock, critical setup. STA multi-mode: set_case_analysis per mode. Worst mode determines signoff."
      ),
      bullets: [
        loc("Mode list: func, scan_shift, scan_cap, at_speed", "Mode list: func, scan_shift, scan_cap, at_speed"),
        loc("OCC integration nel CTS flow", "OCC integration in CTS flow"),
        loc("Per-mode skew report", "Per-mode skew report"),
        loc("Worst mode per WNS e hold", "Worst mode for WNS and hold"),
      ],
    },
  ],
  routing: [
    {
      title: loc("Global vs detailed routing", "Global vs detailed routing"),
      content: loc(
        "Global routing: assegna net a Gcell, stima layer e congestione. Detailed routing: traccia geometria reale su ogni layer, rispetta DRC. Overflow post-detailed = failure assoluto. Layer assignment: M1–M2 per short local, M3–M5 per medium, M6+ per long/global. Non-default rule (NDR) per clock e critici: width 2×, spacing 2×. SI-aware routing: spacing per crosstalk, shielding per clock/data sensibili.",
        "Global routing: assigns nets to Gcells, estimates layers and congestion. Detailed routing: traces real geometry on each layer, respects DRC. Post-detailed overflow = absolute failure. Layer assignment: M1–M2 for short local, M3–M5 for medium, M6+ for long/global. Non-default rules (NDR) for clock and critical nets: 2× width, 2× spacing. SI-aware routing: spacing for crosstalk, shielding for sensitive clock/data."
      ),
      bullets: [
        loc("Overflow = 0 post-detailed route", "Overflow = 0 post-detailed route"),
        loc("NDR net list da CTS e STA", "NDR net list from CTS and STA"),
        loc("Shield clock net con VDD/GND", "Shield clock nets with VDD/GND"),
        loc("Via ladder min per power strap", "Minimum via ladder per power strap"),
      ],
    },
    {
      title: loc("SI e crosstalk", "SI and crosstalk"),
      content: loc(
        "Signal integrity: crosstalk aggiunge delta delay (aggressor switching). Setup: aggressor aiuta → optimistic delay. Hold: aggressor aiuta → pessimistic per hold. Noise glitch: aggressor causa false transition su victim. Fix: spacing, shielding, victim driver upsize, route layer change. SI analysis in Tempus/Innovus post-route. A 7 nm e sotto, SI è 10–20% del timing budget.",
        "Signal integrity: crosstalk adds delta delay (aggressor switching). Setup: aggressor helps → optimistic delay. Hold: aggressor helps → pessimistic for hold. Noise glitch: aggressor causes false transition on victim. Fix: spacing, shielding, victim driver upsize, route layer change. SI analysis in Tempus/Innovus post-route. At 7 nm and below, SI is 10–20% of timing budget."
      ),
      bullets: [
        loc("Crosstalk delta delay report", "Crosstalk delta delay report"),
        loc("Noise glitch height < V_threshold", "Noise glitch height < V_threshold"),
        loc("Min spacing rule per layer", "Minimum spacing rule per layer"),
        loc("SI iteration con ECO route", "SI iteration with ECO route"),
      ],
    },
    {
      title: loc("DRC e manufacturability", "DRC and manufacturability"),
      content: loc(
        "DRC (Design Rule Check): spacing, width, via enclosure, antenna, density. LVS (Layout vs Schematic): netlist match layout. Antenna rule: plasma etch carica gate ossido — diode clamp o jumper metal. Metal density: min/max fill per CMP uniformity. Double patterning (DPT) a 7 nm: coloring conflict = DRC fail. Routing deve rispettare color alternation su layer DPT.",
        "DRC: spacing, width, via enclosure, antenna, density. LVS: netlist matches layout. Antenna rule: plasma etch charges oxide gate — diode clamp or metal jumper. Metal density: min/max fill for CMP uniformity. Double patterning (DPT) at 7 nm: coloring conflict = DRC fail. Routing must respect color alternation on DPT layers."
      ),
      bullets: [
        loc("DRC clean = zero violation", "DRC clean = zero violation"),
        loc("Antenna ratio < foundry limit", "Antenna ratio < foundry limit"),
        loc("Metal density 20–80% per layer", "Metal density 20–80% per layer"),
        loc("DPT color alternation check", "DPT color alternation check"),
      ],
    },
    {
      title: loc("ECO routing", "ECO routing"),
      content: loc(
        "Metal-only ECO: modifica solo routing M2+, no nuove celle, no new via (dipende da foundry). Gate-count ECO: nuove celle + route completo. Spare cell utilization per metal-only. ECO route su layer non congestionati. LEC gate↔gate obbligatorio. Timing ECO: fix solo path violati, non ripetere full route. Tipico turnaround ECO: 24–72 ore per metal-only.",
        "Metal-only ECO: modifies only M2+ routing, no new cells, no new vias (foundry-dependent). Gate-count ECO: new cells + full route. Spare cell utilization for metal-only. ECO route on uncongested layers. Gate↔gate LEC mandatory. Timing ECO: fix only violated paths, do not repeat full route. Typical ECO turnaround: 24–72 hours for metal-only."
      ),
      bullets: [
        loc("ECO layer reserve M4–M6", "ECO layer reserve M4–M6"),
        loc("Spare cell proximity < 50 µm", "Spare cell proximity < 50 µm"),
        loc("LEC before e after ogni ECO", "LEC before and after every ECO"),
        loc("ECO timing mode in STA", "ECO timing mode in STA"),
      ],
    },
  ],
  layout: [
    {
      title: loc("Fill insertion e CMP", "Fill insertion and CMP"),
      content: loc(
        "Metal fill: inserisce geometrie dummy per uniformare densità metal e migliorare CMP (Chemical Mechanical Polishing). Min density: troppo poco metal → dishing. Max density: troppo metal → erosion. Fill insertion post-route, pre-signoff. Timing impact: fill aggiunge capacitance → delay aumenta. SI impact: fill può aumentare crosstalk. Signoff fill deve matchare tapeout GDS.",
        "Metal fill: inserts dummy geometries to uniform metal density and improve CMP. Min density: too little metal → dishing. Max density: too much metal → erosion. Fill insertion post-route, pre-signoff. Timing impact: fill adds capacitance → delay increases. SI impact: fill can increase crosstalk. Signoff fill must match tapeout GDS."
      ),
      bullets: [
        loc("Density window 20–70% per layer", "Density window 20–70% per layer"),
        loc("Fill timing impact < 2% WNS", "Fill timing impact < 2% WNS"),
        loc("CMP simulation da foundry", "CMP simulation from foundry"),
        loc("Fill deck match tapeout flow", "Fill deck matches tapeout flow"),
      ],
    },
    {
      title: loc("Tap cell e endcap", "Tap cell and endcap"),
      content: loc(
        "Tap cell (well tap): collega substrate/well a VDD/VSS per prevenire latch-up. Spacing max tra tap: da foundry DRM (tipico 50–100 µm). Endcap row: termina ogni row standard cell. Senza tap sufficiente → latch-up in silicon. Insertion post-placement, pre-route. DRC check tap spacing obbligatorio.",
        "Tap cell (well tap): connects substrate/well to VDD/VSS to prevent latch-up. Max tap spacing: from foundry DRM (typically 50–100 µm). Endcap row: terminates every standard-cell row. Insufficient tap → latch-up in silicon. Insertion post-placement, pre-route. Tap spacing DRC check mandatory."
      ),
      bullets: [
        loc("Tap spacing per foundry DRM", "Tap spacing per foundry DRM"),
        loc("Endcap ogni row boundary", "Endcap at every row boundary"),
        loc("Tap insertion post-place", "Tap insertion post-place"),
        loc("Latch-up sim per analog block", "Latch-up sim for analog blocks"),
      ],
    },
    {
      title: loc("Filler cell e decap", "Filler cell and decap"),
      content: loc(
        "Filler cell: riempie gap tra standard cell per continuità N-well/P-well e metal rail. Decap cell: capacitance tra VDD/VSS per stabilizzare alimentazione. Decap vicino a switching logic e power header. Trade-off: più decap = meno area per logica. IR analysis guida decap placement. Filler con spare function per ECO.",
        "Filler cells: fill gaps between standard cells for N-well/P-well and metal rail continuity. Decap cells: capacitance between VDD/VSS to stabilize supply. Decap near switching logic and power headers. Trade-off: more decap = less area for logic. IR analysis guides decap placement. Filler with spare function for ECO."
      ),
      bullets: [
        loc("Filler insertion post-route", "Filler insertion post-route"),
        loc("Decap density per power domain", "Decap density per power domain"),
        loc("Spare filler per ECO cluster", "Spare filler for ECO clusters"),
        loc("Well continuity check", "Well continuity check"),
      ],
    },
    {
      title: loc("GDS merge e hierarchy", "GDS merge and hierarchy"),
      content: loc(
        "GDS merge: combina standard cell, macro GDS, filler, metal fill in un unico database. Hierarchy: top cell contiene block, block contiene leaf. LVS su hierarchy completa. IP delivery: hard macro GDS + abstract LEF. Merge order: bottom-up. XOR check tra revisioni per trovare differenze. Il tapeout GDS è il deliverable legale — deve matchare signoff.",
        "GDS merge: combines standard cells, macro GDS, filler, metal fill in one database. Hierarchy: top cell contains blocks, blocks contain leaf cells. LVS on full hierarchy. IP delivery: hard macro GDS + abstract LEF. Merge order: bottom-up. XOR check between revisions to find differences. Tapeout GDS is the legal deliverable — it must match signoff."
      ),
      bullets: [
        loc("Bottom-up GDS merge order", "Bottom-up GDS merge order"),
        loc("XOR tra signoff e tapeout GDS", "XOR between signoff and tapeout GDS"),
        loc("IP GDS version control", "IP GDS version control"),
        loc("Top cell naming convention", "Top cell naming convention"),
      ],
    },
  ],
  sta: [
    {
      title: loc("MMMC e corner setup", "MMMC and corner setup"),
      content: loc(
        "MMMC (Multi-Mode Multi-Corner): ogni combinazione mode×corner è uno scenario STA. Mode: functional, scan, low-power. Corner: SS@0.72V@125°C (slow), TT@0.8V@25°C (typical), FF@0.88V@−40°C (fast). Library, RC, operating conditions per corner. Signoff = worst WNS e worst hold across all scenarios. set_case_analysis definisce mode. OCV/AOCV/POCV derate per corner.",
        "MMMC: each mode×corner combination is one STA scenario. Modes: functional, scan, low-power. Corners: SS@0.72V@125°C (slow), TT@0.8V@25°C (typical), FF@0.88V@−40°C (fast). Library, RC, operating conditions per corner. Signoff = worst WNS and worst hold across all scenarios. set_case_analysis defines mode. OCV/AOCV/POCV derate per corner."
      ),
      bullets: [
        loc("Corner list da foundry signoff doc", "Corner list from foundry signoff doc"),
        loc("Mode list allineato a DFT e UPF", "Mode list aligned to DFT and UPF"),
        loc("Worst WNS e worst hold report", "Worst WNS and worst hold report"),
        loc("SI on/off per signoff corner", "SI on/off per signoff corner"),
      ],
    },
    {
      title: loc("False path e multicycle", "False path and multicycle"),
      content: loc(
        "False path: path logicamente impossibile o non critico (es. reset, test mode). set_false_path -from/-to. Multicycle path: path che richiede N cicli (es. bus handshake). set_multicycle_path -setup N -hold N-1. Ogni false/multicycle deve avere owner architetturale e giustificazione documentata. False path 'creativo' per chiudere WNS è un bug di silicon. Review obbligatoria prima del signoff.",
        "False path: logically impossible or non-critical path (e.g. reset, test mode). set_false_path -from/-to. Multicycle path: path requiring N cycles (e.g. bus handshake). set_multicycle_path -setup N -hold N-1. Every false/multicycle must have architectural owner and documented justification. 'Creative' false paths to close WNS are silicon bugs. Mandatory review before signoff."
      ),
      bullets: [
        loc("False path list con owner e reason", "False path list with owner and reason"),
        loc("Multicycle solo con arch approval", "Multicycle only with architecture approval"),
        loc("No false path su functional critical", "No false path on functional critical paths"),
        loc("SDC review meeting pre-signoff", "SDC review meeting pre-signoff"),
      ],
    },
    {
      title: loc("POCV e statistical timing", "POCV and statistical timing"),
      content: loc(
        "POCV (Parametric OCV): modella variabilità processo con distribuzione statistica. LVF library con sigma per ogni cella. Signoff a 3σ o 4σ per yield target. A 5 nm, POCV è standard; OCV fisso è troppo pessimistico o ottimistico. Tempus PrimeTime POCV mode. Il colloquio chiede: differenza OCV vs AOCV vs POCV e quando usare ciascuno.",
        "POCV: models process variability with statistical distribution. LVF library with sigma per cell. Signoff at 3σ or 4σ for yield target. At 5 nm, POCV is standard; fixed OCV is too pessimistic or optimistic. Tempus/PrimeTime POCV mode. Interview asks: OCV vs AOCV vs POCV difference and when to use each."
      ),
      bullets: [
        loc("LVF library per POCV signoff", "LVF library for POCV signoff"),
        loc("Sigma target 3σ per consumer, 4σ automotive", "Sigma target 3σ consumer, 4σ automotive"),
        loc("POCV vs OCV WNS comparison report", "POCV vs OCV WNS comparison report"),
        loc("Variation report per critical path", "Variation report per critical path"),
      ],
    },
    {
      title: loc("SDC quality e signoff checklist", "SDC quality and signoff checklist"),
      content: loc(
        "SDC quality: create_clock coerenti, generated clock per divider, set_input_delay/set_output_delay per IO, set_false_path giustificati, set_multicycle_path corretti, set_case_analysis per mode. SDC lint (SpyGlass SDC, Veridian). Un SDC sbagliato produce STA green ma silicon fail. Signoff checklist: WNS ≥ 0, hold ≥ 0, DRV = 0, SI clean, tutti mode×corner.",
        "SDC quality: coherent create_clock, generated clocks for dividers, set_input_delay/set_output_delay for IO, justified set_false_path, correct set_multicycle_path, set_case_analysis per mode. SDC lint (SpyGlass SDC, Veridian). Wrong SDC produces green STA but silicon fail. Signoff checklist: WNS ≥ 0, hold ≥ 0, DRV = 0, SI clean, all mode×corner."
      ),
      bullets: [
        loc("SDC lint clean report", "SDC lint clean report"),
        loc("Clock definition review", "Clock definition review"),
        loc("IO delay da package model", "IO delay from package model"),
        loc("Signoff matrix mode×corner", "Signoff matrix mode×corner"),
      ],
    },
  ],
  pv: [
    {
      title: loc("DRC signoff flow", "DRC signoff flow"),
      content: loc(
        "DRC con tool foundry-qualified: Calibre, Pegasus, ICV. Deck version matcha process node. Zero violation = pass. Waivers solo con foundry approval documentata. Classi: spacing, width, via, antenna, density, coloring. DRC run su signoff GDS post-fill. Runtime: ore per design grande. DRC clean è necessario ma non sufficiente — LVS e timing anche.",
        "DRC with foundry-qualified tools: Calibre, Pegasus, ICV. Deck version matches process node. Zero violations = pass. Waivers only with documented foundry approval. Classes: spacing, width, via, antenna, density, coloring. DRC run on signoff GDS post-fill. Runtime: hours for large designs. DRC clean is necessary but not sufficient — LVS and timing too."
      ),
      bullets: [
        loc("Deck version = foundry signoff version", "Deck version = foundry signoff version"),
        loc("Zero DRC violation target", "Zero DRC violation target"),
        loc("Waiver tracker con foundry ticket", "Waiver tracker with foundry ticket"),
        loc("DRC runtime e memory budget", "DRC runtime and memory budget"),
      ],
    },
    {
      title: loc("LVS e extraction", "LVS and extraction"),
      content: loc(
        "LVS: confronta netlist schematic (da Verilog) con netlist estratto da layout. Match: device count, net connectivity, parameter. Mismatch comuni: missing device, wrong connection, ECO non riflesso. Extraction: da layout GDS a RC netlist per STA post-route. QRC, StarRC, Quantus. Corners: typical, best, worst. Il parasitic estratto alimenta signoff STA.",
        "LVS: compares schematic netlist (from Verilog) with layout-extracted netlist. Match: device count, net connectivity, parameters. Common mismatches: missing device, wrong connection, ECO not reflected. Extraction: from layout GDS to RC netlist for post-route STA. QRC, StarRC, Quantus. Corners: typical, best, worst. Extracted parasitics feed signoff STA."
      ),
      bullets: [
        loc("LVS clean = zero device/net mismatch", "LVS clean = zero device/net mismatch"),
        loc("RC corner allineato a STA MMMC", "RC corner aligned to STA MMMC"),
        loc("Extraction dopo fill insertion", "Extraction after fill insertion"),
        loc("XRC per cross-coupling SI", "XRC for cross-coupling SI"),
      ],
    },
    {
      title: loc("Antenna e reliability", "Antenna and reliability"),
      content: loc(
        "Antenna effect: plasma etch durante manufacturing carica gate ossido senza protezione. Ratio antenna = area metal / gate area. Fix: diode clamp, metal jumper a layer superiore, gate array. HCI (Hot Carrier Injection) e NBTI: aging device. Reliability sim con foundry model. MTBF target 10–15 anni consumer.",
        "Antenna effect: plasma etch during manufacturing charges oxide gate without protection. Antenna ratio = metal area / gate area. Fix: diode clamp, metal jumper to upper layer, gate array. HCI and NBTI: device aging. Reliability sim with foundry model. MTBF target 10–15 years consumer."
      ),
      bullets: [
        loc("Antenna ratio < foundry max", "Antenna ratio < foundry max"),
        loc("Diode clamp su gate esposti", "Diode clamp on exposed gates"),
        loc("HCI/NBTI derate per aging", "HCI/NBTI derate for aging"),
        loc("Reliability report in signoff", "Reliability report in signoff"),
      ],
    },
    {
      title: loc("XOR e revision compare", "XOR and revision compare"),
      content: loc(
        "XOR tra due GDS: evidenzia differenze geometriche. Usato per verificare che ECO layout matchi intenzione, che fill non alteri funzione, che tapeout GDS matchi signoff GDS. Ogni ECO deve avere XOR clean tra pre e post (solo aree modificate). Revision control su GDS con checksum.",
        "XOR between two GDS databases: highlights geometric differences. Used to verify ECO layout matches intent, fill does not alter function, tapeout GDS matches signoff GDS. Every ECO must have XOR clean between pre and post (modified areas only). GDS revision control with checksum."
      ),
      bullets: [
        loc("XOR signoff vs tapeout GDS", "XOR signoff vs tapeout GDS"),
        loc("ECO XOR pre/post", "ECO XOR pre/post"),
        loc("GDS checksum in release manifest", "GDS checksum in release manifest"),
        loc("Version tag per ogni GDS drop", "Version tag per GDS drop"),
      ],
    },
  ],
  power: [
    {
      title: loc("Dynamic vs leakage power", "Dynamic vs leakage power"),
      content: loc(
        "Dynamic power: P_dyn = α · C · V² · f (activity × capacitance × voltage² × frequency). Leakage: P_leak = I_subthreshold · V (dipende da VT). A 28 nm leakage ~30% totale; a 7 nm può essere 40–50%. Tecniche: clock gating (riduce α), power gating (riduce leakage), DVFS (riduce V e f), multi-VT (HVT per non-critical). Power signoff: VCD/SAIF activity da sim rappresentativa.",
        "Dynamic power: P_dyn = α · C · V² · f. Leakage: P_leak = I_subthreshold · V (VT-dependent). At 28 nm leakage ~30% total; at 7 nm can be 40–50%. Techniques: clock gating (reduces α), power gating (reduces leakage), DVFS (reduces V and f), multi-VT (HVT for non-critical). Power signoff: VCD/SAIF activity from representative sim."
      ),
      bullets: [
        loc("Activity factor α da gate-level sim", "Activity factor α from gate-level sim"),
        loc("Leakage budget per VT mix", "Leakage budget per VT mix"),
        loc("Clock gating coverage report", "Clock gating coverage report"),
        loc("Power gating domain list", "Power gating domain list"),
      ],
    },
    {
      title: loc("IR drop analysis", "IR drop analysis"),
      content: loc(
        "IR drop: V_eff = VDD − I · R_grid. Static IR: corrente media. Dynamic IR: di/dt × L + I × R (rush current). Tool: Voltus, RedHawk. Target: <5% VDD drop su path critico. Fix: widen strap, add via, add decap, move switching logic. Vectorless vs vector-based: vector-based usa VCD reale, più accurato. IR hotspot map guida PDN fix.",
        "IR drop: V_eff = VDD − I · R_grid. Static IR: average current. Dynamic IR: di/dt × L + I × R (rush current). Tools: Voltus, RedHawk. Target: <5% VDD drop on critical path. Fix: widen strap, add vias, add decap, move switching logic. Vectorless vs vector-based: vector-based uses real VCD, more accurate. IR hotspot map guides PDN fix."
      ),
      bullets: [
        loc("Static + dynamic IR per domain", "Static + dynamic IR per domain"),
        loc("VCD vector da functional sim", "VCD vectors from functional sim"),
        loc("IR hotspot → PDN ECO", "IR hotspot → PDN ECO"),
        loc("Rush current during power-on", "Rush current during power-on"),
      ],
    },
    {
      title: loc("EM signoff", "EM signoff"),
      content: loc(
        "EM (Electromigration): J > J_max per tempo → open circuit. Power EM su strap/via; signal EM su signal net con alta toggling. Lifetime: 10 yr @ T_max. Fix: widen metal, via doubling, reroute. EM e IR sono coupled: fix IR può peggiorare EM. Signoff obbligatorio foundry. Automotive/medical: lifetime più lungo, J_max più basso.",
        "EM: J > J_max over time → open circuit. Power EM on straps/vias; signal EM on high-toggle signal nets. Lifetime: 10 yr @ T_max. Fix: widen metal, via doubling, reroute. EM and IR are coupled: IR fix can worsen EM. Mandatory foundry signoff. Automotive/medical: longer lifetime, lower J_max."
      ),
      bullets: [
        loc("J_max da DRM per layer e T", "J_max from DRM per layer and T"),
        loc("Power EM + signal EM reports", "Power EM + signal EM reports"),
        loc("Via EM array rule", "Via EM array rule"),
        loc("Lifetime vs temperature trade-off", "Lifetime vs temperature trade-off"),
      ],
    },
    {
      title: loc("Thermal analysis", "Thermal analysis"),
      content: loc(
        "Thermal: P_diss × R_th = ΔT. Hotspot locale riduce reliability e aumenta leakage (positive feedback). Package thermal model da package team. Junction temperature T_j = T_amb + P · R_th. Target T_j < 105°C consumer. Thermal-aware placement: spreading hot logic. Floorplan: hot spot lontano da analog sensibile.",
        "Thermal: P_diss × R_th = ΔT. Local hotspot reduces reliability and increases leakage (positive feedback). Package thermal model from package team. Junction temperature T_j = T_amb + P · R_th. Target T_j < 105°C consumer. Thermal-aware placement: spread hot logic. Floorplan: hot spot away from sensitive analog."
      ),
      bullets: [
        loc("T_j estimate da power × R_th", "T_j estimate from power × R_th"),
        loc("Hotspot map post-power analysis", "Hotspot map post-power analysis"),
        loc("Thermal constraint in floorplan", "Thermal constraint in floorplan"),
        loc("Package R_th da datasheet", "Package R_th from datasheet"),
      ],
    },
  ],
  package: [
    {
      title: loc("Flip-chip vs wire-bond", "Flip-chip vs wire-bond"),
      content: loc(
        "Wire-bond: pad sul perimetro, filo dorato al package. Limitato da pad count e inductance. Flip-chip: bump su area die, RDL collega a package. Più IO, minore inductance, migliore power delivery. Costo package maggiore. Bump pitch: 150 µm (coarse) a 40 µm (fine). Choice dipende da IO count, power, costo, thermal.",
        "Wire-bond: perimeter pads, gold wire to package. Limited by pad count and inductance. Flip-chip: die-area bumps, RDL to package. More IO, lower inductance, better power delivery. Higher package cost. Bump pitch: 150 µm (coarse) to 40 µm (fine). Choice depends on IO count, power, cost, thermal."
      ),
      bullets: [
        loc("IO count threshold per flip-chip", "IO count threshold for flip-chip"),
        loc("Bump pitch da package spec", "Bump pitch from package spec"),
        loc("RDL layer count", "RDL layer count"),
        loc("Cost trade-off wire-bond vs FC", "Cost trade-off wire-bond vs flip-chip"),
      ],
    },
    {
      title: loc("SI package e SSO", "Package SI and SSO"),
      content: loc(
        "Package SI: inductance e capacitance del package aggiungono delay e noise su IO. SSO (Simultaneous Switching Output): molti IO switchano insieme → ground bounce, VDD droop. Fix: stagger switching, decap package, ground bump ratio. DDR: DQS/DQ skew budget include package. IBIS model per IO timing signoff.",
        "Package SI: package inductance and capacitance add delay and noise on IO. SSO: many IO switching together → ground bounce, VDD droop. Fix: stagger switching, package decap, ground bump ratio. DDR: DQS/DQ skew budget includes package. IBIS model for IO timing signoff."
      ),
      bullets: [
        loc("SSO simulation con IBIS", "SSO simulation with IBIS"),
        loc("Ground bump ratio > 1:1 power", "Ground bump ratio > 1:1 power"),
        loc("Package delay in set_input/output_delay", "Package delay in set_input/output_delay"),
        loc("DDR eye diagram con package", "DDR eye diagram with package"),
      ],
    },
    {
      title: loc("Thermal package", "Package thermal"),
      content: loc(
        "R_th junction-to-ambient da package datasheet. Heat spreader, lid, TIM (thermal interface material). Power budget package-limited per mobile. Thermal vias in substrate. Co-design die-package: bump placement per power, thermal constraint in floorplan. T_j monitor con on-die sensor.",
        "R_th junction-to-ambient from package datasheet. Heat spreader, lid, TIM. Package-limited power budget for mobile. Thermal vias in substrate. Die-package co-design: bump placement for power, thermal constraint in floorplan. T_j monitor with on-die sensor."
      ),
      bullets: [
        loc("R_th da package team", "R_th from package team"),
        loc("T_j max per product spec", "T_j max per product spec"),
        loc("Thermal sensor placement", "Thermal sensor placement"),
        loc("Heat spreader per high-power", "Heat spreader for high-power"),
      ],
    },
    {
      title: loc("Co-design checklist", "Co-design checklist"),
      content: loc(
        "Die-package co-design: bump map draft in floorplan, package team valida pitch e array. Power bump count da IR. IO bump verso package pin. Thermal model feedback su hotspot. Signoff include package model in IO timing. Il PD non lavora in isolamento — weekly sync con package team.",
        "Die-package co-design: draft bump map in floorplan, package team validates pitch and array. Power bump count from IR. IO bumps toward package pins. Thermal model feedback on hotspots. Signoff includes package model in IO timing. PD does not work in isolation — weekly sync with package team."
      ),
      bullets: [
        loc("Bump map review con package", "Bump map review with package"),
        loc("Power/ground bump ratio", "Power/ground bump ratio"),
        loc("IO timing con package delay", "IO timing with package delay"),
        loc("Thermal feedback loop", "Thermal feedback loop"),
      ],
    },
  ],
  tapeout: [
    {
      title: loc("GKC e signoff matrix", "GKC and signoff matrix"),
      content: loc(
        "GKC (Golden Kit Check): foundry valida che il design rispetti tutti i requisiti processo. Signoff matrix: DRC, LVS, STA (WNS/hold), IR, EM, antenna, density, fill. Ogni check con tool version e deck version documentati. Zero waiver non approvato. Il GKC è il gate legale prima del mask order.",
        "GKC: foundry validates design meets all process requirements. Signoff matrix: DRC, LVS, STA (WNS/hold), IR, EM, antenna, density, fill. Each check with documented tool and deck version. Zero unapproved waivers. GKC is the legal gate before mask order."
      ),
      bullets: [
        loc("Signoff matrix Excel con versioni", "Signoff matrix spreadsheet with versions"),
        loc("GKC checklist foundry-specific", "GKC checklist foundry-specific"),
        loc("Waiver log con approval ID", "Waiver log with approval ID"),
        loc("Tool version freeze per tapeout", "Tool version freeze for tapeout"),
      ],
    },
    {
      title: loc("Mask order e reticle", "Mask order and reticle"),
      content: loc(
        "Mask order: GDS → foundry fracturing → reticle generation. MPW (Multi-Project Wafer) per prototipo; full mask set per produzione. Costo mask: $M per node avanzato. Layer count: 30–80+ a 7 nm. Reticle inspection prima del wafer run. Turnaround: 8–12 settimane fab + package.",
        "Mask order: GDS → foundry fracturing → reticle generation. MPW for prototype; full mask set for production. Mask cost: $M at advanced nodes. Layer count: 30–80+ at 7 nm. Reticle inspection before wafer run. Turnaround: 8–12 weeks fab + package."
      ),
      bullets: [
        loc("MPW vs full mask decision", "MPW vs full mask decision"),
        loc("Layer count da process deck", "Layer count from process deck"),
        loc("Reticle inspection report", "Reticle inspection report"),
        loc("Fab turnaround schedule", "Fab turnaround schedule"),
      ],
    },
    {
      title: loc("Documentation e handoff", "Documentation and handoff"),
      content: loc(
        "Tapeout package: GDS, netlist Verilog, SDC, UPF, LEF/DEF, signoff reports, waiver log, IP list con version, README con tool version. Foundry portal upload. Design review meeting con foundry AE. Post-tapeout: monitor prima silicon, bring-up plan, ATE program.",
        "Tapeout package: GDS, Verilog netlist, SDC, UPF, LEF/DEF, signoff reports, waiver log, IP list with versions, README with tool versions. Foundry portal upload. Design review with foundry AE. Post-tapeout: monitor first silicon, bring-up plan, ATE program."
      ),
      bullets: [
        loc("Tapeout checklist 50+ item", "Tapeout checklist 50+ items"),
        loc("IP version manifest", "IP version manifest"),
        loc("Tool version manifest", "Tool version manifest"),
        loc("Bring-up plan document", "Bring-up plan document"),
      ],
    },
    {
      title: loc("Post-silicon e yield", "Post-silicon and yield"),
      content: loc(
        "First silicon: ATE test, shmoo plot (V×f), debug con scan/BIST. Yield: % die buoni per wafer. DFT coverage correlato a defect detection. Failure analysis: optical, SEM, FIB. ECO metal-only per fix. Respins costano $M e mesi — il signoff rigoroso è economia, non burocrazia.",
        "First silicon: ATE test, shmoo plot (V×f), debug with scan/BIST. Yield: % good die per wafer. DFT coverage correlates to defect detection. Failure analysis: optical, SEM, FIB. Metal-only ECO for fix. Respins cost $M and months — rigorous signoff is economics, not bureaucracy."
      ),
      bullets: [
        loc("ATE program da DFT netlist", "ATE program from DFT netlist"),
        loc("Shmoo V×f per signoff margin", "Shmoo V×f for signoff margin"),
        loc("Yield learning per process", "Yield learning per process"),
        loc("ECO turnaround per respin decision", "ECO turnaround for respin decision"),
      ],
    },
  ],
};
