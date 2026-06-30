import { Link } from 'react-router-dom';
import { motion } from 'framer-motion'
import clyde_and_co_black from '@/assets/companies/69ea5a7d494684507ed8bf2c_clyde_and_co_black.png'
import cania from '@/assets/companies/cania.svg'
import white_castle from '@/assets/companies/69ea6ae1d2380db923fd56a9_white_and_case_transparent.png'
import hubspot from '@/assets/companies/69c1b0dd6fc0c1a9e32587f4_hubspot.svg'
import act from '@/assets/companies/act-customized.svg'
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "@/components/ui/avatar"


const logos = [
  { src: clyde_and_co_black, alt: 'Clyde & Co', className: 'w-20' },
  { src: cania, alt: 'Scania', className: 'w-18' },
  { src: white_castle, alt: 'White & Case', className: 'w-22' },
  { src: hubspot, alt: 'HubSpot', className: 'w-20' },
  { src: act, alt: 'ACT', className: 'w-12' },
  {
    src: 'https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/webp/soundcloud.webp',
    alt: 'SoundCloud',
    className: 'w-12',
  },
]

// Stagger container — controls timing between each child reveal
const textContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.25,
      delayChildren: 0.3,
    },
  },
}

// Each text item starts blurred + faded + offset, then resolves into focus
const textItem = {
  hidden: { opacity: 0, y: 20, filter: 'blur(8px)' },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    // use a readonly tuple so framer-motion accepts the cubic-bezier easing
    transition: { duration: 0.8, ease: [0.42, 0, 0.58, 1] as const },
  },
}

function HeroSection() {
  return (
    <>
      <div className='bg-white '>
        <motion.div className='relative h-screen bg-white  overflow-hidden'>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.6, ease: 'easeOut', delay: 0.4 }}
            className='absolute inset-0 z-10 pointer-events-none'
            style={{
              background: `linear-gradient( #6366f1 0%, #6366f1 20%, #d6d7ff 65%,  transparent 90%)`,
            }}
          />

          {/* Hero content */}
          <motion.div
            variants={textContainer}
            initial='hidden'
            animate='show'
            className='absolute inset-0 z-40  flex flex-col items-center justify-center text-center px-4 sm:px-6 md:px-10 text-black'
          >

            <motion.p
              variants={textItem}
              className='text-xs sm:text-sm font-outfit uppercase tracking-widest mb-1 sm:mb-1 font-medium '
            >
              <div className='flex items-center justify-center gap-2'>
                <div>
                  <p className="text-[8px] font-bold">Trusted by 300+ retail <br /> investors world-wide</p>
                </div>
                <div>
                  <AvatarGroup className="grayscale">
                    <Avatar size='sm'>
                      <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <Avatar size='sm'>
                      <AvatarImage src="https://github.com/maxleiter.png" alt="@maxleiter" />
                      <AvatarFallback>LR</AvatarFallback>
                    </Avatar>
                    <Avatar size='sm'>
                      <AvatarImage
                        src="https://github.com/evilrabbit.png"
                        alt="@evilrabbit"
                      />
                      <AvatarFallback>ER</AvatarFallback>
                    </Avatar>
                    <AvatarGroupCount className='bg-black text-zinc-200 font-medium px-2 py-1'>
                      +3
                    </AvatarGroupCount>
                  </AvatarGroup>
                </div>



              </div>

            </motion.p>

            <motion.p
              variants={textItem}
              className='text-xs sm:text-sm font-outfit uppercase tracking-widest mb-2 sm:mb-4 font-medium '
            >
              Real-time market intelligence
            </motion.p>
            <motion.h1
              variants={textItem}
              className='font-outfit font-bold text-4xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight'
            >
              Explore the World's <br />
              <span className='italic font-medium'>Financial Markets</span>
            </motion.h1>

            <motion.p
              variants={textItem}
              className='text-xs sm:text-base md:text-lg max-w-xs sm:max-w-md md:max-w-xl mb-6 sm:mb-8 font-outfit '
            >
              Analyze stocks, track performance, and make informed decisions with powerful data at your fingertips.
            </motion.p>

            <motion.div variants={textItem}>
              <Link to="/tickerslist">
                <motion.button
                  className='bg-black text-zinc-200 font-medium px-6 sm:px-8 sm:py-1 py-1 rounded-md hover:scale-125 active:scale-85 font-outfit transition duration-300 ease-in-out text-sm sm:text-base'
                >
                  Start Learning
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Tagline */}
          <motion.div className='absolute top-120 md:top-140 md:bottom-38 z-20 w-full flex justify-center items-center gap-2 font-outfit'>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.5, ease: 'easeInOut', delay: 2 }}
              className='text-center text-sm  md:text-lg text-black/50'
            >
              Trusted by retail investors and organizations navigating financial markets.
            </motion.p>
          </motion.div>

          {/* Infinite marquee */}

          <div className=' absolute inset-x-0 top-120 md:top-140 md:bottom-20 h-24 z-10 overflow-hidden flex items-center justify-center'>

            {/* Infinite marquee */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.5, ease: 'easeInOut', delay: 2.5 }}
              className='absolute bottom-6 z-20 w-full md:w-4/5 overflow-hidden'
              style={{
                maskImage: 'linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)',
              }}
            >
              <div
                className='flex w-max  md:gap-12'
                style={{ animation: 'marquee 30s linear infinite' }}
              >
                {[...logos, ...logos].map((logo, i) => (
                  <div key={i} className='flex items-center justify-center px-10'>
                    <img src={logo.src} alt={logo.alt} className={logo.className} />
                  </div>
                ))}
              </div>
            </motion.div>
          </div>




        </motion.div>
      </div>

      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>
    </>
  )
}

export default HeroSection