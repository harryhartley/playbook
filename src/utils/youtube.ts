export const getThumbnailUrl = (youtubeId: string): string =>
  `https://img.youtube.com/vi/${youtubeId.slice(30, 41)}/hqdefault.jpg`

export const getEmbedUrl = (youtubeId: string): string => `https://www.youtube.com/embed/${youtubeId.slice(30, 41)}`
