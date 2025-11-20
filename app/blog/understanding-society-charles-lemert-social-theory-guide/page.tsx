import { Metadata } from 'next'
import Navigation from '@/components/navigation'
import { ArrowLeft, Clock, Calendar, BookOpen, ArrowRight, Users } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Understanding Society: Your Guide to Charles Lemert\'s Social Theory | Brandon Mills',
  description: 'A comprehensive introduction to social theory through Charles Lemert\'s acclaimed work. Learn about social structure, power dynamics, culture, globalization, and how these forces shape our world.',
  keywords: ['social theory', 'Charles Lemert', 'sociology', 'social structure', 'power and inequality', 'globalization', 'social change', 'philosophy'],
  openGraph: {
    title: 'Understanding Society: Your Guide to Charles Lemert\'s Social Theory',
    description: 'A comprehensive introduction to social theory and how it helps us understand power, culture, and social change.',
    type: 'article',
    publishedTime: '2024-11-19',
    authors: ['Brandon Mills'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Understanding Society: Your Guide to Charles Lemert\'s Social Theory',
    description: 'A comprehensive introduction to social theory and how it helps us understand power, culture, and social change.',
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
              {['sociology', 'philosophy', 'social-theory'].map((tag) => (
                <span key={tag} className="px-3 py-1 bg-accent-gold/20 border border-accent-gold/40 text-accent-gold text-xs tracking-wider uppercase">
                  {tag}
                </span>
              ))}
            </div>

            <h1 className="text-4xl md:text-5xl font-serif mb-6 leading-tight">
              Understanding Society: Your Guide to Charles Lemert's Social Theory
            </h1>

            <div className="flex items-center gap-6 text-sm text-white/60">
              <div className="flex items-center gap-2">
                <Calendar size={14} />
                <time dateTime="2024-11-19">November 19, 2024</time>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={14} />
                <span>6 min read</span>
              </div>
            </div>
          </header>

          {/* Content */}
          <div className="prose prose-invert prose-lg max-w-none">
            <p className="text-xl text-white/90 leading-relaxed mb-8 font-light">
              Ever wondered why society works the way it does? Why do some people hold power while others don't? How does culture shape our behavior? Brandon Mills' essay provides an accessible introduction to these fundamental questions through Charles Lemert's influential work on social theory.
            </p>

            <h2 className="text-2xl font-serif text-white mt-10 mb-4">Why Social Theory Matters</h2>

            <p className="text-white/80 leading-relaxed mb-6">
              Social theory isn't just academic abstraction - it's the lens through which we can understand everything from workplace dynamics to global movements. It helps us see the invisible structures that shape our daily lives and gives us tools to effect meaningful change.
            </p>

            <p className="text-white/80 leading-relaxed mb-6">
              Whether you're interested in understanding political movements, workplace culture, economic inequality, or simply why people behave the way they do, social theory provides essential frameworks for analysis.
            </p>

            <h2 className="text-2xl font-serif text-white mt-10 mb-4">Core Concepts Explored</h2>

            <div className="grid gap-4 my-8">
              <div className="border border-white/10 p-6 hover:border-accent-gold/30 transition-colors">
                <div className="flex items-start gap-4">
                  <Users className="text-accent-gold mt-1 flex-shrink-0" size={20} />
                  <div>
                    <h3 className="text-lg font-serif text-accent-gold mb-2">Social Structure</h3>
                    <p className="text-white/70 text-base">
                      The patterned arrangements - institutions, norms, values, roles, and status - that guide individual and group behavior. Understanding structure reveals why society feels the way it does.
                    </p>
                  </div>
                </div>
              </div>

              <div className="border border-white/10 p-6 hover:border-accent-gold/30 transition-colors">
                <div className="flex items-start gap-4">
                  <Users className="text-accent-gold mt-1 flex-shrink-0" size={20} />
                  <div>
                    <h3 className="text-lg font-serif text-accent-gold mb-2">Power & Inequality</h3>
                    <p className="text-white/70 text-base">
                      How resources, opportunities, and influence are distributed - and why it matters. Social theorists examine how power operates across different contexts.
                    </p>
                  </div>
                </div>
              </div>

              <div className="border border-white/10 p-6 hover:border-accent-gold/30 transition-colors">
                <div className="flex items-start gap-4">
                  <Users className="text-accent-gold mt-1 flex-shrink-0" size={20} />
                  <div>
                    <h3 className="text-lg font-serif text-accent-gold mb-2">Culture's Influence</h3>
                    <p className="text-white/70 text-base">
                      Shared beliefs, values, practices, and symbols that define a society and shape our attitudes, behaviors, and perceptions of the world.
                    </p>
                  </div>
                </div>
              </div>

              <div className="border border-white/10 p-6 hover:border-accent-gold/30 transition-colors">
                <div className="flex items-start gap-4">
                  <Users className="text-accent-gold mt-1 flex-shrink-0" size={20} />
                  <div>
                    <h3 className="text-lg font-serif text-accent-gold mb-2">Globalization</h3>
                    <p className="text-white/70 text-base">
                      How increasing interconnectedness through technology, transportation, and communication transforms culture, economics, politics, and social interactions worldwide.
                    </p>
                  </div>
                </div>
              </div>

              <div className="border border-white/10 p-6 hover:border-accent-gold/30 transition-colors">
                <div className="flex items-start gap-4">
                  <Users className="text-accent-gold mt-1 flex-shrink-0" size={20} />
                  <div>
                    <h3 className="text-lg font-serif text-accent-gold mb-2">Social Change & Movements</h3>
                    <p className="text-white/70 text-base">
                      How societies transform over time, and the organized efforts by individuals and groups to bring about social, cultural, or political change.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-serif text-white mt-10 mb-4">About Lemert's Approach</h2>

            <p className="text-white/80 leading-relaxed mb-6">
              What makes Lemert's "Social Theory" particularly valuable is its accessibility and practical focus. He doesn't just explain abstract concepts - he shows how they apply to real-world problems like poverty, racial inequality, and environmental degradation.
            </p>

            <p className="text-white/80 leading-relaxed mb-6">
              The book traces social theory from its Enlightenment origins through major schools of thought: structural-functionalism, conflict theory, symbolic interactionism, and postmodernism. For each, Lemert provides historical context, key concepts, and critical analysis.
            </p>

            <blockquote className="border-l-2 border-accent-gold pl-6 my-8 italic text-xl text-white/90">
              "Social theory can be used to better understand the social world and to effect social change."
            </blockquote>

            <h2 className="text-2xl font-serif text-white mt-10 mb-4">Who Should Read This</h2>

            <p className="text-white/80 leading-relaxed mb-6">
              This essay serves as an ideal entry point for:
            </p>

            <ul className="space-y-3 mb-8 text-white/80">
              <li className="flex items-start gap-3">
                <span className="text-accent-gold mt-1">-</span>
                <span>Students encountering social theory for the first time</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent-gold mt-1">-</span>
                <span>Professionals seeking to understand organizational and social dynamics</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent-gold mt-1">-</span>
                <span>Activists wanting theoretical grounding for their work</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent-gold mt-1">-</span>
                <span>Anyone curious about why society operates the way it does</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent-gold mt-1">-</span>
                <span>Readers interested in the history of sociological thought</span>
              </li>
            </ul>

            <p className="text-white/80 leading-relaxed mb-8">
              Understanding social theory doesn't just satisfy intellectual curiosity - it equips you with powerful tools for navigating and influencing the social world around you.
            </p>

            {/* CTA Section */}
            <div className="bg-gradient-to-br from-accent-gold/10 to-accent-gold/5 border border-accent-gold/30 p-8 my-12">
              <div className="flex items-center gap-3 mb-4">
                <BookOpen className="text-accent-gold" size={24} />
                <h3 className="text-xl font-serif text-white">Read the Full Essay</h3>
              </div>
              <p className="text-white/80 mb-6">
                Get the complete overview of social theory concepts and Lemert's influential work. Perfect for beginners seeking a solid foundation in understanding society.
              </p>
              <Link
                href="/writing/essays/intro-to-social-theory"
                className="inline-flex items-center gap-2 bg-accent-gold text-black px-6 py-3 font-medium tracking-wider uppercase text-sm hover:bg-accent-gold/90 transition-colors"
              >
                Read "An Intro to Social Theory by Charles Lemert"
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          {/* Footer */}
          <footer className="mt-16 pt-8 border-t border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-2">
                {['social-theory', 'sociology', 'philosophy', 'Charles-Lemert', 'social-change', 'power-structures'].map((tag) => (
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
