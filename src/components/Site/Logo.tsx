import { useTheme } from 'next-themes'
import { siteMetadata } from '../../data/siteMetadata'

export const Logo = () => {
  const { theme } = useTheme()
  const src = theme === 'dark' ? siteMetadata.darkLogo : siteMetadata.lightLogo

  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt='logo' height={48} width={48} />
}
