/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useRef, useState } from "react";
import type { FormEvent } from "react";
import useScrollProgress from "../hooks/useScrollProgress";
import useReveal from "../hooks/useReveal";
import useMagnetic from "../hooks/useMagnetic";
import luxuryBathroomVanity from "../assets/images/standalone/luxury-bathroom-vanity.jpg";

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

  useScrollProgress(ref);
  useReveal(ref);
  useMagnetic(ref);

  const [form, setForm] = useState(INITIAL_FORM);
  const [sending, setSending] = useState(false);
  const [formMsg, setFormMsg] = useState("");

  const handleChange = (
    e: FormEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.currentTarget;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Request failed");
      setFormMsg("Thank you — we'll be in touch shortly.");
      setForm(INITIAL_FORM);
    } catch {
      setFormMsg("Something went wrong. Please try again or email us directly.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="iv-page" ref={ref}>
      <div className="scroll-progress" id="scrollProgress" />
      <main>{/* SUBHERO */}
        <section className="subhero" style={{ minHeight: '46vh' }}>
          <div className="subhero-img"><img src={luxuryBathroomVanity} alt="Contact IV" /></div>
          <div className="subhero-inner">
            <div className="crumbs"><a href="/">Home</a> / Contact</div>
            <div className="eyebrow reveal" style={{ color: 'var(--gold)' }}>Get in touch</div>
            <h1 className="reveal"><span style={{ color: 'var(--gold)' }}>Let's</span> <em>build</em><span className="orange-dot">.</span></h1>
            <p className="reveal">See the factory. Meet the team. Get a project‑specific proposal with a committed timeline and a fixed price.</p>
          </div>
        </section>

        {/* CONTACT */}
        <section className="section" style={{ background: 'var(--ink)', padding: '100px 56px 140px' }}>
          <div className="wrap contact-wrap">
            <div>
              <div className="eyebrow reveal" style={{ color: 'var(--gold)' }}>Reach us directly</div>
              <div className="contact-info-item reveal">
                <div className="lbl">Phone</div>
                <div className="val">+20 107 0009907</div>
              </div>
              <div className="contact-info-item reveal">
                <div className="lbl">Email</div>
                <div className="val">contact@ivfixed.com</div>
              </div>
              <div className="contact-info-item reveal">
                <div className="lbl">Address</div>
                <div className="val">Industrial area factory buildings 7 8 9 10 / Anabib Al Petrol Street Gesr Al Suez, Cairo</div>
              </div>
              <div className="contact-info-item reveal">
                <div className="lbl">Hours</div>
                <div className="val">Sun — Thu, 9:00 — 17:00 CAI</div>
              </div>
            </div>
            <div className="reveal">
              <form className="cform" id="contactForm" onSubmit={handleSubmit}>
                <div className="row2">
                  <div>
                    <label>Full name</label>
                    <input type="text" name="name" required value={form.name} onChange={handleChange} />
                  </div>
                  <div>
                    <label>Company</label>
                    <input type="text" name="company" value={form.company} onChange={handleChange} />
                  </div>
                </div>
                <div className="row2">
                  <div>
                    <label>Email</label>
                    <input type="email" name="email" required value={form.email} onChange={handleChange} />
                  </div>
                  <div>
                    <label>Phone</label>
                    <input type="tel" name="phone" value={form.phone} onChange={handleChange} />
                  </div>
                </div>
                <div>
                  <label>Interested in</label>
                  <select name="interest" value={form.interest} onChange={handleChange}>
                    <option value="Kitchens">Kitchens</option>
                    <option value="Dressing Rooms">Dressing Rooms</option>
                    <option value="Vanities">Vanities</option>
                    <option value="Multiple / Developer program">Multiple / Developer program</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label>Project details</label>
                  <textarea name="message" rows={4} placeholder="Unit count, timeline, location…" value={form.message} onChange={handleChange} />
                </div>
                <div className="submit-row">
                  <button type="submit" className="btn filled" data-cursor="link" data-magnetic="" disabled={sending}>{sending ? 'Sending…' : 'Send Message'} <i className="ti ti-arrow-up-right" /></button>
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
