"use client";

import { useRef, useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

interface RoseProps {
  scrollProgress: number;
}

useGLTF.preload("/red_rose_opt.glb");

// Cubic ease-out: fast start, gentle finish
function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

// Cubic ease-in-out
function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function Rose({ scrollProgress }: RoseProps) {
  const groupRef = useRef<THREE.Group>(null);
  const cloneRef = useRef<THREE.Group | null>(null);
  const { scene } = useGLTF("/red_rose_opt.glb");

  // Clip plane: normal points DOWN so it clips everything ABOVE the plane.
  // constant moves from modelMin (nothing visible) → modelMax (fully visible).
  // We'll set the actual bounds after we measure the model in useEffect.
  const clipPlane = useMemo(
    () => new THREE.Plane(new THREE.Vector3(0, -1, 0), 0),
    [],
  );

  // Store measured world-space Y bounds of the model
  const boundsRef = useRef({ min: -2.2, max: 1.2 });

  useEffect(() => {
    const clone = scene.clone(true);

    // Center + fit into ~3.2-unit tall box
    const box = new THREE.Box3().setFromObject(clone);
    const center = new THREE.Vector3();
    box.getCenter(center);
    const size = new THREE.Vector3();
    box.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z);
    const uniformScale = 3.2 / maxDim;
    clone.scale.setScalar(uniformScale);
    clone.position.sub(center.multiplyScalar(uniformScale));

    // Measure world bounds after scaling (group sits at y=-0.5)
    const scaledBox = new THREE.Box3().setFromObject(clone);
    boundsRef.current = {
      min: scaledBox.min.y - 0.5, // account for group position
      max: scaledBox.max.y - 0.5,
    };

    // Start clip at the very bottom so nothing is visible at scroll=0
    clipPlane.constant = boundsRef.current.min;

    // Upgrade materials: apply clip plane + physical properties
    clone.traverse((obj) => {
      if (!(obj instanceof THREE.Mesh)) return;
      obj.castShadow = true;
      obj.receiveShadow = true;

      const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
      obj.material = mats.map((m: THREE.Material) => {
        const src = m as THREE.MeshStandardMaterial;
        return new THREE.MeshPhysicalMaterial({
          map: src.map ?? null,
          normalMap: src.normalMap ?? null,
          roughnessMap: src.roughnessMap ?? null,
          metalnessMap: src.metalnessMap ?? null,
          aoMap: src.aoMap ?? null,
          color: src.color,
          roughness: src.roughness ?? 0.45,
          metalness: src.metalness ?? 0.0,
          emissive: new THREE.Color("#0a0002"),
          emissiveIntensity: 0,
          side: THREE.DoubleSide,
          clearcoat: 0.4,
          clearcoatRoughness: 0.25,
          sheen: 0.6,
          sheenRoughness: 0.45,
          sheenColor: new THREE.Color("#ff9aaa"),
          envMapIntensity: 1.2,
          // Clip plane: reveals from root (bottom) → flower (top) as scroll increases
          clippingPlanes: [clipPlane],
          clipShadows: true,
        });
      });
      if (obj.material instanceof Array && obj.material.length === 1) {
        obj.material = obj.material[0];
      }
    });

    cloneRef.current = clone;

    if (groupRef.current) {
      while (groupRef.current.children.length) {
        groupRef.current.remove(groupRef.current.children[0]);
      }
      groupRef.current.add(clone);
    }
  }, [scene, clipPlane]);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;

    const { min, max } = boundsRef.current;

    // --- Clip plane: stem grows first (0→0.55), then flower opens (0.55→1) ---
    // Two-phase easing so the stem/leaves appear before the flower blooms
    let clipProgress: number;
    if (scrollProgress < 0.55) {
      // Stem phase: fast reveal up to ~70% of model height
      clipProgress = easeOutCubic(scrollProgress / 0.55) * 0.7;
    } else {
      // Flower phase: remaining 30% of model (the flower head)
      clipProgress = 0.7 + easeInOutCubic((scrollProgress - 0.55) / 0.45) * 0.3;
    }
    clipPlane.constant = min + (max - min) * clipProgress;

    // --- Rise up: start below frame, settle into resting position ---
    // At scroll=0, rose is offscreen below; by scroll=0.3 it's fully in frame
    const riseProgress = Math.min(1, scrollProgress / 0.35);
    const riseEased = easeOutCubic(riseProgress);
    groupRef.current.position.y = -0.5 + (1 - riseEased) * -4.5;

    // --- Scale: bud grows from near-zero to full ---
    // Lags slightly behind the clip so the "seed" feel is maintained
    const growProgress = Math.max(0, (scrollProgress - 0.05) / 0.95);
    const growEased = easeOutCubic(growProgress);
    const growScale = 0.04 + growEased * 0.96;

    // Breathing pulse layered on top once rose is mostly grown
    const pulse = growProgress > 0.6
      ? Math.sin(clock.elapsedTime * 0.75) * 0.02 * growProgress + 1
      : 1;

    groupRef.current.scale.setScalar(growScale * pulse);

    // --- Subtle tilt: starts slightly leaning, straightens as it blooms ---
    const tiltEased = easeInOutCubic(Math.min(1, scrollProgress / 0.6));
    groupRef.current.rotation.z = (1 - tiltEased) * 0.25;

    // --- Emissive bloom: kicks in during the flower-open phase ---
    if (cloneRef.current) {
      const bloomIntensity = Math.max(0, (scrollProgress - 0.5) / 0.5);
      cloneRef.current.traverse((obj) => {
        if (!(obj instanceof THREE.Mesh)) return;
        const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
        mats.forEach((mat) => {
          if ((mat as THREE.MeshPhysicalMaterial).isMeshPhysicalMaterial) {
            (mat as THREE.MeshPhysicalMaterial).emissiveIntensity =
              bloomIntensity * 0.45;
          }
        });
      });
    }
  });

  return <group ref={groupRef} position={[0, -0.5, 0]} />;
}
