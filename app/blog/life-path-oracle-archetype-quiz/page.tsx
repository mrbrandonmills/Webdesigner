import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Compass, Sparkles, Share2, Crown, Sword, Wand2, Heart, Star, Zap, Target, Layers } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Life Path Oracle: Discover Your Archetype & Future Paths | Brandon Mills',
  description: 'Take our 8-question life path quiz to discover your Jungian archetype (Warrior, King, Magician, Lover), life phase, strengths, and potential futures. Free AI-powered self-discovery quiz.',
  keywords: 'life path quiz, personality archetype test, Jungian archetype quiz, find your life purpose, career path quiz, self-discovery quiz, warrior king magician lover, archetype test, life purpose test, personality assessment, soul archetype, life direction quiz',
  openGraph: {
    title: 'Life Path Oracle: Discover Your Archetype & Future Paths',
    description: 'Take our 8-question quiz to reveal your archetype, strengths, and potential futures',
    images: ['/images/blog/life-path-oracle-og.jpg'],
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Life Path Oracle: Discover Your Archetype & Future Paths',
    description: 'Take our 8-question quiz to reveal your archetype, strengths, and potential futures',
  }
}

export default function LifePathOracleBlogPost() {
  return (
    <article className="min-h-screen bg-black text-white">
      {/* Hero */}
      <header className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#C9A050]/10 border border-[#C9A050]/20 rounded-full mb-8">
            <Sparkles className="w-4 h-4 text-[#C9A050]" />
            <span className="text-sm text-[#C9A050]">Self-Discovery Tool</span>
          </div>

          <h1 className="font-serif text-4xl md:text-6xl mb-6 leading-tight">
            Life Path Oracle: Discover Your Archetype & Future Paths
          </h1>

          <p className="text-xl text-gray-400 mb-8">
            An 8-question quiz that reveals your Jungian archetype, current life phase,
            core strengths, and the potential futures waiting for you.
            See your path visualized in stunning 3D.
          </p>

          <Link
            href="/oracle"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#C9A050] text-black font-medium rounded-lg hover:bg-[#D4B861] transition-colors"
          >
            <Compass className="w-5 h-5" />
            Take the Quiz Free
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </header>

      {/* Content */}
      <div className="px-6 pb-24">
        <div className="max-w-3xl mx-auto prose prose-invert prose-lg">

          <h2>What Is Life Path Oracle?</h2>

          <p>
            Life Path Oracle is a powerful self-discovery quiz that combines ancient wisdom with
            modern AI to reveal your true nature and potential. In just 8 carefully crafted questions,
            you'll discover which of the four Jungian archetypes guides your life—and which futures
            align with your deepest self.
          </p>

          <p>
            Unlike generic personality tests that put you in a box, Life Path Oracle shows you the
            <em>full spectrum</em> of who you are: your dominant archetype, your current life phase,
            your hidden strengths, areas ready for growth, and three distinct paths your future could take.
          </p>

          {/* The Four Archetypes Section */}
          <h2>The Four Archetypes</h2>

          <p>
            Based on Carl Jung's work and refined by Robert Moore's research on mature masculine
            psychology, these four archetypes represent fundamental patterns of human behavior and
            motivation. Everyone has all four within them, but one tends to lead.
          </p>

          <div className="not-prose my-8 grid gap-4">
            <div className="p-6 bg-white/5 rounded-xl border border-[#C9A050]/20">
              <div className="flex items-center gap-3 mb-3">
                <Sword className="w-6 h-6 text-red-400" />
                <h3 className="font-serif text-xl text-white m-0">The Warrior</h3>
              </div>
              <p className="text-gray-400 m-0">
                Driven by courage, discipline, and decisive action. Warriors face challenges head-on,
                protect what matters, and push through obstacles with unwavering determination.
                They bring focus, energy, and the power to execute.
              </p>
            </div>

            <div className="p-6 bg-white/5 rounded-xl border border-[#C9A050]/20">
              <div className="flex items-center gap-3 mb-3">
                <Crown className="w-6 h-6 text-[#C9A050]" />
                <h3 className="font-serif text-xl text-white m-0">The King</h3>
              </div>
              <p className="text-gray-400 m-0">
                Embodies order, blessing, and visionary leadership. Kings create structure from chaos,
                see the bigger picture, and bring out the best in others. They provide stability,
                direction, and the wisdom to guide.
              </p>
            </div>

            <div className="p-6 bg-white/5 rounded-xl border border-[#C9A050]/20">
              <div className="flex items-center gap-3 mb-3">
                <Wand2 className="w-6 h-6 text-purple-400" />
                <h3 className="font-serif text-xl text-white m-0">The Magician</h3>
              </div>
              <p className="text-gray-400 m-0">
                Masters knowledge, insight, and transformation. Magicians see hidden patterns,
                solve complex problems, and guide others through transitions. They bring wisdom,
                creativity, and the power to transform reality.
              </p>
            </div>

            <div className="p-6 bg-white/5 rounded-xl border border-[#C9A050]/20">
              <div className="flex items-center gap-3 mb-3">
                <Heart className="w-6 h-6 text-pink-400" />
                <h3 className="font-serif text-xl text-white m-0">The Lover</h3>
              </div>
              <p className="text-gray-400 m-0">
                Connected to passion, beauty, and deep feeling. Lovers experience life fully,
                create meaningful connections, and find beauty in all things. They bring empathy,
                presence, and the capacity for profound joy.
              </p>
            </div>
          </div>

          {/* Life Phases Section */}
          <h2>The Four Life Phases</h2>

          <p>
            Beyond your archetype, Life Path Oracle identifies where you are in your journey.
            Each phase has its own challenges, gifts, and opportunities:
          </p>

          <div className="not-prose my-8 grid gap-4">
            <div className="p-5 bg-white/5 rounded-lg border-l-4 border-emerald-400">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-5 h-5 text-emerald-400" />
                <h4 className="font-medium text-white m-0">Awakening</h4>
              </div>
              <p className="text-gray-400 text-sm m-0">
                The beginning of a new chapter. Old patterns are breaking down,
                new possibilities are emerging. A time of discovery and potential.
              </p>
            </div>

            <div className="p-5 bg-white/5 rounded-lg border-l-4 border-blue-400">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-5 h-5 text-blue-400" />
                <h4 className="font-medium text-white m-0">Building</h4>
              </div>
              <p className="text-gray-400 text-sm m-0">
                Active construction of your vision. Laying foundations, developing skills,
                creating structure. A time of effort and momentum.
              </p>
            </div>

            <div className="p-5 bg-white/5 rounded-lg border-l-4 border-[#C9A050]">
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-5 h-5 text-[#C9A050]" />
                <h4 className="font-medium text-white m-0">Mastering</h4>
              </div>
              <p className="text-gray-400 text-sm m-0">
                Refinement and excellence. Deep competence is emerging, influence is growing.
                A time of authority and impact.
              </p>
            </div>

            <div className="p-5 bg-white/5 rounded-lg border-l-4 border-purple-400">
              <div className="flex items-center gap-2 mb-2">
                <Layers className="w-5 h-5 text-purple-400" />
                <h4 className="font-medium text-white m-0">Transcending</h4>
              </div>
              <p className="text-gray-400 text-sm m-0">
                Beyond ego and personal achievement. Legacy, wisdom, and service to others.
                A time of meaning and contribution.
              </p>
            </div>
          </div>

          {/* How It Works */}
          <h2>How Life Path Oracle Works</h2>

          <ol>
            <li>
              <strong>Answer 8 questions</strong> - Each question reveals different aspects of
              your values, motivations, and decision-making patterns. No right or wrong answers—just
              honest reflection.
            </li>
            <li>
              <strong>AI analyzes your responses</strong> - Google's Gemini AI processes your answers
              to identify your dominant archetype, life phase, and the unique combination of traits
              that make you who you are.
            </li>
            <li>
              <strong>Your path visualizes in 3D</strong> - Watch as your archetype, strengths,
              and potential futures emerge as an interactive 3D visualization you can explore.
            </li>
            <li>
              <strong>Receive your oracle reading</strong> - Get personalized insights including
              your archetype profile, growth opportunities, three potential future paths, and
              a personal affirmation.
            </li>
          </ol>

          {/* What You'll Discover */}
          <h2>What You'll Discover</h2>

          <p>Your Life Path Oracle reading reveals:</p>

          <ul>
            <li>
              <strong>Your dominant archetype</strong> - Which of the four archetypes
              currently leads your life and decision-making
            </li>
            <li>
              <strong>Your life phase</strong> - Where you are in your journey: Awakening,
              Building, Mastering, or Transcending
            </li>
            <li>
              <strong>Core strengths</strong> - The natural gifts and capabilities you bring
              to every situation
            </li>
            <li>
              <strong>Growth opportunities</strong> - Areas where development would unlock
              your next level
            </li>
            <li>
              <strong>Three potential paths</strong> - Distinct futures that align with
              your archetype and current trajectory
            </li>
            <li>
              <strong>Personal affirmation</strong> - A statement of power designed specifically
              for your archetype and phase
            </li>
          </ul>

          {/* Sample Questions */}
          <h2>Sample Questions From the Quiz</h2>

          <p>
            Each question is designed to reveal a different facet of your archetypal nature.
            Here are a few examples:
          </p>

          <div className="not-prose my-8 space-y-4">
            <div className="p-4 bg-white/5 rounded-lg">
              <p className="text-[#C9A050] text-sm mb-2">Question Example 1:</p>
              <p className="text-white italic">
                "When facing a major decision, I tend to rely most on..."
              </p>
              <p className="text-gray-500 text-sm mt-2">
                Options include: Careful analysis, Gut instinct, Advice from trusted others,
                How it aligns with my values
              </p>
            </div>

            <div className="p-4 bg-white/5 rounded-lg">
              <p className="text-[#C9A050] text-sm mb-2">Question Example 2:</p>
              <p className="text-white italic">
                "My greatest source of satisfaction comes from..."
              </p>
              <p className="text-gray-500 text-sm mt-2">
                Options include: Achieving difficult goals, Creating harmony and beauty,
                Solving complex problems, Leading and inspiring others
              </p>
            </div>

            <div className="p-4 bg-white/5 rounded-lg">
              <p className="text-[#C9A050] text-sm mb-2">Question Example 3:</p>
              <p className="text-white italic">
                "When under stress, I typically..."
              </p>
              <p className="text-gray-500 text-sm mt-2">
                Options include: Take immediate action, Withdraw to think, Seek connection
                with others, Focus on what I can control
              </p>
            </div>
          </div>

          {/* Why Take This Quiz */}
          <h2>Why Take This Life Path Quiz?</h2>

          <p>
            Most personality tests tell you what you already know. Life Path Oracle goes deeper—revealing
            the archetypal patterns that drive your behavior, the phase of life you're navigating,
            and most importantly, the <em>potential futures</em> available to you.
          </p>

          <p>Understanding your archetype helps you:</p>

          <ul>
            <li>Make decisions aligned with your true nature</li>
            <li>Understand why certain situations energize or drain you</li>
            <li>Identify the right career paths and life directions</li>
            <li>Recognize your relationship patterns and needs</li>
            <li>See clearly what's holding you back from your potential</li>
            <li>Connect with others who share your archetype</li>
          </ul>

          {/* The Science */}
          <h2>The Psychology Behind the Archetypes</h2>

          <p>
            The four archetypes—Warrior, King, Magician, and Lover—come from Carl Jung's
            groundbreaking work on the collective unconscious, later refined by Robert Moore
            and Douglas Gillette in their research on mature masculine psychology.
          </p>

          <p>
            While originally framed in masculine terms, these archetypes are universal patterns
            present in all humans regardless of gender. They represent fundamental modes of
            being: action (Warrior), order (King), knowledge (Magician), and connection (Lover).
          </p>

          <p>
            Modern research in personality psychology and behavioral patterns continues to
            validate these archetypal structures, showing how they influence everything from
            career choices to relationship styles to decision-making approaches.
          </p>

          {/* CTA Section */}
          <div className="not-prose my-12 p-8 bg-gradient-to-br from-[#C9A050]/20 to-transparent rounded-xl text-center border border-[#C9A050]/30">
            <h3 className="font-serif text-2xl mb-4">Ready to Discover Your Archetype?</h3>
            <p className="text-gray-400 mb-6">
              Take the 8-question quiz and see your life path visualized in 3D.
              It takes about 3 minutes and it's completely free.
            </p>
            <Link
              href="/oracle"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#C9A050] text-black font-medium rounded-lg hover:bg-[#D4B861] transition-colors"
            >
              <Compass className="w-5 h-5" />
              Begin Your Oracle Reading
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          {/* What Comes After */}
          <h2>What Happens After the Quiz?</h2>

          <p>
            Once you receive your oracle reading, you can explore your results in detail,
            save them for future reference, or share them with others. Many people use their
            archetype insights as a starting point for deeper self-work through journaling,
            meditation, or coaching.
          </p>

          <p>
            You can also retake the quiz as you grow and change. Your dominant archetype may
            shift as you develop different aspects of yourself, and your life phase will
            naturally evolve as you progress on your journey.
          </p>

          <h2>Your Path Awaits</h2>

          <p>
            Every person carries within them the seeds of who they could become. Life Path Oracle
            doesn't tell you who to be—it reveals who you already are, and illuminates the paths
            that align with your deepest nature.
          </p>

          <p>
            The warrior, king, magician, and lover all live within you. The question is:
            which one is calling you forward right now?
          </p>

          {/* Final CTA */}
          <div className="not-prose my-12 p-8 bg-white/5 rounded-xl text-center">
            <h3 className="font-serif text-2xl mb-4">Find Your Life Path</h3>
            <p className="text-gray-400 mb-6">
              8 questions. 3 minutes. A lifetime of clarity.
            </p>
            <Link
              href="/oracle"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#C9A050] text-black font-medium rounded-lg hover:bg-[#D4B861] transition-colors"
            >
              <Compass className="w-5 h-5" />
              Take the Life Path Quiz
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Share */}
      <footer className="py-12 px-6 border-t border-white/10">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <p className="text-gray-500">Share this article</p>
          <div className="flex gap-4">
            <button className="p-2 hover:text-[#C9A050] transition-colors">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </footer>
    </article>
  )
}
