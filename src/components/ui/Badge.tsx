import React from 'react'

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'electric' | 'subtle' | 'outline'
  dot?: boolean
  dotColor?: 'electric' | 'positive' | 'muted'
}

const variantClasses: Record<NonNullable<BadgeProps['variant']>, string> = {
  default: 'bg-white text-[#0E0F14] border border-black/8 shadow-xs',
  electric: 'bg-electric/[0.08] text-electric border border-electric/25',
  subtle: 'bg-black/[0.03] text-[#5E606E] border border-black/6',
  outline: 'bg-transparent text-[#5E606E] border border-black/10',
}

const dotColorClasses: Record<NonNullable<BadgeProps['dotColor']>, string> = {
  electric: 'bg-electric',
  positive: 'bg-emerald-500',
  muted: 'bg-[#8E909E]',
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  dot = false,
  dotColor = 'electric',
  className = '',
  children,
  ...props
}) => {
  const combinedClasses = [
    'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[6px]',
    'font-mono text-[11px] leading-none tracking-widest uppercase select-none',
    variantClasses[variant],
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <span className={combinedClasses} {...props}>
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColorClasses[dotColor]}`}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  )
}

export default Badge
