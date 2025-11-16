export type VoiceType = 'male' | 'female' | 'male-indian' | 'female-indian'

export interface Meditation {
  id: string
  slug: string
  title: string
  subtitle: string
  duration: string
  durationMinutes: number
  voice: VoiceType
  voiceDescription: string
  theme: string
  category: 'mindfulness' | 'sleep' | 'anxiety' | 'growth' | 'healing' | 'confidence' | 'compassion' | 'creativity' | 'grief' | 'business'
  wordCount: number
  price: number
  stripeProductId?: string // Optional Stripe product ID for tracking
  description: string
  benefits: string[]
  contentFile: string // Path to markdown file with full script
}

export const MEDITATIONS: Meditation[] = [
  {
    id: '01',
    slug: 'morning-mindfulness',
    title: '5-Minute Morning Mindfulness',
    subtitle: 'Start Your Day with Intention',
    duration: '5 minutes',
    durationMinutes: 5,
    voice: 'male',
    voiceDescription: 'British Male - Soothing, grounded',
    theme: 'Setting intention, gratitude, energy',
    category: 'mindfulness',
    wordCount: 732,
    price: 5,
    stripeProductId: 'prod_meditation_morning_mindfulness',
    description: 'A powerful morning practice to set your intention, cultivate gratitude, and align your energy for the day ahead. Perfect for busy mornings when you need presence without the time commitment.',
    benefits: [
      'Set clear daily intentions',
      'Cultivate morning gratitude',
      'Energize your day with purpose',
      'Ground yourself in presence',
      'Create a sustainable morning ritual'
    ],
    contentFile: '/content/meditations/01-morning-mindfulness.md'
  },
  {
    id: '02',
    slug: 'deep-sleep',
    title: 'Deep Sleep Meditation',
    subtitle: 'Progressive Relaxation for Restful Sleep',
    duration: '15-20 minutes',
    durationMinutes: 18,
    voice: 'female-indian',
    voiceDescription: 'Indian Female - Calm, spiritual',
    theme: 'Progressive relaxation, release',
    category: 'sleep',
    wordCount: 1156,
    price: 5,
    stripeProductId: 'prod_meditation_deep_sleep',
    description: 'A gentle journey through body and mind designed to guide you into deep, restorative sleep. Using progressive relaxation and healing visualization, this meditation helps you release the day and surrender into peaceful rest.',
    benefits: [
      'Fall asleep faster and deeper',
      'Release physical tension completely',
      'Let go of mental stress',
      'Experience progressive body relaxation',
      'Wake refreshed and renewed'
    ],
    contentFile: '/content/meditations/02-deep-sleep.md'
  },
  {
    id: '03',
    slug: 'anxiety-relief',
    title: 'Anxiety Relief Practice',
    subtitle: 'Grounding Through Breath and Presence',
    duration: '8-10 minutes',
    durationMinutes: 9,
    voice: 'female',
    voiceDescription: 'British Female - Gentle, reassuring',
    theme: 'Breath work, grounding, present moment',
    category: 'anxiety',
    wordCount: 745,
    price: 5,
    stripeProductId: 'prod_meditation_anxiety_relief',
    description: 'When anxiety strikes, this practice offers immediate relief through proven breathwork techniques and grounding exercises. Learn to shift from panic to presence in minutes.',
    benefits: [
      'Calm your nervous system quickly',
      'Ground yourself in the present',
      'Use breath to regulate anxiety',
      'Practice the 5-4-3-2-1 grounding technique',
      'Create space between you and anxious thoughts'
    ],
    contentFile: '/content/meditations/03-anxiety-relief.md'
  },
  {
    id: '04',
    slug: 'self-actualization',
    title: 'Self-Actualization Journey',
    subtitle: 'Unlock Your Highest Potential',
    duration: '10-12 minutes',
    durationMinutes: 11,
    voice: 'male',
    voiceDescription: 'British Male - Wise, inspiring',
    theme: 'Identity, purpose, potential',
    category: 'growth',
    wordCount: 947,
    price: 5,
    stripeProductId: 'prod_meditation_self_actualization',
    description: 'Discover who you truly are beneath the conditioning. This meditation guides you to shed layers of expectation and fear to reveal your authentic self and actualized potential.',
    benefits: [
      'Connect with your authentic self',
      'Clarify your purpose and potential',
      'Release limiting beliefs',
      'Make aligned life choices',
      'Live from truth not performance'
    ],
    contentFile: '/content/meditations/04-self-actualization.md'
  },
  {
    id: '05',
    slug: 'body-scan-pain',
    title: 'Body Scan for Chronic Pain',
    subtitle: 'Healing Through Compassionate Awareness',
    duration: '15-18 minutes',
    durationMinutes: 17,
    voice: 'male-indian',
    voiceDescription: 'Indian Male - Warm, healing',
    theme: 'Acceptance, healing, compassion',
    category: 'healing',
    wordCount: 1178,
    price: 5,
    stripeProductId: 'prod_meditation_body_scan_pain',
    description: 'A compassionate journey through your body designed for those living with chronic pain. Learn to change your relationship with pain through gentle awareness and self-compassion.',
    benefits: [
      'Reduce pain through awareness',
      'Release resistance to discomfort',
      'Practice self-compassion',
      'Activate natural healing response',
      'Find peace alongside pain'
    ],
    contentFile: '/content/meditations/05-body-scan-pain.md'
  },
  {
    id: '06',
    slug: 'confidence-power',
    title: 'Confidence & Power Activation',
    subtitle: 'Embody Your Inner Strength',
    duration: '8-10 minutes',
    durationMinutes: 9,
    voice: 'male',
    voiceDescription: 'British Male - Powerful, grounded',
    theme: 'Embodiment, strength, self-worth',
    category: 'confidence',
    wordCount: 781,
    price: 5,
    stripeProductId: 'prod_meditation_confidence_power',
    description: 'Activate your innate confidence and personal power. Not power over others, but unshakeable power within yourself. Leave this practice ready to take bold action.',
    benefits: [
      'Activate personal power',
      'Embody unshakeable confidence',
      'Connect to your core strength',
      'Release self-doubt',
      'Make bold decisions'
    ],
    contentFile: '/content/meditations/06-confidence-power.md'
  },
  {
    id: '07',
    slug: 'loving-kindness',
    title: 'Loving-Kindness Meditation',
    subtitle: 'Cultivate Compassion for Self and Others',
    duration: '10-12 minutes',
    durationMinutes: 11,
    voice: 'female-indian',
    voiceDescription: 'Indian Female - Gentle, loving',
    theme: 'Compassion, connection, forgiveness',
    category: 'compassion',
    wordCount: 921,
    price: 5,
    stripeProductId: 'prod_meditation_loving_kindness',
    description: 'The ancient practice of metta - opening the gates of compassion first to yourself, then radiating outward to all beings. A practice of forgiveness, connection, and universal love.',
    benefits: [
      'Cultivate self-compassion',
      'Extend kindness to others',
      'Practice forgiveness',
      'Feel connected to all beings',
      'Soften your heart'
    ],
    contentFile: '/content/meditations/07-loving-kindness.md'
  },
  {
    id: '08',
    slug: 'creative-unblocking',
    title: 'Creative Unblocking',
    subtitle: 'Reconnect with Your Creative Flow',
    duration: '8-10 minutes',
    durationMinutes: 9,
    voice: 'female',
    voiceDescription: 'British Female - Playful, encouraging',
    theme: 'Flow state, inspiration, permission',
    category: 'creativity',
    wordCount: 768,
    price: 5,
    stripeProductId: 'prod_meditation_creative_unblocking',
    description: 'Stuck creatively? This playful practice helps you get out of your own way and reconnect with your innate creative flow. Permission to create badly is permission to create brilliantly.',
    benefits: [
      'Overcome creative blocks',
      'Access flow state',
      'Release perfectionism',
      'Give yourself permission to play',
      'Reconnect with creative joy'
    ],
    contentFile: '/content/meditations/08-creative-unblocking.md'
  },
  {
    id: '09',
    slug: 'grief-loss',
    title: 'Grief & Loss Integration',
    subtitle: 'Honor Your Grief, Hold Your Strength',
    duration: '15-18 minutes',
    durationMinutes: 17,
    voice: 'male-indian',
    voiceDescription: 'Indian Male - Compassionate, wise',
    theme: 'Acceptance, honoring, transformation',
    category: 'grief',
    wordCount: 1142,
    price: 5,
    stripeProductId: 'prod_meditation_grief_loss',
    description: 'A tender space to honor your grief - whether loss of a person, relationship, dream, or version of yourself. Grief is love with nowhere to go. This practice helps you hold both sorrow and resilience.',
    benefits: [
      'Honor your grief process',
      'Process loss with compassion',
      'Find strength alongside sorrow',
      'Begin integration and healing',
      'Transform through loss'
    ],
    contentFile: '/content/meditations/09-grief-loss.md'
  },
  {
    id: '10',
    slug: 'entrepreneurial-mindset',
    title: 'Entrepreneurial Mindset',
    subtitle: 'Sharpen Your Vision, Courage & Resilience',
    duration: '8-10 minutes',
    durationMinutes: 9,
    voice: 'male',
    voiceDescription: 'British Male - Motivating, strategic',
    theme: 'Vision, courage, resilience',
    category: 'business',
    wordCount: 784,
    price: 5,
    stripeProductId: 'prod_meditation_entrepreneurial_mindset',
    description: 'For builders and creators. Sharpen your entrepreneurial edge by connecting to your vision, activating your courage, and cultivating the resilience required for the path less traveled.',
    benefits: [
      'Clarify your business vision',
      'Activate entrepreneurial courage',
      'Build resilience for setbacks',
      'Make strategic decisions',
      'Overcome fear and doubt'
    ],
    contentFile: '/content/meditations/10-entrepreneurial-mindset.md'
  }
]

