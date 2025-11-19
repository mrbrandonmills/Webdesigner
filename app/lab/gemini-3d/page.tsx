'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles,
  Play,
  Loader2,
  Box,
  Wand2,
  Gamepad2,
  Brain,
  Palette,
  Rocket,
  Book,
  Share2,
  Twitter,
  ExternalLink,
  ChevronRight,
  Zap,
  Crown,
  Gem,
  Eye,
  Layers,
  Copy,
  Check
} from 'lucide-react'
import Navigation from '@/components/navigation'

// Luxury Design System - Brandon Mills brand principles for Gemini 3
const luxuryDesignSystem = {
  systemPrompt: `You are a luxury visual designer with museum-quality aesthetics rivaling Louis Vuitton, Hermès, and Gucci. Apply these principles to all generations:

VISUAL LANGUAGE:
- Color: Primary black (#000000), accent gold (#C9A050), white for contrast
- Typography: Serif fonts for headings (elegant, timeless), sans-serif for body (clean, modern)
- Spacing: Generous white space, breathing room between elements
- Animations: Cinematic, smooth easing (cubic-bezier(0.22, 1, 0.36, 1)), subtle parallax

3D AESTHETICS:
- Materials: Brushed gold, matte black, frosted glass, soft leather textures
- Lighting: Dramatic rim lighting, soft ambient occlusion, golden hour warmth
- Particles: Sparse, intentional, gold/white dust motes
- Geometry: Sacred geometry, golden ratio proportions, Vitruvian principles

INTERACTION DESIGN:
- Hover states: Subtle elevation, soft glow, color shifts
- Transitions: 300-700ms, never jarring
- Feedback: Satisfying micro-animations, tactile feel
- Navigation: Intuitive, minimal, elegant

EMOTIONAL QUALITY:
- Evoke sophistication without pretension
- Balance power with refinement
- Create moments of discovery and delight
- Respect the viewer's intelligence`,

  principles: [
    {
      id: 'color',
      title: 'Color Palette',
      icon: Palette,
      description: 'Black foundation, gold accents, white contrast',
      tokens: '#000000, #C9A050, #FFFFFF, rgba(201, 160, 80, 0.2)'
    },
    {
      id: 'motion',
      title: 'Cinematic Motion',
      icon: Eye,
      description: 'Smooth easing, 300-700ms transitions, parallax depth',
      tokens: 'cubic-bezier(0.22, 1, 0.36, 1), spring physics'
    },
    {
      id: 'materials',
      title: '3D Materials',
      icon: Gem,
      description: 'Brushed gold, matte black, frosted glass',
      tokens: 'metallic roughness, ambient occlusion, rim lighting'
    },
    {
      id: 'geometry',
      title: 'Sacred Geometry',
      icon: Layers,
      description: 'Golden ratio, Vitruvian principles, intentional proportions',
      tokens: '1.618 ratio, concentric circles, fractal patterns'
    }
  ]
}

// Preset prompts for different experiences
const presetPrompts = [
  {
    id: 'spaceship',
    title: 'Spaceship Game',
    icon: Rocket,
    prompt: 'Create a 3D spaceship game where the player navigates through an asteroid field. Use Three.js with retro neon aesthetics.',
    category: 'Games'
  },
  {
    id: 'philosophy',
    title: 'Philosophy Visualizer',
    icon: Brain,
    prompt: 'Visualize the concept of quantum coherence in consciousness as an interactive 3D neural network with pulsing connections.',
    category: 'Philosophy'
  },
  {
    id: 'poetry',
    title: 'Poetry Voxel Art',
    icon: Palette,
    prompt: 'Generate a 3D voxel art sculpture representing the concept of "creative destruction" - beautiful chaos forming new order.',
    category: 'Art'
  },
  {
    id: 'meditation',
    title: 'Meditation Space',
    icon: Box,
    prompt: 'Create a serene 3D meditation environment with floating geometric shapes, soft particle effects, and calming animations.',
    category: 'Wellness'
  },
  {
    id: 'archetype',
    title: 'Archetype World',
    icon: Gamepad2,
    prompt: 'Build a 3D world representing the four Jungian archetypes - King (golden throne), Warrior (arena), Magician (library), Lover (garden).',
    category: 'Psychology'
  },
  {
    id: 'essay',
    title: 'Essay to 3D',
    icon: Book,
    prompt: 'Transform this philosophy essay into a 3D mind map: "The Self-Organizing Principle in Consciousness and Reality"',
    category: 'Research'
  }
]

