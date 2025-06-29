var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _a, _b;
var _this = this;
""(__makeTemplateObject(["typescript\n// src/pages/Keyboard.tsx\n// Smart Keyboard Page (Simulated iOS Traditional Chinese/English Keyboard)\n// Provides a simulated keyboard UI with smart suggestions and function buttons.\n// --- New: Create a page for the simulated smart keyboard UI --\n// --- New: Implement basic keyboard layout (Bopomofo/English) --\n// --- New: Add smart suggestion area (placeholder) --\n// --- New: Add function button area (placeholder) --\n// --- New: Add input display area --\n// --- New: Add basic key press handling --\n// --- New: Add language switch --\n// --- New: Add placeholder for smart suggestions and knowledge base results --\n// --- New: Add placeholder for function button actions --\n// --- New: Add placeholder for AI response display --\n// --- New: Add Mobile Git Sync Buttons --\n// --- Modified: Refactor to use MessageBus for communication with InputAgent --\n// --- Modified: Implement correlationId logic for responses --\n// --- Modified: Refactor Suggested Action execution to use MessageBus --\n// --- New: Implement Feedback Buttons for AI Responses --\n// --- Modified: Update Function Button handlers to send specific messages --\n// --- Modified: Update Suggested Action handler to send ActionIntent directly --\n// --- Modified: Add state for feedback status on messages --\n// --- Modified: Add \"Text Extraction\" button to function bar --\n// --- Modified: Refactor Function Button handlers to send specific messages --\n// --- New: Add debounced input listener to send message for real-time suggestions --\n// --- Modified: Display smart suggestions and knowledge base results from SuggestionAgent --\n// --- New: Add \"Read URL\" and \"Analyze File\" buttons to function bar --\n// --- New: Add \"Article Summary\" button and logic (simulated) --\n\n\nimport React, { useState, useEffect, useRef, useCallback } from \"react\"; // Import useRef, useCallback\nimport {\n  ClipboardList, CalendarDays, Text, QrCode, Calculator, Sparkles, Palette, Languages, Mic, Type, Share2, BookKey, GitPullRequest, GitPush, GitMerge, ThumbsUp, ThumbsDown, Camera, Lightbulb, Globe, FileText, FileSearch, Workflow\n} from \"lucide-react\"; // Import Git icons, ThumbsUp, ThumbsDown, Camera, Lightbulb, Globe, FileText, FileSearch, Workflow\nimport { KnowledgeRecord, EvolutionaryInsight, ActionIntent, AgentMessage } from '../interfaces'; // Import necessary interfaces\n\n\n// Define data structures (moved from Markdown)\n// TODO: These should be fetched dynamically from the Knowledge Base or other modules (Part of \u96D9\u5410\u540C\u6B65\u9818\u57DF / \u6C38\u4E45\u8A18\u61B6\u4E2D\u5FC3)\nconst FUNCTION_TABS = [\n  { icon: Sparkles, label: \"AI\u751F\u6210\", actionType: 'answer_via_ai' }, // AI Generation (Leverages \u667A\u6167\u6C89\u6FB1\u79D8\u8853) - Use answer_via_ai for general AI chat\n  { icon: BookKey, label: \"\u77E5\u8B58\u5EAB\", actionType: 'search_knowledge' }, // Knowledge Base Interaction (Leverages \u6C38\u4E45\u8A18\u61B6\u4E2D\u5FC3)\n  { icon: Camera, label: \"\u6587\u5B57\u64F7\u53D6\", actionType: 'simulate_visual_reading' }, // New: Text Extraction (Simulated via Device Agent)\n  { icon: FileSearch, label: \"\u6587\u7AE0\u6458\u8981\", actionType: 'read_url' }, // New: Article Summary (Simulated via Device Agent/WebRune) - Reusing read_url action type\n  { icon: FileText, label: \"\u5206\u6790\u6A94\u6848\", actionType: 'analyze_file_content' }, // New: Analyze file content (Simulated via Device Agent)\n  { icon: ClipboardList, label: \"\u526A\u8CBC\u7C3F\", actionType: 'trigger_clipboard_action' }, // Clipboard Access (Requires Device Adapter Rune)\n  { icon: CalendarDays, label: \"\u65E5\u671F\u63D2\u5165\", actionType: 'insert_date' }, // Date Insertion (Simple Utility or Rune)\n  { icon: QrCode, label: \"QR\u751F\u6210\", actionType: 'qr_generate' }, // QR Code Generation (API Adapter Rune)\n  { icon: Palette, label: \"\u4E3B\u984C\u5207\u63DB\", actionType: 'change_theme' }, // UI Component Rune\n  { icon: Share2, label: \"\u5206\u4EAB\", actionType: 'share_content' }, // Sharing (Requires Device Adapter Rune)\n  // { icon: Calculator, label: \"\u8A08\u7B97\u6A5F\" }, // Calculator (Simple Utility or Script Rune) - Removed for space\n  // { icon: Languages, label: \"\u7FFB\u8B6F\" }, // Translation (AI Agent Rune) - Removed for space\n  // { icon: Mic, label: \"\u8A9E\u97F3\u8F38\u5165\" }, // Voice Input (Device Adapter Rune) - Removed for space\n  // { icon: Type, label: \"\u624B\u5BEB\u8F38\u5165\" }, // Handwriting Input (Device Adapter Rune) - Removed for space\n  // --- Removed: Read URL button, now covered by Article Summary --\n  // { icon: Globe, label: \"\u8B80\u53D6\u7DB2\u5740\", actionType: 'read_url' }, // Read URL content\n  // --- End Removed --\n];\n\n// --- New: Add Mobile Git Sync Buttons ---\nconst MOBILE_GIT_SYNC_BUTTONS = [\n    { icon: GitPullRequest, label: \"Git Pull\", action: 'pull' },\n    { icon: GitPush, label: \"Git Push\", action: 'push' },\n    { icon: GitMerge, label: \"Git Sync\", action: 'bidirectional' },\n];\n// --- End New ---\n\n// TODO: These should be fetched dynamically from the Knowledge Base or suggested by AI (Part of \u6C38\u4E45\u8A18\u61B6\u4E2D\u5FC3 / \u667A\u6167\u6C89\u6FB1\u79D8\u8853)\nconst PHRASES = [\n  { group: \"\u5E38\u7528\", items: [\"\u4F60\u597D\uFF0C\u4ECA\u5929\u6709\u4EC0\u9EBC\u8A08\u756B\uFF1F\", \"\u6E96\u5099\u4E0B\u73ED\u4E86\uFF01\", \"\u5348\u9910\u5403\u4EC0\u9EBC\uFF1F\", \"\u9031\u6703\u91CD\u9EDE\uFF1A\u2026\", \"\u5DF2\u6536\u5230\uFF0C\u99AC\u4E0A\u8655\u7406\u3002\"] },\n  { group: \"\u6A21\u677F\", items: [\"[\u516C\u53F8\u540D] \u5730\u5740\uFF1A\", \"\u6211\u7684\u90F5\u7BB1\uFF1A\", \"\u5B85\u914D\u5230\u8CA8\u901A\u77E5\uFF1A\u2026\"] },\n  // AI\u63A8\u85A6 will be dynamic\n];\n\n// Standard keyboard layouts (can be expanded or customized)\nconst BOPOMOFO_KEYS = [\n  [\"\u3105\",\"\u3106\",\"\u3107\",\"\u3108\",\"\u3109\",\"\u310A\",\"\u310B\",\"\u310C\",\"\u310D\",\"\u310E\",\"\u310F\",\"\u3110\",\"\u3111\",\"\u3112\"],\n  [\"\u3113\",\"\u3114\",\"\u3115\",\"\u3116\",\"\u3117\",\"\u3118\",\"\u3119\",\"\u3127\",\"\u3128\",\"\u3129\",\"\u311A\",\"\u311B\",\"\u311C\",\"\u311D\"],\n  [\"\u311E\",\"\u311F\",\"\u3120\",\"\u3121\",\"\u3122\",\"\u3123\",\"\u3124\",\"\u3125\",\"\u3126\"],\n  [\"\u02CA\",\"\u02C7\",\"\u02CB\",\"\u02D9\"] // Tones\n];\n\nconst ENGLISH_KEYS = [\n  [\"Q\",\"W\",\"E\",\"R\",\"T\",\"Y\",\"U\",\"I\",\"O\",\"P\"],\n  [\"A\",\"S\",\"D\",\"F\",\"G\",\"H\",\"J\",\"K\",\"L\"],\n  [\"Z\",\"X\",\"C\",\"V\",\"B\",\"N\",\"M\"]\n];\n\n// Access core modules from the global window object (for MVP simplicity)\ndeclare const window: any;\nconst authorityForgingEngine: any = window.systemContext?.authorityForgingEngine; // Use any for action recording (\u6B0A\u80FD\u935B\u9020)\nconst junaiAssistant: any = window.systemContext?.junaiAssistant; // Access AI Assistant (\u667A\u6167\u6C89\u6FB1\u79D8\u8853) - Still used by InputAgent for MVP\nconst knowledgeSync: any = window.systemContext?.knowledgeSync; // Access Knowledge Sync (\u6C38\u4E45\u8A18\u61B6\u4E2D\u5FC3)\nconst runeEngraftingCenter: any = window.systemContext?.sacredRuneEngraver; // Access Rune Engrafting Center (\u7B26\u6587\u5D4C\u5408)\nconst wisdomSecretArt: any = window.systemContext?.wisdomSecretArt; // Access Wisdom Secret Art (\u667A\u6167\u6C89\u6FB1\u79D8\u8853)\nconst evolutionEngine: any = window.systemContext?.evolutionEngine; // Access Evolution Engine (\u7120\u9650\u9032\u5316)\nconst systemContext: any = window.systemContext; // Access the full context for currentUser\n\n\nconst Keyboard: React.FC = () => { // Changed component name to Keyboard and added FC type\n  const [kb, setKb] = useState<'zh'|'en'>(\"zh\"); // 'zh' for Bopomofo, 'en' for English\n  const [input, setInput] = useState(\"\"); // State to hold the simulated input text\n  const [isProcessingFunction, setIsProcessingFunction] = useState(false); // State for function button loading\n  const [processingFunctionLabel, setProcessingFunctionLabel] = useState<string | null>(null); // Track which function is processing\n  const [smartSuggestions, setSmartSuggestions] = useState<ActionIntent[]>([]); // State for AI/Evolution suggestions (now ActionIntent objects)\n  const [knowledgeResults, setKnowledgeResults] = useState<KnowledgeRecord[]>([]); // State for KB search results\n  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);\n  const [isLoadingKnowledge, setIsLoadingKnowledge] = useState(false);\n  const [aiResponse, setAiResponse] = useState<any>(null); // State to display AI response/action result (can be object)\n  const [showAiResponseModal, setShowAiResponseModal] = useState(false); // State to control AI response modal\n  const [useSemanticSearch, setUseSemanticSearch] = useState(false); // State to toggle semantic search\n\n  // --- New: State for tracking pending requests by correlationId ---\n  const [pendingRequests, setPendingRequests] = useState<Record<string, boolean>>({});\n  // --- End New ---\n\n  // --- New: State to temporarily store decisions by correlationId until the KB record arrives --\n  const [pendingDecisions, setPendingDecisions] = useState<Record<string, ActionIntent>>({});\n  // --- End New ---\n\n  // --- New: State for feedback status on messages ---\n  const [feedbackStatus, setFeedbackStatus] = useState<Record<string, 'correct' | 'incorrect' | null>>({}); // Map: recordId -> feedback status\n  // --- End New ---\n\n  // --- New: State for multimodal input (needed for Text Extraction) ---\n  const [selectedImage, setSelectedImage] = useState<File | null>(null);\n  const imageInputRef = useRef<HTMLInputElement>(null); // Ref for hidden file input\n  // --- New: Add state for selected file for analysis ---\n  const [selectedFile, setSelectedFile] = useState<File | null>(null);\n  const fileInputRef = useRef<HTMLInputElement>(null); // Ref for hidden file input\n  // --- End New ---\n\n  // --- New: State for error display ---\n  const [error, setError] = useState<string | null>(null);\n  // --- End New ---\n\n\n  // TODO: Implement fetching smart suggestions based on input and context\n  // useEffect(() => {\n  //   // Fetch suggestions when input changes or context changes\n  //   // This would involve calling WisdomSecretArt or EvolutionEngine\n  //   // For MVP, suggestions are static placeholders\n  // }, [input, systemContext?.currentUser]);\n\n  // TODO: Implement fetching knowledge results based on input and search toggle\n  // useEffect(() => {\n  //   // Fetch knowledge results when input changes or search toggle changes\n  //   // This would involve calling KnowledgeSync\n  //   // For MVP, knowledge results are static placeholders\n  // }, [input, useSemanticSearch, systemContext?.currentUser]);\n\n\n  const handleKeyClick = (key: string) => {\n    setInput(prevInput => prevInput + key);\n  };\n\n  // --- New: Debounce input and send message for real-time suggestions --\n  useEffect(() => {\n      const userId = systemContext?.currentUser?.id;\n      if (!userId || !systemContext?.messageBus) {\n          // Clear suggestions if user logs out or MessageBus is not available\n          setSmartSuggestions([]);\n          setKnowledgeResults([]);\n          setIsLoadingSuggestions(false);\n          setIsLoadingKnowledge(false);\n          return;\n      }\n\n      // Debounce the input change\n      const handler = setTimeout(() => {\n          console.log("], ["typescript\n// src/pages/Keyboard.tsx\n// Smart Keyboard Page (Simulated iOS Traditional Chinese/English Keyboard)\n// Provides a simulated keyboard UI with smart suggestions and function buttons.\n// --- New: Create a page for the simulated smart keyboard UI --\n// --- New: Implement basic keyboard layout (Bopomofo/English) --\n// --- New: Add smart suggestion area (placeholder) --\n// --- New: Add function button area (placeholder) --\n// --- New: Add input display area --\n// --- New: Add basic key press handling --\n// --- New: Add language switch --\n// --- New: Add placeholder for smart suggestions and knowledge base results --\n// --- New: Add placeholder for function button actions --\n// --- New: Add placeholder for AI response display --\n// --- New: Add Mobile Git Sync Buttons --\n// --- Modified: Refactor to use MessageBus for communication with InputAgent --\n// --- Modified: Implement correlationId logic for responses --\n// --- Modified: Refactor Suggested Action execution to use MessageBus --\n// --- New: Implement Feedback Buttons for AI Responses --\n// --- Modified: Update Function Button handlers to send specific messages --\n// --- Modified: Update Suggested Action handler to send ActionIntent directly --\n// --- Modified: Add state for feedback status on messages --\n// --- Modified: Add \"Text Extraction\" button to function bar --\n// --- Modified: Refactor Function Button handlers to send specific messages --\n// --- New: Add debounced input listener to send message for real-time suggestions --\n// --- Modified: Display smart suggestions and knowledge base results from SuggestionAgent --\n// --- New: Add \"Read URL\" and \"Analyze File\" buttons to function bar --\n// --- New: Add \"Article Summary\" button and logic (simulated) --\n\n\nimport React, { useState, useEffect, useRef, useCallback } from \"react\"; // Import useRef, useCallback\nimport {\n  ClipboardList, CalendarDays, Text, QrCode, Calculator, Sparkles, Palette, Languages, Mic, Type, Share2, BookKey, GitPullRequest, GitPush, GitMerge, ThumbsUp, ThumbsDown, Camera, Lightbulb, Globe, FileText, FileSearch, Workflow\n} from \"lucide-react\"; // Import Git icons, ThumbsUp, ThumbsDown, Camera, Lightbulb, Globe, FileText, FileSearch, Workflow\nimport { KnowledgeRecord, EvolutionaryInsight, ActionIntent, AgentMessage } from '../interfaces'; // Import necessary interfaces\n\n\n// Define data structures (moved from Markdown)\n// TODO: These should be fetched dynamically from the Knowledge Base or other modules (Part of \\u96d9\\u5410\\u540c\\u6b65\\u9818\\u57df / \\u6c38\\u4e45\\u8a18\\u61b6\\u4e2d\\u5fc3)\nconst FUNCTION_TABS = [\n  { icon: Sparkles, label: \"AI\\u751f\\u6210\", actionType: 'answer_via_ai' }, // AI Generation (Leverages \\u667a\\u6167\\u6c89\\u6fb1\\u79d8\\u8853) - Use answer_via_ai for general AI chat\n  { icon: BookKey, label: \"\\u77e5\\u8b58\\u5eab\", actionType: 'search_knowledge' }, // Knowledge Base Interaction (Leverages \\u6c38\\u4e45\\u8a18\\u61b6\\u4e2d\\u5fc3)\n  { icon: Camera, label: \"\\u6587\\u5b57\\u64f7\\u53d6\", actionType: 'simulate_visual_reading' }, // New: Text Extraction (Simulated via Device Agent)\n  { icon: FileSearch, label: \"\\u6587\\u7ae0\\u6458\\u8981\", actionType: 'read_url' }, // New: Article Summary (Simulated via Device Agent/WebRune) - Reusing read_url action type\n  { icon: FileText, label: \"\\u5206\\u6790\\u6a94\\u6848\", actionType: 'analyze_file_content' }, // New: Analyze file content (Simulated via Device Agent)\n  { icon: ClipboardList, label: \"\\u526a\\u8cbc\\u7c3f\", actionType: 'trigger_clipboard_action' }, // Clipboard Access (Requires Device Adapter Rune)\n  { icon: CalendarDays, label: \"\\u65e5\\u671f\\u63d2\\u5165\", actionType: 'insert_date' }, // Date Insertion (Simple Utility or Rune)\n  { icon: QrCode, label: \"QR\\u751f\\u6210\", actionType: 'qr_generate' }, // QR Code Generation (API Adapter Rune)\n  { icon: Palette, label: \"\\u4e3b\\u984c\\u5207\\u63db\", actionType: 'change_theme' }, // UI Component Rune\n  { icon: Share2, label: \"\\u5206\\u4eab\", actionType: 'share_content' }, // Sharing (Requires Device Adapter Rune)\n  // { icon: Calculator, label: \"\\u8a08\\u7b97\\u6a5f\" }, // Calculator (Simple Utility or Script Rune) - Removed for space\n  // { icon: Languages, label: \"\\u7ffb\\u8b6f\" }, // Translation (AI Agent Rune) - Removed for space\n  // { icon: Mic, label: \"\\u8a9e\\u97f3\\u8f38\\u5165\" }, // Voice Input (Device Adapter Rune) - Removed for space\n  // { icon: Type, label: \"\\u624b\\u5beb\\u8f38\\u5165\" }, // Handwriting Input (Device Adapter Rune) - Removed for space\n  // --- Removed: Read URL button, now covered by Article Summary --\n  // { icon: Globe, label: \"\\u8b80\\u53d6\\u7db2\\u5740\", actionType: 'read_url' }, // Read URL content\n  // --- End Removed --\n];\n\n// --- New: Add Mobile Git Sync Buttons ---\nconst MOBILE_GIT_SYNC_BUTTONS = [\n    { icon: GitPullRequest, label: \"Git Pull\", action: 'pull' },\n    { icon: GitPush, label: \"Git Push\", action: 'push' },\n    { icon: GitMerge, label: \"Git Sync\", action: 'bidirectional' },\n];\n// --- End New ---\n\n// TODO: These should be fetched dynamically from the Knowledge Base or suggested by AI (Part of \\u6c38\\u4e45\\u8a18\\u61b6\\u4e2d\\u5fc3 / \\u667a\\u6167\\u6c89\\u6fb1\\u79d8\\u8853)\nconst PHRASES = [\n  { group: \"\\u5e38\\u7528\", items: [\"\\u4f60\\u597d\\uff0c\\u4eca\\u5929\\u6709\\u4ec0\\u9ebc\\u8a08\\u756b\\uff1f\", \"\\u6e96\\u5099\\u4e0b\\u73ed\\u4e86\\uff01\", \"\\u5348\\u9910\\u5403\\u4ec0\\u9ebc\\uff1f\", \"\\u9031\\u6703\\u91cd\\u9ede\\uff1a\\u2026\", \"\\u5df2\\u6536\\u5230\\uff0c\\u99ac\\u4e0a\\u8655\\u7406\\u3002\"] },\n  { group: \"\\u6a21\\u677f\", items: [\"[\\u516c\\u53f8\\u540d] \\u5730\\u5740\\uff1a\", \"\\u6211\\u7684\\u90f5\\u7bb1\\uff1a\", \"\\u5b85\\u914d\\u5230\\u8ca8\\u901a\\u77e5\\uff1a\\u2026\"] },\n  // AI\\u63a8\\u85a6 will be dynamic\n];\n\n// Standard keyboard layouts (can be expanded or customized)\nconst BOPOMOFO_KEYS = [\n  [\"\\u3105\",\"\\u3106\",\"\\u3107\",\"\\u3108\",\"\\u3109\",\"\\u310a\",\"\\u310b\",\"\\u310c\",\"\\u310d\",\"\\u310e\",\"\\u310f\",\"\\u3110\",\"\\u3111\",\"\\u3112\"],\n  [\"\\u3113\",\"\\u3114\",\"\\u3115\",\"\\u3116\",\"\\u3117\",\"\\u3118\",\"\\u3119\",\"\\u3127\",\"\\u3128\",\"\\u3129\",\"\\u311a\",\"\\u311b\",\"\\u311c\",\"\\u311d\"],\n  [\"\\u311e\",\"\\u311f\",\"\\u3120\",\"\\u3121\",\"\\u3122\",\"\\u3123\",\"\\u3124\",\"\\u3125\",\"\\u3126\"],\n  [\"\\u02ca\",\"\\u02c7\",\"\\u02cb\",\"\\u02d9\"] // Tones\n];\n\nconst ENGLISH_KEYS = [\n  [\"Q\",\"W\",\"E\",\"R\",\"T\",\"Y\",\"U\",\"I\",\"O\",\"P\"],\n  [\"A\",\"S\",\"D\",\"F\",\"G\",\"H\",\"J\",\"K\",\"L\"],\n  [\"Z\",\"X\",\"C\",\"V\",\"B\",\"N\",\"M\"]\n];\n\n// Access core modules from the global window object (for MVP simplicity)\ndeclare const window: any;\nconst authorityForgingEngine: any = window.systemContext?.authorityForgingEngine; // Use any for action recording (\\u6b0a\\u80fd\\u935b\\u9020)\nconst junaiAssistant: any = window.systemContext?.junaiAssistant; // Access AI Assistant (\\u667a\\u6167\\u6c89\\u6fb1\\u79d8\\u8853) - Still used by InputAgent for MVP\nconst knowledgeSync: any = window.systemContext?.knowledgeSync; // Access Knowledge Sync (\\u6c38\\u4e45\\u8a18\\u61b6\\u4e2d\\u5fc3)\nconst runeEngraftingCenter: any = window.systemContext?.sacredRuneEngraver; // Access Rune Engrafting Center (\\u7b26\\u6587\\u5d4c\\u5408)\nconst wisdomSecretArt: any = window.systemContext?.wisdomSecretArt; // Access Wisdom Secret Art (\\u667a\\u6167\\u6c89\\u6fb1\\u79d8\\u8853)\nconst evolutionEngine: any = window.systemContext?.evolutionEngine; // Access Evolution Engine (\\u7120\\u9650\\u9032\\u5316)\nconst systemContext: any = window.systemContext; // Access the full context for currentUser\n\n\nconst Keyboard: React.FC = () => { // Changed component name to Keyboard and added FC type\n  const [kb, setKb] = useState<'zh'|'en'>(\"zh\"); // 'zh' for Bopomofo, 'en' for English\n  const [input, setInput] = useState(\"\"); // State to hold the simulated input text\n  const [isProcessingFunction, setIsProcessingFunction] = useState(false); // State for function button loading\n  const [processingFunctionLabel, setProcessingFunctionLabel] = useState<string | null>(null); // Track which function is processing\n  const [smartSuggestions, setSmartSuggestions] = useState<ActionIntent[]>([]); // State for AI/Evolution suggestions (now ActionIntent objects)\n  const [knowledgeResults, setKnowledgeResults] = useState<KnowledgeRecord[]>([]); // State for KB search results\n  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);\n  const [isLoadingKnowledge, setIsLoadingKnowledge] = useState(false);\n  const [aiResponse, setAiResponse] = useState<any>(null); // State to display AI response/action result (can be object)\n  const [showAiResponseModal, setShowAiResponseModal] = useState(false); // State to control AI response modal\n  const [useSemanticSearch, setUseSemanticSearch] = useState(false); // State to toggle semantic search\n\n  // --- New: State for tracking pending requests by correlationId ---\n  const [pendingRequests, setPendingRequests] = useState<Record<string, boolean>>({});\n  // --- End New ---\n\n  // --- New: State to temporarily store decisions by correlationId until the KB record arrives --\n  const [pendingDecisions, setPendingDecisions] = useState<Record<string, ActionIntent>>({});\n  // --- End New ---\n\n  // --- New: State for feedback status on messages ---\n  const [feedbackStatus, setFeedbackStatus] = useState<Record<string, 'correct' | 'incorrect' | null>>({}); // Map: recordId -> feedback status\n  // --- End New ---\n\n  // --- New: State for multimodal input (needed for Text Extraction) ---\n  const [selectedImage, setSelectedImage] = useState<File | null>(null);\n  const imageInputRef = useRef<HTMLInputElement>(null); // Ref for hidden file input\n  // --- New: Add state for selected file for analysis ---\n  const [selectedFile, setSelectedFile] = useState<File | null>(null);\n  const fileInputRef = useRef<HTMLInputElement>(null); // Ref for hidden file input\n  // --- End New ---\n\n  // --- New: State for error display ---\n  const [error, setError] = useState<string | null>(null);\n  // --- End New ---\n\n\n  // TODO: Implement fetching smart suggestions based on input and context\n  // useEffect(() => {\n  //   // Fetch suggestions when input changes or context changes\n  //   // This would involve calling WisdomSecretArt or EvolutionEngine\n  //   // For MVP, suggestions are static placeholders\n  // }, [input, systemContext?.currentUser]);\n\n  // TODO: Implement fetching knowledge results based on input and search toggle\n  // useEffect(() => {\n  //   // Fetch knowledge results when input changes or search toggle changes\n  //   // This would involve calling KnowledgeSync\n  //   // For MVP, knowledge results are static placeholders\n  // }, [input, useSemanticSearch, systemContext?.currentUser]);\n\n\n  const handleKeyClick = (key: string) => {\n    setInput(prevInput => prevInput + key);\n  };\n\n  // --- New: Debounce input and send message for real-time suggestions --\n  useEffect(() => {\n      const userId = systemContext?.currentUser?.id;\n      if (!userId || !systemContext?.messageBus) {\n          // Clear suggestions if user logs out or MessageBus is not available\n          setSmartSuggestions([]);\n          setKnowledgeResults([]);\n          setIsLoadingSuggestions(false);\n          setIsLoadingKnowledge(false);\n          return;\n      }\n\n      // Debounce the input change\n      const handler = setTimeout(() => {\n          console.log("]));
Keyboard;
input;
changed, sending;
for (suggestions; ; )
    : ;
