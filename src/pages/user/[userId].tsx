/* eslint-disable @next/next/no-img-element */
import { type NextPage } from 'next'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { BeatLoader } from 'react-spinners'
import { PlayListContainer } from '../../components/Play/PlayListContainer'
import { api } from '../../utils/api'

const Home: NextPage = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 10

  const { query } = useRouter()

  const { data: user, isLoading: isLoadingUser } = api.user.getById.useQuery(query.userId as string, {
    enabled: typeof query.userId === 'string',
    refetchOnWindowFocus: false,
  })

  const { data: playsCount, isLoading: isLoadingCount } = api.play.getCountByUserId.useQuery(query.userId as string, {
    enabled: typeof query.userId === 'string',
    refetchOnWindowFocus: false,
  })
  const { data: plays, isLoading: isLoadingPlays } = api.play.getAllByUserId.useQuery(
    { userId: query.userId as string, currentPage, pageSize },
    {
      enabled: typeof query.userId === 'string',
      refetchOnWindowFocus: false,
    }
  )

  if (typeof query.userId !== 'string') return <p>Bad ID</p>

  return (
    <main>
      {isLoadingUser ? (
        <div className='flex justify-center'>
          <BeatLoader />
        </div>
      ) : user ? (
        <div className='flex justify-items-center gap-8 space-y-2 pt-6 pb-8 md:space-y-5'>
          <img className={'h-24 w-24 rounded-full'} src={user.image ?? ''} alt='Profile Image' />
          <h1 className='md:leading-14 text-2xl font-extrabold leading-9 tracking-tight sm:text-3xl sm:leading-10 md:text-5xl'>
            {user.name}
          </h1>
        </div>
      ) : (
        <p>User not found</p>
      )}
      {isLoadingPlays || isLoadingCount ? (
        <div className='flex justify-center'>
          <BeatLoader />
        </div>
      ) : (
        <PlayListContainer
          plays={plays}
          playsCount={playsCount}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          pageSize={pageSize}
          displayPlayCount={true}
        />
      )}
    </main>
  )
}

export default Home
