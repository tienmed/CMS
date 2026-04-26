import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";


const server = new McpServer({
    name: "cecics-equipment-manager",
    version: "1.0.0"
});

    return {
        content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }]
    };
}


// Tool: List all equipment
server.registerTool(
    "list_equipment",
    {
        description: "Lấy danh sách tất cả thiết bị trong kho CECICS",
        inputSchema: z.object({

        })
    },
    async ({ limit, type_id }) => {
        try {
            let query = "SELECT * FROM equipment WHERE deleted_at IS NULL";
            const params: Array<number> = [];


            query += " LIMIT ?";
            params.push(safeNumberLimit(limit));


    }
);

// Tool: Search equipment
server.registerTool(
    "search_equipment",
    {
        description: "Tìm kiếm thiết bị theo tên hoặc mã barcode",
        inputSchema: z.object({

    }
);

// Tool: Get item status by barcode
server.registerTool(
    "get_item_status",
    {
        description: "Kiểm tra trạng thái và vị trí của một mẫu vật cụ thể qua mã vạch (barcode_stt)",
        inputSchema: z.object({
            barcode: z.string().trim().min(1).max(100).describe("Mã vạch của thiết bị (barcode_stt)")
        })
    },
    async ({ barcode }) => {
        try {
            const query = `
      SELECT ei.*, e.name as equipment_name, es.name as status_name
      FROM equipment_item ei
      JOIN equipment e ON ei.equipment_id = e.id
      JOIN equipment_status es ON ei.equipment_status_id = es.id
      WHERE ei.barcode_stt = ? AND ei.deleted_at IS NULL
    `;

    }
);

// Tool: Get recent usage
server.registerTool(
    "get_recent_usage",
    {
        description: "Lấy lịch sử mượn trả thiết bị gần đây",
        inputSchema: z.object({

        })
    },
    async ({ limit }) => {
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

    }
);

async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    if (getPool()) {
        console.error("CECICS MCP Server running on stdio (MySQL connected)");
    } else {
        console.error(`CECICS MCP Server running on stdio (degraded mode): ${getPoolInitError()}`);
    }
}

main().catch((error) => {
    console.error("Fatal error in main():", error);
    process.exit(1);
});
