'use client'

import { Instagram } from 'lucide-react'
import { motion } from 'framer-motion'
import ScrollReveal from '@/components/scroll-reveal'

export default function AboutPage() {
  // Smooth stagger animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* SEXY BACKGROUND LAYERS - High-End Book Feel */}

      {/* Layer 1: Deep textured background with subtle paper grain */}
      <div
        className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='400' height='400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E")`,
          backgroundSize: '200px 200px',
        }}
      />

      {/* Layer 2: Elegant vignette gradient - frames the content like a book */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 100% 60% at 50% 40%, transparent 40%, rgba(0, 0, 0, 0.4) 80%, rgba(0, 0, 0, 0.8) 100%),
            linear-gradient(to bottom, rgba(0, 0, 0, 0.2) 0%, transparent 20%, transparent 80%, rgba(0, 0, 0, 0.3) 100%)
          `,
        }}
      />

      {/* Layer 3: Subtle gold accent glow - luxury touch */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] opacity-[0.08] blur-[120px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse, rgba(201, 160, 80, 0.3) 0%, transparent 70%)',
        }}
      />

      {/* Layer 4: Bottom accent - grounding the page */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] opacity-[0.05] blur-[100px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse, rgba(201, 160, 80, 0.4) 0%, transparent 60%)',
        }}
      />

      {/* Layer 5: Subtle book spine lines - editorial feel */}
      <div
        className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/5 to-transparent opacity-40 pointer-events-none"
        style={{ left: 'clamp(2rem, 5vw, 8rem)' }}
      />
      <div
        className="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/5 to-transparent opacity-40 pointer-events-none"
        style={{ right: 'clamp(2rem, 5vw, 8rem)' }}
      />

      {/* CONTENT - Now sits beautifully on top of backgrounds */}
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="pt-32 pb-20 container-wide">
          <motion.div
            className="max-w-4xl mx-auto text-center space-y-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h1
              variants={itemVariants}
              className="text-5xl md:text-7xl lg:text-8xl font-light font-serif leading-none"
            >
              Brandon Mills
            </motion.h1>
            <motion.div
              variants={itemVariants}
              className="luxury-divider"
            />
            <motion.p
              variants={itemVariants}
              className="text-xl md:text-2xl text-white/80 leading-relaxed font-light"
            >
              Model · Actor · Researcher · Creative
            </motion.p>
          </motion.div>
        </section>

        {/* Story Section */}
        <section className="pb-20 container-wide">
          <motion.div
            className="max-w-3xl mx-auto space-y-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <div className="space-y-6 text-lg text-white/70 leading-relaxed">
              <motion.p variants={itemVariants}>
                A model and actor exploring the expressive possibilities of the human form —
                where physical presence meets creative performance. My work spans high-fashion editorial,
                commercial campaigns, theatrical performance, and character-driven storytelling,
                all grounded in an understanding of embodiment and human experience.
              </motion.p>

              <motion.p variants={itemVariants}>
                Performance is my medium. Whether on camera, on stage, or in front of a lens,
                the body becomes a canvas for expression. My background in cognitive science
                informs this work — understanding how physicality shapes perception, emotion, and presence.
              </motion.p>

              <motion.p variants={itemVariants}>
                Also developing AI tools for creatives — automating the technical so artists can focus
                on what matters: the work itself. Because technology should amplify human creativity,
                not replace it.
              </motion.p>
            </div>
          </motion.div>
        </section>

        {/* Philosophy Section */}
        <section className="pb-20 container-wide">
          <motion.div
            className="max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="luxury-divider" />
            <blockquote className="text-2xl md:text-3xl font-light font-serif text-center text-white/90 leading-relaxed py-12">
              "The body is not separate from the mind —
              <br className="hidden md:block" />
              performance reveals this truth."
            </blockquote>
            <div className="luxury-divider" />
          </motion.div>
        </section>

        {/* Instagram Section */}
        <section className="pb-32 container-wide">
          <ScrollReveal direction="up">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <h2 className="text-3xl md:text-5xl font-light font-serif">Follow the Journey</h2>
              <p className="text-white/60 max-w-2xl mx-auto">
                Daily insights, behind-the-scenes moments, and ongoing projects
              </p>
              <a
                href="https://www.instagram.com/mrbrandonmills/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 bg-white/5 border border-white/20 hover:bg-white/10 hover:border-white/40 transition-all duration-300 group"
              >
                <Instagram size={24} className="group-hover:scale-110 transition-transform" />
                <span className="tracking-wider text-sm">@MRBRANDONMILLS</span>
              </a>
            </div>
          </ScrollReveal>
        </section>

        {/* Skills/Focus Areas */}
        <section className="pb-32 container-wide">
          <div className="max-w-3xl mx-auto">
            <ScrollReveal direction="up">
              <h2 className="text-3xl md:text-5xl font-light font-serif text-center mb-16">Areas of Interest</h2>
            </ScrollReveal>
            <div className="space-y-12">
              {[
                {
                  title: 'Fashion Modeling',
                  areas: ['Fashion Editorial', 'Commercial Campaigns', 'Brand Partnerships', 'Creative Direction'],
                },
                {
                  title: 'Acting & Performance',
                  areas: ['Character Work', 'Theatrical Performance', 'On-Camera Acting', 'Improvisation'],
                },
                {
                  title: 'Cognitive Research',
                  areas: ['Cognitive Science', 'Embodied Cognition', 'Performance Studies', 'Human Experience'],
                },
                {
                  title: 'AI Architecture',
                  areas: ['AI Development', 'Creative Automation', 'Content Systems', 'Digital Innovation'],
                },
                {
                  title: 'Writing & Education',
                  areas: ['Author', 'Academic Study', 'Creative Writing', 'Knowledge Sharing'],
                },
              ].map((category, index) => (
                <ScrollReveal key={category.title} direction="up" delay={index * 0.1}>
                  <div className="space-y-4 text-center">
                    <h3 className="text-xl font-serif text-accent-gold">{category.title}</h3>
                    <ul className="space-y-2 text-white/60">
                      {category.areas.map((area) => (
                        <li key={area} className="text-sm">{area}</li>
                      ))}
                    </ul>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
