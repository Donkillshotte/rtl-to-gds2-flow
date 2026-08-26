import { loc, type Localized } from "@/i18n/context";
import type { StageId } from "./stages";

export interface QuizItem {
  id: string;
  stage: StageId | "cross";
  difficulty: "junior" | "senior";
  question: Localized;
  choices: Localized<string[]>;
  correct: number;
  explain: Localized;
}

export const quizBank: QuizItem[] = [
  {
    id: "q-util",
    stage: "floorplan",
    difficulty: "junior",
    question: loc(
      "Utilization = 2.1 mm² di std cells in un core da 3.0 mm². Qual è U e il giudizio?",
      "Utilization = 2.1 mm² of std cells in a 3.0 mm² core. What is U and the verdict?"
    ),
    choices: loc(
      ["70% — target sano", "70% — troppo basso", "143% — illegale", "30% — overcrowded"],
      ["70% — healthy target", "70% — too low", "143% — illegal", "30% — overcrowded"]
    ),
    correct: 0,
    explain: loc(
      "U = 2.1/3.0 = 70%. La fascia industriale è 60–80%. Sotto 50% sprechi die; sopra 80% il routing non chiude.",
      "U = 2.1/3.0 = 70%. Industrial band is 60–80%. Below 50% wastes die; above 80% routing will not close."
    ),
  },
  {
    id: "q-setup-hold-freq",
    stage: "sta",
    difficulty: "junior",
    question: loc(
      "Quale check NON dipende dal periodo di clock?",
      "Which check does NOT depend on clock period?"
    ),
    choices: loc(
      ["Setup", "Hold", "Max transition", "Entrambi setup e hold"],
      ["Setup", "Hold", "Max transition", "Both setup and hold"]
    ),
    correct: 1,
    explain: loc(
      "Hold è una race sullo stesso edge: Tco + Tpd ≥ Thold + Tskew. Abbassare la frequenza non salva un hold fail in silicon.",
      "Hold is a same-edge race: Tco + Tpd ≥ Thold + Tskew. Lowering frequency does not save a hold fail in silicon."
    ),
  },
  {
    id: "q-skew-sign",
    stage: "cts",
    difficulty: "senior",
    question: loc(
      "Skew = Tclk_capture − Tclk_launch = +40 ps. Effetto su setup e hold?",
      "Skew = Tclk_capture − Tclk_launch = +40 ps. Effect on setup and hold?"
    ),
    choices: loc(
      ["Setup +40 ps, hold −40 ps", "Setup −40 ps, hold +40 ps", "Entrambi +40 ps", "Nessun effetto se CPPR è on"],
      ["Setup +40 ps, hold −40 ps", "Setup −40 ps, hold +40 ps", "Both +40 ps", "No effect if CPPR is on"]
    ),
    correct: 0,
    explain: loc(
      "Skew positivo (capture in ritardo) allunga il ciclo utile per setup e riduce il margine hold. Useful skew usa proprio questo trade-off.",
      "Positive skew (late capture) lengthens the useful cycle for setup and cuts hold margin. Useful skew is exactly this trade-off."
    ),
  },
  {
    id: "q-ir",
    stage: "pdn",
    difficulty: "junior",
    question: loc(
      "VDD=0.80 V, I=1.2 A, Rpath=25 mΩ. IR drop statico e % VDD?",
      "VDD=0.80 V, I=1.2 A, Rpath=25 mΩ. Static IR drop and % of VDD?"
    ),
    choices: loc(
      ["30 mV = 3.75% — OK se limite 5%", "30 mV = 3.75% — fail", "300 mV = 37.5% — fail", "0.25 mV — trascurabile"],
      ["30 mV = 3.75% — OK if limit is 5%", "30 mV = 3.75% — fail", "300 mV = 37.5% — fail", "0.25 mV — negligible"]
    ),
    correct: 0,
    explain: loc(
      "V = I·R = 1.2 × 0.025 = 30 mV. 30/800 = 3.75% < 5%. Attenzione: questo è statico; il dynamic droop può essere 2–3×.",
      "V = I·R = 1.2 × 0.025 = 30 mV. 30/800 = 3.75% < 5%. Careful: this is static; dynamic droop can be 2–3×."
    ),
  },
  {
    id: "q-cppr",
    stage: "sta",
    difficulty: "senior",
    question: loc(
      "Perché CPPR/CRPR restituisce slack positivo che OCV flat aveva reso negativo?",
      "Why does CPPR/CRPR give back slack that flat OCV had made negative?"
    ),
    choices: loc(
      [
        "Il ramo comune del clock non può essere contemporaneamente early e late",
        "Rimuove tutte le variazioni on-chip",
        "Disabilita i derate sul data path",
        "Converte hold in setup",
      ],
      [
        "The common clock trunk cannot be early and late at once",
        "It removes all on-chip variation",
        "It disables derates on the data path",
        "It converts hold into setup",
      ]
    ),
    correct: 0,
    explain: loc(
      "OCV derata launch late e capture early anche sul tronco condiviso — fisicamente impossibile. CPPR accredita quel pessimismo. Senza CPPR bruci area a fixare violazioni fantasma.",
      "OCV derates launch late and capture early even on the shared trunk — physically impossible. CPPR credits that pessimism. Without CPPR you burn area fixing ghost violations."
    ),
  },
  {
    id: "q-global-detail-place",
    stage: "placement",
    difficulty: "junior",
    question: loc(
      "Global vs detailed placement: quale affermazione è vera?",
      "Global vs detailed placement: which statement is true?"
    ),
    choices: loc(
      [
        "Global permette overlap; detailed legalizza e fa swap locali",
        "Global è DRC-clean; detailed stima HPWL",
        "Sono la stessa cosa in Innovus",
        "Detailed avviene prima del floorplan",
      ],
      [
        "Global allows overlap; detailed legalizes and does local swaps",
        "Global is DRC-clean; detailed estimates HPWL",
        "They are the same in Innovus",
        "Detailed happens before floorplan",
      ]
    ),
    correct: 0,
    explain: loc(
      "Analytical global place minimizza HPWL con overlap. Legalization snappa alle row. Detailed fa swap/move locali per timing senza spostamenti lunghi.",
      "Analytical global place minimizes HPWL with overlap. Legalization snaps to rows. Detailed does local swaps/moves for timing without long moves."
    ),
  },
  {
    id: "q-hfns-cts",
    stage: "cts",
    difficulty: "senior",
    question: loc(
      "HFNS vs CTS: differenza fondamentale?",
      "HFNS vs CTS: fundamental difference?"
    ),
    choices: loc(
      [
        "HFNS bufferizza reset/enable senza bilanciare skew; CTS bilancia clock",
        "HFNS è solo per clock mesh",
        "CTS non inserisce buffer",
        "Sono identici se max_fanout è 32",
      ],
      [
        "HFNS buffers reset/enable without skew balancing; CTS balances clocks",
        "HFNS is only for clock meshes",
        "CTS does not insert buffers",
        "They are identical if max_fanout is 32",
      ]
    ),
    correct: 0,
    explain: loc(
      "High Fanout Net Synthesis spezza net enormi (reset, scan_en) per DRV. Non ha target di skew. CTS ha skew/latency/transition e celle clock-qualified.",
      "High Fanout Net Synthesis splits huge nets (reset, scan_en) for DRV. No skew target. CTS has skew/latency/transition and clock-qualified cells."
    ),
  },
  {
    id: "q-antenna",
    stage: "routing",
    difficulty: "junior",
    question: loc(
      "Antenna ratio 450, limite foundry 400. Fix più pulito se il jumper è possibile?",
      "Antenna ratio 450, foundry limit 400. Cleanest fix if a jumper is possible?"
    ),
    choices: loc(
      [
        "Metal jumper a layer superiore (esposto dopo)",
        "Allargare il wire",
        "Aumentare U",
        "False path sul net",
      ],
      [
        "Metal jumper to an upper layer (exposed later)",
        "Widen the wire",
        "Increase U",
        "False-path the net",
      ]
    ),
    correct: 0,
    explain: loc(
      "I layer alti si depositano dopo: meno tempo di plasma sul gate. Alternativa: diodo antenna. Allargare il wire PEGGIORA il ratio.",
      "Upper layers are deposited later: less plasma time on the gate. Alternative: antenna diode. Widening the wire WORSENS the ratio."
    ),
  },
  {
    id: "q-drc-lvs",
    stage: "pv",
    difficulty: "junior",
    question: loc(
      "Un short tra due net nel layout: quale check lo prende?",
      "A short between two nets in layout: which check catches it?"
    ),
    choices: loc(
      ["LVS (e spesso ERC)", "Solo DRC spacing", "Solo STA", "Solo antenna"],
      ["LVS (and often ERC)", "DRC spacing only", "STA only", "Antenna only"]
    ),
    correct: 0,
    explain: loc(
      "DRC vede geometria (spacing). Se due net si toccano ma rispettano width, DRC può essere clean e LVS segnala short. Serve entrambi.",
      "DRC sees geometry (spacing). If two nets touch but meet width, DRC can be clean and LVS flags a short. You need both."
    ),
  },
  {
    id: "q-false-mcp",
    stage: "sta",
    difficulty: "senior",
    question: loc(
      "Un path di configurazione scritto una volta a boot: come lo tratti in SDC?",
      "A config path written once at boot: how do you treat it in SDC?"
    ),
    choices: loc(
      [
        "set_false_path (o max_delay lasco) — documentato",
        "set_multicycle_path 100 sempre",
        "Ignorarlo: STA lo capisce",
        "set_clock_groups -asynchronous sul data",
      ],
      [
        "set_false_path (or a loose max_delay) — documented",
        "Always set_multicycle_path 100",
        "Ignore it: STA will understand",
        "set_clock_groups -asynchronous on the data",
      ]
    ),
    correct: 0,
    explain: loc(
      "Se non è in un ciclo funzionale, false_path è corretto. MCP è per path che restano sincroni ma hanno N cicli. Abusare false_path su path reali = silicon fail.",
      "If it is not in a functional cycle, false_path is correct. MCP is for paths that stay synchronous but have N cycles. Abusing false_path on real paths = silicon fail."
    ),
  },
  {
    id: "q-macro-halo",
    stage: "floorplan",
    difficulty: "junior",
    question: loc(
      "Perché un halo 3–5 µm intorno a un SRAM?",
      "Why a 3–5 µm halo around an SRAM?"
    ),
    choices: loc(
      [
        "Pin access + canale di routing + evitare density wall",
        "È obbligatorio per LVS",
        "Riduce il leakage della SRAM",
        "Sostituisce i tap cells",
      ],
      [
        "Pin access + routing channel + avoid a density wall",
        "It is mandatory for LVS",
        "It reduces SRAM leakage",
        "It replaces tap cells",
      ]
    ),
    correct: 0,
    explain: loc(
      "Senza halo le std cells si ammassano sui pin della macro → congestion e via ladder impossibile. Halo/keepout è pratica di floorplan, non una regola LVS.",
      "Without a halo, std cells pile onto macro pins → congestion and impossible via ladders. Halo/keepout is floorplan practice, not an LVS rule."
    ),
  },
  {
    id: "q-pre-post-cts-hold",
    stage: "cts",
    difficulty: "senior",
    question: loc(
      "Perché è sbagliato chiudere hold pre-CTS con clock ideale?",
      "Why is it wrong to close hold pre-CTS with an ideal clock?"
    ),
    choices: loc(
      [
        "CTS introduce skew reale: i numeri hold pre-CTS sono finzione",
        "Hold non esiste pre-CTS",
        "PrimeTime non gira pre-CTS",
        "I delay cell non si possono piazzare prima",
      ],
      [
        "CTS introduces real skew: pre-CTS hold numbers are fiction",
        "Hold does not exist pre-CTS",
        "PrimeTime cannot run pre-CTS",
        "Delay cells cannot be placed yet",
      ]
    ),
    correct: 0,
    explain: loc(
      "Clock ideale ⇒ skew 0. CTS sposta gli arrival: compaiono hold. I buffer inseriti pre-CTS diventano junk. Chiudi setup early, hold dopo CTS.",
      "Ideal clock ⇒ skew 0. CTS moves arrivals: hold appears. Buffers inserted pre-CTS become junk. Close setup early, hold after CTS."
    ),
  },
  {
    id: "q-em-fix",
    stage: "power",
    difficulty: "junior",
    question: loc(
      "J = 2.1 MA/cm², Jmax = 1.5. Prima azione su uno strap?",
      "J = 2.1 MA/cm², Jmax = 1.5. First action on a strap?"
    ),
    choices: loc(
      [
        "Widen / parallel straps / more vias (aumenta A)",
        "Alzare VDD",
        "set_false_path sulle power net",
        "Rimuovere decap",
      ],
      [
        "Widen / parallel straps / more vias (increase A)",
        "Raise VDD",
        "set_false_path on power nets",
        "Remove decap",
      ]
    ),
    correct: 0,
    explain: loc(
      "J = I/A. Riduci I (attività) o aumenta A. VDD più alto peggiora I. False path non si applica alle power net.",
      "J = I/A. Reduce I (activity) or increase A. Higher VDD worsens I. False path does not apply to power nets."
    ),
  },
  {
    id: "q-bto-mto",
    stage: "tapeout",
    difficulty: "junior",
    question: loc(
      "Dopo BTO puoi ancora cambiare…",
      "After BTO you can still change…"
    ),
    choices: loc(
      ["BEOL (metalli/vias) fino a MTO", "Fin/poly/implant", "Niente", "Solo RTL"],
      ["BEOL (metals/vias) until MTO", "Fin/poly/implant", "Nothing", "RTL only"]
    ),
    correct: 0,
    explain: loc(
      "BTO congela FEOL. Metal-only ECO e routing restano aperti fino a MTO. Cambiare un transistor dopo BTO = respin FEOL.",
      "BTO freezes FEOL. Metal-only ECO and routing stay open until MTO. Changing a transistor after BTO = FEOL respin."
    ),
  },
  {
    id: "q-crosstalk-dir",
    stage: "sta",
    difficulty: "senior",
    question: loc(
      "Aggressor e victim commutano in DIREZIONI OPPOSTE. Effetto sul delay della victim?",
      "Aggressor and victim switch in OPPOSITE directions. Effect on victim delay?"
    ),
    choices: loc(
      [
        "Delay aumenta (peggiora setup)",
        "Delay diminuisce (peggiora hold)",
        "Nessun effetto se SPEF è coupled",
        "Solo glitch, mai delta delay",
      ],
      [
        "Delay increases (hurts setup)",
        "Delay decreases (hurts hold)",
        "No effect if SPEF is coupled",
        "Glitch only, never delta delay",
      ]
    ),
    correct: 0,
    explain: loc(
      "Opposite miller: Ccoupling 'tira' contro la transizione → più delay. Same-direction accelera (hold risk). STA SI-aware fa entrambi i casi.",
      "Opposite miller: Ccoupling pulls against the transition → more delay. Same-direction speeds up (hold risk). SI-aware STA does both cases."
    ),
  },
  {
    id: "q-level-shifter",
    stage: "pdn",
    difficulty: "junior",
    question: loc(
      "Segnale 0.75 V entra in un dominio 0.90 V senza LS. Cosa succede?",
      "A 0.75 V signal enters a 0.90 V domain with no LS. What happens?"
    ),
    choices: loc(
      [
        "Livelli illegali / contention / fail funzionale",
        "STA lo ritarda e basta",
        "Il filler cell corregge",
        "È ok se è un clock",
      ],
      [
        "Illegal levels / contention / functional fail",
        "STA just delays it",
        "Filler cells fix it",
        "Fine if it is a clock",
      ]
    ),
    correct: 0,
    explain: loc(
      "Senza level shifter il ricevitore 0.90 V vede un '1' debole. UPF deve inserire LS (e isolation se il dominio sorgente si spegne).",
      "Without a level shifter the 0.90 V receiver sees a weak '1'. UPF must insert LS (and isolation if the source domain power-gates)."
    ),
  },
  {
    id: "q-wlm-spef",
    stage: "sta",
    difficulty: "senior",
    question: loc(
      "Perché il signoff STA non usa Wire Load Model?",
      "Why does signoff STA not use a Wire Load Model?"
    ),
    choices: loc(
      [
        "WLM è una stima pre-layout (errore 20–40%); signoff vuole SPEF estratto",
        "WLM è più accurato di SPEF",
        "PrimeTime non legge SPEF",
        "WLM include già SI",
      ],
      [
        "WLM is a pre-layout estimate (20–40% error); signoff wants extracted SPEF",
        "WLM is more accurate than SPEF",
        "PrimeTime cannot read SPEF",
        "WLM already includes SI",
      ]
    ),
    correct: 0,
    explain: loc(
      "WLM statistico della sintesi. Dopo route, StarRC/Quantus estraggono R/C reali. Senza SPEF il WNS è un numero di marketing.",
      "WLM is a synthesis statistical model. After route, StarRC/Quantus extract real R/C. Without SPEF, WNS is a marketing number."
    ),
  },
  {
    id: "q-filler-eco",
    stage: "layout",
    difficulty: "junior",
    question: loc(
      "Prima di un ECO metal-only, i filler cells…",
      "Before a metal-only ECO, filler cells…"
    ),
    choices: loc(
      [
        "Si rimuovono, si piazza/route l'ECO, si reinseriscono",
        "Restano forever, l'ECO passa sopra",
        "Diventano spare cells automaticamente",
        "Si convertono in decap",
      ],
      [
        "Are removed, ECO is placed/routed, then reinserted",
        "Stay forever; ECO routes over them",
        "Automatically become spare cells",
        "Convert into decap",
      ]
    ),
    correct: 0,
    explain: loc(
      "I filler occupano siti. Per inserire un buffer ECO servi spazio: delete_filler → eco → add_filler. Spare cells sono un'altra riserva, pre-piazzata.",
      "Fillers occupy sites. To insert an ECO buffer you need space: delete_filler → eco → add_filler. Spare cells are a different, pre-placed reserve."
    ),
  },
  {
    id: "q-scan-hold",
    stage: "placement",
    difficulty: "senior",
    question: loc(
      "Perché lo scan path è spesso il primo hold fail post-CTS?",
      "Why is the scan path often the first hold fail post-CTS?"
    ),
    choices: loc(
      [
        "SI→Q è un path corto (vicini dopo stitch) + clock skew locale",
        "Scan è sempre false path",
        "SE è un clock",
        "ATPG cambia i .lib",
      ],
      [
        "SI→Q is a short path (neighbors after stitch) + local clock skew",
        "Scan is always a false path",
        "SE is a clock",
        "ATPG changes .lib files",
      ]
    ),
    correct: 0,
    explain: loc(
      "Scan stitch mette FF vicini: data path cortissimo. Qualsiasi skew CTS crea hold. Si chiude con lock-up latch o delay sul SI, e SE buffer tree.",
      "Scan stitch puts FFs next to each other: tiny data path. Any CTS skew creates hold. Close with lock-up latches or SI delay, plus an SE buffer tree."
    ),
  },
  {
    id: "q-dynamic-ir",
    stage: "power",
    difficulty: "senior",
    question: loc(
      "WORST_POWER vs WORST_dI/dt per dynamic IR: cosa catturano?",
      "WORST_POWER vs WORST_dI/dt for dynamic IR: what do they capture?"
    ),
    choices: loc(
      [
        "Energia/ciclo vs picco di transiente (L·di/dt + C)",
        "Sono lo stesso vettore VCD",
        "Solo leakage vs solo switching",
        "Setup vs hold",
      ],
      [
        "Energy/cycle vs transient peak (L·di/dt + C)",
        "They are the same VCD vector",
        "Leakage only vs switching only",
        "Setup vs hold",
      ]
    ),
    correct: 0,
    explain: loc(
      "WORST_POWER: ciclo a massima energia (droop termico/resistivo). WORST_dI/dt: fronte più ripido (induttanza package). Servono entrambi i VCD.",
      "WORST_POWER: max-energy cycle (thermal/resistive droop). WORST_dI/dt: steepest edge (package inductance). You need both VCDs."
    ),
  },
  {
    id: "q-lockup",
    stage: "sta",
    difficulty: "senior",
    question: loc(
      "Un lock-up latch sullo scan stitch serve a…",
      "A lock-up latch on a scan stitch is there to…"
    ),
    choices: loc(
      [
        "Spezzare il path hold tra due clock domain / segmenti lunghi con un livello extra — NON è un buffer di delay",
        "Alzare la frequenza di shift",
        "Sostituire l'OCC",
        "Chiudere il setup di capture at-speed",
      ],
      [
        "Break the hold path between two clock domains / long segments with an extra level — it is NOT a delay buffer",
        "Raise shift frequency",
        "Replace the OCC",
        "Close at-speed capture setup",
      ]
    ),
    correct: 0,
    explain: loc(
      "Lock-up è trasparente su una fase e cattura sull'altra: il hold path Q→SI non è più combo diretta. Capture at-speed si chiude come setup funzionale.",
      "Lock-up is transparent on one phase and captures on the other: the Q→SI hold path is no longer a direct combo. At-speed capture is closed like functional setup."
    ),
  },
  {
    id: "q-atpg-golden",
    stage: "tapeout",
    difficulty: "senior",
    question: loc(
      "ATPG a 99.4% sul netlist pre-ECO, ECO metal-only dopo. Copertura valida al GKC?",
      "ATPG at 99.4% on the pre-ECO netlist, metal-only ECO after. Valid coverage at GKC?"
    ),
    choices: loc(
      [
        "Sì, metal-only non tocca transistor",
        "No: anche uno spare riwirato cambia compare-point. ATPG (e LEC) sul golden ECO-finale",
        "Sì se coverage > 99%",
        "No solo se hai toccato scan_en",
      ],
      [
        "Yes, metal-only does not touch transistors",
        "No: even a rewired spare changes compare-points. ATPG (and LEC) on the final ECO golden",
        "Yes if coverage > 99%",
        "No only if you touched scan_en",
      ]
    ),
    correct: 1,
    explain: loc(
      "Spare NAND+INV è funzione nuova. Pattern vecchi possono non coprire o, peggio, assumere un netlist diverso. GKC DFT chiede il log sul GDS/netlist firmati.",
      "A spare NAND+INV is new function. Old patterns may not cover or, worse, assume a different netlist. GKC DFT wants the log on the signed GDS/netlist."
    ),
  },
  {
    id: "q-color-odd",
    stage: "pv",
    difficulty: "senior",
    question: loc(
      "Un coloring conflict LELE è, in teoria dei grafi:",
      "A LELE coloring conflict is, in graph theory:"
    ),
    choices: loc(
      [
        "Un odd cycle: il grafo delle adiacenze non è bipartito",
        "Un via enclosure corto",
        "Un antenna ratio alto",
        "Un hold path",
      ],
      [
        "An odd cycle: the adjacency graph is not bipartite",
        "A short via enclosure",
        "A high antenna ratio",
        "A hold path",
      ]
    ),
    correct: 0,
    explain: loc(
      "Due mask = 2-coloring. Odd cycle ⇒ non 2-colorabile. Fix geometrico (cut/jog/layer), non waiver.",
      "Two masks = 2-coloring. Odd cycle ⇒ not 2-colorable. Geometric fix (cut/jog/layer), not a waiver."
    ),
  },
  {
    id: "q-via-double-cap",
    stage: "pv",
    difficulty: "junior",
    question: loc(
      "Double-via su TUTTI i net a 7 nm. Effetto collaterale tipico?",
      "Double-via on ALL nets at 7 nm. Typical side effect?"
    ),
    choices: loc(
      [
        "Overflow/coloring: i via extra mangiano track. Si prioritizza clock e PG",
        "Migliora sempre anche il timing hold",
        "Elimina il bisogno di fill",
        "Riduce il pattern ATPG",
      ],
      [
        "Overflow/coloring: extra vias eat tracks. Prioritize clock and PG",
        "Always improves hold timing too",
        "Removes the need for fill",
        "Reduces ATPG pattern count",
      ]
    ),
    correct: 0,
    explain: loc(
      "DFM vs capacity è un trade-off. Via array dove J e yield contano; non un bottone globale il venerdì sera.",
      "DFM vs capacity is a trade-off. Via arrays where J and yield matter; not a global Friday-night button."
    ),
  },
  {
    id: "q-wns-tns",
    stage: "sta",
    difficulty: "junior",
    question: loc(
      "WNS −5 ps, TNS −80 ns. Quanti path (ordine) stai guardando?",
      "WNS −5 ps, TNS −80 ns. How many paths (order of mag.) are you looking at?"
    ),
    choices: loc(
      [
        "Uno: il WNS",
        "Migliaia: TNS/|WNS| ~ 16k path-equivalenti — è lavoro di massa, non un buffer",
        "80: uno per nanosecondo",
        "Zero: TNS negativo è un bug del tool",
      ],
      [
        "One: the WNS",
        "Thousands: TNS/|WNS| ~ 16k path-equivalents — mass work, not one buffer",
        "80: one per nanosecond",
        "Zero: negative TNS is a tool bug",
      ]
    ),
    correct: 1,
    explain: loc(
      "TNS è la somma degli slack negativi. |−80 ns|/5 ps = 16k. Un buffer sul path 1 lascia 15 999 path rossi.",
      "TNS is the sum of negative slacks. |−80 ns|/5 ps = 16k. One buffer on path 1 leaves 15,999 paths red."
    ),
  },
  {
    id: "q-temp-inv",
    stage: "sta",
    difficulty: "senior",
    question: loc(
      "A 7 nm il setup peggiore a volte è SS@cold, non SS@hot. Perché?",
      "At 7 nm the worst setup is sometimes SS@cold, not SS@hot. Why?"
    ),
    choices: loc(
      [
        "Temperature inversion: a basso V il mobility/scattering fa ritardare il cold più del hot su alcuni path",
        "Il tester è in freezer",
        "Hold e setup condividono sempre lo stesso corner",
        "Cold riduce solo il leakage",
      ],
      [
        "Temperature inversion: at low V, mobility/scattering makes cold slower than hot on some paths",
        "The tester is in a freezer",
        "Hold and setup always share the same corner",
        "Cold only reduces leakage",
      ]
    ),
    correct: 0,
    explain: loc(
      "MMMC deve includere SS-cold e SS-hot. Chi firma solo SS-hot a 0.75 V si beve un respin. Hold resta FF-cold in genere.",
      "MMMC must include SS-cold and SS-hot. Signing only SS-hot at 0.75 V buys a respin. Hold is still usually FF-cold."
    ),
  },
  {
    id: "q-bto-eco",
    stage: "tapeout",
    difficulty: "junior",
    question: loc(
      "Dopo BTO puoi ancora piazzare una NAND2 nuova in un hole?",
      "After BTO can you still place a new NAND2 in a hole?"
    ),
    choices: loc(
      [
        "Sì, BTO congela solo il package",
        "No: BTO congela FEOL (diffusion/poly/implant). Nuova cella = respin FEOL. Metal-only = spare già presenti + metal/via",
        "Sì se LVS passa",
        "No solo se è LVT",
      ],
      [
        "Yes, BTO only freezes the package",
        "No: BTO freezes FEOL (diffusion/poly/implant). A new cell = FEOL respin. Metal-only = existing spares + metal/via",
        "Yes if LVS passes",
        "No only if it is LVT",
      ]
    ),
    correct: 1,
    explain: loc(
      "Spare cells si piazzano PRIMA del BTO. Dopo, si riwirano. MTO congela anche il metal.",
      "Spare cells are placed BEFORE BTO. After, you rewire them. MTO freezes metal too."
    ),
  },
  {
    id: "q-mbist-ir",
    stage: "power",
    difficulty: "senior",
    question: loc(
      "In MBIST la corrente SRAM è 1.8× func. Firmi IR solo sul mode funzionale?",
      "In MBIST SRAM current is 1.8× func. Do you sign IR on functional mode only?"
    ),
    choices: loc(
      [
        "Sì, BIST dura due minuti",
        "No: peak IR può collassare V o fondere via anche in test. Scenario BIST (o peak-current) è parte del signoff",
        "Sì perché 400 MHz < 1.2 GHz implica meno I",
        "No, quindi disattivi MBIST",
      ],
      [
        "Yes, BIST lasts two minutes",
        "No: peak IR can collapse V or fuse vias even in test. A BIST scenario (or peak-current) is part of signoff",
        "Yes because 400 MHz < 1.2 GHz implies less I",
        "No, therefore you disable MBIST",
      ]
    ),
    correct: 1,
    explain: loc(
      "EM (MTTF) può tollerare minuti; IR peak no. Frequenza più bassa non significa array più quieti: March patterns switchano banche.",
      "EM (MTTF) may tolerate minutes; peak IR does not. Lower frequency does not mean quiet arrays: March patterns switch banks."
    ),
  },
  {
    id: "q-sso-l",
    stage: "package",
    difficulty: "senior",
    question: loc(
      "SSO scala principalmente con…",
      "SSO scales primarily with…"
    ),
    choices: loc(
      [
        "L_loop del return × di/dt × N bit che commutano insieme",
        "Solo Cgate delle std cell interne",
        "Solo il WNS",
        "Il numero di layer di fill",
      ],
      [
        "Return-path L_loop × di/dt × N bits switching together",
        "Only Cgate of internal std cells",
        "Only WNS",
        "The number of fill layers",
      ]
    ),
    correct: 0,
    explain: loc(
      "Vbounce ≈ L di/dt. Riduci L (più bump VSS, flip-chip), di/dt (slew, stagger), N (bus splitting). Decap on-die taglia il droop locale.",
      "Vbounce ≈ L di/dt. Cut L (more VSS bumps, flip-chip), di/dt (slew, stagger), N (bus splitting). On-die decap cuts local droop."
    ),
  },
  {
    id: "q-mcp-hold",
    stage: "sta",
    difficulty: "senior",
    question: loc(
      "set_multicycle_path 4 -setup. Cosa fai sul hold?",
      "set_multicycle_path 4 -setup. What do you do for hold?"
    ),
    choices: loc(
      [
        "Di solito -hold 1 (o 3 se il tool conta end-point): hold resta 1 ciclo, altrimenti il path è un false hold di 4 cicli",
        "Anche -hold 4, sempre",
        "Niente: hold ignora MCP",
        "False path automatico",
      ],
      [
        "Usually -hold 1 (or 3 if the tool is end-point counted): hold stays 1 cycle, otherwise the path is a 4-cycle false hold",
        "Always -hold 4 too",
        "Nothing: hold ignores MCP",
        "Automatic false path",
      ]
    ),
    correct: 0,
    explain: loc(
      "Setup MCP=4 allunga il required. Hold MCP=4 lo allunga troppo e maschera race veri. Default industriale: setup N, hold 1, documentato.",
      "Setup MCP=4 stretches required. Hold MCP=4 stretches it too far and hides real races. Industrial default: setup N, hold 1, documented."
    ),
  },
  {
    id: "q-drv-first",
    stage: "sta",
    difficulty: "junior",
    question: loc(
      "Prima di credere a un WNS di −6 ps post-route, cosa deve essere zero?",
      "Before you believe a −6 ps post-route WNS, what must be zero?"
    ),
    choices: loc(
      [
        "DRV: max_tran / max_cap (e preferibilmente noise). Fuori caratterizzazione il .lib estrapola",
        "Il numero di spare cells",
        "L'overflow a esattamente 0.000%",
        "Il leakage",
      ],
      [
        "DRV: max_tran / max_cap (and preferably noise). Outside characterization the .lib extrapolates",
        "Spare-cell count",
        "Overflow at exactly 0.000%",
        "Leakage",
      ]
    ),
    correct: 0,
    explain: loc(
      "NLDM/CCS sono tabelle boundate. Slew fuori range ⇒ delay di fantasia. DRV=0 è exit criterion, poi SI, poi WNS.",
      "NLDM/CCS are bounded tables. Slew out of range ⇒ fantasy delay. DRV=0 is an exit criterion, then SI, then WNS."
    ),
  },
  {
    id: "q-occ",
    stage: "cts",
    difficulty: "senior",
    question: loc(
      "OCC (on-chip clock control) per at-speed test è, per CTS:",
      "OCC (on-chip clock control) for at-speed test is, for CTS:"
    ),
    choices: loc(
      [
        "Un clock root extra con mux/sync: glitch check come un ICG, latency verso i sink, mode capture nel MMMC",
        "Solo un pin ATE, niente tree",
        "Un lock-up latch",
        "Un filler cap",
      ],
      [
        "An extra clock root with mux/sync: glitch checks like an ICG, latency to sinks, capture mode in MMMC",
        "Only an ATE pin, no tree",
        "A lock-up latch",
        "A filler cap",
      ]
    ),
    correct: 0,
    explain: loc(
      "OCC lancia 1–2 pulse a f funzionale. Se il mux glitcha, il test (e il silicon) muore. CTS deve vederlo come root, non come datapath.",
      "OCC launches 1–2 pulses at functional f. If the mux glitches, the test (and silicon) dies. CTS must see it as a root, not as datapath."
    ),
  },
  {
    id: "q-fill-spef",
    stage: "layout",
    difficulty: "junior",
    question: loc(
      "SPEF di signoff senza metal fill merged. Cosa succede al WNS?",
      "Signoff SPEF without merged metal fill. What happens to WNS?"
    ),
    choices: loc(
      [
        "Cground/coupling sbagliati: WNS può muoversi di decine di ps vs silicon",
        "Niente: il fill è dummy",
        "WNS migliora sempre di 50 ps",
        "LEC fallisce",
      ],
      [
        "Wrong Cground/coupling: WNS can move tens of ps vs silicon",
        "Nothing: fill is dummy",
        "WNS always improves by 50 ps",
        "LEC fails",
      ]
    ),
    correct: 0,
    explain: loc(
      "Fill grounded aumenta C. Fill floating accoppia. Signoff extraction = GDS merged. P&R database senza fill è un pre-check.",
      "Grounded fill raises C. Floating fill couples. Signoff extraction = merged GDS. P&R database without fill is a pre-check."
    ),
  },
  {
    id: "q-black-em",
    stage: "power",
    difficulty: "senior",
    question: loc(
      "J via = 1.6×Jmax, n=2. MTTF rispetto al target 10 anni (stessa T)?",
      "Via J = 1.6×Jmax, n=2. MTTF vs a 10-year target (same T)?"
    ),
    choices: loc(
      [
        "MTTF ∝ J^(−n) → 10 / 1.6² ≈ 3.9 anni — fail",
        "1.6× è solo 60% in più: ancora 10 anni",
        "MTTF cresce con J",
        "n=2 implica MTTF infinito",
      ],
      [
        "MTTF ∝ J^(−n) → 10 / 1.6² ≈ 3.9 years — fail",
        "1.6× is only 60% more: still 10 years",
        "MTTF grows with J",
        "n=2 implies infinite MTTF",
      ]
    ),
    correct: 0,
    explain: loc(
      "Black's law è potenza, non lineare. 1.6× su un via di clock è un classico fail. Via array, non 'è solo 60%'.",
      "Black's law is a power law, not linear. 1.6× on a clock via is a classic fail. Via arrays, not 'it is only 60%'."
    ),
  },
  {
    id: "q-hfns",
    stage: "routing",
    difficulty: "junior",
    question: loc(
      "Reset e scan_en con 80k sink. Li tratti come clock in CTS?",
      "Reset and scan_en with 80k sinks. Do you treat them as clocks in CTS?"
    ),
    choices: loc(
      [
        "No: HFNS (high-fanout non-clock) → buffer tree / clone. CTS è per clock (skew/duty/NDR)",
        "Sì, stesso ccopt",
        "Sì, clock mesh anche sul reset",
        "No, un INV X32 basta",
      ],
      [
        "No: HFNS (high-fanout non-clock) → buffer tree / clones. CTS is for clocks (skew/duty/NDR)",
        "Yes, same ccopt",
        "Yes, clock mesh on reset too",
        "No, one X32 INV is enough",
      ]
    ),
    correct: 0,
    explain: loc(
      "Un X32 non guida 80k gate. HFNS synthesis prima del detailed. Clock cells su un reset sprecano NDR e power.",
      "An X32 does not drive 80k gates. HFNS synthesis before detailed. Clock cells on a reset waste NDR and power."
    ),
  },
];

