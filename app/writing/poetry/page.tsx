import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Poetry | Brandon Mills',
  description: 'Verse exploring embodiment, performance, vulnerability, and the ineffable moments between thought and feeling.',
}

const poems = [
  {
    id: 'fine-lines',
    title: 'Fine Lines',
    year: '2024',
    theme: 'Language, Pollution & Critical Consciousness',
    excerpt: 'We lean on singular words with multiple meanings, but we don\'t know how to use them.',
    firstLines: [
      'Artists with the front facing persona - it\'s an illusion',
      'Like how you\'re "fine" walking Upright with that brain contusion',
      '',
      'We lean on singular words with multiple meanings,',
      'but we don\'t know how to use them...',
    ],
  },
  {
    id: 'poet-proponent',
    title: 'Poet, Proponent',
    year: '2024',
    theme: 'Systemic Oppression & Liberation',
    excerpt: 'My fists these cuffs my mouth rips this cus',
    firstLines: [
      'My fists these cuffs my mouth rips this cus',
      'Cuz cousin this is our life\'s sis y fus',
      'but don\'t fuss too much',
      '',
      'That\'s why your hands are in the man\'s',
      'pushing back their demands...',
    ],
  },
  {
    id: 'the-tourbillon',
    title: 'The Tourbillon',
    year: '2024',
    theme: 'Status & Constraint',
    excerpt: 'Did I take the rope off my neck just to put it around my wrist?',
    firstLines: [
      'Did I take the rope off my neck',
      'just to put it around my wrist?',
      'Inorganic elements',
      'mimic a strangling fig vine...',
    ],
  },
]

export default function PoetryPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero */}
      <section className="pt-32 pb-20 container-wide">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/writing"
            className="text-accent-gold hover:underline text-sm tracking-wider uppercase mb-8 inline-block"
          >
            ← Back to Writing
          </Link>

          <p className="text-accent-gold text-xs tracking-[0.3em] uppercase mb-6">
            Verse & Reflection
          </p>

          <h1 className="text-4xl md:text-6xl font-light font-serif leading-tight mb-6">
            Poetry
          </h1>

          <p className="text-xl text-white/70 font-light leading-relaxed">
            Exploring embodiment, performance, vulnerability, and the ineffable moments
            between thought and feeling. Where language meets the limits of what can be said.
          </p>
        </div>
      </section>

      {/* Poems */}
      <section className="pb-32 container-wide">
        <div className="max-w-4xl mx-auto space-y-12">
          {poems.map((poem) => (
            <Link
              key={poem.id}
              href={`/writing/poetry/${poem.id}`}
              className="group block border border-white/10 hover:border-accent-gold/50 transition-all"
            >
              <div className="p-8 md:p-12 space-y-6">
                {/* Header */}
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <span className="text-white/60">{poem.theme}</span>
                  <span className="text-white/40">·</span>
                  <span className="text-white/60">{poem.year}</span>
                </div>

                <h2 className="text-3xl md:text-4xl font-light font-serif text-white group-hover:text-accent-gold transition-colors">
                  {poem.title}
                </h2>

                {/* First Lines Preview */}
                <div className="space-y-2 text-white/70 font-serif italic text-lg">
                  {poem.firstLines.map((line, i) => (
                    <p key={i} className="leading-relaxed">
                      {line}
                    </p>
                  ))}
                </div>

                <div className="text-accent-gold text-sm tracking-wider flex items-center gap-2 group-hover:gap-4 transition-all pt-4">
                  READ POEM
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M1 8H15M15 8L8 1M15 8L8 15"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Coming Soon */}
        <div className="max-w-3xl mx-auto mt-20">
          <div className="border border-white/10 p-12 text-center space-y-6">
            <h3 className="text-2xl md:text-3xl font-light font-serif text-white">
              More Poetry Coming
            </h3>
            <p className="text-white/60">
              Additional poems exploring consciousness, embodiment, and the physical world
              currently in development. Follow @mrbrandonmills for updates.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
