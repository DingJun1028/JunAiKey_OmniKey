export class KnowledgeExtractor {
    constructor() {
        this.snippets = [];
    }
    /**
     * 擷取一段知識片段
     * @param content 內容
     * @param source 來源
     * @returns KnowledgeSnippet
     */
    extract(content, source) {
        const snippet = {
            id: `ks_${Date.now()}`,
            content,
            source,
            extractedAt: new Date().toISOString()
        };
        this.snippets.push(snippet);
        return snippet;
    }
    /**
     * 取得所有知識片段
     * @returns KnowledgeSnippet[]
     */
    getAllSnippets() {
        return this.snippets;
    }
}
