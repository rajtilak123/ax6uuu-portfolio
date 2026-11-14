export interface ServiceItem {
  id: string
  number: string
  title: string
  description: string
  capabilities: string[]
}

/**
 * Proposed service categories and post-production capabilities for Ashutosh Sahu (AX6UUU).
 * Designed for easy maintenance and future updates.
 */
export const SERVICES: ServiceItem[] = [
  {
    id: 'short-form',
    number: '01',
    title: 'Short-Form Video Editing',
    description:
      'Engaging vertical edits designed around strong hooks, thoughtful pacing and visual rhythm.',
    capabilities: [
      'Reels and YouTube Shorts',
      'Pacing and clean transitions',
      'Music synchronization',
      'Captions and visual enhancements',
    ],
  },
  {
    id: 'long-form',
    number: '02',
    title: 'Long-Form Video Editing',
    description:
      'Well-structured edits that keep the story clear, natural and engaging from beginning to end.',
    capabilities: [
      'YouTube videos',
      'Story-driven editing',
      'Footage organization',
      'Audio synchronization',
    ],
  },
  {
    id: 'cinematic',
    number: '03',
    title: 'Cinematic Editing',
    description:
      'Carefully composed visuals with attention to atmosphere, sound and the details that bring a story together.',
    capabilities: [
      'Cinematic storytelling',
      'Sound design',
      'Colour treatment',
      'Visual sequencing',
    ],
  },
]
