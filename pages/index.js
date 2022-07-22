import Intro from '../components/intro'

const Page = () => {
  return (
    <div className="w-screen h-fit bg-l-bg dark:bg-d-bg bg-[length:1vh_1vh] 
                    bg-[radial-gradient(rgba(100,100,100,0.25)_15%,transparent_15%)] 
                    px-64 xl:px-32 md:px-6">
      <Intro />
    </div>
  )
}

export default Page
