import { loc } from "./context";

export const ui = {
  siteTitle: loc("Physical Design Flow", "Physical Design Flow"),
  heroBadge: loc("PHYSICAL DESIGN FLOW", "PHYSICAL DESIGN FLOW"),
  heroCta1: loc("Esplora le 14 fasi", "Explore 14 phases"),
  heroCta2: loc("Laboratorio colloqui", "Interview lab"),
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
    "Ogni fase è un layer: quelli precedenti restano visibili ma più trasparenti; il corrente è pieno e animato.",
    "Each phase is a layer: previous ones stay visible but more transparent; the current one is full-bright and animated."
  ),
  glossaryTitle: loc("Glossario Tecnico", "Technical Glossary"),
  glossarySubtitle: loc(
    "Termini, acronimi e file del flusso RTL → GDSII. Nei testi delle fasi i termini sottolineati sono cliccabili e aprono questa definizione.",
    "Terms, acronyms, and files of the RTL → GDSII flow. In phase text, dotted underlined terms are clickable and open this definition."
  ),
  glossarySearch: loc("Cerca termine (WNS, SPEF, AOCV…)", "Search term (WNS, SPEF, AOCV…)"),
  glossaryEmpty: loc("Nessun termine corrisponde alla ricerca.", "No terms match this search."),
  glossaryCount: loc("termini", "terms"),
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
  navRef: loc("File EDA", "EDA files"),
  navTapeout: loc("Tapeout", "Tapeout"),
  navLearn: loc("Lab", "Lab"),
  learnTitle: loc("Laboratorio da colloquio", "Interview lab"),
  learnSubtitle: loc(
    "Quiz, flashcard, drill da war-room (tu sei il PD), calcolatori, esempi numerici e playbook DFT/DFM/ECO/GKC. Cambia i numeri: è così che si impara lo STA, non a memoria.",
    "Quiz, flashcards, war-room drills (you are the PD), calculators, numerical examples, and DFT/DFM/ECO/GKC playbooks. Change the numbers: that is how you learn STA, not by memorizing."
  ),
  learnQuiz: loc("Quiz", "Quiz"),
  learnCards: loc("Flashcard", "Flashcards"),
  learnScenarios: loc("Drill war-room", "War-room drills"),
  learnPlaybook: loc("Playbook", "Playbook"),
  learnCalc: loc("Calcolatori", "Calculators"),
  learnExamples: loc("Esempi svolti", "Worked examples"),
  learnScore: loc("punteggio", "score"),
  learnNext: loc("Prossima domanda", "Next question"),
  learnTap: loc("Tocca per la risposta", "Tap for the answer"),
  learnQ: loc("Tocca per la domanda", "Tap for the question"),
  learnNextStep: loc("Passo successivo", "Next step"),
  learnDebrief: loc("Debrief", "Debrief"),
  learnClosing: loc("Takeaway da colloquio", "Interview takeaway"),
  learnRestart: loc("Ricomincia lo scenario", "Restart scenario"),
  learnSymptoms: loc("Numeri sul tavolo", "Numbers on the table"),
  learnPickScenario: loc("Scegli uno scenario", "Pick a scenario"),
  learnStepOf: loc("passo", "step"),
  learnStaHint: loc(
    "Skew positivo (capture tardi) aiuta setup e mangia hold. Hold NON dipende da Tclk. Valori verdi = slack ≥ 0.",
    "Positive skew (late capture) helps setup and eats hold. Hold does NOT depend on Tclk. Green = slack ≥ 0."
  ),
  learnIrHint: loc(
    "Limite statico tipico 5% VDD (verde). Il droop dinamico può essere 2–3× — questo calcolatore è solo I·R.",
    "Typical static limit 5% VDD (green). Dynamic droop can be 2–3× — this calculator is I·R only."
  ),
  learnUtilHint: loc(
    "Verde se U è tra 55% e 80% (fascia industriale sul CORE, non sul die).",
    "Green if U is between 55% and 80% (industrial band on CORE, not die)."
  ),
  learnAntHint: loc(
    "Verde se ratio < Rmax. Allargare il metal PEGGIORA il ratio. Fix: jumper o diodo.",
    "Green if ratio < Rmax. Widening metal WORSENS the ratio. Fix: jumper or diode."
  ),
  essayKicker: loc("Mental model da colloquio", "Interview mental model"),
  exampleTitle: loc("Esempio numerico", "Worked example"),
  refTitle: loc("Artefatti EDA, Stack Metallico, PVT", "EDA Artifacts, Metal Stack, PVT"),
  refSubtitle: loc(
    "I file che viaggiano nel flusso, una stack 7 nm indicativa, e i corner MMMC che lo STA deve chiudere. Niente di questo è opzionale a tapeout.",
    "Files that travel through the flow, an indicative 7 nm stack, and the MMMC corners STA must close. None of this is optional at tapeout."
  ),
  refFiles: loc("File del flusso", "Flow files"),
  refStack: loc("Stack metallico", "Metal stack"),
  refPvt: loc("Corner PVT", "PVT corners"),
  refExt: loc("Estensione", "Extension"),
  refName: loc("Nome", "Name"),
  refPhase: loc("Fase", "Phase"),
  refRole: loc("Ruolo", "Role"),
  refUsedFor: loc("Si usa per", "Used for"),
  refStackNote1: loc(
    "Pitch e naming sono PDK-specifici (M0 può chiamarsi LI, MINT, or COAG). La regola pratica: layer bassi = densità e pin access; layer alti = bassa R per PG e clock.",
    "Pitch and naming are PDK-specific (M0 may be LI, MINT, or COAG). Practical rule: lower layers = density and pin access; upper layers = low R for PG and clock."
  ),
  refStackNote2: loc(
    "Preferred direction alterna H/V. Un net che sale di layer usa via ladder; via singoli sono EM-weak — double-via su strap e clock.",
    "Preferred direction alternates H/V. A net climbing layers uses a via ladder; single vias are EM-weak — double-via on straps and clock."
  ),
  refStackNote3: loc(
    "NDR (wider/spacing/shield) si applicano di solito da M4 in su. M1 è saturato dalle rail e dai pin: non è un layer di signal globale.",
    "NDRs (wider/spacing/shield) usually apply from M4 up. M1 is saturated by rails and pins: it is not a global signal layer."
  ),
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
  statCells: loc("Celle nel glossario", "Cells in glossary"),
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
  termClose: loc("Chiudi", "Close"),
  termOpenGlossary: loc("Apri nel glossario", "Open in glossary"),
  termHint: loc(
    "I termini sottolineati sono cliccabili: aprono la definizione dal glossario.",
    "Dotted underlined terms are clickable: they open the glossary definition."
  ),
};
