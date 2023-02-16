import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const playRouter = createTRPCRouter({
  getById: publicProcedure.input(
    z.string().cuid()
  )
  .query(({ ctx, input }) => {
      return ctx.prisma.play.findUnique({ where: { id: input }})
    }
  ),
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.play.findMany()
  })
});
