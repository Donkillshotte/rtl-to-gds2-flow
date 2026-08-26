import { loc } from "@/i18n/context";
import type { PlaybookChapter } from "./playbook";

/** Final-wave playbook chapters — ECO metal, analog/mixed, automotive, security PD. */
export const playbookFinal: PlaybookChapter[] = [
  {
    id: "eco-metal",
    title: loc("ECO metal-only e gate-count", "Metal-only and gate-count ECO playbook"),
    kicker: loc(
      "Dopo BTO il silicio è scolpito. L'ECO è ingegneria di emergenza, non feature creep.",
      "After BTO the silicon is carved. ECO is emergency engineering, not feature creep."
    ),
    paragraphs: [
      loc(
        "Freeze FEOL (BTO): diffusion, poly, implant, contact, eventualmente M1–M3 fissati. Tutto ciò che richiede nuova std cell, nuovo via verso diffusion, o nuovo well tap è ECO funzionale → nuovo BTO o respin FEOL. Metal-only ECO: si riwirano sole connessioni su layer BEOL già aperti nel mask set MTO. La distinzione non è semantica: è milioni di dollari e mesi di coda fab.",
        "FEOL freeze (BTO): diffusion, poly, implant, contact, maybe M1–M3 locked. Anything requiring a new std cell, new via to diffusion, or new well tap is a functional ECO → new BTO or FEOL respin. Metal-only ECO: only BEOL connections are rewired on layers already open in the MTO mask set. The distinction is not semantic: it is millions of dollars and months of fab queue."
      ),
      loc(
        "Spare cells al floorplan: riserva 2–4% area con celle fisate (NAND2, NOR2, INV, MUX2, AOI). Topologie utili: NAND2 + INV = AND2; NOR2 + INV = OR2; 2× NAND2 = MUX2 con enable. Il router ECO collega input/output ai pin spare senza placement. Zero spare a 7 nm con tapeout imminente è scommessa, non ottimizzazione.",
        "Spare cells at floorplan: reserve 2–4% area with fixed cells (NAND2, NOR2, INV, MUX2, AOI). Useful topologies: NAND2 + INV = AND2; NOR2 + INV = OR2; 2× NAND2 = MUX2 with enable. The ECO router wires inputs/outputs to spare pins without placement. Zero spare at 7 nm with imminent tapeout is gambling, not optimization."
      ),
      loc(
        "Flow metal-only: (1) netlist ECO da FE (patch Verilog minimo). (2) LEC RTL↔ECO netlist — obbligatorio. (3) Incremental place su regione ECO se serve buffer, altrimenti solo ecoRoute. (4) SPEF update regionale + incremental STA tutti i mode MMMC. (5) Calibre DRC/LVS su GDS patched. (6) ATPG rerun su netlist ECO. Saltare un passo è veto GKC.",
        "Metal-only flow: (1) ECO netlist from FE (minimal Verilog patch). (2) LEC RTL↔ECO netlist — mandatory. (3) Incremental place in ECO region if buffers needed, otherwise ecoRoute only. (4) Regional SPEF update + incremental STA on all MMMC modes. (5) Calibre DRC/LVS on patched GDS. (6) ATPG rerun on ECO netlist. Skipping a step is a GKC veto."
      ),
      loc(
        "Gate-count ECO: aggiungere logica senza nuova cella fisica — solo riwire spare. Budget tipico: 5–50 gate-equivalent per ECO metal. Oltre ~100 gate serve valutare functional ECO con nuova cella in hole pre-riservato (se esiste) o respin. Ogni gate aggiunto aumenta fanout, hold risk, e pattern ATPG. Il PD documenta gate budget firmato dall'architetto.",
        "Gate-count ECO: add logic without a new physical cell — spare rewire only. Typical budget: 5–50 gate-equivalent per metal ECO. Beyond ~100 gates, evaluate functional ECO with a new cell in a pre-reserved hole (if one exists) or respin. Every added gate increases fanout, hold risk, and ATPG patterns. PD documents gate budget signed by the architect."
      ),
      loc(
        "Timing ECO metal: size non è opzione se la cella è FEOL-frozen. Armi: reroute (shorter wire), layer promotion, VT swap solo se la lib ha footprint identico (raro). Hold: delay cell in spare INV chain. Setup: useful skew tweak locale se entro budget CTS. Un buffer su path #1 con TNS −80 ns è teatro — volume fix prima.",
        "Metal timing ECO: sizing is not an option if the cell is FEOL-frozen. Weapons: reroute (shorter wire), layer promotion, VT swap only if the lib has identical footprint (rare). Hold: delay cell in spare INV chain. Setup: local useful skew tweak if within CTS budget. One buffer on path #1 with TNS −80 ns is theatre — volume fix first."
      ),
      loc(
        "Checklist pre-ECO signoff: LEC clean, WNS≥0/TNS=0 su tutti mode×corner, DRC=0 su patch, LVS CORRECT su regione, ATPG coverage ≥ target su netlist ECO, IR se toccato PG, package bump map invariato. Documentazione: ECO request form, before/after netlist hash, mask layer list toccati, rollback plan. Un ECO senza rollback è un punto di non ritorno.",
        "Pre-ECO signoff checklist: LEC clean, WNS≥0/TNS=0 on all mode×corner, DRC=0 on patch, LVS CORRECT on region, ATPG coverage ≥ target on ECO netlist, IR if PG touched, package bump map unchanged. Documentation: ECO request form, before/after netlist hash, touched mask layer list, rollback plan. An ECO without rollback is a point of no return."
      ),
    ],
  },
  {
    id: "analog-mixed",
    title: loc("Confini PD analog/mixed-signal", "Analog/mixed-signal PD boundaries"),
    kicker: loc(
      "Il digital PD non disegna il LNA. Ma il floorplan del LNA lo uccide se è sbagliato.",
      "Digital PD does not draw the LNA. But the LNA floorplan kills it if wrong."
    ),
    paragraphs: [
      loc(
        "Partitioning fisico: analog/RF in regioni FIXED con halo 20–100 µm (node-dependent), shield ring (guard ring) connesso a analog VSS, separazione da digital switching aggressivo. PLL/VCO lontano da switching di corrente (IO DDR, CPU core). Il floorplan digital che «avvicina il PHY per wirelength» senza consultare analog è il classico fail di phase noise e spur.",
        "Physical partitioning: analog/RF in FIXED regions with 20–100 µm halo (node-dependent), shield ring (guard ring) tied to analog VSS, separation from aggressive digital switching. PLL/VCO away from current switching (DDR IO, CPU core). Digital floorplan that «moves PHY closer for wirelength» without consulting analog is the classic phase-noise and spur failure."
      ),
      loc(
        "Power domain: analog spesso ha supply dedicati (AVDD, AVSS, DVDD digital wrapper). Il PD digital non shorta AVDD a VDD digital. Level shifter e isolation tra digital control e analog macro sono celle speciali — non std cells. UPF domain boundary deve coincidere con halo fisico. Un domain digital che invade la regione analog causa substrate noise misurabile in silicon.",
        "Power domain: analog often has dedicated supplies (AVDD, AVSS, digital wrapper DVDD). Digital PD does not short AVDD to digital VDD. Level shifters and isolation between digital control and analog macro are special cells — not std cells. UPF domain boundary must match physical halo. A digital domain invading the analog region causes measurable substrate noise in silicon."
      ),
      loc(
        "CTS e clock: il clock digital non attraversa il core analog senza esplicita boundary. Analog ha clock propri (PLL output, crystal) con routing dedicato e NDR. Il PD digital esclude pin analog da CTS. Un buffer clock digital a 50 µm da un VCO è coupling garantito. Through-pin solo con agreement scritto analog+digital.",
        "CTS and clock: digital clock does not cross the analog core without explicit boundary. Analog has its own clocks (PLL output, crystal) with dedicated routing and NDR. Digital PD excludes analog pins from CTS. A digital clock buffer 50 µm from a VCO is guaranteed coupling. Through-pins only with written analog+digital agreement."
      ),
      loc(
        "Substrate e deep n-well: in CMOS bulk, switching digital injecta corrente nel substrate. Analog sensitive (ADC, LNA) richiede deep n-well isolation, guard ring, e spesso physical separation ≥ 50–200 µm. Il PD inserisce tap e guard secondo analog guidelines — non secondo digital DRC minimo. LVS analog include device matching e ratio W/L — il digital LVS non basta.",
        "Substrate and deep n-well: in bulk CMOS, digital switching injects current into the substrate. Sensitive analog (ADC, LNA) needs deep n-well isolation, guard ring, and often ≥ 50–200 µm physical separation. PD inserts taps and guards per analog guidelines — not digital DRC minimum. Analog LVS includes device matching and W/L ratio — digital LVS is not enough."
      ),
      loc(
        "IO e ESD: pad digital e pad analog hanno ESD cell diverse. Il ring IO è co-designed: analog pad spesso wire-bond o bump dedicati, separati da digital high-speed. RDL routing analog richiede matched length, differential pairing, no sharp bends su RF. Il PD digital che routed «un filo in più» sul layer analog RDL è DRC analog fail.",
        "IO and ESD: digital and analog pads have different ESD cells. The IO ring is co-designed: analog pads are often dedicated wire-bond or bumps, separated from digital high-speed. Analog RDL routing needs matched length, differential pairing, no sharp bends on RF. Digital PD routing «one more wire» on the analog RDL layer is an analog DRC fail."
      ),
      loc(
        "Handoff e signoff: analog consegna LEF/DEF FIXED + GDS + model (lib timing per digital wrapper, SPICE per analog core). Il digital PD integra, non modifica. GKC: analog DRC/LVS separato, digital DRC/LVS sul wrapper, SI su boundary nets, IR su analog supply separato. Un «merge e speriamo» al tapeout è respin analog — il più costoso.",
        "Handoff and signoff: analog delivers FIXED LEF/DEF + GDS + model (lib timing for digital wrapper, SPICE for analog core). Digital PD integrates, does not modify. GKC: separate analog DRC/LVS, digital DRC/LVS on wrapper, SI on boundary nets, IR on separate analog supply. «Merge and hope» at tapeout is an analog respin — the most expensive kind."
      ),
    ],
  },
  {
    id: "automotive-pd",
    title: loc("PD automotive e ISO 26262", "Automotive PD and ISO 26262 implications"),
    kicker: loc(
      "ASIL non è un badge sul datasheet. È constraint su ogni scelta PD.",
      "ASIL is not a badge on the datasheet. It is a constraint on every PD choice."
    ),
    paragraphs: [
      loc(
        "ISO 26262 Part 11 (semiconductor): il PD contribuisce a freedom from interference tra elementi ASIL e QM. Separazione fisica: distance, firewall logic, diverse power domain, diverse clock domain. Un blocco ASIL-D adjacent a un blocco QM senza barrier è finding di safety audit. Il floorplan documenta spatial separation con misure in µm e rationale.",
        "ISO 26262 Part 11 (semiconductor): PD contributes to freedom from interference between ASIL and QM elements. Physical separation: distance, firewall logic, different power domains, different clock domains. An ASIL-D block adjacent to a QM block without a barrier is a safety audit finding. Floorplan documents spatial separation with µm measures and rationale."
      ),
      loc(
        "DFI e diagnosi: scan coverage target più alto su logic ASIL (≥ 99% stuck-at, transition per safety manual). LBIST/MBIST per memorie safety-critical. Il PD garantisce che isolation cells e retention siano piazzati ai confini domain per power gating sicuro. Un isolation cell mancante su path ASIL in sleep mode è violation CLP + safety.",
        "DFI and diagnosis: higher scan coverage targets on ASIL logic (≥ 99% stuck-at, transition per safety manual). LBIST/MBIST for safety-critical memories. PD ensures isolation cells and retention are placed at domain boundaries for safe power gating. A missing isolation cell on an ASIL path in sleep mode is CLP + safety violation."
      ),
      loc(
        "Aging e lifetime: automotive signoff @ 150°C junction, 15-year mission profile. EM MTTF target ≥ 15 anni (non 10 consumer). NBTI/HCI aging models in STA (optional advanced flows) o margin conservativo su setup. Il PD non usa corner consumer «typical» per ASIL signoff — SS@hot@lowV con derate aging se il flow lo supporta.",
        "Aging and lifetime: automotive signoff @ 150°C junction, 15-year mission profile. EM MTTF target ≥ 15 years (not 10 consumer). NBTI/HCI aging models in STA (optional advanced flows) or conservative setup margin. PD does not use consumer «typical» corners for ASIL signoff — SS@hot@lowV with aging derate if the flow supports it."
      ),
      loc(
        "Temperature range: −40°C … +150°C junction. Hold signoff FF@cold è critico (come consumer) ma setup SS@hot@150°C è il worst per automotive. Voltage range: cranking 6 V → 3.3 V LDO, load dump — il PD riceve voltage map multi-scenario per IR. Un IR pass @ 25°C nominal non basta per cranking.",
        "Temperature range: −40°C … +150°C junction. Hold signoff FF@cold is critical (as in consumer) but setup SS@hot@150°C is worst for automotive. Voltage range: cranking 6 V → 3.3 V LDO, load dump — PD receives multi-scenario voltage map for IR. IR pass @ 25°C nominal is not enough for cranking."
      ),
      loc(
        "Traceability: ogni waiver DRC/timing deve avere safety assessment se tocca elemento ASIL. Tool qualification (TCL) per STA/PV su safety path. Il PD mantiene configuration management: PDK version, tool version, constraint file hash nel safety case. Un «fix veloce» senza documentazione è audit fail.",
        "Traceability: every DRC/timing waiver must have a safety assessment if it touches an ASIL element. Tool qualification (TCL) for STA/PV on safety paths. PD maintains configuration management: PDK version, tool version, constraint file hash in the safety case. A «quick fix» without documentation is an audit fail."
      ),
      loc(
        "Dual-core lockstep e comparator: layout simmetrico per path delay matching tra core ridondanti. CTS skew tra core pair < budget (spesso < 20 ps). Il PD evita che un core sia «hot» e l'altro «cold» per placement density. Divergenza timing tra core ridondanti è safety bug — non solo performance.",
        "Dual-core lockstep and comparator: symmetric layout for delay matching between redundant cores. CTS skew between core pair < budget (often < 20 ps). PD avoids one core being «hot» and the other «cold» from placement density. Timing divergence between redundant cores is a safety bug — not just performance."
      ),
    ],
  },
  {
    id: "security-pd",
    title: loc("Sicurezza fisica e side-channel PD", "Physical security and side-channel PD considerations"),
    kicker: loc(
      "Il attaccante ha oscilloscopio e FIB. Il PD è parte della threat model.",
      "The attacker has a scope and FIB. PD is part of the threat model."
    ),
    paragraphs: [
      loc(
        "Side-channel leakage: power analysis (DPA/CPA) correla corrente supply con operazioni crypto. Mitigazioni PD: uniform placement density attorno a crypto block (no «hot spot» visibile), balanced routing per bit slice, shield mesh su layer alti sopra crypto, decap uniforme. Il PD non implementa masking (RTL) ma il layout che concentra switching su un lato del die facilita l'attacco.",
        "Side-channel leakage: power analysis (DPA/CPA) correlates supply current with crypto operations. PD mitigations: uniform placement density around crypto block (no visible «hot spot»), balanced routing per bit slice, shield mesh on upper layers over crypto, uniform decap. PD does not implement masking (RTL) but layout that concentrates switching on one die side eases the attack."
      ),
      loc(
        "EM emanation: correlazione tra emissione elettromagnetica e dati. Shielding: metal cage (Faraday) attorno a crypto/secure enclave, via fence, grounded fill. Clock e data routing con matched length dove possibile. Il PD coordina con package team per metal lid grounded. Un bus crypto routed lungo il bordo del die senza shield è antenna.",
        "EM emanation: correlation between electromagnetic emission and data. Shielding: metal cage (Faraday) around crypto/secure enclave, via fence, grounded fill. Clock and data routing with matched length where possible. PD coordinates with package team for grounded metal lid. A crypto bus routed along the die edge without shield is an antenna."
      ),
      loc(
        "Tamper detection e mesh: active shield (metal mesh con fine pitch) sopra secure region. Open/short su mesh → alarm. Il PD riserva layer e routing resource per mesh — non si aggiunge post-route. Via density e pitch sono parametrici per resistenza al probing. Un ECO metal che taglia la mesh è security review obbligatoria.",
        "Tamper detection and mesh: active shield (metal mesh with fine pitch) over secure region. Open/short on mesh → alarm. PD reserves layers and routing resource for mesh — not added post-route. Via density and pitch are parametric for probing resistance. A metal ECO that cuts the mesh requires mandatory security review."
      ),
      loc(
        "PUF e OTP: layout fisico di SRAM PUF o eFuse richiede simmetria e spacing per stabilità bit. Il PD non modifica cella PUF senza IP owner. Neighbor aggressor (digital switching) degradano PUF entropy — halo e isolation come analog. LVS su OTP/PUF include bit cell count e connectivity — errori sono security fail.",
        "PUF and OTP: physical layout of SRAM PUF or eFuse requires symmetry and spacing for bit stability. PD does not modify PUF cell without IP owner. Neighbor aggressors (digital switching) degrade PUF entropy — halo and isolation as for analog. LVS on OTP/PUF includes bit cell count and connectivity — errors are security fails."
      ),
      loc(
        "Secure boot e key storage: key in OTP/flash secure region con access control hardware. Il PD garantisce che routing key bus non attraversa regioni non secure senza encryption (scrambling netlist). Physical isolation: secure enclave in corner del die con dedicated power e clock. Un level shifter sbagliato tra secure e non-secure è information leak path.",
        "Secure boot and key storage: key in OTP/flash secure region with hardware access control. PD ensures key bus routing does not cross non-secure regions without encryption (scrambling netlist). Physical isolation: secure enclave in die corner with dedicated power and clock. A wrong level shifter between secure and non-secure is an information leak path."
      ),
      loc(
        "Signoff security: DRC deck può includere rules specifiche (min spacing shield, max hole in mesh). GDS delivery con NDA e split (public vs secure layer). Il PD partecipa a security review pre-tapeout: threat model, attack surface fisico, test plan per side-channel lab. Un chip «secure» con crypto in plaintext layout è marketing, non engineering.",
        "Security signoff: DRC deck may include specific rules (min shield spacing, max hole in mesh). GDS delivery with NDA and split (public vs secure layer). PD joins pre-tapeout security review: threat model, physical attack surface, test plan for side-channel lab. A «secure» chip with crypto in plaintext layout is marketing, not engineering."
      ),
    ],
  },
];
