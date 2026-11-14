import React, { useState, useEffect, useRef } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Play, ArrowUpRight, VolumeX, Maximize2 } from 'lucide-react'
import { HERO_PROJECTS, type ProjectItem } from '../../data/projects'
import { EASINGS } from '../../lib/animations'

export interface VideoGalleryProps {
  onSelectProject: (project: ProjectItem) => void
  className?: string
}

interface HoverPreviewProps {
  project: ProjectItem
  onPlaybackChange: (isPlaying: boolean) => void
}

const HoverPreview: React.FC<HoverPreviewProps> = ({
  project,
  onPlaybackChange,
}) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [hasTimedOut, setHasTimedOut] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    // Safety timeout: if preview takes longer than 3.5s, retain the thumbnail
    const timer = setTimeout(() => {
      setHasTimedOut(true)
    }, 3500)

    // Listen to YouTube player postMessage for playback state
    const handleMessage = (e: MessageEvent) => {
      try {
        const data = typeof e.data === 'string' ? JSON.parse(e.data) : e.data
        if (data?.event === 'infoDelivery' && data?.info?.playerState === 1) {
          setIsPlaying(true)
          onPlaybackChange(true)
        }
      } catch {
        // ignore non-json messages
      }
    }

    window.addEventListener('message', handleMessage)

    return () => {
      clearTimeout(timer)
      window.removeEventListener('message', handleMessage)
    }
  }, [onPlaybackChange])

  const handleIframeLoad = () => {
    try {
      iframeRef.current?.contentWindow?.postMessage(
        JSON.stringify({ event: 'listening' }),
        '*'
      )
    } catch {
      // ignore
    }

    // Fallback: 500ms after onLoad, YouTube autoplay has started decoding frames
    setTimeout(() => {
      setIsPlaying(true)
      onPlaybackChange(true)
    }, 500)
  }

  if (hasTimedOut) {
    return null
  }

  return (
    <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none bg-transparent">
      <iframe
        ref={iframeRef}
        src={`https://www.youtube-nocookie.com/embed/${project.youtubeId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${project.youtubeId}&playsinline=1&modestbranding=1&rel=0&iv_load_policy=3&enablejsapi=1`}
        title={`${project.title} hover preview`}
        className={`absolute -top-[10%] -bottom-[10%] -left-[10%] -right-[10%] w-[120%] h-[120%] border-0 pointer-events-none transition-opacity duration-500 ease-out ${
          isPlaying ? 'opacity-100' : 'opacity-0'
        }`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        tabIndex={-1}
        onLoad={handleIframeLoad}
        onError={() => setHasTimedOut(true)}
      />
    </div>
  )
}

