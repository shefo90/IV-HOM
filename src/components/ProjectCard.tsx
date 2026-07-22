/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ReferenceProject } from "../data";

interface ProjectCardProps {
  project: ReferenceProject;
  onSelectProject: (title: string) => void;
  size?: "large" | "small";
}

export default function ProjectCard({ project, onSelectProject, size = "small" }: ProjectCardProps) {
  const images = project.images || [project.image];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const isLarge = size === "large";

  return (
    <div
      onClick={() => onSelectProject(project.title)}
      className={`group border border-brand-border-dark p-3 bg-brand-card-dark/40 flex flex-col justify-between cursor-pointer hover:border-brand-accent/30 transition-all duration-500 rounded-sm ${
        isLarge ? "lg:col-span-7" : ""
      }`}
    >
      <div className={`relative overflow-hidden ${isLarge ? "aspect-[4/3] sm:aspect-[16/10]" : "aspect-[16/10]"} mb-${isLarge ? "6" : "5"}`}>
        <img
          src={images[currentImageIndex]}
          alt={`${project.title} - Image ${currentImageIndex + 1}`}
          className="w-full h-full object-cover grayscale-[35%] group-hover:grayscale-0 group-hover:scale-[1.03] transition-all duration-1000 object-center"
          referrerPolicy="no-referrer"
        />
        
        {/* Case Number Badge */}
        <div className="absolute top-4 right-4 bg-brand-dark/90 backdrop-blur-sm px-3 py-1 border border-white/10 font-mono text-[8px] tracking-widest text-brand-accent">
          {project.caseNumber}
        </div>

        {/* Gallery Navigation - Only show if multiple images */}
        {images.length > 1 && (
          <>
            {/* Previous Button */}
            <button
              onClick={handlePrevImage}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-brand-dark/90 backdrop-blur-sm border border-brand-accent/30 p-2 hover:bg-brand-accent/20 transition-all opacity-0 group-hover:opacity-100 z-10"
              aria-label="Previous image"
            >
              <ChevronLeft size={20} className="text-brand-accent" />
            </button>

            {/* Next Button */}
            <button
              onClick={handleNextImage}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-brand-dark/90 backdrop-blur-sm border border-brand-accent/30 p-2 hover:bg-brand-accent/20 transition-all opacity-0 group-hover:opacity-100 z-10"
              aria-label="Next image"
            >
              <ChevronRight size={20} className="text-brand-accent" />
            </button>

            {/* Image Indicators */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-10">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImageIndex(idx);
                  }}
                  className={`w-2 h-2 rounded-full transition-all ${
                    idx === currentImageIndex
                      ? "bg-brand-accent w-6"
                      : "bg-gray-500/60 hover:bg-gray-400"
                  }`}
                  aria-label={`Go to image ${idx + 1}`}
                />
              ))}
            </div>

            {/* Image Counter */}
            <div className="absolute top-4 left-4 bg-brand-dark/90 backdrop-blur-sm px-2 py-1 border border-white/10 font-mono text-[8px] tracking-widest text-gray-400">
              {currentImageIndex + 1} / {images.length}
            </div>
          </>
        )}
      </div>

      <div className={`space-y-${isLarge ? "4" : "3"} px-2 pb-2`}>
        <div className="flex justify-between items-center text-brand-accent font-mono text-[9px] tracking-widest uppercase">
          <span>{project.location}</span>
          {isLarge && (
            <>
              <span>•</span>
              <span>DEVELOPER</span>
            </>
          )}
        </div>
        <h3 className={`font-serif ${isLarge ? "text-2xl sm:text-3xl" : "text-xl sm:text-2xl"} text-brand-light group-hover:text-brand-accent transition-colors duration-300`}>
          {project.title}
        </h3>
        <p className={`font-sans ${isLarge ? "text-[11px]" : "text-xs"} text-gray-400 uppercase tracking-widest`}>
          {project.scope}
        </p>
        {isLarge && (
          <p className="font-sans text-xs text-gray-500 leading-relaxed max-w-xl">
            {project.description}
          </p>
        )}
      </div>
    </div>
  );
}
