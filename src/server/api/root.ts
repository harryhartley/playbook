import { bookmarkRouter } from './routers/bookmark'
import { gameRouter } from './routers/game'
import { playRouter } from './routers/play'
import { userRouter } from './routers/user'
import { createTRPCRouter } from './trpc'

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  play: playRouter,
  user: userRouter,
  bookmark: bookmarkRouter,
  game: gameRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
