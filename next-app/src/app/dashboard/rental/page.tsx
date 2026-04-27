import { rentalService } from '@/services/RentalService';
import { equipmentService } from '@/services/EquipmentService';
import { departmentService } from '@/services/DepartmentService';
import { ClipboardList, Clock, PackageCheck } from 'lucide-react';
import CreateRentalModal from '@/components/rental/CreateRentalModal';
import ActiveTicketsTable from '@/components/rental/ActiveTicketsTable';

export const dynamic = 'force-dynamic';

export default async function RentalPage() {
  const [activeTickets, departments, rentableItems] = await Promise.all([
    rentalService.getActiveTickets(),
    departmentService.getAllDepartments(),
    equipmentService.getRentableItems(),
  ]);

  return (
    <div className="rental-page">
      <div className="rental-page-head">
        <div>
          <h1 className="page-title">Mượn / Trả thiết bị</h1>
          <p className="page-subtitle mt-1">Theo dõi phiếu mượn đang hoạt động và xử lý trả thiết bị nhanh chóng.</p>
        </div>
        <CreateRentalModal departments={departments} rentableItems={rentableItems} />
      </div>

      <div className="rental-stats">
        <div className="rental-stat-card">
          <div className="rental-stat-head"><ClipboardList className="w-4 h-4" /> Phiếu đang mở</div>
          <p className="rental-stat-value">{activeTickets.length}</p>
        </div>
        <div className="rental-stat-card">
          <div className="rental-stat-head"><PackageCheck className="w-4 h-4" /> Thiết bị sẵn sàng</div>
          <p className="rental-stat-value">{rentableItems.length}</p>
        </div>
        <div className="rental-stat-card">
          <div className="rental-stat-head"><Clock className="w-4 h-4" /> Cập nhật</div>
          <p className="rental-stat-value">Theo thời gian thực</p>
        </div>
      </div>

      <div className="rental-main">
        <ActiveTicketsTable initialTickets={activeTickets} />
      </div>
    </div>
  );
}
