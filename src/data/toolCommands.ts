import { loc, type Localized } from "@/i18n/context";
import type { StageId } from "./stages";

export interface ToolCommand {
  id: string;
  tool: string;
  stage: StageId;
  title: Localized;
  command: string;
  whatToLook: Localized;
  pitfalls: Localized;
}

export const toolCommands: ToolCommand[] = [
  {
    id: "pt-report-timing",
    tool: "PrimeTime / Tempus",
    stage: "sta",
    title: loc("Worst setup path", "Worst setup path"),
    command:
      "report_timing -path_type full -delay_type max -max_paths 20 -nworst 1 -significant_digits 4",
    whatToLook: loc(
      "Breakdown cell vs net delay, slew, derate, clock skew, CRPR, SI delta. Se net >50% → routing/SI; se molti livelli → RTL/synth.",
      "Cell vs net delay breakdown, slew, derate, clock skew, CRPR, SI delta. If net >50% → routing/SI; many levels → RTL/synth."
    ),
    pitfalls: loc(
      "WNS verde con DRV violati = delay inventato. Controlla max_tran/max_cap prima.",
      "Green WNS with DRV violations = invented delay. Check max_tran/max_cap first."
    ),
  },
  {
    id: "pt-hold",
    tool: "PrimeTime / Tempus",
    stage: "sta",
    title: loc("Hold report FF corner", "Hold report FF corner"),
    command: "report_timing -delay_type min -path_type full -max_paths 50",
    whatToLook: loc(
      "Path corti post-CTS, scan chain inter-domain, useful skew eccessivo. Conta violazioni e TNS hold.",
      "Short paths post-CTS, inter-domain scan chains, excessive useful skew. Count violations and hold TNS."
    ),
    pitfalls: loc(
      "Non fixare hold mettendo buffer sul clock net — rompe lo skew.",
      "Do not fix hold by buffering the clock net — that breaks skew."
    ),
  },
  {
    id: "pt-drv",
    tool: "PrimeTime",
    stage: "sta",
    title: loc("Design rule violators", "Design rule violators"),
    command: "report_constraint -all_violators",
    whatToLook: loc(
      "max_transition, max_capacitance, max_fanout, noise. Zero prima di credere al WNS.",
      "max_transition, max_capacitance, max_fanout, noise. Zero before trusting WNS."
    ),
    pitfalls: loc(
      "Fuori tabella Liberty il delay è estrapolato — non firmabile.",
      "Outside Liberty tables delay is extrapolated — not signoff-quality."
    ),
  },
  {
    id: "inn-pg",
    tool: "Innovus / ICC2",
    stage: "pdn",
    title: loc("PG connectivity", "PG connectivity"),
    command: "check_pg / verify_pg_connection",
    whatToLook: loc(
      "Floating rails, missing via ladder, domain non connessi. Zero floating nets.",
      "Floating rails, missing via ladders, disconnected domains. Zero floating nets."
    ),
    pitfalls: loc(
      "Un rail floating è IR infinito e LVS/ERC rosso.",
      "A floating rail is infinite IR and red LVS/ERC."
    ),
  },
  {
    id: "voltus-ir",
    tool: "Voltus / RedHawk",
    stage: "power",
    title: loc("Static IR hotspot", "Static IR hotspot"),
    command: "report_power_rail / IR drop map (static + dynamic)",
    whatToLook: loc(
      "Drop <5% VDD su path critici; hotspot CPU/SRAM; confronto vectorless vs VCD.",
      "Drop <5% VDD on critical paths; CPU/SRAM hotspots; vectorless vs VCD comparison."
    ),
    pitfalls: loc(
      "Vectorless ottimistico su burst: usa VCD rappresentativo per signoff.",
      "Vectorless is optimistic on bursts: use representative VCD for signoff."
    ),
  },
  {
    id: "inn-cong",
    tool: "Innovus",
    stage: "placement",
    title: loc("Congestion map", "Congestion map"),
    command: "report_congestion / GRC or RUDY map",
    whatToLook: loc(
      "Hotspot GRC >0.8 → ripensare floorplan/placement, non solo route effort.",
      "Hotspot GRC >0.8 → rethink floorplan/placement, not just route effort."
    ),
    pitfalls: loc(
      "Overflow post-detailed = failure: non si «sistema con iteration».",
      "Post-detailed overflow = failure: it is not «fixed by more iterations»."
    ),
  },
  {
    id: "cts-skew",
    tool: "Innovus / ICC2",
    stage: "cts",
    title: loc("Clock skew / latency", "Clock skew / latency"),
    command: "report_clock_timing -type skew / report_clock_tree",
    whatToLook: loc(
      "Skew locale launch-capture, latency per domain, ICG nel tree, NDR rispettati.",
      "Local launch-capture skew, latency per domain, ICGs in tree, NDR respected."
    ),
    pitfalls: loc(
      "Aggiorna set_clock_uncertainty post-CTS con skew reale + jitter.",
      "Update set_clock_uncertainty post-CTS with real skew + jitter."
    ),
  },
  {
    id: "sdc-mcp",
    tool: "SDC",
    stage: "sta",
    title: loc("Multicycle path", "Multicycle path"),
    command: "set_multicycle_path -setup 3 -from [get_pins A/Q] -to [get_pins B/D]\nset_multicycle_path -hold 2 -from [get_pins A/Q] -to [get_pins B/D]",
    whatToLook: loc(
      "Setup N e hold tipicamente N-1. Owner architetturale documentato.",
      "Setup N and hold typically N-1. Documented architectural owner."
    ),
    pitfalls: loc(
      "Multicycle «creativo» per chiudere WNS = bug silicon.",
      "«Creative» multicycle to close WNS = silicon bug."
    ),
  },
  {
    id: "calibre-drc",
    tool: "Calibre",
    stage: "pv",
    title: loc("DRC summary", "DRC summary"),
    command: "calibre -drc ... ; check runset version vs foundry signoff deck",
    whatToLook: loc(
      "Zero violations; waiver solo con ticket foundry; deck version bloccata.",
      "Zero violations; waivers only with foundry ticket; locked deck version."
    ),
    pitfalls: loc(
      "DRC clean su deck sbagliato ≠ signoff.",
      "DRC clean on the wrong deck ≠ signoff."
    ),
  },
  {
    id: "lec-eco",
    tool: "Formality / Conformal",
    stage: "tapeout",
    title: loc("LEC post-ECO", "Post-ECO LEC"),
    command: "set_compare_points / compare (gate↔gate on ECO golden)",
    whatToLook: loc(
      "Mismatch su spare, pin invertiti, constant tie, hierarchical boundary.",
      "Mismatches on spares, inverted pins, constant ties, hierarchical boundaries."
    ),
    pitfalls: loc(
      "Metal-only non significa LEC gratis: riwirare un NAND spare cambia funzione.",
      "Metal-only does not mean free LEC: rewiring a spare NAND changes function."
    ),
  },
];
