import { loc, type Localized } from "@/i18n/context";
import type { StageId } from "./stages";

/** Extended intro paragraphs shown after each stage.description in StageSection. */
export const stageDescriptionExtras: Record<StageId, Localized[]> = {
  rtl: [
    loc(
      "In produzione, il RTL è il contratto tra architettura e implementazione fisica. Ogni decisione — width del bus, profondità pipeline, numero di domini clock, strategia di reset — si traduce in area, timing e potenza misurabili dopo place-and-route. Un team PD senior partecipa alle review RTL proprio per questo: prevenire errori che costano settimane di ECO o un respin da $2M.",
      "In production, RTL is the contract between architecture and physical implementation. Every decision — bus width, pipeline depth, clock domain count, reset strategy — translates into measurable area, timing, and power after place-and-route. A senior PD team joins RTL reviews for this reason: prevent mistakes that cost weeks of ECO or a $2M respin."
    ),
    loc(
      "Il handoff RTL→sintesi non è un semplice «freeze del codice». Include SDC preliminare con clock definitions, UPF/CPF per design multi-voltage, report CDC/RDC firmato, piano DFT con scan chain map, lista memorie con wrapper MBIST, e budget FO4 per macro-block. Senza questi artefatti, il PD ha il diritto — e il dovere — di rifiutare il netlist.",
      "RTL→synthesis handoff is not a simple «code freeze». It includes preliminary SDC with clock definitions, UPF/CPF for multi-voltage designs, signed CDC/RDC report, DFT plan with scan chain map, memory list with MBIST wrappers, and FO4 budget per macro-block. Without these artifacts, PD has the right — and duty — to reject the netlist."
    ),
    loc(
      "Al colloquio per ruoli PD/FE boundary, ti chiederanno di leggere un estratto RTL e trovare latch inferiti, CDC non sicuri, clock gating pericoloso, e interfacce che romperanno il floorplan. Non serve essere designer RTL full-time: serve capire cosa il silicio erediterà.",
      "In interviews for PD/FE boundary roles, they will ask you to read an RTL excerpt and find inferred latches, unsafe CDC, dangerous clock gating, and interfaces that will break floorplan. You do not need to be a full-time RTL designer: you need to understand what silicon will inherit."
    ),
  ],
  verification: [
    loc(
      "La verifica RTL non è un «nice to have» prima della sintesi: è la prova che il design è strutturalmente corretto prima che qualcuno spenda milioni in mask. Simulation campiona; formal prova; lint trova errori statici; CDC/RDC prevengono failure classici in silicon. Il PD non esegue UVM, ma deve esigere evidence di closure.",
      "RTL verification is not «nice to have» before synthesis: it is proof the design is structurally correct before someone spends millions on masks. Simulation samples; formal proves; lint finds static errors; CDC/RDC prevent classic silicon failures. PD does not run UVM, but must demand closure evidence."
    ),
    loc(
      "Coverage closure a ≥95% functional e 100% code (con waiver documentati) è lo standard produzione. Un buco in coverage è un buco in silicon confidence. I mode STA per scan, retention e low-power devono avere vettori VCD rappresentativi — altrimenti power e IR signoff sono basati su attività irrealistica.",
      "Coverage closure at ≥95% functional and 100% code (with documented waivers) is production standard. A coverage hole is a silicon-confidence hole. STA modes for scan, retention, and low-power must have representative VCD vectors — otherwise power and IR signoff use unrealistic activity."
    ),
    loc(
      "LEC RTL↔gate è il ponte tra FE e PD. Un mismatch post-sintesi è un bug di synthesis firmato come layout. Gate-level sim con SDF cattura race che il formal bounded non vede. Emulation scala a boot OS ma costa setup — l'output utile per PD è netlist golden e activity file.",
      "RTL↔gate LEC is the bridge between FE and PD. A post-synthesis mismatch is a synthesis bug signed as layout. Gate-level sim with SDF catches races bounded formal may miss. Emulation scales to OS boot but costs setup — useful PD output is golden netlist and activity file."
    ),
  ],
  synthesis: [
    loc(
      "La sintesi trasforma RTL in netlist di celle Liberty (.lib): mapping, sizing, VT swap, buffering, retiming. È il primo punto dove le decisioni architetturali diventano numeri di timing. WNS/TNS a synth non garantiscono closure post-route — tipicamente il PD eredita il 30–50% del timing budget — ma un handoff con WNS negativo e TNS enorme è un segnale di disastro.",
      "Synthesis transforms RTL into Liberty (.lib) cell netlists: mapping, sizing, VT swap, buffering, retiming. It is the first point where architectural decisions become timing numbers. Synth WNS/TNS do not guarantee post-route closure — PD typically inherits 30–50% of timing budget — but handoff with negative WNS and huge TNS signals disaster."
    ),
    loc(
      "A 7 nm e sotto, NLDM è troppo grossolana per signoff: CCS/LVF con POCV è lo standard. DRV=0 (max_tran, max_cap, max_fanout) è exit criterion — un path con slew violato ha delay fuori caratterizzazione. UPF isolation e level shifter devono esistere nel netlist pre-PD, verificati con CLP.",
      "At 7 nm and below, NLDM is too crude for signoff: CCS/LVF with POCV is standard. DRV=0 is exit criterion — a path with violated slew has out-of-characterization delay. UPF isolation and level shifters must exist in netlist pre-PD, verified with CLP."
    ),
    loc(
      "Al colloquio: distingui WNS −5 ps con TNS −80 ns (migliaia di path, problema strutturale) da WNS −80 ps con TNS −80 ps (un path, fix locale). Retiming sposta registri con LEC obbligatorio — non è «aggiungi buffer in PD».",
      "In interview: distinguish WNS −5 ps with TNS −80 ns (thousands of paths, structural problem) from WNS −80 ps with TNS −80 ps (one path, local fix). Retiming moves registers with mandatory LEC — it is not «add buffers in PD»."
    ),
  ],
  floorplan: [
    loc(
      "Il floorplan decide il 70% del PPA prima che una singola cella sia piazzata. Macro placement, utilization target, aspect ratio, IO ring, bump map preliminare, fence/region per multi-owner PD, voltage island boundaries — tutto si fissa qui. Un flyline che attraversa tutto il die è un campanello d'allarme: il routing non risolverà un floorplan sbagliato.",
      "Floorplan decides 70% of PPA before a single cell is placed. Macro placement, utilization target, aspect ratio, IO ring, preliminary bump map, fence/region for multi-owner PD, voltage island boundaries — all fixed here. A flyline crossing the whole die is an alarm: routing will not fix a wrong floorplan."
    ),
    loc(
      "Utilization si misura sul CORE, non sul die. Formula: A_core = (A_std + A_macro) / U_target. Tipico 65–75% pre-place. Troppo alto → congestione irrecuperabile; troppo basso → costo wafer. Hard macro (SRAM, analog) è un buco nel routing: pin verso il canale, halo 2–5 µm, mai verso il muro della macro vicina.",
      "Utilization is measured on CORE, not die. Formula: A_core = (A_std + A_macro) / U_target. Typical 65–75% pre-place. Too high → irrecoverable congestion; too low → wafer cost. Hard macros (SRAM, analog) are routing holes: pins toward channel, 2–5 µm halo, never toward neighboring macro wall."
    ),
    loc(
      "Co-design con package team: bump pitch, power/ground ratio, DDR PHY verso bump correlati, SSO budget. Il floorplan preliminare include bump map draft — cambiarla dopo commitment è respin o ECO impossibile.",
      "Co-design with package team: bump pitch, power/ground ratio, DDR PHY toward correlated bumps, SSO budget. Preliminary floorplan includes draft bump map — changing it after commitment is respin or impossible ECO."
    ),
  ],
  pdn: [
    loc(
      "Il PDN (Power Delivery Network) porta corrente dal bump/pad alla cella. Primary path: bump → RDL → ring → mesh M8/M9 → strap → via ladder → M1 rail → pin. Secondary: VDD_SW dopo power header. Un floating rail è LVS violation e IR infinito. verify_pg_connection è check obbligatorio.",
      "PDN delivers current from bump/pad to cell. Primary path: bump → RDL → ring → M8/M9 mesh → strap → via ladder → M1 rail → pin. Secondary: VDD_SW after power header. Floating rail is LVS violation and infinite IR. verify_pg_connection is mandatory."
    ),
    loc(
      "IR drop target <5% VDD su path critico. Static IR da corrente media; dynamic IR da di/dt e rush current. EM su strap e via: J ≤ J_max(T, lifetime). Via doubling non è solo DFM — è resistenza. Decap vicino a switching logic e power header mitiga droop.",
      "IR drop target <5% VDD on critical path. Static IR from average current; dynamic IR from di/dt and rush current. EM on straps and vias: J ≤ J_max(T, lifetime). Via doubling is not only DFM — it is resistance. Decap near switching logic and power headers mitigates droop."
    ),
    loc(
      "Power gating: header width da corrente dominio, sequence isolate→retention→power-off in UPF. Rush current al power-on può causare IR globale. Always-on domain (PLL, bandgap, retention) separato da switched domain.",
      "Power gating: header width from domain current, isolate→retention→power-off sequence in UPF. Power-on rush current can cause global IR. Always-on domain (PLL, bandgap, retention) separate from switched domain."
    ),
  ],
  placement: [
    loc(
      "Placement posiziona celle standard rispettando timing, congestione e regole fisiche. Global place minimizza wirelength e congestione stimata; detailed place legalizza su row e ottimizza timing locale. Timing-driven placement pesa net critiche 5–10×. Un placement che ignora timing produce TNS enorme post-route.",
      "Placement positions standard cells respecting timing, congestion, and physical rules. Global place minimizes wirelength and estimated congestion; detailed place legalizes to rows and optimizes local timing. Timing-driven placement weights critical nets 5–10×. Placement ignoring timing produces huge post-route TNS."
    ),
    loc(
      "Hold fix pre-CTS con delay cell; post-CTS con useful skew. Hold corner FF@low V — WNS ok ma hold violato è tapeout blocker. GRC > 0.8 in hotspot = torna al floorplan. Spare cell cluster e whitespace 2–5% per ECO futuro.",
      "Hold fix pre-CTS with delay cells; post-CTS with useful skew. Hold corner FF@low V — OK WNS but violated hold is tapeout blocker. GRC > 0.8 in hotspot = return to floorplan. Spare cell clusters and 2–5% whitespace for future ECO."
    ),
    loc(
      "Voltage-aware placement: celle dello stesso dominio nella stessa region. LS strip al confine tra domini a tensione diversa. Blockage per macro halo, analog keepout, channel reserve.",
      "Voltage-aware placement: same-domain cells in same region. LS strip at boundary between different voltage domains. Blockage for macro halo, analog keepout, channel reserve."
    ),
  ],
  cts: [
    loc(
      "CTS costruisce l'albero clock da PLL a ogni FF. Skew target <5% periodo; latency controllata; ICG integrati nel tree. Post-CTS, hold violations esplodono — 10–30% dei path setup-critical diventano hold-critical. Aggiorna clock uncertainty con skew reale + jitter PLL.",
      "CTS builds clock tree from PLL to every FF. Skew target <5% of period; controlled latency; ICGs integrated in tree. Post-CTS, hold violations explode — 10–30% of setup-critical paths become hold-critical. Update clock uncertainty with real skew + PLL jitter."
    ),
    loc(
      "Multi-mode CTS: functional, scan_shift, scan_capture, at-speed con OCC. Ogni mode può avere tree diverso. Worst mode determina signoff. Useful skew chiude setup ma ha limite per non violare skew target.",
      "Multi-mode CTS: functional, scan_shift, scan_capture, at-speed with OCC. Each mode may have different tree. Worst mode determines signoff. Useful skew closes setup but has limit to avoid violating skew target."
    ),
    loc(
      "Non fixare hold con buffer sul clock net — rompe skew. Reset e scan enable sono HFNS, non CTS. Mesh vs tree: mesh per skew minimo (server), tree per power minimo (mobile).",
      "Do not fix hold with buffers on clock net — breaks skew. Reset and scan enable are HFNS, not CTS. Mesh vs tree: mesh for minimum skew (server), tree for minimum power (mobile)."
    ),
  ],
  routing: [
    loc(
      "Routing assegna geometria reale a ogni net su layer M1–Mn. Global route stima layer e congestione; detailed route rispetta DRC. Overflow = 0 è assoluto. NDR per clock e critici: 2× width, 2× spacing. SI-aware: spacing, shielding, victim upsize.",
      "Routing assigns real geometry to every net on layers M1–Mn. Global route estimates layers and congestion; detailed route respects DRC. Overflow = 0 is absolute. NDR for clock and critical: 2× width, 2× spacing. SI-aware: spacing, shielding, victim upsize."
    ),
    loc(
      "A 7 nm, SI è 10–20% del timing budget. Crosstalk delta delay report obbligatorio. DPT coloring: alternation su layer double-patterned. Antenna: diode clamp o metal jumper. Metal-only ECO su layer M2+ con spare cell proximity <50 µm.",
      "At 7 nm, SI is 10–20% of timing budget. Crosstalk delta delay report mandatory. DPT coloring: alternation on double-patterned layers. Antenna: diode clamp or metal jumper. Metal-only ECO on M2+ layers with spare cell proximity <50 µm."
    ),
    loc(
      "Congestion strutturale non si risolve con effort — si torna a placement/floorplan. ECO route su layer non congestionati; LEC gate↔gate su ogni ECO.",
      "Structural congestion is not solved with effort — return to placement/floorplan. ECO route on uncongested layers; gate↔gate LEC on every ECO."
    ),
  ],
  layout: [
    loc(
      "Layout completion: tap/endcap, filler, decap, metal fill, GDS merge. Tap spacing per latch-up prevention. Fill per CMP uniformity — timing impact <2% WNS. Filler con spare function per ECO. GDS merge bottom-up con XOR signoff vs tapeout.",
      "Layout completion: tap/endcap, filler, decap, metal fill, GDS merge. Tap spacing for latch-up prevention. Fill for CMP uniformity — timing impact <2% WNS. Filler with spare function for ECO. Bottom-up GDS merge with XOR signoff vs tapeout."
    ),
    loc(
      "Metal density 20–80% per layer. Antenna ratio < foundry max. Well continuity check post-filler. IP GDS version control nel manifest tapeout.",
      "Metal density 20–80% per layer. Antenna ratio < foundry max. Well continuity check post-filler. IP GDS version control in tapeout manifest."
    ),
    loc(
      "Il layout finale deve matchare signoff: stesso fill deck, stesso hierarchy, stesso checksum. Ogni revisione con change log.",
      "Final layout must match signoff: same fill deck, same hierarchy, same checksum. Every revision with change log."
    ),
  ],
  sta: [
    loc(
      "STA (Static Timing Analysis) verifica setup e hold su tutti i path senza simulazione. MMMC: ogni mode×corner è uno scenario. Signoff = worst WNS e worst hold across all. SDC quality è critica: clock definitions, false/multicycle giustificati, IO delay da package model.",
      "STA verifies setup and hold on all paths without simulation. MMMC: each mode×corner is one scenario. Signoff = worst WNS and hold across all. SDC quality is critical: clock definitions, justified false/multicycle, IO delay from package model."
    ),
    loc(
      "POCV a 5 nm con LVF library. OCV/AOCV bridge verso statistical. CRPR su clock reconvergence. DRV=0 prima di credere al WNS. SI on/off per corner signoff.",
      "POCV at 5 nm with LVF library. OCV/AOCV bridge toward statistical. CRPR on clock reconvergence. DRV=0 before believing WNS. SI on/off per signoff corner."
    ),
    loc(
      "False path creativo per chiudere WNS = silicon bug. Ogni false/multicycle con owner architetturale. ECO STA: incremental con netlist patch; full MMMC rerun se tocchi clock/PG.",
      "Creative false path to close WNS = silicon bug. Every false/multicycle with architectural owner. ECO STA: incremental with netlist patch; full MMMC rerun if you touch clock/PG."
    ),
  ],
  pv: [
    loc(
      "Physical verification: DRC, LVS, antenna, density, coloring. Zero violation = pass. Waiver solo con foundry approval. Deck version matcha process node. DRC clean necessario ma non sufficiente — LVS e timing anche.",
      "Physical verification: DRC, LVS, antenna, density, coloring. Zero violations = pass. Waivers only with foundry approval. Deck version matches process node. DRC clean necessary but not sufficient — LVS and timing too."
    ),
    loc(
      "LVS: netlist schematic vs estratto layout. Extraction RC alimenta post-route STA. Fill-inclusive SPEF per signoff. Hierarchical: block clean poi top assembly.",
      "LVS: schematic netlist vs layout-extracted. RC extraction feeds post-route STA. Fill-inclusive SPEF for signoff. Hierarchical: clean blocks then top assembly."
    ),
    loc(
      "XOR signoff GDS vs tapeout GDS. Property LVS per analog W/L. Reliability: HCI/NBTI derate. GKC veto su qualsiasi check rosso.",
      "XOR signoff GDS vs tapeout GDS. Property LVS for analog W/L. Reliability: HCI/NBTI derate. GKC veto on any red check."
    ),
  ],
  power: [
    loc(
      "Power analysis: dynamic P = α·C·V²·f; leakage da VT e temperatura. A 7 nm leakage può essere 40–50% totale. Clock gating, power gating, DVFS, multi-VT. VCD/SAIF da sim rappresentativa per vector-based IR/EM.",
      "Power analysis: dynamic P = α·C·V²·f; leakage from VT and temperature. At 7 nm leakage can be 40–50% total. Clock gating, power gating, DVFS, multi-VT. VCD/SAIF from representative sim for vector-based IR/EM."
    ),
    loc(
      "IR <5% VDD; EM J ≤ J_max; thermal T_j < target. Static + dynamic IR per domain. Signal EM su clock separato da power EM su strap. Self-heating su wire stretti.",
      "IR <5% VDD; EM J ≤ J_max; thermal T_j < target. Static + dynamic IR per domain. Signal EM on clock separate from power EM on straps. Self-heating on narrow wires."
    ),
    loc(
      "UPF state machine: ON, OFF, RETENTION, ISOLATED. Rush current al power-on. Decap planning: C ≥ I·Δt/ΔV. Package thermal model per T_j estimate.",
      "UPF state machine: ON, OFF, RETENTION, ISOLATED. Power-on rush current. Decap planning: C ≥ I·Δt/ΔV. Package thermal model for T_j estimate."
    ),
  ],
  package: [
    loc(
      "Package co-design: bump map, RDL, substrate routing, thermal, SSO. Flip-chip per IO count alto e power delivery; wire-bond per costo. IBIS per IO timing. DDR eye include package skew.",
      "Package co-design: bump map, RDL, substrate routing, thermal, SSO. Flip-chip for high IO and power delivery; wire-bond for cost. IBIS for IO timing. DDR eye includes package skew."
    ),
    loc(
      "SSO: V_bounce ≈ L_pkg × di/dt. Stagger switching, ground bump ratio, package decap. 2.5D/3D: TSV, HBM, thermal limit severo. CTE mismatch → warpage.",
      "SSO: V_bounce ≈ L_pkg × di/dt. Stagger switching, ground bump ratio, package decap. 2.5D/3D: TSV, HBM, severe thermal limit. CTE mismatch → warpage."
    ),
    loc(
      "Weekly sync die-package team. Bump map frozen dopo floorplan commitment. Power bump count da IR preliminare.",
      "Weekly die-package team sync. Bump map frozen after floorplan commitment. Power bump count from preliminary IR."
    ),
  ],
  tapeout: [
    loc(
      "Tapeout è il gate legale prima del mask order. GKC: ogni disciplina firma (FE, PD, STA, PV, DFT, LP, PKG). Signoff matrix con tool/deck version. Zero waiver non approvato. Data package: GDS, netlist, SDC, UPF, reports, IP manifest.",
      "Tapeout is the legal gate before mask order. GKC: each discipline signs (FE, PD, STA, PV, DFT, LP, PKG). Signoff matrix with tool/deck versions. Zero unapproved waivers. Data package: GDS, netlist, SDC, UPF, reports, IP manifest."
    ),
    loc(
      "BTO (FEOL) e MTO (BEOL) possono essere separati. MPW per prototipo; full mask per produzione. Mask cost $M a node avanzato. Turnaround 8–12 settimane fab.",
      "BTO (FEOL) and MTO (BEOL) may be separate. MPW for prototype; full mask for production. Mask cost $M at advanced node. 8–12 week fab turnaround."
    ),
    loc(
      "First silicon: ATE, shmoo V×f, scan/BIST debug. Respin costa $M e mesi — signoff rigoroso è economia. Post-mortem obbligatorio su ogni respin.",
      "First silicon: ATE, shmoo V×f, scan/BIST debug. Respin costs $M and months — rigorous signoff is economics. Mandatory post-mortem on every respin."
    ),
  ],
};
