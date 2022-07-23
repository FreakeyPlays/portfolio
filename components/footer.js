import Link from "next/link"

const FooterElement = ( {uri, text} ) => {
    return(
        <div className="relative inline-block mx-2 sm:mx-1">
            <Link href={uri}>
                <a className="text-footer hover-effect">{text}</a>
            </Link>
        </div>
    )
}

const Footer = () => {
    return(
        <footer className="flex justify-center pt-8 pb-8 xl:pb-40 lg:pb-32">
            <div className="">
                <div className="mb-2">
                    <FooterElement 
                        uri="https://github.com/FreakeyPlays"
                        text="GitHub"
                    />
                    <FooterElement 
                        uri="https://twitter.com/FreakeyPlays"
                        text="Twitter"
                    />
                    <FooterElement 
                        uri="https://www.linkedin.com/in/christoph-merck"
                        text="LinkedIN"
                    />
                    <FooterElement 
                        uri="https://www.xing.com/profile/Christoph_Merck2/cv"
                        text="XING"
                    />
                    <FooterElement 
                        uri="mailto:contact@chrismerck.me"
                        text="Contact Me"
                    />
                </div>
                <div className="text-footer-copyright text-center">
                    &copy; {new Date().getFullYear()} Christoph Merck. All Rights Reserved.
                </div>
            </div>
        </footer>
    )
}

export default Footer