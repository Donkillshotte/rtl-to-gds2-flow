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

- **Chip Evolution** — Canvas animation: cumulative chip build across all 14 phases
- **Formule & Modelli** — KaTeX-rendered formulas (setup/hold, IR drop, Black's Eq, MTBF, antenna ratio, …)
- **Senior Interview Prep** — Q&A per ogni fase
- **Checklist di Signoff** — Check di produzione per ogni milestone
- **Glossario Tecnico** — Termini del flusso PD
- **Glossario Celle Standard** — INV, BUF, AOI/OAI, CLKBUF, TAP, ENDCAP, GDHS, trunk, decap, power switch, …

## Avvio locale

```bash
npm install
npm run build
npm start -- -p 4317
```

Apri http://localhost:4317

## Stack

Next.js 16 · TypeScript · Tailwind CSS 4 · Framer Motion · KaTeX · Lucide React
