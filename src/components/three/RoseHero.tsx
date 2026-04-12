"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import {
  EffectComposer,
  Bloom,
  DepthOfField,
  Vignette,
} from "@react-three/postprocessing";
import { Rose } from "./Rose";
import { GoldParticles } from "./GoldParticles";
import { HeroPresence } from "@/components/presence/HeroPresence";

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

  const overlayOpacity =
    scrollProgress > 0.75 ? (scrollProgress - 0.75) / 0.25 : 0;

  return (
    <div
      className="relative w-full"
      style={{ height: "350vh", backgroundColor: "var(--color-bg)" }}
    >
      <div
        className="sticky top-0 w-full"
        style={{
          height: "100vh",
          background:
            "linear-gradient(180deg, #0a0508 0%, #150810 40%, #1a0a12 70%, #0d0608 100%)",
        }}
      >
        <Canvas
          shadows
          camera={{ position: [0, 0.5, 5.5], fov: 38 }}
          gl={{ antialias: true, alpha: true, localClippingEnabled: true }}
        >
          <fog attach="fog" args={["#0a0508", 6, 18]} />

          {/* IBL — dark/moody environment for the deep red palette */}
          <Environment preset="night" environmentIntensity={0.18} />

          <ambientLight intensity={0.08} color="#1a0508" />

          {/* Key: warm gold from above */}
          <spotLight
            position={[0, 8, 2]}
            color="#ffd070"
            angle={0.45}
            penumbra={0.9}
            intensity={1.8}
            castShadow
            shadow-mapSize={[2048, 2048]}
          />

          {/* Fill: rose-pink from the right */}
          <spotLight
            position={[4, 4, 3]}
            color="#ff6b8a"
            angle={0.6}
            penumbra={0.8}
            intensity={0.9}
          />

          {/* Rim: deep crimson from behind-left */}
          <spotLight
            position={[-4, 3, -3]}
            color="#8b1a2a"
            angle={0.7}
            penumbra={0.9}
            intensity={0.7}
          />

          {/* Under-glow: warm red bounce */}
          <pointLight
            position={[0, -1.5, 2.5]}
            color="#ff2244"
            intensity={0.5}
            distance={8}
          />

          {/* Subtle warm key from front */}
          <directionalLight
            position={[2, 5, 5]}
            color="#fff0e0"
            intensity={0.25}
            castShadow
          />

          <Rose scrollProgress={scrollProgress} />
          <GoldParticles scrollProgress={scrollProgress} />

          <EffectComposer>
            <Bloom
              luminanceThreshold={0.1}
              luminanceSmoothing={0.85}
              intensity={2.5}
              mipmapBlur
              radius={0.9}
            />
            <DepthOfField
              focusDistance={0.01}
              focalLength={0.04}
              bokehScale={scrollProgress * 4}
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

        <div
          className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center"
          style={{
            opacity: overlayOpacity,
            transition: "opacity 0.15s linear",
          }}
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

        <div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 pointer-events-none"
          style={{ opacity: Math.max(0, 1 - scrollProgress * 4) }}
        >
          <div className="flex flex-col items-center gap-3">
            <span
              className="text-xs tracking-[0.3em] uppercase"
              style={{ color: "var(--color-gold)", opacity: 0.8 }}
            >
              Scroll to bloom
            </span>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              style={{ color: "var(--color-gold)" }}
            >
              <path
                d="M12 4v16M5 13l7 7 7-7"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
