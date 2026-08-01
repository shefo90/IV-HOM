/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useRef } from "react";
import { Link } from "react-router-dom";
import useScrollProgress from "../hooks/useScrollProgress";
import useReveal from "../hooks/useReveal";
import useMagnetic from "../hooks/useMagnetic";
import useTilt from "../hooks/useTilt";
import factoryCncCutting from "../assets/images/standalone/factory-cnc-cutting.jpg";
import craftsmanMeasuringDetail from "../assets/images/standalone/craftsman-measuring-detail.jpg";

export default function AboutPage() {
  const ref = useRef<HTMLDivElement>(null);

  useScrollProgress(ref);
  useReveal(ref);
  useMagnetic(ref);
  useTilt(ref);

  return (
    <div className="iv-page" ref={ref}>
      <div className="scroll-progress" id="scrollProgress" />
      <main>{/* SUBHERO */}
        <section className="subhero">
          <div className="subhero-img"><img src={factoryCncCutting} alt="About IV" /></div>
          <div className="subhero-inner">
            <div className="crumbs"><a href="/">Home</a> / About</div>
            <div className="eyebrow reveal" style={{ color: 'var(--gold)' }}>About IV</div>
            <h1 className="reveal"><span style={{ color: 'var(--gold)' }}>Fourth‑generation craft</span>, <em>built for scale</em><span className="orange-dot">.</span></h1>
            <p className="reveal">IV is the fixed‑furniture manufacturing brand of HS Wood Industries — Egypt's first digital‑first fixed furniture atelier, serving developers and architects who need consistent quality across volume.</p>
          </div>
        </section>

        {/* MISSION */}
        <section className="section about" id="mission">
          <div className="wrap about-grid">
            <div className="about-txt">
              <div className="eyebrow reveal">Our story</div>
              <h2 className="reveal">From a family workshop <em>to an Industry 4.0 factory<span className="orange-dot">.</span></em></h2>
              <p className="lede reveal">Four generations of woodworking, rebuilt around a digital production line.</p>
              <p className="reveal">HS Wood Industries began as a family joinery workshop. Today, IV is its fixed‑furniture brand — an 8,500m² factory floor where every kitchen, dressing room, and vanity is cut from the same digital file, whether it's unit one or unit three‑hundred.</p>
              <p className="reveal">We exist in the gap between low‑cost workshops that can't hold tolerance at scale, and imported franchises that can't localise price or lead time. Our answer is a digital‑first production system, run by a <span style={{ color: 'var(--gold)' }}></span>fourth‑generation team that still signs off every unit by hand.</p>
            </div>
            <div className="about-img-wrap reveal" data-tilt="">
              <div className="about-img-frame"></div>
              <div className="about-img">
                <img src={craftsmanMeasuringDetail} alt="Craftsmanship at HS Wood" />
              </div>
              <div className="about-img-corner">IV · HS WOOD</div>
              <div className="about-img-tag">Fig. 01 — In the workshop</div>
            </div>
          </div>
        </section>

        {/* STATS */}
        <section className="section numbers">
          <div className="wrap">
            <div className="num-grid reveal-stagger">
              <div className="num-item">
                <div className="idx">N° 1</div>
                <div className="num-val" style={{ fontSize: 'clamp(30px,3.4vw,48px)' }}>IV</div>
                <div className="num-label">Generations</div>
              </div>
              <div className="num-item">
                <div className="idx">N° 2</div>
                <div className="num-val" style={{ fontSize: 'clamp(30px,3.4vw,48px)' }}>8,500m²</div>
                <div className="num-label">Factory floor</div>
              </div>
              <div className="num-item">
                <div className="idx">N° 3</div>
                <div className="num-val" style={{ fontSize: 'clamp(30px,3.4vw,48px)' }}>120</div>
                <div className="num-label">Production workforce</div>
              </div>
              <div className="num-item">
                <div className="idx">N° 4</div>
                <div className="num-val" style={{ fontSize: 'clamp(30px,3.4vw,48px)' }}>&lt;0.4%</div>
                <div className="num-label">Defect rate</div>
              </div>
            </div>
          </div>
        </section>

        {/* VALUES */}
        <section className="section why">
          <div className="wrap">
            <div className="why-head">
              <div>
                <div className="eyebrow reveal">What we stand for</div>
                <h2 className="reveal">Seven disciplines. <em>Every project, every time<span className="orange-dot">.</span></em></h2>
              </div>
            </div>
            <div className="why-grid reveal">
              <div className="why-card" data-cursor="hover">
                <div className="why-num">D · 01</div>
                <h3>Precision manufacturing</h3>
                <p>CNC technology delivering sub‑millimetre accuracy on every panel, every batch.</p>
              </div>
              <div className="why-card" data-cursor="hover">
                <div className="why-num">D · 02</div>
                <h3>Faster delivery</h3>
                <p>Optimised digital processes deliver every project on time, at scale.</p>
              </div>
              <div className="why-card" data-cursor="hover">
                <div className="why-num">D · 03</div>
                <h3>Premium hardware</h3>
                <p>Blum and top‑tier Austrian components on every hinge and slide.</p>
              </div>
              <div className="why-card" data-cursor="hover">
                <div className="why-num">D · 04</div>
                <h3>Transparent process</h3>
                <p>Digital communication from first sketch to final handover, versioned and traceable.</p>
              </div>
              <div className="why-card feature">
                <div className="why-num">The IV Signature</div>
                <h3>Every project.<br />Every time.</h3>
                <p style={{ marginTop: '16px' }}>The signature is invisible — because it is everywhere.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="cta">
          <div className="wrap cta-inner reveal">
            <div className="eyebrow" style={{ justifyContent: 'center' }}>Meet the team in person</div>
            <h2>Let's <em>talk.</em></h2>
            <p>Schedule a factory tour, or get a project‑specific proposal with a committed timeline and a fixed price.</p>
            <div className="cta-btns">
              <Link to="/contact" className="btn filled" data-cursor="link" data-magnetic="">Get a Proposal <i className="ti ti-arrow-up-right" /></Link>
              <Link to="/projects" className="btn btn-ghost" data-cursor="link" data-magnetic="">See Our Work</Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
