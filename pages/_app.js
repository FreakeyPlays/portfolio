import '../styles/globals.css'
import Font from '../components/font'
import MainLayout from '../components/layouts/main'
import { ThemeProvider } from "next-themes"

const Portfolio = ({ Component, pageProps }) => {
  return (
    <ThemeProvider
      enableSystem={true}
      attribute="class"
    >
      <Font />
      <MainLayout>
        <Component {...pageProps} />
      </MainLayout>
    </ThemeProvider>
  )
}

export default Portfolio
