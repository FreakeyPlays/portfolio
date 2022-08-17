import { motion } from 'framer-motion'
import Image from 'next/image'
import { useRef, useState } from 'react'
import {
  fadeInSectionMenu,
  gridContainerSectionMenu,
  gridItemSectionMenu
} from '../../lib/motionAnimations'
import Section from './section'
import skillsContent from './skills.content.json'

const Skills = () => {
  const [selectedSection, setSelectedSection] = useState(
    Object.keys(skillsContent)[0]
  )

  const animationRef = useRef(null)

  return (
    <Section title="skills">
      <div className="w-3/4 lg:w-full flex flex-row">
        <motion.div
          className="border-r-2 border-d-bg dark:border-l-bg border-opacity-50 dark:border-opacity-50 
                     border-solid overflow-x-show flex flex-col w-[160px] relative h-fit
                     after:content-[''] after:h-list-indicator after:w-1 after:top-list after:bg-l-primary after:dark:bg-d-primary 
                     after:absolute after:left-full after:-translate-x-1/2 after:rounded after:transition-all after:ease-in-out 
                     after:duration-500"
          variants={fadeInSectionMenu}
          initial="hidden"
          whileInView="visible"
        >
          {(Object.entries(skillsContent) || []).map(([key]) => {
            return (
              <div
                key={'indicator-' + key}
                className=" m-4 ml-0 flex flex-row items-center flex-nowrap uppercase text-format font-bold text-lg md:text-base sm:text-sm cursor-pointer"
                onClick={e => {
                  setSelectedSection(key)
                  e.target.parentNode.style.setProperty(
                    '--list-indicator',
                    e.target.offsetHeight + 32 + 'px'
                  )
                  e.target.parentNode.style.setProperty(
                    '--list-left',
                    e.target.offsetTop - 16 + 'px'
                  )
                }}
              >
                {key}
              </div>
            )
          })}
        </motion.div>
        <div className="w-full ml-4 overflow-y-show">
          {(Object.entries(skillsContent) || []).map(([key, value]) => {
            return (
              <motion.div
                key={'content-' + key}
                className={`text-format grid grid-cols-[repeat(auto-fit,minmax(32px,128px))] gap-4 
                            md:grid-cols-[repeat(auto-fit,48px)]
                            ${
                              key.toString() === selectedSection ? '' : 'hidden'
                            }`}
                variants={gridContainerSectionMenu}
                ref={animationRef}
                initial="hidden"
                whileInView="visible"
              >
                {(Object.entries(value) || []).map(
                  ([secondKey, secondValue]) => {
                    return (
                      <motion.div
                        key={'item-' + secondKey}
                        className="bg-gradient-to-t from-l-bg dark:from-d-bg to-[#ebebea99] dark:to-[#24272799] 
                                   p-4 md:p-2 rounded-xl flex flex-col gap-2 justify-between items-center 
                                   border-solid border-[1px] border-l-bg dark:border-d-bg divide-y-2 
                                   divide-comment lg:divide-y-0 shadow"
                        variants={gridItemSectionMenu}
                        viewport={{ root: animationRef }}
                      >
                        <Image
                          src={secondValue}
                          alt={secondKey + '-logo'}
                          width={56}
                          height={56}
                          className="w-14 drop-shadow-md"
                        />
                        <p className="text-center w-full paragraph md:hidden">
                          {secondKey}
                        </p>
                      </motion.div>
                    )
                  }
                )}
              </motion.div>
            )
          })}
        </div>
      </div>
    </Section>
  )
}

export default Skills
