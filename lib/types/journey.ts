/**
 * Brandon Mills Life Journey - Type Definitions
 * Museum-quality 3D navigation system
 */

export type StopType = 'FINAL' | 'TRANSFER'

export interface SubLine {
  id: string
  name: string
  stops?: number
}

export interface JourneyStop {
  id: string
  name: string
  type: StopType
  position: {
    x?: number
    y?: number
    z: number
  }
  marker: string
  waypoint: string
  subLines?: SubLine[]
  color: string
  description?: string
  href: string
}

export interface MarkerProps {
  position: [number, number, number]
  onHover?: (hovered: boolean) => void
  onClick?: () => void
  isActive?: boolean
  isHovered?: boolean
  color?: string
}

export interface WaypointProps {
  active: boolean
  intensity?: number
  color?: string
}

export interface ParticleSystemProps {
  count?: number
  color?: string
  radius?: number
  behavior?: 'float' | 'consciousness' | 'orbit' | 'swarm'
  intensity?: number
}

// Journey configuration
export const JOURNEY_STOPS: JourneyStop[] = [
  {
    id: 'work',
    name: 'WORK',
    type: 'FINAL',
    position: { z: -5000 },
    marker: 'Camera3D',
    waypoint: 'ParticleTunnel',
    color: '#D4AF37', // Gold
    description: 'Photography & Visual Work',
    href: '/work'
  },
  {
    id: 'gallery',
    name: 'GALLERY',
    type: 'FINAL',
    position: { z: -12000 },
    marker: 'PictureFrame3D',
    waypoint: 'ColorMorphField',
    color: '#F5F5DC', // Cream
    description: 'Art & Exhibitions',
    href: '/gallery'
  },
  {
    id: 'blog',
    name: 'BLOG',
    type: 'TRANSFER',
    position: { z: -18000 },
    marker: 'Book3D',
    waypoint: 'GeometricShapes',
    color: '#9CA986', // Sage Green
    description: 'Essays & Thoughts',
    href: '/blog',
    subLines: [
      { id: 'cancer', name: 'Cancer Journey', stops: 5 },
      { id: 'philosophy', name: 'Philosophy Essays', stops: 10 },
      { id: 'deepwork', name: 'Deep Work', stops: 3 }
    ]
  },
  {
    id: 'meditation',
    name: 'MEDITATION',
    type: 'FINAL',
    position: { z: -26000 },
    marker: 'Lotus3D',
    waypoint: 'LiquidMetal',
    color: '#9B59B6', // Purple
    description: 'Mindfulness & Practice',
    href: '/meditations'
  },
  {
    id: 'shop',
    name: 'SHOP',
    type: 'TRANSFER',
    position: { z: -33000 },
    marker: 'ShoppingBag3D',
    waypoint: 'ParticleSwarm',
    color: '#E74C3C', // Red
    description: 'Products & Services',
    href: '/shop',
    subLines: [
      { id: 'amazon', name: 'Books & Philosophy' },
      { id: 'software', name: 'Software Tools' }
    ]
  },
  {
    id: 'mind-tools',
    name: 'MIND TOOLS',
    type: 'TRANSFER',
    position: { z: -40000 },
    marker: 'Brain3D',
    waypoint: 'HolographicField',
    color: '#3B82F6', // Blue
    description: 'Interactive Experiences',
    href: '/mind-tools',
    subLines: [
      { id: 'visualizer', name: 'Mind Visualizer' },
      { id: 'decoder', name: 'Dream Decoder' },
      { id: 'oracle', name: 'Life Path Oracle' },
      { id: 'quiz', name: 'Warrior Archetype Quiz' }
    ]
  },
  {
    id: 'about',
    name: 'ABOUT',
    type: 'FINAL',
    position: { z: -46000 },
    marker: 'Profile3D',
    waypoint: 'GoldenTunnel',
    color: '#FFB347', // Amber
    description: 'My Story',
    href: '/about'
  },
  {
    id: 'contact',
    name: 'CONTACT',
    type: 'FINAL',
    position: { z: -51000 },
    marker: 'Envelope3D',
    waypoint: 'MessageBeam',
    color: '#2ECC71', // Green
    description: 'Get In Touch',
    href: '/contact'
  }
]

// Camera travel speeds (units per second)
export const CAMERA_SPEED = 1000 // 1000 units = 1 second

// Animation settings
export const ANIMATION_CONFIG = {
  fast: 200,
  normal: 400,
  slow: 800,
  easing: [0.22, 1, 0.36, 1] as const,
  spring: {
    stiffness: 150,
    damping: 20
  }
}

// Performance settings
export const PERFORMANCE_CONFIG = {
  targetFPS: 60,
  particleLOD: {
    high: 10000,
    medium: 5000,
    low: 2000
  },
  enableShadows: true,
  enablePostProcessing: true
}
