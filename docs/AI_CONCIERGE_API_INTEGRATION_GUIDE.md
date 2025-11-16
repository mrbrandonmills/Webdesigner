# AI Concierge API Integration Guide

## Quick Start - Connect Your APIs

This guide shows you exactly how to connect real APIs to your AI Concierge system.

---

## 1. Voice Integration (Whisper + ElevenLabs)

### Step 1: Create Transcription API

**File:** `app/api/concierge/transcribe/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get('audio') as File;

    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: 'whisper-1',
      language: 'en',
    });

    return NextResponse.json({ text: transcription.text });
  } catch (error) {
    console.error('Transcription error:', error);
    return NextResponse.json(
      { error: 'Failed to transcribe audio' },
      { status: 500 }
    );
  }
}
```

### Step 2: Create Text-to-Speech API

**File:** `app/api/concierge/speak/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

    const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/YOUR_VOICE_ID', {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': process.env.ELEVENLABS_API_KEY!,
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_monolingual_v1',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.8,
        },
      }),
    });

    const audioBuffer = await response.arrayBuffer();

    return new NextResponse(audioBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioBuffer.byteLength.toString(),
      },
    });
  } catch (error) {
    console.error('TTS error:', error);
    return NextResponse.json(
      { error: 'Failed to generate speech' },
      { status: 500 }
    );
  }
}
```

### Step 3: Update Voice Controls

**File:** `components/concierge/concierge-widget.tsx`

```typescript
const handleStartRecording = async () => {
  setVoiceState(prev => ({ ...prev, isRecording: true }));

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    const audioChunks: BlobPart[] = [];

    mediaRecorder.ondataavailable = (event) => {
      audioChunks.push(event.data);
    };

    mediaRecorder.onstop = async () => {
      const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
      const formData = new FormData();
      formData.append('audio', audioBlob);

      const response = await fetch('/api/concierge/transcribe', {
        method: 'POST',
        body: formData,
      });

      const { text } = await response.json();
      setInputValue(text);
      handleSendMessage();
    };

    mediaRecorder.start();
    // Store mediaRecorder in ref to stop later
  } catch (error) {
    console.error('Recording error:', error);
    setVoiceState(prev => ({ ...prev, isRecording: false }));
  }
};

const handlePlayAudio = async (text: string) => {
  try {
    const response = await fetch('/api/concierge/speak', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });

    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);

    setVoiceState(prev => ({ ...prev, isPlaying: true }));
    audio.play();

    audio.onended = () => {
      setVoiceState(prev => ({ ...prev, isPlaying: false }));
      URL.revokeObjectURL(audioUrl);
    };
  } catch (error) {
    console.error('Audio playback error:', error);
  }
};
```

---

## 2. AI Chat Integration (OpenAI GPT-4)

### Create Chat API

**File:** `app/api/concierge/chat/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

const SYSTEM_PROMPT = `You are an elite personal concierge for Brandon Mills' luxury e-commerce site.

You embody:
- Four Seasons-level service excellence
- Deep knowledge of art, fashion, and luxury goods
- Personalized recommendations based on client preferences
- Professional yet warm communication style

Your capabilities:
- Book 1-on-1 sessions with Brandon (coaching, strategy, styling)
- Recommend clothing and accessories based on client's style
- Generate custom art based on personality and preferences
- Remember VIP client preferences and history

Always:
- Address VIP clients with recognition of their status
- Provide specific, actionable recommendations
- Use sophisticated but accessible language
- Suggest next steps proactively`;

export async function POST(request: NextRequest) {
  try {
    const { messages, vipStatus } = await request.json();

    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        {
          role: 'system',
          content: `Client VIP Status: ${JSON.stringify(vipStatus)}`,
        },
        ...messages,
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    return NextResponse.json({
      message: response.choices[0].message.content,
    });
  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    );
  }
}
```

### Update Widget to Use Chat API

