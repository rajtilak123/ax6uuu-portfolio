import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, Film } from 'lucide-react'
import { Container } from '../layout/Container'
import { FREE_SAMPLE_WHATSAPP_URL } from '../../data/contact'
import { HERO_PROJECTS } from '../../data/projects'
import { EASINGS } from '../../lib/animations'

export const FreeSampleCta: React.FC = () => {
  const shouldReduceMotion = useReducedMotion()

  const frameLeft = HERO_PROJECTS[0]
  const frameRight = HERO_PROJECTS[1]

  return (
    <section className="relative w-full py-16 sm:py-20 lg:py-24 bg-[#F9F9FB] overflow-hidden border-t border-black/[0.06]">
      <Container>
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.75, ease: EASINGS.cinematic }}
          className="relative w-full rounded-3xl sm:rounded-[36px] bg-[#0A0C12] text-white p-8 sm:p-12 lg:p-16 overflow-hidden border border-white/10 shadow-[0_24px_64px_rgba(0,0,0,0.22)]"
        >
          {/* Luminous Animated Accent Line Across Top Border */}
          {!shouldReduceMotion && (
            <motion.div
              className="absolute top-0 left-0 w-48 h-[1.5px] bg-gradient-to-r from-transparent via-electric to-transparent pointer-events-none"
              animate={{ x: ['-100%', '800%'] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
              aria-hidden="true"
            />
          )}

          {/* Ambient Radial Depth Glow */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] pointer-events-none opacity-25 filter blur-3xl"
            style={{
              background:
                'radial-gradient(ellipse at center, rgba(38, 59, 255, 0.45) 0%, transparent 70%)',
            }}
            aria-hidden="true"
          />

          {/* Background Layer: Slow Floating Cropped Frames from Actual Works */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
            {/* Left Frame: Tilted Portrait Card Preview */}
            <motion.div
              animate={
                shouldReduceMotion
                  ? {}
                  : {
                      y: [0, -12, 0],
                      rotate: [-6, -4, -6],
                    }
              }
              transition={{
                duration: 7,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="hidden lg:block absolute -left-6 top-1/2 -translate-y-1/2 w-48 aspect-[9/16] rounded-2xl overflow-hidden border border-white/10 shadow-2xl opacity-25 filter grayscale contrast-125"
            >
              <img
                src={frameLeft.thumbnailUrl}
                alt=""
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-[#0A0C12]/40" />
            </motion.div>

            {/* Right Frame: Tilted Portrait Card Preview */}
            <motion.div
              animate={
                shouldReduceMotion
                  ? {}
                  : {
                      y: [0, 12, 0],
                      rotate: [6, 4, 6],
                    }
              }
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="hidden lg:block absolute -right-6 top-1/2 -translate-y-1/2 w-48 aspect-[9/16] rounded-2xl overflow-hidden border border-white/10 shadow-2xl opacity-25 filter grayscale contrast-125"
            >
              <img
                src={frameRight.thumbnailUrl}
                alt=""
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-[#0A0C12]/40" />
            </motion.div>
          </div>

          {/* Central Campaign Content */}
          <div className="relative z-10 flex flex-col items-center text-center max-w-2xl mx-auto">
            {/* Editorial Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.08] border border-white/12 text-white/80 font-mono text-xs select-none mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-electric animate-pulse" />
              <span>FREE SAMPLE WORKFLOW</span>
              <span className="text-white/30">•</span>
              <span className="text-electric-light">RISK-FREE</span>
            </div>

            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-white leading-[1.12]">
              Ready To Make Your Next Video More Engaging?
            </h2>

            <p className="font-body text-sm sm:text-base md:text-lg text-white/70 max-w-xl mx-auto mt-4 sm:mt-5 mb-8 sm:mb-10 leading-relaxed">
              Try a free sample edit and see how your footage can become something worth watching.
            </p>

            {/* Central White Pill Button */}
            <a
              href={FREE_SAMPLE_WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-8 sm:px-10 py-3.5 sm:py-4 rounded-full bg-white text-[#0E0F14] hover:bg-white/95 transition-all duration-200 font-display text-sm sm:text-base font-semibold shadow-[0_4px_24px_rgba(255,255,255,0.2)] hover:shadow-[0_8px_36px_rgba(255,255,255,0.35)] hover:scale-[1.02] active:scale-[0.98] group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <Film className="w-4 h-4 text-electric" />
              <span>Start With One Video</span>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-200 group-hover:translate-x-1" />
            </a>

            {/* Supporting Micro-copy */}
            <p className="font-mono text-xs sm:text-sm text-white/50 mt-4 sm:mt-5 tracking-wide select-none">
              Let's create something worth watching.
            </p>
          </div>
        </motion.div>
      </Container>
    </section>
  )
}

export default FreeSampleCta
