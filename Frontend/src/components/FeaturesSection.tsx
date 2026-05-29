// @ts-ignore
import BorderGlow from './BorderGlow';
import { TrendingUp, DollarSign, Scale } from 'lucide-react';
function FeaturesSection() {
  return (
    <div className="px-4 sm:px-6 md:px-8 py-12 sm:py-16 overflow-hidden ">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 sm:mb-12 text-gray-900 ">
        Why Invest in stock market
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 w-full max-w-7xl mx-auto min-w-0">        <BorderGlow
        borderRadius={20}
        glowRadius={40}
        glowIntensity={1}
        glowColor="40 80 80"
        backgroundColor="#120F17"
        colors={['#c084fc', '#f472b6', '#38bdf8']}
      >
        <div className="p-4 sm:p-6 h-full text-white ">
          <TrendingUp className="text-teal-400 w-6 sm:w-8 h-6 sm:h-8 mb-4 " />
          <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">Long-Term Growth</h3>
          <p className="text-gray-400 text-xs sm:text-sm">
            Stocks have historically delivered higher returns than savings,
            helping your wealth grow over time.
          </p>
        </div>
      </BorderGlow>

        <BorderGlow
          borderRadius={20}
          glowRadius={40}
          glowIntensity={1}
          glowColor="40 80 80"
          backgroundColor="#120F17"
          colors={['#c084fc', '#f472b6', '#38bdf8']}
        >
          <div className="p-4 sm:p-6 h-full text-white">
            <DollarSign className="text-teal-400 w-6 sm:w-8 h-6 sm:h-8 mb-4" />
            <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">Passive Income</h3>
            <p className="text-gray-400 text-xs sm:text-sm">
              Invest in dividend-paying stocks for a steady income stream.
            </p>
          </div>
        </BorderGlow>

        <BorderGlow
          borderRadius={20}
          glowRadius={40}
          glowIntensity={1}
          glowColor="40 80 80"
          backgroundColor="#120F17"
          colors={['#c084fc', '#f472b6', '#38bdf8']}
        >
          <div className="p-4 sm:p-6 h-full text-white">
            <Scale className="text-teal-400 w-6 sm:w-8 h-6 sm:h-8 mb-4" />
            <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">Diversification</h3>
            <p className="text-gray-400 text-xs sm:text-sm">
              Spread risk across industries and markets to protect your
              portfolio.
            </p>
          </div>
        </BorderGlow>
      </div>
    </div>
  );
}

export default FeaturesSection;
