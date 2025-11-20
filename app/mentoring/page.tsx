import { Metadata } from 'next'
import Link from 'next/link'
import { Check, Star, Zap, Crown } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Mentoring | Brandon Mills - AI Consulting, Modeling Career Coach',
  description: 'Expert mentoring in AI architecture consulting, modeling career development, creative performance, and personal transformation. Work 1-on-1 with Brandon Mills.',
  keywords: 'AI consulting, modeling career coach, personal development mentor, AI architecture consultant, executive coaching, creative mentoring',
}

interface Package {
  name: string
  sessions: number
  price: number
  perSession: number
  savings?: string
  features: string[]
  highlight?: boolean
  badge?: string
}

interface MentoringCategory {
  id: string
  title: string
  subtitle: string
  sessionDuration: string
  description: string
  includes: string[]
  packages: Package[]
}

const mentoringCategories: MentoringCategory[] = [
  {
    id: 'ai-consulting',
    title: 'AI Architecture Consultation',
    subtitle: 'Technical Strategy & Implementation',
    sessionDuration: '90 minutes',
    description: 'Senior-level consulting on AI projects, LLM integration, agent systems, and building production-ready AI applications. Drawing from hands-on experience shipping AI products.',
    includes: [
      'Architecture review and strategic recommendations',
      'LLM integration and prompt engineering',
      'Agent system design and orchestration',
      'Code review and optimization',
      'Technology stack selection',
    ],
    packages: [
      {
        name: 'Single Session',
        sessions: 1,
        price: 450,
        perSession: 450,
        features: [
          '90-minute deep-dive consultation',
          'Session recording provided',
          'Action item summary document',
          '48-hour follow-up email support',
        ],
      },
      {
        name: 'Starter Package',
        sessions: 3,
        price: 1150,
        perSession: 383,
        savings: 'Save $200',
        features: [
          'Three 90-minute sessions',
          'All session recordings',
          'Detailed action plans after each session',
          '7-day email support between sessions',
          'Resource library access',
        ],
        highlight: true,
        badge: 'Most Popular',
      },
      {
        name: 'Accelerator',
        sessions: 4,
        price: 2800,
        perSession: 700,
        savings: 'Monthly',
        features: [
          'Four 90-minute sessions per month',
          'Unlimited email support',
          'Priority scheduling',
          'All session recordings',
          'Architecture documentation review',
          'Code review between sessions',
        ],
        badge: 'Best Value',
      },
    ],
  },
  {
    id: 'modeling-career',
    title: 'Modeling Career Development',
    subtitle: 'Industry Navigation & Portfolio Strategy',
    sessionDuration: '60 minutes',
    description: 'Navigate the modeling industry with someone who has worked with Dolce & Gabbana, Armani, and GQ. Learn portfolio development, agency relationships, and professional mindset.',
    includes: [
      'Portfolio review and strategic feedback',
      'Industry insights and networking strategies',
      'Personal branding and market positioning',
      'Posing and performance techniques',
      'Career planning and goal mapping',
    ],
    packages: [
      {
        name: 'Single Session',
        sessions: 1,
        price: 250,
        perSession: 250,
        features: [
          '60-minute focused consultation',
          'Session recording provided',
          'Action item summary',
          '48-hour follow-up email support',
        ],
      },
      {
        name: 'Starter Package',
        sessions: 3,
        price: 650,
        perSession: 217,
        savings: 'Save $100',
        features: [
          'Three 60-minute sessions',
          'All session recordings',
          'Portfolio development roadmap',
          '7-day email support between sessions',
          'Industry resource guide',
        ],
        highlight: true,
        badge: 'Most Popular',
      },
      {
        name: 'Accelerator',
        sessions: 4,
        price: 1500,
        perSession: 375,
        savings: 'Monthly',
        features: [
          'Four 60-minute sessions per month',
          'Unlimited email support',
          'Priority scheduling',
          'All session recordings',
          'Ongoing portfolio feedback',
          'Agency submission guidance',
        ],
        badge: 'Career Launch',
      },
    ],
  },
  {
    id: 'creative-process',
    title: 'Creative Process & Performance',
    subtitle: 'Embodiment & Artistic Expression',
    sessionDuration: '60 minutes',
    description: 'Explore the intersection of performance, embodiment, and creative expression. Whether you are a model, actor, or artist, develop your craft with intention and authenticity.',
    includes: [
      'Embodiment practices for performers',
      'Overcoming creative blocks',
      'Building authentic creative voice',
      'Performance psychology and presence',
      'Collaboration and creative chemistry',
    ],
    packages: [
      {
        name: 'Single Session',
        sessions: 1,
        price: 225,
        perSession: 225,
        features: [
          '60-minute creative consultation',
          'Session recording provided',
          'Personalized practice exercises',
          '48-hour follow-up email support',
        ],
      },
      {
        name: 'Starter Package',
        sessions: 3,
        price: 575,
        perSession: 192,
        savings: 'Save $100',
        features: [
          'Three 60-minute sessions',
          'All session recordings',
          'Custom practice curriculum',
          '7-day email support between sessions',
          'Creative resource library access',
        ],
        highlight: true,
        badge: 'Most Popular',
      },
      {
        name: 'Accelerator',
        sessions: 4,
        price: 1400,
        perSession: 350,
        savings: 'Monthly',
        features: [
          'Four 60-minute sessions per month',
          'Unlimited email support',
          'Priority scheduling',
          'All session recordings',
          'Ongoing creative feedback',
          'Project collaboration support',
        ],
        badge: 'Deep Practice',
      },
    ],
  },
  {
    id: 'transformation',
    title: 'Personal Transformation',
    subtitle: 'Philosophy, Identity & Growth',
    sessionDuration: '90 minutes',
    description: 'Philosophy meets practice. Drawing from cognitive science, embodiment research, and lived experience to help you navigate major life transitions with clarity and purpose.',
    includes: [
      'Identity work and self-actualization',
      'Embodiment and presence practices',
      'Goal clarity and strategic planning',
      'Overcoming limiting beliefs',
      'Integration of philosophy into daily life',
    ],
    packages: [
      {
        name: 'Single Session',
        sessions: 1,
        price: 300,
        perSession: 300,
        features: [
          '90-minute deep-dive session',
          'Session recording provided',
          'Reflection exercises and journaling prompts',
          '48-hour follow-up email support',
        ],
      },
      {
        name: 'Starter Package',
        sessions: 3,
        price: 775,
        perSession: 258,
        savings: 'Save $125',
        features: [
          'Three 90-minute sessions',
          'All session recordings',
          'Personalized transformation roadmap',
          '7-day email support between sessions',
          'Philosophy and practice resource library',
        ],
        highlight: true,
        badge: 'Most Popular',
      },
      {
        name: 'Accelerator',
        sessions: 4,
        price: 1800,
        perSession: 450,
        savings: 'Monthly',
        features: [
          'Four 90-minute sessions per month',
          'Unlimited email support',
          'Priority scheduling',
          'All session recordings',
          'Ongoing reflection and accountability',
          'Emergency session availability',
        ],
        badge: 'Full Support',
      },
    ],
  },
]

