"use client";

import React from 'react';
import MetricsCard from '@/components/MetricsCard';
import { Plane, Clock, Smile, Users, BarChart3, RefreshCw, AlertCircle, Zap, TrendingUp } from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { useSimulation } from '@/context/SimulationContext';

const Dashboard = () => {
  const { metrics, history, congestion, isResetting, resetEnvironment } = useSimulation();

  return (
    <div className="p-6 md:p-10 lg:p-14 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <header className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-8">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-600/10 text-brand-600 rounded-full">
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span className="text-[10px] font-black uppercase tracking-widest">Neural Twin Active</span>
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-tight">
              Airport <span className="text-brand-600">Intelligence</span>
            </h1>
            <p className="text-slate-500 font-medium text-lg mt-2">Precision Operations Monitoring & AI Prediction Hub</p>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-4 w-full xl:w-auto">
          <div className="flex-1 xl:flex-none bg-white px-8 py-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center min-w-[180px]">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Sim Time Index</span>
            <span className="text-2xl font-black text-brand-600 font-mono tracking-tighter">
              {metrics.timestamp || '00:00:00'}
            </span>
          </div>
          <button 
            onClick={resetEnvironment}
            disabled={isResetting}
            className={`flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-black text-sm transition-all shadow-xl ${
              isResetting 
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                : 'bg-slate-900 text-white hover:bg-brand-600 hover:shadow-brand-200 hover:-translate-y-1 active:scale-95'
            }`}
          >
            <RefreshCw className={`w-4 h-4 ${isResetting ? 'animate-spin' : ''}`} />
            {isResetting ? 'Syncing...' : 'Reset System'}
          </button>
        </div>
      </header>

      {/* KPI GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
        <MetricsCard 
          title="Live Fleet" 
          value={metrics.activeFleet} 
          icon={Plane} 
          trend="+14.2%" 
          description="Total aircraft in local airspace" 
        />
        <MetricsCard 
          title="Inertia Loss" 
          value={`${metrics.latency}m`} 
          icon={Clock} 
          trend="-3.8%" 
          trendColor="bg-emerald-50 text-emerald-600"
          variant="emerald"
          description="Average delay across all nodes" 
        />
        <MetricsCard 
          title="CX Score" 
          value={metrics.satisfaction} 
          icon={Smile} 
          trend="STABLE" 
          trendColor="bg-slate-100 text-slate-500"
          variant="slate"
          description="Aggregate passenger sentiment" 
        />
        <MetricsCard 
          title="Efficiency" 
          value={`${metrics.throughput}k`} 
          icon={TrendingUp} 
          trend="+2.4%" 
          description="Passenger processed per hour" 
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 md:gap-10">
        <div className="xl:col-span-2 bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-slate-100/60 flex flex-col">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-12">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-brand-50 rounded-xl">
                <BarChart3 className="w-6 h-6 text-brand-600" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Flow Dynamics</h3>
                <p className="text-slate-400 text-sm font-medium">Real-time passenger volume analysis</p>
              </div>
            </div>
            <div className="px-4 py-2 bg-slate-50 text-slate-400 rounded-lg border border-slate-100 text-[10px] font-black uppercase tracking-widest">
              Live Stream: Connected
            </div>
          </div>
          
          <div className="h-[450px] w-full mt-auto">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={history}>
                <defs>
                  <linearGradient id="colorFlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="8 8" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="time" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 600}} 
                  dy={15} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 600}} 
                />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '24px', 
                    border: 'none', 
                    boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.15)',
                    padding: '20px'
                  }}
                  itemStyle={{ fontWeight: 800, color: '#1e293b' }}
                  labelStyle={{ color: '#94a3b8', marginBottom: '8px', fontWeight: 600 }}
                  cursor={{ stroke: '#8b5cf6', strokeWidth: 2, strokeDasharray: '6 6' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="flow" 
                  stroke="#8b5cf6" 
                  strokeWidth={5} 
                  fillOpacity={1} 
                  fill="url(#colorFlow)" 
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-900 p-8 md:p-12 rounded-2xl shadow-2xl text-white flex flex-col relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-600/10 rounded-full -mr-32 -mt-32 blur-[100px]" />
          
          <div className="flex items-center gap-4 mb-12 relative z-10">
            <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
              <AlertCircle className="w-6 h-6 text-brand-400" />
            </div>
            <div>
              <h3 className="text-2xl font-black tracking-tight">Node Integrity</h3>
              <p className="text-slate-500 text-sm font-medium">Congestion distribution map</p>
            </div>
          </div>
          
          <div className="flex-1 flex flex-col justify-center gap-10 relative z-10">
            {congestion.map((node) => (
              <div key={node.label} className="space-y-4">
                <div className="flex justify-between items-end">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{node.label}</span>
                  <span className="text-2xl font-black text-white">{node.value}%</span>
                </div>
                <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${node.color} rounded-full transition-all duration-[2000ms] ease-out shadow-[0_0_20px_rgba(139,92,246,0.4)]`} 
                    style={{ width: `${node.value}%` }} 
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 p-8 bg-white/5 rounded-2xl border border-white/5 relative z-10">
            <p className="text-sm font-semibold text-slate-300 leading-relaxed italic">
              "System equilibrium detected. Predictive models suggest increasing counter capacity at Terminal B within the next 15 cycles."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
