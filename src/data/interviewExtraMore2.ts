import { loc } from "@/i18n/context";
import type { StageId } from "./stages";
import type { InterviewQuestion } from "./stageFormulas";

/** Second batch of additional senior Q&A merged into StageSection interview blocks. */
export const interviewExtraMore2: Record<StageId, InterviewQuestion[]> = {
  rtl: [
    {
      question: loc(
        "Retiming RTL: quando lo proponi al team architettura?",
        "RTL retiming: when do you propose it to the architecture team?"
      ),
      answer: loc(
        "Quando WNS post-synth è −200 ps e il path ha 3+ livelli di logica combinatoria senza pipeline. Retiming può recuperare 1–2 cicli (667–1334 ps a 1.5 GHz). Richiede LEC + formal re-proof. Non retimare attraverso CDC o domini clock diversi. Documentare ogni spostamento nel change log.",
        "When post-synth WNS is −200 ps and the path has 3+ combinational logic levels without pipeline. Retiming can recover 1–2 cycles (667–1334 ps at 1.5 GHz). Requires LEC + formal re-proof. Do not retime across CDC or different clock domains. Document every move in the change log."
      ),
    },
    {
      question: loc(
        "Bus AXI 512 bit a 3 mm di flyline — cosa negozi?",
        "512-bit AXI bus with 3 mm flyline — what do you negotiate?"
      ),
      answer: loc(
        "Ridurre width a 256 bit + double-pump, o avvicinare macro nel floorplan. A 7 nm 3 mm = 200–400 ps wire. Il PD partecipa alla review MAS quando DATA_W > 128. Non accettare «il router sistema» senza floorplan commitment.",
        "Cut width to 256-bit + double-pump, or move macros closer in floorplan. At 7 nm 3 mm = 200–400 ps wire. PD joins MAS review when DATA_W > 128. Do not accept «the router will fix it» without floorplan commitment."
      ),
    },
    {
      question: loc(
        "Lint waiver senza expiry — accetti?",
        "Lint waiver without expiry — do you accept?"
      ),
      answer: loc(
        "No. Ogni waiver richiede owner, rationale, approver, expiry <6 mesi. Target produzione <20 waiver totali. Waiver CDC/clock-gating richiedono review PD+FE. 500 waiver attivi = processo rotto.",
        "No. Every waiver needs owner, rationale, approver, expiry <6 months. Production target <20 total waivers. CDC/clock-gating waivers need PD+FE review. 500 active waivers = broken process."
      ),
    },
  ],
  verification: [
    {
      question: loc(
        "Coverage 95% ma mode scan senza VCD — firmi il handoff?",
        "95% coverage but scan mode has no VCD — do you sign handoff?"
      ),
      answer: loc(
        "No. RedHawk e IR signoff richiedono activity reale per scan_shift, scan_capture, sleep, mbist. Esigere almeno un test UVM per mode con VCD/FSDB export. Senza activity, power signoff mente.",
        "No. RedHawk and IR signoff need real activity for scan_shift, scan_capture, sleep, mbist. Demand at least one UVM test per mode with VCD/FSDB export. Without activity, power signoff lies."
      ),
    },
    {
      question: loc(
        "Formal «proven» su handshake AXI — impatto sul PD?",
        "Formal «proven» on AXI handshake — impact on PD?"
      ),
      answer: loc(
        "Elimina false path creativi in STA. Meno sorpresa in timing closure. Chiedere lista assert proven prima di firmare netlist. Un assert proven su req/ack riduce set_false_path arbitrari.",
        "Removes creative false paths in STA. Fewer timing-closure surprises. Ask for proven-assert list before signing netlist. A proven req/ack assert cuts arbitrary set_false_path."
      ),
    },
    {
      question: loc(
        "Emulation trova bug che richiede RTL change — metal-only?",
        "Emulation finds bug requiring RTL change — metal-only?"
      ),
      answer: loc(
        "No. RTL change = respin FE. Metal-only solo per spare riwire. Pianificare emulation setup 2–4 settimane prima del RTL freeze. Il PD riceve netlist golden post-emulation.",
        "No. RTL change = FE respin. Metal-only only for spare rewire. Plan emulation setup 2–4 weeks before RTL freeze. PD receives post-emulation golden netlist."
      ),
    },
  ],
  synthesis: [
    {
      question: loc(
        "WNS +30 ps, 3000 max_tran violation — credi al report?",
        "WNS +30 ps, 3000 max_tran violations — do you trust the report?"
      ),
      answer: loc(
        "No. Delay estrapolato fuori range .lib. DRV=0 prima di credere WNS. Fix: upsize driver, buffer, ridurre fanout. Target: DRV=0, WNS ≥ −0.05 ns.",
        "No. Delay extrapolated outside .lib range. DRV=0 before believing WNS. Fix: upsize driver, buffer, cut fanout. Target: DRV=0, WNS ≥ −0.05 ns."
      ),
    },
    {
      question: loc(
        "Incremental compile dopo cambio corner — valido?",
        "Incremental compile after corner change — valid?"
      ),
      answer: loc(
        "No. Cambio .lib o corner = full recompile obbligatorio. Incremental valido solo con stesso lib, stesso constraint, change list limitata. LEC deve passare su tutto il design.",
        "No. Lib or corner change = mandatory full recompile. Incremental valid only with same lib, same constraints, limited change list. LEC must pass on full design."
      ),
    },
    {
      question: loc(
        "Boundary optimization on su IP 200 pin — rischio?",
        "Boundary optimization on for 200-pin IP — risk?"
      ),
      answer: loc(
        "Timing imprevedibile post-place. set_boundary_optimization false su IP/macro. Dont_touch su hierarchical port. Negoziare con vendor IP prima del floorplan.",
        "Unpredictable timing post-place. set_boundary_optimization false on IP/macros. dont_touch on hierarchical ports. Negotiate with IP vendor before floorplan."
      ),
    },
  ],
  floorplan: [
    {
      question: loc(
        "HBM controller a 1.2 mm dal bump PHY — accetti?",
        "HBM controller 1.2 mm from PHY bump — do you accept?"
      ),
      answer: loc(
        "No. Target <500 µm. Oltre 1 mm flyline aggiunge 150–300 ps, SI DQ degrada. Floorplan: HBM ai lati corti, logic al centro. Blockage 10–15 µm attorno bump HBM.",
        "No. Target <500 µm. Beyond 1 mm flyline adds 150–300 ps, DQ SI degrades. Floorplan: HBM on short sides, logic in center. 10–15 µm blockage around HBM bumps."
      ),
    },
    {
      question: loc(
        "Macro con pin verso core center — fix?",
        "Macro with pins toward core center — fix?"
      ),
      answer: loc(
        "Ruotare 90° verso canale routing. Pin density >50 pin/µm richiede canale ≥8 µm a 7 nm. Pin access report rosso = non procedere a CTS.",
        "Rotate 90° toward routing channel. Pin density >50 pins/µm needs channel ≥8 µm at 7 nm. Red pin access report = do not proceed to CTS."
      ),
    },
    {
      question: loc(
        "Bump map cambiato dopo floorplan freeze — opzioni?",
        "Bump map changed after floorplan freeze — options?"
      ),
      answer: loc(
        "Respin package o ECO impossibile. IO floorplan frozen con bump map. Co-design day-1. Un pad mancante nel ring = DRC M1.S.1 al tapeout.",
        "Package respin or impossible ECO. IO floorplan frozen with bump map. Day-1 co-design. Missing pad in ring = M1.S.1 DRC at tapeout."
      ),
    },
  ],
  pdn: [
    {
      question: loc(
        "Mesh VDD core collegato a VDD_IO per errore — cosa succede?",
        "Core VDD mesh wrongly tied to VDD_IO — what happens?"
      ),
      answer: loc(
        "LVS fail, possibile latch-up. Split-rail: mesh indipendenti per core, I/O, analog. RedHawk simula per-rail. Level shifter strip ai confini.",
        "LVS fail, possible latch-up. Split-rail: independent meshes for core, I/O, analog. RedHawk simulates per-rail. Level-shifter strips at boundaries."
      ),
    },
    {
      question: loc(
        "Via singolo su strap 1.5 A — pass EM?",
        "Single via on 1.5 A strap — pass EM?"
      ),
      answer: loc(
        "No. Servono 8–12 via per strap, double-cut preferito. Via array su angolo strap-spine. 3–5 cicli iterazione tipici. Fail classico al GKC.",
        "No. Need 8–12 vias per strap, double-cut preferred. Via array at strap-spine corners. 3–5 iteration cycles typical. Classic GKC fail."
      ),
    },
    {
      question: loc(
        "PLL accanto al core CPU — accetti il floorplan?",
        "PLL next to CPU core — do you accept the floorplan?"
      ),
      answer: loc(
        "No. PSRR analog richiede noise VDD <5 mV rms. Keepout 50–100 µm, mesh analog separato, shield M6/M7. Fail di progetto, non fix routing.",
        "No. Analog PSRR needs VDD noise <5 mV rms. 50–100 µm keepout, separate analog mesh, M6/M7 shield. Project fail, not routing fix."
      ),
    },
  ],
  placement: [
    {
      question: loc(
        "Pin access violation su 3 macro — procedi a CTS?",
        "Pin access violation on 3 macros — proceed to CTS?"
      ),
      answer: loc(
        "No. Detailed route fallirà su 500+ net. Fix: spread macro, rotate 90°, partial blockage. Report «N macros with pin access violation» deve essere zero.",
        "No. Detailed route will fail on 500+ nets. Fix: spread macros, rotate 90°, partial blockage. «N macros with pin access violation» must be zero."
      ),
    },
    {
      question: loc(
        "Displacement tail 18 µm su cluster — azione?",
        "18 µm displacement tail on cluster — action?"
      ),
      answer: loc(
        "Rip-up globale con density −10% o manual macro move. Root-cause: blockage, density, macro channel. Documentare nel placement log. Non compensare solo con useful skew.",
        "Global rip-up with density −10% or manual macro move. Root cause: blockage, density, macro channel. Document in placement log. Do not compensate only with useful skew."
      ),
    },
    {
      question: loc(
        "Soft bound vs hard bound su hotspot ALU?",
        "Soft bound vs hard bound on ALU hotspot?"
      ),
      answer: loc(
        "Soft bound (create_bound -type soft) su hotspot. Hard bound solo su IP/macro. Troppi hard bound → legalization fail. Soft bound migliora wirelength 20–40%.",
        "Soft bound (create_bound -type soft) on hotspot. Hard bound only on IP/macros. Too many hard bounds → legalization fail. Soft bound improves wirelength 20–40%."
      ),
    },
  ],
  cts: [
    {
      question: loc(
        "Clock stop in scan_shift non modellato — effetto?",
        "Unmodeled clock stop in scan_shift — effect?"
      ),
      answer: loc(
        "Hold violation fittizi o miss di hold reali. set_case_analysis e set_clock_gating_check devono coprire stop. OCC clock root = stesso trattamento PLL.",
        "Fictitious hold violations or missed real holds. set_case_analysis and set_clock_gating_check must cover stop. OCC clock root = same treatment as PLL."
      ),
    },
    {
      question: loc(
        "CDC attraverso ICG — dove metti il synchronizer?",
        "CDC through ICG — where do you put the synchronizer?"
      ),
      answer: loc(
        "Dopo l'ICG, non prima. Enable ICG stable prima del clock edge. SpyGlass CDC-12. Fix: latch enable sync, non false path sul crossing.",
        "After the ICG, not before. ICG enable stable before clock edge. SpyGlass CDC-12. Fix: sync latch on enable, not false path on crossing."
      ),
    },
    {
      question: loc(
        "Latency target 400 ps su periphery 200 MHz — spreco?",
        "400 ps latency target on 200 MHz periphery — waste?"
      ),
      answer: loc(
        "Sì. Periphery accetta 2 ns latency, skew ±100 ps. Target troppo stretto spreca buffer e power. Allocare budget per domain nel CTS spec.",
        "Yes. Periphery accepts 2 ns latency, skew ±100 ps. Too-tight target wastes buffers and power. Allocate budget per domain in CTS spec."
      ),
    },
  ],
  routing: [
    {
      question: loc(
        "Detour 80% su path setup-critical — fix?",
        "80% detour on setup-critical path — fix?"
      ),
      answer: loc(
        "Tornare a spread macro / floorplan. Non detour estremo. Fail di placement, non routing effort. set_route_mode -droute_auto_stop false = rischio DRC.",
        "Go back to spread macro / floorplan. No extreme detour. Placement fail, not routing effort. set_route_mode -droute_auto_stop false = DRC risk."
      ),
    },
    {
      question: loc(
        "50 ps SI su 120 ps logic — VT-swap prima?",
        "50 ps SI on 120 ps logic — VT-swap first?"
      ),
      answer: loc(
        "No. Fix SI prima: spacing, shield, layer change, size down aggressor. Delta delay >10% logic = fix SI. Poi VT-swap se serve.",
        "No. Fix SI first: spacing, shield, layer change, size down aggressor. Delta delay >10% of logic = fix SI. Then VT-swap if needed."
      ),
    },
    {
      question: loc(
        "Bus DDR senza NDR né shield — signoff?",
        "DDR bus without NDR or shield — signoff?"
      ),
      answer: loc(
        "No. SI failure al signoff. NDR o side-shield VSS. Costo 2× track. Usare NDR su <5% net. Layer promotion M2→M4 per critical net.",
        "No. SI failure at signoff. NDR or VSS side-shield. Cost 2× tracks. Use NDR on <5% of nets. Layer promotion M2→M4 for critical nets."
      ),
    },
  ],
  layout: [
    {
      question: loc(
        "IP version hash mismatch nel merge — procedi?",
        "IP version hash mismatch in merge — proceed?"
      ),
      answer: loc(
        "No. LVS CORRECT su netlist sbagliato. Verificare hash prima di flatten. IP manifest con version e checksum nel tapeout package.",
        "No. LVS CORRECT on wrong netlist. Verify hash before flatten. IP manifest with version and checksum in tapeout package."
      ),
    },
    {
      question: loc(
        "Litho hotspot waived senza foundry approval?",
        "Litho hotspot waived without foundry approval?"
      ),
      answer: loc(
        "No. Yield risk. Fix: jog, extension, sraf. 3–10 iterazioni. Waiver con area limitata e giustificazione foundry-approved.",
        "No. Yield risk. Fix: jog, extension, SRAF. 3–10 iterations. Waiver with limited area and foundry-approved justification."
      ),
    },
    {
      question: loc(
        "Spare cell a 300 µm dal fix target — ok per metal-only ECO?",
        "Spare cell 300 µm from fix target — ok for metal-only ECO?"
      ),
      answer: loc(
        "No. 100+ ps wire extra. Pre-place spare vicino a blocchi ad alta probabilità ECO (control FSM). Documentare spare map nel ECO guide.",
        "No. 100+ ps extra wire. Pre-place spares near high-ECO-probability blocks (control FSM). Document spare map in ECO guide."
      ),
    },
  ],
  sta: [
    {
      question: loc(
        "Path group weight uniforme — problema?",
        "Uniform path-group weight — problem?"
      ),
      answer: loc(
        "in2out con 2 ns budget compete con reg2reg a 500 ps. set_path_group -weight 10 su reg2reg. report_path_group per WNS per gruppo.",
        "in2out with 2 ns budget competes with 500 ps reg2reg. set_path_group -weight 10 on reg2reg. report_path_group for WNS per group."
      ),
    },
    {
      question: loc(
        "80 ps CRPR credit, 20 ps slack — reale?",
        "80 ps CRPR credit, 20 ps slack — real?"
      ),
      answer: loc(
        "Marginalmente. Verificare con SI e OCV. CPPR abusivo ottimizza 30–50 ps falsi. Seguire foundry guideline. report_crpr per path.",
        "Marginally. Verify with SI and OCV. Abusive CPPR optimizes 30–50 ps falsely. Follow foundry guidelines. report_crpr per path."
      ),
    },
    {
      question: loc(
        "Glitch width 60% clock period — rischio?",
        "Glitch width 60% of clock period — risk?"
      ),
      answer: loc(
        "Double capture possibile. set_si_enable_analysis true. Fix: spacing, shield, reduce aggressor slew. Diverso da delta delay.",
        "Possible double capture. set_si_enable_analysis true. Fix: spacing, shield, reduce aggressor slew. Different from delta delay."
      ),
    },
  ],
  pv: [
    {
      question: loc(
        "DRC=0, ERC fail power-ground short — LVS?",
        "DRC=0, ERC fails on PG short — LVS?"
      ),
      answer: loc(
        "Non procedere. ERC prima di LVS. Short PG può passare DRC. Calibre ERC deck separato. Via PG che shorta VDD-VSS = ERC catch.",
        "Do not proceed. ERC before LVS. PG short may pass DRC. Calibre ERC deck separate. PG via shorting VDD-VSS = ERC catch."
      ),
    },
    {
      question: loc(
        "Density gradient 25% tra finestre adiacenti — pass?",
        "25% density gradient between adjacent windows — pass?"
      ),
      answer: loc(
        "No. Limite tipico 20%. CMP dishing/erosion. Fill e slotting bilanciano. Hotspot ρ>90% = wire thinning.",
        "No. Typical limit 20%. CMP dishing/erosion. Fill and slotting balance. Hotspot ρ>90% = wire thinning."
      ),
    },
    {
      question: loc(
        "Via singolo su strap 2 µm wide — EM?",
        "Single via on 2 µm wide strap — EM?"
      ),
      answer: loc(
        "Fail. Via array obbligatorio, pitch min 0.1 µm. DRC M1.EN.1, V1.EN.1. Double-cut preferito su corrente >0.5 A.",
        "Fail. Via array mandatory, min pitch 0.1 µm. DRC M1.EN.1, V1.EN.1. Double-cut preferred above ~0.5 A."
      ),
    },
  ],
  power: [
    {
      question: loc(
        "Un solo vector typical per IR signoff — basta?",
        "One typical vector for IR signoff — enough?"
      ),
      answer: loc(
        "No. WORST_POWER, WORST_dI/dt, ogni power state UPF. Wake-up surge di/dt 10× idle. VCD per ogni state prima del signoff.",
        "No. WORST_POWER, WORST_dI/dt, every UPF power state. Wake-up surge di/dt 10× idle. VCD per state before signoff."
      ),
    },
    {
      question: loc(
        "Dominio AON 200 mW leakage a 125°C — accetti?",
        "AON domain 200 mW leakage at 125°C — accept?"
      ),
      answer: loc(
        "No se viola battery life. RBB o power gating. Leakage corner SS@125°C. Coordinare retention vs power-off con FE.",
        "No if it violates battery life. RBB or power gating. Leakage corner SS@125°C. Coordinate retention vs power-off with FE."
      ),
    },
    {
      question: loc(
        "Bump porta 80% corrente dominio — fix?",
        "Bump carries 80% of domain current — fix?"
      ),
      answer: loc(
        "Redistribuire bump map. Grid analysis RedHawk. Co-sim die+package obbligatorio per design >5 W.",
        "Redistribute bump map. RedHawk grid analysis. Die+package co-sim mandatory for designs >5 W."
      ),
    },
    {
      question: loc(
        "SPM vs package extracted in CPA — quando basta lo SPM?",
        "SPM vs extracted package in CPA — when is SPM enough?"
      ),
      answer: loc(
        "Early budgeting e what-if su L_loop. Signoff: extracted/CPS se |Z(f)| diverge >~20% o multi-resonance. Stessa bump map della tapeout.",
        "Early budgeting and L_loop what-if. Signoff: extracted/CPS if |Z(f)| diverges >~20% or multi-resonance. Same bump map as tapeout."
      ),
    },
    {
      question: loc(
        "Decap ovunque vs hotspot — cosa chiedi al report?",
        "Decap everywhere vs hotspot — what do you ask the report?"
      ),
      answer: loc(
        "C_eff locale, ΔV WORST_dI/dt, leakage hot, inrush. C = I·Δt/ΔV nella regione che commuta — non conteggio filler globali.",
        "Local C_eff, WORST_dI/dt ΔV, hot leakage, inrush. C = I·Δt/ΔV in the switching region — not global filler count."
      ),
    },
  ],
  package: [
    {
      question: loc(
        "CTE mismatch senza underfill optimization — rischio?",
        "CTE mismatch without underfill optimization — risk?"
      ),
      answer: loc(
        "Warpage, bump crack. Package DRC max warpage 50 µm. Underfill modulus e CTE matching. Die 10×10 mm senza optimization = reliability risk.",
        "Warpage, bump crack. Package DRC max warpage 50 µm. Underfill modulus and CTE matching. 10×10 mm die without optimization = reliability risk."
      ),
    },
    {
      question: loc(
        "RDL lunga su SerDes 56 Gbps — eye degrade — chi fixa?",
        "Long RDL on 56 Gbps SerDes — eye degrade — who fixes?"
      ),
      answer: loc(
        "Co-design die+package. PD allinea PHY pin con bump. Package team simula S-parameter. Bump map change = respin se frozen.",
        "Die+package co-design. PD aligns PHY pins with bumps. Package team simulates S-parameters. Bump map change = respin if frozen."
      ),
    },
    {
      question: loc(
        "Flip-chip vs wire-bond per 1500 IO DDR — scelta?",
        "Flip-chip vs wire-bond for 1500 IO DDR — choice?"
      ),
      answer: loc(
        "Flip-chip. Wire-bond impraticabile >500 IO. Pitch 80–150 µm, L bassa, RDL obbligatorio. Floorplan diverge radicalmente.",
        "Flip-chip. Wire-bond impractical above ~500 IO. 80–150 µm pitch, low L, mandatory RDL. Floorplan differs radically."
      ),
    },
    {
      question: loc(
        "Z_target = 10 mΩ ma |Z| package picca a 80 MHz — fix di sistema?",
        "Z_target = 10 mΩ but package |Z| peaks at 80 MHz — system fix?"
      ),
      answer: loc(
        "Anti-resonance board/pkg. ESR mirato, più power ball (↓L), mid-cap, shorter RDL, non solo strap on-die. CPA/CPS sulla bump map firmata.",
        "Board/pkg anti-resonance. Targeted ESR, more power balls (↓L), mid-caps, shorter RDL—not only on-die straps. CPA/CPS on the signed bump map."
      ),
    },
  ],
  tapeout: [
    {
      question: loc(
        "GKC veto su un corner STA — evidenza richiesta?",
        "GKC veto on one STA corner — evidence required?"
      ),
      answer: loc(
        "report_timing log su tutti mode×corner, WNS/TNS, DRV=0, SI report. Slide verde non basta. Archive 10 anni retention.",
        "report_timing logs on all mode×corner, WNS/TNS, DRV=0, SI report. Green slide is not enough. 10-year archive retention."
      ),
    },
    {
      question: loc(
        "PCM correlation drift oltre spec — ship?",
        "PCM correlation drift beyond spec — ship?"
      ),
      answer: loc(
        "No. Hold wafer. WAT su PCM prima di die test. Process fix. Tapeout include PCM spec nel data package.",
        "No. Hold wafer. WAT on PCM before die test. Process fix. Tapeout includes PCM spec in data package."
      ),
    },
    {
      question: loc(
        "Fail sistematico su tutti i die stesso path — respin?",
        "Systematic fail on all dice same path — respin?"
      ),
      answer: loc(
        "Sì. Design bug. Fail random = yield, process fix. Post-mortem obbligatorio: root cause, fix, prevention. PD partecipa bring-up debug.",
        "Yes. Design bug. Random fail = yield, process fix. Mandatory post-mortem: root cause, fix, prevention. PD joins bring-up debug."
      ),
    },
  ],
};
