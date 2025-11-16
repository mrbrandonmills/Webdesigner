'use client'

import { motion } from 'framer-motion'
import ScrollReveal from '@/components/scroll-reveal'
import { ArrowRight, Check, TrendingUp, Activity, Shield, Zap, Target, BarChart3, AlertTriangle, PlayCircle } from 'lucide-react'

export default function QuantumHTCOptionsTraderPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Risk Disclaimer Banner */}
      <div className="bg-red-900/20 border-b border-red-500/30">
        <div className="container-wide py-3">
          <div className="flex items-center gap-2 text-sm text-red-300">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <p><strong>Investment Disclaimer:</strong> Trading options involves substantial risk of loss. Past performance does not guarantee future results. This system is for informational purposes only and not financial advice.</p>
          </div>
        </div>
      </div>

      <section className="relative pt-40 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-600/10 via-black to-black"></div>
        <div className="container-wide relative z-10">
          <ScrollReveal direction="up">
            <div className="max-w-4xl mx-auto text-center">
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }} className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/20 border border-amber-500/30 rounded-full mb-6">
                <Activity className="w-4 h-4 text-amber-400" />
                <span className="text-sm tracking-wider uppercase text-amber-400">Algorithmic Trading</span>
              </motion.div>
              <h1 className="text-5xl md:text-7xl font-serif mb-6">Quantum HTC Options Trader</h1>
              <p className="text-xl md:text-2xl text-white/70 mb-8 leading-relaxed">
                Advanced algorithmic options trading system combining quantum-inspired optimization with high-frequency technical analysis. Trade options like a quantitative hedge fund.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button className="px-8 py-4 bg-accent-gold text-black rounded-full hover:bg-accent-hover transition-all duration-300 font-medium flex items-center gap-2 group">
                  Request Access <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="px-8 py-4 bg-white/5 border border-white/10 text-white rounded-full hover:bg-white/10 hover:border-amber-500/30 transition-all duration-300 font-medium flex items-center gap-2">
                  <PlayCircle className="w-5 h-5" />
                  View Performance
                </button>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-b from-black to-white/5">
        <div className="container-wide">
          <ScrollReveal direction="up"><div className="text-center mb-16"><h2 className="text-4xl md:text-5xl font-serif mb-4">What is Quantum HTC?</h2><p className="text-xl text-white/60 max-w-3xl mx-auto">Quantum-inspired Heuristic Technical Correlation combines quantum computing principles with machine learning to identify high-probability options trading opportunities in real-time.</p></div></ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Zap, title: 'Quantum-Inspired Optimization', description: 'Algorithms inspired by quantum annealing find optimal trade entries across thousands of strike prices and expirations simultaneously.' },
              { icon: Target, title: 'Multi-Timeframe Analysis', description: 'Analyzes price action across 15 timeframes from 1-minute to daily charts to identify confluence zones.' },
              { icon: BarChart3, title: 'Options Greeks Modeling', description: 'Real-time calculation of Delta, Gamma, Theta, Vega to optimize position sizing and risk management.' },
            ].map((feature, index) => (
              <ScrollReveal key={index} direction="up" delay={index * 0.1}>
                <motion.div whileHover={{ y: -5 }} className="p-8 bg-white/5 border border-white/10 rounded-2xl hover:border-amber-500/30 transition-all duration-300">
                  <div className="w-14 h-14 bg-amber-500/20 rounded-xl flex items-center justify-center mb-4"><feature.icon className="w-7 h-7 text-amber-400" /></div>
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
          <ScrollReveal direction="up"><div className="text-center mb-16"><h2 className="text-4xl md:text-5xl font-serif mb-4">Trading Strategies</h2></div></ScrollReveal>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {[
              { name: 'Iron Condor Optimizer', description: 'Automatically identifies optimal strike prices for iron condor spreads based on volatility skew and probability calculations.', winRate: '68%' },
              { name: 'Earnings Momentum', description: 'Pre-earnings volatility expansion trades with dynamic position sizing based on implied volatility percentiles.', winRate: '71%' },
              { name: 'Delta-Neutral Scalping', description: 'Intraday gamma scalping on high-volume options with automatic hedging to maintain delta neutrality.', winRate: '63%' },
              { name: 'Volatility Crush', description: 'Post-earnings IV collapse plays using credit spreads with machine learning entry timing.', winRate: '74%' },
            ].map((strategy, index) => (
              <ScrollReveal key={index} direction="up" delay={index * 0.1}>
                <div className="p-8 bg-gradient-to-br from-white/5 to-transparent border border-white/10 rounded-2xl">
                  <h3 className="text-2xl font-serif mb-3">{strategy.name}</h3>
                  <p className="text-white/70 mb-4 leading-relaxed">{strategy.description}</p>
                  <div className="flex items-center gap-2 text-amber-400"><TrendingUp className="w-5 h-5" /><span className="font-medium">{strategy.winRate} historical win rate</span></div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-b from-white/5 to-black">
        <div className="container-wide">
          <ScrollReveal direction="up"><div className="text-center mb-16"><h2 className="text-4xl md:text-5xl font-serif mb-4">Institutional-Grade Access</h2></div></ScrollReveal>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {[
              { name: 'Retail Trader', price: '299', features: ['1 brokerage connection', 'Up to 10 active positions', 'Basic strategies', 'Email alerts', 'Standard support'] },
              { name: 'Professional', price: '999', features: ['3 brokerage connections', 'Unlimited positions', 'All strategies unlocked', 'Real-time SMS alerts', 'Priority support', 'Custom risk parameters', 'Backtesting engine'], highlighted: true },
              { name: 'Institutional', price: 'Custom', features: ['Unlimited brokerages', 'Multi-account management', 'Custom strategy development', 'Dedicated infrastructure', 'White-label option', 'API access', '24/7 support'] },
            ].map((tier, index) => (
              <ScrollReveal key={index} direction="up" delay={index * 0.1}>
                <motion.div whileHover={{ y: -8 }} className={`relative p-8 rounded-2xl border ${tier.highlighted ? 'bg-gradient-to-br from-amber-500/20 to-amber-500/5 border-amber-500' : 'bg-white/5 border-white/10'} transition-all duration-300`}>
                  {tier.highlighted && <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-amber-500 text-black text-sm font-medium rounded-full">Most Popular</div>}
                  <h3 className="text-2xl font-serif mb-2">{tier.name}</h3>
                  <div className="flex items-baseline gap-2 mb-6"><span className="text-5xl font-bold text-accent-gold">{tier.price !== 'Custom' ? '$' : ''}{tier.price}</span><span className="text-white/60">/month</span></div>
                  <ul className="space-y-4 mb-8">{tier.features.map((feature, idx) => (<li key={idx} className="flex items-start gap-3"><Check className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" /><span className="text-white/80">{feature}</span></li>))}</ul>
                  <button className={`w-full py-4 rounded-full font-medium ${tier.highlighted ? 'bg-accent-gold text-black hover:bg-accent-hover' : 'bg-white/10 text-white hover:bg-white/20'}`}>Request Access</button>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
