/**
 * Design Tokens
 * Museum-quality luxury design system
 * Inspired by Louis Vuitton, Hermès, Gucci, and Apple
 */

export const designTokens = {
  // Color Palette
  colors: {
    black: '#000000',
    white: '#FFFFFF',
    gold: {
      DEFAULT: '#C9A050',
      light: '#D4AF37',
      dark: '#B89040',
      muted: 'rgba(201, 160, 80, 0.6)',
    },
    gray: {
      50: 'rgba(255, 255, 255, 0.05)',
      100: 'rgba(255, 255, 255, 0.10)',
      200: 'rgba(255, 255, 255, 0.20)',
      300: 'rgba(255, 255, 255, 0.30)',
      400: 'rgba(255, 255, 255, 0.40)',
      500: 'rgba(255, 255, 255, 0.50)',
      600: 'rgba(255, 255, 255, 0.60)',
      700: 'rgba(255, 255, 255, 0.70)',
      800: 'rgba(255, 255, 255, 0.80)',
      900: 'rgba(255, 255, 255, 0.90)',
    },
  },

  // Typography
  typography: {
    fontFamily: {
      serif: ['Playfair Display', 'Cormorant Garamond', 'Georgia', 'serif'],
      sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
    },
    scale: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      base: '1rem',     // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',  // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem', // 36px
      '5xl': '3rem',    // 48px
      '6xl': '3.75rem', // 60px
      '7xl': '4.5rem',  // 72px
      '8xl': '6rem',    // 96px
      '9xl': '8rem',    // 128px
    },
    lineHeight: {
      none: '1',
      tight: '1.1',
      snug: '1.2',
      normal: '1.5',
      relaxed: '1.75',
      loose: '2',
    },
    letterSpacing: {
      tighter: '-0.05em',
      tight: '-0.025em',
      normal: '0',
      wide: '0.025em',
      wider: '0.05em',
      widest: '0.1em',
      luxury: '0.2em',  // For uppercase luxury text
      ultra: '0.3em',   // For extra luxury uppercase
    },
    fontWeight: {
      thin: '100',
      extralight: '200',
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
  },

  // Spacing System
  spacing: {
    xs: '0.25rem',   // 4px
    sm: '0.5rem',    // 8px
    md: '1rem',      // 16px
    lg: '1.5rem',    // 24px
    xl: '2rem',      // 32px
    '2xl': '3rem',   // 48px
    '3xl': '4rem',   // 64px
    '4xl': '6rem',   // 96px
    '5xl': '8rem',   // 128px
    '6xl': '12rem',  // 192px
    '7xl': '16rem',  // 256px
  },

  // Animation Timing
  animation: {
    duration: {
      instant: 100,
      fast: 200,
      normal: 400,
      slow: 600,
      slower: 800,
      slowest: 1000,
    },
    easing: {
      // Luxury easing curve - smooth and elegant
      luxury: 'cubic-bezier(0.22, 1, 0.36, 1)',
      // Apple-style easing
      apple: 'cubic-bezier(0.16, 1, 0.3, 1)',
      // Bouncy spring effect
      spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      // Sharp and precise
      sharp: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
      // Smooth deceleration
      decel: 'cubic-bezier(0.0, 0.0, 0.2, 1)',
    },
  },

  // Border Radius
  borderRadius: {
    none: '0',
    sm: '0.25rem',   // 4px
    md: '0.5rem',    // 8px
    lg: '0.75rem',   // 12px
    xl: '1rem',      // 16px
    '2xl': '1.5rem', // 24px
    '3xl': '2rem',   // 32px
    full: '9999px',
  },

  // Shadows
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    gold: {
      sm: '0 2px 8px rgba(201, 160, 80, 0.15)',
      md: '0 8px 16px rgba(201, 160, 80, 0.2)',
      lg: '0 16px 32px rgba(201, 160, 80, 0.25)',
      xl: '0 24px 48px rgba(201, 160, 80, 0.3)',
    },
  },

  // Blur Effects
  blur: {
    none: '0',
    sm: '4px',
    md: '8px',
    lg: '16px',
    xl: '24px',
    '2xl': '40px',
    '3xl': '64px',
  },

  // Breakpoints
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },

  // Z-Index Layers
  zIndex: {
    hide: -1,
    base: 0,
    dropdown: 10,
    sticky: 20,
    overlay: 30,
    modal: 40,
    popover: 50,
    toast: 60,
    tooltip: 70,
    cursor: 9999,
  },

  // Gradients
  gradients: {
    gold: 'linear-gradient(135deg, #D4AF37 0%, #C9A050 50%, #B89040 100%)',
    goldRadial: 'radial-gradient(circle, rgba(201, 160, 80, 0.3) 0%, transparent 70%)',
    goldShine: 'linear-gradient(to right, transparent, rgba(255, 255, 255, 0.3), transparent)',
    blackFade: 'linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.7) 100%)',
    blackFadeTop: 'linear-gradient(to top, transparent 0%, rgba(0, 0, 0, 0.7) 100%)',
    noise: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
  },
} as const

// Framer Motion Variants
export const motionVariants = {
  // Fade in from bottom
  fadeInUp: {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -40 },
  },

  // Fade in from top
  fadeInDown: {
    initial: { opacity: 0, y: -40 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 40 },
  },

  // Fade in from left
  fadeInLeft: {
    initial: { opacity: 0, x: -40 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 40 },
  },

  // Fade in from right
  fadeInRight: {
    initial: { opacity: 0, x: 40 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -40 },
  },

  // Scale in
  scaleIn: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
  },

  // Stagger children
  staggerContainer: {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  },

  // Card hover
  cardHover: {
    rest: {
      scale: 1,
      y: 0,
    },
    hover: {
      scale: 1.02,
      y: -8,
      transition: {
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  },

  // Image zoom on hover
  imageZoom: {
    rest: {
      scale: 1,
    },
    hover: {
      scale: 1.1,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  },

  // Magnetic effect
  magnetic: {
    rest: {
      x: 0,
      y: 0,
    },
    hover: (custom: { x: number; y: number }) => ({
      x: custom.x * 0.3,
      y: custom.y * 0.3,
      transition: {
        duration: 0.3,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
  },
}

// Animation presets for common use cases
export const animationPresets = {
  // Fast interactions (hover, clicks)
  fast: {
    duration: 0.2,
    ease: designTokens.animation.easing.luxury,
  },

  // Normal transitions (page elements)
  normal: {
    duration: 0.4,
    ease: designTokens.animation.easing.luxury,
  },

  // Slow, dramatic reveals
  slow: {
    duration: 0.8,
    ease: designTokens.animation.easing.luxury,
  },

  // Hero section animations
  hero: {
    duration: 1,
    ease: designTokens.animation.easing.luxury,
  },

  // Spring physics for bouncy effects
  spring: {
    type: 'spring',
    stiffness: 700,
    damping: 25,
  },

  // Smooth spring
  smoothSpring: {
    type: 'spring',
    stiffness: 400,
    damping: 30,
  },
}

// Export individual tokens for convenience
export const { colors, typography, spacing, animation, borderRadius, shadows, blur, breakpoints, zIndex, gradients } = designTokens

export default designTokens
