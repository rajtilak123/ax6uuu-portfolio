export interface ProjectItem {
  id: string
  index: string
  title: string
  category: 'short-form' | 'long-form'
  categoryTitle: string
  categorySubtitle: string
  youtubeId: string
  aspectRatio: '9:16' | '16:9'
  isShort: boolean
  thumbnailUrl: string
  youtubeUrl: string
}

export const SHORT_FORM_PROJECTS: ProjectItem[] = [
  {
    id: 'project-01',
    index: '01',
    title: 'Project 01',
    category: 'short-form',
    categoryTitle: 'CURATED WORKS',
    categorySubtitle: 'Short-form visual cuts & motion edits',
    youtubeId: 'aC6hTlEIdes',
    aspectRatio: '9:16',
    isShort: true,
    thumbnailUrl: 'https://i.ytimg.com/vi/aC6hTlEIdes/hqdefault.jpg',
    youtubeUrl: 'https://www.youtube.com/shorts/aC6hTlEIdes',
  },
  {
    id: 'project-02',
    index: '02',
    title: 'Project 02',
    category: 'short-form',
    categoryTitle: 'CURATED WORKS',
    categorySubtitle: 'Short-form visual cuts & motion edits',
    youtubeId: 'nokkwYvOagg',
    aspectRatio: '9:16',
    isShort: true,
    thumbnailUrl: 'https://i.ytimg.com/vi/nokkwYvOagg/hqdefault.jpg',
    youtubeUrl: 'https://www.youtube.com/shorts/nokkwYvOagg',
  },
  {
    id: 'project-03',
    index: '03',
    title: 'Project 03',
    category: 'short-form',
    categoryTitle: 'CURATED WORKS',
    categorySubtitle: 'Short-form visual cuts & motion edits',
    youtubeId: 'LsxwZsXOTw0',
    aspectRatio: '9:16',
    isShort: true,
    thumbnailUrl: 'https://i.ytimg.com/vi/LsxwZsXOTw0/hqdefault.jpg',
    youtubeUrl: 'https://www.youtube.com/shorts/LsxwZsXOTw0',
  },
]

export const LONG_FORM_PROJECT: ProjectItem = {
  id: 'project-04',
  index: '04',
  title: 'Project 04',
  category: 'long-form',
  categoryTitle: 'LONG-FORM STORYTELLING',
  categorySubtitle: 'Long-form narrative, rhythm and documentary pacing',
  youtubeId: 'bg4IO3U73p4',
  aspectRatio: '16:9',
  isShort: false,
  thumbnailUrl: 'https://i.ytimg.com/vi/bg4IO3U73p4/hqdefault.jpg',
  youtubeUrl: 'https://www.youtube.com/watch?v=bg4IO3U73p4',
}

export const HERO_PROJECTS: ProjectItem[] = [
  ...SHORT_FORM_PROJECTS,
  LONG_FORM_PROJECT,
]
