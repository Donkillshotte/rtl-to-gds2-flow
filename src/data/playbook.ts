import { loc, type Localized } from "@/i18n/context";

export interface PlaybookChapter {
  id: string;
  title: Localized;
  kicker: Localized;
  paragraphs: Localized[];
}

/** Long bilingual chapters for topics that span many of the 14 stages. */
export const playbook: PlaybookChapter[] = [
  {
    id: "dft",
    title: loc("DFT in physical design", "DFT in physical design"),
    kicker: loc(
      "Scan, lock-up, ATPG, MBIST, OCC — sono mode STA e celle, non un PDF del DFT team.",
      "Scan, lock-up, ATPG, MBIST, OCC — they are STA modes and cells, not a DFT-team PDF."
    ),
    paragraphs: [
      loc(
        "Scan insertion è un passo di sintesi/DFT compiler (Tessent, DFTMAX, Modus): ogni FF diventa un SDFF (TI/TE o SI/SE), si stitchano le chain, si aggiunge compressione (EDT/Codec) e OCC per at-speed. LEC RTL↔scan-netlist è obbligatorio: hai cambiato ogni registro. Occupazione tipica +5–12% area, + HFNS su scan_en, + migliaia di path hold. Il PD che 'aggiunge scan in P&R' sta nel 2005.",
        "Scan insertion is a synthesis/DFT-compiler step (Tessent, DFTMAX, Modus): every FF becomes an SDFF (TI/TE or SI/SE), chains are stitched, compression (EDT/Codec) and OCC for at-speed are added. RTL↔scan-netlist LEC is mandatory: you changed every register. Typical overhead +5–12% area, plus HFNS on scan_en, plus thousands of hold paths. A PD who 'adds scan in P&R' is living in 2005."
      ),
      loc(
        "Mode MMMC da chiudere: functional, scan_shift (bassa f, SE=1 — setup facile, hold brutale), scan_capture / launch-on-capture / launch-on-shift a f funzionale (transition delay), eventualmente sleep/retention. Hold di shift NON dipende da Tshift. I path SI→Q tra FF vicini sono i più corti del die: skew CTS locale li rompe. Fix strutturale: lock-up latch (o lock-up FF) su stitch tra clock domain e su segmenti lunghi; delay cell selettive in-domain. Lock-up non è un buffer: è un livello che spezza il path hold.",
        "MMMC modes to close: functional, scan_shift (low f, SE=1 — easy setup, brutal hold), scan_capture / launch-on-capture / launch-on-shift at functional f (transition delay), maybe sleep/retention. Shift hold does NOT depend on Tshift. SI→Q paths between neighboring FFs are the shortest on the die: local CTS skew breaks them. Structural fix: lock-up latch (or lock-up FF) on stitches across clock domains and on long segments; selective in-domain delay cells. A lock-up is not a buffer: it is a level that breaks the hold path."
      ),
      loc(
        "ATPG genera pattern stuck-at e transition sul netlist FINALE (post-ECO). Coverage target tipico ≥99% stuck-at, ≥85–95% transition a seconda del nodo e del prodotto. I buchi devono essere una lista: analog, RAM (le testa MBIST), tied-off, ISO in power-off. Un numero 99.2% senza lista è una slide. Pattern count esplode senza compressione: EDT/Codec traducono scan interno ↔ poche porte ATE.",
        "ATPG generates stuck-at and transition patterns on the FINAL netlist (post-ECO). Typical coverage targets ≥99% stuck-at, ≥85–95% transition depending on node and product. Holes must be a list: analog, RAM (MBIST tests those), tied-off, ISO in power-off. A 99.2% number without a list is a slide. Pattern count explodes without compression: EDT/Codec translate internal scan ↔ few ATE pins."
      ),
      loc(
        "MBIST: wrapper March (MATS+, March C− …) attorno alle SRAM, clock da OCC o PLL bypass, spesso 200–400 MHz. Per il PD: celle wrapper, routing dei bist_done/fail, mode STA, e corrente. In BIST gli array switchano più che in func (1.5–2× I è un ordine di grandezza da verificare, non da intuire). IR/EM di test può fallire anche se func è verde. RAM analog/CAM non wrappabili: documented untestable, non 'ci pensiamo lunedì'.",
        "MBIST: March wrappers (MATS+, March C− …) around SRAMs, clock from OCC or PLL bypass, often 200–400 MHz. For PD: wrapper cells, bist_done/fail routing, STA mode, and current. In BIST arrays switch more than in func (1.5–2× I is an order of magnitude to verify, not to guess). Test IR/EM can fail even when func is green. Analog/CAM RAMs that cannot wrap: documented untestable, not 'we'll think about it Monday'."
      ),
      loc(
        "Boundary scan / IEEE 1149.1 e 1687 (IJTAG) stanno sul ring IO. Occupano bump/pad e logic aon. Il PD riserva i pin TCK/TMS/TDI/TDO, rispetta l'IO timing (spesso 10–50 MHz) e non li mangia per 'un GPIO in più'. OCC (on-chip clock control) è il mux/sync che lancia i pulse at-speed: è un clock root extra per CTS, con check di glitch identici a un ICG.",
        "Boundary scan / IEEE 1149.1 and 1687 (IJTAG) live on the IO ring. They occupy bumps/pads and always-on logic. PD reserves TCK/TMS/TDI/TDO, meets IO timing (often 10–50 MHz), and does not steal them for 'one more GPIO'. OCC (on-chip clock control) is the mux/sync that launches at-speed pulses: it is an extra clock root for CTS, with glitch checks identical to an ICG."
      ),
    ],
  },
  {
    id: "dfm",
    title: loc("DFM, coloring, litho, yield", "DFM, coloring, litho, yield"),
    kicker: loc(
      "A ≤7 nm il DRC 'classico' è il 40% del deck. Il resto è process.",
      "At ≤7 nm 'classic' DRC is 40% of the deck. The rest is process."
    ),
    paragraphs: [
      loc(
        "Multi-patterning (LELE, SADP, EUV ibrido): due shape adiacenti sullo stesso color layer devono essere 2-colorabili. Un odd cycle è un coloring conflict: il router deve tagliare, jog, o salire di layer. Non è un warning CAD e non è un waiver da corridoio. P&R gira un deck ridotto (runtime); Calibre/Icv signoff gira il deck foundry. GKC guarda il secondo.",
        "Multi-patterning (LELE, SADP, hybrid EUV): two adjacent shapes on the same color layer must be 2-colorable. An odd cycle is a coloring conflict: the router must cut, jog, or jump a layer. Not a CAD warning and not a hallway waiver. P&R runs a reduced deck (runtime); Calibre/Icv signoff runs the foundry deck. GKC watches the second."
      ),
      loc(
        "Via doubling / via array: un via singolo è EM-weak e yield-weak (via void, overlay). Su clock spine e PG è quasi sempre error. Double-via globale su ogni signal net a 7 nm satura i track e crea coloring: si prioritizza. Enclosure e via bar sono regole di process, non estetica.",
        "Via doubling / via arrays: a single via is EM-weak and yield-weak (via void, overlay). On clock spines and PG it is almost always error. Global double-via on every signal net at 7 nm saturates tracks and creates coloring: you prioritize. Enclosure and via bars are process rules, not aesthetics."
      ),
      loc(
        "Density e CMP: finestre (es. 20–100 µm) con ρ_min–ρ_max per metal e poly. Fill dummy grounded vs floating cambia C e SI — lo SPEF di signoff deve vedere il GDS merged. Slotting/cheesing su fili larghi (PG, clock mesh) per stress e dishing. Litho hotspot / PV-band: simulazione di process variation sulla geometria; 14 hotspot fuori spec sono DRC di fatto, si fixano in layout non in una slide 'yield model'.",
        "Density and CMP: windows (e.g. 20–100 µm) with ρ_min–ρ_max for metal and poly. Grounded vs floating dummy fill changes C and SI — signoff SPEF must see merged GDS. Slotting/cheesing on fat wires (PG, clock mesh) for stress and dishing. Litho hotspots / PV-band: process-variation simulation on geometry; 14 hotspots out of spec are DRC in practice, fixed in layout not in a 'yield model' slide."
      ),
      loc(
        "Antenna (process-induced gate oxide damage): durante l'etch un metal lungo accumula carica se il gate è già formato e la via verso diffusion non c'è ancora. Ratio A_metal/A_gate vs Rmax per layer, cumulativo. Allargare il filo PEGGIORA il ratio. Fix: jumper a layer superiore (diode-to-diffusion early) o diodo antenna. Il Calibre antenna deck è la legge; la formula da foglio è pedagogia.",
        "Antenna (process-induced gate oxide damage): during etch a long metal collects charge if the gate already exists and the via to diffusion is not there yet. Ratio A_metal/A_gate vs Rmax per layer, cumulative. Widening the wire WORSENS the ratio. Fix: jumper to an upper layer (early diode-to-diffusion) or an antenna diode. The Calibre antenna deck is the law; the spreadsheet formula is pedagogy."
      ),
      loc(
        "Recommended vs required: foundry marca DFM come error, warning, o advisory. Un advisory su via-1 del clock è politicamente un error. Un error su coloring è un error. Il senior legge il rule number sul deck, non il colore del pallino in Innovus.",
        "Recommended vs required: foundry marks DFM as error, warning, or advisory. An advisory on clock via-1 is politically an error. A coloring error is an error. A senior reads the rule number on the deck, not the Innovus traffic-light color."
      ),
    ],
  },
  {
    id: "eco",
    title: loc("Timing closure, ECO, freeze", "Timing closure, ECO, freeze"),
    kicker: loc(
      "L'ordine delle armi è il mestiere. L'ECO sbagliato slitta un mask set.",
      "Weapon order is the craft. The wrong ECO slips a mask set."
    ),
    paragraphs: [
      loc(
        "Ordine operativo post-route: (1) DRV=0 — max_tran/max_cap, altrimenti il .lib è estrapolato. (2) SI — delta delay e glitch, spacing/shield/layer. (3) Volume TNS — size/Vt/rebuffer di massa, densità, congestion. (4) Picco WNS — path-by-path, useful skew, MCP solo se architetturalmente vero. (5) Hold dopo CTS, per mode (func vs scan). Un buffer sul path #1 con TNS −95 ns è teatro.",
        "Post-route operating order: (1) DRV=0 — max_tran/max_cap, otherwise the .lib is extrapolated. (2) SI — delay delta and glitch, spacing/shield/layer. (3) TNS volume — mass size/Vt/rebuffer, density, congestion. (4) WNS peak — path-by-path, useful skew, MCP only if architecturally true. (5) Hold after CTS, per mode (func vs scan). One buffer on path #1 with TNS −95 ns is theatre."
      ),
      loc(
        "WLM vs SPEF: pre-route usa un wire-load o un virtual route. Post-route lo SPEF (con fill) è la realtà. Una regressione +40 ps → −6 ps è spesso net delay (detour, via, coupling), non cell. Path compare: se Tpd cell è piatto e wire è esploso, torni a congestion/floorplan, non al FE per un FO4.",
        "WLM vs SPEF: pre-route uses a wire-load or a virtual route. Post-route SPEF (with fill) is reality. A +40 ps → −6 ps regression is often net delay (detour, via, coupling), not cell. Path compare: if cell Tpd is flat and wire exploded, you go back to congestion/floorplan, not to FE for an FO4."
      ),
      loc(
        "Metal-only ECO: FEOL freeze (diffusion, poly, implant, eventualmente M1–M3). Si riwirano spare cells (NAND+INV = AND, INV per polarità, mux da NAND). Nuova cella in un hole è ECO funzionale: slitta BTO. LEC vs golden nuovo, ATPG rifatto, PV sul GDS patched, IR se hai mosso PG. Spare 2–4% è un'assicurazione; 0% spare a 7 nm è arroganza.",
        "Metal-only ECO: FEOL freeze (diffusion, poly, implant, maybe M1–M3). You rewire spare cells (NAND+INV = AND, INV for polarity, mux from NAND). A newly placed cell in a hole is a functional ECO: BTO slips. LEC vs new golden, ATPG rerun, PV on patched GDS, IR if you moved PG. 2–4% spare is insurance; 0% spare at 7 nm is arrogance."
      ),
      loc(
        "MCP e false path: un multicycle è un contratto architetturale (es. path div-by-4). Si documenta, si verifica in sim/formal, si mette in SDC con -setup/-hold coerenti (hold spesso 1). Un false path su AXI ready o su scan_en è un bug. L'interviewer ti chiede un esempio vero e uno criminale — abbi entrambi pronti.",
        "MCP and false paths: a multicycle is an architectural contract (e.g. a div-by-4 path). Document it, prove it in sim/formal, put it in SDC with coherent -setup/-hold (hold often 1). A false path on AXI ready or scan_en is a bug. The interviewer asks for a real example and a criminal one — have both ready."
      ),
    ],
  },
  {
    id: "gkc",
    title: loc("GKC, BTO/MTO, package, respin", "GKC, BTO/MTO, package, respin"),
    kicker: loc(
      "Zero, non quasi-zero. Evidenza = log foundry, non una slide.",
      "Zero, not almost-zero. Evidence = foundry logs, not a slide."
    ),
    paragraphs: [
      loc(
        "Gate Keeper Check: ogni disciplina porta un log. STA: WNS≥0, TNS=0 (o budget firmato) su TUTTI gli scenario MMMC, DRV=0, noise. PV: DRC=0 sul deck foundry, LVS CORRECT, ERC, antenna, coloring, density, litho. IR/EM: static/dynamic sotto limite, MTTF ≥10 anni @ Tmax, voltage map in STA. DFT: coverage sul netlist ECO, pattern consegnati. UPF/CLP: isolation/LS. Package: bump DRC, RDL, SSO. Un veto blocca. '3 violation le waiveriamo lunedì' non è un GKC.",
        "Gate Keeper Check: every discipline brings a log. STA: WNS≥0, TNS=0 (or a signed budget) on ALL MMMC scenarios, DRV=0, noise. PV: DRC=0 on the foundry deck, LVS CORRECT, ERC, antenna, coloring, density, litho. IR/EM: static/dynamic under limit, MTTF ≥10 years @ Tmax, voltage map in STA. DFT: coverage on the ECO netlist, patterns delivered. UPF/CLP: isolation/LS. Package: bump DRC, RDL, SSO. One veto blocks. 'We'll waive 3 violations Monday' is not a GKC."
      ),
      loc(
        "BTO (Base Tape-Out) congela FEOL: la fab inizia pozzi, poly, implant. MTO (Metal Tape-Out) congela BEOL. Lo split esiste per parallelizzare mesi di coda. Dopo BTO un ECO funzionale è un respin FEOL (soldi e mesi). Dopo MTO anche il metal è sacro. Mask set ≤7 nm: ordine $2–5M+. MPW (multi-project wafer) per prototipi: stessi check, meno die, coda condivisa.",
        "BTO (Base Tape-Out) freezes FEOL: the fab starts wells, poly, implant. MTO (Metal Tape-Out) freezes BEOL. The split exists to parallelize months of queue. After BTO a functional ECO is a FEOL respin (money and months). After MTO metal is sacred too. Mask set ≤7 nm: order of $2–5M+. MPW (multi-project wafer) for prototypes: same checks, fewer dice, shared queue."
      ),
      loc(
        "Package co-design dal day-1: bump map detta IR e RDL. Flip-chip: corrente dall'area. Wire-bond: L alta, IO dal bordo, per die piccoli. SSO: V≈L·di/dt, N bit, IBIS. Ratio PG sui bump del PHY. Die-package-board: un return path esiste solo se lo disegni. Decidere i bump a fine PD è rifare il floorplan.",
        "Package co-design from day one: the bump map dictates IR and RDL. Flip-chip: current from the area. Wire-bond: high L, IO from the edge, for small dice. SSO: V≈L·di/dt, N bits, IBIS. PG ratio on PHY bumps. Die-package-board: a return path exists only if you draw it. Deciding bumps at the end of PD is redoing the floorplan."
      ),
      loc(
        "Respin: bug in silicon (STA mentiva, SI, IR, DFT hole, analog). Costo = mask + mesi + opportunity. Si evita con: IR-aware e SI-aware STA, SPEF con fill, GDS merged, coverage sul golden, corners onesti (temp inversion), activity onesta in EM. Il senior al colloquio racconta un fail reale e cosa ha cambiato nel flusso — non una lista di acronimi.",
        "Respin: bug in silicon (STA lied, SI, IR, DFT hole, analog). Cost = masks + months + opportunity. You avoid it with: IR-aware and SI-aware STA, SPEF with fill, merged GDS, coverage on the golden, honest corners (temp inversion), honest activity in EM. A senior in interview tells a real fail and what they changed in the flow — not a list of acronyms."
      ),
    ],
  },
];
