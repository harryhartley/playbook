import type { NextApiRequest, NextApiResponse } from "next";

import { createUploadthing, type FileRouter } from "uploadthing/next-legacy";
import { getServerAuthSession } from "./auth";

const f = createUploadthing();

const auth = async (req: NextApiRequest, res: NextApiResponse) =>
  await getServerAuthSession({ req, res });

export const ourFileRouter = {
  mp4Uploader: f({
    "video/mp4": {
      maxFileSize: "4MB",
      maxFileCount: 1,
      contentDisposition: "inline",
    },
  })
    .middleware(async ({ req, res }) => {
      const session = await auth(req, res);
      if (!session) throw new Error("Unauthorized");
      return { userId: session.user.id };
    })
    .onUploadComplete(({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);
      console.log("file url", file.url);
    }),

  pngUploader: f({
    "image/png": {
      maxFileSize: "1MB",
      maxFileCount: 1,
      contentDisposition: "inline",
    },
  })
    .middleware(async ({ req, res }) => {
      const session = await auth(req, res);
      if (!session) throw new Error("Unauthorized");
      return { userId: session.user.id };
    })
    .onUploadComplete(({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);
      console.log("file url", file.url);
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
