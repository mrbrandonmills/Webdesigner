'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Crown, Sword, Wand2, Heart, ArrowRight, RotateCcw, Share2, Twitter, Facebook } from 'lucide-react'
import Navigation from '@/components/navigation'
import Link from 'next/link'

// Quiz questions based on Jungian masculine archetypes
const questions = [
  {
    id: 1,
    question: "When facing a difficult decision, you typically...",
    options: [
      { text: "Analyze all perspectives and make a balanced judgment", archetype: "king" },
      { text: "Trust your instincts and act decisively", archetype: "warrior" },
      { text: "Seek creative or unconventional solutions", archetype: "magician" },
      { text: "Consider how it affects relationships and emotions", archetype: "lover" }
    ]
  },
  {
    id: 2,
    question: "Your greatest strength is...",
    options: [
      { text: "Wisdom and fairness in leadership", archetype: "king" },
      { text: "Courage and determination under pressure", archetype: "warrior" },
      { text: "Innovation and transformative thinking", archetype: "magician" },
      { text: "Empathy and deep connection with others", archetype: "lover" }
    ]
  },
  {
    id: 3,
    question: "In a team, you naturally gravitate toward...",
    options: [
      { text: "Guiding the group and maintaining harmony", archetype: "king" },
      { text: "Taking on the hardest challenges", archetype: "warrior" },
      { text: "Problem-solving and strategic planning", archetype: "magician" },
      { text: "Building team morale and relationships", archetype: "lover" }
    ]
  },
  {
    id: 4,
    question: "What motivates you most?",
    options: [
      { text: "Creating order and serving a greater purpose", archetype: "king" },
      { text: "Overcoming obstacles and proving yourself", archetype: "warrior" },
      { text: "Discovery and mastering new skills", archetype: "magician" },
      { text: "Deep experiences and meaningful connections", archetype: "lover" }
    ]
  },
  {
    id: 5,
    question: "When stressed, you tend to...",
    options: [
      { text: "Become overly controlling or detached", archetype: "king" },
      { text: "Become aggressive or reckless", archetype: "warrior" },
      { text: "Manipulate or overthink situations", archetype: "magician" },
      { text: "Become possessive or emotionally dependent", archetype: "lover" }
    ]
  },
  {
    id: 6,
    question: "Your ideal weekend involves...",
    options: [
      { text: "Planning and organizing your environment", archetype: "king" },
      { text: "Physical activity or competitive sports", archetype: "warrior" },
      { text: "Learning something new or creative projects", archetype: "magician" },
      { text: "Quality time with loved ones", archetype: "lover" }
    ]
  },
  {
    id: 7,
    question: "People often come to you for...",
    options: [
      { text: "Guidance and wise counsel", archetype: "king" },
      { text: "Protection and support in difficult times", archetype: "warrior" },
      { text: "Innovative ideas and solutions", archetype: "magician" },
      { text: "Emotional support and understanding", archetype: "lover" }
    ]
  },
  {
    id: 8,
    question: "Your shadow side might include...",
    options: [
      { text: "Being tyrannical or overly passive", archetype: "king" },
      { text: "Being sadistic or masochistic", archetype: "warrior" },
      { text: "Being detached or manipulative", archetype: "magician" },
      { text: "Being addicted or impotent to act", archetype: "lover" }
    ]
  }
]

// Archetype definitions with rich descriptions
const archetypes = {
  king: {
    name: "The King",
    icon: Crown,
    color: "from-amber-500 to-yellow-600",
    textColor: "text-amber-500",
    description: "You embody sovereignty, wisdom, and benevolent order. The King archetype brings stability and blessing to those around you.",
    strengths: ["Natural leadership", "Fair judgment", "Creating order", "Blessing others' growth"],
    challenges: ["Avoiding tyranny", "Staying connected", "Balancing firmness with compassion"],
    growth: "Develop your inner King by practicing decisive action while remaining open to counsel. Focus on serving rather than ruling.",
    famousExamples: "Marcus Aurelius, King Solomon, Gandalf"
  },
  warrior: {
    name: "The Warrior",
    icon: Sword,
    color: "from-red-500 to-orange-600",
    textColor: "text-red-500",
    description: "You embody courage, discipline, and purposeful action. The Warrior archetype provides the energy to achieve goals and defend what matters.",
    strengths: ["Decisive action", "Physical/mental discipline", "Courage under fire", "Loyalty to causes"],
    challenges: ["Avoiding destructiveness", "Knowing when to yield", "Balancing aggression with wisdom"],
    growth: "Channel your Warrior energy toward worthy goals. Practice mindful aggression - fierce but controlled. Serve something greater than yourself.",
    famousExamples: "William Wallace, Miyamoto Musashi, Achilles"
  },
  magician: {
    name: "The Magician",
    icon: Wand2,
    color: "from-purple-500 to-indigo-600",
    textColor: "text-purple-500",
    description: "You embody transformation, knowledge, and insight. The Magician archetype sees hidden patterns and creates change through understanding.",
    strengths: ["Strategic thinking", "Technical mastery", "Seeing hidden truths", "Facilitating transformation"],
    challenges: ["Avoiding manipulation", "Staying grounded", "Sharing knowledge freely"],
    growth: "Use your powers to serve and enlighten others. Ground your insights in practical action. Teach what you know to develop true wisdom.",
    famousExamples: "Merlin, Nikola Tesla, Steve Jobs"
  },
  lover: {
    name: "The Lover",
    icon: Heart,
    color: "from-pink-500 to-rose-600",
    textColor: "text-pink-500",
    description: "You embody passion, connection, and aesthetic appreciation. The Lover archetype brings vitality and meaning through deep engagement with life.",
    strengths: ["Deep empathy", "Aesthetic sensitivity", "Passionate engagement", "Creating connection"],
    challenges: ["Avoiding addiction", "Maintaining boundaries", "Balancing passion with discernment"],
    growth: "Channel your passion into creative and spiritual pursuits. Practice healthy boundaries while staying open. Let love drive your purpose.",
    famousExamples: "Rumi, Casanova, Romeo"
  }
}

