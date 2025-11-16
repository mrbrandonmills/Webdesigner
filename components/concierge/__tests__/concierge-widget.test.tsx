import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ConciergeWidget } from '../concierge-widget';
import './setup';

describe('ConciergeWidget', () => {
  it('renders floating button when closed', () => {
    render(<ConciergeWidget />);

    const button = screen.getByLabelText(/open ai concierge/i);
    expect(button).toBeInTheDocument();
  });

  it('opens concierge panel when button is clicked', async () => {
    render(<ConciergeWidget />);

    const openButton = screen.getByLabelText(/open ai concierge/i);
    fireEvent.click(openButton);

    await waitFor(() => {
      expect(screen.getByText(/ai concierge/i)).toBeInTheDocument();
    });
  });

  it('closes concierge panel when close button is clicked', async () => {
    render(<ConciergeWidget />);

    // Open panel
    const openButton = screen.getByLabelText(/open ai concierge/i);
    fireEvent.click(openButton);

    await waitFor(() => {
      expect(screen.getByText(/ai concierge/i)).toBeInTheDocument();
    });

    // Close panel
    const closeButton = screen.getByLabelText(/close concierge/i);
    fireEvent.click(closeButton);

    await waitFor(() => {
      expect(screen.queryByText(/your personal assistant/i)).not.toBeInTheDocument();
    });
  });

  it('displays VIP badge for VIP users', async () => {
    render(<ConciergeWidget />);

    const openButton = screen.getByLabelText(/open ai concierge/i);
    fireEvent.click(openButton);

    await waitFor(() => {
      expect(screen.getByText(/gold/i)).toBeInTheDocument();
    });
  });

  it('shows welcome message when opened', async () => {
    render(<ConciergeWidget />);

    const openButton = screen.getByLabelText(/open ai concierge/i);
    fireEvent.click(openButton);

    await waitFor(() => {
      expect(screen.getByText(/welcome back/i)).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  it('allows sending text messages', async () => {
    const user = userEvent.setup();
    render(<ConciergeWidget />);

    // Open panel
    const openButton = screen.getByLabelText(/open ai concierge/i);
    fireEvent.click(openButton);

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/ask your concierge/i)).toBeInTheDocument();
    });

    // Type and send message
    const input = screen.getByPlaceholderText(/ask your concierge/i);
    await user.type(input, 'Hello');

    const sendButton = screen.getByLabelText(/send message/i);
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(screen.getByText('Hello')).toBeInTheDocument();
    });
  });

  it('switches between chat, voice, and booking views', async () => {
    render(<ConciergeWidget />);

    const openButton = screen.getByLabelText(/open ai concierge/i);
    fireEvent.click(openButton);

    await waitFor(() => {
      expect(screen.getByText(/chat/i)).toBeInTheDocument();
    });

    // Switch to voice view
    const voiceTab = screen.getByRole('button', { name: /voice/i });
    fireEvent.click(voiceTab);

    await waitFor(() => {
      expect(screen.getByText(/click microphone to speak/i)).toBeInTheDocument();
    });

    // Switch to booking view
    const bookingTab = screen.getByRole('button', { name: /booking/i });
    fireEvent.click(bookingTab);

    await waitFor(() => {
      expect(screen.getByText(/à la carte session builder/i)).toBeInTheDocument();
    });
  });

  it('displays typing indicator while waiting for response', async () => {
    const user = userEvent.setup();
    render(<ConciergeWidget />);

    const openButton = screen.getByLabelText(/open ai concierge/i);
    fireEvent.click(openButton);

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/ask your concierge/i)).toBeInTheDocument();
    });

    const input = screen.getByPlaceholderText(/ask your concierge/i);
    await user.type(input, 'Test message');

    const sendButton = screen.getByLabelText(/send message/i);
    fireEvent.click(sendButton);

    // Typing indicator should appear briefly
    await waitFor(() => {
      const typingDots = document.querySelectorAll('.w-2.h-2.bg-accent-gold.rounded-full');
      expect(typingDots.length).toBeGreaterThan(0);
    });
  });

  it('handles keyboard enter to send message', async () => {
    const user = userEvent.setup();
    render(<ConciergeWidget />);

    const openButton = screen.getByLabelText(/open ai concierge/i);
    fireEvent.click(openButton);

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/ask your concierge/i)).toBeInTheDocument();
    });

    const input = screen.getByPlaceholderText(/ask your concierge/i);
    await user.type(input, 'Hello{Enter}');

    await waitFor(() => {
      expect(screen.getByText('Hello')).toBeInTheDocument();
    });
  });

  it('disables send button when input is empty', async () => {
    render(<ConciergeWidget />);

    const openButton = screen.getByLabelText(/open ai concierge/i);
    fireEvent.click(openButton);

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/ask your concierge/i)).toBeInTheDocument();
    });

    const sendButton = screen.getByLabelText(/send message/i);
    expect(sendButton).toBeDisabled();
  });

  it('triggers booking view when booking keyword is detected', async () => {
    const user = userEvent.setup();
    render(<ConciergeWidget />);

    const openButton = screen.getByLabelText(/open ai concierge/i);
    fireEvent.click(openButton);

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/ask your concierge/i)).toBeInTheDocument();
    });

    const input = screen.getByPlaceholderText(/ask your concierge/i);
    await user.type(input, 'I want to book a session');

    const sendButton = screen.getByLabelText(/send message/i);
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(screen.getByText(/à la carte session builder/i)).toBeInTheDocument();
    }, { timeout: 3000 });
  });
});
