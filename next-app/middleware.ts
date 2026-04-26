import { NextRequest, NextResponse } from 'next/server';

const AUTH_COOKIE_NAME = 'cecics_session';

function hasValidSessionToken(token?: string): boolean {
    if (!token) return false;
    const [payload] = token.split('.');
    if (!payload) return false;

    try {
        const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
        const decodedPayload = atob(normalized);
        const decoded = JSON.parse(decodedPayload);
        return typeof decoded?.exp === 'number' && decoded.exp > Math.floor(Date.now() / 1000);
    } catch {
        return false;
    }
}

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
    const hasSession = hasValidSessionToken(token);

    const isLoginPage = pathname === '/login';
    const isDashboardPage = pathname === '/dashboard' || pathname.startsWith('/dashboard/');

    if (isDashboardPage && !hasSession) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    if (isLoginPage && hasSession) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/login', '/dashboard/:path*'],
};
