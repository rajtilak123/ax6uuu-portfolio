import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight, Play } from 'lucide-react'
import { Container } from '../layout/Container'
import { Button } from '../ui/Button'
import { SERVICES, type ServiceItem } from '../../data/services'
import { HERO_PROJECTS, type ProjectItem } from '../../data/projects'
import { EASINGS } from '../../lib/animations'

export interface ServicesProps {
  onSelectProject?: (project: ProjectItem) => void
}

interface ServiceRowProps {
  service: ServiceItem
  index: number
}

const ServiceRow: React.FC<ServiceRowProps> = ({ service, index }) => {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.a
      href="#contact"
      initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{
        duration: 0.65,
        delay: shouldReduceMotion ? 0 : index * 0.12,
        ease: EASINGS.cinematic,
      }}
      className="group relative block py-5 sm:py-6 lg:py-6.5 px-3 sm:px-4 -mx-3 sm:-mx-4 border-b border-black/[0.08] transition-colors duration-200 hover:bg-black/[0.015] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric rounded-lg"
      aria-label={`Inquire about ${service.title}`}
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 lg:gap-6 items-start">
        {/* Column 1: Number & Index */}
        <div className="md:col-span-1 flex items-center md:items-start gap-2 pt-0.5 select-none">
          <span className="font-mono text-xs sm:text-sm font-semibold text-electric tracking-widest">
            {service.number}
          </span>
          <span className="font-mono text-xs text-black/20 md:hidden">/</span>
        </div>

        {/* Column 2: Title + Interactive Action Arrow */}
        <div className="md:col-span-5 lg:col-span-4 flex flex-col">
          <div className="flex items-start justify-between gap-3 pr-2">
            <h3 className="font-display text-xl sm:text-2xl font-medium tracking-tight text-[#0E0F14] group-hover:text-electric transition-colors duration-200">
              {service.title}
            </h3>

            {/* Restrained action indicator that responds on hover */}
            <div className="w-7 h-7 rounded-full border border-black/10 flex items-center justify-center text-[#5E606E] group-hover:border-electric group-hover:bg-electric group-hover:text-white transition-all duration-200 shrink-0 mt-0.5">
              <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
          </div>
        </div>

        {/* Column 3: Readable Description */}
        <div className="md:col-span-6 lg:col-span-3 pt-0.5">
          <p className="font-body text-sm text-[#5E606E] leading-relaxed">
            {service.description}
          </p>
        </div>

        {/* Column 4: Capabilities Arranged as Compact Text Labels */}
        <div className="md:col-span-12 lg:col-span-4 pt-0.5">
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {service.capabilities.map((capability, capIdx) => (
              <motion.span
                key={capability}
                initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{
                  duration: 0.45,
                  delay: shouldReduceMotion ? 0 : index * 0.12 + capIdx * 0.04,
                  ease: EASINGS.cinematic,
                }}
                className="inline-flex items-center px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-[4px] bg-black/[0.03] border border-black/[0.06] text-xs font-mono text-[#0E0F14]/85 group-hover:border-black/15 group-hover:bg-white group-hover:shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-all duration-200"
              >
                {capability}
              </motion.span>
            ))}
          </div>
        </div>
      </div>
    </motion.a>
  )
}

