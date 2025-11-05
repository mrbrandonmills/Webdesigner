# Quick Start - Luxury Features Guide

> Get up and running with your museum-quality portfolio in 5 minutes.

---

## 🚀 Run the Site

```bash
cd /Users/brandon/Webdesigner
npm run dev
```

Open http://localhost:3000 to see the magic! ✨

---

## 🎯 What You'll See

### 1. **Cinematic Hero** (Homepage)
- Floating gold gradient orbs
- Mouse-reactive parallax
- Smooth text reveals
- Luxury scroll indicator

### 2. **Magnetic Cursor** (Desktop only)
- Gold ring that follows your mouse
- Pulls towards buttons/links
- Changes size based on context
- Trailing glow effect

### 3. **Glassmorphism** (Everywhere)
- Frosted glass cards
- Backdrop blur effects
- iOS-style transparency
- Elegant borders

### 4. **Smooth Animations** (60fps)
- Spring physics motion
- Scroll-triggered reveals
- Hover transforms
- Page transitions

---

## 💎 Key Features to Test

### Desktop Experience
1. **Move your mouse** - Watch the cursor transform
2. **Hover over buttons** - See magnetic effect pull cursor
3. **Scroll the hero** - Experience parallax blur
4. **Hover product cards** - See 3D tilt + glow
5. **Open cart** - Glass morphism sidebar

### Mobile Experience
1. **Swipe gestures** - Navigate galleries
2. **Touch interactions** - Tap feedback
3. **Responsive layout** - Adapts perfectly
4. **Native cursor** - No custom cursor on mobile

---

## 🎨 Using Luxury Classes

### Quick CSS Classes

```html
<!-- Glass effect -->
<div class="glass rounded-3xl p-8">Frosted glass card</div>

<!-- Shimmer loading -->
<div class="shimmer h-64 w-full rounded-3xl"></div>

<!-- 3D tilt card -->
<div class="tilt-card luxury-card">Hover me for 3D effect</div>

<!-- Gold glow -->
<div class="glow-gold-hover">Hover for glow effect</div>

<!-- GPU accelerated -->
<div class="gpu-accelerated">Smooth 60fps animations</div>
```

### Cursor Attributes

```html
<!-- Magnetic button -->
<button data-cursor-magnetic>Click Me</button>

<!-- Custom cursor text -->
<a href="#" data-cursor-text="View">Link</a>

<!-- Drag indicator -->
<div data-cursor-drag>Draggable</div>
```

---

## 📦 Design Tokens

```typescript
import {
  colors,           // Black, White, Gold palette
  typography,       // Font scales & families
  spacing,          // 4px to 256px system
  animation,        // Timing & easing curves
  motionVariants,   // Framer Motion presets
  animationPresets, // Ready-to-use configs
} from '@/lib/design-tokens'
```

### Quick Example

```tsx
import { motionVariants, animationPresets } from '@/lib/design-tokens'

<motion.div
  variants={motionVariants.fadeInUp}
  transition={animationPresets.normal}
>
  Smooth entrance animation
</motion.div>
```

---

## 🎬 Common Animation Patterns

### Fade In Up
```tsx
<motion.div
  initial={{ opacity: 0, y: 40 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
>
  Content
</motion.div>
```

### Card Hover
```tsx
<motion.div
  whileHover={{ scale: 1.02, y: -8 }}
  transition={{ duration: 0.4 }}
  className="luxury-card"
>
  Card
</motion.div>
```

### Image Zoom
```tsx
<motion.div className="overflow-hidden">
  <motion.img
    whileHover={{ scale: 1.08 }}
    transition={{ duration: 0.6 }}
    src={image}
  />
</motion.div>
```

### Stagger Children
```tsx
<motion.div
  initial="initial"
  animate="animate"
  variants={{
    animate: {
      transition: { staggerChildren: 0.1 }
    }
  }}
>
  {items.map(item => (
    <motion.div
      variants={{
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 }
      }}
    >
      {item}
    </motion.div>
  ))}
</motion.div>
```

---

## 🎨 Color Usage

