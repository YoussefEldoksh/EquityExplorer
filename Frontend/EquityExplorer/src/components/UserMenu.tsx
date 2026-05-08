import { useNavigate, Link } from 'react-router-dom';
import { LogOut, Settings2, UserRound } from 'lucide-react';

import { Button } from './ui/button';

function UserMenu({ className }: { className?: string }) {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await fetch('http://localhost/EquityExplorer/Backend/PHP/logout.php', {
                method: 'POST',
                credentials: 'include',
            });
        } finally {
            localStorage.removeItem('token');
            sessionStorage.removeItem('token');
            window.dispatchEvent(new Event('auth'));
            navigate('/signin');
        }
    };

    return (
        <div className={`group relative inline-flex ${className ?? ''}`.trim()}>
            <Button
                variant="ghost"
                size="icon"
                className="rounded-full border border-black/10 bg-white/80 text-black shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:bg-black hover:text-white"
            >
                <UserRound className="size-4" />
                <span className="sr-only">Open account menu</span>
            </Button>

            <div className="pointer-events-none absolute right-0 top-full z-50 mt-3 w-56 origin-top-right translate-y-1 scale-95 opacity-0 transition duration-150 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:translate-y-0 group-focus-within:scale-100 group-focus-within:opacity-100">
                <div className="rounded-3xl border border-black/10 bg-white p-2 shadow-[0_24px_80px_rgba(15,23,42,0.16)]">
                    <div className="px-3 py-2">
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                            Account
                        </p>
                        <p className="mt-1 text-sm font-semibold text-slate-900">
                            Profile actions
                        </p>
                    </div>

                    <Button
                        asChild
                        variant="ghost"
                        className="h-11 w-full justify-start rounded-2xl px-3 text-sm"
                    >
                        <Link to="/settings">
                            <Settings2 className="mr-2 size-4" />
                            Settings
                        </Link>
                    </Button>

                    <Button
                        type="button"
                        variant="ghost"
                        className="h-11 w-full justify-start rounded-2xl px-3 text-sm text-red-600 hover:bg-red-50 hover:text-red-700"
                        onClick={handleLogout}
                    >
                        <LogOut className="mr-2 size-4" />
                        Logout
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default UserMenu;