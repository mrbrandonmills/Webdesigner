# Mobile Optimization Quick Reference Guide

## 🎯 Quick Checklist for New Components

### Before Publishing Any Component:
- [ ] Tested on mobile viewport (320px, 375px, 768px)
- [ ] All touch targets are minimum 44×44px
- [ ] No horizontal overflow on any breakpoint
- [ ] Text is readable without zoom
- [ ] Images scale properly
- [ ] Spacing adapts to screen size

---

## 📱 Responsive Breakpoints

```tsx
// Use these Tailwind breakpoint prefixes
xs:   // 375px  - iPhone SE, small phones
sm:   // 640px  - Large phones
md:   // 768px  - Tablets portrait
lg:   // 1024px - Tablets landscape
xl:   // 1280px - Desktop
2xl:  // 1536px - Large desktop
```

---

## ✍️ Typography Scale

### Headings
```tsx
// H1 - Hero Titles
className="text-4xl xs:text-5xl sm:text-6xl md:text-8xl lg:text-9xl"

// H2 - Section Titles
className="text-3xl xs:text-4xl sm:text-5xl md:text-7xl"

// H3 - Subsection Titles
className="text-2xl xs:text-3xl md:text-4xl"

// H4 - Card Titles
className="text-xl xs:text-2xl md:text-3xl"
```

### Body Text
```tsx
// Large Body
className="text-base sm:text-lg md:text-xl"

// Standard Body
className="text-sm sm:text-base"

// Small Text
className="text-xs sm:text-sm"
```

---

## 🎨 Spacing System

### Padding
```tsx
// Sections
className="py-12 sm:py-16 lg:py-24"
className="px-4 sm:px-6 lg:px-16"

// Cards
className="p-6 sm:p-8 lg:p-12"

// Inline Elements
className="px-4 sm:px-6 md:px-8"
```

### Gaps
```tsx
// Grids
className="gap-4 sm:gap-6 lg:gap-8"

// Flex
className="gap-2 sm:gap-4 md:gap-6"

// Stacks
className="space-y-4 sm:space-y-6 lg:space-y-8"
```

---

## 🖼️ Grid Layouts

### Standard Grid
```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
  {/* items */}
</div>
```

### Gallery Grid
```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
  {/* images */}
</div>
```

### Feature Grid
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
  {/* features */}
</div>
```

---

## 👆 Touch Targets

### Buttons
```tsx
// Primary Button
<button className="min-h-[48px] min-w-[48px] px-8 py-4">

// Icon Button
<button className="min-h-[44px] min-w-[44px] p-2 flex items-center justify-center">

// Text Link
<a className="min-h-[44px] flex items-center">
```

### Navigation
```tsx
// Nav Links
<Link className="min-h-[44px] flex items-center px-4">

// Mobile Menu Items
<Link className="min-h-[48px] flex items-center text-2xl sm:text-3xl">
```

---

## 🖱️ Interactive Elements

### Forms
```tsx
// Input Fields (16px font prevents iOS zoom)
<input
  type="email"
  className="px-6 py-4 text-base min-h-[48px]"
/>

// Textarea
<textarea
  className="px-6 py-4 text-base min-h-[120px]"
/>

// Select
<select className="px-6 py-4 text-base min-h-[48px]">
```

### Cards
```tsx
// Clickable Card
<div className="group relative aspect-[4/5] overflow-hidden">
  <div className="p-4 sm:p-6">
    <h3 className="text-xl sm:text-2xl">Title</h3>
    <p className="text-xs sm:text-sm">Description</p>
  </div>
</div>
```

---

## 📐 Common Patterns

### Hero Section
```tsx
<section className="pt-32 pb-20 container-wide">
  <div className="max-w-4xl mx-auto text-center space-y-6 sm:space-y-8">
    <h1 className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl px-4">
      Hero Title
    </h1>
    <p className="text-base sm:text-lg md:text-xl px-6">
      Description text
    </p>
  </div>
