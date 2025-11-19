'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Brain, RotateCcw, Trophy, Share2, Twitter, Grid3X3, Zap, Target } from 'lucide-react'
import Navigation from '@/components/navigation'

type GameState = 'start' | 'showing' | 'input' | 'success' | 'fail' | 'results'

export default function MemoryChallenge() {
  const [gameState, setGameState] = useState<GameState>('start')
  const [sequence, setSequence] = useState<number[]>([])
  const [userInput, setUserInput] = useState<number[]>([])
  const [currentShowIndex, setCurrentShowIndex] = useState(0)
  const [level, setLevel] = useState(1)
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [activeCell, setActiveCell] = useState<number | null>(null)

  const gridSize = 9 // 3x3 grid

  const generateSequence = useCallback((length: number) => {
    const newSequence: number[] = []
    for (let i = 0; i < length; i++) {
      newSequence.push(Math.floor(Math.random() * gridSize))
    }
    return newSequence
  }, [])

  const startGame = useCallback(() => {
    const newSequence = generateSequence(level + 2) // Start with 3 items
    setSequence(newSequence)
    setUserInput([])
    setCurrentShowIndex(0)
    setGameState('showing')
  }, [generateSequence, level])

  const handleCellClick = (index: number) => {
    if (gameState !== 'input') return

    setActiveCell(index)
    setTimeout(() => setActiveCell(null), 150)

    const newInput = [...userInput, index]
    setUserInput(newInput)

    // Check if correct so far
    if (newInput[newInput.length - 1] !== sequence[newInput.length - 1]) {
      // Wrong!
      setGameState('fail')
      if (score > highScore) {
        setHighScore(score)
      }
      return
    }

    // Check if complete
    if (newInput.length === sequence.length) {
      const newScore = score + level * 10
      setScore(newScore)
      setGameState('success')

      // Auto advance after short delay
      setTimeout(() => {
        setLevel(prev => prev + 1)
        startGame()
      }, 1000)
    }
  }

  const reset = () => {
    setLevel(1)
    setScore(0)
    setSequence([])
    setUserInput([])
    setGameState('start')
  }

  const showResults = () => {
    setGameState('results')
  }

  // Show sequence animation
  useEffect(() => {
    if (gameState !== 'showing') return

    if (currentShowIndex < sequence.length) {
      const timer = setTimeout(() => {
        setActiveCell(sequence[currentShowIndex])
        setTimeout(() => {
          setActiveCell(null)
          setCurrentShowIndex(prev => prev + 1)
        }, 400)
      }, 600)

      return () => clearTimeout(timer)
    } else {
      // Done showing, ready for input
      setGameState('input')
    }
  }, [gameState, currentShowIndex, sequence])

  // Reset showing index when sequence changes
  useEffect(() => {
    setCurrentShowIndex(0)
  }, [sequence])

  const getPerformanceRating = (lvl: number) => {
    if (lvl >= 10) return { label: 'Exceptional', color: 'text-accent-gold', desc: 'Elite memory - top 1%' }
    if (lvl >= 7) return { label: 'Excellent', color: 'text-green-400', desc: 'Superior working memory' }
    if (lvl >= 5) return { label: 'Great', color: 'text-blue-400', desc: 'Above average capacity' }
    if (lvl >= 3) return { label: 'Good', color: 'text-purple-400', desc: 'Normal memory span' }
    return { label: 'Keep Practicing', color: 'text-white/60', desc: 'Memory improves with practice' }
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <Navigation />

      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="px-4 py-2 bg-accent-gold/20 border border-accent-gold/40 text-accent-gold text-sm tracking-wider uppercase flex items-center gap-2">
                <Brain size={14} />
                Cognitive Assessment
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-serif mb-4">
              Memory <span className="text-accent-gold">Challenge</span>
            </h1>
            <p className="text-white/60 max-w-xl mx-auto">
              Test your working memory capacity. Watch the sequence, then repeat it back in order.
            </p>
          </motion.div>

          {/* Stats Bar */}
          <div className="mb-8 grid grid-cols-3 gap-4">
            <div className="bg-white/5 border border-white/10 p-4 text-center">
              <p className="text-sm text-white/40 uppercase tracking-wider mb-1">Level</p>
              <p className="text-2xl font-light text-accent-gold">{level}</p>
            </div>
            <div className="bg-white/5 border border-white/10 p-4 text-center">
              <p className="text-sm text-white/40 uppercase tracking-wider mb-1">Score</p>
              <p className="text-2xl font-light">{score}</p>
            </div>
            <div className="bg-white/5 border border-white/10 p-4 text-center">
              <p className="text-sm text-white/40 uppercase tracking-wider mb-1">High Score</p>
              <p className="text-2xl font-light">{highScore}</p>
            </div>
          </div>

          {/* Game Grid */}
          <div className="relative">
            {gameState === 'start' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 flex items-center justify-center bg-black/80 z-10"
              >
                <div className="text-center">
                  <Grid3X3 className="mx-auto mb-4 text-accent-gold" size={48} />
                  <p className="text-xl mb-6">Watch the pattern, then repeat it</p>
                  <button
                    onClick={startGame}
                    className="px-8 py-4 bg-accent-gold text-black font-medium tracking-wider uppercase hover:bg-accent-hover transition-colors"
                  >
                    Start Game
                  </button>
                </div>
              </motion.div>
            )}

            {gameState === 'success' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute inset-0 flex items-center justify-center bg-black/80 z-10"
              >
                <div className="text-center">
                  <Zap className="mx-auto mb-4 text-accent-gold" size={48} />
                  <p className="text-2xl text-accent-gold">Correct!</p>
                  <p className="text-white/60">+{level * 10} points</p>
                </div>
              </motion.div>
            )}

            {gameState === 'fail' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute inset-0 flex items-center justify-center bg-black/80 z-10"
              >
                <div className="text-center">
                  <p className="text-2xl text-red-400 mb-2">Game Over</p>
                  <p className="text-white/60 mb-6">You reached level {level}</p>
                  <div className="flex gap-3 justify-center">
                    <button
                      onClick={showResults}
                      className="px-6 py-3 bg-accent-gold text-black font-medium tracking-wider uppercase hover:bg-accent-hover transition-colors flex items-center gap-2"
                    >
                      <Trophy size={18} />
                      Results
                    </button>
                    <button
                      onClick={reset}
                      className="px-6 py-3 border border-white/20 hover:border-accent-gold/50 transition-colors flex items-center gap-2"
                    >
                      <RotateCcw size={18} />
                      Retry
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            <div className="grid grid-cols-3 gap-3 aspect-square max-w-md mx-auto">
              {Array.from({ length: gridSize }).map((_, i) => (
                <motion.button
                  key={i}
                  className={`aspect-square border-2 transition-all duration-150 ${
                    activeCell === i
                      ? 'bg-accent-gold border-accent-gold'
                      : gameState === 'input'
                      ? 'bg-white/5 border-white/20 hover:border-accent-gold/50 hover:bg-white/10 cursor-pointer'
                      : 'bg-white/5 border-white/10 cursor-default'
                  }`}
                  onClick={() => handleCellClick(i)}
                  whileTap={gameState === 'input' ? { scale: 0.95 } : {}}
                  disabled={gameState !== 'input'}
                />
              ))}
            </div>

            {/* Progress indicator during input */}
            {gameState === 'input' && (
              <div className="mt-4 text-center">
                <p className="text-sm text-white/40">
                  {userInput.length} / {sequence.length}
                </p>
              </div>
            )}

            {gameState === 'showing' && (
              <div className="mt-4 text-center">
                <p className="text-sm text-white/40">Watch carefully...</p>
              </div>
            )}
          </div>

          {/* Results Modal */}
          <AnimatePresence>
            {gameState === 'results' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-6"
                onClick={() => setGameState('start')}
              >
                <motion.div
                  initial={{ scale: 0.9, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.9, y: 20 }}
                  className="bg-black border border-accent-gold/30 p-8 max-w-md w-full"
                  onClick={e => e.stopPropagation()}
                >
                  <h2 className="text-3xl font-serif text-center mb-6">Your Results</h2>

                  <div className="text-center mb-6">
                    <p className="text-6xl font-light text-accent-gold mb-2">Level {level}</p>
                    <p className={`text-xl ${getPerformanceRating(level).color}`}>
                      {getPerformanceRating(level).label}
                    </p>
                    <p className="text-white/40 text-sm mt-1">
                      {getPerformanceRating(level).desc}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-white/5 p-3 text-center">
                      <p className="text-sm text-white/40">Score</p>
                      <p className="text-xl">{score}</p>
                    </div>
                    <div className="bg-white/5 p-3 text-center">
                      <p className="text-sm text-white/40">Items</p>
                      <p className="text-xl">{level + 2}</p>
                    </div>
                  </div>

                  {/* Share */}
                  <div className="flex gap-3">
                    <a
                      href={`https://twitter.com/intent/tweet?text=I%20reached%20level%20${level}%20(${getPerformanceRating(level).label})%20on%20the%20Memory%20Challenge!&url=https://brandonmills.com/games/memory-challenge`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 px-4 py-3 bg-accent-gold text-black text-center font-medium tracking-wider uppercase hover:bg-accent-hover transition-colors flex items-center justify-center gap-2"
                    >
                      <Twitter size={16} />
                      Share
                    </a>
                    <button
                      onClick={reset}
                      className="flex-1 px-4 py-3 border border-white/20 hover:border-accent-gold/50 transition-colors"
                    >
                      Play Again
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Info Section */}
          <div className="mt-16 grid md:grid-cols-3 gap-6">
            <div className="bg-white/5 border border-white/10 p-6">
              <Brain className="text-accent-gold mb-3" size={24} />
              <h3 className="text-lg font-serif mb-2">Working Memory</h3>
              <p className="text-sm text-white/60">
                This tests your working memory - the mental workspace where you temporarily hold and manipulate information.
              </p>
            </div>
            <div className="bg-white/5 border border-white/10 p-6">
              <Target className="text-accent-gold mb-3" size={24} />
              <h3 className="text-lg font-serif mb-2">Average Span</h3>
              <p className="text-sm text-white/60">
                Most adults can remember 7±2 items. Higher spans correlate with better problem-solving and learning ability.
              </p>
            </div>
            <div className="bg-white/5 border border-white/10 p-6">
              <Zap className="text-accent-gold mb-3" size={24} />
              <h3 className="text-lg font-serif mb-2">Improvement</h3>
              <p className="text-sm text-white/60">
                Regular practice can expand working memory. Sleep, exercise, and meditation also enhance memory capacity.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
