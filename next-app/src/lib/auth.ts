import pool from '@/lib/db';
import { compare } from 'bcryptjs';
import crypto from 'crypto';
import { RowDataPacket } from 'mysql2';

import { AUTH_COOKIE_NAME, AUTH_COOKIE_MAX_AGE } from './constants';

const SESSION_COOKIE = AUTH_COOKIE_NAME;
const SESSION_TTL_SECONDS = AUTH_COOKIE_MAX_AGE;

export interface AuthUser {
    id?: number;
    name?: string;
    username: string;
    email?: string;
}

interface SessionPayload {
    user: AuthUser;
    exp: number;
}

function getSessionSecret(): string {
    return process.env.SESSION_SECRET || process.env.NEXTAUTH_SECRET || 'dev-session-secret-change-me';
}

function toBase64Url(value: string): string {
    return Buffer.from(value).toString('base64url');
}

function signPayload(payload: string): string {
    return crypto
        .createHmac('sha256', getSessionSecret())
        .update(payload)
        .digest('base64url');
}

export function createSessionToken(user: AuthUser): string {
    const payload: SessionPayload = {
        user,
        exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
    };
    const serialized = JSON.stringify(payload);
    const encodedPayload = toBase64Url(serialized);
    const signature = signPayload(encodedPayload);
    return `${encodedPayload}.${signature}`;
}

export function verifySessionToken(token?: string): AuthUser | null {
    if (!token) return null;
    const [encodedPayload, signature] = token.split('.');
    if (!encodedPayload || !signature) return null;

    const expectedSig = signPayload(encodedPayload);
    if (signature !== expectedSig) return null;

    try {
        const payload = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString('utf-8')) as SessionPayload;
        if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) {
            return null;
        }
        return payload.user;
    } catch {
        return null;
    }
}

export async function authenticateUser(username: string, password: string): Promise<AuthUser | null> {
    type UserRow = RowDataPacket & {
        username: string;
        password: string;
    };

    const [rows] = await pool.query(`
        SELECT username, password
        FROM users
        WHERE username = ?
        LIMIT 1
    `, [username]) as [UserRow[], unknown];

    if (!rows.length) return null;

    const user = rows[0];
    const passwordMatched = await verifyPassword(password, user.password);
    if (!passwordMatched) return null;

    return {
        username: user.username,
    };
}

async function verifyPassword(rawPassword: string, dbPassword: string): Promise<boolean> {
    const hashedPrefixList = ['$2a$', '$2b$', '$2y$'];
    const isBcryptHash = hashedPrefixList.some(prefix => dbPassword.startsWith(prefix));

    if (isBcryptHash) {
        return compare(rawPassword, dbPassword);
    }

    return rawPassword === dbPassword;
}

export const authCookieName = SESSION_COOKIE;
export const authCookieTtlSeconds = SESSION_TTL_SECONDS;
