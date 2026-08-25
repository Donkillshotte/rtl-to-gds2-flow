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
];
