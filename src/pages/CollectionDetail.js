var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
""(__makeTemplateObject(["typescript\n// src/pages/CollectionDetail.tsx\n// Knowledge Collection Detail Page (\u5178\u85CF\u8056\u5178\u8A73\u60C5)\n// Displays the details of a single knowledge collection and the records it contains.\n// --- New: Create a page to display collection details and records --\n// --- New: Implement fetching collection data by ID --\n// --- New: Implement fetching and displaying records in the collection --\n// --- New: Add UI for removing records from the collection --\n// --- New: Add UI for adding records to the collection (via modal) --\n// --- New: Display records in the collection with expandable content --\n// --- New: Add Realtime Updates for knowledge_collections and knowledge_collection_records --\n// --- Modified: Implement Add/Remove Records functionality --\n\nimport React, { useEffect, useState, useCallback } from 'react'; // Import useCallback\nimport { useParams } from 'react-router-dom'; // To get the collection ID from the URL\nimport { MemoryEngine } from '../core/memory/MemoryEngine'; // To fetch collection and records\nimport { AuthorityForgingEngine } from '../core/authority/AuthorityForgingEngine'; // Use for action recording\nimport { KnowledgeCollection, KnowledgeRecord } from '../interfaces'; // Import types\nimport { BookOpen, ChevronDown, ChevronUp, Trash2, Edit, PlusCircle, Save, Loader2, Info, ArrowLeft, XCircle, MinusCircle } from 'lucide-react'; // Import icons including MinusCircle\nimport ReactMarkdown from 'react-markdown'; // For rendering markdown\nimport { Link } from 'react-router-dom'; // Import Link for navigation back\n\n\n// Access core modules from the global window object (for MVP simplicity)\n// In a real app, use React Context or dependency injection\ndeclare const window: any;\nconst memoryEngine: MemoryEngine = window.systemContext?.memoryEngine; // The Memory Engine (\u6C38\u4E45\u8A18\u61B6) pillar\nconst authorityForgingEngine: any = window.systemContext?.authorityForgingEngine; // Use any for action recording (\u6B0A\u80FD\u935B\u9020)\nconst systemContext: any = window.systemContext; // Access the full context for currentUser\n\n\nconst CollectionDetail: React.FC = () => {\n  const { collectionId } = useParams<{ collectionId: string }>(); // Get collectionId from URL params\n  const [collection, setCollection] = useState<KnowledgeCollection | null>(null); // State for the collection details\n  const [records, setRecords] = useState<KnowledgeRecord[]>([]); // State for records in the collection\n  const [loading, setLoading] = useState(true);\n  const [error, setError] = useState<string | null>(null);\n  const [expandedRecords, setExpandedRecords] = useState<Record<string, boolean>>({}); // State to track expanded records\n\n  // --- State for adding records ---\n  const [showAddRecordModal, setShowAddRecordModal] = useState(false);\n  const [availableRecordsToAdd, setAvailableRecordsToAdd] = useState<KnowledgeRecord[]>([]); // Records not currently in this collection\n  const [loadingAvailableRecords, setLoadingAvailableRecords] = useState(false);\n  const [selectedRecordsToAdd, setSelectedRecordsToAdd] = useState<string[]>([]); // IDs of records selected in the modal\n  const [isAddingRecords, setIsAddingRecords] = useState(false);\n  const [addRecordError, setAddRecordError] = useState<string | null>(null);\n  // --- End State for adding records ---\n\n  // --- State for removing records ---\n  const [isRemovingRecord, setIsRemovingRecord] = useState<string | null>(null); // Track which record is being removed\n  // --- End State for removing records ---\n\n  // TODO: Implement state for editing collection details\n  // TODO: Implement state for deleting collection\n\n\n  const fetchCollectionData = useCallback(async () => {\n       const userId = systemContext?.currentUser?.id;\n       if (!memoryEngine || !userId || !collectionId) {\n            setError(\"MemoryEngine module not initialized or user not logged in, or collection ID is missing.\");\n            setLoading(false);\n            return;\n        }\n      setLoading(true);\n      setError(null); // Clear main error when fetching\n      try {\n          // Fetch the specific collection details\n          const fetchedCollection = await memoryEngine.getCollectionById(collectionId, userId); // Pass collectionId and userId\n\n          if (fetchedCollection) {\n              setCollection(fetchedCollection);\n              // Fetch records within this collection\n              const recordsInCollection = await memoryEngine.getRecordsInCollection(collectionId, userId); // Pass collectionId and userId\n              setRecords(recordsInCollection);\n          } else {\n              // If collection not found, set records to empty\n              setCollection(null);\n              setRecords([]);\n          }\n\n      } catch (err: any) {\n          console.error("], ["typescript\n// src/pages/CollectionDetail.tsx\n// Knowledge Collection Detail Page (\\u5178\\u85cf\\u8056\\u5178\\u8a73\\u60c5)\n// Displays the details of a single knowledge collection and the records it contains.\n// --- New: Create a page to display collection details and records --\n// --- New: Implement fetching collection data by ID --\n// --- New: Implement fetching and displaying records in the collection --\n// --- New: Add UI for removing records from the collection --\n// --- New: Add UI for adding records to the collection (via modal) --\n// --- New: Display records in the collection with expandable content --\n// --- New: Add Realtime Updates for knowledge_collections and knowledge_collection_records --\n// --- Modified: Implement Add/Remove Records functionality --\n\nimport React, { useEffect, useState, useCallback } from 'react'; // Import useCallback\nimport { useParams } from 'react-router-dom'; // To get the collection ID from the URL\nimport { MemoryEngine } from '../core/memory/MemoryEngine'; // To fetch collection and records\nimport { AuthorityForgingEngine } from '../core/authority/AuthorityForgingEngine'; // Use for action recording\nimport { KnowledgeCollection, KnowledgeRecord } from '../interfaces'; // Import types\nimport { BookOpen, ChevronDown, ChevronUp, Trash2, Edit, PlusCircle, Save, Loader2, Info, ArrowLeft, XCircle, MinusCircle } from 'lucide-react'; // Import icons including MinusCircle\nimport ReactMarkdown from 'react-markdown'; // For rendering markdown\nimport { Link } from 'react-router-dom'; // Import Link for navigation back\n\n\n// Access core modules from the global window object (for MVP simplicity)\n// In a real app, use React Context or dependency injection\ndeclare const window: any;\nconst memoryEngine: MemoryEngine = window.systemContext?.memoryEngine; // The Memory Engine (\\u6c38\\u4e45\\u8a18\\u61b6) pillar\nconst authorityForgingEngine: any = window.systemContext?.authorityForgingEngine; // Use any for action recording (\\u6b0a\\u80fd\\u935b\\u9020)\nconst systemContext: any = window.systemContext; // Access the full context for currentUser\n\n\nconst CollectionDetail: React.FC = () => {\n  const { collectionId } = useParams<{ collectionId: string }>(); // Get collectionId from URL params\n  const [collection, setCollection] = useState<KnowledgeCollection | null>(null); // State for the collection details\n  const [records, setRecords] = useState<KnowledgeRecord[]>([]); // State for records in the collection\n  const [loading, setLoading] = useState(true);\n  const [error, setError] = useState<string | null>(null);\n  const [expandedRecords, setExpandedRecords] = useState<Record<string, boolean>>({}); // State to track expanded records\n\n  // --- State for adding records ---\n  const [showAddRecordModal, setShowAddRecordModal] = useState(false);\n  const [availableRecordsToAdd, setAvailableRecordsToAdd] = useState<KnowledgeRecord[]>([]); // Records not currently in this collection\n  const [loadingAvailableRecords, setLoadingAvailableRecords] = useState(false);\n  const [selectedRecordsToAdd, setSelectedRecordsToAdd] = useState<string[]>([]); // IDs of records selected in the modal\n  const [isAddingRecords, setIsAddingRecords] = useState(false);\n  const [addRecordError, setAddRecordError] = useState<string | null>(null);\n  // --- End State for adding records ---\n\n  // --- State for removing records ---\n  const [isRemovingRecord, setIsRemovingRecord] = useState<string | null>(null); // Track which record is being removed\n  // --- End State for removing records ---\n\n  // TODO: Implement state for editing collection details\n  // TODO: Implement state for deleting collection\n\n\n  const fetchCollectionData = useCallback(async () => {\n       const userId = systemContext?.currentUser?.id;\n       if (!memoryEngine || !userId || !collectionId) {\n            setError(\"MemoryEngine module not initialized or user not logged in, or collection ID is missing.\");\n            setLoading(false);\n            return;\n        }\n      setLoading(true);\n      setError(null); // Clear main error when fetching\n      try {\n          // Fetch the specific collection details\n          const fetchedCollection = await memoryEngine.getCollectionById(collectionId, userId); // Pass collectionId and userId\n\n          if (fetchedCollection) {\n              setCollection(fetchedCollection);\n              // Fetch records within this collection\n              const recordsInCollection = await memoryEngine.getRecordsInCollection(collectionId, userId); // Pass collectionId and userId\n              setRecords(recordsInCollection);\n          } else {\n              // If collection not found, set records to empty\n              setCollection(null);\n              setRecords([]);\n          }\n\n      } catch (err: any) {\n          console.error("]));
Error;
fetching;
data;
for (collection; $; { collectionId: collectionId })
    : ", err);\n          setError(";
