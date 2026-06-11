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
  checkin_counters: number; // Added checkin_counters
  delay_offset_minutes: number;
  weather_severity: number;
  security_tech_level: 'standard' | 'advanced';
  time_of_day: number; // 0-23
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
  lastStageTime: number; // For processing duration
}

interface SimulationContextType {
  metrics: SimulationMetrics;
  history: ChartPoint[];
  logs: string[];
  congestion: CongestionNode[];
  passengers: PassengerAgent[];
  activeStage: number; // Re-added
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
  const [activeStage, setActiveStage] = useState(0); // Re-added
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
    checkin_counters: 4, // Default to 4 (2 Domestic, 2 International)
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

  // Main Simulation Loop
  useEffect(() => {
    if (!hasMounted || !isPlaying) return;

    const interval = setInterval(() => {
      const flightLoadMultiplier = 1 + (simParams.increase_flights_percent / 100);
      const securityCapacity = simParams.security_counters * 10;
      
      // 1. Plane Cycle Management
      setPlaneTimer(prev => {
        const next = prev + 1;
        // Weather severity increases the time plane stays away
        const weatherDelay = Math.floor(simParams.weather_severity / 10);
        const totalCycle = 14 + (simParams.delay_offset_minutes / 10) + weatherDelay;
        
        if (next < 8) {
          setIsPlaneReady(true);
          setIsFlying(false);
        } else if (next < 10) {
          setIsPlaneReady(false);
          setIsFlying(true);
        } else if (next < totalCycle) {
          setIsPlaneReady(false);
          setIsFlying(false);
        } else {
          return 0; // Reset cycle
        }
        return next;
      });

      // 2. Calculate Metrics
      const currentPaxCount = passengers.length;
      const baseLatency = 10 + simParams.delay_offset_minutes + (simParams.weather_severity / 2);
      const congestionPenalty = Math.max(0, (currentPaxCount - securityCapacity) * 1.5);
      const newLatency = parseFloat((baseLatency + Math.random() * 5 + congestionPenalty).toFixed(1));
      const newSat = parseFloat(Math.max(0, Math.min(100, 95 - (newLatency / 2))).toFixed(1));
      const timeStr = new Date().toLocaleTimeString();

      // New: Calculate processing speed and event rate
      const activeRes = simParams.security_counters + simParams.checkin_counters;
      const avgProcTime = (newLatency / 10).toFixed(1); // Scaled for display
      const currentEventRate = Math.floor((currentPaxCount / 10) * (2 + Math.random()));

      setMetrics(prev => ({
        ...prev,
        activeFleet: currentPaxCount,
        latency: newLatency,
        satisfaction: newSat,
        timestamp: timeStr,
        processingSpeed: parseFloat(avgProcTime),
        activeResources: activeRes,
        eventRate: currentEventRate,
        simTimeScale: '1.0x'
      }));

      // 3. Update Passenger Flow Logic
      setPassengers(prev => {
        let updated = prev.map(p => {
          let nextStage = p.stage;
          const now = Date.now();
          const timeInStage = now - p.lastStageTime;
          
          // Realistic Processing Times (ms)
          const techMultiplier = simParams.security_tech_level === 'advanced' ? 0.6 : 1.0;
          const weatherImpact = (simParams.weather_severity || 0) * 30; // Up to 3 seconds extra per stage

          const processingTimes = [
            0,    // Stage 0: Entrance
            (3000 * (4 / simParams.checkin_counters)) + weatherImpact, // Check-in scales with counter count
            ((4000 + (20 / simParams.security_counters) * 1000) * techMultiplier) + weatherImpact, // Security
            4000 + weatherImpact, // Stage 3: Lounge
            2000 + weatherImpact, // Stage 4: Boarding
            2000 + weatherImpact, // Stage 5: Inside Plane
          ];

          if (timeInStage >= (processingTimes[p.stage] || 2000)) {
            // Stage-Specific Rules
            if (p.stage === 3) { // Lounge -> Boarding
              if (isPlaneReady) {
                nextStage++;
                return { ...p, stage: nextStage, lastStageTime: now };
              }
            } else if (p.stage === 2) { // Security -> Lounge
              const canPass = Math.random() > (newLatency / 200);
              if (canPass) {
                nextStage++;
                return { ...p, stage: nextStage, lastStageTime: now };
              }
            } else if (p.stage < 6) {
              nextStage++;
              return { ...p, stage: nextStage, lastStageTime: now };
            }
          }

          // Removal Logic (Plane took off)
          if (p.stage === 6 && isFlying) {
            return null; 
          }
          
          return p;
        }).filter(p => p !== null) as PassengerAgent[];

        // Spawning: Add new passengers at Entrance
        const spawnRate = Math.floor(1 + (simParams.increase_flights_percent / 25) + Math.random());
        if (updated.length < 150) {
          const newSpawn: PassengerAgent[] = Array.from({ length: spawnRate }, (_, i) => ({
            id: (nextPassengerId + i).toString(),
            stage: 0,
            type: Math.random() > 0.5 ? 'international' : 'domestic',
            slotIndex: updated.length + i,
            lastStageTime: Date.now()
          }));
          setNextPassengerId(prevId => prevId + spawnRate);
          return [...updated, ...newSpawn];
        }
        return updated;
      });

      // 4. Update Congestion Metrics
      setCongestion(prev => prev.map(node => {
        const stagePax = passengers.filter(p => {
          if (node.label === 'Check-In') return p.stage === 1;
          if (node.label === 'Security') return p.stage === 2;
          if (node.label === 'Lounge') return p.stage === 3;
          if (node.label === 'Boarding') return p.stage === 4 || p.stage === 5;
          return false;
        }).length;
        return { ...node, value: Math.min(100, stagePax * 8) };
      }));

      // 5. Update Global Active Stage (Visual only)
      setActiveStage(prev => (prev + 1) % (simType === 'international' ? 6 : 5));

    }, 2000);

    return () => clearInterval(interval);
  }, [hasMounted, isPlaying, simParams, passengers, nextPassengerId, isPlaneReady, isFlying, simType]);

  const resetEnvironment = async () => {
    setIsResetting(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    setPassengers([]);
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
