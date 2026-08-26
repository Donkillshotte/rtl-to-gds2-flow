import { loc, type Localized } from "@/i18n/context";

export interface BilingualGlossaryTerm {
  term: string;
  fullName?: Localized;
  definition: Localized;
  category: Localized;
}

function g(
  term: string,
  full: string | undefined,
  it: string,
  en: string,
  catIt: string,
  catEn: string
): BilingualGlossaryTerm {
  return {
    term,
    ...(full ? { fullName: loc(full, full) } : {}),
    definition: loc(it, en),
    category: loc(catIt, catEn),
  };
}

export const bilingualGlossary: BilingualGlossaryTerm[] = [
  /* —— Front-End —— */
  g("RTL", "Register Transfer Level", "Astrazione HDL (SystemVerilog/VHDL) che descrive trasferimento dati tra registri e logica combinatoria. Deve essere sintetizzabile, lint-clean e CDC-safe.", "HDL abstraction (SystemVerilog/VHDL) describing data transfer between registers and combinational logic. Must be synthesizable, lint-clean, and CDC-safe.", "Front-End", "Front-End"),
  g("HDL", "Hardware Description Language", "Linguaggio per descrivere hardware: SystemVerilog (IEEE 1800) e VHDL (IEEE 1076) sono lo standard ASIC.", "Language for describing hardware: SystemVerilog (IEEE 1800) and VHDL (IEEE 1076) are the ASIC standard.", "Front-End", "Front-End"),
  g("FSM", "Finite State Machine", "Macchina a stati finiti. In ASIC: encoding one-hot/binary/gray, default assignment obbligatorio per evitare latch inferiti.", "Finite state machine. In ASIC: one-hot/binary/gray encoding; default assignment is mandatory to avoid inferred latches.", "Front-End", "Front-End"),
  g("Clock Gating", undefined, "Disabilita il clock di un registro quando non è necessario. Riduce P_dyn ma crea ICG cells e path di enable da chiudere in STA.", "Disables a register clock when idle. Cuts P_dyn but inserts ICG cells and enable paths that STA must close.", "Front-End", "Front-End"),
  g("DFT", "Design For Test", "Scan chains, compression (EDT/XOR), MBIST, BIST, boundary scan. Si inserisce pre-sintesi e si verifica fino al tapeout.", "Scan chains, compression (EDT/XOR), MBIST, BIST, boundary scan. Inserted pre-synthesis and verified through tapeout.", "Test", "Test"),
  g("ATPG", "Automatic Test Pattern Generation", "Generazione automatica di pattern di test (stuck-at, transition, path delay). Coverage target tipico >99% stuck-at.", "Automatic generation of test patterns (stuck-at, transition, path delay). Typical stuck-at coverage target >99%.", "Test", "Test"),
  g("MBIST", "Memory Built-In Self Test", "Controller on-chip che testa SRAM/ROM a produzione (March C-, March 13N). Obbligatorio per ogni macro memoria.", "On-chip controller that tests SRAM/ROM in production (March C-, March 13N). Mandatory for every memory macro.", "Test", "Test"),
  g("Scan Chain", undefined, "Catena di FF scan-able per osservabilità/controllabilità. Length, stitching e reordering impattano timing e congestion.", "Chain of scan-able FFs for observability/controllability. Length, stitching, and reordering impact timing and congestion.", "Test", "Test"),
  g("JTAG", "IEEE 1149.1 Boundary Scan", "Interfaccia TAP per test board-level e debug silicon. Boundary scan cells sugli IO pad.", "TAP interface for board-level test and silicon debug. Boundary-scan cells on IO pads.", "Test", "Test"),

  /* —— Verification —— */
  g("UVM", "Universal Verification Methodology", "Metodologia SystemVerilog per testbench: agent, sequencer, scoreboard, coverage. Standard industriale FE.", "SystemVerilog testbench methodology: agent, sequencer, scoreboard, coverage. Industry FE standard.", "Verifica", "Verification"),
  g("SVA", "SystemVerilog Assertions", "Assertion concurrenti/immediate per proprietà protocollo, FSM safety, handshake. Usate in sim e formal.", "Concurrent/immediate assertions for protocol properties, FSM safety, handshake. Used in sim and formal.", "Verifica", "Verification"),
  g("LEC", "Logic Equivalence Check", "Prova formale che due netlist (RTL↔gate, pre↔post ECO) siano equivalenti. Un fail blocca l'handoff al PD.", "Formal proof that two netlists (RTL↔gate, pre↔post ECO) are equivalent. A fail blocks PD handoff.", "Verifica", "Verification"),
  g("CDC", "Clock Domain Crossing", "Analisi segnali che attraversano clock asincroni. Richiede 2-FF, async FIFO, o handshake. SpyGlass/Questa CDC.", "Analysis of signals crossing asynchronous clocks. Requires 2-FF, async FIFO, or handshake. SpyGlass/Questa CDC.", "Verifica", "Verification"),
  g("RDC", "Reset Domain Crossing", "Verifica crossing tra reset domain (sync/async, power-up). Unmissed RDC → X-propagation e silicon fail.", "Verifies crossings between reset domains (sync/async, power-up). Missed RDC → X-propagation and silicon fail.", "Verifica", "Verification"),
  g("Formal", undefined, "Model checking / property proving su TUTTI gli input legali. Complementa la simulazione (che campiona).", "Model checking / property proving over ALL legal inputs. Complements simulation (which samples).", "Verifica", "Verification"),
  g("Lint", undefined, "Analisi statica RTL: latch inferiti, width mismatch, combinational loops, multi-driven nets. SpyGlass/VC SpyGlass.", "Static RTL analysis: inferred latches, width mismatch, combinational loops, multi-driven nets. SpyGlass/VC SpyGlass.", "Verifica", "Verification"),
  g("Coverage", undefined, "Code (line/branch/toggle) + functional (covergroup). Signoff tipico: 100% code, ≥95% functional bins.", "Code (line/branch/toggle) + functional (covergroup). Typical signoff: 100% code, ≥95% functional bins.", "Verifica", "Verification"),
  g("CLP", "Common Low Power (UPF check)", "Verifica power intent UPF vs RTL/netlist: isolation, level shifter, retention, supply nets.", "Verifies UPF power intent vs RTL/netlist: isolation, level shifter, retention, supply nets.", "Low Power", "Low Power"),

  /* —— Files —— */
  g("SDC", "Synopsys Design Constraints", "Constraint timing: create_clock, set_input/output_delay, false/multicycle path, clock uncertainty, derate.", "Timing constraints: create_clock, set_input/output_delay, false/multicycle path, clock uncertainty, derate.", "File EDA", "EDA Files"),
  g("LIB", "Liberty (.lib)", "Timing/power/noise delle celle: NLDM, CCS, LVF. Un file per ogni PVT corner × cell library (HVT/SVT/LVT).", "Cell timing/power/noise: NLDM, CCS, LVF. One file per PVT corner × cell library (HVT/SVT/LVT).", "File EDA", "EDA Files"),
  g("LEF", "Library Exchange Format", "Geometria astratta: SITE, MACRO pin/obs, TRACKS, LAYER pitch. Tech LEF + cell LEF. Usato da P&R.", "Abstract geometry: SITE, MACRO pin/obs, TRACKS, LAYER pitch. Tech LEF + cell LEF. Used by P&R.", "File EDA", "EDA Files"),
  g("DEF", "Design Exchange Format", "Netlist fisica: die area, rows, components, pins, nets, special nets (PG), blockage, regions.", "Physical netlist: die area, rows, components, pins, nets, special nets (PG), blockage, regions.", "File EDA", "EDA Files"),
  g("SPEF", "Standard Parasitic Exchange Format", "RC estratti post-layout (R, C coupling, C ground). Input di STA signoff e IR. StarRC / Quantus.", "Post-layout extracted RC (R, C coupling, C ground). Input to signoff STA and IR. StarRC / Quantus.", "File EDA", "EDA Files"),
  g("SDF", "Standard Delay Format", "Delay annotati per gate-level sim (SDF back-annotation). Non sostituisce STA signoff.", "Annotated delays for gate-level sim (SDF back-annotation). Does not replace signoff STA.", "File EDA", "EDA Files"),
  g("UPF", "Unified Power Format (IEEE 1801)", "Power intent: power domain, isolation, level shifter, retention, power switch, supply nets.", "Power intent: power domain, isolation, level shifter, retention, power switch, supply nets.", "File EDA", "EDA Files"),
  g("GDSII", undefined, "Formato binario STREAM per poligoni di mask. SoC moderni: 50–500 GB. Alternativa: OASIS (più compatto).", "STREAM binary format for mask polygons. Modern SoCs: 50–500 GB. Alternative: OASIS (more compact).", "File EDA", "EDA Files"),
  g("OASIS", "Open Artwork System Interchange Standard", "Sostituto GDSII compresso (IEEE P1850). Stesso contenuto geometrico, file 5–10× più piccoli.", "Compressed GDSII replacement (IEEE P1850). Same geometry, files 5–10× smaller.", "File EDA", "EDA Files"),
  g("VCD", "Value Change Dump", "Dump di ogni transizione da simulazione. Usato per dynamic IR (activity). File enormi → FSDB/SAIF.", "Dump of every simulation transition. Used for dynamic IR (activity). Huge files → FSDB/SAIF.", "File EDA", "EDA Files"),
  g("FSDB", "Fast Signal Database", "Waveform Synopsys compressa. Alternativa a VCD per IR e debug.", "Compressed Synopsys waveform. VCD alternative for IR and debug.", "File EDA", "EDA Files"),
  g("SAIF", "Switching Activity Interchange Format", "Toggle rate / probability per net. Più compatto di VCD, meno accurato per dynamic IR peak.", "Per-net toggle rate / probability. Smaller than VCD, less accurate for peak dynamic IR.", "File EDA", "EDA Files"),
  g("Verilog Netlist", undefined, "Netlist gate-level post-sintesi: celle, nets, pin. Handoff FE→PD. Deve matchare .lib e LEC vs RTL.", "Post-synthesis gate-level netlist: cells, nets, pins. FE→PD handoff. Must match .lib and LEC vs RTL.", "File EDA", "EDA Files"),
  g("Tech File", undefined, "File processo foundry: layer map, via rules, antenna, density, EM tables. Proprietario (ITF, tf, nxtgrd).", "Foundry process file: layer map, via rules, antenna, density, EM tables. Proprietary (ITF, tf, nxtgrd).", "File EDA", "EDA Files"),

  /* —— Timing —— */
  g("STA", "Static Timing Analysis", "Analisi statica di TUTTI i path (no vector). Corner PVT × mode. Signoff: PrimeTime, Tempus.", "Static analysis of ALL paths (no vectors). PVT corners × modes. Signoff: PrimeTime, Tempus.", "Timing", "Timing"),
  g("WNS", "Worst Negative Slack", "Slack del path più critico. Signoff richiede WNS ≥ 0 su ogni corner di setup e hold.", "Slack of the most critical path. Signoff requires WNS ≥ 0 on every setup and hold corner.", "Timing", "Timing"),
  g("TNS", "Total Negative Slack", "Somma di tutti gli slack negativi. Misura quanto lavoro resta; WNS=0 con TNS<0 non è chiusura.", "Sum of all negative slacks. Measures remaining work; WNS=0 with TNS<0 is not closure.", "Timing", "Timing"),
  g("Setup", undefined, "Il dato deve arrivare prima del clock edge successivo. Analisi al corner LENTO (SS, low V, high T).", "Data must arrive before the next clock edge. Analyzed at the SLOW corner (SS, low V, high T).", "Timing", "Timing"),
  g("Hold", undefined, "Il dato deve restare stabile dopo il clock edge. Analisi al corner VELOCE (FF, high V, low T).", "Data must stay stable after the clock edge. Analyzed at the FAST corner (FF, high V, low T).", "Timing", "Timing"),
  g("MMMC", "Multi-Mode Multi-Corner", "Tutte le combinazioni mode (func, scan, sleep) × PVT (SS/TT/FF × V × T). Decine/centinaia di scenario.", "All mode (func, scan, sleep) × PVT (SS/TT/FF × V × T) combinations. Tens/hundreds of scenarios.", "Timing", "Timing"),
  g("OCV", "On-Chip Variation", "Derate globale per variation on-die. Troppo pessimistico → AOCV (stage-based) o POCV/LVF (statistico).", "Global derate for on-die variation. Too pessimistic → AOCV (stage-based) or POCV/LVF (statistical).", "Timing", "Timing"),
  g("AOCV", "Advanced OCV", "Derate tabellato per depth e distance del path. Meno pessimistico di OCV flat. Standard a 16/7 nm.", "Derate tables by path depth and distance. Less pessimistic than flat OCV. Standard at 16/7 nm.", "Timing", "Timing"),
  g("POCV", "Parametric OCV / LVF", "Variazione statistica (σ delay) per cella e net. Liberty Variation Format. Signoff a 7/5/3 nm.", "Statistical variation (σ delay) per cell and net. Liberty Variation Format. Signoff at 7/5/3 nm.", "Timing", "Timing"),
  g("CPPR", "Clock Path Pessimism Removal", "Rimuove il doppio conteggio OCV sul common clock path. PrimeTime lo applica di default (CRPR).", "Removes double-counted OCV on the common clock path. PrimeTime applies it by default (CRPR).", "Timing", "Timing"),
  g("SI", "Signal Integrity", "Crosstalk delay/noise: aggressor switching cambia delay e può causare glitch. STA SI-aware obbligatorio.", "Crosstalk delay/noise: aggressor switching changes delay and can glitch. SI-aware STA is mandatory.", "Timing", "Timing"),
  g("Crosstalk", undefined, "Accoppiamento capacitivo tra net adiacenti. Δt ∝ C_c/C_tot. Fix: spacing, shielding, NDR, layer change.", "Capacitive coupling between adjacent nets. Δt ∝ C_c/C_tot. Fix: spacing, shielding, NDR, layer change.", "Timing", "Timing"),
  g("DRV", "Design Rule Violations (timing)", "Max transition, max capacitance, max fanout. Non sono slack: sono limiti Liberty. Vanno a zero prima del signoff.", "Max transition, max capacitance, max fanout. Not slack — Liberty limits. Must be zero before signoff.", "Timing", "Timing"),
  g("False Path", undefined, "Path che non può essere attivato funzionalmente. set_false_path. Abuso → bug silicon (path reale mascherato).", "Path that cannot be functionally activated. set_false_path. Abuse → silicon bug (real path masked).", "Timing", "Timing"),
  g("Multicycle Path", undefined, "Path con N cicli di budget. set_multicycle_path. Setup N, hold spesso 0 o N-1. Documentare sempre.", "Path with N-cycle budget. set_multicycle_path. Setup N, hold often 0 or N-1. Always document.", "Timing", "Timing"),
  g("Generated Clock", undefined, "Clock derivato (divisore, PLL output). create_generated_clock. Latency e uncertainty ereditate/override.", "Derived clock (divider, PLL output). create_generated_clock. Latency and uncertainty inherited/overridden.", "Timing", "Timing"),
  g("Useful Skew", undefined, "Skew intenzionale: ritardare il clock del capture FF per setup, o del launch per hold. CTS può ottimizzarlo.", "Intentional skew: delay capture FF clock for setup, or launch for hold. CTS can optimize it.", "Timing", "Timing"),
  g("Clock Uncertainty", undefined, "Margine SDC per jitter PLL + margin. Tipico 50–150 ps. Si riduce verso signoff quando jitter è noto.", "SDC margin for PLL jitter + pad. Typical 50–150 ps. Reduced toward signoff once jitter is known.", "Timing", "Timing"),
  g("PEX", "Parasitic Extraction", "Estrazione RC 3D dal layout (StarRC, Quantus, xACT). C-only early, RC coupled per signoff.", "3D RC extraction from layout (StarRC, Quantus, xACT). C-only early; coupled RC for signoff.", "Timing", "Timing"),
  g("NLDM vs CCS", undefined, "NLDM: tabelle delay 2D (input slew × Cload). CCS/ECSM: current-source, più accurato su driver deboli e SI.", "NLDM: 2D delay tables (input slew × Cload). CCS/ECSM: current-source, more accurate on weak drivers and SI.", "Timing", "Timing"),
  g("IR-aware STA", undefined, "STA che usa voltage map da IR drop (istanza per istanza). Path in hotspot IR diventano più lenti.", "STA using per-instance voltage map from IR drop. Paths in IR hotspots become slower.", "Timing", "Timing"),

  /* —— PD —— */
  g("Floorplan", undefined, "Disposizione die: macros, IO, channels, voltage islands, PG skeleton. ~70% del PPA si decide qui.", "Die arrangement: macros, IO, channels, voltage islands, PG skeleton. ~70% of PPA is decided here.", "PD", "PD"),
  g("Utilization", undefined, "U = (A_cells + A_macros) / A_core. Target 60–80%. Troppo alto → overflow irrecuperabile.", "U = (A_cells + A_macros) / A_core. Target 60–80%. Too high → irrecoverable overflow.", "PD", "PD"),
  g("Halo / Keepout", undefined, "Margine attorno ai macro dove non si piazzano std cells. Protegge pin access e riduce congestion.", "Margin around macros with no std cells. Protects pin access and reduces congestion.", "PD", "PD"),
  g("Blockage", undefined, "Regione vietata a placement e/o routing. Soft (preferenza) vs hard (assoluto). Partial blockage per density.", "Region forbidden to placement and/or routing. Soft vs hard. Partial blockage for density.", "PD", "PD"),
  g("CTS", "Clock Tree Synthesis", "Albero (o mesh) di clock buffer verso tutti i sink. Target: skew, latency, max trans, power.", "Tree (or mesh) of clock buffers to all sinks. Targets: skew, latency, max trans, power.", "PD", "PD"),
  g("Clock Mesh", undefined, "Griglia clock ridondante. Skew <15 ps, OCV basso, 2–3× power vs tree. CPU/GPU multi-GHz.", "Redundant clock grid. Skew <15 ps, low OCV, 2–3× power vs tree. Multi-GHz CPU/GPU.", "PD", "PD"),
  g("Skew", undefined, "Differenza di clock arrival tra due sink. Global skew vs local (launch-capture). CTS minimizza local.", "Clock arrival difference between two sinks. Global vs local (launch-capture). CTS minimizes local.", "PD", "PD"),
  g("Latency", undefined, "Ritardo clock source → sink. Insertion delay. Impatta I/O timing e power (buffer count).", "Delay clock source → sink. Insertion delay. Impacts I/O timing and power (buffer count).", "PD", "PD"),
  g("Legalization", undefined, "Spostamento celle su SITE legale, no overlap, row alignment, tap/endcap. Post global placement.", "Move cells onto legal SITE, no overlap, row alignment, tap/endcap. After global placement.", "PD", "PD"),
  g("Congestion", undefined, "Overflow di demand vs supply sui GCell. >5% overflow post-place è un red flag per routing.", "GCell demand vs supply overflow. >5% overflow post-place is a routing red flag.", "PD", "PD"),
  g("ECO", "Engineering Change Order", "Fix post-route: metal-only (spare cells, layer change) o functional (re-synth locale). Freeze FEOL a BTO.", "Post-route fix: metal-only (spare cells, layer change) or functional (local re-synth). FEOL freeze at BTO.", "PD", "PD"),
  g("P&R", "Place and Route", "Placement + CTS + routing. Innovus, ICC2, Aprisa. Produce DEF/GDS e netlist per STA post-route.", "Placement + CTS + routing. Innovus, ICC2, Aprisa. Produces DEF/GDS and netlist for post-route STA.", "PD", "PD"),
  g("FF", "Flip-Flop", "Elemento di memoria edge-triggered. Setup/hold, Tcq. Scan-able (SDFF) in DFT. Base dello STA.", "Edge-triggered memory element. Setup/hold, Tcq. Scan-able (SDFF) in DFT. Foundation of STA.", "Front-End", "Front-End"),
  g("Std Cell", "Standard Cell", "Cella digitale da library (INV, NAND, FF…). Altezza fissa (row), larghezza multipla del SITE. Placement legale su row.", "Digital library cell (INV, NAND, FF…). Fixed height (row), width multiple of SITE. Legal placement on rows.", "PD", "PD"),
  g("NDR", "Non-Default Rules", "Wire più larghi, double spacing, shielding VSS. Clock, reset, analog, critical bus. Costa routing resource.", "Wider wires, double spacing, VSS shielding. Clock, reset, analog, critical bus. Costs routing resource.", "Routing", "Routing"),
  g("Preferred Direction", undefined, "Ogni metal layer ha direzione preferita (H o V) per via alignment e yield. Routing viola a costo extra.", "Each metal layer has a preferred direction (H or V) for via alignment and yield. Routing may violate at extra cost.", "Routing", "Routing"),
  g("Via Ladder", undefined, "Stack di via M1→Mn per salire di layer. Resistenza via + enclosure DRC. Double via per reliability.", "Via stack M1→Mn to climb layers. Via resistance + enclosure DRC. Double-via for reliability.", "Routing", "Routing"),
  g("Pin Access", undefined, "Spazio M1/M2 per connettere i pin della cella. Celle dense (AOI, MUX) sono hotspot di access.", "M1/M2 space to connect cell pins. Dense cells (AOI, MUX) are access hotspots.", "Routing", "Routing"),
  g("Track", undefined, "Griglia di routing definita dal pitch del layer. Pin devono cadere su track. Off-track = DRC.", "Routing grid defined by layer pitch. Pins must land on track. Off-track = DRC.", "Routing", "Routing"),
  g("Search & Repair", undefined, "Iterazione detailed routing che risolve DRC (spacing, shorts) con rip-up e re-route locale.", "Detailed-routing iteration that fixes DRC (spacing, shorts) via local rip-up and re-route.", "Routing", "Routing"),
  g("Open / Short", undefined, "Open: net non connessa. Short: due net collegate. Zero opens/shorts è exit criterion del routing.", "Open: disconnected net. Short: two nets connected. Zero opens/shorts is a routing exit criterion.", "Routing", "Routing"),
  g("Antenna", undefined, "Carica plasma su wire lunghi durante etch → danneggia gate oxide. Fix: diode, jumper, buffer.", "Plasma charge on long wires during etch → gate-oxide damage. Fix: diode, jumper, buffer.", "Routing", "Routing"),

  /* —— Power / LP —— */
  g("PDN", "Power Delivery Network", "Rete VDD/VSS: bump → RDL → ring → strap/mesh → rail → cell. Primary + secondary PG.", "VDD/VSS network: bump → RDL → ring → strap/mesh → rail → cell. Primary + secondary PG.", "Power", "Power"),
  g("Primary PG", "Primary Power Grid", "Always-on backbone globale. Pad/bump → ring → mesh. Alimenta tutto, inclusi switch.", "Global always-on backbone. Pad/bump → ring → mesh. Feeds everything, including switches.", "Power", "Power"),
  g("Secondary PG", "Secondary Power Grid", "Rete di dominio (VDD_SW, VDD_RET, AON island). Alimentata dalla primary via power switch.", "Domain network (VDD_SW, VDD_RET, AON island). Fed from primary via power switches.", "Power", "Power"),
  g("Power Switch", undefined, "Header PMOS (VDD→VDD_SW) o footer NMOS. Daisy-chain/fishbone. Inrush current da controllare.", "PMOS header (VDD→VDD_SW) or NMOS footer. Daisy-chain/fishbone. Inrush current must be controlled.", "Low Power", "Low Power"),
  g("Power Mesh", undefined, "Griglia 2D H+V su layer alti. Bassa R, alta current capacity. Standard su SoC ad alta corrente.", "2D H+V grid on upper layers. Low R, high current capacity. Standard on high-current SoCs.", "Power", "Power"),
  g("IR Drop", undefined, "V_drop = I×R sulla PDN. Static (DC) e dynamic (transient). Limite tipico statico <5% VDD.", "V_drop = I×R on the PDN. Static (DC) and dynamic (transient). Typical static limit <5% VDD.", "Power", "Power"),
  g("EM", "Electromigration", "Migrazione ioni metallici per flusso elettroni. Black's eq. per MTTF. Power EM (DC) ≠ Signal EM (RMS).", "Metal-ion migration from electron flow. Black's eq. for MTTF. Power EM (DC) ≠ Signal EM (RMS).", "Power", "Power"),
  g("Decap", "Decoupling Capacitance", "Celle MOS cap on-die per filtrare di/dt. Placement vicino a blocchi ad alta attività.", "On-die MOS cap cells to filter di/dt. Place near high-activity blocks.", "Power", "Power"),
  g("Isolation Cell", undefined, "Clamp output di un dominio spento (clamp 0/1/latch) per non propagare X nel dominio acceso.", "Clamps output of a powered-down domain (clamp 0/1/latch) so X does not propagate into the live domain.", "Low Power", "Low Power"),
  g("Level Shifter", undefined, "Traduce livelli tra voltage domain (es. 0.75↔0.9 V). High-to-low o low-to-high, enable opzionale.", "Translates levels between voltage domains (e.g. 0.75↔0.9 V). High-to-low or low-to-high, optional enable.", "Low Power", "Low Power"),
  g("Retention", undefined, "FF che tengono lo stato durante power-gating (save/restore o balloon latch) su supply always-on.", "FFs that keep state during power-gating (save/restore or balloon latch) on always-on supply.", "Low Power", "Low Power"),
  g("Voltage Island", undefined, "Regione con VDD dedicato (multi-voltage). Confine: LS + isolation + PG split. UPF set_domain.", "Region with dedicated VDD (multi-voltage). Boundary: LS + isolation + PG split. UPF set_domain.", "Low Power", "Low Power"),
  g("Multi-Vt", undefined, "HVT (basso leak, lento), SVT, LVT, ULVT (veloce, alto leak). Synthesis/opt mixa per PPA.", "HVT (low leak, slow), SVT, LVT, ULVT (fast, high leak). Synthesis/opt mixes them for PPA.", "Low Power", "Low Power"),

  /* —— Layout / PV / Process —— */
  g("Fill", "Metal / Dummy Fill", "Poligoni dummy per densità CMP uniforme. Floating o grounded. Impatta C parasitics e SI.", "Dummy polygons for uniform CMP density. Floating or grounded. Impacts parasitic C and SI.", "Layout", "Layout"),
  g("Seal Ring", undefined, "Anello metallico continuo al bordo die. Protegge da umidità, crack, latch-up. DRC continuity.", "Continuous metal ring at die edge. Protects from moisture, crack, latch-up. DRC continuity.", "Layout", "Layout"),
  g("Scribe Line", undefined, "Canale tra die sul wafer per il dicing. Contiene PCM/test structures. Fuori dal design.", "Channel between dies on wafer for dicing. Holds PCM/test structures. Outside the design.", "Layout", "Layout"),
  g("CMP", "Chemical Mechanical Polishing", "Planarizzazione. Richiede densità metal min/max per layer. Dishing (sparse) / erosion (dense).", "Planarization. Requires min/max metal density per layer. Dishing (sparse) / erosion (dense).", "Layout", "Layout"),
  g("DRC", "Design Rule Check", "Regole geometriche foundry: width, spacing, enclosure, density, antenna. ZERO violations a tapeout.", "Foundry geometric rules: width, spacing, enclosure, density, antenna. ZERO violations at tapeout.", "PV", "PV"),
  g("LVS", "Layout Versus Schematic", "Layout estratto ≡ netlist: device count, connectivity, property (W/L). Status CORRECT.", "Extracted layout ≡ netlist: device count, connectivity, property (W/L). CORRECT status.", "PV", "PV"),
  g("ERC", "Electrical Rule Check", "Floating gate, short supply, weak connection, well tap missing. Spesso parte del deck LVS.", "Floating gate, supply short, weak connection, missing well tap. Often part of the LVS deck.", "PV", "PV"),
  g("PV", "Physical Verification", "Famiglia DRC + LVS + ERC + antenna + density + DFM. Calibre, ICV, Pegasus.", "Family: DRC + LVS + ERC + antenna + density + DFM. Calibre, ICV, Pegasus.", "PV", "PV"),
  g("DFM", "Design For Manufacturability", "Hotspot litho, via doubling, wire spreading, redundant via. Oltre il DRC minimo, migliora yield.", "Litho hotspots, via doubling, wire spreading, redundant via. Beyond min DRC — improves yield.", "PV", "PV"),
  g("OPC", "Optical Proximity Correction", "Correzione mask per effetti ottici. Foundry/mask shop. Il design fornisce layer RET-clean.", "Mask correction for optical effects. Foundry/mask shop. Design provides RET-clean layers.", "Processo", "Process"),
  g("FEOL", "Front End Of Line", "Transistor: well, fin, poly/gate, implant, contact. Congelato al BTO.", "Transistors: well, fin, poly/gate, implant, contact. Frozen at BTO.", "Processo", "Process"),
  g("BEOL", "Back End Of Line", "Interconnect: Mx, vias, AP/RDL, passivation. Congelato al MTO.", "Interconnect: Mx, vias, AP/RDL, passivation. Frozen at MTO.", "Processo", "Process"),
  g("FinFET", undefined, "Transistor 3D (16/7/5 nm). Fin pitch e CPP definiscono densità. WPE/LOD meno critici del planar.", "3D transistor (16/7/5 nm). Fin pitch and CPP set density. WPE/LOD less critical than planar.", "Processo", "Process"),
  g("EUV", "Extreme Ultraviolet", "Litografia 13.5 nm per layer critici a 7/5/3 nm. Riduce multi-patterning vs DUV 193 nm.", "13.5 nm lithography for critical layers at 7/5/3 nm. Cuts multi-patterning vs 193 nm DUV.", "Processo", "Process"),
  g("Double Patterning", undefined, "LELE o SADP: un layer logico → 2 mask. Colorization (odd cycle) è DRC. Cut metal a 7 nm.", "LELE or SADP: one logical layer → 2 masks. Colorization (odd cycle) is DRC. Cut metal at 7 nm.", "Processo", "Process"),
  g("Latch-up", undefined, "Thyristor parassita CMOS. Prevenuto da tap cells a distanza max (DRM).", "Parasitic CMOS thyristor. Prevented by tap cells at max spacing (DRM).", "Processo", "Process"),
  g("PDK", "Process Design Kit", "DRM, LEF, LIB, tech, DRC/LVS decks, EM tables, ITF. Versione locked a tapeout.", "DRM, LEF, LIB, tech, DRC/LVS decks, EM tables, ITF. Version locked at tapeout.", "Foundry", "Foundry"),
  g("DRM", "Design Rule Manual", "Manuale foundry di TUTTE le regole. Il runset DRC è l'implementazione machine-readable.", "Foundry manual of ALL rules. The DRC runset is the machine-readable implementation.", "Foundry", "Foundry"),

  /* —— Package / Tapeout / Milestones —— */
  g("RDL", "Redistribution Layer", "Metal extra per portare IO pad ai bump (flip-chip) o fan-out. Impatta SI e IR.", "Extra metal to route IO pads to bumps (flip-chip) or fan-out. Impacts SI and IR.", "Package", "Package"),
  g("Bump / C4", undefined, "Sfera saldante flip-chip (Controlled Collapse Chip Connection). Array area-I/O, pitch 80–150 µm.", "Flip-chip solder ball (Controlled Collapse Chip Connection). Area-I/O array, 80–150 µm pitch.", "Package", "Package"),
  g("Flip-chip", undefined, "Die capovolto, bump sull'area. >1000 IO, bassa L. Richiede RDL e co-design package.", "Flipped die, bumps on area. >1000 IO, low L. Needs RDL and package co-design.", "Package", "Package"),
  g("Wire-bond", undefined, "Fili oro/rame da pad periferici al package. <500 IO, più L, costo basso.", "Gold/copper wires from peripheral pads to package. <500 IO, higher L, lower cost.", "Package", "Package"),
  g("SSO", "Simultaneous Switching Output", "Molti IO che commutano insieme → ground bounce V = L·di/dt. Budget IO e package inductance.", "Many IO switching together → ground bounce V = L·di/dt. IO budget and package inductance.", "Package", "Package"),
  g("PKG", undefined, "Package: BGA, CSP, QFN, 2.5D (interposer), 3D (HBM). Co-design con bump map e PDN.", "Package: BGA, CSP, QFN, 2.5D (interposer), 3D (HBM). Co-design with bump map and PDN.", "Package", "Package"),
  g("BTO", "Base Tape-Out", "Congela FEOL (transistor) e spedisce mask base. Il BEOL può ancora cambiare.", "Freezes FEOL (transistors) and ships base masks. BEOL can still change.", "Tapeout", "Tapeout"),
  g("MTO", "Metal Tape-Out", "Congela BEOL (metalli/vias). GDS completo. Dopo MTO solo respin.", "Freezes BEOL (metals/vias). Full GDS. After MTO only a respin.", "Tapeout", "Tapeout"),
  g("GKC", "Gate Keeper Check", "Review multi-disciplinare: FE, PD, STA, PV, DFT, LP, PKG. Un veto blocca il tapeout.", "Multi-disciplinary review: FE, PD, STA, PV, DFT, LP, PKG. One veto blocks tapeout.", "Milestone", "Milestone"),
  g("TOR", "Tapeout Review", "Meeting go/no-go finale prima del data package foundry. Checklist firmata.", "Final go/no-go meeting before the foundry data package. Signed checklist.", "Milestone", "Milestone"),
  g("Floorplan Exit", undefined, "Macro FIXED, pin placed, PG connected, legality clean, islands mapped. Gate verso placement.", "Macros FIXED, pins placed, PG connected, legality clean, islands mapped. Gate to placement.", "Milestone", "Milestone"),
  g("PRO Exit", "Placement/Post-Route Optimization Exit", "Placement o post-route opt chiusa: timing accettabile, congestion ok, DRC interno pulito.", "Placement or post-route opt closed: acceptable timing, congestion OK, internal DRC clean.", "Milestone", "Milestone"),
  g("MPW", "Multi-Project Wafer", "Più design sullo stesso wafer. Costo mask condiviso. Per prototipi, non volume.", "Multiple designs on one wafer. Shared mask cost. For prototypes, not volume.", "Tapeout", "Tapeout"),
  g("Respin", undefined, "Nuovo tapeout dopo silicon fail o ECO tardi. Metal-only respin (BEOL) vs full (FEOL+BEOL).", "New tapeout after silicon fail or late ECO. Metal-only respin (BEOL) vs full (FEOL+BEOL).", "Tapeout", "Tapeout"),
  g("Lock-up", "Lock-up latch / FF", "Livello extra sullo scan stitch inter-domain: spezza il path hold Q→SI. Non è un delay buffer. Hold intra-domain resta con delay cell.", "Extra level on an inter-domain scan stitch: breaks the Q→SI hold path. Not a delay buffer. Intra-domain hold still uses delay cells.", "Test", "Test"),
  g("OCC", "On-Chip Clock Control", "Mux/sync che lancia 1–2 pulse at-speed per transition test. È un clock root extra per CTS, con glitch check da ICG.", "Mux/sync that launches 1–2 at-speed pulses for transition test. Extra clock root for CTS, with ICG-style glitch checks.", "Test", "Test"),
  g("EDT", "Embedded Deterministic Test", "Compressione scan: poche porte ATE ↔ molte chain interne. Pattern count e pin ATE crollano. Codec analogo in altri vendor.", "Scan compression: few ATE pins ↔ many internal chains. Pattern count and ATE pins collapse. Other vendors ship an analogous codec.", "Test", "Test"),
  g("HFNS", "High Fanout Net Synthesis", "Albero di buffer per reset, scan_en, e altri net non-clock a 10k–100k sink. Non è CTS (niente skew/duty/NDR da clock).", "Buffer tree for reset, scan_en, and other non-clock nets with 10k–100k sinks. Not CTS (no clock skew/duty/NDR).", "PD", "PD"),
  g("LELE", "Litho-Etch-Litho-Etch", "Double patterning: due mask, grafo 2-colorabile. Odd cycle = coloring conflict. A 7 nm è DRC, non un warning CAD.", "Double patterning: two masks, 2-colorable graph. Odd cycle = coloring conflict. At 7 nm it is DRC, not a CAD warning.", "DFM", "DFM"),
  g("PV-band", undefined, "Inviluppo geometrico sotto variation di processo. Hotspot fuori spec = fail litho, si fixa in layout.", "Geometric envelope under process variation. Hotspot out of spec = litho fail, fixed in layout.", "DFM", "DFM"),
  g("DRV", "Design Rule / Electrical DRV", "In STA: max_tran, max_cap, max_fanout. Zero prima di credere al WNS: fuori range il .lib estrapola.", "In STA: max_tran, max_cap, max_fanout. Zero before you believe WNS: outside range the .lib extrapolates.", "Timing", "Timing"),
  g("FO4", "Fan-Out of 4", "Unità di delay: ritardo di un inverter che guida 4 carichi FO4-equivalenti. A 7 nm ≈ 10–14 ps. Budget FO4 per ciclo = (Tclk − overhead) / t_FO4.", "Delay unit: delay of an inverter driving 4 FO4-equivalent loads. At 7 nm ≈ 10–14 ps. FO4 budget per cycle = (Tclk − overhead) / t_FO4.", "Timing", "Timing"),
  g("ICG", "Integrated Clock Gating", "Cella latch+AND per clock gating senza glitch. Inserita da synth/CTS. Enable latched — mai AND combinazionale sul clock.", "Latch+AND cell for glitch-free clock gating. Inserted by synth/CTS. Latched enable — never combinational AND on clock.", "Front-End", "Front-End"),
  g("OCC", "On-Chip Clock Controller", "Controller per at-speed test: bypass PLL, genera clock controllato per scan capture. Inserito nel clock tree.", "Controller for at-speed test: bypass PLL, generate controlled clock for scan capture. Inserted in clock tree.", "Test", "Test"),
  g("CLP", "Conformal Low Power", "Equivalence check UPF↔netlist. Verifica isolation, LS, retention, power switch map. Obbligatorio pre-PD handoff.", "UPF↔netlist equivalence check. Verifies isolation, LS, retention, power-switch map. Mandatory pre-PD handoff.", "Verifica", "Verification"),
  g("POCV", "Parametric On-Chip Variation", "Statistical timing con LVF library. Derate per cella con sigma. Signoff a 3σ/4σ. Standard a 5 nm.", "Statistical timing with LVF library. Per-cell derate with sigma. Signoff at 3σ/4σ. Standard at 5 nm.", "Timing", "Timing"),
  g("AOCV", "Advanced On-Chip Variation", "Derate tables per depth e location. Più accurato di OCV fisso. Bridge tra OCV e POCV.", "Derate tables by depth and location. More accurate than fixed OCV. Bridge between OCV and POCV.", "Timing", "Timing"),
  g("CRPR", "Clock Reconvergence Pessimism Removal", "Rimuove pessimismo STA su clock reconvergence. Riduce slack artificialmente negativo.", "Removes STA pessimism on clock reconvergence. Reduces artificially negative slack.", "Timing", "Timing"),
  g("NDR", "Non-Default Rule", "Routing rule speciale: 2× width, 2× spacing per clock e critici. Migliora SI e reliability.", "Special routing rule: 2× width, 2× spacing for clock and critical nets. Improves SI and reliability.", "PD", "PD"),
  g("DPT", "Double Patterning Technology", "Un layer metal split in due mask. Coloring alternation obbligatoria. Odd-cycle = conflict.", "One metal layer split into two masks. Mandatory color alternation. Odd-cycle = conflict.", "DFM", "DFM"),
  g("SSO", "Simultaneous Switching Output", "Molti IO switchano insieme → ground bounce, VDD droop. Fix: stagger, decap, ground bump ratio.", "Many IO switching together → ground bounce, VDD droop. Fix: stagger, decap, ground bump ratio.", "Package", "Package"),
  g("RDL", "Redistribution Layer", "Layer AP/RDL per routing pad→bump in flip-chip. Lunga RDL = C, R, SI impact.", "AP/RDL layer for pad→bump routing in flip-chip. Long RDL = C, R, SI impact.", "Package", "Package"),
  g("GKC", "Golden Kit Check", "Foundry validation pre-mask. Ogni disciplina firma. Un veto = no tapeout.", "Foundry validation pre-mask. Each discipline signs. One veto = no tapeout.", "Tapeout", "Tapeout"),
  g("BTO", "Base Tapeout", "Tapeout FEOL: OD, poly, well, implant. Prima fase mask order.", "FEOL tapeout: OD, poly, well, implant. First mask order phase.", "Tapeout", "Tapeout"),
  g("MTO", "Metal Tapeout", "Tapeout BEOL: full metal stack, fill, signoff completo.", "BEOL tapeout: full metal stack, fill, complete signoff.", "Tapeout", "Tapeout"),
  g("MPW", "Multi-Project Wafer", "Wafer condiviso tra progetti. Costo mask ridotto. Stessi check signoff.", "Shared wafer across projects. Reduced mask cost. Same signoff checks.", "Tapeout", "Tapeout"),
  g("BISR", "Built-In Self Repair", "Riparazione automatica SRAM con spare rows/columns. Migliora yield.", "Automatic SRAM repair with spare rows/columns. Improves yield.", "Test", "Test"),
  g("SDFF", "Scan D Flip-Flop", "FF con pin scan_in/scan_out per scan chain. Obbligatorio per DFT.", "FF with scan_in/scan_out pins for scan chain. Mandatory for DFT.", "Test", "Test"),
  g("GRC", "Global Route Congestion", "Metrica congestione post-global route. >0.8 hotspot = red flag.", "Post-global-route congestion metric. >0.8 hotspot = red flag.", "PD", "PD"),
  g("SPEF", "Standard Parasitic Exchange Format", "File RC estratto da layout. Alimenta post-route STA. Fill-inclusive per signoff.", "RC file extracted from layout. Feeds post-route STA. Fill-inclusive for signoff.", "Timing", "Timing"),
  g("IBIS", "I/O Buffer Information Specification", "Modello IO per package SI e timing. Usato in set_input/output_delay.", "IO model for package SI and timing. Used in set_input/output_delay.", "Package", "Package"),
  g("UPF", "Unified Power Format", "IEEE 1801. Descrive power domains, isolation, LS, retention, power switches.", "IEEE 1801. Describes power domains, isolation, LS, retention, power switches.", "Front-End", "Front-End"),
  g("DVFS", "Dynamic Voltage and Frequency Scaling", "Riduce V e f per risparmio energetico. Impatta timing corner e power signoff.", "Reduces V and f for energy savings. Impacts timing corners and power signoff.", "Power", "Power"),
  g("HBM", "High Bandwidth Memory", "DRAM stack 3D con TSV. Co-design con logic die. Thermal limit severo.", "3D DRAM stack with TSV. Co-design with logic die. Severe thermal limit.", "Package", "Package"),
  g("TSV", "Through-Silicon Via", "Via verticale tra die in 3D/2.5D. Interposer, HBM stacking.", "Vertical via between dies in 3D/2.5D. Interposer, HBM stacking.", "Package", "Package"),
];

