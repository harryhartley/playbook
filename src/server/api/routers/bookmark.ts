import { z } from 'zod'

import { createTRPCRouter, protectedProcedure } from '../trpc'

export const bookmarkRouter = createTRPCRouter({
  getByPlayId: protectedProcedure.input(z.string().cuid()).query(({ ctx, input }) => {
    return ctx.prisma.bookmark.findUnique({
      where: { userId_playId: { userId: ctx.session.user.id, playId: input } },
    })
  }),
  getByUserId: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.bookmark.findMany({ orderBy: [{ createdAt: 'desc' }], where: { userId: ctx.session.user.id } })
  }),
  create: protectedProcedure.input(z.string().cuid()).mutation(({ ctx, input }) => {
    return ctx.prisma.bookmark.create({ data: { userId: ctx.session.user.id, playId: input } })
  }),
  delete: protectedProcedure.input(z.string().cuid()).mutation(({ ctx, input }) => {
    return ctx.prisma.bookmark.delete({ where: { userId_playId: { userId: ctx.session.user.id, playId: input } } })
  }),
})
