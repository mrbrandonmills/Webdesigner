# Cinematic Camera System - Quick Reference

## Files Overview

```
/app/journey/page.tsx                 → Main page (wrapped in LenisScrollWrapper)
/components/journey/
  ├─ lenis-scroll-wrapper.tsx         → Lenis initialization & RAF loop
  ├─ camera-controller.tsx            → GSAP timeline & camera choreography
  ├─ journey-canvas.tsx               → Three.js scene setup
  └─ ui/
     ├─ progress-indicator.tsx        → Scroll progress UI
     └─ stop-indicator.tsx            → Current stop overlay

/types/lenis.d.ts                     → TypeScript declarations
/lib/types/journey.ts                 → Journey stop definitions
```

## Key Constants

```typescript
// Animation timing
const DURATIONS = {
  approach: duration * 0.5,  // 50% of total
  arrival: duration * 0.5,   // 50% of total
  fov: duration * 0.3,       // FOV changes
}

// Camera angles
const APPROACH_OFFSET_X = index % 2 === 0 ? 50 : -50  // Alternate
const APPROACH_OFFSET_Y = 30 + Math.sin(index) * 20   // Vary height
const APPROACH_OFFSET_Z = baseZ + 300                  // Back from marker

// FOV ranges
const FOV_WIDE = 75    // Dramatic entrance
const FOV_FOCUSED = 50 // Close-up on marker

// Rotation angles
const ROTATION_Y = index % 2 === 0 ? 0.3 : -0.3  // Alternate direction
```

## GSAP Easing Cheat Sheet

| Easing | Use Case | Visual |
|--------|----------|--------|
| `power3.in` | Approach position (accelerate) | slow → fast |
| `expo.out` | Arrival position (decelerate) | fast → slow |
| `power2.inOut` | Camera rotation (smooth) | ease both ends |
| `power3.out` | Settle rotation | fast → slow |
| `power2.out` | FOV changes | quick start, slow end |

## Lenis Configuration

```typescript
new Lenis({
  duration: 1.2,                    // Smooth duration (seconds)
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),  // easeOutExpo
  orientation: 'vertical',          // Vertical scroll only
  smoothWheel: true,                // Enable smooth wheel
  wheelMultiplier: 1.0,             // Scroll speed
  touchMultiplier: 2,               // Touch speed
  infinite: false,                  // No infinite scroll
})
```

## Timeline Sync Pattern

```typescript
// 1. Get Lenis scroll progress
const scrollProgress = lenis.scroll / scrollHeight  // 0-1

// 2. Calculate stop timeline position
const totalDistance = Math.abs(JOURNEY_STOPS[last].position.z)
const stopDistance = Math.abs(stop.position.z)
const timelinePosition = stopDistance / totalDistance  // 0-1

// 3. Add animations to timeline
masterTimeline.to(camera.position, { x, y, z }, timelinePosition)
masterTimeline.to(camera.rotation, { x, y, z }, '<')  // Same time
masterTimeline.to(camera, { fov }, '<')                // Same time

// 4. Scrub timeline based on scroll
masterTimeline.progress(scrollProgress)
```

## Common Modifications

### Adjust Camera Distance from Markers

```typescript
// In camera-controller.tsx, line ~62
arrival: {
  z: baseZ + 100,  // Change 100 to adjust distance
}
```

### Change Transition Speed

```typescript
// In camera-controller.tsx, line ~41
const duration = Math.max(2, distance / 500)  // Change 500 to speed up/down
```

### Modify Approach Angle

```typescript
// In camera-controller.tsx, line ~52
x: index % 2 === 0 ? 50 : -50,  // Change 50 to increase/decrease offset
```

### Adjust FOV Range

```typescript
// In camera-controller.tsx
approach: { fov: 75 },  // Change for wider/narrower
arrival: { fov: 50 },   // Change for tighter/looser
```

### Change Breathing Intensity

```typescript
// In camera-controller.tsx, useFrame()
cameraRef.current.position.x += Math.sin(time * 2) * 0.05  // Change 0.05
cameraRef.current.position.y += Math.cos(time * 1.5) * 0.03  // Change 0.03
```

