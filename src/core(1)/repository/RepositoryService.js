var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16, _17, _18, _19, _20, _21, _22, _23, _24;
""(__makeTemplateObject(["typescript\n// src/core/repository/RepositoryService.ts\n// \u5009\u5EAB\u670D\u52D9 (Repository Service) - \u6838\u5FC3\u6A21\u7D44\n// Manages interactions with code repositories (simulated Git in WebContainer).\n// Part of the Long-term Memory pillar (specifically for versioned file-based data).\n// Design Principle: Provides a standardized interface for repository operations.\n// --- Modified: Add more simulated Git commands (add, branch, checkout, merge, log, reset, revert, tag, fetch, remote) ---\n\nimport { SystemContext } from '../../interfaces';\nimport * as fs from 'fs/promises'; // Use fs/promises for async file operations\nimport * as path from 'path'; // Use path module\n// import { exec } from 'child_process'; // Use child_process for executing git commands (Node.js environment)\n// import { promisify } from 'util'; // For promisifying exec\n// const execPromise = promisify(exec);\n\n\n// Define the structure for a simulated repository state\ninterface SimulatedRepoState {\n    url: string;\n    branch: string;\n    status: 'clean' | 'modified' | 'syncing';\n    // Add other simulated state like commit history, branches, remotes if needed for more complex simulation\n    simulatedCommitHistory?: string[]; // Simple array of commit messages\n    simulatedBranches?: string[]; // Simple array of branch names\n}\n\n\nexport class RepositoryService {\n    private context: SystemContext;\n    // private loggingService: LoggingService; // Access via context\n\n    // Define a base directory for user repositories within the WebContainer filesystem\n    // In a real app, this would be user-specific and potentially synced storage.\n    private baseDir = '/app/user_repos'; // Example: repos stored in /app/user_repos\n\n    // In-memory state to track simulated repositories\n    // In a real app, this would be persisted and manage actual Git repos\n    private simulatedRepos: Map<string, SimulatedRepoState> = new Map();\n\n    constructor(context: SystemContext) {\n        this.context = context;\n        // this.loggingService = context.loggingService;\n        console.log('RepositoryService initialized (Simulated Git).');\n\n        // Ensure the base directory exists on startup\n        this.ensureBaseDirExists().catch(err => {\n            console.error('[RepositoryService] Failed to ensure base directory exists:', err);\n            this.context.loggingService?.logError('Failed to ensure RepositoryService base directory exists', { error: err.message });\n        });\n\n        // TODO: Load persisted repository state on startup\n        // For MVP, initialize with some dummy data if needed for testing\n        // this.simulatedRepos.set('my-dummy-repo', { url: 'https://github.com/simulated/dummy-repo.git', branch: 'main', status: 'clean' });\n    }\n\n    /**\n     * Ensures the base directory for user repositories exists.\n     * @returns Promise<void>\n     */\n    private async ensureBaseDirExists(): Promise<void> {\n        try {\n            await fs.mkdir(this.baseDir, { recursive: true });\n            console.log("], ["typescript\n// src/core/repository/RepositoryService.ts\n// \\u5009\\u5eAB\\u670d\\u52d9 (Repository Service) - \\u6838\\u5fc3\\u6a21\\u7d44\n// Manages interactions with code repositories (simulated Git in WebContainer).\\n// Part of the Long-term Memory pillar (specifically for versioned file-based data).\\n// Design Principle: Provides a standardized interface for repository operations.\\n// --- Modified: Add more simulated Git commands (add, branch, checkout, merge, log, reset, revert, tag, fetch, remote) ---\\n\\nimport { SystemContext } from '../../interfaces';\\nimport * as fs from 'fs/promises'; // Use fs/promises for async file operations\\nimport * as path from 'path'; // Use path module\\n// import { exec } from 'child_process'; // Use child_process for executing git commands (Node.js environment)\\n// import { promisify } from 'util'; // For promisifying exec\\n// const execPromise = promisify(exec);\\n\\n\\n// Define the structure for a simulated repository state\\ninterface SimulatedRepoState {\\n    url: string;\\n    branch: string;\\n    status: 'clean' | 'modified' | 'syncing';\\n    // Add other simulated state like commit history, branches, remotes if needed for more complex simulation\\n    simulatedCommitHistory?: string[]; // Simple array of commit messages\\n    simulatedBranches?: string[]; // Simple array of branch names\\n}\\n\\n\\nexport class RepositoryService {\\n    private context: SystemContext;\\n    // private loggingService: LoggingService; // Access via context\\n\\n    // Define a base directory for user repositories within the WebContainer filesystem\\n    // In a real app, this would be user-specific and potentially synced storage.\\n    private baseDir = '/app/user_repos'; // Example: repos stored in /app/user_repos\\n\\n    // In-memory state to track simulated repositories\\n    // In a real app, this would be persisted and manage actual Git repos\\n    private simulatedRepos: Map<string, SimulatedRepoState> = new Map();\\n\\n    constructor(context: SystemContext) {\\n        this.context = context;\\n        // this.loggingService = context.loggingService;\\n        console.log('RepositoryService initialized (Simulated Git).');\\n\\n        // Ensure the base directory exists on startup\\n        this.ensureBaseDirExists().catch(err => {\\n            console.error('[RepositoryService] Failed to ensure base directory exists:', err);\\n            this.context.loggingService?.logError('Failed to ensure RepositoryService base directory exists', { error: err.message });\\n        });\\n\\n        // TODO: Load persisted repository state on startup\\n        // For MVP, initialize with some dummy data if needed for testing\\n        // this.simulatedRepos.set('my-dummy-repo', { url: 'https://github.com/simulated/dummy-repo.git', branch: 'main', status: 'clean' });\\n    }\\n\\n    /**\\n     * Ensures the base directory for user repositories exists.\\n     * @returns Promise<void>\\n     */\\n    private async ensureBaseDirExists(): Promise<void> {\\n        try {\\n            await fs.mkdir(this.baseDir, { recursive: true });\\n            console.log("]))[RepositoryService];
Ensured;
base;
directory;
exists: $;
{
    this.baseDir;
}
");\n        } catch (error: any) {\n            // Ignore error if directory already exists\n            if (error.code !== 'EEXIST') {\n                throw error;\n            }\n        }\n    }\n\n    /**\n     * Resolves a repository path relative to the base directory.\n     * Prevents directory traversal attacks by ensuring the resolved path is within the base directory.\n     * @param repoName The name of the repository. Required.\\\n     * @returns The resolved absolute path to the repository directory.\n     * @throws Error if the resolved path is outside the base directory or repoName is invalid.\n     */\n    private resolveSafeRepoPath(repoName: string): string {\n        if (!repoName || repoName.includes('..') || repoName.includes('/') || repoName.includes('\\\\\\\\')) {\n             const errorMsg = ";
Invalid;
repository;
name: $;
{
    repoName;
}
";\n             console.error("[RepositoryService];
$;
{
    errorMsg;
}
");\n             this.context.loggingService?.logError(errorMsg, { repoName });\n             throw new Error('Invalid repository name.');\n        }\n        const absoluteBaseDir = path.resolve(this.baseDir);\n        const absoluteRepoPath = path.resolve(this.baseDir, repoName);\n\n        // Check if the resolved repo path is within the base directory\n        if (!absoluteRepoPath.startsWith(absoluteBaseDir + path.sep)) {\n            const errorMsg = ";
Attempted;
directory;
traversal;
with (repo)
    name: $;
{
    repoName;
}
";\n            console.error("[RepositoryService];
$;
{
    errorMsg;
}
");\n            this.context.loggingService?.logError(errorMsg, { repoName });\n            throw new Error('Invalid repository name.');\n        }\n\n        return absoluteRepoPath;\n    }\n\n    /**\n     * Simulates cloning a repository.\n     * In a real WebContainer, this would involve using a Git library or service.\n     * @param repoUrl The URL of the repository. Required.\n     * @param repoName The local name for the repository. Required.\n     * @param userId The user ID. Required.\n     * @returns Promise<void>\n     * @throws Error if cloning fails or repoName is invalid.\n     */\n    async cloneRepo(repoUrl: string, repoName: string, userId: string): Promise<void> {\n        console.log("[RepositoryService];
Simulating;
cloning;
repo: $;
{
    repoUrl;
}
as;
$;
{
    repoName;
}
for (user; $; { userId: userId }(__makeTemplateObject([");\n        this.context.loggingService?.logInfo("], [");\\n        this.context.loggingService?.logInfo("])))
    Attempting;
