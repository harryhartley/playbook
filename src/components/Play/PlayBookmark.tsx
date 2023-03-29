import { BookmarkIcon as BookmarkIconSolid } from '@heroicons/react/20/solid'
import { BookmarkIcon as BookmarkIconOutline } from '@heroicons/react/24/outline'
import type { Bookmark } from '@prisma/client'
import { useSession } from 'next-auth/react'
import { useState } from 'react'
import { api } from '../../utils/api'

interface PlayBookmarkProps {
  playId: string
  bookmarks: Bookmark[]
}

export const PlayBookmark = ({ playId, bookmarks }: PlayBookmarkProps) => {
  const { data: session } = useSession()

  const [isBookmarked, setIsBookmarked] = useState(bookmarks.length > 0)

  const createBookmark = api.bookmark.create.useMutation({
    onSuccess: () => setIsBookmarked(!isBookmarked),
  })
  const deleteBookmark = api.bookmark.delete.useMutation({
    onSuccess: () => setIsBookmarked(!isBookmarked),
  })

  return (
    <>
      {isBookmarked ? (
        <button onClick={() => deleteBookmark.mutate(playId)} className='text-yellow-400'>
          <BookmarkIconSolid className='h-7 w-7' />
        </button>
      ) : (
        <button onClick={() => session && createBookmark.mutate(playId)} className='text-yellow-400'>
          <BookmarkIconOutline className='h-7 w-7' />
        </button>
      )}
    </>
  )
}
