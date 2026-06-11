"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PlaneTakeoff, Github, LayoutDashboard, Menu, X } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Overview', href: '/overview' },
    { name: 'Simulation', href: '/simulation' },
    { name: 'Models', href: '/models' },
    { name: 'Graphs & Stats', href: '/graphs-stats' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 selection:bg-brand-100 selection:text-brand-900">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/70 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-brand-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-brand-200 group-hover:scale-105 transition-transform duration-200">
              <PlaneTakeoff className="w-6 h-6" />
            </div>
            <span className="font-black text-2xl tracking-tight text-slate-900">
              AeroTwin
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200",
                    isActive
                      ? "bg-brand-50 text-brand-600"
                      : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                  )}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Action Button & Mobile Toggle */}
          <div className="flex items-center gap-4">
            <Link
              href="/simulation#live-metrics"
              className="hidden sm:flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl text-sm font-bold shadow-2xl shadow-slate-200 hover:bg-brand-600 hover:shadow-brand-100 hover:-translate-y-0.5 transition-all duration-300"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>View Metrics</span>
            </Link>
...            
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2.5 bg-slate-50 text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={cn(
          "md:hidden absolute top-full left-0 w-full bg-white border-b border-slate-100 px-6 py-8 space-y-4 transition-all duration-300 origin-top shadow-2xl shadow-slate-200/50",
          isMenuOpen ? "scale-y-100 opacity-100" : "scale-y-0 opacity-0 pointer-events-none"
        )}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMenuOpen(false)}
              className={cn(
                "block px-6 py-4 rounded-2xl text-base font-bold transition-colors",
                pathname === link.href ? "bg-brand-50 text-brand-600" : "text-slate-600 hover:bg-slate-50"
              )}
            >
              {link.name}
            </Link>
          ))}
          <Link
            href="/simulation#live-metrics"
            onClick={() => setIsMenuOpen(false)}
            className="flex items-center justify-center gap-2 w-full py-4 bg-brand-600 text-white rounded-2xl text-base font-bold shadow-xl shadow-brand-100"
          >
            <LayoutDashboard className="w-5 h-5" />
            View Live Metrics
          </Link>
        </div>
      </header>

      {/* Main Page Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-12 md:py-20">
        {children}
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-100 bg-white py-16">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-slate-900 rounded-xl flex items-center justify-center text-white">
              <PlaneTakeoff className="w-5 h-5" />
            </div>
            <span className="font-black text-xl text-slate-900">AeroTwin</span>
          </div>
          
          <p className="text-slate-400 text-sm font-medium">
            © {new Date().getFullYear()} AeroTwin Digital Twin. Built for Aviation Excellence.
          </p>

          <div className="flex items-center gap-6">
            <a href="#" className="p-2 text-slate-400 hover:text-brand-600 transition-colors">
              <Github className="w-6 h-6" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
