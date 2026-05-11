'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Bell, Clock, AlertTriangle, X } from 'lucide-react';
import { Notification } from '@/services/NotificationService';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function NotificationBell() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const fetchNotifications = async () => {
        try {
            const res = await fetch('/api/notifications/check');
            const data = await res.json();
            if (data.success) {
                setNotifications(data.data.notifications);
            }
        } catch (error) {
            console.error('Failed to fetch notifications', error);
        }
    };

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 60000); // Check every minute
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-xl hover:bg-slate-100 transition-colors group"
            >
                <Bell className={cn(
                    "w-5 h-5 transition-transform",
                    notifications.length > 0 ? "text-red-500 animate-[bell-swing_2s_infinite]" : "text-slate-400 group-hover:scale-110"
                )} />
                {notifications.length > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-red-600 text-white text-[10px] font-black flex items-center justify-center rounded-full border-2 border-white">
                        {notifications.length}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-[100] animate-in fade-in zoom-in-95 duration-200">
                    <div className="p-4 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between">
                        <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest">Thông báo hệ thống</h4>
                        <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600">
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="max-h-96 overflow-y-auto custom-scrollbar">
                        {notifications.length > 0 ? (
                            notifications.map((n) => (
                                <Link 
                                    key={n.id} 
                                    href={n.type === 'overdue' ? `/dashboard/rental?ticket=${n.data?.ticketId}` : '#'}
                                    className="block p-4 hover:bg-slate-50 border-b border-slate-50 transition-colors"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <div className="flex gap-3">
                                        <div className={cn(
                                            "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                                            n.type === 'overdue' ? "bg-red-50 text-red-500" : "bg-blue-50 text-blue-500"
                                        )}>
                                            {n.type === 'overdue' ? <Clock className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-xs font-bold text-slate-800">{n.title}</p>
                                            <p className="text-[11px] text-slate-500 leading-relaxed">{n.message}</p>
                                            <p className="text-[9px] font-bold text-slate-300 uppercase">{new Date(n.timestamp).toLocaleDateString('vi-VN')}</p>
                                        </div>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <div className="p-12 text-center">
                                <Bell className="w-8 h-8 text-slate-200 mx-auto mb-3" />
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Không có thông báo mới</p>
                            </div>
                        )}
                    </div>
                    
                    {notifications.length > 0 && (
                        <div className="p-3 bg-slate-50 text-center">
                            <button className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-blue-600 transition-colors">
                                Đánh dấu tất cả đã đọc
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
