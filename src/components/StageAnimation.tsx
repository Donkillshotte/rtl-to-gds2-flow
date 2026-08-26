"use client";

import { motion } from "framer-motion";
import type { StageId } from "@/data/stages";

interface StageAnimationProps {
  stageId: StageId;
  color: string;
}

export function StageAnimation({ stageId, color }: StageAnimationProps) {
  switch (stageId) {
    case "rtl":
      return <RTLAnimation color={color} />;
    case "verification":
      return <VerificationPyramidAnimation color={color} />;
    case "synthesis":
      return <SynthesisAnimation color={color} />;
    case "floorplan":
      return <FloorplanAnimation color={color} />;
    case "pdn":
      return <PDNAnimation color={color} />;
    case "placement":
      return <PlacementAnimation color={color} />;
    case "cts":
      return <CTSAnimation color={color} />;
    case "routing":
      return <RoutingAnimation color={color} />;
    case "layout":
      return <GDS2Animation color={color} />;
    case "sta":
      return <STAAnimation color={color} />;
    case "pv":
      return <VerificationAnimation color={color} />;
    case "power":
      return <PowerDroopAnimation color={color} />;
    case "package":
      return <PackageBumpAnimation color={color} />;
    case "tapeout":
      return <TapeoutChecklistAnimation color={color} />;
    default:
      return null;
  }
}

function RTLAnimation({ color }: { color: string }) {
  const blocks = [
    { x: 60, y: 40, w: 80, h: 50, label: "ALU" },
    { x: 180, y: 30, w: 70, h: 60, label: "REG" },
    { x: 290, y: 50, w: 90, h: 45, label: "FSM" },
    { x: 120, y: 130, w: 100, h: 55, label: "MEM IF" },
    { x: 260, y: 140, w: 75, h: 40, label: "DEC" },
  ];

  return (
    <svg viewBox="0 0 400 220" className="w-full h-full">
      <defs>
        <filter id="glow-rtl">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {blocks.map((b, i) => (
        <motion.g key={b.label} filter="url(#glow-rtl)">
          <motion.rect
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15, type: "spring" }}
            x={b.x}
            y={b.y}
            width={b.w}
            height={b.h}
            rx="6"
            fill={`${color}15`}
            stroke={color}
            strokeWidth="1.5"
          />
          <motion.text
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 + 0.2 }}
            x={b.x + b.w / 2}
            y={b.y + b.h / 2 + 4}
            textAnchor="middle"
            fill={color}
            fontSize="11"
            fontFamily="monospace"
          >
            {b.label}
          </motion.text>
        </motion.g>
      ))}
      {/* Animated data flow arrows */}
      {[
        { x1: 140, y1: 65, x2: 180, y2: 60 },
        { x1: 250, y1: 60, x2: 290, y2: 72 },
        { x1: 170, y1: 90, x2: 160, y2: 130 },
        { x1: 220, y1: 130, x2: 260, y2: 155 },
      ].map((line, i) => (
        <motion.line
          key={i}
          x1={line.x1}
          y1={line.y1}
          x2={line.x2}
          y2={line.y2}
          stroke={color}
          strokeWidth="1.5"
          strokeDasharray="4 4"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 0.6 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 + i * 0.1, duration: 0.8 }}
          className="animate-flow-dash"
        />
      ))}
      <motion.text
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        x="200"
        y="210"
        textAnchor="middle"
        fill="#64748b"
        fontSize="10"
        fontFamily="monospace"
      >
        always @(posedge clk) ...
      </motion.text>
    </svg>
  );
}

