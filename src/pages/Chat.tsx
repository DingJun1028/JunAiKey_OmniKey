```typescript
// src/pages/Chat.tsx
// Chat Page
// Provides a natural language interface to interact with Jun.Ai.Key.
// --- New: Add UI for chat interaction and history display --
// --- New: Display AI Decision and Suggested Actions --
// --- New: Improve Chat UI Styling and Suggested Action Interaction --
// --- New: Add Feedback Buttons for AI Responses --
// --- Modified: Refactor to use MessageBus for communication with InputAgent --
// --- Modified: Implement correlationId logic for responses --
// --- Modified: Refactor Suggested Action execution to use MessageBus --
// --- New: Add UI for sending multimodal input (photos, voice, files) --
// --- Modified: Update message display to handle multimodal content --
// --- Modified: Add "Text Extraction" button to function bar --
// --- Modified: Refactor Function Button handlers to send specific messages --
// --- New: Add debounced input listener to send message for real-time suggestions --
// --- Modified: Display smart suggestions and knowledge base results from SuggestionAgent --
// --- New: Add "Read URL" and "Analyze File" buttons to function bar --
// --- Modified: Display relevantKnowledge from AI response for RAG --

import React, { useEffect, useState, useRef } from 'react';
import { JunAiAssistant } from '../junai'; // Still used by InputAgent for MVP
import { KnowledgeSync } from '../modules/knowledgeSync';
import { EvolutionEngine } from '../core/evolution/EvolutionEngine'; // Import EvolutionEngine
import { KnowledgeRecord, ActionIntent, AgentMessage } from '../interfaces'; // Import KnowledgeRecord, ActionIntent, AgentMessage
import { Send, Loader2, User as UserIcon, Bot, Play, Zap, Search, GitMerge, Target, Info, AlertTriangle, MessageSquare, Globe, Code, FileText, Database, Palette, Settings, Key, Cloud, Copy, Brain, FileUp, FileDown, Share2, Search as SearchIcon, ThumbsUp, ThumbsDown, Image, Mic, Paperclip, Camera, ClipboardList, CalendarDays, QrCode, Share2 as ShareIcon, BookKey, Sparkles, Lightbulb, GitPullRequest, GitPush } from 'lucide-react'; // Import icons including ThumbsUp, ThumbsDown, Image, Mic, Paperclip, Camera, etc.\
import ReactMarkdown from 'react-markdown'; // For rendering markdown in AI responses\
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation\


// Define data structures (moved from Markdown)
// TODO: These should be fetched dynamically from the Knowledge Base or other modules (Part of \u96d9\u5410\u540c\u6b65\u9818\u57df / \u6c38\u4e45\u8a18\u61b6\u4e2d\u5fc3)
const FUNCTION_TABS = [
  { icon: Sparkles, label: "AI\u751f\u6210", actionType: 'answer_via_ai' }, // AI Generation (Leverages \u667a\u6167\u6c89\u6fb1\u79d8\u8853) - Use answer_via_ai for general AI chat
  { icon: BookKey, label: "\u77e5\u8b58\u5eab", actionType: 'search_knowledge' }, // Knowledge Base Interaction (Leverages \u6c38\u4e45\u8a18\u61b6\u4e2d\u5fc3)
  { icon: Camera, label: "\u6587\u5b57\u64f7\u53d6", actionType: 'simulate_visual_reading' }, // New: Text Extraction (Simulated via Device Agent)
  { icon: ClipboardList, label: "\u526a\u8cbc\u7c3f", actionType: 'trigger_clipboard_action' }, // Clipboard Access (Requires Device Adapter Rune)
  { icon: CalendarDays, label: "\u65e5\u671f\u63d2\u5165", actionType: 'insert_date' }, // Date Insertion (Simple Utility or Rune)
  { icon: QrCode, label: "QR\u751f\u6210", actionType: 'qr_generate' }, // QR Code Generation (API Adapter Rune)
  { icon: Palette, label: "\u4e3b\u984c\u5207\u63db", actionType: 'change_theme' }, // UI Component Rune
  { icon: ShareIcon, label: "\u5206\u4eab", actionType: 'share_content' }, // Sharing (Requires Device Adapter Rune)
  // { icon: Calculator, label: "\u8a08\u7b97\u5668" }, // Calculator (Simple Utility or Script Rune) - Removed for space
  // { icon: Languages, label: "\u7ffb\u8b6f" }, // Translation (AI Agent Rune) - Removed for space
  // { icon: Mic, label: "\u8a9e\u97f3\u8f38\u5165" }, // Voice Input (Device Adapter Rune) - Removed for space
  // { icon: Type, label: "\u624b\u5beb\u8f38\u5165" }, // Handwriting Input (Device Adapter Rune) - Removed for space
  // --- New: Add Web and File Analysis Buttons ---
  { icon: Globe, label: "\u8b80\u53d6\u7db2\u5740", actionType: 'read_url' }, // Read URL content
  { icon: FileText, label: "\u5206\u6790\u6a94\u6848", actionType: 'analyze_file_content' }, // Analyze file content
  // --- End New ---
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


// Access core modules from the global window object (for MVP simplicity)
declare const window: any;
const junaiAssistant: JunAiAssistant = window.systemContext?.junaiAssistant; // Still used by InputAgent for MVP
const knowledgeSync: KnowledgeSync = window.systemContext?.knowledgeSync; // Interacts with MemoryEngine (\u6c38\u4e45\u8a18\u61b6)
const authorityForgingEngine: any = window.systemContext?.authorityForgingEngine; // Use any for action recording (\u6b0a\u80fd\u935b\u9020)
const evolutionEngine: EvolutionEngine = window.systemContext?.evolutionEngine; // Access EvolutionEngine (\u7120\u9650\u9032\u5316)
const systemContext: any = window.systemContext; // Access the full context for currentUser


// Define a type for messages displayed in the UI, including the AI's decision
interface ChatMessage extends KnowledgeRecord {
    aiDecision?: ActionIntent | null; // Optional field to store the AI's decision for this turn
    isTemporary?: boolean; // Flag for optimistic updates
    // --- New: Add feedback status ---
    feedback?: 'correct' | 'incorrect' | null; // User feedback status
    // --- End New ---
    // --- New: Add correlationId for tracking responses ---
    correlationId?: string; // Correlation ID for messages sent via MessageBus
    // --- End New ---
    // --- New: Add fields for multimodal content display ---
    // These fields are already in KnowledgeRecord, but explicitly listed here for clarity in ChatMessage context
    image_url?: string; // URL to an associated image
    audio_url?: string; // URL to associated audio
    file_url?: string; // URL to an associated file
    file_metadata?: any; // Metadata about the file (e.g., name, type, size)
    // --- End New ---
    // --- New: Add relevantKnowledge for RAG display ---
    relevantKnowledge?: KnowledgeRecord[]; // Relevant knowledge records used for RAG
    // --- End New ---
}


const Chat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]); // State to hold conversation history
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null); // Ref for auto-scrolling
  const navigate = useNavigate(); // Hook for navigation

  // --- New: State for tracking pending requests by correlationId ---\
  const [pendingRequests, setPendingRequests] = useState<Record<string, boolean>>({});
  // --- End New ---\

  // --- New: State to temporarily store decisions and relevantKnowledge by correlationId until the KB record arrives --
  // Store { decision: ActionIntent, relevantKnowledge?: KnowledgeRecord[] }
  const [pendingResults, setPendingResults] = useState<Record<string, { decision?: ActionIntent, relevantKnowledge?: KnowledgeRecord[] }>>({});
  // --- End New ---\

  // --- New: State for feedback status on messages ---\
  const [feedbackStatus, setFeedbackStatus] = useState<Record<string, 'correct' | 'incorrect' | null>>({}); // Map: recordId -> feedback status
  // --- End New ---\

  // --- New: State for multimodal input ---\
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedAudio, setSelectedAudio] = useState<File | null>(null); // Or Blob for recording
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  // --- End New ---\

  // --- New: State for processing function button clicks ---\
  const [processingFunctionLabel, setProcessingFunctionLabel] = useState<string | null>(null);
  // --- End New ---\

  // --- New: State for smart suggestions and knowledge base results (populated by SuggestionAgent) ---\
  const [smartSuggestions, setSmartSuggestions] = useState<ActionIntent[]>([]); // AI Suggestions (ActionIntent objects)\
  const [knowledgeResults, setKnowledgeResults] = useState<KnowledgeRecord[]>([]); // KB Search Results (KnowledgeRecord objects)\
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false); // Loading state for suggestions\
  const [isLoadingKnowledge, setIsLoadingKnowledge] = useState(false); // Loading state for KB results\
  // --- End New ---\


  const fetchConversationHistory = async () => {
       const userId = systemContext?.currentUser?.id;
       if (!knowledgeSync || !userId) {
            setError("KnowledgeSync module not initialized or user not logged in.");
            setLoading(false);
            return;
        }
      setLoading(true);
      setError(null); // Clear main error when fetching
      try {
          // Fetch knowledge records with source 'dev-conversation' for the current user
          // This assumes conversation history is stored as knowledge records
          const allRecords = await knowledgeSync.getAllKnowledgeForUser(userId); // Fetch all for simplicity
          const conversationHistory = allRecords
              .filter(record => record.source === 'dev-conversation')
              // Sort by timestamp ascending to display chronologically
              .sort((a, b) => new Date(a.timestamp).getTime() - new Date(a.timestamp).getTime());

          // For MVP, we don't store the AI decision or relevantKnowledge in the KB record itself.
          // We'll just load the Q&A history.
          setMessages(conversationHistory as ChatMessage[]); // Cast to ChatMessage[]
      } catch (err: any) {
          console.error('Error fetching conversation history:', err);
          setError(`Failed to load conversation history: ${err.message}`);
      } finally {
          setLoading(false);
      }\
  };\

  useEffect(() => {
    // Fetch history when the component mounts or when the user changes
    if (systemContext?.currentUser?.id) {
        fetchConversationHistory(); // Fetch history on initial load
    }

    // --- New: Subscribe to realtime updates for knowledge_records with source 'dev-conversation' ---\
    let unsubscribeKnowledgeUpdates: (() => void) | undefined;
    if (knowledgeSync?.context?.eventBus) { // Check if KnowledgeSync and its EventBus are available
        const eventBus = knowledgeSync.context.eventBus;
        const userId = systemContext?.currentUser?.id;

        unsubscribeKnowledgeUpdates = eventBus.subscribe('knowledge_record_insert', (payload: KnowledgeRecord) => {
            if (payload.user_id === userId && payload.source === 'dev-conversation') {
                console.log('Chat page received knowledge_record_insert event:', payload);
                // Add the new message and keep sorted
                setMessages(prevMessages => {
                    const updatedMessages = [...prevMessages, payload as ChatMessage].sort((a, b) => new Date(a.timestamp).getTime() - new Date(a.timestamp).getTime());

                    // --- New: Check if there's a pending result for this record's correlationId ---\
                    const correlationId = payload.dev_log_details?.correlationId;
                    if (correlationId && pendingResults[correlationId]) {
                        console.log(`Chat page attaching pending result for correlationId ${correlationId} to record ${payload.id}`);
                        // Find the newly added message in the sorted array and attach the decision and relevantKnowledge
                        const messageIndex = updatedMessages.findIndex(msg => msg.id === payload.id);
                        if (messageIndex !== -1) {
                            updatedMessages[messageIndex].aiDecision = pendingResults[correlationId].decision;
                            updatedMessages[messageIndex].relevantKnowledge = pendingResults[correlationId].relevantKnowledge;
                            // Remove the result from pending state after attaching
                            setPendingResults(prev => {
                                const newState = { ...prev };
                                delete newState[correlationId];
                                return newState;
                            });
                        }
                    }
                    // --- End New ---\

                    return updatedMessages;
                });

            }
        });

        // TODO: Handle update and delete events if needed for chat history
        // eventBus.subscribe('knowledge_record_update', (payload: KnowledgeRecord) => { ... });
        // eventBus.subscribe('knowledge_record_delete', (payload: { id: string, userId: string }) => { ... });
    }\
    // --- End New ---\

    // --- New: Subscribe to agent_response messages from the MessageBus ---\
    let unsubscribeAgentResponse: (() => void) | undefined;
    if (systemContext?.messageBus) { // Check if MessageBus is available
        const messageBus = systemContext.messageBus;
        const userId = systemContext?.currentUser?.id;

        unsubscribeAgentResponse = messageBus.subscribe('agent_response', (message: AgentMessage) => {
            // Check if this response is for a request we sent from this UI instance
            // We can use the correlationId to match requests and responses
            // Also check if the sender is the expected agent (e.g., 'input' agent for initial processing)
            if (message.correlationId && pendingRequests[message.correlationId]) {
                console.log('Chat page received agent_response event:', message);

                // Process the response payload
                if (message.payload?.success) {
                    const resultData = message.payload.data; // Expected format { response: string, decision: ActionIntent, relevantKnowledge?: KnowledgeRecord[] }
                    console.log('Agent response data:', resultData);

                    // --- New: Store the decision and relevantKnowledge temporarily by correlationId ---\
                    // The actual AI message (KnowledgeRecord) will arrive via Realtime.\
                    // We store the decision and relevantKnowledge here and attach it when the record arrives.\
                    if (resultData?.decision || resultData?.relevantKnowledge) {
                         setPendingResults(prev => ({ ...prev, [message.correlationId!]: { decision: resultData.decision, relevantKnowledge: resultData.relevantKnowledge } }));
                         console.log(`Chat page stored pending result for correlationId ${message.correlationId}`);
                    }
                    // --- End New ---\

                } else {
                    // Handle error response
                    const errorMessage = message.payload?.error || 'An unknown error occurred.';
                    console.error('Agent response error:', errorMessage);
                    setError(`Agent Error: ${errorMessage}`);
                    // Add an error message to the UI (as a system message)
                     setMessages(prevMessages => [...prevMessages, { id: 'temp-agent-error-' + Date.now(), user_id: userId, question: '', answer: `Agent Error: ${errorMessage}`, timestamp: new Date().toISOString(), source: 'system-error', type: 'error', is_read: true }]);
                }

                // Remove the request from pending state
                setPendingRequests(prev => {
                    const newState = { ...prev };
                    delete newState[message.correlationId!];
                    return newState;
                });

                // --- New: Remove the temporary user message after the agent responds --
                // The actual user message will be added by the realtime listener for the KB record.
                setMessages(prevMessages => prevMessages.filter(msg => !(msg.isTemporary && msg.correlationId === message.correlationId)));
                // --- New: Reset processing function label ---\
                setProcessingFunctionLabel(null);
                // --- End New ---\

                // Reset sending state if this was the only pending request
                if (Object.keys(pendingRequests).length <= 1) { // Check if it was the last one
                     setIsSending(false);
                }
            }\
        });
    }\
    // --- End New ---\

    // --- New: Subscribe to suggestion_update messages from the MessageBus ---\
    let unsubscribeSuggestionUpdate: (() => void) | undefined;
    if (systemContext?.messageBus) { // Check if MessageBus is available
        const messageBus = systemContext.messageBus;
        const userId = systemContext?.currentUser?.id;

        unsubscribeSuggestionUpdate = messageBus.subscribe('suggestion_update', (message: AgentMessage) => {
            // Check if this update is for the current user
            if (message.payload?.userId === userId) {
                console.log('Chat page received suggestion_update event:', message);
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
    }\
    // --- End New ---\


    return () => {
        // Unsubscribe on component unmount
        unsubscribeKnowledgeUpdates?.();
        unsubscribeAgentResponse?.(); // Unsubscribe from agent responses
        unsubscribeSuggestionUpdate?.(); // Unsubscribe from suggestion updates
    };\

  }, [systemContext?.currentUser?.id, knowledgeSync, junaiAssistant, pendingRequests, pendingResults]); // Add pendingRequests, pendingResults to dependencies

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
          console.log(`Input changed, sending for suggestions: \"${input}\"`);
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

      }, 500); // Wait 500ms after the last input change

      // Cleanup function to clear the timeout if input changes again or component unmounts
      return () => {
          clearTimeout(handler);
          // Optionally reset loading states on cleanup if needed
          // setIsLoadingSuggestions(false);
          // setIsLoadingKnowledge(false);
      };

  }, [input, systemContext?.currentUser?.id, systemContext?.messageBus]); // Re-run effect when input, user ID, or MessageBus changes
  // --- End New ---\


  // Auto-scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]); // Scroll when messages state changes


  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const userId = systemContext?.currentUser?.id;
    if (!systemContext?.messageBus || !userId || (!input.trim() && !selectedImage && !selectedAudio && !selectedFile)) {
        return; // Do nothing if input is empty and no multimodal content selected
    }

    const userMessage = input.trim();
    // --- New: Prepare multimodal payload ---\
    const multimodalPayload: any = {};
    if (selectedImage) multimodalPayload.imageUrl = URL.createObjectURL(selectedImage); // Use Object URL for preview
    if (selectedAudio) multimodalPayload.audioUrl = URL.createObjectURL(selectedAudio); // Use Object URL for preview
    if (selectedFile) multimodalPayload.fileUrl = URL.createObjectURL(selectedFile); // Use Object URL for preview
    if (selectedFile) multimodalPayload.fileMetadata = { name: selectedFile.name, type: selectedFile.type, size: selectedFile.size };
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

    // Generate a correlation ID for this request
    const correlationId = `req-${Date.now()}-${Math.random().toString(16).slice(2)}`;

    // Optimistically add user message to the UI
    const tempUserMessage: ChatMessage = {
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
    setMessages(prevMessages => [...prevMessages, tempUserMessage]);

    // Add the request to pending state
    setPendingRequests(prev => ({ ...prev, [correlationId]: true }));

    try {
        // Simulate recording user action (Part of \u6b0a\u80fd\u935b\u9020 / \u516d\u5f0f\u5967\u7fa9: \u89c0\u6e2c)
        authorityForgingEngine?.recordAction({
            type: 'web:chat:message',
            details: { messageContent: userMessage, ...multimodalPayload }, // Include multimodal details
            context: { platform: 'web', page: 'chat', conversation_id: 'default-web-chat', correlationId: correlationId }, // Include correlationId in action context
            user_id: userId, // Associate action with user
        });

        // --- Modified: Send message to InputAgent via MessageBus ---\
        // The InputAgent is modified to handle a message type that takes an ActionIntent directly.\
        // The InputAgent will then call JunAiAssistant.processInput (for MVP)\
        systemContext.messageBus.send({
            type: 'process_user_input', // Message type for InputAgent
            payload: { text: userMessage, ...multimodalPayload, context: { conversation_id: 'default-web-chat', correlationId: correlationId } }, // Pass all input types and context
            recipient: 'input', // Target the InputAgent
            correlationId: correlationId, // Include correlation ID
            sender: 'chat_ui', // Identify the sender
        });
        // --- End Modified ---\

        // The rest of the process (receiving response, updating history) is handled by the MessageBus subscription.\

    } catch (err: any) {
        console.error('Error sending message to MessageBus:', err);
        setError(`Error sending message: ${err.message}`);
        // Add an error message to the history or display it separately
         setMessages(prevMessages => [...prevMessages, { id: 'temp-send-error-' + Date.now(), user_id: userId, question: '', answer: `Error sending message: ${err.message}`, timestamp: new Date().toISOString(), source: 'system-error', type: 'error', is_read: true }]);
         // Remove the request from pending state on error
         setPendingRequests(prev => { const newState = { ...prev }; delete newState[correlationId]; return newState; });
         // Remove the temporary user message on error
         setMessages(prevMessages => prevMessages.filter(msg => msg.id !== tempUserMessage.id));
         setIsSending(false); // Reset sending state on error
    } finally {
        // setIsSending and pendingRequests are reset by the agent_response listener
        // The temporary user message is removed by the agent_response listener
    }
  };

    // --- Modified: Handle Suggested Action Click (Send message via MessageBus) ---\
    const handleSuggestedActionClick = async (decision: ActionIntent) => {
        console.log(`Suggested action clicked: ${decision.action}`);
        const userId = systemContext?.currentUser?.id;
        if (!userId || !systemContext?.messageBus) { // Check MessageBus availability
            alert("User not logged in or Message Bus not available.");
            return;
        }\

        // Simulate recording user action
        authorityForgingEngine?.recordAction({
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

        // Generate a correlation ID for this action execution request
        const correlationId = `action-${Date.now()}-${Math.random().toString(16).slice(2)}`;
        setPendingRequests(prev => ({ ...prev, [correlationId]: true }));

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

        } catch (err: any) {
            console.error("Error sending suggested action message to MessageBus:", err);
            // setAiResponse(`\u57f7\u884c\u5efa\u8b70\u5931\u6557: ${err.message}`); // This was for a modal, not used anymore
            setError(`\u57f7\u884c\u5efa\u8b70\u5931\u6557: ${err.message}`); // Show error in main UI
            setIsSending(false); // Reset sending state on error
            setPendingRequests(prev => { const newState = { ...prev }; delete newState[correlationId]; return newState; }); // Clear pending state on error
        } finally {
            // setIsSending and pendingRequests are reset by the agent_response listener
        }
    };\
    // --- End Modified ---\

    // --- New: Handle Feedback Click ---\
    const handleFeedbackClick = async (recordId: string, feedbackType: 'correct' | 'incorrect') => {
        console.log(`Feedback clicked for record ${recordId}: ${feedbackType}`);
        const userId = systemContext?.currentUser?.id;
        if (!userId || !systemContext?.messageBus || !evolutionEngine) { // Check MessageBus and EvolutionEngine availability
            alert("User not logged in or core modules not available.");
            return;
        }\

        // Prevent giving feedback multiple times for the same record/type (optional)
        if (feedbackStatus[recordId] === feedbackType) {
             console.log(`Feedback ${feedbackType} already given for record ${recordId}.`);
             return;
        }\

        // Simulate recording user action
        authorityForgingEngine?.recordAction({
            type: `web:chat:feedback:${feedbackType}`,
            details: { recordId, feedbackType },
            context: { platform: 'web', page: 'chat' },
            user_id: userId, // Associate action with user
        });

        // Update UI state immediately to show feedback status
        setFeedbackStatus(prevStatus => ({ ...prevStatus, [recordId]: feedbackType }));

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

            console.log(`Feedback message sent to EvolutionAgent for record ${recordId}.`);

        } catch (err: any) {
            console.error(`Error sending feedback message for record ${recordId}:`, err);
            // Revert UI state on error (optional)
            setFeedbackStatus(prevStatus => ({ ...prevStatus, [recordId]: null }));
            alert(`Failed to record feedback: ${err.message}`);
        }\
    };\
    // --- End New ---\

    // --- New: Handle Multimodal Input Selection ---\
    const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setSelectedImage(event.target.files[0]);
            // Clear other file types
            setSelectedAudio(null);
            setSelectedFile(null);
        }\
    };\

    const handleAudioSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setSelectedAudio(event.target.files[0]);
            // Clear other file types
            setSelectedImage(null);
            setSelectedFile(null);
        }\
    };\

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setSelectedFile(event.target.files[0]);
            // Clear other file types
            setSelectedImage(null);
            setSelectedAudio(null);
        }\
    };\

    const handleClearMultimodal = () => {
        setSelectedImage(null);
        setSelectedAudio(null);
        setSelectedFile(null);
    };\
    // --- End New ---\


    // --- New: Handle Function Button Click (Refactored) ---\
    const handleFunctionClick = async (label: string, actionType?: string) => {
        const userId = systemContext?.currentUser?.id;
        if (!userId || !systemContext?.messageBus) {
            alert("User not logged in or Message Bus not available.");
            return;
        }\

        // Simulate recording user action
        authorityForgingEngine?.recordAction({
            type: `web:chat:function_button:${label}`,
            details: { label, actionType },
            context: { platform: 'web', page: 'chat' },
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
                const actionIntent: ActionIntent = {
                    action: actionType,
                    parameters: {}, // Default empty parameters, specific actions might need more
                };\

                // Add specific default parameters based on actionType if needed
                if (actionType === 'search_knowledge') {
                    actionIntent.parameters = { query: input.trim() || 'latest knowledge', useSemanticSearch: false }; // Search input or latest
                } else if (actionType === 'simulate_visual_reading') {
                     // For visual reading, the input might be an image URL from selectedImage
                     if (selectedImage) {
                          actionIntent.parameters = { imageUrl: URL.createObjectURL(selectedImage) }; // Pass the image URL
                     } else {
                          alert("Please select an image first for Text Extraction.");
                          setProcessingFunctionLabel(null); // Reset loading state
                          setPendingRequests(prev => { const newState = { ...prev }; delete newState[correlationId]; return newState; }); // Clear pending state
                          return; // Exit if no image selected
                     }\
                } else if (actionType === 'read_url') {
                     // For reading URL, the input is the URL
                     if (input.trim()) {
                          actionIntent.parameters = { url: input.trim() }; // Pass the URL from input
                     } else {
                          alert("Please enter a URL in the input field first.");
                          setProcessingFunctionLabel(null); // Reset loading state
                          setPendingRequests(prev => { const newState = { ...prev }; delete newState[correlationId]; return newState; }); // Clear pending state
                          return; // Exit if no URL entered
                     }\
                } else if (actionType === 'analyze_file_content') {
                     // For analyzing file content, the input is the selected file
                     if (selectedFile) {
                          // In a real app, you'd upload the file and get a URL/ID.\
                          // For MVP, we'll pass the file content directly or simulate upload.\
                          // Let's simulate passing the file content (as a string) and metadata.\
                          // This requires reading the file content first.\
                          const reader = new FileReader();
                          reader.onload = async (e) => {
                              const fileContent = e.target?.result as string; // Assuming text file content
                              actionIntent.parameters = {
                                  content: fileContent,
                                  fileMetadata: { name: selectedFile.name, type: selectedFile.type, size: selectedFile.size },
                              };\
                              // Now send the message after reading the file
                              systemContext.messageBus.send({
                                  type: 'execute_action_intent', // Message type to execute a pre-defined action intent
                                  payload: { decision: actionIntent, context: { conversation_id: 'default-web-chat', correlationId: correlationId, originalInput: `Analyze file: ${selectedFile.name}` } }, // Pass the ActionIntent and context
                                  recipient: 'input', // Target the InputAgent
                                  correlationId: correlationId, // Include correlation ID
                                  sender: 'chat_ui', // Identify the sender
                              });
                              // Clear input and selected multimodal content after sending
                              setInput('');
                              setSelectedImage(null);
                              setSelectedAudio(null);
                              setSelectedFile(null);
                              // ProcessingFunctionLabel and pendingRequests are reset by the agent_response listener
                          };\
                          reader.onerror = (e) => {
                              console.error('Error reading file:', e);
                              setError(`Failed to read file: ${selectedFile.name}`);
                              setProcessingFunctionLabel(null); // Reset loading state on error
                              setPendingRequests(prev => { const newState = { ...prev }; delete newState[correlationId]; return newState; }); // Clear pending state on error
                              alert(`Failed to read file: ${selectedFile.name}`);
                          };\
                          reader.readAsText(selectedFile); // Read file as text (adjust for binary files)
                          // Exit the function here, the message will be sent in onload
                          return;
                     } else {
                          alert("Please select a file first for Analysis.");
                          setProcessingFunctionLabel(null); // Reset loading state
                          setPendingRequests(prev => { const newState = { ...prev }; delete newState[correlationId]; return newState; }); // Clear pending state
                          return; // Exit if no file selected
                     }\
                }\
                // TODO: Add default parameters for other actionTypes if needed\

                // Send the message for actions that don't require file reading
                if (actionType !== 'analyze_file_content') {
                    systemContext.messageBus.send({
                        type: 'execute_action_intent', // Message type to execute a pre-defined action intent
                        payload: { decision: actionIntent, context: { conversation_id: 'default-web-chat', correlationId: correlationId, originalInput: input.trim() } }, // Pass the ActionIntent and context
                        recipient: 'input', // Target the InputAgent
                        correlationId: correlationId, // Include correlation ID
                        sender: 'chat_ui', // Identify the sender
                    });

                    // Clear input and selected multimodal content after sending
                    setInput('');
                    setSelectedImage(null);
                    setSelectedAudio(null);
                    setSelectedFile(null);

                    // The response will be handled by the agent_response listener
                }\


            } catch (err: any) {
                console.error(`Error sending function button message (${label}):`, err);
                setError(`Error executing function \"${label}\": ${err.message}`);
                setProcessingFunctionLabel(null); // Reset loading state on error
                setPendingRequests(prev => { const newState = { ...prev }; delete newState[correlationId]; return newState; }); // Clear pending state on error
            } finally {
                // ProcessingFunctionLabel and pendingRequests are reset by the agent_response listener
                // For analyze_file_content, these are reset in the FileReader onload/onerror handlers
            }
        }\ else {
            // If no actionType, just set the input field (for phrases or simple text insertion)
            setInput(prevInput => prevInput + label);
        }
    };\
    // --- End New ---\

    // --- New: Handle Phrase Click ---\
    const handlePhraseClick = (phrase: string) => {
        // Simulate recording user action
        const userId = systemContext?.currentUser?.id;
        if (userId) {
             authorityForgingEngine?.recordAction({
                type: 'web:chat:phrase_click',
                details: { phrase },
                context: { platform: 'web', page: 'chat' },
                user_id: userId, // Associate action with user
            });
        }\
        setInput(prevInput => prevInput + phrase);
    };\
    // --- End New ---\

    // --- New: Handle Knowledge Click (Insert into input) ---\
    const handleKnowledgeClick = (record: KnowledgeRecord) => {
        // Simulate recording user action
        const userId = systemContext?.currentUser?.id;
        if (userId) {
             authorityForgingEngine?.recordAction({
                type: 'web:chat:kb_insert',
                details: { recordId: record.id, question: record.question },
                context: { platform: 'web', page: 'chat' },
                user_id: userId, // Associate action with user
            });
        }\
        // Insert the answer into the input field
        setInput(prevInput => prevInput + record.answer);
    };\
    // --- End New ---\

    // --- New: Handle Suggestion Click (Insert into input or trigger action) ---\
    const handleSuggestionClick = (suggestion: ActionIntent) => {
        // Simulate recording user action
        const userId = systemContext?.currentUser?.id;
        if (userId) {
             authorityForgingEngine?.recordAction({
                type: 'web:chat:suggestion_click',
                details: { suggestionAction: suggestion.action, suggestionParams: suggestion.parameters },
                context: { platform: 'web', page: 'chat' },
                user_id: userId, // Associate action with user
            });
        }\

        // If the suggestion is a simple answer, insert it into the input
        if (suggestion.action === 'answer_via_ai' && suggestion.parameters?.question) {
            setInput(prevInput => prevInput + suggestion.parameters.question);
        } else {
            // If the suggestion is a specific action, trigger it via the agent system
            // This is similar to clicking a suggested action button below the AI response
            handleSuggestedActionClick(suggestion);
        }\
    };\
    // --- End New ---\

    // --- New: Handle Mobile Git Sync Click (Trigger action) ---\
    const handleMobileGitSyncClick = async (action: 'pull' | 'push' | 'bidirectional') => {
        const userId = systemContext?.currentUser?.id;
        if (!userId || !systemContext?.messageBus) {
            alert("User not logged in or Message Bus not available.");
            return;
        }\

        console.log(`Mobile Git Sync button clicked: ${action}`);
         // Simulate recording user action
        authorityForgingEngine?.recordAction({
            type: `web:chat:mobile_git_sync_button:${action}`,
            details: { action },
            context: { platform: 'web', page: 'chat' },
            user_id: userId, // Associate action with user
        });

        setProcessingFunctionLabel(`Git ${action}`); // Show loading state
        setError(null); // Clear previous errors

        // Generate a correlation ID for this request
        const correlationId = `git-${action}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
        setPendingRequests(prev => ({ ...prev, [correlationId]: true }));

        try {
            // Create the ActionIntent for the sync action
            const actionIntent: ActionIntent = {
                action: 'sync_mobile_git', // The action type for mobile git sync
                parameters: { direction: action }, // Pass the direction as a parameter
            };\

            systemContext.messageBus.send({
                type: 'execute_action_intent', // Message type to execute a pre-defined action intent
                payload: { decision: actionIntent, context: { conversation_id: 'default-web-chat', correlationId: correlationId, originalInput: `Simulate Git ${action}` } }, // Pass the ActionIntent and context
                recipient: 'input', // Target the InputAgent
                correlationId: correlationId, // Include correlation ID
                sender: 'chat_ui', // Identify the sender
            });

            // The response will be handled by the agent_response listener\

        } catch (err: any) {
            console.error(`Error sending Git sync message (${action}):`, err);
            setError(`Error simulating Git ${action}: ${err.message}`);
            setProcessingFunctionLabel(null); // Reset loading state on error
            setPendingRequests(prev => { const newState = { ...prev }; delete newState[correlationId]; return newState; }); // Clear pending state on error
        } finally {
            // ProcessingFunctionLabel and pendingRequests are reset by the agent_response listener
        }
    };\
    // --- End New ---\


   // Ensure user is logged in before rendering content
  if (!systemContext?.currentUser) {
       // This case should ideally be handled by ProtectedRoute, but as a fallback:\
       return (
            <div className="container mx-auto p-4 flex justify-center">
               <div className="bg-neutral-800/50 p-8 rounded-lg shadow-xl w-full max-w-md text-center text-neutral-300">
                   <p>Please log in to use the chat.</p>
               </div>
            </div>
       );
  }\


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
          {loading ? (
              <p className="text-neutral-400 text-center">Loading conversation history...</p>
          ) : error ? (
              <p className="text-red-400 text-center">Error loading history: {error}</p>
          ) : messages.length === 0 ? (
              <p className="text-neutral-400 text-center">Start a conversation!</p>
          ) : (
              messages.map((msg, index) => (
                  <div key={msg.id || index} className={`flex ${msg.source === 'ui-temp-user' || msg.source === 'dev-conversation' && msg.answer === '' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`p-3 rounded-lg max-w-[80%] ${msg.source === 'ui-temp-user' || msg.source === 'dev-conversation' && msg.answer === '' ? 'bg-blue-600 text-white' : msg.source === 'system-error' ? 'bg-red-800/50 text-red-200' : 'bg-neutral-700 text-neutral-100'}`}>
                          {/* Display user input or AI response */}
                          {msg.source === 'ui-temp-user' || msg.source === 'dev-conversation' && msg.answer === '' ? (\
                              <p>{msg.question}</p>
                          ) : (\
                              <div className="prose prose-invert max-w-none"> {/* Use prose for markdown styling */}
                                  <ReactMarkdown>{msg.answer}</ReactMarkdown>
                              </div>
                          )}
                          {/* New: Display Multimodal Content */}
                          {msg.image_url && <img src={msg.image_url} alt="Attached image" className="mt-2 max-h-48 rounded-md" />}
                          {msg.audio_url && <audio controls src={msg.audio_url} className="mt-2 w-full"></audio>}
                          {msg.file_url && msg.file_metadata && (
                              <div className="mt-2 p-2 bg-neutral-600 rounded-md text-neutral-200 text-sm flex items-center gap-2">
                                  <Paperclip size={16} />
                                  <span>Attached File: {msg.file_metadata.name} ({Math.round(msg.file_metadata.size / 1024)} KB)</span>
                                  {/* TODO: Add download link or preview */}
                              </div>
                          )}
                          {/* End New */}
                          {/* Display AI Decision and Suggested Actions */}
                          {msg.aiDecision && msg.source !== 'ui-temp-user' && ( // Only show decision for AI messages
                              <div className="mt-2 pt-2 border-t border-neutral-600 text-xs">
                                  <p className="font-semibold text-blue-300">AI Decision: {msg.aiDecision.action.replace(/_/g, ' ').toUpperCase()}</p>
                                  {/* Display Suggested Action Button if applicable */}
                                  {msg.aiDecision.action !== 'answer_via_ai' && msg.aiDecision.action !== 'present_suggestion' && ( // Don't show button for simple answer or present_suggestion (handled by UI)
                                       <button
                                           className="mt-2 px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                           onClick={() => handleSuggestedActionClick(msg.aiDecision!)} // Use non-null assertion as we checked msg.aiDecision
                                           disabled={isSending} // Disable while sending/processing
                                       >
                                           <Play size={14} className="inline-block mr-1"/> Execute Action
                                       </button>
                                  )}
                                   {/* Display Suggestion Button for present_suggestion */}
                                   {msg.aiDecision.action === 'present_suggestion' && (\
                                        <button
                                            className="mt-2 px-3 py-1 text-xs bg-purple-500 text-white rounded hover:bg-purple-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                            onClick={() => handleSuggestedActionClick(msg.aiDecision!)} // Use non-null assertion
                                            disabled={isSending} // Disable while sending/processing
                                        >
                                            <Lightbulb size={14} className="inline-block mr-1"/> View Suggestion
                                        </button>
                                   )}\
                              </div>
                          )}
                           {/* New: Feedback Buttons for AI Responses */}
                           {msg.source !== 'ui-temp-user' && msg.source !== 'system-error' && ( // Only show feedback for AI responses (not user messages or system errors)
                               <div className="mt-2 pt-2 border-t border-neutral-600 text-xs flex items-center gap-2">
                                   <span className="text-neutral-400">Feedback:</span>
                                   <button
                                       className={`flex items-center gap-1 px-2 py-0.5 rounded ${feedbackStatus[msg.id] === 'correct' ? 'bg-green-600' : 'bg-neutral-600'} text-white hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed`}
                                       onClick={() => handleFeedbackClick(msg.id, 'correct')}
                                       disabled={isSending || feedbackStatus[msg.id] !== null} // Disable while sending or if feedback already given
                                   >
                                       <ThumbsUp size={14} /> Correct
                                   </button>
                                   <button
                                       className={`flex items-center gap-1 px-2 py-0.5 rounded ${feedbackStatus[msg.id] === 'incorrect' ? 'bg-red-600' : 'bg-neutral-600'} text-white hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed`}
                                       onClick={() => handleFeedbackClick(msg.id, 'incorrect')}
                                       disabled={isSending || feedbackStatus[msg.id] !== null} // Disable while sending or if feedback already given
                                   >
                                       <ThumbsDown size={14} /> Incorrect
                                   </button>
                               </div>
                           )}
                           {/* End New */}
                           {/* New: Display Relevant Knowledge for RAG */}
                           {msg.relevantKnowledge && msg.relevantKnowledge.length > 0 && (
                               <div className="mt-2 pt-2 border-t border-neutral-600 text-xs">
                                   <p className="font-semibold text-blue-300">Relevant Knowledge Used:</p>
                                   <ul className="list-disc list-inside text-neutral-400">
                                       {msg.relevantKnowledge.map(kb => (
                                           <li key={kb.id} className="text-xs">
                                               Q: {kb.question.substring(0, 50)}... (ID: {kb.id.substring(0, 8)}...)
                                           </li>
                                       ))}
                                   </ul>
                               </div>
                           )}
                           {/* End New */}
                      </div>
                  </div>
              ))
          )}
          <div ref={messagesEndRef} /> {/* Empty div for auto-scrolling */}
      </div>


      {/* \u529f\u80fd\u6a6b\u5411\u6efe\u52d5\u5de5\u5177\u689d */}
      <nav className="w-full max-w-lg flex flex-row items-center gap-2 py-3 px-1 overflow-x-auto scrollbar-thin scrollbar-thumb-neutral-200 dark:scrollbar-thumb-neutral-700 mb-1">
        {FUNCTION_TABS.map(({ icon: Icon, label, actionType }) => ( // Added actionType
          <button
            key={label}
            className="flex flex-col items-center justify-center px-3 py-2 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-800 shadow active:scale-95 hover:bg-blue-50 hover:dark:bg-blue-900 transition flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => handleFunctionClick(label, actionType)} // Pass actionType
            disabled={isSending || !!processingFunctionLabel} // Disable all function buttons while sending or any function is processing
          >
            <Icon size={24} className="mb-0.5 text-blue-500" />
            <span className="text-xs text-neutral-600 dark:text-neutral-300 font-semibold">{processingFunctionLabel === label ? '...' : label}</span>
          </button>
        ))}
      </nav>

      {/* \u8f38\u5165\u5340 */}
      <div className="w-full max-w-lg px-4 py-3 rounded-xl bg-white/90 shadow border border-neutral-100 dark:bg-neutral-900/90 dark:border-neutral-800 flex items-center justify-between select-none mb-2">
        <div className="text-lg tracking-widest font-mono text-neutral-900 dark:text-neutral-100 whitespace-nowrap overflow-x-auto max-w-[75vw] scrollbar-thin">
          {input || <span className="text-neutral-300 dark:text-neutral-600">\u8acb\u8f38\u5165\u2026</span>}
        </div>
        <button
          className="ml-2 px-2 py-1 text-xs rounded hover:bg-neutral-200 dark:hover:bg-neutral-800 transition text-neutral-600 dark:text-neutral-300"
          onClick={() => setInput("")}
          disabled={isSending} // Disable clear while sending
        >
          \u6e05\u9664
        </button>
      </div>

      {/* \u4e0a\u4e0b\u6efe\u52d5\u77ed\u8a9e\u5340 */}
      <section className="w-full max-w-lg flex flex-col h-32 overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-300 dark:scrollbar-thumb-neutral-700 mb-2 gap-2">
        {PHRASES.map(section => (\
          <div key={section.group} className="">
            <div className="text-xs text-neutral-500 dark:text-neutral-400 font-bold mb-1 pl-1">{section.group}</div>
            <div className="flex flex-row flex-wrap gap-2">
              {section.items.map((phrase, i) => (\
                <button
                  key={phrase+i}
                  className="px-3 py-2 rounded-2xl bg-[#f7fafe] dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 shadow-sm hover:bg-blue-100 hover:dark:bg-neutral-600 text-[15px] font-medium text-neutral-700 dark:text-neutral-50 flex-shrink-0 active:scale-95 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={()=>handlePhraseClick(phrase)}
                  disabled={isSending} // Disable while sending
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
                  {isLoadingSuggestions ? (\
                      <span className="text-neutral-400 text-sm">\u8f09\u5165\u5efa\u8b70\u4e2d...</span>
                  ) : smartSuggestions.length > 0 ? (\
                      smartSuggestions.map((suggestion, i) => (\
                          <button
                              key={'ai-sug-'+i}
                              className="px-3 py-2 rounded-2xl bg-blue-500/80 hover:bg-blue-600/80 text-white text-[15px] font-medium shadow-sm flex-shrink-0 active:scale-95 transition disabled:opacity-50 disabled:cursor-not-allowed"
                              onClick={() => handleSuggestionClick(suggestion)}
                              disabled={isSending} // Disable while sending
                          >
                              {/* TODO: Format suggestion label based on action type */}
                              {suggestion.action === 'answer_via_ai' ? suggestion.parameters?.question?.substring(0, 30) + '...' : suggestion.action.replace(/_/g, ' ')}\
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
                   <button
                       className={`text-xs font-semibold px-2 py-0.5 rounded-full transition ${useSemanticSearch ? 'bg-blue-500 text-white' : 'bg-neutral-200 text-neutral-700 dark:bg-neutral-700 dark:text-neutral-300'} disabled:opacity-50 disabled:cursor-not-allowed`}
                       onClick={() => setUseSemanticSearch(!useSemanticSearch)}
                       disabled={isLoadingKnowledge || isSending} // Disable toggle while searching or sending
                   >
                       {useSemanticSearch ? '\u8a9e\u7fa9\u641c\u7d22 ON' : '\u8a9e\u7fa9\u641c\u7d22 OFF'}\
                   </button>
              </div>
              <div className="flex flex-row flex-wrap gap-2 min-h-[30px]"> {/* min-h to prevent layout shift */}
                  {isLoadingKnowledge ? (\
                      <span className="text-neutral-400 text-sm">\u641c\u5c0b\u77e5\u8b58\u5eab\u4e2d...</span>
                  ) : knowledgeResults.length > 0 ? (\
                      knowledgeResults.map((record) => (\
                          <button
                              key={'kb-res-'+record.id}
                              className="px-3 py-2 rounded-2xl bg-green-400/80 hover:bg-green-500/80 text-white text-[15px] font-medium shadow-sm flex-shrink-0 active:scale-95 transition disabled:opacity-50 disabled:cursor-not-allowed"
                              onClick={() => handleKnowledgeClick(record)}
                              title={`Q: ${record.question}`} // Show question on hover
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
               {MOBILE_GIT_SYNC_BUTTONS.map(({ icon: Icon, label, action }) => (\
                   <button
                       key={action}
                       className="px-3 py-2 rounded-2xl bg-purple-500/80 hover:bg-purple-600/80 text-white text-[15px] font-medium shadow-sm flex-shrink-0 active:scale-95 transition disabled:opacity-50 disabled:cursor-not-allowed"
                       onClick={() => handleMobileGitSyncClick(action as 'pull' | 'push' | 'bidirectional')}\
                       disabled={isSending || !!processingFunctionLabel} // Disable while sending or any function is processing
                   >
                       <Icon size={18} className={`inline-block mr-1 ${processingFunctionLabel === `Git ${action}` ? 'animate-pulse' : ''}`} />
                       {processingFunctionLabel === `Git ${action}` ? '...' : label}\
                   </button>
               ))\
           }\
           </div>
       </div>
       {/* --- End New --- */}

      {/* Input Area and Send Button */}
      <form onSubmit={handleSend} className="w-full max-w-lg flex items-center gap-2 px-2">
        {/* Multimodal Input Buttons */}
        {/* TODO: Implement actual file/audio selection and handling */}
        <input type="file" accept="image/*" onChange={handleImageSelect} style={{ display: 'none' }} id="imageInput" />
        <label htmlFor="imageInput" className="p-2 rounded-md bg-neutral-700 text-neutral-300 hover:bg-neutral-600 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed" title="Attach Image">
            <Image size={20} />
        </label>
         <input type="file" accept="audio/*" onChange={handleAudioSelect} style={{ display: 'none' }} id="audioInput" />
         <label htmlFor="audioInput" className="p-2 rounded-md bg-neutral-700 text-neutral-300 hover:bg-neutral-600 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed" title="Attach Audio">
             <Mic size={20} />
         </label>
          <input type="file" onChange={handleFileSelect} style={{ display: 'none' }} id="fileInput" />
          <label htmlFor="fileInput" className="p-2 rounded-md bg-neutral-700 text-neutral-300 hover:bg-neutral-600 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed" title="Attach File">
              <Paperclip size={20} />
          </label>


        <input
          type="text"
          className="flex-grow p-3 rounded-xl bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 border border-neutral-300 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          value={input}
          onChange={(e) => setInput(e.target.value)}\
          placeholder="Chat with Jun.Ai.Key..."
          disabled={isSending} // Disable input while sending
        />
        <button
          type="submit"
          className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isSending || (!input.trim() && !selectedImage && !selectedAudio && !selectedFile)} // Disable if sending or input is empty and no multimodal content
        >
          {isSending ? <Loader2 size={24} className="animate-spin" /> : <Send size={24} />}\
        </button>
      </form>

       {/* New: Display selected multimodal content */}
       {(selectedImage || selectedAudio || selectedFile) && (\
           <div className="w-full max-w-lg mt-2 p-3 bg-neutral-700/50 rounded-lg text-neutral-300 text-sm flex items-center justify-between">
               <div>
                   {selectedImage && <p>Image selected: {selectedImage.name}</p>}\
                   {selectedAudio && <p>Audio selected: {selectedAudio.name}</p>}\
                   {selectedFile && <p>File selected: {selectedFile.name}</p>}\
               </div>
               <button onClick={handleClearMultimodal} className="text-red-400 hover:text-red-600">
                   <XCircle size={20} /> Clear
               </button>
           </div>
       )}\
       {/* End New */}

       {/* New: Display main error */}
       {error && (\
           <div className="w-full max-w-lg mt-4 p-3 bg-red-800/50 rounded-lg text-red-200 text-sm">
               Error: {error}
           </div>
       )}\
       {/* End New */}


    </div>
  );
};\

export default Chat; // Export the component
```