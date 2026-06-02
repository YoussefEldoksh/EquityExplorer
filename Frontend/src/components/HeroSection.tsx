import { Link } from 'react-router-dom';
import { motion } from 'framer-motion'

function HeroSection() {
  return (
    <>
      <div className='bg-white'>
        <motion.div
          className='relative h-screen bg-white overflow-hidden'
          // initial={{ opacity: 0, scale: 0 }}
          // animate={{ opacity: 1, scale: 1 }}
          // transition={{ duration: 1.2, ease: 'easeInOut' }}
        >

          {/* Cropped radial gradient — radiates from center, cropped by the viewport */}
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
          <div className='absolute inset-0 z-40 flex flex-col items-center justify-center text-center px-4 sm:px-6 md:px-10 text-black'>
            <motion.p
              className='text-xs sm:text-sm font-outfit uppercase tracking-widest mb-2 sm:mb-4 font-light'
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: 'easeInOut' }}
            >
              Real-time market intelligence
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, ease: 'easeInOut' }}
              className='font-outfit font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight '
            >
              Explore the World's <br /> Financial Markets
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: 'easeInOut' }}
              className='text-sm sm:text-base md:text-lg max-w-xs sm:max-w-md md:max-w-xl mb-6 sm:mb-8 font-outfit'
            >
              Analyze stocks, track performance, and make informed decisions with powerful data at your fingertips.
            </motion.p>
            <Link to="/tickerslist">
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.5, ease: 'easeInOut' }}
                className='bg-black text-zinc-200 font-medium px-6 sm:px-8  sm:py-1 py-1 rounded-md hover:scale-125 active:scale-85 font-outfit transition duration-300 ease-in-out text-sm sm:text-base'
              >
                Start Learning
              </motion.button>
            </Link>
          </div>

        </motion.div>
      </div>
    </>
  )
}

export default HeroSection