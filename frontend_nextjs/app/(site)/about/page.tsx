"use client";

import React from 'react';
import { 
  ShieldCheck, 
  BookOpen, 
  Target, 
  Award, 
  GitBranch, 
  Calendar, 
  Users as UsersIcon, 
  History,
  Terminal
} from 'lucide-react';
import { 
  RadialBarChart, 
  RadialBar, 
  ResponsiveContainer, 
  PolarAngleAxis 
} from 'recharts';
import { useSimulation } from '@/context/SimulationContext';

export default function AboutPage() {
  const { repoStats } = useSimulation();

  return (
    <div className="space-y-24 max-w-6xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Page Header */}
      <div className="text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-50 text-brand-600 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
          Assignment Context
        </div>
        <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-slate-900 leading-tight">
          The Professor's <br className="hidden md:block" />
          <span className="text-brand-600">Digital Twin Challenge.</span>
        </h1>
        <p className="text-slate-500 font-medium text-lg max-w-2xl mx-auto leading-relaxed">
          This project was developed as a comprehensive response to the "Airport Digital Twin Simulation" assignment, 
          bridging the gap between academic theory and operational reality.
        </p>
      </div>

      {/* Assignment Section */}
      <section className="bg-white border border-slate-100 p-10 md:p-16 rounded-[3.5rem] shadow-sm grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-brand-50 text-brand-600 rounded-2xl">
              <BookOpen className="w-6 h-6" />
            </div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">The Assignment</h2>
          </div>
          <div className="space-y-6 text-slate-500 font-medium leading-relaxed">
            <p>
              The original brief provided in <span className="text-slate-900 font-bold italic">Project Instructions</span> 
              challenged us to design an end-to-end N-tier system capable of simulating complex airport dynamics. 
              The requirements emphasized:
            </p>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 bg-brand-600 rounded-full mt-2" />
                <span><strong className="text-slate-800">High-Fidelity Simulation:</strong> Modeling passenger flow and queue dynamics using discrete event logic.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 bg-brand-600 rounded-full mt-2" />
                <span><strong className="text-slate-800">ML-Driven Insights:</strong> Integrating predictive models for delays and passenger satisfaction.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 bg-brand-600 rounded-full mt-2" />
                <span><strong className="text-slate-800">Decision Support:</strong> Developing an active AI Advisor that resolves bottlenecks in real-time.</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="bg-slate-900 rounded-[3rem] p-12 text-white relative overflow-hidden h-[450px] flex flex-col justify-end group border border-slate-800">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/10 rounded-full -mr-32 -mt-32 blur-[80px] group-hover:scale-110 transition-transform duration-700" />
          <div className="relative z-10 space-y-6">
            <div className="p-4 bg-white/10 w-fit rounded-2xl backdrop-blur-md">
              <Award className="w-8 h-8 text-brand-400" />
            </div>
            <div>
              <h3 className="font-black text-2xl mb-2 tracking-tight">Digital Twin Vision</h3>
              <p className="text-slate-400 text-sm leading-relaxed font-medium">
                The objective was to create a "Live Twin"—a system that doesn't just show data, but actively participates 
                in airport management through synchronized AI suggestions and predictive analytics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Project Essence */}
      <section className="space-y-16">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Project Deliverables</h2>
          <p className="text-slate-500 font-medium">Fulfilling the professor's technical mandates.</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { icon: Target, title: "Synchronized KPI Feed", desc: "7 dynamic time-series charts providing real-time telemetry from the simulation core." },
            { icon: ShieldCheck, title: "Intelligent Alerts", desc: "Automated bottleneck identification with actionable strategic recommendations." },
            { icon: Award, title: "Aviation Excellence", desc: "A robust, scalable Digital Twin architecture setting a benchmark for AI integration." }
          ].map((item, i) => (
            <div key={i} className="bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-sm hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-2 transition-all duration-300 space-y-6 flex flex-col items-center text-center group">
              <div className="w-14 h-14 bg-brand-50 rounded-2xl flex items-center justify-center text-brand-600 group-hover:scale-110 transition-transform">
                <item.icon className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <h3 className="font-black text-slate-900 text-lg tracking-tight">{item.title}</h3>
                <p className="text-slate-500 text-xs leading-relaxed font-medium">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Repository Engineering Analytics */}
      <section className="space-y-16">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-[9px] font-black uppercase tracking-widest">
            Source Control Metrics
          </div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Repository Engineering</h2>
          <p className="text-slate-500 font-medium">Empirical proof of development velocity and version control discipline.</p>
        </div>

        <div className="bg-white border border-slate-100 p-10 md:p-14 rounded-[4rem] shadow-sm hover:shadow-2xl transition-all duration-500 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/5 rounded-full -mr-48 -mt-48 blur-3xl pointer-events-none" />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center relative z-10">
            {/* Stats Column */}
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="space-y-3 p-6 bg-slate-50 rounded-[2rem] border border-slate-100 group-hover:bg-white transition-colors duration-500">
                <div className="flex items-center gap-3 text-brand-600">
                  <Terminal className="w-5 h-5" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Repository Identity</span>
                </div>
                <h4 className="text-lg font-black text-slate-900 break-all leading-tight">
                  {repoStats?.repo_name || 'ai-airport-digital-twin'}
                </h4>
              </div>

              <div className="space-y-3 p-6 bg-slate-50 rounded-[2rem] border border-slate-100 group-hover:bg-white transition-colors duration-500">
                <div className="flex items-center gap-3 text-blue-600">
                  <Calendar className="w-5 h-5" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Project Inception</span>
                </div>
                <h4 className="text-xl font-black text-slate-900">
                  {repoStats?.creation_date || '2026-06-06'}
                </h4>
              </div>

              <div className="space-y-3 p-6 bg-slate-50 rounded-[2rem] border border-slate-100 group-hover:bg-white transition-colors duration-500 sm:col-span-2">
                <div className="flex items-center gap-3 text-emerald-600">
                  <UsersIcon className="w-5 h-5" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Project Contributors</span>
                </div>
                <div className="flex flex-wrap gap-2 pt-2">
                  {repoStats?.contributors_list?.map((name, i) => (
                    <span key={i} className="px-4 py-2 bg-white border border-slate-100 rounded-xl text-sm font-black text-slate-700 shadow-sm">
                      {name}
                    </span>
                  )) || (
                    <span className="px-4 py-2 bg-white border border-slate-100 rounded-xl text-sm font-black text-slate-700 shadow-sm animate-pulse">
                      Detecting Contributors...
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-3 p-6 bg-slate-50 rounded-[2rem] border border-slate-100 group-hover:bg-white transition-colors duration-500">
                <div className="flex items-center gap-3 text-rose-600">
                  <GitBranch className="w-5 h-5" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Development Depth</span>
                </div>
                <h4 className="text-2xl font-black text-slate-900">
                  {repoStats?.total_commits || 0} Total Commits
                </h4>
              </div>
            </div>

            {/* Gauge Column */}
            <div className="flex flex-col items-center justify-center p-10 bg-slate-950 rounded-[3rem] shadow-2xl border border-white/5 relative overflow-hidden">
               <div className="absolute inset-0 bg-brand-600/10 blur-[100px] pointer-events-none" />
               
               <div className="w-full h-48 relative">
                 <ResponsiveContainer width="100%" height="100%">
                   <RadialBarChart 
                     cx="50%" 
                     cy="50%" 
                     innerRadius="80%" 
                     outerRadius="100%" 
                     barSize={20} 
                     data={[{ value: repoStats?.total_commits || 0 }]} 
                     startAngle={180} 
                     endAngle={0}
                   >
                     <PolarAngleAxis
                       type="number"
                       domain={[0, Math.max(100, (repoStats?.total_commits || 0) * 1.2)]}
                       angleAxisId={0}
                       tick={false}
                     />
                     <RadialBar
                       background
                       dataKey="value"
                       cornerRadius={10}
                       fill="#8b5cf6"
                     />
                   </RadialBarChart>
                 </ResponsiveContainer>
                 <div className="absolute inset-0 flex flex-col items-center justify-center pt-8">
                    <History className="w-6 h-6 text-brand-400 mb-1" />
                    <span className="text-4xl font-black text-white tracking-tighter">
                      {repoStats?.total_commits || 0}
                    </span>
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">COMMITS</span>
                 </div>
               </div>
               <p className="text-slate-400 text-[10px] font-bold text-center uppercase tracking-widest mt-4">
                 Development Velocity
               </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
