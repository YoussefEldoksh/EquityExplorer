import CardSwap, { Card } from './CardSwap';

function ToolsSection() {
  return (
    <div className="w-full py-24 bg-black overflow-hidden">
      <div className="max-w-7xl mx-auto px-8 grid md:grid-cols-2 gap-12 items-center">
        {/* LEFT */}
        <div className="text-white">
          <h2 className="text-4xl font-bold mb-6">What Tools We Provide</h2>

          <p className="text-gray-300 leading-relaxed">
            Analyze stock performance, monitor your investments, and make
            data-driven decisions using advanced financial tools designed for
            modern investors.
          </p>
        </div>

        {/* RIGHT */}
        <div className="flex justify-center md:justify-end">
          <div className="relative h-[500px] -translate-y-16 ">
            <CardSwap
              cardDistance={60}   
              verticalDistance={70}
              delay={5000}
              pauseOnHover={false}
            >
              <Card className="!bg-[#e5e7eb] !text-black p-6 rounded-xl shadow-md w-[300px] border-0">
                <h3 className="text-lg font-bold mb-4">Valuation</h3>
                <div className="space-y-3 text-sm">
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

              <Card className="!bg-[#e5e7eb] !text-black p-6 rounded-xl shadow-md w-[300px] border-0">
                <h3 className="text-lg font-bold mb-4">Profitability</h3>
                <div className="space-y-3 text-sm">
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

              <Card className="!bg-[#e5e7eb] !text-black p-6 rounded-xl shadow-md w-[300px] border-0">
                <h3 className="text-lg font-bold mb-4">Risk</h3>
                <div className="space-y-3 text-sm">
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
