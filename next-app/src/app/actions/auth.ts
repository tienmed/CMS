'use server';

import { authenticateUser, authCookieName, authCookieTtlSeconds, createSessionToken } from '@/lib/auth';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function loginAction(formData: FormData) {
    try {
        const username = String(formData.get('username') || '').trim();
        const password = String(formData.get('password') || '');

        if (!username || !password) {
            redirect('/login?error=missing_credentials');
        }

        const user = await authenticateUser(username, password);
        if (!user) {
            redirect('/login?error=invalid_credentials');
        }

        const token = createSessionToken(user);
        const cookieStore = await cookies();
        cookieStore.set(authCookieName, token, {
            httpOnly: true,
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
            maxAge: authCookieTtlSeconds,
            path: '/',
        });

        redirect('/dashboard');
    } catch (error: any) {
        // Re-throw redirect errors as they are part of Next.js flow
        if (error.message === 'NEXT_REDIRECT') throw error;

        console.error('Login action error:', error);

        // Encode error message for safe transport
        const msg = encodeURIComponent(error.message || 'unknown');
        redirect(`/login?error=server_error&msg=${msg}`);
    }
}

export async function logoutAction() {
    try {
        const cookieStore = await cookies();
        cookieStore.delete(authCookieName);
        redirect('/login');
    } catch (error: any) {
        if (error.message === 'NEXT_REDIRECT') throw error;
        console.error('Logout action error:', error);
        redirect('/login');
    }
}
