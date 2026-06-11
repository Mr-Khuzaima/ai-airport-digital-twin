"use client";

import React, { useMemo } from 'react';
import { Html, Float, useGLTF } from '@react-three/drei';
import { useSimulation } from '@/context/SimulationContext';

// --- DETAILED COMPONENTS ---

const LightPole = ({ position, isNight }: { position: [number, number, number], isNight: boolean }) => (
  <group position={position}>
    {/* Pole */}
    <mesh position={[0, 4, 0]}>
      <cylinderGeometry args={[0.1, 0.15, 8, 8]} />
      <meshStandardMaterial color="#475569" metalness={0.8} />
    </mesh>
    {/* Lamp Arm */}
    <mesh position={[0.5, 7.8, 0]} rotation={[0, 0, Math.PI / 4]}>
      <boxGeometry args={[1, 0.1, 0.2]} />
      <meshStandardMaterial color="#475569" />
    </mesh>
    {/* Lamp Head */}
    <mesh position={[1, 7.5, 0]}>
      <boxGeometry args={[0.6, 0.2, 0.8]} />
      <meshStandardMaterial 
        color={isNight ? "#fff" : "#1e293b"} 
        emissive={isNight ? "#fbbf24" : "#333"} 
        emissiveIntensity={isNight ? 10 : 0.5} 
      />
    </mesh>
    {/* Light Source */}
    {isNight && (
      <pointLight 
        position={[1, 7.2, 0]} 
        intensity={300} 
        distance={40} 
        color="#fbbf24" 
      />
    )}
  </group>
);

