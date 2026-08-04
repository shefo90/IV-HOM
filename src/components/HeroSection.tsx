/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { ArrowDown } from "lucide-react";
import { useContent } from "../content/ContentProvider";
import RichText from "./RichText";

interface HeroSectionProps {
  onOpenProposal: () => void;
}

export default function HeroSection({ onOpenProposal }: HeroSectionProps) {
  const { hero, materials } = useContent().home;

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
    <section id="hero" className="relative bg-brand-dark pt-16 md:pt-24 flex flex-col overflow-hidden border-b border-brand-border-dark">
      <div className="flex flex-col md:flex-row">
      {/* LEFT PANEL (50% desktop, dark background with manifesto) */}
      <div className="w-full md:w-1/2 min-h-0 md:min-h-screen p-4 sm:p-6 md:p-16 flex flex-col justify-end md:justify-center border-r border-brand-border-dark relative pb-6 md:pb-16">
        {/* Background Grid Pattern (blueprinted line) */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(212,107,67,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(212,107,67,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

        {/* Left Title Block - Now Centered */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="space-y-6 sm:space-y-8 max-w-2xl relative"
        >
          <div className="flex items-center gap-3">
            <span className="h-[1px] w-8 sm:w-10 bg-brand-accent" />
            <span className="font-mono text-[10px] sm:text-[11px] md:text-[12px] tracking-[0.25em] sm:tracking-[0.3em] text-brand-accent font-semibold uppercase">
              {hero.eyebrow}
            </span>
          </div>
          {/* The empty orange-dot between the halves draws no glyph, but its
              1.4em inline box sets this line's height. Structural, not
              content — see the note on HomeContent.hero. */}
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-brand-accent leading-[1.1] tracking-tight font-medium">
            <RichText goldClass="text-brand-accent" emClass="italic text-brand-light font-medium">
              {hero.headingLead}
            </RichText>
            <span className="orange-dot"></span>{" "}
            <RichText goldClass="text-brand-accent" emClass="italic text-brand-light font-medium">
              {hero.headingRest}
            </RichText>
          </h2>
        </motion.div>
      </div>

      {/* RIGHT PANEL (50% desktop, split-screen with kitchen image and floating description) */}
      <div className="w-full md:w-1/2 relative min-h-[60vh] md:min-h-screen flex flex-col justify-end">
        {/* Background Image of Luxury Kitchen */}
        <div className="absolute inset-0 z-0">
          <img
            src={hero.image}
            alt={hero.imageAlt}
            className="w-full h-full object-cover grayscale-[15%] brightness-[80%] hover:grayscale-0 transition-all duration-1000 object-center"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/95 via-brand-dark/40 to-brand-dark/20" />
        </div>



        {/* Floating Overlay Content Block */}
        <div className="relative z-10 p-4 sm:p-6 md:p-12 w-full max-w-xl self-start">
          <div className="bg-brand-dark/90 backdrop-blur-md border border-brand-accent/20 p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6">
            <div className="flex items-center gap-3">
              <span className="text-brand-accent text-[9px] sm:text-[10px] font-mono tracking-widest">{hero.statementLabel}</span>
              <span className="h-[1px] flex-grow bg-brand-border-dark" />
            </div>

            <p className="font-sans text-[12px] sm:text-[13px] leading-relaxed text-gray-300">
              {hero.statement}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2">
              <button
                onClick={scrollToProjects}
                className="font-sans text-[9px] sm:text-[10px] tracking-[0.2em] font-bold px-5 sm:px-6 py-3 sm:py-3.5 bg-brand-accent hover:bg-brand-accent-hover text-brand-dark transition-all duration-300 flex items-center justify-center gap-2"
              >
                {hero.exploreCta}
              </button>
              <button
                onClick={onOpenProposal}
                className="font-sans text-[9px] sm:text-[10px] tracking-[0.2em] font-medium px-5 sm:px-6 py-3 sm:py-3.5 border border-brand-accent text-brand-light hover:bg-brand-accent/10 transition-all duration-300"
              >
                {hero.proposalCta}
              </button>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <button
          onClick={scrollToAbout}
          className="absolute top-4 sm:top-6 left-4 sm:left-6 z-10 text-gray-400 hover:text-brand-accent flex items-center gap-2 font-mono text-[8px] sm:text-[9px] tracking-[0.2em] transition-all bg-brand-dark/75 p-1.5 sm:p-2 rounded-sm border border-brand-border-dark"
        >
          <ArrowDown size={10} className="sm:w-3 sm:h-3 animate-bounce" />
          <span className="hidden sm:inline">{hero.scrollLabel}</span>
          <span className="sm:hidden">{hero.scrollLabelShort}</span>
        </button>
      </div>
      </div>

      {/* Enhanced Scrolling Marquee of Materials - Redesigned */}
      <div className="w-full border-t border-b border-brand-accent/20 bg-brand-dark py-6 sm:py-6 md:py-7 overflow-hidden relative group">
        {/* Subtle animated background with depth */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,107,67,0.05)_0%,transparent_70%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(212,107,67,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(212,107,67,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none opacity-30" />
        
        {/* Premium gradient overlays for smooth edges */}
        <div className="absolute left-0 top-0 bottom-0 w-24 sm:w-40 bg-gradient-to-r from-brand-dark via-brand-dark/90 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 sm:w-40 bg-gradient-to-l from-brand-dark via-brand-dark/90 to-transparent z-10 pointer-events-none" />
        
        {/* Elegant top accent line with shimmer effect */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-brand-accent/40 to-transparent" />
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-brand-accent/60 to-transparent animate-pulse" />
        
        {/* `w-max` is what makes this move at all. A percentage translate
            resolves against the element's own width, and without it this flex
            row is a block inside `overflow-hidden` — so its width was the
            viewport, and the animation shifted the logos by one screen per
            cycle instead of by one half of the track. That is why it crawled,
            and why it crawled worst on a narrow phone: 414px per 60s against a
            desktop's 1280px.

            With the track sized to its content, each breakpoint's travel is one
            half — 3456px on mobile up to 6912px at lg — so the durations below
            are staggered to hold a steady ~150px/s everywhere rather than
            letting speed follow screen width. */}
        <div className="flex w-max whitespace-nowrap will-change-transform animate-[marquee_23s_linear_infinite] sm:animate-[marquee_30s_linear_infinite] md:animate-[marquee_37s_linear_infinite] lg:animate-[marquee_46s_linear_infinite]">
          {/* Two identical halves. The track travels exactly one half per
              cycle, so when the first has left the viewport the second is
              filling it and the reset is invisible. One half translating -100%
              — which is what this was — empties the strip completely before
              snapping back, and that blank stretch reads as a stall. */}
          {[0, 1].map((half) => (
            <div className="flex items-center shrink-0" key={half} aria-hidden={half === 1}>
              {Array.from({ length: 3 }).flatMap((_, repeatIndex) =>
                materials.map((material, idx) => (
                  <div
                    key={`${repeatIndex}-${idx}`}
                    // The spacing lives entirely in the margin rather than
                    // being split with a `gap` on the row: `gap` does not apply
                    // between the two halves, so the joint came out tighter
                    // than every other slot and the loop visibly hitched.
                    // These values equal the old margin plus the old gap.
                    className="flex items-center justify-center group/item transition-all duration-500 hover:scale-105 mr-16 sm:mr-24 md:mr-32 lg:mr-40"
                  >
                    {/* Company logo only - larger on mobile */}
                    <div className="flex-shrink-0 w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 lg:w-24 lg:h-24 relative bg-transparent p-1">
                      <img
                        src={material.logo}
                        alt={`Company logo ${idx + 1}`}
                        className="w-full h-full object-contain opacity-80 group-hover/item:opacity-100 transition-all duration-500 group-hover/item:scale-110"
                        style={{
                          background: 'transparent',
                          backgroundColor: 'transparent',
                          filter: 'drop-shadow(0 2px 8px rgba(212,107,67,0.2))'
                        }}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Add marquee keyframe injection style to react scope */}
      <style>{`
        /* -50%, not -100%: the track holds two identical halves, so one half
           of travel returns it to a visually identical position. */
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        
        /* Remove any background from logos */
        img[alt*="logo"] {
          background: transparent !important;
          background-color: transparent !important;
          backdrop-filter: none !important;
        }
      `}</style>
    </section>
  );
}
