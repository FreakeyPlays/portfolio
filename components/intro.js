import TypewriterComponent from 'typewriter-effect'
import dynamic from 'next/dynamic'
import Loader from './VoxelModelLoader'

const LazyVoxelModel = dynamic(() => import('./voxelModel'), {
  ssr: false,
  loading: () => <Loader />
})

const Intro = () => {
  return (
    <div className="w-screen h-screen max-h-[1440px] bg-l-bg dark:bg-d-bg bg-[length:1vh_1vh] bg-[radial-gradient(rgba(100,100,100,0.25)_15%,transparent_15%)]">
      <div className="w-full h-full px-64 xl:px-32 md:px-6 flex flex-col justify-center">
        <LazyVoxelModel />
        <div className="z-10">
          <TypewriterComponent
            className="Typewriter"
            options={{
              strings: `Hey I&apos;m <span>Chris</span>.`,
              autoStart: true
            }}
          />
          <div className="text-3xl xl:text-2xl md:text-xl mt-2 text-comment opacity-[87%] uppercase">
            Software Engineer and Media Computer
          </div>
          <div className="text-format text-xl xl:text-lg md:text-base mt-8">
            I&apos;m a software engineer and media computer based in Germany.
            <br />
            Currently, I am studying software engineering and media computing at
            University
            <br />
            Esslingen. My interests are software development and game
            development.
          </div>
        </div>
      </div>
    </div>
  )
}

export default Intro
