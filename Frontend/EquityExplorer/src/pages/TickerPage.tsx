import { useEffect, useState } from "react"
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";

import { ChartNoAxesColumn, ChartPie, ChartCandlestick, ChartScatter } from 'lucide-react';
import Chart from "../components/Chart";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import Footer from "../components/Footer";

function TickerPage() {
    const { stockTicker } = useParams();
    const [stockData, setStockData] = useState([]);
    const [timeseries, setTimeSeries] = useState<Record<string, any>>({});

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

    useEffect(() => {
        const fetchStockTimeSeries = async (period, interval) => {

            try {
                console.log(stockTicker)
                const response = await fetch(`http://127.0.0.1:8000/api/timeseries/${stockTicker.toUpperCase()}?period=${period}&interval=${interval}`);
                const data = await response.json();
                console.log(data);
                setTimeSeries(data);
            } catch (error) {
                console.error('Error fetching stock data:', error);
            }
        }

        fetchStockTimeSeries("1mo", "1d");

    }, [stockTicker])

    return (
        <>
            <Navbar isOtherPage={true}></Navbar>
            <div className=" px-15 mt-5">
                <p className="font-excon text-md">{stockData.fullExchangeName} - {stockData.exchange} - {stockData.currency}</p>

            </div>
            <div className=" px-15   gap-5 mb-5">
                <p className="font-excon font-bold text-3xl">{stockData.longName} ({stockData.symbol})</p>
                <p className={`font-bold text-xl ${stockData.currentPrice - stockData.previousClose >= 0 ? "text-green-700" : "text-red-700"}  `}> ${stockData.currentPrice} </p>
            </div>

            <div className=" px-10 gap-5 grid  grid-cols-4">

                <div className="bg-zinc-200 px-2 pt-2 pb-9 rounded-lg">
                    <div className="bg-white rounded-lg p-3 flex">
                        <div>

                            <p className="font-bold uppercase text-zinc-500 flex gap-2 ">Total Revenue {<ChartNoAxesColumn size={20} />}</p>
                            <p className="font-bold">${(stockData.totalRevenue / 1e9).toFixed(2)}B</p>

                        </div>

                    </div>

                </div>
                <div className="bg-zinc-200 px-2 pt-2 pb-9 rounded-lg">
                    <div className="bg-white rounded-lg p-3 flex">
                        <div>

                            <p className="font-bold uppercase text-zinc-500 flex gap-2 ">Total Debt {<ChartPie size={20} />}</p>
                            <p className="font-bold">${(stockData.totalDebt / 1e9).toFixed(2)}B</p>

                        </div>

                        <div>

                        </div>
                    </div>

                </div>
                <div className="bg-zinc-200 px-2 pt-2 pb-9 rounded-lg">
                    <div className="bg-white rounded-lg p-3 flex">
                        <div>

                            <p className="font-bold uppercase text-zinc-500  flex gap-2">Total Ask {<ChartCandlestick size={20} />}</p>
                            <p className="font-bold">${stockData.ask}M</p>

                        </div>

                        <div>

                        </div>
                    </div>

                </div>
                <div className="bg-zinc-200 px-2 pt-2 pb-9 rounded-lg">
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

                <div className="bg-zinc-200 col-span-2  px-2 pt-2 pb-9 rounded-lg mt-5  ">
                    <div className="bg-white rounded-lg p-3 flex">
                        <Chart timeseries={timeseries} currPrice={stockData.currentPrice} prevPrice={stockData.previousClose}></Chart>
                    </div>
        
                </div>
                <div className="bg-zinc-200 px-2 pt-2 pb-9 rounded-lg mt-5 ">

                    <div className="bg-white rounded-lg p-3 flex">
                        <div className="grid grid-cols-3 gap-3 text-sm">
                            <div className="bg-zinc-50 rounded p-2">
                                <p className="text-zinc-500">Market Cap</p>
                                <p className="font-semibold">${(stockData.marketCap / 1e9).toFixed(2)}B</p>
                            </div>
                            <div className="bg-zinc-50 rounded p-2">
                                <p className="text-zinc-500">Volume</p>
                                <p className="font-semibold">{stockData.volume?.toLocaleString()}</p>
                            </div>
                            <div className="bg-zinc-50 rounded p-2">
                                <p className="text-zinc-500">52W High</p>
                                <p className="font-semibold">${stockData.fiftyTwoWeekHigh?.toFixed(2)}</p>
                            </div>
                            <div className="bg-zinc-50 rounded p-2">
                                <p className="text-zinc-500">52W Low</p>
                                <p className="font-semibold">${stockData.fiftyTwoWeekLow?.toFixed(2)}</p>
                            </div>
                            <div className="bg-zinc-50 rounded p-2">
                                <p className="text-zinc-500">P/E Ratio</p>
                                <p className="font-semibold">{stockData.trailingPE?.toFixed(2) ?? "N/A"}</p>
                            </div>
                            <div className="bg-zinc-50 rounded p-2">
                                <p className="text-zinc-500">Dividend Yield</p>
                                <p className="font-semibold">
                                    {stockData.dividendYield ? (stockData.dividendYield * 100).toFixed(2) + "%" : "N/A"}
                                </p>
                            </div>
                            <div className="bg-zinc-50 rounded p-2">
                                <p className="text-zinc-500 uppercase">ebitda</p>
                                <p className="font-semibold">
                                    {stockData.ebitda ? (stockData.ebitda / 10e9).toFixed(4) : "N/A"}B
                                </p>
                            </div>
                            <div className="bg-zinc-50 rounded p-2">
                                <p className="text-zinc-500">Shares Outstanding</p>
                                <p className="font-semibold">
                                    {stockData.sharesOutstanding ? (stockData.sharesOutstanding / 10e9).toFixed(4) : "N/A"}B
                                </p>
                            </div>
                            <div className="bg-zinc-50 rounded p-2">
                                <p className="text-zinc-500">EPS</p>
                                <p className="font-semibold">
                                    x{stockData.trailingEps}
                                </p>
                            </div>
                            <div className="bg-zinc-50 rounded p-2">
                                <p className="text-zinc-500">Float Shares</p>
                                <p className="font-semibold">
                                    {stockData.floatShares ? (stockData.floatShares / 10e9).toFixed(4) : "N/A"}B
                                </p>
                            </div>
                            <div className="bg-zinc-50 rounded p-2">
                                <p className="text-zinc-500">Book Value</p>
                                <p className="font-semibold">
                                    {stockData.bookValue ? (stockData.floatShares / 10e9).toFixed(4) : "N/A"}B
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
            </div >

            <div className="flex w-full justify-center my-5 ">
                <Tabs defaultValue="overview" className="w-1/2 flex justify-center ">
                    <TabsList className="flex justify-center w-1/2 bg-zinc-300 text-md">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="analytics">Analytics</TabsTrigger>
                        <TabsTrigger value="reports">Reports</TabsTrigger>
                    </TabsList>
                    <TabsContent value="overview">
                        <Card>
                            <CardHeader>
                                <CardTitle>Overview</CardTitle>
                                <CardDescription>
                                    {stockData.longBusinessSummary}
                                </CardDescription>
                            </CardHeader>

                        </Card>
                    </TabsContent>
                    <TabsContent value="analytics">
                        <Card>
                            <CardHeader>
                                <CardTitle>Analytics</CardTitle>
                                <CardDescription>
                                    Track performance and user engagement metrics. Monitor trends and
                                    identify growth opportunities.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="text-sm text-muted-foreground">
                                Page views are up 25% compared to last month.
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="reports">
                        <Card>
                            <CardHeader>
                                <CardTitle>Reports</CardTitle>
                                <CardDescription>
                                    Generate and download your detailed reports. Export data in
                                    multiple formats for analysis.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="text-sm text-muted-foreground">
                                You have 5 reports ready and available to export.
                            </CardContent>
                        </Card>
                    </TabsContent>
                    
                </Tabs>
            </div>
            <Footer></Footer>
        </>
    )
}

export default TickerPage