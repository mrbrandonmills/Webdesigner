/**
 * Type definitions for AI Concierge System
 * Luxury e-commerce concierge interface types
 */

export interface ConciergeMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  audioUrl?: string;
  type?: 'text' | 'booking' | 'styling' | 'art' | 'system';
  metadata?: {
    artPreview?: string;
    bookingData?: BookingData;
    stylingRecommendations?: StylingItem[];
  };
}

export interface BookingData {
  sessionType: 'coaching' | 'strategy' | 'styling' | 'custom';
  duration: 30 | 60 | 90 | 120;
  topics: string[];
  price: number;
  availableSlots?: TimeSlot[];
  selectedSlot?: TimeSlot;
}

export interface TimeSlot {
  id: string;
  date: Date;
  startTime: string;
  endTime: string;
  available: boolean;
}

export interface StylingItem {
  id: string;
  name: string;
  category: string;
  imageUrl: string;
  price: number;
  matchScore: number;
}

export interface VIPStatus {
  isVIP: boolean;
  tier?: 'bronze' | 'silver' | 'gold' | 'platinum';
  totalSpent: number;
  visitCount: number;
  lastVisit?: Date;
  preferences?: {
    style?: string[];
    interests?: string[];
    budget?: string;
  };
}

export interface VoiceState {
  isRecording: boolean;
  isPlaying: boolean;
  isSpeaking: boolean;
  volume: number;
  currentAudioId?: string;
}

export interface ConciergeState {
  isOpen: boolean;
  messages: ConciergeMessage[];
  voiceState: VoiceState;
  vipStatus?: VIPStatus;
  isTyping: boolean;
  error?: string;
}
