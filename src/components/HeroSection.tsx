/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { ArrowDown } from "lucide-react";

interface HeroSectionProps {
  onOpenProposal: () => void;
}

export default function HeroSection({ onOpenProposal }: HeroSectionProps) {
  const scrollToAbout = () => {
    const target = document.querySelector("#about");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToProjects = () => {
    const target = document.querySelector("#projects");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="hero" className="relative min-h-screen bg-brand-dark pt-24 flex flex-col md:flex-row overflow-hidden border-b border-brand-border-dark">
      {/* LEFT PANEL (50% desktop, dark background with big IV text and manifesto) */}
      <div className="w-full md:w-1/2 p-6 md:p-16 flex flex-col justify-between border-r border-brand-border-dark relative">
        {/* Background Grid Pattern (blueprinted line) */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(212,107,67,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(212,107,67,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

        {/* Top Spacer */}
        <div className="h-4" />

        {/* Giant Initials "IV" */}
        <div className="my-auto py-12 md:py-24 relative">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="font-serif text-[120px] sm:text-[180px] md:text-[230px] lg:text-[280px] leading-none text-brand-light font-extralight tracking-tighter select-none"
          >
            IV
          </motion.h1>

          {/* Subtitle labels separating line */}
          <div className="flex flex-wrap items-center gap-4 text-[9px] tracking-[0.2em] text-gray-500 font-mono mt-4 pt-4 border-t border-brand-border-dark w-full max-w-md">
            <span>HS WOOD INDUSTRIES</span>
            <span className="text-brand-accent/60">—</span>
            <span>CAIRO • EG</span>
            <span className="text-brand-accent/60">—</span>
            <span>EST. IV • MMXXVI</span>
          </div>
        </div>

        {/* Left Bottom Title Block */}
        <div className="space-y-6 max-w-lg mt-auto">
          <div className="flex items-center gap-3">
            <span className="h-[1px] w-8 bg-brand-accent" />
            <span className="font-mono text-[9px] tracking-[0.25em] text-brand-accent font-semibold uppercase">
              THE FIXED FURNITURE MANUFACTORY
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-brand-light leading-[1.1] tracking-tight">
            Fourth–generation craft.{" "}
            <span className="italic text-brand-accent font-normal">
              Powered by Industry 4.0.
            </span>
          </h2>
        </div>
      </div>

      {/* RIGHT PANEL (50% desktop, split-screen with kitchen image and floating description) */}
      <div className="w-full md:w-1/2 relative min-h-[500px] md:min-h-0 flex flex-col justify-end">
        {/* Background Image of Luxury Kitchen */}
        <div className="absolute inset-0 z-0">
          <img
            src="/src/assets/images/luxury_kitchen_1784643668452.jpg"
            alt="Signature IV Kitchen Interior"
            className="w-full h-full object-cover grayscale-[15%] brightness-[80%] hover:grayscale-0 transition-all duration-1000 object-center"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/95 via-brand-dark/40 to-brand-dark/20" />
        </div>

        {/* Floating Side Info Coordinate Strip on Desktop */}
        <div className="hidden lg:flex absolute right-4 top-1/2 -translate-y-1/2 z-10 origin-right rotate-90 items-center gap-4 text-gray-400 font-mono text-[9px] tracking-[0.3em] uppercase opacity-75">
          <span className="text-brand-accent font-bold">CAIRO</span>
          <span className="h-[1px] w-6 bg-brand-accent" />
          <span>EGYPT</span>
          <span className="h-[1px] w-6 bg-brand-border-dark" />
          <span>30.0444° N / 31.2357° E</span>
        </div>

        {/* Floating Overlay Content Block */}
        <div className="relative z-10 p-6 md:p-12 w-full max-w-xl self-start">
          <div className="bg-brand-dark/90 backdrop-blur-md border border-brand-accent/20 p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-3">
              <span className="text-brand-accent text-[10px] font-mono tracking-widest">[ A STATEMENT ]</span>
              <span className="h-[1px] flex-grow bg-brand-border-dark" />
            </div>

            <p className="font-sans text-[13px] leading-relaxed text-gray-300">
              Precision CNC manufacturing for kitchens, dressing rooms, and vanities — engineered for
              developers and architects who demand consistent quality across scale. Not a single
              well-finished showpiece — the same standard, repeated.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <button
                onClick={scrollToProjects}
                className="font-sans text-[10px] tracking-[0.2em] font-bold px-6 py-3.5 bg-brand-accent hover:bg-brand-accent-hover text-brand-dark transition-all duration-300 flex items-center justify-center gap-2"
              >
                EXPLORE PROJECTS
              </button>
              <button
                onClick={onOpenProposal}
                className="font-sans text-[10px] tracking-[0.2em] font-medium px-6 py-3.5 border border-brand-accent text-brand-light hover:bg-brand-accent/10 transition-all duration-300"
              >
                GET PROPOSAL
              </button>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <button
          onClick={scrollToAbout}
          className="absolute top-6 left-6 z-10 text-gray-400 hover:text-brand-accent flex items-center gap-2 font-mono text-[9px] tracking-[0.2em] transition-all bg-brand-dark/75 p-2 rounded-sm border border-brand-border-dark"
        >
          <ArrowDown size={12} className="animate-bounce" />
          SCROLL TO ENTER
        </button>
      </div>
    </section>
  );
}
