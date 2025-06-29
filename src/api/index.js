var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
""(__makeTemplateObject(["typescript\n// src/api/index.ts\n// Jun.Ai.Key API Gateway (Placeholder)\n// This file sets up a basic Express server to act as an API Gateway.\n// It receives requests from the SDK (when junaiApiEndpoint is configured)\n// and routes them to the appropriate core services or agents.\n// --- Best Practice: Implement consistent error handling and response formatting --\n// --- Best Practice: Add logging for incoming requests and outgoing responses --\n// --- Best Practice: Ensure user authentication is checked for protected routes --\n\nimport express, { Request, Response, NextFunction } from 'express';\nimport { SystemContext } from '../interfaces'; // Import SystemContext\nimport { AgentMessage, AgentResponse, AgentError } from '../agents/BaseAgent'; // Import types, AgentError\nimport { v4 as uuidv4 } from 'uuid'; // Import uuid for correlation IDs\n\n// Define the Express app instance\nconst app = express();\nconst port = 3000; // Default port for WebContainer\n\n// Middleware to parse JSON request bodies\napp.use(express.json());\n\n// Middleware for CORS (if needed, though WebContainer might handle this)\n// You might need more sophisticated CORS handling in a real deployment\napp.use((req: Request, res: Response, next: NextFunction) => {\n  res.setHeader('Access-Control-Allow-Origin', '*'); // Allow requests from any origin (for development)\n  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');\n  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');\n  if (req.method === 'OPTIONS') {\n    res.sendStatus(200);\n  } else {\n    next();\n  }\n});\n\n\n// --- Middleware to attach SystemContext and User ID to request --\n// This middleware assumes the user is authenticated via the SDK\n// and the SDK passes the user's JWT in the Authorization header.\n// In a real backend, you would verify the JWT here.\n// For MVP in WebContainer, we'll just assume the user is the current user from context.\n// A real API Gateway would need to handle authentication and user identification securely.\nconst attachUserAndContext = (systemContext: SystemContext) => {\n    return (req: Request, res: Response, next: NextFunction) => {\n        // Attach systemContext to the request object\n        (req as any).systemContext = systemContext;\n\n        // In a real backend, extract user ID from JWT\n        // For MVP in WebContainer, use the current user from the shared context\n        const userId = systemContext.currentUser?.id;\n        if (!userId) {\n            // If no user is logged in, some endpoints might still be accessible (e.g., public runes)\n            // Others will require authentication. The downstream handlers should check for userId.\n            console.warn('[API Gateway] Request received without authenticated user.');\n            // Optionally return 401 here if the endpoint requires authentication\n            // if (req.path.startsWith('/api/v1/user/') || req.path.startsWith('/api/v1/knowledge') && req.method !== 'GET') {\n            //     return res.status(401).json({ error: 'Authentication required.' });\n            // }\n        }\n        (req as any).userId = userId; // Attach userId to the request object\n\n        next();\n    };\n};\n// --- End Middleware --\n\n\n// --- Helper function to send a message to an agent and wait for response --\n// This function mimics the BaseAgent.requestAgent method but is used by the API Gateway.\nconst requestAgentFromGateway = async (systemContext: SystemContext, recipient: string, type: string, payload?: any, timeout: number = 30000): Promise<AgentResponse> => {\n    if (!systemContext.messageBus) {\n        throw new Error('MessageBus is not available in SystemContext.');\n    }\n\n    // Generate a unique correlation ID for this request\n    const correlationId = "], ["typescript\n// src/api/index.ts\n// Jun.Ai.Key API Gateway (Placeholder)\n// This file sets up a basic Express server to act as an API Gateway.\n// It receives requests from the SDK (when junaiApiEndpoint is configured)\n// and routes them to the appropriate core services or agents.\n// --- Best Practice: Implement consistent error handling and response formatting --\n// --- Best Practice: Add logging for incoming requests and outgoing responses --\n// --- Best Practice: Ensure user authentication is checked for protected routes --\n\nimport express, { Request, Response, NextFunction } from 'express';\nimport { SystemContext } from '../interfaces'; // Import SystemContext\nimport { AgentMessage, AgentResponse, AgentError } from '../agents/BaseAgent'; // Import types, AgentError\nimport { v4 as uuidv4 } from 'uuid'; // Import uuid for correlation IDs\n\n// Define the Express app instance\nconst app = express();\nconst port = 3000; // Default port for WebContainer\n\n// Middleware to parse JSON request bodies\napp.use(express.json());\n\n// Middleware for CORS (if needed, though WebContainer might handle this)\n// You might need more sophisticated CORS handling in a real deployment\napp.use((req: Request, res: Response, next: NextFunction) => {\n  res.setHeader('Access-Control-Allow-Origin', '*'); // Allow requests from any origin (for development)\n  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');\n  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');\n  if (req.method === 'OPTIONS') {\n    res.sendStatus(200);\n  } else {\n    next();\n  }\n});\n\n\n// --- Middleware to attach SystemContext and User ID to request --\n// This middleware assumes the user is authenticated via the SDK\n// and the SDK passes the user's JWT in the Authorization header.\n// In a real backend, you would verify the JWT here.\n// For MVP in WebContainer, we'll just assume the user is the current user from context.\n// A real API Gateway would need to handle authentication and user identification securely.\nconst attachUserAndContext = (systemContext: SystemContext) => {\n    return (req: Request, res: Response, next: NextFunction) => {\n        // Attach systemContext to the request object\n        (req as any).systemContext = systemContext;\n\n        // In a real backend, extract user ID from JWT\n        // For MVP in WebContainer, use the current user from the shared context\n        const userId = systemContext.currentUser?.id;\n        if (!userId) {\n            // If no user is logged in, some endpoints might still be accessible (e.g., public runes)\n            // Others will require authentication. The downstream handlers should check for userId.\n            console.warn('[API Gateway] Request received without authenticated user.');\n            // Optionally return 401 here if the endpoint requires authentication\n            // if (req.path.startsWith('/api/v1/user/') || req.path.startsWith('/api/v1/knowledge') && req.method !== 'GET') {\n            //     return res.status(401).json({ error: 'Authentication required.' });\n            // }\n        }\n        (req as any).userId = userId; // Attach userId to the request object\n\n        next();\n    };\n};\n// --- End Middleware --\n\n\n// --- Helper function to send a message to an agent and wait for response --\n// This function mimics the BaseAgent.requestAgent method but is used by the API Gateway.\nconst requestAgentFromGateway = async (systemContext: SystemContext, recipient: string, type: string, payload?: any, timeout: number = 30000): Promise<AgentResponse> => {\n    if (!systemContext.messageBus) {\n        throw new Error('MessageBus is not available in SystemContext.');\n    }\n\n    // Generate a unique correlation ID for this request\n    const correlationId = "]));
gateway - $;
{
    recipient;
}
-$;
{
    type;
}
-$;
{
    uuidv4();
}
";\n\n    const message: AgentMessage = {\n        type,\n        payload,\n        recipient,\n        sender: 'api_gateway', // Identify the sender as the API Gateway\n        correlationId, // Include correlation ID\n    };\n\n    console.log("[API];
Gateway;
Sending;
request;
to;
agent;
$;
{
    recipient;
}
$;
{
    type;
}
(Correlation);
ID: $;
{
    correlationId;
}
");\n    systemContext.loggingService?.logInfo(";
API;
Gateway;
sending;
request;
to;
agent;
$;
{
    recipient;
}
", { recipient, messageType: type, correlationId });\n\n\n    try {\n        // Use the MessageBus method to send the message and wait for the response\n        const response = await systemContext.messageBus.sendMessageAndWaitForResponse(message, timeout);\n\n        // Check the success status in the AgentResponse payload\n        if (!response.success) {\n            // If the response indicates an error, throw an Error\n            // --- Best Practice: Throw AgentError for structured errors ---\n            throw new AgentError(response.error || ";
Agent;
$;
{
    recipient;
}
returned;
an;
error.(__makeTemplateObject([", { response });\n            // --- End Best Practice ---\n        }\n\n        // Return the data from the successful response\n        return response; // Return the full AgentResponse object\n\n    } catch (error: any) {\n        console.error("], [", { response });\n            // --- End Best Practice ---\n        }\n\n        // Return the data from the successful response\n        return response; // Return the full AgentResponse object\n\n    } catch (error: any) {\n        console.error("]))[API];
Gateway;
Failed;
to;
get;
response;
from;
agent;
$;
{
    recipient;
}
for (message; $; { type: type }(Correlation, ID, $, { correlationId: correlationId }))
    : ", error);\n        systemContext.loggingService?.logError(";
