```typescript
// src/agents/AgentFactory.ts
// \u4ee3\u7406\u5de5\u5ee0 (Agent Factory)
// Responsible for creating and managing agent instances.
// Ensures agents are singletons (or managed instances) and have access to the SystemContext.
// Part of the Agent System Architecture.
// Design Principle: Centralizes agent creation and lifecycle management.
// --- Modified: Add registration and retrieval of specific agent types --
// --- Modified: Ensure agents are initialized after creation --
// --- New: Add registration for new placeholder agents --
// --- New: Add SuggestionAgent to the factory --
// --- New: Add CalendarAgent to the factory ---
// --- New: Add RAGIndexer to the factory ---

import { SystemContext } from '../interfaces'; // Assuming SystemContext interface exists
import { BaseAgent } from './BaseAgent'; // Import BaseAgent type
// Import all specific agent classes
import { InputAgent } from '../InputAgent'; // Corrected import path
import { KnowledgeAgent } from './KnowledgeAgent';
import { AIAgent } from './AIAgent';
import { SupabaseAgent } from './SupabaseAgent';
import { SyncAgent } from './SyncAgent';
import { DecisionAgent } from './DecisionAgent'; // Import DecisionAgent
import { DeviceAgent } from './DeviceAgent'; // Import DeviceAgent
import { UtilityAgent } from './UtilityAgent'; // Import UtilityAgent
import { UIAgent } from './UIAgent'; // Import UIAgent
import { AuthorityForgingAgent } from './AuthorityForgingAgent'; // Import AuthorityForgingAgent
import { SelfNavigationAgent } from './SelfNavigationAgent'; // Import SelfNavigationAgent
import { RuneEngraftingAgent } from './RuneEngraftingAgent'; // Import RuneEngraftingAgent
import { NotificationAgent } from './NotificationAgent'; // Import NotificationAgent
import { EvolutionAgent } from './EvolutionAgent'; // Import EvolutionAgent
import { GoalManagementAgent } from './GoalManagementAgent'; // Import GoalManagementAgent
import { AnalyticsAgent } from './AnalyticsAgent'; // Import AnalyticsAgent
import { WebhookAgent } from './WebhookAgent'; // Import WebhookAgent
// --- New: Import SuggestionAgent --
import { SuggestionAgent } from './SuggestionAgent';
// --- End New --
// --- New: Import CalendarAgent ---
import { CalendarAgent } from './CalendarAgent';
// --- End New ---
// --- New: Import RAGIndexer ---
import { RAGIndexer } from '../rag/indexer';
// --- End New ---


/**
 * The factory for creating and managing agent instances.
 */
export class AgentFactory {
    private static instance: AgentFactory;
    private context: SystemContext | null = null; // SystemContext is needed for agent creation
    private registeredAgents: Map<string, BaseAgent> = new Map(); // Map: agentName -> agentInstance

    private constructor() {
        console.log('[AgentFactory] Initialized.');
    }

    /**
     * Gets the singleton instance of the AgentFactory.
     * @param context The SystemContext instance (required for the first call).
     * @returns The AgentFactory instance.
     */
    public static getInstance(context?: SystemContext): AgentFactory {
        if (!AgentFactory.instance) {
            AgentFactory.instance = new AgentFactory();
            if (context) {
                AgentFactory.instance.setContext(context);
            }
        } else {
             // Ensure context is set if it wasn't on the very first call
             if (!AgentFactory.instance.context && context) {
                 AgentFactory.instance.setContext(context);
             }
        }
        return AgentFactory.instance;
    }

    /**
     * Sets the SystemContext for the factory.
     * This must be called before creating any agents.
     * @param context The SystemContext instance.
     */
    public setContext(context: SystemContext): void {
        this.context = context;
        console.log('[AgentFactory] SystemContext set.');
    }

    /**
     * Creates and registers all specific agent instances.
     * This should be called once after the SystemContext is fully assembled.
     */
    public initializeAgents(): void {
        if (!this.context) {
            console.error('[AgentFactory] SystemContext is not set. Cannot initialize agents.');
            throw new Error('SystemContext must be set before initializing agents.');
        }

        console.log('[AgentFactory] Initializing agents...');

        // Create instances of all specific agents and register them
        // Pass the context to each agent's constructor
        this.registerAgent(new InputAgent(this.context));
        this.registerAgent(new KnowledgeAgent(this.context));
        this.registerAgent(new AIAgent(this.context));
        this.registerAgent(new SupabaseAgent(this.context));
        this.registerAgent(new SyncAgent(this.context));
        this.registerAgent(new DecisionAgent(this.context)); // Register DecisionAgent
        this.registerAgent(new DeviceAgent(this.context)); // Register DeviceAgent
        this.registerAgent(new UtilityAgent(this.context)); // Register UtilityAgent
        this.registerAgent(new UIAgent(this.context)); // Register UIAgent
        this.registerAgent(new AuthorityForgingAgent(this.context)); // Register AuthorityForgingAgent
        this.registerAgent(new SelfNavigationAgent(this.context)); // Register SelfNavigationAgent
        this.registerAgent(new RuneEngraftingAgent(this.context)); // Register RuneEngraftingAgent
        this.registerAgent(new NotificationAgent(this.context)); // Register NotificationAgent
        this.registerAgent(new EvolutionAgent(this.context)); // Register EvolutionAgent
        this.registerAgent(new GoalManagementAgent(this.context)); // Register GoalManagementAgent
        this.registerAgent(new AnalyticsAgent(this.context)); // Register AnalyticsAgent
        this.registerAgent(new WebhookAgent(this.context)); // Register WebhookAgent
        // --- New: Register SuggestionAgent --
        this.registerAgent(new SuggestionAgent(this.context));
        // --- End New --
        // --- New: Register CalendarAgent ---
        this.registerAgent(new CalendarAgent(this.context));
        // --- End New ---
        // --- New: Register RAGIndexer ---
        this.registerAgent(new RAGIndexer(this.context));
        // --- End New ---

        console.log(`[AgentFactory] ${this.registeredAgents.size} agents registered.`);

        // Call init() on each registered agent
        this.registeredAgents.forEach(agent => {
            try {
                agent.init();
            } catch (error) {
                console.error(`[AgentFactory] Error initializing agent ${agent.agentName}:`, error);
                // Handle initialization errors (e.g., log, mark agent as unhealthy)
            }
        });

        console.log('[AgentFactory] Agent initialization complete.');
    }


    /**
     * Registers an agent instance with the factory.
     * @param agent The agent instance to register.
     */
    private registerAgent(agent: BaseAgent): void {
        if (this.registeredAgents.has(agent.agentName)) {
            console.warn(`[AgentFactory] Agent with name \"${agent.agentName}\" is already registered. Overwriting.`);
        }
        this.registeredAgents.set(agent.agentName, agent);
        console.log(`[AgentFactory] Agent \"${agent.agentName}\" registered.`);
    }

    /**
     * Retrieves a registered agent instance by name.
     * @param agentName The name of the agent to retrieve.
     * @returns The agent instance or undefined if not found.
     */
    public getAgent(agentName: string): BaseAgent | undefined {
        const agent = this.registeredAgents.get(agentName);
        if (!agent) {
            console.warn(`[AgentFactory] Agent \"${agentName}\" not found in registry.`);
        }
        return agent;
    }

    /**
     * Retrieves all registered agent instances.
     * @returns A Map of registered agents.
     */
    public getRegisteredAgents(): Map<string, BaseAgent> {
        return this.registeredAgents;
    }

    // TODO: Implement methods for managing agent lifecycle (start, stop, restart)
    // TODO: Implement methods for monitoring agent health/status
}
```