import React from 'react'

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'default' | 'wide' | 'narrow' | 'fluid'
  as?: React.ElementType
  noPadding?: boolean
}

const sizeClasses: Record<NonNullable<ContainerProps['size']>, string> = {
  default: 'max-w-[1400px]',
  wide: 'max-w-[1560px]',
  narrow: 'max-w-[960px]',
  fluid: 'max-w-full',
}

export const Container: React.FC<ContainerProps> = ({
  size = 'default',
  as: Component = 'div',
  noPadding = false,
  className = '',
  children,
  ...props
}) => {
  const combinedClasses = [
    'w-full mx-auto',
    sizeClasses[size],
    !noPadding ? 'px-4 sm:px-6 md:px-8 lg:px-12' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <Component className={combinedClasses} {...props}>
      {children}
    </Component>
  )
}

export default Container
