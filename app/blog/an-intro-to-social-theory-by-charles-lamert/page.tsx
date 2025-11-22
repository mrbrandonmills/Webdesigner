import { Metadata } from 'next'
import Navigation from '@/components/navigation'
import { ArrowLeft, Clock, Calendar, Tag } from 'lucide-react'
import Link from 'next/link'
import { EbookCTA } from '@/components/ebook-cta'


export const metadata: Metadata = {
  title: 'An Intro to “Social Theory” by Charles Lamert | Brandon Mills',
  description: 'Social theory is the study of how society operates and how people interact with each other. It is an interdisciplinary field that draws from various disciplines...',
  keywords: ['mental-health', 'philosophy', 'technology', 'martial-arts', 'intro', '“social', 'theory”', 'charles', 'lamert'],
  openGraph: {
    title: 'An Intro to “Social Theory” by Charles Lamert',
    description: 'Social theory is the study of how society operates and how people interact with each other. It is an interdisciplinary field that draws from various disciplines...',
    type: 'article',
    publishedTime: '2023-02-19',
    authors: ['Brandon Mills'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'An Intro to “Social Theory” by Charles Lamert',
    description: 'Social theory is the study of how society operates and how people interact with each other. It is an interdisciplinary field that draws from various disciplines...',
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
              {['mental-health', 'philosophy', 'technology', 'martial-arts', 'intro', '“social', 'theory”', 'charles', 'lamert'].slice(0, 3).map((tag) => (
                <span key={tag} className="px-3 py-1 bg-accent-gold/20 border border-accent-gold/40 text-accent-gold text-xs tracking-wider uppercase">
                  {tag}
                </span>
              ))}
            </div>

            <h1 className="text-4xl md:text-5xl font-serif mb-6 leading-tight">
              An Intro to “Social Theory” by Charles Lamert
            </h1>

            <div className="flex items-center gap-6 text-sm text-white/60">
              <div className="flex items-center gap-2">
                <Calendar size={14} />
                <time dateTime="2023-02-19">February 18, 2023</time>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={14} />
                <span>3 min read</span>
              </div>
            </div>
          </header>

          {/* Content */}
          <div className="prose prose-invert prose-lg max-w-none">
            <p className="text-white/80 leading-relaxed mb-6">Social theory is the study of how society operates and how people interact with each other. It is an interdisciplinary field that draws from various disciplines such as sociology, psychology, anthropology, philosophy, and political science. A social theory textbook covers a wide range of concepts, ideas, and perspectives on society and its functioning. In this article, we will outline some of the most important points from a social theory textbook.</p>
            <p className="text-white/80 leading-relaxed mb-6">“Social Theory” by Charles Lemert is a comprehensive and accessible introduction to the field of social theory. The book provides a thorough overview of the major schools of thought in social theory, from classical to contemporary perspectives.</p>
            <p className="text-white/80 leading-relaxed mb-6">Lemert begins the book by discussing the origins of social theory in the Enlightenment, and how it evolved in response to the social and political changes that have occurred over the centuries. He then moves on to discuss the major schools of thought in social theory, including structural-functionalism, conflict theory, symbolic interactionism, and postmodernism. For each school of thought, Lemert explains the key concepts and ideas, as well as the historical and intellectual context in which they emerged.</p>
            <p className="text-white/80 leading-relaxed mb-6">One of the strengths of “Social Theory” is its emphasis on the practical implications of social theory. Throughout the book, Lemert shows how social theory can be used to better understand the social world and to effect social change. He provides numerous examples of how social theory has been used to analyze and address social problems, from poverty to racial inequality to environmental degradation.</p>
            <p className="text-white/80 leading-relaxed mb-6">Another strength of the book is its accessibility. Lemert’s writing is clear and engaging, and he does an excellent job of making complex ideas and concepts understandable to a general audience. He also includes numerous examples and illustrations to help readers grasp the key concepts and ideas.</p>
            <p className="text-white/80 leading-relaxed mb-6">While “Social Theory” is primarily an introduction to the field of social theory, it also provides some critical analysis of the limitations and challenges of each school of thought. Lemert acknowledges the critiques and challenges to social theory, including the criticism that it can be overly abstract and detached from real-world concerns. He also notes the ongoing debates and controversies within the field, such as the tension between individualism and collectivism.</p>
            <p className="text-white/80 leading-relaxed mb-6">Overall, “Social Theory” is an excellent introduction to the field of social theory. It provides a comprehensive overview of the major schools of thought, and it emphasizes the practical implications of social theory for understanding and addressing social problems. Lemert’s clear writing and accessible style make this book an ideal resource for students and anyone interested in understanding the social world.</p>
          </div>

          {/* Footer */}
          <footer className="mt-16 pt-8 border-t border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-2">
                {['mental-health', 'philosophy', 'technology', 'martial-arts', 'intro', '“social', 'theory”', 'charles', 'lamert'].map((tag) => (
                  <span key={tag} className="px-2 py-1 bg-white/5 text-white/40 text-xs">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </footer>
        
      <EbookCTA variant="footer" source="an-intro-to-social-theory-by-charles-lamert" />
</div>
      </article>
    </main>
  )
}
