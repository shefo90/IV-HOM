/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useRef } from "react";
import { Link } from "react-router-dom";
import useScrollProgress from "../hooks/useScrollProgress";
import useReveal from "../hooks/useReveal";
import useMagnetic from "../hooks/useMagnetic";
import { useContent } from "../content/ContentProvider";
import RichText from "../components/RichText";
import type { ProjectCase } from "../content/types";

interface ProjectCaseCardProps {
  project: ProjectCase;
  tall?: boolean;
}

function ProjectCaseCard({ project, tall }: ProjectCaseCardProps) {
  return (
    <div className={tall ? "proj-card tall" : "proj-card"} data-cursor="drag">
      <div className="pimg"><img src={project.image} alt={project.imageAlt} /></div>
      <div className="proj-corner">{project.corner}</div>
      <div className="proj-info">
        <div className="tag">{project.tag}</div>
        <h3>{project.title}</h3>
        <p>{project.description}</p>
      </div>
    </div>
  );
}

export default function ProjectsPage() {
  const ref = useRef<HTMLDivElement>(null);
  const { subhero, stats, featured, secondary, cta } = useContent().projects;

  useScrollProgress(ref);
  useReveal(ref);
  useMagnetic(ref);

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

        {/* PROJECTS */}
        <section className="section projects">
          <div className="wrap">
            <div className="proj-bar reveal-stagger">
              {stats.map((stat, idx) => (
                <div key={idx}><span className="pval">{stat.value}</span><span className="plabel">{stat.label}</span></div>
              ))}
            </div>
            <div className="proj-grid reveal">
              <ProjectCaseCard project={featured} tall />
              <div className="proj-side">
                {secondary.map((project, idx) => (
                  <ProjectCaseCard project={project} key={idx} />
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
