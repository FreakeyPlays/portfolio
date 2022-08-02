import TypewriterComponent from 'typewriter-effect'
import dynamic from 'next/dynamic'
import Loader from './VoxelModelLoader'

const LazyVoxelModel = dynamic(() => import('./voxelModel'), {
  ssr: false,
  loading: () => <Loader />
})

const Intro = () => {
  return (
    <div className="section">
      <LazyVoxelModel />
      <div className="z-10">
        <TypewriterComponent
          className="Typewriter"
          options={{
            strings: `Hey I&apos;m <span>Chris</span>.`,
            autoStart: true
          }}
        />
        <div className="text-comment opacity-[87%] text-3xl xl:text-2xl md:text-xl mt-2 uppercase">
          Software Engineer and Media Computer
        </div>
        <div className="paragraph mt-8">
          I&apos;m a software engineer and media computer based in Germany.
          <br />
          Currently, I am studying software engineering and media computing at
          University
          <br />
          Esslingen. My interests are software development and game development.
        </div>
      </div>
    </div>
  )
}

export default Intro
