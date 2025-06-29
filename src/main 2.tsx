```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css'; // Basic CSS file

// Import all core and auxiliary services
import { ApiProxy } from './proxies/apiProxy';
import { KnowledgeSync } from './modules/knowledgeSync';
import { SacredRuneEngraver } from './core/rune-engrafting/SacredRuneEngraver'; // Corrected import
import { SelfNavigationEngine } from './core/self-navigation/SelfNavigationEngine';
import { AuthorityForgingEngine } from './core/authority/AuthorityForgingEngine';
import { JunAiAssistant } from './junai';
import { LoggingService } from './core/logging/LoggingService';
import { CachingService } from './core/caching/CachingService';
import { SecurityService } from './core/security/SecurityService';
import { EventBus } from './modules/events/EventBus';
import { NotificationService } from './modules/notifications/NotificationService';
import { SyncService } from './modules/sync/SyncService';
import { WisdomSecretArt } from './core/wisdom/WisdomSecretArt';
import { EvolutionEngine } from './core/evolution/EvolutionEngine';
import { AnalyticsService } from './modules/analytics/AnalyticsService';
import { GoalManagementService } from './core/goal-management/GoalManagementService';
import { MemoryEngine } from './core/memory/MemoryEngine'; // Import MemoryEngine
import { GlossaryService } from './core/glossary/GlossaryService'; // Import GlossaryService
import { FileService } from './core/files/FileService'; // Import FileService
import { RepositoryService } from './core/repository/RepositoryService'; // Import RepositoryService
import { KnowledgeGraphService } from './core/wisdom/KnowledgeGraphService'; // Import KnowledgeGraphService
import { ScriptSandbox } from './core/execution/ScriptSandbox'; // Import ScriptSandbox
// --- New: Import CalendarService ---
import { CalendarService } from './core/calendar/CalendarService';
// --- End New ---
// --- New: Import TemplateService ---
import { TemplateService } from './core/templates/TemplateService';
// --- End New ---
// --- New: Import SyllabusGenerator ---
import { SyllabusGenerator } from './marketplace/generateSyllabus';
// --- End New ---


// --- New: Import Agent System Components and Agents --
import { MessageBus } from './agents/MessageBus';
import { AgentFactory } from './agents/AgentFactory';
import { AgentRouter } from './agents/AgentRouter';
// Import placeholder agents to register
import { KnowledgeAgent } from './agents/KnowledgeAgent';
import { AIAgent } from './agents/AIAgent';
import { SupabaseAgent } from './agents/SupabaseAgent';
import { SyncAgent } from './agents/SyncAgent';
import { InputAgent } from './agents/InputAgent'; // Corrected import path
import { PollinationsAgent } from './agents/PollinationsAgent';
import { ChatXAgent } from './agents/ChatXAgent';
import { StraicoAgent } from './agents/StraicoAgent';
import { BoostspaceAgent } from './agents/BoostspaceAgent';
import { GitHubAgent } from './agents/GitHubAgent';
import { DecisionAgent } from './agents/DecisionAgent'; // Import DecisionAgent
import { DeviceAgent } from './agents/DeviceAgent'; // Import DeviceAgent
import { UtilityAgent } from './agents/UtilityAgent'; // Import UtilityAgent
import { UIAgent } from './agents/UIAgent'; // Import UIAgent
import { AuthorityForgingAgent } from './agents/AuthorityForgingAgent'; // Import AuthorityForgingAgent
import { SelfNavigationAgent } from './agents/SelfNavigationAgent'; // Import SelfNavigationAgent
import { RuneEngraftingAgent } from './agents/RuneEngraftingAgent'; // Import RuneEngraftingAgent
import { NotificationAgent } from './agents/NotificationAgent'; // Import NotificationAgent
import { EvolutionAgent } from './agents/EvolutionAgent'; // Import EvolutionAgent
import { GoalManagementAgent } from './agents/GoalManagementAgent'; // Import GoalManagementAgent
import { AnalyticsAgent } from './agents/AnalyticsAgent'; // Import AnalyticsAgent
import { WebhookAgent } from './agents/WebhookAgent'; // Import WebhookAgent
// --- New: Import SuggestionAgent --
import { SuggestionAgent } from './agents/SuggestionAgent';
// --- End New --
// --- New: Import CalendarAgent ---
import { CalendarAgent } from './agents/CalendarAgent';
// --- End New ---
// --- New: Import RAGIndexer and RAGRetriever ---
import { RAGIndexer } from './rag/indexer';
import { RAGRetriever } from './rag/retriever';
// --- End New ---
// --- End New ---


// Import simulated rune implementations and helper
import { createRuneDefinition, ExampleScriptRune, BoostspaceRune, DeviceClipboardRune, UIThemeRune, MakeComWebhookRune, CapacitiesRune, InfoflowRune, UpNoteRune, NoteXRune, IiFrSpaceRune, ChatXRune, SupabaseRune, PollinationsAIRune, ConsensusFieldRune, AutoRepairRune, QuantumTunnelRune, WebRune } from './simulated-runes'; // Import all simulated runes including new ones
import { GitHubRune } from './runes/GitHubRune';
import { StraicoAIRune } from './runes/StraicoAIRune';
import { MobileGitSyncRune } from './runes/MobileGitSyncRune';
import { BlueccAPIRune } from './runes/BlueccAPIRune';
import { TaskadeAPIRune } from './runes/TaskadeAPIRune';
import { MymemoAIRune } from './runes/MymemoAIRune';
import { BindAIRune } from './runes/BindAIRune';
import { AitableAIRune } from './runes/AitableAIRune';
import { FileRune } from './runes/FileRune';
import { GlossaryRune } from './runes/GlossaryRune';
import { RepositoryRune } from './runes/RepositoryRune';
import { GoogleDriveRune } from './runes/GoogleDriveRune'; // Corrected import path
import { WorkingCopyRune } from './runes/WorkingCopyRune'; // Import WorkingCopyRune
// --- New: Import URLSchemeRune ---
import { URLSchemeRune } from './runes/URLSchemeRune';
// --- End New ---


// --- New: Import startApiGateway function ---
import { startApiGateway } from './api';
// --- End New ---


import { SystemContext, User, Rune } from './interfaces'; // Import interfaces and User

console.log("\ud83d\ude80 Jun.Ai.Key Web UI Starting...");

// Initialize all core and auxiliary services (The OmniKey's internal structure)
// Order of initialization might matter if services have dependencies

// Create a preliminary context to pass to services that need it during construction
// This helps resolve circular dependencies during initialization
const preliminaryContext: Partial<SystemContext> = {
    currentUser: null, // Initialize currentUser as null
    currentFlow: null, // Initialize currentFlow as null
};

// Initialize services that don't have circular dependencies or only depend on context
const loggingService = new LoggingService(preliminaryContext as SystemContext);
const cachingService = new CachingService(preliminaryContext as SystemContext);
const eventBus = new EventBus(preliminaryContext as SystemContext);
const securityService = new SecurityService(preliminaryContext as SystemContext); // Security needs context to update currentUser

// Update preliminary context with services that are now initialized
Object.assign(preliminaryContext, {
    loggingService,
    cachingService,
    eventBus,
    securityService,
});

// Initialize services that depend on the basic set
const apiProxy = new ApiProxy(preliminaryContext as SystemContext); // ApiProxy needs logging/caching
const scriptSandbox = new ScriptSandbox(preliminaryContext as SystemContext); // ScriptSandbox needs context to access other services
const fileService = new FileService(preliminaryContext as SystemContext); // FileService needs logging
const repositoryService = new RepositoryService(preliminaryContext as SystemContext); // RepositoryService needs logging
const glossaryService = new GlossaryService(preliminaryContext as SystemContext); // GlossaryService needs logging/eventBus/apiProxy
// --- New: Initialize CalendarService ---
const calendarService = new CalendarService(preliminaryContext as SystemContext);
// --- End New ---
// --- New: Initialize TemplateService ---
const templateService = new TemplateService(preliminaryContext as SystemContext);
// --- End New ---
// --- New: Initialize SyllabusGenerator ---
const syllabusGenerator = new SyllabusGenerator(preliminaryContext as SystemContext);
// --- End New ---


// --- New: Initialize Agent System Components --
// Initialize MessageBus first (it will need the router later)
// Pass the router instance to getInstance on the first call to link them
const agentRouter = new AgentRouter(preliminaryContext as SystemContext, AgentFactory.getInstance(), MessageBus.getInstance());
const messageBus = MessageBus.getInstance(agentRouter); // Get the singleton instance and link the router
const agentFactory = AgentFactory.getInstance(preliminaryContext as SystemContext); // Get the singleton instance and set context

// --- End New --


// Assemble the final SystemContext object with all initialized services and agent components
const systemContext: SystemContext = {
    apiProxy,
    knowledgeSync: new KnowledgeSync(preliminaryContext as SystemContext), // KnowledgeSync needs memoryEngine
    junaiAssistant: new JunAiAssistant(preliminaryContext as SystemContext), // JunAiAssistant needs apiProxy, knowledgeSync, wisdom, runes, tasks, goals, sync
    selfNavigationEngine,
    authorityForgingEngine,
    sacredRuneEngraver,
    loggingService,
    cachingService,
    securityService,
    eventBus,
    notificationService,
    syncService,
    wisdomSecretArt,
    evolutionEngine,
    analyticsService,
    goalManagementService,
    currentUser: null, // Will be updated by SecurityService auth listener
    memoryEngine,
    glossaryService,
    fileService,
    repositoryService,
    knowledgeGraphService,
    scriptSandbox,
    // --- New: Add CalendarService to context ---
    calendarService,
    // --- End New ---
    // --- New: Add TemplateService to context ---
    templateService,
    // --- End New ---
    // --- New: Add SyllabusGenerator to context ---
    syllabusGenerator,
    // --- End New ---
    // --- New: Add Agent System Components to context ---
    messageBus, // Add MessageBus instance
    agentFactory, // Add AgentFactory instance
    agentRouter, // Add AgentRouter instance
    // --- New: Add RAG Indexer and Retriever to context ---
    ragIndexer: new RAGIndexer(preliminaryContext as SystemContext),
    ragRetriever: new RAGRetriever(preliminaryContext as SystemContext),
    // --- End New ---
    currentFlow: null, // Add currentFlow to the final context
};

// Now that all services are initialized and the context is complete,
// update the preliminary context reference to the final one.
// This ensures services initialized with the preliminary context now hold the complete one.
// This is a common pattern to handle circular dependencies during initialization.
Object.assign(preliminaryContext, systemContext);


// --- New: Initialize all specific agents via the factory --
// This must happen *after* the full systemContext is assembled and available via the preliminary context.
agentFactory.initializeAgents();
// --- End New ---


// Expose the complete systemContext globally for simplicity in this MVP placeholder
// WARNING: Avoid doing this in production applications
declare const window: any;
window.systemContext = systemContext;

// --- Supabase Auth State Change Listener ---
// This listener updates the systemContext.currentUser whenever the auth state changes
systemContext.securityService?.onAuthStateChange((user: User | null) => {
    systemContext.currentUser = user;
    if (user) {
        // Corrected console.log syntax
        console.log(`[Web UI] Auth state changed: Logged in as ${user.email} (ID: ${user.id})`);
        systemContext.loggingService?.logInfo('User logged in', { userId: user.id, email: user.email });
        // --- New: Register user-specific runes or load user-specific configurations ---
        // This is where you might fetch runes owned by this user from the DB and register them.
        // For MVP, we'll just re-register the public/simulated ones to ensure they are active.
        registerSimulatedRunes(systemContext); // Re-register public runes on login
        // --- End New ---
    } else {
        console.log('[Web UI] Auth state changed: Logged out.');
        systemContext.loggingService?.logInfo('User logged out');
        // --- New: Deregister user-specific runes or clear user-specific configurations ---
        // This is where you might clear runes associated with the logged-out user.
        // For MVP, we'll just re-register public/simulated ones.
        registerSimulatedRunes(systemContext); // Re-register public ones
        // --- End New ---
    }
    // The App component is designed to re-render based on systemContext.currentUser
    // No explicit ReactDOM.render call needed here.
});


// --- New: Function to register simulated runes ---
const registerSimulatedRunes = async (context: SystemContext) => {
    console.log('[main.tsx] Registering simulated runes...');
    const sacredRuneEngraver = context.sacredRuneEngraver;
    if (!sacredRuneEngraver) {
        console.error('SacredRuneEngraver not available to register runes.');
        return;
    }

    const simulatedRunes: Rune[] = [
        createRuneDefinition(
            'example-script-rune',
            'Example Script',
            'A simple example script rune for testing.',
            'script-plugin',
            ExampleScriptRune, // Pass the class
            {
                runExample: { description: 'Runs the example script.', parameters: { input: { type: 'string' } } },
                greet: { description: 'Greeks someone.', parameters: { name: { type: 'string', required: false } } },
            },
            {},
            true // isPublic
        ),
         createRuneDefinition(
            'boostspace-rune',
            'Boost.Space API',
            'Integrates with the Boost.Space API.',
            'api-adapter',
            BoostspaceRune, // Pass the class
            {
                callAPI: { description: 'Calls a generic Boost.Space API endpoint.', parameters: { endpoint: { type: 'string', required: true }, method: { type: 'string', required: true }, data: { type: 'object', required: false }, config: { type: 'object', required: false } } },
            },
            {
                // Example events Boost.Space Rune might publish
                // item_created: { description: 'An item was created in Boost.Space.', payload_schema: { type: 'object' } },
            },
            true // isPublic
        ),
         createRuneDefinition(
            'device-clipboard-rune',
            'Device Clipboard',
            'Accesses the device clipboard (simulated).',
            'device-adapter',
            DeviceClipboardRune, // Pass the class
            {
                getClipboard: { description: 'Gets content from the clipboard.' },
                setClipboard: { description: 'Sets content to the clipboard.', parameters: { content: { type: 'string', required: true } } },
            },
            {},
            true // isPublic
        ),
         createRuneDefinition(
            'ui-theme-rune',
            'UI Theme',
            'Manages the user interface theme (simulated).',
            'ui-component',
            UIThemeRune, // Pass the class
            {
                toggleTheme: { description: 'Toggles between themes.' },
                setTheme: { description: 'Sets a specific theme.', parameters: { theme: { type: 'string', required: true } } },
            },
            {},
            true // isPublic
        ),
         createRuneDefinition(
            'makecom-webhook-rune',
            'Make.com Webhook',
            'Triggers a Make.com webhook.',
            'webhook-trigger',
            MakeComWebhookRune, // Pass the class
            {
                trigger: { description: 'Triggers the webhook with a payload.', parameters: { webhookUrl: { type: 'string', required: true }, payload: { type: 'object', required: true } } },
            },
            {},
            true // isPublic
        ),
        // --- Add GitHubRune definition ---
         createRuneDefinition(
            'github-rune',
            'GitHub API',
            'Integrates with the GitHub API to manage repositories, issues, etc.',
            'api-adapter', // GitHub is an API adapter
            GitHubRune, // Pass the GitHubRune class
            {
                getUser: { description: 'Gets the authenticated user\\'s profile.' },
                listRepos: { description: 'Lists repositories for the authenticated user.', parameters: { type: { type: 'string', description: 'Type of repositories (all, owner, member)', required: false } } },
                createIssue: { description: 'Creates a new issue in a repository.', parameters: { owner: { type: 'string', required: true }, repo: { type: 'string', required: true }, title: { type: 'string', required: true }, body: { type: 'string', required: false }, labels: { type: 'array', items: { type: 'string' }, required: false } } },
                // Add other GitHub methods here as implemented in GitHubRune.ts
            },
            {}, // No events defined for this simulated rune yet
            true // isPublic (assuming a public rune for now, user config handles auth)
        ),
        // --- End Add ---
        // --- Add StraicoAIRune definition ---
         createRuneDefinition(
            'straico-ai-rune',
            'Straico AI',
            'Integrates with the Straico AI API for text generation and chat.',
            'ai-agent', // Straico AI is an AI agent
            StraicoAIRune, // Pass the StraicoAIRune class
            {
                promptCompletion: { description: 'Generates text completion from a prompt.', parameters: { prompt: { type: 'string', required: true }, max_tokens: { type: 'number', required: false }, temperature: { type: 'number', required: false } } },
                chat: { description: 'Engages in a chat conversation.', parameters: { messages: { type: 'array', required: true, items: { type: 'object', properties: { role: { type: 'string' }, content: { type: 'string' } }, required: ['role', 'content'] } }, model: { type: 'string', required: false }, max_tokens: { type: 'number', required: false }, temperature: { type: 'number', required: false } } }
                // Add other Straico methods here as implemented in StraicoAIRune.ts
            },
            {}, // No events defined for this simulated rune yet
            true // isPublic (assuming a public rune for now, user config handles auth)
        ),
        // --- End Add ---
        // --- Add MobileGitSyncRune definition ---
         createRuneDefinition(
            'mobile-git-sync-rune',
            'Mobile Git Sync',
            'Simulates synchronization with a mobile Git client.',
            'device-adapter', // Mobile Git is a device adapter
            MobileGitSyncRune, // Pass the MobileGitSyncRune class
            {
                pull: { description: 'Simulates pulling changes from remote.' },
                push: { description: 'Simulates pushing changes to remote.' },
                bidirectional: { description: 'Simulates bidirectional sync (pull then push).' },
                // Add other methods like status, commit if implemented in the Rune
            },
            {
                // Example events Mobile Git Sync Rune might publish
                // sync_status: { description: 'Reports the status of a sync operation.', payload_schema: { type: 'object' } },
            },
            true, // isPublic (assuming a public rune for now, user config handles repoUrl/credentials)
            undefined, // No specific user ID for the definition itself
            { repo_url: 'https://github.com/simulated/mobile-repo' } // Example default configuration
        ),
        // --- End Add ---
        // --- Add BlueccAPIRune definition ---
         createRuneDefinition(
            'bluecc-api-rune',
            'Blue.cc API',
            'Integrates with the Blue.cc API for data management.',
            'api-adapter', // Blue.cc is an API adapter
            BlueccAPIRune, // Pass the BlueccAPIRune class
            {
                callAPI: { description: 'Calls a generic Blue.cc API endpoint.', parameters: { endpoint: { type: 'string', required: true }, method: { type: 'string', required: true }, data: { type: 'object', required: false }, config: { type: 'object', required: false } } },
                // TODO: Add more specific methods based on Blue.cc API
                // Example: listUsers: { description: 'Lists users from Blue.cc.', parameters: { query: { type: 'string', required: false } } },
            },
            {}, // No events defined for this simulated rune yet
            true // isPublic (assuming a public rune for now, user config handles auth)
        ),
        // --- End Add ---
        // --- Add TaskadeAPIRune definition ---
         createRuneDefinition(
            'taskade-api-rune',
            'Taskade API',
            'Integrates with the Taskade API for task and project management.',
            'api-adapter', // Taskade is an API adapter
            TaskadeAPIRune, // Pass the TaskadeAPIRune class
            {
                callAPI: { description: 'Calls a generic Taskade API endpoint.', parameters: { endpoint: { type: 'string', required: true }, method: { type: 'string', required: true }, data: { type: 'object', required: false }, config: { type: 'object', required: false } } },
                // TODO: Add more specific methods based on Taskade API
                // Example: listProjects: { description: 'Lists projects in a workspace.', parameters: { workspaceId: { type: 'string', required: true } } },
            },
            {}, // No events defined for this simulated rune yet
            true // isPublic (assuming a public rune for now, user config handles auth)
        ),
        // --- End Add ---
        // --- Add MymemoAIRune definition ---
         createRuneDefinition(
            'mymemo-ai-rune',
            'Mymemo.ai API',
            'Integrates with the Mymemo.ai API for note-taking and memory management.',
            'api-adapter', // Mymemo.ai is an API adapter
            MymemoAIRune, // Pass the MymemoAIRune class
            {
                callAPI: { description: 'Calls a generic Mymemo.ai API endpoint.', parameters: { endpoint: { type: 'string', required: true }, method: { type: 'string', required: true }, data: { type: 'object', required: false }, config: { type: 'object', required: false } } },
                // TODO: Add more specific methods based on Mymemo.ai API
                // Example: createMemo: { description: 'Creates a new memo.', parameters: { content: { type: 'string', required: true }, tags: { type: 'array', items: { type: 'string' }, required: false } } },
            },
            {}, // No events defined for this simulated rune yet
            true // isPublic (assuming a public rune for now, user config handles auth)
        ),
        // --- End Add ---
        // --- Add BindAIRune definition ---
         createRuneDefinition(
            'bind-ai-rune',
            'Bind AI',
            'Integrates with the Bind AI API for advanced AI capabilities.',
            'ai-agent', // Bind AI is an AI agent
            BindAIRune, // Pass the BindAIRune class
            {
                callAPI: { description: 'Calls a generic Bind AI API endpoint.', parameters: { endpoint: { type: 'string', required: true }, method: { type: 'string', required: true }, data: { type: 'object', required: false }, config: { type: 'object', required: false } } },
                // TODO: Add more specific methods based on Bind AI API
                // Example: generateCode: { description: 'Generates code based on a prompt.', parameters: { prompt: { type: 'string', required: true }, language?: string }, returns: { type: 'string' } },
            },
            {}, // No events defined for this simulated rune yet
            true // isPublic (assuming a public rune for now, user config handles auth)
        ),
        // --- End Add ---
        // --- Add AitableAIRune definition ---
         createRuneDefinition(
            'aitable-ai-rune',
            'Aitable.ai API',
            'Integrates with the Aitable.ai API for AI-powered data tables.',
            'api-adapter', // Aitable.ai is an API adapter
            AitableAIRune, // Pass the AitableAIRune class
            {
                callAPI: { description: 'Calls a generic Aitable.ai API endpoint.', parameters: { endpoint: { type: 'string', required: true }, method: { type: 'string', required: true }, data: { type: 'object', required: false }, config: { type: 'object', required: false } } },
                // TODO: Add more specific methods based on Aitable.ai API
            },
            {}, // No events defined for this simulated rune yet
            true // isPublic (assuming a public rune for now, user config handles auth)
        ),
        // --- End Add ---
        // --- Add FileRune definition ---
         createRuneDefinition(
            'file-rune',
            'File System',
            'Interacts with the local file system (simulated).',
            'system-adapter', // File system is a system adapter
            FileRune, // Pass the FileRune class
            {
                readFile: { description: 'Reads the content of a file.', parameters: { filePath: { type: 'string', required: true } }, returns: { type: 'string' } },
                writeFile: { description: 'Writes content to a file.', parameters: { filePath: { type: 'string', required: true }, content: { type: 'string', required: true } } },
                deleteFile: { description: 'Deletes a file.', parameters: { filePath: { type: 'string', required: true } } },
                listFiles: { description: 'Lists files in a directory.', parameters: { dirPath: { type: 'string', required: false } }, returns: { type: 'array', items: { type: 'string' } } },
                mergeAndWriteFile: { description: 'Merges content with a file and writes.', parameters: { filePath: { type: 'string', required: true }, newContent: { type: 'string', required: true }, mergeStrategy: { type: 'string', enum: ['append', 'prepend', 'replace', 'diff'], required: false } } },
                // Add other file methods
            },
            {}, // No events defined for this rune yet
            true // isPublic
        ),
        // --- End Add ---
        // --- Add GlossaryRune definition ---
         createRuneDefinition(
            'glossary-rune',
            'Glossary',
            'Manages terms and definitions in the system glossary.',
            'system-adapter', // Glossary is a system adapter
            GlossaryRune, // Pass the GlossaryRune class
            {
                createTerm: { description: 'Creates a new glossary term.', parameters: { term: { type: 'string', required: true }, definition: { type: 'string', required: true }, related_concepts: { type: 'array', items: { type: 'string' }, required: false }, pillar_domain: { type: 'string', required: false }, is_public: { type: 'boolean', required: false } } },
                getTerms: { description: 'Retrieves glossary terms.', parameters: { pillarDomain: { type: 'string', required: false }, searchTerm: { type: 'string', required: false } }, returns: { type: 'array', items: { type: 'object' } } },
                getTermById: { description: 'Retrieves a specific glossary term by ID.', parameters: { termId: { type: 'string', required: true } }, returns: { type: 'object' } },
                updateTerm: { description: 'Updates an existing glossary term.', parameters: { termId: { type: 'string', required: true }, updates: { type: 'object', required: true } } },
                deleteTerm: { description: 'Deletes a glossary term.', parameters: { termId: { type: 'string', required: true } } },
                // Add other glossary methods
            },
            {}, // No events defined for this rune yet
            true // isPublic
        ),
        // --- End Add ---
        // --- Add RepositoryRune definition ---
         createRuneDefinition(
            'repository-rune',
            'Repository',
            'Manages code repositories (simulated Git).',
            'system-adapter', // Repository is a system adapter
            RepositoryRune, // Pass the RepositoryRune class
            {
                cloneRepo: { description: 'Clones a repository.', parameters: { repoUrl: { type: 'string', required: true }, repoName: { type: 'string', required: true } } },
                commitChanges: { description: 'Commits changes.', parameters: { repoName: { type: 'string', required: true }, commitMessage: { type: 'string', required: true } } },
                pushChanges: { description: 'Pushes changes.', parameters: { repoName: { type: 'string', required: true } } },
                pullChanges: { description: 'Pulls changes.', parameters: { repoName: { type: 'string', required: true } } },
                getRepoStatus: { description: 'Gets repository status.', parameters: { repoName: { type: 'string', required: true } }, returns: { type: 'object' } },
                listFilesInRepo: { description: 'Lists files in repo directory.', parameters: { repoName: { type: 'string', required: true }, dirPath: { type: 'string', required: false } }, returns: { type: 'array', items: { type: 'string' } } },
                // Add other repo methods
            },
            {}, // No events defined for this rune yet
            true // isPublic
        ),
        // --- End Add ---
        // --- Add GoogleDriveRune definition ---
         createRuneDefinition(
            'googledrive-rune',
            'Google Drive',
            'Integrates with Google Drive for file management.',
            'api-adapter', // Google Drive is an API adapter
            GoogleDriveRune, // Pass the GoogleDriveRune class
            {
                callAPI: { description: 'Calls a generic Google Drive API endpoint.', parameters: { endpoint: { type: 'string', required: true }, method: { type: 'string', required: true }, data: { type: 'object', required: false }, config: { type: 'object', required: false } } },
                listFiles: { description: 'Lists files in Google Drive.', parameters: { q: { type: 'string', required: false }, pageSize: { type: 'number', required: false }, fields: { type: 'string', required: false } }, returns: { type: 'object' } },
                uploadFile: { description: 'Uploads a file to Google Drive.', parameters: { name: { type: 'string', required: true }, mimeType: { type: 'string', required: true }, content: { type: 'string', description: 'File content (base64 or text)', required: true }, parents: { type: 'array', items: { type: 'string' }, required: false } }, returns: { type: 'object' } },
                // Add other Google Drive methods
            },
            {}, // No events defined for this rune yet
            true // isPublic (requires user to link Google account)
        ),
        // --- End Add ---
        // --- Add WorkingCopyRune definition ---
         createRuneDefinition(
            'working-copy-rune',
            'Working Copy',
            'Interacts with the Working Copy iOS/macOS Git client via URL Schemes (simulated).',
            'device-adapter', // Working Copy is a device adapter
            WorkingCopyRune, // Pass the WorkingCopyRune class
            {
                open: { description: 'Opens Working Copy at a specific screen.', parameters: { repo: { type: 'string', required: true }, path: { type: 'string', required: false }, commit: { type: 'string', required: false }, branch: { type: 'string', required: false }, mode: { type: 'string', required: false }, line: { type: 'number', required: false }, error: { type: 'string', required: false }, message: { type: 'string', required: false } } },
                clone: { description: 'Initiates cloning in Working Copy.', parameters: { remote: { type: 'string', required: true } } },
                show: { description: 'Shows a remote repository.', parameters: { remote: { type: 'string', required: true } } },
                importLog: { description: 'Imports log lines.', parameters: { lines: { type: 'string', required: true }, repo: { type: 'string', required: false }, timestamp: { type: 'number', required: false }, kind: { type: 'string', required: false } } },
                read: { description: 'Reads file content.', parameters: { repo: { type: 'string', required: true }, path: { type: 'string', required: true }, type: { type: 'string', enum: ['text', 'base64'], required: false }, clipboard: { type: 'number', enum: [1], required: false } }, returns: { type: 'object' } },
                write: { description: 'Writes file content.', parameters: { repo: { type: 'string', required: true }, path: { type: 'string', required: true }, text: { type: 'string', required: false }, base64: { type: 'string', required: false }, clipboard: { type: 'number', enum: [1], required: false }, mode: { type: 'string', enum: ['safe', 'overwrite', 'append', 'prepend'], required: false }, askcommit: { type: 'number', enum: [1], required: false }, filename: { type: 'string', required: false }, uti: { type: 'string', required: false } } },
                commit: { description: 'Commits changes.', parameters: { repo: { type: 'string', required: true }, path: { type: 'string', required: false }, limit: { type: 'number', required: false }, message: { type: 'string', required: false }, askcommit: { type: 'number', enum: [1], required: false } } },
                status: { description: 'Gets file status.', parameters: { repo: { type: 'string', required: true }, path: { type: 'string', required: false }, unchanged: { type: 'number', enum: [1], required: false }, depth: { type: 'number', required: false } }, returns: { type: 'object' } },
                push: { description: 'Pushes changes.', parameters: { repo: { type: 'string', required: true }, remote: { type: 'string', required: false } } },
                pull: { description: 'Pulls changes.', parameters: { repo: { type: 'string', required: true }, remote: { type: 'string', required: false } } },
                add: { description: 'Adds files.', parameters: { repo: { type: 'string', required: true }, path: { type: 'string', required: false }, all: { type: 'number', enum: [1], required: false } } },
                log: { description: 'Views log.', parameters: { repo: { type: 'string', required: true }, path: { type: 'string', required: false }, limit: { type: 'number', required: false }, commit: { type: 'string', required: false }, branch: { type: 'string', required: false }, author: { type: 'string', required: false }, message: { type: 'string', required: false }, grep: { type: 'string', required: false }, all: { type: 'number', enum: [1], required: false }, follow: { type: 'number', enum: [1], required: false }, decorate: { type: 'number', enum: [1], required: false }, graph: { type: 'number', enum: [1], required: false }, stat: { type: 'number', enum: [1], required: false }, patch: { type: 'number', enum: [1], required: false } } },
                checkout: { description: 'Checks out branch/commit.', parameters: { repo: { type: 'string', required: true }, branch: { type: 'string', required: false }, commit: { type: 'string', required: false }, force: { type: 'number', enum: [1], required: false } } },
                branch: { description: 'Manages branches.', parameters: { repo: { type: 'string', required: true }, branch: { type: 'string', required: true }, startpoint: { type: 'string', required: false }, force: { type: 'number', enum: [1], required: false }, delete: { type: 'number', enum: [1], required: false }, move: { type: 'string', required: false } } },
                sync: { description: 'Syncs (pull then push).', parameters: { repo: { type: 'string', required: true } } },
                // Add other Working Copy commands
            },
            {}, // No events defined for this rune yet
            true // isPublic (requires user to link Working Copy and store key)
        ),
        // --- End Add ---
        // --- New: Add URLSchemeRune definition ---
         createRuneDefinition(
            'url-scheme-rune',
            'URL Scheme Trigger',
            'Handles incoming URL Scheme activations.',
            'webhook-trigger', // Acts like a webhook trigger
            URLSchemeRune, // Pass the URLSchemeRune class
            {
                // No methods callable *on* this rune, it's triggered *by* URL schemes
                // Define a placeholder method if needed for manifest structure, or rely on events
                handleUrl: { description: 'Handles an incoming URL Scheme (internal trigger).', parameters: { url: { type: 'string', required: true } } }, // Internal method
            },
            {
                // Define events this rune publishes when triggered
                url_scheme_activated: { description: 'A URL Scheme was activated.', payload_schema: { type: 'object', properties: { url: { type: 'string' } } } },
            },
            true // isPublic
        ),
        // --- End New ---
    ];

    // Register each simulated rune
    for (const rune of simulatedRunes) {
        try {
            // Pass the rune definition including the implementation class reference
            await sacredRuneEngraver.registerRune(rune);
        } catch (error) {
            console.error(`Failed to register simulated rune ${rune.name}:`, error);
        }
    }
    console.log('[main.tsx] Simulated runes registration complete.');
};
// --- End New ---


// Render the main App component into the DOM
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

// --- New: Start the API Gateway (if in a Node.js environment like WebContainer) ---
// In a browser-only environment without Node.js, this function call would be skipped.
// In WebContainer, this will start an Express server within the browser environment.
// It will not be publicly accessible from the internet.
if (typeof process !== 'undefined' && process.versions && process.versions.node) {
    // Check if we are in a Node.js environment (like WebContainer)
    // Ensure the API Gateway is started only once after the system context is ready.
    // We can use a simple flag or check if the Express app is already listening.
    // For MVP, just call it directly after context is ready.
    // A more robust approach would be to manage this lifecycle within the main application startup.
    console.log('[main.tsx] Starting API Gateway...');
    startApiGateway(systemContext);
}
// --- End New ---
```