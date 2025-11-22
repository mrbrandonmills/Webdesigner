import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Compass, Sparkles, Share2, Crown, Sword, Wand2, Heart, Moon, Eye, Target } from 'lucide-react'
import { EbookCTA } from '@/components/ebook-cta'


export const metadata: Metadata = {
  title: 'Jungian Archetypes Test: Discover Your Dominant Archetype | Brandon Mills',
  description: 'Take our free Jungian archetypes test to discover which of the 12 archetypes dominates your personality. Based on Carl Jung\'s psychology, learn your archetype and how it shapes your life.',
  keywords: 'jungian archetypes test, archetype quiz, personality archetype test, carl jung archetypes test, 12 archetypes test, what is my archetype, jungian personality test, archetype assessment, shadow archetype test, free archetype test',
  openGraph: {
    title: 'Jungian Archetypes Test: Discover Your Dominant Archetype',
    description: 'Take our free test to discover which Jungian archetype dominates your personality and shapes your life.',
    images: ['/images/blog/archetypes-test-og.jpg'],
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jungian Archetypes Test: Discover Your Dominant Archetype',
    description: 'Take our free test to discover your Jungian archetype.',
  }
}

export default function JungianArchetypesTestPost() {
  return (
    <article className="min-h-screen bg-black text-white">
      {/* Hero */}
      <header className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#C9A050]/10 border border-[#C9A050]/20 rounded-full mb-8">
            <Sparkles className="w-4 h-4 text-[#C9A050]" />
            <span className="text-sm text-[#C9A050]">Personality Assessment</span>
          </div>

          <h1 className="font-serif text-4xl md:text-6xl mb-6 leading-tight">
            Jungian Archetypes Test: Discover Your Dominant Archetype
          </h1>

          <p className="text-xl text-gray-400 mb-8">
            Which of the universal archetypes drives your behavior, shapes your relationships,
            and defines your life path? Take our free test based on Carl Jung's revolutionary
            psychology and discover your true archetypal nature.
          </p>

          <Link
            href="/oracle"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#C9A050] text-black font-medium rounded-lg hover:bg-[#D4B861] transition-colors"
          >
            <Compass className="w-5 h-5" />
            Take the Free Archetype Test
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </header>

      {/* Content */}
      <div className="px-6 pb-24">
        <div className="max-w-3xl mx-auto prose prose-invert prose-lg">

          <h2>What Are Jungian Archetypes?</h2>

          <p>
            Carl Jung, the pioneering Swiss psychiatrist, discovered that beneath our individual
            personalities lie universal patterns of behavior and motivation he called archetypes.
            These aren't stereotypes you choose—they're fundamental psychological structures that
            exist in what Jung termed the "collective unconscious," shared by all humans across
            cultures and throughout history.
          </p>

          <p>
            Taking a Jungian archetypes test reveals which of these universal patterns dominates
            your psyche. Your dominant archetype influences:
          </p>

          <ul>
            <li>How you make decisions</li>
            <li>What motivates and drives you</li>
            <li>How you relate to others</li>
            <li>What careers and life paths suit you</li>
            <li>Your strengths and growth edges</li>
            <li>How you respond to challenge and opportunity</li>
          </ul>

          <p>
            Unlike personality tests that describe behavior, a Jungian archetypes test reveals
            the deep psychological structures that generate that behavior. It shows you not
            just who you are, but why you are that way.
          </p>

          <h2>The Major Jungian Archetypes</h2>

          <p>
            While Jung identified many archetypes, certain ones appear most prominently in
            individual personalities. Here are the key archetypes our test identifies:
          </p>

          <div className="not-prose my-8 grid gap-4">
            <div className="p-6 bg-white/5 rounded-xl border border-[#C9A050]/20">
              <div className="flex items-center gap-3 mb-3">
                <Sword className="w-6 h-6 text-red-400" />
                <h3 className="font-serif text-xl text-white m-0">The Warrior</h3>
              </div>
              <p className="text-gray-400 m-0">
                <strong>Core Drive:</strong> Courage and decisive action<br />
                <strong>Strength:</strong> Discipline, determination, protection<br />
                <strong>Challenge:</strong> Learning when not to fight<br />
                <strong>Fear:</strong> Weakness, powerlessness<br />
                Warriors face challenges head-on, push through obstacles, and protect what matters.
                They bring focus, energy, and the power to execute.
              </p>
            </div>

            <div className="p-6 bg-white/5 rounded-xl border border-[#C9A050]/20">
              <div className="flex items-center gap-3 mb-3">
                <Crown className="w-6 h-6 text-[#C9A050]" />
                <h3 className="font-serif text-xl text-white m-0">The King/Queen</h3>
              </div>
              <p className="text-gray-400 m-0">
                <strong>Core Drive:</strong> Order, vision, and leadership<br />
                <strong>Strength:</strong> Strategic thinking, seeing the big picture, inspiring others<br />
                <strong>Challenge:</strong> Avoiding tyranny and detachment<br />
                <strong>Fear:</strong> Chaos, loss of control<br />
                Kings create structure from chaos, provide direction, and bring out the best in others.
                They lead with wisdom and authority.
              </p>
            </div>

            <div className="p-6 bg-white/5 rounded-xl border border-[#C9A050]/20">
              <div className="flex items-center gap-3 mb-3">
                <Wand2 className="w-6 h-6 text-purple-400" />
                <h3 className="font-serif text-xl text-white m-0">The Magician</h3>
              </div>
              <p className="text-gray-400 m-0">
                <strong>Core Drive:</strong> Knowledge and transformation<br />
                <strong>Strength:</strong> Insight, problem-solving, guiding transitions<br />
                <strong>Challenge:</strong> Using power ethically<br />
                <strong>Fear:</strong> Unintended consequences<br />
                Magicians see hidden patterns, master knowledge, and guide transformation.
                They bring wisdom, creativity, and the power to change reality.
              </p>
            </div>

            <div className="p-6 bg-white/5 rounded-xl border border-[#C9A050]/20">
              <div className="flex items-center gap-3 mb-3">
                <Heart className="w-6 h-6 text-pink-400" />
                <h3 className="font-serif text-xl text-white m-0">The Lover</h3>
              </div>
              <p className="text-gray-400 m-0">
                <strong>Core Drive:</strong> Passion, beauty, and connection<br />
                <strong>Strength:</strong> Deep feeling, presence, creating meaningful bonds<br />
                <strong>Challenge:</strong> Maintaining identity in relationship<br />
                <strong>Fear:</strong> Isolation, loss of love<br />
                Lovers experience life fully, find beauty everywhere, and create profound connections.
                They bring empathy, presence, and the capacity for joy.
              </p>
            </div>
          </div>

          <h2>Additional Archetypes You May Identify With</h2>

          <p>
            Beyond the four foundational archetypes, other patterns may resonate with you:
          </p>

          <ul>
            <li>
              <strong>The Hero</strong> - Driven to prove worth through courageous action and
              triumph over adversity. The Hero seeks to make the world better through effort.
            </li>
            <li>
              <strong>The Sage</strong> - Motivated by truth and understanding. The Sage uses
              intelligence and analysis to comprehend the world.
            </li>
            <li>
              <strong>The Caregiver</strong> - Driven to protect and care for others. The
              Caregiver finds meaning through selfless service.
            </li>
            <li>
              <strong>The Creator</strong> - Motivated to build something of enduring value.
              The Creator expresses vision through creation.
            </li>
            <li>
              <strong>The Explorer</strong> - Driven to discover and experience. The Explorer
              seeks freedom and finds meaning through journey.
            </li>
            <li>
              <strong>The Rebel</strong> - Motivated to disrupt what isn't working. The Rebel
              challenges the status quo and breaks rules that deserve breaking.
            </li>
            <li>
              <strong>The Innocent</strong> - Driven by faith and optimism. The Innocent seeks
              happiness and finds good in everything.
            </li>
            <li>
              <strong>The Jester</strong> - Motivated by joy and living in the moment. The Jester
              brings lightness and reminds us not to take life too seriously.
            </li>
          </ul>

          <h2>Why Take a Jungian Archetypes Test?</h2>

          <p>
            Understanding your dominant archetype offers profound practical benefits:
          </p>

          <h3>Career and Life Direction</h3>
          <p>
            Your archetype reveals what kinds of work will feel meaningful and what will feel
            empty. A Warrior thrives in competitive, challenging environments; a Caregiver
            needs work that helps others; a Creator needs to build. Knowing your archetype
            helps you choose paths aligned with your nature.
          </p>

          <h3>Relationship Understanding</h3>
          <p>
            Archetypes shape how you relate to others. Understanding your pattern—and
            recognizing others'—dramatically improves communication and reduces conflict.
            You stop expecting others to be like you and start appreciating their different
            archetypal nature.
          </p>

          <h3>Personal Development</h3>
          <p>
            Each archetype has characteristic strengths and shadows. Knowing your archetype
            reveals both your gifts and your growth edges. The Warrior's strength can become
            aggression; the Lover's sensitivity can become dependency. Self-knowledge enables
            conscious development.
          </p>

          <h3>Decision Making</h3>
          <p>
            When you understand your archetypal motivations, you can make decisions aligned
            with your true nature rather than what you think you "should" want. You stop
            fighting yourself and start working with your innate patterns.
          </p>

          <h3>Self-Acceptance</h3>
          <p>
            Many people spend years fighting their natural archetype, trying to be something
            they're not. Recognizing your archetypal nature can bring profound self-acceptance—
            you're not broken, you're just a particular pattern of human possibility.
          </p>

          <div className="not-prose my-8 p-6 bg-[#C9A050]/10 border border-[#C9A050]/20 rounded-xl">
            <div className="flex items-center gap-3 mb-4">
              <Target className="w-6 h-6 text-[#C9A050]" />
              <h4 className="font-serif text-xl text-white m-0">Take the Test Now</h4>
            </div>
            <p className="text-gray-400 mb-4">
              Our Life Path Oracle uses an 8-question assessment to identify your dominant
              archetype, current life phase, strengths, and potential futures. Free and takes
              only 3 minutes.
            </p>
            <Link
              href="/oracle"
              className="inline-flex items-center gap-2 text-[#C9A050] hover:underline"
            >
              Discover your archetype <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <h2>How Jungian Archetype Tests Work</h2>

          <p>
            A good Jungian archetypes test doesn't ask what you think about yourself—it presents
            situations and observes your responses. Your choices reveal unconscious patterns
            that might not match your conscious self-image.
          </p>

          <p>
            Our test asks about:
          </p>

          <ul>
            <li>How you make decisions under pressure</li>
            <li>What gives you the greatest satisfaction</li>
            <li>How you respond to conflict</li>
            <li>What you fear most</li>
            <li>What role you naturally take in groups</li>
            <li>What you would do with unlimited resources</li>
            <li>How you define success</li>
            <li>What you need to feel fulfilled</li>
          </ul>

          <p>
            These questions reveal your archetypal nature more accurately than asking "which
            archetype do you think you are?" Your patterns show in your choices.
          </p>

          <h2>The Shadow Side of Archetypes</h2>

          <p>
            Every archetype has a shadow—a darker aspect that emerges when the archetype is
            undeveloped, stressed, or pushed to extremes. Understanding your archetype's
            shadow is essential for growth:
          </p>

          <ul>
            <li>
              <strong>Warrior shadow:</strong> Sadistic aggression, cruelty, or masochistic
              self-destruction
            </li>
            <li>
              <strong>King/Queen shadow:</strong> Tyranny, exploitation, or weakness and
              abdication
            </li>
            <li>
              <strong>Magician shadow:</strong> Manipulation, trickery, or denying others
              knowledge
            </li>
            <li>
              <strong>Lover shadow:</strong> Addiction, obsession, or cold disconnection
            </li>
            <li>
              <strong>Hero shadow:</strong> Reckless disregard for others, or paralyzing
              fear of failure
            </li>
            <li>
              <strong>Sage shadow:</strong> Judgmental dismissal, or impotent paralysis
              through endless analysis
            </li>
          </ul>

          <p>
            Recognizing when you're in shadow helps you return to the archetype's mature
            expression. This is the real work of archetypal psychology.
          </p>

          <h2>Can Your Archetype Change?</h2>

          <p>
            Your dominant archetype typically remains stable throughout life—it's a deep
            structure, not a preference. However, several things do change:
          </p>

          <ul>
            <li>
              <strong>Expression</strong> - How your archetype manifests develops and matures.
              A 25-year-old Warrior expresses differently than a 55-year-old Warrior.
            </li>
            <li>
              <strong>Integration</strong> - Over time, you can integrate other archetypes.
              A Warrior who develops their Lover becomes more complete.
            </li>
            <li>
              <strong>Dominance</strong> - Sometimes a secondary archetype becomes more
              prominent in certain life phases, though the core remains.
            </li>
            <li>
              <strong>Shadow work</strong> - As you integrate your shadow, your archetype
              expresses more maturely.
            </li>
          </ul>

          <h2>Using Your Archetype Results</h2>

          <p>
            Once you know your dominant archetype, here's how to use that knowledge:
          </p>

          <h3>For Career</h3>
          <p>
            Seek work environments that let your archetype thrive. Warriors need challenge;
            Magicians need complex problems; Lovers need meaningful human connection; Kings
            need to lead and create order. Misalignment between archetype and career is a
            common cause of dissatisfaction.
          </p>

          <h3>For Relationships</h3>
          <p>
            Understand that your partner may have a different archetype with different needs.
            A Warrior partner needs respect; a Lover partner needs presence and attention;
            a Magician partner needs intellectual stimulation. Different doesn't mean wrong.
          </p>

          <h3>For Growth</h3>
          <p>
            Identify which aspects of your archetype need development. Are you expressing the
            mature or shadow version? Which complementary archetypes could you integrate?
            Growth means becoming a more complete version of your archetypal pattern.
          </p>

          <h3>For Self-Acceptance</h3>
          <p>
            Stop trying to be an archetype you're not. If you're a Magician, stop feeling bad
            that you're not a natural leader like a King. Your gifts are different. Accept
            and develop what you actually are.
          </p>

          <h2>The Science Behind Archetype Tests</h2>

          <p>
            Jungian archetypes have been validated by a century of clinical observation and,
            more recently, by research in personality psychology and behavioral patterns.
            While archetypes aren't measured with the same methods as Big Five personality
            traits, they describe real patterns that reliably predict behavior, preferences,
            and life outcomes.
          </p>

          <p>
            Modern archetype tests combine Jung's original framework with contemporary
            psychological research, creating assessments that are both theoretically grounded
            and practically useful.
          </p>

          <div className="not-prose my-12 p-8 bg-gradient-to-br from-[#C9A050]/20 to-transparent rounded-xl text-center border border-[#C9A050]/30">
            <h3 className="font-serif text-2xl mb-4">Discover Your Archetype</h3>
            <p className="text-gray-400 mb-6">
              Take our free 8-question Jungian archetypes test. See your results
              visualized in 3D and receive personalized insights about your
              strengths, growth edges, and potential futures.
            </p>
            <Link
              href="/oracle"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#C9A050] text-black font-medium rounded-lg hover:bg-[#D4B861] transition-colors"
            >
              <Compass className="w-5 h-5" />
              Take the Free Test
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          <h2>Continue Your Exploration</h2>

          <p>
            Understanding your archetype is just the beginning. For deeper self-knowledge,
            explore how your archetype appears in your dreams and unconscious:
          </p>

          <ul>
            <li>
              <Link href="/oracle" className="text-[#C9A050] hover:underline">Life Path Oracle</Link> -
              Take the full archetype assessment with 3D visualization
            </li>
            <li>
              <Link href="/dreams" className="text-[#C9A050] hover:underline">Dream Decoder</Link> -
              See how archetypes appear in your dreams with AI analysis
            </li>
          </ul>

          <p>
            Your archetype is the pattern you were born to live. Discover it and live it fully.
          </p>
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
        
      <EbookCTA variant="footer" source="jungian-archetypes-test" />
</div>
      </footer>
    </article>
  )
}
