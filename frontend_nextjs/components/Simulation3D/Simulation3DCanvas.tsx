"use client";

import React, { useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Sky, Stars, Environment, useGLTF, Html } from '@react-three/drei';
import * as THREE from 'three';
import { Maximize2, Loader2 } from 'lucide-react';
import { useSimulation } from '@/context/SimulationContext';
import Passenger from './Passenger';
import Infrastructure from './Infrastructure';

const LoadingState = () => (
  <Html center>
    <div className="flex flex-col items-center gap-3 bg-white/90 backdrop-blur-md px-8 py-4 rounded-3xl shadow-2xl border border-white/20">
      <Loader2 className="w-8 h-8 text-brand-600 animate-spin" />
      <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest whitespace-nowrap">Loading Assets...</p>
    </div>
  </Html>
);

const Aircraft = ({ isFlying, isPlaneReady }: { isFlying: boolean, isPlaneReady: boolean }) => {
  const { scene } = useGLTF('/models/airplane.glb');
  const meshRef = React.useRef<THREE.Group>(null);
  const [takeoffStarted, setTakeoffStarted] = React.useState(false);

  const clonedScene = useMemo(() => scene.clone(), [scene]);

  useFrame((state) => {
    if (!meshRef.current) return;

    if (isFlying) {
      if (!takeoffStarted) {
        // Start takeoff from the runway position (X: 70)
        meshRef.current.position.set(70, 0.5, 0);
        meshRef.current.rotation.set(0, Math.PI / 2, 0); 
        setTakeoffStarted(true);
      }

      // Movement: Straight away from user (-Z direction)
      meshRef.current.position.z -= 0.8;
      const distanceTraveled = Math.abs(meshRef.current.position.z);

      if (distanceTraveled > 40) {
        meshRef.current.position.y += 0.15;
        // Pitch up for -Z movement involves rotating the X axis
        meshRef.current.rotation.x = Math.max(meshRef.current.rotation.x - 0.005, -0.25);
      }
    } else if (isPlaneReady) {
      setTakeoffStarted(false);
      // PARKED ON RUNWAY: Aligned with runway center (X: 70)
      meshRef.current.position.set(70, 0.5, 0);
      
      // ROTATED 180 DEGREES
      meshRef.current.rotation.set(0, Math.PI / 2, 0); 
      meshRef.current.rotation.x = 0;
    } else {
      setTakeoffStarted(false);
      meshRef.current.position.set(300, 0, 0);
    }
  });

  return (
    <primitive 
      ref={meshRef} 
      object={clonedScene} 
      scale={0.012} 
    />
  );
};

const Moon = ({ position }: { position: [number, number, number] }) => (
  <group position={position}>
    <mesh>
      <sphereGeometry args={[15, 32, 32]} />
      <meshStandardMaterial 
        color="#fefce8" 
        emissive="#fefce8" 
        emissiveIntensity={4} 
      />
    </mesh>
    <pointLight intensity={200} distance={500} color="#fefce8" />
  </group>
);

const Sun = ({ position }: { position: [number, number, number] }) => (
  <group position={position}>
    <mesh>
      <sphereGeometry args={[18, 32, 32]} />
      <meshStandardMaterial 
        color="#fbbf24" 
        emissive="#fbbf24" 
        emissiveIntensity={8} 
      />
    </mesh>
    <pointLight intensity={800} distance={1200} color="#fffbeb" />
  </group>
);

const Simulation3DCanvas = () => {
  const { passengers, isFlying, isPlaneReady, simParams } = useSimulation();
  const containerRef = React.useRef<HTMLDivElement>(null);

  const isNight = simParams.time_of_day < 6 || simParams.time_of_day > 18;

  const sunPosition = useMemo(() => [180, 70, -120], []);
  const moonPosition = useMemo(() => [-180, 70, -120], []);

  const ambientIntensity = useMemo(() => {
    if (!isNight) return 0.8; // Increased for brighter day
    return 0.05;
  }, [isNight]);

  const toggleFullScreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div ref={containerRef} className="w-full h-[600px] bg-slate-100 rounded-[2.5rem] overflow-hidden shadow-inner relative border border-slate-200">
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[-100, 60, 100]} fov={45} />
        <OrbitControls 
          enableDamping 
          dampingFactor={0.05}
          maxPolarAngle={Math.PI / 2.1} 
          minDistance={20}
          maxDistance={200}
        />
        
        <Suspense fallback={<LoadingState />}>
          <Sky 
            sunPosition={sunPosition as [number, number, number]} 
            turbidity={isNight ? 10 : 0.1} // Clearer sky for day
            rayleigh={isNight ? 0.5 : 2}    // Better blue scattering
            mieCoefficient={0.005}
            mieDirectionalG={0.8}
          />
          {isNight && (
            <Moon position={moonPosition as [number, number, number]} />
          )}
          
          <Stars radius={100} depth={50} count={5000} factor={isNight ? 6 : 0} saturation={0} fade speed={1} />
          <Environment preset={isNight ? "night" : "city"} />
          <ambientLight intensity={ambientIntensity} />
          <directionalLight 
            position={sunPosition as [number, number, number]} 
            intensity={isNight ? 0.01 : 1.2} 
            castShadow={!isNight}
            color={isNight ? "#1e1b4b" : "#fffbeb"}
          />

          <Infrastructure />
          <Aircraft isFlying={isFlying} isPlaneReady={isPlaneReady} />

          {passengers.map((p) => (
            <Passenger 
              key={p.id} 
              id={p.id} 
              type={p.type} 
              activeStage={p.stage} 
              slotIndex={p.slotIndex}
            />
          ))}
        </Suspense>
      </Canvas>

      <button 
        onClick={toggleFullScreen}
        className="absolute top-8 right-8 p-3 bg-white/80 backdrop-blur-md rounded-xl border border-white/20 shadow-lg hover:bg-white transition-colors pointer-events-auto group z-10"
      >
        <Maximize2 className="w-5 h-5 text-slate-600 group-hover:text-brand-600 transition-colors" />
      </button>

      <div className="absolute bottom-8 left-8 p-6 bg-white/80 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl pointer-events-none">
        <div className="space-y-1">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Entities</p>
          <p className="text-2xl font-black text-slate-900 tracking-tight">{passengers.length} Agents</p>
        </div>
      </div>
    </div>
  );
};

export default Simulation3DCanvas;
