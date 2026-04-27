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
    QrCode,
    Users
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { AuthUser } from '@/lib/auth';

const menuItems = [
    { name: 'Tổng quan', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Kho thiết bị', href: '/dashboard/equipment', icon: Package },
    { name: 'Mượn / Trả', href: '/dashboard/rental', icon: ClipboardList },
    { name: 'Tra cứu QR', href: '/dashboard/qr', icon: QrCode },
    { name: 'Lịch sử sử dụng', href: '/dashboard/history', icon: History },
    { name: 'Báo cáo', href: '/dashboard/reports', icon: BarChart3 },
];

const adminMenuItems = [
    { name: 'Quản lý tài khoản', href: '/dashboard/users', icon: Users },
];

export function Sidebar({ user }: { user: AuthUser | null }) {
    const [open, setOpen] = useState(false);
    const pathname = usePathname();

    const navContent = (
        <>
            <div className="px-8 py-10">
                <div className="flex items-center gap-4 mb-2 group">
                    <div className="w-12 h-12 rounded-2xl brand-gradient-bg flex items-center justify-center text-white font-black text-2xl shadow-pro group-hover:scale-110 transition-all duration-500">C</div>
                    <h1 className="text-2xl font-black tracking-tight text-navy">CECICS <span className="font-medium text-gray-text opacity-40">CMS</span></h1>
                </div>
            </div>

            <nav className="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setOpen(false)}
                            className={cn(
                                "flex items-center gap-4 px-6 py-4 rounded-2xl transition-all group text-sm relative overflow-hidden",
                                isActive
                                    ? "brand-soft-surface text-navy font-black"
                                    : "text-gray-text font-bold hover:text-navy hover:bg-background/50"
                            )}
                        >
                            <item.icon className={cn("w-5 h-5 shrink-0 transition-all duration-300", isActive ? "text-brand-primary" : "text-gray-text group-hover:text-navy")} />
                            <span className="tracking-wide">{item.name}</span>
                            {isActive && (
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 sidebar-active-indicator rounded-r-full" />
                            )}
                        </Link>
                    );
                })}

                {user?.username === 'super_admin' && (
                    <div className="pt-8 mt-8 border-t border-border-light">
                        <p className="px-6 mb-4 text-[10px] font-black text-gray-text uppercase tracking-[0.3em]">Operational Node</p>
                        {adminMenuItems.map((item) => {
                            const isActive = pathname === item.href || pathname.startsWith(item.href);
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setOpen(false)}
                                    className={cn(
                                        "flex items-center gap-4 px-6 py-4 rounded-2xl transition-all group text-sm relative overflow-hidden",
                                        isActive
                                            ? "brand-soft-surface text-navy font-black"
                                            : "text-gray-text font-bold hover:text-navy hover:bg-background/50"
                                    )}
                                >
                                    <item.icon className={cn("w-5 h-5 shrink-0 transition-all duration-300", isActive ? "text-brand-primary" : "text-gray-text group-hover:text-navy")} />
                                    <span className="tracking-wide">{item.name}</span>
                                    {isActive && (
                                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 sidebar-active-indicator rounded-r-full" />
                                    )}
                                </Link>
                            );
                        })}
                    </div>
                )}
            </nav>

            <div className="p-8">
                <Link href="/logout" className="flex items-center gap-4 px-8 py-5 w-full rounded-[1.5rem] text-gray-text hover:bg-red-50 hover:text-red-500 transition-all text-[10px] font-black uppercase tracking-[0.2em] group border border-transparent hover:border-red-100">
                    <LogOut className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    <span>Deactivate Session</span>
                </Link>
            </div>
        </>
    );

    return (
        <>
            {/* Mobile hamburger button */}
            <button
                onClick={() => setOpen(true)}
                className="lg:hidden fixed top-6 right-6 z-50 p-3 rounded-2xl bg-white text-slate-900 shadow-soft border border-slate-100"
                aria-label="Open menu"
            >
                <Menu className="w-5 h-5" />
            </button>

            {/* Mobile overlay */}
            {open && (
                <div
                    className="lg:hidden fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm"
                    onClick={() => setOpen(false)}
                />
            )}

            {/* Mobile drawer */}
            <aside
                className={cn(
                    "lg:hidden fixed inset-y-0 left-0 z-50 w-72 bg-white text-slate-900 flex flex-col transform transition-transform duration-300 ease-out",
                    open ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <button
                    onClick={() => setOpen(false)}
                    className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100"
                >
                    <X className="w-5 h-5" />
                </button>
                {navContent}
            </aside>

            {/* Desktop sidebar */}
            <aside className="hidden lg:flex w-72 bg-white h-screen fixed left-0 top-0 flex-col border-r border-border-light z-40">
                {navContent}
            </aside>
        </>
    );
}
