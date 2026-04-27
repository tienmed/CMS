import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        // Fetch IP from ipify
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();

        return NextResponse.json({
            status: 'success',
            server_ip: data.ip,
            timestamp: new Date().toISOString(),
            message: 'Use this IP to whitelist in your SQL Remote Access settings.',
            note: 'Vercel IPs are dynamic and may change. For a permanent solution, consider using a database with integrated Vercel support or a static IP proxy.'
        });
    } catch (error) {
        return NextResponse.json({
            status: 'error',
            message: 'Failed to retrieve server IP',
            error: error instanceof Error ? error.message : String(error)
        }, { status: 500 });
    }
}
