import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { EASINGS } from '../../lib/animations'

export interface TextRevealProps {
  children: string
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span'
  className?: string
  delay?: number
  stagger?: number
}

export const TextReveal: React.FC<TextRevealProps> = ({
  children,
  as: Component = 'span',
  className = '',
  delay = 0,
  stagger = 0.04,
}) => {
  const shouldReduceMotion = useReducedMotion()
  const words = children.split(' ')

  if (shouldReduceMotion) {
    return <Component className={className}>{children}</Component>
  }

  return (
    <Component className={`inline-block ${className}`}>
      {words.map((word, index) => (
        <span
          key={`${word}-${index}`}
          className="inline-block overflow-hidden align-top mr-[0.25em] last:mr-0"
        >
          <motion.span
            className="inline-block"
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              duration: 0.6,
              delay: delay + index * stagger,
              ease: EASINGS.cinematic,
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </Component>
  )
}

export default TextReveal
