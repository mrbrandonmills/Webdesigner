# Journey Environmental Scenes

Museum-quality 3D environmental vignettes that replace simple marker objects with fully realized spaces. Each scene tells a story and creates an immersive experience that rivals AAA video game quality.

## DaVinciDojoScene - WORK Stop

**Location:** `/components/journey/scenes/davinci-dojo-scene.tsx`
**Position:** z: -5000 (rendered at [0, 0, -500] due to 10x parent scale)
**Journey Stop:** WORK
**Theme:** Leonardo da Vinci Renaissance Studio merged with Martial Arts Dojo

### Concept

A jaw-dropping fusion representing the union of creative mastery and physical discipline. This scene embodies Brandon Mills' dual nature as both an artist/creator and a disciplined practitioner.

### 3D Elements

**Central Focal Point:**
- Aged oak drafting table with detailed wood grain
- Leonardo-style anatomical drawings on parchment
- Scattered blueprints and technical sketches
- Writing implements (quill pens, ink bottles, compass, rulers)
- Partially unrolled scrolls showing architectural drawings

**Wall Mounted Elements:**
- Framed anatomical studies (da Vinci style)
- Framed architectural sketches
- Japanese calligraphy hanging scroll with wooden bars
- Small shelf with brass singing bowl and Buddha statue

**Training Equipment:**
- Wing Chun wooden dummy (Mook Jong) - traditional martial arts training post
- Positioned right side with proper anatomical structure
- Weathered hardwood construction with battle-worn patina

**Floor System:**
- Base layer: Worn wooden floorboards (aged oak)
- Center section: Tatami mats with dark fabric borders
- Natural blend between Japanese and Renaissance aesthetics

**Books & Artifacts:**
- Stack of leather-bound books (Renaissance texts, martial arts philosophy)
- Small brass Buddha statue with metallic finish
- Traditional brush painting supplies (ink stone, brushes)
- Purple meditation cushion (zafu) on floor

### Materials & Quality

**Physically-Based Rendering (PBR):**
- Wood: High roughness (0.7-0.9), zero metalness, subtle clearcoat
- Metal (brass): High metalness (0.8-0.9), low roughness (0.2-0.3)
- Glass: Full transmission (1.0), proper IOR (1.5), thickness simulation
- Paper/Parchment: High roughness (0.85-0.9), subtle emissive for warmth
- Fabric (tatami): Maximum roughness (0.95), detailed normal maps

**Color Palette:**
- Wood tones: #4a3a2a, #5a4632, #6b5638 (aged oak spectrum)
- Parchment: #f5e6d3, #f0e1d0, #f8f4e8 (warm cream tones)
- Metal: #b8860b, #d4af37 (dark gold to golden brass)
- Accents: #1a1a1a (black), #4a1a4a (deep purple for cushion)

### Lighting Design