</section>
```

### Content Section
```tsx
<section className="py-12 sm:py-16 lg:py-24 container-wide">
  <div className="max-w-6xl mx-auto">
    <h2 className="text-3xl xs:text-4xl md:text-5xl mb-6 sm:mb-8">
      Section Title
    </h2>
    {/* content */}
  </div>
</section>
```

### Two-Column Layout
```tsx
<div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
  <div className="order-2 md:order-1">
    {/* Image */}
  </div>
  <div className="order-1 md:order-2 space-y-4">
    {/* Content */}
  </div>
</div>
```

---

## 🚫 Common Mistakes to Avoid

### ❌ Don't Do This
```tsx
// Too small touch targets
<button className="p-1 text-xs">

// Fixed widths that don't scale
<div className="w-[800px]">

// Text that's too small on mobile
<p className="text-xs md:text-sm">

// No mobile breakpoint
<div className="grid grid-cols-3">
```

### ✅ Do This Instead
```tsx
// Proper touch targets
<button className="min-h-[44px] px-4 py-2 text-sm sm:text-base">

// Responsive widths
<div className="max-w-6xl w-full mx-auto px-4 sm:px-6">

// Mobile-first text sizing
<p className="text-sm sm:text-base md:text-lg">

// Mobile-first grid
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
```

---

## 🔍 Testing Commands

### Browser DevTools
```bash
# Chrome DevTools Device Mode
Cmd+Option+I (Mac) / Ctrl+Shift+I (Windows)
Then click "Toggle Device Toolbar"

# Test These Viewports:
- iPhone SE (375×667)
- iPhone 12 Pro (390×844)
- iPad (768×1024)
- iPad Pro (1024×1366)
```

### Local Development
```bash
# Start dev server
npm run dev

# Access from mobile device on same network
http://YOUR-LOCAL-IP:3000
```

---

## 📱 Viewport Meta Tag

Already configured in `app/layout.tsx`:
```typescript
viewport: {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
}
```

---

## 🎨 CSS Utilities Available

### Container
```css
.container-wide  // Responsive container with safe padding
```

### Overflow Prevention
```css
// Already applied globally
max-width: 100vw
overflow-x: hidden
```

### Touch Spacing
```css
// Available in Tailwind
min-h-touch    // 44px
min-h-touch-lg // 48px
```

---

## 🔧 Quick Fixes

### Horizontal Overflow
```tsx
// Add to parent container
className="max-w-full overflow-x-hidden"
```

### Text Too Large
```tsx
// Use mobile-first sizing
className="text-2xl sm:text-3xl md:text-4xl"
```

### Touch Target Too Small
```tsx
// Add minimum dimensions
className="min-h-[44px] min-w-[44px]"
```

### Image Overflow
```tsx
// Constrain image
className="max-w-full h-auto"
```

---

## 📚 Resources

- [Apple HIG - Touch Targets](https://developer.apple.com/design/human-interface-guidelines/touch-targets)
- [Material Design - Touch Targets](https://m3.material.io/foundations/interaction/touch-targets)
- [WCAG 2.1 - Target Size](https://www.w3.org/WAI/WCAG21/Understanding/target-size.html)
- [Tailwind Responsive Design](https://tailwindcss.com/docs/responsive-design)

---

## 🆘 Troubleshooting

### Issue: Horizontal scroll on mobile
**Solution**: Add `max-w-full` to wide containers, check for fixed widths

### Issue: Text unreadable on small screens
**Solution**: Use mobile-first text sizing with `xs:` and `sm:` breakpoints

### Issue: Buttons hard to tap
**Solution**: Ensure `min-h-[44px]` and `min-w-[44px]` on all interactive elements

### Issue: Images breaking layout
**Solution**: Add `max-w-full h-auto` to images

### Issue: Grid items too small
**Solution**: Use `grid-cols-1 sm:grid-cols-2 md:grid-cols-3` pattern

---

**Quick Tip**: Always test on a real device! Browser DevTools are helpful, but nothing beats testing on an actual iPhone or Android phone.

**Pro Tip**: Use `clamp()` for fluid typography:
```css
font-size: clamp(1rem, 2vw, 2rem);
```

---

**Last Updated**: November 17, 2025
