import { motion } from 'framer-motion';
import { useIsMobile } from '../hooks/use-mobile';

function FeaturesSection() {

  const isMobile: boolean = useIsMobile();

  const paragraphsMobile = [
    '"Equity Explorer is the ',
    'leading financial partner in MENA',
    'and the top MENA ECM advisor.',
    ' We deploy the largest and most',
    'combining a deep knowledge of',
    'diverse group of professionals, ',
    'companies, markets, and economies',
    'with proven global expertise."'
  ];

  const paragraphsDesktop = [
    '"Equity Explorer is the leading financial partner in MENA and the top MENA advisor.',
    ' We deploy the largest and most diverse group of professionals, companies,',
    'markets, and economies with proven global expertise."'
  ];

  return (
    <div className='relative bg-white h-fit flex flex-col items-center gap-0'>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.6, ease: 'easeOut', delay: 0.4 }}
        style={{
          background: `  radial-gradient(ellipse 120% 80% at 50% 0%, #6366f1 0%, #6366f1 20%, #fb923c 65%, transparent 80%)`,
          // backgroundColor, // this fills in behind the gradient as you scroll
        }}
        className='w-full h-200 flex flex-col items-center  justify-start text-center justify-start px-4 sm:px-6 md:px-10 text-black py-20'
      >
        <div className=' flex flex-col items-center '>
          {
            isMobile ? (
              paragraphsMobile.map((line, index) => (
                <motion.p
                  key={index}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.7, ease: 'easeOut', delay: index * 0.4 }}
                  className='font-archivo text-[px] md:text-3xl uppercase italic font-normal text-gray-800 leading-tight text-justify  '
                >
                  {line}
                </motion.p>
              ))
            ) : (
              paragraphsDesktop.map((line, index) => (
                <motion.p
                  key={index}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.7, ease: 'easeOut', delay: index * 0.4 }}
                  className='font-archivo text-[10px] md:text-3xl uppercase italic font-normal text-gray-800 leading-tight  '
                >
                  {line}
                </motion.p>
              ))
            )
          }
        </div>
      </motion.div>
    </div>
  );
}

export default FeaturesSection;