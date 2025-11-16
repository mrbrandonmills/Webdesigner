'use client'

import { motion } from 'framer-motion'
import ScrollReveal from '@/components/scroll-reveal'
import { ArrowRight, Check, TrendingUp, DollarSign, PieChart, Shield, Target, BarChart3, PlayCircle } from 'lucide-react'

export default function AIFinancialPlannerPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <section className="relative pt-40 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-600/10 via-black to-black"></div>
        <div className="container-wide relative z-10">
          <ScrollReveal direction="up">
            <div className="max-w-4xl mx-auto text-center">
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }} className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/20 border border-emerald-500/30 rounded-full mb-6">
                <DollarSign className="w-4 h-4 text-emerald-400" />
                <span className="text-sm tracking-wider uppercase text-emerald-400">Financial AI</span>
              </motion.div>
              <h1 className="text-5xl md:text-7xl font-serif mb-6">AI Financial Planner</h1>
              <p className="text-xl md:text-2xl text-white/70 mb-8 leading-relaxed">
                Your personal AI financial advisor. Get personalized investment strategies, retirement planning, and wealth management guidance powered by advanced algorithms.
              </p>
              <p className="text-sm text-yellow-500/80 mb-8">
                <Shield className="w-4 h-4 inline mr-2" />
                Disclaimer: Not a substitute for professional financial advice. For informational purposes only.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button className="px-8 py-4 bg-accent-gold text-black rounded-full hover:bg-accent-hover transition-all duration-300 font-medium flex items-center gap-2 group">
                  Start Free Analysis <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-b from-black to-white/5">
        <div className="container-wide">
          <ScrollReveal direction="up"><div className="text-center mb-16"><h2 className="text-4xl md:text-5xl font-serif mb-4">Intelligent Financial Planning</h2></div></ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Target, title: 'Goal-Based Planning', description: 'Set financial goals and get AI-generated roadmaps to achieve them.' },
              { icon: PieChart, title: 'Portfolio Optimization', description: 'Analyze your investments and receive rebalancing recommendations.' },
              { icon: TrendingUp, title: 'Retirement Projections', description: 'Monte Carlo simulations predict your retirement readiness with 95% confidence intervals.' },
            ].map((feature, index) => (
              <ScrollReveal key={index} direction="up" delay={index * 0.1}>
                <motion.div whileHover={{ y: -5 }} className="p-8 bg-white/5 border border-white/10 rounded-2xl hover:border-emerald-500/30 transition-all duration-300">
                  <div className="w-14 h-14 bg-emerald-500/20 rounded-xl flex items-center justify-center mb-4"><feature.icon className="w-7 h-7 text-emerald-400" /></div>
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
          <ScrollReveal direction="up"><div className="text-center mb-16"><h2 className="text-4xl md:text-5xl font-serif mb-4">Investment in Your Future</h2></div></ScrollReveal>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {[
              { name: 'Individual', price: '39', features: ['Personal financial dashboard', 'Goal tracking', 'Basic investment analysis', 'Monthly reports'] },
              { name: 'Premium', price: '99', features: ['Everything in Individual', 'Advanced portfolio optimization', 'Tax optimization strategies', 'Unlimited financial scenarios', 'Priority support'], highlighted: true },
              { name: 'Advisor', price: '299', features: ['Multi-client management', 'White-label reports', 'API access', 'Dedicated account manager'] },
            ].map((tier, index) => (
              <ScrollReveal key={index} direction="up" delay={index * 0.1}>
                <motion.div whileHover={{ y: -8 }} className={`relative p-8 rounded-2xl border ${tier.highlighted ? 'bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 border-emerald-500' : 'bg-white/5 border-white/10'} transition-all duration-300`}>
                  <h3 className="text-2xl font-serif mb-2">{tier.name}</h3>
                  <div className="flex items-baseline gap-2 mb-6"><span className="text-5xl font-bold text-accent-gold">${tier.price}</span><span className="text-white/60">/month</span></div>
                  <ul className="space-y-4 mb-8">{tier.features.map((feature, idx) => (<li key={idx} className="flex items-start gap-3"><Check className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" /><span className="text-white/80">{feature}</span></li>))}</ul>
                  <button className={`w-full py-4 rounded-full font-medium ${tier.highlighted ? 'bg-accent-gold text-black hover:bg-accent-hover' : 'bg-white/10 text-white hover:bg-white/20'}`}>Get Started</button>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
