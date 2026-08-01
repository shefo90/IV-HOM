/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useRef } from "react";
import { Link } from "react-router-dom";
import useScrollProgress from "../hooks/useScrollProgress";
import useReveal from "../hooks/useReveal";
import useMagnetic from "../hooks/useMagnetic";
import useCounters from "../hooks/useCounters";
import useTimelineFill from "../hooks/useTimelineFill";
import craftsmanMeasuringDetail from "../assets/images/standalone/craftsman-measuring-detail.jpg";
import "../styles/standalone-process.css";

export default function ProcessPage() {
  const ref = useRef<HTMLDivElement>(null);

  useScrollProgress(ref);
  useReveal(ref);
  useMagnetic(ref);
  useCounters(ref);
  useTimelineFill(ref);

  return (
    <div className="iv-page iv-process" ref={ref}>
      <div className="scroll-progress" id="scrollProgress" />
      <main>{/* SUBHERO */}
        <section className="subhero">
          <div className="subhero-img"><img src={craftsmanMeasuringDetail} alt="IV Process" /></div>
          <div className="subhero-inner">
            <div className="crumbs"><a href="/">Home</a> / Process</div>
            <div className="eyebrow reveal" style={{ color: 'var(--gold)' }}>How we build</div>
            <h1 className="reveal"><span style={{ color: 'var(--gold)' }}>Seven stages</span><span className="orange-dot"></span> <em><span style={{ color: 'var(--gold)' }}>Every checkpoint</span> has a signature</em><span className="orange-dot">.</span></h1>
            <p className="reveal">Each stage is owned. Each hand‑off is documented. The line between digital file and finished cabinet is unbroken — from measurement to installation.</p>
          </div>
        </section>

        {/* PROCESS TIMELINE */}
        <section className="section process" id="ptl">
          <div className="wrap">
            <div className="process-timeline reveal" id="ptimeline">
              <div className="process-timeline-fill" id="ptimeline-fill"></div>
              <div className="process-steps">
                <div className="pstep"><div className="pdot"></div><div className="plabel">Sarah, Site Lead</div><div className="pnum">Stage 01</div><h4>Measurement</h4><p>On‑site verified against architectural drawings — no assumptions.</p></div>
                <div className="pstep"><div className="pdot"></div><div className="plabel">Karim, Design</div><div className="pnum">Stage 02</div><h4>3D Design</h4><p>Full digital model rendered for client approval before cutting.</p></div>
                <div className="pstep"><div className="pdot"></div><div className="plabel">Omar, Engineering</div><div className="pnum">Stage 03</div><h4>Engineering</h4><p>Fit, function, and hardware placement reviewed and locked.</p></div>
                <div className="pstep"><div className="pdot"></div><div className="plabel">CNC Cell A</div><div className="pnum">Stage 04</div><h4>CNC Cutting</h4><p>Panels cut to exact digital spec on 5‑axis HOMAG router.</p></div>
                <div className="pstep"><div className="pdot"></div><div className="plabel">Assembly Bay</div><div className="pnum">Stage 05</div><h4>Assembly</h4><p>Edge banded, hardware fitted, units built to specification.</p></div>
                <div className="pstep"><div className="pdot"></div><div className="plabel">QC Station</div><div className="pnum">Stage 06</div><h4>QC Inspection</h4><p>Every unit checked against original spec — nothing leaves unverified<span className="orange-dot">.</span></p></div>
                <div className="pstep"><div className="pdot"></div><div className="plabel">Field Team</div><div className="pnum">Stage 07</div><h4>Installation</h4><p>Trained in‑house team on site — signed off by the client.</p></div>
              </div>
            </div>
          </div>
        </section>

        {/* TECH */}
        <section className="section tech">
          <div className="wrap">
            <div className="tech-head">
              <div>
                <div className="eyebrow reveal">Technology &amp; materials</div>
                <h2 className="reveal">Guided by the machine. <em>Refined by the maker<span className="orange-dot">.</span></em></h2>
              </div>
              <p className="reveal">Equipment is not the story — capability is. What matters is what happens between the digital file and the finished edge.</p>
            </div>
            <div className="tech-grid reveal">
              <div className="tech-item">
                <div className="eq">EQ · 01</div>
                <h3>CNC Cutting</h3>
                <p>HOMAG 5‑axis flatbed router with 3060×2050mm bed, sub‑millimetre repeatability.</p>
                <div className="spec">
                  <div><span>Tolerance</span><b>&lt; 0.5 mm</b></div>
                  <div><span>Bed</span><b>3060 × 2050</b></div>
                  <div><span>Axes</span><b>5</b></div>
                </div>
              </div>
              <div className="tech-item">
                <div className="eq">EQ · 02</div>
                <h3>Edge Banding Line</h3>
                <p>Automated PU / EVA edge banding — factory‑grade finish on every visible edge, at speed.</p>
                <div className="spec">
                  <div><span>Bonding</span><b>PU / EVA</b></div>
                  <div><span>Cycle</span><b>Automated</b></div>
                  <div><span></span><b></b></div>
                </div>
              </div>
              <div className="tech-item">
                <div className="eq">EQ · 03</div>
                <h3>Drilling &amp; Boring</h3>
                <p>Multi‑spindle CNC boring for hinges, drawer slides, and connectors.</p>
                <div className="spec">
                  <div><span>Precision</span><b>± 0.1 mm</b></div>
                  <div><span>Type</span><b>Multi‑spindle</b></div>
                  <div><span></span><b></b></div>
                </div>
              </div>
              <div className="tech-item">
                <div className="eq">EQ · 04</div>
                <h3>Design Stack</h3>
                <p>AutoCAD, Cabinet Vision, and 3D‑Max rendering — every file stored, versioned, and traceable.</p>
                <div className="spec">
                  <div><span>Tools</span><b>AutoCAD · Cabinet Vision · 3D‑Max</b></div>
                  <div><span></span><b></b></div>
                  <div><span></span><b></b></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* QUALITY */}
        <section className="section quality">
          <div className="wrap">
            <div className="eyebrow reveal">Quality control</div>
            <h2 className="reveal" style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(38px,4.4vw,60px)', marginTop: '22px', maxWidth: '640px', fontWeight: 300, fontVariationSettings: "'opsz' 144" }}>Quality isn't a claim<span className="orange-dot">.</span> <em>It's a checklist</em></h2>
            <div className="quality-grid">
              <div className="quality-left reveal">
                <div className="quality-stat"><span className="lt">{'<'}</span><span className="counter" data-target="0.4" data-decimal="1">0</span><span className="pct">%</span></div>
                <div className="quality-caption">Pre‑dispatch reject rate · 2026</div>
                <p className="quality-lede">Across 4,200 units produced last year. Catching an issue at design stage costs 100× less than catching it after installation.</p>
              </div>
              <div className="qc-list reveal">
                <div className="qc-row" data-cursor="hover"><b>01</b><div><h4>Design‑stage review</h4><p>Technical drawings checked against architectural specifications before a single panel is ordered.</p></div></div>
                <div className="qc-row" data-cursor="hover"><b>02</b><div><h4>In‑process checks</h4><p>Dimensions verified after cutting, before assembly begins.</p></div></div>
                <div className="qc-row" data-cursor="hover"><b>03</b><div><h4>Pre‑dispatch</h4><p>Every completed unit checked against its original spec.</p></div></div>
                <div className="qc-row" data-cursor="hover"><b>04</b><div><h4>Post‑install walkthrough</h4><p>Client sign‑off confirms the finished result matches what was approved.</p></div></div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="cta">
          <div className="wrap cta-inner reveal">
            <div className="eyebrow" style={{ justifyContent: 'center' }}>See it in person</div>
            <h2>Tour the <em>factory.</em></h2>
            <p>Walk the floor, meet the team behind every stage, and see the checkpoints for yourself.</p>
            <div className="cta-btns">
              <Link to="/contact" className="btn filled" data-cursor="link" data-magnetic="">Schedule a Tour <i className="ti ti-arrow-up-right" /></Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
