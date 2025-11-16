import { notFound } from 'next/navigation'
import Link from 'next/link'
import { readFileSync } from 'fs'
import { join } from 'path'
import { MEDITATIONS, getMeditationBySlug, getCategoryInfo } from '@/lib/meditations-data'
import { AudioReader } from '@/components/audio-reader'
import { MeditationUnlockGate } from '@/components/meditation-unlock-gate'
import { MeditationPageClient } from '@/components/meditation-page-client'
import { ArrowLeft, Check, Clock, DollarSign, User } from 'lucide-react'

export async function generateStaticParams() {
  return MEDITATIONS.map((meditation) => ({
    slug: meditation.slug,
  }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const meditation = getMeditationBySlug(slug)

  if (!meditation) {
    return {
      title: 'Meditation Not Found | Brandon Mills',
    }
  }

  return {
    title: `${meditation.title} | Brandon Mills Meditations`,
    description: meditation.description,
    openGraph: {
      title: meditation.title,
      description: meditation.description,
      type: 'article',
    },
  }
}

export default async function MeditationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const meditation = getMeditationBySlug(slug)

  if (!meditation) {
    notFound()
  }

  // Read the meditation script from markdown file
  const filePath = join(process.cwd(), meditation.contentFile)
  let scriptContent = ''

  try {
    const fileContent = readFileSync(filePath, 'utf-8')

    // Extract script section (everything between ## Script and ---recording notes)
    const scriptMatch = fileContent.match(/## Script\n\n([\s\S]*?)(?=\n---|\n##|$)/i)

    if (scriptMatch) {
      scriptContent = scriptMatch[1].trim()
    } else {
      // Fallback: use everything after the metadata
      const parts = fileContent.split('---')
      if (parts.length >= 2) {
        scriptContent = parts.slice(2).join('---').trim()
      } else {
        scriptContent = fileContent
      }
    }
  } catch (error) {
    console.error('Error reading meditation file:', error)
    scriptContent = 'Meditation script could not be loaded.'
  }

  const categoryInfo = getCategoryInfo(meditation.category)

  return (
    <div className="min-h-screen bg-black pt-32 pb-20">
      <div className="container-wide max-w-5xl">
        {/* Back Button */}
        <Link
          href="/meditations"
          className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft size={20} />
          <span>Back to Meditations</span>
        </Link>

        {/* Category Badge */}
        <div className={`inline-block px-4 py-2 bg-gradient-to-r ${categoryInfo.color} border border-white/10 rounded-full mb-6`}>
          <span className="text-white/80 text-sm font-light">
            {categoryInfo.icon} {categoryInfo.label}
          </span>
        </div>

        {/* Title & Subtitle */}
        <h1 className="text-5xl md:text-7xl font-light text-white mb-4 tracking-tight">
          {meditation.title}
        </h1>
        <p className="text-2xl text-white/60 font-light mb-12">
          {meditation.subtitle}
        </p>

        {/* Metadata Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="bg-gradient-to-br from-white/5 to-transparent border border-white/10 rounded-xl p-4">
            <div className="flex items-center gap-2 text-white/50 text-sm mb-2">
              <Clock size={16} />
              <span>Duration</span>
            </div>
            <div className="text-white text-lg">{meditation.duration}</div>
          </div>

          <div className="bg-gradient-to-br from-white/5 to-transparent border border-white/10 rounded-xl p-4">
            <div className="flex items-center gap-2 text-white/50 text-sm mb-2">
              <User size={16} />
              <span>Voice</span>
            </div>
            <div className="text-white text-lg">{meditation.voiceDescription.split(' - ')[0]}</div>
          </div>

          <div className="bg-gradient-to-br from-white/5 to-transparent border border-white/10 rounded-xl p-4">
            <div className="flex items-center gap-2 text-white/50 text-sm mb-2">
              <DollarSign size={16} />
              <span>Price</span>
            </div>
            <div className="text-accent-gold text-lg font-medium">${meditation.price}</div>
          </div>

          <div className="bg-gradient-to-br from-white/5 to-transparent border border-white/10 rounded-xl p-4">
            <div className="text-white/50 text-sm mb-2">Words</div>
            <div className="text-white text-lg">{meditation.wordCount.toLocaleString()}</div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-gradient-to-br from-white/5 to-transparent border border-white/10 rounded-2xl p-8 mb-12">
          <h2 className="text-2xl font-light text-white mb-4">About This Meditation</h2>
          <p className="text-white/70 text-lg leading-relaxed mb-8">
            {meditation.description}
          </p>

          {/* Benefits */}
          <h3 className="text-xl font-light text-white mb-4">What You'll Experience</h3>
          <ul className="grid md:grid-cols-2 gap-3">
            {meditation.benefits.map((benefit, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-accent-gold/20 border border-accent-gold/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check size={12} className="text-accent-gold" />
                </div>
                <span className="text-white/70">{benefit}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Audio Player / Unlock Gate */}
        <div className="mb-12">
          <MeditationPageClient
            meditation={meditation}
            scriptContent={scriptContent}
          />
        </div>

        {/* Purchase Options */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="bg-gradient-to-br from-accent-gold/10 to-transparent border border-accent-gold/20 rounded-2xl p-8">
            <h3 className="text-2xl font-light text-white mb-4">Stream Now</h3>
            <p className="text-white/60 mb-6">
              Listen immediately with any of our 4 premium voices. Audio is generated on-demand and cached for instant playback.
            </p>
            <div className="flex items-center justify-between">
              <span className="text-accent-gold text-3xl font-light">${meditation.price}</span>
              <button className="px-6 py-3 bg-accent-gold hover:bg-accent-hover text-black font-medium rounded-lg transition-all">
                Stream Audio
              </button>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white/5 to-transparent border border-white/10 rounded-2xl p-8">
            <h3 className="text-2xl font-light text-white mb-4">Download MP3</h3>
            <p className="text-white/60 mb-6">
              Own the meditation forever. Download high-quality MP3 files in your preferred voice for offline listening.
            </p>
            <div className="flex items-center justify-between">
              <span className="text-white text-3xl font-light">${meditation.price}</span>
              <button className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg transition-all">
                Download
              </button>
            </div>
          </div>
        </div>

        {/* Voice Information */}
        <div className="bg-gradient-to-br from-white/5 to-transparent border border-white/10 rounded-2xl p-8 mb-12">
          <h3 className="text-2xl font-light text-white mb-4">Voice Options</h3>
          <p className="text-white/60 mb-6">
            This meditation is recommended with <strong className="text-white">{meditation.voiceDescription}</strong>, but you can listen with any of our premium voices:
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-black/30 rounded-xl border border-white/5">
              <div className="text-white font-medium mb-1">British Male</div>
              <div className="text-white/50 text-sm">Soothing, sophisticated - Perfect for philosophy and empowerment</div>
            </div>
            <div className="p-4 bg-black/30 rounded-xl border border-white/5">
              <div className="text-white font-medium mb-1">British Female</div>
              <div className="text-white/50 text-sm">Calm, elegant - Ideal for poetry and gentle guidance</div>
            </div>
            <div className="p-4 bg-black/30 rounded-xl border border-white/5">
              <div className="text-white font-medium mb-1">Indian Male</div>
              <div className="text-white/50 text-sm">Warm, soothing - Meditative quality for healing practices</div>
            </div>
            <div className="p-4 bg-black/30 rounded-xl border border-white/5">
              <div className="text-white font-medium mb-1">Indian Female</div>
              <div className="text-white/50 text-sm">Gentle, calming - Spiritual tone for sleep and compassion</div>
            </div>
          </div>
        </div>

        {/* Related Meditations */}
        <div>
          <h3 className="text-2xl font-light text-white mb-8">More Meditations</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {MEDITATIONS.filter(m => m.id !== meditation.id && m.category === meditation.category)
              .slice(0, 3)
              .map((relatedMeditation) => {
                const relatedCategory = getCategoryInfo(relatedMeditation.category)
                return (
                  <Link
                    key={relatedMeditation.id}
                    href={`/meditations/${relatedMeditation.slug}`}
                    className="group bg-gradient-to-br from-white/5 to-transparent border border-white/10 rounded-xl p-6 hover:border-accent-gold/30 transition-all"
                  >
                    <div className={`inline-block px-3 py-1 bg-gradient-to-r ${relatedCategory.color} border border-white/10 rounded-full mb-4`}>
                      <span className="text-white/80 text-xs">
                        {relatedCategory.icon} {relatedCategory.label}
                      </span>
                    </div>
                    <h4 className="text-xl font-light text-white mb-2 group-hover:text-accent-gold transition-colors">
                      {relatedMeditation.title}
                    </h4>
                    <p className="text-white/50 text-sm mb-4">{relatedMeditation.duration}</p>
                    <p className="text-white/60 text-sm">{relatedMeditation.description.slice(0, 100)}...</p>
                  </Link>
                )
              })}
          </div>
        </div>
      </div>
    </div>
  )
}