interface ProjectCardProps {
  project: ProjectItem
  index: number
  isHovered: boolean
  onHoverStart: () => void
  onHoverEnd: () => void
  onSelect: () => void
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  index,
  isHovered,
  onHoverStart,
  onHoverEnd,
  onSelect,
}) => {
  const shouldReduceMotion = useReducedMotion()
  const [isPlaying, setIsPlaying] = useState(false)
  const isLandscape = project.aspectRatio === '16:9' || project.isShort === false

  const handleHoverEnd = () => {
    setIsPlaying(false)
    onHoverEnd()
  }

  return (
    <motion.div
      initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{
        duration: 0.7,
        delay: shouldReduceMotion ? 0 : index * 0.12,
        ease: EASINGS.cinematic,
      }}
      className="group relative flex flex-col cursor-pointer"
      onMouseEnter={onHoverStart}
      onMouseLeave={handleHoverEnd}
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
      {/* Video Card Frame */}
      <div
        className={`relative w-full aspect-[9/16] rounded-2xl overflow-hidden bg-[#14161F] border transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.04)] ${
          isLandscape ? 'flex flex-col justify-center px-2.5 sm:px-3' : ''
        } ${
          isHovered
            ? 'border-electric shadow-[0_12px_32px_rgba(38,59,255,0.12)] -translate-y-1'
            : 'border-black/[0.08] hover:border-black/20'
        }`}
      >
        {isLandscape ? (
          <>
            {/* Ambient Blurred Background for Landscape */}
            <img
              src={project.thumbnailUrl}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover filter blur-2xl scale-125 opacity-35 z-0 pointer-events-none"
              loading={index === 0 ? 'eager' : 'lazy'}
              decoding="async"
            />
            <div className="absolute inset-0 bg-[#0E0F14]/65 z-0 pointer-events-none" />

            {/* Centered Uncropped 16:9 Video Frame */}
            <div className="relative z-10 w-full aspect-[16/9] rounded-lg overflow-hidden border border-white/15 bg-black/60 shadow-xl my-auto">
              <img
                src={project.thumbnailUrl}
                alt={`${project.title} thumbnail`}
                className={`w-full h-full object-cover object-center transition-transform duration-700 ease-out ${
                  isHovered ? 'scale-105' : 'scale-100'
                }`}
                loading={index === 0 ? 'eager' : 'lazy'}
                decoding="async"
                fetchPriority={index === 0 ? 'high' : 'auto'}
              />
              {isHovered && (
                <HoverPreview
                  project={project}
                  onPlaybackChange={setIsPlaying}
                />
              )}
            </div>
          </>
        ) : (
          <>
            {/* Original YouTube Thumbnail Poster (Portrait 9:16) */}
            <img
              src={project.thumbnailUrl}
              alt={`${project.title} thumbnail`}
              className={`absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 ease-out z-0 ${
                isHovered ? 'scale-105' : 'scale-100'
              }`}
              loading={index === 0 ? 'eager' : 'lazy'}
              decoding="async"
              fetchPriority={index === 0 ? 'high' : 'auto'}
            />

            {/* Desktop Muted Video Preview */}
            {isHovered && (
              <HoverPreview
                project={project}
                onPlaybackChange={setIsPlaying}
              />
            )}
          </>
        )}

        {/* Top Overlay: Project Number Tag & Previewing Badge */}
        <div className="absolute top-3.5 inset-x-3.5 z-20 flex items-center justify-between pointer-events-none select-none">
          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center px-2 py-0.5 rounded-[4px] bg-[#0E0F14]/75 backdrop-blur-md text-[10px] font-mono font-medium tracking-widest text-white uppercase border border-white/10">
              {project.index}
            </span>
            {isLandscape && (
              <span className="inline-flex items-center px-1.5 py-0.5 rounded-[4px] bg-white/10 backdrop-blur-md text-[9px] font-mono tracking-wider text-white/80 uppercase border border-white/10">
                16:9
              </span>
            )}
          </div>

          {/* Reveal PREVIEWING badge only when playback has actually started */}
          {isHovered && isPlaying && (
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[4px] bg-electric/90 backdrop-blur-md text-[10px] font-mono tracking-wider text-white uppercase shadow-xs"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              Previewing
            </motion.span>
          )}
        </div>

        {/* Center Hover Action Indicator */}
        <div
          className={`absolute inset-0 z-20 flex items-center justify-center pointer-events-none transition-opacity duration-200 ${
            isHovered ? 'opacity-100' : 'opacity-0 sm:group-hover:opacity-100'
          }`}
        >
          <div className="w-11 h-11 rounded-full bg-[#0E0F14]/85 backdrop-blur-md text-white flex items-center justify-center shadow-lg border border-white/15 transform scale-95 group-hover:scale-100 transition-transform">
            {isHovered && isPlaying ? (
              <VolumeX className="w-4 h-4 text-white/80" />
            ) : (
              <Play className="w-4 h-4 text-white fill-white translate-x-0.5" />
            )}
          </div>
        </div>

        {/* Bottom Overlay: Scrim & Project Title (Removed repeated Short-Form Edit label) */}
        <div className="absolute inset-x-0 bottom-0 z-20 p-4 bg-gradient-to-t from-[#0E0F14]/90 via-[#0E0F14]/40 to-transparent pt-12 flex items-end justify-between pointer-events-none select-none">
          <div className="flex flex-col">
            <h3 className="font-display text-sm font-medium tracking-tight text-white">
              {project.title}
            </h3>
          </div>

          <div className="w-7 h-7 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white/90 group-hover:bg-electric group-hover:text-white transition-colors">
            <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
        </div>
      </div>

      {/* Exterior Card Caption */}
      <div className="mt-2.5 flex items-center justify-between px-1 text-xs select-none">
        <span className="font-mono text-[11px] text-[#5E606E] tracking-wider uppercase">
          Project {project.index}
        </span>
        <span className="font-mono text-[11px] text-[#8E909E] flex items-center gap-1 group-hover:text-electric transition-colors">
          <span>Expand</span>
          <Maximize2 className="w-3 h-3" />
        </span>
      </div>
    </motion.div>
  )
}

export const VideoGallery: React.FC<VideoGalleryProps> = ({
  onSelectProject,
  className = '',
}) => {
  const shouldReduceMotion = useReducedMotion()
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  return (
    <div className={`w-full flex flex-col gap-6 sm:gap-8 ${className}`}>
      {/* Editorial Gallery Header Strip */}
      <motion.div
        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, ease: EASINGS.cinematic }}
        className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-black/[0.08] gap-2 select-none"
      >
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs font-medium uppercase tracking-widest text-[#0E0F14]">
            Selected Works
          </span>
          <span className="font-mono text-xs text-[#8E909E] tracking-wider">
            (01—04)
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono text-[#8E909E] tracking-wider uppercase">
          <span className="hidden sm:inline">Hover to preview</span>
          <span className="hidden sm:inline text-black/20">•</span>
          <span>Click to expand</span>
        </div>
      </motion.div>

      {/* 4-Card Responsive Grid (Native 9:16 Portrait Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 lg:gap-7">
        {HERO_PROJECTS.map((project, index) => (
          <ProjectCard
            key={project.id}
            project={project}
            index={index}
            isHovered={hoveredId === project.id}
            onHoverStart={() => setHoveredId(project.id)}
            onHoverEnd={() => setHoveredId(null)}
            onSelect={() => onSelectProject(project)}
          />
        ))}
      </div>
    </div>
  )
}

export default VideoGallery
