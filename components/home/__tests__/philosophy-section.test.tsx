import { render, screen } from '@testing-library/react'
import PhilosophySection from '../philosophy-section'

describe('PhilosophySection', () => {
  it('displays quote about renaissance philosophy', () => {
    render(<PhilosophySection />)
    expect(screen.getByText(/Renaissance/i)).toBeInTheDocument()
  })
})
