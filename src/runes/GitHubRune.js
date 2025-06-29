var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
""(__makeTemplateObject(["typescript\n// src/runes/GitHubRune.ts\n// GitHub Rune Implementation\n// Provides methods to interact with the GitHub API via the ApiProxy.\n\nimport { SystemContext, Rune } from '../interfaces';\n// import { ApiProxy } from '../proxies/apiProxy'; // Access via context\n// import { LoggingService } from '../core/logging/LoggingService'; // Access via context\n// import { SecurityService } from '../core/security/SecurityService'; // Access via context\n\n/**\n * Implements the GitHub Rune, allowing interaction with the GitHub API.\n */\nexport class GitHubRune {\n    private context: SystemContext;\n    private rune: Rune; // Reference to the Rune definition\n\n    constructor(context: SystemContext, rune: Rune) {\n        this.context = context;\n        this.rune = rune;\n        console.log("], ["typescript\n// src/runes/GitHubRune.ts\n// GitHub Rune Implementation\n// Provides methods to interact with the GitHub API via the ApiProxy.\n\nimport { SystemContext, Rune } from '../interfaces';\n// import { ApiProxy } from '../proxies/apiProxy'; // Access via context\n// import { LoggingService } from '../core/logging/LoggingService'; // Access via context\n// import { SecurityService } from '../core/security/SecurityService'; // Access via context\n\n/**\n * Implements the GitHub Rune, allowing interaction with the GitHub API.\n */\nexport class GitHubRune {\n    private context: SystemContext;\n    private rune: Rune; // Reference to the Rune definition\n\n    constructor(context: SystemContext, rune: Rune) {\n        this.context = context;\n        this.rune = rune;\n        console.log("]))[Rune];
GitHubRune;
initialized;
for ($; { rune: rune, : .name }.(__makeTemplateObject([");\n\n        // Configuration validation is now handled by the SecurityService when linking the integration\n        // and when the Rune is loaded/updated.\n    }\n\n    /**\n     * Helper to get the GitHub PAT securely from SecurityService.\n     * @param userId The user ID. Required.\n     * @returns Promise<string | undefined> The PAT or undefined if not found.\n     * @throws Error if SecurityService is not available.\n     */\n    private async getGitHubPat(userId: string): Promise<string | undefined> {\n        if (!this.context.securityService) {\n            throw new Error('SecurityService is not available to retrieve GitHub PAT.');\n        }\n        // The PAT is stored under the key 'github_pat' for the user.\n        const pat = await this.context.securityService.retrieveSensitiveData(userId, 'github_pat');\n        if (!pat) {\n             console.warn("], [");\n\n        // Configuration validation is now handled by the SecurityService when linking the integration\n        // and when the Rune is loaded/updated.\n    }\n\n    /**\n     * Helper to get the GitHub PAT securely from SecurityService.\n     * @param userId The user ID. Required.\n     * @returns Promise<string | undefined> The PAT or undefined if not found.\n     * @throws Error if SecurityService is not available.\n     */\n    private async getGitHubPat(userId: string): Promise<string | undefined> {\n        if (!this.context.securityService) {\n            throw new Error('SecurityService is not available to retrieve GitHub PAT.');\n        }\n        // The PAT is stored under the key 'github_pat' for the user.\n        const pat = await this.context.securityService.retrieveSensitiveData(userId, 'github_pat');\n        if (!pat) {\n             console.warn("]))[Rune]; GitHub)
    PAT;
not;
found;
for (user; $; { userId: userId }.GitHub)
    operations;
