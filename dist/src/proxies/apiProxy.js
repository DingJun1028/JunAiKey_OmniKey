"use strict";
`` `typescript
// src/proxies/apiProxy.ts
// API Proxy - Core Module
// Manages all external API interactions, handling authentication, rate limiting, and error handling.
// Acts as a secure gateway for Runes and other modules to access external services.
// Design Principle: Provides a standardized, secure, and observable layer for external communication.

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, Method } from 'axios';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { SystemContext } from '../interfaces'; // Assuming SystemContext interface exists
// import { CachingService } from '../core/caching/CachingService'; // Dependency
// import { LoggingService } from '../core/logging/LoggingService'; // Dependency


// Define types for API configurations
interface ApiConfig {
    baseUrl: string;
    apiKey?: string; // API key for authentication
    authHeader?: string; // Header name for API key (e.g., 'Authorization')
    authScheme?: string; // Auth scheme (e.g., 'Bearer')
    rateLimit?: { // Optional rate limiting configuration
        limit: number; // Number of requests
        interval: number; // Time window in milliseconds
    };
    // Add other configuration options (e.g., timeout, retries)
}

// Define configurations for known external APIs
const apiConfigurations: { [key: string]: ApiConfig } = {
    // Example: LiteLLM API (used by WisdomSecretArt)
    litellm: {
        baseUrl: import.meta.env.VITE_LITELLM_API_ENDPOINT || process.env.LITELLM_API_ENDPOINT || 'https://api.litellm.ai', // Base URL
        // API key might be needed depending on LiteLLM setup.
        // If LiteLLM uses OpenAI key, you might need to pass it via headers.
        // For simplicity, assume LiteLLM endpoint handles auth or uses a key passed in headers/body.
        // apiKey: process.env.OPENAI_API_KEY, // Example if LiteLLM uses OpenAI key
        // authHeader: 'Authorization',
        // authScheme: 'Bearer',
        rateLimit: { limit: 100, interval: 60000 }, // Example: 100 requests per minute
    },
    // Example: Boost.Space API (used by Boost.Space Rune)
    boostspace: {
        baseUrl: 'https://api.boost.space/v1', // Example Base URL based on docs
        apiKey: import.meta.env.VITE_BOOST_API_KEY || process.env.BOOST_API_KEY,
        authHeader: 'Authorization',
        authScheme: 'Bearer',
        rateLimit: { limit: 50, interval: 60000 }, // Example rate limit
    },
    // Example: Capacities API (used by Capacities Rune)
    capacities: {
        baseUrl: 'https://api.capacities.io', // Example Base URL based on docs
        apiKey: import.meta.env.VITE_CAPACITIES_API_KEY || process.env.CAPACITIES_API_KEY,
        authHeader: 'Authorization',
        authScheme: 'Bearer',
        rateLimit: { limit: 60, interval: 60000 }, // Example rate limit
    },
    // Example: Infoflow API (used by Infoflow Rune)
    infoflow: {
        baseUrl: 'https://api.infoflow.io', // Example Base URL
        // apiKey: process.env.INFOFLOW_API_KEY, // Assuming API key auth
        // authHeader: 'X-Api-Key',
        rateLimit: { limit: 30, interval: 60000 }, // Example rate limit
    },
    // Example: Aitable.ai API (used by Aitable.ai Rune)
    aitableai: { // Note: This is Aitable.ai, not Airtable
        baseUrl: 'https://api.aitable.ai/v1', // Example Base URL based on docs
        apiKey: import.meta.env.VITE_AITABLE_API_KEY || process.env.AITABLE_API_KEY,
        authHeader: 'Authorization',
        authScheme: 'Bearer',
        rateLimit: { limit: 100, interval: 60000 }, // Example rate limit
    },
    // Example: UpNote API (Placeholder - UpNote currently has no public API)
    upnote: {
        baseUrl: 'https://api.upnote.com', // Hypothetical Base URL
        // apiKey: process.env.UPNOTE_API_KEY,
        // authHeader: 'X-Api-Key',
        rateLimit: { limit: 10, interval: 60000 }, // Example rate limit
    },
    // Example: Straico API (used by Straico Rune)
    straico: {
        baseUrl: import.meta.env.VITE_STRAICO_BASE_URL || process.env.STRAICO_BASE_URL || 'https://api.straico.com/v0', // Example Base URL based on docs
        apiKey: import.meta.env.VITE_STRAICO_API_KEY || process.env.STRAICO_API_KEY,
        authHeader: 'Authorization', // Assuming Bearer Token based on common practice
        authScheme: 'Bearer',
        rateLimit: { limit: 50, interval: 60000 }, // Example rate limit
    },
    // Example: Scripting.app Webhook (used by Scripting.app Rune)
    scriptingapp_webhook: {
        // Webhooks don't have a single base URL in the same way,
        // the full URL is provided when triggering.
        // This config might hold a base webhook URL or just indicate the type.
        baseUrl: 'https://hook.eu2.make.com', // Example Make.com webhook base URL
        // Webhook security is often via a unique URL or signature, not a standard API key.
        // apiKey: process.env.SCRIPTING_APP_WEBHOOK_SECRET, // Example secret for signature verification
        // authHeader: 'X-Webhook-Signature', // Example signature header
        rateLimit: { limit: 10, interval: 10000 }, // Example rate limit: 10 requests per 10 seconds
    },
     // Example: Make.com Webhook (used by Make.com Rune)
    makecom_webhook: {
        baseUrl: 'https://hook.eu2.make.com', // Example Make.com webhook base URL
        // Similar to Scripting.app, auth is via URL or signature.
        rateLimit: { limit: 10, interval: 10000 }, // Example rate limit
    },
    // Example: GitHub API (used by GitHub Rune)
    github: {
        baseUrl: 'https://api.github.com',
        // GitHub uses Personal Access Tokens (PAT) or OAuth tokens.
        // This should be handled securely, likely per user.
        // For MVP, we might use a single PAT from env vars, but this is insecure.
        apiKey: import.meta.env.VITE_GITHUB_PAT || process.env.GITHUB_PAT, // Insecure for client-side MVP
        authHeader: 'Authorization',
        authScheme: 'Bearer',
        rateLimit: { limit: 5000, interval: 3600000 }, // GitHub's rate limit is high
    },
    // --- New API Configurations for Requested Integrations ---
    mymemoai: {
        baseUrl: 'https://api.mymemo.ai', // Hypothetical Base URL based on docs
        apiKey: import.meta.env.VITE_MYMEMOAI_API_KEY || process.env.MYMEMOAI_API_KEY,
        authHeader: 'X-Api-Key', // Assuming X-Api-Key based on common practice
        rateLimit: { limit: 50, interval: 60000 }, // Example rate limit
    },
    taskade: {
        baseUrl: 'https://openapi.taskade.com/v1', // Example Base URL based on docs
        apiKey: import.meta.env.VITE_TASKADE_API_KEY || process.env.TASKADE_API_KEY,
        authHeader: 'Authorization',
        authScheme: 'Bearer',
        rateLimit: { limit: 100, interval: 60000 }, // Example rate limit
    },
    // --- Add Blue.cc API Configuration ---
    bluecc: {
        baseUrl: 'https://api.blue.cc', // Example Base URL based on docs
        // Assuming API key authentication based on typical API patterns
        // The actual auth method (API key, OAuth, etc.) needs to be confirmed from docs.
        // For now, assume API key in Authorization: Bearer header.
        apiKey: import.meta.env.VITE_BLUECC_API_KEY || process.env.BLUECC_API_KEY,
        authHeader: 'Authorization',
        authScheme: 'Bearer', // Or 'X-Api-Key', etc. based on docs
        rateLimit: { limit: 100, interval: 60000 }, // Example rate limit
    },
    // --- Add Bind AI API Configuration ---
    bindai: {
        baseUrl: 'https://api.bind.ai', // Hypothetical Base URL for Bind AI
        // Assuming API key authentication
        apiKey: import.meta.env.VITE_BINDAI_API_KEY || process.env.BINDAI_API_KEY,
        authHeader: 'X-API-KEY', // Assuming X-API-KEY header
        rateLimit: { limit: 100, interval: 60000 }, // Example rate limit
    },
    // --- Add NoteX API Configuration (Placeholder) ---
    notex: {
        baseUrl: 'https://api.notex.example.com', // Hypothetical Base URL for NoteX
        // Assuming API key authentication
        apiKey: import.meta.env.VITE_NOTEX_API_KEY || process.env.NOTEX_API_KEY,
        authHeader: 'X-Api-Key',
        rateLimit: { limit: 50, interval: 60000 }, // Example rate limit
    },
    // --- Add Google Drive API Configuration (Placeholder) ---
    googledrive: {
        baseUrl: 'https://www.googleapis.com/drive/v3', // Google Drive API Base URL
        // Google APIs typically use OAuth 2.0, not just an API key in headers.
        // This would require a more complex auth flow handled by SecurityService.
        // For MVP simulation, we'll just define the base URL.
        // apiKey: process.env.GOOGLE_DRIVE_API_KEY, // API Key for public data (less common for user data)
        // authHeader: 'Authorization', // OAuth token header
        // authScheme: 'Bearer', // OAuth token scheme
        rateLimit: { limit: 1000, interval: 60000 }, // Example rate limit
    },
    // --- Add ii fr Space API Configuration (Placeholder) ---
    iifrspace: {
        baseUrl: 'https://api.iifrspace.example.com', // Hypothetical Base URL for ii fr Space
        // Assuming API key authentication
        apiKey: import.meta.env.VITE_IIFRSPACE_API_KEY || process.env.IIFRSPACE_API_KEY,
        authHeader: 'Authorization',
        authScheme: 'Bearer',
        rateLimit: { limit: 50, interval: 60000 }, // Example rate limit
    },
    // --- Add Chat X API Configuration (Placeholder) ---
    chatx: {
        baseUrl: 'https://api.chatx.example.com', // Hypothetical Base URL for Chat X
        // Assuming API key authentication
        apiKey: import.meta.env.VITE_CHATX_API_KEY || process.env.CHATX_API_KEY,
        authHeader: 'X-Api-Key',
        rateLimit: { limit: 100, interval: 60000 }, // Example rate limit
    },
    // --- Add Supabase API Configuration (for Rune interaction) ---
    // Note: Core modules interact directly via the Supabase client.
    // This config is for exposing specific Supabase *API* endpoints via a Rune if needed.
    supabaseapi: {
        baseUrl: import.meta.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL, // Use the main Supabase URL
        // Supabase API uses JWT from auth.getSession() or Service Role Key.
        // Authentication is handled by the interceptor based on context.currentUser or specific config.
        rateLimit: { limit: 50, interval: 10000 }, // Example rate limit for API calls
    },
    // --- New: Add Pollinations AI API Configuration ---
    pollinations: {
        baseUrl: 'https://api.pollinations.ai', // Pollinations AI API Base URL
        // Pollinations AI API typically doesn't require an API key for basic usage,
        // but might have rate limits or require keys for higher tiers/specific models.
        // Assuming no API key needed for MVP simulation.
        apiKey: import.meta.env.VITE_POLLINATIONS_API_KEY || process.env.POLLINATIONS_API_KEY, // If a key is needed
        authHeader: 'Authorization', // Or 'X-API-Key' etc.
        authScheme: 'Bearer',
        rateLimit: { limit: 20, interval: 60000 }, // Example rate limit
    },
    // Add other API configurations as needed
};


export class ApiProxy {
    private axiosInstance: AxiosInstance;
    private context: SystemContext;
    // private cachingService: CachingService; // Access via context
    // private loggingService: LoggingService; // Access via context

    // Simple in-memory rate limiting state (for MVP)
    private rateLimitState: { [apiName: string]: { count: number, startTime: number } } = {};

    // Supabase client instance (initialized in SecurityService, accessed via context)
    public supabaseClient: SupabaseClient;


    constructor(context: SystemContext) {
        this.context = context;
        // this.cachingService = context.cachingService;
        // this.loggingService = context.loggingService;
        this.supabaseClient = context.securityService.supabase; // Get Supabase client from SecurityService

        // Create a single Axios instance
        this.axiosInstance = axios.create({
            timeout: 10000, // Default timeout 10 seconds
            headers: {
                'Content-Type': 'application/json',
                // Add other default headers
            },
        });

        // Add request interceptor for logging, authentication, rate limiting, caching
        this.axiosInstance.interceptors.request.use(async (config) => {
            // Log outgoing request
            console.log(`[ApiProxy];
