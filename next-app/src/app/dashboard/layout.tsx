import { Sidebar } from '@/components/Sidebar';
import NotificationBell from '@/components/layout/NotificationBell';
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
    <div className="dashboard-shell">
      <Sidebar user={user} />
      <main className="dashboard-main">
        <header className="dashboard-header">
          <div className="dashboard-header-inner">
            <div className="flex items-center gap-4 ml-auto">
              <NotificationBell />
              <div className="dashboard-header-user">
                <p className="dashboard-header-user-name">Xin chào, {user?.name || user?.username || 'Người dùng'}</p>
                <p className="dashboard-header-user-sub">Hệ thống quản lý thiết bị</p>
              </div>
              <div className="dashboard-header-avatar">
                {(user?.name || user?.username || 'U').slice(0, 1).toUpperCase()}
              </div>
            </div>
          </div>
        </header>
        <div className="dashboard-content">{children}</div>
      </main>
    </div>
  );
}