function SynthesisAnimation({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 400 220" className="w-full h-full">
      {/* Input: abstract RTL block */}
      <motion.rect
        initial={{ x: 20, opacity: 0 }}
        whileInView={{ x: 20, opacity: 1 }}
        viewport={{ once: true }}
        x="20"
        y="70"
        width="80"
        height="80"
        rx="8"
        fill={`${color}10`}
        stroke={color}
        strokeWidth="1.5"
      />
      <text x="60" y="115" textAnchor="middle" fill={color} fontSize="10" fontFamily="monospace">RTL</text>

      {/* Arrow */}
      <motion.path
        d="M 110 110 L 160 110"
        stroke={color}
        strokeWidth="2"
        fill="none"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.3 }}
      />
      <motion.polygon
        points="160,106 168,110 160,114"
        fill={color}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.8 }}
      />

      {/* Synthesis engine */}
      <motion.rect
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ type: "spring", delay: 0.4 }}
        x="175"
        y="85"
        width="50"
        height="50"
        rx="25"
        fill={`${color}25`}
        stroke={color}
        strokeWidth="2"
      />
      <text x="200" y="113" textAnchor="middle" fill={color} fontSize="8" fontFamily="monospace">DC</text>

      {/* Output: gate cells */}
      <motion.g
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.9 }}
      >
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const row = Math.floor(i / 3);
          const col = i % 3;
          return (
            <motion.rect
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 1 + i * 0.08 }}
              x={270 + col * 35}
              y={60 + row * 35}
              width="28"
              height="28"
              rx="3"
              fill={`${color}20`}
              stroke={color}
              strokeWidth="1"
            />
          );
        })}
        <text x="320" y="155" textAnchor="middle" fill="#64748b" fontSize="10" fontFamily="monospace">
          Standard Cells
        </text>
      </motion.g>
    </svg>
  );
}

function FloorplanAnimation({ color }: { color: string }) {
  const macros = [
    { x: 30, y: 30, w: 100, h: 70, label: "SRAM" },
    { x: 270, y: 30, w: 100, h: 70, label: "PLL" },
    { x: 30, y: 120, w: 80, h: 70, label: "IO" },
    { x: 270, y: 120, w: 100, h: 70, label: "ADC" },
  ];

  return (
    <svg viewBox="0 0 400 220" className="w-full h-full">
      {/* Die outline */}
      <motion.rect
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        x="15"
        y="15"
        width="370"
        height="190"
        rx="4"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeDasharray="800"
      />

      {/* Core area */}
      <motion.rect
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.3 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5 }}
        x="120"
        y="50"
        width="160"
        height="120"
        rx="2"
        fill={`${color}15`}
        stroke={color}
        strokeWidth="1"
        strokeDasharray="4 4"
      />
      <text x="200" y="115" textAnchor="middle" fill={color} fontSize="10" fontFamily="monospace" opacity="0.6">
        CORE
      </text>

      {macros.map((m, i) => (
        <motion.g key={m.label}>
          <motion.rect
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 + i * 0.12, type: "spring" }}
            x={m.x}
            y={m.y}
            width={m.w}
            height={m.h}
            rx="3"
            fill={`${color}25`}
            stroke={color}
            strokeWidth="1.5"
          />
          <text x={m.x + m.w / 2} y={m.y + m.h / 2 + 4} textAnchor="middle" fill={color} fontSize="10" fontFamily="monospace">
            {m.label}
          </text>
        </motion.g>
      ))}

      {/* Power rings */}
      <motion.rect
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.4 }}
        viewport={{ once: true }}
        transition={{ delay: 0.8 }}
        x="20"
        y="20"
        width="360"
        height="180"
        rx="3"
        fill="none"
        stroke="#ef4444"
        strokeWidth="3"
        opacity="0.3"
      />
    </svg>
  );
}

function PlacementAnimation({ color }: { color: string }) {
  const cells = Array.from({ length: 48 }, (_, i) => ({
    x: 40 + (i % 12) * 28,
    y: 40 + Math.floor(i / 12) * 22,
    delay: i * 0.02,
  }));

  return (
    <svg viewBox="0 0 400 220" className="w-full h-full">
      {/* Rows */}
      {[0, 1, 2, 3].map((row) => (
        <motion.rect
          key={row}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.15 }}
          viewport={{ once: true }}
          x="35"
          y={35 + row * 22}
          width="330"
          height="18"
          fill={color}
          rx="1"
        />
      ))}

      {cells.map((cell, i) => (
        <motion.rect
          key={i}
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: cell.delay, type: "spring", stiffness: 200 }}
          x={cell.x}
          y={cell.y}
          width="22"
          height="14"
          rx="2"
          fill={`${color}40`}
          stroke={color}
          strokeWidth="0.8"
        />
      ))}

      <motion.text
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        x="200"
        y="210"
        textAnchor="middle"
        fill="#64748b"
        fontSize="10"
        fontFamily="monospace"
      >
        Timing-driven placement
      </motion.text>
    </svg>
  );
}

