```typescript
// src/junai.ts
// Jun.Ai.Key Assistant (The OmniKey Interface)
// Acts as the primary interface for user interaction, processing natural language input,
// deciding on actions, and orchestrating the execution of core modules and Runes.
// Corresponds to the Wisdom Precipitation Secret Art concept and orchestrates the Six Styles.
// Design Principle: Understands user intent and translates it into system actions.

import { SystemContext, ActionIntent, KnowledgeRecord, TaskStep, AgenticFlow } from './interfaces'; // Import AgenticFlow
// Import core modules (accessed via context)
// import { WisdomSecretArt } from './core/wisdom/WisdomSecretArt';
// import { SelfNavigationEngine } from './core/self-navigation/SelfNavigationEngine';
// import { RuneEngraftingCenter } from './core/rune-engrafting/RuneEngraftingCenter';
// import { KnowledgeSync } from './modules/knowledgeSync';
// import { AuthorityForgingEngine } from './core/authority/AuthorityForgingEngine';
// import { LoggingService } from './core/logging/LoggingService';
// import { SyncService } from './modules/sync/SyncService'; // Import SyncService
// import { GoalManagementService } from './core/goal-management/GoalManagementService'; // Import GoalManagementService


export class JunAiAssistant {
    private context: SystemContext;
    // private wisdomSecretArt: WisdomSecretArt; // Access via context
    // private selfNavigationEngine: SelfNavigationEngine; // Access via context
    // private runeEngraftingCenter: RuneEngraftingCenter; // Access via context
    // private knowledgeSync: KnowledgeSync; // Access via context
    // private authorityForgingEngine: AuthorityForgingEngine; // Access via context
    // private loggingService: LoggingService; // Access via context
    // private syncService = context.syncService; // Access via context
    // private goalManagementService: GoalManagementService; // Access via context


    constructor(context: SystemContext) {
        this.context = context;
        // this.wisdomSecretArt = context.wisdomSecretArt;
        // this.selfNavigationEngine = context.selfNavigationEngine;
        // this.runeEngraftingCenter = context.runeEngraftingCenter;
        // this.knowledgeSync = context.knowledgeSync;
        // this.authorityForgingEngine = context.authorityForgingEngine;
        // this.loggingService = context.loggingService;
        // this.syncService = context.syncService;
        // this.goalManagementService = context.goalManagementService;
        console.log('JunAiAssistant initialized.');
    }

    /**
     * Processes user input, analyzes intent, decides on actions, and orchestrates execution.
     * This is the main entry point for user interaction.
     * Orchestrates the Six Styles: Observe (via Logging/Analytics), Decide (via Wisdom),
     * Act (via Self-Navigation/Runes/Authority), Generate (via Wisdom/Authority),
     * Trigger (via Self-Navigation/Authority), Event Push (via EventBus).
     * @param userInput The input from the user (natural language or command-like). Required.
     * @param context Optional context for the interaction (e.g., conversation ID, source, correlationId). Required.
     * @returns Promise<{ response: string, decision: ActionIntent }> The AI's response or action result, and the decided action intent.
     */
    async processInput(userInput: string, context: { conversation_id?: string, source?: string, platform?: string, correlationId?: string }): Promise<{ response: string, decision: ActionIntent }> {
        console.log(`[JunAiAssistant] Processing input: \"${userInput}\" with context:`, context);
        const userId = this.context.currentUser?.id;

        if (!userId) {
            console.error('[JunAiAssistant] Cannot process input: User not logged in.');
            this.context.loggingService?.logError('Input processing failed: User not logged in.', { input: userInput, context });
            throw new Error('User not logged in.');
        }

        this.context.loggingService?.logInfo('Processing user input', { input: userInput, userId, context });

        let aiResponseOrResult: string = '';
        let decidedAction: ActionIntent | null = null;
        let generatedStructure: any = null; // To hold structured output if needed
        let actionExecutionResult: any = null; // To hold the result of the executed action
        let actionExecutionError: any = null; // To hold the error if action execution fails


        try {
            // --- 1. Decide (Leverages Wisdom Secret Art) ---
            // Analyze user input to determine intent and parameters.
            decidedAction = await this.context.wisdomSecretArt?.analyzeIntentAndDecideAction(userInput, userId) || { action: 'answer_via_ai', parameters: { question: userInput }, confidence: 0 }; // Default if analysis fails

            console.log('[JunAiAssistant] Decided Action:', decidedAction);
            this.context.loggingService?.logInfo('Decided action for input', { input: userInput, userId, decision: decidedAction });

            // --- 2. Generate Structured Output if Required (Leverages Wisdom Secret Art) ---
            // If the decided action requires a structured definition (like task steps or flow nodes/edges),
            // call WisdomSecretArt to generate that structure.
            if (decidedAction.action === 'create_task' || decidedAction.action === 'create_agentic_flow') {
                 console.log(`[JunAiAssistant] Action '${decidedAction.action}' requires structured output. Generating...`);
                 try {
                     // Pass the decided action and original input/context to the generator
                     generatedStructure = await this.context.wisdomSecretArt?.generateStructuredOutput(decidedAction, { userInput, context }, userId);
                     console.log('[JunAiAssistant] Generated Structure:', generatedStructure);

                     if (!generatedStructure) {
                          throw new Error(`AI failed to generate structured output for action: ${decidedAction.action}`);
                     }

                     // Merge generated structure into the parameters for execution
                     if (decidedAction.action === 'create_task') {
                         // Expecting { description: "...", steps: [...] }
                         if (!generatedStructure.description || !Array.isArray(generatedStructure.steps) || generatedStructure.steps.length === 0) {
                              throw new Error('Invalid structure generated for task creation: missing description or steps.');
                         }
                         decidedAction.parameters = {
                             ...decidedAction.parameters, // Keep original parameters like linkedKrId if present
                             description: generatedStructure.description,
                             steps: generatedStructure.steps,
                         };
                     } else if (decidedAction.action === 'create_agentic_flow') {
                         // Expecting { name: "...", description: "...", entry_node_id: "...", nodes: [...], edges: [...] }
                          if (!generatedStructure.name || !generatedStructure.entry_node_id || !Array.isArray(generatedStructure.nodes) || generatedStructure.nodes.length === 0 || !Array.isArray(generatedStructure.edges)) {
                              throw new Error('Invalid structure generated for agentic flow creation: missing name, entry node, nodes, or edges.');
                          }
                          decidedAction.parameters = {
                              ...decidedAction.parameters, // Keep original parameters if present
                              name: generatedStructure.name,
                              description: generatedStructure.description,
                              entry_node_id: generatedStructure.entry_node_id,
                              nodes: generatedStructure.nodes,
                              edges: generatedStructure.edges,
                          };
                     }

                 } catch (generateError: any) {
                     console.error(`[JunAiAssistant] Error generating structured output for ${decidedAction.action}:`, generateError.message);
                     this.context.loggingService?.logError(`Error generating structured output for ${decidedAction.action}`, { userId, decision: decidedAction, error: generateError.message });
                     // If structured output generation fails, fallback to a simple AI answer
                     decidedAction = {
                         action: 'answer_via_ai',
                         parameters: { question: `I understood you wanted to ${decidedAction.action.replace('_', ' ')}, but I had trouble generating the necessary structure. Could you please provide more details? Original request: \"${userInput}\"` },
                         confidence: 0.6, // Moderate confidence in the fallback
                         original_intent: decidedAction.action, // Keep track of the original intent
                     };
                     aiResponseOrResult = `An error occurred while trying to generate the details for your request: ${generateError.message}`; // Provide immediate feedback
                     // Continue to the execution step, which will now handle 'answer_via_ai'
                 }
            }


            // --- 3. Act / Trigger (Orchestrates Core Modules and Runes) ---
            // Execute the decided action by calling the appropriate module/rune.
            try {
                switch (decidedAction.action) {
                    case 'create_task':
                        console.log('[JunAiAssistant] Executing action: create_task');
                        // Validate parameters (now including generated structure)
                        if (!decidedAction.parameters?.description || !Array.isArray(decidedAction.parameters?.steps) || decidedAction.parameters.steps.length === 0) {
                            throw new Error('Task description and steps are required.');
                        }
                        // Call SelfNavigationEngine to create the task
                        actionExecutionResult = await this.context.selfNavigationEngine?.createTask(
                            decidedAction.parameters.description,
                            decidedAction.parameters.steps, // Use generated steps
                            userId, // Pass userId
                            decidedAction.parameters.linkedKrId // Pass linked KR ID if provided
                        );
                        if (actionExecutionResult) {
                            aiResponseOrResult = `Task \"${actionExecutionResult.description}\" created successfully with ID ${actionExecutionResult.id}.`;
                        } else {
                            throw new Error('Failed to create task.');
                        }
                        break;

                    case 'execute_rune':
                        console.log('[JunAiAssistant] Executing action: execute_rune');
                        // Validate parameters
                        if (!decidedAction.parameters?.runeId || !decidedAction.parameters?.action) {
                            throw new Error('Rune ID and action name are required.');
                        }
                        // Call RuneEngraftingCenter to execute the rune action
                        actionExecutionResult = await this.context.sacredRuneEngraver?.executeRuneAction(
                            decidedAction.parameters.runeId,
                            decidedAction.parameters.action,
                            decidedAction.parameters.params, // Pass parameters to the rune action
                            userId // Pass userId
                        );
                        // Format the result for the user
                        // Check if the result has a specific message or data to display
                        if (actionExecutionResult?.message) {
                             aiResponseOrResult = `Rune action executed: ${actionExecutionResult.message}`;
                        } else if (actionExecutionResult?.data) {
                             aiResponseOrResult = `Rune action executed. Result: ${JSON.stringify(actionExecutionResult.data)}`;
                        } else {
                             aiResponseOrResult = `Rune action executed. Status: ${actionExecutionResult?.status || 'unknown'}`;
                        }
                        break;

                    case 'search_knowledge':
                        console.log('[JunAiAssistant] Executing action: search_knowledge');
                        // Validate parameters
                        if (!decidedAction.parameters?.query) {
                            throw new Error('Search query is required.');
                        }
                        // Call KnowledgeSync to search the knowledge base
                        actionExecutionResult = await this.context.knowledgeSync?.searchKnowledge(
                            decidedAction.parameters.query,
                            userId, // Pass userId
                            decidedAction.parameters.useSemanticSearch // Pass semantic search flag
                        );
                        // Format the results for the user
                        if (actionExecutionResult && actionExecutionResult.length > 0) {
                            aiResponseOrResult = `Found ${actionExecutionResult.length} knowledge records:\n\n`;
                            actionExecutionResult.forEach((record: KnowledgeRecord) => {
                                aiResponseOrResult += `**Q:** ${record.question}\n**A:** ${record.answer.substring(0, 200)}...\n---\n`; // Use Markdown for formatting
                            });
                        } else {
                            aiResponseOrResult = `No knowledge records found matching your query \"${decidedAction.parameters.query}\".`;
                        }
                        break;

                    case 'sync_mobile_git':
                        console.log('[JunAiAssistant] Executing action: sync_mobile_git');
                        // Validate parameters
                        const direction = decidedAction.parameters?.direction || 'bidirectional';
                        if (!['pull', 'push', 'bidirectional'].includes(direction)) {
                             throw new Error(`Invalid sync direction: ${direction}. Must be pull, push, or bidirectional.`);
                        }
                        // Call SyncService to simulate mobile Git sync
                        actionExecutionResult = await this.context.syncService?.syncMobileGitRepo(
                            userId, // Pass userId
                            direction,
                            decidedAction.parameters?.details // Pass optional details like repoUrl
                        );
                        aiResponseOrResult = `Simulated Mobile Git sync (${direction}) initiated. Result: ${JSON.stringify(actionExecutionResult)}`;
                        break;

                    case 'present_suggestion':
                        console.log('[JunAiAssistant] Executing action: present_suggestion');
                        // This action means the AI is suggesting something based on insights.
                        // The UI should handle presenting the suggestion (e.g., showing a modal, navigating).
                        // For the assistant's response, just return the suggestion message.
                        aiResponseOrResult = decidedAction.parameters?.message || 'Here is a suggestion.';
                        // The UI will use the full `decidedAction` object to render the suggestion button/UI.
                        break;

                    case 'create_agentic_flow':
                         console.log('[JunAiAssistant] Executing action: create_agentic_flow');
                         // Validate parameters (now including generated structure)
                         if (!decidedAction.parameters?.name || !decidedAction.parameters?.entry_node_id || !Array.isArray(decidedAction.parameters?.nodes) || decidedAction.parameters.nodes.length === 0 || !Array.isArray(decidedAction.parameters?.edges)) {
                             throw new Error('Flow name, entry node ID, nodes, and edges are required.');
                         }
                         // Call SelfNavigationEngine to create the Agentic Flow
                         actionExecutionResult = await this.context.selfNavigationEngine?.createAgenticFlow(
                             decidedAction.parameters, // Pass the full flow details (name, desc, entry_node_id, nodes, edges)
                             userId // Pass userId
                         );
                         if (actionExecutionResult) {
                             aiResponseOrResult = `Agentic Flow \"${actionExecutionResult.name}\" created successfully with ID ${actionExecutionResult.id}. You can view and run it on the Agentic Flows page.`;
                         } else {
                             throw new Error('Failed to create Agentic Flow.');
                         }
                         break;

                    case 'update_goal_progress':
                         console.log('[JunAiAssistant] Executing action: update_goal_progress');
                         // Validate parameters
                         if (!decidedAction.parameters?.krId || decidedAction.parameters?.currentValue === undefined) {
                             throw new Error('Key Result ID and current value are required to update goal progress.');
                         }
                         // Call GoalManagementService to update KR progress
                         actionExecutionResult = await this.context.goalManagementService?.updateKeyResultProgress(
                             decidedAction.parameters.krId,
                             decidedAction.parameters.currentValue,
                             userId // Pass userId
                         );
                         if (actionExecutionResult) {
                             aiResponseOrResult = `Key Result \"${actionExecutionResult.description}\" progress updated to ${actionExecutionResult.current_value} ${actionExecutionResult.unit}. Status: ${actionExecutionResult.status}.`;
                         } else {
                             throw new Error('Failed to update goal progress.');
                         }
                         break;

                    case 'answer_via_ai':
                    default: // Default action is to answer via AI if intent is unclear or general
                        console.log('[JunAiAssistant] Executing action: answer_via_ai (or default)');
                        // Use the original user input as the question for the AI answer
                        const questionForAI = decidedAction.parameters?.question || userInput;
                        // In a real scenario, this would call an LLM via WisdomSecretArt or a dedicated AI module
                        // For MVP, simulate a generic AI response
                        console.warn('[JunAiAssistant] Simulating AI answer.');
                        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate AI processing time
                        aiResponseOrResult = `I received your request: \"${questionForAI}\". This is a simulated AI response.`;
                        // If the original intent was something else but generation failed, mention that
                        if (decidedAction.original_intent && decidedAction.original_intent !== 'answer_via_ai') {
                             aiResponseOrResult = `I couldn't fully process your request to ${decidedAction.original_intent.replace('_', ' ')}. ${aiResponseOrResult}`;
                        }
                        break;
                }

                // --- 4. Record Action Execution (Leverages Six Styles: 觀測) ---
                // Record the successful execution of the decided action.
                // This should be done asynchronously to not block the response.
                this.context.authorityForgingEngine?.recordAction({
                    type: `system:action:executed:${decidedAction.action}`,
                    details: {
                        decision: decidedAction,
                        result: actionExecutionResult,
                    },
                    context: {
                        platform: context?.platform || 'system',
                        source: context?.source || 'junai_assistant',
                        userId: userId,
                        input: userInput,
                        correlationId: context?.correlationId, // Include correlationId
                    },
                    user_id: userId,
                }).catch(err => console.error('Failed to record action execution:', err));


            } catch (actionError: any) {
                console.error(`[JunAiAssistant] Error executing action ${decidedAction.action}:`, actionError.message);
                this.context.loggingService?.logError(`Error executing action ${decidedAction.action}`, { userId, decision: decidedAction, error: actionError.message });
                actionExecutionError = actionError; // Store the error

                // --- 4. Record Action Execution Failure (Leverages Six Styles: 觀測) ---
                // Record the failure of the decided action.
                // This should be done asynchronously.
                this.context.authorityForgingEngine?.recordAction({
                    type: `system:action:failed:${decidedAction.action}`,
                    details: {
                        decision: decidedAction,
                        error: actionError.message,
                    },
                    context: {
                        platform: context?.platform || 'system',
                        source: context?.source || 'junai_assistant',
                        userId: userId,
                        input: userInput,
                        correlationId: context?.correlationId, // Include correlationId
                    },
                    user_id: userId,
                }).catch(err => console.error('Failed to record action failure:', err));


                // If an error occurred during action execution, format an error response
                aiResponseOrResult = `An error occurred while trying to perform the action \"${decidedAction.action.replace('_', ' ')}\": ${actionError.message}`;
                // Fallback the decision to 'answer_via_ai' to indicate the action didn't complete as intended
                decidedAction = {
                    action: 'answer_via_ai',
                    parameters: { question: aiResponseOrResult }, // Use the error message as the "answer"
                    confidence: 0.1, // Low confidence due to failure
                    original_intent: decidedAction.action, // Keep track of the failed intent
                    original_parameters: decidedAction.parameters,
                };
            }

            // --- 5. Precipitate / Record Conversation Turn (Leverages Long-term Memory) ---
            // Save the user input and AI response/action result as a knowledge record.
            // This is part of the "Precipitate" step for development logs/chat history.
            // This should be done asynchronously.
            if (this.context.knowledgeSync) {
                 const conversationRecord: Omit<KnowledgeRecord, 'id' | 'timestamp'> = {
                     question: userInput,
                     answer: aiResponseOrResult, // Save the final response/result message
                     user_id: userId,
                     source: 'dev-conversation', // Mark as conversation history
                     tags: ['chat', decidedAction.action], // Tag with chat and the decided action type
                     dev_log_details: {
                         type: 'conversation-turn',
                         conversation_id: context?.conversation_id || 'default-web-chat', // Use context conversation ID or a default
                         correlationId: context?.correlationId, // Include correlationId
                         // turn_number: TODO: Implement turn numbering
                         datafied_summary: { // Include a datafied summary (can be generated by WisdomSecretArt)
                             overview: `Conversation turn: User input and AI response/action.`,
                             key_points: [`User input: \"${userInput.substring(0, 50)}...\"`, `AI response/action: \"${aiResponseOrResult.substring(0, 50)}...\"`],
                             action_taken: decidedAction.action,
                             result: actionExecutionError ? { status: 'failed', error: actionExecutionError.message } : { status: 'success', result: actionExecutionResult },
                             linked_artifacts: [], // TODO: Link to generated artifacts if any
                         },
                     },
                 };
                 // Use KnowledgeSync to save the record
                 this.context.knowledgeSync.saveKnowledge(
                     conversationRecord.question,
                     conversationRecord.answer,
                     userId,
                     conversationRecord.source,
                     conversationRecord.dev_log_details
                 ).catch(kbError => console.error('Failed to save conversation turn to KB:', kbError));
            } else {
                 console.warn('[JunAiAssistant] KnowledgeSync not available to save conversation turn.');
            }


            // --- 6. Return Response and Decision ---
            // Return the final response string and the decided action intent object.
            // The UI can use the response string to display text and the decision object
            // to potentially render suggested action buttons or other UI elements.
            return {
                response: aiResponseOrResult,
                decision: decidedAction, // Return the final decision object (might be fallback 'answer_via_ai')
            };

        } catch (overallError: any) {
            console.error('[JunAiAssistant] Overall error processing input:', overallError.message);
            this.context.loggingService?.logError('Overall input processing error', { userId, input: userInput, error: overallError.message });

            // Record the overall failure as a system event or user action
             this.context.authorityForgingEngine?.recordAction({
                 type: 'system:processing:failed',
                 details: { error: overallError.message, input: userInput },
                 context: { platform: context?.platform || 'system', source: context?.source || 'junai_assistant', userId: userId, correlationId: context?.correlationId }, // Include correlationId
                 user_id: userId,
             }).catch(err => console.error('Failed to record overall processing failure:', err));


            // Return a generic error response
            return {
                response: `An unexpected error occurred while processing your request: ${overallError.message}`,
                decision: { action: 'answer_via_ai', parameters: { question: `An unexpected error occurred: ${overallError.message}` }, confidence: 0 }, // Indicate failure
            };
        }
    }

    // TODO: Implement methods for handling specific events (e.g., task completion, insight generation)
    // TODO: Implement methods for orchestrating complex workflows or agentic loops (integrates with SelfNavigationEngine, EvolutionEngine)
    // TODO: This module is the primary interface and orchestrates the Six Styles (六式奧義).
}
```