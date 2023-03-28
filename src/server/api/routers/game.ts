import { z } from 'zod'

import { createTRPCRouter, protectedProcedure } from '../trpc'

export const gameRouter = createTRPCRouter({
  getByGameAbbr: protectedProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.prisma.game.findUnique({ where: { abbreviation: input } })
  }),
})
