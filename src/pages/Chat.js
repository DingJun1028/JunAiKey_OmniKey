"use strict";
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
""(templateObject_1 || (templateObject_1 = __makeTemplateObject(["typescript\n// src/pages/Chat.tsx\n// Chat Page\n// Provides a natural language interface to interact with Jun.Ai.Key.\n// --- New: Add UI for chat interaction and history display --\n// --- New: Display AI Decision and Suggested Actions --\n// --- New: Improve Chat UI Styling and Suggested Action Interaction --\n// --- New: Add Feedback Buttons for AI Responses --\n// --- Modified: Refactor to use MessageBus for communication with InputAgent --\n// --- Modified: Implement correlationId logic for responses --\n// --- Modified: Refactor Suggested Action execution to use MessageBus --\n// --- New: Add UI for sending multimodal input (photos, voice, files) --\n// --- Modified: Update message display to handle multimodal content --\n// --- Modified: Add \"Text Extraction\" button to function bar --\n// --- Modified: Refactor Function Button handlers to send specific messages --\n// --- New: Add debounced input listener to send message for real-time suggestions --\n// --- Modified: Display smart suggestions and knowledge base results from SuggestionAgent --\n// --- New: Add \"Read URL\" and \"Analyze File\" buttons to function bar --\n// --- Modified: Display relevantKnowledge from AI response for RAG --\n\nimport React, { useEffect, useState, useRef } from 'react';\nimport { JunAiAssistant } from '../junai'; // Still used by InputAgent for MVP\nimport { KnowledgeSync } from '../modules/knowledgeSync';\nimport { EvolutionEngine } from '../core/evolution/EvolutionEngine'; // Import EvolutionEngine\nimport { KnowledgeRecord, ActionIntent, AgentMessage } from '../interfaces'; // Import KnowledgeRecord, ActionIntent, AgentMessage\nimport { Send, Loader2, User as UserIcon, Bot, Play, Zap, Search, GitMerge, Target, Info, AlertTriangle, MessageSquare, Globe, Code, FileText, Database, Palette, Settings, Key, Cloud, Copy, Brain, FileUp, FileDown, Share2, Search as SearchIcon, ThumbsUp, ThumbsDown, Image, Mic, Paperclip, Camera, ClipboardList, CalendarDays, QrCode, Share2 as ShareIcon, BookKey, Sparkles, Lightbulb, GitPullRequest, GitPush } from 'lucide-react'; // Import icons including ThumbsUp, ThumbsDown, Image, Mic, Paperclip, Camera, etc.import ReactMarkdown from 'react-markdown'; // For rendering markdown in AI responsesimport { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation\n\n// Define data structures (moved from Markdown)\n// TODO: These should be fetched dynamically from the Knowledge Base or other modules (Part of \u96D9\u5410\u540C\u6B65\u9818\u57DF / \u6C38\u4E45\u8A18\u61B6\u4E2D\u5FC3)\nconst FUNCTION_TABS = [\n  { icon: Sparkles, label: \"AI\u751F\u6210\", actionType: 'answer_via_ai' }, // AI Generation (Leverages \u667A\u6167\u6C89\u6FB1\u79D8\u8853) - Use answer_via_ai for general AI chat\n  { icon: BookKey, label: \"\u77E5\u8B58\u5EAB\", actionType: 'search_knowledge' }, // Knowledge Base Interaction (Leverages \u6C38\u4E45\u8A18\u61B6\u4E2D\u5FC3)\n  { icon: Camera, label: \"\u6587\u5B57\u64F7\u53D6\", actionType: 'simulate_visual_reading' }, // New: Text Extraction (Simulated via Device Agent)\n  { icon: ClipboardList, label: \"\u526A\u8CBC\u7C3F\", actionType: 'trigger_clipboard_action' }, // Clipboard Access (Requires Device Adapter Rune)\n  { icon: CalendarDays, label: \"\u65E5\u671F\u63D2\u5165\", actionType: 'insert_date' }, // Date Insertion (Simple Utility or Rune)\n  { icon: QrCode, label: \"QR\u751F\u6210\", actionType: 'qr_generate' }, // QR Code Generation (API Adapter Rune)\n  { icon: Palette, label: \"\u4E3B\u984C\u5207\u63DB\", actionType: 'change_theme' }, // UI Component Rune\n  { icon: ShareIcon, label: \"\u5206\u4EAB\", actionType: 'share_content' }, // Sharing (Requires Device Adapter Rune)\n  // { icon: Calculator, label: \"\u8A08\u7B97\u5668\" }, // Calculator (Simple Utility or Script Rune) - Removed for space\n  // { icon: Languages, label: \"\u7FFB\u8B6F\" }, // Translation (AI Agent Rune) - Removed for space\n  // { icon: Mic, label: \"\u8A9E\u97F3\u8F38\u5165\" }, // Voice Input (Device Adapter Rune) - Removed for space\n  // { icon: Type, label: \"\u624B\u5BEB\u8F38\u5165\" }, // Handwriting Input (Device Adapter Rune) - Removed for space\n  // --- New: Add Web and File Analysis Buttons ---\n  { icon: Globe, label: \"\u8B80\u53D6\u7DB2\u5740\", actionType: 'read_url' }, // Read URL content\n  { icon: FileText, label: \"\u5206\u6790\u6A94\u6848\", actionType: 'analyze_file_content' }, // Analyze file content\n  // --- End New ---\n];\n\n// --- New: Add Mobile Git Sync Buttons ---\nconst MOBILE_GIT_SYNC_BUTTONS = [\n    { icon: GitPullRequest, label: \"Git Pull\", action: 'pull' },\n    { icon: GitPush, label: \"Git Push\", action: 'push' },\n    { icon: GitMerge, label: \"Git Sync\", action: 'bidirectional' },\n];\n// --- End New ---\n\n\n// TODO: These should be fetched dynamically from the Knowledge Base or suggested by AI (Part of \u6C38\u4E45\u8A18\u61B6\u4E2D\u5FC3 / \u667A\u6167\u6C89\u6FB1\u79D8\u8853)\nconst PHRASES = [\n  { group: \"\u5E38\u7528\", items: [\"\u4F60\u597D\uFF0C\u4ECA\u5929\u6709\u4EC0\u9EBC\u8A08\u756B\uFF1F\", \"\u6E96\u5099\u4E0B\u73ED\u4E86\uFF01\", \"\u5348\u9910\u5403\u4EC0\u9EBC\uFF1F\", \"\u9031\u6703\u91CD\u9EDE\uFF1A\u2026\", \"\u5DF2\u6536\u5230\uFF0C\u99AC\u4E0A\u8655\u7406\u3002\"] },\n  { group: \"\u6A21\u677F\", items: [\"[\u516C\u53F8\u540D] \u5730\u5740\uFF1A\", \"\u6211\u7684\u90F5\u7BB1\uFF1A\", \"\u5B85\u914D\u5230\u8CA8\u901A\u77E5\uFF1A\u2026\"] },\n  // AI\u63A8\u85A6 will be dynamic\n];\n\n\n// Access core modules from the global window object (for MVP simplicity)\ndeclare const window: any;\nconst junaiAssistant: JunAiAssistant = window.systemContext?.junaiAssistant; // Still used by InputAgent for MVP\nconst knowledgeSync: KnowledgeSync = window.systemContext?.knowledgeSync; // Interacts with MemoryEngine (\u6C38\u4E45\u8A18\u61B6)\nconst authorityForgingEngine: any = window.systemContext?.authorityForgingEngine; // Use any for action recording (\u6B0A\u80FD\u935B\u9020)\nconst evolutionEngine: EvolutionEngine = window.systemContext?.evolutionEngine; // Access EvolutionEngine (\u7120\u9650\u9032\u5316)\nconst systemContext: any = window.systemContext; // Access the full context for currentUser\n\n\n// Define a type for messages displayed in the UI, including the AI's decision\ninterface ChatMessage extends KnowledgeRecord {\n    aiDecision?: ActionIntent | null; // Optional field to store the AI's decision for this turn\n    isTemporary?: boolean; // Flag for optimistic updates\n    // --- New: Add feedback status ---\n    feedback?: 'correct' | 'incorrect' | null; // User feedback status\n    // --- End New ---\n    // --- New: Add correlationId for tracking responses ---\n    correlationId?: string; // Correlation ID for messages sent via MessageBus\n    // --- End New ---\n    // --- New: Add fields for multimodal content display ---\n    // These fields are already in KnowledgeRecord, but explicitly listed here for clarity in ChatMessage context\n    image_url?: string; // URL to an associated image\n    audio_url?: string; // URL to associated audio\n    file_url?: string; // URL to an associated file\n    file_metadata?: any; // Metadata about the file (e.g., name, type, size)\n    // --- End New ---\n    // --- New: Add relevantKnowledge for RAG display ---\n    relevantKnowledge?: KnowledgeRecord[]; // Relevant knowledge records used for RAG\n    // --- End New ---\n}\n\n\nconst Chat: React.FC = () => {\n  const [messages, setMessages] = useState<ChatMessage[]>([]); // State to hold conversation history\n  const [input, setInput] = useState('');\n  const [loading, setLoading] = useState(true);\n  const [isSending, setIsSending] = useState(false);\n  const [error, setError] = useState<string | null>(null);\n  const messagesEndRef = useRef<HTMLDivElement>(null); // Ref for auto-scrolling\n  const navigate = useNavigate(); // Hook for navigation\n\n  // --- New: State for tracking pending requests by correlationId ---  const [pendingRequests, setPendingRequests] = useState<Record<string, boolean>>({});\n  // --- End New ---\n  // --- New: State to temporarily store decisions and relevantKnowledge by correlationId until the KB record arrives --\n  // Store { decision: ActionIntent, relevantKnowledge?: KnowledgeRecord[] }\n  const [pendingResults, setPendingResults] = useState<Record<string, { decision?: ActionIntent, relevantKnowledge?: KnowledgeRecord[] }>>({});\n  // --- End New ---\n  // --- New: State for feedback status on messages ---  const [feedbackStatus, setFeedbackStatus] = useState<Record<string, 'correct' | 'incorrect' | null>>({}); // Map: recordId -> feedback status\n  // --- End New ---\n  // --- New: State for multimodal input ---  const [selectedImage, setSelectedImage] = useState<File | null>(null);\n  const [selectedAudio, setSelectedAudio] = useState<File | null>(null); // Or Blob for recording\n  const [selectedFile, setSelectedFile] = useState<File | null>(null);\n  // --- End New ---\n  // --- New: State for processing function button clicks ---  const [processingFunctionLabel, setProcessingFunctionLabel] = useState<string | null>(null);\n  // --- End New ---\n  // --- New: State for smart suggestions and knowledge base results (populated by SuggestionAgent) ---  const [smartSuggestions, setSmartSuggestions] = useState<ActionIntent[]>([]); // AI Suggestions (ActionIntent objects)  const [knowledgeResults, setKnowledgeResults] = useState<KnowledgeRecord[]>([]); // KB Search Results (KnowledgeRecord objects)  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false); // Loading state for suggestions  const [isLoadingKnowledge, setIsLoadingKnowledge] = useState(false); // Loading state for KB results  // --- End New ---\n\n  const fetchConversationHistory = async () => {\n       const userId = systemContext?.currentUser?.id;\n       if (!knowledgeSync || !userId) {\n            setError(\"KnowledgeSync module not initialized or user not logged in.\");\n            setLoading(false);\n            return;\n        }\n      setLoading(true);\n      setError(null); // Clear main error when fetching\n      try {\n          // Fetch knowledge records with source 'dev-conversation' for the current user\n          // This assumes conversation history is stored as knowledge records\n          const allRecords = await knowledgeSync.getAllKnowledgeForUser(userId); // Fetch all for simplicity\n          const conversationHistory = allRecords\n              .filter(record => record.source === 'dev-conversation')\n              // Sort by timestamp ascending to display chronologically\n              .sort((a, b) => new Date(a.timestamp).getTime() - new Date(a.timestamp).getTime());\n\n          // For MVP, we don't store the AI decision or relevantKnowledge in the KB record itself.\n          // We'll just load the Q&A history.\n          setMessages(conversationHistory as ChatMessage[]); // Cast to ChatMessage[]\n      } catch (err: any) {\n          console.error('Error fetching conversation history:', err);\n          setError("], ["typescript\n// src/pages/Chat.tsx\n// Chat Page\n// Provides a natural language interface to interact with Jun.Ai.Key.\n// --- New: Add UI for chat interaction and history display --\n// --- New: Display AI Decision and Suggested Actions --\n// --- New: Improve Chat UI Styling and Suggested Action Interaction --\n// --- New: Add Feedback Buttons for AI Responses --\n// --- Modified: Refactor to use MessageBus for communication with InputAgent --\n// --- Modified: Implement correlationId logic for responses --\n// --- Modified: Refactor Suggested Action execution to use MessageBus --\n// --- New: Add UI for sending multimodal input (photos, voice, files) --\n// --- Modified: Update message display to handle multimodal content --\n// --- Modified: Add \"Text Extraction\" button to function bar --\n// --- Modified: Refactor Function Button handlers to send specific messages --\n// --- New: Add debounced input listener to send message for real-time suggestions --\n// --- Modified: Display smart suggestions and knowledge base results from SuggestionAgent --\n// --- New: Add \"Read URL\" and \"Analyze File\" buttons to function bar --\n// --- Modified: Display relevantKnowledge from AI response for RAG --\n\nimport React, { useEffect, useState, useRef } from 'react';\nimport { JunAiAssistant } from '../junai'; // Still used by InputAgent for MVP\nimport { KnowledgeSync } from '../modules/knowledgeSync';\nimport { EvolutionEngine } from '../core/evolution/EvolutionEngine'; // Import EvolutionEngine\nimport { KnowledgeRecord, ActionIntent, AgentMessage } from '../interfaces'; // Import KnowledgeRecord, ActionIntent, AgentMessage\nimport { Send, Loader2, User as UserIcon, Bot, Play, Zap, Search, GitMerge, Target, Info, AlertTriangle, MessageSquare, Globe, Code, FileText, Database, Palette, Settings, Key, Cloud, Copy, Brain, FileUp, FileDown, Share2, Search as SearchIcon, ThumbsUp, ThumbsDown, Image, Mic, Paperclip, Camera, ClipboardList, CalendarDays, QrCode, Share2 as ShareIcon, BookKey, Sparkles, Lightbulb, GitPullRequest, GitPush } from 'lucide-react'; // Import icons including ThumbsUp, ThumbsDown, Image, Mic, Paperclip, Camera, etc.\\\nimport ReactMarkdown from 'react-markdown'; // For rendering markdown in AI responses\\\nimport { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation\\\n\n\n// Define data structures (moved from Markdown)\n// TODO: These should be fetched dynamically from the Knowledge Base or other modules (Part of \\u96d9\\u5410\\u540c\\u6b65\\u9818\\u57df / \\u6c38\\u4e45\\u8a18\\u61b6\\u4e2d\\u5fc3)\nconst FUNCTION_TABS = [\n  { icon: Sparkles, label: \"AI\\u751f\\u6210\", actionType: 'answer_via_ai' }, // AI Generation (Leverages \\u667a\\u6167\\u6c89\\u6fb1\\u79d8\\u8853) - Use answer_via_ai for general AI chat\n  { icon: BookKey, label: \"\\u77e5\\u8b58\\u5eab\", actionType: 'search_knowledge' }, // Knowledge Base Interaction (Leverages \\u6c38\\u4e45\\u8a18\\u61b6\\u4e2d\\u5fc3)\n  { icon: Camera, label: \"\\u6587\\u5b57\\u64f7\\u53d6\", actionType: 'simulate_visual_reading' }, // New: Text Extraction (Simulated via Device Agent)\n  { icon: ClipboardList, label: \"\\u526a\\u8cbc\\u7c3f\", actionType: 'trigger_clipboard_action' }, // Clipboard Access (Requires Device Adapter Rune)\n  { icon: CalendarDays, label: \"\\u65e5\\u671f\\u63d2\\u5165\", actionType: 'insert_date' }, // Date Insertion (Simple Utility or Rune)\n  { icon: QrCode, label: \"QR\\u751f\\u6210\", actionType: 'qr_generate' }, // QR Code Generation (API Adapter Rune)\n  { icon: Palette, label: \"\\u4e3b\\u984c\\u5207\\u63db\", actionType: 'change_theme' }, // UI Component Rune\n  { icon: ShareIcon, label: \"\\u5206\\u4eab\", actionType: 'share_content' }, // Sharing (Requires Device Adapter Rune)\n  // { icon: Calculator, label: \"\\u8a08\\u7b97\\u5668\" }, // Calculator (Simple Utility or Script Rune) - Removed for space\n  // { icon: Languages, label: \"\\u7ffb\\u8b6f\" }, // Translation (AI Agent Rune) - Removed for space\n  // { icon: Mic, label: \"\\u8a9e\\u97f3\\u8f38\\u5165\" }, // Voice Input (Device Adapter Rune) - Removed for space\n  // { icon: Type, label: \"\\u624b\\u5beb\\u8f38\\u5165\" }, // Handwriting Input (Device Adapter Rune) - Removed for space\n  // --- New: Add Web and File Analysis Buttons ---\n  { icon: Globe, label: \"\\u8b80\\u53d6\\u7db2\\u5740\", actionType: 'read_url' }, // Read URL content\n  { icon: FileText, label: \"\\u5206\\u6790\\u6a94\\u6848\", actionType: 'analyze_file_content' }, // Analyze file content\n  // --- End New ---\n];\n\n// --- New: Add Mobile Git Sync Buttons ---\nconst MOBILE_GIT_SYNC_BUTTONS = [\n    { icon: GitPullRequest, label: \"Git Pull\", action: 'pull' },\n    { icon: GitPush, label: \"Git Push\", action: 'push' },\n    { icon: GitMerge, label: \"Git Sync\", action: 'bidirectional' },\n];\n// --- End New ---\n\n\n// TODO: These should be fetched dynamically from the Knowledge Base or suggested by AI (Part of \\u6c38\\u4e45\\u8a18\\u61b6\\u4e2d\\u5fc3 / \\u667a\\u6167\\u6c89\\u6fb1\\u79d8\\u8853)\nconst PHRASES = [\n  { group: \"\\u5e38\\u7528\", items: [\"\\u4f60\\u597d\\uff0c\\u4eca\\u5929\\u6709\\u4ec0\\u9ebc\\u8a08\\u756b\\uff1f\", \"\\u6e96\\u5099\\u4e0b\\u73ed\\u4e86\\uff01\", \"\\u5348\\u9910\\u5403\\u4ec0\\u9ebc\\uff1f\", \"\\u9031\\u6703\\u91cd\\u9ede\\uff1a\\u2026\", \"\\u5df2\\u6536\\u5230\\uff0c\\u99ac\\u4e0a\\u8655\\u7406\\u3002\"] },\n  { group: \"\\u6a21\\u677f\", items: [\"[\\u516c\\u53f8\\u540d] \\u5730\\u5740\\uff1a\", \"\\u6211\\u7684\\u90f5\\u7bb1\\uff1a\", \"\\u5b85\\u914d\\u5230\\u8ca8\\u901a\\u77e5\\uff1a\\u2026\"] },\n  // AI\\u63a8\\u85a6 will be dynamic\n];\n\n\n// Access core modules from the global window object (for MVP simplicity)\ndeclare const window: any;\nconst junaiAssistant: JunAiAssistant = window.systemContext?.junaiAssistant; // Still used by InputAgent for MVP\nconst knowledgeSync: KnowledgeSync = window.systemContext?.knowledgeSync; // Interacts with MemoryEngine (\\u6c38\\u4e45\\u8a18\\u61b6)\nconst authorityForgingEngine: any = window.systemContext?.authorityForgingEngine; // Use any for action recording (\\u6b0a\\u80fd\\u935b\\u9020)\nconst evolutionEngine: EvolutionEngine = window.systemContext?.evolutionEngine; // Access EvolutionEngine (\\u7120\\u9650\\u9032\\u5316)\nconst systemContext: any = window.systemContext; // Access the full context for currentUser\n\n\n// Define a type for messages displayed in the UI, including the AI's decision\ninterface ChatMessage extends KnowledgeRecord {\n    aiDecision?: ActionIntent | null; // Optional field to store the AI's decision for this turn\n    isTemporary?: boolean; // Flag for optimistic updates\n    // --- New: Add feedback status ---\n    feedback?: 'correct' | 'incorrect' | null; // User feedback status\n    // --- End New ---\n    // --- New: Add correlationId for tracking responses ---\n    correlationId?: string; // Correlation ID for messages sent via MessageBus\n    // --- End New ---\n    // --- New: Add fields for multimodal content display ---\n    // These fields are already in KnowledgeRecord, but explicitly listed here for clarity in ChatMessage context\n    image_url?: string; // URL to an associated image\n    audio_url?: string; // URL to associated audio\n    file_url?: string; // URL to an associated file\n    file_metadata?: any; // Metadata about the file (e.g., name, type, size)\n    // --- End New ---\n    // --- New: Add relevantKnowledge for RAG display ---\n    relevantKnowledge?: KnowledgeRecord[]; // Relevant knowledge records used for RAG\n    // --- End New ---\n}\n\n\nconst Chat: React.FC = () => {\n  const [messages, setMessages] = useState<ChatMessage[]>([]); // State to hold conversation history\n  const [input, setInput] = useState('');\n  const [loading, setLoading] = useState(true);\n  const [isSending, setIsSending] = useState(false);\n  const [error, setError] = useState<string | null>(null);\n  const messagesEndRef = useRef<HTMLDivElement>(null); // Ref for auto-scrolling\n  const navigate = useNavigate(); // Hook for navigation\n\n  // --- New: State for tracking pending requests by correlationId ---\\\n  const [pendingRequests, setPendingRequests] = useState<Record<string, boolean>>({});\n  // --- End New ---\\\n\n  // --- New: State to temporarily store decisions and relevantKnowledge by correlationId until the KB record arrives --\n  // Store { decision: ActionIntent, relevantKnowledge?: KnowledgeRecord[] }\n  const [pendingResults, setPendingResults] = useState<Record<string, { decision?: ActionIntent, relevantKnowledge?: KnowledgeRecord[] }>>({});\n  // --- End New ---\\\n\n  // --- New: State for feedback status on messages ---\\\n  const [feedbackStatus, setFeedbackStatus] = useState<Record<string, 'correct' | 'incorrect' | null>>({}); // Map: recordId -> feedback status\n  // --- End New ---\\\n\n  // --- New: State for multimodal input ---\\\n  const [selectedImage, setSelectedImage] = useState<File | null>(null);\n  const [selectedAudio, setSelectedAudio] = useState<File | null>(null); // Or Blob for recording\n  const [selectedFile, setSelectedFile] = useState<File | null>(null);\n  // --- End New ---\\\n\n  // --- New: State for processing function button clicks ---\\\n  const [processingFunctionLabel, setProcessingFunctionLabel] = useState<string | null>(null);\n  // --- End New ---\\\n\n  // --- New: State for smart suggestions and knowledge base results (populated by SuggestionAgent) ---\\\n  const [smartSuggestions, setSmartSuggestions] = useState<ActionIntent[]>([]); // AI Suggestions (ActionIntent objects)\\\n  const [knowledgeResults, setKnowledgeResults] = useState<KnowledgeRecord[]>([]); // KB Search Results (KnowledgeRecord objects)\\\n  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false); // Loading state for suggestions\\\n  const [isLoadingKnowledge, setIsLoadingKnowledge] = useState(false); // Loading state for KB results\\\n  // --- End New ---\\\n\n\n  const fetchConversationHistory = async () => {\n       const userId = systemContext?.currentUser?.id;\n       if (!knowledgeSync || !userId) {\n            setError(\"KnowledgeSync module not initialized or user not logged in.\");\n            setLoading(false);\n            return;\n        }\n      setLoading(true);\n      setError(null); // Clear main error when fetching\n      try {\n          // Fetch knowledge records with source 'dev-conversation' for the current user\n          // This assumes conversation history is stored as knowledge records\n          const allRecords = await knowledgeSync.getAllKnowledgeForUser(userId); // Fetch all for simplicity\n          const conversationHistory = allRecords\n              .filter(record => record.source === 'dev-conversation')\n              // Sort by timestamp ascending to display chronologically\n              .sort((a, b) => new Date(a.timestamp).getTime() - new Date(a.timestamp).getTime());\n\n          // For MVP, we don't store the AI decision or relevantKnowledge in the KB record itself.\n          // We'll just load the Q&A history.\n          setMessages(conversationHistory as ChatMessage[]); // Cast to ChatMessage[]\n      } catch (err: any) {\n          console.error('Error fetching conversation history:', err);\n          setError("])));
Failed;
to;
load;
conversation;
history: $;
{
    err.message;
}
");\n      } finally {\n          setLoading(false);\n      }  };\n  useEffect(() => {\n    // Fetch history when the component mounts or when the user changes\n    if (systemContext?.currentUser?.id) {\n        fetchConversationHistory(); // Fetch history on initial load\n    }\n\n    // --- New: Subscribe to realtime updates for knowledge_records with source 'dev-conversation' ---    let unsubscribeKnowledgeUpdates: (() => void) | undefined;\n    if (knowledgeSync?.context?.eventBus) { // Check if KnowledgeSync and its EventBus are available\n        const eventBus = knowledgeSync.context.eventBus;\n        const userId = systemContext?.currentUser?.id;\n\n        unsubscribeKnowledgeUpdates = eventBus.subscribe('knowledge_record_insert', (payload: KnowledgeRecord) => {\n            if (payload.user_id === userId && payload.source === 'dev-conversation') {\n                console.log('Chat page received knowledge_record_insert event:', payload);\n                // Add the new message and keep sorted\n                setMessages(prevMessages => {\n                    const updatedMessages = [...prevMessages, payload as ChatMessage].sort((a, b) => new Date(a.timestamp).getTime() - new Date(a.timestamp).getTime());\n\n                    // --- New: Check if there's a pending result for this record's correlationId ---                    const correlationId = payload.dev_log_details?.correlationId;\n                    if (correlationId && pendingResults[correlationId]) {\n                        console.log(";
Chat;
page;
attaching;
pending;
result;
for (correlationId; $; { correlationId: correlationId })
    to;