```tsx
// Text colors
<h1 className="text-white">Primary heading</h1>
<p className="text-white/60">Body text</p>
<span className="text-white/40">Muted text</span>

// Gold accents
<button className="bg-accent-gold text-black">CTA</button>
<div className="border-accent-gold">Gold border</div>
<span className="text-accent-gold">Gold text</span>

// Backgrounds
<div className="bg-black">Dark background</div>
<div className="bg-white/5">Subtle background</div>
<div className="bg-white/10">Card background</div>
```

---

## 📏 Spacing Scale

```tsx
// Padding
<div className="p-4">    {/* 16px - tight */}
<div className="p-6">    {/* 24px - normal */}
<div className="p-8">    {/* 32px - comfortable */}

// Margin
<section className="py-16 md:py-24 lg:py-32">  {/* Responsive */}

// Gaps
<div className="space-y-4">   {/* Tight stack */}
<div className="space-y-8">   {/* Normal stack */}
<div className="space-y-12">  {/* Loose stack */}
```

---

## 📱 Responsive Design

```tsx
// Mobile-first approach
<h1 className="text-6xl md:text-8xl lg:text-9xl">
  Scales from mobile to desktop
</h1>

// Responsive grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

// Responsive padding
<section className="px-8 lg:px-16 py-16 md:py-24 lg:py-32">

// Show/hide by breakpoint
<div className="hidden md:block">Desktop only</div>
<div className="md:hidden">Mobile only</div>
```

---

## 🎯 Performance Tips

### DO's ✅
```tsx
// GPU-accelerated properties
transform: translateX(10px)
opacity: 0.5

// Efficient animations
<motion.div
  style={{ x: scrollX, y: scrollY }}  // Motion values
  transition={{ type: 'spring' }}      // Spring physics
/>

// Lazy loading
<Image loading="lazy" />
```

### DON'Ts ❌
```tsx
// Avoid animating these (slow!)
width: 100px
height: 200px
top: 50px
left: 100px

// Don't over-use will-change
will-change: transform  // Only when animating
```

---

## ♿ Accessibility

### Focus States
```tsx
// Automatically styled with:
*:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 4px;
}
```

### ARIA Labels
```tsx
<button aria-label="Close cart">
  <X size={24} />
</button>

<nav aria-label="Main navigation">
  {/* Menu */}
</nav>
```

### Keyboard Support
- All interactive elements are keyboard accessible
- Tab order follows logical flow
- Esc closes modals/menus
- Enter activates buttons

---

## 📚 Documentation

### Full Guides
- **Design System** - `/docs/DESIGN_SYSTEM.md`
- **What's New** - `LUXURY_ENHANCEMENTS_SUMMARY.md`
- **Features Guide** - `README_LUXURY_FEATURES.md`

### Code References
- **Design Tokens** - `/lib/design-tokens.ts`
- **Global Styles** - `/app/globals.css`
- **Hero Component** - `/components/gallery/hero.tsx`
- **Cursor Component** - `/components/custom-cursor.tsx`

---

## 🐛 Troubleshooting

### Cursor not showing?
- Only works on desktop (> 768px width)
- Check browser console for errors
- Ensure JavaScript is enabled

### Animations stuttering?
- Check if GPU acceleration is working
- Disable browser extensions
- Try in incognito mode
- Check performance in DevTools

### Glass effect not working?
- Safari requires `-webkit-backdrop-filter`
- Check if backdrop-filter is supported
- Falls back gracefully on older browsers

---

## 🎉 You're Ready!

Your luxury portfolio is fully operational with:
- ✅ Museum-quality design system
- ✅ Cinematic animations
- ✅ Magnetic cursor
- ✅ Glassmorphism effects
- ✅ 60fps smooth motion
- ✅ Complete documentation

### Next Steps:
1. **Explore the site** - Test all interactions
2. **Read the docs** - Deep dive into features
3. **Customize** - Make it yours
4. **Deploy** - Share with the world
5. **Iterate** - Keep improving

---

**Need Help?**

1. Check `/docs/DESIGN_SYSTEM.md` for complete guide
2. Review `LUXURY_ENHANCEMENTS_SUMMARY.md` for what's new
3. Inspect component code for examples
4. Test on multiple devices

---

**Your luxury transformation is complete!** 🎊

Built with 💎 precision and ✨ elegance

