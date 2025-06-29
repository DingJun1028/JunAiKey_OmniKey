"use strict";
`` `typescript
// src/runes/GitHubRune.ts
// GitHub Rune Implementation
// Provides methods to interact with the GitHub API via the ApiProxy.

import { SystemContext, Rune } from '../interfaces';
// import { ApiProxy } from '../proxies/apiProxy'; // Access via context
// import { LoggingService } from '../core/logging/LoggingService'; // Access via context
// import { SecurityService } from '../core/security/SecurityService'; // Access via context

/**
 * Implements the GitHub Rune, allowing interaction with the GitHub API.
 */
export class GitHubRune {
    private context: SystemContext;
    private rune: Rune; // Reference to the Rune definition

    constructor(context: SystemContext, rune: Rune) {
        this.context = context;
        this.rune = rune;
        console.log(`[Rune];
GitHubRune;
initialized;
for ($; { rune, : .name }. `);

        // Configuration validation is now handled by the SecurityService when linking the integration
        // and when the Rune is loaded/updated.
    }

    /**
     * Helper to get the GitHub PAT securely from SecurityService.
     * @param userId The user ID. Required.
     * @returns Promise<string | undefined> The PAT or undefined if not found.
     * @throws Error if SecurityService is not available.
     */
    private async getGitHubPat(userId: string): Promise<string | undefined> {
        if (!this.context.securityService) {
            throw new Error('SecurityService is not available to retrieve GitHub PAT.');
        }
        // The PAT is stored under the key 'github_pat' for the user.
        const pat = await this.context.securityService.retrieveSensitiveData(userId, 'github_pat');
        if (!pat) {
             console.warn(`[Rune]; GitHub)
    PAT;
not;
found;
for (user; $; { userId }.GitHub)
    operations;
will;
likely;
fail. `);
             this.context.loggingService?.logWarning(`;
GitHub;
PAT;
not;
found;
for (user; $; { userId } `, { runeId: this.rune.id, userId });
             // Don't throw here, let the API call itself fail if the PAT is missing.
             // This allows the API Proxy to handle the authentication failure consistently.
        }
        return pat;
    }


    /**
     * Gets the authenticated user's GitHub profile.
     * Corresponds to the 'getUser' method in the manifest.
     * @param params Optional parameters (not used for this endpoint).
     * @param userId The user ID executing the action. Required.
     * @returns Promise<any> The GitHub user object.
     */
    async getUser(params: any, userId: string): Promise<any> {
        console.log(`[Rune])
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
`);
        this.context.loggingService?.logInfo(`;
Executing;
rune;
action: $;
{
    this.rune.name;
}
getUser `, { runeId: this.rune.id, userId });

        if (!userId) throw new Error('User ID is required.');

        try {
            // --- Modified: Get PAT securely before calling API ---
            const pat = await this.getGitHubPat(userId);
            // ApiProxy.callGitHubAPI will handle adding the Bearer token if pat is provided.
            // If pat is undefined, ApiProxy will make the call without auth, which will likely fail (401).
            // This is the desired behavior, letting ApiProxy/caller handle auth failures.
            const config = pat ? { headers: { Authorization: `;
Bearer;
$;
{
    pat;
}
` } } : undefined;
            const result = await this.context.apiProxy?.callGitHubAPI('/user', 'GET', undefined, config);
            // --- End Modified ---

            console.log(`[Rune];
$;
{
    this.rune.name;
}
getUser;
result: `, result);
            return { status: 'success', data: result };

        } catch (error: any) {
            console.error(`[Rune];
Error;
executing;
$;
{
    this.rune.name;
}
getUser: `, error);
            this.context.loggingService?.logError(`;
Error;
executing;
rune;
action: $;
{
    this.rune.name;
}
getUser `, { runeId: this.rune.id, userId, error: error.message });
            throw new Error(`;
GitHub;
API;
call;
failed: $;
{
    error.message;
}
`);
        }
    }

    /**
     * Lists repositories for the authenticated user.
     * Corresponds to the 'listRepos' method in the manifest.
     * @param params Optional parameters (e.g., { type: 'owner' }).
     * @param userId The user ID executing the action. Required.
     * @returns Promise<any> An array of GitHub repository objects.
     */
    async listRepos(params: { type?: 'all' | 'owner' | 'member' }, userId: string): Promise<any> {
        console.log(`[Rune];
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
    : `, params);
        this.context.loggingService?.logInfo(`;
