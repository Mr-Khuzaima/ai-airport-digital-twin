import React from 'react';
import { ShieldCheck, BookOpen, Target, Award } from 'lucide-react';

export default function AboutPage() {
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
              The original brief provided in <span className="text-slate-900 font-bold italic">Project Instructions.jpeg</span> 
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
                <span><strong className="text-slate-800">Interactive Dashboard:</strong> Developing a real-time console for "What-If" scenario planning.</span>
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
              <h3 className="font-black text-2xl mb-2 tracking-tight">Core Objective</h3>
              <p className="text-slate-400 text-sm leading-relaxed font-medium">
                The primary goal is to provide a decision-support system that identifies operational bottlenecks 
                before they manifest, allowing for optimized staffing and resource allocation in a virtual environment.
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
            { icon: Target, title: "Operational Fidelity", desc: "Modeling Terminal B queues with millisecond-level precision using SimPy." },
            { icon: ShieldCheck, title: "Risk Mitigation", desc: "Predicting flight delays to proactively manage gate assignments." },
            { icon: Award, title: "Aviation Excellence", desc: "Setting a benchmark for AI integration in airport management software." }
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
    </div>
  );
}
