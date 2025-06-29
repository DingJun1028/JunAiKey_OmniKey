"use strict";
`` `typescript
// src/pages/Files.tsx
// Files Page
// Displays and manages files in the user's storage (simulated filesystem).
// --- New: Add UI for listing files and directories ---\
// --- New: Add UI for viewing file content ---\
// --- New: Add UI for creating, editing, and deleting files ---\

import React, { useEffect, useState } from 'react';
import { FileService } from '../core/files/FileService';
import { AuthorityForgingEngine } from '../core/authority/AuthorityForgingEngine'; // Import AuthorityForgingEngine
import { Folder, FileText, ChevronDown, ChevronUp, Trash2, Edit, PlusCircle, Save, Loader2, Info, ArrowLeft } from 'lucide-react'; // Import icons
import * as path from 'path'; // Import path module


// Access core modules from the global window object (for MVP simplicity)
// In a real app, use React Context or dependency injection
declare const window: any;
const fileService: FileService = window.systemContext?.fileService; // The File Service (\u6587\u4ef6\u670d\u52d9) module
const authorityForgingEngine: any = window.systemContext?.authorityForgingEngine; // Use any for action recording (\u6b0a\u80fd\u935b\u9020)
const systemContext: any = window.systemContext; // Access the full context for currentUser


const Files: React.FC = () => {
  const [currentDir, setCurrentDir] = useState('/'); // State for the current directory being viewed
  const [entries, setEntries] = useState<string[]>([]); // State for files and directories in the currentDir
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for file content viewing/editing
  const [viewingFile, setViewingFile] = useState<string | null>(null); // Path of the file being viewed
  const [fileContent, setFileContent] = useState<string | null>(null); // Content of the file being viewed
  const [loadingFileContent, setLoadingFileContent] = useState(false);
  const [editingFileContent, setEditingFileContent] = useState<string | null>(null); // Content being edited
  const [isSavingFile, setIsSavingFile] = useState(false);

  // State for creating new file
  const [isCreatingFile, setIsCreatingFile] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [newFileContent, setNewFileContent] = useState('');
  const [isCreatingDirectory, setIsCreatingDirectory] = useState(false);
  const [newDirName, setNewDirName] = useState('');


  const fetchEntries = async (dirPath: string) => {
       const userId = systemContext?.currentUser?.id;
       if (!fileService || !userId) {
            setError("FileService module not initialized or user not logged in.");
            setLoading(false);
            return;
        }
      setLoading(true);
      setError(null); // Clear main error when fetching
      try {
          // Fetch entries for the current directory
          const dirEntries = await fileService.listFiles(dirPath, userId); // Pass dirPath and user ID
          setEntries(dirEntries);
          setCurrentDir(dirPath); // Update current directory state
      } catch (err: any) {
          console.error('Error fetching directory entries:', err);
          setError(`;
Failed;
to;
load;
directory;
entries: $;
{
    err.message;
}
`);
          setEntries([]); // Clear entries on error
      } finally {
          setLoading(false);
      }
  };

  const fetchFileContent = async (filePath: string) => {
       const userId = systemContext?.currentUser?.id;
       if (!fileService || !userId) {
            setError("FileService module not initialized or user not logged in.");
            setLoadingFileContent(false);
            return;
        }
      setLoadingFileContent(true);
      setError(null); // Clear main error when fetching file content
      try {
          // Fetch file content
          const content = await fileService.readFile(filePath, userId); // Pass filePath and user ID
          setFileContent(content);
          setEditingFileContent(content); // Initialize editing state with fetched content
          setViewingFile(filePath); // Set the file being viewed
      } catch (err: any) {\
          console.error('Error fetching file content:', err);
          setError(`;
