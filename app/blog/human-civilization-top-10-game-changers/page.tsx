import { Metadata } from 'next'
import Navigation from '@/components/navigation'
import { ArrowLeft, Clock, Calendar, Tag } from 'lucide-react'
import Link from 'next/link'
import { EbookCTA } from '@/components/ebook-cta'


export const metadata: Metadata = {
  title: 'Human Civilization: Top 10 Game Changers | Brandon Mills',
  description: 'Human history is a long and fascinating story that stretches back over hundreds of thousands of years. From the emergence of the first hominids to the developme...',
  keywords: ['philosophy', 'technology', 'personal-growth', 'human', 'civilization', 'game', 'changers'],
  openGraph: {
    title: 'Human Civilization: Top 10 Game Changers',
    description: 'Human history is a long and fascinating story that stretches back over hundreds of thousands of years. From the emergence of the first hominids to the developme...',
    type: 'article',
    publishedTime: '2023-02-22',
    authors: ['Brandon Mills'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Human Civilization: Top 10 Game Changers',
    description: 'Human history is a long and fascinating story that stretches back over hundreds of thousands of years. From the emergence of the first hominids to the developme...',
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
              {['philosophy', 'technology', 'personal-growth', 'human', 'civilization', 'game', 'changers'].slice(0, 3).map((tag) => (
                <span key={tag} className="px-3 py-1 bg-accent-gold/20 border border-accent-gold/40 text-accent-gold text-xs tracking-wider uppercase">
                  {tag}
                </span>
              ))}
            </div>

            <h1 className="text-4xl md:text-5xl font-serif mb-6 leading-tight">
              Human Civilization: Top 10 Game Changers
            </h1>

            <div className="flex items-center gap-6 text-sm text-white/60">
              <div className="flex items-center gap-2">
                <Calendar size={14} />
                <time dateTime="2023-02-22">February 21, 2023</time>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={14} />
                <span>3 min read</span>
              </div>
            </div>
          </header>

          {/* Content */}
          <div className="prose prose-invert prose-lg max-w-none">
            <p className="text-white/80 leading-relaxed mb-6">Human history is a long and fascinating story that stretches back over hundreds of thousands of years. From the emergence of the first hominids to the development of advanced civilizations, humans have been shaped by countless events and innovations throughout history. In this article, we will explore some of the key historical points that have defined humanity.</p>
            <p className="text-white/80 leading-relaxed mb-6">The story of humanity begins with the emergence of the first members of our species, Homo sapiens, approximately 300,000 years ago. These early humans were hunter-gatherers who lived in small groups and relied on tools made from stone and bone.</p>
            <p className="text-white/80 leading-relaxed mb-6">2. Development of agriculture</p>
            <p className="text-white/80 leading-relaxed mb-6">Around 10,000 years ago, humans in several parts of the world independently developed agriculture. This allowed them to settle in one place and cultivate crops, leading to the development of complex societies and the first cities.</p>
            <p className="text-white/80 leading-relaxed mb-6">3. Rise of civilization</p>
            <p className="text-white/80 leading-relaxed mb-6">The first known civilizations emerged in Mesopotamia, Egypt, and the Indus Valley around 4,000 BCE. These early civilizations were characterized by the development of writing systems, complex political structures, and monumental architecture.</p>
            <p className="text-white/80 leading-relaxed mb-6">4. Birth of philosophy and science</p>
            <p className="text-white/80 leading-relaxed mb-6">In ancient Greece, around the 6th century BCE, a group of thinkers emerged who challenged traditional beliefs and sought to understand the world through reason and observation. This led to the birth of philosophy and science, which had a profound impact on the development of Western civilization.</p>
            <p className="text-white/80 leading-relaxed mb-6">5. The Axial Age</p>
            <p className="text-white/80 leading-relaxed mb-6">Between the 8th and 3rd centuries BCE, a period known as the Axial Age, significant changes occurred in many parts of the world. This period saw the emergence of major religious and philosophical traditions such as Hinduism, Buddhism, Confucianism, and Taoism, which continue to influence the world today.</p>
            <p className="text-white/80 leading-relaxed mb-6">6. Age of exploration</p>
            <p className="text-white/80 leading-relaxed mb-6">In the 15th and 16th centuries, European explorers set out to find new trade routes and expand their empires. This led to the colonization of the Americas and other parts of the world, as well as the exchange of goods, ideas, and diseases between different cultures.</p>
            <p className="text-white/80 leading-relaxed mb-6">7. The Enlightenment</p>
            <p className="text-white/80 leading-relaxed mb-6">In the 18th century, a movement known as the Enlightenment emerged in Europe, which emphasized reason, individualism, and the pursuit of knowledge. This led to significant changes in politics, economics, and society, and laid the groundwork for the modern world.</p>
            <p className="text-white/80 leading-relaxed mb-6">8. Industrial Revolution</p>
            <p className="text-white/80 leading-relaxed mb-6">In the late 18th and early 19th centuries, the Industrial Revolution transformed the way goods were produced and distributed. This led to significant economic and social changes, including the growth of cities, the rise of the middle class, and the emergence of new technologies such as the steam engine and the telegraph.</p>
            <p className="text-white/80 leading-relaxed mb-6">9. World Wars</p>
            <p className="text-white/80 leading-relaxed mb-6">The 20th century was marked by two devastating world wars that had a profound impact on the course of history. These wars led to the deaths of millions of people and significant changes in global politics and economics.</p>
            <p className="text-white/80 leading-relaxed mb-6">10. Digital Revolution</p>
            <p className="text-white/80 leading-relaxed mb-6">In the late 20th and early 21st centuries, the development of digital technology transformed the way people communicate, work, and live. This has led to significant changes in the global economy and society, and has opened up new opportunities for innovation and creativity.</p>
            <p className="text-white/80 leading-relaxed mb-6">These key historical points have shaped the course of human history and continue to influence the world we live in today.</p>
            <p className="text-white/80 leading-relaxed mb-6">By understanding the past, we can gain insight into the present and better prepare for the future.</p>
          </div>

          {/* Footer */}
          <footer className="mt-16 pt-8 border-t border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-2">
                {['philosophy', 'technology', 'personal-growth', 'human', 'civilization', 'game', 'changers'].map((tag) => (
                  <span key={tag} className="px-2 py-1 bg-white/5 text-white/40 text-xs">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </footer>
        
      <EbookCTA variant="footer" source="human-civilization-top-10-game-changers" />
</div>
      </article>
    </main>
  )
}
