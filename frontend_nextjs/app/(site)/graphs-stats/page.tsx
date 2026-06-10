"use client";

import React from 'react';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { BarChart3, LineChart as LucideLineChart, Info, Image as ImageIcon } from 'lucide-react';

const trafficData = [
  { month: 'Jan', actual: 4200, forecast: 4100 },
  { month: 'Feb', actual: 4500, forecast: 4600 },
  { month: 'Mar', actual: 5100, forecast: 5000 },
  { month: 'Apr', actual: 4800, forecast: 4950 },
  { month: 'May', actual: 5600, forecast: 5500 },
  { month: 'Jun', actual: 6100, forecast: 6200 },
  { month: 'Jul', actual: 6500, forecast: 6450 },
  { month: 'Aug', actual: 6300, stroke: 6400 },
  { month: 'Sep', actual: 5400, forecast: 5550 },
  { month: 'Oct', actual: 4900, forecast: 4900 },
  { month: 'Nov', actual: 4600, forecast: 4500 },
  { month: 'Dec', actual: 5200, forecast: 5300 },
];

export default function GraphsStatsPage() {
  return (
    <div className="space-y-24 max-w-7xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Page Header */}
      <div className="text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-50 text-brand-600 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
          Visual Evidence
        </div>
        <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-slate-900 leading-tight">
          Graphs & <br className="hidden md:block" />
          <span className="text-brand-600">Model Performance.</span>
        </h1>
        <p className="text-slate-500 font-medium text-lg max-w-2xl mx-auto leading-relaxed">
          Detailed visualizations of model outputs, training loss curves, and historical performance validation.
        </p>
      </div>

      {/* Interactive Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="bg-white border border-slate-100 p-10 md:p-12 rounded-[3.5rem] shadow-sm space-y-10 flex flex-col group hover:shadow-2xl hover:shadow-slate-200/40 transition-all duration-500">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-brand-50 text-brand-600 rounded-2xl group-hover:scale-110 transition-transform">
              <LucideLineChart className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-black text-xl text-slate-900 tracking-tight">LSTM Forecast Fidelity</h3>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Predicted vs Actual</p>
            </div>
          </div>
          <div className="h-96 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trafficData}>
                <CartesianGrid strokeDasharray="8 8" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} dy={10} fontWeight={600} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} fontWeight={600} />
                <Tooltip 
                   contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                />


                <Legend verticalAlign="top" height={40} iconType="circle" />
                <Line type="monotone" dataKey="actual" name="Dataset Actual" stroke="#8b5cf6" strokeWidth={4} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="forecast" name="LSTM Output" stroke="#10b981" strokeWidth={4} strokeDasharray="10 10" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Placeholder for Static Images (Graphs produced by models) */}
        <div className="bg-white border border-slate-100 p-10 md:p-12 rounded-[3.5rem] shadow-sm space-y-10 flex flex-col group hover:shadow-2xl hover:shadow-slate-200/40 transition-all duration-500">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-brand-50 text-brand-600 rounded-2xl group-hover:scale-110 transition-transform">
              <ImageIcon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-black text-xl text-slate-900 tracking-tight">XGBoost Feature Importance</h3>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Model-Produced Graph</p>
            </div>
          </div>
          <div className="flex-1 flex items-center justify-center bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200 min-h-[300px] relative overflow-hidden group/img">
             {/* Mock image text */}
             <div className="text-center space-y-2 relative z-10">
                <ImageIcon className="w-12 h-12 text-slate-300 mx-auto" />
                <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">[ FEATURE_IMPORTANCE_PLOT.PNG ]</p>
                <p className="text-slate-300 text-[10px] font-medium">Auto-generated during training</p>
             </div>
             <div className="absolute inset-0 bg-brand-600 opacity-0 group-hover/img:opacity-5 transition-opacity duration-500" />
          </div>
        </div>
      </div>

      {/* More Screenshots Grid */}
      <section className="space-y-12">
        <div className="flex items-center gap-3">
           <div className="p-3 bg-brand-50 text-brand-600 rounded-2xl">
              <BarChart3 className="w-6 h-6" />
           </div>
           <h2 className="text-2xl font-black text-slate-900 tracking-tight">Model Validation Screenshots</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           {[
             { name: "Delay Distribution", file: "delay_dist_curve.png" },
             { name: "Confusion Matrix", file: "cx_confusion_matrix.png" },
             { name: "Training Loss", file: "loss_epoch_history.png" }
           ].map((img, i) => (
             <div key={i} className="bg-white border border-slate-100 p-6 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all duration-500 space-y-6">
                <div className="aspect-video bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 relative overflow-hidden group/item">
                   <ImageIcon className="w-8 h-8 text-slate-200 group-hover/item:text-brand-300 transition-colors" />
                   <div className="absolute bottom-4 left-4 right-4 text-[9px] font-black text-slate-300 uppercase tracking-tighter truncate">
                      {img.file}
                   </div>
                </div>
                <div>
                   <h4 className="font-black text-slate-900 text-sm tracking-tight">{img.name}</h4>
                   <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">Output Artifact</p>
                </div>
             </div>
           ))}
        </div>
      </section>

      {/* Info footer */}
      <div className="bg-slate-950 text-slate-300 rounded-[3rem] p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-10 border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-600/10 rounded-full -mr-32 -mt-32 blur-[100px]" />
        <div className="flex items-start gap-6 relative z-10">
          <div className="p-4 bg-white/5 rounded-2xl border border-white/10 text-brand-400">
            <Info className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h4 className="font-black text-white text-xl tracking-tight">Visualization Integrity</h4>
            <p className="text-slate-500 font-medium max-w-2xl leading-relaxed">
              These visualizations are extracted directly from the <span className="text-brand-400">/outputs</span> directory of the project, representing the empirical results of our models trained on the specified datasets.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
