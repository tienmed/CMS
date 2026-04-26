import { rentalService } from '@/services/RentalService';
import HistoryDashboard from '@/components/history/HistoryDashboard';

export const dynamic = 'force-dynamic';

export default async function HistoryPage() {
    const history = await rentalService.getUsageHistory();

    return <HistoryDashboard initialHistory={history} />;
}
