import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Calendar, MapPin, Tag } from 'lucide-react'
import { fullyDevelopedStories, getStoryById } from '@/lib/genesis-stories'

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

// Generate static params for all published stories
export async function generateStaticParams() {
  return fullyDevelopedStories
    .filter(story => story.blogSlug)
    .map(story => ({
      slug: story.blogSlug!,
    }))
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const story = fullyDevelopedStories.find(s => s.blogSlug === slug)

  if (!story) {
    return {
      title: 'Story Not Found',
    }
  }

  return {
    title: `${story.title} - Genesis Stories | Brandon Mills`,
    description: story.story,
    openGraph: {
      title: story.title,
      description: story.story,
      images: [{ url: story.src }],
      type: 'article',
    },
  }
}

export default async function GenesisStoryPage({ params }: PageProps) {
  const { slug } = await params
  const story = fullyDevelopedStories.find(s => s.blogSlug === slug)

  if (!story || !story.fullBackstory) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section with Image */}
      <section className="relative h-[70vh] md:h-screen">
        <Image
          src={story.src}
          alt={story.title}
          fill
          className="object-cover"
          priority
          quality={100}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black" />

        {/* Content Overlay */}
        <div className="absolute inset-0 flex items-end">
          <div className="container-wide pb-20 md:pb-32">
            <div className="max-w-4xl">
              {/* Back Link */}
              <Link
                href="/gallery/genesis"
                className="inline-flex items-center gap-2 text-white/60 hover:text-accent-gold transition-colors mb-8"
              >
                <ArrowLeft size={20} />
                <span className="text-sm tracking-wider uppercase">Back to Archive</span>
              </Link>

              {/* Category Badge */}
              <div className="inline-block px-4 py-2 bg-black/60 backdrop-blur-sm border border-accent-gold/40 mb-6">
                <span className="text-accent-gold text-xs tracking-[0.25em] uppercase">
                  {story.category}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-light font-serif mb-6 leading-tight">
                {story.title}
              </h1>

              {/* Meta Info */}
              <div className="flex flex-wrap gap-6 text-white/60 text-sm">
                {story.location && (
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-accent-gold" />
                    <span>{story.location}</span>
                  </div>
                )}
                {story.year && (
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-accent-gold" />
                    <span>{story.year}</span>
                  </div>
                )}
                {story.brand && (
                  <div className="text-white/80">
                    <span className="text-accent-gold">Brand:</span> {story.brand}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <article className="py-20 md:py-32">
        <div className="container-wide max-w-4xl">
          {/* Introduction */}
          <div className="mb-16">
            <div className="w-24 h-px bg-gradient-to-r from-accent-gold to-transparent mb-8" />
            <p className="text-2xl md:text-3xl font-light text-white/90 leading-relaxed italic">
              {story.story}
            </p>
          </div>

          {/* Full Backstory Sections */}
          <div className="prose prose-invert prose-lg max-w-none space-y-16">
            {/* Setting */}
            <section>
              <h2 className="text-3xl font-light font-serif text-white mb-6 flex items-center gap-4">
                <span className="text-accent-gold">I.</span>
                The Setting
              </h2>
              <p className="text-white/80 leading-relaxed whitespace-pre-line">
                {story.fullBackstory.setting}
              </p>
            </section>

            {/* Challenge */}
            <section>
              <h2 className="text-3xl font-light font-serif text-white mb-6 flex items-center gap-4">
                <span className="text-accent-gold">II.</span>
                The Challenge
              </h2>
              <p className="text-white/80 leading-relaxed whitespace-pre-line">
                {story.fullBackstory.challenge}
              </p>
            </section>

            {/* Breakthrough */}
            <section>
              <h2 className="text-3xl font-light font-serif text-white mb-6 flex items-center gap-4">
                <span className="text-accent-gold">III.</span>
                The Breakthrough
              </h2>
              <p className="text-white/80 leading-relaxed whitespace-pre-line">
                {story.fullBackstory.breakthrough}
              </p>
            </section>

            {/* Impact */}
            <section>
              <h2 className="text-3xl font-light font-serif text-white mb-6 flex items-center gap-4">
                <span className="text-accent-gold">IV.</span>
                The Impact
              </h2>
              <p className="text-white/80 leading-relaxed whitespace-pre-line">
                {story.fullBackstory.impact}
              </p>
            </section>
          </div>

          {/* Lesson Learned Callout */}
          {story.lessonLearned && (
            <div className="my-20 border-l-4 border-accent-gold bg-accent-gold/5 p-8 md:p-12">
              <h3 className="text-accent-gold text-sm tracking-[0.3em] uppercase mb-4">
                Lesson Learned
              </h3>
              <p className="text-xl md:text-2xl font-light text-white leading-relaxed">
                {story.lessonLearned}
              </p>
            </div>
          )}

          {/* Behind the Scenes */}
          {story.behindTheScenes && (
            <div className="my-16">
              <h3 className="text-2xl font-light font-serif text-white mb-6">
                Behind the Scenes
              </h3>
              <p className="text-white/70 leading-relaxed italic">
                {story.behindTheScenes}
              </p>
            </div>
          )}

          {/* Tags */}
          {story.tags && story.tags.length > 0 && (
            <div className="mt-16 pt-16 border-t border-white/10">
              <div className="flex items-center gap-3 flex-wrap">
                <Tag size={18} className="text-accent-gold" />
                {story.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-white/5 border border-white/10 text-white/60 text-sm rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="mt-20 pt-16 border-t border-white/10">
            <Link
              href="/gallery/genesis"
              className="inline-flex items-center gap-3 text-accent-gold hover:text-accent-hover transition-colors group"
            >
              <ArrowLeft size={20} className="group-hover:-translate-x-2 transition-transform" />
              <span className="text-lg tracking-wide">View Full Genesis Archive</span>
            </Link>
          </div>
        </div>
      </article>
    </div>
  )
}
