import { useState, useEffect } from "react"
import { useTheme } from "next-themes"

const ThemeToggle = () => {

    const { systemTheme, theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)
    const checked = (theme === "system" ? systemTheme : theme) === "dark"

    useEffect(() => {
        setMounted(true)
    }, [])



    const toggleTheme = () => {
        if(!mounted){
            return null
        }

        const currentTheme = theme === "system" ? systemTheme : theme

        if(currentTheme === "dark"){
            setTheme("light")
        }else{
            setTheme("dark")
        }
    }

    return(
        <div className="absolute mt-8">
            <label className="text-[17px] relative inline-block w-14 h-8">
                <input 
                    type="checkbox" 
                    className="opacity-0 w-0 h-0 peer"
                    defaultChecked={checked}
                    onClick={() => toggleTheme()}
                />
                <span 
                    className="absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-[#f4f4f5] duration-500 rounded-[30px]
                            before:content-[''] before:absolute before:h-6 before:w-6 before:rounded-full before:left-[0.25rem]
                            before:bottom-[0.25rem] before:bg-gradient-to-br before:from-[#ffd000] before:to-[#ff8c00]
                            before:duration-500 peer-checked:bg-[#303136] peer-checked:before:translate-x-6
                            peer-checked:before:from-[#303136] peer-checked:before:to-[#303136] 
                            peer-checked:before:shadow-[inset_-3px_-2px_5px_-2px_#8983f7,inset_-10px_-5px_0_0_#a3dafb]"
                ></span>
            </label>
        </div>
    )
}

export default ThemeToggle