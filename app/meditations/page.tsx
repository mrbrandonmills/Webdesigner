import Link from 'next/link'
import { MEDITATIONS, getCategoryInfo, getAllCategories } from '@/lib/meditations-data'
import { Clock, Play } from 'lucide-react'

export const metadata = {
  title: 'Guided Meditations | Brandon Mills',
  description: 'Premium guided meditations for mindfulness, sleep, healing, and personal growth. Narrated with ultra-realistic AI voices in British and Indian accents.',
}

export default function MeditationsPage() {
  const categories = getAllCategories()

  return (
    <div className="min-h-screen bg-black pt-32 pb-20">
      <div className="container-wide">
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto text-center mb-20">
          <div className="inline-block px-4 py-2 bg-accent-gold/10 border border-accent-gold/20 rounded-full mb-6">
            <span className="text-accent-gold text-sm font-light tracking-wider uppercase">Guided Meditations</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-light text-white mb-6 tracking-tight">
            Journey Within
          </h1>

          <p className="text-xl text-white/60 leading-relaxed max-w-2xl mx-auto">
            Premium guided meditations for mindfulness, sleep, anxiety relief, and personal transformation.
            Each meditation features ultra-realistic voice narration in British and Indian accents.
          </p>

          <div className="flex items-center justify-center gap-6 mt-8 text-sm text-white/50">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-accent-gold"></div>
              <span>10 Meditations</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-accent-gold"></div>
              <span>4 Voice Options</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-accent-gold"></div>
              <span>$2 Each</span>
            </div>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-16">
          {categories.map((category) => {
            const info = getCategoryInfo(category)
            return (
              <a
                key={category}
                href={`#${category}`}
                className="px-4 py-2 bg-gradient-to-r from-white/5 to-white/10 border border-white/10 rounded-full hover:border-accent-gold/30 transition-all"
              >
                <span className="text-white/70 hover:text-white text-sm font-light">
                  {info.icon} {info.label}
                </span>
              </a>
            )
          })}
        </div>

        {/* Meditations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {MEDITATIONS.map((meditation) => {
            const categoryInfo = getCategoryInfo(meditation.category)

            return (
              <Link
                key={meditation.id}
                href={`/meditations/${meditation.slug}`}
                id={meditation.category}
                className="group"
              >
                <div className="bg-gradient-to-br from-white/5 to-transparent border border-white/10 rounded-2xl p-6 hover:border-accent-gold/30 transition-all duration-500 h-full flex flex-col">
                  {/* Category Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <div className={`px-3 py-1 bg-gradient-to-r ${categoryInfo.color} border border-white/10 rounded-full`}>
                      <span className="text-white/80 text-xs font-light">
                        {categoryInfo.icon} {categoryInfo.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-white/50 text-xs">
                      <Clock size={14} />
                      <span>{meditation.duration}</span>
                    </div>
                  </div>

                  {/* Title & Subtitle */}
                  <h3 className="text-2xl font-light text-white mb-2 group-hover:text-accent-gold transition-colors">
                    {meditation.title}
                  </h3>
                  <p className="text-white/40 text-sm mb-4">
                    {meditation.subtitle}
                  </p>

                  {/* Description */}
                  <p className="text-white/60 text-sm leading-relaxed mb-6 flex-grow">
                    {meditation.description}
                  </p>

                  {/* Voice & Price */}
                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <div className="text-xs text-white/50">
                      Voice: <span className="text-white/70">{meditation.voiceDescription.split(' - ')[0]}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-accent-gold font-medium">${meditation.price}</span>
                      <div className="w-8 h-8 rounded-full bg-accent-gold/20 border border-accent-gold/30 flex items-center justify-center group-hover:bg-accent-gold group-hover:border-accent-gold transition-all">
                        <Play size={14} className="text-accent-gold group-hover:text-black ml-0.5" fill="currentColor" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <div className="max-w-3xl mx-auto text-center mt-20 p-8 bg-gradient-to-br from-accent-gold/10 to-transparent border border-accent-gold/20 rounded-2xl">
          <h3 className="text-2xl font-light text-white mb-4">
            Why These Meditations?
          </h3>
          <p className="text-white/60 leading-relaxed mb-6">
            Each meditation is professionally scripted and narrated using Cartesia's ultra-realistic AI voices.
            Choose from British Male, British Female, Indian Male, or Indian Female narration to match your preference.
            Audio is generated on-demand and cached for instant playback.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="p-4 bg-black/30 rounded-xl">
              <div className="text-accent-gold mb-2">HD Quality</div>
              <div className="text-white/50">Ultra-realistic voice narration</div>
            </div>
            <div className="p-4 bg-black/30 rounded-xl">
              <div className="text-accent-gold mb-2">4 Voices</div>
              <div className="text-white/50">British & Indian accents</div>
            </div>
            <div className="p-4 bg-black/30 rounded-xl">
              <div className="text-accent-gold mb-2">Instant Access</div>
              <div className="text-white/50">Stream or download</div>
            </div>
            <div className="p-4 bg-black/30 rounded-xl">
              <div className="text-accent-gold mb-2">Affordable</div>
              <div className="text-white/50">Just $2 per meditation</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
