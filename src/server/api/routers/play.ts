import { z } from 'zod'
import { protectedProcedure } from './../trpc'

import type { Character, Environment, Speed, Stage, Type } from '@prisma/client'
import { createTRPCRouter, moderatorOrAboveProtectedProcedure, publicProcedure } from '../trpc'

export const playRouter = createTRPCRouter({
  getById: publicProcedure.input(z.string().cuid()).query(({ ctx, input }) => {
    return ctx.prisma.play.findUnique({ where: { id: input } })
  }),
  getAllByUserId: publicProcedure.input(z.string().cuid()).query(({ ctx, input }) => {
    return ctx.prisma.play.findMany({ where: { userId: input } })
  }),
  getAllApproved: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.play.findMany({ orderBy: [{ createdAt: 'desc' }], where: { approved: true } })
  }),
  getAllUnapproved: moderatorOrAboveProtectedProcedure.query(({ ctx }) => {
    return ctx.prisma.play.findMany({ orderBy: [{ createdAt: 'desc' }], where: { approved: false } })
  }),
  approveById: moderatorOrAboveProtectedProcedure.input(z.string().cuid()).mutation(({ ctx, input }) => {
    return ctx.prisma.play.update({ where: { id: input }, data: { approved: true } })
  }),
  unapproveById: moderatorOrAboveProtectedProcedure.input(z.string().cuid()).mutation(({ ctx, input }) => {
    return ctx.prisma.play.update({ where: { id: input }, data: { approved: false } })
  }),
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        youtubeId: z.string(),
        description: z.string(),
        type: z.string(),
        speed: z.string(),
        environment: z.string(),
        character: z.string(),
        stage: z.string(),
        difficulty: z.number().int().min(1).max(5),
        userId: z.string().cuid(),
        approved: z.boolean(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.user.update({
        where: {
          id: input.userId,
        },
        data: {
          plays: {
            create: {
              name: input.name,
              youtubeId: input.youtubeId,
              description: input.description,
              type: input.type as Type,
              speed: input.speed as Speed,
              environment: input.environment as Environment,
              character: input.character as Character,
              stage: input.stage as Stage,
              difficulty: input.difficulty,
              approved: input.approved,
            },
          },
        },
      })
    }),
  deleteById: moderatorOrAboveProtectedProcedure.input(z.string().cuid()).mutation(({ ctx, input }) => {
    return ctx.prisma.play.delete({ where: { id: input } })
  }),
})
