/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { buildCategories } from "../data";
import { ArrowUpRight } from "lucide-react";

interface WhatWeBuildSectionProps {
  onSelectCategory: (category: string) => void;
}

export default function WhatWeBuildSection({ onSelectCategory }: WhatWeBuildSectionProps) {
  return (
    <section id="products" className="relative bg-brand-dark py-16 md:py-28 px-6 md:px-12 border-b border-brand-border-dark overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Top Header Split Row */}
        <div className="flex flex-col md:flex-row gap-8 justify-between items-start md:items-end">
          <div className="space-y-6 max-w-xl">
            <div className="flex items-center gap-3">
              <span className="h-[1.5px] w-8 bg-brand-accent" />
              <span className="font-mono text-[9px] tracking-[0.25em] text-brand-accent font-bold uppercase">
                03 • WHAT WE BUILD
              </span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-[52px] leading-none text-brand-light tracking-tight">
              Three signatures.{" "}
              <span className="italic text-brand-accent font-normal">
                One standard.
              </span>
            </h2>
          </div>

          <p className="font-sans text-[13px] text-gray-400 leading-relaxed max-w-md md:pb-2">
            Three product categories, one manufacturing discipline. Every unit — kitchen, dressing
            room, or vanity — passes through the same seven checkpoints. The material changes.
            The standard does not.
          </p>
        </div>

        {/* 3 Portrait Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {buildCategories.map((c) => (
            <div
              key={c.id}
              onClick={() => onSelectCategory(c.title)}
              className="group relative aspect-[3/4] border border-brand-border-dark overflow-hidden cursor-pointer flex flex-col justify-end p-6 md:p-8 bg-brand-card-dark"
            >
              {/* Background Portrait Image */}
              <div className="absolute inset-0 z-0">
                <img
                  src={c.image}
                  alt={c.title}
                  className="w-full h-full object-cover grayscale-[35%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000 object-center brightness-[75%] group-hover:brightness-[85%]"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/95 via-brand-dark/40 to-transparent z-10" />
              </div>

              {/* Top Corner Icon Arrow Overlay */}
              <div className="absolute top-6 right-6 z-20 w-10 h-10 rounded-full border border-white/20 flex items-center justify-center bg-brand-dark/40 backdrop-blur-sm group-hover:bg-brand-accent group-hover:border-brand-accent transition-all duration-500">
                <ArrowUpRight
                  size={16}
                  className="text-brand-light group-hover:text-brand-dark transition-colors duration-500"
                />
              </div>

              {/* Card Footer Meta Info */}
              <div className="relative z-20 space-y-3">
                <span className="block font-mono text-[9px] tracking-[0.2em] text-brand-accent font-bold">
                  {c.number}
                </span>
                
                <h3 className="font-serif text-2xl sm:text-3xl text-brand-light group-hover:text-brand-accent transition-colors duration-300 tracking-tight">
                  {c.title}
                </h3>

                <div className="flex justify-between items-center pt-3 border-t border-brand-border-dark text-gray-400 font-mono text-[9px] tracking-wider uppercase">
                  <span>{c.techSpecs}</span>
                  <span className="text-brand-accent">{c.materials}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
