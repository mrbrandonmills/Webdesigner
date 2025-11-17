'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { AudioReader } from '@/components/audio-reader'

export default function PoetProponentPage() {
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [])

  const textContent = `
Poet, Proponent - By Brandon Mills

My fists these cuffs my mouth rips this cus
Cuz cousin this is our life's sis y fus
but don't fuss too much

That's why your hands are in the man's
pushing back their demands - their scripture, their doctrine.
They're fucking high commands

Yo, I'll take it to my man's 125th St., Harlem barbershop
the agora still stands

Politican finger lickin' we got a thing for this diction -
but what we face is restriction -
covalent bonds in the hood,
and we share atoms with addiction

Psychoanalytic methodologies come from survival - just living
Not college curated

We have phd's before prison

They say 10,000 hours to Master
But Master - that time in your debt
steals the song from the laughter -

I'd rather put that time into plaster
Like a Robert Lugo mash up
and find myself

A poet,
a proponent of my life
from here on after
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
            Poet, Proponent
          </h1>

          <div className="w-24 h-px bg-gradient-to-r from-transparent via-accent-gold to-transparent mx-auto my-8" />

          <p className="text-white/60 text-sm tracking-wider uppercase">
            On Systemic Oppression & Liberation Through Art
          </p>
        </div>
      </section>

      {/* Audio Reader */}
      <section className="pb-12 container-wide">
        <div className="max-w-3xl mx-auto">
          <AudioReader
            contentId="poet-proponent"
            title="Poet, Proponent"
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
              <p>My fists these cuffs my mouth rips this cus</p>
              <p>Cuz cousin this is our life's sis y fus</p>
              <p>but don't fuss too much</p>

              <div className="py-4" />

              <p>That's why your hands are in the man's</p>
              <p>pushing back their demands - their scripture, their doctrine.</p>
              <p className="italic">They're fucking high commands</p>

              <div className="py-4" />

              <p>Yo, I'll take it to my man's 125th St., Harlem barbershop</p>
              <p>the agora still stands</p>

              <div className="py-4" />

              <p>Politican finger lickin' we got a thing for this diction -</p>
              <p>but what we face is <span className="italic">restriction</span> -</p>
              <p>covalent bonds in the hood,</p>
              <p>and we share atoms with addiction</p>

              <div className="py-4" />

              <p>Psychoanalytic methodologies come from survival - just living</p>
              <p className="italic">Not college curated</p>

              <div className="py-4" />

              <p>We have phd's before prison</p>

              <div className="py-4" />

              <p>They say 10,000 hours to Master</p>
              <p>But <span className="italic">Master</span> - that time in your debt</p>
              <p>steals the song from the laughter -</p>

              <div className="py-4" />

              <p>I'd rather put that time into plaster</p>
              <p>Like a Robert Lugo mash up</p>
              <p>and find myself</p>

              <div className="py-6" />

              <p className="text-accent-gold text-2xl font-light">A poet,</p>
              <p className="text-accent-gold text-2xl font-light">a proponent of my life</p>
              <p className="text-accent-gold text-2xl font-light">from here on after</p>
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
              This spoken word piece confronts the violence of systemic oppression with unflinching honesty.
              The opening lines—"My fists these cuffs my mouth rips this cus"—collapse the boundary between
              resistance and constraint, showing how survival itself becomes a form of bondage.
            </p>

            <p className="text-white/70 leading-relaxed">
              The Harlem barbershop becomes the modern agora, the Greek marketplace where democracy was born.
              Here, political consciousness isn't learned in universities but forged through lived experience.
              "We have phd's before prison" inverts the academic hierarchy, recognizing that survival generates
              its own epistemology—ways of knowing that precede and exceed formal education.
            </p>

            <p className="text-white/70 leading-relaxed">
              The poem's central turn hinges on the word "Master"—both the achievement of expertise (10,000 hours)
              and the historical figure who owns time, bodies, debt. This double meaning exposes how the pursuit
              of mastery itself can replicate structures of enslavement, stealing "the song from the laughter."
            </p>

            <p className="text-white/70 leading-relaxed">
              <a
                href="https://www.robertlugo.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent-gold hover:underline"
              >
                Robert Lugo
              </a> is a ceramic artist who creates classical Greco-Roman pottery featuring contemporary street culture—
              hip-hop, sneakers, hoodies—challenging who gets immortalized in "high art." The reference to Lugo
              signals the speaker's choice: to take the time demanded by systems of oppression and redirect it
              into art that honors their own experience, their own life.
            </p>

            <p className="text-white/70 leading-relaxed">
              The final declaration—"A poet, a proponent of my life from here on after"—transforms victimhood
              into agency. Not just a poet (creator) but a proponent (advocate, defender) of their own existence.
              This is self-actualization born from survival, art born from resistance.
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
