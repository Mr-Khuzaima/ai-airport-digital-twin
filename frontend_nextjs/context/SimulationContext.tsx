"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiService } from '@/services/api';

interface SimulationMetrics {
  activeFleet: number;
  latency: number;
  satisfaction: number;
  throughput: number;
  timestamp: string;
  processingSpeed: number;
  activeResources: number;
  eventRate: number;
  simTimeScale: string;
}

interface ChartPoint {
  time: string;
  flow: number;
  delay: number;
}

interface SimulationParams {
  increase_flights_percent: number;
  security_counters: number;
  delay_offset_minutes: number;
}

interface CongestionNode {
  label: string;
  value: number;
  color: string;
}

interface SimulationContextType {
  metrics: SimulationMetrics;
  history: ChartPoint[];
  logs: string[];
  congestion: CongestionNode[];
  activeStage: number;
  simType: 'international' | 'domestic';
  isFlying: boolean;
  isPlaying: boolean;
  isResetting: boolean;
  hasMounted: boolean;
  simParams: SimulationParams;
  setSimType: (type: 'international' | 'domestic') => void;
  setIsPlaying: (playing: boolean) => void;
  resetEnvironment: () => Promise<void>;
  runScenario: (params: any) => Promise<void>;
}

const SimulationContext = createContext<SimulationContextType | undefined>(undefined);

