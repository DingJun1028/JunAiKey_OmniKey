var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
""(__makeTemplateObject(["typescript\n// src/core/files/FileService.ts\n// \u6587\u4EF6\u670D\u52D9 (File Service) - \u6838\u5FC3\u6A21\u7D44\n// Manages interactions with the file system (simulated in WebContainer using Node.js fs).\n// Part of the Long-term Memory pillar (specifically for file-based data).\n// Design Principle: Provides a standardized interface for file operations.\n// --- Modified: Add more simulated Git commands (add, branch, checkout, merge, log, reset, revert, tag, fetch, remote) ---\n\nimport { SystemContext } from '../../interfaces';\nimport * as fs from 'fs/promises'; // Use fs/promises for async file operations\nimport * as path from 'path'; // Use path module\n// import { exec } from 'child_process'; // Use child_process for executing git commands (Node.js environment)\n// import { promisify } from 'util'; // For promisifying exec\n// const execPromise = promisify(exec);\n\n\n// Define the structure for a simulated repository state\ninterface SimulatedRepoState {\n    url: string;\n    branch: string;\n    status: 'clean' | 'modified' | 'syncing';\n    // Add other simulated state like commit history, branches, remotes if needed for more complex simulation\n    simulatedCommitHistory?: string[]; // Simple array of commit messages\n    simulatedBranches?: string[]; // Simple array of branch names\n}\n\n\nexport class FileService {\n    private context: SystemContext;\n    // private loggingService: LoggingService; // Access via context\n\n    // Define a base directory for user files within the WebContainer filesystem\n    // In a real app, this would be user-specific and potentially synced storage.\n    private baseDir = '/app/user_files'; // Example: files stored in /app/user_files\n\n    // In-memory state to track simulated repositories\n    // In a real app, this would be persisted and manage actual Git repos\n    private simulatedRepos: Map<string, SimulatedRepoState> = new Map();\n\n    constructor(context: SystemContext) {\n        this.context = context;\n        // this.loggingService = context.loggingService;\n        console.log('FileService initialized.');\n\n        // Ensure the base directory exists on startup\n        this.ensureBaseDirExists().catch(err => {\n            console.error('[FileService] Failed to ensure base directory exists:', err);\n            this.context.loggingService?.logError('Failed to ensure FileService base directory exists', { error: err.message });\n        });\n\n        // TODO: Load persisted repository state on startup\n        // For MVP, initialize with some dummy data if needed for testing\n        // this.simulatedRepos.set('my-dummy-repo', { url: 'https://github.com/simulated/dummy-repo.git', branch: 'main', status: 'clean' });\n    }\n\n    /**\n     * Ensures the base directory for user files exists.\n     * @returns Promise<void>\n     */\n    private async ensureBaseDirExists(): Promise<void> {\n        try {\n            await fs.mkdir(this.baseDir, { recursive: true });\n            console.log("], ["typescript\n// src/core/files/FileService.ts\n// \\u6587\\u4ef6\\u670d\\u52d9 (File Service) - \\u6838\\u5fc3\\u6a21\\u7d44\n// Manages interactions with the file system (simulated in WebContainer using Node.js fs).\n// Part of the Long-term Memory pillar (specifically for file-based data).\n// Design Principle: Provides a standardized interface for file operations.\n// --- Modified: Add more simulated Git commands (add, branch, checkout, merge, log, reset, revert, tag, fetch, remote) ---\n\nimport { SystemContext } from '../../interfaces';\nimport * as fs from 'fs/promises'; // Use fs/promises for async file operations\nimport * as path from 'path'; // Use path module\n// import { exec } from 'child_process'; // Use child_process for executing git commands (Node.js environment)\n// import { promisify } from 'util'; // For promisifying exec\n// const execPromise = promisify(exec);\n\n\n// Define the structure for a simulated repository state\ninterface SimulatedRepoState {\n    url: string;\n    branch: string;\n    status: 'clean' | 'modified' | 'syncing';\n    // Add other simulated state like commit history, branches, remotes if needed for more complex simulation\n    simulatedCommitHistory?: string[]; // Simple array of commit messages\n    simulatedBranches?: string[]; // Simple array of branch names\n}\n\n\nexport class FileService {\n    private context: SystemContext;\n    // private loggingService: LoggingService; // Access via context\n\n    // Define a base directory for user files within the WebContainer filesystem\n    // In a real app, this would be user-specific and potentially synced storage.\n    private baseDir = '/app/user_files'; // Example: files stored in /app/user_files\n\n    // In-memory state to track simulated repositories\n    // In a real app, this would be persisted and manage actual Git repos\n    private simulatedRepos: Map<string, SimulatedRepoState> = new Map();\n\n    constructor(context: SystemContext) {\n        this.context = context;\n        // this.loggingService = context.loggingService;\n        console.log('FileService initialized.');\n\n        // Ensure the base directory exists on startup\n        this.ensureBaseDirExists().catch(err => {\n            console.error('[FileService] Failed to ensure base directory exists:', err);\n            this.context.loggingService?.logError('Failed to ensure FileService base directory exists', { error: err.message });\n        });\n\n        // TODO: Load persisted repository state on startup\n        // For MVP, initialize with some dummy data if needed for testing\n        // this.simulatedRepos.set('my-dummy-repo', { url: 'https://github.com/simulated/dummy-repo.git', branch: 'main', status: 'clean' });\n    }\n\n    /**\n     * Ensures the base directory for user files exists.\n     * @returns Promise<void>\n     */\n    private async ensureBaseDirExists(): Promise<void> {\n        try {\n            await fs.mkdir(this.baseDir, { recursive: true });\n            console.log("]))[FileService];
Ensured;
base;
directory;
exists: $;
{
    this.baseDir;
}
");\n        } catch (error: any) {\n            // Ignore error if directory already exists\n            if (error.code !== 'EEXIST') {\n                throw error;\n            }\n        }\n    }\n\n    /**\n     * Resolves a file path relative to the base directory.\n     * Prevents directory traversal attacks by ensuring the resolved path is within the base directory.\n     * @param filePath The user-provided file path. Required.\n     * @returns The resolved absolute path within the base directory.\n     * @throws Error if the resolved path is outside the base directory.\n     */\n    private resolveSafePath(filePath: string): string {\n        const absoluteBaseDir = path.resolve(this.baseDir);\n        const absoluteFilePath = path.resolve(this.baseDir, filePath);\n\n        // Check if the resolved file path is within the base directory\n        if (!absoluteFilePath.startsWith(absoluteBaseDir + path.sep) && absoluteFilePath !== absoluteBaseDir) {\n            const errorMsg = ";
Attempted;
directory;
traversal: $;
{
    filePath;
}
";\n            console.error("[FileService];
$;
{
    errorMsg;
}
");\n            this.context.loggingService?.logError(errorMsg, { filePath });\n            throw new Error('Invalid file path.');\n        }\n\n        return absoluteFilePath;\n    }\n\n\n    /**\n     * Reads the content of a file.\n     * Corresponds to the '\u958B\u555F\u6A94\u6848' (Open File) functionality.\n     * @param filePath The path to the file relative to the base directory. Required.\n     * @param userId The user ID accessing the file. Required for permission checks (Placeholder).\n     * @returns Promise<string> The content of the file as a string.\n     * @throws Error if the file cannot be read or path is invalid.\n     */\n    async readFile(filePath: string, userId: string): Promise<string> {\n        console.log("[FileService];
Reading;
file: $;
{
    filePath;
}
for (user; $; { userId: userId }(__makeTemplateObject([");\n        this.context.loggingService?.logInfo("], [");\n        this.context.loggingService?.logInfo("])))
    Attempting;
