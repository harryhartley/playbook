import { type NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { Play } from '../../components/Play'
import { api } from '../../utils/api'

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
