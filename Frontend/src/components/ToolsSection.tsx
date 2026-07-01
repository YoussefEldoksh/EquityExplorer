import { motion } from 'framer-motion';

// import image from '../assets/Screenshot from 2026-07-01 05-23-21.png';
import video from '../assets/Untitled design.mp4';
const blurReveal = {
  hidden: { opacity: 0, filter: 'blur(12px)', y: 20 },
  visible: {
    opacity: 1,
    filter: 'blur(0px)',
    y: 0,
    transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] as const },
  },
};

const container = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
};

function ToolsSection() {
  return (
    <>
      <div className='bg-white'>
        <div className='relative min-h-screen bg-white overflow-hidden'>

          <div
            className='absolute inset-0 z-10 pointer-events-none'
            style={{
              background: `linear-gradient(  #898bff 0%, #a2a4ff 20%, #d6d7ff 65%,  transparent 90%)`,
            }}
          />

          {/* Heading */}
          <motion.div
            className='relative z-20 w-full flex flex-col text-center items-center justify-start  sm:pt-20 px-4 font-general-sans'
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true, amount: 0.4 }}
            variants={blurReveal}
          >
            <div>
              <p className='text-[32px] sm:text-[44px] md:text-[60px] font-semibold leading-[0.95] sm:leading-[0.9]'>
                The Whole Financial Market, <br />finally at a glance
              </p>
            </div>
          </motion.div>

          {/* Subtext */}
          <motion.div
            className='relative z-20 w-full flex flex-col text-center items-center justify-start pt-4 sm:pt-5 px-4 font-general-sans'
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true, amount: 0.4 }}
            variants={blurReveal}
            transition={{ delay: 0.1 }}
          >
            <div className='w-full flex flex-col text-center items-center justify-start max-w-3xl'>
              <p className='text-[14px] sm:text-[16px] md:text-[20px]  text-zinc-600 leading-[1.4] sm:leading-[1.15] max-w-[90%] sm:max-w-none'>
                Screen, value, and track Egyptian equities with real fundamentals. From P/E and
                <br className='hidden sm:block' />
                DDM to risk and liquidity, Equity Explorer brings the whole picture together.
              </p>
            </div>
          </motion.div>

          {/* Badge row 1 */}
          <motion.div
            className='relative z-20 w-full flex text-center items-center justify-center pt-5 px-4 font-general-sans'
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true, amount: 0.4 }}
            variants={container}
          >
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3 max-w-2xl">
              {["Stock Screener", "Quick Search", "Search any EGX stock", "Privacy first", "Live Market Data", "Sentiment analysis"].map((label) => (
                <motion.div
                  key={label}
                  variants={blurReveal}
                  className="bg-gray-200/60 px-3 sm:px-4 py-2 text-zinc-600 rounded-full text-[9px] sm:text-[10px] font-medium whitespace-nowrap"
                >
                  {label}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Badge row 2 */}
          <motion.div
            className='relative z-20 w-full flex text-center items-center justify-center pt-2 sm:pt-1 px-4 font-general-sans'
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true, amount: 0.4 }}
            variants={container}
          >
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3 max-w-2xl">
              {["Risk Metrics", "Liquidity Metrics", "Shariah Compliance", "Valuation Models", "Interactive Charts"].map((label) => (
                <motion.div
                  key={label}
                  variants={blurReveal}
                  className="bg-gray-200/60 px-3 sm:px-4 py-2 text-zinc-600 rounded-full text-[9px] sm:text-[10px] font-medium whitespace-nowrap"
                >
                  {label}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Feature card */}
          <motion.div
            className='relative z-20 w-full flex text-center items-center justify-center mt-12 sm:mt-16 md:mt-20 px-4 pb-16'
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true, amount: 0.2 }}
            variants={container}
          >
            <div className="flex flex-col gap-3 bg-[#FFFFFF]/40 px-6 sm:px-10 md:px-10 py-6 sm:py-8 rounded-2xl max-w-6xl w-full font-general-sans">
              <motion.p
                variants={blurReveal}
                className='text-[26px] sm:text-[36px] md:text-[50px] font-semibold leading-[1.15] sm:leading-[1.2]'
              >
                Every Metric You Need, In One Screener
              </motion.p>
              <div>
                <motion.p
                  variants={blurReveal}
                  className='text-[13px] sm:text-[15px] md:text-[16px] text-zinc-600 leading-[1.5] sm:leading-[1.15] pb-5'
                >
                  Filter EGX-listed companies by valuation, risk, and liquidity metrics side by side. Run P/E, DDM, and EV/EBITDA comparisons, flag Shariah-compliant names, and drill into
                  <br className='hidden md:block' />
                  charts and sentiment, all without leaving the screener.
                </motion.p>
              </div>
              <motion.div variants={blurReveal} className="flex items-center justify-center">
                <video
                  src={video}
                  className="w-full h-auto max-h-[550px] object-contain rounded-lg shadow-lg"
                  autoPlay
                  loop
                  muted
                />
              </motion.div>
            </div>
          </motion.div>

        </div>
      </div>
    </>
  );
}

export default ToolsSection;