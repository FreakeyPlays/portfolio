import { forwardRef } from 'react'

export const ModelLoader = () => {
  return (
    <div
      className="flex justify-center items-center
                        h-[640px] w-[640px] xl:h-[480px] xl:w-[480px] md:h-[280px] md:w-[280px]"
    >
      <div
        className="w-8 h-8 border-4 border-white border-solid rounded-full animate-spin border-t-transparent"
        role="status"
      ></div>
    </div>
  )
}

export const ModelContainer = forwardRef(({ children }, ref) => {
  return (
    <div
      ref={ref}
      className="h-[640px] w-[640px] xl:h-[480px] xl:w-[480px] md:h-[280px] md:w-[280px]
                       mt-[-120px] xl:mt-[-90px] md:mt-[-60px] 
                       mb-[-200px] xl:mb-[-140px] md:mb-[-40px] 
                       ml-[-120px] xl:ml-[-60px] md:ml-[-20px] relative"
    >
      {children}
    </div>
  )
})

ModelContainer.displayName = 'ModelContainer'

const Loader = () => {
  return (
    <ModelContainer>
      <ModelLoader />
    </ModelContainer>
  )
}

export default Loader
