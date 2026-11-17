import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight, ArrowUp } from 'lucide-react'
import { Container } from '../layout/Container'
import { getEditorialContactChannels } from '../../data/contact'
import { EASINGS } from '../../lib/animations'

export const Contact: React.FC = () => {
  const shouldReduceMotion = useReducedMotion()
  const channels = getEditorialContactChannels()

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <section
      id="contact"
      className="relative w-full pt-6 pb-12 sm:pt-8 sm:pb-14 lg:pt-10 lg:pb-16 scroll-mt-20 sm:scroll-mt-24 bg-[#F9F9FB] border-t border-black/[0.06] overflow-hidden"
    >
      <Container>
        <div className="flex flex-col gap-8 sm:gap-12 lg:gap-14">
          {/* Main 2-Column Editorial Grid: Left (40%) × Right (60%) */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 lg:gap-16 items-start">
            {/* Left Column (~40%): Contact Introduction */}
            <div className="md:col-span-5 flex flex-col gap-4 sm:gap-5">
              {/* Monospace Section Tag */}
              <motion.div
                initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, ease: EASINGS.cinematic }}
                className="flex items-center gap-2.5 text-xs font-mono select-none"
              >
                <span className="font-semibold text-electric tracking-widest uppercase">
                  04
                </span>
                <span className="text-black/20">/</span>
                <span className="text-[#5E606E] tracking-widest uppercase">
                  THE FINAL FRAME
                </span>
              </motion.div>

              {/* Controlled Editorial Heading */}
              <motion.h2
                initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.65,
                  delay: shouldReduceMotion ? 0 : 0.08,
                  ease: EASINGS.cinematic,
                }}
                className="font-display text-3xl sm:text-4xl lg:text-[2.75rem] leading-[1.12] tracking-[-0.025em] font-semibold text-[#0E0F14]"
              >
                Let's make something <br className="hidden sm:inline" />
                <span className="text-electric">worth watching.</span>
              </motion.h2>

              {/* Supporting Copy */}
              <motion.p
                initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.65,
                  delay: shouldReduceMotion ? 0 : 0.16,
                  ease: EASINGS.cinematic,
                }}
                className="font-body text-base sm:text-lg leading-relaxed text-[#5E606E] max-w-md"
              >
                Have a video in mind? Tell me about it. Let's create something memorable.
              </motion.p>

              {/* Availability Indicator */}
              <motion.div
                initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.5,
                  delay: shouldReduceMotion ? 0 : 0.24,
                  ease: EASINGS.cinematic,
                }}
                className="pt-2 flex items-center gap-2.5 text-xs font-mono text-[#5E606E]"
              >
                <span className="w-2 h-2 rounded-full bg-electric animate-pulse" />
                <span className="tracking-widest uppercase font-medium">AVAILABLE FOR PROJECTS</span>
              </motion.div>
            </div>

            {/* Right Column (~60%): 3 Elegant Horizontal Contact Rows */}
            <div className="md:col-span-7 flex flex-col border-t border-black/[0.08]">
              {channels.map((channel, index) => (
                <motion.a
                  key={channel.id}
                  href={channel.href}
                  target={channel.external ? '_blank' : undefined}
                  rel={channel.external ? 'noopener noreferrer' : undefined}
                  initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{
                    duration: 0.55,
                    delay: shouldReduceMotion ? 0 : index * 0.08,
                    ease: EASINGS.cinematic,
                  }}
                  className="group relative flex items-center justify-between py-5 sm:py-6 border-b border-black/[0.08] hover:border-black/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric transition-all duration-250 cursor-pointer"
                  aria-label={`${channel.number} ${channel.name}: ${channel.detail}`}
                >
                  {/* Left: Number + Channel Name + Contact Detail */}
                  <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-6 lg:gap-8 pr-4 min-w-0 transition-transform duration-250 group-hover:translate-x-1">
                    <div className="flex items-baseline gap-3 shrink-0">
                      <span className="font-mono text-xs sm:text-sm font-semibold text-electric tracking-widest select-none">
                        {channel.number} —
                      </span>
                      <span className="font-display text-lg sm:text-xl font-medium tracking-tight text-[#0E0F14] group-hover:text-electric transition-colors duration-250">
                        {channel.name}
                      </span>
                    </div>

                    {/* Contact Detail with safe wrapping on mobile */}
                    <div className="flex items-center gap-2 pl-6 sm:pl-0 min-w-0">
                      <span className="hidden sm:inline-block text-black/20 select-none">/</span>
                      <span className="font-mono text-xs sm:text-sm text-[#5E606E] group-hover:text-[#0E0F14] transition-colors duration-250 break-all sm:break-normal">
                        {channel.detail}
                      </span>
                    </div>
                  </div>

                  {/* Right: Minimal Circular Arrow Icon */}
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-black/10 flex items-center justify-center text-[#5E606E] group-hover:border-electric group-hover:bg-electric/10 group-hover:text-electric transition-all duration-250 shrink-0 ml-4">
                    <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-250 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </motion.a>
              ))}
            </div>
          </div>

          {/* Minimal Editorial Footer */}
          <motion.footer
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{
              duration: 0.5,
              delay: shouldReduceMotion ? 0 : 0.15,
              ease: EASINGS.cinematic,
            }}
            className="pt-6 sm:pt-8 border-t border-black/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#8E909E] select-none"
          >
            {/* Left: Copyright */}
            <span>© {new Date().getFullYear()} ax6uuu</span>

            {/* Right: Designed with Intention + Back to Top */}
            <div className="flex items-center gap-4 sm:gap-6">
              <span className="tracking-widest uppercase text-[10px] sm:text-xs">
                DESIGNED WITH INTENTION.
              </span>
              <button
                type="button"
                onClick={scrollToTop}
                className="inline-flex items-center justify-center w-8 h-8 -mr-1.5 text-[#5E606E] hover:text-[#0E0F14] hover:bg-black/5 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric rounded-[4px]"
                aria-label="Back to top of page"
              >
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.footer>
        </div>
      </Container>
    </section>
  )
}

export default Contact