Failed;
to;
load;
collection;
data: $;
{
    err.message;
}
");\n          setCollection(null);\n          setRecords([]);\n      } finally {\n          setLoading(false);\n      }\n  }, [memoryEngine, systemContext?.currentUser?.id, collectionId, setCollection, setRecords, setLoading, setError]); // Dependencies for useCallback\n\n\n    // --- New: Fetch records available to add to this collection ---\n    const fetchAvailableRecordsToAdd = async () => {\n        const userId = systemContext?.currentUser?.id;\n        if (!memoryEngine || !userId || !collectionId) {\n            setAddRecordError(\"MemoryEngine module not initialized or user not logged in.\");\n            setLoadingAvailableRecords(false);\n            return;\n        }\n        setLoadingAvailableRecords(true);\n        setAddRecordError(null);\n        try {\n            // Fetch all knowledge records for the user\n            const allRecords = await memoryEngine.getAllKnowledgeForUser(userId);\n\n            // Filter out records that are already in this collection\n            const recordsInCurrentCollectionIds = new Set(records.map(record => record.id));\n            const available = allRecords.filter(record => !recordsInCurrentCollectionIds.has(record.id));\n\n            setAvailableRecordsToAdd(available);\n\n        } catch (err: any) {\n            console.error('Error fetching available records:', err);\n            setAddRecordError(";
Failed;
to;
load;
available;
records: $;
{
    err.message;
}
");\n            setAvailableRecordsToAdd([]);\n        } finally {\n            setLoadingAvailableRecords(false);\n        }\n    };\n    // --- End New ---\n\n\n  useEffect(() => {\n    // Fetch data when the component mounts or when the user changes or collectionId changes\n    if (systemContext?.currentUser?.id && collectionId) {\n        fetchCollectionData(); // Fetch data for the specific collection\n    }\n\n    // --- New: Subscribe to realtime updates for knowledge_collection_records ---\n    // Note: knowledge_collection_records updates are subscribed by MemoryEngine and published via EventBus.\n    // We need to listen to those events here to update the records list in the UI.\n    let unsubscribeCollectionRecordInsert: (() => void) | undefined;\n    let unsubscribeCollectionRecordDelete: (() => void) | undefined;\n    // Note: Updates to the KnowledgeRecord itself (question, answer, etc.) are handled by the KnowledgeBase page's subscription.\n    // If you display full record details here, you might need to subscribe to 'knowledge_record_update' as well.\n\n    if (memoryEngine?.context?.eventBus) { // Check if MemoryEngine and its EventBus are available\n        const eventBus = memoryEngine.context.eventBus;\n        const userId = systemContext?.currentUser?.id;\n\n        // Subscribe to collection record insert events\n        unsubscribeCollectionRecordInsert = eventBus.subscribe('knowledge_collection_record_insert', (payload: { collection_id: string, record_id: string, added_timestamp: string, userId: string }) => {\n            // Check if the event is for the current collection and user\n            if (payload.collection_id === collectionId && payload.userId === userId) {\n                console.log('CollectionDetail page received knowledge_collection_record_insert event:', payload);\n                // Refetch the collection data to update the records list\n                fetchCollectionData();\n            }\n        });\n\n         // Subscribe to collection record delete events\n         unsubscribeCollectionRecordDelete = eventBus.subscribe('knowledge_collection_record_delete', (payload: { collectionId: string, recordId: string, userId: string }) => {\n             // Check if the event is for the current collection and user\n             if (payload.collectionId === collectionId && payload.userId === userId) {\n                 console.log('CollectionDetail page received knowledge_collection_record_delete event:', payload);\n                 // Refetch the collection data to update the records list\n                 fetchCollectionData();\n             }\n         });\n\n        // TODO: Subscribe to knowledge_record_update events if you display full record details in the list\n        // eventBus.subscribe('knowledge_record_update', (payload: KnowledgeRecord) => { ... update specific record in 'records' state ... });\n    }\n    // --- End New ---\n\n\n    return () => {\n        // Unsubscribe on component unmount\n        unsubscribeCollectionRecordInsert?.();\n        unsubscribeCollectionRecordDelete?.();\n    };\n\n  }, [collectionId, systemContext?.currentUser?.id, memoryEngine, fetchCollectionData]); // Re-run effect when collectionId, user ID, service, fetch function changes\n\n\n    const toggleExpandRecord = (recordId: string) => {\n        setExpandedRecords(prevState => ({\n            ...prevState,\n            [recordId]: !prevState[recordId]\n        }));\n    };\n\n    // --- New: Handle Remove Record from Collection ---\n    const handleRemoveRecord = async (recordId: string) => {\n        const userId = systemContext?.currentUser?.id;\n        if (!memoryEngine || !userId || !collectionId) {\n            alert(\"MemoryEngine module not initialized, user not logged in, or collection ID is missing.\");\n            return;\n        }\n        if (!confirm(";
Are;
you;
sure;
you;
want;
to;
remove;
this;
record;
from;
the;
collection ? ")) return;\n\n        console.log(" : ;
Attempting;
to;
remove;
record;
$;
{
    recordId;
}
from;
collection;
$;
{
    collectionId;
}
");\n         // Simulate recording user action\n        authorityForgingEngine?.recordAction({\n            type: 'web:collections:remove_record',\n            details: { collectionId, recordId },\n            context: { platform: 'web', page: 'collection_detail' },\n            user_id: userId, // Associate action with user\n        });\n\n        setIsRemovingRecord(recordId); // Indicate this record is being removed\n        setError(null); // Clear previous errors\n        try {\n            // Call the MemoryEngine method to remove the record from the collection\n            const success = await memoryEngine.removeRecordFromCollection(collectionId, recordId, userId); // Pass collectionId, recordId, userId\n\n            if (success) {\n                console.log(";
Record;
$;
{
    recordId;
}
removed;
from;
collection;
$;
{
    collectionId;
}
");\n                // The subscribeToCollectionRecordDelete listener will update the state automatically\n                 alert('Record removed from collection successfully!');\n            } else {\n                setError('Failed to remove record from collection.');\n                alert('Failed to remove record from collection.');\n            }\n\n        } catch (err: any) {\n            console.error(";
Error;
removing;
record;
$;
{
    recordId;
}
from;
collection;
$;
{
    collectionId;
}
", err);\n            setError(";
Failed;
to;
remove;
record: $;
{
    err.message;
}
");\n            alert(";
Failed;
to;
remove;
record: $;
{
    err.message;
}
");\n        } finally {\n            setIsRemovingRecord(null); // Reset removing state\n        }\n    };\n    // --- End New ---\n\n    // --- New: Handle Add Records to Collection ---\n    const handleOpenAddRecordModal = () => {\n        setShowAddRecordModal(true);\n        setSelectedRecordsToAdd([]); // Clear previous selections\n        fetchAvailableRecordsToAdd(); // Fetch records that can be added\n    };\n\n    const handleCloseAddRecordModal = () => {\n        setShowAddRecordModal(false);\n        setAvailableRecordsToAdd([]);\n        setSelectedRecordsToAdd([]);\n        setAddRecordError(null); // Clear error\n    };\n\n    const handleSelectRecordToAdd = (recordId: string) => {\n        setSelectedRecordsToAdd(prevSelected =>\n            prevSelected.includes(recordId)\n                ? prevSelected.filter(id => id !== recordId)\n                : [...prevSelected, recordId]\n        );\n    };\n\n    const handleAddSelectedRecords = async () => {\n        const userId = systemContext?.currentUser?.id;\n        if (!memoryEngine || !userId || !collectionId || selectedRecordsToAdd.length === 0) {\n            alert(\"MemoryEngine module not initialized, user not logged in, collection ID is missing, or no records selected.\");\n            return;\n        }\n\n        setIsAddingRecords(true);\n        setAddRecordError(null);\n        try {\n            const results = await Promise.all(selectedRecordsToAdd.map(recordId =>\n                memoryEngine.addRecordToCollection(collectionId, recordId, userId) // Pass collectionId, recordId, userId\n            ));\n\n            const successfulAdds = results.filter(result => result !== null).length; // Count successful adds (excluding duplicates)\n            const failedAdds = selectedRecordsToAdd.length - successfulAdds;\n\n            console.log(";
Attempted;
to;
add;
$;
{
    selectedRecordsToAdd.length;
}
records.Successful;
$;
{
    successfulAdds;
}
Failed: $;
{
    failedAdds;
}
");\n             // Simulate recording user action\n            authorityForgingEngine?.recordAction({\n                type: 'web:collections:add_records',\n                details: { collectionId, recordIds: selectedRecordsToAdd, successfulAdds, failedAdds },\n                context: { platform: 'web', page: 'collection_detail' },\n                user_id: userId, // Associate action with user\n            });\n\n            if (successfulAdds > 0) {\n                 alert(";
Successfully;
added;
$;
{
    successfulAdds;
}
record(s);
to;
the;
collection.(__makeTemplateObject([");\n            }\n            if (failedAdds > 0) {\n                 // Note: addRecordToCollection returns null for duplicates, which is not an error here.\n                 // True failures would throw errors caught above.\n                 // This count includes records already in the collection.\n                 alert("], [");\n            }\n            if (failedAdds > 0) {\n                 // Note: addRecordToCollection returns null for duplicates, which is not an error here.\n                 // True failures would throw errors caught above.\n                 // This count includes records already in the collection.\n                 alert("]));
$;
{
    failedAdds;
}
record(s);
were;
already in the;
collection;
or;
failed;
to;
add.(__makeTemplateObject([");\n            }\n\n            handleCloseAddRecordModal(); // Close modal\n            // The subscribeToCollectionRecordInsert listener will update the state automatically\n            // fetchCollectionData(); // Refetch data to update the list - handled by listener\n        } catch (err: any) {\n            console.error('Error adding records to collection:', err);\n            setAddRecordError("], [");\n            }\n\n            handleCloseAddRecordModal(); // Close modal\n            // The subscribeToCollectionRecordInsert listener will update the state automatically\n            // fetchCollectionData(); // Refetch data to update the list - handled by listener\n        } catch (err: any) {\n            console.error('Error adding records to collection:', err);\n            setAddRecordError("]));
Failed;
to;
add;
records: $;
{
    err.message;
}
");\n            alert(";
Failed;
to;
add;
records: $;
{
    err.message;
}
");\n        } finally {\n            setIsAddingRecords(false);\n        }\n    };\n    // --- End New ---\n\n    // TODO: Implement Edit Collection Details\n    // TODO: Implement Delete Collection\n\n\n   // Ensure user is logged in before rendering content\n  if (!systemContext?.currentUser) {\n       // This case should ideally be handled by ProtectedRoute, but as a fallback:\n       return (\n            <div className=\"container mx-auto p-4 flex justify-center\">\n               <div className=\"bg-neutral-800/50 p-8 rounded-lg shadow-xl w-full max-w-md text-center text-neutral-300\">\n                   <p>Please log in to view knowledge collections.</p>\n               </div>\n            </div>\n       );\n  }\n\n\n  return (\n    <div className=\"container mx-auto p-4\">\n      <div className=\"bg-neutral-800/50 p-6 rounded-lg shadow-xl\">\n        {loading ? (\n          <p className=\"text-neutral-400\">Loading collection...</p>\n        ) : error ? (\n             <p className=\"text-red-400\">Error: {error}</p>\n        ) : !collection ? (\n             <p className=\"text-neutral-400\">Collection not found.</p>\n        ) : (\n            <>\n                <div className=\"flex items-center gap-4 mb-4\">\n                    <Link to=\"/collections\" className=\"text-neutral-400 hover:text-white transition\">\n                        <ArrowLeft size={24} />\n                    </Link>\n                    <h2 className=\"text-3xl font-bold text-blue-400\">Collection: {collection.name}</h2>\n                </div>\n                <p className=\"text-neutral-300 mb-4\">{collection.description || 'No description.'}</p>\n                <small className=\"text-neutral-400 text-xs block mb-8\">\n                    ID: {collection.id}\n                     {collection.user_id && " | Owner;
$;
{
    collection.user_id;
}
"}\n                     {collection.creation_timestamp && " | Created;
$;
{
    new Date(collection.creation_timestamp).toLocaleString();
}
"}\n                     {collection.last_updated_timestamp && " | Last;
Updated: $;
{
    new Date(collection.last_updated_timestamp).toLocaleString();
}
"}\n                </small>\n\n                {/* TODO: Add Edit/Delete Collection buttons */}\n\n                {/* Records in Collection List */}\n                <div className=\"p-4 bg-neutral-700/50 rounded-lg\">\n                    <div className=\"flex justify-between items-center mb-3\">\n                         <h3 className=\"text-xl font-semibold text-blue-300\">Records in Collection ({records.length})</h3>\n                         {/* New: Add Record Button */}\n                         <button\n                             className=\"px-4 py-2 text-sm bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed\"\n                             onClick={handleOpenAddRecordModal}\n                             disabled={isAddingRecords || isRemovingRecord !== null}\n                         >\n                             <PlusCircle size={16} className=\"inline-block mr-1\"/> Add Records\n                         </button>\n                         {/* End New */}\n                    </div>\n\n                    {loading ? (\n                      <p className=\"text-neutral-400\">Loading records...</p>\n                    ) : records.length === 0 ? (\n                      <p className=\"text-neutral-400\">No records in this collection yet.</p>\n                    ) : (\n                      <ul className=\"space-y-4\">\n                        {records.map((record) => (\n                          <li key={record.id} className={";
bg - neutral - 600 / 50;
p - 4;
rounded - md;
border - l - 4;
border - blue - 500(__makeTemplateObject(["}>\n                            <div className=\"flex justify-between items-center\">\n                                <h4 className=\"font-semibold text-blue-200 mb-1\">Q: {record.question}</h4>\n                                 <button onClick={() => toggleExpandRecord(record.id)} className=\"text-neutral-400 hover:text-white transition\">\n                                    {expandedRecords[record.id] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}\n                                 </button>\n                            </div>\n                            {/* Answer (Collapsible) */}\n                            {expandedRecords[record.id] && ((\n                                 <div className=\"mt-2 border-t border-neutral-600 pt-2\">\n                                     <div className=\"text-neutral-300 text-sm prose prose-invert max-w-none\"> {/* Use prose for markdown styling */}\n                                         <ReactMarkdown>{record.answer}</ReactMarkdown>\n                                     </div>\n                                 </div>\n                            ))}\n                            <small className=\"text-neutral-400 text-xs block mt-2\">\n                                ID: {record.id} | Created: {new Date(record.timestamp).toLocaleString()}\n                                 {record.source && "], ["}>\n                            <div className=\"flex justify-between items-center\">\n                                <h4 className=\"font-semibold text-blue-200 mb-1\">Q: {record.question}</h4>\n                                 <button onClick={() => toggleExpandRecord(record.id)} className=\"text-neutral-400 hover:text-white transition\">\n                                    {expandedRecords[record.id] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}\n                                 </button>\n                            </div>\n                            {/* Answer (Collapsible) */}\n                            {expandedRecords[record.id] && ((\n                                 <div className=\"mt-2 border-t border-neutral-600 pt-2\">\n                                     <div className=\"text-neutral-300 text-sm prose prose-invert max-w-none\"> {/* Use prose for markdown styling */}\n                                         <ReactMarkdown>{record.answer}</ReactMarkdown>\n                                     </div>\n                                 </div>\n                            ))}\n                            <small className=\"text-neutral-400 text-xs block mt-2\">\n                                ID: {record.id} | Created: {new Date(record.timestamp).toLocaleString()}\n                                 {record.source && "])) | Source;
$;
{
    record.source;
}
"}\n                                 {record.dev_log_details && " | Dev;
Log;
Type: $;
{
    record.dev_log_details.type;
}
"}\n                            </small>\n                            {/* New: Actions for records in collection */}\n                             <div className=\"mt-3 flex gap-2\">\n                                 {/* Example: View Full Record Button (Link to KB page?) */}\n                                 {/* <button className=\"px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition\">View Record</button> */}\n                                 {/* Remove from Collection Button */}\n                                 <button\n                                     className=\"px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed\"\n                                     onClick={() => handleRemoveRecord(record.id)}\n                                     disabled={isRemovingRecord === record.id || isAddingRecords}\n                                 >\n                                     {isRemovingRecord === record.id ? <Loader2 size={16} className=\"inline-block mr-1 animate-spin\"/> : <MinusCircle size={16} className=\"inline-block mr-1\"/>)}\n                                     {isRemovingRecord === record.id ? 'Removing...' : 'Remove from Collection'}\n                                 </button>\n                             </div>\n                             {/* End New */}\n                          </li>\n                        ))}\n                      </ul>\n                    )}\n                </div>\n            </>\n        )}\n\n        {/* New: Add Record Modal */}\n        {showAddRecordModal && ((\n             <div className=\"fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50\">\n                 <div className=\"bg-neutral-800 p-8 rounded-lg shadow-xl w-full max-w-md max-h-[90%] flex flex-col\"> {/* Added flex-col and max-height */}\n                     <div className=\"flex justify-between items-center mb-4\">\n                         <h3 className=\"text-xl font-semibold text-blue-300\">Add Records to Collection</h3>\n                         <button\n                             type=\"button\"\n                             onClick={handleCloseAddRecordModal}\n                             className=\"text-neutral-400 hover:text-white transition\"\n                             disabled={isAddingRecords}\n                         >\n                             <XCircle size={24} />\n                         </button>\n                     </div>\n                     <p className=\"text-neutral-300 text-sm mb-4\">Select records to add to \"{collection?.name}\".</p>\n\n                     {loadingAvailableRecords ? (\n                         <div className=\"flex-grow flex justify-center items-center\">\n                             <Loader2 size={32} className=\"animate-spin text-blue-400\"/>\n                         </div>\n                     ) : addRecordError ? (\n                         <div className=\"flex-grow text-red-400 overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-700\">\n                             <p>Error loading records: {addRecordError}</p>\n                         </div>\n                     ) : availableRecordsToAdd.length === 0 ? (\n                         <div className=\"flex-grow text-neutral-400 overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-700\">\n                             <p>No additional knowledge records found to add.</p>\n                         </div>\n                     ) : (\n                         <div className=\"flex-grow overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-700 space-y-3 pr-2\"> {/* Added pr-2 for scrollbar space */}\n                             {availableRecordsToAdd.map(record => (\n                                 <div key={record.id} className=\"flex items-start gap-3 bg-neutral-700/50 p-3 rounded-md\">\n                                     <input\n                                         type=\"checkbox\"\n                                         id={";
record - $;
{
    record.id;
}
"}\n                                         className=\"form-checkbox h-4 w-4 text-blue-600 rounded border-neutral-600 bg-neutral-800 focus:ring-blue-500 mt-1\"\n                                         checked={selectedRecordsToAdd.includes(record.id)}\n                                         onChange={() => handleSelectRecordToAdd(record.id)}\n                                         disabled={isAddingRecords}\n                                     />\n                                     <label htmlFor={";
record - $;
{
    record.id;
}
"} className=\"flex-grow text-neutral-300 text-sm cursor-pointer\">\n                                         <span className=\"font-semibold\">Q:</span> {record.question.substring(0, 80)}{record.question.length > 80 ? '...' : ''}\n                                         <span className=\"block text-neutral-400 text-xs mt-1\">ID: {record.id}</span>\n                                     </label>\n                                 </div>\n                             ))}\n                         </div>\n                     )}\n\n                     {addRecordError && !loadingAvailableRecords && !isAddingRecords && ( // Show error only after loading/saving finishes\n                         <p className=\"text-red-400 text-sm mt-4\">Error: {addRecordError}</p>\n                     )}\n\n                     <div className=\"flex gap-4 justify-end mt-4\">\n                         <button\n                             type=\"button\"\n                             onClick={handleCloseAddRecordModal}\n                             className=\"px-6 py-2 bg-neutral-600 text-white font-semibold rounded-md hover:bg-neutral-700 transition\"\n                             disabled={isAddingRecords}\n                         >\n                             Cancel\n                         </button>\n                         <button\n                             type=\"button\"\n                             onClick={handleAddSelectedRecords}\n                             className=\"px-6 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed\"\n                             disabled={isAddingRecords || selectedRecordsToAdd.length === 0}\n                         >\n                             {isAddingRecords ? 'Adding...' : ";
Add;
$;
{
    selectedRecordsToAdd.length;
}
Record(s)(__makeTemplateObject(["}\n                         </button>\n                     </div>\n                 </div>\n             </div>\n        ))}\n        {/* End New */}\n\n      </div>\n    </div>\n  );\n};\n\nexport default CollectionDetail;\n"], ["}\n                         </button>\n                     </div>\n                 </div>\n             </div>\n        ))}\n        {/* End New */}\n\n      </div>\n    </div>\n  );\n};\n\nexport default CollectionDetail;\n"]))(__makeTemplateObject([""], [""]));
