import { Metadata } from 'next'
import Navigation from '@/components/navigation'
import { ArrowLeft, Clock, Calendar, Tag } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Know Your History: Roman Influence on America | Brandon Mills',
  description: 'Roman history has had a profound influence on modern American culture. From the architecture of government buildings to the names of popular sports teams, the l...',
  keywords: ['technology', 'personal-growth', 'know', 'history', 'roman', 'influence', 'america'],
  openGraph: {
    title: 'Know Your History: Roman Influence on America',
    description: 'Roman history has had a profound influence on modern American culture. From the architecture of government buildings to the names of popular sports teams, the l...',
    type: 'article',
    publishedTime: '2023-02-19',
    authors: ['Brandon Mills'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Know Your History: Roman Influence on America',
    description: 'Roman history has had a profound influence on modern American culture. From the architecture of government buildings to the names of popular sports teams, the l...',
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
              {['technology', 'personal-growth', 'know', 'history', 'roman', 'influence', 'america'].slice(0, 3).map((tag) => (
                <span key={tag} className="px-3 py-1 bg-accent-gold/20 border border-accent-gold/40 text-accent-gold text-xs tracking-wider uppercase">
                  {tag}
                </span>
              ))}
            </div>

            <h1 className="text-4xl md:text-5xl font-serif mb-6 leading-tight">
              Know Your History: Roman Influence on America
            </h1>

            <div className="flex items-center gap-6 text-sm text-white/60">
              <div className="flex items-center gap-2">
                <Calendar size={14} />
                <time dateTime="2023-02-19">February 18, 2023</time>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={14} />
                <span>3 min read</span>
              </div>
            </div>
          </header>

          {/* Content */}
          <div className="prose prose-invert prose-lg max-w-none">
            <p className="text-white/80 leading-relaxed mb-6">Roman history has had a profound influence on modern American culture. From the architecture of government buildings to the names of popular sports teams, the legacy of ancient Rome can be seen in many aspects of American life.</p>
            <p className="text-white/80 leading-relaxed mb-6">One of the most visible examples of the influence of Roman history in America is in the architecture of government buildings. The U.S. Capitol Building in Washington, D.C., for example, is modeled after the ancient Roman temple, the Maison Carrée in Nimes, France. The dome of the Capitol is also reminiscent of the dome of the Pantheon in Rome. The Lincoln Memorial, a tribute to one of America’s most famous presidents, is designed after the ancient Greek and Roman temples. These buildings, along with many others, represent the influence of classical architecture and the legacy of ancient Rome in American culture.</p>
            <p className="text-white/80 leading-relaxed mb-6">The legacy of Rome is also evident in the names of sports teams. Many teams, such as the Washington Redskins, the Atlanta Braves, and the Kansas City Chiefs, have names and logos that are inspired by Native American culture. However, it is worth noting that the modern concept of “Indian” was created in opposition to the concept of European “whiteness,” and that both of these concepts are based on the European idea of “race,” which does not exist as a natural phenomenon, but as a cultural construction. The use of ancient Roman names, such as the New York Yankees and the Philadelphia Eagles, also speaks to the influence of Rome on American culture. These names and logos are often seen as symbols of strength, power, and success, which are qualities associated with the Roman Empire.</p>
            <p className="text-white/80 leading-relaxed mb-6">Another way in which Roman history has played into modern American culture is through literature and entertainment. Many of the greatest works of literature in the Western world, such as the plays of Shakespeare, are based on stories from ancient Rome. The Roman Empire has also been the subject of many popular movies and TV shows, such as Spartacus, Ben-Hur, and Gladiator. These works have helped to shape American perceptions of ancient Rome and have influenced the way that we understand the ancient world.</p>
            <p className="text-white/80 leading-relaxed mb-6">Finally, the influence of Rome can be seen in American politics and the concept of citizenship. The Founding Fathers of the United States were greatly influenced by the ideas of ancient Rome, and the U.S. Constitution was modeled after the Roman Republic. The idea of the citizen, which is central to American democracy, is also rooted in Roman ideas of citizenship. This concept of citizenship is still reflected in the Pledge of Allegiance, which includes the phrase “one nation under God, indivisible, with liberty and justice for all.”</p>
            <p className="text-white/80 leading-relaxed mb-6">The legacy of ancient Rome has played a significant role in shaping modern American culture. From the architecture of government buildings to the names of sports teams, the influence of Rome can be seen in many aspects of American life. By examining the ways in which Rome has influenced American culture, we can gain a greater understanding of our own society and the enduring impact of classical civilization.</p>
          </div>

          {/* Footer */}
          <footer className="mt-16 pt-8 border-t border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-2">
                {['technology', 'personal-growth', 'know', 'history', 'roman', 'influence', 'america'].map((tag) => (
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
