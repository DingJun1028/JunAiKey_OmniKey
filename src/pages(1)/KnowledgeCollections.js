"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
""(templateObject_1 || (templateObject_1 = __makeTemplateObject(["typescript\n// src/pages/KnowledgeCollections.tsx\n// Knowledge Collections Page (Codex Collection)\n// Displays and manages user-defined collections of knowledge records.\n// --- New: Add UI for creating, viewing, editing, and deleting Collections --\n// --- New: Add Realtime Updates for knowledge_collections --\n// --- Modified: Add Link to Collection Detail page --\n\nimport React, { useEffect, useState } from 'react';\nimport { MemoryEngine } from '../core/memory/MemoryEngine'; // To fetch collections\nimport { AuthorityForgingEngine } from '../core/authority/AuthorityForgingEngine'; // Use for action recording\nimport { KnowledgeCollection } from '../interfaces'; // Import KnowledgeCollection type\nimport { BookOpen, ChevronDown, ChevronUp, Trash2, Edit, PlusCircle, Save, Loader2, Info } from 'lucide-react'; // Import icons\nimport { Link } from 'react-router-dom'; // Import Link for navigation\n\n\n// Access core modules from the global window object (for MVP simplicity)\n// In a real app, use React Context or dependency injection\ndeclare const window: any;\nconst memoryEngine: MemoryEngine = window.systemContext?.memoryEngine; // The Memory Engine (\u6C38\u4E45\u8A18\u61B6) pillar\nconst authorityForgingEngine: any = window.systemContext?.authorityForgingEngine; // Use any for action recording (\u6B0A\u80FD\u935B\u9020)\nconst systemContext: any = window.systemContext; // Access the full context for currentUser\n\n\nconst KnowledgeCollections: React.FC = () => {\n  const [collections, setCollections] = useState<KnowledgeCollection[]>([]); // State to hold collections\n  const [loading, setLoading] = useState(true);\n  const [error, setError] = useState<string | null>(null);\n  const [expandedCollections, setExpandedCollections] = useState<Record<string, boolean>>({}); // State to track expanded collections\n\n  // --- State for creating new collection ---\n  const [isCreatingCollection, setIsCreatingCollection] = useState(false);\n  const [newCollectionName, setNewCollectionName] = useState('');\n  const [newCollectionDescription, setNewCollectionDescription] = useState('');\n  const [isSavingCollection, setIsSavingCollection] = useState(false);\n  // --- End New ---\n\n  // TODO: Implement state for editing collection\n  // TODO: Implement state for deleting collection\n\n\n  const fetchCollections = async () => {\n       const userId = systemContext?.currentUser?.id;\n       if (!memoryEngine || !userId) {\n            setError(\"MemoryEngine module not initialized or user not logged in.\");\n            setLoading(false);\n            return;\n        }\n      setLoading(true);\n      setError(null); // Clear main error when fetching\n      try {\n          // Fetch collections for the current user from MemoryEngine (Part of \u6C38\u4E45\u8A18\u61B6 / \u96D9\u5410\u540C\u6B65\u9818\u57DF)\n          const userCollections = await memoryEngine.getCollections(userId); // Pass user ID\n          setCollections(userCollections);\n      } catch (err: any) {\n          console.error('Error fetching collections:', err);\n          setError("], ["typescript\n// src/pages/KnowledgeCollections.tsx\n// Knowledge Collections Page (Codex Collection)\n// Displays and manages user-defined collections of knowledge records.\n// --- New: Add UI for creating, viewing, editing, and deleting Collections --\n// --- New: Add Realtime Updates for knowledge_collections --\n// --- Modified: Add Link to Collection Detail page --\n\nimport React, { useEffect, useState } from 'react';\nimport { MemoryEngine } from '../core/memory/MemoryEngine'; // To fetch collections\nimport { AuthorityForgingEngine } from '../core/authority/AuthorityForgingEngine'; // Use for action recording\nimport { KnowledgeCollection } from '../interfaces'; // Import KnowledgeCollection type\nimport { BookOpen, ChevronDown, ChevronUp, Trash2, Edit, PlusCircle, Save, Loader2, Info } from 'lucide-react'; // Import icons\nimport { Link } from 'react-router-dom'; // Import Link for navigation\n\n\n// Access core modules from the global window object (for MVP simplicity)\n// In a real app, use React Context or dependency injection\ndeclare const window: any;\nconst memoryEngine: MemoryEngine = window.systemContext?.memoryEngine; // The Memory Engine (\\u6c38\\u4e45\\u8a18\\u61b6) pillar\nconst authorityForgingEngine: any = window.systemContext?.authorityForgingEngine; // Use any for action recording (\\u6b0a\\u80fd\\u935b\\u9020)\nconst systemContext: any = window.systemContext; // Access the full context for currentUser\n\n\nconst KnowledgeCollections: React.FC = () => {\n  const [collections, setCollections] = useState<KnowledgeCollection[]>([]); // State to hold collections\n  const [loading, setLoading] = useState(true);\n  const [error, setError] = useState<string | null>(null);\n  const [expandedCollections, setExpandedCollections] = useState<Record<string, boolean>>({}); // State to track expanded collections\n\n  // --- State for creating new collection ---\n  const [isCreatingCollection, setIsCreatingCollection] = useState(false);\n  const [newCollectionName, setNewCollectionName] = useState('');\n  const [newCollectionDescription, setNewCollectionDescription] = useState('');\n  const [isSavingCollection, setIsSavingCollection] = useState(false);\n  // --- End New ---\n\n  // TODO: Implement state for editing collection\n  // TODO: Implement state for deleting collection\n\n\n  const fetchCollections = async () => {\n       const userId = systemContext?.currentUser?.id;\n       if (!memoryEngine || !userId) {\n            setError(\"MemoryEngine module not initialized or user not logged in.\");\n            setLoading(false);\n            return;\n        }\n      setLoading(true);\n      setError(null); // Clear main error when fetching\n      try {\n          // Fetch collections for the current user from MemoryEngine (Part of \\u6c38\\u4e45\\u8a18\\u61b6 / \\u96d9\\u5410\\u540c\\u6b65\\u9818\\u57df)\n          const userCollections = await memoryEngine.getCollections(userId); // Pass user ID\n          setCollections(userCollections);\n      } catch (err: any) {\n          console.error('Error fetching collections:', err);\n          setError("])));
Failed;
to;
load;
collections: $;
{
    err.message;
}
");\n      } finally {\n          setLoading(false);\n      }\n  };\n\n  useEffect(() => {\n    // Fetch data when the component mounts or when the user changes\n    if (systemContext?.currentUser?.id) {\n        fetchCollections(); // Fetch all collections on initial load\n    }\n\n    // --- New: Subscribe to realtime updates for knowledge_collections ---\n    let unsubscribeCollectionInsert: (() => void) | undefined;\n    let unsubscribeCollectionUpdate: (() => void) | undefined;\n    let unsubscribeCollectionDelete: (() => void) | undefined;\n\n\n    if (memoryEngine?.context?.eventBus) { // Check if MemoryEngine and its EventBus are available\n        const eventBus = memoryEngine.context.eventBus;\n        const userId = systemContext?.currentUser?.id;\n\n        // Subscribe to collection insert events\n        unsubscribeCollectionInsert = eventBus.subscribe('knowledge_collection_insert', (payload: KnowledgeCollection) => {\n            if (payload.user_id === userId) {\n                console.log('KnowledgeCollections page received knowledge_collection_insert event:', payload);\n                // Add the new collection and keep sorted by creation timestamp (newest first)\n                setCollections(prevCollections => [...prevCollections, payload].sort((a, b) => new Date(b.creation_timestamp).getTime() - new Date(a.creation_timestamp).getTime()));\n            }\n        });\n\n         unsubscribeCollectionUpdate = eventBus.subscribe('knowledge_collection_update', (payload: KnowledgeCollection) => {\n             if (payload.user_id === userId) {\n                 console.log('KnowledgeCollections page received knowledge_collection_update event:', payload);\n                 // Update the specific collection in the state\n                 setCollections(prevCollections => prevCollections.map(collection => collection.id === payload.id ? payload : collection));\n             }\n         });\n\n          unsubscribeCollectionDelete = eventBus.subscribe('knowledge_collection_delete', (payload: { collectionId: string, userId: string }) => {\n             if (payload.userId === userId) {\n                 console.log('KnowledgeCollections page received knowledge_collection_delete event:', payload);\n                 // Remove the deleted collection from the state\n                 setCollections(prevCollections => prevCollections.filter(collection => collection.id !== payload.collectionId));\n             }\n         });\n    }\n    // --- End New ---\n\n\n    return () => {\n        // Unsubscribe on component unmount\n        unsubscribeCollectionInsert?.();\n        unsubscribeCollectionUpdate?.();\n        unsubscribeCollectionDelete?.();\n    };\n\n  }, [systemContext?.currentUser?.id, memoryEngine]); // Re-run effect when user ID or service changes\n\n\n    const toggleExpandCollection = (collectionId: string) => {\n        setExpandedCollections(prevState => ({\n            ...prevState,\n            [collectionId]: !prevState[collectionId]\n        }));\n    };\n\n    // --- New: Handle Create Collection ---\n    const handleCreateCollection = async (e: React.FormEvent) => {\n        e.preventDefault();\n        const userId = systemContext?.currentUser?.id;\n        if (!memoryEngine || !userId || !newCollectionName.trim()) {\n            alert(\"MemoryEngine module not initialized, user not logged in, or collection name is empty.\");\n            return;\n        }\n\n        setIsSavingCollection(true);\n        setError(null);\n        try {\n            const collectionDetails = {\n                name: newCollectionName,\n                description: newCollectionDescription.trim() || undefined, // Use undefined if empty\n                user_id: userId, // Ensure user_id is included\n            };\n            // Create the collection (Part of \u6C38\u4E45\u8A18\u61B6 / \u96D9\u5410\u540C\u6B65\u9818\u57DF)\n            const createdCollection = await memoryEngine.createCollection(newCollectionName, userId, newCollectionDescription); // Pass name, userId, description\n\n            if (createdCollection) {\n                alert(";
Collection;
"${createdCollection.name}\\\" created successfully!`);;
console.log('Created new collection:', createdCollection);
// Reset form
setNewCollectionName('');
setNewCollectionDescription('');
setIsCreatingCollection(false); // Hide form
// State update handled by realtime listener
// Simulate recording user action (Part of \u6b0a\u80fd\u935b\u9020 / \u516d\u5f0f\u5967\u7fa9: \u89c0\u5bdf)
authorityForgingEngine === null || authorityForgingEngine === void 0 ? void 0 : authorityForgingEngine.recordAction({
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
    setError("Failed to create collection: ".concat(err.message));
}
finally {
    setIsSavingCollection(false);
}
;
var handleCancelCreate = function () {
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
if (!(systemContext === null || systemContext === void 0 ? void 0 : systemContext.currentUser)) {
    // This case should ideally be handled by ProtectedRoute, but as a fallback:
    return (<div className="container mx-auto p-4 flex justify-center">
               <div className="bg-neutral-800/50 p-8 rounded-lg shadow-xl w-full max-w-md text-center text-neutral-300">
                   <p>Please log in to view your knowledge collections.</p>
               </div>
            </div>);
}
return (<div className="container mx-auto p-4">
      <div className="bg-neutral-800/50 p-6 rounded-lg shadow-xl">
        <h2 className="text-3xl font-bold text-blue-400 mb-6">Knowledge Collections (\u5178\u85cf\u8056\u5178)</h2>
        <p className="text-neutral-300 mb-8">Organize your knowledge records into custom collections.</p>

        {/* Form for creating new collections */}
        {!isCreatingCollection && (<div className="mb-8 p-4 bg-neutral-700/50 rounded-lg">
                 <h3 className="text-xl font-semibold text-blue-300 mb-3">Create New Collection</h3>
                 <button className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition disabled:opacity-50" onClick={function () { setIsCreatingCollection(true); setError(null); }} disabled={isSavingCollection}>
                     <PlusCircle size={20} className="inline-block mr-2"/> Create Collection
                 </button>
            </div>)}

        {isCreatingCollection && (<div className="mb-8 p-4 bg-neutral-700/50 rounded-lg">
                 <h3 className="text-xl font-semibold text-blue-300 mb-3">New Collection</h3>
                 <form onSubmit={handleCreateCollection}>
                    <div className="mb-4">
                        <label htmlFor="newCollectionName" className="block text-neutral-300 text-sm font-semibold mb-2">Name:</label>
                        <input id="newCollectionName" type="text" className="w-full p-2 rounded-md bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500" value={newCollectionName} onChange={function (e) { return setNewCollectionName(e.target.value); }} placeholder="Enter collection name" disabled={isSavingCollection} required/>
                    </div>
                     <div className="mb-4">
                        <label htmlFor="newCollectionDescription" className="block text-neutral-300 text-sm font-semibold mb-2">Description (Optional):</label>
                         <textarea id="newCollectionDescription" className="w-full p-2 rounded-md bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500" value={newCollectionDescription} onChange={function (e) { return setNewCollectionDescription(e.target.value); }} placeholder="Enter description" rows={3} disabled={isSavingCollection}/>
                    </div>
                    <div className="flex gap-4">
                        <button type="submit" className="px-6 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed" disabled={isSavingCollection || !newCollectionName.trim()}>
                            {isSavingCollection ? 'Creating...' : 'Save Collection'}
                        </button>
                         <button type="button" onClick={handleCancelCreate} className="px-6 py-2 bg-neutral-600 text-white font-semibold rounded-md hover:bg-neutral-700 transition" disabled={isSavingCollection}>
                            Cancel
                        </button>
                    </div>
               </form>
                 {error && isSavingCollection === false && ( // Show create error only after it finishes
        <p className="text-red-400 text-sm mt-4">Error: {error}</p>)}
            </div>)}


        {/* Collections List */}
        <div className="p-4 bg-neutral-700/50 rounded-lg">
            <h3 className="text-xl font-semibold text-blue-300 mb-3">Your Collections</h3>
            {loading ? (<p className="text-neutral-400">Loading collections...</p>) : error && !isCreatingCollection ? ( // Only show main error if not in create mode
    <p className="text-red-400">Error: {error}</p>) : collections.length === 0 ? (<p className="text-neutral-400">No collections found yet. Create one using the form above.</p>) : (<ul className="space-y-4">
                {collections.map(function (collection) { return (<li key={collection.id} className={"bg-neutral-600/50 p-4 rounded-md border-l-4 border-blue-500"}>
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <BookOpen size={20} className="text-blue-400"/>
                            <h4 className="font-semibold text-blue-200 mb-1">{collection.name}</h4>
                        </div>
                         <button onClick={function () { return toggleExpandCollection(collection.id); }} className="text-neutral-400 hover:text-white transition">
                            {expandedCollections[collection.id] ? <ChevronUp size={20}/> : <ChevronDown size={20}/>}
                         </button>
                    </div>
                    <p className="text-neutral-300 text-sm">{collection.description || 'No description.'}</p>
                    <small className="text-neutral-400 text-xs block mt-1">
                        ID: {collection.id}
                         {collection.user_id && " | Owner: ".concat(collection.user_id)}
                         {collection.creation_timestamp && " | Created: ".concat(new Date(collection.creation_timestamp).toLocaleString())}
                         {collection.last_updated_timestamp && " | Last Updated: ".concat(new Date(collection.last_updated_timestamp).toLocaleString())}
                    </small>

                    {/* Collection Details (Collapsible) */}
                    {expandedCollections[collection.id] && ((<div className="mt-4 border-t border-neutral-600 pt-4">
                            {/* TODO: Display records within the collection */}
                            <h5 className="text-neutral-300 text-sm font-semibold mb-2">Records in Collection (TODO):</h5>
                            <p className="text-neutral-400 text-xs">Fetching records in collection is not yet implemented.</p>

                            {/* TODO: Add buttons to add/remove records */}

                        </div>))}

                    {/* Collection Actions */}
                    <div className="mt-4 flex flex-wrap gap-2"> {/* Use flex-wrap for smaller screens */}
                         {/* New: Add View Collection Button (Link to a dedicated collection view page) */}
                         <Link to={"/collections/".concat(collection.id)} className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition">
                             View Collection
                         </Link>
                         {/* End New */}
                         {/* TODO: Add buttons for Edit Collection, Delete Collection */}
                         {/* Example: Edit Button */}
                         {/* {collection.user_id === systemContext?.currentUser?.id && ( // Only show for user's own collections */}
                         {/*     <button className="px-3 py-1 text-sm bg-yellow-600 text-white rounded hover:bg-yellow-700 transition disabled:opacity-50 disabled:cursor-not-allowed" disabled>Edit (TODO)</button> */}
                         {/* )} */}
                         {/* Example: Delete Button */}
                         {/* {collection.user_id === systemContext?.currentUser?.id && ( // Only show for user's own collections */}
                         {/*     <button className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed" disabled>Delete (TODO)</button> */}
                         {/* )} */}
                    </div>
                  </li>); })}
              </ul>)}
        </div>

      </div>
    </div>);
;
exports.default = KnowledgeCollections;
""(templateObject_2 || (templateObject_2 = __makeTemplateObject([""], [""])));
var templateObject_1, templateObject_2;
