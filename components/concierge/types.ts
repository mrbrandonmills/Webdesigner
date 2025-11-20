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
  type?: 'text' | 'booking' | 'styling' | 'art' | 'system' | 'software' | 'lead-capture' | 'quick-actions';
  metadata?: {
    artPreview?: string;
    bookingData?: BookingData;
    stylingRecommendations?: StylingItem[];
    quickActions?: QuickAction[];
    softwareProducts?: SoftwareProduct[];
    leadCaptureType?: 'mentoring' | 'software' | 'custom';
  };
}

export interface QuickAction {
  id: string;
  label: string;
  action: string;
  icon?: string;
}

export interface SoftwareProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  features: string[];
  demoAvailable: boolean;
}

export interface LeadData {
  email: string;
  name?: string;
  phone?: string;
  interest: 'mentoring' | 'software' | 'custom';
  specificInterest?: string;
  capturedAt: Date;
  source: string;
}

export interface MentoringPackage {
  id: string;
  name: string;
  sessions: number;
  pricePerSession: number;
  totalPrice: number;
  savings: number;
  features: string[];
  popular?: boolean;
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
