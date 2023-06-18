export const getThumbnailUrl = (videoEmbedUrl: string): string => {
  if (videoEmbedUrl.includes('drive.google.com')) {
    return `https://drive.google.com/thumbnail?id=${videoEmbedUrl.split('/')[6] ?? ''}`
  }
  return `https://img.youtube.com/vi/${videoEmbedUrl.slice(30, 41)}/hqdefault.jpg`
}

export const formatVideoEmbedUrl = ( videoEmbedUrl: string, controls?: boolean ): string => {
  if (videoEmbedUrl.includes('drive.google.com')) {
    return videoEmbedUrl
  }
  if (videoEmbedUrl.includes('?')) {
    return videoEmbedUrl
  }
  if (controls) {
    return `${videoEmbedUrl.split('?clip')[0] ?? ''}`
  }
  return `${videoEmbedUrl.split('?clip')[0] ?? ''}?modestbranding=1&autohide=1&showinfo=0&controls=0&playlist=${videoEmbedUrl.slice(-11)}&loop=1`
}
