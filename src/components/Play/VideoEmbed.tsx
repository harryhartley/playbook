import { formatVideoEmbedUrl } from '../../utils/video'

interface VideoEmbedProps {
  videoEmbedUrl: string
  controls: boolean
}

export const VideoEmbed = ({ videoEmbedUrl, controls }: VideoEmbedProps) => (
  <div className='video-responsive aspect-w-16 aspect-h-9'>
    <iframe
      src={formatVideoEmbedUrl(videoEmbedUrl, controls)}
      allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
    />
  </div>
)
