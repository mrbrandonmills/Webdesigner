'use client'

import { motion } from 'framer-motion'
import ScrollReveal from '@/components/scroll-reveal'
import { ArrowRight, Check, Camera, Sparkles, Wand2, Image as ImageIcon, Palette, Zap, PlayCircle } from 'lucide-react'

export default function AIPhotoStudioPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <section className="relative pt-40 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-pink-600/10 via-black to-black"></div>
        <div className="container-wide relative z-10">
          <ScrollReveal direction="up">
            <div className="max-w-4xl mx-auto text-center">
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }} className="inline-flex items-center gap-2 px-4 py-2 bg-pink-500/20 border border-pink-500/30 rounded-full mb-6">
                <Camera className="w-4 h-4 text-pink-400" />
                <span className="text-sm tracking-wider uppercase text-pink-400">AI Photography</span>
              </motion.div>
              <h1 className="text-5xl md:text-7xl font-serif mb-6">AI Photo Studio</h1>
              <p className="text-xl md:text-2xl text-white/70 mb-8 leading-relaxed">
                Professional photo editing and generation powered by AI. From headshots to product photos, create studio-quality images in seconds.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button className="px-8 py-4 bg-accent-gold text-black rounded-full hover:bg-accent-hover transition-all duration-300 font-medium flex items-center gap-2 group">
                  Try Free <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-b from-black to-white/5">
        <div className="container-wide">
          <ScrollReveal direction="up"><div className="text-center mb-16"><h2 className="text-4xl md:text-5xl font-serif mb-4">AI-Powered Photo Magic</h2></div></ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Wand2, title: 'AI Background Removal', description: 'Remove or replace backgrounds instantly with perfect edge detection.' },
              { icon: Sparkles, title: 'Smart Enhancement', description: 'Automatically adjust lighting, color, and sharpness for perfect results.' },
              { icon: Palette, title: 'Style Transfer', description: 'Apply artistic styles from famous photographers and painters to your images.' },
            ].map((feature, index) => (
              <ScrollReveal key={index} direction="up" delay={index * 0.1}>
                <motion.div whileHover={{ y: -5 }} className="p-8 bg-white/5 border border-white/10 rounded-2xl hover:border-pink-500/30 transition-all duration-300">
                  <div className="w-14 h-14 bg-pink-500/20 rounded-xl flex items-center justify-center mb-4"><feature.icon className="w-7 h-7 text-pink-400" /></div>
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
          <ScrollReveal direction="up"><div className="text-center mb-16"><h2 className="text-4xl md:text-5xl font-serif mb-4">Simple Pricing</h2></div></ScrollReveal>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {[
              { name: 'Basic', price: '19', features: ['50 images/month', 'Background removal', 'Basic enhancements'] },
              { name: 'Pro', price: '49', features: ['500 images/month', 'All AI features', 'Priority processing', 'Commercial license'], highlighted: true },
              { name: 'Business', price: '149', features: ['Unlimited images', 'API access', 'Team collaboration', 'White-label option'] },
            ].map((tier, index) => (
              <ScrollReveal key={index} direction="up" delay={index * 0.1}>
                <motion.div whileHover={{ y: -8 }} className={`relative p-8 rounded-2xl border ${tier.highlighted ? 'bg-gradient-to-br from-pink-500/20 to-pink-500/5 border-pink-500' : 'bg-white/5 border-white/10'} transition-all duration-300`}>
                  <h3 className="text-2xl font-serif mb-2">{tier.name}</h3>
                  <div className="flex items-baseline gap-2 mb-6"><span className="text-5xl font-bold text-accent-gold">${tier.price}</span><span className="text-white/60">/month</span></div>
                  <ul className="space-y-4 mb-8">{tier.features.map((feature, idx) => (<li key={idx} className="flex items-start gap-3"><Check className="w-5 h-5 text-pink-400 flex-shrink-0 mt-0.5" /><span className="text-white/80">{feature}</span></li>))}</ul>
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