**Candlelit Ambiance:**
- Primary: Flickering point light (orange #ffa500) with animated intensity
- Creates warm, golden hour atmosphere
- Dramatic shadows for depth and mystery

**Accent Lighting:**
- Rim light on drafting table (warm #ffecd2)
- Golden spotlight on wooden dummy (#d4af37)
- Soft fill light for shadow softening (#f5e6d3)

**Atmospheric Effects:**
- 300 floating dust particles with upward drift
- Additive blending for volumetric feel
- Subtle opacity (0.3) for realism

### Animations

**Ambient Motion:**
- Scene breathing: Gentle vertical float (0.1 unit amplitude, 0.5 Hz)
- Scroll sway: Subtle rotation on Z-axis (0.02 radians)
- Dust particles: Continuous upward drift with recycling
- Candle flicker: Randomized intensity variation (10Hz + random)

**Interactive States:**
- Hover: Increased candlelight intensity (4x vs 3x base)
- Hover: Additional point light glow in accent color
- Active: Golden ring indicator (16 unit radius)
- Active: Enhanced particle halo intensity (1.8x vs 1.2x)

### Performance Optimization

- Efficient geometry: Cylinders (8-32 segments based on size)
- Optimized particle count: 300 dust + 600 halo particles
- Shadow casting: Strategic enablement (key objects only)
- LOD ready: Scene structured for easy detail reduction

### Technical Specifications

**Total Scene Size:** ~30 units wide × 20 units tall × 25 units deep
**Scaled Render Size:** 300 × 200 × 250 units (with 10x parent scale)
**Polygon Budget:** ~15,000 triangles (optimized for 60fps)
**Texture Memory:** Zero external textures (procedural materials only)
**Draw Calls:** ~60 meshes + 2 particle systems + 4 lights

### Integration

```tsx
// In journey-canvas.tsx
import { DaVinciDojoScene } from './scenes/davinci-dojo-scene'

const MARKER_COMPONENTS = {
  Camera3D: DaVinciDojoScene, // Replaces simple camera marker
  // ... other markers
}
```

The scene automatically receives:
- Position: [0, 0, -500] (z-position / 10)
- Interaction handlers: onHover, onClick
- State props: isActive, isHovered
- Color theming: #D4AF37 (gold)

### Visual Quality Standards

**Museum Quality:**
- Proper material response to light (PBR workflow)
- Realistic shadows with soft penumbra
- Atmospheric depth through fog and particles
- Cinematic composition (rule of thirds, leading lines)

**Luxury Brand Feel:**
- Warm, inviting color palette (Kasane-inspired)
- Elegant, subtle animations (no jarring motion)
- Refined details without visual clutter
- Sophisticated material finishes

**AAA Game Standards:**
- 60fps performance target
- Smooth animation curves
- Proper depth sorting and transparency
- Interactive feedback (hover, click states)

### Design Philosophy

This scene demonstrates that Brandon Mills' work ethic combines:
- **Renaissance Mastery:** Deep study, technical precision, anatomical understanding
- **Martial Discipline:** Physical practice, focused repetition, embodied wisdom
- **East Meets West:** Synthesis of European and Asian philosophical traditions
- **Theory + Practice:** Ideas on paper + physical execution

Every element tells this story without a single word of text.

### Future Expansion

**Potential Enhancements:**
- Animated quill pen writing
- Scrolling technical drawings
- Rotating meditation bowl with sound
- Dummy arm movement on interaction
- Candle flame particle system
- Ink bottle liquid simulation
- Book page flip animations
- Dynamic shadow puppets on walls

**Other Journey Stops:**
- GALLERY: Art museum gallery with paintings and sculptures
- BLOG: Ancient library with floating books
- MEDITATION: Zen garden with water features
- SHOP: Luxury boutique with product displays
- MIND TOOLS: Futuristic lab with holographic interfaces
- ABOUT: Personal study with memorabilia
- CONTACT: Postmodern communication hub

## Development Guidelines

### Creating New Scenes

1. **Concept Development:**
   - Define the core metaphor or story
   - List 5-10 key environmental elements
   - Sketch basic composition and camera angle
   - Choose color palette and lighting mood

2. **Implementation:**
   - Start with floor and walls (environmental bounds)
   - Add central focal point (hero element)
   - Layer in supporting details (props, artifacts)
   - Implement lighting (primary, accent, fill)
   - Add atmospheric effects (particles, fog)

3. **Polish:**
   - Tune material properties (roughness, metalness)
   - Adjust lighting intensity and color
   - Add subtle animations (floating, breathing)
   - Implement interactive states (hover, active)
   - Optimize performance (polygon count, draw calls)

4. **Quality Checklist:**
   - [ ] Scene tells clear story without text
   - [ ] Materials use proper PBR values
   - [ ] Shadows are soft and realistic
   - [ ] Animations are subtle and elegant
   - [ ] 60fps on target hardware
   - [ ] Responsive to interaction
   - [ ] Matches brand aesthetic (Kasane luxury)
   - [ ] Accessible (keyboard navigation works)

### Performance Budget

Per scene targets:
- **Polygons:** 10,000-20,000 triangles
- **Draw Calls:** 40-80 meshes
- **Particles:** 500-1000 total
- **Lights:** 3-5 dynamic lights
- **Textures:** Prefer procedural (zero texture memory)
- **Frame Time:** <16.67ms (60fps)

### Naming Conventions

- Scene files: `{theme}-scene.tsx` (kebab-case)
- Component name: `{Theme}Scene` (PascalCase)
- Position constants: Scene-specific, document in comments

## Resources

**Three.js Materials:**
- https://threejs.org/docs/#api/en/materials/MeshPhysicalMaterial
- https://threejs.org/docs/#api/en/materials/MeshStandardMaterial

**PBR Reference:**
- https://marmoset.co/posts/physically-based-rendering-and-you-can-too/
- https://academy.substance3d.com/courses/the-pbr-guide-part-1

**React Three Fiber:**
- https://docs.pmnd.rs/react-three-fiber/
- https://github.com/pmndrs/drei

**Performance:**
- https://discoverthreejs.com/tips-and-tricks/
- https://threejs.org/manual/#en/optimize-lots-of-objects

---

Built with precision by Visual Designer (Agent 3)
Brandon Mills Digital Experience - 2025