to;
read;
file: $;
{
    filePath;
}
", { filePath, userId });\n\n        if (!userId) {\n            console.warn('[FileService] Cannot read file: User ID is required.');\n            this.context.loggingService?.logWarning('Cannot read file: User ID is required.');\n            throw new Error('User ID is required.');\n        }\n\n        try {\n            const safePath = this.resolveSafePath(filePath);\n            const content = await fs.readFile(safePath, { encoding: 'utf8' });\n            console.log("[FileService];
Successfully;
read;
file: $;
{
    filePath;
}
");\n            this.context.loggingService?.logInfo(";
Successfully;
read;
file: $;
{
    filePath;
}
", { filePath, userId });\n            return content;\n        } catch (error: any) {\n            console.error("[FileService];
Error;
reading;
file;
$;
{
    filePath;
}
", error.message);\n            this.context.loggingService?.logError(";
Error;
reading;
file: $;
{
    filePath;
}
", { filePath, userId, error: error.message });\n            throw new Error(";
Failed;
to;
read;
file;
$;
{
    filePath;
}
$;
{
    error.message;
}
");\n        }\n    }\n\n    /**\n     * Writes content to a file. If the file exists, it will be overwritten.\n     * Creates parent directories if they don't exist.\n     * Corresponds to the '\u5BEB\u5165\u6587\u4EF6' (Write to File) functionality.\n     * @param filePath The path to the file relative to the base directory. Required.\n     * @param content The content to write. Required.\n     * @param userId The user ID writing the file. Required for permission checks (Placeholder).\n     * @returns Promise<void>\n     * @throws Error if the file cannot be written or path is invalid.\n     */\n    async writeFile(filePath: string, content: string, userId: string): Promise<void> {\n        console.log("[FileService];
Writing;
file: $;
{
    filePath;
}
for (user; $; { userId: userId }(__makeTemplateObject([");\n        this.context.loggingService?.logInfo("], [");\n        this.context.loggingService?.logInfo("])))
    Attempting;
