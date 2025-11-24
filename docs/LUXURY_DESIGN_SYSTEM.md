# Brandon Mills Luxury Design System
## Museum-Quality Portfolio Design Guidelines

**Last Updated:** November 23, 2025
**Designer:** Agent 3 - Visual Designer
**Version:** 1.0

---

## Design Philosophy

This design system creates a museum-quality luxury experience inspired by:
- **Kasané Keyboard**: Minimalist aesthetics, generous whitespace, craftsmanship storytelling
- **Louis Vuitton**: Timeless elegance, premium positioning
- **Hermès**: Attention to detail, sophisticated restraint

Every pixel matters. Every animation tells a story. Every interaction delights.

---

## Color Palette

### Primary Colors (Kasané-Inspired)

```css
/* Neutrals - Foundation */
--pearl: #FAFAF9        /* Off-white background, warm and inviting */
--porcelain: #F5F5F4    /* Card backgrounds, subtle elevation */
--smoke: #E7E5E4        /* Borders, dividers, subtle separators */
--graphite: #78716C     /* Secondary text, captions */
--charcoal: #292524     /* Body text, high readability */
--onyx: #0C0A09         /* Headings, maximum contrast */

/* Accent Colors - Use Sparingly (10% of design) */
--accent-gold: #D4AF37  /* Premium accents, CTAs, highlights */
--bronze: #CD7F32       /* Secondary CTAs, hover states */
--sage: #8A9A5B         /* Success states, natural accent */
```

### Color Usage Guidelines

