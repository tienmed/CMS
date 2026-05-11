##  Phân tích và tài liệu chi tiết cho code JavaScript

###  NỘI DUNG

Tài liệu này phân tích code JavaScript đã được cung cấp, bao gồm các API và logic chính.

**1. Các interface:**

* **`EquipmentWithUsage`**: 
   
   ```typescript
   interface EquipmentWithUsage {
       id: number;
       name: string;
       barcode: string;
       group_code: string;
       level_code: string;
       model_code: string;
       item_count: number;
       rental_count: number;
       import_year: number | null;
       usage_per_year: number;
   }
   ```

   Interface này định nghĩa cấu trúc dữ liệu cho một thiết bị, bao gồm thông tin về ID, tên, mã vạch, mã nhóm, mã cấp độ, mã mô hình, số lượng vật dụng, số lượng thuê, năm nhập (có thể null), và mức sử dụng trung bình mỗi năm.

* **`AnalyticsMetrics`**:

   ```typescript
   interface AnalyticsMetrics {
       totalModels: number;
       totalItems: number;
       totalRentals: number;
       avgUsagePerYear: number;
   }
   ```

   Interface này định nghĩa các thông số thống kê phân tích, bao gồm tổng số thiết bị, tổng số vật dụng, tổng số thuê, và mức sử dụng trung bình mỗi năm.

* **`GroupedEquipment`**:

   ```typescript
   interface GroupedEquipment {
       key: string;
       label: string;
       count: number;
       items: EquipmentWithUsage[];
   }
   ```

   Interface này mô tả một nhóm thiết bị, bao gồm khóa nhóm, nhãn nhóm, số lượng thiết bị trong nhóm, và danh sách thiết bị thuộc nhóm.

**2. Hàm `getEquipmentAnalytics`**

   *  `getEquipmentAnalytics` là hàm chính xử lý phân tích dữ liệu về thiết bị. 

   *  Hàm nhận ba tham số:

      *  `whereClause`: Chuỗi SQL để lọc dữ liệu (ví dụ: `SUBSTRING(e.barcode, 1, 2)`).

      *  `whereValue`: Giá trị lọc cho `whereClause` (ví dụ: `'MH'`).

      *  `groupByKey`: Chuỗi xác định cách nhóm dữ liệu (ví dụ: `'group_code'` hoặc `'level_code'`).

   *  Hàm sử dụng truy vấn SQL với `WITH` clause để tính toán số lượng vật dụng và số lượng thuê cho mỗi thiết bị. 

   *  Hàm lọc dữ liệu dựa trên `whereClause` và `whereValue`.

   *  Hàm nhóm dữ liệu dựa trên `groupByKey` và tính toán các thông số thống kê.

   *  Kết quả trả về là một đối tượng chứa:

      *  `metrics`: Object chứa các thông số thống kê phân tích.

      *  `groups`: Array chứa các nhóm thiết bị được phân loại.




**3. Hàm `getEquipmentByGroup` và `getEquipmentByLevel`**

   *  Hàm `getEquipmentByGroup` và `getEquipmentByLevel` là các hàm wrapper cho `getEquipmentAnalytics`.

   *  `getEquipmentByGroup` lấy dữ liệu cho một nhóm cụ thể (ví dụ: MH) và nhóm theo cấp độ.

   *  `getEquipmentByLevel` lấy dữ liệu cho một cấp độ cụ thể (ví dụ: H) và nhóm theo nhóm.

**4. Class `AnalyticsService`**

   *  `AnalyticsService` là một class duy nhất, sử dụng singleton design pattern để đảm bảo chỉ có một instance của class này.

   *  Hàm `getInstance` trả về instance duy nhất của `AnalyticsService`.



###  LƯU Ý:

*  Tài liệu này dựa trên hiểu biết của tôi về code. 

*  Để có tài liệu chính xác nhất, bạn nên tham khảo code source và document chính thức nếu có.

*  Code này có thể được sử dụng để phân tích dữ liệu về thiết bị và các thông số liên quan đến việc sử dụng chúng.

*  Bạn có thể thay đổi tham số truy vấn SQL để lọc dữ liệu theo nhu cầu của mình.



