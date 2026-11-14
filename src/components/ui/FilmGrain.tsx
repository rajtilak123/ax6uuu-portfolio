import React from 'react'

export const FilmGrain: React.FC = () => {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-50 opacity-[0.035] mix-blend-overlay"
      aria-hidden="true"
    >
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <filter id="ax6uuu-film-grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.75"
            numOctaves="3"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#ax6uuu-film-grain)" />
      </svg>
    </div>
  )
}

export default FilmGrain