API;
Gateway;
failed;
to;
get;
response;
from;
agent;
$;
{
    recipient;
}
", { recipient, messageType: type, correlationId, error: error.message });\n        // Re-throw the error for the caller to handle\n        throw error;\n    }\n};\n// --- End Helper --\n\n\n// --- API Gateway Routes ---\n// Implement routes for different API endpoints, delegating to agents.\n// These routes should match the endpoints expected by the SDK clients.\n\n// Knowledge Base Routes\napp.post('/api/v1/knowledge', async (req: Request, res: Response) => {\n    const systemContext: SystemContext = (req as any).systemContext;\n    const userId: string = (req as any).userId;\n    const recordDetails = req.body;\n\n    console.log("[API];
Gateway;
POST / api / v1 / knowledge;
received;
for (user; ; )
    : $;
{
    userId;
}
");\n    systemContext.loggingService?.logInfo(";
API;
Gateway;
received;
POST / api / v1 / knowledge(__makeTemplateObject([", { userId });\n\n\n    if (!userId) return res.status(401).json({ error: 'Authentication required.' });\n\n    try {\n        // Delegate to KnowledgeAgent\n        const response = await requestAgentFromGateway(systemContext, 'knowledge', 'create_knowledge_point', { ...recordDetails, user_id: userId });\n        res.json(response.data);\n    } catch (error: any) {\n        // --- Best Practice: Standardize error response format ---\n        res.status(error instanceof AgentError ? 500 : 500).json({ error: error.message }); // Use 500 for generic agent errors for now\n        // TODO: Map specific AgentError types/details to appropriate HTTP status codes (e.g., 400, 404, 409)\n        // --- End Best Practice ---\n    }\n});\n\napp.get('/api/v1/knowledge', async (req: Request, res: Response) => {\n    const systemContext: SystemContext = (req as any).systemContext;\n    const userId: string = (req as any).userId;\n    const options = req.query; // Filters from query params\n\n    console.log("], [", { userId });\n\n\n    if (!userId) return res.status(401).json({ error: 'Authentication required.' });\n\n    try {\n        // Delegate to KnowledgeAgent\n        const response = await requestAgentFromGateway(systemContext, 'knowledge', 'create_knowledge_point', { ...recordDetails, user_id: userId });\n        res.json(response.data);\n    } catch (error: any) {\n        // --- Best Practice: Standardize error response format ---\n        res.status(error instanceof AgentError ? 500 : 500).json({ error: error.message }); // Use 500 for generic agent errors for now\n        // TODO: Map specific AgentError types/details to appropriate HTTP status codes (e.g., 400, 404, 409)\n        // --- End Best Practice ---\n    }\n});\n\napp.get('/api/v1/knowledge', async (req: Request, res: Response) => {\n    const systemContext: SystemContext = (req as any).systemContext;\n    const userId: string = (req as any).userId;\n    const options = req.query; // Filters from query params\n\n    console.log("]))[API];
Gateway;
GET / api / v1 / knowledge;
received;
for (user; ; )
    : $;
{
    userId;
}
");\n    systemContext.loggingService?.logInfo(";
API;
Gateway;
received;
GET / api / v1 / knowledge(__makeTemplateObject([", { userId, query: options });\n\n\n    if (!userId) return res.status(401).json({ error: 'Authentication required.' });\n\n    try {\n        // Delegate to KnowledgeAgent\n        const response = await requestAgentFromGateway(systemContext, 'knowledge', 'get_all_knowledge', { user_id: userId, ...options }); // Assuming get_all_knowledge supports filters\n        res.json(response.data);\n    } catch (error: any) {\n        res.status(error instanceof AgentError ? 500 : 500).json({ error: error.message });\n    }\n});\n\napp.post('/api/v1/knowledge/search', async (req: Request, res: Response) => {\n    const systemContext: SystemContext = (req as any).systemContext;\n    const userId: string = (req as any).userId;\n    const { query, ...options } = req.body; // Query and options from body\n\n    console.log("], [", { userId, query: options });\n\n\n    if (!userId) return res.status(401).json({ error: 'Authentication required.' });\n\n    try {\n        // Delegate to KnowledgeAgent\n        const response = await requestAgentFromGateway(systemContext, 'knowledge', 'get_all_knowledge', { user_id: userId, ...options }); // Assuming get_all_knowledge supports filters\n        res.json(response.data);\n    } catch (error: any) {\n        res.status(error instanceof AgentError ? 500 : 500).json({ error: error.message });\n    }\n});\n\napp.post('/api/v1/knowledge/search', async (req: Request, res: Response) => {\n    const systemContext: SystemContext = (req as any).systemContext;\n    const userId: string = (req as any).userId;\n    const { query, ...options } = req.body; // Query and options from body\n\n    console.log("]))[API];
Gateway;
POST / api / v1 / knowledge / search;
received;
for (user; ; )
    : $;
{
    userId;
}
");\n    systemContext.loggingService?.logInfo(";
API;
Gateway;
received;
POST / api / v1 / knowledge / search(__makeTemplateObject([", { userId, query: { query, ...options } });\n\n\n    if (!userId) return res.status(401).json({ error: 'Authentication required.' });\n    if (!query) return res.status(400).json({ error: 'Search query is required.' });\n\n    try {\n        // Delegate to KnowledgeAgent\n        const response = await requestAgentFromGateway(systemContext, 'knowledge', 'query_knowledge', { query, user_id: userId, ...options });\n        res.json(response.data);\n    } catch (error: any) {\n        res.status(error instanceof AgentError ? 500 : 500).json({ error: error.message });\n    }\n});\n\napp.get('/api/v1/knowledge/:recordId', async (req: Request, res: Response) => {\n    const systemContext: SystemContext = (req as any).systemContext;\n    const userId: string = (req as any).userId;\n    const recordId = req.params.recordId;\n\n    console.log("], [", { userId, query: { query, ...options } });\n\n\n    if (!userId) return res.status(401).json({ error: 'Authentication required.' });\n    if (!query) return res.status(400).json({ error: 'Search query is required.' });\n\n    try {\n        // Delegate to KnowledgeAgent\n        const response = await requestAgentFromGateway(systemContext, 'knowledge', 'query_knowledge', { query, user_id: userId, ...options });\n        res.json(response.data);\n    } catch (error: any) {\n        res.status(error instanceof AgentError ? 500 : 500).json({ error: error.message });\n    }\n});\n\napp.get('/api/v1/knowledge/:recordId', async (req: Request, res: Response) => {\n    const systemContext: SystemContext = (req as any).systemContext;\n    const userId: string = (req as any).userId;\n    const recordId = req.params.recordId;\n\n    console.log("]))[API];
Gateway;
GET / api / v1 / knowledge / ;
recordId;
received;
for (user; ; )
    : $;
{
    userId;
}
recordId: $;
{
    recordId;
}
");\n    systemContext.loggingService?.logInfo(";
API;
Gateway;
received;
GET / api / v1 / knowledge / ;
recordId(__makeTemplateObject([", { userId, recordId });\n\n\n    if (!userId) return res.status(401).json({ error: 'Authentication required.' });\n\n    try {\n        // Delegate to KnowledgeAgent\n        const response = await requestAgentFromGateway(systemContext, 'knowledge', 'get_knowledge_by_id', { id: recordId, user_id: userId });\n        if (!response.success || !response.data) {\n             return res.status(404).json({ error: response.error || 'Knowledge record not found or not accessible.' });\n        }\n        res.json(response.data);\n    } catch (error: any) {\n        res.status(error instanceof AgentError ? 500 : 500).json({ error: error.message });\n    }\n});\n\napp.put('/api/v1/knowledge/:recordId', async (req: Request, res: Response) => {\n    const systemContext: SystemContext = (req as any).systemContext;\n    const userId: string = (req as any).userId;\n    const recordId = req.params.recordId;\n    const updates = req.body;\n\n    console.log("], [", { userId, recordId });\n\n\n    if (!userId) return res.status(401).json({ error: 'Authentication required.' });\n\n    try {\n        // Delegate to KnowledgeAgent\n        const response = await requestAgentFromGateway(systemContext, 'knowledge', 'get_knowledge_by_id', { id: recordId, user_id: userId });\n        if (!response.success || !response.data) {\n             return res.status(404).json({ error: response.error || 'Knowledge record not found or not accessible.' });\n        }\n        res.json(response.data);\n    } catch (error: any) {\n        res.status(error instanceof AgentError ? 500 : 500).json({ error: error.message });\n    }\n});\n\napp.put('/api/v1/knowledge/:recordId', async (req: Request, res: Response) => {\n    const systemContext: SystemContext = (req as any).systemContext;\n    const userId: string = (req as any).userId;\n    const recordId = req.params.recordId;\n    const updates = req.body;\n\n    console.log("]))[API];
Gateway;
PUT / api / v1 / knowledge / ;
recordId;
received;
for (user; ; )
    : $;
{
    userId;
}
recordId: $;
{
    recordId;
}
");\n    systemContext.loggingService?.logInfo(";
API;
Gateway;
received;
PUT / api / v1 / knowledge / ;
recordId(__makeTemplateObject([", { userId, recordId, updates });\n\n\n    if (!userId) return res.status(401).json({ error: 'Authentication required.' });\n    if (!updates || Object.keys(updates).length === 0) return res.status(400).json({ error: 'Updates are required.' });\n\n    try {\n        // Delegate to KnowledgeAgent\n        const response = await requestAgentFromGateway(systemContext, 'knowledge', 'update_knowledge', { id: recordId, updates: updates, user_id: userId });\n         if (!response.success || !response.data) {\n             return res.status(404).json({ error: response.error || 'Knowledge record not found or not owned by user.' });\n         }\n        res.json(response.data);\n    } catch (error: any) {\n        res.status(error instanceof AgentError ? 500 : 500).json({ error: error.message });\n    }\n});\n\napp.delete('/api/v1/knowledge/:recordId', async (req: Request, res: Response) => {\n    const systemContext: SystemContext = (req as any).systemContext;\n    const userId: string = (req as any).userId;\n    const recordId = req.params.recordId;\n\n    console.log("], [", { userId, recordId, updates });\n\n\n    if (!userId) return res.status(401).json({ error: 'Authentication required.' });\n    if (!updates || Object.keys(updates).length === 0) return res.status(400).json({ error: 'Updates are required.' });\n\n    try {\n        // Delegate to KnowledgeAgent\n        const response = await requestAgentFromGateway(systemContext, 'knowledge', 'update_knowledge', { id: recordId, updates: updates, user_id: userId });\n         if (!response.success || !response.data) {\n             return res.status(404).json({ error: response.error || 'Knowledge record not found or not owned by user.' });\n         }\n        res.json(response.data);\n    } catch (error: any) {\n        res.status(error instanceof AgentError ? 500 : 500).json({ error: error.message });\n    }\n});\n\napp.delete('/api/v1/knowledge/:recordId', async (req: Request, res: Response) => {\n    const systemContext: SystemContext = (req as any).systemContext;\n    const userId: string = (req as any).userId;\n    const recordId = req.params.recordId;\n\n    console.log("]))[API];
Gateway;
DELETE / api / v1 / knowledge / ;
recordId;
received;
for (user; ; )
    : $;
{
    userId;
}
recordId: $;
{
    recordId;
}
");\n    systemContext.loggingService?.logInfo(";
API;
Gateway;
received;
DELETE / api / v1 / knowledge / ;
recordId(__makeTemplateObject([", { userId, recordId });\n\n\n    if (!userId) return res.status(401).json({ error: 'Authentication required.' });\n\n    try {\n        // Delegate to KnowledgeAgent\n        const response = await requestAgentFromGateway(systemContext, 'knowledge', 'delete_knowledge', { id: recordId, user_id: userId });\n         if (!response.success) {\n             // Assuming delete returns success: false or throws on not found/not owned\n             // A 404 might be more appropriate if the item wasn't found at all.\n             // Let's check the response data or error message for specific cases.\n             // For MVP, if success is false, assume it was not found or not owned.\n             return res.status(404).json({ error: response.error || 'Knowledge record not found or not owned by user.' });\n         }\n        res.json({ success: true }); // Return success status\n    } catch (error: any) {\n        res.status(error instanceof AgentError ? 500 : 500).json({ error: error.message });\n    }\n});\n\n// Knowledge Collections Routes\napp.post('/api/v1/knowledge/collections', async (req: Request, res: Response) => {\n    const systemContext: SystemContext = (req as any).systemContext;\n    const userId: string = (req as any).userId;\n    const collectionDetails = req.body;\n\n    console.log("], [", { userId, recordId });\n\n\n    if (!userId) return res.status(401).json({ error: 'Authentication required.' });\n\n    try {\n        // Delegate to KnowledgeAgent\n        const response = await requestAgentFromGateway(systemContext, 'knowledge', 'delete_knowledge', { id: recordId, user_id: userId });\n         if (!response.success) {\n             // Assuming delete returns success: false or throws on not found/not owned\n             // A 404 might be more appropriate if the item wasn't found at all.\n             // Let's check the response data or error message for specific cases.\n             // For MVP, if success is false, assume it was not found or not owned.\n             return res.status(404).json({ error: response.error || 'Knowledge record not found or not owned by user.' });\n         }\n        res.json({ success: true }); // Return success status\n    } catch (error: any) {\n        res.status(error instanceof AgentError ? 500 : 500).json({ error: error.message });\n    }\n});\n\n// Knowledge Collections Routes\napp.post('/api/v1/knowledge/collections', async (req: Request, res: Response) => {\\n    const systemContext: SystemContext = (req as any).systemContext;\\n    const userId: string = (req as any).userId;\\n    const collectionDetails = req.body;\\n\\n    console.log("]))[API];
Gateway;
POST / api / v1 / knowledge / collections;
received;
for (user; ; )
    : $;
{
    userId;
}
");\n    systemContext.loggingService?.logInfo(";
API;
Gateway;
received;
POST / api / v1 / knowledge / collections(__makeTemplateObject([", { userId, details: collectionDetails });\n\n\n    if (!userId) return res.status(401).json({ error: 'Authentication required.' });\n\n    try {\n        // Delegate to KnowledgeAgent\n        const response = await requestAgentFromGateway(systemContext, 'knowledge', 'create_collection', { ...collectionDetails, user_id: userId });\n        res.json(response.data);\n    } catch (error: any) {\n        res.status(error instanceof AgentError ? 500 : 500).json({ error: error.message });\n    }\n});\n\napp.get('/api/v1/knowledge/collections', async (req: Request, res: Response) => {\n    const systemContext: SystemContext = (req as any).systemContext;\n    const userId: string = (req as any).userId;\n    const options = req.query; // Filters from query params\n\n    console.log("], [", { userId, details: collectionDetails });\\n\\n\\n    if (!userId) return res.status(401).json({ error: 'Authentication required.' });\\n\\n    try {\\n        // Delegate to KnowledgeAgent\\n        const response = await requestAgentFromGateway(systemContext, 'knowledge', 'create_collection', { ...collectionDetails, user_id: userId });\\n        res.json(response.data);\\n    } catch (error: any) {\\n        res.status(error instanceof AgentError ? 500 : 500).json({ error: error.message });\\n    }\\n});\\n\\napp.get('/api/v1/knowledge/collections', async (req: Request, res: Response) => {\\n    const systemContext: SystemContext = (req as any).systemContext;\\n    const userId: string = (req as any).userId;\\n    const options = req.query; // Filters from query params\\n\\n    console.log("]))[API];
Gateway;
GET / api / v1 / knowledge / collections;
received;
for (user; ; )
    : $;
{
    userId;
}
");\n    systemContext.loggingService?.logInfo(";
API;
Gateway;
received;
GET / api / v1 / knowledge / collections(__makeTemplateObject([", { userId, query: options });\n\n\n    if (!userId) return res.status(401).json({ error: 'Authentication required.' });\n\n    try {\n        // Delegate to KnowledgeAgent\n        const response = await requestAgentFromGateway(systemContext, 'knowledge', 'get_collections', { user_id: userId, ...options }); // Assuming get_collections supports filters\n        res.json(response.data);\n    } catch (error: any) {\n        res.status(error instanceof AgentError ? 500 : 500).json({ error: error.message });\n    }\n});\n\napp.get('/api/v1/knowledge/collections/:collectionId', async (req: Request, res: Response) => {\n    const systemContext: SystemContext = (req as any).systemContext;\n    const userId: string = (req as any).userId;\n    const collectionId = req.params.collectionId;\n\n    console.log("], [", { userId, query: options });\\n\\n\\n    if (!userId) return res.status(401).json({ error: 'Authentication required.' });\\n\\n    try {\\n        // Delegate to KnowledgeAgent\\n        const response = await requestAgentFromGateway(systemContext, 'knowledge', 'get_collections', { user_id: userId, ...options }); // Assuming get_collections supports filters\\n        res.json(response.data);\\n    } catch (error: any) {\\n        res.status(error instanceof AgentError ? 500 : 500).json({ error: error.message });\\n    }\\n});\\n\\napp.get('/api/v1/knowledge/collections/:collectionId', async (req: Request, res: Response) => {\\n    const systemContext: SystemContext = (req as any).systemContext;\\n    const userId: string = (req as any).userId;\\n    const collectionId = req.params.collectionId;\\n\\n    console.log("]))[API];
Gateway;
GET / api / v1 / knowledge / collections / ;
collectionId;
received;
for (user; ; )
    : $;
{
    userId;
}
collectionId: $;
{
    collectionId;
}
");\n    systemContext.loggingService?.logInfo(";
API;
Gateway;
received;
GET / api / v1 / knowledge / collections / ;
collectionId(__makeTemplateObject([", { userId, collectionId });\n\n\n    if (!userId) return res.status(401).json({ error: 'Authentication required.' });\n\n    try {\n        // Delegate to KnowledgeAgent\n        const response = await requestAgentFromGateway(systemContext, 'knowledge', 'get_collection_by_id', { collectionId: collectionId, user_id: userId });\n        if (!response.success || !response.data) {\n             return res.status(404).json({ error: response.error || 'Knowledge collection not found or not accessible.' });\n        }\n        res.json(response.data);\n    } catch (error: any) {\n        res.status(error instanceof AgentError ? 500 : 500).json({ error: error.message });\n    }"], [", { userId, collectionId });\\n\\n\\n    if (!userId) return res.status(401).json({ error: 'Authentication required.' });\\n\\n    try {\\n        // Delegate to KnowledgeAgent\\n        const response = await requestAgentFromGateway(systemContext, 'knowledge', 'get_collection_by_id', { collectionId: collectionId, user_id: userId });\\n        if (!response.success || !response.data) {\\n             return res.status(404).json({ error: response.error || 'Knowledge collection not found or not accessible.' });\\n        }\\n        res.json(response.data);\\n    } catch (error: any) {\\n        res.status(error instanceof AgentError ? 500 : 500).json({ error: error.message });\\n    }\\\n"]))(__makeTemplateObject([""], [""]));
