"use client";

import React from 'react';
import AirportMap from '@/components/AirportMap';
import MetricsCard from '@/components/MetricsCard';
import { 
  Activity, 
  Clock, 
  Users, 
  Zap, 
  RefreshCw, 
  Globe2, 
  Home, 
  Terminal, 
  Send
} from 'lucide-react';
import { useSimulation } from '@/context/SimulationContext';

const SimulationPage = () => {
  const { 
    metrics, logs, activeStage, simType, isFlying, isResetting, hasMounted,
    setSimType, resetEnvironment 
  } = useSimulation();

  if (!hasMounted) return (
    <div className="flex h-screen items-center justify-center bg-slate-50">
      <div className="w-12 h-12 border-4 border-brand-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="p-6 md:p-10 lg:p-14 space-y-12 bg-slate-50 min-h-screen animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <header className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-10">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-brand-600 font-black text-[10px] uppercase tracking-[0.2em]">
            <Terminal className="w-3.5 h-3.5" /> Event-Driven Engine
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-tight">
            Discrete <span className="text-brand-600">Simulator</span>
          </h1>
          <p className="text-slate-500 font-medium text-lg">High-fidelity agent logic & resource visualization</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-100/60 w-full xl:w-auto">
          <button 
            onClick={() => setSimType('domestic')}
            className={`flex items-center gap-3 px-8 py-3.5 rounded-xl text-[10px] font-black transition-all tracking-widest ${simType === 'domestic' ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-400 hover:bg-slate-50'}`}
          >
            <Home className="w-4 h-4" /> DOMESTIC
          </button>
          <button 
            onClick={() => setSimType('international')}
            className={`flex items-center gap-3 px-8 py-3.5 rounded-xl text-[10px] font-black transition-all tracking-widest ${simType === 'international' ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-400 hover:bg-slate-50'}`}
          >
            <Globe2 className="w-4 h-4" /> INTERNATIONAL
          </button>
          <div className="hidden sm:block w-[2px] h-10 bg-slate-100 mx-2" />
          <button 
            onClick={resetEnvironment}
            disabled={isResetting}
            className={`p-4 bg-brand-50 text-brand-600 rounded-xl hover:bg-brand-600 hover:text-white transition-all group shadow-sm ${isResetting ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <RefreshCw className={`w-6 h-6 ${isResetting ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-700'}`} />
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-12">
        <div className="xl:col-span-3">
          <AirportMap activeStage={activeStage} type={simType} isFlying={isFlying} />
        </div>

        <div className="xl:col-span-1 bg-slate-950 rounded-2xl p-10 text-white shadow-2xl flex flex-col h-[550px] border border-slate-800 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-48 h-48 bg-brand-600/10 rounded-full blur-[80px]" />
          
          <div className="flex items-center justify-between mb-10 relative z-10">
            <h3 className="text-xl font-black flex items-center gap-4 tracking-tight">
              <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_12px_rgba(16,185,129,0.5)]" />
              Live Feed
            </h3>
            <span className="text-[10px] font-black text-slate-500 border border-slate-800 px-3 py-1.5 rounded-xl tracking-[0.2em] uppercase bg-white/5">
              Stream
            </span>
          </div>
          
          <div className="flex-1 overflow-y-auto space-y-5 font-mono text-[10px] scrollbar-hide relative z-10 px-2">
            {logs.length > 0 ? logs.map((log, i) => (
              <div key={i} className={`pl-5 py-3 border-l-2 transition-all duration-500 ${i === 0 ? 'border-brand-500 bg-brand-500/10 text-brand-200 font-bold' : 'border-slate-800 text-slate-500'}`}>
                {log}
              </div>
            )) : (
              <div className="text-slate-600 italic font-medium">Awaiting events...</div>
            )}
          </div>
          
          <div className="mt-10 pt-8 border-t border-slate-800 flex justify-between items-center text-[10px] font-black text-slate-500 relative z-10">
             <span className="tracking-widest">SYS_LATENCY: 0.12ms</span>
             <Send className="w-4 h-4 text-brand-500" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <MetricsCard title="Process Cycle" value={`${metrics.processingSpeed}s`} icon={Zap} description="Mean Time / Agent" />
        <MetricsCard title="Allocated" value={`${metrics.activeResources}`} icon={Users} description="Active Counters" variant="slate" />
        <MetricsCard title="Throughput" value={`${metrics.eventRate}`} icon={Activity} description="Events / Minute" variant="emerald" />
        <MetricsCard title="Acceleration" value={`${metrics.simTimeScale}x`} icon={Clock} description="Sim Time Scale" />
      </div>
    </div>
  );
};

export default SimulationPage;