```typescript
const handleSendMessage = async () => {
  if (!inputValue.trim()) return;

  const userMessage: ConciergeMessage = {
    id: Date.now().toString(),
    role: 'user',
    content: inputValue,
    timestamp: new Date(),
    type: 'text',
  };

  setMessages(prev => [...prev, userMessage]);
  setInputValue('');
  setIsTyping(true);

  try {
    const response = await fetch('/api/concierge/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [...messages, userMessage].map(m => ({
          role: m.role,
          content: m.content,
        })),
        vipStatus,
      }),
    });

    const { message } = await response.json();

    addAssistantMessage(message, 'text');
  } catch (error) {
    console.error('Chat error:', error);
    addAssistantMessage(
      "I apologize, but I'm having trouble connecting. Please try again.",
      'system'
    );
  } finally {
    setIsTyping(false);
  }
};
```

---

## 3. Booking Integration (Calendly or Google Calendar)

### Using Calendly

**File:** `app/api/concierge/booking/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const bookingData = await request.json();

    // Create Calendly event
    const response = await fetch('https://api.calendly.com/scheduled_events', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.CALENDLY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        event: bookingData.sessionType,
        start_time: bookingData.selectedSlot.startTime,
        duration: bookingData.duration,
        // ... other Calendly fields
      }),
    });

    const calendlyEvent = await response.json();

    // Send confirmation email
    await fetch('/api/email/booking-confirmation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: bookingData.email,
        bookingDetails: calendlyEvent,
      }),
    });

    return NextResponse.json({ success: true, event: calendlyEvent });
  } catch (error) {
    console.error('Booking error:', error);
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    );
  }
}
```

---

## 4. Payment Integration (Stripe)

