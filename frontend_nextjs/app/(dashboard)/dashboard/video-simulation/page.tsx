"use client";

import React, { useState, useEffect } from 'react';
import { 
  Plane, 
  Play, 
  Pause, 
  Video, 
  Radio, 
  Layers, 
  Scan, 
  User, 
  Shield, 
  Navigation,
  DoorOpen,
  Fingerprint,
  CheckCircle2,
  AlertCircle,
  Wind,
  Clock,
  Smile // Added missing import
} from 'lucide-react';
import { useSimulation } from '@/context/SimulationContext';

const VideoSimulation = () => {
  const { metrics, isPlaying, setIsPlaying, hasMounted } = useSimulation();
  const [activeCam, setActiveCam] = useState('Apron North');
  const [entityPos, setEntityPos] = useState(0);
  const [scanStatus, setScanStatus] = useState('READY');

  useEffect(() => {
    if (!hasMounted || !isPlaying) return;
    const timer = setInterval(() => {
      setEntityPos(prev => (prev + 1) % 100);
      const statuses = ['SCANNING', 'IDENTIFIED', 'CLEAR', 'READY'];
      setScanStatus(statuses[Math.floor(Math.random() * statuses.length)]);
    }, 1000);
    return () => clearInterval(timer);
  }, [hasMounted, isPlaying]);

  if (!hasMounted) return null;

  return (
    <div className="p-10 space-y-8 bg-slate-950 min-h-screen text-slate-100 font-sans selection:bg-blue-500/30">
      <header className="flex justify-between items-center bg-slate-900/50 p-6 rounded-[2.5rem] border border-white/5 backdrop-blur-3xl shadow-2xl">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-blue-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-500/20 ring-1 ring-white/20">
            <Video className="text-white w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2 text-blue-400 font-black text-[10px] uppercase tracking-[0.3em] mb-1">
              <Radio className="w-3 h-3 animate-pulse" /> Live Optical Feed
            </div>
            <h1 className="text-3xl font-black tracking-tighter">Cinematic Digital Twin</h1>
          </div>
        </div>

        <div className="flex gap-2 bg-black/40 p-2 rounded-2xl border border-white/5">
          {['Apron North', 'Security G-1', 'Terminal Main'].map(cam => (
            <button 
              key={cam}
              onClick={() => setActiveCam(cam)}
              className={`px-6 py-3 rounded-xl text-xs font-black transition-all duration-500 ${activeCam === cam ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.3)] scale-105' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
            >
              {cam}
            </button>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        <div className="xl:col-span-3 relative aspect-video bg-black rounded-[3.5rem] overflow-hidden border-8 border-slate-900 shadow-[0_0_150px_rgba(0,0,0,0.7)] group">
          
          {activeCam === 'Apron North' && (
            <div className="absolute inset-0 bg-[#0f172a] flex items-center justify-center overflow-hidden">
               <div className="absolute w-[200%] h-32 bg-slate-800/50 rotate-[-15deg] flex items-center justify-around px-20 border-y-8 border-slate-700/30">
                  {[...Array(30)].map((_, i) => (
                    <div key={i} className="w-16 h-1 bg-white/10 rounded-full" />
                  ))}
               </div>
               <div className="absolute transition-all duration-1000 ease-linear flex flex-col items-center" 
                    style={{ left: `${entityPos}%`, top: '40%', transform: `scale(${0.8 + (entityPos/200)}) rotate(${entityPos > 50 ? '-10deg' : '0deg'})` }}>
                  <div className="relative">
                    <Plane className="w-32 h-32 text-white fill-blue-600/30 drop-shadow-[0_0_30px_rgba(59,130,246,0.6)]" />
                    <div className="absolute -top-14 left-1/2 -translate-x-1/2 bg-blue-600/90 backdrop-blur-md px-4 py-2 rounded-2xl text-[10px] font-black whitespace-nowrap border border-white/20 shadow-2xl">
                      AI-102 | RWY_04 | {entityPos > 80 ? 'TAKEOFF' : 'TAXIING'}
                    </div>
                  </div>
               </div>
            </div>
          )}

          {activeCam === 'Security G-1' && (
            <div className="absolute inset-0 bg-[#1e293b] flex flex-col items-center justify-center p-20 overflow-hidden">
               <div className="flex gap-16 mb-20 relative z-10">
                 {[1, 2, 3].map(i => (
                   <div key={i} className="w-40 h-24 bg-slate-900/80 backdrop-blur-md rounded-3xl border-t-4 border-indigo-500 flex flex-col items-center justify-center gap-3 shadow-2xl">
                      <Shield className="w-8 h-8 text-indigo-400" />
                      <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">STATION_{i}</div>
                   </div>
                 ))}
               </div>
               <div className="flex gap-16 relative w-full justify-center">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="flex flex-col items-center gap-3">
                      <div className="w-14 h-14 bg-white/10 rounded-[1.5rem] border border-white/20 flex items-center justify-center relative">
                        <User className="w-7 h-7 text-blue-400" />
                        <Fingerprint className="absolute -top-2 -right-2 w-6 h-6 text-indigo-400 animate-pulse bg-slate-900 rounded-full p-1" />
                      </div>
                    </div>
                  ))}
               </div>
            </div>
          )}

          {activeCam === 'Terminal Main' && (
             <div className="absolute inset-0 bg-slate-900 flex items-center justify-center">
                <div className="grid grid-cols-4 gap-8 p-12 w-full max-w-6xl">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="group relative bg-slate-800/50 p-8 rounded-[2rem] border border-white/5 flex flex-col items-center justify-center gap-6 shadow-sm hover:bg-slate-800 transition-all">
                       <DoorOpen className={`w-14 h-14 ${i % 3 === 0 ? 'text-blue-500' : 'text-slate-700'}`} />
                       <div className="flex -space-x-3">
                          {[...Array(3)].map((_, j) => (
                            <div key={j} className="w-8 h-8 rounded-full bg-slate-900 border-2 border-slate-800 flex items-center justify-center shadow-lg">
                               <User className="w-4 h-4 text-blue-400" />
                            </div>
                          ))}
                       </div>
                    </div>
                  ))}
                </div>
             </div>
          )}

          <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-12">
            <div className="flex justify-between items-start">
              <div className="bg-red-600 text-white px-4 py-1.5 rounded-lg text-[10px] font-black flex items-center gap-3">
                <div className="w-2 h-2 bg-white rounded-full animate-ping" /> REC: MASTER_TWIN_01
              </div>
              <div className="font-mono text-right text-xs text-blue-400">
                <p>SYNC_LATENCY: 0.02ms</p>
                <p>COORD: {metrics.timestamp}</p>
              </div>
            </div>

            <div className="flex items-end justify-between">
              <div className="bg-slate-950/80 backdrop-blur-3xl border border-white/10 p-8 rounded-[3rem] shadow-2xl min-w-[320px]">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-3">Sector Metadata</p>
                <p className="text-4xl font-black text-white tracking-tighter mb-1 uppercase leading-none">{activeCam}</p>
                <p className="text-[10px] font-bold text-blue-400/80">FEED STABILIZED | AI_ENHANCED</p>
              </div>
              <div className="flex gap-4 pointer-events-auto">
                <button 
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-24 h-24 bg-white text-black rounded-[2.5rem] flex items-center justify-center hover:scale-110 transition-all active:scale-95 shadow-2xl"
                >
                  {isPlaying ? <Pause className="w-10 h-10 fill-black" /> : <Play className="w-10 h-10 fill-black ml-1" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="xl:col-span-1 h-full">
          <div className="bg-slate-900/50 backdrop-blur-2xl rounded-[3.5rem] p-10 border border-white/5 shadow-2xl h-full flex flex-col">
            <h3 className="text-2xl font-black mb-10 flex items-center gap-4">
              <Layers className="w-6 h-6 text-blue-500" /> Telemetry
            </h3>
            <div className="flex-1 space-y-10">
              {[
                { label: 'Latency', val: `${metrics.latency}m`, icon: Clock, color: 'text-blue-400' },
                { label: 'Satisfaction', val: `${metrics.satisfaction}%`, icon: Smile, color: 'text-emerald-400' },
                { label: 'Fleet', val: metrics.activeFleet, icon: Plane, color: 'text-indigo-400' },
                { label: 'Process Flow', val: 'STABLE', icon: Navigation, color: 'text-orange-400' },
              ].map(item => (
                <div key={item.label} className="group flex items-center gap-6">
                  <div className={`p-5 rounded-3xl bg-white/5 border border-white/5 group-hover:scale-110 transition-transform ${item.color}`}>
                    <item.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{item.label}</p>
                    <p className="text-2xl font-black text-white tracking-tight">{item.val}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoSimulation;
