import { loc, type Localized } from "@/i18n/context";
import type { StageId } from "./stages";

export interface StageEssay {
  kicker: Localized;
  paragraphs: Localized[];
}

/** Long-form teaching essays — interview mental models, not slogans. */
export const stageEssays: Record<StageId, StageEssay> = {
  rtl: {
    kicker: loc("Mental model da colloquio", "Interview mental model"),
    paragraphs: [
      loc(
        "Il physical design eredita i peccati del RTL. Un latch inferito (always_comb incompleto) non è un warning di lint: è un path trasparente che STA tratterà in modo diverso dalla simulazione, LEC può fallire, e in silicon diventa un hold/setup non riproducibile. SpyGlass W415a / VC SpyGlass lo prende; un senior lo cerca a occhio nei default assignment e nei case senza default. Stesso discorso per i clock gated a mano con AND sul clock: glitch. Si usa ICG (latch + AND) inserita da sintesi con enable sincrono.",
        "Physical design inherits RTL sins. An inferred latch (incomplete always_comb) is not a lint warning: it is a transparent path STA will treat unlike simulation, LEC may fail, and silicon becomes irreproducible hold/setup. SpyGlass W415a / VC SpyGlass catches it; a senior spots missing defaults by eye. Same for hand-AND clock gates: glitch. Use ICG (latch + AND) inserted by synthesis with a synchronous enable."
      ),
      loc(
        "CDC: un bus multi-bit con 2-FF per bit è un bug da libro di testo (ogni bit si risolve in un ciclo diverso → valore incoerente). La risposta da colloquio è: async FIFO con puntatori Gray, o handshake valid/ready con sync sul control, mai sui data. MTBF del 2-FF deve superare la vita del prodotto: MTBF = exp(tr/τ)/(fclk·fdata·T0). Se ti chiedono i numeri, τ è nel .lib del FF (o datasheet foundry), tr è un periodo meno Tsu.",
        "CDC: a multi-bit bus with a 2-FF per bit is a textbook bug (each bit resolves in a different cycle → incoherent value). The interview answer is: async FIFO with Gray pointers, or valid/ready handshake with sync on control, never on data. 2-FF MTBF must exceed product life: MTBF = exp(tr/τ)/(fclk·fdata·T0). If they want numbers, τ is in the FF .lib (or foundry datasheet), tr is a period minus Tsu."
      ),
      loc(
        "DFT readiness a RTL: ogni FF scan-able, nessun lock sul test, memorie con wrap MBIST, niente combo loops, clock controllabili da PLL bypass. Se il FE consegna un netlist senza scan, il PD non 'aggiunge scan in P&R' come nel 2005: lo scan è un'operazione di sintesi/DFT compiler con LEC. Occupazione tipica scan: +5–12% area, + hold paths da chiudere dopo CTS.",
        "DFT readiness at RTL: every FF scan-able, no test locks, memories with MBIST wrap, no combo loops, clocks controllable via PLL bypass. If FE delivers a netlist without scan, PD does not 'add scan in P&R' like 2005: scan is a synthesis/DFT-compiler step with LEC. Typical scan overhead: +5–12% area, plus hold paths to close after CTS."
      ),
    ],
  },
  verification: {
    kicker: loc("Cosa un PD deve esigere dal FE", "What PD must demand from FE"),
    paragraphs: [
      loc(
        "Formal vs sim: la sim campiona. Il formal prova proprietà su TUTTI gli input legali (bounded o unbounded se converge). Uso classico: one-hot degli stadi FSM, AXI handshake (valid non cala senza ready), mutex di un arbiter, no deadlock su credit counter. Se il formal esplode, si restringe con assume. Un PD che accetta un handoff senza LEC RTL↔gate sta firmando un bug di sintesi come se fosse layout.",
        "Formal vs sim: sim samples. Formal proves properties over ALL legal inputs (bounded, or unbounded if it converges). Classics: FSM one-hot, AXI handshake (valid does not drop without ready), arbiter mutex, no deadlock on a credit counter. If formal explodes, constrain with assume. A PD who accepts a handoff without RTL↔gate LEC is signing a synthesis bug as if it were layout."
      ),
      loc(
        "CDC signoff: SpyGlass/Questa CDC + recensioni. Ogni crossing ha uno schema nominato (2-FF, FIFO, handshake). RDC è il gemello sul reset: un reset async rilasciato vicino a un clock edge è un 2-FF di fatto. I reset sync-deassert sono lo standard ASIC proprio per questo.",
        "CDC signoff: SpyGlass/Questa CDC plus reviews. Every crossing has a named scheme (2-FF, FIFO, handshake). RDC is the reset twin: an async reset released near a clock edge is a 2-FF in disguise. Sync-deassert resets are the ASIC standard for this reason."
      ),
    ],
  },
  synthesis: {
    kicker: loc("Dal Verilog alle celle Liberty", "From Verilog to Liberty cells"),
    paragraphs: [
      loc(
        "La sintesi mappa RTL su .lib: sceglie Vt (HVT/SVT/LVT) e drive (X1–X32) per chiudere un WNS target con area/power. NLDM è una tabella slew×Cload; a 7 nm è troppo rozza (SI, waveform reali) → CCS/LVF. Un path con max_tran violato non ha un delay 'vero': il .lib è fuori caratterizzazione. Per questo DRV=0 è un exit criterion, non un nice-to-have.",
        "Synthesis maps RTL onto .lib: it picks Vt (HVT/SVT/LVT) and drive (X1–X32) to close a WNS target under area/power. NLDM is a slew×Cload table; at 7 nm that is too crude (SI, real waveforms) → CCS/LVF. A path with max_tran violated has no 'true' delay: the .lib is out of characterization. That is why DRV=0 is an exit criterion, not a nice-to-have."
      ),
      loc(
        "WNS vs TNS: WNS è il path peggiore; TNS è il lavoro totale. Un WNS di −5 ps con TNS di −80 ns significa migliaia di path: non si sistema con un buffer. Un WNS di −80 ps con TNS di −80 ps è un solo path: VT-swap o retime. Al colloquio vogliono sentire questa distinzione operativa.",
        "WNS vs TNS: WNS is the worst path; TNS is total work. WNS of −5 ps with TNS of −80 ns means thousands of paths: one buffer will not fix it. WNS of −80 ps with TNS of −80 ps is a single path: VT-swap or retime. Interviewers want this operational distinction."
      ),
      loc(
        "UPF in sintesi: isolation e LS devono esistere nel netlist prima del PD. CLP verifica corrispondenza. Se il PD inserisce LS 'a mano' in Innovus, LEC e UPF divergono. Il golden power intent è IEEE 1801, non un commento nel README.",
        "UPF in synthesis: isolation and LS must exist in the netlist before PD. CLP checks correspondence. If PD inserts LS 'by hand' in Innovus, LEC and UPF diverge. Golden power intent is IEEE 1801, not a README comment."
      ),
    ],
  },
  floorplan: {
    kicker: loc("Il 70% del PPA si decide qui", "70% of PPA is decided here"),
    paragraphs: [
      loc(
        "Macro placement: SRAM in bank verso il controller, pin verso il canale, halo 2–5 µm, niente macro nel centro se puoi (tagliano i canali). PLL/analog lontano da digital noisy e da IO switching. SERDES sul bordo verso il bump correlato. Flyline (ratsnest) dopo il primo pass: se vedi un arco che attraversa tutto il die, hai già perso.",
        "Macro placement: SRAM in a bank toward the controller, pins facing the channel, 2–5 µm halo, no macros in the center if you can (they cut channels). PLL/analog away from noisy digital and switching IO. SERDES on the edge toward its bump. Flylines (ratsnest) after the first pass: if you see an arc crossing the whole die, you already lost."
      ),
      loc(
        "Soft vs hard macro: soft è RTL ancora da implementare (flessibile, costa P&R); hard è GDS fissato (SRAM compiler, analog). Un hard macro è un buco nel routing da M1 a Mn interni: i layer sopra possono passare, i pin no. Per questo i pin devono guardare il canale, non il muro della macro vicina.",
        "Soft vs hard macro: soft is RTL still to implement (flexible, costs P&R); hard is fixed GDS (SRAM compiler, analog). A hard macro is a routing hole from internal M1 to Mn: upper layers may pass, pins will not. That is why pins must face the channel, not the neighboring macro wall."
      ),
      loc(
        "Die vs core: utilization si misura sul CORE. Il die include IO ring, seal, scribe keepout. Un interviewer che chiede 'utilization 70%' e tu rispondi 'die 70%' hai già sbagliato l'unità. Stima: A_core = (A_std + A_macro) / U_target. Poi aggiungi IO.",
        "Die vs core: utilization is measured on the CORE. Die includes IO ring, seal, scribe keepout. An interviewer who asks '70% utilization' and you answer 'die 70%' already used the wrong unit. Estimate: A_core = (A_std + A_macro) / U_target. Then add IO."
      ),
    ],
  },
  pdn: {
    kicker: loc("La corrente non è un dettaglio", "Current is not a detail"),
    paragraphs: [
      loc(
        "Primary PG: bump/pad → RDL/AP → ring → mesh M8/M9 → straps → via ladder → M1 rail → cell. Secondary: VDD_SW dopo l'header. Un floating rail è un LVS/ERC e un IR infinito. verify_pg_connection è un check, non una speranza.",
        "Primary PG: bump/pad → RDL/AP → ring → M8/M9 mesh → straps → via ladder → M1 rail → cell. Secondary: VDD_SW after the header. A floating rail is LVS/ERC and infinite IR. verify_pg_connection is a check, not a hope."
      ),
      loc(
        "Header PMOS (VDD→virtual VDD) è lo standard: noise sul ground globale resta pulito. Footer NMOS (virtual VSS) è più piccolo ma tira bounce sul return path. Inrush: accendere 50k gate insieme è un dI/dt da package. Si daisy-chainano gli switch (o fishbone) con delay deliberato. UPF descrive la sequence.",
        "PMOS header (VDD→virtual VDD) is the standard: noise on global ground stays clean. NMOS footer (virtual VSS) is smaller but slams bounce onto the return path. Inrush: turning on 50k gates at once is package dI/dt. Daisy-chain (or fishbone) the switches with deliberate delay. UPF describes the sequence."
      ),
    ],
  },
  placement: {
    kicker: loc("HPWL, congestion, timing — tre cost function", "HPWL, congestion, timing — three cost functions"),
    paragraphs: [
      loc(
        "Il placer analitico minimizza HPWL con densità. Timing-driven alza il peso dei net con slack basso: le celle del critical path stanno vicine. Senza timing-driven, un wirelength-only placer distende il path e il WNS post-route esplode. Congestion: overflow GCell > ~5% dopo place è un red flag — non sperare che il detailed router 'trovi un buco'.",
        "The analytical placer minimizes HPWL under density. Timing-driven raises the weight of low-slack nets: critical-path cells sit together. Without timing-driven, a wirelength-only placer stretches the path and post-route WNS explodes. Congestion: GCell overflow > ~5% after place is a red flag — do not hope the detailed router 'finds a hole'."
      ),
      loc(
        "Legalization: snap a SITE, no overlap, row flip per condividere rail VDD/VSS. Se la legalization sposta un FF di 20 µm, il timing globale era una bugia. Per questo si guarda il displacement report. Tap ogni 20–50 µm (DRM), endcap a fine row: non sono opzionali, sono DRC/latch-up.",
        "Legalization: snap to SITE, no overlap, row flip to share VDD/VSS rails. If legalization moves an FF 20 µm, global timing was a lie. That is why you read the displacement report. Taps every 20–50 µm (DRM), endcaps at row ends: not optional — DRC/latch-up."
      ),
    ],
  },
  cts: {
    kicker: loc("Skew è un budget, non un errore", "Skew is a budget, not a mistake"),
    paragraphs: [
      loc(
        "Tree vs mesh: tree basso power, skew 30–80 ps, OCV alto (path lunghi). Mesh: griglia ridondante, skew <15 ps, power 2–3×, per CPU multi-GHz. Useful skew: ritardi il capture di un path setup-critical, ma quel ritardo è launch del path successivo — è zero-sum sulla pipeline. NVIDIA/Apple vivono di questo sopra i 2 GHz.",
        "Tree vs mesh: tree is low power, 30–80 ps skew, high OCV (long paths). Mesh: redundant grid, skew <15 ps, 2–3× power, for multi-GHz CPUs. Useful skew: delay capture of a setup-critical path, but that delay is launch of the next path — zero-sum across the pipeline. NVIDIA/Apple live on this above 2 GHz."
      ),
      loc(
        "CTS vs CTO: CTS costruisce; CTO ritocca size/route senza rebuild. In Innovus, ccopt_design fa entrambi. HFNS non è CTS: reset e scan_en vogliono un albero di buffer, non skew zero. Clock cells: CLKBUF/CLKINV, non BUF datapath (duty cycle e variation).",
        "CTS vs CTO: CTS builds; CTO tweaks size/route without rebuild. In Innovus, ccopt_design does both. HFNS is not CTS: reset and scan_en want a buffer tree, not zero skew. Clock cells: CLKBUF/CLKINV, not datapath BUF (duty cycle and variation)."
      ),
    ],
  },
  routing: {
    kicker: loc("Global assegna regioni, detailed disegna geometria", "Global assigns regions, detailed draws geometry"),
    paragraphs: [
      loc(
        "Global routing: GCell grid, capacity vs demand, layer assignment. Detailed: track, via, DRC. Search & repair itera rip-up. NDR su clock (double spacing, shielding VSS) costa capacity: se lo metti su troppi net, congestion. Preferred direction H/V per layer: violare costa via extra e yield.",
        "Global routing: GCell grid, capacity vs demand, layer assignment. Detailed: tracks, vias, DRC. Search & repair iterates rip-up. NDR on clock (double spacing, VSS shield) costs capacity: put it on too many nets and you congest. Preferred H/V per layer: violating costs extra vias and yield."
      ),
      loc(
        "Crosstalk: Ccoupling/Ctotal. Opposite switch → setup hit; same switch → hold hit + glitch su net quiete. Fix: spacing, shield, layer change, driver upsize (slew più veloce, meno finestra di coupling). SI-aware STA (PrimeTime SI / Tempus) è signoff, non un optional.",
        "Crosstalk: Ccoupling/Ctotal. Opposite switch → setup hit; same switch → hold hit + glitch on quiet nets. Fix: spacing, shield, layer change, driver upsize (faster slew, smaller coupling window). SI-aware STA (PrimeTime SI / Tempus) is signoff, not optional."
      ),
    ],
  },
  layout: {
    kicker: loc("CMP non perdona densità a macchie", "CMP does not forgive blotchy density"),
    paragraphs: [
      loc(
        "Fill dummy per ρ_min–ρ_max in finestre (es. 100 µm). Grounded vs floating: grounded aumenta Cground (più delay, meno SI); floating accoppia. Lo SPEF di signoff DEVE includere il fill reale, altrimenti il WNS in lab non matcha PrimeTime. Seal ring continuo: umidità, crack, latch-up. Slotting/cheesing su fili larghi per stress e CMP.",
        "Dummy fill for ρ_min–ρ_max in windows (e.g. 100 µm). Grounded vs floating: grounded raises Cground (more delay, less SI); floating couples. Signoff SPEF MUST include real fill, or lab WNS will not match PrimeTime. Continuous seal ring: moisture, crack, latch-up. Slotting/cheesing on fat wires for stress and CMP."
      ),
    ],
  },
  sta: {
    kicker: loc("Il round che decide il livello dell'offerta", "The round that sets the offer level"),
    paragraphs: [
      loc(
        "Setup = max path: data late, clock capture early. Hold = min path: data early, clock capture late. Corner: SS/lowV/hot per setup (con temperature inversion: a volte SS-cold). FF/highV/cold per hold. OCV derata in quelle direzioni; CPPR toglie il doppio conteggio sul common clock. AOCV scala con depth/distance; POCV/LVF è σ statistica a 7/5/3 nm.",
        "Setup = max path: data late, capture clock early. Hold = min path: data early, capture clock late. Corner: SS/lowV/hot for setup (with temperature inversion: sometimes SS-cold). FF/highV/cold for hold. OCV derates in those directions; CPPR removes double-count on the common clock. AOCV scales with depth/distance; POCV/LVF is statistical σ at 7/5/3 nm."
      ),
      loc(
        "report_timing è il linguaggio. Vuoi: slack, startpoint/endpoint, clock launch/capture, CRPR credit, derate, SI delta. Un path con SI 40 ps e logic 200 ps è un problema di routing, non di VT-swap. Un path con 40 livelli di logica è un problema RTL. Il senior legge il report e sceglie l'arma: size, buffer, useful skew, MCP legittimo, o 'torna al FE'.",
        "report_timing is the language. You want: slack, startpoint/endpoint, launch/capture clocks, CRPR credit, derate, SI delta. A path with 40 ps SI and 200 ps logic is a routing problem, not a VT-swap. A path with 40 logic levels is an RTL problem. The senior reads the report and picks the weapon: size, buffer, useful skew, legitimate MCP, or 'go back to FE'."
      ),
      loc(
        "Hold si chiude DOPO CTS. Pre-CTS il clock è ideale: i buffer di hold sono spazzatura. Setup si lavora da place in poi. IR-aware STA applica voltage map per istanza: un hotspot IR è un SS locale. Senza di esso firmi un WNS ottimistico.",
        "Hold is closed AFTER CTS. Pre-CTS the clock is ideal: hold buffers are garbage. Setup is worked from place onward. IR-aware STA applies a per-instance voltage map: an IR hotspot is local SS. Without it you sign an optimistic WNS."
      ),
      loc(
        "DFT è STA: scan_shift (hold brutale, Tclk irrilevante), capture at-speed (setup a f funzionale), mbist. Lock-up latch sugli stitch inter-domain; delay cell in-domain. ATPG e coverage sul netlist ECO-finale. MCP: setup N, hold 1, contratto architetturale — false path su scan_en o AXI ready è un bug.",
        "DFT is STA: scan_shift (brutal hold, Tclk irrelevant), at-speed capture (setup at functional f), mbist. Lock-up latches on inter-domain stitches; delay cells in-domain. ATPG and coverage on the final ECO netlist. MCP: setup N, hold 1, architectural contract — a false path on scan_en or AXI ready is a bug."
      ),
    ],
  },
  pv: {
    kicker: loc("Geometria vs circuito", "Geometry vs circuit"),
    paragraphs: [
      loc(
        "DRC: width, spacing, enclosure, density, antenna, coloring (multi-patterning). LVS: connectivity e device count. Puoi essere DRC-clean e LVS-short. ERC: floating gate, missing tap. Signoff sul GDS merged (fill + seal + IO), non sul database P&R. Waivers: scritti, firmati, mai 'lo sappiamo'.",
        "DRC: width, spacing, enclosure, density, antenna, coloring (multi-patterning). LVS: connectivity and device count. You can be DRC-clean and LVS-short. ERC: floating gate, missing tap. Signoff on merged GDS (fill + seal + IO), not the P&R database. Waivers: written, signed, never 'we know'."
      ),
      loc(
        "DFM a 7 nm: coloring = 2-colorability (odd cycle = fail). Via doubling su clock/PG per EM e yield; globale satura i track. Density window e CMP fill (grounded vs floating) cambiano C — SPEF sul GDS merged. Litho hotspot / PV-band fuori spec si fixano in layout. P&R DRC=0 su deck ridotto non è Calibre.",
        "DFM at 7 nm: coloring = 2-colorability (odd cycle = fail). Via doubling on clock/PG for EM and yield; global doubling saturates tracks. Density windows and CMP fill (grounded vs floating) change C — SPEF on merged GDS. Litho hotspots / PV-band out of spec are fixed in layout. P&R DRC=0 on a reduced deck is not Calibre."
      ),
    ],
  },
  power: {
    kicker: loc("Joule, non solo watt medi", "Joules, not just average watts"),
    paragraphs: [
      loc(
        "Static IR = Iavg·R. Dynamic = C e L nel tempo. VCD cycle selection: WORST_POWER e WORST_dI/dt. EM: Black MTTF = A·J^(−n)·exp(Ea/kT). Power EM è DC su straps; signal EM è RMS/peak su clock. 10 anni @ Tmax. Decap: ΔV ≈ I·Δt/C. Troppa decap = inrush a power-on.",
        "Static IR = Iavg·R. Dynamic = C and L in time. VCD cycle selection: WORST_POWER and WORST_dI/dt. EM: Black MTTF = A·J^(−n)·exp(Ea/kT). Power EM is DC on straps; signal EM is RMS/peak on clocks. 10 years @ Tmax. Decap: ΔV ≈ I·Δt/C. Too much decap = power-on inrush."
      ),
      loc(
        "IR-aware STA: voltage map per istanza, hotspot = SS locale. BIST può tirare 1.5–2× corrente: scenario di test nel signoff. Activity onesta sul clock (≈2 edge/ciclo). J via 1.6× e n=2 ⇒ MTTF ~4 anni su un target da 10.",
        "IR-aware STA: per-instance voltage map, hotspot = local SS. BIST can draw 1.5–2× current: a test scenario in signoff. Honest clock activity (≈2 edges/cycle). Via J 1.6× and n=2 ⇒ MTTF ~4 years on a 10-year target."
      ),
    ],
  },
  package: {
    kicker: loc("Il bump map è floorplan", "The bump map is floorplan"),
    paragraphs: [
      loc(
        "Flip-chip: corrente entra dall'area, non dal bordo. I bump VDD/VSS dettano gli hotspot IR. Deciderli a fine PD è rifare il chip. SSO: V = Lpkg·di/dt sugli IO. RDL redistribuisce pad→bump. Wire-bond è per IO bassi e L alta. Co-design PKG dal day-1 con il team package.",
        "Flip-chip: current enters from the area, not the edge. VDD/VSS bumps dictate IR hotspots. Deciding them at the end of PD is redoing the chip. SSO: V = Lpkg·di/dt on IO. RDL redistributes pad→bump. Wire-bond is for low IO count and high L. PKG co-design from day one with the package team."
      ),
      loc(
        "SSO si dimensiona: I_pin ≈ C dv/dt, N bit insieme, L del return. Ratio PG alto sul PHY, pattern signal-ground. Substrate già freeze ⇒ solo mitigazione die (decap, slew, stagger). IBIS + modello PKG, non un foglio da tre righe.",
        "Size SSO: I_pin ≈ C dv/dt, N bits together, return L. High PG ratio on the PHY, signal-ground pattern. Substrate already frozen ⇒ die-only mitigation (decap, slew, stagger). IBIS + PKG model, not a three-line spreadsheet."
      ),
    ],
  },
  tapeout: {
    kicker: loc("Zero, non quasi-zero", "Zero, not almost-zero"),
    paragraphs: [
      loc(
        "GKC: ogni disciplina firma. Un veto blocca. BTO poi MTO per parallelizzare FEOL in fab. GDS/OASIS merged, layer map, job deck, PDK locked. Dopo MTO l'unico undo è un respin (soldi e mesi). MPW per prototipi. TOR è il go/no-go verbale, ma il contenuto è la checklist che hai già visto in questo sito.",
        "GKC: every discipline signs. One veto blocks. BTO then MTO to parallelize FEOL in fab. Merged GDS/OASIS, layer map, job deck, PDK locked. After MTO the only undo is a respin (money and months). MPW for prototypes. TOR is the verbal go/no-go, but the content is the checklist already on this site."
      ),
      loc(
        "Metal-only = spare già nel FEOL + metal/via. AND2 = NAND2+INV. Nuova cella in un hole slitta BTO. Dopo l'ECO: LEC, ATPG, PV, IR se hai toccato PG. Evidenza GKC = log tool, non una slide con tre pallini verdi. Spare 2–4% è assicurazione.",
        "Metal-only = spares already in FEOL + metal/via. AND2 = NAND2+INV. A new cell in a hole slips BTO. After the ECO: LEC, ATPG, PV, IR if you touched PG. GKC evidence = tool logs, not a slide with three green dots. 2–4% spare is insurance."
      ),
    ],
  },
};
