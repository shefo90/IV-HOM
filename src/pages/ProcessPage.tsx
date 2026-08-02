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
import { useContent } from "../content/ContentProvider";
import RichText from "../components/RichText";
import "../styles/standalone-process.css";

export default function ProcessPage() {
  const ref = useRef<HTMLDivElement>(null);
  const { subhero, steps, tech, quality, cta } = useContent().process;

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
          <div className="subhero-img"><img src={subhero.image} alt={subhero.imageAlt} /></div>
          <div className="subhero-inner">
            <div className="crumbs"><a href="/">{subhero.crumbs.homeLabel}</a> / {subhero.crumbs.current}</div>
            <div className="eyebrow reveal" style={{ color: 'var(--gold)' }}>{subhero.eyebrow}</div>
            {/* The empty orange-dot between the halves draws no glyph, but its
                1.4em inline box sets this line's height. It is in the original
                markup and removing it lifts the page ~19px, so it stays here
                as structure rather than becoming content. */}
            <h1 className="reveal"><RichText>{subhero.headingLead}</RichText><span className="orange-dot"></span> <RichText>{subhero.headingRest}</RichText></h1>
            <p className="reveal">{subhero.body}</p>
          </div>
        </section>

        {/* PROCESS TIMELINE */}
        <section className="section process" id="ptl">
          <div className="wrap">
            <div className="process-timeline reveal" id="ptimeline">
              <div className="process-timeline-fill" id="ptimeline-fill"></div>
              <div className="process-steps">
                {steps.map((step, idx) => (
                  /* Only stage 06 golds its closing period; the rest escape it. */
                  <div className="pstep" key={idx}><div className="pdot"></div><div className="plabel">{step.owner}</div><div className="pnum">{step.number}</div><h4>{step.title}</h4><p><RichText>{step.description}</RichText></p></div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* TECH */}
        <section className="section tech">
          <div className="wrap">
            <div className="tech-head">
              <div>
                <div className="eyebrow reveal">{tech.eyebrow}</div>
                <h2 className="reveal"><RichText>{tech.heading}</RichText></h2>
              </div>
              <p className="reveal">{tech.intro}</p>
            </div>
            <div className="tech-grid reveal">
              {tech.items.map((item, idx) => (
                <div className="tech-item" key={idx}>
                  <div className="eq">{item.eq}</div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <div className="spec">
                    {item.specs.map((spec, specIdx) => (
                      <div key={specIdx}><span>{spec.label}</span><b>{spec.value}</b></div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* QUALITY */}
        <section className="section quality">
          <div className="wrap">
            <div className="eyebrow reveal">{quality.eyebrow}</div>
            <h2 className="reveal" style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(38px,4.4vw,60px)', marginTop: '22px', maxWidth: '640px', fontWeight: 300, fontVariationSettings: "'opsz' 144" }}><RichText>{quality.heading}</RichText></h2>
            <div className="quality-grid">
              <div className="quality-left reveal">
                <div className="quality-stat"><span className="lt">{'<'}</span><span className="counter" data-target={quality.statTarget} data-decimal={quality.statDecimals}>0</span><span className="pct">%</span></div>
                <div className="quality-caption">{quality.statCaption}</div>
                <p className="quality-lede">{quality.statLede}</p>
              </div>
              <div className="qc-list reveal">
                {quality.rows.map((row, idx) => (
                  <div className="qc-row" data-cursor="hover" key={idx}><b>{row.number}</b><div><h4>{row.title}</h4><p>{row.description}</p></div></div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="cta">
          <div className="wrap cta-inner reveal">
            <div className="eyebrow" style={{ justifyContent: 'center' }}>{cta.eyebrow}</div>
            <h2><RichText>{cta.heading}</RichText></h2>
            <p>{cta.body}</p>
            <div className="cta-btns">
              <Link to={cta.primaryTo} className="btn filled" data-cursor="link" data-magnetic="">{cta.primaryLabel} <i className="ti ti-arrow-up-right" /></Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