Outgoing;
request: $;
{
    config.method?.toUpperCase();
}
$;
{
    config.url;
}
`);
            this.context.loggingService?.logInfo(`;
Outgoing;
API;
request: $;
{
    config.method?.toUpperCase();
}
$;
{
    config.url;
}
`, { url: config.url, method: config.method, userId: this.context.currentUser?.id });

            // --- Authentication ---
            // This is complex and depends on the API and whether it's user-specific.
            // For MVP, we add API keys from configured `;
apiConfigurations ` if available.
            // In a real app, user-specific API keys/tokens need secure handling (e.g., fetching from SecurityService).
            // Example: Add API key from config if available
            const apiName = this.getApiNameFromUrl(config.url || ''); // Helper to guess API name
            const apiConfig = apiConfigurations[apiName];
            if (apiConfig?.apiKey && apiConfig?.authHeader) {
                 config.headers[apiConfig.authHeader] = apiConfig.authScheme ? `;
$;
{
    apiConfig.authScheme;
}
$;
{
    apiConfig.apiKey;
}
` : apiConfig.apiKey;
            }
             // Example: Add Supabase JWT if needed for Supabase Edge Functions/APIs
             // This is handled by the SecurityService's Supabase client instance itself if used directly.
             // If calling Supabase API via externalRequest, we might need to explicitly add the token.
             // The callSupabaseAPI method adds a flag `;
