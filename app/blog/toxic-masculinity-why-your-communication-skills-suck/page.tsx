import { Metadata } from 'next'
import Navigation from '@/components/navigation'
import { ArrowLeft, Clock, Calendar, Tag } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Toxic Masculinity: Why Your Communication Skills Suck | Brandon Mills',
  description: 'Toxic masculinity is a term used to describe harmful behaviors and attitudes that are associated with traditional societal expectations of what it means to be a...',
  keywords: ['mental-health', 'meditation', 'toxic', 'masculinity', 'communication', 'skills', 'suck'],
  openGraph: {
    title: 'Toxic Masculinity: Why Your Communication Skills Suck',
    description: 'Toxic masculinity is a term used to describe harmful behaviors and attitudes that are associated with traditional societal expectations of what it means to be a...',
    type: 'article',
    publishedTime: '2023-02-22',
    authors: ['Brandon Mills'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Toxic Masculinity: Why Your Communication Skills Suck',
    description: 'Toxic masculinity is a term used to describe harmful behaviors and attitudes that are associated with traditional societal expectations of what it means to be a...',
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
              {['mental-health', 'meditation', 'toxic', 'masculinity', 'communication', 'skills', 'suck'].slice(0, 3).map((tag) => (
                <span key={tag} className="px-3 py-1 bg-accent-gold/20 border border-accent-gold/40 text-accent-gold text-xs tracking-wider uppercase">
                  {tag}
                </span>
              ))}
            </div>

            <h1 className="text-4xl md:text-5xl font-serif mb-6 leading-tight">
              Toxic Masculinity: Why Your Communication Skills Suck
            </h1>

            <div className="flex items-center gap-6 text-sm text-white/60">
              <div className="flex items-center gap-2">
                <Calendar size={14} />
                <time dateTime="2023-02-22">February 21, 2023</time>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={14} />
                <span>3 min read</span>
              </div>
            </div>
          </header>

          {/* Content */}
          <div className="prose prose-invert prose-lg max-w-none">
            <p className="text-white/80 leading-relaxed mb-6">Toxic masculinity is a term used to describe harmful behaviors and attitudes that are associated with traditional societal expectations of what it means to be a man. These expectations often include the idea that men must be strong, independent, and emotionless. Unfortunately, these expectations also limit men from developing healthy communication skills.</p>
            <p className="text-white/80 leading-relaxed mb-6">In many cultures, men are often taught to suppress their emotions and not express themselves, especially when it comes to vulnerability. This can lead to feelings of isolation and can make it difficult for men to form close relationships. Furthermore, men who have grown up with these attitudes may struggle to express themselves in a healthy way, leading to a lack of communication skills.</p>
            <p className="text-white/80 leading-relaxed mb-6">One of the most significant ways that toxic masculinity limits men from developing healthy communication skills is through the reinforcement of negative stereotypes. Men are often encouraged to be aggressive, dominant, and competitive, which can lead to unhealthy behaviors and attitudes. For instance, many men may feel that they must be in control at all times, leading to difficulty in expressing empathy and listening to others.</p>
            <p className="text-white/80 leading-relaxed mb-6">Another factor that can limit men from developing healthy communication skills is the way that they are socialized. From an early age, boys are taught to be independent and not to rely on others for emotional support. This can lead to a lack of emotional intelligence and an inability to express feelings in a healthy way. Additionally, men who have grown up with these attitudes may feel that they are not allowed to seek help when they need it, which can lead to feelings of shame and isolation.</p>
            <p className="text-white/80 leading-relaxed mb-6">Toxic masculinity can also limit men from developing healthy communication skills by creating a culture of aggression and violence. Men who are taught that violence is an acceptable way to solve problems may be more likely to engage in verbal or physical altercations, rather than resolving issues through healthy communication. This can also lead to difficulty in expressing emotions, as men may feel that doing so is a sign of weakness.</p>
            <p className="text-white/80 leading-relaxed mb-6">Ultimately, toxic masculinity limits men from developing healthy communication skills by reinforcing negative stereotypes, creating a culture of aggression, and discouraging vulnerability and emotional expression. It is important to break down these attitudes and encourage men to communicate in healthy ways. This can be done through education and awareness, encouraging emotional intelligence, and promoting healthy relationships. By doing so, we can help to create a more supportive and inclusive culture, where men are free to express themselves and develop healthy communication skills.</p>
          </div>

          {/* Footer */}
          <footer className="mt-16 pt-8 border-t border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-2">
                {['mental-health', 'meditation', 'toxic', 'masculinity', 'communication', 'skills', 'suck'].map((tag) => (
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