to;
clone;
repo: $;
{
    repoName;
}
", { repoUrl, repoName, userId });\n\n        if (!userId) {\n            console.warn('[RepositoryService] Cannot clone repo: User ID is required.');\n            this.context.loggingService?.logWarning('Cannot clone repo: User ID is required.');\n            throw new Error('User ID is required.');\n        }\n         if (!repoUrl || !repoName) {\n             throw new Error('repoUrl and repoName are required for cloneRepo.');\n         }\n         if (this.simulatedRepos.has(repoName)) {\n             throw new Error(";
Repository;
'${repoName}';
already;
exists.(__makeTemplateObject([");\n         }\n\n\n        try {\n            const safeRepoPath = this.resolveSafeRepoPath(repoName);\n\n            // Simulate cloning process\n            // In a real Node.js environment, you might use:\n            // await execPromise("], [");\\n         }\\n\\n\\n        try {\\n            const safeRepoPath = this.resolveSafeRepoPath(repoName);\\n\\n            // Simulate cloning process\\n            // In a real Node.js environment, you might use:\\n            // await execPromise("]));
git;
clone;
$;
{
    repoUrl;
}
$;
{
    safeRepoPath;
}
");\n            // In WebContainer, you might need a JS Git library or a backend service.\n            // For MVP, just simulate directory creation and state update.\n\n            await fs.mkdir(safeRepoPath, { recursive: true }); // Simulate creating the repo directory\n            console.log("[RepositoryService];
Simulated;
directory;
created;
for (repo; ; )
    : $;
{
    repoName;
}
");\n\n            // Simulate initial commit/branch\n            // await fs.writeFile(path.join(safeRepoPath, 'README.md'), ";
#;
$;
{
    repoName;
}
n;
nSimulated;
repository.(__makeTemplateObject([");\n            // await execPromise("], [");\\n            // await execPromise("]));
git;
init(__makeTemplateObject([", { cwd: safeRepoPath });\n            // await execPromise("], [", { cwd: safeRepoPath });\\n            // await execPromise("]));
git;
add.(__makeTemplateObject([", { cwd: safeRepoPath });\n            // await execPromise("], [", { cwd: safeRepoPath });\\n            // await execPromise("]));
git;
commit - m;
"Initial simulated commit\\\"`, { cwd: safeRepoPath });\n            // await execPromise(`git branch -M main`, { cwd: safeRepoPath }); // Simulate setting main branch\n            // await execPromise(`git remote add origin ${repoUrl}`, { cwd: safeRepoPath }); // Simulate adding remote\n\n            // Update in-memory state\n            this.simulatedRepos.set(repoName, {\n                url: repoUrl,\n                branch: 'main', // Assume 'main' branch initially\n                status: 'clean', // Assume 'clean' status initially\n                simulatedCommitHistory: ['Initial simulated commit'], // Add initial commit\n                simulatedBranches: ['main'], // Add initial branch\n            });\n\n            console.log(`[RepositoryService] Simulated cloning successful for repo: ${repoName}`);\n            this.context.loggingService?.logInfo(`Simulated cloning successful for repo: ${repoName}`, { repoName, userId });\n\n            // TODO: Publish a 'repo_cloned' event\n\n        } catch (error: any) {\n            console.error(`[RepositoryService] Error simulating cloning repo ${repoName}:`, error.message);\n            this.context.loggingService?.logError(`Error simulating cloning repo: ${repoName}`, { repoName, userId, error: error.message });\n            throw new Error(`Simulated cloning failed for repo ${repoName}: ${error.message}`);\n        }\n    }\n\n    /**\n     * Simulates adding changes to the staging area.\n     * @param repoName The name of the repository. Required.\n     * @param userId The user ID. Required.\n     * @returns Promise<void>\n     * @throws Error if adding fails or repoName is invalid/not found.\n     */\n    async addChanges(repoName: string, userId: string): Promise<void> {\n        console.log(`[RepositoryService] Simulating adding changes in repo: ${repoName} for user ${userId}`);\n        this.context.loggingService?.logInfo(`Attempting to add changes in repo: ${repoName}`, { repoName, userId });\n\n        if (!userId) {\n            console.warn('[RepositoryService] Cannot add changes: User ID is required.');\n            this.context.loggingService?.logWarning('Cannot add changes: User ID is required.');\n            throw new Error('User ID is required.');\n        }\n         if (!repoName) {\n             throw new Error('repoName is required for addChanges.');\n         }\n\n        try {\n            // Check if the repo exists in simulated state\n            if (!this.simulatedRepos.has(repoName)) {\n                 throw new Error(`Repository '${repoName}' not found or not cloned.`);\n            }\n\n            // Simulate adding process\n            // In a real Node.js environment:\n            // await execPromise(`git add .`, { cwd: this.resolveSafeRepoPath(repoName) }); // Add all changes\n\n            // Simulate state update (adding makes it 'modified')\n            const repoState = this.simulatedRepos.get(repoName)!;\n            repoState.status = 'modified'; // Assume adding makes it modified\n            this.simulatedRepos.set(repoName, repoState);\n\n\n            console.log(`[RepositoryService] Simulated adding successful in repo: ${repoName}`);\n            this.context.loggingService?.logInfo(`Simulated adding successful in repo: ${repoName}`, { repoName, userId });\n\n            // TODO: Publish a 'repo_added' event\n\n        } catch (error: any) {\n            console.error(`[RepositoryService] Error simulating adding changes in repo ${repoName}:`, error.message);\n            this.context.loggingService?.logError(`Error simulating adding changes in repo: ${repoName}`, { repoName, userId, error: error.message });\n            throw new Error(`Simulated adding changes failed in repo ${repoName}: ${error.message}`);\n        }\n    }\n\n\n    /**
    * Simulates;
committing;
changes in a;
repository.
    * ;
repoName;
The;
name;
of;
the;
repository.Required.
    * ;
commitMessage;
The;
commit;
message.Required.
    * ;
userId;
The;
user;
ID.Required.
    * ;
(Promise)
    * ();
Error;
if (committing)
    fails;
or;
repoName;
is;
invalid / not;
found.
    * /;
