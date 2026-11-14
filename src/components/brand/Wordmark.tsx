import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import {
  WORDMARK_VIEWBOX,
  WORDMARK_LETTERS,
  WORDMARK_COMBINED_PATH,
} from './wordmarkPaths'

export interface WordmarkProps extends React.SVGProps<SVGSVGElement> {
  variant?: 'default' | 'dark' | 'electric' | 'muted' | 'white'
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'auto'
  animated?: boolean
  className?: string
}

const sizeClasses: Record<NonNullable<WordmarkProps['size']>, string> = {
  sm: 'h-5 w-auto',
  md: 'h-7 w-auto',
  lg: 'h-10 w-auto',
  xl: 'h-14 w-auto',
  auto: 'w-full h-auto',
}

const variantClasses: Record<NonNullable<WordmarkProps['variant']>, string> = {
  default: 'text-[#0E0F14] hover:text-electric',
  dark: 'text-[#0E0F14] hover:text-electric',
  white: 'text-white hover:text-white/85',
  electric: 'text-electric hover:text-electric-light',
  muted: 'text-[#8E909E] hover:text-[#0E0F14]',
}

const variantColors: Record<NonNullable<WordmarkProps['variant']>, string> = {
  default: '#0E0F14',
  dark: '#0E0F14',
  white: '#FFFFFF',
  electric: '#263BFF',
  muted: '#8E909E',
}

export const Wordmark: React.FC<WordmarkProps> = ({
  variant = 'default',
  size = 'md',
  animated = false,
  className = '',
  style,
  ...props
}) => {
  const shouldReduceMotion = useReducedMotion()

  const combinedClasses = [
    'inline-block transition-colors duration-200 select-none shrink-0',
    sizeClasses[size],
    variantClasses[variant],
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const mergedStyle: React.CSSProperties = {
    color: variantColors[variant],
    ...style,
  }

  if (!animated || shouldReduceMotion) {
    return (
      <svg
        viewBox={WORDMARK_VIEWBOX}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="AX6UUU wordmark"
        className={combinedClasses}
        style={mergedStyle}
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

  return (
    <svg
      viewBox={WORDMARK_VIEWBOX}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="AX6UUU wordmark"
      className={combinedClasses}
      style={mergedStyle}
      {...props}
    >
      {WORDMARK_LETTERS.map((letter, index) => (
        <motion.path
          key={letter.id + index}
          d={letter.path}
          fill="currentColor"
          fillRule={letter.fillRule || 'nonzero'}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.45,
            delay: index * 0.05,
            ease: [0.25, 1, 0.5, 1],
          }}
        />
      ))}
    </svg>
  )
}

export default Wordmark
