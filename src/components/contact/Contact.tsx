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
      className="relative w-full pt-8 pb-10 sm:pt-9 sm:pb-12 lg:pt-10 lg:pb-14 bg-[#F9F9FB] border-t border-black/[0.06] overflow-hidden"
    >
      <Container>
        <div className="flex flex-col gap-10 sm:gap-12 lg:gap-16">
          {/* Top Block: Section Index + Expressive Monumental Headlines */}
          <div className="flex flex-col gap-4 sm:gap-5 max-w-5xl">
            {/* Monospace Section Tag */}
            <motion.div
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.55, ease: EASINGS.cinematic }}
              className="flex items-center gap-2.5 text-xs font-mono select-none"
            >
              <span className="font-semibold text-electric tracking-widest uppercase">
                04
              </span>
              <span className="text-black/20">/</span>
              <span className="text-[#5E606E] tracking-widest uppercase">
                The Final Frame
              </span>
            </motion.div>

            {/* Main Primary Headline */}
            <motion.h2
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.7,
                delay: shouldReduceMotion ? 0 : 0.1,
                ease: EASINGS.cinematic,
              }}
              className="font-display text-[clamp(2.5rem,6.5vw,5.5rem)] leading-[0.98] tracking-[-0.035em] font-medium text-[#0E0F14]"
            >
              Every great edit <br />
              starts with a conversation.
            </motion.h2>

            {/* Second Headline with Restrained Electric Blue Emphasis */}
            <motion.p
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.7,
                delay: shouldReduceMotion ? 0 : 0.22,
                ease: EASINGS.cinematic,
              }}
              className="font-display text-[clamp(1.5rem,3.5vw,2.75rem)] leading-[1.1] tracking-[-0.025em] font-normal text-[#5E606E]"
            >
              Let's create{' '}
              <span className="text-electric font-medium">
                something worth watching.
              </span>
            </motion.p>
          </div>

          {/* Interactive Contact Channels: Four Large Horizontal Editorial Links */}
          <div className="w-full flex flex-col border-t border-black/[0.08]">
            {channels.map((channel, index) => (
              <motion.a
                key={channel.id}
                href={channel.isDemo ? undefined : channel.href}
                target={!channel.isDemo && channel.id !== 'email' ? '_blank' : undefined}
                rel={!channel.isDemo && channel.id !== 'email' ? 'noopener noreferrer' : undefined}
                onClick={(e) => {
                  if (channel.isDemo) {
                    e.preventDefault()
                  }
                }}
                role={channel.isDemo ? 'button' : undefined}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (channel.isDemo && (e.key === 'Enter' || e.key === ' ')) {
                    e.preventDefault()
                  }
                }}
                initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{
                  duration: 0.65,
                  delay: shouldReduceMotion ? 0 : index * 0.12,
                  ease: EASINGS.cinematic,
                }}
                className="group relative flex items-center justify-between py-6 sm:py-8 lg:py-9 border-b border-black/[0.08] hover:border-black/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric transition-colors duration-200 cursor-pointer"
                aria-label={`${channel.number} ${channel.name}: ${channel.detail}${channel.isDemo ? ' (Demo Preview)' : ''}`}
              >
                {/* Left Block: Channel Number + Channel Name + Contact Detail */}
                <div className="flex flex-col md:flex-row md:items-baseline gap-1.5 md:gap-6 lg:gap-8 pr-4">
                  <div className="flex items-baseline gap-3 sm:gap-4">
                    <span className="font-mono text-sm sm:text-base font-semibold text-electric tracking-widest select-none">
                      {channel.number} —
                    </span>
                    <span className="font-display text-2xl sm:text-3xl lg:text-4xl font-medium tracking-tight text-[#0E0F14] group-hover:text-electric transition-colors duration-200">
                      {channel.name}
                    </span>
                  </div>

                  {/* Prominent Contact Detail */}
                  <div className="flex items-center gap-2 pl-7 md:pl-0">
                    <span className="hidden md:inline-block text-black/20 select-none">/</span>
                    <span className="font-mono text-sm sm:text-base lg:text-lg text-[#5E606E] group-hover:text-[#0E0F14] transition-colors duration-200">
                      {channel.detail}
                    </span>
                  </div>
                </div>

                {/* Right Block: Large Smooth Arrow Indicator */}
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-black/10 flex items-center justify-center text-[#5E606E] group-hover:border-electric group-hover:bg-electric group-hover:text-white transition-all duration-300 shrink-0 ml-4">
                  <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-1" />
                </div>
              </motion.a>
            ))}
          </div>

          {/* Minimal Editorial Footer */}
          <motion.footer
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{
              duration: 0.6,
              delay: shouldReduceMotion ? 0 : 0.2,
              ease: EASINGS.cinematic,
            }}
            className="pt-6 sm:pt-8 border-t border-black/[0.08] flex items-center justify-between text-xs font-mono text-[#8E909E] select-none"
          >
            {/* Left: Copyright */}
            <span>© {new Date().getFullYear()} AX6UUU</span>

            {/* Right: Designed with Intention + Back to Top */}
            <div className="flex items-center gap-4 sm:gap-6">
              <span className="tracking-widest uppercase text-[11px] sm:text-xs">
                DESIGNED WITH INTENTION.
              </span>
              <button
                type="button"
                onClick={scrollToTop}
                className="hidden sm:inline-flex items-center justify-center w-8 h-8 -mr-1.5 text-[#5E606E] hover:text-[#0E0F14] hover:bg-black/5 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric rounded-[4px]"
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