useSupabaseAuth ` for this.
             if ((config as any).useSupabaseAuth && this.context.currentUser) {
                 const { data } = await this.supabaseClient.auth.getSession();
                 if (data?.session) {
                     config.headers['Authorization'] = `;
Bearer;
$;
{
    data.session.access_token;
}
`;
                 }
             }


            // --- Rate Limiting (Placeholder) ---
            // Implement simple in-memory rate limiting per API
            if (apiConfig?.rateLimit) {
                const now = Date.now();
                const state = this.rateLimitState[apiName] || { count: 0, startTime: now };

                if (now - state.startTime > apiConfig.rateLimit.interval) {
                    // Reset count if interval passed
                    state.count = 0;
                    state.startTime = now;
                }

                if (state.count >= apiConfig.rateLimit.limit) {
                    // If limit reached, wait until the next interval
                    const waitTime = state.startTime + apiConfig.rateLimit.interval - now + 100; // Add buffer
                    console.warn(`[ApiProxy];
Rate;
limit;
exceeded;
for ($; { apiName }.Waiting; $) {
    waitTime;
}
ms. `);
                    this.context.loggingService?.logWarning(`;
Rate;
limit;
exceeded;
for ($; { apiName }.Waiting. `, { apiName, userId: this.context.currentUser?.id });
                    await new Promise(resolve => setTimeout(resolve, waitTime));
                    // After waiting, reset state and proceed
                    this.rateLimitState[apiName] = { count: 0, startTime: Date.now() };
                } else {
                    // Increment count and proceed
                    state.count++;
                    this.rateLimitState[apiName] = state;
                }
            }


            // --- Caching (Placeholder) ---
            // Check cache before making the request
            // const cacheKey = `; $) {
    config.method;
}
$;
{
    config.url;
}
$;
{
    JSON.stringify(config.params || config.data);
}
`;
            // const cachedResponse = await this.context.cachingService?.get(cacheKey);\
            // if (cachedResponse) {\
            //     console.log(`[ApiProxy];
Cache;
hit;
for ($; { config, : .url } `);\
            //     // Return cached response directly (requires mocking Axios response structure)\
            //     // This is complex with Axios interceptors, might be better handled outside.\
            //     // For MVP, caching is simulated or handled per service.\
            // }\


            return config; // Continue with the request
        }, (error) => {
            // Log request error
            console.error('[ApiProxy] Request error:', error);
            this.context.loggingService?.logError('API request error', { error: error.message, config: error.config, userId: this.context.currentUser?.id });
            return Promise.reject(error);
        });

        // Add response interceptor for logging, error handling, caching
        this.axiosInstance.interceptors.response.use((response) => {
            // Log successful response
            console.log(`[ApiProxy]; Incoming)
    response: $;
{
    response.status;
}
$;
{
    response.config.method?.toUpperCase();
}
$;
{
    response.config.url;
}
`);
            this.context.loggingService?.logInfo(`;
