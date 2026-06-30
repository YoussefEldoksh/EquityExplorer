import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';
import { useRef } from 'react';
import { useIsMobile } from '../hooks/use-mobile';

// Each word gets its own slice of the overall scroll progress.
// As scrollYProgress moves through that slice, the word lightens up.
function Word({
  children,
  range,
  progress,
}: {
  children: string;
  range: [number, number];
  progress: MotionValue<number>;
}) {
  const color = useTransform(progress, range, ['#5d5c5c', '#38383a']);
  const opacity = useTransform(progress, range, [0.35, 1]);

  return (
    <motion.span style={{ color, opacity }} className='inline-block mr-[0.3em]'>
      {children}
    </motion.span>
  );
}

function FeaturesSection() {
  const isMobile: boolean = useIsMobile();
  const containerRef = useRef(null);

  // scrollYProgress goes 0 -> 1 as the section travels through this scroll window
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.85', 'end 0.4'],
  });

const paragraphsMobile = [
  '"Equity Explorer is the',
  'leading screening platform',
  'for the Egyptian Exchange,',
  'built for retail investors',
  'who want institutional-grade',
  'analysis without the noise.',
  'We combine deep financial',
  'data with Shariah screening."',
];

const paragraphsDesktop = [
  'Equity Explorer works with investors,',
  'analysts, and traders to transform',
  'raw EGX market data into clear,',
  'actionable insight. Through real-time',
  'screening, fundamental analysis, and',
  'Shariah compliance tools, we help',
  'investors navigate the Egyptian market',
  'with confidence.',
];
  const paragraphs = isMobile ? paragraphsMobile : paragraphsDesktop;

  // Flatten into lines-of-words so we can render line breaks but
  // assign every word a unique, sequential slice of total scroll progress.
  const lines = paragraphs.map((line) => line.split(' ').filter(Boolean));
  const totalWords = lines.reduce((sum, words) => sum + words.length, 0);

  let wordIndex = 0;

  return (
    <div className='relative bg-white h-screen flex flex-col items-center gap-0'>
      <motion.div
        ref={containerRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.6, ease: 'easeOut', delay: 0.4 }}
        className='w-full h-full md:h-full flex flex-col  text-center  px-4 sm:px-6 md:px-10 text-black py-20'
        style={{
          background: `linear-gradient(360deg, #898bff 0%, #a2a4ff 20%, #d6d7ff 65%,  transparent 90%)`,
        }}
      >
        <div className='h-full flex flex-col text-center h-full items-center justify-start'>
          {lines.map((words, lineIdx) => (
            <p
              key={lineIdx}
              className={
                isMobile
                  ? 'font-cabinet-grotesk text-[30px] capitalize  font-normal leading-tight text-justify'
                  : 'font-cabinet-groteskarchio text-[50px] capitalize font-normal leading-tight '
              }
            >
              {words.map((word, wIdx) => {
                const start = wordIndex / totalWords;
                const end = (wordIndex + 1) / totalWords;
                wordIndex += 1;

                return (
                  <Word key={wIdx} range={[start, end]} progress={scrollYProgress}>
                    {word}
                  </Word>
                );
              })}
            </p>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

export default FeaturesSection;