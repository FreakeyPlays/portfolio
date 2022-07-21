import Head from 'next/head'
import NavBar from '../navbar'

const Main = ({ children }) => {
  return (
    <main className="">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="description"
          content="My personal developer Portfolio. Here you can learn something about me and my skills."
        />
        <meta name="author" content="Christoph Merck" />
        <meta name="author" content="FreakeyPlays" />
        <meta name="twitter:title" content="Christoph Merck Portfolio" />
        <meta
          name="twitter:card"
          content="https://www.chrismerck.me/card.png"
        />
        <meta name="twitter:site" content="@FreakeyPlays" />
        <meta name="twitter:creator" content="@FreakeyPlays" />
        <meta property="og:site_name" content="Christoph Merck" />
        <meta name="og:title" content="Christoph Merck" />
        <meta property="og:type" content="website" />
        <meta
          property="og:image"
          content="https://www.chrismerck.me/card.png"
        />
        <title>Christoph Merck - Portfolio</title>
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
      </Head>

      <NavBar />

      <div id="main_container" className="overflow-x-hidden">
        {children}
      </div>
    </main>
  )
}

export default Main
