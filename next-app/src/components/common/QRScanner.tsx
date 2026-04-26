'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode, Html5QrcodeFullConfig } from 'html5-qrcode';
import { X, Zap, ZapOff, RefreshCw } from 'lucide-react';

interface QRScannerProps {
    onScanSuccess: (decodedText: string) => void;
    onClose: () => void;
}

export default function QRScanner({ onScanSuccess, onClose }: QRScannerProps) {
    const scannerRef = useRef<Html5Qrcode | null>(null);
    const [isFlashOn, setIsFlashOn] = useState(false);
    const [hasFlash, setHasFlash] = useState(false);
    const [isStarting, setIsStarting] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const SCANNER_ID = 'qr-reader';

    useEffect(() => {
        const startScanner = async () => {
            try {
                const scanner = new Html5Qrcode(SCANNER_ID);
                scannerRef.current = scanner;

                const config: any = {
                    fps: 10,
                    qrbox: { width: 250, height: 250 },
                };

                await scanner.start(
                    { facingMode: "environment" },
                    config,
                    (decodedText) => {
                        onScanSuccess(decodedText);
                    },
                    undefined // onScanFailure (ignored for noise)
                );

                setIsStarting(false);

                // Check for flash/torch support if possible
                // Note: html5-qrcode's getCameraInformation might help but let's check capabilities
                const state = scanner.getState();
                // Flash handling is tricky in web, usually requires specific tracks
            } catch (err: any) {
                console.error("Scanner error:", err);
                setError(err.message || "Không thể khởi động camera. Vui lòng cấp quyền truy cập.");
                setIsStarting(false);
            }
        };

        startScanner();

        return () => {
            if (scannerRef.current && scannerRef.current.isScanning) {
                scannerRef.current.stop().catch(e => console.error("Stop error", e));
            }
        };
    }, [onScanSuccess]);

    const toggleFlash = async () => {
        if (!scannerRef.current) return;
        try {
            // Not all devices support torch via web standard
            // This is a simplified check
            // @ts-ignore
            const track = scannerRef.current.getRunningTrack();
            if (track && track.getCapabilities && track.getCapabilities().torch) {
                await track.applyConstraints({
                    advanced: [{ torch: !isFlashOn }]
                });
                setIsFlashOn(!isFlashOn);
            }
        } catch (e) {
            console.error("Flash error", e);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center animate-in fade-in duration-300">
            {/* Scan Area Overlay */}
            <div className="absolute inset-0 border-[40px] border-black/40 pointer-events-none flex flex-col items-center justify-center">
                <div className="w-[250px] h-[250px] border-4 border-blue-500 rounded-3xl relative shadow-[0_0_50px_rgba(59,130,246,0.3)] animate-pulse">
                    <div className="absolute inset-0 bg-blue-500/5"></div>
                    {/* Corners */}
                    <div className="absolute -top-1 -left-1 w-8 h-8 border-t-8 border-l-8 border-white rounded-tl-lg"></div>
                    <div className="absolute -top-1 -right-1 w-8 h-8 border-t-8 border-r-8 border-white rounded-tr-lg"></div>
                    <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-8 border-l-8 border-white rounded-bl-lg"></div>
                    <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-8 border-r-8 border-white rounded-br-lg"></div>
                </div>
                <p className="mt-8 text-white font-black text-sm uppercase tracking-[0.3em] text-center px-10">
                    Căn chỉnh mã QR vào khung
                </p>
            </div>

            {/* Video Feed Component */}
            <div id={SCANNER_ID} className="w-full h-full object-cover"></div>

            {/* Controls */}
            <div className="absolute top-10 left-0 right-0 px-8 flex items-center justify-between pointer-events-none">
                <button
                    onClick={onClose}
                    className="p-4 bg-white/10 hover:bg-white/20 backdrop-blur-xl rounded-full text-white transition-all active:scale-90 pointer-events-auto shadow-2xl"
                >
                    <X className="w-8 h-8" />
                </button>
                <div className="flex gap-4 pointer-events-auto">
                    {/* Optional Flashlight button can go here if we find it supported */}
                </div>
            </div>

            {isStarting && (
                <div className="absolute inset-0 bg-black flex flex-col items-center justify-center space-y-4">
                    <RefreshCw className="w-10 h-10 text-blue-500 animate-spin" />
                    <p className="text-white/60 text-xs font-black uppercase tracking-widest">Đang khởi động camera...</p>
                </div>
            )}

            {error && (
                <div className="absolute inset-0 bg-slate-900 flex flex-col items-center justify-center p-12 text-center space-y-6">
                    <div className="w-20 h-20 bg-red-500/20 rounded-3xl flex items-center justify-center">
                        <X className="w-10 h-10 text-red-500" />
                    </div>
                    <p className="text-white font-bold text-lg">{error}</p>
                    <button
                        onClick={onClose}
                        className="bg-white text-slate-900 px-8 py-3 rounded-2xl font-black uppercase text-sm tracking-widest hover:bg-slate-100 transition-all active:scale-95 shadow-xl"
                    >
                        Quay lại
                    </button>
                </div>
            )}
        </div>
    );
}