Incoming;
API;
response: $;
{
    response.status;
}
`, { url: response.config.url, method: response.config.method, status: response.status, userId: this.context.currentUser?.id });

            // --- Caching (Placeholder) ---
            // Cache successful responses if applicable
            // const cacheKey = `;
$;
{
    response.config.method;
}
$;
{
    response.config.url;
}
$;
{
    JSON.stringify(response.config.params || config.data);
}
`;
            // const ttl = this.getCacheTTL(response.config.url); // Determine TTL based on URL/API
            // if (ttl > 0) {
            //     this.context.cachingService?.set(cacheKey, response.data, ttl);
            // }\

            return response; // Pass the response along
        }, (error) => {
            // Log response error
            console.error('[ApiProxy] Response error:', error.response?.status || error.message, error.config?.method?.toUpperCase(), error.config?.url);
            this.context.loggingService?.logError('API response error', {\
                url: error.config?.url,\
                method: error.config?.method,\
                status: error.response?.status,\
                error: error.message,\
                userId: this.context.currentUser?.id\
            });\

            // Handle specific error statuses (e.g., retry on 429, refresh token on 401)
            // This is complex and depends on the API. For MVP, just reject.
            // if (error.response?.status === 429) {
            //     // Implement retry logic with backoff
            // }\
            // if (error.response?.status === 401) {
            //     // Attempt to refresh token if using OAuth
            // }\

            return Promise.reject(error); // Re-throw the error
        });

        console.log('ApiProxy initialized.');
    }

    /**
     * Helper to guess the API name from a URL for configuration lookup.\
     * This is a simple heuristic and might need refinement.\
     * @param url The request URL.\
     * @returns The guessed API name or 'unknown'.\
     */\
    private getApiNameFromUrl(url: string): string {\
        try {\
            const hostname = new URL(url).hostname;\
            // Simple mapping based on hostname\
            if (hostname.includes('litellm.ai')) return 'litellm';\
            if (hostname.includes('boost.space')) return 'boostspace';\
            if (hostname.includes('capacities.io')) return 'capacities';\
            if (hostname.includes('infoflow.io')) return 'infoflow';\
            if (hostname.includes('aitable.ai')) return 'aitableai';\
            if (hostname.includes('upnote.com')) return 'upnote'; // Hypothetical\
            if (hostname.includes('straico.com')) return 'straico';\
            if (hostname.includes('make.com')) return 'makecom_webhook'; // Assuming Make.com URLs are webhooks\
            if (hostname.includes('github.com')) return 'github';\
            if (hostname.includes('mymemo.ai')) return 'mymemoai'; // Hypothetical\
            if (hostname.includes('taskade.com')) return 'taskade';\
            // --- Add Blue.cc mapping ---\
            if (hostname.includes('blue.cc')) return 'bluecc';\
            // --- Add Bind AI mapping ---\
            if (hostname.includes('bind.ai')) return 'bindai';\
            // --- Add NoteX mapping ---\
            if (hostname.includes('notex.example.com')) return 'notex'; // Hypothetical NoteX domain\
            // --- Add Google Drive mapping ---\
            if (hostname.includes('googleapis.com') && url.includes('/drive/')) return 'googledrive';\
            // --- Add ii fr Space mapping ---\
            if (hostname.includes('iifrspace.example.com')) return 'iifrspace'; // Hypothetical ii fr Space domain\
            // --- Add Chat X mapping ---\
            if (hostname.includes('chatx.example.com')) return 'chatx'; // Hypothetical Chat X domain\
            // --- Add Supabase API mapping ---\
            if (hostname.includes('.supabase.co') || hostname.includes('localhost') && url.includes('/rest/v1/')) return 'supabaseapi'; // Match Supabase REST API URLs\
            // --- New: Add Pollinations AI mapping ---\
            if (hostname.includes('pollinations.ai')) return 'pollinations';\
            // Add other mappings\
            return 'unknown';\
        } catch (e) {\
            console.warn('[ApiProxy] Failed to parse URL for API name:', url, e);\
            return 'unknown';\
        }\
    }\
\
    /**\
     * Helper to determine cache TTL based on API/URL (Placeholder).\
     * @param url The request URL.\
     * @returns TTL in seconds, or 0 if not cacheable.\
     */\
    private getCacheTTL(url: string): number {\
        // TODO: Implement logic to determine TTL based on API, endpoint, or config\
        // For MVP, return 0 (no caching)\
        return 0;\
    }\
\
\
    /**\
     * Makes a generic external HTTP request.\
     * This is the primary method for Runes and modules to interact with external APIs.\
     * Handles authentication, rate limiting, and error handling via interceptors.\
     * @param url The full URL to request. Required.\
     * @param config Axios request configuration (method, headers, params, data, etc.). Required.\
     * @param useSupabaseAuth Optional: Whether to include Supabase JWT in headers. Defaults to false.\
     * @returns Promise<any> The response data.\
     */\
    async externalRequest(url: string, config: AxiosRequestConfig, useSupabaseAuth: boolean = false): Promise<any> {\
        console.log(`[ApiProxy];
Making;
external;
request;
to: $;
{
    url;
}
`);\
        this.context.loggingService?.logInfo(`;
Making;
external;
request `, { url, method: config.method, useSupabaseAuth, userId: this.context.currentUser?.id });\
\
        try {\
            const requestConfig: AxiosRequestConfig = {\
                url: url,\
                ...config,\
                headers: {\
                    ...config.headers,\
                },\
            };\
\
            // Add Supabase JWT if requested and user is logged in\
            // This is handled by the interceptor now if (config as any).useSupabaseAuth is true\
            // Keeping this explicit check here for clarity, but the interceptor is the main place.\
            if (useSupabaseAuth && this.context.currentUser) {\
                 const { data } = await this.supabaseClient.auth.getSession();\
                 if (data?.session) {\
                     requestConfig.headers['Authorization'] = `;
