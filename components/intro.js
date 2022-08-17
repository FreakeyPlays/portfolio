import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import { useRef } from 'react'
import TypewriterComponent from 'typewriter-effect'
import { fadeInIntroContainer, fadeInIntroItem } from '../lib/motionAnimations'
import Loader from './VoxelModelLoader'

const LazyVoxelModel = dynamic(() => import('./voxelModel'), {
  ssr: false,
  loading: () => <Loader />
})

const Intro = () => {
  const animationRef = useRef(null)

  return (
    <div className="section">
      <LazyVoxelModel />
      <motion.div
        ref={animationRef}
        variants={fadeInIntroContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="z-10"
      >
        <TypewriterComponent
          className="Typewriter"
          options={{
            strings: `Hey I&apos;m <span>Chris</span>.`,
            autoStart: true
          }}
        />
        <motion.div
          variants={fadeInIntroItem}
          viewport={{ root: animationRef }}
          className="text-comment opacity-[87%] text-3xl xl:text-2xl md:text-xl mt-2 uppercase"
        >
          Software Engineer and Media Computer
        </motion.div>
        <motion.div
          className="paragraph mt-8"
          variants={fadeInIntroItem}
          viewport={{ root: animationRef }}
        >
          I&apos;m a software engineer and media computer based in Germany.
          <br />
          Currently, I am studying software engineering and media computing at
          University
          <br />
          Esslingen. My interests are software development and game development.
        </motion.div>
      </motion.div>
    </div>
  )
}

export default Intro
