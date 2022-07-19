import '../styles/globals.css'
import Font from '../components/font'
import MainLayout from '../components/layouts/main'

const Portfolio = ({ Component, pageProps }) => {
  return (
    <>
      <Font />
      <MainLayout>
        <Component {...pageProps} />
      </MainLayout>
    </>
  )
}

export default Portfolio
