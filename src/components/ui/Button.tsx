import React from 'react'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'solid' | 'secondary' | 'outline' | 'ghost' | 'link'
  size?: 'sm' | 'md' | 'lg'
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  isLoading?: boolean
  href?: string
  external?: boolean
}

const variantClasses: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary:
    'bg-electric text-white hover:bg-electric-light active:bg-electric/90 shadow-[0_2px_10px_rgba(38,59,255,0.25)]',
  solid:
    'bg-[#0E0F14] text-[#F9F9FB] hover:bg-[#20232F] active:bg-black shadow-[0_2px_8px_rgba(14,15,20,0.12)]',
  secondary:
    'bg-white text-[#0E0F14] border border-black/8 hover:border-black/16 hover:bg-[#F5F6FA] active:bg-[#ECEEF4] shadow-xs',
  outline:
    'bg-transparent text-[#0E0F14] border border-black/12 hover:border-black/30 hover:bg-black/[0.03] active:bg-black/[0.06]',
  ghost:
    'bg-transparent text-[#5E606E] hover:text-[#0E0F14] hover:bg-black/[0.04] active:bg-black/[0.08]',
  link:
    'bg-transparent text-[#0E0F14] hover:text-electric p-0 h-auto underline-offset-4 hover:underline rounded-none',
}

const sizeClasses: Record<NonNullable<ButtonProps['size']>, string> = {
  sm: 'h-9 px-3.5 text-xs font-mono tracking-wider uppercase rounded-[6px] gap-1.5',
  md: 'h-11 px-5 text-sm font-medium rounded-[8px] gap-2',
  lg: 'h-13 px-7 text-base font-medium rounded-[8px] gap-2.5',
}

export const Button = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      leftIcon,
      rightIcon,
      isLoading = false,
      href,
      external = false,
      disabled = false,
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    const isLinkVariant = variant === 'link'

    const baseClasses = [
      'inline-flex items-center justify-center font-display select-none transition-all duration-200 cursor-pointer',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric focus-visible:ring-offset-2 focus-visible:ring-offset-[#F9F9FB]',
      'disabled:opacity-40 disabled:pointer-events-none disabled:cursor-not-allowed',
      !isLinkVariant ? 'active:scale-[0.98]' : '',
      variantClasses[variant],
      !isLinkVariant ? sizeClasses[size] : '',
      className,
    ]
      .filter(Boolean)
      .join(' ')

    const content = (
      <>
        {isLoading && (
          <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-1.5" />
        )}
        {!isLoading && leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>}
        <span>{children}</span>
        {!isLoading && rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
      </>
    )

    if (href) {
      return (
        <a
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href}
          target={external ? '_blank' : undefined}
          rel={external ? 'noopener noreferrer' : undefined}
          className={baseClasses}
          {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {content}
        </a>
      )
    }

    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        type={props.type || 'button'}
        disabled={disabled || isLoading}
        className={baseClasses}
        {...props}
      >
        {content}
      </button>
    )
  }
)

Button.displayName = 'Button'

export default Button
