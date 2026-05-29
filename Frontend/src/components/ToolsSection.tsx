// @ts-ignore
import CardSwap, { Card } from './CardSwap';

function ToolsSection() {
  return (
    <div className="w-full py-12 sm:py-16 md:py-24 bg-black overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 items-center">
        {/* LEFT */}
        <div className="text-white order-2 md:order-1">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">What Tools We Provide</h2>

          <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
            Analyze stock performance, monitor your investments, and make
            data-driven decisions using advanced financial tools designed for
            modern investors.
          </p>
        </div>

        {/* RIGHT */}
        <div className="flex justify-center md:justify-end order-1 md:order-2">
          <div className="relative h-[300px] sm:h-[400px] md:h-[500px] w-full md:w-auto -translate-y-8 sm:-translate-y-12 md:-translate-y-16 ">
            <CardSwap
              cardDistance={60}   
              verticalDistance={70}
              delay={5000}
              pauseOnHover={false}
            >
              <Card className="!bg-[#e5e7eb] !text-black p-4 sm:p-6 rounded-xl shadow-md w-full sm:w-[280px] md:w-[300px] border-0 mx-auto">
                <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4">Valuation</h3>
                <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
                  <p>
                    <span className="font-semibold">Forward P/E:</span> Expected
                    price-to-earnings based on future earnings estimates.
                  </p>
                  <p>
                    <span className="font-semibold">Price to Book:</span>{' '}
                    Compares stock price to the company's net asset value.
                  </p>
                  <p>
                    <span className="font-semibold">EV/EBITDA:</span> Measures
                    company value relative to its operating earnings.
                  </p>
                </div>
              </Card>

              <Card className="!bg-[#e5e7eb] !text-black p-4 sm:p-6 rounded-xl shadow-md w-full sm:w-[280px] md:w-[300px] border-0 mx-auto">
                <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4">Profitability</h3>
                <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
                  <p>
                    <span className="font-semibold">Profit Margin:</span>{' '}
                    Percentage of revenue that turns into net profit.
                  </p>
                  <p>
                    <span className="font-semibold">Return on Equity:</span>{' '}
                    Measures how efficiently a company generates profit from
                    equity.
                  </p>
                  <p>
                    <span className="font-semibold">Gross Margin:</span> Shows
                    how much profit remains after production costs.
                  </p>
                </div>
              </Card>

              <Card className="!bg-[#e5e7eb] !text-black p-4 sm:p-6 rounded-xl shadow-md w-full sm:w-[280px] md:w-[300px] border-0 mx-auto">
                <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4">Risk</h3>
                <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
                  <p>
                    <span className="font-semibold">Beta:</span> Indicates how
                    volatile the stock is compared to the market.
                  </p>
                  <p>
                    <span className="font-semibold">Short Ratio:</span> Measures
                    how many days it would take to cover short positions.
                  </p>
                  <p>
                    <span className="font-semibold">Short % of Float:</span>{' '}
                    Percentage of shares being shorted in the market.
                  </p>
                </div>
              </Card>
            </CardSwap>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ToolsSection;
