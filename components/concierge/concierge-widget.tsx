'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Sparkles, Crown, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { ConciergeMessageComponent } from './concierge-message';
import { VoiceControls } from './voice-controls';
import { BookingPreview } from './booking-preview';
import { ConciergeMessage, VoiceState, VIPStatus, BookingData, LeadData, QuickAction } from './types';

// Sales keyword detection patterns
const MENTORING_KEYWORDS = [
  'mentor', 'coach', 'session', 'book', 'consultation',
  'modeling', 'career', 'portfolio', 'agency',
  'ai', 'architecture', 'llm', 'consulting',
  'transformation', 'growth', 'personal development',
  'guidance', 'advice', 'help with', 'learn'
];

const SOFTWARE_KEYWORDS = [
  'software', 'app', 'build', 'develop', 'custom',
  'pricing', 'quote', 'cost', 'estimate',
  'demo', 'trial', 'see it work',
  'jarvis', 'lead scraper', 'automation', 'tool'
];

const MENTORING_PACKAGES = [
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

const SOFTWARE_PRODUCTS = [
  {
    id: 'jarvis',
    name: 'Jarvis AI Assistant',
    description: 'Your personal AI-powered business assistant',
    price: 2997,
    features: ['24/7 availability', 'Custom training', 'Multi-platform integration'],
    demoAvailable: true
  },
  {
    id: 'lead-scraper',
    name: 'Lead Scraper Pro',
    description: 'Automated lead generation and enrichment',
    price: 1497,
    features: ['Multi-source scraping', 'Email verification', 'CRM integration'],
    demoAvailable: true
  },
  {
    id: 'custom',
    name: 'Custom Software Build',
    description: 'Tailored solutions for your unique needs',
    price: 0,
    features: ['Discovery session', 'Custom architecture', 'Ongoing support'],
    demoAvailable: false
  }
];

const QUICK_ACTIONS: QuickAction[] = [
  { id: 'book-mentoring', label: 'Book a mentoring session', action: 'mentoring', icon: 'calendar' },
  { id: 'software-demos', label: 'See software demos', action: 'software', icon: 'play' },
  { id: 'custom-quote', label: 'Get a custom quote', action: 'quote', icon: 'dollar' },
  { id: 'browse-shop', label: 'Browse the shop', action: 'shop', icon: 'shopping' }
];

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

  // Conversation context for smarter responses
  const [conversationContext, setConversationContext] = useState<{
    currentTopic: 'general' | 'mentoring' | 'software' | 'lead-capture';
    subTopic?: string;
    awaitingEmail: boolean;
    lastRecommendation?: string;
  }>({
    currentTopic: 'general',
    awaitingEmail: false
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Helper function to detect keywords in input
  const detectIntent = (input: string): { type: 'mentoring' | 'software' | 'general'; subType?: string } => {
    const lowerInput = input.toLowerCase();

    // Check for specific mentoring subtopics
    if (lowerInput.includes('model') || lowerInput.includes('agency') || lowerInput.includes('portfolio')) {
      return { type: 'mentoring', subType: 'modeling' };
    }
    if (lowerInput.includes('ai') || lowerInput.includes('llm') || lowerInput.includes('architecture')) {
      return { type: 'mentoring', subType: 'ai-consulting' };
    }
    if (lowerInput.includes('career') || lowerInput.includes('growth') || lowerInput.includes('transformation')) {
      return { type: 'mentoring', subType: 'career' };
    }

    // Check for software subtopics
    if (lowerInput.includes('jarvis') || lowerInput.includes('assistant')) {
      return { type: 'software', subType: 'jarvis' };
    }
    if (lowerInput.includes('lead') || lowerInput.includes('scraper')) {
      return { type: 'software', subType: 'lead-scraper' };
    }
    if (lowerInput.includes('custom') || lowerInput.includes('build') || lowerInput.includes('develop')) {
      return { type: 'software', subType: 'custom' };
    }

    // General keyword matching
    if (MENTORING_KEYWORDS.some(keyword => lowerInput.includes(keyword))) {
      return { type: 'mentoring' };
    }
    if (SOFTWARE_KEYWORDS.some(keyword => lowerInput.includes(keyword))) {
      return { type: 'software' };
    }

    return { type: 'general' };
  };

  // Save lead to localStorage and track
  const captureLead = (leadData: LeadData) => {
    try {
      const existingLeads = JSON.parse(localStorage.getItem('concierge_leads') || '[]');

      // Add timestamp and enrich data
      const enrichedLead = {
        ...leadData,
        capturedAt: new Date().toISOString(),
        sessionId: Date.now().toString(),
        conversationContext: {
          topic: conversationContext.currentTopic,
          subTopic: conversationContext.subTopic,
          messages: messages.length
        }
      };

      existingLeads.push(enrichedLead);
      localStorage.setItem('concierge_leads', JSON.stringify(existingLeads));

      // Track in analytics (placeholder for actual implementation)
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'lead_capture', {
          event_category: 'concierge',
          event_label: leadData.interest,
          event_value: leadData.specificInterest,
          value: 1
        });
      }

      console.log('Lead captured successfully:', enrichedLead);
      return true;
    } catch (error) {
      console.error('Failed to capture lead:', error);
      return false;
    }
  };

  // Validate email format
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Welcome message on first open
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setTimeout(() => {
        addAssistantMessage(
          `Welcome back${vipStatus.isVIP ? ', valued client' : ''}! I'm your personal concierge. How may I assist you today?\n\nI can help you with:\n- **Mentoring sessions** (modeling, AI consulting, career growth)\n- **Software solutions** (Jarvis AI, Lead Scraper, custom builds)\n- **Custom quotes** for specialized projects`,
          'system'
        );

        // Add quick action buttons after welcome
        setTimeout(() => {
          const quickActionMessage: ConciergeMessage = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: 'What brings you here today?',
            timestamp: new Date(),
            type: 'quick-actions',
            metadata: {
              quickActions: QUICK_ACTIONS
            }
          };
          setMessages(prev => [...prev, quickActionMessage]);
        }, 800);
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

  // Extracted message processing logic
  const processUserInput = (currentInput: string) => {
    // Check if awaiting email
      if (conversationContext.awaitingEmail) {
        if (isValidEmail(currentInput)) {
          const leadData: LeadData = {
            email: currentInput,
            interest: conversationContext.currentTopic === 'software' ? 'software' : 'mentoring',
            specificInterest: conversationContext.subTopic,
            capturedAt: new Date(),
            source: 'concierge'
          };
          captureLead(leadData);

          setConversationContext(prev => ({ ...prev, awaitingEmail: false }));

          addAssistantMessage(
            `Perfect! I've saved your email (${currentInput}). ${
              conversationContext.currentTopic === 'mentoring'
                ? "Let me show you our mentoring packages so you can book directly."
                : "A team member will reach out within 24 hours to schedule your demo or discuss your project."
            }`,
            'text'
          );

          // Show booking or next steps based on context
          if (conversationContext.currentTopic === 'mentoring') {
            setTimeout(() => {
              setActiveView('booking');
            }, 1000);
          }

          // Proactive upsell after lead capture
          setTimeout(() => {
            const upsellMessage = conversationContext.currentTopic === 'mentoring'
              ? "By the way, Brandon also offers custom software solutions. Many clients find that combining mentoring with automation tools accelerates their results significantly."
              : "While you wait, have you considered Brandon's mentoring sessions? Many software clients benefit from strategic guidance on implementing their new tools effectively.";

            addAssistantMessage(upsellMessage, 'text');
          }, 3000);

          return;
        } else {
          addAssistantMessage(
            "That doesn't look like a valid email address. Could you please double-check and try again?",
            'text'
          );
          return;
        }
      }

      // Detect intent from input
      const intent = detectIntent(currentInput);

      // Handle mentoring inquiries
      if (intent.type === 'mentoring') {
        setConversationContext(prev => ({
          ...prev,
          currentTopic: 'mentoring',
          subTopic: intent.subType
        }));

        let response = '';

        if (intent.subType === 'modeling') {
          response = `Excellent! Brandon has extensive experience with agencies like D&G and Armani.

Are you looking for:
- **Portfolio review** and feedback
- **Agency relationship** guidance
- **Career planning** and goals

I can recommend the right session type based on your needs. Which area interests you most?`;
        } else if (intent.subType === 'ai-consulting') {
          response = `Great choice! Brandon specializes in AI architecture and LLM implementation.

What's your primary focus?
- **System architecture** design
- **LLM integration** strategies
- **AI workflow** optimization

For complex AI projects, many clients start with the **Accelerator package** for ongoing support.`;
        } else if (intent.subType === 'career') {
          response = `I'd love to help with your growth journey!

Brandon offers transformational coaching for:
- **Personal brand** development
- **Career pivots** and transitions
- **Leadership** and mindset

What specific transformation are you seeking?`;
        } else {
          response = `I'd be happy to help you find the right mentoring solution!

Brandon offers sessions in:
- **Modeling & Fashion** (portfolio, agencies, industry insights)
- **AI & Technology** (architecture, LLMs, implementation)
- **Personal Development** (career growth, transformation)

Which area resonates most with your goals?`;
        }

        addAssistantMessage(response, 'text');

        // Show packages after clarifying question with quick reply buttons
        setTimeout(() => {
          const packageMessage: ConciergeMessage = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: `Here are our mentoring packages:\n\n` +
              `**Single Session** - $297\n` +
              `Perfect for a focused consultation on one topic.\n\n` +
              `**Starter 3-Pack** - $801 (Save $90!)\n` +
              `Most popular! Build momentum with 3 sessions over time.\n` +
              `💎 ${MENTORING_PACKAGES[1].pricePerSession}/session\n\n` +
              `**Accelerator Monthly** - $988 (Save $200!)\n` +
              `Best value for committed transformation. 4 sessions/month + ongoing support.\n` +
              `💎 ${MENTORING_PACKAGES[2].pricePerSession}/session\n\n` +
              `Which package interests you? I can help you book directly.`,
            timestamp: new Date(),
            type: 'text'
          };
          setMessages(prev => [...prev, packageMessage]);

          // Add quick action buttons for package selection
          setTimeout(() => {
            const packageActionMessage: ConciergeMessage = {
              id: (Date.now() + 2).toString(),
              role: 'assistant',
              content: 'Choose your preferred package:',
              timestamp: new Date(),
              type: 'quick-actions',
              metadata: {
                quickActions: [
                  { id: 'single-session', label: '📅 Single Session', action: 'I want the single session' },
                  { id: 'starter-pack', label: '🚀 Starter 3-Pack', action: 'I want the starter 3-pack' },
                  { id: 'accelerator', label: '⚡ Accelerator Monthly', action: 'I want the accelerator package' },
                  { id: 'learn-more', label: '📚 Tell me more', action: 'Tell me more about packages' }
                ]
              }
            };
            setMessages(prev => [...prev, packageActionMessage]);
          }, 1000);
        }, 2000);
      }

      // Handle software inquiries
      else if (intent.type === 'software') {
        setConversationContext(prev => ({
          ...prev,
          currentTopic: 'software',
          subTopic: intent.subType
        }));

        let response = '';

        if (intent.subType === 'jarvis') {
          response = `**Jarvis AI Assistant** is our flagship product!

Key features:
- 24/7 AI-powered business assistance
- Custom training on your business data
- Multi-platform integration (Slack, email, CRM)

**Starting at $2,997** with demos available.

Would you like to schedule a live demo to see Jarvis in action?`;
        } else if (intent.subType === 'lead-scraper') {
          response = `**Lead Scraper Pro** is perfect for scaling your outreach!

Features include:
- Multi-source data extraction
- Automatic email verification
- Direct CRM integration

**$1,497 one-time** or payment plans available.

Want to see it pull leads in real-time? I can arrange a demo.`;
        } else if (intent.subType === 'custom') {
          response = `Custom software development is our specialty!

We build:
- **Business automation** tools
- **AI-powered** applications
- **Integration** solutions

Every project starts with a free **discovery call** to understand your needs.

What problem are you trying to solve? I can give you a rough estimate.`;
        } else {
          response = `We have several software solutions that might help:

**Jarvis AI** - Personal AI assistant ($2,997)
**Lead Scraper Pro** - Automated lead gen ($1,497)
**Custom Build** - Tailored to your needs (Quote)

What's the main challenge you're facing? I'll recommend the best fit.`;
        }

        addAssistantMessage(response, 'software');

        // Offer demo or quote with quick action buttons
        setTimeout(() => {
          const actionMessage: ConciergeMessage = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: intent.subType === 'custom'
              ? 'What would you like to do next?'
              : 'How would you like to proceed?',
            timestamp: new Date(),
            type: 'quick-actions',
            metadata: {
              quickActions: intent.subType === 'custom'
                ? [
                    { id: 'schedule-discovery', label: '📞 Schedule Discovery Call', action: 'Schedule discovery call' },
                    { id: 'get-quote', label: '💬 Get Custom Quote', action: 'Get a custom quote' },
                    { id: 'view-portfolio', label: '👁️ View Portfolio', action: 'Show me your portfolio' },
                    { id: 'email-brandon', label: '📧 Email Brandon', action: 'Send email to Brandon' }
                  ]
                : [
                    { id: 'watch-demo', label: '▶️ Watch Demo', action: 'I want to see a demo' },
                    { id: 'get-pricing', label: '💰 Get Pricing', action: 'Show me pricing' },
                    { id: 'schedule-call', label: '📅 Schedule Call', action: 'Schedule a call' },
                    { id: 'ask-question', label: '❓ Ask Question', action: 'I have a question' }
                  ]
            }
          };
          setMessages(prev => [...prev, actionMessage]);
        }, 2000);

        // Request email for follow-up
        setTimeout(() => {
          setConversationContext(prev => ({ ...prev, awaitingEmail: true }));
          addAssistantMessage(
            `To ${intent.subType === 'custom' ? 'schedule your free discovery call' : 'send you demo access and pricing details'}, I just need your email address.\n\nWhat's the best email to reach you?`,
            'lead-capture'
          );
        }, 3500);
      }

      // Handle package selection intents
      else if (
        currentInput.toLowerCase().includes('starter') ||
        currentInput.toLowerCase().includes('3-pack') ||
        currentInput.toLowerCase().includes('accelerator') ||
        currentInput.toLowerCase().includes('single session')
      ) {
        let selectedPkg = '';
        if (currentInput.toLowerCase().includes('starter') || currentInput.toLowerCase().includes('3-pack')) {
          selectedPkg = 'starter';
        } else if (currentInput.toLowerCase().includes('accelerator')) {
          selectedPkg = 'accelerator';
        } else {
          selectedPkg = 'single';
        }

        const pkg = MENTORING_PACKAGES.find(p => p.id === selectedPkg);
        if (pkg) {
          addAssistantMessage(
            `Excellent choice! The **${pkg.name}** is perfect for ${
              selectedPkg === 'starter' ? 'building momentum and seeing real transformation' :
              selectedPkg === 'accelerator' ? 'committed growth with comprehensive support' :
              'trying out a focused consultation first'
            }.\n\n` +
            `Here's what's included:\n${pkg.features.map(f => `✓ ${f}`).join('\n')}\n\n` +
            `Total investment: **$${pkg.totalPrice}**${pkg.savings > 0 ? ` (Save $${pkg.savings})` : ''}\n` +
            `Per session: **$${pkg.pricePerSession}**\n\n` +
            `Before we proceed to booking, I'll need your email to send you the confirmation and session details.`,
            'text'
          );

          setTimeout(() => {
            setConversationContext(prev => ({
              ...prev,
              currentTopic: 'mentoring',
              awaitingEmail: true,
              lastRecommendation: selectedPkg
            }));
            addAssistantMessage(
              'What email address should I use for your booking confirmation?',
              'lead-capture'
            );
          }, 2000);
        }
      }

      // Handle booking/session requests
      else if (currentInput.toLowerCase().includes('book') || currentInput.toLowerCase().includes('session')) {
        addAssistantMessage(
          "Excellent! I'd be delighted to help you schedule a personalized session with Brandon.\n\n" +
          "Would you like to:\n" +
          "• View our **mentoring packages** (recommended for multiple sessions)\n" +
          "• Book a **single session** to get started\n" +
          "• Customize your own experience",
          'text'
        );

        setTimeout(() => {
          const bookingActionMessage: ConciergeMessage = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: 'Choose your booking approach:',
            timestamp: new Date(),
            type: 'quick-actions',
            metadata: {
              quickActions: [
                { id: 'view-packages', label: '📦 View Packages', action: 'Show me mentoring packages' },
                { id: 'book-single', label: '📅 Book Single Session', action: 'I want the single session' },
                { id: 'custom-booking', label: '⚙️ Custom Experience', action: 'I want a custom session' }
              ]
            }
          };
          setMessages(prev => [...prev, bookingActionMessage]);
        }, 1500);
      }

      // Handle style/clothing requests
      else if (currentInput.toLowerCase().includes('style') || currentInput.toLowerCase().includes('clothing')) {
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
      }

      // Handle art requests
      else if (currentInput.toLowerCase().includes('art')) {
        addAssistantMessage(
          "I can create a unique piece of art tailored to your personality and aesthetic preferences. What style resonates with you today?",
          'art'
        );
      }

      // Handle price/cost inquiries
      else if (currentInput.toLowerCase().includes('price') || currentInput.toLowerCase().includes('cost') || currentInput.toLowerCase().includes('how much')) {
        addAssistantMessage(
          `Here's a quick overview of our services:\n\n` +
          `**Mentoring Sessions**\n` +
          `- Single: $297\n` +
          `- 3-Pack: $801 (Save $90)\n` +
          `- Monthly: $988 (Save $200)\n\n` +
          `**Software Products**\n` +
          `- Jarvis AI: $2,997\n` +
          `- Lead Scraper: $1,497\n` +
          `- Custom: Quote based\n\n` +
          `What are you most interested in? I can provide more details.`,
          'text'
        );
      }

      // Handle shop/browse requests
      else if (currentInput.toLowerCase().includes('shop') || currentInput.toLowerCase().includes('browse')) {
        addAssistantMessage(
          "I'd be happy to show you around! Our shop features:\n\n" +
          "- **Digital Products** (templates, guides, tools)\n" +
          "- **Software Licenses** (Jarvis, Lead Scraper)\n" +
          "- **Session Packages** (mentoring bundles)\n\n" +
          "Would you like me to recommend something based on your goals?",
          'text'
        );
      }

      // Handle demo requests
      else if (currentInput.toLowerCase().includes('demo') || currentInput.toLowerCase().includes('trial')) {
        setConversationContext(prev => ({
          ...prev,
          currentTopic: 'software',
          awaitingEmail: true
        }));
        addAssistantMessage(
          "Great! We offer live demos of both Jarvis AI and Lead Scraper Pro. To schedule your demo, I just need your email address. What's the best way to reach you?",
          'lead-capture'
        );
      }

      // Default fallback with helpful suggestions
      else {
        addAssistantMessage(
          "I'd be happy to help! Here are the most popular ways I can assist:\n\n" +
          "- **Book a mentoring session** with Brandon\n" +
          "- **Explore our software** solutions\n" +
          "- **Get a custom quote** for your project\n" +
          "- **Browse the shop** for digital products\n\n" +
          "What sounds most relevant to you?",
          'text'
        );
      }
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
    const currentInput = inputValue;
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response (replace with actual API call)
    setTimeout(() => {
      setIsTyping(false);
      processUserInput(currentInput);
    }, 1500);
  };

  // Handle quick action button clicks
  const handleQuickAction = (action: string) => {
    // Add user message immediately
    const userMessage: ConciergeMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: action,
      timestamp: new Date(),
      type: 'text'
    };
    setMessages(prev => [...prev, userMessage]);

    // Process as if user typed the message
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      processUserInput(action);
    }, 800);
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
                          onQuickAction={handleQuickAction}
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
