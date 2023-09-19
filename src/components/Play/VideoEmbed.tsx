import { formatVideoEmbedUrl } from '../../utils/video'

interface VideoEmbedProps {
  videoEmbedUrl: string
  controls: boolean
}

export const VideoEmbed = ({ videoEmbedUrl, controls }: VideoEmbedProps) => {
  if (videoEmbedUrl.startsWith('https://cdn.discordapp.com/attachments/')) {
    return (
      <div className='video-responsive aspect-w-16 aspect-h-9'>
        <video controls>
          <source src={videoEmbedUrl} type='video/mp4' />
        </video>
      </div>
    )
  }

  return (
    <div className='video-responsive aspect-w-16 aspect-h-9'>
      <iframe
        src={formatVideoEmbedUrl(videoEmbedUrl, controls)}
        allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
      />
    </div>
  )
}