record;
$;
{
    payload.id;
}
");\n                        // Find the newly added message in the sorted array and attach the decision and relevantKnowledge\n                        const messageIndex = updatedMessages.findIndex(msg => msg.id === payload.id);\n                        if (messageIndex !== -1) {\n                            updatedMessages[messageIndex].aiDecision = pendingResults[correlationId].decision;\n                            updatedMessages[messageIndex].relevantKnowledge = pendingResults[correlationId].relevantKnowledge;\n                            // Remove the result from pending state after attaching\n                            setPendingResults(prev => {\n                                const newState = { ...prev };\n                                delete newState[correlationId];\n                                return newState;\n                            });\n                        }\n                    }\n                    // --- End New ---\n                    return updatedMessages;\n                });\n\n            }\n        });\n\n        // TODO: Handle update and delete events if needed for chat history\n        // eventBus.subscribe('knowledge_record_update', (payload: KnowledgeRecord) => { ... });\n        // eventBus.subscribe('knowledge_record_delete', (payload: { id: string, userId: string }) => { ... });\n    }    // --- End New ---\n    // --- New: Subscribe to agent_response messages from the MessageBus ---    let unsubscribeAgentResponse: (() => void) | undefined;\n    if (systemContext?.messageBus) { // Check if MessageBus is available\n        const messageBus = systemContext.messageBus;\n        const userId = systemContext?.currentUser?.id;\n\n        unsubscribeAgentResponse = messageBus.subscribe('agent_response', (message: AgentMessage) => {\n            // Check if this response is for a request we sent from this UI instance\n            // We can use the correlationId to match requests and responses\n            // Also check if the sender is the expected agent (e.g., 'input' agent for initial processing)\n            if (message.correlationId && pendingRequests[message.correlationId]) {\n                console.log('Chat page received agent_response event:', message);\n\n                // Process the response payload\n                if (message.payload?.success) {\n                    const resultData = message.payload.data; // Expected format { response: string, decision: ActionIntent, relevantKnowledge?: KnowledgeRecord[] }\n                    console.log('Agent response data:', resultData);\n\n                    // --- New: Store the decision and relevantKnowledge temporarily by correlationId ---                    // The actual AI message (KnowledgeRecord) will arrive via Realtime.                    // We store the decision and relevantKnowledge here and attach it when the record arrives.                    if (resultData?.decision || resultData?.relevantKnowledge) {\n                         setPendingResults(prev => ({ ...prev, [message.correlationId!]: { decision: resultData.decision, relevantKnowledge: resultData.relevantKnowledge } }));\n                         console.log(";
Chat;
page;
stored;
pending;
result;
for (correlationId; $; { message: message, : .correlationId }(templateObject_2 || (templateObject_2 = __makeTemplateObject([");\n                    }\n                    // --- End New ---\n                } else {\n                    // Handle error response\n                    const errorMessage = message.payload?.error || 'An unknown error occurred.';\n                    console.error('Agent response error:', errorMessage);\n                    setError("], [");\n                    }\n                    // --- End New ---\\\n\n                } else {\n                    // Handle error response\n                    const errorMessage = message.payload?.error || 'An unknown error occurred.';\n                    console.error('Agent response error:', errorMessage);\n                    setError("]))))
    Agent;
