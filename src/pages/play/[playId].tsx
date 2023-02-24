import { type NextPage } from 'next'
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
      <main>
        <Play play={play} youtubeEmbed='above' />
      </main>
    </>
  )
}

export default Home
