import { Metadata } from 'next'
import Link from 'next/link'
import { Check } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Mentoring & Coaching | Brandon Mills',
  description: '1-on-1 mentoring sessions on modeling, creative development, AI engineering, and personal transformation. Book your session.',
}

const sessions = [
  {
    id: 'modeling-career',
    title: 'Modeling Career Development',
    duration: '60 minutes',
    price: 150,
    description: 'Navigate the modeling industry with someone who\'s worked with Dolce & Gabbana, Armani, and GQ. Learn portfolio development, agency relationships, and professional mindset.',
    includes: [
      'Portfolio review and feedback',
      'Industry insights and networking strategies',
      'Personal branding guidance',
      'Posing and performance techniques',
      'Career planning and goal setting',
    ],
  },
  {
    id: 'creative-process',
    title: 'Creative Process & Performance',
    duration: '60 minutes',
    price: 150,
    description: 'Explore the intersection of performance, embodiment, and creative expression. Whether you\'re a model, actor, or artist, develop your craft with intention.',
    includes: [
      'Embodiment practices for performers',
      'Overcoming creative blocks',
      'Building authentic creative voice',
      'Performance psychology',
      'Collaboration and creative chemistry',
    ],
  },
  {
    id: 'ai-engineering',
    title: 'AI Engineering Consultation',
    duration: '90 minutes',
    price: 250,
    description: 'Technical consulting on AI projects, LLM integration, prompt engineering, and building AI-powered applications.',
    includes: [
      'Architecture review and recommendations',
      'LLM integration strategies',
      'Prompt engineering best practices',
      'Agent system design',
      'Code review and optimization',
    ],
  },
  {
    id: 'life-transformation',
    title: 'Personal Transformation Coaching',
    duration: '90 minutes',
    price: 200,
    description: 'Philosophy meets practice. Drawing from cognitive science, embodiment research, and lived experience to help you navigate major life transitions.',
    includes: [
      'Identity work and self-actualization',
      'Embodiment and presence practices',
      'Goal clarity and strategic planning',
      'Overcoming limiting beliefs',
      'Integration of philosophy into daily life',
    ],
  },
]

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
            Mentoring & Coaching
          </h1>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-accent-gold to-transparent mx-auto my-8" />
          <p className="text-xl text-white/70 font-light max-w-2xl mx-auto leading-relaxed">
            Work directly with Brandon on modeling career development, creative process, AI engineering,
            or personal transformation. Limited availability.
          </p>
        </div>
      </section>

      {/* Sessions */}
      <section className="pb-32 container-wide">
        <div className="max-w-5xl mx-auto space-y-8">
          {sessions.map((session) => (
            <div key={session.id} className="border border-white/10 hover:border-accent-gold/50 transition-all">
              <div className="p-8 md:p-12">
                <div className="grid md:grid-cols-3 gap-8">
                  {/* Left: Info */}
                  <div className="md:col-span-2 space-y-6">
                    <div>
                      <h2 className="text-3xl font-light font-serif text-white mb-2">
                        {session.title}
                      </h2>
                      <div className="flex items-center gap-4 text-sm text-white/60">
                        <span>{session.duration}</span>
                        <span>·</span>
                        <span className="text-accent-gold">${session.price}</span>
                      </div>
                    </div>

                    <p className="text-white/70 leading-relaxed">
                      {session.description}
                    </p>

                    <div>
                      <p className="text-accent-gold text-sm tracking-wider uppercase mb-3">
                        What's Included
                      </p>
                      <ul className="space-y-2">
                        {session.includes.map((item, i) => (
                          <li key={i} className="flex items-start gap-3 text-white/70">
                            <Check size={20} className="text-accent-gold mt-0.5 flex-shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Right: CTA */}
                  <div className="flex flex-col justify-between">
                    <div className="space-y-4">
                      <div className="border-t border-white/10 pt-6 md:border-t-0 md:pt-0">
                        <p className="text-4xl font-light font-serif text-white mb-2">
                          ${session.price}
                        </p>
                        <p className="text-white/60 text-sm">{session.duration}</p>
                      </div>
                    </div>

                    <Link
                      href={`/mentoring/book/${session.id}`}
                      className="block text-center px-8 py-4 bg-accent-gold text-black font-medium tracking-wider hover:bg-accent-hover transition-colors mt-6"
                    >
                      BOOK SESSION
                    </Link>
                  </div>
                </div>
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
              <h3 className="text-xl font-light text-white">Book Your Session</h3>
              <p className="text-white/60">
                Choose the session type that fits your needs and select a time that works for you.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-accent-gold/10 border border-accent-gold/30 flex items-center justify-center mx-auto text-2xl font-light text-accent-gold">
                2
              </div>
              <h3 className="text-xl font-light text-white">Prepare & Connect</h3>
              <p className="text-white/60">
                You'll receive a prep form to maximize our time together. We'll meet via Zoom or in-person (LA area).
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-accent-gold/10 border border-accent-gold/30 flex items-center justify-center mx-auto text-2xl font-light text-accent-gold">
                3
              </div>
              <h3 className="text-xl font-light text-white">Take Action</h3>
              <p className="text-white/60">
                Walk away with clear next steps, resources, and ongoing support via email.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Placeholder */}
      <section className="pb-32 container-wide">
        <div className="max-w-3xl mx-auto border border-white/10 p-12 text-center space-y-6">
          <h3 className="text-2xl font-light font-serif text-white">
            Ready to Work Together?
          </h3>
          <p className="text-white/60">
            Limited spots available each month. Book your session now to secure your time.
          </p>
          <Link
            href="#sessions"
            className="inline-block px-10 py-4 border border-accent-gold text-accent-gold hover:bg-accent-gold hover:text-black transition-all"
          >
            VIEW SESSIONS
          </Link>
        </div>
      </section>
    </div>
  )
}
