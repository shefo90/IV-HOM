/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import type React from "react";
import { useNavigate } from "react-router-dom";
import { useContent } from "../content/ContentProvider";
import Honeypot from "./Honeypot";
import { THANK_YOU_ROUTE, THANK_YOU_STATE, useSubmitForm } from "../lib/submissions";

const EMPTY = {
  fullName: "",
  company: "",
  email: "",
  phone: "",
  projectDetails: "",
};

export default function ContactFormSection() {
  const { contactForm } = useContent().site;

  const [formData, setFormData] = useState({
    ...EMPTY,
    interestedIn: contactForm.interestedInOptions[0],
  });
  const [honeypot, setHoneypot] = useState("");
  const { submit, state } = useSubmitForm();
  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Sent under the same field names as the contact page's own form, so both
    // land in the inbox as one `contact` shape rather than two variants.
    const ok = await submit(
      {
        kind: "contact",
        name: formData.fullName,
        company: formData.company,
        email: formData.email,
        phone: formData.phone,
        interest: formData.interestedIn,
        message: formData.projectDetails,
      },
      honeypot,
    );

    // The confirmation is a route of its own now, so there is nothing left on
    // this page to clear. A failure stays put and shows the error inline —
    // sending someone to a thank-you page for a message that never arrived
    // would be a lie.
    if (ok) {
      navigate(THANK_YOU_ROUTE, { state: THANK_YOU_STATE });
    }
  };

  return (
    <section
      id="contact"
      className="relative bg-brand-dark py-8 px-6 md:px-12 lg:px-24"
    >
      <div className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-8">
          <Honeypot value={honeypot} onChange={setHoneypot} />
          {/* Full Name & Company */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="fullName"
                className="block text-center md:text-left text-brand-accent text-xs uppercase tracking-widest mb-3"
              >
                {contactForm.fullNameLabel}
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full bg-transparent border-b border-brand-border-dark text-brand-light font-mono text-sm py-2 focus:border-brand-accent transition-colors"
                required
              />
            </div>
            <div>
              <label
                htmlFor="company"
                className="block text-center md:text-left text-brand-accent text-xs uppercase tracking-widest mb-3"
              >
                {contactForm.companyLabel}
              </label>
              <input
                type="text"
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                className="w-full bg-transparent border-b border-brand-border-dark text-brand-light font-mono text-sm py-2 focus:border-brand-accent transition-colors"
              />
            </div>
          </div>

          {/* Email & Phone */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="email"
                className="block text-center md:text-left text-brand-accent text-xs uppercase tracking-widest mb-3"
              >
                {contactForm.emailLabel}
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-transparent border-b border-brand-border-dark text-brand-light font-mono text-sm py-2 focus:border-brand-accent transition-colors"
                required
              />
            </div>
            <div>
              <label
                htmlFor="phone"
                className="block text-center md:text-left text-brand-accent text-xs uppercase tracking-widest mb-3"
              >
                {contactForm.phoneLabel}
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full bg-transparent border-b border-brand-border-dark text-brand-light font-mono text-sm py-2 focus:border-brand-accent transition-colors"
              />
            </div>
          </div>

          {/* Interested In */}
          <div>
            <label
              htmlFor="interestedIn"
              className="block text-center md:text-left text-brand-accent text-xs uppercase tracking-widest mb-3"
            >
              {contactForm.interestedInLabel}
            </label>
            <select
              id="interestedIn"
              name="interestedIn"
              value={formData.interestedIn}
              onChange={handleChange}
              className="w-full bg-transparent border-b border-brand-border-dark text-brand-light font-mono text-sm py-2 focus:border-brand-accent transition-colors appearance-none cursor-pointer"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L6 6L11 1' stroke='%23D46B43' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 0.5rem center',
              }}
            >
              {contactForm.interestedInOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          {/* Project Details */}
          <div>
            <label
              htmlFor="projectDetails"
              className="block text-center md:text-left text-brand-accent text-xs uppercase tracking-widest mb-3"
            >
              {contactForm.projectDetailsLabel}
            </label>
            <textarea
              id="projectDetails"
              name="projectDetails"
              value={formData.projectDetails}
              onChange={handleChange}
              placeholder={contactForm.projectDetailsPlaceholder}
              rows={4}
              className="w-full bg-transparent border-b border-brand-border-dark text-brand-light font-mono text-sm py-2 placeholder:text-brand-border-dark focus:border-brand-accent transition-colors resize-none"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-4 text-center">
            <button
              type="submit"
              disabled={state === "sending"}
              className="bg-brand-accent hover:bg-brand-accent-hover text-brand-dark font-mono text-xs uppercase tracking-widest px-8 py-4 transition-colors duration-300 disabled:opacity-50"
            >
              {state === "sending" ? contactForm.sendingLabel : contactForm.submitLabel}
            </button>

            {state === "error" && (
              // The API being down must not look like a hung spinner; the
              // message carries an address the visitor can fall back to.
              <p className="mt-4 font-mono text-[11px] tracking-wider text-red-400">
                {contactForm.errorMessage}
              </p>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}
