import { useIsMobile } from "../hooks/use-mobile"

function Footer() {

    const isMobile = useIsMobile();
    return (
        <div className="px-5 py-7 bg-zinc-100">

            <div className={`${isMobile ? "grid grid-cols-3" : "grid grid-cols-4" } `}>
                <div className="pt-5 px-2 border-t border-l border-b border-black h-[400px]">
                    <p>Work</p>
                    <p>Services</p>
                    <p>About</p>
                    <p>Contact</p>
                </div>
                <div className="pt-5 px-2 border border-black">
                    <p>Instagram</p>
                    <p>Facebook</p>
                    <p>Linkedin</p>
                    <p>Patrion</p>
                </div>
                <div className={`pt-5 px-2 border-t ${isMobile ?  "border-r border-t" : "" }  border-b border-black`}>
                    <p>Paupio g. 50,</p>
                    <p className="text-wrap">Vilnius, Lithuania</p>
                </div>
        { !isMobile &&

                <div className="pt-5 px-2 border-t border-l border-b border-r border-black">
                    <p>+37061747093</p>
                    <p>hello@flair.digital</p>
                </div>
        }

            </div>


            <div className=" ">
                <div className="border-r border-l border-b border-black ">

                    <div>
                        <p className={`font-excon font-medium ${isMobile ? "text-8xl" : "text-[200px]"}`}>Equity Explorer </p>
                    </div>
                </div>


            </div>

        </div>
    )
}

export default Footer