**File:** `app/api/concierge/payment/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export async function POST(request: NextRequest) {
  try {
    const { bookingData } = await request.json();

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${bookingData.sessionType} Session - ${bookingData.duration}min`,
              description: `Topics: ${bookingData.topics.join(', ')}`,
            },
            unit_amount: bookingData.price * 100, // Stripe uses cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${request.headers.get('origin')}/booking-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.headers.get('origin')}/booking-cancelled`,
      metadata: {
        bookingData: JSON.stringify(bookingData),
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Payment error:', error);
    return NextResponse.json(
      { error: 'Failed to create payment session' },
      { status: 500 }
    );
  }
}
```

---

## 5. Styling Recommendations (AI-Powered)

**File:** `app/api/concierge/styling/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(request: NextRequest) {
  try {
    const { userPreferences, budget } = await request.json();

    // Get products from database
    const { rows: products } = await sql`
      SELECT * FROM products
      WHERE category IN (${userPreferences.categories.join(',')})
      AND price <= ${budget}
      LIMIT 50
    `;

    // Use AI to rank products
    const prompt = `Given these user preferences:
    Style: ${userPreferences.style}
    Interests: ${userPreferences.interests}
    Budget: $${budget}

    Rank these products by match score (0-1):
    ${JSON.stringify(products)}

    Return JSON array with id and matchScore.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
    });

    const rankings = JSON.parse(response.choices[0].message.content!);

    return NextResponse.json({
      recommendations: products
        .map(p => ({
          ...p,
          matchScore: rankings.find((r: any) => r.id === p.id)?.matchScore || 0,
        }))
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, 4),
    });
  } catch (error) {
    console.error('Styling error:', error);
    return NextResponse.json(
      { error: 'Failed to generate recommendations' },
      { status: 500 }
    );
  }
}
```

---

## 6. Art Generation (DALL-E)

**File:** `app/api/concierge/art/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { put } from '@vercel/blob';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(request: NextRequest) {
  try {
    const { personality, preferences } = await request.json();

    // Generate art prompt from personality
    const promptResponse = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'user',
          content: `Create a detailed DALL-E 3 prompt for custom art based on:
          Personality: ${JSON.stringify(personality)}
          Preferences: ${JSON.stringify(preferences)}
          Style: Contemporary luxury art for high-end client`,
        },
      ],
    });

    const artPrompt = promptResponse.choices[0].message.content!;

    // Generate image
    const imageResponse = await openai.images.generate({
      model: 'dall-e-3',
      prompt: artPrompt,
      size: '1024x1024',
      quality: 'hd',
      n: 1,
    });

    const imageUrl = imageResponse.data[0].url!;

    // Download and store in Vercel Blob
    const imageBuffer = await fetch(imageUrl).then(r => r.arrayBuffer());
    const blob = await put(
      `concierge-art/${Date.now()}.png`,
      imageBuffer,
      { access: 'public' }
    );

    return NextResponse.json({
      imageUrl: blob.url,
      prompt: artPrompt,
    });
  } catch (error) {
    console.error('Art generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate art' },
      { status: 500 }
    );
  }
}
```

---

## 7. VIP Profile System (Database)

### Database Schema

**File:** `scripts/create-vip-profiles.sql`

```sql
CREATE TABLE vip_profiles (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) NOT NULL,
  tier VARCHAR(50) DEFAULT 'bronze',
  total_spent DECIMAL(10, 2) DEFAULT 0,
  visit_count INTEGER DEFAULT 0,
  last_visit TIMESTAMP,
  preferences JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_vip_user_id ON vip_profiles(user_id);
CREATE INDEX idx_vip_email ON vip_profiles(email);
```

### Profile API

**File:** `app/api/concierge/profile/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function GET(request: NextRequest) {
  const userId = request.headers.get('x-user-id');

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { rows } = await sql`
      SELECT * FROM vip_profiles
      WHERE user_id = ${userId}
    `;

    if (rows.length === 0) {
      // Create new profile
      const { rows: newProfile } = await sql`
        INSERT INTO vip_profiles (user_id, email)
        VALUES (${userId}, ${request.headers.get('x-user-email')})
        RETURNING *
      `;
      return NextResponse.json(newProfile[0]);
    }

    // Update visit count
    await sql`
      UPDATE vip_profiles
      SET visit_count = visit_count + 1,
          last_visit = CURRENT_TIMESTAMP
      WHERE user_id = ${userId}
    `;

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error('Profile error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  const userId = request.headers.get('x-user-id');
  const { preferences } = await request.json();

  try {
    const { rows } = await sql`
      UPDATE vip_profiles
      SET preferences = ${JSON.stringify(preferences)},
          updated_at = CURRENT_TIMESTAMP
      WHERE user_id = ${userId}
      RETURNING *
    `;

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}
```

---

## Environment Variables

Add these to `.env.local`:

```bash
# OpenAI (Whisper + GPT-4 + DALL-E)
OPENAI_API_KEY=sk-...

# ElevenLabs (Text-to-Speech)
ELEVENLABS_API_KEY=...
ELEVENLABS_VOICE_ID=...

# Calendly (Booking)
CALENDLY_API_KEY=...

# Stripe (Payments)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...

# Database (Vercel Postgres)
POSTGRES_URL=...
POSTGRES_PRISMA_URL=...
POSTGRES_URL_NON_POOLING=...

# Vercel Blob (Image Storage)
BLOB_READ_WRITE_TOKEN=...
```

---

## Testing APIs

Use these curl commands to test:

```bash
# Test Transcription
curl -X POST http://localhost:3000/api/concierge/transcribe \
  -F "audio=@test.wav"

# Test Chat
curl -X POST http://localhost:3000/api/concierge/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Book a session"}]}'

# Test Booking
curl -X POST http://localhost:3000/api/concierge/booking \
  -H "Content-Type: application/json" \
  -d '{"sessionType":"coaching","duration":60}'

# Test Art Generation
curl -X POST http://localhost:3000/api/concierge/art \
  -H "Content-Type: application/json" \
  -d '{"personality":{"type":"creative"}}'
```

---

## Deployment Checklist

- [ ] Add all environment variables to Vercel
- [ ] Create Postgres database tables
- [ ] Set up Calendly account and get API key
- [ ] Create Stripe account and get keys
- [ ] Set up ElevenLabs voice
- [ ] Test all API endpoints
- [ ] Deploy to production
- [ ] Monitor API usage and costs

---

## Cost Estimates (Monthly)

- **OpenAI:** $50-200 (GPT-4 + Whisper + DALL-E)
- **ElevenLabs:** $22-99 (Voice generation)
- **Calendly:** $12-20 (Professional plan)
- **Stripe:** 2.9% + 30¢ per transaction
- **Vercel Postgres:** $20-50
- **Vercel Blob:** $0.15/GB

**Total:** ~$150-400/month depending on usage

---

## Support

For issues or questions:
1. Check error logs in Vercel dashboard
2. Review API documentation
3. Test with curl commands
4. Contact Brandon for urgent issues

---

**Ready to integrate?** Start with voice APIs (easiest) and work your way through the list!
