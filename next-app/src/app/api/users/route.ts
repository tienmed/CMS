import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { authCookieName, verifySessionToken } from '@/lib/auth';
import { UserService } from '@/services/userService';

async function checkAdmin() {
    const cookieStore = await cookies();
    const session = cookieStore.get(authCookieName)?.value;
    const user = verifySessionToken(session);

    if (!user || user.username !== 'super_admin') {
        return false;
    }
    return true;
}

export async function GET() {
    if (!await checkAdmin()) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const users = await UserService.getAllUsers();
        return NextResponse.json(users);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    if (!await checkAdmin()) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const userId = await UserService.createUser(body);
        return NextResponse.json({ id: userId, message: 'User created successfully' });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
