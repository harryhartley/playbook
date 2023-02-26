/* eslint-disable @typescript-eslint/no-misused-promises */
import { type NextPage } from 'next'
import { useSession } from 'next-auth/react'
import { PlayForm } from '../../components/PlayForm'
import { isUserContributorOrAbove } from '../../utils/auth'

const Home: NextPage = () => {
  const { data: session } = useSession()

  if (session && !isUserContributorOrAbove(session.user.role)) {
    return <p>Not authorised</p>
  }

  return <PlayForm />
}

export default Home
