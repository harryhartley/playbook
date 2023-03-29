import type { Bookmark, Play as PlayType } from '@prisma/client'
import { useSession } from 'next-auth/react'
import { useState } from 'react'
import { isUserModeratorOrAbove } from '../../utils/auth'
import { PlayAdminButtons } from './PlayAdminButtons'
import { PlayData } from './PlayData'
import { YoutubeEmbed } from './YoutubeEmbed'

interface PlayContainerProps {
  play: PlayType & { user: { name: string | null }; bookmarks: Bookmark[] }
  youtubeEmbed: 'inline' | 'above' | 'none'
  postButton: boolean
}

export const PlayContainer = ({ play, youtubeEmbed, postButton }: PlayContainerProps) => {
  const [hidden, setHidden] = useState('block')

  const { data: session } = useSession()

  return (
    <li className={`py-6 ${hidden}`}>
      <article>
        {youtubeEmbed === 'above' && (
          <div className='xl:col-span-1'>
            <YoutubeEmbed youtubeId={play.youtubeId} controls={true} />
          </div>
        )}
        <div className='space-y-2 xl:grid xl:grid-cols-3 xl:space-y-0'>
          <div className='space-y-2 xl:col-span-2'>
            <PlayData play={play} />
            {session && isUserModeratorOrAbove(session?.user.role) && (
              <PlayAdminButtons play={play} postButton={postButton} setHidden={setHidden} />
            )}
          </div>
          {youtubeEmbed === 'inline' && (
            <div className='xl:col-span-1'>
              <YoutubeEmbed youtubeId={play.youtubeId} controls={false} />
            </div>
          )}
        </div>
      </article>
    </li>
  )
}
