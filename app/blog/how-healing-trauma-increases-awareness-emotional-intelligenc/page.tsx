import { Metadata } from 'next'
import Navigation from '@/components/navigation'
import { ArrowLeft, Clock, Calendar, Tag } from 'lucide-react'
import Link from 'next/link'
import { EbookCTA } from '@/components/ebook-cta'


export const metadata: Metadata = {
  title: 'How Healing Trauma Increases Awareness + Emotional Intelligence | Brandon Mills',
  description: 'Trauma is a deeply distressing or disturbing experience that can leave a lasting impact on a person’s mental and emotional well-being. Trauma can result from a...',
  keywords: ['mental-health', 'philosophy', 'meditation', 'personal-growth', 'healing', 'trauma', 'increases', 'awareness', 'emotional'],
  openGraph: {
    title: 'How Healing Trauma Increases Awareness + Emotional Intelligence',
    description: 'Trauma is a deeply distressing or disturbing experience that can leave a lasting impact on a person’s mental and emotional well-being. Trauma can result from a...',
    type: 'article',
    publishedTime: '2023-02-27',
    authors: ['Brandon Mills'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'How Healing Trauma Increases Awareness + Emotional Intelligence',
    description: 'Trauma is a deeply distressing or disturbing experience that can leave a lasting impact on a person’s mental and emotional well-being. Trauma can result from a...',
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
              {['mental-health', 'philosophy', 'meditation', 'personal-growth', 'healing', 'trauma', 'increases', 'awareness', 'emotional'].slice(0, 3).map((tag) => (
                <span key={tag} className="px-3 py-1 bg-accent-gold/20 border border-accent-gold/40 text-accent-gold text-xs tracking-wider uppercase">
                  {tag}
                </span>
              ))}
            </div>

            <h1 className="text-4xl md:text-5xl font-serif mb-6 leading-tight">
              How Healing Trauma Increases Awareness + Emotional Intelligence
            </h1>

            <div className="flex items-center gap-6 text-sm text-white/60">
              <div className="flex items-center gap-2">
                <Calendar size={14} />
                <time dateTime="2023-02-27">February 26, 2023</time>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={14} />
                <span>3 min read</span>
              </div>
            </div>
          </header>

          {/* Content */}
          <div className="prose prose-invert prose-lg max-w-none">
            <p className="text-white/80 leading-relaxed mb-6">Trauma is a deeply distressing or disturbing experience that can leave a lasting impact on a person’s mental and emotional well-being. Trauma can result from a wide range of experiences, such as abuse, neglect, violence, natural disasters, accidents, and more. When left untreated, trauma can cause long-term emotional and psychological harm, which can negatively impact a person’s relationships, work, and overall quality of life.</p>
            <p className="text-white/80 leading-relaxed mb-6">Healing trauma is a critical step towards emotional intelligence, which refers to the ability to understand and manage one’s emotions, as well as the emotions of others. Emotional intelligence is a vital aspect of healthy relationships, effective communication, and personal growth. When we heal from trauma, we become more aware of our emotions, thoughts, and behaviors. This heightened self-awareness is the first step towards emotional intelligence.</p>
            <p className="text-white/80 leading-relaxed mb-6">Healing trauma involves acknowledging the traumatic experience and learning to manage the feelings and thoughts that arise from it. This process can take time and often requires the help of a mental health professional. Through therapy, individuals can explore the root causes of their trauma and develop coping strategies to manage the distressing emotions and thoughts that accompany it. This process helps to develop a deeper understanding of the self and the ability to regulate emotions and behavior.</p>
            <p className="text-white/80 leading-relaxed mb-6">Increased awareness of one’s emotions is a crucial component of emotional intelligence. When we understand our emotions, we can identify the triggers that cause them and learn to manage them more effectively. This self-awareness also enables us to identify the emotions of others, which is essential for building healthy relationships. Empathy, or the ability to understand and relate to the emotions of others, is a key aspect of emotional intelligence. People who have healed from trauma are often more empathetic as they have learned to identify and manage their emotions and can, therefore, relate to the emotions of others.</p>
            <p className="text-white/80 leading-relaxed mb-6">Healing from trauma also promotes a growth mindset, which is the belief that one can learn, grow, and change. People who have experienced trauma often have a fixed mindset, where they believe their circumstances cannot change. Through the healing process, individuals learn to adopt a growth mindset, where they believe they can change and grow. This mindset enables them to take responsibility for their emotions and behaviors and seek opportunities for personal growth.</p>
            <p className="text-white/80 leading-relaxed mb-6">Contemplation: Healing from trauma can lead to increased awareness and emotional intelligence. When we heal from trauma, we become more aware of our emotions, thoughts, and behaviors, which is the first step towards emotional intelligence. This heightened awareness enables us to identify the emotions of others, which is essential for building healthy relationships. Furthermore, healing from trauma promotes a growth mindset, which is essential for personal growth and development. Therefore, it is essential to seek professional help when dealing with trauma, as it can lead to a better understanding of oneself and the world around us.</p>
          </div>

          {/* Footer */}
          <footer className="mt-16 pt-8 border-t border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-2">
                {['mental-health', 'philosophy', 'meditation', 'personal-growth', 'healing', 'trauma', 'increases', 'awareness', 'emotional'].map((tag) => (
                  <span key={tag} className="px-2 py-1 bg-white/5 text-white/40 text-xs">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </footer>
        
      <EbookCTA variant="footer" source="how-healing-trauma-increases-awareness-emotional-intelligenc" />
</div>
      </article>
    </main>
  )
}
