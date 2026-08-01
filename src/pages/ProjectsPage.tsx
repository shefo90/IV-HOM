/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useRef } from "react";
import { Link } from "react-router-dom";
import useScrollProgress from "../hooks/useScrollProgress";
import useReveal from "../hooks/useReveal";
import useMagnetic from "../hooks/useMagnetic";
import luxuryWalkInWardrobe from "../assets/images/standalone/luxury-walk-in-wardrobe.jpg";
import luxuryBlackGoldKitchen from "../assets/images/standalone/luxury-black-gold-kitchen.jpg";
import luxuryBathroomVanity from "../assets/images/standalone/luxury-bathroom-vanity.jpg";

export default function ProjectsPage() {
  const ref = useRef<HTMLDivElement>(null);

  useScrollProgress(ref);
  useReveal(ref);
  useMagnetic(ref);

  return (
    <div className="iv-page" ref={ref}>
      <div className="scroll-progress" id="scrollProgress" />
      <main>{/* SUBHERO */}
        <section className="subhero">
          <div className="subhero-img"><img src={luxuryWalkInWardrobe} alt="IV Projects" /></div>
          <div className="subhero-inner">
            <div className="crumbs"><a href="/">Home</a> / Projects</div>
            <div className="eyebrow reveal" style={{ color: 'var(--gold)' }}>Reference projects</div>
            <h1 className="reveal"><span style={{ color: 'var(--gold)' }}>Capacity</span>, <em>proven</em><span className="orange-dot">.</span></h1>
            <p className="reveal">A selection from the 2026 production year. Numbers are auditable — timelines, unit counts, defect rates. Ask for the full brief.</p>
          </div>
        </section>

        {/* PROJECTS */}
        <section className="section projects">
          <div className="wrap">
            <div className="proj-bar reveal-stagger">
              <div><span className="pval">4,200+</span><span className="plabel">Units delivered</span></div>
              <div><span className="pval">96%</span><span className="plabel">On‑time rate</span></div>
              <div><span className="pval">&lt;0.4%</span><span className="plabel">Defect rate</span></div>
              <div><span className="pval">2026</span><span className="plabel">Production year</span></div>
            </div>
            <div className="proj-grid reveal">
              <div className="proj-card tall" data-cursor="drag">
                <div className="pimg"><img src={luxuryBlackGoldKitchen} alt="Zed East Residences" /></div>
                <div className="proj-corner">Case 01</div>
                <div className="proj-info">
                  <div className="tag">New Cairo · Developer</div>
                  <h3>Zed East Residences</h3>
                  <p>340 kitchen units · phased delivery across 6 months · zero rejects</p>
                </div>
              </div>
              <div className="proj-side">
                <div className="proj-card" data-cursor="drag">
                  <div className="pimg"><img src={luxuryWalkInWardrobe} alt="Marassi North Coast" /></div>
                  <div className="proj-corner">Case 02</div>
                  <div className="proj-info">
                    <div className="tag">Sidi Abdel Rahman</div>
                    <h3>Marassi North Coast</h3>
                    <p>88 villa kitchens · handed over June 2026</p>
                  </div>
                </div>
                <div className="proj-card" data-cursor="drag">
                  <div className="pimg"><img src={luxuryBathroomVanity} alt="Palm Hills Katameya" /></div>
                  <div className="proj-corner">Case 03</div>
                  <div className="proj-info">
                    <div className="tag">Katameya · Private Villa</div>
                    <h3>Palm Hills Katameya</h3>
                    <p>Full interior fit‑out · architect‑specified detailing</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="cta">
          <div className="wrap cta-inner reveal">
            <div className="eyebrow" style={{ justifyContent: 'center' }}>Your project could be next</div>
            <h2>Start a <em>brief.</em></h2>
            <p>Send us the scope and we'll come back with a fixed price and a committed timeline.</p>
            <div className="cta-btns">
              <Link to="/contact" className="btn filled" data-cursor="link" data-magnetic="">Get a Proposal <i className="ti ti-arrow-up-right" /></Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
