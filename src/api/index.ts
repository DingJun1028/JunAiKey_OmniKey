```typescript
// src/api/index.ts
// Jun.Ai.Key API Gateway (Placeholder)
// This file sets up a basic Express server to act as an API Gateway.
// It receives requests from the SDK (when junaiApiEndpoint is configured)
// and routes them to the appropriate core services or agents.
// --- Best Practice: Implement consistent error handling and response formatting --
// --- Best Practice: Add logging for incoming requests and outgoing responses --
// --- Best Practice: Ensure user authentication is checked for protected routes --

import express, { Request, Response, NextFunction } from 'express';
import { SystemContext } from '../interfaces'; // Import SystemContext
import { AgentMessage, AgentResponse, AgentError } from '../agents/BaseAgent'; // Import types, AgentError
import { v4 as uuidv4 } from 'uuid'; // Import uuid for correlation IDs

// Define the Express app instance
const app = express();
const port = 3000; // Default port for WebContainer

// Middleware to parse JSON request bodies
app.use(express.json());

// Middleware for CORS (if needed, though WebContainer might handle this)
// You might need more sophisticated CORS handling in a real deployment
app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // Allow requests from any origin (for development)
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});


// --- Middleware to attach SystemContext and User ID to request --
// This middleware assumes the user is authenticated via the SDK
// and the SDK passes the user's JWT in the Authorization header.
// In a real backend, you would verify the JWT here.
// For MVP in WebContainer, we'll just assume the user is the current user from context.
// A real API Gateway would need to handle authentication and user identification securely.
const attachUserAndContext = (systemContext: SystemContext) => {
    return (req: Request, res: Response, next: NextFunction) => {
        // Attach systemContext to the request object
        (req as any).systemContext = systemContext;

        // In a real backend, extract user ID from JWT
        // For MVP in WebContainer, use the current user from the shared context
        const userId = systemContext.currentUser?.id;
        if (!userId) {
            // If no user is logged in, some endpoints might still be accessible (e.g., public runes)
            // Others will require authentication. The downstream handlers should check for userId.
            console.warn('[API Gateway] Request received without authenticated user.');
            // Optionally return 401 here if the endpoint requires authentication
            // if (req.path.startsWith('/api/v1/user/') || req.path.startsWith('/api/v1/knowledge') && req.method !== 'GET') {
            //     return res.status(401).json({ error: 'Authentication required.' });
            // }
        }
        (req as any).userId = userId; // Attach userId to the request object

        next();
    };
};
// --- End Middleware --


// --- Helper function to send a message to an agent and wait for response --
// This function mimics the BaseAgent.requestAgent method but is used by the API Gateway.
const requestAgentFromGateway = async (systemContext: SystemContext, recipient: string, type: string, payload?: any, timeout: number = 30000): Promise<AgentResponse> => {
    if (!systemContext.messageBus) {
        throw new Error('MessageBus is not available in SystemContext.');
    }

    // Generate a unique correlation ID for this request
    const correlationId = `gateway-${recipient}-${type}-${uuidv4()}`;

    const message: AgentMessage = {
        type,
        payload,
        recipient,
        sender: 'api_gateway', // Identify the sender as the API Gateway
        correlationId, // Include correlation ID
    };

    console.log(`[API Gateway] Sending request to agent ${recipient}: ${type} (Correlation ID: ${correlationId})`);
    systemContext.loggingService?.logInfo(`API Gateway sending request to agent ${recipient}`, { recipient, messageType: type, correlationId });


    try {
        // Use the MessageBus method to send the message and wait for the response
        const response = await systemContext.messageBus.sendMessageAndWaitForResponse(message, timeout);

        // Check the success status in the AgentResponse payload
        if (!response.success) {
            // If the response indicates an error, throw an Error
            // --- Best Practice: Throw AgentError for structured errors ---
            throw new AgentError(response.error || `Agent ${recipient} returned an error.`, { response });
            // --- End Best Practice ---
        }

        // Return the data from the successful response
        return response; // Return the full AgentResponse object

    } catch (error: any) {
        console.error(`[API Gateway] Failed to get response from agent ${recipient} for message ${type} (Correlation ID: ${correlationId}):`, error);
        systemContext.loggingService?.logError(`API Gateway failed to get response from agent ${recipient}`, { recipient, messageType: type, correlationId, error: error.message });
        // Re-throw the error for the caller to handle
        throw error;
    }
};
// --- End Helper --


// --- API Gateway Routes ---
// Implement routes for different API endpoints, delegating to agents.
// These routes should match the endpoints expected by the SDK clients.

// Knowledge Base Routes
app.post('/api/v1/knowledge', async (req: Request, res: Response) => {
    const systemContext: SystemContext = (req as any).systemContext;
    const userId: string = (req as any).userId;
    const recordDetails = req.body;

    console.log(`[API Gateway] POST /api/v1/knowledge received for user: ${userId}`);
    systemContext.loggingService?.logInfo(`API Gateway received POST /api/v1/knowledge`, { userId });


    if (!userId) return res.status(401).json({ error: 'Authentication required.' });

    try {
        // Delegate to KnowledgeAgent
        const response = await requestAgentFromGateway(systemContext, 'knowledge', 'create_knowledge_point', { ...recordDetails, user_id: userId });
        res.json(response.data);
    } catch (error: any) {
        // --- Best Practice: Standardize error response format ---
        res.status(error instanceof AgentError ? 500 : 500).json({ error: error.message }); // Use 500 for generic agent errors for now
        // TODO: Map specific AgentError types/details to appropriate HTTP status codes (e.g., 400, 404, 409)
        // --- End Best Practice ---
    }
});

app.get('/api/v1/knowledge', async (req: Request, res: Response) => {
    const systemContext: SystemContext = (req as any).systemContext;
    const userId: string = (req as any).userId;
    const options = req.query; // Filters from query params

    console.log(`[API Gateway] GET /api/v1/knowledge received for user: ${userId}`);
    systemContext.loggingService?.logInfo(`API Gateway received GET /api/v1/knowledge`, { userId, query: options });


    if (!userId) return res.status(401).json({ error: 'Authentication required.' });

    try {
        // Delegate to KnowledgeAgent
        const response = await requestAgentFromGateway(systemContext, 'knowledge', 'get_all_knowledge', { user_id: userId, ...options }); // Assuming get_all_knowledge supports filters
        res.json(response.data);
    } catch (error: any) {
        res.status(error instanceof AgentError ? 500 : 500).json({ error: error.message });
    }
});

app.post('/api/v1/knowledge/search', async (req: Request, res: Response) => {
    const systemContext: SystemContext = (req as any).systemContext;
    const userId: string = (req as any).userId;
    const { query, ...options } = req.body; // Query and options from body

    console.log(`[API Gateway] POST /api/v1/knowledge/search received for user: ${userId}`);
    systemContext.loggingService?.logInfo(`API Gateway received POST /api/v1/knowledge/search`, { userId, query: { query, ...options } });


    if (!userId) return res.status(401).json({ error: 'Authentication required.' });
    if (!query) return res.status(400).json({ error: 'Search query is required.' });

    try {
        // Delegate to KnowledgeAgent
        const response = await requestAgentFromGateway(systemContext, 'knowledge', 'query_knowledge', { query, user_id: userId, ...options });
        res.json(response.data);
    } catch (error: any) {
        res.status(error instanceof AgentError ? 500 : 500).json({ error: error.message });
    }
});

app.get('/api/v1/knowledge/:recordId', async (req: Request, res: Response) => {
    const systemContext: SystemContext = (req as any).systemContext;
    const userId: string = (req as any).userId;
    const recordId = req.params.recordId;

    console.log(`[API Gateway] GET /api/v1/knowledge/:recordId received for user: ${userId}, recordId: ${recordId}`);
    systemContext.loggingService?.logInfo(`API Gateway received GET /api/v1/knowledge/:recordId`, { userId, recordId });


    if (!userId) return res.status(401).json({ error: 'Authentication required.' });

    try {
        // Delegate to KnowledgeAgent
        const response = await requestAgentFromGateway(systemContext, 'knowledge', 'get_knowledge_by_id', { id: recordId, user_id: userId });
        if (!response.success || !response.data) {
             return res.status(404).json({ error: response.error || 'Knowledge record not found or not accessible.' });
        }
        res.json(response.data);
    } catch (error: any) {
        res.status(error instanceof AgentError ? 500 : 500).json({ error: error.message });
    }
});

app.put('/api/v1/knowledge/:recordId', async (req: Request, res: Response) => {
    const systemContext: SystemContext = (req as any).systemContext;
    const userId: string = (req as any).userId;
    const recordId = req.params.recordId;
    const updates = req.body;

    console.log(`[API Gateway] PUT /api/v1/knowledge/:recordId received for user: ${userId}, recordId: ${recordId}`);
    systemContext.loggingService?.logInfo(`API Gateway received PUT /api/v1/knowledge/:recordId`, { userId, recordId, updates });


    if (!userId) return res.status(401).json({ error: 'Authentication required.' });
    if (!updates || Object.keys(updates).length === 0) return res.status(400).json({ error: 'Updates are required.' });

    try {
        // Delegate to KnowledgeAgent
        const response = await requestAgentFromGateway(systemContext, 'knowledge', 'update_knowledge', { id: recordId, updates: updates, user_id: userId });
         if (!response.success || !response.data) {
             return res.status(404).json({ error: response.error || 'Knowledge record not found or not owned by user.' });
         }
        res.json(response.data);
    } catch (error: any) {
        res.status(error instanceof AgentError ? 500 : 500).json({ error: error.message });
    }
});

app.delete('/api/v1/knowledge/:recordId', async (req: Request, res: Response) => {
    const systemContext: SystemContext = (req as any).systemContext;
    const userId: string = (req as any).userId;
    const recordId = req.params.recordId;

    console.log(`[API Gateway] DELETE /api/v1/knowledge/:recordId received for user: ${userId}, recordId: ${recordId}`);
    systemContext.loggingService?.logInfo(`API Gateway received DELETE /api/v1/knowledge/:recordId`, { userId, recordId });


    if (!userId) return res.status(401).json({ error: 'Authentication required.' });

    try {
        // Delegate to KnowledgeAgent
        const response = await requestAgentFromGateway(systemContext, 'knowledge', 'delete_knowledge', { id: recordId, user_id: userId });
         if (!response.success) {
             // Assuming delete returns success: false or throws on not found/not owned
             // A 404 might be more appropriate if the item wasn't found at all.
             // Let's check the response data or error message for specific cases.
             // For MVP, if success is false, assume it was not found or not owned.
             return res.status(404).json({ error: response.error || 'Knowledge record not found or not owned by user.' });
         }
        res.json({ success: true }); // Return success status
    } catch (error: any) {
        res.status(error instanceof AgentError ? 500 : 500).json({ error: error.message });
    }
});

// Knowledge Collections Routes
app.post('/api/v1/knowledge/collections', async (req: Request, res: Response) => {\n    const systemContext: SystemContext = (req as any).systemContext;\n    const userId: string = (req as any).userId;\n    const collectionDetails = req.body;\n\n    console.log(`[API Gateway] POST /api/v1/knowledge/collections received for user: ${userId}`);\n    systemContext.loggingService?.logInfo(`API Gateway received POST /api/v1/knowledge/collections`, { userId, details: collectionDetails });\n\n\n    if (!userId) return res.status(401).json({ error: 'Authentication required.' });\n\n    try {\n        // Delegate to KnowledgeAgent\n        const response = await requestAgentFromGateway(systemContext, 'knowledge', 'create_collection', { ...collectionDetails, user_id: userId });\n        res.json(response.data);\n    } catch (error: any) {\n        res.status(error instanceof AgentError ? 500 : 500).json({ error: error.message });\n    }\n});\n\napp.get('/api/v1/knowledge/collections', async (req: Request, res: Response) => {\n    const systemContext: SystemContext = (req as any).systemContext;\n    const userId: string = (req as any).userId;\n    const options = req.query; // Filters from query params\n\n    console.log(`[API Gateway] GET /api/v1/knowledge/collections received for user: ${userId}`);\n    systemContext.loggingService?.logInfo(`API Gateway received GET /api/v1/knowledge/collections`, { userId, query: options });\n\n\n    if (!userId) return res.status(401).json({ error: 'Authentication required.' });\n\n    try {\n        // Delegate to KnowledgeAgent\n        const response = await requestAgentFromGateway(systemContext, 'knowledge', 'get_collections', { user_id: userId, ...options }); // Assuming get_collections supports filters\n        res.json(response.data);\n    } catch (error: any) {\n        res.status(error instanceof AgentError ? 500 : 500).json({ error: error.message });\n    }\n});\n\napp.get('/api/v1/knowledge/collections/:collectionId', async (req: Request, res: Response) => {\n    const systemContext: SystemContext = (req as any).systemContext;\n    const userId: string = (req as any).userId;\n    const collectionId = req.params.collectionId;\n\n    console.log(`[API Gateway] GET /api/v1/knowledge/collections/:collectionId received for user: ${userId}, collectionId: ${collectionId}`);\n    systemContext.loggingService?.logInfo(`API Gateway received GET /api/v1/knowledge/collections/:collectionId`, { userId, collectionId });\n\n\n    if (!userId) return res.status(401).json({ error: 'Authentication required.' });\n\n    try {\n        // Delegate to KnowledgeAgent\n        const response = await requestAgentFromGateway(systemContext, 'knowledge', 'get_collection_by_id', { collectionId: collectionId, user_id: userId });\n        if (!response.success || !response.data) {\n             return res.status(404).json({ error: response.error || 'Knowledge collection not found or not accessible.' });\n        }\n        res.json(response.data);\n    } catch (error: any) {\n        res.status(error instanceof AgentError ? 500 : 500).json({ error: error.message });\n    }\
```