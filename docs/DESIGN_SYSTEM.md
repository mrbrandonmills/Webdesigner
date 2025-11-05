# Brandon Mills - Museum-Quality Design System

A comprehensive luxury design system inspired by Louis Vuitton, Hermès, Gucci, and Apple's refined aesthetic.

---

## 🎨 Design Philosophy

**Museum Quality** - Every pixel tells a story. Every interaction delights. Every animation flows like water.

### Core Principles

1. **Elegance Through Simplicity** - Remove unnecessary elements, focus on what matters
2. **Generous White Space** - Let content breathe, create visual hierarchy
3. **Smooth 60fps Animations** - Buttery transitions using GPU-accelerated transforms
4. **Accessibility First** - WCAG AA compliant, keyboard navigable, screen reader friendly
5. **Performance Optimized** - Fast loading, efficient animations, code splitting

---

## 🎭 Color Palette

### Primary Colors

```css
Black:   #000000  /* Deep luxury black */
White:   #FFFFFF  /* Pure white for contrast */
Gold:    #C9A050  /* Signature luxury gold */
```

### Gold Variations

```css
Gold Light:  #D4AF37  /* Highlights and accents */
Gold Dark:   #B89040  /* Hover states */
Gold Muted:  rgba(201, 160, 80, 0.6)  /* Subtle backgrounds */
```

### Gray Scale (White-based opacity)

```css
Gray 50:   rgba(255, 255, 255, 0.05)  /* Subtle backgrounds */
Gray 100:  rgba(255, 255, 255, 0.10)  /* Card backgrounds */
Gray 200:  rgba(255, 255, 255, 0.20)  /* Borders */
Gray 300:  rgba(255, 255, 255, 0.30)  /* Hover backgrounds */
Gray 400:  rgba(255, 255, 255, 0.40)  /* Muted text */
Gray 500:  rgba(255, 255, 255, 0.50)  /* Secondary text */
Gray 600:  rgba(255, 255, 255, 0.60)  /* Primary text */
Gray 900:  rgba(255, 255, 255, 0.90)  /* Strong emphasis */
```

### Usage Guidelines

- **Black backgrounds** for luxury feel and content focus
- **White text** for primary content (90-100% opacity)
- **Gold accents** for CTAs, highlights, and interactive states
- **Gray scale** for hierarchy and subtle UI elements

---

## 📐 Typography

### Font Families

```css
Serif:  'Playfair Display', 'Cormorant Garamond', Georgia, serif
Sans:   'Inter', -apple-system, BlinkMacSystemFont, sans-serif
```

### Type Scale

```css
xs:    12px  /* 0.75rem  - Captions, labels */
sm:    14px  /* 0.875rem - Small text */
base:  16px  /* 1rem     - Body text */
lg:    18px  /* 1.125rem - Large body */
xl:    20px  /* 1.25rem  - Subheadings */
2xl:   24px  /* 1.5rem   - Section titles */
3xl:   30px  /* 1.875rem - Small headings */
4xl:   36px  /* 2.25rem  - Medium headings */
5xl:   48px  /* 3rem     - Large headings */
6xl:   60px  /* 3.75rem  - Hero text */
7xl:   72px  /* 4.5rem   - Display text */
8xl:   96px  /* 6rem     - Large display */
9xl:   128px /* 8rem     - Hero display */
```

### Hierarchy Examples

```tsx
// Hero Title
<h1 className="font-serif text-6xl md:text-8xl lg:text-9xl font-light text-white leading-[0.9] tracking-tight">
  Brandon Mills
</h1>

// Section Title
<h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white font-light">
  Selected Work
</h2>

// Card Title
<h3 className="font-serif text-xl md:text-2xl text-white font-normal">
  Product Name
</h3>

// Body Text
<p className="text-base md:text-lg text-white/60 font-light leading-relaxed">
  Description text
</p>

// Caption
<span className="text-xs md:text-sm text-white/40 tracking-[0.2em] uppercase font-light">
  Category Label
</span>
```

### Letter Spacing

```css
Tighter:  -0.05em  /* Large display text */
Tight:    -0.025em /* Headings */
Normal:   0        /* Body text */
Wide:     0.025em  /* Subheadings */
Wider:    0.05em   /* Small headings */
Widest:   0.1em    /* Labels */
Luxury:   0.2em    /* Uppercase luxury */
Ultra:    0.3em    /* Extra luxury */
```

---

## 📏 Spacing System

```css
xs:    4px    /* 0.25rem - Tight spacing */
sm:    8px    /* 0.5rem  - Compact spacing */
md:    16px   /* 1rem    - Default spacing */
lg:    24px   /* 1.5rem  - Comfortable spacing */
xl:    32px   /* 2rem    - Large spacing */
2xl:   48px   /* 3rem    - Section spacing */
3xl:   64px   /* 4rem    - Large sections */
4xl:   96px   /* 6rem    - Hero spacing */
5xl:   128px  /* 8rem    - Extra large */
6xl:   192px  /* 12rem   - Massive spacing */
7xl:   256px  /* 16rem   - Ultra spacing */
```

