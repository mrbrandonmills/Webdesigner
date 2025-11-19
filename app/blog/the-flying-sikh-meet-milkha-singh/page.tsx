import { Metadata } from 'next'
import Navigation from '@/components/navigation'
import { ArrowLeft, Clock, Calendar, Tag } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '“The Flying Sikh”-Meet Milkha Singh | Brandon Mills',
  description: 'Milkha Singh, also known as “The Flying Sikh,” was a legendary Indian athlete who became a national icon due to his exceptional talent in track and field. He wa...',
  keywords: ['technology', 'martial-arts', 'personal-growth', '“the', 'flying', 'sikh”', 'meet', 'milkha'],
  openGraph: {
    title: '“The Flying Sikh”-Meet Milkha Singh',
    description: 'Milkha Singh, also known as “The Flying Sikh,” was a legendary Indian athlete who became a national icon due to his exceptional talent in track and field. He wa...',
    type: 'article',
    publishedTime: '2023-02-19',
    authors: ['Brandon Mills'],
  },
  twitter: {
    card: 'summary_large_image',
    title: '“The Flying Sikh”-Meet Milkha Singh',
    description: 'Milkha Singh, also known as “The Flying Sikh,” was a legendary Indian athlete who became a national icon due to his exceptional talent in track and field. He wa...',
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
              {['technology', 'martial-arts', 'personal-growth', '“the', 'flying', 'sikh”', 'meet', 'milkha'].slice(0, 3).map((tag) => (
                <span key={tag} className="px-3 py-1 bg-accent-gold/20 border border-accent-gold/40 text-accent-gold text-xs tracking-wider uppercase">
                  {tag}
                </span>
              ))}
            </div>

            <h1 className="text-4xl md:text-5xl font-serif mb-6 leading-tight">
              “The Flying Sikh”-Meet Milkha Singh
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
            <p className="text-white/80 leading-relaxed mb-6">Milkha Singh, also known as “The Flying Sikh,” was a legendary Indian athlete who became a national icon due to his exceptional talent in track and field. He was the first Indian athlete to win a gold medal at the Commonwealth Games and represented India at the Olympics. His inspiring story of determination and hard work has made him a role model for generations of Indians.</p>
            <p className="text-white/80 leading-relaxed mb-6">Milkha Singh was born on October 20, 1929, in Govindpura, a small village in Punjab, India. He lost his parents during the Partition of India in 1947 and was forced to flee his hometown. He eventually settled in Delhi and started working as a laborer. It was during this time that he discovered his talent for running and started training under a local coach.</p>
            <p className="text-white/80 leading-relaxed mb-6">Milkha Singh’s breakthrough moment came in 1956 when he won his first gold medal at the National Games of India. He then went on to represent India at the Melbourne Olympics in 1956, where he made it to the final of the 400-meter race but narrowly missed out on a medal. However, he went on to win gold medals in the 200 meters and 400 meters at the Asian Games in Tokyo in 1958.</p>
            <p className="text-white/80 leading-relaxed mb-6">Milkha Singh’s most memorable moment came at the 1960 Rome Olympics when he made it to the final of the 400 meters. He finished fourth, missing out on a medal by just 0.1 seconds, but his performance was still a remarkable achievement, considering that he had set a new Indian national record in the process. Milkha Singh’s performance in Rome made him a national hero and earned him the nickname “The Flying Sikh.”</p>
            <p className="text-white/80 leading-relaxed mb-6">Milkha Singh’s success continued in the years that followed. He won gold medals in the 400 meters and 4x400 meters relay at the Commonwealth Games in 1958 and 1962, as well as the Asian Games in 1962. He also set new national records in the 200 meters and 400 meters, which remained unbeaten for several years.</p>
            <p className="text-white/80 leading-relaxed mb-6">Milkha Singh’s athletic achievements were remarkable, but it was his journey to success that captured the hearts of millions of Indians. He overcame poverty, the trauma of the Partition, and the loss of his parents to become one of India’s greatest athletes. He often spoke about the importance of hard work, discipline, and determination in achieving one’s goals.</p>
            <p className="text-white/80 leading-relaxed mb-6">In 2013, Milkha Singh’s life was immortalized in the biographical sports film “Bhaag Milkha Bhaag.” The film received critical acclaim and further cemented Milkha Singh’s status as a national icon.</p>
            <p className="text-white/80 leading-relaxed mb-6">Milkha Singh passed away on June 18, 2021, at the age of 91 due to complications from COVID-19. His death was mourned by people all over India, and he was remembered as a true legend and inspiration for generations to come.</p>
            <p className="text-white/80 leading-relaxed mb-6">Final Thought, Milkha Singh was a trailblazer and a legend who will always be remembered as one of India’s greatest athletes. His achievements on the track were impressive, but his story of overcoming adversity and achieving success through hard work and determination is what makes him a true hero.</p>
          </div>

          {/* Footer */}
          <footer className="mt-16 pt-8 border-t border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-2">
                {['technology', 'martial-arts', 'personal-growth', '“the', 'flying', 'sikh”', 'meet', 'milkha'].map((tag) => (
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
