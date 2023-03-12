import { z } from 'zod'

import { createTRPCRouter, publicProcedure } from '../trpc'

export const userRouter = createTRPCRouter({
  getById: publicProcedure.input(z.string().cuid()).query(({ ctx, input }) => {
    return ctx.prisma.user.findUnique({ where: { id: input }, select: { name: true, image: true } })
  }),
})