Bearer;
$;
{
    data.session.access_token;
}
`;\
                 }\
            }\
\
            // The interceptors handle adding API keys, rate limiting, etc.\
            const response: AxiosResponse = await this.axiosInstance.request(requestConfig);\
\
            // Return only the data part of the response\
            return response.data;\
\
        } catch (error: any) {\
            console.error(`[ApiProxy];
External;
request;
failed;
to;
$;
{
    url;
}
`, error.message);\
            this.context.loggingService?.logError(`;
External;
request;
failed `, { url, method: config.method, error: error.message, status: error.response?.status, userId: this.context.currentUser?.id });\
            throw error; // Re-throw the error after logging\
        }\
    }\
\
    // --- Specific API Call Methods (Convenience wrappers for known APIs) ---\
    // These methods use `;
externalRequest ` internally but provide API-specific endpoints/auth handling details.\
    // In a real app, these might be more complex, handling API-specific errors, pagination, etc.\
\
    /**\
     * Calls the LiteLLM API via the proxy.\
     * @param endpoint The API endpoint (e.g., '/chat/completions'). Required.\
     * @param method The HTTP method (e.g., 'POST'). Required.\
     * @param data The request body. Optional.\
     * @param config Additional Axios config. Optional.\
     * @returns Promise<any> The response data.\
     */\
    async callLiteLLM(endpoint: string, method: Method, data?: any, config?: AxiosRequestConfig): Promise<any> {\
        const apiConfig = apiConfigurations.litellm;\
        if (!apiConfig?.baseUrl) {\
            console.error('[ApiProxy] LiteLLM base URL is not configured.');\
            this.context.loggingService?.logError('LiteLLM base URL not configured.');\
            throw new Error('LiteLLM API is not configured.');\
        }\
        const url = `;
$;
{
    apiConfig.baseUrl;
}
$;
{
    endpoint;
}
`;\
        // LiteLLM might use an API key passed in headers or body depending on setup.\
        // The request interceptor will add the API key if configured in apiConfigurations.litellm.\
        return this.externalRequest(url, { method, data, ...config }, false); // LiteLLM typically doesn't use Supabase auth\
    }\
\
    /**\
     * Calls the Boost.Space API via the proxy.\
     * @param endpoint The API endpoint. Required.\
     * @param method The HTTP method. Required.\
     * @param data The request body. Optional.\
     * @param config Additional Axios config. Optional.\
     * @returns Promise<any> The response data.\
     */\
    async callBoostSpaceAPI(endpoint: string, method: Method, data?: any, config?: AxiosRequestConfig): Promise<any> {\
        const apiConfig = apiConfigurations.boostspace;\
        if (!apiConfig?.baseUrl) {\
            console.error('[ApiProxy] Boost.Space base URL is not configured.');\
            this.context.loggingService?.logError('Boost.Space base URL not configured.');\
            throw new Error('Boost.Space API is not configured.');\
        }\
        const url = `;
$;
{
    apiConfig.baseUrl;
}
$;
{
    endpoint;
}
`;\
        // The request interceptor will add the API key if configured in apiConfigurations.boostspace.\
        return this.externalRequest(url, { method, data, ...config }, false); // Boost.Space uses its own auth\
    }\
\
    /**\
     * Calls the Capacities API via the proxy.\
     * @param endpoint The API endpoint. Required.\
     * @param method The HTTP method. Required.\
     * @param data The request body. Optional.\
     * @param config Additional Axios config. Optional.\
     * @returns Promise<any> The response data.\
     */\
    async callCapacitiesAPI(endpoint: string, method: Method, data?: any, config?: AxiosRequestConfig): Promise<any> {\
        const apiConfig = apiConfigurations.capacities;\
        if (!apiConfig?.baseUrl) {\
            console.error('[ApiProxy] Capacities base URL is not configured.');\
            this.context.loggingService?.logError('Capacities base URL not configured.');\
            throw new Error('Capacities API is not configured.');\
        }\
        const url = `;
$;
{
    apiConfig.baseUrl;
}
$;
{
    endpoint;
}
`;\
        // The request interceptor will add the API key if configured in apiConfigurations.capacities.\
        return this.externalRequest(url, { method, data, ...config }, false); // Capacities uses its own auth\
    }\
\
    /**\
     * Calls the Infoflow API via the proxy.\
     * @param endpoint The API endpoint. Required.\
     * @param data The request body. Optional. (Assuming POST for simplicity)\
     * @param config Additional Axios config. Optional.\
     * @returns Promise<any> The response data.\
     */\
    async callInfoflowAPI(endpoint: string, method: Method, data?: any, config?: AxiosRequestConfig): Promise<any> { // Added method parameter\
        const apiConfig = apiConfigurations.infoflow;\
        if (!apiConfig?.baseUrl) {\
            console.error('[ApiProxy] Infoflow base URL is not configured.');\
            this.context.loggingService?.logError('Infoflow base URL not configured.');\
            throw new Error('Infoflow API is not configured.');\
        }\
        const url = `;