to;
write;
file: $;
{
    filePath;
}
", { filePath, userId, contentSize: content.length });\n\n        if (!userId) {\n            console.warn('[FileService] Cannot write file: User ID is required.');\n            this.context.loggingService?.logWarning('Cannot write file: User ID is required.');\n            throw new Error('User ID is required.');\n        }\n\n        try {\n            const safePath = this.resolveSafePath(filePath);\n            const dir = path.dirname(safePath);\n\n            // Ensure parent directory exists\n            await fs.mkdir(dir, { recursive: true });\n\n            await fs.writeFile(safePath, content, { encoding: 'utf8' });\n            console.log("[FileService];
Successfully;
wrote;
file: $;
{
    filePath;
}
");\n            this.context.loggingService?.logInfo(";
Successfully;
wrote;
file: $;
{
    filePath;
}
", { filePath, userId });\n\n            // TODO: Publish a 'file_written' or 'file_updated' event via EventBus\n            // This event could be listened to by the SyncService to queue the change for cloud sync.\n            // this.context.eventBus?.publish('file_written', { filePath, userId }, userId);\n\n        } catch (error: any) {\n            console.error("[FileService];
Error;
writing;
file;
$;
{
    filePath;
}
", error.message);\n            this.context.loggingService?.logError(";
Error;
writing;
file: $;
{
    filePath;
}
", { filePath, userId, error: error.message });\n            throw new Error(";
Failed;
to;
write;
file;
$;
{
    filePath;
}
$;
{
    error.message;
}
");\n        }\n    }\n\n    /**\n     * Updates the content of an existing file.\n     * Corresponds to the '\u4FEE\u6539\u6A94\u6848' (Modify File) functionality.\n     * This is essentially the same as writeFile for MVP, but semantically different.\n     * @param filePath The path to the file relative to the base directory. Required.\n     * @param content The new content to write. Required.\n     * @param userId The user ID modifying the file. Required for permission checks (Placeholder).\n     * @returns Promise<void>\n     * @throws Error if the file cannot be updated or path is invalid.\n     */\n    async updateFile(filePath: string, content: string, userId: string): Promise<void> {\n        console.log("[FileService];
Updating;
file: $;
{
    filePath;
}
for (user; $; { userId: userId }(__makeTemplateObject([");\n        // For MVP, update is the same as write (overwrite)\n        return this.writeFile(filePath, content, userId);\n    }\n\n     /**\n     * Merges new content with existing file content and writes the result back.\n     * Corresponds to the '\u914D\u5C0D/\u5408\u4F75\u5167\u5BB9\u5BEB\u5165\u6587\u4EF6' (Pair/Merge content and write to file) functionality.\n     * @param filePath The path to the file relative to the base directory. Required.\n     * @param newContent The content to merge. Required.\n     * @param userId The user ID performing the merge. Required for permission checks (Placeholder).\n     * @param mergeStrategy Optional strategy ('append', 'prepend', 'replace', 'diff'). Defaults to 'append'.\n     * @returns Promise<void>\n     * @throws Error if the file cannot be read/written or path is invalid.\n     */\n    async mergeAndWriteFile(filePath: string, newContent: string, userId: string, mergeStrategy: 'append' | 'prepend' | 'replace' | 'diff' = 'append'): Promise<void> {\n        console.log("], [");\n        // For MVP, update is the same as write (overwrite)\n        return this.writeFile(filePath, content, userId);\n    }\n\n     /**\n     * Merges new content with existing file content and writes the result back.\n     * Corresponds to the '\\u914d\\u5c0d/\\u5408\\u4f75\\u5167\\u5bb9\\u5beb\\u5165\\u6587\\u4ef6' (Pair/Merge content and write to file) functionality.\n     * @param filePath The path to the file relative to the base directory. Required.\n     * @param newContent The content to merge. Required.\n     * @param userId The user ID performing the merge. Required for permission checks (Placeholder).\n     * @param mergeStrategy Optional strategy ('append', 'prepend', 'replace', 'diff'). Defaults to 'append'.\n     * @returns Promise<void>\n     * @throws Error if the file cannot be read/written or path is invalid.\n     */\n    async mergeAndWriteFile(filePath: string, newContent: string, userId: string, mergeStrategy: 'append' | 'prepend' | 'replace' | 'diff' = 'append'): Promise<void> {\n        console.log("]))[FileService])
    Merging;
