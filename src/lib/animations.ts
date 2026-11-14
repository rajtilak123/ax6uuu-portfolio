import type { Variants, Transition } from 'framer-motion'

/**
 * AX6UUU Animation System
 * Engineered according to "Cinematic Editorial × Experimental Motion Design"
 * Restrained, elegant, non-distracting, performance-first.
 */

// Custom cubic-bezier easing curves
export const EASINGS = {
  // Ultra-smooth cinematic curve with extended deceleration
  cinematic: [0.25, 1, 0.5, 1] as const,
  // Quick snappy feedback for controls & UI
  outExpo: [0.16, 1, 0.3, 1] as const,
  // Balanced curve for section transitions
  smoothInOut: [0.65, 0, 0.35, 1] as const,
}

// Transition defaults
export const TRANSITIONS = {
  instant: { duration: 0.15, ease: EASINGS.outExpo } satisfies Transition,
  fast: { duration: 0.25, ease: EASINGS.outExpo } satisfies Transition,
  default: { duration: 0.5, ease: EASINGS.cinematic } satisfies Transition,
  cinematic: { duration: 0.85, ease: EASINGS.cinematic } satisfies Transition,
  staggerDelay: 0.08,
}

// Framer Motion Variants
export const fadeInVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: TRANSITIONS.default,
  },
}

export const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: TRANSITIONS.default,
  },
}

export const fadeDownVariants: Variants = {
  hidden: { opacity: 0, y: -14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: TRANSITIONS.default,
  },
}

export const staggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: TRANSITIONS.staggerDelay,
      delayChildren: 0.1,
    },
  },
}

export const cinematicMediaVariants: Variants = {
  hidden: { opacity: 0, scale: 0.98 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.9,
      ease: EASINGS.cinematic,
    },
  },
}

export const cardHoverVariants: Variants = {
  rest: { y: 0 },
  hover: {
    y: -3,
    transition: { duration: 0.25, ease: EASINGS.outExpo },
  },
}

/**
 * Scroll-triggered reveal specifications inspired by editorial motion references
 */
export const SCROLL_REVEAL = {
  offset: 24,
  duration: 0.7,
  stagger: 0.12,
  viewport: { once: true, amount: 0.15 } as const,
  viewportStrict: { once: true, amount: 0.2 } as const,
}

/**
 * Returns a variant that skips translations/scales if reduced motion is requested
 */
export function getAccessibleVariant(
  variant: Variants,
  reducedMotion: boolean | null
): Variants {
  if (!reducedMotion) return variant

  return {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.2 } },
  }
}
