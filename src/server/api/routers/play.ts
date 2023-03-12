import { z } from 'zod'
import { adminProtectedProcedure, protectedProcedure } from './../trpc'

import type { Character, Environment, Speed, Stage, Type } from '@prisma/client'
import { isUserModeratorOrAbove } from '../../../utils/auth'
import {
  contributorOrAboveProtectedProcedure,
  createTRPCRouter,
  moderatorOrAboveProtectedProcedure,
  publicProcedure,
} from '../trpc'

export const playRouter = createTRPCRouter({
  getById: publicProcedure.input(z.string().cuid()).query(({ ctx, input }) => {
    return ctx.prisma.play.findUnique({ where: { id: input }, include: { user: { select: { name: true } } } })
  }),
  getAllByUserId: publicProcedure
    .input(
      z.object({
        userId: z.string().cuid(),
        currentPage: z.number().int().min(1),
        pageSize: z.number().int().min(1),
      })
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.play.findMany({
        orderBy: [{ createdAt: 'desc' }],
        where: { userId: input.userId, archived: false },
        skip: (input.currentPage - 1) * input.pageSize,
        take: input.pageSize,
        include: { user: { select: { name: true } } },
      })
    }),
  getCountApproved: publicProcedure
    .input(
      z
        .object({
          c: z.string().optional(),
          e: z.string().optional(),
          t: z.string().optional(),
          st: z.string().optional(),
          sp: z.string().optional(),
          d: z.number().optional(),
        })
        .optional()
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.play.count({
        where: {
          approved: true,
          character: input?.c as Character,
          environment: input?.e as Environment,
          type: input?.t as Type,
          stage: input?.st as Stage,
          speed: input?.sp as Speed,
          difficulty: input?.d,
        },
      })
    }),
  getCountUnapproved: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.play.count({ where: { approved: false } })
  }),
  getAllApproved: publicProcedure
    .input(
      z.object({
        currentPage: z.number().int().min(1),
        pageSize: z.number().int().min(1),
        filter: z
          .object({
            c: z.string().optional(),
            e: z.string().optional(),
            t: z.string().optional(),
            st: z.string().optional(),
            sp: z.string().optional(),
            d: z.number().optional(),
          })
          .optional(),
      })
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.play.findMany({
        orderBy: [{ createdAt: 'desc' }],
        where: {
          approved: true,
          archived: false,
          character: input.filter?.c as Character,
          environment: input.filter?.e as Environment,
          type: input.filter?.t as Type,
          stage: input.filter?.st as Stage,
          speed: input.filter?.sp as Speed,
          difficulty: input.filter?.d,
        },
        skip: (input.currentPage - 1) * input.pageSize,
        take: input.pageSize,
        include: { user: { select: { name: true } } },
      })
    }),
  getBookmarkedPlays: protectedProcedure
    .input(
      z.object({
        currentPage: z.number().int().min(1),
        pageSize: z.number().int().min(1),
      })
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.play.findMany({
        orderBy: [{ createdAt: 'desc' }],
        where: { bookmarks: { some: { userId: ctx.session.user.id } }, archived: false },
        skip: (input.currentPage - 1) * input.pageSize,
        take: input.pageSize,
        include: { user: { select: { name: true } } },
      })
    }),
  getAllUnapproved: moderatorOrAboveProtectedProcedure
    .input(
      z.object({
        currentPage: z.number().int().min(1),
        pageSize: z.number().int().min(1),
      })
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.play.findMany({
        orderBy: [{ createdAt: 'desc' }],
        where: { approved: false, archived: false },
        skip: (input.currentPage - 1) * input.pageSize,
        take: input.pageSize,
        include: { user: { select: { name: true } } },
      })
    }),
  approveById: moderatorOrAboveProtectedProcedure.input(z.string().cuid()).mutation(({ ctx, input }) => {
    return ctx.prisma.play.update({ where: { id: input }, data: { approved: true } })
  }),
  unapproveById: moderatorOrAboveProtectedProcedure.input(z.string().cuid()).mutation(({ ctx, input }) => {
    return ctx.prisma.play.update({ where: { id: input }, data: { approved: false } })
  }),
  create: contributorOrAboveProtectedProcedure
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
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.user.update({
        where: {
          id: ctx.session.user.id,
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
              approved: isUserModeratorOrAbove(ctx.session.user.role),
            },
          },
        },
      })
    }),
  updateById: moderatorOrAboveProtectedProcedure
    .input(
      z.object({
        id: z.string().cuid(),
        data: z.object({
          name: z.string(),
          youtubeId: z.string(),
          description: z.string(),
          type: z.string(),
          speed: z.string(),
          environment: z.string(),
          character: z.string(),
          stage: z.string(),
          difficulty: z.number().int().min(1).max(5),
        }),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.play.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.data.name,
          youtubeId: input.data.youtubeId,
          description: input.data.description,
          type: input.data.type as Type,
          speed: input.data.speed as Speed,
          environment: input.data.environment as Environment,
          character: input.data.character as Character,
          stage: input.data.stage as Stage,
          difficulty: input.data.difficulty,
        },
      })
    }),
  deleteById: adminProtectedProcedure.input(z.string().cuid()).mutation(({ ctx, input }) => {
    return ctx.prisma.play.delete({ where: { id: input } })
  }),
  archiveById: moderatorOrAboveProtectedProcedure.input(z.string().cuid()).mutation(({ ctx, input }) => {
    return ctx.prisma.play.update({ where: { id: input }, data: { archived: true } })
  }),
})
