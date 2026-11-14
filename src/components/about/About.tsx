import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Container } from '../layout/Container'
import { AboutVisual } from './AboutVisual'
import { Philosophy } from './Philosophy'
import { EASINGS } from '../../lib/animations'

export const About: React.FC = () => {
  const shouldReduceMotion = useReducedMotion()

  return (
    <section
      id="about"
      className="relative w-full pt-16 pb-8 sm:pt-20 sm:pb-9 lg:pt-24 lg:pb-10 bg-[#F9F9FB] border-t border-black/[0.06] overflow-hidden"
    >
      <Container>
        <div className="flex flex-col gap-12 sm:gap-16 lg:gap-20">
          {/* Top Block: Section Index + Expressive Headline */}
          <div className="flex flex-col gap-4 sm:gap-5 max-w-3xl">
            {/* Monospace Section Tag */}
            <motion.div
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.55, ease: EASINGS.cinematic }}
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

            {/* Main Section Heading */}
            <motion.h2
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.7,
                delay: shouldReduceMotion ? 0 : 0.1,
                ease: EASINGS.cinematic,
              }}
              className="font-display text-[clamp(2.25rem,5vw,4.25rem)] leading-[1] tracking-[-0.035em] font-medium text-[#0E0F14]"
            >
              More than just <br />
              <span className="text-electric">making videos.</span>
            </motion.h2>
          </div>

          {/* Asymmetric 2-Column Content Grid: Personal Introduction & Brand Visual */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            {/* Left Column: Personal Story (7 Cols on desktop) - Sequentially revealed */}
            <div className="lg:col-span-7 flex flex-col gap-5 sm:gap-6 max-w-xl">
              {/* Paragraph 1 */}
              <motion.p
                initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.65,
                  delay: shouldReduceMotion ? 0 : 0.1,
                  ease: EASINGS.cinematic,
                }}
                className="font-body text-base sm:text-lg font-normal text-[#0E0F14] leading-relaxed"
              >
                I'm Ashutosh Sahu, a video editor who enjoys turning ordinary footage into something worth watching.
              </motion.p>

              {/* Paragraph 2 */}
              <motion.p
                initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.65,
                  delay: shouldReduceMotion ? 0 : 0.22,
                  ease: EASINGS.cinematic,
                }}
                className="font-body text-base sm:text-lg font-normal text-[#5E606E] leading-relaxed"
              >
                For me, editing is not just about cutting clips together. It's about understanding the story, finding the right rhythm, and making every frame feel intentional.
              </motion.p>

              {/* Paragraph 3 */}
              <motion.p
                initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.65,
                  delay: shouldReduceMotion ? 0 : 0.34,
                  ease: EASINGS.cinematic,
                }}
                className="font-body text-base sm:text-lg font-normal text-[#5E606E] leading-relaxed"
              >
                Whether it's a short-form video or a longer visual story, I focus on pacing, sound, detail and the little things that make an edit memorable.
              </motion.p>
            </div>

            {/* Right Column: Brand Visual Identity Piece (5 Cols on desktop) */}
            <div className="lg:col-span-5 w-full">
              <AboutVisual />
            </div>
          </div>

          {/* Editing Philosophy (3-Column Typographic Principles) */}
          <Philosophy />

          {/* Closing Statement (Editorial Pull-Quote Manifesto) */}
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease: EASINGS.cinematic }}
            className="pt-10 sm:pt-12 border-t border-black/[0.08] flex flex-col gap-4 sm:gap-5"
          >
            <div className="flex items-center gap-2 text-xs font-mono text-[#8E909E] tracking-widest uppercase select-none">
              <span>03</span>
              <span className="text-black/20">/</span>
              <span>Statement</span>
            </div>

            <blockquote className="font-display text-2xl sm:text-3xl lg:text-4xl text-[#0E0F14] font-medium tracking-tight leading-snug max-w-3xl">
              "Every frame has a purpose. <br className="hidden sm:inline" />
              <span className="text-electric">I make sure it feels that way."</span>
            </blockquote>

            <div className="flex items-center gap-3 pt-1 text-xs font-mono text-[#8E909E] tracking-widest uppercase select-none">
              <span className="w-5 h-px bg-black/20" />
              <span>Ashutosh Sahu</span>
              <span className="text-black/20">•</span>
              <span>Video Editor</span>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  )
}

export default About
