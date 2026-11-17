import React from 'react'

export interface WordmarkProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'dark' | 'electric' | 'muted' | 'white'
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'auto'
  className?: string
}

const sizeClasses: Record<NonNullable<WordmarkProps['size']>, string> = {
  sm: 'text-[17px] sm:text-[18.5px]',
  md: 'text-[19px] sm:text-[21px]',
  lg: 'text-2xl sm:text-3xl',
  xl: 'text-3xl sm:text-4xl',
  '2xl': 'text-4xl sm:text-5xl',
  auto: 'text-base',
}

const variantClasses: Record<NonNullable<WordmarkProps['variant']>, string> = {
  default: 'text-[#0E0F14] group-hover:text-electric',
  dark: 'text-[#0E0F14] group-hover:text-electric',
  white: 'text-white group-hover:text-white/85',
  electric: 'text-electric group-hover:text-electric-light',
  muted: 'text-[#8E909E] group-hover:text-[#0E0F14]',
}

/**
 * Wordmark component: Displays the clean, professional "ax6uuu" wordmark
 * rendered in Instrument Sans SemiBold (600 weight).
 */
export const Wordmark: React.FC<WordmarkProps> = ({
  variant = 'default',
  size = 'sm',
  className = '',
  ...props
}) => {
  return (
    <span
      className={`inline-block font-display font-semibold lowercase tracking-[-0.015em] leading-none select-none transition-colors duration-200 shrink-0 ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      role="img"
      aria-label="ax6uuu logo"
      {...props}
    >
      ax6uuu
    </span>
  )
}

export default Wordmark