function CTSAnimation({ color }: { color: string }) {
  const leaves = [
    { x: 50, y: 170 }, { x: 100, y: 170 }, { x: 150, y: 170 },
    { x: 200, y: 170 }, { x: 250, y: 170 }, { x: 300, y: 170 }, { x: 350, y: 170 },
    { x: 75, y: 130 }, { x: 175, y: 130 }, { x: 275, y: 130 },
    { x: 125, y: 90 }, { x: 275, y: 90 },
  ];

  return (
    <svg viewBox="0 0 400 220" className="w-full h-full">
      {/* Clock root */}
      <motion.circle
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ type: "spring" }}
        cx="200"
        cy="30"
        r="12"
        fill={color}
      />
      <text x="200" y="34" textAnchor="middle" fill="#030712" fontSize="8" fontWeight="bold" fontFamily="monospace">CLK</text>

      {/* Tree branches */}
      {leaves.map((leaf, i) => (
        <motion.g key={i}>
          <motion.path
            d={`M 200 42 L 200 60 L ${leaf.x} ${leaf.y - 20} L ${leaf.x} ${leaf.y}`}
            fill="none"
            stroke={color}
            strokeWidth="1.5"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 0.7 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 + i * 0.06, duration: 0.6 }}
          />
          <motion.circle
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 + i * 0.06, type: "spring" }}
            cx={leaf.x}
            cy={leaf.y}
            r="6"
            fill={`${color}30`}
            stroke={color}
            strokeWidth="1"
          />
        </motion.g>
      ))}

      {/* Pulse wave */}
      <motion.circle
        cx="200"
        cy="30"
        r="12"
        fill="none"
        stroke={color}
        strokeWidth="1"
        initial={{ scale: 1, opacity: 0.8 }}
        animate={{ scale: 3, opacity: 0 }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeOut" }}
      />
    </svg>
  );
}

function RoutingAnimation({ color }: { color: string }) {
  const routes = [
    { d: "M 50 40 L 50 100 L 150 100 L 150 160", layer: "M1" },
    { d: "M 100 40 L 100 80 L 200 80 L 200 160", layer: "M2" },
    { d: "M 150 40 L 150 60 L 250 60 L 250 160", layer: "M3" },
    { d: "M 200 40 L 200 120 L 300 120 L 300 160", layer: "M4" },
    { d: "M 250 40 L 250 90 L 350 90 L 350 160", layer: "M1" },
  ];

  const layerColors = ["#22d3ee", "#a78bfa", "#34d399", "#fbbf24", "#f472b6"];

  return (
    <svg viewBox="0 0 400 220" className="w-full h-full">
      {/* Cell row at bottom */}
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <rect key={i} x={30 + i * 50} y="165" width="35" height="20" rx="2" fill={`${color}20`} stroke={color} strokeWidth="0.8" />
      ))}

      {routes.map((route, i) => (
        <motion.g key={i}>
          <motion.path
            d={route.d}
            fill="none"
            stroke={layerColors[i]}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 0.8 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.2, duration: 1 }}
          />
          {/* Via dots */}
          {route.d.match(/L \d+ \d+/g)?.map((_, vi) => (
            <motion.circle
              key={vi}
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 + i * 0.2 + vi * 0.1 }}
              cx={0}
              cy={0}
              r="3"
              fill={layerColors[i]}
            />
          ))}
        </motion.g>
      ))}

      {/* Layer legend */}
      {layerColors.map((c, i) => (
        <g key={i}>
          <rect x={300 + (i % 2) * 45} y={20 + Math.floor(i / 2) * 18} width="12" height="12" rx="2" fill={`${c}40`} stroke={c} strokeWidth="1" />
          <text x={316 + (i % 2) * 45} y={30 + Math.floor(i / 2) * 18} fill="#94a3b8" fontSize="8" fontFamily="monospace">M{i + 1}</text>
        </g>
      ))}
    </svg>
  );
}

