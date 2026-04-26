'use server';

import { rentalService } from '@/services/RentalService';
import { revalidatePath } from 'next/cache';
import { RentalTicket } from '@/types/rental';

export async function createRentalTicketAction(
    ticket: Omit<RentalTicket, 'id' | 'created_by'>,
    itemIds: number[]
) {
    try {
        const fullTicket: Omit<RentalTicket, 'id'> = {
            ...ticket,
            created_by: 1, // Giả định admin id = 1 cho đến khi có Auth
        };

        await rentalService.createRentalTicket(fullTicket, itemIds);
        revalidatePath('/dashboard/rental');
        return { success: true };
    } catch (err: any) {
        return { success: false, error: err.message };
    }
}

export async function returnRentalTicketAction(ticketId: number) {
    // Không dùng nữa, chuyển sang returnItemsAction
}

export async function getTicketDetailsAction(ticketId: number) {
    try {
        return await rentalService.getTicketDetails(ticketId);
    } catch (err: any) {
        return null;
    }
}

export async function returnItemsAction(ticketId: number, detailIds: number[]) {
    try {
        const sessionCount = await rentalService.returnItems(ticketId, detailIds);
        revalidatePath('/dashboard/rental');
        revalidatePath('/dashboard');
        return { success: true, sessionCount };
    } catch (err: any) {
        return { success: false, error: err.message };
    }
}
