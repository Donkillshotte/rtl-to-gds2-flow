import type { StageId } from "./stages";

/** Stronger cross-links: stage → glossary terms, cells, related stages, feature sections. */
export const stageCrossLinks: Record<
  StageId,
  {
    glossary: string[];
    cells: string[];
    related: StageId[];
    extras?: { href: string; labelIt: string; labelEn: string }[];
  }
> = {
  rtl: {
    glossary: ["RTL", "SDC", "UPF", "CDC"],
    cells: ["dff", "inv"],
    related: ["verification", "synthesis"],
  },
  verification: {
    glossary: ["LEC", "CDC", "UVM"],
    cells: [],
    related: ["rtl", "synthesis"],
  },
  synthesis: {
    glossary: ["LIB", "NLDM vs CCS", "WNS", "FO4"],
    cells: ["nand2", "aoi", "inv"],
    related: ["rtl", "floorplan"],
    extras: [{ href: "#compare", labelIt: "NLDM vs CCS", labelEn: "NLDM vs CCS" }],
  },
  floorplan: {
    glossary: ["Utilization", "Halo / Keepout", "Floorplan", "Congestion"],
    cells: ["tap", "endcap"],
    related: ["pdn", "placement"],
  },
  pdn: {
    glossary: ["IR Drop", "EM", "Decap", "PDN", "System PDN", "CPA", "Z-target"],
    cells: ["decap", "tap"],
    related: ["floorplan", "power", "package"],
    extras: [
      { href: "#diagrams", labelIt: "Diagramma PDN", labelEn: "PDN diagram" },
      { href: "#power-pkg-deep", labelIt: "Approfondimento System PDN", labelEn: "System PDN deep dive" },
    ],
  },
  placement: {
    glossary: ["Congestion", "Legalization", "Multi-Vt", "Pin Access"],
    cells: ["buf", "inv", "dff"],
    related: ["cts", "routing"],
  },
  cts: {
    glossary: ["Skew", "Latency", "OCV", "ICG"],
    cells: ["clkbuf", "icg"],
    related: ["placement", "sta"],
    extras: [
      { href: "#diagrams", labelIt: "Diagramma CTS", labelEn: "CTS diagram" },
      { href: "#compare", labelIt: "Tree vs mesh", labelEn: "Tree vs mesh" },
    ],
  },
  routing: {
    glossary: ["NDR", "SI", "SPEF", "Preferred Direction"],
    cells: [],
    related: ["cts", "layout"],
  },
  layout: {
    glossary: ["Fill", "Antenna", "DRC"],
    cells: ["filler", "diode"],
    related: ["routing", "pv"],
  },
  sta: {
    glossary: ["WNS", "TNS", "CRPR", "AOCV", "SPEF"],
    cells: ["buf", "delay"],
    related: ["cts", "power"],
    extras: [
      { href: "#compare", labelIt: "Setup vs Hold", labelEn: "Setup vs Hold" },
      { href: "#tool-commands", labelIt: "Comandi STA", labelEn: "STA commands" },
      { href: "#cheat-sheet", labelIt: "Cheat sheet", labelEn: "Cheat sheet" },
    ],
  },
  pv: {
    glossary: ["DRC", "LVS", "Antenna"],
    cells: ["diode", "filler"],
    related: ["layout", "tapeout"],
  },
  power: {
    glossary: ["IR Drop", "EM", "UPF", "IR-aware STA", "CPA", "SPM", "System PDN", "Decap"],
    cells: ["decap", "iso"],
    related: ["pdn", "sta", "package"],
    extras: [
      { href: "#war-stories", labelIt: "War stories", labelEn: "War stories" },
      { href: "#power-pkg-deep", labelIt: "CPA & Decap", labelEn: "CPA & Decap" },
    ],
  },
  package: {
    glossary: ["Bump / C4", "RDL", "Flip-chip", "PKG", "CPA", "SSO", "Z-target"],
    cells: [],
    related: ["power", "tapeout", "pdn"],
    extras: [{ href: "#power-pkg-deep", labelIt: "Approfondimento PKG", labelEn: "PKG deep dive" }],
  },
  tapeout: {
    glossary: ["GDSII", "BTO", "MTO", "GKC"],
    cells: [],
    related: ["pv", "package"],
    extras: [{ href: "#signoff-checklist", labelIt: "Checklist signoff", labelEn: "Signoff checklist" }],
  },
};