function VerificationAnimation({ color }: { color: string }) {
  const checks = [
    { label: "DRC", x: 80, status: "PASS" },
    { label: "LVS", x: 160, status: "PASS" },
    { label: "STA", x: 240, status: "PASS" },
    { label: "IR", x: 320, status: "PASS" },
  ];

  return (
    <svg viewBox="0 0 400 220" className="w-full h-full">
      {/* Scan grid */}
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) =>
        [0, 1, 2, 3, 4].map((j) => (
          <motion.rect
            key={`${i}-${j}`}
            x={50 + i * 38}
            y={30 + j * 22}
            width="34"
            height="18"
            rx="2"
            fill={`${color}08`}
            stroke={`${color}20`}
            strokeWidth="0.5"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: (i + j) * 0.03 }}
          />
        ))
      )}

      {/* Scan line */}
      <motion.rect
        x="45"
        width="310"
        height="3"
        fill={color}
        opacity="0.6"
        initial={{ y: 25 }}
        animate={{ y: [25, 145, 25] }}
        transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
      />

      {/* Check results */}
      {checks.map((check, i) => (
        <motion.g key={check.label}>
          <motion.rect
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 + i * 0.15 }}
            x={check.x - 30}
            y="160"
            width="60"
            height="45"
            rx="8"
            fill="#34d39915"
            stroke="#34d399"
            strokeWidth="1.5"
          />
          <text x={check.x} y="180" textAnchor="middle" fill="#34d399" fontSize="11" fontWeight="bold" fontFamily="monospace">
            {check.label}
          </text>
          <text x={check.x} y="196" textAnchor="middle" fill="#34d399" fontSize="9" fontFamily="monospace">
            ✓ {check.status}
          </text>
        </motion.g>
      ))}
    </svg>
  );
}

function GDS2Animation({ color }: { color: string }) {
  const layers = [
    { label: "NWELL", color: "#fef3c7", y: 140 },
    { label: "ACTIVE", color: "#fca5a5", y: 120 },
    { label: "POLY", color: "#fde047", y: 100 },
    { label: "M1", color: "#22d3ee", y: 80 },
    { label: "M2", color: "#a78bfa", y: 60 },
    { label: "M3", color: "#34d399", y: 40 },
  ];

  return (
    <svg viewBox="0 0 400 220" className="w-full h-full">
      {layers.map((layer, i) => (
        <motion.g key={layer.label}>
          <motion.rect
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 0.7, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 }}
            x="80"
            y={layer.y}
            width="240"
            height="16"
            rx="2"
            fill={layer.color}
            opacity="0.5"
          />
          <text x="60" y={layer.y + 12} textAnchor="end" fill="#94a3b8" fontSize="9" fontFamily="monospace">
            {layer.label}
          </text>
        </motion.g>
      ))}

      <motion.rect
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 1, type: "spring" }}
        x="130"
        y="30"
        width="140"
        height="140"
        rx="4"
        fill={`${color}15`}
        stroke={color}
        strokeWidth="2"
      />

      {[0, 1, 2, 3, 4].map((i) => (
        <motion.rect
          key={i}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.6 }}
          viewport={{ once: true }}
          transition={{ delay: 1.2 + i * 0.08 }}
          x={145 + (i % 3) * 35}
          y={50 + Math.floor(i / 3) * 35}
          width="25"
          height="25"
          rx="1"
          fill={`${color}30`}
          stroke={color}
          strokeWidth="0.5"
        />
      ))}

      <motion.text
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 1.5 }}
        x="200"
        y="210"
        textAnchor="middle"
        fill={color}
        fontSize="11"
        fontWeight="bold"
        fontFamily="monospace"
      >
        design.gds
      </motion.text>
    </svg>
  );
}

