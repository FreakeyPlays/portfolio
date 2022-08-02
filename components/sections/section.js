const Section = ({ children, title }) => {
  return (
    <div id={title} className="section">
      <div className="w-fit relative mb-8">
        <h1
          className="text-l-primary dark:text-d-primary opacity-[87%] font-bold uppercase text-5xl 
                      lg:text-3xl sm:text-xl after:content-[''] after:bg-d-bg after:dark:bg-l-bg 
                      after:top-1/2 after:translate-y-1/2 after:h-[2px] after:w-[200%] after:absolute 
                      after:block after:ml-[calc(100%+16px)] after:rounded-full after:opacity-50"
        >
          /{title}
        </h1>
      </div>
      {children}
    </div>
  )
}

export default Section