and;
writing;
file: $;
{
    filePath;
}
for (user; $; { userId: userId })
    with (strategy)
        $;
{
    mergeStrategy;
}
");\n        this.context.loggingService?.logInfo(";
Attempting;
to;
merge;
and;
write;
file: $;
{
    filePath;
}
", { filePath, userId, mergeStrategy, newContentSize: newContent.length });\n\n        if (!userId) {\n            console.warn('[FileService] Cannot merge and write file: User ID is required.');\n            this.context.loggingService?.logWarning('Cannot merge and write file: User ID is required.');\n            throw new Error('User ID is required.');\n        }\n\n        try {\n            let existingContent = '';\n            try {\n                // Attempt to read existing content\n                existingContent = await this.readFile(filePath, userId);\n            } catch (readError: any) {\n                // If file doesn't exist, treat existing content as empty string\n                if (readError.message.includes('ENOENT') || readError.message.includes('Failed to read file')) {\n                    console.warn("[FileService];
File;
$;
{
    filePath;
}
not;
found;
for (merging.Creating; new (file.(__makeTemplateObject([");\n                    existingContent = '';\n                } else {\n                    // Re-throw other read errors\n                    throw readError;\n                }\n            }\n\n            let mergedContent = '';\n            switch (mergeStrategy) {\n                case 'append':\n                    mergedContent = existingContent + newContent;\n                    break;\n                case 'prepend':\n                    mergedContent = newContent + existingContent;\n                    break;\n                case 'replace':\n                    mergedContent = newContent; // Overwrite\n                    break;\n                case 'diff':\n                    // TODO: Implement a proper diff and merge strategy (complex)\n                    console.warn('[FileService] Diff merge strategy is not fully implemented. Appending content.');\n                    mergedContent = existingContent + newContent; // Fallback to append\n                    break;\n                default:\n                    console.warn("], [");\n                    existingContent = '';\n                } else {\n                    // Re-throw other read errors\n                    throw readError;\n                }\n            }\n\n            let mergedContent = '';\n            switch (mergeStrategy) {\n                case 'append':\n                    mergedContent = existingContent + newContent;\n                    break;\n                case 'prepend':\n                    mergedContent = newContent + existingContent;\n                    break;\n                case 'replace':\n                    mergedContent = newContent; // Overwrite\n                    break;\n                case 'diff':\n                    // TODO: Implement a proper diff and merge strategy (complex)\n                    console.warn('[FileService] Diff merge strategy is not fully implemented. Appending content.');\n                    mergedContent = existingContent + newContent; // Fallback to append\n                    break;\n                default:\n                    console.warn("]))[FileService]); Unknown)
    merge;