async;
commitChanges(repoName, string, commitMessage, string, userId, string);
Promise < void  > {
    console: console,
    : .log("[RepositoryService] Simulating committing changes in repo: ".concat(repoName, " for user ").concat(userId)),
    this: (_a = .context.loggingService) === null || _a === void 0 ? void 0 : _a.logInfo("Attempting to commit changes in repo: ".concat(repoName), { repoName: repoName, userId: userId, commitMessage: commitMessage }),
    if: function (, userId) {
        var _a;
        console.warn('[RepositoryService] Cannot commit changes: User ID is required.');
        (_a = this.context.loggingService) === null || _a === void 0 ? void 0 : _a.logWarning('Cannot commit changes: User ID is required.');
        throw new Error('User ID is required.');
    },
    if: function (, repoName) { }
} || !commitMessage;
{
    throw new Error('repoName and commitMessage are required for commitChanges.');
}
try {
    var safeRepoPath = this.resolveSafeRepoPath(repoName);
    // Check if the repo exists in simulated state
    if (!this.simulatedRepos.has(repoName)) {
        throw new Error("Repository '".concat(repoName, "' not found or not cloned."));
    }
    // Simulate committing process
    // In a real Node.js environment:
    // await execPromise(`git add .`, { cwd: safeRepoPath }); // Add all changes
    // await execPromise(`git commit -m \"${commitMessage}\"`, { cwd: safeRepoPath });
    // Simulate state update
    var repoState_1 = this.simulatedRepos.get(repoName);
    repoState_1.status = 'modified'; // After commit, it's modified locally, needs push
    // Simulate adding to commit history
    repoState_1.simulatedCommitHistory = __spreadArray(__spreadArray([], (repoState_1.simulatedCommitHistory || []), true), [commitMessage], false);
    this.simulatedRepos.set(repoName, repoState_1);
    console.log("[RepositoryService] Simulated committing successful in repo: ".concat(repoName));
    (_b = this.context.loggingService) === null || _b === void 0 ? void 0 : _b.logInfo("Simulated committing successful in repo: ".concat(repoName), { repoName: repoName, userId: userId });
    // TODO: Publish a 'repo_committed' event
}
catch (error) {
    console.error("[RepositoryService] Error simulating committing in repo ".concat(repoName, ":"), error.message);
    (_c = this.context.loggingService) === null || _c === void 0 ? void 0 : _c.logError("Error simulating committing in repo: ".concat(repoName), { repoName: repoName, userId: userId, error: error.message });
    throw new Error("Simulated committing failed in repo ".concat(repoName, ": ").concat(error.message));
}
/**
 * Simulates pushing changes from a repository.
 * @param repoName The name of the repository. Required.
 * @param userId The user ID. Required.
 * @returns Promise<void>
 * @throws Error if pushing fails or repoName is invalid/not found.
 */
async;
pushChanges(repoName, string, userId, string);
Promise < void  > {
    console: console,
    : .log("[RepositoryService] Simulating pushing changes from repo: ".concat(repoName, " for user ").concat(userId)),
    this: (_d = .context.loggingService) === null || _d === void 0 ? void 0 : _d.logInfo("Attempting to push changes from repo: ".concat(repoName), { repoName: repoName, userId: userId }),
    if: function (, userId) {
        var _a;
        console.warn('[RepositoryService] Cannot push changes: User ID is required.');
        (_a = this.context.loggingService) === null || _a === void 0 ? void 0 : _a.logWarning('Cannot push changes: User ID is required.');
        throw new Error('User ID is required.');
    },
    if: function (, repoName) {
        throw new Error('repoName is required for pushChanges.');
    },
    try: {
        const: safeRepoPath = this.resolveSafeRepoPath(repoName),
        : .simulatedRepos.has(repoName)
    }
};
{
    throw new Error("Repository '".concat(repoName, "' not found or not cloned."));
}
var repoState = this.simulatedRepos.get(repoName);
if (repoState.status === 'syncing') {
    console.warn("[RepositoryService] Repo ".concat(repoName, " is already syncing. Skipping push."));
    (_e = this.context.loggingService) === null || _e === void 0 ? void 0 : _e.logWarning("Repo already syncing. Skipping push: ".concat(repoName), { repoName: repoName, userId: userId });
    return; // Do not throw, just skip if already syncing
}
repoState.status = 'syncing'; // Indicate syncing
this.simulatedRepos.set(repoName, repoState);
// Simulate pushing process
// In a real Node.js environment:
// await execPromise(`git push origin ${repoState.branch}`, { cwd: safeRepoPath });
// Simulate network delay
await new Promise(function (resolve) { return setTimeout(resolve, 2000); });
// Simulate success/failure
var success = Math.random() > 0.1; // 90% chance of simulated success
if (success) {
    repoState.status = 'clean'; // Back to clean after successful push
    console.log("[RepositoryService] Simulated pushing successful from repo: ".concat(repoName));
    (_f = this.context.loggingService) === null || _f === void 0 ? void 0 : _f.logInfo("Simulated pushing successful from repo: ".concat(repoName), { repoName: repoName, userId: userId });
    // TODO: Publish a 'repo_pushed' event
}
else {
    repoState.status = 'modified'; // Stay modified if push failed
    var errorMessage = "Simulated pushing failed from repo ".concat(repoName, ".");
    console.error("[RepositoryService] ".concat(errorMessage));
    (_g = this.context.loggingService) === null || _g === void 0 ? void 0 : _g.logError("Simulated pushing failed from repo: ".concat(repoName), { repoName: repoName, userId: userId, error: errorMessage });
    // TODO: Publish a 'repo_push_failed' event
    throw new Error(errorMessage); // Throw error for caller
}
this.simulatedRepos.set(repoName, repoState); // Update final state
try { }
catch (error) {
    console.error("[RepositoryService] Error simulating pushing from repo ".concat(repoName, ":"), error.message);
    (_h = this.context.loggingService) === null || _h === void 0 ? void 0 : _h.logError("Error simulating pushing from repo: ".concat(repoName), { repoName: repoName, userId: userId, error: error.message });
    // Ensure status is not stuck on syncing if an error occurred before final status update
    var repoState_2 = this.simulatedRepos.get(repoName);
    if (repoState_2 && repoState_2.status === 'syncing') {
        repoState_2.status = 'modified'; // Assume modified if push failed
        this.simulatedRepos.set(repoName, repoState_2);
    }
    throw new Error("Simulated pushing failed from repo ".concat(repoName, ": ").concat(error.message));
}
/**
 * Simulates pulling changes to a repository.
 * @param repoName The name of the repository. Required.
 * @param userId The user ID. Required.
 * @returns Promise<void>
 * @throws Error if pulling fails or repoName is invalid/not found.
 */
