/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { referenceProjects } from "../data";
import ProjectCard from "./ProjectCard";

interface SelectedWorkSectionProps {
  onSelectProject: (title: string) => void;
}

export default function SelectedWorkSection({ onSelectProject }: SelectedWorkSectionProps) {
  // We'll organize the layout such that Case 01 is on the left, and Case 02 & 03 are stacked on the right
  const project1 = referenceProjects[0];
  const project2 = referenceProjects[1];
  const project3 = referenceProjects[2];

  const stats = [
    { value: "96%", label: "ON-TIME RATE" },
    { value: "<0.4%", label: "DEFECT RATE" },
    { value: "2025", label: "PRODUCTION YEAR" },
  ];

  return (
    <section id="projects" className="relative bg-brand-dark py-16 md:py-28 px-6 md:px-12 border-b border-brand-border-dark overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Top Header Split Row */}
        <div className="flex flex-col md:flex-row gap-8 justify-between items-start md:items-end">
          <div className="space-y-6 max-w-xl">
            <div className="flex items-center gap-3">
              <span className="h-[1.5px] w-8 bg-brand-accent" />
              <span className="font-mono text-[9px] tracking-[0.25em] text-brand-accent font-bold uppercase">
                05 • REFERENCE PROJECTS
              </span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-[52px] leading-none text-brand-light tracking-tight">
              Selected{" "}
              <span className="italic text-brand-accent font-normal">
                work.
              </span>
            </h2>
          </div>

          <p className="font-sans text-[13px] text-gray-400 leading-relaxed max-w-md md:pb-2">
            A short selection from the 2025 production year. Numbers are auditable — timelines and
            defect rates. Ask for the full brief.
          </p>
        </div>

        {/* Stats Strip */}
        <div className="grid grid-cols-3 border-t border-b border-brand-border-dark py-6 gap-4 text-center md:text-left">
          {stats.map((s, idx) => (
            <div key={idx} className="space-y-1">
              <span className="block font-serif text-2xl sm:text-3xl text-brand-accent font-light">
                {s.value}
              </span>
              <span className="block font-sans text-[9px] text-gray-500 uppercase tracking-widest">
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* Masonry / Split Offset Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8">
          
          {/* Left Large Column (Case 01) - taking 7 span */}
          <ProjectCard project={project1} onSelectProject={onSelectProject} size="large" />

          {/* Right Column Stack (Case 02 & Case 03) - taking 5 span */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            <ProjectCard project={project2} onSelectProject={onSelectProject} size="small" />
            <ProjectCard project={project3} onSelectProject={onSelectProject} size="small" />
          </div>

        </div>

      </div>
    </section>
  );
}
