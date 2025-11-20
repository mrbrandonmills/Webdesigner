'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ScrollReveal from '@/components/scroll-reveal'
import {
  ArrowRight,
  Play,
  X,
  Check,
  Cpu,
  DollarSign,
  Camera,
  Calendar,
  Heart,
  Users,
  FileSearch,
  Leaf,
  GraduationCap,
  TrendingUp,
  UserCheck,
  Code,
  Brain,
  Globe,
  Server,
  Cloud,
  Sparkles
} from 'lucide-react'

// Software project data
const softwareProjects = [
  {
    id: 'jarvis',
    name: 'Jarvis Personal Assistant Pro Suite',
    category: 'Productivity AI',
    description: 'Your complete AI-powered productivity ecosystem. Email management, calendar coordination, task automation, and research assistance.',
    icon: Cpu,
    gradient: 'from-cyan-500/20 via-cyan-600/10 to-blue-500/20',
    accentColor: 'cyan',
    techStack: ['Python', 'TypeScript', 'React', 'FastAPI', 'OpenAI'],
    status: 'Available',
    hasVideo: true,
    link: '/ai-products/jarvis-personal-assistant'
  },
  {
    id: 'financial-planner',
    name: 'AI Financial Planner',
    category: 'FinTech AI',
    description: 'Intelligent financial planning assistant that analyzes your portfolio, forecasts trends, and provides personalized investment strategies.',
    icon: DollarSign,
    gradient: 'from-emerald-500/20 via-green-600/10 to-teal-500/20',
    accentColor: 'emerald',
    techStack: ['Python', 'TensorFlow', 'React', 'PostgreSQL'],
    status: 'Available',
    hasVideo: true,
    link: '/ai-products/ai-financial-planner'
  },
  {
    id: 'photo-studio',
    name: 'AI Photo Studio',
    category: 'Creative AI',
    description: 'Professional photo editing and generation powered by advanced AI. Transform, enhance, and create stunning visuals effortlessly.',
    icon: Camera,
    gradient: 'from-purple-500/20 via-violet-600/10 to-fuchsia-500/20',
    accentColor: 'purple',
    techStack: ['Python', 'Stable Diffusion', 'React', 'Node.js'],
    status: 'Available',
    hasVideo: true,
    link: '/ai-products/ai-photo-studio'
  },
  {
    id: 'appointment-setter',
    name: 'Automated Appointment Setter',
    category: 'Automation',
    description: 'Intelligent scheduling automation that handles bookings, sends reminders, and manages calendar conflicts seamlessly.',
    icon: Calendar,
    gradient: 'from-orange-500/20 via-amber-600/10 to-yellow-500/20',
    accentColor: 'orange',
    techStack: ['TypeScript', 'Next.js', 'Prisma', 'Twilio'],
    status: 'Available',
    hasVideo: false,
    link: '/ai-products/automated-appointment-setter'
  },
  {
    id: 'cancer-detector',
    name: 'Cancer Detector',
    category: 'Medical AI',
    description: 'Advanced medical imaging analysis using deep learning to assist in early cancer detection and diagnosis support.',
    icon: Heart,
    gradient: 'from-red-500/20 via-rose-600/10 to-pink-500/20',
    accentColor: 'red',
    techStack: ['Python', 'PyTorch', 'Computer Vision', 'DICOM'],
    status: 'Custom Build',
    hasVideo: true,
    link: '/ai-products/cancer-detector'
  },
  {
    id: 'lead-scraper',
    name: 'Lead Scraper',
    category: 'Sales AI',
    description: 'Intelligent lead generation tool that discovers and qualifies potential customers from multiple data sources.',
    icon: Users,
    gradient: 'from-blue-500/20 via-indigo-600/10 to-violet-500/20',
    accentColor: 'blue',
    techStack: ['Python', 'Scrapy', 'React', 'PostgreSQL'],
    status: 'Available',
    hasVideo: false,
    link: '/ai-products/lead-scraper'
  },
  {
    id: 'meta-analysis',
    name: 'Meta-Analysis Tool',
    category: 'Research AI',
    description: 'Powerful research aggregation platform that synthesizes data from multiple studies and generates comprehensive analyses.',
    icon: FileSearch,
    gradient: 'from-teal-500/20 via-cyan-600/10 to-sky-500/20',
    accentColor: 'teal',
    techStack: ['Python', 'NLP', 'React', 'ElasticSearch'],
    status: 'Available',
    hasVideo: true,
    link: '/ai-products/meta-analysis-tool'
  },
  {
    id: 'plant-monitor',
    name: 'Plant Monitoring System',
    category: 'IoT AI',
    description: 'Smart plant care system combining IoT sensors with AI to optimize watering, lighting, and nutrient schedules.',
    icon: Leaf,
    gradient: 'from-green-500/20 via-lime-600/10 to-emerald-500/20',
    accentColor: 'green',
    techStack: ['Python', 'Raspberry Pi', 'React Native', 'MQTT'],
    status: 'In Development',
    hasVideo: false,
    link: '/ai-products/plant-monitoring-system'
  },
  {
    id: 'professor-carl',
    name: 'Professor Carl',
    category: 'EdTech AI',
    description: 'AI-powered tutor and educator that adapts to individual learning styles and provides personalized curriculum.',
    icon: GraduationCap,
    gradient: 'from-amber-500/20 via-yellow-600/10 to-orange-500/20',
    accentColor: 'amber',
    techStack: ['Python', 'LangChain', 'React', 'MongoDB'],
    status: 'Available',
    hasVideo: true,
    link: '/ai-products/professor-carl'
  },
  {
    id: 'quantum-trader',
    name: 'Quantum HTC Options Trader',
    category: 'Trading AI',
    description: 'High-frequency trading AI utilizing quantum-inspired algorithms for options market analysis and execution.',
    icon: TrendingUp,
    gradient: 'from-fuchsia-500/20 via-pink-600/10 to-rose-500/20',
    accentColor: 'fuchsia',
    techStack: ['Python', 'Rust', 'TensorFlow', 'Redis'],
    status: 'Custom Build',
    hasVideo: true,
    link: '/ai-products/quantum-htc-options-trader'
  },
  {
    id: 'sales-trainer',
    name: 'Sales Agent Trainer',
    category: 'Training AI',
    description: 'AI-driven sales training platform that simulates customer interactions and provides real-time coaching feedback.',
    icon: UserCheck,
    gradient: 'from-indigo-500/20 via-purple-600/10 to-violet-500/20',
    accentColor: 'indigo',
    techStack: ['TypeScript', 'React', 'OpenAI', 'WebRTC'],
    status: 'Available',
    hasVideo: true,
    link: '/ai-products/sales-agent-trainer'
  }
]

