/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent } from "react";
import { X, Send, Calendar, Check, Info } from "lucide-react";

interface ProposalModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialType?: "proposal" | "tour";
}

export default function ProposalModal({ isOpen, onClose, initialType = "proposal" }: ProposalModalProps) {
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
    tourTime: "11:00",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

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

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API request
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1500);
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
                REQUEST PROPOSAL
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
                SCHEDULE FACTORY TOUR
                {formType === "tour" && (
                  <span className="absolute bottom-[-17px] left-0 w-full h-[2px] bg-brand-accent" />
                )}
              </button>
            </div>

            <h3 className="font-serif text-2xl md:text-3xl text-brand-light mb-2 tracking-tight">
              {formType === "proposal" ? "Get a tailored digital-first proposal." : "See the robotic factory floor in Cairo."}
            </h3>
            <p className="font-sans text-xs text-gray-400 mb-8 max-w-md">
              {formType === "proposal"
                ? "Send us your project specifications or floor plans. Our engineering algorithm outputs a transparent, line-item price locked for 6 months."
                : "Walk the shop floor, experience the CNC precision systems, and meet the design-engineering division. Scheduled by appointments only."}
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-mono text-[9px] tracking-widest text-brand-accent uppercase mb-2">
                    FULL NAME *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-brand-dark/50 border border-brand-border-dark text-brand-light px-4 py-2.5 text-xs font-sans focus:border-brand-accent transition-colors"
                    placeholder="e.g. John Doe"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[9px] tracking-widest text-brand-accent uppercase mb-2">
                    EMAIL ADDRESS *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-brand-dark/50 border border-brand-border-dark text-brand-light px-4 py-2.5 text-xs font-sans focus:border-brand-accent transition-colors"
                    placeholder="name@company.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-mono text-[9px] tracking-widest text-brand-accent uppercase mb-2">
                    PHONE / WHATSAPP *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-brand-dark/50 border border-brand-border-dark text-brand-light px-4 py-2.5 text-xs font-sans focus:border-brand-accent transition-colors"
                    placeholder="+20 1xx xxxx xxx"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[9px] tracking-widest text-brand-accent uppercase mb-2">
                    PROJECT CATEGORY
                  </label>
                  <select
                    value={formData.projectType}
                    onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                    className="w-full bg-brand-dark border border-brand-border-dark text-brand-light px-4 py-2.5 text-xs font-sans focus:border-brand-accent transition-colors"
                  >
                    <option value="Kitchens">Kitchens (Signature 01)</option>
                    <option value="Dressing Rooms">Dressing Rooms (Signature 02)</option>
                    <option value="Vanities">Vanities (Signature 03)</option>
                    <option value="Complete Villa">Complete Villa Furnishing</option>
                  </select>
                </div>
              </div>

              {/* Form specific fields */}
              {formType === "proposal" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-mono text-[9px] tracking-widest text-brand-accent uppercase mb-2 flex justify-between">
                      <span>APPROXIMATE SIZE (SQM OR LM)</span>
                      <span className="text-gray-500 font-sans normal-case">{formData.size} sqm</span>
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
                  <div>
                    <label className="block font-mono text-[9px] tracking-widest text-brand-accent uppercase mb-2">
                      TIMEFRAME
                    </label>
                    <select
                      value={formData.timeframe}
                      onChange={(e) => setFormData({ ...formData, timeframe: e.target.value })}
                      className="w-full bg-brand-dark border border-brand-border-dark text-brand-light px-4 py-2.5 text-xs font-sans focus:border-brand-accent transition-colors"
                    >
                      <option value="Immediate">Immediate (&lt; 1 month)</option>
                      <option value="1-3 months">1 - 3 Months</option>
                      <option value="3-6 months">3 - 6 Months</option>
                      <option value="6+ months">6+ Months / Planning</option>
                    </select>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-mono text-[9px] tracking-widest text-brand-accent uppercase mb-2">
                      PREFERRED DATE
                    </label>
                    <input
                      type="date"
                      required={formType === "tour"}
                      value={formData.tourDate}
                      onChange={(e) => setFormData({ ...formData, tourDate: e.target.value })}
                      className="w-full bg-brand-dark border border-brand-border-dark text-brand-light px-4 py-2.5 text-xs font-sans focus:border-brand-accent transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[9px] tracking-widest text-brand-accent uppercase mb-2">
                      TIME SLOT
                    </label>
                    <select
                      value={formData.tourTime}
                      onChange={(e) => setFormData({ ...formData, tourTime: e.target.value })}
                      className="w-full bg-brand-dark border border-brand-border-dark text-brand-light px-4 py-2.5 text-xs font-sans focus:border-brand-accent transition-colors"
                    >
                      <option value="10:00">10:00 AM (Morning Batch)</option>
                      <option value="11:30">11:30 AM (Production Slot)</option>
                      <option value="13:30">01:30 PM (Midday Run)</option>
                      <option value="15:00">03:00 PM (Final Handover)</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Text Area */}
              <div>
                <label className="block font-mono text-[9px] tracking-widest text-brand-accent uppercase mb-2">
                  ADDITIONAL INSTRUCTIONS / FLOOR PLAN ACCESS LINKS
                </label>
                <textarea
                  value={formData.details}
                  onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                  rows={3}
                  className="w-full bg-brand-dark/50 border border-brand-border-dark text-brand-light px-4 py-2.5 text-xs font-sans focus:border-brand-accent transition-colors resize-none"
                  placeholder="Share details about design preferences, site constraints, or link to Google Drive folders with CAD drawings."
                />
              </div>

              {/* Live Interactive Balances */}
              {formType === "proposal" && (
                <div className="bg-brand-card-dark/40 border border-brand-accent/10 p-4 flex gap-4 items-start">
                  <Info className="text-brand-accent mt-0.5 shrink-0" size={14} />
                  <div>
                    <p className="font-sans text-[10px] text-gray-500 uppercase tracking-widest">
                      PRELIMINARY FABRICATION INDEX
                    </p>
                    <p className="font-serif text-lg text-brand-light mt-1">
                      Est. range: <span className="text-brand-accent">${calculateEstimate()} USD</span>
                    </p>
                    <p className="font-sans text-[9px] text-gray-500 mt-1 leading-normal">
                      Includes 7-stage quality checks, 0.5mm precision cutting, Austrian premium Blum slides, and structural marine plywood core framing.
                    </p>
                  </div>
                </div>
              )}

              {/* Submit Buttons */}
              <div className="pt-4 flex justify-end gap-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="font-sans text-[10px] tracking-[0.2em] px-6 py-3 border border-brand-border-dark text-gray-400 hover:text-brand-light transition-colors"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="font-sans text-[10px] tracking-[0.2em] px-8 py-3 bg-brand-accent hover:bg-brand-accent-hover text-brand-dark font-bold transition-all duration-300 flex items-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-3 h-3 border-2 border-brand-dark border-t-transparent rounded-full animate-spin" />
                      CALCULATING...
                    </>
                  ) : formType === "proposal" ? (
                    <>
                      <Send size={11} />
                      SUBMIT BRIEF
                    </>
                  ) : (
                    <>
                      <Calendar size={11} />
                      REQUEST PASS
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
              {formType === "proposal" ? "Project brief registered successfully." : "Tour request received."}
            </h3>
            <p className="font-sans text-xs text-gray-400 max-w-md mx-auto leading-relaxed mb-8">
              {formType === "proposal"
                ? `An email confirmation and CAD blueprint link have been dispatched. Our chief engineering officer is assembling a full manufacturing breakdown for your ${formData.projectType.toLowerCase()} specifications.`
                : `Your visitor pass request for Cairo Workshop on ${formData.tourDate || "selected date"} at ${formData.tourTime} has been submitted. A coordination representative will call you inside 2 hours to confirm security clearance.`}
            </p>
            <button
              onClick={() => {
                setIsSuccess(false);
                onClose();
              }}
              className="font-sans text-[10px] tracking-[0.2em] px-8 py-3 bg-brand-accent text-brand-dark font-bold hover:bg-brand-accent-hover transition-colors"
            >
              RETURN TO WORKSPACE
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
