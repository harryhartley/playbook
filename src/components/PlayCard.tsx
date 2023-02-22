import { FireIcon } from "@heroicons/react/24/outline";
import type { Play } from "@prisma/client";
import Link from "next/link";

const YoutubeEmbed = ({ youtubeId }: { youtubeId: string }) => (
  <div className="video-responsive aspect-w-16 aspect-h-9">
    <iframe
      src={`https://www.youtube.com/embed/${youtubeId}?modestbranding=1&autohide=1&showinfo=0&controls=0${youtubeId.includes('?') ? '' : `&playlist=${youtubeId.slice(-11)}&loop=1`}`}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    />
  </div>
);

export const PlayCard = ({id, name, youtubeId, description, type, speed, environment, character, stage, difficulty}: Partial<Play>): JSX.Element => {
  return (
    <div className={`w-full mb-4 h-full shadow-lg bg-gray-800 border-gray-800 rounded-xl`}>
        {/* Youtube Embed */}
        {youtubeId && <YoutubeEmbed youtubeId={youtubeId} />}
        <div className="p-4">
          <div className="flex-initial">
            {/* Title */}
            <div className="title text-xl text-white cursor hover:underline mb-2">
              <Link href={{ pathname: '/play/[id]', query: { id } }}>
                {name}
              </Link>
            </div>
            {/* Fire Icons */}
            <div>
              {Array(difficulty).fill(0).map((e, i) => (
                <button key={`fire-${i}`} className="mb-3 text-red-500">
                    <FireIcon className="h-8 w-8" />
                </button>
              ))}
            </div>
          </div>
          {/* Badges */}
          <div className="flex gap-1 mb-2">
            <span className="badge bg-indigo-500 text-blue-100 rounded px-1 text-xs">{type}</span>
            <span className="badge bg-indigo-500 text-blue-100 rounded px-1 text-xs">{character}</span>
            <span className="badge bg-indigo-500 text-blue-100 rounded px-1 text-xs">{stage}</span>
            <span className="badge bg-indigo-500 text-blue-100 rounded px-1 text-xs">{speed} Speed</span>
            <span className="badge bg-indigo-500 text-blue-100 rounded px-1 text-xs">{environment}</span>
          </div>
          {/* Description */}
          <span className="description text-sm text-white py-2">{description}</span>
        </div>
    </div>
  );
};