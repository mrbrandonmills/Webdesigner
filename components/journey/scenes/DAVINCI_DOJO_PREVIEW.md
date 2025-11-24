# Da Vinci Dojo Scene - Visual Preview

## Scene Overview

**Journey Stop:** WORK (z: -5000)
**Scene Type:** Environmental Vignette (AAA Video Game Quality)
**Dimensions:** 30 units wide × 20 units tall × 25 units deep
**File:** `/components/journey/scenes/davinci-dojo-scene.tsx`

## Top-Down Layout

```
                               NORTH (Back Wall)
                    ╔════════════════════════════════════╗
                    ║   Japanese Calligraphy Scroll      ║
                    ║              (hanging)             ║
                    ╚════════════════════════════════════╝
                                    │
                    ┌───────────────┴───────────────┐
                    │    Back Wall - Weathered      │
         ┌──────┐   │      Plaster (#d4c4b0)        │   ┌──────┐
    WEST │ Anat.│   │                               │   │Arch. │ EAST
         │Frame │   └───────────────────────────────┘   │Sketch│
         │      │                                        │      │
         └──┬───┘                                        └───┬──┘
            │                                                │
        ┌───┴────┐                                      ┌────┴────┐
        │ Shelf  │                                      │  Wing   │
        │ Buddha │                                      │  Chun   │
        │  Bowl  │                                      │ Wooden  │
        └────────┘                                      │ Dummy   │
                                                        │(Mook    │
                                                        │ Jong)   │
            ╔════════════════════════╗                 └─────────┘
            ║   DRAFTING TABLE       ║
            ║  (Center Focal Point)  ║
            ║                        ║
            ║  ┌──────┐  ┌────┐     ║
            ║  │Anatomy│  │Scroll│   ║
            ║  │Drawing│  │Unroll│   ║
            ║  └──────┘  └────┘     ║
            ║                        ║
            ║   Quill  Ink  Compass  ║
            ║    Pen  Bottle Ruler   ║
            ╚════════════════════════╝
                    │   │   │   │
                    └───┴───┴───┘ (Table Legs)

        ┌──────────┐
        │ Books    │
        │ Stack    │
        └──────────┘

    ┌─────────────────────────────────────────┐
    │  FLOOR - Oak Floorboards + Tatami Mats  │
    │           (#4a3a2a wood, #8b7355 mat)   │
    └─────────────────────────────────────────┘

    ┌────────┐
    │Zafu    │  (Meditation Cushion)
    │Cushion │
    └────────┘

                              SOUTH (Viewer)
```

## Side View (Cross Section)

```
    CEILING (invisible - open air)
         │
         │     ┌─────────┐
         │     │ Scroll  │ (Hanging from top)
         │     │ (Callig)│
         │     └────┬────┘
         │          │
    ─────┼──────────┼─────────────  Height: +5
         │     Wall │ Frame  Frame
         │          │   │      │
    ─────┼──────────┴───┴──────┴──  Height: +2
         │
         │   Table  │ Dummy
         │   ╔═══╗  │  ║
    ─────┼───╠═══╣──┼──╟──────────  Height: -1 (Table surface)
         │   ╚═══╝  │  ║
         │   │ │ │  │  ║
    ─────┼───┴─┴─┴──┼──╨──────────  Height: -5 (Floor)
         │ Tatami   │  Base
    ═════╪══════════╪═════════════  Floor Level
         │          │
         │ Cushion  │
```

## Color Palette

**Wood Tones:**
- Aged Oak: `#4a3a2a` (dark, weathered)
- Medium Oak: `#5a4632` (table legs, dummy)
- Light Oak: `#6b5638` (table top)

**Parchment & Paper:**
- Warm Cream: `#f5e6d3` (anatomical drawings)
- Light Cream: `#f0e1d0` (scroll paper)
- Off-White: `#f8f4e8` (calligraphy scroll)

**Metals (Brass/Gold):**
- Dark Gold: `#b8860b` (compass, bowl)
- Gold: `#d4af37` (Buddha, accent lighting)

**Accents:**
- Black: `#1a1a1a` (ink, borders)
- Purple: `#4a1a4a` (meditation cushion)
- Tatami: `#8b7355` (straw mat)

