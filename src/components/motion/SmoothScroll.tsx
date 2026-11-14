import React, { useSyncExternalStore } from 'react'
import { ReactLenis } from 'lenis/react'

function subscribe(callback: () => void) {
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  mediaQuery.addEventListener('change', callback)
  return () => mediaQuery.removeEventListener('change', callback)
}

function getSnapshot() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function getServerSnapshot() {
  return false
}

export interface SmoothScrollProps {
  children: React.ReactNode
}

export const SmoothScroll: React.FC<SmoothScrollProps> = ({ children }) => {
  const reducedMotion = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  if (reducedMotion) {
    return <>{children}</>
  }

  return (
    <ReactLenis
      root
      options={{
        lerp: 0.08,
        duration: 1.2,
        smoothWheel: true,
      }}
    >
      {children}
    </ReactLenis>
  )
}

export default SmoothScroll
