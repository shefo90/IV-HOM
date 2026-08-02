/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MouseEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useContent } from "../content/ContentProvider";
import RichText from "./RichText";

export default function FooterSection() {
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/";
  const { footer } = useContent().site;

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
          {footer.watermark}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-12 gap-12 md:gap-8 relative z-10">
          
          {/* Brand Info */}
          <div className="col-span-2 md:col-span-4 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full border border-brand-accent flex items-center justify-center">
                <span className="font-serif text-xs font-bold text-brand-light">{footer.monogram}</span>
              </div>
            </div>
            <p className="font-sans text-xs text-gray-500 leading-relaxed max-w-sm">
              {/* dot={false}: these periods end ordinary sentences, they are
                  not the oversized heading dot. */}
              <RichText dot={false} goldClass="text-brand-accent">
                {footer.blurb}
              </RichText>
            </p>
          </div>

          {/* Nav Links Column */}
          <div className="md:col-span-2 md:col-start-6 space-y-4">
            <h4 className="font-mono text-[9px] tracking-[0.25em] text-brand-accent font-bold uppercase">
              {footer.navHeading}
            </h4>
            <ul className="space-y-2.5 font-sans text-xs text-gray-400">
              {footer.navLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href} onClick={(e) => handleNavClick(e, link.href)} className="hover:text-brand-accent transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info Column - Now beside Navigate */}
          <div className="md:col-span-2 space-y-4">
            <h4 className="font-mono text-[9px] tracking-[0.25em] text-brand-accent font-bold uppercase">
              {footer.contactHeading}
            </h4>
            <ul className="space-y-2.5 font-sans text-xs text-gray-400">
              {footer.contactLines.map((line, idx) => (
                <li key={idx}>{line}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}