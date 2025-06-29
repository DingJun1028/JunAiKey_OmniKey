import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
`` `typescript
// src/pages/KnowledgeCollections.tsx
// Knowledge Collections Page (Codex Collection)
// Displays and manages user-defined collections of knowledge records.
// --- New: Add UI for creating, viewing, editing, and deleting Collections --
// --- New: Add Realtime Updates for knowledge_collections --
// --- Modified: Add Link to Collection Detail page --

import React, { useEffect, useState } from 'react';
import { MemoryEngine } from '../core/memory/MemoryEngine'; // To fetch collections
import { AuthorityForgingEngine } from '../core/authority/AuthorityForgingEngine'; // Use for action recording
import { KnowledgeCollection } from '../interfaces'; // Import KnowledgeCollection type
import { BookOpen, ChevronDown, ChevronUp, Trash2, Edit, PlusCircle, Save, Loader2, Info } from 'lucide-react'; // Import icons
import { Link } from 'react-router-dom'; // Import Link for navigation


// Access core modules from the global window object (for MVP simplicity)
// In a real app, use React Context or dependency injection
declare const window: any;
const memoryEngine: MemoryEngine = window.systemContext?.memoryEngine; // The Memory Engine (\u6c38\u4e45\u8a18\u61b6) pillar
const authorityForgingEngine: any = window.systemContext?.authorityForgingEngine; // Use any for action recording (\u6b0a\u80fd\u935b\u9020)
const systemContext: any = window.systemContext; // Access the full context for currentUser


const KnowledgeCollections: React.FC = () => {
  const [collections, setCollections] = useState<KnowledgeCollection[]>([]); // State to hold collections
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedCollections, setExpandedCollections] = useState<Record<string, boolean>>({}); // State to track expanded collections

  // --- State for creating new collection ---
  const [isCreatingCollection, setIsCreatingCollection] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [newCollectionDescription, setNewCollectionDescription] = useState('');
  const [isSavingCollection, setIsSavingCollection] = useState(false);
  // --- End New ---

  // TODO: Implement state for editing collection
  // TODO: Implement state for deleting collection


  const fetchCollections = async () => {
       const userId = systemContext?.currentUser?.id;
       if (!memoryEngine || !userId) {
            setError("MemoryEngine module not initialized or user not logged in.");
            setLoading(false);
            return;
        }
      setLoading(true);
      setError(null); // Clear main error when fetching
      try {
          // Fetch collections for the current user from MemoryEngine (Part of \u6c38\u4e45\u8a18\u61b6 / \u96d9\u5410\u540c\u6b65\u9818\u57df)
          const userCollections = await memoryEngine.getCollections(userId); // Pass user ID
          setCollections(userCollections);
      } catch (err: any) {
          console.error('Error fetching collections:', err);
          setError(`;
