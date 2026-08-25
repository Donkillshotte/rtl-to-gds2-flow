# RTL → GDSII — Physical Design Flow

Guida professionale interattiva al flusso completo di **physical design** — dal RTL al tapeout GDSII.

## Contenuto (14 fasi)

### Front-End
1. **Design RTL** — Architettura, coding guidelines, DFT readiness
2. **Verifica RTL & Formal** — UVM, formal verification, lint, CDC, RDC, GKC
3. **Sintesi Logica** — RTL → gate-level, LEC, UPF, MMMC

### Physical Design
4. **Floorplanning** — Macro, IO, power planning, **Floorplan Exit**
5. **PDN** — Power Delivery Network, IR drop, EM budget
6. **Placement** — Global/detailed, optimization, **PRO Exit**
7. **Clock Tree Synthesis** — Skew, latency, useful skew
8. **Routing** — Global/detailed, antenna, post-route optimization
9. **Layout & Finishing** — Metal fill, seal ring, ECO

### Signoff & Tapeout
10. **STA** — Static Timing Analysis, MMMC, OCV, SI-aware
11. **PV** — DRC, LVS, ERC, Base DRC vs Metal DRC
12. **Power Signoff** — IR drop static/dynamic, electromigration
13. **Package & Bump Assignment** — Flip-chip, RDL, PKG co-design
14. **Tapeout** — **BTO**, **MTO**, **GKC**, GDSII, TOR

## Sezioni aggiuntive

- **Checklist di Signoff** — 50+ check di produzione per ogni milestone
- **Glossario Tecnico** — 35+ termini (GKC, PRO Exit, PDN, STA, PV, ecc.)

## Avvio locale

```bash
npm install
npm run build
npm start -- -p 4317
```

Apri http://localhost:4317

## Stack

Next.js 16 · TypeScript · Tailwind CSS 4 · Framer Motion · Lucide React
