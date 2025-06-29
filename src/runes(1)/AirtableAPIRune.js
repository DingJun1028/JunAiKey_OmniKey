var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
""(__makeTemplateObject(["typescript\n// src/runes/AirtableAPIRune.ts\n// Airtable API Rune Implementation\n// Provides methods to interact with the Airtable API via the ApiProxy.\n// This Rune is an example of an 'api-adapter' type Rune.\n\nimport { SystemContext, Rune } from '../interfaces';\n// import { ApiProxy } from '../proxies/apiProxy'; // Access via context\n// import { LoggingService } from '../core/logging/LoggingService'; // Access via context\n\n/**\n * Implements the Airtable API Rune, allowing interaction with the Airtable API.\n * This is an example of an 'api-adapter' type Rune.\n */\nexport class AirtableAPIRune {\n    private context: SystemContext;\n    private rune: Rune; // Reference to the Rune definition\n\n    constructor(context: SystemContext, rune: Rune) {\n        this.context = context;\n        this.rune = rune;\n        console.log("], ["typescript\n// src/runes/AirtableAPIRune.ts\n// Airtable API Rune Implementation\n// Provides methods to interact with the Airtable API via the ApiProxy.\n// This Rune is an example of an 'api-adapter' type Rune.\n\nimport { SystemContext, Rune } from '../interfaces';\n// import { ApiProxy } from '../proxies/apiProxy'; // Access via context\n// import { LoggingService } from '../core/logging/LoggingService'; // Access via context\n\n/**\n * Implements the Airtable API Rune, allowing interaction with the Airtable API.\n * This is an example of an 'api-adapter' type Rune.\n */\nexport class AirtableAPIRune {\n    private context: SystemContext;\n    private rune: Rune; // Reference to the Rune definition\n\n    constructor(context: SystemContext, rune: Rune) {\n        this.context = context;\n        this.rune = rune;\n        console.log("]))[Rune];
AirtableAPIRune;
initialized;
for ($; { rune: rune, : .name }.(__makeTemplateObject([");\n\n        // Validate configuration (e.g., check if API key is available)\n        if (!this.rune.configuration?.apiKey) {\n             console.warn("], [");\n\n        // Validate configuration (e.g., check if API key is available)\n        if (!this.rune.configuration?.apiKey) {\n             console.warn("]))[Rune]; AirtableAPIRune)
    $;
{
    this.rune.name;
}
is;
missing;
API;
key in configuration.(__makeTemplateObject([");\n             this.context.loggingService?.logWarning("], [");\n             this.context.loggingService?.logWarning("]));
AirtableAPIRune;
missing;
API;
key(__makeTemplateObject([", { runeId: this.rune.id });\n             // The ApiProxy will also check for the key, but warning here is good.\n        }\n    }\n\n    /**\n     * Makes a generic API call to the Airtable API.\n     * Corresponds to the 'callAPI' method in the manifest.\n     * @param params Parameters for the API call, e.g., { endpoint: string, method: string, data?: any, config?: any }. Required.\n     * @param userId The user ID executing the action. Required.\n     * @returns Promise<any> The API response data.\n     */\n    async callAPI(params: { endpoint: string, method: string, data?: any, config?: any }, userId: string): Promise<any> {\n        console.log("], [", { runeId: this.rune.id });\n             // The ApiProxy will also check for the key, but warning here is good.\n        }\n    }\n\n    /**\n     * Makes a generic API call to the Airtable API.\n     * Corresponds to the 'callAPI' method in the manifest.\n     * @param params Parameters for the API call, e.g., { endpoint: string, method: string, data?: any, config?: any }. Required.\n     * @param userId The user ID executing the action. Required.\n     * @returns Promise<any> The API response data.\n     */\n    async callAPI(params: { endpoint: string, method: string, data?: any, config?: any }, userId: string): Promise<any> {\n        console.log("]))[Rune];
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
callAPI(__makeTemplateObject([", { runeId: this.rune.id, userId, params: { endpoint: params?.endpoint, method: params?.method } });\n\n        if (!params?.endpoint || !params?.method) {\n            throw new Error('Endpoint and method are required for callAPI.');\n        }\n\n        try {\n            // Use ApiProxy to call the Airtable API endpoint\n            // ApiProxy handles authentication, rate limiting, etc.\n            const result = await this.context.apiProxy?.callAirtableAPI(params.endpoint, params.method as any, params.data, params.config);\n\n            console.log("], [", { runeId: this.rune.id, userId, params: { endpoint: params?.endpoint, method: params?.method } });\n\n        if (!params?.endpoint || !params?.method) {\n            throw new Error('Endpoint and method are required for callAPI.');\n        }\n\n        try {\n            // Use ApiProxy to call the Airtable API endpoint\n            // ApiProxy handles authentication, rate limiting, etc.\n            const result = await this.context.apiProxy?.callAirtableAPI(params.endpoint, params.method as any, params.data, params.config);\n\n            console.log("]))[Rune];
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
Airtable;
API;
call;
failed: $;
{
    error.message;
}
");\n        }\n    }\n\n    // TODO: Add more specific methods based on Airtable API capabilities if needed\n    // Example:\n    // async listRecords(params: { baseId: string, tableIdOrName: string, view?: string }, userId: string): Promise<any> {\n    //     console.log("[Rune];
$;
{
    this.rune.name;
}
listRecords;
called;
by;
user;
$;
{
    userId;
}
");\n    //     this.context.loggingService?.logInfo(";
Executing;
rune;
action: $;
{
    this.rune.name;
}
listRecords(__makeTemplateObject([", { runeId: this.rune.id, userId, params });\n    //     if (!params?.baseId || !params?.tableIdOrName) {\n    //          throw new Error('baseId and tableIdOrName are required for listRecords.');\n    //     }\n    //     try {\n    //         const endpoint = "], [", { runeId: this.rune.id, userId, params });\n    //     if (!params?.baseId || !params?.tableIdOrName) {\n    //          throw new Error('baseId and tableIdOrName are required for listRecords.');\n    //     }\n    //     try {\n    //         const endpoint = "])) / $;
{
    params.baseId;
}
/${params.tableIdOrName}`;
//         const result = await this.context.apiProxy?.callAirtableAPI(endpoint, 'GET', undefined, { params: { view: params.view } });
//         return { status: 'success', data: result };
//     } catch (error: any) {
//         console.error(`[Rune] Error executing ${this.rune.name}.listRecords:`, error);
//         this.context.loggingService?.logError(`Error executing rune action: ${this.rune.name}.listRecords`, { runeId: this.rune.id, userId, error: error.message });
//         throw new Error(`Airtable API call failed: ${error.message}`);
//     }
// }
/**
 * Method to update configuration (optional, but good practice for API keys).
 * @param config The new configuration object.
 */
updateConfiguration(config, any);
void {
    console: console,
    : .log("[Rune] ".concat(this.rune.name, " configuration updated:"), config),
    this: .rune.configuration = config
};
""(__makeTemplateObject([""], [""]));
