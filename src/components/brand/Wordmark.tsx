import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import {
  WORDMARK_VIEWBOX,
  WORDMARK_COMBINED_PATH,
  WORDMARK_LETTERS,
} from './wordmarkPaths'

export interface WordmarkProps extends React.SVGProps<SVGSVGElement> {
  variant?: 'default' | 'dark' | 'electric' | 'muted' | 'white'
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'auto'
  animated?: boolean
  className?: string
}

const sizeClasses: Record<NonNullable<WordmarkProps['size']>, string> = {
  sm: 'h-4.5 sm:h-5 w-auto',
  md: 'h-5.5 sm:h-6 w-auto',
  lg: 'h-7 sm:h-8 w-auto',
  xl: 'h-9 sm:h-11 w-auto',
  '2xl': 'h-12 sm:h-14 w-auto',
  auto: 'h-auto w-full',
}

const variantClasses: Record<NonNullable<WordmarkProps['variant']>, string> = {
  default: 'text-[#0E0F14] hover:text-electric',
  dark: 'text-[#0E0F14] hover:text-electric',
  white: 'text-white hover:text-white/85',
  electric: 'text-electric hover:text-electric-light',
  muted: 'text-[#8E909E] hover:text-[#0E0F14]',
}

/**
 * Wordmark component: Displays the authentic lowercase "ax6uuu" custom vector
 * brand mark with its distinctive letterforms, preserved from original artwork.
 */
export const Wordmark: React.FC<WordmarkProps> = ({
  variant = 'default',
  size = 'md',
  animated = false,
  className = '',
  ...props
}) => {
  const shouldReduceMotion = useReducedMotion()
  const combinedClasses = `inline-block select-none shrink-0 transition-colors duration-200 ${sizeClasses[size]} ${variantClasses[variant]} ${className}`

  if (animated && !shouldReduceMotion) {
    return (
      <svg
        viewBox={WORDMARK_VIEWBOX}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="ax6uuu logo"
        className={combinedClasses}
        {...props}
      >
        {WORDMARK_LETTERS.map((letter, index) => (
          <motion.path
            key={letter.id + index}
            d={letter.path}
            fill="currentColor"
            fillRule={letter.fillRule || 'evenodd'}
            clipRule="evenodd"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.35,
              delay: index * 0.04,
              ease: [0.25, 1, 0.5, 1],
            }}
          />
        ))}
      </svg>
    )
  }

  return (
    <svg
      viewBox={WORDMARK_VIEWBOX}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="ax6uuu logo"
      className={combinedClasses}
      {...props}
    >
      <path
        d={WORDMARK_COMBINED_PATH}
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
      />
    </svg>
  )
}

export default Wordmark
