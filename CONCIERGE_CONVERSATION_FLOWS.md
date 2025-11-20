# AI Concierge - Conversation Flow Reference

## Intent Detection Keywords

### Mentoring Keywords
```
mentor, coach, session, book, consultation, modeling, career,
portfolio, agency, ai, architecture, llm, consulting,
transformation, growth, personal development, guidance,
advice, help with, learn
```

### Software Keywords
```
software, app, build, develop, custom, pricing, quote,
cost, estimate, demo, trial, see it work, jarvis,
lead scraper, automation, tool
```

## Conversation Flow Trees

### 1. Modeling Career Inquiry

```
User: "I need help with my modeling career"
  ↓
Bot: Intro + Experience mention (D&G, Armani)
  ↓
Bot: Three focus areas offered:
  • Portfolio review and feedback
  • Agency relationship guidance
  • Career planning and goals
  ↓
[User selects or describes need]
  ↓
Bot: Package presentation
  • Single Session: $297
  • Starter 3-Pack: $801 (Save $90) ⭐
  • Accelerator: $988 (Save $200)
  ↓
Bot: Quick actions
  [Single Session] [Starter 3-Pack] [Accelerator] [Tell me more]
  ↓
[User selects package]
  ↓
Bot: "Excellent choice! The [Package Name] includes..."
Bot: Feature list + Total price + Savings
  ↓
Bot: "I'll need your email for confirmation"
  ↓
[User provides email]
  ↓
Bot: "Perfect! I've saved your email. Let me show you booking..."
  ↓
[Switches to Booking view]
  ↓
Bot: Upsell (optional)
  "By the way, Brandon also offers custom software solutions..."
```

### 2. AI Consulting Inquiry

```
User: "Need help with AI architecture"
  ↓
Bot: "Great choice! Brandon specializes in AI architecture and LLMs"
  ↓
Bot: Three focus areas:
  • System architecture design
  • LLM integration strategies
  • AI workflow optimization
  ↓
Bot: "For complex AI projects, many clients start with Accelerator package"
  ↓
Bot: Package presentation (same as above)
  ↓
[Continue flow as modeling career]
```

### 3. Software - Lead Scraper Inquiry

```
User: "Need to automate lead generation"
  ↓
Bot: "Lead Scraper Pro is perfect for that!"
  ↓
Bot: Features list
  • Multi-source data extraction
  • Automatic email verification
  • Direct CRM integration
  ↓
Bot: "$1,497 one-time or payment plans available"
  ↓
Bot: "Want to see it pull leads in real-time?"
  ↓
Bot: Quick actions
  [Watch Demo] [Get Pricing] [Schedule Call] [Ask Question]
  ↓
Bot: "To send you demo access, I need your email"
  ↓
[User provides email]
  ↓
Bot: "Perfect! Team will reach out within 24 hours"
  ↓
Bot: Cross-sell (optional)
  "Have you considered Brandon's mentoring sessions?"
```

### 4. Custom Software Inquiry

```
User: "Can you build custom software?"
  ↓
Bot: "Custom development is our specialty!"
  ↓
Bot: What we build:
  • Business automation tools
  • AI-powered applications
  • Integration solutions
  ↓
Bot: "Every project starts with free discovery call"
  ↓
Bot: "What problem are you trying to solve?"
  ↓
Bot: Quick actions
  [Schedule Discovery] [Get Quote] [View Portfolio] [Email Brandon]
  ↓
Bot: "To schedule discovery call, I need your email"
  ↓
[Continue email capture flow]
```

### 5. Jarvis AI Inquiry

```
User: "Tell me about Jarvis"
  ↓
Bot: "Jarvis AI Assistant is our flagship product!"
  ↓
Bot: Key features:
  • 24/7 AI-powered business assistance
  • Custom training on your data
  • Multi-platform integration
  ↓
Bot: "Starting at $2,997 with demos available"
  ↓
Bot: "Would you like to schedule a live demo?"
  ↓
Bot: Quick actions
  [Watch Demo] [Get Pricing] [Schedule Call] [Ask Question]
  ↓
[Continue email capture flow]
```

### 6. General Booking Request

```
User: "I want to book a session"
  ↓
Bot: "Excellent! I'd be delighted to help"
  ↓
Bot: Three approaches:
  • View mentoring packages (recommended)
  • Book single session
  • Customize your own experience
  ↓
Bot: Quick actions
  [View Packages] [Book Single] [Custom Experience]
  ↓
[User selects approach]
  ↓
[Continue appropriate flow]
```

### 7. Price Inquiry

```
User: "How much does it cost?"
  ↓
Bot: Overview of all services
  ↓
Mentoring Sessions:
  • Single: $297
  • 3-Pack: $801 (Save $90)
  • Monthly: $988 (Save $200)
  ↓
Software Products:
  • Jarvis AI: $2,997
  • Lead Scraper: $1,497
  • Custom: Quote based
  ↓
Bot: "What are you most interested in?"
  ↓
[User specifies interest]
  ↓
[Continue appropriate flow]
```

## Quick Action Button Sets