async;
pullChanges(repoName, string, userId, string);
Promise < void  > {
    console: console,
    : .log("[RepositoryService] Simulating pulling changes to repo: ".concat(repoName, " for user ").concat(userId)),
    this: (_j = .context.loggingService) === null || _j === void 0 ? void 0 : _j.logInfo("Attempting to pull changes to repo: ".concat(repoName), { repoName: repoName, userId: userId }),
    if: function (, userId) {
        var _a;
        console.warn('[RepositoryService] Cannot pull changes: User ID is required.');
        (_a = this.context.loggingService) === null || _a === void 0 ? void 0 : _a.logWarning('Cannot pull changes: User ID is required.');
        throw new Error('User ID is required.');
    },
    if: function (, repoName) {
        throw new Error('repoName is required for pullChanges.');
    },
    try: {
        const: safeRepoPath = this.resolveSafeRepoPath(repoName),
        : .simulatedRepos.has(repoName)
    }
};
{
    throw new Error("Repository '".concat(repoName, "' not found or not cloned."));
}
var repoState = this.simulatedRepos.get(repoName);
if (repoState.status === 'syncing') {
    console.warn("[RepositoryService] Repo ".concat(repoName, " is already syncing. Skipping pull."));
    (_k = this.context.loggingService) === null || _k === void 0 ? void 0 : _k.logWarning("Repo already syncing. Skipping pull: ".concat(repoName), { repoName: repoName, userId: userId });
    return; // Do not throw, just skip if already syncing
}
repoState.status = 'syncing'; // Indicate syncing
this.simulatedRepos.set(repoName, repoState);
// Simulate pulling process
// In a real Node.js environment:
// await execPromise(`git pull origin ${repoState.branch}`, { cwd: safeRepoPath });
// Simulate network delay
await new Promise(function (resolve) { return setTimeout(resolve, 1500); });
// Simulate success/failure and potential changes
var success = Math.random() > 0.1; // 90% chance of simulated success
var hasChanges = success && Math.random() > 0.5; // 50% chance of simulated changes on success
if (success) {
    repoState.status = hasChanges ? 'modified' : 'clean'; // Modified if changes pulled, clean otherwise
    console.log("[RepositoryService] Simulated pulling successful to repo: ".concat(repoName, ". Changes: ").concat(hasChanges));
    (_l = this.context.loggingService) === null || _l === void 0 ? void 0 : _l.logInfo("Simulated pulling successful to repo: ".concat(repoName, ". Changes: ").concat(hasChanges), { repoName: repoName, userId: userId, hasChanges: hasChanges });
    // TODO: Publish a 'repo_pulled' event (include hasChanges info)
}
else {
    repoState.status = 'modified'; // Stay modified if pull failed
    var errorMessage = "Simulated pulling failed to repo ".concat(repoName, ".");
    console.error("[RepositoryService] ".concat(errorMessage));
    (_m = this.context.loggingService) === null || _m === void 0 ? void 0 : _m.logError("Simulated pulling failed to repo: ".concat(repoName), { repoName: repoName, userId: userId, error: errorMessage });
    // TODO: Publish a 'repo_pull_failed' event
    throw new Error(errorMessage); // Throw error for caller
}
this.simulatedRepos.set(repoName, repoState); // Update final state
try { }
catch (error) {
    console.error("[RepositoryService] Error simulating pulling to repo ".concat(repoName, ":"), error.message);
    (_o = this.context.loggingService) === null || _o === void 0 ? void 0 : _o.logError("Error simulating pulling to repo: ".concat(repoName), { repoName: repoName, userId: userId, error: error.message });
    // Ensure status is not stuck on syncing if an error occurred before final status update
    var repoState_3 = this.simulatedRepos.get(repoName);
    if (repoState_3 && repoState_3.status === 'syncing') {
        repoState_3.status = 'modified'; // Assume modified if pull failed
        this.simulatedRepos.set(repoName, repoState_3);
    }
    throw new Error("Simulated pulling failed to repo ".concat(repoName, ": ").concat(error.message));
}
/**
 * Simulates getting the status of a repository (e.g., clean, modified, syncing).
 * @param repoName The name of the repository. Required.
 * @param userId The user ID. Required.
 * @returns Promise<any> The simulated repository status.
 * @throws Error if repoName is invalid or repo not found.
 */
async;
getRepoStatus(repoName, string, userId, string);
Promise < any > {
    console: console,
    : .log("[RepositoryService] Simulating getting status for repo: ".concat(repoName, " for user ").concat(userId)),
    this: (_p = .context.loggingService) === null || _p === void 0 ? void 0 : _p.logInfo("Attempting to get status for repo: ".concat(repoName), { repoName: repoName, userId: userId }),
    if: function (, userId) {
        var _a;
        console.warn('[RepositoryService] Cannot get repo status: User ID is required.');
        (_a = this.context.loggingService) === null || _a === void 0 ? void 0 : _a.logWarning('Cannot get repo status: User ID is required.');
        throw new Error('User ID is required.');
    },
    if: function (, repoName) {
        throw new Error('repoName is required for getRepoStatus.');
    },
    try: {
        // Check if the repo exists in simulated state
        const: repoState = this.simulatedRepos.get(repoName),
        if: function (, repoState) {
            throw new Error("Repository '".concat(repoName, "' not found or not cloned."));
        }
        // Simulate getting status
        // In a real Node.js environment:
        // const { stdout } = await execPromise(`git status --porcelain`, { cwd: this.resolveSafeRepoPath(repoName) });
        // const status = stdout.trim() === '' ? 'clean' : 'modified';
        // For MVP, return the simulated state status
        ,
        // Simulate getting status
        // In a real Node.js environment:
        // const { stdout } = await execPromise(`git status --porcelain`, { cwd: this.resolveSafeRepoPath(repoName) });
        // const status = stdout.trim() === '' ? 'clean' : 'modified';
        // For MVP, return the simulated state status
        console: console,
        : .log("[RepositoryService] Simulated status for repo ".concat(repoName, ": ").concat(repoState.status)),
        this: (_q = .context.loggingService) === null || _q === void 0 ? void 0 : _q.logInfo("Simulated status for repo ".concat(repoName, ": ").concat(repoState.status), { repoName: repoName, userId: userId, status: repoState.status }),
        return: { status: 'success', data: { status: repoState.status } }
    },
    catch: function (error) {
        var _a;
        console.error("[RepositoryService] Error simulating getting status for repo ".concat(repoName, ":"), error.message);
        (_a = this.context.loggingService) === null || _a === void 0 ? void 0 : _a.logError("Error simulating getting status for repo: ".concat(repoName), { repoName: repoName, userId: userId, error: error.message });
        throw new Error("Simulated getting status failed for repo ".concat(repoName, ": ").concat(error.message));
    }
};
/**
* Simulates listing files within a repository directory.
* Reuses FileService logic but scoped to a specific repo directory.
* @param repoName The name of the repository. Required.
* @param dirPath The path within the repository. Defaults to '/'. Required.
* @param userId The user ID. Required.
* @returns Promise<string[]> An array of file and directory names.
* @throws Error if repoName or dirPath is invalid or repo not found.
*/
async;
listFilesInRepo(repoName, string, dirPath, string = '/', userId, string);
Promise < string[] > {
    console: console,
    : .log("[RepositoryService] Simulating listing files in repo: ".concat(repoName, ", path: ").concat(dirPath, " for user ").concat(userId)),
    this: (_r = .context.loggingService) === null || _r === void 0 ? void 0 : _r.logInfo("Attempting to list files in repo: ".concat(repoName, ", path: ").concat(dirPath), { repoName: repoName, dirPath: dirPath, userId: userId }),
    if: function (, userId) {
        var _a;
        console.warn('[RepositoryService] Cannot list files in repo: User ID is required.');
        (_a = this.context.loggingService) === null || _a === void 0 ? void 0 : _a.logWarning('Cannot list files in repo: User ID is required.');
        throw new Error('User ID is required.');
    },
    if: function (, repoName) {
        throw new Error('repoName is required for listFilesInRepo.');
    },
    try: {
        : .simulatedRepos.has(repoName)
    }
};
{
    throw new Error("Repository '".concat(repoName, "' not found or not cloned."));
}
// Resolve the path relative to the specific repository's directory within baseDir
var repoAbsolutePath = this.resolveSafeRepoPath(repoName);
var targetPath = path.join(repoAbsolutePath, dirPath);
// Ensure the target path is within the repo directory
if (!targetPath.startsWith(repoAbsolutePath + path.sep) && targetPath !== repoAbsolutePath) {
    var errorMsg = "Attempted directory traversal within repo: ".concat(dirPath);
    console.error("[RepositoryService] ".concat(errorMsg));
    (_s = this.context.loggingService) === null || _s === void 0 ? void 0 : _s.logError(errorMsg, { repoName: repoName, dirPath: dirPath });
    throw new Error('Invalid directory path within repository.');
}
// Use fs.readdir to list entries
var entries = await fs.readdir(targetPath);
console.log("[RepositoryService] Simulated listing successful in repo ".concat(repoName, ", path ").concat(dirPath, "."));
(_t = this.context.loggingService) === null || _t === void 0 ? void 0 : _t.logInfo("Simulated listing successful in repo: ".concat(repoName, ", path: ").concat(dirPath), { repoName: repoName, dirPath: dirPath, userId: userId, count: entries.length });
return entries;
try { }
catch (error) {
    console.error("[RepositoryService] Error simulating listing files in repo ".concat(repoName, ", path ").concat(dirPath, ":"), error.message);
    (_u = this.context.loggingService) === null || _u === void 0 ? void 0 : _u.logError("Error simulating listing files in repo: ".concat(repoName, ", path: ").concat(dirPath), { repoName: repoName, dirPath: dirPath, userId: userId, error: error.message });
    throw new Error("Simulated listing files failed in repo ".concat(repoName, ", path ").concat(dirPath, ": ").concat(error.message));
}
// --- New: Simulate creating a branch ---
/**
 * Simulates creating a new branch in a repository.
 * @param repoName The name of the repository. Required.
 * @param branchName The name of the new branch. Required.
 * @param userId The user ID. Required.
 * @returns Promise<void>
 * @throws Error if branching fails or repoName/branchName is invalid/not found.
 */
