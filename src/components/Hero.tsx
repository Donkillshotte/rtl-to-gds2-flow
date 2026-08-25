"use client";

import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 1], [0, 120]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let width = 0;
    let height = 0;

    interface Node {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;
    }

    const nodes: Node[] = [];
    const colors = ["#22d3ee", "#a78bfa", "#34d399", "#f472b6", "#60a5fa"];

    const resize = () => {
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = width * devicePixelRatio;
      canvas.height = height * devicePixelRatio;
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    };

    const init = () => {
      nodes.length = 0;
      const count = Math.min(80, Math.floor((width * height) / 12000));
      for (let i = 0; i < count; i++) {
        nodes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          radius: Math.random() * 2 + 1,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(34, 211, 238, ${0.15 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      const cx = width / 2;
      const cy = height / 2;
      const chipSize = Math.min(width, height) * 0.35;

      ctx.save();
      ctx.translate(cx, cy);

      const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, chipSize);
      gradient.addColorStop(0, "rgba(34, 211, 238, 0.12)");
      gradient.addColorStop(0.5, "rgba(167, 139, 250, 0.06)");
      gradient.addColorStop(1, "transparent");
      ctx.fillStyle = gradient;
      ctx.fillRect(-chipSize, -chipSize, chipSize * 2, chipSize * 2);

      ctx.strokeStyle = "rgba(34, 211, 238, 0.6)";
      ctx.lineWidth = 2;
      ctx.strokeRect(-chipSize / 2, -chipSize / 2, chipSize, chipSize);

      const gridStep = chipSize / 8;
      ctx.strokeStyle = "rgba(34, 211, 238, 0.15)";
      ctx.lineWidth = 0.5;
      for (let i = -4; i <= 4; i++) {
        ctx.beginPath();
        ctx.moveTo(-chipSize / 2, i * gridStep);
        ctx.lineTo(chipSize / 2, i * gridStep);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(i * gridStep, -chipSize / 2);
        ctx.lineTo(i * gridStep, chipSize / 2);
        ctx.stroke();
      }

      ctx.fillStyle = "rgba(34, 211, 238, 0.8)";
      for (let i = -3; i <= 3; i++) {
        if (i === 0) continue;
        ctx.fillRect(i * gridStep - 2, -chipSize / 2 - 8, 4, 8);
        ctx.fillRect(i * gridStep - 2, chipSize / 2, 4, 8);
        ctx.fillRect(-chipSize / 2 - 8, i * gridStep - 2, 8, 4);
        ctx.fillRect(chipSize / 2, i * gridStep - 2, 8, 4);
      }

      ctx.restore();

      for (const node of nodes) {
        node.x += node.vx;
        node.y += node.vy;
        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;

        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.globalAlpha = 0.6;
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      animationId = requestAnimationFrame(draw);
    };

    resize();
    init();
    draw();

    const onResize = () => {
      resize();
      init();
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden grid-bg"
    >
      <div className="absolute inset-0 chip-gradient pointer-events-none" />
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

      <motion.div style={{ opacity, y }} className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        <div className="mb-6 hero-enter">
          <span className="inline-block px-4 py-1.5 rounded-full glass text-sm font-mono text-cyan-400 tracking-wider">
            PHYSICAL DESIGN FLOW
          </span>
        </div>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 hero-enter hero-enter-delay-1">
          <span className="glow-text text-cyan-400">RTL</span>
          <span className="text-slate-500 mx-3 md:mx-6">→</span>
          <span className="glow-text text-purple-400">GDSII</span>
        </h1>

        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed hero-enter hero-enter-delay-2">
          Un percorso interattivo attraverso l&apos;intero flusso di physical design
          ad alto livello — dalla descrizione logica del circuito alla geometria
          pronta per la fonderia.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center hero-enter hero-enter-delay-3">
          <a
            href="#flow-overview"
            className="px-8 py-3.5 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-medium hover:bg-cyan-500/30 transition-all hover:shadow-[0_0_30px_rgba(34,211,238,0.3)]"
          >
            Esplora il flusso
          </a>
          <a
            href="#stage-rtl"
            className="px-8 py-3.5 rounded-xl glass text-slate-300 font-medium hover:text-white transition-all"
          >
            Inizia da RTL
          </a>
        </div>

        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 hero-enter hero-enter-delay-4">
          <span className="text-xs text-slate-500 font-mono tracking-widest">SCROLL</span>
          <div className="w-5 h-8 rounded-full border border-slate-600 flex items-start justify-center p-1 animate-float">
            <div className="w-1 h-2 rounded-full bg-cyan-400" />
          </div>
        </div>
      </motion.div>
    </section>
  );
}
