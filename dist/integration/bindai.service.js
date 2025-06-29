// BindAiService - REST API integration for BindAi
// 支援 API 金鑰管理、錯誤處理、i18n
import axios from 'axios';
export class BindAiService {
    constructor(options) {
        this.apiKey = options.apiKey || process.env.BINDAI_API_KEY || '';
        this.baseUrl = options.baseUrl || 'https://api.bindai.com/v1';
        this.locale = options.locale || 'en';
        this.http = axios.create({
            baseURL: this.baseUrl,
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json',
                'Accept-Language': this.locale,
            },
        });
    }
    /**
     * Call BindAi completion API
     * @param prompt 輸入提示
     * @returns 回應內容
     */
    async complete(prompt) {
        try {
            const response = await this.http.post('/complete', { prompt });
            return response.data.result;
        }
        catch (error) {
            // i18n error handling
            if (this.locale === 'zh-tw') {
                throw new Error('BindAi 請求失敗: ' + (error?.response?.data?.message || error.message));
            }
            throw new Error('BindAi request failed: ' + (error?.response?.data?.message || error.message));
        }
    }
}
// Plugin registration example
// Orchestrator.registerAgent('bindai', new BindAiService({ apiKey: 'YOUR_KEY' }));
