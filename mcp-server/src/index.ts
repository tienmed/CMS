import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import pool from "./db.js";

const server = new McpServer({
    name: "cecics-equipment-manager",
    version: "1.0.0"
});

// Tool: List all equipment
server.registerTool(
    "list_equipment",
    {
        description: "Lấy danh sách tất cả thiết bị trong kho CECICS",
        inputSchema: z.object({
            limit: z.number().default(50).describe("Số lượng bản ghi tối đa"),
            type_id: z.number().optional().describe("Lọc theo loại thiết bị (type_id)")
        })
    },
    async ({ limit, type_id }) => {
        let query = "SELECT * FROM equipment WHERE deleted_at IS NULL";
        const params: any[] = [];

        if (type_id) {
            query += " AND type_id = ?";
            params.push(type_id);
        }

        query += " LIMIT ?";
        params.push(limit);

        const [rows] = await pool.query(query, params);
        return {
            content: [{ type: "text", text: JSON.stringify(rows, null, 2) }]
        };
    }
);

// Tool: Search equipment
server.registerTool(
    "search_equipment",
    {
        description: "Tìm kiếm thiết bị theo tên hoặc mã barcode",
        inputSchema: z.object({
            query: z.string().describe("Từ khóa tìm kiếm (tên hoặc barcode)")
        })
    },
    async ({ query }) => {
        const sql = "SELECT * FROM equipment WHERE (name LIKE ? OR barcode LIKE ?) AND deleted_at IS NULL LIMIT 20";
        const searchTerm = `%${query}%`;
        const [rows] = await pool.query(sql, [searchTerm, searchTerm]);
        return {
            content: [{ type: "text", text: JSON.stringify(rows, null, 2) }]
        };
    }
);

// Tool: Get item status by barcode
server.registerTool(
    "get_item_status",
    {
        description: "Kiểm tra trạng thái và vị trí của một mẫu vật cụ thể qua mã vạch (barcode_stt)",
        inputSchema: z.object({
            barcode: z.string().describe("Mã vạch của thiết bị (barcode_stt)")
        })
    },
    async ({ barcode }) => {
        const query = `
      SELECT ei.*, e.name as equipment_name, es.name as status_name
      FROM equipment_item ei
      JOIN equipment e ON ei.equipment_id = e.id
      JOIN equipment_status es ON ei.equipment_status_id = es.id
      WHERE ei.barcode_stt = ? AND ei.deleted_at IS NULL
    `;
        const [rows] = await pool.query(query, [barcode]) as any;
        if (rows.length === 0) {
            return { content: [{ type: "text", text: `Không tìm thấy thiết bị với mã vạch: ${barcode}` }] };
        }
        return {
            content: [{ type: "text", text: JSON.stringify(rows[0], null, 2) }]
        };
    }
);

// Tool: Get recent usage
server.registerTool(
    "get_recent_usage",
    {
        description: "Lấy lịch sử mượn trả thiết bị gần đây",
        inputSchema: z.object({
            limit: z.number().default(10).describe("Số lượng bản ghi gần nhất")
        })
    },
    async ({ limit }) => {
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
        const [rows] = await pool.query(sql, [limit]);
        return {
            content: [{ type: "text", text: JSON.stringify(rows, null, 2) }]
        };
    }
);

async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("CECICS MCP Server running on stdio");
}

main().catch((error) => {
    console.error("Fatal error in main():", error);
    process.exit(1);
});
