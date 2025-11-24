'use client'

import { motion } from 'framer-motion'

export default function PhilosophySection() {
  return (
    <section className="py-section bg-onyx relative overflow-hidden">
      {/* Decorative background elements - luxury paper texture */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='400' height='400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E")`,
          backgroundSize: '200px 200px',
        }}
      />

      <div className="container-wide relative z-10 px-6 md:px-12 lg:px-24">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-5xl mx-auto text-center space-y-subsection"
        >
          {/* Ornamental line */}
          <div className="flex items-center justify-center gap-4">
            <div className="w-16 h-px bg-gradient-to-r from-transparent to-accent-gold" />
            <div className="w-2 h-2 rotate-45 bg-accent-gold" />
            <div className="w-16 h-px bg-gradient-to-l from-transparent to-accent-gold" />
          </div>

          {/* Quote - Luxury Typography */}
          <blockquote className="space-y-content">
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="text-h2 md:text-display-2 font-light font-serif text-pearl leading-tight italic px-4"
            >
              "The Renaissance understood that{' '}
              <span className="text-accent-gold">genius</span> emerges at the
              intersection of art, science, and human experience."
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="text-body-large md:text-h4 text-smoke font-light max-w-3xl mx-auto leading-relaxed px-4"
            >
              Today, I channel that spirit — blending modeling, authorship,
              engineering, and visual artistry into a singular expression of
              human potential.
            </motion.p>
          </blockquote>

          {/* Signature */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="pt-element"
          >
            <div className="text-accent-gold font-serif text-h4 tracking-wide">
              — Brandon Mills
            </div>
          </motion.div>

          {/* Ornamental line */}
          <div className="flex items-center justify-center gap-4 pt-8">
            <div className="w-16 h-px bg-gradient-to-r from-transparent to-accent-gold" />
            <div className="w-2 h-2 rotate-45 bg-accent-gold" />
            <div className="w-16 h-px bg-gradient-to-l from-transparent to-accent-gold" />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