Failed;
to;
load;
file;
content: $;
{
    err.message;
}
`);
          setFileContent(null);
          setEditingFileContent(null);
          setViewingFile(null); // Clear viewing file on error
      } finally {
          setLoadingFileContent(false);
      }
  };


  useEffect(() => {
    // Fetch entries when the component mounts or when the user changes or currentDir changes
    if (systemContext?.currentUser?.id) {
        fetchEntries(currentDir); // Fetch entries for the current directory
    }

    // TODO: Subscribe to realtime updates for file changes if implemented in FileService/SyncService
    // fileService?.context?.eventBus?.subscribe('file_written', (payload) => { ... });
    // fileService?.context?.eventBus?.subscribe('file_deleted', (payload) => { ... });

  }, [systemContext?.currentUser?.id, fileService, currentDir]); // Re-run effect when user ID, service, or currentDir changes


    const handleEntryClick = (entryName: string) => {
        const entryPath = path.join(currentDir, entryName);
        // Determine if it's a file or directory (requires checking stats, not available in simple listFiles)
        // For MVP, let's assume entries without extensions are directories, and entries with extensions are files.
        // A more robust approach would use fs.stat() or rely on metadata from a synced file list.
        const isDirectory = !path.extname(entryName) && entryName !== '..'; // Simple heuristic, exclude '..'\

        if (isDirectory) {
            fetchEntries(entryPath); // Navigate into directory
        } else {
            fetchFileContent(entryPath); // View file content
        }
    };

    const handleGoBack = () => {
        const parentDir = path.dirname(currentDir);
        if (parentDir !== currentDir) { // Prevent going above the base directory '/'\
            fetchEntries(parentDir);
        }
    };

    const handleCloseFileView = () => {
        setViewingFile(null);
        setFileContent(null);
        setEditingFileContent(null);
        setError(null); // Clear file-specific errors
    };

    const handleSaveFile = async () => {
        const userId = systemContext?.currentUser?.id;
        if (!fileService || !userId || !viewingFile || editingFileContent === null) {
            alert(\"FileService module not initialized, user not logged in, or no file selected/content to save.\");
            return;
        }
        setIsSavingFile(true);
        setError(null);
        try {
            // Use FileService to update the file
            await fileService.updateFile(viewingFile, editingFileContent, userId); // Pass filePath, content, user ID
            alert(`;
File;
$;
{
    viewingFile;
}
saved;
successfully `);
            // Update the displayed content after saving
            setFileContent(editingFileContent);
             // Simulate recording user action
            authorityForgingEngine?.recordAction({
                type: 'web:files:save',
                details: { filePath: viewingFile },
                context: { platform: 'web', page: 'files' },
                user_id: userId, // Associate action with user
            });
        } catch (err: any) {
            console.error('Error saving file:', err);
            setError(`;
Failed;
to;
save;
file: $;
{
    err.message;
}
`);
        } finally {
            setIsSavingFile(false);
        }
    };

    const handleDeleteFile = async (filePath: string) => {
        const userId = systemContext?.currentUser?.id;
        if (!fileService || !userId) {
            alert(\"FileService module not initialized or user not logged in.\");
            return;
        }
        if (!confirm(`;
Are;
you;
sure;
you;
want;
to;
delete $;
{
    filePath;
}
`)) return;

        setError(null);
        try {
            // Use FileService to delete the file
            await fileService.deleteFile(filePath, userId); // Pass filePath and user ID
            alert(`;
File;
$;
{
    filePath;
}
deleted;
successfully `);
            // If the deleted file was being viewed, close the viewer
            if (viewingFile === filePath) {
                handleCloseFileView();
            }
            // Refetch entries for the current directory to update the list
            fetchEntries(currentDir);
             // Simulate recording user action
            authorityForgingEngine?.recordAction({
                type: 'web:files:delete',
                details: { filePath },
                context: { platform: 'web', page: 'files' },
                user_id: userId, // Associate action with user
            });
        } catch (err: any) {
            console.error('Error deleting file:', err);
            setError(`;
Failed;
to;
delete file;
$;
{
    err.message;
}
`);
            alert(`;
Failed;
to;
delete file;
$;
{
    err.message;
}
`);
        } finally {
            setIsSavingFile(false);
        }
    };

    const handleCreateNewFile = async (e: React.FormEvent) => {
        e.preventDefault();
        const userId = systemContext?.currentUser?.id;
        if (!fileService || !userId || !newFileName.trim()) {
            alert(\"FileService module not initialized, user not logged in, or file name is empty.\");
            return;
        }
        const filePath = path.join(currentDir, newFileName.trim());
        setIsSavingFile(true); // Use saving state for creation too
        setError(null);
        try {
            // Use FileService to write the new file
            await fileService.writeFile(filePath, newFileContent, userId); // Pass filePath, content, user ID
            alert(`;
File;
$;
{
    filePath;
}
created;
successfully `);
            // Reset form and refetch entries
            setIsCreatingFile(false);
            setNewFileName('');
            setNewFileContent('');
            fetchEntries(currentDir);
             // Simulate recording user action
            authorityForgingEngine?.recordAction({
                type: 'web:files:create',
                details: { filePath },
                context: { platform: 'web', page: 'files' },
                user_id: userId, // Associate action with user
            });
        } catch (err: any) {
            console.error('Error creating file:', err);
            setError(`;
