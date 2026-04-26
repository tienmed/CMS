# 🏥 CECICS Equipments CMS (Next.js Edition)

Hệ thống quản lý tập trung và vận hành có kiểm soát các mô hình, thiết bị trong môi trường thực hành mô phỏng y khoa (CECICS).

## 🛠️ Trụ Cột Công Nghệ (Tech Stack)
- **Core Framework**: [Next.js 16](https://nextjs.org/) (App Router, Server Components).
- **Ngôn ngữ**: [TypeScript](https://www.typescriptlang.org/) (Strict mode).
- **Data Layer**: Custom Queries trỏ trực tiếp hệ MySQL (Hostinger) qua `mysql2` Connection Pool.
- **UI/UX**: [Tailwind CSS v4](https://tailwindcss.com/), Radix UI / Shadcn, và động lực hóa bằng [Recharts](https://recharts.org/).
- **Quản lý Process**: [PM2](https://pm2.keymetrics.io/) (triển khai production ngầm tại Node).

## 🎯 Mục tiêu Dự án
1. **Quản lý Tập trung**: Phân nhóm Mô hình (MH), Thiết bị (TB) theo mức độ quan trọng (H/M/L) và Hãng sản xuất.
2. **Theo dõi QR Code**: Kiểm soát số lượng và chủng loại thông qua mã QR và Barcode STT.
3. **Lịch trình Thông minh**: Theo dõi lịch sử mượn từ kho, xuất sử dụng và thu hồi chi tiết.
4. **Định vị Chính xác**: Biết rõ vị trí để thiết bị (tủ, kệ, phòng).
5. **Thống kê & Báo cáo**: Tự động hóa báo cáo định kỳ và dashboard trực quan.

## 🚀 Hướng dẫn Cài đặt & Phát triển

### Yêu cầu Hệ thống
- Node.js >= 20.x
- SQL Server (Microsoft SQL Server)
- PM2 (cho môi trường Production)

### Cài đặt
1. Cài đặt các thư viện:
   ```bash
   npm install
   ```
2. Cấu hình biến môi trường:
   Tạo tệp `.env.local` dựa trên `.env.example` và cấu hình MSSQL connection string.

3. Chạy môi trường phát triển:
   ```bash
   npm run dev
   ```

### Triển khai Production
Sử dụng PM2 để khởi tạo quy trình ngầm:
```bash
npm run build
pm2 start npm --name "cecics-cms" -- start
```

## 📐 Kiến trúc Hệ thống
Dự án áp dụng **Pragmatic Clean Architecture** kết hợp với **Server Components** của Next.js để tối ưu hóa SEO và tốc độ tải trang. Logic nghiệp vụ được tách biệt rõ ràng trong thư mục `services/` và truy vấn dữ liệu trực tiếp qua `lib/db.ts`.

---
© 2026 CECICS - Simulation environment Equipment Management System.
