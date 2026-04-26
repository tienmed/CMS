/**
 * Barcode Parser Utility
 * 
 * Format: GGLCCCTTNN[-SS]
 * GG  = Group (MH: Mô hình, TB: Thiết bị, VP: Văn phòng)
 * L   = Level (H: High, M: Medium, L: Low)
 * CCC = Equipment model code
 * TT  = Total count of items in this model type
 * NN  = Item serial number
 * SS  = Optional suffix
 */

export interface ParsedBarcode {
    raw: string;
    group: string;       // MH, TB, VP
    groupLabel: string;  // Mô hình, Thiết bị, Văn phòng
    level: string;       // H, M, L
    levelLabel: string;  // High, Medium, Low
    modelCode: string;   // 045
    totalCount: number;  // 14
    serial: number;      // 01
}

const GROUP_LABELS: Record<string, string> = {
    'MH': 'Mô hình',
    'TB': 'Thiết bị',
    'VP': 'Văn phòng',
};

const LEVEL_LABELS: Record<string, string> = {
    'H': 'High',
    'M': 'Medium',
    'L': 'Low',
};

const LEVEL_COLORS: Record<string, { bg: string; text: string; border: string }> = {
    'H': { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
    'M': { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
    'L': { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
};

const GROUP_COLORS: Record<string, { bg: string; text: string; chart: string }> = {
    'MH': { bg: 'bg-blue-50', text: 'text-blue-700', chart: '#3b82f6' },
    'TB': { bg: 'bg-emerald-50', text: 'text-emerald-700', chart: '#10b981' },
    'VP': { bg: 'bg-violet-50', text: 'text-violet-700', chart: '#8b5cf6' },
};

export function parseBarcode(barcode: string): ParsedBarcode | null {
    if (!barcode || barcode.length < 10) return null;

    const group = barcode.substring(0, 2).toUpperCase();
    const level = barcode.substring(2, 3).toUpperCase();
    const modelCode = barcode.substring(3, 6);
    const totalCount = parseInt(barcode.substring(6, 8), 10);
    const serial = parseInt(barcode.substring(8, 10), 10);

    return {
        raw: barcode,
        group,
        groupLabel: GROUP_LABELS[group] || group,
        level,
        levelLabel: LEVEL_LABELS[level] || level,
        modelCode,
        totalCount: isNaN(totalCount) ? 0 : totalCount,
        serial: isNaN(serial) ? 0 : serial,
    };
}

export { GROUP_LABELS, LEVEL_LABELS, LEVEL_COLORS, GROUP_COLORS };
