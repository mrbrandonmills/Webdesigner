import { Metadata } from 'next'
import Navigation from '@/components/navigation'
import { ArrowLeft, ArrowRight, Clock, Calendar, Sword, Shield, Target, Flame, Crown, Brain, Heart, Zap } from 'lucide-react'
import Link from 'next/link'
import { EbookCTA } from '@/components/ebook-cta'


export const metadata: Metadata = {
  title: 'Discover Your Warrior Archetype: The Psychology of Inner Strength | Brandon Mills',
  description: 'Take the Warrior Archetype Quiz to discover which of the 8 warrior archetypes matches your personality. Based on Jungian psychology and ancient warrior traditions.',
  keywords: ['warrior archetype', 'personality quiz', 'jungian archetypes', 'stoic warrior', 'strategist archetype', 'guardian protector', 'shadow warrior', 'berserker', 'ronin', 'samurai', 'spartan', 'self-discovery', 'psychology test', 'personal development'],
  openGraph: {
    title: 'Discover Your Warrior Archetype: The Psychology of Inner Strength',
    description: 'Take the Warrior Archetype Quiz to discover which of the 8 warrior archetypes matches your personality.',
    type: 'article',
    publishedTime: '2024-11-18',
    authors: ['Brandon Mills'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Discover Your Warrior Archetype: The Psychology of Inner Strength',
    description: 'Take the Warrior Archetype Quiz to discover which of the 8 warrior archetypes matches your personality.',
  }
}

const archetypes = [
  {
    name: 'The Stoic',
    icon: Shield,
    description: 'Masters of emotional discipline and mental fortitude. Like Marcus Aurelius, they lead through unwavering composure.',
    traits: ['Emotional control', 'Mental resilience', 'Philosophical depth']
  },
  {
    name: 'The Strategist',
    icon: Target,
    description: 'Patient planners who see the battlefield clearly. They win wars before the first blow is struck.',
    traits: ['Tactical thinking', 'Long-term planning', 'Pattern recognition']
  },
  {
    name: 'The Guardian',
    icon: Heart,
    description: 'Protectors who draw strength from those they defend. Their power comes from love, not aggression.',
    traits: ['Protective instinct', 'Selfless courage', 'Community focus']
  },
  {
    name: 'The Berserker',
    icon: Flame,
    description: 'Raw power and primal energy unleashed. They overwhelm obstacles with sheer force of will.',
    traits: ['Explosive power', 'Fearlessness', 'Unstoppable momentum']
  },
  {
    name: 'The Shadow',
    icon: Zap,
    description: 'Masters of subtlety and unconventional tactics. They strike where least expected.',
    traits: ['Adaptability', 'Stealth', 'Creative problem-solving']
  },
  {
    name: 'The Ronin',
    icon: Sword,
    description: 'Independent warriors who forge their own path. Bound by personal code, not external authority.',
    traits: ['Independence', 'Self-reliance', 'Personal honor']
  },
  {
    name: 'The Sage',
    icon: Brain,
    description: 'Warriors of wisdom who fight with knowledge. They understand that the mind is the ultimate weapon.',
    traits: ['Deep knowledge', 'Teaching others', 'Spiritual insight']
  },
  {
    name: 'The Champion',
    icon: Crown,
    description: 'Leaders who inspire others to greatness. They elevate everyone around them.',
    traits: ['Charisma', 'Inspiration', 'Team leadership']
  }
]

export default function WarriorArchetypeBlogPost() {
  return (
    <main className="min-h-screen bg-black text-white">
      <Navigation />

      <article className="pt-32 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          {/* Back Link */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-white/60 hover:text-accent-gold transition-colors mb-8"
          >
            <ArrowLeft size={16} />
            <span>Back to Blog</span>
          </Link>

          {/* Header */}
          <header className="mb-12">
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-3 py-1 bg-accent-gold/20 border border-accent-gold/40 text-accent-gold text-xs tracking-wider uppercase">
                Psychology
              </span>
              <span className="px-3 py-1 bg-purple-500/20 border border-purple-500/40 text-purple-300 text-xs tracking-wider uppercase">
                Interactive
              </span>
              <span className="px-3 py-1 bg-blue-500/20 border border-blue-500/40 text-blue-300 text-xs tracking-wider uppercase">
                Self-Discovery
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-serif mb-6 leading-tight">
              Discover Your <span className="text-accent-gold">Warrior Archetype</span>: The Psychology of Inner Strength
            </h1>

            <div className="flex items-center gap-6 text-sm text-white/60">
              <div className="flex items-center gap-2">
                <Calendar size={14} />
                <time dateTime="2024-11-18">November 18, 2024</time>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={14} />
                <span>8 min read</span>
              </div>
            </div>
          </header>

          {/* Featured CTA */}
          <div className="mb-12 p-8 bg-gradient-to-br from-accent-gold/20 to-accent-gold/5 border border-accent-gold/40">
            <h2 className="text-2xl font-serif mb-4">Take the Quiz Now</h2>
            <p className="text-white/70 mb-6">
              Discover which of the 8 warrior archetypes matches your personality in this interactive assessment based on Jungian psychology.
            </p>
            <Link
              href="/quiz/warrior-archetype"
              className="inline-flex items-center gap-2 px-6 py-3 bg-accent-gold text-black font-medium tracking-wider uppercase hover:bg-accent-hover transition-colors"
            >
              Start the Quiz
              <ArrowRight size={16} />
            </Link>
          </div>

          {/* Content */}
          <div className="prose prose-invert prose-lg max-w-none">
            <p className="text-white/80 leading-relaxed mb-6">
              Throughout history, warriors have embodied different aspects of human strength and resilience. From the disciplined Spartans to the philosophical Samurai, each warrior tradition developed unique approaches to combat, leadership, and personal development. But these archetypes aren&apos;t just historical curiosities—they represent fundamental patterns in human psychology that we all carry within us.
            </p>

            <h2 className="text-2xl font-serif text-accent-gold mt-12 mb-6">The Psychology Behind Warrior Archetypes</h2>

            <p className="text-white/80 leading-relaxed mb-6">
              Carl Jung&apos;s work on archetypes revealed that certain patterns of behavior and personality exist across all cultures and time periods. The warrior archetype is one of the most fundamental—it represents our capacity to face challenges, protect what we value, and push beyond our perceived limits.
            </p>

            <p className="text-white/80 leading-relaxed mb-6">
              Understanding your dominant warrior archetype can provide profound insights into your natural strengths, potential blind spots, and the types of challenges you&apos;re best equipped to handle. It&apos;s not about glorifying violence—it&apos;s about understanding the psychological resources you have for facing life&apos;s battles, whether they&apos;re in the boardroom, the gym, or your own mind.
            </p>

            <h2 className="text-2xl font-serif text-accent-gold mt-12 mb-6">The 8 Warrior Archetypes</h2>

            <p className="text-white/80 leading-relaxed mb-6">
              Our quiz identifies eight distinct warrior archetypes, each with their own strengths, challenges, and paths to growth:
            </p>
          </div>

          {/* Archetype Grid */}
          <div className="grid md:grid-cols-2 gap-4 my-12">
            {archetypes.map((archetype) => (
              <div key={archetype.name} className="p-6 bg-white/5 border border-white/10 hover:border-accent-gold/30 transition-colors">
                <div className="flex items-center gap-3 mb-4">
                  <archetype.icon className="text-accent-gold" size={24} />
                  <h3 className="text-lg font-serif">{archetype.name}</h3>
                </div>
                <p className="text-sm text-white/60 mb-4">{archetype.description}</p>
                <div className="flex flex-wrap gap-2">
                  {archetype.traits.map((trait) => (
                    <span key={trait} className="px-2 py-1 bg-white/5 text-white/40 text-xs">
                      {trait}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="prose prose-invert prose-lg max-w-none">
            <h2 className="text-2xl font-serif text-accent-gold mt-12 mb-6">Why This Matters for Personal Development</h2>

            <p className="text-white/80 leading-relaxed mb-6">
              Knowing your warrior archetype isn&apos;t just an interesting personality insight—it&apos;s a practical tool for growth. Once you understand your natural warrior style, you can:
            </p>

            <ul className="space-y-3 mb-6">
              <li className="text-white/80 leading-relaxed">
                <strong className="text-accent-gold">Leverage your strengths:</strong> Stop trying to be someone you&apos;re not. Double down on what makes you powerful.
              </li>
              <li className="text-white/80 leading-relaxed">
                <strong className="text-accent-gold">Address your blind spots:</strong> Every archetype has weaknesses. Awareness is the first step to addressing them.
              </li>
              <li className="text-white/80 leading-relaxed">
                <strong className="text-accent-gold">Choose the right battles:</strong> Understanding your style helps you pick challenges that play to your strengths.
              </li>
              <li className="text-white/80 leading-relaxed">
                <strong className="text-accent-gold">Build better teams:</strong> Recognize complementary archetypes in others and create powerful combinations.
              </li>
            </ul>

            <h2 className="text-2xl font-serif text-accent-gold mt-12 mb-6">The Ancient Wisdom, Modern Application</h2>

            <p className="text-white/80 leading-relaxed mb-6">
              The Stoics of ancient Rome, the Samurai of feudal Japan, the knights of medieval Europe—they all understood that being a warrior was about more than fighting. It was about cultivating specific virtues: discipline, courage, wisdom, and service.
            </p>

            <p className="text-white/80 leading-relaxed mb-6">
              In our modern world, we may not face physical battles, but we face challenges that require the same inner resources. The entrepreneur launching a startup needs the Strategist&apos;s patience. The parent protecting their family needs the Guardian&apos;s courage. The artist pursuing their vision needs the Ronin&apos;s independence.
            </p>

            <p className="text-white/80 leading-relaxed mb-6">
              Understanding which warrior archetype resonates most deeply with you can help you access these ancient wisdoms and apply them to contemporary challenges.
            </p>
          </div>

          {/* Final CTA */}
          <div className="mt-12 p-8 bg-gradient-to-br from-accent-gold/20 to-accent-gold/5 border border-accent-gold/40 text-center">
            <h2 className="text-2xl font-serif mb-4">Ready to Discover Your Archetype?</h2>
            <p className="text-white/70 mb-6">
              Take the free 3-minute assessment and uncover the warrior within.
            </p>
            <Link
              href="/quiz/warrior-archetype"
              className="inline-flex items-center gap-2 px-8 py-4 bg-accent-gold text-black font-medium tracking-wider uppercase hover:bg-accent-hover transition-colors"
            >
              Take the Quiz
              <ArrowRight size={16} />
            </Link>
          </div>

          {/* Footer */}
          <footer className="mt-16 pt-8 border-t border-white/10">
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-white/5 text-white/40 text-xs">#warrior-archetype</span>
              <span className="px-2 py-1 bg-white/5 text-white/40 text-xs">#psychology</span>
              <span className="px-2 py-1 bg-white/5 text-white/40 text-xs">#jungian</span>
              <span className="px-2 py-1 bg-white/5 text-white/40 text-xs">#personality-quiz</span>
              <span className="px-2 py-1 bg-white/5 text-white/40 text-xs">#self-discovery</span>
              <span className="px-2 py-1 bg-white/5 text-white/40 text-xs">#personal-development</span>
            </div>
          </footer>
        
      <EbookCTA variant="footer" source="discover-your-warrior-archetype" />
</div>
      </article>
    </main>
  )
}
