import { forwardRef } from 'react'

export const ModelLoader = () => {
  return (
    <div
      className="flex justify-center items-center voxel-sizes"
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
      className="voxel-sizes relative
                 mt-[-120px] xl:mt-[-90px] md:mt-[-60px] 
                 mb-[-200px] xl:mb-[-140px] md:mb-[-40px] 
                 ml-[-120px] xl:ml-[-60px] md:ml-[-20px]"
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
