"use client";

import React, { useState } from 'react';
import Sidebar from "@/components/Sidebar";
import { Menu, PlaneTakeoff } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col min-w-0 lg:ml-72">
        {/* Mobile Header */}
        <header className="lg:hidden sticky top-0 z-30 flex items-center justify-between px-6 h-16 bg-white/80 backdrop-blur-md border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
              <PlaneTakeoff className="text-white w-5 h-5" />
            </div>
            <span className="font-bold text-lg text-slate-900">AeroTwin</span>
          </div>
          <button 
            onClick={() => setSidebarOpen(true)}
            className="p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
        </header>

        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
