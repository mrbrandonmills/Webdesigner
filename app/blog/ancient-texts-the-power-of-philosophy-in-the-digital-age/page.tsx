import { Metadata } from 'next'
import Navigation from '@/components/navigation'
import { ArrowLeft, Clock, Calendar, Tag } from 'lucide-react'
import Link from 'next/link'
import { EbookCTA } from '@/components/ebook-cta'


export const metadata: Metadata = {
  title: 'Ancient Texts: The Power of Philosophy in the Digital Age | Brandon Mills',
  description: 'Philosophy is a discipline that has been studied for thousands of years, and yet its value has not diminished. In fact, in modern times, philosophy can be more...',
  keywords: ['philosophy', 'technology', 'martial-arts', 'ancient', 'texts', 'power', 'digital'],
  openGraph: {
    title: 'Ancient Texts: The Power of Philosophy in the Digital Age',
    description: 'Philosophy is a discipline that has been studied for thousands of years, and yet its value has not diminished. In fact, in modern times, philosophy can be more...',
    type: 'article',
    publishedTime: '2023-02-20',
    authors: ['Brandon Mills'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ancient Texts: The Power of Philosophy in the Digital Age',
    description: 'Philosophy is a discipline that has been studied for thousands of years, and yet its value has not diminished. In fact, in modern times, philosophy can be more...',
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
              {['philosophy', 'technology', 'martial-arts', 'ancient', 'texts', 'power', 'digital'].slice(0, 3).map((tag) => (
                <span key={tag} className="px-3 py-1 bg-accent-gold/20 border border-accent-gold/40 text-accent-gold text-xs tracking-wider uppercase">
                  {tag}
                </span>
              ))}
            </div>

            <h1 className="text-4xl md:text-5xl font-serif mb-6 leading-tight">
              Ancient Texts: The Power of Philosophy in the Digital Age
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
            <p className="text-white/80 leading-relaxed mb-6">Philosophy is a discipline that has been studied for thousands of years, and yet its value has not diminished. In fact, in modern times, philosophy can be more relevant than ever. The study of philosophy can help individuals understand the world around them, gain insights into complex issues, and develop a more well-rounded perspective on life. In this article, we will explore the value of reading philosophy for modern times.</p>
            <p className="text-white/80 leading-relaxed mb-6">First and foremost, reading philosophy can help individuals gain a better understanding of the world they live in. Philosophy is concerned with fundamental questions about reality, existence, knowledge, and morality. By studying philosophy, individuals can gain insights into these questions and develop a deeper understanding of the world around them. For example, reading works by philosophers like Plato, Aristotle, and Kant can help individuals gain a better understanding of concepts like justice, morality, and the nature of reality.</p>
            <p className="text-white/80 leading-relaxed mb-6">Secondly, philosophy can help individuals develop critical thinking skills. Reading philosophy requires individuals to engage with complex ideas and arguments, and to evaluate the strengths and weaknesses of different perspectives. By engaging in this kind of critical thinking, individuals can develop skills that are valuable in a wide range of contexts, from academia to the workplace to personal relationships. In addition, critical thinking skills can help individuals become more independent and self-reliant, as they learn to evaluate information and arguments for themselves rather than simply accepting what they are told.</p>
            <p className="text-white/80 leading-relaxed mb-6">Thirdly, reading philosophy can help individuals develop a more well-rounded perspective on life. Philosophy has been studied for thousands of years by thinkers from a wide range of cultures and historical periods. By reading works from different philosophical traditions, individuals can gain insights into different ways of thinking about the world, and develop a more nuanced and multifaceted perspective on life. In addition, by engaging with different perspectives, individuals can become more open-minded and tolerant of different views and opinions.</p>
            <p className="text-white/80 leading-relaxed mb-6">Finally, reading philosophy can help individuals navigate the challenges and complexities of modern life. In a world that is increasingly complex and interconnected, individuals face a wide range of challenges, from ethical dilemmas to political conflicts to existential questions about the meaning of life. By studying philosophy, individuals can gain insights into these challenges, and develop strategies for navigating them. For example, works by philosophers like Nietzsche, Camus, and Sartre can help individuals grapple with questions about the meaning of life, while works by political philosophers like Rawls and Arendt can help individuals think about how to create a more just and equitable society.</p>
            <p className="text-white/80 leading-relaxed mb-6">When I was really young I hated it, but now I see that reading philosophy can be incredibly valuable for modern times. Philosophy can help individuals gain a deeper understanding of the world around them, develop critical thinking skills, gain a more well-rounded perspective on life, and navigate the challenges of modern life. Whether you are a student, a professional, or simply someone who is interested in gaining insights into life’s big questions, reading philosophy can be an enriching and rewarding experience. Food for thought..</p>
          </div>

          {/* Footer */}
          <footer className="mt-16 pt-8 border-t border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-2">
                {['philosophy', 'technology', 'martial-arts', 'ancient', 'texts', 'power', 'digital'].map((tag) => (
                  <span key={tag} className="px-2 py-1 bg-white/5 text-white/40 text-xs">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </footer>
        
      <EbookCTA variant="footer" source="ancient-texts-the-power-of-philosophy-in-the-digital-age" />
</div>
      </article>
    </main>
  )
}
