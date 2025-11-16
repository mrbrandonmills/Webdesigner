import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BookingPreview } from '../booking-preview';
import { BookingData } from '../types';
import './setup';

describe('BookingPreview', () => {
  const mockOnBookingComplete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders session builder title', () => {
    render(<BookingPreview onBookingComplete={mockOnBookingComplete} />);

    expect(screen.getByText(/à la carte session builder/i)).toBeInTheDocument();
  });

  it('displays all session type options', () => {
    render(<BookingPreview onBookingComplete={mockOnBookingComplete} />);

    expect(screen.getByText(/personal coaching/i)).toBeInTheDocument();
    expect(screen.getByText(/strategy session/i)).toBeInTheDocument();
    expect(screen.getByText(/personal styling/i)).toBeInTheDocument();
    expect(screen.getByText(/custom experience/i)).toBeInTheDocument();
  });

  it('displays all duration options', () => {
    render(<BookingPreview onBookingComplete={mockOnBookingComplete} />);

    expect(screen.getByText('30m')).toBeInTheDocument();
    expect(screen.getByText('60m')).toBeInTheDocument();
    expect(screen.getByText('90m')).toBeInTheDocument();
    expect(screen.getByText('120m')).toBeInTheDocument();
  });

  it('allows selecting a session type', () => {
    render(<BookingPreview onBookingComplete={mockOnBookingComplete} />);

    const strategyButton = screen.getByText(/strategy session/i);
    fireEvent.click(strategyButton);

    // Button should have active styling (we can check the parent element)
    expect(strategyButton.closest('button')).toHaveClass('border-accent-gold');
  });

  it('allows selecting a duration', () => {
    render(<BookingPreview onBookingComplete={mockOnBookingComplete} />);

    const duration90 = screen.getByText('90m');
    fireEvent.click(duration90);

    expect(duration90).toHaveClass('border-accent-gold');
  });

  it('displays all topic options', () => {
    render(<BookingPreview onBookingComplete={mockOnBookingComplete} />);

    expect(screen.getByText(/brand development/i)).toBeInTheDocument();
    expect(screen.getByText(/personal style/i)).toBeInTheDocument();
    expect(screen.getByText(/creative direction/i)).toBeInTheDocument();
    expect(screen.getByText(/portfolio review/i)).toBeInTheDocument();
  });

  it('allows selecting and deselecting topics', () => {
    render(<BookingPreview onBookingComplete={mockOnBookingComplete} />);

    const brandTopic = screen.getByText(/brand development/i);

    // Select topic
    fireEvent.click(brandTopic);
    expect(screen.getByText(/focus areas \(1 selected\)/i)).toBeInTheDocument();

    // Deselect topic
    fireEvent.click(brandTopic);
    expect(screen.getByText(/focus areas \(0 selected\)/i)).toBeInTheDocument();
  });

  it('displays available time slots', () => {
    render(<BookingPreview onBookingComplete={mockOnBookingComplete} />);

    // Should display time slots - check for the time format instead
    const timeSlots = screen.getAllByText(/10:00 AM/i);
    expect(timeSlots.length).toBeGreaterThan(0);
  });

  it('allows selecting a time slot', () => {
    render(<BookingPreview onBookingComplete={mockOnBookingComplete} />);

    const timeSlots = screen.getAllByText(/10:00 am/i);
    const firstSlot = timeSlots[0].closest('button');

    if (firstSlot) {
      fireEvent.click(firstSlot);
      expect(firstSlot).toHaveClass('border-accent-gold');
    }
  });

  it('calculates price based on session type and duration', () => {
    render(<BookingPreview onBookingComplete={mockOnBookingComplete} />);

    // Default: 60min coaching = $297
    const priceElements = screen.getAllByText('$297');
    expect(priceElements.length).toBeGreaterThan(0);

    // Change to 90min
    const duration90 = screen.getByText('90m');
    fireEvent.click(duration90);

    // Price should update (90/60 * 297 = 445.5, rounded to 446)
    waitFor(() => {
      const updatedPrice = screen.getAllByText(/\$446/i);
      expect(updatedPrice.length).toBeGreaterThan(0);
    });
  });

  it('adds topic bonus to price calculation', () => {
    render(<BookingPreview onBookingComplete={mockOnBookingComplete} />);

    // Select a topic
    const brandTopic = screen.getByText(/brand development/i);
    fireEvent.click(brandTopic);

    // Price should increase by $50
    waitFor(() => {
      const updatedPrice = screen.getAllByText(/\$347/i);
      expect(updatedPrice.length).toBeGreaterThan(0);
    });
  });

  it('disables book button when no time slot selected', () => {
    render(<BookingPreview onBookingComplete={mockOnBookingComplete} />);

    const bookButton = screen.getByText(/select time slot & topics/i);
    expect(bookButton).toBeDisabled();
  });

  it('disables book button when no topics selected', () => {
    render(<BookingPreview onBookingComplete={mockOnBookingComplete} />);

    // Select a time slot
    const timeSlots = screen.getAllByText(/10:00 am/i);
    const firstSlot = timeSlots[0].closest('button');
    if (firstSlot) {
      fireEvent.click(firstSlot);
    }

    const bookButton = screen.getByText(/select time slot & topics/i);
    expect(bookButton).toBeDisabled();
  });

  it('enables book button when time slot and topics are selected', () => {
    render(<BookingPreview onBookingComplete={mockOnBookingComplete} />);

    // Select a topic
    const brandTopic = screen.getByText(/brand development/i);
    fireEvent.click(brandTopic);

    // Select a time slot
    const timeSlots = screen.getAllByText(/10:00 am/i);
    const firstSlot = timeSlots[0].closest('button');
    if (firstSlot) {
      fireEvent.click(firstSlot);
    }

    const bookButton = screen.getByRole('button', { name: /book now/i });
    expect(bookButton).not.toBeDisabled();
  });

  it('calls onBookingComplete with correct data', () => {
    render(<BookingPreview onBookingComplete={mockOnBookingComplete} />);

    // Select strategy session
    const strategyButton = screen.getByText(/strategy session/i);
    fireEvent.click(strategyButton);

    // Select 90min duration
    const duration90 = screen.getByText('90m');
    fireEvent.click(duration90);

    // Select a topic
    const brandTopic = screen.getByText(/brand development/i);
    fireEvent.click(brandTopic);

    // Select a time slot
    const timeSlots = screen.getAllByText(/10:00 am/i);
    const firstSlot = timeSlots[0].closest('button');
    if (firstSlot) {
      fireEvent.click(firstSlot);
    }

    // Click book button
    const bookButton = screen.getByRole('button', { name: /book now/i });
    fireEvent.click(bookButton);

    expect(mockOnBookingComplete).toHaveBeenCalledWith(
      expect.objectContaining({
        sessionType: 'strategy',
        duration: 90,
        topics: expect.arrayContaining(['Brand Development']),
      })
    );
  });

  it('displays security and cancellation information', () => {
    render(<BookingPreview onBookingComplete={mockOnBookingComplete} />);

    expect(screen.getByText(/secure payment/i)).toBeInTheDocument();
    expect(screen.getByText(/instant confirmation/i)).toBeInTheDocument();
    expect(screen.getByText(/24hr cancellation/i)).toBeInTheDocument();
  });

  it('shows price breakdown in calculator', () => {
    render(<BookingPreview onBookingComplete={mockOnBookingComplete} />);

    expect(screen.getByText(/session investment/i)).toBeInTheDocument();
    expect(screen.getByText(/total/i)).toBeInTheDocument();
  });

  it('initializes with provided initial data', () => {
    const initialData: Partial<BookingData> = {
      sessionType: 'styling',
      duration: 120,
      topics: ['Personal Style', 'Wardrobe Curation'],
    };

    render(
      <BookingPreview
        initialData={initialData}
        onBookingComplete={mockOnBookingComplete}
      />
    );

    expect(screen.getByText(/focus areas \(2 selected\)/i)).toBeInTheDocument();
  });
});
