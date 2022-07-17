import '../styles/globals.css'
import Font from '../components/font'
import MainLayout from '../components/layouts/main'

const Portfolio = ({ Component, pageProps, router }) => {
  return (
    <>
      <Font />
      <MainLayout>
        <Component {...pageProps} key={router.route} />
      </MainLayout>
    </>
  )
}

export default Portfolio
