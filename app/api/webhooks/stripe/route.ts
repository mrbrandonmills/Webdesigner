import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { Resend } from 'resend'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-10-29.clover',
})

const resend = new Resend(process.env.RESEND_API_KEY!)
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  // Handle successful payment
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session

    // Send confirmation email
    try {
      const customerEmail = session.customer_details?.email
      const productType = session.metadata?.productType
      
      if (customerEmail) {
        let subject = ''
        let htmlContent = ''

        if (productType === 'meditation') {
          const meditationSlug = session.metadata?.meditationSlug
          const voicePreference = session.metadata?.voicePreference

          subject = 'Your Meditation Is Ready! 🧘'
          htmlContent = `
            <h1>Thank You for Your Purchase!</h1>
            <p>Your guided meditation is now ready to experience.</p>
            <p><strong>Access your meditation:</strong></p>
            <p><a href="${process.env.NEXT_PUBLIC_BASE_URL}/meditations/${meditationSlug}/success?session_id=${session.id}" style="background: #C9A050; color: black; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">Start Practicing Now</a></p>
            <p>Your purchase includes all 4 premium voice options. Lifetime access - yours forever.</p>
            <p>Best regards,<br/>Brandon Mills</p>
          `
        } else if (productType === 'book') {
          const bookId = session.metadata?.bookId

          subject = 'Your Book Is Unlocked! 📚'
          htmlContent = `
            <h1>Thank You for Your Purchase!</h1>
            <p>Your book is now unlocked and ready to read.</p>
            <p><strong>Access your book:</strong></p>
            <p><a href="${process.env.NEXT_PUBLIC_BASE_URL}/writing/books/${bookId}/success?session_id=${session.id}" style="background: #C9A050; color: black; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">Read Now</a></p>
            <p>Full PDF access with lifetime access - yours forever.</p>
            <p>Best regards,<br/>Brandon Mills</p>
          `
        }

        if (subject && htmlContent) {
          await resend.emails.send({
            from: 'Brandon Mills <noreply@brandonmills.com>',
            to: customerEmail,
            subject,
            html: htmlContent,
          })

          console.log(`Confirmation email sent to ${customerEmail}`)
        }
      }
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError)
      // Don't fail the webhook if email fails
    }
  }

  return NextResponse.json({ received: true })
}
