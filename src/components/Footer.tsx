import Link from 'next/link'
import { siteMetadata } from '../data/siteMetadata'

export const Footer = () => {
  return (
    <footer>
      <div className="mt-16 flex flex-col items-center">
        {/* <div className="mb-3 flex space-x-4">
          <SocialIcon kind="github" href={siteMetadata.github} size="6" />
        </div> */}
        <div className="mb-2 flex space-x-2 text-sm text-gray-500 dark:text-gray-400">
          <div>{siteMetadata.author}</div>
          <div>{` • `}</div>
          <div>{`© ${new Date().getFullYear()}`}</div>
          <div>{` • `}</div>
          <Link href="/">{siteMetadata.title}</Link>
        </div>
        <div className="mb-8 text-sm text-gray-500 dark:text-gray-400">
          <Link href="https://github.com/timlrx/tailwind-nextjs-starter-blog">
            Tailwind Nextjs Theme
          </Link>
        </div>
      </div>
    </footer>
  )
}