import { loc } from "@/i18n/context";
import type { PlaybookChapter } from "./playbook";

/** Additional playbook chapters — merged with playbook in LearnLab. */
export const playbookMore: PlaybookChapter[] = [
  {
    id: "sta-mmmc",
    title: loc("STA signoff e MMMC", "STA signoff and MMMC"),
    kicker: loc(
      "Ogni mode × corner è un mondo. Uno solo rosso = niente GKC.",
      "Every mode × corner is a world. One red = no GKC."
    ),
    paragraphs: [
      loc(
        "Mode tipici: functional (mission), scan_shift (SE=1, bassa f), scan_capture / launch-on-capture (at-speed), sleep / retention, mbist, low-power (isolation on). Ogni mode ha SDC diverso: set_case_analysis, disable timing su clock spenti, false path su ISO. Dimenticare un mode è il classico «passava in func» respin.",
        "Typical modes: functional (mission), scan_shift (SE=1, low f), scan_capture / launch-on-capture (at-speed), sleep / retention, mbist, low-power (isolation on). Each mode has different SDC: set_case_analysis, disable timing on off clocks, false paths on ISO. Forgetting a mode is the classic «passed in func» respin."
      ),
      loc(
        "Corner PVT: process (SS/TT/FF/Typical), voltage (nom ± %), temperature (−40…125°C). RC corner: Cbest/Ctyp/Cworst per setup/hold. A 7 nm: temperature inversion — setup worst può essere SS@cold@lowV, non solo SS@hot. Il deck MMMC deve includere entrambi se il nodo lo richiede.",
        "PVT corners: process (SS/TT/FF/Typical), voltage (nom ± %), temperature (−40…125°C). RC corner: Cbest/Ctyp/Cworst for setup/hold. At 7 nm: temperature inversion — setup worst can be SS@cold@lowV, not only SS@hot. The MMMC deck must include both if the node requires it."
      ),
      loc(
        "DRV prima di WNS: max_transition, max_capacitance, max_fanout, noise (crosstalk glitch). PrimeTime: report_constraint -all_violators. Un path con slack −5 ps e slew 3× il max della tabella .lib ha delay inventato. Fix DRV, poi rileggi WNS — spesso migliora da solo o peggiora (verità).",
        "DRV before WNS: max_transition, max_capacitance, max_fanout, noise (crosstalk glitch). PrimeTime: report_constraint -all_violators. A path at −5 ps slack with slew 3× the .lib table max has invented delay. Fix DRV, then re-read WNS — often improves on its own or worsens (truth)."
      ),
      loc(
        "report_timing -path_type full -delay_type max/min -significant_digits 4. Leggi: incr cell vs net, derate, clock skew, CRPR, SI. Path con 60% net delay → routing/SI. Path con 40 livelli cell → RTL/synth. Path con skew 90 ps → CTS. L'arma segue il breakdown.",
        "report_timing -path_type full -delay_type max/min -significant_digits 4. Read: incr cell vs net, derate, clock skew, CRPR, SI. Path with 60% net delay → routing/SI. Path with 40 logic levels → RTL/synth. Path with 90 ps skew → CTS. The weapon follows the breakdown."
      ),
      loc(
        "Eco STA: dopo metal-only ECO, incremental timing con netlist patch + SPEF update su regione ECO. Full MMMC rerun se tocchi clock/PG. Un corner saltato perché «solo −3 ps» è veto DFT/STA al GKC.",
        "ECO STA: after metal-only ECO, incremental timing with netlist patch + SPEF update on ECO region. Full MMMC rerun if you touch clock/PG. Skipping a corner because «only −3 ps» is a DFT/STA veto at GKC."
      ),
      loc(
        "Signoff correlation: silicon shmoo vs STA corner. Se silicon passa a 0.72 V ma STA fail a 0.75 V SS, il modello è rotto o il corner sbagliato. Si aggiorna OCV/POCV o si aggiunge corner — non si waivera WNS senza capire.",
        "Signoff correlation: silicon shmoo vs STA corner. If silicon passes at 0.72 V but STA fails at 0.75 V SS, the model is broken or the corner is wrong. Update OCV/POCV or add a corner — do not waive WNS without understanding."
      ),
    ],
  },
  {
    id: "cts-deep",
    title: loc("CTS e clock mesh — guida operativa", "CTS and clock mesh — operational guide"),
    kicker: loc(
      "Il clock è metà del timing e metà del power. Trattalo come tale.",
      "Clock is half of timing and half of power. Treat it that way."
    ),
    paragraphs: [
      loc(
        "Clock spec file: root pin, excluded pins (analog, test), target skew/latency, max transition/cap, NDR rules, clock gating cells allowed, non-default route layers. Through-pin per clock domain crossing nel tree. Un excluded pin dimenticato è un sink senza clock → hold/setup fantasy.",
        "Clock spec file: root pin, excluded pins (analog, test), target skew/latency, max transition/cap, NDR rules, allowed clock-gating cells, non-default route layers. Through-pins for clock-domain crossing in the tree. A forgotten excluded pin is a sink without clock → fantasy hold/setup."
      ),
      loc(
        "Skew vs latency: skew è max−min arrival ai sink; latency è assoluta dal root. Bassa latency utile per IO; basso skew utile per setup/hold interno. Trade-off livelli buffer: più livelli → skew controllabile ma latency e OCV ↑, power ↑.",
        "Skew vs latency: skew is max−min arrival at sinks; latency is absolute from root. Low latency helps IO; low skew helps internal setup/hold. Buffer-level trade-off: more levels → controllable skew but latency and OCV ↑, power ↑."
      ),
      loc(
        "Mesh synthesis: griglia H+V su M4–M6, stub corti ai FF, multi-driver sulla mesh. Skew < 15 ps possibile ma power 2–3× tree. Riservare area nel floorplan — il mesh non «si infila» dopo place se M4 è pieno.",
        "Mesh synthesis: H+V grid on M4–M6, short stubs to FFs, multi-drivers on the mesh. Skew < 15 ps possible but 2–3× tree power. Reserve area in floorplan — mesh does not «fit in» after place if M4 is full."
      ),
      loc(
        "Useful skew: ritarda capture su path setup-critical (aiuta setup, mangia hold). Zero-sum: il path successivo nella pipeline paga. Si usa su endpoint isolati, non globale. CTO tweak skew senza rebuild solo se entro budget piccolo.",
        "Useful skew: delay capture on setup-critical path (helps setup, eats hold). Zero-sum: the next path in the pipeline pays. Use on isolated endpoints, not globally. CTO skew tweak without rebuild only if within a small budget."
      ),
      loc(
        "Post-CTS hold: migliaia di fail su scan è normale. Lock-up inter-domain, delay intra-domain, skew reduction su cluster. Non false-path scan_en. Capture at-speed è setup func — size/SI/skew.",
        "Post-CTS hold: thousands of scan fails is normal. Inter-domain lock-up, intra-domain delay, skew reduction on clusters. Do not false-path scan_en. At-speed capture is func setup — size/SI/skew."
      ),
      loc(
        "Clock power: report_clock_tree_power. Mesh domina dynamic power. Clock gating a RTL riduce toggle su logica ma il tree resta. Multi-Vt su clock buffer: raro — variation. NDR largo = più C → più power.",
        "Clock power: report_clock_tree_power. Mesh dominates dynamic power. RTL clock gating cuts logic toggle but the tree remains. Multi-Vt on clock buffers: rare — variation. Wide NDR = more C → more power."
      ),
    ],
  },
  {
    id: "ir-em",
    title: loc("IR drop e EM — signoff numerico", "IR drop and EM — numerical signoff"),
    kicker: loc(
      "Volt e Ampere non mentono. I Watt medi sì.",
      "Volts and amps do not lie. Average watts do."
    ),
    paragraphs: [
      loc(
        "Static IR workflow: power map (I per block/instance) × R grid (DEF+tech) → voltage map. Worst instance < 5% VDD (tipico). Hotspot sotto CPU senza bump vicini è floorplan+package, non «manca un strap» locale.",
        "Static IR workflow: power map (I per block/instance) × R grid (DEF+tech) → voltage map. Worst instance < 5% VDD (typical). Hotspot under CPU without nearby bumps is floorplan+package, not «missing a local strap»."
      ),
      loc(
        "Dynamic: V(t) = V0 − I·R − L·di/dt. VCD WORST_dI/dt per il termine L. Decap C taglia il picco: ΔV = I·Δt/C. Posizionare C vicino al draw, non a 2 mm. ESR/ESL del package contano.",
        "Dynamic: V(t) = V0 − I·R − L·di/dt. WORST_dI/dt VCD for the L term. Decap C cuts the peak: ΔV = I·Δt/C. Place C near the draw, not 2 mm away. Package ESR/ESL matter."
      ),
      loc(
        "EM power: J_avg su strap, J_peak su via. Via array obbligatorio sopra soglia foundry. Signal EM clock: RMS con activity 2. Due tool run, due fix list. Confondere i due al colloquio è red flag.",
        "Power EM: J_avg on straps, J_peak on vias. Via arrays mandatory above foundry threshold. Clock signal EM: RMS with activity 2. Two tool runs, two fix lists. Confusing them in interview is a red flag."
      ),
      loc(
        "Black equation: MTTF = A·J^(−n)·exp(Ea/kT). n≈2 per Al/Cu. 1.6× J → MTTF / 2.56. Portare numeri al colloquio. Falsificare activity clock a 0.01 per passare EM è licenziamento, non fix.",
        "Black equation: MTTF = A·J^(−n)·exp(Ea/kT). n≈2 for Al/Cu. 1.6× J → MTTF / 2.56. Bring numbers to interview. Faking clock activity to 0.01 to pass EM is termination, not a fix."
      ),
      loc(
        "IR-aware STA: voltage map → effective V per instance → delay derate. Un hotspot 7% IR è come SS locale. Senza questo step, WNS mente su CPU/GPU. Export da RedHawk/Voltus a PrimeTime.",
        "IR-aware STA: voltage map → effective V per instance → delay derate. A 7% IR hotspot acts like local SS. Without this step, WNS lies on CPU/GPU. Export from RedHawk/Voltus to PrimeTime."
      ),
      loc(
        "Package co-sim: die + bump + RDL + substrate. Flip-chip riduce L. SSO e IR package-linked. Il PD che ignora il package model firma un chip che funziona solo sul foglio.",
        "Package co-sim: die + bump + RDL + substrate. Flip-chip reduces L. SSO and IR are package-linked. PD ignoring the package model signs a chip that works only on paper."
      ),
    ],
  },
  {
    id: "low-power",
    title: loc("Low power: UPF, isolation, retention", "Low power: UPF, isolation, retention"),
    kicker: loc(
      "Spegnere un dominio non è free — costa celle, timing, e verifica.",
      "Turning off a domain is not free — it costs cells, timing, and verification."
    ),
    paragraphs: [
      loc(
        "UPF IEEE 1801: power domains, supply nets, power switches, isolation strategies, level shifters, retention. CLP verifica che netlist e layout implementino l'intent. Isolation clamp value (0/1/latch) deve matchare architettura.",
        "UPF IEEE 1801: power domains, supply nets, power switches, isolation strategies, level shifters, retention. CLP verifies netlist and layout implement intent. Isolation clamp value (0/1/latch) must match architecture."
      ),
      loc(
        "Level shifter: LS_HL (high→low V), LS_LH (low→high). Posizionati sulla strip di confine dominio. Timing path attraversa LS — setup/hold su LS cell. Retention: save/restore su power-down — timing su retention clock.",
        "Level shifter: LS_HL (high→low V), LS_LH (low→high V). Placed on domain boundary strip. Timing paths cross LS — setup/hold on LS cell. Retention: save/restore on power-down — timing on retention clock."
      ),
      loc(
        "Power switch: header PMOS (VDD→VDD_SW) standard. Footer NMOS raro. Inrush current quando si accende dominio — stagger enable in UPF sequence. Fishbone layout per switch columns.",
        "Power switch: PMOS header (VDD→VDD_SW) standard. NMOS footer rare. Inrush when turning on domain — stagger enable in UPF sequence. Fishbone layout for switch columns."
      ),
      loc(
        "STA low-power modes: disable timing su supply off, set_case_analysis su isolation, retention mode. Un path che attraversa dominio spento senza ISO è bug. Sim + formal su sequence power-on/off.",
        "STA low-power modes: disable timing on off supply, set_case_analysis on isolation, retention mode. A path crossing a powered-off domain without ISO is a bug. Sim + formal on power-on/off sequence."
      ),
      loc(
        "Always-on island: buffer, retention, power switch controller. Non spegnere per errore. AON bump dedicati. PD region per AON separata da switched core.",
        "Always-on island: buffers, retention, power-switch controller. Do not accidentally power off. Dedicated AON bumps. PD region for AON separate from switched core."
      ),
      loc(
        "Colloquio: «come verifichi isolation?» → CLP + sim power sequence + gate-level con UPF. «Cosa succede se manca LS?» → overvoltage/undrive su input, oxide stress, funzione errata.",
        "Interview: «how do you verify isolation?» → CLP + power-sequence sim + gate-level with UPF. «What if LS is missing?» → overvoltage/undrive on inputs, oxide stress, wrong function."
      ),
    ],
  },
  {
    id: "floorplan-war",
    title: loc("Floorplan — errori che costano settimane", "Floorplan — mistakes that cost weeks"),
    kicker: loc(
      "Spostare una macro a place è 10× più caro che a floorplan.",
      "Moving a macro at place is 10× more expensive than at floorplan."
    ),
    paragraphs: [
      loc(
        "Errore 1: SRAM pin verso il muro. Fix: rotate 180°, allarga canale 5→8 µm, flyline review. Errore 2: PLL in centro digitale. Fix: quiet corner, guard ring, dedicated PG. Errore 3: U su die confusa con U su core — resize die sbagliato.",
        "Mistake 1: SRAM pins toward wall. Fix: rotate 180°, widen channel 5→8 µm, flyline review. Mistake 2: PLL in digital center. Fix: quiet corner, guard ring, dedicated PG. Mistake 3: die U confused with core U — wrong die resize."
      ),
      loc(
        "Errore 4: bump map deciso dopo PD. PHY lontano da bump → RDL lungo, SSO, IR. Fix: co-design day-1 o accetta respin package. Errore 5: macro nel centro che taglia mesh clock. Fix: spine riservata, mesh block hole planning.",
        "Mistake 4: bump map decided after PD. PHY far from bumps → long RDL, SSO, IR. Fix: day-1 co-design or accept package respin. Mistake 5: center macros cutting clock mesh. Fix: reserved spine, mesh block-hole planning."
      ),
      loc(
        "Errore 6: hard macro senza halo → DRC macro + congestion pin access. Errore 7: soft blockage ovunque → placer non può fix timing. Partial blockage su halo macro. Errore 8: IO order ignorato — package team ribalta tutto.",
        "Mistake 6: hard macro without halo → macro DRC + pin-access congestion. Mistake 7: soft blockage everywhere → placer cannot fix timing. Partial blockage on macro halo. Mistake 8: ignored IO order — package team reverses everything."
      ),
      loc(
        "Flyline tool: weighted by criticality e bandwidth. Review con arch: «questo arco 2.1 mm è accettabile?» Se no, move macro prima di place exit. WLM pre-place con floorplan frozen è gate.",
        "Flyline tool: weighted by criticality and bandwidth. Review with arch: «is this 2.1 mm arc acceptable?» If not, move macro before place exit. Pre-place WLM with frozen floorplan is a gate."
      ),
      loc(
        "Multi-die / chiplet: die-to-die interface su bordo. Thermal hotspot al centro di ogni die. UPF per die separati. Floorplan exit per die + top integration plan.",
        "Multi-die / chiplet: die-to-die interface on edge. Thermal hotspot at each die center. UPF per die. Floorplan exit per die + top integration plan."
      ),
      loc(
        "Checklist floorplan exit: macro FIXED, pin placed, PG skeleton connected, legality clean, islands mapped, flyline reviewed, bump preliminary OK, congestion WLM yellow max, analog keepout signed.",
        "Floorplan exit checklist: macros FIXED, pins placed, PG skeleton connected, legality clean, islands mapped, flylines reviewed, bumps preliminary OK, congestion WLM yellow max, analog keepout signed."
      ),
    ],
  },
  {
    id: "routing-si",
    title: loc("Routing, SI e congestion", "Routing, SI, and congestion"),
    kicker: loc(
      "Il router non crea track. Assegna capacità.",
      "The router does not create tracks. It assigns capacity."
    ),
    paragraphs: [
      loc(
        "Congestion root cause tree: (1) floorplan macro/pin, (2) placement density, (3) too much NDR on signal, (4) clock mesh ate M4–M6, (5) global route bad layer assignment. Salire di livello nel tree, non solo ripetere detailed.",
        "Congestion root-cause tree: (1) floorplan macro/pins, (2) placement density, (3) too much NDR on signal, (4) clock mesh ate M4–M6, (5) bad global layer assignment. Climb the tree, do not just rerun detailed."
      ),
      loc(
        "Crosstalk: Δdelay = k × C_coupling × aggressor_slew. Opposite-edge switching worst for setup; same-edge for hold and glitch on quiet victims. Fix hierarchy: spacing > shield > layer hop > victim upsize (last — can worsen neighbors).",
        "Crosstalk: Δdelay = k × C_coupling × aggressor_slew. Opposite-edge switching worst for setup; same-edge for hold and glitch on quiet victims. Fix hierarchy: spacing > shield > layer hop > victim upsize (last — can worsen neighbors)."
      ),
      loc(
        "NDR cost: double spacing on net riduce capacity GCell ~40%. Applicare NDR solo a clock, reset critici, bus DDR — non «tutto M3 NDR perché siamo paranoici».",
        "NDR cost: double spacing on a net cuts GCell capacity ~40%. Apply NDR only to clock, critical reset, DDR buses — not «all M3 NDR because we are paranoid»."
      ),
      loc(
        "Global detour: net che fa zig-zag per overflow crea wire delay + SI. Post-route opt può size ma non accorciare un detour di 500 µm. Torna a place spread o floorplan.",
        "Global detour: a net zig-zagging for overflow adds wire delay + SI. Post-route opt can size but cannot shorten a 500 µm detour. Go back to place spread or floorplan."
      ),
      loc(
        "SPEF quality: coupling cap, location, layer. Incomplete extraction → SI miss. Signoff extraction con fill merged. Compare pre/post-fill WNS — budget margine.",
        "SPEF quality: coupling cap, location, layer. Incomplete extraction → missed SI. Signoff extraction with merged fill. Compare pre/post-fill WNS — budget margin."
      ),
      loc(
        "Antenna post-route: cumulative ratio per layer. Diode insertion in layout se jumper impossibile. Widening metal worsens ratio — controintuitivo per chi viene da «fix DRC allargando».",
        "Antenna post-route: cumulative ratio per layer. Diode insertion in layout if jumper impossible. Widening metal worsens ratio — counterintuitive for «fix DRC by widening» veterans."
      ),
    ],
  },
];
