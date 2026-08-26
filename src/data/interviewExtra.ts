import { loc, type Localized } from "@/i18n/context";
import type { StageId } from "./stages";
import type { InterviewQuestion } from "./stageFormulas";

/** Extra senior Q&A merged into each stage + the Learn Lab flashcards. */
export const extraInterview: Record<StageId, InterviewQuestion[]> = {
  rtl: [
    {
      question: loc(
        "Perché un AND sul clock è un errore da junior?",
        "Why is an AND on the clock a junior mistake?"
      ),
      answer: loc(
        "L'enable asincrono glitcha il clock (pulse corto, doppio edge). ASIC usa ICG: latch sull'enable + AND, enable sincrono. STA ha un clock-gating check dedicato.",
        "An async enable glitches the clock (short pulse, double edge). ASIC uses ICG: latch on enable + AND, synchronous enable. STA has a dedicated clock-gating check."
      ),
    },
    {
      question: loc(
        "Cosa deve essere vero sul netlist prima che il PD accetti lo scan come 'già fatto'?",
        "What must be true on the netlist before PD accepts scan as 'already done'?"
      ),
      answer: loc(
        "Ogni FF è SDFF, chain stitchate, compressione/OCC se specificate, LEC RTL↔scan pulito, lock-up sui crossing, SE come HFNS, memorie wrapped o documented untestable. Scan non si 'aggiunge in Innovus'.",
        "Every FF is an SDFF, chains stitched, compression/OCC if specified, RTL↔scan LEC clean, lock-ups on crossings, SE as HFNS, memories wrapped or documented untestable. Scan is not 'added in Innovus'."
      ),
    },
    {
      question: loc(
        "Perché un bus CDC con 2-FF per bit è sbagliato?",
        "Why is a CDC bus with a 2-FF per bit wrong?"
      ),
      answer: loc(
        "I bit si risolvono in cicli diversi → parola incoerente. FIFO async con puntatori Gray, o handshake sul control. MTBF del 2-FF > vita del prodotto.",
        "Bits resolve in different cycles → incoherent word. Async FIFO with Gray pointers, or a control handshake. 2-FF MTBF > product life."
      ),
    },
  ],
  verification: [
    {
      question: loc(
        "LEC fallisce post-ECO metal-only. Cosa controlli per primo?",
        "LEC fails after a metal-only ECO. What do you check first?"
      ),
      answer: loc(
        "Compare point / key point mismatch, spare cell non modellata, invertito un clock per sbaglio, constant-0/1 su tie. Metal-only non dovrebbe cambiare la funzione: se LEC fail, hai toccato più del metal o il netlist di riferimento è vecchio.",
        "Compare-point / key-point mismatch, unmodeled spare cell, accidentally inverted clock, constant-0/1 on a tie. Metal-only should not change function: if LEC fails, you touched more than metal or the reference netlist is stale."
      ),
    },
    {
      question: loc(
        "Formal vs simulazione: quando il PD deve esigere il formal?",
        "Formal vs simulation: when must PD demand formal?"
      ),
      answer: loc(
        "Equivalenza RTL↔gate (LEC) sempre. Proprietà (one-hot, AXI, mutex) sul controllo critico. La sim campiona; il formal copre lo spazio legale. Handoff senza LEC = bug di sintesi firmati come layout.",
        "RTL↔gate equivalence (LEC) always. Properties (one-hot, AXI, mutex) on critical control. Sim samples; formal covers the legal space. Handoff without LEC = synthesis bugs signed as layout."
      ),
    },
  ],
  synthesis: [
    {
      question: loc(
        "Max transition violato: perché il delay del .lib è inaffidabile?",
        "Max transition violated: why is the .lib delay unreliable?"
      ),
      answer: loc(
        "Le tabelle NLDM/CCS sono caratterizzate dentro un range di slew/Cload. Fuori range il tool estrapola. DRV=0 prima di credere al WNS. Fix: upsize driver, buffer, ridurre C (fanout).",
        "NLDM/CCS tables are characterized inside a slew/Cload range. Outside, the tool extrapolates. DRV=0 before you believe WNS. Fix: upsize driver, buffer, reduce C (fanout)."
      ),
    },
    {
      question: loc(
        "WNS −4 ps, TNS −60 ns dopo synth: che lavoro è?",
        "WNS −4 ps, TNS −60 ns after synth: what kind of work is that?"
      ),
      answer: loc(
        "Volume: migliaia di path. Non un buffer. Si rivede FO4/RTL, constraint, clock gating, o si accetta più area (LVT). WNS piccolo + TNS enorme è il caso da massa, non da eroe sul path 1.",
        "Volume: thousands of paths. Not one buffer. Revisit FO4/RTL, constraints, clock gating, or spend area (LVT). Tiny WNS + huge TNS is mass work, not heroics on path 1."
      ),
    },
  ],
  floorplan: [
    {
      question: loc(
        "Soft blockage vs hard vs partial: quando quale?",
        "Soft vs hard vs partial blockage: when which?"
      ),
      answer: loc(
        "Hard: zero celle (analog, macro keepout stretto). Soft: preferenza, il placer può entrare se congestionato. Partial: solo buffer/inverter (halo macro) per non creare un muro di logica ma permettere CTS/DRV fix.",
        "Hard: zero cells (analog, tight macro keepout). Soft: preference; placer may enter if congested. Partial: buffers/inverters only (macro halo) so you do not build a logic wall but still allow CTS/DRV fixes."
      ),
    },
    {
      question: loc(
        "Come usi le flyline al floorplan review?",
        "How do you use flylines in a floorplan review?"
      ),
      answer: loc(
        "Archi lunghi = macro lontana dal suo controller. Incroci densi = congestion preannunciata. IO lontani dal bump correlato = RDL lungo. Si muovono macro prima di place, non dopo.",
        "Long arcs = macro far from its controller. Dense crossings = congestion advertised. IO far from matching bumps = long RDL. Move macros before place, not after."
      ),
    },
    {
      question: loc(
        "Utilization 71% sul die da 16 mm²: è un buon numero?",
        "71% utilization on a 16 mm² die: is that a good number?"
      ),
      answer: loc(
        "Non lo sai finché non dici se è CORE o DIE. U si misura sul core. Il die include IO, seal, scribe. 71% die può essere 85%+ core → overcrowded. Chiedi A_std+A_macro e A_core.",
        "You do not know until you say CORE or DIE. U is measured on core. Die includes IO, seal, scribe. 71% die can be 85%+ core → overcrowded. Ask for A_std+A_macro and A_core."
      ),
    },
  ],
  pdn: [
    {
      question: loc(
        "Perché un via singolo su uno strap di 2 A è inaccettabile?",
        "Why is a single via on a 2 A strap unacceptable?"
      ),
      answer: loc(
        "J_via >> J_metal. EM del via è spesso il first fail. Double/via array, redundancy. Stesso discorso per via ladder M1→M9: ogni cut è un collo di bottiglia.",
        "J_via >> J_metal. Via EM is often the first fail. Double/via arrays, redundancy. Same for M1→M9 via ladders: every cut is a bottleneck."
      ),
    },
    {
      question: loc(
        "Decap: perché '5% di area' non è un signoff?",
        "Decap: why is '5% of area' not a signoff?"
      ),
      answer: loc(
        "Serve C ≥ I Δt / ΔV vicino all'hotspot (ESR/ESL). 5% è euristica. Troppa cap = inrush a power-on. Si simula dynamic IR e startup, non si riempie il die di filler e si firma.",
        "You need C ≥ I Δt / ΔV near the hotspot (ESR/ESL). 5% is a heuristic. Too much cap = power-on inrush. Simulate dynamic IR and startup; do not fill the die with filler and sign."
      ),
    },
  ],
  placement: [
    {
      question: loc(
        "Displacement medio 8 µm dopo legalization: ti preoccupi?",
        "Mean displacement 8 µm after legalization: do you worry?"
      ),
      answer: loc(
        "Sì se i FF del critical path sono in quella coda. 8 µm a 7 nm è wire delay non banale. Si rivede density target, blockage, o si aumenta padding. Timing pre-legal era ottimistico.",
        "Yes if critical-path FFs are in that tail. 8 µm at 7 nm is non-trivial wire delay. Revisit density target, blockage, or padding. Pre-legal timing was optimistic."
      ),
    },
    {
      question: loc(
        "Density target 0.7 vs 0.9: cosa stai comprando?",
        "Density target 0.7 vs 0.9: what are you buying?"
      ),
      answer: loc(
        "0.9 è area, 0.7 è routing e opt. A 7 nm 0.9 locale è overflow. Si usa density screen sulle hotspot, non un 0.9 globale 'per il die size'.",
        "0.9 is area, 0.7 is routing and opt. At 7 nm local 0.9 is overflow. Use density screens on hotspots, not a global 0.9 'for die size'."
      ),
    },
  ],
  cts: [
    {
      question: loc(
        "Min pulse width fail post-CTS: cause tipiche?",
        "Min pulse width fail post-CTS: typical causes?"
      ),
      answer: loc(
        "Duty distortion (CLKINV rise≠fall accumulati), insertion delay enorme, clock gating check sull'ICG, SI sul clock. Fix: bilanciare rise/fall, less levels, NDR, non usare INV datapath.",
        "Duty distortion (accumulated CLKINV rise≠fall), huge insertion delay, clock-gating check on ICG, SI on clock. Fix: balance rise/fall, fewer levels, NDR, do not use datapath INV."
      ),
    },
    {
      question: loc(
        "OCC per at-speed: perché CTS deve vederlo come root?",
        "OCC for at-speed: why must CTS see it as a root?"
      ),
      answer: loc(
        "Lancia pulse a f funzionale. Mux/sync glitch = doppio clock. Latency e skew in capture mode sono STA. Trattarlo come datapath è un fail di test e di silicon.",
        "It launches pulses at functional f. Mux/sync glitch = double clock. Latency and skew in capture mode are STA. Treating it as datapath fails the test and silicon."
      ),
    },
  ],
  routing: [
    {
      question: loc(
        "Global route overflow 8% su M2, detailed fallisce. Piano?",
        "Global route overflow 8% on M2, detailed fails. Plan?"
      ),
      answer: loc(
        "Non insistere sul detailed. Spread place, layer directive su M3/M4, sposta macro, riduci U locale, HFNS sui net peggiori. 8% overflow globale non 'si sistema in S&R'.",
        "Do not keep hammering detailed. Spread place, layer directives to M3/M4, move macros, cut local U, HFNS on the worst nets. 8% global overflow is not 'fixed in S&R'."
      ),
    },
    {
      question: loc(
        "Antenna: perché allargare il metal peggiora il ratio?",
        "Antenna: why does widening metal worsen the ratio?"
      ),
      answer: loc(
        "Ratio = A_metal/A_gate. Allargare cresce A_metal. Fix: jumper (taglia l'area esposta a quel layer) o diodo. Il deck foundry è cumulativo per processo.",
        "Ratio = A_metal/A_gate. Widening grows A_metal. Fix: jumper (cuts exposed area at that layer) or diode. The foundry deck is cumulative per process."
      ),
    },
  ],
  layout: [
    {
      question: loc(
        "Perché lo SPEF senza fill sbaglia il signoff?",
        "Why does SPEF without fill break signoff?"
      ),
      answer: loc(
        "Il fill cambia Cground e coupling. WNS può muoversi di decine di ps. Signoff extraction include fill grounded/floating come da GDS merged.",
        "Fill changes Cground and coupling. WNS can move tens of ps. Signoff extraction includes grounded/floating fill as in merged GDS."
      ),
    },
    {
      question: loc(
        "Slotting su uno strap largo: a cosa serve?",
        "Slotting a fat strap: what is it for?"
      ),
      answer: loc(
        "CMP dishing e stress/via cracking su metal larghi. È DFM di processo, non SI. Slotting sbagliato crea DRC density o EM peggiore: si segue il rule foundry.",
        "CMP dishing and stress/via cracking on fat metal. It is process DFM, not SI. Bad slotting creates density DRC or worse EM: follow the foundry rule."
      ),
    },
  ],
  sta: [
    {
      question: loc(
        "Spiega CRPR su un path con 6 buffer comuni e 2 divergenti.",
        "Explain CRPR on a path with 6 shared buffers and 2 diverging."
      ),
      answer: loc(
        "OCV mette late su launch e early su capture anche sui 6 comuni: doppio pessimismo. CRPR calcola il credit sul common e lo aggiunge allo slack (linea nel report). I 2 divergenti restano derated.",
        "OCV puts late on launch and early on capture even on the 6 shared: double pessimism. CRPR computes credit on the common and adds it to slack (a line in the report). The 2 diverging stay derated."
      ),
    },
    {
      question: loc(
        "Un path ha −12 ps setup, SI delta +35 ps, cell delay 180 ps. Cosa fai?",
        "A path has −12 ps setup, SI delta +35 ps, cell delay 180 ps. What do you do?"
      ),
      answer: loc(
        "Non VT-swap per 12 ps. Il 35 ps SI è il problema: spacing/shield/layer. Se dopo SI-clean resta −12, allora size o useful skew. Leggere il report batte l'istinto di 'upsize tutto'.",
        "Do not VT-swap for 12 ps. The 35 ps SI is the problem: spacing/shield/layer. If after SI-clean −12 remains, then size or useful skew. Reading the report beats the instinct to 'upsize everything'."
      ),
    },
    {
      question: loc(
        "Scan shift hold vs capture setup: quale arma per quale mode?",
        "Scan shift hold vs capture setup: which weapon for which mode?"
      ),
      answer: loc(
        "Shift hold: lock-up inter-domain + delay intra-domain. Capture at-speed: size/SI/skew come il funzionale. Tshift basso non salva hold. False path su SE uccide il test.",
        "Shift hold: inter-domain lock-up + intra-domain delay. At-speed capture: size/SI/skew like functional. Low Tshift does not save hold. False-pathing SE kills the test."
      ),
    },
    {
      question: loc(
        "set_multicycle_path 4 -setup senza toccare hold. Rischio?",
        "set_multicycle_path 4 -setup without touching hold. Risk?"
      ),
      answer: loc(
        "Dipende dal tool: a volte hold diventa 4 cicli (race mascherate). Default sano: -hold 1, contratto architetturale documentato, prove in sim/formal.",
        "Depends on the tool: sometimes hold becomes 4 cycles (hidden races). Healthy default: -hold 1, documented architectural contract, sim/formal proof."
      ),
    },
  ],
  pv: [
    {
      question: loc(
        "Coloring conflict su M2 (double patterning). Cosa significa?",
        "Coloring conflict on M2 (double patterning). What does it mean?"
      ),
      answer: loc(
        "Due shape adiacenti non bipartite-colorabili (odd cycle). Il router deve spaccheggiare o allargare. Non è un waiver da bar. A 7 nm è DRC di processo, non un warning CAD.",
        "Two adjacent shapes are not bipartite-colorable (odd cycle). The router must split or spread. Not a hallway waiver. At 7 nm it is process DRC, not a CAD warning."
      ),
    },
    {
      question: loc(
        "Innovus DRC=0, Calibre 186 color + 22k via-1. Chi ha ragione?",
        "Innovus DRC=0, Calibre 186 color + 22k via-1. Who is right?"
      ),
      answer: loc(
        "Calibre (deck foundry). P&R usa un subset. Signoff è coloring, DFM, antenna, density, litho sul GDS merged. GKC guarda Calibre.",
        "Calibre (foundry deck). P&R uses a subset. Signoff is coloring, DFM, antenna, density, litho on merged GDS. GKC watches Calibre."
      ),
    },
  ],
  power: [
    {
      question: loc(
        "Static IR 3%, dynamic 11% per 80 ps. Passa il signoff?",
        "Static IR 3%, dynamic 11% for 80 ps. Does signoff pass?"
      ),
      answer: loc(
        "Dipende dal limite (spesso 10% e <500 ps). 11% è over: più decap vicino all'hotspot, mesh più densa, ridurre simultaneità (clock spread). 80 ps è corto ma se coincide col clock edge dello STA, il delay cell è già sbagliato.",
        "Depends on the limit (often 10% and <500 ps). 11% is over: more decap near the hotspot, denser mesh, reduce simultaneity (clock spread). 80 ps is short but if it hits the STA clock edge, cell delay is already wrong."
      ),
    },
    {
      question: loc(
        "J via clock 1.6×Jmax, n=2. Ordine di MTTF vs 10 anni?",
        "Clock via J 1.6×Jmax, n=2. Order of MTTF vs 10 years?"
      ),
      answer: loc(
        "MTTF ∝ J^(−n) → 10/1.6² ≈ 3.9 anni. Via array, non activity finta a 0.01. Power EM e signal EM sono due report.",
        "MTTF ∝ J^(−n) → 10/1.6² ≈ 3.9 years. Via arrays, not fake activity 0.01. Power EM and signal EM are two reports."
      ),
    },
  ],
  package: [
    {
      question: loc(
        "SSO su 32 DDR che commutano a 1 V/200 ps, L=2 nH. Ordine di Vbounce?",
        "SSO on 32 DDR switching at 1 V/200 ps, L=2 nH. Order of Vbounce?"
      ),
      answer: loc(
        "I ≈ C·dv/dt per pin; anche senza C esatto, V=L·di/dt scala con N. È il motivo del power/ground bump ratio alto sul PHY e del on-die decap. I numeri precisi stanno nel modello IBIS/PKG; l'ordine di grandezza è centinaia di mV se N è grande e L non è flip-chip.",
        "I ≈ C·dv/dt per pin; even without exact C, V=L·di/dt scales with N. That is why the PHY has a high power/ground bump ratio and on-die decap. Precise numbers live in IBIS/PKG models; order of magnitude is hundreds of mV if N is large and L is not flip-chip."
      ),
    },
    {
      question: loc(
        "Bump map già tapeout del substrate. Cosa ti resta sul die per SSO?",
        "Bump map already at substrate tapeout. What is left on the die for SSO?"
      ),
      answer: loc(
        "Decap sotto il PHY, slew/drive, stagger enable, RDL corta. Lpkg resta: mitigazione, non cancellazione. Per questo il bump map è floorplan day-1.",
        "Decap under the PHY, slew/drive, stagger enables, short RDL. Lpkg remains: mitigation, not erasure. That is why the bump map is day-1 floorplan."
      ),
    },
  ],
  tapeout: [
    {
      question: loc(
        "Chi può veto-are un GKC e con quale evidenza?",
        "Who can veto a GKC and with what evidence?"
      ),
      answer: loc(
        "Qualsiasi disciplina con un check rosso: STA WNS<0, DRC≠0, LVS not CORRECT, IR/EM fail, DFT coverage sotto target, UPF mismatch, package DRC. Evidenza = log foundry/tool, non una slide. Un 'va beh, 3 violation' non è un GKC.",
        "Any discipline with a red check: STA WNS<0, DRC≠0, LVS not CORRECT, IR/EM fail, DFT coverage under target, UPF mismatch, package DRC. Evidence = foundry/tool log, not a slide. 'Eh, 3 violations' is not a GKC."
      ),
    },
    {
      question: loc(
        "Metal-only: come realizzi un AND2 se non hai AND2 spare?",
        "Metal-only: how do you build an AND2 if you have no AND2 spare?"
      ),
      answer: loc(
        "NAND2 spare + INV spare. Mux da NAND. Polarità con INV. Nuova cella in un hole = ECO funzionale, slitta BTO. Poi LEC+ATPG+PV sul golden nuovo.",
        "Spare NAND2 + spare INV. Mux from NAND. Polarity with INV. A new cell in a hole = functional ECO, BTO slips. Then LEC+ATPG+PV on the new golden."
      ),
    },
  ],
};

export function allFlashcards(): { stage: StageId; question: Localized; answer: Localized }[] {
  const out: { stage: StageId; question: Localized; answer: Localized }[] = [];
  (Object.keys(extraInterview) as StageId[]).forEach((id) => {
    extraInterview[id].forEach((q) => out.push({ stage: id, ...q }));
  });
  return out;
}