| Element | Color | Rationale |
|---------|-------|-----------|
| Primary Background | Pearl (#FAFAF9) | Warm white, avoids clinical feel |
| Content Cards | Porcelain (#F5F5F4) | Subtle elevation without shadows |
| Headings | Onyx (#0C0A09) | Maximum contrast (19.5:1 ratio) |
| Body Text | Charcoal (#292524) | Excellent readability (15.2:1) |
| CTAs | Gold (#D4AF37) | Luxury association, high visibility |
| Hover States | Bronze (#CD7F32) | Warm feedback |

**Contrast Ratios (WCAG AAA Compliant):**
- Onyx on Pearl: 19.5:1 ✓
- Charcoal on Pearl: 15.2:1 ✓
- Gold on Onyx: 4.8:1 (suitable for large text) ✓

---

## Typography System

### Font Families

```css
font-family: {
  serif: ['Cormorant Garamond', 'Playfair Display', 'Georgia', 'serif'],
  sans: ['Inter', 'system-ui', 'sans-serif'],
  mono: ['JetBrains Mono', 'monospace'],
}
```

### Luxury Typographic Scale (1.250 ratio - Major Third)

| Class | Size | Usage | Line Height | Letter Spacing |
|-------|------|-------|-------------|----------------|
| `text-display-1` | 4.768rem (76.29px) | Hero headlines | 1.1 | 0.08em (8%) |
| `text-display-2` | 3.815rem (61.04px) | Section headers | 1.1 | 0.08em (8%) |
| `text-h1` | 3.052rem (48.83px) | Primary headings | 1.25 | 0.04em (4%) |
| `text-h2` | 2.441rem (39.06px) | Secondary headings | 1.25 | 0.04em (4%) |
| `text-h3` | 1.953rem (31.25px) | Tertiary headings | 1.25 | 0.04em (4%) |
| `text-h4` | 1.563rem (25px) | Subheadings | 1.5 | 0.02em (2%) |
| `text-body-large` | 1.250rem (20px) | Large body text | 1.75 | 0.01em (1%) |
| `text-body` | 1rem (16px) | Standard body | 1.75 | 0.01em (1%) |
| `text-small` | 0.800rem (12.8px) | Captions, labels | 1.5 | 0.12em (12%) |

### Font Weight Usage

- **300 (Light):** Display headlines, elegant emphasis
- **400 (Regular):** Body text, standard UI
- **500 (Medium):** Subheadings, navigation links
- **600 (Semibold):** Buttons, CTAs, labels
- **700 (Bold):** Section headers, strong emphasis

---

## Spacing System

### Luxury Spacing Scale

```css
spacing: {
  'section': '120px',      /* Between major sections */
  'subsection': '80px',    /* Between content blocks */
  'content': '48px',       /* Between related content */
  'element': '24px',       /* Between UI elements */
  'micro': '12px',         /* Internal component spacing */
  'touch': '44px',         /* Minimum touch target */
  'touch-lg': '48px',      /* Larger touch target */
}
```

### Whitespace Philosophy

- **70%+ negative space** creates luxury perception
- Generous padding on all content sections
- Vertical rhythm: consistent spacing multiples
- Breathing room around CTAs and key elements

---

## Animation Principles

### Timing & Easing

```javascript
// Custom luxury easing
const luxuryEasing = [0.22, 1, 0.36, 1]

// Duration guidelines
const durations = {
  fast: 200,      // Hover effects, button presses
  normal: 400,    // Card reveals, element transitions
  slow: 800,      // Hero sections, page transitions
}
```

### Core Animation Patterns

**1. Fade In**
```javascript
initial={{ opacity: 0 }}
animate={{ opacity: 1 }}
transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
```

**2. Slide Up**
```javascript
initial={{ opacity: 0, y: 30 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
```

**3. Letter-by-Letter Reveal**
```javascript
letters.map((letter, index) => (
  <motion.span
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{
      duration: 0.8,
      delay: index * 0.1,
      ease: [0.22, 1, 0.36, 1]
    }}
  >
    {letter}
  </motion.span>
))
```

### Performance Targets

- **60fps minimum** for all animations
- Use `transform` and `opacity` only (GPU-accelerated)
- Avoid animating `width`, `height`, `top`, `left`
- Respect `prefers-reduced-motion` media query

---

## Component Patterns

### Hover States

**Subtle lift effect:**
```css
.luxury-card {
  @apply transition-all duration-500 ease-luxury;
  @apply hover:scale-[1.02] hover:-translate-y-2;
  @apply hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)];
}
```

### Buttons

**Primary CTA:**
```tsx
<button className="px-10 py-5 bg-accent-gold text-black font-medium tracking-wider uppercase hover:bg-bronze transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5">
  Explore Collections
</button>
```

### Loading States

**Skeleton screens preferred** over spinners for perceived performance

**Elegant spinner alternative:**
```tsx
{[0, 1, 2].map((i) => (
  <motion.div
    className="w-4 h-4 bg-gold rounded-full"
    animate={{ y: [0, -20, 0], scale: [1, 1.2, 1] }}
    transition={{
      duration: 0.8,
      repeat: Infinity,
      delay: i * 0.2,
      ease: [0.68, -0.55, 0.27, 1.55]
    }}
  />
))}
```

---

## 3D Navigation Menu

### Concept: Train Stops

The 3D navigation menu creates a depth effect where menu items are "stations" in 3D space:

- **Depth stacking:** Each item positioned deeper in Z-space
- **Hover interaction:** Hovered item moves forward, others recede
- **Smooth transitions:** Luxury easing for all movements
- **Mobile fallback:** 2D elegant menu on small screens

### Technical Implementation

```tsx
import ThreeDNavMenu from '@/components/navigation/3d-nav-menu'

// Desktop 3D menu
<ThreeDNavMenu
  navItems={mainNavLinks}
  isOpen={threeDMenuOpen}
  onClose={handleClose}
/>

// Mobile 2D fallback
<MobileNavMenu
  navItems={mainNavLinks}
  isOpen={threeDMenuOpen}
  onClose={handleClose}
/>
```

---

## Accessibility Standards

### WCAG AAA Compliance

- ✓ Contrast ratios exceed 7:1 for normal text
- ✓ Minimum 44px touch targets
- ✓ Keyboard navigation fully supported
- ✓ ARIA labels on all interactive elements
- ✓ Screen reader friendly structure
- ✓ `prefers-reduced-motion` respected

### Keyboard Navigation

- `Tab`: Navigate through interactive elements
- `Enter/Space`: Activate buttons and links
- `Esc`: Close modals and overlays
- `Arrow keys`: Navigate within menus

---

## Responsive Breakpoints

```javascript
screens: {
  'xs': '375px',    // iPhone SE
  'sm': '640px',    // Mobile landscape
  'md': '768px',    // Tablet portrait
  'lg': '1024px',   // Tablet landscape / small laptop
  'xl': '1280px',   // Desktop
  '2xl': '1536px',  // Large desktop
}
```

### Mobile-First Approach

Always design mobile first, then enhance for larger screens:

```tsx
className="text-h2 md:text-display-2 px-4 md:px-12 lg:px-24"
```

---

## Success Metrics

Your design succeeds when:

- ✓ Animations are smooth (60fps, no jank)
- ✓ Mobile experience is flawless
- ✓ Loading states provide clear feedback
- ✓ Hover states are delightful and subtle
- ✓ Typography is elegant and readable
- ✓ Color palette is sophisticated
- ✓ Components are reusable and documented
- ✓ Accessibility is built-in
- ✓ Performance is optimized (Lighthouse 90+)
- ✓ Design rivals luxury brands (Kasané, LV, Hermès)

---

## File Structure

```
components/
├── navigation/
│   ├── 3d-nav-menu.tsx          # 3D train stops menu
│   └── navigation-with-3d.tsx   # Enhanced navigation
├── home/
│   ├── hero-video.tsx           # Letter-by-letter animation
│   ├── philosophy-section.tsx   # Luxury typography
│   ├── genesis-archive-section.tsx
│   └── social-proof-section.tsx
└── ui/
    ├── geometric-background.tsx
    └── page-background.tsx

docs/
└── LUXURY_DESIGN_SYSTEM.md      # This file

tailwind.config.ts               # Design tokens
```

---

## Quick Reference: Tailwind Classes

### Common Patterns

**Hero Section:**
```tsx
className="relative h-screen w-full overflow-hidden bg-onyx"
```

**Section Container:**
```tsx
className="py-section bg-pearl relative overflow-hidden"
```

**Content Wrapper:**
```tsx
className="container-wide px-6 md:px-12 lg:px-24"
```

**Luxury Card:**
```tsx
className="bg-porcelain p-content rounded-lg hover:scale-[1.02] transition-transform duration-500 ease-luxury"
```

**Heading:**
```tsx
className="text-h1 md:text-display-1 font-light font-serif text-onyx"
```

**Body Text:**
```tsx
className="text-body md:text-body-large text-charcoal leading-relaxed"
```

**CTA Button:**
```tsx
className="px-10 py-5 bg-accent-gold text-black font-medium tracking-wider uppercase hover:bg-bronze transition-all duration-300"
```

---

## Future Enhancements

### Phase 2 Additions
- [ ] Product gallery with masonry layout
- [ ] Shopping cart slide-out panel
- [ ] Checkout flow components
- [ ] About page with timeline
- [ ] Contact form with validation
- [ ] Footer with newsletter signup

### Phase 3 Polish
- [ ] Sound design (optional, toggleable)
- [ ] Advanced parallax effects
- [ ] Custom cursor interactions
- [ ] Seasonal animations
- [ ] Performance monitoring dashboard

---

**Design with elegance. Build with precision. Delight with every pixel.**

— Agent 3, Visual Designer
