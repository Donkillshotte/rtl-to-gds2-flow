import { loc, type Localized } from "@/i18n/context";
import type { StageId } from "./stages";

/** Third wave of deep-dive paragraphs — merged after stageDeepDiveExtras. */
export const stageDeepDiveExtras2: Record<StageId, Localized[]> = {
  rtl: [
    loc(
      "Parametrizzazione RTL: `parameter` e `localparam` per width, depth, feature flags. Un design senza parametri è un design che non scala tra varianti prodotto. Il PD beneficia: stesso floorplan, area diversa per SKU. `ifdef` per feature toggle — ogni ifdef è un mode STA aggiuntivo.",
      "RTL parameterization: `parameter` and `localparam` for width, depth, feature flags. A design without parameters does not scale across product variants. PD benefits: same floorplan, different area per SKU. `ifdef` for feature toggles — every ifdef is an additional STA mode."
    ),
    loc(
      "Latch vs FF in RTL: i latch sono rari in ASIC digital (transparent phase). Se inferiti per errore, STA li tratta diversamente dalla sim. Un senior cerca `always_comb` senza default e `case` senza `default`. In interview: «perché i latch sono pericolosi?» → transparency window, hold ambiguity, LEC mismatch.",
      "Latch vs FF in RTL: latches are rare in digital ASIC (transparent phase). If inferred by mistake, STA treats them unlike simulation. A senior looks for `always_comb` without defaults and `case` without `default`. Interview: «why are latches dangerous?» → transparency window, hold ambiguity, LEC mismatch."
    ),
    loc(
      "IP integration: ogni IP ha delivery package (RTL, .lib, LEF abstract, timing model, power model, test model). Version pinning obbligatorio. Un IP aggiornato senza re-qualification è un rischio silicon. Il PD owner dell'IP block firma abstract LEF e pin placement.",
      "IP integration: every IP has a delivery package (RTL, .lib, abstract LEF, timing model, power model, test model). Version pinning is mandatory. An updated IP without re-qualification is silicon risk. The PD owner of the IP block signs abstract LEF and pin placement."
    ),
    loc(
      "Design for debug (DFD): observation points, trigger registers, trace buffer hooks. Non è DFT ma impatta area e routing. Un trace buffer da 4 KB può costare 0.1 mm² a 7 nm. Si negozia a RTL, non si aggiunge post-route.",
      "Design for debug (DFD): observation points, trigger registers, trace buffer hooks. Not DFT but impacts area and routing. A 4 KB trace buffer can cost 0.1 mm² at 7 nm. Negotiate at RTL, do not add post-route."
    ),
  ],
  verification: [
    loc(
      "Constrained-random vs directed tests: constrained-random esplora lo spazio con seed diversi; directed colpisce corner case noti. Un buon testbench ha entrambi. Coverage-driven verification: si aggiungono test finché i bin non sono hit. Il PD chiede che i mode critici (scan, LP) abbiano almeno un test directed.",
      "Constrained-random vs directed tests: constrained-random explores space with different seeds; directed hits known corner cases. A good testbench has both. Coverage-driven verification: add tests until bins are hit. PD asks that critical modes (scan, LP) have at least one directed test."
    ),
    loc(
      "Emulation (ZeBu, Palladium): FPGA-based, MHz speed, boot OS possibile. Setup costoso ma trova bug che sim non trova (long sequences, software interaction). Output utile per PD: activity file per power, netlist golden. Non sostituisce formal su proprietà locali.",
      "Emulation (ZeBu, Palladium): FPGA-based, MHz speed, OS boot possible. Expensive setup but finds bugs sim misses (long sequences, software interaction). Useful PD output: activity file for power, golden netlist. Does not replace formal on local properties."
    ),
    loc(
      "Low-power verification: UPF sim con power state transitions. Verificare che isolation funzioni, retention salvi stato, level shifter non glitchino. CLP a gate level. Un bug LP in silicon è spesso irreversibile senza respin.",
      "Low-power verification: UPF sim with power state transitions. Verify isolation works, retention saves state, level shifters do not glitch. Gate-level CLP. An LP bug in silicon is often irreversible without respin."
    ),
    loc(
      "Verification closure meeting: checklist con owner per ogni item. Lint, CDC, RDC, coverage, formal, LEC, power. Un «waived» senza owner e scadenza è technical debt. Il PD partecipa per mode STA e DFT alignment.",
      "Verification closure meeting: checklist with owner per item. Lint, CDC, RDC, coverage, formal, LEC, power. A «waived» without owner and expiry is technical debt. PD participates for STA modes and DFT alignment."
    ),
  ],
  synthesis: [
    loc(
      "Physical synthesis (Design Compiler Topographical, Genus iSpatial): usa placement info per timing più accurato. Riduce synth-to-route gap. Richiede floorplan early. Non sostituisce post-route STA ma migliora predictability.",
      "Physical synthesis (Design Compiler Topographical, Genus iSpatial): uses placement info for more accurate timing. Reduces synth-to-route gap. Requires early floorplan. Does not replace post-route STA but improves predictability."
    ),
    loc(
      "Clock gating insertion in synth: ICG cells inserite automaticamente da enable signals. Quality of enable (latched vs combinational) impatta glitch. Scan controlla ICG in test mode. Ogni ICG è un punto timing: setup/hold sull'enable.",
      "Clock gating insertion in synth: ICG cells inserted automatically from enable signals. Enable quality (latched vs combinational) impacts glitch. Scan controls ICG in test mode. Every ICG is a timing point: setup/hold on enable."
    ),
    loc(
      "Multi-bit flop merging: synth può mergiare FF adiacenti in multi-bit cell per area. Attenzione: scan chain order, hold tra bit, DFT compatibility. Un merge aggressivo rompe scan stitching.",
      "Multi-bit flop merging: synth can merge adjacent FFs into multi-bit cells for area. Caution: scan chain order, hold between bits, DFT compatibility. Aggressive merging breaks scan stitching."
    ),
    loc(
      "Design rule constraints in synth: max_fanout, max_transition come constraint. Violazioni propagate al PD come DRV. Meglio fixare a synth con buffering che scoprire a post-route con ECO costoso.",
      "Design rule constraints in synth: max_fanout, max_transition as constraints. Violations propagate to PD as DRV. Better to fix at synth with buffering than discover post-route with costly ECO."
    ),
  ],
  floorplan: [
    loc(
      "Channel-based floorplan: macro in file, canali di routing tra file. Standard per design con molte SRAM. Channel width da congestion estimate. Un channel troppo stretto = routing failure post-place.",
      "Channel-based floorplan: macros in rows, routing channels between rows. Standard for designs with many SRAMs. Channel width from congestion estimate. Too-narrow channel = post-place routing failure."
    ),
    loc(
      "Power planning in floorplan: ring width, strap count, mesh pitch definiti qui. Cambiare PDN dopo placement è costoso. IR budget preliminare guida strap width. Package bump map influenza ring entry points.",
      "Power planning in floorplan: ring width, strap count, mesh pitch defined here. Changing PDN after placement is costly. Preliminary IR budget guides strap width. Package bump map influences ring entry points."
    ),
    loc(
      "Hierarchical DEF delivery: ogni block owner consegna DEF con fence. Top integrator merge, resolve overlap, run top-level route. Interface pin placement è contratto tra block owners.",
      "Hierarchical DEF delivery: each block owner delivers DEF with fence. Top integrator merges, resolves overlap, runs top-level route. Interface pin placement is a contract between block owners."
    ),
    loc(
      "Scribe line e seal ring: area non utilizzabile per logica. Seal ring per protezione meccanica. Scribe per wafer saw. Il core area è dentro seal, non fino al bordo die.",
      "Scribe line and seal ring: area not usable for logic. Seal ring for mechanical protection. Scribe for wafer saw. Core area is inside seal, not to die edge."
    ),
  ],
  pdn: [
    loc(
      "Simultaneous switching noise (SSN) su PDN: molti gate switchano insieme → di/dt spike. Decap mitiga localmente; package inductance mitiga globalmente. Co-sim die+package per worst case.",
      "Simultaneous switching noise (SSN) on PDN: many gates switch together → di/dt spike. Decap mitigates locally; package inductance mitigates globally. Die+package co-sim for worst case."
    ),
    loc(
      "Well bias e body effect: in advanced nodes, well voltage influenza Vt. Non è PDN classico ma impatta leakage e timing. Triple-well per analog isolation.",
      "Well bias and body effect: at advanced nodes, well voltage influences Vt. Not classic PDN but impacts leakage and timing. Triple-well for analog isolation."
    ),
    loc(
      "PG pin access: ogni standard cell ha VDD/VSS pin. Via stack deve raggiungere ogni pin. verify_pg_connection trova pin floating. Un pin floating = cella non alimentata = funzione X.",
      "PG pin access: every standard cell has VDD/VSS pins. Via stack must reach every pin. verify_pg_connection finds floating pins. A floating pin = unpowered cell = X function."
    ),
    loc(
      "Power grid robustness: redundant paths per fault tolerance (automotive). Mesh topology vs tree. Mesh costa area ma riduce IR e migliora reliability.",
      "Power grid robustness: redundant paths for fault tolerance (automotive). Mesh topology vs tree. Mesh costs area but reduces IR and improves reliability."
    ),
  ],
  placement: [
    loc(
      "Timing-driven placement weights: net critiche pesate 5–10×. Clock net esclusa (CTS job). Data net con WNS negativo a synth → high weight. Iterazione place→STA→reweight.",
      "Timing-driven placement weights: critical nets weighted 5–10×. Clock nets excluded (CTS job). Data nets with negative synth WNS → high weight. Iterate place→STA→reweight."
    ),
    loc(
      "Macro channel placement: standard cells in channel tra macro. Channel height da row count estimate. Troppo poche row → congestione; troppe → area sprecata.",
      "Macro channel placement: standard cells in channel between macros. Channel height from row count estimate. Too few rows → congestion; too many → wasted area."
    ),
    loc(
      "Voltage-aware placement: celle di un voltage domain nella stessa region. LS strip al confine. Power header row placement vicino al dominio switched.",
      "Voltage-aware placement: cells of one voltage domain in same region. LS strip at boundary. Power header row placement near switched domain."
    ),
    loc(
      "Placement legalization: dopo global place, detailed place allinea a row, rimuove overlap. Site row height da cell library. Odd-height cell (double height) rompe row alignment.",
      "Placement legalization: after global place, detailed place aligns to rows, removes overlap. Site row height from cell library. Odd-height cells break row alignment."
    ),
  ],
  cts: [
    loc(
      "Clock mesh vs tree: mesh per skew minimo (server CPU), tree per power minimo (mobile). Mesh costa area e power ma skew <20 ps. H-tree è compromesso.",
      "Clock mesh vs tree: mesh for minimum skew (server CPU), tree for minimum power (mobile). Mesh costs area and power but skew <20 ps. H-tree is a compromise."
    ),
    loc(
      "Clock latency target: da root a sink. Latency alta → periodo effettivo ridotto. Useful skew usa differenza di latency intenzionalmente. Report latency per domain.",
      "Clock latency target: root to sink. High latency → reduced effective period. Useful skew uses latency difference intentionally. Report latency per domain."
    ),
    loc(
      "Clock gating in CTS: ICG inseriti nel tree, non solo a leaf. Gating a livello intermedio riduce power ma complica skew. Scan mode bypassa ICG.",
      "Clock gating in CTS: ICGs inserted in tree, not only at leaf. Mid-level gating reduces power but complicates skew. Scan mode bypasses ICG."
    ),
    loc(
      "CTS optimization iterations: build tree → STA → fix hold → resize buffers → repeat. Tipico 3–5 iterazioni. Ogni iterazione aggiorna uncertainty.",
      "CTS optimization iterations: build tree → STA → fix hold → resize buffers → repeat. Typically 3–5 iterations. Each iteration updates uncertainty."
    ),
  ],
  routing: [
    loc(
      "Track assignment: ogni layer ha track pitch. Non-default pitch per clock (wider). Via access da track adiacente. Blocked track da macro pin = routing failure.",
      "Track assignment: each layer has track pitch. Non-default pitch for clock (wider). Via access from adjacent track. Blocked track from macro pin = routing failure."
    ),
    loc(
      "Via optimization: via ladder minimization per delay; via array maximization per current. Single-cut via su power = EM risk. Multi-cut mandatory su strap.",
      "Via optimization: via ladder minimization for delay; via array maximization for current. Single-cut via on power = EM risk. Multi-cut mandatory on straps."
    ),
    loc(
      "Crosstalk avoidance routing: spacing increase, shielding, layer hopping. Victim net upsize. Aggressor net downsize o reroute. SI iteration con ECO.",
      "Crosstalk avoidance routing: spacing increase, shielding, layer hopping. Victim net upsize. Aggressor net downsize or reroute. SI iteration with ECO."
    ),
    loc(
      "Clock routing NDR: double width, double spacing, shield on both sides. Clock net non deve avere crosstalk da data. DCC (double-cut clock) per reliability.",
      "Clock routing NDR: double width, double spacing, shield on both sides. Clock nets must not have data crosstalk. DCC (double-cut clock) for reliability."
    ),
  ],
  layout: [
    loc(
      "Seal ring e scribe: geometrie fisse da foundry. Non modificare senza approval. Seal continuous check in DRC.",
      "Seal ring and scribe: fixed geometries from foundry. Do not modify without approval. Seal continuous check in DRC."
    ),
    loc(
      "Dummy metal e CMP: fill non è solo density — anche planarità per litho. Over-fill causa dishing; under-fill causa erosion.",
      "Dummy metal and CMP: fill is not only density — also planarity for litho. Over-fill causes dishing; under-fill causes erosion."
    ),
    loc(
      "IP merge hierarchy: bottom-up GDS merge. Ogni IP con proprio top cell. LVS per IP block prima del merge top.",
      "IP merge hierarchy: bottom-up GDS merge. Each IP with its own top cell. LVS per IP block before top merge."
    ),
    loc(
      "Revision control: ogni GDS drop con version tag, checksum, change log. Tapeout GDS = signoff GDS XOR clean.",
      "Revision control: every GDS drop with version tag, checksum, change log. Tapeout GDS = signoff GDS XOR clean."
    ),
  ],
  sta: [
    loc(
      "Path-based vs graph-based analysis: path-based legge ogni path; graph-based propaga arrival/required. CRPR (Clock Reconvergence Pessimism Removal) riduce pessimismo su clock reconvergence.",
      "Path-based vs graph-based analysis: path-based reads each path; graph-based propagates arrival/required. CRPR reduces pessimism on clock reconvergence."
    ),
    loc(
      "Generated clock: divider, mux, gated clock. create_generated_clock con -divide_by, -multiply_by, -source. Un generated clock sbagliato = tutto il dominio sbagliato.",
      "Generated clock: divider, mux, gated clock. create_generated_clock with -divide_by, -multiply_by, -source. Wrong generated clock = entire domain wrong."
    ),
    loc(
      "Input/output delay: set_input_delay/set_output_delay da package model e board. IO timing è metà package, metà die. IBIS per accuratezza.",
      "Input/output delay: set_input_delay/set_output_delay from package model and board. IO timing is half package, half die. IBIS for accuracy."
    ),
    loc(
      "ECO timing: incremental STA con ECO netlist patch. compare_timing pre/post ECO. Full MMMC rerun se ECO tocca clock tree.",
      "ECO timing: incremental STA with ECO netlist patch. compare_timing pre/post ECO. Full MMMC rerun if ECO touches clock tree."
    ),
  ],
  pv: [
    loc(
      "Hierarchical verification: block DRC/LVS clean, poi top-level assembly check. Top-level short tra block è failure classico.",
      "Hierarchical verification: block DRC/LVS clean, then top-level assembly check. Top-level short between blocks is a classic failure."
    ),
    loc(
      "Density rules: min/max metal density per CMP. Window size da foundry. Fill insertion per compliance.",
      "Density rules: min/max metal density for CMP. Window size from foundry. Fill insertion for compliance."
    ),
    loc(
      "Coloring rules (DPT): same-mask spacing violation. Alternating color assignment. Odd-cycle conflict = unfixable without reroute.",
      "Coloring rules (DPT): same-mask spacing violation. Alternating color assignment. Odd-cycle conflict = unfixable without reroute."
    ),
    loc(
      "Waiver management: ogni waiver con foundry ticket, justification, expiry. Zero unapproved waiver al GKC.",
      "Waiver management: every waiver with foundry ticket, justification, expiry. Zero unapproved waivers at GKC."
    ),
  ],
  power: [
    loc(
      "Vectorless vs vector-based power: vectorless assume toggle rate statistica; vector-based usa VCD reale. Vector-based più accurato per IR/EM.",
      "Vectorless vs vector-based power: vectorless assumes statistical toggle rate; vector-based uses real VCD. Vector-based more accurate for IR/EM."
    ),
    loc(
      "Power domain state machine: ON, OFF, RETENTION, ISOLATED. Ogni transizione ha timing e corrente associati. Sim con UPF.",
      "Power domain state machine: ON, OFF, RETENTION, ISOLATED. Each transition has associated timing and current. Sim with UPF."
    ),
    loc(
      "Leakage corner: SS@high T per max leakage. Power gating per ridurre. HVT cells per non-critical path.",
      "Leakage corner: SS@high T for max leakage. Power gating to reduce. HVT cells for non-critical paths."
    ),
    loc(
      "Self-heating: wire stretti con alta corrente si riscaldano. EM limit @ T_self. Coarse thermal map in advanced flows.",
      "Self-heating: narrow wires with high current heat up. EM limit @ T_self. Coarse thermal map in advanced flows."
    ),
  ],
  package: [
    loc(
      "Bump pitch scaling: 150 µm (mature) → 80 µm → 40 µm (advanced). Pitch minore = più bump per area ma costo package maggiore.",
      "Bump pitch scaling: 150 µm (mature) → 80 µm → 40 µm (advanced). Smaller pitch = more bumps per area but higher package cost."
    ),
    loc(
      "Underfill e warpage: flip-chip senza underfill = crack risk. CTE matching die/substrate. Keepout sotto bump.",
      "Underfill and warpage: flip-chip without underfill = crack risk. CTE matching die/substrate. Keepout under bumps."
    ),
    loc(
      "2.5D interposer: silicon interposer tra die e package. TSV, microbump. HBM + logic co-design. Thermal limit severo.",
      "2.5D interposer: silicon interposer between die and package. TSV, microbump. HBM + logic co-design. Severe thermal limit."
    ),
    loc(
      "Package DRC: separato da die DRC. Substrate routing, bump overlap, RDL spacing. Package team ownership.",
      "Package DRC: separate from die DRC. Substrate routing, bump overlap, RDL spacing. Package team ownership."
    ),
  ],
  tapeout: [
    loc(
      "Mask data preparation: GDS → fracturing → mask writer format. OPC/RET applicato foundry-side. Layer polarity check.",
      "Mask data preparation: GDS → fracturing → mask writer format. OPC/RET applied foundry-side. Layer polarity check."
    ),
    loc(
      "Engineering lot vs production lot: engineering per bring-up, production per volume. Stessi check signoff.",
      "Engineering lot vs production lot: engineering for bring-up, production for volume. Same signoff checks."
    ),
    loc(
      "Silicon correlation feedback: misura silicon vs STA prediction. Aggiorna OCV/POCV per prossimo progetto. Learning loop.",
      "Silicon correlation feedback: measure silicon vs STA prediction. Update OCV/POCV for next project. Learning loop."
    ),
    loc(
      "Post-silicon debug: scan dump, MBIST fail log, optical probe, FIB edit. Metal-only ECO per fix. Respin decision matrix.",
      "Post-silicon debug: scan dump, MBIST fail log, optical probe, FIB edit. Metal-only ECO for fix. Respin decision matrix."
    ),
  ],
};
