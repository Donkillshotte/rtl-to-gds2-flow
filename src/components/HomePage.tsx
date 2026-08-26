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
import { ProgressBar } from "@/components/ProgressBar";
import { ComparisonsSection } from "@/components/ComparisonsSection";
import { InteractiveDiagrams } from "@/components/InteractiveDiagrams";
import { ToolCommandsSection } from "@/components/ToolCommandsSection";
import { CheatSheetSection } from "@/components/CheatSheetSection";
import { WarStoriesSection } from "@/components/WarStoriesSection";
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
        <ProgressBar />
        <LearnLab />
        <InteractiveDiagrams />
        <ComparisonsSection />
        {stages.map((stage, index) => (
          <StageSection key={stage.id} stage={stage} index={index} />
        ))}
        <ToolCommandsSection />
        <WarStoriesSection />
        <CheatSheetSection />
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
