import { MaintenancePrediction } from './MaintenanceService';

export interface AIInsight {
    content: string;
    model: string;
    timestamp: Date;
}

class AIService {
    private static instance: AIService;
    private readonly apiUrl = process.env.GEMMA4_API_URL || 'https://pnt.badt.vn/gemma4';
    private readonly qwenUrl = 'https://pnt.badt.vn/agenticcoder';
    private readonly apiToken = process.env.GEMMA4_API_TOKEN || '68f67779de494d422cc6fe17f7f20b3974a6fdcb46cb804fbab24b232aaa6013';

    private constructor() {}

    public static getInstance(): AIService {
        if (!AIService.instance) {
            AIService.instance = new AIService();
        }
        return AIService.instance;
    }

    private async callAI(
        prompt: string, 
        systemPrompt: string = "Bạn là một chuyên gia quản lý thiết bị y tế.",
        modelType: 'gemma' | 'qwen' = 'gemma'
    ): Promise<string> {
        try {
            const url = modelType === 'gemma' ? this.apiUrl : this.qwenUrl;
            
            const response = await fetch(`${url}/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiToken}`
                },
                body: JSON.stringify({
                    prompt,
                    system_prompt: systemPrompt,
                    max_tokens: 2048,
                    temperature: 0.7,
                    enable_thinking: true
                })
            });

            if (!response.ok) {
                throw new Error(`AI API error: ${response.status}`);
            }

            const data = await response.json();
            return data.response || data.output || data.text || "Không thể lấy nhận định từ AI.";
        } catch (error) {
            console.error('AIService Error:', error);
            return "Lỗi kết nối hệ thống AI.";
        }
    }

    /**
     * Sinh nhận định về tình trạng bảo trì thiết bị (Dùng Gemma4)
     */
    async getMaintenanceInsight(predictions: MaintenancePrediction[]): Promise<AIInsight> {
        const criticalItems = predictions.filter(p => p.health_score < 60);
        
        const dataSummary = criticalItems.slice(0, 10).map(p => 
            `- ${p.equipment_name} (${p.barcode_stt}): Health ${p.health_score}%, Rented ${p.usage_count} times.`
        ).join('\n');

        const prompt = `
Dưới đây là danh sách các thiết bị y tế có chỉ số sức khỏe thấp:
${dataSummary}

Hãy phân tích và đưa ra khuyến nghị bảo trì ngắn gọn.
`;

        const content = await this.callAI(prompt, "Bạn là kỹ sư bảo trì thiết bị y tế.", 'gemma');
        
        return {
            content,
            model: 'Gemma4',
            timestamp: new Date()
        };
    }

    /**
     * Sinh báo cáo tóm tắt điều hành từ dữ liệu tổng hợp (Dùng Qwen3)
     */
    async getExecutiveSummary(reportData: any): Promise<AIInsight> {
        const prompt = `
Dưới đây là dữ liệu thống kê vận hành kho thiết bị:
${JSON.stringify(reportData, null, 2)}

Hãy viết một bản tóm tắt điều hành (Executive Summary) chuyên nghiệp bao gồm:
1. Đánh giá quy mô và cơ cấu kho.
2. Phân tích hiệu suất sử dụng của các phòng ban.
3. Đề xuất chiến lược tối ưu hóa.

Yêu cầu: Viết bằng TIẾNG VIỆT, chuyên nghiệp, có chiều sâu quản trị.
`;

        const content = await this.callAI(prompt, "Bạn là Giám đốc vận hành (COO) chuyên nghiệp.", 'qwen');
        
        return {
            content,
            model: 'Qwen3-Agentic',
            timestamp: new Date()
        };
    }
}

export const aiService = AIService.getInstance();
