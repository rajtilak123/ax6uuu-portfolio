import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight, ArrowDown } from 'lucide-react'
import { Container } from '../layout/Container'
import { Button } from '../ui/Button'
import { Badge } from '../ui/Badge'
import { VideoGallery } from './VideoGallery'
import type { ProjectItem } from '../../data/projects'
import { EASINGS } from '../../lib/animations'

export interface HeroProps {
  onSelectProject: (project: ProjectItem) => void
  onExploreClick?: () => void
  onContactClick?: () => void
}

export const Hero: React.FC<HeroProps> = ({
  onSelectProject,
  onContactClick,
}) => {
  const shouldReduceMotion = useReducedMotion()

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.08,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.75,
        ease: EASINGS.cinematic,
      },
    },
  }

  return (
    <section className="relative w-full pt-8 pb-16 sm:pt-12 sm:pb-24 lg:pt-16 lg:pb-32 bg-[#F9F9FB] overflow-hidden">
      {/* Restrained Ambient Tint (Extremely subtle, no loud blobs) */}
      <div
        className="absolute top-0 right-1/4 w-[500px] h-[300px] pointer-events-none opacity-30"
        style={{
          background:
            'radial-gradient(circle, rgba(38, 59, 255, 0.06) 0%, rgba(249, 249, 251, 0) 70%)',
        }}
        aria-hidden="true"
      />

      <Container>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-10 sm:gap-14 lg:gap-16"
        >
          {/* Top Meta Bar: Availability + Editorial Coordinates */}
          <motion.div
            variants={itemVariants}
            className="flex items-center justify-between border-b border-black/[0.08] pb-4 text-xs font-mono select-none"
          >
            <Badge
              variant="default"
              dot
              dotColor="electric"
              className="text-[#0E0F14] text-[11px]"
            >
              Available for Projects
            </Badge>

            <div className="hidden sm:flex items-center gap-3 text-[#5E606E] text-[11px] tracking-widest uppercase">
              <span>ASHUTOSH SAHU</span>
              <span className="text-black/20">&bull;</span>
              <span>CINEMATIC EDITORIAL</span>
              <span className="text-black/20">&bull;</span>
              <span className="text-electric font-medium">2026</span>
            </div>
          </motion.div>

          {/* Monumental Editorial Headline Block */}
          <div className="flex flex-col gap-6 sm:gap-8 max-w-5xl">
            <motion.h1
              variants={itemVariants}
              className="font-display text-[clamp(2.75rem,7vw,6.5rem)] leading-[0.96] tracking-[-0.035em] font-medium text-[#0E0F14]"
            >
              Turning raw footage <br />
              into <span className="text-electric">clean edits.</span>
            </motion.h1>

            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pt-2">
              <motion.p
                variants={itemVariants}
                className="font-body text-base sm:text-lg lg:text-xl text-[#5E606E] font-normal leading-relaxed max-w-2xl"
              >
                I craft engaging visual stories through thoughtful editing, precise pacing and cinematic detail.
              </motion.p>

              <motion.div
                variants={itemVariants}
                className="flex items-center gap-3 shrink-0"
              >
                <Button
                  variant="solid"
                  size="md"
                  href="#contact"
                  onClick={onContactClick}
                  rightIcon={<ArrowUpRight className="w-4 h-4" />}
                >
                  Start a Project
                </Button>
                <Button
                  variant="secondary"
                  size="md"
                  href="#work"
                  rightIcon={<ArrowDown className="w-4 h-4" />}
                >
                  View Works
                </Button>
              </motion.div>
            </div>
          </div>

          {/* Featured Video Gallery (Editorial 4-Card Presentation) */}
          <motion.div variants={itemVariants} id="work">
            <VideoGallery onSelectProject={onSelectProject} />
          </motion.div>
        </motion.div>
      </Container>
    </section>
  )
}

export default Hero
