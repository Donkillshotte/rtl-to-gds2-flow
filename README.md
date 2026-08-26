# RTL → GDSII — Physical Design Flow

Guida professionale interattiva al flusso completo di **physical design** — dal RTL al tapeout GDSII.

**Bilingual:** Italiano / English (language switcher in header)

## Contenuto (14 fasi)

### Front-End
1. **Design RTL** — Architettura, coding guidelines, DFT readiness
2. **Verifica RTL & Formal** — UVM, formal verification, lint, CDC, RDC, GKC
3. **Sintesi Logica** — RTL → gate-level, LEC, UPF, MMMC

### Physical Design
4. **Floorplanning** — Macro, IO, power planning, **Floorplan Exit**
5. **PDN** — Primary/Secondary PG, power switches, mesh, IR drop, EM
6. **Placement** — Global/detailed, optimization, **PRO Exit**
7. **Clock Tree Synthesis** — Clock tree vs mesh, skew, useful skew
8. **Routing** — Global/detailed, antenna, post-route optimization
9. **Layout & Finishing** — Metal fill, seal ring, ECO

### Signoff & Tapeout
10. **STA** — Static Timing Analysis, MMMC, OCV, SI-aware
11. **PV** — DRC, LVS, ERC, antenna, density
12. **Power Signoff** — IR drop static/dynamic, VCD vectors, EM
13. **Package & Bump Assignment** — Flip-chip, RDL, PKG co-design
14. **Tapeout** — **BTO**, **MTO**, **GKC**, GDSII, TOR

## Sezioni aggiuntive

- **Ricerca globale** — cerca fasi, glossario, celle e playbook dall’header
- **Progresso di studio** — fasi lette (IntersectionObserver), quiz, drill, best colloquio a tempo (localStorage)
- **Densità testo** — toggle pieno / compatto (nasconde saggi letteratura)
- **Diagrammi interattivi** — PDN, CTS, scan chain, setup/hold
- **Confronti affiancati** — NLDM/CCS, WNS/TNS, setup/hold, tree/mesh
- **Carte comandi EDA** — `report_timing`, IR, PV… con cosa guardare e trappole
- **War stories** — casi silicio: sintomo → causa → lezione
- **Cheat sheet stampabile** — formule operative + Print/PDF
- **Colloquio a tempo** — 10 minuti di flashcard nel Lab
- **Cross-link** — ogni fase punta a glossario, celle e fasi correlate
- **Laboratorio da colloquio** — Quiz, flashcard, **drill war-room**, calcolatori, esempi, playbook
- **Formule & Modelli** — KaTeX (setup/hold, FO4, logical effort, IR drop, Black's Eq, MTBF, antenna, …)
- **Senior Interview Prep** — Q&A per ogni fase
- **Checklist di Signoff** — Check di produzione per ogni milestone
- **Artefatti EDA** — File del flusso (.lib, .lef, .def, .spef, .upf, GDS/OASIS, …)
- **Stack metallico 7 nm** — M0→AP/RDL, pitch indicativi, preferred direction
- **Corner PVT / MMMC** — SS/TT/FF, temperature inversion, RC corners
- **Glossario Tecnico** — 100+ termini con definizioni estese e popup cliccabili
- **Glossario Celle Standard** — INV, NAND/NOR, MUX, XOR, SDFF, CLKBUF, TAP, ENDCAP, DLY, …

## Avvio locale

```bash
npm install
npm run build
npm start
```

Apri http://localhost:4317

> Il progetto usa **static export** (`output: "export"`). `npm start` serve la cartella `out/` — non usare `next start` in parallelo.

## GitHub & Cloud Agents

Per modificare il progetto anche con il PC spento (da telefono, tablet o un altro dispositivo):

1. **Repository GitHub** — il codice vive su GitHub come sorgente principale
2. **Cursor Cloud Agent** — avvii un agente da [cursor.com/agents](https://cursor.com/agents) collegato al repo GitHub; l'agente lavora nel cloud e fa push delle modifiche
3. **Preview** — ogni agent run espone un preview URL temporaneo

### Push su GitHub (prima volta)

```bash
# Crea un repo vuoto su github.com (es. rtl-to-gds2-flow), poi:
git remote add github https://github.com/TUO-USERNAME/rtl-to-gds2-flow.git
git push -u github main
```

### Avviare un Cloud Agent dal repo

1. Apri Cursor → **Agents** → **New Agent**
2. Seleziona il repository GitHub `rtl-to-gds2-flow`
3. Scrivi la modifica richiesta — l'agente committa e pusha su GitHub

### Deploy statico (opzionale)

Puoi pubblicare su **GitHub Pages** o **Vercel** collegando il repo — entrambi supportano Next.js static export.

## Stack

Next.js 16 · TypeScript · Tailwind CSS 4 · Framer Motion · KaTeX · Lucide React
