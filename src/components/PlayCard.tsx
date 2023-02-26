import { FireIcon } from '@heroicons/react/24/outline'
import type { Play as PlayType } from '@prisma/client'
import Link from 'next/link'
import { api } from '../utils/api'
import { Tag } from './Tag'

const formatDate = (date: Date) => {
  return date.toISOString().split('T')[0]
}

interface PlayCardProps {
  play: PlayType
}

export const PlayCard = ({ play }: PlayCardProps) => {
  const id = play.id
  const { data: user } = api.user.getById.useQuery(play.userId)

  return (
    <div className='space-y-2'>
      <div>
        <h2 className='text-2xl font-bold leading-8 tracking-tight'>
          <p className='text-base font-medium leading-6 text-gray-500'>
            <time dateTime={formatDate(play.createdAt)}>{formatDate(play.createdAt)}</time>
          </p>
          <div className='flex items-center gap-4'>
            <Link href={{ pathname: '/play/[id]', query: { id } }}>{play.name}</Link>
            <p className='text-sm text-gray-400'>by {user?.name}</p>
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
