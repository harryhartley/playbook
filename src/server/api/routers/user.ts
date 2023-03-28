import { Role } from '@prisma/client'
import { z } from 'zod'

import { adminProtectedProcedure, createTRPCRouter, publicProcedure } from '../trpc'

export const userRouter = createTRPCRouter({
  getById: publicProcedure.input(z.string().cuid()).query(({ ctx, input }) => {
    return ctx.prisma.user.findUnique({ where: { id: input }, select: { name: true, image: true } })
  }),
  getAll: adminProtectedProcedure
    .input(
      z.object({
        currentPage: z.number().int().min(1),
        pageSize: z.number().int().min(1),
      })
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.user.findMany({
        orderBy: [{ name: 'desc' }],
        skip: (input.currentPage - 1) * input.pageSize,
        take: input.pageSize,
      })
    }),
  getCount: adminProtectedProcedure.query(({ ctx }) => {
    return ctx.prisma.user.count()
  }),
  banUserById: adminProtectedProcedure.input(z.string().cuid()).mutation(({ ctx, input }) => {
    return ctx.prisma.user.update({ where: { id: input }, data: { banned: true } })
  }),
  unbanUserById: adminProtectedProcedure.input(z.string().cuid()).mutation(({ ctx, input }) => {
    return ctx.prisma.user.update({ where: { id: input }, data: { banned: false } })
  }),
  assignRoleById: adminProtectedProcedure
    .input(z.object({ id: z.string().cuid(), role: z.nativeEnum(Role) }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.user.update({ where: { id: input.id }, data: { role: input.role } })
    }),
})