async;
createBranch(repoName, string, branchName, string, userId, string);
Promise < void  > {
    console: console,
    : .log("[RepositoryService] Simulating creating branch '".concat(branchName, "' in repo: ").concat(repoName, " for user ").concat(userId)),
    this: (_v = .context.loggingService) === null || _v === void 0 ? void 0 : _v.logInfo("Attempting to create branch: ".concat(branchName, " in repo: ").concat(repoName), { repoName: repoName, branchName: branchName, userId: userId }),
    if: function (, userId) { },
    throw: new Error('User ID is required.'),
    if: function (, repoName) { }
} || !branchName;
throw new Error('repoName and branchName are required for createBranch.');
try {
    // Check if the repo exists in simulated state
    var repoState_4 = this.simulatedRepos.get(repoName);
    if (!repoState_4) {
        throw new Error("Repository '".concat(repoName, "' not found or not cloned."));
    }
    // Simulate creating the branch
    if ((_w = repoState_4.simulatedBranches) === null || _w === void 0 ? void 0 : _w.includes(branchName)) {
        console.warn("[RepositoryService] Branch '".concat(branchName, "' already exists in repo ").concat(repoName, "."));
        // Optionally throw an error or just return success
        return; // Simulate success if branch already exists
    }
    repoState_4.simulatedBranches = __spreadArray(__spreadArray([], (repoState_4.simulatedBranches || []), true), [branchName], false);
    this.simulatedRepos.set(repoName, repoState_4);
    console.log("[RepositoryService] Simulated creating branch successful: ".concat(branchName, " in repo ").concat(repoName));
    (_x = this.context.loggingService) === null || _x === void 0 ? void 0 : _x.logInfo("Simulated creating branch successful: ".concat(branchName, " in repo: ").concat(repoName), { repoName: repoName, branchName: branchName, userId: userId });
    // TODO: Publish a 'repo_branch_created' event
}
catch (error) {
    console.error("[RepositoryService] Error simulating creating branch ".concat(branchName, " in repo ").concat(repoName, ":"), error.message);
    (_y = this.context.loggingService) === null || _y === void 0 ? void 0 : _y.logError("Error simulating creating branch: ".concat(branchName, " in repo: ").concat(repoName), { repoName: repoName, branchName: branchName, userId: userId, error: error.message });
    throw new Error("Simulated creating branch failed: ".concat(error.message));
}
// --- End New ---
// --- New: Simulate checking out a branch ---
/**
 * Simulates checking out a branch in a repository.
 * @param repoName The name of the repository. Required.
 * @param branchName The name of the branch to checkout. Required.
 * @param userId The user ID. Required.
 * @returns Promise<void>
 * @throws Error if checkout fails or repoName/branchName is invalid/not found.
 */
async;
checkoutBranch(repoName, string, branchName, string, userId, string);
Promise < void  > {
    console: console,
    : .log("[RepositoryService] Simulating checking out branch '".concat(branchName, "' in repo: ").concat(repoName, " for user ").concat(userId)),
    this: (_z = .context.loggingService) === null || _z === void 0 ? void 0 : _z.logInfo("Attempting to checkout branch: ".concat(branchName, " in repo: ").concat(repoName), { repoName: repoName, branchName: branchName, userId: userId }),
    if: function (, userId) { },
    throw: new Error('User ID is required.'),
    if: function (, repoName) { }
} || !branchName;
throw new Error('repoName and branchName are required for checkoutBranch.');
try {
    // Check if the repo exists in simulated state
    var repoState_5 = this.simulatedRepos.get(repoName);
    if (!repoState_5) {
        throw new Error("Repository '".concat(repoName, "' not found or not cloned."));
    }
    // Simulate checking out the branch
    if (!((_0 = repoState_5.simulatedBranches) === null || _0 === void 0 ? void 0 : _0.includes(branchName))) {
        throw new Error("Branch '".concat(branchName, "' not found in repo ").concat(repoName, "."));
    }
    repoState_5.branch = branchName; // Update the current branch
    repoState_5.status = 'clean'; // Assume checkout makes it clean (no pending changes from previous branch)
    this.simulatedRepos.set(repoName, repoState_5);
    console.log("[RepositoryService] Simulated checking out branch successful: ".concat(branchName, " in repo ").concat(repoName));
    (_1 = this.context.loggingService) === null || _1 === void 0 ? void 0 : _1.logInfo("Simulated checking out branch successful: ".concat(branchName, " in repo: ").concat(repoName), { repoName: repoName, branchName: branchName, userId: userId });
    // TODO: Publish a 'repo_branch_checkedout' event
}
catch (error) {
    console.error("[RepositoryService] Error simulating checking out branch ".concat(branchName, " in repo ").concat(repoName, ":"), error.message);
    (_2 = this.context.loggingService) === null || _2 === void 0 ? void 0 : _2.logError("Error simulating checking out branch: ".concat(branchName, " in repo: ").concat(repoName), { repoName: repoName, branchName: branchName, userId: userId, error: error.message });
    throw new Error("Simulated checking out branch failed: ".concat(error.message));
}
// --- End New ---
// --- New: Simulate merging a branch ---
/**
 * Simulates merging a branch into the current branch.
 * @param repoName The name of the repository. Required.
 * @param sourceBranch The name of the branch to merge from. Required.
 * @param userId The user ID. Required.
 * @returns Promise<void>
 * @throws Error if merging fails or repoName/branchName is invalid/not found.
 */
