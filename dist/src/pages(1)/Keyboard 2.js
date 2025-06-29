import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
`` `typescript
// src/pages/Keyboard.tsx
// Smart Keyboard Page (Simulated iOS Traditional Chinese/English Keyboard)
// Provides a simulated keyboard UI with smart suggestions and function buttons.
// --- New: Create a page for the simulated smart keyboard UI --
// --- New: Implement basic keyboard layout (Bopomofo/English) --
// --- New: Add smart suggestion area (placeholder) --
// --- New: Add function button area (placeholder) --
// --- New: Add input display area --
// --- New: Add basic key press handling --
// --- New: Add language switch --
// --- New: Add placeholder for smart suggestions and knowledge base results --
// --- New: Add placeholder for function button actions --
// --- New: Add placeholder for AI response display --
// --- New: Add Mobile Git Sync Buttons --
// --- Modified: Refactor to use MessageBus for communication with InputAgent --
// --- Modified: Implement correlationId logic for responses --
// --- Modified: Refactor Suggested Action execution to use MessageBus --
// --- New: Implement Feedback Buttons for AI Responses --
// --- Modified: Update Function Button handlers to send specific messages --
// --- Modified: Update Suggested Action handler to send ActionIntent directly --
// --- Modified: Add state for feedback status on messages --
// --- Modified: Add "Text Extraction" button to function bar --
// --- Modified: Refactor Function Button handlers to send specific messages --
// --- New: Add debounced input listener to send message for real-time suggestions --
// --- Modified: Display smart suggestions and knowledge base results from SuggestionAgent --
// --- New: Add "Read URL" and "Analyze File" buttons to function bar --
// --- New: Add "Article Summary" button and logic (simulated) --


import React, { useState, useEffect, useRef, useCallback } from "react"; // Import useRef, useCallback
import {
  ClipboardList, CalendarDays, Text, QrCode, Calculator, Sparkles, Palette, Languages, Mic, Type, Share2, BookKey, GitPullRequest, GitPush, GitMerge, ThumbsUp, ThumbsDown, Camera, Lightbulb, Globe, FileText, FileSearch, Workflow
} from "lucide-react"; // Import Git icons, ThumbsUp, ThumbsDown, Camera, Lightbulb, Globe, FileText, FileSearch, Workflow
import { KnowledgeRecord, EvolutionaryInsight, ActionIntent, AgentMessage } from '../interfaces'; // Import necessary interfaces


// Define data structures (moved from Markdown)
// TODO: These should be fetched dynamically from the Knowledge Base or other modules (Part of \u96d9\u5410\u540c\u6b65\u9818\u57df / \u6c38\u4e45\u8a18\u61b6\u4e2d\u5fc3)
const FUNCTION_TABS = [
  { icon: Sparkles, label: "AI\u751f\u6210", actionType: 'answer_via_ai' }, // AI Generation (Leverages \u667a\u6167\u6c89\u6fb1\u79d8\u8853) - Use answer_via_ai for general AI chat
  { icon: BookKey, label: "\u77e5\u8b58\u5eab", actionType: 'search_knowledge' }, // Knowledge Base Interaction (Leverages \u6c38\u4e45\u8a18\u61b6\u4e2d\u5fc3)
  { icon: Camera, label: "\u6587\u5b57\u64f7\u53d6", actionType: 'simulate_visual_reading' }, // New: Text Extraction (Simulated via Device Agent)
  { icon: FileSearch, label: "\u6587\u7ae0\u6458\u8981", actionType: 'read_url' }, // New: Article Summary (Simulated via Device Agent/WebRune) - Reusing read_url action type
  { icon: FileText, label: "\u5206\u6790\u6a94\u6848", actionType: 'analyze_file_content' }, // New: Analyze file content (Simulated via Device Agent)
  { icon: ClipboardList, label: "\u526a\u8cbc\u7c3f", actionType: 'trigger_clipboard_action' }, // Clipboard Access (Requires Device Adapter Rune)
  { icon: CalendarDays, label: "\u65e5\u671f\u63d2\u5165", actionType: 'insert_date' }, // Date Insertion (Simple Utility or Rune)
  { icon: QrCode, label: "QR\u751f\u6210", actionType: 'qr_generate' }, // QR Code Generation (API Adapter Rune)
  { icon: Palette, label: "\u4e3b\u984c\u5207\u63db", actionType: 'change_theme' }, // UI Component Rune
  { icon: Share2, label: "\u5206\u4eab", actionType: 'share_content' }, // Sharing (Requires Device Adapter Rune)
  // { icon: Calculator, label: "\u8a08\u7b97\u6a5f" }, // Calculator (Simple Utility or Script Rune) - Removed for space
  // { icon: Languages, label: "\u7ffb\u8b6f" }, // Translation (AI Agent Rune) - Removed for space
  // { icon: Mic, label: "\u8a9e\u97f3\u8f38\u5165" }, // Voice Input (Device Adapter Rune) - Removed for space
  // { icon: Type, label: "\u624b\u5beb\u8f38\u5165" }, // Handwriting Input (Device Adapter Rune) - Removed for space
  // --- Removed: Read URL button, now covered by Article Summary --
  // { icon: Globe, label: "\u8b80\u53d6\u7db2\u5740", actionType: 'read_url' }, // Read URL content
  // --- End Removed --
];

// --- New: Add Mobile Git Sync Buttons ---
const MOBILE_GIT_SYNC_BUTTONS = [
    { icon: GitPullRequest, label: "Git Pull", action: 'pull' },
    { icon: GitPush, label: "Git Push", action: 'push' },
    { icon: GitMerge, label: "Git Sync", action: 'bidirectional' },
];
// --- End New ---

// TODO: These should be fetched dynamically from the Knowledge Base or suggested by AI (Part of \u6c38\u4e45\u8a18\u61b6\u4e2d\u5fc3 / \u667a\u6167\u6c89\u6fb1\u79d8\u8853)
const PHRASES = [
  { group: "\u5e38\u7528", items: ["\u4f60\u597d\uff0c\u4eca\u5929\u6709\u4ec0\u9ebc\u8a08\u756b\uff1f", "\u6e96\u5099\u4e0b\u73ed\u4e86\uff01", "\u5348\u9910\u5403\u4ec0\u9ebc\uff1f", "\u9031\u6703\u91cd\u9ede\uff1a\u2026", "\u5df2\u6536\u5230\uff0c\u99ac\u4e0a\u8655\u7406\u3002"] },
  { group: "\u6a21\u677f", items: ["[\u516c\u53f8\u540d] \u5730\u5740\uff1a", "\u6211\u7684\u90f5\u7bb1\uff1a", "\u5b85\u914d\u5230\u8ca8\u901a\u77e5\uff1a\u2026"] },
  // AI\u63a8\u85a6 will be dynamic
];

// Standard keyboard layouts (can be expanded or customized)
const BOPOMOFO_KEYS = [
  ["\u3105","\u3106","\u3107","\u3108","\u3109","\u310a","\u310b","\u310c","\u310d","\u310e","\u310f","\u3110","\u3111","\u3112"],
  ["\u3113","\u3114","\u3115","\u3116","\u3117","\u3118","\u3119","\u3127","\u3128","\u3129","\u311a","\u311b","\u311c","\u311d"],
  ["\u311e","\u311f","\u3120","\u3121","\u3122","\u3123","\u3124","\u3125","\u3126"],
  ["\u02ca","\u02c7","\u02cb","\u02d9"] // Tones
];

const ENGLISH_KEYS = [
  ["Q","W","E","R","T","Y","U","I","O","P"],
  ["A","S","D","F","G","H","J","K","L"],
  ["Z","X","C","V","B","N","M"]
];

// Access core modules from the global window object (for MVP simplicity)
declare const window: any;
const authorityForgingEngine: any = window.systemContext?.authorityForgingEngine; // Use any for action recording (\u6b0a\u80fd\u935b\u9020)
const junaiAssistant: any = window.systemContext?.junaiAssistant; // Access AI Assistant (\u667a\u6167\u6c89\u6fb1\u79d8\u8853) - Still used by InputAgent for MVP
const knowledgeSync: any = window.systemContext?.knowledgeSync; // Access Knowledge Sync (\u6c38\u4e45\u8a18\u61b6\u4e2d\u5fc3)
const runeEngraftingCenter: any = window.systemContext?.sacredRuneEngraver; // Access Rune Engrafting Center (\u7b26\u6587\u5d4c\u5408)
const wisdomSecretArt: any = window.systemContext?.wisdomSecretArt; // Access Wisdom Secret Art (\u667a\u6167\u6c89\u6fb1\u79d8\u8853)
const evolutionEngine: any = window.systemContext?.evolutionEngine; // Access Evolution Engine (\u7120\u9650\u9032\u5316)
const systemContext: any = window.systemContext; // Access the full context for currentUser


const Keyboard: React.FC = () => { // Changed component name to Keyboard and added FC type
  const [kb, setKb] = useState<'zh'|'en'>("zh"); // 'zh' for Bopomofo, 'en' for English
  const [input, setInput] = useState(""); // State to hold the simulated input text
  const [isProcessingFunction, setIsProcessingFunction] = useState(false); // State for function button loading
  const [processingFunctionLabel, setProcessingFunctionLabel] = useState<string | null>(null); // Track which function is processing
  const [smartSuggestions, setSmartSuggestions] = useState<ActionIntent[]>([]); // State for AI/Evolution suggestions (now ActionIntent objects)
  const [knowledgeResults, setKnowledgeResults] = useState<KnowledgeRecord[]>([]); // State for KB search results
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [isLoadingKnowledge, setIsLoadingKnowledge] = useState(false);
  const [aiResponse, setAiResponse] = useState<any>(null); // State to display AI response/action result (can be object)
  const [showAiResponseModal, setShowAiResponseModal] = useState(false); // State to control AI response modal
  const [useSemanticSearch, setUseSemanticSearch] = useState(false); // State to toggle semantic search

  // --- New: State for tracking pending requests by correlationId ---
  const [pendingRequests, setPendingRequests] = useState<Record<string, boolean>>({});
  // --- End New ---

  // --- New: State to temporarily store decisions by correlationId until the KB record arrives --
  const [pendingDecisions, setPendingDecisions] = useState<Record<string, ActionIntent>>({});
  // --- End New ---

  // --- New: State for feedback status on messages ---
  const [feedbackStatus, setFeedbackStatus] = useState<Record<string, 'correct' | 'incorrect' | null>>({}); // Map: recordId -> feedback status
  // --- End New ---

  // --- New: State for multimodal input (needed for Text Extraction) ---
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null); // Ref for hidden file input
  // --- New: Add state for selected file for analysis ---
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null); // Ref for hidden file input
  // --- End New ---

  // --- New: State for error display ---
  const [error, setError] = useState<string | null>(null);
  // --- End New ---


  // TODO: Implement fetching smart suggestions based on input and context
  // useEffect(() => {
  //   // Fetch suggestions when input changes or context changes
  //   // This would involve calling WisdomSecretArt or EvolutionEngine
  //   // For MVP, suggestions are static placeholders
  // }, [input, systemContext?.currentUser]);

  // TODO: Implement fetching knowledge results based on input and search toggle
  // useEffect(() => {
  //   // Fetch knowledge results when input changes or search toggle changes
  //   // This would involve calling KnowledgeSync
  //   // For MVP, knowledge results are static placeholders
  // }, [input, useSemanticSearch, systemContext?.currentUser]);


  const handleKeyClick = (key: string) => {
    setInput(prevInput => prevInput + key);
  };

  // --- New: Debounce input and send message for real-time suggestions --
  useEffect(() => {
      const userId = systemContext?.currentUser?.id;
      if (!userId || !systemContext?.messageBus) {
          // Clear suggestions if user logs out or MessageBus is not available
          setSmartSuggestions([]);
          setKnowledgeResults([]);
          setIsLoadingSuggestions(false);
          setIsLoadingKnowledge(false);
          return;
      }

      // Debounce the input change
      const handler = setTimeout(() => {
          console.log(`;
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
return () => {
    clearTimeout(handler);
    // Optionally reset loading states on cleanup if needed
    // setIsLoadingSuggestions(false);
    // setIsLoadingKnowledge(false);
};
[input, systemContext?.currentUser?.id, systemContext?.messageBus];
; // Re-run effect when input, user ID, or MessageBus changes
// --- End New ---
// --- New: Subscribe to suggestion_update messages from the MessageBus ---
useEffect(() => {
    let unsubscribeSuggestionUpdate;
    if (systemContext?.messageBus) { // Check if MessageBus is available
        const messageBus = systemContext.messageBus;
        const userId = systemContext?.currentUser?.id;
        unsubscribeSuggestionUpdate = messageBus.subscribe('suggestion_update', (message) => {
            // Check if this update is for the current user
            if (message.payload?.userId === userId) {
                console.log('Keyboard page received suggestion_update event:', message);
                // Update the suggestions and knowledge results states
                if (message.payload?.suggestions) {
                    setSmartSuggestions(message.payload.suggestions);
                }
                if (message.payload?.knowledgeResults) {
                    setKnowledgeResults(message.payload.knowledgeResults);
                }
                // Update loading states
                if (message.payload?.isLoadingSuggestions !== undefined) {
                    setIsLoadingSuggestions(message.payload.isLoadingSuggestions);
                }
                if (message.payload?.isLoadingKnowledge !== undefined) {
                    setIsLoadingKnowledge(message.payload.isLoadingKnowledge);
                }
            }
        });
    }
    return () => {
        // Unsubscribe on component unmount
        unsubscribeSuggestionUpdate?.(); // Unsubscribe from suggestion updates
    };
}, [systemContext?.currentUser?.id, systemContext?.messageBus]); // Re-run effect when user ID or MessageBus changes
// --- End New ---
// --- Modified: Handle Function Button Click (Refactored) ---
const handleFunctionClick = async (label, actionType) => {
    const userId = systemContext?.currentUser?.id;
    if (!userId || !systemContext?.messageBus) {
        alert("User not logged in or Message Bus not available.");
        return;
    }
    // Simulate recording user action
    authorityForgingEngine?.recordAction({
        type: `web:keyboard:function_button:${label}`,
        details: { label, actionType },
        context: { platform: 'web', page: 'keyboard' },
        user_id: userId, // Associate action with user
    });
    if (actionType) {
        // If the button has an actionType, send it as an execute_action_intent message
        setProcessingFunctionLabel(label); // Show loading state for this button
        setError(null); // Clear previous errors
        // Generate a correlation ID for this function button request
        const correlationId = `func-${Date.now()}-${Math.random().toString(16).slice(2)}`;
        setPendingRequests(prev => ({ ...prev, [correlationId]: true }));
        try {
            // Create the ActionIntent based on the button's actionType
            const actionIntent = {
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
                    setPendingRequests(prev => { const newState = { ...prev }; delete newState[correlationId]; return newState; });
                    return; // Exit the function here
                }
                else {
                    alert("Image input is not available.");
                    setProcessingFunctionLabel(null); // Reset loading state
                    setPendingRequests(prev => { const newState = { ...prev }; delete newState[correlationId]; return newState; });
                    return; // Exit if image input not available
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
                    setPendingRequests(prev => { const newState = { ...prev }; delete newState[correlationId]; return newState; });
                    return; // Exit if no URL entered
                }
            }
            else if (actionType === 'analyze_file_content') {
                // For analyzing file content, the input is the selected file
                if (fileInputRef.current) {
                    fileInputRef.current.click();
                    // The actual action will be sent in handleFileSelect after the user picks a file.
                    // Reset loading state and pending request here, as the action isn't sent yet.
                    setProcessingFunctionLabel(null);
                    setPendingRequests(prev => { const newState = { ...prev }; delete newState[correlationId]; return newState; });
                    return; // Exit the function here
                }
                else {
                    alert("File input is not available.");
                    setProcessingFunctionLabel(null); // Reset loading state
                    setPendingRequests(prev => { const newState = { ...prev }; delete newState[correlationId]; return newState; });
                    return; // Exit if file input not available
                }
            }
            // TODO: Add default parameters for other actionTypes if needed
            // Send the message for actions that don't require file selection
            if (actionType !== 'simulate_visual_reading' && actionType !== 'analyze_file_content') {
                systemContext.messageBus.send({
                    type: 'execute_action_intent', // Message type to execute a pre-defined action intent
                    payload: { decision: actionIntent, context: { conversation_id: 'default-web-chat', correlationId: correlationId, originalInput: input.trim() } }, // Pass the ActionIntent and context
                    recipient: 'input', // Target the InputAgent
                    correlationId: correlationId, // Include correlation ID
                    sender: 'keyboard_ui', // Identify the sender
                });
                // Clear input after sending an action
                setInput('');
                // The response will be handled by the agent_response listener
            }
        }
        catch (err) {
            console.error(`Error sending function button message (${label}):`, err);
            setError(`Error executing function \\\"${label}\\\": ${err.message}`);
            setProcessingFunctionLabel(null); // Reset loading state on error
            setPendingRequests(prev => { const newState = { ...prev }; delete newState[correlationId]; return newState; }); // Clear pending state on error
        }
        finally {
            // ProcessingFunctionLabel and pendingRequests are reset by the agent_response listener
            // For file/image selection, these are reset in the file selection handlers
        }
    }
    else {
        // If no actionType, just set the input field (for phrases or simple text insertion)
        setInput(prevInput => prevInput + label);
    }
};
// --- End Modified ---
// --- New: Handle Phrase Click ---
const handlePhraseClick = (phrase) => {
    // Simulate recording user action
    const userId = systemContext?.currentUser?.id;
    if (userId) {
        authorityForgingEngine?.recordAction({
            type: 'web:keyboard:phrase_click',
            details: { phrase },
            context: { platform: 'web', page: 'keyboard' },
            user_id: userId, // Associate action with user
        });
    }
    setInput(prevInput => prevInput + phrase);
};
// --- End New ---
// --- New: Handle Knowledge Click (Insert into input) ---
const handleKnowledgeClick = (record) => {
    // Simulate recording user action
    const userId = systemContext?.currentUser?.id;
    if (userId) {
        authorityForgingEngine?.recordAction({
            type: 'web:keyboard:kb_insert',
            details: { recordId: record.id, question: record.question },
            context: { platform: 'web', page: 'keyboard' },
            user_id: userId, // Associate action with user
        });
    }
    // Insert the answer into the input field
    setInput(prevInput => prevInput + record.answer);
};
// --- End New ---
// --- New: Handle Suggestion Click (Insert into input or trigger action) ---
const handleSuggestionClick = (suggestion) => {
    // Simulate recording user action
    const userId = systemContext?.currentUser?.id;
    if (userId) {
        authorityForgingEngine?.recordAction({
            type: 'web:keyboard:suggestion_click',
            details: { suggestionAction: suggestion.action, suggestionParams: suggestion.parameters },
            context: { platform: 'web', page: 'keyboard' },
            user_id: userId, // Associate action with user
        });
    }
    // If the suggestion is a simple answer, insert it into the input
    if (suggestion.action === 'answer_via_ai' && suggestion.parameters?.question) {
        setInput(prevInput => prevInput + suggestion.parameters.question);
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
const handleMobileGitSyncClick = async (action) => {
    const userId = systemContext?.currentUser?.id;
    if (!userId || !systemContext?.messageBus) {
        alert("User not logged in or Message Bus not available.");
        return;
    }
    console.log(`Mobile Git Sync button clicked: ${action}`);
    // Simulate recording user action
    authorityForgingEngine?.recordAction({
        type: `web:keyboard:mobile_git_sync_button:${action}`,
        details: { action },
        context: { platform: 'web', page: 'keyboard' },
        user_id: userId, // Associate action with user
    });
    setProcessingFunctionLabel(`Git ${action}`); // Show loading state
    setError(null); // Clear previous errors
    // Generate a correlation ID for this request
    const correlationId = `git-${action}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    setPendingRequests(prev => ({ ...prev, [correlationId]: true }));
    try {
        // Create the ActionIntent for the sync action
        const actionIntent = {
            action: 'sync_mobile_git', // The action type for mobile git sync
            parameters: { direction: action }, // Pass the direction as a parameter
        };
        systemContext.messageBus.send({
            type: 'execute_action_intent', // Message type to execute a pre-defined action intent
            payload: { decision: actionIntent, context: { conversation_id: 'default-web-chat', correlationId: correlationId, originalInput: `Simulate Git ${action}` } }, // Pass the ActionIntent and context
            recipient: 'input', // Target the InputAgent
            correlationId: correlationId, // Include correlation ID
            sender: 'keyboard_ui', // Identify the sender
        });
        // The response will be handled by the agent_response listener
    }
    catch (err) {
        console.error(`Error sending Git sync message (${action}):`, err);
        setError(`Error simulating Git ${action}: ${err.message}`);
        setProcessingFunctionLabel(null); // Reset loading state on error
        setPendingRequests(prev => { const newState = { ...prev }; delete newState[correlationId]; return newState; }); // Clear pending state on error
    }
    finally {
        // ProcessingFunctionLabel and pendingRequests are reset by the agent_response listener
    }
};
// --- End New ---
// --- New: Handle Image Selection for Text Extraction ---\
const handleImageSelectForExtraction = async (event) => {
    const userId = systemContext?.currentUser?.id;
    if (!userId || !systemContext?.messageBus || !event.target.files || !event.target.files[0]) {
        setSelectedImage(null); // Clear selected image if no file
        return;
    }
    const imageFile = event.target.files[0];
    setSelectedImage(imageFile); // Store the selected image file
    console.log(`Image selected for extraction: ${imageFile.name}`);
    // Simulate recording user action
    authorityForgingEngine?.recordAction({
        type: 'web:keyboard:image_select_for_extraction',
        details: { fileName: imageFile.name, fileSize: imageFile.size },
        context: { platform: 'web', page: 'keyboard' },
        user_id: userId, // Associate action with user
    });
    setProcessingFunctionLabel("\u6587\u5b57\u64f7\u53d6"); // Show loading state
    setError(null); // Clear previous errors
    // Generate a correlation ID for this request
    const correlationId = `ocr-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    setPendingRequests(prev => ({ ...prev, [correlationId]: true }));
    try {
        // Create the ActionIntent for the simulate_visual_reading action
        const actionIntent = {
            action: 'simulate_visual_reading', // The action type for text extraction
            parameters: { imageUrl: URL.createObjectURL(imageFile) }, // Pass the image URL (Object URL for simulation)
        };
        systemContext.messageBus.send({
            type: 'execute_action_intent', // Message type to execute a pre-defined action intent
            payload: { decision: actionIntent, context: { conversation_id: 'default-web-chat', correlationId: correlationId, originalInput: `Extract text from image: ${imageFile.name}` } }, // Pass the ActionIntent and context
            recipient: 'input', // Target the InputAgent
            correlationId: correlationId, // Include correlation ID
            sender: 'keyboard_ui', // Identify the sender
        });
        // Clear the selected image state after sending the message
        setSelectedImage(null);
        // The response will be handled by the agent_response listener
    }
    catch (err) {
        console.error(`Error sending text extraction message:`, err);
        setError(`Error extracting text: ${err.message}`);
        setProcessingFunctionLabel(null); // Reset loading state on error
        setPendingRequests(prev => { const newState = { ...prev }; delete newState[correlationId]; return newState; }); // Clear pending state on error
    }
    finally {
        // ProcessingFunctionLabel and pendingRequests are reset by the agent_response listener
        // These are reset in the FileReader onload/onerror handlers
    }
};
// --- End New ---
// --- New: Handle File Selection for Analysis ---\
const handleFileSelectForAnalysis = async (event) => {
    const userId = systemContext?.currentUser?.id;
    if (!userId || !systemContext?.messageBus || !event.target.files || !event.target.files[0]) {
        setSelectedFile(null); // Clear selected file if no file
        return;
    }
    const file = event.target.files[0];
    setSelectedFile(file); // Store the selected file
    console.log(`File selected for analysis: ${file.name}`);
    // Simulate recording user action
    authorityForgingEngine?.recordAction({
        type: 'web:keyboard:file_select_for_analysis',
        details: { fileName: file.name, fileSize: file.size },
        context: { platform: 'web', page: 'keyboard' },
        user_id: userId, // Associate action with user
    });
    setProcessingFunctionLabel("\u5206\u6790\u6a94\u6848"); // Show loading state
    setError(null); // Clear previous errors
    // Generate a correlation ID for this request
    const correlationId = `file-analysis-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    setPendingRequests(prev => ({ ...prev, [correlationId]: true }));
    try {
        // Read the file content
        const reader = new FileReader();
        reader.onload = async (e) => {
            const fileContent = e.target?.result; // Assuming text file content
            // Create the ActionIntent for the analyze_file_content action
            const actionIntent = {
                action: 'analyze_file_content', // The action type for file analysis
                parameters: {
                    content: fileContent,
                    fileMetadata: { name: file.name, type: file.type, size: file.size },
                },
            };
            // Now send the message after reading the file
            systemContext.messageBus.send({
                type: 'execute_action_intent', // Message type to execute a pre-defined action intent
                payload: { decision: actionIntent, context: { conversation_id: 'default-web-chat', correlationId: correlationId, originalInput: `Analyze file: ${file.name}` } }, // Pass the ActionIntent and context
                recipient: 'input', // Target the InputAgent
                correlationId: correlationId, // Include correlation ID
                sender: 'keyboard_ui', // Identify the sender
            });
            // Clear the selected file state after sending the message
            setSelectedFile(null);
            // ProcessingFunctionLabel and pendingRequests are reset by the agent_response listener
        };
        reader.onerror = (e) => {
            console.error('Error reading file:', e);
            setError(`Failed to read file: ${file.name}`);
            setProcessingFunctionLabel(null); // Reset loading state on error
            setPendingRequests(prev => { const newState = { ...prev }; delete newState[correlationId]; return newState; }); // Clear pending state on error
            alert(`Failed to read file: ${file.name}`);
        };
        reader.readAsText(file); // Read file as text (adjust for binary files)
        // Exit the function here, the message will be sent in onload
        return;
    }
    catch (err) {
        console.error(`Error sending file analysis message:`, err);
        setError(`Error analyzing file: ${err.message}`);
        setProcessingFunctionLabel(null); // Reset loading state on error
        setPendingRequests(prev => { const newState = { ...prev }; delete newState[correlationId]; return newState; }); // Clear pending state on error
    }
    finally {
        // ProcessingFunctionLabel and pendingRequests are reset by the agent_response listener
        // These are reset in the FileReader onload/onerror handlers
    }
};
// --- End New ---
// Ensure user is logged in before rendering content
if (!systemContext?.currentUser) {
    // This case should ideally be handled by ProtectedRoute, but as a fallback:
    return (_jsx("div", { className: "container mx-auto p-4 flex justify-center", children: _jsx("div", { className: "bg-neutral-800/50 p-8 rounded-lg shadow-xl w-full max-w-md text-center text-neutral-300", children: _jsx("p", { children: "Please log in to use the chat." }) }) }));
}
return (
// Added a main container div with basic centering and padding
_jsxs("div", { className: "container mx-auto p-4 flex flex-col items-center", children: [_jsxs("header", { className: "text-center mb-6", children: [_jsxs("h1", { className: "text-3xl font-bold text-neutral-800 dark:text-neutral-200", children: ["Jun.Ai.key (", _jsx("span", { className: "text-blue-400", children: "\\u842c\\u80fd\\u5143\\u9375" }), ")"] }), _jsxs("p", { className: "text-neutral-600 dark:text-neutral-400", children: ["\\u9375\\u76e4 (", _jsx("span", { className: "text-blue-400", children: "\\u842c\\u80fd\\u5143\\u9375" }), ") \\u00d7 \\u4fbf\\u7c3d \\u00d7 AI \\u00d7 \\u5167\\u5bb9\\u6574\\u5408 \\u00b7 ToMemo/Flexiboard \\u98a8\\u683cDemo"] })] }), _jsx("div", { className: "w-full max-w-lg h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-300 dark:scrollbar-thumb-neutral-700 mb-4 p-4 bg-neutral-800/50 rounded-lg shadow-inner flex flex-col space-y-4", children: _jsx("p", { className: "text-neutral-400 text-center", children: "Chat history view is on the Chat page." }) }), _jsx("nav", { className: "w-full max-w-lg flex flex-row items-center gap-2 py-3 px-1 overflow-x-auto scrollbar-thin scrollbar-thumb-neutral-200 dark:scrollbar-thumb-neutral-700 mb-1", children: FUNCTION_TABS.map(({ icon: Icon, label, actionType }) => ( // Added actionType
            _jsxs("button", { className: "flex flex-col items-center justify-center px-3 py-2 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-800 shadow active:scale-95 hover:bg-blue-50 hover:dark:bg-blue-900 transition flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed", onClick: () => handleFunctionClick(label, actionType), disabled: isSending || !!processingFunctionLabel, children: [_jsx(Icon, { size: 24, className: "mb-0.5 text-blue-500" }), _jsx("span", { className: "text-xs text-neutral-600 dark:text-neutral-300 font-semibold", children: processingFunctionLabel === label ? '...' : label })] }, label))) }), _jsxs("div", { className: "w-full max-w-lg px-4 py-3 rounded-xl bg-white/90 shadow border border-neutral-100 dark:bg-neutral-900/90 dark:border-neutral-800 flex items-center justify-between select-none mb-2", children: [_jsx("div", { className: "text-lg tracking-widest font-mono text-neutral-900 dark:text-neutral-100 whitespace-nowrap overflow-x-auto max-w-[75vw] scrollbar-thin", children: input || _jsx("span", { className: "text-neutral-300 dark:text-neutral-600", children: "\\u8acb\\u8f38\\u5165\\u2026" }) }), _jsx("button", { className: "ml-2 px-2 py-1 text-xs rounded hover:bg-neutral-200 dark:hover:bg-neutral-800 transition text-neutral-600 dark:text-neutral-300", onClick: () => setInput(""), disabled: isSending, children: "\\u6e05\\u9664" })] }), _jsx("section", { className: "w-full max-w-lg flex flex-col h-32 overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-300 dark:scrollbar-thumb-neutral-700 mb-2 gap-2", children: PHRASES.map(section => (_jsxs("div", { className: "", children: [_jsx("div", { className: "text-xs text-neutral-500 dark:text-neutral-400 font-bold mb-1 pl-1", children: section.group }), _jsx("div", { className: "flex flex-row flex-wrap gap-2", children: section.items.map((phrase, i) => (_jsx("button", { className: "px-3 py-2 rounded-2xl bg-[#f7fafe] dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 shadow-sm hover:bg-blue-100 hover:dark:bg-neutral-600 text-[15px] font-medium text-neutral-700 dark:text-neutral-50 flex-shrink-0 active:scale-95 transition disabled:opacity-50 disabled:cursor-not-allowed", onClick: () => handlePhraseClick(phrase), disabled: isSending, children: phrase }, phrase + i))) })] }, section.group))) }), _jsxs("div", { className: "w-full max-w-lg flex flex-col gap-2 mb-3 px-2", children: [_jsxs("div", { className: "flex flex-col gap-1", children: [_jsx("div", { className: "text-xs text-neutral-500 dark:text-neutral-400 font-bold mb-1 pl-1", children: "\\u667a\\u6167\\u63a8\\u85a6 (AI Suggestions)" }), _jsxs("div", { className: "flex flex-row flex-wrap gap-2 min-h-[30px]", children: [" ", isLoadingSuggestions ? (_jsx("span", { className: "text-neutral-400 text-sm", children: "\\u8f09\\u5165\\u5efa\\u8b70\\u4e2d..." })) : smartSuggestions.length > 0 ? (smartSuggestions.map((suggestion, i) => (_jsx("button", { className: "px-3 py-2 rounded-2xl bg-blue-500/80 hover:bg-blue-600/80 text-white text-[15px] font-medium shadow-sm flex-shrink-0 active:scale-95 transition disabled:opacity-50 disabled:cursor-not-allowed", onClick: () => handleSuggestionClick(suggestion), disabled: isSending, children: suggestion.action === 'answer_via_ai' ? suggestion.parameters?.question?.substring(0, 30) + '...' : suggestion.action.replace(/_/g, ' ') }, 'ai-sug-' + i)))) : (!isLoadingSuggestions && _jsx("span", { className: "text-neutral-400 text-sm", children: "\\u7121\\u667a\\u6167\\u63a8\\u85a6" }))] })] }), _jsxs("div", { className: "flex flex-col gap-1", children: [_jsxs("div", { className: "flex justify-between items-center mb-1 pl-1", children: [_jsx("div", { className: "text-xs text-neutral-500 dark:text-neutral-400 font-bold", children: "\\u77e5\\u8b58\\u5eab\\u63d2\\u5165 (Knowledge Base)" }), _jsx("button", { className: `text-xs font-semibold px-2 py-0.5 rounded-full transition ${useSemanticSearch ? 'bg-blue-500 text-white' : 'bg-neutral-200 text-neutral-700 dark:bg-neutral-700 dark:text-neutral-300'} disabled:opacity-50 disabled:cursor-not-allowed`, onClick: () => setUseSemanticSearch(!useSemanticSearch), disabled: isLoadingKnowledge || isSending, children: useSemanticSearch ? '\u8a9e\u7fa9\u641c\u7d22 ON' : '\u8a9e\u7fa9\u641c\u7d22 OFF' })] }), _jsxs("div", { className: "flex flex-row flex-wrap gap-2 min-h-[30px]", children: [" ", isLoadingKnowledge ? (_jsx("span", { className: "text-neutral-400 text-sm", children: "\\u641c\\u5c0b\\u77e5\\u8b58\\u5eab\\u4e2d..." })) : knowledgeResults.length > 0 ? (knowledgeResults.map((record) => (_jsxs("button", { className: "px-3 py-2 rounded-2xl bg-green-400/80 hover:bg-green-500/80 text-white text-[15px] font-medium shadow-sm flex-shrink-0 active:scale-95 transition disabled:opacity-50 disabled:cursor-not-allowed", onClick: () => handleKnowledgeClick(record), title: `Q: ${record.question}`, disabled: isSending, children: [record.answer.substring(0, 30), record.answer.length > 30 ? '...' : '', " "] }, 'kb-res-' + record.id)))) : (!isLoadingKnowledge && _jsx("span", { className: "text-neutral-400 text-sm", children: "\\u7121\\u76f8\\u95dc\\u77e5\\u8b58" }))] })] })] }), _jsxs("div", { className: "w-full max-w-lg flex flex-col gap-2 mb-3 px-2", children: [_jsx("div", { className: "text-xs text-neutral-500 dark:text-neutral-400 font-bold mb-1 pl-1", children: "Mobile Git Sync (\\u6a21\\u64ec)" }), _jsx("div", { className: "flex flex-row flex-wrap gap-2", children: MOBILE_GIT_SYNC_BUTTONS.map(({ icon: Icon, label, action }) => (_jsxs("button", { className: "px-3 py-2 rounded-2xl bg-purple-500/80 hover:bg-purple-600/80 text-white text-[15px] font-medium shadow-sm flex-shrink-0 active:scale-95 transition disabled:opacity-50 disabled:cursor-not-allowed", onClick: () => handleMobileGitSyncClick(action), disabled: isSending || !!processingFunctionLabel, children: [_jsx(Icon, { size: 18, className: `inline-block mr-1 ${processingFunctionLabel === `Git ${action}` ? 'animate-pulse' : ''}` }), processingFunctionLabel === `Git ${action}` ? '...' : label] }, action))) })] }), _jsxs("section", { className: "bg-white/95 dark:bg-neutral-900 rounded-3xl shadow-2xl pt-4 pb-7 px-3 w-full max-w-lg mb-3 border border-neutral-200 dark:border-neutral-800 select-none", children: [_jsxs("div", { className: "flex justify-between items-center pb-3 px-2", children: [_jsx("button", { onClick: () => setKb(kb === 'zh' ? 'en' : 'zh'), className: "px-3 py-1.5 rounded-xl bg-neutral-200/70 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-200 text-xs font-semibold shadow active:scale-95 transition disabled:opacity-50", disabled: isSending, children: kb === 'zh' ? '\u5207\u63db\u82f1\u6587' : '\u5207\u63db\u6ce8\u97f3' }), _jsx("span", { className: "text-xs text-neutral-400", children: "\\u9375\\u76e4\\u9ad4\\u9a57\\u8cbc\\u8fd1 iOS" })] }), kb === 'zh' ? (_jsxs("div", { className: "flex flex-col gap-1", children: [" ", BOPOMOFO_KEYS.map((row, rowIndex) => (_jsx("div", { className: "flex justify-center gap-1", children: row.map((key, keyIndex) => (_jsx("button", { className: `flex-1 h-10 rounded-md flex items-center justify-center text-lg font-medium ${key ? 'bg-neutral-300/70 dark:bg-neutral-700/70 text-neutral-900 dark:text-neutral-100 active:bg-neutral-400/70 dark:active:bg-neutral-600/70' : 'bg-transparent cursor-default'} disabled:opacity-50`, onClick: () => handleKeyClick(key), disabled: !key || isSending, children: key `` ` }, keyIndex))) }, rowIndex)))] })) : ] })] }));
