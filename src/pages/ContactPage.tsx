/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useRef, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import useScrollProgress from "../hooks/useScrollProgress";
import useReveal from "../hooks/useReveal";
import useMagnetic from "../hooks/useMagnetic";
import { useContent } from "../content/ContentProvider";
import RichText from "../components/RichText";
import Honeypot from "../components/Honeypot";
import { THANK_YOU_ROUTE, THANK_YOU_STATE, useSubmitForm } from "../lib/submissions";

const INITIAL_FORM = {
  name: "",
  company: "",
  email: "",
  phone: "",
  interest: "Kitchens",
  message: "",
};


export default function ContactPage() {
  const ref = useRef<HTMLDivElement>(null);
  const { subhero, details, form: copy } = useContent().contact;

  useScrollProgress(ref);
  useReveal(ref);
  useMagnetic(ref);

  const [form, setForm] = useState(INITIAL_FORM);
  const [honeypot, setHoneypot] = useState("");
  // Only ever holds the failure text: a success leaves for /thank-you.
  const [formMsg, setFormMsg] = useState("");
  const { submit, state } = useSubmitForm();
  const navigate = useNavigate();
  const sending = state === "sending";

  const handleChange = (
    e: FormEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.currentTarget;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const ok = await submit({ kind: "contact", ...form }, honeypot);
    if (ok) {
      navigate(THANK_YOU_ROUTE, { state: THANK_YOU_STATE });
      return;
    }
    setFormMsg(copy.errorMessage);
  };

  return (
    <div className="iv-page" ref={ref}>
      <div className="scroll-progress" id="scrollProgress" />
      <main>{/* SUBHERO */}
        <section className="subhero" style={{ minHeight: '46vh' }}>
          <div className="subhero-img"><img src={subhero.image} alt={subhero.imageAlt} /></div>
          <div className="subhero-inner">
            <div className="crumbs"><a href="/">{subhero.crumbs.homeLabel}</a> / {subhero.crumbs.current}</div>
            <div className="eyebrow reveal" style={{ color: 'var(--gold)' }}>{subhero.eyebrow}</div>
            <h1 className="reveal"><RichText>{subhero.heading}</RichText></h1>
            <p className="reveal">{subhero.body}</p>
          </div>
        </section>

        {/* CONTACT */}
        <section className="section" style={{ background: 'var(--ink)', padding: '100px 56px 140px' }}>
          <div className="wrap contact-wrap">
            <div>
              <div className="eyebrow reveal" style={{ color: 'var(--gold)' }}>{details.eyebrow}</div>
              {details.items.map((item, idx) => (
                <div className="contact-info-item reveal" key={idx}>
                  <div className="lbl">{item.label}</div>
                  <div className="val">{item.value}</div>
                </div>
              ))}
            </div>
            <div className="reveal">
              <form className="cform" id="contactForm" onSubmit={handleSubmit}>
                <Honeypot value={honeypot} onChange={setHoneypot} />
                <div className="row2">
                  <div>
                    <label>{copy.nameLabel}</label>
                    <input type="text" name="name" required value={form.name} onChange={handleChange} />
                  </div>
                  <div>
                    <label>{copy.companyLabel}</label>
                    <input type="text" name="company" value={form.company} onChange={handleChange} />
                  </div>
                </div>
                <div className="row2">
                  <div>
                    <label>{copy.emailLabel}</label>
                    <input type="email" name="email" required value={form.email} onChange={handleChange} />
                  </div>
                  <div>
                    <label>{copy.phoneLabel}</label>
                    <input type="tel" name="phone" value={form.phone} onChange={handleChange} />
                  </div>
                </div>
                <div>
                  <label>{copy.interestLabel}</label>
                  <select name="interest" value={form.interest} onChange={handleChange}>
                    {copy.interestOptions.map((option) => (
                      <option value={option} key={option}>{option}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label>{copy.messageLabel}</label>
                  <textarea name="message" rows={4} placeholder={copy.messagePlaceholder} value={form.message} onChange={handleChange} />
                </div>
                <div className="submit-row">
                  <button type="submit" className="btn filled" data-cursor="link" data-magnetic="" disabled={sending}>{sending ? copy.sendingLabel : copy.submitLabel} <i className="ti ti-arrow-up-right" /></button>
                  <span className={formMsg ? 'form-msg show' : 'form-msg'} id="formMsg">{formMsg}</span>
                </div>
              </form>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
