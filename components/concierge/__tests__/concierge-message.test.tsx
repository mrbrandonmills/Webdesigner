import { render, screen, fireEvent } from '@testing-library/react';
import { ConciergeMessageComponent } from '../concierge-message';
import { ConciergeMessage } from '../types';
import './setup';

describe('ConciergeMessageComponent', () => {
  const mockOnPlayAudio = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders user message correctly', () => {
    const message: ConciergeMessage = {
      id: '1',
      role: 'user',
      content: 'Hello, I need help',
      timestamp: new Date(),
      type: 'text',
    };

    render(<ConciergeMessageComponent message={message} />);

    expect(screen.getByText('Hello, I need help')).toBeInTheDocument();
    expect(screen.getByText(/you/i)).toBeInTheDocument();
  });

  it('renders assistant message correctly', () => {
    const message: ConciergeMessage = {
      id: '2',
      role: 'assistant',
      content: 'How may I assist you?',
      timestamp: new Date(),
      type: 'text',
    };

    render(<ConciergeMessageComponent message={message} />);

    expect(screen.getByText('How may I assist you?')).toBeInTheDocument();
    expect(screen.getByText(/concierge/i)).toBeInTheDocument();
  });

  it('displays timestamp', () => {
    const message: ConciergeMessage = {
      id: '3',
      role: 'user',
      content: 'Test message',
      timestamp: new Date(),
      type: 'text',
    };

    render(<ConciergeMessageComponent message={message} />);

    // Check for any timestamp format (the mock returns different values)
    const timestamps = screen.getAllByText(/\d+:\d+/);
    expect(timestamps.length).toBeGreaterThan(0);
  });

  it('shows audio playback button for assistant messages with audio', () => {
    const message: ConciergeMessage = {
      id: '4',
      role: 'assistant',
      content: 'This message has audio',
      timestamp: new Date(),
      type: 'text',
      audioUrl: '/audio/test.mp3',
    };

    render(<ConciergeMessageComponent message={message} onPlayAudio={mockOnPlayAudio} />);

    const playButton = screen.getByLabelText(/play audio response/i);
    expect(playButton).toBeInTheDocument();
  });

  it('calls onPlayAudio when audio button is clicked', () => {
    const message: ConciergeMessage = {
      id: '5',
      role: 'assistant',
      content: 'Test audio message',
      timestamp: new Date(),
      type: 'text',
      audioUrl: '/audio/test.mp3',
    };

    render(<ConciergeMessageComponent message={message} onPlayAudio={mockOnPlayAudio} />);

    const playButton = screen.getByLabelText(/play audio response/i);
    fireEvent.click(playButton);

    expect(mockOnPlayAudio).toHaveBeenCalledWith('/audio/test.mp3');
  });

  it('shows playing state when audio is playing', () => {
    const message: ConciergeMessage = {
      id: '6',
      role: 'assistant',
      content: 'Playing audio',
      timestamp: new Date(),
      type: 'text',
      audioUrl: '/audio/test.mp3',
    };

    render(
      <ConciergeMessageComponent
        message={message}
        onPlayAudio={mockOnPlayAudio}
        isPlaying={true}
      />
    );

    expect(screen.getByText(/playing\.\.\./i)).toBeInTheDocument();
  });

  it('renders art preview when metadata includes artPreview', () => {
    const message: ConciergeMessage = {
      id: '7',
      role: 'assistant',
      content: 'Here is your custom art',
      timestamp: new Date(),
      type: 'art',
      metadata: {
        artPreview: 'https://example.com/art.jpg',
      },
    };

    render(<ConciergeMessageComponent message={message} />);

    const artImage = screen.getByAltText(/generated art preview/i);
    expect(artImage).toBeInTheDocument();
    expect(artImage).toHaveAttribute('src', 'https://example.com/art.jpg');
  });

  it('renders booking data when metadata includes bookingData', () => {
    const message: ConciergeMessage = {
      id: '8',
      role: 'assistant',
      content: 'Here are your session details',
      timestamp: new Date(),
      type: 'booking',
      metadata: {
        bookingData: {
          sessionType: 'coaching',
          duration: 60,
          topics: ['Brand Development'],
          price: 297,
        },
      },
    };

    render(<ConciergeMessageComponent message={message} />);

    // Use getAllByText for multiple matches
    const sessionDetails = screen.getAllByText(/session details/i);
    expect(sessionDetails.length).toBeGreaterThan(0);
    expect(screen.getByText(/coaching/i)).toBeInTheDocument();
    expect(screen.getByText(/60 minutes/i)).toBeInTheDocument();
    expect(screen.getByText(/\$297/i)).toBeInTheDocument();
  });

  it('renders styling recommendations when metadata includes them', () => {
    const message: ConciergeMessage = {
      id: '9',
      role: 'assistant',
      content: 'Here are my recommendations',
      timestamp: new Date(),
      type: 'styling',
      metadata: {
        stylingRecommendations: [
          {
            id: '1',
            name: 'Luxury Blazer',
            category: 'Outerwear',
            imageUrl: 'https://example.com/blazer.jpg',
            price: 1200,
            matchScore: 0.95,
          },
          {
            id: '2',
            name: 'Designer Shirt',
            category: 'Tops',
            imageUrl: 'https://example.com/shirt.jpg',
            price: 450,
            matchScore: 0.88,
          },
        ],
      },
    };

    render(<ConciergeMessageComponent message={message} />);

    expect(screen.getByText('Luxury Blazer')).toBeInTheDocument();
    expect(screen.getByText('$1200')).toBeInTheDocument();
    expect(screen.getByText('95%')).toBeInTheDocument();
    expect(screen.getByText('Designer Shirt')).toBeInTheDocument();
    expect(screen.getByText('$450')).toBeInTheDocument();
    expect(screen.getByText('88%')).toBeInTheDocument();
  });

  it('limits styling recommendations to 4 items', () => {
    const recommendations = Array.from({ length: 10 }, (_, i) => ({
      id: `${i}`,
      name: `Item ${i}`,
      category: 'Test',
      imageUrl: 'https://example.com/test.jpg',
      price: 100,
      matchScore: 0.9,
    }));

    const message: ConciergeMessage = {
      id: '10',
      role: 'assistant',
      content: 'Many recommendations',
      timestamp: new Date(),
      type: 'styling',
      metadata: {
        stylingRecommendations: recommendations,
      },
    };

    const { container } = render(<ConciergeMessageComponent message={message} />);

    // Should only show 4 items (grid has max 4 items)
    const items = container.querySelectorAll('.grid.grid-cols-2.gap-2 > div');
    expect(items.length).toBe(4);
  });

  it('does not show audio button for user messages', () => {
    const message: ConciergeMessage = {
      id: '11',
      role: 'user',
      content: 'User message',
      timestamp: new Date(),
      type: 'text',
      audioUrl: '/audio/test.mp3', // Even with audio URL
    };

    render(<ConciergeMessageComponent message={message} />);

    expect(screen.queryByLabelText(/play audio/i)).not.toBeInTheDocument();
  });

  it('applies correct styling for user vs assistant messages', () => {
    const userMessage: ConciergeMessage = {
      id: '12',
      role: 'user',
      content: 'User',
      timestamp: new Date(),
      type: 'text',
    };

    const assistantMessage: ConciergeMessage = {
      id: '13',
      role: 'assistant',
      content: 'Assistant',
      timestamp: new Date(),
      type: 'text',
    };

    const { rerender, container } = render(
      <ConciergeMessageComponent message={userMessage} />
    );

    // User message should justify-end
    let messageContainer = container.querySelector('.flex');
    expect(messageContainer).toHaveClass('justify-end');

    rerender(<ConciergeMessageComponent message={assistantMessage} />);

    // Assistant message should justify-start
    messageContainer = container.querySelector('.flex');
    expect(messageContainer).toHaveClass('justify-start');
  });
});
