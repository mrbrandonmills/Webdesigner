# 🚀 Journey System - Quick Start Guide

## Installation

The journey system is already installed! All dependencies are included:

```bash
# Already installed:
# - @react-three/fiber
# - @react-three/drei
# - @react-three/postprocessing
# - gsap (with ScrollTrigger)
# - framer-motion
# - three
```

---

## Testing Locally

### 1. Start the Development Server

```bash
npm run dev
```

### 2. Navigate to Journey Page

Open your browser to:
```
http://localhost:3000/journey
```

### 3. Experience the Journey

- **Scroll down** to begin traveling through Brandon's life
- **Hover** over markers to see interactive effects
- **Click** markers to navigate or enter transfer points
- **Use progress indicator** on the right to jump between stops

---

## File Overview

### Main Entry Point
- `/app/journey/page.tsx` - Journey page component

### Core Components
- `/components/journey/journey-canvas.tsx` - Three.js scene
- `/components/journey/camera-controller.tsx` - Scroll-based camera

### Markers (8 stops)
- `/components/journey/markers/camera-marker.tsx` - WORK
- `/components/journey/markers/frame-marker.tsx` - GALLERY
- `/components/journey/markers/book-marker.tsx` - BLOG
- `/components/journey/markers/lotus-marker.tsx` - MEDITATION
- `/components/journey/markers/bag-marker.tsx` - SHOP
- `/components/journey/markers/brain-marker.tsx` - MIND TOOLS
- `/components/journey/markers/profile-marker.tsx` - ABOUT
- `/components/journey/markers/envelope-marker.tsx` - CONTACT

### Waypoints (7 environments)
- `/components/journey/waypoints/particle-tunnel.tsx`
- `/components/journey/waypoints/color-morph.tsx`
- `/components/journey/waypoints/geometric-shapes.tsx`
- `/components/journey/waypoints/liquid-metal.tsx`
- `/components/journey/waypoints/particle-swarm.tsx`
- `/components/journey/waypoints/holographic-field.tsx`
- `/components/journey/waypoints/golden-tunnel.tsx`

### UI Overlays
- `/components/journey/ui/progress-indicator.tsx`
- `/components/journey/ui/stop-indicator.tsx`
- `/components/journey/ui/transfer-modal.tsx`

### Configuration
- `/lib/types/journey.ts` - Type definitions and configuration

---

## Customization

### Change Stop Colors

Edit `/lib/types/journey.ts`:

```typescript
{
  id: 'work',
  color: '#D4AF37', // Change this hex color
  // ...
}
```

### Adjust Camera Speed

Edit `/lib/types/journey.ts`:

```typescript
export const CAMERA_SPEED = 1000 // Lower = slower, Higher = faster
```

### Modify Particle Counts

In any marker file, adjust the `count` prop:

```tsx
<ParticleHalo count={500} color={color} radius={3} />
//              ↑ Change this number
```

### Enable/Disable Post-Processing

Edit `/components/journey/journey-canvas.tsx`:

```tsx
<PostProcessingEffects
  enabled={true} // Set to false to disable
  bloomIntensity={1.5}
  chromaticAberrationStrength={0.002}
/>
```

---

## Adding a New Stop

### 1. Add to Configuration

Edit `/lib/types/journey.ts`:

```typescript
export const JOURNEY_STOPS: JourneyStop[] = [
  // ... existing stops
  {
    id: 'new-stop',
    name: 'NEW STOP',
    type: 'FINAL',
    position: { z: -55000 }, // Position after last stop
    marker: 'NewMarker3D',
    waypoint: 'NewWaypoint',
    color: '#FF5733',
    description: 'Description here',
    href: '/new-stop'
  }
]
```

### 2. Create Marker Component

Create `/components/journey/markers/new-marker.tsx`:

```tsx
'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { ParticleHalo } from '../particles/particle-halo'
import type { MarkerProps } from '@/lib/types/journey'

export function NewMarker({ position, color, ... }: MarkerProps) {
  // Your 3D sculpture code here
  return (
    <group position={position}>
      {/* Your meshes */}
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshPhysicalMaterial color={color} />
      </mesh>

      <ParticleHalo count={500} color={color} radius={3} />
    </group>
  )
}
```

### 3. Register in Canvas

Edit `/components/journey/journey-canvas.tsx`:

```tsx
import { NewMarker } from './markers/new-marker'

const MARKER_COMPONENTS = {
  // ... existing markers
  NewMarker3D: NewMarker
}
```

---

## Performance Optimization

### Monitor FPS

Add to your dev setup:

```tsx
import { Stats } from '@react-three/drei'

<Canvas>
  <Stats />
  {/* ... rest of scene */}
</Canvas>
```

### Reduce Particle Counts

For better performance on lower-end devices:

```tsx
// In marker components
<ParticleHalo
  count={window.innerWidth < 768 ? 200 : 500} // Mobile: 200, Desktop: 500
  color={color}
  radius={3}
/>
```

### Disable Post-Processing on Mobile

```tsx
<PostProcessingEffects
  enabled={window.innerWidth >= 1024} // Only on desktop
/>
```

---

## Troubleshooting

### Scene is Black

**Problem:** Canvas not rendering

**Solutions:**
1. Check browser console for errors
2. Verify Three.js camera is set up correctly
3. Add ambient lighting: `<ambientLight intensity={1} />`

### Camera Not Moving

**Problem:** ScrollTrigger not working

**Solutions:**
1. Verify GSAP is registered: `gsap.registerPlugin(ScrollTrigger)`
2. Check scroll container height (should be `600vh` or more)
3. Open browser DevTools and check for JavaScript errors

### Low FPS

**Problem:** Performance issues

**Solutions:**
1. Reduce particle counts
2. Disable post-processing
3. Lower shadow quality
4. Use simpler geometries

### Markers Not Clickable

**Problem:** onClick not firing

**Solutions:**
1. Ensure `<group>` has `onClick` prop
2. Check for overlapping UI elements with higher z-index
3. Verify pointer events are enabled

---

## Testing Checklist

Before deploying to production:

- [ ] Test on desktop (Chrome, Firefox, Safari)
- [ ] Test on mobile (iOS Safari, Chrome Android)
- [ ] Test on tablet
- [ ] Verify all 8 stops are reachable
- [ ] Check transfer modals open correctly
- [ ] Confirm progress indicator works
- [ ] Test keyboard navigation (Tab, Enter, ESC)
- [ ] Verify 60fps on target devices
- [ ] Check memory usage (should stay under 200MB)
- [ ] Test scroll smoothness
- [ ] Verify all marker interactions work

---

## Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Vercel

```bash
vercel --prod
```

Or push to GitHub and Vercel will auto-deploy.

---

## Support

For detailed documentation, see:
- `/docs/JOURNEY_SYSTEM_DOCUMENTATION.md` - Complete system reference

For issues:
1. Check browser console for errors
2. Verify all dependencies are installed
3. Test in different browsers
4. Check memory usage and FPS

---

## Next Steps

1. **Customize colors** to match your brand
2. **Add your own content** to stop pages
3. **Create sub-journeys** for transfer points
4. **Add analytics** to track user engagement
5. **Optimize images** for markers
6. **Add sound effects** for interactions
7. **Implement save/resume** feature

---

**Enjoy your journey through Brandon's life! 🚀✨**
