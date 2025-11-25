# Component Patterns & UI Guidelines

Context-specific guidelines for the `components/` directory - React component patterns, styling, and luxury brand standards.

## Overview

This directory contains reusable React components following luxury brand aesthetic standards. All components use TypeScript, Tailwind CSS, and maintain high-end visual design principles inspired by luxury photography and fashion brands.

## Directory Structure

```
components/
├── gallery/                    # Gallery-specific components
│   ├── hero.tsx               # Gallery hero sections
│   ├── project-grid.tsx       # Portfolio grid layouts
│   └── project-detail.tsx     # Project detail views
├── marketing/                  # Marketing & affiliate components
│   ├── affiliate-disclosure.tsx
│   └── affiliate-product-card.tsx
├── navigation.tsx              # Main navigation
├── cart-sidebar.tsx           # E-commerce cart
├── custom-cursor.tsx          # Luxury cursor effects
├── page-transition.tsx        # Page transitions
├── smooth-scroll.tsx          # Smooth scroll behavior
├── error-boundary.tsx         # Error handling
└── [utility components].tsx   # Uploaders, forms, etc.
```

## Luxury Brand Standards

### Design Principles

**Visual Identity:**
- **Minimalist Elegance** - Clean layouts, generous whitespace
- **Premium Typography** - Serif fonts (Cormorant Garamond, Playfair Display)
- **Muted Color Palette** - Black, white, grays, gold accents
- **High-Quality Imagery** - Professional photography, optimized assets
- **Subtle Animations** - Smooth, refined motion (Framer Motion, GSAP)

**Inspiration:**
- Photography: Annie Leibovitz, Peter Lindbergh
- Brands: Chanel, Hermès, Louis Vuitton
- Design: Swiss minimalism, editorial layouts

### Typography

**Font Families:**
```css
/* Headings - Luxury serif */
font-family: 'Cormorant Garamond', 'Playfair Display', Georgia, serif

/* Body - Clean sans-serif */
font-family: system-ui, -apple-system, sans-serif
```

**Scale:**
- Display: text-6xl to text-8xl (hero sections)
- Headings: text-2xl to text-4xl
- Body: text-base to text-lg
- Small: text-sm to text-xs

**Example:**
```tsx
<h1 className="font-serif text-6xl tracking-tight">
  Luxury Heading
</h1>
<p className="text-lg leading-relaxed text-gray-600">
  Body text with comfortable reading experience
</p>
```

### Color Palette

**Primary Colors:**
```css
--background: #ffffff        /* Pure white */
--foreground: #000000        /* Pure black */
--gray-50: #fafafa          /* Lightest gray */
--gray-900: #111111         /* Darkest gray */
```

**Accent Colors (Use Sparingly):**
- Gold: `#D4AF37` - Premium accents
- Warm Gray: `#8B8B8B` - Secondary text

**Example:**
```tsx
<div className="bg-white text-black">
  <p className="text-gray-600">Secondary text</p>
  <span className="text-[#D4AF37]">Gold accent</span>
</div>
```

### Spacing & Layout

**Whitespace is Premium:**
- Generous padding and margins
- Breathable layouts
- Use `space-y-8` to `space-y-16` for vertical spacing
- Use `gap-8` to `gap-12` for grids

**Container Widths:**
```tsx
// Standard content
<div className="max-w-7xl mx-auto px-6 lg:px-8">

// Narrow content (reading)
<div className="max-w-3xl mx-auto px-6">

// Full bleed
<div className="w-full">
```

## Component Patterns

### Component Structure

**Server Component (Default):**
```typescript
// components/gallery/project-grid.tsx
import { Project } from '@/types'

interface ProjectGridProps {
  projects: Project[]
  columns?: 2 | 3 | 4
}

export default function ProjectGrid({
  projects,
  columns = 3
}: ProjectGridProps) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-${columns} gap-8`}>
      {projects.map(project => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  )
}
```

**Client Component (Interactive):**
```typescript
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

interface InteractiveCardProps {
  title: string
  image: string
}

export default function InteractiveCard({ title, image }: InteractiveCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative overflow-hidden"
    >
      {/* Content */}
    </motion.div>
  )
}
```

### Animation Patterns

**Framer Motion (Preferred for Simple Animations):**
```tsx
import { motion } from 'framer-motion'

// Fade in on mount
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, ease: 'easeOut' }}
>
  Content
</motion.div>

// Hover effect
<motion.div
  whileHover={{ scale: 1.05 }}
  transition={{ duration: 0.3 }}
>
  Interactive element
</motion.div>

// Stagger children
<motion.div
  variants={{
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }}
  initial="hidden"
  animate="show"
>
  {items.map(item => (
    <motion.div variants={itemVariants} key={item.id}>
      {item.content}
    </motion.div>
  ))}
