'use client'

import { motion } from 'framer-motion'
import ScrollReveal from '@/components/scroll-reveal'
import { ArrowRight, Check, Sprout, Droplets, Sun, Thermometer, Activity, BarChart3, Bell, Smartphone, PlayCircle } from 'lucide-react'

export default function PlantMonitoringSystemPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <section className="relative pt-40 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-green-600/10 via-black to-black"></div>
        <div className="container-wide relative z-10">
          <ScrollReveal direction="up">
            <div className="max-w-4xl mx-auto text-center">
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }} className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-full mb-6">
                <Sprout className="w-4 h-4 text-green-400" />
                <span className="text-sm tracking-wider uppercase text-green-400">Agriculture AI</span>
              </motion.div>
              <h1 className="text-5xl md:text-7xl font-serif mb-6">Plant Monitoring AI System</h1>
              <p className="text-xl md:text-2xl text-white/70 mb-8 leading-relaxed">
                AI-powered plant health monitoring for home gardens, greenhouses, and commercial agriculture. IoT sensors + computer vision = perfect growing conditions, automatically.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button className="px-8 py-4 bg-accent-gold text-black rounded-full hover:bg-accent-hover transition-all duration-300 font-medium flex items-center gap-2 group">
                  Order Starter Kit <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="px-8 py-4 bg-white/5 border border-white/10 text-white rounded-full hover:bg-white/10 hover:border-green-500/30 transition-all duration-300 font-medium flex items-center gap-2">
                  <PlayCircle className="w-5 h-5" />
                  See How It Works
                </button>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-b from-black to-white/5">
        <div className="container-wide">
          <ScrollReveal direction="up"><div className="text-center mb-16"><h2 className="text-4xl md:text-5xl font-serif mb-4">Smart Plant Care, Simplified</h2></div></ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Droplets, title: 'Soil Moisture Monitoring', description: 'Wireless sensors measure soil moisture in real-time. AI learns your plants\' water needs and sends alerts before they get thirsty.' },
              { icon: Sun, title: 'Light Level Optimization', description: 'Track PAR (photosynthetic active radiation) and get recommendations for plant placement or supplemental lighting.' },
              { icon: Thermometer, title: 'Climate Control', description: 'Monitor temperature and humidity. Integrates with smart thermostats and humidifiers for automated climate control.' },
              { icon: Activity, title: 'Plant Health Diagnosis', description: 'Upload photos of leaves. AI computer vision identifies pests, diseases, and nutrient deficiencies with treatment recommendations.' },
              { icon: BarChart3, title: 'Growth Analytics', description: 'Track plant growth over time with time-lapse photography and size measurements. Optimize conditions for maximum yield.' },
              { icon: Bell, title: 'Smart Notifications', description: 'Personalized alerts for watering, fertilizing, pruning, and potential issues. Never lose a plant again.' },
            ].map((feature, index) => (
              <ScrollReveal key={index} direction="up" delay={index * 0.1}>
                <motion.div whileHover={{ y: -5 }} className="p-8 bg-white/5 border border-white/10 rounded-2xl hover:border-green-500/30 transition-all duration-300">
                  <div className="w-14 h-14 bg-green-500/20 rounded-xl flex items-center justify-center mb-4"><feature.icon className="w-7 h-7 text-green-400" /></div>
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
          <ScrollReveal direction="up"><div className="text-center mb-16"><h2 className="text-4xl md:text-5xl font-serif mb-4">Use Cases</h2></div></ScrollReveal>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {[
              { title: 'Home Gardeners', description: 'Keep your houseplants thriving with automated monitoring and personalized care recommendations.', benefit: 'Save 95% of plants from neglect' },
              { title: 'Greenhouses & Nurseries', description: 'Monitor hundreds of plants simultaneously with commercial-grade sensors and centralized dashboard.', benefit: '40% reduction in crop loss' },
              { title: 'Vertical Farms', description: 'Optimize growing conditions across multi-tier systems with AI-driven environmental controls.', benefit: '30% increase in yield' },
            ].map((useCase, index) => (
              <ScrollReveal key={index} direction="up" delay={index * 0.1}>
                <div className="p-8 bg-gradient-to-br from-white/5 to-transparent border border-white/10 rounded-2xl">
                  <h3 className="text-2xl font-serif mb-4">{useCase.title}</h3>
                  <p className="text-white/70 mb-4 leading-relaxed">{useCase.description}</p>
                  <div className="flex items-center gap-2 text-green-400"><Check className="w-5 h-5" /><span className="font-medium">{useCase.benefit}</span></div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white/5">
        <div className="container-wide">
          <ScrollReveal direction="up"><div className="text-center mb-16"><h2 className="text-4xl md:text-5xl font-serif mb-4">Hardware + Software Packages</h2></div></ScrollReveal>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {[
              { name: 'Home Starter', price: '99', features: ['2 wireless soil sensors', '1 light sensor', 'Mobile app access', 'Plant disease detection', 'Up to 10 plants'], note: 'One-time hardware + $9/mo subscription' },
              { name: 'Greenhouse Pro', price: '499', features: ['10 soil sensors', '3 climate sensors', 'HD camera for diagnostics', 'Web dashboard', 'Up to 100 plants', 'Email alerts', 'Historical data'], note: 'One-time hardware + $29/mo', highlighted: true },
              { name: 'Commercial', price: 'Custom', features: ['Unlimited sensors', 'Multi-zone monitoring', 'Automated irrigation control', 'API access', 'Custom integrations', 'Dedicated support'], note: 'Contact for quote' },
            ].map((tier, index) => (
              <ScrollReveal key={index} direction="up" delay={index * 0.1}>
                <motion.div whileHover={{ y: -8 }} className={`relative p-8 rounded-2xl border ${tier.highlighted ? 'bg-gradient-to-br from-green-500/20 to-green-500/5 border-green-500' : 'bg-white/5 border-white/10'} transition-all duration-300`}>
                  {tier.highlighted && <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-green-500 text-white text-sm font-medium rounded-full">Best Value</div>}
                  <h3 className="text-2xl font-serif mb-2">{tier.name}</h3>
                  <div className="flex items-baseline gap-2 mb-2"><span className="text-5xl font-bold text-accent-gold">${tier.price}</span></div>
                  <p className="text-sm text-white/60 mb-6">{tier.note}</p>
                  <ul className="space-y-4 mb-8">{tier.features.map((feature, idx) => (<li key={idx} className="flex items-start gap-3"><Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" /><span className="text-white/80">{feature}</span></li>))}</ul>
                  <button className={`w-full py-4 rounded-full font-medium ${tier.highlighted ? 'bg-accent-gold text-black hover:bg-accent-hover' : 'bg-white/10 text-white hover:bg-white/20'}`}>Order Now</button>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-b from-green-600/10 to-black">
        <div className="container-wide">
          <ScrollReveal direction="up">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl md:text-5xl font-serif mb-6">Grow Better, Automatically</h2>
              <p className="text-xl text-white/70 mb-8">Whether you have 2 plants or 2,000, our AI ensures they thrive.</p>
              <button className="px-8 py-4 bg-accent-gold text-black rounded-full hover:bg-accent-hover transition-all duration-300 font-medium flex items-center gap-2 group mx-auto">
                Get Your Starter Kit <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  )
}
