/**
 * AX6UUU Design System Tokens
 * Light Editorial × Cinematic Motion Design constants matching Tailwind v4 @theme and Unslop principles.
 */

export const COLORS = {
  // Light Editorial Canvas Foundation
  canvas: '#F9F9FB', // Warm ivory canvas
  canvasAlt: '#F2F3F7',
  surface: '#FFFFFF',
  surfaceHover: '#F6F7FA',
  surfaceActive: '#EEF0F5',

  // Ink Typography Ramp
  ink: '#0E0F14', // Near-black primary
  inkSecondary: '#5E606E', // Editorial secondary graphite
  inkMuted: '#8E909E', // Subtle meta
  inkFaint: '#B5B7C2',

  // Strategic Electric Blue
  electric: '#263BFF',
  electricLight: '#536BFF',
  electricDim: 'rgba(38, 59, 255, 0.08)',

  // Hairline borders (8% and 16% black opacity)
  borderSubtle: 'rgba(14, 15, 20, 0.08)',
  borderHover: 'rgba(14, 15, 20, 0.16)',
  borderElectric: 'rgba(38, 59, 255, 0.4)',

  // Backward compatibility aliases
  obsidian: '#F9F9FB',
  charcoal: '#FFFFFF',
  offwhite: '#0E0F14',
  muted: '#5E606E',
  mutedDark: '#8E909E',
} as const

export const FONTS = {
  display: '"Space Grotesk", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  body: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
} as const

export const RADII = {
  xs: '4px',
  control: '8px',
  card: '16px',
  panel: '24px',
  pill: '9999px',
} as const

export const EASINGS = {
  cinematic: [0.25, 1, 0.5, 1] as const,
  outExpo: [0.16, 1, 0.3, 1] as const,
  inOutSmooth: [0.65, 0, 0.35, 1] as const,
} as const

export const DURATIONS = {
  instant: 0.15,
  fast: 0.25,
  normal: 0.4,
  slow: 0.6,
  cinematic: 0.8,
} as const

export const SPACING_SCALE = [4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128] as const

export const BREAKPOINTS = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const