strategy: $;
{
    mergeStrategy;
}
Appending;
content.(__makeTemplateObject([");\n                    mergedContent = existingContent + newContent; // Fallback to append\n                    break;\n            }\n\n            // Write the merged content back to the file\n            await this.writeFile(filePath, mergedContent, userId);\n\n            console.log("], [");\n                    mergedContent = existingContent + newContent; // Fallback to append\n                    break;\n            }\n\n            // Write the merged content back to the file\n            await this.writeFile(filePath, mergedContent, userId);\n\n            console.log("]))[FileService];
Successfully;
merged;
and;
wrote;
file: $;
{
    filePath;
}
");\n            this.context.loggingService?.logInfo(";
Successfully;
merged;
and;
wrote;
file: $;
{
    filePath;
}
", { filePath, userId, mergeStrategy });\n\n        } catch (error: any) {\n            console.error("[FileService];
Error;
merging;
and;
writing;
file;
$;
{
    filePath;
}
", error.message);\n            this.context.loggingService?.logError(";
Error;
merging;
and;
writing;
file: $;
{
    filePath;
}
", { filePath, userId, mergeStrategy, error: error.message });\n            throw new Error(";
Failed;
to;
merge;
and;
write;
file;
$;
{
    filePath;
}
$;
{
    error.message;
}
");\n        }\n    }\n\n\n    /**\n     * Deletes a file.\n     * Corresponds to the '\u522A\u9664\u6A94\u6848' (Delete File) functionality.\n     * @param filePath The path to the file relative to the base directory. Required.\n     * @param userId The user ID deleting the file. Required for permission checks (Placeholder).\n     * @returns Promise<void>\n     * @throws Error if the file cannot be deleted or path is invalid.\n     */\n    async deleteFile(filePath: string, userId: string): Promise<void> {\n        console.log("[FileService];
Deleting;
file: $;
{
    filePath;
}
for (user; $; { userId: userId }(__makeTemplateObject([");\n        this.context.loggingService?.logInfo("], [");\n        this.context.loggingService?.logInfo("])))
    Attempting;
