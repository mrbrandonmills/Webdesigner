'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { MEDITATIONS, CATEGORY_INFO } from '@/lib/meditations-data'

export default function MeditationsStorePage() {
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [])

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="pt-32 pb-20 container-wide">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <p className="text-accent-gold text-xs tracking-[0.3em] uppercase">
            Premium Guided Meditations
          </p>

          <h1 className="text-5xl md:text-6xl font-light font-serif leading-tight">
            Transform Your Mind,
            <br />
            <span className="text-accent-gold">Elevate Your Life</span>
          </h1>

          <div className="w-24 h-px bg-gradient-to-r from-transparent via-accent-gold to-transparent mx-auto my-8" />

          <p className="text-white/70 text-lg max-w-2xl mx-auto leading-relaxed">
            Professionally crafted meditation experiences featuring premium AI voices
            chosen for their depth, warmth, and soothing quality. Each practice designed
            for immediate impact.
          </p>

          <div className="flex items-center justify-center gap-8 pt-4">
            <div className="text-center">
              <p className="text-3xl font-light text-accent-gold">10</p>
              <p className="text-xs text-white/50 uppercase tracking-wider">Meditations</p>
            </div>
            <div className="w-px h-12 bg-white/10" />
            <div className="text-center">
              <p className="text-3xl font-light text-accent-gold">4</p>
              <p className="text-xs text-white/50 uppercase tracking-wider">Premium Voices</p>
            </div>
            <div className="w-px h-12 bg-white/10" />
            <div className="text-center">
              <p className="text-3xl font-light text-accent-gold">$5</p>
              <p className="text-xs text-white/50 uppercase tracking-wider">Each</p>
            </div>
          </div>
        </div>
      </section>

      {/* Voice Selector Info */}
      <section className="pb-20 container-wide">
        <div className="max-w-4xl mx-auto bg-white/5 border border-white/10 p-8">
          <h3 className="text-accent-gold text-sm tracking-wider uppercase mb-6">
            Premium Storytelling Voices
          </h3>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-white font-medium mb-1">Miles (Yogi)</p>
              <p className="text-white/60 text-sm">Deep, soothing mature male - perfect for meditation guidance</p>
            </div>
            <div>
              <p className="text-white font-medium mb-1">Calypso (ASMR Lady)</p>
              <p className="text-white/60 text-sm">Soothing, calming female - ideal for gentle storytelling</p>
            </div>
            <div>
              <p className="text-white font-medium mb-1">Devansh (Warm Support)</p>
              <p className="text-white/60 text-sm">Warm Indian male - Deepak Chopra-like spiritual guidance</p>
            </div>
            <div>
              <p className="text-white font-medium mb-1">Mabel (Grandma)</p>
              <p className="text-white/60 text-sm">Friendly, grandmotherly - warm maternal storytelling</p>
            </div>
          </div>

          <p className="text-white/50 text-sm mt-6 italic">
            Each meditation is available in all 4 voices. Choose the one that resonates with you.
          </p>
        </div>
      </section>

      {/* Meditation Grid */}
      <section className="pb-32 container-wide">
        <div className="max-w-6xl mx-auto space-y-16">
          {MEDITATIONS.map((meditation) => {
            const categoryInfo = CATEGORY_INFO[meditation.category]

            return (
              <Link
                key={meditation.id}
                href={`/meditations/${meditation.slug}`}
                className="block group"
              >
                <div className="border border-white/10 bg-white/5 hover:bg-white/[0.07] transition-all duration-500 overflow-hidden">
                  <div className="p-8 md:p-12">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                      {/* Left: Content */}
                      <div className="flex-1 space-y-4">
                        {/* Category Badge */}
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{categoryInfo.icon}</span>
                          <span className="text-xs tracking-wider uppercase text-accent-gold">
                            {categoryInfo.label}
                          </span>
                        </div>

                        {/* Title */}
                        <h2 className="text-3xl md:text-4xl font-light font-serif group-hover:text-accent-gold transition-colors duration-300">
                          {meditation.title}
                        </h2>

                        {/* Subtitle */}
                        <p className="text-white/60 text-lg">
                          {meditation.subtitle}
                        </p>

                        {/* Meta Info */}
                        <div className="flex flex-wrap items-center gap-4 text-sm text-white/50">
                          <span>{meditation.duration}</span>
                          <span>•</span>
                          <span>{meditation.wordCount} words</span>
                        </div>

                        {/* Description */}
                        <p className="text-white/70 leading-relaxed max-w-2xl">
                          {meditation.description}
                        </p>

                        {/* Benefits */}
                        <div className="pt-4">
                          <p className="text-xs uppercase tracking-wider text-accent-gold mb-3">
                            Key Benefits
                          </p>
                          <ul className="space-y-2">
                            {meditation.benefits.slice(0, 3).map((benefit, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-white/60 text-sm">
                                <span className="text-accent-gold mt-1">✓</span>
                                <span>{benefit}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Right: Price & CTA */}
                      <div className="flex flex-col items-start md:items-end gap-4 md:min-w-[200px]">
                        <div className="text-right">
                          <p className="text-5xl font-light text-accent-gold">
                            ${meditation.price}
                          </p>
                          <p className="text-xs text-white/50 uppercase tracking-wider mt-1">
                            One-time purchase
                          </p>
                        </div>

                        <div className="w-full md:w-auto">
                          <div className="bg-accent-gold text-black px-8 py-3 text-sm tracking-wider uppercase font-medium group-hover:bg-white transition-colors duration-300 text-center">
                            Learn More →
                          </div>
                        </div>

                        <p className="text-xs text-white/40 text-right">
                          Available in 4 voices
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Why These Meditations */}
      <section className="pb-32 container-wide">
        <div className="max-w-3xl mx-auto bg-white/5 border border-white/10 p-8 md:p-12 space-y-6">
          <h3 className="text-accent-gold text-sm tracking-wider uppercase">
            Why These Meditations Are Different
          </h3>

          <div className="space-y-4 text-white/70 leading-relaxed">
            <p>
              Most guided meditations use generic, robotic voices that pull you out of presence.
              We've invested in premium AI voices specifically chosen for their depth, warmth,
              and soothing quality—voices that sound like David Attenborough, Barry White,
              or Deepak Chopra.
            </p>

            <p>
              Each meditation is professionally written, addressing specific needs: anxiety relief,
              deep sleep, creative unblocking, grief processing, confidence activation, and more.
              These aren't generic relaxation scripts—they're targeted practices designed for
              immediate impact.
            </p>

            <p>
              With 4 premium voices per meditation, you choose the guide that resonates with you.
              Some prefer the deep masculine presence of Miles (Yogi), others the soothing
              feminine quality of Calypso (ASMR Lady). Your meditation, your voice, your journey.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
