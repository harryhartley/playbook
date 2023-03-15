import type { Character, Environment, Speed, Stage, Type } from '@prisma/client'
import { type NextPage } from 'next'
import { useRouter } from 'next/router'
import type { ParsedUrlQuery } from 'querystring'
import { useState } from 'react'
import { PlayListContainer } from '../components/Play/PlayListContainer'
import { api } from '../utils/api'
import { isInt, toTitleCase } from '../utils/string'

const generateFilter = (query: ParsedUrlQuery) => {
  return {
    ...(!!query.c &&
      typeof query.c === 'string' &&
      toTitleCase(query.c) !== 'All' && { c: toTitleCase(query.c) as Character }),
    ...(!!query.d &&
      typeof query.d === 'string' &&
      isInt(query.d) &&
      parseInt(query.d, 10) >= 1 &&
      parseInt(query.d, 10) <= 5 && { d: Math.floor(parseInt(query.d, 10)) }),
    ...(!!query.e &&
      typeof query.e === 'string' &&
      toTitleCase(query.e) !== 'All' && { e: toTitleCase(query.e) as Environment }),
    ...(!!query.sp &&
      typeof query.sp === 'string' &&
      toTitleCase(query.sp) !== 'All' && { sp: toTitleCase(query.sp) as Speed }),
    ...(!!query.st &&
      typeof query.st === 'string' &&
      toTitleCase(query.st) !== 'All' && { st: toTitleCase(query.st) as Stage }),
    ...(!!query.t &&
      typeof query.t === 'string' &&
      toTitleCase(query.t) !== 'All' && { t: toTitleCase(query.t) as Type }),
  }
}

const Home: NextPage = () => {
  const { query } = useRouter()

  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 10

  const filter = generateFilter(query)

  const { data: playsCount } = api.play.getCountApproved.useQuery({ filter }, { refetchOnWindowFocus: false })
  const { data: plays } = api.play.getAllApproved.useQuery(
    { currentPage, pageSize, filter },
    { refetchOnWindowFocus: false }
  )

  return (
    <main>
      <PlayListContainer
        title='Playbook'
        plays={plays}
        playsCount={playsCount}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        pageSize={pageSize}
        displayFilter={true}
      />
    </main>
  )
}

export default Home
