import { GoogleGenAI } from '@google/genai';

const API_KEY = process.env.GEMINI_API_KEY || '';

let ai: GoogleGenAI | null = null;

function getClient(): GoogleGenAI {
    if (!ai) {
        if (!API_KEY) {
            throw new Error('GEMINI_API_KEY chưa được cấu hình. Kiểm tra file .env.local');
        }
        ai = new GoogleGenAI({ apiKey: API_KEY });
    }
    return ai;
}

const MODEL = 'gemini-2.0-flash';

/**
 * Phân tích ảnh công trường
 */
export async function analyzeConstructionImage(
    imageBase64: string,
    mimeType: string = 'image/jpeg'
): Promise<string> {
    const client = getClient();
    const response = await client.models.generateContent({
        model: MODEL,
        contents: [
            {
                role: 'user',
                parts: [
                    {
                        inlineData: {
                            data: imageBase64,
                            mimeType,
                        },
                    },
                    {
                        text: `Bạn là chuyên gia giám sát thi công xây dựng. Hãy phân tích ảnh công trường này và cho biết:
1. Tiến độ thi công hiện tại (% hoàn thành ước tính)
2. Vật liệu nhận diện được
3. Cảnh báo (nếu có vấn đề về an toàn, chất lượng)
4. Gợi ý cải thiện

Trả lời ngắn gọn bằng tiếng Việt.`,
                    },
                ],
            },
        ],
    });

    return response.text || 'Không thể phân tích ảnh.';
}

/**
 * Chat với AI về dự án xây dựng
 */
export async function chatWithAI(message: string, context?: string): Promise<string> {
    const client = getClient();

    const systemPrompt = `Bạn là trợ lý AI chuyên về giám sát thi công xây dựng nhà ở tại Việt Nam.
Bạn có kiến thức về: vật liệu xây dựng, quy trình thi công, chi phí, an toàn lao động, luật xây dựng VN.
Trả lời ngắn gọn, dễ hiểu bằng tiếng Việt.
${context ? `\nThông tin dự án hiện tại:\n${context}` : ''}`;

    const response = await client.models.generateContent({
        model: MODEL,
        contents: [
            {
                role: 'user',
                parts: [{ text: `${systemPrompt}\n\nCâu hỏi: ${message}` }],
            },
        ],
    });

    return response.text || 'Xin lỗi, em không thể trả lời lúc này.';
}

/**
 * Dự đoán tiến độ dựa trên dữ liệu
 */
export async function predictProgress(
    steps: { label: string; status: string; progress?: number }[],
    budget: number,
    spent: number
): Promise<string> {
    const client = getClient();
    const stepsText = steps
        .map((s) => `- ${s.label}: ${s.status}${s.progress ? ` (${s.progress}%)` : ''}`)
        .join('\n');

    const response = await client.models.generateContent({
        model: MODEL,
        contents: [
            {
                role: 'user',
                parts: [
                    {
                        text: `Bạn là chuyên gia giám sát thi công. Dựa trên dữ liệu sau, hãy đưa ra nhận xét ngắn gọn:

Các bước thi công:
${stepsText}

Ngân sách: ${budget.toLocaleString()}đ
Đã chi: ${spent.toLocaleString()}đ (${Math.round((spent / budget) * 100)}%)

Hãy cho biết:
1. Đánh giá tiến độ tổng thể
2. Rủi ro về ngân sách
3. Gợi ý 1-2 điều nên làm tiếp

Trả lời ngắn gọn bằng tiếng Việt.`,
                    },
                ],
            },
        ],
    });

    return response.text || 'Không thể dự đoán lúc này.';
}

/**
 * Kiểm tra API key đã cấu hình chưa
 */
export function isAPIKeyConfigured(): boolean {
    return !!API_KEY;
}
