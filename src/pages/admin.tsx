import { type NextPage } from 'next'
import { useSession } from 'next-auth/react'
import { useState } from 'react'
import { BeatLoader } from 'react-spinners'
import { UserListContainer } from '../components/Admin/UserListContainer'
import { api } from '../utils/api'
import { isUserAdmin } from '../utils/auth'

const Home: NextPage = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 20

  const { data: session } = useSession()

  const { data: usersCount, isLoading: isLoadingCount } = api.user.getCount.useQuery(undefined, {
    refetchOnWindowFocus: false,
  })
  const { data: users, isLoading: isLoadingUsers } = api.user.getAll.useQuery(
    { currentPage, pageSize },
    { refetchOnWindowFocus: false }
  )

  if (!session || (session && !isUserAdmin(session.user.role))) {
    return <p>Not authorised</p>
  }

  return (
    <main>
      {isLoadingUsers || isLoadingCount ? (
        <div className='flex justify-center'>
          <BeatLoader />
        </div>
      ) : (
        <UserListContainer
          title='Users'
          users={users}
          usersCount={usersCount}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          pageSize={pageSize}
        />
      )}
    </main>
  )
}

export default Home