const CustomSecurityScanner = ({ position, isNight }: { position: [number, number, number], isNight: boolean }) => (
  <group position={position}>
    {/* Conveyor Belt System */}
    <mesh position={[0, 0.4, 0]} receiveShadow>
      <boxGeometry args={[8, 0.2, 2.5]} />
      <meshStandardMaterial color="#1e293b" metalness={0.5} roughness={0.8} />
    </mesh>
    
    {/* Rollers under belt */}
    {[...Array(8)].map((_, i) => (
      <mesh key={i} position={[(i - 3.5) * 1, 0.3, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 2.4, 8]} />
        <meshStandardMaterial color="#475569" metalness={0.9} />
      </mesh>
    ))}

    {/* Main Scanner Housing (The Box) */}
    <group position={[0, 1.2, 0]}>
      {/* Outer Shell */}
      <mesh castShadow>
        <boxGeometry args={[3.5, 1.8, 3]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.4} roughness={0.3} />
      </mesh>
      
      {/* Top Detail Plate */}
      <mesh position={[0, 0.95, 0]}>
        <boxGeometry args={[3.6, 0.1, 3.1]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.8} />
      </mesh>

      {/* Internal Scanning Tunnel (Visual) */}
      <mesh position={[0, -0.1, 0]}>
        <boxGeometry args={[3.55, 1.4, 2.4]} />
        <meshStandardMaterial 
          color="#0ea5e9" 
          emissive="#38bdf8" 
          emissiveIntensity={isNight ? 1.5 : 0.4} 
          transparent 
          opacity={0.3} 
        />
      </mesh>

      {/* High-Tech Side Panels */}
      {[-1.55, 1.55].map((x, i) => (
        <group key={i} position={[x, 0, 0]}>
          <mesh>
            <boxGeometry args={[0.05, 1.2, 2.8]} />
            <meshStandardMaterial color="#475569" />
          </mesh>
          {/* Glowing Stripes */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.06, 0.1, 2.5]} />
            <meshStandardMaterial 
              color="#38bdf8" 
              emissive="#38bdf8" 
              emissiveIntensity={isNight ? 2 : 0.5} 
            />
          </mesh>
          {/* SECURITY TEXT */}
          <Html 
            position={[x > 0 ? 0.04 : -0.04, 0.4, 0]} 
            rotation={[0, x > 0 ? Math.PI / 2 : -Math.PI / 2, 0]} 
            transform 
            distanceFactor={4}
          >
            <div className="bg-slate-900 text-yellow-500 px-3 py-1 border-2 border-yellow-600 rounded-sm font-black text-[12px] tracking-widest uppercase whitespace-nowrap select-none">
              SECURITY
            </div>
          </Html>
        </group>
      ))}

      {/* Operator Monitor Panel */}
      <group position={[0, 1.2, 1.2]} rotation={[-Math.PI / 6, 0, 0]}>
        <mesh castShadow>
          <boxGeometry args={[1.2, 0.8, 0.1]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
        <mesh position={[0, 0, 0.06]}>
          <planeGeometry args={[1, 0.6]} />
          <meshStandardMaterial 
            color="#000" 
            emissive="#22c55e" 
            emissiveIntensity={isNight ? 0.8 : 0.2} 
          />
        </mesh>
      </group>
    </group>

    {/* Passenger Metal Detector Arch */}
    <group position={[-3.5, 1.5, 0]}>
      {/* Side Pillars */}
      <mesh position={[0, -0.5, 1.2]} castShadow>
        <boxGeometry args={[0.4, 3, 0.4]} />
        <meshStandardMaterial color="#475569" metalness={0.8} />
      </mesh>
      <mesh position={[0, -0.5, -1.2]} castShadow>
        <boxGeometry args={[0.4, 3, 0.4]} />
        <meshStandardMaterial color="#475569" metalness={0.8} />
      </mesh>
      {/* Top Arch */}
      <mesh position={[0, 1, 0]} castShadow>
        <boxGeometry args={[0.4, 0.4, 2.8]} />
        <meshStandardMaterial color="#475569" metalness={0.8} />
      </mesh>
      
      {/* Indicator Light */}
      <mesh position={[0, 1, 1]} rotation={[0, Math.PI / 2, 0]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial 
          color="#22c55e" 
          emissive="#22c55e" 
          emissiveIntensity={isNight ? 2 : 0.5} 
        />
      </mesh>
    </group>

    {/* Floor Markings */}
    <mesh rotation-x={-Math.PI / 2} position={[0, 0.01, 0]}>
      <planeGeometry args={[9, 4]} />
      <meshStandardMaterial color="#334155" transparent opacity={0.2} />
    </mesh>
  </group>
);

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

const CustomRunway = ({ position, isNight }: { position: [number, number, number], isNight: boolean }) => (
  <group position={position}>
    <mesh rotation-x={-Math.PI / 2} position={[0, 0.01, -50]}>
      <planeGeometry args={[40, 220]} />
      <meshStandardMaterial color="#1e293b" roughness={0.9} />
    </mesh>
    {[...Array(15)].map((_, i) => (
      <mesh key={i} rotation-x={-Math.PI / 2} position={[0, 0.02, (i * 12) - 130]}>
        <planeGeometry args={[0.8, 6]} />
        <meshStandardMaterial 
          color="#ffffff" 
          emissive="#ffffff" 
          emissiveIntensity={isNight ? 10 : 0.5} 
        />
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

const Tree = ({ position }: { position: [number, number, number] }) => {
  const { scene } = useGLTF('/models/tree.glb');
  const clonedScene = useMemo(() => scene.clone(), [scene]);
  return (
    <group position={position}>
      <primitive object={clonedScene} scale={3} />
    </group>
  );
};

const Infrastructure = () => {
  const { simParams, metrics, isPlaneReady } = useSimulation();
  const isNight = simParams.time_of_day < 6 || simParams.time_of_day > 18;

  // Dynamic Counter Calculation
  const numCheckin = simParams.checkin_counters || 4;
  const domesticCount = Math.ceil(numCheckin / 2);
  const internationalCount = Math.floor(numCheckin / 2);

  return (
    <group>
      {/* Scattered Trees in Green Areas */}
      <group>
        <Tree position={[-120, 0, -100]} />
        <Tree position={[-120, 0, 100]} />
        <Tree position={[100, 0, -100]} />
        <Tree position={[100, 0, 100]} />
        <Tree position={[-40, 0, 110]} />
        <Tree position={[-40, 0, -110]} />
        <Tree position={[30, 0, 110]} />
        <Tree position={[30, 0, -110]} />
        <Tree position={[-130, 0, 0]} />
        <Tree position={[110, 0, 0]} />
      </group>

      {/* --- LIGHT POLES --- */}
      {/* Road Lighting */}
      {[...Array(6)].map((_, i) => (
        <LightPole key={`road-light-${i}`} position={[-136, 0, (i - 2.5) * 40]} isNight={isNight} />
      ))}
      
      {/* Parking Lighting */}
      <LightPole position={[-85, 0, 25]} isNight={isNight} />
      <LightPole position={[-85, 0, -25]} isNight={isNight} />
      
      {/* Runway Lighting */}
      {[...Array(8)].map((_, i) => (
        <React.Fragment key={`runway-lights-${i}`}>
          <LightPole position={[50, 0, (i * 30) - 130]} isNight={isNight} />
          <LightPole position={[90, 0, (i * 30) - 130]} isNight={isNight} />
        </React.Fragment>
      ))}

      {/* Terminal Front Lighting */}
      <LightPole position={[-65, 0, 15]} isNight={isNight} />
      <LightPole position={[-65, 0, -15]} isNight={isNight} />

      {/* --- PERIMETER FENCE LIGHTING --- */}
      {/* Left Fence */}
      {[...Array(4)].map((_, i) => (
        <LightPole key={`left-fence-${i}`} position={[-138, 0, (i - 1.5) * 80]} isNight={isNight} />
      ))}
      {/* Right Fence */}
      {[...Array(4)].map((_, i) => (
        <LightPole key={`right-fence-${i}`} position={[118, 0, (i - 1.5) * 80]} isNight={isNight} />
      ))}
      {/* Top/Bottom Fences */}
      {[...Array(4)].map((_, i) => (
        <React.Fragment key={`top-bottom-${i}`}>
          <LightPole position={[(i - 1.5) * 80, 0, -128]} isNight={isNight} />
          <LightPole position={[(i - 1.5) * 80, 0, 128]} isNight={isNight} />
        </React.Fragment>
      ))}

      {/* --- INTERIOR TERMINAL LIGHTING --- */}
      {isNight && (
        <group>
          <pointLight position={[-40, 8, 20]} intensity={150} distance={60} color="#fff" />
          <pointLight position={[-40, 8, -20]} intensity={150} distance={60} color="#fff" />
          <pointLight position={[0, 8, 0]} intensity={150} distance={60} color="#fff" />
          <pointLight position={[20, 8, 20]} intensity={150} distance={60} color="#fff" />
          <pointLight position={[20, 8, -20]} intensity={150} distance={60} color="#fff" />
        </group>
      )}

      {/* --- 1. EXTERIOR & PERIMETER --- */}
      <mesh rotation-x={-Math.PI / 2} position={[-20, -0.05, 0]} receiveShadow>
        <planeGeometry args={[260, 260]} />
        <meshStandardMaterial color="#14532d" roughness={1} />
      </mesh>

      <SecurityFence position={[-140, 0, 0]} rotation={[0, Math.PI / 2, 0]} length={260} />
      <SecurityFence position={[-10, 0, -130]} rotation={[0, 0, 0]} length={260} />
      <SecurityFence position={[-10, 0, 130]} rotation={[0, 0, 0]} length={260} />
      <SecurityFence position={[120, 0, 0]} rotation={[0, Math.PI / 2, 0]} length={260} />

      {/* FIXED ROAD (X: -125) */}
      <group position={[-125, 0, 0]}>
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

      {/* FIXED PARKING (X: -95, Shorter Z-length 60) */}
      <group position={[-95, 0, 0]}>
        <mesh rotation-x={-Math.PI / 2} position={[0, 0.01, 0]}>
          <planeGeometry args={[25, 60]} />
          <meshStandardMaterial color="#475569" />
        </mesh>
        {[...Array(6)].map((_, i) => (
          <mesh key={i} rotation-x={-Math.PI / 2} position={[0, 0.02, (i - 2.5) * 10]}>
            <planeGeometry args={[22, 0.2]} />
            <meshStandardMaterial color="#facc15" />
          </mesh>
        ))}
        <Car position={[-5, 0, -25]} color="#ef4444" />
        <Car position={[5, 0, -15]} color="#3b82f6" />
        <Car position={[-2, 0, 5]} color="#10b981" />
        <Car position={[6, 0, 20]} color="#f59e0b" />
      </group>

      {/* ATTACHED WALKING TRACK */}
      <group position={[-95, 0.05, 0]}>
        <mesh rotation-x={-Math.PI / 2}>
          <planeGeometry args={[8, 80]} />
          <meshStandardMaterial color="#475569" />
        </mesh>
        {[...Array(16)].map((_, i) => (
          <mesh key={i} rotation-x={-Math.PI / 2} position={[0, 0.01, (i - 7.5) * 5]}>
            <planeGeometry args={[6, 1]} />
            <meshStandardMaterial color="#94a3b8" />
          </mesh>
        ))}
        {/* Connector Path fully bridging to Entrance at X: -60 */}
        <mesh rotation-x={-Math.PI / 2} position={[17.5, 0, 25]}>
           <planeGeometry args={[35, 8]} />
           <meshStandardMaterial color="#475569" />
        </mesh>
        <mesh rotation-x={-Math.PI / 2} position={[17.5, 0, -25]}>
           <planeGeometry args={[35, 8]} />
           <meshStandardMaterial color="#475569" />
        </mesh>
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

      {/* FRONT WALL WITH SEPARATE GATES */}
      <group position={[-60, 5, 0]}>
        {/* Main Concrete Sections - Re-centered to allow gaps exactly at Z: 25 and -25 */}
        <mesh position={[0, 0, 0]}> 
          <boxGeometry args={[1.5, 10, 35]} /> 
          <meshStandardMaterial color="#cbd5e1" /> 
        </mesh>
        <mesh position={[0, 0, 36.25]}> 
          <boxGeometry args={[1.5, 10, 7.5]} /> 
          <meshStandardMaterial color="#cbd5e1" /> 
        </mesh>
        <mesh position={[0, 0, -36.25]}> 
          <boxGeometry args={[1.5, 10, 7.5]} /> 
          <meshStandardMaterial color="#cbd5e1" /> 
        </mesh>
        
        {/* Gate Frames */}
        <mesh position={[0, 4, 25]}> <boxGeometry args={[2, 2, 15]} /> <meshStandardMaterial color="#475569" /> </mesh>
        <mesh position={[0, 4, -25]}> <boxGeometry args={[2, 2, 15]} /> <meshStandardMaterial color="#475569" /> </mesh>
        
        {/* Glass Doors - Sliding Open */}
        {/* Domestic Gate Panels */}
        <mesh position={[0, -1, 30]}> 
          <boxGeometry args={[0.2, 8, 5]} /> 
          <meshStandardMaterial color="#38bdf8" transparent opacity={0.3} /> 
        </mesh>
        <mesh position={[0, -1, 20]}> 
          <boxGeometry args={[0.2, 8, 5]} /> 
          <meshStandardMaterial color="#38bdf8" transparent opacity={0.3} /> 
        </mesh>

        {/* International Gate Panels */}
        <mesh position={[0, -1, -30]}> 
          <boxGeometry args={[0.2, 8, 5]} /> 
          <meshStandardMaterial color="#38bdf8" transparent opacity={0.3} /> 
        </mesh>
        <mesh position={[0, -1, -20]}> 
          <boxGeometry args={[0.2, 8, 5]} /> 
          <meshStandardMaterial color="#38bdf8" transparent opacity={0.3} /> 
        </mesh>

        <Html position={[0, 6, 25]} center distanceFactor={12}>
           <div className="bg-blue-600 text-white px-8 py-3 rounded-2xl border-4 border-white shadow-2xl font-black text-sm tracking-tighter uppercase">
             Domestic Gate
           </div>
        </Html>
        <Html position={[0, 6, -25]} center distanceFactor={12}>
           <div className="bg-indigo-900 text-white px-8 py-3 rounded-2xl border-4 border-white shadow-2xl font-black text-sm tracking-tighter uppercase">
             International Gate
           </div>
        </Html>
      </group>

      {/* ARCHITECTURAL ZONE SEPARATOR (Glass Top) */}
      <group position={[-40, 8.5, 0]}>
        <mesh>
          <boxGeometry args={[10, 1, 80]} />
          <meshStandardMaterial color="#38bdf8" transparent opacity={0.3} />
        </mesh>
      </group>

      {/* DYNAMIC CHECK-IN ISLANDS */}
      <group position={[-40, 0, 25]}>
        <Html position={[0, 4.5, 0]} center distanceFactor={10}>
          <div className="bg-blue-600 text-white px-3 py-1 rounded-full font-black text-[10px] border-2 border-white shadow-lg">DOMESTIC ZONE</div>
        </Html>
        {[...Array(domesticCount)].map((_, i) => {
          const row = Math.floor(i / 5);
          const col = i % 5;
          const countInRow = Math.min(5, domesticCount - row * 5);
          return (
            <CheckInCounter 
              key={`dom-${i}`} 
              position={[row * -6, 0, (col - (countInRow - 1) / 2) * 6]} 
              color="bg-blue-500" 
              label={`D${i+1}`} 
            />
          );
        })}
      </group>

      <group position={[-40, 0, -25]}>
        <Html position={[0, 4.5, 0]} center distanceFactor={10}>
          <div className="bg-indigo-800 text-white px-3 py-1 rounded-full font-black text-[10px] border-2 border-white shadow-lg">INTERNATIONAL ZONE</div>
        </Html>
        {[...Array(internationalCount)].map((_, i) => {
          const row = Math.floor(i / 5);
          const col = i % 5;
          const countInRow = Math.min(5, internationalCount - row * 5);
          return (
            <CheckInCounter 
              key={`intl-${i}`} 
              position={[row * -6, 0, (col - (countInRow - 1) / 2) * 6]} 
              color="bg-indigo-600" 
              label={`I${i+1}`} 
            />
          );
        })}
      </group>

      <group position={[-15, 0, 0]}>
        {[...Array(simParams.security_counters)].map((_, i) => {
          const maxPerRow = 6;
          const row = Math.floor(i / maxPerRow);
          const col = i % maxPerRow;
          const countInRow = Math.min(maxPerRow, simParams.security_counters - row * maxPerRow);
          return (
            <CustomSecurityScanner 
              key={i}
              position={[row * -8, 0, (col - (countInRow - 1) / 2) * 12]}
              isNight={isNight}
            />
          );
        })}
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

      <CustomRunway position={[70, 0, 0]} isNight={isNight} />
    </group>
  );
};

useGLTF.preload('/models/tree.glb');

export default Infrastructure;
