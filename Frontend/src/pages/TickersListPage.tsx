import { useEffect, useState } from 'react'
import { useIsMobile } from '../hooks/use-mobile';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../components/ui/table"
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "../components/ui/pagination"
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';
<<<<<<< HEAD
import { Skeleton } from "../components/ui/skeleton"
=======
>>>>>>> 5459568 (feat(frontend): add navigation to TickersListPage rows)


function TickersListPage() {
    const navigate = useNavigate();
    const [indexInfo, setIndexInfo] = useState<Record<string, any>>({});
    const [tickersList, setTickersList] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const ITEMS_PER_PAGE = 20;


    const totalPages = Math.ceil(tickersList.length / ITEMS_PER_PAGE);
    const paginatedTickers = tickersList.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );
    const isMobile = useIsMobile();

    const INDICES = ["^CASE30", "^GSPC", "^DJI", "^IXIC"];

    useEffect(() => {
        const getIndexInfo = async () => {
            try {
                const [indexResp, tickersResp] = await Promise.all([
                    fetch(`/api/index?symbols=^DJI,^IXIC,^GSPC,^CASE30`),
                    fetch(`/api/snp500`)
                ]);
                const [data, tickersData] = await Promise.all([
                    indexResp.json(),
                    tickersResp.json()
                ]);
                setIndexInfo(data);
                setTickersList(tickersData);
            } catch (error) {
                console.error('Error fetching index data:', error);
            } finally {
                setLoading(false);
            }
        };

        getIndexInfo();
    }, []);



    return (
        <>

            <div className='pt-18'>
                <p className='text-3xl font-excon font-bold px-7 ' >Popular Indices</p>
            </div>
            <div className={`grid ${isMobile ? "grid-cols-2  px-5 px-5 mt-5" : "grid-cols-3 px-5 mt-5 "}  gap-5`}>
                {INDICES.map((symbol) => (
                    <div key={symbol} className="bg-zinc-200 px-2 pt-2 pb-9 rounded-lg">
                        <div className={`bg-white rounded-lg p-3 flex ${isMobile ? "h-full" : ""}`}>

                            {loading ? (<div className="w-full flex flex-col gap-2">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-5 w-40" />
                                <Skeleton className="h-4 w-20 mt-4" />
                            </div>
                            ) : (


                                < div className="w-full flex flex-col justify-between">

                                    <div className={` items-center text-lg `}>
                                        <p className={`font-bold text-sm text-zinc-500 `}>
                                            {indexInfo[symbol]?.regularMarketPrice} points
                                        </p>
                                        <p className={`font-bold uppercase text-black flex gap-2 ${isMobile ? "text-sm" : "text-lg"}`}>
                                            {indexInfo[symbol]?.longName} - {indexInfo[symbol]?.fullExchangeName}
                                        </p>

                                    </div>

                                    <div className={`${isMobile ? 'text-sm flex items-end' : 'mt-10'} 'mt-10'`}>
                                        <p className={`font-bold uppercase text-black flex gap-2 ${indexInfo[symbol]?.regularMarketChange > 0 ? 'text-green-700' : 'text-red-700'}`}>
                                            {indexInfo[symbol]?.regularMarketChange > 0 ? '+' : ''}{indexInfo[symbol]?.regularMarketChange?.toFixed(2)} ({indexInfo[symbol]?.regularMarketChangePercent?.toFixed(2)}%)

                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div >

            <div className='px-5 pt-15'>
                <div>
                    <p className='text-lg font-excon font-bold px-3'>Stock Screener</p>
                    <p className='text-3xl font-excon font-bold px-2'>All Stocks</p>
                </div>
                <Table>
                    {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">Ticker</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Chg %</TableHead>
                            <TableHead className="text-right">Vol</TableHead>
                            <TableHead className="text-right">Mkt Cap</TableHead>
                            <TableHead className="text-right">P/E</TableHead>
                            <TableHead className="text-right">EPS</TableHead>
                            <TableHead className="text-right">Div Yield</TableHead>
                            <TableHead className="text-center">Sector</TableHead>

                        </TableRow>
                    </TableHeader>
                    <TableBody>
<<<<<<< HEAD
                        {loading
                            ? Array.from({ length: 20 }).map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell><Skeleton className="h-8 w-16 rounded-lg" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                </TableRow>
                            )) :
                            (


                                paginatedTickers.map((ticker: any) => (
                                        <TableRow
                                            key={ticker?.symbol}
                                            className="cursor-pointer hover:bg-zinc-50 "
                                            onClick={() => navigate(`/${ticker?.symbol}`)}
                                        >
                                            <TableCell className="   ">
                                                <div className='font-medium bg-zinc-300  rounded-lg text-center py-2 hover:bg-black hover:text-white'>
        
                                                    {ticker?.symbol}
                                                </div>
                                            </TableCell>
                                            <TableCell className="font-medium">{ticker?.name}</TableCell>
                                            <TableCell className={`${ticker?.changePct > 0 ? "text-green-700" : "text-red-700"}`}>
                                                ${ticker?.price}
                                            </TableCell>
                                            <TableCell className={`${ticker?.changePct > 0 ? "text-green-700" : "text-red-700"}`}>
                                                {ticker?.changePct.toFixed(2)}%
                                            </TableCell>
                                            <TableCell className="text-right">{(ticker?.vol / 10e3).toFixed(2)}T</TableCell>
                                            <TableCell className="text-right">{(ticker?.marketCap / 10e9).toFixed(2)}B</TableCell>
                                            <TableCell className="text-right">x{ticker?.pe ? ticker?.pe.toFixed(2) : 0}</TableCell>
                                            <TableCell className="text-right">x{ticker?.eps}</TableCell>
                                            <TableCell className="text-right">{ticker?.div ? ticker?.div : 0}%</TableCell>
                                            <TableCell className="text-center">{ticker?.sector}</TableCell>
                                        </TableRow>
                                    ))
                            )}
=======
                        {paginatedTickers.map((ticker: any) => (
                            <TableRow 
                                key={ticker?.symbol}
                                className="cursor-pointer hover:bg-zinc-50"
                                onClick={() => navigate(`/${ticker?.symbol}`)}
                            >
                                <TableCell className="font-medium bg-zinc-300 w-[50px] rounded-lg text-center">
                                    {ticker?.symbol}
                                </TableCell>
                                <TableCell className="font-medium">{ticker?.name}</TableCell>
                                <TableCell className={`${ticker?.changePct > 0 ? "text-green-700" : "text-red-700"}`}>
                                    ${ticker?.price}
                                </TableCell>
                                <TableCell className={`${ticker?.changePct > 0 ? "text-green-700" : "text-red-700"}`}>
                                    {ticker?.changePct.toFixed(2)}%
                                </TableCell>
                                <TableCell className="text-right">{(ticker?.vol / 10e3).toFixed(2)}T</TableCell>
                                <TableCell className="text-right">{(ticker?.marketCap / 10e9).toFixed(2)}B</TableCell>
                                <TableCell className="text-right">x{ticker?.pe ? ticker?.pe.toFixed(2) : 0}</TableCell>
                                <TableCell className="text-right">x{ticker?.eps}</TableCell>
                                <TableCell className="text-right">{ticker?.div ? ticker?.div : 0}%</TableCell>
                                <TableCell className="text-center">{ticker?.sector}</TableCell>
                            </TableRow>
                        ))}
>>>>>>> 5459568 (feat(frontend): add navigation to TickersListPage rows)

                    </TableBody>
                </Table>

                <div className='my-5'>

                    <Pagination >
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    href="#"
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                />
                            </PaginationItem>

                            {Array.from({ length: totalPages }, (_, i) => i + 1)
                                .filter(page => page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1)
                                .reduce<(number | 'ellipsis')[]>((acc, page, idx, arr) => {
                                    if (idx > 0 && page - (arr[idx - 1] as number) > 1) acc.push('ellipsis');
                                    acc.push(page);
                                    return acc;
                                }, [])
                                .map((item, idx) =>
                                    item === 'ellipsis' ? (
                                        <PaginationItem key={`ellipsis-${idx}`}>
                                            <PaginationEllipsis />
                                        </PaginationItem>
                                    ) : (
                                        <PaginationItem key={item}>
                                            <PaginationLink
                                                href="#"
                                                isActive={item === currentPage}
                                                onClick={() => setCurrentPage(item)}
                                            >
                                                {item}
                                            </PaginationLink>
                                        </PaginationItem>
                                    )
                                )}

                            <PaginationItem>
                                <PaginationNext
                                    href="#"
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            </div>

            <Footer></Footer>

        </>
    )
}

export default TickersListPage