export const bilingualSignoffChecklist = [
  {
    category: loc("Front-End Signoff", "Front-End Signoff"),
    items: loc(
      [
        "Lint clean (waivers documentati, nessun latch inferito)",
        "CDC/RDC clean — ogni crossing con sync o FIFO",
        "Formal: proprietà critiche (FSM, protocol, one-hot) proven",
        "Functional coverage chiusa (≥95% bins, 100% code)",
        "RTL ↔ synthesis LEC pass (no non-eq)",
        "UPF/CLP verification pass (isolation, LS, retention)",
        "DFT: scan inserted, ATPG coverage nel target, MBIST su tutte le memorie",
        "Lock-up latch su stitch inter-domain; OCC nel clock spec; TCK/TMS/TDI/TDO riservati",
      ],
      [
        "Lint clean (documented waivers, no inferred latches)",
        "CDC/RDC clean — every crossing has sync or FIFO",
        "Formal: critical properties (FSM, protocol, one-hot) proven",
        "Functional coverage closed (≥95% bins, 100% code)",
        "RTL ↔ synthesis LEC pass (no non-eq)",
        "UPF/CLP verification pass (isolation, LS, retention)",
        "DFT: scan inserted, ATPG coverage on target, MBIST on all memories",
        "Lock-up latches on inter-domain stitches; OCC in the clock spec; TCK/TMS/TDI/TDO reserved",
      ]
    ),
  },
  {
    category: loc("Floorplan Exit", "Floorplan Exit"),
    items: loc(
      [
        "Macro FIXED, no overlap, halo rispettato, FEOL DRC clean",
        "IO pins placed su preferred track, bump/RDL coerenza",
        "Primary PG skeleton (rings + straps/mesh) connesso",
        "Secondary PG per voltage islands / switched domains",
        "Power switch columns riservate, inrush path definito",
        "check_legality clean, voltage island boundaries",
        "Congestion map reviewata (canali macro, pin access)",
      ],
      [
        "Macros FIXED, no overlap, halo honored, FEOL DRC clean",
        "IO pins on preferred track, bump/RDL consistent",
        "Primary PG skeleton (rings + straps/mesh) connected",
        "Secondary PG for voltage islands / switched domains",
        "Power-switch columns reserved, inrush path defined",
        "check_legality clean, voltage-island boundaries",
        "Congestion map reviewed (macro channels, pin access)",
      ]
    ),
  },
  {
    category: loc("PDN & Power Switches", "PDN & Power Switches"),
    items: loc(
      [
        "Primary PG: rings + mesh/straps su layer alti",
        "Secondary PG per ogni switched/retention domain",
        "Power switches placed e connected (header/footer)",
        "Switch topology verificata (daisy-chain/fishbone)",
        "verify_pg_connection clean — no floating rails",
        "Decap cells attorno ad high-activity blocks",
      ],
      [
        "Primary PG: rings + mesh/straps on upper layers",
        "Secondary PG for every switched/retention domain",
        "Power switches placed and connected (header/footer)",
        "Switch topology verified (daisy-chain/fishbone)",
        "verify_pg_connection clean — no floating rails",
        "Decap cells around high-activity blocks",
      ]
    ),
  },
  {
    category: loc("Placement PRO Exit", "Placement PRO Exit"),
    items: loc(
      [
        "Legal placement, density uniforme, tap/endcap completi",
        "Pre-CTS timing WNS ≥ -0.1 ns (o budget di progetto)",
        "Congestion < 5% overflow",
        "Scan chains integre post-reorder",
        "Power connections complete, no floating PG pins",
      ],
      [
        "Legal placement, uniform density, tap/endcap complete",
        "Pre-CTS timing WNS ≥ -0.1 ns (or project budget)",
        "Congestion < 5% overflow",
        "Scan chains intact after reorder",
        "Power connections complete, no floating PG pins",
      ]
    ),
  },
  {
    category: loc("CTS Exit", "CTS Exit"),
    items: loc(
      [
        "Target skew met per ogni clock domain",
        "Max transition e min pulse width rispettati",
        "Hold WNS ≥ 0 o piano di fix documentato",
        "Clock buffer count e power nel budget",
        "ICG enable timing chiuso o eccezione firmata",
      ],
      [
        "Target skew met for every clock domain",
        "Max transition and min pulse width met",
        "Hold WNS ≥ 0 or documented fix plan",
        "Clock buffer count and power within budget",
        "ICG enable timing closed or signed exception",
      ]
    ),
  },
  {
    category: loc("Routing PRO Exit", "Routing PRO Exit"),
    items: loc(
      [
        "100% nets routed, zero opens, zero shorts",
        "Zero congestion overflow",
        "Post-route setup/hold WNS ≥ 0 (o ECO plan)",
        "Antenna ratios clean (diodi/jumper inseriti)",
        "Internal DRC clean (width/spacing/via)",
        "NDR rispettate su clock/reset/critical nets",
      ],
      [
        "100% nets routed, zero opens, zero shorts",
        "Zero congestion overflow",
        "Post-route setup/hold WNS ≥ 0 (or ECO plan)",
        "Antenna ratios clean (diodes/jumpers inserted)",
        "Internal DRC clean (width/spacing/via)",
        "NDRs honored on clock/reset/critical nets",
      ]
    ),
  },
  {
    category: loc("STA Signoff", "STA Signoff"),
    items: loc(
      [
        "Setup WNS ≥ 0, TNS = 0 (tutti i corner setup)",
        "Hold WNS ≥ 0, TNS = 0 (tutti i corner hold)",
        "DRV: max trans / max cap / max fanout = 0",
        "SI/crosstalk clean (delta delay e noise)",
        "Post-PEX SPEF (coupled RC) su signoff corners",
        "CPPR/AOCV o POCV/LVF applicato secondo nodo",
        "IR-aware STA se IR hotspot > soglia",
        "Scan shift hold chiuso (lock-up + delay); capture at-speed setup; mode mbist in MMMC",
        "Temp inversion: SS-cold incluso a nodi bassi V",
      ],
      [
        "Setup WNS ≥ 0, TNS = 0 (all setup corners)",
        "Hold WNS ≥ 0, TNS = 0 (all hold corners)",
        "DRV: max trans / max cap / max fanout = 0",
        "SI/crosstalk clean (delay delta and noise)",
        "Post-PEX SPEF (coupled RC) on signoff corners",
        "CPPR/AOCV or POCV/LVF applied per node",
        "IR-aware STA if IR hotspot exceeds threshold",
        "Scan-shift hold closed (lock-up + delay); at-speed capture setup; mbist mode in MMMC",
        "Temp inversion: SS-cold included at low-V nodes",
      ]
    ),
  },
  {
    category: loc("Physical Verification (PV)", "Physical Verification (PV)"),
    items: loc(
      [
        "DRC: ZERO violations (foundry runset, GDS merged)",
        "LVS: CORRECT status, property check pass",
        "ERC: no floating gates / shorts / missing taps",
        "Antenna: all ratios < limit",
        "Metal density: min/max compliant per layer",
        "Seal ring DRC continuo",
        "DFM: via doubling / hotspot waiver firmato",
        "Coloring LELE: zero odd-cycle; litho/PV-band dentro spec",
      ],
      [
        "DRC: ZERO violations (foundry runset, merged GDS)",
        "LVS: CORRECT status, property check pass",
        "ERC: no floating gates / shorts / missing taps",
        "Antenna: all ratios < limit",
        "Metal density: min/max compliant per layer",
        "Seal ring DRC continuous",
        "DFM: via doubling / hotspot waiver signed",
        "LELE coloring: zero odd-cycles; litho/PV-band in spec",
      ]
    ),
  },
  {
    category: loc("Power Signoff", "Power Signoff"),
    items: loc(
      [
        "Static IR drop < 5% VDD (tutte le istanze)",
        "Dynamic IR: VCD WORST_POWER + WORST_dI/dt",
        "Dynamic droop < 10% VDD, durata < 500 ps",
        "Power EM: J_avg within J_max (strap/via)",
        "Signal EM: RMS + peak within limits",
        "MTTF ≥ 10 anni @ Tmax (125°C/150°C)",
        "Mode: functional, scan, low-power VCD",
        "Peak current BIST/test-mode analizzato (IR/EM)",
      ],
      [
        "Static IR drop < 5% VDD (all instances)",
        "Dynamic IR: VCD WORST_POWER + WORST_dI/dt",
        "Dynamic droop < 10% VDD, duration < 500 ps",
        "Power EM: J_avg within J_max (strap/via)",
        "Signal EM: RMS + peak within limits",
        "MTTF ≥ 10 years @ Tmax (125°C/150°C)",
        "Modes: functional, scan, low-power VCD",
        "BIST/test-mode peak current analyzed (IR/EM)",
      ]
    ),
  },
  {
    category: loc("DFT Signoff", "DFT Signoff"),
    items: loc(
      [
        "ATPG stuck-at e transition sul netlist ECO-finale",
        "Coverage con lista untestable (analog, RAM→MBIST, tied-off)",
        "Pattern consegnati; compressione EDT/Codec se specificata",
        "MBIST wrap su SRAM; analog/CAM documented",
        "Boundary scan 1149.1 / IJTAG 1687 se nel spec",
      ],
      [
        "Stuck-at and transition ATPG on the final ECO netlist",
        "Coverage with untestable list (analog, RAM→MBIST, tied-off)",
        "Patterns delivered; EDT/Codec compression if specified",
        "MBIST wrap on SRAMs; analog/CAM documented",
        "Boundary scan 1149.1 / IJTAG 1687 if in spec",
      ]
    ),
  },
  {
    category: loc("Tapeout (BTO/MTO/GKC)", "Tapeout (BTO/MTO/GKC)"),
    items: loc(
      [
        "PDK version locked & documentata",
        "BTO: Base DRC clean (FEOL)",
        "MTO: Metal DRC clean (BEOL)",
        "GDS/OASIS merged (design + fill + seal ring + IO)",
        "GKC firmato da tutte le discipline",
        "TOR meeting: unanimous go",
        "Data package consegnato al foundry (layer map, job deck)",
      ],
      [
        "PDK version locked & documented",
        "BTO: Base DRC clean (FEOL)",
        "MTO: Metal DRC clean (BEOL)",
        "GDS/OASIS merged (design + fill + seal ring + IO)",
        "GKC signed by all disciplines",
        "TOR meeting: unanimous go",
        "Data package delivered to foundry (layer map, job deck)",
      ]
    ),
  },
];