async;
mergeBranch(repoName, string, sourceBranch, string, userId, string);
Promise < void  > {
    console: console,
    : .log("[RepositoryService] Simulating merging branch '".concat(sourceBranch, "' into '").concat((_3 = this.simulatedRepos.get(repoName)) === null || _3 === void 0 ? void 0 : _3.branch, "' in repo: ").concat(repoName, " for user ").concat(userId)),
    this: (_4 = .context.loggingService) === null || _4 === void 0 ? void 0 : _4.logInfo("Attempting to merge branch: ".concat(sourceBranch, " in repo: ").concat(repoName), { repoName: repoName, sourceBranch: sourceBranch, userId: userId }),
    if: function (, userId) { },
    throw: new Error('User ID is required.'),
    if: function (, repoName) { }
} || !sourceBranch;
throw new Error('repoName and sourceBranch are required for mergeBranch.');
try {
    // Check if the repo exists in simulated state
    var repoState_6 = this.simulatedRepos.get(repoName);
    if (!repoState_6) {
        throw new Error("Repository '".concat(repoName, "' not found or not cloned."));
    }
    // Simulate merging the branch
    if (!((_5 = repoState_6.simulatedBranches) === null || _5 === void 0 ? void 0 : _5.includes(sourceBranch))) {
        throw new Error("Source branch '".concat(sourceBranch, "' not found in repo ").concat(repoName, "."));
    }
    if (repoState_6.branch === sourceBranch) {
        throw new Error("Cannot merge branch '".concat(sourceBranch, "' into itself."));
    }
    // Simulate merge process (might result in conflicts or changes)
    var hasConflicts = Math.random() > 0.8; // 20% chance of simulated conflicts
    var hasChanges_1 = Math.random() > 0.3; // 70% chance of simulated changes after merge
    if (hasConflicts) {
        repoState_6.status = 'modified'; // Conflicts mean modified state
        var errorMessage = "Simulated merge conflicts in repo ".concat(repoName, " from branch ").concat(sourceBranch, ".");
        console.error("[RepositoryService] ".concat(errorMessage));
        (_6 = this.context.loggingService) === null || _6 === void 0 ? void 0 : _6.logError("Simulated merge conflicts in repo: ".concat(repoName), { repoName: repoName, sourceBranch: sourceBranch, userId: userId });
        // TODO: Publish a 'repo_merge_conflicts' event
        throw new Error(errorMessage); // Throw error for caller
    }
    else if (hasChanges_1) {
        repoState_6.status = 'modified'; // Changes after merge
        console.log("[RepositoryService] Simulated merging successful with changes in repo: ".concat(repoName));
        (_7 = this.context.loggingService) === null || _7 === void 0 ? void 0 : _7.logInfo("Simulated merging successful with changes in repo: ".concat(repoName), { repoName: repoName, sourceBranch: sourceBranch, userId: userId });
        // TODO: Publish a 'repo_merged_with_changes' event
    }
    else {
        repoState_6.status = 'clean'; // No changes after merge
        console.log("[RepositoryService] Simulated merging successful (no changes) in repo: ".concat(repoName));
        (_8 = this.context.loggingService) === null || _8 === void 0 ? void 0 : _8.logInfo("Simulated merging successful (no changes) in repo: ".concat(repoName), { repoName: repoName, sourceBranch: sourceBranch, userId: userId });
        // TODO: Publish a 'repo_merged_clean' event
    }
    // Simulate adding a merge commit to history (optional)
    repoState_6.simulatedCommitHistory = __spreadArray(__spreadArray([], (repoState_6.simulatedCommitHistory || []), true), ["Merge branch '".concat(sourceBranch, "' into ").concat(repoState_6.branch)], false);
    this.simulatedRepos.set(repoName, repoState_6); // Update final state
}
catch (error) {
    console.error("[RepositoryService] Error simulating merging branch ".concat(sourceBranch, " in repo ").concat(repoName, ":"), error.message);
    (_9 = this.context.loggingService) === null || _9 === void 0 ? void 0 : _9.logError("Error simulating merging branch: ".concat(sourceBranch, " in repo: ").concat(repoName), { repoName: repoName, sourceBranch: sourceBranch, userId: userId, error: error.message });
    // Ensure status is not stuck on syncing if an error occurred before final status update
    var repoState_7 = this.simulatedRepos.get(repoName);
    if (repoState_7 && repoState_7.status === 'syncing') { // Should not be 'syncing' for merge, but safety check
        repoState_7.status = 'modified';
        this.simulatedRepos.set(repoName, repoState_7);
    }
    throw new Error("Simulated merging branch failed: ".concat(error.message));
}
// --- End New ---
// --- New: Simulate getting commit log ---
/**
 * Simulates getting the commit log for a repository.
 * @param repoName The name of the repository. Required.
 * @param userId The user ID. Required.
 * @param limit Optional: Maximum number of log entries. Defaults to 10.
 * @returns Promise<any> Simulated commit log data.
 * @throws Error if getting log fails or repoName is invalid/not found.
 */
async;
getCommitLog(repoName, string, userId, string, limit, number = 10);
Promise < any > {
    console: console,
    : .log("[RepositoryService] Simulating getting commit log for repo: ".concat(repoName, " for user ").concat(userId, ", limit: ").concat(limit)),
    this: (_10 = .context.loggingService) === null || _10 === void 0 ? void 0 : _10.logInfo("Attempting to get commit log for repo: ".concat(repoName), { repoName: repoName, userId: userId, limit: limit }),
    if: function (, userId) { },
    throw: new Error('User ID is required.'),
    if: function (, repoName) { },
    throw: new Error('repoName is required for getCommitLog.'),
    try: {
        // Check if the repo exists in simulated state
        const: repoState = this.simulatedRepos.get(repoName),
        if: function (, repoState) {
            throw new Error("Repository '".concat(repoName, "' not found or not cloned."));
        }
        // Simulate getting the log
        // In a real Node.js environment:
        // const { stdout } = await execPromise(`git log --pretty=oneline -n ${limit}`, { cwd: this.resolveSafeRepoPath(repoName) });
        // For MVP, return the simulated commit history
        ,
        // Simulate getting the log
        // In a real Node.js environment:
        // const { stdout } = await execPromise(`git log --pretty=oneline -n ${limit}`, { cwd: this.resolveSafeRepoPath(repoName) });
        // For MVP, return the simulated commit history
        const: simulatedLog = (repoState.simulatedCommitHistory || []).slice(-limit).reverse(), // Get last 'limit' commits, newest first
        const: formattedLog = simulatedLog.map(function (msg, index) {
            var commitHash = "sim".concat(index + 1, "abcde"); // Simulated hash
            var author = 'Simulated User <simulated@example.com>';
            var date = new Date(Date.now() - index * 86400000).toISOString(); // Simulate decreasing date
            return "commit ".concat(commitHash, "\nAuthor: ").concat(author, "\nDate:   ").concat(date, "\n\n    ").concat(msg, "\n");
        }).join('\n'),
        console: console,
        : .log("[RepositoryService] Simulated commit log for repo ".concat(repoName, " (").concat(simulatedLog.length, " entries).")),
        this: (_11 = .context.loggingService) === null || _11 === void 0 ? void 0 : _11.logInfo("Simulated commit log for repo ".concat(repoName, " (").concat(simulatedLog.length, " entries)."), { repoName: repoName, userId: userId, count: simulatedLog.length }),
        return: { status: 'success', data: { log: formattedLog, commits: simulatedLog } }
    },
    catch: function (error) {
        var _a;
        console.error("[RepositoryService] Error simulating getting commit log for repo ".concat(repoName, ":"), error.message);
        (_a = this.context.loggingService) === null || _a === void 0 ? void 0 : _a.logError("Error simulating getting commit log for repo: ".concat(repoName), { repoName: repoName, userId: userId, error: error.message });
        throw new Error("Simulated getting commit log failed for repo ".concat(repoName, ": ").concat(error.message));
    }
};
// --- End New ---
// --- New: Simulate resetting changes ---
/**
 * Simulates resetting changes in a repository (e.g., hard reset to HEAD).
 * @param repoName The name of the repository. Required.
 * @param userId The user ID. Required.
 * @returns Promise<void>
 * @throws Error if resetting fails or repoName is invalid/not found.
 */
