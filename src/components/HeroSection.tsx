/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { ArrowDown } from "lucide-react";
import heroImage from "../assets/images/luxury_kitchen_1784643668452.jpg";
import { materials } from "../data";

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
    <section id="hero" className="relative bg-brand-dark pt-16 md:pt-24 flex flex-col overflow-hidden border-b border-brand-border-dark">
      <div className="flex flex-col md:flex-row">
      {/* LEFT PANEL (50% desktop, dark background with manifesto) */}
      <div className="w-full md:w-1/2 min-h-[60vh] md:min-h-screen p-4 sm:p-6 md:p-16 flex flex-col justify-center border-r border-brand-border-dark relative">
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
              THE FIXED FURNITURE MANUFACTORY
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-brand-light leading-[1.1] tracking-tight">
            Fourth–generation craft.{" "}
            <span className="italic text-brand-accent font-normal">
              Powered by Industry 4.0.
            </span>
          </h2>
        </motion.div>
      </div>

      {/* RIGHT PANEL (50% desktop, split-screen with kitchen image and floating description) */}
      <div className="w-full md:w-1/2 relative min-h-[60vh] md:min-h-screen flex flex-col justify-end">
        {/* Background Image of Luxury Kitchen */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroImage}
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
        <div className="relative z-10 p-4 sm:p-6 md:p-12 w-full max-w-xl self-start">
          <div className="bg-brand-dark/90 backdrop-blur-md border border-brand-accent/20 p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6">
            <div className="flex items-center gap-3">
              <span className="text-brand-accent text-[9px] sm:text-[10px] font-mono tracking-widest">[ A STATEMENT ]</span>
              <span className="h-[1px] flex-grow bg-brand-border-dark" />
            </div>

            <p className="font-sans text-[12px] sm:text-[13px] leading-relaxed text-gray-300">
              Precision CNC manufacturing for kitchens, dressing rooms, and vanities — engineered for
              developers and architects who demand consistent quality across scale. Not a single
              well-finished showpiece — the same standard, repeated.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2">
              <button
                onClick={scrollToProjects}
                className="font-sans text-[9px] sm:text-[10px] tracking-[0.2em] font-bold px-5 sm:px-6 py-3 sm:py-3.5 bg-brand-accent hover:bg-brand-accent-hover text-brand-dark transition-all duration-300 flex items-center justify-center gap-2"
              >
                EXPLORE PROJECTS
              </button>
              <button
                onClick={onOpenProposal}
                className="font-sans text-[9px] sm:text-[10px] tracking-[0.2em] font-medium px-5 sm:px-6 py-3 sm:py-3.5 border border-brand-accent text-brand-light hover:bg-brand-accent/10 transition-all duration-300"
              >
                GET PROPOSAL
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
          <span className="hidden sm:inline">SCROLL TO ENTER</span>
          <span className="sm:hidden">SCROLL</span>
        </button>
      </div>
      </div>

      {/* Enhanced Scrolling Marquee of Materials - Redesigned */}
      <div className="w-full border-t border-b border-brand-accent/20 bg-brand-dark py-5 sm:py-6 md:py-7 overflow-hidden relative group">
        {/* Subtle animated background with depth */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,107,67,0.05)_0%,transparent_70%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(212,107,67,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(212,107,67,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none opacity-30" />
        
        {/* Premium gradient overlays for smooth edges */}
        <div className="absolute left-0 top-0 bottom-0 w-24 sm:w-40 bg-gradient-to-r from-brand-dark via-brand-dark/90 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 sm:w-40 bg-gradient-to-l from-brand-dark via-brand-dark/90 to-transparent z-10 pointer-events-none" />
        
        {/* Elegant top accent line with shimmer effect */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-brand-accent/40 to-transparent" />
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-brand-accent/60 to-transparent animate-pulse" />
        
        <div className="flex whitespace-nowrap animate-[marquee_35s_linear_infinite]">
          {/* First loop */}
          <div className="flex gap-10 sm:gap-12 md:gap-14 items-center shrink-0 pr-10 sm:pr-12 md:pr-14">
            {materials.map((m, idx) => (
              <div 
                key={idx} 
                className="flex items-center gap-3 sm:gap-4 group/item transition-all duration-500 hover:scale-105"
              >
                {/* Refined number badge with glow */}
                <div className="relative flex-shrink-0">
                  <div className="absolute inset-0 bg-brand-accent/15 blur-lg rounded-full opacity-0 group-hover/item:opacity-100 transition-opacity duration-500" />
                  <span className="relative font-mono text-[9px] sm:text-[10px] tracking-[0.3em] text-brand-accent/80 group-hover/item:text-brand-accent font-bold uppercase bg-brand-accent/5 group-hover/item:bg-brand-accent/10 px-2.5 py-1 border border-brand-accent/20 group-hover/item:border-brand-accent/40 rounded transition-all duration-300">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                </div>
                
                {/* Minimalist divider */}
                <div className="hidden sm:flex items-center gap-1.5">
                  <div className="h-[1px] w-4 bg-gradient-to-r from-brand-accent/30 to-transparent" />
                </div>
                
                {/* Material name - elegant and refined */}
                <span className="font-serif text-2xl sm:text-3xl md:text-4xl italic text-brand-light/90 group-hover/item:text-brand-accent font-light tracking-wide transition-all duration-500 drop-shadow-[0_2px_10px_rgba(212,107,67,0.15)] group-hover/item:drop-shadow-[0_4px_20px_rgba(212,107,67,0.4)]">
                  {m}
                </span>
                
                {/* Subtle trailing dot */}
                <div className="hidden sm:flex items-center gap-1.5">
                  <div className="h-[1px] w-4 bg-gradient-to-l from-brand-accent/30 to-transparent" />
                  <div className="w-1 h-1 rounded-full bg-brand-accent/50 group-hover/item:bg-brand-accent animate-pulse" />
                </div>
              </div>
            ))}
          </div>
          
          {/* Duplicate loop for seamless scroll */}
          <div className="flex gap-10 sm:gap-12 md:gap-14 items-center shrink-0 pr-10 sm:pr-12 md:pr-14" aria-hidden="true">
            {materials.map((m, idx) => (
              <div 
                key={`dup-${idx}`} 
                className="flex items-center gap-3 sm:gap-4 group/item transition-all duration-500 hover:scale-105"
              >
                <div className="relative flex-shrink-0">
                  <div className="absolute inset-0 bg-brand-accent/15 blur-lg rounded-full opacity-0 group-hover/item:opacity-100 transition-opacity duration-500" />
                  <span className="relative font-mono text-[9px] sm:text-[10px] tracking-[0.3em] text-brand-accent/80 group-hover/item:text-brand-accent font-bold uppercase bg-brand-accent/5 group-hover/item:bg-brand-accent/10 px-2.5 py-1 border border-brand-accent/20 group-hover/item:border-brand-accent/40 rounded transition-all duration-300">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                </div>
                
                <div className="hidden sm:flex items-center gap-1.5">
                  <div className="h-[1px] w-4 bg-gradient-to-r from-brand-accent/30 to-transparent" />
                </div>
                
                <span className="font-serif text-2xl sm:text-3xl md:text-4xl italic text-brand-light/90 group-hover/item:text-brand-accent font-light tracking-wide transition-all duration-500 drop-shadow-[0_2px_10px_rgba(212,107,67,0.15)] group-hover/item:drop-shadow-[0_4px_20px_rgba(212,107,67,0.4)]">
                  {m}
                </span>
                
                <div className="hidden sm:flex items-center gap-1.5">
                  <div className="h-[1px] w-4 bg-gradient-to-l from-brand-accent/30 to-transparent" />
                  <div className="w-1 h-1 rounded-full bg-brand-accent/50 group-hover/item:bg-brand-accent animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add marquee keyframe injection style to react scope */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}
