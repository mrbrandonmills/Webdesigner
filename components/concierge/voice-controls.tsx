'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { VoiceState } from './types';

interface VoiceControlsProps {
  voiceState: VoiceState;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onToggleMute?: () => void;
  disabled?: boolean;
}

export function VoiceControls({
  voiceState,
  onStartRecording,
  onStopRecording,
  onToggleMute,
  disabled = false
}: VoiceControlsProps) {
  const [isMuted, setIsMuted] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  const handleToggleMute = () => {
    setIsMuted(!isMuted);
    onToggleMute?.();
  };

  const handleMicClick = () => {
    if (voiceState.isRecording) {
      onStopRecording();
    } else {
      onStartRecording();
    }
  };

  // Animated waveform bars
  const WaveformBar = ({ delay = 0 }: { delay?: number }) => (
    <motion.div
      className="w-1 bg-accent-gold rounded-full"
      initial={{ height: 4 }}
      animate={{
        height: voiceState.isRecording || voiceState.isSpeaking
          ? [4, 20, 8, 24, 12, 16, 4]
          : 4
      }}
      transition={{
        duration: 1.2,
        repeat: Infinity,
        ease: "easeInOut",
        delay
      }}
    />
  );

  return (
    <div className="space-y-4">
      {/* Main Microphone Button */}
      <div className="flex items-center justify-center gap-4">
        {/* Waveform Visualization */}
        <AnimatePresence>
          {(voiceState.isRecording || voiceState.isSpeaking) && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center gap-1 h-8"
            >
              <WaveformBar delay={0} />
              <WaveformBar delay={0.1} />
              <WaveformBar delay={0.2} />
              <WaveformBar delay={0.3} />
              <WaveformBar delay={0.4} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Microphone Button */}
        <motion.button
          whileHover={{ scale: disabled ? 1 : 1.05 }}
          whileTap={{ scale: disabled ? 1 : 0.95 }}
          onClick={handleMicClick}
          disabled={disabled}
          className={`relative w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
            disabled
              ? 'bg-zinc-800 cursor-not-allowed opacity-50'
              : voiceState.isRecording
              ? 'bg-red-600 shadow-lg shadow-red-600/50 animate-pulse'
              : 'bg-gradient-to-br from-accent-gold to-accent-hover shadow-lg shadow-accent-gold/30 hover:shadow-accent-gold/50'
          }`}
          aria-label={voiceState.isRecording ? 'Stop recording' : 'Start recording'}
        >
          {/* Pulse ring animation when recording */}
          {voiceState.isRecording && (
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-red-600"
              initial={{ scale: 1, opacity: 1 }}
              animate={{ scale: 1.5, opacity: 0 }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          )}

          {voiceState.isRecording ? (
            <MicOff className="w-7 h-7 text-white" />
          ) : (
            <Mic className="w-7 h-7 text-black" />
          )}
        </motion.button>

        {/* Waveform Visualization (right side) */}
        <AnimatePresence>
          {(voiceState.isRecording || voiceState.isSpeaking) && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center gap-1 h-8"
            >
              <WaveformBar delay={0.5} />
              <WaveformBar delay={0.4} />
              <WaveformBar delay={0.3} />
              <WaveformBar delay={0.2} />
              <WaveformBar delay={0.1} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Volume Meter */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-zinc-400">
          <span className="uppercase tracking-wider">Volume</span>
          <span className="text-accent-gold">{Math.round(voiceState.volume * 100)}%</span>
        </div>

        <div className="relative h-2 bg-black/40 rounded-full overflow-hidden border border-accent-gold/20">
          <motion.div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-accent-gold to-accent-hover rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${voiceState.volume * 100}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex items-center justify-center gap-3">
        {/* Mute Toggle */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleToggleMute}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/40 border border-accent-gold/20 hover:border-accent-gold/40 transition-all duration-300"
          aria-label={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? (
            <VolumeX className="w-4 h-4 text-zinc-400" />
          ) : (
            <Volume2 className="w-4 h-4 text-accent-gold" />
          )}
          <span className="text-xs text-white/80 uppercase tracking-wide">
            {isMuted ? 'Muted' : 'Audio'}
          </span>
        </motion.button>

        {/* Status Indicator */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/40 border border-accent-gold/20">
          <motion.div
            className={`w-2 h-2 rounded-full ${
              voiceState.isRecording
                ? 'bg-red-500'
                : voiceState.isSpeaking
                ? 'bg-accent-gold'
                : 'bg-zinc-600'
            }`}
            animate={{
              scale: voiceState.isRecording || voiceState.isSpeaking ? [1, 1.3, 1] : 1
            }}
            transition={{ duration: 1, repeat: Infinity }}
          />
          <span className="text-xs text-white/80 uppercase tracking-wide">
            {voiceState.isRecording
              ? 'Recording'
              : voiceState.isSpeaking
              ? 'Speaking'
              : 'Ready'}
          </span>
        </div>
      </div>

      {/* Instructions */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-center text-xs text-zinc-500 font-light"
      >
        {voiceState.isRecording
          ? 'Listening... Click to stop'
          : 'Click microphone to speak with your concierge'}
      </motion.p>
    </div>
  );
}
