import { Sidebar } from '@/components/Sidebar';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-slate-50">
            <Sidebar />
            <main className="lg:ml-64 min-h-screen">
                <header className="h-14 lg:h-16 bg-white border-b border-slate-200 flex items-center px-4 pl-14 lg:px-8 sticky top-0 z-10">
                    <div className="flex-1">
                        <h2 className="text-xs lg:text-sm font-medium text-slate-500 uppercase tracking-wider">Hệ thống Quản lý Thiết bị CECICS</h2>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-xs">
                            AD
                        </div>
                        <span className="hidden sm:block text-sm font-medium text-slate-700">Administrator</span>
                    </div>
                </header>
                <div className="p-4 lg:p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
