import React from 'react';

interface SliderProps {
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (val: number) => void;
  suffix?: string;
}

const ControlSliders: React.FC<{
  params: any;
  setParams: (params: any) => void;
}> = ({ params, setParams }) => {
  const sliders = [
    { key: 'increase_flights_percent', label: 'Flight Traffic Increase', min: 0, max: 100, step: 5, suffix: '%' },
    { key: 'security_counters', label: 'Active Security Lanes', min: 1, max: 20, step: 1, suffix: '' },
    { key: 'delay_offset_minutes', label: 'Injected Delay Offset', min: 0, max: 60, step: 5, suffix: 'm' },
    { key: 'checkin_counters', label: 'Check-in Counters', min: 1, max: 30, step: 1, suffix: '' },
  ];

  const handleChange = (key: string, value: number) => {
    setParams({ ...params, [key]: value });
  };

  return (
    <div className="space-y-10">
      {sliders.map((s) => (
        <div key={s.key} className="space-y-4 group">
          <div className="flex justify-between items-end">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-brand-600 transition-colors">
              {s.label}
            </label>
            <span className="text-xl font-black text-slate-900 font-mono tracking-tighter">
              {params[s.key]}<span className="text-brand-500 ml-0.5">{s.suffix}</span>
            </span>
          </div>
          <div className="relative flex items-center">
            <input
              type="range"
              min={s.min}
              max={s.max}
              step={s.step}
              value={params[s.key]}
              onChange={(e) => handleChange(s.key, parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-100 rounded-full appearance-none cursor-pointer accent-brand-600"
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ControlSliders;
