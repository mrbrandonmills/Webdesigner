'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, DollarSign, Plus, Minus, CheckCircle, Star, Zap, Gift } from 'lucide-react';
import { useState } from 'react';
import { BookingData, TimeSlot, MentoringPackage } from './types';
import { format, addDays, startOfWeek } from 'date-fns';

interface BookingPreviewProps {
  initialData?: Partial<BookingData>;
  onBookingComplete?: (bookingData: BookingData) => void;
}

const SESSION_TYPES = [
  { id: 'coaching', label: 'Personal Coaching', basePrice: 297, description: 'One-on-one guidance' },
  { id: 'strategy', label: 'Strategy Session', basePrice: 497, description: 'Business & career planning' },
  { id: 'styling', label: 'Personal Styling', basePrice: 397, description: 'Image & brand development' },
  { id: 'custom', label: 'Custom Experience', basePrice: 697, description: 'Tailored to your needs' }
] as const;

const PACKAGES: MentoringPackage[] = [
  {
    id: 'single',
    name: 'Single Session',
    sessions: 1,
    pricePerSession: 297,
    totalPrice: 297,
    savings: 0,
    features: ['60-minute session', 'Session recording', 'Email follow-up']
  },
  {
    id: 'starter',
    name: 'Starter 3-Pack',
    sessions: 3,
    pricePerSession: 267,
    totalPrice: 801,
    savings: 90,
    features: ['3 x 60-minute sessions', 'All recordings', 'Priority scheduling', 'Email support between sessions'],
    popular: true
  },
  {
    id: 'accelerator',
    name: 'Accelerator Monthly',
    sessions: 4,
    pricePerSession: 247,
    totalPrice: 988,
    savings: 200,
    features: ['4 sessions/month', 'Weekly check-ins', 'Unlimited email support', 'Resource library access', 'Goal tracking dashboard']
  }
];

const DURATIONS = [30, 60, 90, 120] as const;

const TOPICS = [
  'Brand Development',
  'Personal Style',
  'Creative Direction',
  'Portfolio Review',
  'Business Strategy',
  'Visual Storytelling',
  'Art Collection',
  'Wardrobe Curation'
];

