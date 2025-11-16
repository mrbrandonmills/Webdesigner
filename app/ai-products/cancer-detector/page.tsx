'use client'

import { motion } from 'framer-motion'
import ScrollReveal from '@/components/scroll-reveal'
import {
  ArrowRight,
  Check,
  Activity,
  Shield,
  FileSearch,
  Brain,
  AlertCircle,
  Clock,
  Award,
  Database,
  TrendingUp,
  Users,
  Microscope,
  HeartPulse,
  PlayCircle,
} from 'lucide-react'
import Link from 'next/link'

export default function CancerDetectorPage() {
  const features = [
    {
      icon: Brain,
      title: 'Deep Learning Detection',
      description:
        'State-of-the-art convolutional neural networks trained on millions of medical images to identify potential abnormalities with high accuracy.',
    },
    {
      icon: FileSearch,
      title: 'Multi-Modality Analysis',
      description:
        'Processes CT scans, MRIs, X-rays, and histopathology images with specialized models for each imaging type.',
    },
    {
      icon: Clock,
      title: 'Rapid Analysis',
      description:
        'Generate preliminary analysis reports in seconds, dramatically reducing waiting times for initial screening results.',
    },
    {
      icon: Database,
      title: 'Continual Learning',
      description:
        'AI models continuously improve through federated learning while maintaining patient privacy and data security.',
    },
    {
      icon: TrendingUp,
      title: 'Sensitivity & Specificity Metrics',
      description:
        'Transparent performance metrics with sensitivity rates of 94.7% and specificity of 91.3% across validation datasets.',
    },
    {
      icon: Shield,
      title: 'HIPAA Compliant',
      description:
        'Enterprise-grade security with end-to-end encryption, secure data handling, and full compliance with healthcare regulations.',
    },
  ]

  const useCases = [
    {
      title: 'Radiology Departments',
      description:
        'Assist radiologists in identifying suspicious lesions, tumors, and abnormalities in medical imaging, reducing interpretation time and improving diagnostic accuracy.',
      icon: Microscope,
      benefits: [
        '40% reduction in reading time',
        'Second opinion validation',
        'Priority case flagging',
        'Reduced false negatives',
      ],
    },
    {
      title: 'Cancer Screening Programs',
      description:
        'Enhance population-level screening initiatives with AI-powered preliminary analysis, enabling early detection at scale.',
      icon: Users,
      benefits: [
        'Increased screening capacity',
        'Earlier detection rates',
        'Cost-effective scaling',
        'Consistent quality',
      ],
    },
    {
      title: 'Research Institutions',
      description:
        'Accelerate cancer research with automated image analysis, biomarker discovery, and treatment response monitoring.',
      icon: Activity,
      benefits: [
        'Large-scale data analysis',
        'Biomarker identification',
        'Treatment efficacy tracking',
        'Clinical trial support',
      ],
    },
  ]

  const pricingTiers = [
    {
      id: 'research',
      name: 'Research',
      price: '499',
      period: 'per month',
      description: 'For academic and research institutions',
      features: [
        '500 image analyses per month',
        'All cancer types',
        'Basic API access',
        'Email support',
        'Usage analytics',
        'Research license',
      ],
      cta: 'Contact Research Team',
      highlighted: false,
    },
    {
      id: 'clinical',
      name: 'Clinical',
      price: '2,499',
      period: 'per month',
      description: 'For hospitals and diagnostic centers',
      features: [
        '5,000 image analyses per month',
        'Priority processing',
        'Advanced API & PACS integration',
        'Dedicated support team',
        'Clinical validation reports',
        'Quality assurance dashboard',
        'HIPAA compliance package',
        'Customizable workflows',
      ],
      cta: 'Request Clinical Demo',
      highlighted: true,
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 'Custom',
      period: 'contact for pricing',
      description: 'For healthcare systems and networks',
      features: [
        'Unlimited analyses',
        'Multi-site deployment',
        'Custom model training',
        'On-premise hosting option',
        'White-label solution',
        'Dedicated infrastructure',
        '24/7 technical support',
        'SLA guarantee (99.9% uptime)',
        'Regulatory compliance assistance',
      ],
      cta: 'Contact Enterprise Sales',
      highlighted: false,
    },
  ]

  const technicalHighlights = [
    {
      title: 'ResNet-152 Architecture',
      description: 'Deep residual networks optimized for medical imaging analysis',
    },
    {
      title: '3.2M+ Training Images',
      description: 'Diverse dataset across demographics and cancer types',
    },
    {
      title: 'Sub-5 Second Processing',
      description: 'GPU-accelerated inference for real-time clinical use',
    },
    {
      title: 'Explainable AI',
      description: 'Attention maps showing areas of concern for physician review',
    },
  ]

  const cancerTypes = [
    'Lung Cancer',
    'Breast Cancer',
    'Colorectal Cancer',
    'Prostate Cancer',
    'Skin Cancer (Melanoma)',
    'Brain Tumors',
    'Liver Cancer',
    'Pancreatic Cancer',
    'Lymphoma',
    'Leukemia',
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Medical Disclaimer Banner */}
      <div className="bg-red-900/20 border-b border-red-500/30">
        <div className="container-wide py-3">
          <div className="flex items-center gap-2 text-sm text-red-300">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <p>
              <strong>Medical Disclaimer:</strong> This AI system is designed to assist healthcare
              professionals and is not a substitute for professional medical diagnosis. All results
              must be reviewed and validated by licensed medical practitioners.
            </p>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-600/10 via-black to-black"></div>

        <div className="container-wide relative z-10">
          <ScrollReveal direction="up">
            <div className="max-w-4xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 border border-blue-500/30 rounded-full mb-6"
              >
                <HeartPulse className="w-4 h-4 text-blue-400" />
                <span className="text-sm tracking-wider uppercase text-blue-400">
                  Medical AI Technology
                </span>
              </motion.div>

              <h1 className="text-5xl md:text-7xl font-serif mb-6 bg-gradient-to-r from-white via-blue-200 to-white/60 bg-clip-text text-transparent">
                Cancer Detector
              </h1>

              <p className="text-xl md:text-2xl text-white/70 mb-8 leading-relaxed">
                AI-powered medical imaging analysis that assists healthcare professionals in early
                cancer detection. Combining deep learning with clinical expertise to save lives.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button className="px-8 py-4 bg-accent-gold text-black rounded-full hover:bg-accent-hover transition-all duration-300 font-medium flex items-center gap-2 group">
                  Request Clinical Demo
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="px-8 py-4 bg-white/5 border border-white/10 text-white rounded-full hover:bg-white/10 hover:border-blue-500/30 transition-all duration-300 font-medium flex items-center gap-2">
                  <PlayCircle className="w-5 h-5" />
                  Watch Technology Overview
                </button>
              </div>

              <div className="mt-12 flex items-center justify-center gap-8 text-sm text-white/60 flex-wrap">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-accent-gold" />
                  <span>FDA Cleared Class II Device</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-accent-gold" />
                  <span>94.7% Sensitivity Rate</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-accent-gold" />
                  <span>HIPAA Compliant</span>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Visual representation */}
        <ScrollReveal direction="up" delay={0.2}>
          <div className="container-wide mt-16 relative z-10">
            <div className="max-w-6xl mx-auto">
              <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                <div className="aspect-video bg-gradient-to-br from-blue-600/20 via-white/5 to-cyan-500/20 flex items-center justify-center">
                  <div className="text-center p-8">
                    <Microscope className="w-20 h-20 text-white/40 mx-auto mb-4" />
                    <p className="text-white/60 text-lg mb-2">AI Analysis Dashboard</p>
                    <p className="text-white/40 text-sm max-w-md mx-auto">
                      Real-time image analysis with attention heatmaps, confidence scores, and
                      clinical decision support
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gradient-to-b from-black to-white/5">
        <div className="container-wide">
          <ScrollReveal direction="up">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-serif mb-4">How It Works</h2>
              <p className="text-xl text-white/60 max-w-2xl mx-auto">
                Advanced AI technology designed to augment, not replace, the expertise of healthcare
                professionals.
              </p>
            </div>
          </ScrollReveal>

          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                {
                  step: '01',
                  title: 'Image Upload',
                  description: 'Securely upload medical images via PACS integration or web interface',
                },
                {
                  step: '02',
                  title: 'AI Analysis',
                  description: 'Deep learning models analyze images for suspicious regions',
                },
                {
                  step: '03',
                  title: 'Report Generation',
                  description: 'Detailed report with findings, confidence scores, and visualizations',
                },
                {
                  step: '04',
                  title: 'Clinical Review',
                  description: 'Physician validates AI findings and makes final diagnosis',
                },
              ].map((item, index) => (
                <ScrollReveal key={index} direction="up" delay={index * 0.1}>
                  <div className="text-center">
                    <div className="text-5xl font-serif text-accent-gold/30 mb-4">{item.step}</div>
                    <h3 className="text-xl font-medium mb-2">{item.title}</h3>
                    <p className="text-sm text-white/60">{item.description}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-20">
        <div className="container-wide">
          <ScrollReveal direction="up">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-serif mb-4">
                Clinical-Grade AI Technology
              </h2>
              <p className="text-xl text-white/60 max-w-2xl mx-auto">
                Built on rigorous clinical validation and designed for seamless integration into
                existing healthcare workflows.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <ScrollReveal key={index} direction="up" delay={index * 0.1}>
                <motion.div
                  whileHover={{ y: -5 }}
                  className="p-8 bg-white/5 border border-white/10 rounded-2xl hover:border-blue-500/30 transition-all duration-300"
                >
                  <div className="w-14 h-14 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4">
                    <feature.icon className="w-7 h-7 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-serif mb-3">{feature.title}</h3>
                  <p className="text-white/60 leading-relaxed">{feature.description}</p>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Cancer Types Coverage */}
      <section className="py-20 bg-white/5">
        <div className="container-wide">
          <ScrollReveal direction="up">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-serif mb-4">Cancer Types Supported</h2>
              <p className="text-xl text-white/60 max-w-2xl mx-auto">
                Specialized models trained for accurate detection across multiple cancer types.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="up">
            <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {cancerTypes.map((type, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  viewport={{ once: true }}
                  className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-center hover:border-blue-500/30 transition-all duration-300"
                >
                  <span className="text-sm text-white/80">{type}</span>
                </motion.div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20">
        <div className="container-wide">
          <ScrollReveal direction="up">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-serif mb-4">Clinical Applications</h2>
              <p className="text-xl text-white/60 max-w-2xl mx-auto">
                Designed for diverse healthcare settings, from research labs to busy hospital
                departments.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {useCases.map((useCase, index) => (
              <ScrollReveal key={index} direction="up" delay={index * 0.1}>
                <div className="p-8 bg-gradient-to-br from-white/5 to-transparent border border-white/10 rounded-2xl">
                  <div className="w-14 h-14 bg-accent-gold/20 rounded-xl flex items-center justify-center mb-4">
                    <useCase.icon className="w-7 h-7 text-accent-gold" />
                  </div>
                  <h3 className="text-2xl font-serif mb-4">{useCase.title}</h3>
                  <p className="text-white/70 mb-6 leading-relaxed">{useCase.description}</p>
                  <ul className="space-y-2">
                    {useCase.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-white/60">
                        <Check className="w-4 h-4 text-blue-400" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-gradient-to-b from-white/5 to-black">
        <div className="container-wide">
          <ScrollReveal direction="up">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-serif mb-4">Licensing Options</h2>
              <p className="text-xl text-white/60 max-w-2xl mx-auto">
                Flexible licensing models for healthcare organizations of all sizes.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {pricingTiers.map((tier, index) => (
              <ScrollReveal key={tier.id} direction="up" delay={index * 0.1}>
                <motion.div
                  whileHover={{ y: -8 }}
                  className={`relative p-8 rounded-2xl border ${
                    tier.highlighted
                      ? 'bg-gradient-to-br from-blue-500/20 to-blue-500/5 border-blue-500'
                      : 'bg-white/5 border-white/10'
                  } transition-all duration-300`}
                >
                  {tier.highlighted && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-blue-500 text-white text-sm font-medium rounded-full">
                      Most Popular
                    </div>
                  )}

                  <div className="mb-6">
                    <h3 className="text-2xl font-serif mb-2">{tier.name}</h3>
                    <p className="text-white/60 text-sm mb-4">{tier.description}</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-bold text-accent-gold">
                        {tier.price !== 'Custom' ? '$' : ''}
                        {tier.price}
                      </span>
                      <span className="text-white/60">/{tier.period}</span>
                    </div>
                  </div>

                  <ul className="space-y-4 mb-8">
                    {tier.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                        <span className="text-white/80">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    className={`w-full py-4 rounded-full font-medium transition-all duration-300 ${
                      tier.highlighted
                        ? 'bg-accent-gold text-black hover:bg-accent-hover'
                        : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
                    }`}
                  >
                    {tier.cta}
                  </button>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Technical Highlights */}
      <section className="py-20">
        <div className="container-wide">
          <ScrollReveal direction="up">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-serif mb-4">Technical Excellence</h2>
              <p className="text-xl text-white/60 max-w-2xl mx-auto">
                Built on cutting-edge deep learning research with rigorous clinical validation.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {technicalHighlights.map((tech, index) => (
              <ScrollReveal key={index} direction="up" delay={index * 0.1}>
                <div className="p-6 bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-500/30 rounded-xl">
                  <h3 className="text-lg font-medium mb-2 text-blue-400">{tech.title}</h3>
                  <p className="text-sm text-white/70">{tech.description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-blue-600/10 to-black">
        <div className="container-wide">
          <ScrollReveal direction="up">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl md:text-5xl font-serif mb-6">
                Advance Your Diagnostic Capabilities
              </h2>
              <p className="text-xl text-white/70 mb-8">
                Join leading healthcare institutions using AI to improve patient outcomes. Schedule a
                personalized demo to see Cancer Detector in action.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button className="px-8 py-4 bg-accent-gold text-black rounded-full hover:bg-accent-hover transition-all duration-300 font-medium flex items-center gap-2 group">
                  Request Clinical Demo
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <Link href="/contact">
                  <button className="px-8 py-4 bg-white/5 border border-white/10 text-white rounded-full hover:bg-white/10 hover:border-blue-500/30 transition-all duration-300 font-medium">
                    Contact Medical Team
                  </button>
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  )
}
