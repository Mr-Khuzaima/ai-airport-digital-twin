"use client";

import React from 'react';
import { Html, Float, useGLTF } from '@react-three/drei';
import { useSimulation } from '@/context/SimulationContext';

// --- DETAILED COMPONENTS ---

const CheckInCounter = ({ position, color, label }: { position: [number, number, number], color: string, label: string }) => (
  <group position={position}>
    <mesh position={[0, 0.6, 0]} castShadow>
      <boxGeometry args={[2, 1.2, 3.5]} />
      <meshStandardMaterial color="#f8fafc" />
    </mesh>
    <mesh position={[0, 1.25, 0]}>
      <boxGeometry args={[2.1, 0.1, 3.6]} />
      <meshStandardMaterial color="#334155" roughness={0.1} />
    </mesh>
    <group position={[-0.8, 1.8, 0]} rotation={[0, Math.PI / 2, 0]}>
      <mesh>
        <boxGeometry args={[1.5, 1, 0.1]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
      <Html transform distanceFactor={3} position={[0, 0, 0.06]}>
        <div className={`px-2 py-1 rounded text-[6px] font-black text-white ${color} flex flex-col items-center`}>
          <span>{label}</span>
          <span className="opacity-50">OPEN</span>
        </div>
      </Html>
    </group>
    <mesh position={[0, 0.2, 2.2]}>
      <boxGeometry args={[1.8, 0.2, 1.5]} />
      <meshStandardMaterial color="#94a3b8" />
    </mesh>
  </group>
);

const PakistaniCurb = ({ position, length }: { position: [number, number, number], length: number }) => (
  <group position={position}>
    {[...Array(Math.floor(length / 2))].map((_, i) => (
      <mesh key={i} position={[0, 0.25, i * 2 - length / 2]}>
        <boxGeometry args={[0.5, 0.5, 2]} />
        <meshStandardMaterial color={i % 2 === 0 ? "#facc15" : "#111827"} />
      </mesh>
    ))}
  </group>
);

const SecurityFence = ({ position, rotation = [0, 0, 0], length = 20 }: { position: [number, number, number], rotation?: [number, number, number], length?: number }) => (
  <group position={position} rotation={rotation}>
    <mesh position={[0, 4, 0]}>
      <planeGeometry args={[length, 8]} />
      <meshStandardMaterial color="#94a3b8" transparent opacity={0.3} wireframe />
    </mesh>
    {[...Array(Math.floor(length / 5) + 1)].map((_, i) => (
      <mesh key={i} position={[(i * 5) - (length / 2), 4, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 8]} />
        <meshStandardMaterial color="#475569" />
      </mesh>
    ))}
  </group>
);

const CustomRunway = ({ position }: { position: [number, number, number] }) => (
  <group position={position}>
    <mesh rotation-x={-Math.PI / 2} position={[0, 0.01, -50]}>
      <planeGeometry args={[40, 220]} />
      <meshStandardMaterial color="#1e293b" roughness={0.9} />
    </mesh>
    {[...Array(15)].map((_, i) => (
      <mesh key={i} rotation-x={-Math.PI / 2} position={[0, 0.02, (i * 12) - 130]}>
        <planeGeometry args={[0.8, 6]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" />
      </mesh>
    ))}
    <mesh rotation-x={-Math.PI / 2} position={[-18, 0.015, -50]}>
      <planeGeometry args={[0.5, 220]} />
      <meshStandardMaterial color="#facc15" />
    </mesh>
    <mesh rotation-x={-Math.PI / 2} position={[18, 0.015, -50]}>
      <planeGeometry args={[0.5, 220]} />
      <meshStandardMaterial color="#facc15" />
    </mesh>
    <Html position={[0, 0.1, 40]} rotation={[-Math.PI / 2, 0, 0]} transform distanceFactor={10}>
       <span className="text-8xl font-black text-white/40 select-none">36L</span>
    </Html>
  </group>
);

const Car = ({ position, color }: { position: [number, number, number], color: string }) => (
  <group position={position}>
    <mesh position={[0, 0.4, 0]} castShadow>
      <boxGeometry args={[4, 0.8, 2]} />
      <meshStandardMaterial color={color} />
    </mesh>
    <mesh position={[-0.5, 1, 0]} castShadow>
      <boxGeometry args={[2, 0.6, 1.8]} />
      <meshStandardMaterial color={color} />
    </mesh>
    {[[-1.2, 0.2, 0.9], [1.2, 0.2, 0.9], [-1.2, 0.2, -0.9], [1.2, 0.2, -0.9]].map((pos, i) => (
      <mesh key={i} position={pos as [number, number, number]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.4]} />
        <meshStandardMaterial color="#111" />
      </mesh>
    ))}
  </group>
);

const Tree = ({ position }: { position: [number, number, number] }) => (
  <group position={position}>
    <mesh position={[0, 1.5, 0]}>
      <cylinderGeometry args={[0.2, 0.3, 3]} />
      <meshStandardMaterial color="#78350f" />
    </mesh>
    <mesh position={[0, 4, 0]}>
      <coneGeometry args={[1.5, 4, 8]} />
      <meshStandardMaterial color="#166534" />
    </mesh>
  </group>
);

const Infrastructure = () => {
  const { simParams, metrics, isPlaneReady } = useSimulation();
  const { scene: securityScene } = useGLTF('/models/airport_security_check.glb');

  // Dynamic Counter Calculation
  const numCheckin = simParams.checkin_counters || 4;
  const domesticCount = Math.ceil(numCheckin / 2);
  const internationalCount = Math.floor(numCheckin / 2);

  return (
    <group>
      {/* --- 1. EXTERIOR & PERIMETER --- */}
      <mesh rotation-x={-Math.PI / 2} position={[-20, -0.05, 0]} receiveShadow>
        <planeGeometry args={[260, 260]} />
        <meshStandardMaterial color="#14532d" roughness={1} />
      </mesh>

      <SecurityFence position={[-140, 0, 0]} rotation={[0, Math.PI / 2, 0]} length={260} />
      <SecurityFence position={[-10, 0, -130]} rotation={[0, 0, 0]} length={260} />
      <SecurityFence position={[-10, 0, 130]} rotation={[0, 0, 0]} length={260} />
      <SecurityFence position={[120, 0, 0]} rotation={[0, Math.PI / 2, 0]} length={260} />

      {/* Exterior Road & Parking */}
      <group position={[-110, 0, 0]}>
        <mesh rotation-x={-Math.PI / 2} position={[0, 0.01, 0]}>
          <planeGeometry args={[20, 140]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
        {[...Array(10)].map((_, i) => (
          <mesh key={i} rotation-x={-Math.PI / 2} position={[0, 0.02, (i - 4.5) * 14]}>
            <planeGeometry args={[0.5, 6]} />
            <meshStandardMaterial color="#ffffff" emissive="#ffffff" />
          </mesh>
        ))}
        <PakistaniCurb position={[-10.2, 0, 0]} length={140} />
        <PakistaniCurb position={[10.2, 0, 0]} length={140} />
      </group>

      {/* NEW: Walking Track - ATTACHED TO ARRIVAL GATE */}
      <group position={[-78, 0.05, 0]}>
        <mesh rotation-x={-Math.PI / 2}>
          <planeGeometry args={[8, 120]} />
          <meshStandardMaterial color="#475569" />
        </mesh>
        {[...Array(24)].map((_, i) => (
          <mesh key={i} rotation-x={-Math.PI / 2} position={[0, 0.01, (i - 11.5) * 5]}>
            <planeGeometry args={[6, 1]} />
            <meshStandardMaterial color="#94a3b8" />
          </mesh>
        ))}
        {/* Connector Path directly to Gate at X: -60 */}
        <mesh rotation-x={-Math.PI / 2} position={[9, 0, 25]}>
           <planeGeometry args={[18, 8]} />
           <meshStandardMaterial color="#475569" />
        </mesh>
        <mesh rotation-x={-Math.PI / 2} position={[9, 0, -25]}>
           <planeGeometry args={[18, 8]} />
           <meshStandardMaterial color="#475569" />
        </mesh>
      </group>

      <group position={[-95, 0, 0]}>
        <mesh rotation-x={-Math.PI / 2} position={[0, 0.01, 0]}>
          <planeGeometry args={[25, 100]} />
          <meshStandardMaterial color="#475569" />
        </mesh>
        <Car position={[-5, 0, -35]} color="#ef4444" />
        <Car position={[5, 0, -15]} color="#3b82f6" />
        <Car position={[-2, 0, 10]} color="#10b981" />
        <Car position={[6, 0, 30]} color="#f59e0b" />
      </group>

      {/* --- 2. MAIN TERMINAL BUILDING --- */}
      
      <mesh rotation-x={-Math.PI / 2} position={[-12.5, 0.1, 0]} receiveShadow>
        <planeGeometry args={[95, 80]} />
        <meshStandardMaterial color="#f1f5f9" />
      </mesh>

      <mesh position={[-12.5, 5, -40]}>
        <boxGeometry args={[95, 10, 1.5]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.9} />
      </mesh>
      <mesh position={[-12.5, 5, 40]}>
        <boxGeometry args={[95, 10, 1.5]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.9} />
      </mesh>

      <group position={[-60, 5, 0]}>
        <mesh position={[0, 4.5, 0]}> <boxGeometry args={[1.5, 1, 80]} /> <meshStandardMaterial color="#64748b" /> </mesh>
        <mesh position={[0, 0, -25]}> <boxGeometry args={[0.2, 10, 30]} /> <meshStandardMaterial color="#38bdf8" transparent opacity={0.2} /> </mesh>
        <mesh position={[0, 0, 25]}> <boxGeometry args={[0.2, 10, 30]} /> <meshStandardMaterial color="#38bdf8" transparent opacity={0.2} /> </mesh>
        
        <Html position={[0, 7, -25]} center distanceFactor={12}>
           <div className="bg-indigo-900 text-white px-10 py-4 rounded-2xl border-4 border-white shadow-2xl font-black text-lg tracking-tighter whitespace-nowrap uppercase">
             International Arrivals
           </div>
        </Html>
        <Html position={[0, 7, 25]} center distanceFactor={12}>
           <div className="bg-blue-600 text-white px-10 py-4 rounded-2xl border-4 border-white shadow-2xl font-black text-lg tracking-tighter whitespace-nowrap uppercase">
             Domestic Arrivals
           </div>
        </Html>
      </group>

      {/* SEPARATOR RAILS BETWEEN ZONES */}
      <mesh position={[-40, 1, 0]}>
        <boxGeometry args={[10, 2, 0.5]} />
        <meshStandardMaterial color="#64748b" />
      </mesh>

      {/* DYNAMIC CHECK-IN ISLANDS */}
      <group position={[-40, 0, 25]}>
        <Html position={[0, 4.5, 0]} center distanceFactor={10}>
          <div className="bg-blue-600 text-white px-3 py-1 rounded-full font-black text-[10px] border-2 border-white shadow-lg">DOMESTIC ZONE</div>
        </Html>
        {[...Array(domesticCount)].map((_, i) => (
          <CheckInCounter 
            key={`dom-${i}`} 
            position={[0, 0, (i - (domesticCount - 1) / 2) * 8]} 
            color="bg-blue-500" 
            label={`D${i+1}`} 
          />
        ))}
      </group>

      <group position={[-40, 0, -25]}>
        <Html position={[0, 4.5, 0]} center distanceFactor={10}>
          <div className="bg-indigo-800 text-white px-3 py-1 rounded-full font-black text-[10px] border-2 border-white shadow-lg">INTERNATIONAL ZONE</div>
        </Html>
        {[...Array(internationalCount)].map((_, i) => (
          <CheckInCounter 
            key={`intl-${i}`} 
            position={[0, 0, (i - (internationalCount - 1) / 2) * 8]} 
            color="bg-indigo-600" 
            label={`I${i+1}`} 
          />
        ))}
      </group>

      <group position={[-15, 0, 0]}>
        {[...Array(simParams.security_counters)].map((_, i) => (
          <primitive 
            key={i}
            object={securityScene.clone()}
            position={[0, 0, (i - (simParams.security_counters - 1) / 2) * 12]}
            rotation={[0, 0, 0]}
            scale={1.5}
          />
        ))}
      </group>

      <group position={[22, 0, 0]}>
        <mesh rotation-x={-Math.PI / 2} position={[0, 0.02, 0]}>
          <planeGeometry args={[26, 76]} />
          <meshStandardMaterial color="#e2e8f0" />
        </mesh>

        <group position={[-13, 4, 0]}>
          <mesh position={[0, 0, -23.75]}> <boxGeometry args={[0.5, 8, 32.5]} /> <meshStandardMaterial color="#cbd5e1" /> </mesh>
          <mesh position={[0, 0, 23.75]}> <boxGeometry args={[0.5, 8, 32.5]} /> <meshStandardMaterial color="#cbd5e1" /> </mesh>
          <mesh position={[0, 3, 0]}> <boxGeometry args={[0.5, 2, 15]} /> <meshStandardMaterial color="#cbd5e1" /> </mesh>
          <Html position={[0.3, 1, 0]} center distanceFactor={10}>
             <div className="bg-indigo-600 text-white px-2 py-1 rounded font-black text-[8px] animate-pulse">LOUNGE ENTRANCE</div>
          </Html>
        </group>

        <group position={[13, 4, 0]}>
          <mesh position={[0, 0, -24]}> <boxGeometry args={[0.5, 8, 32]} /> <meshStandardMaterial color="#38bdf8" transparent opacity={0.1} /> </mesh>
          <mesh position={[0, 0, 24]}> <boxGeometry args={[0.5, 8, 32]} /> <meshStandardMaterial color="#38bdf8" transparent opacity={0.1} /> </mesh>
          <mesh position={[0, 3, 0]}> <boxGeometry args={[0.5, 2, 16]} /> <meshStandardMaterial color="#38bdf8" transparent opacity={0.1} /> </mesh>
          <Html position={[0.5, 1, 0]} center distanceFactor={10}>
             <div className="bg-emerald-600 text-white px-4 py-1 rounded-full font-black text-[10px] border-2 border-white shadow-xl">
               BOARDING GATE
             </div>
          </Html>
        </group>

        {[...Array(3)].map((_, row) => (
          <group key={row} position={[(row - 1) * 6, 0.1, 0]}>
            {[...Array(6)].map((_, i) => (
              <mesh key={i} position={[0, 0.25, (i - 2.5) * 6]} castShadow>
                <boxGeometry args={[2, 0.5, 2]} />
                <meshStandardMaterial color="#1e293b" />
                <mesh position={[row % 2 === 0 ? -0.8 : 0.8, 0.6, 0]}>
                  <boxGeometry args={[0.15, 1.2, 2]} />
                  <meshStandardMaterial color="#475569" />
                </mesh>
              </mesh>
            ))}
          </group>
        ))}
      </group>

      <CustomRunway position={[70, 0, 0]} />

      <ambientLight intensity={0.6} />
      <directionalLight position={[50, 50, 50]} intensity={1.5} castShadow />
    </group>
  );
};

export default Infrastructure;