Error: $;
{
    errorMessage;
}
");\n                    // Add an error message to the UI (as a system message)\n                     setMessages(prevMessages => [...prevMessages, { id: 'temp-agent-error-' + Date.now(), user_id: userId, question: '', answer: ";
Agent;
Error: $;
{
    errorMessage;
}
", timestamp: new Date().toISOString(), source: 'system-error', type: 'error', is_read: true }]);\n                }\n\n                // Remove the request from pending state\n                setPendingRequests(prev => {\n                    const newState = { ...prev };\n                    delete newState[message.correlationId!];\n                    return newState;\n                });\n\n                // --- New: Remove the temporary user message after the agent responds --\n                // The actual user message will be added by the realtime listener for the KB record.\n                setMessages(prevMessages => prevMessages.filter(msg => !(msg.isTemporary && msg.correlationId === message.correlationId)));\n                // --- New: Reset processing function label ---                setProcessingFunctionLabel(null);\n                // --- End New ---\n                // Reset sending state if this was the only pending request\n                if (Object.keys(pendingRequests).length <= 1) { // Check if it was the last one\n                     setIsSending(false);\n                }\n            }        });\n    }    // --- End New ---\n    // --- New: Subscribe to suggestion_update messages from the MessageBus ---    let unsubscribeSuggestionUpdate: (() => void) | undefined;\n    if (systemContext?.messageBus) { // Check if MessageBus is available\n        const messageBus = systemContext.messageBus;\n        const userId = systemContext?.currentUser?.id;\n\n        unsubscribeSuggestionUpdate = messageBus.subscribe('suggestion_update', (message: AgentMessage) => {\n            // Check if this update is for the current user\n            if (message.payload?.userId === userId) {\n                console.log('Chat page received suggestion_update event:', message);\n                // Update the suggestions and knowledge results states\n                if (message.payload?.suggestions) {\n                    setSmartSuggestions(message.payload.suggestions);\n                }\n                if (message.payload?.knowledgeResults) {\n                    setKnowledgeResults(message.payload.knowledgeResults);\n                }\n                // Update loading states\n                if (message.payload?.isLoadingSuggestions !== undefined) {\n                    setIsLoadingSuggestions(message.payload.isLoadingSuggestions);\n                }\n                 if (message.payload?.isLoadingKnowledge !== undefined) {\n                    setIsLoadingKnowledge(message.payload.isLoadingKnowledge);\n                 }\n            }\n        });\n    }    // --- End New ---\n\n    return () => {\n        // Unsubscribe on component unmount\n        unsubscribeKnowledgeUpdates?.();\n        unsubscribeAgentResponse?.(); // Unsubscribe from agent responses\n        unsubscribeSuggestionUpdate?.(); // Unsubscribe from suggestion updates\n    };\n  }, [systemContext?.currentUser?.id, knowledgeSync, junaiAssistant, pendingRequests, pendingResults]); // Add pendingRequests, pendingResults to dependencies\n\n  // --- New: Debounce input and send message for real-time suggestions --\n  useEffect(() => {\n      const userId = systemContext?.currentUser?.id;\n      if (!userId || !systemContext?.messageBus) {\n          // Clear suggestions if user logs out or MessageBus is not available\n          setSmartSuggestions([]);\n          setKnowledgeResults([]);\n          setIsLoadingSuggestions(false);\n          setIsLoadingKnowledge(false);\n          return;\n      }\n\n      // Debounce the input change\n      const handler = setTimeout(() => {\n          console.log(";
Input;
changed, sending;
for (suggestions; ; )
    : ;
