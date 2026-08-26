import { loc, type Localized } from "@/i18n/context";
import type { StageId } from "./stages";

export interface WarStory {
  id: string;
  title: Localized;
  stage: StageId;
  symptom: Localized;
  rootCause: Localized;
  lesson: Localized;
  tags: string[];
}

export const warStories: WarStory[] = [
  {
    id: "ws-fill-spef",
    title: loc("WNS verde senza fill SPEF", "Green WNS without fill SPEF"),
    stage: "sta",
    symptom: loc(
      "Signoff STA passava; dopo fill insertion e re-extraction WNS −40 ps su path critici.",
      "Signoff STA passed; after fill insertion and re-extraction WNS −40 ps on critical paths."
    ),
    rootCause: loc(
      "SPEF pre-fill non includeva capacitance del metal fill. Il delay firmato non era quello del tapeout GDS.",
      "Pre-fill SPEF omitted metal-fill capacitance. Signed delay was not the tapeout-GDS delay."
    ),
    lesson: loc(
      "STA signoff solo con SPEF fill-inclusive (stesso deck del tapeout).",
      "STA signoff only with fill-inclusive SPEF (same deck as tapeout)."
    ),
    tags: ["SPEF", "Fill", "WNS"],
  },
  {
    id: "ws-scan-hold",
    title: loc("12k hold su scan post-CTS", "12k scan holds post-CTS"),
    stage: "cts",
    symptom: loc(
      "Functional hold ok; scan_shift: migliaia di violazioni Q→SI tra clock domain.",
      "Functional hold OK; scan_shift: thousands of Q→SI violations across clock domains."
    ),
    rootCause: loc(
      "Lock-up cell mancanti sui crossing di scan chain. Delay cell massivi non risolvono lo skew inter-domain.",
      "Missing lock-up cells on scan-chain crossings. Massive delay cells do not fix inter-domain skew."
    ),
    lesson: loc(
      "DFT review pre-CTS: lock-up map obbligatoria. Hold inter-domain ≠ hold locale.",
      "DFT review pre-CTS: mandatory lock-up map. Inter-domain hold ≠ local hold."
    ),
    tags: ["DFT", "Hold", "Lock-up"],
  },
  {
    id: "ws-coloring",
    title: loc("GKC veto su coloring DPT", "GKC veto on DPT coloring"),
    stage: "routing",
    symptom: loc(
      "Route DRC «quasi clean»; foundry GKC rifiuta per odd-cycle conflict su M2.",
      "Route DRC «almost clean»; foundry GKC rejects for M2 odd-cycle conflict."
    ),
    rootCause: loc(
      "Double patterning: same-mask spacing violato. Conflict non risolvibile senza rip-up.",
      "Double patterning: same-mask spacing violated. Conflict unfixable without rip-up."
    ),
    lesson: loc(
      "Coloring check pre-route commit, non post-route panic.",
      "Coloring check before route commit, not post-route panic."
    ),
    tags: ["DPT", "DRC", "GKC"],
  },
  {
    id: "ws-ir-hotspot",
    title: loc("IR 8% sul critical path", "8% IR on the critical path"),
    stage: "power",
    symptom: loc(
      "STA passava a tensione nominale; silicon shmoo falliva a low-V sul blocco CPU.",
      "STA passed at nominal voltage; silicon shmoo failed at low-V on the CPU block."
    ),
    rootCause: loc(
      "Strap PDN sottodimensionato sull’hotspot; analisi solo vectorless.",
      "Undersized PDN strap on the hotspot; analysis was vectorless-only."
    ),
    lesson: loc(
      "IR signoff vector-based con VCD reale + IR-aware STA sui path caldi.",
      "Vector-based IR signoff with real VCD + IR-aware STA on hot paths."
    ),
    tags: ["IR Drop", "PDN", "Silicon"],
  },
  {
    id: "ws-ocv-pessimism",
    title: loc("Silicon passa, STA fail", "Silicon passes, STA fails"),
    stage: "sta",
    symptom: loc(
      "STA SS@0.75 V rosso; silicon funziona a 0.72 V. Team tentava di waiverare WNS.",
      "STA SS@0.75 V red; silicon works at 0.72 V. Team tried to waive WNS."
    ),
    rootCause: loc(
      "OCV flat troppo pessimistico vs POCV/LVF calibrato; corner non correlato.",
      "Flat OCV too pessimistic vs calibrated POCV/LVF; uncorrelated corner."
    ),
    lesson: loc(
      "Correlazione silicon→aggiorna POCV; non waiverare senza capire il modello.",
      "Silicon correlation→update POCV; do not waive without understanding the model."
    ),
    tags: ["POCV", "OCV", "Correlation"],
  },
  {
    id: "ws-lec-spare",
    title: loc("LEC rotto da ECO metal-only", "LEC broken by metal-only ECO"),
    stage: "tapeout",
    symptom: loc(
      "ECO «solo metal» per fix timing; LEC gate↔gate fail prima del GKC.",
      "«Metal-only» ECO for timing fix; gate↔gate LEC fails before GKC."
    ),
    rootCause: loc(
      "Spare NAND riwirata non modellata nel golden; pin invertito su spare.",
      "Rewired spare NAND not modeled in golden; inverted spare pin."
    ),
    lesson: loc(
      "LEC su ogni ECO, anche metal-only. Spare cells = logica, non decorazione.",
      "LEC on every ECO, even metal-only. Spare cells are logic, not decoration."
    ),
    tags: ["LEC", "ECO", "Spare"],
  },
];
