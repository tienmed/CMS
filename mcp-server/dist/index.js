import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { getPool, getPoolInitError } from "./db.js";
const server = new McpServer({
    name: "cecics-equipment-manager",
    version: "1.0.0"
});

    return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }]
    };
}
(query) {
    return `%${query.trim().replace(/[%_]/g, "\\$&")}%`;
}
function safeNumberLimit(value) {
    return Math.max(1, Math.min(value, MAX_LIMIT));
}
function getErrorMessage(error) {
    return error instanceof Error ? error.message : "Unknown error";
}
async function withDb(action) {
    const db = getPool();
    if (!db) {
        const detail = getPoolInitError() ?? "Không thể khởi tạo kết nối MySQL.";
        throw new Error(detail);
    }
    return action(db)
// Tool: List all equipment
server.registerTool("list_equipment", {
    description: "Lấy danh sách tất cả thiết bị trong kho CECICS",
    inputSchema: z.object({

});
// Tool: Search equipment
server.registerTool("search_equipment", {
    description: "Tìm kiếm thiết bị theo tên hoặc mã barcode",
    inputSchema: z.object({

});
// Tool: Get item status by barcode
server.registerTool("get_item_status", {
    description: "Kiểm tra trạng thái và vị trí của một mẫu vật cụ thể qua mã vạch (barcode_stt)",
    inputSchema: z.object({
        barcode: z.string().trim().min(1).max(100).describe("Mã vạch của thiết bị (barcode_stt)")
    })
}, async ({ barcode }) => {

      SELECT ei.*, e.name as equipment_name, es.name as status_name
      FROM equipment_item ei
      JOIN equipment e ON ei.equipment_id = e.id
      JOIN equipment_status es ON ei.equipment_status_id = es.id
      WHERE ei.barcode_stt = ? AND ei.deleted_at IS NULL
    `;
        const [rows] = await withDb((db) => db.query(query, [barcode]));
        if (rows.length === 0) {
            return { content: [{ type: "text", text: `Không tìm thấy thiết bị với mã vạch: ${barcode}` }] };
        }
        return asTextContent(rows[0]);
    }
    catch (error) {
        return asErrorContent(`Lỗi khi kiểm tra trạng thái thiết bị: ${getErrorMessage(error)}`);
    }

});
// Tool: Get recent usage
server.registerTool("get_recent_usage", {
    description: "Lấy lịch sử mượn trả thiết bị gần đây",
    inputSchema: z.object({

    })
}, async ({ limit }) => {
    try {
        const sql = `
      SELECT 
        rt.rented_date, 
        rt.ticket_no, 
        e.name as equipment_name, 
        ei.barcode_stt as barcode, 
        rt.rented_full_name as renter,
        CASE WHEN rt.completed_date IS NULL THEN 'Đang mượn' ELSE 'Đã trả' END as status
      FROM rental_ticket rt
      JOIN rental_detail rd ON rt.id = rd.rental_ticket_id
      JOIN equipment_item ei ON rd.equipment_item_id = ei.id
      JOIN equipment e ON ei.equipment_id = e.id
      ORDER BY rt.rented_date DESC
      LIMIT ?
    `;
});
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    if (getPool()) {
        console.error("CECICS MCP Server running on stdio (MySQL connected)");
    }
    else {
        console.error(`CECICS MCP Server running on stdio (degraded mode): ${getPoolInitError()}`);
    }
}
main().catch((error) => {
    console.error("Fatal error in main():", error);
    process.exit(1);
});
//# sourceMappingURL=index.js.map