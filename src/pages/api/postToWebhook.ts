import type { Play } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'
import { siteMetadata } from '../../data/siteMetadata'
import { env } from '../../env.mjs'
import { getServerAuthSession } from '../../server/auth'
import { isUserModeratorOrAbove } from '../../utils/auth'
import { getThumbnailUrl } from '../../utils/video'

const postToWebhook = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerAuthSession({ req, res })
  const play = JSON.parse(req.body as string) as Play & { user: { name: string | null } }

  if (!session || (session && !isUserModeratorOrAbove(session.user.role ?? ''))) {
    res.status(401).json('Not authorised')
  } else {
    switch (req.method) {
      case 'POST':
        const params = {
          username: siteMetadata.title,
          content: 'A new play has been uploaded to the playbook!',
          avatar_url: 'https://i.ytimg.com/vi/SdorjQIf5V0/maxresdefault.jpg',
          tts: false,
          embeds: [
            {
              type: 'rich',
              title: play.name,
              description: play.description,
              color: 0x00ffff,
              timestamp: play.createdAt.toString(),
              image: {
                url: getThumbnailUrl(play.videoEmbedUrl),
                height: 0,
                width: 0,
              },
              author: {
                name: play.user.name,
                url: `http://hyhy.gg/user/${play.userId}`,
              },
              url: `http://hyhy.gg/play/${play.id}`,
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
        break

      default:
        res.setHeader('Allow', ['POST'])
        res.status(405).json(`Method ${req.method ?? ''} not allowed`)
    }
  }
}

export default postToWebhook
