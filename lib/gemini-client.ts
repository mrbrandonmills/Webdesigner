// /lib/gemini-client.ts
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!)

export const geminiModel = genAI.getGenerativeModel({
  model: 'gemini-2.5-pro-preview-05-06'
})

export const MIND_VISUALIZER_SYSTEM_PROMPT = `You are an expert cognitive scientist and data visualization artist. Analyze the provided text and generate a Three.js visualization that represents the user's thinking patterns as a neural network.

OUTPUT FORMAT:
Return ONLY valid JavaScript code for Three.js that creates:
1. Nodes representing key concepts (larger = more central to their thinking)
2. Edges connecting related concepts (thicker = stronger relationship)
3. Color coding by emotional undertone:
   - Gold (#C9A050) = Analytical/Logical
   - Blue (#4A90D9) = Emotional/Intuitive
   - Green (#50C9A0) = Growth/Learning
   - Purple (#9050C9) = Creative/Abstract
4. Animated particles flowing between connected concepts
5. Camera orbit controls for exploration

DESIGN PRINCIPLES:
- Museum-quality aesthetics (black background, gold accents)
- Cinematic easing (cubic-bezier 0.22, 1, 0.36, 1)
- Generous spacing between nodes
- Subtle ambient particle effects

The code should be self-contained and render in an iframe.`

export interface MindAnalysis {
  concepts: Array<{
    name: string
    importance: number // 1-10
    category: 'analytical' | 'emotional' | 'growth' | 'creative'
    x: number
    y: number
    z: number
  }>
  connections: Array<{
    from: string
    to: string
    strength: number // 1-10
  }>
  dominantArchetype: 'Warrior' | 'King' | 'Magician' | 'Lover'
  insights: string[]
  recommendedMeditation: string
}
