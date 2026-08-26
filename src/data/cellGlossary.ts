import { loc, type Localized } from "@/i18n/context";

export interface CellType {
  id: string;
  name: Localized;
  category: Localized;
  function: Localized;
  placement: Localized;
  whenUsed: Localized;
  technicalNotes: Localized<string[]>;
  relatedCells?: string[];
}

export const cellCategories = [
  loc("Logica Combinatoria", "Combinational Logic"),
  loc("Sequential & Scan", "Sequential & Scan"),
  loc("Clock & Buffer", "Clock & Buffer"),
  loc("Power & Ground", "Power & Ground"),
  loc("Low Power", "Low Power"),
  loc("Filler & Physical", "Filler & Physical"),
  loc("DFT & Test", "DFT & Test"),
];

export const cellGlossary: CellType[] = [
  {
    id: "inv",
    name: loc("INV — Inverter", "INV — Inverter"),
    category: loc("Logica Combinatoria", "Combinational Logic"),
    function: loc(
      "Inverte il livello logico secondo Y = ¬A. La struttura CMOS minima usa un PMOS di pull-up e un NMOS di pull-down, quindi introduce un solo stadio logico. Le versioni X1–X32 e HVT, SVT, LVT o ULVT permettono di scambiare capacità d'ingresso, velocità e leakage.",
      "It inverts the logic level according to Y = ¬A. The minimum CMOS structure uses one pull-up PMOS and one pull-down NMOS, so it introduces only one logic stage. X1–X32 and HVT, SVT, LVT, or ULVT versions trade input capacitance, speed, and leakage."
    ),
    placement: loc(
      "Può occupare qualsiasi sito legale di una row con orientamento compatibile con i rail VDD e VSS. Il placer deve lasciare accesso al pin A e al pin Y, soprattutto nelle varianti forti con geometrie più larghe. L'upsizing vicino al sink riduce la capacità del tratto pilotato, mentre una catena di inverter è preferibile per fanout molto elevato.",
      "It can occupy any legal row site with an orientation compatible with the VDD and VSS rails. Placement must preserve access to pins A and Y, especially for strong variants with wider geometry. Upsizing near the sink reduces driven-wire capacitance, while an inverter chain is preferable for very high fanout."
    ),
    whenUsed: loc(
      "Si usa per negazioni booleane, ripristino dello slew e decomposizione De Morgan durante la sintesi. L'ottimizzazione fisica lo inserisce o lo ridimensiona per correggere setup, max transition e max capacitance. Sulle reti di clock si deve scegliere CLKINV qualificato, non assumere che un INV dati abbia duty-cycle e variazione adeguati.",
      "It is used for Boolean inversion, slew restoration, and De Morgan decomposition during synthesis. Physical optimization inserts or resizes it to repair setup, maximum-transition, and maximum-capacitance violations. Clock nets require a qualified CLKINV rather than assuming a data inverter has adequate duty-cycle and variation behavior."
    ),
    technicalNotes: loc(
      [
        "Cin, Rout e archi A→Y dipendenti da slew e load sono caratterizzati nel file Liberty.",
        "Un drive X32 non è trentadue volte più veloce in ogni condizione: wire RC e slew d'ingresso possono dominare.",
        "HVT riduce il leakage ma rallenta; LVT e ULVT accelerano al costo di leakage statico maggiore.",
        "Rise e fall non perfettamente bilanciati possono accumulare distorsione su catene lunghe.",
        "Il pin access su M1/M2 e il numero di tracce della row possono limitare il beneficio dell'upsizing.",
        "Il derating OCV/AOCV/POCV va applicato agli archi di timing, non a un delay nominale isolato.",
      ],
      [
        "Cin, Rout, and slew/load-dependent A→Y arcs are characterized in Liberty.",
        "An X32 drive is not thirty-two times faster in every condition; wire RC and input slew can dominate.",
        "HVT reduces leakage but is slower; LVT and ULVT improve speed at higher static leakage.",
        "Imperfect rise/fall balance can accumulate duty distortion through long chains.",
        "M1/M2 pin access and row track count can limit the benefit of upsizing.",
        "OCV/AOCV/POCV derating applies to timing arcs, not to one isolated nominal delay.",
      ]
    ),
    relatedCells: ["buf", "clkinv"],
  },
  {
    id: "buf",
    name: loc("BUF — Buffer", "BUF — Buffer"),
    category: loc("Logica Combinatoria", "Combinational Logic"),
    function: loc(
      "Propaga il dato senza invertirlo, Y = A. Di solito contiene due inverter dimensionati per isolare il carico e rigenerare uno slew degradato. Le taglie X1–X32 offrono resistenza d'uscita progressivamente minore ma aumentano area, Cin e potenza.",
      "It propagates data without inversion, Y = A. It usually contains two sized inverters that isolate the load and restore degraded slew. X1–X32 sizes progressively lower output resistance while increasing area, Cin, and power."
    ),
    placement: loc(
      "Viene collocato in siti standard legali lungo il percorso della net, non necessariamente accanto al driver originale. Per una net lunga il buffering distribuito suddivide la RC del filo e richiede punti con buon accesso ai pin. Il tool evita regioni congestionate e sceglie orientamento e VT compatibili con la row e il dominio di alimentazione.",
      "It is placed on legal standard-cell sites along the net route, not necessarily beside the original driver. On a long net, distributed buffering breaks up wire RC and needs locations with good pin access. The tool avoids congested regions and chooses orientation and VT compatible with the row and power domain."
    ),
    whenUsed: loc(
      "È inserito per violazioni di max transition, max capacitance o fanout e per recuperare setup su interconnessioni lunghe. Può replicare un driver logico ad alto fanout quando la duplicazione è funzionalmente sicura. Il clock tree deve invece usare CLKBUF caratterizzati e una rete reset critica può richiedere regole dedicate.",
      "It is inserted for maximum-transition, maximum-capacitance, or fanout violations and to recover setup on long interconnect. It can support high-fanout driver replication when logic duplication is functionally safe. Clock trees instead require characterized CLKBUFs, and a critical reset network may need dedicated rules."
    ),
    technicalNotes: loc(
      [
        "Il dimensionamento ottimo considera slew in ingresso, capacità totale, RC estratta e corner PVT.",
        "Catene con rapporto di stage moderato sono migliori di un salto diretto X1→X32 per carichi enormi.",
        "Il buffering aggiunge potenza interna e switching, quindi non è un fix gratuito.",
        "Varianti HVT/SVT/LVT consentono recovery di leakage dopo la chiusura del timing.",
        "Buffer troppo ravvicinati sprecano area e possono peggiorare congestion e hold.",
        "I buffer dati non devono sostituire celle clock qualificate nei path CTS.",
      ],
      [
        "Optimal sizing considers input slew, total capacitance, extracted RC, and PVT corner.",
        "Chains with moderate stage effort outperform a direct X1→X32 jump for enormous loads.",
        "Buffering adds internal and switching power, so it is not a free repair.",
        "HVT/SVT/LVT variants permit leakage recovery after timing closure.",
        "Overly close buffers waste area and can worsen congestion and hold.",
        "Data buffers must not replace qualified clock cells in CTS paths.",
      ]
    ),
    relatedCells: ["inv", "clkbuf", "delay"],
  },
  {
    id: "and2",
    name: loc("AND2 — AND a 2 ingressi", "AND2 — 2-input AND"),
    category: loc("Logica Combinatoria", "Combinational Logic"),
    function: loc(
      "Calcola Y = A · B, quindi l'uscita vale uno solo quando entrambi gli ingressi valgono uno. Una realizzazione CMOS standard combina tipicamente un NAND2 e un inverter interno perché una rete AND diretta non è naturalmente invertente. Le versioni integrate riducono pin e interconnessioni rispetto a due celle separate e sono offerte in più drive e VT.",
      "It computes Y = A · B, so the output is high only when both inputs are high. A standard CMOS implementation typically combines a NAND2 with an internal inverter because a direct AND network is not naturally inverting. Integrated versions reduce pins and interconnect versus two separate cells and are offered in multiple drive and VT options."
    ),
    placement: loc(
      "La cella occupa una row standard e deve esporre accesso indipendente ai pin A e B. Il placer può permutare ingressi logicamente equivalenti per migliorare routing e timing, salvo differenze negli archi Liberty. Nei cluster di enable o decode occorre evitare hotspot M1 dovuti a molti pin vicini.",
      "The cell occupies a standard row and must expose independent access to pins A and B. Placement may permute logically equivalent inputs to improve routing and timing unless Liberty arcs differ. Dense enable or decode clusters need care to avoid M1 hotspots from many nearby pins."
    ),
    whenUsed: loc(
      "È usato per condizioni di enable, mascheramento dati e termini prodotto semplici. La sintesi può preferirlo a NAND2 più INV quando l'uscita non invertita è richiesta e la cella composta è più efficiente. Su path critici la scelta dipende dagli archi reali, non dall'equazione logica soltanto.",
      "It is used for enable conditions, data masking, and simple product terms. Synthesis may prefer it over NAND2 plus INV when a non-inverted output is required and the compound cell is more efficient. On critical paths, selection depends on actual timing arcs rather than the Boolean equation alone."
    ),
    technicalNotes: loc(
      [
        "L'implementazione NAND+INV contiene uno stack NMOS in serie nel primo stadio.",
        "Le varianti X1–X16 o X32 bilanciano capacità d'ingresso e forza d'uscita.",
        "Gli ingressi sono logicamente commutativi ma possono avere delay A→Y e B→Y diversi.",
        "Il mapper può assorbire l'inversione in una AOI/OAI e rimuovere completamente AND2.",
        "VT basso aiuta setup; VT alto è spesso preferito sui path non critici per leakage.",
      ],
      [
        "The NAND-plus-inverter implementation has a series NMOS stack in its first stage.",
        "X1–X16 or X32 variants trade input capacitance against output strength.",
        "Inputs are logically commutative but may have different A→Y and B→Y delays.",
        "Mapping can absorb the inversion into an AOI/OAI and remove AND2 entirely.",
        "Low VT helps setup; high VT is often preferred on noncritical paths for leakage.",
      ]
    ),
    relatedCells: ["nand2", "or2", "aoi"],
  },
  {
    id: "or2",
    name: loc("OR2 — OR a 2 ingressi", "OR2 — 2-input OR"),
    category: loc("Logica Combinatoria", "Combinational Logic"),
    function: loc(
      "Calcola Y = A + B, dove il simbolo più indica l'OR booleano. La topologia CMOS è normalmente un NOR2 seguito da un inverter, con PMOS in serie nel primo stadio. La cella integrata evita una net intermedia e offre caratterizzazione completa per drive e flavor VT.",
      "It computes Y = A + B, where plus denotes Boolean OR. The CMOS topology is normally a NOR2 followed by an inverter, with series PMOS in the first stage. The integrated cell removes an intermediate net and provides complete characterization across drive and VT flavors."
    ),
    placement: loc(
      "OR2 può essere posizionata in qualsiasi sito legale della row nel dominio corretto. L'accesso ai due ingressi è importante nei decoder e nelle reti di controllo ad alta densità. La permutazione A/B può ridurre wirelength, ma il tool deve rispettare eventuali differenze di timing tra i pin.",
      "OR2 can be placed at any legal row site in the correct power domain. Access to both inputs matters in dense decoders and control networks. Swapping A and B can reduce wirelength, but the tool must honor any pin timing differences."
    ),
    whenUsed: loc(
      "Serve a combinare richieste, interrupt, condizioni di errore e segnali di validità. La sintesi può scegliere NOR2 più inversione distribuita o una OAI quando ciò migliora area e timing. Per reset o altri net ad alto fanout occorre aggiungere una strategia di buffering, non affidarsi solo a una OR forte.",
      "It combines requests, interrupts, error conditions, and validity signals. Synthesis may choose NOR2 plus distributed inversion or an OAI when that improves area and timing. Reset and other high-fanout nets need a buffering strategy rather than relying on one strong OR."
    ),
    technicalNotes: loc(
      [
        "Lo stadio NOR interno ha PMOS in serie e può mostrare un arco di salita più debole.",
        "I modelli Liberty includono delay e transition separati per ogni ingresso e polarità.",
        "Taglie grandi migliorano Rout ma caricano maggiormente i driver A e B.",
        "LVT è utile sui path critici; HVT riduce leakage nelle reti di controllo lente.",
        "Una OAI può implementare più livelli logici con meno area e una sola inversione finale.",
      ],
      [
        "The internal NOR stage has series PMOS devices and may show a weaker rising arc.",
        "Liberty models contain separate delay and transition data for each input and polarity.",
        "Larger sizes improve Rout but load the A and B drivers more heavily.",
        "LVT helps critical paths; HVT reduces leakage in slow control networks.",
        "An OAI can implement more logic levels with less area and one final inversion.",
      ]
    ),
    relatedCells: ["nor2", "and2", "oai"],
  },
  {
    id: "nand2",
    name: loc("NAND2 — NAND a 2 ingressi", "NAND2 — 2-input NAND"),
    category: loc("Logica Combinatoria", "Combinational Logic"),
    function: loc(
      "Implementa Y = ¬(A · B). La rete pull-down CMOS usa due NMOS in serie, mentre il pull-up usa due PMOS in parallelo. Questa topologia compatta rende NAND2 una primitiva di sintesi molto efficiente, disponibile tipicamente da X1 fino a X16 o X32.",
      "It implements Y = ¬(A · B). The CMOS pull-down network uses two series NMOS devices, while the pull-up uses two parallel PMOS devices. This compact topology makes NAND2 a highly efficient synthesis primitive, commonly available from X1 through X16 or X32."
    ),
    placement: loc(
      "NAND2 è legale nelle normali row standard con i rail allineati. Gli ingressi equivalenti possono essere scambiati per migliorare pin access, ma la posizione nello stack può produrre archi non identici. Nei datapath densi il router deve evitare che i pin A, B e Y competano per la stessa traccia locale.",
      "NAND2 is legal in normal standard-cell rows with aligned rails. Equivalent inputs may be swapped for pin access, although stack position can produce nonidentical arcs. In dense datapaths, routing must keep A, B, and Y from competing for the same local track."
    ),
    whenUsed: loc(
      "È usato nella logica generale, nei decoder e nelle decomposizioni De Morgan. NAND2 seguito da INV realizza AND2, mentre reti di NAND possono implementare qualsiasi funzione booleana. Il mapper lo preferisce spesso quando riduce profondità, area o carico rispetto a porte più complesse.",
      "It is used in general logic, decoders, and De Morgan decompositions. NAND2 followed by INV realizes AND2, while NAND networks can implement any Boolean function. Mapping often prefers it when it reduces depth, area, or loading relative to more complex gates."
    ),
    technicalNotes: loc(
      [
        "Lo stack NMOS in serie aumenta la resistenza di pull-down rispetto a un inverter.",
        "Il dimensionamento dei dispositivi compensa in parte l'asimmetria rise/fall.",
        "A e B sono logicamente equivalenti ma gli archi Liberty possono differire per effetto dello stack.",
        "FO4 NAND2 è una metrica utile, ma il timing signoff usa slew, load e RC reali.",
        "NAND3 e NAND4 aumentano stack, area e difficoltà di pin access.",
        "Le varianti HVT/SVT/LVT consentono ottimizzazione multi-VT senza cambiare funzione.",
      ],
      [
        "The series NMOS stack raises pull-down resistance relative to an inverter.",
        "Device sizing partly compensates for rise/fall asymmetry.",
        "A and B are logically equivalent, but Liberty arcs may differ because of stack effects.",
        "NAND2 FO4 is a useful metric, but signoff uses actual slew, load, and RC.",
        "NAND3 and NAND4 increase stack depth, area, and pin-access difficulty.",
        "HVT/SVT/LVT variants enable multi-VT optimization without changing function.",
      ]
    ),
    relatedCells: ["and2", "nand3", "inv", "aoi"],
  },
  {
    id: "nor2",
    name: loc("NOR2 — NOR a 2 ingressi", "NOR2 — 2-input NOR"),
    category: loc("Logica Combinatoria", "Combinational Logic"),
    function: loc(
      "Implementa Y = ¬(A + B). La rete pull-up CMOS usa due PMOS in serie e il pull-down usa due NMOS in parallelo. Poiché la mobilità delle lacune è inferiore, il pull-up in serie rende spesso NOR2 più lenta o più larga di NAND2 a parità di drive.",
      "It implements Y = ¬(A + B). The CMOS pull-up network uses two series PMOS devices and the pull-down uses two parallel NMOS devices. Because hole mobility is lower, the series pull-up often makes NOR2 slower or wider than NAND2 at equal drive."
    ),
    placement: loc(
      "La cella si colloca in una row standard con orientamento legale e rail continui. I pin A e B possono essere permutati se gli archi e la topologia della libreria lo consentono. Su net lunghe bisogna limitare il carico perché la transizione di salita può essere il caso peggiore.",
      "The cell is placed in a standard row with legal orientation and continuous rails. Pins A and B may be swapped when library arcs and topology permit. Loading should be limited on long nets because the rising transition can be the worst case."
    ),
    whenUsed: loc(
      "NOR2 è comune in logica di controllo, reset locale e decoder attivi-bassi. NOR2 più INV realizza OR2, mentre una rete NOR è logicamente universale. La sintesi può sostituirla con OAI o NAND più inversioni quando il timing di pull-up è critico.",
      "NOR2 is common in control logic, local reset, and active-low decoders. NOR2 plus INV realizes OR2, while a NOR network is logically universal. Synthesis may replace it with an OAI or NAND-plus-inversion structure when pull-up timing is critical."
    ),
    technicalNotes: loc(
      [
        "Lo stack PMOS in serie domina spesso il delay low→high.",
        "Le taglie X1–X16 aumentano larghezza PMOS, area e capacità d'ingresso.",
        "Gli archi A→Y e B→Y devono essere letti dalla .lib al corner di signoff.",
        "NOR3 è raramente ideale su path veloci per lo stack PMOS più profondo.",
        "HVT è adatto a controlli non critici; LVT può recuperare setup con più leakage.",
        "Max transition può richiedere buffering anche se la funzione logica è corretta.",
      ],
      [
        "The series PMOS stack often dominates low-to-high delay.",
        "X1–X16 sizes increase PMOS width, area, and input capacitance.",
        "A→Y and B→Y arcs must be read from the .lib at the signoff corner.",
        "NOR3 is rarely ideal on fast paths because of its deeper PMOS stack.",
        "HVT suits noncritical controls; LVT can recover setup with more leakage.",
        "Maximum transition may require buffering even when logic is functionally correct.",
      ]
    ),
    relatedCells: ["or2", "nor3", "inv", "oai"],
  },
  {
    id: "nand3",
    name: loc("NAND3 — NAND a 3 ingressi", "NAND3 — 3-input NAND"),
    category: loc("Logica Combinatoria", "Combinational Logic"),
    function: loc(
      "Implementa Y = ¬(A · B · C). Il pull-down contiene tre NMOS in serie e il pull-up tre PMOS in parallelo. Rispetto a NAND2 comprime un livello logico, ma lo stack più profondo aumenta resistenza, sensibilità allo slew e dipendenza dal pin.",
      "It implements Y = ¬(A · B · C). Its pull-down has three series NMOS devices and its pull-up has three parallel PMOS devices. Compared with NAND2 it can collapse a logic level, but the deeper stack increases resistance, slew sensitivity, and pin dependence."
    ),
    placement: loc(
      "Occupa una cella standard più larga e presenta tre accessi d'ingresso ravvicinati. Il placer può usare pin swapping per assegnare il segnale più tardivo all'arco più favorevole se la libreria supporta la trasformazione. Nei cluster di decode va riservata capacità di routing locale sufficiente.",
      "It occupies a wider standard cell and exposes three closely spaced input accesses. Placement may use pin swapping to assign the latest signal to the most favorable arc when the library supports that transformation. Dense decode clusters need enough local routing capacity."
    ),
    whenUsed: loc(
      "È utile per decode a tre condizioni, enable congiunti e factoring logico che evita una NAND2 aggiuntiva. La sintesi la seleziona quando il livello risparmiato compensa il drive peggiore dello stack. Su path ad alto carico può essere migliore NAND2 seguita da una seconda porta o da un buffer.",
      "It is useful for three-condition decode, combined enables, and factoring that avoids another NAND2. Synthesis selects it when the saved logic level outweighs the stack's weaker drive. On heavily loaded paths, a NAND2 followed by another gate or buffer may be better."
    ),
    technicalNotes: loc(
      [
        "Tre NMOS in serie rendono la scarica più lenta e dipendente dal pattern d'ingresso.",
        "Il pin più vicino all'uscita o a massa può avere un arco caratterizzato diverso.",
        "X1–X8 sono comuni; drive maggiori dipendono dalla libreria e dal track height.",
        "Il pin access è più difficile di NAND2 e può provocare detour su M2.",
        "Multi-VT e upsizing vanno valutati contro leakage e capacità sui tre driver.",
      ],
      [
        "Three series NMOS devices make discharge slower and input-pattern dependent.",
        "The pin nearest the output or ground can have a differently characterized arc.",
        "X1–X8 are common; stronger drives depend on library and track height.",
        "Pin access is harder than NAND2 and may cause M2 detours.",
        "Multi-VT and upsizing must be weighed against leakage and loading on all three drivers.",
      ]
    ),
    relatedCells: ["nand2", "and2", "aoi"],
  },
  {
    id: "nor3",
    name: loc("NOR3 — NOR a 3 ingressi", "NOR3 — 3-input NOR"),
    category: loc("Logica Combinatoria", "Combinational Logic"),
    function: loc(
      "Implementa Y = ¬(A + B + C). Il pull-up usa tre PMOS in serie, mentre tre NMOS paralleli realizzano il pull-down. La porta riduce la profondità di un OR a tre ingressi ma ha una transizione di salita relativamente debole.",
      "It implements Y = ¬(A + B + C). Its pull-up uses three series PMOS devices, while three parallel NMOS devices form the pull-down. The gate reduces the depth of a three-input OR but has a relatively weak rising transition."
    ),
    placement: loc(
      "NOR3 richiede un sito standard abbastanza largo e accesso a quattro pin di segnale. È opportuno non ammassare molte NOR3 in una regione di controllo già congestionata. Pin swapping può migliorare wirelength o un arco critico soltanto se conservato correttamente da equivalence checking.",
      "NOR3 needs a sufficiently wide standard-cell site and access to four signal pins. Many NOR3 cells should not be packed into an already congested control region. Pin swapping can improve wirelength or a critical arc only when equivalence checking preserves it correctly."
    ),
    whenUsed: loc(
      "Si usa in decode attivo-basso, aggregazione di errori e controlli a tre condizioni. È vantaggiosa quando evita un livello aggiuntivo e il carico di uscita è moderato. Per timing stretto il mapper può preferire una struttura NAND/AOI con polarità ripianificate.",
      "It is used in active-low decode, error aggregation, and three-condition control. It is beneficial when it removes another level and the output load is moderate. For tight timing, mapping may prefer a NAND/AOI structure with reworked polarity."
    ),
    technicalNotes: loc(
      [
        "Lo stack di tre PMOS penalizza soprattutto l'arco low→high.",
        "Il sizing per drive elevato aumenta rapidamente area e Cin.",
        "Gli ingressi possono avere archi diversi nonostante la simmetria booleana.",
        "Il controllo di max transition è essenziale prima di accettarla su una net lunga.",
        "NOR2 più logica fattorizzata può offrire migliore power-delay su alcuni corner.",
      ],
      [
        "The three-PMOS stack primarily penalizes the low-to-high arc.",
        "Sizing for high drive rapidly increases area and Cin.",
        "Inputs can have different arcs despite Boolean symmetry.",
        "Maximum-transition checking is essential before accepting it on a long net.",
        "NOR2 plus factored logic can offer better power-delay behavior at some corners.",
      ]
    ),
    relatedCells: ["nor2", "or2", "oai"],
  },
  {
    id: "xor2",
    name: loc("XOR2 — XOR a 2 ingressi", "XOR2 — 2-input XOR"),
    category: loc("Logica Combinatoria", "Combinational Logic"),
    function: loc(
      "Calcola Y = A ⊕ B = A·¬B + ¬A·B. L'uscita vale uno quando gli ingressi differiscono, proprietà usata per somma, parità e confronto. L'implementazione può essere CMOS statica o a transmission gate, ma la cella qualificata garantisce livelli full-swing e archi caratterizzati.",
      "It computes Y = A ⊕ B = A·¬B + ¬A·B. The output is high when the inputs differ, a property used in addition, parity, and comparison. Implementation may use static CMOS or transmission gates, but a qualified cell guarantees full-swing levels and characterized arcs."
    ),
    placement: loc(
      "XOR2 è più larga e pin-dense di una porta a due ingressi semplice. Nei datapath viene allineata per bit-slice così da accorciare reti di somma e carry. Il router deve preservare accesso ad A, B e Y senza creare colli di bottiglia sulle tracce locali.",
      "XOR2 is wider and more pin-dense than a simple two-input gate. In datapaths it is aligned by bit slice to shorten sum and carry nets. Routing must preserve access to A, B, and Y without creating local-track bottlenecks."
    ),
    whenUsed: loc(
      "È usata in half/full adder, generatori di parità, CRC, ECC, comparatori e crittografia. La sintesi può mapparla in una cella dedicata per ridurre livelli rispetto a una rete AND/OR. Su un carry path critico si confronta con FA, AOI/OAI o strutture prefix caratterizzate.",
      "It is used in half/full adders, parity generators, CRC, ECC, comparators, and cryptography. Synthesis can map it to a dedicated cell to reduce depth versus an AND/OR network. On a critical carry path it is compared with characterized FA, AOI/OAI, or prefix structures."
    ),
    technicalNotes: loc(
      [
        "Le versioni pass-transistor non qualificate rischiano threshold drop; la libreria deve garantire full swing.",
        "A e B sono commutativi logicamente ma gli archi di timing possono essere diversi.",
        "La glitch power può essere significativa quando gli ingressi arrivano in tempi diversi.",
        "Drive X1–X8 è comune; drive superiori aumentano molto area e capacità.",
        "XOR2 più AND2 realizza un half adder, ma HA dedicata può condividere transistor.",
        "Pin access e congestion spesso limitano il packing in datapath molto densi.",
      ],
      [
        "Unqualified pass-transistor versions risk threshold drop; the library must guarantee full swing.",
        "A and B are logically commutative, but their timing arcs may differ.",
        "Glitch power can be significant when inputs arrive at different times.",
        "X1–X8 drive is common; stronger drives greatly increase area and capacitance.",
        "XOR2 plus AND2 forms a half adder, but a dedicated HA can share devices.",
        "Pin access and congestion often limit packing in very dense datapaths.",
      ]
    ),
    relatedCells: ["xnor2", "ha", "fa"],
  },
  {
    id: "xnor2",
    name: loc("XNOR2 — XNOR a 2 ingressi", "XNOR2 — 2-input XNOR"),
    category: loc("Logica Combinatoria", "Combinational Logic"),
    function: loc(
      "Calcola Y = ¬(A ⊕ B) = A·B + ¬A·¬B. L'uscita vale uno quando A e B sono uguali, quindi la porta è un comparatore di uguaglianza a un bit. Una cella XNOR dedicata può evitare l'inverter esterno richiesto da XOR2 e ridurre la profondità.",
      "It computes Y = ¬(A ⊕ B) = A·B + ¬A·¬B. The output is high when A and B match, making the gate a one-bit equality comparator. A dedicated XNOR cell can remove the external inverter required after XOR2 and reduce logic depth."
    ),
    placement: loc(
      "Come XOR2, è una cella relativamente larga con tre pin di segnale che richiedono buon accesso. Nei comparatori multi-bit conviene disporre le XNOR per bit-slice e avvicinarle all'albero di riduzione. Un placement troppo compatto può causare detour e vanificare il guadagno della cella dedicata.",
      "Like XOR2, it is a relatively wide cell with three signal pins needing good access. In multi-bit comparators, XNOR cells should be organized by bit slice near the reduction tree. Overly compact placement can cause detours and erase the dedicated cell's benefit."
    ),
    whenUsed: loc(
      "È usata in comparatori, tag match, controllo di parità e logica di equivalenza. La sintesi la sceglie quando la polarità di uguaglianza è consumata direttamente. Per confronti larghi deve essere combinata con AND/AOI bilanciati invece di una lunga catena seriale.",
      "It is used in comparators, tag matching, parity control, and equivalence logic. Synthesis selects it when equality polarity is consumed directly. Wide comparisons should combine it with balanced AND/AOI reduction rather than a long serial chain."
    ),
    technicalNotes: loc(
      [
        "Una XNOR dedicata evita XOR2+INV ma non è presente in tutte le librerie minime.",
        "La funzione simmetrica consente pin swap se gli archi Liberty lo permettono.",
        "Arrivi disallineati generano glitch e potenza dinamica nel comparatore.",
        "Le varianti multi-VT seguono il consueto trade-off speed/leakage.",
        "Per equality larga, fanout e depth dell'albero di AND dominano spesso il timing.",
      ],
      [
        "A dedicated XNOR avoids XOR2 plus INV but is absent from some minimal libraries.",
        "The symmetric function permits pin swapping when Liberty arcs allow it.",
        "Misaligned arrivals generate glitches and dynamic power in the comparator.",
        "Multi-VT variants follow the usual speed-versus-leakage trade-off.",
        "For wide equality, AND-tree fanout and depth often dominate timing.",
      ]
    ),
    relatedCells: ["xor2", "and2", "aoi22"],
  },
  {
    id: "aoi",
    name: loc("AOI — And-Or-Invert", "AOI — And-Or-Invert"),
    category: loc("Logica Combinatoria", "Combinational Logic"),
    function: loc(
      "Una AOI implementa Y = ¬((termine AND 1) + (termine AND 2) + …), per esempio AOI21 realizza ¬(A·B + C). La rete CMOS combina direttamente i termini prodotto nel pull-down e la rete duale nel pull-up. Un solo stadio complesso sostituisce spesso più AND, OR e INV, riducendo nodi interni e profondità.",
      "An AOI implements Y = ¬((AND term 1) + (AND term 2) + …); for example, AOI21 realizes ¬(A·B + C). Its CMOS network combines product terms directly in the pull-down and uses the dual structure in the pull-up. One complex stage often replaces several AND, OR, and INV cells, reducing internal nodes and depth."
    ),
    placement: loc(
      "AOI21, AOI211 e varianti più grandi occupano row standard ma hanno molti pin ravvicinati. Il placer deve favorire accesso M1/M2 e può permutare ingressi solo entro gruppi booleanamente equivalenti. In logica densa una riduzione di area logica può comunque aumentare congestion se tutti i pin arrivano dallo stesso lato.",
      "AOI21, AOI211, and larger variants occupy standard rows but have many closely spaced pins. Placement must favor M1/M2 access and may swap inputs only within Boolean-equivalent groups. In dense logic, lower cell area can still increase congestion when all pins approach from one side."
    ),
    whenUsed: loc(
      "La sintesi la usa per factoring di mux, decode, carry e logica di controllo. È particolarmente efficace quando l'uscita invertita viene consumata direttamente o quando l'inversione può essere spinta attraverso lo stadio successivo. La scelta rispetto a porte semplici deve considerare archi pin-specifici, load, slew e routability.",
      "Synthesis uses it for factoring mux, decode, carry, and control logic. It is especially effective when the inverted output is consumed directly or inversion can be pushed through the next stage. Selection versus simple gates must consider pin-specific arcs, load, slew, and routability."
    ),
    technicalNotes: loc(
      [
        "La sigla AOIxyz indica le cardinalità dei gruppi AND che alimentano l'OR.",
        "Stack NMOS più profondi possono penalizzare alcuni archi anche se si elimina un livello.",
        "Gli ingressi sono scambiabili solo nello stesso gruppo prodotto, non tra gruppi arbitrari.",
        "Liberty caratterizza ogni related_pin e ogni polarità di transizione separatamente.",
        "Pin density elevata può richiedere spreading o celle a maggior track height.",
        "Varianti X1–X8 e HVT/SVT/LVT consentono ottimizzazione PPA dopo il mapping.",
      ],
      [
        "The AOIxyz suffix gives the input count of each AND group feeding the OR.",
        "Deeper NMOS stacks can penalize some arcs even when a logic level is removed.",
        "Inputs may be swapped only within the same product group, not across arbitrary groups.",
        "Liberty characterizes each related_pin and transition polarity separately.",
        "High pin density can require spreading or taller-track cells.",
        "X1–X8 and HVT/SVT/LVT variants enable PPA optimization after mapping.",
      ]
    ),
    relatedCells: ["aoi22", "oai", "nand2"],
  },
  {
    id: "aoi22",
    name: loc("AOI22 — And-Or-Invert 2-2", "AOI22 — 2-2 And-Or-Invert"),
    category: loc("Logica Combinatoria", "Combinational Logic"),
    function: loc(
      "Implementa precisamente Y = ¬(A1·A2 + B1·B2). Il pull-down CMOS contiene due stack NMOS da due dispositivi collegati in parallelo, con rete PMOS duale per il pull-up. La cella fonde due AND, un OR e l'inversione finale senza esporre nodi intermedi.",
      "It precisely implements Y = ¬(A1·A2 + B1·B2). The CMOS pull-down has two parallel branches, each containing a two-device NMOS stack, with the dual PMOS pull-up network. The cell fuses two ANDs, one OR, and the final inversion without exposing intermediate nodes."
    ),
    placement: loc(
      "AOI22 ha quattro ingressi e un'uscita in una footprint relativamente compatta, quindi il pin access è un vincolo primario. Il placer può scambiare A1/A2, B1/B2 e, se consentito, i due gruppi completi per accorciare le connessioni. In datapath regolari conviene allinearla con i bit che producono i due termini.",
      "AOI22 places four inputs and one output in a relatively compact footprint, making pin access a primary constraint. Placement may swap A1/A2, B1/B2, and, when allowed, the two complete groups to shorten connections. In regular datapaths it should align with the bits producing the two terms."
    ),
    whenUsed: loc(
      "È comune in carry logic, comparatori, mux fattorizzati e decoder. La sintesi la seleziona quando entrambi i termini prodotto sono disponibili e l'uscita negata è utile. Se uno degli ingressi arriva molto tardi, una decomposizione diversa può offrire un arco più favorevole.",
      "It is common in carry logic, comparators, factored muxes, and decoders. Synthesis selects it when both product terms are available and the inverted output is useful. If one input arrives much later, a different decomposition may provide a more favorable arc."
    ),
    technicalNotes: loc(
      [
        "L'equazione è AOI22: ¬(A1A2 + B1B2), non una generica porta a quattro ingressi.",
        "Gli stack NMOS sono profondi due, mentre la rete PMOS duale influenza gli archi di salita.",
        "Solo i pin nello stesso termine AND sono sempre commutativi.",
        "Cin su quattro driver e pin density devono essere inclusi nel confronto PPA.",
        "Drive e flavor VT disponibili dipendono dal track architecture della libreria.",
        "Il routing locale può annullare il vantaggio di delay se richiede molti detour.",
      ],
      [
        "The equation is AOI22: ¬(A1A2 + B1B2), not a generic four-input gate.",
        "NMOS stacks are two devices deep, while the dual PMOS network affects rising arcs.",
        "Only pins within the same AND term are always commutative.",
        "Cin on four drivers and pin density must be included in PPA comparison.",
        "Available drive and VT flavors depend on the library's track architecture.",
        "Local routing can erase the delay benefit if it requires many detours.",
      ]
    ),
    relatedCells: ["aoi", "oai22", "fa"],
  },
  {
    id: "oai",
    name: loc("OAI — Or-And-Invert", "OAI — Or-And-Invert"),
    category: loc("Logica Combinatoria", "Combinational Logic"),
    function: loc(
      "Una OAI implementa Y = ¬((termine OR 1) · (termine OR 2) · …), per esempio OAI21 realizza ¬((A+B)·C). È il duale CMOS della famiglia AOI e integra OR, AND e inversione in una rete complessa. La fusione riduce nodi interni, capacità e livelli rispetto alla composizione di porte elementari.",
      "An OAI implements Y = ¬((OR term 1) · (OR term 2) · …); for example, OAI21 realizes ¬((A+B)·C). It is the CMOS dual of the AOI family and integrates OR, AND, and inversion in one complex network. Fusion reduces internal nodes, capacitance, and depth versus composing elementary gates."
    ),
    placement: loc(
      "Le varianti OAI21, OAI211 e OAI222 sono standard-cell legali ma presentano alta densità di pin. Gli ingressi possono essere scambiati solo all'interno dei gruppi OR equivalenti secondo la funzione e la .lib. Placement e routing devono considerare i detour locali prima di preferire automaticamente la footprint più piccola.",
      "OAI21, OAI211, and OAI222 variants are legal standard cells but have high pin density. Inputs may be swapped only within equivalent OR groups according to function and the .lib. Placement and routing must account for local detours before automatically preferring the smallest footprint."
    ),
    whenUsed: loc(
      "È usata in control logic, decode, carry e trasformazioni De Morgan. Il mapper la preferisce quando può assorbire un livello OR-AND e consegnare direttamente la polarità invertita. Su un path critico occorre confrontare ogni arco input-output, non usare una regola generale AOI contro OAI.",
      "It is used in control logic, decode, carry, and De Morgan transformations. Mapping prefers it when it can absorb an OR-AND level and directly deliver the inverted polarity. On a critical path, every input-output arc must be compared rather than applying a blanket AOI-versus-OAI rule."
    ),
    technicalNotes: loc(
      [
        "La nomenclatura OAIxyz indica le cardinalità dei gruppi OR prima dell'AND.",
        "La rete transistor duale crea archi dipendenti dal pin e dal pattern degli altri ingressi.",
        "Pin swapping è legale solo entro i gruppi dichiarati equivalenti.",
        "Celle complesse riducono glitch interni ma possono caricare più pesantemente gli ingressi.",
        "X1–X8 e HVT/SVT/LVT sono comuni, ma la disponibilità è library-specific.",
        "Congestion e accessibilità M1/M2 fanno parte della decisione di mapping fisico.",
      ],
      [
        "The OAIxyz suffix gives the cardinality of OR groups before the AND.",
        "The dual transistor network creates pin- and input-pattern-dependent arcs.",
        "Pin swapping is legal only within groups declared equivalent.",
        "Complex cells reduce internal glitches but can load inputs more heavily.",
        "X1–X8 and HVT/SVT/LVT are common, but availability is library-specific.",
        "Congestion and M1/M2 accessibility are part of physical mapping decisions.",
      ]
    ),
    relatedCells: ["oai22", "aoi", "nor2"],
  },
  {
    id: "oai22",
    name: loc("OAI22 — Or-And-Invert 2-2", "OAI22 — 2-2 Or-And-Invert"),
    category: loc("Logica Combinatoria", "Combinational Logic"),
    function: loc(
      "Implementa precisamente Y = ¬((A1+A2)·(B1+B2)). La rete pull-down realizza il prodotto dei due termini OR e la rete pull-up è il suo duale. Integra due OR, un AND e l'inversione finale in una singola cella caratterizzata.",
      "It precisely implements Y = ¬((A1+A2)·(B1+B2)). The pull-down network realizes the product of the two OR terms and the pull-up is its dual. It integrates two ORs, one AND, and final inversion in one characterized cell."
    ),
    placement: loc(
      "Quattro pin d'ingresso rendono OAI22 sensibile all'accesso e alla direzione di arrivo delle net. Il placer può permutare i pin dentro ciascun gruppo e talvolta scambiare i gruppi completi. Spreading o celle a track height maggiore possono essere necessari in zone di controllo dense.",
      "Four input pins make OAI22 sensitive to access and net approach direction. Placement may permute pins within each group and can sometimes exchange the complete groups. Spreading or taller-track cells may be necessary in dense control regions."
    ),
    whenUsed: loc(
      "È utile per logica di selezione, carry, valid/ready e forme già fattorizzate come prodotto di somme. Evita più livelli quando l'uscita attiva-bassa è quella richiesta. Se il carico è elevato, una decomposizione con stadio di buffer può chiudere meglio transition e setup.",
      "It is useful for selection, carry, valid/ready logic, and forms already factored as a product of sums. It removes levels when an active-low output is required. With heavy load, a decomposition that includes a buffer stage may close transition and setup more effectively."
    ),
    technicalNotes: loc(
      [
        "L'equazione OAI22 conserva due gruppi OR distinti e non consente swap arbitrari dei quattro pin.",
        "Gli archi dipendono dalla posizione transistor e dallo stato non-unate degli altri ingressi.",
        "La capacità dei quattro ingressi può spostare il collo di bottiglia allo stadio precedente.",
        "Il mapper fisico deve stimare RC e congestion, non soltanto area di libreria.",
        "Flavor LVT accelera gli archi critici ma aumenta leakage della cella complessa.",
        "L'uso in carry logic richiede confronto con FA e AOI22 al corner peggiore.",
      ],
      [
        "The OAI22 equation preserves two distinct OR groups and forbids arbitrary four-pin swapping.",
        "Arcs depend on transistor position and the non-unate state of other inputs.",
        "Four input capacitances can move the bottleneck into the preceding stage.",
        "Physical mapping must estimate RC and congestion, not only library area.",
        "LVT flavor speeds critical arcs but raises leakage in the complex cell.",
        "Use in carry logic requires comparison with FA and AOI22 at the worst corner.",
      ]
    ),
    relatedCells: ["oai", "aoi22", "fa"],
  },
  {
    id: "mux2",
    name: loc("MUX2 — Multiplexer 2:1", "MUX2 — 2:1 Multiplexer"),
    category: loc("Logica Combinatoria", "Combinational Logic"),
    function: loc(
      "Seleziona un dato secondo Y = ¬S·D0 + S·D1, equivalente a Y = S ? D1 : D0. Può usare transmission gate complementari o una rete AOI/OAI statica. La cella dedicata caratterizza separatamente gli archi D0, D1 e S e garantisce livelli logici validi.",
      "It selects data according to Y = ¬S·D0 + S·D1, equivalent to Y = S ? D1 : D0. It may use complementary transmission gates or a static AOI/OAI network. The dedicated cell separately characterizes D0, D1, and S arcs and guarantees valid logic levels."
    ),
    placement: loc(
      "MUX2 presenta tre ingressi e un'uscita, perciò cluster di mux su bus possono saturare le tracce locali. L'allineamento per bit-slice e un moderato spreading riducono incroci fra D0, D1 e select. Un mux dati non deve essere collocato come sostituto di una CLKMUX sulla rete di clock.",
      "MUX2 exposes three inputs and one output, so bus-mux clusters can saturate local tracks. Bit-slice alignment and moderate spreading reduce crossings among D0, D1, and select. A data mux must not be placed as a substitute for CLKMUX on a clock network."
    ),
    whenUsed: loc(
      "È usato per selezione datapath, bypass, enable sincroni e condivisione di risorse. Il mux scan è normalmente integrato in SDFF e non richiede un MUX2 discreto. La selezione di clock runtime richiede invece una cella glitch-free con protocollo di commutazione definito.",
      "It is used for datapath selection, bypassing, synchronous enables, and resource sharing. The scan mux is normally integrated into an SDFF and does not require a discrete MUX2. Runtime clock selection instead requires a glitch-free cell with a defined switching protocol."
    ),
    technicalNotes: loc(
      [
        "L'arco S→Y è spesso più lento dell'arco dati e può dominare il timing.",
        "D0 e D1 possono avere archi asimmetrici per la topologia transistor interna.",
        "MUX4 può essere una cella dedicata o un albero bilanciato di MUX2.",
        "Arrivi disallineati su dati e select possono produrre glitch e switching power.",
        "Pin density richiede attenzione a congestion e accesso M1/M2.",
        "Non usare MUX2 dati sul clock: può generare runt pulse e duty-cycle distortion.",
      ],
      [
        "The S→Y arc is often slower than a data arc and can dominate timing.",
        "D0 and D1 may have asymmetric arcs because of internal transistor topology.",
        "MUX4 may be dedicated or built as a balanced MUX2 tree.",
        "Misaligned data and select arrivals can produce glitches and switching power.",
        "Pin density requires attention to congestion and M1/M2 access.",
        "Do not use a data MUX2 on clocks; it can create runt pulses and duty-cycle distortion.",
      ]
    ),
    relatedCells: ["sdff", "clkmux", "aoi22"],
  },
  {
    id: "ha",
    name: loc("HA — Half Adder", "HA — Half Adder"),
    category: loc("Logica Combinatoria", "Combinational Logic"),
    function: loc(
      "Somma due bit senza carry-in e produce SUM = A ⊕ B e COUT = A · B. Una HA dedicata può condividere dispositivi o nodi interni rispetto a XOR2 e AND2 separate. Le due uscite hanno archi e carichi distinti che la libreria caratterizza per slew e capacità.",
      "It adds two bits without carry-in and produces SUM = A ⊕ B and COUT = A · B. A dedicated HA can share devices or internal nodes versus separate XOR2 and AND2 cells. Its two outputs have distinct arcs and loads characterized by the library for slew and capacitance."
    ),
    placement: loc(
      "La HA viene allineata con il bit-slice dell'adder per minimizzare le connessioni a SUM e COUT. I cinque accessi di segnale complessivi possono rendere la cella pin-dense, quindi non va compressa senza analisi di routing. COUT dovrebbe essere orientato verso lo stadio carry successivo o verso la rete di riduzione.",
      "The HA is aligned with its adder bit slice to minimize SUM and COUT connections. Its five total signal accesses can make it pin-dense, so it should not be packed without routing analysis. COUT should face the next carry stage or reduction network."
    ),
    whenUsed: loc(
      "È usata nel bit meno significativo di ripple adder senza carry-in e nei primi livelli di compressor tree. Compare anche in popcount, moltiplicatori e riduzioni multi-operando. Se la libreria non offre HA, la sintesi usa XOR2 più AND2 mantenendo la stessa funzione.",
      "It is used at the least-significant bit of a ripple adder without carry-in and in early compressor-tree levels. It also appears in population count, multipliers, and multi-operand reduction. If the library lacks HA, synthesis uses XOR2 plus AND2 with the same function."
    ),
    technicalNotes: loc(
      [
        "SUM è un arco XOR, mentre COUT è un arco AND e ha caratteristiche diverse.",
        "Le due uscite richiedono max-capacitance e max-transition check indipendenti.",
        "Una HA dedicata può ridurre area e power ma aumentare la complessità di pin access.",
        "Drive e VT devono essere scelti sul path più critico fra SUM e COUT.",
        "Nel compressor tree il placement deve minimizzare la distanza verso FA e HA del livello successivo.",
        "Equivalence checking deve preservare entrambe le uscite durante remapping ed ECO.",
      ],
      [
        "SUM is an XOR arc, while COUT is an AND arc with different characteristics.",
        "The two outputs need independent maximum-capacitance and maximum-transition checks.",
        "A dedicated HA can reduce area and power while increasing pin-access complexity.",
        "Drive and VT must be selected for the more critical of SUM and COUT.",
        "In compressor trees, placement should minimize distance to next-level FA and HA cells.",
        "Equivalence checking must preserve both outputs through remapping and ECO.",
      ]
    ),
    relatedCells: ["fa", "xor2", "and2"],
  },
  {
    id: "fa",
    name: loc("FA — Full Adder", "FA — Full Adder"),
    category: loc("Logica Combinatoria", "Combinational Logic"),
    function: loc(
      "Somma A, B e CIN producendo SUM = A ⊕ B ⊕ CIN e COUT = A·B + CIN·(A ⊕ B). La cella dedicata ottimizza congiuntamente i percorsi di somma e carry rispetto a una rete di porte discrete. L'arco CIN→COUT è spesso progettato come percorso carry rapido.",
      "It adds A, B, and CIN, producing SUM = A ⊕ B ⊕ CIN and COUT = A·B + CIN·(A ⊕ B). The dedicated cell jointly optimizes sum and carry paths versus a network of discrete gates. The CIN→COUT arc is often designed as a fast carry path."
    ),
    placement: loc(
      "Le FA sono normalmente allineate per bit-slice con COUT vicino al CIN del bit successivo. In ripple adder la wirelength della carry chain deve essere minima e priva di detour. In prefix o compressor tree il placer segue la topologia logica e lascia accesso ai numerosi pin e alle due uscite.",
      "FAs are normally aligned by bit slice with COUT close to the next bit's CIN. In ripple adders, carry-chain wirelength must be minimal and free of detours. In prefix or compressor trees, placement follows logic topology and preserves access to the many pins and two outputs."
    ),
    whenUsed: loc(
      "È usata in ALU, address generation, accumulatori, moltiplicatori, popcount e compressor tree. La sintesi aritmetica la mappa quando una cella FA offre PPA migliore di XOR/AOI discreti. Per addizioni larghe, architetture carry-lookahead o prefix possono sostituire una lunga catena di FA.",
      "It is used in ALUs, address generation, accumulators, multipliers, population count, and compressor trees. Arithmetic synthesis maps it when an FA cell offers better PPA than discrete XOR/AOI logic. For wide additions, carry-lookahead or prefix architectures may replace a long FA chain."
    ),
    technicalNotes: loc(
      [
        "Gli archi A/B/CIN→SUM e A/B/CIN→COUT sono caratterizzati separatamente.",
        "Il path carry può determinare il WNS di un ripple adder.",
        "SUM e COUT hanno limiti di load e transition indipendenti.",
        "Una footprint pin-dense richiede bit-slice placement e routing disciplinato.",
        "X1–X4 è comune; drive più forti dipendono dall'offerta datapath della libreria.",
        "Prefix adder usa spesso AOI/OAI per generate/propagate invece di sole FA atomiche.",
      ],
      [
        "A/B/CIN→SUM and A/B/CIN→COUT arcs are characterized separately.",
        "The carry path can determine a ripple adder's WNS.",
        "SUM and COUT have independent load and transition limits.",
        "A pin-dense footprint requires disciplined bit-slice placement and routing.",
        "X1–X4 is common; stronger drives depend on the library's datapath offering.",
        "Prefix adders often use AOI/OAI for generate/propagate rather than only atomic FAs.",
      ]
    ),
    relatedCells: ["ha", "xor2", "aoi22", "oai22"],
  },
  {
    id: "dff",
    name: loc("DFF — D Flip-Flop", "DFF — D Flip-Flop"),
    category: loc("Sequential & Scan", "Sequential & Scan"),
    function: loc(
      "Campiona D sul fronte attivo del clock e mantiene Q fino al fronte successivo, cioè Q(t+) = D al posedge CLK per la variante positiva. Internamente usa latch master/slave o una topologia pulse-triggered qualificata. Varianti con reset, set, enable, QN e diversi drive implementano la stessa memoria di un bit con archi aggiuntivi.",
      "It samples D on the active clock edge and holds Q until the next edge, meaning Q(t+) = D at posedge CLK for a positive-edge variant. Internally it uses master/slave latches or a qualified pulse-triggered topology. Reset, set, enable, QN, and different-drive variants implement the same one-bit storage with additional arcs."
    ),
    placement: loc(
      "Il DFF occupa una row standard e diventa un sink del clock tree. Il placement deve bilanciare prossimità alla logica dati, clustering clock e accesso ai pin D, CLK e Q. Celle troppo dense sotto un ramo CTS possono creare congestion e impedire buffering o hold repair locale.",
      "A DFF occupies a standard row and becomes a clock-tree sink. Placement must balance proximity to data logic, clock clustering, and access to D, CLK, and Q. Cells packed too densely under a CTS branch can create congestion and block local buffering or hold repair."
    ),
    whenUsed: loc(
      "È l'elemento base per stato sincrono, pipeline, contatori e registri di controllo. I DFF non-scan sono adatti a prototipi o registri esplicitamente esclusi dalla scan, ma la produzione usa spesso SDFF per la copertura ATPG. Varianti retention sono richieste quando lo stato deve sopravvivere allo spegnimento di un dominio.",
      "It is the basic element for synchronous state, pipelines, counters, and control registers. Non-scan DFFs suit prototypes or explicitly scan-excluded registers, while production commonly uses SDFFs for ATPG coverage. Retention variants are required when state must survive power-domain shutdown."
    ),
    technicalNotes: loc(
      [
        "Setup impone che D sia stabile prima del clock; hold impone stabilità dopo il fronte.",
        "Clock-to-Q dipende da slew del clock, load di Q, PVT e derating.",
        "Recovery e removal si applicano a reset o set asincroni.",
        "Drive Q X1–X8 e flavor HVT/SVT/LVT bilanciano timing, power e leakage.",
        "Il pin clock ha potenza interna elevata e commuta a ogni ciclo anche se D non cambia.",
        "Il min-pulse-width del clock è un vincolo Liberty distinto da setup e hold.",
      ],
      [
        "Setup requires D stability before the clock; hold requires stability after the edge.",
        "Clock-to-Q depends on clock slew, Q load, PVT, and derating.",
        "Recovery and removal apply to asynchronous reset or set.",
        "X1–X8 Q drive and HVT/SVT/LVT flavors trade timing, power, and leakage.",
        "The clock pin has high internal power and toggles every cycle even when D does not.",
        "Clock minimum pulse width is a Liberty constraint separate from setup and hold.",
      ]
    ),
    relatedCells: ["sdff", "latch", "retention_ff"],
  },
  {
    id: "retention_ff",
    name: loc("Retention FF — Flip-Flop di ritenzione", "Retention FF — Retention Flip-Flop"),
    category: loc("Low Power", "Low Power"),
    function: loc(
      "Memorizza il normale stato D/Q e lo salva in un latch alimentato da una supply always-on prima dello spegnimento del dominio. Durante power-down il nodo principale può perdere alimentazione, mentre il valore retained resta valido. Al ripristino, un segnale RESTORE ricopia lo stato salvato nel flip-flop funzionale.",
      "It stores normal D/Q state and saves it into an always-on-supplied latch before domain shutdown. During power-down the main storage node may lose power while the retained value remains valid. On power restoration, a RESTORE control copies the saved state back into the functional flip-flop."
    ),
    placement: loc(
      "Deve essere collocato nel dominio switched ma con accesso sia al rail commutato sia alla supply retention always-on definita dal LEF/UPF. Il placer rispetta voltage area, secondary power pins e orientamenti ammessi. La distribuzione SAVE/RESTORE e del rail always-on richiede routing robusto e capacità IR adeguata.",
      "It must be placed in the switched domain while accessing both the switched rail and the always-on retention supply defined by LEF/UPF. Placement honors the voltage area, secondary power pins, and legal orientations. SAVE/RESTORE and always-on-rail distribution need robust routing and adequate IR capacity."
    ),
    whenUsed: loc(
      "È usato solo per registri architetturali che devono conservare stato attraverso power gating. La strategia UPF identifica gli elementi retained, le supply e la sequenza save, isolation, switch-off, switch-on e restore. Registri ricostruibili o non critici possono restare SDFF normali per ridurre area e leakage.",
      "It is used only for architectural registers that must preserve state through power gating. The UPF strategy identifies retained elements, supplies, and the save, isolation, switch-off, switch-on, and restore sequence. Reconstructible or noncritical registers can remain ordinary SDFFs to reduce area and leakage."
    ),
    technicalNotes: loc(
      [
        "I pin principali includono CLK, D, Q e controlli SAVE/RESTORE o RETEN, secondo la libreria.",
        "La supply retention deve restare attiva e rispettare IR drop durante l'intera sequenza.",
        "UPF e power-aware simulation verificano stato, corruption e sequenza di controllo.",
        "Setup/hold e min-pulse-width esistono anche sui controlli di retention.",
        "Area, clock power e leakage sono maggiori di un DFF o SDFF equivalente.",
        "Varianti scan-retention preservano testabilità; una retention FF non-scan può ridurre coverage.",
      ],
      [
        "Main pins include CLK, D, Q, and SAVE/RESTORE or RETEN controls, depending on the library.",
        "The retention supply must remain active and meet IR-drop limits throughout the sequence.",
        "UPF and power-aware simulation verify state, corruption, and control sequencing.",
        "Setup/hold and minimum-pulse-width constraints also apply to retention controls.",
        "Area, clock power, and leakage exceed those of an equivalent DFF or SDFF.",
        "Scan-retention variants preserve testability; a non-scan retention FF can reduce coverage.",
      ]
    ),
    relatedCells: ["dff", "sdff", "iso", "psw"],
  },
  {
    id: "sdff",
    name: loc("SDFF — Scan D Flip-Flop", "SDFF — Scan D Flip-Flop"),
    category: loc("Sequential & Scan", "Sequential & Scan"),
    function: loc(
      "Integra un mux che seleziona D in modalità funzionale e SI in modalità scan secondo Dint = SE ? SI : D. Sul fronte di clock, Q campiona Dint e collega così i registri in una scan chain seriale. La funzione sequenziale resta quella di un DFF, ma SI e SE aggiungono archi e capacità.",
      "It integrates a mux selecting functional D or scan SI according to Dint = SE ? SI : D. At the clock edge, Q samples Dint, connecting registers into a serial scan chain. Its sequential behavior remains that of a DFF, but SI and SE add arcs and capacitance."
    ),
    placement: loc(
      "Viene posizionato come sink CTS vicino alla logica funzionale, poi lo scan reorder collega Q→SI minimizzando wirelength. Chain e lock-up latch devono rispettare clock domain, edge e power domain. L'accesso extra a SI e SE rende SDFF più pin-dense di DFF e richiede capacità di routing.",
      "It is placed as a CTS sink near functional logic, after which scan reordering connects Q→SI to minimize wirelength. Chains and lock-up latches must respect clock domain, edge, and power domain. Extra SI and SE access makes an SDFF more pin-dense than a DFF and requires routing capacity."
    ),
    whenUsed: loc(
      "È usato per la maggior parte dei registri di produzione destinati a test stuck-at e transition ATPG. La scan replacement converte DFF compatibili e preserva reset, enable e polarità del clock. Elementi analogici, synchronizer speciali o retention possono richiedere esclusione o varianti scan dedicate.",
      "It is used for most production registers targeted by stuck-at and transition ATPG. Scan replacement converts compatible DFFs while preserving reset, enable, and clock polarity. Analog elements, special synchronizers, or retention may require exclusion or dedicated scan variants."
    ),
    technicalNotes: loc(
      [
        "SE è una net ad alto fanout e richiede buffering, slew control e talvolta enable locali.",
        "I path Q→SI sono molto corti e spesso richiedono buffer o delay per hold post-CTS.",
        "Lock-up latch assorbe skew quando una chain attraversa domini o edge incompatibili.",
        "Scan shift usa una frequenza inferiore ma può creare picchi IR per attività elevata.",
        "La .lib include setup/hold separati per D, SI e SE rispetto al clock.",
        "Compressione scan e chain balancing dipendono dai vincoli ATPG e dal numero di pin tester.",
      ],
      [
        "SE is a high-fanout net requiring buffering, slew control, and sometimes local enables.",
        "Q→SI paths are very short and often need buffers or delay cells for post-CTS hold.",
        "A lock-up latch absorbs skew when a chain crosses incompatible domains or edges.",
        "Scan shift runs slower but can create IR peaks because of high activity.",
        "The .lib contains separate setup/hold constraints for D, SI, and SE versus clock.",
        "Scan compression and chain balancing depend on ATPG constraints and tester pin count.",
      ]
    ),
    relatedCells: ["dff", "latch", "delay", "retention_ff"],
  },
  {
    id: "latch",
    name: loc("LATCH / DLAT", "LATCH / DLAT"),
    category: loc("Sequential & Scan", "Sequential & Scan"),
    function: loc(
      "È sensibile al livello: per un latch alto-trasparente Q segue D mentre EN = 1 e conserva il valore quando EN = 0. La finestra trasparente permette time borrowing fra stadi adiacenti. Varianti low-transparent, con reset o con scan hanno polarità e vincoli specifici.",
      "It is level sensitive: for a high-transparent latch, Q follows D while EN = 1 and holds the value when EN = 0. The transparent window permits time borrowing between adjacent stages. Low-transparent, reset, or scan variants have specific polarities and constraints."
    ),
    placement: loc(
      "Il latch deve stare vicino alla logica che beneficia del borrowing o al confine scan per cui funge da lock-up. Il placement considera la fase del clock, non soltanto la distanza dal sink. L'uso accidentale dovuto a RTL incompleto va eliminato prima del physical design, non nascosto con il placement.",
      "A latch should sit near logic that benefits from borrowing or at the scan boundary where it acts as lock-up. Placement considers clock phase, not only sink distance. Accidental latches from incomplete RTL must be removed before physical design rather than hidden through placement."
    ),
    whenUsed: loc(
      "È usato intenzionalmente in pipeline latch-based, pulsed-latch design, ICG e scan lock-up. Può ridurre il numero di stadi effettivi grazie al time borrowing, ma complica STA e verifica. Un'inferenza non intenzionale da assegnazioni RTL incomplete è normalmente un errore di lint.",
      "It is intentionally used in latch-based pipelines, pulsed-latch designs, ICGs, and scan lock-up. It can reduce effective stage boundaries through time borrowing but complicates STA and verification. Unintended inference from incomplete RTL assignments is normally a lint error."
    ),
    technicalNotes: loc(
      [
        "STA propaga i path attraverso il latch durante la finestra trasparente.",
        "Opening, closing, setup, hold e min-pulse-width dipendono dalla fase e dal duty cycle.",
        "Il borrowing guadagnato in uno stadio riduce il margine disponibile nello stadio successivo.",
        "Race-through è possibile se fasi sovrapposte rendono trasparenti latch consecutivi.",
        "Il lock-up latch è tipicamente trasparente sulla fase opposta alla scan capture.",
        "Clock gating e OCV richiedono analisi più rigorosa rispetto a una pipeline solo DFF.",
      ],
      [
        "STA propagates paths through the latch during its transparent window.",
        "Opening, closing, setup, hold, and minimum pulse width depend on phase and duty cycle.",
        "Borrowing gained in one stage reduces margin available to the next stage.",
        "Race-through is possible if overlapping phases make consecutive latches transparent.",
        "A lock-up latch is typically transparent on the phase opposite scan capture.",
        "Clock gating and OCV require more rigorous analysis than an all-DFF pipeline.",
      ]
    ),
    relatedCells: ["dff", "sdff", "icg"],
  },
  {
    id: "clkbuf",
    name: loc("CLKBUF — Clock Buffer", "CLKBUF — Clock Buffer"),
    category: loc("Clock & Buffer", "Clock & Buffer"),
    function: loc(
      "Propaga il clock senza inversione, Y = A, con rise/fall bilanciati e bassa variazione di delay. La cella è caratterizzata per slew, duty-cycle, jitter sensitivity e ampi carichi tipici del clock tree. Le taglie X2–X32 permettono al CTS di costruire livelli con fanout controllato.",
      "It propagates the clock without inversion, Y = A, with balanced rise/fall and low delay variation. The cell is characterized for slew, duty cycle, jitter sensitivity, and the large loads typical of clock trees. X2–X32 sizes let CTS build levels with controlled fanout."
    ),
    placement: loc(
      "È posizionato dal CTS lungo trunk e branch fra la clock root e i sink sequenziali. Il tool sceglie siti che bilanciano wirelength, skew, congestion e disponibilità di alimentazione. Rami critici possono usare shielding e NDR con wire più larghe e spacing maggiore.",
      "CTS places it along trunks and branches between the clock root and sequential sinks. The tool chooses sites balancing wirelength, skew, congestion, and power availability. Critical branches may use shielding and NDRs with wider wires and greater spacing."
    ),
    whenUsed: loc(
      "È usato a ogni livello di clock-tree synthesis per rispettare insertion delay, skew e max transition. Serve anche su generated clock o reset sincroni solo quando la metodologia e la libreria lo autorizzano. Non va sostituito da un buffer dati, che può avere variazione e duty-cycle non qualificati.",
      "It is used at every clock-tree synthesis level to meet insertion delay, skew, and maximum transition. It may also serve generated clocks or synchronous resets only when methodology and library permit. It must not be replaced by a data buffer whose variation and duty-cycle behavior may be unqualified."
    ),
    technicalNotes: loc(
      [
        "CTS limita fanout, capacitance e transition a ogni livello dell'albero.",
        "NDR tipiche usano double-width/double-spacing sui trunk per ridurre RC e coupling.",
        "Il bilanciamento include derating OCV e latenza source/network, non solo wirelength.",
        "X2–X32 e flavor VT dedicati offrono trade-off skew, power e leakage.",
        "Duty-cycle distortion si accumula se rise e fall non sono ben accoppiati.",
        "Clock dynamic power include commutazione interna di ogni buffer a ogni ciclo.",
      ],
      [
        "CTS limits fanout, capacitance, and transition at every tree level.",
        "Typical NDRs use double width and spacing on trunks to reduce RC and coupling.",
        "Balancing includes OCV derating and source/network latency, not only wirelength.",
        "X2–X32 and dedicated VT flavors trade skew, power, and leakage.",
        "Duty-cycle distortion accumulates when rise and fall are poorly matched.",
        "Clock dynamic power includes every buffer's internal switching on every cycle.",
      ]
    ),
    relatedCells: ["clkinv", "icg", "trunk", "clkmux"],
  },
  {
    id: "trunk",
    name: loc("Trunk Buffer / Clock Trunk Cell", "Trunk Buffer / Clock Trunk Cell"),
    category: loc("Clock & Buffer", "Clock & Buffer"),
    function: loc(
      "È un buffer clock ad alta forza destinato alla spine o al trunk principale, con Y = A. Pilota grande capacità distribuita mantenendo slew e variazione entro limiti CTS. Taglie tipiche X16–X32 usano dispositivi larghi e alimentazione robusta per ridurre Rout.",
      "It is a high-strength clock buffer intended for the main spine or trunk, with Y = A. It drives large distributed capacitance while keeping slew and variation within CTS limits. Typical X16–X32 sizes use wide devices and robust power access to lower Rout."
    ),
    placement: loc(
      "Viene collocato vicino alla spine centrale, ai tap point MSCTS o ai punti di diramazione ad alto fanout. Le net trunk viaggiano spesso su metal alti con NDR, shielding e via multiple. Il placement deve evitare blockage macro, hotspot IR e regioni che costringono lunghi jog.",
      "It is placed near the central spine, MSCTS tap points, or high-fanout branch points. Trunk nets often use upper metals with NDRs, shielding, and multiple vias. Placement must avoid macro blockages, IR hotspots, and regions that force long jogs."
    ),
    whenUsed: loc(
      "È usato in design grandi, clock ad alta frequenza, H-tree, mesh e multi-source CTS. Distribuisce il clock dal root network ai branch buffer locali. Non è una categoria universale di LEF e il nome esatto deve provenire dalla clock-cell list della libreria.",
      "It is used in large designs, high-frequency clocks, H-trees, meshes, and multi-source CTS. It distributes clock from the root network to local branch buffers. It is not a universal LEF category, and the exact cell name must come from the library's clock-cell list."
    ),
    technicalNotes: loc(
      [
        "Drive X16–X32 riduce Rout ma crea elevati picchi di corrente di switching.",
        "NDR su trunk usa tipicamente wire larghe, spacing maggiore e via redundancy.",
        "EM e dynamic IR devono essere verificati sulla rete PG vicina al buffer.",
        "MSCTS bilancia latenza dai tap point ai sink locali oltre al trunk globale.",
        "Una cella trunk sovradimensionata può aumentare power, area e crosstalk senza migliorare skew.",
        "Il jitter coupling richiede distanza o shielding rispetto a aggressori veloci.",
      ],
      [
        "X16–X32 drive lowers Rout but creates large switching-current peaks.",
        "Trunk NDRs typically use wider wires, larger spacing, and redundant vias.",
        "EM and dynamic IR must be checked on the power grid near the buffer.",
        "MSCTS balances latency from tap points to local sinks as well as the global trunk.",
        "An oversized trunk cell can raise power, area, and crosstalk without improving skew.",
        "Jitter coupling requires spacing or shielding from fast aggressors.",
      ]
    ),
    relatedCells: ["clkbuf", "clkinv", "decap"],
  },
  {
    id: "icg",
    name: loc("ICG — Integrated Clock Gating Cell", "ICG — Integrated Clock Gating Cell"),
    category: loc("Clock & Buffer", "Clock & Buffer"),
    function: loc(
      "Genera GCLK = CLK · ENeff per una variante active-high, dove un latch interno campiona EN quando CLK è inattivo. Il latch impedisce a una variazione di enable durante la fase attiva di creare glitch o impulsi corti. Un pin test-enable può forzare il clock durante scan e ATPG.",
      "It generates GCLK = CLK · ENeff for an active-high variant, where an internal latch samples EN while CLK is inactive. The latch prevents enable changes during the active phase from creating glitches or short pulses. A test-enable pin can force the clock on during scan and ATPG."
    ),
    placement: loc(
      "Viene collocato nel clock tree a monte del gruppo di sink che condivide lo stesso enable. Un ICG troppo vicino alla root riduce meno la potenza di rete a monte, mentre uno troppo vicino ai sink moltiplica il numero di celle gating. CTS tratta l'uscita come clock e applica buffering, NDR e skew constraints appropriati.",
      "It is placed in the clock tree upstream of sinks sharing the same enable. An ICG too near the root saves less upstream network power, while one too near sinks multiplies gating-cell count. CTS treats its output as a clock and applies suitable buffering, NDR, and skew constraints."
    ),
    whenUsed: loc(
      "È usato per spegnere la commutazione clock di registri inattivi e ridurre dynamic power. La sintesi clock-gating raggruppa enable equivalenti e sostituisce mux-feedback o enable di registri con ICG. Il test-enable deve essere definito affinché scan shift e capture ricevano il clock previsto.",
      "It is used to stop clock switching in inactive registers and reduce dynamic power. Clock-gating synthesis groups equivalent enables and replaces register-enable feedback muxes with ICGs. Test enable must be defined so scan shift and capture receive the intended clock."
    ),
    technicalNotes: loc(
      [
        "Setup e hold dell'enable sono riferiti alla finestra di chiusura del latch interno.",
        "La struttura latch-based è glitch-free se il protocollo di enable è rispettato.",
        "Il pin TE/SE bypassa il gating in test e può essere una net ad alto fanout.",
        "Minimum pulse width e duty cycle devono essere verificati su CLK e GCLK.",
        "La potenza risparmiata dipende dal fanout gated, dall'attività e dalla posizione nell'albero.",
        "UPF power state e DFT constraints devono concordare sul comportamento del clock gated.",
      ],
      [
        "Enable setup and hold are referenced to the internal latch's closing window.",
        "The latch-based structure is glitch-free when the enable protocol is respected.",
        "The TE/SE pin bypasses gating in test and can be a high-fanout net.",
        "Minimum pulse width and duty cycle must be checked on CLK and GCLK.",
        "Power saved depends on gated fanout, activity, and position in the tree.",
        "UPF power states and DFT constraints must agree on gated-clock behavior.",
      ]
    ),
    relatedCells: ["clkbuf", "clkinv", "clkmux", "latch"],
  },
  {
    id: "delay",
    name: loc("DLY — Delay Cell", "DLY — Delay Cell"),
    category: loc("Clock & Buffer", "Clock & Buffer"),
    function: loc(
      "Propaga Y = A introducendo un ritardo minimo intenzionale e caratterizzato. La topologia usa stadi deboli, carichi interni o percorsi RC controllati, quindi non equivale a un semplice buffer di drive. Famiglie DLY1–DLY16 forniscono incrementi di delay per correggere path troppo veloci.",
      "It propagates Y = A while adding intentional, characterized minimum delay. Its topology uses weak stages, internal loads, or controlled RC paths, so it is not equivalent to a simple drive buffer. DLY1–DLY16 families provide delay increments for repairing paths that are too fast."
    ),
    placement: loc(
      "Va inserita sul data path corto, preferibilmente vicino al sink di cattura per limitare bypass e variazioni di route. Il tool deve lasciare spazio per una catena di delay durante hold optimization post-CTS o post-route. Non va messa sul clock tree salvo una metodologia esplicitamente caratterizzata, perché altererebbe skew e duty cycle.",
      "It is inserted on the short data path, preferably near the capture sink to limit bypass and routing variation. The tool must leave room for a delay chain during post-CTS or post-route hold optimization. It must not be put on the clock tree unless an explicitly characterized methodology permits it, because it changes skew and duty cycle."
    ),
    whenUsed: loc(
      "È usata per correggere hold, min-delay, pulse separation o ECO di race su path dati. Si preferisce un buffer normale quando serve anche ripristinare slew o pilotare un carico. L'inserimento deve chiudere tutti i corner senza trasformare il fix hold in una violazione setup.",
      "It is used to repair hold, minimum-delay, pulse-separation, or data-race ECO issues. A normal buffer is preferred when slew restoration or load drive is also needed. Insertion must close all corners without turning the hold repair into a setup violation."
    ),
    technicalNotes: loc(
      [
        "Il delay minimo al corner fast-fast è il valore decisivo per il fix hold.",
        "Setup va ricontrollato ai corner slow dopo ogni inserimento.",
        "Una catena DLY consuma area e leakage e può creare congestion vicino ai sink.",
        "Le celle hold dedicate hanno delay più stabile di route detour non controllati.",
        "Cin e Rout possono essere sfavorevoli, quindi non sono buffer ad alto drive.",
        "OCV/POCV e RC estratta determinano il margine effettivo, non il valore nominale DLY.",
      ],
      [
        "Minimum delay at the fast-fast corner is decisive for a hold repair.",
        "Setup must be rechecked at slow corners after every insertion.",
        "A DLY chain consumes area and leakage and can create congestion near sinks.",
        "Dedicated hold cells provide more stable delay than uncontrolled routing detours.",
        "Cin and Rout may be unfavorable, so these are not high-drive buffers.",
        "OCV/POCV and extracted RC determine effective margin, not the nominal DLY value.",
      ]
    ),
    relatedCells: ["buf", "sdff", "dff"],
  },
  {
    id: "clkinv",
    name: loc("CLKINV — Clock Inverter", "CLKINV — Clock Inverter"),
    category: loc("Clock & Buffer", "Clock & Buffer"),
    function: loc(
      "Inverte il clock secondo Y = ¬A usando dispositivi bilanciati per rise/fall e bassa variazione. La cella mantiene duty-cycle e slew entro limiti qualificati per reti di clock. Le taglie multiple consentono inversione intenzionale senza ricorrere a un INV dati.",
      "It inverts the clock according to Y = ¬A using devices balanced for rise/fall and low variation. The cell keeps duty cycle and slew within limits qualified for clock networks. Multiple sizes permit intentional inversion without using a data INV."
    ),
    placement: loc(
      "CTS la colloca su branch in cui serve una polarità opposta o una fase complementare. Deve restare nella clock-cell list e seguire le stesse NDR, shielding e regole di skew dei CLKBUF. Coppie di inverter possono essere disposte simmetricamente in H-tree o mesh per controllare latenza.",
      "CTS places it on branches needing opposite polarity or a complementary phase. It must remain in the clock-cell list and follow the same NDR, shielding, and skew rules as CLKBUFs. Inverter pairs can be placed symmetrically in H-trees or meshes to control latency."
    ),
    whenUsed: loc(
      "È usata per sink negative-edge, phase generation, inversione CTS e alcune strategie di useful skew. Può correggere la polarità evitando un inverter dati non qualificato. Non deve creare accidentalmente una generated clock non dichiarata o un duty-cycle incompatibile con i sink.",
      "It is used for negative-edge sinks, phase generation, CTS inversion, and some useful-skew strategies. It can correct polarity without an unqualified data inverter. It must not accidentally create an undeclared generated clock or a duty cycle incompatible with sinks."
    ),
    technicalNotes: loc(
      [
        "Rise/fall matching limita la distorsione di duty cycle lungo catene clock.",
        "La .lib identifica le celle clock e caratterizza archi per slew/load appropriati.",
        "NDR e shielding si applicano alla net in ingresso e in uscita secondo la metodologia.",
        "X2–X16 sono comuni; il drive va scelto per fanout e insertion delay.",
        "OCV può rendere critica una catena con numero diverso di inversioni fra rami.",
        "L'inversione deve essere riflessa in generated-clock e STA constraints.",
      ],
      [
        "Rise/fall matching limits duty-cycle distortion through clock chains.",
        "The .lib identifies clock cells and characterizes arcs for suitable slew/load.",
        "NDR and shielding apply to input and output nets according to methodology.",
        "X2–X16 are common; drive is selected for fanout and insertion delay.",
        "OCV can make branches with different inversion counts critical.",
        "Inversion must be reflected in generated-clock and STA constraints.",
      ]
    ),
    relatedCells: ["clkbuf", "icg", "clkmux", "inv"],
  },
  {
    id: "clkmux",
    name: loc("CLKMUX — Glitch-free Clock Mux", "CLKMUX — Glitch-free Clock Mux"),
    category: loc("Clock & Buffer", "Clock & Buffer"),
    function: loc(
      "Seleziona una sorgente clock fra CLK0 e CLK1 senza produrre glitch o runt pulse quando il protocollo di select è rispettato. La topologia sincronizza o blocca gli enable dei rami prima di abilitarne uno nuovo, spesso con schema break-before-make. L'uscita è un clock vero e deve essere modellata come generated clock per ciascuna sorgente possibile.",
      "It selects between CLK0 and CLK1 without glitches or runt pulses when the select protocol is followed. Its topology synchronizes or blocks branch enables before activating a new one, often using break-before-make behavior. The output is a real clock and must be modeled as a generated clock for every possible source."
    ),
    placement: loc(
      "Viene collocata vicino alle sorgenti, alla PLL o al punto di ingresso del dominio per limitare i tratti clock non selezionati. L'uscita entra nel CTS e usa NDR, shielding e buffer clock dedicati. La logica di select e sincronizzazione deve restare accessibile senza accoppiare rumore alle net clock.",
      "It is placed near sources, the PLL, or the domain entry point to limit unselected clock wiring. Its output enters CTS and uses NDRs, shielding, and dedicated clock buffers. Select and synchronization logic must remain accessible without coupling noise into clock nets."
    ),
    whenUsed: loc(
      "È usata per commutazione runtime di sorgenti, scelta functional/scan clock, bypass PLL e modalità low-power. La procedura di switch deve garantire frequenze e fasi compatibili con le assunzioni della cella. Un MUX2 dati non è un sostituto accettabile perché può generare impulsi arbitrariamente corti.",
      "It is used for runtime source switching, functional-versus-scan clock selection, PLL bypass, and low-power modes. The switching procedure must ensure frequencies and phases compatible with cell assumptions. A data MUX2 is not an acceptable substitute because it can generate arbitrarily short pulses."
    ),
    technicalNotes: loc(
      [
        "STA richiede una generated clock per ogni input e relazioni logically/physically exclusive corrette.",
        "Glitch-free descrive il protocollo ammesso, non ogni cambio asincrono arbitrario di select.",
        "Minimum pulse width e recovery/removal dei controlli interni vanno verificati.",
        "L'uscita segue la clock-cell list e le regole NDR del CTS.",
        "DFT deve controllare select o test-enable per rendere osservabili tutte le modalità.",
        "CDC/RDC analysis verifica la sicurezza della logica che comanda la commutazione.",
      ],
      [
        "STA needs one generated clock per input and correct logically/physically exclusive relationships.",
        "Glitch-free describes an allowed protocol, not every arbitrary asynchronous select change.",
        "Minimum pulse width and internal-control recovery/removal must be checked.",
        "The output follows the CTS clock-cell list and NDR rules.",
        "DFT must control select or test enable so every mode is observable.",
        "CDC/RDC analysis verifies safety of logic controlling the switch.",
      ]
    ),
    relatedCells: ["clkbuf", "clkinv", "icg", "mux2"],
  },
  {
    id: "tap",
    name: loc("Tap Cell — Well Tie", "Tap Cell — Well Tie"),
    category: loc("Power & Ground", "Power & Ground"),
    function: loc(
      "Collega N-well a VDD e P-substrate o P-well a VSS tramite contatti a bassa resistenza. Mantiene il body bias definito e raccoglie le correnti parassite che potrebbero innescare latch-up. Non possiede una funzione booleana né pin di segnale, ma è parte obbligatoria dell'integrità fisica.",
      "It connects N-well to VDD and P-substrate or P-well to VSS through low-resistance contacts. It establishes body bias and collects parasitic currents that could trigger latch-up. It has no Boolean function or signal pins but is mandatory for physical integrity."
    ),
    placement: loc(
      "Viene inserita su una griglia o a intervalli massimi definiti dal DRM, rispettando row, orientamento e dominio di well. Le tap devono circondare macro, voltage island e regioni con interruzioni di row secondo le regole del PDK. Il placement automatico usa checkerboard o intervalli per evitare buchi oltre la distanza massima.",
      "It is inserted on a grid or at DRM-defined maximum intervals while respecting rows, orientation, and well domains. Taps must surround macros, voltage islands, and row interruptions according to PDK rules. Automatic placement uses checkerboard or interval patterns to prevent gaps beyond the maximum distance."
    ),
    whenUsed: loc(
      "È richiesta in ogni block standard-cell prima del detail placement e del routing finale. I check latch-up, DRC o ERC falliscono se un punto del well è troppo lontano da un tie valido. Non può essere sostituita da un filler privo di contatti well/substrate.",
      "It is required in every standard-cell block before detailed placement and final routing. Latch-up, DRC, or ERC checks fail when a well point is too far from a valid tie. It cannot be replaced by a filler lacking well/substrate contacts."
    ),
    technicalNotes: loc(
      [
        "Il max tap spacing proviene dal DRM ed è specifico per nodo, well e condizioni di bias.",
        "La cella espone solo pin PG e contatti body, non pin logici.",
        "Deep-N-well, triple-well e multi-voltage richiedono tap compatibili con ciascun dominio.",
        "Tap mancanti o orientate male causano DRC/ERC e rischio di latch-up.",
        "L'inserimento deve precedere il riempimento dei gap con filler.",
        "Continuità del rail non prova da sola la presenza di un contatto well valido.",
      ],
      [
        "Maximum tap spacing comes from the DRM and is specific to node, well, and bias conditions.",
        "The cell exposes only PG pins and body contacts, not logic pins.",
        "Deep-N-well, triple-well, and multi-voltage designs need taps compatible with each domain.",
        "Missing or misoriented taps cause DRC/ERC failures and latch-up risk.",
        "Tap insertion must precede filling remaining gaps with filler cells.",
        "Rail continuity alone does not prove that a valid well contact exists.",
      ]
    ),
    relatedCells: ["welltap", "endcap", "filler"],
  },
  {
    id: "welltap",
    name: loc("WELLTAP — Well Tap dedicato", "WELLTAP — Dedicated Well Tap"),
    category: loc("Power & Ground", "Power & Ground"),
    function: loc(
      "È una variante esplicita di tap cell con pick-up di well o substrate definito nel LEF. Fissa il potenziale body, riduce la resistenza del well e limita l'accumulo di portatori parassiti. Alcuni PDK separano WELLTAP, NTAP e PTAP, mentre altri usano una TAPCELL combinata.",
      "It is an explicit tap-cell variant with a well or substrate pickup defined in LEF. It fixes body potential, lowers well resistance, and limits parasitic carrier buildup. Some PDKs separate WELLTAP, NTAP, and PTAP, while others use one combined TAPCELL."
    ),
    placement: loc(
      "Le celle sono distribuite in una griglia regolare o checkerboard con pitch conforme al DRM. Ogni istanza deve cadere nella row, well e voltage area compatibili con il proprio rail. Interruzioni attorno a macro e blockage richiedono tap aggiuntive ai bordi per mantenere la distanza massima.",
      "Cells are distributed on a regular or checkerboard grid with DRM-compliant pitch. Every instance must fall in a row, well, and voltage area compatible with its rail. Interruptions around macros and blockages require extra edge taps to maintain maximum distance."
    ),
    whenUsed: loc(
      "Si usa quando la libreria distingue il pick-up well dalla tap combinata generica. È obbligatoria per latch-up prevention e body connection nei processi che la prescrivono. Il comando e il pattern esatti devono seguire la technology file, non valori tipici copiati da un altro nodo.",
      "It is used when the library distinguishes a well pickup from a generic combined tap. It is mandatory for latch-up prevention and body connection in processes that prescribe it. Exact commands and patterns must follow the technology file rather than typical values copied from another node."
    ),
    technicalNotes: loc(
      [
        "Pitch tipici in micron non sostituiscono la regola DRM del PDK corrente.",
        "NTAP e PTAP possono avere orientamenti, rail e well legality differenti.",
        "FinFET e bulk CMOS applicano regole di tap e latch-up diverse.",
        "LVS/ERC verifica la connessione body alla supply corretta.",
        "La griglia deve essere rigenerata dopo modifiche importanti a row o voltage area.",
        "Non confondere well tap con guard ring analogico o endcap.",
      ],
      [
        "Typical micron pitches do not replace the current PDK's DRM rule.",
        "NTAP and PTAP may have different orientations, rails, and well legality.",
        "FinFET and bulk CMOS apply different tap and latch-up rules.",
        "LVS/ERC verifies body connection to the correct supply.",
        "The grid must be regenerated after major row or voltage-area changes.",
        "Do not confuse a well tap with an analog guard ring or endcap.",
      ]
    ),
    relatedCells: ["tap", "endcap"],
  },
  {
    id: "endcap",
    name: loc("Endcap / Edge Cell", "Endcap / Edge Cell"),
    category: loc("Filler & Physical", "Filler & Physical"),
    function: loc(
      "Termina legalmente una standard-cell row e fornisce geometrie di bordo conformi alle regole di impianto, well e diffusion. Protegge la prima o ultima cella logica da boundary condition non caratterizzate. Può inoltre continuare rail o well, ma non implementa logica.",
      "It legally terminates a standard-cell row and provides edge geometry compliant with implant, well, and diffusion rules. It protects the first or last logic cell from uncharacterized boundary conditions. It may also continue rails or wells but implements no logic."
    ),
    placement: loc(
      "Le varianti left e right vengono collocate agli estremi di ogni row e ai bordi creati da macro o placement blockage. Orientamento e master devono corrispondere alla direzione della row e alla polarità dei rail. Corner o multi-height row possono richiedere endcap speciali distinti.",
      "Left and right variants are placed at every row end and at edges created by macros or placement blockages. Orientation and master must match row direction and rail polarity. Corners or multi-height rows may require distinct specialized endcaps."
    ),
    whenUsed: loc(
      "Si inserisce dopo la creazione delle row e prima che il placement riempia completamente i bordi. È necessaria per ottenere DRC clean e rispettare le boundary condition della libreria. Va rigenerata se floorplan, macro halo o row cutting cambiano.",
      "It is inserted after row creation and before placement fills row edges. It is necessary for DRC cleanliness and library boundary-condition compliance. It must be regenerated when floorplan, macro halos, or row cutting changes."
    ),
    technicalNotes: loc(
      [
        "Left e right endcap non sono intercambiabili senza l'orientamento previsto.",
        "Boundary cell diverse possono servire per top/bottom, corner o row multi-height.",
        "L'endcap non sostituisce tap, filler o decap.",
        "LEF e library application note definiscono abutment e orientamenti legali.",
        "Row spezzate da macro richiedono endcap su entrambi i nuovi bordi.",
        "DRC tipici coinvolgono well, implant, diffusion e power-rail enclosure.",
      ],
      [
        "Left and right endcaps are not interchangeable without the intended orientation.",
        "Different boundary cells may be needed for top/bottom, corners, or multi-height rows.",
        "An endcap does not replace a tap, filler, or decap.",
        "LEF and library application notes define legal abutment and orientations.",
        "Rows cut by macros require endcaps on both new edges.",
        "Typical DRC checks involve well, implant, diffusion, and power-rail enclosure.",
      ]
    ),
    relatedCells: ["tap", "welltap", "filler"],
  },
  {
    id: "filler",
    name: loc("Filler Cell", "Filler Cell"),
    category: loc("Filler & Physical", "Filler & Physical"),
    function: loc(
      "Riempie gli spazi vuoti fra standard cell mantenendo continuità di well, implant e rail VDD/VSS. Non contiene logica funzionale e normalmente non aggiunge capacità di disaccoppiamento intenzionale. Le larghezze FILL1, FILL2, FILL4 e maggiori permettono di comporre ogni gap legale.",
      "It fills gaps between standard cells while maintaining continuity of wells, implants, and VDD/VSS rails. It contains no functional logic and normally adds no intentional decoupling capacitance. FILL1, FILL2, FILL4, and wider masters compose every legal gap."
    ),
    placement: loc(
      "Viene inserito nei siti liberi dopo placement e ottimizzazione, scegliendo master e orientamento compatibili con ogni row. Il flow usa prima le celle larghe e poi quelle strette per chiudere i residui senza overlap. I filler devono rispettare voltage domain, multi-height boundary e special-cell keepout.",
      "It is inserted into free sites after placement and optimization using masters and orientations compatible with each row. The flow uses wide cells first and narrow cells to close residual gaps without overlap. Fillers must respect voltage domains, multi-height boundaries, and special-cell keepouts."
    ),
    whenUsed: loc(
      "È usato prima del signoff DRC/LVS per eliminare gap che interrompono geometrie continue. Deve essere rimosso e reinserito attorno alle celle cambiate durante ECO di placement. Non si usa come rimedio IR a meno che il master sia esplicitamente una DECAP.",
      "It is used before DRC/LVS signoff to remove gaps that interrupt continuous geometry. It must be removed and reinserted around cells changed during placement ECO. It is not an IR remedy unless the master is explicitly a DECAP."
    ),
    technicalNotes: loc(
      [
        "FILL1/FILL2/FILL4 indicano multipli di site width, non drive strength.",
        "Continuità dei rail dipende dai pin PG e dalle regole di abutment del LEF.",
        "Il filler standard non va contato come capacità decap garantita.",
        "Domain e rail incompatibili possono creare short fra supply.",
        "Metal fill foundry è un passo distinto che corregge density dei layer.",
        "Dopo ECO occorre rieseguire filler insertion e DRC locale.",
      ],
      [
        "FILL1/FILL2/FILL4 indicate site-width multiples, not drive strength.",
        "Rail continuity depends on PG pins and LEF abutment rules.",
        "A standard filler must not be counted as guaranteed decap capacitance.",
        "Incompatible domains and rails can create supply shorts.",
        "Foundry metal fill is a separate step correcting layer density.",
        "After ECO, filler insertion and local DRC must be rerun.",
      ]
    ),
    relatedCells: ["decap", "endcap", "tap"],
  },
  {
    id: "decap",
    name: loc("DECAP — Decoupling Capacitor", "DECAP — Decoupling Capacitor"),
    category: loc("Filler & Physical", "Filler & Physical"),
    function: loc(
      "Fornisce capacità intenzionale fra VDD e VSS per erogare carica locale durante transitori di switching. La relazione ΔV ≈ ΔQ/C mostra come maggiore capacità riduca dynamic IR droop a parità di corrente impulsiva. La struttura usa gate capacitance o dispositivi dedicati qualificati per affidabilità.",
      "It provides intentional capacitance between VDD and VSS to deliver local charge during switching transients. The relation ΔV ≈ ΔQ/C shows how greater capacitance reduces dynamic IR droop for a given current pulse. Its structure uses gate capacitance or dedicated devices qualified for reliability."
    ),
    placement: loc(
      "Viene collocata vicino a hotspot di attività, macro, clock buffer grandi e power-switch network, ma solo dopo analisi IR. Deve collegarsi ai rail corretti del dominio e non ostacolare cell sizing o routing critico. Una distribuzione uniforme può essere integrata da inserimenti mirati nelle regioni con droop elevato.",
      "It is placed near activity hotspots, macros, large clock buffers, and power-switch networks, but only after IR analysis. It must connect to the correct domain rails without blocking cell sizing or critical routing. A uniform baseline can be supplemented by targeted insertion in high-droop regions."
    ),
    whenUsed: loc(
      "È usata durante power planning e post-route dynamic IR optimization. Sostituisce filler o spazio libero quando l'analisi dimostra un beneficio e il budget di leakage lo permette. Non corregge una rete PG sottodimensionata, un problema EM o una resistenza DC strutturale.",
      "It is used during power planning and post-route dynamic IR optimization. It replaces filler or free space when analysis proves benefit and leakage budget permits. It does not fix an undersized power grid, an EM problem, or structural DC resistance."
    ),
    technicalNotes: loc(
      [
        "La capacità effettiva dipende da voltage, PVT, frequenza e modello del master.",
        "Leakage del dispositivo decap può essere rilevante, soprattutto a temperature elevate.",
        "Troppa decap aumenta inrush current e carico sulla rete all'accensione.",
        "Static IR richiede riduzione R o corrente; la decap agisce soprattutto sul droop dinamico.",
        "Il placement deve rispettare rail, voltage area e domini switched/always-on.",
        "EM e via capacity restano vincoli anche quando il droop migliora.",
      ],
      [
        "Effective capacitance depends on voltage, PVT, frequency, and master modeling.",
        "Decap-device leakage can be significant, especially at high temperature.",
        "Excess decap increases inrush current and power-up grid loading.",
        "Static IR needs lower R or current; decap primarily addresses dynamic droop.",
        "Placement must respect rails, voltage areas, and switched/always-on domains.",
        "EM and via capacity remain constraints even when droop improves.",
      ]
    ),
    relatedCells: ["filler", "psw", "trunk"],
  },
  {
    id: "tie",
    name: loc("TIEHI / TIELO — Tie Cell", "TIEHI / TIELO — Tie Cell"),
    category: loc("Power & Ground", "Power & Ground"),
    function: loc(
      "Genera una costante logica sicura: TIEHI produce 1 e TIELO produce 0. Usa una struttura a corrente limitata o dispositivi dedicati invece di collegare direttamente un gate a VDD o VSS. In questo modo limita stress oxide, correnti di guasto e sensibilità a regole antenna o reliability.",
      "It generates a safe logic constant: TIEHI produces 1 and TIELO produces 0. It uses a current-limited or dedicated device structure instead of connecting a gate directly to VDD or VSS. This limits oxide stress, fault current, and exposure to antenna or reliability rules."
    ),
    placement: loc(
      "Le tie cell sono distribuite nel core e connesse a piccoli gruppi di sink entro fanout e distanza massimi della libreria. Devono trovarsi nello stesso voltage domain o usare una variante compatibile con il livello del receiver. Il router mantiene corto il tie net e non usa la cella per pilotare interconnessioni lunghe.",
      "Tie cells are distributed through the core and connected to small sink groups within library fanout and distance limits. They must lie in the same voltage domain or use a variant compatible with the receiver level. Routing keeps the tie net short and does not use the cell to drive long interconnect."
    ),
    whenUsed: loc(
      "È usata per ingressi costanti, mode strap interni, pin inutilizzati e costanti introdotte dalla sintesi. Tie insertion sostituisce connessioni dirette ai rail dopo il mapping secondo le regole del PDK. Segnali configurabili o testabili non devono essere congelati per errore con una tie cell.",
      "It is used for constant inputs, internal mode straps, unused pins, and constants introduced by synthesis. Tie insertion replaces direct rail connections after mapping according to PDK rules. Configurable or testable signals must not be accidentally frozen with a tie cell."
    ),
    technicalNotes: loc(
      [
        "Max fanout e max distance sono limiti library/PDK, non valori universali.",
        "L'uscita è debole e non è destinata a pilotare carichi o wire grandi.",
        "TIEHI e TIELO possono avere pin PG e well requirement differenti.",
        "LVS riconosce la costante attraverso la cella dedicata.",
        "Una connessione gate-to-rail diretta può violare reliability o antenna methodology.",
        "Multi-voltage design richiede tie compatibili con supply e threshold del sink.",
      ],
      [
        "Maximum fanout and distance are library/PDK limits, not universal values.",
        "The output is weak and not intended to drive large loads or wires.",
        "TIEHI and TIELO can have different PG pins and well requirements.",
        "LVS recognizes the constant through the dedicated cell.",
        "A direct gate-to-rail connection can violate reliability or antenna methodology.",
        "Multi-voltage designs need ties compatible with sink supply and threshold.",
      ]
    ),
    relatedCells: ["tap", "filler"],
  },
  {
    id: "psw",
    name: loc("Power Switch — Header / Footer", "Power Switch — Header / Footer"),
    category: loc("Low Power", "Low Power"),
    function: loc(
      "Connette o disconnette una supply switched dal rail principale per realizzare power gating. Un header PMOS controlla tipicamente VDD→VDD_SW, mentre un footer NMOS controlla VSS_SW→VSS. In ON la rete deve avere RON abbastanza bassa per IR drop; in OFF limita leakage del dominio.",
      "It connects or disconnects a switched supply from the main rail to implement power gating. A PMOS header typically controls VDD→VDD_SW, while an NMOS footer controls VSS_SW→VSS. In ON state the network needs sufficiently low RON for IR drop; in OFF state it limits domain leakage."
    ),
    placement: loc(
      "Le switch cell sono disposte in ring, column o distributed grid lungo e dentro la voltage area. Width, pitch e numero derivano da corrente di picco, static/dynamic IR, EM e inrush analysis. I pin di controllo e acknowledge devono restare su supply always-on e seguire una sequenza fisicamente robusta.",
      "Switch cells are arranged as rings, columns, or a distributed grid along and inside the voltage area. Width, pitch, and count derive from peak current, static/dynamic IR, EM, and inrush analysis. Control and acknowledge pins must remain on always-on power and follow a physically robust sequence."
    ),
    whenUsed: loc(
      "Sono usate nei power domain UPF che possono essere spenti per ridurre leakage. Il power controller abilita gruppi in sequenza dopo isolation e retention save, poi li riaccende limitando inrush. Un dominio always-on o privo di stato power-gated non necessita automaticamente di switch cell.",
      "They are used in UPF power domains that can shut down to reduce leakage. The power controller enables groups in sequence after isolation and retention save, then powers them back up while limiting inrush. An always-on domain or one without power-gated state does not automatically need switch cells."
    ),
    technicalNotes: loc(
      [
        "create_power_switch e power-state table UPF definiscono porte, supply e stati.",
        "RON aggregata determina droop; il numero di switch non si sceglie solo per area.",
        "Staged enable o daisy chain limita inrush e ground bounce all'accensione.",
        "EM va verificata su rail, vias e pin PG di ogni switch.",
        "Fine-grain e coarse-grain power gating hanno placement e overhead differenti.",
        "Isolation, retention e always-on control devono rispettare una sequenza verificata.",
      ],
      [
        "UPF create_power_switch and the power-state table define ports, supplies, and states.",
        "Aggregate RON determines droop; switch count is not chosen by area alone.",
        "Staged enable or daisy chaining limits inrush and ground bounce at power-up.",
        "EM must be checked on rails, vias, and every switch's PG pins.",
        "Fine-grain and coarse-grain power gating have different placement and overhead.",
        "Isolation, retention, and always-on control must follow a verified sequence.",
      ]
    ),
    relatedCells: ["iso", "retention_ff", "decap", "ls"],
  },
  {
    id: "iso",
    name: loc("ISO — Isolation Cell", "ISO — Isolation Cell"),
    category: loc("Low Power", "Low Power"),
    function: loc(
      "Forza l'uscita di un dominio che si spegne a un valore sicuro prima che la sorgente diventi X o floating. Per una clamp-low tipica Y = ISO_EN ? 0 : A, mentre varianti clamp-high usano 1. La cella è alimentata da una supply disponibile durante lo shutdown, spesso always-on.",
      "It forces the output of a shutting-down domain to a safe value before the source becomes X or floating. For a typical clamp-low cell, Y = ISO_EN ? 0 : A, while clamp-high variants use 1. The cell is powered by a supply that remains available during shutdown, often always-on."
    ),
    placement: loc(
      "Viene collocata al confine del power domain sul lato la cui supply resta accesa, secondo la location rule UPF. Il routing deve connettere correttamente source, receiver, isolation control e secondary PG pins. Il placer raggruppa crossing correlati senza creare congestion lungo il bordo della voltage area.",
      "It is placed at the power-domain boundary on the side whose supply remains on, according to the UPF location rule. Routing must correctly connect source, receiver, isolation control, and secondary PG pins. Placement groups related crossings without creating congestion along the voltage-area boundary."
    ),
    whenUsed: loc(
      "È richiesta su segnali che escono da un dominio power-gated verso logica ancora attiva. La strategia UPF specifica elementi, clamp value, sense del controllo e location. L'isolation deve attivarsi prima dello switch-off e rilasciarsi solo dopo power-good e restore validi.",
      "It is required on signals leaving a power-gated domain for logic that remains active. The UPF strategy specifies elements, clamp value, control sense, and location. Isolation must assert before switch-off and release only after valid power-good and restore."
    ),
    technicalNotes: loc(
      [
        "Clamp 0 o 1 va scelto per uno stato funzionalmente sicuro del receiver.",
        "Il controllo isolation è always-on e deve essere definito anche negli stati di power-down.",
        "Power-aware simulation propaga corruption se la strategia o la sequenza è errata.",
        "Combined ISO+LS può ridurre area per crossing che cambia anche tensione.",
        "STA include l'arco dati e i vincoli del controllo di isolamento.",
        "Conformal Low Power o equivalenti verificano inserimento e coerenza UPF/netlist.",
      ],
      [
        "Clamp 0 or 1 must be selected for a functionally safe receiver state.",
        "Isolation control is always-on and must be defined during power-down states.",
        "Power-aware simulation propagates corruption when strategy or sequencing is wrong.",
        "Combined ISO+LS can reduce area for crossings that also change voltage.",
        "STA includes the data arc and isolation-control constraints.",
        "Conformal Low Power or equivalents verify insertion and UPF/netlist consistency.",
      ]
    ),
    relatedCells: ["ls", "psw", "retention_ff"],
  },
  {
    id: "ls",
    name: loc("LS — Level Shifter", "LS — Level Shifter"),
    category: loc("Low Power", "Low Power"),
    function: loc(
      "Converte un segnale digitale fra domini con tensioni diverse preservandone il valore logico. Una L2H usa tipicamente una struttura cross-coupled per portare un livello basso-voltage alla piena VDD alta, mentre H2L limita overstress sul receiver. Alcune varianti integrano isolation o enable per crossing verso domini switched.",
      "It converts a digital signal between different-voltage domains while preserving its logic value. An L2H typically uses a cross-coupled structure to raise a low-voltage signal to full high VDD, while an H2L prevents receiver overstress. Some variants integrate isolation or enable for crossings into switched domains."
    ),
    placement: loc(
      "Si colloca al confine delle voltage area nel dominio specificato dalla UPF location policy e dalla direzione della cella. Deve accedere alle supply source e destination indicate dai secondary PG pins. Il boundary placement riduce wire a tensione incompatibile e concentra abbastanza risorse di routing senza creare un muro congestionato.",
      "It is placed at voltage-area boundaries in the domain specified by UPF location policy and cell direction. It must access source and destination supplies indicated by secondary PG pins. Boundary placement reduces incompatible-voltage wiring while providing routing resources without creating a congested wall."
    ),
    whenUsed: loc(
      "È necessaria quando un crossing viola i livelli riconosciuti o l'affidabilità oxide del dominio ricevente. UPF set_level_shifter definisce direzione, threshold, elementi e location per inserimento automatico. Non ogni crossing high-to-low richiede la stessa cella, quindi si seguono limiti di libreria e PDK.",
      "It is required when a crossing would violate receiver logic levels or oxide reliability. UPF set_level_shifter defines direction, threshold, elements, and location for automatic insertion. Not every high-to-low crossing needs the same cell, so library and PDK limits govern selection."
    ),
    technicalNotes: loc(
      [
        "L2H e H2L sono master distinti con range di tensione qualificati.",
        "Secondary PG pins devono essere connessi alle supply corrette in netlist e layout.",
        "Il delay aggiunto può dominare path di controllo fra domini.",
        "Combined level-shifter/isolation richiede clamp e control sense coerenti con UPF.",
        "Liberty multi-voltage caratterizza archi ai rail source e destination supportati.",
        "LVS, ERC e power-aware simulation verificano overstress, supply e comportamento negli stati power.",
      ],
      [
        "L2H and H2L are distinct masters with qualified voltage ranges.",
        "Secondary PG pins must connect to correct supplies in netlist and layout.",
        "Added delay can dominate inter-domain control paths.",
        "Combined level-shifter/isolation needs clamp and control sense consistent with UPF.",
        "Multi-voltage Liberty characterizes arcs at supported source and destination rails.",
        "LVS, ERC, and power-aware simulation verify overstress, supplies, and power-state behavior.",
      ]
    ),
    relatedCells: ["iso", "psw", "retention_ff"],
  },
  {
    id: "gdhs",
    name: loc("GDHS — Guard / High-Strength PDK Cell", "GDHS — Guard / High-Strength PDK Cell"),
    category: loc("Filler & Physical", "Filler & Physical"),
    function: loc(
      "GDHS non è un nome standard universale e il significato esatto dipende dal PDK o dalla libreria. Può indicare una cella di guardia, una boundary cell o un driver speciale ad alta forza per separare regioni rumorose. La funzione elettrica e le connessioni devono quindi essere ricavate da LEF, Liberty e library application note, non dal nome.",
      "GDHS is not a universal standard-cell name, and its exact meaning depends on the PDK or library. It may denote a guard cell, boundary cell, or special high-strength driver separating noisy regions. Its electrical function and connections must therefore come from LEF, Liberty, and the library application note rather than its name."
    ),
    placement: loc(
      "Se è una guard/boundary cell, viene collocata lungo il confine analogico-digitale, di voltage area o di row indicato dal foundry flow. Se è un driver, deve stare nel dominio corretto vicino al carico e con accesso PG adeguato. Region constraints, orientamenti e abutment ammessi sono specifici del master.",
      "When it is a guard or boundary cell, it is placed along the analog/digital, voltage-area, or row boundary specified by the foundry flow. When it is a driver, it must be in the correct domain near its load with adequate PG access. Region constraints, orientations, and legal abutments are master-specific."
    ),
    whenUsed: loc(
      "Si usa soltanto quando il reference flow o la guida della libreria richiedono esplicitamente quel master. Può contribuire a isolamento del rumore, boundary DRC o pilotaggio locale, a seconda della definizione reale. Non va trattata come equivalente automatico di endcap, decap o BUFX32.",
      "It is used only when the reference flow or library guide explicitly requires that master. It may support noise isolation, boundary DRC, or local drive depending on its actual definition. It must not be treated as an automatic equivalent of an endcap, decap, or BUFX32."
    ),
    technicalNotes: loc(
      [
        "Il nome GDHS è library-specific e non codifica una funzione IEEE o Liberty universale.",
        "LEF rivela geometria, obstruction, pin e regole di abutment.",
        "Liberty, se presente, rivela funzione booleana, timing, power e drive.",
        "PG pin e well domain devono essere verificati prima dell'inserimento.",
        "Non sostituisce endcap, tap o decap senza documentazione esplicita.",
        "DRC/LVS e la library application note sono l'autorità per uso e placement.",
      ],
      [
        "The GDHS name is library-specific and encodes no universal IEEE or Liberty function.",
        "LEF reveals geometry, obstructions, pins, and abutment rules.",
        "Liberty, when present, reveals Boolean function, timing, power, and drive.",
        "PG pins and well domain must be verified before insertion.",
        "It does not replace an endcap, tap, or decap without explicit documentation.",
        "DRC/LVS and the library application note are authoritative for use and placement.",
      ]
    ),
    relatedCells: ["endcap", "decap", "buf"],
  },
  {
    id: "antenna",
    name: loc("Antenna Cell — Protezione di processo", "Antenna Cell — Process Protection"),
    category: loc("DFT & Test", "DFT & Test"),
    function: loc(
      "Fornisce un percorso di scarica per la carica plasma accumulata su segmenti metallici durante la fabbricazione. Protegge l'ossido sottile del gate mantenendo cumulative antenna ratio e partial antenna ratio entro i limiti del rule deck. Non modifica la funzione logica del net in condizioni operative normali.",
      "It provides a discharge path for plasma charge accumulated on metal segments during fabrication. It protects thin gate oxide by keeping cumulative and partial antenna ratios within rule-deck limits. It does not change the net's logic function during normal operation."
    ),
    placement: loc(
      "Viene inserita vicino al gate vittima o in un sito legalmente raggiungibile sullo stesso net. La connessione deve avvenire al layer e alla fase di processo considerati dalla regola antenna. Il repair engine bilancia distanza, capacità aggiunta, leakage e disponibilità di siti.",
      "It is inserted near the victim gate or at a legally reachable site on the same net. Connection must occur at the layer and process stage covered by the antenna rule. The repair engine balances distance, added capacitance, leakage, and site availability."
    ),
    whenUsed: loc(
      "È usata dopo global/detail routing quando il signoff antenna check segnala una violazione. Può essere pre-inserita su net molto lunghe o sensibili se il flow lo raccomanda. Alternative valide sono jumper verso layer superiore o buffer insertion, scelte in base al rule deck.",
      "It is used after global or detailed routing when signoff antenna checks report a violation. It may be preinserted on very long or sensitive nets when the flow recommends it. Valid alternatives include a jumper to a higher layer or buffer insertion, selected according to the rule deck."
    ),
    technicalNotes: loc(
      [
        "Le formule AR usano aree o perimetri layer-specific e gate oxide area definiti dal foundry.",
        "Cumulative e partial antenna check possono fallire in fasi di processo differenti.",
        "Il diodo aggiunge junction capacitance e leakage al net funzionale.",
        "Un metal jumper cambia la sequenza di esposizione senza aggiungere capacità di gate locale.",
        "Calibre, ICV o Pegasus usano il rule deck signoff come autorità finale.",
        "Antenna protection non è ESD protection degli IO e opera su scale diverse.",
      ],
      [
        "AR formulas use layer-specific areas or perimeters and foundry-defined gate oxide area.",
        "Cumulative and partial antenna checks can fail at different process stages.",
        "The diode adds junction capacitance and leakage to the functional net.",
        "A metal jumper changes exposure sequence without adding local gate capacitance.",
        "Calibre, ICV, or Pegasus uses the signoff rule deck as final authority.",
        "Antenna protection is not I/O ESD protection and operates at a different scale.",
      ]
    ),
    relatedCells: ["diode", "buf"],
  },
  {
    id: "diode",
    name: loc("DIODE — Antenna Diode", "DIODE — Antenna Diode"),
    category: loc("Filler & Physical", "Filler & Physical"),
    function: loc(
      "Implementa fisicamente il diodo di scarica usato per proteggere i gate dalla carica plasma. La junction verso substrate o well conduce la carica di processo prima che la tensione danneggi l'ossido. Durante il normale funzionamento resta polarizzata in modo da non alterare il valore logico.",
      "It physically implements the discharge diode used to protect gates from plasma charging. Its junction to substrate or well conducts process charge before voltage damages gate oxide. During normal operation it is biased so that it does not alter the logic value."
    ),
    placement: loc(
      "È collocata in un sito standard vicino al pin gate vittima e collegata allo stesso net dal router. Orientamento, well e rail devono rispettare la polarità del master e il voltage domain. Una posizione troppo lontana o una connessione sul layer sbagliato può non soddisfare la regola antenna.",
      "It is placed on a standard site near the victim gate pin and connected to the same net by routing. Orientation, well, and rail must respect master polarity and voltage domain. A location too far away or a connection on the wrong layer may fail to satisfy the antenna rule."
    ),
    whenUsed: loc(
      "Si usa come repair per violazioni antenna quando jumper o buffer non sono preferibili. Il router può inserirla iterativamente e rieseguire legalizzazione, timing ed extraction. Non è un generico filler e non sostituisce i grandi clamp ESD del pad ring.",
      "It is used to repair antenna violations when a jumper or buffer is not preferable. Routing can insert it iteratively and rerun legalization, timing, and extraction. It is not a generic filler and does not replace the large ESD clamps in the pad ring."
    ),
    technicalNotes: loc(
      [
        "Area e polarità del diodo devono soddisfare la regola specifica del layer.",
        "La junction capacitance può degradare slew o setup su net critica.",
        "Leakage aumenta con area, voltage e temperatura.",
        "L'antenna ratio deve essere ricontrollato con il signoff rule deck dopo repair.",
        "Il master deve essere legale nel well e voltage domain della vittima.",
        "ESD diode IO e antenna diode standard-cell hanno dimensionamento e scopi distinti.",
      ],
      [
        "Diode area and polarity must satisfy the layer-specific rule.",
        "Junction capacitance can degrade slew or setup on a critical net.",
        "Leakage rises with area, voltage, and temperature.",
        "Antenna ratio must be rechecked with the signoff rule deck after repair.",
        "The master must be legal in the victim's well and voltage domain.",
        "I/O ESD diodes and standard-cell antenna diodes have distinct sizing and purposes.",
      ]
    ),
    relatedCells: ["antenna", "filler"],
  },
  {
    id: "spare",
    name: loc("Spare Cell", "Spare Cell"),
    category: loc("DFT & Test", "DFT & Test"),
    function: loc(
      "È una risorsa logica pre-posizionata ma inizialmente inutilizzata, riservata a ECO tardivi. Può essere un modulo spare con INV, BUF, NAND e NOR interni oppure istanze discrete tenute libere. Collegando soltanto metal e via si può correggere una funzione senza cambiare FEOL e diffusion mask.",
      "It is a preplaced but initially unused logic resource reserved for late ECOs. It may be a spare module containing INV, BUF, NAND, and NOR devices or discrete instances kept free. By changing only metal and vias, a function can be repaired without changing FEOL and diffusion masks."
    ),
    placement: loc(
      "Le spare sono distribuite uniformemente nel core e con maggiore densità vicino a logica critica o blocchi difficili da raggiungere. Devono avere alimentazione valida, siti legali e input legati in uno stato sicuro per evitare switching e leakage anomalo. Una sola regione spare lontana produce wire ECO lunghe e spesso inutilizzabili.",
      "Spares are distributed throughout the core with greater density near critical or hard-to-reach logic. They need valid power, legal sites, and safely tied inputs to avoid switching and abnormal leakage. One distant spare region creates long ECO wires and is often unusable."
    ),
    whenUsed: loc(
      "Sono usate per functional ECO, timing ECO e correzioni post-mask che devono limitarsi ai layer metallici. Il designer sceglie celle vicine con tipi e drive sufficienti e poi esegue equivalence, STA, DRC e LVS. La quantità riservata deriva dal rischio di progetto e dal budget area, non da una percentuale universale.",
      "They are used for functional ECOs, timing ECOs, and post-mask repairs constrained to metal layers. Designers select nearby cells with sufficient type and drive, then run equivalence, STA, DRC, and LVS. Reserved quantity follows project risk and area budget rather than a universal percentage."
    ),
    technicalNotes: loc(
      [
        "Gli ingressi inutilizzati devono essere connessi a tie cell secondo le regole della libreria.",
        "Metal-only ECO può usare solo dispositivi già fabbricati e layer consentiti.",
        "La distribuzione spaziale è più importante del solo conteggio totale.",
        "Drive, VT e funzioni disponibili limitano quali fix sono realizzabili.",
        "Ogni ECO richiede equivalence checking, extraction, STA e physical verification incrementali.",
        "Le spare non devono essere rimosse come filler durante ottimizzazione automatica.",
      ],
      [
        "Unused inputs must connect to tie cells according to library rules.",
        "A metal-only ECO can use only prefabricated devices and allowed layers.",
        "Spatial distribution matters more than total count alone.",
        "Available drive, VT, and functions constrain feasible repairs.",
        "Every ECO requires incremental equivalence checking, extraction, STA, and physical verification.",
        "Spares must not be removed as if they were fillers during automatic optimization.",
      ]
    ),
    relatedCells: ["tie", "filler", "buf", "nand2"],
  },
];
