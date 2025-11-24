/**
 * GSAP Configuration - Industry Standard Setup
 *
 * Based on award-winning site patterns (kasane-keyboard.com, library.obys.agency)
 * Registers ScrollTrigger plugin and sets global defaults
 */

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Client-side only initialization
if (typeof window !== 'undefined') {
  // Register ScrollTrigger plugin
  gsap.registerPlugin(ScrollTrigger)

  // Global GSAP defaults for consistent animations
  gsap.defaults({
    ease: 'power2.inOut',
    duration: 1,
  })

  // ScrollTrigger defaults
  ScrollTrigger.defaults({
    toggleActions: 'play none none reverse',
    scroller: typeof window !== 'undefined' ? window : undefined,
  })

  // Refresh ScrollTrigger on window resize with debounce
  let resizeTimer: ReturnType<typeof setTimeout>
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer)
    resizeTimer = setTimeout(() => {
      ScrollTrigger.refresh()
    }, 250)
  })
}

/**
 * Custom easing curves used by award-winning sites
 */
export const customEases = {
  // Smooth entrance - speed up
  smoothIn: 'power3.in',

  // Smooth exit - slow down
  smoothOut: 'power3.out',

  // Smooth both ways
  smoothInOut: 'power3.inOut',

  // Cinematic camera movements
  cinematic: 'expo.out',

  // Elastic bounce (use sparingly)
  elastic: 'elastic.out(1, 0.5)',
}

export { gsap, ScrollTrigger }