// Demo gallery of generated experiences
const demoGallery = [
  {
    title: 'Quantum Coherence Simulator',
    description: 'Interactive visualization of quantum states in biological systems',
    image: '/images/demos/quantum-sim.png',
    type: 'Research'
  },
  {
    title: 'Stoic Philosophy Game',
    description: 'Navigate decisions through Marcus Aurelius\' teachings',
    image: '/images/demos/stoic-game.png',
    type: 'Game'
  },
  {
    title: 'Neural Poetry Sculpture',
    description: '3D voxel representation of creative expression',
    image: '/images/demos/poetry-voxel.png',
    type: 'Art'
  }
]

export default function Gemini3DLabPage() {
  const [prompt, setPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null)
  const [showDemo, setShowDemo] = useState(false)
  const [applyLuxuryStyle, setApplyLuxuryStyle] = useState(true)
  const [copiedSystem, setCopiedSystem] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleCopySystemPrompt = async () => {
    await navigator.clipboard.writeText(luxuryDesignSystem.systemPrompt)
    setCopiedSystem(true)
    setTimeout(() => setCopiedSystem(false), 2000)
  }

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [prompt])

  const handlePresetSelect = (preset: typeof presetPrompts[0]) => {
    setSelectedPreset(preset.id)
    setPrompt(preset.prompt)
  }

  const handleGenerate = async () => {
    if (!prompt.trim()) return

    setIsGenerating(true)
    // Build the full prompt with luxury design system if enabled
    const fullPrompt = applyLuxuryStyle
      ? `${luxuryDesignSystem.systemPrompt}\n\n---\n\nNow create:\n${prompt}`
      : prompt

    const encodedPrompt = encodeURIComponent(fullPrompt)
    window.open(`https://aistudio.google.com/app/prompts?prompt=${encodedPrompt}`, '_blank')

    setTimeout(() => setIsGenerating(false), 1500)
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <Navigation />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-accent-gold/5 via-transparent to-transparent" />
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-gold/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity, delay: 4 }}
        />

        <div className="max-w-5xl mx-auto relative z-10">
          {/* Launch Badge */}
          <motion.div
            className="flex items-center justify-center gap-2 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="px-4 py-2 bg-accent-gold/20 border border-accent-gold/40 text-accent-gold text-sm tracking-wider uppercase flex items-center gap-2">
              <Zap size={14} />
              Just Released - November 18, 2025
            </span>
          </motion.div>

          <motion.h1
            className="text-5xl md:text-7xl font-serif text-center mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Gemini 3
            <span className="text-accent-gold"> Interactive Lab</span>
          </motion.h1>

          <motion.p
            className="text-xl text-white/60 text-center max-w-3xl mx-auto mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Transform ideas into interactive 3D experiences with Google's revolutionary new AI.
            Generate games, visualizations, and immersive worlds from a single prompt.
          </motion.p>

          {/* Luxury Design System - Above Generator */}
          <motion.div
            className="bg-gradient-to-b from-accent-gold/10 to-transparent border border-accent-gold/30 p-6 mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Crown className="text-accent-gold" size={24} />
                <div>
                  <h3 className="text-lg font-serif">Luxury Design System</h3>
                  <p className="text-sm text-white/50">Museum-quality aesthetics injected into every prompt</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={handleCopySystemPrompt}
                  className="px-3 py-1.5 border border-white/20 hover:border-accent-gold/50 text-sm flex items-center gap-2 transition-colors"
                >
                  {copiedSystem ? (
                    <>
                      <Check size={14} className="text-green-400" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy size={14} />
                      Copy System
                    </>
                  )}
                </button>
                <label className="flex items-center gap-2 cursor-pointer">
                  <span className="text-sm text-white/60">Apply to prompts</span>
                  <div
                    onClick={() => setApplyLuxuryStyle(!applyLuxuryStyle)}
                    className={`w-12 h-6 rounded-full relative transition-colors ${
                      applyLuxuryStyle ? 'bg-accent-gold' : 'bg-white/20'
                    }`}
                  >
                    <div
                      className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                        applyLuxuryStyle ? 'translate-x-7' : 'translate-x-1'
                      }`}
                    />
                  </div>
                </label>
              </div>
            </div>

            {/* Design Principles Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {luxuryDesignSystem.principles.map((principle) => {
                const Icon = principle.icon
                return (
                  <div
                    key={principle.id}
                    className="bg-black/30 border border-white/10 p-3 hover:border-accent-gold/30 transition-colors"
                  >
                    <Icon className="text-accent-gold mb-2" size={16} />
                    <h4 className="text-sm font-medium mb-1">{principle.title}</h4>
                    <p className="text-xs text-white/40">{principle.description}</p>
                  </div>
                )
              })}
            </div>

            {applyLuxuryStyle && (
              <p className="text-xs text-accent-gold/70 mt-4 text-center">
                All prompts will include black/gold palette, cinematic motion, brushed gold materials, and sacred geometry
              </p>
            )}
          </motion.div>

          {/* Main Input Area */}
          <motion.div
            className="bg-white/5 border border-white/10 p-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="space-y-6">
              {/* Prompt Input */}
              <div>
                <label className="text-sm text-white/40 uppercase tracking-wider mb-3 block">
                  Your Vision
                </label>
                <textarea
                  ref={textareaRef}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe the 3D experience you want to create..."
                  className="w-full bg-black/50 border border-white/20 p-4 text-lg placeholder:text-white/30 focus:border-accent-gold focus:outline-none transition-colors resize-none min-h-[120px]"
                  rows={3}
                />
              </div>

              {/* Preset Buttons */}
              <div>
                <label className="text-sm text-white/40 uppercase tracking-wider mb-3 block">
                  Quick Presets
                </label>
                <div className="flex flex-wrap gap-2">
                  {presetPrompts.map((preset) => {
                    const Icon = preset.icon
                    return (
                      <button
                        key={preset.id}
                        onClick={() => handlePresetSelect(preset)}
                        className={`px-4 py-2 border text-sm flex items-center gap-2 transition-all ${
                          selectedPreset === preset.id
                            ? 'bg-accent-gold text-black border-accent-gold'
                            : 'border-white/20 hover:border-accent-gold/50 hover:bg-white/5'
                        }`}
                      >
                        <Icon size={14} />
                        {preset.title}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Generate Button */}
              <motion.button
                onClick={handleGenerate}
                disabled={!prompt.trim() || isGenerating}
                className="w-full py-4 bg-accent-gold text-black font-medium text-lg tracking-wider uppercase hover:bg-accent-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Opening AI Studio...
                  </>
                ) : (
                  <>
                    <Sparkles size={20} />
                    Generate with Gemini 3
                  </>
                )}
              </motion.button>

              <p className="text-center text-sm text-white/40">
                Opens Google AI Studio with your prompt. Free to use with rate limits.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Capabilities Section */}
      <section className="py-20 px-6 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            className="text-3xl md:text-4xl font-serif text-center mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            What Gemini 3 Can Create
          </motion.h2>

          <motion.p
            className="text-white/60 text-center max-w-2xl mx-auto mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Revolutionary single-prompt generation powered by Google's most advanced AI model
          </motion.p>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Gamepad2,
                title: '3D Games',
                description: 'Complete playable games with physics, controls, and immersive graphics from one prompt',
                examples: ['Tank battles', 'Space shooters', 'Puzzle games']
              },
              {
                icon: Box,
                title: 'Voxel Art',
                description: 'Three.js powered 3D sculptures and environments with custom shaders',
                examples: ['Abstract art', 'Landscapes', 'Character models']
              },
              {
                icon: Wand2,
                title: 'Generative UI',
                description: 'Complete web applications, tools, and interactive experiences on-the-fly',
                examples: ['Data visualizers', 'Calculators', 'Interactive stories']
              }
            ].map((capability, index) => {
              const Icon = capability.icon
              return (
                <motion.div
                  key={capability.title}
                  className="bg-white/5 border border-white/10 p-8"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Icon className="text-accent-gold mb-4" size={32} />
                  <h3 className="text-xl font-serif mb-3">{capability.title}</h3>
                  <p className="text-white/60 mb-4">{capability.description}</p>
                  <ul className="space-y-2">
                    {capability.examples.map((example) => (
                      <li key={example} className="text-sm text-white/40 flex items-center gap-2">
                        <ChevronRight size={12} className="text-accent-gold" />
                        {example}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Use Cases for Brandon Mills */}
      <section className="py-20 px-6 bg-gradient-to-b from-transparent via-accent-gold/5 to-transparent">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            className="text-3xl md:text-4xl font-serif text-center mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            How I'm Using Gemini 3
          </motion.h2>

          <motion.p
            className="text-white/60 text-center max-w-2xl mx-auto mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Transforming philosophy, research, and creativity into interactive experiences
          </motion.p>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: 'Philosophy 3D Lab',
                description: 'Turning complex philosophical concepts into interactive 3D visualizations that make abstract ideas tangible.',
                status: 'Coming Soon',
                icon: Brain
              },
              {
                title: 'Quantum Coherence Simulator',
                description: 'Visual simulation of quantum states in biological consciousness based on my research papers.',
                status: 'In Development',
                icon: Sparkles
              },
              {
                title: 'Archetype Worlds',
                description: '3D environments for each Jungian archetype - explore your quiz results in immersive spaces.',
                status: 'Coming Soon',
                icon: Gamepad2
              },
              {
                title: 'Poetry Sculptures',
                description: 'Generative 3D art created from poem themes, emotions, and imagery using voxel rendering.',
                status: 'Experimental',
                icon: Palette
              }
            ].map((useCase, index) => {
              const Icon = useCase.icon
              return (
                <motion.div
                  key={useCase.title}
                  className="bg-white/5 border border-white/10 p-8 hover:border-accent-gold/30 transition-colors"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <Icon className="text-accent-gold" size={28} />
                    <span className="px-3 py-1 bg-white/10 text-white/60 text-xs uppercase tracking-wider">
                      {useCase.status}
                    </span>
                  </div>
                  <h3 className="text-xl font-serif mb-3">{useCase.title}</h3>
                  <p className="text-white/60">{useCase.description}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* API & Pricing */}
      <section className="py-20 px-6 border-t border-white/10">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            className="text-3xl md:text-4xl font-serif text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Gemini 3 API Access
          </motion.h2>

          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              className="bg-white/5 border border-white/10 p-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="text-xl font-serif mb-4">Free Tier</h3>
              <p className="text-4xl font-light text-accent-gold mb-4">$0</p>
              <p className="text-white/60 mb-6">Google AI Studio with rate limits</p>
              <ul className="space-y-3">
                <li className="text-sm text-white/60 flex items-center gap-2">
                  <ChevronRight size={12} className="text-accent-gold" />
                  15 requests per minute
                </li>
                <li className="text-sm text-white/60 flex items-center gap-2">
                  <ChevronRight size={12} className="text-accent-gold" />
                  1,500 requests per day
                </li>
                <li className="text-sm text-white/60 flex items-center gap-2">
                  <ChevronRight size={12} className="text-accent-gold" />
                  Full model capabilities
                </li>
              </ul>
            </motion.div>

            <motion.div
              className="bg-white/5 border border-accent-gold/30 p-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <h3 className="text-xl font-serif mb-4">Pay-as-you-go</h3>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-4xl font-light text-accent-gold">$2</span>
                <span className="text-white/60">/million input tokens</span>
              </div>
              <p className="text-white/60 mb-6">$12/million output tokens</p>
              <ul className="space-y-3">
                <li className="text-sm text-white/60 flex items-center gap-2">
                  <ChevronRight size={12} className="text-accent-gold" />
                  Unlimited requests
                </li>
                <li className="text-sm text-white/60 flex items-center gap-2">
                  <ChevronRight size={12} className="text-accent-gold" />
                  Priority processing
                </li>
                <li className="text-sm text-white/60 flex items-center gap-2">
                  <ChevronRight size={12} className="text-accent-gold" />
                  Available in Vertex AI
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 border-t border-white/10">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h2
            className="text-3xl md:text-4xl font-serif mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Start Creating
          </motion.h2>

          <motion.p
            className="text-white/60 mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Open Google AI Studio and start generating 3D experiences today.
            No coding required - just describe what you want to create.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <a
              href="https://aistudio.google.com/app/apps"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-accent-gold text-black font-medium tracking-wider uppercase hover:bg-accent-hover transition-colors flex items-center justify-center gap-2"
            >
              <ExternalLink size={18} />
              Open AI Studio
            </a>
            <a
              href="https://twitter.com/intent/tweet?text=Just%20discovered%20Gemini%203%20Interactive%20Lab%20-%20generate%203D%20games%20and%20experiences%20from%20a%20single%20prompt!&url=https://brandonmills.com/lab/gemini-3d"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 border border-white/20 hover:border-accent-gold/50 transition-colors flex items-center justify-center gap-2"
            >
              <Twitter size={18} />
              Share on Twitter
            </a>
          </motion.div>
        </div>
      </section>

      {/* Footer Attribution */}
      <footer className="py-8 px-6 border-t border-white/10 text-center">
        <p className="text-sm text-white/40">
          Gemini 3 is a product of Google. This page showcases its capabilities for creative and research applications.
        </p>
      </footer>
    </main>
  )
}
