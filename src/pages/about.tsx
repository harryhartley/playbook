import { type NextPage } from 'next'

const Home: NextPage = () => {
  return (
    <main>
      <div className='my-2 text-2xl font-bold'>What is the Playbook?</div>
      <div>
        The Playbook has been designed to assist with the sharing of tech and ideas, outside of Discord servers where
        posts are easily lost and hard to search. The playbook also offers additional features, for example the ability
        to filter plays by specific criteria, including character, environment, and even contributor.
      </div>
      <div className='my-2 text-2xl font-bold'>How to contribute Plays</div>
      <ol className='list-decimal'>
        <li className='ml-8'>Message hyhy about becoming a contributor</li>
        <li className='ml-8'>Upload your content to YouTube (or clip an existing video)</li>
        <li className='ml-8'>Navigate to the submit page</li>
        <li className='ml-8'>Upload your play with a relevant name, description, and tags</li>
        <li className='ml-8'>Wait for a moderator to approve the submission!</li>
      </ol>
      <div className='my-2 text-2xl font-bold'>Roadmap</div>
      <ul className='list-disc'>
        <li className='ml-8'>Design system overhaul</li>
        <li className='ml-8'>Play requests/bounties</li>
        <li className='ml-8'>Advanced filtering views</li>
        <li className='ml-8'>Post directly from Discord</li>
        <li className='ml-8'>Other games?</li>
      </ul>
      <div className='my-2 text-2xl font-bold'>Contributors</div>
      <ul className='list-disc'>
        <li className='ml-8'>Gentle - Helping to host the OG Playbook and teaching me a lot of modern webdev</li>
        <li className='ml-8'>JawDrop - Huge amount of content, espeially the initial uploads</li>
        <li className='ml-8'>CookingTiger - Initial content to test UI, initial requirements review</li>
        <li className='ml-8'>Biscuit - Logo</li>
        <li className='ml-8'>communities - Testing and bugfixes</li>
        <li className='ml-8'>baltikus - Testing and bugfixes</li>
      </ul>
    </main>
  )
}

export default Home
