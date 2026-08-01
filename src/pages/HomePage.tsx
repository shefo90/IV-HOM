/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import HeroSection from "../components/HeroSection";
import ChapterOneSection from "../components/ChapterOneSection";
import WhatWeBuildSection from "../components/WhatWeBuildSection";
import ChoreographySection from "../components/ChoreographySection";
import SelectedWorkSection from "../components/SelectedWorkSection";
import ContactHeaderSection from "../components/ContactHeaderSection";
import ContactFormSection from "../components/ContactFormSection";

export default function HomePage() {
  const openProposal = () => {
    const el = document.getElementById("contact");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <HeroSection onOpenProposal={openProposal} />
      <ChapterOneSection />
      <WhatWeBuildSection onSelectCategory={() => openProposal()} />
      <ChoreographySection />
      <SelectedWorkSection onSelectProject={() => openProposal()} />
      <ContactHeaderSection />
      <ContactFormSection />
    </>
  );
}
