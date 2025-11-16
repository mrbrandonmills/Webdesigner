'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import ScrollReveal from '@/components/scroll-reveal'
import {
  ArrowRight,
  Check,
  Users,
  TrendingUp,
  Award,
  MessageSquare,
  Target,
  BarChart3,
  Zap,
  Shield,
  Globe,
  PlayCircle,
} from 'lucide-react'
import Link from 'next/link'

export default function SalesAgentTrainerPage() {
  const [selectedTier, setSelectedTier] = useState('professional')

  const features = [
    {
      icon: Users,
      title: 'AI-Powered Role-Play Scenarios',
      description:
        'Practice with intelligent AI personas that adapt to your responses, simulating real client objections and behaviors.',
    },
    {
      icon: MessageSquare,
      title: 'Real-Time Feedback & Coaching',
      description:
        'Receive instant analysis on your pitch delivery, tone, pacing, and persuasion techniques with actionable improvement suggestions.',
    },
    {
      icon: Target,
      title: 'Industry-Specific Training',
      description:
        'Specialized modules for insurance, financial services, B2B, and high-ticket sales with authentic industry scenarios.',
    },
    {
      icon: BarChart3,
      title: 'Performance Analytics Dashboard',
      description:
        'Track your progress with detailed metrics on closing rates, objection handling, and skill development over time.',
    },
    {
      icon: TrendingUp,
      title: 'Adaptive Difficulty Levels',
      description:
        'System automatically adjusts scenario complexity based on your performance, ensuring continuous growth and challenge.',
    },
    {
      icon: Award,
      title: 'Certification & Skill Badges',
      description:
        'Earn recognized certifications and badges as you master different aspects of sales excellence.',
    },
    {
      icon: Globe,
      title: 'Multi-Language Support',
      description:
        'Practice sales conversations in 12+ languages with culturally-aware AI personas.',
    },
  ]

  const useCases = [
    {
      title: 'Insurance Sales Teams',
      description:
        'Train agents on complex policy discussions, objection handling, and consultative selling techniques for life, health, and property insurance.',
      impact: '47% increase in conversion rates',
    },
    {
      title: 'New Sales Representatives',
      description:
        'Accelerate onboarding with safe, low-pressure practice environments that build confidence before real client interactions.',
      impact: '65% faster ramp-up time',
    },
    {
      title: 'Sales Managers',
      description:
        'Monitor team performance, identify skill gaps, and deliver targeted coaching with data-driven insights.',
      impact: '3x more effective coaching sessions',
    },
    {
      title: 'Enterprise Sales Organizations',
      description:
        'Standardize sales methodology across distributed teams with scalable, consistent training delivery.',
      impact: '89% training cost reduction',
    },
  ]

  const pricingTiers = [
    {
      id: 'starter',
      name: 'Starter',
      price: '49',
      period: 'per user/month',
      description: 'Perfect for individual sales professionals',
      features: [
        '50 AI role-play sessions per month',
        'Basic feedback and analytics',
        '5 scenario types',
        'Email support',
        'Mobile app access',
      ],
      cta: 'Start Free Trial',
      highlighted: false,
    },
    {
      id: 'professional',
      name: 'Professional',
      price: '149',
      period: 'per user/month',
      description: 'Ideal for growing sales teams',
      features: [
        'Unlimited AI role-play sessions',
        'Advanced feedback with video replay',
        '25+ industry-specific scenarios',
        'Team performance dashboard',
        'Priority support',
        'Custom scenario builder',
        'Integration with CRM systems',
        'Quarterly skill assessments',
      ],
      cta: 'Get Started',
      highlighted: true,
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 'Custom',
      period: 'contact for pricing',
      description: 'For large organizations with specific needs',
      features: [
        'Everything in Professional',
        'Unlimited users',
        'Custom AI persona development',
        'White-label solution',
        'Dedicated success manager',
        'Advanced API access',
        'Custom integrations',
        'On-premise deployment option',
        'SLA guarantee',
      ],
      cta: 'Contact Sales',
      highlighted: false,
    },
  ]

  const technicalHighlights = [
    {
      title: 'Natural Language Processing',
      description: 'GPT-4 powered conversation engine with context awareness',
    },
    {
      title: 'Speech Recognition',
      description: 'Real-time voice-to-text with accent adaptation',
    },
    {
      title: 'Sentiment Analysis',
      description: 'Emotional intelligence scoring and tone detection',
    },
    {
      title: 'Machine Learning',
      description: 'Personalized learning paths based on performance data',
    },
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative pt-40 pb-20 overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-accent-gold/10 via-black to-black"></div>

        <div className="container-wide relative z-10">
          <ScrollReveal direction="up">
            <div className="max-w-4xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-accent-gold/20 border border-accent-gold/30 rounded-full mb-6"
              >
                <Zap className="w-4 h-4 text-accent-gold" />
                <span className="text-sm tracking-wider uppercase text-accent-gold">
                  AI-Powered Sales Training
                </span>
              </motion.div>

              <h1 className="text-5xl md:text-7xl font-serif mb-6 bg-gradient-to-r from-white via-white to-white/60 bg-clip-text text-transparent">
                Sales Agent Trainer
              </h1>

              <p className="text-xl md:text-2xl text-white/70 mb-8 leading-relaxed">
                Master the art of sales through intelligent AI role-play. Practice unlimited
                scenarios, receive real-time coaching, and transform your team into top performers.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button className="px-8 py-4 bg-accent-gold text-black rounded-full hover:bg-accent-hover transition-all duration-300 font-medium flex items-center gap-2 group">
                  Start Free 14-Day Trial
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="px-8 py-4 bg-white/5 border border-white/10 text-white rounded-full hover:bg-white/10 hover:border-accent-gold/30 transition-all duration-300 font-medium flex items-center gap-2">
                  <PlayCircle className="w-5 h-5" />
                  Watch Demo
                </button>
              </div>

              <div className="mt-12 flex items-center justify-center gap-8 text-sm text-white/60">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-accent-gold" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-accent-gold" />
                  <span>SOC 2 Compliant</span>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Screenshot placeholder */}
        <ScrollReveal direction="up" delay={0.2}>
          <div className="container-wide mt-16 relative z-10">
            <div className="max-w-6xl mx-auto">
              <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                <div className="aspect-video bg-gradient-to-br from-accent-gold/20 via-white/5 to-purple-500/20 flex items-center justify-center">
                  <div className="text-center">
                    <PlayCircle className="w-20 h-20 text-white/40 mx-auto mb-4" />
                    <p className="text-white/60 text-lg">Interactive Demo Dashboard</p>
                    <p className="text-white/40 text-sm mt-2">
                      AI-powered role-play interface with real-time feedback
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
                Revolutionize Your Sales Training
              </h2>
              <p className="text-xl text-white/60 max-w-2xl mx-auto">
                Combine cutting-edge AI technology with proven sales methodologies to create the
                ultimate training platform.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <ScrollReveal key={index} direction="up" delay={index * 0.1}>
                <motion.div
                  whileHover={{ y: -5 }}
                  className="p-8 bg-white/5 border border-white/10 rounded-2xl hover:border-accent-gold/30 transition-all duration-300"
                >
                  <div className="w-14 h-14 bg-accent-gold/20 rounded-xl flex items-center justify-center mb-4">
                    <feature.icon className="w-7 h-7 text-accent-gold" />
                  </div>
                  <h3 className="text-xl font-serif mb-3">{feature.title}</h3>
                  <p className="text-white/60 leading-relaxed">{feature.description}</p>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20">
        <div className="container-wide">
          <ScrollReveal direction="up">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-serif mb-4">Built for Modern Sales Teams</h2>
              <p className="text-xl text-white/60 max-w-2xl mx-auto">
                From individual contributors to enterprise organizations, our platform scales with
                your needs.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {useCases.map((useCase, index) => (
              <ScrollReveal key={index} direction={index % 2 === 0 ? 'left' : 'right'}>
                <div className="p-8 bg-gradient-to-br from-white/5 to-transparent border border-white/10 rounded-2xl">
                  <h3 className="text-2xl font-serif mb-4">{useCase.title}</h3>
                  <p className="text-white/70 mb-4 leading-relaxed">{useCase.description}</p>
                  <div className="flex items-center gap-2 text-accent-gold">
                    <TrendingUp className="w-5 h-5" />
                    <span className="font-medium">{useCase.impact}</span>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-white/5">
        <div className="container-wide">
          <ScrollReveal direction="up">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-serif mb-4">Choose Your Plan</h2>
              <p className="text-xl text-white/60 max-w-2xl mx-auto">
                Flexible pricing that grows with your business. All plans include 14-day free trial.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {pricingTiers.map((tier, index) => (
              <ScrollReveal key={tier.id} direction="up" delay={index * 0.1}>
                <motion.div
                  whileHover={{ y: -8 }}
                  className={`relative p-8 rounded-2xl border ${
                    tier.highlighted
                      ? 'bg-gradient-to-br from-accent-gold/20 to-accent-gold/5 border-accent-gold'
                      : 'bg-white/5 border-white/10'
                  } transition-all duration-300`}
                >
                  {tier.highlighted && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-accent-gold text-black text-sm font-medium rounded-full">
                      Most Popular
                    </div>
                  )}

                  <div className="mb-6">
                    <h3 className="text-2xl font-serif mb-2">{tier.name}</h3>
                    <p className="text-white/60 text-sm mb-4">{tier.description}</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-bold text-accent-gold">
                        {tier.price !== 'Custom' ? '$' : ''}
                        {tier.price}
                      </span>
                      <span className="text-white/60">/{tier.period}</span>
                    </div>
                  </div>

                  <ul className="space-y-4 mb-8">
                    {tier.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-accent-gold flex-shrink-0 mt-0.5" />
                        <span className="text-white/80">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    className={`w-full py-4 rounded-full font-medium transition-all duration-300 ${
                      tier.highlighted
                        ? 'bg-accent-gold text-black hover:bg-accent-hover'
                        : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
                    }`}
                  >
                    {tier.cta}
                  </button>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Technical Highlights */}
      <section className="py-20">
        <div className="container-wide">
          <ScrollReveal direction="up">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-serif mb-4">
                Powered by Advanced AI Technology
              </h2>
              <p className="text-xl text-white/60 max-w-2xl mx-auto">
                State-of-the-art machine learning and natural language processing for the most
                realistic training experience.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {technicalHighlights.map((tech, index) => (
              <ScrollReveal key={index} direction="up" delay={index * 0.1}>
                <div className="p-6 bg-gradient-to-br from-accent-gold/10 to-transparent border border-accent-gold/30 rounded-xl">
                  <h3 className="text-lg font-medium mb-2 text-accent-gold">{tech.title}</h3>
                  <p className="text-sm text-white/70">{tech.description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-accent-gold/10 to-black">
        <div className="container-wide">
          <ScrollReveal direction="up">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl md:text-5xl font-serif mb-6">
                Ready to Transform Your Sales Team?
              </h2>
              <p className="text-xl text-white/70 mb-8">
                Join thousands of sales professionals who have elevated their skills with AI-powered
                training.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button className="px-8 py-4 bg-accent-gold text-black rounded-full hover:bg-accent-hover transition-all duration-300 font-medium flex items-center gap-2 group">
                  Start Your Free Trial
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <Link href="/contact">
                  <button className="px-8 py-4 bg-white/5 border border-white/10 text-white rounded-full hover:bg-white/10 hover:border-accent-gold/30 transition-all duration-300 font-medium">
                    Schedule a Demo
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
