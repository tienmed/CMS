import { loginAction } from '@/app/actions/auth';
import { ShieldCheck } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function LoginPage({
    searchParams,
}: {
    searchParams: Promise<{ error?: string; msg?: string }>;
}) {
    const { error, msg } = await searchParams;
    let errorMessage = '';

    if (error === 'invalid_credentials') {
        errorMessage = 'Sai tài khoản hoặc mật khẩu.';
    } else if (error === 'missing_credentials') {
        errorMessage = 'Vui lòng nhập tài khoản và mật khẩu.';
    } else if (error === 'server_error') {
        errorMessage = `Lỗi hệ thống: ${msg ? decodeURIComponent(msg) : 'Vui lòng kiểm tra kết nối CSDL.'}`;
        if (errorMessage.includes('ECONNREFUSED') || errorMessage.includes('ETIMEDOUT') || errorMessage.includes('ENOTFOUND')) {
            errorMessage = 'Không thể kết nối đến cơ sở dữ liệu. Vui lòng kiểm tra biến môi trường hoặc cấu hình mạng trên Vercel.';
        }
    }

    return (
        <div className="min-h-screen bg-background flex flex-col md:flex-row items-center justify-center p-6 relative overflow-hidden">
            {/* Background design elements */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-brand-primary/5 -skew-x-12 transform translate-x-1/2" />

            <div className="w-full max-w-md bg-white rounded-[2.5rem] p-10 shadow-soft relative z-10 border border-slate-50">
                <div className="mb-10 text-center md:text-left">
                    <div className="inline-flex items-center gap-3 mb-6">
                        <div className="p-3 rounded-2xl bg-brand-primary text-white shadow-lg shadow-blue-200">
                            <ShieldCheck className="w-7 h-7" />
                        </div>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tighter uppercase italic">CECICS <span className="text-brand-primary">CMS</span></h1>
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Chào mừng trở lại</h2>
                    <p className="text-sm font-bold text-slate-400">Đăng nhập để quản lý thiết bị y tế</p>
                </div>

                {errorMessage && (
                    <div className="mb-6 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-bold text-red-600 animate-in slide-in-from-top-2 duration-300">
                        {errorMessage}
                    </div>
                )}

                <form action={loginAction} className="space-y-6">
                    <div className="space-y-2">
                        <label htmlFor="username" className="block text-xs font-black uppercase tracking-[0.2em] text-slate-400 ml-1">
                            Tài khoản
                        </label>
                        <input
                            id="username"
                            name="username"
                            type="text"
                            required
                            placeholder="Nhập username"
                            className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:outline-none focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary focus:bg-white transition-all text-sm font-bold placeholder:text-slate-300"
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="password" className="block text-xs font-black uppercase tracking-[0.2em] text-slate-400 ml-1">
                            Mật khẩu
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            placeholder="••••••••"
                            className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:outline-none focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary focus:bg-white transition-all text-sm font-bold placeholder:text-slate-300"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-brand-primary hover:bg-blue-700 text-white py-4 rounded-2xl text-sm font-black shadow-xl shadow-blue-100 transition-all active:scale-[0.98] mt-4 uppercase tracking-widest"
                    >
                        Đăng nhập ngay
                    </button>

                    <p className="text-center text-[10px] font-bold text-slate-300 uppercase tracking-widest pt-4">
                        Thiết kế bởi Horizon UI Architecture
                    </p>
                </form>
            </div>

            {/* Footer info */}
            <div className="absolute bottom-10 text-center w-full md:w-auto">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.3em]">
                    &copy; 2024 CECICS MEDICAL CENTER
                </p>
            </div>
        </div>
    );
}
