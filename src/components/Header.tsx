/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, MouseEvent } from "react";
import { Menu, X } from "lucide-react";

interface HeaderProps {
  onOpenProposal: () => void;
  activeSection: string;
}

export default function Header({ onOpenProposal, activeSection }: HeaderProps) {
  const [cairoTime, setCairoTime] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      try {
        const d = new Date();
        const formatter = new Intl.DateTimeFormat("en-US", {
          timeZone: "Africa/Cairo",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        });
        setCairoTime(formatter.format(d));
      } catch (e) {
        // Fallback to standard local time if timezone is not supported
        const d = new Date();
        const hh = String(d.getHours()).padStart(2, "0");
        const mm = String(d.getMinutes()).padStart(2, "0");
        setCairoTime(`${hh}:${mm}`);
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { label: "ABOUT", href: "#about" },
    { label: "PRODUCTS", href: "#products" },
    { label: "PROCESS", href: "#process" },
    { label: "PROJECTS", href: "#projects" },
    { label: "CONTACT", href: "#contact" },
  ];

  const handleNavClick = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-brand-dark/90 backdrop-blur-md border-b border-brand-border-dark py-4 px-6 md:px-12 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <a href="#hero" onClick={(e) => handleNavClick(e, "#hero")} className="flex items-center gap-3 group">
          <div className="relative w-9 h-9 rounded-full border border-brand-accent/60 flex items-center justify-center transition-transform duration-500 group-hover:rotate-180">
            <span className="font-serif text-sm tracking-widest text-brand-light font-bold">IV</span>
            <div className="absolute -inset-[2px] rounded-full border border-dashed border-brand-accent/20 animate-[spin_40s_linear_infinite]" />
          </div>
          <div className="flex flex-col">
            <span className="font-mono text-[9px] tracking-[0.25em] text-brand-accent font-semibold">4TH GENERATION</span>
            <span className="font-sans text-[8px] tracking-[0.1em] text-gray-500 uppercase -mt-[2px]">CRAFT • COGNITIVE</span>
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-10">
          {navItems.map((item) => {
            const isActive = activeSection === item.href.substring(1);
            return (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className={`font-sans text-[11px] tracking-[0.2em] font-medium transition-colors relative py-1 ${
                  isActive ? "text-brand-accent" : "text-gray-400 hover:text-brand-light"
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-[1px] bg-brand-accent" />
                )}
              </a>
            );
          })}
        </nav>

        {/* Cairo Time & CTA Button */}
        <div className="hidden md:flex items-center gap-8">
          <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.15em] text-gray-400 border-r border-brand-border-dark pr-6 py-1">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-accent animate-pulse" />
            <span>{cairoTime || "16:16"}</span>
            <span className="text-gray-600 font-sans">•</span>
            <span>CAI</span>
          </div>
          <button
            onClick={onOpenProposal}
            className="group relative px-5 py-2 overflow-hidden border border-brand-accent text-brand-light font-sans text-[11px] tracking-[0.15em] transition-colors duration-300"
          >
            <span className="absolute inset-0 bg-brand-accent translate-y-full transition-transform duration-300 ease-out group-hover:translate-y-0" />
            <span className="relative z-10 font-semibold group-hover:text-brand-dark">GET PROPOSAL</span>
          </button>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex items-center gap-4 md:hidden">
          <button
            onClick={onOpenProposal}
            className="px-3 py-1.5 border border-brand-accent text-brand-light font-sans text-[9px] tracking-[0.1em] font-medium"
          >
            PROPOSAL
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-brand-light focus:outline-none p-1 border border-brand-border-dark"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-[70px] bg-brand-dark border-b border-brand-border-dark p-6 animate-fade-in-down z-40">
          <div className="flex flex-col gap-5">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className="font-sans text-xs tracking-[0.15em] text-gray-400 hover:text-brand-accent py-1"
              >
                {item.label}
              </a>
            ))}
            <div className="flex items-center justify-between pt-4 border-t border-brand-border-dark">
              <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.1em] text-gray-400">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-accent animate-pulse" />
                <span>{cairoTime || "16:16"}</span>
                <span>•</span>
                <span>CAI</span>
              </div>
              <span className="text-[10px] tracking-wider text-gray-500 uppercase">Est. IV • MMXXVI</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
