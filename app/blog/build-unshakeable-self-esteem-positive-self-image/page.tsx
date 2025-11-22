import { Metadata } from 'next'
import Navigation from '@/components/navigation'
import { ArrowLeft, Clock, Calendar, BookOpen, ArrowRight, Heart } from 'lucide-react'
import Link from 'next/link'
import { EbookCTA } from '@/components/ebook-cta'


export const metadata: Metadata = {
  title: 'Building Unshakeable Self-Esteem: A Deep Dive into Positive Self-Image | Brandon Mills',
  description: 'Learn the five essential strategies for cultivating genuine self-esteem and confidence. Discover how self-compassion, self-care, and positive self-talk can transform your mental well-being.',
  keywords: ['self-esteem', 'positive self-image', 'self-compassion', 'self-care', 'mental health', 'confidence', 'personal growth', 'psychology'],
  openGraph: {
    title: 'Building Unshakeable Self-Esteem: A Deep Dive into Positive Self-Image',
    description: 'Learn the five essential strategies for cultivating genuine self-esteem and confidence that lasts.',
    type: 'article',
    publishedTime: '2024-11-19',
    authors: ['Brandon Mills'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Building Unshakeable Self-Esteem: A Deep Dive into Positive Self-Image',
    description: 'Learn the five essential strategies for cultivating genuine self-esteem and confidence that lasts.',
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
              {['self-esteem', 'mental-health', 'personal-growth'].map((tag) => (
                <span key={tag} className="px-3 py-1 bg-accent-gold/20 border border-accent-gold/40 text-accent-gold text-xs tracking-wider uppercase">
                  {tag}
                </span>
              ))}
            </div>

            <h1 className="text-4xl md:text-5xl font-serif mb-6 leading-tight">
              Building Unshakeable Self-Esteem: A Deep Dive into Positive Self-Image
            </h1>

            <div className="flex items-center gap-6 text-sm text-white/60">
              <div className="flex items-center gap-2">
                <Calendar size={14} />
                <time dateTime="2024-11-19">November 19, 2024</time>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={14} />
                <span>4 min read</span>
              </div>
            </div>
          </header>

          {/* Content */}
          <div className="prose prose-invert prose-lg max-w-none">
            <p className="text-xl text-white/90 leading-relaxed mb-8 font-light">
              In a world that constantly measures our worth by external achievements, cultivating genuine self-esteem has never been more important - or more challenging. Brandon Mills' essay offers a clear, actionable guide to building the kind of self-image that can weather any storm.
            </p>

            <h2 className="text-2xl font-serif text-white mt-10 mb-4">Why Self-Esteem is Foundational</h2>

            <p className="text-white/80 leading-relaxed mb-6">
              Your self-image isn't just about feeling good - it's the foundation upon which everything else in your life is built. Confidence in relationships, resilience in adversity, motivation in pursuing goals: all of these depend on how you see yourself.
            </p>

            <p className="text-white/80 leading-relaxed mb-6">
              The good news? Self-esteem isn't fixed. It's a skill that can be developed through consistent practice. This essay provides a practical framework for doing exactly that.
            </p>

            <h2 className="text-2xl font-serif text-white mt-10 mb-4">The Five Pillars of Positive Self-Image</h2>

            <div className="space-y-6 my-8">
              <div className="bg-white/5 border border-white/10 p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-accent-gold/20 flex items-center justify-center text-accent-gold font-serif">1</div>
                  <h3 className="text-lg font-serif text-white">Self-Compassion</h3>
                </div>
                <p className="text-white/70">
                  Treat yourself with the same kindness you'd offer a good friend. Acknowledge struggles without judgment, and embrace your limitations with acceptance.
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-accent-gold/20 flex items-center justify-center text-accent-gold font-serif">2</div>
                  <h3 className="text-lg font-serif text-white">Self-Care</h3>
                </div>
                <p className="text-white/70">
                  Physical, emotional, and mental care sends a powerful message: you are worthy of attention. Diet, sleep, exercise, and joy-bringing activities all contribute.
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-accent-gold/20 flex items-center justify-center text-accent-gold font-serif">3</div>
                  <h3 className="text-lg font-serif text-white">Strength Focus</h3>
                </div>
                <p className="text-white/70">
                  Shift attention from weaknesses to strengths. Document your accomplishments and remind yourself regularly of what you're capable of.
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-accent-gold/20 flex items-center justify-center text-accent-gold font-serif">4</div>
                  <h3 className="text-lg font-serif text-white">Positive Environment</h3>
                </div>
                <p className="text-white/70">
                  Surround yourself with people, places, and things that uplift you. Your environment shapes your self-perception more than you realize.
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-accent-gold/20 flex items-center justify-center text-accent-gold font-serif">5</div>
                  <h3 className="text-lg font-serif text-white">Positive Self-Talk</h3>
                </div>
                <p className="text-white/70">
                  Replace "I can't do this" with "I can do this one step at a time." The way you speak to yourself directly shapes your confidence and capability.
                </p>
              </div>
            </div>

            <blockquote className="border-l-2 border-accent-gold pl-6 my-8 italic text-xl text-white/90">
              "Remember, the way you see yourself matters, and you have the power to shape that perception."
            </blockquote>

            <h2 className="text-2xl font-serif text-white mt-10 mb-4">The Transformation Process</h2>

            <p className="text-white/80 leading-relaxed mb-6">
              Building positive self-esteem isn't an overnight fix - it's a gradual transformation that requires patience and consistency. But the rewards are immense:
            </p>

            <ul className="space-y-3 mb-8 text-white/80">
              <li className="flex items-start gap-3">
                <Heart className="text-accent-gold mt-1 flex-shrink-0" size={16} />
                <span>Deeper, more authentic relationships</span>
              </li>
              <li className="flex items-start gap-3">
                <Heart className="text-accent-gold mt-1 flex-shrink-0" size={16} />
                <span>Greater resilience in the face of setbacks</span>
              </li>
              <li className="flex items-start gap-3">
                <Heart className="text-accent-gold mt-1 flex-shrink-0" size={16} />
                <span>Increased motivation and goal achievement</span>
              </li>
              <li className="flex items-start gap-3">
                <Heart className="text-accent-gold mt-1 flex-shrink-0" size={16} />
                <span>Better mental and emotional health overall</span>
              </li>
              <li className="flex items-start gap-3">
                <Heart className="text-accent-gold mt-1 flex-shrink-0" size={16} />
                <span>Freedom from constant self-doubt and comparison</span>
              </li>
            </ul>

            <p className="text-white/80 leading-relaxed mb-8">
              This essay provides both the philosophical foundation and practical steps for anyone ready to invest in their most important asset: themselves.
            </p>

            {/* CTA Section */}
            <div className="bg-gradient-to-br from-accent-gold/10 to-accent-gold/5 border border-accent-gold/30 p-8 my-12">
              <div className="flex items-center gap-3 mb-4">
                <BookOpen className="text-accent-gold" size={24} />
                <h3 className="text-xl font-serif text-white">Read the Full Essay</h3>
              </div>
              <p className="text-white/80 mb-6">
                Get the complete guide to cultivating a positive self-image. Includes detailed strategies, contemplation exercises, and a framework you can start using today.
              </p>
              <Link
                href="/writing/essays/self-esteem-cultivating-positive-self-image"
                className="inline-flex items-center gap-2 bg-accent-gold text-black px-6 py-3 font-medium tracking-wider uppercase text-sm hover:bg-accent-gold/90 transition-colors"
              >
                Read "Self-Esteem: Cultivating a Positive Self Image"
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          {/* Footer */}
          <footer className="mt-16 pt-8 border-t border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-2">
                {['self-esteem', 'self-compassion', 'mental-health', 'personal-growth', 'psychology', 'confidence'].map((tag) => (
                  <span key={tag} className="px-2 py-1 bg-white/5 text-white/40 text-xs">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </footer>
        
      <EbookCTA variant="footer" source="build-unshakeable-self-esteem-positive-self-image" />
</div>
      </article>
    </main>
  )
}
