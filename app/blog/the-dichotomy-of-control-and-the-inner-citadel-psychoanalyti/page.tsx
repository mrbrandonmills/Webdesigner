import { Metadata } from 'next'
import Navigation from '@/components/navigation'
import { ArrowLeft, Clock, Calendar, Tag } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'The Dichotomy of Control and the Inner Citadel: Psychoanalytical Explorations of Marcus Aurelius’… | Brandon Mills',
  description: 'Marcus Aurelius’ seminal work, ‘Meditations’, is a cornerstone of Stoic philosophy, largely recognized for its unique approach to human consciousness and emotio...',
  keywords: ['mental-health', 'philosophy', 'meditation', 'technology', 'dichotomy', 'control', 'inner', 'citadel', 'psychoanalytical'],
  openGraph: {
    title: 'The Dichotomy of Control and the Inner Citadel: Psychoanalytical Explorations of Marcus Aurelius’…',
    description: 'Marcus Aurelius’ seminal work, ‘Meditations’, is a cornerstone of Stoic philosophy, largely recognized for its unique approach to human consciousness and emotio...',
    type: 'article',
    publishedTime: '2025-11-18',
    authors: ['Brandon Mills'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Dichotomy of Control and the Inner Citadel: Psychoanalytical Explorations of Marcus Aurelius’…',
    description: 'Marcus Aurelius’ seminal work, ‘Meditations’, is a cornerstone of Stoic philosophy, largely recognized for its unique approach to human consciousness and emotio...',
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
              {['mental-health', 'philosophy', 'meditation', 'technology', 'dichotomy', 'control', 'inner', 'citadel', 'psychoanalytical'].slice(0, 3).map((tag) => (
                <span key={tag} className="px-3 py-1 bg-accent-gold/20 border border-accent-gold/40 text-accent-gold text-xs tracking-wider uppercase">
                  {tag}
                </span>
              ))}
            </div>

            <h1 className="text-4xl md:text-5xl font-serif mb-6 leading-tight">
              The Dichotomy of Control and the Inner Citadel: Psychoanalytical Explorations of Marcus Aurelius’…
            </h1>

            <div className="flex items-center gap-6 text-sm text-white/60">
              <div className="flex items-center gap-2">
                <Calendar size={14} />
                <time dateTime="2025-11-18">November 17, 2025</time>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={14} />
                <span>3 min read</span>
              </div>
            </div>
          </header>

          {/* Content */}
          <div className="prose prose-invert prose-lg max-w-none">
            <p className="text-white/80 leading-relaxed mb-6">Marcus Aurelius’ seminal work, ‘Meditations’, is a cornerstone of Stoic philosophy, largely recognized for its unique approach to human consciousness and emotional management. One of the profound concepts in this work is the Dichotomy of Control, a concept that Aurelius strategically employs to manage issues such as anxiety and loss. According to this Stoic principle, things in life are divided into those within one’s control (e.g., one’s attitudes and actions) and those beyond it (like others’ opinions, sickness, or death). Aurelius’ personal writings present a vivid testament to this principle, exhibiting a stoic acceptance of life’s inevitable adversities.</p>
            <p className="text-white/80 leading-relaxed mb-6">Aurelius’ application of the Dichotomy of Control is most conspicuous when he addresses anxiety. In Book 8, he states, “You have power over your mind – not outside events. Realize this, and you will find strength.” In this passage, Aurelius reaffirms the concept of dividing life into controllable and uncontrollable elements. Anxiety, according to Aurelius, largely results from futile attempts to exert control over the uncontrollable. By focusing on controlling his mind and reactions, rather than external events, Aurelius demonstrates how one can cope with anxiety.</p>
            <p className="text-white/80 leading-relaxed mb-6">In the context of loss, Aurelius again uses the Dichotomy of Control to navigate his feelings. He wrote in Book 4: “Everything that happens happens as it should, and if you observe carefully, you will find this to be so.” Here, he advocates for acceptance of loss as an inevitable part of life. Instead of dwelling on the uncontrollable occurrence of loss, he emphasizes the importance of adjusting one’s response to such events, reinforcing the Dichotomy of Control’s utility in managing grief and despair.</p>
            <p className="text-white/80 leading-relaxed mb-6">The ‘Inner Citadel’ archetype further explicates Aurelius’ psychoanalytical approach to resilience. The Inner Citadel represents the mind’s fortress, a place of refuge and resilience in the face of external adversities. He portrays this concept in Book 4: “Retreat into yourself. It is in your power to withdraw yourself whenever you desire.” The Inner Citadel, thus, represents an internal psychological space where the Dichotomy of Control is meticulously practiced, rendering him impervious to external influences.</p>
            <p className="text-white/80 leading-relaxed mb-6">In conclusion, Marcus Aurelius, through ‘Meditations’, leverages the Stoic principle of Dichotomy of Control to navigate anxiety and loss effectively. His introspective writings elucidate how acknowledging and differentiating between controllable and uncontrollable aspects of life equips one with emotional resilience. The Inner Citadel, a fortress of the mind, is where this principle is exercised, underscoring its centrality in Stoic philosophy. Aurelius’ practical implementation of these Stoic principles thus offers valuable insights into managing life’s inevitable challenges.</p>
          </div>

          {/* Footer */}
          <footer className="mt-16 pt-8 border-t border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-2">
                {['mental-health', 'philosophy', 'meditation', 'technology', 'dichotomy', 'control', 'inner', 'citadel', 'psychoanalytical'].map((tag) => (
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