</motion.div>
```

**GSAP (For Complex Animations):**
```tsx
'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function ScrollAnimation() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    gsap.fromTo(
      containerRef.current,
      { opacity: 0, y: 100 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }
      }
    )
  }, [])

  return <div ref={containerRef}>Animated content</div>
}
```

### Image Optimization

**Always Use Next.js Image Component:**
```tsx
import Image from 'next/image'

<Image
  src="/images/photo.jpg"
  alt="Descriptive alt text"
  width={1920}
  height={1080}
  quality={90}
  priority={false}  // true for above-fold images
  className="object-cover"
/>

// For dynamic images
<Image
  src={product.imageUrl}
  alt={product.name}
  fill
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  className="object-cover"
/>
```

### Loading States

**Skeleton Loaders:**
```tsx
export function ProductCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="bg-gray-200 aspect-square rounded-lg" />
      <div className="mt-4 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
      </div>
    </div>
  )
}
```

### Error Handling

**Error Boundary Pattern:**
```tsx
'use client'

import { ErrorBoundary } from 'components/error-boundary'

export default function SafeComponent() {
  return (
    <ErrorBoundary fallback={<ErrorFallback />}>
      <ComponentThatMightError />
    </ErrorBoundary>
  )
}

function ErrorFallback() {
  return (
    <div className="p-8 text-center">
      <p className="text-gray-600">Something went wrong</p>
      <button onClick={() => window.location.reload()}>
        Try again
      </button>
    </div>
  )
}
```

## Gallery Components

### Project Grid

**Usage:**
```tsx
import ProjectGrid from '@/components/gallery/project-grid'

<ProjectGrid
  projects={projects}
  columns={3}
  className="mt-16"
/>
```

**Features:**
- Masonry layout option
- Lazy loading images
- Hover effects with Framer Motion
- Responsive grid

### Hero Sections

**Pattern:**
```tsx
export default function Hero({
  title,
  subtitle,
  image
}: HeroProps) {
  return (
    <section className="relative h-screen">
      <Image
        src={image}
        alt=""
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-black/30" />
      <div className="relative h-full flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="font-serif text-7xl mb-4">
            {title}
          </h1>
          <p className="text-xl">{subtitle}</p>
        </div>
      </div>
    </section>
  )
}
```

## E-commerce Components

### Product Card

**Pattern:**
```tsx
interface ProductCardProps {
  product: Product
  onAddToCart?: (product: Product) => void
}

export default function ProductCard({
  product,
  onAddToCart
}: ProductCardProps) {
  return (
    <div className="group">
      <div className="relative aspect-square overflow-hidden rounded-lg">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="mt-4">
        <h3 className="font-serif text-xl">{product.name}</h3>
        <p className="text-gray-600 mt-2">${product.price}</p>
        {onAddToCart && (
          <button
            onClick={() => onAddToCart(product)}
            className="mt-4 w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition"
          >
            Add to Cart
          </button>
        )}
      </div>
    </div>
  )
}
```

### Cart Sidebar

**Features:**
- Slide-in animation
- Cart item management
- Total calculation
- Checkout button

## Form Components

### Input Fields

**Pattern:**
```tsx
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export default function Input({ label, error, ...props }: InputProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium">
          {label}
        </label>
      )}
      <input
        {...props}
        className={`
          w-full px-4 py-2 border rounded-lg
          focus:outline-none focus:ring-2 focus:ring-black
          ${error ? 'border-red-500' : 'border-gray-300'}
        `}
      />
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  )
}
```

## Best Practices

### DO
- Use TypeScript for all components
- Add proper prop types with interfaces
- Use `'use client'` only when needed
- Optimize images with Next.js Image
- Follow luxury brand aesthetic
- Add loading and error states
- Use semantic HTML
- Add accessible labels and ARIA attributes
- Keep components focused and small
- Use Tailwind CSS for styling

### DON'T
- Create overly complex components
- Use `any` type
- Inline large amounts of CSS
- Skip accessibility attributes
- Use low-quality images
- Create duplicate components
- Ignore responsive design
- Skip prop validation
- Use outdated animation libraries
- Hardcode colors (use Tailwind classes)

## Styling Guidelines

### Tailwind CSS Usage

**Preferred Classes:**
```tsx
// Spacing
className="p-8 space-y-6 gap-4"

// Typography
className="font-serif text-4xl leading-tight tracking-tight"

// Layout
className="flex items-center justify-between"
className="grid grid-cols-1 md:grid-cols-3 gap-8"

// Effects
className="transition-all duration-300 ease-out"
className="hover:scale-105 hover:shadow-xl"
```

### Custom Classes (Avoid Unless Necessary)

Only use custom CSS for:
- Complex animations
- Browser-specific fixes
- One-off designs

## Related Documentation

- [Root CLAUDE.md](../CLAUDE.md) - Project overview
- [App Guidelines](../app/CLAUDE.md) - Routing and pages
- [Library Guidelines](../lib/CLAUDE.md) - Utilities
- [Tailwind CSS Docs](https://tailwindcss.com)
- [Framer Motion Docs](https://www.framer.com/motion)

---

**Last Updated:** November 2025
