import type { Bookmark, Play as PlayType } from '@prisma/client'
import { useSession } from 'next-auth/react'
import { useState } from 'react'
import { isUserModeratorOrAbove } from '../../utils/auth'
import { PlayAdminButtons } from './PlayAdminButtons'
import { PlayData } from './PlayData'
import { VideoEmbed } from './VideoEmbed'

interface PlayContainerProps {
  play: PlayType & { user: { name: string | null }; bookmarks: Bookmark[] }
  videoEmbed: 'inline' | 'above' | 'none'
  postButton: boolean
}

export const PlayContainer = ({ play, videoEmbed, postButton }: PlayContainerProps) => {
  const [hidden, setHidden] = useState('block')

  const { data: session } = useSession()

  return (
    <li className={`py-6 ${hidden}`}>
      <article>
        {videoEmbed === 'above' && (
          <div className='xl:col-span-1'>
            <VideoEmbed videoEmbedUrl={play.videoEmbedUrl} controls={true} />
          </div>
        )}
        <div className='space-y-2 xl:grid xl:grid-cols-3 xl:space-y-0'>
          <div className='space-y-2 xl:col-span-2'>
            <PlayData play={play} />
            {session && isUserModeratorOrAbove(session?.user.role) && (
              <PlayAdminButtons play={play} postButton={postButton} setHidden={setHidden} />
            )}
          </div>
          {videoEmbed === 'inline' && (
            <div className='xl:col-span-1'>
              <VideoEmbed videoEmbedUrl={play.videoEmbedUrl} controls={false} />
            </div>
          )}
        </div>
      </article>
    </li>
  )
}
