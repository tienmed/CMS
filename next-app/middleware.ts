import { NextRequest, NextResponse } from 'next/server';

const AUTH_COOKIE_NAME = 'cecics_session';

function hasValidSessionToken(token?: string): boolean {
    if (!token) {
        console.warn('Middleware: [MISSING_TOKEN] No session cookie detected');
        return false;
    }

    // Clean and split
    const cleanToken = token.trim();
    const parts = cleanToken.split('.');

    if (parts.length < 2) {
        console.error('Middleware: [INVALID_FORMAT] Token parts < 2', { partsCount: parts.length });
        return false;
    }

    const payload = parts[0];

    try {
        // Robust Base64Url to Base64 with padding
        let base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
        const pad = base64.length % 4;
        if (pad) {
            base64 += '='.repeat(4 - pad);
        }

        const decodedPayload = atob(base64);
        const decoded = JSON.parse(decodedPayload);

        if (!decoded?.exp) {
            console.error('Middleware: [MISSING_EXP] No expiration in payload');
            return false;
        }

        const now = Math.floor(Date.now() / 1000);
        const isExpired = decoded.exp < now;

        if (isExpired) {
            console.warn(`Middleware: [EXPIRED] tokenExp=${decoded.exp} now=${now} diffS=${now - decoded.exp}`);
            return false;
        }

        return true;
    } catch (error: any) {
        console.error('Middleware: [EXCEPTION] Token parse failed', {
            message: error.message,
            payloadLength: payload.length
        });
        return false;
    }
}

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Extract cookie - handle potential variations
    const cookie = request.cookies.get(AUTH_COOKIE_NAME);
    const token = cookie?.value;

    const hasSession = hasValidSessionToken(token);

    // Diagnostic log for deployment debugging
    if (process.env.NODE_ENV === 'production' || pathname.startsWith('/dashboard')) {
        console.log(`Middleware Audit [${new Date().toISOString()}]: path=${pathname} hasCookie=${!!cookie} hasToken=${!!token} tokenLen=${token?.length || 0} hasSession=${hasSession}`);
    }

    const isLoginPage = pathname === '/login';
    const isDashboardPage = pathname === '/dashboard' || pathname.startsWith('/dashboard/');

    if (isDashboardPage && !hasSession) {
        console.log(`Middleware: [REDIRECT_LOGIN] Path=${pathname} - Access Denied`);
        const url = request.nextUrl.clone();
        url.pathname = '/login';
        url.searchParams.set('from', pathname); // Diagnostic parameter
        return NextResponse.redirect(url);
    }

    if (isLoginPage && hasSession) {
        console.log('Middleware: [REDIRECT_DASHBOARD] Already logged in');
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/login', '/dashboard/:path*'],
};
