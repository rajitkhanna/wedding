"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

useGLTF.preload("/red_rose_smaller_orig.glb");

interface RoseProps {
  scrollProgress?: number;
}

export function Rose({ scrollProgress = 0 }: RoseProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF("/red_rose_smaller_orig.glb");

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.elapsedTime;
    const pulse = Math.sin(t * 0.75) * 0.018 + 1;
    const bloom = 1 + scrollProgress * 0.3;
    groupRef.current.scale.setScalar(pulse * bloom);
  });

  const box = new THREE.Box3().setFromObject(scene);
  const center = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3());
  const maxDim = Math.max(size.x, size.y, size.z);
  const s = 3.0 / maxDim;

  return (
    <group
      ref={groupRef}
      position={[0, -0.5 - scrollProgress * 0.3, 0]}
      rotation={[0, scrollProgress * 0.5, 0]}
    >
      <primitive
        object={scene}
        scale={s}
        position={[-center.x * s, -center.y * s, -center.z * s]}
      />
    </group>
  );
}
