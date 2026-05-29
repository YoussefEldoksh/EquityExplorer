import { useEffect, useState } from 'react'
// import { useIsMobile } from '../hooks/use-mobile';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';

function WatchlistPage() {
    const [watchlist, setWatchlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 20;
    // const isMobile = useIsMobile();
    const navigate = useNavigate();

    const totalPages = Math.ceil(watchlist.length / ITEMS_PER_PAGE);
    const paginatedTickers = watchlist.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

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

    useEffect(() => {
        const fetchWatchlist = async () => {
            try {
                const response = await fetch(`/api/watchlist/details`, {
                    credentials: 'include'
                });
                if (response.status === 401) {
                    navigate('/signin');
                    return;
                }
                if (!response.ok) throw new Error('Failed to fetch watchlist');
                const data = await response.json();
                setWatchlist(data);
            } catch (error) {
                console.error('Error fetching watchlist:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchWatchlist();
    }, [navigate]);

    return (
        <div className="min-h-screen bg-slate-50">
            <div className='px-3 sm:px-5 md:px-8 pt-20 sm:pt-24 pb-10'>
                <div className="mb-6 sm:mb-8">
                    <p className='text-xs sm:text-sm md:text-base font-excon font-bold px-2 sm:px-3 text-zinc-500 uppercase tracking-widest'>
                        Your Favorites
                    </p>
                    <h1 className='text-2xl sm:text-3xl md:text-4xl font-excon font-bold px-2 text-slate-900'>
                        My Watchlist
                    </h1>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
                    </div>

                ) : watchlist.length === 0 ? (
                    <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-sm">
                        <p className="text-xl text-slate-500">Your watchlist is empty.</p>
                        <p className="mt-2 text-slate-400">Start adding stocks to see them here!</p>
                        <button
                            onClick={() => navigate('/tickerslist')}
                            className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                        >
                            Browse Stocks
                        </button>
                    </div>

                ) : (
                    <>
                        {/* Table Card */}
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader className="bg-slate-50">
                                        <TableRow>
                                            <TableHead className="w-[120px] font-bold text-slate-700">Ticker</TableHead>
                                            <TableHead className="font-bold text-slate-700">Name</TableHead>
                                            <TableHead className="font-bold text-slate-700">Price</TableHead>
                                            <TableHead className="font-bold text-slate-700">Chg %</TableHead>
                                            <TableHead className="text-right font-bold text-slate-700 hidden md:table-cell">Volume</TableHead>
                                            <TableHead className="text-right font-bold text-slate-700 hidden md:table-cell">Mkt Cap</TableHead>
                                            <TableHead className="text-right font-bold text-slate-700 hidden md:table-cell">P/E</TableHead>
                                            <TableHead className="text-center font-bold text-slate-700 hidden md:table-cell">Sector</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {paginatedTickers.map((ticker: any) => (
                                            <TableRow
                                                key={ticker?.symbol}
                                                className="cursor-pointer hover:bg-slate-50 transition-colors"
                                                onClick={() => navigate(`/${ticker?.symbol}`)}
                                            >
                                                <TableCell className="font-bold">
                                                    <span className="bg-slate-100 px-3 py-1 rounded-lg text-blue-700">
                                                        {ticker?.symbol}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="font-medium text-slate-600">{ticker?.name}</TableCell>
                                                <TableCell className="font-semibold text-slate-900">
                                                    ${ticker?.price?.toFixed(2)}
                                                </TableCell>
                                                <TableCell className={`font-bold ${ticker?.changePct > 0 ? "text-emerald-600" : "text-rose-600"}`}>
                                                    {ticker?.changePct > 0 ? '+' : ''}{ticker?.changePct?.toFixed(2)}%
                                                </TableCell>
                                                <TableCell className="text-right text-slate-500 hidden md:table-cell">
                                                    {formatVol(ticker?.vol)}
                                                </TableCell>
                                                <TableCell className="text-right text-slate-500 hidden md:table-cell">
                                                    {formatMarketCap(ticker?.marketCap)}
                                                </TableCell>
                                                <TableCell className="text-right text-slate-500 hidden md:table-cell">
                                                    {ticker?.pe ? ticker.pe.toFixed(2) : 'N/A'}
                                                </TableCell>
                                                <TableCell className="text-center hidden md:table-cell">
                                                    <span className="text-xs font-semibold px-2 py-1 bg-slate-100 rounded-full text-slate-600">
                                                        {ticker?.sector || 'N/A'}
                                                    </span>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>

                        {/* Pagination outside the table card */}
                        {totalPages > 1 && (
                            <div className='py-6'>
                                <Pagination>
                                    <PaginationContent>
                                        <PaginationItem>
                                            <PaginationPrevious
                                                href="#"
                                                onClick={(e) => { e.preventDefault(); setCurrentPage(p => Math.max(1, p - 1)); }}
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
                                                        onClick={(e) => { e.preventDefault(); setCurrentPage(item); }}
                                                    >
                                                        {item}
                                                    </PaginationLink>
                                                </PaginationItem>
                                            )
                                        )}

                                        <PaginationItem>
                                            <PaginationNext
                                                href="#"
                                                onClick={(e) => { e.preventDefault(); setCurrentPage(p => Math.min(totalPages, p + 1)); }}
                                            />
                                        </PaginationItem>
                                    </PaginationContent>
                                </Pagination>
                            </div>
                        )}
                    </>
                )}
            </div>

            <Footer />
        </div>
    );
}

export default WatchlistPage;