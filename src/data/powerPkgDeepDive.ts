import { loc, type Localized } from "@/i18n/context";

export interface PowerPkgTopic {
  id: "pkg" | "cpa" | "decap" | "system-pdn";
  title: Localized;
  kicker: Localized;
  stageLinks: { href: string; labelIt: string; labelEn: string }[];
  paragraphs: { body: Localized; refs: string[] }[];
  takeaways: Localized[];
}

/**
 * Dedicated deep-dive: PKG, CPA models, Decap, System PDN.
 * Industrial bilingual essays with citations (sources.ts ids).
 */
export const powerPkgTopics: PowerPkgTopic[] = [
  {
    id: "pkg",
    title: loc("PKG — Package come circuito, non solo meccanica", "PKG — Package as a circuit, not just mechanics"),
    kicker: loc(
      "Bump, RDL, substrate e ball chiudono SI, PDN e termica del die. Il freeze del package è un vincolo di chip, non un afterthought BOM.",
      "Bumps, RDL, substrate, and balls close the die's SI, PDN, and thermal path. Package freeze is a chip constraint, not a BOM afterthought."
    ),
    stageLinks: [
      { href: "#stage-package", labelIt: "Fase Package", labelEn: "Package stage" },
      { href: "#stage-pdn", labelIt: "Fase PDN", labelEn: "PDN stage" },
      { href: "#stage-power", labelIt: "Power signoff", labelEn: "Power signoff" },
    ],
    paragraphs: [
      {
        body: loc(
          "Il package completa il percorso elettrico dal bump C4 (o pad wire-bond) al ball BGA e alla PCB. Flip-chip area-array offre migliaia di IO e loop inductance più bassa del wire-bond, ma impone pitch, keepout, escape routing e una quota sostanziale di bump VDD/VSS (tipicamente 1:3–1:5 signal:power a seconda del prodotto). Un array 40×40 a pitch 130 µm offre 1600 siti lordi: corner, PHY keepout e power allocation possono lasciare meno di 900 siti segnale utili. Cadence SiP / Allegro Package Designer e ANSYS SIwave co-progettano bump map e RDL rispetto ai pin die in DEF; spostare un PHY di 1 mm dopo freeze aggiunge RDL, skew e loss, non solo wirelength. Il failure mode tipico è una bump map «connessa» ma non escapable, oppure CPU/GPU lontane dai power bump con IR che nessuna mesh on-die riesce a recuperare.",
          "The package completes the electrical path from C4 bump (or wire-bond pad) to BGA ball and PCB. Flip-chip area arrays offer thousands of IOs and lower loop inductance than wire-bond, but impose pitch, keepouts, escape routing, and a substantial VDD/VSS bump share (often 1:3–1:5 signal:power depending on product). A 40×40 array at 130 µm pitch offers 1,600 gross sites: corners, PHY keepouts, and power allocation can leave fewer than 900 usable signal sites. Cadence SiP / Allegro Package Designer and ANSYS SIwave co-design bump map and RDL against die pins in DEF; moving a PHY by 1 mm after freeze adds RDL, skew, and loss—not merely wirelength. The typical failure mode is a «connected» but unescapable bump map, or CPU/GPU far from power bumps with IR that no on-die mesh can recover."
        ),
        refs: ["lef-def", "rabaey"],
      },
      {
        body: loc(
          "Sul piano di potenza, Z_target = ΔV_allowed / ΔI_step guida il budget. Con VDD = 0,8 V, ripple 5% (40 mV) e step 4 A, Z_target = 10 mΩ da DC fino alla frequenza dove on-die decap prende il controllo. Il package contribuisce R_series e soprattutto L_loop (tipicamente decine–centinaia di pH per path power); ΔV_L = L·di/dt: 80 pH × 2 A/ns = 160 mV prima della componente IR. SIwave, Sigrity PowerSI e co-sim RedHawk tracciano |Z(f)| e anti-resonance tra board MLCC, package plane e on-die C. Tipologie BGA, CSP, QFN, 2.5D interposer e 3D/HBM cambiano densità bump, thermal path e lunghezza return: la scelta è un gate di SI/PDN, non solo distinta materiali (JEDEC per qualifiche termiche e moisture).",
          "On the power plane, Z_target = ΔV_allowed / ΔI_step sets the budget. With VDD = 0.8 V, 5% ripple (40 mV), and a 4 A step, Z_target = 10 mΩ from DC up to the frequency where on-die decap takes over. The package contributes series R and especially loop L (typically tens to hundreds of pH per power path); ΔV_L = L·di/dt: 80 pH × 2 A/ns = 160 mV before the IR term. SIwave, Sigrity PowerSI, and RedHawk co-sim trace |Z(f)| and anti-resonance among board MLCCs, package planes, and on-die C. BGA, CSP, QFN, 2.5D interposer, and 3D/HBM types change bump density, thermal path, and return length: the choice is an SI/PDN gate, not merely a bill of materials (JEDEC for thermal and moisture qualification)."
        ),
        refs: ["rabaey", "jedec", "swaminathan"],
      },
      {
        body: loc(
          "Sul piano segnale, a multi-Gb/s la net package è transmission line: Γ = (Z_L−Z_0)/(Z_L+Z_0). Con Z_0 = 50 Ω e discontinuità a 75 Ω, Γ = 0,2 (20% riflesso ideale). Via stub, neck-down, reference-plane split e pair skew chiudono l'eye anche se la netlist è LVS-clean. SSO somma L_common·Σdi/dt su bus larghi: 16 driver × 20 mA in 200 ps → 1,6 A/ns; 1 nH comune dà ~1,6 V ideali — ecco perché return path e modello package dominano IBIS/HyperLynx. Checklist package freeze: bump map firmata vs DEF, RDL DRC, SI/SSO report, package PDN |Z(f)|, thermal θ e warpage, BSDL/JTAG access, irreversibilità rispetto a die pin freeze.",
          "On the signal plane, at multi-Gb/s the package net is a transmission line: Γ = (Z_L−Z_0)/(Z_L+Z_0). With Z_0 = 50 Ω and a discontinuity to 75 Ω, Γ = 0.2 (20% ideal reflection). Via stubs, neck-downs, reference-plane splits, and pair skew close the eye even when the netlist is LVS-clean. SSO sums L_common·Σdi/dt on wide buses: 16 drivers × 20 mA in 200 ps → 1.6 A/ns; 1 nH common yields ~1.6 V ideal—hence return path and package model dominate IBIS/HyperLynx. Package-freeze checklist: signed bump map vs DEF, RDL DRC, SI/SSO report, package PDN |Z(f)|, thermal θ and warpage, BSDL/JTAG access, irreversibility vs die-pin freeze."
        ),
        refs: ["rabaey", "ieee-1149"],
      },
    ],
    takeaways: [
      loc(
        "PKG è co-design elettrico/termico: bump map e L_loop vincolano IR/SSO quanto la mesh on-die.",
        "PKG is electrical/thermal co-design: bump map and L_loop constrain IR/SSO as much as the on-die mesh."
      ),
      loc(
        "Z_target e |Z(f)| package vanno chiusi prima del die freeze, non «dopo tapeout».",
        "Package Z_target and |Z(f)| must close before die freeze, not «after tapeout»."
      ),
    ],
  },
  {
    id: "cpa",
    title: loc("CPA models — Chip–Package Analysis", "CPA models — Chip–Package Analysis"),
    kicker: loc(
      "I modelli CPA collegano die PDN e package RLC (fino al board) così dynamic IR e |Z(f)| non mentono sul silicio.",
      "CPA models connect die PDN and package RLC (up to the board) so dynamic IR and |Z(f)| do not lie about silicon."
    ),
    stageLinks: [
      { href: "#stage-power", labelIt: "Power signoff", labelEn: "Power signoff" },
      { href: "#stage-package", labelIt: "Fase Package", labelEn: "Package stage" },
      { href: "#stage-pdn", labelIt: "Fase PDN", labelEn: "PDN stage" },
    ],
    paragraphs: [
      {
        body: loc(
          "CPA (Chip–Package Analysis, a volte Chip–Package–Board / CPS) è la pratica di modellare insieme die power grid e package (e spesso PCB) per dynamic IR, resonance e voltage map. Un'analisi solo on-die con package idealizzato sottostima L·di/dt e sposta i picchi di |Z(f)|. RedHawk-SC, Voltus e Totem importano un package model e risolvono la rete congiunta con correnti da VCD/FSDB o vectorless. Il contratto industriale tipico: stesso bump map, stessi rail name, stessa polarità VSS, stessa frequenza di interesse fino a qualche GHz per core digitali. Il failure mode è firmare dynamic IR «verde» con un modello package da revisione precedente, o con ball map diversa dal tapeout.",
          "CPA (Chip–Package Analysis, sometimes Chip–Package–Board / CPS) is the practice of jointly modeling die power grid and package (and often PCB) for dynamic IR, resonance, and voltage maps. On-die-only analysis with an idealized package underestimates L·di/dt and shifts |Z(f)| peaks. RedHawk-SC, Voltus, and Totem import a package model and solve the joint network with VCD/FSDB or vectorless currents. The typical industrial contract: same bump map, same rail names, same VSS polarity, same frequency interest up to a few GHz for digital cores. The failure mode is signing «green» dynamic IR with a package model from a prior revision, or with a ball map different from tapeout."
        ),
        refs: ["swaminathan", "rabaey"],
      },
      {
        body: loc(
          "Gerarchia dei modelli CPA usati in produzione: (1) SPM / lumped RLC — pochi elementi per rail (R_pkg, L_pkg, C_pkg, talvolta mutual); veloce, buono per early budgeting e what-if, debole su multi-resonance e spatial gradient. (2) Distributed / extracted package — S-parameter o RLC mesh da SIwave/Sigrity/HFSS su plane, via e ball; cattura anti-resonance e path multipli. (3) Chip–Package co-sim — die extraction (PG SPEF o mesh tool) + package model allo stesso bump port. (4) Chip–Package–System — aggiunge board plane, VRM model e MLCC placement. Ogni salto di fedeltà costa runtime e richiede correlazione: se |Z| a 100 MHz diverge >20% tra SPM e extracted, lo SPM non è idoneo al signoff del prodotto.",
          "CPA model hierarchy used in production: (1) SPM / lumped RLC — few elements per rail (R_pkg, L_pkg, C_pkg, sometimes mutual); fast, good for early budgeting and what-if, weak on multi-resonance and spatial gradients. (2) Distributed / extracted package — S-parameter or RLC mesh from SIwave/Sigrity/HFSS on planes, vias, and balls; captures anti-resonance and multiple paths. (3) Chip–Package co-sim — die extraction (PG SPEF or tool mesh) + package model at the same bump ports. (4) Chip–Package–System — adds board planes, VRM model, and MLCC placement. Each fidelity jump costs runtime and needs correlation: if |Z| at 100 MHz diverges >20% between SPM and extracted, the SPM is not fit for product signoff."
        ),
        refs: ["swaminathan"],
      },
      {
        body: loc(
          "Cosa guardare in un report CPA: (a) |Z(f)| per rail vs Z_target su decadi di frequenza; (b) voltage waveform nei cicli WORST_dI/dt, non solo peak power medio; (c) spatial map — gradiente die edge vs center tipico quando i bump power sono periferici; (d) sensitivity a C_die e a ESR dei capacitor package/board; (e) correlazione con IR-aware STA (voltage map → delay). Numerico: L_eff = 50 pH, di/dt = 3 A/ns → 150 mV induttivi; se il budget dinamico è 10% di 0,75 V (= 75 mV), serve più C locale o meno L_loop prima di «aggiungere strap». Il failure mode è ottimizzare solo R_dc on-die mentre il picco di risonanza a ~80–200 MHz (tipico package/board) coincide con il burst rate del workload.",
          "What to look for in a CPA report: (a) |Z(f)| per rail vs Z_target across frequency decades; (b) voltage waveforms on WORST_dI/dt cycles, not only average peak power; (c) spatial map — edge-vs-center die gradient typical when power bumps are peripheral; (d) sensitivity to C_die and to package/board capacitor ESR; (e) correlation with IR-aware STA (voltage map → delay). Numeric: L_eff = 50 pH, di/dt = 3 A/ns → 150 mV inductive; if the dynamic budget is 10% of 0.75 V (= 75 mV), you need more local C or less loop L before «adding straps». The failure mode is optimizing only on-die R_dc while a resonance peak near ~80–200 MHz (typical package/board) coincides with the workload burst rate."
        ),
        refs: ["swaminathan", "rabaey"],
      },
    ],
    takeaways: [
      loc(
        "CPA ≠ package file a sé: è il contratto die↔package (↔board) versionato con la bump map.",
        "CPA ≠ a standalone package file: it is the versioned die↔package (↔board) contract with the bump map."
      ),
      loc(
        "SPM per early; extracted/CPS per signoff. Correlare |Z(f)| prima di fidarsi del verde.",
        "SPM for early; extracted/CPS for signoff. Correlate |Z(f)| before trusting green."
      ),
    ],
  },
  {
    id: "decap",
    title: loc("Decap — Capacità on-die dove serve il di/dt", "Decap — On-die capacitance where di/dt lives"),
    kicker: loc(
      "La decap compra tempo mentre package e board reagiscono. Non ripara R_dc statica; mal piazzata spreca area e leakage.",
      "Decap buys time while package and board respond. It does not fix static R_dc; poorly placed it wastes area and leakage."
    ),
    stageLinks: [
      { href: "#stage-pdn", labelIt: "Fase PDN", labelEn: "PDN stage" },
      { href: "#stage-power", labelIt: "Power signoff", labelEn: "Power signoff" },
      { href: "#cell-decap", labelIt: "Cella DECAP", labelEn: "DECAP cell" },
    ],
    paragraphs: [
      {
        body: loc(
          "Una cella decap (MOS gate cap, MIM, o hybrid) immagazzina Q = C·V e fornisce corrente transiente: C ≥ I·Δt/ΔV in prima approssimazione. Per sostenere 1 A per 100 ps entro 50 mV servono almeno 2 nF ideali (C = I·Δt/ΔV). In realtà ESL/ESR del path locale e densità di placement riducono l'efficacia: 2 nF «di catalogo» sparsi lontano dall'hotspot valgono molto meno di 0,5 nF a 50 µm dal cluster che commuta. MOS decap usa area di gate/diffusion; MIM offre densità maggiore su layer dedicati ma costa processo e routing keepout. Leakage della decap può dominare standby se si sostituisce ogni filler: tipicamente si punta densità locale guidata da activity map, non 100% fill.",
          "A decap cell (MOS gate cap, MIM, or hybrid) stores Q = C·V and supplies transient current: C ≥ I·Δt/ΔV to first order. Sustaining 1 A for 100 ps within 50 mV needs at least 2 nF ideal (C = I·Δt/ΔV). In reality local-path ESL/ESR and placement density reduce effectiveness: 2 nF of «catalog» capacitance far from the hotspot is worth much less than 0.5 nF within 50 µm of the switching cluster. MOS decap uses gate/diffusion area; MIM offers higher density on dedicated layers but costs process and routing keepout. Decap leakage can dominate standby if every filler is replaced: typically target locally guided density from activity maps, not 100% fill."
        ),
        refs: ["rabaey", "swaminathan"],
      },
      {
        body: loc(
          "Ruolo in frequenza: board MLCC (µF) coprono kHz–basse MHz; package mid-cap (nF) le medie; on-die decap (pF–nF locali) le centinaia di MHz–GHz dove L_pkg isola il die. Aggiungere solo MLCC non spegne un droop da 150 ps al clock edge. Aggiungere solo decap non corregge static IR da 40 mΩ di strap. Placement rules: vicino a CPU/GPU/SerDes hotspot, sul rail corretto (primary vs secondary), rispettando density DRM e antenna; power-up inrush C·ΔV/Δt_ramp deve stare nel budget switch. Voltus/RedHawk «what-if decap» quantifica ΔV prima di saturare whitespace. Il failure mode è riempire filler con decap ovunque, alzare leakage del 30%, e lasciare comunque droop sul cluster perché la capacità efficace era lontana.",
          "Frequency role: board MLCCs (µF) cover kHz–low MHz; package mid-caps (nF) the mid band; on-die decap (local pF–nF) hundreds of MHz–GHz where L_pkg isolates the die. Adding only MLCCs does not kill a 150 ps droop at the clock edge. Adding only decap does not fix static IR from 40 mΩ of strap. Placement rules: near CPU/GPU/SerDes hotspots, on the correct rail (primary vs secondary), honoring density DRM and antenna; power-up inrush C·ΔV/Δt_ramp must fit switch budget. Voltus/RedHawk «what-if decap» quantifies ΔV before saturating whitespace. The failure mode is filling every filler with decap, raising leakage 30%, and still seeing cluster droop because effective capacitance was far away."
        ),
        refs: ["swaminathan", "rabaey"],
      },
      {
        body: loc(
          "Interazione con CTA/filler e signoff: dopo route, whitespace legale può ospitare DECAPX1…Xn; ECO metal può aggiungerne se FEOL lo consente. Density fill foundry non è decap elettrica — non scambiarli. Checklist: (1) activity/hotspot map → densità target regionale; (2) C_eff vs budget ΔV; (3) leakage corner hot; (4) inrush/wake-up; (5) DRC density + well proximity; (6) re-run dynamic IR con stesso CPA model. Numerico da colloquio: se droop misura 90 mV e il budget è 50 mV con Δt ≈ 200 ps e I_peak ≈ 2 A, serve ΔC ≈ I·Δt/ΔV_extra ≈ 2·200e−12/40e−3 ≈ 10 nF aggiuntivi efficaci nella regione — non 10 nF sparsi a caso sul die.",
          "Interaction with CTA/filler and signoff: after route, legal whitespace can host DECAPX1…Xn; metal ECO can add more if FEOL allows. Foundry density fill is not electrical decap—do not swap them. Checklist: (1) activity/hotspot map → regional density target; (2) C_eff vs ΔV budget; (3) hot-corner leakage; (4) inrush/wake-up; (5) DRC density + well proximity; (6) re-run dynamic IR with the same CPA model. Interview numeric: if droop measures 90 mV and budget is 50 mV with Δt ≈ 200 ps and I_peak ≈ 2 A, you need ΔC ≈ I·Δt/ΔV_extra ≈ 2·200e−12/40e−3 ≈ 10 nF of additional effective capacitance in the region—not 10 nF scattered randomly across the die."
        ),
        refs: ["rabaey"],
      },
    ],
    takeaways: [
      loc(
        "Decap = C locale ad alta frequenza. Non è cure-all per IR statico.",
        "Decap = local high-frequency C. It is not a cure-all for static IR."
      ),
      loc(
        "Piazza dove commuta la corrente; misura C_eff e leakage, non solo conteggio celle.",
        "Place where current switches; measure C_eff and leakage, not only cell count."
      ),
    ],
  },
  {
    id: "system-pdn",
    title: loc("System PDN — Dal VRM al pin della cella", "System PDN — From VRM to the cell pin"),
    kicker: loc(
      "System PDN è l'impedenza end-to-end: VRM → board → package → RDL/bump → mesh → rail → pin. Ogni pezzo ha una banda di frequenza.",
      "System PDN is end-to-end impedance: VRM → board → package → RDL/bump → mesh → rail → pin. Each piece owns a frequency band."
    ),
    stageLinks: [
      { href: "#stage-pdn", labelIt: "Fase PDN", labelEn: "PDN stage" },
      { href: "#stage-power", labelIt: "Power signoff", labelEn: "Power signoff" },
      { href: "#stage-package", labelIt: "Fase Package", labelEn: "Package stage" },
      { href: "#diagrams", labelIt: "Diagramma PDN", labelEn: "PDN diagram" },
    ],
    paragraphs: [
      {
        body: loc(
          "La Power Delivery Network di sistema non è solo la mesh on-die: è la catena VRM (o PMIC) → plane e MLCC di board → BGA ball → package plane/via → bump/RDL → core ring/strap/mesh → M1 rail → pin VDD/VSS di ogni istanza. Staticamente V_drop = I·ΣR_i; dinamicamente contano L di ogni segmento e C di ogni stadio. Un budget tipico spezza la caduta ammessa (es. 5% static + 10% dynamic peak) tra board, package e die — se il package mangia già 60 mV su 75 mV dinamici, il die ha 15 mV di margine indipendentemente da quanto «bella» sia la mesh. RedHawk/Voltus + SIwave/Sigrity chiudono pezzi diversi della catena; il system owner somma i pezzi sulla stessa bump map e sullo stesso workload.",
          "System Power Delivery Network is not only the on-die mesh: it is the chain VRM (or PMIC) → board planes and MLCCs → BGA balls → package planes/vias → bump/RDL → core ring/strap/mesh → M1 rail → every instance's VDD/VSS pin. Statically V_drop = I·ΣR_i; dynamically each segment's L and each stage's C matter. A typical budget splits allowed drop (e.g. 5% static + 10% dynamic peak) across board, package, and die—if the package already consumes 60 mV of 75 mV dynamic, the die has 15 mV of margin no matter how «pretty» the mesh is. RedHawk/Voltus + SIwave/Sigrity close different pieces of the chain; the system owner sums them on the same bump map and workload."
        ),
        refs: ["swaminathan", "rabaey"],
      },
      {
        body: loc(
          "Bande di frequenza (ordine di grandezza): VRM feedback e bulk cap → Hz–decine di kHz; board MLCC → kHz–basse MHz; package mid-cap e plane → MHz–~100 MHz; on-die decap e mesh locale → centinaia di MHz–GHz. L'anti-resonance nasce quando L di uno stadio risuona con C del successivo: un picco di |Z| sopra Z_target a 50–150 MHz è classico tra package e board. Fix di sistema: più power ball (↓L_loop), capacitor con ESR mirato (smorzamento), shorter RDL, densificare mesh sotto hotspot, staged wake-up dei power switch, activity staggering a RTL. EM sulla system PDN: j su ball, via package e strap on-die con limiti diversi; Black MTTF resta il framework, ma i limiti foundry/JEDEC mission profile decidono il pass.",
          "Frequency bands (order of magnitude): VRM feedback and bulk caps → Hz–tens of kHz; board MLCCs → kHz–low MHz; package mid-caps and planes → MHz–~100 MHz; on-die decap and local mesh → hundreds of MHz–GHz. Anti-resonance appears when one stage's L resonates with the next stage's C: a |Z| peak above Z_target at 50–150 MHz is classic between package and board. System fixes: more power balls (↓L_loop), capacitors with targeted ESR (damping), shorter RDL, denser mesh under hotspots, staged power-switch wake-up, RTL activity staggering. EM on the system PDN: j on balls, package vias, and on-die straps with different limits; Black MTTF remains the framework, but foundry/JEDEC mission-profile limits decide pass."
        ),
        refs: ["swaminathan", "black-1969", "jedec"],
      },
      {
        body: loc(
          "Primary vs secondary nel system view: la primary always-on arriva dai bump globali; le secondary (switched CPU, retention, AON islands) condividono spesso return VSS ma hanno path R/L diversi e switch R_on. Un island che si accende con 0,8 A di inrush stressa la primary e il package condiviso — CPA/system sim deve includere la sequenza IEEE 1801. Checklist system PDN signoff: Z_target per rail; |Z(f)| board+pkg+die correlati; static IR < budget; dynamic worst-window < budget; EM average/RMS/peak; wake-up/inrush; IR-aware STA sui path critici; bump map = tapeout map. Il failure mode è tre team (board, package, chip) ciascuno verde sul proprio pezzo e silicio rosso sulla somma.",
          "Primary vs secondary in the system view: primary always-on arrives from global bumps; secondaries (switched CPU, retention, AON islands) often share VSS return but have different R/L paths and switch R_on. An island waking with 0.8 A inrush stresses shared primary and package—CPA/system sim must include the IEEE 1801 sequence. System PDN signoff checklist: Z_target per rail; correlated board+pkg+die |Z(f)|; static IR < budget; dynamic worst-window < budget; EM average/RMS/peak; wake-up/inrush; IR-aware STA on critical paths; bump map = tapeout map. The failure mode is three teams (board, package, chip) each green on their piece and silicon red on the sum."
        ),
        refs: ["ieee-1801", "swaminathan"],
      },
    ],
    takeaways: [
      loc(
        "System PDN = somma di budget. Il pezzo peggiore vince.",
        "System PDN = sum of budgets. The worst piece wins."
      ),
      loc(
        "Chiudi |Z(f)| end-to-end sulla stessa bump map del tapeout.",
        "Close end-to-end |Z(f)| on the same bump map as tapeout."
      ),
    ],
  },
];
