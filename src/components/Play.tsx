import type { Play as PlayType } from '@prisma/client'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useState } from 'react'
import { api } from '../utils/api'
import { isUserModeratorOrAbove } from '../utils/auth'
import { PlayCard } from './PlayCard'

const YoutubeEmbed = ({ youtubeId }: { youtubeId: string }) => (
  <div className='video-responsive aspect-w-16 aspect-h-9'>
    <iframe
      src={`${
        youtubeId.includes('?')
          ? youtubeId
          : `${
              youtubeId.split('?clip')[0] ?? ''
            }?modestbranding=1&autohide=1&showinfo=0&controls=0&playlist=${youtubeId.slice(-11)}&loop=1`
      }`}
      allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
    />
  </div>
)

interface PlayProps {
  play: PlayType
  youtubeEmbed: 'inline' | 'above' | 'none'
}

export const Play = ({ play, youtubeEmbed }: PlayProps) => {
  const [hidden, setHidden] = useState('block')
  const id = play.id

  const { data: session } = useSession()
  const approvePlay = api.play.approveById.useMutation()
  const unapprovePlay = api.play.unapproveById.useMutation()
  const deletePlay = api.play.deleteById.useMutation()

  return (
    <li className={`py-6 ${hidden}`}>
      <article>
        {youtubeEmbed === 'above' && (
          <div className='xl:col-span-1'>
            <YoutubeEmbed youtubeId={play.youtubeId} />
          </div>
        )}
        <div className='space-y-2 xl:grid xl:grid-cols-3 xl:space-y-0'>
          <div className='space-y-2 xl:col-span-2'>
            <PlayCard play={play} />
            {/* move buttons to new component and refactor - loads of duplicated code here */}
            {session && isUserModeratorOrAbove(session?.user.role) && (
              <>
                <Link
                  href={{ pathname: '/submit/[id]', query: { id } }}
                  className='group relative mb-2 mr-2 inline-flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 p-0.5 text-sm font-medium text-gray-900 hover:text-white focus:outline-none focus:ring-4 focus:ring-cyan-200 group-hover:from-cyan-500 group-hover:to-blue-500 dark:text-white dark:focus:ring-cyan-800'
                >
                  <span className='relative rounded-md bg-white px-5 py-2.5 transition-all duration-75 ease-in group-hover:bg-opacity-0 dark:bg-gray-900'>
                    Edit
                  </span>
                </Link>
                {play.approved ? (
                  <button
                    onClick={() => {
                      unapprovePlay.mutate(id)
                      setHidden('hidden')
                    }}
                    className='group relative mb-2 mr-2 inline-flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-pink-500 to-orange-400 p-0.5 text-sm font-medium text-gray-900 hover:text-white focus:outline-none focus:ring-4 focus:ring-pink-200 group-hover:from-pink-500 group-hover:to-orange-400 dark:text-white dark:focus:ring-pink-800'
                  >
                    <span className='relative rounded-md bg-white px-5 py-2.5 transition-all duration-75 ease-in group-hover:bg-opacity-0 dark:bg-gray-900'>
                      Unapprove
                    </span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      approvePlay.mutate(id)
                      setHidden('hidden')
                    }}
                    className='group relative mb-2 mr-2 inline-flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-teal-300 to-lime-300 p-0.5 text-sm font-medium text-gray-900 focus:outline-none focus:ring-4 focus:ring-lime-200 group-hover:from-teal-300 group-hover:to-lime-300 dark:text-white dark:hover:text-gray-900 dark:focus:ring-lime-800'
                  >
                    <span className='relative rounded-md bg-white px-5 py-2.5 transition-all duration-75 ease-in group-hover:bg-opacity-0 dark:bg-gray-900'>
                      Approve
                    </span>
                  </button>
                )}
                {!play.approved && (
                  <button
                    onClick={() => {
                      deletePlay.mutate(id)
                      setHidden('hidden')
                    }}
                    className='group relative mb-2 mr-2 inline-flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-pink-500 to-orange-400 p-0.5 text-sm font-medium text-gray-900 hover:text-white focus:outline-none focus:ring-4 focus:ring-pink-200 group-hover:from-pink-500 group-hover:to-orange-400 dark:text-white dark:focus:ring-pink-800'
                  >
                    <span className='relative rounded-md bg-white px-5 py-2.5 transition-all duration-75 ease-in group-hover:bg-opacity-0 dark:bg-gray-900'>
                      Delete
                    </span>
                  </button>
                )}
              </>
            )}
          </div>
          {youtubeEmbed === 'inline' && (
            <div className='xl:col-span-1'>
              <YoutubeEmbed youtubeId={play.youtubeId} />
            </div>
          )}
        </div>
      </article>
    </li>
  )
}