"${input}\"`);;
// Send a message to the SuggestionAgent
systemContext.messageBus.send({
    type: 'analyze_input_for_suggestions', // Message type for SuggestionAgent
    payload: { text: input, userId: userId, context: { page: 'chat' } }, // Pass input and context
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
// --- End New ---\
// Auto-scroll to the latest message
useEffect(function () {
    var _a;
    (_a = messagesEndRef.current) === null || _a === void 0 ? void 0 : _a.scrollIntoView({ behavior: "smooth" });
}, [messages]); // Scroll when messages state changes
var handleSend = function (e) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, userMessage, multimodalPayload, correlationId, tempUserMessage;
    var _a;
    return __generator(this, function (_b) {
        e.preventDefault();
        userId = (_a = systemContext === null || systemContext === void 0 ? void 0 : systemContext.currentUser) === null || _a === void 0 ? void 0 : _a.id;
        if (!(systemContext === null || systemContext === void 0 ? void 0 : systemContext.messageBus) || !userId || (!input.trim() && !selectedImage && !selectedAudio && !selectedFile)) {
            return [2 /*return*/]; // Do nothing if input is empty and no multimodal content selected
        }
        userMessage = input.trim();
        multimodalPayload = {};
        if (selectedImage)
            multimodalPayload.imageUrl = URL.createObjectURL(selectedImage); // Use Object URL for preview
        if (selectedAudio)
            multimodalPayload.audioUrl = URL.createObjectURL(selectedAudio); // Use Object URL for preview
        if (selectedFile)
            multimodalPayload.fileUrl = URL.createObjectURL(selectedFile); // Use Object URL for preview
        if (selectedFile)
            multimodalPayload.fileMetadata = { name: selectedFile.name, type: selectedFile.type, size: selectedFile.size };
        // TODO: In a real app, you would upload the file to storage (e.g., Supabase Storage) and get a permanent URL here.\
        // For MVP, we just pass Object URLs or simulate upload.\
        // For MVP, let's just pass the Object URLs and metadata.\
        // The InputAgent/WisdomSecretArt will need to handle these URLs (e.g., pass to a vision model).\
        // The KnowledgeSync.saveKnowledge method is updated to accept these URLs for storage.\
        // --- End New ---\
        setInput(''); // Clear input immediately
        // --- New: Clear selected multimodal content ---\
        setSelectedImage(null);
        setSelectedAudio(null);
        setSelectedFile(null);
        // --- End New ---\
        setIsSending(true);
        setError(null);
        correlationId = "req-".concat(Date.now(), "-").concat(Math.random().toString(16).slice(2));
        tempUserMessage = {
            id: 'temp-user-' + Date.now(), // Temporary ID
            user_id: userId,
            question: userMessage || 'Multimodal Input', // Use a placeholder question for multimodal only input
            answer: '', // User message has no AI answer yet
            timestamp: new Date().toISOString(),
            source: 'ui-temp-user', // Mark as temporary UI message
            is_read: true, // User messages are considered read
            isTemporary: true, // Flag for temporary message
            correlationId: correlationId, // Add correlationId to the temporary message
            // --- New: Include multimodal content URLs in the temporary message for display ---\
            image_url: multimodalPayload.imageUrl,
            audio_url: multimodalPayload.audioUrl,
            file_url: multimodalPayload.fileUrl,
            file_metadata: multimodalPayload.fileMetadata,
            // --- End New ---\
        };
        setMessages(function (prevMessages) { return __spreadArray(__spreadArray([], prevMessages, true), [tempUserMessage], false); });
        // Add the request to pending state
        setPendingRequests(function (prev) {
            var _a;
            return (__assign(__assign({}, prev), (_a = {}, _a[correlationId] = true, _a)));
        });
        try {
            // Simulate recording user action (Part of \u6b0a\u80fd\u935b\u9020 / \u516d\u5f0f\u5967\u7fa9: \u89c0\u6e2c)
            authorityForgingEngine === null || authorityForgingEngine === void 0 ? void 0 : authorityForgingEngine.recordAction({
                type: 'web:chat:message',
                details: __assign({ messageContent: userMessage }, multimodalPayload), // Include multimodal details
                context: { platform: 'web', page: 'chat', conversation_id: 'default-web-chat', correlationId: correlationId }, // Include correlationId in action context
                user_id: userId, // Associate action with user
            });
            // --- Modified: Send message to InputAgent via MessageBus ---\
            // The InputAgent is modified to handle a message type that takes an ActionIntent directly.\
            // The InputAgent will then call JunAiAssistant.processInput (for MVP)\
            systemContext.messageBus.send({
                type: 'process_user_input', // Message type for InputAgent
                payload: __assign(__assign({ text: userMessage }, multimodalPayload), { context: { conversation_id: 'default-web-chat', correlationId: correlationId } }), // Pass all input types and context
                recipient: 'input', // Target the InputAgent
                correlationId: correlationId, // Include correlation ID
                sender: 'chat_ui', // Identify the sender
            });
            // --- End Modified ---\
            // The rest of the process (receiving response, updating history) is handled by the MessageBus subscription.\
        }
        catch (err) {
            console.error('Error sending message to MessageBus:', err);
            setError("Error sending message: ".concat(err.message));
            // Add an error message to the history or display it separately
            setMessages(function (prevMessages) { return __spreadArray(__spreadArray([], prevMessages, true), [{ id: 'temp-send-error-' + Date.now(), user_id: userId, question: '', answer: "Error sending message: ".concat(err.message), timestamp: new Date().toISOString(), source: 'system-error', type: 'error', is_read: true }], false); });
            // Remove the request from pending state on error
            setPendingRequests(function (prev) { var newState = __assign({}, prev); delete newState[correlationId]; return newState; });
            // Remove the temporary user message on error
            setMessages(function (prevMessages) { return prevMessages.filter(function (msg) { return msg.id !== tempUserMessage.id; }); });
            setIsSending(false); // Reset sending state on error
        }
        finally {
            // setIsSending and pendingRequests are reset by the agent_response listener
            // The temporary user message is removed by the agent_response listener
        }
        return [2 /*return*/];
    });
}); };
// --- Modified: Handle Suggested Action Click (Send message via MessageBus) ---\
var handleSuggestedActionClick = function (decision) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, correlationId;
    var _a;
    return __generator(this, function (_b) {
        console.log("Suggested action clicked: ".concat(decision.action));
        userId = (_a = systemContext === null || systemContext === void 0 ? void 0 : systemContext.currentUser) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId || !(systemContext === null || systemContext === void 0 ? void 0 : systemContext.messageBus)) { // Check MessageBus availability
            alert("User not logged in or Message Bus not available.");
            return [2 /*return*/];
        }
        // Simulate recording user action
        authorityForgingEngine === null || authorityForgingEngine === void 0 ? void 0 : authorityForgingEngine.recordAction({
            type: 'web:chat:suggested_action_execute',
            details: { suggestedAction: decision.action, suggestedParams: decision.parameters },
            context: { platform: 'web', page: 'chat' },
            user_id: userId, // Associate action with user
        });
        // Clear suggestions from the UI (by updating the message state) - TODO: Implement this properly
        // For now, just clear input and show sending state
        setInput("");
        setIsSending(true); // Show sending state while executing the action
        setError(null); // Clear previous errors
        correlationId = "action-".concat(Date.now(), "-").concat(Math.random().toString(16).slice(2));
        setPendingRequests(function (prev) {
            var _a;
            return (__assign(__assign({}, prev), (_a = {}, _a[correlationId] = true, _a)));
        });
        try {
            // --- Modified: Send message to the InputAgent with the decided action intent ---\
            // The InputAgent is modified to handle a message type that takes an ActionIntent directly.\
            systemContext.messageBus.send({
                type: 'execute_action_intent', // New message type for InputAgent
                payload: { decision: decision, context: { conversation_id: 'default-web-chat', correlationId: correlationId } }, // Pass the ActionIntent and context
                recipient: 'input', // Target the InputAgent
                correlationId: correlationId, // Include correlation ID
                sender: 'chat_ui', // Identify the sender
            });
            // --- End Modified ---\
            // The response will be handled by the agent_response listener\
        }
        catch (err) {
            console.error("Error sending suggested action message to MessageBus:", err);
            // setAiResponse(`\u57f7\u884c\u5efa\u8b70\u5931\u6557: ${err.message}`); // This was for a modal, not used anymore
            setError("\u57F7\u884C\u5EFA\u8B70\u5931\u6557: ".concat(err.message)); // Show error in main UI
            setIsSending(false); // Reset sending state on error
            setPendingRequests(function (prev) { var newState = __assign({}, prev); delete newState[correlationId]; return newState; }); // Clear pending state on error
        }
        finally {
            // setIsSending and pendingRequests are reset by the agent_response listener
        }
        return [2 /*return*/];
    });
}); };
// --- End Modified ---\
// --- New: Handle Feedback Click ---\
var handleFeedbackClick = function (recordId, feedbackType) { return __awaiter(void 0, void 0, void 0, function () {
    var userId;
    var _a;
    return __generator(this, function (_b) {
        console.log("Feedback clicked for record ".concat(recordId, ": ").concat(feedbackType));
        userId = (_a = systemContext === null || systemContext === void 0 ? void 0 : systemContext.currentUser) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId || !(systemContext === null || systemContext === void 0 ? void 0 : systemContext.messageBus) || !evolutionEngine) { // Check MessageBus and EvolutionEngine availability
            alert("User not logged in or core modules not available.");
            return [2 /*return*/];
        }
        // Prevent giving feedback multiple times for the same record/type (optional)
        if (feedbackStatus[recordId] === feedbackType) {
            console.log("Feedback ".concat(feedbackType, " already given for record ").concat(recordId, "."));
            return [2 /*return*/];
        }
        // Simulate recording user action
        authorityForgingEngine === null || authorityForgingEngine === void 0 ? void 0 : authorityForgingEngine.recordAction({
            type: "web:chat:feedback:".concat(feedbackType),
            details: { recordId: recordId, feedbackType: feedbackType },
            context: { platform: 'web', page: 'chat' },
            user_id: userId, // Associate action with user
        });
        // Update UI state immediately to show feedback status
        setFeedbackStatus(function (prevStatus) {
            var _a;
            return (__assign(__assign({}, prevStatus), (_a = {}, _a[recordId] = feedbackType, _a)));
        });
        try {
            // Send a message to the EvolutionAgent to record the feedback
            // Use sendMessageAndWaitForResponse if you need confirmation, otherwise sendMessage is fine.\
            // For MVP, sendMessage is sufficient.\
            systemContext.messageBus.send({
                type: 'record_feedback', // New message type for EvolutionAgent
                payload: { recordId: recordId, feedbackType: feedbackType, userId: userId, comments: '' }, // Pass feedback details
                recipient: 'evolution', // Target the EvolutionAgent
                // No correlationId needed for this fire-and-forget notification
            });
            console.log("Feedback message sent to EvolutionAgent for record ".concat(recordId, "."));
        }
        catch (err) {
            console.error("Error sending feedback message for record ".concat(recordId, ":"), err);
            // Revert UI state on error (optional)
            setFeedbackStatus(function (prevStatus) {
                var _a;
                return (__assign(__assign({}, prevStatus), (_a = {}, _a[recordId] = null, _a)));
            });
            alert("Failed to record feedback: ".concat(err.message));
        }
        return [2 /*return*/];
    });
}); };
// --- End New ---\
// --- New: Handle Multimodal Input Selection ---\
var handleImageSelect = function (event) {
    if (event.target.files && event.target.files[0]) {
        setSelectedImage(event.target.files[0]);
        // Clear other file types
        setSelectedAudio(null);
        setSelectedFile(null);
    }
};
var handleAudioSelect = function (event) {
    if (event.target.files && event.target.files[0]) {
        setSelectedAudio(event.target.files[0]);
        // Clear other file types
        setSelectedImage(null);
        setSelectedFile(null);
    }
};
var handleFileSelect = function (event) {
    if (event.target.files && event.target.files[0]) {
        setSelectedFile(event.target.files[0]);
        // Clear other file types
        setSelectedImage(null);
        setSelectedAudio(null);
    }
};
var handleClearMultimodal = function () {
    setSelectedImage(null);
    setSelectedAudio(null);
    setSelectedFile(null);
};
// --- End New ---\
// --- New: Handle Function Button Click (Refactored) ---\
var handleFunctionClick = function (label, actionType) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, correlationId_1, actionIntent_1, reader;
    var _a;
    return __generator(this, function (_b) {
        userId = (_a = systemContext === null || systemContext === void 0 ? void 0 : systemContext.currentUser) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId || !(systemContext === null || systemContext === void 0 ? void 0 : systemContext.messageBus)) {
            alert("User not logged in or Message Bus not available.");
            return [2 /*return*/];
        }
        // Simulate recording user action
        authorityForgingEngine === null || authorityForgingEngine === void 0 ? void 0 : authorityForgingEngine.recordAction({
            type: "web:chat:function_button:".concat(label),
            details: { label: label, actionType: actionType },
            context: { platform: 'web', page: 'chat' },
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
                actionIntent_1 = {
                    action: actionType,
                    parameters: {}, // Default empty parameters, specific actions might need more
                };
                // Add specific default parameters based on actionType if needed
                if (actionType === 'search_knowledge') {
                    actionIntent_1.parameters = { query: input.trim() || 'latest knowledge', useSemanticSearch: false }; // Search input or latest
                }
                else if (actionType === 'simulate_visual_reading') {
                    // For visual reading, the input might be an image URL from selectedImage
                    if (selectedImage) {
                        actionIntent_1.parameters = { imageUrl: URL.createObjectURL(selectedImage) }; // Pass the image URL
                    }
                    else {
                        alert("Please select an image first for Text Extraction.");
                        setProcessingFunctionLabel(null); // Reset loading state
                        setPendingRequests(function (prev) { var newState = __assign({}, prev); delete newState[correlationId_1]; return newState; }); // Clear pending state
                        return [2 /*return*/]; // Exit if no image selected
                    }
                }
                else if (actionType === 'read_url') {
                    // For reading URL, the input is the URL
                    if (input.trim()) {
                        actionIntent_1.parameters = { url: input.trim() }; // Pass the URL from input
                    }
                    else {
                        alert("Please enter a URL in the input field first.");
                        setProcessingFunctionLabel(null); // Reset loading state
                        setPendingRequests(function (prev) { var newState = __assign({}, prev); delete newState[correlationId_1]; return newState; }); // Clear pending state
                        return [2 /*return*/]; // Exit if no URL entered
                    }
                }
                else if (actionType === 'analyze_file_content') {
                    // For analyzing file content, the input is the selected file
                    if (selectedFile) {
                        reader = new FileReader();
                        reader.onload = function (e) { return __awaiter(void 0, void 0, void 0, function () {
                            var fileContent;
                            var _a;
                            return __generator(this, function (_b) {
                                fileContent = (_a = e.target) === null || _a === void 0 ? void 0 : _a.result;
                                actionIntent_1.parameters = {
                                    content: fileContent,
                                    fileMetadata: { name: selectedFile.name, type: selectedFile.type, size: selectedFile.size },
                                };
                                // Now send the message after reading the file
                                systemContext.messageBus.send({
                                    type: 'execute_action_intent', // Message type to execute a pre-defined action intent
                                    payload: { decision: actionIntent_1, context: { conversation_id: 'default-web-chat', correlationId: correlationId_1, originalInput: "Analyze file: ".concat(selectedFile.name) } }, // Pass the ActionIntent and context
                                    recipient: 'input', // Target the InputAgent
                                    correlationId: correlationId_1, // Include correlation ID
                                    sender: 'chat_ui', // Identify the sender
                                });
                                // Clear input and selected multimodal content after sending
                                setInput('');
                                setSelectedImage(null);
                                setSelectedAudio(null);
                                setSelectedFile(null);
                                return [2 /*return*/];
                            });
                        }); };
                        reader.onerror = function (e) {
                            console.error('Error reading file:', e);
                            setError("Failed to read file: ".concat(selectedFile.name));
                            setProcessingFunctionLabel(null); // Reset loading state on error
                            setPendingRequests(function (prev) { var newState = __assign({}, prev); delete newState[correlationId_1]; return newState; }); // Clear pending state on error
                            alert("Failed to read file: ".concat(selectedFile.name));
                        };
                        reader.readAsText(selectedFile); // Read file as text (adjust for binary files)
                        // Exit the function here, the message will be sent in onload
                        return [2 /*return*/];
                    }
                    else {
                        alert("Please select a file first for Analysis.");
                        setProcessingFunctionLabel(null); // Reset loading state
                        setPendingRequests(function (prev) { var newState = __assign({}, prev); delete newState[correlationId_1]; return newState; }); // Clear pending state
                        return [2 /*return*/]; // Exit if no file selected
                    }
                }
                // TODO: Add default parameters for other actionTypes if needed\
                // Send the message for actions that don't require file reading
                if (actionType !== 'analyze_file_content') {
                    systemContext.messageBus.send({
                        type: 'execute_action_intent', // Message type to execute a pre-defined action intent
                        payload: { decision: actionIntent_1, context: { conversation_id: 'default-web-chat', correlationId: correlationId_1, originalInput: input.trim() } }, // Pass the ActionIntent and context
                        recipient: 'input', // Target the InputAgent
                        correlationId: correlationId_1, // Include correlation ID
                        sender: 'chat_ui', // Identify the sender
                    });
                    // Clear input and selected multimodal content after sending
                    setInput('');
                    setSelectedImage(null);
                    setSelectedAudio(null);
                    setSelectedFile(null);
                    // The response will be handled by the agent_response listener
                }
            }
            catch (err) {
                console.error("Error sending function button message (".concat(label, "):"), err);
                setError("Error executing function \"".concat(label, "\": ").concat(err.message));
                setProcessingFunctionLabel(null); // Reset loading state on error
                setPendingRequests(function (prev) { var newState = __assign({}, prev); delete newState[correlationId_1]; return newState; }); // Clear pending state on error
            }
            finally {
                // ProcessingFunctionLabel and pendingRequests are reset by the agent_response listener
                // For analyze_file_content, these are reset in the FileReader onload/onerror handlers
            }
        }
        {
            // If no actionType, just set the input field (for phrases or simple text insertion)
            setInput(function (prevInput) { return prevInput + label; });
        }
        return [2 /*return*/];
    });
}); };
// --- End New ---\
// --- New: Handle Phrase Click ---\
var handlePhraseClick = function (phrase) {
    var _a;
    // Simulate recording user action
    var userId = (_a = systemContext === null || systemContext === void 0 ? void 0 : systemContext.currentUser) === null || _a === void 0 ? void 0 : _a.id;
    if (userId) {
        authorityForgingEngine === null || authorityForgingEngine === void 0 ? void 0 : authorityForgingEngine.recordAction({
            type: 'web:chat:phrase_click',
            details: { phrase: phrase },
            context: { platform: 'web', page: 'chat' },
            user_id: userId, // Associate action with user
        });
    }
    setInput(function (prevInput) { return prevInput + phrase; });
};
// --- End New ---\
// --- New: Handle Knowledge Click (Insert into input) ---\
var handleKnowledgeClick = function (record) {
    var _a;
    // Simulate recording user action
    var userId = (_a = systemContext === null || systemContext === void 0 ? void 0 : systemContext.currentUser) === null || _a === void 0 ? void 0 : _a.id;
    if (userId) {
        authorityForgingEngine === null || authorityForgingEngine === void 0 ? void 0 : authorityForgingEngine.recordAction({
            type: 'web:chat:kb_insert',
            details: { recordId: record.id, question: record.question },
            context: { platform: 'web', page: 'chat' },
            user_id: userId, // Associate action with user
        });
    }
    // Insert the answer into the input field
    setInput(function (prevInput) { return prevInput + record.answer; });
};
// --- End New ---\
// --- New: Handle Suggestion Click (Insert into input or trigger action) ---\
var handleSuggestionClick = function (suggestion) {
    var _a, _b;
    // Simulate recording user action
    var userId = (_a = systemContext === null || systemContext === void 0 ? void 0 : systemContext.currentUser) === null || _a === void 0 ? void 0 : _a.id;
    if (userId) {
        authorityForgingEngine === null || authorityForgingEngine === void 0 ? void 0 : authorityForgingEngine.recordAction({
            type: 'web:chat:suggestion_click',
            details: { suggestionAction: suggestion.action, suggestionParams: suggestion.parameters },
            context: { platform: 'web', page: 'chat' },
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
        handleSuggestedActionClick(suggestion);
    }
};
// --- End New ---\
// --- New: Handle Mobile Git Sync Click (Trigger action) ---\
var handleMobileGitSyncClick = function (action) { return __awaiter(void 0, void 0, void 0, function () {
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
            type: "web:chat:mobile_git_sync_button:".concat(action),
            details: { action: action },
            context: { platform: 'web', page: 'chat' },
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
                sender: 'chat_ui', // Identify the sender
            });
            // The response will be handled by the agent_response listener\
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
// --- End New ---\
// Ensure user is logged in before rendering content
if (!(systemContext === null || systemContext === void 0 ? void 0 : systemContext.currentUser)) {
    // This case should ideally be handled by ProtectedRoute, but as a fallback:\
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
          {loading ? (<p className="text-neutral-400 text-center">Loading conversation history...</p>) : error ? (<p className="text-red-400 text-center">Error loading history: {error}</p>) : messages.length === 0 ? (<p className="text-neutral-400 text-center">Start a conversation!</p>) : (messages.map(function (msg, index) { return (<div key={msg.id || index} className={"flex ".concat(msg.source === 'ui-temp-user' || msg.source === 'dev-conversation' && msg.answer === '' ? 'justify-end' : 'justify-start')}>
                      <div className={"p-3 rounded-lg max-w-[80%] ".concat(msg.source === 'ui-temp-user' || msg.source === 'dev-conversation' && msg.answer === '' ? 'bg-blue-600 text-white' : msg.source === 'system-error' ? 'bg-red-800/50 text-red-200' : 'bg-neutral-700 text-neutral-100')}>
                          {/* Display user input or AI response */}
                          {msg.source === 'ui-temp-user' || msg.source === 'dev-conversation' && msg.answer === '' ? () : }\
                              <p>{msg.question}</p>
                          ) : (\
                              <div className="prose prose-invert max-w-none"> {/* Use prose for markdown styling */}
                                  <ReactMarkdown>{msg.answer}</ReactMarkdown>
                              </div>
                          )}
                          {/* New: Display Multimodal Content */}
                          {msg.image_url && <img src={msg.image_url} alt="Attached image" className="mt-2 max-h-48 rounded-md"/>}
                          {msg.audio_url && <audio controls src={msg.audio_url} className="mt-2 w-full"></audio>}
                          {msg.file_url && msg.file_metadata && (<div className="mt-2 p-2 bg-neutral-600 rounded-md text-neutral-200 text-sm flex items-center gap-2">
                                  <Paperclip size={16}/>
                                  <span>Attached File: {msg.file_metadata.name} ({Math.round(msg.file_metadata.size / 1024)} KB)</span>
                                  {/* TODO: Add download link or preview */}
                              </div>)}
                          {/* End New */}
                          {/* Display AI Decision and Suggested Actions */}
                          {msg.aiDecision && msg.source !== 'ui-temp-user' && ( // Only show decision for AI messages
        <div className="mt-2 pt-2 border-t border-neutral-600 text-xs">
                                  <p className="font-semibold text-blue-300">AI Decision: {msg.aiDecision.action.replace(/_/g, ' ').toUpperCase()}</p>
                                  {/* Display Suggested Action Button if applicable */}
                                  {msg.aiDecision.action !== 'answer_via_ai' && msg.aiDecision.action !== 'present_suggestion' && ( // Don't show button for simple answer or present_suggestion (handled by UI)
            <button className="mt-2 px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed" onClick={function () { return handleSuggestedActionClick(msg.aiDecision); }} // Use non-null assertion as we checked msg.aiDecision
             disabled={isSending} // Disable while sending/processing
            >
                                           <Play size={14} className="inline-block mr-1"/> Execute Action
                                       </button>)}
                                   {/* Display Suggestion Button for present_suggestion */}
                                   {msg.aiDecision.action === 'present_suggestion' && ()}\
                                        <button className="mt-2 px-3 py-1 text-xs bg-purple-500 text-white rounded hover:bg-purple-600 transition disabled:opacity-50 disabled:cursor-not-allowed" onClick={function () { return handleSuggestedActionClick(msg.aiDecision); }} // Use non-null assertion
         disabled={isSending} // Disable while sending/processing
        >
                                            <Lightbulb size={14} className="inline-block mr-1"/> View Suggestion
                                        </button>
                                   )}\
                              </div>)}
                           {/* New: Feedback Buttons for AI Responses */}
                           {msg.source !== 'ui-temp-user' && msg.source !== 'system-error' && ( // Only show feedback for AI responses (not user messages or system errors)
        <div className="mt-2 pt-2 border-t border-neutral-600 text-xs flex items-center gap-2">
                                   <span className="text-neutral-400">Feedback:</span>
                                   <button className={"flex items-center gap-1 px-2 py-0.5 rounded ".concat(feedbackStatus[msg.id] === 'correct' ? 'bg-green-600' : 'bg-neutral-600', " text-white hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed")} onClick={function () { return handleFeedbackClick(msg.id, 'correct'); }} disabled={isSending || feedbackStatus[msg.id] !== null} // Disable while sending or if feedback already given
        >
                                       <ThumbsUp size={14}/> Correct
                                   </button>
                                   <button className={"flex items-center gap-1 px-2 py-0.5 rounded ".concat(feedbackStatus[msg.id] === 'incorrect' ? 'bg-red-600' : 'bg-neutral-600', " text-white hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed")} onClick={function () { return handleFeedbackClick(msg.id, 'incorrect'); }} disabled={isSending || feedbackStatus[msg.id] !== null} // Disable while sending or if feedback already given
        >
                                       <ThumbsDown size={14}/> Incorrect
                                   </button>
                               </div>)}
                           {/* End New */}
                           {/* New: Display Relevant Knowledge for RAG */}
                           {msg.relevantKnowledge && msg.relevantKnowledge.length > 0 && (<div className="mt-2 pt-2 border-t border-neutral-600 text-xs">
                                   <p className="font-semibold text-blue-300">Relevant Knowledge Used:</p>
                                   <ul className="list-disc list-inside text-neutral-400">
                                       {msg.relevantKnowledge.map(function (kb) { return (<li key={kb.id} className="text-xs">
                                               Q: {kb.question.substring(0, 50)}... (ID: {kb.id.substring(0, 8)}...)
                                           </li>); })}
                                   </ul>
                               </div>)}
                           {/* End New */}
                      </div>
                  </div>); }))}
          <div ref={messagesEndRef}/> {/* Empty div for auto-scrolling */}
      </div>


      {/* \u529f\u80fd\u6a6b\u5411\u6efe\u52d5\u5de5\u5177\u689d */}
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
        {PHRASES.map(function (section) { return (); })}\
          <div key={section.group} className="">
            <div className="text-xs text-neutral-500 dark:text-neutral-400 font-bold mb-1 pl-1">{section.group}</div>
            <div className="flex flex-row flex-wrap gap-2">
              {section.items.map(function (phrase, i) { return (); })}\
                <button key={phrase + i} className="px-3 py-2 rounded-2xl bg-[#f7fafe] dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 shadow-sm hover:bg-blue-100 hover:dark:bg-neutral-600 text-[15px] font-medium text-neutral-700 dark:text-neutral-50 flex-shrink-0 active:scale-95 transition disabled:opacity-50 disabled:cursor-not-allowed" onClick={function () { return handlePhraseClick(phrase); }} disabled={isSending} // Disable while sending
