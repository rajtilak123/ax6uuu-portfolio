import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Container } from '../layout/Container'
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

export const About: React.FC = () => {
  const shouldReduceMotion = useReducedMotion()

  return (
    <section
      id="about"
      className="relative w-full pt-16 pb-16 sm:pt-20 sm:pb-20 lg:pt-24 lg:pb-20 bg-[#F9F9FB] border-t border-black/[0.06] overflow-hidden"
    >
      <Container>
        <div className="flex flex-col gap-12 sm:gap-14 lg:gap-16">
          {/* Editorial Two-Column Header & Bio Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
            {/* Left Column (5 Cols): Tag + Strong Heading */}
            <div className="lg:col-span-5 flex flex-col gap-3.5 sm:gap-4.5">
              <motion.div
                initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, ease: EASINGS.cinematic }}
                className="flex items-center gap-2.5 text-xs font-mono select-none"
              >
                <span className="font-semibold text-electric tracking-widest uppercase">
                  02
                </span>
                <span className="text-black/20">/</span>
                <span className="text-[#5E606E] tracking-widest uppercase">
                  A Little About Me
                </span>
              </motion.div>

              <motion.h2
                initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.65,
                  delay: shouldReduceMotion ? 0 : 0.08,
                  ease: EASINGS.cinematic,
                }}
                className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-[#0E0F14] leading-[1.08]"
              >
                More than just <br />
                <span className="text-electric">making videos.</span>
              </motion.h2>
            </div>

            {/* Right Column (7 Cols): The Introduction Story */}
            <div className="lg:col-span-7 flex flex-col gap-5 sm:gap-6 max-w-2xl">
              <motion.p
                initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.6,
                  delay: shouldReduceMotion ? 0 : 0.1,
                  ease: EASINGS.cinematic,
                }}
                className="font-body text-xl sm:text-2xl font-medium text-[#0E0F14] leading-relaxed tracking-tight"
              >
                I'm Ashutosh Sahu, a video editor who enjoys turning ordinary footage into something worth watching.
              </motion.p>

              <motion.p
                initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.6,
                  delay: shouldReduceMotion ? 0 : 0.18,
                  ease: EASINGS.cinematic,
                }}
                className="font-body text-base sm:text-lg text-[#5E606E] leading-relaxed"
              >
                For me, editing is not just about cutting clips together. It's about understanding the story, finding the right rhythm, and making every frame feel intentional.
              </motion.p>

              <motion.p
                initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.6,
                  delay: shouldReduceMotion ? 0 : 0.26,
                  ease: EASINGS.cinematic,
                }}
                className="font-body text-base sm:text-lg text-[#5E606E] leading-relaxed"
              >
                Whether it's a short-form video or a longer visual story, I focus on pacing, sound, detail and the little things that make an edit memorable.
              </motion.p>
            </div>
          </div>

          {/* Integrated Editing Philosophy: 3 Refined Numbered Editorial Panels */}
          <div className="pt-8 sm:pt-10 border-t border-black/[0.08]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 gap-2 select-none">
              <span className="font-mono text-xs font-semibold text-electric uppercase tracking-widest">
                Editing Philosophy
              </span>
              <span className="font-mono text-xs text-[#8E909E] tracking-wider uppercase">
                Core Principles of Every Cut (01—03)
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {PHILOSOPHIES.map((item, index) => (
                <motion.div
                  key={item.number}
                  initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{
                    duration: 0.6,
                    delay: shouldReduceMotion ? 0 : index * 0.12,
                    ease: EASINGS.cinematic,
                  }}
                  className="group p-5 sm:p-6 rounded-2xl bg-white border border-black/[0.08] hover:border-electric/50 transition-all duration-300 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-[0_6px_20px_rgba(38,59,255,0.06)] hover:-translate-y-0.5 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-mono text-xs font-semibold text-electric tracking-widest uppercase">
                        {item.number} —
                      </span>
                      <span className="w-1.5 h-1.5 rounded-full bg-electric/25 group-hover:bg-electric transition-colors" />
                    </div>
                    <h3 className="font-display text-base sm:text-lg font-semibold tracking-tight text-[#0E0F14] mb-1.5 group-hover:text-electric transition-colors duration-200">
                      {item.title}
                    </h3>
                    <p className="font-body text-xs sm:text-sm text-[#5E606E] leading-relaxed">
                      {item.statement}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}

export default About
