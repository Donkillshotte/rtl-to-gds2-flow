"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Languages } from "lucide-react";
import { useStages } from "@/hooks/useStages";
import { useI18n } from "@/i18n/context";
import { ui } from "@/i18n/ui";
import { MobileHeaderMenu } from "./MobileNav";
import { cn } from "@/lib/utils";

export function Navigation() {
  const stages = useStages();
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
  }, [stages]);

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
          <div className="glass rounded-2xl p-2 space-y-0.5 max-h-[70vh] overflow-y-auto">
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
  const { locale, setLocale, t } = useI18n();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 safe-top",
        scrolled ? "glass py-2 md:py-3" : "py-3 md:py-5"
      )}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-2">
        <a href="#" className="flex items-center gap-2 min-w-0 shrink">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center shrink-0">
            <span className="text-cyan-400 font-mono text-xs font-bold">PD</span>
          </div>
          <span className="font-semibold text-sm hidden sm:block truncate">{t(ui.siteTitle)}</span>
        </a>
        <nav className="flex items-center gap-0.5 sm:gap-1 shrink-0">
          <MobileHeaderMenu />
          <a href="#learn-lab" className="px-2.5 py-1 rounded-lg text-xs text-amber-400/90 hover:text-amber-300 transition-colors hidden md:block">
            {t(ui.navLearn)}
          </a>
          <a href="#signoff-checklist" className="px-2.5 py-1 rounded-lg text-xs text-slate-400 hover:text-white transition-colors hidden md:block">
            {t(ui.navSignoff)}
          </a>
          <a href="#sources" className="px-2.5 py-1 rounded-lg text-xs text-slate-400 hover:text-white transition-colors hidden md:block">
            {t(ui.navSources)}
          </a>
          <a href="#glossary" className="px-2.5 py-1 rounded-lg text-xs text-slate-400 hover:text-white transition-colors hidden md:block">
            {t(ui.navGlossary)}
          </a>
          <a href="#cells-glossary" className="px-2.5 py-1 rounded-lg text-xs text-slate-400 hover:text-white transition-colors hidden md:block">
            {t(ui.navCells)}
          </a>
          <a href="#eda-reference" className="px-2.5 py-1 rounded-lg text-xs text-slate-400 hover:text-white transition-colors hidden md:block">
            {t(ui.navRef)}
          </a>
          <a href="#stage-tapeout" className="px-2.5 py-1 rounded-lg text-xs text-cyan-400 hover:text-cyan-300 transition-colors hidden md:block">
            {t(ui.navTapeout)}
          </a>
          <div className="flex items-center border border-slate-700/50 rounded-lg overflow-hidden">
            <Languages className="w-3.5 h-3.5 text-slate-500 ml-1.5 hidden xs:block" />
            <button
              onClick={() => setLocale("it")}
              className={cn(
                "px-2.5 py-2 text-xs font-mono transition-colors min-w-[44px] min-h-[44px] md:min-h-0 md:min-w-0 md:py-1",
                locale === "it" ? "bg-cyan-500/20 text-cyan-400" : "text-slate-500 hover:text-slate-300"
              )}
            >
              {t(ui.langIt)}
            </button>
            <button
              onClick={() => setLocale("en")}
              className={cn(
                "px-2.5 py-2 text-xs font-mono transition-colors min-w-[44px] min-h-[44px] md:min-h-0 md:min-w-0 md:py-1",
                locale === "en" ? "bg-cyan-500/20 text-cyan-400" : "text-slate-500 hover:text-slate-300"
              )}
            >
              {t(ui.langEn)}
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}
