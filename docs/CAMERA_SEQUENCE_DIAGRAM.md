# Camera Sequence Diagram

## Visual Flow of Cinematic Camera Movement

```
USER SCROLLS DOWN
     │
     ▼
┌────────────────────────────────────────────────────────────────┐
│  LENIS SMOOTH SCROLL                                           │
│  • Momentum physics (1.2s duration)                            │
│  • Custom easeOutExpo curve                                    │
│  • Scroll progress: 0% → 100%                                  │
└────────────┬───────────────────────────────────────────────────┘
             │
             ▼
┌────────────────────────────────────────────────────────────────┐
│  GSAP MASTER TIMELINE (Scrub Mode)                             │
│  • timeline.progress(scrollProgress)                           │
│  • Contains all stop sequences                                 │
└────────────┬───────────────────────────────────────────────────┘
             │
             ▼
┌────────────────────────────────────────────────────────────────┐
│  STOP 1: WORK (z: -5000)                                       │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│  APPROACH PHASE (Duration: 1.4s)                               │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │ Camera Position:  [50, 30, -200]  (offset, up, back)   │  │
│  │ Camera Rotation:  [0, 0.3, 0]     (tilted right)        │  │
│  │ Camera FOV:       75°             (wide dramatic)       │  │
│  │ Easing:           power3.in       (accelerate)          │  │
│  └─────────────────────────────────────────────────────────┘  │
│                     │                                           │
│                     │ smooth transition                         │
│                     ▼                                           │
│  ARRIVAL PHASE (Duration: 1.4s)                                │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │ Camera Position:  [10, 15, -400]  (close to marker)    │  │
│  │ Camera Rotation:  [0, 0, 0]       (straighten)         │  │
│  │ Camera FOV:       50°             (zoom focus)          │  │
│  │ Easing:           expo.out        (decelerate)          │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                                 │
│  LOOKAT TARGET: [0, 0, -550]                                   │
│  USER SEES: "WORK" marker in focus, can click                  │
│                                                                 │
└────────────┬───────────────────────────────────────────────────┘
             │
             │ user continues scrolling
             ▼
┌────────────────────────────────────────────────────────────────┐
│  STOP 2: GALLERY (z: -12000)                                   │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│  APPROACH PHASE (Duration: 2.8s)                               │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │ Camera Position:  [-50, 35, -920] (offset LEFT this    │  │
│  │                                     time for variety)    │  │
│  │ Camera Rotation:  [0, -0.3, 0]    (tilted left)         │  │
│  │ Camera FOV:       75°             (wide)                │  │
│  │ Easing:           power3.in       (accelerate)          │  │
│  └─────────────────────────────────────────────────────────┘  │
│                     │                                           │
│                     ▼                                           │
│  ARRIVAL PHASE (Duration: 2.8s)                                │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │ Camera Position:  [-5, 18, -1100] (settle)             │  │
│  │ Camera Rotation:  [0, 0, 0]       (straighten)         │  │
│  │ Camera FOV:       50°             (zoom)                │  │
│  │ Easing:           expo.out        (decelerate)          │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                                 │
└────────────┬───────────────────────────────────────────────────┘
             │
             │ ... pattern repeats for all 8 stops
             ▼
┌────────────────────────────────────────────────────────────────┐
│  RENDER LOOP (60fps)                                           │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │ useFrame() every 16.67ms:                                │ │
│  │ 1. Smooth lookAt interpolation (lerp 0.05)              │ │
│  │ 2. Subtle breathing motion:                              │ │
│  │    - x += sin(time * 2) * 0.05                           │ │
│  │    - y += cos(time * 1.5) * 0.03                         │ │
│  │ 3. Update camera.lookAt(target)                          │ │
│  └──────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────┘
```

## Stop-by-Stop Camera Choreography

### Stop 1: WORK (z: -5000)
```
Approach: [50, 30, -200]  →  Arrival: [10, 15, -400]
Rotation: [0, 0.3, 0]     →  [0, 0, 0]
FOV:      75°             →  50°
Duration: 2.8s total
```

### Stop 2: GALLERY (z: -12000)
```
Approach: [-50, 35, -920]  →  Arrival: [-5, 18, -1100]
Rotation: [0, -0.3, 0]     →  [0, 0, 0]
FOV:      75°              →  50°
Duration: 5.6s total (longer distance)
```

### Stop 3: BLOG (z: -18000)
```
Approach: [50, 40, -1620]  →  Arrival: [8, 12, -1700]
Rotation: [0, 0.3, 0]      →  [0, 0, 0]
FOV:      75°              →  50°
Duration: 4.8s total
```

### Stop 4: MEDITATION (z: -26000)
```
Approach: [-50, 28, -2320]  →  Arrival: [-10, 20, -2500]
Rotation: [0, -0.3, 0]      →  [0, 0, 0]
FOV:      75°               →  50°
Duration: 6.4s total
```

### Stop 5: SHOP (z: -33000)
```
Approach: [50, 38, -3000]  →  Arrival: [12, 16, -3200]
Rotation: [0, 0.3, 0]      →  [0, 0, 0]
FOV:      75°              →  50°
Duration: 5.6s total
```

