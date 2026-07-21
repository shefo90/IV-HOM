/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { disciplines } from "../data";

export default function DisciplinesSection() {
  return (
    <section id="process" className="relative bg-brand-light text-brand-dark py-16 md:py-28 px-6 md:px-12 border-b border-brand-border-light overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Top Split Section Header */}
        <div className="flex flex-col md:flex-row gap-8 justify-between items-start md:items-end">
          <div className="space-y-6 max-w-xl">
            <div className="flex items-center gap-3">
              <span className="h-[1.5px] w-8 bg-brand-accent" />
              <span className="font-mono text-[9px] tracking-[0.25em] text-brand-accent font-bold uppercase">
                02 • THE SEVEN DISCIPLINES
              </span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-[52px] leading-none text-brand-dark tracking-tight">
              Seven disciplines.{" "}
              <span className="italic text-brand-accent font-normal">
                Every project, every time.
              </span>
            </h2>
          </div>

          <p className="font-sans text-[13px] text-gray-600 leading-relaxed max-w-md md:pb-2">
            Each essential, each measurable, each non-negotiable — the sum of what makes a project
            IV's. Nothing here is aspiration. Everything is protocol.
          </p>
        </div>

        {/* 4x2 Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-l border-t border-brand-border-light">
          {disciplines.map((d, index) => (
            <div
              key={d.id}
              className="border-r border-b border-brand-border-light p-8 flex flex-col justify-between min-h-[220px] bg-brand-light transition-all duration-500 group relative overflow-hidden"
            >
              {/* Rising dark background from bottom */}
              <div className="absolute inset-0 bg-brand-dark translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-out" />
              
              {/* Content with relative positioning to stay above background */}
              <div className="relative z-10">
                <span className="block font-mono text-[10px] tracking-widest text-brand-accent font-semibold mb-6 transition-colors duration-500">
                  {d.number}
                </span>
                <h3 className="font-serif text-xl text-brand-dark group-hover:text-brand-light transition-colors duration-500 tracking-tight">
                  {d.title}
                </h3>
              </div>
              <p className="font-sans text-xs text-gray-500 group-hover:text-gray-400 leading-relaxed mt-4 transition-colors duration-500 relative z-10">
                {d.description}
              </p>
            </div>
          ))}

          {/* 8th Card: The IV Signature (Dark Box) */}
          <div className="border-r border-b border-brand-border-light p-8 flex flex-col justify-between min-h-[220px] bg-brand-dark text-brand-light group relative overflow-hidden">
            {/* Rising accent background from bottom */}
            <div className="absolute inset-0 bg-brand-accent translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-out" />
            
            {/* Content with relative positioning */}
            <div className="relative z-10">
              <span className="block font-mono text-[9px] tracking-widest text-brand-accent group-hover:text-brand-dark font-semibold uppercase mb-6 transition-colors duration-500">
                The IV Signature
              </span>
              <h3 className="font-serif text-2xl text-brand-accent group-hover:text-brand-dark font-light italic leading-tight tracking-tight transition-colors duration-500">
                Every project. <br />Every time.
              </h3>
            </div>
            <p className="font-sans text-[11px] text-gray-400 group-hover:text-brand-dark leading-relaxed mt-6 transition-colors duration-500 relative z-10">
              The signature is invisible — because it is everywhere.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
