import { Metadata } from 'next'
import Navigation from '@/components/navigation'
import { ArrowLeft, Clock, Calendar, Tag } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'The Harvard Classics: Become Ivy League Without the Price Tag | Brandon Mills',
  description: 'The Harvard Classics, also known as the “Five-Foot Shelf,” is a 51-volume series of classic literature that was first compiled by Harvard University President C...',
  keywords: ['technology', 'harvard', 'classics', 'become', 'league', 'without'],
  openGraph: {
    title: 'The Harvard Classics: Become Ivy League Without the Price Tag',
    description: 'The Harvard Classics, also known as the “Five-Foot Shelf,” is a 51-volume series of classic literature that was first compiled by Harvard University President C...',
    type: 'article',
    publishedTime: '2023-02-19',
    authors: ['Brandon Mills'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Harvard Classics: Become Ivy League Without the Price Tag',
    description: 'The Harvard Classics, also known as the “Five-Foot Shelf,” is a 51-volume series of classic literature that was first compiled by Harvard University President C...',
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
              {['technology', 'harvard', 'classics', 'become', 'league', 'without'].slice(0, 3).map((tag) => (
                <span key={tag} className="px-3 py-1 bg-accent-gold/20 border border-accent-gold/40 text-accent-gold text-xs tracking-wider uppercase">
                  {tag}
                </span>
              ))}
            </div>

            <h1 className="text-4xl md:text-5xl font-serif mb-6 leading-tight">
              The Harvard Classics: Become Ivy League Without the Price Tag
            </h1>

            <div className="flex items-center gap-6 text-sm text-white/60">
              <div className="flex items-center gap-2">
                <Calendar size={14} />
                <time dateTime="2023-02-19">February 18, 2023</time>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={14} />
                <span>1 min read</span>
              </div>
            </div>
          </header>

          {/* Content */}
          <div className="prose prose-invert prose-lg max-w-none">
            <p className="text-white/80 leading-relaxed mb-6">The Harvard Classics, also known as the “Five-Foot Shelf,” is a 51-volume series of classic literature that was first compiled by Harvard University President Charles W. Eliot in the early 1900s. The series includes works from ancient Greece and Rome, as well as literature from Europe and the Americas from the 17th to the 19th centuries. These books were carefully selected by Eliot to provide a comprehensive education in the humanities.</p>
            <p className="text-white/80 leading-relaxed mb-6">While the series is now over a century old, it remains relevant and valuable today. In this article, we will explore the reasons why it’s important to read the Harvard Classics.</p>
            <p className="text-white/80 leading-relaxed mb-6">In conclusion, reading the Harvard Classics is an excellent way to gain a well-rounded education, promote critical thinking, and gain exposure to different cultures and historical periods. Additionally, it can help to improve writing and communication skills and provide a sense of intellectual fulfillment. Whether you are a student, a professional, or simply someone who loves to read, the Harvard Classics is a valuable and worthwhile investment of time and effort.</p>
          </div>

          {/* Footer */}
          <footer className="mt-16 pt-8 border-t border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-2">
                {['technology', 'harvard', 'classics', 'become', 'league', 'without'].map((tag) => (
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
