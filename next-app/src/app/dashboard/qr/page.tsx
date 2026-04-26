import Link from 'next/link';
import { Search, QrCode, ArrowRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function QrLookupPage({
    searchParams,
}: {
    searchParams: { code?: string };
}) {
    const code = (searchParams.code || '').trim().toUpperCase();

    return (
        <div className="max-w-3xl space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Tra cứu QR mẫu vật</h1>
                <p className="text-sm text-slate-500 mt-1">
                    Nhập mã <span className="font-mono">barcode_stt</span> để mở chi tiết 1 mẫu vật theo QR.
                </p>
            </div>

            <form method="GET" className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <label htmlFor="code" className="text-xs font-bold text-slate-500 uppercase tracking-wider">Mã QR / barcode_stt</label>
                <div className="mt-2 flex gap-2">
                    <div className="relative flex-1">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            id="code"
                            name="code"
                            defaultValue={code}
                            placeholder="Ví dụ: MHH0421102-01"
                            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        />
                    </div>
                    <button
                        type="submit"
                        className="px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                        <QrCode className="w-4 h-4" />
                        Tra cứu
                    </button>
                </div>
            </form>

            {code && (
                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-center justify-between">
                    <div>
                        <p className="text-xs text-blue-700 font-bold uppercase tracking-wider">Kết quả nhanh</p>
                        <p className="font-mono font-semibold text-blue-900">{code}</p>
                    </div>
                    <Link
                        href={`/dashboard/qr/${encodeURIComponent(code)}`}
                        className="px-3 py-2 rounded-xl bg-white text-blue-700 border border-blue-200 hover:bg-blue-100 transition-colors text-sm font-bold flex items-center gap-2"
                    >
                        Xem chi tiết
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            )}
        </div>
    );
}
