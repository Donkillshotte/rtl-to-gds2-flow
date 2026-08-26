import { loc } from "@/i18n/context";
import type { StageId } from "./stages";
import type { InterviewQuestion } from "./stageFormulas";

/** Additional senior Q&A merged into StageSection interview blocks. */
export const interviewExtraMore: Record<StageId, InterviewQuestion[]> = {
  rtl: [
    {
      question: loc("FO4 budget: 1.2 GHz, t_FO4=12 ps, overhead 180 ps. Quanti FO4 di logica?", "FO4 budget: 1.2 GHz, t_FO4=12 ps, overhead 180 ps. How many FO4 of logic?"),
      answer: loc("Tclk=833 ps. Tlogic≈833−180=653 ps. FO4≈653/12≈54. Al colloquio mostra il calcolo, non «circa 50».", "Tclk=833 ps. Tlogic≈833−180=653 ps. FO4≈653/12≈54. In interview show the math, not «about 50»."),
    },
    {
      question: loc("Perché ICG e non AND sul clock?", "Why ICG and not AND on the clock?"),
      answer: loc("Enable asincrono glitcha → pulse corto/doppio edge. ICG = latch(enable)+AND, enable sincrono. STA clock-gating check.", "Async enable glitches → short/double edge. ICG = latch(enable)+AND, sync enable. STA clock-gating check."),
    },
  ],
  verification: [
    {
      question: loc("Formal bounded vs unbounded — quando ti fidi?", "Formal bounded vs unbounded — when do you trust it?"),
      answer: loc("Unbounded se converge (proof). Bounded se depth limitata — citare il bound. Un proof bounded a 5 cicli non prova deadlock a 6.", "Unbounded if it converges (proof). Bounded if depth-limited — cite the bound. A proof bounded to 5 cycles does not prove deadlock at 6."),
    },
    {
      question: loc("Coverage 95% functional ma bug in silicon — cosa mancava?", "95% functional coverage but silicon bug — what was missing?"),
      answer: loc("Cross coverage, assertion, gate SDF, corner STA, o scenario mode (scan/lp). Coverage bin non è completezza.", "Cross coverage, assertions, gate SDF, corner STA, or mode scenario (scan/lp). Coverage bins are not completeness."),
    },
  ],
  synthesis: [
    {
      question: loc("NLDM vs CCS a 7 nm — perché CCS?", "NLDM vs CCS at 7 nm — why CCS?"),
      answer: loc("NLDM: tabella slew×Cload, estrapola male con SI e waveform reali. CCS: correnti → accuracy su net complessi. Signoff spesso LVF/POCV sopra CCS.", "NLDM: slew×Cload table, extrapolates badly with SI and real waveforms. CCS: currents → accuracy on complex nets. Signoff often LVF/POCV on top of CCS."),
    },
    {
      question: loc("dont_touch su critical path — come chiudi timing?", "dont_touch on critical path — how do you close timing?"),
      answer: loc("Route: layer promote, shield, spacing. CTS: useful skew. ECO metal-only se spare. Non size se dont_touch — negozia con FE o size_only.", "Route: layer promote, shield, spacing. CTS: useful skew. Metal-only ECO if spare. No size if dont_touch — negotiate with FE or size_only."),
    },
  ],
  floorplan: [
    {
      question: loc("Canale 3 µm tra due SRAM — accetti?", "3 µm channel between two SRAMs — do you accept?"),
      answer: loc("A 7 nm con pin density alta: no. Target 5–8 µm o rotate pin. Overflow pre-place è la prova.", "At 7 nm with high pin density: no. Target 5–8 µm or rotate pins. Pre-place overflow is the proof."),
    },
    {
      question: loc("Hard vs soft blockage su halo macro?", "Hard vs soft blockage on macro halo?"),
      answer: loc("Partial: solo buffer/inverter nel halo — CTS/DRV fix senza muro di logica. Hard solo se analog/keepout stretto.", "Partial: buffers/inverters only in halo — CTS/DRV fix without a logic wall. Hard only for analog/tight keepout."),
    },
  ],
  pdn: [
    {
      question: loc("Header vs footer power switch?", "Header vs footer power switch?"),
      answer: loc("Header PMOS: VDD→VDD_SW, ground clean. Footer NMOS: virtual VSS, ground bounce. Header è default industriale.", "PMOS header: VDD→VDD_SW, clean ground. NMOS footer: virtual VSS, ground bounce. Header is industrial default."),
    },
    {
      question: loc("Decap 5% area — basta?", "5% decap area — enough?"),
      answer: loc("No come signoff. C≥I·Δt/ΔV per hotspot. 5% è euristica. Simula WORST_dI/dt e inrush.", "Not as signoff. C≥I·Δt/ΔV per hotspot. 5% is heuristic. Simulate WORST_dI/dt and inrush."),
    },
  ],
  placement: [
    {
      question: loc("Timing-driven placement spento — rischio?", "Timing-driven placement off — risk?"),
      answer: loc("HPWL minimo distende critical path. WNS post-route esplode. Sempre timing-driven da place in poi.", "Minimum HPWL stretches critical path. Post-route WNS explodes. Always timing-driven from place onward."),
    },
    {
      question: loc("Displacement 15 µm su FF del WNS path?", "15 µm displacement on WNS path FF?"),
      answer: loc("A 7 nm ≈20–40 ps wire extra. Rivedi density/blockage, non solo upsize. Il timing pre-legal era bugiardo.", "At 7 nm ≈20–40 ps extra wire. Revisit density/blockage, not only upsize. Pre-legal timing lied."),
    },
  ],
  cts: [
    {
      question: loc("Mesh vs tree — decisione in 30 secondi?", "Mesh vs tree — 30-second decision?"),
      answer: loc("Tree: <2 GHz, power budget, skew ±30–50 ps ok. Mesh: multi-GHz CPU, skew <15 ps, 2–3× power ok. Hybrid se metà metà.", "Tree: <2 GHz, power budget, ±30–50 ps skew ok. Mesh: multi-GHz CPU, <15 ps skew, 2–3× power ok. Hybrid if half-and-half."),
    },
    {
      question: loc("Min pulse width post-CTS — cause?", "Min pulse width post-CTS — causes?"),
      answer: loc("Duty distortion CLKINV, insertion delay, ICG enable, SI su clock. Fix: balance rise/fall, meno livelli, NDR.", "CLKINV duty distortion, insertion delay, ICG enable, SI on clock. Fix: balance rise/fall, fewer levels, NDR."),
    },
  ],
  routing: [
    {
      question: loc("Overflow 5% medio — procedi al detailed?", "5% average overflow — proceed to detailed?"),
      answer: loc("No a 7 nm. Spread/floorplan fino a <3% medio e picchi <10%. Detailed su overflow alto è tempo bruciato.", "No at 7 nm. Spread/floorplan until <3% average and peaks <10%. Detailed on high overflow burns time."),
    },
    {
      question: loc("Shield VSS vs spacing — quando shield?", "Shield VSS vs spacing — when to shield?"),
      answer: loc("Bus DDR, clock paralleli, net con SI delta >30% del logic delay. Costo 2–3× width — non su tutto il chip.", "DDR buses, parallel clocks, nets with SI delta >30% of logic delay. Cost 2–3× width — not on the whole chip."),
    },
  ],
  layout: [
    {
      question: loc("Fill grounded vs floating — impatto timing?", "Grounded vs floating fill — timing impact?"),
      answer: loc("Grounded: +Cground, −SI, +delay. Floating: coupling. SPEF signoff deve includere fill reale del GDS merged.", "Grounded: +Cground, −SI, +delay. Floating: coupling. Signoff SPEF must include real fill from merged GDS."),
    },
    {
      question: loc("Metal-only ECO — cosa slitta se piazzi NAND nuova?", "Metal-only ECO — what slips if you place a new NAND?"),
      answer: loc("BTO/FEOL freeze. Nuova cella = functional ECO. Spare riwire + metal è metal-only.", "BTO/FEOL freeze. New cell = functional ECO. Spare rewire + metal is metal-only."),
    },
  ],
  sta: [
    {
      question: loc("CPPR — cosa fa in una frase?", "CPPR — what does it do in one sentence?"),
      answer: loc("Toglie doppio pessimismo OCV sul common clock path — credit aggiunto allo slack nel report.", "Removes double OCV pessimism on the common clock path — credit added to slack in the report."),
    },
    {
      question: loc("Temp inversion a 7 nm — corner setup?", "Temp inversion at 7 nm — setup corner?"),
      answer: loc("SS cold @ low V può essere peggiore di SS hot. MMMC deve includere entrambi, non solo il classico SS@125°C.", "SS cold @ low V can be worse than SS hot. MMMC must include both, not only classic SS@125°C."),
    },
  ],
  pv: [
    {
      question: loc("Innovus DRC=0, Calibre 200 color — chi firma?", "Innovus DRC=0, Calibre 200 color — who signs?"),
      answer: loc("Calibre sul GDS merged. P&R deck è subset. GKC non accetta Innovus counter.", "Calibre on merged GDS. P&R deck is a subset. GKC does not accept the Innovus counter."),
    },
    {
      question: loc("LVS CORRECT ma funzione sbagliata — possibile?", "LVS CORRECT but wrong function — possible?"),
      answer: loc("Sì: netlist golden sbagliato, property LVS non checkata, analog device W/L off. LEC + sim + review.", "Yes: wrong golden netlist, property LVS not checked, analog W/L off. LEC + sim + review."),
    },
  ],
  power: [
    {
      question: loc("Static 3%, dynamic 11% per 90 ps — pass?", "Static 3%, dynamic 11% for 90 ps — pass?"),
      answer: loc("Dipende limite (spesso 10%). 11% dynamic fail. Fix: decap, mesh, stagger, ridurre di/dt.", "Depends on limit (often 10%). 11% dynamic fails. Fix: decap, mesh, stagger, cut di/dt."),
    },
    {
      question: loc("Power EM vs signal EM — stesso report?", "Power EM vs signal EM — same report?"),
      answer: loc("No. Power: DC/RMS su strap. Signal: RMS/peak su clock con activity. Due fix list.", "No. Power: DC/RMS on straps. Signal: RMS/peak on clock with activity. Two fix lists."),
    },
  ],
  package: [
    {
      question: loc("Bump map frozen, SSO fail — fix die?", "Bump map frozen, SSO fails — die fix?"),
      answer: loc("Mitigazione: decap PHY, slew, stagger, RDL corta. Lpkg resta. Co-design day-1 evita questo.", "Mitigation: PHY decap, slew, stagger, short RDL. Lpkg remains. Day-1 co-design avoids this."),
    },
    {
      question: loc("Flip-chip vs wire-bond per 2000 IO?", "Flip-chip vs wire-bond for 2000 IO?"),
      answer: loc("Flip-chip: area bumps, bassa L, RDL. Wire-bond impraticabile oltre ~500 IO. Floorplan diverge.", "Flip-chip: area bumps, low L, RDL. Wire-bond impractical above ~500 IO. Different floorplan."),
    },
  ],
  tapeout: [
    {
      question: loc("BTO vs MTO — cosa congela cosa?", "BTO vs MTO — what freezes what?"),
      answer: loc("BTO: FEOL (well, OD, poly, implant). MTO: BEOL (metal, via). Dopo BTO no nuove celle. Dopo MTO no metal change senza respin BEOL.", "BTO: FEOL (well, OD, poly, implant). MTO: BEOL (metal, via). After BTO no new cells. After MTO no metal change without BEOL respin."),
    },
    {
      question: loc("GKC veto STA — evidenza richiesta?", "GKC STA veto — evidence required?"),
      answer: loc("report_timing log su tutti mode×corner, WNS/TNS, DRV=0, SI report. Slide verde non basta.", "report_timing logs on all mode×corner, WNS/TNS, DRV=0, SI report. Green slide is not enough."),
    },
  ],
};
