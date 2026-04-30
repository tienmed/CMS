'use client';

import { useState, useEffect } from 'react';
import {
    UserPlus,
    Key,
    Trash2,
    Search,
    X,
    ShieldCheck,
    Mail,
    RefreshCw,
    CheckCircle2,
    AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface User {
    id: number;
    username: string;
    name: string;
    email: string;
    department_id: number | null;
    created_at: string;
}

export default function UserManagementPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showResetModal, setShowResetModal] = useState<User | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState<User | null>(null);
    const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    // Form states
    const [formData, setFormData] = useState({
        username: '',
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [resetData, setResetData] = useState({
        password: '',
        confirmPassword: ''
    });

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/users');
            if (res.ok) {
                const data = await res.json();
                setUsers(data);
            }
        } catch (error) {
            console.error('Failed to fetch users:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            showNotification('error', 'Mật khẩu không khớp!');
            return;
        }

        try {
            const res = await fetch('/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                showNotification('success', 'Tạo tài khoản thành công!');
                setShowCreateModal(false);
                setFormData({ username: '', name: '', email: '', password: '', confirmPassword: '' });
                fetchUsers();
            } else {
                const err = await res.json();
                showNotification('error', err.error || 'Có lỗi xảy ra!');
            }
        } catch {
            showNotification('error', 'Lỗi kết nối!');
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!showResetModal) return;
        if (resetData.password !== resetData.confirmPassword) {
            showNotification('error', 'Mật khẩu không khớp!');
            return;
        }

        try {
            const res = await fetch(`/api/users/${showResetModal.id}/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password: resetData.password }),
            });

            if (res.ok) {
                showNotification('success', 'Cập nhật mật khẩu thành công!');
                setShowResetModal(null);
                setResetData({ password: '', confirmPassword: '' });
            } else {
                const err = await res.json();
                showNotification('error', err.error || 'Có lỗi xảy ra!');
            }
        } catch {
            showNotification('error', 'Lỗi kết nối!');
        }
    };

    const handleDeleteUser = async () => {
        if (!showDeleteModal) return;

        try {
            const res = await fetch(`/api/users/${showDeleteModal.id}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                showNotification('success', 'Xóa tài khoản thành công!');
                setShowDeleteModal(null);
                fetchUsers();
            } else {
                const err = await res.json();
                showNotification('error', err.error || 'Có lỗi xảy ra!');
            }
        } catch {
            showNotification('error', 'Lỗi kết nối!');
        }
    };

    const showNotification = (type: 'success' | 'error', message: string) => {
        setNotification({ type, message });
        setTimeout(() => setNotification(null), 3000);
    };

    const filteredUsers = users.filter(user =>
        user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex flex-col gap-10 h-full max-h-[calc(100vh-140px)] overflow-hidden font-sans animate-in fade-in duration-700">
            {/* Header section - Pro Max Style */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-10 shrink-0 border-b border-border-light dark:border-white/5 pb-10">
                <div>
                    <h1 className="headline-hero text-navy uppercase leading-none">Tài khoản</h1>
                    <p className="text-[11px] font-black text-gray-text mt-4 uppercase tracking-[0.3em] opacity-60">Access Control • System Governance</p>
                </div>

                <div className="flex items-end gap-5">
                    <div className="relative group w-full sm:w-80">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-text group-focus-within:text-brand-primary transition-colors duration-300" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm danh tính..."
                            className="bg-white dark:bg-white/5 border border-transparent rounded-2xl pl-16 pr-8 h-16 text-sm font-bold text-navy w-full focus:outline-none focus:ring-8 focus:ring-brand-primary/5 focus:border-brand-primary/20 transition-all shadow-sm placeholder:text-gray-text/30"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="bg-brand-primary text-white h-16 px-10 rounded-2xl text-sm font-black flex items-center gap-3 hover:scale-105 transition-all shadow-pro active:scale-95 shrink-0 uppercase tracking-widest group"
                    >
                        <UserPlus className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                        <span className="hidden sm:inline">Add Personnel</span>
                    </button>
                </div>
            </div>

            {notification && (
                <div className={cn(
                    "fixed bottom-8 right-8 z-50 flex items-center gap-4 px-8 py-5 rounded-3xl border shadow-2xl animate-in fade-in slide-in-from-bottom-6 duration-500",
                    notification.type === 'success' ? "bg-emerald-600 text-white border-emerald-500 shadow-emerald-100" : "bg-red-600 text-white border-red-500 shadow-red-100"
                )}>
                    {notification.type === 'success' ? <CheckCircle2 className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
                    <span className="font-black text-sm uppercase tracking-widest">{notification.message}</span>
                </div>
            )}

            {/* Users Table - Bento Style */}
            <div className="bento-card !p-0 flex flex-col min-h-0 overflow-hidden">
                <div className="md:hidden p-4 space-y-3">
                    {loading ? (
                        Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="h-28 rounded-2xl bg-slate-100 animate-pulse" />
                        ))
                    ) : filteredUsers.length === 0 ? (
                        <div className="rounded-2xl border border-slate-200 p-8 text-center text-xs font-black uppercase tracking-widest text-slate-400">Không có dữ liệu phù hợp</div>
                    ) : filteredUsers.map((user) => (
                        <div key={user.id} className="rounded-2xl border border-slate-200 p-4 bg-white shadow-sm space-y-3">
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <p className="font-black text-slate-900">{user.name}</p>
                                    <p className="text-xs font-bold text-slate-600 mt-1">@{user.username}</p>
                                    <p className="text-xs text-slate-500 mt-1 break-all">{user.email || 'no-email@cecics.vn'}</p>
                                </div>
                                <span className="text-[10px] font-black uppercase px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">{user.department_id ? `DEP-${user.department_id}` : 'ROOT'}</span>
                            </div>
                            <p className="text-[11px] text-slate-500 font-bold">Ngày tạo: {new Date(user.created_at).toLocaleDateString('vi-VN')}</p>
                            <div className="flex gap-2 pt-1">
                                <button onClick={() => setShowResetModal(user)} className="flex-1 h-10 rounded-xl bg-amber-50 text-amber-700 text-xs font-black">Đặt lại mật khẩu</button>
                                <button onClick={() => setShowDeleteModal(user)} disabled={user.username === 'super_admin'} className={cn("flex-1 h-10 rounded-xl text-xs font-black", user.username === 'super_admin' ? "bg-slate-100 text-slate-400" : "bg-red-50 text-red-600")}>Xóa</button>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="hidden md:block flex-1 overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse">
                        <thead className="sticky top-0 z-10 bg-background/50 dark:bg-black/50 backdrop-blur-md text-[11px] uppercase font-black text-gray-text tracking-[0.3em]">
                            <tr>
                                <th className="px-10 py-8 border-b border-border-light dark:border-white/5">Identity Matrix</th>
                                <th className="px-10 py-8 border-b border-border-light">Full Legal Name</th>
                                <th className="px-10 py-8 border-b border-border-light">Org Unit</th>
                                <th className="px-10 py-8 border-b border-border-light">Registration Date</th>
                                <th className="px-10 py-8 text-right border-b border-border-light">Governance</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-light dark:divide-white/5">
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={5} className="px-10 py-12 bg-slate-50/20" />
                                    </tr>
                                ))
                            ) : filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-10 py-32 text-center">
                                        <div className="flex flex-col items-center">
                                            <Search className="w-16 h-16 text-slate-100 mb-8" />
                                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">Zero Identities Detected</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredUsers.map((user) => (
                                <tr key={user.id} className="group hover:bg-slate-50/30 dark:hover:bg-white/5 transition-all duration-300">
                                    <td className="px-10 py-10">
                                        <div className="flex items-center gap-6">
                                            <div className="w-16 h-16 rounded-[1.5rem] bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-brand-primary font-black text-lg border border-indigo-100 dark:border-indigo-800/30 group-hover:bg-brand-primary group-hover:text-white group-hover:scale-110 transition-all duration-500 shadow-sm">
                                                {user.username.slice(0, 2).toUpperCase()}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-lg font-black text-navy tracking-tight group-hover:text-brand-primary transition-colors">{user.username}</span>
                                                <span className="text-[11px] font-black text-gray-text opacity-40 flex items-center gap-2 mt-2 uppercase tracking-tighter">
                                                    <Mail className="w-3 h-3" /> {user.email || 'no-email@cecics.vn'}
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-10 text-base font-black text-navy opacity-80">
                                        {user.name}
                                    </td>
                                    <td className="px-10 py-10">
                                        <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-500 text-[10px] font-black uppercase tracking-widest border border-indigo-100 dark:border-indigo-800 shadow-sm">
                                            <ShieldCheck className="w-4 h-4" />
                                            {user.department_id ? `DEP-${user.department_id}` : 'ROOT / UNASSIGNED'}
                                        </div>
                                    </td>
                                    <td className="px-10 py-10 text-xs text-gray-text font-black uppercase tracking-widest opacity-60">
                                        {new Date(user.created_at).toLocaleDateString('vi-VN')}
                                    </td>
                                    <td className="px-10 py-10 text-right space-x-3">
                                        <button
                                            onClick={() => setShowResetModal(user)}
                                            className="h-12 w-12 rounded-2xl text-slate-300 hover:bg-amber-50 hover:text-amber-500 hover:border-amber-100 transition-all shadow-sm bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 inline-flex items-center justify-center"
                                            title="Khôi phục mật khẩu"
                                        >
                                            <Key className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => setShowDeleteModal(user)}
                                            disabled={user.username === 'super_admin'}
                                            className={cn(
                                                "h-12 w-12 rounded-2xl transition-all shadow-sm bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 inline-flex items-center justify-center",
                                                user.username === 'super_admin'
                                                    ? "opacity-20 cursor-not-allowed"
                                                    : "text-slate-300 hover:bg-red-50 hover:text-red-500 hover:border-red-100"
                                            )}
                                            title={user.username === 'super_admin' ? "Hệ thống bảo vệ" : "Xóa tài khoản"}
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 sm:p-4">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={() => setShowCreateModal(false)} />
                    <div className="bg-white rounded-[3rem] w-full max-w-lg p-10 relative shadow-[0_20px_70px_rgba(0,0,0,0.1)] animate-in zoom-in duration-500 border border-slate-50">
                        <button onClick={() => setShowCreateModal(false)} className="absolute top-8 right-8 p-3 rounded-2xl text-slate-300 hover:bg-slate-50 transition-all">
                            <X className="w-6 h-6" />
                        </button>

                        <div className="mb-10">
                            <div className="w-16 h-16 rounded-[1.5rem] bg-brand-primary text-white flex items-center justify-center shadow-2xl shadow-blue-100 mb-6">
                                <UserPlus className="w-8 h-8" />
                            </div>
                            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Thêm tài khoản</h2>
                            <p className="text-sm font-bold text-slate-400 mt-1 uppercase tracking-widest leading-relaxed">Cấp quyền truy cập cho nhân viên mới</p>
                        </div>

                        <form onSubmit={handleCreateUser} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] pl-1">Username</label>
                                    <input
                                        required
                                        type="text"
                                        className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-transparent focus:bg-white focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/5 transition-all text-sm font-bold"
                                        placeholder="Tên đăng nhập"
                                        value={formData.username}
                                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] pl-1">Họ và tên</label>
                                    <input
                                        required
                                        type="text"
                                        className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-transparent focus:bg-white focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/5 transition-all text-sm font-bold"
                                        placeholder="Nguyễn Văn A"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] pl-1">Email liên hệ</label>
                                <input
                                    required
                                    type="email"
                                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-transparent focus:bg-white focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/5 transition-all text-sm font-bold"
                                    placeholder="email@cecics.vn"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] pl-1">Mật khẩu</label>
                                    <input
                                        required
                                        type="password"
                                        className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-transparent focus:bg-white focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/5 transition-all text-sm font-bold"
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] pl-1">Xác nhận</label>
                                    <input
                                        required
                                        type="password"
                                        className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-transparent focus:bg-white focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/5 transition-all text-sm font-bold"
                                        placeholder="••••••••"
                                        value={formData.confirmPassword}
                                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    />
                                </div>
                            </div>
                            <button type="submit" className="w-full bg-brand-primary text-white py-5 rounded-[1.5rem] font-black text-sm shadow-2xl shadow-blue-100 hover:bg-blue-700 transition-all active:scale-[0.98] mt-6 uppercase tracking-widest">
                                Tạo tài khoản hệ thống
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Reset Modal */}
            {showResetModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 sm:p-4">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={() => setShowResetModal(null)} />
                    <div className="bg-white rounded-[3rem] w-full max-w-md p-10 relative shadow-2xl animate-in zoom-in duration-500 border border-slate-50">
                        <button onClick={() => setShowResetModal(null)} className="absolute top-8 right-8 p-3 rounded-2xl text-slate-300 hover:bg-slate-50 transition-all">
                            <X className="w-6 h-6" />
                        </button>

                        <div className="mb-10">
                            <div className="w-16 h-16 rounded-[1.5rem] bg-amber-500 text-white flex items-center justify-center shadow-2xl shadow-amber-100 mb-6">
                                <RefreshCw className="w-8 h-8" />
                            </div>
                            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Cấp lại mật khẩu</h2>
                            <p className="text-sm font-bold text-slate-400 mt-1 uppercase tracking-widest">Tài khoản: {showResetModal.username}</p>
                        </div>

                        <form onSubmit={handleResetPassword} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] pl-1">Mật khẩu mới</label>
                                <input
                                    required
                                    type="password"
                                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-transparent focus:bg-white focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/5 transition-all text-sm font-bold"
                                    placeholder="••••••••"
                                    value={resetData.password}
                                    onChange={(e) => setResetData({ ...resetData, password: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] pl-1">Xác nhận mật khẩu</label>
                                <input
                                    required
                                    type="password"
                                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-transparent focus:bg-white focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/5 transition-all text-sm font-bold"
                                    placeholder="••••••••"
                                    value={resetData.confirmPassword}
                                    onChange={(e) => setResetData({ ...resetData, confirmPassword: e.target.value })}
                                />
                            </div>
                            <button type="submit" className="w-full bg-amber-500 text-white py-5 rounded-[1.5rem] font-black text-sm shadow-2xl shadow-amber-100 hover:bg-amber-600 transition-all active:scale-[0.98] mt-6 uppercase tracking-widest text-shadow">
                                Cập nhật ngay
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 sm:p-4">
                    <div className="absolute inset-0 bg-red-950/20 backdrop-blur-md" onClick={() => setShowDeleteModal(null)} />
                    <div className="bg-white rounded-[3rem] w-full max-w-md p-12 relative shadow-2xl animate-in zoom-in duration-500 border border-red-50 text-center">
                        <div className="w-24 h-24 rounded-full bg-red-50 flex items-center justify-center text-red-500 mx-auto mb-8 border-8 border-white shadow-xl shadow-red-100/50">
                            <Trash2 className="w-10 h-10" />
                        </div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Xóa tài khoản?</h2>
                        <p className="text-sm font-bold text-slate-400 mt-4 leading-relaxed px-4">
                            Hành động này sẽ xóa vĩnh viễn quyền truy cập của <span className="text-red-600 font-black">{showDeleteModal.username}</span>. Bạn chắc chắn chứ?
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 mt-10">
                            <button
                                onClick={() => setShowDeleteModal(null)}
                                className="flex-1 px-8 py-5 rounded-2xl font-black text-sm text-slate-400 hover:bg-slate-50 transition-all uppercase tracking-widest order-2 sm:order-1"
                            >
                                Hủy bỏ
                            </button>
                            <button
                                onClick={handleDeleteUser}
                                className="flex-1 bg-red-600 text-white px-8 py-5 rounded-2xl font-black text-sm shadow-2xl shadow-red-200 hover:bg-red-700 transition-all active:scale-95 uppercase tracking-widest order-1 sm:order-2"
                            >
                                Xóa vĩnh viễn
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
