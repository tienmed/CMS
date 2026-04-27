import { NextRequest, NextResponse } from 'next/server';

const AUTH_COOKIE_NAME = 'cecics_session';

function hasValidSessionToken(token?: string): { valid: boolean; reason?: string; decoded?: any } {
    if (!token) {
        return { valid: false, reason: 'MISSING_COOKIE' };
    }

    const cleanToken = token.trim();
    const parts = cleanToken.split('.');

    if (parts.length < 2) {
        return { valid: false, reason: 'INVALID_FORMAT', decoded: { parts: parts.length } };
    }

    const payload = parts[0];

    try {
        let base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
        const pad = base64.length % 4;
        if (pad) {
            base64 += '='.repeat(4 - pad);
        }

        const decodedPayload = atob(base64);
        const decoded = JSON.parse(decodedPayload);

        if (!decoded?.exp) {
            return { valid: false, reason: 'MISSING_EXP', decoded };
        }

        const now = Math.floor(Date.now() / 1000);
        if (decoded.exp < now) {
            return { valid: false, reason: 'EXPIRED', decoded: { ...decoded, now } };
        }

        return { valid: true, decoded };
    } catch (error: any) {
        return { valid: false, reason: 'PARSE_ERROR', decoded: { message: error.message } };
    }
}

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Ignore static assets
    if (pathname.startsWith('/_next') || pathname.includes('.')) {
        return NextResponse.next();
    }

    const cookie = request.cookies.get(AUTH_COOKIE_NAME);
    const token = cookie?.value;
    const { valid, reason, decoded } = hasValidSessionToken(token);

    // CRITICAL DIAGNOSTIC LOG
    // This will appear in Vercel Logs
    console.log(`[MW_AUDIT] ${new Date().toISOString()} | Path: ${pathname} | Status: ${valid ? 'OK' : 'FAIL'} | Reason: ${reason} | Cookie: ${!!cookie} | TokenLen: ${token?.length || 0}`);
    if (!valid && token) {
        console.log(`[MW_ERROR_DATA] Token preview: ${token.slice(0, 10)}... | Decoded raw: ${JSON.stringify(decoded)}`);
    }

    const isLoginPage = pathname === '/login';
    const isDashboardPage = pathname === '/dashboard' || pathname.startsWith('/dashboard/');

    if (isDashboardPage && !valid) {
        const url = request.nextUrl.clone();
        url.pathname = '/login';
        url.searchParams.set('reason', reason || 'unknown');
        url.searchParams.set('from', pathname);

        // Clear the bad cookie to force a clean slate
        const response = NextResponse.redirect(url);
        if (cookie) {
            response.cookies.delete(AUTH_COOKIE_NAME);
        }
        return response;
    }

    if (isLoginPage && valid) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/login', '/dashboard/:path*'],
};