Failed;
to;
load;
collections: $;
{
    err.message;
}
`);
      } finally {
          setLoading(false);
      }
  };

  useEffect(() => {
    // Fetch data when the component mounts or when the user changes
    if (systemContext?.currentUser?.id) {
        fetchCollections(); // Fetch all collections on initial load
    }

    // --- New: Subscribe to realtime updates for knowledge_collections ---
    let unsubscribeCollectionInsert: (() => void) | undefined;
    let unsubscribeCollectionUpdate: (() => void) | undefined;
    let unsubscribeCollectionDelete: (() => void) | undefined;


    if (memoryEngine?.context?.eventBus) { // Check if MemoryEngine and its EventBus are available
        const eventBus = memoryEngine.context.eventBus;
        const userId = systemContext?.currentUser?.id;

        // Subscribe to collection insert events
        unsubscribeCollectionInsert = eventBus.subscribe('knowledge_collection_insert', (payload: KnowledgeCollection) => {
            if (payload.user_id === userId) {
                console.log('KnowledgeCollections page received knowledge_collection_insert event:', payload);
                // Add the new collection and keep sorted by creation timestamp (newest first)
                setCollections(prevCollections => [...prevCollections, payload].sort((a, b) => new Date(b.creation_timestamp).getTime() - new Date(a.creation_timestamp).getTime()));
            }
        });

         unsubscribeCollectionUpdate = eventBus.subscribe('knowledge_collection_update', (payload: KnowledgeCollection) => {
             if (payload.user_id === userId) {
                 console.log('KnowledgeCollections page received knowledge_collection_update event:', payload);
                 // Update the specific collection in the state
                 setCollections(prevCollections => prevCollections.map(collection => collection.id === payload.id ? payload : collection));
             }
         });

          unsubscribeCollectionDelete = eventBus.subscribe('knowledge_collection_delete', (payload: { collectionId: string, userId: string }) => {
             if (payload.userId === userId) {
                 console.log('KnowledgeCollections page received knowledge_collection_delete event:', payload);
                 // Remove the deleted collection from the state
                 setCollections(prevCollections => prevCollections.filter(collection => collection.id !== payload.collectionId));
             }
         });
    }
    // --- End New ---


    return () => {
        // Unsubscribe on component unmount
        unsubscribeCollectionInsert?.();
        unsubscribeCollectionUpdate?.();
        unsubscribeCollectionDelete?.();
    };

  }, [systemContext?.currentUser?.id, memoryEngine]); // Re-run effect when user ID or service changes


    const toggleExpandCollection = (collectionId: string) => {
        setExpandedCollections(prevState => ({
            ...prevState,
            [collectionId]: !prevState[collectionId]
        }));
    };

    // --- New: Handle Create Collection ---
    const handleCreateCollection = async (e: React.FormEvent) => {
        e.preventDefault();
        const userId = systemContext?.currentUser?.id;
        if (!memoryEngine || !userId || !newCollectionName.trim()) {
            alert(\"MemoryEngine module not initialized, user not logged in, or collection name is empty.\");
            return;
        }

        setIsSavingCollection(true);
        setError(null);
        try {
            const collectionDetails = {
                name: newCollectionName,
                description: newCollectionDescription.trim() || undefined, // Use undefined if empty
                user_id: userId, // Ensure user_id is included
            };
            // Create the collection (Part of \u6c38\u4e45\u8a18\u61b6 / \u96d9\u5410\u540c\u6b65\u9818\u57df)
            const createdCollection = await memoryEngine.createCollection(newCollectionName, userId, newCollectionDescription); // Pass name, userId, description

            if (createdCollection) {
                alert(`;
