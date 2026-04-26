'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    BarChart3,
    Package,
    ClipboardList,
    History,
    LayoutDashboard,
    LogOut,
    Menu,
    X,
    QrCode
} from 'lucide-react';
import { cn } from '@/lib/utils';

const menuItems = [
    { name: 'Tổng quan', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Kho thiết bị', href: '/dashboard/equipment', icon: Package },
    { name: 'Mượn / Trả', href: '/dashboard/rental', icon: ClipboardList },
    { name: 'Tra cứu QR', href: '/dashboard/qr', icon: QrCode },
    { name: 'Lịch sử sử dụng', href: '/dashboard/history', icon: History },
    { name: 'Báo cáo', href: '/dashboard/reports', icon: BarChart3 },
];

export function Sidebar() {
    const [open, setOpen] = useState(false);
    const pathname = usePathname();

    const navContent = (
        <>
            <div className="p-5 lg:p-6">
                <h1 className="text-xl font-bold tracking-tight text-blue-400">CECICS CMS</h1>
                <p className="text-[10px] text-slate-400 mt-1 uppercase font-semibold tracking-widest">Hệ thống Quản lý Thiết bị</p>
            </div>

            <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto custom-scrollbar">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setOpen(false)}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all group text-sm relative overflow-hidden cursor-pointer",
                                isActive
                                    ? "bg-blue-600/20 text-blue-300 font-bold shadow-[inset_0_0_20px_rgba(59,130,246,0.1)] border border-blue-500/20"
                                    : "text-slate-400 hover:bg-white/5 hover:text-white border border-transparent"
                            )}
                        >
                            {isActive && (
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-500 rounded-r-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                            )}
                            <item.icon className={cn("w-5 h-5 shrink-0 transition-all duration-300", isActive ? "text-blue-400 scale-110" : "text-slate-500 group-hover:text-blue-400 group-hover:scale-110")} />
                            <span className="relative z-10">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-slate-800/50 mt-auto bg-slate-900/50 backdrop-blur-sm">
                <Link href="/logout" className="flex items-center gap-3 px-4 py-3 w-full rounded-2xl text-slate-500 hover:bg-red-900/20 hover:text-red-400 transition-all text-sm font-bold group">
                    <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <span>Đăng xuất</span>
                </Link>
            </div>
        </>
    );

    return (
        <>
            {/* Mobile hamburger button */}
            <button
                onClick={() => setOpen(true)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-xl bg-slate-900 text-white shadow-lg shadow-slate-900/30"
                aria-label="Open menu"
            >
                <Menu className="w-5 h-5" />
            </button>

            {/* Mobile overlay */}
            {open && (
                <div
                    className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
                    onClick={() => setOpen(false)}
                />
            )}

            {/* Mobile drawer */}
            <aside
                className={cn(
                    "lg:hidden fixed inset-y-0 left-0 z-50 w-72 bg-slate-900 text-white flex flex-col transform transition-transform duration-300 ease-out",
                    open ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <button
                    onClick={() => setOpen(false)}
                    className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                >
                    <X className="w-5 h-5" />
                </button>
                {navContent}
            </aside>

            {/* Desktop sidebar */}
            <aside className="hidden lg:flex w-64 bg-slate-900/90 backdrop-blur-3xl text-white h-[calc(100vh-2rem)] fixed left-4 top-4 rounded-[2rem] flex-col border border-slate-800/50 shadow-2xl z-40">
                {navContent}
            </aside>
        </>
    );
}