### Component Spacing

```tsx
// Card padding
<div className="p-6 md:p-8">

// Section padding
<section className="py-16 md:py-24 lg:py-32 px-8 lg:px-16">

// Element gaps
<div className="space-y-4">  /* Tight */
<div className="space-y-8">  /* Normal */
<div className="space-y-12"> /* Comfortable */
```

---

## 🎬 Animation System

### Timing Functions

```css
/* Luxury easing - smooth and elegant */
cubic-bezier(0.22, 1, 0.36, 1)

/* Apple-style easing */
cubic-bezier(0.16, 1, 0.3, 1)

/* Bouncy spring */
cubic-bezier(0.34, 1.56, 0.64, 1)
```

### Duration Scale

```css
Instant:  100ms  /* Immediate feedback */
Fast:     200ms  /* Hover, button press */
Normal:   400ms  /* Card reveals, transitions */
Slow:     600ms  /* Image zoom, parallax */
Slower:   800ms  /* Hero sections */
Slowest:  1000ms /* Page transitions */
```

### Common Animations

#### Fade In Up
```tsx
<motion.div
  initial={{ opacity: 0, y: 40 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
>
  Content
</motion.div>
```

#### Card Hover
```tsx
<motion.div
  whileHover={{
    scale: 1.02,
    y: -8,
  }}
  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
  className="luxury-card"
>
  Card Content
</motion.div>
```

#### Image Zoom
```tsx
<motion.div
  className="overflow-hidden"
>
  <motion.img
    whileHover={{ scale: 1.08 }}
    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    src={image}
  />
</motion.div>
```

#### Stagger Children
```tsx
<motion.div
  initial="initial"
  animate="animate"
  variants={{
    animate: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }}
>
  {items.map((item, i) => (
    <motion.div
      key={i}
      variants={{
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
      }}
    >
      {item}
    </motion.div>
  ))}
</motion.div>
```

---

## 🏗️ Component Library

### Buttons

#### Primary Button (Gold)
```tsx
<button className="px-8 py-4 bg-accent-gold text-black rounded-full font-medium tracking-[0.2em] uppercase text-sm hover:bg-accent-hover transition-all duration-300 shadow-xl shadow-accent-gold/30">
  Call to Action
</button>
```

#### Secondary Button (Ghost)
```tsx
<button className="px-8 py-4 border border-white/20 text-white rounded-full font-light tracking-[0.2em] uppercase text-sm hover:bg-white/5 hover:border-accent-gold/30 transition-all duration-300">
  Learn More
</button>
```

#### Glass Button
```tsx
<button className="px-10 py-5 glass rounded-full border border-white/20 text-white font-light tracking-[0.2em] uppercase text-sm hover:border-accent-gold/50 transition-all duration-300">
  Explore
</button>
```

### Cards

#### Product Card
```tsx
<div className="group bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden hover:border-accent-gold/30 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
  {/* Image */}
  <div className="aspect-square overflow-hidden">
    <img
      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
      src={image}
    />
  </div>

  {/* Content */}
  <div className="p-6 space-y-4">
    <h3 className="text-xl font-serif">{title}</h3>
    <p className="text-white/60 text-sm">{description}</p>
  </div>
</div>
```

#### Project Card
```tsx
<div className="group relative aspect-[4/5] overflow-hidden rounded-2xl">
  <img
    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-600"
    src={image}
  />

  {/* Overlay */}
  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
    <div className="absolute bottom-0 p-6">
      <h3 className="text-2xl font-serif mb-2">{title}</h3>
      <p className="text-sm text-gray-300">{category}</p>
    </div>
  </div>
</div>
```

### Navigation

#### Sticky Header
```tsx
<nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
  scrolled ? 'bg-black/80 backdrop-blur-md border-b border-white/10' : 'bg-transparent'
}`}>
  <div className="container-wide flex items-center justify-between h-20">
    <Logo />
    <Menu />
  </div>
</nav>
```

### Loading States

#### Skeleton Card
```tsx
<div className="bg-white/5 rounded-3xl overflow-hidden">
  <div className="aspect-square shimmer" />
  <div className="p-6 space-y-4">
    <div className="h-6 w-3/4 bg-white/10 rounded shimmer" />
    <div className="h-4 w-full bg-white/5 rounded shimmer" />
  </div>
