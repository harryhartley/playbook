import { z } from "zod";
import { moderatorOrAboveProtectedProcedure, createTRPCRouter } from "../trpc";
import { UTApi } from "uploadthing/server";
import { env } from "~/env.mjs";

export const uploadthingRouter = createTRPCRouter({
  deleteFiles: moderatorOrAboveProtectedProcedure
    .input(
      z.object({
        fileUrls: z.array(z.string()),
      }),
    )
    .mutation(async ({ input }) => {
      const utapi = new UTApi({ apiKey: env.UPLOADTHING_SECRET });
      const res = await utapi.deleteFiles(input.fileUrls);
      return res;
    }),
});