$;
{
    apiConfig.baseUrl;
}
$;
{
    endpoint;
}
`;\
        // The request interceptor will add the API key if configured in apiConfigurations.infoflow.\
        return this.externalRequest(url, { method, data, ...config }, false); // Infoflow uses its own auth\
    }\
\
    /**\
     * Calls the Aitable.ai API via the proxy.\
     * @param endpoint The API endpoint. Required.\
     * @param data The request body. Optional. (Assuming POST for simplicity)\
     * @param config Additional Axios config. Optional.\
     * @returns Promise<any> The response data.\
     */\
    async callAitableAIAPI(endpoint: string, method: Method, data?: any, config?: AxiosRequestConfig): Promise<any> {\
        const apiConfig = apiConfigurations.aitableai;\
        if (!apiConfig?.baseUrl) {\
            console.error('[ApiProxy] Aitable.ai base URL is not configured.');\
            this.context.loggingService?.logError('Aitable.ai base URL not configured.');\
            throw new Error('Aitable.ai API is not configured.');\
        }\
        const url = `;
$;
{
    apiConfig.baseUrl;
}
$;
{
    endpoint;
}
`;\
        // The request interceptor will add the API key if configured in apiConfigurations.aitableai.\
        return this.externalRequest(url, { method, data, ...config }, false); // Aitable.ai uses its own auth\
    }\
\
    /**\
     * Calls the Mymemo.ai API via the proxy.\
     * @param endpoint The API endpoint. Required.\
     * @param method The HTTP method. Required.\
     * @param data The request body. Optional.\
     * @param config Additional Axios config. Optional.\
     * @returns Promise<any> The response data.\
     */\
    async callMymemoAIAPI(endpoint: string, method: Method, data?: any, config?: AxiosRequestConfig): Promise<any> {\
        const apiConfig = apiConfigurations.mymemoai;\
        if (!apiConfig?.baseUrl) {\
            console.error('[ApiProxy] Mymemo.ai base URL is not configured.');\
            this.context.loggingService?.logError('Mymemo.ai base URL not configured.');\
            throw new Error('Mymemo.ai API is not configured.');\
        }\
        const url = `;
$;
{
    apiConfig.baseUrl;
}
$;
{
    endpoint;
}
`;\
        // The request interceptor will add the API key if configured in apiConfigurations.mymemoai.\
        return this.externalRequest(url, { method, data, ...config }, false); // Mymemo.ai uses its own auth\
    }\
\
    /**\
     * Calls the Taskade API via the proxy.\
     * @param endpoint The API endpoint. Required.\
     * @param method The HTTP method. Required.\
     * @param data The request body. Optional.\
     * @param config Additional Axios config. Optional.\
     * @returns Promise<any> The response data.\
     */\
    async callTaskadeAPI(endpoint: string, method: Method, data?: any, config?: AxiosRequestConfig): Promise<any> {\
        const apiConfig = apiConfigurations.taskade;\
        if (!apiConfig?.baseUrl) {\
            console.error('[ApiProxy] Taskade base URL is not configured.');\
            this.context.loggingService?.logError('Taskade base URL not configured.');\
            throw new Error('Taskade API is not configured.');\
        }\
        const url = `;
$;
{
    apiConfig.baseUrl;
}
$;
{
    endpoint;
}
`;\
        // The request interceptor will add the API key if configured in apiConfigurations.taskade.\
        return this.externalRequest(url, { method, data, ...config }, false); // Taskade uses its own auth\
    }\
\
    /**\
     * Calls the Blue.cc API via the proxy.\
     * @param endpoint The API endpoint (e.g., '/v1/users'). Required.\
     * @param method The HTTP method (e.g., 'GET', 'POST'). Required.\
     * @param data The request body. Optional.\
     * @param config Additional Axios config. Optional.\
     * @returns Promise<any> The response data.\
     */\
    async callBlueAPI(endpoint: string, method: Method, data?: any, config?: AxiosRequestConfig): Promise<any> {\
        const apiConfig = apiConfigurations.bluecc;\
        if (!apiConfig?.baseUrl) {\
            console.error('[ApiProxy] Blue.cc base URL is not configured.');\
            this.context.loggingService?.logError('Blue.cc base URL not configured.');\
            throw new Error('Blue.cc API is not configured.');\
        }\
        const url = `;
$;
{
    apiConfig.baseUrl;
}
$;
{
    endpoint;
}
`;\
        // The request interceptor will add the API key if configured in apiConfigurations.bluecc.\
        return this.externalRequest(url, { method, data, ...config }, false); // Blue.cc uses its own auth\
    }\
\
    /**\
     * Calls the GitHub API via the proxy.\
     * @param endpoint The API endpoint (e.g., '/user'). Required.\
     * @param method The HTTP method (e.g., 'GET', 'POST'). Required.\
     * @param data The request body. Optional.\
     * @param config Additional Axios config. Optional.\
     * @returns Promise<any> The response data.\
     */\
    async callGitHubAPI(endpoint: string, method: Method, data?: any, config?: AxiosRequestConfig): Promise<any> {\
        const apiConfig = apiConfigurations.github;\
        if (!apiConfig?.baseUrl) {\
            console.error('[ApiProxy] GitHub base URL is not configured.');\
            this.context.loggingService?.logError('GitHub base URL not configured.');\
            throw new Error('GitHub API is not configured.');\
        }\
        const url = `;
$;
{
    apiConfig.baseUrl;
}
$;
{
    endpoint;
}
`;\
        // The request interceptor will add the API key if configured in apiConfigurations.github.\
        // GitHub API requires 'Accept' header for specific versions or previews\
        const githubConfig: AxiosRequestConfig = {\
            method,\
            data,\
            ...config,\
            headers: {\
                ...config?.headers,\
                'Accept': 'application/vnd.github.v3+json', // Recommended GitHub API header\
            }\
        };\
        return this.externalRequest(url, githubConfig, false); // GitHub uses its own auth (PAT/OAuth)\
    }\
\
    /**\
     * Calls the Straico API via the proxy.\
     * @param endpoint The API endpoint (e.g., '/completions'). Required.\
     * @param method The HTTP method (e.g., 'POST'). Required.\
     * @param data The request body. Optional.\
     * @param config Additional Axios config. Optional.\
     * @returns Promise<any> The response data.\
     */\
    async callStraicoAPI(endpoint: string, method: Method, data?: any, config?: AxiosRequestConfig): Promise<any> {\
        const apiConfig = apiConfigurations.straico;\
        if (!apiConfig?.baseUrl) {\
            console.error('[ApiProxy] Straico base URL is not configured.');\
            this.context.loggingService?.logError('Straico base URL not configured.');\
            throw new Error('Straico API is not configured.');\
        }\
        const url = `;
