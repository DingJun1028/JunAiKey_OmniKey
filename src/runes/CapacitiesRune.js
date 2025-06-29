var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
""(__makeTemplateObject(["typescript\n// src/runes/CapacitiesRune.ts\n// Capacities API Rune Implementation\n// Provides methods to interact with the Capacities API via the ApiProxy.\n// This Rune is an example of an 'api-adapter' type Rune.\n// --- Modified: Implement simulated methods for fetching and searching Capacities objects --\n\n\nimport { SystemContext, Rune } from '../interfaces';\n// import { ApiProxy } from '../proxies/apiProxy'; // Access via context\n// import { LoggingService } from '../core/logging/LoggingService'; // Access via context\n\n/**\n * Implements the Capacities API Rune, allowing interaction with the Capacities API.\n * This is an example of an 'api-adapter' type Rune.\n */\nexport class CapacitiesRune {\n    private context: SystemContext;\n    private rune: Rune; // Reference to the Rune definition\n\n    constructor(context: SystemContext, rune: Rune) {\n        this.context = context;\n        this.rune = rune;\n        console.log("], ["typescript\n// src/runes/CapacitiesRune.ts\n// Capacities API Rune Implementation\n// Provides methods to interact with the Capacities API via the ApiProxy.\n// This Rune is an example of an 'api-adapter' type Rune.\n// --- Modified: Implement simulated methods for fetching and searching Capacities objects --\n\n\nimport { SystemContext, Rune } from '../interfaces';\n// import { ApiProxy } from '../proxies/apiProxy'; // Access via context\n// import { LoggingService } from '../core/logging/LoggingService'; // Access via context\n\n/**\n * Implements the Capacities API Rune, allowing interaction with the Capacities API.\n * This is an example of an 'api-adapter' type Rune.\n */\nexport class CapacitiesRune {\n    private context: SystemContext;\n    private rune: Rune; // Reference to the Rune definition\n\n    constructor(context: SystemContext, rune: Rune) {\n        this.context = context;\n        this.rune = rune;\n        console.log("]))[Rune];
CapacitiesRune;
initialized;
for ($; { rune: rune, : .name }.(__makeTemplateObject([");\n\n        // Validate configuration (e.g., check if API key is available)\n        if (!this.rune.configuration?.apiKey) {\n             console.warn("], [");\n\n        // Validate configuration (e.g., check if API key is available)\n        if (!this.rune.configuration?.apiKey) {\n             console.warn("]))[Rune]; CapacitiesRune)
    $;
{
    rune.name;
}
is;
missing;
API;
key in configuration.(__makeTemplateObject([");\n             this.context.loggingService?.logWarning("], [");\n             this.context.loggingService?.logWarning("]));
CapacitiesRune;
missing;
API;
key(__makeTemplateObject([", { runeId: rune.id });\n             // The ApiProxy will also check for the key, but warning here is good.\n        }\n         // Validate configuration (e.g., check if User ID is available)\n        if (!this.rune.configuration?.userId) {\n             console.warn("], [", { runeId: rune.id });\n             // The ApiProxy will also check for the key, but warning here is good.\n        }\n         // Validate configuration (e.g., check if User ID is available)\n        if (!this.rune.configuration?.userId) {\n             console.warn("]))[Rune];
CapacitiesRune;
$;
{
    rune.name;
}
is;
missing;
User;
ID in configuration.(__makeTemplateObject([");\n             this.context.loggingService?.logWarning("], [");\n             this.context.loggingService?.logWarning("]));
CapacitiesRune;
missing;
User;
ID(__makeTemplateObject([", { runeId: rune.id });\n             // The ApiProxy doesn't use this directly, but the Rune might need it for user-specific calls.\n        }\n    }\n\n    /**\n     * Makes a generic API call to the Capacities API.\n     * Corresponds to the 'callAPI' method in the manifest.\n     * @param params Parameters for the API call, e.g., { endpoint: string, method: string, data?: any, config?: any }. Required.\n     * @param userId The user ID executing the action. Required.\n     * @returns Promise<any> The API response data.\n     */\n    async callAPI(params: { endpoint: string, method: string, data?: any, config?: any }, userId: string): Promise<any> {\n        console.log("], [", { runeId: rune.id });\n             // The ApiProxy doesn't use this directly, but the Rune might need it for user-specific calls.\n        }\n    }\n\n    /**\n     * Makes a generic API call to the Capacities API.\n     * Corresponds to the 'callAPI' method in the manifest.\n     * @param params Parameters for the API call, e.g., { endpoint: string, method: string, data?: any, config?: any }. Required.\n     * @param userId The user ID executing the action. Required.\n     * @returns Promise<any> The API response data.\n     */\n    async callAPI(params: { endpoint: string, method: string, data?: any, config?: any }, userId: string): Promise<any> {\n        console.log("]))[Rune];
$;
{
    this.rune.name;
}
callAPI;
called;
by;
user;
$;
{
    userId;
}
with (params)
    : ", params);\n        this.context.loggingService?.logInfo(";
