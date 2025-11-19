import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Moon, Sparkles, Share2, BookOpen, Home, Bird, Flame, Key, Mountain, Compass, Eye } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Dream Symbols List: 50+ Common Dream Symbols & Meanings | Brandon Mills',
  description: 'Comprehensive dream symbols list with meanings for over 50 common dream symbols. Learn what animals, objects, people, and places mean in your dreams using Jungian interpretation.',
  keywords: 'dream symbols list, dream symbol meanings, common dream symbols, dream dictionary, what do dreams mean, dream interpretation symbols, dream symbolism, jungian dream symbols, dream imagery meaning',
  openGraph: {
    title: 'Dream Symbols List: 50+ Common Dream Symbols & Meanings',
    description: 'Comprehensive guide to common dream symbols and their Jungian meanings.',
    images: ['/images/blog/dream-symbols-og.jpg'],
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dream Symbols List: 50+ Common Dream Symbols & Meanings',
    description: 'Comprehensive guide to common dream symbols and their meanings.',
  }
}

export default function DreamSymbolsListPost() {
  return (
    <article className="min-h-screen bg-black text-white">
      {/* Hero */}
      <header className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#C9A050]/10 border border-[#C9A050]/20 rounded-full mb-8">
            <Sparkles className="w-4 h-4 text-[#C9A050]" />
            <span className="text-sm text-[#C9A050]">Dream Reference Guide</span>
          </div>

          <h1 className="font-serif text-4xl md:text-6xl mb-6 leading-tight">
            Dream Symbols List: Complete Guide to Common Dream Meanings
          </h1>

          <p className="text-xl text-gray-400 mb-8">
            A comprehensive dream symbols list with Jungian interpretations. Discover what
            animals, objects, people, and places mean when they appear in your dreams.
          </p>

          <Link
            href="/dreams"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#C9A050] text-black font-medium rounded-lg hover:bg-[#D4B861] transition-colors"
          >
            <Moon className="w-5 h-5" />
            Get Your Dream Analyzed
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </header>

      {/* Content */}
      <div className="px-6 pb-24">
        <div className="max-w-3xl mx-auto prose prose-invert prose-lg">

          <h2>How to Use This Dream Symbols List</h2>

          <p>
            Before diving into this dream symbols list, remember an important principle
            of dream interpretation: your personal associations always come first. While
            these symbols have universal meanings rooted in Jungian psychology, what a
            symbol means to YOU matters most.
          </p>

          <p>
            Use this list as a starting point. If you dream of a snake and have a phobia
            of snakes, that personal meaning may override the universal symbolism. Always
            ask yourself: "What does this symbol mean to me?" Then consider the universal
            meanings below.
          </p>

          <div className="not-prose my-8 p-6 bg-[#C9A050]/10 border border-[#C9A050]/20 rounded-xl">
            <div className="flex items-center gap-3 mb-4">
              <Eye className="w-6 h-6 text-[#C9A050]" />
              <h4 className="font-serif text-xl text-white m-0">Get Personalized Analysis</h4>
            </div>
            <p className="text-gray-400 mb-4">
              For accurate interpretation that considers your specific dream context,
              our AI Dream Decoder analyzes all your dream symbols together and provides
              personalized Jungian insight.
            </p>
            <Link
              href="/dreams"
              className="inline-flex items-center gap-2 text-[#C9A050] hover:underline"
            >
              Analyze your dream <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <h2>Animals in Dreams</h2>

          <p>
            Animals in dreams often represent instincts, primal energies, and aspects of
            your nature that are less civilized or more natural.
          </p>

          <h3>Snake</h3>
          <p>
            <strong>Meaning:</strong> Transformation, healing, life force energy, danger, temptation, or wisdom.
            Snakes shed their skin and thus represent renewal and rebirth. In many traditions,
            they symbolize healing (the medical caduceus). Can also represent repressed sexuality
            or threatening unconscious content.
          </p>

          <h3>Dog</h3>
          <p>
            <strong>Meaning:</strong> Loyalty, friendship, protection, instinctual knowledge. Dogs are "man's
            best friend"—they often represent these qualities in yourself or relationships. A
            threatening dog might represent loyalty that's become possessive or protection
            that's become aggression.
          </p>

          <h3>Cat</h3>
          <p>
            <strong>Meaning:</strong> Independence, feminine power, intuition, mystery. Cats represent the
            autonomous, intuitive parts of your nature that can't be controlled. They're also
            associated with the feminine and the mysterious.
          </p>

          <h3>Bird</h3>
          <p>
            <strong>Meaning:</strong> Freedom, transcendence, spirituality, the soul. Birds fly above earthly
            concerns, representing thoughts, ideas, and spiritual aspirations. Different birds
            have specific meanings: eagles (power, vision), owls (wisdom), ravens (mystery, death).
          </p>

          <h3>Horse</h3>
          <p>
            <strong>Meaning:</strong> Power, freedom, nobility, instinctual drives. Horses represent our
            animal nature harnessed for purpose. Riding a horse suggests controlling instincts;
            a wild horse represents untamed drives.
          </p>

          <h3>Spider</h3>
          <p>
            <strong>Meaning:</strong> Creativity, fate, feminine power, entrapment. Spiders weave webs—they
            represent creative power but also entanglement. Often associated with the Great Mother
            archetype in her devouring aspect.
          </p>

          <h3>Bear</h3>
          <p>
            <strong>Meaning:</strong> Strength, introspection, protective maternal energy. Bears hibernate,
            representing going within for renewal. The mother bear's protectiveness makes them
            symbols of fierce maternal energy.
          </p>

          <h3>Wolf</h3>
          <p>
            <strong>Meaning:</strong> Instinct, intelligence, freedom, or the threatening wild. Wolves can
            represent your wild nature, your instinctual intelligence, or—as in "wolf at the door"—
            threatening forces.
          </p>

          <h2>Places and Settings</h2>

          <p>
            The settings of dreams represent states of mind, life situations, or aspects
            of your psyche.
          </p>

          <h3>House</h3>
          <p>
            <strong>Meaning:</strong> The self, your psyche, your life. Different rooms represent different
            aspects: the basement is the unconscious, the attic is higher consciousness or
            forgotten memories, bedrooms relate to intimacy, kitchens to nourishment.
          </p>

          <h3>Forest</h3>
          <p>
            <strong>Meaning:</strong> The unconscious, the unknown, a place of testing. Forests are where
            fairy tale heroes get lost and transformed. Entering a forest in dreams means
            entering unconscious territory.
          </p>

          <h3>Water (Ocean, River, Lake)</h3>
          <p>
            <strong>Meaning:</strong> Emotions, the unconscious, the source of life. The state of the water
            reflects your emotional state. Ocean = collective unconscious; river = the flow of
            life; lake = contained emotions.
          </p>

          <h3>Mountain</h3>
          <p>
            <strong>Meaning:</strong> Challenge, achievement, spiritual aspiration. Mountains must be climbed—
            they represent goals requiring effort. Also represent higher perspective and
            spiritual heights.
          </p>

          <h3>Road or Path</h3>
          <p>
            <strong>Meaning:</strong> Your life direction, your journey. A clear road suggests clarity of
            purpose; a blocked road indicates obstacles. Crossroads represent decisions.
          </p>

          <h3>School</h3>
          <p>
            <strong>Meaning:</strong> Learning, being tested, life lessons. Being back in school suggests
            you're learning something important or feeling tested in some life area.
          </p>

          <h3>Church/Temple</h3>
          <p>
            <strong>Meaning:</strong> Spirituality, seeking meaning, the sacred. Represents your relationship
            with the numinous, your spiritual life, or your deepest values.
          </p>

          <h3>Hospital</h3>
          <p>
            <strong>Meaning:</strong> Healing, attention to health, care for wounds. Something in you needs
            healing—physical, emotional, or psychological.
          </p>

          <h2>Objects and Things</h2>

          <p>
            Objects in dreams often represent psychological functions, qualities, or resources.
          </p>

          <h3>Key</h3>
          <p>
            <strong>Meaning:</strong> Access, solution, knowledge that opens doors. Finding a key means
            finding what you need to unlock a problem. Losing a key suggests lost access
            or opportunity.
          </p>

          <h3>Mirror</h3>
          <p>
            <strong>Meaning:</strong> Self-reflection, self-image, truth. Mirrors show us ourselves—how
            you appear in a mirror shows how you see yourself. A broken mirror might
            indicate a fragmented self-image.
          </p>

          <h3>Car</h3>
          <p>
            <strong>Meaning:</strong> How you move through life, your control and direction. Who's driving?
            If you are, you're in control; if someone else is, consider whether they're
            directing your life. Car problems indicate life-direction issues.
          </p>

          <h3>Money</h3>
          <p>
            <strong>Meaning:</strong> Value, power, self-worth, energy. Money represents what you value and
            your sense of self-worth. Finding money suggests discovering resources; losing
            it might indicate feeling depleted.
          </p>

          <h3>Phone</h3>
          <p>
            <strong>Meaning:</strong> Communication, connection, messages from the unconscious. Phone calls
            in dreams often represent important communications. Unable to dial or dropped
            calls suggest communication problems.
          </p>

          <h3>Fire</h3>
          <p>
            <strong>Meaning:</strong> Transformation, passion, destruction, illumination. Fire transforms
            everything it touches. It can represent passion, anger, spiritual illumination,
            or destructive forces depending on context.
          </p>

          <h3>Clothes</h3>
          <p>
            <strong>Meaning:</strong> Persona, how you present yourself, social identity. Clothes are what
            we show the world. Being naked or inappropriately dressed relates to feeling
            exposed or out of place.
          </p>

          <h3>Weapon</h3>
          <p>
            <strong>Meaning:</strong> Aggression, protection, power. Can represent your capacity for
            assertiveness or aggression. Also might indicate feeling threatened or needing
            to defend yourself.
          </p>

          <h2>People in Dreams</h2>

          <p>
            People in dreams often represent aspects of yourself, qualities, or relationships.
          </p>

          <h3>Unknown Person</h3>
          <p>
            <strong>Meaning:</strong> An unknown aspect of yourself, potential, or the stranger within.
            Same-sex strangers often represent shadow qualities; opposite-sex strangers often
            represent anima/animus.
          </p>

          <h3>Child</h3>
          <p>
            <strong>Meaning:</strong> New beginning, vulnerability, your inner child, potential. Children
            represent new growth and possibility. They can also represent your childhood
            self or vulnerabilities.
          </p>

          <h3>Parent</h3>
          <p>
            <strong>Meaning:</strong> Authority, internalized parental influence, nurturance or criticism.
            Dream parents often represent your internalized relationship with authority,
            judgment, or care.
          </p>

          <h3>Teacher/Authority Figure</h3>
          <p>
            <strong>Meaning:</strong> Wisdom, guidance, judgment, or the Wise Old Man/Woman archetype.
            Represents your relationship with authority, learning, and inner wisdom.
          </p>

          <h3>Baby</h3>
          <p>
            <strong>Meaning:</strong> New project, new phase of life, vulnerability, the Self. Babies
            represent new beginnings—something you're birthing into the world or a new
            part of yourself emerging.
          </p>

          <h3>Shadow Figure</h3>
          <p>
            <strong>Meaning:</strong> The shadow archetype—rejected parts of yourself. Often appears as a
            threatening, unknown figure chasing you. Represents what you've denied that
            needs integration.
          </p>

          <h2>Common Actions and Events</h2>

          <h3>Falling</h3>
          <p>
            <strong>Meaning:</strong> Loss of control, letting go, fear of failure, deflation of ego.
            Falling dreams are among the most common and indicate something in your life
            feels unstable or out of control.
          </p>

          <h3>Flying</h3>
          <p>
            <strong>Meaning:</strong> Freedom, transcendence, getting above problems, ego inflation.
            Flying dreams often feel exhilarating and represent rising above limitations.
          </p>

          <h3>Being Chased</h3>
          <p>
            <strong>Meaning:</strong> Avoidance, something pursuing you (often a rejected part of yourself),
            anxiety. The most common nightmare type—indicates something needs to be faced.
          </p>

          <h3>Death</h3>
          <p>
            <strong>Meaning:</strong> Transformation, ending of a phase, major change. Dream death rarely
            indicates literal death—it symbolizes something in you that's ending so something
            new can begin.
          </p>

          <h3>Being Naked in Public</h3>
          <p>
            <strong>Meaning:</strong> Vulnerability, exposure, authenticity. Suggests feeling exposed or
            that people will see through your persona. Can also represent desire for
            authenticity.
          </p>

          <h3>Taking an Exam</h3>
          <p>
            <strong>Meaning:</strong> Being tested, fear of failure, self-evaluation. Often appears when
            you're feeling judged or tested in some life area.
          </p>

          <h3>Being Lost</h3>
          <p>
            <strong>Meaning:</strong> Confusion about direction, uncertainty, searching for yourself.
            Indicates you're not sure where you're going in some area of life.
          </p>

          <h3>Missing a Train/Plane/Bus</h3>
          <p>
            <strong>Meaning:</strong> Missing an opportunity, fear of being left behind, transition anxiety.
            Transportation represents how you move through life; missing it suggests missed
            opportunities or transitions.
          </p>

          <h2>Body Parts in Dreams</h2>

          <h3>Teeth</h3>
          <p>
            <strong>Meaning:</strong> Power, self-image, communication, ability to nourish yourself.
            Teeth falling out is one of the most common dreams, relating to concerns about
            appearance, power, or communication.
          </p>

          <h3>Eyes</h3>
          <p>
            <strong>Meaning:</strong> Perception, awareness, insight, the soul. Eyes represent how you see
            things—literally your perspective and awareness.
          </p>

          <h3>Hands</h3>
          <p>
            <strong>Meaning:</strong> Capability, creativity, giving and receiving. Hands do our work in
            the world; they represent your ability to create, help, and connect.
          </p>

          <h3>Heart</h3>
          <p>
            <strong>Meaning:</strong> Emotions, love, core self, courage. The heart is the seat of feeling
            and the center of who you are.
          </p>

          <div className="not-prose my-12 p-8 bg-gradient-to-br from-[#C9A050]/20 to-transparent rounded-xl text-center border border-[#C9A050]/30">
            <h3 className="font-serif text-2xl mb-4">Get Your Dream Interpreted</h3>
            <p className="text-gray-400 mb-6">
              This dream symbols list is just the beginning. For personalized interpretation
              that considers all your dream elements together, try our AI-powered Dream Decoder.
            </p>
            <Link
              href="/dreams"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#C9A050] text-black font-medium rounded-lg hover:bg-[#D4B861] transition-colors"
            >
              <Moon className="w-5 h-5" />
              Analyze Your Dream Free
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          <h2>Using Symbols for Self-Understanding</h2>

          <p>
            This dream symbols list is a resource, not a rule book. Dream interpretation is
            an art that improves with practice. As you work with your dreams over time, you'll
            develop your own relationship with symbols and discover what they mean to you personally.
          </p>

          <p>
            The goal isn't to mechanically decode dreams but to enter into dialogue with
            your unconscious mind. These symbols are its language; learning them helps
            you understand its messages.
          </p>

          <h2>Continue Your Dream Exploration</h2>

          <ul>
            <li>
              <Link href="/dreams" className="text-[#C9A050] hover:underline">Dream Decoder</Link> -
              Get AI-powered Jungian analysis of your specific dreams
            </li>
            <li>
              <Link href="/oracle" className="text-[#C9A050] hover:underline">Life Path Oracle</Link> -
              Discover your archetypes and understand your psychological patterns
            </li>
          </ul>

          <p>
            Every dream symbol is a doorway into deeper self-knowledge. Start exploring.
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
        </div>
      </footer>
    </article>
  )
}
