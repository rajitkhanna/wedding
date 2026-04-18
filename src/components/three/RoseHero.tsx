"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import * as THREE from "three";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { Rose } from "./Rose";
import { GoldParticles } from "./GoldParticles";
import { HeroPresence } from "@/components/presence/HeroPresence";
import { useState, useEffect, useRef } from "react";

export function RoseHero() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const onScroll = () => {
      if (rafRef.current !== null) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        const scrollY = window.scrollY;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? Math.min(1, scrollY / docHeight) : 0;
        setScrollProgress(progress);
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const overlayOpacity = Math.min(1, scrollProgress * 2);
  const roseScale = 1 + scrollProgress * 0.3;
  const roseY = -0.5 - scrollProgress * 0.5;

  return (
    <div
      className="relative w-full"
      style={{
        height: "200vh",
        background:
          "linear-gradient(180deg, #0a0508 0%, #150810 40%, #1a0a12 70%, #0d0608 100%)",
      }}
    >
      <div className="sticky top-0 h-screen">
        <Canvas
          shadows
          camera={{ position: [0, 0.6, 4.8], fov: 42 }}
          gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 0.7 }}
        >
          <fog attach="fog" args={["#0a0508", 6, 18]} />

          <ambientLight
            intensity={0.12 + scrollProgress * 0.08}
            color="#ffdddd"
          />

          <directionalLight
            position={[2, 6, 4]}
            color="#fff5e0"
            intensity={0.7 + scrollProgress * 0.2}
            castShadow
            shadow-mapSize={[2048, 2048]}
          />

          <directionalLight
            position={[-3, 2, 3]}
            color="#ffcccc"
            intensity={0.2 + scrollProgress * 0.1}
          />

          <directionalLight
            position={[0, 2, -4]}
            color="#660011"
            intensity={0.1 + scrollProgress * 0.1}
          />

          <pointLight
            position={[0, 3, 2]}
            color="#ffd700"
            intensity={scrollProgress * 0.6}
            distance={8}
          />

          <Environment preset="sunset" backgroundBlurriness={1} backgroundIntensity={0} environmentIntensity={0.35} />

          <Rose scrollProgress={scrollProgress} />
          <GoldParticles scrollProgress={scrollProgress} />

          <EffectComposer>
            <Bloom
              luminanceThreshold={0.8}
              luminanceSmoothing={0.9}
              intensity={0.3 + scrollProgress * 0.6}
              mipmapBlur
              radius={0.4 + scrollProgress * 0.2}
            />
            <Vignette darkness={0.65 - scrollProgress * 0.2} offset={0.25} />
          </EffectComposer>

          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={0.25 + scrollProgress * 0.1}
            maxPolarAngle={Math.PI * 0.55}
            minPolarAngle={Math.PI * 0.35}
          />
        </Canvas>

        <div
          className="pointer-events-none absolute inset-0 flex flex-col items-center justify-end pb-24"
          style={{ opacity: overlayOpacity, transition: "opacity 0.1s" }}
        >
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
    </div>
  );
}
