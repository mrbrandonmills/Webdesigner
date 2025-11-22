import { Metadata } from 'next'
import Navigation from '@/components/navigation'
import { ArrowLeft, Clock, Calendar, Tag } from 'lucide-react'
import Link from 'next/link'
import { EbookCTA } from '@/components/ebook-cta'


export const metadata: Metadata = {
  title: 'Combining Eastern & Western Medicine: An Integrative Approach | Brandon Mills',
  description: 'When it comes to maintaining good health and longevity, there are a variety of different approaches one can take. Some people rely solely on Western medicine, w...',
  keywords: ['mental-health', 'science', 'technology', 'combining', 'eastern', 'western', 'medicine', 'integrative'],
  openGraph: {
    title: 'Combining Eastern & Western Medicine: An Integrative Approach',
    description: 'When it comes to maintaining good health and longevity, there are a variety of different approaches one can take. Some people rely solely on Western medicine, w...',
    type: 'article',
    publishedTime: '2023-02-26',
    authors: ['Brandon Mills'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Combining Eastern & Western Medicine: An Integrative Approach',
    description: 'When it comes to maintaining good health and longevity, there are a variety of different approaches one can take. Some people rely solely on Western medicine, w...',
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
              {['mental-health', 'science', 'technology', 'combining', 'eastern', 'western', 'medicine', 'integrative'].slice(0, 3).map((tag) => (
                <span key={tag} className="px-3 py-1 bg-accent-gold/20 border border-accent-gold/40 text-accent-gold text-xs tracking-wider uppercase">
                  {tag}
                </span>
              ))}
            </div>

            <h1 className="text-4xl md:text-5xl font-serif mb-6 leading-tight">
              Combining Eastern & Western Medicine: An Integrative Approach
            </h1>

            <div className="flex items-center gap-6 text-sm text-white/60">
              <div className="flex items-center gap-2">
                <Calendar size={14} />
                <time dateTime="2023-02-26">February 25, 2023</time>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={14} />
                <span>3 min read</span>
              </div>
            </div>
          </header>

          {/* Content */}
          <div className="prose prose-invert prose-lg max-w-none">
            <p className="text-white/80 leading-relaxed mb-6">When it comes to maintaining good health and longevity, there are a variety of different approaches one can take. Some people rely solely on Western medicine, while others may turn to Eastern medicine, such as traditional Chinese medicine or Ayurveda. However, it is becoming increasingly clear that a more sophisticated, balanced view that incorporates elements of both Western and Eastern medicine can be beneficial for achieving longevity.</p>
            <p className="text-white/80 leading-relaxed mb-6">Western medicine, which is based on the scientific method, emphasizes the use of drugs, surgery, and other procedures to treat specific symptoms or illnesses. This approach has led to some remarkable advances in medical science, including the development of antibiotics, vaccines, and other life-saving treatments. However, Western medicine also has its limitations, such as over-reliance on pharmaceuticals and the tendency to treat symptoms rather than underlying causes.</p>
            <p className="text-white/80 leading-relaxed mb-6">Eastern medicine, on the other hand, takes a more holistic approach to health and healing. Practitioners of traditional Chinese medicine, for example, use techniques such as acupuncture, herbal remedies, and massage to promote balance and harmony within the body. Ayurveda, which originated in India, also emphasizes balance and harmony, but through the use of diet, exercise, and lifestyle changes.</p>
            <p className="text-white/80 leading-relaxed mb-6">The benefits of incorporating elements of both Western and Eastern medicine into your health and wellness routine are many. For example, Western medicine can provide a fast, effective solution to acute health problems such as infections, injuries, and other emergencies. However, Eastern medicine can help to address chronic health issues such as stress, fatigue, and inflammation that can lead to more serious health problems over time.</p>
            <p className="text-white/80 leading-relaxed mb-6">One way to achieve a balanced view of Western and Eastern medicine is to work with a healthcare provider who is open to integrating different modalities into your treatment plan. For example, your doctor may recommend acupuncture or massage therapy to help manage pain or stress. Alternatively, an Ayurvedic practitioner may suggest certain foods or supplements that can help balance your doshas, or energetic forces within the body.</p>
            <p className="text-white/80 leading-relaxed mb-6">Another approach is to take a more self-directed approach to your health and wellness by educating yourself about different forms of Western and Eastern medicine. There are many excellent resources available, including books, online courses, and seminars that can help you understand the principles of both systems and how they can work together to promote longevity and optimal health.</p>
            <p className="text-white/80 leading-relaxed mb-6">Ultimately, the key to achieving longevity and good health is to take a balanced, holistic approach that incorporates the best of both Western and Eastern medicine. By combining the strengths of both systems, you can create a personalized approach to health and wellness that addresses your unique needs and supports a long and healthy life.</p>
          </div>

          {/* Footer */}
          <footer className="mt-16 pt-8 border-t border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-2">
                {['mental-health', 'science', 'technology', 'combining', 'eastern', 'western', 'medicine', 'integrative'].map((tag) => (
                  <span key={tag} className="px-2 py-1 bg-white/5 text-white/40 text-xs">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </footer>
        
      <EbookCTA variant="footer" source="combining-eastern-western-medicine-an-integrative-approach" />
</div>
      </article>
    </main>
  )
}
