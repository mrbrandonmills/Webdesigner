import { Metadata } from 'next'
import Navigation from '@/components/navigation'
import { ArrowLeft, Clock, Calendar, Tag } from 'lucide-react'
import Link from 'next/link'
import { EbookCTA } from '@/components/ebook-cta'


export const metadata: Metadata = {
  title: 'Searching for Life on Other Planets: What’s Missing? | Brandon Mills',
  description: 'The question of whether life exists beyond our planet has captivated humans for centuries. With the advancement of science and technology, we are now able to ex...',
  keywords: ['science', 'technology', 'searching', 'life', 'other', 'planets', 'what’s'],
  openGraph: {
    title: 'Searching for Life on Other Planets: What’s Missing?',
    description: 'The question of whether life exists beyond our planet has captivated humans for centuries. With the advancement of science and technology, we are now able to ex...',
    type: 'article',
    publishedTime: '2023-02-20',
    authors: ['Brandon Mills'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Searching for Life on Other Planets: What’s Missing?',
    description: 'The question of whether life exists beyond our planet has captivated humans for centuries. With the advancement of science and technology, we are now able to ex...',
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
              {['science', 'technology', 'searching', 'life', 'other', 'planets', 'what’s'].slice(0, 3).map((tag) => (
                <span key={tag} className="px-3 py-1 bg-accent-gold/20 border border-accent-gold/40 text-accent-gold text-xs tracking-wider uppercase">
                  {tag}
                </span>
              ))}
            </div>

            <h1 className="text-4xl md:text-5xl font-serif mb-6 leading-tight">
              Searching for Life on Other Planets: What’s Missing?
            </h1>

            <div className="flex items-center gap-6 text-sm text-white/60">
              <div className="flex items-center gap-2">
                <Calendar size={14} />
                <time dateTime="2023-02-20">February 19, 2023</time>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={14} />
                <span>3 min read</span>
              </div>
            </div>
          </header>

          {/* Content */}
          <div className="prose prose-invert prose-lg max-w-none">
            <p className="text-white/80 leading-relaxed mb-6">The question of whether life exists beyond our planet has captivated humans for centuries. With the advancement of science and technology, we are now able to explore the vast universe and search for signs of extraterrestrial life. One way to approach this question is through the lens of mathematical probability. By considering the conditions necessary for life to exist and the abundance of potential habitats, we can estimate the likelihood of finding life on other planets.</p>
            <p className="text-white/80 leading-relaxed mb-6">One of the key factors in the search for life is the presence of liquid water. Water is essential for all known forms of life on Earth, and thus, the presence of liquid water on a planet is often considered a prerequisite for the existence of life. The habitable zone, also known as the Goldilocks zone, is the region around a star where conditions are just right for liquid water to exist on the surface of a planet. This zone is determined by the star’s size and temperature, as well as the planet’s distance from the star.</p>
            <p className="text-white/80 leading-relaxed mb-6">Using this information, scientists have estimated the number of potentially habitable planets in our Milky Way galaxy alone. In a 2013 study, researchers from the Harvard-Smithsonian Center for Astrophysics estimated that there are at least 17 billion Earth-sized planets in the Milky Way, with approximately one in five of those located in the habitable zone of its star. This means that there are likely billions of potentially habitable planets in our galaxy alone.</p>
            <p className="text-white/80 leading-relaxed mb-6">However, the presence of liquid water alone does not guarantee the existence of life. There are many other factors that must be considered, such as the planet’s atmospheric composition, geological activity, and the presence of organic molecules. The likelihood of finding life on other planets is also influenced by the conditions that existed during the planet’s formation and evolution. For example, a planet that formed too close to its star may have lost its atmosphere due to intense solar radiation, while a planet that formed too far away may have a frozen surface.</p>
            <p className="text-white/80 leading-relaxed mb-6">Despite these challenges, there are many ongoing efforts to search for signs of extraterrestrial life. One of the most promising approaches is the search for biosignatures, which are chemical or physical indications of life that can be detected from a distance. For example, the presence of certain gases, such as oxygen, methane, or nitrous oxide, in a planet’s atmosphere could be a sign of biological activity.</p>
            <p className="text-white/80 leading-relaxed mb-6">In addition to searching for biosignatures, scientists are also exploring the possibility of microbial life in extreme environments, such as deep-sea hydrothermal vents or subsurface oceans on icy moons. These environments may not be hospitable to complex life forms, but they could provide important clues about the origins of life and the conditions necessary for its survival.</p>
            <p className="text-white/80 leading-relaxed mb-6">Ultimatley, the mathematical probability of life on other planets in our universe is difficult to estimate with certainty. While there are many potentially habitable planets in our galaxy alone, the existence of life depends on a multitude of factors, many of which are still unknown. Nevertheless, the search for extraterrestrial life is a fascinating and important endeavor that could have profound implications for our understanding of the universe and our place in it.</p>
          </div>

          {/* Footer */}
          <footer className="mt-16 pt-8 border-t border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-2">
                {['science', 'technology', 'searching', 'life', 'other', 'planets', 'what’s'].map((tag) => (
                  <span key={tag} className="px-2 py-1 bg-white/5 text-white/40 text-xs">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </footer>
        
      <EbookCTA variant="footer" source="searching-for-life-on-other-planets-whats-missing" />
</div>
      </article>
    </main>
  )
}
