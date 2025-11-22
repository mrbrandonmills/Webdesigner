import { Metadata } from 'next'
import Navigation from '@/components/navigation'
import { ArrowLeft, Clock, Calendar, Tag } from 'lucide-react'
import Link from 'next/link'
import { EbookCTA } from '@/components/ebook-cta'


export const metadata: Metadata = {
  title: 'Digital Labour: Pros vs Cons | Brandon Mills',
  description: 'The digital age has brought about significant changes in the way we live, work, and interact with one another. One of the most significant changes is the emerge...',
  keywords: ['technology', 'martial-arts', 'personal-growth', 'digital', 'labour', 'pros', 'cons'],
  openGraph: {
    title: 'Digital Labour: Pros vs Cons',
    description: 'The digital age has brought about significant changes in the way we live, work, and interact with one another. One of the most significant changes is the emerge...',
    type: 'article',
    publishedTime: '2023-02-27',
    authors: ['Brandon Mills'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Digital Labour: Pros vs Cons',
    description: 'The digital age has brought about significant changes in the way we live, work, and interact with one another. One of the most significant changes is the emerge...',
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
              {['technology', 'martial-arts', 'personal-growth', 'digital', 'labour', 'pros', 'cons'].slice(0, 3).map((tag) => (
                <span key={tag} className="px-3 py-1 bg-accent-gold/20 border border-accent-gold/40 text-accent-gold text-xs tracking-wider uppercase">
                  {tag}
                </span>
              ))}
            </div>

            <h1 className="text-4xl md:text-5xl font-serif mb-6 leading-tight">
              Digital Labour: Pros vs Cons
            </h1>

            <div className="flex items-center gap-6 text-sm text-white/60">
              <div className="flex items-center gap-2">
                <Calendar size={14} />
                <time dateTime="2023-02-27">February 26, 2023</time>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={14} />
                <span>1 min read</span>
              </div>
            </div>
          </header>

          {/* Content */}
          <div className="prose prose-invert prose-lg max-w-none">
            <p className="text-white/80 leading-relaxed mb-6">The digital age has brought about significant changes in the way we live, work, and interact with one another. One of the most significant changes is the emergence of digital labor, where individuals work remotely and use technology to complete tasks. This article will explore the pros and cons of digital labor, and how it is impacting the workforce.</p>
            <p className="text-white/80 leading-relaxed mb-6">Pros of Digital Labor</p>
            <p className="text-white/80 leading-relaxed mb-6">Cons of Digital Labor</p>
            <p className="text-white/80 leading-relaxed mb-6">Conclusion</p>
            <p className="text-white/80 leading-relaxed mb-6">Digital labor is an emerging trend that is transforming the way we work. While it offers many benefits, such as increased flexibility, reduced costs, and improved productivity, it also poses challenges, such as social isolation, lack of supervision, and technological issues. As more and more individuals embrace digital labor, it is essential to be mindful of these pros and cons and take steps to mitigate any potential negative impacts. Employers must also be mindful of the challenges that digital labor presents and take steps to address them, such as providing regular training and support for remote workers, establishing clear communication channels, and implementing robust data security measures. By doing so, we can ensure that digital labor continues to be a force for positive change in the workforce.</p>
          </div>

          {/* Footer */}
          <footer className="mt-16 pt-8 border-t border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-2">
                {['technology', 'martial-arts', 'personal-growth', 'digital', 'labour', 'pros', 'cons'].map((tag) => (
                  <span key={tag} className="px-2 py-1 bg-white/5 text-white/40 text-xs">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </footer>
        
      <EbookCTA variant="footer" source="digital-labour-pros-vs-cons" />
</div>
      </article>
    </main>
  )
}
