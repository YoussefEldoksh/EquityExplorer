import { useIsMobile } from '../hooks/use-mobile'
import image from "../assets/hero.png"
function HeroSection() {
  const isMobile = useIsMobile();
  return (
    <>
        {!isMobile &&
          <>
            <div className='h-full flex justify-center'>
                {/* <img src={image} alt="" /> */}
            </div>
          </>
        }
    </>
  )
}

export default HeroSection