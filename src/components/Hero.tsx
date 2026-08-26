"use client";

import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useI18n } from "@/i18n/context";
import { ui } from "@/i18n/ui";

/** Soft particle field only — no chip silhouette over the headline. */
export function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { t } = useI18n();
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });
  const opacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 1], [0, 80]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId = 0;
    let width = 0;
    let height = 0;
    let reduced = false;

    interface Node {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;
    }

    const nodes: Node[] = [];
    const colors = ["#22d3ee", "#67e8f9", "#34d399", "#38bdf8", "#94a3b8"];

    const resize = () => {
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = width * devicePixelRatio;
      canvas.height = height * devicePixelRatio;
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    };

    const init = () => {
      nodes.length = 0;
      if (reduced) return;
      const count = Math.min(48, Math.floor((width * height) / 18000));
      for (let i = 0; i < count; i++) {
        nodes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.25,
          radius: Math.random() * 1.6 + 0.6,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      if (reduced) return;

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(34, 211, 238, ${0.08 * (1 - dist / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      for (const node of nodes) {
        node.x += node.vx;
        node.y += node.vy;
        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;

        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.globalAlpha = 0.35;
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      animationId = requestAnimationFrame(draw);
    };

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const applyMotion = () => {
      reduced = mq.matches;
      cancelAnimationFrame(animationId);
      resize();
      init();
      if (!reduced) draw();
      else ctx.clearRect(0, 0, width, height);
    };

    applyMotion();
    const onResize = () => {
      resize();
      init();
    };
    mq.addEventListener("change", applyMotion);
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(animationId);
      mq.removeEventListener("change", applyMotion);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative min-h-[100dvh] flex flex-col items-center justify-center overflow-hidden grid-bg pt-24 pb-28 px-4 sm:px-6"
    >
      {/* Atmosphere only — no chip silhouette */}
      <div className="absolute inset-0 hero-atmosphere pointer-events-none" />
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none opacity-50 sm:opacity-70"
        aria-hidden
      />
      {/* Readability scrim behind copy */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-slate-950/40 via-slate-950/55 to-slate-950/80" />

      <motion.div style={{ opacity, y }} className="relative z-10 text-center w-full max-w-4xl mx-auto">
        <div className="mb-5 sm:mb-7 hero-enter">
          <span className="inline-block px-3 sm:px-4 py-1.5 rounded-full border border-cyan-500/25 bg-slate-950/50 text-xs sm:text-sm font-mono text-cyan-300/90 tracking-[0.18em]">
            {t(ui.heroBadge)}
          </span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-[5.5rem] font-bold tracking-tight mb-5 sm:mb-7 hero-enter hero-enter-delay-1">
          <span className="text-cyan-300 drop-shadow-[0_0_28px_rgba(34,211,238,0.35)]">RTL</span>
          <span className="text-slate-600 mx-2 sm:mx-4 md:mx-5 font-light">→</span>
          <span className="text-sky-200 drop-shadow-[0_0_28px_rgba(56,189,248,0.25)]">GDSII</span>
        </h1>

        <p className="text-sm sm:text-base md:text-lg text-slate-300/90 max-w-2xl mx-auto mb-9 sm:mb-11 leading-relaxed hero-enter hero-enter-delay-2">
          {t(ui.heroSubtitle)}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center w-full max-w-sm sm:max-w-none mx-auto hero-enter hero-enter-delay-3">
          <a
            href="#flow-overview"
            className="px-6 sm:px-8 py-3.5 rounded-xl bg-cyan-500/15 border border-cyan-400/35 text-cyan-200 font-medium text-center hover:bg-cyan-500/25 transition-colors min-h-[48px] flex items-center justify-center"
          >
            {t(ui.heroCta1)}
          </a>
          <a
            href="#learn-lab"
            className="px-6 sm:px-8 py-3.5 rounded-xl border border-slate-600/50 bg-slate-900/40 text-slate-200 font-medium text-center hover:border-slate-500 hover:text-white transition-colors min-h-[48px] flex items-center justify-center"
          >
            {t(ui.heroCta2)}
          </a>
        </div>

        <div className="mt-14 sm:mt-16 flex flex-col items-center gap-2 hero-enter hero-enter-delay-4">
          <span className="text-[10px] text-slate-500 font-mono tracking-[0.25em]">{t(ui.scroll)}</span>
          <div className="w-5 h-8 rounded-full border border-slate-600/80 flex items-start justify-center p-1.5 animate-float">
            <div className="w-1 h-2 rounded-full bg-cyan-400/80" />
          </div>
        </div>
      </motion.div>
    </section>
  );
}
