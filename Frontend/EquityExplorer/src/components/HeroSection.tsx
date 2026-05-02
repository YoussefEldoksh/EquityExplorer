import { useIsMobile } from '../hooks/use-mobile'
import image from "../assets/Dollar.jpg"
function HeroSection() {
  const isMobile = useIsMobile();
  return (
    <>
        {!isMobile &&
          <>
            <div className='h-full flex justify-center'>
                {/* <img src={image} alt="" className='w-full mix-blend-lightend' /> */}
            </div>
          </>
        }
    </>
  )
}

export default HeroSection