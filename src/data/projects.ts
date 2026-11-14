export interface ProjectItem {
  id: string
  index: string
  title: string
  category: string
  youtubeId: string
  aspectRatio: '9:16' | '16:9'
  isShort?: boolean
  thumbnailUrl: string
  youtubeUrl: string
}

export const HERO_PROJECTS: ProjectItem[] = [
  {
    id: 'project-01',
    index: '01',
    title: 'Project 01',
    category: 'Project 01',
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
    category: 'Project 02',
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
    category: 'Project 03',
    youtubeId: 'LsxwZsXOTw0',
    aspectRatio: '9:16',
    isShort: true,
    thumbnailUrl: 'https://i.ytimg.com/vi/LsxwZsXOTw0/hqdefault.jpg',
    youtubeUrl: 'https://www.youtube.com/shorts/LsxwZsXOTw0',
  },
  {
    id: 'project-04',
    index: '04',
    title: 'Project 04',
    category: 'Project 04',
    youtubeId: 'bg4IO3U73p4',
    aspectRatio: '16:9',
    isShort: false,
    thumbnailUrl: 'https://i.ytimg.com/vi/bg4IO3U73p4/hqdefault.jpg',
    youtubeUrl: 'https://www.youtube.com/watch?v=bg4IO3U73p4',
  },
]
