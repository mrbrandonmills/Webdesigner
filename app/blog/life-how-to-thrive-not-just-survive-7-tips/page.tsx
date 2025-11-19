import { Metadata } from 'next'
import Navigation from '@/components/navigation'
import { ArrowLeft, Clock, Calendar, Tag } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Life: How to Thrive Not Just Survive -7 Tips | Brandon Mills',
  description: 'Life can be challenging, and it’s easy to fall into a mindset of just trying to survive each day. But the truth is, life is meant to be enjoyed and experienced...',
  keywords: ['philosophy', 'technology', 'personal-growth', 'life', 'thrive', 'just', 'survive', 'tips'],
  openGraph: {
    title: 'Life: How to Thrive Not Just Survive -7 Tips',
    description: 'Life can be challenging, and it’s easy to fall into a mindset of just trying to survive each day. But the truth is, life is meant to be enjoyed and experienced...',
    type: 'article',
    publishedTime: '2023-02-20',
    authors: ['Brandon Mills'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Life: How to Thrive Not Just Survive -7 Tips',
    description: 'Life can be challenging, and it’s easy to fall into a mindset of just trying to survive each day. But the truth is, life is meant to be enjoyed and experienced...',
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
              {['philosophy', 'technology', 'personal-growth', 'life', 'thrive', 'just', 'survive', 'tips'].slice(0, 3).map((tag) => (
                <span key={tag} className="px-3 py-1 bg-accent-gold/20 border border-accent-gold/40 text-accent-gold text-xs tracking-wider uppercase">
                  {tag}
                </span>
              ))}
            </div>

            <h1 className="text-4xl md:text-5xl font-serif mb-6 leading-tight">
              Life: How to Thrive Not Just Survive -7 Tips
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
            <p className="text-white/80 leading-relaxed mb-6">Life can be challenging, and it’s easy to fall into a mindset of just trying to survive each day. But the truth is, life is meant to be enjoyed and experienced to the fullest. If you want to thrive in life, here are some tips that can help you achieve that goal.</p>
            <p className="text-white/80 leading-relaxed mb-6">Contemplation: Thriving in life is about finding your passion and purpose, taking care of your health, surrounding yourself with positive people, learning and growing continuously, embracing challenges and failure, and living with gratitude and joy. By following these tips, you’ll be well on your way to creating a life that’s fulfilling and meaningful. Remember, life is not just about surviving; it’s about thriving.</p>
          </div>

          {/* Footer */}
          <footer className="mt-16 pt-8 border-t border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-2">
                {['philosophy', 'technology', 'personal-growth', 'life', 'thrive', 'just', 'survive', 'tips'].map((tag) => (
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
