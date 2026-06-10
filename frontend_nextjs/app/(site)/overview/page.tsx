import React from 'react';
import { Database, Cpu, Activity, Server, LayoutDashboard, Search, Zap, Code } from 'lucide-react';

export default function OverviewPage() {
  const steps = [
    {
      title: "Data Acquisition & Processing",
      icon: Search,
      desc: "What: We collect and clean historical flight and passenger datasets. How: Using Python's Pandas and Scikit-learn to normalize data and engineer features like 'rush_hour_intensity'.",
      details: ["Feature Engineering", "Dataset Cleaning", "Normalisation"]
    },
    {
      title: "The Neural Core (ML Layer)",
      icon: Cpu,
      desc: "What: A suite of predictive models. How: Training XGBoost and LSTM networks to forecast traffic and predict delays with high precision.",
      details: ["XGBoost Delay Regression", "Satisfaction Classification", "LSTM Traffic Forecasting"]
    },
    {
      title: "The Virtual Airport (Simulation)",
      icon: Activity,
      desc: "What: A discrete-event twin of airport operations. How: Leveraging SimPy to model passenger flows, resource availability, and stochastic queue dynamics.",
      details: ["Discrete Event Sim", "Resource Contention", "Queue Modeling"]
    },
    {
      title: "Real-Time API Orchestration",
      icon: Server,
      desc: "What: The bridge between simulation and UI. How: A FastAPI backend that serves as a state manager, handling concurrent sim-runs and model inference.",
      details: ["FastAPI REST", "Async Handlers", "Pydantic Schemas"]
    },
    {
      title: "Intelligent Control Console",
      icon: LayoutDashboard,
      desc: "What: An interactive frontend. How: Next.js with React Context to provide a real-time monitoring feed and 'What-If' scenario controls.",
      details: ["Real-time KPI Feed", "Scenario Sandboxing", "Responsive UI"]
    }
  ];

  return (
    <div className="space-y-24 max-w-6xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Page Header */}
      <div className="text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-50 text-brand-600 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
          System Workflow
        </div>
        <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-slate-900 leading-tight">
          What & How: <br className="hidden md:block" />
          <span className="text-brand-600">The Architecture.</span>
        </h1>
        <p className="text-slate-500 font-medium text-lg max-w-2xl mx-auto leading-relaxed">
          A deep dive into the operational mechanics and technical layers that define the AeroTwin ecosystem.
        </p>
      </div>

      {/* Architecture Flow Timeline */}
      <section className="relative px-6">
        <div className="absolute left-[3.25rem] md:left-[5.25rem] top-10 bottom-10 w-1 bg-slate-100 rounded-full" />
        
        <div className="space-y-16">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div key={idx} className="relative pl-20 md:pl-32 group">
                {/* Marker Bullet */}
                <div className="absolute left-6 md:left-14 top-2 w-12 h-12 rounded-2xl bg-white border border-slate-100 text-brand-600 flex items-center justify-center shadow-xl shadow-slate-200/50 group-hover:bg-brand-600 group-hover:text-white transition-all duration-300 z-10">
                  <Icon className="w-6 h-6" />
                </div>

                {/* Content Box */}
                <div className="bg-white border border-slate-100 p-8 md:p-10 rounded-[3rem] shadow-sm hover:shadow-2xl hover:shadow-slate-200/40 transition-all duration-500 space-y-6">
                  <div className="space-y-2">
                    <span className="text-[10px] font-black text-brand-600 uppercase tracking-widest">Component 0{idx + 1}</span>
                    <h3 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">{step.title}</h3>
                  </div>
                  <p className="text-slate-500 text-base font-medium leading-relaxed max-w-3xl">
                    {step.desc}
                  </p>
                  
                  <div className="flex flex-wrap gap-2.5 pt-2">
                    {step.details.map((tag, tagIdx) => (
                      <span 
                        key={tagIdx} 
                        className="inline-flex items-center px-4 py-1.5 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-black text-slate-500 uppercase tracking-wider"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Summary Box */}
      <section className="bg-slate-950 p-12 md:p-16 rounded-[4rem] text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-brand-500/10 rounded-full -mr-48 -mt-48 blur-[120px]" />
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight">The Core Logic</h2>
            <p className="text-slate-400 text-lg leading-relaxed font-medium">
              By combining <span className="text-brand-400">Simulation</span> (Real-time events) with 
              <span className="text-white"> AI Prediction</span> (Future outcomes), we create a 
              closed-loop system that continuously learns and optimizes itself.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
              <Zap className="w-8 h-8 text-brand-400 mb-4" />
              <h4 className="font-bold text-white">Speed</h4>
              <p className="text-slate-500 text-xs">Millisecond inference</p>
            </div>
            <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
              <Code className="w-8 h-8 text-brand-400 mb-4" />
              <h4 className="font-bold text-white">Precision</h4>
              <p className="text-slate-500 text-xs">Pydantic validation</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
