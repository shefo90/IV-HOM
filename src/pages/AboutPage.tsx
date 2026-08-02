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
import { useContent } from "../content/ContentProvider";
import RichText from "../components/RichText";

export default function AboutPage() {
  const ref = useRef<HTMLDivElement>(null);
  const { subhero, mission, stats, values, cta } = useContent().about;

  useScrollProgress(ref);
  useReveal(ref);
  useMagnetic(ref);
  useTilt(ref);

  return (
    <div className="iv-page" ref={ref}>
      <div className="scroll-progress" id="scrollProgress" />
      <main>{/* SUBHERO */}
        <section className="subhero">
          <div className="subhero-img"><img src={subhero.image} alt={subhero.imageAlt} /></div>
          <div className="subhero-inner">
            <div className="crumbs"><a href="/">{subhero.crumbs.homeLabel}</a> / {subhero.crumbs.current}</div>
            <div className="eyebrow reveal" style={{ color: 'var(--gold)' }}>{subhero.eyebrow}</div>
            <h1 className="reveal"><RichText>{subhero.heading}</RichText></h1>
            <p className="reveal">{subhero.body}</p>
          </div>
        </section>

        {/* MISSION */}
        <section className="section about" id="mission">
          <div className="wrap about-grid">
            <div className="about-txt">
              <div className="eyebrow reveal">{mission.eyebrow}</div>
              <h2 className="reveal"><RichText>{mission.heading}</RichText></h2>
              <p className="lede reveal">{mission.lede}</p>
              {mission.body.map((paragraph, idx) => (
                <p className="reveal" key={idx}>{paragraph}</p>
              ))}
            </div>
            <div className="about-img-wrap reveal" data-tilt="">
              <div className="about-img-frame"></div>
              <div className="about-img">
                <img src={mission.image} alt={mission.imageAlt} />
              </div>
              <div className="about-img-corner">{mission.imageCorner}</div>
              <div className="about-img-tag">{mission.imageTag}</div>
            </div>
          </div>
        </section>

        {/* STATS */}
        <section className="section numbers">
          <div className="wrap">
            <div className="num-grid reveal-stagger">
              {stats.map((stat, idx) => (
                <div className="num-item" key={idx}>
                  <div className="idx">{stat.index}</div>
                  <div className="num-val" style={{ fontSize: 'clamp(30px,3.4vw,48px)' }}>{stat.value}</div>
                  <div className="num-label">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* VALUES */}
        <section className="section why">
          <div className="wrap">
            <div className="why-head">
              <div>
                <div className="eyebrow reveal">{values.eyebrow}</div>
                <h2 className="reveal"><RichText>{values.heading}</RichText></h2>
              </div>
            </div>
            <div className="why-grid reveal">
              {values.cards.map((card, idx) => (
                <div className="why-card" data-cursor="hover" key={idx}>
                  <div className="why-num">{card.number}</div>
                  <h3>{card.title}</h3>
                  <p>{card.description}</p>
                </div>
              ))}
              <div className="why-card feature">
                <div className="why-num">{values.feature.number}</div>
                {/* dot={false}: this card's periods are ordinary sentence ends,
                    and the newline in the title is the original <br />. */}
                <h3><RichText dot={false}>{values.feature.title}</RichText></h3>
                <p style={{ marginTop: '16px' }}>{values.feature.body}</p>
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
              <Link to={cta.secondaryTo} className="btn btn-ghost" data-cursor="link" data-magnetic="">{cta.secondaryLabel}</Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
