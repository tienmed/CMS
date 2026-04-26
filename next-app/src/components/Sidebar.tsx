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
    X
} from 'lucide-react';
import { cn } from '@/lib/utils';

const menuItems = [
    { name: 'Tổng quan', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Kho thiết bị', href: '/dashboard/equipment', icon: Package },
    { name: 'Mượn / Trả', href: '/dashboard/rental', icon: ClipboardList },
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
                <p className="text-[10px] text-slate-400 mt-1 uppercase font-semibold tracking-widest">Equipment Management</p>
            </div>

            <nav className="flex-1 px-3 py-2 space-y-0.5">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setOpen(false)}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group text-sm",
                                isActive
                                    ? "bg-blue-600/20 text-blue-300 font-semibold"
                                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                            )}
                        >
                            <item.icon className={cn("w-5 h-5 shrink-0", isActive ? "text-blue-400" : "text-slate-500 group-hover:text-blue-400")} />
                            <span>{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-3 border-t border-slate-800">
                <button className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-slate-500 hover:bg-red-900/20 hover:text-red-400 transition-colors text-sm">
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Đăng xuất</span>
                </button>
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
            <aside className="hidden lg:flex w-64 bg-slate-900 text-white h-screen fixed left-0 top-0 flex-col border-r border-slate-800">
                {navContent}
            </aside>
        </>
    );
}