Executing;
rune;
action: $;
{
    this.rune.name;
}
callAPI(__makeTemplateObject([", { runeId: this.rune.id, userId, params: { endpoint: params?.endpoint, method: params?.method } });\n\n        if (!params?.endpoint || !params?.method) {\n            throw new Error('Endpoint and method are required for callAPI.');\n        }\n\n        try {\n            // Use ApiProxy to call the Capacities API endpoint\n            // ApiProxy handles authentication, rate limiting, etc.\n            const result = await this.context.apiProxy?.callCapacitiesAPI(params.endpoint, params.method as any, params.data, params.config);\n\n            console.log("], [", { runeId: this.rune.id, userId, params: { endpoint: params?.endpoint, method: params?.method } });\n\n        if (!params?.endpoint || !params?.method) {\n            throw new Error('Endpoint and method are required for callAPI.');\n        }\n\n        try {\n            // Use ApiProxy to call the Capacities API endpoint\n            // ApiProxy handles authentication, rate limiting, etc.\n            const result = await this.context.apiProxy?.callCapacitiesAPI(params.endpoint, params.method as any, params.data, params.config);\n\n            console.log("]))[Rune];
$;
{
    this.rune.name;
}
callAPI;
result: ", result);\n            return { status: 'success', data: result };\n\n        } catch (error: any) {\n            console.error("[Rune];
Error;
executing;
$;
{
    this.rune.name;
}
callAPI: ", error);\n            this.context.loggingService?.logError(";
Error;
executing;
rune;
action: $;
{
    this.rune.name;
}
callAPI(__makeTemplateObject([", { runeId: this.rune.id, userId, error: error.message });\n            throw new Error("], [", { runeId: this.rune.id, userId, error: error.message });\n            throw new Error("]));
Capacities;
API;
call;
failed: $;
{
    error.message;
}
");\n        }\n    }\n\n    // --- New: Simulate fetching objects/content from Capacities ---\n    /**\n     * Simulates fetching objects (knowledge entries) from the user's Capacities space.\n     * @param params Optional parameters for filtering or querying (e.g., { query?: string, limit?: number, type?: string }).\n     * @param userId The user ID. Required.\n     * @returns Promise<any[]> An array of simulated Capacities objects.\n     */\n    async getObjects(params?: { query?: string, limit?: number, type?: string }, userId?: string): Promise<any[]> {\n        console.log("[Rune];
$;
{
    this.rune.name;
}
getObjects;
called;
by;
user;
$;
{
    userId;
}
with (params)
    : ", params);\n        this.context.loggingService?.logInfo(";
