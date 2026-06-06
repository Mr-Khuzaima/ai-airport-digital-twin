"use client";

import React from 'react';
import MetricsCard from '@/components/MetricsCard';
import { Plane, Clock, Smile, Users, BarChart3, RefreshCw, AlertCircle, Zap } from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { useSimulation } from '@/context/SimulationContext';

const Dashboard = () => {
  const { metrics, history, congestion, isResetting, resetEnvironment, hasMounted } = useSimulation();

  return (
    <div className="p-8 lg:p-12 space-y-10 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 px-3 py-1 bg-blue-600/10 text-blue-600 rounded-full w-fit">
            <Zap className="w-3 h-3 fill-current" />
            <span className="text-[10px] font-black uppercase tracking-widest">Digital Twin Active</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-black tracking-tight text-slate-900">Airport Intelligence</h1>
          <p className="text-slate-500 font-medium italic">Unified Monitoring & Performance Prediction Hub</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center min-w-[140px]">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Simulation Time</span>
            <span className="text-lg font-black text-blue-600 font-mono tracking-tighter">
              {metrics.timestamp || '--:--:--'}
            </span>
          </div>
          <button 
            onClick={resetEnvironment}
            disabled={isResetting}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm transition-all ${
              isResetting ? 'bg-slate-100 text-slate-400' : 'bg-slate-900 text-white hover:bg-blue-600 hover:-translate-y-1 shadow-lg'
            }`}
          >
            <RefreshCw className={`w-4 h-4 ${isResetting ? 'animate-spin' : ''}`} />
            {isResetting ? 'Purging State...' : 'Reset Environment'}
          </button>
        </div>
      </header>

      {/* KPI GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <MetricsCard title="Active Fleet" value={metrics.activeFleet} icon={Plane} trend="+5%" description="Incoming & Gate" />
        <MetricsCard title="System Latency" value={`${metrics.latency}m`} icon={Clock} trend="-2.1%" trendColor="text-emerald-500" description="Mean Delay Impact" />
        <MetricsCard title="CX Index" value={metrics.satisfaction} icon={Smile} trend="+0.4%" description="Passenger Sentiment" />
        <MetricsCard title="Throughput" value={`${metrics.throughput}k`} icon={Users} trend="+12%" description="Agents / Hour" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 bg-white p-10 rounded-[2.5rem] shadow-xl shadow-slate-200/40 border border-slate-50">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-50 rounded-2xl">
                <BarChart3 className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 tracking-tight">Passenger Volume Dynamics</h3>
            </div>
            <div className="text-[10px] font-black text-slate-400 bg-slate-50 px-3 py-1 rounded-lg border border-slate-100">
              REAL-TIME FEED
            </div>
          </div>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={history}>
                <defs>
                  <linearGradient id="colorFlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F8FAFC" />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 10}} dy={15} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 10}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                  cursor={{ stroke: '#2563EB', strokeWidth: 2, strokeDasharray: '4 4' }}
                />
                <Area type="monotone" dataKey="flow" stroke="#2563EB" strokeWidth={4} fillOpacity={1} fill="url(#colorFlow)" animationDuration={1000} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-900 p-10 rounded-[2.5rem] shadow-2xl text-white flex flex-col border border-slate-800">
          <div className="flex items-center gap-3 mb-10">
            <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
              <AlertCircle className="w-5 h-5 text-blue-400" />
            </div>
            <h3 className="text-xl font-bold tracking-tight">Node Load Distribution</h3>
          </div>
          
          <div className="flex-1 flex flex-col justify-between">
            {congestion.map((node) => (
              <div key={node.label} className="space-y-4">
                <div className="flex justify-between items-end">
                  <span className="text-xs font-black text-slate-500 uppercase tracking-widest">{node.label}</span>
                  <span className="text-xl font-black text-white">{node.value}%</span>
                </div>
                <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                  <div 
                    className={`h-full ${node.color} rounded-full transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(37,99,235,0.3)]`} 
                    style={{ width: `${node.value}%` }} 
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 p-6 bg-white/5 rounded-3xl border border-white/10 italic text-slate-400 text-xs leading-relaxed">
            AI Observation: System load is currently balanced. Security counters operating at optimal efficiency thresholds.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
