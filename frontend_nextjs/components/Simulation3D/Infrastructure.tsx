"use client";

import React, { useMemo } from 'react';
import { Html, Float, useGLTF } from '@react-three/drei';
import { useSimulation } from '@/context/SimulationContext';

const Infrastructure = () => {
  const { simParams, metrics } = useSimulation();
  const { scene: securityScene } = useGLTF('/models/airport_security_check.glb');

  return (
    <group>
      {/* Floor */}
      <mesh rotation-x={-Math.PI / 2} position-y={0} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.8} />
      </mesh>
      
      {/* Grid Helper */}
      <gridHelper args={[100, 50, "#e2e8f0", "#f1f5f9"]} position-y={0.01} />

      {/* Check-In Area */}
      <group position={[-10, 0, -5]}>
        <Html position={[0, 4, 0]} center distanceFactor={15}>
          <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl border border-slate-200 shadow-xl whitespace-nowrap">
            <p className="text-slate-900 font-black text-xs tracking-tighter uppercase">Check-In Terminal</p>
          </div>
        </Html>
        {/* Dynamic Counters */}
        {[...Array(3)].map((_, i) => (
          <mesh key={i} position={[(i - 1) * 3, 0.5, 0]}>
            <boxGeometry args={[2, 1, 1]} />
            <meshStandardMaterial color="#94a3b8" />
          </mesh>
        ))}
      </group>

      {/* Security Area */}
      <group position={[0, 0, 0]}>
        <Html position={[0, 4, 0]} center distanceFactor={15}>
          <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl border border-slate-200 shadow-xl whitespace-nowrap">
            <p className="text-slate-900 font-black text-xs tracking-tighter uppercase">Security Screening</p>
          </div>
        </Html>
        {/* Dynamic Security Lanes based on simParams using the real GLB model */}
        {[...Array(simParams.security_counters)].map((_, i) => (
          <primitive 
            key={i}
            object={securityScene.clone()}
            position={[(i - (simParams.security_counters - 1) / 2) * 3, 0, 0]}
            rotation={[0, Math.PI / 2, 0]}
            scale={1.5}
          />
        ))}
      </group>

      {/* Boarding Gate / Flight Display */}
      <group position={[20, 0, 0]}>
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
          <group position={[0, 5, 0]}>
             <mesh>
               <boxGeometry args={[6, 3.5, 0.2]} />
               <meshStandardMaterial color="#0f172a" />
             </mesh>
             <Html transform position={[0, 0, 0.11]} distanceFactor={8}>
               <div className="w-[300px] p-6 text-center space-y-4 pointer-events-none select-none">
                 <p className="text-[#38bdf8] font-black text-[10px] tracking-[0.3em] uppercase">Departures</p>
                 <div className="space-y-1">
                   <p className={metrics.latency > 25 ? "text-rose-500 font-black text-xl" : "text-white font-black text-xl"}>
                     {metrics.latency > 25 ? "DELAYED" : "ON TIME"}
                   </p>
                   <p className="text-slate-400 font-bold text-[10px]">
                     {metrics.latency > 25 ? `ETA: +${Math.floor(metrics.latency)}m` : "ARRIVING: NOW"}
                   </p>
                 </div>
                 <p className="text-amber-400 font-mono text-sm border-t border-slate-800 pt-3">
                   {metrics.timestamp}
                 </p>
               </div>
             </Html>
          </group>
        </Float>
      </group>

      {/* Decorative Lights */}
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1.5} castShadow />
      <spotLight position={[-10, 20, 10]} angle={0.15} penumbra={1} intensity={2} castShadow />
    </group>
  );
};

export default Infrastructure;
