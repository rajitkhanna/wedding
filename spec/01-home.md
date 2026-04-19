# Page: Home (`/`)

## Goal
A cinematic landing page. A photorealistic 3D rose blooms open as the user scrolls down.
Below the rose: names, date, and a nav to all sections.

---

## Sections

### 1. 3D Rose Hero (full viewport)
- Canvas fills `100vh`, dark background (`--color-bg`)
- Rose starts as a closed bud; petals open as scroll progress goes 0→1
- Soft gold-tinted rim lighting; warm point light from above
- Names "Meghana & Rajit" fade in over the canvas as rose fully opens
- Wedding date below names (set via environment variable or InstantDB)
- Subtle particle shimmer (gold dust) around the rose at full bloom

### 2. Quick Nav Cards
- 4 cards in a 2×2 grid (mobile) / row (desktop):
  Our Story · Schedule · RSVP · FAQ
- Each card: gold border, hover lifts with glow
- Registry / Travel & Stay in footer instead

### 3. Footer
- Small gold ornament divider
- Registry / FAQ links
- "With love, Meghana & Rajit ♥"

---

## 3D Rose Implementation

### Libraries needed
```bash
bun add @react-three/fiber @react-three/drei three
bun add @react-three/postprocessing   # bloom effect
bun add -d @types/three
```

### Approach: GLTF Model + Morph Targets
1. Source a free rose GLTF with morph targets for bud→bloom (or build procedurally)
   - Option A: custom procedural rose with `THREE.LatheGeometry` for petals (no asset needed)
   - Option B: use a free CC0 rose from Sketchfab, exported as `.glb`, hosted in `/public`
   - **Recommended: Option A** — no external dependency, fully controllable

### Procedural Rose Spec (Option A)
```
RoseScene
  ├── Canvas (r3f, shadows)
  │   ├── ambientLight (intensity 0.3, color #2a0808)
  │   ├── pointLight (position [0,4,2], color #ffd700, intensity 2)
  │   ├── spotLight (position [-3,6,-2], color #ff6b35, angle 0.3)
  │   ├── Rose (custom component)
  │   │   ├── Stem + Leaves (static)
  │   │   └── Petals[0..24] (LatheGeometry, animated)
  │   ├── GoldParticles (Points, animated opacity)
  │   └── EffectComposer > Bloom (luminanceThreshold 0.2, intensity 1.5)
  └── ScrollProgress overlay div (hidden, drives useScroll)
```

### Scroll driver
Use `useScroll` from `@react-three/drei` inside the Canvas, or
use a plain `window.scrollY / documentHeight` ref outside Canvas
and pass `scrollProgress: number` (0→1) as a prop/context to the Rose.

### Petal animation
```ts
// Each petal has an initial closed rotation and a target open rotation
// lerp toward target based on scrollProgress
// Outer petals open first (lower scrollProgress threshold)
// Inner petals open last

const petalLayers = [
  { count: 5, openAngle: Math.PI * 0.6, delay: 0 },     // outer
  { count: 5, openAngle: Math.PI * 0.45, delay: 0.15 },  // mid-outer
  { count: 5, openAngle: Math.PI * 0.3, delay: 0.3 },    // mid-inner
  { count: 5, openAngle: Math.PI * 0.15, delay: 0.45 },  // inner
  { count: 4, openAngle: Math.PI * 0.05, delay: 0.6 },   // core
]
```

### Materials
```ts
const petalMaterial = new THREE.MeshStandardMaterial({
  color: new THREE.Color('#8B1A1A'),   // --color-red
  roughness: 0.4,
  metalness: 0.1,
  side: THREE.DoubleSide,
})
// Add subtle emissive glow at full bloom:
petalMaterial.emissive = new THREE.Color('#3d0505')
petalMaterial.emissiveIntensity = scrollProgress * 0.3
```

---

## Name / Date Overlay

```tsx
// Positioned absolute over canvas, pointer-events-none
// opacity: scrollProgress > 0.7 ? (scrollProgress - 0.7) / 0.3 : 0
<div style={{ opacity }} className="absolute inset-0 flex flex-col items-center justify-center">
  <h1 className="font-display text-6xl text-gold tracking-widest">
    Meghana & Rajit
  </h1>
  <p className="font-body text-text-muted mt-4 text-xl tracking-[0.3em] uppercase">
    {weddingDate}
  </p>
</div>
```

---

## InstantDB Usage
- `db.useQuery({ $files: { $: { where: { path: { $like: "home/%" } } } } })`
  → 2 photos used in the quick-nav cards or as canvas environment textures
- Wedding date can be stored in a `siteConfig` entity (single record) or hardcoded

---

## File Structure
```
src/app/page.tsx                    ← server component, imports RoseHero
src/components/three/RoseHero.tsx   ← 'use client', Canvas wrapper
src/components/three/Rose.tsx       ← procedural rose mesh
src/components/three/GoldParticles.tsx
src/components/home/NavCards.tsx
```
