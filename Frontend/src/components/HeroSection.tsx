import { Link } from 'react-router-dom';
import { useIsMobile } from '../hooks/use-mobile'
import Aurora from './Aurora';

function HeroSection() {
  const isMobile = useIsMobile();
  return (
    <>

      <div className='relative h-screen bg-black'>
        <Aurora
          colorStops={["#7943d7", "#000000", "#fefefe"]}
          blend={0.35}
          amplitude={1}
          speed={2}
        />

        <div className='absolute inset-0 z-40 flex flex-col items-center justify-center text-center px-10'>
          <p className='text-white text-sm uppercase tracking-widest mb-4 font-light'>
            Real-time market intelligence
          </p>
          <h1 className='text-white font-excon font-bold text-6xl leading-tight mb-6'>
            Explore the World's <br /> Financial Markets
          </h1>
          <p className='text-zinc-400 text-lg max-w-xl mb-8'>
            Analyze stocks, track performance, and make informed decisions with powerful data at your fingertips.
          </p>
          <Link to={"/tickerslist "}>
            <button className='bg-white text-black font-bold px-8 py-3 rounded-xl hover:bg-zinc-200 transition'>
              Get Started
            </button>
          </Link>
        </div>

      </div>

    </>
  )
}

export default HeroSection