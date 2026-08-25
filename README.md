# RTL → GDSII — Physical Design Flow

Sito web interattivo che spiega l'intero procedimento di **physical design ad alto livello**, dal design RTL al file GDSII pronto per il tapeout.

## Contenuto

Il sito copre le 8 fasi principali del flusso EDA:

1. **Design RTL** — Register Transfer Level
2. **Sintesi Logica** — RTL → Gate-Level Netlist
3. **Floorplanning** — Definizione del layout del die
4. **Placement** — Posizionamento delle celle standard
5. **Clock Tree Synthesis** — Distribuzione del clock
6. **Routing** — Interconnessione fisica su layer metallici
7. **Verifica Fisica** — DRC, LVS, STA signoff
8. **Output GDSII** — Tapeout finale

Ogni fase include animazioni SVG interattive, descrizione dettagliata in italiano, input/output, tool EDA e concetti chiave.

## Requisiti

- Node.js 18+
- npm

## Avvio locale

```bash
npm install
npm run dev -- -p 4317
```

Apri [http://localhost:4317](http://localhost:4317) nel browser.

## Stack tecnologico

- **Next.js 16** (App Router)
- **TypeScript**
- **Tailwind CSS 4**
- **Framer Motion** — animazioni scroll-driven e transizioni
- **Lucide React** — icone

## Build produzione

```bash
npm run build
npm start -- -p 4317
```