>{phrase}</button>
              ))\
            }\
            </div>
          </div>
        ))\
    }\
      </section>

      {/* \u667a\u6167\u63a8\u85a6/\u77e5\u8b58\u5eab\u63d2\u5165\u5340 */}
      <div className="w-full max-w-lg flex flex-col gap-2 mb-3 px-2">
          {/* \u667a\u6167\u63a8\u85a6 */}
          <div className="flex flex-col gap-1">
              <div className="text-xs text-neutral-500 dark:text-neutral-400 font-bold mb-1 pl-1">\u667a\u6167\u63a8\u85a6 (AI Suggestions)</div>
              <div className="flex flex-row flex-wrap gap-2 min-h-[30px]"> {/* min-h to prevent layout shift */}
                  {isLoadingSuggestions ? () : }\
                      <span className="text-neutral-400 text-sm">\u8f09\u5165\u5efa\u8b70\u4e2d...</span>
                  ) : smartSuggestions.length > 0 ? (\
                      smartSuggestions.map((suggestion, i) => (\
                          <button key={'ai-sug-' + i} className="px-3 py-2 rounded-2xl bg-blue-500/80 hover:bg-blue-600/80 text-white text-[15px] font-medium shadow-sm flex-shrink-0 active:scale-95 transition disabled:opacity-50 disabled:cursor-not-allowed" onClick={function () { return handleSuggestionClick(suggestion); }} disabled={isSending} // Disable while sending
>
                              {/* TODO: Format suggestion label based on action type */}
                              {suggestion.action === 'answer_via_ai' ? ((_c = (_b = suggestion.parameters) === null || _b === void 0 ? void 0 : _b.question) === null || _c === void 0 ? void 0 : _c.substring(0, 30)) + '...' : suggestion.action.replace(/_/g, ' ')}\
                          </button>
                      ))\
                  ) : (\
                      !isLoadingSuggestions && <span className="text-neutral-400 text-sm">\u7121\u667a\u6167\u63a8\u85a6</span>
                  )\
              }\
              </div>
          </div>

          {/* \u77e5\u8b58\u5eab\u63d2\u5165 */}
           <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center mb-1 pl-1">
                  <div className="text-xs text-neutral-500 dark:text-neutral-400 font-bold">\u77e5\u8b58\u5eab\u63d2\u5165 (Knowledge Base)</div>
                   {/* Semantic Search Toggle */}
                   <button className={"text-xs font-semibold px-2 py-0.5 rounded-full transition ".concat(useSemanticSearch ? 'bg-blue-500 text-white' : 'bg-neutral-200 text-neutral-700 dark:bg-neutral-700 dark:text-neutral-300', " disabled:opacity-50 disabled:cursor-not-allowed")} onClick={function () { return setUseSemanticSearch(!useSemanticSearch); }} disabled={isLoadingKnowledge || isSending} // Disable toggle while searching or sending
