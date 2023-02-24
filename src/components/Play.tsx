import { FireIcon } from "@heroicons/react/24/outline";
import type { Play as PlayType } from '@prisma/client';
import Link from "next/link";
import { Tag } from "./Tag";

const YoutubeEmbed = ({ youtubeId }: { youtubeId: string }) => (
  <div className="video-responsive aspect-w-16 aspect-h-9">
    <iframe
      src={`https://www.youtube.com/embed/${youtubeId}?modestbranding=1&autohide=1&showinfo=0&controls=0${youtubeId.includes('?') ? 
        '' : 
        `&playlist=${youtubeId.slice(-11)}&loop=1`}`
      }
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    />
  </div>
);

const formatDate = (date: Date) => {
  return date.toISOString().split('T')[0]
}

interface PlayProps {
  play: PlayType
  youtubeEmbed: 'inline' | 'above' | 'none'
}

export const Play = ({play, youtubeEmbed}: PlayProps) => {
  const id = play.id
  return (
    <li className="py-12">
      <article>
        <div className="space-y-2 xl:grid xl:grid-cols-3 xl:space-y-0">
          <div className="space-y-5 xl:col-span-2">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold leading-8 tracking-tight">
                  <p className="text-base font-medium leading-6 text-gray-500">
                    <time dateTime={formatDate(play.createdAt)}>{formatDate(play.createdAt)}</time>
                  </p>
                  <Link href={{ pathname: '/play/[id]', query: { id } }}>
                    {play.name}
                  </Link>
                </h2>
                <div className="flex flex-wrap">
                  {[
                    play.character, play.type, play.speed, play.stage, play.environment
                  ].filter(tag => tag !== 'All').map((tag, idx) => <Tag key={idx} text={tag} />)}
                </div>
              </div>
              <div className="prose max-w-none text-gray-500 dark:text-gray-400">
                {play.description}
              </div>
            </div>
            <div>
              {Array(play.difficulty).fill(0).map((e, i) => (
                <button key={`fire-${i}`} className="mb-3 text-red-500">
                    <FireIcon className="h-8 w-8" />
                </button>
              ))}
            </div>
          </div>
          { youtubeEmbed === 'inline' ?? <div className="xl:col-span-1">
            <YoutubeEmbed youtubeId={play.youtubeId} />
          </div> }
        </div>
      </article>
    </li>
  )
}