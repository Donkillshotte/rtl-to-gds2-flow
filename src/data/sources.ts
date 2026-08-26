import { loc, type Localized } from "@/i18n/context";

export interface SourceRef {
  id: string;
  cite: string;
  title: Localized;
  detail: Localized;
  kind: "book" | "paper" | "standard" | "industry";
}

/** Bibliography used across sourced essays — textbooks, IEEE, standards, industry refs. */
export const sources: SourceRef[] = [
  {
    id: "harris-weste",
    cite: "Harris & Weste",
    title: loc(
      "CMOS VLSI Design: A Circuits and Systems Perspective",
      "CMOS VLSI Design: A Circuits and Systems Perspective"
    ),
    detail: loc(
      "Addison-Wesley / Pearson. Capitoli su RC delay, Elmore, logical effort, FO4, power (P=αCV²f), clocking. Riferimento standard per delay budgeting a livello di gate.",
      "Addison-Wesley / Pearson. Chapters on RC delay, Elmore, logical effort, FO4, power (P=αCV²f), clocking. Standard reference for gate-level delay budgeting."
    ),
    kind: "book",
  },
  {
    id: "rabaey",
    cite: "Rabaey et al.",
    title: loc(
      "Digital Integrated Circuits — A Design Perspective",
      "Digital Integrated Circuits — A Design Perspective"
    ),
    detail: loc(
      "Prentice Hall. Interconnect RC, delay, noise, power, reliability. Base concettuale per IR, crosstalk e scaling.",
      "Prentice Hall. Interconnect RC, delay, noise, power, reliability. Conceptual basis for IR, crosstalk, and scaling."
    ),
    kind: "book",
  },
  {
    id: "elmore-1948",
    cite: "Elmore 1948",
    title: loc(
      "The Transient Response of Damped Linear Networks with Particular Regard to Wideband Amplifiers",
      "The Transient Response of Damped Linear Networks with Particular Regard to Wideband Amplifiers"
    ),
    detail: loc(
      "J. Appl. Phys. 19(1), 1948. Definisce il ritardo di Elmore come primo momento della risposta impulsiva; usato oggi su alberi RC (Penfield/Rubenstein/Horowitz).",
      "J. Appl. Phys. 19(1), 1948. Defines Elmore delay as the first moment of the impulse response; used today on RC trees (Penfield/Rubenstein/Horowitz)."
    ),
    kind: "paper",
  },
  {
    id: "black-1969",
    cite: "Black 1969",
    title: loc(
      "Electromigration — A Brief Survey and Some Recent Results",
      "Electromigration — A Brief Survey and Some Recent Results"
    ),
    detail: loc(
      "IEEE Trans. Electron Devices 16(4):338–347, 1969. MTTF = A·j^(−n)·exp(Ea/kT). Modello empirico ancora usato in foundry EM signoff (con limitazioni a nodi Cu moderni).",
      "IEEE Trans. Electron Devices 16(4):338–347, 1969. MTTF = A·j^(−n)·exp(Ea/kT). Empirical model still used in foundry EM signoff (with caveats for modern Cu nodes)."
    ),
    kind: "paper",
  },
  {
    id: "ieee-1801",
    cite: "IEEE 1801",
    title: loc(
      "IEEE Standard for Design and Verification of Low-Power, Energy-Aware Electronic Systems (UPF)",
      "IEEE Standard for Design and Verification of Low-Power, Energy-Aware Electronic Systems (UPF)"
    ),
    detail: loc(
      "Standard UPF: power domain, isolation, level shifter, retention, power switch, supply nets, state transitions. Golden power intent per CLP e sim LP.",
      "UPF standard: power domain, isolation, level shifter, retention, power switch, supply nets, state transitions. Golden power intent for CLP and LP sim."
    ),
    kind: "standard",
  },
  {
    id: "ieee-1149",
    cite: "IEEE 1149.1",
    title: loc(
      "Standard Test Access Port and Boundary-Scan Architecture (JTAG)",
      "Standard Test Access Port and Boundary-Scan Architecture (JTAG)"
    ),
    detail: loc(
      "TAP, TCK/TMS/TDI/TDO, boundary-scan cells. Base DFT board-level e debug silicon.",
      "TAP, TCK/TMS/TDI/TDO, boundary-scan cells. Board-level DFT and silicon debug foundation."
    ),
    kind: "standard",
  },
  {
    id: "ieee-1800",
    cite: "IEEE 1800",
    title: loc("SystemVerilog — Hardware Description and Verification Language", "SystemVerilog — Hardware Description and Verification Language"),
    detail: loc(
      "Linguaggio RTL/assert/UVM. Sintassi always_ff/always_comb, SVA, covergroup.",
      "RTL/assert/UVM language. always_ff/always_comb syntax, SVA, covergroups."
    ),
    kind: "standard",
  },
  {
    id: "liberty",
    cite: "Liberty / CCS",
    title: loc(
      "Liberty Timing Models — NLDM, CCS, LVF",
      "Liberty Timing Models — NLDM, CCS, LVF"
    ),
    detail: loc(
      "Formato industriale Synopsys (open-ish): tabelle delay/slew (NLDM), Composite Current Source (CCS), Liberty Variation Format (LVF) per POCV. Documentazione Liberty User Guides.",
      "Industrial Synopsys format: delay/slew tables (NLDM), Composite Current Source (CCS), Liberty Variation Format (LVF) for POCV. Liberty User Guides."
    ),
    kind: "industry",
  },
  {
    id: "sdc",
    cite: "SDC",
    title: loc("Synopsys Design Constraints (SDC)", "Synopsys Design Constraints (SDC)"),
    detail: loc(
      "Linguaggio de-facto per create_clock, set_input/output_delay, false/multicycle path, uncertainty, derate. Usato da PrimeTime, Tempus, Genus, DC.",
      "De-facto language for create_clock, set_input/output_delay, false/multicycle path, uncertainty, derate. Used by PrimeTime, Tempus, Genus, DC."
    ),
    kind: "industry",
  },
  {
    id: "logical-effort",
    cite: "Sutherland et al.",
    title: loc(
      "Logical Effort — Designing Fast CMOS Circuits",
      "Logical Effort — Designing Fast CMOS Circuits"
    ),
    detail: loc(
      "Morgan Kaufmann. d = gh + p; FO4 come unità di delay. Metodo di sizing e stage count per path critici.",
      "Morgan Kaufmann. d = gh + p; FO4 as delay unit. Sizing and stage-count method for critical paths."
    ),
    kind: "book",
  },
  {
    id: "gupta-elmore",
    cite: "Gupta et al. 1997",
    title: loc(
      "The Elmore Delay as a Bound for RC Trees with Generalized Input Signals",
      "The Elmore Delay as a Bound for RC Trees with Generalized Input Signals"
    ),
    detail: loc(
      "IEEE TCAD 16(1):95–104. Mostra che Elmore è un upper bound fedele per ottimizzazione interconnect.",
      "IEEE TCAD 16(1):95–104. Shows Elmore is a faithful upper bound for interconnect optimization."
    ),
    kind: "paper",
  },
  {
    id: "metastability",
    cite: "Metastability MTBF",
    title: loc(
      "FF Metastability MTBF Model (industry / vendor apps)",
      "FF Metastability MTBF Model (industry / vendor apps)"
    ),
    detail: loc(
      "MTBF ≈ exp(t_r/τ) / (f_clk · f_data · T_0). Parametri τ, T_0 da caratterizzazione library/FPGA vendor (Intel/Altera, Microsemi app notes). Usato per dimensionare 2-FF vs 3-FF sync.",
      "MTBF ≈ exp(t_r/τ) / (f_clk · f_data · T_0). Parameters τ, T_0 from library/FPGA vendor characterization (Intel/Altera, Microsemi app notes). Used to size 2-FF vs 3-FF sync."
    ),
    kind: "industry",
  },
  {
    id: "bushnell-agrawal",
    cite: "Bushnell & Agrawal",
    title: loc(
      "Essentials of Electronic Testing for Digital, Memory and Mixed-Signal VLSI Circuits",
      "Essentials of Electronic Testing for Digital, Memory and Mixed-Signal VLSI Circuits"
    ),
    detail: loc(
      "Springer. Stuck-at, transition, path-delay fault; ATPG; scan; BIST/MBIST. Base teorica DFT.",
      "Springer. Stuck-at, transition, path-delay faults; ATPG; scan; BIST/MBIST. Theoretical DFT foundation."
    ),
    kind: "book",
  },
  {
    id: "sematech-irds",
    cite: "IRDS / ITRS",
    title: loc(
      "International Roadmap for Devices and Systems (ex-ITRS)",
      "International Roadmap for Devices and Systems (ex-ITRS)"
    ),
    detail: loc(
      "Roadmap industria: scaling, interconnect, reliability targets. Contesto per perché EM/IR/SI peggiorano a nodi avanzati.",
      "Industry roadmap: scaling, interconnect, reliability targets. Context for why EM/IR/SI worsen at advanced nodes."
    ),
    kind: "industry",
  },
  {
    id: "jedec",
    cite: "JEDEC",
    title: loc(
      "JEDEC reliability / temperature standards (JESD)",
      "JEDEC reliability / temperature standards (JESD)"
    ),
    detail: loc(
      "Definizioni di temperature range, HTOL, lifetime targets usati in automotive/consumer. Contesto per T_j e derate.",
      "Temperature-range, HTOL, lifetime target definitions used in automotive/consumer. Context for T_j and derate."
    ),
    kind: "standard",
  },
  {
    id: "lef-def",
    cite: "LEF/DEF",
    title: loc(
      "Library / Design Exchange Format (Cadence / Si2)",
      "Library / Design Exchange Format (Cadence / Si2)"
    ),
    detail: loc(
      "Formati P&R: SITE, MACRO, TRACKS (LEF); COMPONENTS, NETS, SPECIALNETS (DEF). Contratto geometrico FE↔PD.",
      "P&R formats: SITE, MACRO, TRACKS (LEF); COMPONENTS, NETS, SPECIALNETS (DEF). Geometric FE↔PD contract."
    ),
    kind: "industry",
  },
  {
    id: "swaminathan",
    cite: "Swaminathan & Engin",
    title: loc(
      "Power Integrity Modeling and Design for Semiconductors and Systems",
      "Power Integrity Modeling and Design for Semiconductors and Systems"
    ),
    detail: loc(
      "Prentice Hall. Target impedance, |Z(f)|, anti-resonance board/package/die, CPA/CPS co-simulation, decap hierarchy. Riferimento per system PDN e modelli package.",
      "Prentice Hall. Target impedance, |Z(f)|, board/package/die anti-resonance, CPA/CPS co-simulation, decap hierarchy. Reference for system PDN and package models."
    ),
    kind: "book",
  },
];

export function sourceById(id: string): SourceRef | undefined {
  return sources.find((s) => s.id === id);
}