Failed;
to;
create;
file: $;
{
    err.message;
}
`);
        } finally {
            setIsSavingFile(false);
        }
    };

     const handleCreateNewDirectory = async (e: React.FormEvent) => {
        e.preventDefault();
        const userId = systemContext?.currentUser?.id;
        if (!fileService || !userId || !newDirName.trim()) {
            alert(\"FileService module not initialized, user not logged in, or directory name is empty.\");
            return;
        }
        const dirPath = path.join(fileService['baseDir'], currentDir, newDirName.trim()); // Use baseDir internally for mkdir
        setIsSavingFile(true); // Use saving state for creation too
        setError(null);
        try {
            // Use Node.js fs.mkdir directly as FileService doesn't expose it yet
            // Or add a createDirectory method to FileService
            // For MVP, let's simulate or add a simple mkdir wrapper in FileService
            // Adding a wrapper method to FileService is better. Let's assume fileService.createDirectory exists.
            // await fileService.createDirectory(path.join(currentDir, newDirName.trim()), userId); // Pass path relative to baseDir

            // --- Using fs.mkdir directly for MVP simplicity ---\
            const safeDirPath = fileService['resolveSafePath'](path.join(currentDir, newDirName.trim())); // Use internal helper for safety
            await fs.mkdir(safeDirPath, { recursive: true });
            // --- End using fs.mkdir directly ---\

            alert(`;
Directory;
$;
{
    path.join(currentDir, newDirName.trim());
}
created;
successfully `);
            // Reset form and refetch entries
            setIsCreatingDirectory(false);
            setNewDirName('');
            fetchEntries(currentDir);
             // Simulate recording user action
            authorityForgingEngine?.recordAction({
                type: 'web:files:create_directory',
                details: { dirPath: path.join(currentDir, newDirName.trim()) },
                context: { platform: 'web', page: 'files' },
                user_id: userId, // Associate action with user
            });
        } catch (err: any) {
            console.error('Error creating directory:', err);
            setError(`;
