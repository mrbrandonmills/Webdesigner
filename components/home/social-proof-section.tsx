'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Moon, Compass, Brain } from 'lucide-react'
import { ResultsCounter, StatsGrid } from '@/components/social-proof/results-counter'
import { TestimonialCarousel } from '@/components/social-proof/testimonials'

export default function SocialProofSection() {
  const tools = [
    {
      name: 'Dream Decoder',
      description: 'Unlock hidden meanings in your dreams',
      icon: Moon,
      href: '/dreams',
      color: 'purple'
    },
    {
      name: 'Life Path Oracle',
      description: 'Discover your dominant archetype',
      icon: Compass,
      href: '/oracle',
      color: 'gold'
    },
    {
      name: 'Mind Visualizer',
      description: 'Transform thoughts into 3D networks',
      icon: Brain,
      href: '/visualize',
      color: 'blue'
    }
  ]

  return (
    <section className="py-24 bg-black relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, #c9a050 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }}
      />

      <div className="container-wide relative z-10">
        {/* Results Counter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-24"
        >
          <ResultsCounter
            target={10000}
            label="people who've explored their inner world"
          />
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-24"
        >
          <StatsGrid />
        </motion.div>

        {/* Tools CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mb-24"
        >
          <h2 className="font-serif text-3xl md:text-4xl text-center mb-12">
            Explore Your Mind
          </h2>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {tools.map((tool) => (
              <Link
                key={tool.name}
                href={tool.href}
                className="group p-6 bg-white/5 border border-white/10 rounded-xl hover:border-[#C9A050]/50 transition-all"
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-4 ${
                  tool.color === 'purple' ? 'bg-purple-500/20' :
                  tool.color === 'gold' ? 'bg-[#C9A050]/20' :
                  'bg-blue-500/20'
                }`}>
                  <tool.icon className={`w-6 h-6 ${
                    tool.color === 'purple' ? 'text-purple-500' :
                    tool.color === 'gold' ? 'text-[#C9A050]' :
                    'text-blue-500'
                  }`} />
                </div>
                <h3 className="font-medium text-white mb-2">{tool.name}</h3>
                <p className="text-sm text-gray-400 mb-4">{tool.description}</p>
                <span className="inline-flex items-center gap-1 text-sm text-[#C9A050] group-hover:gap-2 transition-all">
                  Try Now <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Testimonials */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <h2 className="font-serif text-3xl md:text-4xl text-center mb-12">
            What People Are Saying
          </h2>
          <div className="max-w-3xl mx-auto">
            <TestimonialCarousel />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
