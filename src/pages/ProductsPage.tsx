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
import woodVeneerSamples from "../assets/images/standalone/wood-veneer-samples.jpg";
import luxuryBlackGoldKitchen from "../assets/images/standalone/luxury-black-gold-kitchen.jpg";
import luxuryWalkInWardrobe from "../assets/images/standalone/luxury-walk-in-wardrobe.jpg";
import luxuryBathroomVanity from "../assets/images/standalone/luxury-bathroom-vanity.jpg";

export default function ProductsPage() {
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
          <div className="subhero-img"><img src={woodVeneerSamples} alt="IV Products" /></div>
          <div className="subhero-inner">
            <div className="crumbs"><a href="/">Home</a> / Products</div>
            <div className="eyebrow reveal" style={{ color: 'var(--gold)' }}>What we build</div>
            <h1 className="reveal"><span style={{ color: 'var(--gold)' }}>Three signatures</span><span className="orange-dot"></span> <em><span style={{ color: 'var(--gold)' }}>One</span> manufacturing standard</em><span className="orange-dot">.</span></h1>
            <p className="reveal">Kitchens, dressing rooms, and vanities — every unit passes through the same seven checkpoints. The material changes. The standard does not.</p>
          </div>
        </section>

        {/* CATEGORIES */}
        <section className="section products">
          <div className="wrap">
            <div className="prod-grid reveal-stagger">

              <Link to="/contact" className="prod-card" data-cursor="drag">
                <div className="prod-img"><img src={luxuryBlackGoldKitchen} alt="Kitchens" /></div>
                <div className="arrow"><i className="ti ti-arrow-up-right" /></div>
                <div className="body">
                  <div className="idx">SIGNATURE · 01</div>
                  <h3>Kitchens</h3>
                  <div className="meta"><span>Modular · CNC‑cut</span><span>340+ units / 2026</span></div>
                </div>
              </Link>

              <Link to="/contact" className="prod-card" data-cursor="drag">
                <div className="prod-img"><img src={luxuryWalkInWardrobe} alt="Dressing Rooms" /></div>
                <div className="arrow"><i className="ti ti-arrow-up-right" /></div>
                <div className="body">
                  <div className="idx">SIGNATURE · 02</div>
                  <h3>Dressing Rooms</h3>
                  <div className="meta"><span>Bespoke · Walnut</span><span>Made to spec</span></div>
                </div>
              </Link>

              <Link to="/contact" className="prod-card" data-cursor="drag">
                <div className="prod-img"><img src={luxuryBathroomVanity} alt="Vanities" /></div>
                <div className="arrow"><i className="ti ti-arrow-up-right" /></div>
                <div className="body">
                  <div className="idx">SIGNATURE · 03</div>
                  <h3>Vanities</h3>
                  <div className="meta"><span>Fluted · Brass</span><span>Contract‑grade</span></div>
                </div>
              </Link>

            </div>
          </div>
        </section>

        {/* CATEGORY DETAIL */}
        <section className="section about" style={{ paddingTop: 0 }}>
          <div className="wrap" style={{ display: 'flex', flexDirection: 'column', gap: '70px' }}>

            <div className="split-block">
              <div>
                <div className="eyebrow reveal">SIGNATURE · 01</div>
                <h2 className="reveal" style={{ fontSize: 'clamp(30px,3.2vw,44px)', margin: '18px 0 20px', fontWeight: 300, fontVariationSettings: "'opsz' 144" }}>Kitchens</h2>
                <p className="lede reveal">Fully modular kitchen systems engineered for phased, multi‑unit developer delivery — from carcass to handle, cut from one digital file.</p>
              </div>
              <div className="about-img-wrap reveal" data-tilt="" style={{ aspectRatio: '16/10' }}>
                <div className="about-img-frame"></div>
                <div className="about-img"><img src={luxuryBlackGoldKitchen} alt="Kitchens" /></div>
                <div className="about-img-tag">Modular · CNC‑cut</div>
              </div>
            </div>

            <div className="split-block">
              <div>
                <div className="eyebrow reveal">SIGNATURE · 02</div>
                <h2 className="reveal" style={{ fontSize: 'clamp(30px,3.2vw,44px)', margin: '18px 0 20px', fontWeight: 300, fontVariationSettings: "'opsz' 144" }}>Dressing Rooms</h2>
                <p className="lede reveal">Bespoke walnut dressing rooms and wardrobe systems, made to the millimetre for private villas and penthouse suites.</p>
              </div>
              <div className="about-img-wrap reveal" data-tilt="" style={{ aspectRatio: '16/10' }}>
                <div className="about-img-frame"></div>
                <div className="about-img"><img src={luxuryWalkInWardrobe} alt="Dressing Rooms" /></div>
                <div className="about-img-tag">Bespoke · Walnut</div>
              </div>
            </div>

            <div className="split-block">
              <div>
                <div className="eyebrow reveal">SIGNATURE · 03</div>
                <h2 className="reveal" style={{ fontSize: 'clamp(30px,3.2vw,44px)', margin: '18px 0 20px', fontWeight: 300, fontVariationSettings: "'opsz' 144" }}>Vanities</h2>
                <p className="lede reveal">Fluted, brass‑detailed vanity units built to contract‑grade specification for hospitality and high‑end residential.</p>
              </div>
              <div className="about-img-wrap reveal" data-tilt="" style={{ aspectRatio: '16/10' }}>
                <div className="about-img-frame"></div>
                <div className="about-img"><img src={luxuryBathroomVanity} alt="Vanities" /></div>
                <div className="about-img-tag">Fluted · Brass</div>
              </div>
            </div>

          </div>
        </section>

        {/* MATERIALS */}
        <section className="section tech">
          <div className="wrap">
            <div className="tech-head">
              <div>
                <div className="eyebrow reveal">Materials &amp; hardware</div>
                <h2 className="reveal">The palette <em>behind every unit<span className="orange-dot">.</span></em></h2>
              </div>
              <p className="reveal">A curated set of veneers, laminates, and hardware — sourced for durability and consistency across a full production run.</p>
            </div>
            <div className="mat-strip reveal-stagger" style={{ marginTop: 0 }}>

              <div><b>M · 01</b>Oak veneer</div>

              <div><b>M · 02</b>Walnut solid</div>

              <div><b>M · 03</b>Fenix laminate</div>

              <div><b>M · 04</b>Egger MDF</div>

              <div><b>M · 05</b>Brass hardware</div>

            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="cta">
          <div className="wrap cta-inner reveal">
            <div className="eyebrow" style={{ justifyContent: 'center' }}>Ready when you are</div>
            <h2>Spec a <em>run.</em></h2>
            <p>Tell us the category, the unit count, and the timeline — we'll come back with a fixed price and a committed delivery date.</p>
            <div className="cta-btns">
              <Link to="/contact" className="btn filled" data-cursor="link" data-magnetic="">Get a Proposal <i className="ti ti-arrow-up-right" /></Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
