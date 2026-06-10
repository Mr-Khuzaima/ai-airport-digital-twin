import React from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  Cpu, 
  Activity, 
  TrendingUp, 
  Gauge,
  CheckCircle,
  Database,
  BarChart2,
  Sparkles
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="space-y-24 md:space-y-32 pb-20 animate-in fade-in duration-1000">
      {/* Hero Section */}
      <section className="relative rounded-[3.5rem] overflow-hidden bg-slate-950 px-6 py-20 md:py-32 text-white border border-slate-800 shadow-3xl">
        {/* Animated glowing backgrounds */}
        <div className="absolute top-0 right-0 w-[50rem] h-[50rem] bg-brand-600/20 rounded-full -mr-48 -mt-48 blur-[150px] pointer-events-none animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[40rem] h-[40rem] bg-indigo-600/10 rounded-full -ml-40 -mb-40 blur-[120px] pointer-events-none animate-pulse delay-700" />
        
        <div className="max-w-5xl mx-auto text-center space-y-10 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-500/10 border border-brand-500/20 text-brand-300 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
            <Sparkles className="w-3.5 h-3.5" />
            Neural-Engine Driven Digital Twin
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.95] bg-gradient-to-b from-white via-slate-100 to-slate-500 bg-clip-text text-transparent">
            Simulate. Predict. <br className="hidden md:block" />
            <span className="text-brand-500">Optimize.</span>
          </h1>
          
          <p className="text-lg md:text-2xl text-slate-400 font-medium max-w-3xl mx-auto leading-relaxed">
            Harnessing <span className="text-slate-200 font-bold">SimPy</span> event modeling with <span className="text-slate-200 font-bold">LSTM</span> & <span className="text-slate-200 font-bold">XGBoost</span> to resolve real-world aviation bottlenecks before they happen.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8">
            <Link
              href="/dashboard"
              className="group w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-5 bg-brand-600 hover:bg-brand-500 text-white rounded-[2rem] text-lg font-black shadow-2xl shadow-brand-500/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-brand-500/40"
            >
              Launch Console
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/overview"
              className="w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-5 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-[2rem] text-lg font-bold backdrop-blur-md transition-all duration-300"
            >
              Architecture
            </Link>
          </div>
        </div>
      </section>

      {/* Core Pillars */}
      <section className="space-y-16">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            N-Tier Intelligent Core
          </h2>
          <p className="text-slate-500 text-lg font-medium">
            A multi-layered synchronization of data streams, neural networks, and event-driven kernels.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {/* Card 1 */}
          <div className="group bg-white border border-slate-100 p-10 rounded-[3rem] shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 hover:-translate-y-2 transition-all duration-500">
            <div className="w-16 h-16 bg-brand-50 rounded-[1.5rem] flex items-center justify-center text-brand-600 mb-8 group-hover:scale-110 transition-transform duration-500">
              <Activity className="w-8 h-8" />
            </div>
            <h3 className="font-black text-2xl text-slate-900 mb-4 tracking-tight">SimPy Engine</h3>
            <p className="text-slate-500 font-medium leading-relaxed">
              Granular event-driven kernel modeling aircraft logistics, gate assignments, and passenger queue stochasticity.
            </p>
          </div>

          {/* Card 2 */}
          <div className="group bg-white border border-slate-100 p-10 rounded-[3rem] shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 hover:-translate-y-2 transition-all duration-500">
            <div className="w-16 h-16 bg-brand-50 rounded-[1.5rem] flex items-center justify-center text-brand-600 mb-8 group-hover:scale-110 transition-transform duration-500">
              <Gauge className="w-8 h-8" />
            </div>
            <h3 className="font-black text-2xl text-slate-900 mb-4 tracking-tight">XGBoost Predictors</h3>
            <p className="text-slate-500 font-medium leading-relaxed">
              Real-time delay regression and satisfaction classification trained on millions of historical flight records.
            </p>
          </div>

          {/* Card 3 */}
          <div className="group bg-white border border-slate-100 p-10 rounded-[3rem] shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 hover:-translate-y-2 transition-all duration-500">
            <div className="w-16 h-16 bg-brand-50 rounded-[1.5rem] flex items-center justify-center text-brand-600 mb-8 group-hover:scale-110 transition-transform duration-500">
              <TrendingUp className="w-8 h-8" />
            </div>
            <h3 className="font-black text-2xl text-slate-900 mb-4 tracking-tight">LSTM Forecasts</h3>
            <p className="text-slate-500 font-medium leading-relaxed">
              Recurrent neural networks forecasting passenger load trends with high-confidence intervals for strategic planning.
            </p>
          </div>
        </div>
      </section>

      {/* Feature Highlight list */}
      <section className="bg-slate-50 border border-slate-100 rounded-[4rem] p-8 md:p-20 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        <div className="space-y-12">
          <div className="space-y-6">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              Execute Complex <br />
              <span className="text-brand-600">What-If Scenarios</span>
            </h2>
            <p className="text-slate-500 text-lg font-medium leading-relaxed">
              Stress-test your airport infrastructure in a sandboxed environment. Observe system resilience under extreme conditions without risk.
            </p>
          </div>

          <div className="space-y-6">
            {[
              { title: "Staff Scaling", desc: "Instantly adjust security and check-in desk capacity." },
              { title: "Load Testing", desc: "Simulate peak holiday traffic with 2x-5x volume multipliers." },
              { title: "Weather Disruptions", desc: "Inject synthetic delays to model system recovery time." }
            ].map((feature, i) => (
              <div key={i} className="flex items-start gap-5">
                <div className="p-1.5 bg-emerald-500 rounded-lg text-white mt-1 shadow-lg shadow-emerald-100">
                  <CheckCircle className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-black text-slate-900 text-lg">{feature.title}</h4>
                  <p className="text-slate-500 font-medium">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-slate-100 p-10 md:p-14 rounded-[3.5rem] shadow-2xl shadow-slate-200/40 space-y-10 relative overflow-hidden group">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-brand-50 rounded-full blur-3xl group-hover:bg-brand-100 transition-colors" />
          
          <div className="flex items-center gap-4 relative z-10">
            <div className="p-4 bg-slate-900 text-white rounded-[1.2rem] shadow-xl">
              <Database className="w-6 h-6" />
            </div>
            <span className="font-black text-xl text-slate-900 tracking-tight">Real-Time Engine</span>
          </div>

          <div className="space-y-6 pt-4 relative z-10">
            {[
              { label: "Backend Core", status: "STABLE", color: "bg-emerald-500" },
              { label: "Inference Node", status: "ACTIVE", color: "bg-emerald-500" },
              { label: "Sim Runner", status: "READY", color: "bg-brand-500" }
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between border-b border-slate-50 pb-4">
                <span className="text-slate-500 font-bold">{item.label}</span>
                <span className="inline-flex items-center gap-2 px-3 py-1 bg-slate-50 border border-slate-100 text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest">
                  <span className={cn("w-1.5 h-1.5 rounded-full animate-pulse", item.color)} />
                  {item.status}
                </span>
              </div>
            ))}
          </div>

          <Link
            href="/dashboard"
            className="flex items-center justify-center gap-3 w-full py-5 bg-slate-900 hover:bg-brand-600 text-white font-black rounded-[1.5rem] transition-all duration-300 text-base shadow-2xl shadow-slate-200 hover:shadow-brand-100 relative z-10"
          >
            Access Controller
            <BarChart2 className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
