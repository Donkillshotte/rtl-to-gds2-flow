"use client";

import { motion } from "framer-motion";
import { stages } from "@/data/stages";

export function FlowOverview() {
  return (
    <section id="flow-overview" className="relative py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Il Flusso Completo
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Otto fasi che trasformano un design logico in un layout fisico pronto
            per la fabbricazione del silicio.
          </p>
        </motion.div>

        <div className="relative">
          {/* Connection line */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-px -translate-y-1/2">
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="h-full bg-gradient-to-r from-cyan-500/0 via-cyan-500/40 to-blue-500/0 origin-left"
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 md:gap-3">
            {stages.map((stage, i) => (
              <motion.a
                key={stage.id}
                href={`#stage-${stage.id}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                whileHover={{ y: -6, scale: 1.05 }}
                className="group relative flex flex-col items-center text-center"
              >
                <div
                  className="w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center font-mono font-bold text-lg mb-3 transition-all group-hover:shadow-lg"
                  style={{
                    background: `${stage.color}15`,
                    border: `1px solid ${stage.color}40`,
                    boxShadow: `0 0 0 0 ${stage.glowColor}`,
                  }}
                >
                  <span style={{ color: stage.color }}>{stage.step}</span>
                </div>
                <span className="text-xs md:text-sm font-medium text-slate-300 group-hover:text-white transition-colors leading-tight">
                  {stage.title}
                </span>
                <span className="text-[10px] md:text-xs text-slate-500 mt-0.5 hidden md:block">
                  {stage.subtitle}
                </span>
              </motion.a>
            ))}
          </div>
        </div>

        {/* Flow diagram */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-20 glass rounded-2xl p-8 md:p-12"
        >
          <svg viewBox="0 0 900 200" className="w-full h-auto" aria-hidden="true">
            <defs>
              <linearGradient id="flowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#22d3ee" />
                <stop offset="50%" stopColor="#a78bfa" />
                <stop offset="100%" stopColor="#60a5fa" />
              </linearGradient>
              <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                <polygon points="0 0, 8 3, 0 6" fill="#64748b" />
              </marker>
            </defs>

            {stages.map((stage, i) => {
              const x = 30 + i * 110;
              const y = 80;
              return (
                <g key={stage.id}>
                  {i < stages.length - 1 && (
                    <line
                      x1={x + 35}
                      y1={y}
                      x2={x + 75}
                      y2={y}
                      stroke="url(#flowGrad)"
                      strokeWidth="2"
                      strokeDasharray="6 4"
                      className="animate-flow-dash"
                      opacity="0.5"
                    />
                  )}
                  <motion.rect
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    x={x - 30}
                    y={y - 25}
                    width="60"
                    height="50"
                    rx="8"
                    fill={`${stage.color}20`}
                    stroke={stage.color}
                    strokeWidth="1.5"
                  />
                  <text
                    x={x}
                    y={y + 5}
                    textAnchor="middle"
                    fill={stage.color}
                    fontSize="11"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    {stage.id.toUpperCase().slice(0, 4)}
                  </text>
                  <text
                    x={x}
                    y={y + 45}
                    textAnchor="middle"
                    fill="#94a3b8"
                    fontSize="8"
                    fontFamily="sans-serif"
                  >
                    {stage.title.split(" ")[0]}
                  </text>
                </g>
              );
            })}

            <text x="450" y="30" textAnchor="middle" fill="#64748b" fontSize="12" fontFamily="monospace">
              DATA FLOW: RTL → NETLIST → LAYOUT → GDSII
            </text>
            <text x="450" y="170" textAnchor="middle" fill="#475569" fontSize="10" fontFamily="sans-serif">
              Iterazioni di timing closure e ECO possono ripetere placement → CTS → routing
            </text>
          </svg>
        </motion.div>
      </div>
    </section>
  );
}
