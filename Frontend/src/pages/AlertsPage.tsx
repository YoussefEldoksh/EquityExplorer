import { useEffect, useState, useRef } from 'react'
import { Button } from '../components/ui/button';
import { Trash2, Bell, ArrowUpRight, Pause, Play, ChevronRight, TrendingUp, TrendingDown } from 'lucide-react';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import Aurora from '../components/Aurora';

interface Alert {
    id: number;
    symbol: string;
    target_price: number;
    condition: 'above' | 'below';
    is_active: boolean;
    current_price?: number | null;
}

function AlertsPage() {
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

    const fetchAlerts = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/alerts`, {
                credentials: 'include'
            });
            if (response.status === 401) {
                navigate('/signin');
                return;
            }
            const data = await response.json();
            setAlerts(data);
        } catch (error) {
            console.error('Error fetching alerts:', error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchAlerts();
    }, [navigate]);

    useEffect(() => {
        if (!loading && alerts.length > 0) {
            gsap.fromTo(cardsRef.current, 
                { opacity: 0, y: 20, scale: 0.95 },
                { 
                    opacity: 1, 
                    y: 0, 
                    scale: 1, 
                    duration: 0.5, 
                    stagger: 0.1, 
                    ease: "power2.out",
                    overwrite: true
                }
            );
        }
    }, [loading, alerts.length]);

    const handleToggle = async (id: number) => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/alerts/toggle/${id}`, {
                method: 'PATCH',
                credentials: 'include'
            });
            if (res.ok) {
                setAlerts(prev => prev.map(a => a.id === id ? { ...a, is_active: !a.is_active } : a));
            }
        } catch (e) {
            console.error(e);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this alert?")) return;
        
        // Optimistic UI update with GSAP animation
        const index = alerts.findIndex(a => a.id === id);
        if (index !== -1 && cardsRef.current[index]) {
            gsap.to(cardsRef.current[index], {
                opacity: 0,
                x: -50,
                duration: 0.3,
                onComplete: async () => {
                    try {
                        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/alerts/remove/${id}`, {
                            method: 'DELETE',
                            credentials: 'include'
                        });
                        if (res.ok) fetchAlerts();
                    } catch (e) {
                        console.error(e);
                    }
                }
            });
        }
    };

    const getPriceProgress = (alert: Alert) => {
        if (!alert.current_price) return 0;
        
        const start = alert.condition === 'above' ? alert.current_price * 0.8 : alert.current_price * 1.2;
        const target = alert.target_price;
        const current = alert.current_price;
        
        let progress = ((current - start) / (target - start)) * 100;
        return Math.min(Math.max(progress, 0), 100);
    };

    return (
        <div className="min-h-screen bg-white text-slate-900 selection:bg-black selection:text-white">

            <main className='px-6 pt-32 pb-20 max-w-6xl mx-auto'>
                <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-xs font-bold uppercase tracking-wider mb-4">
                            <Bell size={14} />
                            <span>Notifications</span>
                        </div>
                        <h1 className='text-5xl md:text-6xl font-excon font-bold tracking-tight text-black'>
                            Price Alerts
                        </h1>
                    </div>
                    {alerts.length > 0 && (
                        <p className="text-slate-500 font-medium">
                            Managing <span className="text-black font-bold">{alerts.length}</span> active trackers
                        </p>
                    )}
                </header>

                {loading ? (
                    <div className="flex flex-col justify-center items-center h-96 gap-4">
                        <div className="relative h-16 w-16">
                            <div className="absolute inset-0 rounded-full border-4 border-slate-100"></div>
                            <div className="absolute inset-0 rounded-full border-4 border-black border-t-transparent animate-spin"></div>
                        </div>
                        <p className="text-slate-400 font-medium animate-pulse">Fetching your alerts...</p>
                    </div>
                ) : alerts.length === 0 ? (
                    <div className="relative h-[500px] rounded-3xl overflow-hidden group border border-slate-100 shadow-2xl shadow-slate-200/50">
                        <div className="absolute inset-0 z-0">
                            <Aurora amplitude={0.8} colorStops={['#000000', '#333333', '#666666']} />
                        </div>
                        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-8 text-center bg-white/40 backdrop-blur-3xl">
                            <div className="w-24 h-24 bg-black rounded-3xl flex items-center justify-center mb-8 shadow-2xl rotate-3 group-hover:rotate-6 transition-transform duration-500">
                                <Bell size={40} className="text-white" />
                            </div>
                            <h2 className="text-3xl font-excon font-bold mb-4 text-black">Stay Ahead of the Market</h2>
                            <p className="text-slate-600 max-w-md mx-auto text-lg mb-10 leading-relaxed">
                                You haven't set any price alerts yet. Monitor your favorite assets and get notified the moment they hit your targets.
                            </p>
                            <Button 
                                onClick={() => navigate('/tickerslist')}
                                className="group h-14 px-8 bg-black text-white rounded-2xl font-bold hover:scale-105 transition-all duration-300 shadow-xl shadow-black/20"
                            >
                                <span>Browse Stocks</span>
                                <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {alerts.map((alert, index) => {
                            const progress = getPriceProgress(alert);
                            const isAtTarget = alert.condition === 'above' 
                                ? (alert.current_price || 0) >= alert.target_price 
                                : (alert.current_price || 0) <= alert.target_price;

                            return (
                                <div 
                                    key={alert.id} 
                                    ref={el => { cardsRef.current[index] = el }}
                                    className={`relative flex flex-col bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 group ${!alert.is_active ? 'opacity-60 grayscale-[0.5]' : ''}`}
                                >
                                    <div className="flex justify-between items-start mb-6">
                                        <div 
                                            className="cursor-pointer group/symbol"
                                            onClick={() => navigate(`/${alert.symbol}`)}
                                        >
                                            <h3 className="text-3xl font-excon font-bold text-black group-hover/symbol:text-blue-600 transition-colors">
                                                {alert.symbol}
                                            </h3>
                                            <div className="flex items-center gap-1 text-slate-400 text-xs font-bold uppercase mt-1">
                                                <span>View details</span>
                                                <ArrowUpRight size={12} className="group-hover/symbol:translate-x-0.5 group-hover/symbol:-translate-y-0.5 transition-transform" />
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button 
                                                onClick={() => handleToggle(alert.id)}
                                                className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${alert.is_active ? 'bg-slate-100 text-black hover:bg-black hover:text-white' : 'bg-black text-white hover:bg-slate-800'}`}
                                                title={alert.is_active ? "Pause" : "Resume"}
                                            >
                                                {alert.is_active ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(alert.id)}
                                                className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center hover:bg-rose-600 hover:text-white transition-all duration-300"
                                                title="Delete"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-6 flex-grow">
                                        <div className="flex justify-between items-end">
                                            <div>
                                                <p className="text-slate-400 text-xs font-bold uppercase mb-1">Target Price</p>
                                                <p className="text-2xl font-bold text-black">${alert.target_price.toFixed(2)}</p>
                                            </div>
                                            <div className={`px-4 py-2 rounded-2xl text-xs font-bold flex items-center gap-1.5 ${alert.condition === 'above' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                                                {alert.condition === 'above' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                                                <span className="uppercase">{alert.condition}</span>
                                            </div>
                                        </div>

                                        {alert.current_price && (
                                            <div className="space-y-2">
                                                <div className="flex justify-between text-xs font-bold uppercase">
                                                    <span className="text-slate-400">Current Price</span>
                                                    <span className={isAtTarget ? "text-emerald-600" : "text-black"}>
                                                        ${alert.current_price.toFixed(2)}
                                                    </span>
                                                </div>
                                                <div className="h-3 bg-slate-100 rounded-full overflow-hidden p-0.5">
                                                    <div 
                                                        className={`h-full rounded-full transition-all duration-1000 ease-out ${isAtTarget ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-black'}`}
                                                        style={{ width: `${progress}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {!alert.is_active && (
                                        <div className="mt-6 pt-6 border-t border-slate-100 flex items-center gap-2 text-slate-400 italic text-sm">
                                            <Pause size={14} />
                                            <span>Tracker is currently paused</span>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>

            <Footer></Footer>
        </div>
    )
}

export default AlertsPage;
