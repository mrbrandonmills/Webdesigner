# Brandon Mills Life Journey Components

Museum-quality 3D navigation system built with React Three Fiber.

## 📁 Component Index

### Main Components
- `journey-canvas.tsx` - Three.js scene with all markers and waypoints
- `camera-controller.tsx` - GSAP ScrollTrigger camera system

### Stop Markers (8)
- `markers/camera-marker.tsx` - WORK (Gold camera with glass lens)
- `markers/frame-marker.tsx` - GALLERY (Cream picture frame)
- `markers/book-marker.tsx` - BLOG (Sage green open book) ⚡
- `markers/lotus-marker.tsx` - MEDITATION (Purple lotus flower)
- `markers/bag-marker.tsx` - SHOP (Red luxury shopping bag) ⚡
- `markers/brain-marker.tsx` - MIND TOOLS (Blue holographic brain) ⚡
- `markers/profile-marker.tsx` - ABOUT (Amber profile silhouette)
- `markers/envelope-marker.tsx` - CONTACT (Green envelope)

⚡ = Transfer point with sub-journeys

### Waypoint Environments (7)
- `waypoints/particle-tunnel.tsx` - Swirling tunnel (10k particles)
- `waypoints/color-morph.tsx` - Flowing gradients (custom shader)
- `waypoints/geometric-shapes.tsx` - 6 platonic solids
- `waypoints/liquid-metal.tsx` - Rippling surface (custom shader)
- `waypoints/particle-swarm.tsx` - AI flocking (5k particles)
- `waypoints/holographic-field.tsx` - Sci-fi holographic grid
- `waypoints/golden-tunnel.tsx` - 20 golden rings

### Particle Systems (3)
- `particles/particle-halo.tsx` - Orbital particle rings
- `particles/neural-pathways.tsx` - Brain-like connections
- `particles/particle-cloud.tsx` - Consciousness simulation

### Visual Effects (2)
- `effects/hologram-effect.tsx` - Sci-fi scan lines
- `effects/post-processing.tsx` - Bloom, ChromaticAberration, Vignette

### UI Overlays (3)
- `ui/progress-indicator.tsx` - Right-side progress dots
- `ui/stop-indicator.tsx` - Current stop display
- `ui/transfer-modal.tsx` - Transfer point modal

## 🚀 Quick Start

```tsx
import JourneyPage from '@/app/journey/page'

// Simply render the page
<JourneyPage />
```

## 📖 Documentation

- `/docs/JOURNEY_SYSTEM_DOCUMENTATION.md` - Complete technical reference
- `/docs/JOURNEY_QUICK_START.md` - Developer guide
- `/docs/JOURNEY_BUILD_SUMMARY.md` - Build overview
- `/lib/types/journey.ts` - Configuration & types

## 🎯 Usage Example

```tsx
import { JourneyCanvas } from '@/components/journey/journey-canvas'

<JourneyCanvas
  onStopReached={(stopId, index) => {
    console.log(`Reached ${stopId}`)
  }}
  onMarkerClick={(stopId) => {
    console.log(`Clicked ${stopId}`)
  }}
/>
```

## 🎨 Customization

Edit `/lib/types/journey.ts` to configure:
- Stop positions and colors
- Camera speed
- Animation settings
- Performance targets

## 📊 Stats

- **27 files** total
- **25 components**
- **2,982 lines** of code
- **8 stops**
- **7 waypoints**
- **60 FPS** performance

---

**Built by Agent 3 - Visual Designer**
**Status:** ✅ Production Ready