>
                       {useSemanticSearch ? '\u8a9e\u7fa9\u641c\u7d22 ON' : '\u8a9e\u7fa9\u641c\u7d22 OFF'}\
                   </button>
              </div>
              <div className="flex flex-row flex-wrap gap-2 min-h-[30px]"> {/* min-h to prevent layout shift */}
                  {isLoadingKnowledge ? () : }\
                      <span className="text-neutral-400 text-sm">\u641c\u5c0b\u77e5\u8b58\u5eab\u4e2d...</span>
                  ) : knowledgeResults.length > 0 ? (\
                      knowledgeResults.map((record) => (\
                          <button key={'kb-res-' + record.id} className="px-3 py-2 rounded-2xl bg-green-400/80 hover:bg-green-500/80 text-white text-[15px] font-medium shadow-sm flex-shrink-0 active:scale-95 transition disabled:opacity-50 disabled:cursor-not-allowed" onClick={function () { return handleKnowledgeClick(record); }} title={"Q: ".concat(record.question)} // Show question on hover
 disabled={isSending} // Disable while sending
>
                              {record.answer.substring(0, 30)}{record.answer.length > 30 ? '...' : ''} {/* Show snippet of answer */}
                          </button>
                      ))\
                  ) : (\
                      !isLoadingKnowledge && <span className="text-neutral-400 text-sm">\u7121\u76f8\u95dc\u77e5\u8b58</span>
                  )\
              }\
              </div>
          </div>
      </div>

      {/* --- New: Mobile Git Sync Buttons --- */}
       <div className="w-full max-w-lg flex flex-col gap-2 mb-3 px-2">
           <div className="text-xs text-neutral-500 dark:text-neutral-400 font-bold mb-1 pl-1">Mobile Git Sync (\u6a21\u64ec)</div>
           <div className="flex flex-row flex-wrap gap-2">
               {MOBILE_GIT_SYNC_BUTTONS.map(function (_a) {
    var Icon = _a.icon, label = _a.label, action = _a.action;
    return ();
})}\
                   <button key={action} className="px-3 py-2 rounded-2xl bg-purple-500/80 hover:bg-purple-600/80 text-white text-[15px] font-medium shadow-sm flex-shrink-0 active:scale-95 transition disabled:opacity-50 disabled:cursor-not-allowed" onClick={function () { return handleMobileGitSyncClick(action); }}/>\
                       disabled={isSending || !!processingFunctionLabel} // Disable while sending or any function is processing
 // Disable while sending or any function is processing
                   >
                       <Icon size={18} className={"inline-block mr-1 ".concat(processingFunctionLabel === "Git ".concat(action) ? 'animate-pulse' : '')}/>
                       {processingFunctionLabel === "Git ".concat(action) ? '...' : label}\
                   </button>
               ))\
           }\
           </div>
       </div>) /* --- End New --- */;
{ /* --- End New --- */ }
{ /* Input Area and Send Button */ }
<form onSubmit={handleSend} className="w-full max-w-lg flex items-center gap-2 px-2">
        {/* Multimodal Input Buttons */}
        {/* TODO: Implement actual file/audio selection and handling */}
        <input type="file" accept="image/*" onChange={handleImageSelect} style={{ display: 'none' }} id="imageInput"/>
        <label htmlFor="imageInput" className="p-2 rounded-md bg-neutral-700 text-neutral-300 hover:bg-neutral-600 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed" title="Attach Image">
            <Image size={20}/>
        </label>
         <input type="file" accept="audio/*" onChange={handleAudioSelect} style={{ display: 'none' }} id="audioInput"/>
         <label htmlFor="audioInput" className="p-2 rounded-md bg-neutral-700 text-neutral-300 hover:bg-neutral-600 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed" title="Attach Audio">
             <Mic size={20}/>
         </label>
          <input type="file" onChange={handleFileSelect} style={{ display: 'none' }} id="fileInput"/>
          <label htmlFor="fileInput" className="p-2 rounded-md bg-neutral-700 text-neutral-300 hover:bg-neutral-600 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed" title="Attach File">
              <Paperclip size={20}/>
          </label>


        <input type="text" className="flex-grow p-3 rounded-xl bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 border border-neutral-300 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50" value={input} onChange={function (e) { return setInput(e.target.value); }}/>\
          placeholder="Chat with Jun.Ai.Key..."
          disabled={isSending} // Disable input while sending
 // Disable input while sending
        />
        <button type="submit" className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed" disabled={isSending || (!input.trim() && !selectedImage && !selectedAudio && !selectedFile)} // Disable if sending or input is empty and no multimodal content
