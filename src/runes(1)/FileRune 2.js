var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
""(__makeTemplateObject(["typescript\n// src/runes/FileRune.ts\n// File System Rune Implementation\n// Provides methods to interact with the file system via the FileService.\n// This Rune is an example of a 'system-adapter' type Rune.\n\nimport { SystemContext, Rune } from '../interfaces';\nimport * as fs from 'fs/promises'; // Use fs/promises for async file operations\nimport * as path from 'path'; // Use path module\n\n\n/**\n * Implements the File System Rune, allowing interaction with the system's file storage.\n * This is an example of a 'system-adapter' type Rune.\n */\nexport class FileRune {\n    private context: SystemContext;\n    private rune: Rune; // Reference to the Rune definition\n\n    constructor(context: SystemContext, rune: Rune) {\n        this.context = context;\n        this.rune = rune;\n        console.log("], ["typescript\n// src/runes/FileRune.ts\n// File System Rune Implementation\n// Provides methods to interact with the file system via the FileService.\n// This Rune is an example of a 'system-adapter' type Rune.\n\nimport { SystemContext, Rune } from '../interfaces';\nimport * as fs from 'fs/promises'; // Use fs/promises for async file operations\nimport * as path from 'path'; // Use path module\n\n\n/**\n * Implements the File System Rune, allowing interaction with the system's file storage.\n * This is an example of a 'system-adapter' type Rune.\n */\nexport class FileRune {\n    private context: SystemContext;\n    private rune: Rune; // Reference to the Rune definition\n\n    constructor(context: SystemContext, rune: Rune) {\n        this.context = context;\n        this.rune = rune;\n        console.log("]))[Rune];
FileRune;
initialized;
for ($; { rune: rune, : .name }.(__makeTemplateObject([");\n\n        // FileRune relies on FileService being initialized\n        if (!this.context.fileService) {\n             console.error("], [");\n\n        // FileRune relies on FileService being initialized\n        if (!this.context.fileService) {\n             console.error("]))[Rune]; FileRune)
    $;
{
    rune.name;
}
requires;
FileService;
to;
be;
initialized.(__makeTemplateObject([");\n             this.context.loggingService?.logError("], [");\n             this.context.loggingService?.logError("]));
FileRune;
requires;
FileService(__makeTemplateObject([", { runeId: rune.id });\n             // Throwing here might prevent the rune from being registered, which is appropriate.\n             throw new Error('FileService is not available.');\n        }\n    }\n\n    /**\n     * Reads the content of a file.\n     * Corresponds to the '\u958B\u555F\u6A94\u6848' (Open File) functionality.\n     * @param params Parameters: { filePath: string }. Required.\n     * @param userId The user ID accessing the file. Required for permission checks (Placeholder).\n     * @returns Promise<string> The content of the file as a string.\n     * @throws Error if the file cannot be read or path is invalid.\n     */\n    async readFile(params: { filePath: string }, userId: string): Promise<string> {\n        console.log("], [", { runeId: rune.id });\n             // Throwing here might prevent the rune from being registered, which is appropriate.\n             throw new Error('FileService is not available.');\n        }\n    }\n\n    /**\n     * Reads the content of a file.\n     * Corresponds to the '\\u958b\\u555f\\u6a94\\u6848' (Open File) functionality.\n     * @param params Parameters: { filePath: string }. Required.\n     * @param userId The user ID accessing the file. Required for permission checks (Placeholder).\n     * @returns Promise<string> The content of the file as a string.\n     * @throws Error if the file cannot be read or path is invalid.\n     */\n    async readFile(params: { filePath: string }, userId: string): Promise<string> {\n        console.log("]))[Rune];
$;
{
    this.rune.name;
}
readFile;
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
readFile(__makeTemplateObject([", { runeId: this.rune.id, userId, params });\n\n        if (!userId) {\n            console.warn('[Rune] Cannot read file: User ID is required.');\n            this.context.loggingService?.logWarning('Cannot read file: User ID is required.');\n            throw new Error('User ID is required.');\n        }\n\n        try {\n            // Use FileService to read the file\n            const content = await this.context.fileService.readFile(params.filePath, userId);\n\n            console.log("], [", { runeId: this.rune.id, userId, params });\n\n        if (!userId) {\n            console.warn('[Rune] Cannot read file: User ID is required.');\n            this.context.loggingService?.logWarning('Cannot read file: User ID is required.');\n            throw new Error('User ID is required.');\n        }\n\n        try {\n            // Use FileService to read the file\n            const content = await this.context.fileService.readFile(params.filePath, userId);\n\n            console.log("]))[Rune];
$;
{
    this.rune.name;
}
readFile;
result(content, length, $, { content: content, : .length }).(__makeTemplateObject([");\n            return content;\n\n        } catch (error: any) {\n            console.error("], [");\n            return content;\n\n        } catch (error: any) {\n            console.error("]))[Rune];
Error;
executing;
$;
{
    this.rune.name;
}
readFile: ", error);\n            this.context.loggingService?.logError(";
Error;
executing;
rune;
action: $;
{
    this.rune.name;
}
readFile(__makeTemplateObject([", { runeId: this.rune.id, userId, error: error.message });\n            throw new Error("], [", { runeId: this.rune.id, userId, error: error.message });\n            throw new Error("]));
File;
read;
failed: $;
{
    error.message;
}
");\n        }\n    }\n\n    /**\n     * Writes content to a file. If the file exists, it will be overwritten.\n     * Creates parent directories if they don't exist.\n     * Corresponds to the '\u5BEB\u5165\u6A94\u6848' (Write to File) functionality.\n     * @param params Parameters: { filePath: string, content: string }. Required.\n     * @param userId The user ID writing the file. Required for permission checks (Placeholder).\n     * @returns Promise<void>\n     * @throws Error if the file cannot be written or path is invalid.\n     */\n    async writeFile(params: { filePath: string, content: string }, userId: string): Promise<void> {\n        console.log("[Rune];
$;
{
    this.rune.name;
}
writeFile;
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
writeFile(__makeTemplateObject([", { runeId: this.rune.id, userId, params: { filePath: params?.filePath, contentSize: params?.content?.length } });\n\n        if (!params?.filePath || params?.content === undefined) {\n            throw new Error('filePath and content are required for writeFile.');\n        }\n\n        try {\n            // Use FileService to write the file\n            await this.context.fileService.writeFile(params.filePath, params.content, userId);\n\n            console.log("], [", { runeId: this.rune.id, userId, params: { filePath: params?.filePath, contentSize: params?.content?.length } });\n\n        if (!params?.filePath || params?.content === undefined) {\n            throw new Error('filePath and content are required for writeFile.');\n        }\n\n        try {\n            // Use FileService to write the file\n            await this.context.fileService.writeFile(params.filePath, params.content, userId);\n\n            console.log("]))[Rune];
$;
{
    this.rune.name;
}
writeFile;
successful.(__makeTemplateObject([");\n\n        } catch (error: any) {\n            console.error("], [");\n\n        } catch (error: any) {\n            console.error("]))[Rune];
Error;
executing;
$;
{
    this.rune.name;
}
writeFile: ", error);\n            this.context.loggingService?.logError(";
Error;
executing;
rune;
action: $;
{
    this.rune.name;
}
writeFile(__makeTemplateObject([", { runeId: this.rune.id, userId, error: error.message });\n            throw new Error("], [", { runeId: this.rune.id, userId, error: error.message });\n            throw new Error("]));
File;
write;
failed: $;
{
    error.message;
}
");\n        }\n    }\n\n    /**\n     * Deletes a file.\n     * Corresponds to the '\u522A\u9664\u6A94\u6848' (Delete File) functionality.\n     * @param params Parameters: { filePath: string }. Required.\n     * @param userId The user ID deleting the file. Required for permission checks (Placeholder).\n     * @returns Promise<void>\n     * @throws Error if the file cannot be deleted or path is invalid.\n     */\n    async deleteFile(params: { filePath: string }, userId: string): Promise<void> {\n        console.log("[Rune];
$;
{
    this.rune.name;
}
deleteFile;
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
deleteFile(__makeTemplateObject([", { runeId: this.rune.id, userId, params });\n\n        if (!params?.filePath) {\n            throw new Error('filePath is required for deleteFile.');\n        }\n\n        try {\n            // Use FileService to delete the file\n            await this.context.fileService.deleteFile(params.filePath, userId);\n\n            console.log("], [", { runeId: this.rune.id, userId, params });\n\n        if (!params?.filePath) {\n            throw new Error('filePath is required for deleteFile.');\n        }\n\n        try {\n            // Use FileService to delete the file\n            await this.context.fileService.deleteFile(params.filePath, userId);\n\n            console.log("]))[Rune];
$;
{
    this.rune.name;
}
deleteFile;
successful.(__makeTemplateObject([");\n\n        } catch (error: any) {\n            console.error("], [");\n\n        } catch (error: any) {\n            console.error("]))[Rune];
Error;
executing;
$;
{
    this.rune.name;
}
deleteFile: ", error);\n            this.context.loggingService?.logError(";
Error;
executing;
rune;
action: $;
{
    this.rune.name;
}
deleteFile(__makeTemplateObject([", { runeId: this.rune.id, userId, error: error.message });\n            throw new Error("], [", { runeId: this.rune.id, userId, error: error.message });\n            throw new Error("]));
File;
deletion;
failed: $;
{
    error.message;
}
");\n        }\n    }\n\n    /**\n     * Lists files and directories within a given path.\n     * Corresponds to the 'listFiles' method in the manifest.\n     * @param params Parameters: { dirPath?: string }. Optional, defaults to base directory.\n     * @param userId The user ID executing the action. Required.\n     * @returns Promise<string[]> An array of file and directory names.\n     * @throws Error if the directory cannot be read or path is invalid.\n     */\n    async listFiles(params: { dirPath?: string }, userId: string): Promise<string[]> {\n        console.log("[Rune];
$;
{
    this.rune.name;
}
listFiles;
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
listFiles(__makeTemplateObject([", { runeId: this.rune.id, userId, params });\n\n        if (!userId) {\n            console.warn('[Rune] Cannot list files: User ID is required.');\n            this.context.loggingService?.logWarning('Cannot list files: User ID is required.');\n            throw new Error('User ID is required.');\n        }\n\n        try {\n            // Use FileService to list files\n            const entries = await this.context.fileService.listFiles(params?.dirPath, userId);\n\n            console.log("], [", { runeId: this.rune.id, userId, params });\n\n        if (!userId) {\n            console.warn('[Rune] Cannot list files: User ID is required.');\n            this.context.loggingService?.logWarning('Cannot list files: User ID is required.');\n            throw new Error('User ID is required.');\n        }\n\n        try {\n            // Use FileService to list files\n            const entries = await this.context.fileService.listFiles(params?.dirPath, userId);\n\n            console.log("]))[Rune];
$;
{
    this.rune.name;
}
listFiles;
result($, { entries: entries, : .length }, entries).(__makeTemplateObject([");\n            return entries;\n\n        } catch (error: any) {\n            console.error("], [");\n            return entries;\n\n        } catch (error: any) {\n            console.error("]))[Rune];
Error;
executing;
$;
{
    this.rune.name;
}
listFiles: ", error);\n            this.context.loggingService?.logError(";
Error;
executing;
rune;
action: $;
{
    this.rune.name;
}
listFiles(__makeTemplateObject([", { runeId: this.rune.id, userId, error: error.message });\n            throw new Error("], [", { runeId: this.rune.id, userId, error: error.message });\n            throw new Error("]));
File;
listing;
failed: $;
{
    error.message;
}
");\n        }\n    }\n\n    /**\n     * Merges new content with existing file content and writes the result back.\n     * Corresponds to the 'mergeAndWriteFile' method in the manifest.\n     * @param params Parameters: { filePath: string, newContent: string, mergeStrategy?: 'append' | 'prepend' | 'replace' | 'diff' }. Required.\n     * @param userId The user ID executing the action. Required.\n     * @returns Promise<void>\n     * @throws Error if the file cannot be read/written or path is invalid.\n     */\n    async mergeAndWriteFile(params: { filePath: string, newContent: string, mergeStrategy?: 'append' | 'prepend' | 'replace' | 'diff' }, userId: string): Promise<void> {\n        console.log("[Rune];
$;
{
    this.rune.name;
}
mergeAndWriteFile;
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
mergeAndWriteFile(__makeTemplateObject([", { runeId: this.rune.id, userId, params: { filePath: params?.filePath, newContentSize: params?.newContent?.length, mergeStrategy: params?.mergeStrategy } });\n\n        if (!params?.filePath || params?.newContent === undefined) {\n            throw new Error('filePath and newContent are required for mergeAndWriteFile.');\n        }\n\n        try {\n            // Use FileService to merge and write the file\n            await this.context.fileService.mergeAndWriteFile(params.filePath, params.newContent, userId, params.mergeStrategy);\n\n            console.log("], [", { runeId: this.rune.id, userId, params: { filePath: params?.filePath, newContentSize: params?.newContent?.length, mergeStrategy: params?.mergeStrategy } });\n\n        if (!params?.filePath || params?.newContent === undefined) {\n            throw new Error('filePath and newContent are required for mergeAndWriteFile.');\n        }\n\n        try {\n            // Use FileService to merge and write the file\n            await this.context.fileService.mergeAndWriteFile(params.filePath, params.newContent, userId, params.mergeStrategy);\n\n            console.log("]))[Rune];
$;
{
    this.rune.name;
}
mergeAndWriteFile;
successful.(__makeTemplateObject([");\n\n        } catch (error: any) {\n            console.error("], [");\n\n        } catch (error: any) {\n            console.error("]))[Rune];
Error;
executing;
$;
{
    this.rune.name;
}
mergeAndWriteFile: ", error);\n            this.context.loggingService?.logError(";
Error;
executing;
rune;
action: $;
{
    this.rune.name;
}
mergeAndWriteFile(__makeTemplateObject([", { runeId: this.rune.id, userId, error: error.message });\n            throw new Error("], [", { runeId: this.rune.id, userId, error: error.message });\n            throw new Error("]));
File;
merge;
and;
write;
failed: $;
{
    error.message;
}
");\n        }\n    }\n\n\n    /**\n     * Method to update configuration (optional).\n     * @param config The new configuration object.\n     */\n    updateConfiguration(config: any): void {\n        console.log("[Rune];
$;
{
    this.rune.name;
}
configuration;
updated: ", config);\n        this.rune.configuration = config; // Update the configuration on the rune object\n        // TODO: Re-initialize any internal clients if configuration changes affect them\n    }\n\n    // Add other file system interaction methods as needed\n    // e.g., createFile, copyFile, moveFile, createDirectory, deleteDirectory\n}\n"(__makeTemplateObject([""], [""]));
