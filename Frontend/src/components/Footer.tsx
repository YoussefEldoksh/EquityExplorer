import { useIsMobile } from "../hooks/use-mobile"

function Footer() {

    const isMobile = useIsMobile();
    return (
        <div className="px-3 sm:px-5 py-4 sm:py-7 bg-zinc-100">

            <div className={`${isMobile ? "grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-0" : "grid grid-cols-4" } `}>
                <div className="pt-3 sm:pt-5 px-2 border-t border-l border-b border-black h-auto min-h-24 text-xs sm:text-sm">
                    <p>Work</p>
                    <p>Services</p>
                    <p>About</p>
                    <p>Contact</p>
                </div>
                <div className="pt-3 sm:pt-5 px-2 border-t border-r border-b border-l border-black text-xs sm:text-sm">
                    <p>Instagram</p>
                    <p>Facebook</p>
                    <p>Linkedin</p>
                    <p>Patrion</p>
                </div>
                <div className={`pt-3 sm:pt-5 px-2 border-t border-r border-b border-black text-xs sm:text-sm`}>
                    <p>Paupio g. 50,</p>
                    <p className="text-wrap">Vilnius, Lithuania</p>
                </div>
        { !isMobile &&

                <div className="pt-5 px-2 border-t border-l border-b border-r border-black">
                    <p className="text-xs sm:text-sm">+37061747093</p>
                    <p className="text-xs sm:text-sm">hello@flair.digital</p>
                </div>
        }

            </div>


            <div className="">
                <div className="border-r border-l border-b border-black ">

                    <div>
                        <p className={`font-excon font-medium ${isMobile ? "text-3xl sm:text-5xl md:text-6xl" : "text-6xl sm:text-8xl md:text-[150px] lg:text-[200px]"}`}>Equity Explorer </p>
                    </div>
                </div>


            </div>

        </div>
    )
}

export default Footer