>
          {isSending ? <Loader2 size={24} className="animate-spin"/> : <Send size={24}/>}\
        </button>
      </form>;
{ /* New: Display selected multimodal content */ }
{
    (selectedImage || selectedAudio || selectedFile) && ();
    <div className="w-full max-w-lg mt-2 p-3 bg-neutral-700/50 rounded-lg text-neutral-300 text-sm flex items-center justify-between">
               <div>
                   {selectedImage && <p>Image selected: {selectedImage.name}</p>}\
                   {selectedAudio && <p>Audio selected: {selectedAudio.name}</p>}\
                   {selectedFile && <p>File selected: {selectedFile.name}</p>}\
               </div>
               <button onClick={handleClearMultimodal} className="text-red-400 hover:text-red-600">
                   <XCircle size={20}/> Clear
               </button>
           </div>;
}
{ /* End New */ }
{ /* New: Display main error */ }
{
    error && ();
    <div className="w-full max-w-lg mt-4 p-3 bg-red-800/50 rounded-lg text-red-200 text-sm">
               Error: {error}
           </div>;
}
{ /* End New */ }
div >
;
;
;
exports.default = Chat; // Export the component
""(templateObject_3 || (templateObject_3 = __makeTemplateObject([""], [""])));
var templateObject_1, templateObject_2, templateObject_3;
