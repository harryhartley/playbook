import { FireIcon } from '@heroicons/react/24/outline'
import type { Play } from '@prisma/client'
import Link from 'next/link'

const YoutubeEmbed = ({ youtubeId }: { youtubeId: string }) => (
  <div className='video-responsive aspect-w-16 aspect-h-9'>
    <iframe
      src={`https://www.youtube.com/embed/${youtubeId}?modestbranding=1&autohide=1&showinfo=0&controls=0${
        youtubeId.includes('?') ? '' : `&playlist=${youtubeId.slice(-11)}&loop=1`
      }`}
      allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
      allowFullScreen
    />
  </div>
)

export const PlayCard = ({
  id,
  name,
  youtubeId,
  description,
  type,
  speed,
  environment,
  character,
  stage,
  difficulty,
}: Partial<Play>): JSX.Element => {
  return (
    <div className={`mb-4 h-full w-full rounded-xl border-gray-800 bg-gray-800 shadow-lg`}>
      {/* Youtube Embed */}
      {youtubeId && <YoutubeEmbed youtubeId={youtubeId} />}
      <div className='p-4'>
        <div className='flex-initial'>
          {/* Title */}
          <div className='title cursor mb-2 text-xl text-white hover:underline'>
            <Link href={{ pathname: '/play/[id]', query: { id } }}>{name}</Link>
          </div>
          {/* Fire Icons */}
          <div>
            {Array(difficulty)
              .fill(0)
              .map((e, i) => (
                <button key={`fire-${i}`} className='mb-3 text-red-500'>
                  <FireIcon className='h-8 w-8' />
                </button>
              ))}
          </div>
        </div>
        {/* Badges */}
        <div className='mb-2 flex gap-1'>
          <span className='badge rounded bg-indigo-500 px-1 text-xs text-blue-100'>{type}</span>
          <span className='badge rounded bg-indigo-500 px-1 text-xs text-blue-100'>{character}</span>
          <span className='badge rounded bg-indigo-500 px-1 text-xs text-blue-100'>{stage}</span>
          <span className='badge rounded bg-indigo-500 px-1 text-xs text-blue-100'>{speed} Speed</span>
          <span className='badge rounded bg-indigo-500 px-1 text-xs text-blue-100'>{environment}</span>
        </div>
        {/* Description */}
        <span className='description py-2 text-sm text-white'>{description}</span>
      </div>
    </div>
  )
}
