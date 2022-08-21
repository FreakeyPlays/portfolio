import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import TypewriterComponent from 'typewriter-effect'
import Loader from '../components/VoxelModelLoader'
import { fadeInIntro } from '../lib/motionAnimations'

const LazyVoxelModel = dynamic(() => import('../components/voxelModel'), {
  ssr: false,
  loading: () => <Loader />
})

const NotFound = () => {
  return (
    <div className="w-full h-[calc(100vh-124px)] flex flex-col justify-center items-start">
      <LazyVoxelModel />
      <TypewriterComponent
        className="Typewriter"
        options={{
          strings: `<span>404</span> - Not Found`,
          autoStart: true
        }}
      />
      <motion.p
        variants={fadeInIntro}
        initial="hidden"
        animate="visible"
        className="text-comment opacity-[87%] text-3xl xl:text-2xl md:text-xl mt-2 uppercase"
      >
        The page you&apos;re looking for was not Found.
      </motion.p>
    </div>
  )
}

export default NotFound
