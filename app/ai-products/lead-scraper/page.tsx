'use client'

import { motion } from 'framer-motion'
import ScrollReveal from '@/components/scroll-reveal'
import {
  ArrowRight,
  Check,
  Search,
  Database,
  Filter,
  Zap,
  Globe,
  Shield,
  TrendingUp,
  Users,
  Mail,
  Phone,
  Building,
  Target,
  BarChart3,
  PlayCircle,
  Lock,
} from 'lucide-react'
import Link from 'next/link'

export default function LeadScraperPage() {
  const features = [
    {
      icon: Search,
      title: 'Intelligent Lead Discovery',
      description:
        'AI-powered search algorithms that find high-quality leads across LinkedIn, company databases, industry directories, and public records.',
    },
    {
      icon: Filter,
      title: 'Advanced Filtering & Enrichment',
      description:
        'Filter by industry, company size, job title, location, and 50+ other criteria. Automatically enrich data with emails, phone numbers, and company insights.',
    },
    {
      icon: Database,
      title: 'Multi-Source Data Aggregation',
      description:
        'Combines data from 200+ sources including social media, business registries, news sites, and proprietary databases for complete lead profiles.',
    },
    {
      icon: Shield,
      title: 'GDPR & Privacy Compliant',
      description:
        'Built-in compliance tools ensure all data collection follows GDPR, CCPA, and international privacy regulations. Automatic consent tracking.',
    },
    {
      icon: Zap,
      title: 'Real-Time Verification',
      description:
        'Email and phone verification ensures 95%+ accuracy rates. Bounce detection and data freshness scoring for optimal deliverability.',
    },
    {
      icon: BarChart3,
      title: 'CRM Integration',
      description:
        'One-click export to Salesforce, HubSpot, Pipedrive, and 20+ CRMs. API access for custom integrations and automated workflows.',
    },
  ]

  const useCases = [
    {
      title: 'B2B Sales Teams',
      description:
        'Build targeted prospect lists in minutes instead of hours. Find decision-makers at companies matching your ideal customer profile.',
      impact: '10x faster prospecting',
    },
    {
      title: 'Marketing Agencies',
      description:
        'Generate qualified lead lists for client campaigns. Export segmented audiences for email, social, and outreach campaigns.',
      impact: '65% higher conversion rates',
    },
    {
      title: 'Recruiters & HR',
      description:
        'Source passive candidates with specific skills, experience levels, and locations. Build talent pools for future hiring needs.',
      impact: '3x more qualified candidates',
    },
    {
      title: 'Business Development',
      description:
        'Identify partnership opportunities, investors, and strategic contacts. Map organizational hierarchies and decision-making structures.',
      impact: '47% increase in partnerships',
    },
  ]

  const pricingTiers = [
    {
      id: 'starter',
      name: 'Starter',
      price: '79',
      period: 'per month',
      description: 'For solo entrepreneurs and small teams',
      features: [
        '1,000 leads per month',
        'Basic filters (10 criteria)',
        'Email verification included',
        'CSV export',
        'Email support',
        '30-day data retention',
      ],
      cta: 'Start Free Trial',
      highlighted: false,
    },
    {
      id: 'professional',
      name: 'Professional',
      price: '249',
      period: 'per month',
      description: 'For growing sales and marketing teams',
      features: [
        '10,000 leads per month',
        'Advanced filters (50+ criteria)',
        'Email & phone verification',
        'CRM integrations',
        'Team collaboration (5 users)',
        'Priority support',
        'API access (1,000 calls/month)',
        '1-year data retention',
        'Custom lead scoring',
      ],
      cta: 'Get Started',
      highlighted: true,
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 'Custom',
      period: 'contact for pricing',
      description: 'For large organizations with high-volume needs',
      features: [
        'Unlimited leads',
        'Unlimited team members',
        'Custom data sources',
        'Dedicated account manager',
        'White-label option',
        'Advanced API (unlimited)',
        'Custom compliance workflows',
        'SLA guarantee',
        'On-premise deployment option',
      ],
      cta: 'Contact Sales',
      highlighted: false,
    },
  ]

  const dataSources = [
    'LinkedIn',
    'Company Websites',
    'Business Registries',
    'Industry Directories',
    'Social Media Platforms',
    'News & Press Releases',
    'Public Records',
    'Trade Publications',
    'Conference Attendee Lists',
    'Patent Databases',
    'Financial Filings',
    'Job Postings',
  ]

  const technicalHighlights = [
    {
      title: 'Machine Learning Matching',
      description: 'Fuzzy matching and entity resolution for accurate data deduplication',
    },
    {
      title: 'Distributed Crawling',
      description: 'Cloud-based infrastructure processes millions of pages per day',
    },
    {
      title: 'Real-Time Enrichment API',
      description: 'Sub-second response times for on-demand lead enrichment',
    },
    {
      title: 'Smart Rate Limiting',
      description: 'Adaptive throttling to respect source website policies',
    },
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative pt-40 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-green-600/10 via-black to-black"></div>

        <div className="container-wide relative z-10">
          <ScrollReveal direction="up">
            <div className="max-w-4xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-full mb-6"
              >
                <Target className="w-4 h-4 text-green-400" />
                <span className="text-sm tracking-wider uppercase text-green-400">
                  Lead Generation AI
                </span>
              </motion.div>

              <h1 className="text-5xl md:text-7xl font-serif mb-6 bg-gradient-to-r from-white via-green-200 to-white/60 bg-clip-text text-transparent">
                Lead Scraper
              </h1>

              <p className="text-xl md:text-2xl text-white/70 mb-8 leading-relaxed">
                Automatically discover and enrich B2B leads at scale. AI-powered data extraction from
                200+ sources with built-in verification and compliance.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button className="px-8 py-4 bg-accent-gold text-black rounded-full hover:bg-accent-hover transition-all duration-300 font-medium flex items-center gap-2 group">
                  Start 14-Day Free Trial
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="px-8 py-4 bg-white/5 border border-white/10 text-white rounded-full hover:bg-white/10 hover:border-green-500/30 transition-all duration-300 font-medium flex items-center gap-2">
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
                  <Lock className="w-4 h-4 text-accent-gold" />
                  <span>GDPR Compliant</span>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>

        <ScrollReveal direction="up" delay={0.2}>
          <div className="container-wide mt-16 relative z-10">
            <div className="max-w-6xl mx-auto">
              <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                <div className="aspect-video bg-gradient-to-br from-green-600/20 via-white/5 to-cyan-500/20 flex items-center justify-center">
                  <div className="text-center p-8">
                    <Database className="w-20 h-20 text-white/40 mx-auto mb-4" />
                    <p className="text-white/60 text-lg">Lead Discovery Dashboard</p>
                    <p className="text-white/40 text-sm mt-2">
                      Filter, enrich, and export thousands of qualified leads in seconds
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* Features */}
      <section className="py-20 bg-gradient-to-b from-black to-white/5">
        <div className="container-wide">
          <ScrollReveal direction="up">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-serif mb-4">
                Everything You Need to Generate Leads
              </h2>
              <p className="text-xl text-white/60 max-w-2xl mx-auto">
                Comprehensive lead generation platform with advanced filtering, enrichment, and
                compliance built-in.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <ScrollReveal key={index} direction="up" delay={index * 0.1}>
                <motion.div
                  whileHover={{ y: -5 }}
                  className="p-8 bg-white/5 border border-white/10 rounded-2xl hover:border-green-500/30 transition-all duration-300"
                >
                  <div className="w-14 h-14 bg-green-500/20 rounded-xl flex items-center justify-center mb-4">
                    <feature.icon className="w-7 h-7 text-green-400" />
                  </div>
                  <h3 className="text-xl font-serif mb-3">{feature.title}</h3>
                  <p className="text-white/60 leading-relaxed">{feature.description}</p>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Data Sources */}
      <section className="py-20">
        <div className="container-wide">
          <ScrollReveal direction="up">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-serif mb-4">200+ Data Sources</h2>
              <p className="text-xl text-white/60 max-w-2xl mx-auto">
                Comprehensive coverage across professional networks, business databases, and public
                records.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="up">
            <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {dataSources.map((source, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  viewport={{ once: true }}
                  className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-center hover:border-green-500/30 transition-all duration-300"
                >
                  <span className="text-sm text-white/80">{source}</span>
                </motion.div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20 bg-white/5">
        <div className="container-wide">
          <ScrollReveal direction="up">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-serif mb-4">Built for Growth Teams</h2>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {useCases.map((useCase, index) => (
              <ScrollReveal key={index} direction={index % 2 === 0 ? 'left' : 'right'}>
                <div className="p-8 bg-gradient-to-br from-white/5 to-transparent border border-white/10 rounded-2xl">
                  <h3 className="text-2xl font-serif mb-4">{useCase.title}</h3>
                  <p className="text-white/70 mb-4 leading-relaxed">{useCase.description}</p>
                  <div className="flex items-center gap-2 text-green-400">
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
      <section className="py-20">
        <div className="container-wide">
          <ScrollReveal direction="up">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-serif mb-4">Choose Your Plan</h2>
              <p className="text-xl text-white/60 max-w-2xl mx-auto">
                Flexible pricing that scales with your lead generation needs.
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
                      ? 'bg-gradient-to-br from-green-500/20 to-green-500/5 border-green-500'
                      : 'bg-white/5 border-white/10'
                  } transition-all duration-300`}
                >
                  {tier.highlighted && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-green-500 text-white text-sm font-medium rounded-full">
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
                        <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
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
      <section className="py-20 bg-gradient-to-b from-white/5 to-black">
        <div className="container-wide">
          <ScrollReveal direction="up">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-serif mb-4">Enterprise-Grade Technology</h2>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {technicalHighlights.map((tech, index) => (
              <ScrollReveal key={index} direction="up" delay={index * 0.1}>
                <div className="p-6 bg-gradient-to-br from-green-500/10 to-transparent border border-green-500/30 rounded-xl">
                  <h3 className="text-lg font-medium mb-2 text-green-400">{tech.title}</h3>
                  <p className="text-sm text-white/70">{tech.description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-b from-green-600/10 to-black">
        <div className="container-wide">
          <ScrollReveal direction="up">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl md:text-5xl font-serif mb-6">
                Stop Manual Prospecting. Start Growing.
              </h2>
              <p className="text-xl text-white/70 mb-8">
                Join thousands of sales teams generating qualified leads on autopilot.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button className="px-8 py-4 bg-accent-gold text-black rounded-full hover:bg-accent-hover transition-all duration-300 font-medium flex items-center gap-2 group">
                  Start Your Free Trial
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <Link href="/contact">
                  <button className="px-8 py-4 bg-white/5 border border-white/10 text-white rounded-full hover:bg-white/10 hover:border-green-500/30 transition-all duration-300 font-medium">
                    Talk to Sales
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
