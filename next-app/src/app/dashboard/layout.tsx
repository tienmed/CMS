import { Sidebar } from '@/components/Sidebar';
import { cookies } from 'next/headers';
import { authCookieName, verifySessionToken } from '@/lib/auth';

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const cookieStore = await cookies();
    const user = verifySessionToken(cookieStore.get(authCookieName)?.value);

    return (
        <div className="h-screen bg-background overflow-hidden flex flex-col lg:flex-row">
            <Sidebar user={user} />
            <main className="flex-1 h-screen lg:ml-72 flex flex-col transition-all duration-300 min-w-0">
                <header className="shrink-0 sticky top-4 z-30 mx-4 lg:mx-8 h-12 lg:h-20 bg-white/60 dark:bg-black/60 backdrop-blur-xl border border-white/40 dark:border-white/5 shadow-soft rounded-[2.5rem] flex items-center px-8 lg:px-12 mt-6 transition-all duration-300">
                    <div className="flex-1">
                        <h2 className="text-[10px] lg:text-xs font-black text-gray-text uppercase tracking-[0.4em] line-clamp-1 opacity-50">CECICS Enterprise Hub</h2>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="flex flex-col items-end hidden sm:flex">
                            <span className="text-base font-black text-navy leading-none tracking-tight">{user?.name || user?.username || 'User'}</span>
                            <span className="text-[10px] font-bold text-brand-primary uppercase tracking-[0.2em] mt-1.5 opacity-60">Authentication Node • 01</span>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-brand-primary flex items-center justify-center text-white shadow-pro animate-in zoom-in duration-700">
                            <span className="font-black text-sm tracking-tighter">{(user?.name || user?.username || 'U').slice(0, 2).toUpperCase()}</span>
                        </div>
                    </div>
                </header>
                <div className="flex-1 min-h-0 p-4 lg:p-8 animate-in fade-in duration-500 overflow-hidden">
                    {children}
                </div>
            </main>
        </div>
    );
}
