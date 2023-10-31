import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const bookmarkRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.string().cuid())
    .mutation(({ ctx, input }) => {
      return ctx.db.bookmark.create({
        data: { userId: ctx.session.user.id, playId: input },
      });
    }),
  delete: protectedProcedure
    .input(z.string().cuid())
    .mutation(({ ctx, input }) => {
      return ctx.db.bookmark.delete({
        where: {
          userId_playId: { userId: ctx.session.user.id, playId: input },
        },
      });
    }),
});
