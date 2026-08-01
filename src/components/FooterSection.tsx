/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MouseEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function FooterSection() {
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/";

  // On the home page these are same-page anchor scrolls, exactly as before.
  // On the six converted routes there is nothing to scroll to (those ids only
  // exist on the home page), so navigate to the real route instead — that
  // includes "#process", which has no target on the home page either (that's
  // pre-existing and left alone), but does have a real /process route.
  const handleNavClick = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    if (isHome) {
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      navigate(`/${href.slice(1)}`);
    }
  };

  return (
    <section className="relative bg-brand-dark overflow-hidden border-t border-brand-border-dark">
      {/* Background blueprint elements */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(212,107,67,0.015)_1px,transparent_1.5px)] bg-[size:30px_30px] pointer-events-none" />

      {/* Footer Sitemap */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-20 pb-12 relative z-10">
        
        {/* Giant Outlined Background "IV" */}
        <div className="absolute right-6 bottom-32 font-serif text-[18vw] leading-none select-none pointer-events-none text-transparent opacity-10 font-bold tracking-tighter z-0" style={{ WebkitTextStroke: "1.5px rgba(255,255,255,0.2)" }}>
          IV
        </div>

        <div className="grid grid-cols-2 md:grid-cols-12 gap-12 md:gap-8 relative z-10">
          
          {/* Brand Info */}
          <div className="col-span-2 md:col-span-4 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full border border-brand-accent flex items-center justify-center">
                <span className="font-serif text-xs font-bold text-brand-light">IV</span>
              </div>
            </div>
            <p className="font-sans text-xs text-gray-500 leading-relaxed max-w-sm">
              The fixed-furniture manufacturing brand of HS Wood Industries. <span className="text-brand-accent">Fourth-generation</span>
              craft, powered by Industry 4.0.
            </p>
          </div>

          {/* Nav Links Column */}
          <div className="md:col-span-2 md:col-start-6 space-y-4">
            <h4 className="font-mono text-[9px] tracking-[0.25em] text-brand-accent font-bold uppercase">
              NAVIGATE
            </h4>
            <ul className="space-y-2.5 font-sans text-xs text-gray-400">
              <li>
                <a href="#about" onClick={(e) => handleNavClick(e, "#about")} className="hover:text-brand-accent transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="#products" onClick={(e) => handleNavClick(e, "#products")} className="hover:text-brand-accent transition-colors">
                  Products
                </a>
              </li>
              <li>
                <a href="#process" onClick={(e) => handleNavClick(e, "#process")} className="hover:text-brand-accent transition-colors">
                  Process
                </a>
              </li>
              <li>
                <a href="#projects" onClick={(e) => handleNavClick(e, "#projects")} className="hover:text-brand-accent transition-colors">
                  Projects
                </a>
              </li>
              <li>
                <a href="#contact" onClick={(e) => handleNavClick(e, "#contact")} className="hover:text-brand-accent transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info Column - Now beside Navigate */}
          <div className="md:col-span-2 space-y-4">
            <h4 className="font-mono text-[9px] tracking-[0.25em] text-brand-accent font-bold uppercase">
              CONTACT
            </h4>
            <ul className="space-y-2.5 font-sans text-xs text-gray-400">
              <li>+20 107 0009907</li>
              <li>contact@ivfixed.com</li>
              <li>Industrial area factory buildings 7 8 9 10 / Anabib Al Petrol Street Gesr Al Suez, Cairo</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}