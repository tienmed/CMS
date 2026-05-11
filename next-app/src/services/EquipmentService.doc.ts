##  API Documentation: Equipment Service

This document details the API provided by the `EquipmentService` class, which manages interaction with equipment data in the database.

**1. Class Structure:**

The `EquipmentService` class implements a singleton pattern, ensuring only one instance of the class exists throughout the application. This promotes code consistency and prevents unintended side effects.

```typescript
class EquipmentService {
    private static instance: EquipmentService;

    private constructor() { }

    public static getInstance(): EquipmentService {
        if (!EquipmentService.instance) {
            EquipmentService.instance = new EquipmentService();
        }
        return EquipmentService.instance;
    }

    // ... other methods ...
}
```

**2. Public Methods:**

Each public method provides a specific functionality related to equipment data management.

*   **`getAllEquipment()`:** Retrieves all equipment records along with associated item counts.
    ```typescript
    async getAllEquipment(): Promise<Equipment[]> {
        try {
            // ... query logic ...
        } catch (err) {
            throw new AppError('Không thể lấy danh sách thiết bị', 500, 'DB_QUERY_ERROR');
        }
    }
    ```
*   **`getEquipmentById(id: number)`:** Retrieves a specific equipment record by its ID.
    ```typescript
    async getEquipmentById(id: number): Promise<Equipment | null> {
        try {
            // ... query logic ...
        } catch (err) {
            throw new AppError(`Lỗi khi truy vấn thiết bị id: ${id}`, 500, 'DB_QUERY_ERROR');
        }
    }
    ```
*   **`getItemsByEquipmentId(equipmentId: number)`:** Retrieves all items associated with a given equipment ID, including their status, condition, and usage count.
    ```typescript
    async getItemsByEquipmentId(equipmentId: number): Promise<(EquipmentItem & { status_name: string; is_rentable: boolean })[]> {
        try {
            // ... query logic ...
        } catch (err) {
            throw new AppError('Không thể lấy danh sách mẫu vật', 500, 'DB_QUERY_ERROR');
        }
    }
    ```
*   **`updateEquipmentDetails(id: number, data: Partial<Equipment>)`:** Updates the details of an existing equipment record.
    ```typescript
    async updateEquipmentDetails(id: number, data: Partial<Equipment>): Promise<boolean> {
        try {
            // ... query logic ...
        } catch (err) {
            throw new AppError('Lỗi khi cập nhật thông tin thiết bị', 500, 'DB_UPDATE_ERROR');
        }
    }
    ```
*   **`getRentableItems()`:** Retrieves all rentable items, including their usage counts, status name, condition name, and a recommendation flag based on usage patterns.
    ```typescript
    async getRentableItems(): Promise<(EquipmentItem & { equipment_name: string; status_name: string; condition_name: string; condition_reject_msg: string })[]> {
        try {
            // ... query logic ...
        } catch (err) {
            throw new AppError('Không thể lấy danh sách mẫu vật sẵn sàng', 500, 'DB_QUERY_ERROR');
        }
    }
    ```
*   **`checkItemAvailability(barcode: string)`:** Checks the availability status of an item based on its barcode, considering condition and rental status.
    ```typescript
    async checkItemAvailability(barcode: string): Promise<{
        available: boolean;
        reason?: 'rented' | 'broken' | 'not_found';
        item?: any;
        activeTicket?: { id: number; ticket_no: string; renter: string };
    }> {
        try {
            // ... query logic ...
        } catch (err) {
            throw new AppError('Lỗi khi kiểm tra trạng thái thiết bị', 500, 'DB_QUERY_ERROR');
        }
    }
    ```
*   **`getItemDetailByBarcode(barcode: string)`:** Retrieves detailed information about an item based on its barcode, including equipment details, status, condition, usage count, and active rental ticket information.
    ```typescript
    async getItemDetailByBarcode(barcode: string): Promise<{
        item: (EquipmentItem & {
            equipment_name: string;
            equipment_barcode: string | null;
            equipment_note: string | null;
            equipment_image_url: string | null;
            status_name: string;
            status_is_rentable: boolean;
            condition_name: string;
            condition_is_rentable: boolean;
            condition_reject_msg: string | null;
            usage_count: number;
        }) | null;
        activeTicket?: { id: number; ticket_no: string; renter: string; rented_date: Date };
    }> {
        try {
            // ... query logic ...
        } catch (err) {
            throw new AppError('Không thể lấy chi tiết mã QR thiết bị', 500, 'DB_QUERY_ERROR');
        }
    }
    ```

**3. Error Handling:**


The code uses a custom `AppError` class to handle errors gracefully. Each method includes error handling using `try...catch` blocks to ensure proper exception management.

**4. Data Validation:**

Data validation is implemented using Zod schema (`EquipmentSchema`) to ensure the integrity of data received and processed by the service.



