"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KnowledgeExtractor = void 0;
var KnowledgeExtractor = /** @class */ (function () {
    function KnowledgeExtractor() {
        this.snippets = [];
    }
    /**
     * 擷取一段知識片段
     * @param content 內容
     * @param source 來源
     * @returns KnowledgeSnippet
     */
    KnowledgeExtractor.prototype.extract = function (content, source) {
        var snippet = {
            id: "ks_".concat(Date.now()),
            content: content,
            source: source,
            extractedAt: new Date().toISOString()
        };
        this.snippets.push(snippet);
        return snippet;
    };
    /**
     * 取得所有知識片段
     * @returns KnowledgeSnippet[]
     */
    KnowledgeExtractor.prototype.getAllSnippets = function () {
        return this.snippets;
    };
    return KnowledgeExtractor;
}());
exports.KnowledgeExtractor = KnowledgeExtractor;