**Lighting:**
- Candlelight: `#ffa500` (warm orange)
- Warm White: `#ffecd2` (golden hour)
- Soft Fill: `#f5e6d3` (ambient cream)

## Object Inventory

### Central Drafting Table
- **Table Top:** 8×0.3×5 units (aged oak with clearcoat)
- **4 Table Legs:** Cylindrical, 0.15-0.2 radius, 3 units tall
- **On Surface:**
  - Leonardo anatomical drawing (2.5×3 parchment)
  - Partially unrolled blueprint scroll (2 units wide)
  - Quill pen (1.2 units tall, white feather)
  - Glass ink bottle (0.25 radius, cork stopper)
  - Brass compass (drafting tool, dual arms)
  - Wooden ruler (2.5 units long)
  - Brush painting supplies (ink stone, brushes)

### Wall Elements
- **Back Wall:** 30×20 planeGeometry (weathered plaster)
- **Anatomical Frame:** 2.5×3.5 with parchment insert (left wall, 45° rotation)
- **Architectural Sketch:** 2.8×2.2 with paper insert (right wall, -45° rotation)
- **Calligraphy Scroll:** 1.2×4 hanging scroll with wooden bars top/bottom
- **Shelf + Buddha:** Wood shelf (2×0.15×0.8) with brass Buddha statue
- **Singing Bowl:** 0.3 radius hemisphere (golden brass)

### Training Equipment
- **Wing Chun Dummy:**
  - Main post: 0.4 radius × 6 height cylinder
  - Upper arms (2): 0.15 radius × 2 length, angled outward
  - Center arm: 0.15 radius × 1.8 length, forward angle
  - Leg: 0.15 radius × 1.5 length, diagonal
  - Base stand: 1-1.2 radius × 1 height

### Floor & Books
- **Wooden Floor:** 30×25 planeGeometry (oak planks)
- **Tatami Mat:** 12×10 center section with dark borders
- **Book Stack:** 3 leather books stacked (1.2×1.8, 1.1×1.7, 1.0×1.6)
- **Meditation Cushion:** 0.7-0.8 radius × 0.4 height (purple zafu)

### Atmospheric Elements
- **Dust Particles:** 300 points with upward drift
- **Candlelight:** Animated point light with flicker
- **4 Spotlights:** Strategic rim, accent, and fill lighting
- **Particle Halo:** 600 orbital particles (inherited system)

## Material Breakdown

### Physically-Based Materials

**Wood (Table, Dummy, Books):**
```typescript
MeshPhysicalMaterial({
  color: "#6b5638",
  roughness: 0.7,
  metalness: 0.0,
  clearcoat: 0.3,
  clearcoatRoughness: 0.5
})
```

**Brass/Metal (Compass, Buddha, Bowl):**
```typescript
MeshPhysicalMaterial({
  color: "#d4af37",
  roughness: 0.2,
  metalness: 0.85,
  clearcoat: 0.5,
  emissive: "#d4af37",
  emissiveIntensity: 0.1
})
```

**Glass (Ink Bottle):**
```typescript
MeshPhysicalMaterial({
  color: "#1a1a1a",
  roughness: 0.0,
  metalness: 0.0,
  transmission: 0.8,
  thickness: 0.3,
  ior: 1.5
})
```

**Parchment/Paper:**
```typescript
MeshPhysicalMaterial({
  color: "#f5e6d3",
  roughness: 0.9,
  metalness: 0.0,
  emissive: "#ffecd2",
  emissiveIntensity: 0.05
})
```

## Lighting Setup

### Primary Light (Candlelight)
```typescript
<pointLight
  position={[0, 3, 0]}
  intensity={3}
  distance={25}
  decay={2}
  color="#ffa500"
  castShadow
/>
```
Animated with flicker: `intensity = 3 * (1 + sin(t*10)*0.1 + random()*0.05)`

### Accent Lights
1. **Drafting Table Rim:** Spotlight from [-5, 8, 5], warm #ffecd2
2. **Wooden Dummy Highlight:** Spotlight from [12, 5, 2], golden #d4af37
3. **Soft Fill:** Point light from [0, 8, -8], cream #f5e6d3

## Animation Timings

**Scene Breathing:** 0.1 unit amplitude, 0.5 Hz (slow float)
**Dust Drift:** 0.01 units/frame upward (recycles at y=20)
**Scroll Sway:** ±0.02 radians, 0.8 Hz sine wave
**Candle Flicker:** 10 Hz base + random jitter
**Hover State:** Candlelight × 1.33 (3 → 4 intensity)