### Mentoring Package Selection
```
📅 Single Session
🚀 Starter 3-Pack
⚡ Accelerator Monthly
📚 Tell me more
```

### Booking Approach
```
📦 View Packages
📅 Book Single Session
⚙️ Custom Experience
```

### Software Demo
```
▶️ Watch Demo
💰 Get Pricing
📅 Schedule Call
❓ Ask Question
```

### Custom Build
```
📞 Schedule Discovery Call
💬 Get Custom Quote
👁️ View Portfolio
📧 Email Brandon
```

### Welcome Screen
```
📅 Book a mentoring session
💻 See software demos
💬 Get a custom quote
🛍️ Browse the shop
```

## Email Capture Prompts

### Mentoring Context
```
"Before we proceed to booking, I'll need your email to send
you the confirmation and session details.

What email address should I use for your booking confirmation?"
```

### Software Demo Context
```
"To send you demo access and pricing details, I just need
your email address.

What's the best email to reach you?"
```

### Custom Build Context
```
"To schedule your free discovery call, I just need your
email address.

What's the best way to reach you?"
```

## Email Validation

### Valid Format
```
Email validated ✓
  ↓
Bot: "Perfect! I've saved your email (user@example.com)..."
  ↓
Lead saved to localStorage
  ↓
Analytics event fired
  ↓
Continue to next step
```

### Invalid Format
```
Email rejected ✗
  ↓
Bot: "That doesn't look like a valid email address.
Could you please double-check and try again?"
  ↓
[Awaits new input]
```

## Upsell Opportunities

### After Mentoring Lead Capture
```
"By the way, Brandon also offers custom software solutions.
Many clients find that combining mentoring with automation
tools accelerates their results significantly."
```

### After Software Lead Capture
```
"While you wait, have you considered Brandon's mentoring
sessions? Many software clients benefit from strategic
guidance on implementing their new tools effectively."
```

## Package Value Propositions

### Single Session ($297)
```
"Perfect for trying out a focused consultation first"
"Get expert feedback on one specific challenge"
```

### Starter 3-Pack ($801, save $90)
```
"Building momentum and seeing real transformation"
"Build real momentum with 3 sessions over time"
"Most popular! Great for building momentum"
```

### Accelerator Monthly ($988, save $200)
```
"Committed growth with comprehensive support"
"Maximum transformation with monthly accountability"
"Best value for committed growth"
```

## Response Timing

```
User sends message
  ↓
[Immediate] User message appears
  ↓
[800ms] Typing indicator shows
  ↓
[1500ms] Bot response appears
  ↓
[2000ms] Package details appear (if applicable)
  ↓
[1000ms] Quick action buttons appear
  ↓
[3500ms] Email request appears (if needed)
```

## Conversation Context State

```typescript
{
  currentTopic: 'general' | 'mentoring' | 'software' | 'lead-capture',
  subTopic: 'modeling' | 'ai-consulting' | 'career' | 'jarvis' | 'lead-scraper' | 'custom',
  awaitingEmail: boolean,
  lastRecommendation: 'single' | 'starter' | 'accelerator'
}
```

## Message Types

### Text Message
```typescript
{
  type: 'text',
  content: string
}
```

### Quick Actions Message
```typescript
{
  type: 'quick-actions',
  content: string,
  metadata: {
    quickActions: [
      { id: string, label: string, action: string }
    ]
  }
}
```

### Booking Message
```typescript
{
  type: 'booking',
  content: string,
  metadata: {
    bookingData: { sessionType, duration, price }
  }
}
```

### Lead Capture Message
```typescript
{
  type: 'lead-capture',
  content: string // Email prompt
}
```

## Analytics Events

### Lead Captured
```javascript
gtag('event', 'lead_capture', {
  event_category: 'concierge',
  event_label: 'mentoring' | 'software',
  event_value: 'modeling' | 'ai-consulting' | 'jarvis' | etc,
  value: 1
});
```

## localStorage Schema

### Leads Array
```javascript
[
  {
    email: "user@example.com",
    interest: "mentoring",
    specificInterest: "modeling",
    capturedAt: "2025-11-19T10:30:00.000Z",
    sessionId: "1732012200000",
    source: "concierge",
    conversationContext: {
      topic: "mentoring",
      subTopic: "modeling",
      messages: 8
    }
  }
]
```

## Error Handling

### Invalid Email
```
User: "bad-email"
  ↓
Bot: "That doesn't look like a valid email..."
  ↓
[Awaits new input, context preserved]
```

### No Selection Made
```
User: [clicks Book Now without package]
  ↓
Button: Disabled state
Text: "Select Package"
```

### Network Error (Future)
```
Bot: "I'm having trouble connecting. Please try again in a moment."
[Retry button]
```

---

## Quick Reference Summary

**Mentoring Intent** → Focus area clarification → Package presentation → Email capture → Booking

**Software Intent** → Product details → Demo/pricing options → Email capture → Follow-up scheduled

**General Inquiry** → Guided with quick actions → Specific flow

**Always capture email** before final commitment

**Always highlight savings** in package presentation

**Always offer upsell** after lead capture (but not pushy)

**Always provide quick actions** to guide conversation
