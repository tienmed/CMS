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

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    if (!await checkAdmin()) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { id } = await params;
        const userId = parseInt(id);

        // Prevent deleting super_admin
        const users = await UserService.getAllUsers();
        const targetUser = users.find(u => u.id === userId);
        if (targetUser?.username === 'super_admin') {
            return NextResponse.json({ error: 'Cannot delete super_admin account' }, { status: 403 });
        }

        const success = await UserService.deleteUser(userId);

        if (success) {
            return NextResponse.json({ message: 'User deleted successfully' });
        } else {
            return NextResponse.json({ error: 'User not found or deletion failed' }, { status: 404 });
        }
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