## Performance Metrics

**Polygon Count:** ~15,000 triangles
- Table + legs: ~500 triangles
- Wooden dummy: ~800 triangles
- Wall frames: ~600 triangles
- Books + artifacts: ~1,500 triangles
- Scroll + parchments: ~400 triangles
- Floor + tatami: ~200 triangles
- Remaining objects: ~11,000 triangles

**Particle Count:** 900 total
- Dust: 300 points
- Halo: 600 points

**Draw Calls:** ~60 meshes + 2 particle systems + 4 lights = ~66

**Shadow Casters:** ~40 objects (strategic selection)

**Target Frame Rate:** 60fps (16.67ms frame time)
**Expected Frame Time:** 8-12ms (with headroom)

## Composition & Storytelling

### Rule of Thirds
- **Top Third:** Hanging scroll, wall art (spiritual/cultural)
- **Middle Third:** Drafting table, technical work (intellectual)
- **Bottom Third:** Floor, meditation cushion (grounded practice)

### Leading Lines
- Table legs lead eye to drafting surface
- Scroll vertical lines draw attention upward
- Dummy arms create diagonal movement
- Tatami borders frame the space

### Symbolic Elements

**Leonardo da Vinci = Renaissance Master:**
- Anatomical drawings (scientific observation)
- Technical sketches (engineering genius)
- Quill and parchment (artistic expression)
- Compass and ruler (mathematical precision)

**Martial Arts Dojo = Physical Discipline:**
- Wing Chun dummy (repetitive practice)
- Tatami mats (traditional training floor)
- Meditation cushion (mindfulness)
- Japanese calligraphy (focused artistry)

**Fusion = Brandon Mills' Ethos:**
- Creative mastery requires physical discipline
- Intellectual work needs embodied practice
- East meets West philosophy
- Art and science are inseparable

## User Experience Flow

1. **Arrival:** Camera approaches z: -5000 position
2. **First Impression:** Warm candlelight reveals drafting table
3. **Eye Movement:** Follows table → scrolls → wall art → dummy
4. **Atmospheric Discovery:** Notice floating dust in light beams
5. **Interactive Hover:** Candlelight intensifies, scene glows
6. **Click Action:** Navigate to /work portfolio

**Emotional Response:** Awe, curiosity, respect for craft

## Technical Integration

### In `journey-canvas.tsx`:
```typescript
import { DaVinciDojoScene } from './scenes/davinci-dojo-scene'

const MARKER_COMPONENTS = {
  Camera3D: DaVinciDojoScene, // Replaces simple camera
  // ...
}
```

### Rendering:
```typescript
<group scale={[10, 10, 10]}>
  <DaVinciDojoScene
    position={[0, 0, -500]} // z: -5000 / 10
    color="#D4AF37"
    isActive={currentStopIndex === 0}
    isHovered={hoveredMarker === 'work'}
    onHover={(h) => setHoveredMarker(h ? 'work' : null)}
    onClick={() => router.push('/work')}
  />
</group>
```

## Future Enhancements

**Phase 2 (Optional):**
- Animated quill pen writing on parchment
- Ink bottle with liquid simulation (shader)
- Candle flame particle system (100 particles)
- Dummy arm movement on hover (martial arts kata)
- Page flip animation on books
- Meditation bowl with singing resonance visual
- Dynamic shadow puppets on walls
- Scrolling blueprint drawings

**Phase 3 (Advanced):**
- Volumetric lighting (god rays through dust)
- Cloth simulation for hanging scroll
- Water ripple shader for meditation bowl
- Sound design (quill scratching, bowl ringing)
- Interactive objects (click to examine drawings)

## Quality Comparison

**Louis Vuitton Store:** Warm lighting ✓, Luxury materials ✓, Attention to detail ✓
**Hermès Craftsmanship:** Hand-made aesthetic ✓, Natural materials ✓, Timeless design ✓
**AAA Video Game:** Environmental storytelling ✓, PBR materials ✓, 60fps performance ✓

This scene sets the bar for Brandon Mills' entire digital experience.

---

**Built with obsessive attention to detail**
Visual Designer (Agent 3) - 2025
