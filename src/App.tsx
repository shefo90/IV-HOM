/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import ChapterOneSection from "./components/ChapterOneSection";
import TeamSection from "./components/TeamSection";
import DisciplinesSection from "./components/DisciplinesSection";
import WhatWeBuildSection from "./components/WhatWeBuildSection";
import ChoreographySection from "./components/ChoreographySection";
import TechSection from "./components/TechSection";
import SelectedWorkSection from "./components/SelectedWorkSection";
import LetBuildSection from "./components/LetBuildSection";
import ProposalModal from "./components/ProposalModal";

export default function App() {
  const [proposalOpen, setProposalOpen] = useState(false);
  const [modalType, setModalType] = useState<"proposal" | "tour">("proposal");
  const [activeSection, setActiveSection] = useState("hero");

  // Intersection or offset scroll listener to highlight correct nav link
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["hero", "about", "products", "process", "projects", "contact"];
      const scrollPosition = window.scrollY + 160; // offset for header

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const openProposal = (category?: string) => {
    // Do nothing - user requested nothing to happen when clicking proposal buttons
  };

  const openTour = () => {
    // Do nothing - user requested nothing to happen when clicking tour buttons
  };

  return (
    <div className="min-h-screen bg-brand-dark selection:bg-brand-accent selection:text-brand-dark overflow-x-hidden">
      {/* Dynamic Navigation Header */}
      <Header onOpenProposal={() => openProposal()} activeSection={activeSection} />

      {/* Hero / Landing Screen (Split panel) */}
      <HeroSection onOpenProposal={() => openProposal()} />

      {/* Chapter One Narrative Section */}
      <ChapterOneSection />

      {/* The Team / Capacity Section */}
      <TeamSection />

      {/* Disciplines Grid */}
      <DisciplinesSection />

      {/* Categories we build (Kitchens, Closet/Wardrobes, Vanities) */}
      <WhatWeBuildSection onSelectCategory={(cat) => openProposal(cat)} />

      {/* Process stage timeline sequence */}
      <ChoreographySection />

      {/* Machines and Equipment spec sheet */}
      <TechSection />

      {/* Grid of actual completed reference houses/residences */}
      <SelectedWorkSection onSelectProject={(title) => openProposal(`Reference study: ${title}`)} />

      {/* Large visual call to build and detailed map sitemap footer */}
      <LetBuildSection onOpenProposal={() => openProposal()} onOpenTour={openTour} />

      {/* Adaptive submission panel modal */}
      <ProposalModal
        isOpen={proposalOpen}
        onClose={() => setProposalOpen(false)}
        initialType={modalType}
      />
    </div>
  );
}
