import { MaintenancePrediction } from './MaintenanceService';

export type AIModelType = 'qwen3' | 'qwen2.5' | 'gemma4';

export interface AIInsight {
    content: string;
    model: string;
    timestamp: Date;
}

class AIService {
    private static instance: AIService;
    
    // Cấu hình URL cho các mô hình
    private readonly urls: Record<AIModelType, string> = {
        'gemma4': process.env.GEMMA4_API_URL || 'https://pnt.badt.vn/gemma4',
        'qwen3': process.env.QWEN3_API_URL || 'https://pnt.badt.vn/agenticcoder',
        'qwen2.5': process.env.QWEN25_API_URL || 'https://pnt.badt.vn/qwen25' // Giả định URL cho Qwen2.5
    };

    private readonly apiToken = process.env.AI_API_TOKEN || '68f67779de494d422cc6fe17f7f20b3974a6fdcb46cb804fbab24b232aaa6013';

    private constructor() {}

    public static getInstance(): AIService {
        if (!AIService.instance) {
            AIService.instance = new AIService();
        }
        return AIService.instance;
    }

    /**
     * Phương thức gọi AI dùng chung với cơ chế Fallback
     */
    private async callAI(
        prompt: string, 
        systemPrompt: string = "Bạn là một chuyên gia quản lý thiết bị y tế.",
        model: AIModelType = 'gemma4',
        options: { temperature?: number, enableThinking?: boolean } = {}
    ): Promise<string> {
        try {
            const url = this.urls[model];
            
            const response = await fetch(`${url}/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiToken}`
                },
                body: JSON.stringify({
                    prompt,
                    system_prompt: systemPrompt,
                    max_tokens: 4096, // Tăng giới hạn cho báo cáo dài
                    temperature: options.temperature ?? 0.7,
                    enable_thinking: options.enableThinking ?? (model === 'qwen3')
                })
            });

            if (!response.ok) {
                // Cơ chế Fallback: Nếu qwen3 hoặc qwen2.5 lỗi, thử hạ cấp xuống mô hình khác
                if (model === 'qwen3' || model === 'qwen2.5') {
                    const fallbackModel: AIModelType = model === 'qwen3' ? 'qwen2.5' : 'gemma4';
                    console.warn(`Model ${model} failed, falling back to ${fallbackModel}`);
                    return this.callAI(prompt, systemPrompt, fallbackModel, options);
                }
                throw new Error(`AI API error: ${response.status}`);
            }

            const data = await response.json();
            return data.response || data.output || data.text || "Không thể lấy nhận định từ AI.";
        } catch (error) {
            console.error(`AIService Error (${model}):`, error);
            // Nếu là lỗi kết nối mạng và chưa phải là model thấp nhất, thử fallback
            if (model !== 'gemma4') {
                return this.callAI(prompt, systemPrompt, 'gemma4', options);
            }
            return "Lỗi kết nối hệ thống AI. Vui lòng thử lại sau.";
        }
    }

    /**
     * Sinh nhận định về tình trạng bảo trì thiết bị (Sử dụng Gemma4 - Nhanh, chuyên sâu)
     */
    async getMaintenanceInsight(predictions: MaintenancePrediction[]): Promise<AIInsight> {
        const criticalItems = predictions.filter(p => p.health_score < 60);
        
        const dataSummary = criticalItems.slice(0, 15).map(p => 
            `- ${p.equipment_name} (${p.barcode_stt}): Health ${p.health_score}%, Rented ${p.usage_count} times.`
        ).join('\n');

        const prompt = `
Dưới đây là danh sách các thiết bị y tế có chỉ số sức khỏe thấp (cần lưu ý):
${dataSummary}

Hãy đóng vai một kỹ sư bảo trì giàu kinh nghiệm, phân tích danh sách trên và đưa ra:
1. Đánh giá tổng quát về rủi ro vận hành.
2. Các hành động khắc phục cụ thể cho 3 thiết bị rủi ro nhất.
3. Lời khuyên để kéo dài tuổi thọ thiết bị.

Yêu cầu: Ngắn gọn, súc tích, tập trung vào kỹ thuật.
`;

        const content = await this.callAI(prompt, "Bạn là kỹ sư bảo trì thiết bị y tế chuyên nghiệp.", 'gemma4');
        
        return {
            content,
            model: 'Gemma4',
            timestamp: new Date()
        };
    }

    /**
     * Sinh báo cáo tóm tắt điều hành (Sử dụng Qwen3 - Tư duy chiến lược)
     */
    async getExecutiveSummary(reportData: any): Promise<AIInsight> {
        const prompt = `
Dưới đây là dữ liệu thống kê vận hành kho thiết bị y tế:
${JSON.stringify(reportData, null, 2)}

Hãy viết một bản tóm tắt điều hành (Executive Summary) đẳng cấp dành cho Ban Giám đốc:
1. Tổng quan hiệu năng: Quy mô, tốc độ luân chuyển và hiệu suất sử dụng.
2. Phân tích tài chính & rủi ro: Các phòng ban dùng lãng phí hoặc thiết bị xuống cấp nhanh.
3. Kiến nghị chiến lược: Đề xuất tối ưu hóa quy trình cấp phát và kế hoạch đầu tư.

Yêu cầu: Văn phong chuyên nghiệp, có chiều sâu quản trị, dùng tiếng Việt.
`;

        const content = await this.callAI(prompt, "Bạn là Giám đốc vận hành (COO) chuyên nghiệp.", 'qwen3');
        
        return {
            content,
            model: 'Qwen3-Agentic',
            timestamp: new Date()
        };
    }

    /**
     * Trích xuất dữ liệu cấu trúc hoặc kiểm tra logic (Sử dụng Qwen2.5 - Cấu trúc tốt)
     */
    async analyzeDataLogic(rawData: string): Promise<any> {
        const prompt = `
Hãy phân tích dữ liệu sau và trích xuất thành định dạng JSON sạch:
${rawData}

Yêu cầu: 
- Chỉ trả về JSON, không kèm giải thích.
- Phân loại các thiết bị theo tình trạng (Tốt, Cần bảo trì, Hỏng).
`;

        const response = await this.callAI(prompt, "Bạn là chuyên gia xử lý dữ liệu và cấu trúc JSON.", 'qwen2.5', { temperature: 0.1 });
        try {
            return JSON.parse(response);
        } catch {
            return { rawResponse: response };
        }
    }
}

export const aiService = AIService.getInstance();
