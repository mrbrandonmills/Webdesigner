/**
 * Lenis Global Type Declarations
 * Extends Window interface for GSAP integration
 */

import type Lenis from 'lenis'

declare global {
  interface Window {
    lenis?: Lenis
  }
}

export {}