function PackageIcon({ badge }: { badge?: string }) {
  if (badge === 'Most Popular') return <Star size={16} className="text-accent-gold" />
  if (badge === 'Best Value' || badge === 'Career Launch' || badge === 'Full Support' || badge === 'Deep Practice') {
    return <Crown size={16} className="text-accent-gold" />
  }
  return <Zap size={16} className="text-accent-gold" />
}

export default function MentoringPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="pt-32 pb-20 container-wide relative overflow-hidden">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] opacity-[0.06] blur-[120px] pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse, rgba(201, 160, 80, 0.4) 0%, transparent 70%)',
          }}
        />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
          <p className="text-sm tracking-[0.3em] uppercase text-accent-gold">
            1-on-1 Sessions
          </p>
          <h1 className="text-5xl md:text-7xl font-light font-serif leading-tight">
            Mentoring
          </h1>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-accent-gold to-transparent mx-auto my-8" />
          <p className="text-xl text-white/70 font-light max-w-2xl mx-auto leading-relaxed">
            Work directly with Brandon on AI architecture, modeling career development, creative process,
            or personal transformation. Limited availability each month.
          </p>
        </div>
      </section>

      {/* Value Props */}
      <section className="pb-16 container-wide">
        <div className="max-w-5xl mx-auto grid md:grid-cols-4 gap-6">
          {[
            { label: 'Session Recordings', desc: 'Review anytime' },
            { label: 'Action Summaries', desc: 'Clear next steps' },
            { label: 'Email Support', desc: 'Between sessions' },
            { label: 'Resource Library', desc: 'Curated materials' },
          ].map((item) => (
            <div key={item.label} className="text-center p-4 border border-white/10">
              <p className="text-accent-gold font-medium">{item.label}</p>
              <p className="text-sm text-white/60">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Mentoring Categories */}
      <section className="pb-32 container-wide">
        <div className="max-w-6xl mx-auto space-y-24">
          {mentoringCategories.map((category) => (
            <div key={category.id} id={category.id} className="scroll-mt-24">
              {/* Category Header */}
              <div className="text-center mb-12 space-y-4">
                <h2 className="text-4xl md:text-5xl font-light font-serif text-white">
                  {category.title}
                </h2>
                <p className="text-accent-gold tracking-wider uppercase text-sm">
                  {category.subtitle}
                </p>
                <p className="text-white/70 max-w-2xl mx-auto leading-relaxed">
                  {category.description}
                </p>
              </div>

              {/* What's Covered */}
              <div className="mb-12 max-w-2xl mx-auto">
                <p className="text-accent-gold text-sm tracking-wider uppercase mb-4 text-center">
                  What We Cover
                </p>
                <ul className="grid sm:grid-cols-2 gap-3">
                  {category.includes.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-white/70 text-sm">
                      <Check size={16} className="text-accent-gold mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Packages */}
              <div className="grid md:grid-cols-3 gap-6">
                {category.packages.map((pkg) => (
                  <div
                    key={pkg.name}
                    className={`relative border transition-all ${
                      pkg.highlight
                        ? 'border-accent-gold bg-accent-gold/5'
                        : 'border-white/10 hover:border-accent-gold/50'
                    }`}
                  >
                    {pkg.badge && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent-gold text-black text-xs font-medium px-3 py-1 flex items-center gap-1.5">
                        <PackageIcon badge={pkg.badge} />
                        {pkg.badge}
                      </div>
                    )}

                    <div className="p-6 space-y-6">
                      {/* Package Name & Price */}
                      <div className="text-center pt-2">
                        <h3 className="text-xl font-light text-white mb-4">{pkg.name}</h3>
                        <div className="space-y-1">
                          <p className="text-4xl font-light font-serif text-white">
                            ${pkg.price.toLocaleString()}
                          </p>
                          {pkg.sessions > 1 && pkg.savings !== 'Monthly' && (
                            <p className="text-sm text-white/60">
                              ${pkg.perSession}/session
                            </p>
                          )}
                          {pkg.savings && (
                            <p className="text-sm text-accent-gold font-medium">
                              {pkg.savings}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Features */}
                      <ul className="space-y-3">
                        {pkg.features.map((feature, i) => (
                          <li key={i} className="flex items-start gap-3 text-sm text-white/70">
                            <Check size={14} className="text-accent-gold mt-0.5 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>

                      {/* CTA */}
                      <Link
                        href={`/mentoring/book/${category.id}?package=${pkg.name.toLowerCase().replace(' ', '-')}`}
                        className={`block text-center px-6 py-3 font-medium tracking-wider transition-colors ${
                          pkg.highlight
                            ? 'bg-accent-gold text-black hover:bg-accent-hover'
                            : 'border border-accent-gold text-accent-gold hover:bg-accent-gold hover:text-black'
                        }`}
                      >
                        {pkg.savings === 'Monthly' ? 'START ACCELERATOR' : 'BOOK NOW'}
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="pb-32 container-wide">
        <div className="max-w-4xl mx-auto border-t border-white/10 pt-20">
          <h2 className="text-3xl font-light font-serif text-center mb-16">How It Works</h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-accent-gold/10 border border-accent-gold/30 flex items-center justify-center mx-auto text-2xl font-light text-accent-gold">
                1
              </div>
              <h3 className="text-xl font-light text-white">Choose Your Package</h3>
              <p className="text-white/60">
                Select the mentoring category and package that fits your needs and budget.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-accent-gold/10 border border-accent-gold/30 flex items-center justify-center mx-auto text-2xl font-light text-accent-gold">
                2
              </div>
              <h3 className="text-xl font-light text-white">Prepare & Connect</h3>
              <p className="text-white/60">
                Complete the prep form to maximize our time. We meet via Zoom or in-person (LA area).
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-accent-gold/10 border border-accent-gold/30 flex items-center justify-center mx-auto text-2xl font-light text-accent-gold">
                3
              </div>
              <h3 className="text-xl font-light text-white">Take Action</h3>
              <p className="text-white/60">
                Receive your session recording, action summary, and ongoing support to implement changes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="pb-32 container-wide">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-light font-serif text-center mb-12">Common Questions</h2>

          <div className="space-y-6">
            <div className="border border-white/10 p-6">
              <h3 className="text-lg font-medium text-white mb-2">What happens in the first session?</h3>
              <p className="text-white/60">
                We start with understanding your goals and current situation. Whether it is AI architecture,
                modeling career, or personal growth, the first session establishes a clear direction and
                immediate action steps.
              </p>
            </div>

            <div className="border border-white/10 p-6">
              <h3 className="text-lg font-medium text-white mb-2">How do packages work?</h3>
              <p className="text-white/60">
                Starter packages include 3 sessions to be scheduled within 60 days. Accelerator packages
                are monthly retainers with 4 sessions per month plus unlimited email support.
              </p>
            </div>

            <div className="border border-white/10 p-6">
              <h3 className="text-lg font-medium text-white mb-2">Can I switch between categories?</h3>
              <p className="text-white/60">
                Package sessions are flexible. If you purchase a Starter Package for AI consulting but
                want to discuss personal transformation in one session, we can accommodate that.
              </p>
            </div>

            <div className="border border-white/10 p-6">
              <h3 className="text-lg font-medium text-white mb-2">What is your cancellation policy?</h3>
              <p className="text-white/60">
                Sessions can be rescheduled with 24-hour notice. Packages do not expire for 90 days
                after purchase.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="pb-32 container-wide">
        <div className="max-w-3xl mx-auto border border-white/10 p-12 text-center space-y-6">
          <h3 className="text-2xl font-light font-serif text-white">
            Ready to Get Started?
          </h3>
          <p className="text-white/60">
            Limited spots available each month. Book a single session to experience the work,
            or commit to accelerated growth with a package.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="inline-block px-10 py-4 border border-accent-gold text-accent-gold hover:bg-accent-gold hover:text-black transition-all"
            >
              ASK A QUESTION
            </Link>
            <Link
              href="#ai-consulting"
              className="inline-block px-10 py-4 bg-accent-gold text-black hover:bg-accent-hover transition-all"
            >
              VIEW PACKAGES
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