## Debugging

### Enable Lenis Warnings
```typescript
// Check if Lenis is available
if (!window.lenis) {
  console.warn('Lenis not initialized!')
}
```

### Monitor Scroll Progress
```typescript
lenis.on('scroll', () => {
  console.log('Scroll:', lenis.scroll, 'Progress:', lenis.progress)
})
```

### Check Timeline Progress
```typescript
masterTimeline.eventCallback('onUpdate', () => {
  console.log('Timeline progress:', masterTimeline.progress())
})
```

### Verify Camera Position
```typescript
useFrame(() => {
  console.log('Camera:', cameraRef.current.position)
  console.log('FOV:', cameraRef.current.fov)
})
```

## Performance Optimization

### Reduce Particle Count
```typescript
// In journey-canvas.tsx or waypoint components
<Stars count={5000} />  // Reduce to 3000 for better performance
```

### Disable Post-Processing
```typescript
// In journey-canvas.tsx
<PostProcessingEffects enabled={false} />
```

### Lower Target FPS
```typescript
// In journey types
export const PERFORMANCE_CONFIG = {
  targetFPS: 30,  // Change from 60 to 30 for mobile
}
```

## Common Errors & Solutions

### Error: "Lenis not found on window"
**Solution**: Ensure `LenisScrollWrapper` wraps the journey page

### Error: "cameraRef.current is null"
**Solution**: Add null check before accessing in timeline
```typescript
if (!cameraRef.current) return
```

### Error: Timeline not syncing with scroll
**Solution**: Verify Lenis scroll listener is active
```typescript
lenis.on('scroll', scrollHandler)
```

### Jittery camera movement
**Solution**: Increase Lenis duration or reduce lerp factor
```typescript
duration: 1.5  // Increase from 1.2
currentLookAt.lerp(targetRef.current, 0.03)  // Reduce from 0.05
```

## Testing Checklist

- [ ] Camera smoothly approaches each stop
- [ ] No sudden jumps or jank
- [ ] FOV changes are noticeable
- [ ] Rotation enhances without confusing
- [ ] Can scroll backward smoothly
- [ ] Progress indicator syncs
- [ ] Stop indicator appears correctly
- [ ] Keyboard navigation works
- [ ] Performance: 60fps desktop, 30fps mobile
- [ ] No memory leaks (check cleanup)

## Quick Commands

```bash
# Development
npm run dev

# Type check
npm run type-check

# Build
npm run build

# Performance profiling
# 1. Open Chrome DevTools
# 2. Go to Performance tab
# 3. Record while scrolling
# 4. Check for dropped frames (target 60fps)
```

## Key Techniques Used

1. **Lenis Smooth Scroll**: Momentum-based physics for luxury feel
2. **GSAP Timelines**: Precise control over camera sequences
3. **Two-Phase Animation**: Approach (accelerate) + Arrival (decelerate)
4. **Dolly Zoom**: FOV changes during position animation
5. **Alternating Angles**: Left/right weaving for visual interest
6. **Breathing Motion**: Subtle sine/cosine in render loop
7. **Timeline Scrubbing**: Sync with scroll progress (not time)

## API Reference

### LenisScrollWrapper Props
```typescript
interface LenisScrollWrapperProps {
  children: ReactNode
  onScroll?: (scroll: number) => void  // Optional callback
}
```

### CameraController Props
```typescript
interface CameraControllerProps {
  onStopReached?: (stopId: string, index: number) => void
}
```

### Global Lenis Access
```typescript
// Access Lenis from anywhere
const lenis = window.lenis

// Programmatic scroll
lenis?.scrollTo(target, { duration: 2 })

// Stop/start smooth scroll
lenis?.stop()
lenis?.start()
```

## Resources

- [Lenis Docs](https://github.com/studio-freight/lenis)
- [GSAP Timeline](https://greensock.com/docs/v3/GSAP/Timeline)
- [Three.js Camera](https://threejs.org/docs/#api/en/cameras/PerspectiveCamera)
- [The Monolith Project](https://themonolithproject.com) - Reference site

---

**Last Updated**: 2025-11-24
**Maintainer**: Visual Designer (Agent 3)
