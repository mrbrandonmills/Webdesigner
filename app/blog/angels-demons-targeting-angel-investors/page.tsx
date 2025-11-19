import { Metadata } from 'next'
import Navigation from '@/components/navigation'
import { ArrowLeft, Clock, Calendar, Tag } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Angels & Demons: Targeting Angel Investors | Brandon Mills',
  description: 'When it comes to launching a startup, securing funding is often a critical step in turning your idea into a viable business. While there are various options for...',
  keywords: ['business', 'science', 'angels', 'demons', 'targeting', 'angel', 'investors'],
  openGraph: {
    title: 'Angels & Demons: Targeting Angel Investors',
    description: 'When it comes to launching a startup, securing funding is often a critical step in turning your idea into a viable business. While there are various options for...',
    type: 'article',
    publishedTime: '2023-02-19',
    authors: ['Brandon Mills'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Angels & Demons: Targeting Angel Investors',
    description: 'When it comes to launching a startup, securing funding is often a critical step in turning your idea into a viable business. While there are various options for...',
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
              {['business', 'science', 'angels', 'demons', 'targeting', 'angel', 'investors'].slice(0, 3).map((tag) => (
                <span key={tag} className="px-3 py-1 bg-accent-gold/20 border border-accent-gold/40 text-accent-gold text-xs tracking-wider uppercase">
                  {tag}
                </span>
              ))}
            </div>

            <h1 className="text-4xl md:text-5xl font-serif mb-6 leading-tight">
              Angels & Demons: Targeting Angel Investors
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
            <p className="text-white/80 leading-relaxed mb-6">When it comes to launching a startup, securing funding is often a critical step in turning your idea into a viable business. While there are various options for funding, including bootstrapping, crowdfunding, and loans, angel investing can be an attractive option for many startups. In this article, we will explore how to get angel investors for your startup.</p>
            <p className="text-white/80 leading-relaxed mb-6">What are Angel Investors? Angel investors are typically high net worth individuals who provide funding for early-stage startups in exchange for equity in the company. Unlike venture capitalists, who typically invest in later-stage companies, angel investors are often more willing to take on greater risk in exchange for the potential for higher returns. In addition to providing funding, angel investors can often provide valuable advice and connections to help your startup grow.</p>
            <p className="text-white/80 leading-relaxed mb-6">Steps to Get Angel Investors for Your Startup</p>
            <p className="text-white/80 leading-relaxed mb-6">In conclusion, getting angel investors for your startup can be a challenging but rewarding process. By developing a strong pitch, researching potential investors, building relationships, developing a term sheet, and closing the deal, you can increase the likelihood of securing funding for your startup. It’s important to remember that angel investing is a high-risk, high-reward proposition, and it’s important to do your due diligence and assess the risks and rewards of any investment opportunity. With careful planning and execution, however, angel investing can be a valuable source of funding for early-stage startups.</p>
          </div>

          {/* Footer */}
          <footer className="mt-16 pt-8 border-t border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-2">
                {['business', 'science', 'angels', 'demons', 'targeting', 'angel', 'investors'].map((tag) => (
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
