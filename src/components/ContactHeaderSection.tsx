/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export default function ContactHeaderSection() {
  return (
    <section className="relative bg-brand-dark pt-20 md:pt-32 overflow-hidden border-t border-brand-border-dark">
      {/* Background blueprint elements */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(212,107,67,0.015)_1px,transparent_1.5px)] bg-[size:30px_30px] pointer-events-none" />

      {/* Main CTA Section */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 text-center space-y-10 relative z-10 pb-8 md:pb-12">
        <div className="space-y-4 max-w-xl mx-auto">
          <div className="flex items-center justify-center gap-3">
            <span className="h-[1px] w-6 bg-brand-accent" />
            <span className="font-mono text-[9px] tracking-[0.25em] text-brand-accent font-semibold uppercase">
              READY WHEN YOU ARE
            </span>
            <span className="h-[1px] w-6 bg-brand-accent" />
          </div>
          <h2 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-[90px] leading-none text-brand-accent tracking-tighter">
            Let's{" "}
            <span className="italic text-brand-light font-normal">
              build<span className="orange-dot">.</span>
            </span>
          </h2>
        </div>

        <p className="font-sans text-xs sm:text-sm text-gray-400 max-w-md mx-auto leading-relaxed">
          See the factory. Meet the team. Get a project-specific proposal with a committed timeline
          and a fixed price.
        </p>
      </div>
    </section>
  );
}