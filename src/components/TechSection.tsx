/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { equipmentList, materials } from "../data";

export default function TechSection() {
  return (
    <section className="relative bg-brand-dark py-16 md:py-28 overflow-hidden border-b border-brand-border-dark">
      <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-16">
        {/* Top Header Split Row */}
        <div className="flex flex-col md:flex-row gap-8 justify-between items-start md:items-end">
          <div className="space-y-6 max-w-xl">
            <div className="flex items-center gap-3">
              <span className="h-[1.5px] w-8 bg-brand-accent" />
              <span className="font-mono text-[9px] tracking-[0.25em] text-brand-accent font-bold uppercase">
                06 • TECHNOLOGY & MATERIALS
              </span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-[52px] leading-none text-brand-light tracking-tight">
              Guided by the machine.{" "}
              <span className="italic text-brand-accent font-normal">
                Refined by the maker.
              </span>
            </h2>
          </div>

          <p className="font-sans text-[13px] text-gray-400 leading-relaxed max-w-md md:pb-2">
            Equipment is not the story — capability is. What matters is what happens between the
            digital file and the finished edge: tolerances held, hardware specified, edges banded
            factory-grade, every time.
          </p>
        </div>

        {/* Bento Grid layout of equipment */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
          {equipmentList.map((eq) => (
            <div
              key={eq.id}
              className="border border-brand-border-dark p-8 space-y-8 bg-brand-card-dark/40 hover:border-brand-accent/30 transition-all duration-300 relative rounded-sm group"
            >
              <div className="space-y-3">
                <span className="block font-mono text-[9px] tracking-[0.15em] text-brand-accent uppercase font-semibold">
                  {eq.number}
                </span>
                <h3 className="font-serif text-2xl text-brand-light group-hover:text-brand-accent transition-colors">
                  {eq.title}
                </h3>
                <p className="font-sans text-xs text-gray-400 leading-relaxed max-w-lg">
                  {eq.description}
                </p>
              </div>

              {/* Monospace Metadata Specs */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 border-t border-brand-border-dark/60 pt-4">
                {eq.meta.map((m, mIdx) => (
                  <div key={mIdx} className="space-y-1">
                    <span className="block font-sans text-[9px] text-gray-500 uppercase tracking-wider">
                      {m.label}
                    </span>
                    <span className="block font-mono text-[10px] text-brand-accent font-medium uppercase tracking-wider">
                      {m.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Decorative Blank / Aesthetic Blueprint card */}
          <div className="border border-brand-border-dark/40 border-dashed p-8 flex flex-col justify-between bg-brand-dark/20 relative rounded-sm overflow-hidden hidden md:flex">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(212,107,67,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(212,107,67,0.01)_1px,transparent_1px)] bg-[size:20px_20px]" />
            <div className="space-y-3 relative z-10">
              <span className="block font-mono text-[9px] tracking-widest text-gray-500 uppercase">
                COGNITIVE MANUFACTORING SYSTEM
              </span>
              <p className="font-serif text-xl italic text-gray-400">
                "Where mathematics meets materiality."
              </p>
            </div>
            <div className="relative z-10 flex justify-between items-center text-[8px] font-mono tracking-widest text-gray-600">
              <span>HS WOOD INDUSTRIES SYSTEM CLOCK</span>
              <span className="text-brand-accent">ONLINE</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scrolling Marquee of Materials at bottom */}
      <div className="w-full border-t border-b border-brand-border-dark bg-brand-card-dark/40 py-8 mt-16 overflow-hidden relative">
        <div className="flex whitespace-nowrap animate-[marquee_25s_linear_infinite] hover:pause">
          {/* First loop */}
          <div className="flex gap-16 items-center shrink-0 pr-16">
            {materials.map((m, idx) => (
              <div key={idx} className="flex items-center gap-6">
                <span className="font-mono text-[10px] tracking-widest text-brand-accent font-semibold">
                  M • 0{idx + 1}
                </span>
                <span className="font-serif text-2xl italic text-brand-light font-light">
                  {m}
                </span>
              </div>
            ))}
          </div>
          {/* Duplicate loop for seamless scroll */}
          <div className="flex gap-16 items-center shrink-0 pr-16" aria-hidden="true">
            {materials.map((m, idx) => (
              <div key={`dup-${idx}`} className="flex items-center gap-6">
                <span className="font-mono text-[10px] tracking-widest text-brand-accent font-semibold">
                  M • 0{idx + 1}
                </span>
                <span className="font-serif text-2xl italic text-brand-light font-light">
                  {m}
                </span>
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
