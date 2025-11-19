import { Metadata } from 'next'
import Navigation from '@/components/navigation'
import { ArrowLeft, Clock, Calendar, Tag } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Love vs Fear: Understanding Our Choices | Brandon Mills',
  description: 'Humans are complex beings with a wide range of emotions and motivations that drive their decisions. However, many people believe that ultimately every human dec...',
  keywords: ['mental-health', 'philosophy', 'technology', 'love', 'fear', 'understanding', 'choices'],
  openGraph: {
    title: 'Love vs Fear: Understanding Our Choices',
    description: 'Humans are complex beings with a wide range of emotions and motivations that drive their decisions. However, many people believe that ultimately every human dec...',
    type: 'article',
    publishedTime: '2023-02-26',
    authors: ['Brandon Mills'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Love vs Fear: Understanding Our Choices',
    description: 'Humans are complex beings with a wide range of emotions and motivations that drive their decisions. However, many people believe that ultimately every human dec...',
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
              {['mental-health', 'philosophy', 'technology', 'love', 'fear', 'understanding', 'choices'].slice(0, 3).map((tag) => (
                <span key={tag} className="px-3 py-1 bg-accent-gold/20 border border-accent-gold/40 text-accent-gold text-xs tracking-wider uppercase">
                  {tag}
                </span>
              ))}
            </div>

            <h1 className="text-4xl md:text-5xl font-serif mb-6 leading-tight">
              Love vs Fear: Understanding Our Choices
            </h1>

            <div className="flex items-center gap-6 text-sm text-white/60">
              <div className="flex items-center gap-2">
                <Calendar size={14} />
                <time dateTime="2023-02-26">February 25, 2023</time>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={14} />
                <span>3 min read</span>
              </div>
            </div>
          </header>

          {/* Content */}
          <div className="prose prose-invert prose-lg max-w-none">
            <p className="text-white/80 leading-relaxed mb-6">Humans are complex beings with a wide range of emotions and motivations that drive their decisions. However, many people believe that ultimately every human decision boils down to one of love or fear. This idea is based on the notion that these two emotions are the most powerful and fundamental human motivators.</p>
            <p className="text-white/80 leading-relaxed mb-6">Love and fear are both primal emotions that have been hardwired into the human brain over millions of years of evolution. They play a crucial role in shaping human behavior and decision-making, and often work in tandem to influence our actions.</p>
            <p className="text-white/80 leading-relaxed mb-6">Love is often associated with positive emotions such as joy, happiness, and contentment. It is the emotion that drives us to connect with others, to form close relationships, and to seek out experiences that bring us pleasure and fulfillment. Love is also closely tied to empathy, compassion, and altruism, as it motivates us to care for and help others.</p>
            <p className="text-white/80 leading-relaxed mb-6">On the other hand, fear is often associated with negative emotions such as anxiety, insecurity, and anger. It is the emotion that drives us to protect ourselves from harm, to avoid danger, and to respond to threats. Fear can also be a powerful motivator for change, driving us to take action when we feel that our safety or well-being is at risk.</p>
            <p className="text-white/80 leading-relaxed mb-6">Despite the fact that love and fear are often viewed as opposing emotions, they are closely intertwined and can work together to shape our decisions. For example, a person may decide to take a job that pays less money but allows them to work with people they love, or to stay in a relationship that has its challenges because they fear being alone.</p>
            <p className="text-white/80 leading-relaxed mb-6">Moreover, a decision made out of love can also be driven by fear, such as when a person chooses to have children because they fear being alone in their old age, or when a person decides to marry someone because they fear not being able to find anyone else.</p>
            <p className="text-white/80 leading-relaxed mb-6">Next time you have a big decision to make, ask yourself, is this choice coming from a place of love or fear?</p>
            <p className="text-white/80 leading-relaxed mb-6">Ultimately, the choice between love and fear is at the heart of many of our major life decisions. Whether it is choosing a career path, deciding whether to have children, or choosing a romantic partner, our decisions are often motivated by a desire for love and connection or a fear of rejection and isolation.</p>
            <p className="text-white/80 leading-relaxed mb-6">However, it is important to note that there are other factors that can also influence our decisions, such as practical considerations, societal expectations, and personal values. While love and fear may be the two fundamental human motivators, they are not the only ones.</p>
            <p className="text-white/80 leading-relaxed mb-6">Contemplation: The idea that every human decision boils down to one of love or fear is a compelling one that speaks to the deep-seated emotions that drive human behavior. While there are many other factors that can influence our decisions, our innate desire for love and connection, and our fear of rejection and isolation, are powerful forces that shape the course of our lives.</p>
          </div>

          {/* Footer */}
          <footer className="mt-16 pt-8 border-t border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-2">
                {['mental-health', 'philosophy', 'technology', 'love', 'fear', 'understanding', 'choices'].map((tag) => (
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
