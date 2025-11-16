'use client'

import { motion } from 'framer-motion'

export default function PhilosophySection() {
  return (
    <section className="py-40 bg-black relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h60v60H0z' fill='none'/%3E%3Cpath d='M30 0v60M0 30h60' stroke='%23c9a050' stroke-width='0.5' opacity='0.3'/%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px',
        }}
      />

      <div className="container-wide relative z-10">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2 }}
          className="max-w-5xl mx-auto text-center space-y-12"
        >
          {/* Ornamental line */}
          <div className="flex items-center justify-center gap-4">
            <div className="w-16 h-px bg-gradient-to-r from-transparent to-accent-gold" />
            <div className="w-2 h-2 rotate-45 bg-accent-gold" />
            <div className="w-16 h-px bg-gradient-to-l from-transparent to-accent-gold" />
          </div>

          {/* Quote */}
          <blockquote className="space-y-8">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-3xl md:text-5xl lg:text-6xl font-light font-serif text-white/95 leading-relaxed italic"
            >
              "The Renaissance understood that{' '}
              <span className="text-accent-gold">genius</span> emerges at the
              intersection of art, science, and human experience."
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl md:text-2xl text-white/70 font-light max-w-3xl mx-auto"
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
            transition={{ duration: 0.8, delay: 0.6 }}
            className="pt-8"
          >
            <div className="text-accent-gold font-serif text-2xl tracking-wider">
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
