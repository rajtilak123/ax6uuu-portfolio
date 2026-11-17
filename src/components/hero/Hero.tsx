import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight, ArrowDown } from 'lucide-react'
import { Container } from '../layout/Container'
import { Button } from '../ui/Button'
import { VideoGallery } from './VideoGallery'
import type { ProjectItem } from '../../data/projects'
import { EASINGS } from '../../lib/animations'

export interface HeroProps {
  onSelectProject: (project: ProjectItem) => void
  isModalOpen?: boolean
  onExploreClick?: () => void
  onContactClick?: () => void
}

export const Hero: React.FC<HeroProps> = ({
  onSelectProject,
  isModalOpen,
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
    <section className="relative w-full bg-[#F9F9FB] overflow-hidden">
      {/* Restrained Ambient Tint (Extremely subtle, no loud blobs) */}
      <div
        className="absolute top-0 right-1/4 w-[500px] h-[300px] pointer-events-none opacity-30"
        style={{
          background:
            'radial-gradient(circle, rgba(38, 59, 255, 0.06) 0%, rgba(249, 249, 251, 0) 70%)',
        }}
        aria-hidden="true"
      />

      {/* Screen 1: Hero Opening Viewport (Exclusively about the Hero) */}
      <div className="relative w-full pt-18 sm:pt-20">
        <Container>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="min-h-[calc(100vh-4.5rem)] sm:min-h-[calc(100vh-5rem)] min-h-[calc(100svh-4.5rem)] sm:min-h-[calc(100svh-5rem)] flex flex-col justify-center py-10 sm:py-14"
          >
            {/* Headline Block with Clear Stack Hierarchy */}
            <div className="flex flex-col gap-5 sm:gap-6 max-w-5xl py-6 sm:py-8">
              <motion.h1
                variants={itemVariants}
                className="font-display text-[clamp(2.5rem,5.7vw,5.125rem)] leading-[1.06] tracking-[-0.03em] font-bold text-[#0E0F14]"
              >
                Turning raw footage <br />
                into <span className="text-electric">clean edits.</span>
              </motion.h1>

              <motion.p
                variants={itemVariants}
                className="font-body text-[17px] sm:text-[19px] lg:text-[22px] text-[#5E606E] font-normal leading-relaxed max-w-2xl pt-1"
              >
                I craft engaging visual stories through thoughtful editing, precise pacing and cinematic detail.
              </motion.p>

              <motion.div
                variants={itemVariants}
                className="flex items-center gap-3.5 pt-2 sm:pt-3"
              >
                <Button
                  variant="solid"
                  size="lg"
                  href="#contact"
                  onClick={onContactClick}
                  rightIcon={<ArrowUpRight className="w-4.5 h-4.5" />}
                >
                  Start a Project
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  href="#work"
                  rightIcon={<ArrowDown className="w-4.5 h-4.5" />}
                >
                  View Works
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </Container>
      </div>

      {/* Screen 2+: Featured Video Gallery (Short-Form & Long-Form Presentation) */}
      <div
        id="work"
        className="relative w-full pt-8 sm:pt-12 lg:pt-14 pb-18 sm:pb-24 lg:pb-28 scroll-mt-20 sm:scroll-mt-24"
      >
        <Container>
          <VideoGallery onSelectProject={onSelectProject} isModalOpen={isModalOpen} />
        </Container>
      </div>
    </section>
  )
}

export default Hero
