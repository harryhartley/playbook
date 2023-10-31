import { z } from "zod";
import {
  contributorOrAboveProtectedProcedure,
  createTRPCRouter,
} from "../trpc";
import { UTApi } from "uploadthing/server";
import { env } from "~/env.mjs";

export const uploadthingRouter = createTRPCRouter({
  deleteFile: contributorOrAboveProtectedProcedure
    .input(
      z.object({
        fileUrl: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const utapi = new UTApi({ apiKey: env.UPLOADTHING_SECRET });
      const res = await utapi.deleteFiles(input.fileUrl);
      return res;
    }),
});
