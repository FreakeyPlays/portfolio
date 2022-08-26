import { motion } from 'framer-motion'
import { useRef } from 'react'
import { gridContainerWork } from '../../lib/motionAnimations'
import GitCard from '../gitCard'
import Section from './section'

const Work = ({ repos }) => {
  const animationRef = useRef(null)

  return (
    <Section title="work">
      <motion.div
        className="w-3/4 md:w-full grid grid-cols-[repeat(auto-fit,minmax(min(100%/2,max(256px,100%/4)),1fr))] 
                   grid-rows-[repeat(2,calc(50%-16px))] auto-rows-[0px] overflow-y-hidden overflow-x-visible gap-8 
                   py-8 -my-8 px-4 -mx-4 sm:px-0 sm:mx-0 sm:grid-cols-[repeat(1,minmax(192px,67.5%))]"
        ref={animationRef}
        variants={gridContainerWork}
        initial="hidden"
        whileInView="visible"
      >
        {(repos || []).map(rep => {
          return <GitCard rep={rep} key={rep.repo} reference={animationRef} />
        })}
      </motion.div>
    </Section>
  )
}

export default Work
