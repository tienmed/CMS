import { NextRequest, NextResponse } from 'next/server';

const AUTH_COOKIE_NAME = 'cecics_session';

function hasValidSessionToken(token?: string): boolean {
    if (!token) return false;

    // JWT usually has 3 parts, but our custom token has 2: payload.signature
    const parts = token.split('.');
    if (parts.length < 2) {
        console.warn('Middleware: Invalid token format');
        return false;
    }

    const payload = parts[0];

    try {
        // Base64Url to Base64
        let base64 = payload.replace(/-/g, '+').replace(/_/g, '/');

        // Add padding if missing
        while (base64.length % 4) {
            base64 += '=';
        }

        const decodedPayload = atob(base64);
        const decoded = JSON.parse(decodedPayload);

        const isExpired = typeof decoded?.exp === 'number' && decoded.exp < Math.floor(Date.now() / 1000);
        if (isExpired) {
            console.warn('Middleware: Session expired');
            return false;
        }

        return true;
    } catch (error) {
        console.error('Middleware: Token decode failed', error);
        return false;
    }
}

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
    const hasSession = hasValidSessionToken(token);

    // Diagnostic log for deployment debugging
    if (process.env.NODE_ENV === 'production') {
        console.log(`Middleware Audit: path=${pathname} hasToken=${!!token} hasSession=${hasSession}`);
    }

    const isLoginPage = pathname === '/login';
    const isDashboardPage = pathname === '/dashboard' || pathname.startsWith('/dashboard/');

    if (isDashboardPage && !hasSession) {
        console.log('Middleware: Redirecting to login - No valid session');
        return NextResponse.redirect(new URL('/login', request.url));
    }

    if (isLoginPage && hasSession) {
        console.log('Middleware: Redirecting to dashboard - Already has session');
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/login', '/dashboard/:path*'],
};
