import { Metadata } from 'next'
import Navigation from '@/components/navigation'
import { ArrowLeft, Clock, Calendar, Tag } from 'lucide-react'
import Link from 'next/link'
import { EbookCTA } from '@/components/ebook-cta'


export const metadata: Metadata = {
  title: 'ADHD: How Yoga & Martial Arts Improve Your Symptoms | Brandon Mills',
  description: 'Attention-deficit/hyperactivity disorder (ADHD) is a neurodevelopmental disorder characterized by symptoms of inattention, hyperactivity, and impulsivity. Peopl...',
  keywords: ['mental-health', 'philosophy', 'meditation', 'science', 'technology', 'martial-arts', 'personal-growth', 'adhd', 'yoga', 'martial', 'arts', 'improve'],
  openGraph: {
    title: 'ADHD: How Yoga & Martial Arts Improve Your Symptoms',
    description: 'Attention-deficit/hyperactivity disorder (ADHD) is a neurodevelopmental disorder characterized by symptoms of inattention, hyperactivity, and impulsivity. Peopl...',
    type: 'article',
    publishedTime: '2023-02-23',
    authors: ['Brandon Mills'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ADHD: How Yoga & Martial Arts Improve Your Symptoms',
    description: 'Attention-deficit/hyperactivity disorder (ADHD) is a neurodevelopmental disorder characterized by symptoms of inattention, hyperactivity, and impulsivity. Peopl...',
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
              {['mental-health', 'philosophy', 'meditation', 'science', 'technology', 'martial-arts', 'personal-growth', 'adhd', 'yoga', 'martial', 'arts', 'improve'].slice(0, 3).map((tag) => (
                <span key={tag} className="px-3 py-1 bg-accent-gold/20 border border-accent-gold/40 text-accent-gold text-xs tracking-wider uppercase">
                  {tag}
                </span>
              ))}
            </div>

            <h1 className="text-4xl md:text-5xl font-serif mb-6 leading-tight">
              ADHD: How Yoga & Martial Arts Improve Your Symptoms
            </h1>

            <div className="flex items-center gap-6 text-sm text-white/60">
              <div className="flex items-center gap-2">
                <Calendar size={14} />
                <time dateTime="2023-02-23">February 22, 2023</time>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={14} />
                <span>3 min read</span>
              </div>
            </div>
          </header>

          {/* Content */}
          <div className="prose prose-invert prose-lg max-w-none">
            <p className="text-white/80 leading-relaxed mb-6">Attention-deficit/hyperactivity disorder (ADHD) is a neurodevelopmental disorder characterized by symptoms of inattention, hyperactivity, and impulsivity. People with ADHD often struggle with impulse control, focus, and maintaining attention for extended periods of time. While medication and therapy can be effective treatments for ADHD, research has shown that certain physical activities, such as yoga and martial arts, can also be beneficial in managing symptoms of the disorder.</p>
            <p className="text-white/80 leading-relaxed mb-6">Yoga is a mind-body practice that originated in ancient India and is known for its focus on breath control, meditation, and physical postures. Practicing yoga has been shown to reduce stress and anxiety, improve flexibility, and enhance overall physical fitness. But beyond these general health benefits, research has also shown that yoga can be effective in improving symptoms of ADHD.</p>
            <p className="text-white/80 leading-relaxed mb-6">A study published in the Journal of Attention Disorders found that children with ADHD who participated in a yoga intervention had significantly reduced symptoms of inattention, hyperactivity, and impulsivity compared to a control group. The researchers suggest that yoga may improve ADHD symptoms by increasing self-awareness and self-regulation, improving executive functioning, and reducing stress levels.</p>
            <p className="text-white/80 leading-relaxed mb-6">Martial arts, on the other hand, are physical practices that originated in various regions of the world and are often characterized by the use of techniques such as striking, grappling, and throwing. Like yoga, martial arts practice has been shown to improve physical fitness and reduce stress. But research has also shown that martial arts can be beneficial for managing symptoms of ADHD.</p>
            <p className="text-white/80 leading-relaxed mb-6">A study published in the Journal of Attention Disorders found that children with ADHD who participated in a martial arts intervention had significant improvements in inattention, hyperactivity, and impulsivity compared to a control group. The researchers suggest that the discipline and structure inherent in martial arts training may help improve attention and self-regulation in children with ADHD.</p>
            <p className="text-white/80 leading-relaxed mb-6">Furthermore, martial arts practice can help improve motor skills, coordination, and balance, which are often areas of difficulty for individuals with ADHD. Additionally, martial arts can be a fun and engaging physical activity for children with ADHD, providing a healthy outlet for excess energy and a sense of accomplishment as they progress through levels and achieve goals.</p>
            <p className="text-white/80 leading-relaxed mb-6">Contemplation: While medication and therapy remain important treatment options for ADHD, physical activities such as yoga and martial arts can be effective complementary treatments. These practices can help improve self-awareness, self-regulation, and executive functioning, as well as reduce stress and improve overall physical fitness. For individuals with ADHD, exploring these physical practices may provide a holistic approach to managing symptoms and improving overall quality of life.</p>
          </div>

          {/* Footer */}
          <footer className="mt-16 pt-8 border-t border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-2">
                {['mental-health', 'philosophy', 'meditation', 'science', 'technology', 'martial-arts', 'personal-growth', 'adhd', 'yoga', 'martial', 'arts', 'improve'].map((tag) => (
                  <span key={tag} className="px-2 py-1 bg-white/5 text-white/40 text-xs">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </footer>
        
      <EbookCTA variant="footer" source="adhd-how-yoga-martial-arts-improve-your-symptoms" />
</div>
      </article>
    </main>
  )
}
