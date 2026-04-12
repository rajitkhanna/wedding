"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import {
  EffectComposer,
  Bloom,
  Vignette,
} from "@react-three/postprocessing";
import { Rose } from "./Rose";
import { GoldParticles } from "./GoldParticles";
import { HeroPresence } from "@/components/presence/HeroPresence";

export function RoseHero() {
  return (
    <div
      className="relative w-full"
      style={{
        height: "100vh",
        background:
          "linear-gradient(180deg, #0a0508 0%, #150810 40%, #1a0a12 70%, #0d0608 100%)",
      }}
    >
      <Canvas
        shadows
        camera={{ position: [0, 0.5, 5.5], fov: 38 }}
        gl={{ antialias: true, alpha: true, toneMapping: 1 /* LinearToneMapping */ }}
      >
        <fog attach="fog" args={["#0a0508", 6, 18]} />

        <ambientLight intensity={0.6} color="#ffeeee" />

        {/* Key: warm gold from above */}
        <directionalLight
          position={[2, 6, 4]}
          color="#fff5e0"
          intensity={1.5}
          castShadow
          shadow-mapSize={[2048, 2048]}
        />

        {/* Fill: soft pink from the right */}
        <directionalLight
          position={[-3, 2, 3]}
          color="#ffaaaa"
          intensity={0.8}
        />

        {/* Rim: dark crimson from behind */}
        <directionalLight
          position={[0, 2, -4]}
          color="#660011"
          intensity={0.5}
        />

        <Rose />
        <GoldParticles scrollProgress={1} />

        <EffectComposer>
          <Bloom
            luminanceThreshold={0.75}
            luminanceSmoothing={0.9}
            intensity={0.6}
            mipmapBlur
            radius={0.6}
          />
          <Vignette darkness={0.65} offset={0.25} />
        </EffectComposer>

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.25}
          maxPolarAngle={Math.PI * 0.55}
          minPolarAngle={Math.PI * 0.35}
        />
      </Canvas>

      {/* Names overlay — always visible */}
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-center px-6">
          <h1
            className="text-7xl md:text-9xl tracking-wider"
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--color-gold)",
              textShadow:
                "0 0 80px rgba(201,168,76,0.6), 0 0 160px rgba(201,168,76,0.35)",
              lineHeight: 1.0,
            }}
          >
            Meghana
          </h1>
          <div
            className="mx-auto my-6 h-px w-40"
            style={{
              background:
                "linear-gradient(90deg, transparent, var(--color-gold), transparent)",
            }}
          />
          <h1
            className="text-7xl md:text-9xl tracking-wider"
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--color-gold)",
              textShadow:
                "0 0 80px rgba(201,168,76,0.6), 0 0 160px rgba(201,168,76,0.35)",
              lineHeight: 1.0,
            }}
          >
            &amp; Rajit
          </h1>
          <p
            className="mt-10 text-xl md:text-2xl tracking-[0.5em] uppercase"
            style={{
              color: "var(--color-text-muted)",
              textShadow: "0 0 30px rgba(255,255,255,0.15)",
            }}
          >
            November 28, 2026
          </p>
          <p
            className="mt-3 text-sm md:text-base tracking-[0.3em]"
            style={{ color: "var(--color-text-dim)" }}
          >
            Boston, Massachusetts
          </p>
        </div>
        <HeroPresence />
      </div>
    </div>
  );
}
