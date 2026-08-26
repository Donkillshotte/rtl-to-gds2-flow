import { loc, type Localized } from "@/i18n/context";
import type { StageId } from "./stages";

/** Extra deep-dive paragraphs appended to each stage's Approfondimento block. */
export const stageDeepDiveExtras: Record<StageId, Localized[]> = {
  rtl: [
    loc(
      "Reset strategy: async assert (immediate) + sync deassert (sul clock del dominio) è lo standard industriale. Un reset rilasciato vicino al clock edge è metastabilità mascherata. RDC verification obbligatoria su design multi-reset. Il PD vede reset tree come HFNS — non clock, non data.",
      "Reset strategy: async assert (immediate) + sync deassert (on domain clock) is the industrial standard. Reset released near a clock edge is masked metastability. RDC verification mandatory on multi-reset designs. PD treats the reset tree as HFNS — not clock, not data."
    ),
    loc(
      "Memorie a RTL: istanzia wrapper con BIST hook, retention bit, power pin espliciti. Black box SRAM senza abstract LEF è un buco nel timing e nel floorplan. Il compiler memoria foundry consegna LEF+lib+GDS — il PD non inventa dimensioni.",
      "Memories at RTL: instantiate wrappers with BIST hooks, retention bit, explicit power pins. Black-box SRAM without abstract LEF is a hole in timing and floorplan. The foundry memory compiler delivers LEF+lib+GDS — PD does not invent dimensions."
    ),
  ],
  verification: [
    loc(
      "Regression suite: nightly RTL sim + weekly formal + pre-freeze full signoff. Un test che passa solo in seed 42 è un bug. Il PD chiede regression verde sul tag che diventa netlist golden.",
      "Regression suite: nightly RTL sim + weekly formal + pre-freeze full signoff. A test that passes only on seed 42 is a bug. PD asks for green regression on the tag that becomes the golden netlist."
    ),
    loc(
      "X-propagation e pessimismo: sim con X su unresolved CDC può nascondere bug. Formal con X-aware o constrained. Gate sim con SDF per race post-layout su path marginali.",
      "X-propagation and pessimism: sim with X on unresolved CDC can hide bugs. X-aware or constrained formal. Gate sim with SDF for post-layout races on marginal paths."
    ),
  ],
  synthesis: [
    loc(
      "Retiming: sposta registri attraverso logica combinatoria per bilanciare pipeline — LEC obbligatorio. Utile quando RTL ha path lunghi ma pochi registri. Non confondere con «aggiungi buffer in PD».",
      "Retiming: moves registers through combinational logic to balance pipelines — LEC mandatory. Useful when RTL has long paths but few registers. Do not confuse with «add buffers in PD»."
    ),
    loc(
      "Hierarchical synthesis: block-level compile poi top-level integrate. Budget timing per interface. Abstract per block incompleti. Il top PD integra DEF con fence e region.",
      "Hierarchical synthesis: block-level compile then top-level integrate. Interface timing budgets. Abstracts for incomplete blocks. Top PD integrates DEF with fence and region."
    ),
  ],
  floorplan: [
    loc(
      "Pin placement su macro: pin verso il canale di routing, non verso il muro della macro adiacente. Rotazione 90°/180° può salvare un canale. Abstract pin block sul LEF deve matchare il GDS reale.",
      "Macro pin placement: pins toward the routing channel, not the neighboring macro wall. 90°/180° rotation can save a channel. Abstract pin block on LEF must match real GDS."
    ),
    loc(
      "Fence e region: delimita blocchi per multi-owner PD. Voltage island = region + power switch boundary. Non mischiare domini nella stessa region senza LS strip.",
      "Fence and region: delimit blocks for multi-owner PD. Voltage island = region + power-switch boundary. Do not mix domains in one region without an LS strip."
    ),
  ],
  pdn: [
    loc(
      "Via stack resistance: ogni via M1–M8 ha R_via — una ladder da 20 via su path hot è significativa. Via doubling non è solo DFM, è R. Triple/quadruple via array su strap da > 1 A.",
      "Via-stack resistance: each M1–M8 via has R_via — a 20-via ladder on a hot path is significant. Via doubling is not only DFM, it is R. Triple/quadruple via arrays on straps > 1 A."
    ),
    loc(
      "Simultaneous switching: CPU + GPU + DDR PHY possono allineare i fronti di corrente. Clock spreading (skew intenzionale tra domini) riduce di/dt peak. Non è solo package — è anche activity planning.",
      "Simultaneous switching: CPU + GPU + DDR PHY can align current edges. Clock spreading (intentional skew between domains) cuts peak di/dt. Not only package — also activity planning."
    ),
  ],
  placement: [
    loc(
      "Region-based placement: guida celle in regioni fisiche (CPU, IO, SRAM bank). Utile per multi-voltage e per ownership. Congestion spesso migliora con region che con un unico blob denso.",
      "Region-based placement: guides cells into physical regions (CPU, IO, SRAM bank). Useful for multi-voltage and ownership. Congestion often improves with regions vs one dense blob."
    ),
    loc(
      "Incremental placement: ECO placement in hole senza ripartire da zero — se il hole esisteva (spare area). Full re-place dopo macro move è settimane.",
      "Incremental placement: ECO place in holes without restarting from zero — if the hole existed (spare area). Full re-place after macro move is weeks."
    ),
  ],
  cts: [
    loc(
      "Clock uncertainty in SDC: jitter + margin + OCV non modellato. Troppo pessimistico → overdesign; troppo ottimistico → silicon fail. Si calibra con silicon correlation history.",
      "Clock uncertainty in SDC: jitter + margin + unmodeled OCV. Too pessimistic → overdesign; too optimistic → silicon fail. Calibrate with silicon correlation history."
    ),
    loc(
      "Generated clock: PLL output, divided clock, muxed clock — create_generated_clock con master e divide/multiply. CTS deve rispettare la gerarchia SDC. Un generated clock sbagliato è WNS falso su tutto il dominio.",
      "Generated clocks: PLL output, divided clock, muxed clock — create_generated_clock with master and divide/multiply. CTS must respect SDC hierarchy. A wrong generated clock is false WNS on the whole domain."
    ),
  ],
  routing: [
    loc(
      "Track assignment: detailed router assegna track su griglia. Shorts e spacing violations → search & repair rip-up. Max iterations prima di tornare a place/floorplan.",
      "Track assignment: detailed router assigns tracks on a grid. Shorts and spacing violations → search & repair rip-up. Max iterations before going back to place/floorplan."
    ),
    loc(
      "ECO routing: route solo net modificati, preserve resto. Metal-only ECO patch nel GDS. Verificare antenna su net nuovi.",
      "ECO routing: route only changed nets, preserve the rest. Metal-only ECO patch in GDS. Check antenna on new nets."
    ),
  ],
  layout: [
    loc(
      "Chip finishing order: route → filler cell → metal fill → seal → merge. Fill prima di seal. DRC su ogni step intermedio in debug, signoff solo su merged.",
      "Chip finishing order: route → filler cells → metal fill → seal → merge. Fill before seal. DRC on each intermediate step in debug; signoff only on merged."
    ),
    loc(
      "IP merge: macro GDS con layer map allineato. Nome cella univoco. LVS hierarchical su block prima del top merge.",
      "IP merge: macro GDS with aligned layer map. Unique cell names. Hierarchical LVS on blocks before top merge."
    ),
  ],
  sta: [
    loc(
      "Path grouping: reg2reg, in2reg, reg2out, in2out — budget diversi. IO timing con set_input/output_delay e package model. Reg2reg è il cuore del PD closure.",
      "Path grouping: reg2reg, in2reg, reg2out, in2out — different budgets. IO timing with set_input/output_delay and package model. Reg2reg is the heart of PD closure."
    ),
    loc(
      "Eco STA: incremental con ECO netlist + SPEF patch. Full re-STA su tutti i corner dopo ECO grosso. Un corner dimenticato è un respin.",
      "ECO STA: incremental with ECO netlist + SPEF patch. Full re-STA on all corners after large ECO. One forgotten corner is a respin."
    ),
  ],
  pv: [
    loc(
      "Hierarchical DRC/LVS: block clean poi assemble. Top-level short tra block è classico. Soft IP merge senza LVS block-level è rischioso.",
      "Hierarchical DRC/LVS: clean blocks then assemble. Top-level shorts between blocks are classic. Soft IP merge without block-level LVS is risky."
    ),
    loc(
      "Property LVS: confronta W/L device, non solo connectivity. Un transistor width mismatch può passare connectivity ma fallire analog performance.",
      "Property LVS: compares device W/L, not just connectivity. A transistor width mismatch can pass connectivity but fail analog performance."
    ),
  ],
  power: [
    loc(
      "Thermal: T_junction da power density. EM limit @ Tmax (125–150°C). Self-heating su wire stretti. Coarse thermal map influenza derate in advanced flows.",
      "Thermal: T_junction from power density. EM limit @ Tmax (125–150°C). Self-heating on narrow wires. Coarse thermal maps influence derate in advanced flows."
    ),
    loc(
      "RMS EM su clock: activity 2, duty 50%. Diverso da average EM su VDD strap. Due report, due fix teams — non mischiare.",
      "RMS EM on clock: activity 2, 50% duty. Different from average EM on VDD strap. Two reports, two fix teams — do not mix."
    ),
  ],
  package: [
    loc(
      "CTE mismatch: die vs substrate vs mold compound → warpage, crack. Keepout sotto bump. Underfill process per flip-chip.",
      "CTE mismatch: die vs substrate vs mold compound → warpage, crack. Keepout under bumps. Underfill process for flip-chip."
    ),
    loc(
      "SI package: crosstalk RDL, coupled bumps. Package model in SI sim per DDR. Non solo SSO — anche timing IO.",
      "Package SI: RDL crosstalk, coupled bumps. Package model in SI sim for DDR. Not only SSO — also IO timing."
    ),
  ],
  tapeout: [
    loc(
      "Job deck: layer order, polarity, tone, OPC recipe reference. Foundry portal upload con checksum. Version control su ogni artefatto.",
      "Job deck: layer order, polarity, tone, OPC recipe reference. Foundry portal upload with checksum. Version control on every artifact."
    ),
    loc(
      "Silicon bring-up: first silicon debug con scan/MBIST, shmoo voltage/frequency, IR measurement on die. Confronto con STA corner — correlation per il prossimo progetto.",
      "Silicon bring-up: first silicon debug with scan/MBIST, voltage/frequency shmoo, on-die IR measurement. Compare with STA corners — correlation for the next project."
    ),
  ],
};
