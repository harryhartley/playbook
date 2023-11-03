import { z } from "zod";

import { Character, Environment, Speed, Stage, Type } from "@prisma/client";
import { isUserModeratorOrAbove } from "~/utils/auth";
import {
  contributorOrAboveProtectedProcedure,
  createTRPCRouter,
  moderatorOrAboveProtectedProcedure,
  protectedProcedure,
  publicProcedure,
} from "../trpc";

export const playRouter = createTRPCRouter({
  getById: publicProcedure.input(z.string().cuid()).query(({ ctx, input }) => {
    return ctx.db.play.findUnique({
      where: { id: input },
      include: {
        _count: {
          select: {
            bookmarks: { where: { userId: ctx.session?.user.id } },
            stars: true,
          },
        },
        user: { select: { id: true, name: true, image: true } },
      },
    });
  }),
  create: contributorOrAboveProtectedProcedure
    .input(
      z.object({
        name: z.string(),
        videoUrl: z.string(),
        thumbnailUrl: z.string().optional(),
        description: z.string().optional(),
        type: z.nativeEnum(Type),
        speed: z.nativeEnum(Speed),
        environment: z.nativeEnum(Environment),
        character: z.nativeEnum(Character),
        stage: z.nativeEnum(Stage),
        difficulty: z.number().int().min(1).max(5),
        gameAbbr: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.game.update({
        where: { abbreviation: input.gameAbbr },
        data: {
          plays: {
            create: {
              userId: ctx.session.user.id,
              name: input.name,
              videoUrl: input.videoUrl,
              thumbnailUrl: input.thumbnailUrl,
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
      });
    }),
  update: moderatorOrAboveProtectedProcedure
    .input(
      z.object({
        id: z.string().cuid(),
        name: z.string(),
        videoUrl: z.string(),
        thumbnailUrl: z.string().optional(),
        description: z.string().optional(),
        type: z.nativeEnum(Type),
        speed: z.nativeEnum(Speed),
        environment: z.nativeEnum(Environment),
        character: z.nativeEnum(Character),
        stage: z.nativeEnum(Stage),
        difficulty: z.number().int().min(1).max(5),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.play.update({
        where: { id: input.id },
        data: {
          name: input.name,
          videoUrl: input.videoUrl,
          thumbnailUrl: input.thumbnailUrl,
          description: input.description,
          type: input.type,
          speed: input.speed,
          environment: input.environment,
          character: input.character,
          stage: input.stage,
          difficulty: input.difficulty,
        },
      });
    }),
  getAllUnapproved: moderatorOrAboveProtectedProcedure
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
      }),
    )
    .query(async ({ ctx, input }) => {
      const count = await ctx.db.play.count({
        where: {
          approved: false,
          archived: false,
          character: input.filter?.c,
          environment: input.filter?.e,
          type: input.filter?.t,
          stage: input.filter?.st,
          speed: input.filter?.sp,
          difficulty: input.filter?.d,
        },
      });
      const plays = await ctx.db.play.findMany({
        orderBy: [{ createdAt: "desc" }],
        where: {
          approved: false,
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
        include: {
          _count: {
            select: {
              bookmarks: { where: { userId: ctx.session?.user.id } },
              stars: true,
            },
          },
          user: { select: { id: true, name: true, image: true } },
        },
      });
      return { plays, count };
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
      }),
    )
    .query(async ({ ctx, input }) => {
      const count = await ctx.db.play.count({
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
      });
      const plays = await ctx.db.play.findMany({
        orderBy: [{ createdAt: "desc" }],
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
        include: {
          _count: {
            select: {
              bookmarks: { where: { userId: ctx.session?.user.id } },
              stars: true,
            },
          },
          user: { select: { id: true, name: true, image: true } },
        },
      });
      return { plays, count };
    }),
  getAllBookmarked: protectedProcedure
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
      }),
    )
    .query(async ({ ctx, input }) => {
      const count = await ctx.db.play.count({
        where: {
          approved: true,
          archived: false,
          character: input.filter?.c,
          environment: input.filter?.e,
          type: input.filter?.t,
          stage: input.filter?.st,
          speed: input.filter?.sp,
          difficulty: input.filter?.d,
          bookmarks: { some: { userId: ctx.session.user.id } },
        },
      });
      const plays = await ctx.db.play.findMany({
        orderBy: [{ createdAt: "desc" }],
        where: {
          approved: true,
          archived: false,
          character: input.filter?.c,
          environment: input.filter?.e,
          type: input.filter?.t,
          stage: input.filter?.st,
          speed: input.filter?.sp,
          difficulty: input.filter?.d,
          bookmarks: { some: { userId: ctx.session.user.id } },
        },
        skip: (input.currentPage - 1) * input.pageSize,
        take: input.pageSize,
        include: {
          _count: {
            select: {
              bookmarks: { where: { userId: ctx.session?.user.id } },
              stars: true,
            },
          },
          user: { select: { id: true, name: true, image: true } },
        },
      });
      return { plays, count };
    }),
  getAllStarred: protectedProcedure
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
      }),
    )
    .query(async ({ ctx, input }) => {
      const count = await ctx.db.play.count({
        where: {
          approved: true,
          archived: false,
          character: input.filter?.c,
          environment: input.filter?.e,
          type: input.filter?.t,
          stage: input.filter?.st,
          speed: input.filter?.sp,
          difficulty: input.filter?.d,
          stars: { some: { userId: ctx.session.user.id } },
        },
      });
      const plays = await ctx.db.play.findMany({
        orderBy: [{ createdAt: "desc" }],
        where: {
          approved: true,
          archived: false,
          character: input.filter?.c,
          environment: input.filter?.e,
          type: input.filter?.t,
          stage: input.filter?.st,
          speed: input.filter?.sp,
          difficulty: input.filter?.d,
          stars: { some: { userId: ctx.session.user.id } },
        },
        skip: (input.currentPage - 1) * input.pageSize,
        take: input.pageSize,
        include: {
          _count: {
            select: {
              bookmarks: { where: { userId: ctx.session?.user.id } },
              stars: true,
            },
          },
          user: { select: { id: true, name: true, image: true } },
        },
      });
      return { plays, count };
    }),
  approveById: moderatorOrAboveProtectedProcedure
    .input(z.string().cuid())
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.play.update({
        where: { id: input },
        data: { approved: true },
      });
    }),
  unapproveById: moderatorOrAboveProtectedProcedure
    .input(z.string().cuid())
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.play.update({
        where: { id: input },
        data: { approved: false },
      });
    }),
  archiveById: moderatorOrAboveProtectedProcedure
    .input(z.string().cuid())
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.play.update({
        where: { id: input },
        data: { archived: true },
      });
    }),
  unarchiveById: moderatorOrAboveProtectedProcedure
    .input(z.string().cuid())
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.play.update({
        where: { id: input },
        data: { archived: false },
      });
    }),
});
