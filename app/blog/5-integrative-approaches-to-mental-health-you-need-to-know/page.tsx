import { Metadata } from 'next'
import Navigation from '@/components/navigation'
import { ArrowLeft, Clock, Calendar, Tag } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '5 Integrative Approaches to Mental Health you Need to Know | Brandon Mills',
  description: 'Mental health is an important aspect of overall health and well-being. However, mental health conditions can be complex and challenging to manage. Integrative a...',
  keywords: ['mental-health', 'technology', 'martial-arts', 'integrative', 'approaches', 'mental', 'health', 'need'],
  openGraph: {
    title: '5 Integrative Approaches to Mental Health you Need to Know',
    description: 'Mental health is an important aspect of overall health and well-being. However, mental health conditions can be complex and challenging to manage. Integrative a...',
    type: 'article',
    publishedTime: '2023-02-20',
    authors: ['Brandon Mills'],
  },
  twitter: {
    card: 'summary_large_image',
    title: '5 Integrative Approaches to Mental Health you Need to Know',
    description: 'Mental health is an important aspect of overall health and well-being. However, mental health conditions can be complex and challenging to manage. Integrative a...',
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
              {['mental-health', 'technology', 'martial-arts', 'integrative', 'approaches', 'mental', 'health', 'need'].slice(0, 3).map((tag) => (
                <span key={tag} className="px-3 py-1 bg-accent-gold/20 border border-accent-gold/40 text-accent-gold text-xs tracking-wider uppercase">
                  {tag}
                </span>
              ))}
            </div>

            <h1 className="text-4xl md:text-5xl font-serif mb-6 leading-tight">
              5 Integrative Approaches to Mental Health you Need to Know
            </h1>

            <div className="flex items-center gap-6 text-sm text-white/60">
              <div className="flex items-center gap-2">
                <Calendar size={14} />
                <time dateTime="2023-02-20">February 19, 2023</time>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={14} />
                <span>2 min read</span>
              </div>
            </div>
          </header>

          {/* Content */}
          <div className="prose prose-invert prose-lg max-w-none">
            <p className="text-white/80 leading-relaxed mb-6">Mental health is an important aspect of overall health and well-being. However, mental health conditions can be complex and challenging to manage. Integrative approaches to mental health are becoming more popular as people seek holistic, personalized, and effective treatment options.</p>
            <p className="text-white/80 leading-relaxed mb-6">Integrative mental health is an approach that combines conventional and complementary therapies to address the root causes of mental health conditions. This approach considers the whole person, including physical, emotional, social, and spiritual aspects of health. Integrative mental health involves using evidence-based practices from various disciplines, such as psychiatry, psychology, naturopathy, nutrition, and mind-body therapies.</p>
            <p className="text-white/80 leading-relaxed mb-6">The following are some of the integrative approaches to mental health that are gaining popularity:</p>
            <p className="text-white/80 leading-relaxed mb-6">Integrative mental health practitioners use a patient-centered approach to develop personalized treatment plans that address the individual needs of each patient. They work collaboratively with other healthcare professionals to ensure that patients receive the best possible care.</p>
            <p className="text-white/80 leading-relaxed mb-6">A Final Thought: Integrative approaches to mental health are becoming more popular as people seek holistic, personalized, and effective treatment options. Integrative mental health considers the whole person and uses evidence-based practices from various disciplines to address the root causes of mental health conditions. By combining conventional and complementary therapies, integrative mental health practitioners develop personalized treatment plans that address the individual needs of each patient. If you are seeking mental health treatment, consider an integrative approach to find a personalized treatment plan that works best for you.</p>
          </div>

          {/* Footer */}
          <footer className="mt-16 pt-8 border-t border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-2">
                {['mental-health', 'technology', 'martial-arts', 'integrative', 'approaches', 'mental', 'health', 'need'].map((tag) => (
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
