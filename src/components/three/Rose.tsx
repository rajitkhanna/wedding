"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

useGLTF.preload("/rose_smaller.glb");

interface RoseProps {
  scrollProgress?: number;
}

export function Rose({ scrollProgress = 0 }: RoseProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF("/rose_smaller.glb");

  // Clone so materials aren't shared across renders
  const clonedScene = useMemo(() => scene.clone(true), [scene]);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.elapsedTime;
    const pulse = Math.sin(t * 0.75) * 0.018 + 1;
    const bloom = 1 + scrollProgress * 0.3;
    groupRef.current.scale.setScalar(pulse * bloom);
  });

  const box = new THREE.Box3().setFromObject(clonedScene);
  const center = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3());
  const maxDim = Math.max(size.x, size.y, size.z);
  const s = 4.0 / maxDim;

  const yOffset = -1.8;

  return (
    <group
      ref={groupRef}
      position={[0, yOffset, 0]}
      rotation={[0, scrollProgress * 0.5, 0]}
    >
      <primitive
        object={clonedScene}
        scale={s}
        position={[-center.x * s, 0, -center.z * s]}
      />
    </group>
  );
}