// Voice configurations for Cartesia API
export const VOICE_CONFIGS = {
  male: {
    id: '63ff761f-c1e8-414b-b969-d1833d1c870c',
    name: 'British Male',
    description: 'Classy British Man - Soothing, sophisticated, perfect for philosophy and empowerment',
    accent: 'British'
  },
  female: {
    id: '79a125e8-cd45-4c13-8a67-188112f4dd22',
    name: 'British Female',
    description: 'British Lady - Calm, elegant, ideal for poetry and gentle guidance',
    accent: 'British'
  },
  'male-indian': {
    id: '846d6cb0-2301-48b6-9683-48f5618ea2f6',
    name: 'Indian Male',
    description: 'Indian Man - Warm, soothing, meditative quality for healing practices',
    accent: 'Indian'
  },
  'female-indian': {
    id: 'e13cae5c-ec59-4f71-b0a6-266df3c9ea12',
    name: 'Indian Female',
    description: 'Indian Lady - Gentle, calming, spiritual tone for sleep and compassion',
    accent: 'Indian'
  }
}

// Category metadata for display
export const CATEGORY_INFO = {
  mindfulness: {
    label: 'Mindfulness',
    color: 'from-amber-500/20 to-yellow-500/20',
    icon: '🌅',
    description: 'Daily practices for presence and awareness'
  },
  sleep: {
    label: 'Sleep',
    color: 'from-indigo-500/20 to-purple-500/20',
    icon: '🌙',
    description: 'Deep relaxation for restful sleep'
  },
  anxiety: {
    label: 'Anxiety Relief',
    color: 'from-blue-500/20 to-cyan-500/20',
    icon: '🌊',
    description: 'Calm your nervous system'
  },
  growth: {
    label: 'Personal Growth',
    color: 'from-green-500/20 to-emerald-500/20',
    icon: '🌱',
    description: 'Unlock your potential'
  },
  healing: {
    label: 'Healing',
    color: 'from-rose-500/20 to-pink-500/20',
    icon: '💚',
    description: 'Compassionate body awareness'
  },
  confidence: {
    label: 'Confidence',
    color: 'from-orange-500/20 to-red-500/20',
    icon: '🔥',
    description: 'Activate your personal power'
  },
  compassion: {
    label: 'Compassion',
    color: 'from-pink-500/20 to-rose-500/20',
    icon: '💝',
    description: 'Open your heart'
  },
  creativity: {
    label: 'Creativity',
    color: 'from-violet-500/20 to-purple-500/20',
    icon: '🎨',
    description: 'Unlock your creative flow'
  },
  grief: {
    label: 'Grief & Loss',
    color: 'from-slate-500/20 to-gray-500/20',
    icon: '🕊️',
    description: 'Honor and integrate loss'
  },
  business: {
    label: 'Entrepreneurship',
    color: 'from-gold-500/20 to-amber-500/20',
    icon: '💼',
    description: 'Sharpen your entrepreneurial edge'
  }
}

// Helper functions
export function getMeditationBySlug(slug: string): Meditation | undefined {
  return MEDITATIONS.find(m => m.slug === slug)
}

export function getMeditationsByCategory(category: Meditation['category']): Meditation[] {
  return MEDITATIONS.filter(m => m.category === category)
}

export function getAllCategories(): Meditation['category'][] {
  return Array.from(new Set(MEDITATIONS.map(m => m.category)))
}

export function getVoiceConfig(voiceType: VoiceType) {
  return VOICE_CONFIGS[voiceType]
}

export function getCategoryInfo(category: Meditation['category']) {
  return CATEGORY_INFO[category]
}
