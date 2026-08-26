import { loc, type Localized } from "@/i18n/context";
import type { StageId } from "./stages";

/** Additional long-form essay paragraphs merged after stageEssays in each StageSection. */
export const stageEssayExtras: Record<StageId, Localized[]> = {
  rtl: [
    loc(
      "Il colloquio senior chiede spesso: «quanti FO4 hai nel critical path a RTL?» FO4 = delay di un inverter che guida quattro FO4-equivalent loads. A 7 nm SS@0.75 V, t_FO4 ≈ 10–14 ps. A 1.2 GHz (Tclk = 833 ps), dopo overhead clock (~150–200 ps) restano ~50–55 FO4 di logica per ciclo. Un moltiplicatore 64×64 non entra: si pipeline o si abbassa f. Il PD non può comprimere 80 FO4 in 50 con il placer — è matematica, non effort.",
      "Senior interviews often ask: «how many FO4 in the RTL critical path?» FO4 = delay of an inverter driving four FO4-equivalent loads. At 7 nm SS@0.75 V, t_FO4 ≈ 10–14 ps. At 1.2 GHz (Tclk = 833 ps), after clock overhead (~150–200 ps) ~50–55 FO4 of logic remain per cycle. A 64×64 multiplier does not fit: pipeline or lower f. PD cannot squeeze 80 FO4 into 50 with the placer — that is math, not effort."
    ),
    loc(
      "UPF a RTL non è un commento: isolation (ISO), level shifter (LS), retention, power switch enable sequence. Ogni crossing tra domini deve avere la cella giusta nel netlist PRIMA del floorplan. CLP (Conformal Low Power) verifica corrispondenza UPF↔netlist. Se il PD inserisce LS «a mano» in Innovus, LEC e UPF divergono e il GKC LP veta. Retention: la SRAM ha la sua cella retention; la logica ha retention FF — non sono intercambiabili.",
      "UPF at RTL is not a comment: isolation (ISO), level shifter (LS), retention, power-switch enable sequence. Every domain crossing must have the right cell in the netlist BEFORE floorplan. CLP verifies UPF↔netlist correspondence. If PD hand-inserts LS in Innovus, LEC and UPF diverge and GKC LP vetoes. Retention: SRAM has its retention cell; logic has retention FFs — they are not interchangeable."
    ),
    loc(
      "Coding guidelines industriali (ARM, Synopsys, internal): default in always_comb, no latch; un solo clock per always_ff salvo eccezioni documentate; reset sync-deassert (async assert, sync release); parametri per width; niente #delay in codice sintetizzabile. W415a (latch) e W362 (multi-driven) sono i classici. Un senior legge il lint report come il timing report: non è burocrazia, è prevenzione di silicon debug a $2M.",
      "Industrial coding guidelines (ARM, Synopsys, internal): defaults in always_comb, no latches; one clock per always_ff unless documented; sync-deassert reset (async assert, sync release); parameters for width; no #delay in synthesizable code. W415a (latch) and W362 (multi-driven) are classics. A senior reads the lint report like the timing report: not bureaucracy — prevention of $2M silicon debug."
    ),
    loc(
      "Partitioning gerarchico: ogni blocco ha un owner PD in design grandi. I confini gerarchici diventano confini fisici (fence, region, voltage island). Un'interfaccia AXI da 512 bit tra due blocchi lontani è un disastro di routing: si negozia il floorplan a RTL, non dopo place. Black box e abstract LEF per IP incompleti: il timing sui pin del black box è un contratto — se mente, il chip non chiude.",
      "Hierarchical partitioning: each block has a PD owner on large designs. Hierarchy boundaries become physical boundaries (fence, region, voltage island). A 512-bit AXI between distant blocks is a routing disaster: negotiate floorplan at RTL, not after place. Black boxes and abstract LEF for incomplete IP: timing on black-box pins is a contract — if it lies, the chip will not close."
    ),
    loc(
      "Clock gating a RTL: ICG (Integrated Clock Gating) con enable latched — non AND sul clock. SpyGlass/VC ha check dedicati. Enable asincrono → glitch → pulse corto → doppio clock edge → silicon irreproducibile. STA ha clock-gating setup/hold check sull'ICG. Power saving reale: 30–70% su blocchi idle, ma ogni ICG è un punto di timing e di test (scan controlla il clock).",
      "Clock gating at RTL: ICG with latched enable — not AND on the clock. SpyGlass/VC has dedicated checks. Async enable → glitch → short pulse → double clock edge → irreproducible silicon. STA has clock-gating setup/hold checks on the ICG. Real power savings: 30–70% on idle blocks, but every ICG is a timing and test point (scan must control the clock)."
    ),
    loc(
      "Handoff checklist RTL→synth che il PD deve rifiutare se manca: SDC con create_clock/create_generated_clock coerenti, set_case_analysis per test mode, UPF/CPF, CDC report firmato, scan/MBIST netlist o piano DFT, memory wrapper list, pad/bump preliminary map, FO4 budget per macro-block, elenco false/multicycle path con owner architetturale. «RTL freeze» senza questi artefatti è un freeze di nome.",
      "RTL→synth handoff checklist PD must reject if missing: SDC with coherent create_clock/create_generated_clock, set_case_analysis for test modes, UPF/CPF, signed CDC report, scan/MBIST netlist or DFT plan, memory wrapper list, preliminary pad/bump map, FO4 budget per macro-block, false/multicycle path list with architectural owner. «RTL freeze» without these artifacts is a freeze in name only."
    ),
  ],
  verification: [
    loc(
      "Coverage non è vanity: functional coverage (covergroup) + code coverage (line/branch/FSM/toggle/assertion). Target tipico produzione: ≥95% functional bins, 100% code su RTL signoff (con waiver documentati). Un buco in coverage è un buco in silicon confidence. Il PD non fa sim, ma deve esigere che i mode STA (scan, retention, low-power) abbiano vettori VCD rappresentativi — altrimenti IR e power signoff mentono.",
      "Coverage is not vanity: functional coverage (covergroups) + code coverage (line/branch/FSM/toggle/assertion). Typical production target: ≥95% functional bins, 100% code at RTL signoff (documented waivers). A coverage hole is a silicon-confidence hole. PD does not run sim, but must demand that STA modes (scan, retention, low-power) have representative VCD vectors — otherwise IR and power signoff lie."
    ),
    loc(
      "SVA (SystemVerilog Assertions): assert per proprietà che devono essere vere sempre; assume per restringere l'input space del formal. Un assert in sim è un check runtime; in formal è una prova. Esempi da colloquio: req/ack non si alza senza grant; pointer Gray monotono; FIFO non overflow/underflow. Il PD beneficia: se il formal prova handshake, meno false path «creativi» in STA.",
      "SVA: assert for properties that must always hold; assume to constrain formal input space. An assert in sim is a runtime check; in formal it is a proof. Interview examples: req/ack does not rise without grant; Gray pointer monotonic; FIFO no overflow/underflow. PD benefits: if formal proves handshake, fewer «creative» false paths in STA."
    ),
    loc(
      "Equivalence checking: RTL↔gate (post-synth), gate↔gate (post-ECO), RTL↔RTL (refactor). Un mismatch post-ECO metal-only di solito è: spare non modellata, pin invertito, constant tie sbagliato, hierarchical boundary cambiata. Il PD firma il netlist finale — LEC sul golden ECO è obbligatorio prima del GKC. «Solo metal» non significa «solo funzione invariata» se hai riwirato un NAND spare.",
      "Equivalence checking: RTL↔gate (post-synth), gate↔gate (post-ECO), RTL↔RTL (refactor). A post-ECO metal-only mismatch is usually: unmodeled spare, inverted pin, wrong constant tie, changed hierarchical boundary. PD signs the final netlist — LEC on the ECO golden is mandatory before GKC. «Metal only» does not mean «function unchanged» if you rewired a spare NAND."
    ),
    loc(
      "RDC e reset sequencing: power-on reset (POR) → PLL lock → clock release → deassert sync reset per dominio. Un dominio che esce da reset prima che il PLL sia locked campiona X. UPF describe_state_transition controlla le sequenze. Il PD vede questo come glitch su clock/reset tree e come path di scan che partono in stati illegali.",
      "RDC and reset sequencing: POR → PLL lock → clock release → per-domain sync reset deassert. A domain leaving reset before PLL lock samples X. UPF describe_state_transition controls sequences. PD sees this as clock/reset-tree glitches and scan paths starting in illegal states."
    ),
    loc(
      "Gate-level sim con SDF (annotated delay): più lenta del RTL ma cattura race che il formal bounded non vede. Usata per signoff su IP critici e post-layout su path marginali. Il PD chiede SDF corner allineati a MMMC. Una sim che passa solo a TT mentre STA falla a SS è inutile.",
      "Gate-level sim with SDF: slower than RTL but catches races bounded formal may miss. Used for signoff on critical IP and post-layout on marginal paths. PD demands SDF corners aligned with MMMC. A sim that passes only at TT while STA fails at SS is useless."
    ),
    loc(
      "Al colloquio: distingui verification intent (cosa vogliamo provare) da verification means (sim/formal/emulation). Emulation (ZeBu, Palladium) scala a boot OS ma costa setup. Per PD l'output utile è: netlist golden, SDC golden, UPF golden, coverage closure report, CDC/RDC clean, DFT netlist. Tutto il resto è supporto al «perché fidarsi di questo RTL».",
      "In interview: distinguish verification intent (what we want to prove) from means (sim/formal/emulation). Emulation scales to OS boot but costs setup. For PD the useful outputs are: golden netlist, golden SDC, golden UPF, coverage closure, CDC/RDC clean, DFT netlist. Everything else supports «why we trust this RTL»."
    ),
  ],
  synthesis: [
    loc(
      "Mapping e optimization: technology mapping sceglie celle dalla .lib; timing optimization fa sizing (X1→X4), VT swap (HVT→LVT), buffering, logic restructuring. compile_ultra / genus -effort high itera WNS/TNS vs area/power. Un vincolo di area stretto che forza HVT ovunque esplode il timing post-route — il trade-off si negozia a synth, non con false path.",
      "Mapping and optimization: technology mapping picks cells from .lib; timing optimization does sizing (X1→X4), VT swap (HVT→LVT), buffering, logic restructuring. compile_ultra / genus -effort high iterates WNS/TNS vs area/power. A tight area constraint forcing HVT everywhere explodes post-route timing — negotiate the trade-off at synth, not with false paths."
    ),
    loc(
      "Liberty .lib: ogni cella ha tabelle delay/slew vs input_slew × output_cap (NLDM) o correnti (CCS). Corner SS/TT/FF × voltage × temperature. A 7 nm si usano LVF/POCV per σ. Caratterizzazione fuori range (max_tran violato) = estrapolazione = bug silenzioso. Il synth report «WNS +50 ps» con 2000 max_tran violation è falso.",
      "Liberty .lib: each cell has delay/slew tables vs input_slew × output_cap (NLDM) or currents (CCS). SS/TT/FF × voltage × temperature corners. At 7 nm use LVF/POCV for σ. Out-of-range characterization (max_tran violated) = extrapolation = silent bug. A synth report «WNS +50 ps» with 2000 max_tran violations is false."
    ),
    loc(
      "Dont_touch e size_only: dont_touch su macro/IP/hand-instantiated; size_only permette upsize ma non restructure. Il PD eredita dont_touch dal FE — rispettarli in opt. Un dont_touch su un buffer del critical path significa «fix con route/skew, non con sizing».",
      "Dont_touch and size_only: dont_touch on macros/IP/hand-instantiated; size_only allows upsize but not restructure. PD inherits dont_touch from FE — honor them in opt. dont_touch on a critical-path buffer means «fix with route/skew, not sizing»."
    ),
    loc(
      "DFT insertion in synth: scan chain ordering influenza hold post-CTS (vicini fisici dopo place). Compression EDT riduce pin ATE ma aggiunge logic. OCC per at-speed deve essere nel netlist prima di CTS. Il PD non «aggiunge» scan — riceve un netlist scan-ready e chiude timing per mode scan.",
      "DFT insertion in synth: scan chain ordering influences post-CTS hold (physical neighbors after place). EDT compression cuts ATE pins but adds logic. OCC for at-speed must be in the netlist before CTS. PD does not «add» scan — it receives a scan-ready netlist and closes timing for scan modes."
    ),
    loc(
      "Physical guidance (optional): synthesis può leggere wire load o physical constraints preliminari. Innovus/ICC2 «physical aware synthesis» riduce surprise post-place. Anche senza PAS, il synth deve rispettare max_fanout/max_cap/max_tran SDC — sono contratti per il router.",
      "Physical guidance (optional): synthesis may read wire loads or preliminary physical constraints. Innovus/ICC2 «physical aware synthesis» reduces post-place surprise. Even without PAS, synth must respect max_fanout/max_cap/max_tran SDC — contracts for the router."
    ),
    loc(
      "Numerico da colloquio: se WNS = −80 ps e un BUF X2 aggiunge ~25 ps di delay utile sul path, servono 3–4 buffer o un VT-swap −15% delay. Se TNS = −80 ns e WNS = −5 ps, servono migliaia di fix — torna a architettura/constraint/fanout, non al path 1.",
      "Interview numbers: if WNS = −80 ps and a BUF X2 adds ~25 ps useful delay on the path, you need 3–4 buffers or a −15% delay VT swap. If TNS = −80 ns and WNS = −5 ps, you need thousands of fixes — go back to architecture/constraints/fanout, not path 1."
    ),
  ],
  floorplan: [
    loc(
      "Die planning numerico: A_core = (A_std + A_macro) / U_target. Esempio: 1.8 mm² std + 2.4 mm² macro, U = 70% → A_core = 6.0 mm² → lato ≈ 2.45 mm. Die = core + 2×(IO ring + seal), tipicamente +0.3–0.5 mm per lato. Foundry quota il die; il PD parla core utilization. Confondere le due al colloquio è un fail immediato.",
      "Die planning math: A_core = (A_std + A_macro) / U_target. Example: 1.8 mm² std + 2.4 mm² macro, U = 70% → A_core = 6.0 mm² → side ≈ 2.45 mm. Die = core + 2×(IO ring + seal), typically +0.3–0.5 mm per side. Foundry quotes die; PD talks core utilization. Confusing them in interview is an instant fail."
    ),
    loc(
      "IO ring e pin placement: pad order segue package/bump map, non comodità del router. Per flip-chip, i bump sono una griglia area — il pin del macro SERDES deve guardare il bump PHY, non il centro del die. Flyline review: ogni arco lungo > 1 mm a 7 nm è centinaia di ps di wire — pipeline o avvicinamento macro.",
      "IO ring and pin placement: pad order follows package/bump map, not router convenience. For flip-chip, bumps are an area grid — SERDES macro pins must face the PHY bump, not the die center. Flyline review: every arc > 1 mm at 7 nm is hundreds of ps of wire — pipeline or move macros closer."
    ),
    loc(
      "Blockage: hard (zero celle), soft (preferenza), partial (solo buffer/inverter in halo macro). Halo 2–5 µm attorno a SRAM/analog evita DRC macro ma non deve strangolare i canali. Un muro di logica attorno a una macro con pin verso il muro è congestion garantita. Partial blockage è il compromesso da senior.",
      "Blockage: hard (zero cells), soft (preference), partial (buffers/inverters only in macro halo). 2–5 µm halo around SRAM/analog avoids macro DRC but must not strangle channels. A logic wall around a macro with pins facing the wall is guaranteed congestion. Partial blockage is the senior compromise."
    ),
    loc(
      "Multi-voltage floorplan: ogni power domain = region fisica. Power switch columns ai confini AON↔SW. Level shifter strip tra domini — non sparse random. Retention island con always-on buffer e SRAM retention bank. CLP verifica che ogni crossing abbia ISO+LS nel layout corrispondente all'UPF.",
      "Multi-voltage floorplan: each power domain = physical region. Power-switch columns at AON↔SW boundaries. Level-shifter strips between domains — not randomly scattered. Retention island with always-on buffers and SRAM retention bank. CLP verifies every crossing has ISO+LS in layout matching UPF."
    ),
    loc(
      "Aspect ratio e routing channels: die ~quadrati semplificano mesh e CTS. Aspect 1:2 allunga un lato flyline e comprime l'altro. Canali tra macro: 3 µm è stretto a 7 nm con pin density alta; 5–8 µm è più sano. Il floorplan exit review include congestion map pre-place (WLM) — se è rosso, non firmare.",
      "Aspect ratio and routing channels: ~square dies simplify mesh and CTS. Aspect 1:2 lengthens one flyline side and compresses the other. Channels between macros: 3 µm is tight at 7 nm with high pin density; 5–8 µm is healthier. Floorplan exit review includes pre-place congestion map (WLM) — if red, do not sign."
    ),
    loc(
      "Abutment e hierarchical: due block abutted condividono un confine senza gap — utile per SoC ma complica power delivery e clock crossing. Fence/LVS macro: ogni sub-chip può avere un proprio GDS merge. Il top integra con seal continuo e fill uniforme. Al colloquio: «ho spostato la SRAM» è la risposta giusta al 70% dei problemi di congestion/timing pre-place.",
      "Abutment and hierarchy: two abutted blocks share a boundary without gap — useful for SoC but complicates power delivery and clock crossing. Fence/LVS macros: each sub-chip may have its own GDS merge. Top integrates with continuous seal and uniform fill. In interview: «I moved the SRAM» is the right answer to 70% of pre-place congestion/timing problems."
    ),
  ],
  pdn: [
    loc(
      "IR drop numerico: V_drop = I × R_path. Esempio: 800 mA × 36 mΩ = 28.8 mV su VDD = 0.75 V → 3.84%. Limite statico tipico 5%. Il percorso include bump, RDL, ring, mesh, via ladder, M1 rail. Ogni segmento ha un J_max EM — il via è spesso il collo. Double-via su strap non è opzionale su correnti > 0.5 A per cut.",
      "IR math: V_drop = I × R_path. Example: 800 mA × 36 mΩ = 28.8 mV on VDD = 0.75 V → 3.84%. Typical static limit 5%. Path includes bump, RDL, ring, mesh, via ladder, M1 rail. Each segment has J_max EM — the via is often the bottleneck. Double-via on straps is not optional above ~0.5 A per cut."
    ),
    loc(
      "Dynamic droop: ΔV ≈ L × di/dt + I × R. Un fronte di corrente di 2 A in 200 ps con L_pkg = 50 pH dà 0.5 V se non ci sono decap — catastrofico. On-die decap: MOSCAP + filler cap vicino all'hotspot. C ≥ I × Δt / ΔV. Troppa decap → inrush a power-on. WORST_dI/dt e WORST_POWER sono due VCD diversi.",
      "Dynamic droop: ΔV ≈ L × di/dt + I × R. A 2 A edge in 200 ps with L_pkg = 50 pH gives 0.5 V without decap — catastrophic. On-die decap: MOSCAP + filler cap near the hotspot. C ≥ I × Δt / ΔV. Too much decap → power-on inrush. WORST_dI/dt and WORST_POWER are two different VCDs."
    ),
    loc(
      "Mesh pitch e strap width: pitch 10–30 µm su M8/M9 a seconda del PDK e della corrente peak. Strap più larghi abbassano R ma competono con signal routing. Ring width sul perimetro alimenta il mesh — un ring sottile crea hotspot agli angoli. verify_pg_connection e check_strap_coverage sono check automatici, non occhio umano.",
      "Mesh pitch and strap width: 10–30 µm pitch on M8/M9 depending on PDK and peak current. Wider straps lower R but compete with signal routing. Perimeter ring width feeds the mesh — a thin ring creates corner hotspots. verify_pg_connection and check_strap_coverage are automated checks, not the human eye."
    ),
    loc(
      "Power gating inrush: accendere 50k header insieme è un picco di corrente di carica delle capacitanze di dominio. Fishbone/daisy-chain degli switch con staggered enable (UPF power state sequence). Il PD posiziona le colonne di switch ai confini — larghezza e pitch determinano R_on e area.",
      "Power-gating inrush: turning on 50k headers together is a surge charging domain capacitances. Fishbone/daisy-chain switches with staggered enable (UPF power-state sequence). PD places switch columns at boundaries — width and pitch set R_on and area."
    ),
    loc(
      "EM su PG: J = I / (W × t) su metal; J_via limit più stretto. Black MTTF = A × J^(−n) × exp(Ea/kT). 10 anni @ Tmax. Un via singolo su strap da 2 A è il classico fail. Signal EM sul clock è un secondo report — non confondere power EM verde con clock via rosso.",
      "PG EM: J = I / (W × t) on metal; tighter J_via limits. Black MTTF = A × J^(−n) × exp(Ea/kT). 10 years @ Tmax. A single via on a 2 A strap is a classic fail. Clock signal EM is a second report — do not confuse green power EM with red clock vias."
    ),
    loc(
      "Co-design con package: bump map detta dove entra la corrente. Flip-chip: area array. Wire-bond: edge feeds. Un hotspot IR al centro con bump solo sul perimetro è geometria, non «manca mesh». Il PD partecipa al bump planning meeting — non riceve il map a posto.",
      "Package co-design: bump map dictates where current enters. Flip-chip: area array. Wire-bond: edge feeds. A center IR hotspot with bumps only on the perimeter is geometry, not «need more mesh». PD joins the bump-planning meeting — does not receive the map after the fact."
    ),
  ],
  placement: [
    loc(
      "Density screen: target globale 0.7–0.8, locale su hotspot CPU/GPU può essere 0.55–0.65 per lasciare routing resource. Congestion map post-global-place: overflow > 3–5% è yellow/red. Timing-driven placement alza peso sui net con slack negativo — senza di esso HPWL minimo distende i critical path.",
      "Density screen: global target 0.7–0.8, local on CPU/GPU hotspots may be 0.55–0.65 to leave routing resource. Post-global-place congestion map: overflow > 3–5% is yellow/red. Timing-driven placement raises weight on negative-slack nets — without it, minimum HPWL stretches critical paths."
    ),
    loc(
      "Legalization displacement report: media < 2 µm è sano; code > 10 µm su cluster indicano regione sovraffollata. Un FF del critical path spostato di 15 µm può aggiungere 20–40 ps wire a 7 nm. Si rivede density/blockage prima di CTS, non si compensa solo con useful skew.",
      "Legalization displacement report: mean < 2 µm is healthy; tails > 10 µm on clusters indicate overcrowded regions. A critical-path FF moved 15 µm can add 20–40 ps wire at 7 nm. Revisit density/blockage before CTS, do not compensate only with useful skew."
    ),
    loc(
      "Scan chain reorder: il tool può riordinare per wirelength minima — rompe l'ordine ATPG ma migliora hold se i vicini fisici sono lontani nel chain. Trade-off DFT vs PD negoziato. Lock-up sui domain crossing indipendentemente dall'ordine.",
      "Scan chain reorder: the tool may reorder for minimum wirelength — breaks ATPG order but can improve hold if physical neighbors are far in the chain. DFT vs PD trade-off negotiated. Lock-ups on domain crossings regardless of order."
    ),
    loc(
      "Filler, tap, endcap: filler cell mantiene continuità N-well e row height; tap ogni 20–50 µm (DRM); endcap a fine row. Non confondere filler cell con metal fill — sono cose diverse. Tap mancante = latch-up risk = BTO DRC fail.",
      "Filler, tap, endcap: filler cells maintain N-well continuity and row height; tap every 20–50 µm (DRM); endcap at row end. Do not confuse filler cells with metal fill — different things. Missing tap = latch-up risk = BTO DRC fail."
    ),
    loc(
      "PRO exit numerico: pre-CTS WNS ≥ −0.1 ns (o budget progetto), congestion < 5% overflow, scan chain integra, PG connected. Non è signoff — è permesso di entrare in CTS. Firmare PRO con WNS −0.5 ns «lo sistema CTS» è come firmare floorplan con flyline da 3 mm.",
      "PRO exit numbers: pre-CTS WNS ≥ −0.1 ns (or project budget), congestion < 5% overflow, scan chains intact, PG connected. Not signoff — permission to enter CTS. Signing PRO at WNS −0.5 ns «CTS will fix it» is like signing a floorplan with 3 mm flylines."
    ),
    loc(
      "Macro placement interaction: std cell placement riempie i canali — se il canale è 3 µm e la macro ha 200 pin, il placer comprime le righe e la congestion esplode. Spreading: padding globale vs locale. Padding globale +20% su tutto il die è un martello; density screen locale è un bisturi.",
      "Macro placement interaction: std-cell placement fills channels — if the channel is 3 µm and the macro has 200 pins, the placer compresses rows and congestion explodes. Spreading: global vs local padding. Global +20% padding on the whole die is a hammer; local density screen is a scalpel."
    ),
  ],
  cts: [
    loc(
      "Skew budget numerico: a 1.2 GHz, Tclk = 833 ps. Overhead clock (jitter, uncertainty, Tco, Tsu) ≈ 150–200 ps. OCV sul clock path può mangiare 30–50 ps. Restano ~50 FO4 per logica se t_FO4 ≈ 12 ps. Target skew consumer ±50 ps; HPC ±20 ps; mesh < 15 ps. Useful skew è zero-sum sulla pipeline.",
      "Skew budget math: at 1.2 GHz, Tclk = 833 ps. Clock overhead (jitter, uncertainty, Tco, Tsu) ≈ 150–200 ps. OCV on the clock path can eat 30–50 ps. ~50 FO4 of logic remain if t_FO4 ≈ 12 ps. Consumer skew target ±50 ps; HPC ±20 ps; mesh < 15 ps. Useful skew is zero-sum across the pipeline."
    ),
    loc(
      "Clock mesh vs tree decision matrix: tree se power/area limitati, f < 2 GHz, skew target rilassato. Mesh se CPU/GPU multi-GHz, area clock > 30% core, budget power 2–3×. Hybrid: mesh locale su ALU + tree su periphery. Il mesh consuma M4–M6 — riservare nel floorplan.",
      "Clock mesh vs tree decision matrix: tree if power/area limited, f < 2 GHz, relaxed skew target. Mesh if multi-GHz CPU/GPU, clock area > 30% core, 2–3× power budget. Hybrid: local mesh on ALU + tree on periphery. Mesh eats M4–M6 — reserve in floorplan."
    ),
    loc(
      "NDR clock: double width, double spacing, shield VSS adiacente. Costo capacity su M3–M6. SI sul clock è raro ma glitch su clock è catastrofico. Min pulse width post-CTS: duty cycle distortion da catena CLKINV, insertion delay enorme, ICG enable timing.",
      "Clock NDR: double width, double spacing, adjacent VSS shield. Capacity cost on M3–M6. SI on clock is rare but clock glitch is catastrophic. Min pulse width post-CTS: duty distortion from CLKINV chain, huge insertion delay, ICG enable timing."
    ),
    loc(
      "CTO (clock tree optimization) dopo CTS: size buffer, layer promotion, spacing — senza rebuild completo. ccopt_design in Innovus unifica CTS+CTO. Se skew è fuori spec, rebuild con target più stretto o più livelli — non solo CTO se l'albero è sbilanciato strutturalmente.",
      "CTO after CTS: size buffers, layer promotion, spacing — without full rebuild. Innovus ccopt_design unifies CTS+CTO. If skew is out of spec, rebuild with tighter target or more levels — not CTO alone if the tree is structurally unbalanced."
    ),
    loc(
      "Hold post-CTS: migliaia di fail è normale su scan/reset. Fix: lock-up (inter-domain), delay cell (intra-domain), skew reduction locale. Non alzare Tclk. Non false-path SE. Capture at-speed è setup — non lock-up.",
      "Hold post-CTS: thousands of fails is normal on scan/reset. Fix: lock-up (inter-domain), delay cells (intra-domain), local skew reduction. Do not raise Tclk. Do not false-path SE. At-speed capture is setup — not lock-up."
    ),
    loc(
      "Clock gating check: enable setup/hold sull'ICG, glitch-free enable. Scan mode deve controllare clock. OCC root per at-speed: stesso trattamento di un clock root — exclusion, NDR, transition limit.",
      "Clock-gating check: ICG enable setup/hold, glitch-free enable. Scan mode must control clock. OCC root for at-speed: same treatment as a clock root — exclusion, NDR, transition limits."
    ),
  ],
  routing: [
    loc(
      "GCell overflow: capacity = track per GCell × routing layers assegnati; demand = somma net che attraversano. Overflow % = (demand − capacity) / capacity. Media 8% a 7 nm è stop; picco 22% locale è floorplan. Global route guida il detailed — non ignorare l'overflow «perché il detailed è più preciso».",
      "GCell overflow: capacity = tracks per GCell × assigned layers; demand = sum of crossing nets. Overflow % = (demand − capacity) / capacity. Average 8% at 7 nm is stop; local 22% peak is floorplan. Global guides detailed — do not ignore overflow «because detailed is more accurate»."
    ),
    loc(
      "Via ladder M1→Mn: ogni layer hop costa via + DRC enclosure + EM. Preferred direction H/V alternato — un net che attraversa 5 layer contro preferred paga penalty. Layer promotion per critical net: da M2 a M4 salta congestione M2–M3.",
      "Via ladder M1→Mn: each layer hop costs vias + DRC enclosure + EM. Alternating H/V preferred direction — a net crossing 5 layers against preferred pays penalty. Layer promotion for critical nets: M2 to M4 skips M2–M3 congestion."
    ),
    loc(
      "Shielding: adjacent VSS (side shield) o VDD (halo) riduce coupling. Costo: 2–3× width. Per bus DDR e clock. Spacing rule vs NDR: NDR è spacing maggiore del default senza shield dedicato.",
      "Shielding: adjacent VSS (side shield) or VDD (halo) reduces coupling. Cost: 2–3× width. For DDR buses and clock. Spacing rule vs NDR: NDR is wider than default without a dedicated shield."
    ),
    loc(
      "Antenna: ratio A_metal/A_gate cumulativo per layer di processo. Jumper a layer superiore taglia area esposta. Diode antenna: piano B se routing resource finita. Calibre antenna deck foundry — non la formula da slide.",
      "Antenna: cumulative A_metal/A_gate ratio per process layer. Upper-layer jumper cuts exposed area. Antenna diode: plan B if routing resource is gone. Foundry Calibre antenna deck — not the slide formula."
    ),
    loc(
      "Post-route optimization: size, VT swap, buffer, layer change, useful skew (limitato). ECO route per fix locali. SPEF extraction con coupling → SI-aware STA. Un WNS migliorato di 20 ps senza SPEF update è illusione.",
      "Post-route optimization: size, VT swap, buffer, layer change, limited useful skew. ECO route for local fixes. SPEF extraction with coupling → SI-aware STA. WNS improved 20 ps without SPEF update is an illusion."
    ),
    loc(
      "HFNS post-route: se reset/scan_en non sono routati, il detailed fallisce su fanout 80k. HFNS synthesis pre-route o buffer tree dedicato. Non è CTS — non applicare skew zero su reset.",
      "HFNS post-route: if reset/scan_en are not routed, detailed fails on 80k fanout. HFNS synthesis pre-route or dedicated buffer tree. Not CTS — do not apply zero skew to reset."
    ),
  ],
  layout: [
    loc(
      "Metal fill algorithm: inserisce dummy rectangles fino a ρ_min in finestre (es. 20×20 µm a 100×100 µm). Grounded fill: tie a VSS/VDD — aumenta Cground, riduce SI, può creare shorts se mal configurato. Floating fill: accoppia — peggiore per SI se denso vicino a net sensibili.",
      "Metal fill algorithm: inserts dummy rectangles until ρ_min in windows (e.g. 20×20 µm to 100×100 µm). Grounded fill: tie to VSS/VDD — raises Cground, reduces SI, can create shorts if misconfigured. Floating fill: couples — worse for SI if dense near sensitive nets."
    ),
    loc(
      "Seal ring: struttura continua attorno al die — layer stack specifico foundry. Previene crack da sawing, umidità, latch-up. Scribe line e keepout tra die su wafer. Un gap nel seal è un reject in fab.",
      "Seal ring: continuous structure around the die — foundry-specific layer stack. Prevents sawing cracks, moisture, latch-up. Scribe line and keepout between dice on wafer. A gap in the seal is a fab reject."
    ),
    loc(
      "ECO flow: metal-only usa spare cells pre-piazzate; functional richiede nuove celle (BTO slip). GDS patch vs database ECO. Ogni ECO: LEC, STA, PV, DFT. Documentazione ECO per audit foundry.",
      "ECO flow: metal-only uses pre-placed spares; functional needs new cells (BTO slip). GDS patch vs database ECO. Every ECO: LEC, STA, PV, DFT. ECO documentation for foundry audit."
    ),
    loc(
      "Hierarchy merge: block GDS + top IO + fill + seal → merged GDS/OASIS. Flatten per DRC/LVS signoff. Nome layer map locked al PDK version. Un layer map sbagliato è LVS «CORRECT» su netlist sbagliato.",
      "Hierarchy merge: block GDS + top IO + fill + seal → merged GDS/OASIS. Flatten for DRC/LVS signoff. Layer map locked to PDK version. Wrong layer map is LVS «CORRECT» on the wrong netlist."
    ),
    loc(
      "Slotting e cheesing: fili larghi PG/clock slotati per CMP e stress. Regole min metal width dopo slotting. Non applicare a signal sottili — cambia R e EM.",
      "Slotting and cheesing: fat PG/clock wires slotted for CMP and stress. Min metal width rules after slotting. Do not apply to thin signals — changes R and EM."
    ),
    loc(
      "Signoff SPEF dopo fill: StarRC/Quantus su GDS merged. WNS può muoversi 20–50 ps vs pre-fill. Se il timing è marginale pre-fill, il fill può uccidere il chip — si pianifica margine o fill strategy con il foundry.",
      "Signoff SPEF after fill: StarRC/Quantus on merged GDS. WNS can move 20–50 ps vs pre-fill. If timing is marginal pre-fill, fill can kill the chip — plan margin or fill strategy with the foundry."
    ),
  ],
  sta: [
    loc(
      "report_timing anatomy: slack, startpoint, endpoint, path group, clock launch/capture, incr delay per stage, derate %, CRPR credit, SI delta, net/cell breakdown. Un senior apre il path e identifica: 40 ps SI su net X → routing; 40 livelli cell → RTL/synth; skew 80 ps → CTS.",
      "report_timing anatomy: slack, startpoint, endpoint, path group, launch/capture clocks, incr delay per stage, derate %, CRPR credit, SI delta, net/cell breakdown. A senior opens the path and identifies: 40 ps SI on net X → routing; 40 logic levels → RTL/synth; 80 ps skew → CTS."
    ),
    loc(
      "MMMC example: modes = {func, scan_shift, scan_capture, sleep, mbist}; corners = {SS@0.75V@-40C, SS@0.75V@125C, FF@0.85V@-40C, …} × RC (typical, best, worst). 5×12 = 60 analisi. Un fail in uno solo blocca GKC. Temp inversion: SS cold può essere setup-critical a basso V.",
      "MMMC example: modes = {func, scan_shift, scan_capture, sleep, mbist}; corners = {SS@0.75V@-40C, SS@0.75V@125C, FF@0.85V@-40C, …} × RC (typical, best, worst). 5×12 = 60 runs. One fail blocks GKC. Temp inversion: SS cold can be setup-critical at low V."
    ),
    loc(
      "OCV vs AOCV vs POCV: OCV flat derate late/early; AOCV scala con depth e distance; POCV/LVF usa σ per cella. CPPR/CRPR: credit sul common clock path — toglie doppio pessimismo. Senza CPPR il WNS è pessimistico; con CPPR abusivo ottimistico — seguire foundry guideline.",
      "OCV vs AOCV vs POCV: OCV flat late/early derate; AOCV scales with depth and distance; POCV/LVF uses per-cell σ. CPPR/CRPR: credit on common clock path — removes double pessimism. Without CPPR WNS is pessimistic; with abusive CPPR optimistic — follow foundry guidelines."
    ),
    loc(
      "SI-aware STA: aggressor/victim, delta delay, glitch noise. Opposite switching → setup; same switching → hold. Fix in PD: spacing, shield, layer. set_si_delay_analysis true in PrimeTime. Un path con SI 35 ps e logic 180 ps: non VT-swap prima di pulire SI.",
      "SI-aware STA: aggressor/victim, delta delay, glitch noise. Opposite switching → setup; same switching → hold. Fix in PD: spacing, shield, layer. set_si_delay_analysis in PrimeTime. A path with 35 ps SI and 180 ps logic: do not VT-swap before cleaning SI."
    ),
    loc(
      "False path e MCP: multicycle path è contratto architetturale (div-by-N). Documentato in MAS, verificato in formal/sim. set_multicycle_path N -setup, hold 1. False path su bus handshake o scan è frode. set_disable_timing su clock root è suicidio.",
      "False paths and MCP: multicycle path is an architectural contract (div-by-N). Documented in MAS, proven in formal/sim. set_multicycle_path N -setup, hold 1. False path on handshake bus or scan is fraud. set_disable_timing on a clock root is suicide."
    ),
    loc(
      "IR-aware STA: voltage map per istanza da RedHawk/Voltus. Cell delay scala con V effettivo — hotspot IR = SS locale. Signoff richiede map sul worst scenario. Senza IR-aware, WNS ottimistico di decine di ps in blocchi CPU.",
      "IR-aware STA: per-instance voltage map from RedHawk/Voltus. Cell delay scales with effective V — IR hotspot = local SS. Signoff needs map on worst scenario. Without IR-aware, WNS optimistic by tens of ps in CPU blocks."
    ),
  ],
  pv: [
    loc(
      "DRC taxonomy: width, spacing, area, enclosure, notch, density, antenna, coloring, fin alignment (FinFET), gate cut, tip-to-tip. Ogni rule ha ID (es. M1.S.1). Waivers: solo foundry-approved, per rule ID, con giustificazione e area limitata. «Lo sappiamo» non è waiver.",
      "DRC taxonomy: width, spacing, area, enclosure, notch, density, antenna, coloring, fin alignment (FinFET), gate cut, tip-to-tip. Each rule has an ID (e.g. M1.S.1). Waivers: foundry-approved only, per rule ID, with justification and limited area. «We know» is not a waiver."
    ),
    loc(
      "LVS debug: device mismatch (W/L), net open/short, pin swap, property mismatch. Softchk prima di LVS. Un short power-ground può passare DRC ma fallire ERC. CORRECT è binario — non «quasi CORRECT».",
      "LVS debug: device mismatch (W/L), net open/short, pin swap, property mismatch. Softchk before LVS. A power-ground short may pass DRC but fail ERC. CORRECT is binary — not «almost CORRECT»."
    ),
    loc(
      "Coloring LELE: grafo di adiacenza M2 (es.), 2-colorabile. Odd cycle → router cut/jog/layer hop. Color-aware routing mode. A 5 nm EUV riduce ma non elimina tutti i pattern.",
      "LELE coloring: adjacency graph (e.g. M2), 2-colorable. Odd cycle → router cut/jog/layer hop. Color-aware routing mode. At 5 nm EUV reduces but does not eliminate all patterns."
    ),
    loc(
      "Density window: ρ in [ρ_min, ρ_max] per finestra scorrevole. Fill risolve min; slotting/cheesing risolve max locale su wide wires. CMP simulation foundry può essere gate aggiuntivo.",
      "Density window: ρ in [ρ_min, ρ_max] per sliding window. Fill fixes min; slotting/cheesing fixes local max on wide wires. Foundry CMP simulation can be an extra gate."
    ),
    loc(
      "Antenna cumulative: per layer etch order. Ratio limit dipende da oxide thickness e gate area. Diode protection: trade area vs reliability. Jumper preferred se layer disponibile.",
      "Antenna cumulative: per layer etch order. Ratio limit depends on oxide thickness and gate area. Diode protection: area vs reliability trade. Jumper preferred if layer is available."
    ),
    loc(
      "Signoff deck vs P&R deck: Innovus DRC=0 non implica Calibre=0. GKC usa Calibre/Icv sul GDS merged. Litho hotspot/PV-band: fix geometrico, non slide «yield OK».",
      "Signoff deck vs P&R deck: Innovus DRC=0 does not imply Calibre=0. GKC uses Calibre/Icv on merged GDS. Litho hotspot/PV-band: geometric fix, not a «yield OK» slide."
    ),
  ],
  power: [
    loc(
      "Vector selection per dynamic IR: WORST_POWER (energia/ciclo max), WORST_dI/dt (fronte corrente max), functional typical, scan, sleep wake-up. Un solo vector «typical» non basta. Activity annotation: SAIF/VCD/FSDB — toggle rate e glitch.",
      "Vector selection for dynamic IR: WORST_POWER (max energy/cycle), WORST_dI/dt (max current edge), functional typical, scan, sleep wake-up. One «typical» vector is not enough. Activity annotation: SAIF/VCD/FSDB — toggle rate and glitch."
    ),
    loc(
      "RedHawk/Voltus flow: import DEF+SPEF+lib+activity → simulate static/dynamic → hotspot map → fix mesh/bump/decap → re-sim until clean. IR-aware export per PrimeTime. EM: separate power vs signal reports.",
      "RedHawk/Voltus flow: import DEF+SPEF+lib+activity → simulate static/dynamic → hotspot map → fix mesh/bump/decap → re-sim until clean. IR-aware export for PrimeTime. EM: separate power vs signal reports."
    ),
    loc(
      "Decap planning: target ΔV per dominio. MOSCAP in empty area, filler cap, explicit decap cells. Trade: area vs droop vs inrush. Too much decap near one domain affects neighbor noise.",
      "Decap planning: target ΔV per domain. MOSCAP in empty area, filler cap, explicit decap cells. Trade: area vs droop vs inrush. Too much decap near one domain affects neighbor noise."
    ),
    loc(
      "Signal EM su clock/reset: activity ≈ 2 per clock. RMS e peak limits. Via array obbligatorio. Diverso da power EM su strap — due signoff, due fix.",
      "Signal EM on clock/reset: activity ≈ 2 for clock. RMS and peak limits. Mandatory via arrays. Different from power EM on straps — two signoffs, two fixes."
    ),
    loc(
      "Package model: RLC su bump, RDL, substrate. Flip-chip L più bassa. Wire-bond L alta — SSO peggio. Co-sim die+package per worst droop.",
      "Package model: RLC on bump, RDL, substrate. Flip-chip lower L. Wire-bond high L — worse SSO. Die+package co-sim for worst droop."
    ),
    loc(
      "Numerico EM: J = 1.6× Jmax, n = 2 → MTTF/10yr = (1/1.6)² ≈ 39% → ~3.9 anni. Due via in parallelo ≈ 0.8× J → (1/0.8)² ≈ 1.56× MTTF. Portare a calcolatrice al colloquio.",
      "EM math: J = 1.6× Jmax, n = 2 → MTTF/10yr = (1/1.6)² ≈ 39% → ~3.9 years. Two parallel vias ≈ 0.8× J → (1/0.8)² ≈ 1.56× MTTF. Bring a calculator to the interview."
    ),
  ],
  package: [
    loc(
      "Bump assignment: ratio VDD/VSS/IO/signal. PHY DDR: pattern signal-ground-signal. Core digital: griglia uniforme VDD/VSS con densità proporzionale alla corrente locale. Hotspot CPU sotto i bump, non lontano.",
      "Bump assignment: VDD/VSS/IO/signal ratio. DDR PHY: signal-ground-signal pattern. Digital core: uniform VDD/VSS grid with density proportional to local current. CPU hotspot under bumps, not far away."
    ),
    loc(
      "RDL (redistribution layer): routing pad → bump su layer AP/RDL. Lunga RDL = C, R, SI. Co-design: muovi PHY o bump, non solo «un layer RDL in più».",
      "RDL: pad → bump routing on AP/RDL layers. Long RDL = C, R, SI. Co-design: move PHY or bumps, not just «one more RDL layer»."
    ),
    loc(
      "SSO: V_bounce ≈ L_pkg × di/dt. N pin × C_load × dv/dt. IBIS per I/O buffer. Stagger output enable. Slew rate control. On-die decap sotto PHY.",
      "SSO: V_bounce ≈ L_pkg × di/dt. N pins × C_load × dv/dt. IBIS for I/O buffers. Stagger output enable. Slew rate control. On-die decap under PHY."
    ),
    loc(
      "Wire-bond vs flip-chip: WB < 500 IO, costo basso, L alta. FC > 1000 IO, pitch 80–150 µm, L bassa, RDL obbligatorio. Il PD floorplan cambia radicalmente tra i due.",
      "Wire-bond vs flip-chip: WB < 500 IO, lower cost, high L. FC > 1000 IO, 80–150 µm pitch, low L, mandatory RDL. PD floorplan changes radically between the two."
    ),
    loc(
      "2.5D interposer / 3D HBM: TSV, microbump, thermal limit. PD per die HBM + logic: bandwidth vs distance. Package DRC separato dal die DRC.",
      "2.5D interposer / 3D HBM: TSV, microbump, thermal limits. PD for HBM + logic die: bandwidth vs distance. Package DRC separate from die DRC."
    ),
    loc(
      "Handoff package→die: bump map frozen, substrate stack, CTE matching, keepout under bumps. Un bump map cambiato dopo floorplan è respin o ECO impossibile.",
      "Package→die handoff: frozen bump map, substrate stack, CTE matching, keepout under bumps. A bump map changed after floorplan is respin or impossible ECO."
    ),
  ],
  tapeout: [
    loc(
      "BTO checklist: FEOL DRC clean (OD, poly, well, implant), base layers GDS, IP merge, seal continuous, tap/endcap. MTO checklist: full metal stack, fill, antenna, coloring, density, LVS CORRECT, STA signoff, IR/EM, DFT.",
      "BTO checklist: FEOL DRC clean (OD, poly, well, implant), base layers GDS, IP merge, continuous seal, tap/endcap. MTO checklist: full metal stack, fill, antenna, coloring, density, LVS CORRECT, STA signoff, IR/EM, DFT."
    ),
    loc(
      "GKC disciplines: FE (RTL/LEC), PD (DRC/LVS layout), STA (MMMC clean), PV (Calibre), DFT (ATPG/MBIST), LP (UPF/CLP), PKG (bump/SSO), analog (if any). Ogni disciplina allega log tool datato. Un veto = no tapeout.",
      "GKC disciplines: FE (RTL/LEC), PD (layout DRC/LVS), STA (MMMC clean), PV (Calibre), DFT (ATPG/MBIST), LP (UPF/CLP), PKG (bump/SSO), analog (if any). Each discipline attaches a dated tool log. One veto = no tapeout."
    ),
    loc(
      "Data package foundry: GDS/OASIS, layer map, job deck, waiver list, RET/OPC handled fab-side, test structures (PCM, kerf). PDK version locked. Mask cost $2–5M+ ≤7 nm. Lead time 3–4 mesi.",
      "Foundry data package: GDS/OASIS, layer map, job deck, waiver list, fab-side RET/OPC, test structures (PCM, kerf). PDK version locked. Mask cost $2–5M+ at ≤7 nm. Lead time 3–4 months."
    ),
    loc(
      "MPW (multi-project wafer): costo mask condiviso, die più piccoli, coda fab. Stessi check signoff — non «è prototipo quindi DRC ok». Engineering wafer per bring-up.",
      "MPW: shared mask cost, smaller dice, fab queue. Same signoff checks — not «it's a prototype so DRC is ok». Engineering wafer for bring-up."
    ),
    loc(
      "Respin taxonomy: metal-only (BEOL), base (FEOL), full. Costo e tempo crescenti. Root cause: STA lied (SI, IR, corner), DFT hole, analog, package. Post-mortem obbligatorio.",
      "Respin taxonomy: metal-only (BEOL), base (FEOL), full. Cost and time increase. Root causes: STA lied (SI, IR, corner), DFT hole, analog, package. Mandatory post-mortem."
    ),
    loc(
      "Al colloquio racconta un fail reale (anche anonimo): «WNS passava senza fill SPEF»; «scan hold 12k fail senza lock-up»; «GKC veto su coloring». Poi cosa hai cambiato nel flow. È più forte di 50 acronimi.",
      "In interview tell a real fail (even anonymized): «WNS passed without fill SPEF»; «12k scan hold fails without lock-up»; «GKC veto on coloring». Then what you changed in the flow. Stronger than 50 acronyms."
    ),
  ],
};
