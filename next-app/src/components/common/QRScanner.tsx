'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { X, RefreshCw } from 'lucide-react';

interface QRScannerProps {
  onScanSuccess: (decodedText: string) => void;
  onClose: () => void;
  continuous?: boolean;
}

export default function QRScanner({ onScanSuccess, onClose, continuous = false }: QRScannerProps) {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const lastScanRef = useRef<{ value: string; time: number }>({ value: '', time: 0 });
  const [isStarting, setIsStarting] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const SCANNER_ID = 'qr-reader';

  useEffect(() => {
    const startScanner = async () => {
      try {
        const scanner = new Html5Qrcode(SCANNER_ID);
        scannerRef.current = scanner;

        await scanner.start(
          { facingMode: 'environment' },
          { fps: 10, qrbox: { width: 260, height: 260 } },
          (decodedText) => {
            const value = decodedText.trim();
            const now = Date.now();
            if (!value) return;
            if (lastScanRef.current.value === value && now - lastScanRef.current.time < 1200) return;
            lastScanRef.current = { value, time: now };
            onScanSuccess(value);
            if (!continuous) onClose();
          },
          undefined
        );

        setIsStarting(false);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Không thể khởi động camera. Vui lòng cấp quyền truy cập.';
        setError(message);
        setIsStarting(false);
      }
    };

    startScanner();

    return () => {
      if (scannerRef.current?.isScanning) {
        scannerRef.current.stop().catch(() => null);
      }
    };
  }, [continuous, onClose, onScanSuccess]);

  return (
    <div className="scanner-overlay">
      <div className="scanner-head">
        <div>
          <p className="scanner-title">Quét QR / Barcode</p>
          <p className="scanner-subtitle">{continuous ? 'Chế độ quét liên tục' : 'Quét một lần'}</p>
        </div>
        <button onClick={onClose} className="scanner-close">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="scanner-body">
        <div id={SCANNER_ID} className="scanner-view" />
        {isStarting && (
          <div className="scanner-loading">
            <RefreshCw className="w-8 h-8 animate-spin" />
            <p className="text-sm">Đang khởi động camera...</p>
          </div>
        )}
        {error && (
          <div className="scanner-error">
            <p className="text-sm">{error}</p>
            <button onClick={onClose} className="scanner-back-btn">
              Quay lại
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
