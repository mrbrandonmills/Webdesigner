'use client'

import { motion } from 'framer-motion'
import ScrollReveal from '@/components/scroll-reveal'
import { ArrowRight, Check, FileSearch, Brain, BarChart3, Sparkles, Database, Zap, PlayCircle } from 'lucide-react'

export default function MetaAnalysisToolPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <section className="relative pt-40 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-violet-600/10 via-black to-black"></div>
        <div className="container-wide relative z-10">
          <ScrollReveal direction="up">
            <div className="max-w-4xl mx-auto text-center">
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }} className="inline-flex items-center gap-2 px-4 py-2 bg-violet-500/20 border border-violet-500/30 rounded-full mb-6">
                <Brain className="w-4 h-4 text-violet-400" />
                <span className="text-sm tracking-wider uppercase text-violet-400">Research AI</span>
              </motion.div>
              <h1 className="text-5xl md:text-7xl font-serif mb-6">Meta-Analysis Tool</h1>
              <p className="text-xl md:text-2xl text-white/70 mb-8 leading-relaxed">
                AI-powered research synthesis platform. Analyze thousands of papers, extract insights, and generate comprehensive meta-analyses in minutes instead of months.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button className="px-8 py-4 bg-accent-gold text-black rounded-full hover:bg-accent-hover transition-all duration-300 font-medium flex items-center gap-2 group">
                  Start Free Trial <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="px-8 py-4 bg-white/5 border border-white/10 text-white rounded-full hover:bg-white/10 hover:border-violet-500/30 transition-all duration-300 font-medium flex items-center gap-2">
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
          <ScrollReveal direction="up"><div className="text-center mb-16"><h2 className="text-4xl md:text-5xl font-serif mb-4">Accelerate Your Research</h2></div></ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: FileSearch, title: 'Intelligent Paper Discovery', description: 'AI searches PubMed, arXiv, Google Scholar, and 50+ databases to find relevant studies based on your research question.' },
              { icon: BarChart3, title: 'Automated Data Extraction', description: 'Extract sample sizes, effect sizes, p-values, and methodological details from PDFs automatically with 95%+ accuracy.' },
              { icon: Sparkles, title: 'Statistical Synthesis', description: 'Generate forest plots, funnel plots, and publication bias analysis. Calculate pooled effect sizes with random/fixed effects models.' },
            ].map((feature, index) => (
              <ScrollReveal key={index} direction="up" delay={index * 0.1}>
                <motion.div whileHover={{ y: -5 }} className="p-8 bg-white/5 border border-white/10 rounded-2xl hover:border-violet-500/30 transition-all duration-300">
                  <div className="w-14 h-14 bg-violet-500/20 rounded-xl flex items-center justify-center mb-4"><feature.icon className="w-7 h-7 text-violet-400" /></div>
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
          <ScrollReveal direction="up"><div className="text-center mb-16"><h2 className="text-4xl md:text-5xl font-serif mb-4">Research-Grade Pricing</h2></div></ScrollReveal>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {[
              { name: 'Academic', price: '79', features: ['10 meta-analyses/month', 'Up to 100 papers per analysis', 'Basic statistical methods', 'PDF export', 'Email support'] },
              { name: 'Professional', price: '199', features: ['Unlimited analyses', 'Up to 1,000 papers per analysis', 'Advanced statistics', 'Publication-ready exports', 'PRISMA diagram generation', 'Priority support', 'API access'], highlighted: true },
              { name: 'Institution', price: 'Custom', features: ['Unlimited everything', 'Multi-user accounts', 'Custom integrations', 'Dedicated support', 'Training & onboarding', 'White-label option'] },
            ].map((tier, index) => (
              <ScrollReveal key={index} direction="up" delay={index * 0.1}>
                <motion.div whileHover={{ y: -8 }} className={`relative p-8 rounded-2xl border ${tier.highlighted ? 'bg-gradient-to-br from-violet-500/20 to-violet-500/5 border-violet-500' : 'bg-white/5 border-white/10'} transition-all duration-300`}>
                  {tier.highlighted && <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-violet-500 text-white text-sm font-medium rounded-full">Most Popular</div>}
                  <h3 className="text-2xl font-serif mb-2">{tier.name}</h3>
                  <div className="flex items-baseline gap-2 mb-6"><span className="text-5xl font-bold text-accent-gold">{tier.price !== 'Custom' ? '$' : ''}{tier.price}</span><span className="text-white/60">/month</span></div>
                  <ul className="space-y-4 mb-8">{tier.features.map((feature, idx) => (<li key={idx} className="flex items-start gap-3"><Check className="w-5 h-5 text-violet-400 flex-shrink-0 mt-0.5" /><span className="text-white/80">{feature}</span></li>))}</ul>
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
