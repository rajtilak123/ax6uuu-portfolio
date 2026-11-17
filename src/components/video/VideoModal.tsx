import React, { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
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

/**
 * Clean Cinematic Video Lightbox with Persistent Ambient Blurred Backdrop
 * - Centers the video in its native aspect ratio (9:16 portrait or 16:9 landscape)
 * - Uses the video's thumbnail as an enlarged, blurred backdrop with a restrained dark gradient
 * - Ambient background remains permanently visible throughout playback
 * - Minimal close button, Escape key support, click-outside dismissal
 * - Terminates playback immediately when closed
 */
const VideoModalContent: React.FC<VideoModalContentProps> = ({
  project,
  onClose,
}) => {
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const isLandscape = project.aspectRatio === '16:9' || project.isShort === false

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  // Body scroll lock and focus management
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8"
    >
      {/* Persistent Ambient Background Layer (Enlarged Blurred Thumbnail + Dark Gradient) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={onClose}
        className="fixed inset-0 overflow-hidden cursor-pointer bg-[#0E0F14]"
        aria-hidden="true"
      >
        {/* Enlarged blurred poster */}
        <img
          src={project.thumbnailUrl}
          alt=""
          className="absolute inset-0 w-full h-full object-cover filter blur-[56px] scale-125 opacity-35 pointer-events-none select-none"
        />
        {/* Deep dark tint overlay */}
        <div className="absolute inset-0 bg-[#0E0F14]/75 backdrop-blur-2xl" />
        {/* Restrained vignette gradient */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(38, 59, 255, 0.08) 0%, transparent 60%, rgba(14, 15, 20, 0.9) 100%)',
          }}
        />
      </motion.div>

      {/* Small, clearly visible close button (top-right of screen) */}
      <button
        ref={closeButtonRef}
        type="button"
        onClick={onClose}
        aria-label="Close video (Escape)"
        className="fixed top-4 right-4 sm:top-6 sm:right-6 z-50 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric cursor-pointer shadow-lg"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Centered Video Player Stage (Native aspect ratio, no dashboard chrome) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 12 }}
        transition={{ duration: 0.3, ease: EASINGS.cinematic }}
        onClick={(e) => e.stopPropagation()}
        className={`relative z-10 rounded-2xl sm:rounded-3xl overflow-hidden shadow-[0_24px_72px_rgba(0,0,0,0.85)] border border-white/15 bg-black ${
          isLandscape
            ? 'w-full max-w-4xl lg:max-w-5xl aspect-[16/9]'
            : 'h-[82vh] max-h-[760px] aspect-[9/16] max-w-full'
        }`}
      >
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${project.youtubeId}?autoplay=1&mute=0&controls=1&playsinline=1&rel=0&modestbranding=1`}
          title={`${project.title} by Ashutosh Sahu`}
          className="w-full h-full border-0 bg-black"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
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
