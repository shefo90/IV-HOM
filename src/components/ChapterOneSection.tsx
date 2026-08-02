/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { useContent } from "../content/ContentProvider";
import RichText from "./RichText";

export default function ChapterOneSection() {
  const { chapterOne } = useContent().home;

  return (
    <section id="about" className="relative min-h-screen bg-brand-dark text-brand-light py-16 md:py-28 px-6 md:px-12 overflow-hidden border-b border-brand-border-dark">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-12 md:gap-16 items-center">
        {/* LEFT PANE: Narrative & Stats (55% desktop width) */}
        <div className="w-full md:w-[55%] space-y-10">
          {/* Header Track Indicator */}
          <div className="flex items-center gap-3">
            <span className="h-[1.5px] w-8 bg-brand-accent" />
            <span className="font-mono text-[9px] tracking-[0.25em] text-brand-accent font-bold uppercase">
              {chapterOne.eyebrow}
            </span>
          </div>

          {/* Heading */}
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-[54px] leading-[1.1] text-brand-accent tracking-tight font-medium">
            <RichText emClass="italic text-brand-light font-medium">
              {chapterOne.heading}
            </RichText>
          </h2>

          {/* Core Body Paragraphs */}
          <div className="font-sans text-[13px] md:text-sm text-gray-300 leading-relaxed space-y-6 max-w-xl">
            {chapterOne.body.map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </div>

          {/* Stats Bar */}
          {/* Two cells, and the pair is locked to two in the schema: the left
              one carries the divider and reads light, the right one reads
              accent. That split is the design, not a property of the data. */}
          <div className="grid grid-cols-2 border-t border-brand-border-dark pt-10 mt-6 max-w-md gap-4">
            {chapterOne.stats.map((stat, idx) => (
              <div
                key={idx}
                className={idx === 0 ? "border-r border-brand-border-dark pr-4" : "pl-4"}
              >
                <span className="block font-mono text-[9px] tracking-[0.15em] text-gray-500 uppercase">
                  {stat.index}
                </span>
                <span
                  className={`block font-serif text-4xl font-semibold ${
                    idx === 0 ? "text-brand-light" : "text-brand-accent"
                  } mt-2 tracking-tight`}
                >
                  {stat.value}
                </span>
                <span className="block font-sans text-[10px] tracking-wider text-gray-500 mt-1 uppercase">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT PANE: Modern Workshop Photo (45% desktop width) */}
        <div className="w-full md:w-[45%] flex flex-col">
          {/* Photo Frame */}
          <div className="relative group border border-brand-border-dark p-2 bg-brand-card-dark shadow-xl">
            {/* Top corner accents */}
            <div className="absolute top-4 right-4 bg-brand-dark/95 backdrop-blur-sm border border-brand-accent/40 px-3 py-1 font-mono text-[8px] tracking-widest text-brand-accent z-10">
              {chapterOne.imageBadge}
            </div>

            <div className="overflow-hidden aspect-[3/4] relative">
              <img
                src={chapterOne.image}
                alt={chapterOne.imageAlt}
                className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700 object-center scale-100 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
            </div>
            
            {/* Legend Text */}
            <div className="pt-3 pb-1 border-t border-brand-border-dark mt-3 flex justify-between items-center px-2 font-mono text-[9px] tracking-wider text-gray-500">
              <span>{chapterOne.imageCaption}</span>
              <span className="text-brand-accent">{chapterOne.imageYear}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
