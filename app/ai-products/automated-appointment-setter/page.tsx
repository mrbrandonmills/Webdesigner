'use client'

import { motion } from 'framer-motion'
import ScrollReveal from '@/components/scroll-reveal'
import {
  ArrowRight,
  Check,
  Calendar,
  Clock,
  MessageSquare,
  Zap,
  Users,
  BarChart3,
  Globe,
  Shield,
  TrendingUp,
  PlayCircle,
  Phone,
} from 'lucide-react'
import Link from 'next/link'

export default function AutomatedAppointmentSetterPage() {
  const features = [
    {
      icon: MessageSquare,
      title: 'Natural Language AI',
      description: 'Converses with prospects via email, SMS, and chat to find optimal meeting times naturally and professionally.',
    },
    {
      icon: Calendar,
      title: 'Smart Scheduling',
      description: 'Integrates with Google Calendar, Outlook, and 15+ calendar platforms. Automatically proposes times that work for everyone.',
    },
    {
      icon: Globe,
      title: 'Timezone Intelligence',
      description: 'Handles multi-timezone coordination seamlessly, suggesting meeting times convenient for all participants.',
    },
    {
      icon: Zap,
      title: 'Instant Booking',
      description: 'Prospects can self-schedule from your availability without back-and-forth emails. Confirmations sent automatically.',
    },
    {
      icon: Phone,
      title: 'Automated Reminders',
      description: 'Smart reminder system reduces no-shows by 73% with customizable email and SMS notifications.',
    },
    {
      icon: BarChart3,
      title: 'Analytics Dashboard',
      description: 'Track booking rates, no-show patterns, optimal meeting times, and team utilization metrics.',
    },
  ]

  const pricingTiers = [
    {
      id: 'individual',
      name: 'Individual',
      price: '29',
      period: 'per month',
      features: ['100 appointments/month', 'Single calendar sync', 'Email & SMS reminders', 'Basic analytics'],
      cta: 'Start Free Trial',
      highlighted: false,
    },
    {
      id: 'team',
      name: 'Team',
      price: '99',
      period: 'per month',
      features: ['Unlimited appointments', '5 team members', 'All calendar integrations', 'CRM sync', 'Advanced analytics', 'Priority support'],
      cta: 'Get Started',
      highlighted: true,
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 'Custom',
      period: 'contact sales',
      features: ['Unlimited everything', 'Custom integrations', 'White-label option', 'Dedicated support', 'SLA guarantee'],
      cta: 'Contact Sales',
      highlighted: false,
    },
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      <section className="relative pt-40 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-600/10 via-black to-black"></div>
        <div className="container-wide relative z-10">
          <ScrollReveal direction="up">
            <div className="max-w-4xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/20 border border-indigo-500/30 rounded-full mb-6"
              >
                <Calendar className="w-4 h-4 text-indigo-400" />
                <span className="text-sm tracking-wider uppercase text-indigo-400">Calendar AI</span>
              </motion.div>

              <h1 className="text-5xl md:text-7xl font-serif mb-6">Automated Appointment Setter</h1>
              <p className="text-xl md:text-2xl text-white/70 mb-8 leading-relaxed">
                AI assistant that handles all appointment scheduling automatically. No more back-and-forth emails. Just meetings that happen.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button className="px-8 py-4 bg-accent-gold text-black rounded-full hover:bg-accent-hover transition-all duration-300 font-medium flex items-center gap-2 group">
                  Start Free 14-Day Trial
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="px-8 py-4 bg-white/5 border border-white/10 text-white rounded-full hover:bg-white/10 hover:border-indigo-500/30 transition-all duration-300 font-medium flex items-center gap-2">
                  <PlayCircle className="w-5 h-5" />
                  Watch Demo
                </button>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-b from-black to-white/5">
        <div className="container-wide">
          <ScrollReveal direction="up">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-serif mb-4">Schedule Smarter, Not Harder</h2>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <ScrollReveal key={index} direction="up" delay={index * 0.1}>
                <motion.div
                  whileHover={{ y: -5 }}
                  className="p-8 bg-white/5 border border-white/10 rounded-2xl hover:border-indigo-500/30 transition-all duration-300"
                >
                  <div className="w-14 h-14 bg-indigo-500/20 rounded-xl flex items-center justify-center mb-4">
                    <feature.icon className="w-7 h-7 text-indigo-400" />
                  </div>
                  <h3 className="text-xl font-serif mb-3">{feature.title}</h3>
                  <p className="text-white/60 leading-relaxed">{feature.description}</p>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container-wide">
          <ScrollReveal direction="up">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-serif mb-4">Simple, Transparent Pricing</h2>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {pricingTiers.map((tier, index) => (
              <ScrollReveal key={tier.id} direction="up" delay={index * 0.1}>
                <motion.div
                  whileHover={{ y: -8 }}
                  className={`relative p-8 rounded-2xl border ${
                    tier.highlighted
                      ? 'bg-gradient-to-br from-indigo-500/20 to-indigo-500/5 border-indigo-500'
                      : 'bg-white/5 border-white/10'
                  } transition-all duration-300`}
                >
                  {tier.highlighted && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-indigo-500 text-white text-sm font-medium rounded-full">
                      Most Popular
                    </div>
                  )}

                  <div className="mb-6">
                    <h3 className="text-2xl font-serif mb-2">{tier.name}</h3>
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
                        <Check className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
                        <span className="text-white/80">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button className={`w-full py-4 rounded-full font-medium transition-all duration-300 ${
                      tier.highlighted
                        ? 'bg-accent-gold text-black hover:bg-accent-hover'
                        : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
                    }`}>
                    {tier.cta}
                  </button>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-b from-indigo-600/10 to-black">
        <div className="container-wide">
          <ScrollReveal direction="up">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl md:text-5xl font-serif mb-6">Never Miss a Meeting Again</h2>
              <p className="text-xl text-white/70 mb-8">
                Save 10+ hours per week on scheduling. Start your free trial today.
              </p>
              <button className="px-8 py-4 bg-accent-gold text-black rounded-full hover:bg-accent-hover transition-all duration-300 font-medium flex items-center gap-2 group mx-auto">
                Start Free Trial
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  )
}
