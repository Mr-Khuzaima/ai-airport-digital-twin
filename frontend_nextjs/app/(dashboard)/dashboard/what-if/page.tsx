"use client";

import React, { useState } from 'react';
import MetricsCard from '@/components/MetricsCard';
import { Play, RotateCcw, TrendingUp, AlertTriangle, Zap, Sliders as SliderIcon } from 'lucide-react';
import Sliders from '@/components/ControlSliders';
import { useSimulation } from '@/context/SimulationContext';

const WhatIfPage = () => {
  const { runScenario, isResetting, hasMounted } = useSimulation();
  const [params, setParams] = useState({
    scenario_name: 'Infrastructure Stress Test',
    increase_flights_percent: 25,
    security_counters: 4,
    delay_offset_minutes: 10,
    checkin_counters: 8,
  });

  const [lastResults, setLastResults] = useState<any>(null);

  const handleRun = async () => {
    await runScenario(params);
    setLastResults(params);
  };

  if (!hasMounted) return null;

  return (
    <div className="p-6 md:p-10 lg:p-14 space-y-12 bg-slate-50 min-h-screen animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <header className="space-y-4">
        <div className="flex items-center gap-2 px-3 py-1 bg-brand-600/10 text-brand-600 rounded-full w-fit">
          <Zap className="w-3.5 h-3.5 fill-current" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Predictive Sandbox</span>
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-tight">
          What-If <span className="text-brand-600">Planner</span>
        </h1>
        <p className="text-slate-500 font-medium text-lg">Manipulate infrastructure variables and predict AI-driven outcomes</p>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
        {/* Controls */}
        <div className="xl:col-span-1 space-y-10 bg-white p-10 md:p-12 rounded-2xl shadow-sm border border-slate-100/60">
          <div className="flex items-center gap-4 mb-2">
             <div className="p-4 bg-brand-50 rounded-2xl">
                <SliderIcon className="w-6 h-6 text-brand-600" />
             </div>
             <div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Parameters</h3>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Global Config</p>
             </div>
          </div>
          
          <Sliders params={params} setParams={setParams} />
          
          <button
            onClick={handleRun}
            disabled={isResetting}
            className={`w-full py-6 rounded-2xl font-black text-white transition-all flex items-center justify-center gap-3 text-lg shadow-2xl ${
              isResetting 
                ? 'bg-slate-400 cursor-not-allowed' 
                : 'bg-slate-900 hover:bg-brand-600 hover:-translate-y-1 shadow-slate-200 hover:shadow-brand-100 active:scale-95'
            }`}
          >
            {isResetting ? (
              <RotateCcw className="w-6 h-6 animate-spin" />
            ) : (
              <Play className="w-6 h-6 fill-current" />
            )}
            {isResetting ? 'Processing...' : 'Execute Analysis'}
          </button>
        </div>

        {/* Results / Insights */}
        <div className="xl:col-span-2 space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <MetricsCard title="Delta Impact" value="+14%" icon={TrendingUp} description="Latency Shift" />
            <MetricsCard title="SLA Risk" value="MODERATE" icon={AlertTriangle} description="Service Level" variant="slate" />
            <MetricsCard title="Efficiency" value="0.82" icon={Zap} description="Resource ROI" variant="emerald" />
          </div>
          
          <div className="bg-slate-950 p-12 md:p-16 rounded-2xl shadow-2xl border border-slate-800 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-brand-500/10 rounded-full -mr-48 -mt-48 blur-[120px] transition-transform group-hover:scale-110" />
            
            <div className="relative z-10 space-y-12">
              <div className="flex items-center gap-5">
                 <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 shadow-xl">
                    <TrendingUp className="text-brand-400 w-7 h-7" />
                 </div>
                 <div>
                    <h3 className="text-3xl font-black text-white tracking-tight leading-none">AI Neural Insight</h3>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.2em] mt-2">Heuristic Observation</p>
                 </div>
              </div>
              
              <div className="space-y-10">
                <p className="text-slate-300 text-xl leading-relaxed font-medium">
                  Applying a <span className="text-white font-black">{params.increase_flights_percent}%</span> load surge with 
                  <span className="text-white font-black"> {params.security_counters}</span> active lanes creates a non-linear bottleneck 
                  at the <span className="text-brand-400 font-bold underline underline-offset-8">Security Node</span>.
                </p>
                <div className="p-8 bg-white/5 rounded-2xl border border-white/5 border-l-4 border-l-brand-500 backdrop-blur-md">
                   <p className="text-slate-300 text-lg italic leading-relaxed font-medium">
                     "The Digital Twin predicts a 12% drop in Passenger Satisfaction due to increased 
                     process latency. Recommendation: Balance load by increasing check-in counters to 10."
                   </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatIfPage;
