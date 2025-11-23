'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useState, useRef } from 'react'
import {
  BookOpen,
  Users,
  Sparkles,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  MessageSquare,
  DollarSign,
  Award,
  Mic,
  Brain,
  BookOpenCheck
} from 'lucide-react'

export default function CollaborationLanding() {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })

  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.8])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))

    setSubmitted(true)
    setIsSubmitting(false)
    setEmail('')
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-20">
          <motion.div
            className="absolute top-20 left-20 w-96 h-96 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(212,175,55,0.3) 0%, transparent 70%)',
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: [0.22, 1, 0.36, 1],
            }}
          />
          <motion.div
            className="absolute bottom-40 right-20 w-80 h-80 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(212,175,55,0.2) 0%, transparent 70%)',
            }}
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: [0.22, 1, 0.36, 1],
            }}
          />
        </div>

        {/* Grid Pattern Overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h60v60H0z' fill='none'/%3E%3Cpath d='M30 0v60M0 30h60' stroke='%23c9a050' stroke-width='0.5' opacity='0.3'/%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px',
          }}
        />

        <motion.div
          style={{ opacity, scale }}
          className="container-wide relative z-10 text-center space-y-12 px-6"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-flex items-center gap-2 glass-badge px-6 py-3 rounded-full"
          >
            <Sparkles className="w-5 h-5 text-accent-gold" />
            <span className="text-sm tracking-wider uppercase text-accent-gold font-medium">
              Revolutionary Collaborative Writing
            </span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-5xl xs:text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-light font-serif leading-none text-white"
          >
            <span className="block mb-4">US</span>
            <span className="block text-3xl xs:text-4xl sm:text-5xl md:text-6xl text-white/80">
              Works from the
            </span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-accent-gold via-yellow-200 to-accent-gold text-shimmer mt-2">
              Collective Consciousness
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-light text-white/90 max-w-4xl mx-auto leading-relaxed"
          >
            Revolutionary collaborative storytelling powered by AI.
            <br />
            <span className="text-accent-gold">Your voice. Our book. Shared success.</span>
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8"
          >
            <a
              href="#join"
              className="group relative inline-flex items-center gap-3 px-10 py-6 bg-accent-gold text-black font-semibold tracking-wider uppercase hover:bg-accent-hover transition-all duration-400 overflow-hidden"
            >
              <span className="relative z-10">Join the Collective</span>
              <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
              <div className="absolute inset-0 bg-gradient-to-r from-accent-hover to-accent-gold opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
            </a>

            <a
              href="#how-it-works"
              className="group inline-flex items-center gap-3 px-10 py-6 glass-button text-white font-medium tracking-wider uppercase"
            >
              <span>How It Works</span>
              <BookOpen className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
            </a>
          </motion.div>

          {/* Social Proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="flex flex-wrap justify-center gap-8 pt-12 text-white/60"
          >
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-accent-gold" />
              <span className="text-sm">1,247+ Contributors</span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-accent-gold" />
              <span className="text-sm">3 Books Published</span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-accent-gold" />
              <span className="text-sm">Profit Sharing Active</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.4 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="flex flex-col items-center gap-2 text-white/60"
          >
            <span className="text-xs tracking-widest uppercase">Scroll</span>
            <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="w-1 h-2 bg-accent-gold rounded-full"
              />
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-32 bg-gradient-to-b from-black via-zinc-900 to-black relative overflow-hidden">
        <div className="container-wide relative z-10">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="w-16 h-px bg-gradient-to-r from-transparent to-accent-gold" />
              <div className="w-2 h-2 rotate-45 bg-accent-gold" />
              <div className="w-16 h-px bg-gradient-to-l from-transparent to-accent-gold" />
            </div>
            <h2 className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl font-light font-serif mb-6 text-white">
              How It Works
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Four simple steps to becoming a published author
            </p>
          </motion.div>

          {/* Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {[
              {
                icon: Mic,
                step: '01',
                title: 'Share Your Story',
                description: 'Record your voice, write text, or upload files. No writing skills required - just your authentic experience.',
                color: 'from-blue-500/20 to-blue-600/20',
                iconColor: 'text-blue-400',
              },
              {
                icon: Brain,
                step: '02',
                title: 'AI Processes',
                description: 'Advanced AI integrates your contribution with thousands of others, finding themes and connections.',
                color: 'from-purple-500/20 to-purple-600/20',
                iconColor: 'text-purple-400',
              },
              {
                icon: BookOpenCheck,
                step: '03',
                title: 'Become Published',
                description: 'Your story becomes part of the collective work. You receive co-author credit in the published book.',
                color: 'from-accent-gold/20 to-yellow-600/20',
                iconColor: 'text-accent-gold',
              },
              {
                icon: TrendingUp,
                step: '04',
                title: 'Earn Profit Share',
                description: 'Every sale generates revenue shared proportionally among all contributors. Passive income forever.',
                color: 'from-green-500/20 to-green-600/20',
                iconColor: 'text-green-400',
              },
            ].map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative group"
              >
                <div className="glass-card rounded-2xl p-8 h-full hover:scale-105 transition-transform duration-400">
                  {/* Step Number */}
                  <div className="absolute -top-6 -right-6 text-8xl font-bold text-white/5 font-serif">
                    {step.step}
                  </div>

                  {/* Icon */}
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-400`}>
                    <step.icon className={`w-8 h-8 ${step.iconColor}`} />
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-serif font-light mb-4 text-white">
                    {step.title}
                  </h3>
                  <p className="text-white/70 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-32 bg-black relative overflow-hidden">
        <div className="container-wide relative z-10">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="w-16 h-px bg-gradient-to-r from-transparent to-accent-gold" />
              <div className="w-2 h-2 rotate-45 bg-accent-gold" />
              <div className="w-16 h-px bg-gradient-to-l from-transparent to-accent-gold" />
            </div>
            <h2 className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl font-light font-serif mb-6 text-white">
              Why Join US?
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Transform your experience into lasting impact
            </p>
          </motion.div>

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {[
              {
                icon: MessageSquare,
                title: 'Your Voice in Print',
                description: 'Your personal story becomes part of a published work that reaches thousands of readers worldwide.',
              },
              {
                icon: Award,
                title: 'Co-Author Credit',
                description: 'Official recognition as a contributing author. Add "Published Author" to your resume and LinkedIn.',
              },
              {
                icon: DollarSign,
                title: 'Profit Participation',
                description: 'Earn passive income from every book sale. The more you contribute, the larger your share.',
              },
              {
                icon: BookOpen,
                title: 'Zero Writing Effort',
                description: 'No need to be a writer. Just share your authentic experience in whatever format feels natural.',
              },
              {
                icon: Users,
                title: 'Join a Movement',
                description: 'Be part of a revolutionary approach to collective storytelling powered by cutting-edge AI.',
              },
              {
                icon: Sparkles,
                title: 'Hear Your Story',
                description: 'Receive the audiobook version and hear your words transformed into a professional narrative.',
              },
            ].map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="glass-card rounded-2xl p-8 hover:scale-105 transition-transform duration-400"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-accent-gold/20 to-accent-gold/10 flex items-center justify-center mb-6">
                  <benefit.icon className="w-7 h-7 text-accent-gold" />
                </div>
                <h3 className="text-2xl font-serif font-light mb-4 text-white">
                  {benefit.title}
                </h3>
                <p className="text-white/70 leading-relaxed">
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section id="join" className="py-32 bg-gradient-to-b from-black via-accent-gold/5 to-black relative overflow-hidden">
        <div className="container-wide relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            {/* Ornamental line */}
            <div className="flex items-center justify-center gap-4 mb-12">
              <div className="w-16 h-px bg-gradient-to-r from-transparent to-accent-gold" />
              <div className="w-2 h-2 rotate-45 bg-accent-gold" />
              <div className="w-16 h-px bg-gradient-to-l from-transparent to-accent-gold" />
            </div>

            <h2 className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl font-light font-serif mb-8 text-white">
              Ready to Share Your Story?
            </h2>
            <p className="text-xl md:text-2xl text-white/80 mb-12 max-w-2xl mx-auto leading-relaxed">
              Join thousands of contributors who are creating literary history together.
              <span className="block mt-4 text-accent-gold font-medium">
                Early contributors receive higher profit percentages.
              </span>
            </p>

            {/* Email Signup Form */}
            {!submitted ? (
              <motion.form
                onSubmit={handleSubmit}
                className="max-w-2xl mx-auto mb-12"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="flex flex-col sm:flex-row gap-4">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    required
                    className="flex-1 glass-input px-6 py-5 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-accent-gold/50 transition-all duration-300"
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="group relative inline-flex items-center justify-center gap-3 px-10 py-5 bg-accent-gold text-black font-semibold tracking-wider uppercase hover:bg-accent-hover transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden rounded-lg"
                  >
                    {isSubmitting ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          className="w-5 h-5 border-2 border-black border-t-transparent rounded-full"
                        />
                        <span>Joining...</span>
                      </>
                    ) : (
                      <>
                        <span className="relative z-10">I Want to Contribute</span>
                        <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
                      </>
                    )}
                  </button>
                </div>
                <p className="text-sm text-white/50 mt-4">
                  We'll send you early access details and contribution guidelines.
                </p>
              </motion.form>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="max-w-2xl mx-auto mb-12 glass-card rounded-2xl p-12"
              >
                <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-6" />
                <h3 className="text-3xl font-serif font-light mb-4 text-white">
                  Welcome to the Collective!
                </h3>
                <p className="text-white/70 text-lg leading-relaxed">
                  Check your inbox for next steps. We're excited to hear your story and make you a published author.
                </p>
              </motion.div>
            )}

            {/* Social Proof Elements */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
              {[
                {
                  icon: Users,
                  stat: '1,247+',
                  label: 'Active Contributors',
                },
                {
                  icon: BookOpen,
                  stat: '3 Books',
                  label: 'Published & Selling',
                },
                {
                  icon: DollarSign,
                  stat: '$47K+',
                  label: 'Distributed to Authors',
                },
              ].map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-accent-gold/20 to-accent-gold/10 flex items-center justify-center mx-auto mb-4">
                    <item.icon className="w-7 h-7 text-accent-gold" />
                  </div>
                  <div className="text-3xl font-serif font-light text-white mb-2">
                    {item.stat}
                  </div>
                  <div className="text-sm text-white/60 uppercase tracking-wider">
                    {item.label}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Ornamental line */}
            <div className="flex items-center justify-center gap-4 mt-16">
              <div className="w-16 h-px bg-gradient-to-r from-transparent to-accent-gold" />
              <div className="w-2 h-2 rotate-45 bg-accent-gold" />
              <div className="w-16 h-px bg-gradient-to-l from-transparent to-accent-gold" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer Quote */}
      <section className="py-24 bg-black">
        <div className="container-wide">
          <motion.blockquote
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center space-y-8"
          >
            <p className="text-2xl md:text-4xl font-light font-serif text-white/95 leading-relaxed italic">
              "Every voice matters. Every story adds to the whole. Together, we create something{' '}
              <span className="text-accent-gold">no single person could achieve alone</span>."
            </p>
            <footer className="text-accent-gold font-serif text-xl tracking-wider">
              — Brandon Mills
            </footer>
          </motion.blockquote>
        </div>
      </section>
    </div>
  )
}
