import React from 'react';
import { 
  Database, 
  Cpu, 
  Activity, 
  Server, 
  LayoutDashboard, 
  Search, 
  Zap, 
  Code,
  Box,
  Brain,
  Network,
  Share2
} from 'lucide-react';

export default function OverviewPage() {
  const steps = [
    {
      title: "Data Acquisition & Processing",
      icon: Search,
      desc: "Our pipeline ingests multi-source aviation datasets. We employ advanced feature engineering—calculating rolling averages of flight delays and rush-hour density—to create high-fidelity training sets using Pandas and NumPy.",
      details: ["Feature Engineering", "Stochastic Modeling", "Data Normalisation"]
    },
    {
      title: "The Neural Core (ML Layer)",
      icon: Brain,
      desc: "A hybrid AI architecture. XGBoost handles high-dimensional delay regression, while LSTM (Long Short-Term Memory) networks forecast passenger influx patterns by analyzing temporal dependencies in traffic data.",
      details: ["XGBoost Regression", "LSTM Time-Series", "Sentiment Inference"]
    },
    {
      title: "The Virtual Twin (Simulation)",
      icon: Activity,
      desc: "The heartbeat of AeroTwin. Using SimPy, we simulate a Discrete Event System (DES) where passengers are autonomous agents navigating through resource-constrained nodes like security and check-in.",
      details: ["SimPy Kernel", "Agent-Based Modeling", "Resource Contention"]
    },
    {
      title: "Async API Orchestration",
      icon: Server,
      desc: "A FastAPI backbone managing high-concurrency simulation states. It handles bi-directional data flow: serving ML inferences and managing the simulation lifecycle via an asynchronous event loop.",
      details: ["FastAPI Asynchronous", "Pydantic Validation", "RESTful Design"]
    },
    {
      title: "Real-Time 3D Visualization",
      icon: Box,
      desc: "Built with React Three Fiber and Three.js. The frontend synchronizes the state from the SimPy kernel into a hardware-accelerated 3D environment, rendering agent paths and infrastructure status in real-time.",
      details: ["WebGL / Three.js", "React Context State", "Framer Motion"]
    }
  ];

  const techStack = [
    { name: "FastAPI", category: "Backend", icon: Zap, color: "text-emerald-500" },
    { name: "Next.js 14", category: "Frontend", icon: LayoutDashboard, color: "text-blue-500" },
    { name: "SimPy", category: "Simulation", icon: Activity, color: "text-rose-500" },
    { name: "Three.js", category: "3D Engine", icon: Box, color: "text-indigo-500" },
    { name: "XGBoost", category: "AI/ML", icon: Brain, color: "text-brand-500" },
    { name: "LSTM", category: "AI/ML", icon: Network, color: "text-brand-500" },
  ];

  return (
    <div className="space-y-24 max-w-7xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Page Header */}
      <div className="text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-50 text-brand-600 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
          Technical Architecture
        </div>
        <h1 className="text-6xl md:text-7xl font-black tracking-tighter text-slate-900 leading-tight">
          Systems <br className="hidden md:block" />
          <span className="text-brand-600">Deep Dive.</span>
        </h1>
        <p className="text-slate-500 font-medium text-xl max-w-3xl mx-auto leading-relaxed">
          AeroTwin is a high-fidelity Digital Twin that bridges the gap between discrete mathematical modeling and real-time interactive visualization.
        </p>
      </div>

      {/* Tech Stack Grid */}
      <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {techStack.map((tech, i) => (
          <div key={i} className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center gap-3 group">
            <div className={cn("p-4 bg-slate-50 rounded-2xl group-hover:scale-110 transition-transform", tech.color)}>
              <tech.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-black text-slate-900">{tech.name}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{tech.category}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Architecture Flow Timeline */}
      <section className="relative px-6 py-12">
        <div className="absolute left-[3.25rem] md:left-[5.25rem] top-10 bottom-10 w-1 bg-slate-100 rounded-full hidden md:block" />
        
        <div className="space-y-12 md:space-y-20">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div key={idx} className="relative md:pl-32 group">
                {/* Marker Bullet */}
                <div className="absolute left-6 md:left-14 top-4 w-12 h-12 rounded-2xl bg-white border border-slate-100 text-brand-600 hidden md:flex items-center justify-center shadow-xl shadow-slate-200/50 group-hover:bg-brand-600 group-hover:text-white transition-all duration-300 z-10">
                  <Icon className="w-6 h-6" />
                </div>

                {/* Content Box */}
                <div className="bg-white border border-slate-100 p-8 md:p-12 rounded-[3.5rem] shadow-sm hover:shadow-2xl hover:shadow-slate-200/40 transition-all duration-500 grid grid-cols-1 lg:grid-cols-3 gap-10">
                  <div className="lg:col-span-2 space-y-6">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center text-xs font-black md:hidden">
                          {idx + 1}
                        </span>
                        <span className="text-[10px] font-black text-brand-600 uppercase tracking-widest">Logic Tier 0{idx + 1}</span>
                      </div>
                      <h3 className="text-3xl font-black text-slate-900 tracking-tight">{step.title}</h3>
                    </div>
                    <p className="text-slate-500 text-lg font-medium leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                  
                  <div className="bg-slate-50 p-8 rounded-[2.5rem] flex flex-col justify-center space-y-4">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Specifications</p>
                    <div className="flex flex-col gap-3">
                      {step.details.map((tag, tagIdx) => (
                        <div key={tagIdx} className="flex items-center gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-brand-500" />
                          <span className="text-xs font-bold text-slate-700 uppercase tracking-tight">{tag}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Summary Box */}
      <section className="bg-slate-950 p-12 md:p-24 rounded-[4.5rem] text-white shadow-3xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[60rem] h-[60rem] bg-brand-600/20 rounded-full -mr-48 -mt-48 blur-[180px] pointer-events-none" />
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-8">
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter leading-tight">Closing the Loop.</h2>
            <p className="text-slate-400 text-xl leading-relaxed font-medium">
              By combining <span className="text-brand-400 font-bold">DES Simulation</span> with 
              <span className="text-white font-bold"> Neural Forecasting</span>, AeroTwin creates a 
              living ecosystem. The simulation provides the ground truth, while the AI predicts the ripple effects of infrastructure changes.
            </p>
            <div className="flex gap-4">
               <div className="px-6 py-3 bg-white/10 rounded-2xl border border-white/10 text-xs font-black tracking-widest uppercase">
                 Deterministic Engine
               </div>
               <div className="px-6 py-3 bg-brand-600/20 rounded-2xl border border-brand-600/30 text-xs font-black tracking-widest uppercase text-brand-400">
                 Stochastic Intelligence
               </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-8">
            <div className="group p-8 bg-white/5 rounded-[2.5rem] border border-white/10 hover:bg-white/10 transition-colors">
              <Share2 className="w-10 h-10 text-brand-400 mb-6 group-hover:scale-110 transition-transform" />
              <h4 className="font-black text-xl text-white mb-2">Sync</h4>
              <p className="text-slate-500 text-sm font-medium">Bi-directional state management between SimPy and React.</p>
            </div>
            <div className="group p-8 bg-white/5 rounded-[2.5rem] border border-white/10 hover:bg-white/10 transition-colors">
              <Network className="w-10 h-10 text-brand-400 mb-6 group-hover:scale-110 transition-transform" />
              <h4 className="font-black text-xl text-white mb-2">Scalable</h4>
              <p className="text-slate-500 text-sm font-medium">Modular architecture allowing for thousands of concurrent agents.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
