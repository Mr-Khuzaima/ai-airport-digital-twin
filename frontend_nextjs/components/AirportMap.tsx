"use client";

import React from 'react';
import { 
  Plane, 
  Users, 
  ShieldCheck, 
  DoorOpen, 
  UserCheck, 
  Fingerprint, 
  CloudLightning
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface AirportMapProps {
  activeStage: number;
  type: 'international' | 'domestic';
  isFlying: boolean;
}

const AirportMap: React.FC<AirportMapProps> = ({ activeStage, type, isFlying }) => {
  const stages = [
    { id: 0, label: 'Arrival', icon: Plane, color: 'text-brand-500', bg: 'bg-brand-50' },
    { id: 1, label: 'Check-In', icon: Users, color: 'text-amber-500', bg: 'bg-amber-50' },
    { id: 2, label: 'Security', icon: ShieldCheck, color: 'text-violet-500', bg: 'bg-violet-50' },
    { id: 3, label: 'Bio Scan', icon: Fingerprint, color: 'text-indigo-500', bg: 'bg-indigo-50' },
    { id: 4, label: 'Immigration', icon: UserCheck, color: 'text-rose-500', bg: 'bg-rose-50', hidden: type === 'domestic' },
    { id: 5, label: 'Boarding', icon: DoorOpen, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  ].filter(s => !s.hidden);

  return (
    <div className="bg-white p-12 md:p-16 rounded-2xl shadow-sm border border-slate-100/60 relative overflow-hidden h-[550px] flex flex-col justify-center group/map transition-all duration-700 hover:shadow-2xl hover:shadow-slate-200/50">
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#8b5cf6 1px, transparent 0)', backgroundSize: '48px 48px' }} />

      {/* Plane Animation Layer */}
      <div className={cn(
        "absolute top-24 left-0 w-full transition-all duration-[4000ms] ease-in-out pointer-events-none z-20",
        isFlying ? 'translate-x-[1800px] -translate-y-[600px] opacity-0 scale-[2]' : 'translate-x-[-300px] opacity-0'
      )}>
        <Plane className="w-32 h-32 text-brand-600 fill-brand-100 rotate-[-20deg] drop-shadow-2xl" />
      </div>

      <div className="relative z-10 flex flex-wrap md:flex-row items-center justify-around gap-12">
        {stages.map((stage, idx) => {
          const isActive = activeStage === idx;
          const isCompleted = activeStage > idx;
          const Icon = stage.icon;
          
          return (
            <div key={stage.id} className="flex flex-col items-center gap-8 group/stage">
              <div className={cn(
                "w-28 h-28 rounded-[2.5rem] flex items-center justify-center transition-all duration-1000 relative",
                isActive ? cn(stage.bg, "scale-125 shadow-2xl ring-[12px] ring-offset-4 ring-brand-50") : "bg-white border border-slate-100 shadow-sm hover:border-brand-200",
                isCompleted ? "bg-emerald-50 border-emerald-100 scale-90" : ""
              )}>
                <Icon className={cn(
                  "w-12 h-12 transition-all duration-700",
                  isActive ? stage.color : isCompleted ? "text-emerald-500" : "text-slate-200 group-hover/stage:text-slate-400"
                )} />
                
                {/* Active Indicator */}
                {isActive && (
                  <div className="absolute -top-16 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-4 py-2 rounded-2xl font-black animate-bounce shadow-2xl whitespace-nowrap tracking-widest border border-slate-800">
                    SYNCING AGENTS
                  </div>
                )}

                {isCompleted && (
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white border-4 border-white shadow-lg animate-in zoom-in duration-500">
                    <CloudLightning className="w-4 h-4" />
                  </div>
                )}
              </div>
              <div className="text-center space-y-2">
                <span className={cn(
                  "text-xs font-black uppercase tracking-[0.2em] transition-colors duration-500",
                  isActive ? "text-slate-900" : "text-slate-400"
                )}>
                  {stage.label}
                </span>
                <p className="text-[10px] text-slate-400 font-black tracking-widest opacity-60">
                  {type.toUpperCase()} NODE
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Simulation Info Footer */}
      <div className="absolute bottom-10 left-12 right-12 flex flex-col sm:flex-row justify-between items-center gap-6">
        <div className="flex gap-6">
          <div className="px-6 py-3 bg-slate-50 rounded-[1.5rem] border border-slate-100 shadow-sm">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Active Gateway</p>
            <p className="text-base font-black text-slate-900">{type === 'international' ? 'HUB-ALPHA' : 'NODE-LOCAL'}</p>
          </div>
          <div className="px-6 py-3 bg-slate-50 rounded-[1.5rem] border border-slate-100 shadow-sm">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">State Vector</p>
            <p className={cn("text-base font-black", isFlying ? "text-brand-600" : "text-emerald-600")}>
              {isFlying ? 'TRANSIT' : 'OPTIMIZING'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 px-6 py-3 bg-slate-900 rounded-[1.5rem] text-slate-400 font-black text-[10px] tracking-widest border border-slate-800 shadow-2xl">
          <CloudLightning className="w-4 h-4 text-brand-500 animate-pulse" /> 
          NEURAL CORE SYNCHRONIZED
        </div>
      </div>
    </div>
  );
};

export default AirportMap;
