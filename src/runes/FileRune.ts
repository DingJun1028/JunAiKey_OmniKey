```typescript
// src/runes/FileRune.ts
// File System Rune Implementation
// Provides methods to interact with the file system via the FileService.
// This Rune is an example of a 'system-adapter' type Rune.

import { SystemContext, Rune } from '../interfaces';
import * as fs from 'fs/promises'; // Use fs/promises for async file operations
import * as path from 'path'; // Use path module


/**
 * Implements the File System Rune, allowing interaction with the system's file storage.
 * This is an example of a 'system-adapter' type Rune.
 */
export class FileRune {
    private context: SystemContext;
    private rune: Rune; // Reference to the Rune definition

    constructor(context: SystemContext, rune: Rune) {
        this.context = context;
        this.rune = rune;
        console.log(`[Rune] FileRune initialized for ${rune.name}.`);

        // FileRune relies on FileService being initialized
        if (!this.context.fileService) {
             console.error(`[Rune] FileRune ${rune.name} requires FileService to be initialized.`);
             this.context.loggingService?.logError(`FileRune requires FileService`, { runeId: rune.id });
             // Throwing here might prevent the rune from being registered, which is appropriate.
             throw new Error('FileService is not available.');
        }
    }

    /**
     * Reads the content of a file.
     * Corresponds to the '\u958b\u555f\u6a94\u6848' (Open File) functionality.
     * @param params Parameters: { filePath: string }. Required.
     * @param userId The user ID accessing the file. Required for permission checks (Placeholder).
     * @returns Promise<string> The content of the file as a string.
     * @throws Error if the file cannot be read or path is invalid.
     */
    async readFile(params: { filePath: string }, userId: string): Promise<string> {
        console.log(`[Rune] ${this.rune.name}.readFile called by user ${userId} with params:`, params);
        this.context.loggingService?.logInfo(`Executing rune action: ${this.rune.name}.readFile`, { runeId: this.rune.id, userId, params });

        if (!userId) {
            console.warn('[Rune] Cannot read file: User ID is required.');
            this.context.loggingService?.logWarning('Cannot read file: User ID is required.');
            throw new Error('User ID is required.');
        }

        try {
            // Use FileService to read the file
            const content = await this.context.fileService.readFile(params.filePath, userId);

            console.log(`[Rune] ${this.rune.name}.readFile result (content length: ${content.length}).`);
            return content;

        } catch (error: any) {
            console.error(`[Rune] Error executing ${this.rune.name}.readFile:`, error);
            this.context.loggingService?.logError(`Error executing rune action: ${this.rune.name}.readFile`, { runeId: this.rune.id, userId, error: error.message });
            throw new Error(`File read failed: ${error.message}`);
        }
    }

    /**
     * Writes content to a file. If the file exists, it will be overwritten.
     * Creates parent directories if they don't exist.
     * Corresponds to the '\u5beb\u5165\u6a94\u6848' (Write to File) functionality.
     * @param params Parameters: { filePath: string, content: string }. Required.
     * @param userId The user ID writing the file. Required for permission checks (Placeholder).
     * @returns Promise<void>
     * @throws Error if the file cannot be written or path is invalid.
     */
    async writeFile(params: { filePath: string, content: string }, userId: string): Promise<void> {
        console.log(`[Rune] ${this.rune.name}.writeFile called by user ${userId} with params:`, params);
        this.context.loggingService?.logInfo(`Executing rune action: ${this.rune.name}.writeFile`, { runeId: this.rune.id, userId, params: { filePath: params?.filePath, contentSize: params?.content?.length } });

        if (!params?.filePath || params?.content === undefined) {
            throw new Error('filePath and content are required for writeFile.');
        }

        try {
            // Use FileService to write the file
            await this.context.fileService.writeFile(params.filePath, params.content, userId);

            console.log(`[Rune] ${this.rune.name}.writeFile successful.`);

        } catch (error: any) {
            console.error(`[Rune] Error executing ${this.rune.name}.writeFile:`, error);
            this.context.loggingService?.logError(`Error executing rune action: ${this.rune.name}.writeFile`, { runeId: this.rune.id, userId, error: error.message });
            throw new Error(`File write failed: ${error.message}`);
        }
    }

    /**
     * Deletes a file.
     * Corresponds to the '\u522a\u9664\u6a94\u6848' (Delete File) functionality.
     * @param params Parameters: { filePath: string }. Required.
     * @param userId The user ID deleting the file. Required for permission checks (Placeholder).
     * @returns Promise<void>
     * @throws Error if the file cannot be deleted or path is invalid.
     */
    async deleteFile(params: { filePath: string }, userId: string): Promise<void> {
        console.log(`[Rune] ${this.rune.name}.deleteFile called by user ${userId} with params:`, params);
        this.context.loggingService?.logInfo(`Executing rune action: ${this.rune.name}.deleteFile`, { runeId: this.rune.id, userId, params });

        if (!params?.filePath) {
            throw new Error('filePath is required for deleteFile.');
        }

        try {
            // Use FileService to delete the file
            await this.context.fileService.deleteFile(params.filePath, userId);

            console.log(`[Rune] ${this.rune.name}.deleteFile successful.`);

        } catch (error: any) {
            console.error(`[Rune] Error executing ${this.rune.name}.deleteFile:`, error);
            this.context.loggingService?.logError(`Error executing rune action: ${this.rune.name}.deleteFile`, { runeId: this.rune.id, userId, error: error.message });
            throw new Error(`File deletion failed: ${error.message}`);
        }
    }

    /**
     * Lists files and directories within a given path.
     * Corresponds to the 'listFiles' method in the manifest.
     * @param params Parameters: { dirPath?: string }. Optional, defaults to base directory.
     * @param userId The user ID executing the action. Required.
     * @returns Promise<string[]> An array of file and directory names.
     * @throws Error if the directory cannot be read or path is invalid.
     */
    async listFiles(params: { dirPath?: string }, userId: string): Promise<string[]> {
        console.log(`[Rune] ${this.rune.name}.listFiles called by user ${userId} with params:`, params);
        this.context.loggingService?.logInfo(`Executing rune action: ${this.rune.name}.listFiles`, { runeId: this.rune.id, userId, params });

        if (!userId) {
            console.warn('[Rune] Cannot list files: User ID is required.');
            this.context.loggingService?.logWarning('Cannot list files: User ID is required.');
            throw new Error('User ID is required.');
        }

        try {
            // Use FileService to list files
            const entries = await this.context.fileService.listFiles(params?.dirPath, userId);

            console.log(`[Rune] ${this.rune.name}.listFiles result (${entries.length} entries).`);
            return entries;

        } catch (error: any) {
            console.error(`[Rune] Error executing ${this.rune.name}.listFiles:`, error);
            this.context.loggingService?.logError(`Error executing rune action: ${this.rune.name}.listFiles`, { runeId: this.rune.id, userId, error: error.message });
            throw new Error(`File listing failed: ${error.message}`);
        }
    }

    /**
     * Merges new content with existing file content and writes the result back.
     * Corresponds to the 'mergeAndWriteFile' method in the manifest.
     * @param params Parameters: { filePath: string, newContent: string, mergeStrategy?: 'append' | 'prepend' | 'replace' | 'diff' }. Required.
     * @param userId The user ID executing the action. Required.
     * @returns Promise<void>
     * @throws Error if the file cannot be read/written or path is invalid.
     */
    async mergeAndWriteFile(params: { filePath: string, newContent: string, mergeStrategy?: 'append' | 'prepend' | 'replace' | 'diff' }, userId: string): Promise<void> {
        console.log(`[Rune] ${this.rune.name}.mergeAndWriteFile called by user ${userId} with params:`, params);
        this.context.loggingService?.logInfo(`Executing rune action: ${this.rune.name}.mergeAndWriteFile`, { runeId: this.rune.id, userId, params: { filePath: params?.filePath, newContentSize: params?.newContent?.length, mergeStrategy: params?.mergeStrategy } });

        if (!params?.filePath || params?.newContent === undefined) {
            throw new Error('filePath and newContent are required for mergeAndWriteFile.');
        }

        try {
            // Use FileService to merge and write the file
            await this.context.fileService.mergeAndWriteFile(params.filePath, params.newContent, userId, params.mergeStrategy);

            console.log(`[Rune] ${this.rune.name}.mergeAndWriteFile successful.`);

        } catch (error: any) {
            console.error(`[Rune] Error executing ${this.rune.name}.mergeAndWriteFile:`, error);
            this.context.loggingService?.logError(`Error executing rune action: ${this.rune.name}.mergeAndWriteFile`, { runeId: this.rune.id, userId, error: error.message });
            throw new Error(`File merge and write failed: ${error.message}`);
        }
    }


    /**
     * Method to update configuration (optional).
     * @param config The new configuration object.
     */
    updateConfiguration(config: any): void {
        console.log(`[Rune] ${this.rune.name} configuration updated:`, config);
        this.rune.configuration = config; // Update the configuration on the rune object
        // TODO: Re-initialize any internal clients if configuration changes affect them
    }

    // Add other file system interaction methods as needed
    // e.g., createFile, copyFile, moveFile, createDirectory, deleteDirectory
}
```