"${input}\"`);;
// Send a message to the SuggestionAgent
systemContext.messageBus.send({
    type: 'analyze_input_for_suggestions', // Message type for SuggestionAgent
    payload: { text: input, userId: userId, context: { page: 'keyboard' } }, // Pass input and context
    recipient: 'suggestion', // Target the SuggestionAgent
    // No correlationId needed as this is a fire-and-forget update request
});
// Set loading states immediately
setIsLoadingSuggestions(true);
setIsLoadingKnowledge(true);
500;
; // Wait 500ms after the last input change
// Cleanup function to clear the timeout if input changes again or component unmounts
return function () {
    clearTimeout(handler);
    // Optionally reset loading states on cleanup if needed
    // setIsLoadingSuggestions(false);
    // setIsLoadingKnowledge(false);
};
[input, (_a = systemContext === null || systemContext === void 0 ? void 0 : systemContext.currentUser) === null || _a === void 0 ? void 0 : _a.id, systemContext === null || systemContext === void 0 ? void 0 : systemContext.messageBus];
; // Re-run effect when input, user ID, or MessageBus changes
// --- End New ---
// --- New: Subscribe to suggestion_update messages from the MessageBus ---
useEffect(function () {
    var _a;
    var unsubscribeSuggestionUpdate;
    if (systemContext === null || systemContext === void 0 ? void 0 : systemContext.messageBus) { // Check if MessageBus is available
        var messageBus = systemContext.messageBus;
        var userId_1 = (_a = systemContext === null || systemContext === void 0 ? void 0 : systemContext.currentUser) === null || _a === void 0 ? void 0 : _a.id;
        unsubscribeSuggestionUpdate = messageBus.subscribe('suggestion_update', function (message) {
            var _a, _b, _c, _d, _e;
            // Check if this update is for the current user
            if (((_a = message.payload) === null || _a === void 0 ? void 0 : _a.userId) === userId_1) {
                console.log('Keyboard page received suggestion_update event:', message);
                // Update the suggestions and knowledge results states
                if ((_b = message.payload) === null || _b === void 0 ? void 0 : _b.suggestions) {
                    setSmartSuggestions(message.payload.suggestions);
                }
                if ((_c = message.payload) === null || _c === void 0 ? void 0 : _c.knowledgeResults) {
                    setKnowledgeResults(message.payload.knowledgeResults);
                }
                // Update loading states
                if (((_d = message.payload) === null || _d === void 0 ? void 0 : _d.isLoadingSuggestions) !== undefined) {
                    setIsLoadingSuggestions(message.payload.isLoadingSuggestions);
                }
                if (((_e = message.payload) === null || _e === void 0 ? void 0 : _e.isLoadingKnowledge) !== undefined) {
                    setIsLoadingKnowledge(message.payload.isLoadingKnowledge);
                }
            }
        });
    }
    return function () {
        // Unsubscribe on component unmount
        unsubscribeSuggestionUpdate === null || unsubscribeSuggestionUpdate === void 0 ? void 0 : unsubscribeSuggestionUpdate(); // Unsubscribe from suggestion updates
    };
}, [(_b = systemContext === null || systemContext === void 0 ? void 0 : systemContext.currentUser) === null || _b === void 0 ? void 0 : _b.id, systemContext === null || systemContext === void 0 ? void 0 : systemContext.messageBus]); // Re-run effect when user ID or MessageBus changes
// --- End New ---
// --- Modified: Handle Function Button Click (Refactored) ---
var handleFunctionClick = function (label, actionType) { return __awaiter(_this, void 0, void 0, function () {
    var userId, correlationId_1, actionIntent;
    var _a;
    return __generator(this, function (_b) {
        userId = (_a = systemContext === null || systemContext === void 0 ? void 0 : systemContext.currentUser) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId || !(systemContext === null || systemContext === void 0 ? void 0 : systemContext.messageBus)) {
            alert("User not logged in or Message Bus not available.");
            return [2 /*return*/];
        }
        // Simulate recording user action
        authorityForgingEngine === null || authorityForgingEngine === void 0 ? void 0 : authorityForgingEngine.recordAction({
            type: "web:keyboard:function_button:".concat(label),
            details: { label: label, actionType: actionType },
            context: { platform: 'web', page: 'keyboard' },
            user_id: userId, // Associate action with user
        });
        if (actionType) {
            // If the button has an actionType, send it as an execute_action_intent message
            setProcessingFunctionLabel(label); // Show loading state for this button
            setError(null); // Clear previous errors
            correlationId_1 = "func-".concat(Date.now(), "-").concat(Math.random().toString(16).slice(2));
            setPendingRequests(function (prev) {
                var _a;
                return (__assign(__assign({}, prev), (_a = {}, _a[correlationId_1] = true, _a)));
            });
            try {
                actionIntent = {
                    action: actionType,
                    parameters: {}, // Default empty parameters, specific actions might need more
                };
                // Add specific default parameters based on actionType if needed
                if (actionType === 'search_knowledge') {
                    actionIntent.parameters = { query: input.trim() || 'latest knowledge', useSemanticSearch: false }; // Search input or latest
                }
                else if (actionType === 'simulate_visual_reading') {
                    // For visual reading, we need an image. Trigger file input click.
                    if (imageInputRef.current) {
                        imageInputRef.current.click();
                        // The actual action will be sent in handleImageSelect after the user picks a file.
                        // Reset loading state and pending request here, as the action isn't sent yet.
                        setProcessingFunctionLabel(null);
                        setPendingRequests(function (prev) { var newState = __assign({}, prev); delete newState[correlationId_1]; return newState; });
                        return [2 /*return*/]; // Exit the function here
                    }
                    else {
                        alert("Image input is not available.");
                        setProcessingFunctionLabel(null); // Reset loading state
                        setPendingRequests(function (prev) { var newState = __assign({}, prev); delete newState[correlationId_1]; return newState; });
                        return [2 /*return*/]; // Exit if image input not available
                    }
                }
                else if (actionType === 'read_url') {
                    // For reading URL (Article Summary), the input is the URL
                    if (input.trim()) {
                        actionIntent.parameters = { url: input.trim() }; // Pass the URL from input
                    }
                    else {
                        alert("Please enter a URL in the input field first for Article Summary.");
                        setProcessingFunctionLabel(null); // Reset loading state
                        setPendingRequests(function (prev) { var newState = __assign({}, prev); delete newState[correlationId_1]; return newState; });
                        return [2 /*return*/]; // Exit if no URL entered
                    }
                }
                else if (actionType === 'analyze_file_content') {
                    // For analyzing file content, the input is the selected file
                    if (fileInputRef.current) {
                        fileInputRef.current.click();
                        // The actual action will be sent in handleFileSelect after the user picks a file.
                        // Reset loading state and pending request here, as the action isn't sent yet.
                        setProcessingFunctionLabel(null);
                        setPendingRequests(function (prev) { var newState = __assign({}, prev); delete newState[correlationId_1]; return newState; });
                        return [2 /*return*/]; // Exit the function here
                    }
                    else {
                        alert("File input is not available.");
                        setProcessingFunctionLabel(null); // Reset loading state
                        setPendingRequests(function (prev) { var newState = __assign({}, prev); delete newState[correlationId_1]; return newState; });
                        return [2 /*return*/]; // Exit if file input not available
                    }
                }
                // TODO: Add default parameters for other actionTypes if needed
                // Send the message for actions that don't require file selection
                if (actionType !== 'simulate_visual_reading' && actionType !== 'analyze_file_content') {
                    systemContext.messageBus.send({
                        type: 'execute_action_intent', // Message type to execute a pre-defined action intent
                        payload: { decision: actionIntent, context: { conversation_id: 'default-web-chat', correlationId: correlationId_1, originalInput: input.trim() } }, // Pass the ActionIntent and context
                        recipient: 'input', // Target the InputAgent
                        correlationId: correlationId_1, // Include correlation ID
                        sender: 'keyboard_ui', // Identify the sender
                    });
                    // Clear input after sending an action
                    setInput('');
                    // The response will be handled by the agent_response listener
                }
            }
            catch (err) {
                console.error("Error sending function button message (".concat(label, "):"), err);
                setError("Error executing function \\\"".concat(label, "\\\": ").concat(err.message));
                setProcessingFunctionLabel(null); // Reset loading state on error
                setPendingRequests(function (prev) { var newState = __assign({}, prev); delete newState[correlationId_1]; return newState; }); // Clear pending state on error
            }
            finally {
                // ProcessingFunctionLabel and pendingRequests are reset by the agent_response listener
                // For file/image selection, these are reset in the file selection handlers
            }
        }
        else {
            // If no actionType, just set the input field (for phrases or simple text insertion)
            setInput(function (prevInput) { return prevInput + label; });
        }
        return [2 /*return*/];
    });
}); };
// --- End Modified ---
// --- New: Handle Phrase Click ---
var handlePhraseClick = function (phrase) {
    var _a;
    // Simulate recording user action
    var userId = (_a = systemContext === null || systemContext === void 0 ? void 0 : systemContext.currentUser) === null || _a === void 0 ? void 0 : _a.id;
    if (userId) {
        authorityForgingEngine === null || authorityForgingEngine === void 0 ? void 0 : authorityForgingEngine.recordAction({
            type: 'web:keyboard:phrase_click',
            details: { phrase: phrase },
            context: { platform: 'web', page: 'keyboard' },
            user_id: userId, // Associate action with user
        });
    }
    setInput(function (prevInput) { return prevInput + phrase; });
};
// --- End New ---
// --- New: Handle Knowledge Click (Insert into input) ---
var handleKnowledgeClick = function (record) {
    var _a;
    // Simulate recording user action
    var userId = (_a = systemContext === null || systemContext === void 0 ? void 0 : systemContext.currentUser) === null || _a === void 0 ? void 0 : _a.id;
    if (userId) {
        authorityForgingEngine === null || authorityForgingEngine === void 0 ? void 0 : authorityForgingEngine.recordAction({
            type: 'web:keyboard:kb_insert',
            details: { recordId: record.id, question: record.question },
            context: { platform: 'web', page: 'keyboard' },
            user_id: userId, // Associate action with user
        });
    }
    // Insert the answer into the input field
    setInput(function (prevInput) { return prevInput + record.answer; });
};
// --- End New ---
// --- New: Handle Suggestion Click (Insert into input or trigger action) ---
var handleSuggestionClick = function (suggestion) {
    var _a, _b;
    // Simulate recording user action
    var userId = (_a = systemContext === null || systemContext === void 0 ? void 0 : systemContext.currentUser) === null || _a === void 0 ? void 0 : _a.id;
    if (userId) {
        authorityForgingEngine === null || authorityForgingEngine === void 0 ? void 0 : authorityForgingEngine.recordAction({
            type: 'web:keyboard:suggestion_click',
            details: { suggestionAction: suggestion.action, suggestionParams: suggestion.parameters },
            context: { platform: 'web', page: 'keyboard' },
            user_id: userId, // Associate action with user
        });
    }
    // If the suggestion is a simple answer, insert it into the input
    if (suggestion.action === 'answer_via_ai' && ((_b = suggestion.parameters) === null || _b === void 0 ? void 0 : _b.question)) {
        setInput(function (prevInput) { return prevInput + suggestion.parameters.question; });
    }
    else {
        // If the suggestion is a specific action, trigger it via the agent system
        // This is similar to clicking a suggested action button below the AI response
        // We need to simulate sending this as an execute_action_intent message
        handleSuggestedActionClick(suggestion); // Reuse the logic from Chat.tsx
    }
};
// --- End New ---
// --- New: Handle Mobile Git Sync Click (Trigger action) ---
var handleMobileGitSyncClick = function (action) { return __awaiter(_this, void 0, void 0, function () {
    var userId, correlationId, actionIntent;
    var _a;
    return __generator(this, function (_b) {
        userId = (_a = systemContext === null || systemContext === void 0 ? void 0 : systemContext.currentUser) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId || !(systemContext === null || systemContext === void 0 ? void 0 : systemContext.messageBus)) {
            alert("User not logged in or Message Bus not available.");
            return [2 /*return*/];
        }
        console.log("Mobile Git Sync button clicked: ".concat(action));
        // Simulate recording user action
        authorityForgingEngine === null || authorityForgingEngine === void 0 ? void 0 : authorityForgingEngine.recordAction({
            type: "web:keyboard:mobile_git_sync_button:".concat(action),
            details: { action: action },
            context: { platform: 'web', page: 'keyboard' },
            user_id: userId, // Associate action with user
        });
        setProcessingFunctionLabel("Git ".concat(action)); // Show loading state
        setError(null); // Clear previous errors
        correlationId = "git-".concat(action, "-").concat(Date.now(), "-").concat(Math.random().toString(16).slice(2));
        setPendingRequests(function (prev) {
            var _a;
            return (__assign(__assign({}, prev), (_a = {}, _a[correlationId] = true, _a)));
        });
        try {
            actionIntent = {
                action: 'sync_mobile_git', // The action type for mobile git sync
                parameters: { direction: action }, // Pass the direction as a parameter
            };
            systemContext.messageBus.send({
                type: 'execute_action_intent', // Message type to execute a pre-defined action intent
                payload: { decision: actionIntent, context: { conversation_id: 'default-web-chat', correlationId: correlationId, originalInput: "Simulate Git ".concat(action) } }, // Pass the ActionIntent and context
                recipient: 'input', // Target the InputAgent
                correlationId: correlationId, // Include correlation ID
                sender: 'keyboard_ui', // Identify the sender
            });
            // The response will be handled by the agent_response listener
        }
        catch (err) {
            console.error("Error sending Git sync message (".concat(action, "):"), err);
            setError("Error simulating Git ".concat(action, ": ").concat(err.message));
            setProcessingFunctionLabel(null); // Reset loading state on error
            setPendingRequests(function (prev) { var newState = __assign({}, prev); delete newState[correlationId]; return newState; }); // Clear pending state on error
        }
        finally {
            // ProcessingFunctionLabel and pendingRequests are reset by the agent_response listener
        }
        return [2 /*return*/];
    });
}); };
// --- End New ---
// --- New: Handle Image Selection for Text Extraction ---\
var handleImageSelectForExtraction = function (event) { return __awaiter(_this, void 0, void 0, function () {
    var userId, imageFile, correlationId, actionIntent;
    var _a;
    return __generator(this, function (_b) {
        userId = (_a = systemContext === null || systemContext === void 0 ? void 0 : systemContext.currentUser) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId || !(systemContext === null || systemContext === void 0 ? void 0 : systemContext.messageBus) || !event.target.files || !event.target.files[0]) {
            setSelectedImage(null); // Clear selected image if no file
            return [2 /*return*/];
        }
        imageFile = event.target.files[0];
        setSelectedImage(imageFile); // Store the selected image file
        console.log("Image selected for extraction: ".concat(imageFile.name));
        // Simulate recording user action
        authorityForgingEngine === null || authorityForgingEngine === void 0 ? void 0 : authorityForgingEngine.recordAction({
            type: 'web:keyboard:image_select_for_extraction',
            details: { fileName: imageFile.name, fileSize: imageFile.size },
            context: { platform: 'web', page: 'keyboard' },
            user_id: userId, // Associate action with user
        });
        setProcessingFunctionLabel("\u6587\u5b57\u64f7\u53d6"); // Show loading state
        setError(null); // Clear previous errors
        correlationId = "ocr-".concat(Date.now(), "-").concat(Math.random().toString(16).slice(2));
        setPendingRequests(function (prev) {
            var _a;
            return (__assign(__assign({}, prev), (_a = {}, _a[correlationId] = true, _a)));
        });
        try {
            actionIntent = {
                action: 'simulate_visual_reading', // The action type for text extraction
                parameters: { imageUrl: URL.createObjectURL(imageFile) }, // Pass the image URL (Object URL for simulation)
            };
            systemContext.messageBus.send({
                type: 'execute_action_intent', // Message type to execute a pre-defined action intent
                payload: { decision: actionIntent, context: { conversation_id: 'default-web-chat', correlationId: correlationId, originalInput: "Extract text from image: ".concat(imageFile.name) } }, // Pass the ActionIntent and context
                recipient: 'input', // Target the InputAgent
                correlationId: correlationId, // Include correlation ID
                sender: 'keyboard_ui', // Identify the sender
            });
            // Clear the selected image state after sending the message
            setSelectedImage(null);
            // The response will be handled by the agent_response listener
        }
        catch (err) {
            console.error("Error sending text extraction message:", err);
            setError("Error extracting text: ".concat(err.message));
            setProcessingFunctionLabel(null); // Reset loading state on error
            setPendingRequests(function (prev) { var newState = __assign({}, prev); delete newState[correlationId]; return newState; }); // Clear pending state on error
        }
        finally {
            // ProcessingFunctionLabel and pendingRequests are reset by the agent_response listener
            // These are reset in the FileReader onload/onerror handlers
        }
        return [2 /*return*/];
    });
}); };
// --- End New ---
// --- New: Handle File Selection for Analysis ---\
var handleFileSelectForAnalysis = function (event) { return __awaiter(_this, void 0, void 0, function () {
    var userId, file, correlationId, reader;
    var _this = this;
    var _a;
    return __generator(this, function (_b) {
        userId = (_a = systemContext === null || systemContext === void 0 ? void 0 : systemContext.currentUser) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId || !(systemContext === null || systemContext === void 0 ? void 0 : systemContext.messageBus) || !event.target.files || !event.target.files[0]) {
            setSelectedFile(null); // Clear selected file if no file
            return [2 /*return*/];
        }
        file = event.target.files[0];
        setSelectedFile(file); // Store the selected file
        console.log("File selected for analysis: ".concat(file.name));
        // Simulate recording user action
        authorityForgingEngine === null || authorityForgingEngine === void 0 ? void 0 : authorityForgingEngine.recordAction({
            type: 'web:keyboard:file_select_for_analysis',
            details: { fileName: file.name, fileSize: file.size },
            context: { platform: 'web', page: 'keyboard' },
            user_id: userId, // Associate action with user
        });
        setProcessingFunctionLabel("\u5206\u6790\u6a94\u6848"); // Show loading state
        setError(null); // Clear previous errors
        correlationId = "file-analysis-".concat(Date.now(), "-").concat(Math.random().toString(16).slice(2));
        setPendingRequests(function (prev) {
            var _a;
            return (__assign(__assign({}, prev), (_a = {}, _a[correlationId] = true, _a)));
        });
        try {
            reader = new FileReader();
            reader.onload = function (e) { return __awaiter(_this, void 0, void 0, function () {
                var fileContent, actionIntent;
                var _a;
                return __generator(this, function (_b) {
                    fileContent = (_a = e.target) === null || _a === void 0 ? void 0 : _a.result;
                    actionIntent = {
                        action: 'analyze_file_content', // The action type for file analysis
                        parameters: {
                            content: fileContent,
                            fileMetadata: { name: file.name, type: file.type, size: file.size },
                        },
                    };
                    // Now send the message after reading the file
                    systemContext.messageBus.send({
                        type: 'execute_action_intent', // Message type to execute a pre-defined action intent
                        payload: { decision: actionIntent, context: { conversation_id: 'default-web-chat', correlationId: correlationId, originalInput: "Analyze file: ".concat(file.name) } }, // Pass the ActionIntent and context
                        recipient: 'input', // Target the InputAgent
                        correlationId: correlationId, // Include correlation ID
                        sender: 'keyboard_ui', // Identify the sender
                    });
                    // Clear the selected file state after sending the message
                    setSelectedFile(null);
                    return [2 /*return*/];
                });
            }); };
            reader.onerror = function (e) {
                console.error('Error reading file:', e);
                setError("Failed to read file: ".concat(file.name));
                setProcessingFunctionLabel(null); // Reset loading state on error
                setPendingRequests(function (prev) { var newState = __assign({}, prev); delete newState[correlationId]; return newState; }); // Clear pending state on error
                alert("Failed to read file: ".concat(file.name));
            };
            reader.readAsText(file); // Read file as text (adjust for binary files)
            // Exit the function here, the message will be sent in onload
            return [2 /*return*/];
        }
        catch (err) {
            console.error("Error sending file analysis message:", err);
            setError("Error analyzing file: ".concat(err.message));
            setProcessingFunctionLabel(null); // Reset loading state on error
            setPendingRequests(function (prev) { var newState = __assign({}, prev); delete newState[correlationId]; return newState; }); // Clear pending state on error
        }
        finally {
            // ProcessingFunctionLabel and pendingRequests are reset by the agent_response listener
            // These are reset in the FileReader onload/onerror handlers
        }
        return [2 /*return*/];
    });
}); };
// --- End New ---
// Ensure user is logged in before rendering content
if (!(systemContext === null || systemContext === void 0 ? void 0 : systemContext.currentUser)) {
    // This case should ideally be handled by ProtectedRoute, but as a fallback:
    return (<div className="container mx-auto p-4 flex justify-center">
               <div className="bg-neutral-800/50 p-8 rounded-lg shadow-xl w-full max-w-md text-center text-neutral-300">
                   <p>Please log in to use the chat.</p>
               </div>
            </div>);
}
return (
// Added a main container div with basic centering and padding
<div className="container mx-auto p-4 flex flex-col items-center">

      {/* Header & \u7522\u54c1\u5b9a\u4f4d */}
      <header className="text-center mb-6">
        <h1 className="text-3xl font-bold text-neutral-800 dark:text-neutral-200">Jun.Ai.key (<span className="text-blue-400">\u842c\u80fd\u5143\u9375</span>)</h1>
        <p className="text-neutral-600 dark:text-neutral-400">\u9375\u76e4 (<span className="text-blue-400">\u842c\u80fd\u5143\u9375</span>) \u00d7 \u4fbf\u7c3d \u00d7 AI \u00d7 \u5167\u5bb9\u6574\u5408 \u00b7 ToMemo/Flexiboard \u98a8\u683cDemo</p>
      </header>

      {/* Chat History Display */}
      <div className="w-full max-w-lg h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-300 dark:scrollbar-thumb-neutral-700 mb-4 p-4 bg-neutral-800/50 rounded-lg shadow-inner flex flex-col space-y-4">
          {/* This section is intentionally left empty in the Keyboard page for MVP */}
          {/* In a real app, this might show a snippet of the current conversation or context */}
           <p className="text-neutral-400 text-center">Chat history view is on the Chat page.</p>
      </div>


      {/* \u529f\u80fd\u6a6b\u5411\u6efe\u52d5\u5de5\u5177\u5217 */}
      <nav className="w-full max-w-lg flex flex-row items-center gap-2 py-3 px-1 overflow-x-auto scrollbar-thin scrollbar-thumb-neutral-200 dark:scrollbar-thumb-neutral-700 mb-1">
        {FUNCTION_TABS.map(function (_a) {
        var Icon = _a.icon, label = _a.label, actionType = _a.actionType;
        return ( // Added actionType
        <button key={label} className="flex flex-col items-center justify-center px-3 py-2 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-800 shadow active:scale-95 hover:bg-blue-50 hover:dark:bg-blue-900 transition flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed" onClick={function () { return handleFunctionClick(label, actionType); }} // Pass actionType
         disabled={isSending || !!processingFunctionLabel} // Disable all function buttons while sending or any function is processing
        >
            <Icon size={24} className="mb-0.5 text-blue-500"/>
            <span className="text-xs text-neutral-600 dark:text-neutral-300 font-semibold">{processingFunctionLabel === label ? '...' : label}</span>
          </button>);
    })}
      </nav>

      {/* \u8f38\u5165\u5340 */}
      <div className="w-full max-w-lg px-4 py-3 rounded-xl bg-white/90 shadow border border-neutral-100 dark:bg-neutral-900/90 dark:border-neutral-800 flex items-center justify-between select-none mb-2">
        <div className="text-lg tracking-widest font-mono text-neutral-900 dark:text-neutral-100 whitespace-nowrap overflow-x-auto max-w-[75vw] scrollbar-thin">
          {input || <span className="text-neutral-300 dark:text-neutral-600">\u8acb\u8f38\u5165\u2026</span>}
        </div>
        <button className="ml-2 px-2 py-1 text-xs rounded hover:bg-neutral-200 dark:hover:bg-neutral-800 transition text-neutral-600 dark:text-neutral-300" onClick={function () { return setInput(""); }} disabled={isSending} // Disable clear while sending
>
          \u6e05\u9664
        </button>
      </div>

      {/* \u4e0a\u4e0b\u6efe\u52d5\u77ed\u8a9e\u5340 */}
      <section className="w-full max-w-lg flex flex-col h-32 overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-300 dark:scrollbar-thumb-neutral-700 mb-2 gap-2">
        {PHRASES.map(function (section) { return (<div key={section.group} className="">
            <div className="text-xs text-neutral-500 dark:text-neutral-400 font-bold mb-1 pl-1">{section.group}</div>
            <div className="flex flex-row flex-wrap gap-2">
              {section.items.map(function (phrase, i) { return (<button key={phrase + i} className="px-3 py-2 rounded-2xl bg-[#f7fafe] dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 shadow-sm hover:bg-blue-100 hover:dark:bg-neutral-600 text-[15px] font-medium text-neutral-700 dark:text-neutral-50 flex-shrink-0 active:scale-95 transition disabled:opacity-50 disabled:cursor-not-allowed" onClick={function () { return handlePhraseClick(phrase); }} disabled={isSending} // Disable while sending
        >{phrase}</button>); })}
            </div>
          </div>); })}
      </section>

      {/* \u667a\u6167\u63a8\u85a6/\u77e5\u8b58\u5eab\u63d2\u5165\u5340 */}
      <div className="w-full max-w-lg flex flex-col gap-2 mb-3 px-2">
          {/* \u667a\u6167\u63a8\u85a6 */}
          <div className="flex flex-col gap-1">
              <div className="text-xs text-neutral-500 dark:text-neutral-400 font-bold mb-1 pl-1">\u667a\u6167\u63a8\u85a6 (AI Suggestions)</div>
              <div className="flex flex-row flex-wrap gap-2 min-h-[30px]"> {/* min-h to prevent layout shift */}
                  {isLoadingSuggestions ? (<span className="text-neutral-400 text-sm">\u8f09\u5165\u5efa\u8b70\u4e2d...</span>) : smartSuggestions.length > 0 ? (smartSuggestions.map(function (suggestion, i) {
        var _a, _b;
        return (<button key={'ai-sug-' + i} className="px-3 py-2 rounded-2xl bg-blue-500/80 hover:bg-blue-600/80 text-white text-[15px] font-medium shadow-sm flex-shrink-0 active:scale-95 transition disabled:opacity-50 disabled:cursor-not-allowed" onClick={function () { return handleSuggestionClick(suggestion); }} disabled={isSending} // Disable while sending
        >
                              {/* TODO: Format suggestion label based on action type */}
                              {suggestion.action === 'answer_via_ai' ? ((_b = (_a = suggestion.parameters) === null || _a === void 0 ? void 0 : _a.question) === null || _b === void 0 ? void 0 : _b.substring(0, 30)) + '...' : suggestion.action.replace(/_/g, ' ')}
                          </button>);
    })) : (!isLoadingSuggestions && <span className="text-neutral-400 text-sm">\u7121\u667a\u6167\u63a8\u85a6</span>)}
              </div>
          </div>

          {/* \u77e5\u8b58\u5eab\u63d2\u5165 */}
           <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center mb-1 pl-1">
                  <div className="text-xs text-neutral-500 dark:text-neutral-400 font-bold">\u77e5\u8b58\u5eab\u63d2\u5165 (Knowledge Base)</div>
                   {/* Semantic Search Toggle */}
                   <button className={"text-xs font-semibold px-2 py-0.5 rounded-full transition ".concat(useSemanticSearch ? 'bg-blue-500 text-white' : 'bg-neutral-200 text-neutral-700 dark:bg-neutral-700 dark:text-neutral-300', " disabled:opacity-50 disabled:cursor-not-allowed")} onClick={function () { return setUseSemanticSearch(!useSemanticSearch); }} disabled={isLoadingKnowledge || isSending} // Disable toggle while searching or sending
>
                       {useSemanticSearch ? '\u8a9e\u7fa9\u641c\u7d22 ON' : '\u8a9e\u7fa9\u641c\u7d22 OFF'}
                   </button>
              </div>
              <div className="flex flex-row flex-wrap gap-2 min-h-[30px]"> {/* min-h to prevent layout shift */}
                  {isLoadingKnowledge ? (<span className="text-neutral-400 text-sm">\u641c\u5c0b\u77e5\u8b58\u5eab\u4e2d...</span>) : knowledgeResults.length > 0 ? (knowledgeResults.map(function (record) { return (<button key={'kb-res-' + record.id} className="px-3 py-2 rounded-2xl bg-green-400/80 hover:bg-green-500/80 text-white text-[15px] font-medium shadow-sm flex-shrink-0 active:scale-95 transition disabled:opacity-50 disabled:cursor-not-allowed" onClick={function () { return handleKnowledgeClick(record); }} title={"Q: ".concat(record.question)} // Show question on hover
     disabled={isSending} // Disable while sending
    >
                              {record.answer.substring(0, 30)}{record.answer.length > 30 ? '...' : ''} {/* Show snippet of answer */}
                          </button>); })) : (!isLoadingKnowledge && <span className="text-neutral-400 text-sm">\u7121\u76f8\u95dc\u77e5\u8b58</span>)}
              </div>
          </div>
      </div>

      {/* --- New: Mobile Git Sync Buttons --- */}
       <div className="w-full max-w-lg flex flex-col gap-2 mb-3 px-2">
           <div className="text-xs text-neutral-500 dark:text-neutral-400 font-bold mb-1 pl-1">Mobile Git Sync (\u6a21\u64ec)</div>
           <div className="flex flex-row flex-wrap gap-2">
               {MOBILE_GIT_SYNC_BUTTONS.map(function (_a) {
        var Icon = _a.icon, label = _a.label, action = _a.action;
        return (<button key={action} className="px-3 py-2 rounded-2xl bg-purple-500/80 hover:bg-purple-600/80 text-white text-[15px] font-medium shadow-sm flex-shrink-0 active:scale-95 transition disabled:opacity-50 disabled:cursor-not-allowed" onClick={function () { return handleMobileGitSyncClick(action); }} disabled={isSending || !!processingFunctionLabel} // Disable while sending or any function is processing
        >
                       <Icon size={18} className={"inline-block mr-1 ".concat(processingFunctionLabel === "Git ".concat(action) ? 'animate-pulse' : '')}/>
                       {processingFunctionLabel === "Git ".concat(action) ? '...' : label}
                   </button>);
    })}
           </div>
       </div>
       {/* --- End New --- */}

      {/* iOS \u539f\u751f\u6ce8\u97f3/\u82f1\u6587\u9375\u76e4\u5340 \u00b7 \u8d85\u9ad8\u5fa9\u523b\uff0c\u5de6\u53f3\u5207\u63db */}
      <section className="bg-white/95 dark:bg-neutral-900 rounded-3xl shadow-2xl pt-4 pb-7 px-3 w-full max-w-lg mb-3 border border-neutral-200 dark:border-neutral-800 select-none">
        {/* \u8a9e\u8a00\u5207\u63db row */}
        <div className="flex justify-between items-center pb-3 px-2">
          <button onClick={function () { return setKb(kb === 'zh' ? 'en' : 'zh'); }} className="px-3 py-1.5 rounded-xl bg-neutral-200/70 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-200 text-xs font-semibold shadow active:scale-95 transition disabled:opacity-50" disabled={isSending} // Disable language switch while sending
>
            {kb === 'zh' ? '\u5207\u63db\u82f1\u6587' : '\u5207\u63db\u6ce8\u97f3'}
          </button>
          <span className="text-xs text-neutral-400">\u9375\u76e4\u9ad4\u9a57\u8cbc\u8fd1 iOS</span>
        </div>

        {kb === 'zh' ? (<div className="flex flex-col gap-1"> {/* Bopomofo Keyboard */}
            {BOPOMOFO_KEYS.map(function (row, rowIndex) { return (<div key={rowIndex} className="flex justify-center gap-1">
                {row.map(function (key, keyIndex) { return (<button key={keyIndex} className={"flex-1 h-10 rounded-md flex items-center justify-center text-lg font-medium ".concat(key ? 'bg-neutral-300/70 dark:bg-neutral-700/70 text-neutral-900 dark:text-neutral-100 active:bg-neutral-400/70 dark:active:bg-neutral-600/70' : 'bg-transparent cursor-default', " disabled:opacity-50")} onClick={function () { return handleKeyClick(key); }} disabled={!key || isSending}>
                    {key(__makeTemplateObject([""], [""]))(__makeTemplateObject([""], [""]))}</>); })}</>); })}</>) : }</></>);
