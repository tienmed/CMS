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
  Users,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { AuthUser } from '@/lib/auth';

const menuItems = [
  { name: 'Tổng quan', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Kho thiết bị', href: '/dashboard/equipment', icon: Package },
  { name: 'Mượn / trả', href: '/dashboard/rental', icon: ClipboardList },
  { name: 'Tra cứu QR', href: '/dashboard/qr', icon: QrCode },
  { name: 'Lịch sử sử dụng', href: '/dashboard/history', icon: History },
  { name: 'Báo cáo', href: '/dashboard/reports', icon: BarChart3 },
];

export function Sidebar({ user }: { user: AuthUser | null }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const navContent = (
    <>
      <div className="sidebar-brand">
        <p className="sidebar-brand-title">CECICS CMS</p>
        <p className="sidebar-brand-subtitle">Quản lý mượn trả thiết bị</p>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={cn('sidebar-link', isActive && 'sidebar-link-active')}
            >
              <item.icon className="w-4 h-4 shrink-0" />
              <span>{item.name}</span>
            </Link>
          );
        })}

        {user?.username === 'super_admin' && (
          <div className="sidebar-admin-group">
            <p className="sidebar-admin-label">Quản trị</p>
            <Link
              href="/dashboard/users"
              onClick={() => setOpen(false)}
              className={cn('sidebar-link', pathname.startsWith('/dashboard/users') && 'sidebar-link-active')}
            >
              <Users className="w-4 h-4" />
              <span>Quản lý tài khoản</span>
            </Link>
          </div>
        )}
      </nav>

      <div className="sidebar-footer">
        <Link href="/logout" className="sidebar-link">
          <LogOut className="w-4 h-4" />
          <span>Đăng xuất</span>
        </Link>
      </div>
    </>
  );

  return (
    <>
      <button onClick={() => setOpen(true)} className="sidebar-mobile-trigger" aria-label="Mở menu">
        <Menu className="w-5 h-5" />
      </button>

      {open && <div className="sidebar-mobile-overlay" onClick={() => setOpen(false)} />}

      <aside className={cn('sidebar-mobile-drawer', open ? 'sidebar-mobile-open' : 'sidebar-mobile-closed')}>
        <button onClick={() => setOpen(false)} className="sidebar-mobile-close">
          <X className="w-5 h-5" />
        </button>
        {navContent}
      </aside>

      <aside className="sidebar-desktop">{navContent}</aside>
    </>
  );
}