to;
delete file;
$;
{
    filePath;
}
", { filePath, userId });\n\n        if (!userId) {\n            console.warn('[FileService] Cannot delete file: User ID is required.');\n            this.context.loggingService?.logWarning('Cannot delete file: User ID is required.');\n            throw new Error('User ID is required.');\n        }\n\n        try {\n            const safePath = this.resolveSafePath(filePath);\n            await fs.unlink(safePath);\n            console.log("[FileService];
Successfully;
deleted;
file: $;
{
    filePath;
}
");\n            this.context.loggingService?.logInfo(";
Successfully;
deleted;
file: $;
{
    filePath;
}
", { filePath, userId });\n\n            // TODO: Publish a 'file_deleted' event via EventBus\n            // this.context.eventBus?.publish('file_deleted', { filePath, userId }, userId);\n\n        } catch (error: any) {\n            console.error("[FileService];
Error;
deleting;
file;
$;
{
    filePath;
}
", error.message);\n            this.context.loggingService?.logError(";
Error;
deleting;
file: $;
{
    filePath;
}
", { filePath, userId, error: error.message });\n            throw new Error(";
Failed;
to;
delete file;
$;
{
    filePath;
}
$;
{
    error.message;
}
");\n        }\n    }\n\n    /**\n     * Lists files and directories within a given path relative to the base directory.\n     * @param dirPath The path to the directory relative to the base directory. Defaults to the base directory itself ('/'). Required.\n     * @param userId The user ID listing files. Required for permission checks (Placeholder).\n     * @returns Promise<string[]> An array of file and directory names.\n     * @throws Error if the directory cannot be read or path is invalid.\n     */\n    async listFiles(dirPath: string = '/', userId: string): Promise<string[]> {\n        console.log("[FileService];
Listing;
files in directory;
$;
{
    dirPath;
}
for (user; $; { userId: userId }(__makeTemplateObject([");\n        this.context.loggingService?.logInfo("], [");\n        this.context.loggingService?.logInfo("])))
    Attempting;
to;
list;
files in directory;
$;
{
    dirPath;
}
", { dirPath, userId });\n\n        if (!userId) {\n            console.warn('[FileService] Cannot list files: User ID is required.');\n            this.context.loggingService?.logWarning('Cannot list files: User ID is required.');\n            throw new Error('User ID is required.');\n        }\n\n        try {\n            const safePath = this.resolveSafePath(dirPath);\n            const entries = await fs.readdir(safePath);\n            console.log("[FileService];
Successfully;
listed;
files in directory;
$;
{
    dirPath;
}
");\n            this.context.loggingService?.logInfo(";
Successfully;
listed;
files in directory;
$;
{
    dirPath;
}
", { dirPath, userId, count: entries.length });\n            return entries;\n        } catch (error: any) {\n            console.error("[FileService];
Error;
listing;
files in directory;
$;
{
    dirPath;
}
", error.message);\n            this.context.loggingService?.logError(";
Error;
listing;
files in directory;
$;
{
    dirPath;
}
", { dirPath, userId, error: error.message });\n            throw new Error(";
Failed;
to;
list;
files in directory;
$;
{
    dirPath;
}
$;
{
    error.message;
}
");\n        }\n    }\n\n    // TODO: Implement '\u95DC\u9589\u6A94\u6848' (Close File) - For stream-based operations, but fs/promises doesn't require explicit close for simple read/write.\n    // TODO: Implement '\u91CD\u88FD' (Reset/Remake) - Could be a combination of delete and write.\n    // TODO: Implement '\u767C\u4F48/\u90E8\u7F72' (Publish/Deploy) - This is a complex process involving code, build, and deployment, likely orchestrated by SelfNavigationEngine or a dedicated DeploymentService, potentially using Runes (e.g., GitHub Actions Rune, Vercel Rune).\n    // TODO: Implement '\u63D0\u554F' (Ask a question) - This is a user interaction handled by JunAiAssistant.\n\n    // TODO: Integrate with SyncService for cloud synchronization of files.\n    // TODO: Implement permission checks based on user ID and file paths/metadata.\n    // TODO: This module is part of the Long-term Memory (\u6C38\u4E45\u8A18\u61B6) pillar.\n}\n"(__makeTemplateObject([""], [""]));
n;
",;
"isBinary";
false,
    "fullPath";
"src/core/files/FileService.ts",
    "lastModified";
1750388229963;
type;
"shell" > npm;
install;
