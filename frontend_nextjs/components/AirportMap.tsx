"use client";

import React, { useEffect, useState, useRef } from 'react';
import { 
  Plane, 
  Users, 
  ShieldCheck, 
  DoorOpen, 
  UserCheck, 
  Fingerprint, 
  Send,
  CloudLightning
} from 'lucide-react';

interface AirportMapProps {
  activeStage: number;
  type: 'international' | 'domestic';
  isFlying: boolean;
}

const AirportMap: React.FC<AirportMapProps> = ({ activeStage, type, isFlying }) => {
  const stages = [
    { id: 0, label: 'Arrival', icon: Plane, color: 'text-blue-500', bg: 'bg-blue-50' },
    { id: 1, label: 'Check-In', icon: Users, color: 'text-orange-500', bg: 'bg-orange-50' },
    { id: 2, label: 'Security', icon: ShieldCheck, color: 'text-purple-500', bg: 'bg-purple-50' },
    { id: 3, label: 'Facial Scan', icon: Fingerprint, color: 'text-indigo-500', bg: 'bg-indigo-50' },
    { id: 4, label: 'Immigration', icon: UserCheck, color: 'text-pink-500', bg: 'bg-pink-50', hidden: type === 'domestic' },
    { id: 5, label: 'Boarding', icon: DoorOpen, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  ].filter(s => !s.hidden);

  return (
    <div className="bg-white p-10 rounded-[3rem] shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden h-[500px] flex flex-col justify-center">
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#2563eb 1px, transparent 0)', backgroundSize: '40px 40px' }} />

      {/* Plane Takeoff Animation Layer */}
      <div className={`absolute top-20 left-0 w-full transition-all duration-[3000ms] ease-in-out pointer-events-none ${isFlying ? 'translate-x-[1500px] -translate-y-[500px] opacity-0 scale-150' : 'translate-x-[-200px] opacity-0'}`}>
        <Plane className="w-24 h-24 text-blue-600 fill-blue-100 rotate-[-15deg]" />
      </div>

      <div className="relative z-10 flex flex-wrap md:flex-row items-center justify-around gap-8">
        {stages.map((stage, idx) => {
          const isActive = activeStage === idx;
          const isCompleted = activeStage > idx;
          const Icon = stage.icon;
          
          return (
            <div key={stage.id} className="flex flex-col items-center gap-6 group">
              <div className={`
                w-24 h-24 rounded-[2rem] flex items-center justify-center transition-all duration-700 relative
                ${isActive ? `${stage.bg} scale-125 shadow-2xl ring-8 ring-offset-4 ring-${stage.color.split('-')[1]}-100` : 'bg-white border border-slate-100 shadow-sm'}
                ${isCompleted ? 'bg-emerald-50 border-emerald-100' : ''}
              `}>
                <Icon className={`w-10 h-10 transition-colors duration-500 ${isActive ? stage.color : isCompleted ? 'text-emerald-500' : 'text-slate-300'}`} />
                
                {/* Active Indicator */}
                {isActive && (
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-3 py-1.5 rounded-full font-black animate-bounce shadow-xl whitespace-nowrap">
                    PROCESSING AGENTS
                  </div>
                )}
              </div>
              <div className="text-center space-y-1">
                <span className={`text-xs font-black uppercase tracking-widest ${isActive ? 'text-slate-900' : 'text-slate-400'}`}>
                  {stage.label}
                </span>
                <p className="text-[10px] text-slate-400 font-bold tracking-tighter">
                  {type.toUpperCase()} NODE
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Simulation Info Footer */}
      <div className="absolute bottom-8 left-10 right-10 flex justify-between items-end">
        <div className="flex gap-4">
          <div className="px-4 py-2 bg-slate-50 rounded-2xl border border-slate-100">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Gate</p>
            <p className="text-sm font-black text-slate-900">{type === 'international' ? 'GATE I-04' : 'GATE D-12'}</p>
          </div>
          <div className="px-4 py-2 bg-slate-50 rounded-2xl border border-slate-100">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Current Status</p>
            <p className="text-sm font-black text-blue-600">{isFlying ? 'TAKEOFF' : 'PROCESSING'}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-slate-400 font-bold text-[10px]">
          <CloudLightning className="w-3 h-3 text-blue-500 animate-pulse" /> ENGINE SYNCHRONIZED
        </div>
      </div>
    </div>
  );
};

export default AirportMap;
