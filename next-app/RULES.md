# Quy tắc Phát triển Dự án (Development Rules)

Để dự án CECICS phát triển bền vững và không phá vỡ cấu trúc ban đầu, các lập trình viên cần tuân thủ các quy tắc sau:

## 1. Cấu trúc Thư mục (Directory Integrity)
*   `src/services`: Nơi chứa toàn bộ Business Logic. Không viết logic nghiệp vụ phức tạp trực tiếp trong Page hoặc Component.
*   `src/app/actions`: Nơi chứa các Server Actions. Chỉ dùng cho các tác vụ thay đổi dữ liệu (mutations).
*   `src/components`: Chia thành các thư mục theo chức năng (ví dụ: `rental`, `dashboard`).
*   `src/types`: Mọi dữ liệu phải được định nghĩa interface rõ ràng. Tuyệt đối không dùng `any`.

## 2. Quy tắc Lập trình (Coding Standards)
*   **Naming:**
    *   Component: PascalCase (ví dụ: `ReturnTicketModal.tsx`).
    *   Function/Variable: camelCase.
    *   File hằng số: UPPER_SNAKE_CASE.
*   **Data Structure:** Tuân thủ cấu trúc Response chuẩn: `{ success: boolean, data?: any, error?: string, sessionCount?: number }`.
*   **No Side-Effects in Views:** Các Component chỉ có nhiệm vụ hiển thị và gửi event. Logic tính toán ngày tháng, trạng thái trễ hạn phải nằm trong Service hoặc Helper.

## 3. Giao diện & Trải nghiệm (UI/UX)
*   **Aesthetic:** Luôn duy trì phong cách hiện đại (Premium Dark/Light mode, Glassmorphism, Dynamic Animations).
*   **Consistency:** Sử dụng bảng màu và font đã quy hoạch trong `globals.css` và `tailwind.config.ts`. Tuyệt đối không sử dụng các màu cơ bản (plain red, blue, green) mà phải dùng hệ màu HSL/Hex đã được định nghĩa.

## 4. Cơ sở dữ liệu (Database)
*   **No SQL Hardcoding:** Luôn sử dụng parameterized queries để chống SQL Injection.
*   **Efficiency:** Luôn cân nhắc việc gộp truy vấn nếu có thể thực hiện được bằng SQL (Subqueries/Joins) trước khi xử lý bằng code JS để tiết kiệm kết nối.

## 5. Đồng bộ hóa (Git Synchronization)
*   **Always Sync:** Trước khi kết thúc phiên làm việc, bắt buộc phải commit và push toàn bộ thay đổi lên nhánh `origin/main` để đảm bảo tính sẵn sàng của môi trường Vercel.
*   **Main is Ground Truth:** Toàn bộ quá trình phát triển (bao gồm cả các nhánh release) phải được merge/push vào `origin/main` để kích hoạt lượt build tự động và đồng bộ hóa môi trường triển khai.
