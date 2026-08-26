import { loc } from "@/i18n/context";
import type { PlaybookChapter } from "./playbook";

/** Fourth wave playbook chapters — DFT deep, DFM, signoff war stories, numerical drills. */
export const playbookEvenMore: PlaybookChapter[] = [
  {
    id: "dft-deep",
    title: loc("DFT end-to-end — da RTL al ATE", "DFT end-to-end — from RTL to ATE"),
    kicker: loc(
      "Scan non è un checkbox. È metà del debug silicon e metà del yield.",
      "Scan is not a checkbox. It is half of silicon debug and half of yield."
    ),
    paragraphs: [
      loc(
        "Scan insertion flow: DFT Compiler legge RTL/ netlist, identifica scan-able FF, inserisce SDFF, costruisce scan chains, inserisce lock-up cells sui crossing di domain, aggiunge compression logic (XOR/MISR/EDT). Output: scan netlist, SDC test mode, test protocol file. LEC RTL↔scan netlist obbligatorio.",
        "Scan insertion flow: DFT Compiler reads RTL/netlist, identifies scan-able FFs, inserts SDFF, builds scan chains, inserts lock-up cells on domain crossings, adds compression logic (XOR/MISR/EDT). Output: scan netlist, SDC test mode, test protocol file. RTL↔scan netlist LEC mandatory."
      ),
      loc(
        "ATPG (Automatic Test Pattern Generation): Tessent, TetraMAX. Stuck-at coverage target >99%. Transition fault per delay defects. Path delay per critical paths. Pattern count impatta test time su ATE. Compression ratio tipico 50–100×.",
        "ATPG: Tessent, TetraMAX. Stuck-at coverage target >99%. Transition fault for delay defects. Path delay for critical paths. Pattern count impacts ATE test time. Typical compression ratio 50–100×."
      ),
      loc(
        "MBIST: controller per ogni SRAM macro. Algorithm March C-, March 13N, checkerboard. BISR (Built-In Self Repair) per yield improvement con spare rows/columns. MBIST coverage = memory bit coverage, non logic coverage.",
        "MBIST: controller per SRAM macro. Algorithms March C-, March 13N, checkerboard. BISR for yield improvement with spare rows/columns. MBIST coverage = memory bit coverage, not logic coverage."
      ),
      loc(
        "Scan hold post-CTS: scan chain attraversa clock domain → lock-up cell obbligatoria. Senza lock-up: 12k hold violations tipici su design grande. Fix: lock-up insertion in DFT, non delay cell massivo in PD.",
        "Scan hold post-CTS: scan chain crosses clock domain → mandatory lock-up cell. Without lock-up: 12k hold violations typical on large design. Fix: lock-up insertion in DFT, not massive delay cells in PD."
      ),
      loc(
        "OCC (On-Chip Clock Controller): per at-speed test. Bypass PLL, genera clock controllato per capture. OCC inserito nel clock tree. STA mode scan_capture con OCC active.",
        "OCC: for at-speed test. Bypass PLL, generate controlled clock for capture. OCC inserted in clock tree. STA mode scan_capture with OCC active."
      ),
      loc(
        "ATE program: pattern da ATPG, timing da SDF test mode, voltage levels, pin mapping. Shmoo su ATE: voltage × frequency per margin characterization. First silicon debug con scan dump.",
        "ATE program: patterns from ATPG, timing from SDF test mode, voltage levels, pin mapping. ATE shmoo: voltage × frequency for margin characterization. First silicon debug with scan dump."
      ),
    ],
  },
  {
    id: "dfm-rules",
    title: loc("DFM — regole che salvano il yield", "DFM — rules that save yield"),
    kicker: loc(
      "Un DRC clean non basta. DFM è il layer sotto che il foundry non sempre urla.",
      "DRC clean is not enough. DFM is the layer below that the foundry does not always shout about."
    ),
    paragraphs: [
      loc(
        "Via rules: single-cut via su signal = reliability risk. Multi-cut (double, triple) mandatory su power e clock. Via enclosure: metal overlap su via da DRM. Via spacing: min distance tra via array.",
        "Via rules: single-cut via on signal = reliability risk. Multi-cut (double, triple) mandatory on power and clock. Via enclosure: metal overlap on via from DRM. Via spacing: min distance between via arrays."
      ),
      loc(
        "Metal width/spacing: min width per layer da DRM. Widen per EM. Spacing per crosstalk e litho. NDR (non-default rule) per clock: 2× width, 2× spacing.",
        "Metal width/spacing: min width per layer from DRM. Widen for EM. Spacing for crosstalk and litho. NDR for clock: 2× width, 2× spacing."
      ),
      loc(
        "Density: min density per CMP (no dishing), max density per erosion. Window size 50–100 µm. Fill insertion per compliance. Timing impact di fill: capacitance aggiuntiva.",
        "Density: min density for CMP (no dishing), max density for erosion. Window size 50–100 µm. Fill insertion for compliance. Fill timing impact: added capacitance."
      ),
      loc(
        "Double patterning (DPT): layer Mx split in due mask. Coloring assignment: alternating colors. Same-color spacing > diff-color spacing. Odd-cycle conflict = reroute required.",
        "Double patterning: layer Mx split into two masks. Coloring assignment: alternating colors. Same-color spacing > diff-color spacing. Odd-cycle conflict = reroute required."
      ),
      loc(
        "Antenna: plasma etch charges gate oxide. Ratio = metal area / gate area. Fix: diode clamp, metal jumper to upper layer, gate array. Antenna check pre- and post-route.",
        "Antenna: plasma etch charges gate oxide. Ratio = metal area / gate area. Fix: diode clamp, metal jumper to upper layer, gate array. Antenna check pre- and post-route."
      ),
      loc(
        "Litho-friendly layout: jog minimization, line-end extension, forbidden pitch. Foundry provides DFM deck beyond standard DRC. Run DFM check before tapeout.",
        "Litho-friendly layout: jog minimization, line-end extension, forbidden pitch. Foundry provides DFM deck beyond standard DRC. Run DFM check before tapeout."
      ),
    ],
  },
  {
    id: "signoff-war-stories",
    title: loc("Signoff — storie vere e lesson learned", "Signoff — real stories and lessons learned"),
    kicker: loc(
      "Ogni respin ha una root cause. Imparare dagli errori altrui costa meno di $2M.",
      "Every respin has a root cause. Learning from others' mistakes costs less than $2M."
    ),
    paragraphs: [
      loc(
        "Caso 1: WNS passava senza fill SPEF. Post-fill SPEF aggiunge capacitance → WNS −40 ps. Lesson: signoff STA con fill-inclusive SPEF, non pre-fill.",
        "Case 1: WNS passed without fill SPEF. Post-fill SPEF adds capacitance → WNS −40 ps. Lesson: signoff STA with fill-inclusive SPEF, not pre-fill."
      ),
      loc(
        "Caso 2: 12k scan hold failures. Lock-up cells mancanti sui crossing di scan chain tra clock domain. Lesson: DFT review pre-CTS, non post-CTS panic.",
        "Case 2: 12k scan hold failures. Missing lock-up cells on scan chain crossings between clock domains. Lesson: DFT review pre-CTS, not post-CTS panic."
      ),
      loc(
        "Caso 3: GKC veto su coloring. Odd-cycle conflict su M2 non risolto. Lesson: coloring check pre-route commit, non post-route.",
        "Case 3: GKC veto on coloring. Unresolved odd-cycle conflict on M2. Lesson: coloring check pre-route commit, not post-route."
      ),
      loc(
        "Caso 4: IR drop 8% su path critico. Strap sottodimensionato su hotspot CPU. Lesson: vector-based IR con VCD reale, non vectorless.",
        "Case 4: 8% IR drop on critical path. Undersized strap on CPU hotspot. Lesson: vector-based IR with real VCD, not vectorless."
      ),
      loc(
        "Caso 5: Silicon passa a 0.72 V, STA fail a 0.75 V SS. OCV troppo pessimistico. Lesson: silicon correlation, aggiorna POCV.",
        "Case 5: Silicon passes at 0.72 V, STA fails at 0.75 V SS. OCV too pessimistic. Lesson: silicon correlation, update POCV."
      ),
      loc(
        "Caso 6: Metal-only ECO rompe LEC. Spare NAND rewired ma non modellata in golden. Lesson: LEC gate↔gate su ogni ECO, anche metal-only.",
        "Case 6: Metal-only ECO breaks LEC. Spare NAND rewired but not modeled in golden. Lesson: gate↔gate LEC on every ECO, even metal-only."
      ),
    ],
  },
  {
    id: "numerical-drills",
    title: loc("Drill numerici — porta la calcolatrice", "Numerical drills — bring your calculator"),
    kicker: loc(
      "Al colloquio senior ti chiedono numeri, non slogan.",
      "Senior interviews ask for numbers, not slogans."
    ),
    paragraphs: [
      loc(
        "FO4 budget: t_FO4 = 12 ps @ 7 nm SS. Tclk = 833 ps @ 1.2 GHz. Overhead clock 180 ps, setup 40 ps, margin 50 ps. Logica budget = 833 − 180 − 40 − 50 = 563 ps → 563/12 ≈ 47 FO4. Un path da 60 FO4 non chiude.",
        "FO4 budget: t_FO4 = 12 ps @ 7 nm SS. Tclk = 833 ps @ 1.2 GHz. Clock overhead 180 ps, setup 40 ps, margin 50 ps. Logic budget = 833 − 180 − 40 − 50 = 563 ps → 563/12 ≈ 47 FO4. A 60 FO4 path will not close."
      ),
      loc(
        "IR drop: I = 0.5 A, R_strap = 0.05 Ω, VDD = 0.75 V. Drop = 0.5 × 0.05 = 25 mV = 3.3%. Sotto 5% target. Se I = 1.5 A: 75 mV = 10% → fail.",
        "IR drop: I = 0.5 A, R_strap = 0.05 Ω, VDD = 0.75 V. Drop = 0.5 × 0.05 = 25 mV = 3.3%. Under 5% target. If I = 1.5 A: 75 mV = 10% → fail."
      ),
      loc(
        "EM MTTF: J/Jmax = 1.6, n = 2. MTTF/MTTF0 = (1/1.6)² = 0.39. Target 10 yr → actual 3.9 yr. Due via in parallelo: J ≈ 0.8 Jmax → (1/0.8)² = 1.56 → 15.6 yr.",
        "EM MTTF: J/Jmax = 1.6, n = 2. MTTF/MTTF0 = (1/1.6)² = 0.39. 10 yr target → actual 3.9 yr. Two parallel vias: J ≈ 0.8 Jmax → (1/0.8)² = 1.56 → 15.6 yr."
      ),
      loc(
        "Decap: ΔI = 2 A, Δt = 90 ps, budget ΔV = 40 mV. C ≥ I·Δt/ΔV = 2×90e-12/0.04 = 4.5 nF nel quadrante.",
        "Decap: ΔI = 2 A, Δt = 90 ps, budget ΔV = 40 mV. C ≥ I·Δt/ΔV = 2×90e-12/0.04 = 4.5 nF in the quadrant."
      ),
      loc(
        "Utilization: A_std = 8 mm², A_macro = 2 mm², U_target = 70%. A_core = (8+2)/0.7 = 14.3 mm². Die = core + IO ring (~1 mm perimeter) + seal.",
        "Utilization: A_std = 8 mm², A_macro = 2 mm², U_target = 70%. A_core = (8+2)/0.7 = 14.3 mm². Die = core + IO ring (~1 mm perimeter) + seal."
      ),
      loc(
        "MTBF synchronizer: τ = 50 ps, t_r = 400 ps, f_clk = 1 GHz, f_data = 100 MHz, T0 = 0.2 ps. MTBF = exp(400/50)/(1e9×1e8×0.2e-12) ≈ exp(8)/0.02 ≈ 1.5e5 sec ≈ 42 ore. Troppo basso → serve FIFO o handshake.",
        "MTBF synchronizer: τ = 50 ps, t_r = 400 ps, f_clk = 1 GHz, f_data = 100 MHz, T0 = 0.2 ps. MTBF = exp(400/50)/(1e9×1e8×0.2e-12) ≈ exp(8)/0.02 ≈ 1.5e5 sec ≈ 42 hours. Too low → need FIFO or handshake."
      ),
    ],
  },
];
