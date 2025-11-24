# Cinematic 3D Journey Camera System

**Award-Winning Design**: Inspired by The Monolith Project (Awwwards/CSS Design Awards Winner)

## Overview

The Brandon Mills 3D Journey experience features a museum-quality camera system that rivals the best interactive experiences on the web. Every camera movement is choreographed with cinematic intent, using techniques from luxury brands and award-winning digital experiences.

## Technical Architecture

### Core Technologies

1. **Lenis Smooth Scroll** (`lenis` package)
   - Replaces browser native scroll with momentum-based physics
   - Provides smooth, cinematic scroll feel
   - Used by The Monolith Project and other Awwwards winners
   - Configuration: 1.2s duration, custom easeOutExpo curve

2. **GSAP Timelines** (`gsap` package)
   - Precise control over camera position, rotation, and FOV
   - Scrub through animations based on scroll progress
   - Multiple simultaneous animations with different easing curves
   - No simple lerp - full cinematic choreography

3. **React Three Fiber** (`@react-three/fiber`)
   - Three.js integration with React
   - PerspectiveCamera with dynamic FOV changes
   - 60fps render loop for smooth lookAt animations

### System Components

#### 1. Lenis Scroll Wrapper
**File**: `/components/journey/lenis-scroll-wrapper.tsx`

```typescript
// Initializes Lenis smooth scroll
new Lenis({
  duration: 1.2, // Cinematic smoothness
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // easeOutExpo
  smoothWheel: true,
  wheelMultiplier: 1.0,
  smoothTouch: false, // Better mobile performance
})
```

**Key Features**:
- Exposes `window.lenis` for GSAP integration
- Continuous RAF loop for smooth updates
- Callback system for scroll progress tracking

#### 2. Camera Controller
**File**: `/components/journey/camera-controller.tsx`

**Cinematic Sequences** for each journey stop:

##### Approach Phase (Speed Up)
- **Camera Position**: Dramatic offset (50px left/right, 30px up, 300px back)
- **Camera Rotation**: Angled approach (0.3 rad Y-axis rotation)
- **FOV**: Wide (75°) for dramatic entrance
- **Duration**: 50% of stop transition time
- **Easing**: `power3.in` (accelerate into stop)

##### Arrival Phase (Slow Down)
- **Camera Position**: Settle into viewing position (slight offset, closer to marker)
- **Camera Rotation**: Straighten to neutral (0, 0, 0)
- **FOV**: Zoom in (50°) for focus - "dolly zoom" effect
- **Duration**: 50% of stop transition time
- **Easing**: `expo.out` (smooth deceleration)

##### LookAt Animation
- **Target**: Positioned ahead of each marker
- **Interpolation**: Smooth lerp in render loop (0.05 factor)
- **Breathing**: Subtle sine/cosine movement for life (0.05px amplitude)

### Camera Choreography Per Stop

Each of the 8 journey stops has unique camera behavior:

```typescript
JOURNEY_STOPS.map((stop, index) => {
  // Alternating left/right approaches
  const approachX = index % 2 === 0 ? 50 : -50
  const approachRotY = index % 2 === 0 ? 0.3 : -0.3

  // Varying height for visual interest
  const approachY = 30 + Math.sin(index) * 20
  const arrivalY = 10 + Math.cos(index * 0.3) * 10

  // Arrival position has subtle offset
  const arrivalX = Math.sin(index * 0.5) * 20
})
```

### Scroll-to-Timeline Sync

**Key Algorithm**:
```typescript
// Convert scroll position to timeline progress
const scrollHeight = document.body.scrollHeight - window.innerHeight
const scrollProgress = lenis.scroll / scrollHeight // 0-1

// Map stop positions to timeline positions
const totalDistance = Math.abs(JOURNEY_STOPS[last].position.z)
const stopDistance = Math.abs(stop.position.z)
const timelinePosition = stopDistance / totalDistance // 0-1

// Scrub GSAP timeline
masterTimeline.progress(scrollProgress)
```

## Animation Specifications

### Easing Curves

| Phase | GSAP Easing | Visual Effect |
|-------|-------------|---------------|
| Approach Position | `power3.in` | Accelerate toward stop |
| Approach Rotation | `power2.inOut` | Smooth rotation |
| Approach FOV | `power2.out` | Quick wide angle |
| Arrival Position | `expo.out` | Cinematic slow-down |
| Arrival Rotation | `power3.out` | Settle into place |
| Arrival FOV | `power2.inOut` | Smooth zoom focus |
| LookAt | `power2.inOut` | Natural eye movement |

### Timing

| Stop Distance | Transition Duration |
|---------------|---------------------|
| 0-2000 units | 2.0 seconds (minimum) |
| 5000 units | 3.0 seconds |
| 10000 units | 5.0 seconds |
| 15000+ units | 7.0+ seconds |

Formula: `Math.max(2, distance / 500)`

### FOV Ranges

- **Wide (75°)**: Dramatic entrances, environmental context
- **Normal (60°)**: Standard viewing, comfortable perspective
- **Focused (50°)**: Close-ups, emphasis on markers

