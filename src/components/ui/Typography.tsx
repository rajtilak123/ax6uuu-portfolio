import React from 'react'

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  size?: 'hero' | 'title' | 'section' | 'card' | 'subhead'
  accent?: boolean
}

const headingSizeClasses: Record<NonNullable<HeadingProps['size']>, string> = {
  hero: 'font-display text-[clamp(2.5rem,6.5vw,5.5rem)] leading-[1.02] tracking-[-0.035em] font-medium text-[#0E0F14]',
  title: 'font-display text-[clamp(2rem,4.5vw,3.5rem)] leading-[1.06] tracking-[-0.03em] font-medium text-[#0E0F14]',
  section: 'font-display text-[clamp(1.5rem,3vw,2.25rem)] leading-[1.15] tracking-[-0.025em] font-medium text-[#0E0F14]',
  card: 'font-display text-xl sm:text-2xl leading-[1.2] tracking-[-0.02em] font-medium text-[#0E0F14]',
  subhead: 'font-display text-lg sm:text-xl leading-[1.3] tracking-[-0.015em] font-medium text-[#0E0F14]',
}

export const Heading: React.FC<HeadingProps> = ({
  as: Component = 'h2',
  size = 'section',
  accent = false,
  className = '',
  children,
  ...props
}) => {
  const combined = [
    headingSizeClasses[size],
    accent ? 'text-electric' : '',
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

export interface TextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  as?: 'p' | 'span' | 'div'
  variant?: 'lead' | 'body' | 'secondary' | 'mono' | 'caption'
}

const textVariantClasses: Record<NonNullable<TextProps['variant']>, string> = {
  lead: 'font-body text-[clamp(1.125rem,1.8vw,1.25rem)] leading-relaxed text-[#5E606E] font-normal max-w-2xl',
  body: 'font-body text-base leading-[1.65] text-[#232530] font-normal',
  secondary: 'font-body text-sm leading-normal text-[#5E606E] font-normal',
  mono: 'font-mono text-xs tracking-wider uppercase text-[#8E909E] font-normal',
  caption: 'font-body text-xs text-[#8E909E] leading-normal',
}

export const Text: React.FC<TextProps> = ({
  as: Component = 'p',
  variant = 'body',
  className = '',
  children,
  ...props
}) => {
  const combined = [textVariantClasses[variant], className].filter(Boolean).join(' ')

  return (
    <Component className={combined} {...props}>
      {children}
    </Component>
  )
}
