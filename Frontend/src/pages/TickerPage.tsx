import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, EyeClosed, Eye } from 'lucide-react';
import AlertModal from '../components/AlertModal';

import {
  ChartNoAxesColumn,
  ChartPie,
  ChartCandlestick,
  ChartScatter,
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
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';


function TickerPage() {
  const { stockTicker } = useParams();
  const [stockData, setStockData] = useState<any>({});
  const [timeseries, setTimeSeries] = useState<Record<string, any>>({});
  const timeseriesEntries = Object.entries(timeseries);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [isLogged, setIsLogged] = useState(false);
  const [loading, setLoading] = useState(true);

  const startPrice =
    timeseriesEntries.length > 0 ? timeseriesEntries[0][1].Close : null;
  const isMobile = useIsMobile();

  const priceChange = startPrice ? stockData.currentPrice - startPrice : null;
  const priceChangePct =
    priceChange && startPrice
      ? ((priceChange / startPrice) * 100).toFixed(2)
      : null;
  const isPositive = priceChange ? priceChange >= 0 : true;

  const fetchStockTimeSeries = async (period: string, interval: string) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/timeseries/${stockTicker?.toUpperCase()}?period=${period}&interval=${interval}`,
        { credentials: 'include' }
      );
      const data = await response.json();
      setTimeSeries(data);
    } catch (error) {
      console.error('Error fetching stock data:', error);
    } finally {
      setLoading(false);
    }
  };


  const handleClick = async () => {
    if (!isLogged) {
      toast.error("Please sign in to use the watchlist.");
      return;
    }
    const method = isInWatchlist ? 'DELETE' : 'POST';
    const url = isInWatchlist
      ? `${import.meta.env.VITE_API_BASE_URL}/api/watchlist/remove/${stockTicker}`
      : `${import.meta.env.VITE_API_BASE_URL}/api/watchlist/add?symbol=${stockTicker}`;

    try {
      const res = await fetch(url, {
        method,
        credentials: 'include'
      });
      const data = await res.json();
      if (data.success) {
        setIsInWatchlist(!isInWatchlist);
        toast.success(isInWatchlist ? `${stockTicker?.toUpperCase()} removed from watchlist, room for other opportunities` : `${stockTicker?.toUpperCase()} added to watchlist, wow your porfolio is growing!`);

      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSetAlert = async (symbol: string, targetPrice: number, condition: string) => {
    if (!isLogged) {
      alert("Please sign in to set alerts.");
      return;
    }
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/alerts/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          symbol,
          target_price: targetPrice,
          condition
        }),
        credentials: 'include'
      });
      const data = await response.json();
      if (data.success) {
        toast.success(`Alert set for ${symbol} at $${targetPrice}`);
      }
    } catch (e) {
      toast.error("Failed to set alert:");
    }
  };

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/stock/${stockTicker?.toUpperCase()}`, { credentials: 'include' });
        const data = await response.json();
        setStockData(data);
        await fetchStockTimeSeries('1mo', '1d');
      } catch (error) {
        console.error('Error fetching stock data:', error);
      }
    };

    const checkStatus = async () => {
      try {
        const authRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/me.php`, {
            credentials: 'include'
        });
        const authData = await authRes.json();
        setIsLogged(authData.success);

        if (authData.success) {
          const watchRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/watchlist`, {
            credentials: 'include'
          });
          const watchlist = await watchRes.json();
          if (Array.isArray(watchlist)) {
            setIsInWatchlist(watchlist.includes(stockTicker?.toUpperCase() || ""));
          }
        }
      } catch (e) {
        console.error(e);
      }
    };

    fetchStockData();
    checkStatus();
  }, [stockTicker]);


  const PageSkeleton = () => (
    <><div className="px-10 mt-25 space-y-6 mb-5">
      {/* Header */}
      <Skeleton className="h-4 mx-5 w-48 bg-zinc-300 rounded-lg" />
      <div className="flex px-5 items-center gap-2 ">
        <Skeleton className="h-9 w-72 bg-zinc-300 rounded-lg" />
        <Skeleton className="h-9 w-9 rounded-lg bg-zinc-300" />
        <Skeleton className="h-9 w-9 rounded-lg bg-zinc-300" />
      </div>
      <div className="flex gap-3 px-5 ">
        <Skeleton className="h-6 w-20 bg-zinc-300 rounded-lg" />
        <Skeleton className="h-6 w-16 bg-zinc-300 rounded-lg" />
      </div>

      <div className="grid grid-cols-4 gap-5 ">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-zinc-200 px-2 pt-2 pb-9 rounded-lg">
            <div className="bg-white rounded-lg p-3 space-y-2">
              <Skeleton className="h-4 w-24 bg-zinc-300 rounded-lg" />
              <Skeleton className="h-5 w-16 bg-zinc-300 rounded-lg" />
            </div>

          </div>
        ))}
      </div>

      {/* Chart + stats panel */}
      <div className="grid grid-cols-3  gap-2 ">
        <Skeleton className="col-span-2 bg-zinc-200 px-2 pt-2 pb-9 rounded-lg bg-zinc-300 rounded-lg">
          <div className='flex flex-col'>

            <div className="bg-white rounded-lg p-3">
              <Skeleton className="h-64 w-full bg-zinc-300 rounded-lg" />
            </div>
            <div className='flex justify-end w-full'>

              <div className='flex gap-2 mt-3 w-1/2  '>

                <Skeleton className="h-5 w-full bg-zinc-100 rounded-lg p-3" />
                <Skeleton className="h-5 w-full bg-zinc-100 rounded-lg p-3" />
                <Skeleton className="h-5 w-full bg-zinc-100 rounded-lg p-3" />
                <Skeleton className="h-5 w-full bg-zinc-100 rounded-lg p-3" />
                <Skeleton className="h-5 w-full bg-zinc-100 rounded-lg p-3" />
                <Skeleton className="h-5 w-full bg-zinc-100 rounded-lg p-3" />
                <Skeleton className="h-5 w-full bg-zinc-100 rounded-lg p-3" />

              </div>
            </div>


          </div>

        </Skeleton>

        <Skeleton className=" bg-zinc-300 px-2 pt-2 pb-9 rounded-lg">
          <div className=" bg-white rounded-lg p-3">
            <div className="grid grid-cols-3 gap-3">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="bg-zinc-200 rounded-lg p-2 space-y-1">
                  <Skeleton className="h-5 w-14 bg-zinc-300 rounded-lg" />
                  <Skeleton className="h-5 w-10 bg-zinc-300 rounded-lg" />
                </div>
              ))}
            </div>
          </div>
        </Skeleton>
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
              <CardHeader className=" gap-2">
                <Skeleton className="h-5 w-40 bg-zinc-300 rounded-lg" />
                <Skeleton className="h-5 bg-zinc-300 rounded-lg" />
                <Skeleton className="h-5  w-3/4  bg-zinc-300 rounded-lg" />
                <Skeleton className="h-5  bg-zinc-300 rounded-lg" />
                <Skeleton className="h-5  w-2/3  bg-zinc-300 rounded-lg" />
              </CardHeader>
            </Card>
          </TabsContent>
          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <Skeleton className="h-5 w-40 bg-zinc-300 rounded-lg" />
                <CardDescription>
                  <div className="mb-2">
                    <p className="font-bold  uppercase text-zinc-500 mb-2">
                      <Skeleton className="h-5 w-24 bg-zinc-300 rounded-lg" />

                    </p>
                    <div className=" grid grid-cols-3 gap-2">
                      <Skeleton className="bg-zinc-300 rounded p-2">
                        <div className="flex justify-between">
                          <p className="text-zinc-500"></p>
                          <div className="justify-self-end">
                          </div>
                        </div>
                        <p className="font-semibold">
                        </p>
                      </Skeleton>
                      <Skeleton className="bg-zinc-300 rounded p-2">
                        <div className="flex justify-between">
                          <p className="text-zinc-500"></p>
                          <div className="justify-self-end">
                          </div>
                        </div>
                        <p className="font-semibold">
                        </p>
                      </Skeleton>
                      <Skeleton className="h-18 bg-zinc-300 rounded p-2">
                        <div className="flex justify-between">
                          <p className="text-zinc-500"></p>
                          <div className="justify-self-end">
                          </div>
                        </div>
                        <p className="font-semibold">
                        </p>
                      </Skeleton>
                    </div>
                  </div>
                  <div className="mb-2">
                    <p className="font-bold  uppercase text-zinc-500 mb-2">
                      <Skeleton className="h-5 w-24 bg-zinc-300 rounded-lg" />

                    </p>
                    <div className=" grid grid-cols-3 gap-2">
                      <Skeleton className="bg-zinc-300 rounded p-2">
                        <div className="flex justify-between">
                          <p className="text-zinc-500"></p>
                          <div className="justify-self-end">
                          </div>
                        </div>
                        <p className="font-semibold">
                        </p>
                      </Skeleton>
                      <Skeleton className="bg-zinc-300 rounded p-2">
                        <div className="flex justify-between">
                          <p className="text-zinc-500"></p>
                          <div className="justify-self-end">
                          </div>
                        </div>
                        <p className="font-semibold">
                        </p>
                      </Skeleton>
                      <Skeleton className="h-18 bg-zinc-300 rounded p-2">
                        <div className="flex justify-between">
                          <p className="text-zinc-500"></p>
                          <div className="justify-self-end">
                          </div>
                        </div>
                        <p className="font-semibold">
                        </p>
                      </Skeleton>
                    </div>
                  </div>
                  <div className="mb-2">
                    <p className="font-bold  uppercase text-zinc-500 mb-2">
                      <Skeleton className="h-5 w-24 bg-zinc-300 rounded-lg" />

                    </p>
                    <div className=" grid grid-cols-3 gap-2">
                      <Skeleton className="bg-zinc-300 rounded p-2">
                        <div className="flex justify-between">
                          <p className="text-zinc-500"></p>
                          <div className="justify-self-end">
                          </div>
                        </div>
                        <p className="font-semibold">
                        </p>
                      </Skeleton>
                      <Skeleton className="bg-zinc-300 rounded p-2">
                        <div className="flex justify-between">
                          <p className="text-zinc-500"></p>
                          <div className="justify-self-end">
                          </div>
                        </div>
                        <p className="font-semibold">
                        </p>
                      </Skeleton>
                      <Skeleton className="h-18 bg-zinc-300 rounded p-2">
                        <div className="flex justify-between">
                          <p className="text-zinc-500"></p>
                          <div className="justify-self-end">
                          </div>
                        </div>
                        <p className="font-semibold">
                        </p>
                      </Skeleton>
                    </div>
                  </div>
                  
                </CardDescription>
              </CardHeader>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <Footer></Footer>
      </>
  );

  return (
    <>
      {!isMobile && (
        loading ? <PageSkeleton /> : (
          <>
            <div className=" px-15 mt-25">
              <p className="font-excon text-md">
                {stockData.fullExchangeName} . {stockData.exchange} . {' '}
                {stockData.currency}
              </p>
            </div>
            <div className=" px-15   gap-5 mb-5">
              <div className="flex items-center gap-2">
                <p className="font-excon font-bold text-3xl">
                  {stockData.longName} ({stockData.symbol}){' '}
                </p>
                <>
                  {isInWatchlist &&
                    <div className='p-2 bg-black text-white rounded-lg cursor-pointer' onClick={handleClick}>
                      <Eye size={20} />
                    </div>
                  }

                </>

                <>
                  {
                    !isInWatchlist &&
                    <div className='p-2 bg-black text-white rounded-lg cursor-pointer' onClick={handleClick}>
                      <EyeClosed size={20} />
                    </div>
                  }
                </>
                <AlertModal
                  symbol={stockTicker || ""}
                  currentPrice={stockData.currentPrice}
                  onAlertSet={handleSetAlert}
                />

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
                      <div className="font-bold uppercase text-zinc-500 flex gap-2  ">
                        Total Revenue {<ChartNoAxesColumn size={20} />}
                      </div>
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
                      <div className="font-bold uppercase text-zinc-500 flex gap-2 ">
                        Total Debt {<ChartPie size={20} />}
                      </div>
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
                      <div className="font-bold uppercase text-zinc-500  flex gap-2">
                        Total Ask {<ChartCandlestick size={20} />}
                      </div>
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
                      <div className="font-bold uppercase text-zinc-500 flex gap-2">
                        Total Bid {<ChartScatter size={20} />}
                      </div>
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
              </Tabs>
            </div>
            <Footer></Footer>
          </>
        ))}

      {isMobile && (loading ? <PageSkeleton /> : (
        <>
          <div className=" px-12 mt-15">
            <p className="font-excon text-md">
              {stockData.fullExchangeName} - {stockData.exchange} -{' '}
              {stockData.currency}
            </p>
          </div>
          <div className=" px-12   gap-5 mb-5">
            <div className="flex items-end gap-1">
              <p className="font-excon font-bold text-3xl">
                {stockData.longName} ({stockData.symbol}){' '}
              </p>
              <>
                {isInWatchlist &&
                  <div className='p-2 bg-black text-white rounded-lg cursor-pointer' onClick={handleClick}>
                    <Eye size={20} />
                  </div>
                }

              </>

              <>
                {
                  !isInWatchlist &&
                  <div className='p-2 bg-black text-white rounded-lg cursor-pointer' onClick={handleClick}>
                    <EyeClosed size={20} />
                  </div>
                }
              </>

              <AlertModal
                symbol={stockTicker || ""}
                currentPrice={stockData.currentPrice}
                onAlertSet={handleSetAlert}
              />
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
                    <div className="font-bold uppercase text-zinc-500 flex gap-2">
                      Total Bid{' '}
                      {
                        <div>
                          <ToolTip explain="Bid — the highest price a buyer is currently willing to pay for one share of the stock."></ToolTip>
                        </div>
                      }
                    </div>
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
                      <div className="mb-2">
                        <p className="font-bold  uppercase text-zinc-500 mb-2">
                          Liquidity Ratios
                        </p>
                        <div className=" grid grid-cols-3 gap-2">
                          <div className="bg-zinc-200 rounded p-2">
                            <div className="flex justify-between">
                              <p className="text-zinc-500">Current Ratio</p>
                              <div className="justify-self-end">
                                <ToolTip explain="Quick Ratio = (Current Assets − Inventory) ÷ Current Liabilities. This is the stricter version of the current ratio. By stripping out inventory, it only counts assets that can realistically be converted to cash quickly — cash, marketable securities, and receivables. A quick ratio above 1 means the company can cover its short-term liabilities without needing to sell a single unit of product. For asset-heavy businesses like retailers or manufacturers, the quick ratio is often significantly lower than the current ratio, and that gap itself is a useful signal about how liquid the business truly is."></ToolTip>
                              </div>
                            </div>
                            <p className="font-semibold">
                              {stockData.currentRatio?.toFixed(2) ?? 'N/A'}
                            </p>
                          </div>
                          <div className="bg-zinc-200 rounded p-2">
                            <div className="flex justify-between">
                              <p className="text-zinc-500">Quick Ratio</p>
                              <div className="justify-self-end">
                                <ToolTip explain="Current Ratio = Current Assets ÷ Current Liabilities. Current assets include everything the company expects to convert to cash within a year — cash itself, accounts receivable, and inventory. A ratio above 1 means the company has more short-term assets than short-term obligations, which is the bare minimum for comfort. A ratio between 1.5 and 2 is generally considered healthy. Below 1 signals the company may struggle to meet near-term obligations. The weakness of this ratio is that it treats inventory as equivalent to cash, which it isn't — unsold goods can sit on shelves for months."></ToolTip>
                              </div>
                            </div>
                            <p className="font-semibold">
                              {stockData.quickRatio?.toFixed(2) ?? 'N/A'}
                            </p>
                          </div>
                          <div className="bg-zinc-200 rounded p-2">
                            <div className="flex justify-between">
                              <p className="text-zinc-500">Free Cash flow</p>
                              <div className="justify-self-end">
                                <ToolTip explain="Free Cash Flow (FCF) is calculated as operating cash flow minus capital expenditures. It answers the most fundamental liquidity question: after the business pays to keep itself running and invest in its assets, how much real cash is left over? Unlike net income, FCF can't be manipulated by accounting choices — it reflects actual cash in hand. Positive FCF means the company can service debt, return money to shareholders, or fund growth without needing external financing. Persistent negative FCF is a red flag, though it's acceptable for early-stage companies still building infrastructure"></ToolTip>
                              </div>
                            </div>
                            <p className="font-semibold">
                              {stockData.freeCashflow
                                ? (stockData.freeCashflow / 10e6).toFixed(
                                  2,
                                ) + 'M'
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
      ))}
    </>
  );
}

export default TickerPage;
