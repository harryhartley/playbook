import { z } from 'zod'

import { createTRPCRouter, protectedProcedure } from '../trpc'

export const bookmarkRouter = createTRPCRouter({
  get: protectedProcedure
    .input(
      z.object({
        userId: z.string().cuid(),
        playId: z.string().cuid(),
      })
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.bookmark.findUnique({
        where: { userId_playId: { userId: input.userId, playId: input.playId } },
      })
    }),
  getByUserId: protectedProcedure.input(z.string().cuid()).query(({ ctx, input }) => {
    return ctx.prisma.bookmark.findMany({ orderBy: [{ createdAt: 'desc' }], where: { userId: input } })
  }),
  getCountByUserId: protectedProcedure.input(z.string().cuid()).query(({ ctx, input }) => {
    return ctx.prisma.bookmark.count({ where: { userId: input } })
  }),
  create: protectedProcedure
    .input(
      z.object({
        userId: z.string().cuid(),
        playId: z.string().cuid(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.bookmark.create({ data: { userId: input.userId, playId: input.playId } })
    }),
  delete: protectedProcedure
    .input(
      z.object({
        userId: z.string().cuid(),
        playId: z.string().cuid(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.bookmark.delete({ where: { userId_playId: { userId: input.userId, playId: input.playId } } })
    }),
})
