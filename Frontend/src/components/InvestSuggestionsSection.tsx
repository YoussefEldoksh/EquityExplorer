// import logo2 from '@/assets/logos/EE-black-logo.jpeg'
import { ChevronRight } from 'lucide-react';
import Iridescence from './Iridescence';


function InvestSuggestions() {
  return (
    <>
      <div className='bg-white'>
        <div className='relative min-h-screen bg-white overflow-hidden '>

          {/* Gradient overlay */}
          <div
            className='absolute inset-0'
            style={{
              background: `linear-gradient(360deg, #898bff 0%, #a2a4ff 20%, #d6d7ff 65%, transparent 90%)`,
              opacity: 0.85,
            }}
          />

          {/* Content */}
          <div className="relative z-10 w-full h-full flex flex-col items-center justify-center gap-4 sm:gap-6 px-4 sm:px-6 md:px-10 py-20">
            <div className='relative px-10 py-5 rounded-xl flex w-fit gap-2 text-center items-center justify-start backdrop-blur-xs border-slate-300 border overflow-hidden'>

              {/* Iridescence as the card's background */}
              <div className='absolute inset-0 w-full h-full'>
                <Iridescence
                  color={[0.5137254901960784, 0.5215686274509804, 1]}
                  mouseReact
                  amplitude={0.1}
                  speed={1}
                />
              </div>

              {/* Card content, above Iridescence */}
              <div className='relative z-10 h-full flex flex-col text-center items-center justify-start font-general-sans py-10'>

                <div className=' backdrop-blur-xs flex items-center justify-center'>
                  <p className='font-bold text-xl sm:text-2xl md:text-3xl text-white font-excon'>
                    EquityExplorer
                  </p>
                </div>

                <p className='text-[32px] sm:text-[44px] md:text-[80px] font-semibold leading-[0.95]  font-instrument-serif text-white'>
                  Stop running on guesswork.
                </p>
                <p className='text-[14px] sm:text-[16px] md:text-[20px] text-zinc-100 leading-[1.4] sm:leading-[1.15] max-w-[100%] sm:max-w-none mt-3'>
                  Real valuation data on every listed stock, from P/E to EV/EBITDA. <br />
                  No spreadsheets, no guesswork.
                </p>



                <button className="shadow-xl rounded-full mt-20 hover:scale-105 transition-transform duration-300 active:scale-95">
                  <div className="flex items-center justify-center rounded-full p-1 sm:p-2 bg-[#898bff] backdrop-blur-xs mt-4 shadow-xl">
                    <p className="text-[12px] flex items-center font-semibold sm:text-[12px] md:text-[15px] leading-[1.4] sm:leading-[1.15] max-w-[100%] sm:max-w-none text-white px-2">
                      Join The Wave Today <ChevronRight />
                    </p>
                  </div>
                </button>

              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

export default InvestSuggestions;