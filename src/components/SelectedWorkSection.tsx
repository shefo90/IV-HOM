/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { referenceProjects } from "../data";

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
                07 • REFERENCE PROJECTS
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
          <div
            onClick={() => onSelectProject(project1.title)}
            className="lg:col-span-7 group border border-brand-border-dark p-3 bg-brand-card-dark/40 flex flex-col justify-between cursor-pointer hover:border-brand-accent/30 transition-all duration-500 rounded-sm"
          >
            <div className="relative overflow-hidden aspect-[4/3] sm:aspect-[16/10] mb-6">
              <img
                src={project1.image}
                alt={project1.title}
                className="w-full h-full object-cover grayscale-[35%] group-hover:grayscale-0 group-hover:scale-[1.03] transition-all duration-1000 object-center"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-4 right-4 bg-brand-dark/90 backdrop-blur-sm px-3 py-1 border border-white/10 font-mono text-[8px] tracking-widest text-brand-accent">
                {project1.caseNumber}
              </div>
            </div>

            <div className="space-y-4 px-2 pb-2">
              <div className="flex justify-between items-center text-brand-accent font-mono text-[9px] tracking-widest uppercase">
                <span>{project1.location}</span>
                <span>•</span>
                <span>DEVELOPER</span>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl text-brand-light group-hover:text-brand-accent transition-colors duration-300">
                {project1.title}
              </h3>
              <p className="font-sans text-[11px] text-gray-400 uppercase tracking-widest">
                {project1.scope}
              </p>
              <p className="font-sans text-xs text-gray-500 leading-relaxed max-w-xl">
                {project1.description}
              </p>
            </div>
          </div>

          {/* Right Column Stack (Case 02 & Case 03) - taking 5 span */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            
            {/* Case 02 */}
            <div
              onClick={() => onSelectProject(project2.title)}
              className="group border border-brand-border-dark p-3 bg-brand-card-dark/40 flex flex-col justify-between cursor-pointer hover:border-brand-accent/30 transition-all duration-500 rounded-sm"
            >
              <div className="relative overflow-hidden aspect-[16/10] mb-5">
                <img
                  src={project2.image}
                  alt={project2.title}
                  className="w-full h-full object-cover grayscale-[35%] group-hover:grayscale-0 group-hover:scale-[1.03] transition-all duration-1000 object-center"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 right-4 bg-brand-dark/90 backdrop-blur-sm px-3 py-1 border border-white/10 font-mono text-[8px] tracking-widest text-brand-accent">
                  {project2.caseNumber}
                </div>
              </div>

              <div className="space-y-3 px-2 pb-2">
                <div className="flex justify-between items-center text-brand-accent font-mono text-[9px] tracking-widest uppercase">
                  <span>{project2.location}</span>
                </div>
                <h3 className="font-serif text-xl sm:text-2xl text-brand-light group-hover:text-brand-accent transition-colors duration-300">
                  {project2.title}
                </h3>
                <p className="font-sans text-xs text-gray-500 leading-relaxed">
                  {project2.scope}
                </p>
              </div>
            </div>

            {/* Case 03 */}
            <div
              onClick={() => onSelectProject(project3.title)}
              className="group border border-brand-border-dark p-3 bg-brand-card-dark/40 flex flex-col justify-between cursor-pointer hover:border-brand-accent/30 transition-all duration-500 rounded-sm"
            >
              <div className="relative overflow-hidden aspect-[16/10] mb-5">
                <img
                  src={project3.image}
                  alt={project3.title}
                  className="w-full h-full object-cover grayscale-[35%] group-hover:grayscale-0 group-hover:scale-[1.03] transition-all duration-1000 object-center"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 right-4 bg-brand-dark/90 backdrop-blur-sm px-3 py-1 border border-white/10 font-mono text-[8px] tracking-widest text-brand-accent">
                  {project3.caseNumber}
                </div>
              </div>

              <div className="space-y-3 px-2 pb-2">
                <div className="flex justify-between items-center text-brand-accent font-mono text-[9px] tracking-widest uppercase">
                  <span>{project3.location}</span>
                </div>
                <h3 className="font-serif text-xl sm:text-2xl text-brand-light group-hover:text-brand-accent transition-colors duration-300">
                  {project3.title}
                </h3>
                <p className="font-sans text-xs text-gray-500 leading-relaxed">
                  {project3.scope}
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
