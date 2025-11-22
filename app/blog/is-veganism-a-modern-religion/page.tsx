import { Metadata } from 'next'
import Navigation from '@/components/navigation'
import { ArrowLeft, Clock, Calendar, Tag } from 'lucide-react'
import Link from 'next/link'
import { EbookCTA } from '@/components/ebook-cta'


export const metadata: Metadata = {
  title: 'Is Veganism a Modern Religion? | Brandon Mills',
  description: 'As a kid I was always curious when its rained where all the water went. In the same train of thought — As humans make more money and have more access to informa...',
  keywords: ['philosophy', 'meditation', 'technology', 'veganism', 'modern', 'religion?'],
  openGraph: {
    title: 'Is Veganism a Modern Religion?',
    description: 'As a kid I was always curious when its rained where all the water went. In the same train of thought — As humans make more money and have more access to informa...',
    type: 'article',
    publishedTime: '2023-02-20',
    authors: ['Brandon Mills'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Is Veganism a Modern Religion?',
    description: 'As a kid I was always curious when its rained where all the water went. In the same train of thought — As humans make more money and have more access to informa...',
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
              {['philosophy', 'meditation', 'technology', 'veganism', 'modern', 'religion?'].slice(0, 3).map((tag) => (
                <span key={tag} className="px-3 py-1 bg-accent-gold/20 border border-accent-gold/40 text-accent-gold text-xs tracking-wider uppercase">
                  {tag}
                </span>
              ))}
            </div>

            <h1 className="text-4xl md:text-5xl font-serif mb-6 leading-tight">
              Is Veganism a Modern Religion?
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
            <p className="text-white/80 leading-relaxed mb-6">As a kid I was always curious when its rained where all the water went. In the same train of thought — As humans make more money and have more access to information the waters of religious a seemly seeping away lost into the ground. But Its not like thousands of years building the almost instinctual need for faith just dissipated did it?</p>
            <p className="text-white/80 leading-relaxed mb-6">Religion has always played a significant role in shaping the beliefs, values, and lifestyles of people throughout history. However, as society progresses and changes, religious beliefs and practices often shift to accommodate modern ideals and cultural norms. One example of this is the recent emergence of niche religious beliefs, such as veganism.</p>
            <p className="text-white/80 leading-relaxed mb-6">Veganism, which is the practice of abstaining from the use of animal products, has been adopted by many as a moral and ethical lifestyle choice. While veganism is often associated with animal welfare and environmentalism, it has also taken on spiritual and religious connotations for some individuals. In recent years, veganism has been integrated into several religious and spiritual practices, such as Buddhism, Hinduism, and Jainism.</p>
            <p className="text-white/80 leading-relaxed mb-6">For example, in Jainism, one of the oldest religions in India, the principle of ahimsa, or non-violence, is a core tenet. Jains believe that all living beings are interconnected, and therefore, harming or killing any living being, including animals, is a violation of ahimsa. Many Jains practice veganism as a way of fulfilling their religious obligations, and they also follow strict dietary rules to avoid causing harm to any living beings.</p>
            <p className="text-white/80 leading-relaxed mb-6">Similarly, in Buddhism, which is another religion that has a strong tradition of non-violence, many followers have embraced veganism as part of their spiritual practice. The Buddhist concept of interdependence recognizes the interconnectedness of all living beings, and therefore, harming any living being ultimately harms oneself. Many Buddhist practitioners believe that a vegan diet aligns with the principles of compassion and non-violence that are central to the religion.</p>
            <p className="text-white/80 leading-relaxed mb-6">In Hinduism, veganism is also becoming increasingly popular among those who follow the principle of ahimsa. Many Hindus believe that the use of animal products is harmful to the environment and can cause suffering to animals. Additionally, some Hindus who practice yoga and meditation view veganism as a way to align their physical and spiritual practices and to cultivate greater awareness and compassion for all living beings.</p>
            <p className="text-white/80 leading-relaxed mb-6">While the incorporation of veganism into religious and spiritual practices is a relatively recent phenomenon, it is not without controversy. Some people argue that veganism is a personal choice and should not be linked to religion, while others argue that it is a natural extension of the principles of non-violence and compassion found in many religions. Despite the debate, it is clear that veganism has become an important aspect of modern religious and spiritual practices.</p>
            <p className="text-white/80 leading-relaxed mb-6">Contemplation: Religion has always been a dynamic and evolving part of human culture. As society changes, so too do religious beliefs and practices. The integration of veganism into modern religious and spiritual practices is just one example of how religion has shifted to accommodate modern ideals and cultural norms. As our understanding of ethics, morality, and spirituality continues to evolve, it is likely that we will see even more niche religious beliefs emerge.</p>
          </div>

          {/* Footer */}
          <footer className="mt-16 pt-8 border-t border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-2">
                {['philosophy', 'meditation', 'technology', 'veganism', 'modern', 'religion?'].map((tag) => (
                  <span key={tag} className="px-2 py-1 bg-white/5 text-white/40 text-xs">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </footer>
        
      <EbookCTA variant="footer" source="is-veganism-a-modern-religion" />
</div>
      </article>
    </main>
  )
}
