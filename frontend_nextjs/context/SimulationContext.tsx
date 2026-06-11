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
  timestamp: string;
  satisfaction: number;
  actualTraffic: number;
  predictedTraffic: number;
  trafficChange: number;
  checkInQueue: number;
  securityQueue: number;
  boardingQueue: number;
  waitTimes: { range: string; count: number }[];
  latency: number;
  delayOffset: number;
}

interface SimulationParams {
  increase_flights_percent: number;
  security_counters: number;
  checkin_counters: number;
  delay_offset_minutes: number;
  weather_severity: number;
  security_tech_level: 'standard' | 'advanced';
  time_of_day: number;
}

interface CongestionNode {
  label: string;
  value: number;
  color: string;
}

interface PassengerAgent {
  id: string;
  stage: number;
  type: 'international' | 'domestic';
  slotIndex: number;
  lastStageTime: number;
}

interface SimulationContextType {
  metrics: SimulationMetrics;
  history: ChartPoint[];
  logs: string[];
  congestion: CongestionNode[];
  passengers: PassengerAgent[];
  activeStage: number;
  simType: 'international' | 'domestic';
  isFlying: boolean;
  isPlaneReady: boolean;
  isPlaying: boolean;
  isResetting: boolean;
  hasMounted: boolean;
  simParams: SimulationParams;
  setSimParams: React.Dispatch<React.SetStateAction<SimulationParams>>;
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
  const [isPlaneReady, setIsPlaneReady] = useState(true);
  const [logs, setLogs] = useState<string[]>([]);
  const [history, setHistory] = useState<ChartPoint[]>([]);
  const [passengers, setPassengers] = useState<PassengerAgent[]>([]);
  const [nextPassengerId, setNextPassengerId] = useState(0);
  const [planeTimer, setPlaneTimer] = useState(0);
  
  const [congestion, setCongestion] = useState<CongestionNode[]>([
    { label: 'Check-In', value: 0, color: 'bg-orange-400' },
    { label: 'Security', value: 0, color: 'bg-blue-500' },
    { label: 'Lounge', value: 0, color: 'bg-indigo-400' },
    { label: 'Boarding', value: 0, color: 'bg-emerald-400' },
  ]);
  
