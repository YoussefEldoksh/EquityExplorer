import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { TrendingUp, TrendingDown } from 'lucide-react';

import {
  ChartNoAxesColumn,
  ChartPie,
  ChartCandlestick,
  ChartScatter,
  Info,
} from 'lucide-react';
import Chart from '../components/Chart';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Footer from '../components/Footer';
import { Button } from '../components/ui/button';
import ToolTip from '../components/ToolTip';
import { useIsMobile } from '../hooks/use-mobile';

function TickerPage() {
  const { stockTicker } = useParams();
  const [stockData, setStockData] = useState({});
  const [timeseries, setTimeSeries] = useState<Record<string, any>>({});
  const timeseriesEntries = Object.entries(timeseries);
  const startPrice =
    timeseriesEntries.length > 0 ? timeseriesEntries[0][1].Close : null;
  const isMobile = useIsMobile();

  const priceChange = startPrice ? stockData.currentPrice - startPrice : null;
  const priceChangePct =
    priceChange && startPrice
      ? ((priceChange / startPrice) * 100).toFixed(2)
      : null;
  const isPositive = priceChange ? priceChange >= 0 : true;

  const fetchStockTimeSeries = async (period, interval) => {
    try {
      console.log(stockTicker);
      const response = await fetch(
        `/api/timeseries/${stockTicker.toUpperCase()}?period=${period}&interval=${interval}`,
      );
      const data = await response.json();
      console.log(data);
      setTimeSeries(data);
    } catch (error) {
      console.error('Error fetching stock data:', error);
    }
  };

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        console.log(stockTicker);
        const response = await fetch(`/api/stock/${stockTicker.toUpperCase()}`);
        const data = await response.json();
        console.log(data);
        setStockData(data);
        await fetchStockTimeSeries('1mo', '1d');
      } catch (error) {
        console.error('Error fetching stock data:', error);
      }
    };

    fetchStockData();
  }, [stockTicker]);

  return (
    <>
      <Navbar isOtherPage={true}></Navbar>
      {!isMobile && (
        <>
          <div className=" px-15 mt-5">
            <p className="font-excon text-md">
              {stockData.fullExchangeName} - {stockData.exchange} -{' '}
              {stockData.currency}
            </p>
          </div>
          <div className=" px-15   gap-5 mb-5">
            <div className="flex items-center gap-2">
              <p className="font-excon font-bold text-3xl">
                {stockData.longName} ({stockData.symbol}){' '}
              </p>
              <p
                className={` ${isPositive ? 'text-green-700' : 'text-red-700'} font-bold`}
              >
                {' '}
                {isPositive ? (
                  <TrendingUp size={30}></TrendingUp>
                ) : (
                  <TrendingDown size={30} />
                )}
              </p>
            </div>
            <div className="flex gap-3 items-center">
              <p
                className={`font-bold text-xl ${isPositive ? 'text-green-700' : 'text-red-700'}  `}
              >
                {' '}
                ${stockData.currentPrice}
              </p>
              <p
                className={`${isPositive ? 'text-green-700' : 'text-red-700'} `}
              >
                {priceChangePct}%
              </p>
            </div>
          </div>

          <div className=" px-10 gap-5 grid  grid-cols-4">
            <div className="bg-zinc-200 px-2 pt-2 pb-9 rounded-lg">
              <div className="bg-white rounded-lg p-3 flex ">
                <div className="w-full">
                  <div className="flex justify-between items-center  ">
                    <p className="font-bold uppercase text-zinc-500 flex gap-2  ">
                      Total Revenue {<ChartNoAxesColumn size={20} />}
                    </p>
                    <div>
                      <ToolTip explain="Total Revenue — the total amount of money the company earned from selling its products or services over the last 12 months, before any expenses are deducted."></ToolTip>
                    </div>
                  </div>
                  <p className="font-bold">
                    ${(stockData.totalRevenue / 1e9).toFixed(2)}B
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-zinc-200 px-2 pt-2 pb-9 rounded-lg">
              <div className="bg-white rounded-lg p-3 flex">
                <div className="w-full">
                  <div className="flex justify-between items-center">
                    <p className="font-bold uppercase text-zinc-500 flex gap-2 ">
                      Total Debt {<ChartPie size={20} />}
                    </p>
                    <div>
                      <ToolTip
                        explain="Total Debt — the total amount of money the company owes to lenders, including both short-term and long-term loans and bonds.
"
                      ></ToolTip>
                    </div>
                  </div>
                  <p className="font-bold">
                    ${(stockData.totalDebt / 1e9).toFixed(2)}B
                  </p>
                </div>

                <div></div>
              </div>
            </div>
            <div className="bg-zinc-200 px-2 pt-2 pb-9 rounded-lg">
              <div className="bg-white rounded-lg p-3 flex">
                <div className="w-full">
                  <div className="flex justify-between items-center">
                    <p className="font-bold uppercase text-zinc-500  flex gap-2">
                      Total Ask {<ChartCandlestick size={20} />}
                    </p>
                    <div>
                      <ToolTip
                        explain="Ask — the lowest price a seller is currently willing to accept for one share of the stock.
"
                      ></ToolTip>
                    </div>
                  </div>
                  <p className="font-bold">${stockData.ask}M</p>
                </div>

                <div></div>
              </div>
            </div>
            <div className="bg-zinc-200 px-2 pt-2 pb-9 rounded-lg">
              <div className="bg-white rounded-lg p-3 flex">
                <div className="w-full">
                  <div className="flex justify-between items-center">
                    <p className="font-bold uppercase text-zinc-500 flex gap-2">
                      Total Bid {<ChartScatter size={20} />}
                    </p>
                    <div>
                      <ToolTip explain="Bid — the highest price a buyer is currently willing to pay for one share of the stock."></ToolTip>
                    </div>
                  </div>

                  <p className="font-bold">${stockData.bid}M</p>
                </div>

                <div></div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 mx-9 gap-2">
            <div className="bg-zinc-200 col-span-2  px-2 pt-2 pb-9 rounded-lg mt-5  ">
              <div className="bg-white rounded-lg p-3 flex">
                <Chart timeseries={timeseries}></Chart>
              </div>

              <div className="mx-5 mt-3 flex justify-end gap-1">
                <Button
                  variant="outline"
                  className="rounded-xl text-xsm hover:text-white hover:bg-zinc-400"
                  onClick={() => fetchStockTimeSeries('1d', '1m')}
                >
                  1 Day
                </Button>
                <Button
                  variant="outline"
                  className="rounded-xl text-xsm hover:text-white hover:bg-zinc-400"
                  onClick={() => fetchStockTimeSeries('5d', '5m')}
                >
                  1 Week
                </Button>
                <Button
                  variant="outline"
                  className="rounded-xl text-xsm hover:text-white hover:bg-zinc-400"
                  onClick={() => fetchStockTimeSeries('1mo', '1d')}
                >
                  1 Month
                </Button>
                <Button
                  variant="outline"
                  className="rounded-xl text-xsm hover:text-white hover:bg-zinc-400"
                  onClick={() => fetchStockTimeSeries('3mo', '1d')}
                >
                  3 Month
                </Button>
                <Button
                  variant="outline"
                  className="rounded-xl text-xsm hover:text-white hover:bg-zinc-400"
                  onClick={() => fetchStockTimeSeries('6mo', '1wk')}
                >
                  6 Month
                </Button>
                <Button
                  variant="outline"
                  className="rounded-xl text-xsm hover:text-white hover:bg-zinc-400"
                  onClick={() => fetchStockTimeSeries('1y', '1wk')}
                >
                  1 Year
                </Button>
                <Button
                  variant="outline"
                  className="rounded-xl text-xsm hover:text-white hover:bg-zinc-400"
                  onClick={() => fetchStockTimeSeries('5y', '1mo')}
                >
                  5 Year
                </Button>
              </div>
            </div>
            <div className="bg-zinc-200 px-2 pt-2 pb-9 rounded-lg mt-5 ">
              <div className="bg-white rounded-lg p-3 flex">
                <div className="grid grid-cols-3 gap-3 text-sm">
                  <div className="bg-zinc-200 rounded p-2">
                    <div className="flex justify-between items-center">
                      <p className="text-zinc-500">Market Cap</p>
                      <div className="justify-self-end">
                        <ToolTip explain="Market Cap — the total market value of all the company's shares combined (share price × shares outstanding). Used to classify companies as small, mid, or large cap."></ToolTip>
                      </div>
                    </div>
                    <p className="font-semibold">
                      ${(stockData.marketCap / 1e9).toFixed(2)}B
                    </p>
                  </div>
                  <div className="bg-zinc-200 rounded p-2">
                    <div className="flex justify-between items-center">
                      <p className="text-zinc-500">Volume</p>
                      <div className="justify-self-end">
                        <ToolTip explain="Volume — the number of shares traded today. High volume usually means strong investor interest or a major news event."></ToolTip>
                      </div>
                    </div>

                    <p className="font-semibold">
                      {stockData.volume?.toLocaleString()
                        ? stockData.volume?.toLocaleString()
                        : 'N/A'}
                    </p>
                  </div>
                  <div className="bg-zinc-200 rounded p-2">
                    <div className="flex justify-between items-center">
                      <p className="text-zinc-500">52W High</p>
                      <div className="justify-self-end">
                        <ToolTip explain="52W High — the highest price the stock has reached in the last 52 weeks. Often acts as a resistance level."></ToolTip>
                      </div>
                    </div>

                    <p className="font-semibold">
                      ${stockData.fiftyTwoWeekHigh?.toFixed(2)}
                    </p>
                  </div>
                  <div className="bg-zinc-200 rounded p-2">
                    <div className="flex justify-between items-center">
                      <p className="text-zinc-500">52W Low</p>
                      <div className="justify-self-end">
                        <ToolTip explain="52W Low — the lowest price the stock has reached in the last 52 weeks. Often acts as a support level."></ToolTip>
                      </div>
                    </div>

                    <p className="font-semibold">
                      ${stockData.fiftyTwoWeekLow?.toFixed(2)}
                    </p>
                  </div>
                  <div className="bg-zinc-200 rounded p-2">
                    <div className="flex justify-between items-center">
                      <p className="text-zinc-500">P/E Ratio</p>
                      <div className="justify-self-end">
                        <ToolTip explain="P/E Ratio — Price to Earnings. How much investors are paying for every $1 of profit. A high P/E means investors expect strong future growth; a low P/E may mean the stock is undervalued or struggling."></ToolTip>
                      </div>
                    </div>

                    <p className="font-semibold">
                      {stockData.trailingPE?.toFixed(2) ?? 'N/A'}
                    </p>
                  </div>
                  <div className="bg-zinc-200 rounded p-2">
                    <div className="flex justify-between items-center">
                      <p className="text-zinc-500">Dividend Yield</p>
                      <div className="justify-self-end">
                        <ToolTip explain="Dividend Yield — the annual dividend payment as a percentage of the current stock price. Tells you how much return you get just from dividends, without selling the stock."></ToolTip>
                      </div>
                    </div>

                    <p className="font-semibold">
                      {stockData.dividendYield
                        ? (stockData.dividendYield * 100).toFixed(2) + '%'
                        : 'N/A'}
                    </p>
                  </div>
                  <div className="bg-zinc-200 rounded p-2">
                    <div className="flex justify-between items-center">
                      <p className="text-zinc-500 uppercase">ebitda</p>
                      <div className="justify-self-end">
                        <ToolTip explain="EBITDA — Earnings Before Interest, Taxes, Depreciation, and Amortization. A measure of the company's core operational profitability, stripping out financing and accounting decisions."></ToolTip>
                      </div>
                    </div>

                    <p className="font-semibold">
                      {stockData.ebitda
                        ? (stockData.ebitda / 10e9).toFixed(4)
                        : 'N/A'}
                      B
                    </p>
                  </div>
                  <div className="bg-zinc-200 rounded p-2">
                    <div className="flex justify-between items-center">
                      <p className="text-zinc-500">Outstanding Shares</p>
                      <div className="justify-self-end">
                        <ToolTip explain="Shares Outstanding — the total number of shares the company has issued to all shareholders including institutions and insiders."></ToolTip>
                      </div>
                    </div>

                    <p className="font-semibold">
                      {stockData.sharesOutstanding
                        ? (stockData.sharesOutstanding / 10e9).toFixed(4)
                        : 'N/A'}
                      B
                    </p>
                  </div>
                  <div className="bg-zinc-200 rounded p-2">
                    <div className="flex justify-between items-center">
                      <p className="text-zinc-500">EPS</p>
                      <div className="justify-self-end">
                        <ToolTip explain="EPS — Earnings Per Share. The company's total profit divided by shares outstanding. Tells you how much profit is attributed to each share."></ToolTip>
                      </div>
                    </div>

                    <p className="font-semibold">x{stockData.trailingEps}</p>
                  </div>
                  <div className="bg-zinc-200 rounded p-2">
                    <div className="flex justify-between items-center">
                      <p className="text-zinc-500">Float Shares</p>
                      <div className="justify-self-end">
                        <ToolTip explain="Float Shares — the number of shares actually available for public trading, excluding shares held by insiders and institutions. A low float means the price can move dramatically on low volume."></ToolTip>
                      </div>
                    </div>

                    <p className="font-semibold">
                      {stockData.floatShares
                        ? (stockData.floatShares / 10e9).toFixed(4)
                        : 'N/A'}
                      B
                    </p>
                  </div>
                  <div className="bg-zinc-200 rounded p-2">
                    <div className="flex justify-between items-center">
                      <p className="text-zinc-500">Book Value</p>
                      <div className="justify-self-end">
                        <ToolTip explain="Book Value — the net asset value of the company per share (assets minus liabilities). If the stock trades below book value, it may be undervalued."></ToolTip>
                      </div>
                    </div>

                    <p className="font-semibold">
                      ${stockData.bookValue ? stockData.bookValue : 'N/A'}
                    </p>
                  </div>
                  <div className="bg-zinc-200 rounded p-2">
                    <div className="flex justify-between items-center">
                      <p className="text-zinc-500">Industry</p>
                      <div className="justify-self-end">
                        <ToolTip explain="Industry — the specific sector the company operates in (e.g. Consumer Electronics, Cloud Software). Useful for comparing the stock against its peers."></ToolTip>
                      </div>
                    </div>

                    <p className="font-semibold">
                      {stockData.industry ? stockData.industry : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex w-full justify-center my-5 px-5 ">
            <Tabs
              defaultValue="overview"
              className="w-full flex justify-center  "
            >
              <div className="flex w-full justify-center ">
                <TabsList className=" bg-zinc-300 text-sm w-full">
                  <TabsTrigger value="overview" className="">
                    Overview
                  </TabsTrigger>
                  <TabsTrigger value="analytics">Analytics</TabsTrigger>
                  <TabsTrigger value="reports">Reports</TabsTrigger>
                </TabsList>
              </div>
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
                      <div className="mb-2">
                        <p className="font-bold  uppercase text-zinc-500 mb-2">
                          Valuation
                        </p>
                        <div className=" grid grid-cols-3 gap-2">
                          <div className="bg-zinc-200 rounded p-2">
                            <div className="flex justify-between">
                              <p className="text-zinc-500">Forward P/E</p>
                              <div className="justify-self-end">
                                <ToolTip explain="Forward P/E — like the regular P/E but uses projected future earnings instead of past ones. A lower Forward P/E than Trailing P/E suggests the market expects earnings to grow."></ToolTip>
                              </div>
                            </div>
                            <p className="font-semibold">
                              {stockData.forwardPE?.toFixed(2) ?? 'N/A'}
                            </p>
                          </div>
                          <div className="bg-zinc-200 rounded p-2">
                            <div className="flex justify-between">
                              <p className="text-zinc-500">Price to Book</p>
                              <div className="justify-self-end">
                                <ToolTip explain="Price to Book — compares the stock's market price to its book value per share. A ratio below 1 means the stock is trading for less than the company's net assets — potentially undervalued."></ToolTip>
                              </div>
                            </div>
                            <p className="font-semibold">
                              {stockData.priceToBook?.toFixed(2) ?? 'N/A'}
                            </p>
                          </div>
                          <div className="bg-zinc-200 rounded p-2">
                            <div className="flex justify-between">
                              <p className="text-zinc-500">EV/EBITDA</p>
                              <div className="justify-self-end">
                                <ToolTip explain="EV/EBITDA — compares the company's total value (including debt) to its operating earnings. Used to compare companies across different capital structures. Lower is generally cheaper."></ToolTip>
                              </div>
                            </div>
                            <p className="font-semibold">
                              {stockData.enterpriseToEbitda?.toFixed(2) ??
                                'N/A'}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="mb-2">
                        <p className="font-bold  uppercase text-zinc-500 mb-2">
                          Profitability
                        </p>
                        <div className=" grid grid-cols-3 gap-2">
                          <div className="bg-zinc-200 rounded p-2">
                            <div className="flex justify-between">
                              <p className="text-zinc-500">Profit Margin</p>
                              <div className="justify-self-end">
                                <ToolTip explain="Profit Margin — the percentage of revenue that actually becomes profit after all expenses. A 20% margin means the company keeps $0.20 for every $1 of sales."></ToolTip>
                              </div>
                            </div>
                            <p className="font-semibold">
                              {stockData.profitMargins
                                ? (stockData.profitMargins * 100).toFixed(2) +
                                  '%'
                                : 'N/A'}
                            </p>
                          </div>
                          <div className="bg-zinc-200 rounded p-2">
                            <div className="flex justify-between">
                              <p className="text-zinc-500">Return on Equity</p>
                              <div className="justify-self-end">
                                <ToolTip explain="Return on Equity — how efficiently the company generates profit from shareholders' money. A higher ROE means management is doing a better job with the capital invested."></ToolTip>
                              </div>
                            </div>
                            <p className="font-semibold">
                              {stockData.returnOnEquity
                                ? (stockData.returnOnEquity * 100).toFixed(2) +
                                  '%'
                                : 'N/A'}
                            </p>
                          </div>
                          <div className="bg-zinc-200 rounded p-2">
                            <div className="flex justify-between">
                              <p className="text-zinc-500">Gross Margin</p>
                              <div className="justify-self-end">
                                <ToolTip explain="Gross Margin — the percentage of revenue left after subtracting the direct cost of making the product. Higher gross margin means more money available to cover operating expenses and profit."></ToolTip>
                              </div>
                            </div>
                            <p className="font-semibold">
                              {stockData.grossMargins
                                ? (stockData.grossMargins * 100).toFixed(2) +
                                  '%'
                                : 'N/A'}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="mb-2">
                        <p className="font-bold  uppercase text-zinc-500 mb-2">
                          Risk
                        </p>
                        <div className=" grid grid-cols-3 gap-2">
                          <div className="bg-zinc-200 rounded p-2">
                            <div className="flex justify-between">
                              <p className="text-zinc-500">Beta</p>
                              <div className="justify-self-end">
                                <ToolTip explain="Beta — measures how volatile the stock is relative to the market. Beta > 1 means more volatile than the market, Beta < 1 means more stable. A Beta of 1.5 means the stock moves 50% more than the market in either direction."></ToolTip>
                              </div>
                            </div>
                            <p className="font-semibold">
                              {stockData.beta?.toFixed(2) ?? 'N/A'}
                            </p>
                          </div>
                          <div className="bg-zinc-200 rounded p-2">
                            <div className="flex justify-between">
                              <p className="text-zinc-500">Short Ratio</p>
                              <div className="justify-self-end">
                                <ToolTip explain="Short Ratio — the number of days it would take short sellers to cover their positions based on average daily volume. A high short ratio can signal either high bearish sentiment or a potential short squeeze."></ToolTip>
                              </div>
                            </div>
                            <p className="font-semibold">
                              {stockData.shortRatio?.toFixed(2) ?? 'N/A'}
                            </p>
                          </div>
                          <div className="bg-zinc-200 rounded p-2">
                            <div className="flex justify-between">
                              <p className="text-zinc-500">Short % of Float</p>
                              <div className="justify-self-end">
                                <ToolTip explain="Short % of Float — the percentage of available shares that are currently being shorted. Above 20% is considered heavily shorted and may indicate the market is bearish on the stock."></ToolTip>
                              </div>
                            </div>
                            <p className="font-semibold">
                              {stockData.shortPercentOfFloat
                                ? (stockData.shortPercentOfFloat * 100).toFixed(
                                    2,
                                  ) + '%'
                                : 'N/A'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardDescription>
                  </CardHeader>
                </Card>
              </TabsContent>
              <TabsContent value="reports">
                <Card>
                  <CardHeader>
                    <CardTitle>Reports</CardTitle>
                    <CardDescription>
                      Generate and download your detailed reports. Export data
                      in multiple formats for analysis.
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
      )}

      {isMobile && (
        <>
          <div className=" px-12 mt-15">
            <p className="font-excon text-md">
              {stockData.fullExchangeName} - {stockData.exchange} -{' '}
              {stockData.currency}
            </p>
          </div>
          <div className=" px-12   gap-5 mb-5">
            <div className="flex items-center gap-2">
              <p className="font-excon font-bold text-3xl">
                {stockData.longName} ({stockData.symbol}){' '}
              </p>
              <p
                className={` ${isPositive ? 'text-green-700' : 'text-red-700'} font-bold`}
              >
                {' '}
                {isPositive ? (
                  <TrendingUp size={30}></TrendingUp>
                ) : (
                  <TrendingDown size={30} />
                )}
              </p>
            </div>
            <div className="flex gap-3 items-center">
              <p
                className={`font-bold text-xl ${isPositive ? 'text-green-700' : 'text-red-700'}  `}
              >
                {' '}
                ${stockData.currentPrice}
              </p>
              <p
                className={`${isPositive ? 'text-green-700' : 'text-red-700'} `}
              >
                {priceChangePct}%
              </p>
            </div>
          </div>

          <div className=" px-10 gap-5 grid  grid-cols-2">
            <div className="bg-zinc-200 px-2 pt-2 pb-9 rounded-lg">
              <div className="bg-white rounded-lg p-3 flex ">
                <div className="w-full">
                  <div className="flex justify-between items-center  ">
                    <p className="font-bold uppercase text-zinc-500 flex gap-2  ">
                      Total Revenue{' '}
                    </p>
                    <div>
                      <ToolTip explain="Total Revenue — the total amount of money the company earned from selling its products or services over the last 12 months, before any expenses are deducted."></ToolTip>
                    </div>
                  </div>
                  <p className="font-bold">
                    ${(stockData.totalRevenue / 1e9).toFixed(2)}B
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-zinc-200 px-2 pt-2 pb-9 rounded-lg">
              <div className="bg-white rounded-lg p-3 flex">
                <div className="w-full">
                  <div className="flex justify-between items-center">
                    <p className="font-bold uppercase text-zinc-500 flex gap-2 ">
                      Total Debt{' '}
                    </p>
                    <div>
                      <ToolTip
                        explain="Total Debt — the total amount of money the company owes to lenders, including both short-term and long-term loans and bonds.
"
                      ></ToolTip>
                    </div>
                  </div>
                  <p className="font-bold">
                    ${(stockData.totalDebt / 1e9).toFixed(2)}B
                  </p>
                </div>

                <div></div>
              </div>
            </div>
            <div className="bg-zinc-200 px-2 pt-2 pb-9 rounded-lg">
              <div className="bg-white rounded-lg p-3 pb-7 flex">
                <div className="w-full">
                  <div className="flex justify-between items-center">
                    <p className="font-bold uppercase text-zinc-500 flex gap-2">
                      Total Ask{' '}
                    </p>
                    <div className="">
                      <ToolTip
                        explain="Ask — the lowest price a seller is currently willing to accept for one share of the stock.
"
                      ></ToolTip>
                    </div>
                  </div>
                  <p className="font-bold">${stockData.ask}M</p>
                </div>

                <div></div>
              </div>
            </div>
            <div className="bg-zinc-200 px-2 pt-2 pb-9 rounded-lg">
              <div className="bg-white rounded-lg p-3 flex">
                <div className="w-full">
                  <div className="flex justify-between items-center">
                    <p className="font-bold uppercase text-zinc-500 flex gap-2">
                      Total Bid{' '}
                      {
                        <div>
                          <ToolTip explain="Bid — the highest price a buyer is currently willing to pay for one share of the stock."></ToolTip>
                        </div>
                      }
                    </p>
                  </div>

                  <p className="font-bold">${stockData.bid}M</p>
                </div>

                <div></div>
              </div>
            </div>
          </div>
          <div className=" mx-9 gap-2">
            <div className="bg-zinc-200  px-2 pt-2 pb-9 rounded-lg mt-5  ">
              <div className="bg-white rounded-lg pt-3 pr-2 flex">
                <Chart timeseries={timeseries}></Chart>
              </div>

              <div className="mx-5 mt-3 flex justify-end gap-1 grid grid-cols-4">
                <Button
                  variant="outline"
                  className="rounded-xl text-xsm hover:text-white hover:bg-zinc-400"
                  onClick={() => fetchStockTimeSeries('1d', '1m')}
                >
                  1 Day
                </Button>
                <Button
                  variant="outline"
                  className="rounded-xl text-xsm hover:text-white hover:bg-zinc-400"
                  onClick={() => fetchStockTimeSeries('5d', '5m')}
                >
                  1 Week
                </Button>
                <Button
                  variant="outline"
                  className="rounded-xl text-xsm hover:text-white hover:bg-zinc-400"
                  onClick={() => fetchStockTimeSeries('1mo', '1d')}
                >
                  1 Month
                </Button>
                <Button
                  variant="outline"
                  className="rounded-xl text-xsm hover:text-white hover:bg-zinc-400"
                  onClick={() => fetchStockTimeSeries('3mo', '1d')}
                >
                  3 Month
                </Button>
                <Button
                  variant="outline"
                  className="rounded-xl text-xsm hover:text-white hover:bg-zinc-400"
                  onClick={() => fetchStockTimeSeries('6mo', '1wk')}
                >
                  6 Month
                </Button>
                <Button
                  variant="outline"
                  className="rounded-xl text-xsm hover:text-white hover:bg-zinc-400"
                  onClick={() => fetchStockTimeSeries('1y', '1wk')}
                >
                  1 Year
                </Button>
                <Button
                  variant="outline"
                  className="rounded-xl text-xsm hover:text-white hover:bg-zinc-400"
                  onClick={() => fetchStockTimeSeries('5y', '1mo')}
                >
                  5 Year
                </Button>
              </div>
            </div>
            <div className="bg-zinc-200 px-2 pt-2 pb-9 rounded-lg mt-5 ">
              <div className="bg-white rounded-lg p-3 flex">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-zinc-200 rounded p-2">
                    <div className="flex justify-between items-center">
                      <p className="text-zinc-500">Market Cap</p>
                      <div className="justify-self-end">
                        <ToolTip explain="Market Cap — the total market value of all the company's shares combined (share price × shares outstanding). Used to classify companies as small, mid, or large cap."></ToolTip>
                      </div>
                    </div>
                    <p className="font-semibold">
                      ${(stockData.marketCap / 1e9).toFixed(2)}B
                    </p>
                  </div>
                  <div className="bg-zinc-200 rounded p-2">
                    <div className="flex justify-between items-center">
                      <p className="text-zinc-500">Volume</p>
                      <div className="justify-self-end">
                        <ToolTip explain="Volume — the number of shares traded today. High volume usually means strong investor interest or a major news event."></ToolTip>
                      </div>
                    </div>

                    <p className="font-semibold">
                      {stockData.volume
                        ? stockData.volume?.toLocaleString()
                        : 'N/A'}
                    </p>
                  </div>
                  <div className="bg-zinc-200 rounded p-2">
                    <div className="flex justify-between items-center">
                      <p className="text-zinc-500">52W High</p>
                      <div className="justify-self-end">
                        <ToolTip explain="52W High — the highest price the stock has reached in the last 52 weeks. Often acts as a resistance level."></ToolTip>
                      </div>
                    </div>

                    <p className="font-semibold">
                      ${stockData.fiftyTwoWeekHigh?.toFixed(2)}
                    </p>
                  </div>
                  <div className="bg-zinc-200 rounded p-2">
                    <div className="flex justify-between items-center">
                      <p className="text-zinc-500">52W Low</p>
                      <div className="justify-self-end">
                        <ToolTip explain="52W Low — the lowest price the stock has reached in the last 52 weeks. Often acts as a support level."></ToolTip>
                      </div>
                    </div>

                    <p className="font-semibold">
                      ${stockData.fiftyTwoWeekLow?.toFixed(2)}
                    </p>
                  </div>
                  <div className="bg-zinc-200 rounded p-2">
                    <div className="flex justify-between items-center">
                      <p className="text-zinc-500">P/E Ratio</p>
                      <div className="justify-self-end">
                        <ToolTip explain="P/E Ratio — Price to Earnings. How much investors are paying for every $1 of profit. A high P/E means investors expect strong future growth; a low P/E may mean the stock is undervalued or struggling."></ToolTip>
                      </div>
                    </div>

                    <p className="font-semibold">
                      {stockData.trailingPE?.toFixed(2) ?? 'N/A'}
                    </p>
                  </div>
                  <div className="bg-zinc-200 rounded p-2">
                    <div className="flex justify-between items-center">
                      <p className="text-zinc-500">Dividend Yield</p>
                      <div className="justify-self-end">
                        <ToolTip explain="Dividend Yield — the annual dividend payment as a percentage of the current stock price. Tells you how much return you get just from dividends, without selling the stock."></ToolTip>
                      </div>
                    </div>

                    <p className="font-semibold">
                      {stockData.dividendYield
                        ? (stockData.dividendYield * 100).toFixed(2) + '%'
                        : 'N/A'}
                    </p>
                  </div>
                  <div className="bg-zinc-200 rounded p-2">
                    <div className="flex justify-between items-center">
                      <p className="text-zinc-500 uppercase">ebitda</p>
                      <div className="justify-self-end">
                        <ToolTip explain="EBITDA — Earnings Before Interest, Taxes, Depreciation, and Amortization. A measure of the company's core operational profitability, stripping out financing and accounting decisions."></ToolTip>
                      </div>
                    </div>

                    <p className="font-semibold">
                      {stockData.ebitda
                        ? (stockData.ebitda / 10e9).toFixed(4)
                        : 'N/A'}
                      B
                    </p>
                  </div>
                  <div className="bg-zinc-200 rounded p-2">
                    <div className="flex justify-between items-center">
                      <p className="text-zinc-500">Outstanding Shares</p>
                      <div className="justify-self-end">
                        <ToolTip explain="Shares Outstanding — the total number of shares the company has issued to all shareholders including institutions and insiders."></ToolTip>
                      </div>
                    </div>

                    <p className="font-semibold">
                      {stockData.sharesOutstanding
                        ? (stockData.sharesOutstanding / 10e9).toFixed(4)
                        : 'N/A'}
                      B
                    </p>
                  </div>
                  <div className="bg-zinc-200 rounded p-2">
                    <div className="flex justify-between items-center">
                      <p className="text-zinc-500">EPS</p>
                      <div className="justify-self-end">
                        <ToolTip explain="EPS — Earnings Per Share. The company's total profit divided by shares outstanding. Tells you how much profit is attributed to each share."></ToolTip>
                      </div>
                    </div>

                    <p className="font-semibold">x{stockData.trailingEps}</p>
                  </div>
                  <div className="bg-zinc-200 rounded p-2">
                    <div className="flex justify-between items-center">
                      <p className="text-zinc-500">Float Shares</p>
                      <div className="justify-self-end">
                        <ToolTip explain="Float Shares — the number of shares actually available for public trading, excluding shares held by insiders and institutions. A low float means the price can move dramatically on low volume."></ToolTip>
                      </div>
                    </div>

                    <p className="font-semibold">
                      {stockData.floatShares
                        ? (stockData.floatShares / 10e9).toFixed(4)
                        : 'N/A'}
                      B
                    </p>
                  </div>
                  <div className="bg-zinc-200 rounded p-2">
                    <div className="flex justify-between items-center">
                      <p className="text-zinc-500">Book Value</p>
                      <div className="justify-self-end">
                        <ToolTip explain="Book Value — the net asset value of the company per share (assets minus liabilities). If the stock trades below book value, it may be undervalued."></ToolTip>
                      </div>
                    </div>

                    <p className="font-semibold">
                      ${stockData.bookValue ? stockData.bookValue : 'N/A'}
                    </p>
                  </div>
                  <div className="bg-zinc-200 rounded p-2">
                    <div className="flex justify-between items-center">
                      <p className="text-zinc-500">Industry</p>
                      <div className="justify-self-end">
                        <ToolTip explain="Industry — the specific sector the company operates in (e.g. Consumer Electronics, Cloud Software). Useful for comparing the stock against its peers."></ToolTip>
                      </div>
                    </div>

                    <p className="font-semibold">
                      {stockData.industry ? stockData.industry : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex w-full justify-center my-5 px-5 ">
            <Tabs
              defaultValue="overview"
              className="w-full flex justify-center "
            >
              <div className="flex w-full justify-center">
                <TabsList className=" w-2/3 bg-zinc-300 text-md ">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="analytics">Analytics</TabsTrigger>
                  <TabsTrigger value="reports">Reports</TabsTrigger>
                </TabsList>
              </div>
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
                      <div className="mb-2">
                        <p className="font-bold  uppercase text-zinc-500 mb-2">
                          Valuation
                        </p>
                        <div className=" grid grid-cols-3 gap-2">
                          <div className="bg-zinc-200 rounded p-2">
                            <div className="flex justify-between">
                              <p className="text-zinc-500">Forward P/E</p>
                              <div className="justify-self-end">
                                <ToolTip explain="Forward P/E — like the regular P/E but uses projected future earnings instead of past ones. A lower Forward P/E than Trailing P/E suggests the market expects earnings to grow."></ToolTip>
                              </div>
                            </div>
                            <p className="font-semibold">
                              {stockData.forwardPE?.toFixed(2) ?? 'N/A'}
                            </p>
                          </div>
                          <div className="bg-zinc-200 rounded p-2">
                            <div className="flex justify-between">
                              <p className="text-zinc-500">Price to Book</p>
                              <div className="justify-self-end">
                                <ToolTip explain="Price to Book — compares the stock's market price to its book value per share. A ratio below 1 means the stock is trading for less than the company's net assets — potentially undervalued."></ToolTip>
                              </div>
                            </div>
                            <p className="font-semibold">
                              {stockData.priceToBook?.toFixed(2) ?? 'N/A'}
                            </p>
                          </div>
                          <div className="bg-zinc-200 rounded p-2">
                            <div className="flex justify-between">
                              <p className="text-zinc-500">EV/EBITDA</p>
                              <div className="justify-self-end">
                                <ToolTip explain="EV/EBITDA — compares the company's total value (including debt) to its operating earnings. Used to compare companies across different capital structures. Lower is generally cheaper."></ToolTip>
                              </div>
                            </div>
                            <p className="font-semibold">
                              {stockData.enterpriseToEbitda?.toFixed(2) ??
                                'N/A'}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="mb-2">
                        <p className="font-bold  uppercase text-zinc-500 mb-2">
                          Profitability
                        </p>
                        <div className=" grid grid-cols-3 gap-2">
                          <div className="bg-zinc-200 rounded p-2">
                            <div className="flex justify-between">
                              <p className="text-zinc-500">Profit Margin</p>
                              <div className="justify-self-end">
                                <ToolTip explain="Profit Margin — the percentage of revenue that actually becomes profit after all expenses. A 20% margin means the company keeps $0.20 for every $1 of sales."></ToolTip>
                              </div>
                            </div>
                            <p className="font-semibold">
                              {stockData.profitMargins
                                ? (stockData.profitMargins * 100).toFixed(2) +
                                  '%'
                                : 'N/A'}
                            </p>
                          </div>
                          <div className="bg-zinc-200 rounded p-2">
                            <div className="flex justify-between">
                              <p className="text-zinc-500">Return on Equity</p>
                              <div className="justify-self-end">
                                <ToolTip explain="Return on Equity — how efficiently the company generates profit from shareholders' money. A higher ROE means management is doing a better job with the capital invested."></ToolTip>
                              </div>
                            </div>
                            <p className="font-semibold">
                              {stockData.returnOnEquity
                                ? (stockData.returnOnEquity * 100).toFixed(2) +
                                  '%'
                                : 'N/A'}
                            </p>
                          </div>
                          <div className="bg-zinc-200 rounded p-2">
                            <div className="flex justify-between">
                              <p className="text-zinc-500">Gross Margin</p>
                              <div className="justify-self-end">
                                <ToolTip explain="Gross Margin — the percentage of revenue left after subtracting the direct cost of making the product. Higher gross margin means more money available to cover operating expenses and profit."></ToolTip>
                              </div>
                            </div>
                            <p className="font-semibold">
                              {stockData.grossMargins
                                ? (stockData.grossMargins * 100).toFixed(2) +
                                  '%'
                                : 'N/A'}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="mb-2">
                        <p className="font-bold  uppercase text-zinc-500 mb-2">
                          Risk
                        </p>
                        <div className=" grid grid-cols-3 gap-2">
                          <div className="bg-zinc-200 rounded p-2">
                            <div className="flex justify-between">
                              <p className="text-zinc-500">Beta</p>
                              <div className="justify-self-end">
                                <ToolTip explain="Beta — measures how volatile the stock is relative to the market. Beta > 1 means more volatile than the market, Beta < 1 means more stable. A Beta of 1.5 means the stock moves 50% more than the market in either direction."></ToolTip>
                              </div>
                            </div>
                            <p className="font-semibold">
                              {stockData.beta?.toFixed(2) ?? 'N/A'}
                            </p>
                          </div>
                          <div className="bg-zinc-200 rounded p-2">
                            <div className="flex justify-between">
                              <p className="text-zinc-500">Short Ratio</p>
                              <div className="justify-self-end">
                                <ToolTip explain="Short Ratio — the number of days it would take short sellers to cover their positions based on average daily volume. A high short ratio can signal either high bearish sentiment or a potential short squeeze."></ToolTip>
                              </div>
                            </div>
                            <p className="font-semibold">
                              {stockData.shortRatio?.toFixed(2) ?? 'N/A'}
                            </p>
                          </div>
                          <div className="bg-zinc-200 rounded p-2">
                            <div className="flex justify-between">
                              <p className="text-zinc-500">Short % of Float</p>
                              <div className="justify-self-end">
                                <ToolTip explain="Short % of Float — the percentage of available shares that are currently being shorted. Above 20% is considered heavily shorted and may indicate the market is bearish on the stock."></ToolTip>
                              </div>
                            </div>
                            <p className="font-semibold">
                              {stockData.shortPercentOfFloat
                                ? (stockData.shortPercentOfFloat * 100).toFixed(
                                    2,
                                  ) + '%'
                                : 'N/A'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardDescription>
                  </CardHeader>
                </Card>
              </TabsContent>
              <TabsContent value="reports">
                <Card>
                  <CardHeader>
                    <CardTitle>Reports</CardTitle>
                    <CardDescription>
                      Generate and download your detailed reports. Export data
                      in multiple formats for analysis.
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
      )}
    </>
  );
}

export default TickerPage;
