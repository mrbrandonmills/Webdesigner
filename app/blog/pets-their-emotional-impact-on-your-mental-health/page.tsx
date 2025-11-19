import { Metadata } from 'next'
import Navigation from '@/components/navigation'
import { ArrowLeft, Clock, Calendar, Tag } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Pets: Their Emotional Impact on Your Mental Health | Brandon Mills',
  description: 'Pets are more than just animals....',
  keywords: ['mental-health', 'philosophy', 'science', 'technology', 'pets', 'emotional', 'impact', 'mental', 'health'],
  openGraph: {
    title: 'Pets: Their Emotional Impact on Your Mental Health',
    description: 'Pets are more than just animals....',
    type: 'article',
    publishedTime: '2023-02-22',
    authors: ['Brandon Mills'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pets: Their Emotional Impact on Your Mental Health',
    description: 'Pets are more than just animals....',
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
              {['mental-health', 'philosophy', 'science', 'technology', 'pets', 'emotional', 'impact', 'mental', 'health'].slice(0, 3).map((tag) => (
                <span key={tag} className="px-3 py-1 bg-accent-gold/20 border border-accent-gold/40 text-accent-gold text-xs tracking-wider uppercase">
                  {tag}
                </span>
              ))}
            </div>

            <h1 className="text-4xl md:text-5xl font-serif mb-6 leading-tight">
              Pets: Their Emotional Impact on Your Mental Health
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
            <p className="text-white/80 leading-relaxed mb-6">Pets are more than just animals.</p>
            <p className="text-white/80 leading-relaxed mb-6">They hold a special place in our hearts and have been companions to humans for centuries. There is something special about the bond between humans and their pets that can be difficult to explain. For many people, pets are more than just animals; they are family members, best friends, and constant sources of comfort and support.</p>
            <p className="text-white/80 leading-relaxed mb-6">The emotional significance of pets on mental health is a topic that has been researched extensively over the years. Studies have shown that pets can have a positive impact on mental health, reducing stress, anxiety, and depression. In fact, the emotional support provided by pets has been shown to be just as effective as therapy for some individuals.</p>
            <p className="text-white/80 leading-relaxed mb-6">Pets offer unconditional love and support, which is something that is not always easy to find in our busy, modern world. They provide a sense of purpose and companionship, and their presence can help to reduce feelings of loneliness and isolation. For individuals who struggle with mental health issues, such as depression and anxiety, pets can be a crucial source of comfort and support.</p>
            <p className="text-white/80 leading-relaxed mb-6">In addition to providing emotional support, pets also offer physical benefits that can have a positive impact on mental health. For example, walking a dog can help to reduce stress and anxiety, while also providing much-needed exercise. Caring for a pet, such as feeding and grooming, can also provide a sense of purpose and routine, which can be helpful for individuals who struggle with mental health issues.</p>
            <p className="text-white/80 leading-relaxed mb-6">One study published in the Journal of Psychiatric Research found that pet ownership was associated with a lower risk of depression and anxiety in older adults. Another study published in the International Journal of Workplace Health Management found that pets in the workplace helped to reduce stress and increase job satisfaction among employees.</p>
            <p className="text-white/80 leading-relaxed mb-6">The emotional significance of pets on mental health is not limited to just dogs and cats. Research has shown that other pets, such as fish, birds, and even reptiles, can also provide emotional support and comfort. In fact, many individuals find that caring for exotic pets can be therapeutic and provide a sense of purpose and connection to nature.</p>
            <p className="text-white/80 leading-relaxed mb-6">Contemplation: The emotional significance of pets on mental health is a topic that has been widely researched and documented. Pets can provide a source of emotional support and comfort that can help to reduce stress, anxiety, and depression. They offer unconditional love and companionship, which is something that is difficult to find in our busy, modern world. Caring for a pet can provide a sense of purpose and routine, and can even help to improve physical health through exercise and other activities. Whether it’s a dog, cat, bird, fish, or reptile, pets have the ability to make a positive impact on our mental health and overall well-being.</p>
            <p className="text-white/80 leading-relaxed mb-6">I never saw pets in the same light after I got cancer. I adopted my little pup Chloe when I was diagnosed and she gave me the unconditional love I couldn’t give myself at the time. It saved my life no question.</p>
          </div>

          {/* Footer */}
          <footer className="mt-16 pt-8 border-t border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-2">
                {['mental-health', 'philosophy', 'science', 'technology', 'pets', 'emotional', 'impact', 'mental', 'health'].map((tag) => (
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
