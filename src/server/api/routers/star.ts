import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const starRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.string().cuid())
    .mutation(({ ctx, input }) => {
      return ctx.db.star.create({
        data: { userId: ctx.session.user.id, playId: input },
      });
    }),
  delete: protectedProcedure
    .input(z.string().cuid())
    .mutation(({ ctx, input }) => {
      return ctx.db.star.delete({
        where: {
          userId_playId: { userId: ctx.session.user.id, playId: input },
        },
      });
    }),
});
