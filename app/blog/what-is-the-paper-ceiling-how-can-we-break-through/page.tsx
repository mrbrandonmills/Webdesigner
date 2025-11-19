import { Metadata } from 'next'
import Navigation from '@/components/navigation'
import { ArrowLeft, Clock, Calendar, Tag } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'What is “The Paper Ceiling”? How Can We Break Through? | Brandon Mills',
  description: 'In many industries, having a college degree is considered a basic requirement for entry-level positions. This is commonly known as the “paper ceiling,” and it c...',
  keywords: ['philosophy', 'technology', 'martial-arts', '“the', 'paper', 'ceiling”?', 'break', 'through?'],
  openGraph: {
    title: 'What is “The Paper Ceiling”? How Can We Break Through?',
    description: 'In many industries, having a college degree is considered a basic requirement for entry-level positions. This is commonly known as the “paper ceiling,” and it c...',
    type: 'article',
    publishedTime: '2023-02-21',
    authors: ['Brandon Mills'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'What is “The Paper Ceiling”? How Can We Break Through?',
    description: 'In many industries, having a college degree is considered a basic requirement for entry-level positions. This is commonly known as the “paper ceiling,” and it c...',
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
              {['philosophy', 'technology', 'martial-arts', '“the', 'paper', 'ceiling”?', 'break', 'through?'].slice(0, 3).map((tag) => (
                <span key={tag} className="px-3 py-1 bg-accent-gold/20 border border-accent-gold/40 text-accent-gold text-xs tracking-wider uppercase">
                  {tag}
                </span>
              ))}
            </div>

            <h1 className="text-4xl md:text-5xl font-serif mb-6 leading-tight">
              What is “The Paper Ceiling”? How Can We Break Through?
            </h1>

            <div className="flex items-center gap-6 text-sm text-white/60">
              <div className="flex items-center gap-2">
                <Calendar size={14} />
                <time dateTime="2023-02-21">February 20, 2023</time>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={14} />
                <span>3 min read</span>
              </div>
            </div>
          </header>

          {/* Content */}
          <div className="prose prose-invert prose-lg max-w-none">
            <p className="text-white/80 leading-relaxed mb-6">In many industries, having a college degree is considered a basic requirement for entry-level positions. This is commonly known as the “paper ceiling,” and it can be a significant barrier to individuals from underrepresented groups, including people of color, individuals with disabilities, and those from low-income families.</p>
            <p className="text-white/80 leading-relaxed mb-6">While a college degree can certainly be beneficial in many ways, including increased earning potential and access to a wider range of job opportunities, it’s not always a feasible option for everyone. The cost of higher education in the United States has skyrocketed in recent years, and many students are forced to take on significant debt in order to earn a degree. For marginalized groups who have historically been excluded from many economic and educational opportunities, this can be an especially daunting prospect.</p>
            <p className="text-white/80 leading-relaxed mb-6">Furthermore, the requirement of a college degree for entry-level positions can also be a reflection of systemic bias and discrimination. Studies have shown that people of color and individuals from low-income backgrounds are less likely to have access to quality education and may face a host of other challenges that can make it difficult to succeed academically. This means that even if they possess the skills and qualifications necessary to perform a job, they may be automatically excluded from consideration due to the paper ceiling.</p>
            <p className="text-white/80 leading-relaxed mb-6">The paper ceiling is not just an issue of economic and social injustice, but it also has implications for companies and organizations. When organizations prioritize a college degree over other forms of experience or qualifications, they are limiting their talent pool and missing out on the unique perspectives and insights that individuals from underrepresented groups can bring. This can lead to a lack of diversity in leadership positions, which can in turn result in a lack of diversity in the products and services that organizations produce.</p>
            <p className="text-white/80 leading-relaxed mb-6">To address the paper ceiling, organizations can take a number of steps. First, they can reexamine their job requirements and consider whether a college degree is truly necessary for the position in question. This can involve looking at the specific skills and experiences required for the job, as well as considering alternative forms of education or certification that may be just as valuable.</p>
            <p className="text-white/80 leading-relaxed mb-6">Second, organizations can implement programs and initiatives to support individuals from underrepresented groups in obtaining the education and training they need to succeed. This can include partnerships with community organizations, mentorship and coaching programs, and financial assistance or scholarship opportunities.</p>
            <p className="text-white/80 leading-relaxed mb-6">Finally, organizations can prioritize diversity and inclusion in their hiring practices and strive to create a workplace culture that values the unique contributions of all employees, regardless of their educational background. This can involve creating a more equitable and inclusive hiring process, providing training and support for diverse employees, and actively seeking out diverse candidates for leadership positions.</p>
            <p className="text-white/80 leading-relaxed mb-6">Contemplation: Breaking through the paper ceiling is a critical step towards creating a more just and equitable society, one in which all individuals have the opportunity to succeed and contribute to their full potential. By rethinking traditional job requirements and prioritizing diversity and inclusion, organizations can help to create a more diverse and dynamic workforce that is better equipped to meet the challenges of the future.</p>
          </div>

          {/* Footer */}
          <footer className="mt-16 pt-8 border-t border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-2">
                {['philosophy', 'technology', 'martial-arts', '“the', 'paper', 'ceiling”?', 'break', 'through?'].map((tag) => (
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
