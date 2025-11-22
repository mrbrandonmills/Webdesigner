import { Metadata } from 'next'
import Navigation from '@/components/navigation'
import { ArrowLeft, Clock, Calendar, Tag } from 'lucide-react'
import Link from 'next/link'
import { EbookCTA } from '@/components/ebook-cta'


export const metadata: Metadata = {
  title: 'Quantum Physics: The Double Slit Experiment Explained | Brandon Mills',
  description: 'The quantum double-slit experiment is a classic experiment that demonstrates the wave-particle duality of matter. The experiment is easy to set up, but its resu...',
  keywords: ['philosophy', 'science', 'technology', 'personal-growth', 'quantum', 'physics', 'double', 'slit', 'experiment'],
  openGraph: {
    title: 'Quantum Physics: The Double Slit Experiment Explained',
    description: 'The quantum double-slit experiment is a classic experiment that demonstrates the wave-particle duality of matter. The experiment is easy to set up, but its resu...',
    type: 'article',
    publishedTime: '2023-02-24',
    authors: ['Brandon Mills'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Quantum Physics: The Double Slit Experiment Explained',
    description: 'The quantum double-slit experiment is a classic experiment that demonstrates the wave-particle duality of matter. The experiment is easy to set up, but its resu...',
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
              {['philosophy', 'science', 'technology', 'personal-growth', 'quantum', 'physics', 'double', 'slit', 'experiment'].slice(0, 3).map((tag) => (
                <span key={tag} className="px-3 py-1 bg-accent-gold/20 border border-accent-gold/40 text-accent-gold text-xs tracking-wider uppercase">
                  {tag}
                </span>
              ))}
            </div>

            <h1 className="text-4xl md:text-5xl font-serif mb-6 leading-tight">
              Quantum Physics: The Double Slit Experiment Explained
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
            <p className="text-white/80 leading-relaxed mb-6">The quantum double-slit experiment is a classic experiment that demonstrates the wave-particle duality of matter. The experiment is easy to set up, but its results can be mind-boggling. In this article, we will explain what the experiment is, how it is performed, and what the results mean.</p>
            <p className="text-white/80 leading-relaxed mb-6">The experiment involves firing a stream of particles, such as electrons or photons, at a screen with two small slits in it. Behind the screen is a detector that records where the particles land. The surprising result is that when the particles are fired one at a time, they form an interference pattern on the detector, as if they were waves interfering with each other.</p>
            <p className="text-white/80 leading-relaxed mb-6">This interference pattern is only expected if the particles are behaving like waves. When a wave passes through two slits, it creates an interference pattern on the other side, with bright and dark fringes. The waves interfere constructively in the bright fringes and destructively in the dark fringes.</p>
            <p className="text-white/80 leading-relaxed mb-6">The strange thing is that even when the experiment is repeated with just one particle at a time, the interference pattern still appears. Each particle seems to pass through both slits and interfere with itself. This is the essence of wave-particle duality: particles can behave like waves, and waves can behave like particles.</p>
            <p className="text-white/80 leading-relaxed mb-6">The experiment has many interpretations, but the most widely accepted one is the Copenhagen interpretation. This interpretation states that the particle does not have a definite position until it is observed. Before observation, the particle exists as a superposition of all possible positions. When the particle is observed, the wave function collapses, and the particle takes on a definite position.</p>
            <p className="text-white/80 leading-relaxed mb-6">In other words, the act of measurement determines the outcome of the experiment. This is a bizarre and counterintuitive concept, but it has been verified in countless experiments. The Copenhagen interpretation is the foundation of quantum mechanics, the most successful and accurate theory of the microscopic world.</p>
            <p className="text-white/80 leading-relaxed mb-6">The double-slit experiment has many applications in science and technology, such as in the development of quantum computers and the study of the quantum behavior of matter. The experiment has also captured the imagination of the public and has been used as a metaphor for various philosophical and spiritual ideas.</p>
            <p className="text-white/80 leading-relaxed mb-6">Contemplation: The quantum double-slit experiment is a fascinating experiment that demonstrates the wave-particle duality of matter. The experiment shows that particles can behave like waves and interfere with themselves, and that the act of measurement determines the outcome of the experiment. The experiment has many applications in science and technology, and its results have profound implications for our understanding of the nature of reality.</p>
          </div>

          {/* Footer */}
          <footer className="mt-16 pt-8 border-t border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-2">
                {['philosophy', 'science', 'technology', 'personal-growth', 'quantum', 'physics', 'double', 'slit', 'experiment'].map((tag) => (
                  <span key={tag} className="px-2 py-1 bg-white/5 text-white/40 text-xs">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </footer>
        
      <EbookCTA variant="footer" source="quantum-physics-the-double-slit-experiment-explained" />
</div>
      </article>
    </main>
  )
}
