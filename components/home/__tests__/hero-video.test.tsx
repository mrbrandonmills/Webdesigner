import { render, screen } from '@testing-library/react'
import HeroVideo from '../hero-video'

describe('HeroVideo', () => {
  it('renders video background with overlay', () => {
    render(<HeroVideo />)

    const video = screen.getByTestId('hero-video') as HTMLVideoElement
    expect(video).toBeInTheDocument()
    expect(video.autoplay).toBe(true)
    expect(video.loop).toBe(true)
    expect(video.muted).toBe(true)
  })

  it('displays hero title and tagline', () => {
    render(<HeroVideo />)

    expect(screen.getByText(/Brandon Mills/i)).toBeInTheDocument()
    expect(screen.getByText(/Renaissance Man/i)).toBeInTheDocument()
  })
})
