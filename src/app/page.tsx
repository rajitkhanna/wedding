"use client";

import { RoseHero } from "@/components/three/RoseHero";
import { NavCards } from "@/components/home/NavCards";

export default function Home() {
  return (
    <main style={{ backgroundColor: "var(--color-bg)" }}>
      <RoseHero />
      <NavCards />
    </main>
  );
}