export function BookingPreview({ initialData, onBookingComplete }: BookingPreviewProps) {
  const [viewMode, setViewMode] = useState<'packages' | 'custom'>('packages');
  const [selectedPackage, setSelectedPackage] = useState<string>('starter');
  const [sessionType, setSessionType] = useState<BookingData['sessionType']>(
    initialData?.sessionType || 'coaching'
  );
  const [duration, setDuration] = useState<BookingData['duration']>(
    initialData?.duration || 60
  );
  const [selectedTopics, setSelectedTopics] = useState<string[]>(
    initialData?.topics || []
  );
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [email, setEmail] = useState('');

  // Generate mock available time slots
  const generateTimeSlots = (): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    const startDate = startOfWeek(new Date());

    for (let day = 1; day < 6; day++) {
      const date = addDays(startDate, day);
      const times = ['10:00 AM', '1:00 PM', '3:00 PM', '5:00 PM'];

      times.forEach((time, index) => {
        slots.push({
          id: `${day}-${index}`,
          date,
          startTime: time,
          endTime: '', // Calculate based on duration
          available: Math.random() > 0.3 // 70% availability
        });
      });
    }

    return slots;
  };

  const [availableSlots] = useState<TimeSlot[]>(generateTimeSlots());

  const toggleTopic = (topic: string) => {
    setSelectedTopics(prev =>
      prev.includes(topic)
        ? prev.filter(t => t !== topic)
        : [...prev, topic]
    );
  };

  const calculatePrice = () => {
    const basePrice = SESSION_TYPES.find(t => t.id === sessionType)?.basePrice || 0;
    const durationMultiplier = duration / 60;
    const topicBonus = selectedTopics.length * 50;
    return Math.round(basePrice * durationMultiplier + topicBonus);
  };

  const handleBookNow = () => {
    if (!selectedSlot) return;

    const bookingData: BookingData = {
      sessionType,
      duration,
      topics: selectedTopics,
      price: calculatePrice(),
      selectedSlot
    };

    onBookingComplete?.(bookingData);
  };

  const price = calculatePrice();
  const currentPackage = PACKAGES.find(p => p.id === selectedPackage);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-serif text-accent-gold">
          Book Your Session
        </h3>
        <p className="text-sm text-zinc-400">
          Choose a package or customize your experience
        </p>
      </div>

      {/* View Mode Toggle */}
      <div className="flex gap-2 p-1 bg-black/40 rounded-lg">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setViewMode('packages')}
          className={`flex-1 py-2 rounded-md text-xs uppercase tracking-wider transition-all duration-300 ${
            viewMode === 'packages'
              ? 'bg-accent-gold text-black font-medium'
              : 'text-white/60 hover:text-white/80'
          }`}
        >
          Packages
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setViewMode('custom')}
          className={`flex-1 py-2 rounded-md text-xs uppercase tracking-wider transition-all duration-300 ${
            viewMode === 'custom'
              ? 'bg-accent-gold text-black font-medium'
              : 'text-white/60 hover:text-white/80'
          }`}
        >
          Custom
        </motion.button>
      </div>

      {viewMode === 'packages' ? (
        <>
          {/* Package Selection */}
          <div className="space-y-3">
            {PACKAGES.map((pkg) => (
              <motion.button
                key={pkg.id}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedPackage(pkg.id)}
                className={`w-full p-5 rounded-xl border-2 text-left transition-all duration-300 relative ${
                  selectedPackage === pkg.id
                    ? 'border-accent-gold bg-gradient-to-br from-accent-gold/20 to-accent-gold/10 shadow-lg shadow-accent-gold/20'
                    : 'border-accent-gold/20 bg-black/20 hover:border-accent-gold/40 hover:bg-black/30'
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-3 -right-3 bg-gradient-to-r from-accent-gold to-accent-hover text-black text-xs px-3 py-1.5 rounded-full font-bold flex items-center gap-1 shadow-lg shadow-accent-gold/40 animate-pulse">
                    <Star className="w-3 h-3 fill-black" />
                    MOST POPULAR
                  </div>
                )}
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="text-base font-serif font-medium text-white mb-1">{pkg.name}</h4>
                    <p className="text-xs text-zinc-400">{pkg.sessions} session{pkg.sessions > 1 ? 's' : ''}</p>
                    <p className="text-xs text-accent-gold/80 mt-1">
                      ${pkg.pricePerSession}/session
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-serif font-bold text-accent-gold">${pkg.totalPrice}</p>
                    {pkg.savings > 0 && (
                      <div className="mt-1 bg-green-500/20 border border-green-500/30 rounded-md px-2 py-1">
                        <p className="text-xs text-green-400 font-bold flex items-center gap-1 justify-end">
                          <Gift className="w-3 h-3" />
                          Save ${pkg.savings}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Value Proposition */}
                <div className="mb-3 p-2 bg-black/30 rounded-lg">
                  <p className="text-xs text-white/70 italic">
                    {pkg.id === 'single' && 'Try a single session to experience Brandon\'s expertise'}
                    {pkg.id === 'starter' && 'Build real momentum with 3 sessions over time'}
                    {pkg.id === 'accelerator' && 'Maximum transformation with monthly accountability'}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {pkg.features.slice(0, 2).map((feature, idx) => (
                    <span key={idx} className="text-xs text-zinc-400 bg-zinc-800/70 px-2 py-1 rounded border border-zinc-700">
                      ✓ {feature}
                    </span>
                  ))}
                  {pkg.features.length > 2 && (
                    <span className="text-xs text-accent-gold font-medium">+{pkg.features.length - 2} more benefits</span>
                  )}
                </div>

                {selectedPackage === pkg.id && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute top-2 left-2"
                  >
                    <CheckCircle className="w-5 h-5 text-accent-gold fill-accent-gold/20" />
                  </motion.div>
                )}
              </motion.button>
            ))}
          </div>

          {/* Selected Package Details */}
          {currentPackage && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-black/50 to-black/30 border border-accent-gold/30 rounded-xl p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-serif text-accent-gold">Package Details</p>
                <Zap className="w-4 h-4 text-accent-gold" />
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">Total Sessions:</span>
                  <span className="text-white font-medium">{currentPackage.sessions}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">Per Session:</span>
                  <span className="text-accent-gold font-medium">${currentPackage.pricePerSession}</span>
                </div>
                {currentPackage.savings > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-400">You Save:</span>
                    <span className="text-green-400 font-bold">${currentPackage.savings}</span>
                  </div>
                )}
              </div>

              <div className="h-px bg-accent-gold/20 mb-4" />

              <p className="text-xs uppercase tracking-wider text-accent-gold/80 mb-3">All Included Features</p>
              <ul className="space-y-2">
                {currentPackage.features.map((feature, idx) => (
                  <li key={idx} className="text-xs text-zinc-300 flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-accent-gold flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Value-Add Highlight */}
              {currentPackage.popular && (
                <div className="mt-4 p-3 bg-accent-gold/10 border border-accent-gold/30 rounded-lg">
                  <p className="text-xs text-accent-gold flex items-center gap-2">
                    <Star className="w-3 h-3 fill-accent-gold" />
                    <span className="font-medium">Best value for committed transformation</span>
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {/* Calendar Availability Hint */}
          <div className="bg-gradient-to-r from-accent-gold/5 to-transparent border border-accent-gold/20 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-accent-gold" />
              <div>
                <p className="text-sm text-white/90">Next Available</p>
                <p className="text-xs text-accent-gold">Tomorrow at 10:00 AM EST</p>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Session Type Selection (Custom Mode) */}
          <div className="space-y-3">
            <label className="text-xs uppercase tracking-wider text-accent-gold/80">
              Session Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              {SESSION_TYPES.map((type) => (
                <motion.button
                  key={type.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSessionType(type.id as BookingData['sessionType'])}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                    sessionType === type.id
                      ? 'border-accent-gold bg-accent-gold/10'
                      : 'border-accent-gold/20 bg-black/20 hover:border-accent-gold/40'
                  }`}
                >
                  <p className="text-sm font-medium text-white/90">{type.label}</p>
                  <p className="text-xs text-zinc-400">{type.description}</p>
                  <p className="text-xs text-accent-gold mt-1">From ${type.basePrice}</p>
                </motion.button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Duration Selection - Custom Mode Only */}
      {viewMode === 'custom' && (
        <div className="space-y-3">
          <label className="text-xs uppercase tracking-wider text-accent-gold/80 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Duration
          </label>
          <div className="flex gap-2">
            {DURATIONS.map((dur) => (
              <motion.button
                key={dur}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setDuration(dur)}
                className={`flex-1 py-3 rounded-lg border transition-all duration-300 ${
                  duration === dur
                    ? 'border-accent-gold bg-accent-gold text-black font-medium'
                    : 'border-accent-gold/20 bg-black/20 text-white/80 hover:border-accent-gold/40'
                }`}
              >
                {dur}m
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Topics Selection */}
      <div className="space-y-3">
        <label className="text-xs uppercase tracking-wider text-accent-gold/80">
          Focus Areas ({selectedTopics.length} selected)
        </label>
        <div className="grid grid-cols-2 gap-2">
          {TOPICS.map((topic) => {
            const isSelected = selectedTopics.includes(topic);
            return (
              <motion.button
                key={topic}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => toggleTopic(topic)}
                className={`px-3 py-2 rounded-lg border text-xs transition-all duration-300 flex items-center justify-between ${
                  isSelected
                    ? 'border-accent-gold bg-accent-gold/10 text-accent-gold'
                    : 'border-accent-gold/20 bg-black/20 text-white/70 hover:border-accent-gold/40'
                }`}
              >
                <span>{topic}</span>
                {isSelected ? (
                  <Minus className="w-3 h-3" />
                ) : (
                  <Plus className="w-3 h-3" />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Available Time Slots */}
      <div className="space-y-3">
        <label className="text-xs uppercase tracking-wider text-accent-gold/80 flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          Available Time Slots
        </label>
        <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto custom-scrollbar">
          {availableSlots.filter(slot => slot.available).slice(0, 8).map((slot) => {
            const isSelected = selectedSlot?.id === slot.id;
            return (
              <motion.button
                key={slot.id}
                whileHover={{ scale: slot.available ? 1.02 : 1 }}
                whileTap={{ scale: slot.available ? 0.98 : 1 }}
                onClick={() => slot.available && setSelectedSlot(slot)}
                disabled={!slot.available}
                className={`p-3 rounded-lg border text-left transition-all duration-300 ${
                  isSelected
                    ? 'border-accent-gold bg-accent-gold/10'
                    : slot.available
                    ? 'border-accent-gold/20 bg-black/20 hover:border-accent-gold/40'
                    : 'border-zinc-800 bg-zinc-900/50 opacity-50 cursor-not-allowed'
                }`}
              >
                <p className="text-xs text-white/90 font-medium">
                  {format(slot.date, 'EEE, MMM d')}
                </p>
                <p className="text-xs text-accent-gold mt-1">
                  {slot.startTime}
                </p>
                {isSelected && (
                  <CheckCircle className="w-3 h-3 text-accent-gold mt-1" />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Price Calculator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-gradient-to-br from-accent-gold/10 to-accent-gold/5 border border-accent-gold/30 rounded-xl p-5"
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-white/80">Session Investment</span>
          <DollarSign className="w-5 h-5 text-accent-gold" />
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-zinc-400">
            <span>Base ({duration}min {sessionType})</span>
            <span>${SESSION_TYPES.find(t => t.id === sessionType)?.basePrice}</span>
          </div>
          {selectedTopics.length > 0 && (
            <div className="flex justify-between text-zinc-400">
              <span>Focus areas ({selectedTopics.length})</span>
              <span>+${selectedTopics.length * 50}</span>
            </div>
          )}
          <div className="h-px bg-accent-gold/20 my-3" />
          <div className="flex justify-between text-2xl font-serif text-accent-gold">
            <span>Total</span>
            <span>${price}</span>
          </div>
        </div>
      </motion.div>

      {/* Email Input */}
      {!email && (
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-wider text-accent-gold/80 flex items-center gap-2">
            Email Address (required)
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="w-full bg-black/40 border border-accent-gold/20 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-accent-gold/50 transition-all duration-300 text-sm"
          />
          <p className="text-xs text-zinc-500">We'll send confirmation and session details here</p>
        </div>
      )}

      {/* Book Now CTA */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleBookNow}
        disabled={
          viewMode === 'packages'
            ? !selectedPackage || !email
            : !selectedSlot || selectedTopics.length === 0 || !email
        }
        className={`w-full py-4 rounded-xl font-medium uppercase tracking-wider transition-all duration-300 ${
          (viewMode === 'packages' ? selectedPackage && email : selectedSlot && selectedTopics.length > 0 && email)
            ? 'bg-gradient-to-r from-accent-gold to-accent-hover text-black shadow-lg shadow-accent-gold/30 hover:shadow-accent-gold/50'
            : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
        }`}
      >
        {viewMode === 'packages'
          ? currentPackage && email
            ? `Select ${currentPackage.name} - $${currentPackage.totalPrice}`
            : !email
            ? 'Enter Email to Continue'
            : 'Select Package'
          : selectedSlot && selectedTopics.length > 0 && email
          ? `Book Now - $${price}`
          : !email
          ? 'Enter Email to Continue'
          : 'Select Time Slot & Topics'}
      </motion.button>

      <p className="text-center text-xs text-zinc-500">
        🔒 Secure payment • ⚡ Instant confirmation • ✓ 24hr cancellation
      </p>
    </motion.div>
  );
}
