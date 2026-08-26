"use client";

import { Hero } from "@/components/Hero";
import { FlowOverview } from "@/components/FlowOverview";
import { StageSection } from "@/components/StageSection";
import { SummarySection, Footer } from "@/components/SummarySection";
import { GlossarySection, SignoffChecklistSection } from "@/components/GlossarySection";
import { CellGlossarySection } from "@/components/CellGlossarySection";
import { ReferenceSection } from "@/components/ReferenceSection";
import { SourcesSection } from "@/components/SourcesSection";
import { Header, Navigation } from "@/components/Navigation";
import { MobileBottomNav } from "@/components/MobileNav";
import { LearnLab } from "@/components/LearnLab";
import { useStages } from "@/hooks/useStages";

export function HomePage() {
  const stages = useStages();

  return (
    <>
      <Header />
      <Navigation />
      <main>
        <Hero />
        <FlowOverview />
        <LearnLab />
        {stages.map((stage, index) => (
          <StageSection key={stage.id} stage={stage} index={index} />
        ))}
        <SignoffChecklistSection />
        <ReferenceSection />
        <SourcesSection />
        <GlossarySection />
        <CellGlossarySection />
        <SummarySection />
      </main>
      <Footer />
      <MobileBottomNav />
    </>
  );
}
