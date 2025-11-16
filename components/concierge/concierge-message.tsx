'use client';

import { motion } from 'framer-motion';
import { Volume2, Image as ImageIcon, Calendar } from 'lucide-react';
import { ConciergeMessage } from './types';
import { format } from 'date-fns';

interface ConciergeMessageProps {
  message: ConciergeMessage;
  onPlayAudio?: (audioUrl: string) => void;
  isPlaying?: boolean;
}

export function ConciergeMessageComponent({
  message,
  onPlayAudio,
  isPlaying = false
}: ConciergeMessageProps) {
  const isAssistant = message.role === 'assistant';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      className={`flex ${isAssistant ? 'justify-start' : 'justify-end'} mb-6`}
    >
      <div
        className={`max-w-[80%] ${
          isAssistant
            ? 'bg-gradient-to-br from-zinc-900 to-zinc-800 border border-accent-gold/20'
            : 'bg-gradient-to-br from-accent-gold/10 to-accent-gold/5 border border-accent-gold/30'
        } rounded-2xl p-5 shadow-xl backdrop-blur-sm`}
      >
        {/* Message Header */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-serif tracking-wider text-accent-gold/80 uppercase">
            {isAssistant ? 'Concierge' : 'You'}
          </span>
          <span className="text-xs text-zinc-500">
            {format(new Date(message.timestamp), 'h:mm a')}
          </span>
        </div>

        {/* Message Content */}
        <p className="text-white/90 leading-relaxed font-light mb-3">
          {message.content}
        </p>

        {/* Art Preview */}
        {message.metadata?.artPreview && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-4 rounded-xl overflow-hidden border border-accent-gold/20"
          >
            <img
              src={message.metadata.artPreview}
              alt="Generated art preview"
              className="w-full h-48 object-cover"
            />
            <div className="bg-black/40 backdrop-blur-sm p-3 flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-accent-gold" />
              <span className="text-xs text-white/80">Custom Art Generation</span>
            </div>
          </motion.div>
        )}

        {/* Booking Preview */}
        {message.metadata?.bookingData && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-4 bg-black/40 backdrop-blur-sm rounded-xl p-4 border border-accent-gold/20"
          >
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-4 h-4 text-accent-gold" />
              <span className="text-xs text-accent-gold uppercase tracking-wider">
                Session Details
              </span>
            </div>
            <div className="space-y-2 text-sm text-white/80">
              <p>Type: <span className="text-accent-gold capitalize">
                {message.metadata.bookingData.sessionType}
              </span></p>
              <p>Duration: <span className="text-accent-gold">
                {message.metadata.bookingData.duration} minutes
              </span></p>
              <p>Investment: <span className="text-accent-gold">
                ${message.metadata.bookingData.price}
              </span></p>
            </div>
          </motion.div>
        )}

        {/* Styling Recommendations */}
        {message.metadata?.stylingRecommendations && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-4 grid grid-cols-2 gap-2"
          >
            {message.metadata.stylingRecommendations.slice(0, 4).map((item) => (
              <div
                key={item.id}
                className="bg-black/40 backdrop-blur-sm rounded-lg overflow-hidden border border-accent-gold/10 hover:border-accent-gold/30 transition-all duration-300 cursor-pointer group"
              >
                <div className="aspect-square relative overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-2 right-2 bg-accent-gold text-black text-xs px-2 py-1 rounded-full font-medium">
                    {Math.round(item.matchScore * 100)}%
                  </div>
                </div>
                <div className="p-2">
                  <p className="text-xs text-white/90 truncate">{item.name}</p>
                  <p className="text-xs text-accent-gold">${item.price}</p>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* Audio Playback */}
        {isAssistant && message.audioUrl && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onPlayAudio?.(message.audioUrl!)}
            className={`mt-3 flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
              isPlaying
                ? 'bg-accent-gold text-black'
                : 'bg-black/40 text-accent-gold border border-accent-gold/30 hover:bg-accent-gold/10'
            }`}
            aria-label={isPlaying ? 'Stop audio' : 'Play audio response'}
          >
            <Volume2 className={`w-4 h-4 ${isPlaying ? 'animate-pulse' : ''}`} />
            <span className="text-xs font-medium tracking-wide uppercase">
              {isPlaying ? 'Playing...' : 'Listen'}
            </span>
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}
