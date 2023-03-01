import { type NextPage } from 'next'

const Home: NextPage = () => {
  return (
    <main>
      <div>
        The Playbook has been designed to assist with the sharing of tech and ideas, outside of Discord servers where
        posts are easily lost and hard to search.
      </div>
      <div className='text-2xl font-bold'>Roadmap</div>
      <ul>
        <li>Playbook filtering UI</li>
        <li>Favourite plays feature</li>
      </ul>
      <div className='text-2xl font-bold'>Contributors</div>
      <ul>
        <li>CookingTiger - Initial content to test UI</li>
        <li>JawDrop - Initial content to test UI</li>
        <li>communities - Testing and bugfixes</li>
      </ul>
    </main>
  )
}

export default Home
