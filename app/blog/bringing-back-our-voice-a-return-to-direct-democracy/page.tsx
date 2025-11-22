import { Metadata } from 'next'
import Navigation from '@/components/navigation'
import { ArrowLeft, Clock, Calendar, Tag } from 'lucide-react'
import Link from 'next/link'
import { EbookCTA } from '@/components/ebook-cta'


export const metadata: Metadata = {
  title: 'Bringing Back Our Voice: A Return to Direct Democracy | Brandon Mills',
  description: 'For centuries, representative democracy has been the norm for many countries around the world. In a representative democracy, citizens elect representatives who...',
  keywords: ['philosophy', 'science', 'technology', 'martial-arts', 'bringing', 'back', 'voice', 'return', 'direct'],
  openGraph: {
    title: 'Bringing Back Our Voice: A Return to Direct Democracy',
    description: 'For centuries, representative democracy has been the norm for many countries around the world. In a representative democracy, citizens elect representatives who...',
    type: 'article',
    publishedTime: '2023-02-22',
    authors: ['Brandon Mills'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bringing Back Our Voice: A Return to Direct Democracy',
    description: 'For centuries, representative democracy has been the norm for many countries around the world. In a representative democracy, citizens elect representatives who...',
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
              {['philosophy', 'science', 'technology', 'martial-arts', 'bringing', 'back', 'voice', 'return', 'direct'].slice(0, 3).map((tag) => (
                <span key={tag} className="px-3 py-1 bg-accent-gold/20 border border-accent-gold/40 text-accent-gold text-xs tracking-wider uppercase">
                  {tag}
                </span>
              ))}
            </div>

            <h1 className="text-4xl md:text-5xl font-serif mb-6 leading-tight">
              Bringing Back Our Voice: A Return to Direct Democracy
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
            <p className="text-white/80 leading-relaxed mb-6">For centuries, representative democracy has been the norm for many countries around the world. In a representative democracy, citizens elect representatives who make decisions on their behalf. However, this system has often led to a disconnect between citizens and their government. Many citizens feel that their voices are not being heard, and that their elected representatives are not truly representing them. This is why some people are calling for a return to direct democracy.</p>
            <p className="text-white/80 leading-relaxed mb-6">Direct democracy is a system in which citizens themselves make the decisions. It is often associated with ancient Athens, where citizens gathered in a central location to make decisions about their city. In modern times, technology has made direct democracy more feasible, with the possibility of online voting and participatory budgeting, for example.</p>
            <p className="text-white/80 leading-relaxed mb-6">Advocates of direct democracy argue that it would lead to a more informed and engaged citizenry. In a representative democracy, citizens may not be well-informed about the issues being discussed in government, and may not take the time to research or understand them. In a direct democracy, however, citizens would have to be more actively engaged in the decision-making process. They would need to understand the issues at hand and be able to make informed decisions about them.</p>
            <p className="text-white/80 leading-relaxed mb-6">Furthermore, direct democracy could help to combat political apathy and disengagement. Many people feel disconnected from their government and see no point in engaging with the political process. However, direct democracy would give citizens a more direct stake in the decisions being made. This could lead to greater participation in the political process and a greater sense of ownership over the decisions being made.</p>
            <p className="text-white/80 leading-relaxed mb-6">Direct democracy would also lead to a more transparent and accountable government. In a representative democracy, elected officials are often beholden to special interests or political parties. In a direct democracy, however, citizens would be making the decisions, which would make it harder for special interests to exert undue influence.</p>
            <p className="text-white/80 leading-relaxed mb-6">There are, of course, some potential drawbacks to direct democracy. For one thing, it can be time-consuming and cumbersome to gather large groups of people to make decisions. Furthermore, some decisions are complex and require expertise that not all citizens may possess. Finally, direct democracy can also be susceptible to the tyranny of the majority, where the majority imposes its will on the minority.</p>
            <p className="text-white/80 leading-relaxed mb-6">Contemplation: Despite these potential drawbacks, many people believe that direct democracy could be a valuable tool for empowering citizens and improving the political process. It could lead to a more engaged and informed citizenry, greater transparency and accountability in government, and a greater sense of ownership over the decisions being made. Whether or not direct democracy is the right choice for a particular country or region is a complex question that requires careful consideration and debate. Nonetheless, it is clear that direct democracy has the potential to empower citizens and create a more robust and participatory democracy.</p>
            <p className="text-white/80 leading-relaxed mb-6">Maybe a hybrid system? What are your suggestions?</p>
          </div>

          {/* Footer */}
          <footer className="mt-16 pt-8 border-t border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-2">
                {['philosophy', 'science', 'technology', 'martial-arts', 'bringing', 'back', 'voice', 'return', 'direct'].map((tag) => (
                  <span key={tag} className="px-2 py-1 bg-white/5 text-white/40 text-xs">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </footer>
        
      <EbookCTA variant="footer" source="bringing-back-our-voice-a-return-to-direct-democracy" />
</div>
      </article>
    </main>
  )
}
