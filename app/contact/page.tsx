'use client'

import { useState } from 'react'
import { Instagram } from 'lucide-react'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement form submission (email service, etc.)
    console.log('Form submitted:', formData)
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 5000)
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="pt-32 pb-20 container-wide">
        <div className="max-w-4xl mx-auto text-center space-y-8 animate-fadeIn">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-light font-serif leading-none">
            Let's Collaborate
          </h1>
          <div className="luxury-divider"></div>
          <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto leading-relaxed">
            Open to creative collaborations, innovative projects,
            and conversations that push boundaries
          </p>
        </div>
      </section>

      {/* Contact Form */}
      <section className="pb-32 container-wide">
        <div className="max-w-2xl mx-auto">
          {submitted ? (
            <div className="text-center py-20 space-y-6 animate-fadeIn">
              <div className="text-6xl">✓</div>
              <h2 className="text-3xl font-serif">Message Received</h2>
              <p className="text-white/60">
                Thank you for reaching out. I'll get back to you soon.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm tracking-wider uppercase text-white/60">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-transparent border-b border-white/20 py-3 px-0 text-white placeholder-white/30 focus:outline-none focus:border-white/60 transition-colors"
                  placeholder="Your name"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm tracking-wider uppercase text-white/60">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-transparent border-b border-white/20 py-3 px-0 text-white placeholder-white/30 focus:outline-none focus:border-white/60 transition-colors"
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="subject" className="block text-sm tracking-wider uppercase text-white/60">
                  Subject
                </label>
                <input
                  id="subject"
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full bg-transparent border-b border-white/20 py-3 px-0 text-white placeholder-white/30 focus:outline-none focus:border-white/60 transition-colors"
                  placeholder="What's this about?"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="block text-sm tracking-wider uppercase text-white/60">
                  Message
                </label>
                <textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={6}
                  className="w-full bg-transparent border-b border-white/20 py-3 px-0 text-white placeholder-white/30 focus:outline-none focus:border-white/60 transition-colors resize-none"
                  placeholder="Tell me about your project or idea..."
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full md:w-auto px-12 py-4 bg-white text-black tracking-widest uppercase text-sm font-medium hover:bg-white/90 transition-all duration-300 hover:tracking-[0.3em]"
              >
                Send Message
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Alternative Contact Methods */}
      <section className="pb-32 container-wide">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <div className="luxury-divider"></div>
          <h2 className="text-2xl font-serif text-white/80">Or Connect on Social</h2>
          <a
            href="https://www.instagram.com/mrbrandonmills/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 bg-white/5 border border-white/20 hover:bg-white/10 hover:border-white/40 transition-all duration-300 group"
          >
            <Instagram size={24} className="group-hover:scale-110 transition-transform" />
            <span className="tracking-wider text-sm">@MRBRANDONMILLS</span>
          </a>
        </div>
      </section>
    </div>
  )
}
