/* eslint-disable @typescript-eslint/no-extra-semi */
import { FireIcon } from '@heroicons/react/24/outline'
import type { Bookmark, Play as PlayType } from '@prisma/client'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { formatDate } from '../../utils/date'
import { PlayBookmark } from './PlayBookmark'
import { PlayTag } from './PlayTag'

interface PlayDataProps {
  play: PlayType & { user: { name: string | null }; bookmarks: Bookmark[] }
  displayBookmark?: boolean
}

export const PlayData = ({ play, displayBookmark = true }: PlayDataProps) => {
  const { data: session } = useSession()
  const playId = play.id
  const userId = play.userId

  return (
    <div className='space-y-2'>
      <div>
        <h2 className='text-2xl font-bold leading-8 tracking-tight'>
          <p className='text-base font-medium leading-6 text-gray-500'>
            <time dateTime={formatDate(play.createdAt)}>{formatDate(play.createdAt)}</time>
          </p>
          <div className='flex items-center gap-4'>
            {session && displayBookmark && <PlayBookmark playId={playId} bookmarks={play.bookmarks} />}
            <Link href={{ pathname: '/play/[playId]', query: { playId } }}>{play.name}</Link>
            <p className='text-sm text-gray-400'>
              by <Link href={{ pathname: '/user/[userId]', query: { userId } }}>{play.user.name}</Link>
            </p>
          </div>
        </h2>
        <div className='flex flex-wrap gap-2'>
          {[play.character, play.type, play.speed, play.stage, play.environment]
            .filter((tag) => tag !== 'All')
            .map((tag, idx) => (
              <PlayTag key={idx} text={tag} />
            ))}
          <div>
            {Array(play.difficulty)
              .fill(0)
              .map((e, i) => (
                <button key={`fire-${i}`} className='text-red-400'>
                  <FireIcon className='h-4 w-4' />
                </button>
              ))}
          </div>
        </div>
      </div>
      <div className='prose max-w-none text-gray-500'>{play.description}</div>
    </div>
  )
}
