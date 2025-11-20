'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { clientLogger } from '@/lib/client-logger'

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  disabled?: boolean;
  className?: string;
}

// Type definitions for Web Speech API
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface SpeechRecognitionInstance extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognitionInstance;
    webkitSpeechRecognition: new () => SpeechRecognitionInstance;
  }
}

export function VoiceInput({ onTranscript, disabled = false, className = '' }: VoiceInputProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  // Check for browser support
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSupported(false);
    }
  }, []);

  // Initialize speech recognition
  const initializeRecognition = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return null;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript;
        }
      }

      if (finalTranscript) {
        onTranscript(finalTranscript);
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      clientLogger.error('Speech recognition error:', event.error);
      setError(event.error);
      setIsRecording(false);
    };

    recognition.onend = () => {
      // Restart if still supposed to be recording (for continuous mode)
      if (isRecording && recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch (e) {
          // Recognition might already be started
          clientLogger.info('Recognition restart skipped:', { data: e });
        }
      }
    };

    recognition.onstart = () => {
      setError(null);
    };

    return recognition;
  }, [onTranscript, isRecording]);

  // Toggle recording
  const toggleRecording = useCallback(() => {
    if (disabled) return;

    if (isRecording) {
      // Stop recording
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current = null;
      }
      setIsRecording(false);
    } else {
      // Start recording
      const recognition = initializeRecognition();
      if (recognition) {
        recognitionRef.current = recognition;
        try {
          recognition.start();
          setIsRecording(true);
        } catch (e) {
          clientLogger.error('Failed to start recognition:', e);
          setError('Failed to start voice input');
        }
      }
    }
  }, [disabled, isRecording, initializeRecognition]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current = null;
      }
    };
  }, []);

  // Update recognition restart behavior when isRecording changes
  useEffect(() => {
    if (recognitionRef.current) {
      recognitionRef.current.onend = () => {
        if (isRecording && recognitionRef.current) {
          try {
            recognitionRef.current.start();
          } catch (e) {
            clientLogger.info('Recognition restart skipped:', { data: e });
          }
        }
      };
    }
  }, [isRecording]);

  // Render fallback if not supported
  if (!isSupported) {
    return (
      <div className={`inline-flex items-center gap-2 ${className}`}>
        <button
          disabled
          className="relative flex h-12 w-12 items-center justify-center rounded-full bg-neutral-800 text-neutral-500 cursor-not-allowed"
          aria-label="Voice input not supported"
        >
          <MicOff className="h-5 w-5" />
        </button>
        <span className="text-xs text-neutral-500">
          Voice input not supported in this browser
        </span>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      <button
        onClick={toggleRecording}
        disabled={disabled}
        className={`
          relative flex h-12 w-12 items-center justify-center rounded-full
          transition-all duration-300 ease-out
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-neutral-900
          ${disabled
            ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
            : isRecording
              ? 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-lg shadow-red-600/30'
              : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700 hover:text-amber-400 focus:ring-amber-500'
          }
        `}
        aria-label={isRecording ? 'Stop recording' : 'Start voice input'}
        title={isRecording ? 'Recording... Click to stop' : 'Voice input'}
      >
        {/* Pulsing animation when recording */}
        {isRecording && !disabled && (
          <>
            <span className="absolute inset-0 rounded-full bg-red-600 animate-ping opacity-30" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75 animate-ping" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-red-500" />
            </span>
          </>
        )}

        {isRecording ? (
          <MicOff className="h-5 w-5 relative z-10" />
        ) : (
          <Mic className="h-5 w-5" />
        )}
      </button>

      {/* Status label */}
      <span
        className={`
          text-sm font-medium transition-colors duration-300
          ${isRecording
            ? 'text-red-400'
            : error
              ? 'text-red-500'
              : 'text-neutral-400'
          }
        `}
      >
        {error
          ? `Error: ${error}`
          : isRecording
            ? 'Recording...'
            : 'Voice input'
        }
      </span>
    </div>
  );
}

export default VoiceInput;
