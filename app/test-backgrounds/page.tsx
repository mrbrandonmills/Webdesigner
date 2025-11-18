'use client'

import { useState } from 'react'
import GeometricBackground from '@/components/ui/geometric-background'

type Variant = 'luxury' | 'minimal' | 'smoke' | 'particles' | 'waves' | 'sacred-geometry' | 'vitruvian'
type Intensity = 'subtle' | 'medium' | 'bold'
type Color = 'gold' | 'white' | 'gradient'

/**
 * Background Variant Testing Page
 *
 * Internal tool for testing all geometric background variants.
 * Access at: http://localhost:3001/test-backgrounds
 */
export default function BackgroundTestPage() {
  const [variant, setVariant] = useState<Variant>('luxury')
  const [intensity, setIntensity] = useState<Intensity>('subtle')
  const [color, setColor] = useState<Color>('gold')

  const variants: Variant[] = ['luxury', 'minimal', 'smoke', 'particles', 'waves', 'sacred-geometry', 'vitruvian']
  const intensities: Intensity[] = ['subtle', 'medium', 'bold']
  const colors: Color[] = ['gold', 'white', 'gradient']

  const variantDescriptions = {
    luxury: 'Homepage - Hexagons, circles, rotating diamonds',
    minimal: 'About/Default - Simple gradient orbs',
    smoke: 'Writing - Ethereal blurred clouds',
    particles: 'Blog/Admin - Floating dots with connecting lines',
    waves: 'Meditations - Flowing sine waves',
    'sacred-geometry': 'Genesis/Gallery - Vitruvian circles & golden ratio',
    vitruvian: 'Same as sacred-geometry - Perfect mathematical harmony',
  }

  return (
    <div className="min-h-screen bg-black text-white relative">
      {/* Active Background */}
      <GeometricBackground variant={variant} intensity={intensity} color={color} />

      {/* Control Panel */}
      <div className="relative z-10 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Header */}
          <div className="text-center space-y-4 pb-8 border-b border-white/10">
            <h1 className="text-4xl md:text-5xl font-serif font-light">
              Geometric Background Testing
            </h1>
            <p className="text-white/60 max-w-2xl mx-auto">
              Test all background variants, intensities, and colors. GPU-accelerated with 60fps animations.
            </p>
          </div>

          {/* Current Selection Display */}
          <div className="bg-white/5 border border-white/10 p-8 space-y-4">
            <h2 className="text-2xl font-serif font-light">Current Configuration</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-white/40 block mb-1">Variant</span>
                <span className="text-accent-gold font-medium">{variant}</span>
              </div>
              <div>
                <span className="text-white/40 block mb-1">Intensity</span>
                <span className="text-accent-gold font-medium">{intensity}</span>
              </div>
              <div>
                <span className="text-white/40 block mb-1">Color</span>
                <span className="text-accent-gold font-medium">{color}</span>
              </div>
            </div>
            <p className="text-white/60 text-sm pt-4 border-t border-white/5">
              {variantDescriptions[variant]}
            </p>
          </div>

          {/* Variant Selector */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white/80">Select Variant</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {variants.map((v) => (
                <button
                  key={v}
                  onClick={() => setVariant(v)}
                  className={`
                    px-4 py-3 text-sm border transition-all
                    ${
                      variant === v
                        ? 'bg-accent-gold text-black border-accent-gold'
                        : 'bg-white/5 border-white/10 hover:border-white/30 text-white'
                    }
                  `}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          {/* Intensity Selector */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white/80">Select Intensity</h3>
            <div className="grid grid-cols-3 gap-3">
              {intensities.map((i) => (
                <button
                  key={i}
                  onClick={() => setIntensity(i)}
                  className={`
                    px-4 py-3 text-sm border transition-all
                    ${
                      intensity === i
                        ? 'bg-accent-gold text-black border-accent-gold'
                        : 'bg-white/5 border-white/10 hover:border-white/30 text-white'
                    }
                  `}
                >
                  {i}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-4 text-xs text-white/40">
              <div>Opacity: 0.03 base</div>
              <div>Opacity: 0.06 base</div>
              <div>Opacity: 0.12 base</div>
            </div>
          </div>

          {/* Color Selector */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white/80">Select Color</h3>
            <div className="grid grid-cols-3 gap-3">
              {colors.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`
                    px-4 py-3 text-sm border transition-all
                    ${
                      color === c
                        ? 'bg-accent-gold text-black border-accent-gold'
                        : 'bg-white/5 border-white/10 hover:border-white/30 text-white'
                    }
                  `}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Performance Info */}
          <div className="bg-white/5 border border-white/10 p-6 space-y-3">
            <h3 className="text-lg font-medium text-white/80">Performance Metrics</h3>
            <div className="space-y-2 text-sm text-white/60">
              <p>✅ GPU Acceleration: <code className="text-accent-gold">will-change-transform</code></p>
              <p>✅ Hardware Layer: <code className="text-accent-gold">translateZ(0)</code></p>
              <p>✅ Pointer Events: <code className="text-accent-gold">none</code> (no hit-testing)</p>
              <p>✅ Animation: <code className="text-accent-gold">60fps target</code></p>
              <p>✅ Positioning: <code className="text-accent-gold">fixed</code> (no scroll repaint)</p>
            </div>
          </div>

          {/* Path Mapping Reference */}
          <div className="bg-white/5 border border-white/10 p-6 space-y-4">
            <h3 className="text-lg font-medium text-white/80">Automatic Path Mapping</h3>
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-[1fr_2fr] gap-4 pb-2 border-b border-white/5">
                <span className="text-white/40">Path</span>
                <span className="text-white/40">Variant Applied</span>
              </div>
              <div className="grid grid-cols-[1fr_2fr] gap-4">
                <code className="text-accent-gold">/</code>
                <span className="text-white/60">luxury + subtle + gold</span>
              </div>
              <div className="grid grid-cols-[1fr_2fr] gap-4">
                <code className="text-accent-gold">/blog/genesis/*</code>
                <span className="text-white/60">sacred-geometry + subtle + gold</span>
              </div>
              <div className="grid grid-cols-[1fr_2fr] gap-4">
                <code className="text-accent-gold">/blog/*</code>
                <span className="text-white/60">particles + subtle + gold</span>
              </div>
              <div className="grid grid-cols-[1fr_2fr] gap-4">
                <code className="text-accent-gold">/writing/*</code>
                <span className="text-white/60">smoke + subtle + gold</span>
              </div>
              <div className="grid grid-cols-[1fr_2fr] gap-4">
                <code className="text-accent-gold">/meditations/*</code>
                <span className="text-white/60">waves + subtle + white</span>
              </div>
              <div className="grid grid-cols-[1fr_2fr] gap-4">
                <code className="text-accent-gold">/shop/*</code>
                <span className="text-white/60">luxury + medium + gold</span>
              </div>
              <div className="grid grid-cols-[1fr_2fr] gap-4">
                <code className="text-accent-gold">/gallery/*</code>
                <span className="text-white/60">sacred-geometry + subtle + gold</span>
              </div>
              <div className="grid grid-cols-[1fr_2fr] gap-4">
                <code className="text-accent-gold">/about</code>
                <span className="text-white/60">minimal + subtle + gold</span>
              </div>
              <div className="grid grid-cols-[1fr_2fr] gap-4">
                <code className="text-accent-gold">default</code>
                <span className="text-white/60">minimal + subtle + gold</span>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="text-center pt-8 space-y-4 text-sm text-white/40">
            <p>
              Use the controls above to test different combinations.
              Backgrounds automatically adapt based on page path in production.
            </p>
            <p>
              Open Chrome DevTools → Performance → Record to verify 60fps animations.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
