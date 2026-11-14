import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ExternalLink } from 'lucide-react'
import type { ProjectItem } from '../../data/projects'
import { EASINGS } from '../../lib/animations'

export interface VideoModalProps {
  project: ProjectItem | null
  isOpen: boolean
  onClose: () => void
}

interface VideoModalContentProps {
  project: ProjectItem
  onClose: () => void
}

const VideoModalContent: React.FC<VideoModalContentProps> = ({
  project,
  onClose,
}) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)

  // Detect whether the video has landscape (16:9) or portrait (9:16) aspect ratio
  const isLandscape = project.aspectRatio === '16:9' || project.isShort === false

  // Safety timeout: if player takes > 8 seconds, offer direct YouTube fallback
  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoaded((loaded) => {
        if (!loaded) setHasError(true)
        return loaded
      })
    }, 8000)

    return () => clearTimeout(timeout)
  }, [])

  // Escape key handler & focus trap
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
      if (e.key === 'Tab') {
        const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        if (!focusable || focusable.length === 0) return
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  // Body scroll lock and focus management (with focus restoration)
  useEffect(() => {
    const previousActiveElement = document.activeElement as HTMLElement | null
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeButtonRef.current?.focus()
    return () => {
      document.body.style.overflow = originalOverflow
      previousActiveElement?.focus?.()
    }
  }, [])

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${project.title} video player`}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-8"
    >
      {/* Dimmed Frosted Backdrop (Click-outside dismissal) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        onClick={onClose}
        className="fixed inset-0 bg-[#0E0F14]/85 backdrop-blur-md"
        aria-hidden="true"
      />

      {/* Modal Dialog Container: adaptively sized for portrait vs landscape */}
      <motion.div
        ref={dialogRef}
        initial={{ opacity: 0, scale: 0.95, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 12 }}
        transition={{ duration: 0.3, ease: EASINGS.cinematic }}
        className={`relative z-10 w-full ${
          isLandscape ? 'max-w-4xl lg:max-w-5xl' : 'max-w-3xl lg:max-w-4xl'
        } bg-[#14161F] text-white rounded-2xl overflow-hidden shadow-2xl border border-white/10 flex flex-col`}
      >
        {/* Header Strip */}
        <div className="flex items-center justify-between px-4 sm:px-5 py-3.5 border-b border-white/10 bg-[#0C0D12]">
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="font-mono text-xs font-medium text-white/90 uppercase tracking-widest">
              {project.title}
            </span>
            <span className="w-1 h-1 rounded-full bg-electric shrink-0" />
            <span className="font-mono text-[11px] text-white/60 tracking-wider uppercase">
              {isLandscape ? '16:9 Landscape' : '9:16 Portrait'}
            </span>
            <span className="hidden sm:inline-block text-white/20">•</span>
            <span className="hidden sm:inline-block font-mono text-[11px] text-white/50 tracking-wider uppercase">
              Ashutosh Sahu
            </span>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={project.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono text-white/70 hover:text-white rounded hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-electric"
              title="Open video on YouTube"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">YouTube</span>
            </a>

            <button
              ref={closeButtonRef}
              type="button"
              onClick={onClose}
              aria-label="Close modal (Escape)"
              className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Video Viewport Stage Area */}
        <div
          className={`relative w-full ${
            isLandscape
              ? 'aspect-[16/9] max-h-[75vh]'
              : 'h-[64vh] sm:h-[70vh] lg:h-[74vh] max-h-[700px]'
          } mx-auto bg-[#08090D] flex items-center justify-center overflow-hidden p-3 sm:p-5`}
        >
          {/* Layer 1: Persistent Ambient Background (Remains visible throughout playback and pause) */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
            <img
              src={project.thumbnailUrl}
              alt=""
              aria-hidden="true"
              className="w-full h-full object-cover filter blur-[32px] sm:blur-[40px] scale-125 opacity-45"
              decoding="async"
            />
            {/* Subtle dark overlay to prevent distraction */}
            <div className="absolute inset-0 bg-[#08090D]/50" />
            {/* Radial vignette for cinematic depth */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  'radial-gradient(ellipse at center, transparent 35%, rgba(8, 9, 13, 0.75) 100%)',
              }}
            />
          </div>

          {/* Layer 2: Foreground Centered Video Player */}
          <div
            className={`relative z-10 ${
              isLandscape
                ? 'w-full h-full aspect-[16/9]'
                : 'h-full aspect-[9/16] max-w-full'
            } rounded-xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.85)] border border-white/12 flex items-center justify-center bg-black`}
          >
            {/* Temporary Foreground Poster (Displays while player initializes, prevents black frame) */}
            <img
              src={project.thumbnailUrl}
              alt={`${project.title} poster`}
              className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-500 z-10 pointer-events-none ${
                isLoaded ? 'opacity-0' : 'opacity-90'
              }`}
              decoding="async"
            />

            {/* Subtle Loading Indicator while YouTube player initializes */}
            {!isLoaded && !hasError && (
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-black/40 backdrop-blur-xs pointer-events-none">
                <div className="w-8 h-8 rounded-full border-2 border-white/20 border-t-electric animate-spin" />
                <span className="font-mono text-[11px] text-white/80 tracking-widest uppercase">
                  Loading edit...
                </span>
              </div>
            )}

            {/* Graceful Fallback if embed is restricted or times out */}
            {hasError ? (
              <div className="absolute inset-0 z-30 flex flex-col items-center justify-center p-6 text-center bg-[#0C0D12]/95 gap-4">
                <div className="flex flex-col items-center gap-2">
                  <span className="font-mono text-xs uppercase tracking-widest text-white/50">
                    Playback Notice
                  </span>
                  <p className="font-body text-sm text-white/90 max-w-xs leading-relaxed">
                    Direct embed playback is restricted. You can watch this edit directly on YouTube.
                  </p>
                </div>
                <a
                  href={project.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-electric text-white rounded-lg text-xs font-mono uppercase tracking-wider hover:bg-electric-light transition-colors shadow-md"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Watch on YouTube
                </a>
              </div>
            ) : (
              /* High-fidelity YouTube Iframe Embed */
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${project.youtubeId}?autoplay=1&mute=0&controls=1&playsinline=1&rel=0`}
                title={`${project.title} by Ashutosh Sahu`}
                className={`w-full h-full border-0 z-20 transition-opacity duration-500 ${
                  isLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                onLoad={() => {
                  setTimeout(() => setIsLoaded(true), 250)
                }}
                onError={() => setHasError(true)}
              />
            )}
          </div>
        </div>

        {/* Footer Strip */}
        <div className="px-4 sm:px-5 py-3 bg-[#0C0D12] border-t border-white/8 flex items-center justify-between text-xs font-mono text-white/60 select-none">
          <span className="tracking-wide">ASHUTOSH SAHU • EDIT CUT</span>
          <span className="hidden sm:inline text-white/40">PRESS ESC TO CLOSE</span>
        </div>
      </motion.div>
    </div>
  )
}

export const VideoModal: React.FC<VideoModalProps> = ({
  project,
  isOpen,
  onClose,
}) => {
  return (
    <AnimatePresence>
      {isOpen && project && (
        <VideoModalContent
          key={project.id}
          project={project}
          onClose={onClose}
        />
      )}
    </AnimatePresence>
  )
}

export default VideoModal