$;
{
    apiConfig.baseUrl;
}
$;
{
    endpoint;
}
`;\
        // The request interceptor will add the API key if configured in apiConfigurations.straico.\
        return this.externalRequest(url, { method, data, ...config }, false); // Straico uses its own auth (X-API-KEY)\
    }\
\
    /**\
     * Calls the Bind AI API via the proxy.\
     * @param endpoint The API endpoint (e.g., '/chat'). Required.\
     * @param method The HTTP method (e.g., 'POST'). Required.\
     * @param data The request body. Optional.\
     * @param config Additional Axios config. Optional.\
     * @returns Promise<any> The response data.\
     */\
    async callBindAPI(endpoint: string, method: Method, data?: any, config?: AxiosRequestConfig): Promise<any> {\
        const apiConfig = apiConfigurations.bindai;\
        if (!apiConfig?.baseUrl) {\
            console.error('[ApiProxy] Bind AI base URL is not configured.');\
            this.context.loggingService?.logError('Bind AI base URL not configured.');\
            throw new Error('Bind AI API is not configured.');\
        }\
        const url = `;
$;
{
    apiConfig.baseUrl;
}
$;
{
    endpoint;
}
`;\
        // The request interceptor will add the API key if configured in apiConfigurations.bindai.\
        return this.externalRequest(url, { method, data, ...config }, false); // Bind AI uses its own auth (X-API-KEY)\
    }\
\
    /**\
     * Calls the NoteX API via the proxy (Placeholder).\
     * @param endpoint The API endpoint. Required.\
     * @param method The HTTP method. Required.\
     * @param data The request body. Optional.\
     * @param config Additional Axios config. Optional.\
     * @returns Promise<any> The API response data.\
     */\
    async callNoteXAPI(endpoint: string, method: Method, data?: any, config?: AxiosRequestConfig): Promise<any> {\
        const apiConfig = apiConfigurations.notex;\
        if (!apiConfig?.baseUrl) {\
            console.error('[ApiProxy] NoteX base URL is not configured.');\
            this.context.loggingService?.logError('NoteX base URL not configured.');\
            throw new Error('NoteX API is not configured.');\
        }\
        const url = `;
$;
{
    apiConfig.baseUrl;
}
$;
{
    endpoint;
}
`;\
        // The request interceptor will add the API key if configured in apiConfigurations.notex.\
        return this.externalRequest(url, { method, data, ...config }, false); // NoteX uses its own auth\
    }\
\
    /**\
     * Calls the Google Drive API via the proxy (Placeholder).\
     * Note: Google APIs typically require OAuth 2.0, which is more complex than simple API key auth.\
     * This method is a placeholder and would need proper OAuth handling.\
     * @param endpoint The API endpoint (e.g., '/files'). Required.\
     * @param method The HTTP method (e.g., 'GET', 'POST'). Required.\
     * @param data The request body. Optional.\
     * @param config Additional Axios config. Optional.\
     * @returns Promise<any> The API response data.\
     */\
    async callGoogleDriveAPI(endpoint: string, method: Method, data?: any, config?: AxiosRequestConfig): Promise<any> {\
        const apiConfig = apiConfigurations.googledrive;\
        if (!apiConfig?.baseUrl) {\
            console.error('[ApiProxy] Google Drive base URL is not configured.');\
            this.context.loggingService?.logError('Google Drive base URL not configured.');\
            throw new Error('Google Drive API is not configured.');\
        }\
        const url = `;
$;
{
    apiConfig.baseUrl;
}
$;
{
    endpoint;
}
`;\
        // Google Drive requires OAuth 2.0. The request interceptor might add a Bearer token\
        // if the user has linked their Google account and an access token is available.\
        // This is a significant TODO for the SecurityService and user auth flow.\
        // console.warn('[ApiProxy] Google Drive API call requires OAuth 2.0. Authentication is simulated.'); // Removed simulation message\
        return this.externalRequest(url, { method, data, ...config }, false); // Google Drive uses OAuth\
    }\
\
    /**\
     * Calls the ii fr Space API via the proxy (Placeholder).\
     * @param endpoint The API endpoint. Required.\
     * @param method The HTTP method. Required.\
     * @param data The request body. Optional.\
     * @param config Additional Axios config. Optional.\
     * @returns Promise<any> The API response data.\
     */\
    async callIiFrSpaceAPI(endpoint: string, method: Method, data?: any, config?: AxiosRequestConfig): Promise<any> {\
        const apiConfig = apiConfigurations.iifrspace;\
        if (!apiConfig?.baseUrl) {\
            console.error('[ApiProxy] ii fr Space base URL is not configured.');\
            this.context.loggingService?.logError('ii fr Space base URL not configured.');\
            throw new Error('ii fr Space API is not configured.');\
        }\
        const url = `;
