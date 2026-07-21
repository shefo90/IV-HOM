/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, CSSProperties } from "react";
import { choreographyStages } from "../data";

export default function ChoreographySection() {
  const [activeStage, setActiveStage] = useState(3); // Default to Stage 04 (index 3)

  return (
    <section className="relative bg-brand-light text-brand-dark py-16 md:py-28 px-6 md:px-12 border-b border-brand-border-light overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Top Header Split Row */}
        <div className="flex flex-col md:flex-row gap-8 justify-between items-start md:items-end">
          <div className="space-y-6 max-w-xl">
            <div className="flex items-center gap-3">
              <span className="h-[1.5px] w-8 bg-brand-accent" />
              <span className="font-mono text-[9px] tracking-[0.25em] text-brand-accent font-bold uppercase">
                05 • PRODUCTION CHOREOGRAPHY
              </span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-[52px] leading-none text-brand-dark tracking-tight">
              Seven stages.{" "}
              <span className="italic text-brand-accent font-normal">
                Every checkpoint has a signature.
              </span>
            </h2>
          </div>

          <p className="font-sans text-[13px] text-gray-600 leading-relaxed max-w-md md:pb-2">
            Each stage is owned. Each hand-off is documented. The line between digital file and
            finished cabinet is unbroken — from measurement to installation.
          </p>
        </div>

        {/* Timeline Component: Interactive Horizontal Schematic for Desktop, Stacked list for Mobile */}
        <div className="pt-8">
          {/* Timeline connecting line */}
          <div className="relative hidden lg:block mb-8">
            <div className="absolute top-[5px] left-[5%] right-[5%] h-[1px] bg-brand-border-light" />
            
            <div className="grid grid-cols-7 relative z-10">
              {choreographyStages.map((stage, idx) => {
                const isActive = idx === activeStage;
                return (
                  <button
                    key={stage.id}
                    onClick={() => setActiveStage(idx)}
                    className="flex flex-col items-center group focus:outline-none"
                  >
                    {/* Ring dot */}
                    <div
                      className={`w-3.5 h-3.5 rounded-full border-2 transition-all duration-300 flex items-center justify-center ${
                        isActive
                          ? "border-brand-accent bg-brand-accent scale-125"
                          : "border-brand-accent/50 bg-brand-light group-hover:border-brand-accent group-hover:scale-110"
                      }`}
                    >
                      {isActive && <div className="w-1.5 h-1.5 bg-brand-light rounded-full" />}
                    </div>
                    
                    <span className={`font-mono text-[9px] tracking-widest uppercase mt-4 transition-colors ${
                      isActive ? "text-brand-accent font-bold" : "text-gray-400 group-hover:text-brand-dark"
                    }`}>
                      {stage.stageNumber}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Desktop highlighted content box with clean slide transition style */}
          <div className="hidden lg:block bg-brand-card-light p-10 border border-brand-border-light relative rounded-sm">
            {/* Ambient indicator */}
            <div className="absolute top-0 left-[calc(5%_+_14.28%*var(--active-index))] -translate-x-1/2 w-4 h-4 bg-brand-card-light border-t border-l border-brand-border-light rotate-45 -mt-[9px] transition-all duration-500" style={{ "--active-index": activeStage } as CSSProperties} />
            
            <div className="grid grid-cols-3 gap-8 items-center">
              <div>
                <span className="font-mono text-xs text-brand-accent font-bold tracking-widest block uppercase mb-2">
                  CURRENT PROCESS RUN
                </span>
                <span className="font-serif text-5xl font-light text-brand-dark">
                  {choreographyStages[activeStage].stageNumber}
                </span>
              </div>
              <div className="col-span-2 border-l border-brand-border-light pl-10 space-y-3">
                <h3 className="font-serif text-2xl text-brand-dark font-medium tracking-tight">
                  {choreographyStages[activeStage].title}
                </h3>
                <p className="font-sans text-sm text-gray-600 leading-relaxed max-w-xl">
                  {choreographyStages[activeStage].description}
                </p>
              </div>
            </div>
          </div>

          {/* Mobile representation (Simple Vertical Steps) */}
          <div className="lg:hidden space-y-6">
            {choreographyStages.map((stage, idx) => (
              <div
                key={stage.id}
                className="p-5 border border-brand-border-light bg-brand-card-light/40 flex gap-4 items-start rounded-sm"
              >
                <div className="flex flex-col items-center">
                  <span className="w-2.5 h-2.5 rounded-full border border-brand-accent bg-brand-accent/20 flex items-center justify-center mt-1">
                    <span className="w-1 h-1 bg-brand-accent rounded-full" />
                  </span>
                  <div className="w-[1px] h-12 bg-brand-border-light mt-2" />
                </div>
                <div className="space-y-1">
                  <span className="font-mono text-[9px] tracking-wider text-brand-accent uppercase block font-semibold">
                    {stage.stageNumber}
                  </span>
                  <h3 className="font-serif text-base text-brand-dark font-semibold">
                    {stage.title}
                  </h3>
                  <p className="font-sans text-xs text-gray-500 leading-relaxed">
                    {stage.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
