import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowUp } from 'lucide-react'
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
      className="relative w-full pt-8 pb-12 sm:pt-10 sm:pb-14 lg:pt-12 lg:pb-16 scroll-mt-20 sm:scroll-mt-24 bg-[#F9F9FB] border-t border-black/[0.06] overflow-hidden"
    >
      <Container>
        <div className="flex flex-col gap-8 sm:gap-12 lg:gap-14">
          {/* Main 2-Column Editorial Grid: Left (40%) × Right (60%) */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 lg:gap-16 items-start">
            {/* Left Column (~40%): Contact Introduction */}
            <div className="md:col-span-5 flex flex-col gap-4 sm:gap-5">
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
            </div>

            {/* Right Column (~60%): 3 Clean Minimal Contact Rows */}
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
                  className="group relative flex items-center justify-between py-5 sm:py-6 border-b border-black/[0.08] hover:border-black/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric transition-colors duration-250 cursor-pointer"
                  aria-label={`${channel.name}: ${channel.detail}`}
                >
                  {/* Channel Name + Contact Detail */}
                  <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-6 lg:gap-8 min-w-0 transition-transform duration-250 group-hover:translate-x-1">
                    <span className="font-display text-lg sm:text-xl font-medium tracking-tight text-[#0E0F14] group-hover:text-electric transition-colors duration-250 shrink-0">
                      {channel.name}
                    </span>

                    {/* Contact Detail */}
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="hidden sm:inline-block text-black/20 select-none">/</span>
                      <span className="font-mono text-xs sm:text-sm text-[#5E606E] group-hover:text-[#0E0F14] transition-colors duration-250 break-all sm:break-normal">
                        {channel.detail}
                      </span>
                    </div>
                  </div>
                </motion.a>
              ))}
            </div>
          </div>

          {/* Minimal Clean Footer Strip with Back to Top */}
          <motion.footer
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{
              duration: 0.5,
              delay: shouldReduceMotion ? 0 : 0.15,
              ease: EASINGS.cinematic,
            }}
            className="pt-6 sm:pt-8 border-t border-black/[0.08] flex items-center justify-end select-none"
          >
            <button
              type="button"
              onClick={scrollToTop}
              className="inline-flex items-center gap-2 py-1.5 px-3 text-xs font-mono text-[#5E606E] hover:text-[#0E0F14] hover:bg-black/5 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric rounded-[4px]"
              aria-label="Back to top of page"
            >
              <span>Back to top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </motion.footer>
        </div>
      </Container>
    </section>
  )
}

export default Contact