will;
likely;
fail.(__makeTemplateObject([");\n             this.context.loggingService?.logWarning("], [");\n             this.context.loggingService?.logWarning("]));
GitHub;
PAT;
not;
found;
for (user; $; { userId: userId }(__makeTemplateObject([", { runeId: this.rune.id, userId });\n             // Don't throw here, let the API call itself fail if the PAT is missing.\n             // This allows the API Proxy to handle the authentication failure consistently.\n        }\n        return pat;\n    }\n\n\n    /**\n     * Gets the authenticated user's GitHub profile.\n     * Corresponds to the 'getUser' method in the manifest.\n     * @param params Optional parameters (not used for this endpoint).\n     * @param userId The user ID executing the action. Required.\n     * @returns Promise<any> The GitHub user object.\n     */\n    async getUser(params: any, userId: string): Promise<any> {\n        console.log("], [", { runeId: this.rune.id, userId });\n             // Don't throw here, let the API call itself fail if the PAT is missing.\n             // This allows the API Proxy to handle the authentication failure consistently.\n        }\n        return pat;\n    }\n\n\n    /**\n     * Gets the authenticated user's GitHub profile.\n     * Corresponds to the 'getUser' method in the manifest.\n     * @param params Optional parameters (not used for this endpoint).\n     * @param userId The user ID executing the action. Required.\n     * @returns Promise<any> The GitHub user object.\n     */\n    async getUser(params: any, userId: string): Promise<any> {\n        console.log("]))[Rune])
    $;
{
    this.rune.name;
}
getUser;
called;
by;
user;
$;
{
    userId;
}
");\n        this.context.loggingService?.logInfo(";
Executing;
rune;
action: $;
{
    this.rune.name;
}
getUser(__makeTemplateObject([", { runeId: this.rune.id, userId });\n\n        if (!userId) throw new Error('User ID is required.');\n\n        try {\n            // --- Modified: Get PAT securely before calling API ---\n            const pat = await this.getGitHubPat(userId);\n            // ApiProxy.callGitHubAPI will handle adding the Bearer token if pat is provided.\n            // If pat is undefined, ApiProxy will make the call without auth, which will likely fail (401).\n            // This is the desired behavior, letting ApiProxy/caller handle auth failures.\n            const config = pat ? { headers: { Authorization: "], [", { runeId: this.rune.id, userId });\n\n        if (!userId) throw new Error('User ID is required.');\n\n        try {\n            // --- Modified: Get PAT securely before calling API ---\n            const pat = await this.getGitHubPat(userId);\n            // ApiProxy.callGitHubAPI will handle adding the Bearer token if pat is provided.\n            // If pat is undefined, ApiProxy will make the call without auth, which will likely fail (401).\n            // This is the desired behavior, letting ApiProxy/caller handle auth failures.\n            const config = pat ? { headers: { Authorization: "]));
Bearer;
$;
{
    pat;
}
" } } : undefined;\n            const result = await this.context.apiProxy?.callGitHubAPI('/user', 'GET', undefined, config);\n            // --- End Modified ---\n\n            console.log("[Rune];
$;
{
    this.rune.name;
}
getUser;
result: ", result);\n            return { status: 'success', data: result };\n\n        } catch (error: any) {\n            console.error("[Rune];
Error;
executing;
$;
{
    this.rune.name;
}
getUser: ", error);\n            this.context.loggingService?.logError(";
Error;
executing;
rune;
action: $;
{
    this.rune.name;
}
getUser(__makeTemplateObject([", { runeId: this.rune.id, userId, error: error.message });\n            throw new Error("], [", { runeId: this.rune.id, userId, error: error.message });\n            throw new Error("]));
GitHub;
API;
call;
failed: $;
{
    error.message;
}
");\n        }\n    }\n\n    /**\n     * Lists repositories for the authenticated user.\n     * Corresponds to the 'listRepos' method in the manifest.\n     * @param params Optional parameters (e.g., { type: 'owner' }).\n     * @param userId The user ID executing the action. Required.\n     * @returns Promise<any> An array of GitHub repository objects.\n     */\n    async listRepos(params: { type?: 'all' | 'owner' | 'member' }, userId: string): Promise<any> {\n        console.log("[Rune];
$;
{
    this.rune.name;
}
listRepos;
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
listRepos(__makeTemplateObject([", { runeId: this.rune.id, userId, params });\n\n        if (!userId) throw new Error('User ID is required.');\n\n        const repoType = params?.type || 'owner'; // Default to listing owned repos\n\n        try {\n            // --- Modified: Get PAT securely before calling API ---\n            const pat = await this.getGitHubPat(userId);\n            const config = pat ? { headers: { Authorization: "], [", { runeId: this.rune.id, userId, params });\n\n        if (!userId) throw new Error('User ID is required.');\n\n        const repoType = params?.type || 'owner'; // Default to listing owned repos\n\n        try {\n            // --- Modified: Get PAT securely before calling API ---\n            const pat = await this.getGitHubPat(userId);\n            const config = pat ? { headers: { Authorization: "]));
Bearer;
$;
{
    pat;
}
" }, params: { type: repoType } } : { params: { type: repoType } };\n            const result = await this.context.apiProxy?.callGitHubAPI('/user/repos', 'GET', undefined, config);\n            // --- End Modified ---\n\n            console.log("[Rune];
$;
{
    this.rune.name;
}
listRepos;
result: ", result);\n            return { status: 'success', data: result };\n\n        } catch (error: any) {\n            console.error("[Rune];
Error;
executing;
$;
{
    this.rune.name;
}
listRepos: ", error);\n            this.context.loggingService?.logError(";
Error;
executing;
rune;
action: $;
{
    this.rune.name;
}
listRepos(__makeTemplateObject([", { runeId: this.rune.id, userId, error: error.message });\n            throw new Error("], [", { runeId: this.rune.id, userId, error: error.message });\n            throw new Error("]));
GitHub;
API;
call;
failed: $;
{
    error.message;
}
");\n        }\n    }\n\n    // --- New: Implement createIssue method ---\n    /**\n     * Creates a new issue in a specified GitHub repository.\n     * Corresponds to the 'createIssue' method in the manifest.\n     * @param params Parameters: { owner: string, repo: string, title: string, body?: string, labels?: string[] }. Required.\n     * @param userId The user ID executing the action. Required.\n     * @returns Promise<any> The created GitHub issue object.\n     */\n    async createIssue(params: { owner: string, repo: string, title: string, body?: string, labels?: string[] }, userId: string): Promise<any> {\n        console.log("[Rune];
$;
{
    this.rune.name;
}
createIssue;
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
createIssue(__makeTemplateObject([", { runeId: this.rune.id, userId, params: { owner: params?.owner, repo: params?.repo, title: params?.title } });\n\n        if (!userId) throw new Error('User ID is required.');\n        if (!params?.owner || !params?.repo || !params?.title) {\n            throw new Error('Owner, repo, and title are required for createIssue.');\n        }\n\n        try {\n            // --- Modified: Get PAT securely before calling API ---\n            const pat = await this.getGitHubPat(userId);\n            const endpoint = "], [", { runeId: this.rune.id, userId, params: { owner: params?.owner, repo: params?.repo, title: params?.title } });\n\n        if (!userId) throw new Error('User ID is required.');\n        if (!params?.owner || !params?.repo || !params?.title) {\n            throw new Error('Owner, repo, and title are required for createIssue.');\n        }\n\n        try {\n            // --- Modified: Get PAT securely before calling API ---\n            const pat = await this.getGitHubPat(userId);\n            const endpoint = "])) / repos / $;
{
    params.owner;
}
/${params.repo}/issues(__makeTemplateObject([";\n            const method = 'POST';\n            const data = {\n                title: params.title,\n                body: params.body,\n                labels: params.labels,\n                // Add other issue parameters like assignees, milestone if needed\n            };\n            const config = pat ? { headers: { Authorization: "], [";\n            const method = 'POST';\n            const data = {\n                title: params.title,\n                body: params.body,\n                labels: params.labels,\n                // Add other issue parameters like assignees, milestone if needed\n            };\n            const config = pat ? { headers: { Authorization: "]));
Bearer;
$;
{
    pat;
}
" } } : undefined;\n            const result = await this.context.apiProxy?.callGitHubAPI(endpoint, method, data, config);\n            // --- End Modified ---\n\n            console.log("[Rune];
$;
{
    this.rune.name;
}
createIssue;
result: ", result);\n            return { status: 'success', data: result, message: ";
Issue;
created: $;
{
    (result === null || result === void 0 ? void 0 : result.html_url) || (result === null || result === void 0 ? void 0 : result.title);
}
" };\n\n        } catch (error: any) {\n            console.error("[Rune];
Error;
executing;
$;
{
    this.rune.name;
}
createIssue: ", error);\n            this.context.loggingService?.logError(";
Error;
executing;
rune;
action: $;
{
    this.rune.name;
}
createIssue(__makeTemplateObject([", { runeId: this.rune.id, userId, error: error.message });\n            throw new Error("], [", { runeId: this.rune.id, userId, error: error.message });\n            throw new Error("]));
GitHub;
API;
call;
failed: $;
{
    error.message;
}
");\n        }\n    }\n    // --- End New ---\n\n\n    /**\n     * Method to update configuration (optional, but good practice for API keys).\n     * @param config The new configuration object.\n     */\n    updateConfiguration(config: any): void {\n        console.log("[Rune];
$;
{
    this.rune.name;
}
configuration;
updated: ", config);\n        this.rune.configuration = config; // Update the configuration on the rune object\n        // TODO: Re-initialize any internal clients if configuration changes affect them\n    }\n\n    // Add other GitHub API interaction methods as needed\n    // e.g., getRepoContent, createCommit, listPullRequests\n}\n"(__makeTemplateObject([""], [""]));
