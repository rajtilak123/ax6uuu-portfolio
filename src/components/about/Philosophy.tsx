import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { EASINGS } from '../../lib/animations'

interface PhilosophyItem {
  number: string
  title: string
  statement: string
}

const PHILOSOPHIES: PhilosophyItem[] = [
  {
    number: '01',
    title: 'STORY FIRST',
    statement: 'Every edit should have a reason to exist.',
  },
  {
    number: '02',
    title: 'RHYTHM MATTERS',
    statement: 'Good pacing makes people feel something.',
  },
  {
    number: '03',
    title: 'DETAILS DEFINE THE CUT',
    statement: 'Sound, timing and transitions deserve attention.',
  },
]

export const Philosophy: React.FC = () => {
  const shouldReduceMotion = useReducedMotion()

  return (
    <div className="w-full flex flex-col gap-6 sm:gap-8">
      {/* Editorial Header Strip */}
      <motion.div
        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.55, ease: EASINGS.cinematic }}
        className="flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 border-b border-black/[0.08] gap-2 select-none"
      >
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs font-medium uppercase tracking-widest text-[#0E0F14]">
            Editing Philosophy
          </span>
          <span className="font-mono text-xs text-[#8E909E] tracking-wider">
            (01—03)
          </span>
        </div>

        <div className="text-xs font-mono text-[#8E909E] tracking-wider uppercase">
          Core Principles of Every Cut
        </div>
      </motion.div>

      {/* 3-Column Editorial Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
        {PHILOSOPHIES.map((item, index) => (
          <motion.div
            key={item.number}
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{
              duration: 0.65,
              delay: shouldReduceMotion ? 0 : index * 0.14,
              ease: EASINGS.cinematic,
            }}
            className="group flex flex-col pt-5 sm:pt-6 border-t border-black/[0.08] hover:border-electric transition-colors duration-300"
          >
            {/* Index Number */}
            <span className="font-mono text-xs font-semibold text-electric tracking-widest uppercase select-none">
              {item.number} —
            </span>

            {/* Principle Title */}
            <h3 className="font-display text-lg sm:text-xl font-medium text-[#0E0F14] tracking-tight mt-2.5 mb-2">
              {item.title}
            </h3>

            {/* Principle Statement */}
            <p className="font-body text-[#5E606E] text-sm sm:text-base leading-relaxed">
              {item.statement}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default Philosophy
