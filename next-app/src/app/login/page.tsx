import { loginAction } from '@/app/actions/auth';
import { ShieldCheck } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function LoginPage({
    searchParams,
}: {
    searchParams: Promise<{ error?: string }>;
}) {
    const { error } = await searchParams;
    const errorMessage = error === 'invalid_credentials'
        ? 'Sai tài khoản hoặc mật khẩu.'
        : error === 'missing_credentials'
            ? 'Vui lòng nhập tài khoản và mật khẩu.'
            : '';

    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
            <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-xl p-8">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 rounded-2xl bg-blue-600 text-white">
                        <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-xl font-black text-slate-900">Đăng nhập CECICS CMS</h1>
                        <p className="text-xs text-slate-500 mt-1">Sử dụng username và password</p>
                    </div>
                </div>

                {errorMessage && (
                    <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                        {errorMessage}
                    </div>
                )}

                <form action={loginAction} className="space-y-4">
                    <div>
                        <label htmlFor="username" className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                            Username
                        </label>
                        <input
                            id="username"
                            name="username"
                            type="text"
                            required
                            placeholder="Nhập username"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                            Mật khẩu
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl text-sm font-bold transition-colors"
                    >
                        Đăng nhập
                    </button>
                </form>
            </div>
        </div>
    );
}