function PDNAnimation({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 400 220" className="w-full h-full" aria-hidden>
      <motion.rect x="30" y="25" width="340" height="170" rx="4" fill="none" stroke={color} strokeWidth="1.5"
        initial={{ opacity: 0 }} whileInView={{ opacity: 0.5 }} viewport={{ once: true }} />
      {/* Rings */}
      <motion.rect x="30" y="25" width="340" height="10" fill="#22d3ee" opacity={0.7}
        initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} style={{ transformOrigin: "30px 30px" }} />
      <motion.rect x="30" y="185" width="340" height="10" fill="#64748b" opacity={0.7}
        initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ delay: 0.1 }} />
      {/* Straps */}
      {[70, 110, 150].map((y, i) => (
        <motion.rect key={y} x="50" y={y} width="300" height="6" fill={color} opacity={0.55}
          initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }}
          transition={{ delay: 0.2 + i * 0.1 }} style={{ transformOrigin: "50px center" }} />
      ))}
      {/* Rails */}
      {Array.from({ length: 10 }).map((_, i) => (
        <motion.rect key={i} x={60 + i * 28} y="45" width="4" height="130"
          fill={i % 2 === 0 ? "#22d3ee" : "#94a3b8"} opacity={0.85}
          initial={{ scaleY: 0 }} whileInView={{ scaleY: 1 }} viewport={{ once: true }}
          transition={{ delay: 0.4 + i * 0.04 }} style={{ transformOrigin: "center 175px" }} />
      ))}
      <text x="200" y="215" textAnchor="middle" fill="#64748b" fontSize="10" fontFamily="monospace">
        bump → ring → strap → rail
      </text>
    </svg>
  );
}

function STAAnimation({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 400 220" className="w-full h-full" aria-hidden>
      <line x1="40" y1="110" x2="360" y2="110" stroke="#334155" strokeWidth="1" />
      <motion.line x1="90" y1="40" x2="90" y2="160" stroke={color} strokeWidth="2"
        initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} />
      <motion.line x1="290" y1="40" x2="290" y2="160" stroke={color} strokeWidth="2"
        initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }} />
      <text x="90" y="30" textAnchor="middle" fill={color} fontSize="11" fontFamily="monospace">launch</text>
      <text x="290" y="30" textAnchor="middle" fill={color} fontSize="11" fontFamily="monospace">capture</text>
      <motion.path d="M100 120 Q190 160 280 120" fill="none" stroke="#f472b6" strokeWidth="2"
        initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ delay: 0.4, duration: 0.8 }} />
      <text x="190" y="175" textAnchor="middle" fill="#f472b6" fontSize="10" fontFamily="monospace">
        Tco + Tpd ≤ Tclk − Tsu
      </text>
      <motion.path d="M100 95 Q140 60 180 95" fill="none" stroke="#fb923c" strokeWidth="2"
        initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ delay: 0.7, duration: 0.6 }} />
      <text x="190" y="205" textAnchor="middle" fill="#fb923c" fontSize="10" fontFamily="monospace">
        hold: Tco + Tpd ≥ Thold
      </text>
    </svg>
  );
}

function PowerDroopAnimation({ color }: { color: string }) {
  const pts = "40,80 80,78 120,90 160,70 200,110 240,85 280,95 320,75 360,88";
  return (
    <svg viewBox="0 0 400 220" className="w-full h-full" aria-hidden>
      <text x="20" y="30" fill="#94a3b8" fontSize="10" fontFamily="monospace">VDD</text>
      <line x1="40" y1="50" x2="360" y2="50" stroke="#334155" strokeDasharray="4 4" />
      <text x="365" y="54" fill="#64748b" fontSize="9" fontFamily="monospace">nom</text>
      <line x1="40" y1="120" x2="360" y2="120" stroke="#ef444480" strokeDasharray="4 4" />
      <text x="365" y="124" fill="#ef4444" fontSize="9" fontFamily="monospace">min</text>
      <motion.polyline
        points={pts}
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.4 }}
      />
      <motion.circle cx="200" cy="110" r="5" fill="#ef4444"
        initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.9 }} />
      <text x="200" y="145" textAnchor="middle" fill="#ef4444" fontSize="10" fontFamily="monospace">
        WORST_dI/dt droop
      </text>
      <text x="200" y="205" textAnchor="middle" fill="#64748b" fontSize="10" fontFamily="monospace">
        voltage vs time
      </text>
    </svg>
  );
}

