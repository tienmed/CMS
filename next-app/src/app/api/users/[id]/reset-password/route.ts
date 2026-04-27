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

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    if (!await checkAdmin()) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { password } = body;
        const { id } = await params;
        const userId = parseInt(id);

        const success = await UserService.resetPassword(userId, password);

        if (success) {
            return NextResponse.json({ message: 'Password reset successfully' });
        } else {
            return NextResponse.json({ error: 'User not found or update failed' }, { status: 404 });
        }
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
