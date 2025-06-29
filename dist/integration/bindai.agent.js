// BindAiAgent - 將 BindAiService 包裝為 agent/plugin
import { BindAiService } from './bindai.service';
export class BindAiAgent {
    constructor(apiKey, locale) {
        this.service = new BindAiService({ apiKey, locale });
    }
    async execute(params) {
        const result = await this.service.complete(params.prompt);
        return { output: result };
    }
}
// 註冊範例（可於 AgentFactory 擴充）
// AgentFactory.register('bindai', new BindAiAgent(process.env.BINDAI_API_KEY, 'zh-tw'));
