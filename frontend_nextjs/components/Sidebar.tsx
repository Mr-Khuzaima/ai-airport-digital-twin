"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Activity, 
  Settings2, 
  PlaneTakeoff, 
  MonitorPlay,
  Info,
  X
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname();

  const menuItems = [
    { name: 'Overview', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Simulation', path: '/dashboard/simulation', icon: Activity },
    { name: 'What-If Planner', path: '/dashboard/what-if', icon: Settings2 },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={cn(
          "fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed left-0 top-0 h-screen bg-white border-r border-slate-100 flex flex-col z-50 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:w-72",
          isOpen ? "translate-x-0 w-72" : "-translate-x-full"
        )}
      >
        <div className="p-8 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center shadow-lg shadow-brand-200 group-hover:scale-105 transition-transform duration-200">
              <PlaneTakeoff className="text-white w-6 h-6" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-slate-900">AeroTwin</span>
          </Link>
          <button 
            onClick={onClose}
            className="lg:hidden p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-1.5 mt-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => { if (window.innerWidth < 1024) onClose(); }}
                className={cn(
                  "flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-200 group font-medium text-sm",
                  isActive 
                    ? "bg-brand-50 text-brand-600 shadow-sm shadow-brand-100/50" 
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <Icon className={cn(
                  "w-5 h-5 transition-colors",
                  isActive ? "text-brand-600" : "text-slate-400 group-hover:text-slate-600"
                )} />
                <span>{item.name}</span>
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 bg-brand-600 rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 mt-auto">
          <div className="bg-slate-900 rounded-2xl p-6 text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-brand-500/20 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-110" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 bg-white/10 rounded-xl">
                  <Info className="w-4 h-4 text-brand-400" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">System Status</span>
              </div>
              <p className="text-sm font-bold flex items-center gap-2 mb-1">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                AI Core Online
              </p>
              <p className="text-[10px] text-slate-400 font-medium">Predictive engine active on Node-7</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