export const SimulationProvider = ({ children }: { children: ReactNode }) => {
  const [hasMounted, setHasMounted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isResetting, setIsResetting] = useState(false);
  const [simType, setSimType] = useState<'international' | 'domestic'>('international');
  const [activeStage, setActiveStage] = useState(0);
  const [isFlying, setIsFlying] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [history, setHistory] = useState<ChartPoint[]>([]);
  const [congestion, setCongestion] = useState<CongestionNode[]>([
    { label: 'Check-In', value: 0, color: 'bg-orange-400' },
    { label: 'Security', value: 0, color: 'bg-blue-500' },
    { label: 'Duty Free', value: 0, color: 'bg-indigo-400' },
    { label: 'Boarding', value: 0, color: 'bg-emerald-400' },
  ]);
  const [simParams, setSimParams] = useState<SimulationParams>({
    increase_flights_percent: 0,
    security_counters: 5,
    delay_offset_minutes: 0
  });

  const [metrics, setMetrics] = useState<SimulationMetrics>({
    activeFleet: 0,
    latency: 0,
    satisfaction: 0,
    throughput: 0,
    timestamp: '',
    processingSpeed: 0,
    activeResources: 0,
    eventRate: 0,
    simTimeScale: '1.0x'
  });

  // 1. Mount detection
  useEffect(() => {
    setHasMounted(true);
    setMetrics(prev => ({ ...prev, timestamp: new Date().toLocaleTimeString() }));
  }, []);

  // 2. Main Simulation Tick (Global Source of Truth)
  useEffect(() => {
    if (!hasMounted || !isPlaying) return;

    const interval = setInterval(() => {
      // Stochastic Metrics influenced by simParams (What-If sync)
      const flightLoadMultiplier = 1 + (simParams.increase_flights_percent / 100);
      const securityCapacity = simParams.security_counters * 10;
      
      const newFleet = Math.floor((15 + Math.random() * 15) * flightLoadMultiplier);
      
      // Latency increases as load exceeds capacity
      const baseLatency = 10 + simParams.delay_offset_minutes;
      const congestionPenalty = Math.max(0, (newFleet - securityCapacity) * 2);
      const newLatency = parseFloat((baseLatency + Math.random() * 10 + congestionPenalty).toFixed(1));
      
      // Satisfaction drops with latency
      const newSat = parseFloat(Math.max(0, Math.min(100, 95 - (newLatency / 2) + Math.random() * 5)).toFixed(1));
      
      const newThroughput = parseFloat((1.2 * (simParams.security_counters / 5) + Math.random() * 0.4).toFixed(1));
      const timeStr = new Date().toLocaleTimeString();

      // Realistic values for simulation tab metrics
      const procSpeed = parseFloat((0.8 + Math.random() * 0.4).toFixed(2));
      const activeRes = Math.floor(20 + simParams.security_counters + Math.random() * 5);
      const eRate = Math.floor(40 + (simParams.increase_flights_percent / 2) + Math.random() * 10);

      setMetrics({
        activeFleet: newFleet,
        latency: newLatency,
        satisfaction: newSat,
        throughput: newThroughput,
        timestamp: timeStr,
        processingSpeed: procSpeed,
        activeResources: activeRes,
        eventRate: eRate,
        simTimeScale: '10x'
      });

      // Update Congestion Nodes in real-time
      setCongestion(prev => prev.map(node => {
        let baseVal = 40 + Math.random() * 20;
        if (node.label === 'Security') baseVal += (simParams.increase_flights_percent / 4) - (simParams.security_counters * 2);
        if (node.label === 'Check-In') baseVal += (simParams.increase_flights_percent / 5);
        return {
          ...node,
          value: Math.floor(Math.max(10, Math.min(98, baseVal + Math.random() * 15)))
        };
      }));

      // Update Chart History
      setHistory(prev => {
        const newPoint = { 
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }), 
          flow: 500 * flightLoadMultiplier + Math.random() * 1000,
          delay: newLatency
        };
        return [...prev, newPoint].slice(-15);
      });

      // Advance Simulation Stage
      setActiveStage(prev => {
        const next = prev + 1;
        const maxStages = simType === 'international' ? 6 : 5;
        if (next >= maxStages) {
          setIsFlying(true);
          setTimeout(() => setIsFlying(false), 3000);
          return 0;
        }
        return next;
      });

      // Generate Logs
      const eventTypes = [
        `Flight AI-102 context synced`,
        `Agent ${Math.floor(Math.random()*1000)} biometrics verified`,
        `Immigration node status: OPTIMAL`,
        `Security throughput maintained @ ${newThroughput}k/hr`,
        `Digital twin clock stabilized`,
        `ML Inference: Latency delta within acceptable bounds`,
        `Passenger facial scan successful`,
        `International departure gate I-04 assigned`,
        `Domestic gate D-12 cleared for boarding`
      ];
      const newLog = `[${timeStr}] ${eventTypes[Math.floor(Math.random() * eventTypes.length)]}`;
      setLogs(prev => [newLog, ...prev].slice(0, 50));

    }, 2000);

    return () => clearInterval(interval);
  }, [hasMounted, isPlaying, simType, simParams]);

  // 3. Global Actions
  const resetEnvironment = async () => {
    setIsResetting(true);
    await new Promise(resolve => setTimeout(resolve, 1200));
    setLogs([`[SYSTEM] Environment Purged. Re-syncing with AI Core...`]);
    setHistory([]);
    setCongestion(prev => prev.map(n => ({ ...n, value: 0 })));
    setSimParams({
      increase_flights_percent: 0,
      security_counters: 5,
      delay_offset_minutes: 0
    });
    setActiveStage(0);
    setIsFlying(false);
    setIsResetting(false);
  };

  const runScenario = async (params: any) => {
    setIsResetting(true);
    try {
      const res = await apiService.runWhatIf(params);
      
      setSimParams({
        increase_flights_percent: params.increase_flights_percent,
        security_counters: params.security_counters,
        delay_offset_minutes: params.delay_offset_minutes
      });

      if (res && res.metrics) {
        const m = res.metrics;
        setMetrics(prev => ({
          ...prev,
          satisfaction: parseFloat((m.avg_satisfaction * 100).toFixed(1)),
        }));
        setLogs(prev => [`[WHAT-IF] AI Analysis complete: ${res.message}`, ...prev]);
      }
    } catch (error) {
      console.error(error);
      setLogs(prev => [`[ERROR] What-If connection failed.`, ...prev]);
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <SimulationContext.Provider value={{
      metrics, history, logs, congestion, activeStage, simType, isFlying, isPlaying, isResetting, hasMounted, simParams,
      setSimType, setIsPlaying, resetEnvironment, runScenario
    }}>
      {children}
    </SimulationContext.Provider>
  );
};


export const useSimulation = () => {
  const context = useContext(SimulationContext);
  if (!context) throw new Error('useSimulation must be used within a SimulationProvider');
  return context;
};
