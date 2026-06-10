"use client";

import React from 'react';
import dynamic from 'next/dynamic';
import { 
  Cpu, 
  Code2, 
  Layout, 
  Wind, 
  Zap, 
  Monitor,
  Box,
  Layers,
  ArrowRight
} from 'lucide-react';
import ControlPanel from '@/components/Simulation3D/ControlPanel';

// Load 3D Canvas dynamically to avoid SSR issues with Three.js
const Simulation3DCanvas = dynamic(
  () => import('@/components/Simulation3D/Simulation3DCanvas'),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-[600px] bg-slate-100 rounded-[2.5rem] flex flex-col items-center justify-center gap-4 animate-pulse">
        <div className="w-12 h-12 border-4 border-brand-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest">Warming up 3D Engine...</p>
      </div>
    )
  }
);

export default function SimulationTechPage() {
  const techStack = [
    {
      title: "Three.js & R3F",
      icon: Box,
      category: "3D Engine",
      desc: "Our realistic environment is powered by React Three Fiber, bringing high-performance WebGL rendering into the React component lifecycle.",
      features: ["Component-based 3D", "PBR Materials", "Hardware Acceleration"]
    },
    {
      title: "SimPy Engine",
      icon: Cpu,
      category: "Simulation Kernel",
      desc: "The backbone of the project. It handles the discrete-event logic, resource management (queues, counters), and the timing of every agent.",
      features: ["Process-based modeling", "Resource contention", "Interrupt-driven events"]
    },
    {
      title: "Framer Motion",
      icon: Wind,
      category: "Motion Logic",
      desc: "Smooth transitions between simulation states and UI interactions are orchestrated via Framer Motion's declarative animation API.",
      features: ["Orchestrated sequences", "Layout transitions", "Spring physics"]
    },
    {
      title: "Next.js 14",
      icon: Layout,
      category: "UI Framework",
      desc: "Next.js orchestrates the frontend. React Context API manages the global simulation state, ensuring the 3D scene stays in sync.",
      features: ["Server Components", "Context-driven state", "Optimized bundling"]
    }
  ];

  return (
    <div className="space-y-24 max-w-7xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Page Header */}
      <div className="text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-50 text-brand-600 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
          Interactive 3D Digital Twin
        </div>
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter text-slate-900 leading-tight">
          Live Airport <br className="hidden md:block" />
          <span className="text-brand-600">Simulation.</span>
        </h1>
        <p className="text-slate-500 font-medium text-lg max-w-3xl mx-auto leading-relaxed">
          Manipulate infrastructure variables in real-time and observe how passenger flow, 
          queues, and bottlenecks evolve in our high-fidelity 3D environment.
        </p>
      </div>

      {/* Main Simulation Section */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        <div className="xl:col-span-3">
          <Simulation3DCanvas />
        </div>
        <div className="xl:col-span-1">
          <ControlPanel />
        </div>
      </div>

      {/* Tech Stack Documentation */}
      <div className="space-y-16">
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">How it Works</h2>
          <p className="text-slate-500 font-medium">The sophisticated architecture behind the AeroTwin experience.</p>
        </div>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {techStack.map((tech, idx) => {
            const Icon = tech.icon;
            return (
              <div 
                key={idx}
                className="bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-sm hover:shadow-xl hover:shadow-slate-200/40 transition-all duration-500 flex flex-col group"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="p-3 bg-brand-50 text-brand-600 rounded-xl group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    {tech.category}
                  </span>
                </div>
                
                <div className="space-y-3 flex-1">
                  <h3 className="text-lg font-black text-slate-900 tracking-tight">{tech.title}</h3>
                  <p className="text-slate-500 text-xs font-medium leading-relaxed">
                    {tech.desc}
                  </p>
                </div>

                <div className="mt-6 pt-6 border-t border-slate-50 flex flex-wrap gap-2">
                  {tech.features.slice(0, 2).map((feature, fIdx) => (
                    <span 
                      key={fIdx}
                      className="px-2 py-1 bg-brand-50/50 text-brand-600 rounded-md text-[9px] font-black uppercase tracking-widest"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </section>
      </div>

      {/* Action Footer */}
      <section className="bg-slate-900 p-12 md:p-20 rounded-[3rem] text-white shadow-2xl relative overflow-hidden text-center space-y-8">
        <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-brand-600/10 rounded-full -mr-32 -mt-32 blur-[100px]" />
        
        <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-tight relative z-10">
          Ready to dive <br className="hidden md:block" /> 
          into the <span className="text-brand-400">Full Console?</span>
        </h2>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto font-medium relative z-10">
          Get advanced metrics, detailed congestion maps, and full AI predictive 
          analysis in our specialized operator dashboard.
        </p>
        <div className="flex justify-center relative z-10">
          <a 
            href="/dashboard" 
            className="group flex items-center gap-3 px-10 py-5 bg-brand-600 text-white rounded-2xl font-black text-sm tracking-widest hover:bg-white hover:text-slate-900 transition-all shadow-2xl shadow-brand-500/20"
          >
            LAUNCH OPERATOR DASHBOARD
            <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
          </a>
        </div>
      </section>
    </div>
  );
}
