import { useEffect, useState } from "react"
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";

import { ChartNoAxesColumn, ChartPie, ChartCandlestick, ChartScatter } from 'lucide-react';
import Chart from "../components/Chart";


function TickerPage() {
    const { stockTicker } = useParams();
    const [stockData, setStockData] = useState([]);

    useEffect(() => {
        const fetchStockData = async () => {

            try {
                console.log(stockTicker)
                const response = await fetch(`http://127.0.0.1:8000/api/stock/${stockTicker.toUpperCase()}`);
                const data = await response.json();
                console.log(data);
                setStockData(data);
            } catch (error) {
                console.error('Error fetching stock data:', error);
            }
        }

        fetchStockData();

    }, [stockTicker])

    return (
        <>
            <Navbar isOtherPage={true}></Navbar>
            <div className=" px-15 mt-5">
                <p className="font-excon text-md">{stockData.fullExchangeName} - {stockData.exchange} - {stockData.currency}</p>

            </div>
            <div className=" px-15   gap-5 mb-5">
                <p className="font-excon font-bold text-3xl">{stockData.longName} ({stockData.symbol})</p>
                <p className=" font-bold text-xl "> Previous Close ${stockData.previousClose}</p>
            </div>

            <div className=" px-10 gap-5 grid  grid-cols-4">

                <div className="bg-gray-200 px-2 pt-1 pb-9 rounded-lg">
                    <div className="bg-white rounded-lg p-3 flex">
                        <div>

                            <p className="font-bold uppercase text-zinc-500 flex gap-2 ">Total Revenue {<ChartNoAxesColumn size={20} />}</p>
                            <p className="font-bold">${(stockData.totalRevenue/ 1e9).toFixed(2)}B</p>

                        </div>

                    </div>

                </div>
                <div className="bg-gray-200 px-2 pt-2 pb-9 rounded-lg">
                    <div className="bg-white rounded-lg p-3 flex">
                        <div>

                            <p className="font-bold uppercase text-zinc-500 flex gap-2 ">Total Debt {<ChartPie size={20} />}</p>
                            <p className="font-bold">${(stockData.totalDebt/ 1e9).toFixed(2)}B</p>

                        </div>

                        <div>

                        </div>
                    </div>

                </div>
                <div className="bg-gray-200 px-2 pt-2 pb-9 rounded-lg">
                    <div className="bg-white rounded-lg p-3 flex">
                        <div>

                            <p className="font-bold uppercase text-zinc-500  flex gap-2">Total Ask {<ChartCandlestick size={20} />}</p>
                            <p className="font-bold">${stockData.ask}M</p>

                        </div>

                        <div>

                        </div>
                    </div>

                </div>
                <div className="bg-gray-200 px-2 pt-2 pb-9 rounded-lg">
                    <div className="bg-white rounded-lg p-3 flex">
                        <div>

                            <p className="font-bold uppercase text-zinc-500 flex gap-2">Total Bid {<ChartScatter size={20} />}</p>
                            <p className="font-bold">${stockData.bid}M</p>

                        </div>

                        <div>

                        </div>
                    </div>

                </div>


            </div>
            <div className="grid grid-cols-3 mx-9 gap-2">

                <div className="bg-gray-200 col-span-2  px-2 pt-2 pb-9 rounded-lg mt-5  ">
                    <div className="bg-white rounded-lg p-3 flex">
                        <Chart></Chart>
                    </div>

                </div>
                <div className="bg-gray-200 px-2 pt-2 pb-9 rounded-lg mt-5 ">

                    <div className="bg-white rounded-lg p-3 flex">
                        <div className="grid grid-cols-3 gap-3 text-sm">
                            <div className="bg-gray-50 rounded p-2">
                                <p className="text-gray-500">Market Cap</p>
                                <p className="font-semibold">${(stockData.marketCap / 1e9).toFixed(2)}B</p>
                            </div>
                            <div className="bg-gray-50 rounded p-2">
                                <p className="text-gray-500">Volume</p>
                                <p className="font-semibold">{stockData.volume?.toLocaleString()}</p>
                            </div>
                            <div className="bg-gray-50 rounded p-2">
                                <p className="text-gray-500">52W High</p>
                                <p className="font-semibold">${stockData.fiftyTwoWeekHigh?.toFixed(2)}</p>
                            </div>
                            <div className="bg-gray-50 rounded p-2">
                                <p className="text-gray-500">52W Low</p>
                                <p className="font-semibold">${stockData.fiftyTwoWeekLow?.toFixed(2)}</p>
                            </div>
                            <div className="bg-gray-50 rounded p-2">
                                <p className="text-gray-500">P/E Ratio</p>
                                <p className="font-semibold">{stockData.trailingPE?.toFixed(2) ?? "N/A"}</p>
                            </div>
                            <div className="bg-gray-50 rounded p-2">
                                <p className="text-gray-500">Dividend Yield</p>
                                <p className="font-semibold">
                                    {stockData.dividendYield ? (stockData.dividendYield * 100).toFixed(2) + "%" : "N/A"}
                                </p>
                            </div>
                            <div className="bg-gray-50 rounded p-2">
                                <p className="text-gray-500 uppercase">ebitda</p>
                                <p className="font-semibold">
                                    {stockData.ebitda ? (stockData.ebitda/10e9).toFixed(4)  : "N/A"}B
                                </p>
                            </div>
                            <div className="bg-gray-50 rounded p-2">
                                <p className="text-gray-500">Shares Outstanding</p>
                                <p className="font-semibold">
                                    {stockData.sharesOutstanding ? (stockData.sharesOutstanding/10e9).toFixed(4)  : "N/A"}B
                                </p>
                            </div>
                            <div className="bg-gray-50 rounded p-2">
                                <p className="text-gray-500">EPS</p>
                                <p className="font-semibold">
                                    x{stockData.trailingEps}
                                </p>
                            </div>
                        </div>

                </div>
            </div>
        </div >
        </>
    )
}

export default TickerPage