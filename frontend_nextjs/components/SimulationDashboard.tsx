"use client";

import React from 'react';
import { 
  Clock, 
  Users, 
  Smile, 
  Activity, 
  Zap, 
  ShieldCheck,
  BarChart3,
  Brain,
  Cpu,
  RefreshCw,
  TrendingUp
} from 'lucide-react';
import { useSimulation } from '@/context/SimulationContext';
import MetricsCard from './MetricsCard';

const SimulationDashboard = () => {
  const { metrics, congestion, passengers, simParams } = useSimulation();

  // Calculate average congestion
  const avgCongestion = congestion.reduce((acc, curr) => acc + curr.value, 0) / congestion.length;

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-brand-600 text-[10px] font-black uppercase tracking-[0.2em]">
            <Activity className="w-3 h-3" /> Live Operations Feed
          </div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Real-time Metrics</h2>
          <p className="text-slate-500 font-medium text-base">Telemetry streams from the SimPy discrete-event kernel.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4 bg-white p-3 rounded-2xl border border-slate-100 shadow-sm">
           <div className="flex items-center gap-3 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-emerald-100/50">
             <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
             Engine Online
           </div>
           <div className="flex items-center gap-3 px-4 py-2 bg-brand-50 text-brand-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-brand-100/50">
             <Cpu className="w-3.5 h-3.5 animate-spin-slow" />
             AI Inference Active
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricsCard 
          title="Engine Latency"
          value={`${metrics.latency}ms`}
          icon={Clock}
          trend={metrics.latency > 30 ? "+12%" : "-5%"}
          trendColor={metrics.latency > 30 ? "text-rose-600 bg-rose-50" : "text-emerald-600 bg-emerald-50"}
          description="Processing time per simulation step."
          variant={metrics.latency > 40 ? 'slate' : 'brand'}
        />
        
        <MetricsCard 
          title="Active Agents"
          value={passengers.length}
          icon={Users}
          trend={`${Math.round(passengers.length / 1.5)}/min`}
          description="Total autonomous passengers in system."
          variant="brand"
        />

        <MetricsCard 
          title="Predictive CX"
          value={`${metrics.satisfaction}%`}
          icon={Smile}
          trend={metrics.satisfaction > 80 ? "OPTIMAL" : "STRESSED"}
          trendColor={metrics.satisfaction > 80 ? "text-emerald-600 bg-emerald-50" : "text-orange-600 bg-orange-50"}
          description="ML-modeled satisfaction index."
          variant="emerald"
        />

        <MetricsCard 
          title="System Load"
          value={`${Math.round(avgCongestion)}%`}
          icon={Activity}
          trend={avgCongestion > 50 ? "PEAK" : "STABLE"}
          trendColor={avgCongestion > 50 ? "text-rose-600 bg-rose-50" : "text-emerald-600 bg-emerald-50"}
          description="Aggregate terminal resource usage."
          variant="slate"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sector Breakdown */}
        <div className="lg:col-span-2 bg-white border border-slate-100 rounded-[2.5rem] p-10 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full -mr-32 -mt-32 transition-transform group-hover:scale-110" />
          
          <div className="flex items-center gap-4 mb-10 relative z-10">
            <div className="p-4 bg-slate-900 text-white rounded-2xl shadow-xl">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Node Integrity Analysis</h3>
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Bottleneck Distribution</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-10 relative z-10">
            {congestion.map((node, idx) => (
              <div key={idx} className="space-y-4">
                <div className="flex justify-between items-end">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{node.label}</span>
                    <p className="text-sm font-bold text-slate-900">SECTOR_ID: 0{idx + 1}</p>
                  </div>
                  <span className="text-3xl font-black text-slate-900 tracking-tighter">{node.value}%</span>
                </div>
                <div className="h-3 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100/50">
                  <div 
                    className={`h-full transition-all duration-1000 ${node.color} shadow-[0_0_12px_rgba(0,0,0,0.1)]`} 
                    style={{ width: `${node.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Neural Core Insights */}
        <div className="bg-slate-950 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden flex flex-col justify-between">
           <div className="absolute top-0 right-0 w-48 h-48 bg-brand-600/10 rounded-full blur-[80px]" />
           
           <div className="space-y-8 relative z-10">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/10 rounded-xl border border-white/10">
                  <Brain className="w-6 h-6 text-brand-400" />
                </div>
                <div>
                  <h3 className="text-xl font-black tracking-tight">Neural Core</h3>
                  <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">AI Predictions</p>
                </div>
              </div>

              <div className="space-y-6">
                 <div className="p-5 bg-white/5 rounded-2xl border border-white/5 space-y-3">
                    <div className="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                       <span>Confidence</span>
                       <span className="text-brand-400">98.2%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                       <div className="h-full bg-brand-500 w-[98%]" />
                    </div>
                 </div>

                 <div className="flex items-center gap-4 text-sm font-medium text-slate-300">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_12px_rgba(16,185,129,0.5)]" />
                    <span>Lounge congestion risk: <span className="text-white font-black">LOW</span></span>
                 </div>
                 <div className="flex items-center gap-4 text-sm font-medium text-slate-300">
                    <div className="w-2 h-2 bg-brand-500 rounded-full shadow-[0_0_12px_rgba(139,92,246,0.5)]" />
                    <span>Resource optimization: <span className="text-white font-black">ACTIVE</span></span>
                 </div>
              </div>
           </div>

           <div className="mt-10 pt-8 border-t border-white/5 relative z-10">
              <button className="w-full py-4 bg-brand-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-brand-500/20 hover:bg-white hover:text-slate-900 transition-all flex items-center justify-center gap-3">
                 <TrendingUp className="w-4 h-4" />
                 Optimize Strategy
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default SimulationDashboard;
