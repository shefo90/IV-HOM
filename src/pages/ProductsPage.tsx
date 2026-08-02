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

export default function ProductsPage() {
  const ref = useRef<HTMLDivElement>(null);
  const { subhero, categories, details, materials, cta } = useContent().products;

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
            {/* Empty orange-dot between the halves: no glyph, but its inline
                box sets the line height. See SplitHeadingSubhero. */}
            <h1 className="reveal"><RichText>{subhero.headingLead}</RichText><span className="orange-dot"></span> <RichText>{subhero.headingRest}</RichText></h1>
            <p className="reveal">{subhero.body}</p>
          </div>
        </section>

        {/* CATEGORIES */}
        <section className="section products">
          <div className="wrap">
            <div className="prod-grid reveal-stagger">
              {categories.map((category, idx) => (
                <Link to={category.to} className="prod-card" data-cursor="drag" key={idx}>
                  <div className="prod-img"><img src={category.image} alt={category.imageAlt} /></div>
                  <div className="arrow"><i className="ti ti-arrow-up-right" /></div>
                  <div className="body">
                    <div className="idx">{category.index}</div>
                    <h3>{category.title}</h3>
                    <div className="meta"><span>{category.metaLeft}</span><span>{category.metaRight}</span></div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CATEGORY DETAIL */}
        <section className="section about" style={{ paddingTop: 0 }}>
          <div className="wrap" style={{ display: 'flex', flexDirection: 'column', gap: '70px' }}>
            {details.map((detail, idx) => (
              <div className="split-block" key={idx}>
                <div>
                  <div className="eyebrow reveal">{detail.eyebrow}</div>
                  <h2 className="reveal" style={{ fontSize: 'clamp(30px,3.2vw,44px)', margin: '18px 0 20px', fontWeight: 300, fontVariationSettings: "'opsz' 144" }}>{detail.title}</h2>
                  <p className="lede reveal">{detail.lede}</p>
                </div>
                <div className="about-img-wrap reveal" data-tilt="" style={{ aspectRatio: '16/10' }}>
                  <div className="about-img-frame"></div>
                  <div className="about-img"><img src={detail.image} alt={detail.imageAlt} /></div>
                  <div className="about-img-tag">{detail.tag}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* MATERIALS */}
        <section className="section tech">
          <div className="wrap">
            <div className="tech-head">
              <div>
                <div className="eyebrow reveal">{materials.eyebrow}</div>
                <h2 className="reveal"><RichText>{materials.heading}</RichText></h2>
              </div>
              <p className="reveal">{materials.intro}</p>
            </div>
            <div className="mat-strip reveal-stagger" style={{ marginTop: 0 }}>
              {materials.items.map((item, idx) => (
                <div key={idx}><b>{item.code}</b>{item.name}</div>
              ))}
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
