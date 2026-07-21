/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";

export default function TeamSection() {
  return (
    <section className="relative bg-brand-dark py-20 md:py-28 px-6 md:px-12 border-b border-brand-border-dark overflow-hidden">
      {/* Structural blueprint lines */}
      <div className="absolute inset-y-0 left-1/2 w-[1px] bg-brand-border-dark hidden md:block" />

      <div className="max-w-7xl mx-auto space-y-16 relative">
        {/* Section Header */}
        <div className="space-y-6 max-w-xl">
          <div className="flex items-center gap-3">
            <span className="h-[1.5px] w-8 bg-brand-accent" />
            <span className="font-mono text-[9px] tracking-[0.25em] text-brand-accent font-bold uppercase">
              02 • THE TEAM
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl leading-tight text-brand-light tracking-tight">
            A small team.{" "}
            <span className="italic text-brand-accent font-normal">
              Every project owned end-to-end.
            </span>
          </h2>
        </div>

        {/* Big numbers and labels row split by grid line */}
        <div className="grid grid-cols-1 md:grid-cols-2 pt-12 border-t border-brand-border-dark gap-12 md:gap-24">
          {/* Stat Block 1 */}
          <div className="space-y-4">
            <span className="block font-mono text-[9px] tracking-[0.15em] text-gray-500 uppercase">
              N° 1
            </span>
            <div className="flex items-baseline gap-2">
              <span className="font-serif text-7xl sm:text-8xl md:text-[110px] font-extralight text-brand-light leading-none tracking-tighter">
                18
              </span>
              <span className="w-2.5 h-2.5 bg-brand-accent rounded-full mb-2" />
            </div>
            <p className="font-sans text-[10px] tracking-[0.25em] text-gray-400 font-semibold uppercase pt-2">
              Design & Engineering Team
            </p>
            <p className="font-sans text-[12px] text-gray-500 max-w-sm leading-relaxed">
              Our architects and CAD specialists translate architectural plans directly into execution-ready digital cut files.
            </p>
          </div>

          {/* Stat Block 2 */}
          <div className="space-y-4 md:pl-12">
            <span className="block font-mono text-[9px] tracking-[0.15em] text-gray-500 uppercase">
              N° 2
            </span>
            <div className="flex items-baseline gap-2">
              <span className="font-serif text-7xl sm:text-8xl md:text-[110px] font-extralight text-brand-light leading-none tracking-tighter">
                28
              </span>
              <span className="w-2.5 h-2.5 bg-brand-accent rounded-full mb-2" />
            </div>
            <p className="font-sans text-[10px] tracking-[0.25em] text-gray-400 font-semibold uppercase pt-2">
              Concurrent Active Projects
            </p>
            <p className="font-sans text-[12px] text-gray-500 max-w-sm leading-relaxed">
              We manage scale dynamically, assuring that no individual client gets sidelined by production bottlenecks.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
