import type { Play } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'
import { siteMetadata } from '../../data/siteMetadata'
import { env } from '../../env.mjs'
import { getThumbnailUrl } from '../../utils/youtube'

const postToWebhook = (req: NextApiRequest, res: NextApiResponse) => {
  const play = JSON.parse(req.body as string) as Play & { user: { name: string | null } }

  const params = {
    username: siteMetadata.title,
    avatar_url: '',
    tts: false,
    embeds: [
      {
        type: 'rich',
        title: play.name,
        description: play.description,
        color: 0x00ffff,
        timestamp: play.createdAt.toString(),
        image: {
          url: getThumbnailUrl(play.youtubeId),
          height: 0,
          width: 0,
        },
        author: {
          name: play.user.name,
          url: `http://localhost:3000/user/${play.userId}`,
        },
        url: `http://localhost:3000/play/${play.id}`,
      },
    ],
  }
  void fetch(env.WEBHOOK_URL, {
    method: 'POST',
    body: JSON.stringify(params),
    headers: {
      'Content-Type': 'application/json',
    },
  })

  res.status(200).json({ success: true, message: `Play ${play.id} successfully posted` })
}

export default postToWebhook
