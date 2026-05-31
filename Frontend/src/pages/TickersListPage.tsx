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
import { Skeleton } from "../components/ui/skeleton"

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

                if (!indexResp.ok || !tickersResp.ok) {
                    throw new Error('Failed to fetch data');
                }

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

    const formatVol = (vol: number) => {
        if (!vol) return '—';
        if (vol >= 1e9) return (vol / 1e9).toFixed(2) + 'B';
        if (vol >= 1e6) return (vol / 1e6).toFixed(2) + 'M';
        return (vol / 1e3).toFixed(2) + 'K';
    };

    const formatMarketCap = (cap: number) => {
        if (!cap) return '—';
        if (cap >= 1e12) return (cap / 1e12).toFixed(2) + 'T';
        if (cap >= 1e9) return (cap / 1e9).toFixed(2) + 'B';
        return (cap / 1e6).toFixed(2) + 'M';
    };

    const paginationItems = Array.from({ length: totalPages }, (_, i) => i + 1)
        .filter(page => page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1)
        .reduce<(number | 'ellipsis')[]>((acc, page, idx, arr) => {
            if (idx > 0 && page - (arr[idx - 1] as number) > 1) acc.push('ellipsis');
            acc.push(page);
            return acc;
        }, []);

    return (
        <>
            {/* Indices Section */}
            <div className='pt-20 sm:pt-30'>
                <p className='text-xl sm:text-2xl md:text-3xl font-excon font-bold px-3 sm:px-7'>
                    Popular Indices
                </p>
            </div>

            <div className={`grid ${isMobile ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-2 sm:grid-cols-3"} px-3 sm:px-5 mt-3 sm:mt-5 gap-3 sm:gap-5`}>
                {INDICES.map((symbol) => (
                    <div key={symbol} className="bg-zinc-200 px-2 pt-2 pb-4 sm:pb-9 rounded-lg">
                        <div className={`bg-white rounded-lg p-2 sm:p-3 flex ${isMobile ? "h-full" : ""}`}>
                            {loading ? (
                                <div className="w-full flex flex-col gap-2">
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-5 w-40" />
                                    <Skeleton className="h-4 w-20 mt-4" />
                                </div>
                            ) : (
                                <div className="w-full flex flex-col justify-between">
                                    <div className="items-center text-sm sm:text-lg">
                                        <p className="font-bold text-xs sm:text-sm text-zinc-500">
                                            {indexInfo[symbol]?.regularMarketPrice?.toLocaleString()} points
                                        </p>
                                        <p className={`font-bold uppercase text-black flex gap-1 sm:gap-2 ${isMobile ? "text-xs" : "text-sm md:text-lg"}`}>
                                            {indexInfo[symbol]?.longName} - {indexInfo[symbol]?.fullExchangeName}
                                        </p>
                                    </div>
                                    <div className={isMobile ? 'text-xs sm:text-sm flex items-end mt-2' : 'mt-10'}>
                                        <p className={`font-bold uppercase flex gap-2 text-xs sm:text-base ${indexInfo[symbol]?.regularMarketChange > 0 ? 'text-green-700' : 'text-red-700'}`}>
                                            {indexInfo[symbol]?.regularMarketChange > 0 ? '+' : ''}
                                            {indexInfo[symbol]?.regularMarketChange?.toFixed(2)} ({indexInfo[symbol]?.regularMarketChangePercent?.toFixed(2)}%)
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Stock Screener Section */}
            <div className='px-3 sm:px-5 pt-10 sm:pt-15'>
                <div className='mb-3'>
                    <p className='text-sm sm:text-base font-excon font-bold px-2 sm:px-3'>Stock Screener</p>
                    <p className='text-xl sm:text-2xl md:text-3xl font-excon font-bold px-2'>All Stocks</p>
                </div>

                {/* Table in its own scroll container */}
                <div className="overflow-x-auto">
                    <Table className="w-full  text-xs sm:text-sm">
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[80px] sm:w-[100px]">Ticker</TableHead>
                                <TableHead className=" sm:table-cell">Name</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Chg %</TableHead>
                                <TableHead className="text-right  md:table-cell">Vol</TableHead>
                                <TableHead className="text-right  lg:table-cell">Mkt Cap</TableHead>
                                <TableHead className="text-right  lg:table-cell">P/E</TableHead>
                                <TableHead className="text-right  md:table-cell">EPS</TableHead>
                                <TableHead className="text-right  lg:table-cell">Div Yield</TableHead>
                                <TableHead className="text-center  lg:table-cell">Sector</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading
                                ? Array.from({ length: 20 }).map((_, i) => (
                                    <TableRow key={i}>
                                        <TableCell><Skeleton className="h-8 w-16 rounded-lg" /></TableCell>
                                        <TableCell className=" sm:table-cell"><Skeleton className="h-4 w-32" /></TableCell>
                                        <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                                        <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                                        <TableCell className=" md:table-cell"><Skeleton className="h-4 w-20" /></TableCell>
                                        <TableCell className=" lg:table-cell"><Skeleton className="h-4 w-20" /></TableCell>
                                        <TableCell className=" lg:table-cell"><Skeleton className="h-4 w-12" /></TableCell>
                                        <TableCell className=" md:table-cell"><Skeleton className="h-4 w-12" /></TableCell>
                                        <TableCell className=" lg:table-cell"><Skeleton className="h-4 w-12" /></TableCell>
                                        <TableCell className=" lg:table-cell"><Skeleton className="h-4 w-24" /></TableCell>
                                    </TableRow>
                                ))
                                : paginatedTickers.map((ticker: any) => (
                                    <TableRow
                                        key={ticker?.symbol}
                                        className="cursor-pointer hover:bg-zinc-50"
                                        onClick={() => navigate(`/${ticker?.symbol}`)}
                                    >
                                        <TableCell>
                                            <div className='font-medium bg-zinc-300 rounded-lg text-center py-2 hover:bg-black hover:text-white'>
                                                {ticker?.symbol}
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-medium  sm:table-cell">{ticker?.name}</TableCell>
                                        <TableCell className={ticker?.changePct > 0 ? "text-green-700" : "text-red-700"}>
                                            ${ticker?.price}
                                        </TableCell>
                                        <TableCell className={ticker?.changePct > 0 ? "text-green-700" : "text-red-700"}>
                                            {ticker?.changePct?.toFixed(2)}%
                                        </TableCell>
                                        <TableCell className="text-right  md:table-cell">
                                            {formatVol(ticker?.vol)}
                                        </TableCell>
                                        <TableCell className="text-right  lg:table-cell">
                                            {formatMarketCap(ticker?.marketCap)}
                                        </TableCell>
                                        <TableCell className="text-right  lg:table-cell">
                                            x{ticker?.pe ? ticker.pe.toFixed(2) : '—'}
                                        </TableCell>
                                        <TableCell className="text-right  md:table-cell">
                                            x{ticker?.eps ?? '—'}
                                        </TableCell>
                                        <TableCell className="text-right  lg:table-cell">
                                            {ticker?.div ? `${ticker.div}%` : '—'}
                                        </TableCell>
                                        <TableCell className="text-center  lg:table-cell">
                                            {ticker?.sector ?? '—'}
                                        </TableCell>
                                    </TableRow>
                                ))
                            }
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination outside the scroll container */}
                <div className='my-5'>
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    href="#"
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                />
                            </PaginationItem>

                            {paginationItems.map((item, idx) =>
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

            <Footer />
        </>
    );
}

export default TickersListPage;