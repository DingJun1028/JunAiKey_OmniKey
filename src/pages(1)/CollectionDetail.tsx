```typescript
// src/pages/CollectionDetail.tsx
// Knowledge Collection Detail Page (\u5178\u85cf\u8056\u5178\u8a73\u60c5)
// Displays the details of a single knowledge collection and the records it contains.
// --- New: Create a page to display collection details and records --
// --- New: Implement fetching collection data by ID --
// --- New: Implement fetching and displaying records in the collection --
// --- New: Add UI for removing records from the collection --
// --- New: Add UI for adding records to the collection (via modal) --
// --- New: Display records in the collection with expandable content --
// --- New: Add Realtime Updates for knowledge_collections and knowledge_collection_records --
// --- Modified: Implement Add/Remove Records functionality --

import React, { useEffect, useState, useCallback } from 'react'; // Import useCallback
import { useParams } from 'react-router-dom'; // To get the collection ID from the URL
import { MemoryEngine } from '../core/memory/MemoryEngine'; // To fetch collection and records
import { AuthorityForgingEngine } from '../core/authority/AuthorityForgingEngine'; // Use for action recording
import { KnowledgeCollection, KnowledgeRecord } from '../interfaces'; // Import types
import { BookOpen, ChevronDown, ChevronUp, Trash2, Edit, PlusCircle, Save, Loader2, Info, ArrowLeft, XCircle, MinusCircle } from 'lucide-react'; // Import icons including MinusCircle
import ReactMarkdown from 'react-markdown'; // For rendering markdown
import { Link } from 'react-router-dom'; // Import Link for navigation back


// Access core modules from the global window object (for MVP simplicity)
// In a real app, use React Context or dependency injection
declare const window: any;
const memoryEngine: MemoryEngine = window.systemContext?.memoryEngine; // The Memory Engine (\u6c38\u4e45\u8a18\u61b6) pillar
const authorityForgingEngine: any = window.systemContext?.authorityForgingEngine; // Use any for action recording (\u6b0a\u80fd\u935b\u9020)
const systemContext: any = window.systemContext; // Access the full context for currentUser


const CollectionDetail: React.FC = () => {
  const { collectionId } = useParams<{ collectionId: string }>(); // Get collectionId from URL params
  const [collection, setCollection] = useState<KnowledgeCollection | null>(null); // State for the collection details
  const [records, setRecords] = useState<KnowledgeRecord[]>([]); // State for records in the collection
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedRecords, setExpandedRecords] = useState<Record<string, boolean>>({}); // State to track expanded records

  // --- State for adding records ---
  const [showAddRecordModal, setShowAddRecordModal] = useState(false);
  const [availableRecordsToAdd, setAvailableRecordsToAdd] = useState<KnowledgeRecord[]>([]); // Records not currently in this collection
  const [loadingAvailableRecords, setLoadingAvailableRecords] = useState(false);
  const [selectedRecordsToAdd, setSelectedRecordsToAdd] = useState<string[]>([]); // IDs of records selected in the modal
  const [isAddingRecords, setIsAddingRecords] = useState(false);
  const [addRecordError, setAddRecordError] = useState<string | null>(null);
  // --- End State for adding records ---

  // --- State for removing records ---
  const [isRemovingRecord, setIsRemovingRecord] = useState<string | null>(null); // Track which record is being removed
  // --- End State for removing records ---

  // TODO: Implement state for editing collection details
  // TODO: Implement state for deleting collection


  const fetchCollectionData = useCallback(async () => {
       const userId = systemContext?.currentUser?.id;
       if (!memoryEngine || !userId || !collectionId) {
            setError("MemoryEngine module not initialized or user not logged in, or collection ID is missing.");
            setLoading(false);
            return;
        }
      setLoading(true);
      setError(null); // Clear main error when fetching
      try {
          // Fetch the specific collection details
          const fetchedCollection = await memoryEngine.getCollectionById(collectionId, userId); // Pass collectionId and userId

          if (fetchedCollection) {
              setCollection(fetchedCollection);
              // Fetch records within this collection
              const recordsInCollection = await memoryEngine.getRecordsInCollection(collectionId, userId); // Pass collectionId and userId
              setRecords(recordsInCollection);
          } else {
              // If collection not found, set records to empty
              setCollection(null);
              setRecords([]);
          }

      } catch (err: any) {
          console.error(`Error fetching data for collection ${collectionId}:`, err);
          setError(`Failed to load collection data: ${err.message}`);
          setCollection(null);
          setRecords([]);
      } finally {
          setLoading(false);
      }
  }, [memoryEngine, systemContext?.currentUser?.id, collectionId, setCollection, setRecords, setLoading, setError]); // Dependencies for useCallback


    // --- New: Fetch records available to add to this collection ---
    const fetchAvailableRecordsToAdd = async () => {
        const userId = systemContext?.currentUser?.id;
        if (!memoryEngine || !userId || !collectionId) {
            setAddRecordError(\"MemoryEngine module not initialized or user not logged in.\");
            setLoadingAvailableRecords(false);
            return;
        }
        setLoadingAvailableRecords(true);
        setAddRecordError(null);
        try {
            // Fetch all knowledge records for the user
            const allRecords = await memoryEngine.getAllKnowledgeForUser(userId);

            // Filter out records that are already in this collection
            const recordsInCurrentCollectionIds = new Set(records.map(record => record.id));
            const available = allRecords.filter(record => !recordsInCurrentCollectionIds.has(record.id));

            setAvailableRecordsToAdd(available);

        } catch (err: any) {
            console.error('Error fetching available records:', err);
            setAddRecordError(`Failed to load available records: ${err.message}`);
            setAvailableRecordsToAdd([]);
        } finally {
            setLoadingAvailableRecords(false);
        }
    };
    // --- End New ---


  useEffect(() => {
    // Fetch data when the component mounts or when the user changes or collectionId changes
    if (systemContext?.currentUser?.id && collectionId) {
        fetchCollectionData(); // Fetch data for the specific collection
    }

    // --- New: Subscribe to realtime updates for knowledge_collection_records ---
    // Note: knowledge_collection_records updates are subscribed by MemoryEngine and published via EventBus.
    // We need to listen to those events here to update the records list in the UI.
    let unsubscribeCollectionRecordInsert: (() => void) | undefined;
    let unsubscribeCollectionRecordDelete: (() => void) | undefined;
    // Note: Updates to the KnowledgeRecord itself (question, answer, etc.) are handled by the KnowledgeBase page's subscription.
    // If you display full record details here, you might need to subscribe to 'knowledge_record_update' as well.

    if (memoryEngine?.context?.eventBus) { // Check if MemoryEngine and its EventBus are available
        const eventBus = memoryEngine.context.eventBus;
        const userId = systemContext?.currentUser?.id;

        // Subscribe to collection record insert events
        unsubscribeCollectionRecordInsert = eventBus.subscribe('knowledge_collection_record_insert', (payload: { collection_id: string, record_id: string, added_timestamp: string, userId: string }) => {
            // Check if the event is for the current collection and user
            if (payload.collection_id === collectionId && payload.userId === userId) {
                console.log('CollectionDetail page received knowledge_collection_record_insert event:', payload);
                // Refetch the collection data to update the records list
                fetchCollectionData();
            }
        });

         // Subscribe to collection record delete events
         unsubscribeCollectionRecordDelete = eventBus.subscribe('knowledge_collection_record_delete', (payload: { collectionId: string, recordId: string, userId: string }) => {
             // Check if the event is for the current collection and user
             if (payload.collectionId === collectionId && payload.userId === userId) {
                 console.log('CollectionDetail page received knowledge_collection_record_delete event:', payload);
                 // Refetch the collection data to update the records list
                 fetchCollectionData();
             }
         });

        // TODO: Subscribe to knowledge_record_update events if you display full record details in the list
        // eventBus.subscribe('knowledge_record_update', (payload: KnowledgeRecord) => { ... update specific record in 'records' state ... });
    }
    // --- End New ---


    return () => {
        // Unsubscribe on component unmount
        unsubscribeCollectionRecordInsert?.();
        unsubscribeCollectionRecordDelete?.();
    };

  }, [collectionId, systemContext?.currentUser?.id, memoryEngine, fetchCollectionData]); // Re-run effect when collectionId, user ID, service, fetch function changes


    const toggleExpandRecord = (recordId: string) => {
        setExpandedRecords(prevState => ({
            ...prevState,
            [recordId]: !prevState[recordId]
        }));
    };

    // --- New: Handle Remove Record from Collection ---
    const handleRemoveRecord = async (recordId: string) => {
        const userId = systemContext?.currentUser?.id;
        if (!memoryEngine || !userId || !collectionId) {
            alert(\"MemoryEngine module not initialized, user not logged in, or collection ID is missing.\");
            return;
        }
        if (!confirm(`Are you sure you want to remove this record from the collection?`)) return;

        console.log(`Attempting to remove record ${recordId} from collection ${collectionId}`);
         // Simulate recording user action
        authorityForgingEngine?.recordAction({
            type: 'web:collections:remove_record',
            details: { collectionId, recordId },
            context: { platform: 'web', page: 'collection_detail' },
            user_id: userId, // Associate action with user
        });

        setIsRemovingRecord(recordId); // Indicate this record is being removed
        setError(null); // Clear previous errors
        try {
            // Call the MemoryEngine method to remove the record from the collection
            const success = await memoryEngine.removeRecordFromCollection(collectionId, recordId, userId); // Pass collectionId, recordId, userId

            if (success) {
                console.log(`Record ${recordId} removed from collection ${collectionId}.`);
                // The subscribeToCollectionRecordDelete listener will update the state automatically
                 alert('Record removed from collection successfully!');
            } else {
                setError('Failed to remove record from collection.');
                alert('Failed to remove record from collection.');
            }

        } catch (err: any) {
            console.error(`Error removing record ${recordId} from collection ${collectionId}:`, err);
            setError(`Failed to remove record: ${err.message}`);
            alert(`Failed to remove record: ${err.message}`);
        } finally {
            setIsRemovingRecord(null); // Reset removing state
        }
    };
    // --- End New ---

    // --- New: Handle Add Records to Collection ---
    const handleOpenAddRecordModal = () => {
        setShowAddRecordModal(true);
        setSelectedRecordsToAdd([]); // Clear previous selections
        fetchAvailableRecordsToAdd(); // Fetch records that can be added
    };

    const handleCloseAddRecordModal = () => {
        setShowAddRecordModal(false);
        setAvailableRecordsToAdd([]);
        setSelectedRecordsToAdd([]);
        setAddRecordError(null); // Clear error
    };

    const handleSelectRecordToAdd = (recordId: string) => {
        setSelectedRecordsToAdd(prevSelected =>
            prevSelected.includes(recordId)
                ? prevSelected.filter(id => id !== recordId)
                : [...prevSelected, recordId]
        );
    };

    const handleAddSelectedRecords = async () => {
        const userId = systemContext?.currentUser?.id;
        if (!memoryEngine || !userId || !collectionId || selectedRecordsToAdd.length === 0) {
            alert(\"MemoryEngine module not initialized, user not logged in, collection ID is missing, or no records selected.\");
            return;
        }

        setIsAddingRecords(true);
        setAddRecordError(null);
        try {
            const results = await Promise.all(selectedRecordsToAdd.map(recordId =>
                memoryEngine.addRecordToCollection(collectionId, recordId, userId) // Pass collectionId, recordId, userId
            ));

            const successfulAdds = results.filter(result => result !== null).length; // Count successful adds (excluding duplicates)
            const failedAdds = selectedRecordsToAdd.length - successfulAdds;

            console.log(`Attempted to add ${selectedRecordsToAdd.length} records. Successful: ${successfulAdds}, Failed: ${failedAdds}`);
             // Simulate recording user action
            authorityForgingEngine?.recordAction({
                type: 'web:collections:add_records',
                details: { collectionId, recordIds: selectedRecordsToAdd, successfulAdds, failedAdds },
                context: { platform: 'web', page: 'collection_detail' },
                user_id: userId, // Associate action with user
            });

            if (successfulAdds > 0) {
                 alert(`Successfully added ${successfulAdds} record(s) to the collection.`);
            }
            if (failedAdds > 0) {
                 // Note: addRecordToCollection returns null for duplicates, which is not an error here.
                 // True failures would throw errors caught above.
                 // This count includes records already in the collection.
                 alert(`${failedAdds} record(s) were already in the collection or failed to add.`);
            }

            handleCloseAddRecordModal(); // Close modal
            // The subscribeToCollectionRecordInsert listener will update the state automatically
            // fetchCollectionData(); // Refetch data to update the list - handled by listener
        } catch (err: any) {
            console.error('Error adding records to collection:', err);
            setAddRecordError(`Failed to add records: ${err.message}`);
            alert(`Failed to add records: ${err.message}`);
        } finally {
            setIsAddingRecords(false);
        }
    };
    // --- End New ---

    // TODO: Implement Edit Collection Details
    // TODO: Implement Delete Collection


   // Ensure user is logged in before rendering content
  if (!systemContext?.currentUser) {
       // This case should ideally be handled by ProtectedRoute, but as a fallback:
       return (
            <div className="container mx-auto p-4 flex justify-center">
               <div className="bg-neutral-800/50 p-8 rounded-lg shadow-xl w-full max-w-md text-center text-neutral-300">
                   <p>Please log in to view knowledge collections.</p>
               </div>
            </div>
       );
  }


  return (
    <div className="container mx-auto p-4">
      <div className="bg-neutral-800/50 p-6 rounded-lg shadow-xl">
        {loading ? (
          <p className="text-neutral-400">Loading collection...</p>
        ) : error ? (
             <p className="text-red-400">Error: {error}</p>
        ) : !collection ? (
             <p className="text-neutral-400">Collection not found.</p>
        ) : (
            <>
                <div className="flex items-center gap-4 mb-4">
                    <Link to="/collections" className="text-neutral-400 hover:text-white transition">
                        <ArrowLeft size={24} />
                    </Link>
                    <h2 className="text-3xl font-bold text-blue-400">Collection: {collection.name}</h2>
                </div>
                <p className="text-neutral-300 mb-4">{collection.description || 'No description.'}</p>
                <small className="text-neutral-400 text-xs block mb-8">
                    ID: {collection.id}
                     {collection.user_id && ` | Owner: ${collection.user_id}`}
                     {collection.creation_timestamp && ` | Created: ${new Date(collection.creation_timestamp).toLocaleString()}`}
                     {collection.last_updated_timestamp && ` | Last Updated: ${new Date(collection.last_updated_timestamp).toLocaleString()}`}
                </small>

                {/* TODO: Add Edit/Delete Collection buttons */}

                {/* Records in Collection List */}
                <div className="p-4 bg-neutral-700/50 rounded-lg">
                    <div className="flex justify-between items-center mb-3">
                         <h3 className="text-xl font-semibold text-blue-300">Records in Collection ({records.length})</h3>
                         {/* New: Add Record Button */}
                         <button
                             className="px-4 py-2 text-sm bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                             onClick={handleOpenAddRecordModal}
                             disabled={isAddingRecords || isRemovingRecord !== null}
                         >
                             <PlusCircle size={16} className="inline-block mr-1"/> Add Records
                         </button>
                         {/* End New */}
                    </div>

                    {loading ? (
                      <p className="text-neutral-400">Loading records...</p>
                    ) : records.length === 0 ? (
                      <p className="text-neutral-400">No records in this collection yet.</p>
                    ) : (
                      <ul className="space-y-4">
                        {records.map((record) => (
                          <li key={record.id} className={`bg-neutral-600/50 p-4 rounded-md border-l-4 border-blue-500`}>
                            <div className="flex justify-between items-center">
                                <h4 className="font-semibold text-blue-200 mb-1">Q: {record.question}</h4>
                                 <button onClick={() => toggleExpandRecord(record.id)} className="text-neutral-400 hover:text-white transition">
                                    {expandedRecords[record.id] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                 </button>
                            </div>
                            {/* Answer (Collapsible) */}
                            {expandedRecords[record.id] && ((
                                 <div className="mt-2 border-t border-neutral-600 pt-2">
                                     <div className="text-neutral-300 text-sm prose prose-invert max-w-none"> {/* Use prose for markdown styling */}
                                         <ReactMarkdown>{record.answer}</ReactMarkdown>
                                     </div>
                                 </div>
                            ))}
                            <small className="text-neutral-400 text-xs block mt-2">
                                ID: {record.id} | Created: {new Date(record.timestamp).toLocaleString()}
                                 {record.source && ` | Source: ${record.source}`}
                                 {record.dev_log_details && ` | Dev Log Type: ${record.dev_log_details.type}`}
                            </small>
                            {/* New: Actions for records in collection */}
                             <div className="mt-3 flex gap-2">
                                 {/* Example: View Full Record Button (Link to KB page?) */}
                                 {/* <button className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition">View Record</button> */}
                                 {/* Remove from Collection Button */}
                                 <button
                                     className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                     onClick={() => handleRemoveRecord(record.id)}
                                     disabled={isRemovingRecord === record.id || isAddingRecords}
                                 >
                                     {isRemovingRecord === record.id ? <Loader2 size={16} className="inline-block mr-1 animate-spin"/> : <MinusCircle size={16} className="inline-block mr-1"/>)}
                                     {isRemovingRecord === record.id ? 'Removing...' : 'Remove from Collection'}
                                 </button>
                             </div>
                             {/* End New */}
                          </li>
                        ))}
                      </ul>
                    )}
                </div>
            </>
        )}

        {/* New: Add Record Modal */}
        {showAddRecordModal && ((
             <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                 <div className="bg-neutral-800 p-8 rounded-lg shadow-xl w-full max-w-md max-h-[90%] flex flex-col"> {/* Added flex-col and max-height */}
                     <div className="flex justify-between items-center mb-4">
                         <h3 className="text-xl font-semibold text-blue-300">Add Records to Collection</h3>
                         <button
                             type="button"
                             onClick={handleCloseAddRecordModal}
                             className="text-neutral-400 hover:text-white transition"
                             disabled={isAddingRecords}
                         >
                             <XCircle size={24} />
                         </button>
                     </div>
                     <p className="text-neutral-300 text-sm mb-4">Select records to add to \"{collection?.name}\".</p>

                     {loadingAvailableRecords ? (
                         <div className="flex-grow flex justify-center items-center">
                             <Loader2 size={32} className="animate-spin text-blue-400"/>
                         </div>
                     ) : addRecordError ? (
                         <div className="flex-grow text-red-400 overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-700">
                             <p>Error loading records: {addRecordError}</p>
                         </div>
                     ) : availableRecordsToAdd.length === 0 ? (
                         <div className="flex-grow text-neutral-400 overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-700">
                             <p>No additional knowledge records found to add.</p>
                         </div>
                     ) : (
                         <div className="flex-grow overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-700 space-y-3 pr-2"> {/* Added pr-2 for scrollbar space */}
                             {availableRecordsToAdd.map(record => (
                                 <div key={record.id} className="flex items-start gap-3 bg-neutral-700/50 p-3 rounded-md">
                                     <input
                                         type="checkbox"
                                         id={`record-${record.id}`}
                                         className="form-checkbox h-4 w-4 text-blue-600 rounded border-neutral-600 bg-neutral-800 focus:ring-blue-500 mt-1"
                                         checked={selectedRecordsToAdd.includes(record.id)}
                                         onChange={() => handleSelectRecordToAdd(record.id)}
                                         disabled={isAddingRecords}
                                     />
                                     <label htmlFor={`record-${record.id}`} className="flex-grow text-neutral-300 text-sm cursor-pointer">
                                         <span className="font-semibold">Q:</span> {record.question.substring(0, 80)}{record.question.length > 80 ? '...' : ''}
                                         <span className="block text-neutral-400 text-xs mt-1">ID: {record.id}</span>
                                     </label>
                                 </div>
                             ))}
                         </div>
                     )}

                     {addRecordError && !loadingAvailableRecords && !isAddingRecords && ( // Show error only after loading/saving finishes
                         <p className="text-red-400 text-sm mt-4">Error: {addRecordError}</p>
                     )}

                     <div className="flex gap-4 justify-end mt-4">
                         <button
                             type="button"
                             onClick={handleCloseAddRecordModal}
                             className="px-6 py-2 bg-neutral-600 text-white font-semibold rounded-md hover:bg-neutral-700 transition"
                             disabled={isAddingRecords}
                         >
                             Cancel
                         </button>
                         <button
                             type="button"
                             onClick={handleAddSelectedRecords}
                             className="px-6 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                             disabled={isAddingRecords || selectedRecordsToAdd.length === 0}
                         >
                             {isAddingRecords ? 'Adding...' : `Add ${selectedRecordsToAdd.length} Record(s)`}
                         </button>
                     </div>
                 </div>
             </div>
        ))}
        {/* End New */}

      </div>
    </div>
  );
};

export default CollectionDetail;
```