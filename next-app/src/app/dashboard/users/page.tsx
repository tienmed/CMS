'use client';

import { useState, useEffect } from 'react';
import {
    Users,
    UserPlus,
    Key,
    Trash2,
    Search,
    X,
    ShieldCheck,
    Mail,
    Building2,
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

    useEffect(() => {
        fetchUsers();
    }, []);

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
        } catch (error) {
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
        } catch (error) {
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
        } catch (error) {
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
        <div className="flex flex-col gap-6 h-full max-h-[calc(100vh-140px)] overflow-hidden font-sans">
            {/* Header section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 flex items-center justify-center text-indigo-600 shadow-sm border border-indigo-100">
                        <Users className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-slate-800 tracking-tight">Quản lý Tài khoản</h1>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">Hệ thống Quản trị CECICS</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm tài khoản..."
                            className="bg-white/70 backdrop-blur-md border border-white/40 rounded-2xl pl-11 pr-6 py-3 text-sm font-medium text-slate-700 w-full sm:w-64 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="bg-indigo-600 text-white px-6 py-3 rounded-2xl text-sm font-black flex items-center gap-2 hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all active:scale-95 shrink-0"
                    >
                        <UserPlus className="w-4 h-4" />
                        <span className="hidden sm:inline">Thêm tài khoản</span>
                    </button>
                </div>
            </div>

            {notification && (
                <div className={cn(
                    "fixed bottom-8 right-8 z-50 flex items-center gap-3 px-6 py-4 rounded-2xl border shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-300",
                    notification.type === 'success' ? "bg-emerald-600 text-white border-emerald-500" : "bg-red-600 text-white border-red-500"
                )}>
                    {notification.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                    <span className="font-bold text-sm">{notification.message}</span>
                </div>
            )}

            {/* Users Table */}
            <div className="bg-white/70 backdrop-blur-xl rounded-[2.5rem] border border-white/50 shadow-sm flex flex-col min-h-0 overflow-hidden">
                <div className="flex-1 overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse">
                        <thead className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-100/50 text-[10px] uppercase font-black text-slate-400 tracking-widest">
                            <tr>
                                <th className="px-8 py-5">Tài khoản</th>
                                <th className="px-6 py-5">Họ và tên</th>
                                <th className="px-6 py-5">Phòng ban</th>
                                <th className="px-6 py-5">Ngày tạo</th>
                                <th className="px-8 py-5 text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100/50">
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={5} className="px-8 py-6 h-20 bg-slate-50/50 first:rounded-t-lg last:rounded-b-lg mb-2" />
                                    </tr>
                                ))
                            ) : filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-20 text-center text-slate-400 font-bold">
                                        Không tìm thấy tài khoản nào
                                    </td>
                                </tr>
                            ) : filteredUsers.map((user) => (
                                <tr key={user.id} className="group hover:bg-white/50 transition-colors">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 font-bold group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                                {user.username.slice(0, 2).toUpperCase()}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-black text-slate-800">{user.username}</span>
                                                <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                                                    <Mail className="w-2 h-2" /> {user.email || 'N/A'}
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-sm font-bold text-slate-600">
                                        {user.name}
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-wider">
                                            <Building2 className="w-3 h-3" />
                                            {user.department_id ? `Phòng ${user.department_id}` : 'N/A'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-xs text-slate-400 font-bold">
                                        {new Date(user.created_at).toLocaleDateString('vi-VN')}
                                    </td>
                                    <td className="px-8 py-5 text-right space-x-2">
                                        <button
                                            onClick={() => setShowResetModal(user)}
                                            className="p-2.5 rounded-xl text-slate-400 hover:bg-amber-100 hover:text-amber-600 transition-all relative group"
                                            title="Khôi phục mật khẩu"
                                        >
                                            <Key className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => setShowDeleteModal(user)}
                                            disabled={user.username === 'super_admin'}
                                            className={cn(
                                                "p-2.5 rounded-xl transition-all",
                                                user.username === 'super_admin'
                                                    ? "text-slate-200 cursor-not-allowed"
                                                    : "text-slate-400 hover:bg-red-100 hover:text-red-600"
                                            )}
                                            title={user.username === 'super_admin' ? "Không thể xóa tài khoản root" : "Xóa tài khoản"}
                                        >
                                            <Trash2 className="w-4 h-4" />
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
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowCreateModal(false)} />
                    <div className="bg-white rounded-[2.5rem] w-full max-w-md p-8 relative shadow-2xl animate-in zoom-in duration-300">
                        <button onClick={() => setShowCreateModal(false)} className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:bg-slate-100 transition-all">
                            <X className="w-5 h-5" />
                        </button>

                        <div className="mb-8">
                            <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-100 mb-4">
                                <UserPlus className="w-7 h-7" />
                            </div>
                            <h2 className="text-2xl font-black text-slate-800 tracking-tight">Thêm tài khoản mới</h2>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Cấp quyền truy cập hệ thống</p>
                        </div>

                        <form onSubmit={handleCreateUser} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Tên tài khoản</label>
                                <input
                                    required
                                    type="text"
                                    className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all text-sm font-bold"
                                    placeholder="Ví dụ: admin_tech"
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Họ và tên</label>
                                <input
                                    required
                                    type="text"
                                    className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all text-sm font-bold"
                                    placeholder="Nguyễn Văn A"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Mật khẩu</label>
                                    <input
                                        required
                                        type="password"
                                        className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all text-sm font-bold"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Xác nhận</label>
                                    <input
                                        required
                                        type="password"
                                        className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all text-sm font-bold"
                                        value={formData.confirmPassword}
                                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    />
                                </div>
                            </div>
                            <button type="submit" className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-sm shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95 mt-4">
                                Tạo tài khoản
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Reset Modal */}
            {showResetModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowResetModal(null)} />
                    <div className="bg-white rounded-[2.5rem] w-full max-w-sm p-8 relative shadow-2xl animate-in zoom-in duration-300">
                        <button onClick={() => setShowResetModal(null)} className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:bg-slate-100 transition-all">
                            <X className="w-5 h-5" />
                        </button>

                        <div className="mb-8">
                            <div className="w-14 h-14 rounded-2xl bg-amber-500 flex items-center justify-center text-white shadow-lg shadow-amber-100 mb-4">
                                <RefreshCw className="w-7 h-7" />
                            </div>
                            <h2 className="text-2xl font-black text-slate-800 tracking-tight">Khôi phục mật khẩu</h2>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Cho tài khoản: {showResetModal.username}</p>
                        </div>

                        <form onSubmit={handleResetPassword} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Mật khẩu mới</label>
                                <input
                                    required
                                    type="password"
                                    className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:outline-none focus:ring-4 focus:ring-amber-500/10 transition-all text-sm font-bold"
                                    value={resetData.password}
                                    onChange={(e) => setResetData({ ...resetData, password: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Xác nhận</label>
                                <input
                                    required
                                    type="password"
                                    className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:outline-none focus:ring-4 focus:ring-amber-500/10 transition-all text-sm font-bold"
                                    value={resetData.confirmPassword}
                                    onChange={(e) => setResetData({ ...resetData, confirmPassword: e.target.value })}
                                />
                            </div>
                            <button type="submit" className="w-full bg-amber-500 text-white py-4 rounded-2xl font-black text-sm shadow-lg shadow-amber-100 hover:bg-amber-600 transition-all active:scale-95 mt-4">
                                Cập nhật mật khẩu
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowDeleteModal(null)} />
                    <div className="bg-white rounded-[2.5rem] w-full max-w-sm p-8 relative shadow-2xl animate-in zoom-in duration-300 border border-red-100">
                        <div className="mb-8 text-center">
                            <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center text-red-600 mx-auto mb-6 border-4 border-red-100/50">
                                <Trash2 className="w-10 h-10" />
                            </div>
                            <h2 className="text-2xl font-black text-slate-800 tracking-tight">Xác nhận xóa?</h2>
                            <p className="text-sm font-medium text-slate-400 mt-2">
                                Bạn có chắc chắn muốn xóa tài khoản <span className="text-slate-900 font-black">{showDeleteModal.username}</span>? Hành động này không thể hoàn tác.
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowDeleteModal(null)}
                                className="flex-1 px-6 py-4 rounded-2xl font-black text-sm text-slate-500 hover:bg-slate-100 transition-all"
                            >
                                Hủy bỏ
                            </button>
                            <button
                                onClick={handleDeleteUser}
                                className="flex-1 bg-red-600 text-white px-6 py-4 rounded-2xl font-black text-sm shadow-lg shadow-red-100 hover:bg-red-700 transition-all active:scale-95"
                            >
                                Xóa ngay
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