  const [simParams, setSimParams] = useState<SimulationParams>({
    increase_flights_percent: 0,
    security_counters: 5,
    checkin_counters: 4,
    delay_offset_minutes: 0,
    weather_severity: 0,
    security_tech_level: 'standard',
    time_of_day: 12
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

  useEffect(() => {
    setHasMounted(true);
    setMetrics(prev => ({ ...prev, timestamp: new Date().toLocaleTimeString() }));
  }, []);

  // Main Simulation & History Loop (Stable)
  useEffect(() => {
    if (!hasMounted || !isPlaying) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

      // 1. Update Simulation State
      setPassengers(prevPassengers => {
        // Spawning Logic
        let updated = [...prevPassengers];
        const spawnRate = Math.floor(1 + (simParams.increase_flights_percent / 25) + Math.random());
        
        if (updated.length < 150) {
          const newSpawn: PassengerAgent[] = Array.from({ length: spawnRate }, (_, i) => ({
            id: `p-${Date.now()}-${i}`,
            stage: 0,
            type: Math.random() > 0.5 ? 'international' : 'domestic',
            slotIndex: updated.length + i,
            lastStageTime: now
          }));
          updated = [...updated, ...newSpawn];
        }

        // Processing Logic
        return updated.map(p => {
          let nextStage = p.stage;
          const timeInStage = now - p.lastStageTime;
          
          const techMultiplier = simParams.security_tech_level === 'advanced' ? 0.6 : 1.0;
          const weatherImpact = (simParams.weather_severity || 0) * 30;

          const processingTimes = [
            0,
            (3000 * (4 / simParams.checkin_counters)) + weatherImpact,
            ((4000 + (20 / simParams.security_counters) * 1000) * techMultiplier) + weatherImpact,
            4000 + weatherImpact,
            2000 + weatherImpact,
            2000 + weatherImpact,
          ];

          if (timeInStage >= (processingTimes[p.stage] || 2000)) {
            if (p.stage === 3) {
              if (isPlaneReady) nextStage++;
            } else if (p.stage === 2) {
              if (Math.random() > 0.1) nextStage++;
            } else if (p.stage < 6) {
              nextStage++;
            }
            if (nextStage !== p.stage) return { ...p, stage: nextStage, lastStageTime: now };
          }
          return p;
        }).filter(p => !(p.stage === 6 && isFlying));
      });

      // 2. Update Metrics & History (Atomic update)
      setPassengers(currentPax => {
        setMetrics(prevM => {
          const securityCapacity = simParams.security_counters * 10;
          const baseLatency = 10 + simParams.delay_offset_minutes + (simParams.weather_severity / 2);
          const congestionPenalty = Math.max(0, (currentPax.length - securityCapacity) * 1.5);
          const newLatency = parseFloat((baseLatency + Math.random() * 5 + congestionPenalty).toFixed(1));
          const newSat = parseFloat(Math.max(0, Math.min(100, 95 - (newLatency / 2))).toFixed(1));
          
          const newMetrics = {
            ...prevM,
            activeFleet: currentPax.length,
            latency: newLatency,
            satisfaction: newSat,
            timestamp: timeStr,
            processingSpeed: parseFloat((newLatency / 10).toFixed(1)),
            activeResources: simParams.security_counters + simParams.checkin_counters,
            eventRate: Math.floor((currentPax.length / 10) * (2 + Math.random())),
          };

          // Update History inside metrics update to ensure synchronization
          setHistory(prevH => {
            const waitTimes = [
              { range: '0-2s', count: 0 }, { range: '2-5s', count: 0 },
              { range: '5-10s', count: 0 }, { range: '10s+', count: 0 }
            ];
            currentPax.forEach(p => {
              const wait = (now - p.lastStageTime) / 1000;
              if (wait < 2) waitTimes[0].count++;
              else if (wait < 5) waitTimes[1].count++;
              else if (wait < 10) waitTimes[2].count++;
              else waitTimes[3].count++;
            });

            const newPoint: ChartPoint = {
              timestamp: timeStr,
              satisfaction: newSat,
              actualTraffic: currentPax.length,
              predictedTraffic: Math.floor(100 * (1 + simParams.increase_flights_percent / 100) + Math.random() * 10),
              trafficChange: prevH.length > 0 ? ((currentPax.length - prevH[prevH.length-1].actualTraffic) / (prevH[prevH.length-1].actualTraffic || 1)) * 100 : 0,
              checkInQueue: currentPax.filter(p => p.stage === 1).length,
              securityQueue: currentPax.filter(p => p.stage === 2).length,
              boardingQueue: currentPax.filter(p => p.stage === 4 || p.stage === 5).length,
              waitTimes,
              latency: newLatency,
              delayOffset: simParams.delay_offset_minutes,
              scatterX: simParams.delay_offset_minutes + (Math.random() - 0.5) * 4 // Add jitter
            };
            return [...prevH, newPoint].slice(-30);
          });

          return newMetrics;
        });

        // Update Congestion
        setCongestion(prevC => prevC.map(node => {
          const stagePax = currentPax.filter(p => {
            if (node.label === 'Check-In') return p.stage === 1;
            if (node.label === 'Security') return p.stage === 2;
            if (node.label === 'Lounge') return p.stage === 3;
            if (node.label === 'Boarding') return p.stage === 4 || p.stage === 5;
            return false;
          }).length;
          return { ...node, value: Math.min(100, stagePax * 8) };
        }));

        return currentPax;
      });

      // 3. Plane Cycle
      setPlaneTimer(prev => {
        const next = prev + 1;
        const totalCycle = 14 + (simParams.delay_offset_minutes / 10) + Math.floor(simParams.weather_severity / 10);
        if (next < 8) { setIsPlaneReady(true); setIsFlying(false); }
        else if (next < 10) { setIsPlaneReady(false); setIsFlying(true); }
        else if (next < totalCycle) { setIsPlaneReady(false); setIsFlying(false); }
        else return 0;
        return next;
      });

    }, 2000);

    return () => clearInterval(interval);
  }, [hasMounted, isPlaying, simParams, isPlaneReady, isFlying]);

  const resetEnvironment = async () => {
    setIsResetting(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    setPassengers([]);
    setHistory([]); // Clear history on reset
    setNextPassengerId(0);
    setPlaneTimer(0);
    setIsPlaneReady(true);
    setIsFlying(false);
    setActiveStage(0); // Reset active stage
    setSimParams({
      increase_flights_percent: 0,
      security_counters: 5,
      checkin_counters: 4,
      delay_offset_minutes: 0,
      weather_severity: 0,
      security_tech_level: 'standard',
      time_of_day: 12
    });
    setIsResetting(false);
  };


  const runScenario = async (params: any) => {
    setIsResetting(true);
    try {
      const res = await apiService.runWhatIf(params);
      
      setSimParams({
        increase_flights_percent: params.increase_flights_percent,
        security_counters: params.security_counters,
        checkin_counters: params.checkin_counters || 4,
        delay_offset_minutes: params.delay_offset_minutes,
        weather_severity: params.weather_severity || 0,
        security_tech_level: params.security_tech_level || 'standard'
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
      metrics, history, logs, congestion, passengers, activeStage, simType, isFlying, isPlaneReady, isPlaying, isResetting, hasMounted, simParams,
      setSimParams, setSimType, setIsPlaying, resetEnvironment, runScenario
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
