import type { Metadata } from 'next'
import Link from 'next/link'
import { WebGLHero } from '@/components/software/webgl-hero'
import { AnimatedText } from '@/components/software/animated-text'
import { ProcessSteps } from '@/components/software/process-steps'
import { TechStackCarousel } from '@/components/software/tech-stack-carousel'

export const metadata: Metadata = {
  title: 'Computational Luxury - Software Development | Brandon Mills',
  description: 'Premium web development and digital experiences. Next.js, React, TypeScript, and modern web technologies crafted with precision.',
}

export default function ComputationalLuxuryPage() {
  return (
    <main className="min-h-screen bg-black text-white overflow-hidden">
      {/* Hero Section with WebGL Background */}
      <section className="relative min-h-screen flex items-center justify-center">
        <WebGLHero />

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center space-y-12">
          <div className="space-y-6">
            <h1 className="font-serif text-6xl md:text-7xl lg:text-8xl font-light leading-tight">
              <AnimatedText text="Computational Luxury" />
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto font-light">
              Where engineering precision meets artistic expression.
              Crafting digital experiences that perform as beautifully as they look.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link
              href="/contact"
              className="group px-12 py-4 bg-orange-500 text-black font-medium uppercase tracking-wider hover:bg-orange-400 transition-all duration-300 relative overflow-hidden"
            >
              <span className="relative z-10">Start a Project</span>
              <div className="absolute inset-0 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
            </Link>
            <Link
              href="#process"
              className="px-12 py-4 border border-white/30 text-white font-medium uppercase tracking-wider hover:border-orange-500 hover:text-orange-500 transition-all duration-300"
            >
              See Process
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 animate-bounce">
          <span className="text-xs text-gray-500 uppercase tracking-widest">Scroll</span>
          <div className="w-px h-16 bg-gradient-to-b from-orange-500 to-transparent" />
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-32 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h2 className="font-serif text-5xl font-light leading-tight">
              Code as Craft
            </h2>
            <div className="space-y-6 text-lg text-gray-400 leading-relaxed">
              <p>
                Every line of code is written with intention. Every component architected
                for performance. Every interaction designed for delight.
              </p>
              <p>
                We don't just build websites—we engineer experiences that load in milliseconds,
                animate at 60fps, and scale effortlessly from startup to enterprise.
              </p>
            </div>
          </div>

          <div className="bg-zinc-900/30 backdrop-blur-sm border border-white/10 p-12 space-y-6">
            <h3 className="font-mono text-orange-500 text-sm uppercase tracking-wider">
              Core Principles
            </h3>
            <ul className="space-y-4 text-gray-300">
              <li className="flex items-start gap-3">
                <span className="text-orange-500 font-mono">→</span>
                <span>Performance-first architecture (Lighthouse 95+)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-orange-500 font-mono">→</span>
                <span>Pixel-perfect responsive design</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-orange-500 font-mono">→</span>
                <span>Accessibility as standard (WCAG AA)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-orange-500 font-mono">→</span>
                <span>Type-safe, maintainable codebase</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-orange-500 font-mono">→</span>
                <span>SEO-optimized from day one</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Process Steps Section */}
      <section id="process" className="py-32 bg-zinc-950/50">
        <div className="max-w-7xl mx-auto px-6 mb-24">
          <h2 className="font-serif text-5xl md:text-6xl font-light text-center mb-8">
            Our Process
          </h2>
          <p className="text-xl text-gray-400 text-center max-w-3xl mx-auto">
            A systematic approach to building exceptional digital products.
            From concept to launch, every step optimized for success.
          </p>
        </div>

        <ProcessSteps />
      </section>

      {/* Technology Stack Carousel */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-6 mb-16 text-center">
          <h2 className="font-serif text-5xl font-light mb-6">
            Modern Technology Stack
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Leveraging cutting-edge frameworks and tools to deliver
            world-class digital experiences.
          </p>
        </div>

        <TechStackCarousel />
      </section>

      {/* Code Showcase Section */}
      <section className="py-32 bg-zinc-950/50">
        <div className="max-w-5xl mx-auto px-6 space-y-16">
          <div className="text-center space-y-6">
            <h2 className="font-serif text-5xl font-light">
              Production-Ready Code
            </h2>
            <p className="text-xl text-gray-400">
              Clean, documented, and maintainable. Built to last.
            </p>
          </div>

          <div className="bg-zinc-900/50 backdrop-blur-sm border border-white/10 p-8 overflow-x-auto">
            <pre className="text-sm text-gray-300 font-mono leading-relaxed">
              <code>{`// Next.js 14 App Router with TypeScript
import type { Metadata } from 'next'
import { motion } from 'framer-motion'

export const metadata: Metadata = {
  title: 'Luxury E-Commerce Platform',
  description: 'Museum-quality product presentation',
}

export default async function ProductPage({ params }) {
  const product = await getProduct(params.slug)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <ProductDetail product={product} />
    </motion.div>
  )
}

// Performance: 100ms TTFB, 95+ Lighthouse score
// Accessibility: WCAG AA compliant, keyboard navigable
// SEO: Structured data, Open Graph, Twitter Cards`}</code>
            </pre>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-12">
          <h2 className="font-serif text-5xl md:text-6xl font-light leading-tight">
            Let's Build Something Exceptional
          </h2>
          <p className="text-xl text-gray-400 leading-relaxed">
            Whether you're launching a new product or scaling an existing platform,
            we'll engineer a solution that exceeds expectations.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link
              href="/contact"
              className="px-12 py-4 bg-orange-500 text-black font-medium uppercase tracking-wider hover:bg-orange-400 transition-all duration-300"
            >
              Start Your Project
            </Link>
            <Link
              href="/work"
              className="px-12 py-4 border border-white/30 text-white font-medium uppercase tracking-wider hover:border-orange-500 hover:text-orange-500 transition-all duration-300"
            >
              View Portfolio
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
