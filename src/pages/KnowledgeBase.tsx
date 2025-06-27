```typescript
// src/pages/KnowledgeBase.tsx
// Knowledge Base Page (永久記憶)
// Displays and manages user's personal knowledge base.
// --- New: Add UI for listing and managing knowledge records ---
// --- New: Add UI for creating, editing, and deleting records ---
// --- New: Add Realtime Updates for knowledge_records ---
// --- New: Add UI for searching knowledge records (keyword/semantic) ---
// --- New: Add Knowledge Graph Visualization (using React Flow) ---
// --- Modified: Add source filter for graph visualization ---
// --- Modified: Integrate KnowledgeGraphViewer component ---
// --- Modified: Add source filter UI for the graph ---
// --- New: Add UI for managing Knowledge Relations ---
// --- New: Add UI for creating, editing, and deleting Relations ---
// --- New: Add Realtime Updates for knowledge_relations ---


import React, { useEffect, useState, useCallback } from 'react'; // Import useCallback
import { KnowledgeSync } from '../modules/knowledgeSync'; // To fetch and manage records
import { AuthorityForgingEngine } from '../core/authority/AuthorityForgingEngine'; // Import AuthorityForgingEngine
import { KnowledgeGraphService } from '../core/wisdom/KnowledgeGraphService'; // To manage relations
import { KnowledgeRecord, KnowledgeRelation } from '../interfaces'; // Import interfaces, KnowledgeRelation
import ReactMarkdown from 'react-markdown'; // For rendering markdown
import { Loader2, Edit, Trash2, ChevronDown, ChevronUp, PlusCircle, Save, XCircle, Search, Zap, GitBranch, Link as LinkIcon, Unlink } from 'lucide-react'; // Import icons including GitBranch, Link, Unlink
// --- New: Import KnowledgeGraphViewer component ---\
import KnowledgeGraphViewer from '../components/KnowledgeGraphViewer';
// --- End New ---\


// Access core modules from the global window object (for MVP simplicity)
// In a real app, use React Context or dependency injection
declare const window: any;
const knowledgeSync: KnowledgeSync = window.systemContext?.knowledgeSync; // Interacts with MemoryEngine (永久記憶)
const authorityForgingEngine: any = window.systemContext?.authorityForgingEngine; // Use any for action recording (權能鍛造)
const knowledgeGraphService: KnowledgeGraphService = window.systemContext?.knowledgeGraphService; // The Knowledge Graph Service
const systemContext: any = window.systemContext; // Access the full context for currentUser


// Define available relation types (example)
const RELATION_TYPES = ['related', 'prerequisite', 'follow-up', 'contradicts', 'supports', 'example', 'derived_from'] as const;
type RelationType = typeof RELATION_TYPES[number];


const KnowledgeBase: React.FC = () => {
  const [knowledgeRecords, setKnowledgeRecords] = useState<KnowledgeRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [editingRecord, setEditingRecord] = useState<KnowledgeRecord | null>(null);
  const [expandedRecords, setExpandedRecords] = useState<Record<string, boolean>>({}); // State to track expanded records
  const [useSemanticSearch, setUseSemanticSearch] = useState(false); // State to toggle semantic search
  // --- New: State to toggle graph view ---\
  const [showGraph, setShowGraph] = useState(false);
  // --- End New ---\
  // --- New: State for source filter in graph view ---\
  const [graphSourceFilter, setGraphSourceFilter] = useState<string>('');
  const [availableSources, setAvailableSources] = useState<string[]>([]); // List of unique sources for filter
  // --- End New ---\

  // --- New: State for managing relations ---\
  const [showAddRelationModal, setShowAddRelationModal] = useState(false);
  const [availableRecordsForRelation, setAvailableRecordsForRelation] = useState<KnowledgeRecord[]>([]); // Records available to link
  const [selectedSourceRecordId, setSelectedSourceRecordId] = useState<string | ''>(''); // Source record for new relation
  const [selectedTargetRecordId, setSelectedTargetRecordId] = useState<string | ''>(''); // Target record for new relation
  const [newRelationType, setNewRelationType] = useState<RelationType>('related'); // Type for new relation
  const [isSavingRelation, setIsSavingRelation] = useState(false);
  const [relationError, setRelationError] = useState<string | null>(null); // Error specific to relations
  // --- End New ---\


  const fetchKnowledge = async (query = '', useSemantic = false) => {
     const userId = systemContext?.currentUser?.id;
     if (!knowledgeSync || !userId) {
        setError(\"KnowledgeSync module not initialized or user not logged in.\");
        setLoading(false);
        return;
    }
    setLoading(true);
    setError(null);
    try {
      // Uses MemoryEngine via KnowledgeSync
      const records = query
        ? await knowledgeSync.searchKnowledge(query, userId, useSemantic) // Pass userId and useSemantic
        : await knowledgeSync.getAllKnowledgeForUser(userId); // Fetch all if no search term, pass userId

      // --- New: Fetch relations for each record ---\
      // This is inefficient for a large number of records. A better approach is to fetch all relations
      // and then map them to records client-side, or fetch relations only when a record is expanded.
      // For MVP, let's fetch all relations and attach them to the records.
      const relations = await knowledgeGraphService?.getRelations(userId) || [];
      const recordsWithRelations = records.map(record => ({
          ...record,
          // Filter relations where this record is either source or target
          relations: relations.filter(rel => rel.source_record_id === record.id || rel.target_record_id === record.id)
      }));
      setKnowledgeRecords(recordsWithRelations);
      // --- End New ---\


      // --- New: Extract unique sources for filter dropdown ---\
      const sources = Array.from(new Set(records.map(record => record.source).filter(source => source !== undefined && source !== null)));
      setAvailableSources(['', ...sources as string[]]); // Add empty option for 'All'
      // --- End New ---\

    } catch (err: any) {
      console.error('Error fetching knowledge:', err);
      setError(`Failed to load knowledge records: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch data when the component mounts or when the user changes or filters change
    if (systemContext?.currentUser?.id) {
        fetchKnowledge(searchTerm, useSemanticSearch); // Fetch with current search term and semantic toggle state
    }

    // --- New: Subscribe to realtime updates for knowledge_records and knowledge_relations ---\
    let unsubscribeRecordInsert: (() => void) | undefined;
    let unsubscribeRecordUpdate: (() => void) | undefined;
    let unsubscribeRecordDelete: (() => void) | undefined;
    let unsubscribeRelationInsert: (() => void) | undefined;
    let unsubscribeRelationUpdate: (() => void) | undefined;
    let unsubscribeRelationDelete: (() => void) | undefined;


    if (knowledgeSync?.context?.eventBus && knowledgeGraphService?.context?.eventBus) { // Check if services and their EventBuses are available
        const eventBus = knowledgeSync.context.eventBus; // Assuming both services use the same EventBus instance
        const userId = systemContext?.currentUser?.id;

        // Subscribe to knowledge record events (refetch all to update list and relations)
        unsubscribeRecordInsert = eventBus.subscribe('knowledge_record_insert', (payload: KnowledgeRecord) => {
            if (payload.user_id === userId) {
                console.log('KnowledgeBase received knowledge_record_insert event:', payload);
                fetchKnowledge(searchTerm, useSemanticSearch); // Refetch all data
            }
        });

        unsubscribeRecordUpdate = eventBus.subscribe('knowledge_record_update', (payload: KnowledgeRecord) => {
             if (payload.user_id === userId) {
                 console.log('KnowledgeBase received knowledge_record_update event:', payload);
                 fetchKnowledge(searchTerm, useSemanticSearch); // Refetch all data
             }
         });

        unsubscribeRecordDelete = eventBus.subscribe('knowledge_record_delete', (payload: { id: string, userId: string }) => {
             if (payload.userId === userId) {
                 console.log('KnowledgeBase received knowledge_record_delete event:', payload);
                 fetchKnowledge(searchTerm, useSemanticSearch); // Refetch all data
             }
         });

        // Subscribe to knowledge relation events (refetch all to update relations displayed with records)
        unsubscribeRelationInsert = eventBus.subscribe('knowledge_relation_insert', (payload: KnowledgeRelation) => {
             if (payload.user_id === userId) {
                 console.log('KnowledgeBase received knowledge_relation_insert event:', payload);
                 fetchKnowledge(searchTerm, useSemanticSearch); // Refetch all data
             }
         });

         unsubscribeRelationUpdate = eventBus.subscribe('knowledge_relation_update', (payload: KnowledgeRelation) => {
             if (payload.user_id === userId) {
                 console.log('KnowledgeBase received knowledge_relation_update event:', payload);
                 fetchKnowledge(searchTerm, useSemanticSearch); // Refetch all data
             }
         });

          unsubscribeRelationDelete = eventBus.subscribe('knowledge_relation_delete', (payload: { relationId: string, userId: string }) => {
             if (payload.userId === userId) {
                 console.log('KnowledgeBase received knowledge_relation_delete event:', payload);
                 fetchKnowledge(searchTerm, useSemanticSearch); // Refetch all data
             }
         });
    }
    // --- End New ---\


    return () => {
        // Unsubscribe on component unmount
        unsubscribeRecordInsert?.();
        unsubscribeRecordUpdate?.();
        unsubscribeRecordDelete?.();
        unsubscribeRelationInsert?.();
        unsubscribeRelationUpdate?.();
        unsubscribeRelationDelete?.();
    };

  }, [searchTerm, systemContext?.currentUser?.id, knowledgeSync, useSemanticSearch, knowledgeGraphService]); // Refetch when search term, user, services, or semantic toggle changes


  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
     const userId = systemContext?.currentUser?.id;
     if (!userId) return; // Should be protected by route, but safety check

    // searchTerm state update already triggers fetch via useEffect
     // Simulate recording user action (Part of 權能鍛造 / 六式奧義: 觀察)
    authorityForgingEngine?.recordAction({
        type: 'web:kb:search',
        details: { query: searchTerm, useSemantic: useSemanticSearch },
        context: { platform: 'web', page: 'knowledge' },
        user_id: userId, // Associate action with user
    });
  };

  const handleSaveKnowledge = async (e: React.FormEvent) => {
      e.preventDefault();
       const userId = systemContext?.currentUser?.id;
       if (!knowledgeSync || !userId) {
            setError(\"KnowledgeSync module not initialized or user not logged in.\");
            return;
        }
      if (!newQuestion.trim() || !newAnswer.trim()) {
          alert('Please enter both question and answer.');
          return;
      }

      setIsSaving(true);
      setError(null);
      try {
          // Uses MemoryEngine via KnowledgeSync
          const savedRecord = await knowledgeSync.saveKnowledge(newQuestion, newAnswer, userId); // Pass userId
          if (savedRecord) {
              console.log('New record saved:', savedRecord);
              setNewQuestion('');
              setNewAnswer('');
              // Refetch data is now handled by realtime listener
               // Simulate recording user action (Part of 權能鍛造 / 六式奧義: 觀察)
                authorityForgingEngine?.recordAction({
                    type: 'web:kb:save',
                    details: { recordId: savedRecord.id, question: savedRecord.question },
                    context: { platform: 'web', page: 'knowledge' },
                    user_id: userId, // Associate action with user
                });
          } else {
               setError('Failed to save knowledge record.');
          }
      } catch (err: any) {
          console.error('Error saving knowledge:', err);
          setError(`Failed to save knowledge record: ${err.message}`);
      } finally {
          setIsSaving(false);
      }
  };

  const handleEditClick = (record: KnowledgeRecord) => {
      setEditingRecord(record);
      setNewQuestion(record.question);
      setNewAnswer(record.answer);
  };

  const handleUpdateKnowledge = async (e: React.FormEvent) => {
      e.preventDefault();
       const userId = systemContext?.currentUser?.id;
      if (!knowledgeSync || !editingRecord || !userId) return; // Safety checks

      if (!newQuestion.trim() || !newAnswer.trim()) {
          alert('Please enter both question and answer.');
          return;
      }

      setIsSaving(true);
      setError(null);
      try {
          // Uses MemoryEngine via KnowledgeSync
          const updatedRecord = await knowledgeSync.updateKnowledge(editingRecord.id, {
              question: newQuestion,
              answer: newAnswer,
          }, userId); // Pass userId
          if (updatedRecord) {
              console.log('Record updated:', updatedRecord);
              setEditingRecord(null);
              setNewQuestion('');
              setNewAnswer('');
              // Refetch data is now handled by realtime listener
               // Simulate recording user action (Part of 權能鍛造 / 六式奧義: 觀察)
                authorityForgingEngine?.recordAction({
                    type: 'web:kb:update',
                    details: { recordId: updatedRecord.id, question: updatedRecord.question },
                    context: { platform: 'web', page: 'knowledge' },
                    user_id: userId, // Associate action with user
                });
          } else {
              setError('Failed to update knowledge record.');
          }
      } catch (err: any) {
          console.error('Error updating knowledge:', err);
          setError(`Failed to update knowledge record: ${err.message}`);
      } finally {
          setIsSaving(false);
      }
  };

  const handleDeleteKnowledge = async (recordId: string) => {
       const userId = systemContext?.currentUser?.id;
       if (!knowledgeSync || !userId || !confirm(`Are you sure you want to delete record ${recordId}?`)) return; // Safety checks

       setError(null);
       try {
           // Uses MemoryEngine via KnowledgeSync
           const success = await knowledgeSync.deleteKnowledge(recordId, userId); // Pass userId
           if (success) {
               console.log('Record deleted:', recordId);
               // State update handled by realtime listener
                alert('Knowledge record deleted successfully!');
                 // Simulate recording user action (Part of 權能鍛造 / 六式奧義: 觀察)
                authorityForgingEngine?.recordAction({
                    type: 'web:kb:delete',
                    details: { recordId: recordId },
                    context: { platform: 'web', page: 'knowledge' },
                    user_id: userId, // Associate action with user
                });
           } else {
               setError('Failed to delete knowledge record.');
           }
       } catch (err: any) {
           console.error('Error deleting knowledge:', err);
           setError(`Failed to delete knowledge record: ${err.message}`);
       }
  };

   const toggleExpandRecord = (recordId: string) => {
       setExpandedRecords(prevState => ({
           ...prevState,
           [recordId]: !prevState[recordId]
       }));
   };

    // --- New: Handle Add Relation ---\
    const handleOpenAddRelationModal = () => {
        setShowAddRelationModal(true);
        setSelectedSourceRecordId('');
        setSelectedTargetRecordId('');
        setNewRelationType('related');
        setRelationError(null);
        // Populate available records list (all current records)
        setAvailableRecordsForRelation(knowledgeRecords);
    };

    const handleCloseAddRelationModal = () => {
        setShowAddRelationModal(false);
        setSelectedSourceRecordId('');
        setSelectedTargetRecordId('');
        setNewRelationType('related');
        setRelationError(null);
        setAvailableRecordsForRelation([]); // Clear list
    };

    const handleCreateRelation = async (e: React.FormEvent) => {
        e.preventDefault();
        const userId = systemContext?.currentUser?.id;
        if (!knowledgeGraphService || !userId || !selectedSourceRecordId || !selectedTargetRecordId || !newRelationType) {
            setRelationError(\"KnowledgeGraphService module not initialized, user not logged in, or required fields are empty.\");
            return;
        }

        setIsSavingRelation(true);
        setRelationError(null);
        try {
            // Create the relation
            const createdRelation = await knowledgeGraphService.createRelation(selectedSourceRecordId, selectedTargetRecordId, newRelationType, userId); // Pass sourceId, targetId, type, userId

            if (createdRelation) {
                alert(`Relation created successfully: ${createdRelation.source_record_id} -> ${createdRelation.target_record_id} (${createdRelation.relation_type})`);
                console.log('Created new relation:', createdRelation);
                handleCloseAddRelationModal(); // Close modal
                // State update handled by realtime listener
                 // Simulate recording user action
                authorityForgingEngine?.recordAction({
                    type: 'web:kb:create_relation',
                    details: { relationId: createdRelation.id, source: createdRelation.source_record_id, target: createdRelation.target_record_id, type: createdRelation.relation_type },
                    context: { platform: 'web', page: 'knowledge' },
                    user_id: userId, // Associate action with user
                });
            } else {
                setRelationError('Failed to create relation.');
            }
        } catch (err: any) {
            console.error('Error creating relation:', err);
            setRelationError(`Failed to create relation: ${err.message}`);
        } finally {
            setIsSavingRelation(false);
        }
    };

    const handleDeleteRelation = async (relationId: string) => {
        const userId = systemContext?.currentUser?.id;
        if (!knowledgeGraphService || !userId) {
            alert(\"KnowledgeGraphService module not initialized or user not logged in.\");
            return;
        }
        if (!confirm(`Are you sure you want to delete this relation?`)) return;

        setError(null); // Clear main error
        try {
            // Delete the relation
            const success = await knowledgeGraphService.deleteRelation(relationId, userId); // Pass relationId and userId

            if (success) {
                console.log('Relation deleted:', relationId);
                // State update handled by realtime listener
                 alert('Relation deleted successfully!');
                 // Simulate recording user action
                authorityForgingEngine?.recordAction({
                    type: 'web:kb:delete_relation',
                    details: { relationId },
                    context: { platform: 'web', page: 'knowledge' },
                    user_id: userId, // Associate action with user
                });
            } else {
                setError('Failed to delete relation.');
                alert('Failed to delete relation.');
            }
        } catch (err: any) {
            console.error('Error deleting relation:', err);
            setError(`Failed to delete relation: ${err.message}`);
            alert(`Failed to delete relation: ${err.message}`);
        }
    };
    // --- End New ---\


   // Ensure user is logged in before rendering content
  if (!systemContext?.currentUser) {
       // This case should ideally be handled by ProtectedRoute, but as a fallback:
       return (
            <div className=\"container mx-auto p-4 flex justify-center\">
               <div className=\"bg-neutral-800/50 p-8 rounded-lg shadow-xl w-full max-w-md text-center text-neutral-300\">
                   <p>Please log in to view your knowledge base.</p>
               </div>
            </div>
       );
  }


  return (
    <div className=\"container mx-auto p-4\">
      <div className=\"bg-neutral-800/50 p-6 rounded-lg shadow-xl\">
        <h2 className=\"text-3xl font-bold text-blue-400 mb-6\">Knowledge Base (永久記憶)</h2>
        <p className=\"text-neutral-300 mb-8\">Store, search, and manage your knowledge records. This is a core part of your OmniKey's memory.</p>

        {/* Search Form */}
        <form onSubmit={handleSearch} className=\"mb-8 p-4 bg-neutral-700/50 rounded-lg\">
          <h3 className=\"text-xl font-semibold text-blue-300 mb-3\">Search Knowledge</h3>
          <div className=\"flex gap-4 items-center\">
            <input
              id=\"search\"
              type=\"text\"
              className=\"flex-grow p-2 rounded-md bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500\"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder=\"Search questions or answers...\"
              disabled={loading} // Disable search button while loading
            />
            <button
              type=\"submit\"
              className=\"px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed\"
              disabled={loading} // Disable search button while loading
            >
              {loading ? <Loader2 size={18} className=\"animate-spin\"/> : <Search size={18} className=\"inline-block mr-1\"/>)}
              Search
            </button>
             {searchTerm && (
                <button
                    type=\"button\"
                    onClick={() => setSearchTerm('')}
                    className=\"px-6 py-2 bg-neutral-600 text-white font-semibold rounded-md hover:bg-neutral-700 transition\"
                    disabled={loading}
                >
                    Clear
                </button>
             )}
             {/* Semantic Search Toggle */}
             <button
                 type=\"button\"
                 className={`text-sm font-semibold px-3 py-2 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed ${useSemanticSearch ? 'bg-blue-500 text-white' : 'bg-neutral-200 text-neutral-700 dark:bg-neutral-700 dark:text-neutral-300'}`}
                 onClick={() => setUseSemanticSearch(!useSemanticSearch)}
                 disabled={loading} // Disable toggle while searching
             >
                 <Zap size={18} className=\"inline-block mr-1\"/> {useSemanticSearch ? 'Semantic ON' : 'Semantic OFF'}
             </button>
          </div>
        </form>

        {/* Add/Edit Form */}\
        <div className=\"mb-8 p-4 bg-neutral-700/50 rounded-lg\">
            <h3 className=\"text-xl font-semibold text-blue-300 mb-3\">{editingRecord ? 'Edit Knowledge Record' : 'Add New Knowledge'}</h3>
             <form onSubmit={editingRecord ? handleUpdateKnowledge : handleSaveKnowledge}>
                <div className=\"mb-4\">
                    <label htmlFor=\"question\" className=\"block text-neutral-300 text-sm font-semibold mb-2\">Question:</label>
                    <input
                        id=\"question\"
                        type=\"text\"
                        className=\"w-full p-2 rounded-md bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500\"
                        value={newQuestion}
                        onChange={(e) => setNewQuestion(e.target.value)}
                        placeholder=\"Enter question\"
                        disabled={isSaving}
                    />
                </div>
                <div className=\"mb-4\">
                    <label htmlFor=\"answer\" className=\"block text-neutral-300 text-sm font-semibold mb-2\">Answer:</label>
                     <textarea
                        id=\"answer\"
                        className=\"w-full p-2 rounded-md bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500\"
                        value={newAnswer}
                        onChange={(e) => setNewAnswer(e.target.value)}
                        placeholder=\"Enter answer (Markdown supported)\"
                        rows={6}
                        disabled={isSaving}
                     />
                </div>
                <div className=\"flex gap-4\">
                    <button
                        type=\"submit\"
                        className=\"px-6 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed\"
                        disabled={isSaving || !newQuestion.trim() || !newAnswer.trim()}
                    >
                        {isSaving ? <Loader2 size={18} className=\"animate-spin\"/> : (editingRecord ? <Save size={18} className=\"inline-block mr-1\"/> : <PlusCircle size={18} className=\"inline-block mr-1\"/>)}\
                        {isSaving ? (editingRecord ? 'Save Changes' : 'Save Knowledge') : (editingRecord ? 'Save Changes' : 'Save Knowledge')}\
                    </button>
                    {editingRecord && (
                        <button
                            type=\"button\"
                            onClick={() => { setEditingRecord(null); setNewQuestion(''); setNewAnswer(''); setError(null); }}\
                            className=\"px-6 py-2 bg-neutral-600 text-white font-semibold rounded-md hover:bg-neutral-700 transition\"\
                            disabled={isSaving}\
                        >
                            <XCircle size={18} className=\"inline-block mr-1\"/> Cancel Edit
                        </button>
                    )}
                </div>
           </form>
             {error && isSaving === false && ( // Show save/update error only after it finishes
                 <p className=\"text-red-400 text-sm mt-4\">Error: {error}</p>
             )}\
        </div>

        {/* New: Graph View Toggle and Filter */}\
        <div className=\"mb-8 p-4 bg-neutral-700/50 rounded-lg\">
             <div className=\"flex justify-between items-center mb-4\">
                 <h3 className=\"text-xl font-semibold text-blue-300 flex items-center gap-2\"><GitBranch size={20}/> Knowledge Graph (智慧之樹)</h3>
                 <button
                     className={`px-6 py-3 rounded-md transition ${showGraph ? 'bg-blue-500 text-white' : 'bg-neutral-200 text-neutral-700 dark:bg-neutral-700 dark:text-neutral-300'} disabled:opacity-50 disabled:cursor-not-allowed`}
                     onClick={() => setShowGraph(!showGraph)}
                     disabled={loading} // Disable toggle while loading
                 >
                     {showGraph ? 'Hide Graph View' : 'Show Graph View'}
                 </button>
             </div>
             {showGraph && (
                 <div className=\"mt-4\">
                     <label htmlFor=\"sourceFilter\" className=\"block text-neutral-300 text-sm font-semibold mb-2\">Filter by Source:</label>
                     <select
                         id=\"sourceFilter\"
                         className=\"p-2 rounded-md bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500\"
                         value={graphSourceFilter}
                         onChange={(e) => setGraphSourceFilter(e.target.value)}
                         disabled={loading} // Disable filter while loading
                     >
                         <option value=\"\">All Sources</option>
                         {availableSources.map(source => (
                             <option key={source} value={source}>{source}</option>
                         ))}
                     </select>
                 </div>
             )}\
        </div>
        {/* End New */}\

        {/* Knowledge List or Graph View */}\
        {showGraph ? (
             // --- New: Render KnowledgeGraphViewer when showGraph is true ---\
             <div className=\"p-4 bg-neutral-700/50 rounded-lg\">
                 {/* Pass the current user ID and source filter to the graph viewer */}\
                 {systemContext?.currentUser?.id && <KnowledgeGraphViewer userId={systemContext.currentUser.id} sourceFilter={graphSourceFilter} />}
             </div>
             // --- End New ---\
        ) : (
             // --- Existing Knowledge List --- (Show when showGraph is false)\
             <div className=\"p-4 bg-neutral-700/50 rounded-lg\">
                 <h3 className=\"text-xl font-semibold text-blue-300 mb-3\">
                     {searchTerm ? `Search Results for \"${searchTerm}\"` : 'All Knowledge Records'}
                 </h3>
                 {loading && !isSaving ? ( // Show loading only if not currently saving/updating
                   <p className=\"text-neutral-400\">Loading knowledge records...</p>
                 ) : error && !editingRecord && !isSaving ? ( // Show main error if not in create/edit mode
                   <p className=\"text-red-400\">Error: {error}</p>
                 ) : knowledgeRecords.length === 0 ? (
                   <p className=\"text-neutral-400\">{searchTerm ? 'No records found matching your search.' : 'No records in the knowledge base yet.'}</p>
                 ) : (
                   <ul className=\"space-y-4\">
                     {knowledgeRecords.map((record) => (
                       <li key={record.id} className=\"bg-neutral-600/50 p-4 rounded-md border-l-4 border-blue-500\">
                         <div className=\"flex justify-between items-center\">
                             <h4 className=\"font-semibold text-blue-200 mb-1\">Q: {record.question}</h4>
                              <button onClick={() => toggleExpandRecord(record.id)} className=\"text-neutral-400 hover:text-white transition\">
                                 {expandedRecords[record.id] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}\
                             </button>
                         </div>
                         {/* Answer (Collapsible) */}\
                         {expandedRecords[record.id] && ((\
                              <div className=\"mt-2 border-t border-neutral-600 pt-2\">
                                  <div className=\"text-neutral-300 text-sm prose prose-invert max-w-none\"> {/* Use prose for markdown styling */}\
                                      <ReactMarkdown>{record.answer}</ReactMarkdown>
                                  </div>
                              </div>
                         ))}\
                         <small className=\"text-neutral-400 text-xs block mt-2\">
                             ID: {record.id} | Created: {new Date(record.timestamp).toLocaleString()}
                              {record.source && ` | Source: ${record.source}`}
                              {record.dev_log_details && ` | Dev Log Type: ${record.dev_log_details.type}`}
                         </small>

                         {/* New: Relations Display */}\
                         {expandedRecords[record.id] && record.relations && record.relations.length > 0 && ((\
                             <div className=\"mt-4 border-t border-neutral-600 pt-4\">
                                 <h5 className=\"text-neutral-300 text-sm font-semibold mb-2\">Relations:</h5>
                                 <ul className=\"space-y-2\">
                                     {record.relations.map(relation => (
                                         <li key={relation.id} className=\"p-2 bg-neutral-700/50 rounded-md text-neutral-300 text-xs flex justify-between items-center\">
                                             <span>
                                                 {relation.source_record_id === record.id ? '->' : '<-'} {relation.relation_type} {relation.source_record_id === record.id ? 'to' : 'from'} {relation.source_record_id === record.id ? relation.target_record_id : relation.source_record_id}
                                             </span>
                                              {/* Delete Relation Button */}\
                                             <button
                                                 className=\"px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed\"
                                                 onClick={() => handleDeleteRelation(relation.id)}
                                                 disabled={isSavingRelation} // Disable while saving any relation
                                             >
                                                 <Trash2 size={12} className=\"inline-block mr-1\"/> Delete
                                             </button>
                                         </li>
                                     ))}\
                                 </ul>
                             </div>
                         ))}\
                         {/* End New */}\

                         {/* Record Actions */}\
                         <div className=\"mt-3 flex gap-2\">
                             <button
                                 className=\"px-3 py-1 text-xs bg-yellow-600 text-white rounded hover:bg-yellow-700 transition\"
                                 onClick={() => handleEditClick(record)}\
                                 disabled={isSaving}\
                             >
                                 <Edit size={16} className=\"inline-block mr-1\"/> Edit
                             </button>
                              <button
                                 className=\"px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed\"
                                 onClick={() => handleDeleteKnowledge(record.id)}\
                                 disabled={isSaving}\
                             >
                                 <Trash2 size={16} className=\"inline-block mr-1\"/> Delete
                             </button>
                              {/* TODO: Add Copy button (Part of 權能鍛造: 觀察 - record action) */}\
                         </div>
                       </li>
                     ))}\
                   </ul>
                 )}\
             </div>
        )}\

        {/* New: Add Relation Modal */}\
        {showAddRelationModal && ((\
             <div className=\"fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50\">
                 <div className=\"bg-neutral-800 p-8 rounded-lg shadow-xl w-full max-w-md max-h-[90%] flex flex-col\"> {/* Added flex-col and max-height */}\
                     <div className=\"flex justify-between items-center mb-4\">
                         <h3 className=\"text-xl font-semibold text-blue-300\">Add Knowledge Relation</h3>
                         <button
                             type=\"button\"
                             onClick={handleCloseAddRelationModal}\
                             className=\"text-neutral-400 hover:text-white transition\"\
                             disabled={isSavingRelation}\
                         >
                             <XCircle size={24} />
                         </button>
                     </div>
                     <p className=\"text-neutral-300 text-sm mb-4\">Define a relationship between two knowledge records.</p>
                     <form onSubmit={handleCreateRelation} className=\"flex-grow flex flex-col overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-700 pr-2\"> {/* Added flex-grow, flex-col, overflow, pr-2 */}\
                         <div className=\"mb-4\">
                             <label htmlFor=\"sourceRecord\" className=\"block text-neutral-300 text-sm font-semibold mb-2\">Source Record:</label>
                             <select
                                 id=\"sourceRecord\"
                                 className=\"w-full p-2 rounded-md bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm\"
                                 value={selectedSourceRecordId}
                                 onChange={(e) => setSelectedSourceRecordId(e.target.value)}\
                                 disabled={isSavingRelation}\
                                 required
                             >
                                 <option value=\"\">-- Select Source Record --</option>
                                 {availableRecordsForRelation.map(record => (
                                     <option key={record.id} value={record.id}>{record.question.substring(0, 50)}... ({record.id.substring(0, 8)}...)</option>
                                 ))}\
                             </select>
                         </div>
                          <div className=\"mb-4\">
                             <label htmlFor=\"targetRecord\" className=\"block text-neutral-300 text-sm font-semibold mb-2\">Target Record:</label>
                             <select
                                 id=\"targetRecord\"
                                 className=\"w-full p-2 rounded-md bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm\"
                                 value={selectedTargetRecordId}
                                 onChange={(e) => setSelectedTargetRecordId(e.target.value)}\
                                 disabled={isSavingRelation}\
                                 required
                             >
                                 <option value=\"\">-- Select Target Record --</option>
                                 {availableRecordsForRelation.map(record => (
                                     <option key={record.id} value={record.id}>{record.question.substring(0, 50)}... ({record.id.substring(0, 8)}...)</option>
                                 ))}\
                             </select>
                         </div>
                          <div className=\"mb-4\">
                             <label htmlFor=\"relationType\" className=\"block text-neutral-300 text-sm font-semibold mb-2\">Relation Type:</label>
                             <select
                                 id=\"relationType\"
                                 className=\"w-full p-2 rounded-md bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm\"
                                 value={newRelationType}
                                 onChange={(e) => setNewRelationType(e.target.value as RelationType)}\
                                 disabled={isSavingRelation}\
                                 required
                             >
                                 {RELATION_TYPES.map(type => (
                                     <option key={type} value={type}>{type.replace(/_/g, ' ')}</option>
                                 ))}\
                             </select>
                         </div>
                         {/* TODO: Add input for relation details if needed */}\

                         {relationError && !isSavingRelation && ( // Show create error only after it finishes
                             <p className=\"text-red-400 text-sm mt-4\">Error: {relationError}</p>
                         )}\
                     </form>
                     <div className=\"flex gap-4 justify-end mt-4 flex-shrink-0\"> {/* Added flex-shrink-0 */}\
                         <button
                             type=\"button\"
                             onClick={handleCloseAddRelationModal}\
                             className=\"px-6 py-2 bg-neutral-600 text-white font-semibold rounded-md hover:bg-neutral-700 transition\"
                             disabled={isSavingRelation}\
                         >
                             Cancel
                         </button>
                         <button
                             type=\"submit\" form=\"create-relation-form\" // Link button to form by ID
                             className=\"px-6 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed\"
                             disabled={isSavingRelation || !selectedSourceRecordId || !selectedTargetRecordId || !newRelationType || selectedSourceRecordId === selectedTargetRecordId} // Disable if saving, fields empty, or source/target are same
                         >
                             {isSavingRelation ? 'Creating...' : 'Create Relation'}
                         </button>
                     </div>
                 </div>
             </div>
        ))}\
        {/* End New */}\

      </div>
    </div>
  );
};

export default KnowledgeBase;
```