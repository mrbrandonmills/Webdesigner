import { Metadata } from 'next'
import Navigation from '@/components/navigation'
import { ArrowLeft, Clock, Calendar, Tag } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Self-Esteem: Cultivating a Positive Self Image | Brandon Mills',
  description: 'Cultivating a positive self-image is one of the most important things you can do for your mental and emotional well-being. A positive self-image can lead to imp...',
  keywords: ['mental-health', 'philosophy', 'self', 'esteem', 'cultivating', 'positive'],
  openGraph: {
    title: 'Self-Esteem: Cultivating a Positive Self Image',
    description: 'Cultivating a positive self-image is one of the most important things you can do for your mental and emotional well-being. A positive self-image can lead to imp...',
    type: 'article',
    publishedTime: '2023-02-20',
    authors: ['Brandon Mills'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Self-Esteem: Cultivating a Positive Self Image',
    description: 'Cultivating a positive self-image is one of the most important things you can do for your mental and emotional well-being. A positive self-image can lead to imp...',
  }
}

export default function BlogPost() {
  return (
    <main className="min-h-screen bg-black text-white">
      <Navigation />

      <article className="pt-32 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          {/* Back Link */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-white/60 hover:text-accent-gold transition-colors mb-8"
          >
            <ArrowLeft size={16} />
            <span>Back to Blog</span>
          </Link>

          {/* Header */}
          <header className="mb-12">
            <div className="flex flex-wrap gap-2 mb-4">
              {['mental-health', 'philosophy', 'self', 'esteem', 'cultivating', 'positive'].slice(0, 3).map((tag) => (
                <span key={tag} className="px-3 py-1 bg-accent-gold/20 border border-accent-gold/40 text-accent-gold text-xs tracking-wider uppercase">
                  {tag}
                </span>
              ))}
            </div>

            <h1 className="text-4xl md:text-5xl font-serif mb-6 leading-tight">
              Self-Esteem: Cultivating a Positive Self Image
            </h1>

            <div className="flex items-center gap-6 text-sm text-white/60">
              <div className="flex items-center gap-2">
                <Calendar size={14} />
                <time dateTime="2023-02-20">February 19, 2023</time>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={14} />
                <span>1 min read</span>
              </div>
            </div>
          </header>

          {/* Content */}
          <div className="prose prose-invert prose-lg max-w-none">
            <p className="text-white/80 leading-relaxed mb-6">Cultivating a positive self-image is one of the most important things you can do for your mental and emotional well-being. A positive self-image can lead to improved confidence, self-esteem, and a greater sense of self-worth. Here are some strategies you can use to cultivate a positive self-image.</p>
            <p className="text-white/80 leading-relaxed mb-6">Contemplation: Cultivating a positive self-image is a process that takes time and effort, but it’s worth it. By practicing self-compassion, self-care, focusing on your strengths, surrounding yourself with positivity, and practicing positive self-talk, you can build a more positive and confident self-image. Remember, the way you see yourself matters, and you have the power to shape that perception.</p>
          </div>

          {/* Footer */}
          <footer className="mt-16 pt-8 border-t border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-2">
                {['mental-health', 'philosophy', 'self', 'esteem', 'cultivating', 'positive'].map((tag) => (
                  <span key={tag} className="px-2 py-1 bg-white/5 text-white/40 text-xs">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </footer>
        </div>
      </article>
    </main>
  )
}
