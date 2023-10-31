import { playRouter } from "~/server/api/routers/play";
import { uploadthingRouter } from "~/server/api/routers/uploadthing";
import { createTRPCRouter } from "~/server/api/trpc";
import { bookmarkRouter } from "./routers/bookmark";
import { starRouter } from "./routers/star";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  play: playRouter,
  uploadthing: uploadthingRouter,
  bookmark: bookmarkRouter,
  star: starRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
