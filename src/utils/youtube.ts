export const getThumbnailUrl = (videoEmbedUrl: string): string =>
  `https://img.youtube.com/vi/${videoEmbedUrl.slice(30, 41)}/hqdefault.jpg`

export const getEmbedUrl = (videoEmbedUrl: string): string => `https://www.youtube.com/embed/${videoEmbedUrl.slice(30, 41)}`
