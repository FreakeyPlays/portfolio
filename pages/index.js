import Intro from '../components/intro'
import Career from '../components/sections/career'
import Skills from '../components/sections/skills'
import Work from '../components/sections/work'

const Page = ({ repos }) => {
  return (
    <>
      <Intro />
      <Skills />
      <Career />
      <Work repos={repos} />
    </>
  )
}

export default Page

export async function getServerSideProps() {
  const res = await fetch(
    'https://gh-pinned-repos.egoist.sh/?username=FreakeyPlays'
  )
  const data = await res.json()

  return {
    props: {
      repos: data
    }
  }
}
