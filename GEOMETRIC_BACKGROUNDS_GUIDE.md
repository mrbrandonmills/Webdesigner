# Geometric Backgrounds Guide

Beautiful animated geometric backgrounds inspired by your Block C book design and Dolce & Gabbana luxury aesthetics.

## Component Location
`components/ui/geometric-background.tsx`

## Usage

```tsx
import GeometricBackground from '@/components/ui/geometric-background'

export default function MyPage() {
  return (
    <div className="relative min-h-screen">
      <GeometricBackground
        variant="sacred-geometry"
        intensity="subtle"
        color="gold"
      />

      {/* Your content here */}
      <div className="relative z-10">
        <h1>Your Content</h1>
      </div>
    </div>
  )
}
```

## Variants

### 1. `sacred-geometry` / `vitruvian` (Recommended for Genesis stories)
Inspired by your Block C book design:
- Vitruvian Man concentric circles (28%, 42%, 56% radii)
- Golden ratio nodes (Φ = 1.618)
- Flower of Life pattern
- Sacred geometry lines
- Floating golden ratio rectangles

**Perfect for:**
- Genesis blog posts
- Writing/philosophy pages
- Premium content
- Meditation pages

### 2. `luxury`
High-end geometric shapes:
- Large rotating hexagons
- Floating circles
- Small geometric diamonds and squares

**Perfect for:**
- Homepage
- Shop pages
- Premium product pages

### 3. `smoke`
Ethereal, flowing gradients:
- Smoke-like blurred clouds
- Layered gradients
- Dreamy atmosphere

**Perfect for:**
- Meditation pages
- Essays
- Reflective content

### 4. `particles`
Floating particles with connecting lines:
- 50 animated particles
- Dynamic connecting lines
- Network effect

**Perfect for:**
- Tech/AI content
- Future-focused pages
- Dynamic landing pages

### 5. `waves`
Flowing wave patterns:
- Animated sine waves
- Calming motion
- Oceanic feel

**Perfect for:**
- Audio meditation pages
- Calm, reflective content
- Nature-themed sections

### 6. `minimal` (Default)
Simple gradient orbs:
- 3 large blurred circles
- Subtle movement
- Clean and unobtrusive

**Perfect for:**
- Text-heavy pages
- When you want minimal distraction

## Intensity Levels

```tsx
intensity="subtle"  // opacity: 0.03 (recommended)
intensity="medium"  // opacity: 0.06
intensity="bold"    // opacity: 0.12
```

**Recommendation:** Use `"subtle"` for most pages. Only use `"medium"` or `"bold"` for special hero sections.

## Color Options

```tsx
color="gold"      // Your brand gold (rgba(201, 160, 80))
color="white"     // Pure white (rgba(255, 255, 255))
color="gradient"  // Same as gold (can be customized)
```

## Examples

### Genesis Blog Post
```tsx
<GeometricBackground
  variant="sacred-geometry"
  intensity="subtle"
  color="gold"
/>
```

### Homepage Hero
```tsx
<GeometricBackground
  variant="luxury"
  intensity="medium"
  color="gold"
/>
```

### Meditation Page
```tsx
<GeometricBackground
  variant="smoke"
  intensity="subtle"
  color="white"
/>
```

### AI/Tech Content
```tsx
<GeometricBackground
  variant="particles"
  intensity="medium"
  color="gold"
/>
```

## Performance Notes

- All backgrounds are `fixed` and `pointer-events-none`
- Animations use Framer Motion with GPU-accelerated transforms
- Backgrounds don't interfere with scrolling or clicks
- Use `intensity="subtle"` for best readability

## Customization

The component is fully customizable. You can:
1. Add new variants by editing the component file
2. Adjust animation speeds in `transition` props
3. Change opacity calculations in the `opacityMap`
4. Add new color schemes in the `colorMap`

## Sacred Geometry Explained

The `sacred-geometry` variant is based on:

1. **Vitruvian Proportions**: Circle radii at 28%, 42%, and 56%
2. **Golden Ratio (Φ = 1.618)**:
   - Nodes at 61.8% and 38.2% coordinates
   - Rectangle dimensions use Φ for width/height
3. **Flower of Life**: 6 circles arranged in perfect hexagonal pattern
4. **Sacred Lines**: Intersecting lines at golden ratio points

This creates a mathematically harmonious background that subtly communicates **order, beauty, and perfection**—perfect for your personal brand.

## Where It's Already Used

1. **Genesis Blog Posts**: `/blog/genesis/[slug]` - sacred-geometry variant
2. (Add more as you implement them)

## Future Ideas

- Add constellation pattern (connect golden ratio nodes like stars)
- Sacred spiral (Fibonacci sequence)
- Metatron's Cube
- Sri Yantra pattern
- Platonic solids (rotating 3D wireframes)

---

**Remember:** The background is a supporting actor. Your content is the star. Keep it subtle.
