import { loc } from "@/i18n/context";
import type { Localized } from "@/i18n/context";
import type { StageId } from "./stages";

/** Third batch of long-form essay paragraphs merged after stageEssays and stageEssayExtras. */
export const stageEssayExtras3: Record<StageId, Localized[]> = {
  rtl: [
    loc(
      "Retiming a RTL è la leva silenziosa del PD: spostare un registro attraverso un mux o un adder può accorciare il critical path di 1–2 cicli senza cambiare la funzione. A 1.5 GHz su 5 nm, un ciclo vale 667 ps — due cicli in meno equivalgono a ~1.3 ns di budget logico. Il tool (Design Compiler retime, Genus) richiede constraint espliciti: set_max_delay, set_multicycle_path, e non retimare attraverso domini clock diversi. Un retime non documentato rompe LEC e formal: ogni spostamento va tracciato nel change log con owner architetturale.",
      "RTL retiming is PD's silent lever: moving a register through a mux or adder can shorten the critical path by 1–2 cycles without changing function. At 1.5 GHz on 5 nm, one cycle is 667 ps — two fewer cycles equal ~1.3 ns of logic budget. The tool (Design Compiler retime, Genus) needs explicit constraints: set_max_delay, set_multicycle_path, and no retiming across clock domains. Undocumented retime breaks LEC and formal: every move must be traced in the change log with an architectural owner."
    ),
    loc(
      "Bus width negotiation a RTL: un AXI da 512 bit tra CPU e L2 a 2 GHz consuma ~1024 wire equivalenti nel floorplan. Se il PHY DDR è a 3 mm di distanza, il routing costa 200–400 ps di wire delay a 7 nm. La regola industriale è «width ∝ bandwidth × distance⁻¹»: accorcia il bus (256 bit + double-pump) o avvicina le macro nel floorplan, non entrambi ignorati. Parametri SystemVerilog (`parameter DATA_W = 256`) permettono sweep architetturale prima del freeze. Il PD partecipa alla review MAS quando DATA_W > 128.",
      "Bus-width negotiation at RTL: a 512-bit AXI between CPU and L2 at 2 GHz consumes ~1024 equivalent wires in the floorplan. If the DDR PHY is 3 mm away, routing costs 200–400 ps of wire delay at 7 nm. The industrial rule is «width ∝ bandwidth × distance⁻¹»: shorten the bus (256-bit + double-pump) or move macros closer in floorplan — not both ignored. SystemVerilog parameters (`parameter DATA_W = 256`) enable architectural sweeps before freeze. PD joins the MAS review when DATA_W > 128."
    ),
    loc(
      "X-propagation e reset value: in sim, un X su un segnale può mascherare un bug; in silicon diventa 0 o 1 random. SpyGlass/VC-Lint ha regole X-prop (W123, W456). Ogni FF deve avere reset value esplicito o documentato come don't-care con formal proof. Scan mode con X su scan_in causa ATPG coverage hole. Il PD vede X come timing path instabile — un path con X non chiude in PrimeTime. Prima del handoff: report X-clean su tutti i mode (func, scan, sleep, mbist).",
      "X-propagation and reset value: in sim, an X on a signal can mask a bug; in silicon it becomes random 0 or 1. SpyGlass/VC-Lint has X-prop rules (W123, W456). Every FF needs an explicit reset value or a documented don't-care with formal proof. Scan mode with X on scan_in causes ATPG coverage holes. PD sees X as an unstable timing path — a path with X does not close in PrimeTime. Before handoff: X-clean report on all modes (func, scan, sleep, mbist)."
    ),
    loc(
      "Lint waiver policy: un waiver senza owner, scadenza e giustificazione tecnica è debito tecnico che esplode in silicon debug. ARM/Synopsys guidelines richiedono: rule ID, file:line, rationale, approver, expiry date. Waiver su CDC (CDC-1, CDC-2) e clock gating (CLKGATE-1) richiedono review PD+FE. Un design con 500 waiver attivi e 50 nuovi al giorno non è «lint-clean» — è un processo rotto. Target produzione: <20 waiver totali, tutti con scadenza <6 mesi.",
      "Lint waiver policy: a waiver without owner, expiry, and technical rationale is technical debt that explodes in silicon debug. ARM/Synopsys guidelines require: rule ID, file:line, rationale, approver, expiry date. Waivers on CDC (CDC-1, CDC-2) and clock gating (CLKGATE-1) need PD+FE review. A design with 500 active waivers and 50 new per day is not «lint-clean» — the process is broken. Production target: <20 total waivers, all with expiry <6 months."
    ),
  ],
  verification: [
    loc(
      "Constrained-random UVM: il randomizer genera stimulus legale entro i constraint del sequence item. Un constraint troppo stretto → coverage stall; troppo largo → sim lenta e bug irrilevanti. Coverage-driven closure: si aggiungono constraint finché ogni bin functional è hit ≥95%. Il PD non scrive sequence, ma esige che i mode STA (scan_shift, scan_capture, sleep, mbist) abbiano almeno un test UVM che li esercita con VCD/FSDB export. Senza activity reale, RedHawk mente e IR signoff è falso.",
      "Constrained-random UVM: the randomizer generates legal stimulus within sequence-item constraints. A constraint too tight → coverage stall; too loose → slow sim and irrelevant bugs. Coverage-driven closure: add constraints until every functional bin is hit ≥95%. PD does not write sequences, but demands that STA modes (scan_shift, scan_capture, sleep, mbist) have at least one UVM test exercising them with VCD/FSDB export. Without real activity, RedHawk lies and IR signoff is false."
    ),
    loc(
      "Regression farm e nightly: 10k+ test, 50+ ore wall-clock su farm da 500 core. Un nightly rosso blocca il merge RTL. Il PD monitora i test che toccano power mode e scan: se «test_scan_at_speed» fallisce a RTL, il hold post-CTS sarà un disastro. Metriche da colloquio: sim cycles/day, regression pass rate, coverage delta per commit. Un commit che abbassa coverage del 2% senza waiver è un revert automatico.",
      "Regression farm and nightly: 10k+ tests, 50+ wall-clock hours on a 500-core farm. A red nightly blocks RTL merge. PD monitors tests touching power modes and scan: if «test_scan_at_speed» fails at RTL, post-CTS hold will be a disaster. Interview metrics: sim cycles/day, regression pass rate, coverage delta per commit. A commit that drops coverage 2% without a waiver is an automatic revert."
    ),
    loc(
      "Formal property suite: O(100)–O(1000) assert su control path critico (arbiter, FIFO, reset FSM). Bounded model checking (BMC) depth 20–50 cicli; unbounded se il solver converge. Jasper/VC Formal report: proven, falsified, bounded, inconclusive. Un assert «proven» su handshake AXI elimina false path creativi in STA. Il PD chiede la lista assert proven prima di firmare il netlist — meno sorpresa in timing closure.",
      "Formal property suite: O(100)–O(1000) asserts on critical control paths (arbiter, FIFO, reset FSM). Bounded model checking (BMC) depth 20–50 cycles; unbounded if the solver converges. Jasper/VC Formal report: proven, falsified, bounded, inconclusive. A «proven» assert on AXI handshake removes creative false paths in STA. PD asks for the proven-assert list before signing the netlist — fewer surprises in timing closure."
    ),
    loc(
      "Emulation handoff (ZeBu, Palladium): netlist synthesizable, SDF opzionale, memory model behavioral. Boot OS a 1–10 MHz effective — troppo lento per timing ma cattura bug di integrazione system-level. Il PD riceve: netlist golden post-emulation, SDC aggiornato, lista ECO emulazione. Un bug trovato in emulation che richiede RTL change è un respin FE — non un metal-only ECO. Lead time emulation setup: 2–4 settimane; pianificare prima del RTL freeze.",
      "Emulation handoff (ZeBu, Palladium): synthesizable netlist, optional SDF, behavioral memory models. OS boot at 1–10 MHz effective — too slow for timing but catches system-level integration bugs. PD receives: post-emulation golden netlist, updated SDC, emulation ECO list. A bug found in emulation requiring RTL change is an FE respin — not a metal-only ECO. Emulation setup lead time: 2–4 weeks; plan before RTL freeze."
    ),
  ],
  synthesis: [
    loc(
      "QoR dashboard post-synth: WNS, TNS, area (µm²), total power (mW), cell count, max_fanout violation, max_tran violation, max_cap violation. Un report con WNS +30 ps ma 3000 max_tran violation è inutile — il delay è estrapolato. Target industriale: DRV=0, WNS ≥ −0.05 ns, area entro ±5% del budget. compile_ultra -no_autoungroup mantiene gerarchia per debug; -autoungroup migliora QoR ma rompe LEC boundary. Il PD preferisce gerarchia fino a place.",
      "Post-synth QoR dashboard: WNS, TNS, area (µm²), total power (mW), cell count, max_fanout, max_tran, max_cap violations. A report with WNS +30 ps but 3000 max_tran violations is useless — delay is extrapolated. Industrial target: DRV=0, WNS ≥ −0.05 ns, area within ±5% of budget. compile_ultra -no_autoungroup keeps hierarchy for debug; -autoungroup improves QoR but breaks LEC boundaries. PD prefers hierarchy until place."
    ),
    loc(
      "Incremental compile: dopo un ECO RTL locale, compile -incremental riusa il mapping precedente sui blocchi non toccati. Risparmio: 60–80% runtime vs full compile. Richiede: stesso .lib, stesso constraint file, change list limitata. Un incremental con cambio di corner o lib è invalido — full recompile obbligatorio. Il PD riceve netlist incremental solo se LEC RTL↔gate passa su tutto il design, non solo sul blocco ECO.",
      "Incremental compile: after a local RTL ECO, compile -incremental reuses prior mapping on untouched blocks. Savings: 60–80% runtime vs full compile. Requires: same .lib, same constraint file, limited change list. Incremental with corner or lib change is invalid — full recompile mandatory. PD receives incremental netlist only if RTL↔gate LEC passes on the full design, not just the ECO block."
    ),
    loc(
      "Boundary optimization: synthesis ottimizza attraverso i confini gerarchici se non protetti. set_boundary_optimization false su IP/macro mantiene l'interfaccia stabile per il PD. Un IP con 200 pin e boundary opt off ha timing prevedibile; con opt on il PD vede sorpresa post-place. Dont_touch su hierarchical port equivale a boundary opt off per quel pin. Negoziare con il vendor IP prima del floorplan.",
      "Boundary optimization: synthesis optimizes across hierarchy boundaries unless protected. set_boundary_optimization false on IP/macros keeps the interface stable for PD. An IP with 200 pins and boundary opt off has predictable timing; with opt on PD sees post-place surprise. dont_touch on hierarchical ports equals boundary opt off for that pin. Negotiate with the IP vendor before floorplan."
    ),
    loc(
      "Clock mux e glitch-free switching: un mux 2:1 sul clock root richiede make_before_break o specialized clock mux cell. Synthesis inserisce la cella se specificata in RTL/SDC; altrimenti inferisce AND/OR pericolosi. set_clock_gating_check e set_case_analysis per test mode devono coprire ogni selezione mux. Il PD tratta il mux come clock root — NDR, exclusion region, transition limit. Un glitch sul clock root è silicon irreproducibile.",
      "Clock mux and glitch-free switching: a 2:1 mux on the clock root needs make-before-break or a specialized clock-mux cell. Synthesis inserts the cell if specified in RTL/SDC; otherwise it infers dangerous AND/OR. set_clock_gating_check and set_case_analysis for test mode must cover every mux select. PD treats the mux as a clock root — NDR, exclusion region, transition limit. A glitch on the clock root is irreproducible silicon."
    ),
  ],
  floorplan: [
    loc(
      "HBM channel planning: ogni stack HBM3 (16 Gb) ha 1024 bit DQ + 128 bit ECC a 6.4 Gbps — ~800 Gbps per stack. Il controller HBM deve stare entro 500 µm dal bump array PHY; oltre 1 mm il flyline aggiunge 150–300 ps e la SI su DQ degrada. Floorplan tipico: HBM ai lati corti del die, logic al centro, NoC verticale. Blockage 10–15 µm attorno ai bump HBM. Il PD partecipa al meeting HBM+package day-1.",
      "HBM channel planning: each HBM3 stack (16 Gb) has 1024 DQ bits + 128 ECC bits at 6.4 Gbps — ~800 Gbps per stack. The HBM controller must sit within 500 µm of the PHY bump array; beyond 1 mm flyline adds 150–300 ps and DQ SI degrades. Typical floorplan: HBM on short die sides, logic in center, vertical NoC. 10–15 µm blockage around HBM bumps. PD joins the HBM+package day-1 meeting."
    ),
    loc(
      "Macro orientation e pin access: una SRAM 4 Mb con pin su un solo lato va ruotata verso il canale di routing, non verso un'altra macro. Pin density > 50 pin/µm su un lato richiede canale ≥ 8 µm a 7 nm. Innovus/ICC2 «pin access» report: rosso = macro da ruotare o spostare. Un macro con pin verso il core center è congestion garantita — il router non ha layer per 200 net simultanee.",
      "Macro orientation and pin access: a 4 Mb SRAM with pins on one side must face the routing channel, not another macro. Pin density > 50 pins/µm on one side needs channel ≥ 8 µm at 7 nm. Innovus/ICC2 «pin access» report: red = rotate or move macro. A macro with pins toward the core center is guaranteed congestion — the router has no layers for 200 simultaneous nets."
    ),
    loc(
      "IO filler e corner cell: tra i pad IO servono filler cell per continuità N-well e ESD. Corner cell agli angoli del die — struttura rinforzata per sawing stress. Seal ring overlap con IO ring: keepout 5–10 µm. Un pad mancante nel ring causa DRC M1.S.1 al tapeout. Il floorplan IO è frozen con il bump map — cambiare dopo è respin package o ECO impossibile.",
      "IO filler and corner cells: filler cells between IO pads maintain N-well continuity and ESD. Corner cells at die corners — reinforced structure for sawing stress. Seal ring overlap with IO ring: 5–10 µm keepout. A missing pad in the ring causes M1.S.1 DRC at tapeout. IO floorplan is frozen with the bump map — changing later is package respin or impossible ECO."
    ),
    loc(
      "Tie-high/tie-low cell placement: non lasciare al placer — posizionare cluster di TIEH/TIEL vicino ai domini che ne consumano di più. Un tie cell a 200 µm dal consumer aggiunge wire delay e congestion. Density target su regione tie: 0.85–0.90. Verificare con verify_tie_cells post-floorplan. Un floating input da tie mancante è X in sim e metastabilità in silicon.",
      "Tie-high/tie-low cell placement: do not leave to the placer — place TIEH/TIEL clusters near domains that consume them most. A tie cell 200 µm from the consumer adds wire delay and congestion. Density target on tie region: 0.85–0.90. Verify with verify_tie_cells post-floorplan. A floating input from a missing tie is X in sim and metastability in silicon."
    ),
  ],
  pdn: [
    loc(
      "Split-rail architecture: core digital a 0.75 V, I/O a 1.8 V, analog a 1.2 V — tre mesh PG indipendenti. Il confine tra rail richiede level shifter strip e isolation cell. IR su rail I/O non impatta core, ma SSO su I/O può accoppiare via substrate. RedHawk simula per-rail con boundary condition corrette. Un mesh VDD core collegato per errore a VDD_IO è LVS fail e possibile latch-up.",
      "Split-rail architecture: digital core at 0.75 V, I/O at 1.8 V, analog at 1.2 V — three independent PG meshes. Rail boundaries need level-shifter strips and isolation cells. IR on the I/O rail does not impact core, but I/O SSO can couple via substrate. RedHawk simulates per-rail with correct boundary conditions. A core VDD mesh wrongly tied to VDD_IO is LVS fail and possible latch-up."
    ),
    loc(
      "Back-bias (FBB/RBB): body bias modula Vth — forward bias abbassa Vth (più veloce, più leakage), reverse alza Vth (più lento, meno leakage). Richiede well tap dedicati e regolatore on-die. Il PD posiziona i tap well ogni 15–25 µm secondo DRM. Un blocco CPU con RBB attivo ha timing diverso da FBB — corner STA separati. Power saving RBB: 15–30% leakage, costo area tap +5%.",
      "Back-bias (FBB/RBB): body bias modulates Vth — forward bias lowers Vth (faster, more leakage), reverse raises Vth (slower, less leakage). Requires dedicated well taps and on-die regulator. PD places well taps every 15–25 µm per DRM. A CPU block with active RBB has different timing than FBB — separate STA corners. RBB power savings: 15–30% leakage, tap area cost +5%."
    ),
    loc(
      "PG via stack optimization: da M1 a M9 servono 8–12 via per strap su corrente > 1 A. Double-cut via (bar via) riduce R del 30–40% vs single square. Via array su angolo strap-spine è il collo di bottiglia EM — Calibre PG.EM report. Iterazione: widen strap → re-sim IR → fix via → re-check EM. 3–5 cicli tipici prima di signoff. Un via singolo su strap da 1.5 A è fail classico al GKC.",
      "PG via-stack optimization: M1 to M9 needs 8–12 vias per strap at current > 1 A. Double-cut via (bar via) cuts R by 30–40% vs single square. Via array at strap-spine corners is the EM bottleneck — Calibre PG.EM report. Iteration: widen strap → re-sim IR → fix vias → re-check EM. 3–5 cycles typical before signoff. A single via on a 1.5 A strap is a classic GKC fail."
    ),
    loc(
      "Analog PG isolation: il dominio PLL/ADC ha PSRR requirement — noise VDD < 5 mV rms. Mesh digitale aggressivo accoppia switching noise via substrate e cap coupling. Keepout 50–100 µm attorno ad analog, mesh analog separato con star connection al bump. Shield M6/M7 attorno a sensitive analog nets. Il PD coordina con il team analog — un floorplan che mette il PLL accanto al core CPU è un fail di progetto, non un fix di routing.",
      "Analog PG isolation: PLL/ADC domain has PSRR requirements — VDD noise < 5 mV rms. Aggressive digital mesh couples switching noise via substrate and cap coupling. 50–100 µm keepout around analog, separate analog mesh with star connection to bump. M6/M7 shield around sensitive analog nets. PD coordinates with the analog team — a floorplan placing PLL next to the CPU core is a project fail, not a routing fix."
    ),
  ],
  placement: [
    loc(
      "Affinity groups e region constraint: raggruppare FF dello stesso datapath (es. ALU pipeline stage 3) in una region 50×50 µm migliora wirelength del 20–40% e riduce SI. create_bound -type soft -name alu_s3 -dimensions {50 50}. Il placer rispetta soft bound con peso; hard bound è fence assoluto. Troppi hard bound → legalization fail. Il senior usa soft bound su hotspot, hard bound solo su IP/macro.",
      "Affinity groups and region constraints: grouping FFs of the same datapath (e.g. ALU pipeline stage 3) in a 50×50 µm region improves wirelength 20–40% and cuts SI. create_bound -type soft -name alu_s3 -dimensions {50 50}. The placer honors soft bounds with weight; hard bound is absolute fence. Too many hard bounds → legalization fail. Seniors use soft bound on hotspots, hard bound only on IP/macros."
    ),
    loc(
      "Pin access post-global-place: il report pin_access_violation elenca macro con pin non raggiungibili dal router. Causa tipica: macro troppo vicine, canale < 5 µm, blockage errato. Fix: spread macro, rotate 90°, partial blockage nel halo. Non procedere a CTS con pin access rosso — il detailed route fallirà su 500+ net. Innovus report: «N macros with pin access violation» deve essere zero.",
      "Pin access post-global-place: the pin_access_violation report lists macros with pins unreachable by the router. Typical cause: macros too close, channel < 5 µm, wrong blockage. Fix: spread macros, rotate 90°, partial blockage in halo. Do not proceed to CTS with red pin access — detailed route will fail on 500+ nets. Innovus report: «N macros with pin access violation» must be zero."
    ),
    loc(
      "Legalization rip-up: se displacement tail > 15 µm su cluster, il placer fa rip-up globale con density -10%. Costo: 4–8 ore runtime, timing pre-CTS può peggiorare temporaneamente. Alternativa: manual move di macro + re-place locale. Un rip-up senza root-cause analysis (blockage, density, macro channel) ripete lo stesso fail. Documentare la causa nel placement log.",
      "Legalization rip-up: if displacement tail > 15 µm on a cluster, the placer does global rip-up with density −10%. Cost: 4–8 hours runtime, pre-CTS timing may temporarily worsen. Alternative: manual macro move + local re-place. Rip-up without root-cause analysis (blockage, density, macro channel) repeats the same fail. Document the cause in the placement log."
    ),
    loc(
      "Filler cell ordering: tap cell prima di filler standard, endcap a fine row. Ordine sbagliato → N-well discontinuity → latch-up DRC. Filler con decap capability va vicino a hotspot power. Density filler target 0.95–0.98 per evitare gap che il router non può usare. verify_filler post-place è check automatico — non skip.",
      "Filler cell ordering: tap cells before standard filler, endcap at row end. Wrong order → N-well discontinuity → latch-up DRC. Filler with decap capability goes near power hotspots. Filler density target 0.95–0.98 to avoid gaps the router cannot use. verify_filler post-place is an automated check — do not skip."
    ),
  ],
  cts: [
    loc(
      "Clock stop e test mode: in scan_shift il clock può essere stopped per chain load/unload. set_clock_gating_check e set_case_analysis devono modellare stop correttamente. Un clock stop non modellato causa hold violation fittizi o miss di hold reali. OCC (On-Chip Clock) per at-speed: il clock root OCC ha stesso trattamento del PLL output — NDR, exclusion, max transition.",
      "Clock stop and test mode: in scan_shift the clock may be stopped for chain load/unload. set_clock_gating_check and set_case_analysis must model stop correctly. Unmodeled clock stop causes fictitious hold violations or misses real holds. OCC for at-speed: the OCC clock root gets the same treatment as PLL output — NDR, exclusion, max transition."
    ),
    loc(
      "CDC su clock gated: un segnale che attraversa ICG e poi CDC richiede synchronizer dopo l'ICG, non prima. L'enable ICG deve essere stable prima del clock edge. SpyGlass CDC-12 verifica. Il PD vede glitch su enable come min pulse width violation post-CTS. Fix: latch enable sync, non false path sul crossing.",
      "CDC on gated clock: a signal crossing ICG then CDC needs a synchronizer after the ICG, not before. ICG enable must be stable before the clock edge. SpyGlass CDC-12 checks this. PD sees enable glitch as post-CTS min pulse width violation. Fix: sync latch on enable, not false path on the crossing."
    ),
    loc(
      "Latency target per clock domain: CPU core 1.2 GHz → max insertion delay 400 ps, skew ±15 ps. Periphery 200 MHz → latency 2 ns accettabile, skew ±100 ps. set_clock_latency -source e -network guidano CTS. Un target latency troppo stretto su periphery spreca buffer e power. Il senior alloca budget latency per domain nel CTS spec document.",
      "Latency target per clock domain: CPU core 1.2 GHz → max insertion delay 400 ps, skew ±15 ps. Periphery 200 MHz → 2 ns latency acceptable, skew ±100 ps. set_clock_latency -source and -network guide CTS. A latency target too tight on periphery wastes buffers and power. Seniors allocate latency budget per domain in the CTS spec document."
    ),
    loc(
      "Cross-die clock (chiplet): il clock entra via microbump da interposer o da die adiacente. Skew budget include bump delay (5–20 ps) e RDL interposer (10–50 ps). CTS su ogni die è indipendente; sync tra die è system-level (PTP, async FIFO). Il PD del die logic coordina con il PD interposer — un clock root sbagliato è respin system.",
      "Cross-die clock (chiplet): clock enters via microbump from interposer or adjacent die. Skew budget includes bump delay (5–20 ps) and interposer RDL (10–50 ps). CTS on each die is independent; die-to-die sync is system-level (PTP, async FIFO). Logic-die PD coordinates with interposer PD — a wrong clock root is a system respin."
    ),
  ],
  routing: [
    loc(
      "NDR signal routing: net critici (clock enable, reset sync) su double width + double spacing. Costo: 2× track consumption. set_routing_rule in Innovus/ICC2. NDR senza shield è spacing-only — meno efficace di side-shield VSS. Usare NDR su <5% delle net — oltre si esaurisce capacity. Un bus DDR senza NDR o shield è SI failure al signoff.",
      "NDR signal routing: critical nets (clock enable, reset sync) on double width + double spacing. Cost: 2× track consumption. set_routing_rule in Innovus/ICC2. NDR without shield is spacing-only — less effective than VSS side-shield. Use NDR on <5% of nets — beyond that capacity is exhausted. A DDR bus without NDR or shield is SI failure at signoff."
    ),
    loc(
      "Track assignment e preferred direction: M2 horizontal, M3 vertical (esempio PDK). Un net che attraversa 6 layer contro preferred paga 30–50% wire delay extra. Layer promotion: spostare net da M2 a M4 salta congestione M2–M3. set_preferred_routing_layer per critical net. Il global router rispetta preferred; il detailed può deviare con penalty.",
      "Track assignment and preferred direction: M2 horizontal, M3 vertical (example PDK). A net crossing 6 layers against preferred pays 30–50% extra wire delay. Layer promotion: move net from M2 to M4 skips M2–M3 congestion. set_preferred_routing_layer for critical nets. Global router honors preferred; detailed may deviate with penalty."
    ),
    loc(
      "Detour budget: il router può allungare un net del 20–50% vs manhattan per evitare congestione. Oltre il budget, il path diventa critical. set_route_mode -droute_auto_stop false per forzare completion — rischio DRC. Un detour del 80% su path setup-critical è fail di floorplan/placement, non di routing effort. Tornare a spread macro prima di detour estremi.",
      "Detour budget: the router may lengthen a net 20–50% vs Manhattan to avoid congestion. Beyond budget, the path becomes critical. set_route_mode -droute_auto_stop false forces completion — DRC risk. An 80% detour on a setup-critical path is floorplan/placement fail, not routing effort. Go back to spread macros before extreme detours."
    ),
    loc(
      "Crosstalk repair iteration: post-route SI analysis identifica aggressor-victim pairs. Fix: spacing (+0.5× pitch), shield, layer change, size down aggressor. Iterazione 3–5 cicli fino a delta delay < 10% del logic delay su tutti i path. PrimeTime SI con SPEF aggiornato. Un path con 50 ps SI su 120 ps logic: fix SI prima di VT-swap — altrimenti si spreca area.",
      "Crosstalk repair iteration: post-route SI analysis identifies aggressor-victim pairs. Fix: spacing (+0.5× pitch), shield, layer change, size down aggressor. Iterate 3–5 cycles until delta delay < 10% of logic delay on all paths. PrimeTime SI with updated SPEF. A path with 50 ps SI on 120 ps logic: fix SI before VT-swap — otherwise area is wasted."
    ),
  ],
  layout: [
    loc(
      "Chip assembly e reticle placement: die + scribe + seal in reticle field. Multi-die per reticle (MPW) riduce costo mask. Keepout tra die: 100–200 µm scribe. Alignment mark per litho. Un die troppo grande per un field richiede stitch o reticle più grande — costo mask +30–50%. Il layout engineer posiziona il die nel reticle con il foundry.",
      "Chip assembly and reticle placement: die + scribe + seal in reticle field. Multi-die per reticle (MPW) cuts mask cost. Keepout between dice: 100–200 µm scribe. Alignment marks for litho. A die too large for one field needs stitch or larger reticle — mask cost +30–50%. Layout engineer places the die in the reticle with the foundry."
    ),
    loc(
      "IP versioning nel GDS merge: ogni IP ha version hash (es. SRAM_v2.3.1). Merge script verifica hash prima di flatten. Un IP sbagliato nel merge è LVS CORRECT su netlist sbagliato — funzione errata in silicon. Change log obbligatorio per ogni IP update. Il tapeout package include IP manifest con version e checksum.",
      "IP versioning in GDS merge: each IP has a version hash (e.g. SRAM_v2.3.1). Merge script verifies hash before flatten. Wrong IP in merge is LVS CORRECT on wrong netlist — wrong function in silicon. Change log mandatory for every IP update. Tapeout package includes IP manifest with version and checksum."
    ),
    loc(
      "OPC margin e litho hotspot: il foundry applica OPC (Optical Proximity Correction) in fab — il designer evita pattern proibiti (pitch < min, jog stretti). Litho hotspot tool (Calibre LFD, Tachyon) predice fail yield. Fix: jog, line-end extension, sraf. Un hotspot non fixato è yield loss — non DRC fail. Il PV team itera con il foundry prima del tapeout.",
      "OPC margin and litho hotspot: the foundry applies OPC in fab — the designer avoids forbidden patterns (pitch < min, tight jogs). Litho hotspot tools (Calibre LFD, Tachyon) predict yield fails. Fix: jog, line-end extension, SRAF. An unfixed hotspot is yield loss — not a DRC fail. PV iterates with the foundry before tapeout."
    ),
    loc(
      "ECO spare cell strategy: pre-place 50–200 spare NAND/NOR/INV in regioni sparse. Metal-only ECO riusa spare — no new cell placement. Spare troppo lontana dal fix target aggiunge 100+ ps wire. Posizionare spare vicino a blocchi con alta probabilità ECO (control FSM, error handling). Documentare spare map nel ECO guide.",
      "ECO spare-cell strategy: pre-place 50–200 spare NAND/NOR/INV in sparse regions. Metal-only ECO reuses spares — no new cell placement. Spare too far from fix target adds 100+ ps wire. Place spares near blocks with high ECO probability (control FSM, error handling). Document spare map in the ECO guide."
    ),
  ],
  sta: [
    loc(
      "Path group prioritization: reg2reg, in2reg, reg2out, in2out — ogni gruppo ha budget diverso. set_path_group -weight 10 su reg2reg per priorità. Un path in2out con 2 ns di budget esterno non compete con reg2reg a 500 ps. Il senior alloca weight per gruppo nel SDC — non default uniforme. report_path_group mostra WNS per gruppo.",
      "Path-group prioritization: reg2reg, in2reg, reg2out, inout — each group has a different budget. set_path_group -weight 10 on reg2reg for priority. An in2out path with 2 ns external budget does not compete with 500 ps reg2reg. Seniors allocate weight per group in SDC — not uniform default. report_path_group shows WNS per group."
    ),
    loc(
      "Case analysis per test mode: set_case_analysis 0 su scan_enable durante func mode — il path scan è disabled. set_case_analysis 1 su test_mode durante scan — solo path scan attivi. Un case analysis sbagliato ottimizza il path sbagliato. MMMC: ogni mode ha il proprio case analysis set. Verificare con report_case_analysis prima del signoff.",
      "Case analysis for test mode: set_case_analysis 0 on scan_enable during func mode — scan path disabled. set_case_analysis 1 on test_mode during scan — only scan paths active. Wrong case analysis optimizes the wrong path. MMMC: each mode has its own case analysis set. Verify with report_case_analysis before signoff."
    ),
    loc(
      "CRPR/CPPR settings: set_timing_derate -cell_check -early 0.95 -late 1.05 con CPPR enabled. Foundry guideline specifica quando usare CPPR — abusivo ottimizza WNS di 30–50 ps falsi. report_crpr mostra credit per path. Un path con 80 ps CRPR credit e 20 ps slack è marginalmente reale — verificare con SI e OCV.",
      "CRPR/CPPR settings: set_timing_derate -cell_check -early 0.95 -late 1.05 with CPPR enabled. Foundry guidelines specify when to use CPPR — abusive use optimizes WNS by 30–50 ps falsely. report_crpr shows credit per path. A path with 80 ps CRPR credit and 20 ps slack is marginally real — verify with SI and OCV."
    ),
    loc(
      "SI glitch analysis: set_si_enable_analysis true per glitch su net a tre stati e bus. Glitch width > 50% del clock period può causare double capture. Fix in PD: spacing, shield, reduce aggressor slew. Diverso da delta delay — glitch è evento transiente. PrimeTime SI glitch report per signoff su design ad alta frequenza.",
      "SI glitch analysis: set_si_enable_analysis true for glitch on tri-state nets and buses. Glitch width > 50% of clock period can cause double capture. Fix in PD: spacing, shield, reduce aggressor slew. Different from delta delay — glitch is a transient event. PrimeTime SI glitch report for signoff on high-frequency designs."
    ),
  ],
  pv: [
    loc(
      "ERC (Electrical Rule Check): short power-ground, floating gate, min width su gate poly, antenna su gate senza protezione. ERC passa prima di LVS — un short PG può passare DRC ma fallire ERC. Calibre ERC deck separato da DRC. Un via PG che shorta VDD a VSS è CORRECT in LVS se il netlist ha il bug — ERC lo cattura.",
      "ERC (Electrical Rule Check): power-ground short, floating gate, min width on gate poly, antenna on unprotected gate. ERC runs before LVS — a PG short may pass DRC but fail ERC. Calibre ERC deck separate from DRC. A PG via shorting VDD to VSS is LVS CORRECT if the netlist has the bug — ERC catches it."
    ),
    loc(
      "Density gradient: ρ non deve variare > 20% tra finestre adiacenti — CMP dishing/erosion. Fill e slotting bilanciano. Calibre density window check. Un hotspot ρ > 90% locale causa dishing — wire thinning e R increase. Il PV itera fill fino a gradient clean. Foundry può richiedere CMP simulation come gate aggiuntivo.",
      "Density gradient: ρ must not vary > 20% between adjacent windows — CMP dishing/erosion. Fill and slotting balance. Calibre density window check. A local hotspot ρ > 90% causes dishing — wire thinning and R increase. PV iterates fill until gradient is clean. Foundry may require CMP simulation as an extra gate."
    ),
    loc(
      "Via enclosure e landing pad: M2 via richiede enclosure M1 ≥ 0.05 µm (esempio 7 nm). Landing pad su wide metal — via non centrata fallisce enclosure. Via array su strap: pitch min 0.1 µm. Un via singolo su strap 2 µm wide è EM fail — array obbligatorio. DRC M1.EN.1, V1.EN.1 — ID specifici per PDK.",
      "Via enclosure and landing pad: M2 via requires M1 enclosure ≥ 0.05 µm (example 7 nm). Landing pad on wide metal — off-center via fails enclosure. Via array on strap: min pitch 0.1 µm. A single via on 2 µm strap is EM fail — array mandatory. DRC M1.EN.1, V1.EN.1 — PDK-specific IDs."
    ),
    loc(
      "Litho hotspot repair workflow: LFD/Tachyon report → classify (line-end, space, pitch) → apply fix (jog, extension, sraf) → re-run. 3–10 iterazioni tipiche. Un hotspot «waived» senza foundry approval è yield risk. Il tapeout package include hotspot waiver list con area limitata e giustificazione.",
      "Litho hotspot repair workflow: LFD/Tachyon report → classify (line-end, space, pitch) → apply fix (jog, extension, SRAF) → re-run. 3–10 iterations typical. A «waived» hotspot without foundry approval is yield risk. Tapeout package includes hotspot waiver list with limited area and justification."
    ),
  ],
  power: [
    loc(
      "Thermal coupling die-package: junction Tj = Ta + P × Rth. Rth junction-to-ambient dipende da package (flip-chip 5–15 °C/W, wire-bond 20–40 °C/W). Hotspot CPU 15 W in 4 mm² → Tj +30 °C locale. Leakage scala con T — positive feedback. RedHawk thermal + package thermal model. Il PD posiziona hotspot sotto bump per heat spreading.",
      "Die-package thermal coupling: junction Tj = Ta + P × Rth. Rth junction-to-ambient depends on package (flip-chip 5–15 °C/W, wire-bond 20–40 °C/W). CPU hotspot 15 W in 4 mm² → Tj +30 °C locally. Leakage scales with T — positive feedback. RedHawk thermal + package thermal model. PD places hotspots under bumps for heat spreading."
    ),
    loc(
      "State-dependent power: sleep mode 50 mW, idle 500 mW, active 8 W — tre VCD diversi per IR/EM. Un solo vector «typical» non copre wake-up surge (di/dt 10× idle). Simulare ogni power state con activity da UPF power state table. Il PD esige VCD per ogni state in UPF prima del power signoff.",
      "State-dependent power: sleep 50 mW, idle 500 mW, active 8 W — three different VCDs for IR/EM. One «typical» vector does not cover wake-up surge (di/dt 10× idle). Simulate every power state with activity from the UPF power-state table. PD demands VCD for every UPF state before power signoff."
    ),
    loc(
      "Leakage corner: SS@125°C @ high V — leakage max. FF@-40°C @ low V — leakage min ma timing fast. Power signoff include leakage budget per domain. Un dominio AON con 200 mW leakage a 125°C viola battery life spec. RBB o power gating per ridurre. Il PD coordina con FE per retention vs power-off trade-off.",
      "Leakage corner: SS@125°C @ high V — max leakage. FF@-40°C @ low V — min leakage but fast timing. Power signoff includes leakage budget per domain. An AON domain with 200 mW leakage at 125°C violates battery life spec. RBB or power gating to cut it. PD coordinates with FE on retention vs power-off trade-off."
    ),
    loc(
      "Grid analysis (RedHawk): current density map su mesh — hotspot > J_max. Fix: widen strap, add via, move bump. Package grid analysis: bump current imbalance. Un bump che porta 80% della corrente del dominio è fail — redistribuire bump map. Co-sim die+package obbligatorio per design > 5 W.",
      "Grid analysis (RedHawk): current-density map on mesh — hotspot > J_max. Fix: widen strap, add vias, move bump. Package grid analysis: bump current imbalance. A bump carrying 80% of domain current fails — redistribute bump map. Die+package co-sim mandatory for designs > 5 W."
    ),
  ],
  package: [
    loc(
      "Thermal path package: die → bump → RDL → substrate → lid → heatsink. Rth ogni segmento nel modello. Flip-chip: bump pitch 80–150 µm, underfill per stress. Wire-bond: loop height, bond pad su perimetro. Un package senza thermal vias sotto hotspot CPU è Tj violation — co-design con mechanical.",
      "Package thermal path: die → bump → RDL → substrate → lid → heatsink. Rth for each segment in the model. Flip-chip: 80–150 µm bump pitch, underfill for stress. Wire-bond: loop height, bond pads on perimeter. A package without thermal vias under CPU hotspot is Tj violation — co-design with mechanical."
    ),
    loc(
      "CTE warpage: silicon 2.6 ppm/°C, substrate 17 ppm/°C, mold compound 25 ppm/°C. Mismatch → warpage → bump crack. Underfill modulus e CTE matching. Package DRC: max warpage 50 µm. Il PD considera keepout sotto bump stress-critical. Un die 10×10 mm senza underfill optimization è reliability risk.",
      "CTE warpage: silicon 2.6 ppm/°C, substrate 17 ppm/°C, mold compound 25 ppm/°C. Mismatch → warpage → bump crack. Underfill modulus and CTE matching. Package DRC: max warpage 50 µm. PD considers keepout under stress-critical bumps. A 10×10 mm die without underfill optimization is a reliability risk."
    ),
    loc(
      "Substrate routing (RDL + package): segnali da die bump a BGA ball. Layer AP, RDL1, RDL2. Impedance control 50 Ω single-ended, 100 Ω diff. Via stub su high-speed → reflection. IBIS/SPICE per eye diagram. Il PD floorplan allinea PHY pin con bump — RDL lunga degrada eye.",
      "Substrate routing (RDL + package): signals from die bump to BGA ball. AP, RDL1, RDL2 layers. Impedance control 50 Ω single-ended, 100 Ω differential. Via stub on high-speed → reflection. IBIS/SPICE for eye diagram. PD floorplan aligns PHY pins with bumps — long RDL degrades eye."
    ),
    loc(
      "Signal integrity at package: crosstalk RDL, SSO su bus paralleli, return path discontinuity. S-parameter model package per SerDes 56 Gbps+. Il die PD fornisce bump map e drive strength; il package team simula. Un fix package (stagger, shield) può richiedere bump map change — respin se frozen.",
      "Signal integrity at package: RDL crosstalk, SSO on parallel buses, return-path discontinuity. Package S-parameter model for SerDes 56 Gbps+. Die PD provides bump map and drive strength; package team simulates. A package fix (stagger, shield) may require bump map change — respin if frozen."
    ),
  ],
  tapeout: [
    loc(
      "Mask merge e job deck: GDS layer map → mask layer assignment. RET (Resolution Enhancement Technology) handled fab-side. Job deck: dose, focus, overlay spec. PDK version locked — un cambio mid-tapeout invalida tutto. Mask cost 7 nm: $2–5M, lead time 12–16 settimane. Il tapeout manager coordina con foundry AE.",
      "Mask merge and job deck: GDS layer map → mask layer assignment. RET handled fab-side. Job deck: dose, focus, overlay spec. PDK version locked — mid-tapeout change invalidates everything. 7 nm mask cost: $2–5M, lead time 12–16 weeks. Tapeout manager coordinates with foundry AE."
    ),
    loc(
      "PCM (Process Control Monitor) e kerf: strutture test in scribe line per correlazione fab. WAT (Wafer Acceptance Test) su PCM prima di die test. Il design team riceve PCM correlation report post-fab. Un drift process oltre spec è hold wafer — non ship. Il tapeout include PCM spec nel data package.",
      "PCM and kerf: test structures in scribe line for fab correlation. WAT on PCM before die test. Design team receives PCM correlation report post-fab. Process drift beyond spec is hold wafer — do not ship. Tapeout includes PCM spec in the data package."
    ),
    loc(
      "Yield ramp e first silicon: engineering wafer 25–50 die, bring-up 2–4 settimane. Scan pass, MBIST pass, OS boot. Un fail sistematico (es. tutti i die fail su stesso path) è design bug — respin. Fail random è yield — process fix. Post-mortem obbligatorio: root cause, fix, prevention. Il PD partecipa al bring-up debug.",
      "Yield ramp and first silicon: engineering wafer 25–50 dice, bring-up 2–4 weeks. Scan pass, MBIST pass, OS boot. A systematic fail (e.g. all dice fail on same path) is design bug — respin. Random fail is yield — process fix. Mandatory post-mortem: root cause, fix, prevention. PD joins bring-up debug."
    ),
    loc(
      "Documentation archive: ogni disciplina allega log tool datato, version, command script. GKC package: STA (60 corner), PV (DRC/LVS count), DFT (coverage), LP (CLP), PKG (SSO). Un veto = no tapeout. Archive su server con retention 10 anni — audit foundry e legal. Il senior sa dove trovare il report WNS del corner peggiore.",
      "Documentation archive: each discipline attaches dated tool log, version, command script. GKC package: STA (60 corners), PV (DRC/LVS count), DFT (coverage), LP (CLP), PKG (SSO). One veto = no tapeout. Archive on server with 10-year retention — foundry and legal audit. A senior knows where to find the worst-corner WNS report."
    ),
  ],
};
