import { loc, type Localized } from "@/i18n/context";
import type { StageId } from "./stages";

export interface WorkedExample {
  id: string;
  stage: StageId;
  title: Localized;
  given: Localized<string[]>;
  steps: { title: Localized; body: Localized }[];
  result: Localized;
}

export const workedExamplesMore: WorkedExample[] = [
  {
    id: "ex-mtbf-2ff",
    stage: "verification",
    title: loc("MTBF di un sincronizzatore 2-FF", "2-FF synchronizer MTBF"),
    given: loc(
      [
        "f_clk_dest = 800 MHz → Tclk = 1.25 ns",
        "τ (costante metastabilità FF) = 22 ps @ SS",
        "T0 (finestra caratteristica) = 0.18 ns",
        "Tempo di risoluzione t_r ≈ 1 ciclo dest = 1.25 ns (2-FF standard)",
      ],
      [
        "f_clk_dest = 800 MHz → Tclk = 1.25 ns",
        "τ (FF metastability constant) = 22 ps @ SS",
        "T0 (characteristic window) = 0.18 ns",
        "Resolution time t_r ≈ 1 dest cycle = 1.25 ns (standard 2-FF)",
      ]
    ),
    steps: [
      {
        title: loc("Formula MTBF", "MTBF formula"),
        body: loc(
          "MTBF = e^(t_r/τ) / (f_clk × T0). Esponente: 1250/22 = 56.8 → e^56.8 ≈ 4.2×10²⁴.",
          "MTBF = e^(t_r/τ) / (f_clk × T0). Exponent: 1250/22 = 56.8 → e^56.8 ≈ 4.2×10²⁴."
        ),
      },
      {
        title: loc("Denominatore", "Denominator"),
        body: loc(
          "f_clk × T0 = 800×10⁶ × 0.18×10⁻⁹ = 0.144. MTBF ≈ 4.2×10²⁴ / 0.144 ≈ 2.9×10²⁵ s ≈ 9×10¹⁷ anni.",
          "f_clk × T0 = 800×10⁶ × 0.18×10⁻⁹ = 0.144. MTBF ≈ 4.2×10²⁴ / 0.144 ≈ 2.9×10²⁵ s ≈ 9×10¹⁷ years."
        ),
      },
      {
        title: loc("Se f_dest sale a 1.6 GHz", "If f_dest rises to 1.6 GHz"),
        body: loc(
          "t_r resta 1 ciclo = 625 ps → esponente 28.4, e^28.4 ≈ 2.1×10¹². Denom = 1.6×10⁹ × 0.18×10⁻⁹ = 0.288. MTBF ≈ 7.3×10¹² s ≈ 2.3×10⁵ anni — ancora OK ma 10¹³× peggiore. A 2 GHz senza 3-FF o handshake serve review.",
          "t_r stays 1 cycle = 625 ps → exponent 28.4, e^28.4 ≈ 2.1×10¹². Denom = 1.6×10⁹ × 0.18×10⁻⁹ = 0.288. MTBF ≈ 7.3×10¹² s ≈ 2.3×10⁵ years — still OK but 10¹³× worse. At 2 GHz without 3-FF or handshake, review is required."
        ),
      },
    ],
    result: loc(
      "MTBF scala esponenzialmente con t_r/τ e linearmente inverso con f_clk. Il report CDC deve mostrare il numero, non solo «2-FF presente». Target industriale tipico ≥ 10⁴–10⁶ anni per dominio.",
      "MTBF scales exponentially with t_r/τ and inversely with f_clk. The CDC report must show the number, not just «2-FF present». Typical industrial target ≥ 10⁴–10⁶ years per domain."
    ),
  },
  {
    id: "ex-coverage-closure",
    stage: "verification",
    title: loc("Matematica di coverage closure", "Coverage closure math"),
    given: loc(
      [
        "Target functional coverage = 98%",
        "Coverage attuale = 91.2% su 4 800 coverpoint",
        "Ogni regression da 12 h scopre in media 0.35% nuovi (diminishing returns)",
        "Tapeout tra 3 settimane, farm capacità 2 regression/settimana",
      ],
      [
        "Functional coverage target = 98%",
        "Current coverage = 91.2% on 4,800 coverpoints",
        "Each 12 h regression discovers on average 0.35% new (diminishing returns)",
        "Tapeout in 3 weeks, farm capacity 2 regressions/week",
      ]
    ),
    steps: [
      {
        title: loc("Gap e coverpoint mancanti", "Gap and missing coverpoints"),
        body: loc(
          "Gap = 98 − 91.2 = 6.8%. Coverpoint non colpiti ≈ 4800 × 0.068 = 326. Non sono tutti uguali: i primi 3% sono facili, l'ultimo 1% sono corner rari.",
          "Gap = 98 − 91.2 = 6.8%. Uncovered coverpoints ≈ 4800 × 0.068 = 326. They are not equal: the first 3% are easy, the last 1% are rare corners."
        ),
      },
      {
        title: loc("Regression disponibili", "Available regressions"),
        body: loc(
          "3 settimane × 2 run = 6 regression. A 0.35%/run lineare: 6 × 0.35 = 2.1% → arrivi a 93.3%, NON al 98%. Serve directed test o formal cover sul gap.",
          "3 weeks × 2 runs = 6 regressions. At 0.35%/run linear: 6 × 0.35 = 2.1% → you reach 93.3%, NOT 98%. Directed tests or formal cover on the gap are required."
        ),
      },
      {
        title: loc("Decisione GKC", "GKC decision"),
        body: loc(
          "Lista waiver: 326 hole classificati (analog untestable 40, dead code 12, bug fix pending 8, directed needed 266). Senza lista il 91.2% è una slide. Il FE signoff accetta 98% con waiver firmati o slitta sintesi.",
          "Waiver list: 326 holes classified (analog untestable 40, dead code 12, bug fix pending 8, directed needed 266). Without a list, 91.2% is a slide. FE signoff accepts 98% with signed waivers or synthesis slips."
        ),
      },
    ],
    result: loc(
      "Coverage è percentuale × lista buchi. La farm capacity non chiude un gap del 6.8% da sola: quantifica regression residue e directed effort prima del GKC RTL.",
      "Coverage is percentage × hole list. Farm capacity alone does not close a 6.8% gap: quantify remaining regressions and directed effort before RTL GKC."
    ),
  },
  {
    id: "ex-wns-tns-prio",
    stage: "synthesis",
    title: loc("Interpretare WNS/TNS post-synth", "Interpret post-synth WNS/TNS"),
    given: loc(
      [
        "Corner SS@0.72 V@125°C: WNS = −62 ps, TNS = −8.4 ns",
        "Endpoint violati = 412 (su 1.2 M)",
        "Path #1: WNS, 38 livelli logici, 72% cell delay",
        "Path #2: −41 ps, 12 livelli, 55% net delay (WLM)",
      ],
      [
        "Corner SS@0.72 V@125°C: WNS = −62 ps, TNS = −8.4 ns",
        "Violating endpoints = 412 (of 1.2 M)",
        "Path #1: WNS, 38 logic levels, 72% cell delay",
        "Path #2: −41 ps, 12 levels, 55% net delay (WLM)",
      ]
    ),
    steps: [
      {
        title: loc("Volume vs picco", "Volume vs peak"),
        body: loc(
          "TNS/|WNS| ≈ 8400/62 ≈ 135 endpoint-equivalenti medi — ma 412 violati reali. Molti path a −20…−40 ps: problema di volume (VT swap massivo, boundary opt), non un solo critical path.",
          "TNS/|WNS| ≈ 8400/62 ≈ 135 average endpoint-equivalents — but 412 real violators. Many paths at −20…−40 ps: volume problem (mass VT swap, boundary opt), not a single critical path."
        ),
      },
      {
        title: loc("Arma per path", "Weapon per path"),
        body: loc(
          "Path #1 (38 livelli, cell-heavy): RTL pipeline, retime, upsize driver, LVT su cone critico. Path #2 (net-heavy con WLM): non fidarti — post-place il net esplode. Boundary register o fisica anticipata (Fusion Compiler).",
          "Path #1 (38 levels, cell-heavy): RTL pipeline, retime, upsize driver, LVT on critical cone. Path #2 (net-heavy with WLM): do not trust it — net explodes post-place. Boundary register or early physical (Fusion Compiler)."
        ),
      },
      {
        title: loc("Handoff PD", "PD handoff"),
        body: loc(
          "Non passare al PD con WNS −62 ps sperando nel placer. Target pre-handoff: WNS ≥ −20 ps o budget firmato. I 412 endpoint diventano 2000 post-route se il floorplan è cattivo.",
          "Do not hand off to PD at WNS −62 ps hoping the placer saves you. Pre-handoff target: WNS ≥ −20 ps or signed budget. The 412 endpoints become 2000 post-route if the floorplan is bad."
        ),
      },
    ],
    result: loc(
      "WNS dice dove guardare; TNS dice quanto lavoro. Breakdown cell vs net decide RTL vs PD. Un TNS −8.4 ns con WNS −62 ps è synth+floorplan, non un buffer in P&R.",
      "WNS says where to look; TNS says how much work. Cell vs net breakdown decides RTL vs PD. TNS −8.4 ns with WNS −62 ps is synth+floorplan, not one P&R buffer."
    ),
  },
  {
    id: "ex-vt-area-trade",
    stage: "synthesis",
    title: loc("Trade area/timing con Vt mix", "Area/timing trade with Vt mix"),
    given: loc(
      [
        "Blocco DSP: 240 k gate-equivalent, timing WNS = −28 ps",
        "Opzione A: +8% area, tutto LVT sul cone critico (12 k cell) → WNS +12 ps",
        "Opzione B: retime 1 stage (+1 ciclo latency), area flat, WNS +35 ps",
        "Leakage budget: +5% max; LVT leakage ≈ 3× HVT",
      ],
      [
        "DSP block: 240 k gate-equivalent, timing WNS = −28 ps",
        "Option A: +8% area, all LVT on critical cone (12 k cells) → WNS +12 ps",
        "Option B: retime 1 stage (+1 cycle latency), area flat, WNS +35 ps",
        "Leakage budget: +5% max; LVT leakage ≈ 3× HVT",
      ]
    ),
    steps: [
      {
        title: loc("Leakage opzione A", "Option A leakage"),
        body: loc(
          "12 k / 240 k = 5% celle → LVT. Se erano HVT, leakage locale ×3 su quel 5% → +10% leakage chip se il blocco è 50% del chip. Supera budget +5%. Serve LVT selettivo solo su 3 k cell (−11 ps stimati) o ULVT su path #1.",
          "12 k / 240 k = 5% of cells → LVT. If they were HVT, local leakage ×3 on that 5% → +10% chip leakage if the block is 50% of the chip. Exceeds +5% budget. Selective LVT on 3 k cells only (−11 ps estimated) or ULVT on path #1 is needed."
        ),
      },
      {
        title: loc("Confronto opzione B", "Option B comparison"),
        body: loc(
          "Retime +1 ciclo: latency architetturale +6.7% @ 15 stage pipeline. WNS +35 ps senza area. Se il protocollo tollera (AXI stream con FIFO), B vince. Se latency SLA < 12 cicli, B è veto arch.",
          "Retime +1 cycle: architectural latency +6.7% @ 15-stage pipeline. WNS +35 ps with no area. If the protocol tolerates it (AXI stream with FIFO), B wins. If latency SLA < 12 cycles, B is arch veto."
        ),
      },
    ],
    result: loc(
      "Area vs timing non è solo upsize: è Vt mix × leakage × latency contract. Porta i tre numeri al meeting synth, non «mettiamo LVT ovunque».",
      "Area vs timing is not just upsize: it is Vt mix × leakage × latency contract. Bring all three numbers to the synth meeting, not «put LVT everywhere»."
    ),
  },
  {
    id: "ex-cdc-mtbf-rtl",
    stage: "rtl",
    title: loc("CDC MTBF a 1.5 GHz — decisione RTL", "CDC MTBF at 1.5 GHz — RTL decision"),
    given: loc(
      [
        "Crossing single-bit: clk_slow 200 MHz → clk_fast 1.5 GHz",
        "τ = 18 ps, T0 = 0.15 ns",
        "2-FF sync: t_r = 1 ciclo fast = 667 ps",
        "Requisito automotive: MTBF ≥ 10⁶ anni per crossing",
      ],
      [
        "Single-bit crossing: clk_slow 200 MHz → clk_fast 1.5 GHz",
        "τ = 18 ps, T0 = 0.15 ns",
        "2-FF sync: t_r = 1 fast cycle = 667 ps",
        "Automotive requirement: MTBF ≥ 10⁶ years per crossing",
      ]
    ),
    steps: [
      {
        title: loc("Calcolo 2-FF", "2-FF calculation"),
        body: loc(
          "e^(667/18) = e^37.1 ≈ 1.1×10¹⁶. Denom = 1.5×10⁹ × 0.15×10⁻⁹ = 0.225. MTBF ≈ 4.9×10¹⁶ s ≈ 1.5×10⁹ anni — passa ampiamente.",
          "e^(667/18) = e^37.1 ≈ 1.1×10¹⁶. Denom = 1.5×10⁹ × 0.15×10⁻⁹ = 0.225. MTBF ≈ 4.9×10¹⁶ s ≈ 1.5×10⁹ years — passes easily."
        ),
      },
      {
        title: loc("Se clk_fast sale a 2.2 GHz", "If clk_fast rises to 2.2 GHz"),
        body: loc(
          "t_r = 455 ps → e^25.3 ≈ 9.5×10¹⁰. Denom = 0.33. MTBF ≈ 2.9×10¹¹ s ≈ 9×10³ anni — sotto 10⁶. Fix RTL: 3-FF (t_r ≈ 2 cicli = 909 ps → MTBF ~10¹⁸ anni) o handshake per control, gray FIFO per data.",
          "t_r = 455 ps → e^25.3 ≈ 9.5×10¹⁰. Denom = 0.33. MTBF ≈ 2.9×10¹¹ s ≈ 9×10³ years — below 10⁶. RTL fix: 3-FF (t_r ≈ 2 cycles = 909 ps → MTBF ~10¹⁸ years) or handshake for control, gray FIFO for data."
        ),
      },
    ],
    result: loc(
      "La decisione 2-FF vs 3-FF si prende a RTL con MTBF numerico, non dopo il respin. Un crossing control a 2.2 GHz senza 3-FF è un bug di architettura, non di PD.",
      "The 2-FF vs 3-FF decision is made at RTL with numeric MTBF, not after respin. A control crossing at 2.2 GHz without 3-FF is an architecture bug, not a PD bug."
    ),
  },
  {
    id: "ex-sso-bounce",
    stage: "package",
    title: loc("Stima SSO bounce su bus DDR", "SSO bounce estimate on DDR bus"),
    given: loc(
      [
        "Bus 32-bit DDR @ 3.3 V, edge 150 ps, C_load = 8 pF per pin",
        "L_pkg (power loop) ≈ 0.6 nH per gruppo di 8 IO",
        "16 bit switchano simultaneamente (pattern worst)",
        "Limite noise VSS bounce = 150 mV (5% IO supply)",
      ],
      [
        "32-bit DDR bus @ 3.3 V, 150 ps edge, C_load = 8 pF per pin",
        "L_pkg (power loop) ≈ 0.6 nH per group of 8 IO",
        "16 bits switch simultaneously (worst pattern)",
        "VSS bounce limit = 150 mV (5% of IO supply)",
      ]
    ),
    steps: [
      {
        title: loc("Corrente per pin", "Current per pin"),
        body: loc(
          "I_pin ≈ C × dV/dt = 8e-12 × (3.3/150e-12) = 176 mA. 16 pin → ΔI = 16 × 176 mA = 2.82 A in 150 ps.",
          "I_pin ≈ C × dV/dt = 8e-12 × (3.3/150e-12) = 176 mA. 16 pins → ΔI = 16 × 176 mA = 2.82 A in 150 ps."
        ),
      },
      {
        title: loc("Bounce L·di/dt", "L·di/dt bounce"),
        body: loc(
          "di/dt = 2.82 / 150e-12 = 1.88×10¹⁰ A/s. V_bounce = 0.6e-9 × 1.88×10¹⁰ = 11.3 V — catastrofico. Anche con L_eff = 0.1 nH: 1.9 V. Il modello lumped mostra che serve decoupling pkg + ratio PG.",
          "di/dt = 2.82 / 150e-12 = 1.88×10¹⁰ A/s. V_bounce = 0.6e-9 × 1.88×10¹⁰ = 11.3 V — catastrophic. Even with L_eff = 0.1 nH: 1.9 V. The lumped model shows package decoupling + PG ratio are required."
        ),
      },
      {
        title: loc("Mitigazione co-design", "Co-design mitigation"),
        body: loc(
          "Stagger output enable (4 gruppi × 4 bit), ratio 2:1 VDD:GND bump nel gruppo DDR, on-die decap vicino al PHY, IBIS SSO sim. Target: < 150 mV con pattern realistico, non solo lumped worst.",
          "Stagger output enable (4 groups × 4 bits), 2:1 VDD:GND bump ratio in the DDR group, on-die decap near PHY, IBIS SSO sim. Target: < 150 mV with realistic pattern, not lumped worst only."
        ),
      },
    ],
    result: loc(
      "SSO non è «il package team sistema». Il PD riserva decap, il bump map PG, e valida con IBIS prima del GKC. 16 bit simultanei a 150 ps senza stagger fallisce sempre il lumped check.",
      "SSO is not «the package team will fix it». PD reserves decap, PG bump map, and validates with IBIS before GKC. 16 simultaneous bits at 150 ps without stagger always fails the lumped check."
    ),
  },
  {
    id: "ex-tap-spacing",
    stage: "layout",
    title: loc("Conteggio tap cell per spacing", "Tap cell count for spacing"),
    given: loc(
      [
        "Core width W = 2 800 µm, altezza row H = 0.27 µm (7 nm FinFET)",
        "Regola foundry: tap ogni ≤ 50 µm orizzontale (N-well continuity)",
        "2 file di std-cell rows per «strip» verticale",
        "Tap cell width = 0.26 µm (1 site)",
      ],
      [
        "Core width W = 2,800 µm, row height H = 0.27 µm (7 nm FinFET)",
        "Foundry rule: tap every ≤ 50 µm horizontal (N-well continuity)",
        "2 std-cell row files per vertical «strip»",
        "Tap cell width = 0.26 µm (1 site)",
      ]
    ),
    steps: [
      {
        title: loc("Tap per riga", "Taps per row"),
        body: loc(
          "N_tap_row = ceil(2800 / 50) + 1 = 57 tap per fila (inclusi bordi). Due file → 57 × 2 = 114 tap per strip verticale di row pair.",
          "N_tap_row = ceil(2800 / 50) + 1 = 57 taps per row (including edges). Two files → 57 × 2 = 114 taps per vertical strip of row pair."
        ),
      },
      {
        title: loc("Strip verticali nel core", "Vertical strips in core"),
        body: loc(
          "Core height ≈ 2 400 µm → 2400/0.27 ≈ 8 889 row. Con row pair (2×H): 4444 strip. Tap totali ≈ 114 × 4444 ≈ 506 k tap. Area tap ≈ 506k × 0.26 µm × 0.27 µm ≈ 0.035 mm².",
          "Core height ≈ 2,400 µm → 2400/0.27 ≈ 8,889 rows. With row pair (2×H): 4444 strips. Total taps ≈ 114 × 4444 ≈ 506 k taps. Tap area ≈ 506k × 0.26 µm × 0.27 µm ≈ 0.035 mm²."
        ),
      },
      {
        title: loc("Impatto utilization", "Utilization impact"),
        body: loc(
          "Su core 2.8×2.4 mm = 6.72 mm², tap ≈ 0.5% area — trascurabile ma obbligatorio. Tap mancanti → latch-up DRC fail al GDS merge, non fixabile in ECO metal-only.",
          "On core 2.8×2.4 mm = 6.72 mm², taps ≈ 0.5% area — negligible but mandatory. Missing taps → latch-up DRC fail at GDS merge, not fixable in metal-only ECO."
        ),
      },
    ],
    result: loc(
      "Tap count = f(larghezza core, pitch rule, row count). Si inseriscono a placement/fill, non al tapeout. Un «dimenticato» da 200 µm è DRC batch fail su tutto il chip.",
      "Tap count = f(core width, pitch rule, row count). Inserted at placement/fill, not at tapeout. One «forgotten» 200 µm gap is batch DRC fail on the whole chip."
    ),
  },
  {
    id: "ex-hold-ff-corner",
    stage: "sta",
    title: loc("Hold slack post-route (corner FF)", "Post-route hold slack (FF corner)"),
    given: loc(
      [
        "Corner FF@0.88 V@−40°C, path reg→reg stesso dominio",
        "Tco_min = 38 ps, Tpd_min = 22 ps (net incluso)",
        "Thold = 28 ps, uncertainty_hold = 15 ps",
        "Tclk_launch = 420 ps, Tclk_capture = 510 ps (skew +90 ps)",
      ],
      [
        "Corner FF@0.88 V@−40°C, reg→reg path same domain",
        "Tco_min = 38 ps, Tpd_min = 22 ps (net included)",
        "Thold = 28 ps, hold uncertainty = 15 ps",
        "Tclk_launch = 420 ps, Tclk_capture = 510 ps (skew +90 ps)",
      ]
    ),
    steps: [
      {
        title: loc("Data arrival", "Data arrival"),
        body: loc(
          "AT_hold = Tclk_launch + Tco + Tpd = 420 + 38 + 22 = 480 ps.",
          "AT_hold = Tclk_launch + Tco + Tpd = 420 + 38 + 22 = 480 ps."
        ),
      },
      {
        title: loc("Required e slack", "Required and slack"),
        body: loc(
          "RT_hold = Tclk_capture + Thold + unc = 510 + 28 + 15 = 553 ps. Slack_hold = AT − RT = 480 − 553 = −73 ps. FAIL.",
          "RT_hold = Tclk_capture + Thold + unc = 510 + 28 + 15 = 553 ps. Hold slack = AT − RT = 480 − 553 = −73 ps. FAIL."
        ),
      },
      {
        title: loc("Fix minimo", "Minimum fix"),
        body: loc(
          "Serve +73 ps delay sul data: 2 delay cell × 40 ps = 80 ps (con margine OCV). Oppure ridurre skew locale di 73 ps su quel cluster CTS — trade setup sul path vicino.",
          "Need +73 ps delay on data: 2 delay cells × 40 ps = 80 ps (with OCV margin). Or reduce local skew by 73 ps on that CTS cluster — trades setup on the neighbor path."
        ),
      },
    ],
    result: loc(
      "Hold post-route si chiude su FF corner, non SS. Skew da useful skew setup è la causa #1. Delay cell è il fix locale; skew tweak è il fix strutturale se il cluster è piccolo.",
      "Post-route hold closes on FF corner, not SS. Skew from useful-skew setup is cause #1. Delay cells are the local fix; skew tweak is the structural fix if the cluster is small."
    ),
  },
  {
    id: "ex-mcp-setup",
    stage: "sta",
    title: loc("Multicycle path setup (−end 3)", "Multicycle path setup (−end 3)"),
    given: loc(
      [
        "Path divider-by-3: dati stabili al 3° rising edge",
        "Tclk = 2.0 ns (500 MHz), MCP SDC: setup −end 3, hold −end 1",
        "Tco = 90 ps, Tpd_combo = 4.8 ns, Tsu = 50 ps",
        "Skew = +25 ps (capture ritardato), uncertainty = 60 ps",
      ],
      [
        "Divide-by-3 path: data stable on 3rd rising edge",
        "Tclk = 2.0 ns (500 MHz), MCP SDC: setup −end 3, hold −end 1",
        "Tco = 90 ps, Tpd_combo = 4.8 ns, Tsu = 50 ps",
        "Skew = +25 ps (late capture), uncertainty = 60 ps",
      ]
    ),
    steps: [
      {
        title: loc("Launch e capture cycle", "Launch and capture cycle"),
        body: loc(
          "Launch edge 0, capture edge 3 → tempo disponibile = 3 × Tclk = 6.0 ns (non 2.0 ns).",
          "Launch edge 0, capture edge 3 → available time = 3 × Tclk = 6.0 ns (not 2.0 ns)."
        ),
      },
      {
        title: loc("Setup check MCP", "MCP setup check"),
        body: loc(
          "AT = 0 + 90 + 4800 = 4890 ps. RT = skew_capture + 3×Tclk − Tsu − unc = 25 + 6000 − 50 − 60 = 5915 ps. Slack = 5915 − 4890 = +1025 ps. PASS con margine enorme.",
          "AT = 0 + 90 + 4800 = 4890 ps. RT = skew_capture + 3×Tclk − Tsu − unc = 25 + 6000 − 50 − 60 = 5915 ps. Slack = 5915 − 4890 = +1025 ps. PASS with huge margin."
        ),
      },
      {
        title: loc("Hold MCP (−end 1)", "MCP hold (−end 1)"),
        body: loc(
          "Hold guarda capture adjacente (edge 1): tempo = 1×Tclk = 2 ns. Se Tpd_min = 200 ps, AT_min = 290 ps vs RT_hold ≈ 25 + 2000 + 28 + 15 = 2068 ps → hold OK. MCP hold −end 1 è il check che dimenticano.",
          "Hold checks adjacent capture (edge 1): time = 1×Tclk = 2 ns. If Tpd_min = 200 ps, AT_min = 290 ps vs RT_hold ≈ 25 + 2000 + 28 + 15 = 2068 ps → hold OK. MCP hold −end 1 is the check people forget."
        ),
      },
    ],
    result: loc(
      "MCP setup moltiplica Tclk, non Tpd. Serve contratto arch + SDC coerente (setup −end N, hold −end 1). Un false MCP su bus handshake è un respin classico.",
      "MCP setup multiplies Tclk, not Tpd. Requires arch contract + coherent SDC (setup −end N, hold −end 1). A false MCP on a handshake bus is a classic respin."
    ),
  },
  {
    id: "ex-density-window",
    stage: "pv",
    title: loc("Finestra density CMP", "CMP density window"),
    given: loc(
      [
        "Layer M2, finestra 50 µm × 50 µm",
        "ρ_min = 25%, ρ_max = 70% (foundry)",
        "Area finestra = 2 500 µm²",
        "Metal routed = 1 200 µm², ρ = 48%",
      ],
      [
        "Layer M2, window 50 µm × 50 µm",
        "ρ_min = 25%, ρ_max = 70% (foundry)",
        "Window area = 2,500 µm²",
        "Routed metal = 1,200 µm², ρ = 48%",
      ]
    ),
    steps: [
      {
        title: loc("Check min/max", "Min/max check"),
        body: loc(
          "48% ∈ [25%, 70%] → PASS su routed alone. Post-fill target tipico 40–55% per CMP planare.",
          "48% ∈ [25%, 70%] → PASS on routed alone. Post-fill target typically 40–55% for planar CMP."
        ),
      },
      {
        title: loc("Finestra vicina macro (ρ = 12%)", "Window near macro (ρ = 12%)"),
        body: loc(
          "Metal routed = 300 µm² → ρ = 12% < 25%. FAIL — dishing risk. Serve dummy fill grounded: aggiungi 325 µm² → ρ = (300+325)/2500 = 25% esatto.",
          "Routed metal = 300 µm² → ρ = 12% < 25%. FAIL — dishing risk. Grounded dummy fill required: add 325 µm² → ρ = (300+325)/2500 = 25% exactly."
        ),
      },
      {
        title: loc("SPEF impact", "SPEF impact"),
        body: loc(
          "Fill grounded cambia Cground. Re-extract SPEF post-fill su regione macro → ΔWNS tipico 5–15 ps su net lunghi. Il PV density non è solo DRC: è timing.",
          "Grounded fill changes Cground. Re-extract SPEF post-fill on macro region → typical ΔWNS 5–15 ps on long nets. PV density is not just DRC: it is timing."
        ),
      },
    ],
    result: loc(
      "Density è per-finestra, non media chip. Fill prima di signoff SPEF. Una finestra al 12% vicino a SRAM è fix layout + re-STA, non waiver.",
      "Density is per-window, not chip average. Fill before SPEF signoff. A 12% window near SRAM is layout fix + re-STA, not a waiver."
    ),
  },
  {
    id: "ex-place-bin",
    stage: "placement",
    title: loc("Density bin e spreading", "Density bin and spreading"),
    given: loc(
      [
        "Global place: bin 20 µm, target density 0.80",
        "Bin A (vicino SRAM): placed density = 0.94",
        "Bin B (periferia): placed density = 0.52",
        "Overflow routing stimato su bin A = 18%",
      ],
      [
        "Global place: bin 20 µm, target density 0.80",
        "Bin A (near SRAM): placed density = 0.94",
        "Bin B (periphery): placed density = 0.52",
        "Estimated routing overflow on bin A = 18%",
      ]
    ),
    steps: [
      {
        title: loc("Leggere la mappa", "Read the map"),
        body: loc(
          "Media density chip può essere 0.78 (OK) mentre bin A a 0.94 predice overflow. Il 18% non si fixa con routeDesign -effort high.",
          "Chip average density can be 0.78 (OK) while bin A at 0.94 predicts overflow. The 18% is not fixed with routeDesign -effort high."
        ),
      },
      {
        title: loc("Spreading math", "Spreading math"),
        body: loc(
          "Per portare A da 0.94 a 0.82: sposta ~13% delle celle fuori dal bin (area-equivalent). Se bin A = 0.4 mm² con 200 k cell, ~26 k cell da redistribuire verso B/C.",
          "To bring A from 0.94 to 0.82: move ~13% of cells out of the bin (area-equivalent). If bin A = 0.4 mm² with 200 k cells, ~26 k cells to redistribute toward B/C."
        ),
      },
    ],
    result: loc(
      "Placement legge bin density, non utilization globale. 0.94 locale è congestion garantita. Spread prima di CTS, non dopo.",
      "Placement reads bin density, not global utilization. 0.94 local is guaranteed congestion. Spread before CTS, not after."
    ),
  },
  {
    id: "ex-channel-fp",
    stage: "floorplan",
    title: loc("Larghezza canale tra macro", "Channel width between macros"),
    given: loc(
      [
        "Due SRAM 4 MB, pin su lato interno, pitch pin = 0.8 µm",
        "Net critiche tra SRAM e logic: 1 200",
        "M3 pitch = 48 nm, 1 track ogni 2 net (2-track routing)",
        "Target: zero overflow nel canale",
      ],
      [
        "Two 4 MB SRAMs, pins on inner side, pin pitch = 0.8 µm",
        "Critical nets between SRAM and logic: 1,200",
        "M3 pitch = 48 nm, 1 track per 2 nets (2-track routing)",
        "Target: zero overflow in channel",
      ]
    ),
    steps: [
      {
        title: loc("Track demand", "Track demand"),
        body: loc(
          "Track netti ≈ 1200 / 2 = 600 track. Con via/blockage 25% → 600 × 1.25 = 750 track-equivalent.",
          "Net tracks ≈ 1200 / 2 = 600 tracks. With 25% via/blockage → 600 × 1.25 = 750 track-equivalents."
        ),
      },
      {
        title: loc("Larghezza canale", "Channel width"),
        body: loc(
          "750 track × 48 nm = 36 µm solo M3. Multi-layer (M3+M4) con 60% su M3: W_channel ≈ 36/0.6 ≈ 60 µm + margin 20% → 72 µm minimo. Floorplan con 40 µm è respin routing.",
          "750 tracks × 48 nm = 36 µm M3 only. Multi-layer (M3+M4) with 60% on M3: W_channel ≈ 36/0.6 ≈ 60 µm + 20% margin → 72 µm minimum. A 40 µm floorplan is a routing respin."
        ),
      },
    ],
    result: loc(
      "Channel width = f(net count, pitch, layer plan). Si calcola al floorplan, non si scopre al global route. 40 µm vs 72 µm è settimane di overflow.",
      "Channel width = f(net count, pitch, layer plan). Computed at floorplan, not discovered at global route. 40 µm vs 72 µm is weeks of overflow."
    ),
  },
  {
    id: "ex-mask-bto",
    stage: "tapeout",
    title: loc("Costo respin BTO vs MTO", "BTO vs MTO respin cost"),
    given: loc(
      [
        "Nodo 5 nm, mask set completo ≈ $3.2 M",
        "Split: BTO (FEOL) = 55% costo, MTO (BEOL) = 45%",
        "Bug trovato post-BTO: ECO metal-only sufficiente",
        "Bug trovato post-MTO: nuova cella in hole FEOL",
      ],
      [
        "5 nm node, full mask set ≈ $3.2 M",
        "Split: BTO (FEOL) = 55% cost, MTO (BEOL) = 45%",
        "Bug found post-BTO: metal-only ECO sufficient",
        "Bug found post-MTO: new cell in FEOL hole",
      ]
    ),
    steps: [
      {
        title: loc("ECO metal-only post-BTO", "Metal-only ECO post-BTO"),
        body: loc(
          "Solo layer metal toccati: ~4–8 mask BEOL su 45% → $140–290 k + 6–8 settimane coda. FEOL intatto.",
          "Metal layers only: ~4–8 BEOL masks of 45% → $140–290 k + 6–8 weeks queue. FEOL untouched."
        ),
      },
      {
        title: loc("Nuova cella post-MTO", "New cell post-MTO"),
        body: loc(
          "Nuova std cell = diffusion+poly change → FEOL respin: 55% × $3.2 M = $1.76 M + 12–16 settimane. Spare 2% area avrebbe evitato.",
          "New std cell = diffusion+poly change → FEOL respin: 55% × $3.2 M = $1.76 M + 12–16 weeks. 2% spare area would have avoided it."
        ),
      },
    ],
    result: loc(
      "BTO/MTO split non è burocrazia: è opzione reale. Metal-only ECO è 6× più economico del FEOL respin. Spare cells al floorplan sono assicurazione, non lusso.",
      "BTO/MTO split is not bureaucracy: it is a real option. Metal-only ECO is 6× cheaper than FEOL respin. Spare cells at floorplan are insurance, not luxury."
    ),
  },
];
