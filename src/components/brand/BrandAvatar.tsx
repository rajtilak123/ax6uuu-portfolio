import React from 'react'

export interface BrandAvatarProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
  alt?: string
}

const sizeMap = {
  sm: 'w-7 h-7 sm:w-8 sm:h-8',
  md: 'w-8 h-8 sm:w-9 sm:h-9',
  lg: 'w-10 h-10 sm:w-11 sm:h-11',
}

/**
 * BrandAvatar: Displays the authentic blue-and-white X6 graphic avatar mark.
 * Rendered using the original X6 artwork provided by Ashutosh.
 */
export const BrandAvatar: React.FC<BrandAvatarProps> = ({
  size = 'md',
  className = '',
  alt = 'ax6uuu brand avatar',
}) => {
  return (
    <div
      className={`relative rounded-full overflow-hidden shrink-0 bg-electric shadow-[0_2px_8px_rgba(38,59,255,0.2)] border border-black/5 flex items-center justify-center select-none ${sizeMap[size]} ${className}`}
    >
      <img
        src="/brand/x6-avatar.jpg"
        alt={alt}
        className="w-full h-full object-cover scale-[1.28] transform origin-center"
        width={40}
        height={40}
        loading="eager"
        decoding="async"
      />
    </div>
  )
}

export default BrandAvatar

