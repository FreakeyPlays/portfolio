import Section from "./section"
import careerContent from "./career.content.json"
import { useState } from "react"

const Career = () => {

  const [selectedCareer, setSelectedCareer] = useState(Object.keys(careerContent)[0])

  return(
    <Section title="career">
        <div className="w-3/4 md:w-full flex flex-row">
            <div 
                className="border-r-2 border-d-bg dark:border-l-bg border-opacity-50 dark:border-opacity-50 
                           border-solid overflow-x-show flex flex-col w-[160px] relative h-fit
                           after:content-[''] after:h-list-indicator after:w-1 after:top-list after:bg-l-primary after:dark:bg-d-primary 
                           after:absolute after:left-full after:-translate-x-1/2 after:rounded after:transition-all after:ease-in-out 
                           after:duration-500"
                >
                {(Object.entries(careerContent) || []).map(( [key] ) => {
                    return(
                        <div 
                            key={"indicator-" + key}
                            className="m-4 ml-0 flex flex-row items-center flex-nowrap uppercase text-format font-bold text-lg md:text-base sm:text-sm cursor-pointer" 
                            onClick={e => {
                                setSelectedCareer(key)
                                e.target.parentNode.style.setProperty("--list-indicator", e.target.offsetHeight + 32 + "px")
                                e.target.parentNode.style.setProperty("--list-left", e.target.offsetTop - 16 + "px")
                            }}
                        >
                            {key}
                        </div>
                    )
                })}
            </div>
            <div className="ml-4">
                {(Object.entries(careerContent) || []).map(([key, value]) => {
                    return(
                        <div 
                            key={"content-" + key}
                            className={`text-format ${key.toString() === selectedCareer ? "" : "hidden"}`}
                        >
                            <h1 className="text-[2rem] uppercase font-bold lg:text-2xl sm:text-xl">{value.title}</h1>
                            <p className="text-l-primary dark:text-d-primary text-2xl lg:text-xl font-bold mt-2">{"@" + value.institute}</p>
                            <p className="text-comment text-2xl lg:text-xl uppercase mb-4">{value.startDate + " - " + value.endDate}</p>
                            <p className="paragraph">{value.text}</p>
                        </div>
                    )
                })}
            </div>
        </div>
    </Section>
  )
}

export default Career