// Tech capabilities data
const techCapabilities = {
  languages: [
    { name: 'Python', level: 95 },
    { name: 'TypeScript', level: 90 },
    { name: 'Rust', level: 75 }
  ],
  ai: [
    { name: 'LLMs & GPT', icon: Brain },
    { name: 'Computer Vision', icon: Camera },
    { name: 'NLP', icon: FileSearch }
  ],
  frontend: [
    { name: 'React', icon: Code },
    { name: 'Next.js', icon: Globe },
    { name: 'Tailwind CSS', icon: Sparkles }
  ],
  backend: [
    { name: 'FastAPI', icon: Server },
    { name: 'Node.js', icon: Globe }
  ],
  infrastructure: [
    { name: 'Vercel', icon: Cloud },
    { name: 'Railway', icon: Server },
    { name: 'AWS', icon: Cloud }
  ]
}

// Budget options
const budgetOptions = [
  { value: '5k-10k', label: '$5,000 - $10,000' },
  { value: '10k-25k', label: '$10,000 - $25,000' },
  { value: '25k-50k', label: '$25,000 - $50,000' },
  { value: '50k+', label: '$50,000+' },
  { value: 'not-sure', label: 'Not sure yet' }
]

// Timeline options
const timelineOptions = [
  { value: 'asap', label: 'As soon as possible' },
  { value: '1-month', label: 'Within 1 month' },
  { value: '1-3-months', label: '1-3 months' },
  { value: '3-6-months', label: '3-6 months' },
  { value: 'flexible', label: 'Flexible' }
]

