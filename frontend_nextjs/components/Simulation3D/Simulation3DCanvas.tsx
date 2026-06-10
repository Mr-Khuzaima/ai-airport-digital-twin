"use client";

import React, { useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Sky, Stars, Environment, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { Maximize2 } from 'lucide-react';
import { useSimulation } from '@/context/SimulationContext';
import Passenger from './Passenger';
import Infrastructure from './Infrastructure';

const Aircraft = ({ isFlying }: { isFlying: boolean }) => {
  const { scene } = useGLTF('/models/airplane.glb');
  const meshRef = React.useRef<THREE.Group>(null);
  
  // Clone scene so we don't interfere with other instances if any
  const clonedScene = useMemo(() => scene.clone(), [scene]);

  useFrame((state) => {
    if (!meshRef.current) return;
    if (isFlying) {
      // Taxi phase: Move straight along X-axis (horizontal)
      const taxiDistance = 15;
      const currentX = meshRef.current.position.x;
      
      meshRef.current.position.x += 0.8;
      
      if (currentX > 40 + taxiDistance) {
        // Liftoff phase
        meshRef.current.position.y += 0.15;
        // Pitch up (rotate around Z axis for X-axis movement)
        meshRef.current.rotation.z = Math.min(meshRef.current.rotation.z + 0.003, 0.2);
      }
    } else {
      // Parked on runway start (X: 40)
      meshRef.current.position.set(40, 0.5, 0);
      meshRef.current.rotation.set(0, Math.PI / 2, 0); // Facing +X
      meshRef.current.rotation.z = 0;
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

const Simulation3DCanvas = () => {
  const { passengers, simType, isFlying } = useSimulation();
  const containerRef = React.useRef<HTMLDivElement>(null);

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
        <PerspectiveCamera makeDefault position={[-30, 25, 40]} fov={45} />
        <OrbitControls 
          enableDamping 
          dampingFactor={0.05}
          maxPolarAngle={Math.PI / 2.2} 
          minDistance={15}
          maxDistance={80}
        />
        
        <Sky sunPosition={[100, 20, 100]} />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        <Environment preset="city" />

        <Infrastructure />
        <Aircraft isFlying={isFlying} />

        {passengers.map((p) => (
          <Passenger 
            key={p.id} 
            id={p.id} 
            type={p.type} 
            activeStage={p.stage} 
            slotIndex={p.slotIndex}
          />
        ))}
      </Canvas>

      {/* Fullscreen Button */}
      <button 
        onClick={toggleFullScreen}
        className="absolute top-8 right-8 p-3 bg-white/80 backdrop-blur-md rounded-xl border border-white/20 shadow-lg hover:bg-white transition-colors pointer-events-auto group z-10"
      >
        <Maximize2 className="w-5 h-5 text-slate-600 group-hover:text-brand-600 transition-colors" />
      </button>

      {/* 3D UI Overlay */}
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