Collection;
"${createdCollection.name}\\\" created successfully!`);;
console.log('Created new collection:', createdCollection);
// Reset form
setNewCollectionName('');
setNewCollectionDescription('');
setIsCreatingCollection(false); // Hide form
// State update handled by realtime listener
// Simulate recording user action (Part of \u6b0a\u80fd\u935b\u9020 / \u516d\u5f0f\u5967\u7fa9: \u89c0\u5bdf)
authorityForgingEngine?.recordAction({
    type: 'web:collections:create',
    details: { collectionId: createdCollection.id, name: createdCollection.name },
    context: { platform: 'web', page: 'collections' },
    user_id: userId, // Associate action with user
});
{
    setError('Failed to create collection.');
}
try { }
catch (err) {
    console.error('Error creating collection:', err);
    setError(`Failed to create collection: ${err.message}`);
}
finally {
    setIsSavingCollection(false);
}
;
const handleCancelCreate = () => {
    setIsCreatingCollection(false);
    setNewCollectionName('');
    setNewCollectionDescription('');
    setError(null); // Clear error when cancelling
};
// --- End New ---
// TODO: Implement Edit Collection (requires updateCollection method in MemoryEngine)
// TODO: Implement Delete Collection (requires deleteCollection method in MemoryEngine)
// TODO: Implement Add/Remove Records from Collection (requires addRecordToCollection/removeRecordFromCollection methods in MemoryEngine)
// Ensure user is logged in before rendering content
if (!systemContext?.currentUser) {
    // This case should ideally be handled by ProtectedRoute, but as a fallback:
    return (_jsx("div", { className: "container mx-auto p-4 flex justify-center", children: _jsx("div", { className: "bg-neutral-800/50 p-8 rounded-lg shadow-xl w-full max-w-md text-center text-neutral-300", children: _jsx("p", { children: "Please log in to view your knowledge collections." }) }) }));
}
return (_jsx("div", { className: "container mx-auto p-4", children: _jsxs("div", { className: "bg-neutral-800/50 p-6 rounded-lg shadow-xl", children: [_jsx("h2", { className: "text-3xl font-bold text-blue-400 mb-6", children: "Knowledge Collections (\\u5178\\u85cf\\u8056\\u5178)" }), _jsx("p", { className: "text-neutral-300 mb-8", children: "Organize your knowledge records into custom collections." }), !isCreatingCollection && (_jsxs("div", { className: "mb-8 p-4 bg-neutral-700/50 rounded-lg", children: [_jsx("h3", { className: "text-xl font-semibold text-blue-300 mb-3", children: "Create New Collection" }), _jsxs("button", { className: "px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition disabled:opacity-50", onClick: () => { setIsCreatingCollection(true); setError(null); }, disabled: isSavingCollection, children: [_jsx(PlusCircle, { size: 20, className: "inline-block mr-2" }), " Create Collection"] })] })), isCreatingCollection && (_jsxs("div", { className: "mb-8 p-4 bg-neutral-700/50 rounded-lg", children: [_jsx("h3", { className: "text-xl font-semibold text-blue-300 mb-3", children: "New Collection" }), _jsxs("form", { onSubmit: handleCreateCollection, children: [_jsxs("div", { className: "mb-4", children: [_jsx("label", { htmlFor: "newCollectionName", className: "block text-neutral-300 text-sm font-semibold mb-2", children: "Name:" }), _jsx("input", { id: "newCollectionName", type: "text", className: "w-full p-2 rounded-md bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500", value: newCollectionName, onChange: (e) => setNewCollectionName(e.target.value), placeholder: "Enter collection name", disabled: isSavingCollection, required: true })] }), _jsxs("div", { className: "mb-4", children: [_jsx("label", { htmlFor: "newCollectionDescription", className: "block text-neutral-300 text-sm font-semibold mb-2", children: "Description (Optional):" }), _jsx("textarea", { id: "newCollectionDescription", className: "w-full p-2 rounded-md bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500", value: newCollectionDescription, onChange: (e) => setNewCollectionDescription(e.target.value), placeholder: "Enter description", rows: 3, disabled: isSavingCollection })] }), _jsxs("div", { className: "flex gap-4", children: [_jsx("button", { type: "submit", className: "px-6 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed", disabled: isSavingCollection || !newCollectionName.trim(), children: isSavingCollection ? 'Creating...' : 'Save Collection' }), _jsx("button", { type: "button", onClick: handleCancelCreate, className: "px-6 py-2 bg-neutral-600 text-white font-semibold rounded-md hover:bg-neutral-700 transition", disabled: isSavingCollection, children: "Cancel" })] })] }), error && isSavingCollection === false && ( // Show create error only after it finishes
                    _jsxs("p", { className: "text-red-400 text-sm mt-4", children: ["Error: ", error] }))] })), _jsxs("div", { className: "p-4 bg-neutral-700/50 rounded-lg", children: [_jsx("h3", { className: "text-xl font-semibold text-blue-300 mb-3", children: "Your Collections" }), loading ? (_jsx("p", { className: "text-neutral-400", children: "Loading collections..." })) : error && !isCreatingCollection ? ( // Only show main error if not in create mode
                    _jsxs("p", { className: "text-red-400", children: ["Error: ", error] })) : collections.length === 0 ? (_jsx("p", { className: "text-neutral-400", children: "No collections found yet. Create one using the form above." })) : (_jsx("ul", { className: "space-y-4", children: collections.map((collection) => (_jsxs("li", { className: `bg-neutral-600/50 p-4 rounded-md border-l-4 border-blue-500`, children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx(BookOpen, { size: 20, className: "text-blue-400" }), _jsx("h4", { className: "font-semibold text-blue-200 mb-1", children: collection.name })] }), _jsx("button", { onClick: () => toggleExpandCollection(collection.id), className: "text-neutral-400 hover:text-white transition", children: expandedCollections[collection.id] ? _jsx(ChevronUp, { size: 20 }) : _jsx(ChevronDown, { size: 20 }) })] }), _jsx("p", { className: "text-neutral-300 text-sm", children: collection.description || 'No description.' }), _jsxs("small", { className: "text-neutral-400 text-xs block mt-1", children: ["ID: ", collection.id, collection.user_id && ` | Owner: ${collection.user_id}`, collection.creation_timestamp && ` | Created: ${new Date(collection.creation_timestamp).toLocaleString()}`, collection.last_updated_timestamp && ` | Last Updated: ${new Date(collection.last_updated_timestamp).toLocaleString()}`] }), expandedCollections[collection.id] && ((_jsxs("div", { className: "mt-4 border-t border-neutral-600 pt-4", children: [_jsx("h5", { className: "text-neutral-300 text-sm font-semibold mb-2", children: "Records in Collection (TODO):" }), _jsx("p", { className: "text-neutral-400 text-xs", children: "Fetching records in collection is not yet implemented." })] }))), _jsxs("div", { className: "mt-4 flex flex-wrap gap-2", children: [" ", _jsx(Link, { to: `/collections/${collection.id}`, className: "px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition", children: "View Collection" })] })] }, collection.id))) }))] })] }) }));
;
export default KnowledgeCollections;
`` `;
