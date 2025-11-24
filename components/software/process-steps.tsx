'use client'

import { motion } from 'framer-motion'

interface ProcessStep {
  number: string
  title: string
  description: string
  code?: string
}

const steps: ProcessStep[] = [
  {
    number: '01',
    title: 'Research & Discovery',
    description: 'Deep dive into your business model, target audience, and competitive landscape. We analyze data patterns to uncover opportunities for digital transformation.',
    code: `const insights = await analyze({
  market: 'e-commerce',
  competitors: fetchCompetitors(),
  audience: segmentUsers()
});`,
  },
  {
    number: '02',
    title: 'Architecture & Design',
    description: 'Crafting scalable systems with performance-first principles. Every component designed for speed, security, and seamless user experience.',
    code: `export const architecture = {
  frontend: 'Next.js 14',
  backend: 'TypeScript',
  database: 'PostgreSQL',
  hosting: 'Vercel Edge'
};`,
  },
  {
    number: '03',
    title: 'Development & Testing',
    description: 'Precision engineering with 60fps animations, sub-second load times, and pixel-perfect responsiveness across all devices.',
    code: `test('performance', async () => {
  const metrics = await lighthouse();
  expect(metrics.performance).toBeGreaterThan(95);
  expect(metrics.accessibility).toBe(100);
});`,
  },
  {
    number: '04',
    title: 'Deploy & Optimize',
    description: 'Launch with confidence using CI/CD pipelines, edge caching, and real-time monitoring. Continuous optimization based on analytics.',
    code: `deploy({
  platform: 'vercel',
  regions: 'global',
  cdn: 'enabled',
  monitoring: 'sentry'
});`,
  },
]

export function ProcessSteps() {
  return (
    <div className="space-y-32 max-w-7xl mx-auto px-6">
      {steps.map((step, index) => (
        <motion.div
          key={step.number}
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, delay: index * 0.1 }}
          className={`grid grid-cols-1 lg:grid-cols-2 gap-16 items-center ${
            index % 2 === 1 ? 'lg:grid-flow-dense' : ''
          }`}
        >
          {/* Content */}
          <div className={`space-y-6 ${index % 2 === 1 ? 'lg:col-start-2' : ''}`}>
            <div className="flex items-baseline gap-6">
              <span className="font-mono text-6xl font-bold text-orange-500">
                {step.number}
              </span>
              <h3 className="font-serif text-4xl font-light text-white">
                {step.title}
              </h3>
            </div>
            <p className="text-lg text-gray-400 leading-relaxed">
              {step.description}
            </p>
          </div>

          {/* Code Block */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className={`bg-zinc-900/50 backdrop-blur-sm border border-white/10 p-8 ${
              index % 2 === 1 ? 'lg:col-start-1' : ''
            }`}
          >
            <pre className="text-sm text-gray-300 font-mono leading-relaxed overflow-x-auto">
              <code>{step.code}</code>
            </pre>
          </motion.div>
        </motion.div>
      ))}
    </div>
  )
}
