'use client'

import { usePathname } from 'next/navigation'
import GeometricBackground from './geometric-background'

/**
 * Smart Page Background
 *
 * Automatically selects the perfect geometric background variant
 * based on the current page path. Ensures visual variety across the site
 * while maintaining brand consistency.
 *
 * Usage:
 * Simply add <PageBackground /> to your root layout - that's it!
 */

interface PageBackgroundConfig {
  variant: 'luxury' | 'minimal' | 'smoke' | 'particles' | 'waves' | 'sacred-geometry' | 'vitruvian'
  intensity: 'subtle' | 'medium' | 'bold'
  color: 'gold' | 'white' | 'gradient'
}

export default function PageBackground() {
  const pathname = usePathname()

  // Determine background based on path
  const getBackgroundConfig = (): PageBackgroundConfig => {
    // Homepage - Luxury geometric shapes
    if (pathname === '/') {
      return {
        variant: 'luxury',
        intensity: 'subtle',
        color: 'gold',
      }
    }

    // Genesis stories - Sacred geometry (Vitruvian Man)
    if (pathname?.startsWith('/blog/genesis') || pathname?.startsWith('/gallery/genesis')) {
      return {
        variant: 'sacred-geometry',
        intensity: 'subtle',
        color: 'gold',
      }
    }

    // Blog posts - Particles for intellectual/dynamic content
    if (pathname?.startsWith('/blog')) {
      return {
        variant: 'particles',
        intensity: 'subtle',
        color: 'gold',
      }
    }

    // Writing (books, essays, poems) - Smoke for literary atmosphere
    if (pathname?.startsWith('/writing')) {
      return {
        variant: 'smoke',
        intensity: 'subtle',
        color: 'gold',
      }
    }

    // Meditation pages - Waves for calming effect
    if (pathname?.startsWith('/meditations')) {
      return {
        variant: 'waves',
        intensity: 'subtle',
        color: 'white',
      }
    }

    // Shop/Products - Luxury for premium feel
    if (pathname?.startsWith('/shop') || pathname?.startsWith('/products')) {
      return {
        variant: 'luxury',
        intensity: 'medium',
        color: 'gold',
      }
    }

    // About page - Minimal to focus on story
    if (pathname?.startsWith('/about')) {
      return {
        variant: 'minimal',
        intensity: 'subtle',
        color: 'gold',
      }
    }

    // Admin pages - Particles for tech/system feel
    if (pathname?.startsWith('/admin')) {
      return {
        variant: 'particles',
        intensity: 'subtle',
        color: 'white',
      }
    }

    // Gallery - Sacred geometry for artistic presentation
    if (pathname?.startsWith('/gallery')) {
      return {
        variant: 'sacred-geometry',
        intensity: 'subtle',
        color: 'gold',
      }
    }

    // Default fallback - Minimal luxury
    return {
      variant: 'minimal',
      intensity: 'subtle',
      color: 'gold',
    }
  }

  const config = getBackgroundConfig()

  return (
    <GeometricBackground
      variant={config.variant}
      intensity={config.intensity}
      color={config.color}
    />
  )
}

/**
 * BACKGROUND MAPPING REFERENCE
 *
 * / (Homepage)
 *   → luxury + subtle + gold
 *   → Hexagons, circles, geometric diamonds
 *   → Premium brand presence
 *
 * /blog/genesis/* & /gallery/genesis
 *   → sacred-geometry + subtle + gold
 *   → Vitruvian circles, golden ratio nodes
 *   → Mathematical perfection for personal stories
 *
 * /blog/*
 *   → particles + subtle + gold
 *   → Floating particles with connecting lines
 *   → Intellectual, dynamic content
 *
 * /writing/* (books, essays, poems)
 *   → smoke + subtle + gold
 *   → Ethereal, flowing gradients
 *   → Literary, reflective atmosphere
 *
 * /meditations/*
 *   → waves + subtle + white
 *   → Flowing sine waves
 *   → Calming, peaceful effect
 *
 * /shop/* & /products/*
 *   → luxury + medium + gold
 *   → Enhanced luxury feel for products
 *   → Higher intensity for premium positioning
 *
 * /about
 *   → minimal + subtle + gold
 *   → Simple gradient orbs
 *   → Focus stays on your story
 *
 * /admin/*
 *   → particles + subtle + white
 *   → Tech/system aesthetic
 *   → Functional, not distracting
 *
 * /gallery/*
 *   → sacred-geometry + subtle + gold
 *   → Artistic, harmonious presentation
 *
 * Default (everything else)
 *   → minimal + subtle + gold
 *   → Safe, elegant fallback
 */
