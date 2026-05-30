function Footer() {
    return (
        <div className="bg-black font-excon text-white md:h-[700px] flex flex-col justify-between">
            <div className="grid grid-cols-1 md:grid-cols-4 px-10 py-10 gap-10 ">

                {/* Brand col */}
                <div className="flex flex-col gap-4">
                    <p className="text-white text-2xl font-bold">EquityExplorer</p>
                    <p className="text-zinc-400 text-sm">EGX stock analysis & valuation tool</p>
                </div>

                {/* About + Stocks */}
                <div className="flex flex-col gap-8">
                    <div className="flex flex-col gap-2">
                        <p className="text-sm font-bold tracking-widest">ABOUT</p>
                        <p className="text-sm text-zinc-400 hover:text-white cursor-pointer hover:underline">What is Equity Explorer?</p>
                        <p className="text-sm text-zinc-400 hover:text-white cursor-pointer hover:underline">Methodology</p>
                        <p className="text-sm text-zinc-400 hover:text-white cursor-pointer hover:underline">Data Sources</p>
                    </div>
                    <div className="flex flex-col gap-2">
                        <p className="text-sm font-bold tracking-widest">STOCKS</p>
                        <p className="text-sm text-zinc-400 hover:text-white cursor-pointer hover:underline">EGX 30 Companies</p>
                        <p className="text-sm text-zinc-400 hover:text-white cursor-pointer hover:underline">Screener</p>
                        <p className="text-sm text-zinc-400 hover:text-white cursor-pointer hover:underline">Watchlist</p>
                    </div>
                </div>

                {/* Research + Market Events */}
                <div className="flex flex-col gap-8">
                    <div className="flex flex-col gap-2">
                        <p className="text-sm font-bold tracking-widest">RESEARCH</p>
                        <p className="text-sm text-zinc-400 hover:text-white cursor-pointer hover:underline">Valuation Models</p>
                        <p className="text-sm text-zinc-400 hover:text-white cursor-pointer hover:underline">Technical Analysis</p>
                        <p className="text-sm text-zinc-400 hover:text-white cursor-pointer hover:underline">Macro Indicators</p>
                    </div>
                    <div className="flex flex-col gap-2">
                        <p className="text-sm font-bold tracking-widest">MARKET EVENTS</p>
                        <p className="text-sm text-zinc-400 hover:text-white cursor-pointer hover:underline">Earnings Calendar</p>
                        <p className="text-sm text-zinc-400 hover:text-white cursor-pointer hover:underline">Dividend Dates</p>
                        <p className="text-sm text-zinc-400 hover:text-white cursor-pointer hover:underline">EGX Announcements</p>
                    </div>
                </div>

                {/* Site Info */}
                <div className="flex flex-col gap-2">
                    <p className="text-sm font-bold tracking-widest">SITE INFORMATION</p>
                    <p className="text-sm text-zinc-400 hover:text-white cursor-pointer hover:underline">How to Use</p>
                    <p className="text-sm text-zinc-400 hover:text-white cursor-pointer hover:underline">Contact / Feedback</p>
                    <p className="text-sm text-zinc-400 hover:text-white cursor-pointer hover:underline">Disclaimer</p>
                </div>

            </div>

            {/* Bottom bar */}
            <div className=" border-zinc-800 px-10 py-5 flex flex-col sm:flex-row justify-between gap-3">
                <p className="text-zinc-500 text-sm">&copy; 2026 Equity Explorer — for informational purposes only</p>
                <div className="flex gap-6">
                    <p className="text-zinc-500 text-sm hover:text-white cursor-pointer hover:underline">Terms & Conditions</p>
                    <p className="text-zinc-500 text-sm hover:text-white cursor-pointer hover:underline">Privacy Policy</p>
                </div>
            </div>
        </div>
    )
}

export default Footer