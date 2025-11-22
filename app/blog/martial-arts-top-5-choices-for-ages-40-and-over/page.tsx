import { Metadata } from 'next'
import Navigation from '@/components/navigation'
import { ArrowLeft, Clock, Calendar, Tag } from 'lucide-react'
import Link from 'next/link'
import { EbookCTA } from '@/components/ebook-cta'


export const metadata: Metadata = {
  title: 'Martial Arts: Top 5 Choices for Ages 40 and Over | Brandon Mills',
  description: 'Martial arts have long been touted as an effective way to learn self-defense, improve physical fitness, and build mental resilience. However, as we age, our bod...',
  keywords: ['philosophy', 'technology', 'martial-arts', 'martial', 'arts', 'choices', 'ages', 'over'],
  openGraph: {
    title: 'Martial Arts: Top 5 Choices for Ages 40 and Over',
    description: 'Martial arts have long been touted as an effective way to learn self-defense, improve physical fitness, and build mental resilience. However, as we age, our bod...',
    type: 'article',
    publishedTime: '2023-03-02',
    authors: ['Brandon Mills'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Martial Arts: Top 5 Choices for Ages 40 and Over',
    description: 'Martial arts have long been touted as an effective way to learn self-defense, improve physical fitness, and build mental resilience. However, as we age, our bod...',
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
              {['philosophy', 'technology', 'martial-arts', 'martial', 'arts', 'choices', 'ages', 'over'].slice(0, 3).map((tag) => (
                <span key={tag} className="px-3 py-1 bg-accent-gold/20 border border-accent-gold/40 text-accent-gold text-xs tracking-wider uppercase">
                  {tag}
                </span>
              ))}
            </div>

            <h1 className="text-4xl md:text-5xl font-serif mb-6 leading-tight">
              Martial Arts: Top 5 Choices for Ages 40 and Over
            </h1>

            <div className="flex items-center gap-6 text-sm text-white/60">
              <div className="flex items-center gap-2">
                <Calendar size={14} />
                <time dateTime="2023-03-02">March 1, 2023</time>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={14} />
                <span>3 min read</span>
              </div>
            </div>
          </header>

          {/* Content */}
          <div className="prose prose-invert prose-lg max-w-none">
            <p className="text-white/80 leading-relaxed mb-6">Martial arts have long been touted as an effective way to learn self-defense, improve physical fitness, and build mental resilience. However, as we age, our bodies may not be as agile as they once were, and we may have more concerns about injuries. Therefore, it is important to find martial arts that are suitable for those over the age of 40. Here are the top martial arts that are perfect for individuals in this age group:</p>
            <p className="text-white/80 leading-relaxed mb-6">BJJ is a grappling-based martial art that has become increasingly popular over the past few decades. It focuses on ground fighting, submission holds, and defense against bigger and stronger opponents. BJJ is a great option for those over 40 because it is less reliant on brute strength and more on technique and leverage. It can also be a low-impact form of exercise, which is perfect for individuals who may have joint issues.</p>
            <p className="text-white/80 leading-relaxed mb-6">Krav Maga is a self-defense system that was developed in Israel for military and law enforcement. It incorporates techniques from boxing, wrestling, and aikido, and emphasizes practical and effective self-defense techniques for real-life situations. Krav Maga is a great option for those over 40 because it is designed to be simple and easy to learn, and its focus on practicality means that it doesn’t require years of training to be effective.</p>
            <p className="text-white/80 leading-relaxed mb-6">Tai Chi is a traditional Chinese martial art that is often practiced for its health benefits. It involves slow, fluid movements that can improve balance, coordination, and flexibility. While Tai Chi is not specifically designed for self-defense, it can be a great option for those over 40 who want to improve their overall physical fitness and well-being.</p>
            <p className="text-white/80 leading-relaxed mb-6">Aikido is a Japanese martial art that emphasizes using an opponent’s momentum against them. It involves throws, joint locks, and pins, and is designed to subdue an attacker without causing serious injury. Aikido is a great option for those over 40 because it is a low-impact form of martial art that can be practiced well into old age. It can also help improve balance, coordination, and flexibility.</p>
            <p className="text-white/80 leading-relaxed mb-6">Muay Thai, also known as Thai boxing, is a striking-based martial art that originated in Thailand. It involves using the hands, feet, elbows, and knees to strike an opponent. Muay Thai is a great option for those over 40 because it is an intense workout that can improve cardiovascular health and overall fitness. It is also a great way to learn self-defense techniques that can be used in real-life situations.</p>
            <p className="text-white/80 leading-relaxed mb-6">Contemplation: Martial arts can be a great way for individuals over 40 to improve their physical fitness and learn self-defense techniques. Its helped me all my life with mobility and confidence. However, it is important to find a martial art that is suitable for one’s age and physical capabilities. BJJ, Krav Maga, Tai Chi, Aikido, and Muay Thai are all great options that can provide a range of benefits to individuals in this age group. Ultimately, the best martial art for self-defense is one that an individual enjoys and is motivated to continue practicing over the long term.</p>
          </div>

          {/* Footer */}
          <footer className="mt-16 pt-8 border-t border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-2">
                {['philosophy', 'technology', 'martial-arts', 'martial', 'arts', 'choices', 'ages', 'over'].map((tag) => (
                  <span key={tag} className="px-2 py-1 bg-white/5 text-white/40 text-xs">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </footer>
        
      <EbookCTA variant="footer" source="martial-arts-top-5-choices-for-ages-40-and-over" />
</div>
      </article>
    </main>
  )
}
