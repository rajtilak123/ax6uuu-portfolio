import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Wordmark } from '../brand/Wordmark'
import { EASINGS } from '../../lib/animations'

export const AboutVisual: React.FC = () => {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.div
      initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 24, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.75,
        delay: shouldReduceMotion ? 0 : 0.25,
        ease: EASINGS.cinematic,
      }}
      className="group relative w-full aspect-[4/5] sm:aspect-[3/4] lg:aspect-[4/5] rounded-2xl overflow-hidden bg-[#0E0F14] text-white border border-black/10 shadow-[0_12px_36px_rgba(0,0,0,0.06)] flex flex-col justify-between p-6 sm:p-8 lg:p-9 select-none"
    >
      {/* Subtle Restrained Ambient Light (Top Right) */}
      <div
        className="absolute top-0 right-0 w-64 h-64 rounded-full pointer-events-none opacity-15 filter blur-3xl transition-opacity duration-700 group-hover:opacity-25"
        style={{
          background: 'radial-gradient(circle, rgba(38, 59, 255, 0.4) 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />

      {/* Abstract Framing Corner Ticks (Graphic Design Crop Marks) */}
      <div className="absolute top-4 left-4 w-3 h-3 border-t border-l border-white/20 pointer-events-none" />
      <div className="absolute top-4 right-4 w-3 h-3 border-t border-r border-white/20 pointer-events-none" />
      <div className="absolute bottom-4 left-4 w-3 h-3 border-b border-l border-white/20 pointer-events-none" />
      <div className="absolute bottom-4 right-4 w-3 h-3 border-b border-r border-white/20 pointer-events-none" />

      {/* Subtle Center Graphic Crosshair */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none text-white/[0.08] font-mono text-xs"
        aria-hidden="true"
      >
        +
      </div>

      {/* Top Bar: Editorial Identification */}
      <div className="relative z-10 flex items-center justify-between border-b border-white/10 pb-4 text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-electric" />
          <span className="text-white/80 tracking-widest uppercase text-[11px]">
            AX6UUU
          </span>
        </div>

        <span className="text-white/50 text-[10px] tracking-widest uppercase">
          IDENT // 02
        </span>
      </div>

      {/* Center Focus: Art-Directed AX6UUU Wordmark */}
      <div className="relative z-10 my-auto flex flex-col items-center justify-center gap-4 py-8 text-center">
        {/* Central Wordmark Showcase */}
        <div className="relative px-2 py-4">
          <Wordmark
            variant="white"
            size="xl"
            className="opacity-95 transition-transform duration-500 ease-out group-hover:scale-105"
          />
        </div>

        {/* Minimal Graphic Divider with Center Electric Blue Node */}
        <div className="w-16 h-px bg-white/15 relative my-1">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-electric rounded-full" />
        </div>

        {/* Brand Tagline in Restrained Editorial Typography */}
        <p className="font-display text-xs sm:text-sm font-normal tracking-wide text-white/70 max-w-[240px] leading-relaxed">
          Turning raw footage into <span className="text-electric">clean edits.</span>
        </p>
      </div>

      {/* Bottom Bar: Artist Credit */}
      <div className="relative z-10 border-t border-white/10 pt-4 flex items-center justify-between text-xs font-mono">
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-medium text-white tracking-wide">
            ASHUTOSH SAHU
          </span>
        </div>

        <div className="flex flex-col items-end text-right">
          <span className="text-xs text-white/60 tracking-wider uppercase">
            VIDEO EDITOR
          </span>
        </div>
      </div>
    </motion.div>
  )
}

export default AboutVisual
