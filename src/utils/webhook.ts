import type { Play, User } from '@prisma/client'
import { env } from '../env.mjs'
import { siteMetadata } from './../data/siteMetadata'
import { getThumbnailUrl } from './youtube.js'

export const postToWebhook = (play: Play, user: User) => {
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
        timestamp: play.createdAt.toISOString(),
        image: {
          url: getThumbnailUrl(play.youtubeId),
          height: 0,
          width: 0,
        },
        author: {
          // name: `JaωDroթ`,
          name: user.name,
          url: `http://localhost:3000/user/${user.id}`,
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
}