async;
resetChanges(repoName, string, userId, string);
Promise < void  > {
    console: console,
    : .log("[RepositoryService] Simulating resetting changes in repo: ".concat(repoName, " for user ").concat(userId)),
    this: (_12 = .context.loggingService) === null || _12 === void 0 ? void 0 : _12.logInfo("Attempting to reset changes in repo: ".concat(repoName), { repoName: repoName, userId: userId }),
    if: function (, userId) { },
    throw: new Error('User ID is required.'),
    if: function (, repoName) { },
    throw: new Error('repoName is required for resetChanges.'),
    try: {
        // Check if the repo exists in simulated state
        const: repoState = this.simulatedRepos.get(repoName),
        if: function (, repoState) {
            throw new Error("Repository '".concat(repoName, "' not found or not cloned."));
        }
        // Simulate resetting changes
        // In a real Node.js environment:
        // await execPromise(`git reset --hard HEAD`, { cwd: this.resolveSafeRepoPath(repoName) });
        // Simulate state update
        ,
        // Simulate resetting changes
        // In a real Node.js environment:
        // await execPromise(`git reset --hard HEAD`, { cwd: this.resolveSafeRepoPath(repoName) });
        // Simulate state update
        repoState: repoState,
        : .status = 'clean', // Reset makes it clean
        this: .simulatedRepos.set(repoName, repoState),
        console: console,
        : .log("[RepositoryService] Simulated resetting changes successful in repo: ".concat(repoName)),
        this: (_13 = .context.loggingService) === null || _13 === void 0 ? void 0 : _13.logInfo("Simulated resetting changes successful in repo: ".concat(repoName), { repoName: repoName, userId: userId })
    },
    catch: function (error) {
        var _a;
        console.error("[RepositoryService] Error simulating resetting changes in repo ".concat(repoName, ":"), error.message);
        (_a = this.context.loggingService) === null || _a === void 0 ? void 0 : _a.logError("Error simulating resetting changes in repo: ".concat(repoName), { repoName: repoName, userId: userId, error: error.message });
        throw new Error("Simulated resetting changes failed in repo ".concat(repoName, ": ").concat(error.message));
    }
};
// --- End New ---
// --- New: Simulate reverting a commit ---
/**
 * Simulates reverting a commit in a repository.
 * @param repoName The name of the repository. Required.
 * @param commitHash The hash of the commit to revert. Required.
 * @param userId The user ID. Required.
 * @returns Promise<void>
 * @throws Error if reverting fails or repoName/commitHash is invalid/not found.
 */
async;
revertCommit(repoName, string, commitHash, string, userId, string);
Promise < void  > {
    console: console,
    : .log("[RepositoryService] Simulating reverting commit '".concat(commitHash, "' in repo: ").concat(repoName, " for user ").concat(userId)),
    this: (_14 = .context.loggingService) === null || _14 === void 0 ? void 0 : _14.logInfo("Attempting to revert commit: ".concat(commitHash, " in repo: ").concat(repoName), { repoName: repoName, commitHash: commitHash, userId: userId }),
    if: function (, userId) { },
    throw: new Error('User ID is required.'),
    if: function (, repoName) { }
} || !commitHash;
throw new Error('repoName and commitHash are required for revertCommit.');
try {
    // Check if the repo exists in simulated state
    var repoState_8 = this.simulatedRepos.get(repoName);
    if (!repoState_8) {
        throw new Error("Repository '".concat(repoName, "' not found or not cloned."));
    }
    // Simulate reverting the commit
    // In a real Node.js environment:
    // await execPromise(`git revert ${commitHash} --no-edit`, { cwd: this.resolveSafeRepoPath(repoName) });
    // Simulate state update
    repoState_8.status = 'modified'; // Reverting creates a new commit, making it modified locally
    // Simulate adding a revert commit to history
    repoState_8.simulatedCommitHistory = __spreadArray(__spreadArray([], (repoState_8.simulatedCommitHistory || []), true), ["Revert \"".concat(commitHash.substring(0, 7), "...\"")], false);
    this.simulatedRepos.set(repoName, repoState_8);
    console.log("[RepositoryService] Simulated reverting commit successful: ".concat(commitHash, " in repo ").concat(repoName));
    (_15 = this.context.loggingService) === null || _15 === void 0 ? void 0 : _15.logInfo("Simulated reverting commit successful: ".concat(commitHash, " in repo: ").concat(repoName), { repoName: repoName, commitHash: commitHash, userId: userId });
    // TODO: Publish a 'repo_commit_reverted' event
}
catch (error) {
    console.error("[RepositoryService] Error simulating reverting commit ".concat(commitHash, " in repo ").concat(repoName, ":"), error.message);
    (_16 = this.context.loggingService) === null || _16 === void 0 ? void 0 : _16.logError("Error simulating reverting commit: ".concat(commitHash, " in repo: ").concat(repoName), { repoName: repoName, commitHash: commitHash, userId: userId, error: error.message });
    throw new Error("Simulated reverting commit failed: ".concat(error.message));
}
// --- End New ---
// --- New: Simulate creating a tag ---
/**
 * Simulates creating a tag in a repository.
 * @param repoName The name of the repository. Required.
 * @param tagName The name of the tag. Required.
 * @param userId The user ID. Required.
 * @returns Promise<void>
 * @throws Error if tagging fails or repoName/tagName is invalid/not found.
 */
async;
createTag(repoName, string, tagName, string, userId, string);
Promise < void  > {
    console: console,
    : .log("[RepositoryService] Simulating creating tag '".concat(tagName, "' in repo: ").concat(repoName, " for user ").concat(userId)),
    this: (_17 = .context.loggingService) === null || _17 === void 0 ? void 0 : _17.logInfo("Attempting to create tag: ".concat(tagName, " in repo: ").concat(repoName), { repoName: repoName, tagName: tagName, userId: userId }),
    if: function (, userId) { },
    throw: new Error('User ID is required.'),
    if: function (, repoName) { }
} || !tagName;
throw new Error('repoName and tagName are required for createTag.');
try {
    // Check if the repo exists in simulated state
    var repoState_9 = this.simulatedRepos.get(repoName);
    if (!repoState_9) {
        throw new Error("Repository '".concat(repoName, "' not found or not cloned."));
    }
    // Simulate creating the tag
    // In a real Node.js environment:
    // await execPromise(`git tag ${tagName}`, { cwd: this.resolveSafeRepoPath(repoName) });
    // Simulate state update (no direct status change, but tag exists)
    // You might add a simulatedTags array to the state if needed.
    console.log("[RepositoryService] Simulating creating tag successful: ".concat(tagName, " in repo ").concat(repoName));
    (_18 = this.context.loggingService) === null || _18 === void 0 ? void 0 : _18.logInfo("Simulated creating tag successful: ".concat(tagName, " in repo: ").concat(repoName), { repoName: repoName, tagName: tagName, userId: userId });
    // TODO: Publish a 'repo_tag_created' event
}
catch (error) {
    console.error("[RepositoryService] Error simulating creating tag ".concat(tagName, " in repo ").concat(repoName, ":"), error.message);
    (_19 = this.context.loggingService) === null || _19 === void 0 ? void 0 : _19.logError("Error simulating creating tag: ".concat(tagName, " in repo: ").concat(repoName), { repoName: repoName, tagName: tagName, userId: userId, error: error.message });
    throw new Error("Simulated creating tag failed: ".concat(error.message));
}
// --- End New ---
// --- New: Simulate fetching from remote ---
/**
 * Simulates fetching from the remote repository.
 * @param repoName The name of the repository. Required.
 * @param userId The user ID. Required.
 * @returns Promise<void>
 * @throws Error if fetching fails or repoName is invalid/not found.
 */
