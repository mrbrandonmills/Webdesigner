import { Metadata } from 'next'
import Navigation from '@/components/navigation'
import { ArrowLeft, Clock, Calendar, Tag } from 'lucide-react'
import Link from 'next/link'
import { EbookCTA } from '@/components/ebook-cta'


export const metadata: Metadata = {
  title: 'Codependency: How to Spot it in Your Workplace | Brandon Mills',
  description: 'Codependency is a behavioral pattern that is often associated with personal relationships, but it can also occur in the workplace. Codependency can manifest as...',
  keywords: ['mental-health', 'personal-growth', 'codependency', 'spot', 'workplace'],
  openGraph: {
    title: 'Codependency: How to Spot it in Your Workplace',
    description: 'Codependency is a behavioral pattern that is often associated with personal relationships, but it can also occur in the workplace. Codependency can manifest as...',
    type: 'article',
    publishedTime: '2023-02-19',
    authors: ['Brandon Mills'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Codependency: How to Spot it in Your Workplace',
    description: 'Codependency is a behavioral pattern that is often associated with personal relationships, but it can also occur in the workplace. Codependency can manifest as...',
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
              {['mental-health', 'personal-growth', 'codependency', 'spot', 'workplace'].slice(0, 3).map((tag) => (
                <span key={tag} className="px-3 py-1 bg-accent-gold/20 border border-accent-gold/40 text-accent-gold text-xs tracking-wider uppercase">
                  {tag}
                </span>
              ))}
            </div>

            <h1 className="text-4xl md:text-5xl font-serif mb-6 leading-tight">
              Codependency: How to Spot it in Your Workplace
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
            <p className="text-white/80 leading-relaxed mb-6">Codependency is a behavioral pattern that is often associated with personal relationships, but it can also occur in the workplace. Codependency can manifest as an unhealthy reliance on others, an inability to set boundaries, and a tendency to prioritize the needs of others over one’s own needs. This can have serious negative impacts on the individual, the team, and the organization as a whole.</p>
            <p className="text-white/80 leading-relaxed mb-6">Recognizing codependency in the workplace is important for both employees and employers. When individuals are aware of their own codependent tendencies, they can take steps to address them and improve their overall well-being. Employers who recognize codependency in their employees can also take steps to create a healthier work environment that is more conducive to productivity and success.</p>
            <p className="text-white/80 leading-relaxed mb-6">Here are some common signs of codependency in the workplace:</p>
            <p className="text-white/80 leading-relaxed mb-6">If you recognize these signs in yourself or a colleague, it’s important to take steps to address codependency in the workplace. Here are some strategies that can help:</p>
            <p className="text-white/80 leading-relaxed mb-6">Final Thought: Recognizing codependency in the workplace is crucial for improving individual and team well-being. By identifying and addressing codependent tendencies, employees and employers can work together to create a healthier and more productive work environment. If you’re struggling with codependency in the workplace, consider reaching out for support and implementing strategies to improve your overall well-being.</p>
          </div>

          {/* Footer */}
          <footer className="mt-16 pt-8 border-t border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-2">
                {['mental-health', 'personal-growth', 'codependency', 'spot', 'workplace'].map((tag) => (
                  <span key={tag} className="px-2 py-1 bg-white/5 text-white/40 text-xs">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </footer>
        
      <EbookCTA variant="footer" source="codependency-how-to-spot-it-in-your-workplace" />
</div>
      </article>
    </main>
  )
}
