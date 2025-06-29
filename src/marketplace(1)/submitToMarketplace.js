var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
""(__makeTemplateObject(["typescript\n// src/marketplace/submitToMarketplace.ts\n// Course Marketplace - Marketplace Submitter\\\n// Simulates submitting a generated course syllabus/product page to external platforms.\\\n\\\nimport { SystemContext } from '../interfaces';\\\nimport { Syllabus } from './generateSyllabus'; // Import Syllabus type\\\n// import { NotionAPI } from 'notion-client'; // Hypothetical Notion API client\\\n// import { StripeAPI } from 'stripe'; // Hypothetical Stripe API client\\\nimport { BaseAgent, AgentMessage, AgentResponse } from '../agents/BaseAgent'; // Import BaseAgent types\\\n\\\n// --- Modified: Extend BaseAgent ---\\\nexport class MarketplaceSubmitter extends BaseAgent { // Extend BaseAgent\\\n    private context: SystemContext;\\\\\\\n    // private notionClient: NotionAPI; // Hypothetical\\\\\\\n    // private stripeClient: StripeAPI; // Hypothetical\\\\\\\n\\\\\\n    constructor(context: SystemContext) {\\\\\\n        // --- Modified: Call super constructor with agent name ---\\\\\\n        super('marketplace_submitter', context); // Call BaseAgent constructor with agent name 'marketplace_submitter'\\\\\\n        // --- End Modified ---\\\\\\n        this.context = context;\\\\\\n        console.log('MarketplaceSubmitter initialized.');\\\\\\n        // TODO: Initialize API clients for Notion, Stripe, etc. using credentials from SecurityService\\\\\\n        // const notionKey = await context.securityService.retrieveSensitiveData(userId, 'notion_api_key');\\\\\\n        // this.notionClient = new NotionAPI({ auth: notionKey });\\\\\\n        // const stripeKey = await context.securityService.retrieveSensitiveData(userId, 'stripe_api_key');\\\\\\n        // this.stripeClient = new StripeAPI(stripeKey);\\\\\\n    }\\\\\\n\\\\\\n    /**\\\\\\n     * Handles messages directed to the Marketplace Submitter Agent.\\\\\\n     * @param message The message to handle. Expected type: 'submit_syllabus_to_notion' or 'create_stripe_product'.\\\\\\n     * @returns Promise<AgentResponse> The response containing the result or error.\\\\\\n     */\\\\\\n    protected async handleMessage(message: AgentMessage): Promise<AgentResponse> {\\\\\\\\\\\\\\n        console.log("], ["typescript\n// src/marketplace/submitToMarketplace.ts\n// Course Marketplace - Marketplace Submitter\\\\\\n// Simulates submitting a generated course syllabus/product page to external platforms.\\\\\\n\\\\\\nimport { SystemContext } from '../interfaces';\\\\\\nimport { Syllabus } from './generateSyllabus'; // Import Syllabus type\\\\\\n// import { NotionAPI } from 'notion-client'; // Hypothetical Notion API client\\\\\\n// import { StripeAPI } from 'stripe'; // Hypothetical Stripe API client\\\\\\nimport { BaseAgent, AgentMessage, AgentResponse } from '../agents/BaseAgent'; // Import BaseAgent types\\\\\\n\\\\\\n// --- Modified: Extend BaseAgent ---\\\\\\nexport class MarketplaceSubmitter extends BaseAgent { // Extend BaseAgent\\\\\\n    private context: SystemContext;\\\\\\\\\\\\\\n    // private notionClient: NotionAPI; // Hypothetical\\\\\\\\\\\\\\n    // private stripeClient: StripeAPI; // Hypothetical\\\\\\\\\\\\\\n\\\\\\\\\\\\n    constructor(context: SystemContext) {\\\\\\\\\\\\n        // --- Modified: Call super constructor with agent name ---\\\\\\\\\\\\n        super('marketplace_submitter', context); // Call BaseAgent constructor with agent name 'marketplace_submitter'\\\\\\\\\\\\n        // --- End Modified ---\\\\\\\\\\\\n        this.context = context;\\\\\\\\\\\\n        console.log('MarketplaceSubmitter initialized.');\\\\\\\\\\\\n        // TODO: Initialize API clients for Notion, Stripe, etc. using credentials from SecurityService\\\\\\\\\\\\n        // const notionKey = await context.securityService.retrieveSensitiveData(userId, 'notion_api_key');\\\\\\\\\\\\n        // this.notionClient = new NotionAPI({ auth: notionKey });\\\\\\\\\\\\n        // const stripeKey = await context.securityService.retrieveSensitiveData(userId, 'stripe_api_key');\\\\\\\\\\\\n        // this.stripeClient = new StripeAPI(stripeKey);\\\\\\\\\\\\n    }\\\\\\\\\\\\n\\\\\\\\\\\\n    /**\\\\\\\\\\\\n     * Handles messages directed to the Marketplace Submitter Agent.\\\\\\\\\\\\n     * @param message The message to handle. Expected type: 'submit_syllabus_to_notion' or 'create_stripe_product'.\\\\\\\\\\\\n     * @returns Promise<AgentResponse> The response containing the result or error.\\\\\\\\\\\\n     */\\\\\\\\\\\\n    protected async handleMessage(message: AgentMessage): Promise<AgentResponse> {\\\\\\\\\\\\\\\\\\\\\\\\\\\\n        console.log("]))[MarketplaceSubmitter];
Handling;
message: $;
{
    message.type;
}
(Correlation);
ID: $;
{
    message.correlationId || 'N/A';
}
");\\\\\\\\\\\\\\n\\\\\\\\\\\\n        const userId = this.context.currentUser?.id;\\\\\\\\\\\\\\n        if (!userId) {\\\\\\\\\\\\\\n             return { success: false, error: 'User not authenticated.' };\\\\\\\\\\\\\\n        }\\\\\\\\\\\\n\\\\\\\\\\\\n        try {\\\\\\\\\\\\\\n            let result: any;\\\\\\\\\\\\\\n            switch (message.type) {\\\\\\\\\\\\\\n                case 'submit_syllabus_to_notion':\\\\\\\\\\\\\\n                    // Payload: { syllabus: Syllabus, notionDatabaseId: string }\\\\\\\\\\\\\\n                    if (!message.payload?.syllabus || !message.payload?.notionDatabaseId) {\\\\\\\\\\\\\\n                         throw new Error('Syllabus and Notion database ID are required.');\\\\\\\\\\\\\\n                    }\\\\\\\\\\\\\\n                    // Delegate to submitToNotion method\\\\\\\\\\\\\\n                    result = await this.submitToNotion(userId, message.payload.syllabus, message.payload.notionDatabaseId);\\\\\\\\\\\\\\n                    if (!result) throw new Error('Failed to submit syllabus to Notion.');\\\\\\\\\\\\\\\n                    return { success: true, data: result };\\\\\\\\\\\\\\n\\\\\\\\\\\\n                case 'create_stripe_product':\\\\\\\\\\\\\\n                    // Payload: { syllabus: Syllabus, price: number }\\\\\\\\\\\\\\n                    if (!message.payload?.syllabus || message.payload?.price === undefined || message.payload?.price < 0) {\\\\\\\\\\\\\\n                         throw new Error('Syllabus and valid price are required.');\\\\\\\\\\\\\\\n                    }\\\\\\\\\\\\\\n                    // Delegate to createStripeProduct method\\\\\\\\\\\\\\n                    result = await this.createStripeProduct(userId, message.payload.syllabus, message.payload.price);\\\\\\\\\\\\\\\n                    if (!result) throw new Error('Failed to create Stripe product.');\\\\\\\\\\\\\\\n                    return { success: true, data: result };\\\\\\\\\\\\\\n\\\\\\\\\\\\n                // TODO: Add cases for submitting to other platforms\\\\\\\\\\\\\\n\\\\\\\\\\\\n                default:\\\\\\\\\\\\\\n                    console.warn("[MarketplaceSubmitter];
Unknown;
message;
type: $;
{
    message.type;
}
");\\\\\\\\\\\\\\\n                    return { success: false, error: ";
Unknown;
message;
type;
for (MarketplaceSubmitter; ; )
    : $;
{
    message.type;
}
" };\\\\\\\\\\\\\\\n            }\\\\\\\\\\\\n        } catch (error: any) {\\\\\\\\\\\\\\n            console.error("[MarketplaceSubmitter];
Error;
handling;
message;
$;
{
    message.type;
}
", error);\\\\\\\\\\\\\\\n            return { success: false, error: error.message || 'An error occurred in MarketplaceSubmitter.' };\\\\\\\\\\\\\\\n        }\\\\\\\\\\\\n    }\\\\\\\\\\\\n\\\\\\\\\\\\n    /**\\\\\\\\\\\\n     * Simulates submitting a course syllabus to Notion.\\\\\\\\\\\\n     * Creates a new page or database entry in Notion with the syllabus content.\\\\\\\\\\\\\\n     * @param userId The user ID. Required.\\\\\\\\\\\\\\n     * @param syllabus The syllabus to submit. Required.\\\\\\\\\\\\\\n     * @param notionDatabaseId The ID of the Notion database to submit to. Required.\\\\\\\\\\\\\\n     * @returns Promise<any> Simulated result from Notion API.\\\\\\\\\\\\\\n     */\\\\\\\\\\\\n    async submitToNotion(userId: string, syllabus: Syllabus, notionDatabaseId: string): Promise<any> {\\\\\\\\\\\\\\n        console.log("[MarketplaceSubmitter];
Simulating;
submitting;
syllabus;
to;
Notion;
for (user; ; )
    : $;
{
    userId;
}
database: $;
{
    notionDatabaseId;
}
");\\\\\\\\\\\\\\n        this.context.loggingService?.logInfo('Attempting to submit syllabus to Notion', { userId, syllabusTitle: syllabus.title, notionDatabaseId });\\\\\\\\\\\\\\n\\\\\\\\\\\\n        if (!userId || !syllabus || !notionDatabaseId) {\\\\\\\\\\\\\\n            console.error('[MarketplaceSubmitter] Cannot submit to Notion: Missing required fields.');\\\\\\\\\\\\\\\n            throw new Error('User ID, syllabus, and Notion database ID are required.');\\\\\\\\\\\\\\\n        }\\\\\\\\\\\\n\\\\\\\\\\\\n        // --- Modified: Delegate Notion API call to RuneEngraftingAgent ---\\\\\\\\\\\\\\n        if (!this.context.agentFactory?.getAgent('rune_engrafting')) {\\\\\\\\\\\\\\n             throw new Error('RuneEngraftingAgent not available for Notion API calls.');\\\\\\\\\\\\\\\n        }\\\\\\\\\\\\n        console.log('[MarketplaceSubmitter] Sending execute_rune_action message to RuneEngraftingAgent for Notion...');\\\\\\\\\\\\\\n\\\\\\\\\\\\n        try {\\\\\\\\\\\\\\n            // Call the executeRuneAction method on the RuneEngraftingAgent\\\\\\\\\\\\\\n            // Assuming a 'notion-rune' exists with a 'createDatabaseEntry' action\\\\\\\\\\\\\\n            const runeResponse = await this.requestAgent(\\\\\\n                'rune_engrafting', // Target the RuneEngrafting Agent\\\\\\n                'execute_rune_action', // Message type for RuneEngrafting Agent\\\\\\\n                {\\\n                    runeId: 'notion-rune', // The specific Rune ID for Notion\\\n                    action: 'createDatabaseEntry', // Hypothetical action name\\\n                    params: { databaseId: notionDatabaseId, content: syllabus }, // Pass database ID and syllabus content\\\n                },\\\n                20000 // Timeout for rune execution\\\n            );\\\\\n            if (!runeResponse.success || !runeResponse.data) {\\                throw new Error(runeResponse.error || 'Failed to execute Notion Rune action.');\\            }\\\\\n            const notionResult = runeResponse.data; // Assuming rune returns the result from Notion API\\\\\n            console.log('[MarketplaceSubmitter] Notion submission successful:', notionResult);\\            this.context.loggingService?.logInfo('Notion submission successful', { userId, syllabusTitle: syllabus.title, notionDatabaseId, notionResult });\\\\\n            // TODO: Publish an event indicating successful submission to Notion\\            // this.context.eventBus?.publish('syllabus_submitted_to_notion', { userId, syllabusId: syllabus.id, notionPageId: notionResult.id, notionPageUrl: notionResult.url }, userId);\\\\\n            return notionResult;\\\\\n        } catch (error: any) {\\            console.error('[MarketplaceSubmitter] Error submitting syllabus to Notion:', error);\\            this.context.loggingService?.logError('Failed to submit syllabus to Notion', { userId, syllabusTitle: syllabus.title, notionDatabaseId, error: error.message });\\            throw new Error(";
Failed;
to;
submit;
syllabus;
to;
Notion: $;
{
    error.message;
}
");\\        }\\        // --- End Modified ---\\    }\\\\\n    /**\\\n     * Simulates creating a product and checkout link on Stripe.\\\n     * @param userId The user ID. Required.\\\n     * @param syllabus The syllabus/course details. Required.\\\n     * @param price The price in cents. Required.\\\n     * @returns Promise<any> Simulated result from Stripe API (e.g., checkout URL).\\\n     */\\    async createStripeProduct(userId: string, syllabus: Syllabus, price: number): Promise<any> {\\        console.log("[MarketplaceSubmitter];
Simulating;
creating;
Stripe;
product;
for (user; ; )
    : $;
{
    userId;
}
course: $;
{
    syllabus.title;
}
price: $;
{
    price;
}
");\\        this.context.loggingService?.logInfo('Attempting to create Stripe product', { userId, syllabusTitle: syllabus.title, price });\\\\\n        if (!userId || !syllabus || price === undefined || price < 0) {\\            console.error('[MarketplaceSubmitter] Cannot create Stripe product: Missing required fields or invalid price.');\\            throw new Error('User ID, syllabus, and valid price are required.');\\        }\\\n\\\n        // --- Modified: Delegate Stripe API calls to RuneEngraftingAgent ---\\        if (!this.context.agentFactory?.getAgent('rune_engrafting')) {\\             throw new Error('RuneEngraftingAgent not available for Stripe API calls.');\\        }\\        console.log('[MarketplaceSubmitter] Sending execute_rune_action message to RuneEngraftingAgent for Stripe...');\\\\\n        try {\\            // Call the executeRuneAction method on the RuneEngraftingAgent\\            // Assuming a 'stripe-rune' exists with a 'createProduct' action\\            const runeResponse = await this.requestAgent(\\\n                'rune_engrafting', // Target the RuneEngrafting Agent\\\n                'execute_rune_action', // Message type for RuneEngrafting Agent\\                {\\\n                    runeId: 'stripe-rune', // The specific Rune ID for Stripe\\\n                    action: 'createProduct', // Hypothetical action name\\\n                    params: { name: syllabus.title, description: syllabus.description, price: price }, // Pass product details\\                },\\\n                20000 // Timeout for rune execution\\            );\\\\\n            if (!runeResponse.success || !runeResponse.data) {\\                throw new Error(runeResponse.error || 'Failed to execute Stripe Rune action.');\\            }\\\\\n            const stripeResult = runeResponse.data; // Assuming rune returns the result from Stripe API (e.g., product ID, price ID, checkout URL)\\\\\n            console.log('[MarketplaceSubmitter] Stripe product creation successful:', stripeResult);\\            this.context.loggingService?.logInfo('Stripe product creation successful', { userId, syllabusTitle: syllabus.title, price, stripeResult });\\\\\n            // TODO: Publish an event indicating successful Stripe product creation\\            // this.context.eventBus?.publish('stripe_product_created', { userId, syllabusId: syllabus.id, productId: stripeResult.productId, checkoutUrl: stripeResult.checkoutUrl }, userId);\\\\\n            return stripeResult;\\\\\n        } catch (error: any) {\\            console.error('[MarketplaceSubmitter] Error creating Stripe product:', error);\\            this.context.loggingService?.logError('Failed to create Stripe product', { userId, syllabusTitle: syllabus.title, price, error: error.message });\\            throw new Error(";
Failed;
to;
create;
Stripe;
product: $;
{
    error.message;
}
");\\        }\\        // --- End Modified ---\\    }\\\\\n    // TODO: Implement methods to send messages to other agents if needed\\    // TODO: Implement methods to submit to other platforms (e.g., personal website via API, Gumroad)\\}\\"(__makeTemplateObject([""], [""]));
