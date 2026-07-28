/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";

export default function ContactFormSection() {
  const [formData, setFormData] = useState({
    fullName: "",
    company: "",
    email: "",
    phone: "",
    interestedIn: "Kitchens",
    projectDetails: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Add your form submission logic here
  };

  return (
    <section
      id="contact"
      className="relative bg-brand-dark py-8 px-6 md:px-12 lg:px-24"
    >
      <div className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Full Name & Company */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="fullName"
                className="block text-center md:text-left text-brand-accent text-xs uppercase tracking-widest mb-3"
              >
                FULL NAME
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
                COMPANY
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
                EMAIL
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
                PHONE
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
              INTERESTED IN
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
              <option value="Kitchens">Kitchens</option>
              <option value="Wardrobes">Wardrobes</option>
              <option value="Vanities">Vanities</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Project Details */}
          <div>
            <label
              htmlFor="projectDetails"
              className="block text-center md:text-left text-brand-accent text-xs uppercase tracking-widest mb-3"
            >
              PROJECT DETAILS
            </label>
            <textarea
              id="projectDetails"
              name="projectDetails"
              value={formData.projectDetails}
              onChange={handleChange}
              placeholder="Unit count, timeline, location..."
              rows={4}
              className="w-full bg-transparent border-b border-brand-border-dark text-brand-light font-mono text-sm py-2 placeholder:text-brand-border-dark focus:border-brand-accent transition-colors resize-none"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-4 text-center">
            <button
              type="submit"
              className="bg-brand-accent hover:bg-brand-accent-hover text-brand-dark font-mono text-xs uppercase tracking-widest px-8 py-4 transition-colors duration-300"
            >
              SEND MESSAGE
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