The FOV animation creates a "dolly zoom" effect - the camera zooms in (tighter FOV) while moving forward, creating visual drama.

## Performance Optimization

### Target Performance
- **Desktop**: 60 FPS (16.67ms per frame)
- **Mobile**: 30 FPS (33.33ms per frame) - Lenis smoothTouch disabled

### Optimization Techniques

1. **GSAP Timeline Caching**
   - Build timeline once in `useEffect`
   - Scrub progress instead of rebuilding
   - Reuse timeline ref across renders

2. **Three.js Render Loop**
   - Minimal calculations in `useFrame`
   - Lerp instead of expensive recalculations
   - Camera breathing uses `Date.now()` (cheaper than Three.js clock)

3. **Lenis RAF Integration**
   - Single RAF loop for scroll updates
   - No redundant scroll listeners
   - Efficient scroll progress calculation

4. **Camera Projection Matrix**
   - Only update when FOV changes
   - Called in GSAP `onUpdate` callback
   - Prevents unnecessary recalculations

## User Experience Design

### Journey Flow

1. **Start (z: 0)**: Camera at origin, looking forward
2. **Scroll begins**: Lenis momentum scroll feels natural
3. **Approach stop**: Camera accelerates, angle shifts, FOV widens
4. **Arrive at stop**: Camera decelerates, straightens, FOV tightens
5. **Dwell**: User can read marker and UI overlay
6. **Continue**: Smooth transition to next stop

### Accessibility Features

- **Keyboard Navigation**: Arrow keys scroll (Lenis handles)
- **Reduced Motion**: Respects `prefers-reduced-motion` (future enhancement)
- **Alternative Navigation**: Side panel for direct stop access
- **Screen Reader**: Hidden progress indicators for stop announcements

## Luxury Brand Techniques

### 1. Dramatic Camera Angles
- Offset approaches (not straight lines)
- Varying heights for visual interest
- Rotation during movement (not static)

### 2. Dolly Zoom Effect
- FOV changes during position animation
- Creates "Vertigo effect" popularized by Hitchcock
- Emphasizes arrival at each stop

### 3. Breathing Motion
- Subtle sine/cosine oscillation
- Mimics human micro-movements
- Adds life to static scenes

### 4. Momentum Physics
- Lenis custom easing curve
- Feels like luxury car acceleration/deceleration
- Never abrupt, always smooth

### 5. Anticipation & Follow-Through
- Approach phase (anticipation)
- Arrival phase (follow-through)
- Animation principles from Disney/Pixar

## Implementation Checklist

- [x] Install Lenis package
- [x] Create Lenis wrapper component
- [x] Rebuild camera controller with GSAP timelines
- [x] Add camera position animations
- [x] Add camera rotation animations
- [x] Add FOV dynamic zoom (dolly zoom)
- [x] Implement target-based lookAt
- [x] Sync timeline with Lenis scroll progress
- [x] Update journey page to use wrapper
- [x] Add subtle camera breathing effect
- [x] Calculate dynamic durations per stop
- [x] Create alternating approach angles
- [x] Optimize render loop performance

## Testing & Validation

### Visual Tests
- [ ] Camera smoothly approaches each stop
- [ ] No jarring movements or jank
- [ ] FOV changes are noticeable but not nauseating
- [ ] Camera rotation enhances drama (not confusing)
- [ ] LookAt target always points at markers

### Performance Tests
- [ ] 60fps on desktop (Chrome DevTools Performance)
- [ ] 30fps on mobile (iOS Safari, Android Chrome)
- [ ] No memory leaks (check RAF cleanup)
- [ ] Lenis cleanup on unmount
- [ ] GSAP timeline cleanup on unmount

### User Experience Tests
- [ ] Scroll feels responsive and smooth
- [ ] Can scroll backward without issues
- [ ] Progress indicator syncs with camera position
- [ ] Stop indicator appears at correct times
- [ ] Keyboard navigation works seamlessly

## Future Enhancements

1. **Camera Shake**: Add subtle shake on arrival for emphasis
2. **Shader Transitions**: Use post-processing for scene transitions
3. **Parallax Layers**: Add depth to waypoint environments
4. **Sound Design**: Audio cues for camera movements
5. **Gesture Controls**: Swipe on mobile for next/previous stop
6. **VR Support**: Adapt camera system for VR headsets

## Reference Links

- [Lenis Documentation](https://github.com/studio-freight/lenis)
- [GSAP Timeline Docs](https://greensock.com/docs/v3/GSAP/Timeline)
- [The Monolith Project](https://themonolithproject.com) - Awwwards winner
- [Three.js Camera Docs](https://threejs.org/docs/#api/en/cameras/PerspectiveCamera)
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber)

## Credits

**Design Philosophy**: Museum-quality digital experiences
**Inspiration**: The Monolith Project, Awwwards winners, luxury brand sites
**Agent**: Visual Designer (Agent 3)
**Project**: Brandon Mills Life Journey 3D Navigation