</div>
```

---

## 🎭 Luxury Effects

### Glass Morphism
```css
.glass {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
```

### Gold Glow
```css
.glow-gold {
  box-shadow: 0 0 20px rgba(201, 160, 80, 0.3),
              0 0 40px rgba(201, 160, 80, 0.2),
              0 0 60px rgba(201, 160, 80, 0.1);
}
```

### Shimmer Loading
```css
@keyframes shimmer {
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
}

.shimmer {
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.05) 0%,
    rgba(255, 255, 255, 0.15) 50%,
    rgba(255, 255, 255, 0.05) 100%
  );
  background-size: 1000px 100%;
  animation: shimmer 2s infinite;
}
```

### 3D Card Tilt
```css
.tilt-card {
  transform-style: preserve-3d;
  transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
}

.tilt-card:hover {
  transform: perspective(1000px) rotateX(2deg) rotateY(2deg);
}
```

---

## ♿ Accessibility

### Focus States
```css
*:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 4px;
  border-radius: 4px;
}
```

### Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### ARIA Labels
```tsx
<button aria-label="Close cart">
  <X size={24} />
</button>

<nav aria-label="Main navigation">
  {/* Menu items */}
</nav>
```

### Keyboard Navigation
- All interactive elements are keyboard accessible
- Tab order follows logical flow
- Focus indicators are clearly visible
- Skip links for screen readers

---

## 📱 Responsive Design

### Breakpoints
```css
sm:   640px   /* Mobile landscape */
md:   768px   /* Tablet */
lg:   1024px  /* Desktop */
xl:   1280px  /* Large desktop */
2xl:  1536px  /* Extra large */
```

### Mobile-First Approach
```tsx
{/* Mobile default, scale up */}
<h1 className="text-6xl md:text-8xl lg:text-9xl">

{/* Responsive spacing */}
<section className="py-16 md:py-24 lg:py-32 px-8 lg:px-16">

{/* Responsive grid */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
```

### Touch Targets
- Minimum 44px × 44px for touch targets
- Adequate spacing between interactive elements
- Swipe gestures for mobile galleries

---

## 🚀 Performance Guidelines

### Image Optimization
```tsx
<Image
  src={src}
  alt={alt}
  width={800}
  height={600}
  quality={90}
  loading="lazy"
  placeholder="blur"
/>
```

### Code Splitting
```tsx
// Lazy load heavy components
const Gallery = dynamic(() => import('@/components/gallery'), {
  loading: () => <Skeleton />,
  ssr: false,
})
```

### GPU Acceleration
```css
/* Use transform and opacity for animations */
.gpu-accelerated {
  transform: translateZ(0);
  will-change: transform;
  backface-visibility: hidden;
}
```

### Animation Performance
- Use `transform` and `opacity` (GPU accelerated)
- Avoid animating `width`, `height`, `top`, `left`
- Use `will-change` sparingly
- Remove `will-change` after animation completes

---

## 🎯 Usage Examples

### Hero Section
```tsx
<section className="relative h-screen bg-black overflow-hidden">
  {/* Background with parallax */}
  <motion.div
    style={{ y: scrollY }}
    className="absolute inset-0"
  >
    <div className="bg-gradient-to-br from-gray-900 via-black to-gray-900" />
  </motion.div>

  {/* Content */}
  <div className="relative z-10 flex h-full items-center justify-center px-8">
    <div className="text-center">
      <motion.h1
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="font-serif text-9xl font-light text-white"
      >
        Brandon Mills
      </motion.h1>
    </div>
  </div>
</section>
```

### Product Grid
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
  {products.map((product, i) => (
    <motion.div
      key={product.id}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{
        duration: 0.8,
        delay: i * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <ProductCard product={product} />
    </motion.div>
  ))}
</div>
```

---

## 📦 Design Tokens Import

```tsx
import {
  colors,
  typography,
  spacing,
  animation,
  shadows,
  gradients,
  motionVariants,
  animationPresets,
} from '@/lib/design-tokens'

// Use in components
<motion.div
  variants={motionVariants.fadeInUp}
  transition={animationPresets.normal}
>
```

---

## 🎨 Brand Assets

### Logo Usage
- Minimum size: 120px width
- Clear space: 20px minimum around logo
- Use white logo on dark backgrounds
- Use gold logo for emphasis

### Color Combinations

**Primary Palette**
- Black background + White text + Gold accents ✓
- Black background + Gray text + Gold highlights ✓

**Avoid**
- White text on light backgrounds ✗
- Low contrast combinations ✗
- Multiple bright colors ✗

---

## 📚 Further Resources

- **Framer Motion Docs**: https://www.framer.com/motion/
- **Tailwind CSS**: https://tailwindcss.com/
- **WCAG Guidelines**: https://www.w3.org/WAI/WCAG21/quickref/
- **Design Inspiration**:
  - Louis Vuitton: lvmh.com
  - Apple Product Pages
  - Awwwards: awwwards.com

---

**Built with precision. Designed with elegance. Experienced with delight.**

© Brandon Mills - All Rights Reserved
