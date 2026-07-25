/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { choreographyStages } from "../data";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2, Sparkles, Zap } from "lucide-react";

export default function ChoreographySection() {
  const [activeStage, setActiveStage] = useState(3); // Default to Stage 04 (index 3)

  return (
    <section className="relative bg-gradient-to-br from-[#faf8f5] via-[#f5f1ed] to-[#ede7e0] text-brand-dark py-20 md:py-32 px-6 md:px-12 border-b border-brand-accent/20 overflow-hidden">
      {/* Enhanced decorative background elements with animation */}
      <motion.div 
        className="absolute top-0 left-0 w-[500px] h-[500px] bg-gradient-to-br from-brand-accent/10 to-transparent rounded-full blur-3xl"
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div 
        className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-gradient-to-tl from-brand-accent/10 to-transparent rounded-full blur-3xl"
        animate={{ 
          scale: [1.2, 1, 1.2],
          opacity: [0.5, 0.3, 0.5],
        }}
        transition={{ duration: 10, repeat: Infinity }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(212,107,67,0.03),transparent_50%)]" />
      
      {/* Animated grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(212,107,67,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(212,107,67,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
      
      <div className="max-w-7xl mx-auto space-y-20 relative z-10">
        {/* Top Header Split Row with enhanced animations */}
        <div className="flex flex-col md:flex-row gap-8 justify-between items-start md:items-end">
          <motion.div 
            className="space-y-6 max-w-xl"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-3">
              <motion.span 
                className="h-[2px] w-12 bg-gradient-to-r from-brand-accent to-brand-accent/50"
                initial={{ width: 0 }}
                whileInView={{ width: 48 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.6 }}
              />
              <span className="font-mono text-[10px] tracking-[0.28em] text-brand-accent font-bold uppercase flex items-center gap-2">
                <Sparkles size={12} className="animate-pulse" />
                04 • PRODUCTION CHOREOGRAPHY
              </span>
            </div>
            <h2 className="font-serif text-4xl sm:text-5xl md:text-[62px] leading-[0.95] text-brand-dark tracking-tight">
              Seven stages.{" "}
              <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-brand-accent via-[#d97b53] to-brand-accent font-normal animate-gradient bg-[length:200%_auto]">
                Every checkpoint has a signature.
              </span>
            </h2>
          </motion.div>

          <motion.p 
            className="font-sans text-[14px] text-gray-600 leading-relaxed max-w-md md:pb-2 relative"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="absolute -left-4 top-0 text-4xl text-brand-accent/20 font-serif">"</span>
            Each stage is owned. Each hand-off is documented. The line between digital file and
            finished cabinet is unbroken — from measurement to installation.
            <span className="absolute -right-2 bottom-0 text-4xl text-brand-accent/20 font-serif">"</span>
          </motion.p>
        </div>

        {/* Timeline Component: Ultra-Premium Interactive Experience */}
        <motion.div 
          className="pt-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {/* Timeline — desktop */}
          <div className="relative hidden lg:block">
            {/* Background track */}
            <div className="absolute top-[9px] left-[calc(100%/14)] right-[calc(100%/14)] h-[1px] bg-gray-300" />

            {/* Animated progress line */}
            <motion.div
              className="absolute top-[9px] left-[calc(100%/14)] h-[1px] origin-left"
              style={{ background: "#d46b43", right: "calc(100%/14)" }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: activeStage / (choreographyStages.length - 1) }}
              transition={{ duration: 0.7, ease: "easeInOut" }}
            />

            {/* Dots row */}
            <div className="grid grid-cols-7">
              {choreographyStages.map((stage, idx) => {
                const isActive = idx === activeStage;
                const isPassed = idx < activeStage;
                const isRevealed = idx <= activeStage;

                return (
                  <button
                    key={stage.id}
                    onClick={() => setActiveStage(idx)}
                    className="flex flex-col items-center group focus:outline-none"
                  >
                    {/* Dot */}
                    <div className="relative flex items-center justify-center">
                      {/* Glow blob behind active */}
                      {isActive && (
                        <motion.div
                          className="absolute w-12 h-12 rounded-full bg-brand-accent/25 blur-xl"
                          animate={{ scale: [0.8, 1.3, 0.8], opacity: [0.3, 0.6, 0.3] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      )}

                      <motion.div
                        className={`relative w-6 h-6 rounded-full flex items-center justify-center shadow-md ${
                          isActive
                            ? "bg-gradient-to-br from-brand-accent via-[#d97b53] to-brand-accent shadow-brand-accent/60"
                            : isPassed
                            ? "bg-gradient-to-br from-brand-accent to-[#c55a3a] shadow-brand-accent/40"
                            : "bg-gradient-to-br from-white to-gray-100 shadow-gray-300 group-hover:from-brand-accent/20 group-hover:to-brand-accent/10"
                        }`}
                        whileHover={{ scale: 1.25 }}
                        whileTap={{ scale: 0.9 }}
                        animate={isActive ? {
                          scale: [1, 1.15, 1],
                          boxShadow: [
                            "0 4px 20px rgba(212,107,67,0.4)",
                            "0 8px 30px rgba(212,107,67,0.7)",
                            "0 4px 20px rgba(212,107,67,0.4)",
                          ],
                        } : {}}
                        transition={{ duration: 2, repeat: isActive ? Infinity : 0 }}
                      >
                        {/* Pulsing rings on active */}
                        {isActive && (
                          <>
                            <motion.div
                              className="absolute inset-0 rounded-full border-2 border-brand-accent/60"
                              animate={{ scale: [1, 2.2, 1], opacity: [0.6, 0, 0.6] }}
                              transition={{ duration: 2, repeat: Infinity }}
                            />
                            <motion.div
                              className="absolute inset-0 rounded-full border-2 border-brand-accent/40"
                              animate={{ scale: [1, 2.8, 1], opacity: [0.4, 0, 0.4] }}
                              transition={{ duration: 2, repeat: Infinity, delay: 0.35 }}
                            />
                          </>
                        )}

                        {/* Checkmark for passed */}
                        {isPassed && !isActive && (
                          <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: "spring", stiffness: 220 }}
                          >
                            <CheckCircle2 size={14} className="text-white drop-shadow" strokeWidth={3} />
                          </motion.div>
                        )}

                        {/* Inner dot for active */}
                        {isActive && (
                          <motion.div
                            className="w-2.5 h-2.5 bg-white rounded-full shadow-inner"
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          />
                        )}

                        {/* Inactive dot */}
                        {!isPassed && !isActive && (
                          <div className="w-2 h-2 bg-gray-300 rounded-full" />
                        )}
                      </motion.div>
                    </div>

                    {/* Text below — always occupies space, animates in when reached */}
                    <div className="mt-5 text-left w-full px-1 min-h-[90px]">
                      <motion.div
                        initial={false}
                        animate={isRevealed
                          ? { opacity: 1, y: 0 }
                          : { opacity: 0, y: 10 }
                        }
                        transition={{ duration: 0.45, ease: "easeOut", delay: isActive ? 0.1 : 0 }}
                      >
                        <span className={`font-mono text-[9px] tracking-[0.2em] uppercase block mb-1.5 ${
                          isActive ? "text-brand-accent" : "text-brand-accent/70"
                        }`}>
                          {stage.stageNumber}
                        </span>
                        <span className={`font-serif text-[13px] leading-snug block font-medium ${
                          isActive ? "text-brand-dark" : "text-brand-dark/70"
                        }`}>
                          {stage.title}
                        </span>
                        <span className="font-sans text-[11px] text-gray-500 leading-relaxed block mt-1.5">
                          {stage.description}
                        </span>
                      </motion.div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Ultra-Premium Mobile Experience */}
          <div className="lg:hidden space-y-6">
            {choreographyStages.map((stage, idx) => {
              const isActive = idx === activeStage;
              const isPassed = idx < activeStage;
              return (
                <motion.div
                  key={stage.id}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  onClick={() => setActiveStage(idx)}
                  className={`relative p-7 rounded-2xl flex gap-5 items-start transition-all duration-500 cursor-pointer overflow-hidden ${
                    isActive 
                      ? "bg-white shadow-2xl shadow-brand-accent/20" 
                      : isPassed
                      ? "bg-white/80 shadow-lg"
                      : "bg-white/60 shadow hover:shadow-lg"
                  }`}
                >
                  {/* Animated gradient border for active */}
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-brand-accent via-[#e8865d] to-brand-accent opacity-20 animate-gradient bg-[length:200%_auto]"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.2 }}
                    />
                  )}
                  
                  {/* Glowing effect for active */}
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-accent/5 via-transparent to-brand-accent/5" />
                  )}
                  
                  <div className="flex flex-col items-center relative z-10">
                    <motion.div 
                      className={`w-4 h-4 rounded-full flex items-center justify-center shadow-lg ${
                        isActive 
                          ? "bg-gradient-to-br from-brand-accent to-[#c55a3a] shadow-brand-accent/50" 
                          : isPassed
                          ? "bg-gradient-to-br from-brand-accent to-[#c55a3a]"
                          : "bg-gradient-to-br from-gray-300 to-gray-200"
                      }`}
                      whileTap={{ scale: 0.85 }}
                      animate={isActive ? { 
                        scale: [1, 1.2, 1],
                        boxShadow: [
                          "0 4px 15px rgba(212, 107, 67, 0.3)",
                          "0 6px 25px rgba(212, 107, 67, 0.5)",
                          "0 4px 15px rgba(212, 107, 67, 0.3)",
                        ]
                      } : {}}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {(isPassed || isActive) && (
                        <CheckCircle2 size={10} className="text-white" strokeWidth={3} />
                      )}
                    </motion.div>
                    {idx < choreographyStages.length - 1 && (
                      <motion.div 
                        className={`w-[3px] h-20 rounded-full mt-2 ${
                          isPassed ? "bg-gradient-to-b from-brand-accent to-brand-accent/30" : "bg-gradient-to-b from-gray-300 to-transparent"
                        }`}
                        initial={{ height: 0 }}
                        animate={{ height: 80 }}
                        transition={{ delay: idx * 0.1 + 0.3 }}
                      />
                    )}
                  </div>
                  
                  <div className="space-y-3 flex-1 relative z-10">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] tracking-wider text-brand-accent uppercase block font-bold">
                        {stage.stageNumber}
                      </span>
                      {isActive && (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        >
                          <Sparkles size={12} className="text-brand-accent" />
                        </motion.div>
                      )}
                    </div>
                    
                    <h3 className={`font-serif text-xl font-semibold transition-colors ${
                      isActive ? "text-brand-dark" : "text-brand-dark/70"
                    }`}>
                      {stage.title}
                    </h3>
                    
                    <p className="font-sans text-[14px] text-gray-600 leading-relaxed">
                      {stage.description}
                    </p>
                    
                    {isActive && (
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: "4rem" }}
                        className="h-[3px] bg-gradient-to-r from-brand-accent to-transparent rounded-full mt-4"
                      />
                    )}
                  </div>
                  
                  {/* Corner accent for active */}
                  {isActive && (
                    <>
                      <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-brand-accent/40 rounded-tr-2xl" />
                      <Sparkles className="absolute top-2 right-2 text-brand-accent/40" size={12} />
                    </>
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
      
      {/* Add gradient animation keyframes */}
      <style>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </section>
  );
}
