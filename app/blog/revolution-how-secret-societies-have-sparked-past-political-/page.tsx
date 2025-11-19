import { Metadata } from 'next'
import Navigation from '@/components/navigation'
import { ArrowLeft, Clock, Calendar, Tag } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Revolution! How Secret Societies Have Sparked Past Political Change | Brandon Mills',
  description: 'Throughout history, secret societies have played a significant role in shaping the formation of governments. From ancient times to modern-day, secret societies...',
  keywords: ['philosophy', 'technology', 'martial-arts', 'personal-growth', 'revolution!', 'secret', 'societies', 'sparked', 'past'],
  openGraph: {
    title: 'Revolution! How Secret Societies Have Sparked Past Political Change',
    description: 'Throughout history, secret societies have played a significant role in shaping the formation of governments. From ancient times to modern-day, secret societies...',
    type: 'article',
    publishedTime: '2023-02-25',
    authors: ['Brandon Mills'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Revolution! How Secret Societies Have Sparked Past Political Change',
    description: 'Throughout history, secret societies have played a significant role in shaping the formation of governments. From ancient times to modern-day, secret societies...',
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
              {['philosophy', 'technology', 'martial-arts', 'personal-growth', 'revolution!', 'secret', 'societies', 'sparked', 'past'].slice(0, 3).map((tag) => (
                <span key={tag} className="px-3 py-1 bg-accent-gold/20 border border-accent-gold/40 text-accent-gold text-xs tracking-wider uppercase">
                  {tag}
                </span>
              ))}
            </div>

            <h1 className="text-4xl md:text-5xl font-serif mb-6 leading-tight">
              Revolution! How Secret Societies Have Sparked Past Political Change
            </h1>

            <div className="flex items-center gap-6 text-sm text-white/60">
              <div className="flex items-center gap-2">
                <Calendar size={14} />
                <time dateTime="2023-02-25">February 24, 2023</time>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={14} />
                <span>3 min read</span>
              </div>
            </div>
          </header>

          {/* Content */}
          <div className="prose prose-invert prose-lg max-w-none">
            <p className="text-white/80 leading-relaxed mb-6">Throughout history, secret societies have played a significant role in shaping the formation of governments. From ancient times to modern-day, secret societies have influenced political systems and world events in ways that have been both positive and negative. In this article, we will explore the role that secret societies have played in shaping the formation of governments.</p>
            <p className="text-white/80 leading-relaxed mb-6">One of the most well-known secret societies in history is the Freemasons. The Freemasons were a fraternal organization that originated in the late 16th or early 17th century in Scotland and England. They were a group of men who shared a common belief in the importance of moral and ethical values, and they sought to promote these values through various forms of community service.</p>
            <p className="text-white/80 leading-relaxed mb-6">The Freemasons were influential in shaping the formation of the United States government. Many of the founding fathers of the United States were Freemasons, including George Washington, Benjamin Franklin, and Paul Revere. In fact, some historians believe that the Freemasons played a significant role in shaping the principles of the American Revolution.</p>
            <p className="text-white/80 leading-relaxed mb-6">Another secret society that played a significant role in shaping the formation of governments is the Illuminati. The Illuminati was a secret society that was founded in Bavaria in 1776. The society’s goals were to promote enlightenment and rational thinking, and to combat superstition and religious influence in society.</p>
            <p className="text-white/80 leading-relaxed mb-6">The Illuminati played a significant role in the French Revolution. They were influential in the development of the ideas of liberty, equality, and fraternity, which became the rallying cry of the revolution. The Illuminati also played a significant role in the development of the Declaration of the Rights of Man and of the Citizen, which was one of the foundational documents of the French Republic.</p>
            <p className="text-white/80 leading-relaxed mb-6">However, not all secret societies have had positive impacts on the formation of governments. In some cases, secret societies have been associated with corruption, subversion, and even terrorism. For example, the Sicilian Mafia, also known as the Cosa Nostra, has been associated with the government corruption in Italy. The organization has been accused of bribing government officials and engaging in criminal activities such as drug trafficking, money laundering, and murder.</p>
            <p className="text-white/80 leading-relaxed mb-6">Contemplation: Leaving all the conspiracy theory out of it, secret societies have played a significant role (that we can prove) in shaping the formation of governments throughout history. While some secret societies have had positive impacts on the development of political systems, others have been associated with corruption and criminal activity. It is important to study the history of secret societies and their impacts on governments to gain a better understanding of how political systems are formed and influenced.</p>
          </div>

          {/* Footer */}
          <footer className="mt-16 pt-8 border-t border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-2">
                {['philosophy', 'technology', 'martial-arts', 'personal-growth', 'revolution!', 'secret', 'societies', 'sparked', 'past'].map((tag) => (
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
