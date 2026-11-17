import React, { useState, useEffect, useRef } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import {
  SHORT_FORM_PROJECTS,
  LONG_FORM_PROJECT,
  type ProjectItem,
} from '../../data/projects'
import { EASINGS } from '../../lib/animations'

export interface VideoGalleryProps {
  onSelectProject: (project: ProjectItem) => void
  isModalOpen?: boolean
  className?: string
}

interface UseVideoPreviewOptions {
  cardRef: React.RefObject<HTMLDivElement | null>
  isModalOpen: boolean
  threshold?: number
}

/**
 * Custom hook managing independent viewport visibility and YouTube iframe playback.
 * - Each card has its own isolated IntersectionObserver.
 * - Multiple videos can play simultaneously when visible.
 * - Leaves viewport -> pauses only that video.
 * - Re-enters viewport -> resumes that video.
 * - Modal open -> pauses all videos; Modal close -> resumes visible videos.
 * - Never recreates iframes during scrolling (avoids duplicate players & flashing).
 */
function useVideoPreview({
  cardRef,
  isModalOpen,
  threshold = 0.15,
}: UseVideoPreviewOptions) {
  const shouldReduceMotion = useReducedMotion()
  const [isInView, setIsInView] = useState(false)
  const [hasEnteredView, setHasEnteredView] = useState(false)
  const [iframeLoaded, setIframeLoaded] = useState(false)
  const [loadError, setLoadError] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const shouldPlay = isInView && !isModalOpen && !shouldReduceMotion

  // 1. Independent Intersection Observer per card
  useEffect(() => {
    const el = cardRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        const inView = entry.isIntersecting && (entry.intersectionRatio >= threshold || entry.isIntersecting)
        setIsInView(inView)
        if (entry.isIntersecting) {
          setHasEnteredView(true)
        }
      },
      {
        threshold: [0, threshold, 0.3],
        rootMargin: '20px 0px 20px 0px',
      }
    )

    observer.observe(el)
    return () => {
      observer.disconnect()
    }
  }, [cardRef, threshold])

  // 2. Playback state control via YouTube postMessage API
  useEffect(() => {
    if (!iframeLoaded || !iframeRef.current?.contentWindow) return

    const cw = iframeRef.current.contentWindow
    const command = shouldPlay ? 'playVideo' : 'pauseVideo'

    try {
      cw.postMessage(
        JSON.stringify({ event: 'command', func: command, args: [] }),
        '*'
      )
    } catch {
      // Safe cross-origin handling
    }
  }, [shouldPlay, iframeLoaded])

  // 3. Iframe initial load handshake and play trigger
  const handleIframeLoad = () => {
    setIframeLoaded(true)
    const cw = iframeRef.current?.contentWindow
    if (cw) {
      const sendHandshake = () => {
        try {
          cw.postMessage(JSON.stringify({ event: 'listening' }), '*')
          cw.postMessage(
            JSON.stringify({ event: 'command', func: 'mute', args: [] }),
            '*'
          )
          const command = shouldPlay ? 'playVideo' : 'pauseVideo'
          cw.postMessage(
            JSON.stringify({ event: 'command', func: command, args: [] }),
            '*'
          )
        } catch {
          // Safe cross-origin handling
        }
      }
      sendHandshake()
      setTimeout(sendHandshake, 250)
    }
  }

  return {
    iframeRef,
    isInView,
    hasEnteredView,
    iframeLoaded,
    loadError,
    setLoadError,
    shouldPlay,
    handleIframeLoad,
  }
}

interface ShortFormCardProps {
  project: ProjectItem
  index: number
  isModalOpen: boolean
  onSelect: () => void
}

/**
 * Short-Form 9:16 Portrait Card
 * - Native 9:16 portrait aspect ratio matching vertical shorts
 * - Pure uncluttered video presentation: no obscuring bottom gradients or giant center play circles
 * - Clean metadata row placed outside below each card
 * - Independent viewport-triggered muted autoplay (multiple play simultaneously)
 */