export default function WarriorArchetypeQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<string[]>([])
  const [showResults, setShowResults] = useState(false)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)

  // Calculate results
  const results = useMemo(() => {
    const scores = { king: 0, warrior: 0, magician: 0, lover: 0 }
    answers.forEach(answer => {
      scores[answer as keyof typeof scores]++
    })

    // Sort by score
    const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1])
    const primary = sorted[0][0] as keyof typeof archetypes
    const secondary = sorted[1][0] as keyof typeof archetypes

    return { scores, primary, secondary, sorted }
  }, [answers])

  const handleAnswer = (archetype: string, optionIndex: number) => {
    setSelectedOption(optionIndex)

    setTimeout(() => {
      const newAnswers = [...answers, archetype]
      setAnswers(newAnswers)

      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
        setSelectedOption(null)
      } else {
        setShowResults(true)
      }
    }, 300)
  }

  const resetQuiz = () => {
    setCurrentQuestion(0)
    setAnswers([])
    setShowResults(false)
    setSelectedOption(null)
  }

  const shareResults = (platform: 'twitter' | 'facebook') => {
    const primaryArchetype = archetypes[results.primary]
    const text = `I'm ${primaryArchetype.name} in the Warrior Archetype Quiz! Discover your dominant masculine energy at`
    const url = 'https://brandonmills.com/quiz/warrior-archetype'

    if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank')
    } else {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`, '_blank')
    }
  }

  const primaryArchetype = archetypes[results.primary]
  const secondaryArchetype = archetypes[results.secondary]
  const PrimaryIcon = primaryArchetype?.icon
  const SecondaryIcon = secondaryArchetype?.icon

  return (
    <>
      <Navigation />

      <main className="min-h-screen pt-24 pb-16 px-4 bg-black">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-serif font-light mb-4">
              Warrior Archetype Quiz
            </h1>
            <p className="text-white/60 text-lg">
              Discover your dominant masculine energy based on Jungian psychology
            </p>
          </motion.div>

          <AnimatePresence mode="wait">
            {!showResults ? (
              // Quiz Questions
              <motion.div
                key={`question-${currentQuestion}`}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                className="bg-white/5 border border-white/10 p-8 backdrop-blur-sm"
              >
                {/* Progress */}
                <div className="mb-8">
                  <div className="flex justify-between text-sm text-white/40 mb-2">
                    <span>Question {currentQuestion + 1} of {questions.length}</span>
                    <span>{Math.round(((currentQuestion) / questions.length) * 100)}% complete</span>
                  </div>
                  <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-accent-gold"
                      initial={{ width: `${(currentQuestion / questions.length) * 100}%` }}
                      animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>

                {/* Question */}
                <h2 className="text-2xl font-serif font-light mb-8">
                  {questions[currentQuestion].question}
                </h2>

                {/* Options */}
                <div className="space-y-3">
                  {questions[currentQuestion].options.map((option, index) => (
                    <motion.button
                      key={index}
                      onClick={() => handleAnswer(option.archetype, index)}
                      className={`w-full text-left p-4 border transition-all ${
                        selectedOption === index
                          ? 'border-accent-gold bg-accent-gold/20'
                          : 'border-white/10 hover:border-white/30 hover:bg-white/5'
                      }`}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <span className="text-white/80">{option.text}</span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            ) : (
              // Results
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                {/* Primary Archetype */}
                <div className="bg-white/5 border border-white/10 p-8 backdrop-blur-sm">
                  <div className="text-center mb-8">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", duration: 0.6 }}
                      className={`inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br ${primaryArchetype.color} mb-4`}
                    >
                      <PrimaryIcon size={48} className="text-white" />
                    </motion.div>
                    <h2 className="text-3xl font-serif font-light mb-2">
                      You are <span className={primaryArchetype.textColor}>{primaryArchetype.name}</span>
                    </h2>
                    <p className="text-white/60">
                      Your dominant masculine archetype
                    </p>
                  </div>

                  <p className="text-lg text-white/80 mb-6 leading-relaxed">
                    {primaryArchetype.description}
                  </p>

                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h3 className="text-accent-gold font-medium mb-3">Strengths</h3>
                      <ul className="space-y-2">
                        {primaryArchetype.strengths.map((strength, i) => (
                          <li key={i} className="text-white/70 text-sm flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-accent-gold rounded-full" />
                            {strength}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-accent-gold font-medium mb-3">Challenges</h3>
                      <ul className="space-y-2">
                        {primaryArchetype.challenges.map((challenge, i) => (
                          <li key={i} className="text-white/70 text-sm flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-white/30 rounded-full" />
                            {challenge}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="bg-white/5 p-4 rounded-lg">
                    <h3 className="text-accent-gold font-medium mb-2">Path to Growth</h3>
                    <p className="text-white/70 text-sm leading-relaxed">
                      {primaryArchetype.growth}
                    </p>
                  </div>

                  <p className="text-white/40 text-sm mt-4">
                    Famous examples: {primaryArchetype.famousExamples}
                  </p>
                </div>

                {/* Secondary Archetype */}
                <div className="bg-white/5 border border-white/10 p-6 backdrop-blur-sm">
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`p-3 rounded-full bg-gradient-to-br ${secondaryArchetype.color}`}>
                      <SecondaryIcon size={24} className="text-white" />
                    </div>
                    <div>
                      <h3 className="font-medium">Secondary Archetype: {secondaryArchetype.name}</h3>
                      <p className="text-white/40 text-sm">Your supporting energy</p>
                    </div>
                  </div>
                  <p className="text-white/60 text-sm">
                    {secondaryArchetype.description}
                  </p>
                </div>

                {/* Score Breakdown */}
                <div className="bg-white/5 border border-white/10 p-6 backdrop-blur-sm">
                  <h3 className="font-medium mb-4">Your Archetype Profile</h3>
                  <div className="space-y-3">
                    {results.sorted.map(([archetype, score]) => {
                      const arch = archetypes[archetype as keyof typeof archetypes]
                      const Icon = arch.icon
                      const percentage = (score / questions.length) * 100
                      return (
                        <div key={archetype} className="flex items-center gap-3">
                          <Icon size={16} className={arch.textColor} />
                          <span className="w-20 text-sm">{arch.name}</span>
                          <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                            <motion.div
                              className={`h-full bg-gradient-to-r ${arch.color}`}
                              initial={{ width: 0 }}
                              animate={{ width: `${percentage}%` }}
                              transition={{ duration: 0.5, delay: 0.2 }}
                            />
                          </div>
                          <span className="text-sm text-white/40 w-12 text-right">
                            {Math.round(percentage)}%
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-4 justify-center">
                  <motion.button
                    onClick={resetQuiz}
                    className="px-6 py-3 border border-white/20 hover:border-white/40 transition-colors flex items-center gap-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <RotateCcw size={18} />
                    Retake Quiz
                  </motion.button>

                  <motion.button
                    onClick={() => shareResults('twitter')}
                    className="px-6 py-3 bg-[#1DA1F2] hover:bg-[#1a8cd8] transition-colors flex items-center gap-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Twitter size={18} />
                    Share on Twitter
                  </motion.button>

                  <motion.button
                    onClick={() => shareResults('facebook')}
                    className="px-6 py-3 bg-[#4267B2] hover:bg-[#365899] transition-colors flex items-center gap-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Facebook size={18} />
                    Share on Facebook
                  </motion.button>
                </div>

                {/* Related Content */}
                <div className="text-center pt-8 border-t border-white/10">
                  <h3 className="text-lg font-medium mb-4">Explore More</h3>
                  <div className="flex flex-wrap gap-4 justify-center">
                    <Link
                      href="/meditations"
                      className="px-6 py-3 bg-accent-gold text-black hover:bg-accent-hover transition-colors"
                    >
                      Guided Meditations
                    </Link>
                    <Link
                      href="/writing/essays"
                      className="px-6 py-3 border border-white/20 hover:border-accent-gold transition-colors"
                    >
                      Philosophy Essays
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </>
  )
}
