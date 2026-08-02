/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent } from "react";
import { X, Send, Calendar, Check, Info } from "lucide-react";
import { useContent } from "../content/ContentProvider";
import Honeypot from "./Honeypot";
import { useSubmitForm } from "../lib/submissions";

interface ProposalModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialType?: "proposal" | "tour";
}

/** Substitutes {name} placeholders in an editable string. */
function fill(template: string, values: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (_match, key) => values[key] ?? "");
}

export default function ProposalModal({ isOpen, onClose, initialType = "proposal" }: ProposalModalProps) {
  const copy = useContent().site.proposalModal;
  const [formType, setFormType] = useState<"proposal" | "tour">(initialType);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    projectType: "Kitchens",
    size: "30",
    timeframe: "3-6 months",
    details: "",
    tourDate: "",
    // NOTE: "11:00" is not one of the four tourTimeOptions, so this select
    // opens with no option selected while the value stays 11:00. Pre-existing;
    // preserved here rather than silently changed.
    tourTime: "11:00",
  });
  const [honeypot, setHoneypot] = useState("");
  const { submit, state, reset } = useSubmitForm();
  const isSubmitting = state === "sending";
  const isSuccess = state === "sent";

  if (!isOpen) return null;

  // Calculate high-end ballpark investment estimate just for dynamic interaction
  const calculateEstimate = () => {
    const sizeNum = parseFloat(formData.size) || 20;
    let baseRate = 2800; // USD per sqm of high-end CNC finished carpentry
    if (formData.projectType === "Dressing Rooms") baseRate = 3200;
    if (formData.projectType === "Vanities") baseRate = 1800;
    if (formData.projectType === "Complete Villa") baseRate = 4200;
    
    return (sizeNum * baseRate).toLocaleString();
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const shared = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      project_type: formData.projectType,
      details: formData.details,
    };

    await submit(
      formType === "proposal"
        ? {
            kind: "proposal",
            ...shared,
            size: formData.size,
            timeframe: formData.timeframe,
          }
        : {
            kind: "tour",
            ...shared,
            tour_date: formData.tourDate,
            tour_time: formData.tourTime,
          },
      honeypot,
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-brand-dark/85 backdrop-blur-md" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative w-full max-w-2xl bg-brand-dark border border-brand-accent/30 p-6 md:p-10 shadow-2xl rounded-sm z-10 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-brand-accent transition-colors p-1 border border-brand-border-dark"
        >
          <X size={16} />
        </button>

        {!isSuccess ? (
          <div>
            {/* Header Tabs */}
            <div className="flex gap-4 border-b border-brand-border-dark pb-4 mb-8">
              <button
                type="button"
                onClick={() => setFormType("proposal")}
                className={`font-sans text-[11px] tracking-[0.2em] font-medium pb-2 relative transition-colors ${
                  formType === "proposal" ? "text-brand-accent" : "text-gray-400 hover:text-brand-light"
                }`}
              >
                {copy.proposalTab}
                {formType === "proposal" && (
                  <span className="absolute bottom-[-17px] left-0 w-full h-[2px] bg-brand-accent" />
                )}
              </button>
              <button
                type="button"
                onClick={() => setFormType("tour")}
                className={`font-sans text-[11px] tracking-[0.2em] font-medium pb-2 relative transition-colors ${
                  formType === "tour" ? "text-brand-accent" : "text-gray-400 hover:text-brand-light"
                }`}
              >
                {copy.tourTab}
                {formType === "tour" && (
                  <span className="absolute bottom-[-17px] left-0 w-full h-[2px] bg-brand-accent" />
                )}
              </button>
            </div>

            <h3 className="font-serif text-2xl md:text-3xl text-brand-light mb-2 tracking-tight text-center md:text-left">
              {formType === "proposal" ? copy.proposalHeading : copy.tourHeading}
            </h3>
            <p className="font-sans text-xs text-gray-400 mb-8 max-w-md text-center md:text-left mx-auto md:mx-0">
              {formType === "proposal" ? copy.proposalIntro : copy.tourIntro}
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <Honeypot value={honeypot} onChange={setHoneypot} />
              {/* Basic Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="px-8 md:px-0">
                  <label className="flex justify-center md:justify-start font-mono text-[9px] tracking-widest text-brand-accent uppercase mb-2">
                    {copy.nameLabel}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-brand-dark/50 border border-brand-border-dark text-brand-light px-4 py-2.5 text-xs font-sans focus:border-brand-accent transition-colors"
                    placeholder={copy.namePlaceholder}
                  />
                </div>
                <div className="px-8 md:px-0">
                  <label className="flex justify-center md:justify-start font-mono text-[9px] tracking-widest text-brand-accent uppercase mb-2">
                    {copy.emailLabel}
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-brand-dark/50 border border-brand-border-dark text-brand-light px-4 py-2.5 text-xs font-sans focus:border-brand-accent transition-colors"
                    placeholder={copy.emailPlaceholder}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="px-8 md:px-0">
                  <label className="flex justify-center md:justify-start font-mono text-[9px] tracking-widest text-brand-accent uppercase mb-2">
                    {copy.phoneLabel}
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-brand-dark/50 border border-brand-border-dark text-brand-light px-4 py-2.5 text-xs font-sans focus:border-brand-accent transition-colors"
                    placeholder={copy.phonePlaceholder}
                  />
                </div>
                <div className="px-8 md:px-0">
                  <label className="flex justify-center md:justify-start font-mono text-[9px] tracking-widest text-brand-accent uppercase mb-2">
                    {copy.categoryLabel}
                  </label>
                  <select
                    value={formData.projectType}
                    onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                    className="w-full bg-brand-dark border border-brand-border-dark text-brand-light px-4 py-2.5 text-xs font-sans focus:border-brand-accent transition-colors"
                  >
                    {copy.categoryOptions.map((option) => (
                      <option value={option.value} key={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Form specific fields */}
              {formType === "proposal" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="px-8 md:px-0">
                    <label className="flex justify-center md:justify-between font-mono text-[9px] tracking-widest text-brand-accent uppercase mb-2">
                      <span>{copy.sizeLabel}</span>
                      <span className="text-gray-500 font-sans normal-case hidden md:inline">{formData.size} {copy.sizeSuffix}</span>
                    </label>
                    <input
                      type="range"
                      min="5"
                      max="200"
                      step="5"
                      value={formData.size}
                      onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                      className="w-full accent-brand-accent cursor-pointer"
                    />
                  </div>
                  <div className="px-8 md:px-0">
                    <label className="flex justify-center md:justify-start font-mono text-[9px] tracking-widest text-brand-accent uppercase mb-2">
                      {copy.timeframeLabel}
                    </label>
                    <select
                      value={formData.timeframe}
                      onChange={(e) => setFormData({ ...formData, timeframe: e.target.value })}
                      className="w-full bg-brand-dark border border-brand-border-dark text-brand-light px-4 py-2.5 text-xs font-sans focus:border-brand-accent transition-colors"
                    >
                      {copy.timeframeOptions.map((option) => (
                        <option value={option.value} key={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="px-8 md:px-0">
                    <label className="flex justify-center md:justify-start font-mono text-[9px] tracking-widest text-brand-accent uppercase mb-2">
                      {copy.tourDateLabel}
                    </label>
                    <input
                      type="date"
                      required={formType === "tour"}
                      value={formData.tourDate}
                      onChange={(e) => setFormData({ ...formData, tourDate: e.target.value })}
                      className="w-full bg-brand-dark border border-brand-border-dark text-brand-light px-4 py-2.5 text-xs font-sans focus:border-brand-accent transition-colors"
                    />
                  </div>
                  <div className="px-8 md:px-0">
                    <label className="flex justify-center md:justify-start font-mono text-[9px] tracking-widest text-brand-accent uppercase mb-2">
                      {copy.tourTimeLabel}
                    </label>
                    <select
                      value={formData.tourTime}
                      onChange={(e) => setFormData({ ...formData, tourTime: e.target.value })}
                      className="w-full bg-brand-dark border border-brand-border-dark text-brand-light px-4 py-2.5 text-xs font-sans focus:border-brand-accent transition-colors"
                    >
                      {copy.tourTimeOptions.map((option) => (
                        <option value={option.value} key={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* Text Area */}
              <div className="px-8 md:px-0">
                <label className="flex justify-center md:justify-start font-mono text-[9px] tracking-widest text-brand-accent uppercase mb-2">
                  {copy.detailsLabel}
                </label>
                <textarea
                  value={formData.details}
                  onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                  rows={3}
                  className="w-full bg-brand-dark/50 border border-brand-border-dark text-brand-light px-4 py-2.5 text-xs font-sans focus:border-brand-accent transition-colors resize-none"
                  placeholder={copy.detailsPlaceholder}
                />
              </div>

              {/* Live Interactive Balances */}
              {formType === "proposal" && (
                <div className="bg-brand-card-dark/40 border border-brand-accent/10 p-4 flex gap-4 items-start">
                  <Info className="text-brand-accent mt-0.5 shrink-0" size={14} />
                  <div>
                    <p className="font-sans text-[10px] text-gray-500 uppercase tracking-widest">
                      {copy.estimateHeading}
                    </p>
                    <p className="font-serif text-lg text-brand-light mt-1">
                      {copy.estimatePrefix} <span className="text-brand-accent">${calculateEstimate()} USD</span>
                    </p>
                    <p className="font-sans text-[9px] text-gray-500 mt-1 leading-normal">
                      {copy.estimateNote}
                    </p>
                  </div>
                </div>
              )}

              {state === "error" && (
                // Without this the visitor sees the spinner stop and nothing
                // else, and assumes the brief was sent when it was not.
                <p className="font-sans text-[11px] text-red-400 text-center md:text-left">
                  {copy.errorMessage}
                </p>
              )}

              {/* Submit Buttons */}
              <div className="pt-4 flex justify-end gap-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="font-sans text-[10px] tracking-[0.2em] px-6 py-3 border border-brand-border-dark text-gray-400 hover:text-brand-light transition-colors"
                >
                  {copy.cancelLabel}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="font-sans text-[10px] tracking-[0.2em] px-8 py-3 bg-brand-accent hover:bg-brand-accent-hover text-brand-dark font-bold transition-all duration-300 flex items-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-3 h-3 border-2 border-brand-dark border-t-transparent rounded-full animate-spin" />
                      {copy.submittingLabel}
                    </>
                  ) : formType === "proposal" ? (
                    <>
                      <Send size={11} />
                      {copy.submitProposalLabel}
                    </>
                  ) : (
                    <>
                      <Calendar size={11} />
                      {copy.submitTourLabel}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="py-12 text-center">
            <div className="w-16 h-16 rounded-full border border-brand-accent flex items-center justify-center mx-auto mb-6">
              <Check className="text-brand-accent" size={32} />
            </div>
            <h3 className="font-serif text-3xl text-brand-light mb-4 tracking-tight">
              {formType === "proposal" ? copy.proposalSuccessHeading : copy.tourSuccessHeading}
            </h3>
            <p className="font-sans text-xs text-gray-400 max-w-md mx-auto leading-relaxed mb-8">
              {formType === "proposal"
                ? fill(copy.proposalSuccessBody, { category: formData.projectType.toLowerCase() })
                : fill(copy.tourSuccessBody, {
                    date: formData.tourDate || copy.tourDateFallback,
                    time: formData.tourTime,
                  })}
            </p>
            <button
              onClick={() => {
                reset();
                onClose();
              }}
              className="font-sans text-[10px] tracking-[0.2em] px-8 py-3 bg-brand-accent text-brand-dark font-bold hover:bg-brand-accent-hover transition-colors"
            >
              {copy.dismissLabel}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
