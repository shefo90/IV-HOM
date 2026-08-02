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
import { useContent } from "../content/ContentProvider";
import RichText from "../components/RichText";
import "../styles/standalone-factory.css";

// The three warranty cards stagger in; the delay is presentation, so it stays
// here rather than in the content.
const CARD_DELAY = ['', ' .15s', ' .3s'];

export default function FactoryPage() {
  const ref = useRef<HTMLDivElement>(null);
  const { subhero, capacity, delivery, warranty, cta } = useContent().factory;

  useScrollProgress(ref);
  useReveal(ref);
  useMagnetic(ref);
  useWarrantyCards(ref);

  return (
    <div className="iv-page iv-factory" ref={ref}>
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

        {/* CAPACITY */}
        <section className="section numbers" style={{ padding: '120px 0 140px' }}>
          <div className="wrap">
            <div className="numbers-head">
              <div className="eyebrow reveal">{capacity.eyebrow}</div>
              <h2 className="reveal"><RichText>{capacity.heading}</RichText></h2>
              <p className="lead reveal">{capacity.lead}</p>
            </div>
          </div>
        </section>

        {/* LOGISTICS & INSTALL */}
        <section className="section process">
          <div className="wrap">
            <div className="process-head">
              <div>
                <div className="eyebrow reveal">{delivery.eyebrow}</div>
                <h2 className="reveal"><RichText>{delivery.heading}</RichText></h2>
              </div>
              <p className="reveal">{delivery.intro}</p>
            </div>
            <div className="split-block reveal" style={{ marginTop: '50px' }}>
              <div>
                <div className="eyebrow" style={{ color: 'var(--gold-2)' }}>{delivery.coverageEyebrow}</div>
                <div className="coverage-grid">
                  {delivery.coverage.map((entry, idx) => (
                    <div className="qc-row" key={idx}><b>{entry.area}</b><span>{entry.note}</span></div>
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                {delivery.rows.map((row, idx) => (
                  <div className="qc-row" data-cursor="hover" key={idx}><b>{row.number}</b><div><h4>{row.title}</h4><p><RichText>{row.description}</RichText></p></div></div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* WARRANTY */}
        <section className="section quality" style={{ background: 'var(--ink)', color: 'var(--text-light)', padding: '100px 0 120px' }}>
          <div className="wrap">
            <div className="eyebrow reveal">{warranty.eyebrow}</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'end', marginTop: '22px' }} className="warranty-header-grid">
              <h2 className="reveal" style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(38px,4.4vw,60px)', fontWeight: 300, fontVariationSettings: "'opsz' 144", color: 'var(--text-light)', margin: 0 }}><RichText>{warranty.heading}</RichText></h2>
              <p className="reveal" style={{ fontSize: '15px', lineHeight: 1.75, color: 'var(--text-light-mute)', margin: 0, paddingBottom: '6px' }}>{warranty.intro}</p>
            </div>

            <div className="warranty-cards-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1px', background: 'var(--line-dark-2)', marginTop: '70px', border: '1px solid var(--line-dark-2)' }}>
              {warranty.cards.map((card, idx) => {
                const delay = CARD_DELAY[idx] ?? '';
                return (
                  <div className="wcard" key={idx} style={{ background: 'var(--ink-2)', padding: '48px 40px', display: 'flex', flexDirection: 'column', gap: '20px', position: 'relative', overflow: 'hidden', opacity: 0, transform: 'translateY(40px)', transition: `opacity .8s${delay} var(--ease),transform .8s${delay} var(--ease),box-shadow .4s ease` }}>
                    <div className="wcard-line" style={{ position: 'absolute', top: 0, left: 0, width: 0, height: '2px', background: 'var(--gold-soft)', transition: `width 1s${delay} var(--ease)` }}></div>
                    <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', letterSpacing: '.22em', textTransform: 'uppercase', color: 'var(--gold-soft)' }}>{card.label}</div>
                    {card.count ? (
                      <div style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(72px,8vw,110px)', fontWeight: 300, fontVariationSettings: "'opsz' 144", lineHeight: .85, color: 'var(--gold-soft)', letterSpacing: '-.02em' }}><span className="wcount" data-target={card.count.target}>0</span><span style={{ fontFamily: 'var(--mono)', fontSize: '.28em', verticalAlign: 'middle', letterSpacing: '.1em', opacity: .75 }}>{card.count.suffix}</span></div>
                    ) : (
                      <div className="wcard-lifetime" style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(54px,6vw,84px)', fontWeight: 300, fontVariationSettings: "'opsz' 144", lineHeight: .9, color: 'var(--gold-soft)', letterSpacing: '-.02em', paddingTop: '10px', clipPath: 'inset(0 100% 0 0)', transition: 'clip-path 1.1s .4s var(--ease)' }}><RichText dot={false}>{card.text ?? ''}</RichText></div>
                    )}
                    <div style={{ borderTop: '1px solid var(--line-dark-2)', paddingTop: '20px' }}>
                      <div style={{ fontFamily: 'var(--serif)', fontSize: '17px', color: 'var(--text-light)', fontWeight: 400 }}>{card.title}</div>
                      <div style={{ fontFamily: 'var(--sans)', fontSize: '13px', color: 'var(--text-light-mute)', marginTop: '8px', lineHeight: 1.65 }}>{card.description}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ marginTop: '60px', borderLeft: '2px solid var(--gold-soft)', paddingLeft: '28px', opacity: 0, transform: 'translateX(-20px)', transition: 'opacity .9s var(--ease),transform .9s var(--ease)' }} className="wquote-block">
              <div className="warranty-quote" style={{ fontSize: 'clamp(16px,1.6vw,21px)', color: 'var(--text-light-mute)' }}>{warranty.quote}</div>
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
