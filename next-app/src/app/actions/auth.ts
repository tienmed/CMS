'use server';

import { authenticateUser, authCookieName, authCookieTtlSeconds, createSessionToken } from '@/lib/auth';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function loginAction(formData: FormData) {
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
}

export async function logoutAction() {
    const cookieStore = await cookies();
    cookieStore.delete(authCookieName);
    redirect('/login');
}
