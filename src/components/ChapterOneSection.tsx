/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import workshopImage from "../assets/images/digital_factory_1784643682666.jpg";

export default function ChapterOneSection() {
  return (
    <section id="about" className="relative min-h-screen bg-brand-light text-brand-dark py-16 md:py-28 px-6 md:px-12 overflow-hidden border-b border-brand-border-light">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-12 md:gap-16 items-center">
        {/* LEFT PANE: Narrative & Stats (55% desktop width) */}
        <div className="w-full md:w-[55%] space-y-10">
          {/* Header Track Indicator */}
          <div className="flex items-center gap-3">
            <span className="h-[1.5px] w-8 bg-brand-accent" />
            <span className="font-mono text-[9px] tracking-[0.25em] text-brand-accent font-bold uppercase">
              01 • CHAPTER ONE
            </span>
          </div>

          {/* Heading */}
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-[54px] leading-[1.1] text-brand-dark tracking-tight">
            A gap between low-cost workshops{" "}
            <span className="italic text-brand-accent font-normal">
              and imported franchises.
            </span>
          </h2>

          {/* Core Body Paragraphs */}
          <div className="font-sans text-[13px] md:text-sm text-gray-700 leading-relaxed space-y-6 max-w-xl">
            <p>
              IV is the fixed-furniture manufacturing brand of HS Wood Industries — Egypt's first
              digital-first fixed furniture atelier. We synthesize ancestral cabinetry heritage
              with contemporary robotic carving.
            </p>
            <p>
              We serve B2B clients who need consistent quality across volume, not just a single
              well-finished showpiece. Every panel — first unit or last — is cut from the same
              digital file. The signature is invisible — because it is everywhere.
            </p>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 border-t border-brand-border-light pt-10 mt-6 max-w-md gap-4">
            <div className="border-r border-brand-border-light pr-4">
              <span className="block font-mono text-[9px] tracking-[0.15em] text-gray-500 uppercase">
                01 / ESTABLISHED
              </span>
              <span className="block font-serif text-4xl font-light text-brand-dark mt-2 tracking-tight">
                IV
              </span>
              <span className="block font-sans text-[10px] tracking-wider text-gray-400 mt-1 uppercase">
                Generations
              </span>
            </div>
            <div className="pl-4">
              <span className="block font-mono text-[9px] tracking-[0.15em] text-gray-500 uppercase">
                02 / INDEX
              </span>
              <span className="block font-serif text-4xl font-light text-brand-accent mt-2 tracking-tight">
                &lt;0.4%
              </span>
              <span className="block font-sans text-[10px] tracking-wider text-gray-400 mt-1 uppercase">
                Defect Rate
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT PANE: Modern Workshop Photo (45% desktop width) */}
        <div className="w-full md:w-[45%] flex flex-col">
          {/* Photo Frame */}
          <div className="relative group border border-brand-border-light p-2 bg-brand-card-light shadow-md">
            {/* Top corner accents */}
            <div className="absolute top-4 right-4 bg-brand-dark/85 backdrop-blur-sm border border-brand-accent/20 px-3 py-1 font-mono text-[8px] tracking-widest text-brand-accent z-10">
              CNC • HS WOOD
            </div>

            <div className="overflow-hidden aspect-[3/4] relative">
              <img
                src={workshopImage}
                alt="IV Digital Manufacturing Workshop"
                className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700 object-center scale-100 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
            </div>
            
            {/* Legend Text */}
            <div className="pt-3 pb-1 border-t border-brand-border-light mt-3 flex justify-between items-center px-2 font-mono text-[9px] tracking-wider text-gray-500">
              <span>FIG. 01 — WORKSHOP, HS WOOD INDUSTRIES</span>
              <span className="text-brand-accent">2026</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
