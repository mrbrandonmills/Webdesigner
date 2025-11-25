/**
 * GSAP Configuration for Award-Winning 3D Journey
 * Based on research from kasane-keyboard.com and themonolithproject.net
 */

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

/**
 * Custom easing curves for luxury aesthetic
 * Researched from award-winning sites
 */
export const customEases = {
  luxury: 'power3.inOut',      // Smooth, sophisticated
  cinematic: 'expo.out',        // Dramatic, film-like
  smooth: 'power2.out',         // Natural deceleration
  elastic: 'elastic.out(1, 0.5)' // Subtle bounce
} as const

/**
 * Global GSAP defaults
 * Sets baseline for all animations
 */
gsap.defaults({
  ease: customEases.luxury,
  duration: 1
})

/**
 * ScrollTrigger configuration for 3D journey
 * KEY PATTERN from research: scrub: true is the industry standard
 */
export const scrollTriggerDefaults = {
  scrub: 1,                     // 1-second smooth delay
  pin: true,                    // Pin canvas during scroll
  anticipatePin: 1,             // Smooth pin animation
  invalidateOnRefresh: true     // Recalculate on resize
}

/**
 * Refresh ScrollTrigger
 * Call after DOM changes or window resize
 */
export function refreshScrollTrigger() {
  if (typeof window !== 'undefined') {
    ScrollTrigger.refresh()
  }
}

/**
 * Kill all ScrollTriggers
 * Use for cleanup
 */
export function killAllScrollTriggers() {
  if (typeof window !== 'undefined') {
    ScrollTrigger.getAll().forEach(trigger => trigger.kill())
  }
}

export { gsap, ScrollTrigger }
