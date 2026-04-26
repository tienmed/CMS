import QRCode from 'qrcode';

class QrService {
    private static instance: QrService;

    private constructor() { }

    public static getInstance(): QrService {
        if (!QrService.instance) {
            QrService.instance = new QrService();
        }
        return QrService.instance;
    }

    /**
     * Tạo mã QR dưới dạng Data URL (Base64)
     */
    async generateQrDataUrl(text: string): Promise<string> {
        try {
            return await QRCode.toDataURL(text, {
                margin: 2,
                color: {
                    dark: '#0f172a', // slate-900
                    light: '#ffffff'
                }
            });
        } catch (err) {
            console.error('QR Generation Error:', err);
            return '';
        }
    }
}

export const qrService = QrService.getInstance();
