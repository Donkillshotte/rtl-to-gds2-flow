import { Hero } from "@/components/Hero";
import { FlowOverview } from "@/components/FlowOverview";
import { StageSection } from "@/components/StageSection";
import { SummarySection, Footer } from "@/components/SummarySection";
import { GlossarySection, SignoffChecklistSection } from "@/components/GlossarySection";
import { Header, Navigation } from "@/components/Navigation";
import { stages } from "@/data/stages";

export default function Home() {
  return (
    <>
      <Header />
      <Navigation />
      <main>
        <Hero />
        <FlowOverview />
        {stages.map((stage, index) => (
          <StageSection key={stage.id} stage={stage} index={index} />
        ))}
        <SignoffChecklistSection />
        <GlossarySection />
        <SummarySection />
      </main>
      <Footer />
    </>
  );
}
