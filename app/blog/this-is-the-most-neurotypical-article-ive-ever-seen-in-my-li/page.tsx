import { Metadata } from 'next'
import Navigation from '@/components/navigation'
import { ArrowLeft, Clock, Calendar, Tag } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'This is the most Neurotypical article I’ve ever seen in my life. | Brandon Mills',
  description: 'This is the most Neurotypical article I’ve ever seen in my life. If you let AI write for you and think for you, of course this is the downside. Let’s do a simil...',
  keywords: ['philosophy', 'technology', 'most', 'neurotypical', 'article', 'i’ve', 'ever'],
  openGraph: {
    title: 'This is the most Neurotypical article I’ve ever seen in my life.',
    description: 'This is the most Neurotypical article I’ve ever seen in my life. If you let AI write for you and think for you, of course this is the downside. Let’s do a simil...',
    type: 'article',
    publishedTime: '2025-07-04',
    authors: ['Brandon Mills'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'This is the most Neurotypical article I’ve ever seen in my life.',
    description: 'This is the most Neurotypical article I’ve ever seen in my life. If you let AI write for you and think for you, of course this is the downside. Let’s do a simil...',
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
              {['philosophy', 'technology', 'most', 'neurotypical', 'article', 'i’ve', 'ever'].slice(0, 3).map((tag) => (
                <span key={tag} className="px-3 py-1 bg-accent-gold/20 border border-accent-gold/40 text-accent-gold text-xs tracking-wider uppercase">
                  {tag}
                </span>
              ))}
            </div>

            <h1 className="text-4xl md:text-5xl font-serif mb-6 leading-tight">
              This is the most Neurotypical article I’ve ever seen in my life.
            </h1>

            <div className="flex items-center gap-6 text-sm text-white/60">
              <div className="flex items-center gap-2">
                <Calendar size={14} />
                <time dateTime="2025-07-04">July 3, 2025</time>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={14} />
                <span>1 min read</span>
              </div>
            </div>
          </header>

          {/* Content */}
          <div className="prose prose-invert prose-lg max-w-none">
            <p className="text-white/80 leading-relaxed mb-6">This is the most Neurotypical article I’ve ever seen in my life. If you let AI write for you and think for you, of course this is the downside. Let’s do a similar test using AI and dynamic contemplation. Let’s also test neurodivergent people like myself who have completely integrated themselves into AI so that when we write essays, it is a reflection of our own complexity. The fact that there is an APA, MLA framework that exists ingrained into society means that you’re testing whether or not AI makes you less intelligent when aligning to that framework. I’d love for you to see pictures of my brain when I’m in gamma wave coherent state using AI because I’ve fully integrated my creative self into it. Thank you so much for this article so that I can build testing that completely contradicts these results and show that without proper integration into AI this is the price to pay.</p>
          </div>

          {/* Footer */}
          <footer className="mt-16 pt-8 border-t border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-2">
                {['philosophy', 'technology', 'most', 'neurotypical', 'article', 'i’ve', 'ever'].map((tag) => (
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
