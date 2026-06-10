import React from 'react';
import { LucideIcon } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface MetricsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendColor?: string;
  description?: string;
  variant?: 'brand' | 'slate' | 'emerald';
}

const MetricsCard: React.FC<MetricsCardProps> = ({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  trendColor, 
  description,
  variant = 'brand'
}) => {
  const variants = {
    brand: 'bg-brand-50 text-brand-600',
    slate: 'bg-slate-100 text-slate-600',
    emerald: 'bg-emerald-50 text-emerald-600',
  };

  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100/60 hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1 transition-all duration-300 group">
      <div className="flex items-center justify-between mb-4">
        <div className={cn("p-2 rounded-lg transition-colors duration-300", variants[variant])}>
          <Icon className="w-5 h-5" />
        </div>
        {trend && (
          <span className={cn(
            "text-[10px] font-black px-2 py-0.5 rounded-lg tracking-wider",
            trendColor || "bg-emerald-50 text-emerald-600"
          )}>
            {trend}
          </span>
        )}
      </div>
      
      <div className="space-y-0.5">
        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{title}</p>
        <h3 className="text-2xl font-black text-slate-900 tracking-tight group-hover:text-brand-600 transition-colors">
          {value}
        </h3>
      </div>
      
      {description && (
        <p className="text-[11px] text-slate-400 font-medium mt-3 pt-3 border-t border-slate-50">
          {description}
        </p>
      )}
    </div>
  );
};

export default MetricsCard;
