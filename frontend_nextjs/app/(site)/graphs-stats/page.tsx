"use client";

import React from 'react';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area, ScatterChart, Scatter, ZAxis, Cell, ReferenceLine
} from 'recharts';
import { 
  BarChart3, LineChart as LucideLineChart, Info, Activity, Users, Timer, AlertCircle, TrendingUp, Gauge
} from 'lucide-react';
import { useSimulation } from '@/context/SimulationContext';

export default function GraphsStatsPage() {
  const { history, metrics, simParams } = useSimulation();

  return (
    <div className="space-y-24 max-w-7xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Page Header */}
      <div className="text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-50 text-brand-600 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
          Live Digital Twin Telemetry
        </div>
        <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-slate-900 leading-tight">
          Real-Time <br className="hidden md:block" />
          <span className="text-brand-600">Performance Analytics.</span>
        </h1>
        <p className="text-slate-500 font-medium text-lg max-w-2xl mx-auto leading-relaxed">
          Monitoring live simulation streams, AI predictions, and operational bottlenecks. 
          Data refreshes every 4 seconds to maintain synchronization with the 3D engine.
        </p>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* 1. Live Satisfaction Rate */}
        <div className="bg-white border border-slate-100 p-10 rounded-[3.5rem] shadow-sm space-y-8 flex flex-col group hover:shadow-2xl transition-all duration-500">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-black text-xl text-slate-900 tracking-tight">Passenger Satisfaction Index</h3>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Live Sentiment Tracking</p>
            </div>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={history}>
                <CartesianGrid strokeDasharray="8 8" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="timestamp" hide />
                <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }} />
                <Line type="monotone" dataKey="satisfaction" name="Satisfaction %" stroke="#10b981" strokeWidth={4} dot={false} animationDuration={1000} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="text-slate-500 text-sm leading-relaxed border-t border-slate-50 pt-6">
            <span className="font-bold text-slate-900">Professor's Note:</span> This chart displays the aggregate satisfaction score derived from the XGBoost Classifier. It reacts dynamically to wait times and congestion levels sampled from the live simulation.
          </p>
        </div>

        {/* 2. Expected vs Actual Traffic */}
        <div className="bg-white border border-slate-100 p-10 rounded-[3.5rem] shadow-sm space-y-8 flex flex-col group hover:shadow-2xl transition-all duration-500">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-brand-50 text-brand-600 rounded-2xl">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-black text-xl text-slate-900 tracking-tight">LSTM Forecast vs. Actual Load</h3>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Predictive Accuracy</p>
            </div>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={history}>
                <defs>
                  <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="8 8" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="timestamp" hide />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="actualTraffic" name="Live Passengers" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorActual)" strokeWidth={3} />
                <Area type="monotone" dataKey="predictedTraffic" name="LSTM Forecast" stroke="#94a3b8" fill="transparent" strokeDasharray="5 5" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <p className="text-slate-500 text-sm leading-relaxed border-t border-slate-50 pt-6">
            <span className="font-bold text-slate-900">Insight:</span> Compares the real-time passenger count against the LSTM-generated forecast. Divergence indicates unexpected volatility or "What-If" scenario overrides.
          </p>
        </div>

        {/* 3. Traffic Volatility */}
        <div className="bg-white border border-slate-100 p-10 rounded-[3.5rem] shadow-sm space-y-8 flex flex-col group hover:shadow-2xl transition-all duration-500">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-orange-50 text-orange-600 rounded-2xl">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-black text-xl text-slate-900 tracking-tight">Traffic Inflow Volatility</h3>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Rate of Change</p>
            </div>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={history}>
                <CartesianGrid strokeDasharray="8 8" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="timestamp" hide />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip />
                <Line type="step" dataKey="trafficChange" name="% Change" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="text-slate-500 text-sm leading-relaxed border-t border-slate-50 pt-6">
            <span className="font-bold text-slate-900">Analysis:</span> Tracks the acceleration and deceleration of passenger arrivals. High spikes indicate "Rush Hour" conditions requiring resource reallocation.
          </p>
        </div>

        {/* 4. Queue Bottlenecks */}
        <div className="bg-white border border-slate-100 p-10 rounded-[3.5rem] shadow-sm space-y-8 flex flex-col group hover:shadow-2xl transition-all duration-500">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-black text-xl text-slate-900 tracking-tight">Resource Bottleneck Analysis</h3>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Stage Congestion</p>
            </div>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={history.slice(-10)}>
                <CartesianGrid strokeDasharray="8 8" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="timestamp" hide />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="checkInQueue" name="Check-In" stackId="a" fill="#fb923c" radius={[0, 0, 0, 0]} />
                <Bar dataKey="securityQueue" name="Security" stackId="a" fill="#3b82f6" />
                <Bar dataKey="boardingQueue" name="Boarding" stackId="a" fill="#10b981" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-slate-500 text-sm leading-relaxed border-t border-slate-50 pt-6">
            <span className="font-bold text-slate-900">Focus Area:</span> Visualizes the distribution of passengers across the airport's physical stages. Identifies where the "Flow Velocity" is lowest.
          </p>
        </div>

        {/* 5. Wait Time Distribution */}
        <div className="bg-white border border-slate-100 p-10 rounded-[3.5rem] shadow-sm space-y-8 flex flex-col group hover:shadow-2xl transition-all duration-500">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl">
              <Timer className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-black text-xl text-slate-900 tracking-tight">Wait Time Distribution</h3>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Efficiency Spread</p>
            </div>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={history[history.length - 1]?.waitTimes || []} layout="vertical">
                <CartesianGrid strokeDasharray="8 8" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis dataKey="range" type="category" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#6366f1" radius={[0, 10, 10, 0]}>
                  { (history[history.length - 1]?.waitTimes || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index > 2 ? '#ef4444' : '#6366f1'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-slate-500 text-sm leading-relaxed border-t border-slate-50 pt-6">
            <span className="font-bold text-slate-900">Metrics:</span> Shows how many passengers fall into specific "Wait Time" buckets. Red bars highlight passengers experiencing critical delays (10s+ in simulation time).
          </p>
        </div>

        {/* 6. Processing Throughput Velocity */}
        <div className="bg-white border border-slate-100 p-10 rounded-[3.5rem] shadow-sm space-y-8 flex flex-col group hover:shadow-2xl transition-all duration-500">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-pink-50 text-pink-600 rounded-2xl">
              <Gauge className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-black text-xl text-slate-900 tracking-tight">System Throughput Velocity</h3>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Real-Time Processing Speed</p>
            </div>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center space-y-4">
            <div className="text-7xl font-black text-slate-900 tracking-tighter">
              {metrics.processingSpeed.toFixed(1)}
              <span className="text-2xl text-slate-300 ml-2">pax/m</span>
            </div>
            <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden">
               <div 
                 className="h-full bg-brand-600 transition-all duration-1000" 
                 style={{ width: `${Math.min(100, metrics.processingSpeed * 20)}%` }}
               />
            </div>
          </div>
          <p className="text-slate-500 text-sm leading-relaxed border-t border-slate-50 pt-6">
            <span className="font-bold text-slate-900">KPI:</span> The "Heartbeat" of the airport. Measures the number of passengers successfully transitioning stages per simulation minute.
          </p>
        </div>

        {/* 7. Delay Correlation */}
        <div className="bg-white border border-slate-100 p-10 rounded-[3.5rem] shadow-sm space-y-8 flex flex-col lg:col-span-2 group hover:shadow-2xl transition-all duration-500 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full -mr-16 -mt-16 blur-3xl" />
          
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-red-50 text-red-600 rounded-2xl shadow-sm">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-black text-xl text-slate-900 tracking-tight">Delay Correlation Mapping</h3>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Predictive Offset vs. Actual Latency</p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl border border-slate-100">
               <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
               <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Live Model Validation</span>
            </div>
          </div>

          <div className="h-96 w-full relative z-10 bg-slate-50/30 rounded-[2rem] p-6 border border-slate-50">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis 
                  type="number" 
                  dataKey="delayOffset" 
                  name="Predicted Delay" 
                  unit="m" 
                  stroke="#94a3b8" 
                  fontSize={11} 
                  fontWeight={600}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  type="number" 
                  dataKey="latency" 
                  name="Actual Latency" 
                  unit="s" 
                  stroke="#94a3b8" 
                  fontSize={11} 
                  fontWeight={600}
                  axisLine={false}
                  tickLine={false}
                />
                <ZAxis type="number" dataKey="satisfaction" range={[30, 120]} name="Satisfaction" />
                <Tooltip 
                  cursor={{ strokeDasharray: '3 3', stroke: '#cbd5e1' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white p-4 rounded-2xl shadow-2xl border border-slate-100 space-y-2">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Data Point</p>
                          <div className="flex flex-col gap-1">
                            <div className="flex justify-between gap-8">
                              <span className="text-xs font-bold text-slate-500">Predicted Delay:</span>
                              <span className="text-xs font-black text-slate-900">{data.delayOffset}m</span>
                            </div>
                            <div className="flex justify-between gap-8">
                              <span className="text-xs font-bold text-slate-500">Actual Latency:</span>
                              <span className="text-xs font-black text-red-600">{data.latency}s</span>
                            </div>
                            <div className="flex justify-between gap-8">
                              <span className="text-xs font-bold text-emerald-500">Satisfaction:</span>
                              <span className="text-xs font-black text-emerald-600">{data.satisfaction}%</span>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <ReferenceLine 
                  segment={[{ x: 0, y: 0 }, { x: 60, y: 60 }]} 
                  stroke="#cbd5e1" 
                  strokeWidth={2} 
                  strokeDasharray="10 10" 
                  label={{ value: 'Ideal Match', position: 'insideTopLeft', fontSize: 10, fontWeight: 900, fill: '#94a3b8' }} 
                />
                <Scatter name="Live Sessions" data={history}>
                  {history.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.satisfaction > 80 ? '#10b981' : entry.satisfaction > 50 ? '#f59e0b' : '#ef4444'} 
                      fillOpacity={0.4}
                      stroke={entry.satisfaction > 80 ? '#059669' : entry.satisfaction > 50 ? '#d97706' : '#dc2626'}
                      strokeWidth={1.5}
                    />
                  ))}
                </Scatter>
                <Legend verticalAlign="top" height={36} iconType="circle" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-t border-slate-50 pt-8">
            <p className="text-slate-500 text-sm leading-relaxed max-w-2xl">
              <span className="font-bold text-slate-900">Model Validation Strategy:</span> This multi-dimensional scatter plot visualizes the correlation between XGBoost input variables (Predicted Delay) and the resulting Simulation Latency. 
              <span className="hidden md:inline"> Points clustered near the diagonal line represent high predictive fidelity. Bubble size and color indicate passenger satisfaction levels.</span>
            </p>
            <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-2xl border border-slate-100 shrink-0">
               <div className="flex items-center gap-2 px-3 py-1 bg-white rounded-lg shadow-sm">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-[9px] font-black text-slate-500">OPTIMAL</span>
               </div>
               <div className="flex items-center gap-2 px-3 py-1 bg-white rounded-lg shadow-sm">
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                  <span className="text-[9px] font-black text-slate-500">STRESSED</span>
               </div>
            </div>
          </div>
        </div>

      </div>

      {/* Info footer */}
      <div className="bg-slate-950 text-slate-300 rounded-[3rem] p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-10 border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-600/10 rounded-full -mr-32 -mt-32 blur-[100px]" />
        <div className="flex items-start gap-6 relative z-10">
          <div className="p-4 bg-white/5 rounded-2xl border border-white/10 text-brand-400">
            <Info className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h4 className="font-black text-white text-xl tracking-tight">Synchronization Integrity</h4>
            <p className="text-slate-500 font-medium max-w-2xl leading-relaxed">
              These visualizations are synced via the <span className="text-brand-400">Global Simulation Context</span>. Even when navigating between the 3D environment and this analytics suite, the data stream remains continuous and stateful.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
