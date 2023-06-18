interface VideoEmbedProps {
  videoEmbedUrl: string
  controls: boolean
}

const formatVideoEmbedUrl = ( videoEmbedUrl: string, controls: boolean ): string => {
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

export const VideoEmbed = ({ videoEmbedUrl, controls }: VideoEmbedProps) => (
  <div className='video-responsive aspect-w-16 aspect-h-9'>
    <iframe
      src={formatVideoEmbedUrl(videoEmbedUrl, controls)}
      allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
    />
  </div>
)
