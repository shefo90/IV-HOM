/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MouseEvent } from "react";

interface LetBuildSectionProps {
  onOpenProposal: () => void;
  onOpenTour: () => void;
}

export default function LetBuildSection({ onOpenProposal, onOpenTour }: LetBuildSectionProps) {
  const handleNavClick = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="contact" className="relative bg-brand-dark pt-20 md:pt-32 overflow-hidden border-t border-brand-border-dark">
      {/* Background blueprint elements */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(212,107,67,0.015)_1px,transparent_1.5px)] bg-[size:30px_30px] pointer-events-none" />

      {/* Main CTA Section */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 text-center space-y-10 relative z-10 pb-20 md:pb-32 border-b border-brand-border-dark">
        <div className="space-y-4 max-w-xl mx-auto">
          <div className="flex items-center justify-center gap-3">
            <span className="h-[1px] w-6 bg-brand-accent" />
            <span className="font-mono text-[9px] tracking-[0.25em] text-brand-accent font-semibold uppercase">
              READY WHEN YOU ARE
            </span>
            <span className="h-[1px] w-6 bg-brand-accent" />
          </div>
          <h2 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-[90px] leading-none text-brand-light tracking-tighter">
            Let's{" "}
            <span className="italic text-brand-accent font-normal">
              build.
            </span>
          </h2>
        </div>

        <p className="font-sans text-xs sm:text-sm text-gray-400 max-w-md mx-auto leading-relaxed">
          See the factory. Meet the team. Get a project-specific proposal with a committed timeline
          and a fixed price.
        </p>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
          <button
            onClick={onOpenTour}
            className="w-full sm:w-auto font-sans text-[10px] tracking-[0.25em] font-bold px-8 py-4 bg-brand-accent hover:bg-brand-accent-hover text-brand-dark transition-all duration-300"
          >
            SCHEDULE A FACTORY TOUR
          </button>
          <button
            onClick={onOpenProposal}
            className="w-full sm:w-auto font-sans text-[10px] tracking-[0.25em] font-medium px-8 py-4 border border-brand-accent text-brand-light hover:bg-brand-accent/10 transition-all duration-300"
          >
            GET A PROPOSAL
          </button>
        </div>
      </div>

      {/* Footer Sitemap */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-20 pb-12 relative z-10">
        
        {/* Giant Outlined Background "IV" */}
        <div className="absolute right-6 bottom-32 font-serif text-[18vw] leading-none select-none pointer-events-none text-transparent opacity-10 font-bold tracking-tighter z-0" style={{ WebkitTextStroke: "1.5px rgba(255,255,255,0.2)" }}>
          IV
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 relative z-10">
          
          {/* Brand Info */}
          <div className="md:col-span-4 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full border border-brand-accent flex items-center justify-center">
                <span className="font-serif text-xs font-bold text-brand-light">IV</span>
              </div>
              <span className="font-serif text-2xl text-brand-light tracking-tight">IV</span>
            </div>
            <p className="font-sans text-xs text-gray-500 leading-relaxed max-w-sm">
              The fixed-furniture manufacturing brand of HS Wood Industries. Fourth-generation
              craft, powered by Industry 4.0.
            </p>
          </div>

          {/* Nav Links Column */}
          <div className="md:col-span-2 md:col-start-6 space-y-4">
            <h4 className="font-mono text-[9px] tracking-[0.25em] text-brand-accent font-bold uppercase">
              NAVIGATE
            </h4>
            <ul className="space-y-2.5 font-sans text-xs text-gray-400">
              <li>
                <a href="#about" onClick={(e) => handleNavClick(e, "#about")} className="hover:text-brand-accent transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="#products" onClick={(e) => handleNavClick(e, "#products")} className="hover:text-brand-accent transition-colors">
                  Products
                </a>
              </li>
              <li>
                <a href="#process" onClick={(e) => handleNavClick(e, "#process")} className="hover:text-brand-accent transition-colors">
                  Process
                </a>
              </li>
              <li>
                <a href="#projects" onClick={(e) => handleNavClick(e, "#projects")} className="hover:text-brand-accent transition-colors">
                  Projects
                </a>
              </li>
              <li>
                <a href="#contact" onClick={(e) => handleNavClick(e, "#contact")} className="hover:text-brand-accent transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info Column */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="font-mono text-[9px] tracking-[0.25em] text-brand-accent font-bold uppercase">
              CONTACT
            </h4>
            <ul className="space-y-2.5 font-sans text-xs text-gray-400">
              <li>+20 10 xxxx xxxx</li>
              <li>projects@iv-hswood.com</li>
              <li>Cairo • By appointment</li>
            </ul>
          </div>

          {/* HS Wood Column */}
          <div className="md:col-span-2 space-y-4">
            <h4 className="font-mono text-[9px] tracking-[0.25em] text-brand-accent font-bold uppercase">
              HS WOOD INDUSTRIES
            </h4>
            <ul className="space-y-2.5 font-sans text-xs text-gray-400">
              <li>Fixed Furniture Manufactory</li>
              <li>Cairo, Egypt</li>
            </ul>
          </div>

        </div>

        {/* Bottom credits */}
        <div className="border-t border-brand-border-dark/60 mt-16 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-[9px] font-mono tracking-[0.2em] text-gray-500 uppercase">
          <span>IV — FIXED FURNITURE • HS WOOD INDUSTRIES © 2026</span>
          <span className="text-brand-accent">
            4TH GENERATION CRAFT • POWERED BY INDUSTRY 4.0
          </span>
        </div>

      </div>
    </section>
  );
}
