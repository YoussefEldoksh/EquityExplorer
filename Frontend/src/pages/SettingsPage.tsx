import { useState, useEffect, type ChangeEvent } from "react";
import { Link } from "react-router-dom";
import {
    ArrowUpRight,
    Palette,
    ShieldCheck,
    UserRound,
    Loader2
} from "lucide-react";

import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Separator } from "../components/ui/separator";

function SettingsPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [user, setUser] = useState({
        username: "",
        firstname: "",
        lastname: "",
        email: "",
        bio: ""
    });
    const [watchlistCount, setWatchlistCount] = useState(0);
    const [alertCount, setAlertCount] = useState(0);
    const [hasPassword, setHasPassword] = useState(false);
    const [passwords, setPasswords] = useState({
        old_password: "",
        new_password: "",
        confirm_password: ""
    });
    const [savingPassword, setSavingPassword] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch(`http://${window.location.hostname}/EquityExplorer/Backend/PHP/me.php`, {
                    method: 'GET',
                    credentials: 'include',
                });
                const data = await response.json();
                if (data.success) {
                    setUser({
                        username: data.user.username || "",
                        firstname: data.user.firstname || "",
                        lastname: data.user.lastname || "",
                        email: data.user.email || "",
                        bio: data.user.bio || ""
                    });
                    setHasPassword(data.has_password);
                }
            } catch (error) {
                console.error("Failed to fetch user data:", error);
            } finally {
                setLoading(false);
            }
        };

        const fetchWatchlistCount = async () => {
            try {
                const res = await fetch('/api/watchlist', { credentials: 'include' });
                const data = await res.json();
                if (Array.isArray(data)) setWatchlistCount(data.length);
            } catch (e) {
                console.error("Failed to fetch watchlist count:", e);
            }
        };

        const fetchAlertCount = async () => {
            try {
                const res = await fetch('/api/alerts', { credentials: 'include' });
                const data = await res.json();
                if (Array.isArray(data)) setAlertCount(data.length);
            } catch (e) {
                console.error("Failed to fetch alert count:", e);
            }
        };

        fetchUserData();
        fetchWatchlistCount();
        fetchAlertCount();
    }, []);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setUser({
            ...user,
            [e.target.id]: e.target.value
        });
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const response = await fetch(`http://${window.location.hostname}/EquityExplorer/Backend/PHP/update_profile.php`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(user)
            });
            const data = await response.json();
            if (data.success) {
                alert("Profile updated successfully!");
                // Trigger a global auth event to refresh navbar/other components if needed
                window.dispatchEvent(new Event('auth'));
            } else {
                alert(data.message || "Failed to update profile.");
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("Something went wrong while saving.");
        } finally {
            setSaving(false);
        }
    };

    const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
        setPasswords({
            ...passwords,
            [e.target.id]: e.target.value
        });
    };

    const handleUpdatePassword = async () => {
        if (!passwords.new_password) {
            alert("New password is required.");
            return;
        }
        if (passwords.new_password !== passwords.confirm_password) {
            alert("Passwords do not match.");
            return;
        }

        setSavingPassword(true);
        try {
            const response = await fetch(`http://${window.location.hostname}/EquityExplorer/Backend/PHP/update_password.php`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(passwords)
            });
            const data = await response.json();
            if (data.success) {
                alert("Password updated successfully!");
                setPasswords({
                    old_password: "",
                    new_password: "",
                    confirm_password: ""
                });
                setHasPassword(true);
            } else {
                alert(data.message || "Failed to update password.");
            }
        } catch (error) {
            console.error("Error updating password:", error);
            alert("Something went wrong while updating password.");
        } finally {
            setSavingPassword(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <Loader2 className="size-10 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="relative min-h-screen overflow-hidden bg-linear-to-b from-slate-50 via-indigo-50/70 to-white text-slate-900">
            <div className="pointer-events-none absolute -left-24 top-0 h-80 w-80 rounded-full bg-blue-300/20 blur-3xl" />
            <div className="pointer-events-none absolute right-0 top-24 h-80 w-80 rounded-full bg-emerald-300/20 blur-3xl" />

            <main className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 pb-16 pt-24 md:px-8 lg:px-10">
                <section className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/80 shadow-[0_30px_100px_rgba(15,23,42,0.12)] backdrop-blur">
                    <div className="grid gap-0 lg:grid-cols-[1.2fr_0.8fr]">
                        <div className="relative p-8 md:p-10">
                            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(15,23,42,0.98),rgba(37,99,235,0.88)_55%,rgba(14,165,233,0.78))]" />
                            <div className="absolute -right-12 -top-12 size-56 rounded-full bg-white/10 blur-3xl" />
                            <div className="absolute -bottom-16 left-12 size-56 rounded-full bg-emerald-300/20 blur-3xl" />

                            <div className="relative flex flex-col gap-8 text-white">
                                <div className="flex items-center gap-4">
                                    <div className="flex size-20 items-center justify-center rounded-[1.5rem] border border-white/15 bg-white/10 text-2xl font-bold shadow-lg">
                                        <UserRound className="size-9" />
                                    </div>
                                    <div>
                                        <p className="text-sm uppercase tracking-[0.3em] text-white/70">
                                            Settings
                                        </p>
                                        <h1 className="mt-2 text-3xl font-semibold md:text-4xl">
                                            Hello, {user.firstname || user.username}
                                        </h1>
                                        <p className="mt-3 max-w-xl text-sm leading-6 text-white/75 md:text-base">
                                            Manage your account details and preferences.
                                        </p>
                                    </div>
                                </div>

                                <div className="grid gap-4 md:grid-cols-3">
                                    {[
                                        {
                                            label: "Watchlists",
                                            value: watchlistCount.toString().padStart(2, '0'),
                                            note: "Curated portfolios",
                                            href: "/watchlist"
                                        },
                                        {
                                            label: "Alerts",
                                            value: alertCount.toString().padStart(2, '0'),
                                            note: "Active notifications",
                                            href: "/alerts"
                                        },
                                        {
                                            label: "Layouts",
                                            value: "03",
                                            note: "Saved workspace views",
                                        },
                                    ].map((item) => {
                                        const CardWrapper = item.href ? Link : 'div';
                                        return (
                                            <CardWrapper key={item.label} to={item.href || ""}>
                                                <Card
                                                    className={`border-white/10 bg-white/10 text-white shadow-none backdrop-blur h-full transition-all ${item.href ? 'hover:bg-white/20 hover:scale-[1.02] cursor-pointer' : ''}`}
                                                >
                                                    <CardContent className="p-5">
                                                        <p className="text-xs uppercase tracking-[0.22em] text-white/55">
                                                            {item.label}
                                                        </p>
                                                        <p className="mt-2 text-3xl font-semibold">
                                                            {item.value}
                                                        </p>
                                                        <p className="mt-1 text-sm text-white/70">
                                                            {item.note}
                                                        </p>
                                                    </CardContent>
                                                </Card>
                                            </CardWrapper>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        <div className="grid gap-0 border-t border-white/70 bg-white/75 p-8 lg:border-t-0 lg:border-l">
                            <div className="space-y-6">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
                                        Profile
                                    </p>
                                    <h2 className="mt-2 text-2xl font-semibold text-slate-950">
                                        Account details
                                    </h2>
                                </div>

                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="firstname">First name</Label>
                                        <Input
                                            id="firstname"
                                            value={user.firstname}
                                            onChange={handleChange}
                                            className="rounded-2xl border-slate-200 bg-white"
                                            placeholder="First Name"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="lastname">Last name</Label>
                                        <Input
                                            id="lastname"
                                            value={user.lastname}
                                            onChange={handleChange}
                                            className="rounded-2xl border-slate-200 bg-white"
                                            placeholder="Last Name"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        value={user.email}
                                        onChange={handleChange}
                                        className="rounded-2xl border-slate-200 bg-white"
                                        placeholder="Email Address"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="bio">Short bio</Label>
                                    <Input
                                        id="bio"
                                        value={user.bio}
                                        onChange={handleChange}
                                        className="rounded-2xl border-slate-200 bg-white"
                                        placeholder="Tell us about yourself..."
                                    />
                                </div>

                                <Separator />

                                <div className="flex flex-wrap gap-3">
                                    <Button 
                                        disabled={saving}
                                        onClick={handleSave}
                                        className="rounded-2xl bg-slate-950 px-5 text-white hover:bg-slate-800"
                                    >
                                        {saving ? "Saving..." : "Save changes"}
                                        <ArrowUpRight className="ml-2 size-4" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => window.location.reload()}
                                        className="rounded-2xl border-slate-200 px-5"
                                    >
                                        Reset
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="grid gap-6 lg:grid-cols-2">
                    <Card className="rounded-[1.75rem] border-slate-200 bg-white/90 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
                        <CardContent className="p-7">
                            <div className="flex items-center gap-3">
                                <div className="flex size-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                                    <Palette className="size-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-slate-950">
                                        Appearance
                                    </p>
                                    <p className="text-sm text-slate-500">
                                        A soft, editorial look that still feels sharp.
                                    </p>
                                </div>
                            </div>

                            <div className="mt-6 grid gap-3 sm:grid-cols-3">
                                {["System", "Light", "Dark"].map((mode) => (
                                    <Button
                                        key={mode}
                                        variant={mode === "Light" ? "default" : "outline"}
                                        className="h-12 rounded-2xl"
                                    >
                                        {mode}
                                    </Button>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="rounded-[1.75rem] border-slate-200 bg-white/90 shadow-[0_20px_60px_rgba(15,23,42,0.08)] overflow-hidden">
                        <CardContent className="p-7">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="flex size-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                                    <ShieldCheck className="size-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-slate-950">
                                        Security
                                    </p>
                                    <p className="text-sm text-slate-500">
                                        {hasPassword ? "Change your account password." : "Set a password for your account."}
                                    </p>
                                </div>
                            </div>

                            <form onSubmit={(e) => { e.preventDefault(); handleUpdatePassword(); }} className="space-y-4">
                                {hasPassword && (
                                    <div className="space-y-2">
                                        <Label htmlFor="old_password">Current Password</Label>
                                        <Input
                                            id="old_password"
                                            type="password"
                                            autoComplete="current-password"
                                            value={passwords.old_password}
                                            onChange={handlePasswordChange}
                                            className="rounded-2xl border-slate-200 bg-white"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                )}
                                <div className="space-y-2">
                                    <Label htmlFor="new_password">New Password</Label>
                                    <Input
                                        id="new_password"
                                        type="password"
                                        autoComplete="new-password"
                                        value={passwords.new_password}
                                        onChange={handlePasswordChange}
                                        className="rounded-2xl border-slate-200 bg-white"
                                        placeholder="••••••••"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="confirm_password">Confirm New Password</Label>
                                    <Input
                                        id="confirm_password"
                                        type="password"
                                        autoComplete="new-password"
                                        value={passwords.confirm_password}
                                        onChange={handlePasswordChange}
                                        className="rounded-2xl border-slate-200 bg-white"
                                        placeholder="••••••••"
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    disabled={savingPassword}
                                    className="w-full h-12 rounded-2xl bg-blue-600 text-white hover:bg-blue-700 mt-2 shadow-sm"
                                >
                                    {savingPassword ? "Updating..." : (hasPassword ? "Update Password" : "Set Password")}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </section>
            </main>
        </div>
    );
}

export default SettingsPage;
