import { type NextPage } from "next";
import { useRouter } from "next/router";
import { BeatLoader } from "react-spinners";
import { api } from "../../utils/api";
import { PlayGridItem } from "~/components/play_grid/play_grid_item";

// export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
//   const session = await getServerAuthSession(ctx);

//   const ssg = createProxySSGHelpers({
//     router: appRouter,
//     ctx: createInnerTRPCContext({ session }),
//     transformer: superjson,
//   });

//   if (typeof ctx.query.playId === "string") {
//     await ssg.play.getById.fetch(ctx.query.playId);
//   }

//   return {
//     props: {
//       trpcState: ssg.dehydrate(),
//     },
//   };
// };

const Home: NextPage = () => {
  const { query } = useRouter();
  if (typeof query.playId !== "string") return <p>Bad ID</p>;

  const { data: play, isLoading: isLoadingPlay } = api.play.getById.useQuery(
    query.playId,
    {
      refetchOnWindowFocus: false,
    },
  );

  return (
    <>
      {/* <Head>
        {play && (
          <>
            <meta property="og:title" content={play.name} />
            <meta property="og:description" content={play.description ?? ""} />
            <meta
              property="og:url"
              content={`https://hyhy.gg/play/${play.id}`}
            />
            <meta property="og:type" content="video.other" />
            <meta property="og:video" content={play.videoUrl} />
            <meta property="og:video:url" content={play.videoUrl} />
            <meta property="og:video:secure_url" content={play.videoUrl} />
            <meta property="og:video:width" content="1280" />
            <meta property="og:video:height" content="720" />
            <meta property="og:video:type" content="text/html" />
            <meta property="og:image" content={play.thumbnailUrl ?? ""} />
            <meta property="og:image:width" content="480" />
            <meta property="og:image:height" content="360" />
            <meta
              content="#87CEEB"
              data-react-helmet="true"
              name="theme-color"
            />
          </>
        )}
      </Head> */}

      <main>
        {isLoadingPlay ? (
          <div className="flex justify-center">
            <BeatLoader />
          </div>
        ) : play ? (
          <div className="px-8 sm:px-16">
            <PlayGridItem {...play} />
          </div>
        ) : (
          <p>Play not found</p>
        )}
      </main>
    </>
  );
};

export default Home;