export default function SoftwareGalleryPage() {
  const [selectedProject, setSelectedProject] = useState<typeof softwareProjects[0] | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    budget: '',
    description: '',
    timeline: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const openInquiryModal = (project: typeof softwareProjects[0]) => {
    setSelectedProject(project)
    setIsModalOpen(true)
    setIsSubmitted(false)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedProject(null)
    setFormData({
      name: '',
      email: '',
      company: '',
      budget: '',
      description: '',
      timeline: ''
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))

    // In production, send to your contact API
    console.log('Inquiry submitted:', {
      project: selectedProject?.name,
      ...formData
    })

    setIsSubmitting(false)
    setIsSubmitted(true)

    // Auto close after success
    setTimeout(() => {
      closeModal()
    }, 3000)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
      case 'In Development':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30'
      case 'Custom Build':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30'
      default:
        return 'bg-white/10 text-white/60 border-white/20'
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative pt-40 pb-24 overflow-hidden">
        {/* Ambient background effects */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-gold/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl"></div>
        </div>

        <div className="container-wide relative z-10">
          <ScrollReveal direction="up">
            <div className="max-w-5xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 px-4 py-2 glass-badge rounded-full mb-8"
              >
                <Code className="w-4 h-4 text-accent-gold" />
                <span className="text-sm tracking-wider uppercase text-accent-gold">Custom AI Solutions</span>
              </motion.div>

              <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif mb-8 leading-tight">
                Software <span className="text-accent-gold">Portfolio</span>
              </h1>

              <p className="text-xl md:text-2xl text-white/60 max-w-3xl mx-auto mb-12 leading-relaxed">
                Bespoke AI solutions engineered for innovation. From intelligent assistants to
                trading algorithms, each project represents cutting-edge technology tailored to
                solve real-world challenges.
              </p>

              {/* Video Demo Reel Placeholder */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="relative max-w-4xl mx-auto aspect-video rounded-2xl overflow-hidden glass-card"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-accent-gold/10 via-transparent to-cyan-500/10"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <button className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-accent-gold/20 border border-accent-gold/40 flex items-center justify-center hover:bg-accent-gold/30 transition-all duration-300 group">
                    <Play className="w-8 h-8 md:w-10 md:h-10 text-accent-gold group-hover:scale-110 transition-transform ml-1" />
                  </button>
                </div>
                <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8">
                  <p className="text-sm text-white/60 uppercase tracking-wider">Demo Reel</p>
                  <p className="text-lg font-serif text-white">Watch AI in Action</p>
                </div>
              </motion.div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-20">
        <div className="container-wide">
          <ScrollReveal direction="up">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-serif mb-4">Featured Projects</h2>
              <p className="text-lg text-white/60 max-w-2xl mx-auto">
                Explore our portfolio of AI-powered solutions designed to transform industries
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {softwareProjects.map((project, index) => (
              <ScrollReveal key={project.id} direction="up" delay={index * 0.05}>
                <motion.div
                  whileHover={{ y: -8 }}
                  className="relative h-full glass-card rounded-2xl overflow-hidden group"
                >
                  {/* Gradient Background with Icon */}
                  <div className={`relative h-48 bg-gradient-to-br ${project.gradient} flex items-center justify-center overflow-hidden`}>
                    <project.icon className="w-16 h-16 text-white/30 group-hover:scale-110 transition-transform duration-500" />

                    {/* Video indicator */}
                    {project.hasVideo && (
                      <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/40 flex items-center justify-center">
                        <Play className="w-4 h-4 text-white" />
                      </div>
                    )}

                    {/* Status badge */}
                    <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(project.status)}`}>
                      {project.status}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 space-y-4">
                    {/* Category */}
                    <span className="text-xs tracking-wider uppercase text-accent-gold">
                      {project.category}
                    </span>

                    {/* Title */}
                    <h3 className="text-xl font-serif leading-tight">
                      {project.name}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-white/60 leading-relaxed line-clamp-3">
                      {project.description}
                    </p>

                    {/* Tech Stack */}
                    <div className="flex flex-wrap gap-2">
                      {project.techStack.slice(0, 3).map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-1 text-xs bg-white/5 border border-white/10 rounded text-white/70"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.techStack.length > 3 && (
                        <span className="px-2 py-1 text-xs bg-white/5 border border-white/10 rounded text-white/50">
                          +{project.techStack.length - 3}
                        </span>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-4 flex flex-col sm:flex-row gap-3">
                      <a
                        href={project.link}
                        className="flex-1 px-4 py-3 text-sm font-medium text-center bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                      >
                        Request Demo
                      </a>
                      <button
                        onClick={() => openInquiryModal(project)}
                        className="flex-1 px-4 py-3 text-sm font-medium text-center bg-accent-gold/10 border border-accent-gold/30 rounded-lg text-accent-gold hover:bg-accent-gold/20 transition-all duration-300"
                      >
                        Inquire Pricing
                      </button>
                    </div>
                  </div>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="py-20 bg-gradient-to-b from-transparent via-white/5 to-transparent">
        <div className="container-wide">
          <ScrollReveal direction="up">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-serif mb-4">Technical Capabilities</h2>
              <p className="text-lg text-white/60 max-w-2xl mx-auto">
                Full-stack expertise spanning languages, frameworks, and cloud infrastructure
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {/* Languages */}
            <ScrollReveal direction="up" delay={0}>
              <div className="glass-card rounded-2xl p-6">
                <h3 className="text-sm tracking-wider uppercase text-accent-gold mb-6">Languages</h3>
                <div className="space-y-4">
                  {techCapabilities.languages.map((lang) => (
                    <div key={lang.name}>
                      <div className="flex justify-between text-sm mb-2">
                        <span>{lang.name}</span>
                        <span className="text-white/40">{lang.level}%</span>
                      </div>
                      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${lang.level}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: 0.3 }}
                          className="h-full bg-gradient-to-r from-accent-gold to-accent-hover rounded-full"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            {/* AI & ML */}
            <ScrollReveal direction="up" delay={0.1}>
              <div className="glass-card rounded-2xl p-6">
                <h3 className="text-sm tracking-wider uppercase text-accent-gold mb-6">AI & ML</h3>
                <div className="space-y-4">
                  {techCapabilities.ai.map((item) => (
                    <div key={item.name} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                      <item.icon className="w-5 h-5 text-cyan-400" />
                      <span className="text-sm">{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            {/* Frontend */}
            <ScrollReveal direction="up" delay={0.2}>
              <div className="glass-card rounded-2xl p-6">
                <h3 className="text-sm tracking-wider uppercase text-accent-gold mb-6">Frontend</h3>
                <div className="space-y-4">
                  {techCapabilities.frontend.map((item) => (
                    <div key={item.name} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                      <item.icon className="w-5 h-5 text-purple-400" />
                      <span className="text-sm">{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            {/* Backend */}
            <ScrollReveal direction="up" delay={0.3}>
              <div className="glass-card rounded-2xl p-6">
                <h3 className="text-sm tracking-wider uppercase text-accent-gold mb-6">Backend</h3>
                <div className="space-y-4">
                  {techCapabilities.backend.map((item) => (
                    <div key={item.name} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                      <item.icon className="w-5 h-5 text-emerald-400" />
                      <span className="text-sm">{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            {/* Infrastructure */}
            <ScrollReveal direction="up" delay={0.4}>
              <div className="glass-card rounded-2xl p-6">
                <h3 className="text-sm tracking-wider uppercase text-accent-gold mb-6">Infrastructure</h3>
                <div className="space-y-4">
                  {techCapabilities.infrastructure.map((item) => (
                    <div key={item.name} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                      <item.icon className="w-5 h-5 text-orange-400" />
                      <span className="text-sm">{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32">
        <div className="container-wide">
          <ScrollReveal direction="up">
            <div className="relative max-w-4xl mx-auto text-center">
              {/* Background glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-accent-gold/10 via-accent-gold/5 to-accent-gold/10 blur-3xl -z-10"></div>

              <div className="glass-card rounded-3xl p-12 md:p-16">
                <Sparkles className="w-12 h-12 text-accent-gold mx-auto mb-6" />
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif mb-6">
                  Let's Build Something <span className="text-accent-gold">Together</span>
                </h2>
                <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-10">
                  Have a project in mind? Let's discuss how AI can transform your business.
                  Every great product starts with a conversation.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <a
                    href="/contact"
                    className="px-8 py-4 bg-accent-gold text-black rounded-full hover:bg-accent-hover transition-all duration-300 font-medium flex items-center gap-2 group"
                  >
                    Start a Conversation
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </a>
                  <a
                    href="mailto:contact@brandonmills.com"
                    className="px-8 py-4 bg-white/5 border border-white/10 text-white rounded-full hover:bg-white/10 hover:border-white/20 transition-all duration-300 font-medium"
                  >
                    Email Directly
                  </a>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Inquiry Modal */}
      <AnimatePresence>
        {isModalOpen && selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={closeModal}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm"></div>

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-lg glass-modal rounded-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors z-10"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Content */}
              <div className="p-8">
                {isSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                  >
                    <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-6">
                      <Check className="w-8 h-8 text-emerald-400" />
                    </div>
                    <h3 className="text-2xl font-serif mb-3">Inquiry Sent</h3>
                    <p className="text-white/60">
                      Thank you for your interest in {selectedProject.name}.
                      We'll be in touch within 24 hours.
                    </p>
                  </motion.div>
                ) : (
                  <>
                    {/* Header */}
                    <div className="mb-8">
                      <span className="text-xs tracking-wider uppercase text-accent-gold">
                        Pricing Inquiry
                      </span>
                      <h3 className="text-2xl font-serif mt-2">{selectedProject.name}</h3>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                      {/* Name */}
                      <div>
                        <label htmlFor="inquiry-name" className="block text-sm text-white/60 mb-2">
                          Name *
                        </label>
                        <input
                          id="inquiry-name"
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full px-4 py-3 glass-input rounded-lg text-white placeholder-white/30 focus:border-accent-gold/50"
                          placeholder="Your name"
                          required
                        />
                      </div>

                      {/* Email */}
                      <div>
                        <label htmlFor="inquiry-email" className="block text-sm text-white/60 mb-2">
                          Email *
                        </label>
                        <input
                          id="inquiry-email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full px-4 py-3 glass-input rounded-lg text-white placeholder-white/30 focus:border-accent-gold/50"
                          placeholder="your@email.com"
                          required
                        />
                      </div>

                      {/* Company */}
                      <div>
                        <label htmlFor="inquiry-company" className="block text-sm text-white/60 mb-2">
                          Company
                        </label>
                        <input
                          id="inquiry-company"
                          type="text"
                          value={formData.company}
                          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                          className="w-full px-4 py-3 glass-input rounded-lg text-white placeholder-white/30 focus:border-accent-gold/50"
                          placeholder="Your company (optional)"
                        />
                      </div>

                      {/* Budget */}
                      <div>
                        <label htmlFor="inquiry-budget" className="block text-sm text-white/60 mb-2">
                          Budget Range *
                        </label>
                        <select
                          id="inquiry-budget"
                          value={formData.budget}
                          onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                          className="w-full px-4 py-3 glass-input rounded-lg text-white bg-transparent appearance-none cursor-pointer"
                          required
                        >
                          <option value="" disabled className="bg-black">Select budget range</option>
                          {budgetOptions.map((option) => (
                            <option key={option.value} value={option.value} className="bg-black">
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Timeline */}
                      <div>
                        <label htmlFor="inquiry-timeline" className="block text-sm text-white/60 mb-2">
                          Preferred Timeline *
                        </label>
                        <select
                          id="inquiry-timeline"
                          value={formData.timeline}
                          onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                          className="w-full px-4 py-3 glass-input rounded-lg text-white bg-transparent appearance-none cursor-pointer"
                          required
                        >
                          <option value="" disabled className="bg-black">Select timeline</option>
                          {timelineOptions.map((option) => (
                            <option key={option.value} value={option.value} className="bg-black">
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Description */}
                      <div>
                        <label htmlFor="inquiry-description" className="block text-sm text-white/60 mb-2">
                          Project Description *
                        </label>
                        <textarea
                          id="inquiry-description"
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          rows={4}
                          className="w-full px-4 py-3 glass-input rounded-lg text-white placeholder-white/30 focus:border-accent-gold/50 resize-none"
                          placeholder="Tell us about your needs and how this solution would help your business..."
                          required
                        />
                      </div>

                      {/* Submit */}
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-4 bg-accent-gold text-black rounded-lg font-medium hover:bg-accent-hover transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {isSubmitting ? (
                          <>
                            <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Sending...
                          </>
                        ) : (
                          'Submit Inquiry'
                        )}
                      </button>
                    </form>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
