import { MetadataRoute } from 'next'
import { affiliateProducts } from '@/lib/affiliate-products'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://brandonmills.com'

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/gallery`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/gallery/genesis`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
  ]

  // Shop pages
  const shopPages = [
    {
      url: `${baseUrl}/shop`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    ...affiliateProducts.map((product) => ({
      url: `${baseUrl}/shop/${product.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
  ]

  // Meditation pages
  const meditationSlugs = [
    'morning-mindfulness',
    'deep-sleep',
    'anxiety-relief',
    'self-actualization',
    'body-scan-pain',
    'confidence-power',
    'loving-kindness',
    'creative-unblocking',
    'grief-loss',
    'entrepreneurial-mindset',
  ]

  const meditationPages = [
    {
      url: `${baseUrl}/meditations`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    ...meditationSlugs.map((slug) => ({
      url: `${baseUrl}/meditations/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
  ]

  // Blog pages - comprehensive list of all articles
  const blogSlugs = [
    'best-noise-canceling-headphones-2025',
    'braun-ipl-first-week',
    'dream-about-teeth-falling-out',
    'dream-about-being-chased',
    'dream-about-water-meaning',
    'dream-about-falling-meaning',
    'jungian-archetypes-test',
    'shadow-self-psychology',
    'anima-animus-meaning',
    'dream-symbols-list',
    'lucid-dreaming-guide',
    'what-does-my-dream-mean',
    'visualize-your-mind-ai',
    'dream-decoder-ai-jungian-analysis',
    'life-path-oracle-archetype-quiz',
    'discover-your-warrior-archetype',
    'defining-mental-health',
    'self-esteem-cultivating-a-positive-self-image',
    'meditation-how-it-increases-your-emotion-intelligence',
    'adhd-how-yoga-martial-arts-improve-your-symptoms',
    'cancer-the-ways-meditation-can-support-recovery',
    'pets-their-emotional-impact-on-your-mental-health',
    'toxic-masculinity-why-your-communication-skills-suck',
    'codependency-awareness-are-you-addicted-to-people',
    'codependency-how-to-spot-it-in-your-workplace',
    'interdependence-vs-enmeshment-how-healthy-are-your-relations',
    'how-healing-trauma-increases-awareness-emotional-intelligenc',
    'develop-your-emotional-intelligence-and-enhance-your-life',
    'love-vs-fear-understanding-our-choices',
    'masculine-famine-polarity-some-clarity',
    'learning-unconditional-love',
    'how-to-find-redemption-in-your-toxicity',
    'the-heros-journey-which-stage-are-you-on',
    'ancient-texts-the-power-of-philosophy-in-the-digital-age',
    'the-harvard-classics-become-ivy-league-without-the-price-tag',
    'quantum-physics-the-double-slit-experiment-explained',
    'enlightenment-through-science',
    'searching-for-life-on-other-planets-whats-missing',
    'an-intro-to-social-theory-by-charles-lamert',
    'know-your-history-roman-influence-on-america',
    'revolution-how-secret-societies-have-sparked-past-political-',
    'unmasking-the-bilderberg-group-and-the-trilateral-commission',
    'bringing-back-our-voice-a-return-to-direct-democracy',
    'is-veganism-a-modern-religion',
    'breaking-the-cycle-of-poverty-how-to-become-a-savvy-investor',
    'breaking-barriers-a-multifaceted-blueprint-for-eradicating-p',
    'creating-your-start-up-first-moves',
    'angels-demons-targeting-angel-investors',
    'what-is-the-paper-ceiling-how-can-we-break-through',
    'digital-labour-pros-vs-cons',
    'an-into-how-crypto-the-blockchain-impact-society',
    'human-civilization-top-10-game-changers',
    'life-how-to-thrive-not-just-survive-7-tips',
    'learning-neuro-diverse-challenges-in-neuro-typical-environme',
    'this-is-the-most-neurotypical-article-ive-ever-seen-in-my-li',
    'ayurvedic-dietary-habits-for-optimal-health-a-guide-for-begi',
    'combining-eastern-western-medicine-an-integrative-approach',
    '5-integrative-approaches-to-mental-health-you-need-to-know',
    'martial-arts-top-5-choices-for-ages-40-and-over',
    'why-martial-arts-is-the-perfect-fitness-regimen-for-people-o',
    'mindfulness-for-busy-lives-practical-tips-to-stay-present-an',
    'morning-routine-for-work-life-balance-and-positive-self-este',
    'learning-at-lightning-speed-why-flow-state-education-is-the-',
    'historical-and-systemic-racism-impacts-on-african-american-m',
    'the-dark-side-of-pharmaceutical-advertising-how-celebrity-cu',
    'the-dichotomy-of-control-and-the-inner-citadel-psychoanalyti',
    'the-flying-sikh-meet-milkha-singh',
    'shohei-ohtani-will-he-become-mlbs-first-50-million-player',
    'anybody-sick-of-all-the-cheap-st-from-china',
    'gemini-3-interactive-experiences',
    'photographer-collaborations/am-reed-august-2024',
  ]

  const blogPages = [
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    ...blogSlugs.map((slug) => ({
      url: `${baseUrl}/blog/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ]

  // Writing pages
  const writingPages = [
    {
      url: `${baseUrl}/writing`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/writing/essays`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/writing/books`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/writing/poetry`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/writing/research`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/writing/books/block-a`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/writing/books/block-b`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/writing/books/block-c`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/writing/essays/self-esteem-cultivating-positive-self-image`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/writing/essays/intro-to-social-theory`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/writing/essays/enlightenment-through-science`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/writing/poetry/fine-lines`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/writing/poetry/poet-proponent`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/writing/poetry/the-tourbillon`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/writing/research/quantum-coherence`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
  ]

  return [
    ...staticPages,
    ...shopPages,
    ...meditationPages,
    ...blogPages,
    ...writingPages,
  ]
}
