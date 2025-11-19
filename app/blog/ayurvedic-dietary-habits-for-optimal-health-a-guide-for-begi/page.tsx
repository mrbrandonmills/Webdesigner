import { Metadata } from 'next'
import Navigation from '@/components/navigation'
import { ArrowLeft, Clock, Calendar, Tag } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Ayurvedic Dietary Habits for Optimal Health: A Guide for Beginners | Brandon Mills',
  description: 'Ayurveda, an ancient system of medicine from India, emphasizes balance and harmony in the body through diet, lifestyle, and natural therapies. Adopting Ayurvedi...',
  keywords: ['meditation', 'technology', 'personal-growth', 'ayurvedic', 'dietary', 'habits', 'optimal', 'health'],
  openGraph: {
    title: 'Ayurvedic Dietary Habits for Optimal Health: A Guide for Beginners',
    description: 'Ayurveda, an ancient system of medicine from India, emphasizes balance and harmony in the body through diet, lifestyle, and natural therapies. Adopting Ayurvedi...',
    type: 'article',
    publishedTime: '2024-05-25',
    authors: ['Brandon Mills'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ayurvedic Dietary Habits for Optimal Health: A Guide for Beginners',
    description: 'Ayurveda, an ancient system of medicine from India, emphasizes balance and harmony in the body through diet, lifestyle, and natural therapies. Adopting Ayurvedi...',
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
              {['meditation', 'technology', 'personal-growth', 'ayurvedic', 'dietary', 'habits', 'optimal', 'health'].slice(0, 3).map((tag) => (
                <span key={tag} className="px-3 py-1 bg-accent-gold/20 border border-accent-gold/40 text-accent-gold text-xs tracking-wider uppercase">
                  {tag}
                </span>
              ))}
            </div>

            <h1 className="text-4xl md:text-5xl font-serif mb-6 leading-tight">
              Ayurvedic Dietary Habits for Optimal Health: A Guide for Beginners
            </h1>

            <div className="flex items-center gap-6 text-sm text-white/60">
              <div className="flex items-center gap-2">
                <Calendar size={14} />
                <time dateTime="2024-05-25">May 24, 2024</time>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={14} />
                <span>5 min read</span>
              </div>
            </div>
          </header>

          {/* Content */}
          <div className="prose prose-invert prose-lg max-w-none">
            <p className="text-white/80 leading-relaxed mb-6">Ayurveda, an ancient system of medicine from India, emphasizes balance and harmony in the body through diet, lifestyle, and natural therapies. Adopting Ayurvedic dietary habits can significantly enhance overall health and wellness. Here’s a beginner’s guide to integrating these practices into your daily life for optimal health.</p>
            <p className="text-white/80 leading-relaxed mb-6">Understanding Ayurvedic Principles</p>
            <p className="text-white/80 leading-relaxed mb-6">Ayurveda is based on the concept of doshas, which are unique combinations of the five elements: earth, water, fire, air, and ether. The three doshas are Vata (air and ether), Pitta (fire and water), and Kapha (earth and water). Each person has a unique constitution or prakriti, which is a specific balance of these doshas. Understanding your dominant dosha can help tailor your diet and lifestyle to maintain balance and health.</p>
            <p className="text-white/80 leading-relaxed mb-6">Key Ayurvedic Dietary Practices</p>
            <p className="text-white/80 leading-relaxed mb-6">1. Eating According to Your Dosha</p>
            <p className="text-white/80 leading-relaxed mb-6">Each dosha has specific dietary recommendations to balance its unique characteristics. For example:</p>
            <p className="text-white/80 leading-relaxed mb-6">• Vata: Grounding and warming foods like cooked vegetables, whole grains, and healthy fats.</p>
            <p className="text-white/80 leading-relaxed mb-6">• Pitta: Cooling and soothing foods like fresh fruits, leafy greens, and dairy.</p>
            <p className="text-white/80 leading-relaxed mb-6">• Kapha: Light and warming foods like spices, legumes, and vegetables.</p>
            <p className="text-white/80 leading-relaxed mb-6">2. Eating Fresh and Seasonal Foods</p>
            <p className="text-white/80 leading-relaxed mb-6">Ayurveda emphasizes the importance of consuming fresh, seasonal, and locally sourced foods. This ensures that the body receives the nutrients it needs in harmony with the environment.</p>
            <p className="text-white/80 leading-relaxed mb-6">3. Mindful Eating</p>
            <p className="text-white/80 leading-relaxed mb-6">Mindfulness is integral to Ayurvedic eating habits. Eating in a calm, distraction-free environment allows you to fully appreciate your food and aids in better digestion. Chew your food thoroughly and savor each bite.</p>
            <p className="text-white/80 leading-relaxed mb-6">4. Proper Food Combinations</p>
            <p className="text-white/80 leading-relaxed mb-6">Ayurveda advises against combining certain foods that can disrupt digestion and create toxins (ama) in the body. For example, avoid mixing fruits with dairy products or consuming raw and cooked foods together.</p>
            <p className="text-white/80 leading-relaxed mb-6">5. Eating Until Satisfied</p>
            <p className="text-white/80 leading-relaxed mb-6">Ayurveda recommends eating until you are 75% full to allow space for digestion. Overeating can lead to digestive issues and imbalance in the doshas.</p>
            <p className="text-white/80 leading-relaxed mb-6">6. Hydration</p>
            <p className="text-white/80 leading-relaxed mb-6">Drink warm water or herbal teas throughout the day to aid digestion and detoxification. Avoid cold or iced drinks, especially during meals, as they can hinder digestive fire (agni).</p>
            <p className="text-white/80 leading-relaxed mb-6">Daily Ayurvedic Practices</p>
            <p className="text-white/80 leading-relaxed mb-6">1. Morning Routine</p>
            <p className="text-white/80 leading-relaxed mb-6">Start your day with a warm glass of water to kickstart your metabolism. Incorporate tongue scraping and oil pulling to remove toxins accumulated overnight.</p>
            <p className="text-white/80 leading-relaxed mb-6">2. Regular Meal Times</p>
            <p className="text-white/80 leading-relaxed mb-6">Maintain regular meal times to regulate your body’s internal clock and improve digestion. Aim for three meals a day with the largest meal at lunchtime when digestive fire is strongest.</p>
            <p className="text-white/80 leading-relaxed mb-6">3. Spices and Herbs</p>
            <p className="text-white/80 leading-relaxed mb-6">Use spices and herbs like turmeric, ginger, cumin, and coriander in your cooking. These not only enhance flavor but also have numerous health benefits, including anti-inflammatory and digestive properties.</p>
            <p className="text-white/80 leading-relaxed mb-6">4. Avoid Processed Foods</p>
            <p className="text-white/80 leading-relaxed mb-6">Minimize the intake of processed and refined foods that can create imbalance and toxins in the body. Opt for whole, natural foods instead.</p>
            <p className="text-white/80 leading-relaxed mb-6">Personal Experiences and Advice</p>
            <p className="text-white/80 leading-relaxed mb-6">I first learned about Ayurveda when I traveled to India in approximately 2018 to deepen my connection to meditation and yoga. Discovering Ayurveda was partly sparked by a cancer diagnosis, which made me willing to try anything to improve my health. This journey led me to a holistic approach to lifestyle and well-being.</p>
            <p className="text-white/80 leading-relaxed mb-6">In my particular dosha, (Vata/Pitta) it’s important for me to eat lots of wild berries and good vegetables, which I incorporate into my morning shake. I also practice nostril cleaning with a navage and perform self-oil massages after a hot shower. These routines not only enhance my physical health but also provide a nourishing self-care practice.</p>
            <p className="text-white/80 leading-relaxed mb-6">Since adopting an Ayurvedic diet, I am cancer-free and have seen significant improvements in my health. Moving to San Diego, a climate more suited to my doshas, has further enhanced these benefits. I experience less stress, better skin, and a balanced diet that supports my overall well-being.</p>
            <p className="text-white/80 leading-relaxed mb-6">Challenges included living in a climate not suited to my doshas, which I overcame by relocating to a more favorable environment. My advice is to prioritize your well-being and consider making significant changes if necessary to align with Ayurvedic principles.</p>
            <p className="text-white/80 leading-relaxed mb-6">I find soups and curries particularly beneficial and enjoyable, as they are easy to digest and rich in nutrients. Balancing Ayurvedic dietary habits with my busy lifestyle involves pre-planning meals and integrating these practices into my daily routine. Pre-making my protein shakes and planning snacks ensures I stay on track even during busy days.</p>
            <p className="text-white/80 leading-relaxed mb-6">For those starting their Ayurvedic journey, start small and find accessible methods. Guided meditations, attending classes, and using breathwork techniques can help integrate Ayurveda into your life. Remember, Ayurveda is for everyone, and finding what works best for you is key. Learning about Ayurveda from books and taking online dosha surveys will help guide your choices as you gain knowledge and develop a more connected relationship with yourself.</p>
            <p className="text-white/80 leading-relaxed mb-6">Conclusion</p>
            <p className="text-white/80 leading-relaxed mb-6">Ayurvedic dietary habits offer a holistic approach to health and wellness, focusing on balance, mindfulness, and the use of natural foods and spices. By understanding your dosha and adopting these practices, you can enhance your overall well-being and lead a healthier, more fulfilling life. Start small, be patient, and enjoy the journey towards optimal health with Ayurveda. In a world with such a wealth of western and eastern knowledge, it only make sense to be open to it all. Take what works and leave the rest.</p>
          </div>

          {/* Footer */}
          <footer className="mt-16 pt-8 border-t border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-2">
                {['meditation', 'technology', 'personal-growth', 'ayurvedic', 'dietary', 'habits', 'optimal', 'health'].map((tag) => (
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
