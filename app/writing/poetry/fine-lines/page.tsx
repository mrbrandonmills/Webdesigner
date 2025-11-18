'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { AudioReader } from '@/components/audio-reader'

export default function FineLinesPage() {
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [])

  const textContent = `
Fine Lines - By Brandon Mills

Artists with the front facing persona - it's an illusion
Like how you're "fine" walking Upright with that brain contusion

We lean on singular words with multiple meanings,
but we don't know how to use them.

I'm fine!
Girl, yes you are!
Fine I'll pay the fine

Half of those are abusive

We never get the full picture lost in our confusion
Race, gender, sexuality, people excluded
You fight - your black he's white they're Asian
This shit, much more deep rooted

Another word to work out
Our minds, our bodies, our communities are polluted

minds run Proprietary software
What sells? Not photovoltaic cells
Biology tells a different story about the binary
But without an education, you're more worried about a job at the refinery
Not the fucking finery

One more time with that one again,
Seemed the ostentatious are always winning,
but you vote them into office - complain after they win

Iceberg baby this shit runs deeper
Deeper then the Mariana trench
Pass the last stop on that ghost train haze creeper
We're in Dante's realm now
Yeah, you can call this a heater

Do you mean hot as in heat
or hot as-in spicy?

I mean without gun control I'm talking about under your seat

Calm down just breathe

Why didn't you teach me that when I was five years old
Before the anxiety grabbed me by the neck and stabbed me in the chest
Daily, weekly, monthly did I say by the minute
by the fraction of a second and every quantum moment
that lies within it

Hmm listen kid

You can beat the drum but the battlefields are different
Watch out for codependence learn to be independent

A mind that can contemplate
a mind that thinks outside of what it's told is useful

Grab a plane ticket, go spend a ruble
Then a rupee, then a yen then a franc,
Then come tell me if that Frank was from France
or from Liechtenstein

And then you can tell me which one you like better
cause you will have seen the world
and your eyes are more open
and brother you can enter
  `.trim()

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <section className="pt-32 pb-12 container-wide">
        <div className="max-w-3xl mx-auto">
          <Link
            href="/writing/poetry"
            className="text-accent-gold hover:underline text-sm tracking-wider uppercase inline-block"
          >
            ← Back to Poetry
          </Link>
        </div>
      </section>

      {/* Poem Header */}
      <section className="pb-16 container-wide">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <p className="text-accent-gold text-xs tracking-[0.3em] uppercase">
            2025
          </p>

          <h1 className="text-4xl md:text-5xl font-light font-serif leading-tight">
            Fine Lines
          </h1>

          <div className="w-24 h-px bg-gradient-to-r from-transparent via-accent-gold to-transparent mx-auto my-8" />

          <p className="text-white/60 text-sm tracking-wider uppercase">
            On Language, Pollution, & Critical Consciousness
          </p>
        </div>
      </section>

      {/* Audio Reader */}
      <section className="pb-12 container-wide">
        <div className="max-w-3xl mx-auto">
          <AudioReader
            contentId="fine-lines"
            title="Fine Lines"
            textContent={textContent}
            voicePreference="male"
            showVoiceSelector={true}
            contentType="poem"
          />
        </div>
      </section>

      {/* Poem Content */}
      <section className="pb-20 container-wide">
        <div className="max-w-2xl mx-auto">
          <div className="border-t border-b border-white/10 py-16 space-y-6">
            <div className="space-y-4 text-white/90 text-lg md:text-xl leading-relaxed">
              <p>Artists with the front facing persona - it's an illusion</p>
              <p>Like how you're "fine" walking Upright with that brain contusion</p>

              <div className="py-3" />

              <p>We lean on singular words with multiple meanings,</p>
              <p>but we don't know how to use them.</p>

              <div className="py-3" />

              <p className="italic">I'm fine!</p>
              <p className="italic">Girl, yes you are!</p>
              <p className="italic">Fine I'll pay the fine</p>

              <div className="py-3" />

              <p>Half of those are abusive</p>

              <div className="py-3" />

              <p>We never get the full picture lost in our confusion</p>
              <p>Race, gender, sexuality, people excluded</p>
              <p>You fight - your black he's white they're Asian</p>
              <p>This shit, much more deep rooted</p>

              <div className="py-3" />

              <p>Another word to work out</p>
              <p>Our minds, our bodies, our communities are <span className="text-accent-gold">polluted</span></p>

              <div className="py-6" />
              <div className="w-12 h-px bg-accent-gold/30 mx-auto" />
              <div className="py-6" />

              <p>minds run Proprietary software</p>
              <p>What sells? Not photovoltaic cells</p>
              <p>Biology tells a different story about the binary</p>
              <p>But without an education, you're more worried about a job at the refinery</p>
              <p>Not the fucking <span className="italic">finery</span></p>

              <div className="py-3" />

              <p>One more time with that one again,</p>
              <p>Seemed the ostentatious are always winning,</p>
              <p>but you vote them into office - complain after they win</p>

              <div className="py-6" />
              <div className="w-12 h-px bg-accent-gold/30 mx-auto" />
              <div className="py-6" />

              <p className="text-accent-gold">Iceberg baby this shit runs deeper</p>
              <p>Deeper then the Mariana trench</p>
              <p>Pass the last stop on that ghost train haze creeper</p>
              <p className="italic">We're in Dante's realm now</p>
              <p>Yeah, you can call this a heater</p>

              <div className="py-3" />

              <p>Do you mean hot as in heat</p>
              <p>or hot as-in spicy?</p>

              <div className="py-3" />

              <p>I mean without gun control I'm talking about under your seat</p>

              <div className="py-6" />
              <div className="w-12 h-px bg-accent-gold/30 mx-auto" />
              <div className="py-6" />

              <p className="italic">Calm down just breathe</p>

              <div className="py-3" />

              <p>Why didn't you teach me that when I was five years old</p>
              <p>Before the anxiety grabbed me by the neck and stabbed me in the chest</p>
              <p>Daily, weekly, monthly did I say by the minute</p>
              <p>by the fraction of a second and every quantum moment</p>
              <p>that lies within it</p>

              <div className="py-6" />
              <div className="w-12 h-px bg-accent-gold/30 mx-auto" />
              <div className="py-6" />

              <p className="text-accent-gold text-xl">Hmm listen kid</p>

              <div className="py-3" />

              <p>You can beat the drum but the battlefields are different</p>
              <p>Watch out for codependence learn to be independent</p>

              <div className="py-3" />

              <p>A mind that can contemplate</p>
              <p>a mind that thinks outside of what it's told is useful</p>

              <div className="py-3" />

              <p>Grab a plane ticket, go spend a ruble</p>
              <p>Then a rupee, then a yen then a franc,</p>
              <p>Then come tell me if that <span className="italic">Frank</span> was from France</p>
              <p>or from Liechtenstein</p>

              <div className="py-3" />

              <p>And then you can tell me which one you like better</p>
              <p>cause you will have seen the world</p>
              <p>and your eyes are more open</p>
              <p>and brother you can <span className="text-accent-gold font-light text-2xl">enter</span></p>
            </div>
          </div>
        </div>
      </section>

      {/* Context/Reflection */}
      <section className="pb-32 container-wide">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white/5 border border-white/10 p-8 md:p-12 space-y-6">
            <h3 className="text-accent-gold text-sm tracking-wider uppercase">
              Reflection
            </h3>

            <p className="text-white/70 leading-relaxed">
              This poem operates at the intersection of linguistics, systemic critique, and consciousness expansion.
              The opening salvo—examining how the word "fine" carries three distinct meanings (emotional state,
              physical attractiveness, monetary penalty)—becomes a lens for understanding how language itself can be
              a site of violence. "Half of those are abusive" indicts not just the uses of the word, but the systems
              that weaponize ambiguity.
            </p>

            <p className="text-white/70 leading-relaxed">
              The poem's architecture mirrors its content: rapid shifts between topics (mental pollution, economic inequality,
              political complicity, gun violence, anxiety disorders) create a vertigo that reflects our fragmented attention
              in late capitalism. "Proprietary software" running in minds suggests consciousness itself has been colonized,
              programmed to value profit over sustainability (photovoltaic cells vs. refinery jobs), luxury over substance
              (finery vs. refinery).
            </p>

            <p className="text-white/70 leading-relaxed">
              The Dante reference is crucial—we've descended beyond the Mariana Trench (Earth's deepest point) into
              the nine circles of hell. The triple meaning of "heater" (temperature/spice/gun) compresses three forms
              of violence into a single word, demonstrating how language can simultaneously reveal and conceal brutality.
            </p>

            <p className="text-white/70 leading-relaxed">
              The poem's emotional core emerges in the anxiety passage: "Why didn't you teach me that when I was five /
              Year old / Before the anxiety grabbed me by the neck." This personal wound becomes universal—the failure
              to teach children emotional regulation, to prepare them for systems designed to destabilize.
            </p>

            <p className="text-white/70 leading-relaxed">
              The final movement shifts from critique to prescription. An elder voice enters: "Hmm listen kid."
              The solution isn't revolution but <span className="italic">expansion</span>—of geography (travel through
              currencies: ruble, rupee, yen, franc), of perspective, of critical thinking. The wordplay on "franc"
              (Swiss currency) and "Frank" (a name) asks: which Frank? The one from France or Liechtenstein? This seemingly
              simple question demands geopolitical literacy, cultural awareness, direct experience.
            </p>

            <p className="text-white/70 leading-relaxed">
              The poem concludes with "enter"—once your eyes are open, you gain admission to a different level of consciousness,
              community, possibility. This is the password. Not passive consumption but active engagement with complexity.
              The entrance requires work: contemplation, independence, travel, critical thinking. Only then can you
              see beyond binaries, beyond proprietary programming, beyond the fine lines that constrain us.
            </p>
          </div>

          {/* Navigation */}
          <div className="mt-12 pt-12 border-t border-white/10 flex flex-wrap items-center justify-between gap-6">
            <Link
              href="/writing/poetry"
              className="text-accent-gold hover:underline text-sm tracking-wider uppercase"
            >
              ← All Poetry
            </Link>

            <Link
              href="/writing"
              className="text-accent-gold hover:underline text-sm tracking-wider uppercase"
            >
              Back to Writing →
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
