'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function TheTourbillonPage() {
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [])

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
            2024
          </p>

          <h1 className="text-4xl md:text-5xl font-light font-serif leading-tight">
            The Tourbillon
          </h1>

          <div className="w-24 h-px bg-gradient-to-r from-transparent via-accent-gold to-transparent mx-auto my-8" />

          <p className="text-white/60 text-sm tracking-wider uppercase">
            On Status & Constraint
          </p>
        </div>
      </section>

      {/* Poem Content */}
      <section className="pb-20 container-wide">
        <div className="max-w-2xl mx-auto">
          <div className="border-t border-b border-white/10 py-16 space-y-8">
            <div className="text-center space-y-4 text-white/90 font-serif text-xl md:text-2xl leading-relaxed">
              <p className="italic">Did I take the rope off my neck</p>
              <p className="italic">just to put it around my wrist?</p>

              <div className="py-6" />

              <p className="italic">Inorganic elements</p>
              <p className="italic">mimic a strangling fig vine</p>
              <p className="italic">constricting the blood flow</p>
              <p className="italic">that I thought would set me free</p>

              <div className="py-6" />

              <p className="italic">but now—</p>
              <p className="italic">it is just a weight</p>
              <p className="italic">around my wrist</p>

              <div className="py-6" />

              <p className="italic">A reminder</p>
              <p className="italic">that even in liberation</p>
              <p className="italic">we seek to be bound</p>

              <div className="py-6" />

              <p className="italic">by something beautiful</p>
              <p className="italic">by something rare</p>
              <p className="italic">by something that tells the world:</p>

              <div className="py-6" />

              <p className="italic">I am here.</p>
              <p className="italic">I matter.</p>
              <p className="italic">I exist within constraints of my own choosing.</p>

              <div className="py-8" />

              <p className="italic">The tourbillon spins—</p>
              <p className="italic">defying gravity,</p>
              <p className="italic">measuring time with mechanical precision,</p>
              <p className="italic">while I remain</p>

              <div className="py-6" />

              <p className="italic">still</p>

              <div className="py-6" />

              <p className="italic">bound</p>

              <div className="py-6" />

              <p className="italic">to the physical world.</p>
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
              A tourbillon is one of the most complex and prestigious complications in haute horlogerie—
              a mechanical cage that rotates to counteract the effects of gravity on a watch's accuracy.
              It represents the pinnacle of craftsmanship, status, and constraint.
            </p>

            <p className="text-white/70 leading-relaxed">
              This poem explores the paradox of trading one form of bondage for another.
              We remove the necktie of corporate servitude only to bind ourselves with luxury goods
              that become new chains—beautiful, expensive, socially significant chains—but chains nonetheless.
            </p>

            <p className="text-white/70 leading-relaxed">
              The strangling fig vine is a powerful natural metaphor: a plant that begins as an epiphyte,
              eventually surrounding and constricting its host tree. Like luxury status symbols,
              what begins as adornment can become suffocation.
            </p>

            <p className="text-white/70 leading-relaxed">
              Ultimately, the poem asks: Is freedom possible within the physical world?
              Or are we always seeking new constraints to give our existence meaning, structure, and social legibility?
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
