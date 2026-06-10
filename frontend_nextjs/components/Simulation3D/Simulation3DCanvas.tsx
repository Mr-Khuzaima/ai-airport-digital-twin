"use client";

import React, { useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Sky, Stars, Environment, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
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
      meshRef.current.position.x += 0.4;
      meshRef.current.position.y += 0.08;
      meshRef.current.rotation.z = Math.min(meshRef.current.rotation.z + 0.001, 0.1);
    } else {
      meshRef.current.position.set(-60, 0.5, -30);
      meshRef.current.rotation.set(0, Math.PI / 2, 0);
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
  const { metrics, simType, activeStage, isFlying } = useSimulation();

  // Generate passengers based on metrics
  const passengers = useMemo(() => {
    // Increase count based on flight load parameter
    const baseCount = 15;
    const multiplier = metrics.activeFleet / 20; 
    const count = Math.min(120, Math.floor(baseCount * multiplier));
    
    return Array.from({ length: count }, (_, i) => ({
      id: i.toString(),
      type: i % 2 === 0 ? 'international' : 'domestic',
      slotIndex: i
    }));
  }, [metrics.activeFleet]);

  return (
    <div className="w-full h-[600px] bg-slate-100 rounded-[2.5rem] overflow-hidden shadow-inner relative border border-slate-200">
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
            type={simType} 
            activeStage={activeStage} 
            slotIndex={p.slotIndex}
          />
        ))}
      </Canvas>

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
