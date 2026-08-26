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
    "Termini, acronimi e file del flusso RTL → GDSII con definizioni estese. Nei testi delle fasi i termini sottolineati aprono il popup; qui trovi la voce completa.",
    "Terms, acronyms, and files of the RTL → GDSII flow with extended definitions. In stage text, underlined terms open the popup; here you get the full entry."
  ),
  glossarySearch: loc("Cerca termine (WNS, SPEF, AOCV…)", "Search term (WNS, SPEF, AOCV…)"),
  glossaryEmpty: loc("Nessun termine corrisponde alla ricerca.", "No terms match this search."),
  glossaryCount: loc("termini", "terms"),
  cellsTitle: loc("Glossario Celle Standard", "Standard Cell Glossary"),
  cellsSubtitle: loc(
    "Ogni cella/porta della library: equazione booleana, placement, quando usarla, note di produzione (drive, VT, scan, DRC).",
    "Every library cell/gate: Boolean equation, placement, when to use it, production notes (drive, VT, scan, DRC)."
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
  sourcesTitle: loc("Fonti e riferimenti", "Sources and references"),
  sourcesSubtitle: loc(
    "Testi di fase e saggi citati si basano su libri VLSI classici, paper IEEE, standard (UPF, JTAG, SystemVerilog) e modelli industriali (Liberty/CCS, SDC, MTBF). Ogni paragrafo «da letteratura» elenca le fonti usate.",
    "Stage text and cited essays draw on classic VLSI textbooks, IEEE papers, standards (UPF, JTAG, SystemVerilog), and industry models (Liberty/CCS, SDC, MTBF). Each «from literature» paragraph lists its sources."
  ),
  sourcedEssay: loc("Approfondimento da letteratura", "Literature deep-dive"),
  sourcedRefs: loc("Fonti", "Sources"),
  navSources: loc("Fonti", "Sources"),
  powerPkgTitle: loc("Approfondimento PKG · CPA · Decap · System PDN", "Deep dive: PKG · CPA · Decap · System PDN"),
  powerPkgLead: loc(
    "Dal package alla mesh on-die: modelli CPA, capacità di decoupling e impedenza end-to-end VRM→pin. Saggi bilingue con fonti e link alle fasi PDN, power e package.",
    "From package to on-die mesh: CPA models, decoupling capacitance, and end-to-end VRM→pin impedance. Bilingual essays with sources and links to PDN, power, and package stages."
  ),
  powerPkgTakeaways: loc("Takeaway operativi", "Operating takeaways"),
  navPowerPkg: loc("PDN/PKG", "PDN/PKG"),
  searchPlaceholder: loc("Cerca fasi, termini…", "Search stages, terms…"),
  searchEmpty: loc("Nessun risultato.", "No results."),
  searchPlaybook: loc("Capitolo playbook", "Playbook chapter"),
  searchKindStage: loc("Fase", "Stage"),
  searchKindGlossary: loc("Glossario", "Glossary"),
  searchKindCell: loc("Cella", "Cell"),
  searchKindPlaybook: loc("Playbook", "Playbook"),
  progressEyebrow: loc("Il tuo percorso", "Your path"),
  progressTitle: loc("Progresso di studio", "Study progress"),
  progressLead: loc(
    "Segna le fasi lette e tieni traccia di quiz, drill e colloquio a tempo (salvato in locale).",
    "Mark stages as read and track quiz, drills, and timed interview (saved locally)."
  ),
  progressReset: loc("Azzera", "Reset"),
  progressStages: loc("Fasi lette", "Stages read"),
  progressQuiz: loc("Quiz completati", "Quizzes done"),
  progressDrill: loc("Drill completati", "Drills done"),
  progressInterview: loc("Best colloquio", "Interview best"),
  markRead: loc("Segna come letta", "Mark as read"),
  markedRead: loc("Letta", "Read"),
  densityDeep: loc("Testo pieno", "Full text"),
  densityCompact: loc("Compatto", "Compact"),
  compareEyebrow: loc("Confronto", "Compare"),
  compareTitle: loc("Confronti affiancati", "Side-by-side comparisons"),
  compareLead: loc(
    "Le coppie che tornano sempre in colloquio e in war-room: modelli, metriche, setup/hold, clock.",
    "The pairs that always return in interviews and war-rooms: models, metrics, setup/hold, clocks."
  ),
  compareAspect: loc("Aspetto", "Aspect"),
  compareTakeaway: loc("Takeaway", "Takeaway"),
  toolsTitle: loc("Carte comandi EDA", "EDA command cards"),
  toolsLead: loc(
    "Comandi tipici di timing/power/PV con cosa guardare nell’output e le trappole da colloquio.",
    "Typical timing/power/PV commands with what to look for in the output and interview pitfalls."
  ),
  toolsLook: loc("Cosa guardare", "What to look for"),
  toolsPitfall: loc("Trappola", "Pitfall"),
  warTitle: loc("War stories dal silicio", "Silicon war stories"),
  warLead: loc(
    "Casi realistici: sintomo → causa root → lezione. Collegano STA, fill, scan, IR e tapeout.",
    "Realistic cases: symptom → root cause → lesson. They link STA, fill, scan, IR, and tapeout."
  ),
  warSymptom: loc("Sintomo", "Symptom"),
  warCause: loc("Causa root", "Root cause"),
  warLesson: loc("Lezione", "Lesson"),
  diagramTitle: loc("Diagrammi interattivi", "Interactive diagrams"),
  diagramLead: loc(
    "PDN, CTS, scan e setup/hold: tocca i controlli per vedere come cambiano le strutture.",
    "PDN, CTS, scan, and setup/hold: use the controls to see how structures change."
  ),
  diagramPdnHint: loc(
    "Rails su M1 alimentano le row; straps orizzontali distribuiscono corrente; rings chiudono il dominio.",
    "M1 rails feed the rows; horizontal straps distribute current; rings close the domain."
  ),
  diagramPdnRails: loc("Rails", "Rails"),
  diagramPdnStraps: loc("Straps", "Straps"),
  diagramPdnRings: loc("Rings", "Rings"),
  diagramCtsL0: loc("Root clock (sorgente / PLL).", "Clock root (source / PLL)."),
  diagramCtsL1: loc("Primo livello di buffer / H-tree.", "First buffer / H-tree level."),
  diagramCtsL2: loc("Branch verso i cluster di sink.", "Branches toward sink clusters."),
  diagramCtsL3: loc("Leaf driver → FF (latency e skew locali).", "Leaf drivers → FFs (local latency & skew)."),
  diagramCtsLevel: loc("Livello", "Level"),
  diagramScanHint: loc(
    "Con SE=1 i FF formano una catena SI→SO (shift). Hold inter-FF è il rischio tipico post-CTS.",
    "With SE=1 FFs form an SI→SO chain (shift). Inter-FF hold is the typical post-CTS risk."
  ),
  diagramScanToggle: loc("Toggle SE (shift ↔ func)", "Toggle SE (shift ↔ func)"),
  diagramSetupHint: loc(
    "Setup: il dato lanciato al bordo launch deve arrivare prima del bordo capture meno Tsu (corner lento).",
    "Setup: data launched at the launch edge must arrive before capture minus Tsu (slow corner)."
  ),
  diagramHoldHint: loc(
    "Hold: il dato non deve cambiare troppo presto dopo il bordo di cattura (corner veloce; indipendente da Tclk).",
    "Hold: data must not change too soon after the capturing edge (fast corner; independent of Tclk)."
  ),
  diagramGotoStage: loc("Vai alla fase", "Go to stage"),
  cheatTitle: loc("Cheat sheet stampabile", "Printable cheat sheet"),
  cheatLead: loc(
    "Formule e regole operative da tenere sul banco. Usa Stampa per PDF o carta.",
    "Formulas and operating rules for the bench. Use Print for PDF or paper."
  ),
  cheatPrint: loc("Stampa / PDF", "Print / PDF"),
  cheatTopic: loc("Argomento", "Topic"),
  cheatFormula: loc("Formula", "Formula"),
  cheatNote: loc("Nota operativa", "Operating note"),
  crossLinks: loc("Collegamenti", "Cross-links"),
  crossGlossary: loc("Glossario", "Glossary"),
  crossCells: loc("Celle", "Cells"),
  crossRelated: loc("Fasi correlate", "Related stages"),
  navCompare: loc("Confronti", "Compare"),
  navDiagrams: loc("Diagrammi", "Diagrams"),
  navTools: loc("Comandi", "Commands"),
  navCheat: loc("Cheat", "Cheat"),
  navWar: loc("Stories", "Stories"),
  learnTimed: loc("Colloquio a tempo", "Timed interview"),
  learnTimedStart: loc("Avvia 10 min", "Start 10 min"),
  learnTimedStop: loc("Termina", "Finish"),
  learnTimedLeft: loc("rimanenti", "left"),
  learnTimedDone: loc("Tempo scaduto — punteggio registrato", "Time up — score saved"),
  learnTimedHint: loc(
    "Rispondi a quante più flashcard puoi in 10 minuti. Il best score resta in locale.",
    "Answer as many flashcards as you can in 10 minutes. Best score stays local."
  ),
};
