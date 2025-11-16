import { render, screen } from '@testing-library/react'
import FeaturedCollections from '../featured-collections'

describe('FeaturedCollections', () => {
  it('renders section title', () => {
    render(<FeaturedCollections />)
    expect(screen.getByText(/Featured Collections/i)).toBeInTheDocument()
  })

  it('displays collection cards', () => {
    render(<FeaturedCollections />)
    expect(screen.getByText(/Fine Art Photography/i)).toBeInTheDocument()
    expect(screen.getByText(/Published Works/i)).toBeInTheDocument()
    expect(screen.getByText(/AI Tools & Software/i)).toBeInTheDocument()
  })
})
