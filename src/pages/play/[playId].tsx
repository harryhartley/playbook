import { createProxySSGHelpers } from '@trpc/react-query/ssg'
import type { GetServerSidePropsContext } from 'next'
import { type NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import superjson from 'superjson'
import { Play } from '../../components/Play'
import { appRouter } from '../../server/api/root'
import { createInnerTRPCContext } from '../../server/api/trpc'
import { getServerAuthSession } from '../../server/auth'
import { api } from '../../utils/api'

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

  const { data: play } = api.play.getById.useQuery(query.playId)
  if (!play) return <p>Loading play...</p>

  return (
    <>
      <Head>
        <title>LLB Playbook</title>
        <meta content={play.name} property='og:title' />
        <meta content={play.description} property='og:description' />
        <meta content={`https://playbook-sand.vercel.app/play/${play.id}`} property='og:url' />
        <meta
          content={`https://img.youtube.com/vi/${play.youtubeId.slice(30, 41)}/hqdefault.jpg`}
          property='og:image'
        />
        <meta content='#87CEEB' data-react-helmet='true' name='theme-color' />
        <meta name='twitter:card' content='summary_large_image' />
      </Head>

      <main>
        <Play play={play} youtubeEmbed='above' />
      </main>
    </>
  )
}

export default Home
