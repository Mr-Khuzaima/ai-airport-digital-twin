"use client";

import React, { useMemo } from 'react';
import { Html, Float, useGLTF } from '@react-three/drei';
import { useSimulation } from '@/context/SimulationContext';

const Infrastructure = () => {
  const { simParams, metrics, isPlaneReady } = useSimulation();
  const { scene: securityScene } = useGLTF('/models/airport_security_check.glb');
  const { scene: runwayScene } = useGLTF('/models/runway.glb');

  return (
    <group>
      {/* Floor */}
      <mesh rotation-x={-Math.PI / 2} position-y={0} receiveShadow>
        <planeGeometry args={[160, 100]} />
        <meshStandardMaterial color="#f1f5f9" roughness={0.8} />
      </mesh>
      
      {/* Grid Helper */}
      <gridHelper args={[160, 60, "#cbd5e1", "#e2e8f0"]} position-y={0.01} />

      {/* Check-In Area (Linear X: -35) */}
      <group position={[-35, 0, 0]}>
        <Html position={[0, 4, 0]} center distanceFactor={15}>
          <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl border border-slate-200 shadow-xl whitespace-nowrap">
            <p className="text-slate-900 font-black text-xs tracking-tighter uppercase">Check-In Terminal</p>
          </div>
        </Html>
        {[...Array(4)].map((_, i) => (
          <mesh key={i} position={[0, 0.5, (i - 1.5) * 4]}>
            <boxGeometry args={[1, 1, 3]} />
            <meshStandardMaterial color="#94a3b8" />
          </mesh>
        ))}
      </group>

      {/* Security Area (Linear X: -10) */}
      <group position={[-10, 0, 0]}>
        <Html position={[0, 4, 0]} center distanceFactor={15}>
          <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl border border-slate-200 shadow-xl whitespace-nowrap">
            <p className="text-slate-900 font-black text-xs tracking-tighter uppercase">Security Screening</p>
          </div>
        </Html>
        {[...Array(simParams.security_counters)].map((_, i) => (
          <primitive 
            key={i}
            object={securityScene.clone()}
            position={[0, 0, (i - (simParams.security_counters - 1) / 2) * 10]}
            rotation={[0, 0, 0]}
            scale={1.5}
          />
        ))}
      </group>

      {/* Flight Information Display - Near Check-In (X: -22) */}
      <group position={[-22, 0, 0]}>
        <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.4}>
          <group position={[0, 7, 0]} rotation={[0, -Math.PI / 2, 0]}>
             <mesh castShadow>
               <boxGeometry args={[10, 6, 0.4]} />
               <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.1} />
             </mesh>
             <mesh position={[0, 0, 0.21]}>
               <planeGeometry args={[9.6, 5.6]} />
               <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.2} />
             </mesh>
             <Html transform position={[0, 0, 0.22]} distanceFactor={6}>
               <div className="w-[500px] h-[300px] bg-white p-6 font-sans text-slate-900 overflow-hidden rounded-md shadow-2xl flex flex-col border-4 border-slate-900">
                 <div className="bg-slate-900 text-white px-4 py-2 flex justify-between items-center mb-4 rounded">
                   <h1 className="text-lg font-black tracking-tight">FLIGHT BOARD</h1>
                   <div className="text-sm font-mono text-amber-400">{metrics.timestamp}</div>
                 </div>
                 <div className="grid grid-cols-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b-2 border-slate-100 pb-2 mb-2 px-2">
                   <span>Flight</span>
                   <span>Destination</span>
                   <span>Status</span>
                   <span className="text-right">Time</span>
                 </div>
                 <div className="space-y-3 flex-1 overflow-hidden">
                   {[...Array(4)].map((_, i) => {
                     const isCurrent = i === 0;
                     const status = isCurrent ? (isPlaneReady ? "BOARDING" : (metrics.latency > 25 ? "DELAYED" : "ON TIME")) : "SCHEDULED";
                     const statusColor = status === "DELAYED" ? "text-rose-600" : (status === "BOARDING" ? "text-emerald-600" : "text-slate-400");
                     return (
                       <div key={i} className={`grid grid-cols-4 items-center text-sm font-bold px-2 py-2 rounded ${isCurrent ? "bg-amber-50 border-l-4 border-amber-400" : "border-b border-slate-50"}`}>
                         <span className="font-mono">AI-{100 + i + Math.floor(metrics.activeFleet / 5)}</span>
                         <span className="text-xs">{i % 2 === 0 ? "London LHR" : "Dubai DXB"}</span>
                         <span className={`${statusColor} text-[10px] font-black`}>{status}</span>
                         <span className="text-right text-xs font-mono">{i === 0 ? "NOW" : `+${(i + 1) * 15}m`}</span>
                       </div>
                     );
                   })}
                 </div>
                 <div className="mt-4 pt-3 border-t-2 border-slate-900 flex justify-between items-center bg-slate-50 -mx-6 -mb-6 px-6 py-2">
                   <div className="flex gap-4">
                     <div className="flex flex-col">
                       <span className="text-[8px] text-slate-400 uppercase">Load</span>
                       <span className="text-xs font-black">{metrics.activeFleet} PAX</span>
                     </div>
                     <div className="flex flex-col">
                       <span className="text-[8px] text-slate-400 uppercase">Counters</span>
                       <span className="text-xs font-black text-blue-600">{simParams.security_counters}</span>
                     </div>
                   </div>
                   <div className="flex flex-col items-end">
                     <span className="text-[8px] text-slate-400 uppercase">AI Analytics</span>
                     <span className={`text-xs font-black ${metrics.latency > 25 ? "text-rose-600" : "text-emerald-600"}`}>
                       LATENCY: {Math.floor(metrics.latency)}m
                     </span>
                   </div>
                 </div>
               </div>
             </Html>
             <mesh position={[0, 3, 0]}>
               <boxGeometry args={[0.2, 2, 0.2]} />
               <meshStandardMaterial color="#334155" />
             </mesh>
          </group>
        </Float>
      </group>

      {/* Waiting Hall Area (Linear X: 20) */}
      <group position={[20, 0, 0]}>
        <Html position={[0, 4, 0]} center distanceFactor={15}>
          <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl border border-slate-200 shadow-xl whitespace-nowrap">
            <p className="text-slate-900 font-black text-xs tracking-tighter uppercase">Waiting Lounge</p>
          </div>
        </Html>
        <mesh position={[0, 2.5, -10]}>
          <boxGeometry args={[14, 5, 0.2]} />
          <meshStandardMaterial color="#cbd5e1" roughness={0.3} metalness={0.1} />
        </mesh>
        <mesh position={[0, 2.5, 10]}>
          <boxGeometry args={[14, 5, 0.05]} />
          <meshStandardMaterial color="#94a3b8" transparent opacity={0.3} />
        </mesh>
        <group position={[-7, 2.5, 0]}>
          <mesh position={[0, 1.5, 0]}> <boxGeometry args={[0.2, 2, 20]} /> <meshStandardMaterial color="#cbd5e1" /> </mesh>
          <mesh position={[0, -1, -6]}> <boxGeometry args={[0.2, 3, 8]} /> <meshStandardMaterial color="#cbd5e1" /> </mesh>
          <mesh position={[0, -1, 6]}> <boxGeometry args={[0.2, 3, 8]} /> <meshStandardMaterial color="#cbd5e1" /> </mesh>
          <mesh position={[0.1, -1, 0]}> <planeGeometry args={[4, 3]} /> <meshStandardMaterial color="#38bdf8" transparent opacity={0.1} /> </mesh>
        </group>
        <group position={[7, 2.5, 0]}>
          <mesh position={[0, 1.5, 0]}> <boxGeometry args={[0.2, 2, 20]} /> <meshStandardMaterial color="#cbd5e1" /> </mesh>
          <mesh position={[0, -1, -6]}> <boxGeometry args={[0.2, 3, 8]} /> <meshStandardMaterial color="#cbd5e1" /> </mesh>
          <mesh position={[0, -1, 6]}> <boxGeometry args={[0.2, 3, 8]} /> <meshStandardMaterial color="#cbd5e1" /> </mesh>
          <mesh position={[-0.1, -1, 0]}> <planeGeometry args={[4, 3]} /> <meshStandardMaterial color="#38bdf8" transparent opacity={0.1} /> </mesh>
        </group>
        {[...Array(2)].map((_, row) => (
          <group key={row} position={[(row - 0.5) * 6, 0, 0]}>
            {[...Array(5)].map((_, i) => (
              <mesh key={i} position={[0, 0.25, (i - 2) * 3]} castShadow>
                <boxGeometry args={[1.5, 0.5, 1.2]} />
                <meshStandardMaterial color="#334155" />
                <mesh position={[row === 0 ? -0.7 : 0.7, 0.6, 0]}>
                  <boxGeometry args={[0.15, 1.2, 1.2]} />
                  <meshStandardMaterial color="#475569" />
                </mesh>
              </mesh>
            ))}
          </group>
        ))}
      </group>

      {/* Boarding Gate (Linear X: 40) */}
      <group position={[40, 0, 0]}>
        <mesh position={[0, 2, 0]}>
          <boxGeometry args={[1, 4, 6]} />
          <meshStandardMaterial color="#cbd5e1" transparent opacity={0.3} />
        </mesh>
      </group>

      {/* Runway Area (Linear X: 55) */}
      <group position={[55, 0, 0]}>
        <primitive object={runwayScene.clone()} scale={[0.1, 0.1, 0.2]} rotation={[0, Math.PI / 2, 0]} />
      </group>

      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1.5} castShadow />
      <spotLight position={[-10, 20, 10]} angle={0.15} penumbra={1} intensity={2} castShadow />
    </group>
  );
};

export default Infrastructure;