### Stop 6: MIND TOOLS (z: -40000)
```
Approach: [-50, 32, -3700]  →  Arrival: [-8, 19, -3900]
Rotation: [0, -0.3, 0]      →  [0, 0, 0]
FOV:      75°               →  50°
Duration: 5.6s total
```

### Stop 7: ABOUT (z: -46000)
```
Approach: [50, 36, -4300]  →  Arrival: [6, 14, -4500]
Rotation: [0, 0.3, 0]      →  [0, 0, 0]
FOV:      75°              →  50°
Duration: 4.8s total
```

### Stop 8: CONTACT (z: -51000)
```
Approach: [-50, 30, -4800]  →  Arrival: [-10, 17, -5000]
Rotation: [0, -0.3, 0]      →  [0, 0, 0]
FOV:      75°               →  50°
Duration: 4.0s total (final stop)
```

## Easing Curves Visualized

```
APPROACH (power3.in - Accelerate)
Progress: ▁▁▂▃▅▆▇███
Speed:    slow → fast

ARRIVAL (expo.out - Decelerate)
Progress: ███▇▆▅▃▂▁▁
Speed:    fast → slow

Combined Effect: Speed bump at each stop
               ▁▂▃▅▇█▇▅▃▂▁
               approach|arrival
```

## FOV "Dolly Zoom" Effect

```
Wide FOV (75°):           Tight FOV (50°):
┌────────────────┐        ┌──────────┐
│    ┌──────┐    │        │ ┌──────┐ │
│    │marker│    │   →    │ │marker│ │
│    └──────┘    │        │ └──────┘ │
│ wide context   │        │  focused │
└────────────────┘        └──────────┘
(Approach Phase)          (Arrival Phase)
```

## Alternating Angles Pattern

```
Stop 1 (WORK):        →  Approach from RIGHT (+50)
Stop 2 (GALLERY):     →  Approach from LEFT (-50)
Stop 3 (BLOG):        →  Approach from RIGHT (+50)
Stop 4 (MEDITATION):  →  Approach from LEFT (-50)
Stop 5 (SHOP):        →  Approach from RIGHT (+50)
Stop 6 (MIND TOOLS):  →  Approach from LEFT (-50)
Stop 7 (ABOUT):       →  Approach from RIGHT (+50)
Stop 8 (CONTACT):     →  Approach from LEFT (-50)

This creates a "weaving" camera path through the journey.
```

## Breathing Motion (Render Loop)

```
X-axis oscillation (faster):
  ▲
  │     ╱╲    ╱╲    ╱╲
  │    ╱  ╲  ╱  ╲  ╱  ╲
  │___╱____╲╱____╲╱____╲___▶ time
  │   sin(time * 2) * 0.05
  │
  │
  ▼

Y-axis oscillation (slower):
  ▲
  │       ╱──╲        ╱──╲
  │      ╱    ╲      ╱    ╲
  │_____╱______╲____╱______╲___▶ time
  │   cos(time * 1.5) * 0.03
  │
  │
  ▼

Combined: Figure-8 micro-movement (adds life)
```

## Performance Diagram

```
┌─────────────────────────────────────────┐
│ RAF LOOP (Target: 60fps = 16.67ms)     │
├─────────────────────────────────────────┤
│                                         │
│  Lenis.raf()           ~2ms             │
│  ├─ Scroll calculation                  │
│  ├─ Timeline update                     │
│  └─ Callback trigger                    │
│                                         │
│  Three.js render       ~10ms            │
│  ├─ useFrame hooks                      │
│  ├─ Camera updates                      │
│  └─ Scene rendering                     │
│                                         │
│  Total:                ~12ms ✅         │
│  Budget remaining:     ~4ms             │
│                                         │
└─────────────────────────────────────────┘
```

## Scroll-to-Stop Mapping

```
Scroll Progress:  0%   12%   24%   35%   47%   59%   71%   82%   100%
                  │     │     │     │     │     │     │     │     │
Journey Stops:    ●─────●─────●─────●─────●─────●─────●─────●─────●
                  W     G     B     M     S     T     A     C     END
                  O     A     L     E     H     O     B     O
                  R     L     O     D     O     O     O     N
                  K     L     G     I     P     L     U     T
                        E           T           S     T     A
                        R           A                       C
                        Y           T                       T
                                    I
                                    O
                                    N

Timeline Position: Calculated from z-position of each stop
Progress syncs perfectly with scroll position via Lenis
```

## Key Takeaways

1. **Two-Phase Sequences**: Every stop has approach + arrival
2. **Alternating Angles**: Camera weaves left/right for variety
3. **Dynamic FOV**: Zoom effect enhances drama
4. **Smooth Easing**: Power curves for cinematic feel
5. **Breathing Motion**: Subtle life added in render loop
6. **Performance First**: Single RAF loop, minimal calculations

This architecture creates museum-quality camera work that rivals award-winning sites.
