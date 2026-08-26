import { loc, type Localized } from "@/i18n/context";
import type { StageId } from "./stages";

export interface ScenarioStep {
  prompt: Localized;
  choices: Localized<string[]>;
  correct: number;
  debrief: Localized;
}

export interface Scenario {
  id: string;
  stage: StageId | "cross";
  title: Localized;
  role: Localized;
  briefing: Localized;
  symptoms: Localized<string[]>;
  steps: ScenarioStep[];
  closing: Localized;
}

/** Multi-step war-room drills: you are the PD. Numbers are industrial-order, not a specific PDK. */
export const scenarios: Scenario[] = [
  {
    id: "sc-hold-cts",
    stage: "cts",
    title: loc("Hold esplode dopo CTS", "Hold explodes after CTS"),
    role: loc("Sei il PD owner del blocco CPU @ 1.2 GHz.", "You own the CPU block @ 1.2 GHz."),
    briefing: loc(
      "Ieri il place+opt era verde: setup WNS +8 ps, hold WNS +40 ps (clock ideale). Oggi ccopt_design ha chiuso. Il report post-CTS dice setup WNS −12 ps e hold WNS −85 ps su ~2.4k endpoint. Il clock è 833 ps. Skew locale sul path peggiore: launch 310 ps, capture 385 ps.",
      "Yesterday place+opt was green: setup WNS +8 ps, hold WNS +40 ps (ideal clock). Today ccopt_design closed. Post-CTS report: setup WNS −12 ps and hold WNS −85 ps on ~2.4k endpoints. Clock is 833 ps. Local skew on the worst path: launch 310 ps, capture 385 ps."
    ),
    symptoms: loc(
      [
        "Tclk = 833 ps",
        "Skew (cap−lnch) = +75 ps sul path hold peggiore",
        "Tco+Tpd min ≈ 55 ps, Thold+unc ≈ 65 ps",
        "2.4k hold fail, 18 setup fail",
      ],
      [
        "Tclk = 833 ps",
        "Skew (cap−lnch) = +75 ps on the worst hold path",
        "Tco+Tpd min ≈ 55 ps, Thold+unc ≈ 65 ps",
        "2.4k hold fails, 18 setup fails",
      ]
    ),
    steps: [
      {
        prompt: loc(
          "Perché hold era verde pre-CTS e rosso ora?",
          "Why was hold green pre-CTS and red now?"
        ),
        choices: loc(
          [
            "Il periodo è cambiato: hold dipende da Tclk",
            "Pre-CTS il clock è ideale (skew ≈ 0). Il +75 ps di skew è un ritardo sul capture: hold slack = (Tco+Tpd) − (Th+skew+unc)",
            "CTS ha allungato i data path di 85 ps",
            "Serve un derate OCV più aggressivo sul data",
          ],
          [
            "The period changed: hold depends on Tclk",
            "Pre-CTS the clock is ideal (skew ≈ 0). +75 ps skew delays capture: hold slack = (Tco+Tpd) − (Th+skew+unc)",
            "CTS lengthened data paths by 85 ps",
            "You need a more aggressive OCV derate on data",
          ]
        ),
        correct: 1,
        debrief: loc(
          "Hold NON dipende da Tclk. Slack ≈ 55 − (65+75) = −85 ps. Il useful/unbalanced skew che a volte salva setup è il killer di hold. I 2.4k fail sono tipici: migliaia di path corti vicini (scan, reset, datapath locale).",
          "Hold does NOT depend on Tclk. Slack ≈ 55 − (65+75) = −85 ps. The useful/unbalanced skew that sometimes saves setup is the hold killer. 2.4k fails are typical: thousands of short nearby paths (scan, reset, local datapath)."
        ),
      },
      {
        prompt: loc(
          "Prima mossa operativa — cosa NON fai?",
          "First operational move — what do you NOT do?"
        ),
        choices: loc(
          [
            "report_timing -late/-early sul path, poi mappa skew locale vs data min",
            "Inserire 2.4k delay cell a caso dal GUI",
            "Separare scan_shift vs func: molti hold sono solo shift",
            "Chiedere a CTS di ridurre skew su quei cluster (CTO, non rebuild cieco)",
          ],
          [
            "report_timing -late/-early on the path, then map local skew vs min data",
            "Drop 2.4k delay cells at random from the GUI",
            "Split scan_shift vs func: many holds are shift-only",
            "Ask CTS to cut skew on those clusters (CTO, not a blind rebuild)",
          ]
        ),
        correct: 1,
        debrief: loc(
          "Delay cell a tappeto alza area, power e crea setup. Prima: classi di path (func vs scan), cluster geografici, poi delay selettivo / size down del data / ridurre skew. Scan hold si fissa spesso con lock-up latch, non con 2000 BUF.",
          "Carpet delay cells grow area, power and create setup. First: path classes (func vs scan), geographic clusters, then selective delay / data downsize / cut skew. Scan hold is often a lock-up latch, not 2000 BUF."
        ),
      },
      {
        prompt: loc(
          "Il path setup −12 ps ha SI delta +38 ps e logic 190 ps. Arma giusta?",
          "The −12 ps setup path has SI delta +38 ps and 190 ps logic. Right weapon?"
        ),
        choices: loc(
          [
            "VT-swap LVT su tutta la catena",
            "Alzare Tclk a 900 ps e ridisegnare il prodotto",
            "Pulire SI (spacing/shield/layer) sul net dominante; solo dopo size/skew se resta rosso",
            "set_false_path: è rumore di tool",
          ],
          [
            "LVT swap the whole chain",
            "Raise Tclk to 900 ps and redesign the product",
            "Clean SI (spacing/shield/layer) on the dominant net; only then size/skew if still red",
            "set_false_path: it is tool noise",
          ]
        ),
        correct: 2,
        debrief: loc(
          "38 ps di 12 sono SI. Upsize cieco peggiora coupling. False path su un path funzionale è un bug di silicon. Questo è il round che distingue il senior.",
          "38 of those 12 ps are SI. Blind upsize worsens coupling. A false path on a functional path is a silicon bug. This is the round that separates seniors."
        ),
      },
    ],
    closing: loc(
      "Regola da portare al colloquio: hold si chiude DOPO CTS; setup si lavora da place. Skew positivo aiuta setup e mangia hold. Leggi SI prima di toccare Vt.",
      "Interview rule: close hold AFTER CTS; work setup from place. Positive skew helps setup and eats hold. Read SI before you touch Vt."
    ),
  },
  {
    id: "sc-cong",
    stage: "routing",
    title: loc("Overflow 8% su M2, detailed in fiamme", "8% M2 overflow, detailed on fire"),
    role: loc("Sei il router owner a 7 nm, 9 metal.", "You own routing at 7 nm, 9 metals."),
    briefing: loc(
      "Global route: overflow medio 8.2% su M2, picco 22% tra due banche SRAM. Detailed dopo 12h ha 14k DRC (short+spacing) e 900 net aperti. Utilization core 78%. Le SRAM hanno i pin verso il muro, non verso il canale.",
      "Global route: 8.2% average overflow on M2, 22% peak between two SRAM banks. Detailed after 12 h has 14k DRC (short+spacing) and 900 opens. Core utilization 78%. SRAM pins face the wall, not the channel."
    ),
    symptoms: loc(
      [
        "Overflow M2 8.2% avg / 22% peak",
        "GCell peggiori: canale 4 µm tra macro",
        "Pin density locale > 400 pin/µm",
        "Clock NDR già su M4–M6",
      ],
      [
        "M2 overflow 8.2% avg / 22% peak",
        "Worst GCells: 4 µm channel between macros",
        "Local pin density > 400 pins/µm",
        "Clock NDR already on M4–M6",
      ]
    ),
    steps: [
      {
        prompt: loc(
          "Il detailed 'si sistema in search & repair'?",
          "Will detailed 'just work it out in search & repair'?"
        ),
        choices: loc(
          [
            "Sì, 12h non bastano: rilancia con effort high",
            "No. Overflow globale >~3–5% a 7 nm non è un problema di S&R: è capacity. Torni a place/floorplan",
            "Sì, basta via doubling su M2",
            "No, ma il fix è solo alzare il clock NDR",
          ],
          [
            "Yes, 12 h is not enough: rerun with high effort",
            "No. Global overflow >~3–5% at 7 nm is not an S&R problem: it is capacity. Back to place/floorplan",
            "Yes, just via-double M2",
            "No, but the fix is only raising clock NDR",
          ]
        ),
        correct: 1,
        debrief: loc(
          "S&R ripara DRC locali, non un canale saturato. 8% overflow medio è un segnale di stop. Via doubling PEGGIORA capacity. NDR clock già mangia M4–M6.",
          "S&R fixes local DRC, not a saturated channel. 8% average overflow is a stop sign. Via doubling WORSENS capacity. Clock NDR already eats M4–M6."
        ),
      },
      {
        prompt: loc(
          "Ordine di attacco corretto?",
          "Correct attack order?"
        ),
        choices: loc(
          [
            "Ruota/sposta SRAM (pin verso canale), allarga il canale, spread place, layer promote net caldi, poi re-global",
            "Cell padding globale +20% e prega",
            "Taglia 3 metal layer dal stack per risparmiare mask",
            "set_max_fanout 1 su tutto il design",
          ],
          [
            "Rotate/move SRAM (pins to channel), widen the channel, spread place, layer-promote hot nets, then re-global",
            "Global cell padding +20% and pray",
            "Drop 3 metal layers from the stack to save masks",
            "set_max_fanout 1 on the whole design",
          ]
        ),
        correct: 0,
        debrief: loc(
          "Il 70% della congestion nasce dal floorplan (macro + pin). Padding globale esplode l'area. Fanout 1 è sintesi, non routing. Layer promote è tattica; macro pin è strategia.",
          "70% of congestion is born in floorplan (macros + pins). Global padding explodes area. Fanout 1 is synthesis, not routing. Layer promote is tactics; macro pins are strategy."
        ),
      },
      {
        prompt: loc(
          "Dopo lo spread, overflow 1.8% ma 40 net HFNS (reset, scan_en) restano aperti. Cosa sono?",
          "After spread, overflow is 1.8% but 40 HFNS nets (reset, scan_en) stay open. What are they?"
        ),
        choices: loc(
          [
            "Clock: vanno in CTS",
            "High fanout non-clock: vogliono un buffer tree / clone, non un net da 80k sink su M2",
            "False path, li puoi leave-open",
            "Si fissano con un solo inverter X32",
          ],
          [
            "Clocks: they belong in CTS",
            "High-fanout non-clock: they want a buffer tree / clones, not one net with 80k sinks on M2",
            "False paths — you may leave them open",
            "Fix with a single X32 inverter",
          ]
        ),
        correct: 1,
        debrief: loc(
          "Reset e scan_enable sono HFNS. CTS è per clock. Un X32 non guida 80k gate. HFNS synthesis / clone / tree prima del detailed.",
          "Reset and scan_enable are HFNS. CTS is for clocks. An X32 does not drive 80k gates. HFNS synthesis / clones / tree before detailed."
        ),
      },
    ],
    closing: loc(
      "Overflow è un numero di capacity, non di pazienza. Macro pin, canali e HFNS prima del detailed. Non mentire al GKC con 900 open.",
      "Overflow is a capacity number, not a patience number. Macro pins, channels and HFNS before detailed. Do not lie to GKC with 900 opens."
    ),
  },
  {
    id: "sc-ir",
    stage: "power",
    title: loc("Hotspot IR 7.2% sotto la CPU", "7.2% IR hotspot under the CPU"),
    role: loc("Power-grid owner, VDD = 0.75 V, limite statico 5%.", "Power-grid owner, VDD = 0.75 V, static limit 5%."),
    briefing: loc(
      "Static IR: max 7.2% (54 mV) in un quadrante della CPU. Media die 2.1%. I bump VDD in quella zona sono 4, spaziati 180 µm. La mesh M8/M9 è a pitch 30 µm. Dynamic (VCD worst di/dt) tocca 12% per 90 ps. EM vias sullo strap M9→M8 a J = 1.4×Jmax.",
      "Static IR: max 7.2% (54 mV) in one CPU quadrant. Die average 2.1%. That zone has 4 VDD bumps, 180 µm pitch. M8/M9 mesh pitch is 30 µm. Dynamic (worst di/dt VCD) hits 12% for 90 ps. EM on M9→M8 strap vias at J = 1.4×Jmax."
    ),
    symptoms: loc(
      [
        "VDD 0.75 V → 5% = 37.5 mV; misura 54 mV",
        "I_avg CPU quadrant ≈ 1.1 A",
        "R path bump→cell ≈ 49 mΩ (54 mV / 1.1 A)",
        "Dynamic 12% / 90 ps; EM via 1.4×",
      ],
      [
        "VDD 0.75 V → 5% = 37.5 mV; measured 54 mV",
        "CPU quadrant I_avg ≈ 1.1 A",
        "Bump→cell path R ≈ 49 mΩ (54 mV / 1.1 A)",
        "Dynamic 12% / 90 ps; via EM 1.4×",
      ]
    ),
    steps: [
      {
        prompt: loc(
          "Perché la media die 2.1% è irrilevante per il signoff?",
          "Why is the 2.1% die average irrelevant for signoff?"
        ),
        choices: loc(
          [
            "Perché il limite è RMS, non picco",
            "Il cell delay dipende dal V locale. Un hotspot è un corner SS locale: STA IR-aware usa la voltage map per istanza",
            "Perché 2.1% è già sopra il limite",
            "La media include GND bounce e basta quella",
          ],
          [
            "Because the limit is RMS, not peak",
            "Cell delay depends on local V. A hotspot is a local SS corner: IR-aware STA uses a per-instance voltage map",
            "Because 2.1% is already over the limit",
            "The average already includes GND bounce and that is enough",
          ]
        ),
        correct: 1,
        debrief: loc(
          "Signoff è worst instance, non media. 7.2% statico fallisce da solo. Dynamic 12% è un secondo fail. GND bounce si somma: servi entrambe le rail.",
          "Signoff is worst instance, not average. 7.2% static already fails. Dynamic 12% is a second fail. GND bounce adds: you serve both rails."
        ),
      },
      {
        prompt: loc(
          "Piano che un senior firma?",
          "A plan a senior will sign?"
        ),
        choices: loc(
          [
            "Waiver: '90 ps sono corti, lo STA non se ne accorge'",
            "Più bump VDD/VSS nel quadrante, mesh più densa, via array (EM), decap vicino all'hotspot, poi re-extract + IR-aware STA",
            "Alzare VDD a 0.9 V in tutta la SoC",
            "Rimuovere clock gating per 'spalmare' la corrente",
          ],
          [
            "Waiver: '90 ps is short, STA will not notice'",
            "More VDD/VSS bumps in the quadrant, denser mesh, via arrays (EM), decap near the hotspot, then re-extract + IR-aware STA",
            "Raise VDD to 0.9 V across the SoC",
            "Remove clock gating to 'spread' current",
          ]
        ),
        correct: 1,
        debrief: loc(
          "Bump map è floorplan. Mesh e via array tagliano R e J. Decap taglia L·di/dt. Togliere ICG PEGGIORA il di/dt. VDD 0.9 V è un altro prodotto (power, EM, oxide).",
          "Bump map is floorplan. Mesh and via arrays cut R and J. Decap cuts L·di/dt. Removing ICG WORSENS di/dt. 0.9 V VDD is a different product (power, EM, oxide)."
        ),
      },
      {
        prompt: loc(
          "ΔV ≈ I·Δt/C. Burst 2 A × 90 ps, vuoi tenere il droop extra sotto 40 mV. C minima on-die nel quadrante?",
          "ΔV ≈ I·Δt/C. 2 A × 90 ps burst, extra droop under 40 mV. Minimum on-die C in the quadrant?"
        ),
        choices: loc(
          [
            "C = I Δt / ΔV = 2 × 90e-12 / 0.04 = 4.5 nF",
            "C = 2 / 0.04 = 50 F",
            "C = 90 ps / 2 A = 45 pF",
            "Le decap non si calcolano, si mettono a 5% di area e basta",
          ],
          [
            "C = I Δt / ΔV = 2 × 90e-12 / 0.04 = 4.5 nF",
            "C = 2 / 0.04 = 50 F",
            "C = 90 ps / 2 A = 45 pF",
            "Decap is not calculated — just 5% of area",
          ]
        ),
        correct: 0,
        debrief: loc(
          "4.5 nF in un quadrante è tanto: MOSCAP + filler cap, vicino all'hotspot (ESR/ESL). 5% area è una euristica, non un signoff. Troppa decap = inrush a power-on: si simula anche quello.",
          "4.5 nF in a quadrant is a lot: MOSCAP + filler cap, near the hotspot (ESR/ESL). 5% area is a heuristic, not signoff. Too much decap = power-on inrush: simulate that too."
        ),
      },
    ],
    closing: loc(
      "IR/EM si chiude con bump + mesh + via + decap, poi voltage map in STA. Media die e waiver da corridoio non passano il GKC.",
      "Close IR/EM with bumps + mesh + vias + decap, then a voltage map in STA. Die averages and hallway waivers do not pass GKC."
    ),
  },
  {
    id: "sc-eco-gkc",
    stage: "tapeout",
    title: loc("ECO metal-only a 48 h dal GKC", "Metal-only ECO 48 h before GKC"),
    role: loc("Tapeout lead. BTO è lunedì, oggi è giovedì.", "Tapeout lead. BTO is Monday, today is Thursday."),
    briefing: loc(
      "STA signoff: un path AXI ha −9 ps setup solo al corner SS@0.75 V/−40 °C (temp inversion). TNS −9 ps (un path). DFT coverage 99.2% (target 99%). DRC 0, LVS CORRECT. Il FE vuole 'un AND gate in più' sulla ready. Tu hai 3% spare cells (NAND2/NOR2/INV) e metal 4–9 ancora aperti. FEOL è freeze candidate.",
      "STA signoff: one AXI path has −9 ps setup only at SS@0.75 V/−40 °C (temp inversion). TNS −9 ps (one path). DFT coverage 99.2% (target 99%). DRC 0, LVS CORRECT. FE wants 'one extra AND on ready'. You have 3% spare cells (NAND2/NOR2/INV) and metals 4–9 still open. FEOL is a freeze candidate."
    ),
    symptoms: loc(
      [
        "WNS −9 ps, TNS −9 ps, 1 path",
        "Spare: NAND2×8k, INV×12k, zero AND2 esplicite",
        "LEC golden = netlist post-route attuale",
        "GKC checklist: STA, PV, IR, DFT, UPF, PKG",
      ],
      [
        "WNS −9 ps, TNS −9 ps, 1 path",
        "Spares: NAND2×8k, INV×12k, no explicit AND2",
        "LEC golden = current post-route netlist",
        "GKC checklist: STA, PV, IR, DFT, UPF, PKG",
      ]
    ),
    steps: [
      {
        prompt: loc(
          "L'AND extra è metal-only?",
          "Is the extra AND metal-only?"
        ),
        choices: loc(
          [
            "Sì, metal-only significa qualsiasi ECO",
            "No: nuova funzione = transistor nuovi o spare riwire. FEOL freeze vieta implant/poly nuovi. Si usa spare (NAND+INV = AND) e solo metal/via",
            "Sì se lo fai in Innovus senza GDS",
            "No, quindi GKC è impossibile: respin",
          ],
          [
            "Yes, metal-only means any ECO",
            "No: new function = new transistors or spare rewire. FEOL freeze forbids new implant/poly. Use a spare (NAND+INV = AND) and metal/via only",
            "Yes if you do it in Innovus without GDS",
            "No, so GKC is impossible: respin",
          ]
        ),
        correct: 1,
        debrief: loc(
          "AND2 = NAND2 + INV. Spare gate + metal è ancora metal-only. Nuovo standard cell piazzato in un hole FEOL è un ECO funzionale: slitta BTO.",
          "AND2 = NAND2 + INV. Spare gate + metal is still metal-only. A newly placed standard cell in a FEOL hole is a functional ECO: BTO slips."
        ),
      },
      {
        prompt: loc(
          "Il −9 ps: prima l'ECO funzionale o il timing?",
          "The −9 ps: functional ECO first or timing first?"
        ),
        choices: loc(
          [
            "Prima size/LVT sul path (un endpoint), re-STA tutti i corner, POI ECO spare se FE insiste — LEC vs nuovo golden",
            "False path sull'AXI ready: tanto è −9 ps",
            "Alza il clock di 9 ps nel datasheet",
            "Ignora temp inversion, è un artefatto",
          ],
          [
            "First size/LVT on the path (one endpoint), re-STA all corners, THEN spare ECO if FE insists — LEC vs new golden",
            "False-path AXI ready: it is only −9 ps",
            "Raise the clock 9 ps in the datasheet",
            "Ignore temp inversion, it is an artifact",
          ]
        ),
        correct: 0,
        debrief: loc(
          "Un path solo: size o useful skew locale. False path su ready è un bug di protocollo. Temp inversion a 7 nm è reale (SS-cold). LEC deve seguire il golden nuovo, altrimenti il GKC DFT/formal veta.",
          "One path: size or local useful skew. A false path on ready is a protocol bug. Temp inversion at 7 nm is real (SS-cold). LEC must follow the new golden, or GKC DFT/formal vetoes."
        ),
      },
      {
        prompt: loc(
          "DFT 99.2% vs target 99%. Veti il GKC?",
          "DFT 99.2% vs 99% target. Do you veto GKC?"
        ),
        choices: loc(
          [
            "Sì, 0.2% è troppo",
            "No se il report ATPG è sul netlist ECO-finale, stuck-at e transition sui mode giusti, e i 0.8% uncovered sono documented (RAM analog, analog hard IP)",
            "No sempre: 99.2 > 99",
            "Sì finché non hai 100% — il target è marketing",
          ],
          [
            "Yes, 0.2% is too much",
            "No if ATPG is on the final ECO netlist, stuck-at and transition in the right modes, and the 0.8% uncovered is documented (analog RAM, analog hard IP)",
            "Always no: 99.2 > 99",
            "Yes until 100% — the target is marketing",
          ]
        ),
        correct: 1,
        debrief: loc(
          "Coverage sul netlist sbagliato è un veto. Coverage sul golden ECO con hole documentati è un pass. 100% su analog non esiste. Il numero senza lista di untestable è una slide, non evidenza.",
          "Coverage on the wrong netlist is a veto. Coverage on the ECO golden with documented holes is a pass. 100% on analog does not exist. A number without the untestable list is a slide, not evidence."
        ),
      },
    ],
    closing: loc(
      "GKC = evidenza tool sul database finale. Metal-only = spare + metal. Un path di 9 ps si legge, non si waivera. LEC e ATPG seguono l'ECO.",
      "GKC = tool evidence on the final database. Metal-only = spares + metal. A 9 ps path is read, not waived. LEC and ATPG follow the ECO."
    ),
  },
  {
    id: "sc-dft-scan",
    stage: "sta",
    title: loc("Scan shift: 12k hold, capture verde", "Scan shift: 12k holds, capture green"),
    role: loc("DFT+STA owner. Stuck-at 10 MHz, at-speed capture a 1.2 GHz.", "DFT+STA owner. Stuck-at 10 MHz, at-speed capture at 1.2 GHz."),
    briefing: loc(
      "Funzionale: hold WNS +15 ps. Scan shift (SE=1, 10 MHz): hold WNS −120 ps su 12k path, quasi tutti SI→Q tra FF vicini. Capture (SE=0, launch/capture at-speed): setup WNS −4 ps su 6 path. Lock-up latch non è sul domain crossing dello scan stitch. Compression (OCC/EDT) inserita in sintesi.",
      "Functional: hold WNS +15 ps. Scan shift (SE=1, 10 MHz): hold WNS −120 ps on 12k paths, almost all SI→Q between nearby FFs. Capture (SE=0, at-speed launch/capture): setup WNS −4 ps on 6 paths. No lock-up latch on the scan-stitch domain crossing. Compression (OCC/EDT) inserted at synthesis."
    ),
    symptoms: loc(
      [
        "Tshift = 100 ns (10 MHz) — setup shift è facile",
        "Hold shift indipendente da Tshift",
        "Skew locale CTS 40–90 ps tra FF adiacenti",
        "Stitch A-domain → B-domain senza lock-up",
      ],
      [
        "Tshift = 100 ns (10 MHz) — shift setup is easy",
        "Shift hold does not depend on Tshift",
        "Local CTS skew 40–90 ps between adjacent FFs",
        "A-domain → B-domain stitch with no lock-up",
      ]
    ),
    steps: [
      {
        prompt: loc(
          "Perché 10 MHz non salva lo hold di shift?",
          "Why does 10 MHz not save shift hold?"
        ),
        choices: loc(
          [
            "Perché il tester è FF/highV",
            "Hold slack = data_min − (Th+skew+unc): Tclk non c'entra. Shift collega Q→SI di vicini: data_min piccolissimo",
            "Perché 10 MHz è più lento e hold peggiora sempre",
            "Perché ATPG usa un corner che non esiste",
          ],
          [
            "Because the tester is FF/highV",
            "Hold slack = data_min − (Th+skew+unc): Tclk does not enter. Shift connects Q→SI of neighbors: data_min is tiny",
            "Because 10 MHz is slower and hold always gets worse",
            "Because ATPG uses a corner that does not exist",
          ]
        ),
        correct: 1,
        debrief: loc(
          "Shift a bassa freq chiude SETUP, non HOLD. I path SI→Q sono i più corti del chip. Skew CTS tra due FF vicini basta a fallire. Corner hold = FF/highV/cold anche in scan.",
          "Low-frequency shift closes SETUP, not HOLD. SI→Q paths are the shortest on the chip. CTS skew between two neighbors is enough to fail. Hold corner = FF/highV/cold in scan too."
        ),
      },
      {
        prompt: loc(
          "Fix strutturale vs cosmetico?",
          "Structural vs cosmetic fix?"
        ),
        choices: loc(
          [
            "Lock-up latch (o lock-up FF) su ogni stitch tra clock domain / su segmenti lunghi; delay cell solo sui SI locali; lock-up NON è un buffer",
            "Alza shift a 100 MHz così 'c'è più hold'",
            "set_false_path -from SE",
            "Rimuovi scan: a 99% coverage tanto vale",
          ],
          [
            "Lock-up latch (or lock-up FF) on every stitch across clock domains / long segments; delay cells only on local SI; a lock-up is NOT a buffer",
            "Raise shift to 100 MHz so 'there is more hold'",
            "set_false_path -from SE",
            "Remove scan: 99% coverage is close enough",
          ]
        ),
        correct: 0,
        debrief: loc(
          "Lock-up spezza il path hold con una fase (livello) extra. È la risposta da libro Tessent/DFT compiler. False path su SE spegne il test. Alzare f_shift peggiora setup e non aiuta hold.",
          "Lock-up breaks the hold path with an extra phase (level). That is the Tessent/DFT-compiler textbook answer. False-pathing SE kills the test. Raising f_shift hurts setup and does not help hold."
        ),
      },
      {
        prompt: loc(
          "I 6 path capture −4 ps: che mode è?",
          "The 6 capture paths at −4 ps: which mode?"
        ),
        choices: loc(
          [
            "Stuck-at shift",
            "At-speed launch-on-capture/launch-on-shift: è timing funzionale a 1.2 GHz con SE transitorio — si chiude come setup funzionale (size/SI/skew), non con lock-up",
            "MBIST",
            "Un corner che puoi escludere dal MMMC",
          ],
          [
            "Stuck-at shift",
            "At-speed launch-on-capture/launch-on-shift: functional timing at 1.2 GHz with transient SE — close it like functional setup (size/SI/skew), not with lock-up",
            "MBIST",
            "A corner you may drop from MMMC",
          ]
        ),
        correct: 1,
        debrief: loc(
          "Capture at-speed è il modo in cui testi transition delay. È uno scenario MMMC obbligatorio. Lock-up è per shift. MBIST è un altro clock/mode sulle RAM.",
          "At-speed capture is how you test transition delay. It is a mandatory MMMC scenario. Lock-up is for shift. MBIST is another clock/mode on RAMs."
        ),
      },
    ],
    closing: loc(
      "Scan è un mode STA, non un afterthought. Shift hold → lock-up + delay locale. Capture at-speed → setup. Coverage sul netlist finale.",
      "Scan is an STA mode, not an afterthought. Shift hold → lock-up + local delay. At-speed capture → setup. Coverage on the final netlist."
    ),
  },
  {
    id: "sc-dfm",
    stage: "pv",
    title: loc("Coloring conflict e via singola", "Coloring conflict and single vias"),
    role: loc("PV owner, 7 nm LELE su M2/M3.", "PV owner, 7 nm LELE on M2/M3."),
    briefing: loc(
      "Calibre DRC: 0 spacing classici, ma 186 coloring conflict su M2 (odd cycle) e 22k via singole su clock+PG (via doubling rule del DFM deck). Litho hotspot: 14 punti con PV-band > spec. Il router 'DRC-clean' in Innovus usava un deck ridotto.",
      "Calibre DRC: 0 classical spacing, but 186 M2 coloring conflicts (odd cycles) and 22k single vias on clock+PG (DFM via-doubling rule). Litho hotspots: 14 sites with PV-band > spec. The 'DRC-clean' Innovus router used a reduced deck."
    ),
    symptoms: loc(
      [
        "Innovus DRC = 0 (deck P&R)",
        "Calibre signoff: 186 color, 22k via-1, 14 litho",
        "Clock su M4 con via M3–M4 singoli",
        "Fill non ancora merged",
      ],
      [
        "Innovus DRC = 0 (P&R deck)",
        "Calibre signoff: 186 color, 22k via-1, 14 litho",
        "Clock on M4 with single M3–M4 vias",
        "Fill not merged yet",
      ]
    ),
    steps: [
      {
        prompt: loc(
          "Perché Innovus era verde e Calibre no?",
          "Why was Innovus green and Calibre not?"
        ),
        choices: loc(
          [
            "Calibre è bugato, si firma Innovus",
            "P&R usa un subset di regole (runtime). Signoff è il deck foundry completo: coloring, DFM, antenna cumulativa, density window, litho",
            "Manca solo il fill, poi i 186 spariscono",
            "Coloring è un warning CAD",
          ],
          [
            "Calibre is buggy — sign Innovus",
            "P&R uses a rule subset (runtime). Signoff is the full foundry deck: coloring, DFM, cumulative antenna, density windows, litho",
            "Only fill is missing, then the 186 vanish",
            "Coloring is a CAD warning",
          ]
        ),
        correct: 1,
        debrief: loc(
          "A 7 nm il coloring è DRC di processo. Fill può creare NUOVI DRC, non cancellare odd cycle. GKC guarda Calibre, non il counter del router.",
          "At 7 nm coloring is process DRC. Fill can CREATE new DRC, not delete odd cycles. GKC watches Calibre, not the router counter."
        ),
      },
      {
        prompt: loc(
          "Odd cycle su M2: cosa fai al layout?",
          "M2 odd cycle: what do you do in layout?"
        ),
        choices: loc(
          [
            "Waiver scritto 'LELE è robusto'",
            "Spread/ripartition delle shape (cut, jog, layer jump) finché il grafo è bipartito; il router ha color-aware/LELE mode",
            "Raddoppia tutti i via del chip",
            "Cambia il PDK layer map",
          ],
          [
            "Written waiver: 'LELE is robust'",
            "Spread/repartition shapes (cut, jog, layer jump) until the graph is bipartite; the router has color-aware/LELE mode",
            "Double every via on the chip",
            "Change the PDK layer map",
          ]
        ),
        correct: 1,
        debrief: loc(
          "Coloring = 2-colorability. Odd cycle non è colorabile. Via doubling è un'altra regola (yield/EM), utile su clock/PG ma non risolve un odd cycle M2.",
          "Coloring = 2-colorability. An odd cycle is not colorable. Via doubling is another rule (yield/EM), useful on clock/PG but it does not fix an M2 odd cycle."
        ),
      },
      {
        prompt: loc(
          "22k via-1 sul clock: priorità?",
          "22k via-1 on clock: priority?"
        ),
        choices: loc(
          [
            "Double-via / via array su clock e PG prima; signal basso-corrente dopo se il deck lo esige; non saturare M2",
            "Double-via su TUTTI i net, subito",
            "Ignora: via-1 è DFM 'advisory'",
            "Slotting delle via",
          ],
          [
            "Double-via / via-array on clock and PG first; low-current signal later if the deck requires it; do not saturate M2",
            "Double-via on ALL nets immediately",
            "Ignore: via-1 is 'advisory' DFM",
            "Slot the vias",
          ]
        ),
        correct: 0,
        debrief: loc(
          "Clock e PG sono EM + yield critici. Double-via globale mangia tracks e crea coloring. Slotting è per metal larghi, non per via. Se il deck foundry marca via-1 come error su clock, è error.",
          "Clock and PG are EM + yield critical. Global double-via eats tracks and creates coloring. Slotting is for fat metal, not vias. If the foundry deck marks clock via-1 as error, it is error."
        ),
      },
    ],
    closing: loc(
      "Signoff PV = deck foundry sul GDS merged. Coloring, via doubling, litho, density, antenna. Il counter DRC del P&R è un pre-check.",
      "PV signoff = foundry deck on merged GDS. Coloring, via doubling, litho, density, antenna. The P&R DRC counter is a pre-check."
    ),
  },
  {
    id: "sc-floor-macro",
    stage: "floorplan",
    title: loc("Flyline da 2 mm e PLL nel traffico", "2 mm flylines and a PLL in traffic"),
    role: loc("Floorplan owner, die 4.2 × 4.2 mm, 14 SRAM + 2 PHY + PLL.", "Floorplan owner, 4.2 × 4.2 mm die, 14 SRAM + 2 PHY + PLL."),
    briefing: loc(
      "Prima pass: U_core 71% sulla carta. Flyline: il controller L2 è a 2.1 mm dalle sue 8 SRAM. PLL in mezzo al datapath CPU. PHY SERDES a nord, bump correlati a sud. Canali tra SRAM 3 µm. Il place stima WNS −280 ps (WLM). IR preliminare già 6% nel centro.",
      "First pass: U_core 71% on paper. Flylines: L2 controller is 2.1 mm from its 8 SRAMs. PLL sits in the CPU datapath. SERDES PHY is north, matching bumps south. SRAM channels 3 µm. Place estimates WNS −280 ps (WLM). Preliminary IR already 6% in the center."
    ),
    symptoms: loc(
      [
        "Wire delay 7 nm ~ 80–150 ps/mm su M4 (ordine)",
        "2.1 mm → 170–300 ps solo di filo sul path L2",
        "PLL analog: coupling + jitter se vicino a digital noisy",
        "RDL nord→sud attraversa tutto il die",
      ],
      [
        "7 nm wire delay ~ 80–150 ps/mm on M4 (order of mag.)",
        "2.1 mm → 170–300 ps of wire alone on the L2 path",
        "Analog PLL: coupling + jitter next to noisy digital",
        "North→south RDL crosses the whole die",
      ]
    ),
    steps: [
      {
        prompt: loc(
          "Il WNS −280 ps 'lo sistema il placer'?",
          "Will the placer 'just fix' −280 ps WNS?"
        ),
        choices: loc(
          [
            "Sì, il placer accorcia i net",
            "No: 2 mm di macro-to-logic è geometria. Il placer non attraversa le SRAM. Si ruotano/spostano macro e si allargano i canali PRIMA di place",
            "Sì con useful skew di 280 ps",
            "No, ma basta pipeline RTL e il floorplan resta",
          ],
          [
            "Yes, the placer shortens nets",
            "No: 2 mm of macro-to-logic is geometry. The placer does not walk through SRAM. Rotate/move macros and widen channels BEFORE place",
            "Yes with 280 ps of useful skew",
            "No, but RTL pipeline is enough and the floorplan stays",
          ]
        ),
        correct: 1,
        debrief: loc(
          "Pipeline può essere necessaria, ma 2 mm di SRAM lontane restano congestion + IR + via. Useful skew di 280 ps è un intero ciclo a 3 GHz, non un trick CTS. Macro first.",
          "Pipeline may still be needed, but 2 mm of distant SRAM remains congestion + IR + vias. 280 ps of useful skew is a whole cycle at 3 GHz, not a CTS trick. Macros first."
        ),
      },
      {
        prompt: loc(
          "PLL in mezzo al CPU: rischio principale?",
          "PLL in the middle of the CPU: main risk?"
        ),
        choices: loc(
          [
            "Area: il PLL è grande",
            "Substrate/power noise e coupling sui analog pins; keepout, guard ring, PG dedicato, lontano da IO switching e datapath",
            "CTS non trova il root",
            "LEC fallisce",
          ],
          [
            "Area: the PLL is large",
            "Substrate/power noise and coupling on analog pins; keepout, guard ring, dedicated PG, away from switching IO and datapath",
            "CTS cannot find the root",
            "LEC fails",
          ]
        ),
        correct: 1,
        debrief: loc(
          "Il PLL è analog. Digitale switching modula VCO. Si mette in un quiet corner, bump analog dedicati, no digital straps sopra i nodi sensitive.",
          "The PLL is analog. Digital switching modulates the VCO. Quiet corner, dedicated analog bumps, no digital straps over sensitive nodes."
        ),
      },
      {
        prompt: loc(
          "PHY nord / bump sud: cosa muovi?",
          "PHY north / bumps south: what do you move?"
        ),
        choices: loc(
          [
            "Niente: RDL è gratis",
            "O il PHY verso i bump, o il bump map (co-design package). RDL lungo = C, IR, SI, yield",
            "Solo un layer in più di RDL",
            "Il clock mesh copre anche il RDL",
          ],
          [
            "Nothing: RDL is free",
            "Either the PHY toward the bumps, or the bump map (package co-design). Long RDL = C, IR, SI, yield",
            "Just one extra RDL layer",
            "The clock mesh covers RDL too",
          ]
        ),
        correct: 1,
        debrief: loc(
          "Bump map è floorplan. Deciderla a fine PD è rifare il chip. Extra RDL layer è un costo di process/package, non un fix gratis.",
          "Bump map is floorplan. Deciding it at the end of PD is redoing the chip. Extra RDL layer is process/package cost, not a free fix."
        ),
      },
    ],
    closing: loc(
      "Floorplan review = flyline + canali + analog keepout + bump. Il 70% del PPA si decide qui. Place non è una macchina del tempo.",
      "Floorplan review = flylines + channels + analog keepout + bumps. 70% of PPA is decided here. Place is not a time machine."
    ),
  },
  {
    id: "sc-em-clk",
    stage: "power",
    title: loc("EM sul clock: via a 1.6×Jmax", "Clock EM: vias at 1.6×Jmax"),
    role: loc("Signoff EM, clock 1.2 GHz, activity ~2 (due edge/ciclo).", "EM signoff, 1.2 GHz clock, activity ~2 (two edges/cycle)."),
    briefing: loc(
      "Power EM sugli strap PG è verde. Signal EM: 340 via M3–M4 sul clock spine con Jrms = 1.6×Jmax @ 105 °C. Metal M4 è a 0.9×. MTTF target 10 anni. Il clock è NDR width 2× ma via singoli. Toggle del datapath è 0.15, del clock è 2.",
      "Power EM on PG straps is green. Signal EM: 340 M3–M4 vias on the clock spine at Jrms = 1.6×Jmax @ 105 °C. M4 metal is 0.9×. MTTF target 10 years. Clock is 2× NDR width but single vias. Datapath toggle 0.15, clock toggle 2."
    ),
    symptoms: loc(
      [
        "Black: MTTF ∝ J^(−n), n≈1–2 (via) / ~2 (metal)",
        "1.6^2 ≈ 2.56 → MTTF ~ 10/2.56 ≈ 3.9 anni se n=2",
        "Clock activity >> data",
        "Via Jmax << metal Jmax",
      ],
      [
        "Black: MTTF ∝ J^(−n), n≈1–2 (via) / ~2 (metal)",
        "1.6^2 ≈ 2.56 → MTTF ~ 10/2.56 ≈ 3.9 years if n=2",
        "Clock activity >> data",
        "Via Jmax << metal Jmax",
      ]
    ),
    steps: [
      {
        prompt: loc(
          "Perché il PG è verde e il clock no?",
          "Why is PG green and the clock not?"
        ),
        choices: loc(
          [
            "Il PG non ha corrente",
            "Signal EM sul clock è RMS/peak ad alta frequenza e activity 2; il via è il collo. PG è DC distribuito su array di via",
            "Il tool EM ignora il PG",
            "Il clock è in HVT",
          ],
          [
            "PG carries no current",
            "Clock signal EM is high-frequency RMS/peak with activity 2; the via is the bottleneck. PG is DC spread across via arrays",
            "The EM tool ignores PG",
            "The clock is HVT",
          ]
        ),
        correct: 1,
        debrief: loc(
          "Due mondi: power EM (DC, straps, via array) e signal EM (clock/reset ad alto toggle). Allargare M4 non basta se il via resta singolo.",
          "Two worlds: power EM (DC, straps, via arrays) and signal EM (high-toggle clock/reset). Widening M4 is not enough if the via stays single."
        ),
      },
      {
        prompt: loc(
          "Fix che chiude MTTF senza distruggere CTS?",
          "A fix that closes MTTF without wrecking CTS?"
        ),
        choices: loc(
          [
            "Via array / double-via obbligatorio su spine, redondanza, eventualmente un metal più alto a R minore; non downsize il clock driver sotto DRV",
            "Riduci fclk a 400 MHz",
            "set_switching_activity clock 0.01 per 'passare' EM",
            "Togli NDR così c'è più spazio per via",
          ],
          [
            "Mandatory via-array / double-via on the spine, redundancy, maybe a higher lower-R metal; do not downsize the clock driver below DRV",
            "Cut fclk to 400 MHz",
            "set_switching_activity clock 0.01 to 'pass' EM",
            "Drop NDR so there is more room for vias",
          ]
        ),
        correct: 0,
        debrief: loc(
          "Falsificare activity è frode di signoff. Togliere NDR peggiora SI e EM metal. La corrente del clock è reale: si dà una via ladder da adulto.",
          "Faking activity is signoff fraud. Dropping NDR worsens SI and metal EM. Clock current is real: give it an adult via ladder."
        ),
      },
    ],
    closing: loc(
      "EM = J e T, non solo IR. Clock via è un classico fail. MTTF 10 anni @ Tmax, activity onesta, via array.",
      "EM = J and T, not just IR. Clock vias are a classic fail. MTTF 10 years @ Tmax, honest activity, via arrays."
    ),
  },
  {
    id: "sc-sso",
    stage: "package",
    title: loc("SSO sul PHY DDR: bounce da centinaia di mV", "DDR PHY SSO: hundreds of mV bounce"),
    role: loc("Co-design PD + package. 32 DQ commutano insieme.", "PD + package co-design. 32 DQ switch together."),
    briefing: loc(
      "Flip-chip, ma il PHY ha 8 bump VSS e 40 bump segnale. IBIS: edge 1 V / 200 ps, Cpin≈2 pF. Lpkg equivalente verso VSS di ritorno ≈ 1.8 nH (loop). Il die ha poco decap sotto il PHY. SI sul byte-lane già mostra overshoot. Il bump map è 'già tapeout del substrate'.",
      "Flip-chip, but the PHY has 8 VSS bumps and 40 signal bumps. IBIS: 1 V / 200 ps edge, Cpin≈2 pF. Equivalent Lpkg on the VSS return ≈ 1.8 nH (loop). Little on-die decap under the PHY. Byte-lane SI already shows overshoot. Bump map is 'already substrate tapeout'."
    ),
    symptoms: loc(
      [
        "I_pin ≈ C dv/dt = 2e-12 × (1/200e-12) = 10 mA per DQ",
        "32 DQ → 0.32 A simultanei (ordine, senza I/O buffer extra)",
        "V ≈ L di/dt: se di/dt ~ 0.32 A / 200 ps = 1.6e9 A/s → V ~ 1.8e-9 × 1.6e9 ≈ 2.9 V (pessimo, loop intero)",
        "Il numero reale è minore (non tutti gli edge coincidono) ma l'ordine è centinaia di mV",
      ],
      [
        "I_pin ≈ C dv/dt = 2e-12 × (1/200e-12) = 10 mA per DQ",
        "32 DQ → 0.32 A simultaneous (order of mag., ignoring extra I/O buffer current)",
        "V ≈ L di/dt: if di/dt ~ 0.32 A / 200 ps = 1.6e9 A/s → V ~ 1.8e-9 × 1.6e9 ≈ 2.9 V (pessimistic full loop)",
        "Reality is lower (edges do not coincide) but the order is hundreds of mV",
      ]
    ),
    steps: [
      {
        prompt: loc(
          "Qual è il primo errore di bump map?",
          "What is the first bump-map mistake?"
        ),
        choices: loc(
          [
            "Troppi bump segnale",
            "Rapporto power/ground troppo basso sul PHY: il return path è il loop L. Serve un ratio alto VSS/VDD accanto a ogni byte",
            "Flip-chip non serve decap",
            "DDR non fa SSO per definizione",
          ],
          [
            "Too many signal bumps",
            "Power/ground ratio too low on the PHY: the return path is the L loop. You need a high VSS/VDD ratio beside every byte",
            "Flip-chip needs no decap",
            "DDR does not have SSO by definition",
          ]
        ),
        correct: 1,
        debrief: loc(
          "SSO è L·di/dt sul return. Bump VSS sparsi = loop grande. Pattern: signal-ground-signal, non un deserto di DQ.",
          "SSO is L·di/dt on the return. Sparse VSS bumps = large loop. Pattern: signal-ground-signal, not a DQ desert."
        ),
      },
      {
        prompt: loc(
          "Substrate già tapeout. Cosa ti resta sul die?",
          "Substrate already taped out. What is left on the die?"
        ),
        choices: loc(
          [
            "Niente, è troppo tardi",
            "On-die decap sotto il PHY, slew control / drive down se spec tiene, stagger degli enable, RDL corta; il bump map morto si mitiga, non si elimina",
            "Inverti DQ e VSS nel GDS (i bump fisici restano)",
            "Alza VDDIO a 2.5 V",
          ],
          [
            "Nothing, it is too late",
            "On-die decap under the PHY, slew/drive down if spec allows, stagger enables, short RDL; a frozen bump map is mitigated, not erased",
            "Swap DQ and VSS in GDS (physical bumps stay)",
            "Raise VDDIO to 2.5 V",
          ]
        ),
        correct: 1,
        debrief: loc(
          "Co-design day-1 esiste proprio per non arrivare qui. Mitigazione die-only è parziale: Lpkg resta. Al colloquio dillo: bump map è floorplan.",
          "Day-1 co-design exists so you never arrive here. Die-only mitigation is partial: Lpkg remains. Say it in interview: bump map is floorplan."
        ),
      },
    ],
    closing: loc(
      "SSO si dimensiona con IBIS + Lpkg + N bit. Ratio PG sui bump e decap on-die. Package non è 'dopo il GDS'.",
      "Size SSO with IBIS + Lpkg + N bits. PG ratio on bumps and on-die decap. Package is not 'after GDS'."
    ),
  },
  {
    id: "sc-tns",
    stage: "sta",
    title: loc("WNS −6 ps, TNS −95 ns: migliaia di path", "WNS −6 ps, TNS −95 ns: thousands of paths"),
    role: loc("Timing lead a PRO exit.", "Timing lead at PRO exit."),
    briefing: loc(
      "Post-route: WNS −6 ps, TNS −95 ns, 18k violating endpoint, tutti nello stesso dominio 1.2 GHz. Histogram: il grosso è tra −6 e −2 ps. Un secondo report: max_tran 1.2k viol, max_cap 400. SI on. Il FE chiede 'un buffer sul path peggiore'.",
      "Post-route: WNS −6 ps, TNS −95 ns, 18k violating endpoints, all in the 1.2 GHz domain. Histogram: most sit between −6 and −2 ps. Second report: 1.2k max_tran, 400 max_cap. SI on. FE asks for 'a buffer on the worst path'."
    ),
    symptoms: loc(
      [
        "WNS −6 ps vs TNS −95 ns → ~15k path-equivalenti",
        "DRV non zero",
        "Regressione vs pre-route WNS +40 ps",
        "Clock uncertainty 50 ps setup",
      ],
      [
        "WNS −6 ps vs TNS −95 ns → ~15k path-equivalents",
        "DRV not zero",
        "Regression vs pre-route WNS +40 ps",
        "50 ps setup clock uncertainty",
      ]
    ),
    steps: [
      {
        prompt: loc(
          "Un buffer sul WNS path chiude il chip?",
          "Does one buffer on the WNS path close the chip?"
        ),
        choices: loc(
          [
            "Sì, WNS è l'unico numero che conta",
            "No. TNS enorme = lavoro di massa. Prima DRV=0 (slew/cap), poi SI, poi opt globale (size/Vt/place densità). Un buffer sposta il WNS al path successivo di −5.9 ps",
            "Sì se il buffer è X32",
            "No, serve set_max_delay 0",
          ],
          [
            "Yes, WNS is the only number that matters",
            "No. Huge TNS = mass work. First DRV=0 (slew/cap), then SI, then global opt (size/Vt/place density). One buffer moves WNS to the next path at −5.9 ps",
            "Yes if the buffer is X32",
            "No — you need set_max_delay 0",
          ]
        ),
        correct: 1,
        debrief: loc(
          "WNS è il picco; TNS è il volume. DRV sporco rende i delay .lib estrapolati: non credere a −6 ps finché max_tran non è zero.",
          "WNS is the peak; TNS is the volume. Dirty DRV makes .lib delays extrapolated: do not believe −6 ps until max_tran is zero."
        ),
      },
      {
        prompt: loc(
          "Regressione pre-route +40 → post-route −6. Ipotesi da verificare per prima?",
          "Regression pre-route +40 → post-route −6. First hypothesis to test?"
        ),
        choices: loc(
          [
            "Il silicio è più lento del .lib",
            "WLM vs SPEF: C reale, coupling, detour, via. Confronta i path: se Tpd cell è simile e wire è esploso, è routing/congestion/SI",
            "OCV si applica solo post-route",
            "Il clock è sparito",
          ],
          [
            "Silicon is slower than .lib",
            "WLM vs SPEF: real C, coupling, detours, vias. Compare paths: if cell Tpd is similar and wire exploded, it is routing/congestion/SI",
            "OCV applies only post-route",
            "The clock vanished",
          ]
        ),
        correct: 1,
        debrief: loc(
          "Pre-route mente con WLM. Il senior fa un path-compare cell vs net. Se net +80 ps, non è un problema di RTL.",
          "Pre-route lies with WLM. A senior path-compares cell vs net. If net is +80 ps, it is not an RTL problem."
        ),
      },
    ],
    closing: loc(
      "DRV → SI → massa (TNS) → picco (WNS). Un buffer sul path 1 è teatro. Al colloquio distingui WNS/TNS e WLM/SPEF.",
      "DRV → SI → mass (TNS) → peak (WNS). One buffer on path 1 is theatre. In interview distinguish WNS/TNS and WLM/SPEF."
    ),
  },
  {
    id: "sc-mbist",
    stage: "rtl",
    title: loc("MBIST vs PD: wrapper, timing, IR", "MBIST vs PD: wrappers, timing, IR"),
    role: loc("Handoff FE→PD su un die con 14 SRAM.", "FE→PD handoff on a die with 14 SRAMs."),
    briefing: loc(
      "Il netlist arriva con MBIST wrap su 11/14 memorie. 3 analog/CAM 'non wrappabili'. Clock BIST 400 MHz da un OCC. Durante BIST la corrente stimata delle SRAM è 1.8× la funzionale. STA: il path wrapper→Q non è nel mode func. Il FE dice 'BIST è DFT, non è PD'.",
      "Netlist arrives with MBIST wrap on 11/14 memories. 3 analog/CAM 'cannot wrap'. BIST clock 400 MHz from an OCC. During BIST, estimated SRAM current is 1.8× functional. STA: wrapper→Q paths are not in func mode. FE says 'BIST is DFT, not PD'."
    ),
    symptoms: loc(
      [
        "14 RAM, 11 wrapped, 3 documented analog",
        "Mode mbist in MMMC: 400 MHz, false path verso analog",
        "IR BIST da stimare con vector o peak-current file",
        "Atpg/mbist coverage report atteso al GKC",
      ],
      [
        "14 RAMs, 11 wrapped, 3 documented analog",
        "mbist mode in MMMC: 400 MHz, false paths into analog",
        "BIST IR to estimate with vectors or peak-current file",
        "ATPG/MBIST coverage report expected at GKC",
      ]
    ),
    steps: [
      {
        prompt: loc(
          "BIST è 'non PD'?",
          "Is BIST 'not PD'?"
        ),
        choices: loc(
          [
            "Sì, solo il DFT owner firma",
            "No: wrapper sono celle, clock OCC è CTS, mode mbist è STA, corrente 1.8× è IR/EM. Il PD chiude quei mode come gli altri",
            "No, ma puoi set_false_path * in mbist",
            "Sì se le RAM sono hard macro",
          ],
          [
            "Yes, only the DFT owner signs",
            "No: wrappers are cells, OCC clock is CTS, mbist mode is STA, 1.8× current is IR/EM. PD closes those modes like the others",
            "No, but you may set_false_path * in mbist",
            "Yes if the RAMs are hard macros",
          ]
        ),
        correct: 1,
        debrief: loc(
          "Hard macro non esclude il wrap. False path globale in mbist = memorie non testate. GKC DFT veta coverage buchi non documentati.",
          "Hard macros do not exempt wrap. A global false path in mbist = untested memories. GKC DFT vetoes undocumented coverage holes."
        ),
      },
      {
        prompt: loc(
          "IR 1.8× in BIST: passi il signoff solo func?",
          "1.8× IR in BIST: do you sign off functional-only?"
        ),
        choices: loc(
          [
            "Sì, BIST dura 2 minuti in fab, non conta",
            "No. EM è tempo×J ma IR/EM peak può bruciare via anche in test. Si simula lo scenario BIST o si usa peak current; eventualmente PG più robusto sulle banche",
            "Sì perché 400 MHz è più lento di 1.2 GHz",
            "No, quindi vieti MBIST",
          ],
          [
            "Yes, BIST lasts 2 minutes in fab, it does not count",
            "No. EM is time×J but peak IR/EM can still blow vias in test. Simulate the BIST scenario or use peak current; maybe a stronger PG on the banks",
            "Yes because 400 MHz is slower than 1.2 GHz",
            "No, therefore you forbid MBIST",
          ]
        ),
        correct: 1,
        debrief: loc(
          "Due minuti a J alta possono essere ok per EM (MTTF) e ko per IR (voltage collapse → fail test, o fuse via). Si analizza, non si intuisce. 400 MHz non implica meno corrente SRAM (array switching).",
          "Two minutes at high J may be OK for EM (MTTF) and KO for IR (collapse → test fail, or fused vias). Analyze it, do not guess. 400 MHz does not mean less SRAM current (array switching)."
        ),
      },
    ],
    closing: loc(
      "DFT è un insieme di mode: scan shift/capture, MBIST, OCC. PD li implementa (celle, clock, PG, STA). Coverage e IR di test stanno nel GKC.",
      "DFT is a set of modes: scan shift/capture, MBIST, OCC. PD implements them (cells, clocks, PG, STA). Test coverage and test IR belong in GKC."
    ),
  },
];
