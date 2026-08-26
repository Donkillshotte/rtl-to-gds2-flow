import { loc, type Localized } from "@/i18n/context";
import type { StageId } from "./stages";

export interface SourcedParagraph {
  body: Localized;
  /** ids from src/data/sources.ts */
  refs: string[];
}

export interface StageSourcedEssay {
  kicker: Localized;
  paragraphs: SourcedParagraph[];
}

export const stageSourcedEssays: Record<StageId, StageSourcedEssay> = {
  rtl: {
    kicker: loc(
      "L'RTL è già microarchitettura fisica: ogni ciclo, crossing e stato di potenza anticipa un vincolo che il backend dovrà chiudere.",
      "RTL is already physical microarchitecture: every cycle, crossing, and power state anticipates a constraint the backend must close."
    ),
    paragraphs: [
      {
        body: loc(
          "Il budget di ciclo si traduce in profondità logica con il logical effort d = gh + p e con il ritardo di path D = Σd_i, non contando semplicemente gli operatori RTL (Sutherland et al.; Harris & Weste). Se un clock da 1 GHz offre 1000 ps e clock-to-Q, setup, skew e jitter consumano 220 ps, restano 780 ps; con un FO4 caratterizzato a 12 ps il tetto teorico è circa 65 FO4, da ridurre ancora per interconnect e variazione. Design Compiler o Genus possono riportare un path da 78 FO4 dopo elaboration, segnalando che retiming e sizing non sostituiranno una pipeline mancante. Un moltiplicatore 64×64, una priority encoder larga o una catena ready combinatoria devono quindi essere spezzati a RTL prima della sintesi fisica. Il failure mode è un WNS strutturalmente negativo a ogni corner, seguito da buffer e celle LVT che aumentano potenza senza recuperare un intero ciclo.",
          "Cycle budget becomes logic depth through logical effort d = gh + p and path delay D = Σd_i, not by merely counting RTL operators (Sutherland et al.; Harris & Weste). If a 1 GHz clock provides 1000 ps and clock-to-Q, setup, skew, and jitter consume 220 ps, 780 ps remain; with a characterized 12 ps FO4 the theoretical ceiling is about 65 FO4, reduced further for interconnect and variation. Design Compiler or Genus may report a 78-FO4 path after elaboration, showing that retiming and sizing cannot replace a missing pipeline stage. A 64×64 multiplier, a wide priority encoder, or a combinational ready chain must therefore be split at RTL before physical synthesis. The failure mode is structurally negative WNS at every corner, followed by buffers and LVT cells that raise power without recovering a full cycle."
        ),
        refs: ["logical-effort", "harris-weste"],
      },
      {
        body: loc(
          "IEEE 1800 assegna ad always_comb una semantica che rende evidente l'obbligo di valorizzare ogni uscita su ogni cammino, mentre un ramo mancante inferisce memoria invece di logica combinatoria (IEEE 1800). Un blocco `if (en) q_next = d;` senza default descrive un latch trasparente, e non un mux, perché q_next deve conservare il valore quando en vale zero. Verible, SpyGlass e Questa Lint intercettano il problema prima che Design Compiler introduca una cella latch con check di recovery, removal e time borrowing inattesi. Con Tclk = 800 ps, una finestra di trasparenza di 150 ps può mascherare un path in simulazione RTL ma creare una race di hold da 40 ps nella netlist. Il failure mode tipico è una divergenza simulazione-sintesi o un loop temporale difficile da vincolare, perciò default assignment, always_ff e reset espliciti sono proprietà funzionali e non solo stile.",
          "IEEE 1800 gives always_comb semantics that expose the obligation to assign every output on every path, while a missing branch infers storage rather than combinational logic (IEEE 1800). A block such as `if (en) q_next = d;` without a default describes a transparent latch, not a mux, because q_next must retain its value when en is zero. Verible, SpyGlass, and Questa Lint catch the issue before Design Compiler introduces a latch cell with unexpected recovery, removal, and time-borrowing checks. With Tclk = 800 ps, a 150 ps transparency window can hide a path in RTL simulation yet create a 40 ps hold race in the netlist. The usual failure mode is simulation-synthesis divergence or a timing loop that is hard to constrain, so default assignments, always_ff, and explicit reset behavior are functional properties rather than mere style."
        ),
        refs: ["ieee-1800"],
      },
      {
        body: loc(
          "Un crossing asincrono non si rende sicuro con una direttiva false-path: il rischio residuo si dimensiona con MTBF ≈ exp(t_r/τ)/(f_clk·f_data·T_0) (Metastability MTBF). Con τ = 20 ps, T_0 = 10 ps, f_clk = 500 MHz e f_data = 100 MHz, aggiungere 500 ps al tempo di risoluzione moltiplica l'MTBF per exp(25), circa 7,2×10^10. SpyGlass CDC o Questa CDC devono distinguere un controllo single-bit da un bus: il primo usa due o tre flop, il secondo richiede handshake o FIFO asincrona con puntatori Gray. Due bit sincronizzati indipendentemente possono arrivare in cicli diversi, producendo una parola impossibile anche se ciascun flop ha un eccellente MTBF. Il failure mode è una corruzione intermittente dipendente da PVT e fase relativa, invisibile a milioni di vettori RTL ma riproducibile in silicio solo dopo ore o mesi.",
          "An asynchronous crossing is not made safe by a false-path directive: residual risk is sized with MTBF ≈ exp(t_r/τ)/(f_clk·f_data·T_0) (Metastability MTBF). With τ = 20 ps, T_0 = 10 ps, f_clk = 500 MHz, and f_data = 100 MHz, adding 500 ps of resolution time multiplies MTBF by exp(25), about 7.2×10^10. SpyGlass CDC or Questa CDC must distinguish a single-bit control from a bus: the former uses two or three flops, while the latter needs a handshake or asynchronous FIFO with Gray pointers. Two independently synchronized bits can arrive in different cycles, producing an impossible word even when each flop has excellent MTBF. The failure mode is intermittent corruption dependent on PVT and relative phase, invisible to millions of RTL vectors yet reproducible in silicon only after hours or months."
        ),
        refs: ["metastability"],
      },
      {
        body: loc(
          "Il power intent separato dal comportamento usa IEEE 1801 per dichiarare supply set, power domain, isolation, level shifter, retention e power-state table (IEEE 1801). Un crossing da 0,8 V a 1,0 V può richiedere un level shifter, mentre un'uscita di un dominio spento deve essere clampata prima che propaghi X o alimentazione inversa. VCS NLP, Questa Power Aware e Conformal Low Power verificano la sequenza save–isolate–switch-off e la corrispondenza tra UPF e netlist. Se 20 000 flop retention vengono salvati nello stesso ciclo, il picco di corrente e il tempo di wake-up devono essere inclusi nell'architettura, non delegati alla PDN. Il failure mode è un dominio che simula correttamente sempre acceso ma perde stato, contende un bus o back-powera celle quando la power-state table attiva una combinazione reale.",
          "Power intent separated from behavior uses IEEE 1801 to declare supply sets, power domains, isolation, level shifters, retention, and the power-state table (IEEE 1801). A 0.8 V to 1.0 V crossing may require a level shifter, while an output from a shut-down domain must be clamped before it propagates X values or reverse power. VCS NLP, Questa Power Aware, and Conformal Low Power verify the save–isolate–switch-off sequence and agreement between UPF and the netlist. If 20,000 retention flops are saved in one cycle, peak current and wake-up time must be architectural inputs rather than delegated to the PDN. The failure mode is a domain that simulates correctly while always on but loses state, contends a bus, or back-powers cells when the power-state table activates a real combination."
        ),
        refs: ["ieee-1801"],
      },
      {
        body: loc(
          "La testabilità deve entrare nell'RTL attraverso scan enable, memory BIST, test clock e accesso TAP, non essere aggiunta dopo il placement (Bushnell & Agrawal; IEEE 1149.1). Una catena scan di 100 000 flop richiede 100 000 cicli senza compressione, mentre una compressione 100× riduce il tempo ATE ma introduce decompressor, compactor e vincoli X-mask. Tessent o Modus generano ATPG stuck-at e transition; un obiettivo industriale può essere oltre il 99% di stuck-at coverage, con ogni fault non testabile classificato e non semplicemente escluso. IEEE 1149.1 definisce TCK, TMS, TDI, TDO e instruction register per boundary scan, mentre l'OCC deve produrre impulsi at-speed puliti per i test di transizione. Il failure mode è un chip funzionale ma non osservabile, una chain spezzata o un clock test non controllabile che riduce copertura e rende impossibile separare difetti di fabbrica da bug logici.",
          "Testability must enter RTL through scan enable, memory BIST, test clocks, and TAP access rather than being added after placement (Bushnell & Agrawal; IEEE 1149.1). A scan chain with 100,000 flops needs 100,000 cycles without compression, while 100× compression cuts ATE time but introduces decompressor, compactor, and X-mask constraints. Tessent or Modus generates stuck-at and transition ATPG; an industrial target may exceed 99% stuck-at coverage, with every untestable fault classified rather than simply excluded. IEEE 1149.1 defines TCK, TMS, TDI, TDO, and the instruction register for boundary scan, while the OCC must generate clean at-speed pulses for transition tests. The failure mode is a functional but unobservable chip, a broken chain, or an uncontrollable test clock that lowers coverage and makes manufacturing defects indistinguishable from logic bugs."
        ),
        refs: ["bushnell-agrawal", "ieee-1149"],
      },
    ],
  },
  verification: {
    kicker: loc(
      "La verifica produce evidenze diverse e complementari: esempi dinamici, prove matematiche, equivalenza e misure esplicite di ciò che resta non esplorato.",
      "Verification produces different and complementary evidence: dynamic examples, mathematical proofs, equivalence, and explicit measurements of what remains unexplored."
    ),
    paragraphs: [
      {
        body: loc(
          "La simulazione esplora tracce selezionate, mentre il formal cerca controesempi su tutti gli input ammessi dal modello e dalle assumption (IEEE 1800). VCS, Xcelium o Questa possono eseguire 10^9 cicli UVM e avviare software reale, ma non enumerano uno spazio di stato da 2^200 combinazioni. JasperGold o VC Formal provano proprietà come `assert property(req |-> ##[1:4] ack)` e restituiscono una trace minima quando la proprietà fallisce. Una prova bounded a 40 cicli non equivale a una prova unbounded, e assumption troppo forti possono rendere una proprietà vacuamente vera. Il failure mode è dichiarare signoff perché la regressione è verde o il formal dice proven, senza dimostrare che stimulus, fairness e constraint rappresentino l'ambiente reale.",
          "Simulation explores selected traces, whereas formal searches for counterexamples over every input allowed by the model and its assumptions (IEEE 1800). VCS, Xcelium, or Questa can run 10^9 UVM cycles and boot real software, but they do not enumerate a 2^200-state space. JasperGold or VC Formal proves properties such as `assert property(req |-> ##[1:4] ack)` and returns a minimal trace when a property fails. A proof bounded to 40 cycles is not an unbounded proof, and over-constraining assumptions can make a property vacuously true. The failure mode is declaring signoff because regression is green or formal says proven without showing that stimulus, fairness, and constraints represent the real environment."
        ),
        refs: ["ieee-1800"],
      },
      {
        body: loc(
          "La coverage closure combina code coverage, functional coverage, assertion coverage e mutation o fault-oriented evidence, perché nessuna percentuale singola misura la correttezza (IEEE 1800). Se 950 dei 1000 bin pianificati sono hit, la functional coverage è 95%, ma un cross mode×opcode può nascondere tutti i casi di retention su una specifica istruzione. IMC, Verdi Coverage o Questa UCDB fondono regressioni e mostrano line, branch, toggle, FSM e covergroup, mentre i bin illegali devono avere una giustificazione verificabile. Il 100% di line coverage può ancora lasciare un branch mai preso o un'assertion mai attivata; una cover property irraggiungibile segnala spesso constraint formal sbagliati. Il failure mode è inseguire il numero aggregato escludendo i bin difficili, così reset simultanei, backpressure lunga o transizioni low-power non vengono mai osservati.",
          "Coverage closure combines code, functional, assertion, and mutation or fault-oriented evidence because no single percentage measures correctness (IEEE 1800). If 950 of 1,000 planned bins are hit, functional coverage is 95%, yet a mode×opcode cross may hide every retention case for one instruction. IMC, Verdi Coverage, or Questa UCDB merges regressions and reports line, branch, toggle, FSM, and covergroup data, while illegal bins need auditable justification. One hundred percent line coverage can still leave a branch untaken or an assertion never activated; an unreachable cover property often reveals bad formal constraints. The failure mode is chasing the aggregate number by excluding difficult bins, so simultaneous resets, long backpressure, or low-power transitions are never observed."
        ),
        refs: ["ieee-1800"],
      },
      {
        body: loc(
          "Il Logic Equivalence Check confronta una rappresentazione golden e una revised per provare che sintesi, scan insertion o ECO non abbiano cambiato la funzione osservabile (IEEE 1800). Formality e Conformal costruiscono compare point su registri e uscite, applicano constant propagation e gestiscono renaming, clock gating e retiming con mapping esplicito. Un run con 2 milioni di compare point deve chiuderli tutti o classificare ogni abort, perché 99,99% non è equivalenza. Latch inferiti, reset X, black box con modelli diversi e un inverter spare cablato al pin errato sono cause comuni di non-equivalence. Il failure mode è accettare una gate-level simulation limitata al posto della prova, lasciando che un ECO metal-only modifichi una funzione su un pattern non simulato.",
          "Logic Equivalence Checking compares a golden and a revised representation to prove that synthesis, scan insertion, or an ECO has not changed observable function (IEEE 1800). Formality and Conformal build compare points on registers and outputs, propagate constants, and handle renaming, clock gating, and retiming through explicit mapping. A run with two million compare points must close all of them or classify every abort, because 99.99% is not equivalence. Inferred latches, reset X values, black boxes with different models, and a spare inverter wired to the wrong pin are common causes of non-equivalence. The failure mode is accepting limited gate-level simulation instead of proof, allowing a metal-only ECO to change behavior on an unsimulated pattern."
        ),
        refs: ["ieee-1800"],
      },
      {
        body: loc(
          "CDC e RDC verificano struttura, protocollo e convergenza, non solo la presenza nominale di due flop (Metastability MTBF). La formula MTBF ≈ exp(t_r/τ)/(f_clk·f_data·T_0) dimensiona il sincronizzatore, ma un pulse di 600 ps può comunque sparire entrando in un dominio da 500 MHz. Questa CDC o SpyGlass CDC controllano pulse stretchi, handshake, FIFO Gray, reconvergence e reset async-assert/sync-deassert per ogni dominio. Due segnali dello stesso bundle sincronizzati separatamente possono riconvergere in una FSM e generare uno stato illegale, anche con MTBF individuale superiore a 10^12 anni. Il failure mode è un errore di protocollo deterministico mascherato come metastabilità statistica, oppure un reset rilasciato vicino al clock che divide i flop tra due stati iniziali.",
          "CDC and RDC verify structure, protocol, and reconvergence, not merely the nominal presence of two flops (Metastability MTBF). MTBF ≈ exp(t_r/τ)/(f_clk·f_data·T_0) sizes the synchronizer, yet a 600 ps pulse can still disappear when entering a 500 MHz domain. Questa CDC or SpyGlass CDC checks pulse stretching, handshakes, Gray FIFOs, reconvergence, and asynchronous-assert/synchronous-deassert reset behavior for every domain. Two signals from one bundle synchronized separately can reconverge in an FSM and create an illegal state even when each individual MTBF exceeds 10^12 years. The failure mode is a deterministic protocol error mislabeled as statistical metastability, or a reset released near a clock edge that splits flops between initial states."
        ),
        refs: ["metastability"],
      },
      {
        body: loc(
          "La verifica DFT misura detectability dei modelli di guasto, non la sola connettività delle scan chain (Bushnell & Agrawal; IEEE 1149.1). Tessent e Modus calcolano fault coverage = detected faults/total target faults per stuck-at, transition e talvolta path-delay, con obiettivi tipici superiori al 99% per lo stuck-at. Una chain da 50 000 bit può shiftare correttamente a 10 MHz ma fallire il capture at-speed a 1 GHz se l'OCC o i lock-up latch sono modellati male. La simulazione JTAG verifica la TAP state machine e le istruzioni EXTEST, SAMPLE e BYPASS definite da IEEE 1149.1, mentre l'ATPG controlla X sources, compression e test-point insertion. Il failure mode è un report di coverage gonfiato da fault esclusi senza rationale, che lascia bridging o transition defects non osservabili all'ATE.",
          "DFT verification measures detectability of fault models, not scan-chain connectivity alone (Bushnell & Agrawal; IEEE 1149.1). Tessent and Modus compute fault coverage = detected faults/total target faults for stuck-at, transition, and sometimes path-delay models, with stuck-at targets commonly above 99%. A 50,000-bit chain may shift correctly at 10 MHz yet fail 1 GHz at-speed capture if the OCC or lock-up latches are modeled incorrectly. JTAG simulation checks the TAP state machine and EXTEST, SAMPLE, and BYPASS instructions defined by IEEE 1149.1, while ATPG checks X sources, compression, and test-point insertion. The failure mode is a coverage report inflated by unexplained fault exclusions, leaving bridging or transition defects unobservable at ATE."
        ),
        refs: ["bushnell-agrawal", "ieee-1149"],
      },
    ],
  },
  synthesis: {
    kicker: loc(
      "La sintesi è un'ottimizzazione vincolata: la netlist è credibile solo quanto i modelli Liberty, gli SDC e l'equivalenza che la sostengono.",
      "Synthesis is constrained optimization: the netlist is only as credible as the Liberty models, SDC constraints, and equivalence supporting it."
    ),
    paragraphs: [
      {
        body: loc(
          "Design Compiler, Fusion Compiler e Genus elaborano parametri e generate, trasformano la logica e la mappano su celle concrete guidati dagli SDC (SDC). Con create_clock -period 0.8, set_input_delay 0.2 e setup interno di 0.06 ns, un path input-to-register non dispone di 800 ps ma di circa 540 ps prima di uncertainty e skew. Le trasformazioni includono Boolean factoring, resource sharing, retiming, buffer insertion e VT swap, ciascuna con costo in area o potenza. Un set_false_path privo di giustificazione rimuove il path dall'obiettivo e può produrre WNS positivo su una funzione fisicamente non temporizzata. Il failure mode è una netlist localmente ottima rispetto a constraint incompleti, quindi formalmente equivalente ma incapace di funzionare alla frequenza o nell'interfaccia dichiarata.",
          "Design Compiler, Fusion Compiler, and Genus elaborate parameters and generate blocks, transform logic, and map it to concrete cells under SDC guidance (SDC). With create_clock -period 0.8, set_input_delay 0.2, and 0.06 ns internal setup, an input-to-register path has not 800 ps but roughly 540 ps before uncertainty and skew. Transformations include Boolean factoring, resource sharing, retiming, buffer insertion, and VT swaps, each carrying an area or power cost. An unjustified set_false_path removes a path from the objective and can produce positive WNS for a physically untimed function. The failure mode is a netlist locally optimal for incomplete constraints, formally equivalent yet unable to operate at the declared frequency or interface timing."
        ),
        refs: ["sdc"],
      },
      {
        body: loc(
          "NLDM tabula delay e output slew contro input slew e load capacitance, mentre CCS rappresenta correnti e waveform per modellare meglio waveform deformate e coupling (Liberty/CCS). Una tabella NLDM 7×7 interpola rapidamente, ma oltre max_transition o max_capacitance il tool estrapola fuori dalla caratterizzazione e il numero perde affidabilità. Liberty Variation Format aggiunge distribuzioni e sensitività usate dal POCV, così una cella può portare σ di delay diversa per arco e slew. PrimeTime, Design Compiler e Tempus devono leggere la stessa versione di .lib, CCS e LVF per evitare che synthesis e signoff valutino due circuiti statistici diversi. Il failure mode è celebrare WNS = +30 ps con migliaia di design-rule violations o con modelli NLDM nominali dove il signoff CCS/LVF restituisce −90 ps.",
          "NLDM tabulates delay and output slew against input slew and load capacitance, whereas CCS represents currents and waveforms to model distorted waveforms and coupling more accurately (Liberty/CCS). A 7×7 NLDM table interpolates quickly, but beyond max_transition or max_capacitance the tool extrapolates outside characterization and the number loses credibility. Liberty Variation Format adds distributions and sensitivities used by POCV, so a cell can carry different delay σ values by arc and slew. PrimeTime, Design Compiler, and Tempus must read the same .lib, CCS, and LVF revisions or synthesis and signoff evaluate two different statistical circuits. The failure mode is celebrating WNS = +30 ps with thousands of design-rule violations or nominal NLDM models while CCS/LVF signoff returns −90 ps."
        ),
        refs: ["liberty"],
      },
      {
        body: loc(
          "WNS è il minimo slack tra tutti gli endpoint, mentre TNS = Σmin(0, slack_i) misura la massa totale delle violazioni e conduce a decisioni operative diverse. Un WNS di −120 ps con TNS di −0,12 ns indica un solo path dominante, spesso trattabile con restructuring o pipeline mirata. Un WNS di −8 ps con TNS di −80 ns implica circa 10 000 endpoint marginali e suggerisce clock uncertainty, fanout, corner o architettura globalmente sbagliati. report_timing e report_qor di Design Compiler o Genus devono essere letti insieme a max transition, capacitance, unconstrained endpoints e path groups definiti in SDC. Il failure mode è ottimizzare soltanto il path peggiore fino a WNS zero, mentre migliaia di path continuano a rendere TNS negativo e il placement esplode di buffer.",
          "WNS is the minimum slack over all endpoints, whereas TNS = Σmin(0, slack_i) measures the total violation mass and drives different operational decisions. WNS of −120 ps with TNS of −0.12 ns indicates one dominant path, often addressable through targeted restructuring or pipelining. WNS of −8 ps with TNS of −80 ns implies roughly 10,000 marginal endpoints and points to globally wrong clock uncertainty, fanout, corners, or architecture. Design Compiler or Genus report_timing and report_qor must be read together with max transition, capacitance, unconstrained endpoints, and SDC path groups. The failure mode is optimizing only the worst path to WNS zero while thousands of paths keep TNS negative and placement explodes with buffers."
        ),
        refs: ["sdc"],
      },
      {
        body: loc(
          "Il logical effort separa effort logico g, effort elettrico h = C_out/C_in e parassita p, fornendo d = gh + p per scegliere fanout e numero di stadi (Sutherland et al.; Harris & Weste). Per un effort di path F = 256, quattro stadi danno effort per stadio F^(1/4) = 4, vicino al FO4 usato come riferimento robusto. Fusion Compiler e Genus Physical possono usare stime di placement e RC invece di wire-load model, evitando che una net da 2 mm sembri una capacità concentrata trascurabile. Bufferizzare un fanout di 1024 con un solo driver crea slew e corrente eccessive; una tree bilanciata riduce h per stadio ma consuma area e clock-like routing. Il failure mode è una sintesi logicamente elegante con net ad alto fanout o confini gerarchici lontani, che perde centinaia di ps appena vengono estratti gli interconnect reali.",
          "Logical effort separates logical effort g, electrical effort h = C_out/C_in, and parasitic p, giving d = gh + p to choose fanout and stage count (Sutherland et al.; Harris & Weste). For path effort F = 256, four stages give per-stage effort F^(1/4) = 4, close to the FO4 point used as a robust reference. Fusion Compiler and Genus Physical can use placement and RC estimates instead of wire-load models, preventing a 2 mm net from appearing as negligible lumped capacitance. Driving fanout 1,024 from one cell creates excessive slew and current; a balanced tree lowers h per stage but consumes area and clock-like routing. The failure mode is a logically elegant synthesis with high-fanout nets or distant hierarchy boundaries that loses hundreds of picoseconds once real interconnect is extracted."
        ),
        refs: ["logical-effort", "harris-weste"],
      },
      {
        body: loc(
          "La sintesi low-power implementa l'intento IEEE 1801 inserendo isolation, level shifter, retention e talvolta power-switch logic prima del handoff fisico (IEEE 1801). La scan insertion aggiunge mux o scan flop, riordina catene e applica modelli stuck-at e transition che devono preservare una coverage superiore al target concordato (Bushnell & Agrawal). Conformal Low Power controlla supply e stato, mentre Formality o Conformal LEC confrontano RTL, netlist pre-DFT e netlist post-DFT su tutti i compare point. Un overhead scan del 5–12% in area e carico clock deve comparire nei report, perché una stima PPA pre-scan non è il prodotto consegnato al placement. Il failure mode è un level shifter duplicato, una retention cell alimentata dalla rail spenta o una scan enable non vincolata che rompe equivalenza e timing nei mode funzionale e test.",
          "Low-power synthesis implements IEEE 1801 intent by inserting isolation, level shifters, retention, and sometimes power-switch logic before physical handoff (IEEE 1801). Scan insertion adds muxes or scan flops, reorders chains, and applies stuck-at and transition models that must preserve coverage above the agreed target (Bushnell & Agrawal). Conformal Low Power checks supplies and states, while Formality or Conformal LEC compares RTL, pre-DFT netlist, and post-DFT netlist across every compare point. A 5–12% scan overhead in area and clock load must appear in reports because a pre-scan PPA estimate is not the product sent to placement. The failure mode is a duplicated level shifter, a retention cell fed by the switched rail, or an unconstrained scan enable that breaks equivalence and timing in both functional and test modes."
        ),
        refs: ["ieee-1801", "bushnell-agrawal"],
      },
    ],
  },
  floorplan: {
    kicker: loc(
      "Il floorplan converte area logica, macro, connettività e alimentazioni in una geometria che rende possibile oppure impossibile ogni fase successiva.",
      "Floorplanning converts logic area, macros, connectivity, and supplies into geometry that makes every later phase possible or impossible."
    ),
    paragraphs: [
      {
        body: loc(
          "La utilization va definita sulla CORE area placeable, non sulla DIE area che include IO, seal ring e margini (LEF/DEF). Se le standard cell occupano 2,0 mm² e il target U è 70%, servono almeno 2,86 mm² di area placeable per le row; aggiungendo 3,0 mm² di macro, halo e canali si ottiene una core superiore a 5,86 mm². Innovus floorPlan o ICC2 initialize_floorplan devono escludere macro, hard blockage e voltage area dal denominatore usato per la density locale. Un valore globale del 70% può comunque nascondere bin al 95% attorno ai pin SRAM, dove power strap e routing non lasciano capacità. Il failure mode è calcolare U = area_celle/area_die, scegliere un core troppo piccolo e scoprire dopo place che legalizzazione, CTS buffer e hold fix non hanno siti liberi.",
          "Utilization must be defined on placeable CORE area, not DIE area that includes IO, seal ring, and margins (LEF/DEF). If standard cells occupy 2.0 mm² and target U is 70%, at least 2.86 mm² of placeable row area is needed; adding 3.0 mm² of macros, halos, and channels makes the core larger than 5.86 mm². Innovus floorPlan or ICC2 initialize_floorplan must exclude macros, hard blockages, and voltage areas from the denominator used for local density. A global 70% can still hide 95% bins around SRAM pins where power straps and routing leave little capacity. The failure mode is computing U = cell area/die area, choosing an undersized core, and discovering after placement that legalization, CTS buffers, and hold fixes have no free sites."
        ),
        refs: ["lef-def"],
      },
      {
        body: loc(
          "LEF descrive dimensioni, obstruction, pin e SITE delle macro, mentre DEF registra COMPONENTS, PINS, ROWS e SPECIALNETS del floorplan (LEF/DEF). Flyline e net-weight in Innovus o ICC2 mostrano quali SRAM, PHY e partizioni devono essere adiacenti; un bus AXI da 512 bit lungo 2 mm non si corregge con un solo buffer. Halo da 2–5 µm e canali da 5–10 µm sono punti di partenza dipendenti da PDK, pin density e numero di layer, non regole universali. Orientare una macro con i pin verso il bordo sbagliato aggiunge detour, via ladder e hotspot di global routing anche se il rettangolo è legalmente piazzato. Il failure mode è un canale geometricamente aperto ma elettricamente non routable, che costringe net critiche a circondare la macro e porta setup e congestion fuori budget.",
          "LEF describes macro dimensions, obstructions, pins, and SITE data, while DEF records floorplan COMPONENTS, PINS, ROWS, and SPECIALNETS (LEF/DEF). Flylines and net weights in Innovus or ICC2 reveal which SRAMs, PHYs, and partitions must be adjacent; a 512-bit AXI bus spanning 2 mm is not fixed by one buffer. Halos of 2–5 µm and channels of 5–10 µm are PDK-, pin-density-, and layer-dependent starting points rather than universal rules. Orienting a macro with pins facing the wrong edge adds detours, via ladders, and global-routing hotspots even when the rectangle is legally placed. The failure mode is a geometrically open but electrically unroutable channel that forces critical nets around a macro and pushes setup and congestion beyond budget."
        ),
        refs: ["lef-def"],
      },
      {
        body: loc(
          "Per un albero RC, l'intuizione di Elmore assegna a ogni resistenza il prodotto con tutta la capacità downstream: t_E = ΣR_k·C_down,k (Elmore 1948). Raddoppiare la lunghezza di un filo uniforme raddoppia sia R sia C e rende il ritardo dominante approssimativamente quadratico, quindi un collegamento da 2 mm può costare circa quattro volte quello da 1 mm. Gupta et al. 1997 mostrano perché il ritardo di Elmore resta un upper bound utile per l'ottimizzazione di alberi RC con ingressi generalizzati. Early route, trialRoute o estimate_parasitics in Innovus, ICC2 e OpenROAD trasformano la flyline geometrica in una stima che l'architetto può confrontare con un budget di 200 ps. Il failure mode è accettare una lunga net macro-to-macro usando solo wireload medio, poi estrarre uno SPEF con 350 ps e scoprire che nessun cell sizing elimina il termine RC distribuito.",
          "For an RC tree, Elmore intuition assigns each resistance the product with all downstream capacitance: t_E = ΣR_k·C_down,k (Elmore 1948). Doubling a uniform wire's length doubles both R and C and makes dominant delay approximately quadratic, so a 2 mm connection can cost about four times a 1 mm one. Gupta et al. 1997 explain why Elmore delay remains a useful upper bound for optimizing RC trees with generalized inputs. Innovus, ICC2, and OpenROAD early-route, trial-route, or estimate_parasitics flows turn geometric flylines into estimates an architect can compare against a 200 ps budget. The failure mode is accepting a long macro-to-macro net using only an average wireload, then extracting a 350 ps SPEF and discovering that no cell sizing removes distributed RC."
        ),
        refs: ["elmore-1948", "gupta-elmore"],
      },
      {
        body: loc(
          "Ogni power domain IEEE 1801 deve diventare una voltage area fisica con supply, isolation, level shifter, retention e always-on routing coerenti (IEEE 1801). Un'isola switched da 1 mm² con 20 000 header cell richiede colonne e enable scaglionati, mentre le retention cell devono raggiungere una rail sempre attiva senza attraversare blockage illegali. Innovus e ICC2 possono creare region, fence e power-switch array, e Conformal Low Power verifica che il mapping fisico non contraddica l'UPF golden. Un confine 0,7 V↔0,9 V privo di spazio per level shifter può obbligare il placer a disperderli lontano, aggiungendo latency e net always-on fragili. Il failure mode è una voltage island logicamente corretta ma senza corridoi per secondary PG, isolation e control, che fallisce IR, placement legality o power-aware LVS.",
          "Every IEEE 1801 power domain must become a physical voltage area with coherent supplies, isolation, level shifting, retention, and always-on routing (IEEE 1801). A 1 mm² switched island with 20,000 header cells needs columns and staggered enables, while retention cells must reach an always-on rail without crossing illegal blockages. Innovus and ICC2 can create regions, fences, and power-switch arrays, and Conformal Low Power checks that physical mapping does not contradict the golden UPF. A 0.7 V↔0.9 V boundary with no space for level shifters can force the placer to scatter them far away, adding latency and fragile always-on nets. The failure mode is a logically correct voltage island without corridors for secondary PG, isolation, and control, failing IR, placement legality, or power-aware LVS."
        ),
        refs: ["ieee-1801"],
      },
      {
        body: loc(
          "Il floorplan deve chiudere presto IO, bump, clock root e accesso DFT perché il perimetro del die è una risorsa condivisa con package e test (IEEE 1149.1; LEF/DEF). Un flip-chip con pitch bump di 130 µm può distribuire VDD/VSS sull'area, mentre un wire-bond alimenta dal bordo e allunga il percorso resistivo verso il centro. I pin TCK, TMS, TDI e TDO della TAP IEEE 1149.1 richiedono pad, ESD e routing controllabile anche quando i domini funzionali sono spenti. Innovus Pin Editor, ICC2 e tool package co-design devono validare feedthrough, differential pair, keepout analogici e distanza tra PHY e bump prima di fissare le macro. Il failure mode è congelare il core senza bump map e dover poi spostare un PHY o aprire un corridoio top-level, invalidando macro placement, PDN e timing già ottimizzati.",
          "Floorplanning must close IO, bumps, clock roots, and DFT access early because the die perimeter is shared by package and test (IEEE 1149.1; LEF/DEF). A flip-chip with 130 µm bump pitch can distribute VDD/VSS across the area, while wire bonding feeds from the edge and lengthens the resistive path to the center. IEEE 1149.1 TAP pins TCK, TMS, TDI, and TDO need pads, ESD, and controllable routing even when functional domains are off. Innovus Pin Editor, ICC2, and package co-design tools must validate feedthroughs, differential pairs, analog keepouts, and PHY-to-bump distance before macros are fixed. The failure mode is freezing the core without a bump map and later moving a PHY or opening a top-level corridor, invalidating optimized macro placement, PDN, and timing."
        ),
        refs: ["ieee-1149", "lef-def"],
      },
    ],
  },
  pdn: {
    kicker: loc(
      "La PDN è un circuito distribuito RLC soggetto a corrente, temperatura e affidabilità, non un disegno decorativo di ring e stripe.",
      "The PDN is a distributed RLC circuit constrained by current, temperature, and reliability, not a decorative drawing of rings and stripes."
    ),
    paragraphs: [
      {
        body: loc(
          "Il primo ordine statico è V_drop = I·R: 0,8 A su 36 mΩ produce 28,8 mV, cioè il 3,84% di una rail da 0,75 V (Rabaey et al.). Il percorso include bump, RDL, package, ring, mesh, via stack e M1 rail, quindi una mesh on-die perfetta non corregge 20 mΩ persi nel package. RedHawk e Voltus risolvono la rete estratta con correnti per istanza e riportano hotspot, histogram e percorso resistivo dominante. Un budget statico del 5% lascia soltanto 37,5 mV a 0,75 V, e il margine deve includere tolleranza regulator e variazione locale. Il failure mode è una cella che vede 0,70 V invece di 0,75 V, rallenta fuori dal modello nominale e crea setup failure pur con STA nominale positiva.",
          "The first-order static relation is V_drop = I·R: 0.8 A through 36 mΩ produces 28.8 mV, or 3.84% of a 0.75 V rail (Rabaey et al.). The path includes bump, RDL, package, ring, mesh, via stack, and M1 rail, so a perfect on-die mesh cannot fix 20 mΩ lost in the package. RedHawk and Voltus solve the extracted network with per-instance currents and report hotspots, histograms, and the dominant resistive path. A 5% static budget leaves only 37.5 mV at 0.75 V, and margin must include regulator tolerance and local variation. The failure mode is a cell seeing 0.70 V instead of 0.75 V, slowing beyond its nominal model and creating a setup failure despite positive nominal STA."
        ),
        refs: ["rabaey"],
      },
      {
        body: loc(
          "Il droop dinamico aggiunge ΔV_L = L·di/dt e la capacità locale fornisce approssimativamente C ≥ I·Δt/ΔV (Rabaey et al.). Un salto di 2 A in 200 ps attraverso 50 pH genera idealmente 0,5 V induttivi, mentre sostenere 1 A per 100 ps entro 50 mV richiede almeno 2 nF di decap ideale. Voltus Dynamic o RedHawk-SC combinano package RLC, switching VCD/FSDB e finestre temporali per trovare WORST_dI/dt, non soltanto la massima potenza media. Aggiungere decap vicino all'hotspot abbassa l'impedenza ad alta frequenza ma aumenta area, leakage e inrush durante power-up. Il failure mode è una droop breve di 150 ps coincidente con il clock capture, invisibile alla static IR e sufficiente a trasformare un path marginale in errore funzionale.",
          "Dynamic droop adds ΔV_L = L·di/dt, and local capacitance supplies approximately C ≥ I·Δt/ΔV (Rabaey et al.). A 2 A step in 200 ps through 50 pH ideally creates 0.5 V of inductive droop, while sustaining 1 A for 100 ps within 50 mV needs at least 2 nF of ideal decap. Voltus Dynamic or RedHawk-SC combines package RLC, VCD/FSDB switching, and timing windows to find WORST_dI/dt rather than only maximum average power. Adding decap near a hotspot lowers high-frequency impedance but raises area, leakage, and power-up inrush. The failure mode is a 150 ps droop coincident with the capture edge, invisible to static IR yet sufficient to turn a marginal path into a functional error."
        ),
        refs: ["rabaey"],
      },
      {
        body: loc(
          "L'affidabilità EM viene stimata con MTTF = A/j^n·exp(E_a/kT), con n tipicamente circa 1–2 a seconda del meccanismo e della calibrazione di processo (Black 1969). Se n = 2 e la current density cresce del 50%, il fattore di vita dovuto a j diventa 1/1,5² ≈ 0,44 prima ancora dell'accelerazione termica. RedHawk, Voltus o Calibre PERC confrontano corrente average, RMS e peak con limiti foundry distinti per wire e via. Aumentare width, promuovere layer o usare quattro via in parallelo riduce j, ma la distribuzione non uniforme può lasciare una cut sovraccarica. Il failure mode è nucleazione di void e infine open circuit dopo mesi o anni, perciò un check IR verde non implica in alcun modo EM verde.",
          "EM reliability is estimated with MTTF = A/j^n·exp(E_a/kT), with n commonly around 1–2 depending on mechanism and process calibration (Black 1969). If n = 2 and current density rises by 50%, the lifetime factor due to j becomes 1/1.5² ≈ 0.44 even before thermal acceleration. RedHawk, Voltus, or Calibre PERC compares average, RMS, and peak current against distinct foundry limits for wires and vias. Increasing width, promoting layers, or using four parallel vias lowers j, but uneven sharing can leave one cut overloaded. The failure mode is void nucleation and eventually an open circuit after months or years, so a green IR check does not imply green EM."
        ),
        refs: ["black-1969"],
      },
      {
        body: loc(
          "La topologia fisica della mesh è codificata in DEF SPECIALNETS e deve rispettare obstruction e pin definiti dai LEF di macro e celle (LEF/DEF). Strap da 8 µm a pitch 20 µm su layer alti riducono R, ma consumano il 40% della capacità trasversale prima del routing dei segnali. Innovus addStripe, ICC2 create_power_straps e OpenROAD pdngen devono inserire via array alle intersezioni e verificare la connessione fino a ogni followpin rail. Un macro pin PG coperto geometricamente ma senza via valida produce una floating island che può sfuggire a una semplice ispezione del display. Il failure mode è scegliere pitch uniforme da una media di corrente, lasciando hotspot sotto CPU e SRAM oppure strangolando inutilmente regioni a bassa attività.",
          "Physical mesh topology is encoded in DEF SPECIALNETS and must honor obstructions and pins defined by macro and cell LEFs (LEF/DEF). Straps 8 µm wide at 20 µm pitch on upper layers lower R but consume 40% of transverse capacity before signal routing. Innovus addStripe, ICC2 create_power_straps, and OpenROAD pdngen must insert via arrays at intersections and verify connectivity down to every followpin rail. A macro PG pin that is geometrically covered but lacks a legal via creates a floating island that a simple display inspection may miss. The failure mode is choosing uniform pitch from average current, leaving hotspots under CPUs and SRAMs or needlessly choking low-activity regions."
        ),
        refs: ["lef-def"],
      },
      {
        body: loc(
          "Il power gating definito in IEEE 1801 crea una rail virtuale il cui R_on e inrush dipendono dal numero e dalla sequenza dei power switch (IEEE 1801). Accendere 20 000 header simultaneamente per caricare 10 nF a 0,8 V in 10 ns richiede idealmente I = C·ΔV/Δt = 0,8 A, oltre alla corrente logica. Fishbone o daisy chain con enable scaglionato limita il picco, mentre Voltus e RedHawk verificano wake-up waveform e minimum voltage. Isolation deve attivarsi prima dello spegnimento e retention restore deve attendere una rail stabile, condizioni controllabili con Conformal Low Power. Il failure mode è ground bounce o collapse della primary PG durante wake-up, seguito da perdita di retention o reset spurio in domini che non erano stati spenti.",
          "Power gating defined in IEEE 1801 creates a virtual rail whose R_on and inrush depend on power-switch count and sequence (IEEE 1801). Turning on 20,000 headers simultaneously to charge 10 nF to 0.8 V in 10 ns ideally requires I = C·ΔV/Δt = 0.8 A in addition to logic current. Fishbone or daisy-chain staggered enables limit the peak, while Voltus and RedHawk verify wake-up waveforms and minimum voltage. Isolation must assert before shutdown and retention restore must wait for a stable rail, conditions checkable with Conformal Low Power. The failure mode is ground bounce or primary-PG collapse during wake-up, followed by lost retention or a spurious reset in domains that were never powered down."
        ),
        refs: ["ieee-1801"],
      },
    ],
  },
  placement: {
    kicker: loc(
      "Il placement bilancia wirelength, timing, densità e capacità di routing; una soluzione legale ma congestionata non è una soluzione fisica.",
      "Placement balances wirelength, timing, density, and routing capacity; a legal but congested solution is not a physical solution."
    ),
    paragraphs: [
      {
        body: loc(
          "Il global placement minimizza una funzione pesata di wirelength, timing e density usando posizioni continue, mentre legalization e detailed placement portano le celle sui SITE e ROW definiti in LEF/DEF (LEF/DEF). HPWL = (x_max−x_min)+(y_max−y_min) è economica ma ignora Steiner topology, obstruction e layer, quindi è un proxy e non il ritardo reale. Innovus placeDesign, ICC2 place_opt e OpenROAD RePlAce possono assegnare peso maggiore a net con slack negativo e applicare padding locale. Uno spostamento di legalizzazione medio di 2 µm può essere sano, ma una coda da 20 µm sui flop critici aggiunge RC e rompe la correlazione con il global solution. Il failure mode è dichiarare placement completo perché non esistono overlap, mentre path critici e pin macro sono stati separati per soddisfare una density penalty troppo aggressiva.",
          "Global placement minimizes a weighted wirelength, timing, and density objective using continuous positions, while legalization and detailed placement move cells onto SITE and ROW locations defined by LEF/DEF (LEF/DEF). HPWL = (x_max−x_min)+(y_max−y_min) is cheap but ignores Steiner topology, obstructions, and layers, making it a proxy rather than real delay. Innovus placeDesign, ICC2 place_opt, and OpenROAD RePlAce can assign higher weight to negative-slack nets and apply local padding. Mean legalization displacement of 2 µm may be healthy, but a 20 µm tail on critical flops adds RC and breaks correlation with the global solution. The failure mode is declaring placement complete because no overlaps exist while critical paths and macro pins have been separated to satisfy an overly aggressive density penalty."
        ),
        refs: ["lef-def"],
      },
      {
        body: loc(
          "Il global router divide il core in GRC o G-cell e misura capacity C e demand D per edge, con overflow = max(0,D−C) e percentuale overflow/C (LEF/DEF). Se un edge offre 80 track equivalenti e riceve demand 92, l'overflow è 12, cioè 15%, troppo alto per affidarsi al detailed router. Innovus reportCongestion, ICC2 report_congestion e OpenROAD global_route correlano hotspot con pin density, macro channel, PG blockage e cell density. Spreading locale, macro orientation e layer assignment correggono cause diverse; aumentare global padding del 20% può invece peggiorare wirelength ovunque. Il failure mode è ignorare un picco GRC del 25% perché la media chip è 2%, scoprendo poi open, DRC ripetute e detour proprio sul bus critico.",
          "The global router divides the core into GRCs or G-cells and measures capacity C and demand D per edge, with overflow = max(0,D−C) and percentage overflow/C (LEF/DEF). If an edge offers 80 equivalent tracks and receives demand 92, overflow is 12, or 15%, too high to trust the detailed router. Innovus reportCongestion, ICC2 report_congestion, and OpenROAD global_route correlate hotspots with pin density, macro channels, PG blockages, and cell density. Local spreading, macro orientation, and layer assignment address different causes; increasing global padding by 20% can instead worsen wirelength everywhere. The failure mode is ignoring a 25% GRC peak because chip average is 2%, then discovering opens, repeated DRCs, and detours exactly on the critical bus."
        ),
        refs: ["lef-def"],
      },
      {
        body: loc(
          "Setup e hold reagiscono a corner e spostamenti in modo opposto: setup richiede arrival_data ≤ required, mentre hold richiede arrival_data ≥ earliest_capture+T_hold (SDC). Un corner slow-cell/late-RC a bassa V tende a dominare setup, ma hold usa spesso fast-cell/early-RC ad alta V; advanced nodes richiedono verificare temperature inversion invece di assumere SS caldo. PrimeTime o Tempus pre-CTS usa clock idealizzato con uncertainty SDC, quindi un WNS setup di −80 ps e hold di +20 ps deve conservare margine per clock reale. Avvicinare launch e capture riduce data delay e aiuta setup ma può trasformare quei +20 ps in una violazione hold post-CTS. Il failure mode è ottimizzare placement su un solo setup corner, riempire il design di celle veloci e creare migliaia di hold failure al corner opposto.",
          "Setup and hold react oppositely to corners and movement: setup requires data arrival ≤ required time, while hold requires data arrival ≥ earliest capture+T_hold (SDC). A slow-cell/late-RC low-V corner often dominates setup, while hold commonly uses fast-cell/early-RC high V; advanced nodes require checking temperature inversion rather than assuming hot SS. PrimeTime or Tempus pre-CTS uses an idealized clock with SDC uncertainty, so setup WNS of −80 ps and hold of +20 ps must retain margin for the real clock. Moving launch and capture closer lowers data delay and helps setup but can turn that +20 ps into a post-CTS hold violation. The failure mode is optimizing placement for one setup corner, filling the design with fast cells, and creating thousands of hold failures at the opposite corner."
        ),
        refs: ["sdc"],
      },
      {
        body: loc(
          "Scan reorder e physical-only cells fanno parte della qualità del placement anche se non cambiano la funzione logica (Bushnell & Agrawal; LEF/DEF). Riordinare una chain da 100 000 flop per prossimità può ridurre drasticamente wirelength, ma ogni crossing di clock domain richiede lock-up e l'ordine finale deve tornare all'ATPG. Tap cell a pitch imposto dal DRM, endcap, tie e decap occupano siti che una utilization iniziale del 75% deve avere riservato. Innovus scanReorder, ICC2 reorder_scan e check_legality verificano chain e row, mentre Tessent conferma che la compressione e la coverage restano valide. Il failure mode è inserire tap e decap dopo aver saturato le row, causando displacement, chain detour o violazioni latch-up che obbligano a rifare il placement.",
          "Scan reordering and physical-only cells are part of placement quality even though they do not change logical function (Bushnell & Agrawal; LEF/DEF). Reordering a 100,000-flop chain by proximity can cut wirelength dramatically, but every clock-domain crossing needs a lock-up and the final order must return to ATPG. Tap cells at DRM-mandated pitch, endcaps, ties, and decaps consume sites that an initial 75% utilization must reserve. Innovus scanReorder, ICC2 reorder_scan, and check_legality verify chains and rows, while Tessent confirms compression and coverage remain valid. The failure mode is inserting taps and decaps after rows are saturated, causing displacement, chain detours, or latch-up violations that force placement to be redone."
        ),
        refs: ["bushnell-agrawal", "lef-def"],
      },
      {
        body: loc(
          "L'ottimizzazione pre-CTS deve chiudere design-rule e gross timing senza fingere che il clock ideale sia già il clock fisico (Liberty/CCS; SDC). place_opt e optDesign eseguono sizing, buffer, VT swap e restructuring usando delay Liberty e RC stimata, ma ogni BUF X4 aggiunto consuma area, leakage e routing. Un PRO exit ragionevole può richiedere congestion overflow inferiore al 5%, nessun max_transition e WNS entro −100 ps del budget interno, non necessariamente signoff zero. Se TNS passa da −20 ns a −2 ns ma il cell count cresce del 18%, il team deve verificare che CTS e routing abbiano ancora spazio. Il failure mode è forzare WNS pre-CTS a zero con celle LVT e buffer densi, ottenendo un placement formalmente veloce che diventa irrouterabile e più lento dopo estrazione.",
          "Pre-CTS optimization must close design rules and gross timing without pretending the ideal clock is already physical (Liberty/CCS; SDC). place_opt and optDesign perform sizing, buffering, VT swapping, and restructuring with Liberty delay and estimated RC, but every added BUF X4 consumes area, leakage, and routing. A reasonable PRO exit may require congestion overflow below 5%, no max-transition violations, and WNS within −100 ps of the internal budget rather than zero signoff. If TNS improves from −20 ns to −2 ns while cell count rises 18%, the team must verify that CTS and routing still have room. The failure mode is forcing pre-CTS WNS to zero with dense LVT cells and buffers, producing a formally fast placement that becomes unroutable and slower after extraction."
        ),
        refs: ["liberty", "sdc"],
      },
    ],
  },
  cts: {
    kicker: loc(
      "CTS costruisce una rete temporale e fisica: latency porta il clock ai sink, skew confronta gli arrivi e uncertainty copre ciò che il modello non sa ancora.",
      "CTS builds a temporal and physical network: latency carries clock to sinks, skew compares arrivals, and uncertainty covers what the model does not yet know."
    ),
    paragraphs: [
      {
        body: loc(
          "Clock latency è il tempo root-to-sink, mentre skew è la differenza di arrival tra due sink rilevanti; ridurre l'uno non garantisce ridurre l'altro (Harris & Weste). Un albero può avere latency di 700 ps e skew di 25 ps, oppure latency di 200 ps e skew di 90 ps, con impatti diversi su setup, hold e power. Innovus ccopt_design e ICC2 clock_opt bilanciano buffer, topology, capacitance e transition per migliaia o milioni di sink. A 1,25 GHz il periodo è 800 ps, quindi 90 ps di skew consuma oltre l'11% del ciclo prima della logica dati. Il failure mode è ottimizzare solo average insertion delay e lasciare una coda di sink lontani che produce skew locale, pulse-width violation e timing failure.",
          "Clock latency is root-to-sink time, while skew is the arrival difference between relevant sinks; reducing one does not guarantee reducing the other (Harris & Weste). A tree may have 700 ps latency and 25 ps skew, or 200 ps latency and 90 ps skew, with different setup, hold, and power effects. Innovus ccopt_design and ICC2 clock_opt balance buffers, topology, capacitance, and transition for thousands or millions of sinks. At 1.25 GHz the period is 800 ps, so 90 ps skew consumes more than 11% of the cycle before data logic. The failure mode is optimizing only average insertion delay while leaving a tail of distant sinks that creates local skew, pulse-width violations, and timing failures."
        ),
        refs: ["harris-weste"],
      },
      {
        body: loc(
          "Prima di CTS, set_clock_uncertainty può includere jitter, skew stimato e margine; dopo CTS lo skew propagated è esplicito e non va contato una seconda volta (SDC). Se il pre-CTS uncertainty era 100 ps = 35 ps jitter + 50 ps skew budget + 15 ps margin, il post-CTS può conservare 50 ps per jitter e margin e usare arrival reali per lo skew. PrimeTime e Tempus con set_propagated_clock devono leggere netlist, SPEF stimato o estratto e SDC aggiornato per evitare analisi mista ideal/propagated. Lasciare tutti i 100 ps dopo un CTS con 30 ps reali crea 50 ps di pessimismo duplicato, mentre azzerare uncertainty ignora PLL jitter e variation. Il failure mode è un WNS apparentemente negativo o positivo per bookkeeping errato, non per circuito, e quindi un ECO che peggiora power senza correggere la causa.",
          "Before CTS, set_clock_uncertainty may include jitter, estimated skew, and margin; after CTS, propagated skew is explicit and must not be counted twice (SDC). If pre-CTS uncertainty was 100 ps = 35 ps jitter + 50 ps skew budget + 15 ps margin, post-CTS can retain 50 ps for jitter and margin while using real arrivals for skew. PrimeTime and Tempus with set_propagated_clock must read the updated netlist, estimated or extracted SPEF, and SDC to avoid mixed ideal/propagated analysis. Keeping all 100 ps after CTS with 30 ps real skew duplicates 50 ps of pessimism, while zeroing uncertainty ignores PLL jitter and variation. The failure mode is WNS that looks negative or positive because of bookkeeping rather than circuitry, prompting an ECO that raises power without fixing the cause."
        ),
        refs: ["sdc"],
      },
      {
        body: loc(
          "Per un path reg-to-reg, skew positivo capture-minus-launch aumenta il budget setup ma restringe il margine hold, perciò useful skew trasferisce slack e non lo crea (Harris & Weste). Ritardare il capture di 60 ps può trasformare setup slack −40 ps in +20 ps, ma un hold slack iniziale di +30 ps diventa potenzialmente −30 ps. ccopt_design e clock_opt ottimizzano gruppi di path, tuttavia devono rispettare min pulse width, clock-gating checks e boundary latency. Una pipeline con ogni stage già marginale non può ricevere useful skew positivo ovunque, perché la somma degli skew su un loop sincrono è zero. Il failure mode è chiudere il path peggiore spostando la violazione allo stage successivo o al corner hold, nascosta da un report limitato a un solo path group.",
          "For a register-to-register path, positive capture-minus-launch skew increases setup budget but narrows hold margin, so useful skew transfers slack rather than creating it (Harris & Weste). Delaying capture by 60 ps can turn −40 ps setup slack into +20 ps, but an initial +30 ps hold slack can become −30 ps. ccopt_design and clock_opt optimize path groups, yet they must respect minimum pulse width, clock-gating checks, and boundary latency. A pipeline whose every stage is already marginal cannot receive positive useful skew everywhere because skew sums to zero around a synchronous loop. The failure mode is closing the worst path by moving the violation to the next stage or hold corner, hidden by a report restricted to one path group."
        ),
        refs: ["harris-weste"],
      },
      {
        body: loc(
          "OCV altera in modo diverso rami comuni e non comuni del clock, e Liberty Variation Format fornisce σ per il POCV invece di un derate piatto (Liberty/CCS). Un tree profondo 12 buffer con variation indipendente non si tratta come un singolo ±10%, perché depth, distance e correlazione cambiano il risultato. PrimeTime e Tempus applicano AOCV o POCV e CPPR sul tratto root comune, mentre CTS usa clustering fisico per ridurre porzioni non comuni. Una mesh può ottenere skew inferiore a 20 ps ma consumare 2–3× la potenza clock di un tree, quindi non è una cura gratuita. Il failure mode è centrare il target skew nominale in ccopt e fallire signoff quando LVF, crosstalk e variation rendono una coppia di sink statisticamente sbilanciata.",
          "OCV changes common and non-common clock branches differently, and Liberty Variation Format supplies σ for POCV instead of a flat derate (Liberty/CCS). A 12-buffer-deep tree with independent variation cannot be treated as one ±10% element because depth, distance, and correlation change the result. PrimeTime and Tempus apply AOCV or POCV plus CPPR on the common root segment, while CTS uses physical clustering to reduce non-common portions. A mesh can achieve skew below 20 ps but consume 2–3× the clock power of a tree, so it is not a free cure. The failure mode is meeting nominal skew in ccopt and failing signoff when LVF, crosstalk, and variation statistically unbalance a sink pair."
        ),
        refs: ["liberty"],
      },
      {
        body: loc(
          "Le ICG devono ricevere enable stabile nella finestra di clock-gating setup/hold e la rete dopo ICG deve essere trattata come clock, non come segnale ordinario (Harris & Weste; SDC). Una duty cycle 50% su 1 GHz offre 500 ps high e 500 ps low, ma buffer asymmetry e slew possono ridurre un impulso sotto il min_pulse_width Liberty. CTS usa clock buffer dedicati, NDR double-width/double-spacing e talvolta shield VSS, verificando max transition tipicamente nell'ordine di 100–200 ps secondo library. Scan enable e OCC devono forzare o generare clock test controllati senza glitch, altrimenti un pattern at-speed non raggiunge i flop previsti. Il failure mode è un impulso runt o un ICG escluso erroneamente dal tree, che causa doppio clock, capture mancato o un intero ramo con latency non bilanciata.",
          "ICGs need a stable enable during the clock-gating setup/hold window, and the network after an ICG must be treated as clock rather than ordinary signal (Harris & Weste; SDC). A 50% duty cycle at 1 GHz provides 500 ps high and 500 ps low, but buffer asymmetry and slew can reduce a pulse below the Liberty min_pulse_width. CTS uses dedicated clock buffers, double-width/double-spacing NDRs, and sometimes VSS shields, checking max transition typically around 100–200 ps depending on the library. Scan enable and OCC logic must force or generate controlled test clocks without glitches, or an at-speed pattern will not reach intended flops. The failure mode is a runt pulse or an ICG mistakenly excluded from the tree, causing a double clock, missed capture, or an entire branch with unbalanced latency."
        ),
        refs: ["harris-weste", "sdc"],
      },
    ],
  },
  routing: {
    kicker: loc(
      "Il routing trasforma connettività astratta in metallo, via e parassiti reali, rendendo simultaneamente visibili congestion, SI, antenna e patterning.",
      "Routing turns abstract connectivity into real metal, vias, and parasitics, exposing congestion, SI, antenna, and patterning at once."
    ),
    paragraphs: [
      {
        body: loc(
          "Global routing assegna guide su G-cell, mentre detailed routing sceglie track, shape e via conformi alle regole LEF/tech (LEF/DEF). Con capacity 120 e demand 138 su un edge, overflow = 18 o 15%, segnale che rip-up-and-reroute non crea risorsa fisica dal nulla. Innovus routeDesign, ICC2 route_opt e OpenROAD FastRoute/ TritonRoute devono riportare zero open e un numero convergente di DRC, non soltanto una percentuale di net routed. Preferred direction alternata riduce conflitti, ma una via ladder M1→M6 consuma enclosure, resistenza e affidabilità a ogni passaggio. Il failure mode è forzare il detailed router attraverso una GRC satura, ottenendo detour lunghi, via eccessive e violazioni che oscillano anziché convergere.",
          "Global routing assigns guides on G-cells, while detailed routing chooses tracks, shapes, and vias compliant with LEF and technology rules (LEF/DEF). With capacity 120 and demand 138 on an edge, overflow = 18 or 15%, showing that rip-up-and-reroute cannot create physical resources. Innovus routeDesign, ICC2 route_opt, and OpenROAD FastRoute/TritonRoute must report zero opens and a converging DRC count, not merely a percentage of routed nets. Alternating preferred direction reduces conflicts, but an M1→M6 via ladder consumes enclosure, resistance, and reliability at every hop. The failure mode is forcing detailed routing through a saturated GRC, producing long detours, excessive vias, and violations that oscillate rather than converge."
        ),
        refs: ["lef-def"],
      },
      {
        body: loc(
          "Il crosstalk nasce dalla coupling capacitance C_c tra aggressor e victim, e il segno del delta delay dipende dalla direzione relativa delle transizioni (Rabaey et al.). Aggressor opposti possono aumentare il carico efficace del victim e peggiorare setup, mentre transizioni concordi possono accelerarlo e minacciare hold. PrimeTime SI, Tempus SI e Quantus o StarRC estraggono coupling e valutano finestre temporali, evitando di sommare aggressor che non possono commutare insieme. Spacing, shield VSS, layer promotion e slew reduction possono recuperare 20–80 ps, ma consumano track e talvolta aumentano C_ground. Il failure mode è un glitch sopra la noise threshold o un delta delay non incluso nello STA nominale, con corruzione su reset, enable o path dati marginale.",
          "Crosstalk comes from coupling capacitance C_c between aggressor and victim, and delta-delay sign depends on relative transition direction (Rabaey et al.). Opposite-switching aggressors can raise the victim's effective load and hurt setup, while same-direction transitions can speed it up and threaten hold. PrimeTime SI, Tempus SI, and Quantus or StarRC extract coupling and analyze timing windows, avoiding the sum of aggressors that cannot switch together. Spacing, VSS shielding, layer promotion, and slew reduction can recover 20–80 ps but consume tracks and sometimes increase ground capacitance. The failure mode is a glitch above the noise threshold or delta delay omitted from nominal STA, corrupting reset, enable, or a marginal data path."
        ),
        refs: ["rabaey"],
      },
      {
        body: loc(
          "Dopo routing, ogni net è un albero RC e il delay di Elmore t_E = ΣR_k·C_down,k spiega perché una resistenza vicina al driver pesa tutta la capacità downstream (Elmore 1948). Gupta et al. 1997 formalizzano l'utilità di Elmore come bound per RC tree con input generalizzati, pur senza sostituire una waveform analysis signoff. StarRC o Quantus estraggono SPEF con R segmentate, C_ground e C_coupling; PrimeTime e Tempus ricalcolano slew e delay su quel network. Raddoppiare width riduce R ma può aumentare C e occupazione, quindi una NDR non garantisce automaticamente delay dimezzato. Il failure mode è approvare un ECO sulla lunghezza geometrica senza re-estrarre SPEF, attribuendo un miglioramento di 30 ps a un net la cui capacità di coupling è in realtà aumentata.",
          "After routing, every net is an RC tree, and Elmore delay t_E = ΣR_k·C_down,k explains why resistance near the driver weights all downstream capacitance (Elmore 1948). Gupta et al. 1997 formalize Elmore's usefulness as a bound for RC trees with generalized inputs, although it does not replace signoff waveform analysis. StarRC or Quantus extracts SPEF with segmented R, ground C, and coupling C; PrimeTime and Tempus recompute slew and delay on that network. Doubling width lowers R but can raise C and occupancy, so an NDR does not automatically halve delay. The failure mode is approving an ECO from geometric length without re-extracting SPEF, crediting a 30 ps improvement to a net whose coupling capacitance actually increased."
        ),
        refs: ["elmore-1948", "gupta-elmore"],
      },
      {
        body: loc(
          "Nel double patterning LELE, shape troppo vicine formano un grafo che deve essere 2-colorabile; un ciclo dispari è un conflitto di decomposizione (IRDS). Un triangolo di tre segmenti reciprocamente adiacenti non può ricevere due colori senza violazione, quindi il router inserisce jog, stitch o layer hop. Calibre DPT, Pegasus e router color-aware controllano spacing same-mask e different-mask secondo il deck foundry, non una distanza nominale unica. A nodi EUV il numero di layer multi-patterned può ridursi, ma cut mask, via coloring e pattern hotspot restano dipendenti dal processo come documenta l'IRDS. Il failure mode è un layout DRC-clean nel router non color-aware che fallisce il signoff foundry per odd cycle o stitch non stampabile.",
          "In LELE double patterning, shapes placed too close form a graph that must be 2-colorable; an odd cycle is a decomposition conflict (IRDS). A triangle of three mutually adjacent segments cannot receive two colors without violation, so the router inserts a jog, stitch, or layer hop. Calibre DPT, Pegasus, and color-aware routers check same-mask and different-mask spacing against the foundry deck rather than one nominal distance. At EUV nodes the number of multi-patterned layers may decrease, but cut masks, via coloring, and pattern hotspots remain process-dependent as documented by IRDS. The failure mode is a layout clean in a non-color-aware router that fails foundry signoff for an odd cycle or unprintable stitch."
        ),
        refs: ["sematech-irds"],
      },
      {
        body: loc(
          "Durante plasma etch, una lunga area metal collegata a un gate può raccogliere carica e stressare l'ossido; il deck foundry valuta ratio per layer e antenna cumulativa (Rabaey et al.). Il router inserisce un jumper verso un layer processato più tardi oppure una antenna diode che offre un percorso di scarica, ma la diode aggiunge area e capacitance. Innovus verifyProcessAntenna, ICC2 check_routes e Calibre antenna devono concordare sul GDS finale, non soltanto sul DEF pre-fill. Una net di reset con fanout 50 000 può superare il limite su più layer anche se ogni segmento locale sembra corto. Il failure mode è breakdown latente del gate o yield loss, mentre una correzione tardiva può creare nuove DRC, setup degradation o leakage non ricontrollati.",
          "During plasma etch, a long metal area connected to a gate can collect charge and stress the oxide; the foundry deck evaluates per-layer and cumulative antenna ratios (Rabaey et al.). The router inserts a jumper to a layer processed later or an antenna diode that provides a discharge path, but the diode adds area and capacitance. Innovus verifyProcessAntenna, ICC2 check_routes, and Calibre antenna must agree on final GDS rather than only pre-fill DEF. A reset net with fanout 50,000 can exceed limits on multiple layers even if each local segment looks short. The failure mode is latent gate breakdown or yield loss, while a late fix can create new DRCs, setup degradation, or leakage that is not rechecked."
        ),
        refs: ["rabaey"],
      },
    ],
  },
  layout: {
    kicker: loc(
      "Il finishing rende il layout fabbricabile senza fingere che fill, seal, slot e merge siano elettricamente o geometricamente neutri.",
      "Finishing makes layout manufacturable without pretending that fill, seal, slots, and merge are electrically or geometrically neutral."
    ),
    paragraphs: [
      {
        body: loc(
          "La CMP richiede densità metallica entro finestre scorrevoli per limitare dishing ed erosion, problemi che alterano thickness e resistenza (IRDS). Un deck può imporre ρ tra 25% e 75% su finestre da 100×100 µm, ma i valori reali appartengono al PDK e variano per layer. Calibre YieldEnhancer, Pegasus Fill o Innovus addMetalFill inseriscono pattern rispettando keepout, via, macro e net sensibili. Riempire soltanto fino alla media globale non basta, perché una singola finestra sotto ρ_min resta una violazione e una regione PG può superare ρ_max. Il failure mode è topografia non uniforme, open o variazione RC, oppure un GDS respinto dal density deck nonostante routing e LVS fossero puliti.",
          "CMP requires metal density within sliding windows to limit dishing and erosion, which alter thickness and resistance (IRDS). A deck may require ρ between 25% and 75% in 100×100 µm windows, but actual values belong to the PDK and vary by layer. Calibre YieldEnhancer, Pegasus Fill, or Innovus addMetalFill inserts patterns while respecting keepouts, vias, macros, and sensitive nets. Filling only to the global average is insufficient because one window below ρ_min remains a violation and a PG region can exceed ρ_max. The failure mode is nonuniform topography, opens, or RC variation, or a GDS rejected by the density deck even though routing and LVS were clean."
        ),
        refs: ["sematech-irds"],
      },
      {
        body: loc(
          "Il dummy fill non è elettricamente dummy: grounded fill aumenta C_ground, mentre floating fill introduce coupling dipendente dalle net vicine (Rabaey et al.). Se una net critica aveva 40 fF e il fill aggiunge 8 fF, il carico cresce del 20% e un delay da 200 ps può spostarsi di decine di ps secondo driver e slew. StarRC e Quantus devono estrarre il GDS post-fill, e PrimeTime o Tempus devono ripetere SI-aware STA sul nuovo SPEF. Keepout di 1–3 µm attorno a clock, analog e bus sensibili riduce l'impatto ma può rendere più difficile raggiungere ρ_min. Il failure mode è firmare WNS = +15 ps su estrazione pre-fill e ottenere WNS negativo sul database realmente inviato in fab.",
          "Dummy fill is not electrically dummy: grounded fill raises ground capacitance, while floating fill introduces coupling dependent on nearby nets (Rabaey et al.). If a critical net had 40 fF and fill adds 8 fF, load rises 20% and a 200 ps delay can move by tens of picoseconds depending on driver and slew. StarRC and Quantus must extract post-fill GDS, and PrimeTime or Tempus must rerun SI-aware STA on the new SPEF. A 1–3 µm keepout around clocks, analog nets, and sensitive buses limits impact but can make ρ_min harder to reach. The failure mode is signing WNS = +15 ps on pre-fill extraction and obtaining negative WNS on the database actually sent to fabrication."
        ),
        refs: ["rabaey"],
      },
      {
        body: loc(
          "Seal ring, scribe lane, passivation opening, pad e wide-metal slotting sono geometrie foundry che devono essere integrate con il top DEF e il layer map corretto (LEF/DEF). Un seal discontinuo o una macro che invade il saw keepout può propagare crack e umidità nel die anche se la logica è perfetta. KLayout, Virtuoso e Calibre verificano overlap, enclosure e continuità, mentre slotting su strap larghi limita stress e problemi CMP senza interrompere la corrente. Un ring largo 10 µm con slot illegali può rispettare l'area apparente ma fallire min-width residua o EM sul collo rimasto. Il failure mode è una frattura meccanica, corrosione o violazione di assembly che non compare in STA e non può essere riparata da un ECO logico.",
          "Seal ring, scribe lane, passivation openings, pads, and wide-metal slotting are foundry geometries that must be integrated with top DEF and the correct layer map (LEF/DEF). A discontinuous seal or a macro invading the saw keepout can propagate cracks and moisture into the die even when logic is perfect. KLayout, Virtuoso, and Calibre check overlap, enclosure, and continuity, while slotting on wide straps limits stress and CMP problems without interrupting current. A 10 µm-wide ring with illegal slots may preserve apparent area yet fail residual minimum width or EM at the remaining neck. The failure mode is mechanical fracture, corrosion, or an assembly violation absent from STA and impossible to repair with a logical ECO."
        ),
        refs: ["lef-def"],
      },
      {
        body: loc(
          "Un ECO metal-only riutilizza spare cell già diffuse e cambia soltanto via e metalli, mentre aggiungere transistor richiede modificare i layer base e quindi il BTO (Bushnell & Agrawal; LEF/DEF). Formality o Conformal devono provare gate-to-gate equivalence, e ogni modifica richiede nuova estrazione, STA, DRC, LVS e ATPG impact analysis. Con 500 spare distribuite nel core, una funzione AND può essere costruita da NAND più inverter se le celle e i pin sono raggiungibili senza violare route. Un patch GDS manuale non aggiornato nella netlist crea immediatamente una divergenza tra schematic golden, DEF e database di signoff. Il failure mode è un fix che chiude −40 ps di setup ma introduce short, scan mismatch o hold failure in un corner non rieseguito.",
          "A metal-only ECO reuses already diffused spare cells and changes only vias and metals, whereas adding transistors changes base layers and therefore the BTO (Bushnell & Agrawal; LEF/DEF). Formality or Conformal must prove gate-to-gate equivalence, and every change needs renewed extraction, STA, DRC, LVS, and ATPG impact analysis. With 500 spares distributed across the core, an AND function can be built from a NAND plus inverter if cells and pins are reachable without routing violations. A manual GDS patch not reflected in the netlist immediately creates divergence among the golden schematic, DEF, and signoff database. The failure mode is a fix that closes −40 ps setup but introduces a short, scan mismatch, or hold failure in a corner that was not rerun."
        ),
        refs: ["bushnell-agrawal", "lef-def"],
      },
      {
        body: loc(
          "Il merge finale combina block GDS/OASIS, standard-cell library, macro hard IP, IO, fill e seal mantenendo hierarchy e layer map coerenti (LEF/DEF). Un SoC da centinaia di gigabyte può usare hierarchical DRC per iterare, ma il gate finale deve coprire interazioni top-level e boundary sul database merged. Calibre DESIGNrev, KLayout e strumenti foundry confrontano cell name, checksum, datatype e unità, perché una scala 1000× o un datatype errato può eliminare geometria senza errore logico. LVS deve usare la netlist post-ECO esatta e l'estrazione RC deve includere la stessa revisione post-fill. Il failure mode è un blocco individualmente clean che crea spacing, short o density violation soltanto dopo abutment, oppure un signoff eseguito su una revisione diversa da quella consegnata.",
          "Final merge combines block GDS/OASIS, standard-cell libraries, hard macros, IO, fill, and seal while preserving coherent hierarchy and layer maps (LEF/DEF). A SoC hundreds of gigabytes in size may use hierarchical DRC for iteration, but the final gate must cover top-level and boundary interactions on the merged database. Calibre DESIGNrev, KLayout, and foundry tools compare cell names, checksums, datatypes, and units because a 1,000× scale or wrong datatype can remove geometry without a logical error. LVS must use the exact post-ECO netlist, and RC extraction must include the same post-fill revision. The failure mode is an individually clean block that creates spacing, shorts, or density violations only after abutment, or signoff run on a revision different from delivery."
        ),
        refs: ["lef-def"],
      },
    ],
  },
  sta: {
    kicker: loc(
      "STA è una dimostrazione per scenari vincolati: equazioni, modelli, eccezioni e rimozione del pessimismo devono riferirsi allo stesso circuito.",
      "STA is a proof over constrained scenarios: equations, models, exceptions, and pessimism removal must refer to the same circuit."
    ),
    paragraphs: [
      {
        body: loc(
          "Per setup, slack = required_time − arrival_time e deve essere ≥ 0; per hold la polarità operativa confronta earliest arrival con earliest required e deve anch'essa restare non negativa (SDC). Un path con arrival 742 ps e required 700 ps ha setup slack −42 ps, mentre aumentare il periodo aiuta setup ma non corregge hold. PrimeTime, Tempus e OpenSTA propagano clock, cell arc e RC da startpoint a endpoint applicando create_clock, generated clock, IO delay e uncertainty. Recovery, removal, min pulse width e clock-gating checks sono vincoli distinti che un report limitato a setup/hold può omettere. Il failure mode è WNS zero nel path group reg2reg ma endpoint unconstrained, generated clock mancante o async control fuori specifica che rende incompleto il signoff.",
          "For setup, slack = required_time − arrival_time and must be ≥ 0; for hold, the operational polarity compares earliest arrival against earliest required time and must also remain nonnegative (SDC). A path with 742 ps arrival and 700 ps required time has −42 ps setup slack, while increasing period helps setup but does not fix hold. PrimeTime, Tempus, and OpenSTA propagate clocks, cell arcs, and RC from startpoint to endpoint under create_clock, generated clocks, IO delays, and uncertainty. Recovery, removal, minimum pulse width, and clock-gating checks are distinct constraints that a setup/hold-only report can omit. The failure mode is zero WNS in the reg2reg group while unconstrained endpoints, a missing generated clock, or an out-of-spec asynchronous control makes signoff incomplete."
        ),
        refs: ["sdc"],
      },
      {
        body: loc(
          "MMMC è il prodotto controllato di mode, library set, RC corner, voltage e temperatura, non una lista arbitraria di run. Cinque mode {func, scan_shift, scan_capture, MBIST, sleep} per 12 corner producono 60 analysis view, ognuna con SDC e power state coerenti. PrimeTime DMSA o Tempus MMMC distribuiscono le view e aggregano WNS, TNS, DRV e SI senza perdere l'identità del corner. Liberty/CCS e LVF devono corrispondere alla tensione della view, mentre parasitic best e fast cell tendono a esporre hold e late RC con slow cell tende a esporre setup. Il failure mode è firmare soltanto SS caldo e FF freddo per abitudine, ignorando temperature inversion o un mode scan con clock e case analysis differenti.",
          "MMMC is the controlled product of modes, library sets, RC corners, voltage, and temperature rather than an arbitrary run list. Five modes {func, scan_shift, scan_capture, MBIST, sleep} across 12 corners create 60 analysis views, each with coherent SDC and power state. PrimeTime DMSA or Tempus MMMC distributes views and aggregates WNS, TNS, DRVs, and SI without losing corner identity. Liberty/CCS and LVF must match the view voltage, while parasitic-best with fast cells tends to expose hold and late RC with slow cells tends to expose setup. The failure mode is signing only hot SS and cold FF out of habit while missing temperature inversion or a scan mode with different clocks and case analysis."
        ),
        refs: ["liberty", "sdc"],
      },
      {
        body: loc(
          "CRPR o CPPR rimuove il pessimismo introdotto quando lo stesso tratto di clock comune viene deratato late sul capture e early sul launch (Liberty/CCS). Se 300 ps di percorso comune riceve derate +8% e −8%, il confronto artificiale può contenere fino a 48 ps che non possono verificarsi simultaneamente sullo stesso silicio. PrimeTime report_timing mostra il clock reconvergence pessimism credit, mentre Tempus applica common-path pessimism removal secondo mode e edge. Il credito deve fermarsi al vero punto di divergenza e rispettare inversion, generated clock e variation correlation; estenderlo oltre produce ottimismo. Il failure mode è aggiungere buffer per correggere −30 ps che erano puro pessimismo, oppure applicare CPPR aggressivo e nascondere 20 ps reali di skew non comune.",
          "CRPR or CPPR removes pessimism introduced when the same common clock segment is derated late on capture and early on launch (Liberty/CCS). If 300 ps of common path receives +8% and −8% derates, the artificial comparison can contain up to 48 ps that cannot occur simultaneously on the same silicon. PrimeTime report_timing shows clock reconvergence pessimism credit, while Tempus applies common-path pessimism removal by mode and edge. Credit must stop at the true divergence point and respect inversion, generated clocks, and variation correlation; extending it farther creates optimism. The failure mode is adding buffers to fix −30 ps that was pure pessimism, or applying aggressive CPPR and hiding 20 ps of real non-common skew."
        ),
        refs: ["liberty"],
      },
      {
        body: loc(
          "OCV usa derate flat, AOCV varia con depth e distance, mentre POCV usa distribuzioni σ per arc descritte da LVF (Liberty/CCS). Per un target a 3σ, un path con μ = 600 ps e σ = 20 ps viene valutato intorno a 660 ps prima delle correlazioni e del trattamento clock/data. PrimeTime e Tempus devono applicare le tabelle foundry validate, non coefficienti copiati tra nodi o tra library revision. AOCV evita di penalizzare allo stesso modo un path da 2 stadi e uno da 40 stadi, mentre POCV modella meglio la somma statistica ma richiede dati caratterizzati completi. Il failure mode è uno slack positivo ottenuto con LVF mancante su alcune celle, fallback silenzioso a derate nominale o mix di sigma non compatibili.",
          "OCV uses flat derates, AOCV varies with depth and distance, while POCV uses per-arc σ distributions described by LVF (Liberty/CCS). For a 3σ target, a path with μ = 600 ps and σ = 20 ps is evaluated near 660 ps before correlation and clock/data treatment. PrimeTime and Tempus must apply foundry-validated tables rather than coefficients copied across nodes or library revisions. AOCV avoids penalizing a 2-stage and a 40-stage path identically, while POCV models statistical summation better but requires complete characterized data. The failure mode is positive slack obtained with LVF missing on some cells, silent fallback to nominal derates, or a mixture of incompatible sigma data."
        ),
        refs: ["liberty"],
      },
      {
        body: loc(
          "La qualità SDC si misura anche con report_unconstrained_paths, check_timing, clock interaction e audit di ogni exception, non dal solo fatto che il parser non dia errori (SDC). Un multicycle N per setup richiede in genere il corrispondente aggiustamento hold N−1 secondo l'intento, altrimenti il tool sposta entrambe le finestre in modo inatteso. set_false_path deve descrivere un path funzionalmente impossibile e provato da architettura o formal, mentre set_disable_timing rimuove un arc e può spezzare interi cone. PrimeTime `report_exceptions -ignored` e Tempus Constraint Debugger trovano pattern vuoti, override e wildcard che catturano 10 000 endpoint invece dei 10 previsti. Il failure mode è un signoff verde perché la copertura dei constraint è incompleta o eccessiva, cioè il tool ha dimostrato il modello sbagliato con perfetta precisione.",
          "SDC quality is measured with report_unconstrained_paths, check_timing, clock interaction, and an audit of every exception, not merely by parsing without errors (SDC). A setup multicycle of N generally needs the corresponding N−1 hold adjustment according to intent, or the tool moves both windows unexpectedly. set_false_path must describe a functionally impossible path proven by architecture or formal, while set_disable_timing removes an arc and can sever entire cones. PrimeTime `report_exceptions -ignored` and Tempus Constraint Debugger find empty patterns, overrides, and wildcards capturing 10,000 endpoints instead of the intended 10. The failure mode is green signoff because constraint coverage is incomplete or excessive, meaning the tool proved the wrong model with perfect precision."
        ),
        refs: ["sdc"],
      },
    ],
  },
  pv: {
    kicker: loc(
      "La physical verification confronta il database finale con regole di fabbricazione e connettività binarie: il quasi-clean non è un esito di tapeout.",
      "Physical verification compares the final database against binary manufacturing and connectivity rules: almost clean is not a tapeout result."
    ),
    paragraphs: [
      {
        body: loc(
          "DRC applica il runset foundry a width, spacing, enclosure, area, notch, density, coloring e regole dipendenti dal contesto sul GDS/OASIS finale (IRDS). Calibre nmDRC, Pegasus o IC Validator possono produrre milioni di marker iniziali, ma il criterio tapeout è zero violation non waived sulle regole obbligatorie. Un errore M2.S.1 di 1 nm resta un errore anche se il router interno era clean, perché i deck P&R sono semplificati rispetto al signoff. I waiver devono identificare rule, coordinate, revisione PDK, rischio e approvazione foundry, non essere una soppressione globale del marker. Il failure mode è una shape non stampabile, short o yield systematic loss che sarebbe stata prevenuta dal deck certificato ma viene nascosta da un filtro locale.",
          "DRC applies the foundry runset to width, spacing, enclosure, area, notch, density, coloring, and context-dependent rules on final GDS/OASIS (IRDS). Calibre nmDRC, Pegasus, or IC Validator may initially produce millions of markers, but tapeout requires zero unwaived violations of mandatory rules. An M2.S.1 error of 1 nm remains an error even if the internal router was clean because P&R decks are simplified relative to signoff. Waivers must identify the rule, coordinates, PDK revision, risk, and foundry approval rather than globally suppressing a marker. The failure mode is an unprintable shape, short, or systematic yield loss that the certified deck would have prevented but a local filter hides."
        ),
        refs: ["sematech-irds"],
      },
      {
        body: loc(
          "LVS estrae device e net dal layout e li confronta con la netlist schematic o gate-level; CORRECT richiede match di connettività, quantità e proprietà. Calibre nmLVS, Pegasus LVS e Netgen distinguono open, short, device mismatch, pin swap e parameter mismatch, spesso iniziando dal primo diverging node. Un singolo missing via può trasformare una net in due, mentre un bridge metal può ridurre due milioni di net a un mismatch apparentemente lontano. Power-aware LVS deve conoscere domini e supply IEEE 1801 per non equiparare rail omonime che hanno stati differenti (IEEE 1801). Il failure mode è un layout DRC-clean ma elettricamente diverso, e 99,999% di net matched non compensa l'unica connessione che cortocircuita VDD_SW e VDD_AON.",
          "LVS extracts devices and nets from layout and compares them with the schematic or gate-level netlist; CORRECT requires connectivity, count, and property agreement. Calibre nmLVS, Pegasus LVS, and Netgen distinguish opens, shorts, device mismatches, pin swaps, and parameter mismatches, often starting at the first diverging node. One missing via can split a net in two, while a metal bridge can collapse two million nets into a mismatch reported far away. Power-aware LVS must understand IEEE 1801 domains and supplies so it does not equate same-named rails with different states (IEEE 1801). The failure mode is a DRC-clean but electrically different layout, and 99.999% matched nets do not compensate for the one connection shorting VDD_SW to VDD_AON."
        ),
        refs: ["ieee-1801"],
      },
      {
        body: loc(
          "L'antenna check valuta charge collection durante la sequenza di etch, quindi usa area o perimetro metal-to-gate per layer e non una sola lunghezza geometrica (Rabaey et al.). Se il limite cumulativo è 400 e una net raggiunge ratio 520, il router può inserire jumper su un layer processato più tardi o una diode vicino al gate. Calibre, Pegasus e IC Validator devono rieseguire il deck dopo la correzione perché diode e jumper possono introdurre spacing, leakage e nuove ratio downstream. Gate oxide sottili ai nodi avanzati rendono il failure un problema di yield o affidabilità latente, coerente con le pressioni di scaling descritte dall'IRDS. Il failure mode è danno plasma a un gate che passa LVS e test funzionale iniziale ma degrada o fallisce durante uso e stress.",
          "Antenna checking evaluates charge collection during the etch sequence, so it uses metal-to-gate area or perimeter per layer rather than one geometric length (Rabaey et al.). If the cumulative limit is 400 and a net reaches ratio 520, the router can insert an upper-layer jumper processed later or a diode near the gate. Calibre, Pegasus, and IC Validator must rerun the deck after correction because diodes and jumpers can introduce spacing, leakage, and new downstream ratios. Thin gate oxides at advanced nodes make this a yield or latent reliability issue, consistent with scaling pressures documented by IRDS. The failure mode is plasma damage to a gate that passes LVS and initial functional test but degrades or fails during use and stress."
        ),
        refs: ["rabaey", "sematech-irds"],
      },
      {
        body: loc(
          "Density e multi-patterning sono check di fabbricabilità distinti: la prima controlla percentuale in finestre, il secondo la decomposizione su mask compatibili (IRDS). Una finestra 100×100 µm al 18% può richiedere fill fino a 25%, mentre un odd cycle LELE richiede jog, stitch o layer change e non altro fill. Calibre DFM, Pegasus e deck lithography verificano CMP, coloring, via redundancy e hotspot che non sono riducibili a min-width/min-spacing. Il fill inserito per density cambia coupling e richiede nuova estrazione, mentre il fix coloring può cambiare routing e timing. Il failure mode è chiudere DRC base prima del fill e introdurre successivamente un hotspot litografico o 35 ps di delay senza riaprire PV e STA.",
          "Density and multi-patterning are distinct manufacturability checks: the former controls percentages in windows, while the latter controls decomposition onto compatible masks (IRDS). A 100×100 µm window at 18% may need fill up to 25%, while an LELE odd cycle needs a jog, stitch, or layer change rather than more fill. Calibre DFM, Pegasus, and lithography decks check CMP, coloring, via redundancy, and hotspots that cannot be reduced to minimum width and spacing. Fill inserted for density changes coupling and requires new extraction, while a coloring fix can alter routing and timing. The failure mode is closing base DRC before fill and then introducing a lithographic hotspot or 35 ps of delay without reopening PV and STA."
        ),
        refs: ["sematech-irds"],
      },
      {
        body: loc(
          "ERC e reliability verification cercano floating gate, power-ground short, illegal voltage crossing, latch-up path, ESD continuity e current overstress oltre la pura equivalenza geometrica. Calibre PERC, Pegasus e tool foundry possono propagare net class e voltage per trovare un gate da 0,8 V esposto a 1,8 V o una diode ESD isolata. IEEE 1149.1 aggiunge connettività boundary-scan e pad access che deve sopravvivere al merge top-level (IEEE 1149.1). Un GKC serio archivia report DRC zero, LVS CORRECT, ERC clean, antenna clean e checksum del medesimo GDS, non screenshot provenienti da revisioni diverse. Il failure mode è un chip logicamente equivalente che si danneggia all'accensione, non scarica ESD o non è controllabile sul board nonostante i singoli blocchi risultassero clean.",
          "ERC and reliability verification look for floating gates, power-ground shorts, illegal voltage crossings, latch-up paths, ESD continuity, and current overstress beyond geometric equivalence. Calibre PERC, Pegasus, and foundry tools propagate net classes and voltage to find a 0.8 V gate exposed to 1.8 V or an isolated ESD diode. IEEE 1149.1 adds boundary-scan and pad-access connectivity that must survive top-level merge (IEEE 1149.1). A serious GKC archives zero-DRC, LVS CORRECT, clean ERC, clean antenna, and the checksum of the same GDS rather than screenshots from different revisions. The failure mode is a logically equivalent chip damaged at power-up, unable to discharge ESD, or uncontrollable on the board even though individual blocks were clean."
        ),
        refs: ["ieee-1149"],
      },
    ],
  },
  power: {
    kicker: loc(
      "Il power signoff unisce attività, capacità, tensione, leakage, temperatura e rete di alimentazione per verificare energia e affidabilità sul workload reale.",
      "Power signoff combines activity, capacitance, voltage, leakage, temperature, and the delivery network to verify energy and reliability on the real workload."
    ),
    paragraphs: [
      {
        body: loc(
          "La potenza dinamica di switching si approssima con P = αCV²f, a cui si aggiungono internal power e short-circuit power caratterizzate in Liberty (Harris & Weste; Liberty/CCS). Per α = 0,2, C = 10 nF, V = 0,8 V e f = 1 GHz, il termine αCV²f vale 1,28 W. Ridurre V del 10% porta idealmente il termine al 81%, ma può richiedere celle più grandi o frequenza minore e quindi cambiare C e timing. PrimePower, Joules e Voltus Power usano toggle e waveform Liberty per accumulare energia per cella, net e clock domain. Il failure mode è stimare con α uniforme 0,1 e ignorare glitch o clock ad attività prossima a uno, sottodimensionando package, termica e PDN.",
          "Dynamic switching power is approximated by P = αCV²f, with Liberty-characterized internal and short-circuit power added (Harris & Weste; Liberty/CCS). For α = 0.2, C = 10 nF, V = 0.8 V, and f = 1 GHz, the αCV²f term is 1.28 W. Lowering V by 10% ideally reduces that term to 81%, but may require larger cells or lower frequency and thereby change C and timing. PrimePower, Joules, and Voltus Power use toggles and Liberty waveforms to accumulate energy by cell, net, and clock domain. The failure mode is estimating with uniform α = 0.1 while ignoring glitches or clocks with activity near one, undersizing package, thermal solution, and PDN."
        ),
        refs: ["harris-weste", "liberty"],
      },
      {
        body: loc(
          "Leakage non segue V²: subthreshold, gate e junction leakage dipendono esponenzialmente da threshold e temperatura, e lo scaling aumenta la pressione descritta dall'IRDS (Rabaey et al.; IRDS). Una swap LVT→HVT può ridurre leakage di un ordine di grandezza in alcune library ma aggiunge delay, quindi si applica soltanto ai path con slack. PrimeTime PX, PrimePower e Voltus leggono leakage per stato e corner Liberty; un gate NAND ha corrente diversa per 00, 01, 10 e 11. A 125 °C il leakage può essere molte volte il valore a 25 °C, e il calore aggiuntivo crea feedback termico che aumenta ancora la corrente. Il failure mode è chiudere active power a temperatura nominale ma superare standby, junction temperature o battery budget nel corner hot con domini non realmente power-gated.",
          "Leakage does not follow V²: subthreshold, gate, and junction leakage depend exponentially on threshold and temperature, and scaling increases the pressure documented by IRDS (Rabaey et al.; IRDS). An LVT→HVT swap can reduce leakage by an order of magnitude in some libraries but adds delay, so it is applied only to paths with slack. PrimeTime PX, PrimePower, and Voltus read state- and corner-dependent Liberty leakage; a NAND gate draws different current in states 00, 01, 10, and 11. At 125 °C leakage can be many times its 25 °C value, and added heat creates thermal feedback that raises current further. The failure mode is closing active power at nominal temperature while exceeding standby, junction-temperature, or battery budgets in the hot corner with domains not actually power-gated."
        ),
        refs: ["rabaey", "sematech-irds", "liberty"],
      },
      {
        body: loc(
          "La qualità del risultato dipende dalla coverage temporale e funzionale dei vettori: VCD conserva transizioni, SAIF statistiche aggregate e FSDB una traccia compressa. PrimePower, Voltus e RedHawk devono mappare i nomi RTL o gate alle istanze, riportando percentuale di annotation e attività di clock, memory e macro non coperte. Un workload di 10 ms a 1 GHz contiene 10 milioni di cicli, ma il WORST_POWER window e il WORST_dI/dt window possono essere due intervalli diversi di pochi nanosecondi. Vectorless analysis è utile presto, però le probabilità indipendenti possono creare combinazioni impossibili o cancellare correlazioni reali. Il failure mode è un report numericamente preciso su 60% di istanze annotate e default zero sulle altre, oppure un test idle usato per dimensionare il burst massimo.",
          "Result quality depends on temporal and functional vector coverage: VCD preserves transitions, SAIF aggregates statistics, and FSDB stores a compressed trace. PrimePower, Voltus, and RedHawk must map RTL or gate names to instances and report annotation percentage plus uncovered clock, memory, and macro activity. A 10 ms workload at 1 GHz contains 10 million cycles, yet the WORST_POWER and WORST_dI/dt windows may be different few-nanosecond intervals. Vectorless analysis is useful early, but independent probabilities can create impossible combinations or erase real correlation. The failure mode is a numerically precise report with 60% of instances annotated and zero defaults elsewhere, or an idle test used to size the maximum burst."
        ),
        refs: ["harris-weste"],
      },
      {
        body: loc(
          "Power integrity collega consumo e rete con V_drop = I·R, ΔV_L = L·di/dt e C ≥ I·Δt/ΔV (Rabaey et al.). RedHawk-SC e Voltus estraggono package più on-die PDN, risolvono static e dynamic IR e possono esportare una voltage map per IR-aware PrimeTime. Un droop da 70 mV su 0,75 V vale 9,3% e può violare un budget dinamico del 10% se durata e coincidenza con capture sono sfavorevoli. Widen strap, via array, bump relocation e decap agiscono su termini diversi, quindi aggiungere capacità non corregge una resistenza DC eccessiva. Il failure mode è una timing closure basata su V nominale quando un cluster vede una rail locale inferiore, con delay e corrente che il modello non ha correlato.",
          "Power integrity connects consumption and delivery through V_drop = I·R, ΔV_L = L·di/dt, and C ≥ I·Δt/ΔV (Rabaey et al.). RedHawk-SC and Voltus extract package plus on-die PDN, solve static and dynamic IR, and can export a voltage map for IR-aware PrimeTime. A 70 mV droop on 0.75 V is 9.3% and may violate a 10% dynamic budget when duration and capture coincidence are unfavorable. Wider straps, via arrays, bump relocation, and decap act on different terms, so adding capacitance does not fix excessive DC resistance. The failure mode is timing closure based on nominal V while a cluster sees a lower local rail, with delay and current that the model has not correlated."
        ),
        refs: ["rabaey"],
      },
      {
        body: loc(
          "Il signoff EM usa MTTF = A/j^n·exp(E_a/kT), con n circa 1–2, insieme ai limiti foundry per average, RMS, peak e via (Black 1969). Se n = 2, portare j da 1,0 a 1,6 volte il riferimento riduce il fattore di vita a 1/1,6² ≈ 39% a temperatura invariata. RedHawk, Voltus e Calibre PERC devono analizzare separatamente power EM e signal EM su clock, reset e bus ad alta attività. I profili mission e le temperature di qualifica devono essere coerenti con target JEDEC, perché 10 anni consumer e stress automotive non sono lo stesso requisito (JEDEC). Il failure mode è una via clock che passa static IR ma supera RMS current, sviluppa void e apre dopo aging pur con potenza media entro budget.",
          "EM signoff uses MTTF = A/j^n·exp(E_a/kT), with n around 1–2, together with foundry limits for average, RMS, peak, and via current (Black 1969). If n = 2, raising j from 1.0 to 1.6 times the reference reduces the lifetime factor to 1/1.6² ≈ 39% at unchanged temperature. RedHawk, Voltus, and Calibre PERC must analyze power EM separately from signal EM on clocks, resets, and high-activity buses. Mission profiles and qualification temperatures must align with JEDEC targets because a 10-year consumer target and automotive stress are not the same requirement (JEDEC). The failure mode is a clock via that passes static IR but exceeds RMS current, develops a void, and opens after aging despite average power being within budget."
        ),
        refs: ["black-1969", "jedec"],
      },
    ],
  },
  package: {
    kicker: loc(
      "Il package completa il circuito elettrico e termico: bump, RDL, substrate e PCB determinano impedenza, rumore simultaneo e temperatura del die.",
      "The package completes the electrical and thermal circuit: bumps, RDL, substrate, and PCB determine impedance, simultaneous noise, and die temperature."
    ),
    paragraphs: [
      {
        body: loc(
          "Wire-bond porta i segnali dal perimetro con fili relativamente induttivi, mentre flip-chip usa bump area-array con percorsi più corti e migliaia di IO. Un pitch bump di 130 µm su una matrice 40×40 offre 1600 siti lordi, dai quali vanno sottratti keepout, corner e una quota sostanziale VDD/VSS. Cadence SiP, Allegro Package Designer e ANSYS SIwave co-ottimizzano bump assignment, escape routing e RDL rispetto ai pin die registrati in DEF (LEF/DEF). Spostare un PHY di 1 mm dopo il freeze può aggiungere RDL, mismatch di differential pair e perdita, non soltanto wirelength estetica. Il failure mode è una bump map elettricamente valida ma non escapable, oppure una regione CPU lontana dai power bump che crea IR hotspot impossibile da correggere solo on-die.",
          "Wire bonding carries signals from the perimeter with relatively inductive wires, while flip-chip uses area-array bumps with shorter paths and thousands of IOs. A 130 µm-pitch 40×40 bump matrix offers 1,600 gross sites, from which keepouts, corners, and a substantial VDD/VSS allocation must be subtracted. Cadence SiP, Allegro Package Designer, and ANSYS SIwave co-optimize bump assignment, escape routing, and RDL against die pins recorded in DEF (LEF/DEF). Moving a PHY by 1 mm after freeze can add RDL, differential-pair mismatch, and loss rather than merely aesthetic wirelength. The failure mode is an electrically valid but unescapable bump map, or a CPU region far from power bumps that creates an IR hotspot impossible to fix on-die alone."
        ),
        refs: ["lef-def"],
      },
      {
        body: loc(
          "Il simultaneous switching output produce ground bounce e supply droop approssimati da ΔV = L_pkg·di/dt, sommati agli effetti resistivi e mutual inductance (Rabaey et al.). Sedici driver che cambiano 20 mA ciascuno in 200 ps generano di/dt = 1,6 A/ns; con 1 nH comune il termine ideale è 1,6 V, mostrando perché return path e package model sono decisivi. IBIS descrive I/V, V/T e clamp del buffer senza rivelarne i transistor, e HyperLynx o SIwave simula il modello con package e PCB. Slew control, pin staggering, più VSS e decap riducono SSO, ma una simulazione single-output non misura la mutualità del bus. Il failure mode è un falso edge, jitter o violazione della input threshold su pin quieti quando molti output commutano nello stesso istante.",
          "Simultaneous switching output creates ground bounce and supply droop approximated by ΔV = L_pkg·di/dt, added to resistive and mutual-inductance effects (Rabaey et al.). Sixteen drivers each changing 20 mA in 200 ps produce di/dt = 1.6 A/ns; with 1 nH common inductance the ideal term is 1.6 V, showing why return paths and package models are decisive. IBIS describes buffer I/V, V/T, and clamps without revealing transistors, and HyperLynx or SIwave simulates it with package and PCB. Slew control, pin staggering, more VSS, and decap reduce SSO, but a single-output simulation cannot measure bus mutuality. The failure mode is a false edge, jitter, or input-threshold violation on quiet pins when many outputs switch simultaneously."
        ),
        refs: ["rabaey"],
      },
      {
        body: loc(
          "La package PDN è una rete RLC con anti-resonance tra on-die, package e board capacitor, quindi una bassa impedenza DC non garantisce basso droop transitorio (Rabaey et al.). Per un rail da 0,8 V con ripple ammesso 5% e step di 4 A, il target impedance è Z_target = ΔV/ΔI = 40 mV/4 A = 10 mΩ. SIwave, Sigrity PowerSI e RedHawk co-simulation tracciano |Z(f)| dai kHz ai GHz e identificano picchi sopra 10 mΩ. Cambiare valore o ESR dei capacitor, aggiungere power bump o accorciare RDL sposta poli e zeri; aggiungere capacità indiscriminatamente può creare un nuovo picco. Il failure mode è un resonance peak vicino all'armonica del clock o al burst rate, con droop ripetitivo che un'analisi DC non vede.",
          "The package PDN is an RLC network with anti-resonance among on-die, package, and board capacitors, so low DC impedance does not guarantee low transient droop (Rabaey et al.). For a 0.8 V rail allowing 5% ripple and a 4 A step, target impedance is Z_target = ΔV/ΔI = 40 mV/4 A = 10 mΩ. SIwave, Sigrity PowerSI, and RedHawk co-simulation trace |Z(f)| from kHz to GHz and identify peaks above 10 mΩ. Changing capacitor value or ESR, adding power bumps, or shortening RDL moves poles and zeros; indiscriminately adding capacitance can create a new peak. The failure mode is a resonance peak near a clock harmonic or burst rate, causing repetitive droop that DC analysis cannot see."
        ),
        refs: ["rabaey"],
      },
      {
        body: loc(
          "A frequenze elevate una package trace è una transmission line, e reflection coefficient Γ = (Z_L−Z_0)/(Z_L+Z_0) quantifica la discontinuità (Rabaey et al.). Con Z_0 = 50 Ω e Z_L = 75 Ω, Γ = 0,2, cioè un'onda riflessa del 20% prima delle perdite e dei clamp. Sigrity, HFSS e HyperLynx estraggono S-parameter, insertion loss, return loss e crosstalk per differential pair e channel completi. Via stub, neck-down, reference-plane split e pair skew degradano eye opening anche quando la netlist package è connessa correttamente. Il failure mode è un link che passa a bassa velocità ma chiude l'eye a 16 GT/s per reflection e loss non rappresentate dal semplice modello RC.",
          "At high frequency a package trace is a transmission line, and reflection coefficient Γ = (Z_L−Z_0)/(Z_L+Z_0) quantifies a discontinuity (Rabaey et al.). With Z_0 = 50 Ω and Z_L = 75 Ω, Γ = 0.2, meaning a 20% reflected wave before losses and clamps. Sigrity, HFSS, and HyperLynx extract S-parameters, insertion loss, return loss, and crosstalk for differential pairs and complete channels. Via stubs, neck-downs, reference-plane splits, and pair skew degrade eye opening even when the package netlist is correctly connected. The failure mode is a link that works at low speed but closes its eye at 16 GT/s because reflections and loss were absent from a simple RC model."
        ),
        refs: ["rabaey"],
      },
      {
        body: loc(
          "Affidabilità package combina junction temperature, thermal resistance, CTE mismatch, solder fatigue, moisture e stress di qualifica definiti nei profili JEDEC (JEDEC). Con θ_JA = 20 °C/W, ambient 85 °C e dissipazione 4 W, la stima di primo ordine T_J = T_A+Pθ_JA raggiunge 165 °C, prima di spreading e airflow dettagliati. Icepak, Celsius EC Solver e FloTHERM modellano die, TIM, lid, substrate e board, mentre test JESD verificano temperature cycle, HTOL e moisture sensitivity secondo il prodotto. Un hotspot locale può accelerare leakage ed electromigration anche se la temperatura media del package rispetta il limite. Il failure mode è timing drift, solder crack o delamination dopo cicli termici, quindi la scelta BGA, flip-chip, 2.5D o 3D è parte del signoff e non soltanto della distinta materiali.",
          "Package reliability combines junction temperature, thermal resistance, CTE mismatch, solder fatigue, moisture, and qualification stress defined in JEDEC profiles (JEDEC). With θ_JA = 20 °C/W, 85 °C ambient, and 4 W dissipation, the first-order estimate T_J = T_A+Pθ_JA reaches 165 °C before detailed spreading and airflow. Icepak, Celsius EC Solver, and FloTHERM model die, TIM, lid, substrate, and board, while JESD tests cover temperature cycling, HTOL, and moisture sensitivity for the product. A local hotspot can accelerate leakage and electromigration even when average package temperature meets the limit. The failure mode is timing drift, solder cracking, or delamination after thermal cycles, so choosing BGA, flip-chip, 2.5D, or 3D is part of signoff rather than merely the bill of materials."
        ),
        refs: ["jedec"],
      },
    ],
  },
  tapeout: {
    kicker: loc(
      "Il tapeout è un rilascio configurato e irreversibile: GKC, BTO/MTO, checksum e prove di signoff devono descrivere esattamente gli stessi dati.",
      "Tapeout is a configured and irreversible release: GKC, BTO/MTO, checksums, and signoff evidence must describe exactly the same data."
    ),
    paragraphs: [
      {
        body: loc(
          "Il Gate Keeper Check è una decisione multidisciplinare, non un comando: FE, LEC, DFT, STA, PV, power, low-power, package e analog devono firmare evidenze sul database finale. Un GKC robusto collega ogni report a design revision, PDK, tool version, corner set e SHA-256 del GDS/OASIS, impedendo di mescolare risultati di run diversi. Calibre fornisce DRC/LVS, PrimeTime MMMC, RedHawk o Voltus IR/EM, Formality LEC e Tessent ATPG, con zero errori o waiver esplicitamente approvati. IEEE 1801 e IEEE 1149.1 richiedono inoltre che power intent e test access consegnati siano quelli verificati, non file preliminari (IEEE 1801; IEEE 1149.1). Il failure mode è un GKC verde su slide ma con fill, ECO o bump map modificati dopo l'ultimo run, rendendo non dimostrato il prodotto realmente rilasciato.",
          "Gate Keeper Check is a multidisciplinary decision, not a command: FE, LEC, DFT, STA, PV, power, low-power, package, and analog owners must sign evidence on the final database. A robust GKC ties every report to design revision, PDK, tool version, corner set, and GDS/OASIS SHA-256, preventing results from different runs from being mixed. Calibre supplies DRC/LVS, PrimeTime MMMC, RedHawk or Voltus IR/EM, Formality LEC, and Tessent ATPG, with zero errors or explicitly approved waivers. IEEE 1801 and IEEE 1149.1 further require delivered power intent and test access to be the verified versions rather than preliminary files (IEEE 1801; IEEE 1149.1). The failure mode is a green GKC slide deck while fill, ECO, or bump map changed after the last run, leaving the actually released product unproven."
        ),
        refs: ["ieee-1801", "ieee-1149"],
      },
      {
        body: loc(
          "BTO congela i layer base FEOL come well, active, poly e implant, mentre MTO congela via e metalli BEOL; la separazione permette di iniziare mask base mentre il routing finale continua. Un metal-only ECO dopo BTO può riusare spare transistor esistenti, ma una nuova cella o un cambio diffusion richiede riaprire il base tapeout. Calibre base DRC e LVS parziale proteggono il BTO, mentre MTO richiede merged DRC/LVS, antenna, density, STA post-fill e IR/EM completi. I record LEF/DEF e netlist devono mantenere la corrispondenza tra spare fisiche e funzione ECO fino al GDS finale (LEF/DEF). Il failure mode è classificare erroneamente un fix come metal-only, ordinare mask FEOL incompatibili e trasformare un ECO locale in respin completo.",
          "BTO freezes FEOL base layers such as wells, active, poly, and implants, while MTO freezes BEOL vias and metals; separation allows base masks to start while final routing continues. A metal-only ECO after BTO can reuse existing spare transistors, but a new cell or diffusion change requires reopening base tapeout. Calibre base DRC and partial LVS protect BTO, while MTO requires complete merged DRC/LVS, antenna, density, post-fill STA, and IR/EM. LEF/DEF records and netlists must preserve correspondence between physical spares and ECO function through final GDS (LEF/DEF). The failure mode is misclassifying a fix as metal-only, ordering incompatible FEOL masks, and turning a local ECO into a full respin."
        ),
        refs: ["lef-def"],
      },
      {
        body: loc(
          "Il data package contiene GDSII o OASIS, layer map, netlist, SDC, UPF, waiver, job deck, IP declaration, checksum e spesso package/bump collateral. GDSII codifica poligoni gerarchici per layer e datatype, mentre OASIS riduce dimensione con ripetizione e compressione; nessuno dei due porta da solo l'intento temporale o di potenza. KLayout, Calibre Merge e utility foundry verificano hierarchy, unità, missing cell, illegal name e corrispondenza layer prima dell'upload. IEEE 1801 conserva la semantica power e LEF/DEF il contratto geometrico usato per ricostruzione e debug (IEEE 1801; LEF/DEF). Il failure mode è un archivio formalmente completo ma con macro GDS mancante, layer map di un'altra PDK revision o SDC non corrispondente alla netlist firmata.",
          "The data package contains GDSII or OASIS, layer map, netlist, SDC, UPF, waivers, job deck, IP declarations, checksums, and often package and bump collateral. GDSII encodes hierarchical polygons by layer and datatype, while OASIS reduces size through repetition and compression; neither alone carries timing or power intent. KLayout, Calibre Merge, and foundry utilities check hierarchy, units, missing cells, illegal names, and layer correspondence before upload. IEEE 1801 preserves power semantics, and LEF/DEF preserves the geometric contract used for reconstruction and debug (IEEE 1801; LEF/DEF). The failure mode is a formally complete archive with a missing macro GDS, a layer map from another PDK revision, or SDC that does not match the signed netlist."
        ),
        refs: ["ieee-1801", "lef-def"],
      },
      {
        body: loc(
          "Il costo mask dipende fortemente da nodo, numero di layer, multi-patterning e accordo foundry, ma per nodi avanzati l'ordine di grandezza è milioni fino a oltre dieci milioni di dollari, non migliaia (IRDS). Un full mask set richiede decine di mask e dati OPC/RET, mentre un MPW condivide wafer e mask tra progetti riducendo il costo di accesso ma imponendo area e schedule. Tool foundry fracture e mask-data preparation espandono il layout in figure scrivibili; un GDS da centinaia di GB può generare un volume molto maggiore dopo OPC. L'IRDS contestualizza l'aumento di complessità di patterning e interconnect che rende ogni respin economicamente pesante. Il failure mode è accettare un waiver debole o saltare un corner per risparmiare ore di compute, esponendo un respin il cui costo supera di ordini di grandezza quello del signoff.",
          "Mask cost depends strongly on node, layer count, multi-patterning, and foundry agreement, but at advanced nodes its order of magnitude is millions to more than ten million dollars, not thousands (IRDS). A full mask set needs dozens of masks plus OPC/RET data, while an MPW shares wafers and masks across projects to lower entry cost at the expense of area and schedule constraints. Foundry fracturing and mask-data-preparation tools expand layout into writable figures; a GDS hundreds of gigabytes in size can generate much larger data after OPC. IRDS contextualizes the growing patterning and interconnect complexity that makes every respin economically severe. The failure mode is accepting a weak waiver or skipping a corner to save compute hours, exposing a respin whose cost exceeds signoff by orders of magnitude."
        ),
        refs: ["sematech-irds"],
      },
      {
        body: loc(
          "Il release finale deve essere riproducibile: manifest, input checksum, container o tool build, license option, script, environment variable e log datato devono ricreare ogni risultato critico. Un cambiamento di Liberty, SDC o PDK dopo signoff invalida la catena anche se il file GDS conserva lo stesso nome (Liberty/CCS; SDC). Il GKC deve verificare BTO/MTO status, DRC zero, LVS CORRECT, WNS/TNS non negativi in tutte le view, IR/EM, ATPG, UPF, package e waiver closure sul medesimo tag. Foundry portal e sistemi PLM archiviano ricevuta, checksum e approvazioni, mentre un golden readback conferma che il file ricevuto coincide bit-per-bit con quello inviato. Il failure mode è non poter spiegare una discrepanza su silicon perché report, script e dati non sono versionati, trasformando il bring-up in congettura anziché root-cause analysis.",
          "The final release must be reproducible: manifests, input checksums, container or tool builds, license options, scripts, environment variables, and dated logs must recreate every critical result. A Liberty, SDC, or PDK change after signoff breaks the evidence chain even if the GDS filename remains unchanged (Liberty/CCS; SDC). GKC must verify BTO/MTO status, zero DRC, LVS CORRECT, nonnegative WNS/TNS in every view, IR/EM, ATPG, UPF, package, and waiver closure on the same tag. Foundry portals and PLM systems archive receipt, checksums, and approvals, while a golden readback confirms that the received file is bit-for-bit identical to the sent file. The failure mode is being unable to explain a silicon discrepancy because reports, scripts, and data were not versioned, turning bring-up into speculation rather than root-cause analysis."
        ),
        refs: ["liberty", "sdc"],
      },
    ],
  },
};
