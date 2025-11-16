import { render, screen, fireEvent } from '@testing-library/react';
import { VoiceControls } from '../voice-controls';
import { VoiceState } from '../types';
import './setup';

describe('VoiceControls', () => {
  const mockVoiceState: VoiceState = {
    isRecording: false,
    isPlaying: false,
    isSpeaking: false,
    volume: 0.7,
  };

  const mockStartRecording = jest.fn();
  const mockStopRecording = jest.fn();
  const mockToggleMute = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders microphone button', () => {
    render(
      <VoiceControls
        voiceState={mockVoiceState}
        onStartRecording={mockStartRecording}
        onStopRecording={mockStopRecording}
      />
    );

    expect(screen.getByLabelText(/start recording/i)).toBeInTheDocument();
  });

  it('calls onStartRecording when microphone is clicked while not recording', () => {
    render(
      <VoiceControls
        voiceState={mockVoiceState}
        onStartRecording={mockStartRecording}
        onStopRecording={mockStopRecording}
      />
    );

    const micButton = screen.getByLabelText(/start recording/i);
    fireEvent.click(micButton);

    expect(mockStartRecording).toHaveBeenCalledTimes(1);
  });

  it('calls onStopRecording when microphone is clicked while recording', () => {
    const recordingState: VoiceState = {
      ...mockVoiceState,
      isRecording: true,
    };

    render(
      <VoiceControls
        voiceState={recordingState}
        onStartRecording={mockStartRecording}
        onStopRecording={mockStopRecording}
      />
    );

    const micButton = screen.getByLabelText(/stop recording/i);
    fireEvent.click(micButton);

    expect(mockStopRecording).toHaveBeenCalledTimes(1);
  });

  it('displays correct recording status', () => {
    const { rerender } = render(
      <VoiceControls
        voiceState={mockVoiceState}
        onStartRecording={mockStartRecording}
        onStopRecording={mockStopRecording}
      />
    );

    expect(screen.getByText(/ready/i)).toBeInTheDocument();

    // Update to recording state
    const recordingState: VoiceState = {
      ...mockVoiceState,
      isRecording: true,
    };

    rerender(
      <VoiceControls
        voiceState={recordingState}
        onStartRecording={mockStartRecording}
        onStopRecording={mockStopRecording}
      />
    );

    expect(screen.getByText(/recording/i)).toBeInTheDocument();
  });

  it('displays volume meter with correct percentage', () => {
    render(
      <VoiceControls
        voiceState={mockVoiceState}
        onStartRecording={mockStartRecording}
        onStopRecording={mockStopRecording}
      />
    );

    expect(screen.getByText('70%')).toBeInTheDocument();
  });

  it('shows mute button', () => {
    render(
      <VoiceControls
        voiceState={mockVoiceState}
        onStartRecording={mockStartRecording}
        onStopRecording={mockStopRecording}
        onToggleMute={mockToggleMute}
      />
    );

    const muteButton = screen.getByLabelText(/mute/i);
    expect(muteButton).toBeInTheDocument();
  });

  it('calls onToggleMute when mute button is clicked', () => {
    render(
      <VoiceControls
        voiceState={mockVoiceState}
        onStartRecording={mockStartRecording}
        onStopRecording={mockStopRecording}
        onToggleMute={mockToggleMute}
      />
    );

    const muteButton = screen.getByLabelText(/mute/i);
    fireEvent.click(muteButton);

    expect(mockToggleMute).toHaveBeenCalledTimes(1);
  });

  it('disables microphone button when disabled prop is true', () => {
    render(
      <VoiceControls
        voiceState={mockVoiceState}
        onStartRecording={mockStartRecording}
        onStopRecording={mockStopRecording}
        disabled={true}
      />
    );

    const micButton = screen.getByLabelText(/start recording/i);
    expect(micButton).toBeDisabled();
  });

  it('displays speaking status when isSpeaking is true', () => {
    const speakingState: VoiceState = {
      ...mockVoiceState,
      isSpeaking: true,
    };

    render(
      <VoiceControls
        voiceState={speakingState}
        onStartRecording={mockStartRecording}
        onStopRecording={mockStopRecording}
      />
    );

    expect(screen.getByText(/speaking/i)).toBeInTheDocument();
  });

  it('displays instructions text', () => {
    render(
      <VoiceControls
        voiceState={mockVoiceState}
        onStartRecording={mockStartRecording}
        onStopRecording={mockStopRecording}
      />
    );

    expect(screen.getByText(/click microphone to speak/i)).toBeInTheDocument();
  });

  it('changes instructions when recording', () => {
    const recordingState: VoiceState = {
      ...mockVoiceState,
      isRecording: true,
    };

    render(
      <VoiceControls
        voiceState={recordingState}
        onStartRecording={mockStartRecording}
        onStopRecording={mockStopRecording}
      />
    );

    expect(screen.getByText(/listening\.\.\. click to stop/i)).toBeInTheDocument();
  });

  it('renders waveform visualization when recording', () => {
    const recordingState: VoiceState = {
      ...mockVoiceState,
      isRecording: true,
    };

    const { container } = render(
      <VoiceControls
        voiceState={recordingState}
        onStartRecording={mockStartRecording}
        onStopRecording={mockStopRecording}
      />
    );

    // Check for waveform bars
    const waveformBars = container.querySelectorAll('.w-1.bg-accent-gold.rounded-full');
    expect(waveformBars.length).toBeGreaterThan(0);
  });
});
