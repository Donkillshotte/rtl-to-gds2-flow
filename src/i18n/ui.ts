import { loc } from "./context";

export const ui = {
  siteTitle: loc("Physical Design Flow", "Physical Design Flow"),
  heroBadge: loc("PHYSICAL DESIGN FLOW", "PHYSICAL DESIGN FLOW"),
  heroCta1: loc("Esplora le 14 fasi", "Explore 14 phases"),
  heroCta2: loc("Checklist Signoff", "Signoff checklist"),
  scroll: loc("SCROLL", "SCROLL"),
  flowTitle: loc("Il Flusso Completo — 14 Fasi", "Complete Flow — 14 Phases"),
  flowSubtitle: loc(
    "Dal design RTL alla verifica formale, sintesi, floorplan, PDN, placement, CTS, routing, layout, STA, PV, power signoff, package e tapeout (BTO/MTO/GKC).",
    "From RTL design through formal verification, synthesis, floorplan, PDN, placement, CTS, routing, layout, STA, PV, power signoff, package, and tapeout (BTO/MTO/GKC)."
  ),
  feGroup: loc("Front-End", "Front-End"),
  pdGroup: loc("Physical Design", "Physical Design"),
  signoffGroup: loc("Signoff & Tapeout", "Signoff & Tapeout"),
  milestones: loc("Milestone Critici del Flusso", "Critical Flow Milestones"),
  phase: loc("FASE", "PHASE"),
  deepDive: loc("Approfondimento Tecnico", "Technical Deep Dive"),
  formulas: loc("Formule & Modelli", "Formulas & Models"),
  interview: loc("Preparazione Colloquio Senior", "Senior Interview Prep"),
  checksTitle: loc("Check — Cosa Verificano", "Checks — What They Verify"),
  inputs: loc("Input", "Inputs"),
  outputs: loc("Output", "Outputs"),
  tools: loc("Tool EDA", "EDA Tools"),
  concepts: loc("Concetti Chiave", "Key Concepts"),
  exitCriteria: loc("Exit Criteria / Milestone", "Exit Criteria / Milestone"),
  workNotes: loc("Note di Lavoro", "Work Notes"),
  chipEvolution: loc("Evoluzione del Chip", "Chip Evolution"),
  chipEvolutionDesc: loc(
    "Visualizzazione cumulativa: ogni fase aggiunge layer fisici al layout.",
    "Cumulative visualization: each phase adds physical layers to the layout."
  ),
  glossaryTitle: loc("Glossario Tecnico", "Technical Glossary"),
  glossarySubtitle: loc(
    "Termini e acronimi del flusso di physical design.",
    "Terms and acronyms of the physical design flow."
  ),
  cellsTitle: loc("Glossario Celle Standard", "Standard Cell Glossary"),
  cellsSubtitle: loc(
    "Ogni cella fisica del PDK: funzione, placement, e regole di utilizzo in produzione.",
    "Every physical PDK cell: function, placement, and production usage rules."
  ),
  signoffTitle: loc("Checklist di Signoff", "Signoff Checklist"),
  signoffSubtitle: loc(
    "Checklist di produzione ASIC — ogni item deve passare prima del tapeout. Zero violations, non «quasi zero».",
    "Production ASIC checklist — every item must pass before tapeout. Zero violations, not «almost zero»."
  ),
  heroSubtitle: loc(
    "Guida professionale al flusso RTL → GDSII: formal verification, sintesi, floorplan, PDN, placement, CTS, routing, STA, PV, bump assignment, package e tapeout (BTO/MTO/GKC). 14 fasi con formule, exit criteria, colloquio senior e glossario celle.",
    "Professional RTL → GDSII flow guide: formal verification, synthesis, floorplan, PDN, placement, CTS, routing, STA, PV, bump assignment, package, and tapeout (BTO/MTO/GKC). 14 phases with formulas, exit criteria, senior interview prep, and cell glossary."
  ),
  navSignoff: loc("Signoff", "Signoff"),
  navGlossary: loc("Glossario", "Glossary"),
  navCells: loc("Celle", "Cells"),
  navTapeout: loc("Tapeout", "Tapeout"),
  langIt: loc("IT", "IT"),
  langEn: loc("EN", "EN"),
  checkCount: loc("check", "checks"),
  category: loc("Categoria", "Category"),
  function: loc("Funzione", "Function"),
  placementRules: loc("Regole di Placement", "Placement Rules"),
  whenUsed: loc("Quando si usa", "When used"),
  footerEdu: loc(
    "Riferimento educativo · Contenuti basati su flussi industriali EDA",
    "Educational reference · Content based on industrial EDA flows"
  ),
  summaryTitle: loc("Dal Silicio alla Geometria", "From Silicon to Geometry"),
  summaryDesc: loc(
    "Il flusso RTL → GDSII attraversa front-end, physical design e signoff. Ogni fase ha exit criteria formali — Floorplan Exit, PRO Exit, GKC, BTO/MTO.",
    "The RTL → GDSII flow spans front-end, physical design, and signoff. Each phase has formal exit criteria — Floorplan Exit, PRO Exit, GKC, BTO/MTO."
  ),
  statPhases: loc("Fasi del flusso", "Flow phases"),
  statTerms: loc("Termini nel glossario", "Glossary terms"),
  statChecks: loc("Check di signoff", "Signoff checks"),
  statOutput: loc("Output finale", "Final output"),
  summaryIterTitle: loc("Iterazioni e Timing Closure", "Iterations and Timing Closure"),
  summaryIterDesc: loc(
    "In un flusso reale, le fasi non sono sempre lineari. Timing closure richiede iterazioni tra placement, CTS e routing. ECO permettono fix locali fino al signoff su tutti i corner PVT.",
    "In a real flow, phases are not always linear. Timing closure requires iterations between placement, CTS, and routing. ECOs allow local fixes until signoff on all PVT corners."
  ),
  summaryCostTitle: loc("Costo del Tapeout", "Tapeout Cost"),
  summaryCostDesc: loc(
    "Per nodi avanzati (≤7nm), un mask set costa $2-5M+. Fabbricazione 3-4 mesi. Dopo tapeout non c'è undo — bug scoperti solo con silicon richiedono respin. MPW per prototipi.",
    "For advanced nodes (≤7nm), a mask set costs $2-5M+. Fabrication takes 3-4 months. After tapeout there is no undo — bugs found only in silicon require respin. MPW for prototypes."
  ),
  milestoneGkDesc: loc("Gate Keeper Check — review multi-disciplinare", "Gate Keeper Check — multi-disciplinary review"),
  milestoneFpDesc: loc("Floorplan legalizzato, pin placed, PG connected", "Legalized floorplan, pins placed, PG connected"),
  milestoneProDesc: loc("Placement/Post-Route Optimization completata", "Placement/Post-Route Optimization completed"),
  milestoneBtoDesc: loc("Base Tape-Out (FEOL) → Metal Tape-Out (BEOL)", "Base Tape-Out (FEOL) → Metal Tape-Out (BEOL)"),
};
