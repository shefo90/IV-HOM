/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useRef } from "react";
import { Link } from "react-router-dom";
import useScrollProgress from "../hooks/useScrollProgress";
import useReveal from "../hooks/useReveal";
import useMagnetic from "../hooks/useMagnetic";
import useWarrantyCards from "../hooks/useWarrantyCards";
import factoryCncCutting from "../assets/images/standalone/factory-cnc-cutting.jpg";
import "../styles/standalone-factory.css";

export default function FactoryPage() {
  const ref = useRef<HTMLDivElement>(null);

  useScrollProgress(ref);
  useReveal(ref);
  useMagnetic(ref);
  useWarrantyCards(ref);

  return (
    <div className="iv-page iv-factory" ref={ref}>
      <div className="scroll-progress" id="scrollProgress" />
      <main>{/* SUBHERO */}
        <section className="subhero">
          <div className="subhero-img"><img src={factoryCncCutting} alt="Inside the IV Factory" /></div>
          <div className="subhero-inner">
            <div className="crumbs"><a href="/">Home</a> / Factory</div>
            <div className="eyebrow reveal" style={{ color: 'var(--gold)' }}>Inside HS Wood Industries</div>
            <h1 className="reveal"><span style={{ color: 'var(--gold)' }}>The factory</span> <em>behind IV</em><span className="orange-dot">.</span></h1>
            <p className="reveal">A capacity-checked look at the floor, the machines, and the 138 people who turn a digital file into three-hundred identical units — on schedule, every time.</p>
          </div>
        </section>

        {/* CAPACITY */}
        <section className="section numbers" style={{ padding: '120px 0 140px' }}>
          <div className="wrap">
            <div className="numbers-head">
              <div className="eyebrow reveal">1 · Scale</div>
              <h2 className="reveal">Before design. Before price <em>Capacity is what a serious client checks first<span className="orange-dot">.</span></em></h2>
              <p className="lead reveal">8,500 m² of production floor. 450 units per month. 120 craftsmen. The infrastructure exists to take on complex, large-scale projects without compromise — and deliver them on schedule.</p>
            </div>
          </div>
        </section>

        {/* LOGISTICS & INSTALL */}
        <section className="section process">
          <div className="wrap">
            <div className="process-head">
              <div>
                <div className="eyebrow reveal">2 · Delivery</div>
                <h2 className="reveal">Logistics <em>&amp; install<span className="orange-dot">.</span></em></h2>
              </div>
              <p className="reveal">In-house crews. Not ad-hoc subcontractors. The people who installed unit 1 are the people who install unit 340.</p>
            </div>
            <div className="split-block reveal" style={{ marginTop: '50px' }}>
              <div>
                <div className="eyebrow" style={{ color: 'var(--gold-2)' }}>Geographic coverage · Nationwide, Egypt</div>
                <div className="coverage-grid">
                  <div className="qc-row"><b>Cairo</b><span>Same-week installation slots</span></div>
                  <div className="qc-row"><b>New Cairo</b><span>Dedicated developer zone</span></div>
                  <div className="qc-row"><b>North Coast</b><span>Seasonal projects handled</span></div>
                  <div className="qc-row"><b>Sokhna</b><span>Coastal-grade logistics</span></div>
                  <div className="qc-row"><b>Sheikh Zayed</b><span>Compound-cleared teams</span></div>
                  <div className="qc-row"><b>Custom / Export</b><span>On request, project-priced</span></div>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                <div className="qc-row" data-cursor="hover"><b>02</b><div><h4>Trained in-house crews</h4><p>Uniformed, badged, insured — the same faces on every visit, from delivery to walkthrough.</p></div></div>
                <div className="qc-row" data-cursor="hover"><b>03</b><div><h4>Booked, not improvised</h4><p>Installation slots coordinated in advance with the client's own site timeline — no overlapping trades, no chaos.</p></div></div>
                <div className="qc-row" data-cursor="hover"><b>04</b><div><h4>Signed off, unit by unit</h4><p>Every unit walked through with the client — snags logged, closed, and signed off before we leave<span className="orange-dot">.</span></p></div></div>
              </div>
            </div>
          </div>
        </section>

        {/* WARRANTY */}
        <section className="section quality" style={{ background: 'var(--ink)', color: 'var(--text-light)', padding: '100px 0 120px' }}>
          <div className="wrap">
            <div className="eyebrow reveal">3 · Assurance</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'end', marginTop: '22px' }} className="warranty-header-grid">
              <h2 className="reveal" style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(38px,4.4vw,60px)', fontWeight: 300, fontVariationSettings: "'opsz' 144", color: 'var(--text-light)', margin: 0 }}><span style={{ color: 'var(--gold)' }}>Warranty</span> <em>&amp; assurance<span className="orange-dot">.</span></em></h2>
              <p className="reveal" style={{ fontSize: '15px', lineHeight: 1.75, color: 'var(--text-light-mute)', margin: 0, paddingBottom: '6px' }}>A signature at handover isn't the end of the relationship — it's the beginning of the warranty.</p>
            </div>

            <div className="warranty-cards-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1px', background: 'var(--line-dark-2)', marginTop: '70px', border: '1px solid var(--line-dark-2)' }}>

              {/* Card 1 */}
              <div className="wcard" style={{ background: 'var(--ink-2)', padding: '48px 40px', display: 'flex', flexDirection: 'column', gap: '20px', position: 'relative', overflow: 'hidden', opacity: 0, transform: 'translateY(40px)', transition: 'opacity .8s var(--ease),transform .8s var(--ease),box-shadow .4s ease' }}>
                <div className="wcard-line" style={{ position: 'absolute', top: 0, left: 0, width: 0, height: '2px', background: 'var(--gold-soft)', transition: 'width 1s var(--ease)' }}></div>
                <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', letterSpacing: '.22em', textTransform: 'uppercase', color: 'var(--gold-soft)' }}>01 · Manufacturing</div>
                <div style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(72px,8vw,110px)', fontWeight: 300, fontVariationSettings: "'opsz' 144", lineHeight: .85, color: 'var(--gold-soft)', letterSpacing: '-.02em' }}><span className="wcount" data-target="5">0</span><span style={{ fontFamily: 'var(--mono)', fontSize: '.28em', verticalAlign: 'middle', letterSpacing: '.1em', opacity: .75 }}> YRS</span></div>
                <div style={{ borderTop: '1px solid var(--line-dark-2)', paddingTop: '20px' }}>
                  <div style={{ fontFamily: 'var(--serif)', fontSize: '17px', color: 'var(--text-light)', fontWeight: 400 }}>Manufacturing defects</div>
                  <div style={{ fontFamily: 'var(--sans)', fontSize: '13px', color: 'var(--text-light-mute)', marginTop: '8px', lineHeight: 1.65 }}>Structural integrity, panels &amp; joinery — every piece, every joint.</div>
                </div>
              </div>

              {/* Card 2 */}
              <div className="wcard" style={{ background: 'var(--ink-2)', padding: '48px 40px', display: 'flex', flexDirection: 'column', gap: '20px', position: 'relative', overflow: 'hidden', opacity: 0, transform: 'translateY(40px)', transition: 'opacity .8s .15s var(--ease),transform .8s .15s var(--ease),box-shadow .4s ease' }}>
                <div className="wcard-line" style={{ position: 'absolute', top: 0, left: 0, width: 0, height: '2px', background: 'var(--gold-soft)', transition: 'width 1s .15s var(--ease)' }}></div>
                <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', letterSpacing: '.22em', textTransform: 'uppercase', color: 'var(--gold-soft)' }}>02 · Hardware</div>
                <div className="wcard-lifetime" style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(54px,6vw,84px)', fontWeight: 300, fontVariationSettings: "'opsz' 144", lineHeight: .9, color: 'var(--gold-soft)', letterSpacing: '-.02em', paddingTop: '10px', clipPath: 'inset(0 100% 0 0)', transition: 'clip-path 1.1s .4s var(--ease)' }}>Life<br />time</div>
                <div style={{ borderTop: '1px solid var(--line-dark-2)', paddingTop: '20px' }}>
                  <div style={{ fontFamily: 'var(--serif)', fontSize: '17px', color: 'var(--text-light)', fontWeight: 400 }}>Blum hardware</div>
                  <div style={{ fontFamily: 'var(--sans)', fontSize: '13px', color: 'var(--text-light-mute)', marginTop: '8px', lineHeight: 1.65 }}>Hinges, drawer systems &amp; soft-close — covered indefinitely.</div>
                </div>
              </div>

              {/* Card 3 */}
              <div className="wcard" style={{ background: 'var(--ink-2)', padding: '48px 40px', display: 'flex', flexDirection: 'column', gap: '20px', position: 'relative', overflow: 'hidden', opacity: 0, transform: 'translateY(40px)', transition: 'opacity .8s .3s var(--ease),transform .8s .3s var(--ease),box-shadow .4s ease' }}>
                <div className="wcard-line" style={{ position: 'absolute', top: 0, left: 0, width: 0, height: '2px', background: 'var(--gold-soft)', transition: 'width 1s .3s var(--ease)' }}></div>
                <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', letterSpacing: '.22em', textTransform: 'uppercase', color: 'var(--gold-soft)' }}>03 · Support</div>
                <div style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(72px,8vw,110px)', fontWeight: 300, fontVariationSettings: "'opsz' 144", lineHeight: .85, color: 'var(--gold-soft)', letterSpacing: '-.02em' }}><span className="wcount" data-target="72">0</span><span style={{ fontFamily: 'var(--mono)', fontSize: '.28em', verticalAlign: 'middle', letterSpacing: '.1em', opacity: .75 }}> HRS</span></div>
                <div style={{ borderTop: '1px solid var(--line-dark-2)', paddingTop: '20px' }}>
                  <div style={{ fontFamily: 'var(--serif)', fontSize: '17px', color: 'var(--text-light)', fontWeight: 400 }}>Post-installation support</div>
                  <div style={{ fontFamily: 'var(--sans)', fontSize: '13px', color: 'var(--text-light-mute)', marginTop: '8px', lineHeight: 1.65 }}>Response within 72 hours — same-week resolution, always.</div>
                </div>
              </div>

            </div>

            <div style={{ marginTop: '60px', borderLeft: '2px solid var(--gold-soft)', paddingLeft: '28px', opacity: 0, transform: 'translateX(-20px)', transition: 'opacity .9s var(--ease),transform .9s var(--ease)' }} className="wquote-block">
              <div className="warranty-quote" style={{ fontSize: 'clamp(16px,1.6vw,21px)', color: 'var(--text-light-mute)' }}>"Our warranty terms are what we're prepared to put in writing — not what we hope you'll never have to use."</div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="cta">
          <div className="wrap cta-inner reveal">
            <div className="eyebrow" style={{ justifyContent: 'center' }}>Ready when you are</div>
            <h2>See it for <em>yourself.</em></h2>
            <p>Schedule a factory tour — walk the CNC lines, the QC bays, and the finished units before they ship.</p>
            <div className="cta-btns">
              <Link to="/contact" className="btn filled" data-cursor="link" data-magnetic="">Schedule a Factory Tour <i className="ti ti-arrow-up-right" /></Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