const ShortFormCard: React.FC<ShortFormCardProps> = ({
  project,
  index,
  isModalOpen,
  onSelect,
}) => {
  const shouldReduceMotion = useReducedMotion()
  const cardRef = useRef<HTMLDivElement>(null)

  const {
    iframeRef,
    hasEnteredView,
    iframeLoaded,
    loadError,
    setLoadError,
    shouldPlay,
    handleIframeLoad,
  } = useVideoPreview({
    cardRef,
    isModalOpen,
    threshold: 0.15,
  })

  return (
    <motion.div
      ref={cardRef}
      data-project-id={project.id}
      data-is-playing={shouldPlay ? 'true' : 'false'}
      initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{
        duration: 0.65,
        delay: shouldReduceMotion ? 0 : index * 0.1,
        ease: EASINGS.cinematic,
      }}
      className="group relative flex flex-col cursor-pointer w-full max-w-[310px] sm:max-w-[318px] lg:max-w-[324px] mx-auto select-none"
      onClick={onSelect}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onSelect()
        }
      }}
      aria-label={`Open ${project.title} video player`}
    >
      {/* 9:16 Native Portrait Card Container */}
      <div
        className={`relative w-full aspect-[9/16] rounded-2xl sm:rounded-3xl overflow-hidden bg-[#0A0C14] border transition-all duration-300 shadow-[0_4px_24px_rgba(0,0,0,0.04)] group-hover:-translate-y-1 ${
          shouldPlay
            ? 'border-electric shadow-[0_16px_40px_rgba(38,59,255,0.16)]'
            : 'border-black/[0.08] group-hover:border-black/30 group-hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)]'
        }`}
      >
        {/* Permanent Crisp Poster Image (Always serves as base background, prevents black frame/spinner) */}
        <img
          src={project.thumbnailUrl}
          alt={`${project.title} preview`}
          className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-103"
          loading={index === 0 ? 'eager' : 'lazy'}
          decoding="async"
        />

        {/* Independent YouTube Player Iframe (Rendered on top once card enters view, retained across scrolls) */}
        {hasEnteredView && !loadError && (
          <iframe
            ref={iframeRef}
            src={`https://www.youtube-nocookie.com/embed/${project.youtubeId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${project.youtubeId}&playsinline=1&modestbranding=1&rel=0&iv_load_policy=3&enablejsapi=1${
              typeof window !== 'undefined'
                ? `&origin=${encodeURIComponent(window.location.origin)}`
                : ''
            }`}
            title={`${project.title} preview`}
            className={`absolute inset-0 w-full h-full border-0 pointer-events-none transition-opacity duration-500 ${
              iframeLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            tabIndex={-1}
            onLoad={handleIframeLoad}
            onError={() => setLoadError(true)}
          />
        )}
      </div>

      {/* Exterior Information Row */}
      <div className="mt-3 flex items-center justify-between text-xs px-0.5">
        <h3 className="font-display text-sm sm:text-base font-semibold tracking-tight text-[#0E0F14] group-hover:text-electric transition-colors duration-200">
          {project.title}
        </h3>

        <span className="font-mono text-[11px] text-[#8E909E] group-hover:text-electric flex items-center gap-1 transition-colors">
          <span>Watch</span>
          <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </motion.div>
  )
}

interface LongFormCardProps {
  project: ProjectItem
  isModalOpen: boolean
  onSelect: () => void
}

/**
 * Long-Form 16:9 Landscape Card
 * - Native 16:9 aspect ratio centered with max-width 880px
 * - Permanent crisp base thumbnail to prevent black frame or buffering spinner
 * - Refined, subtle overlay with no giant play circle
 */
const LongFormCard: React.FC<LongFormCardProps> = ({
  project,
  isModalOpen,
  onSelect,
}) => {
  const shouldReduceMotion = useReducedMotion()
  const cardRef = useRef<HTMLDivElement>(null)

  const {
    iframeRef,
    hasEnteredView,
    iframeLoaded,
    loadError,
    setLoadError,
    shouldPlay,
    handleIframeLoad,
  } = useVideoPreview({
    cardRef,
    isModalOpen,
    threshold: 0.2,
  })

  return (
    <div
      ref={cardRef}
      className="w-full flex justify-center select-none"
    >
      <motion.div
        data-project-id={project.id}
        data-is-playing={shouldPlay ? 'true' : 'false'}
        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.65, ease: EASINGS.cinematic }}
        onClick={onSelect}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onSelect()
          }
        }}
        className={`group relative w-full aspect-[16/9] max-w-[880px] mx-auto rounded-2xl sm:rounded-3xl overflow-hidden bg-[#0A0C14] border transition-all duration-300 shadow-[0_6px_28px_rgba(0,0,0,0.05)] group-hover:-translate-y-1 cursor-pointer ${
          shouldPlay
            ? 'border-electric shadow-[0_16px_40px_rgba(38,59,255,0.16)]'
            : 'border-black/[0.08] group-hover:border-black/30 group-hover:shadow-[0_14px_36px_rgba(0,0,0,0.1)]'
        }`}
        aria-label={`Open ${project.title} video player`}
      >
        {/* Permanent Crisp Poster Image */}
        <img
          src={project.thumbnailUrl}
          alt={`${project.title} thumbnail`}
          className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-102"
          loading="lazy"
          decoding="async"
        />

        {/* Independent YouTube Player Iframe */}
        {hasEnteredView && !loadError && (
          <iframe
            ref={iframeRef}
            src={`https://www.youtube-nocookie.com/embed/${project.youtubeId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${project.youtubeId}&playsinline=1&modestbranding=1&rel=0&iv_load_policy=3&enablejsapi=1${
              typeof window !== 'undefined'
                ? `&origin=${encodeURIComponent(window.location.origin)}`
                : ''
            }`}
            title={`${project.title} viewport preview`}
            className={`absolute inset-0 w-full h-full border-0 pointer-events-none transition-opacity duration-500 ${
              iframeLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            tabIndex={-1}
            onLoad={handleIframeLoad}
            onError={() => setLoadError(true)}
          />
        )}

        {/* Subtle Vignette Gradient for Legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0E0F14]/85 via-transparent to-[#0E0F14]/30 pointer-events-none" />

        {/* Bottom Overlay Title & Callout */}
        <div className="absolute inset-x-0 bottom-0 z-20 p-4 sm:p-6 bg-gradient-to-t from-[#0E0F14] via-[#0E0F14]/50 to-transparent flex items-end justify-between pointer-events-none">
          <h3 className="font-display text-base sm:text-lg lg:text-xl font-medium tracking-tight text-white max-w-xl">
            {project.title}
          </h3>

          <div className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-sm text-white font-mono text-xs tracking-wider uppercase group-hover:bg-electric transition-colors">
            <span>Watch Cut</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export const VideoGallery: React.FC<VideoGalleryProps> = ({
  onSelectProject,
  isModalOpen = false,
  className = '',
}) => {
  const shouldReduceMotion = useReducedMotion()

  return (
    <div className={`w-full flex flex-col ${className}`}>
      {/* 1. Short-Form Portfolio Header */}
      <motion.div
        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.55, ease: EASINGS.cinematic }}
        className="w-full pb-4 sm:pb-5 border-b border-black/[0.08] select-none mb-8 sm:mb-10 max-w-[1050px] mx-auto"
      >
        <div className="flex flex-col gap-1.5">
          <h2 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight text-[#0E0F14]">
            FEATURED EDITS
          </h2>
          <p className="font-body text-xs sm:text-sm text-[#5E606E]">
            Short-form cuts crafted with intentional rhythm, sound design & pacing
          </p>
        </div>
      </motion.div>

      {/* 2. Three 9:16 Portrait Cards in 1 Row on Desktop */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 lg:gap-8 items-start max-w-[1050px] mx-auto">
        {SHORT_FORM_PROJECTS.map((project, index) => (
          <div key={project.id} className="w-full flex justify-center">
            <ShortFormCard
              project={project}
              index={index}
              isModalOpen={isModalOpen}
              onSelect={() => onSelectProject(project)}
            />
          </div>
        ))}
      </div>

      {/* 3. Compact Long-Form Section (850–900px centered) */}
      <div className="mt-12 sm:mt-16 lg:mt-20 pt-8 sm:pt-12 border-t border-black/[0.08]">
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.55, ease: EASINGS.cinematic }}
          className="pb-4 sm:pb-5 border-b border-black/[0.08] select-none mb-8 sm:mb-10 max-w-[880px] mx-auto"
        >
          <div className="flex flex-col gap-1.5">
            <h2 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight text-[#0E0F14]">
              LONG-FORM STORYTELLING
            </h2>
            <p className="font-body text-xs sm:text-sm text-[#5E606E]">
              Extended documentary structure, narrative pacing & audio-visual rhythm
            </p>
          </div>
        </motion.div>

        {/* Compact, Centered Landscape 16:9 Card */}
        <LongFormCard
          project={LONG_FORM_PROJECT}
          isModalOpen={isModalOpen}
          onSelect={() => onSelectProject(LONG_FORM_PROJECT)}
        />
      </div>
    </div>
  )
}

export default VideoGallery
