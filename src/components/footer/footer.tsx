import Link from "next/link";

export const Footer = () => {
  return (
    <footer>
      <div className="mt-16 flex flex-col items-center">
        {/* <div className="mb-3 flex space-x-4">
          <SocialIcon kind="github" href={siteMetadata.github} size="6" />
        </div> */}
        <div className="mb-2 flex space-x-2 text-sm text-gray-500 dark:text-gray-400">
          <div>hyhy</div>
          <div>{` • `}</div>
          <div>{`© ${new Date().getFullYear()}`}</div>
          <div>{` • `}</div>
          <Link href="/">Playbook</Link>
        </div>
      </div>
    </footer>
  );
};
