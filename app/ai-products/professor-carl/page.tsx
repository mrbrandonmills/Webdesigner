'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import ScrollReveal from '@/components/scroll-reveal'
import {
  ArrowRight,
  Check,
  BookOpen,
  GraduationCap,
  Brain,
  MessageCircle,
  Lightbulb,
  Clock,
  FileText,
  Video,
  Award,
  Users,
  Sparkles,
  PlayCircle,
  Shield,
} from 'lucide-react'
import Link from 'next/link'

export default function ProfessorCarlPage() {
  const [selectedPlan, setSelectedPlan] = useState('student')

  const features = [
    {
      icon: Brain,
      title: 'Adaptive Learning Intelligence',
      description:
        'AI that learns your knowledge gaps and adapts explanations to your comprehension level, ensuring mastery of every concept.',
    },
    {
      icon: MessageCircle,
      title: 'Socratic Method Teaching',
      description:
        'Engage in dialogue-based learning where Professor Carl asks probing questions to deepen your understanding, not just provide answers.',
    },
    {
      icon: FileText,
      title: 'Multi-Subject Expertise',
      description:
        'From quantum physics to ancient philosophy, mathematics to literature—comprehensive knowledge across all academic disciplines.',
    },
    {
      icon: Lightbulb,
      title: 'Step-by-Step Problem Solving',
      description:
        'Break down complex problems into manageable steps with detailed explanations at each stage, building problem-solving skills.',
    },
    {
      icon: Clock,
      title: '24/7 Availability',
      description:
        'Study anytime, anywhere. Get instant help with homework, exam prep, or deeper exploration of topics that fascinate you.',
    },
    {
      icon: Video,
      title: 'Visual Learning Tools',
      description:
        'Interactive diagrams, concept maps, and visual explanations that make abstract concepts concrete and memorable.',
    },
    {
      icon: Award,
      title: 'Progress Tracking & Achievements',
      description:
        'Monitor your learning journey with detailed analytics, milestones, and personalized study recommendations.',
    },
  ]

  const targetAudience = [
    {
      title: 'High School & College Students',
      description:
        'Master challenging subjects, prepare for exams, and develop critical thinking skills across all disciplines.',
      icon: GraduationCap,
      benefits: ['Homework assistance', 'Exam preparation', 'Concept clarification', 'Essay guidance'],
    },
    {
      title: 'Lifelong Learners',
      description:
        'Explore new subjects, deepen expertise in areas of interest, or reskill for career advancement.',
      icon: BookOpen,
      benefits: ['Self-paced learning', 'Deep dives into topics', 'Career development', 'Intellectual curiosity'],
    },
    {
      title: 'Educators & Tutors',
      description:
        'Supplement your teaching with AI assistance, create lesson plans, and provide students with additional support.',
      icon: Users,
      benefits: ['Lesson planning', 'Student support', 'Teaching methodology', 'Resource creation'],
    },
  ]

  const pricingPlans = [
    {
      id: 'student',
      name: 'Student',
      price: '19',
      period: 'per month',
      description: 'Perfect for individual learners',
      features: [
        '100 questions per month',
        'All subject areas',
        'Step-by-step explanations',
        'Study session history',
        'Mobile & web access',
        'Basic progress tracking',
      ],
      cta: 'Start Learning',
      highlighted: false,
    },
    {
      id: 'scholar',
      name: 'Scholar',
      price: '49',
      period: 'per month',
      description: 'For serious students and professionals',
      features: [
        'Unlimited questions',
        'Priority response time',
        'Advanced problem-solving',
        'Research assistance',
        'Citation & reference help',
        'Detailed progress analytics',
        'Study plan generation',
        'Flashcard & quiz creation',
      ],
      cta: 'Unlock Full Access',
      highlighted: true,
    },
    {
      id: 'institution',
      name: 'Institution',
      price: 'Custom',
      period: 'contact for pricing',
      description: 'For schools, universities, and organizations',
      features: [
        'Everything in Scholar',
        'Multiple user accounts',
        'Admin dashboard',
        'Usage analytics',
        'Custom subject modules',
        'White-label option',
        'API access',
        'Dedicated support',
        'Training & onboarding',
      ],
      cta: 'Contact Us',
      highlighted: false,
    },
  ]

  const subjects = [
    'Mathematics & Calculus',
    'Physics & Engineering',
    'Chemistry & Biology',
    'Computer Science',
    'Philosophy & Ethics',
    'History & Social Sciences',
    'Literature & Writing',
    'Economics & Business',
    'Psychology & Neuroscience',
    'Languages & Linguistics',
    'Art & Music Theory',
    'Statistics & Data Science',
  ]

  const technicalFeatures = [
    {
      title: 'GPT-4 Architecture',
      description: 'Built on the most advanced language model with deep subject matter expertise',
    },
    {
      title: 'Knowledge Graph Integration',
      description: 'Connects concepts across disciplines for interdisciplinary understanding',
    },
    {
      title: 'LaTeX & Mathematical Notation',
      description: 'Render complex equations and formulas with perfect clarity',
    },
    {
      title: 'Source Citation',
      description: 'Academic-grade references and citations for research integrity',
    },
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative pt-40 pb-20 overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-purple-600/10 via-black to-black"></div>

        <div className="container-wide relative z-10">
          <ScrollReveal direction="up">
            <div className="max-w-4xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-full mb-6"
              >
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span className="text-sm tracking-wider uppercase text-purple-400">
                  Educational AI Assistant
                </span>
              </motion.div>

              <h1 className="text-5xl md:text-7xl font-serif mb-6 bg-gradient-to-r from-white via-purple-200 to-white/60 bg-clip-text text-transparent">
                Professor Carl
              </h1>

              <p className="text-xl md:text-2xl text-white/70 mb-8 leading-relaxed">
                Your personal AI tutor with the knowledge of a thousand professors. Master any
                subject through personalized, adaptive learning conversations.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button className="px-8 py-4 bg-accent-gold text-black rounded-full hover:bg-accent-hover transition-all duration-300 font-medium flex items-center gap-2 group">
                  Start Free Trial
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="px-8 py-4 bg-white/5 border border-white/10 text-white rounded-full hover:bg-white/10 hover:border-purple-500/30 transition-all duration-300 font-medium flex items-center gap-2">
                  <PlayCircle className="w-5 h-5" />
                  See How It Works
                </button>
              </div>

              <div className="mt-12 flex items-center justify-center gap-8 text-sm text-white/60">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-accent-gold" />
                  <span>7-day free trial</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-accent-gold" />
                  <span>Privacy-first design</span>
                </div>
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-accent-gold" />
                  <span>Trusted by 50,000+ students</span>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Demo Interface Preview */}
        <ScrollReveal direction="up" delay={0.2}>
          <div className="container-wide mt-16 relative z-10">
            <div className="max-w-6xl mx-auto">
              <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                <div className="aspect-[16/10] bg-gradient-to-br from-purple-600/20 via-white/5 to-blue-500/20 flex items-center justify-center">
                  <div className="text-center p-8">
                    <Brain className="w-20 h-20 text-white/40 mx-auto mb-4" />
                    <p className="text-white/60 text-lg mb-2">
                      Interactive Learning Interface
                    </p>
                    <p className="text-white/40 text-sm max-w-md mx-auto">
                      Conversational AI that adapts to your learning style, complete with visual aids,
                      step-by-step guidance, and instant feedback
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* Key Features */}
      <section className="py-20 bg-gradient-to-b from-black to-white/5">
        <div className="container-wide">
          <ScrollReveal direction="up">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-serif mb-4">
                Learn Smarter, Not Harder
              </h2>
              <p className="text-xl text-white/60 max-w-2xl mx-auto">
                Professor Carl combines pedagogical expertise with cutting-edge AI to create the
                ultimate personalized learning experience.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <ScrollReveal key={index} direction="up" delay={index * 0.1}>
                <motion.div
                  whileHover={{ y: -5 }}
                  className="p-8 bg-white/5 border border-white/10 rounded-2xl hover:border-purple-500/30 transition-all duration-300"
                >
                  <div className="w-14 h-14 bg-purple-500/20 rounded-xl flex items-center justify-center mb-4">
                    <feature.icon className="w-7 h-7 text-purple-400" />
                  </div>
                  <h3 className="text-xl font-serif mb-3">{feature.title}</h3>
                  <p className="text-white/60 leading-relaxed">{feature.description}</p>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Subject Coverage */}
      <section className="py-20">
        <div className="container-wide">
          <ScrollReveal direction="up">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-serif mb-4">Comprehensive Subject Coverage</h2>
              <p className="text-xl text-white/60 max-w-2xl mx-auto">
                Expert knowledge across all academic disciplines, from foundational concepts to
                advanced research topics.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="up">
            <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {subjects.map((subject, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  viewport={{ once: true }}
                  className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-center hover:border-purple-500/30 transition-all duration-300"
                >
                  <span className="text-sm text-white/80">{subject}</span>
                </motion.div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Target Audience */}
      <section className="py-20 bg-white/5">
        <div className="container-wide">
          <ScrollReveal direction="up">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-serif mb-4">Who Benefits from Professor Carl?</h2>
              <p className="text-xl text-white/60 max-w-2xl mx-auto">
                Designed for learners of all levels, from curious minds to academic professionals.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {targetAudience.map((audience, index) => (
              <ScrollReveal key={index} direction="up" delay={index * 0.1}>
                <div className="p-8 bg-gradient-to-br from-white/5 to-transparent border border-white/10 rounded-2xl">
                  <div className="w-14 h-14 bg-accent-gold/20 rounded-xl flex items-center justify-center mb-4">
                    <audience.icon className="w-7 h-7 text-accent-gold" />
                  </div>
                  <h3 className="text-2xl font-serif mb-4">{audience.title}</h3>
                  <p className="text-white/70 mb-6 leading-relaxed">{audience.description}</p>
                  <ul className="space-y-2">
                    {audience.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-white/60">
                        <Check className="w-4 h-4 text-purple-400" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20">
        <div className="container-wide">
          <ScrollReveal direction="up">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-serif mb-4">Investment in Your Education</h2>
              <p className="text-xl text-white/60 max-w-2xl mx-auto">
                Flexible plans designed for every learning journey. Start with a 7-day free trial.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <ScrollReveal key={plan.id} direction="up" delay={index * 0.1}>
                <motion.div
                  whileHover={{ y: -8 }}
                  className={`relative p-8 rounded-2xl border ${
                    plan.highlighted
                      ? 'bg-gradient-to-br from-purple-500/20 to-purple-500/5 border-purple-500'
                      : 'bg-white/5 border-white/10'
                  } transition-all duration-300`}
                >
                  {plan.highlighted && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-purple-500 text-white text-sm font-medium rounded-full">
                      Most Popular
                    </div>
                  )}

                  <div className="mb-6">
                    <h3 className="text-2xl font-serif mb-2">{plan.name}</h3>
                    <p className="text-white/60 text-sm mb-4">{plan.description}</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-bold text-accent-gold">
                        {plan.price !== 'Custom' ? '$' : ''}
                        {plan.price}
                      </span>
                      <span className="text-white/60">/{plan.period}</span>
                    </div>
                  </div>

                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                        <span className="text-white/80">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    className={`w-full py-4 rounded-full font-medium transition-all duration-300 ${
                      plan.highlighted
                        ? 'bg-accent-gold text-black hover:bg-accent-hover'
                        : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
                    }`}
                  >
                    {plan.cta}
                  </button>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Technical Features */}
      <section className="py-20 bg-gradient-to-b from-white/5 to-black">
        <div className="container-wide">
          <ScrollReveal direction="up">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-serif mb-4">
                Advanced AI Technology
              </h2>
              <p className="text-xl text-white/60 max-w-2xl mx-auto">
                Built on state-of-the-art language models and pedagogical frameworks for optimal
                learning outcomes.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {technicalFeatures.map((tech, index) => (
              <ScrollReveal key={index} direction="up" delay={index * 0.1}>
                <div className="p-6 bg-gradient-to-br from-purple-500/10 to-transparent border border-purple-500/30 rounded-xl">
                  <h3 className="text-lg font-medium mb-2 text-purple-400">{tech.title}</h3>
                  <p className="text-sm text-white/70">{tech.description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-20">
        <div className="container-wide">
          <ScrollReveal direction="up">
            <div className="max-w-4xl mx-auto text-center">
              <div className="mb-8">
                <div className="flex items-center justify-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-6 h-6 text-accent-gold fill-current"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>
                <blockquote className="text-2xl font-serif text-white/90 mb-6">
                  "Professor Carl helped me ace my quantum mechanics exam. The step-by-step
                  explanations and ability to ask follow-up questions transformed my understanding.
                  It's like having a patient, brilliant tutor available 24/7."
                </blockquote>
                <div>
                  <p className="text-white/60">Sarah Chen</p>
                  <p className="text-sm text-white/40">Physics Major, MIT</p>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-purple-600/10 to-black">
        <div className="container-wide">
          <ScrollReveal direction="up">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl md:text-5xl font-serif mb-6">
                Your Academic Success Starts Here
              </h2>
              <p className="text-xl text-white/70 mb-8">
                Join thousands of students who have transformed their learning with Professor Carl.
                Start your 7-day free trial today—no credit card required.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button className="px-8 py-4 bg-accent-gold text-black rounded-full hover:bg-accent-hover transition-all duration-300 font-medium flex items-center gap-2 group">
                  Begin Your Free Trial
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <Link href="/contact">
                  <button className="px-8 py-4 bg-white/5 border border-white/10 text-white rounded-full hover:bg-white/10 hover:border-purple-500/30 transition-all duration-300 font-medium">
                    Contact for Institutions
                  </button>
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  )
}