$;
{
    apiConfig.baseUrl;
}
$;
{
    endpoint;
}
`;\
        // The request interceptor will add the API key if configured in apiConfigurations.iifrspace.\
        return this.externalRequest(url, { method, data, ...config }, false); // ii fr Space uses its own auth\
    }\
\
    /**\
     * Calls the Chat X API via the proxy (Placeholder).\
     * @param endpoint The API endpoint. Required.\
     * @param method The HTTP method. Required.\
     * @param data The request body. Optional.\
     * @param config Additional Axios config. Optional.\
     * @returns Promise<any> The API response data.\
     */\
    async callChatXAPI(endpoint: string, method: Method, data?: any, config?: AxiosRequestConfig): Promise<any> {\
        const apiConfig = apiConfigurations.chatx;\
        if (!apiConfig?.baseUrl) {\
            console.error('[ApiProxy] Chat X base URL is not configured.');\
            this.context.loggingService?.logError('Chat X base URL not configured.');\
            throw new Error('Chat X API is not configured.');\
        }\
        const url = `;
$;
{
    apiConfig.baseUrl;
}
$;
{
    endpoint;
}
`;\
        // The request interceptor will add the API key if configured in apiConfigurations.chatx.\
        return this.externalRequest(url, { method, data, ...config }, false); // Chat X uses its own auth\
    }\
\
    /**\
     * Calls the Supabase API via the proxy (for Rune interaction).\
     * Note: Core modules interact directly via the Supabase client.\
     * This method is for exposing specific Supabase *API* endpoints via a Rune if needed.\
     * @param endpoint The API endpoint (e.g., '/rest/v1/items'). Required.\
     * @param method The HTTP method (e.g., 'GET', 'POST'). Required.\
     * @param data The request body. Optional.\
     * @param config Additional Axios config. Optional.\
     * @param useServiceRole Optional: Whether to use the Service Role Key (requires secure context). Defaults to false.\
     * @returns Promise<any> The API response data.\
     */\
    async callSupabaseAPI(endpoint: string, method: Method, data?: any, config?: AxiosRequestConfig, useServiceRole: boolean = false): Promise<any> {\
        const apiConfig = apiConfigurations.supabaseapi;\
        if (!apiConfig?.baseUrl) {\
            console.error('[ApiProxy] Supabase API base URL is not configured.');\
            this.context.loggingService?.logError('Supabase API base URL not configured.');\
            throw new Error('Supabase API is not configured.');\
        }\
        // Ensure the endpoint starts with /rest/v1/ or /rpc/v1/ etc.\
        const url = `;
$;
{
    apiConfig.baseUrl;
}
$;
{
    endpoint.startsWith('/') ? endpoint : '/' + endpoint;
}
`;\
\
        // Authentication is handled by the interceptor (user JWT) or Service Role Key if configured\
        // If useServiceRole is true, the interceptor needs logic to add the service role key (only in secure environments)\
        if (useServiceRole) {\
             console.warn('[ApiProxy] Using Supabase Service Role Key. Ensure this is only done in secure backend contexts.');\
             // The interceptor would need to check for a flag or context to add the service role key\
             // For MVP simulation, we'll just log the warning.\
        }\
\
        // The interceptor will add the user's JWT if available and not using service role\
        return this.externalRequest(url, { method, data, ...config, useSupabaseAuth: !useServiceRole }, !useServiceRole); // Pass useSupabaseAuth flag to externalRequest\
    }\
\
    /**\
     * Calls the Pollinations AI API via the proxy.\
     * @param endpoint The API endpoint (e.g., '/v1/predict'). Required.\
     * @param method The HTTP method (e.g., 'POST'). Required.\
     * @param data The request body. Optional.\
     * @param config Additional Axios config. Optional.\
     * @returns Promise<any> The API response data.\
     */\
    async callPollinationsAPI(endpoint: string, method: Method, data?: any, config?: AxiosRequestConfig): Promise<any> {\
        const apiConfig = apiConfigurations.pollinations;\
        if (!apiConfig?.baseUrl) {\
            console.error('[ApiProxy] Pollinations AI base URL is not configured.');\
            this.context.loggingService?.logError('Pollinations AI base URL not configured.');\
            throw new Error('Pollinations AI API is not configured.');\
        }\
        const url = `;
$;
{
    apiConfig.baseUrl;
}
$;
{
    endpoint;
}
`;\
        // The request interceptor will add the API key if configured in apiConfigurations.pollinations.\
        return this.externalRequest(url, { method, data, ...config }, false); // Pollinations uses its own auth (or none)\
    }\
\
\
    /**\
     * Triggers a Make.com webhook via the proxy.\
     * Note: Webhooks are often POST requests with the payload in the body.\
     * @param payload The payload to send to the webhook. Required.\
     * @param webhookUrl The full webhook URL. Required.\
     * @param config Additional Axios config. Optional.\
     * @returns Promise<any> The response data.\
     */\
    async callMakeWebhook(payload: any, webhookUrl: string, config?: AxiosRequestConfig): Promise<any> {\
        console.log(`[ApiProxy];
Calling;
Make.com;
webhook: $;
{
    webhookUrl;
}
`);\
        this.context.loggingService?.logInfo(`;
Calling;
Make.com;
webhook `, { webhookUrl, userId: this.context.currentUser?.id });\
\
        // Use the generic externalRequest method\
        // The webhook URL is the full URL, not relative to a base URL config\
        // Rate limiting will apply based on the domain of the webhookUrl if configured\
        return this.externalRequest(webhookUrl, { method: 'POST', data: payload, ...config }, false); // Webhooks typically don't use Supabase auth\
    }\
\
    // TODO: Implement robust error handling and retry logic within specific call methods or interceptors.\
    // TODO: Implement caching logic within specific call methods or interceptors.\
    // TODO: Implement user-specific API key management (securely!).\
    // TODO: This module is the core of the API Gateway (\\u842c\\u80fd\\u4ee3\\u7406\\u7fa4) concept for external services.\
}\
` ``;