export interface WorkedExample {
  id: string;
  stage: StageId;
  title: Localized;
  given: Localized<string[]>;
  steps: { title: Localized; body: Localized }[];
  result: Localized;
}

export const workedExamples: WorkedExample[] = [
  {
    id: "ex-setup",
    stage: "sta",
    title: loc("Calcolo slack setup a mano (colloquio classico)", "Hand-compute setup slack (classic interview)"),
    given: loc(
      [
        "Tclk = 1.00 ns (1 GHz)",
        "Tco = 80 ps, Tpd combinational = 720 ps, Tsu = 40 ps",
        "Tclk_launch = 310 ps, Tclk_capture = 350 ps",
        "Uncertainty (jitter+margin) = 50 ps",
      ],
      [
        "Tclk = 1.00 ns (1 GHz)",
        "Tco = 80 ps, combinational Tpd = 720 ps, Tsu = 40 ps",
        "Tclk_launch = 310 ps, Tclk_capture = 350 ps",
        "Uncertainty (jitter+margin) = 50 ps",
      ]
    ),
    steps: [
      {
        title: loc("Arrival time", "Arrival time"),
        body: loc(
          "AT = Tclk_launch + Tco + Tpd = 310 + 80 + 720 = 1110 ps.",
          "AT = Tclk_launch + Tco + Tpd = 310 + 80 + 720 = 1110 ps."
        ),
      },
      {
        title: loc("Required time", "Required time"),
        body: loc(
          "RT = Tclk_capture + Tclk − Tsu − Tunc = 350 + 1000 − 40 − 50 = 1260 ps.",
          "RT = Tclk_capture + Tclk − Tsu − Tunc = 350 + 1000 − 40 − 50 = 1260 ps."
        ),
      },
      {
        title: loc("Skew check", "Skew check"),
        body: loc(
          "Skew = 350 − 310 = +40 ps → aiuta setup. Slack = RT − AT = 1260 − 1110 = +150 ps.",
          "Skew = 350 − 310 = +40 ps → helps setup. Slack = RT − AT = 1260 − 1110 = +150 ps."
        ),
      },
    ],
    result: loc(
      "WNS setup su questo path = +150 ps. Passa. Se Tpd fosse 900 ps, AT=1290, slack=−30 ps → VT-swap/upsize o useful skew extra.",
      "Setup WNS on this path = +150 ps. Pass. If Tpd were 900 ps, AT=1290, slack=−30 ps → VT-swap/upsize or extra useful skew."
    ),
  },
  {
    id: "ex-hold",
    stage: "sta",
    title: loc("Hold sullo stesso path (corner FF)", "Hold on the same path (FF corner)"),
    given: loc(
      [
        "Stessi skew: launch 310 ps, capture 350 ps (skew +40 ps, AVVERSO al hold)",
        "Min delays: Tco=45 ps, Tpd=60 ps, Thold=25 ps",
        "Uncertainty hold = 20 ps",
      ],
      [
        "Same skew: launch 310 ps, capture 350 ps (skew +40 ps, ADVERSE to hold)",
        "Min delays: Tco=45 ps, Tpd=60 ps, Thold=25 ps",
        "Hold uncertainty = 20 ps",
      ]
    ),
    steps: [
      {
        title: loc("Hold inequality", "Hold inequality"),
        body: loc(
          "Serve Tco + Tpd ≥ Thold + Tskew + Tunc → 45+60 = 105 vs 25+40+20 = 85. Slack hold = 105−85 = +20 ps.",
          "Need Tco + Tpd ≥ Thold + Tskew + Tunc → 45+60 = 105 vs 25+40+20 = 85. Hold slack = 105−85 = +20 ps."
        ),
      },
      {
        title: loc("Se lo scan stitch accorcia Tpd a 20 ps", "If scan stitch shortens Tpd to 20 ps"),
        body: loc(
          "105 diventa 65. Slack = 65−85 = −20 ps. Fix: delay cell ~25 ps sul data, o ridurre skew locale.",
          "105 becomes 65. Slack = 65−85 = −20 ps. Fix: ~25 ps delay cell on data, or reduce local skew."
        ),
      },
    ],
    result: loc(
      "Hold non dipende da Tclk. Il +40 ps di useful skew che salvava setup sta mangiando hold: è il trade-off da citare al colloquio.",
      "Hold does not depend on Tclk. The +40 ps of useful skew that saved setup is eating hold: that is the trade-off to cite in interview."
    ),
  },
  {
    id: "ex-die",
    stage: "floorplan",
    title: loc("Stima die area da netlist", "Estimate die area from netlist"),
    given: loc(
      [
        "Std cells: 1.8 mm² (da report sintesi)",
        "Macros SRAM+PHY: 2.4 mm²",
        "Target U_core = 70%",
        "IO ring + seal ≈ 0.35 mm per lato su un die ~quadrato",
      ],
      [
        "Std cells: 1.8 mm² (from synthesis report)",
        "SRAM+PHY macros: 2.4 mm²",
        "Target U_core = 70%",
        "IO ring + seal ≈ 0.35 mm per side on a ~square die",
      ]
    ),
    steps: [
      {
        title: loc("Core", "Core"),
        body: loc(
          "A_placeable = 1.8+2.4 = 4.2 mm². A_core = 4.2 / 0.70 = 6.00 mm² → lato core ≈ 2.45 mm.",
          "A_placeable = 1.8+2.4 = 4.2 mm². A_core = 4.2 / 0.70 = 6.00 mm² → core side ≈ 2.45 mm."
        ),
      },
      {
        title: loc("Die", "Die"),
        body: loc(
          "Lato die ≈ 2.45 + 2×0.35 = 3.15 mm. A_die ≈ 9.9 mm². Utilizzazione DIE (non core) è più bassa perché include IO.",
          "Die side ≈ 2.45 + 2×0.35 = 3.15 mm. A_die ≈ 9.9 mm². DIE utilization (not core) is lower because it includes IO."
        ),
      },
    ],
    result: loc(
      "Al colloquio specifica SEMPRE se U è su core o die. I foundry quote il die; il PD parla di core utilization.",
      "In interview ALWAYS say whether U is core or die. Foundry quotes die; PD talks core utilization."
    ),
  },
  {
    id: "ex-ir",
    stage: "pdn",
    title: loc("IR drop da bump a cella", "IR drop from bump to cell"),
    given: loc(
      [
        "VDD = 0.75 V, limite statico 5% → 37.5 mV",
        "Corrente media del blocco CPU = 800 mA",
        "R_bump+RDL = 8 mΩ, R_mesh = 12 mΩ, R_via stack = 6 mΩ, R_rail = 10 mΩ",
      ],
      [
        "VDD = 0.75 V, static limit 5% → 37.5 mV",
        "CPU block average current = 800 mA",
        "R_bump+RDL = 8 mΩ, R_mesh = 12 mΩ, R_via stack = 6 mΩ, R_rail = 10 mΩ",
      ]
    ),
    steps: [
      {
        title: loc("R serie", "Series R"),
        body: loc(
          "Rtot = 8+12+6+10 = 36 mΩ. Vdrop = 0.8 A × 0.036 Ω = 28.8 mV (3.84%).",
          "Rtot = 8+12+6+10 = 36 mΩ. Vdrop = 0.8 A × 0.036 Ω = 28.8 mV (3.84%)."
        ),
      },
      {
        title: loc("Margine", "Margin"),
        body: loc(
          "28.8 < 37.5 ma il dynamic può aggiungere L·di/dt. Se un burst da 2 A per 200 ps con Lpkg=50 pH: V = 50e-12 × (2/200e-12) = 0.5 V — catastrofico senza decap.",
          "28.8 < 37.5 but dynamic can add L·di/dt. A 2 A burst for 200 ps with Lpkg=50 pH: V = 50e-12 × (2/200e-12) = 0.5 V — catastrophic without decap."
        ),
      },
    ],
    result: loc(
      "Static IR è necessario ma insufficiente. Al colloquio porta sempre il pezzo induttivo e il ruolo delle decap on-die.",
      "Static IR is necessary but not sufficient. In interview always bring the inductive piece and on-die decap."
    ),
  },
  {
    id: "ex-antenna",
    stage: "routing",
    title: loc("Antenna ratio cumulativo", "Cumulative antenna ratio"),
    given: loc(
      [
        "Gate area = 0.02 µm²",
        "M1 connected during etch = 6 µm²",
        "M2 connected = 4 µm² (via già aperto verso M1)",
        "Rmax M1 = 200, Rmax M2 cumul = 400",
      ],
      [
        "Gate area = 0.02 µm²",
        "M1 connected during etch = 6 µm²",
        "M2 connected = 4 µm² (via already open to M1)",
        "Rmax M1 = 200, Rmax M2 cumulative = 400",
      ]
    ),
    steps: [
      {
        title: loc("Layer M1", "Layer M1"),
        body: loc(
          "R1 = 6 / 0.02 = 300 > 200 → FAIL. Jumper a M3 o diodo.",
          "R1 = 6 / 0.02 = 300 > 200 → FAIL. Jumper to M3 or diode."
        ),
      },
      {
        title: loc("Se jumper M1→M3 dopo 2 µm", "If jumper M1→M3 after 2 µm"),
        body: loc(
          "Area M1 esposta scende a 2 µm² → R1 = 100. PASS. Il diodo è piano B se non c'è routing resource in alto.",
          "Exposed M1 area drops to 2 µm² → R1 = 100. PASS. Diode is plan B if upper routing resource is gone."
        ),
      },
    ],
    result: loc(
      "Antenna è cumulativa per layer di processo, non un singolo wire. Calibre applica il deck foundry, non la tua formula da foglio.",
      "Antenna is cumulative per process layer, not a single wire. Calibre applies the foundry deck, not your spreadsheet formula."
    ),
  },
  {
    id: "ex-fo4",
    stage: "rtl",
    title: loc("Budget FO4 a 1.2 GHz in 7 nm", "FO4 budget at 1.2 GHz in 7 nm"),
    given: loc(
      [
        "t_FO4 ≈ 12 ps in 7 nm SS@0.75 V (ordine di grandezza da letteratura/PDK)",
        "f = 1.2 GHz → Tclk = 833 ps",
        "Overhead clock (jitter+skew+su+co) ≈ 180 ps",
      ],
      [
        "t_FO4 ≈ 12 ps in 7 nm SS@0.75 V (order of magnitude from literature/PDK)",
        "f = 1.2 GHz → Tclk = 833 ps",
        "Clock overhead (jitter+skew+su+co) ≈ 180 ps",
      ]
    ),
    steps: [
      {
        title: loc("Logica utile", "Useful logic"),
        body: loc(
          "Tlogic = 833 − 180 = 653 ps → 653/12 ≈ 54 FO4 di logica per ciclo. Un 64-bit adder CLA sta in ~15–25 FO4: entra. Un moltiplicatore 64×64 no → pipeline.",
          "Tlogic = 833 − 180 = 653 ps → 653/12 ≈ 54 FO4 of logic per cycle. A 64-bit CLA adder is ~15–25 FO4: fits. A 64×64 multiplier does not → pipeline."
        ),
      },
    ],
    result: loc(
      "Questa stima si fa a RTL, mesi prima del PD. Se il datapath è a 80 FO4, nessun placer ti salva.",
      "This estimate is done at RTL, months before PD. If the datapath is 80 FO4, no placer will save you."
    ),
  },
  {
    id: "ex-cts-skew",
    stage: "cts",
    title: loc("Budget di skew a 1.2 GHz", "Skew budget at 1.2 GHz"),
    given: loc(
      [
        "Tclk = 833 ps",
        "Overhead fisso: Tco+Tsu+jitter = 160 ps",
        "OCV/AOCV extra sul clock path (depth 12) ≈ 35 ps",
        "Vuoi ≥ 40 FO4 di logica (FO4 = 12 ps) → 480 ps",
      ],
      [
        "Tclk = 833 ps",
        "Fixed overhead: Tco+Tsu+jitter = 160 ps",
        "Extra OCV/AOCV on the clock path (depth 12) ≈ 35 ps",
        "Want ≥ 40 FO4 of logic (FO4 = 12 ps) → 480 ps",
      ]
    ),
    steps: [
      {
        title: loc("Cosa resta allo skew", "What is left for skew"),
        body: loc(
          "Tlogic_max = Tclk − overhead − OCV − skew_budget. 833 − 160 − 35 − skew = 480 → skew_budget ≤ 158 ps. Target industriale HPC è molto più stretto (20–50 ps tree, <15 ps mesh) per lasciare margine SI/IR.",
          "Tlogic_max = Tclk − overhead − OCV − skew_budget. 833 − 160 − 35 − skew = 480 → skew_budget ≤ 158 ps. Industrial HPC targets are much tighter (20–50 ps tree, <15 ps mesh) to leave SI/IR margin."
        ),
      },
      {
        title: loc("Useful skew", "Useful skew"),
        body: loc(
          "Se un path ha bisogno di +40 ps sul capture, quel +40 è −40 sul path successivo (zero-sum). Si usa su endpoint critici, non come '158 ps ovunque'.",
          "If a path needs +40 ps on capture, that +40 is −40 on the next path (zero-sum). Use it on critical endpoints, not as '158 ps everywhere'."
        ),
      },
    ],
    result: loc(
      "Skew è un budget che mangia FO4. Mesh costa power; tree costa OCV. Al colloquio quantifica, non dire 'minimizziamo lo skew'.",
      "Skew is a budget that eats FO4. Mesh costs power; tree costs OCV. In interview quantify, do not say 'we minimize skew'."
    ),
  },
  {
    id: "ex-overflow",
    stage: "routing",
    title: loc("Overflow da capacity GCell", "Overflow from GCell capacity"),
    given: loc(
      [
        "GCell 1.2 µm × 1.2 µm su M2",
        "Track pitch M2 = 48 nm → ~25 track/GCell in una direzione",
        "Demand stimata nel canale SRAM = 31 track-equivalent (net + via blockage 20%)",
      ],
      [
        "GCell 1.2 µm × 1.2 µm on M2",
        "M2 track pitch = 48 nm → ~25 tracks/GCell in one direction",
        "Estimated demand in the SRAM channel = 31 track-equivalent (nets + 20% via blockage)",
      ]
    ),
    steps: [
      {
        title: loc("Capacity netta", "Net capacity"),
        body: loc(
          "Capacity bruta 25, blockage via/NDR ~20% → ~20 track utili. Demand 31 → overflow = (31−20)/20 = 55% su QUEL GCell. Un '8% medio' nasconde picchi così.",
          "Gross capacity 25, via/NDR blockage ~20% → ~20 useful tracks. Demand 31 → overflow = (31−20)/20 = 55% on THAT GCell. An '8% average' hides peaks like this."
        ),
      },
      {
        title: loc("Cosa muove il numero", "What moves the number"),
        body: loc(
          "Allargare il canale (più GCell), pin-orient, layer promote su M3/M4 (capacity extra), spread. Detailed S&R non crea track.",
          "Widen the channel (more GCells), pin-orient, layer-promote to M3/M4 (extra capacity), spread. Detailed S&R does not create tracks."
        ),
      },
    ],
    result: loc(
      "Overflow = (demand−capacity)/capacity per GCell. Si legge la mappa, non la media. 55% locale è floorplan, non un effort flag.",
      "Overflow = (demand−capacity)/capacity per GCell. Read the map, not the average. 55% local is floorplan, not an effort flag."
    ),
  },
  {
    id: "ex-lockup",
    stage: "sta",
    title: loc("Hold scan con e senza lock-up", "Scan hold with and without lock-up"),
    given: loc(
      [
        "Due FF, clock domain A e B, stitch SI",
        "Tco_min + Twire_min = 40 ps",
        "Thold + unc = 30 ps",
        "Skew A→B (capture B tardi) = +90 ps",
      ],
      [
        "Two FFs, clock domains A and B, SI stitch",
        "Tco_min + Twire_min = 40 ps",
        "Thold + unc = 30 ps",
        "Skew A→B (B capture late) = +90 ps",
      ]
    ),
    steps: [
      {
        title: loc("Senza lock-up", "Without lock-up"),
        body: loc(
          "Hold slack = 40 − (30+90) = −80 ps. Tshift è 100 ns e non entra. Delay cell da 90 ps sul SI occupa area e può creare setup a 10 MHz (qui setup è facile) ma resta fragile a OCV.",
          "Hold slack = 40 − (30+90) = −80 ps. Tshift is 100 ns and does not enter. A 90 ps delay cell on SI costs area and can create setup at 10 MHz (setup is easy here) but stays OCV-fragile."
        ),
      },
      {
        title: loc("Con lock-up (livello)", "With lock-up (level)"),
        body: loc(
          "Il latch è trasparente quando A è stabile e chiude prima che B catturi: il path hold non è più combo Q_A→SI_B nello stesso istante. Lo skew inter-domain viene assorbito dalla fase. Restano solo hold INTRA-domain (delay locali).",
          "The latch is transparent while A is stable and closes before B captures: the hold path is no longer combo Q_A→SI_B at the same instant. Inter-domain skew is absorbed by the phase. Only INTRA-domain holds remain (local delays)."
        ),
      },
    ],
    result: loc(
      "Lock-up è la risposta strutturale inter-domain. Delay cell è intra-domain. Non invertire i due al colloquio.",
      "Lock-up is the structural inter-domain answer. Delay cells are intra-domain. Do not swap them in interview."
    ),
  },
  {
    id: "ex-em-mttf",
    stage: "power",
    title: loc("MTTF via clock da Black", "Clock-via MTTF from Black"),
    given: loc(
      [
        "J / Jmax = 1.6, n = 2, Ea tipica già nel Jmax foundry @ 105 °C",
        "Target 10 anni",
        "Via singoli sullo spine",
      ],
      [
        "J / Jmax = 1.6, n = 2, typical Ea already inside foundry Jmax @ 105 °C",
        "10-year target",
        "Single vias on the spine",
      ]
    ),
    steps: [
      {
        title: loc("Scala", "Scale"),
        body: loc(
          "MTTF/MTTF0 = (Jmax/J)^n = (1/1.6)^2 = 0.39 → 3.9 anni vs target 10. Due via in parallelo (corrente ~split) → J ≈ 0.8 Jmax, (1/0.8)^2 = 1.56 → ~15.6 anni se 10 anni è definito a Jmax.",
          "MTTF/MTTF0 = (Jmax/J)^n = (1/1.6)^2 = 0.39 → 3.9 years vs 10-year target. Two vias in parallel (current ~splits) → J ≈ 0.8 Jmax, (1/0.8)^2 = 1.56 → ~15.6 years if 10 years is defined at Jmax."
        ),
      },
    ],
    result: loc(
      "Via array è un calcolo, non un rituale. Falsificare activity del clock a 0.01 per 'passare' EM è un respin annunciato.",
      "Via arrays are a calculation, not a ritual. Faking clock activity to 0.01 to 'pass' EM is an advertised respin."
    ),
  },
  {
    id: "ex-decap",
    stage: "pdn",
    title: loc("Decap per un burst di 90 ps", "Decap for a 90 ps burst"),
    given: loc(
      [
        "ΔI = 2 A per Δt = 90 ps (CPU quadrant)",
        "Budget droop extra 40 mV (oltre lo statico già a 4%)",
        "Vuoi C tale che I Δt / C ≤ 40 mV",
      ],
      [
        "ΔI = 2 A for Δt = 90 ps (CPU quadrant)",
        "Extra droop budget 40 mV (on top of static already at 4%)",
        "Want C such that I Δt / C ≤ 40 mV",
      ]
    ),
    steps: [
      {
        title: loc("C minima", "Minimum C"),
        body: loc(
          "C ≥ I Δt / ΔV = 2 × 90×10⁻¹² / 0.040 = 4.5 nF nel quadrante. ESR/ESL: le cap devono stare VICINO all'hotspot, non a 2 mm.",
          "C ≥ I Δt / ΔV = 2 × 90×10⁻¹² / 0.040 = 4.5 nF in the quadrant. ESR/ESL: caps must sit NEAR the hotspot, not 2 mm away."
        ),
      },
      {
        title: loc("Inrush", "Inrush"),
        body: loc(
          "4.5 nF a VDD=0.75 V è 3.4 nC. Se il power-on è 1 µs, I_inrush ≈ 3.4 nC / 1 µs = 3.4 mA (ok). Se è 10 ns, 340 mA extra: si simula lo startup.",
          "4.5 nF at VDD=0.75 V is 3.4 nC. If power-on is 1 µs, I_inrush ≈ 3.4 nC / 1 µs = 3.4 mA (ok). If it is 10 ns, 340 mA extra: simulate startup."
        ),
      },
    ],
    result: loc(
      "Decap è C, distanza, e inrush. 5% di area è un'euristica da junior; il senior fa I Δt / C.",
      "Decap is C, distance, and inrush. 5% of area is a junior heuristic; a senior does I Δt / C."
    ),
  },
];