Failed;
to;
create;
directory: $;
{
    err.message;
}
`);
        } finally {
            setIsSavingFile(false);
        }
    };


   // Ensure user is logged in before rendering content
  if (!systemContext?.currentUser) {
       // This case should ideally be handled by ProtectedRoute, but as a fallback:
       return (
            <div className=\"container mx-auto p-4 flex justify-center\">
               <div className=\"bg-neutral-800/50 p-8 rounded-lg shadow-xl w-full max-w-md text-center text-neutral-300\">
                   <p>Please log in to view your files.</p>
               </div>
            </div>
       );
  }


  return (
    <div className=\"container mx-auto p-4\">
      <div className=\"bg-neutral-800/50 p-6 rounded-lg shadow-xl\">
        <h2 className=\"text-3xl font-bold text-blue-400 mb-6\">Files (\u6587\u4ef6\u670d\u52d9)</h2>
        <p className=\"text-neutral-300 mb-8\">Manage files in your personal storage (simulated filesystem in WebContainer).</p>

        {/* File Content Viewer/Editor Modal */}\
        {viewingFile && (\
             <div className=\"fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50\">\
                 <div className=\"bg-neutral-800 p-8 rounded-lg shadow-xl w-full max-w-2xl h-5/6 flex flex-col\"> {/* Added flex-col and height */}\
                     <div className=\"flex justify-between items-center mb-4\">\
                         <h3 className=\"text-xl font-semibold text-blue-300\">Viewing/Editing: {viewingFile}</h3>\
                         <button\
                             type=\"button\"\
                             onClick={handleCloseFileView}\
                             className=\"text-neutral-400 hover:text-white transition\"\
                             disabled={isSavingFile}\
                         >\
                             <XCircle size={24} />\
                         </button>\
                     </div>\
                     {loadingFileContent ? (\
                         <div className=\"flex-grow flex justify-center items-center\">\
                             <Loader2 size={32} className=\"animate-spin text-blue-400\"/>\
                         </div>\
                     ) : error ? (\
                         <div className=\"flex-grow text-red-400 overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-700\">\
                             <p>Error loading file: {error}</p>\
                         </div>\
                     ) : (\
                         <div className=\"flex-grow flex flex-col\"> {/* Added flex-col */}\
                             <textarea\
                                 className=\"flex-grow w-full p-2 rounded-md bg-neutral-900 text-neutral-200 border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-xs overflow-auto scrollbar-thin scrollbar-thumb-neutral-700\"\
                                 value={editingFileContent || ''}\
                                 onChange={(e) => setEditingFileContent(e.target.value)}\
                                 disabled={isSavingFile}\
                             />\
                             {error && !isSavingFile && ( // Show save error only after it finishes\
                                 <p className=\"text-red-400 text-sm mt-2\">Error: {error}</p>\
                             )}\
                             <div className=\"flex gap-4 justify-end mt-4\">\
                                 <button\
                                     type=\"button\"\
                                     onClick={handleSaveFile}\
                                     className=\"px-6 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed\"\
                                     disabled={isSavingFile}\
                                 >\
                                     {isSavingFile ? 'Saving...' : 'Save Changes'}\
                                 </button>\
                             </div>\
                         </div>\
                     )}\
                 </div>\
             </div>\
        )}\


        {/* Create New File/Directory Forms */}\
        {!viewingFile && ( // Only show create forms when not viewing a file
             <div className=\"mb-8 p-4 bg-neutral-700/50 rounded-lg\">\
                 <h3 className=\"text-xl font-semibold text-blue-300 mb-3\">Create New</h3>\
                 <div className=\"flex gap-4\">\
                     <button\
                         className=\"px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition disabled:opacity-50\"\
                         onClick={() => { setIsCreatingFile(true); setIsCreatingDirectory(false); setError(null); }}\
                         disabled={isCreatingFile || isCreatingDirectory || isSavingFile}\
                     >\
                         <PlusCircle size={20} className=\"inline-block mr-2\"/> File\
                     </button>\
                      <button\
                         className=\"px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition disabled:opacity-50\"\
                         onClick={() => { setIsCreatingDirectory(true); setIsCreatingFile(false); setError(null); }}\
                         disabled={isCreatingFile || isCreatingDirectory || isSavingFile}\
                     >\
                         <PlusCircle size={20} className=\"inline-block mr-2\"/> Directory\
                     </button>\
                 </div>\

                 {isCreatingFile && (\
                     <form onSubmit={handleCreateNewFile} className=\"mt-4 p-3 bg-neutral-600/50 rounded-md\">\
                         <h4 className=\"text-neutral-300 text-sm font-semibold mb-2\">New File in {currentDir === '/' ? '/' : currentDir + '/'}</h4>\
                         <div className=\"mb-2\">\
                             <label htmlFor=\"newFileName\" className=\"block text-neutral-400 text-xs font-semibold mb-1\">File Name:</label>\
                             <input\
                                 id=\"newFileName\"\
                                 type=\"text\"\
                                 className=\"w-full p-1 rounded-md bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm\"\
                                 value={newFileName}\
                                 onChange={(e) => setNewFileName(e.target.value)}\
                                 placeholder=\"e.g., my_script.js\"\
                                 disabled={isSavingFile}\
                                 required\
                             />\
                         </div>\
                          <div className=\"mb-2\">\
                             <label htmlFor=\"newFileContent\" className=\"block text-neutral-400 text-xs font-semibold mb-1\">Initial Content:</label>\
                              <textarea\
                                 id=\"newFileContent\"\
                                 className=\"w-full p-1 rounded-md bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono text-xs\"\
                                 value={newFileContent}\
                                 onChange={(e) => setNewFileContent(e.target.value)}\
                                 rows={4}\
                                 disabled={isSavingFile}\
                              />\
                         </div>\
                         <div className=\"flex gap-4\">\
                             <button\
                                 type=\"submit\"\
                                 className=\"px-6 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed\"\
                                 disabled={isSavingFile || !newFileName.trim()}\
                             >\
                                 {isSavingFile ? 'Creating...' : 'Create File'}\
                             </button>\
                              <button\
                                 type=\"button\"\
                                 onClick={() => { setIsCreatingFile(false); setNewFileName(''); setNewFileContent(''); setError(null); }}\
                                 className=\"px-6 py-2 bg-neutral-600 text-white font-semibold rounded-md hover:bg-neutral-700 transition\"\
                                 disabled={isSavingFile}\
                             >\
                                 Cancel\
                             </button>\
                         </div>\
                     </form>\
                 )}\

                 isCreatingDirectory && (\
                     <form onSubmit={handleCreateNewDirectory} className=\"mt-4 p-3 bg-neutral-600/50 rounded-md\">\
                         <h4 className=\"text-neutral-300 text-sm font-semibold mb-2\">New Directory in {currentDir === '/' ? '/' : currentDir + '/'}</h4>\
                         <div className=\"mb-2\">\
                             <label htmlFor=\"newDirName\" className=\"block text-neutral-400 text-xs font-semibold mb-1\">Directory Name:</label>\
                             <input\
                                 id=\"newDirName\"\
                                 type=\"text\"\
                                 className=\"w-full p-1 rounded-md bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm\"\
                                 value={newDirName}\
                                 onChange={(e) => setNewDirName(e.target.value)}\
                                 placeholder=\"e.g., my_folder\"\
                                 disabled={isSavingFile}\
                                 required\
                             />\
                         </div>\
                         <div className=\"flex gap-4\">\
                             <button\
                                 type=\"submit\"\
                                 className=\"px-6 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed\"\
                                 disabled={isSavingFile || !newDirName.trim()}\
                             >\
                                 {isSavingFile ? 'Creating...' : 'Create Directory'}\
                             </button>\
                              <button\
                                 type=\"button\"\
                                 onClick={() => { setIsCreatingDirectory(false); setNewDirName(''); setError(null); }}\
                                 className=\"px-6 py-2 bg-neutral-600 text-white font-semibold rounded-md hover:bg-neutral-700 transition\"\
                                 disabled={isSavingFile}\
                             >\
                                 Cancel\
                             </button>\
                         </div>\
                     </form>\
                 )}\

                 {error && !isSavingFile && !viewingFile && ( // Show create error only after it finishes and not viewing file
                     <p className=\"text-red-400 text-sm mt-4\">Error: {error}</p>\
                 )}\
             </div>
        )}\


        {/* File/Directory List */}\
        {!viewingFile && ( // Only show list when not viewing a file
             <div className=\"p-4 bg-neutral-700/50 rounded-lg\">\
                 <h3 className=\"text-xl font-semibold text-blue-300 mb-3\">Contents of: {currentDir}</h3>\
                 {currentDir !== '/' && (\
                     <button\
                         className=\"mb-4 px-3 py-1 text-sm bg-neutral-600 text-white rounded hover:bg-neutral-700 transition\"\
                         onClick={handleGoBack}\
                         disabled={loading}\
                     >\
                         <ArrowLeft size={16} className=\"inline-block mr-1\"/> Go Back\
                     </button>\
                 )}\
                 {loading && !isSavingFile ? ( // Show loading only if not currently saving
                   <p className=\"text-neutral-400\">Loading entries...</p>\
                 ) : error && !isCreatingFile && !isCreatingDirectory ? ( // Show main error if not in create mode
                   <p className=\"text-red-400\">Error: {error}</p>\
                 ) : entries.length === 0 && currentDir !== '/' ? ( // Show message if directory is empty
                   <p className=\"text-neutral-400\">This directory is empty.</p>\
                 ) : entries.length === 0 && currentDir === '/' ? ( // Show message if base directory is empty
                    <p className=\"text-neutral-400\">No files or directories found yet. Create one above.</p>\
                 ) : (\
                   <ul className=\"space-y-3\">\
                     {entries.map((entryName) => {\
                         const entryPath = path.join(currentDir, entryName);\
                         // Simple heuristic for file/directory icon\
                         const isDirectory = !path.extname(entryName); // Assume no extension means directory\
                         const Icon = isDirectory ? Folder : FileText;\

                         return (\
                           <li key={entryName} className=\"bg-neutral-600/50 p-3 rounded-md border-l-4 border-blue-500 flex justify-between items-center\">\
                             <div className=\"flex items-center gap-3 cursor-pointer\" onClick={() => handleEntryClick(entryName)}>\
                                 <Icon size={20} className=\"text-blue-400\"/>\
                                 <span className=\"text-neutral-300 font-semibold\">{entryName}</span>\
                             </div>\
                             {/* Actions (only for files in MVP) */}\
                             {!isDirectory && (\
                                 <div className=\"flex gap-2\">\
                                     {/* Edit/View Button */}\
                                     <button\
                                        className=\"px-3 py-1 text-xs bg-yellow-600 text-white rounded hover:bg-yellow-700 transition\"\
                                        onClick={() => fetchFileContent(entryPath)} // Open file for viewing/editing\
                                        disabled={isSavingFile}\
                                     >\
                                         <Edit size={16} className=\"inline-block mr-1\"/> Edit\
                                     </button>\
                                      {/* Delete Button */}\
                                     <button\
                                        className=\"px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed\"\
                                        onClick={() => handleDeleteFile(entryPath)}\
                                        disabled={isSavingFile}\
                                     >\
                                         <Trash2 size={16} className=\"inline-block mr-1\"/> Delete\
                                     </button>\
                                 </div>\
                             )}\
                              {/* TODO: Add actions for directories (e.g., Delete Directory) */}\
                           </li>\
                         );\
                     })}\
                   </ul>\
                 )}\
             </div>
        )}\


      </div>
    </div>
  );
};

export default Files;
` ``;
