"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

useGLTF.preload("/red_rose_smaller_orig.glb");

export function Rose() {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF("/red_rose_smaller_orig.glb");

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const pulse = Math.sin(clock.elapsedTime * 0.75) * 0.018 + 1;
    groupRef.current.scale.setScalar(pulse);
  });

  // Fit bounding box to ~3 units
  const box = new THREE.Box3().setFromObject(scene);
  const center = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3());
  const maxDim = Math.max(size.x, size.y, size.z);
  const s = 3.0 / maxDim;

  return (
    <group
      ref={groupRef}
      position={[0, -0.5, 0]}
    >
      <primitive
        object={scene}
        scale={s}
        position={[-center.x * s, -center.y * s, -center.z * s]}
      />
    </group>
  );
}
