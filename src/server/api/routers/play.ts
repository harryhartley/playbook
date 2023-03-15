import { z } from 'zod'
import { adminProtectedProcedure, protectedProcedure } from './../trpc'

import { Character, Environment, Speed, Stage, Type } from '@prisma/client'
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
  getCountByUserId: publicProcedure.input(z.string().cuid()).query(({ ctx, input }) => {
    return ctx.prisma.play.count({
      where: { userId: input, archived: false },
    })
  }),
  getAllApproved: publicProcedure
    .input(
      z.object({
        currentPage: z.number().int().min(1),
        pageSize: z.number().int().min(1),
        filter: z
          .object({
            c: z.nativeEnum(Character).optional(),
            e: z.nativeEnum(Environment).optional(),
            t: z.nativeEnum(Type).optional(),
            st: z.nativeEnum(Stage).optional(),
            sp: z.nativeEnum(Speed).optional(),
            d: z.number().int().min(1).max(5).optional(),
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
          character: input.filter?.c,
          environment: input.filter?.e,
          type: input.filter?.t,
          stage: input.filter?.st,
          speed: input.filter?.sp,
          difficulty: input.filter?.d,
        },
        skip: (input.currentPage - 1) * input.pageSize,
        take: input.pageSize,
        include: { user: { select: { name: true } } },
      })
    }),
  getCountApproved: protectedProcedure
    .input(
      z.object({
        filter: z
          .object({
            c: z.nativeEnum(Character).optional(),
            e: z.nativeEnum(Environment).optional(),
            t: z.nativeEnum(Type).optional(),
            st: z.nativeEnum(Stage).optional(),
            sp: z.nativeEnum(Speed).optional(),
            d: z.number().int().min(1).max(5).optional(),
          })
          .optional(),
      })
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.play.count({
        where: {
          approved: true,
          archived: false,
          character: input.filter?.c,
          environment: input.filter?.e,
          type: input.filter?.t,
          stage: input.filter?.st,
          speed: input.filter?.sp,
          difficulty: input.filter?.d,
        },
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
  getCountUnapproved: moderatorOrAboveProtectedProcedure.query(({ ctx }) => {
    return ctx.prisma.play.count({
      where: { approved: false, archived: false },
    })
  }),
  getAllBookmarked: protectedProcedure
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
  getCountBookmarked: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.play.count({
      where: { bookmarks: { some: { userId: ctx.session.user.id } }, archived: false },
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
        type: z.nativeEnum(Type),
        speed: z.nativeEnum(Speed),
        environment: z.nativeEnum(Environment),
        character: z.nativeEnum(Character),
        stage: z.nativeEnum(Stage),
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
              type: input.type,
              speed: input.speed,
              environment: input.environment,
              character: input.character,
              stage: input.stage,
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
          type: z.nativeEnum(Type),
          speed: z.nativeEnum(Speed),
          environment: z.nativeEnum(Environment),
          character: z.nativeEnum(Character),
          stage: z.nativeEnum(Stage),
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
          type: input.data.type,
          speed: input.data.speed,
          environment: input.data.environment,
          character: input.data.character,
          stage: input.data.stage,
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
