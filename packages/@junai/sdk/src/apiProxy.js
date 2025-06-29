var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
""(__makeTemplateObject(["typescript\n// packages/@junai/sdk/src/apiProxy.ts\n// SDK's Internal API Proxy\n// Handles making requests, potentially to Supabase or a custom API Gateway.\n\nimport axios, { AxiosInstance, AxiosRequestConfig, Method } from 'axios';\nimport { SupabaseClient } from '@supabase/supabase-js';\n\nexport class ApiProxy {\n  private supabaseClient: SupabaseClient;\n  private customApiEndpoint?: string;\n  private axiosInstance: AxiosInstance;\n\n  constructor(supabaseClient: SupabaseClient, customApiEndpoint?: string) {\n    this.supabaseClient = supabaseClient;\n    this.customApiEndpoint = customApiEndpoint;\n\n    this.axiosInstance = axios.create({\n      timeout: 10000, // Default timeout 10 seconds\n      headers: {\n        'Content-Type': 'application/json',\n      },\n    });\n\n    // Add request interceptor to add Supabase JWT if available\n    this.axiosInstance.interceptors.request.use(async (config) => {\n      // If the request is NOT going to the custom API endpoint, assume it's a Supabase REST call\n      // and add the JWT if a session exists.\n      if (!config.url?.startsWith(this.customApiEndpoint || '')) {\n         const { data } = await this.supabaseClient.auth.getSession();\n         if (data?.session) {\n             config.headers['Authorization'] = "], ["typescript\n// packages/@junai/sdk/src/apiProxy.ts\n// SDK's Internal API Proxy\n// Handles making requests, potentially to Supabase or a custom API Gateway.\n\nimport axios, { AxiosInstance, AxiosRequestConfig, Method } from 'axios';\nimport { SupabaseClient } from '@supabase/supabase-js';\n\nexport class ApiProxy {\n  private supabaseClient: SupabaseClient;\n  private customApiEndpoint?: string;\n  private axiosInstance: AxiosInstance;\n\n  constructor(supabaseClient: SupabaseClient, customApiEndpoint?: string) {\n    this.supabaseClient = supabaseClient;\n    this.customApiEndpoint = customApiEndpoint;\n\n    this.axiosInstance = axios.create({\n      timeout: 10000, // Default timeout 10 seconds\n      headers: {\n        'Content-Type': 'application/json',\n      },\n    });\n\n    // Add request interceptor to add Supabase JWT if available\n    this.axiosInstance.interceptors.request.use(async (config) => {\n      // If the request is NOT going to the custom API endpoint, assume it's a Supabase REST call\n      // and add the JWT if a session exists.\n      if (!config.url?.startsWith(this.customApiEndpoint || '')) {\n         const { data } = await this.supabaseClient.auth.getSession();\n         if (data?.session) {\n             config.headers['Authorization'] = "]));
Bearer;
$;
{
    data.session.access_token;
}
";\n         }\n      }\n      // Note: Authentication for the custom API endpoint needs to be handled differently\n      // (e.g., passing a separate API key or token in headers/body).\n      // This is simplified for MVP.\n\n      return config;\n    }, (error) => {\n      return Promise.reject(error);\n    });\n  }\n\n  /**\n   * Calls an API endpoint. Can be a Supabase REST endpoint or a custom API Gateway endpoint.\n   * @param endpoint The endpoint path (e.g., '/rest/v1/knowledge_records' or '/analyze'). Required.\n   * @param method The HTTP method (e.g., 'GET', 'POST'). Required.\n   * @param data The request body. Optional.\n   * @param config Additional Axios config. Optional.\n   * @returns Promise<any> The response data.\n   */\n  async callApi(endpoint: string, method: Method, data?: any, config?: AxiosRequestConfig): Promise<any> {\n    let url: string;\n\n    if (this.customApiEndpoint && endpoint.startsWith('/')) {\n      // If custom endpoint is configured and endpoint is a path, use custom endpoint\n      url = ";
$;
{
    this.customApiEndpoint;
}
$;
{
    endpoint;
}
";\n    } else if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) {\n      // If endpoint is a full URL, use it directly\n      url = endpoint;\n    } else {\n      // Otherwise, assume it's a Supabase REST endpoint relative to the Supabase URL\n      // This requires knowing the Supabase URL, which is part of the client.\n      // The Supabase client instance doesn't directly expose its base URL easily.\n      // A better approach: have separate methods for Supabase calls vs custom API calls.\n      // For MVP, let's assume ";
endpoint(__makeTemplateObject([" is always a full URL or relative to the custom endpoint.\n      // If no custom endpoint, throw error for non-full URLs.\n      if (!this.customApiEndpoint) {\n           throw new Error("], [" is always a full URL or relative to the custom endpoint.\n      // If no custom endpoint, throw error for non-full URLs.\n      if (!this.customApiEndpoint) {\n           throw new Error("]));
Cannot;
call;
API: Custom;
API;
endpoint;
is;
not;
configured;
and;
endpoint;
'${endpoint}';
is;
not;
a;
full;
URL.(__makeTemplateObject([");\n      }\n       url = "], [");\n      }\n       url = "]));
$;
{
    this.customApiEndpoint;
}
$;
{
    endpoint;
}
"; // Fallback to custom endpoint if not a full URL\n    }\n\n\n    try {\n      const response = await this.axiosInstance.request({\n        url: url,\n        method: method,\n        data: data,\n        ...config,\n      });\n      return response.data;\n    } catch (error: any) {\n      console.error(";
SDK;
ApiProxy;
Error;
calling;
$;
{
    method;
}
$;
{
    url;
}
", error.message);\n      throw error; // Re-throw the error\n    }\n  }\n\n  /**\n   * Gets the configured custom API endpoint.\n   * @returns The custom API endpoint URL or undefined.\n   */\n  getApiEndpoint(): string | undefined {\n      return this.customApiEndpoint;\n  }\n\n  // Add specific methods for common API calls if needed (e.g., callJunaiAnalyze, callRuneAction)\n  // These would use the generic callApi internally.\n}\n"(__makeTemplateObject([""], [""]));