Executing;
rune;
action: $;
{
    this.rune.name;
}
listRepos `, { runeId: this.rune.id, userId, params });

        if (!userId) throw new Error('User ID is required.');

        const repoType = params?.type || 'owner'; // Default to listing owned repos

        try {
            // --- Modified: Get PAT securely before calling API ---
            const pat = await this.getGitHubPat(userId);
            const config = pat ? { headers: { Authorization: `;
Bearer;
$;
{
    pat;
}
` }, params: { type: repoType } } : { params: { type: repoType } };
            const result = await this.context.apiProxy?.callGitHubAPI('/user/repos', 'GET', undefined, config);
            // --- End Modified ---

            console.log(`[Rune];
$;
{
    this.rune.name;
}
listRepos;
result: `, result);
            return { status: 'success', data: result };

        } catch (error: any) {
            console.error(`[Rune];
Error;
executing;
$;
{
    this.rune.name;
}
listRepos: `, error);
            this.context.loggingService?.logError(`;
Error;
executing;
rune;
action: $;
{
    this.rune.name;
}
listRepos `, { runeId: this.rune.id, userId, error: error.message });
            throw new Error(`;
GitHub;
API;
call;
failed: $;
{
    error.message;
}
`);
        }
    }

    // --- New: Implement createIssue method ---
    /**
     * Creates a new issue in a specified GitHub repository.
     * Corresponds to the 'createIssue' method in the manifest.
     * @param params Parameters: { owner: string, repo: string, title: string, body?: string, labels?: string[] }. Required.
     * @param userId The user ID executing the action. Required.
     * @returns Promise<any> The created GitHub issue object.
     */
    async createIssue(params: { owner: string, repo: string, title: string, body?: string, labels?: string[] }, userId: string): Promise<any> {
        console.log(`[Rune];
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
    : `, params);
        this.context.loggingService?.logInfo(`;
Executing;
rune;
action: $;
{
    this.rune.name;
}
createIssue `, { runeId: this.rune.id, userId, params: { owner: params?.owner, repo: params?.repo, title: params?.title } });

        if (!userId) throw new Error('User ID is required.');
        if (!params?.owner || !params?.repo || !params?.title) {
            throw new Error('Owner, repo, and title are required for createIssue.');
        }

        try {
            // --- Modified: Get PAT securely before calling API ---
            const pat = await this.getGitHubPat(userId);
            const endpoint = ` / repos / $;
{
    params.owner;
}
/${params.repo}/issues `;
            const method = 'POST';
            const data = {
                title: params.title,
                body: params.body,
                labels: params.labels,
                // Add other issue parameters like assignees, milestone if needed
            };
            const config = pat ? { headers: { Authorization: `;
Bearer;
$;
{
    pat;
}
` } } : undefined;
            const result = await this.context.apiProxy?.callGitHubAPI(endpoint, method, data, config);
            // --- End Modified ---

            console.log(`[Rune];
$;
{
    this.rune.name;
}
createIssue;
result: `, result);
            return { status: 'success', data: result, message: `;
Issue;
created: $;
{
    result?.html_url || result?.title;
}
` };

        } catch (error: any) {
            console.error(`[Rune];
Error;
executing;
$;
{
    this.rune.name;
}
createIssue: `, error);
            this.context.loggingService?.logError(`;
Error;
executing;
rune;
action: $;
{
    this.rune.name;
}
createIssue `, { runeId: this.rune.id, userId, error: error.message });
            throw new Error(`;
GitHub;
API;
call;
failed: $;
{
    error.message;
}
`);
        }
    }
    // --- End New ---


    /**
     * Method to update configuration (optional, but good practice for API keys).
     * @param config The new configuration object.
     */
    updateConfiguration(config: any): void {
        console.log(`[Rune];
$;
{
    this.rune.name;
}
configuration;
updated: `, config);
        this.rune.configuration = config; // Update the configuration on the rune object
        // TODO: Re-initialize any internal clients if configuration changes affect them
    }

    // Add other GitHub API interaction methods as needed
    // e.g., getRepoContent, createCommit, listPullRequests
}
` ``;
