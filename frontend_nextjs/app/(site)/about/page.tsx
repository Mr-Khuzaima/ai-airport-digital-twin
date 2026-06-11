import React from 'react';
import { 
  ShieldCheck, 
  BookOpen, 
  Target, 
  Award, 
  Cpu, 
  Layers, 
  Zap,
  CheckCircle2
} from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="space-y-32 max-w-7xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Hero Header */}
      <section className="relative rounded-[4rem] overflow-hidden bg-slate-950 px-8 py-24 md:py-32 text-white border border-slate-800 shadow-3xl text-center">
        <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-brand-600/10 rounded-full -mr-32 -mt-32 blur-[100px] pointer-events-none" />
        
        <div className="max-w-4xl mx-auto space-y-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-500/10 border border-brand-500/20 text-brand-300 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
            Research & Development
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-tight bg-gradient-to-b from-white to-slate-500 bg-clip-text text-transparent">
            The Digital Twin <br />
            <span className="text-brand-500">Initiative.</span>
          </h1>
          <p className="text-slate-400 font-medium text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            AeroTwin is a high-fidelity response to the challenge of modeling complex aviation ecosystems. 
            We bridge the gap between academic theory and mission-critical operational reality.
          </p>
        </div>
      </section>

      {/* Assignment Context */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center px-4">
        <div className="space-y-10">
          <div className="space-y-6">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              Academic Roots. <br />
              <span className="text-brand-600">Industrial Power.</span>
            </h2>
            <p className="text-slate-500 text-lg font-medium leading-relaxed">
              Derived from the <span className="italic font-bold text-slate-700">Project Instructions</span> mandate, this system implements an N-tier architecture to resolve bottleneck stochasticity.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              { title: "Discrete Logic", desc: "SimPy event kernels for granular flow modeling." },
              { title: "Neural Core", desc: "XGBoost & LSTM for predictive intelligence." },
              { title: "3D Rendering", desc: "WebGL hardware-accelerated environments." },
              { title: "State Mgmt", desc: "FastAPI & React Context synchronization." }
            ].map((item, i) => (
              <div key={i} className="flex gap-4 p-5 bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
                <div className="p-2 bg-brand-50 text-brand-600 h-fit rounded-lg">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-black text-slate-900 text-sm tracking-tight">{item.title}</h4>
                  <p className="text-slate-500 text-[11px] font-medium leading-tight">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-slate-100 p-12 md:p-16 rounded-[4rem] shadow-2xl shadow-slate-200/40 space-y-10 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-50 rounded-full blur-3xl -mr-32 -mt-32" />
          
          <div className="flex items-center gap-4 relative z-10">
            <div className="p-4 bg-slate-900 text-white rounded-2xl shadow-xl">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-black text-xl text-slate-900 tracking-tight leading-none">The Assignment Brief</h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Foundational Requirements</p>
            </div>
          </div>

          <div className="space-y-6 relative z-10">
            {[
              "End-to-end N-tier simulation architecture.",
              "Real-time resource allocation and queue modeling.",
              "ML integration for delay & satisfaction prediction.",
              "Interactive dashboard for scenario planning."
            ].map((req, i) => (
              <div key={i} className="flex items-start gap-4 pb-6 border-b border-slate-50 last:border-0 last:pb-0">
                <div className="w-1.5 h-1.5 bg-brand-600 rounded-full mt-2 flex-shrink-0" />
                <p className="text-slate-500 font-medium text-sm leading-relaxed">{req}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Objectives Grid */}
      <section className="space-y-16">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-50 text-brand-600 rounded-full text-[10px] font-black uppercase tracking-widest">
            Strategic Goals
          </div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Mission Objectives</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 px-4">
          {[
            { 
              icon: Target, 
              title: "Operational Fidelity", 
              desc: "Achieving millisecond precision in Terminal B queue modeling using SimPy discrete event logic.",
              color: "text-brand-600",
              bg: "bg-brand-50"
            },
            { 
              icon: ShieldCheck, 
              title: "Risk Mitigation", 
              desc: "Utilizing XGBoost regression to identify delay propagation patterns before they impact the network.",
              color: "text-emerald-600",
              bg: "bg-emerald-50"
            },
            { 
              icon: Award, 
              title: "Aviation Excellence", 
              desc: "Setting a new benchmark for AI-augmented digital twins in modern airport resource management.",
              color: "text-amber-600",
              bg: "bg-amber-50"
            }
          ].map((item, i) => (
            <div key={i} className="bg-white border border-slate-100 p-10 rounded-[3.5rem] shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 hover:-translate-y-2 transition-all duration-500 flex flex-col items-center text-center group">
              <div className={`w-20 h-20 ${item.bg} ${item.color} rounded-[2rem] flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 shadow-sm`}>
                <item.icon className="w-10 h-10" />
              </div>
              <h3 className="font-black text-2xl text-slate-900 mb-4 tracking-tight">{item.title}</h3>
              <p className="text-slate-500 font-medium text-sm leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Technology Integration Footer */}
      <section className="bg-slate-950 rounded-[4rem] p-12 md:p-24 text-white relative overflow-hidden shadow-3xl text-center space-y-12">
        <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-brand-600/10 rounded-full -mr-48 -mt-48 blur-[150px]" />
        
        <div className="space-y-6 relative z-10">
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-tight">
            Built for <span className="text-brand-500">Stability.</span> <br />
            Designed for <span className="text-brand-500">Scale.</span>
          </h2>
          <p className="text-slate-400 text-lg md:text-xl font-medium max-w-3xl mx-auto leading-relaxed">
            The AeroTwin ecosystem is architected to handle tens of thousands of concurrent agents 
            while providing real-time visual feedback and predictive analytics.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 relative z-10">
          {[
            { icon: Cpu, label: "Neural Compute" },
            { icon: Layers, label: "N-Tier Arch" },
            { icon: Zap, label: "Real-time Sync" },
            { icon: Target, label: "1:1 Digital Twin" }
          ].map((item, i) => (
            <div key={i} className="space-y-4">
              <div className="mx-auto w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-brand-400">
                <item.icon className="w-8 h-8" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">{item.label}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
