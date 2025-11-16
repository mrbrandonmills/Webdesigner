'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, DollarSign, Plus, Minus, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { BookingData, TimeSlot } from './types';
import { format, addDays, startOfWeek } from 'date-fns';

interface BookingPreviewProps {
  initialData?: Partial<BookingData>;
  onBookingComplete?: (bookingData: BookingData) => void;
}

const SESSION_TYPES = [
  { id: 'coaching', label: 'Personal Coaching', basePrice: 297 },
  { id: 'strategy', label: 'Strategy Session', basePrice: 497 },
  { id: 'styling', label: 'Personal Styling', basePrice: 397 },
  { id: 'custom', label: 'Custom Experience', basePrice: 697 }
] as const;

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-serif text-accent-gold">
          À La Carte Session Builder
        </h3>
        <p className="text-sm text-zinc-400">
          Craft your personalized experience with Brandon
        </p>
      </div>

      {/* Session Type Selection */}
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
              <p className="text-xs text-accent-gold mt-1">From ${type.basePrice}</p>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Duration Selection */}
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

      {/* Book Now CTA */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleBookNow}
        disabled={!selectedSlot || selectedTopics.length === 0}
        className={`w-full py-4 rounded-xl font-medium uppercase tracking-wider transition-all duration-300 ${
          selectedSlot && selectedTopics.length > 0
            ? 'bg-gradient-to-r from-accent-gold to-accent-hover text-black shadow-lg shadow-accent-gold/30 hover:shadow-accent-gold/50'
            : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
        }`}
      >
        {selectedSlot && selectedTopics.length > 0
          ? `Book Now - $${price}`
          : 'Select Time Slot & Topics'}
      </motion.button>

      <p className="text-center text-xs text-zinc-500">
        Secure payment • Instant confirmation • 24hr cancellation
      </p>
    </motion.div>
  );
}
