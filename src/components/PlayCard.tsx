/* eslint-disable @typescript-eslint/no-extra-semi */
import { BookmarkIcon as BookmarkIconSolid } from '@heroicons/react/20/solid'
import { BookmarkIcon as BookmarkIconOutline, FireIcon } from '@heroicons/react/24/outline'
import type { Play as PlayType } from '@prisma/client'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { api } from '../utils/api'
import { Tag } from './Tag'

const formatDate = (date: Date) => {
  return date.toISOString().split('T')[0]
}

interface PlayCardProps {
  play: Omit<PlayType, 'archived'> & { user: { name: string | null } }
  displayBookmark?: boolean
}

export const PlayCard = ({ play, displayBookmark = true }: PlayCardProps) => {
  const { data: session } = useSession()
  const playId = play.id
  const userId = play.userId

  const { data: bookmark, refetch: refetchBookmark } = api.bookmark.get.useQuery(playId, {
    enabled: !!session && displayBookmark,
    refetchOnWindowFocus: false,
  })

  const createBookmark = api.bookmark.create.useMutation({
    onSuccess: () => refetchBookmark(),
  })
  const deleteBookmark = api.bookmark.delete.useMutation({
    onSuccess: () => refetchBookmark(),
  })

  return (
    <div className='space-y-2'>
      <div>
        <h2 className='text-2xl font-bold leading-8 tracking-tight'>
          <p className='text-base font-medium leading-6 text-gray-500'>
            <time dateTime={formatDate(play.createdAt)}>{formatDate(play.createdAt)}</time>
          </p>
          <div className='flex items-center gap-4'>
            {session &&
              displayBookmark &&
              (bookmark ? (
                <button onClick={() => deleteBookmark.mutate(playId)} className='text-yellow-400'>
                  <BookmarkIconSolid className='h-7 w-7' />
                </button>
              ) : (
                <button onClick={() => session && createBookmark.mutate(playId)} className='text-yellow-400'>
                  <BookmarkIconOutline className='h-7 w-7' />
                </button>
              ))}
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
              <Tag key={idx} text={tag} />
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
