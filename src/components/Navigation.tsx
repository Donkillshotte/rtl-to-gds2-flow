"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { stages } from "@/data/stages";
import { cn } from "@/lib/utils";

export function Navigation() {
  const [activeStage, setActiveStage] = useState<string>("");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 400);

      const sections = stages.map((s) => ({
        id: s.id,
        el: document.getElementById(`stage-${s.id}`),
      }));

      for (const section of sections.reverse()) {
        if (section.el) {
          const rect = section.el.getBoundingClientRect();
          if (rect.top <= 200) {
            setActiveStage(section.id);
            break;
          }
        }
      }

      if (window.scrollY < 300) setActiveStage("");
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.nav
          initial={{ x: -80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -80, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed left-4 top-1/2 -translate-y-1/2 z-50 hidden lg:block"
        >
          <div className="glass rounded-2xl p-3 space-y-1">
            <a
              href="#"
              className={cn(
                "block w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-mono transition-all",
                activeStage === ""
                  ? "bg-cyan-500/20 text-cyan-400"
                  : "text-slate-500 hover:text-slate-300"
              )}
              title="Home"
            >
              ⌂
            </a>
            {stages.map((stage) => (
              <a
                key={stage.id}
                href={`#stage-${stage.id}`}
                className={cn(
                  "block w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-mono font-bold transition-all",
                  activeStage === stage.id
                    ? "text-white"
                    : "text-slate-500 hover:text-slate-300"
                )}
                style={
                  activeStage === stage.id
                    ? { background: `${stage.color}25`, color: stage.color }
                    : undefined
                }
                title={stage.title}
              >
                {stage.step}
              </a>
            ))}
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}

export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled ? "glass py-3" : "py-5"
      )}
    >
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center">
            <span className="text-cyan-400 font-mono text-xs font-bold">PD</span>
          </div>
          <span className="font-semibold text-sm hidden sm:block">
            Physical Design Flow
          </span>
        </a>
        <nav className="flex items-center gap-1">
          {stages.slice(0, 4).map((s) => (
            <a
              key={s.id}
              href={`#stage-${s.id}`}
              className="px-2.5 py-1 rounded-lg text-xs text-slate-400 hover:text-white transition-colors hidden md:block"
            >
              {s.title}
            </a>
          ))}
          <span className="text-slate-600 hidden md:block">...</span>
        </nav>
      </div>
    </header>
  );
}
