import { Metadata } from 'next'
import Navigation from '@/components/navigation'
import { ArrowLeft, Clock, Calendar, Tag } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Defining Mental Health | Brandon Mills',
  description: 'Mental health is a crucial component of overall well-being, yet it is often overlooked or stigmatized. In recent years, there has been a growing recognition of...',
  keywords: ['mental-health', 'technology', 'personal-growth', 'defining', 'mental', 'health'],
  openGraph: {
    title: 'Defining Mental Health',
    description: 'Mental health is a crucial component of overall well-being, yet it is often overlooked or stigmatized. In recent years, there has been a growing recognition of...',
    type: 'article',
    publishedTime: '2023-02-18',
    authors: ['Brandon Mills'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Defining Mental Health',
    description: 'Mental health is a crucial component of overall well-being, yet it is often overlooked or stigmatized. In recent years, there has been a growing recognition of...',
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
              {['mental-health', 'technology', 'personal-growth', 'defining', 'mental', 'health'].slice(0, 3).map((tag) => (
                <span key={tag} className="px-3 py-1 bg-accent-gold/20 border border-accent-gold/40 text-accent-gold text-xs tracking-wider uppercase">
                  {tag}
                </span>
              ))}
            </div>

            <h1 className="text-4xl md:text-5xl font-serif mb-6 leading-tight">
              Defining Mental Health
            </h1>

            <div className="flex items-center gap-6 text-sm text-white/60">
              <div className="flex items-center gap-2">
                <Calendar size={14} />
                <time dateTime="2023-02-18">February 17, 2023</time>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={14} />
                <span>2 min read</span>
              </div>
            </div>
          </header>

          {/* Content */}
          <div className="prose prose-invert prose-lg max-w-none">
            <p className="text-white/80 leading-relaxed mb-6">Mental health is a crucial component of overall well-being, yet it is often overlooked or stigmatized. In recent years, there has been a growing recognition of the importance of mental health and its impact on individuals, communities, and society as a whole. In this article, we will explore the importance of mental health, the challenges individuals face in maintaining good mental health, and strategies for promoting positive mental health.</p>
            <p className="text-white/80 leading-relaxed mb-6">What is mental health?</p>
            <p className="text-white/80 leading-relaxed mb-6">Mental health refers to a person’s emotional, psychological, and social well-being. It affects how people think, feel, and act, and impacts their ability to handle stress, relate to others, and make decisions. Mental health is important at every stage of life, from childhood to adolescence, adulthood, and old age. It can be influenced by a range of factors, including genetics, environment, and life experiences.</p>
            <p className="text-white/80 leading-relaxed mb-6">Why is mental health important?</p>
            <p className="text-white/80 leading-relaxed mb-6">Good mental health is essential for a fulfilling and meaningful life. It allows individuals to enjoy relationships, pursue personal goals, and cope with life’s challenges. Mental health issues, such as anxiety, depression, and substance abuse, can impact an individual’s ability to function in daily life, work productively, and contribute to society. Furthermore, mental health issues can negatively impact physical health, leading to chronic conditions such as cardiovascular disease and diabetes.</p>
            <p className="text-white/80 leading-relaxed mb-6">Challenges in maintaining good mental health</p>
            <p className="text-white/80 leading-relaxed mb-6">Despite the importance of mental health, individuals face many challenges in maintaining good mental health. One of the most significant challenges is stigma. Mental health issues are often stigmatized, leading to shame, isolation, and discrimination. This can prevent individuals from seeking help and receiving the support they need.</p>
            <p className="text-white/80 leading-relaxed mb-6">Another challenge is the lack of access to mental health services. In many countries, mental health services are not adequately funded, leading to long waiting lists, limited resources, and inadequate treatment options. This can prevent individuals from receiving timely and effective treatment, leading to more severe mental health issues and greater personal and societal costs.</p>
            <p className="text-white/80 leading-relaxed mb-6">Strategies for promoting positive mental health</p>
            <p className="text-white/80 leading-relaxed mb-6">There are several strategies for promoting positive mental health. These include:</p>
            <p className="text-white/80 leading-relaxed mb-6">Conclusion</p>
            <p className="text-white/80 leading-relaxed mb-6">In conclusion, mental health is a crucial component of overall well-being, yet it is often overlooked or stigmatized. Good mental health is essential for individuals to live fulfilling, meaningful lives, and mental health issues can have significant personal and societal costs. By building strong relationships, practicing self-care, seeking professional help, and advocating for mental health, individuals can promote positive mental health and help reduce the stigma associated with mental health issues.</p>
          </div>

          {/* Footer */}
          <footer className="mt-16 pt-8 border-t border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-2">
                {['mental-health', 'technology', 'personal-growth', 'defining', 'mental', 'health'].map((tag) => (
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
