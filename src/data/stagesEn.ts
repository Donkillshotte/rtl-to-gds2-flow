import type { StageId } from "./stages";

type StageText = Partial<
  Omit<
    import("./stages").Stage,
    "id" | "step" | "color" | "glowColor"
  >
>;

export const stagesEnMap: Record<StageId, StageText> = {
  rtl: {
    title: "RTL Design",
    subtitle: "Register Transfer Level — Front-End",
    description:
      "RTL describes circuit behavior at the register and combinational logic level, typically in SystemVerilog or VHDL. It is the highest abstraction before synthesis: architecture, datapath, control logic, interfaces, and preliminary power intent. Industrial-quality RTL drastically reduces downstream debug cycles in synthesis, PD, and silicon.",
    deepDive: [
      "In an industrial ASIC flow, RTL is not merely 'code that simulates': it must be synthesizable, lint-clean, CDC-safe, and aligned with power specifications (UPF/CPF). Every module should have clear interfaces, well-defined clock domains, documented reset strategy, and preliminary SDC constraints.",
      "Architectural decisions at RTL — pipeline depth, bus width, number of clock domains, clock gating strategy — directly impact area, timing closure, and power in physical design. An overly deep datapath creates long critical paths; too many clock domains increases CDC and CTS complexity.",
      "Before handoff to synthesis, the FE team must guarantee: netlist uniqueness, no multi-driven nets, complete scan chains, no direct pad→standard cell connections, and clean SDC (clocks, uncertainty, false/multicycle paths justified).",
      "The Elmore delay model for an RC tree gives intuition for why RTL fanout and logic depth matter before physical implementation: τ = Σ R_i · C_i along the path from driver to sink.",
    ],
    inputs: [
      "Micro-architecture spec & MAS",
      "IP catalog (memories, PLL, ADC/DAC, bus fabric)",
      "Target PPA budget (frequency, area, power)",
      "Clock/reset specification",
      "Preliminary UPF/CPF for multi-voltage design",
    ],
    outputs: [
      "Functionally verified RTL",
      "UVM testbench + coverage report",
      "Preliminary SDC",
      "UPF/CPF for low-power",
      "CDC/RDC documentation",
    ],
    tools: [
      "SystemVerilog / VHDL",
      "Questa / VCS / Xcelium",
      "UVM",
      "Verdi",
      "SpyGlass (preliminary lint)",
    ],
    keyConcepts: [
      "Hierarchical modularity and design partitioning",
      "Clock domain & reset domain strategy",
      "Synthesizability (no inferred latches, no combinational loops)",
      "Power intent: isolation, level shifter, retention",
      "DFT readiness (scan, compression, BIST hooks)",
    ],
    subsections: [
      {
        title: "Architecture and Partitioning",
        content:
          "The chip is divided into logical blocks (CPU core, cache, interconnect, peripherals) with clear boundaries. Each block may have a separate PD owner in hierarchical designs. Partitioning influences floorplan: high-traffic blocks should be physically adjacent.",
        bullets: [
          "Define top-level and sub-block hierarchy",
          "Identify critical interfaces (AXI, AHB, custom)",
          "Plan clock domains per block",
          "Reserve area budget for macro IP",
        ],
      },
      {
        title: "Industrial Coding Guidelines",
        content:
          "Coding standards (Synopsys, ARM, internal) ensure synthesizable and verifiable code. Common errors: latches inferred from incomplete assignments in always_comb, non-blocking vs blocking misuse, unsynchronized async reset.",
        bullets: [
          "Single clock per always_ff (except documented exceptions)",
          "Synchronized reset preferred (async assert, sync deassert)",
          "Parameters for configurable widths",
          "No delay (#) in synthesizable code",
        ],
      },
    ],
    practicalNotes: [
      "Senior interview: explain why latch inference breaks synthesis equivalence and how SpyGlass W415a detects it.",
      "Document every clock domain crossing with synchronizer type before RTL signoff.",
    ],
  },
  verification: {
    title: "RTL Verification & Formal",
    subtitle: "Simulation, Formal Verification, Lint, CDC, RDC",
    description:
      "RTL verification is the quality gatekeeper before synthesis. It includes dynamic simulation (UVM), formal verification for critical properties, static lint, CDC (Clock Domain Crossing), and RDC (Reset Domain Crossing) analysis. RTL signoff is not silicon signoff, but provides evidence the design is structurally correct and ready for implementation.",
    deepDive: [
      "Formal Verification uses mathematical techniques (model checking, equivalence checking) to prove or disprove properties over ALL legal inputs, not just simulated stimulus patterns. Essential for protocols (AXI, PCIe), arbiters, critical FSMs, and security properties.",
      "Lint (SpyGlass, VC SpyGlass, Verible) statically analyzes HDL without simulation. Finds: inferred latches, unconnected signals, simulation-synthesis mismatch, FSM issues (unreachable states), misused clock/reset.",
      "CDC verification identifies signals crossing asynchronous clock domains without adequate synchronization. Metastability, glitches, and data incoherence are common silicon failure causes. Techniques: 2-FF synchronizer, handshake, async FIFO, MUX sync.",
      "MTBF for a 2-FF synchronizer: MTBF = (e^(t_r/τ)) / (f_clk · f_data · T_0) where t_r is resolution time, τ is metastability time constant, f_clk and f_data are clock and data toggle rates.",
    ],
    inputs: ["RTL", "Test plan & verification plan", "Assertion (SVA) library", "SDC with clock definitions", "UPF for LP verification"],
    outputs: [
      "Lint clean report (with documented waivers)",
      "CDC/RDC clean report",
      "Formal proofs / bounded proofs",
      "Functional coverage closure report",
      "Completed RTL signoff checklist",
    ],
    tools: ["VC SpyGlass / Questa Lint", "JasperGold / VC Formal", "Questa CDC / SpyGlass CDC", "VCS / Xcelium + UVM", "Conformal Low Power (CLP)"],
    keyConcepts: [
      "RTL Signoff vs Functional Signoff vs Silicon Signoff",
      "Assertion-Based Verification (SVA)",
      "Coverage-driven verification (code + functional)",
      "Reconvergence CDC (multi-bit async)",
      "X-propagation and reset sequencing",
    ],
    subsections: [
      {
        title: "Formal Verification",
        content:
          "Formal proves properties like: 'grant is one-hot', 'FIFO never overflows', 'AXI valid/ready handshake respected'. Bounded proofs cover N cycles; unbounded proofs cover all cycles (decidability depends on complexity).",
        bullets: ["Assumption/constraint on environment", "Cover properties for reachability", "Formal apps: connectivity, X-prop, FSM", "Abstraction to reduce state space"],
      },
      {
        title: "Lint — Structural Signoff",
        content:
          "Lint is the first quality filter. Production uses specific goals: lint_rtl, lint_turbo, adv_lint. Every violation must be classified: real bug, false positive, or waiver with justification and approval.",
        bullets: ["W415a: inferred latch", "Clock with missing reset on flop", "Multi-driven net / undriven port", "Simulation-synthesis mismatch (casex, initial)"],
      },
      {
        title: "CDC & RDC Analysis",
        content:
          "For each async crossing: verify synchronizer type, MTBF for metastability, data stability window for multi-bit. RDC: verify reset ordering between domains.",
        bullets: ["2-FF sync for single-bit control", "Async FIFO for multi-bit data (gray code pointer)", "Quasi-static signals: mandatory handshake", "Reset sync: async assert, sync deassert"],
      },
      {
        title: "Gate Keeper Check (GKC) — Front-End",
        content:
          "GKC is the structured review before releasing RTL to synthesis. Not a single tool but a team checkpoint: lint/CDC/formal/coverage must be green or waivers approved.",
        bullets: ["Signed RTL signoff checklist", "Waiver review with architect", "SDC review with timing owner", "UPF review with LP team"],
      },
    ],
    checks: [
      {
        category: "RTL Quality Gates — What They Verify",
        items: [
          "Lint: structural RTL quality — no inferred latches, no undriven nets, synthesizability",
          "CDC: every async crossing has approved synchronizer with MTBF > product lifetime",
          "RDC: reset sequencing safe during power-up — no X-propagation into active logic",
          "Coverage: code + functional targets prove stimulus exercised design intent",
          "Formal: critical properties proven or bounded with documented depth",
          "No inferred latches: structural guarantee for synthesis equivalence",
        ],
      },
    ],
    practicalNotes: [
      "Interview: derive MTBF formula and explain when 2-FF sync is insufficient (multi-bit data).",
      "Bounded formal proof depth must be justified against maximum pipeline latency.",
    ],
  },
  synthesis: {
    title: "Logic Synthesis",
    subtitle: "RTL → Gate-Level Netlist + LEC",
    description:
      "Logic synthesis translates RTL into a gate-level netlist mapped to target technology standard cells. It optimizes timing (setup/hold), area, and power while respecting SDC. Includes Logic Equivalence Check (LEC) between RTL and netlist. It is the bridge between front-end and back-end.",
    deepDive: [
      "Design Compiler (Synopsys) and Genus (Cadence) dominate industrially. Synthesis phases: elaboration → mapping → optimization (timing/area/power). Output is Verilog netlist with cell instances from PDK .lib.",
      "SDC constraints drive everything: create_clock, set_input_delay, set_output_delay, set_false_path, set_multicycle_path, set_max_transition/capacitance/fanout. Wrong constraints here propagate to tapeout.",
      "LEC (Formality, Conformal) verifies synthesized netlist is logically equivalent to RTL. Any mismatch indicates synthesis bug or non-synthesizable RTL that passed checks.",
      "Setup constraint at a flip-flop: T_clk − T_data ≥ T_setup + T_skew + T_uncertainty. Hold: T_data − T_clk ≥ T_hold − T_skew + T_uncertainty.",
    ],
    inputs: [
      "RTL signoff + testbench",
      "Technology library (.lib) for all PVT corners",
      "LEF abstract of standard cells",
      "Complete SDC (MMMC views)",
      "UPF/CPF for multi-voltage",
      "dont_use / dont_touch lists",
    ],
    outputs: [
      "Gate-level netlist (.v / .ddc)",
      "Post-synthesis SDC",
      "Netlist with scan chains (post-DFT)",
      "Timing/area/power reports",
      "LEC clean report (RTL ↔ netlist)",
    ],
    tools: ["Design Compiler / Fusion Compiler", "Genus", "Formality / Conformal LEC", "Conformal Low Power", "PrimeTime (pre-layout STA)"],
    keyConcepts: [
      "Technology mapping & cell selection",
      "Timing optimization: WNS, TNS, hold fixing",
      "Area recovery & power optimization (clock gating)",
      "Multi-Mode Multi-Corner (MMMC)",
      "Scan insertion & DFT constraints",
    ],
    subsections: [
      {
        title: "Detailed Synthesis Flow",
        content: "read_verilog → link → read_sdc → compile_ultra (DC) → write netlist. compile_ultra runs high-level optimization, mapping, incremental optimization.",
        bullets: ["Elaboration: parameter resolution, generate blocks", "Link: technology library connection", "compile_ultra -gate_clock for clock gating", "Incremental compile for ECO"],
      },
      {
        title: "Logic Equivalence Check (LEC)",
        content: "Formality compares RTL (golden) vs netlist (revised). Match = equivalent. Fail = debug with compare points. LEC repeated after every significant ECO.",
        bullets: ["RTL vs post-synthesis netlist", "Post-synthesis vs post-DFT netlist", "Post-route vs post-ECO netlist", "PAFV checks during BTO/MTO"],
      },
      {
        title: "Physical Synthesis (Advanced Nodes)",
        content: "For ≤7nm nodes, Fusion Compiler and Innovus integrate physical synthesis: preliminary placement during synthesis for realistic timing.",
      },
    ],
    exitCriteria: [
      { name: "Pre-layout timing", description: "WNS ≥ 0 and TNS = 0 on target corner (ideal clock)" },
      { name: "LEC clean", description: "RTL ↔ netlist equivalence verified with Formality/Conformal" },
      { name: "Area budget", description: "Area within ±5% of allocated budget" },
      { name: "Power estimate", description: "Leakage + dynamic power within budget" },
      { name: "Scan ready", description: "Scan chains inserted, DFT constraints respected" },
    ],
    practicalNotes: [
      "Interview: explain WNS vs TNS and why hold fixing often requires delay cells post-CTS not pre-CTS.",
      "MMMC view count explodes: 3 modes × 12 corners = 36 STA runs at signoff.",
    ],
  },
  floorplan: {
    title: "Floorplanning",
    subtitle: "Die layout, macros, IO, initial power planning",
    description:
      "Floorplanning defines the chip's physical structure: die/core dimensions, macro placement (memories, analog IP, PLL), IO pin placement, power domain regions, and routing channels. It is the most critical phase for preventing downstream problems — most timing, congestion, and routing issues originate here.",
    deepDive: [
      "A good floorplan saves weeks of timing closure. A bad floorplan causes irrecoverable congestion, routing detours, IR drop, and unfixable timing failures. Golden rule: 70% of PD success is decided at floorplan.",
      "Floorplan is not just 'drawing a rectangle': die/core definition, macro placement, IO/bump planning, voltage island layout, power mesh/clock spine channel reservation, placement blockages, and PDN skeleton (primary + secondary PG).",
      "For multi-voltage designs (UPF), each power domain maps to a physical region (voltage island). Power switches at always-on/switched domain boundaries. Secondary PG serves disjoint always-on islands and retention domains.",
      "Core utilization target: A_core / A_die. Typical 60–80%. Aspect ratio ~1:1 preferred for uniform routing demand.",
    ],
    inputs: ["Post-synthesis netlist (.v / .ddc)", "Technology LEF + macro LEF/DEF", "SDC + UPF", "IO pin list / preliminary bump map", "Full-chip integration guidelines"],
    outputs: ["Floorplan DEF with FIXED macros", "Preliminary power rings", "Pin placement DEF", "Placement blockages & regions", "Floorplan review report"],
    tools: ["Innovus", "ICC2 / Fusion Compiler", "OpenROAD", "Calibre (preliminary FEOL DRC)"],
    keyConcepts: [
      "Core vs die area definition",
      "Macro placement & halo/keepout",
      "Voltage islands & power domain mapping",
      "Power switch & mesh area reservation",
      "IO planning (wirebond vs flip-chip)",
      "Channel planning & routing blockages",
    ],
    subsections: [
      {
        title: "Die, Core, and Utilization Definition",
        content: "initialize_floorplan (ICC2) or floorPlan (Innovus) defines die area, core area, utilization target, aspect ratio. 65–75% core utilization is a good starting point.",
        bullets: ["initialize_floorplan -control_type core -core_utilization 0.70", "Aspect ratio ~1:1 for uniform routing", "Core margin: space between core edge and macro/IO", "Rectilinear floorplan for irregular macros"],
      },
      {
        title: "Voltage Islands — UPF → Physical Mapping",
        content: "Each UPF power domain becomes a physical region. Switched domains separated from always-on. Isolation cells at boundaries. Level shifters between different voltages.",
        bullets: ["Power switch columns at island boundary", "Retention registers with dual supply", "AON islands for isolation/buffer logic", "Region constraints for PD tools"],
      },
      {
        title: "Floorplan Exit Milestone",
        content: "Floorplan Exit certifies: macros FIXED, IO placed, PG skeleton connected, legality clean, voltage islands defined, congestion map reviewed.",
        bullets: ["check_legality clean", "Macro FEOL DRC clean", "PG connectivity to macros verified", "Pin placement on preferred tracks"],
      },
    ],
    exitCriteria: [
      { name: "Floorplan Exit", description: "Macros FIXED, no overlap, FEOL DRC clean, PG skeleton connected" },
      { name: "IO placement", description: "All pins placed on preferred tracks with escape routing feasible" },
      { name: "Voltage islands", description: "UPF domains mapped to physical regions with switch columns reserved" },
    ],
    checks: [
      {
        category: "Floorplan Checks — What They Verify",
        items: [
          "check_legality: macro overlap, row continuity, site alignment",
          "verify_pg_connection: no floating power rails at macro boundaries",
          "Pin access: every IO pin reachable from core routing",
          "Congestion map: preliminary global routing demand < 85%",
        ],
      },
    ],
    practicalNotes: [
      "Interview: explain halo/keepout around macros and why analog blocks need guard bands (GDHS/endcap).",
      "Never start placement without signed Floorplan Exit — rework cost is 10× downstream.",
    ],
  },
  pdn: {
    title: "PDN — Power Delivery Network",
    subtitle: "Power grid, IR drop prevention, EM budget",
    description:
      "The PDN distributes VDD and VSS to every cell. Includes primary PG (always-on, high current), secondary PG (switched domains, retention, AON islands), power switches for power gating, and power mesh on upper metal layers. Poor PDN design causes IR drop, EM failure, and timing degradation in silicon.",
    deepDive: [
      "Primary PG: always-on backbone from pad/bump → core ring → mesh/straps → M1 rails → cell pins. Upper layers (M6–M9) carry most current due to lower R.",
      "Secondary PG: local/domain nets — VDD_SW switched, VDD_RET retention, VDD_AON disjoint islands. Each has dedicated mesh, often fed via power switches from primary PG.",
      "Power switches: PMOS header (VDD→VDD_SW) is industry standard for noise immunity. NMOS footer creates virtual ground with ground bounce risk.",
      "PDN modeled as RC network: R causes static IR drop, L causes dynamic droop (L·dI/dt), C (decap) limits droop. V_drop = I × R_path along pad-to-cell path.",
      "Black's Equation for EM: MTTF = A · J^(−n) · exp(E_a/kT). Current density J must stay below foundry J_max for 10-year lifetime.",
    ],
    inputs: ["Floorplan DEF", "Power budget per domain", "PDK metal stack", "Switch cell LEF for power gating", "Activity factors (toggle rates)"],
    outputs: ["Complete power grid", "PG netlist", "Preliminary IR drop report", "EM budget analysis", "Decap placement"],
    tools: ["Innovus (add_rings, add_stripes)", "ICC2 (create_power_straps)", "RedHawk / Voltus", "Static IR analysis"],
    keyConcepts: [
      "Primary PG vs Secondary PG",
      "Power switches (header/footer, fine/coarse grain)",
      "Power mesh vs rings/stripes",
      "IR drop: static vs dynamic",
      "Decap cells & on-chip capacitance",
      "Switch topologies: daisy-chain, fishbone",
    ],
    subsections: [
      {
        title: "Primary PG — Main Power Grid",
        content: "Flow: package bump → C4 → IO ring → core ring → straps → M1 rails → cell pins. Upper layers carry bulk current.",
        bullets: ["Core ring width 5–20 μm", "Strap pitch 10–50 μm on M5–M9", "Via arrays every 2–5 μm at junctions", "Example: M7=VDD_SYS, M6=VSS, M5=VDD domain"],
      },
      {
        title: "Secondary PG — Domain Networks",
        content: "Feeds switched domains, retention, and AON islands. Thinner mesh (2–8 μm) — lower current.",
        bullets: ["VDD_SW: power switch output only in domain", "VDD_RET: retention FF supply during sleep", "Minimum spacing between different voltage nets"],
      },
      {
        title: "Power Switches",
        content: "Controlled PMOS/NMOS acting as resistors. ON: supply passes. OFF: domain power-down, leakage reduced. Defined in UPF, implemented by P&R with library cells.",
        bullets: ["Header PMOS: industry standard", "Daisy-chain for inrush limiting", "create_power_switch in UPF", "verify_pg_connection post-insertion"],
      },
      {
        title: "Power Mesh Network",
        content: "2D grid of H+V metal stripes with via stitching at intersections. Lower, more uniform resistance than parallel stripes alone.",
        bullets: ["Multi-layer mesh M5–M9 stacked", "Blockage: mesh layers reserved — no signal routing", "PNS: Power Network Synthesis auto-generation"],
      },
      {
        title: "IR Drop Budget",
        content: "Industrial limits: static IR < 5% VDD, dynamic IR < 10% VDD. For VDD=0.8V: max 40mV static, 80mV dynamic.",
      },
    ],
    practicalNotes: [
      "Interview: derive V_drop = I·R and explain why dynamic IR needs VCD not SAIF.",
      "Decap cells are physical capacitors — C_decap reduces ΔV = I·Δt/C during current surge.",
    ],
  },
  placement: {
    title: "Placement",
    subtitle: "Global, legalization, optimization — toward PRO Exit",
    description:
      "Placement positions every standard cell on legal row sites, optimizing wirelength, timing, and congestion. Includes global placement (approximate), legalization (snap to grid), and optimization (sizing, buffering). PRO Exit marks readiness for CTS.",
    deepDive: [
      "Global placement divides core into bins with ~80% density target per bin. Not legalized — positions are approximate. HPWL (Half Perimeter Wire Length) is the cost metric.",
      "Detailed placement legalizes: snap to row sites, fix orientation, resolve overlaps. Then optimization: cell sizing, buffer insertion, timing-driven moves.",
      "Timing-driven placement uses weighted HPWL + timing cost: cells on critical paths pulled closer to reduce wire delay.",
      "PRO Exit: internal milestone certifying pre-CTS timing clean, acceptable congestion, uniform density, ready for CTS.",
    ],
    inputs: ["Floorplan DEF (post floorplan exit)", "Netlist + SDC", "Placement constraints", "Dont touch lists"],
    outputs: ["Placed DEF", "Congestion map", "Pre-CTS timing report", "Placement density report"],
    tools: ["Innovus placeDesign", "ICC2 place_opt", "OpenROAD RePlAce", "Tempus (pre-CTS analysis)"],
    keyConcepts: ["Global vs detailed placement", "Timing-driven placement", "Congestion-driven spreading", "PRO Exit criteria", "Filler & decap insertion"],
    subsections: [
      {
        title: "Placement Flow",
        content: "1) Global placement → 2) Legalization → 3) Detailed placement → 4) Timing optimization → 5) Congestion fix → 6) Filler insertion.",
        bullets: ["place_opt -incremental for ECO", "setPlaceMode -congEffort high for congested designs", "Spread cells in red congestion zones"],
      },
      {
        title: "PRO Exit — Placement Route Optimization Exit",
        content: "Verifies placement mature enough for CTS and routing. Not a foundry standard but internal PD gate.",
      },
    ],
    exitCriteria: [
      { name: "Legal placement", description: "check_legality clean, no overlap, all cells placed" },
      { name: "Pre-CTS timing", description: "Setup WNS ≥ −0.1ns (pre-CTS margin)" },
      { name: "Congestion", description: "Global routing congestion < 5% overflow in critical regions" },
      { name: "Density uniform", description: "No hotspots (>90%) or deserts (<30%)" },
    ],
    checks: [
      {
        category: "Post-Placement Checks — What They Verify",
        items: [
          "check_legality: site alignment, orientation, no overlap — geometric correctness",
          "report_congestion: routing resource demand vs supply per G-cell",
          "report_timing -preCTS: setup slack before clock tree exists (ideal clock)",
          "report_design_physical -density: uniform cell distribution for routability",
        ],
      },
    ],
    practicalNotes: [
      "Interview: HPWL = (max_x − min_x) + (max_y − min_y) of net pins — fast wirelength estimate.",
      "Tap cells and endcaps inserted during placement/legalization — not optional.",
    ],
  },
  cts: {
    title: "Clock Tree Synthesis",
    subtitle: "Skew, latency, useful skew, clock gating",
    description:
      "CTS builds the clock distribution tree from root to sink flip-flops. Goals: minimize skew (max−min clock arrival difference), control latency, respect transition/capacitance limits, integrate clock gating. Poor CTS makes timing closure impossible.",
    deepDive: [
      "Classic clock tree: root → buffer → ... → sink FF. Skew controlled but OCV-sensitive. Industry default for most designs.",
      "Clock mesh: redundant 2D metal grid with multiple drivers. Skew typically <1/3 of tree, OCV variation ~5% vs 20–25% for tree. Used in CPU/GPU high-end.",
      "Useful skew: intentional skew to improve setup on critical paths. Post-CTS hold violations often emerge — fix with delay cells or useful skew adjustment.",
      "Clock skew definition: skew = max(T_clk_arrival) − min(T_clk_arrival) across all sinks of a clock domain.",
    ],
    inputs: ["Placed design (post PRO exit)", "Clock definitions (SDC)", "CTS spec file", "Buffer/inverter cells for CTS"],
    outputs: ["CTS netlist + DEF", "Clock tree report (skew, latency)", "Post-CTS timing", "Clock power report"],
    tools: ["Innovus ccopt_design", "ICC2 clock_opt", "Tempus", "ClockExplorer"],
    keyConcepts: ["Clock tree vs clock mesh", "Clock skew & latency", "Useful skew optimization", "Clock gating (ICG cells)", "OCV impact on clock distribution", "Hold fixing post-CTS"],
    subsections: [
      {
        title: "Clock Tree — Standard CTS",
        content: "Balanced tree: clock root → root buffer → spine → subtree → leaf → FF clock pin. Target skew ±50ps (consumer) or ±20ps (HPC).",
        bullets: ["ICG (Integrated Clock Gating) in tree", "NDR for clock nets", "Excluded pins: analog blocks", "Through pins for CDC"],
      },
      {
        title: "Clock Mesh Network",
        content: "2D clock wire grid fed by multiple distributed buffers. Each FF connects via short stub. Ultra-low skew, OCV robust, 2–3× power cost.",
        bullets: ["Mesh grid on M4–M6", "Skew target <15ps", "Used in CPU core, GPU shader", "Framework: MeshWorks, ROME"],
      },
      {
        title: "Clock Tree vs Mesh — When to Use",
        content: "Tree: default, low power. Mesh: when skew critical (multi-GHz), large clock area, power budget available. Hybrid: local mesh + tree periphery.",
      },
    ],
    exitCriteria: [
      { name: "Target skew met", description: "Clock skew within spec per domain" },
      { name: "Max transition", description: "Clock transition < limit on all clock nets" },
      { name: "Hold margin", description: "Hold WNS ≥ 0 post-CTS (or fixable)" },
    ],
    practicalNotes: [
      "Interview: explain why hold fixes increase after CTS (clock arrival alignment changes).",
      "CLKBUF vs BUF: CLKBUF has balanced rise/fall for clock, lower skew contribution.",
    ],
  },
  routing: {
    title: "Routing",
    subtitle: "Global routing, detailed routing, post-route optimization",
    description:
      "Routing creates physical interconnections between cells on metal layers (M1–Mn). Global routing allocates channel regions; detailed routing traces wires and vias. Post-route optimization (PRO) fixes timing, DRC, and SI violations. Most compute-intensive PD phase.",
    deepDive: [
      "Global routing on G-cell grid: assigns approximate paths minimizing congestion. Overflow > 0 means unroutable regions — requires placement spreading or floorplan change.",
      "Detailed routing: maze routing, track assignment, via insertion, in-route DRC fixing. NDR for critical nets: wider wires, double spacing, shielding.",
      "Signal Integrity: crosstalk delay and noise. Aggressor/victim analysis, spacing increase, VSS/VDD shielding, layer promotion.",
      "Antenna ratio: R_ant = A_metal / A_gate. Must be < foundry limit to prevent gate oxide damage during plasma etch.",
    ],
    inputs: ["Post-CTS design", "Routing rules (tech file)", "NDR rules", "Antenna rules", "SDC post-CTS"],
    outputs: ["Routed DEF", "SPEF (parasitic extraction)", "Post-route timing", "DRC report (internal)"],
    tools: ["Innovus routeDesign", "ICC2 route_opt", "StarRC (extraction)", "NanoRoute / ZRoute"],
    keyConcepts: ["Global vs detailed routing", "Routing congestion & overflow", "NDR & shielding", "Antenna effect prevention", "Post-route optimization (PRO)"],
    subsections: [
      {
        title: "Global Routing",
        content: "Divides chip into G-cells, assigns routing guides per net. Congestion map shows overflow. Target: zero overflow before detailed routing.",
        bullets: ["routeDesign -globalDetail", "reportCongestion -overflow", "Layer assignment H-V-H alternating"],
      },
      {
        title: "Detailed Routing",
        content: "Actual track tracing with vias. In-route DRC fixing. Antenna diode insertion. Via doubling for EM-critical nets.",
      },
      {
        title: "Antenna Effect",
        content: "During plasma etching, long unconnected wires accumulate charge damaging gate oxide. Fix: antenna diode or metal jumpers to upper layer.",
      },
      {
        title: "PRO Exit — Post-Route Optimization",
        content: "After routing and post-route opt: verify setup/hold timing, internal DRC, antenna, zero congestion. Unlocks signoff flow.",
      },
    ],
    exitCriteria: [
      { name: "Routing complete", description: "100% nets routed, zero opens" },
      { name: "Post-route timing", description: "Setup WNS ≥ 0, Hold WNS ≥ 0 (pre-signoff)" },
      { name: "Antenna clean", description: "All antenna ratios within limits" },
    ],
    checks: [
      {
        category: "Routing Checks — What They Verify",
        items: [
          "verifyConnectivity: every net fully connected, no opens/shorts",
          "reportCongestion: zero overflow post-detailed route",
          "Antenna ratio: A_metal/A_gate < limit per layer",
          "Internal DRC: width, spacing, via enclosure before Calibre",
        ],
      },
    ],
    practicalNotes: [
      "Interview: explain antenna effect physically — plasma charges floating metal, damages thin gate oxide.",
      "Trunk routing: wide, shielded routes for high-fanout nets (reset, scan enable).",
    ],
  },
  layout: {
    title: "Layout & Finishing",
    subtitle: "Metal fill, seal ring, chip assembly",
    description:
      "After routing, layout requires finishing: metal fill for CMP uniformity, seal ring for die protection, scribe line, filler cells, ECO routing. Final layout must be DRC-clean and ready for GDSII merge and physical verification.",
    deepDive: [
      "Metal fill (dummy fill): inserts metal polygons to maintain density within process min/max limits. CMP requires uniform density — otherwise dishing/erosion.",
      "Seal ring: protective ring around die preventing moisture ingress and cracking. Mandatory for tapeout.",
      "ECO: localized post-route changes. Metal-only ECO for minimal timing fixes. Functional ECO requires partial re-synthesis.",
      "Density rule: ρ_min ≤ ρ_layer ≤ ρ_max. Fill algorithm satisfies without creating new DRC or timing impact.",
    ],
    inputs: ["Routed DEF (post PRO exit)", "Fill rules from PDK", "Seal ring template", "ECO netlist (if applicable)"],
    outputs: ["Layout DEF with fill", "Integrated seal ring", "Pre-merge GDSII", "ECO documentation"],
    tools: ["Innovus addFiller", "Calibre fill", "KLayout", "Virtuoso (custom layout)"],
    keyConcepts: ["Metal fill & density rules", "CMP uniformity", "Seal ring & scribe line", "ECO flow (metal-only vs functional)", "Hierarchy vs flatten"],
    subsections: [
      {
        title: "Metal Fill Strategy",
        content: "Insert fill after routing, before signoff DRC. Min density (~25%), max density (~75%) per layer. Floating fill with spacing — no timing impact.",
      },
      {
        title: "Layout vs Schematic",
        content: "Layout is the geometric representation of the circuit. Every transistor is polygons on active, poly, diffusion, contacts, and metals. LVS verifies layout implements netlist exactly.",
      },
    ],
    practicalNotes: [
      "Filler cells maintain N-well continuity and row height — distinct from metal fill.",
      "Tap cells required in every row for substrate/well connection — BTO DRC checks this.",
    ],
  },
  sta: {
    title: "STA — Static Timing Analysis",
    subtitle: "Signoff timing multi-corner multi-mode",
    description:
      "STA verifies every logic path meets timing constraints (setup, hold, recovery, removal) across all PVT corners and operational modes. Official timing signoff uses parasitics extracted (SPEF) from real layout. PrimeTime is the gold standard.",
    deepDive: [
      "Setup: data must arrive before clock edge minus setup time. Hold: data must remain stable after clock edge plus hold time.",
      "MMMC: each mode×corner produces a timing view. Typical: 3–5 modes × 12+ corners = 36+ analyses.",
      "OCV/AOCV/POCV: derating for on-chip process variation. CPPR: clock path pessimism removal for same-clock-domain paths.",
      "Slack_setup = T_clk − T_data − T_setup − T_uncertainty. Slack_hold = T_data − T_clk − T_hold + T_uncertainty.",
    ],
    inputs: ["Final netlist + SDC", "SPEF from StarRC/Quantus", "MMMC configuration", "SDF (optional cross-check)"],
    outputs: ["Signoff timing report", "WNS/TNS per corner/mode", "Critical path reports", "SI delay/noise report"],
    tools: ["PrimeTime", "Tempus", "Quantus / StarRC", "Liberate (library characterization)"],
    keyConcepts: ["Setup vs hold vs recovery vs removal", "MMMC signoff", "SPEF back-annotation", "OCV/AOCV/POCV derating", "CPPR", "Crosstalk delta delay"],
    subsections: [
      {
        title: "Setup and Hold Analysis",
        content: "Setup violations = path too slow (fix: upsize, layer promotion, reduce logic depth). Hold violations = path too fast (fix: delay cells, buffer insertion).",
        bullets: ["report_timing -max for setup", "report_timing -min for hold", "All corners must pass — one failure blocks tapeout"],
      },
      {
        title: "MMMC Signoff Strategy",
        content: "Define modes (func, scan, test), corners (SS/TT/FF × voltage × temp). PrimeTime runs all combinations. WNS ≥ 0, TNS = 0 required.",
      },
      {
        title: "SI / Crosstalk",
        content: "Aggressor nets cause delta delay and noise on victim nets. Fix: spacing, shielding, NDR, victim driver upsizing.",
      },
    ],
    exitCriteria: [
      { name: "Setup signoff", description: "WNS ≥ 0, TNS = 0 all setup corners/modes" },
      { name: "Hold signoff", description: "WNS ≥ 0, TNS = 0 all hold corners/modes" },
      { name: "SI clean", description: "Crosstalk delta delay and noise within limits" },
    ],
    checks: [
      {
        category: "STA Checks — What They Verify",
        items: [
          "Setup slack ≥ 0: every path meets frequency target at slow corner",
          "Hold slack ≥ 0: no race conditions at fast corner",
          "Recovery/removal: async reset paths safe",
          "SI analysis: crosstalk does not cause functional failure or timing violation",
        ],
      },
    ],
    practicalNotes: [
      "Interview: derive setup/hold slack equations from flip-flop timing diagram.",
      "POCV replaces flat OCV derating with statistical depth-based derating — more accurate at advanced nodes.",
    ],
  },
  pv: {
    title: "PV — Physical Verification",
    subtitle: "DRC, LVS, ERC, antenna, density",
    description:
      "Physical Verification is the geometric and electrical signoff gate before tapeout. DRC checks manufacturing rules; LVS verifies layout matches netlist; ERC checks electrical rules; antenna and density complete the checklist. Zero violations is mandatory — not 'almost zero'.",
    deepDive: [
      "DRC: geometric rules from foundry DRM — width, spacing, enclosure, density, antenna. Calibre is industry standard. Run on merged GDS, not intermediate DB.",
      "LVS: extracted layout netlist compared to source netlist. Device count, connectivity, parameters must match. CORRECT status required.",
      "ERC: electrical rules — floating gates, power shorts, weak connections, latch-up risks.",
      "Antenna check: cumulative metal area connected to gate during etch. Ratio = A_antenna / A_gate < limit per layer.",
    ],
    inputs: ["Merged GDSII/OASIS", "Source netlist", "Foundry runset (DRC/LVS/ERC)", "Layer map", "Waiver list"],
    outputs: ["DRC report (zero violations)", "LVS report (CORRECT)", "ERC report", "Antenna report", "Density report"],
    tools: ["Calibre (Mentor/Siemens)", "Pegasus (Synopsys)", "ICV (Synopsys)", "KLayout (open source)"],
    keyConcepts: ["DRC runset vs foundry DRM", "LVS CORRECT vs INCORRECT", "Antenna ratio limits", "Metal density min/max", "Seal ring DRC", "Waiver process"],
    subsections: [
      {
        title: "DRC — Design Rule Check",
        content: "Every polygon checked against hundreds of rules per layer. Violations categorized: must-fix vs waiver-eligible. Zero must-fix at tapeout.",
        bullets: ["Run on merged GDS (design + fill + seal ring)", "Base DRC at BTO (FEOL)", "Metal DRC at MTO (BEOL)", "Density fill verification"],
      },
      {
        title: "LVS — Layout Versus Schematic",
        content: "Extract devices from layout, compare to source netlist. Checks: device count, net connectivity, parameter matching (W/L).",
      },
      {
        title: "ERC & Antenna",
        content: "ERC: no floating gates, no power-ground shorts. Antenna: metal area/gate area ratio per net per layer.",
      },
    ],
    exitCriteria: [
      { name: "DRC zero", description: "Zero violations on foundry runset (merged GDS)" },
      { name: "LVS CORRECT", description: "Layout extracted netlist matches source" },
      { name: "Antenna clean", description: "All ratios below foundry limits" },
    ],
    checks: [
      {
        category: "PV Checks — What They Verify",
        items: [
          "DRC: manufacturability — every geometry meets process minimum rules",
          "LVS: correctness — layout implements intended circuit topology",
          "ERC: electrical safety — no shorts, floats, or weak connections",
          "Antenna: gate oxide integrity during manufacturing plasma steps",
          "Density: CMP uniformity — no dishing/erosion from metal starvation",
        ],
      },
    ],
    practicalNotes: [
      "Interview: explain difference between internal tool DRC and signoff Calibre runset.",
      "BTO runs Base DRC (FEOL: tap, endcap, orientation) before MTO metal DRC.",
    ],
  },
  power: {
    title: "Power Signoff",
    subtitle: "Static/dynamic IR, EM, vector selection",
    description:
      "Power signoff verifies the PDN delivers adequate voltage under all operating conditions and that metal interconnect survives electromigration over product lifetime. Uses VCD/FSDB activity for dynamic analysis. RedHawk/Voltus are industry tools.",
    deepDive: [
      "Static IR: DC current distribution with average activity. V_drop = I_avg × R_path. Limit: <5% VDD.",
      "Dynamic IR: transient analysis with VCD/FSDB waveforms. Captures current surge during clock edges, mode transitions. Limit: <10% VDD, duration <500ps.",
      "Vector selection: WORST_POWER and WORST_DPDT cycles chosen from simulation. Multiple modes: functional, scan, low-power.",
      "Power EM: J_avg on straps/rings/rails. Signal EM: J_RMS and J_peak on signal nets. Black's Eq: MTTF = A·J^(−n)·exp(E_a/kT).",
    ],
    inputs: ["Final DEF + SPEF", "VCD/FSDB/SAIF activity", "Power grid extraction", "EM rules from PDK", "Timing windows (TWF)"],
    outputs: ["Static IR report", "Dynamic IR transient report", "EM report (avg/RMS/peak)", "Decap recommendation", "Power signoff certificate"],
    tools: ["RedHawk / RedHawk-SC", "Voltus", "Totem", "PrimePower"],
    keyConcepts: ["Static vs dynamic IR drop", "VCD-based vs vectorless analysis", "Power EM vs signal EM", "Cycle selection (WORST_POWER)", "Decap effectiveness", "10-year MTTF @ T_max"],
    subsections: [
      {
        title: "VCD-Based Dynamic IR",
        content: "Import switching activity from gate-level simulation. Tool selects worst cycles for transient analysis. Most accurate — required for signoff.",
        bullets: ["WORST_POWER cycle: peak simultaneous switching", "WORST_DPDT: max dI/dt event", "Pre-simulation cycles attached to selected cycle"],
      },
      {
        title: "Vectorless Dynamic IR",
        content: "Stochastic activity from toggle rates and timing windows. Faster, conservative (over-estimate). OK for floorplan/placement; signoff requires VCD.",
      },
      {
        title: "Power EM vs Signal EM",
        content: "Power EM: average current on VDD/VSS nets. Signal EM: RMS (AC) and peak on clock/bus nets. Via EM: 0.3–0.5 mA per via → parallel via arrays.",
        bullets: ["M1 J_max: 1–2 mA/μm", "M6–M9: 8–15 mA/μm", "Signoff @ 125°C consumer, 150°C automotive"],
      },
    ],
    exitCriteria: [
      { name: "Static IR", description: "Max voltage drop < 5% VDD on all instances" },
      { name: "Dynamic IR", description: "Max droop < 10% VDD, duration < 500ps" },
      { name: "EM", description: "All wires/vias within J_max for 10-year MTTF" },
    ],
    practicalNotes: [
      "Interview: explain why IR drop causes timing degradation (effective VDD reduction slows cells).",
      "Decap placement: near high-activity blocks and power switch columns.",
    ],
  },
  package: {
    title: "Package & Bump Assignment",
    subtitle: "PKG co-design, RDL, flip-chip, IO planning",
    description:
      "The package connects the die to the external world (PCB). Bump assignment maps die IO pads to bump balls for flip-chip. RDL (Redistribution Layer) routes pads to bumps. Chip-package co-design is essential for signal integrity, power delivery, and thermal management.",
    deepDive: [
      "Wire-bond vs flip-chip: wire-bond uses peripheral pads and gold wires; flip-chip uses area-I/O bump array with direct substrate connection. Flip-chip enables >1000 IO and lower inductance.",
      "Bump assignment: map each IO buffer to bump location respecting pitch, power/ground ratio, signal grouping.",
      "RDL routing: additional metal layer above die redistributing signals from pad to bump positions.",
      "SSO (Simultaneous Switching Output): multiple IO switching simultaneously causes ground bounce and VDD droop on package.",
    ],
    inputs: ["IO pad locations (DEF)", "Bump pitch & array spec", "Package substrate design rules", "Power/ground bump requirements", "Signal integrity budget"],
    outputs: ["Bump assignment map", "RDL routing", "Package netlist", "Co-design SI report", "Thermal analysis"],
    tools: ["Cadence SIP (SiP)", "Redistribution routing tools", "ANSYS SIwave", "Package design tools"],
    keyConcepts: ["Wire-bond vs flip-chip", "Bump assignment & pitch", "RDL (Redistribution Layer)", "Chip-package co-design", "SSO (Simultaneous Switching Output)"],
    subsections: [
      {
        title: "Bump Assignment Flow",
        content: "1) Define bump array grid → 2) Assign power/ground bumps (priority) → 3) Assign signal bumps by proximity → 4) RDL routing → 5) Verify SI, IR, escape routing.",
        bullets: ["Power bump ratio: typically 1:4 power:signal", "Differential pairs: adjacent bumps, matched length", "SSO analysis for high-frequency buses"],
      },
      {
        title: "Package (PKG) Integration",
        content: "Package provides: mechanical support, thermal dissipation, power delivery from PCB to die, signal routing. Iterative co-design between chip PD and package teams.",
      },
    ],
    practicalNotes: [
      "Interview: explain RDL purpose — pad positions don't align with bump grid.",
      "PKG inductance affects SSO and power integrity — co-simulation with chip PDN.",
    ],
  },
  tapeout: {
    title: "Tapeout — BTO, MTO, GDSII, GKC",
    subtitle: "Base Tape-Out, Metal Tape-Out, Gate Keeper Check",
    description:
      "Tapeout is when the design leaves the digital world for fabrication. BTO (Base Tape-Out) freezes FEOL layers (active, poly, diffusion); MTO (Metal Tape-Out) finalizes BEOL layers (metals, vias). GKC and TOR are final gates before GDSII release.",
    deepDive: [
      "BTO: freezes transistor-level layers — OD, poly, active, well, contact. Enables parallelization: FEOL masks to fab while BEOL design continues.",
      "MTO: finalizes all metal layers and vias. Complete GDSII with fill, seal ring, scribe line. The 'real' tapeout for most flows.",
      "GKC: structured multi-disciplinary review. Checklist signed by FE, PD, PV, STA, DFT, package. No release without GKC pass.",
      "TOR: final meeting with all stakeholders. Single 'no' blocks tapeout. Advanced node mask cost: $2–5M+. 3–4 months fab. No undo.",
    ],
    inputs: [
      "Signoff-clean layout (DRC, LVS, STA, IR, EM)",
      "Final netlist + SDC + UPF",
      "Layer map + foundry submission kit",
      "Foundry-approved waiver list",
      "Locked PDK version",
    ],
    outputs: [
      "GDSII / OASIS file",
      "Tapeout documentation package",
      "Signoff reports archive",
      "Mask data (via foundry OPC/RET)",
      "Engineering wafer (first silicon)",
    ],
    tools: ["Calibre xRC", "Calibre Merge", "KLayout", "Foundry portal", "OPC/RET (foundry-side)"],
    keyConcepts: ["BTO: Base Tape-Out (FEOL freeze)", "MTO: Metal Tape-Out (BEOL finalize)", "GKC: Gate Keeper Check", "TOR: Tapeout Review meeting", "GDSII / OASIS format", "MPW vs Full Mask tapeout"],
    subsections: [
      {
        title: "BTO — Base Tape-Out",
        content: "Freezes FEOL layers: diffusion, poly, active, well, contact. Base DRC at floorplan/placement. Checks tap cells, endcaps, tie cells, orientation.",
        bullets: ["FEOL layers: transistor formation", "Softcheck + ERC for power shorts", "ESD clamp cell verification"],
      },
      {
        title: "MTO — Metal Tape-Out",
        content: "Finalizes all metal layers, vias, passivation, fill. Metal DRC at routing. Merge GDS: design + cells + IO + fill + seal ring.",
        bullets: ["Merged GDS DRC (not intermediate DB)", "Post-fill, post-ECO LVS", "Density fill verification"],
      },
      {
        title: "GKC — Gate Keeper Check",
        content: "Multi-disciplinary pre-tapeout checkpoint. Each team certifies their domain. Includes waiver review, PDK lock, data package completeness.",
        bullets: ["FE: RTL↔netlist LEC, CDC signoff", "PD: timing/power/physical signoff", "PV: DRC/LVS/ERC zero violations", "DFT: scan/MBIST verified"],
      },
      {
        title: "Tapeout Checklist (30 points)",
        content: "Production checklist: PDK locked, DRC zero, LVS CORRECT, STA all corners green, IR/EM signed off, antenna clean, fill inserted, GDS merged, TOR completed.",
      },
    ],
    exitCriteria: [
      { name: "All signoff green", description: "DRC, LVS, STA, IR, EM, antenna — all pass" },
      { name: "GKC approved", description: "Gate Keeper Check signed by all disciplines" },
      { name: "TOR completed", description: "Tapeout Review: unanimous go/no-go" },
      { name: "GDS merged & verified", description: "Final merged GDS passes DRC/LVS" },
    ],
    practicalNotes: [
      "Interview: explain BTO/MTO split rationale — parallelize FEOL mask making with BEOL design.",
      "GKC is process not tool — know every discipline's deliverable.",
    ],
  },
};
