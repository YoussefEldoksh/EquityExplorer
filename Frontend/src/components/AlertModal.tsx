import React, { useState, useEffect } from 'react';
import { Bell, AlertTriangle, TrendingUp, TrendingDown, X, CheckCircle2 } from 'lucide-react';
import { Button } from './ui/button';
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from './ui/drawer';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface AlertModalProps {
    symbol: string;
    currentPrice: number;
    onAlertSet: (symbol: string, targetPrice: number, condition: string) => void;
}

const AlertModal: React.FC<AlertModalProps> = ({ symbol, currentPrice, onAlertSet }) => {
    const [targetPrice, setTargetPrice] = useState<string>(currentPrice?.toString() || "");
    const [condition, setCondition] = useState<'above' | 'below'>(
        parseFloat(targetPrice) > currentPrice ? 'above' : 'below'
    );
    const [open, setOpen] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        if (!open) {
            setIsSuccess(false);
        }
    }, [open]);

    const handleSetAlert = () => {
        const price = parseFloat(targetPrice);
        if (isNaN(price)) return;

        onAlertSet(symbol, price, condition);
        setIsSuccess(true);
        setTimeout(() => setOpen(false), 1500);
    };

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <button className='group relative flex items-center gap-2 px-5 py-3 bg-black text-white rounded-2xl font-bold hover:scale-105 transition-all duration-300 shadow-xl shadow-black/10 overflow-hidden'>
                    <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                    <Bell size={18} className="relative z-10" />
                    <span className="relative z-10">Set Alert</span>
                </button>
            </DrawerTrigger>
            <DrawerContent className="max-w-xl mx-auto border-none bg-white rounded-t-[3rem] p-0">
                <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-slate-200 mt-4 mb-2" />
                
                {isSuccess ? (
                    <div className="p-12 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-500">
                        <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-6">
                            <CheckCircle2 size={40} />
                        </div>
                        <h2 className="text-3xl font-excon font-bold text-black mb-2">Alert Configured</h2>
                        <p className="text-slate-500 font-medium">We'll notify you when {symbol} hits ${targetPrice}</p>
                    </div>
                ) : (
                    <>
                        <DrawerHeader className="px-8 pt-6 pb-2">
                            <div className="flex justify-between items-center mb-4">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                                    <Bell size={12} />
                                    <span>Smart Notifications</span>
                                </div>
                                <DrawerClose asChild>
                                    <button className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-black transition-colors">
                                        <X size={16} />
                                    </button>
                                </DrawerClose>
                            </div>
                            <DrawerTitle className="text-4xl font-excon font-bold tracking-tight text-black">
                                Monitor {symbol}
                            </DrawerTitle>
                            <DrawerDescription className="text-slate-500 font-medium text-lg mt-1">
                                Configure a price trigger to stay ahead of volatility.
                            </DrawerDescription>
                        </DrawerHeader>

                        <div className="px-8 py-6 space-y-8">
                            <div className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-100">
                                <div>
                                    <p className="text-slate-400 text-xs font-bold uppercase mb-1">Live Market Price</p>
                                    <p className="text-3xl font-bold font-excon text-black">${currentPrice}</p>
                                </div>
                                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                                    <TrendingUp size={20} className="text-emerald-500" />
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-3">
                                    <Label htmlFor="target-price" className="text-sm font-bold uppercase tracking-wider text-slate-400 ml-1">Target Threshold ($)</Label>
                                    <div className="relative">
                                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-bold text-slate-300">$</div>
                                        <Input
                                            id="target-price"
                                            type="number"
                                            step="0.01"
                                            value={targetPrice}
                                            onChange={(e) => {
                                                setTargetPrice(e.target.value);
                                                const val = parseFloat(e.target.value);
                                                if (!isNaN(val)) {
                                                    setCondition(val >= currentPrice ? 'above' : 'below');
                                                }
                                            }}
                                            className="w-full h-20 pl-12 pr-8 rounded-3xl border-2 border-slate-100 focus:border-black focus:ring-0 text-3xl font-bold font-excon transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        onClick={() => setCondition('above')}
                                        className={`flex flex-col items-center justify-center p-6 rounded-3xl border-2 transition-all duration-300 ${condition === 'above' ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'}`}
                                    >
                                        <TrendingUp size={24} className="mb-2" />
                                        <span className="font-bold uppercase text-xs tracking-widest">Notify Above</span>
                                    </button>
                                    <button
                                        onClick={() => setCondition('below')}
                                        className={`flex flex-col items-center justify-center p-6 rounded-3xl border-2 transition-all duration-300 ${condition === 'below' ? 'bg-amber-50 border-amber-500 text-amber-700' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'}`}
                                    >
                                        <TrendingDown size={24} className="mb-2" />
                                        <span className="font-bold uppercase text-xs tracking-widest">Notify Below</span>
                                    </button>
                                </div>
                            </div>

                            {condition === 'below' && parseFloat(targetPrice) >= currentPrice && (
                                <div className="flex items-center gap-3 text-amber-700 bg-amber-50/50 p-4 rounded-2xl border border-amber-100 animate-in slide-in-from-top-2 duration-300">
                                    <AlertTriangle size={18} className="shrink-0" />
                                    <p className="text-xs font-medium leading-relaxed">Optimization Note: Your target price is currently above the market price. This alert will trigger immediately if active.</p>
                                </div>
                            )}
                        </div>

                        <DrawerFooter className="px-8 pb-10 pt-2 flex flex-col gap-3">
                            <Button 
                                onClick={handleSetAlert} 
                                className="h-16 w-full rounded-2xl bg-black text-white hover:bg-slate-800 text-lg font-bold shadow-2xl shadow-black/10 transition-all hover:scale-[1.02] active:scale-95"
                            >
                                Confirm Tracker
                            </Button>
                        </DrawerFooter>
                    </>
                )}
            </DrawerContent>
        </Drawer>
    );
};

export default AlertModal;
