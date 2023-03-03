import { type NextPage } from 'next'
import Head from 'next/head'

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <meta content={'SEO Test'} property='og:title' />
        <meta content={'SEO Test Description'} property='og:description' />
        <meta content={`https://www.youtube.com/v/COCLDCossos`} property='og:url' />
        {/* <meta content={`https://img.youtube.com/vi/COCLDCossos/hqdefault.jpg`} property='og:image' /> */}
        <meta content='#87CEEB' data-react-helmet='true' name='theme-color' />
        {/* <meta name='twitter:card' content='summary_large_image' /> */}
      </Head>
      <main>SEO TEST PAGE IGNORE ME</main>
    </>
  )
}

export default Home
