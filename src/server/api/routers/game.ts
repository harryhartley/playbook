import { z } from 'zod'

import { createTRPCRouter, publicProcedure } from '../trpc'

export const gameRouter = createTRPCRouter({
  getByGameAbbr: publicProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.prisma.game.findUnique({ where: { abbreviation: input } })
  }),
})
