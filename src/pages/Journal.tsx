```typescript
// src/pages/Journal.tsx
// Journal Page
// Displays and manages user's journal entries (Knowledge Records with source 'journal').
// --- New: Create a page for the Journal UI ---
// --- New: Implement fetching and displaying journal entries ---
// --- New: Add UI for creating, editing, and deleting entries ---
// --- New: Add Realtime Updates for 'journal' knowledge_records ---
// --- New: Add UI for starring and tagging journal entries ---


import React, { useEffect, useState } from 'react';
import { MemoryEngine } from '../core/memory/MemoryEngine'; // To fetch and manage records
import { KnowledgeSync } from '../modules/knowledgeSync'; // To save/update/delete records
import { AuthorityForgingEngine } from '../core/authority/AuthorityForgingEngine'; // Use for action recording
import { KnowledgeRecord } from '../interfaces'; // Import KnowledgeRecord type
import { BookOpen, ChevronDown, ChevronUp, Trash2, Edit, PlusCircle, Save, Loader2, Info, Star, StarHalf, StarOff, Tag } from 'lucide-react'; // Import icons including Star, Tag
import ReactMarkdown from 'react-markdown'; // For rendering markdown


// Access core modules from the global window object (for MVP simplicity)
// In a real app, use React Context or dependency injection
declare const window: any;
const memoryEngine: MemoryEngine = window.systemContext?.memoryEngine; // The Memory Engine (永久記憶) pillar
const knowledgeSync: KnowledgeSync = window.systemContext?.knowledgeSync; // Interacts with MemoryEngine for saving/updating/deleting
const authorityForgingEngine: any = window.systemContext?.authorityForgingEngine; // Use any for action recording (權能鍛造)
const systemContext: any = window.systemContext; // Access the full context for currentUser


const Journal: React.FC = () => {
  const [entries, setEntries] = useState<KnowledgeRecord[]>([]); // State to hold journal entries
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedEntries, setExpandedEntries] = useState<Record<string, boolean>>({}); // State to track expanded entries

  // --- State for creating new entry ---
  const [isCreatingEntry, setIsCreatingEntry] = useState(false);
  const [newEntryContent, setNewEntryContent] = useState(''); // Journal entries are primarily content
  const [newEntryTags, setNewEntryTags] = useState<string[]>([]); // Tags for the entry
  const [newEntryIsStarred, setNewEntryIsStarred] = useState(false); // Starred status
  const [isSavingEntry, setIsSavingEntry] = useState(false);
  // --- End New ---

  // --- State for editing entry ---
  const [editingEntry, setEditingEntry] = useState<KnowledgeRecord | null>(null); // The entry being edited
  const [editingEntryContent, setEditingEntryContent] = useState('');
  const [editingEntryTags, setEditingEntryTags] = useState<string[]>([]);
  const [editingEntryIsStarred, setEditingEntryIsStarred] = useState(false);
  const [isUpdatingEntry, setIsUpdatingEntry] = useState(false);
  // --- End New ---


  const fetchEntries = async () => {
       const userId = systemContext?.currentUser?.id;
       if (!memoryEngine || !userId) {
            setError("MemoryEngine module not initialized or user not logged in.");
            setLoading(false);
            return;
        }
      setLoading(true);
      setError(null); // Clear main error when fetching
      try {
          // Fetch knowledge records with source 'journal' for the current user
          const allRecords = await memoryEngine.getAllKnowledgeForUser(userId); // Fetch all for simplicity
          const journalEntries = allRecords
              .filter(record => record.source === 'journal')
              // Sort by timestamp descending to display newest first
              .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

          setEntries(journalEntries);
      } catch (err: any) {
          console.error('Error fetching journal entries:', err);
          setError(`Failed to load journal entries: ${err.message}`);
      } finally {
          setLoading(false);
      }
  };

  useEffect(() => {
    // Fetch data when the component mounts or when the user changes
    if (systemContext?.currentUser?.id) {
        fetchEntries(); // Fetch all entries on initial load
    }

    // --- New: Subscribe to realtime updates for knowledge_records with source 'journal' ---
    let unsubscribeInsert: (() => void) | undefined;
    let unsubscribeUpdate: (() => void) | undefined;
    let unsubscribeDelete: (() => void) | undefined;


    if (memoryEngine?.context?.eventBus) { // Check if MemoryEngine and its EventBus are available
        const eventBus = memoryEngine.context.eventBus;
        const userId = systemContext?.currentUser?.id;

        // Subscribe to insert events
        unsubscribeInsert = eventBus.subscribe('knowledge_record_insert', (payload: KnowledgeRecord) => {
            if (payload.user_id === userId && payload.source === 'journal') {
                console.log('Journal page received knowledge_record_insert event:', payload);
                // Add the new entry and keep sorted
                setEntries(prevEntries => [payload, ...prevEntries].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
            }
        });

        // Subscribe to update events
        unsubscribeUpdate = eventBus.subscribe('knowledge_record_update', (payload: KnowledgeRecord) => {
             if (payload.user_id === userId && payload.source === 'journal') {
                 console.log('Journal page received knowledge_record_update event:', payload);
                 // Update the specific entry in the state
                 setEntries(prevEntries => prevEntries.map(entry => entry.id === payload.id ? payload : entry));
             }
         });

        // Subscribe to delete events
        unsubscribeDelete = eventBus.subscribe('knowledge_record_delete', (payload: { id: string, userId: string }) => {
             if (payload.userId === userId) {
                 console.log('Journal page received knowledge_record_delete event:', payload);
                 // Remove the deleted entry from the state
                 setEntries(prevEntries => prevEntries.filter(entry => entry.id !== payload.id));
             }
         });
    }
    // --- End New ---


    return () => {
        // Unsubscribe on component unmount
        unsubscribeInsert?.();
        unsubscribeUpdate?.();
        unsubscribeDelete?.();
    };

  }, [systemContext?.currentUser?.id, memoryEngine]); // Re-run effect when user ID or service changes


    const toggleExpandEntry = (entryId: string) => {
        setExpandedEntries(prevState => ({
            ...prevState,
            [entryId]: !prevState[entryId]
        }));
    };

    // --- New: Handle Create Entry ---
    const handleCreateEntry = async (e: React.FormEvent) => {
        e.preventDefault();
        const userId = systemContext?.currentUser?.id;
        if (!knowledgeSync || !userId || !newEntryContent.trim()) {
            alert("KnowledgeSync module not initialized, user not logged in, or entry content is empty.");
            return;
        }

        setIsSavingEntry(true);
        setError(null);
        try {
            // Journal entries are stored as Knowledge Records with source 'journal'
            // The 'question' can be the first line or a timestamp, 'answer' is the main content.
            // Let's use the timestamp as the question for simplicity.
            const timestamp = new Date().toISOString();
            const question = `Journal Entry ${timestamp}`; // Use timestamp as question
            const answer = newEntryContent.trim(); // Use content as answer
            const source = 'journal';
            const tags = newEntryTags.map(tag => tag.trim()).filter(tag => tag); // Clean and filter tags
            const isStarred = newEntryIsStarred;

            const savedRecord = await knowledgeSync.saveKnowledge(question, answer, userId, source, undefined, isStarred, tags); // Pass all details

            if (savedRecord) {
                alert(`Journal entry created successfully!`);
                console.log('Created new journal entry:', savedRecord);
                // Reset form
                setNewEntryContent('');
                setNewEntryTags([]);
                setNewEntryIsStarred(false);
                setIsCreatingEntry(false); // Hide form
                // State update handled by realtime listener
                 // Simulate recording user action
                authorityForgingEngine?.recordAction({
                    type: 'web:journal:create',
                    details: { entryId: savedRecord.id, contentPreview: savedRecord.answer.substring(0, 50) + '...' },
                    context: { platform: 'web', page: 'journal' },
                    user_id: userId, // Associate action with user
                });
            } else {
                setError('Failed to create journal entry.');
            }
        } catch (err: any) {
            console.error('Error creating journal entry:', err);
            setError(`Failed to create journal entry: ${err.message}`);
        } finally {
            setIsSavingEntry(false);
        }
    };

    const handleCancelCreate = () => {
        setIsCreatingEntry(false);
        setNewEntryContent('');
        setNewEntryTags([]);
        setNewEntryIsStarred(false);
        setError(null); // Clear error when cancelling
    };
    // --- End New ---

    // --- New: Handle Edit Entry ---
    const handleEditEntryClick = (entry: KnowledgeRecord) => {
        setEditingEntry(entry);
        setEditingEntryContent(entry.answer); // Edit the answer (content)
        setEditingEntryTags(entry.tags || []);
        setEditingEntryIsStarred(entry.is_starred || false);
        setError(null); // Clear previous errors when starting edit
    };

    const handleUpdateEntry = async (e: React.FormEvent) => {
        e.preventDefault();
        const userId = systemContext?.currentUser?.id;
        if (!knowledgeSync || !editingEntry || !userId) return; // Safety checks

        if (!editingEntryContent.trim()) {
            alert('Journal entry content cannot be empty.');
            return;
        }

        setIsUpdatingEntry(true);
        setError(null);
        try {
            // Update the Knowledge Record
            const updatedEntry = await knowledgeSync.updateKnowledge(editingEntry.id, {
                answer: editingEntryContent.trim(), // Update the answer (content)
                tags: editingEntryTags.map(tag => tag.trim()).filter(tag => tag), // Update tags
                is_starred: editingEntryIsStarred, // Update starred status
                // Question and source remain 'journal' and original timestamp
            }, userId); // Pass userId

            if (updatedEntry) {
                alert(`Journal entry updated successfully!`);
                console.log('Entry updated:', updatedEntry);
                setEditingEntry(null); // Close edit form
                setEditingEntryContent('');
                setEditingEntryTags([]);
                setEditingEntryIsStarred(false);
                // State update handled by realtime listener
                 // Simulate recording user action
                authorityForgingEngine?.recordAction({
                    type: 'web:journal:update',
                    details: { entryId: updatedEntry.id, contentPreview: updatedEntry.answer.substring(0, 50) + '...' },
                    context: { platform: 'web', page: 'journal' },
                    user_id: userId, // Associate action with user
                });
            } else {
                setError('Failed to update journal entry.');
            }
        } catch (err: any) {
            console.error('Error updating journal entry:', err);
            setError(`Failed to update journal entry: ${err.message}`);
        } finally {
            setIsUpdatingEntry(false);
        }
    };

    const handleCancelEdit = () => {
        setEditingEntry(null);
        setEditingEntryContent('');
        setEditingEntryTags([]);
        setEditingEntryIsStarred(false);
        setError(null);
    };
    // --- End New ---


   const handleDeleteEntry = async (entryId: string) => {
       const userId = systemContext?.currentUser?.id;
       if (!knowledgeSync || !userId) {
           alert(\"KnowledgeSync module not initialized or user not logged in.\");
           return;
       }
       if (!confirm(`Are you sure you want to delete this journal entry?`)) return;

       setError(null);
       try {
           // Delete the Knowledge Record
           const success = await knowledgeSync.deleteKnowledge(entryId, userId); // Pass entryId and userId
           if (success) {
               console.log('Entry deleted:', entryId);
               // State update handled by realtime listener
                alert('Journal entry deleted successfully!');
                 // Simulate recording user action
                authorityForgingEngine?.recordAction({
                    type: 'web:journal:delete',
                    details: { entryId },
                    context: { platform: 'web', page: 'journal' },
                    user_id: userId, // Associate action with user
                });
           } else {
               setError('Failed to delete journal entry.');
           }
       } catch (err: any) {
           console.error('Error deleting journal entry:', err);
           setError(`Failed to delete journal entry: ${err.message}`);
       } finally {
           setLoading(false); // Ensure loading is false after delete attempt
       }
   };

    // --- New: Handle Tag Input Change ---
    const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>, isEditing: boolean) => {
        const tags = e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag);
        if (isEditing) {
            setEditingEntryTags(tags);
        } else {
            setNewEntryTags(tags);
        }
    };

    const getTagInputString = (tags: string[] | undefined) => {
        return (tags || []).join(', ');
    };
    // --- End New ---

    // --- New: Handle Star Toggle ---
    const handleToggleStar = async (entry: KnowledgeRecord) => {
        const userId = systemContext?.currentUser?.id;
        if (!knowledgeSync || !userId) return;

        const newStarredStatus = !entry.is_starred;
        console.log(`Toggling star for entry ${entry.id} to ${newStarredStatus}`);
         // Simulate recording user action
        authorityForgingEngine?.recordAction({
            type: `web:journal:toggle_star:${newStarredStatus}`,
            details: { entryId: entry.id, isStarred: newStarredStatus },
            context: { platform: 'web', page: 'journal' },
            user_id: userId, // Associate action with user
        });

        // Optimistically update UI
        setEntries(prevEntries => prevEntries.map(e => e.id === entry.id ? { ...e, is_starred: newStarredStatus } : e));

        try {
            // Update the Knowledge Record in the backend
            await knowledgeSync.updateKnowledge(entry.id, { is_starred: newStarredStatus }, userId);
            // Realtime listener will confirm the update, but optimistic update is faster
        } catch (err: any) {
            console.error(`Error toggling star for entry ${entry.id}:`, err);
            setError(`Failed to toggle star: ${err.message}`);
            // Revert optimistic update on error
            setEntries(prevEntries => prevEntries.map(e => e.id === entry.id ? { ...e, is_starred: !newStarredStatus } : e));
        }
    };
    // --- End New ---


   // Ensure user is logged in before rendering content
  if (!systemContext?.currentUser) {
       // This case should ideally be handled by ProtectedRoute, but as a fallback:
       return (
            <div className="container mx-auto p-4 flex justify-center">
               <div className="bg-neutral-800/50 p-8 rounded-lg shadow-xl w-full max-w-md text-center text-neutral-300">
                   <p>Please log in to view your journal.</p>
               </div>
            </div>
       );
  }


  return (
    <div className="container mx-auto p-4">
      <div className="bg-neutral-800/50 p-6 rounded-lg shadow-xl">
        <h2 className="text-3xl font-bold text-blue-400 mb-6">Journal (日誌)</h2>
        <p className="text-neutral-300 mb-8">Record your thoughts, experiences, and daily logs.</p>

        {/* Form for creating new entries */}
        {!isCreatingEntry && !editingEntry && ( // Only show create button if not creating or editing
            <div className="mb-8 p-4 bg-neutral-700/50 rounded-lg">
                 <h3 className="text-xl font-semibold text-blue-300 mb-3">Add New Journal Entry</h3>
                 <button
                     className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition disabled:opacity-50"
                     onClick={() => { setIsCreatingEntry(true); setError(null); }}
                     disabled={isSavingEntry || isUpdatingEntry}
                 >
                     <PlusCircle size={20} className="inline-block mr-2"/> Add Entry
                 </button>
            </div>
        )}

        {isCreatingEntry && !editingEntry && ( // Show create form if creating and not editing
             <div className="mb-8 p-4 bg-neutral-700/50 rounded-lg">
                 <h3 className="text-xl font-semibold text-blue-300 mb-3">New Journal Entry</h3>
                 <form onSubmit={handleCreateEntry}>
                     <div className="mb-4">
                        <label htmlFor="newEntryContent" className="block text-neutral-300 text-sm font-semibold mb-2">Content:</label>
                         <textarea
                            id="newEntryContent"
                            className="w-full p-2 rounded-md bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={newEntryContent}
                            onChange={(e) => setNewEntryContent(e.target.value)}
                            placeholder="Write your journal entry here... (Markdown supported)"
                            rows={8}
                            disabled={isSavingEntry}
                            required
                         />
                    </div>
                     {/* New: Tags and Starred Input */}
                     <div className="mb-4 p-3 bg-neutral-600/50 rounded-md space-y-2">
                         <h4 className="text-neutral-300 text-sm font-semibold mb-2">Metadata:</h4>
                         <div>
                             <label htmlFor="newEntryTags" className="block text-neutral-400 text-xs font-semibold mb-1">Tags (comma-separated):</label>
                             <input
                                 id="newEntryTags"
                                 type="text"
                                 className="w-full p-1 rounded-md bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                                 value={getTagInputString(newEntryTags)}
                                 onChange={(e) => handleTagInputChange(e, false)}
                                 placeholder="e.g., daily, work, idea"
                                 disabled={isSavingEntry}
                             />
                         </div>
                          <div className="flex items-center gap-2">
                              <input
                                  type="checkbox"
                                  id="newEntryIsStarred"
                                  className="form-checkbox h-4 w-4 text-blue-600 rounded border-neutral-600 bg-neutral-800 focus:ring-blue-500"
                                  checked={newEntryIsStarred}
                                  onChange={(e) => setNewEntryIsStarred(e.target.checked)}
                                  disabled={isSavingEntry}
                              />
                              <label htmlFor="newEntryIsStarred" className="text-neutral-300 text-sm">Star this entry</label>
                          </div>
                     </div>
                     {/* End New */}
                    <div className="flex gap-4">
                        <button
                            type="submit"
                            className="px-6 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isSavingEntry || !newEntryContent.trim()}
                        >
                            {isSavingEntry ? 'Saving...' : 'Save Entry'}
                        </button>
                         <button
                            type="button"
                            onClick={handleCancelCreate}
                            className="px-6 py-2 bg-neutral-600 text-white font-semibold rounded-md hover:bg-neutral-700 transition"
                            disabled={isSavingEntry}
                        >
                            Cancel
                        </button>
                    </div>
               </form>
                 {error && isSavingEntry === false && ( // Show create error only after it finishes
                     <p className="text-red-400 text-sm mt-4">Error: {error}</p>
                 )}
            </div>
        )}

        {/* Form for editing an entry */}
        {editingEntry && ( // Show edit form if editing
             <div className="mb-8 p-4 bg-neutral-700/50 rounded-lg">
                 <h3 className="text-xl font-semibold text-blue-300 mb-3">Edit Journal Entry</h3>
                 <form onSubmit={handleUpdateEntry}>
                     <div className="mb-4">
                        <label htmlFor="editingEntryContent" className="block text-neutral-300 text-sm font-semibold mb-2">Content:</label>
                         <textarea
                            id="editingEntryContent"
                            className="w-full p-2 rounded-md bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={editingEntryContent}
                            onChange={(e) => setEditingEntryContent(e.target.value)}
                            placeholder="Edit journal entry content... (Markdown supported)"
                            rows={8}
                            disabled={isUpdatingEntry}
                            required
                         />
                    </div>
                     {/* New: Tags and Starred Input (Edit) */}
                     <div className="mb-4 p-3 bg-neutral-600/50 rounded-md space-y-2">
                         <h4 className="text-neutral-300 text-sm font-semibold mb-2">Metadata:</h4>
                         <div>
                             <label htmlFor="editingEntryTags" className="block text-neutral-400 text-xs font-semibold mb-1">Tags (comma-separated):</label>
                             <input
                                 id="editingEntryTags"
                                 type="text"
                                 className="w-full p-1 rounded-md bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                                 value={getTagInputString(editingEntryTags)}
                                 onChange={(e) => handleTagInputChange(e, true)}
                                 placeholder="e.g., daily, work, idea"
                                 disabled={isUpdatingEntry}
                             />
                         </div>
                          <div className="flex items-center gap-2">
                              <input
                                  type="checkbox"
                                  id="editingEntryIsStarred"
                                  className="form-checkbox h-4 w-4 text-blue-600 rounded border-neutral-600 bg-neutral-800 focus:ring-blue-500"
                                  checked={editingEntryIsStarred}
                                  onChange={(e) => setEditingEntryIsStarred(e.target.checked)}
                                  disabled={isUpdatingEntry}
                              />
                              <label htmlFor="editingEntryIsStarred" className="text-neutral-300 text-sm">Star this entry</label>
                          </div>
                     </div>
                     {/* End New */}
                    <div className="flex gap-4">
                        <button
                            type="submit"
                            className="px-6 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isUpdatingEntry || !editingEntryContent.trim()}
                        >
                            {isUpdatingEntry ? 'Saving...' : 'Save Changes'}
                        </button>
                         <button
                            type="button"
                            onClick={handleCancelEdit}
                            className="px-6 py-2 bg-neutral-600 text-white font-semibold rounded-md hover:bg-neutral-700 transition"
                            disabled={isUpdatingEntry}
                        >
                            Cancel
                        </button>
                    </div>
               </form>
                 {error && isUpdatingEntry === false && ( // Show update error only after it finishes
                     <p className="text-red-400 text-sm mt-4">Error: {error}</p>
                 )}
            </div>
        )}


        {/* Entries List */}
        <div className="p-4 bg-neutral-700/50 rounded-lg">
            <h3 className="text-xl font-semibold text-blue-300 mb-3">Your Journal Entries ({entries.length})</h3>
            {loading && !isSavingEntry && !isUpdatingEntry ? ( // Show loading only if not currently saving/updating
              <p className="text-neutral-400">Loading journal entries...</p>
            ) : error && !isCreatingEntry && !editingEntry ? ( // Show main error if not in create/edit mode
                 <p className="text-red-400">Error: {error}</p>
            ) : entries.length === 0 ? (
              <p className="text-neutral-400">No journal entries found yet. Add one using the form above.</p>
            ) : (
              <ul className="space-y-4">
                {entries.map((entry) => (
                  <li key={entry.id} className={`bg-neutral-600/50 p-4 rounded-md border-l-4 border-blue-500`}>
                    <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-3">
                            <BookOpen size={20} className="text-blue-400"/>
                            <h4 className="font-semibold text-blue-200">{entry.question}</h4> {/* Display timestamp/question */}
                        </div>
                         {/* New: Star Icon and Expand/Collapse Button */}
                         <div className="flex gap-2 items-center">
                             <button
                                 className="text-neutral-400 hover:text-yellow-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                 onClick={() => handleToggleStar(entry)}
                                 disabled={isSavingEntry || isUpdatingEntry}
                             >
                                 {entry.is_starred ? <Star size={20} className="text-yellow-400 fill-yellow-400"/> : <Star size={20}/>}
                             </button>
                             <button onClick={() => toggleExpandEntry(entry.id)} className="text-neutral-400 hover:text-white transition">
                                {expandedEntries[entry.id] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}\
                             </button>
                         </div>
                         {/* End New */}
                    </div>
                    {/* Content (Collapsible) */}
                    {expandedEntries[entry.id] && ((
                         <div className="mt-2 border-t border-neutral-600 pt-2">
                             <div className="text-neutral-300 text-sm prose prose-invert max-w-none"> {/* Use prose for markdown styling */}
                                 <ReactMarkdown>{entry.answer}</ReactMarkdown>
                             </div>
                         </div>
                    ))}
                    <small className="text-neutral-400 text-xs block mt-2">
                        ID: {entry.id} | Created: {new Date(entry.timestamp).toLocaleString()}
                         {entry.tags && entry.tags.length > 0 && ` | Tags: ${entry.tags.join(', ')}`}
                    </small>

                    {/* Entry Actions */}
                    <div className="mt-3 flex gap-2">
                         {/* Edit Button */}
                         <button
                            className="px-3 py-1 text-xs bg-yellow-600 text-white rounded hover:bg-yellow-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={() => handleEditEntryClick(entry)}
                            disabled={isSavingEntry || isUpdatingEntry}
                         >
                            <Edit size={16} className="inline-block mr-1"/> Edit
                         </button>
                         {/* Delete Button */}
                         <button
                            className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={() => handleDeleteEntry(entry.id)}
                            disabled={isSavingEntry || isUpdatingEntry}
                         >
                            <Trash2 size={16} className="inline-block mr-1"/> Delete
                         </button>
                         {/* TODO: Add Copy button (Part of 權能鍛造: 觀察 - record action) */}
                    </div>
                  </li>
                ))}\
              </ul>
            )}
        </div>

      </div>
    </div>
  );
};

export default Journal;
```