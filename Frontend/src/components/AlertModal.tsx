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
                <button className='p-2 bg-black text-white rounded-lg cursor-pointer hover:bg-zinc-800 transition-colors flex items-center justify-center'>
                    <Bell size={20} />
                </button>
            </DrawerTrigger>
            <DrawerContent className="max-w-md mx-auto border-none bg-white rounded-t-3xl p-0">
                <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-slate-200 mt-4 mb-2" />
                
                {isSuccess ? (
                    <div className="p-10 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-500">
                        <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-4">
                            <CheckCircle2 size={32} />
                        </div>
                        <h2 className="text-2xl font-excon font-bold text-black mb-1">Alert Set</h2>
                        <p className="text-slate-500 text-sm">We'll notify you when {symbol} hits ${targetPrice}</p>
                    </div>
                ) : (
                    <>
                        <DrawerHeader className="px-6 pt-4 pb-0 text-left">
                            <div className="flex justify-between items-center mb-1">
                                <DrawerTitle className="text-xl font-excon font-bold text-black">
                                    Monitor {symbol}
                                </DrawerTitle>
                                <DrawerClose asChild>
                                    <button className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-black transition-colors">
                                        <X size={16} />
                                    </button>
                                </DrawerClose>
                            </div>
                            <DrawerDescription className="text-slate-500 text-sm">
                                Get notified of price movements.
                            </DrawerDescription>
                        </DrawerHeader>

                        <div className="px-6 py-6 space-y-6">
                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <div>
                                    <p className="text-slate-400 text-[10px] font-bold uppercase mb-0.5">Current Price</p>
                                    <p className="text-xl font-bold font-excon text-black">${currentPrice}</p>
                                </div>
                                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                                    <TrendingUp size={18} className="text-emerald-500" />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="target-price" className="text-[10px] font-bold uppercase tracking-wider text-slate-400 ml-1">Target Price ($)</Label>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-slate-300">$</div>
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
                                            className="w-full h-14 pl-10 pr-4 rounded-2xl border-slate-200 focus:border-black focus:ring-0 text-xl font-bold font-excon transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={() => setCondition('above')}
                                        className={`flex items-center justify-center gap-2 p-3 rounded-2xl border transition-all duration-200 ${condition === 'above' ? 'bg-black border-black text-white' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'}`}
                                    >
                                        <TrendingUp size={16} />
                                        <span className="font-bold text-xs">Above</span>
                                    </button>
                                    <button
                                        onClick={() => setCondition('below')}
                                        className={`flex items-center justify-center gap-2 p-3 rounded-2xl border transition-all duration-200 ${condition === 'below' ? 'bg-black border-black text-white' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'}`}
                                    >
                                        <TrendingDown size={16} />
                                        <span className="font-bold text-xs">Below</span>
                                    </button>
                                </div>
                            </div>

                            {((condition === 'above' && parseFloat(targetPrice) <= currentPrice) || 
                              (condition === 'below' && parseFloat(targetPrice) >= currentPrice)) && (
                                <div className="flex items-center gap-2 text-amber-600 bg-amber-50 p-3 rounded-xl border border-amber-100 animate-in fade-in slide-in-from-top-1">
                                    <AlertTriangle size={14} className="shrink-0" />
                                    <p className="text-[10px] font-bold leading-tight">Conditions already met. This alert will trigger immediately.</p>
                                </div>
                            )}
                        </div>

                        <DrawerFooter className="px-6 pb-8 pt-0">
                            <Button 
                                onClick={handleSetAlert} 
                                className="h-14 w-full rounded-2xl bg-black text-white hover:bg-zinc-800 text-sm font-bold transition-all active:scale-[0.98]"
                            >
                                Set Alert
                            </Button>
                        </DrawerFooter>
                    </>
                )}
            </DrawerContent>
        </Drawer>
    );
};

export default AlertModal;
