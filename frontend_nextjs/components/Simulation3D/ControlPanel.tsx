"use client";

import React, { useState } from 'react';
import { Sliders, Zap, Play, RotateCcw } from 'lucide-react';
import { useSimulation } from '@/context/SimulationContext';

const ControlPanel = () => {
  const { runScenario, isResetting, simParams } = useSimulation();
  
  const [localParams, setLocalParams] = useState({
    increase_flights_percent: simParams.increase_flights_percent,
    security_counters: simParams.security_counters,
    checkin_counters: simParams.checkin_counters || 10,
    delay_offset_minutes: simParams.delay_offset_minutes,
    weather_severity: simParams.weather_severity || 0,
    time_of_day: simParams.time_of_day || 12,
  });

  const handleUpdate = (key: string, val: any) => {
    setLocalParams(prev => ({ ...prev, [key]: val }));
  };

  const formatTime = (hour: number) => {
    const h = hour % 12 || 12;
    const ampm = hour < 12 ? 'AM' : 'PM';
    return `${h}:00 ${ampm}`;
  };

  const handleExecute = () => {
    runScenario(localParams);
  };

  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-8">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-brand-50 text-brand-600 rounded-xl">
          <Sliders className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-xl font-black text-slate-900 tracking-tight">Scenario Engine</h3>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Real-time Parameters</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Time of Day Modes */}
        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Environment Mode</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleUpdate('time_of_day', 12)}
              className={`py-3 px-3 rounded-xl text-[10px] font-bold uppercase tracking-tight transition-all border ${localParams.time_of_day >= 6 && localParams.time_of_day <= 18 ? 'bg-amber-500 text-white border-amber-500 shadow-md scale-[1.02]' : 'bg-white text-slate-400 border-slate-100 hover:border-slate-200'}`}
            >
              Day Mode
            </button>
            <button
              onClick={() => handleUpdate('time_of_day', 0)}
              className={`py-3 px-3 rounded-xl text-[10px] font-bold uppercase tracking-tight transition-all border ${localParams.time_of_day < 6 || localParams.time_of_day > 18 ? 'bg-indigo-950 text-white border-indigo-950 shadow-md scale-[1.02]' : 'bg-white text-slate-400 border-slate-100 hover:border-slate-200'}`}
            >
              Night Mode
            </button>
          </div>
        </div>

        {/* Traffic Load */}
        <div className="space-y-3">
          <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
            <span>Passenger Load</span>
            <span className="text-brand-600">+{localParams.increase_flights_percent}%</span>
          </div>
          <input 
            type="range" 
            min="0" 
            max="100" 
            step="5"
            value={localParams.increase_flights_percent}
            onChange={(e) => handleUpdate('increase_flights_percent', parseInt(e.target.value))}
            className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-brand-600"
          />
        </div>

        {/* Check-In Counters */}
        <div className="space-y-3">
          <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
            <span>Check-In Counters</span>
            <span className="text-brand-600">{localParams.checkin_counters} Active</span>
          </div>
          <input 
            type="range" 
            min="1" 
            max="20" 
            step="1"
            value={localParams.checkin_counters}
            onChange={(e) => handleUpdate('checkin_counters', parseInt(e.target.value))}
            className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-brand-600"
          />
        </div>

        {/* Security Lanes */}
        <div className="space-y-3">
          <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
            <span>Security Lanes</span>
            <span className="text-brand-600">{localParams.security_counters} Active</span>
          </div>
          <input 
            type="range" 
            min="1" 
            max="15" 
            step="1"
            value={localParams.security_counters}
            onChange={(e) => handleUpdate('security_counters', parseInt(e.target.value))}
            className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-brand-600"
          />
        </div>

        {/* Weather Severity */}
        <div className="space-y-3">
          <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
            <span>Weather Severity</span>
            <span className={localParams.weather_severity > 50 ? "text-rose-500" : "text-sky-500"}>
              {localParams.weather_severity > 70 ? "STORM" : localParams.weather_severity > 30 ? "CLOUDY" : "CLEAR"} ({localParams.weather_severity}%)
            </span>
          </div>
          <input 
            type="range" 
            min="0" 
            max="100" 
            step="10"
            value={localParams.weather_severity}
            onChange={(e) => handleUpdate('weather_severity', parseInt(e.target.value))}
            className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-brand-600"
          />
        </div>

        {/* Delay Offset */}
        <div className="space-y-3">
          <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
            <span>Manual Delay</span>
            <span className="text-brand-600">{localParams.delay_offset_minutes}m</span>
          </div>
          <input 
            type="range" 
            min="0" 
            max="120" 
            step="5"
            value={localParams.delay_offset_minutes}
            onChange={(e) => handleUpdate('delay_offset_minutes', parseInt(e.target.value))}
            className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-brand-600"
          />
        </div>
      </div>

      <button
        onClick={handleExecute}
        disabled={isResetting}
        className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all hover:bg-brand-600 hover:-translate-y-1 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3 shadow-xl"
      >
        {isResetting ? <RotateCcw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
        {isResetting ? 'Processing...' : 'Apply Scenario'}
      </button>
    </div>
  );
};

export default ControlPanel;
