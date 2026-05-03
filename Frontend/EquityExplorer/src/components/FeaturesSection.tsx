import BorderGlow from './BorderGlow';
import { TrendingUp, DollarSign, Scale } from 'lucide-react';
function FeaturesSection() {
  return (
    <div className="px-8 py-16">
      <h2 className="text-4xl font-bold mb-12 text-gray-900">
        Why Invest in stock market
      </h2>

      <div className="grid md:grid-cols-3 gap-8">
        <BorderGlow
          borderRadius={20}
          glowRadius={40}
          glowIntensity={1}
          glowColor="40 80 80"
          backgroundColor="#120F17"
          colors={['#c084fc', '#f472b6', '#38bdf8']}
        >
          <div className="p-6 h-full text-white">
            <TrendingUp className="text-teal-400 w-8 h-8 mb-4" />
            <h3 className="text-xl font-semibold mb-3">Long-Term Growth</h3>
            <p className="text-gray-400 text-sm">
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
          <div className="p-6 h-full text-white">
            <DollarSign className="text-teal-400 w-8 h-8 mb-4" />
            <h3 className="text-xl font-semibold mb-3">Passive Income</h3>
            <p className="text-gray-400 text-sm">
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
          <div className="p-6 h-full text-white">
            <Scale className="text-teal-400 w-8 h-8 mb-4" />
            <h3 className="text-xl font-semibold mb-3">Diversification</h3>
            <p className="text-gray-400 text-sm">
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
