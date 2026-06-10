"use client";

import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';
import { useSimulation } from '@/context/SimulationContext';

interface PassengerProps {
  id: string;
  type: 'international' | 'domestic';
  activeStage: number;
  slotIndex: number;
}

// Stage Positions (X, Y, Z) - Realigned for larger gaps
const STAGE_POSITIONS = [
  new THREE.Vector3(-55, 0.1, 0),   // 0: Entrance
  new THREE.Vector3(-35, 0.1, 0),   // 1: Check-in
  new THREE.Vector3(-10, 0.1, 0),   // 2: Security
  new THREE.Vector3(20, 0.1, 0),    // 3: Waiting Lounge
  new THREE.Vector3(40, 0.1, 0),    // 4: Boarding Gate
  new THREE.Vector3(55, 0.1, 0),    // 5: Plane Standing
  new THREE.Vector3(80, 0.1, 0),    // 6: Taking Off (Follow plane)
];

const Passenger: React.FC<PassengerProps> = ({ id, type, activeStage, slotIndex }) => {
  const group = useRef<THREE.Group>(null);
  const { simParams, isPlaneReady, isFlying } = useSimulation();
  const { scene, animations } = useGLTF('/models/Passengers.glb');
  
  const clonedScene = useMemo(() => scene.clone(), [scene]);
  const { actions, names } = useAnimations(animations, group);

  useEffect(() => {
    if (names.length > 0) {
      const walkAnim = names.find(n => n.toLowerCase().includes('walk'));
      const idleAnim = names.find(n => n.toLowerCase().includes('idle'));
      
      // Idle in Check-in (1), Security (2), Lounge (3), and Inside Plane (5)
      const isWaiting = [1, 2, 3, 5].includes(activeStage);
      const animToPlay = isWaiting ? (idleAnim || names[0]) : (walkAnim || names[0]);
      
      if (actions[animToPlay]) {
        actions[animToPlay].reset().fadeIn(0.5).play();
      }
      return () => { actions[animToPlay]?.fadeOut(0.5); };
    }
  }, [actions, names, activeStage]);
  
  const jitter = useMemo(() => new THREE.Vector3(
    (Math.random() - 0.5) * 0.4,
    0,
    (Math.random() - 0.5) * 0.4
  ), []);

  useFrame((state) => {
    if (!group.current) return;
    
    const basePos = STAGE_POSITIONS[activeStage] || STAGE_POSITIONS[0];
    const target = basePos.clone();

    if (activeStage === 1) { // Check-in
      const counterIndex = slotIndex % 4;
      const queuePos = Math.floor(slotIndex / 4);
      target.set(-35 - (queuePos * 2), 0.1, (counterIndex - 1.5) * 4);
    } else if (activeStage === 2) { // Security
      const numLanes = simParams.security_counters;
      const laneIndex = slotIndex % numLanes;
      const queuePos = Math.floor(slotIndex / numLanes);
      target.set(-10 - (queuePos * 2), 0.1, (laneIndex - (numLanes - 1) / 2) * 10);
    } else if (activeStage === 3) { // Lounge
      const row = slotIndex % 2;
      const seatIdx = Math.floor(slotIndex / 2) % 5;
      target.set(20 + (row - 0.5) * 6, 0.1, (seatIdx - 2) * 3);
    } else if (activeStage === 5) { // Inside Plane
      target.set(55, 1.2, (slotIndex % 3 - 1) * 0.5); // Inside plane hull
    } else if (activeStage === 6 && isFlying) { // Moving with taking-off plane
      // This is a bit complex as the plane is moving. We can hide passengers or move them.
      group.current.visible = false; 
    } else if (activeStage === 0) { // Entrance
      target.set(-55 - (slotIndex * 1.5), 0.1, 0);
    }

    target.add(jitter);
    group.current.position.lerp(target, 0.03);
    
    const lookTarget = target.clone();
    lookTarget.y = group.current.position.y;
    if (group.current.position.distanceTo(lookTarget) > 0.1) {
      group.current.lookAt(lookTarget);
    }
  });

  return (
    <group ref={group} dispose={null}>
      <primitive 
        object={clonedScene} 
        scale={0.8}
        rotation={[0, Math.PI / 2, 0]} 
        position={[0, 1.8, 0]} 
      />
    </group>
  );
};

// Preload the model
useGLTF.preload('/models/Passengers.glb');

export default Passenger;
