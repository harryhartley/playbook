import { type NextPage } from 'next'
import Head from 'next/head'

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <meta content={'SEO Test'} property='og:title' />
        <meta content='Playbook' property='og:site_name' />
        <meta content={'SEO Test Description'} property='og:description' />
        <meta content={'https://www.hyhy.gg/playbook'} property='og:url' />
        <meta content={'video.other'} property='og:type' />
        <meta content={'https://www.youtube.com/embed/COCLDCossos'} property='og:video' />
        <meta content={'https://www.youtube.com/embed/COCLDCossos'} property='og:video:url' />
        <meta content={'https://www.youtube.com/embed/COCLDCossos'} property='og:video:secure_url' />
        <meta content={'1280'} property='og:video:width' />
        <meta content={'720'} property='og:video:height' />
        <meta content={'text/html'} property='og:video:type' />
        <meta content={`https://img.youtube.com/vi/COCLDCossos/hqdefault.jpg`} property='og:image' />
        <meta property='og:image:width' content='480' />
        <meta property='og:image:height' content='360' />
        <meta content='#87CEEB' data-react-helmet='true' name='theme-color' />
        {/* <meta name='twitter:card' content='summary_large_image' /> */}
      </Head>
      <main>SEO TEST PAGE IGNORE ME</main>
    </>
  )
}

export default Home
