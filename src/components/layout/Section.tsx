import React from 'react'

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType
  spacing?: 'compact' | 'default' | 'spacious' | 'hero'
  bg?: 'obsidian' | 'charcoal' | 'transparent'
  borderTop?: boolean
  borderBottom?: boolean
}

const spacingClasses: Record<NonNullable<SectionProps['spacing']>, string> = {
  compact: 'py-12 md:py-16',
  default: 'py-20 md:py-28',
  spacious: 'py-28 md:py-36 lg:py-44',
  hero: 'pt-28 pb-20 md:pt-36 md:pb-28',
}

const bgClasses: Record<NonNullable<SectionProps['bg']>, string> = {
  obsidian: 'bg-obsidian',
  charcoal: 'bg-charcoal',
  transparent: 'bg-transparent',
}

export const Section: React.FC<SectionProps> = ({
  as: Component = 'section',
  spacing = 'default',
  bg = 'transparent',
  borderTop = false,
  borderBottom = false,
  className = '',
  children,
  ...props
}) => {
  const combined = [
    'relative w-full',
    spacingClasses[spacing],
    bgClasses[bg],
    borderTop ? 'border-t border-white/8' : '',
    borderBottom ? 'border-b border-white/8' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <Component className={combined} {...props}>
      {children}
    </Component>
  )
}

export default Section
