import { createProxySSGHelpers } from '@trpc/react-query/ssg'
import type { GetServerSidePropsContext } from 'next'
import { type NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { BeatLoader } from 'react-spinners'
import superjson from 'superjson'
import { PlayContainer } from '../../components/Play/PlayContainer'
import { appRouter } from '../../server/api/root'
import { createInnerTRPCContext } from '../../server/api/trpc'
import { getServerAuthSession } from '../../server/auth'
import { api } from '../../utils/api'
import { formatVideoEmbedUrl, getThumbnailUrl } from '../../utils/video'

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const session = await getServerAuthSession(ctx)

  const ssg = createProxySSGHelpers({
    router: appRouter,
    ctx: createInnerTRPCContext({ session }),
    transformer: superjson,
  })

  if (typeof ctx.query.playId === 'string') {
    await ssg.play.getById.fetch(ctx.query.playId)
  }

  return {
    props: {
      trpcState: ssg.dehydrate(),
    },
  }
}

const Home: NextPage = () => {
  const { query } = useRouter()
  if (typeof query.playId !== 'string') return <p>Bad ID</p>

  const { data: play, isLoading: isLoadingPlay } = api.play.getById.useQuery(query.playId, {
    refetchOnWindowFocus: false,
  })

  return (
    <>
      <Head>
        {play && (
          <>
            <meta property='og:title' content={play.name} />
            <meta property='og:description' content={play.description} />
            <meta property='og:url' content={`https://hyhy.gg/play/${play.id}`} />
            <meta property='og:type' content='video.other' />
            <meta property='og:video' content={formatVideoEmbedUrl(play.videoEmbedUrl)} />
            <meta property='og:video:url' content={formatVideoEmbedUrl(play.videoEmbedUrl)} />
            <meta property='og:video:secure_url' content={formatVideoEmbedUrl(play.videoEmbedUrl)} />
            <meta property='og:video:width' content='1280' />
            <meta property='og:video:height' content='720' />
            <meta property='og:video:type' content='text/html' />
            <meta property='og:image' content={getThumbnailUrl(play.videoEmbedUrl)} />
            <meta property='og:image:width' content='480' />
            <meta property='og:image:height' content='360' />
            <meta content='#87CEEB' data-react-helmet='true' name='theme-color' />
          </>
        )}
      </Head>

      <main>
        {isLoadingPlay ? (
          <div className='flex justify-center'>
            <BeatLoader />
          </div>
        ) : play ? (
          <PlayContainer play={play} videoEmbed='above' postButton={true} />
        ) : (
          <p>Play not found</p>
        )}
      </main>
    </>
  )
}

export default Home
