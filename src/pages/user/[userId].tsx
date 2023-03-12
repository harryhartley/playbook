/* eslint-disable @next/next/no-img-element */
import { type NextPage } from 'next'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { Pagination } from '../../components/Pagination'
import { Play } from '../../components/Play'
import { api } from '../../utils/api'

const Home: NextPage = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 10
  const { query } = useRouter()

  const { data: user, isError: userIsError } = api.user.getById.useQuery(query.userId as string, {
    enabled: typeof query.userId === 'string',
    refetchOnWindowFocus: false,
  })
  const { data: plays } = api.play.getAllByUserId.useQuery(
    { userId: query.userId as string, currentPage, pageSize },
    {
      enabled: typeof query.userId === 'string',
      refetchOnWindowFocus: false,
    }
  )

  if (typeof query.userId !== 'string') return <p>Bad ID</p>
  if (userIsError) return <p>User not found</p>
  if (!user) return <p>Loading...</p>

  return (
    <>
      <main>
        <div className='flex justify-items-center gap-8 space-y-2 pt-6 pb-8 md:space-y-5'>
          <img className={'h-24 w-24 rounded-full'} src={user.image ?? ''} alt='Profile Image' />
          <h1 className='md:leading-14 text-2xl font-extrabold leading-9 tracking-tight sm:text-3xl sm:leading-10 md:text-5xl'>
            {user.name}
          </h1>
        </div>
        <h2 className='md:leading-14 text-lg font-bold leading-9 tracking-tight sm:text-xl sm:leading-10 md:text-3xl'>
          Plays: {plays && plays.length}
        </h2>

        {plays && plays.length > 0 && (
          <Pagination
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            itemCount={plays.length}
            pageSize={pageSize}
          />
        )}

        <ul className='divide-y'>
          {!plays && 'Loading plays...'}
          {plays && plays.length === 0 && 'No plays found'}
          {plays &&
            plays.length > 0 &&
            plays.map((play, idx) => <Play key={idx} play={play} youtubeEmbed={'inline'} postButton={false} />)}
        </ul>
      </main>
    </>
  )
}

export default Home
