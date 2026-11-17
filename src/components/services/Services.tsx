import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight, Play } from 'lucide-react'
import { Container } from '../layout/Container'
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
      initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{
        duration: 0.55,
        delay: shouldReduceMotion ? 0 : index * 0.08,
        ease: EASINGS.cinematic,
      }}
      className="group relative block py-5 sm:py-6 lg:py-6 px-3.5 sm:px-4 -mx-3.5 sm:-mx-4 border-b border-black/[0.14] transition-all duration-250 hover:bg-white hover:border-black/25 hover:shadow-[0_4px_16px_rgba(0,0,0,0.035)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric rounded-xl cursor-pointer"
      aria-label={`Inquire about ${service.title}`}
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4 lg:gap-8 items-start">
        {/* Column 1: Title */}
        <div className="md:col-span-4 flex items-center justify-between gap-3 pr-2">
          <h3 className="font-display text-lg sm:text-xl font-semibold tracking-tight text-[#0E0F14] group-hover:text-electric transition-colors duration-200">
            {service.title}
          </h3>
          <div className="md:hidden w-7 h-7 rounded-full border border-black/10 flex items-center justify-center text-[#5E606E] group-hover:border-electric group-hover:bg-electric/10 group-hover:text-electric transition-all duration-200 shrink-0">
            <ArrowUpRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Column 2: Description */}
        <div className="md:col-span-5 pt-0.5">
          <p className="font-body text-xs sm:text-sm text-[#5E606E] leading-relaxed">
            {service.description}
          </p>
        </div>

        {/* Column 3: Quiet Capability Tags + Desktop Arrow Indicator */}
        <div className="md:col-span-3 flex items-start justify-between gap-3 pt-0.5">
          <div className="flex flex-wrap gap-1.5">
            {service.capabilities.map((capability) => (
              <span
                key={capability}
                className="inline-flex items-center px-2 py-0.5 rounded-[4px] bg-black/[0.03] border border-black/[0.08] text-[11px] font-mono text-[#5E606E] group-hover:text-[#0E0F14] transition-colors select-none"
              >
                {capability}
              </span>
            ))}
          </div>

          <div className="hidden md:flex w-7 h-7 rounded-full border border-black/15 items-center justify-center text-[#8E909E] group-hover:border-electric group-hover:bg-electric/10 group-hover:text-electric transition-all duration-200 shrink-0 mt-0.5">
            <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
        </div>
      </div>
    </motion.a>
  )
}

export const Services: React.FC<ServicesProps> = ({ onSelectProject }) => {
  const shouldReduceMotion = useReducedMotion()
  const featuredProject = HERO_PROJECTS[0]

  return (
    <section
      id="services"
      className="relative w-full py-16 sm:py-20 lg:py-24 bg-[#F9F9FB] border-t border-black/[0.14] overflow-hidden"
    >
      <Container>
        <div className="flex flex-col">
          {/* Two-Column Editorial Introduction: Left (Heading & Story) × Right (Cinematic Frame Visual) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left Column (7 Cols on desktop): Expressive Headline + Supporting Copy */}
            <div className="lg:col-span-7 flex flex-col gap-3.5 sm:gap-4.5">
              {/* Main Section Heading */}
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
                Editing that makes <br />
                <span className="text-electric">every second count.</span>
              </motion.h2>

              {/* Supporting Text */}
              <motion.p
                initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.65,
                  delay: shouldReduceMotion ? 0 : 0.16,
                  ease: EASINGS.cinematic,
                }}
                className="font-body text-base sm:text-lg text-[#5E606E] leading-relaxed max-w-xl"
              >
                From the first cut to the final frame, I focus on creating videos that hold attention, establish pacing, and communicate the story with clarity.
              </motion.p>
            </div>

            {/* Right Column (5 Cols on desktop): Cinematic Frame Visual */}
            <motion.div
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 24, scale: 0.98 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.7,
                delay: shouldReduceMotion ? 0 : 0.2,
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
                className="group relative w-full aspect-[16/10] sm:aspect-[16/9] lg:aspect-[16/10] rounded-2xl overflow-hidden bg-[#14161F] border border-black/[0.16] shadow-[0_6px_28px_rgba(0,0,0,0.06)] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric transition-all duration-300 hover:border-electric hover:shadow-[0_16px_40px_rgba(38,59,255,0.18)] hover:-translate-y-0.5"
              >
                {/* Actual Frame / Thumbnail from Verified Project */}
                <img
                  src={featuredProject.thumbnailUrl}
                  alt={`Frame from ${featuredProject.title}`}
                  className="w-full h-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
                  loading="lazy"
                  decoding="async"
                />

                {/* Subtle Center Action Indicator */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-11 h-11 rounded-full bg-[#0E0F14]/80 backdrop-blur-md text-white border border-white/20 flex items-center justify-center opacity-85 group-hover:opacity-100 group-hover:scale-110 group-hover:bg-electric transition-all duration-300 shadow-md">
                    <Play className="w-4 h-4 fill-white translate-x-0.5" />
                  </div>
                </div>

                {/* Bottom Action Bar */}
                <div className="absolute bottom-0 inset-x-0 p-3.5 sm:p-4 bg-gradient-to-t from-[#0E0F14]/90 via-[#0E0F14]/40 to-transparent flex items-center justify-end pointer-events-none select-none text-[11px] font-mono text-white/90">
                  <span className="flex items-center gap-1 text-white group-hover:text-electric-light transition-colors tracking-wider uppercase font-medium">
                    <span>VIEW PROJECT</span>
                    <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Editorial Ledger Header Strip */}
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55, ease: EASINGS.cinematic }}
            className="mt-10 sm:mt-12 lg:mt-14 pb-3.5 border-b border-black/[0.14] select-none"
          >
            <span className="font-mono text-xs font-semibold uppercase tracking-widest text-[#0E0F14]">
              Editing Disciplines
            </span>
          </motion.div>

          {/* Services Connected Ledger */}
          <div className="flex flex-col">
            {SERVICES.map((service, index) => (
              <ServiceRow key={service.id} service={service} index={index} />
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}

export default Services
