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
      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="p-10 space-y-10 bg-slate-50 min-h-screen animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-blue-600 font-bold text-[10px] uppercase tracking-widest">
            <Terminal className="w-3 h-3" /> Event-Driven Engine
          </div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900">Discrete Event Simulator</h1>
          <p className="text-slate-500 font-medium">High-fidelity agent logic & resource visualization</p>
        </div>
        
        <div className="flex items-center gap-4 bg-white p-3 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100">
          <button 
            onClick={() => setSimType('domestic')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-2xl text-xs font-black transition-all ${simType === 'domestic' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}
          >
            <Home className="w-4 h-4" /> DOMESTIC
          </button>
          <button 
            onClick={() => setSimType('international')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-2xl text-xs font-black transition-all ${simType === 'international' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}
          >
            <Globe2 className="w-4 h-4" /> INTERNATIONAL
          </button>
          <div className="w-[2px] h-8 bg-slate-100 mx-2" />
          <button 
            onClick={resetEnvironment}
            disabled={isResetting}
            className={`p-3 bg-blue-50 text-blue-600 rounded-2xl hover:bg-blue-600 hover:text-white transition-all group ${isResetting ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <RefreshCw className={`w-5 h-5 ${isResetting ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-10">
        <div className="xl:col-span-3">
          <AirportMap activeStage={activeStage} type={simType} isFlying={isFlying} />
        </div>

        <div className="xl:col-span-1 bg-slate-900 rounded-[3rem] p-8 text-white shadow-2xl flex flex-col h-[500px] border border-slate-800">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-black flex items-center gap-3">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              Real-Time Feed
            </h3>
            <span className="text-[10px] font-bold text-slate-500 border border-slate-800 px-2 py-1 rounded tracking-widest uppercase">
              Live
            </span>
          </div>
          <div className="flex-1 overflow-y-auto space-y-4 font-mono text-[10px] scrollbar-hide">
            {logs.length > 0 ? logs.map((log, i) => (
              <div key={i} className={`pl-4 py-2 border-l-2 transition-all duration-500 ${i === 0 ? 'border-blue-500 bg-blue-500/10 text-blue-200' : 'border-slate-800 text-slate-500'}`}>
                {log}
              </div>
            )) : (
              <div className="text-slate-600 italic">Awaiting events...</div>
            )}
          </div>
          <div className="mt-8 pt-8 border-t border-slate-800 flex justify-between items-center text-[10px] font-black text-slate-500">
             <span>SYS_LATENCY: 0.12ms</span>
             <Send className="w-3 h-3" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <MetricsCard title="Processing Speed" value={`${metrics.processingSpeed}s/Agent`} icon={Zap} description="Mean Cycle Time" />
        <MetricsCard title="Active Resources" value={`${metrics.activeResources}/40`} icon={Users} description="Resource Allocation" />
        <MetricsCard title="Event Rate" value={`${metrics.eventRate}/min`} icon={Activity} description="Throughput Frequency" />
        <MetricsCard title="Sim Time Scale" value={metrics.simTimeScale} icon={Clock} description="Acceleration Factor" />
      </div>
    </div>
  );
};

export default SimulationPage;
