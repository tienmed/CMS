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
        <div className="h-screen bg-[#f8fafc] overflow-hidden flex flex-col lg:flex-row">
            <Sidebar />
            <main className="flex-1 h-screen lg:ml-72 flex flex-col transition-all duration-300 min-w-0">
                <header className="shrink-0 sticky top-4 z-30 mx-4 lg:mx-8 h-16 lg:h-20 bg-white/70 backdrop-blur-xl border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.05)] rounded-[2rem] flex items-center px-6 lg:px-10 mt-4 transition-all duration-300">
                    <div className="flex-1">
                        <h2 className="text-[10px] lg:text-xs font-black text-slate-400 uppercase tracking-[0.2em] line-clamp-1">Hệ thống Quản lý Thiết bị CECICS</h2>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex flex-col items-end hidden sm:flex">
                            <span className="text-sm font-bold text-slate-900 leading-none">{user?.name || user?.username || 'User'}</span>
                            <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mt-1">{user?.email || ''}</span>
                        </div>
                        <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-200 border border-white/20">
                            <span className="font-black text-sm lg:text-base">{(user?.name || user?.username || 'U').slice(0, 2).toUpperCase()}</span>
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