function PackageBumpAnimation({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 400 220" className="w-full h-full" aria-hidden>
      <motion.rect x="70" y="30" width="260" height="160" rx="6" fill={`${color}10`} stroke={color} strokeWidth="1.5"
        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} />
      {Array.from({ length: 8 }).map((_, r) =>
        Array.from({ length: 10 }).map((_, c) => {
          const isPower = (r + c) % 3 === 0;
          return (
            <motion.circle
              key={`${r}-${c}`}
              cx={95 + c * 22}
              cy={50 + r * 18}
              r={isPower ? 5 : 3.5}
              fill={isPower ? "#22d3ee" : `${color}80`}
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: (r * 10 + c) * 0.01 }}
            />
          );
        })
      )}
      <text x="200" y="210" textAnchor="middle" fill="#64748b" fontSize="10" fontFamily="monospace">
        cyan = VDD/VSS bumps · others = signal
      </text>
    </svg>
  );
}

function TapeoutChecklistAnimation({ color }: { color: string }) {
  const items = ["GKC", "BTO", "MTO", "TOR", "SHA"];
  return (
    <svg viewBox="0 0 400 220" className="w-full h-full" aria-hidden>
      {items.map((label, i) => (
        <motion.g key={label}>
          <motion.rect
            x={40 + i * 70}
            y="70"
            width="58"
            height="70"
            rx="8"
            fill="#34d39915"
            stroke="#34d399"
            strokeWidth="1.5"
            initial={{ y: 100, opacity: 0 }}
            whileInView={{ y: 70, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.12 }}
          />
          <text x={69 + i * 70} y="100" textAnchor="middle" fill="#34d399" fontSize="12" fontFamily="monospace" fontWeight="bold">
            {label}
          </text>
          <text x={69 + i * 70} y="120" textAnchor="middle" fill="#34d399" fontSize="14">✓</text>
        </motion.g>
      ))}
      <motion.path
        d="M70 160 H330"
        stroke={color}
        strokeWidth="2"
        strokeDasharray="6 4"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.7, duration: 0.8 }}
      />
      <text x="200" y="195" textAnchor="middle" fill={color} fontSize="11" fontFamily="monospace">
        foundry data package
      </text>
    </svg>
  );
}

function VerificationPyramidAnimation({ color }: { color: string }) {
  const bands = [
    { y: 40, w: 80, label: "Formal" },
    { y: 85, w: 160, label: "Unit / UVM" },
    { y: 130, w: 260, label: "System / SW" },
  ];
  return (
    <svg viewBox="0 0 400 220" className="w-full h-full" aria-hidden>
      {bands.map((b, i) => (
        <motion.g key={b.label}>
          <motion.rect
            x={(400 - b.w) / 2}
            y={b.y}
            width={b.w}
            height="36"
            rx="6"
            fill={`${color}${20 + i * 15}`}
            stroke={color}
            strokeWidth="1.5"
            initial={{ scaleX: 0, opacity: 0 }}
            whileInView={{ scaleX: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.2 }}
            style={{ transformOrigin: "200px center" }}
          />
          <text x="200" y={b.y + 23} textAnchor="middle" fill={color} fontSize="12" fontFamily="monospace">
            {b.label}
          </text>
        </motion.g>
      ))}
      <text x="200" y="200" textAnchor="middle" fill="#64748b" fontSize="10" fontFamily="monospace">
        more cycles ↓ · more proof ↑
      </text>
    </svg>
  );
}