Executing;
rune;
action: $;
{
    this.rune.name;
}
getObjects(__makeTemplateObject([", { runeId: this.rune.id, userId, params });\n\n        if (!userId) throw new Error('User ID is required.');\n        // In a real scenario, you'd use the Capacities API key from config and call the API.\n        // const apiKey = this.rune.configuration?.apiKey;\n        // if (!apiKey) throw new Error('Capacities API key is not configured.');\n        // const apiUserId = this.rune.configuration?.userId; // Capacities might use its own user ID\n\n        // Simulate fetching data\n        console.log('[Rune] Simulating fetching objects from Capacities...');\n        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call delay\n\n        // Simulate returning some dummy data based on the query\n        const dummyObjects = [\n            { id: 'cap-obj-1', type: 'Note', title: 'Meeting Notes 2024-06-25', content: 'Discussed project milestones and next steps.', tags: ['meeting', 'project'], createdAt: new Date().toISOString() },\n            { id: 'cap-obj-2', type: 'Article', title: 'Vercel AI SDK 3.1: ModelFusion joins the team', content: 'This release brings us one step closer to delivering a complete TypeScript framework for building AI applications. It is organized into three main parts: AI SDK Core, AI SDK UI, AI SDK RSC.', tags: ['AI', 'Vercel', 'SDK'], createdAt: new Date(Date.now() - 86400000).toISOString() }, // Example using the provided text\n            { id: 'cap-obj-3', type: 'Person', title: 'Lars Grammel', content: 'Software Engineer at Vercel, joined with ModelFusion.', tags: ['person', 'Vercel'], createdAt: new Date(Date.now() - 86400000).toISOString() },\n            { id: 'cap-obj-4', type: 'Project', title: 'Jun.Ai.Key Omega', content: 'Personal AI Operating System project.', tags: ['project', 'JunAiKey'], createdAt: new Date(Date.now() - 2592000000).toISOString() },\n            // Add more dummy data\n        ];\n\n        // Simulate filtering by query (simple title/content match)\n        const filteredObjects = params?.query\n            ? dummyObjects.filter(obj =>\n                obj.title.toLowerCase().includes(params.query!.toLowerCase()) ||\n                obj.content.toLowerCase().includes(params.query!.toLowerCase())\n              )\n            : dummyObjects;\n\n        // Simulate filtering by type\n        const typeFilteredObjects = params?.type\n            ? filteredObjects.filter(obj => obj.type === params.type)\n            : filteredObjects;\n\n        // Simulate limiting results\n        const limitedObjects = params?.limit\n            ? typeFilteredObjects.slice(0, params.limit)\n            : typeFilteredObjects;\n\n\n        console.log("], [", { runeId: this.rune.id, userId, params });\n\n        if (!userId) throw new Error('User ID is required.');\n        // In a real scenario, you'd use the Capacities API key from config and call the API.\n        // const apiKey = this.rune.configuration?.apiKey;\n        // if (!apiKey) throw new Error('Capacities API key is not configured.');\n        // const apiUserId = this.rune.configuration?.userId; // Capacities might use its own user ID\n\n        // Simulate fetching data\n        console.log('[Rune] Simulating fetching objects from Capacities...');\n        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call delay\n\n        // Simulate returning some dummy data based on the query\n        const dummyObjects = [\n            { id: 'cap-obj-1', type: 'Note', title: 'Meeting Notes 2024-06-25', content: 'Discussed project milestones and next steps.', tags: ['meeting', 'project'], createdAt: new Date().toISOString() },\n            { id: 'cap-obj-2', type: 'Article', title: 'Vercel AI SDK 3.1: ModelFusion joins the team', content: 'This release brings us one step closer to delivering a complete TypeScript framework for building AI applications. It is organized into three main parts: AI SDK Core, AI SDK UI, AI SDK RSC.', tags: ['AI', 'Vercel', 'SDK'], createdAt: new Date(Date.now() - 86400000).toISOString() }, // Example using the provided text\n            { id: 'cap-obj-3', type: 'Person', title: 'Lars Grammel', content: 'Software Engineer at Vercel, joined with ModelFusion.', tags: ['person', 'Vercel'], createdAt: new Date(Date.now() - 86400000).toISOString() },\n            { id: 'cap-obj-4', type: 'Project', title: 'Jun.Ai.Key Omega', content: 'Personal AI Operating System project.', tags: ['project', 'JunAiKey'], createdAt: new Date(Date.now() - 2592000000).toISOString() },\n            // Add more dummy data\n        ];\n\n        // Simulate filtering by query (simple title/content match)\n        const filteredObjects = params?.query\n            ? dummyObjects.filter(obj =>\n                obj.title.toLowerCase().includes(params.query!.toLowerCase()) ||\n                obj.content.toLowerCase().includes(params.query!.toLowerCase())\n              )\n            : dummyObjects;\n\n        // Simulate filtering by type\n        const typeFilteredObjects = params?.type\n            ? filteredObjects.filter(obj => obj.type === params.type)\n            : filteredObjects;\n\n        // Simulate limiting results\n        const limitedObjects = params?.limit\n            ? typeFilteredObjects.slice(0, params.limit)\n            : typeFilteredObjects;\n\n\n        console.log("]))[Rune];
Simulating;
getObjects;
successful.Found;
$;
{
    limitedObjects.length;
}
objects.(__makeTemplateObject([");\n        return limitedObjects; // Return simulated data\n\n    }\n    // --- End New ---\n\n    // --- New: Simulate searching objects in Capacities ---\n    /**\n     * Simulates searching objects (knowledge entries) in the user's Capacities space.\n     * This might use a different API endpoint or method than getObjects in a real API.\n     * For simulation, it's similar to getObjects with a query.\n     * @param params Parameters: { query: string, limit?: number, type?: string }. Required query.\n     * @param userId The user ID. Required.\n     * @returns Promise<any[]> An array of simulated Capacities objects matching the query.\n     */\n    async searchObjects(params: { query: string, limit?: number, type?: string }, userId?: string): Promise<any[]> {\n        console.log("], [");\n        return limitedObjects; // Return simulated data\n\n    }\n    // --- End New ---\n\n    // --- New: Simulate searching objects in Capacities ---\n    /**\n     * Simulates searching objects (knowledge entries) in the user's Capacities space.\n     * This might use a different API endpoint or method than getObjects in a real API.\n     * For simulation, it's similar to getObjects with a query.\n     * @param params Parameters: { query: string, limit?: number, type?: string }. Required query.\n     * @param userId The user ID. Required.\n     * @returns Promise<any[]> An array of simulated Capacities objects matching the query.\n     */\n    async searchObjects(params: { query: string, limit?: number, type?: string }, userId?: string): Promise<any[]> {\n        console.log("]))[Rune];
$;
{
    this.rune.name;
}
searchObjects;
called;
by;
user;
$;
{
    userId;
}
with (params)
    : ", params);\n        this.context.loggingService?.logInfo(";
