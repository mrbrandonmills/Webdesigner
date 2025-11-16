'use client'

import { motion } from 'framer-motion'
import ScrollReveal from '@/components/scroll-reveal'
import { ArrowRight, Check, Cpu, MessageCircle, Calendar, Mail, FileText, Zap, Globe, Shield, PlayCircle, Sparkles } from 'lucide-react'

export default function JarvisPersonalAssistantPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <section className="relative pt-40 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-600/10 via-black to-black"></div>
        <div className="container-wide relative z-10">
          <ScrollReveal direction="up">
            <div className="max-w-4xl mx-auto text-center">
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }} className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/20 border border-cyan-500/30 rounded-full mb-6">
                <Cpu className="w-4 h-4 text-cyan-400" />
                <span className="text-sm tracking-wider uppercase text-cyan-400">AI Assistant Platform</span>
              </motion.div>
              <h1 className="text-5xl md:text-7xl font-serif mb-6">Jarvis Personal Assistant Pro Suite</h1>
              <p className="text-xl md:text-2xl text-white/70 mb-8 leading-relaxed">
                Your complete AI-powered productivity ecosystem. Email management, calendar coordination, task automation, research assistance—all powered by advanced AI that learns your preferences.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button className="px-8 py-4 bg-accent-gold text-black rounded-full hover:bg-accent-hover transition-all duration-300 font-medium flex items-center gap-2 group">
                  Start Free Trial <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="px-8 py-4 bg-white/5 border border-white/10 text-white rounded-full hover:bg-white/10 hover:border-cyan-500/30 transition-all duration-300 font-medium flex items-center gap-2">
                  <PlayCircle className="w-5 h-5" />
                  See It in Action
                </button>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-b from-black to-white/5">
        <div className="container-wide">
          <ScrollReveal direction="up"><div className="text-center mb-16"><h2 className="text-4xl md:text-5xl font-serif mb-4">Your Personal AI Ecosystem</h2></div></ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Mail, title: 'Intelligent Email Management', description: 'AI triages your inbox, drafts responses, schedules follow-ups, and flags priority messages. Reduce email time by 70%.' },
              { icon: Calendar, title: 'Smart Scheduling', description: 'Coordinates meetings across timezones, finds optimal times, sends invites, and handles rescheduling automatically.' },
              { icon: FileText, title: 'Document Processing', description: 'Summarizes PDFs, extracts action items from meeting notes, generates reports, and organizes your knowledge base.' },
              { icon: MessageCircle, title: 'Voice & Chat Interface', description: 'Interact via voice, text, or chat across devices. Natural conversation with context awareness across all channels.' },
              { icon: Zap, title: 'Task Automation', description: 'Automates repetitive workflows, data entry, file management, and cross-platform integrations with 1,000+ apps.' },
              { icon: Globe, title: 'Research Assistant', description: 'Web research, fact-checking, competitive analysis, and briefing document generation on any topic.' },
            ].map((feature, index) => (
              <ScrollReveal key={index} direction="up" delay={index * 0.1}>
                <motion.div whileHover={{ y: -5 }} className="p-8 bg-white/5 border border-white/10 rounded-2xl hover:border-cyan-500/30 transition-all duration-300">
                  <div className="w-14 h-14 bg-cyan-500/20 rounded-xl flex items-center justify-center mb-4"><feature.icon className="w-7 h-7 text-cyan-400" /></div>
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
          <ScrollReveal direction="up"><div className="text-center mb-16"><h2 className="text-4xl md:text-5xl font-serif mb-4">Integrations</h2><p className="text-xl text-white/60">Connects with your entire productivity stack</p></div></ScrollReveal>
          <ScrollReveal direction="up">
            <div className="max-w-4xl mx-auto grid grid-cols-3 md:grid-cols-5 gap-6">
              {['Gmail', 'Outlook', 'Slack', 'Zoom', 'Google Calendar', 'Notion', 'Salesforce', 'Trello', 'Asana', 'Dropbox'].map((app, index) => (
                <motion.div key={index} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3, delay: index * 0.05 }} viewport={{ once: true }} className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-center hover:border-cyan-500/30 transition-all duration-300">
                  <span className="text-sm text-white/80">{app}</span>
                </motion.div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="py-20 bg-white/5">
        <div className="container-wide">
          <ScrollReveal direction="up"><div className="text-center mb-16"><h2 className="text-4xl md:text-5xl font-serif mb-4">Choose Your Plan</h2></div></ScrollReveal>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {[
              { name: 'Personal', price: '59', features: ['1 user', 'Email & calendar management', '100 automations/month', 'Basic integrations', '10GB storage', 'Standard support'] },
              { name: 'Professional', price: '149', features: ['1 user', 'Everything in Personal', 'Unlimited automations', 'Advanced integrations', '100GB storage', 'Voice interface', 'Priority support', 'Custom workflows'], highlighted: true },
              { name: 'Team', price: '399', features: ['Up to 10 users', 'Everything in Professional', 'Team collaboration features', 'Admin dashboard', '1TB shared storage', 'API access', 'Dedicated support', 'Custom AI training'] },
            ].map((tier, index) => (
              <ScrollReveal key={index} direction="up" delay={index * 0.1}>
                <motion.div whileHover={{ y: -8 }} className={`relative p-8 rounded-2xl border ${tier.highlighted ? 'bg-gradient-to-br from-cyan-500/20 to-cyan-500/5 border-cyan-500' : 'bg-white/5 border-white/10'} transition-all duration-300`}>
                  {tier.highlighted && <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-cyan-500 text-white text-sm font-medium rounded-full">Most Popular</div>}
                  <h3 className="text-2xl font-serif mb-2">{tier.name}</h3>
                  <div className="flex items-baseline gap-2 mb-6"><span className="text-5xl font-bold text-accent-gold">${tier.price}</span><span className="text-white/60">/month</span></div>
                  <ul className="space-y-4 mb-8">{tier.features.map((feature, idx) => (<li key={idx} className="flex items-start gap-3"><Check className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" /><span className="text-white/80">{feature}</span></li>))}</ul>
                  <button className={`w-full py-4 rounded-full font-medium ${tier.highlighted ? 'bg-accent-gold text-black hover:bg-accent-hover' : 'bg-white/10 text-white hover:bg-white/20'}`}>Get Started</button>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-b from-cyan-600/10 to-black">
        <div className="container-wide">
          <ScrollReveal direction="up">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl md:text-5xl font-serif mb-6">Reclaim 20+ Hours Per Week</h2>
              <p className="text-xl text-white/70 mb-8">Join 50,000+ professionals using Jarvis to automate their workday.</p>
              <button className="px-8 py-4 bg-accent-gold text-black rounded-full hover:bg-accent-hover transition-all duration-300 font-medium flex items-center gap-2 group mx-auto">
                Start Your Free Trial <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  )
}
