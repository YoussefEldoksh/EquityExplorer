import { Link } from 'react-router-dom';
import Aurora from './Aurora';

function HeroSection() {
  return (
    <>

      <div className='relative h-screen bg-black'>
        <Aurora
          colorStops={["#4335d6", "#4335d6","#4335d6"]}
          blend={0.35}
          amplitude={0.5}
          speed={2}
        />

        <div className='absolute inset-0 z-40 flex flex-col items-center justify-center text-center px-4 sm:px-6 md:px-10'>
          <p className='text-white text-xs sm:text-sm uppercase tracking-widest mb-2 sm:mb-4 font-light'>
            Real-time market intelligence
          </p>
          <h1 className='text-white font-excon font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight mb-4 sm:mb-6'>
            Explore the World's <br /> Financial Markets
          </h1>
          <p className='text-zinc-400 text-sm sm:text-base md:text-lg max-w-xs sm:max-w-md md:max-w-xl mb-6 sm:mb-8'>
            Analyze stocks, track performance, and make informed decisions with powerful data at your fingertips.
          </p>
          <Link to={"/tickerslist "}>
            <button className='bg-white text-black font-bold px-6 sm:px-8 py-2 sm:py-3 rounded-xl hover:bg-zinc-200 transition text-sm sm:text-base'>
              Get Started
            </button>
          </Link>
        </div>

      </div>

    </>
  )
}

export default HeroSection