export const Services: React.FC<ServicesProps> = ({ onSelectProject }) => {
  const shouldReduceMotion = useReducedMotion()

  // Select Project 04 (landscape footage) as the preferred featured frame
  const featuredProject =
    HERO_PROJECTS.find((p) => p.id === 'project-04') || HERO_PROJECTS[0]

  return (
    <section
      id="services"
      className="relative w-full pt-8 pb-12 sm:pt-9 sm:pb-16 lg:pt-10 lg:pb-20 bg-[#F9F9FB] border-t border-black/[0.06] overflow-hidden"
    >
      <Container>
        <div className="flex flex-col">
          {/* Two-Column Editorial Introduction: Left (Heading & Story) × Right (Cinematic Frame Visual) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column (7 Cols on desktop): Section Index + Expressive Headline + Supporting Copy */}
            <div className="lg:col-span-7 flex flex-col gap-4 sm:gap-5">
              {/* Monospace Section Tag */}
              <motion.div
                initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.55, ease: EASINGS.cinematic }}
                className="flex items-center gap-2.5 text-xs font-mono select-none"
              >
                <span className="font-semibold text-electric tracking-widest uppercase">
                  03
                </span>
                <span className="text-black/20">/</span>
                <span className="text-[#5E606E] tracking-widest uppercase">
                  What I Do
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
                Editing that makes <br />
                <span className="text-electric">every second count.</span>
              </motion.h2>

              {/* Supporting Text */}
              <motion.p
                initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.7,
                  delay: shouldReduceMotion ? 0 : 0.2,
                  ease: EASINGS.cinematic,
                }}
                className="font-body text-base sm:text-lg font-normal text-[#5E606E] leading-relaxed max-w-2xl"
              >
                From the first cut to the final frame, I focus on creating videos that hold attention and communicate the story clearly.
              </motion.p>
            </div>

            {/* Right Column (5 Cols on desktop): Cinematic Frame Visual */}
            <motion.div
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 24, scale: 0.98 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.75,
                delay: shouldReduceMotion ? 0 : 0.25,
                ease: EASINGS.cinematic,
              }}
              className="lg:col-span-5 w-full"
            >
              <div
                role="button"
                tabIndex={0}
                onClick={() => onSelectProject?.(featuredProject)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    onSelectProject?.(featuredProject)
                  }
                }}
                aria-label={`View ${featuredProject.title} project`}
                className="group relative w-full aspect-[16/10] sm:aspect-[16/9] lg:aspect-[16/10] rounded-xl sm:rounded-2xl overflow-hidden bg-[#14161F] border border-black/[0.08] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric transition-all duration-300 hover:border-electric hover:shadow-[0_8px_24px_rgba(38,59,255,0.12)]"
              >
                {/* Actual Frame / Thumbnail from Verified Project 04 */}
                <img
                  src={featuredProject.thumbnailUrl}
                  alt={`Frame from ${featuredProject.title}`}
                  className="w-full h-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
                  loading="lazy"
                  decoding="async"
                />

                {/* Top Overlay Badge */}
                <div className="absolute top-3 left-3 sm:top-3.5 sm:left-3.5 z-10 flex items-center gap-1.5 px-2 py-0.5 rounded-[4px] bg-[#0E0F14]/75 backdrop-blur-md text-[10px] font-mono text-white/90 uppercase border border-white/10 pointer-events-none select-none">
                  <span className="w-1.5 h-1.5 rounded-full bg-electric" />
                  <span>{featuredProject.index} // Selected Work</span>
                </div>

                {/* Subtle Center Action Indicator */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-10 h-10 rounded-full bg-[#0E0F14]/80 backdrop-blur-md text-white border border-white/20 flex items-center justify-center opacity-85 group-hover:opacity-100 group-hover:scale-105 group-hover:bg-electric transition-all duration-300 shadow-md">
                    <Play className="w-4 h-4 fill-white translate-x-0.5" />
                  </div>
                </div>

                {/* Bottom Caption & Action Bar */}
                <div className="absolute bottom-0 inset-x-0 p-3 sm:p-3.5 bg-gradient-to-t from-[#0E0F14]/90 via-[#0E0F14]/50 to-transparent flex items-center justify-between pointer-events-none select-none text-[10px] sm:text-[11px] font-mono text-white/90">
                  <span className="tracking-widest uppercase text-white/75">
                    A FRAME FROM THE WORKS
                  </span>

                  <span className="flex items-center gap-1 text-white/90 group-hover:text-white transition-colors tracking-wider uppercase font-medium">
                    <span>VIEW PROJECT</span>
                    <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Editorial Ledger Header Strip (Brought closer to introduction) */}
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55, ease: EASINGS.cinematic }}
            className="mt-8 sm:mt-10 lg:mt-12 flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-black/[0.08] gap-2 select-none"
          >
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs font-medium uppercase tracking-widest text-[#0E0F14]">
                Editing Disciplines
              </span>
              <span className="font-mono text-xs text-[#8E909E] tracking-wider">
                (01—03)
              </span>
            </div>

            <div className="text-xs font-mono text-[#8E909E] tracking-wider uppercase">
              Core Capabilities & Disciplines
            </div>
          </motion.div>

          {/* Services Connected Ledger */}
          <div className="flex flex-col">
            {SERVICES.map((service, index) => (
              <ServiceRow key={service.id} service={service} index={index} />
            ))}
          </div>

          {/* Closing CTA */}
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease: EASINGS.cinematic }}
            className="mt-8 sm:mt-10 lg:mt-12"
          >
            <div className="rounded-2xl bg-[#F2F3F7] border border-black/[0.06] p-6 sm:p-8 lg:p-9 flex flex-col md:flex-row md:items-center justify-between gap-6 lg:gap-8">
              <div className="flex flex-col gap-2.5 max-w-2xl">
                <div className="flex items-center gap-2 text-xs font-mono text-[#8E909E] tracking-widest uppercase select-none">
                  <span className="w-1.5 h-1.5 rounded-full bg-electric" />
                  <span>HAVE SOMETHING IN MIND?</span>
                </div>

                <h3 className="font-display text-xl sm:text-2xl lg:text-3xl text-[#0E0F14] font-medium tracking-tight leading-snug">
                  Let's turn your next idea into{' '}
                  <span className="text-electric">something worth watching.</span>
                </h3>
              </div>

              <div className="shrink-0">
                <Button
                  variant="solid"
                  size="md"
                  href="#contact"
                  rightIcon={
                    <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  }
                  className="group"
                >
                  Start a Project
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  )
}

export default Services
