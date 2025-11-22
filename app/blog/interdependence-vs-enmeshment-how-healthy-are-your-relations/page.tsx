import { Metadata } from 'next'
import Navigation from '@/components/navigation'
import { ArrowLeft, Clock, Calendar, Tag } from 'lucide-react'
import Link from 'next/link'
import { EbookCTA } from '@/components/ebook-cta'


export const metadata: Metadata = {
  title: 'Interdependence vs. Enmeshment: How Healthy Are Your Relationships? | Brandon Mills',
  description: 'Human beings are social creatures and as such, we form various kinds of relationships with one another. These relationships can range from casual acquaintancesh...',
  keywords: ['mental-health', 'philosophy', 'technology', 'interdependence', 'enmeshment', 'healthy', 'relationships?'],
  openGraph: {
    title: 'Interdependence vs. Enmeshment: How Healthy Are Your Relationships?',
    description: 'Human beings are social creatures and as such, we form various kinds of relationships with one another. These relationships can range from casual acquaintancesh...',
    type: 'article',
    publishedTime: '2023-02-24',
    authors: ['Brandon Mills'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Interdependence vs. Enmeshment: How Healthy Are Your Relationships?',
    description: 'Human beings are social creatures and as such, we form various kinds of relationships with one another. These relationships can range from casual acquaintancesh...',
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
              {['mental-health', 'philosophy', 'technology', 'interdependence', 'enmeshment', 'healthy', 'relationships?'].slice(0, 3).map((tag) => (
                <span key={tag} className="px-3 py-1 bg-accent-gold/20 border border-accent-gold/40 text-accent-gold text-xs tracking-wider uppercase">
                  {tag}
                </span>
              ))}
            </div>

            <h1 className="text-4xl md:text-5xl font-serif mb-6 leading-tight">
              Interdependence vs. Enmeshment: How Healthy Are Your Relationships?
            </h1>

            <div className="flex items-center gap-6 text-sm text-white/60">
              <div className="flex items-center gap-2">
                <Calendar size={14} />
                <time dateTime="2023-02-24">February 23, 2023</time>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={14} />
                <span>3 min read</span>
              </div>
            </div>
          </header>

          {/* Content */}
          <div className="prose prose-invert prose-lg max-w-none">
            <p className="text-white/80 leading-relaxed mb-6">Human beings are social creatures and as such, we form various kinds of relationships with one another. These relationships can range from casual acquaintanceships to deep, intimate bonds. In any kind of relationship, there is a certain level of connection and interaction between the individuals involved. However, there is a distinct difference between interdependence and enmeshment in human relationships.</p>
            <p className="text-white/80 leading-relaxed mb-6">Interdependence is a healthy form of relationship where each person maintains their individuality and autonomy while also relying on and supporting one another. In an interdependent relationship, each person has their own thoughts, feelings, and desires but they also recognize the importance of working together and supporting each other. This type of relationship is characterized by mutual trust, respect, and communication. In an interdependent relationship, the individuals involved can function independently, but they also choose to rely on each other for emotional, physical, or financial support.</p>
            <p className="text-white/80 leading-relaxed mb-6">Enmeshment, on the other hand, is an unhealthy form of relationship where the individuals involved have a blurred sense of personal boundaries and individuality. In an enmeshed relationship, one or both individuals tend to lose their sense of self as they become too reliant on the other person. There is a lack of differentiation and independence in an enmeshed relationship, which can lead to feelings of anxiety, guilt, or even resentment. In an enmeshed relationship, the individuals involved may feel as though they need the other person to function, and they may struggle to establish their own identities.</p>
            <p className="text-white/80 leading-relaxed mb-6">One key difference between interdependence and enmeshment is the level of emotional attachment. In an interdependent relationship, there is a healthy level of emotional attachment, which allows each person to be supportive and caring towards the other while still respecting the other’s autonomy. In an enmeshed relationship, the emotional attachment can be overwhelming and all-consuming, which can lead to an unhealthy level of dependence and neediness.</p>
            <p className="text-white/80 leading-relaxed mb-6">Another difference between the two is the level of personal boundaries. In an interdependent relationship, each person has clear personal boundaries that they respect, which allows them to maintain their sense of individuality while still working together. In an enmeshed relationship, personal boundaries are often blurred or non-existent, which can lead to a lack of differentiation and independence.</p>
            <p className="text-white/80 leading-relaxed mb-6">Contemplation: It is important to understand the difference between interdependence and enmeshment in human relationships. Interdependence allows for a healthy level of mutual reliance and support, while also allowing each person to maintain their individuality. Enmeshment, on the other hand, can be unhealthy and lead to a lack of personal boundaries and individuality. It is important to strive for interdependence in all of our relationships to create a healthy balance between our individuality and our connections with others.</p>
          </div>

          {/* Footer */}
          <footer className="mt-16 pt-8 border-t border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-2">
                {['mental-health', 'philosophy', 'technology', 'interdependence', 'enmeshment', 'healthy', 'relationships?'].map((tag) => (
                  <span key={tag} className="px-2 py-1 bg-white/5 text-white/40 text-xs">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </footer>
        
      <EbookCTA variant="footer" source="interdependence-vs-enmeshment-how-healthy-are-your-relations" />
</div>
      </article>
    </main>
  )
}
