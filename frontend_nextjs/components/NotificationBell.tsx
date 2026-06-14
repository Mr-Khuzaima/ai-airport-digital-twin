"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Bell, X, AlertTriangle, Activity, Zap, Info } from 'lucide-react';
import { useSimulation } from '@/context/SimulationContext';
import { motion, AnimatePresence } from 'framer-motion';

const NotificationBell = () => {
  const { alerts, markAlertAsRead, clearAlerts } = useSimulation();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const unreadCount = alerts.filter(a => !a.read).length;

  // Robust Click-Outside Logic
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleClearAll = () => {
    clearAlerts();
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={containerRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-3 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-all relative group z-50"
      >
        <Bell className="w-5 h-5 text-slate-600 group-hover:text-brand-600 transition-colors" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white animate-bounce">
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-4 w-96 bg-white border border-slate-100 rounded-[2.5rem] shadow-2xl z-[9999] overflow-hidden"
          >
            <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
              <h3 className="font-black text-slate-900 tracking-tight">AI Advisor Insights</h3>
              <button 
                onClick={handleClearAll} 
                className="text-[10px] font-black text-brand-600 uppercase tracking-widest hover:underline"
              >
                Clear All
              </button>
            </div>

            <div className="max-h-[400px] overflow-y-auto p-4 space-y-3">
              {alerts.length === 0 ? (
                <div className="py-12 text-center space-y-3">
                  <Activity className="w-8 h-8 text-slate-200 mx-auto" />
                  <p className="text-slate-400 text-xs font-medium tracking-tight">Systems normal. No alerts detected.</p>
                </div>
              ) : (
                alerts.map((alert) => (
                  <div 
                    key={alert.id}
                    onClick={() => markAlertAsRead(alert.id)}
                    className={`p-5 rounded-3xl border transition-all cursor-pointer ${
                      alert.read ? 'bg-white border-slate-100 opacity-60' : 'bg-brand-50/30 border-brand-100 shadow-sm'
                    }`}
                  >
                    <div className="flex gap-4">
                      <div className={`p-2 rounded-xl shrink-0 ${
                        alert.type === 'risk' ? 'bg-red-100 text-red-600' : 
                        alert.type === 'bottleneck' ? 'bg-orange-100 text-orange-600' : 'bg-brand-100 text-brand-600'
                      }`}>
                        {alert.type === 'risk' ? <AlertTriangle className="w-4 h-4" /> : <Zap className="w-4 h-4" />}
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-black text-sm text-slate-900 tracking-tight">{alert.title}</h4>
                        <p className="text-slate-500 text-[11px] leading-relaxed">{alert.message}</p>
                        <div className="mt-3 p-3 bg-white rounded-xl border border-slate-100">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.05em] mb-1">AI Suggestion</p>
                          <p className="text-[11px] font-black text-brand-600 leading-snug">{alert.suggestion}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBell;
