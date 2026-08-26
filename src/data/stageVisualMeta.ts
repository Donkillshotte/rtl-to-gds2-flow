import { loc, type Localized } from "@/i18n/context";
import type { StageId } from "./stages";

export interface StageStep {
  label: Localized;
  detail: Localized;
}

export interface StageChartPoint {
  label: string;
  value: number;
  note?: Localized;
}

export interface StageVisualMeta {
  diagramTitle: Localized;
  stepsTitle: Localized;
  chartTitle: Localized;
  steps: StageStep[];
  /** Bar chart values 0–100 for teaching metrics */
  chart: StageChartPoint[];
  chartUnit: Localized;
}

export const stageVisualMeta: Record<StageId, StageVisualMeta> = {
  rtl: {
    diagramTitle: loc("Schema a blocchi RTL", "RTL block diagram"),
    stepsTitle: loc("Passi FE", "FE steps"),
    chartTitle: loc("Budget FO4 per ciclo (es.)", "FO4 budget per cycle (ex.)"),
    chartUnit: loc("FO4", "FO4"),
    steps: [
      { label: loc("Spec / MAS", "Spec / MAS"), detail: loc("Architettura, PPA, clock/reset", "Architecture, PPA, clock/reset") },
      { label: loc("Coding RTL", "RTL coding"), detail: loc("SV/VHDL sintetizzabile, no latch", "Synthesizable SV/VHDL, no latches") },
      { label: loc("Lint / CDC", "Lint / CDC"), detail: loc("SpyGlass, crossing, UPF draft", "SpyGlass, crossings, draft UPF") },
      { label: loc("DFT hooks", "DFT hooks"), detail: loc("Scan, OCC, MBIST readiness", "Scan, OCC, MBIST readiness") },
    ],
    chart: [
      { label: "Tclk", value: 100 },
      { label: "Tco+su", value: 22 },
      { label: "Logic", value: 55 },
      { label: "Margin", value: 23 },
    ],
  },
  verification: {
    diagramTitle: loc("Piramide di verifica", "Verification pyramid"),
    stepsTitle: loc("Passi verifica", "Verification steps"),
    chartTitle: loc("Coverage tipica a signoff FE", "Typical FE signoff coverage"),
    chartUnit: loc("%", "%"),
    steps: [
      { label: loc("UVM regress", "UVM regress"), detail: loc("Stimulus + scoreboard", "Stimulus + scoreboard") },
      { label: loc("Formal", "Formal"), detail: loc("Property + bounded/unbounded", "Property + bounded/unbounded") },
      { label: loc("Coverage", "Coverage"), detail: loc("Code + functional + assert", "Code + functional + assert") },
      { label: loc("LEC prep", "LEC prep"), detail: loc("Golden RTL per synth", "Golden RTL for synth") },
    ],
    chart: [
      { label: "Line", value: 98 },
      { label: "Branch", value: 95 },
      { label: "Func", value: 92 },
      { label: "Assert", value: 88 },
    ],
  },
  synthesis: {
    diagramTitle: loc("RTL → netlist gate", "RTL → gate netlist"),
    stepsTitle: loc("Passi sintesi", "Synthesis steps"),
    chartTitle: loc("Tradeoff area vs timing (indice)", "Area vs timing tradeoff (index)"),
    chartUnit: loc("rel.", "rel."),
    steps: [
      { label: loc("Elaborate", "Elaborate"), detail: loc("GTECH / generic", "GTECH / generic") },
      { label: loc("Map + opt", "Map + opt"), detail: loc("Liberty, SDC, UPF", "Liberty, SDC, UPF") },
      { label: loc("DFT insert", "DFT insert"), detail: loc("Scan / OCC / MBIST", "Scan / OCC / MBIST") },
      { label: loc("LEC", "LEC"), detail: loc("RTL ↔ netlist", "RTL ↔ netlist") },
    ],
    chart: [
      { label: "Area", value: 70 },
      { label: "Delay", value: 45 },
      { label: "Leak", value: 55 },
      { label: "Wire", value: 40 },
    ],
  },
  floorplan: {
    diagramTitle: loc("Die: macro, IO, core", "Die: macros, IO, core"),
    stepsTitle: loc("Passi floorplan", "Floorplan steps"),
    chartTitle: loc("Utilization target regioni", "Regional utilization targets"),
    chartUnit: loc("%", "%"),
    steps: [
      { label: loc("Die / core", "Die / core"), detail: loc("Aspect, halo, blockage", "Aspect, halo, blockage") },
      { label: loc("Macro / IO", "Macros / IO"), detail: loc("Flyline, pin, bump align", "Flylines, pins, bump align") },
      { label: loc("PG skeleton", "PG skeleton"), detail: loc("Rings, straps draft", "Rings, draft straps") },
      { label: loc("FP Exit", "FP Exit"), detail: loc("Legality + review", "Legality + review") },
    ],
    chart: [
      { label: "Core", value: 68 },
      { label: "CPU", value: 72 },
      { label: "SRAM", value: 55 },
      { label: "IO", value: 40 },
    ],
  },
  pdn: {
    diagramTitle: loc("Mesh PDN e path di corrente", "PDN mesh and current path"),
    stepsTitle: loc("Passi PDN", "PDN steps"),
    chartTitle: loc("Budget IR (es. % VDD)", "IR budget (ex. % VDD)"),
    chartUnit: loc("% VDD", "% VDD"),
    steps: [
      { label: loc("Primary PG", "Primary PG"), detail: loc("Always-on mesh", "Always-on mesh") },
      { label: loc("Secondary", "Secondary"), detail: loc("Domain + switches", "Domains + switches") },
      { label: loc("Via / EM", "Vias / EM"), detail: loc("Array, j limits", "Arrays, j limits") },
      { label: loc("Early IR", "Early IR"), detail: loc("Static pre-place", "Static pre-place") },
    ],
    chart: [
      { label: "Static", value: 5 },
      { label: "Dyn", value: 10 },
      { label: "Pkg", value: 4 },
      { label: "Die", value: 6 },
    ],
  },
  placement: {
    diagramTitle: loc("Row e celle standard", "Rows and standard cells"),
    stepsTitle: loc("Passi placement", "Placement steps"),
    chartTitle: loc("Congestion GRC (es.)", "GRC congestion (ex.)"),
    chartUnit: loc("% ovf", "% ovf"),
    steps: [
      { label: loc("Global", "Global"), detail: loc("Wirelength + timing", "Wirelength + timing") },
      { label: loc("Legalize", "Legalize"), detail: loc("SITE / ROW", "SITE / ROW") },
      { label: loc("Detail opt", "Detail opt"), detail: loc("Size, VT, buffer", "Size, VT, buffer") },
      { label: loc("PRO Exit", "PRO Exit"), detail: loc("Congestion + WNS", "Congestion + WNS") },
    ],
    chart: [
      { label: "Avg", value: 3 },
      { label: "P95", value: 12 },
      { label: "Hot", value: 22 },
      { label: "Target", value: 5 },
    ],
  },
  cts: {
    diagramTitle: loc("Albero di clock", "Clock tree"),
    stepsTitle: loc("Passi CTS", "CTS steps"),
    chartTitle: loc("Skew / latency (ps es.)", "Skew / latency (ps ex.)"),
    chartUnit: loc("ps", "ps"),
    steps: [
      { label: loc("Spec skew", "Skew spec"), detail: loc("Budget vs Tclk", "Budget vs Tclk") },
      { label: loc("Tree build", "Tree build"), detail: loc("Buffer / NDR", "Buffers / NDRs") },
      { label: loc("Useful skew", "Useful skew"), detail: loc("Setup vs hold", "Setup vs hold") },
      { label: loc("Hold fix", "Hold fix"), detail: loc("Scan + data", "Scan + data") },
    ],
    chart: [
      { label: "Latency", value: 80 },
      { label: "Skew", value: 25 },
      { label: "Hold", value: 40 },
      { label: "Budget", value: 50 },
    ],
  },
  routing: {
    diagramTitle: loc("Route multi-layer", "Multi-layer routing"),
    stepsTitle: loc("Passi routing", "Routing steps"),
    chartTitle: loc("Layer usage (indice)", "Layer usage (index)"),
    chartUnit: loc("rel.", "rel."),
    steps: [
      { label: loc("Global", "Global"), detail: loc("G-cell assign", "G-cell assign") },
      { label: loc("Track", "Track"), detail: loc("Detailed route", "Detailed route") },
      { label: loc("SI / NDR", "SI / NDR"), detail: loc("Shield, spacing", "Shield, spacing") },
      { label: loc("Post-route", "Post-route"), detail: loc("Opt + ECO", "Opt + ECO") },
    ],
    chart: [
      { label: "M1", value: 90 },
      { label: "M2-3", value: 75 },
      { label: "M4-5", value: 55 },
      { label: "M6+", value: 35 },
    ],
  },
  layout: {
    diagramTitle: loc("Stack di layer GDS", "GDS layer stack"),
    stepsTitle: loc("Passi finishing", "Finishing steps"),
    chartTitle: loc("Density metal (es.)", "Metal density (ex.)"),
    chartUnit: loc("%", "%"),
    steps: [
      { label: loc("Fill", "Fill"), detail: loc("Metal / poly density", "Metal / poly density") },
      { label: loc("Antenna", "Antenna"), detail: loc("Jumper / diode", "Jumper / diode") },
      { label: loc("Seal / scribe", "Seal / scribe"), detail: loc("Ring foundry", "Foundry ring") },
      { label: loc("ECO spare", "ECO spare"), detail: loc("Metal-only ready", "Metal-only ready") },
    ],
    chart: [
      { label: "M1", value: 45 },
      { label: "M3", value: 38 },
      { label: "M5", value: 42 },
      { label: "Min", value: 20 },
    ],
  },
  sta: {
    diagramTitle: loc("Path setup / hold", "Setup / hold path"),
    stepsTitle: loc("Passi STA", "STA steps"),
    chartTitle: loc("Slack corner (ps es.)", "Corner slack (ps ex.)"),
    chartUnit: loc("ps", "ps"),
    steps: [
      { label: loc("Extract", "Extract"), detail: loc("SPEF + Liberty", "SPEF + Liberty") },
      { label: loc("MMMC", "MMMC"), detail: loc("Mode × corner", "Mode × corner") },
      { label: loc("SI / OCV", "SI / OCV"), detail: loc("Derate, CRPR", "Derate, CRPR") },
      { label: loc("Signoff", "Signoff"), detail: loc("WNS≥0 TNS→0", "WNS≥0 TNS→0") },
    ],
    chart: [
      { label: "SS", value: -5 },
      { label: "TT", value: 40 },
      { label: "FF", value: 80 },
      { label: "Hold", value: 15 },
    ],
  },
  pv: {
    diagramTitle: loc("Scan PV DRC/LVS", "PV DRC/LVS scan"),
    stepsTitle: loc("Passi PV", "PV steps"),
    chartTitle: loc("Gate status (es.)", "Gate status (ex.)"),
    chartUnit: loc("ok%", "ok%"),
    steps: [
      { label: loc("DRC", "DRC"), detail: loc("Deck foundry", "Foundry deck") },
      { label: loc("LVS", "LVS"), detail: loc("Netlist ↔ GDS", "Netlist ↔ GDS") },
      { label: loc("ERC / ant.", "ERC / ant."), detail: loc("ESD, antenna", "ESD, antenna") },
      { label: loc("DFM", "DFM"), detail: loc("Density, PV-band", "Density, PV-band") },
    ],
    chart: [
      { label: "DRC", value: 100 },
      { label: "LVS", value: 100 },
      { label: "ERC", value: 100 },
      { label: "DFM", value: 95 },
    ],
  },
  power: {
    diagramTitle: loc("Voltage map / droop", "Voltage map / droop"),
    stepsTitle: loc("Passi power signoff", "Power signoff steps"),
    chartTitle: loc("Drop vs budget (mV es.)", "Drop vs budget (mV ex.)"),
    chartUnit: loc("mV", "mV"),
    steps: [
      { label: loc("Activity", "Activity"), detail: loc("VCD / vectorless", "VCD / vectorless") },
      { label: loc("Static IR", "Static IR"), detail: loc("I·R map", "I·R map") },
      { label: loc("Dynamic", "Dynamic"), detail: loc("L·di/dt + C", "L·di/dt + C") },
      { label: loc("EM", "EM"), detail: loc("Avg/RMS/peak", "Avg/RMS/peak") },
    ],
    chart: [
      { label: "Static", value: 28 },
      { label: "Dyn", value: 65 },
      { label: "BudgS", value: 40 },
      { label: "BudgD", value: 75 },
    ],
  },
  package: {
    diagramTitle: loc("Bump array e escape", "Bump array and escape"),
    stepsTitle: loc("Passi package", "Package steps"),
    chartTitle: loc("Bump allocation (es.)", "Bump allocation (ex.)"),
    chartUnit: loc("%", "%"),
    steps: [
      { label: loc("Bump map", "Bump map"), detail: loc("Power first", "Power first") },
      { label: loc("RDL", "RDL"), detail: loc("Pad → bump", "Pad → bump") },
      { label: loc("SI / SSO", "SI / SSO"), detail: loc("IBIS + pkg L", "IBIS + pkg L") },
      { label: loc("CPA", "CPA"), detail: loc("Die↔package IR", "Die↔package IR") },
    ],
    chart: [
      { label: "Signal", value: 55 },
      { label: "VDD", value: 22 },
      { label: "VSS", value: 18 },
      { label: "Keep", value: 5 },
    ],
  },
  tapeout: {
    diagramTitle: loc("Release GDS / checklist", "GDS release / checklist"),
    stepsTitle: loc("Passi tapeout", "Tapeout steps"),
    chartTitle: loc("Gate readiness (es.)", "Gate readiness (ex.)"),
    chartUnit: loc("%", "%"),
    steps: [
      { label: loc("GKC", "GKC"), detail: loc("Multi-discipline", "Multi-discipline") },
      { label: loc("BTO", "BTO"), detail: loc("FEOL freeze", "FEOL freeze") },
      { label: loc("MTO", "MTO"), detail: loc("BEOL freeze", "BEOL freeze") },
      { label: loc("Ship", "Ship"), detail: loc("Checksum + TOR", "Checksum + TOR") },
    ],
    chart: [
      { label: "STA", value: 100 },
      { label: "PV", value: 100 },
      { label: "IR", value: 100 },
      { label: "DFT", value: 99 },
    ],
  },
};
