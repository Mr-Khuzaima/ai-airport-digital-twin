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
    // 1. Run Scenario updates global state
    await runScenario(params);
    // 2. Set local results for the 'Impact Insight' section
    setLastResults(params);
  };

  if (!hasMounted) return null;

  return (
    <div className="p-10 space-y-10 bg-slate-50 min-h-screen animate-in fade-in duration-700">
      <header className="space-y-2">
        <div className="flex items-center gap-2 px-3 py-1 bg-indigo-600/10 text-indigo-600 rounded-full w-fit">
          <Zap className="w-3 h-3 fill-current" />
          <span className="text-[10px] font-black uppercase tracking-widest">Predictive Sandbox</span>
        </div>
        <h1 className="text-4xl lg:text-5xl font-black tracking-tight text-slate-900">What-If Scenario Planner</h1>
        <p className="text-slate-500 font-medium">Manipulate infrastructure variables and predict AI-driven outcomes</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Controls */}
        <div className="lg:col-span-1 space-y-8 bg-white p-10 rounded-[3rem] shadow-xl shadow-slate-200/50 border border-slate-100">
          <div className="flex items-center gap-3 mb-4">
             <div className="p-3 bg-indigo-50 rounded-2xl">
                <SliderIcon className="w-5 h-5 text-indigo-600" />
             </div>
             <h3 className="text-xl font-bold text-slate-800">Parameters</h3>
          </div>
          
          <Sliders params={params} setParams={setParams} />
          
          <button
            onClick={handleRun}
            disabled={isResetting}
            className={`w-full py-5 rounded-[2rem] font-black text-white transition-all flex items-center justify-center gap-3 text-lg shadow-2xl ${
              isResetting ? 'bg-slate-400' : 'bg-indigo-600 hover:bg-indigo-700 hover:-translate-y-1 shadow-indigo-200'
            }`}
          >
            {isResetting ? (
              <RotateCcw className="w-6 h-6 animate-spin" />
            ) : (
              <Play className="w-6 h-6 fill-current" />
            )}
            {isResetting ? 'Synthesizing...' : 'Execute Analysis'}
          </button>
        </div>

        {/* Results / Insights */}
        <div className="lg:col-span-2 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <MetricsCard title="Delta Impact" value="+14%" icon={TrendingUp} description="Latency Shift" />
            <MetricsCard title="SLA Risk" value="MODERATE" icon={AlertTriangle} description="Service Level" color="text-orange-500" />
            <MetricsCard title="Resource ROI" value="0.82" icon={Zap} description="Efficiency Score" />
          </div>
          
          <div className="bg-slate-900 p-12 rounded-[3.5rem] shadow-2xl border border-slate-800 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full -mr-32 -mt-32 blur-3xl transition-transform group-hover:scale-110" />
            
            <div className="relative z-10 space-y-8">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10">
                    <TrendingUp className="text-indigo-400 w-6 h-6" />
                 </div>
                 <h3 className="text-2xl font-black text-white tracking-tight">AI Predictive Insight</h3>
              </div>
              
              <div className="space-y-6">
                <p className="text-slate-400 text-lg leading-relaxed font-medium">
                  Applying a <strong>{params.increase_flights_percent}%</strong> load surge with 
                  <strong> {params.security_counters}</strong> active lanes creates a non-linear bottleneck 
                  at the Security Node.
                </p>
                <div className="p-6 bg-white/5 rounded-3xl border border-white/5 border-l-4 border-l-indigo-500">
                   <p className="text-slate-300 text-sm italic leading-relaxed">
                     "The Digital Twin predicts a 12% drop in Passenger Satisfaction (CX Index) due to increased 
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
