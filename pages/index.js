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
  const PinnedReposRes = await fetch(
    'https://gh-pinned-repos.egoist.sh/?username=FreakeyPlays'
  )
  const PinnedReposData = await PinnedReposRes.json()

  for (let PinnedRep of PinnedReposData) {
    const SocialPreview = await fetch(
      'https://oge.vercel.app/api?url=' + PinnedRep.link
    )
    const SocialPreviewData = await SocialPreview.json()

    PinnedRep.image = SocialPreviewData.og.image
  }

  return {
    props: {
      repos: PinnedReposData
    }
  }
}
