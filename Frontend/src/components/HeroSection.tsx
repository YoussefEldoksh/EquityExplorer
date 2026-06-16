import { Link } from 'react-router-dom';
import { motion } from 'framer-motion'
import clyde_and_co_black from '@/assets/companies/69ea5a7d494684507ed8bf2c_clyde_and_co_black.png'
import cania from '@/assets/companies/cania.svg'
import white_castle from '@/assets/companies/69ea6ae1d2380db923fd56a9_white_and_case_transparent.png'
import hubspot from '@/assets/companies/69c1b0dd6fc0c1a9e32587f4_hubspot.svg'
import act from '@/assets/companies/act-customized.svg'

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
              background: `radial-gradient(ellipse 120% 80% at 50% 100%, #6366f1 0%, #6366f1 20%, #fb923c 65%, transparent 80%)`,
            }}
          />

          {/* Hero content */}
          <div className='absolute inset-0 z-40  flex flex-col items-center justify-center text-center px-4 sm:px-6 md:px-10 text-black'>
            <motion.p
              className='text-xs sm:text-sm font-outfit uppercase tracking-widest mb-2 sm:mb-4 font-light'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'easeInOut', delay: 0.4 }}
            >
              Real-time market intelligence
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: 'easeInOut', delay: 0.4 }}
              className='font-outfit font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight'
            >
              Explore the World's <br />
              <span className='italic font-medium'>Financial Markets</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: 'easeInOut', delay: 0.4 }}
              className='text-xs sm:text-base md:text-lg max-w-xs sm:max-w-md md:max-w-xl mb-6 sm:mb-8 font-outfit '
            >
              Analyze stocks, track performance, and make informed decisions with powerful data at your fingertips.
            </motion.p>

            <Link to="/tickerslist">
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.5, ease: 'easeInOut', delay: 1 }}
                className='bg-black text-zinc-200 font-medium px-6 sm:px-8 sm:py-1 py-1 rounded-md hover:scale-125 active:scale-85 font-outfit transition duration-300 ease-in-out text-sm sm:text-base'
              >
                Start Learning
              </motion.button>
            </Link>
          </div>

          {/* Tagline */}
          <motion.div className='absolute bottom-42 md:bottom-38 z-20 w-full flex justify-center items-center gap-2 font-outfit'>
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

          <div className=' absolute inset-x-0 bottom-24 md:bottom-20 h-24 z-10 overflow-hidden flex items-center justify-center'>

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