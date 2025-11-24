import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    // Mobile-first responsive breakpoints
    screens: {
      'xs': '375px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        // Kasané Luxury Palette
        'accent-gold': '#D4AF37',
        'accent-hover': '#C9A050',
        'pearl': '#FAFAF9',
        'porcelain': '#F5F5F4',
        'smoke': '#E7E5E4',
        'graphite': '#78716C',
        'charcoal': '#292524',
        'onyx': '#0C0A09',
        'bronze': '#CD7F32',
        'sage': '#8A9A5B',
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        // Luxury typographic scale (1.250 ratio - major third)
        'display-1': ['4.768rem', { lineHeight: '1.1', letterSpacing: '0.08em' }], // 76.29px
        'display-2': ['3.815rem', { lineHeight: '1.1', letterSpacing: '0.08em' }], // 61.04px
        'h1': ['3.052rem', { lineHeight: '1.25', letterSpacing: '0.04em' }], // 48.83px
        'h2': ['2.441rem', { lineHeight: '1.25', letterSpacing: '0.04em' }], // 39.06px
        'h3': ['1.953rem', { lineHeight: '1.25', letterSpacing: '0.04em' }], // 31.25px
        'h4': ['1.563rem', { lineHeight: '1.5', letterSpacing: '0.02em' }], // 25px
        'body-large': ['1.250rem', { lineHeight: '1.75', letterSpacing: '0.01em' }], // 20px
        'body': ['1rem', { lineHeight: '1.75', letterSpacing: '0.01em' }], // 16px
        'small': ['0.800rem', { lineHeight: '1.5', letterSpacing: '0.12em' }], // 12.8px
        // Mobile-optimized font sizes (keep existing for backward compatibility)
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1.16' }],
        '6xl': ['3.75rem', { lineHeight: '1.16' }],
        '7xl': ['4.5rem', { lineHeight: '1.16' }],
        '8xl': ['6rem', { lineHeight: '1.16' }],
        '9xl': ['8rem', { lineHeight: '1.16' }],
      },
      spacing: {
        // Luxury spacing system
        'section': '120px',
        'subsection': '80px',
        'content': '48px',
        'element': '24px',
        'micro': '12px',
        // Touch-friendly spacing
        'touch': '44px',
        'touch-lg': '48px',
      },
      animation: {
        'fade-in': 'fadeIn 1.2s cubic-bezier(0.22, 1, 0.36, 1)',
        'slide-up': 'slideUp 0.8s cubic-bezier(0.22, 1, 0.36, 1)',
        'scale-in': 'scaleIn 1s cubic-bezier(0.22, 1, 0.36, 1)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      transitionTimingFunction: {
        'luxury': 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}

export default config
