import { loc, type Localized } from "@/i18n/context";

export interface ComparisonRow {
  aspect: Localized;
  left: Localized;
  right: Localized;
}

export interface Comparison {
  id: string;
  title: Localized;
  leftLabel: Localized;
  rightLabel: Localized;
  summary: Localized;
  rows: ComparisonRow[];
}

export const comparisons: Comparison[] = [
  {
    id: "nldm-ccs",
    title: loc("NLDM vs CCS", "NLDM vs CCS"),
    leftLabel: loc("NLDM", "NLDM"),
    rightLabel: loc("CCS / ECSM", "CCS / ECSM"),
    summary: loc(
      "NLDM è veloce e sufficiente fino a ~28 nm; CCS è il modello di signoff a nodi avanzati perché conserva la forma d’onda.",
      "NLDM is fast and enough down to ~28 nm; CCS is the advanced-node signoff model because it preserves waveform shape."
    ),
    rows: [
      {
        aspect: loc("Modello", "Model"),
        left: loc("Tabelle delay/slew (slew × Cload)", "Delay/slew LUTs (slew × Cload)"),
        right: loc("Current source + receiver C dinamico", "Current source + dynamic receiver C"),
      },
      {
        aspect: loc("Accuratezza", "Accuracy"),
        left: loc("Buona su net corti; debole su high-Z/SI", "Good on short nets; weak on high-Z/SI"),
        right: loc("Alta su waveform, SI, IR-aware", "High on waveform, SI, IR-aware"),
      },
      {
        aspect: loc("Runtime / lib size", "Runtime / lib size"),
        left: loc("Veloce, librerie piccole", "Fast, small libraries"),
        right: loc("Più lento, librerie grandi", "Slower, larger libraries"),
      },
      {
        aspect: loc("Quando usarlo", "When to use"),
        left: loc("Sintesi, early STA, nodi maturi", "Synthesis, early STA, mature nodes"),
        right: loc("Signoff ≤16/7 nm, SI, DVFS", "Signoff ≤16/7 nm, SI, DVFS"),
      },
    ],
  },
  {
    id: "wns-tns",
    title: loc("WNS vs TNS", "WNS vs TNS"),
    leftLabel: loc("WNS", "WNS"),
    rightLabel: loc("TNS", "TNS"),
    summary: loc(
      "WNS dice quanto è grave il path peggiore; TNS dice quanto lavoro totale resta. La strategia di fix dipende da entrambi.",
      "WNS says how bad the worst path is; TNS says how much total work remains. Fix strategy depends on both."
    ),
    rows: [
      {
        aspect: loc("Definizione", "Definition"),
        left: loc("Slack del path più negativo", "Slack of the most negative path"),
        right: loc("Somma di tutti gli slack negativi", "Sum of all negative slacks"),
      },
      {
        aspect: loc("Signoff", "Signoff"),
        left: loc("Deve essere ≥ 0 su ogni corner", "Must be ≥ 0 on every corner"),
        right: loc("Deve tendere a 0 (non solo WNS=0)", "Should trend to 0 (not only WNS=0)"),
      },
      {
        aspect: loc("Esempio operativo", "Operational example"),
        left: loc("−80 ps con TNS −80 ps → un path", "−80 ps with TNS −80 ps → one path"),
        right: loc("WNS −5 ps con TNS −80 ns → migliaia di path", "WNS −5 ps with TNS −80 ns → thousands of paths"),
      },
      {
        aspect: loc("Fix tipico", "Typical fix"),
        left: loc("VT-swap, resize, retime su quel path", "VT-swap, resize, retime that path"),
        right: loc("Opt strutturale, floorplan, RTL", "Structural opt, floorplan, RTL"),
      },
    ],
  },
  {
    id: "setup-hold",
    title: loc("Setup vs Hold", "Setup vs Hold"),
    leftLabel: loc("Setup", "Setup"),
    rightLabel: loc("Hold", "Hold"),
    summary: loc(
      "Setup: il dato deve arrivare in tempo per il ciclo successivo (corner lento). Hold: non deve cambiare troppo presto (corner veloce).",
      "Setup: data must arrive in time for the next cycle (slow corner). Hold: must not change too soon (fast corner)."
    ),
    rows: [
      {
        aspect: loc("Disuguaglianza", "Inequality"),
        left: loc("Tclk + skew ≥ Tco + Tpd + Tsu + unc", "Tclk + skew ≥ Tco + Tpd + Tsu + unc"),
        right: loc("Tco + Tpd ≥ Thold + skew_hold", "Tco + Tpd ≥ Thold + skew_hold"),
      },
      {
        aspect: loc("Corner tipico", "Typical corner"),
        left: loc("SS, low V, high T (o temp inversion)", "SS, low V, high T (or temp inversion)"),
        right: loc("FF, high V, low T", "FF, high V, low T"),
      },
      {
        aspect: loc("Fix comuni", "Common fixes"),
        left: loc("Upsize, LVT, useful skew, pipeline", "Upsize, LVT, useful skew, pipeline"),
        right: loc("Delay cell, useful skew, lock-up (scan)", "Delay cell, useful skew, lock-up (scan)"),
      },
      {
        aspect: loc("Dopo CTS", "After CTS"),
        left: loc("Spesso migliora con skew reale", "Often improves with real skew"),
        right: loc("Spesso esplode: 10–30% path critici", "Often explodes: 10–30% of critical paths"),
      },
    ],
  },
  {
    id: "tree-mesh",
    title: loc("Clock tree vs mesh", "Clock tree vs mesh"),
    leftLabel: loc("Tree / H-tree", "Tree / H-tree"),
    rightLabel: loc("Mesh", "Mesh"),
    summary: loc(
      "Tree ottimizza power e area; mesh minimizza skew a costo di potenza e routing — tipico di CPU/GPU multi-GHz.",
      "Tree optimizes power and area; mesh minimizes skew at power/routing cost — typical of multi-GHz CPU/GPU."
    ),
    rows: [
      {
        aspect: loc("Skew tipico", "Typical skew"),
        left: loc("<5% periodo (es. <50 ps @ 1 GHz)", "<5% of period (e.g. <50 ps @ 1 GHz)"),
        right: loc("Spesso <15–20 ps", "Often <15–20 ps"),
      },
      {
        aspect: loc("Power", "Power"),
        left: loc("Più basso; ICG mid-tree efficaci", "Lower; mid-tree ICGs effective"),
        right: loc("2–3× vs tree", "2–3× vs tree"),
      },
      {
        aspect: loc("OCV / robustezza", "OCV / robustness"),
        left: loc("Più sensibile a variation", "More sensitive to variation"),
        right: loc("Ridondanza riduce OCV locale", "Redundancy reduces local OCV"),
      },
      {
        aspect: loc("Quando sceglierlo", "When to choose"),
        left: loc("Mobile, IoT, SoC power-limited", "Mobile, IoT, power-limited SoCs"),
        right: loc("Server CPU, GPU, high-freq blocks", "Server CPU, GPU, high-freq blocks"),
      },
    ],
  },
];
