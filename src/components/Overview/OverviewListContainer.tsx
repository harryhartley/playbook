import type { Bookmark, Play } from '@prisma/client'
import type { Dispatch, SetStateAction } from 'react'
import { formatDate } from '../../utils/date'
import { Pagination } from '../Pagination'

interface PlayListContainerProps {
  title?: string
  plays:
    | (Play & {
        user: {
          name: string | null
        }
        bookmarks: Bookmark[]
      })[]
    | undefined
  playsCount: number | undefined
  currentPage: number
  setCurrentPage: Dispatch<SetStateAction<number>>
  pageSize: number
  displayPlayCount?: boolean
}

export const OverviewListContainer = ({
  title,
  plays,
  playsCount,
  currentPage,
  setCurrentPage,
  pageSize,
  displayPlayCount = false,
}: PlayListContainerProps) => {
  return (
    <div className='divide-y'>
      {title && (
        <div className='space-y-2 pt-6 pb-8 md:space-y-5'>
          <h1 className='md:leading-14 font-radio-grotesk text-2xl font-extrabold leading-9 tracking-tight sm:text-3xl sm:leading-10 md:text-5xl'>
            {title}
          </h1>
        </div>
      )}

      {displayPlayCount && (
        <h2 className='md:leading-14 text-lg font-bold leading-9 tracking-tight sm:text-xl sm:leading-10 md:text-3xl'>
          Plays: {playsCount ?? 'loading'}
        </h2>
      )}

      {plays && playsCount && playsCount > 0 ? (
        <Pagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          itemCount={playsCount}
          pageSize={pageSize}
        />
      ) : null}

      <ul className='divide-y'>
        {!plays
          ? 'Loading plays...'
          : !playsCount || playsCount === 0
          ? 'No plays found'
          : // : plays.map((play, idx) => <PlayContainer key={idx} play={play} videoEmbed={'inline'} postButton={false} />)}
            plays.map((play, idx) => (
              <div key={idx} className='flex gap-2'>
                <div>{formatDate(play.createdAt)}</div>
                <div>{play.name}</div>
                <div>{play.videoEmbedUrl}</div>
              </div>
            ))}
      </ul>
    </div>
  )
}
