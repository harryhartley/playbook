interface YoutubeEmbedProps {
  youtubeId: string
  controls: boolean
}

export const YoutubeEmbed = ({ youtubeId, controls }: YoutubeEmbedProps) => (
  <div className='video-responsive aspect-w-16 aspect-h-9'>
    <iframe
      src={`${
        youtubeId.includes('?')
          ? youtubeId
          : `${youtubeId.split('?clip')[0] ?? ''}${
              controls
                ? ''
                : `?modestbranding=1&autohide=1&showinfo=0&controls=0&playlist=${youtubeId.slice(-11)}&loop=1`
            }`
      }`}
      allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
    />
  </div>
)