async;
fetchRemote(repoName, string, userId, string);
Promise < void  > {
    console: console,
    : .log("[RepositoryService] Simulating fetching remote for repo: ".concat(repoName, " for user ").concat(userId)),
    this: (_20 = .context.loggingService) === null || _20 === void 0 ? void 0 : _20.logInfo("Attempting to fetch remote for repo: ".concat(repoName), { repoName: repoName, userId: userId }),
    if: function (, userId) { },
    throw: new Error('User ID is required.'),
    if: function (, repoName) { },
    throw: new Error('repoName is required for fetchRemote.'),
    try: {
        // Check if the repo exists in simulated state
        const: repoState = this.simulatedRepos.get(repoName),
        if: function (, repoState) {
            throw new Error("Repository '".concat(repoName, "' not found or not cloned."));
        }
        // Simulate fetching process
        // In a real Node.js environment:
        // await execPromise(`git fetch origin`, { cwd: this.resolveSafeRepoPath(repoName) });
        // Simulate network delay
        ,
        // Simulate fetching process
        // In a real Node.js environment:
        // await execPromise(`git fetch origin`, { cwd: this.resolveSafeRepoPath(repoName) });
        // Simulate network delay
        await: await,
        new: Promise(function (resolve) { return setTimeout(resolve, 1000); }),
        // Simulate success/failure
        const: success = Math.random() > 0.1, // 90% chance of simulated success
        if: function (success) {
            var _a;
            console.log("[RepositoryService] Simulating fetching remote successful for repo: ".concat(repoName));
            (_a = this.context.loggingService) === null || _a === void 0 ? void 0 : _a.logInfo("Simulated fetching remote successful for repo: ".concat(repoName), { repoName: repoName, userId: userId });
            // TODO: Publish a 'repo_fetched' event
        },
        else: {
            const: errorMessage = "Simulated fetching remote failed for repo ".concat(repoName, "."),
            console: console,
            : .error("[RepositoryService] ".concat(errorMessage)),
            this: (_21 = .context.loggingService) === null || _21 === void 0 ? void 0 : _21.logError("Simulated fetching remote failed for repo: ".concat(repoName), { repoName: repoName, userId: userId, error: errorMessage }),
            // TODO: Publish a 'repo_fetch_failed' event
            throw: new Error(errorMessage)
        }
    },
    catch: function (error) {
        var _a;
        console.error("[RepositoryService] Error simulating fetching remote for repo ".concat(repoName, ":"), error.message);
        (_a = this.context.loggingService) === null || _a === void 0 ? void 0 : _a.logError("Error simulating fetching remote for repo: ".concat(repoName), { repoName: repoName, userId: userId, error: error.message });
        throw new Error("Simulated fetching remote failed for repo ".concat(repoName, ": ").concat(error.message));
    }
};
// --- End New ---
// --- New: Simulate managing remotes ---
/**
 * Simulates adding, removing, or listing remotes.
 * @param repoName The name of the repository. Required.
 * @param userId The user ID. Required.
 * @param operation The remote operation ('add', 'remove', 'list'). Required.
 * @param remoteName Optional: The name of the remote (for add/remove).
 * @param remoteUrl Optional: The URL of the remote (for add).
 * @returns Promise<any> Simulated result (e.g., list of remotes).
 * @throws Error if operation fails or repoName is invalid/not found.
 */
async;
manageRemotes(repoName, string, userId, string, operation, 'add' | 'remove' | 'list', remoteName ?  : string, remoteUrl ?  : string);
Promise < any > {
    console: console,
    : .log("[RepositoryService] Simulating remote operation '".concat(operation, "' for repo: ").concat(repoName, " for user ").concat(userId)),
    this: (_22 = .context.loggingService) === null || _22 === void 0 ? void 0 : _22.logInfo("Attempting remote operation: ".concat(operation, " for repo: ").concat(repoName), { repoName: repoName, userId: userId, operation: operation, remoteName: remoteName, remoteUrl: remoteUrl }),
    if: function (, userId) { },
    throw: new Error('User ID is required.'),
    if: function (, repoName) { }
} || !operation;
throw new Error('repoName and operation are required for manageRemotes.');
try {
    // Check if the repo exists in simulated state
    var repoState_10 = this.simulatedRepos.get(repoName);
    if (!repoState_10) {
        throw new Error("Repository '".concat(repoName, "' not found or not cloned."));
    }
    // Simulate remote operations
    // In a real Node.js environment:
    // await execPromise(`git remote ${operation} ...`, { cwd: this.resolveSafeRepoPath(repoName) });
    var result = { status: 'simulated_success', message: "Simulated remote operation '".concat(operation, "' successful for repo ").concat(repoName, ".") };
    switch (operation) {
        case 'add':
            if (!remoteName || !remoteUrl)
                throw new Error('remoteName and remoteUrl are required for add operation.');
            // Simulate adding remote (no state change in MVP)
            console.log("[RepositoryService] Simulating adding remote '".concat(remoteName, "' with URL '").concat(remoteUrl, "'."));
            result.message = "Simulated adding remote '".concat(remoteName, "'.");
            // TODO: Add simulated remotes list to repo state
            break;
        case 'remove':
            if (!remoteName)
                throw new Error('remoteName is required for remove operation.');
            // Simulate removing remote (no state change in MVP)
            console.log("[RepositoryService] Simulating removing remote '".concat(remoteName, "'."));
            result.message = "Simulated removing remote '".concat(remoteName, "'.");
            // TODO: Remove from simulated remotes list
            break;
        case 'list':
            // Simulate listing remotes
            console.log("[RepositoryService] Simulating listing remotes.");
            // TODO: Return simulated remotes list from repo state
            result.data = { remotes: ['origin'] }; // Always return 'origin' for MVP
            result.message = "Simulated listing remotes for repo ".concat(repoName, ".");
            break;
        default:
            throw new Error("Unsupported remote operation: ".concat(operation));
    }
    console.log("[RepositoryService] Simulated remote operation successful: ".concat(operation, " for repo ").concat(repoName, "."));
    (_23 = this.context.loggingService) === null || _23 === void 0 ? void 0 : _23.logInfo("Simulated remote operation successful: ".concat(operation, " for repo: ").concat(repoName), { repoName: repoName, userId: userId, operation: operation });
    // TODO: Publish a 'repo_remote_updated' event
    return result;
}
catch (error) {
    console.error("[RepositoryService] Error simulating remote operation '".concat(operation, "' for repo ").concat(repoName, ":"), error.message);
    (_24 = this.context.loggingService) === null || _24 === void 0 ? void 0 : _24.logError("Error simulating remote operation: ".concat(operation, " for repo: ").concat(repoName), { repoName: repoName, userId: userId, operation: operation, error: error.message });
    throw new Error("Simulated remote operation failed: ".concat(error.message));
}
""(__makeTemplateObject([""], [""]));