Executing;
rune;
action: $;
{
    this.rune.name;
}
searchObjects(__makeTemplateObject([", { runeId: this.rune.id, userId, params });\n\n        if (!userId) throw new Error('User ID is required.');\n        if (!params?.query) throw new Error('query parameter is required for searchObjects.');\n\n        // Simulate searching data (reusing getObjects simulation logic with query)\n        return this.getObjects(params, userId);\n    }\n    // --- End New ---\n\n\n    /**\n     * Method to update configuration (optional, but good practice for API keys).\n     * @param config The new configuration object.\n     */\n    updateConfiguration(config: any): void {\n        console.log("], [", { runeId: this.rune.id, userId, params });\n\n        if (!userId) throw new Error('User ID is required.');\n        if (!params?.query) throw new Error('query parameter is required for searchObjects.');\n\n        // Simulate searching data (reusing getObjects simulation logic with query)\n        return this.getObjects(params, userId);\n    }\n    // --- End New ---\n\n\n    /**\n     * Method to update configuration (optional, but good practice for API keys).\n     * @param config The new configuration object.\n     */\n    updateConfiguration(config: any): void {\n        console.log("]))[Rune];
$;
{
    this.rune.name;
}
configuration;
updated: ", config);\n        this.rune.configuration = config; // Update the configuration on the rune object\n        // TODO: Re-initialize any internal clients if configuration changes affect them\n    }\n}\n"(__makeTemplateObject([""], [""]));
