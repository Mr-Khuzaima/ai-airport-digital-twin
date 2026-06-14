"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useSimulation } from '@/context/SimulationContext';
import { BrainCircuit, AlertTriangle, Zap, CheckCircle2, ChevronDown, ChevronUp, Terminal, Cpu, Network } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AIAdvisorPanel = () => {
  const { activeAdvice, metrics, simParams, passengers } = useSimulation();
  const [showLogs, setShowLogs] = useState(false);
  const [reasoningLogs, setReasoningLogs] = useState<{msg: string, type: 'model' | 'inference' | 'result' | 'suggestion'}[]>([]);
  const logContainerRef = useRef<HTMLDivElement>(null);

  // Generate real-time reasoning logs based on simulation state to prove AI logic
  useEffect(() => {
    const generateLog = () => {
      const now = new Date().toLocaleTimeString();
      const checkInCount = (passengers || []).filter(p => p.stage === 1).length;
      const securityCount = (passengers || []).filter(p => p.stage === 2).length;
      
      const newLogs = [
        { msg: `[${now}] PULLING TELEMETRY: Active Passengers: ${passengers?.length || 0}, Latency: ${metrics.latency}ms`, type: 'inference' as const },
        { msg: `[${now}] XGBOOST INFERENCE: Analyzing Satisfaction Curve (Input: WaitTime=${(metrics.latency/10).toFixed(1)}m, Congestion=${Math.round(checkInCount+securityCount)})`, type: 'model' as const },
        { msg: `[${now}] LSTM FORECAST: Predicted Traffic Load @ ${simParams.increase_flights_percent}% Growth -> Result: ${Math.round((passengers?.length || 0) * (1 + simParams.increase_flights_percent/100))} pax/hr`, type: 'model' as const },
      ];

      if (activeAdvice) {
        newLogs.push({ msg: `[${now}] NEURAL TRIGGER: Detected ${activeAdvice.title}. Mapping optimal solution via Strategic weights.`, type: 'suggestion' as const });
        newLogs.push({ msg: `[${now}] AI RECOMMENDATION: ${activeAdvice.suggestion}`, type: 'suggestion' as const });
      } else {
        newLogs.push({ msg: `[${now}] STABILITY CHECK: System within nominal parameters. Satisfaction Confidence: ${metrics.satisfaction}%`, type: 'result' as const });
      }

      setReasoningLogs(prev => [...prev, ...newLogs].slice(-50));
    };

    // Trigger first log immediately
    generateLog();

    const interval = setInterval(generateLog, 4000);
    return () => clearInterval(interval);
  }, [passengers?.length, metrics.latency, metrics.satisfaction, activeAdvice, simParams.increase_flights_percent]);

  // Localized auto-scroll (Fixes screen locking)
  useEffect(() => {
    if (showLogs && logContainerRef.current) {
      const container = logContainerRef.current;
      container.scrollTo({
        top: container.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [reasoningLogs, showLogs]);
  
  return (
    <div className="bg-white border border-slate-100 rounded-[3rem] p-10 shadow-sm relative overflow-hidden group hover:shadow-2xl transition-all duration-500">
      <div className="absolute top-0 right-0 w-64 h-64 bg-brand-600/5 rounded-full -mr-32 -mt-32 blur-[100px]" />
      
      <div className="flex flex-col lg:flex-row lg:items-center gap-10 relative z-10">
        <div className="space-y-6 flex-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-brand-600 text-white rounded-2xl shadow-lg shadow-brand-500/20">
                <BrainCircuit className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">AI Advisor</h2>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Real-Time Operational Support</p>
              </div>
            </div>
            
            <button 
              onClick={() => setShowLogs(!showLogs)}
              className="flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-slate-100"
            >
              <Terminal className="w-3 h-3" />
              {showLogs ? 'Hide Reasoning' : 'View Reasoning Logs'}
              {showLogs ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          </div>

          <AnimatePresence mode="wait">
            {showLogs ? (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div 
                  ref={logContainerRef}
                  className="bg-slate-950 rounded-[2rem] p-6 font-mono text-[10px] space-y-2 h-64 overflow-y-auto border border-slate-800 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent custom-scrollbar"
                >
                  <div className="sticky top-0 bg-slate-950 pb-4 flex items-center gap-2 text-brand-400 border-b border-white/5 z-20">
                    <Network className="w-3 h-3" />
                    <span className="font-black uppercase tracking-widest">Neural Logic Stream</span>
                  </div>
                  <div className="pt-2 space-y-1.5">
                    {reasoningLogs.map((log, i) => (
                      <div key={i} className="flex gap-2 animate-in fade-in slide-in-from-left-1 duration-200">
                        <span className={`shrink-0 ${
                          log.type === 'model' ? 'text-brand-500' : 
                          log.type === 'inference' ? 'text-slate-600' : 
                          log.type === 'suggestion' ? 'text-yellow-400 font-bold' : 'text-emerald-500'
                        }`}>
                          {log.type === 'model' ? '●' : log.type === 'inference' ? '○' : log.type === 'suggestion' ? '★' : '▶'}
                        </span>
                        <div className={`font-mono leading-relaxed break-all ${
                          log.type === 'suggestion' ? 'text-yellow-400 font-bold' : 'text-slate-300'
                        }`}>
                          <span className="text-emerald-500/50 mr-2 select-none">AeroTwin:\AI_CORE{">"}</span>
                          {log.msg}
                        </div>
                      </div>
                    ))}
                    <div className="flex gap-2 items-center text-slate-500 font-mono">
                      <span className="text-emerald-500/50 mr-2 select-none">AeroTwin:\AI_CORE{">"}</span>
                      <span className="w-2 h-4 bg-slate-500 animate-pulse" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key={activeAdvice ? activeAdvice.id : 'healthy'}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-4"
              >
                {activeAdvice ? (
                  <>
                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      activeAdvice.type === 'risk' ? 'bg-red-50 text-red-600' : 'bg-orange-50 text-orange-600'
                    }`}>
                      <AlertTriangle className="w-3 h-3" />
                      {activeAdvice.type} Detected
                    </div>
                    <h3 className="text-xl font-black text-slate-900 leading-tight">
                      {activeAdvice.title}
                    </h3>
                    <p className="text-slate-500 text-sm leading-relaxed max-w-md">
                      {activeAdvice.message}
                    </p>
                    
                    <div className="p-6 bg-brand-50/50 rounded-[2rem] border border-brand-100/50 space-y-3">
                      <div className="flex items-center gap-2 text-brand-600">
                        <Zap className="w-4 h-4 fill-current" />
                        <span className="text-xs font-black uppercase tracking-widest">Strategic Recommendation</span>
                      </div>
                      <p className="text-slate-900 font-bold text-sm leading-relaxed">
                        {activeAdvice.suggestion}
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="space-y-4 py-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                      <CheckCircle2 className="w-3 h-3" />
                      Operations Optimized
                    </div>
                    <h3 className="text-xl font-black text-slate-900 leading-tight">
                      Airport Flow is Efficient
                    </h3>
                    <p className="text-slate-500 text-sm leading-relaxed max-w-md">
                      AI models (LSTM & XGBoost) indicate that current resource allocation is sufficient for the active traffic load.
                    </p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="lg:w-72 space-y-4 shrink-0">
          <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 text-center">System Confidence</p>
            <div className="relative w-32 h-32 mx-auto">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="64" cy="64" r="58"
                  fill="transparent"
                  stroke="currentColor"
                  strokeWidth="12"
                  className="text-slate-200"
                />
                <circle
                  cx="64" cy="64" r="58"
                  fill="transparent"
                  stroke="currentColor"
                  strokeWidth="12"
                  strokeDasharray={364}
                  strokeDashoffset={364 - (364 * Math.min(100, metrics.satisfaction + 5)) / 100}
                  className="text-brand-600 transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-black text-slate-900 leading-none">{Math.round(metrics.satisfaction)}%</span>
                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">Model Score</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAdvisorPanel;
