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

// Stage Positions (X, Y, Z) - Realigned to Z-axis takeoff path
const STAGE_POSITIONS = [
  new THREE.Vector3(-100, 0.1, 0),  // 0: Road
  new THREE.Vector3(-40, 0.1, 0),   // 1: Check-in
  new THREE.Vector3(-15, 0.1, 0),   // 2: Security
  new THREE.Vector3(22, 0.1, 0),    // 3: Waiting Lounge
  new THREE.Vector3(35, 0.1, 0),    // 4: Boarding Gate (In Observation Glass Wall)
  new THREE.Vector3(70, 1.2, 0),    // 5: Inside Plane (At New Runway Position)
  new THREE.Vector3(70, 20, -150),  // 6: Taking Off (Flying Away into the screen)
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

    // CUSTOM PATHING LOGIC
    if (activeStage === 0) { // Road
      const isParking = slotIndex % 2 === 0;
      target.set(isParking ? -85 : -110, 0.1, ((slotIndex % 15) - 7) * 4);
    } else if (activeStage === 1) { // Check-in Islands
      const isDomestic = type === 'domestic';
      const numCheckin = simParams.checkin_counters || 4;
      const dCount = Math.ceil(numCheckin / 2);
      const iCount = Math.floor(numCheckin / 2);
      const count = isDomestic ? dCount : iCount;
      
      const counterIndex = slotIndex % Math.max(1, count);
      const row = Math.floor(counterIndex / 5);
      const col = counterIndex % 5;
      const countInRow = Math.min(5, count - row * 5);
      
      const islandX = -40;
      const islandZ = isDomestic ? 25 : -25;
      
      target.set(
        islandX + (row * -6), 
        0.1, 
        islandZ + (col - (countInRow - 1) / 2) * 6
      );
    } else if (activeStage === 2) { // Security
      const numLanes = simParams.security_counters;
      const maxPerRow = 6;
      const laneIndex = slotIndex % numLanes;
      
      const row = Math.floor(laneIndex / maxPerRow);
      const col = laneIndex % maxPerRow;
      const countInRow = Math.min(maxPerRow, numLanes - row * maxPerRow);
      const queuePos = Math.floor(slotIndex / numLanes);

      target.set(
        -15 + (row * -8) - (queuePos * 2), 
        0.1, 
        (col - (countInRow - 1) / 2) * 12
      );
    } else if (activeStage === 3) { // Lounge Entrance
      const currentX = group.current.position.x;
      if (currentX < 11) {
        target.set(10.5, 0.1, 0); // Walk through entrance door center
      } else {
        const row = slotIndex % 3;
        const seatIdx = Math.floor(slotIndex / 3) % 6;
        target.set(22 + (row - 1) * 6, 0.1, (seatIdx - 2.5) * 6);
      }
    } else if (activeStage === 4) { // Boarding Gate (In Glass Wall)
      target.set(35, 0.1, 0);
    } else if (activeStage === 5) { // Inside Plane (At New Runway Position)
      target.set(70, 1.2, (slotIndex % 3 - 1) * 0.5);
    } else if (activeStage === 6) {
      if (isFlying) {
         group.current.visible = false; 
      }
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
        position={[0, 1, 0]} 
      />
    </group>
  );
};

useGLTF.preload('/models/Passengers.glb');

export default Passenger;
