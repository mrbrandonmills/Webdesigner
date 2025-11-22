import { Metadata } from 'next'
import Navigation from '@/components/navigation'
import { ArrowLeft, Clock, Calendar, Tag } from 'lucide-react'
import Link from 'next/link'
import { EbookCTA } from '@/components/ebook-cta'


export const metadata: Metadata = {
  title: 'Codependency Awareness: Are You Addicted to People? | Brandon Mills',
  description: 'Codependency is a term used to describe a pattern of behavior in which a person becomes excessively dependent on someone else, to the point where their own well...',
  keywords: ['mental-health', 'meditation', 'personal-growth', 'codependency', 'awareness', 'addicted', 'people?'],
  openGraph: {
    title: 'Codependency Awareness: Are You Addicted to People?',
    description: 'Codependency is a term used to describe a pattern of behavior in which a person becomes excessively dependent on someone else, to the point where their own well...',
    type: 'article',
    publishedTime: '2023-02-19',
    authors: ['Brandon Mills'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Codependency Awareness: Are You Addicted to People?',
    description: 'Codependency is a term used to describe a pattern of behavior in which a person becomes excessively dependent on someone else, to the point where their own well...',
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
              {['mental-health', 'meditation', 'personal-growth', 'codependency', 'awareness', 'addicted', 'people?'].slice(0, 3).map((tag) => (
                <span key={tag} className="px-3 py-1 bg-accent-gold/20 border border-accent-gold/40 text-accent-gold text-xs tracking-wider uppercase">
                  {tag}
                </span>
              ))}
            </div>

            <h1 className="text-4xl md:text-5xl font-serif mb-6 leading-tight">
              Codependency Awareness: Are You Addicted to People?
            </h1>

            <div className="flex items-center gap-6 text-sm text-white/60">
              <div className="flex items-center gap-2">
                <Calendar size={14} />
                <time dateTime="2023-02-19">February 18, 2023</time>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={14} />
                <span>2 min read</span>
              </div>
            </div>
          </header>

          {/* Content */}
          <div className="prose prose-invert prose-lg max-w-none">
            <p className="text-white/80 leading-relaxed mb-6">Codependency is a term used to describe a pattern of behavior in which a person becomes excessively dependent on someone else, to the point where their own well-being and sense of self become intertwined with the other person’s. This can occur in any type of relationship, but it is most commonly associated with romantic partnerships, where one person becomes overly enmeshed with their partner and sacrifices their own needs and desires in the process.</p>
            <p className="text-white/80 leading-relaxed mb-6">Codependency is a complex issue that can be difficult to identify and address. Often, people who are codependent are not aware of their behavior and may not realize that it is causing problems in their lives. However, recognizing the signs of codependency and understanding the impact it can have is an important step towards healing and creating healthier relationships.</p>
            <p className="text-white/80 leading-relaxed mb-6">Some common signs of codependency include:</p>
            <p className="text-white/80 leading-relaxed mb-6">If you recognize these signs in yourself, it’s important to seek help and support. Codependency can have serious negative effects on your mental health, self-esteem, and overall quality of life. It can also harm your relationships and prevent you from forming healthy connections with others.</p>
            <p className="text-white/80 leading-relaxed mb-6">One of the most important steps in overcoming codependency is to recognize that it is a problem and to seek help. This can involve working with a therapist or counselor who can help you identify the underlying issues that may be contributing to your codependency, and develop strategies to build healthier relationships and create a more balanced sense of self.</p>
            <p className="text-white/80 leading-relaxed mb-6">Another important step is to work on building your own self-esteem and sense of identity. This can involve engaging in activities that bring you joy and fulfillment, setting boundaries with others, and learning to express your own needs and desires in a healthy and assertive way.</p>
            <p className="text-white/80 leading-relaxed mb-6">It’s also important to surround yourself with supportive and understanding people. Codependency often arises from a sense of loneliness or a lack of social support, so building a strong network of friends and family can be a key factor in overcoming this pattern of behavior.</p>
            <p className="text-white/80 leading-relaxed mb-6">Final Thought, codependency is a complex issue that can have serious negative effects on your mental health and relationships. However, with awareness, support, and effort, it is possible to overcome codependency and create healthier, more fulfilling relationships with others. If you recognize the signs of codependency in yourself, it’s important to seek help and support to begin the healing process.</p>
          </div>

          {/* Footer */}
          <footer className="mt-16 pt-8 border-t border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-2">
                {['mental-health', 'meditation', 'personal-growth', 'codependency', 'awareness', 'addicted', 'people?'].map((tag) => (
                  <span key={tag} className="px-2 py-1 bg-white/5 text-white/40 text-xs">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </footer>
        
      <EbookCTA variant="footer" source="codependency-awareness-are-you-addicted-to-people" />
</div>
      </article>
    </main>
  )
}
