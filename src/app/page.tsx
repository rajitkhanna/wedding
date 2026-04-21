"use client";

import { useEffect } from "react";
import { HeroSection } from "@/components/home/HeroSection";
import { FAQSection } from "@/components/sections/FAQSection";
import { RegistrySection } from "@/components/sections/RegistrySection";

function Divider() {
  return (
    <div className="flex items-center justify-center py-4">
      <div
        className="h-px w-24"
        style={{ backgroundColor: "var(--color-border-gold)", opacity: 0.35 }}
      />
    </div>
  );
}

export default function Home() {
  useEffect(() => {
    if (window.location.hash) {
      window.history.replaceState(null, "", window.location.pathname + window.location.search);
    }
    if (window.sessionStorage.getItem("scroll-to-schedule") !== "true") return;
    window.sessionStorage.removeItem("scroll-to-schedule");
    document.getElementById("schedule")?.scrollIntoView({ behavior: "smooth" });
    window.history.replaceState(null, "", "/");
  }, []);

  return (
    <main style={{ backgroundColor: "var(--color-bg)" }}>
      <HeroSection />
      <Divider />
      <FAQSection />
      {/* <Divider />
      <RegistrySection /> */}
    </main>
  );
}
