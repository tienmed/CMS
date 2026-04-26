# Danh mục Kỹ thuật triển khai (Project Skills)

Dự án này tích hợp các kỹ thuật phát triển hiện đại nhằm đảm bảo hệ thống vận hành ổn định và dễ mở rộng.

## 1. Kiến trúc & Logic (Backend Patterns)
*   **Layered Architecture:** Áp dụng mô hình Controller-Service-Repository để tách biệt rõ ràng giữa Business Logic và Data Access.
*   **Server Actions:** Sử dụng Next.js Server Actions để xử lý các tác vụ đột biến như ghi nhận trả hàng (Return session) một cách an toàn và tối ưu SEO.
*   **API Endpoint Builder Pattern:** Triển khai các API theo cấu trúc chuẩn RESTful, đảm bảo tính nhất quán về dữ liệu và xử lý lỗi tập trung.

## 2. Tối ưu hóa Cơ sở dữ liệu (Database Optimization)
*   **Single-Query Statistics:** Sử dụng subqueries và Conditional Aggregation để gộp nhiều truy vấn thống kê vào một câu lệnh SQL duy nhất, giảm 80% tải kết nối cho Dashboard.
*   **Atomic Transactions:** Đảm bảo toàn vẹn dữ liệu khi xử lý mượn/trả hàng loạt thông qua transaction.

## 3. Trải nghiệm người dùng (UX/UI & Frontend)
*   **Real-time QR Integration:** Kỹ thuật tự động focus và xử lý input ẩn để hỗ trợ người dùng quét barcode liên tục mà không cần thao tác chuột.
*   **Universal Print Engine:** Xây dựng template in A4 thích ứng (responsive print layout) sử dụng CSS `@media print` và dangerouslySetInnerHTML để ép kiểu văn bản đen thuần túy cho in laser.

## 4. Quản lý vận hành (App Intelligence)
*   **Wear-Leveling Logic:** Thuật toán tính toán hiệu suất sử dụng để cân bằng tải cho thiết bị.
*   **Multi-session Tracking:** Logic quản lý trả hàng theo phiên (session count) cho các giao dịch phức tạp.

## 5. UI/UX Pro Max - Design Intelligence
Dự án áp dụng các tiêu chuẩn thiết kế cao cấp nhất từ [UI/UX Pro Max](https://github.com/sickn33/antigravity-awesome-skills/tree/main/skills/ui-ux-pro-max):
*   **Interaction Intelligence:** Đảm bảo mọi phần tử tương tác đều có `cursor-pointer`, trạng thái hover mượt mà (150-300ms) và không gây layout shift.
*   **Glassmorphism & Layering:** Sử dụng hiệu ứng kính (backdrop-blur) và phân lớp z-index logic để tạo chiều sâu và cảm giác hiện đại (Premium feel).
*   **Micro-animations:** Tích hợp các hiệu ứng chuyển động nhỏ (scale, opacity, translate) để phản hồi hành vi của người dùng một cách tinh tế.
*   **Loading States Intelligence:** Skeleton screens và hiệu ứng disable button kèm loader cho mọi tác vụ bất đồng bộ.
*   **Accessibility First:** Tuân thủ tỉ lệ tương phản 4.5:1, hỗ trợ điều hướng bàn phím đầy đủ và sử dụng SVG icons đồng bộ (Lucide).
