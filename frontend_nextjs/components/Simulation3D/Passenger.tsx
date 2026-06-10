"use client";

import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';

interface PassengerProps {
  id: string;
  type: 'international' | 'domestic';
  activeStage: number;
  slotIndex: number;
}

// Stage Positions (X, Y, Z)
const STAGE_POSITIONS = [
  new THREE.Vector3(-25, 0, 0),   // 0: Entrance
  new THREE.Vector3(-10, 0, -5),  // 1: Check-in
  new THREE.Vector3(0, 0, 0),     // 2: Security
  new THREE.Vector3(10, 0, 5),    // 3: Duty Free
  new THREE.Vector3(20, 0, 0),    // 4: Boarding
  new THREE.Vector3(35, 0, -10),  // 5: Takeoff/Exit
];

const Passenger: React.FC<PassengerProps> = ({ id, type, activeStage, slotIndex }) => {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF('/models/passenger.glb');
  
  // Clone scene for each passenger instance
  const clonedScene = useMemo(() => scene.clone(), [scene]);
  const { actions, names } = useAnimations(animations, group);

  // Play animation if available
  useEffect(() => {
    if (names.length > 0) {
      // Try to find a walk or idle animation
      const walkAnim = names.find(n => n.toLowerCase().includes('walk'));
      const idleAnim = names.find(n => n.toLowerCase().includes('idle'));
      
      const animToPlay = walkAnim || idleAnim || names[0];
      if (actions[animToPlay]) {
        actions[animToPlay].reset().fadeIn(0.5).play();
      }
    }
  }, [actions, names]);
  
  // Random slight jitter so they don't look like robots
  const jitter = useMemo(() => new THREE.Vector3(
    (Math.random() - 0.5) * 0.4,
    0,
    (Math.random() - 0.5) * 0.4
  ), []);

  const color = type === 'international' ? '#8b5cf6' : '#f97316';
  
  useFrame((state) => {
    if (!group.current) return;
    
    const basePos = STAGE_POSITIONS[activeStage] || STAGE_POSITIONS[0];
    const target = basePos.clone();

    // Queuing Logic: Offset based on slotIndex
    if (activeStage === 1 || activeStage === 2) {
      const rowSize = 5;
      const row = Math.floor(slotIndex / rowSize);
      const col = slotIndex % rowSize;
      
      if (activeStage === 1) { // Check-in: Line up behind counters
        target.add(new THREE.Vector3(-row * 1.5, 0, col * 0.8));
      } else { // Security: Line up in front of lanes
        target.add(new THREE.Vector3(-row * 1.5, 0, (col - 2) * 1.2));
      }
    } else {
      const scatter = new THREE.Vector3(
        Math.sin(parseInt(id)) * 4,
        0,
        Math.cos(parseInt(id)) * 4
      );
      target.add(scatter);
    }

    target.add(jitter);
    
    // Smooth transition to target
    group.current.position.lerp(target, 0.03);
    
    // Gentle bobbing effect (reduced since we might have animations)
    if (names.length === 0) {
      group.current.position.y = Math.sin(state.clock.elapsedTime * 3 + parseInt(id) * 0.2) * 0.02;
    }

    // Look at target direction
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
        scale={0.5} 
        rotation={[0, Math.PI, 0]} // Adjust rotation if model faces wrong way
      />
      {/* Optional: Add a small indicator for international vs domestic */}
      <mesh position={[0, 2.2, 0]}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
};

// Preload the model
useGLTF.preload('/models/passenger.glb');

export default Passenger;
