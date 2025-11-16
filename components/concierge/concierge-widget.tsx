'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Sparkles, Crown, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { ConciergeMessageComponent } from './concierge-message';
import { VoiceControls } from './voice-controls';
import { BookingPreview } from './booking-preview';
import { ConciergeMessage, VoiceState, VIPStatus, BookingData } from './types';

export function ConciergeWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ConciergeMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeView, setActiveView] = useState<'chat' | 'booking' | 'voice'>('chat');
  const [voiceState, setVoiceState] = useState<VoiceState>({
    isRecording: false,
    isPlaying: false,
    isSpeaking: false,
    volume: 0.7
  });
  const [vipStatus, setVipStatus] = useState<VIPStatus>({
    isVIP: true,
    tier: 'gold',
    totalSpent: 2500,
    visitCount: 12,
    lastVisit: new Date(),
    preferences: {
      style: ['Contemporary', 'Minimalist'],
      interests: ['Photography', 'Art Collection'],
      budget: 'Premium'
    }
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Welcome message on first open
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setTimeout(() => {
        addAssistantMessage(
          `Welcome back${vipStatus.isVIP ? ', valued client' : ''}! I'm your personal concierge. How may I assist you today? I can help you book a session with Brandon, recommend personalized styling, or create custom art.`,
          'system'
        );
      }, 500);
    }
  }, [isOpen]);

  const addAssistantMessage = (content: string, type: ConciergeMessage['type'] = 'text') => {
    const newMessage: ConciergeMessage = {
      id: Date.now().toString(),
      role: 'assistant',
      content,
      timestamp: new Date(),
      type,
      audioUrl: '/api/tts/placeholder' // Placeholder for ElevenLabs integration
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: ConciergeMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response (replace with actual API call)
    setTimeout(() => {
      setIsTyping(false);

      // Demo responses based on keywords
      if (inputValue.toLowerCase().includes('book') || inputValue.toLowerCase().includes('session')) {
        setActiveView('booking');
        addAssistantMessage(
          "Excellent! I'd be delighted to help you schedule a personalized session with Brandon. Let me show you our à la carte options.",
          'booking'
        );
      } else if (inputValue.toLowerCase().includes('style') || inputValue.toLowerCase().includes('clothing')) {
        addAssistantMessage(
          "Based on your sophisticated taste in contemporary and minimalist design, I have some exquisite recommendations for you.",
          'styling'
        );
        // Add message with styling recommendations
        setTimeout(() => {
          const stylingMessage: ConciergeMessage = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: "Here are pieces that align with your aesthetic:",
            timestamp: new Date(),
            type: 'styling',
            metadata: {
              stylingRecommendations: [
                {
                  id: '1',
                  name: 'Contemporary Cashmere Blazer',
                  category: 'Outerwear',
                  imageUrl: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400',
                  price: 1200,
                  matchScore: 0.95
                },
                {
                  id: '2',
                  name: 'Minimalist Silk Shirt',
                  category: 'Tops',
                  imageUrl: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400',
                  price: 450,
                  matchScore: 0.92
                },
                {
                  id: '3',
                  name: 'Tailored Wool Trousers',
                  category: 'Bottoms',
                  imageUrl: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400',
                  price: 680,
                  matchScore: 0.89
                },
                {
                  id: '4',
                  name: 'Luxury Leather Loafers',
                  category: 'Footwear',
                  imageUrl: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=400',
                  price: 850,
                  matchScore: 0.87
                }
              ]
            }
          };
          setMessages(prev => [...prev, stylingMessage]);
        }, 1000);
      } else if (inputValue.toLowerCase().includes('art')) {
        addAssistantMessage(
          "I can create a unique piece of art tailored to your personality and aesthetic preferences. What style resonates with you today?",
          'art'
        );
      } else {
        addAssistantMessage(
          "I understand. How else may I assist you today? I can help with booking sessions, personal styling recommendations, or creating custom art pieces.",
          'text'
        );
      }
    }, 1500);
  };

  const handleStartRecording = () => {
    setVoiceState(prev => ({ ...prev, isRecording: true }));
    // TODO: Implement Whisper API integration
  };

  const handleStopRecording = () => {
    setVoiceState(prev => ({ ...prev, isRecording: false }));
    // TODO: Process audio and send to Whisper API
  };

  const handlePlayAudio = (audioUrl: string) => {
    setVoiceState(prev => ({
      ...prev,
      isPlaying: !prev.isPlaying,
      currentAudioId: audioUrl
    }));
    // TODO: Implement ElevenLabs TTS playback
  };

  const handleBookingComplete = (bookingData: BookingData) => {
    addAssistantMessage(
      `Perfect! I've prepared your ${bookingData.duration}-minute ${bookingData.sessionType} session for $${bookingData.price}. You'll receive a confirmation email shortly.`,
      'booking'
    );
    setActiveView('chat');
  };

  const TypingIndicator = () => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="flex items-center gap-2 mb-4"
    >
      <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 border border-accent-gold/20 rounded-2xl px-5 py-3">
        <div className="flex items-center gap-2">
          <motion.div
            className="w-2 h-2 bg-accent-gold rounded-full"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0 }}
          />
          <motion.div
            className="w-2 h-2 bg-accent-gold rounded-full"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
          />
          <motion.div
            className="w-2 h-2 bg-accent-gold rounded-full"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
          />
        </div>
      </div>
    </motion.div>
  );

  return (
    <>
      {/* Floating Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-8 right-8 z-50 w-16 h-16 rounded-full bg-gradient-to-br from-accent-gold to-accent-hover shadow-2xl shadow-accent-gold/50 flex items-center justify-center transition-all duration-300 ${
          isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
        aria-label="Open AI Concierge"
      >
        <MessageCircle className="w-7 h-7 text-black" />
        {vipStatus.isVIP && (
          <motion.div
            className="absolute -top-1 -right-1 w-6 h-6 bg-black rounded-full flex items-center justify-center border-2 border-accent-gold"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Crown className="w-3 h-3 text-accent-gold" />
          </motion.div>
        )}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-accent-gold"
          animate={{ scale: [1, 1.2, 1], opacity: [1, 0, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.button>

      {/* Main Concierge Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            className="fixed bottom-8 right-8 z-50 w-full max-w-md h-[600px] bg-black/95 backdrop-blur-xl border border-accent-gold/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="bg-gradient-to-br from-zinc-900 to-black border-b border-accent-gold/20 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Sparkles className="w-6 h-6 text-accent-gold" />
                    <motion.div
                      className="absolute inset-0"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    >
                      <Sparkles className="w-6 h-6 text-accent-gold opacity-30" />
                    </motion.div>
                  </div>
                  <div>
                    <h2 className="text-lg font-serif text-white">AI Concierge</h2>
                    <p className="text-xs text-accent-gold/80">Your Personal Assistant</p>
                  </div>
                </div>

                {/* VIP Badge */}
                {vipStatus.isVIP && (
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-accent-gold/10 border border-accent-gold/30">
                    <Crown className="w-3 h-3 text-accent-gold" />
                    <span className="text-xs uppercase tracking-wider text-accent-gold font-medium">
                      {vipStatus.tier}
                    </span>
                  </div>
                )}

                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsOpen(false)}
                  className="text-zinc-400 hover:text-white transition-colors"
                  aria-label="Close concierge"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              {/* View Tabs */}
              <div className="flex gap-2 mt-4">
                {['chat', 'voice', 'booking'].map((view) => (
                  <motion.button
                    key={view}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveView(view as typeof activeView)}
                    className={`flex-1 px-4 py-2 rounded-lg text-xs uppercase tracking-wider transition-all duration-300 ${
                      activeView === view
                        ? 'bg-accent-gold text-black font-medium'
                        : 'bg-black/40 text-white/60 hover:text-white/80'
                    }`}
                  >
                    {view}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-hidden">
              <AnimatePresence mode="wait">
                {activeView === 'chat' && (
                  <motion.div
                    key="chat"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="h-full flex flex-col"
                  >
                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto px-6 py-4 custom-scrollbar">
                      {messages.map((message) => (
                        <ConciergeMessageComponent
                          key={message.id}
                          message={message}
                          onPlayAudio={handlePlayAudio}
                          isPlaying={voiceState.isPlaying && voiceState.currentAudioId === message.audioUrl}
                        />
                      ))}
                      {isTyping && <TypingIndicator />}
                      <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="border-t border-accent-gold/20 px-6 py-4 bg-gradient-to-br from-zinc-900 to-black">
                      <div className="flex items-center gap-3">
                        <input
                          ref={inputRef}
                          type="text"
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                          placeholder="Ask your concierge anything..."
                          className="flex-1 bg-black/40 border border-accent-gold/20 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-accent-gold/50 transition-all duration-300"
                        />
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleSendMessage}
                          disabled={!inputValue.trim()}
                          className={`p-3 rounded-lg transition-all duration-300 ${
                            inputValue.trim()
                              ? 'bg-accent-gold text-black hover:bg-accent-hover'
                              : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                          }`}
                          aria-label="Send message"
                        >
                          <Send className="w-5 h-5" />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeView === 'voice' && (
                  <motion.div
                    key="voice"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="h-full flex items-center justify-center px-6"
                  >
                    <VoiceControls
                      voiceState={voiceState}
                      onStartRecording={handleStartRecording}
                      onStopRecording={handleStopRecording}
                    />
                  </motion.div>
                )}

                {activeView === 'booking' && (
                  <motion.div
                    key="booking"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="h-full overflow-y-auto px-6 py-4 custom-scrollbar"
                  >
                    <BookingPreview onBookingComplete={handleBookingComplete} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom Scrollbar Styles */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(212, 175, 55, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(212, 175, 55, 0.5);
        }
      `}</style>
    </>
  );
}
