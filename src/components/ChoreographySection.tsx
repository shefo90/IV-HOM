/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, CSSProperties } from "react";
import { choreographyStages } from "../data";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2, ArrowRight, Sparkles, Zap } from "lucide-react";

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
                05 • PRODUCTION CHOREOGRAPHY
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
          {/* Stunning Timeline with 3D-like effects */}
          <div className="relative hidden lg:block mb-16">
            {/* Glowing background track */}
            <div className="absolute top-[7px] left-[5%] right-[5%] h-[3px] bg-gradient-to-r from-transparent via-brand-accent/10 to-transparent blur-sm" />
            
            {/* Main background line with shine effect */}
            <div className="absolute top-[7px] left-[5%] right-[5%] h-[3px] bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full shadow-inner" />
            
            {/* Animated progress line with glow */}
            <motion.div 
              className="absolute top-[7px] left-[5%] h-[3px] rounded-full shadow-lg shadow-brand-accent/50"
              style={{
                background: "linear-gradient(90deg, #d46b43 0%, #e8865d 50%, #d46b43 100%)",
                backgroundSize: "200% 100%",
              }}
              initial={{ width: "0%" }}
              animate={{ 
                width: `${(activeStage / 6) * 90}%`,
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{ 
                width: { duration: 0.8, ease: "easeInOut" },
                backgroundPosition: { duration: 3, repeat: Infinity, ease: "linear" }
              }}
            />
            
            {/* Particles along the line */}
            {activeStage > 0 && (
              <motion.div
                className="absolute top-[7px] left-[5%] w-2 h-2 rounded-full bg-white shadow-lg shadow-brand-accent/80"
                initial={{ x: 0 }}
                animate={{ x: `${(activeStage / 6) * (window.innerWidth * 0.9 * 0.9)}px` }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
              />
            )}
            
            <div className="grid grid-cols-7 relative z-10">
              {choreographyStages.map((stage, idx) => {
                const isActive = idx === activeStage;
                const isPassed = idx < activeStage;
                return (
                  <button
                    key={stage.id}
                    onClick={() => setActiveStage(idx)}
                    className="flex flex-col items-center group focus:outline-none relative"
                  >
                    {/* Glow effect behind active dot */}
                    {isActive && (
                      <motion.div
                        className="absolute top-0 w-16 h-16 bg-brand-accent/30 rounded-full blur-2xl"
                        animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.3, 0.6, 0.3] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    )}
                    
                    {/* Premium 3D-style dot */}
                    <motion.div
                      className={`relative w-6 h-6 rounded-full transition-all duration-500 flex items-center justify-center shadow-lg ${
                        isActive
                          ? "bg-gradient-to-br from-brand-accent via-[#d97b53] to-brand-accent shadow-brand-accent/60"
                          : isPassed
                          ? "bg-gradient-to-br from-brand-accent to-[#c55a3a] shadow-brand-accent/40"
                          : "bg-gradient-to-br from-white to-gray-100 shadow-gray-300 group-hover:from-brand-accent/20 group-hover:to-brand-accent/10"
                      }`}
                      whileHover={{ scale: 1.3, rotate: 180 }}
                      whileTap={{ scale: 0.9 }}
                      animate={isActive ? { 
                        scale: [1, 1.15, 1],
                        boxShadow: [
                          "0 4px 20px rgba(212, 107, 67, 0.4)",
                          "0 8px 30px rgba(212, 107, 67, 0.6)",
                          "0 4px 20px rgba(212, 107, 67, 0.4)",
                        ]
                      } : {}}
                      transition={{ duration: 2, repeat: isActive ? Infinity : 0 }}
                    >
                      {/* Multi-layer pulsing rings on active */}
                      {isActive && (
                        <>
                          <motion.div
                            className="absolute inset-0 rounded-full border-2 border-brand-accent/60"
                            animate={{ scale: [1, 2, 1], opacity: [0.6, 0, 0.6] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          />
                          <motion.div
                            className="absolute inset-0 rounded-full border-2 border-brand-accent/40"
                            animate={{ scale: [1, 2.5, 1], opacity: [0.4, 0, 0.4] }}
                            transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
                          />
                        </>
                      )}
                      
                      {/* Inner content based on state */}
                      {isPassed && !isActive && (
                        <motion.div
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ type: "spring", stiffness: 200 }}
                        >
                          <CheckCircle2 size={14} className="text-white drop-shadow-lg" strokeWidth={3} />
                        </motion.div>
                      )}
                      
                      {isActive && (
                        <motion.div 
                          className="w-3 h-3 bg-white rounded-full shadow-inner"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        />
                      )}
                      
                      {!isPassed && !isActive && (
                        <div className="w-2 h-2 bg-gray-300 rounded-full" />
                      )}
                    </motion.div>
                    
                    {/* Enhanced stage label */}
                    <motion.span 
                      className={`font-mono text-[10px] tracking-[0.2em] uppercase mt-5 transition-all duration-300 ${
                        isActive 
                          ? "text-brand-accent font-black text-[11px] drop-shadow-[0_2px_10px_rgba(212,107,67,0.5)]" 
                          : isPassed 
                          ? "text-brand-dark/80 font-bold" 
                          : "text-gray-400 group-hover:text-brand-dark font-medium"
                      }`}
                      animate={isActive ? { y: [0, -2, 0] } : {}}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {stage.stageNumber}
                    </motion.span>
                    
                    {/* Stage title below (faded) */}
                    <span className={`font-serif text-[11px] mt-1 transition-all duration-300 text-center max-w-[100px] ${
                      isActive ? "text-brand-dark font-semibold" : "text-gray-400 font-light"
                    }`}>
                      {stage.title.split(' ')[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Ultra-Premium Desktop content box */}
          <div className="hidden lg:block relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStage}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -30, scale: 0.95 }}
                transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
                className="relative overflow-hidden rounded-2xl"
              >
                {/* Animated gradient border effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-brand-accent via-[#e8865d] to-brand-accent opacity-100 blur-sm animate-gradient bg-[length:200%_auto]" />
                
                {/* Main content card */}
                <div className="relative bg-white m-[2px] p-12 rounded-2xl shadow-2xl">
                  {/* Animated corner decorations */}
                  <motion.div 
                    className="absolute top-0 left-0 w-20 h-20"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="absolute top-0 left-0 w-6 h-[3px] bg-gradient-to-r from-brand-accent to-transparent" />
                    <div className="absolute top-0 left-0 w-[3px] h-6 bg-gradient-to-b from-brand-accent to-transparent" />
                    <motion.div 
                      className="absolute top-1 left-1 w-3 h-3 border-2 border-brand-accent/30 rounded-full"
                      animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </motion.div>
                  
                  <motion.div 
                    className="absolute top-0 right-0 w-20 h-20"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="absolute top-0 right-0 w-6 h-[3px] bg-gradient-to-l from-brand-accent to-transparent" />
                    <div className="absolute top-0 right-0 w-[3px] h-6 bg-gradient-to-b from-brand-accent to-transparent" />
                    <Sparkles className="absolute top-2 right-2 text-brand-accent/40" size={14} />
                  </motion.div>
                  
                  <motion.div 
                    className="absolute bottom-0 left-0 w-20 h-20"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <div className="absolute bottom-0 left-0 w-6 h-[3px] bg-gradient-to-r from-brand-accent to-transparent" />
                    <div className="absolute bottom-0 left-0 w-[3px] h-6 bg-gradient-to-t from-brand-accent to-transparent" />
                  </motion.div>
                  
                  <motion.div 
                    className="absolute bottom-0 right-0 w-20 h-20"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <div className="absolute bottom-0 right-0 w-6 h-[3px] bg-gradient-to-l from-brand-accent to-transparent" />
                    <div className="absolute bottom-0 right-0 w-[3px] h-6 bg-gradient-to-t from-brand-accent to-transparent" />
                    <Zap className="absolute bottom-2 right-2 text-brand-accent/40" size={14} />
                  </motion.div>
                  
                  {/* Floating indicator arrow with glow */}
                  <motion.div 
                    className="absolute -top-4 left-[calc(5%_+_14.28%*var(--active-index))] -translate-x-1/2 transition-all duration-500 drop-shadow-2xl" 
                    style={{ "--active-index": activeStage } as CSSProperties}
                    animate={{ y: [-2, 2, -2] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <div className="relative">
                      <div className="absolute inset-0 bg-brand-accent blur-md opacity-60" />
                      <div className="relative w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[14px] border-t-brand-accent" />
                    </div>
                  </motion.div>
                  
                  <div className="grid grid-cols-3 gap-12 items-center">
                    {/* Left: Ultra-premium stage number */}
                    <motion.div 
                      className="relative"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.2, type: "spring" }}
                    >
                      {/* Glowing background */}
                      <div className="absolute inset-0 bg-gradient-to-br from-brand-accent/10 via-brand-accent/5 to-transparent blur-3xl scale-150" />
                      
                      <div className="relative space-y-4">
                        <div className="flex items-center gap-2">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                          >
                            <Sparkles className="text-brand-accent" size={16} />
                          </motion.div>
                          <span className="font-mono text-xs text-brand-accent font-bold tracking-[0.2em] uppercase">
                            Current Stage
                          </span>
                        </div>
                        
                        <div className="flex items-baseline gap-4">
                          <motion.span 
                            className="font-serif text-7xl font-light bg-gradient-to-br from-brand-dark via-brand-dark to-brand-dark/70 bg-clip-text text-transparent"
                            animate={{ scale: [1, 1.02, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            {choreographyStages[activeStage].stageNumber}
                          </motion.span>
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1, rotate: [0, 10, 0] }}
                            transition={{ delay: 0.3, rotate: { duration: 2, repeat: Infinity } }}
                          >
                            <CheckCircle2 className="text-brand-accent mb-4" size={32} strokeWidth={2.5} />
                          </motion.div>
                        </div>
                        
                        <div className="flex items-center gap-2 text-brand-accent">
                          <span className="font-mono text-[11px] tracking-wider uppercase font-semibold">In Progress</span>
                          <motion.div
                            animate={{ x: [0, 5, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          >
                            <ArrowRight size={14} strokeWidth={3} />
                          </motion.div>
                        </div>
                        
                        {/* Circular progress indicator */}
                        <div className="relative w-16 h-16 mt-6">
                          <svg className="transform -rotate-90 w-16 h-16">
                            <circle
                              cx="32"
                              cy="32"
                              r="28"
                              stroke="currentColor"
                              strokeWidth="4"
                              fill="none"
                              className="text-gray-200"
                            />
                            <motion.circle
                              cx="32"
                              cy="32"
                              r="28"
                              stroke="currentColor"
                              strokeWidth="4"
                              fill="none"
                              strokeLinecap="round"
                              className="text-brand-accent"
                              initial={{ strokeDasharray: "0 175" }}
                              animate={{ strokeDasharray: `${((activeStage + 1) / 7) * 175} 175` }}
                              transition={{ duration: 1, ease: "easeInOut" }}
                            />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-xs font-mono font-bold text-brand-dark">
                              {Math.round(((activeStage + 1) / 7) * 100)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                    
                    {/* Right: Enhanced description */}
                    <motion.div 
                      className="col-span-2 border-l-[3px] border-brand-accent/40 pl-12 space-y-5"
                      initial={{ x: 20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <h3 className="font-serif text-4xl text-brand-dark font-semibold tracking-tight">
                            {choreographyStages[activeStage].title}
                          </h3>
                          <motion.div
                            animate={{ rotate: [0, 15, -15, 0] }}
                            transition={{ duration: 3, repeat: Infinity }}
                          >
                            <Zap className="text-brand-accent" size={24} />
                          </motion.div>
                        </div>
                        <motion.div 
                          className="h-[3px] w-24 bg-gradient-to-r from-brand-accent via-[#e8865d] to-transparent rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: 96 }}
                          transition={{ delay: 0.5, duration: 0.8 }}
                        />
                      </div>
                      
                      <p className="font-sans text-[16px] text-gray-600 leading-[1.8] max-w-xl">
                        {choreographyStages[activeStage].description}
                      </p>
                      
                      {/* Enhanced progress bar */}
                      <div className="flex items-center gap-4 pt-4">
                        <span className="font-mono text-[10px] text-gray-500 uppercase tracking-wider font-semibold">
                          Stage {activeStage + 1} of {choreographyStages.length}
                        </span>
                        <div className="flex-1 h-2 bg-gradient-to-r from-gray-200 to-gray-100 rounded-full overflow-hidden max-w-[300px] shadow-inner">
                          <motion.div 
                            className="h-full bg-gradient-to-r from-brand-accent via-[#e8865d] to-brand-accent shadow-lg bg-[length:200%_auto]"
                            initial={{ width: "0%" }}
                            animate={{ 
                              width: `${((activeStage + 1) / choreographyStages.length) * 100}%`,
                              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                            }}
                            transition={{ 
                              width: { duration: 0.8 },
                              backgroundPosition: { duration: 2, repeat: Infinity, ease: "linear" }
                            }}
                          />
                        </div>
                        <span className="font-mono text-sm text-brand-accent font-bold">
                          {Math.round(((activeStage + 1) / choreographyStages.length) * 100)}%
                        </span>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
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
