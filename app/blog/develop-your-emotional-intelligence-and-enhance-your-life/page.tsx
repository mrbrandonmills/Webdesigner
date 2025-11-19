import { Metadata } from 'next'
import Navigation from '@/components/navigation'
import { ArrowLeft, Clock, Calendar, Tag } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Develop Your Emotional Intelligence and Enhance Your Life | Brandon Mills',
  description: 'First, let’s define emotional intelligence. Emotional intelligence refers to the ability to recognize, understand, and manage our own emotions while also recogn...',
  keywords: ['mental-health', 'philosophy', 'meditation', 'develop', 'emotional', 'intelligence', 'enhance', 'life'],
  openGraph: {
    title: 'Develop Your Emotional Intelligence and Enhance Your Life',
    description: 'First, let’s define emotional intelligence. Emotional intelligence refers to the ability to recognize, understand, and manage our own emotions while also recogn...',
    type: 'article',
    publishedTime: '2023-03-03',
    authors: ['Brandon Mills'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Develop Your Emotional Intelligence and Enhance Your Life',
    description: 'First, let’s define emotional intelligence. Emotional intelligence refers to the ability to recognize, understand, and manage our own emotions while also recogn...',
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
              {['mental-health', 'philosophy', 'meditation', 'develop', 'emotional', 'intelligence', 'enhance', 'life'].slice(0, 3).map((tag) => (
                <span key={tag} className="px-3 py-1 bg-accent-gold/20 border border-accent-gold/40 text-accent-gold text-xs tracking-wider uppercase">
                  {tag}
                </span>
              ))}
            </div>

            <h1 className="text-4xl md:text-5xl font-serif mb-6 leading-tight">
              Develop Your Emotional Intelligence and Enhance Your Life
            </h1>

            <div className="flex items-center gap-6 text-sm text-white/60">
              <div className="flex items-center gap-2">
                <Calendar size={14} />
                <time dateTime="2023-03-03">March 2, 2023</time>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={14} />
                <span>2 min read</span>
              </div>
            </div>
          </header>

          {/* Content */}
          <div className="prose prose-invert prose-lg max-w-none">
            <p className="text-white/80 leading-relaxed mb-6">First, let’s define emotional intelligence. Emotional intelligence refers to the ability to recognize, understand, and manage our own emotions while also recognizing and empathizing with the emotions of others. By developing emotional intelligence, we can improve our communication skills, build stronger relationships, and reduce stress and anxiety.</p>
            <p className="text-white/80 leading-relaxed mb-6">One way to build emotional intelligence is through journaling. By regularly reflecting on our emotions and experiences, we can become more self-aware and better understand our thoughts and feelings. Apps like Bloom can help you start journaling and provide guidance and prompts to help you delve deeper into your emotions.</p>
            <p className="text-white/80 leading-relaxed mb-6">Another strategy to develop emotional intelligence is by practicing mindfulness. Mindfulness involves paying attention to the present moment without judgment. By practicing mindfulness, we can become more aware of our emotions and develop greater control over our thoughts and behaviors.</p>
            <p className="text-white/80 leading-relaxed mb-6">Additionally, seeking the guidance of a professional therapist or coach can help you develop your emotional intelligence and build self-awareness. Therapists can provide valuable insights, guidance, and strategies to help you better understand your emotions and develop stronger relationships.</p>
            <p className="text-white/80 leading-relaxed mb-6">Finally, it’s important to surround yourself with supportive and positive people. Building strong relationships with others can help us better understand our own emotions and develop greater empathy and understanding towards others.</p>
            <p className="text-white/80 leading-relaxed mb-6">Contemplation: Building self-awareness and emotional intelligence is crucial for leading a fulfilling and happy life. By journaling, practicing mindfulness, seeking professional guidance, and surrounding ourselves with positive people, we can develop the skills and insights needed to enhance our emotional intelligence and build stronger relationships. So why not start today? Download a journaling app like Bloom and begin your journey towards greater self-awareness and emotional intelligence!</p>
          </div>

          {/* Footer */}
          <footer className="mt-16 pt-8 border-t border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-2">
                {['mental-health', 'philosophy', 'meditation', 'develop', 'emotional', 'intelligence', 'enhance', 'life'].map((tag) => (
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
