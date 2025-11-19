// /app/api/newsletter/subscribe/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const { email, source } = await request.json()

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email required' },
        { status: 400 }
      )
    }

    // Add to Resend audience
    await resend.contacts.create({
      email,
      audienceId: process.env.RESEND_AUDIENCE_ID!,
      unsubscribed: false,
      firstName: '',
      lastName: ''
    })

    // Send welcome email
    await resend.emails.send({
      from: 'Brandon Mills <hello@brandonmills.com>',
      to: email,
      subject: 'Your Mind Visualization Report',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: system-ui; background: #000; color: #fff; padding: 40px; }
            .container { max-width: 600px; margin: 0 auto; }
            h1 { font-family: Georgia, serif; color: #C9A050; }
            .cta { display: inline-block; padding: 12px 24px; background: #C9A050; color: #000; text-decoration: none; border-radius: 8px; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Welcome to the Journey</h1>
            <p>Thanks for exploring your mind with us.</p>
            <p>Your visualization revealed fascinating patterns in how you think and process information.</p>
            <p>Over the next few days, I'll send you:</p>
            <ul>
              <li>Deep dive into your dominant archetype</li>
              <li>Personalized meditation recommendations</li>
              <li>Techniques to enhance your cognitive patterns</li>
            </ul>
            <p>
              <a href="https://brandonmills.com/meditations" class="cta">Explore Meditations</a>
            </p>
            <p style="color: #666; font-size: 14px;">- Brandon</p>
          </div>
        </body>
        </html>
      `
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Newsletter subscription error:', error)
    return NextResponse.json(
      { error: 'Subscription failed' },
      { status: 500 }
    )
  }
}
