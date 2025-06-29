"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
""(templateObject_1 || (templateObject_1 = __makeTemplateObject(["typescript\n// src/pages/KnowledgeBase.tsx\n// Knowledge Base Page (\u6C38\u4E45\u8A18\u61B6)\n// Displays and manages user's personal knowledge base.\n// --- New: Add UI for listing and managing knowledge records ---\n// --- New: Add UI for creating, editing, and deleting records ---\n// --- New: Add Realtime Updates for knowledge_records ---\n// --- New: Add UI for searching knowledge records (keyword/semantic) ---\n// --- New: Add Knowledge Graph Visualization (using React Flow) ---\n// --- Modified: Add source filter for graph visualization ---\n// --- Modified: Integrate KnowledgeGraphViewer component ---\n// --- Modified: Add source filter UI for the graph ---\n// --- New: Add UI for managing Knowledge Relations ---\n// --- New: Add UI for creating, editing, and deleting Relations ---\n// --- New: Add Realtime Updates for knowledge_relations ---\n\n\nimport React, { useEffect, useState, useCallback } from 'react'; // Import useCallback\nimport { KnowledgeSync } from '../modules/knowledgeSync'; // To fetch and manage records\nimport { AuthorityForgingEngine } from '../core/authority/AuthorityForgingEngine'; // Import AuthorityForgingEngine\nimport { KnowledgeGraphService } from '../core/wisdom/KnowledgeGraphService'; // To manage relations\nimport { KnowledgeRecord, KnowledgeRelation } from '../interfaces'; // Import interfaces, KnowledgeRelation\nimport ReactMarkdown from 'react-markdown'; // For rendering markdown\nimport { Loader2, Edit, Trash2, ChevronDown, ChevronUp, PlusCircle, Save, XCircle, Search, Zap, GitBranch, Link as LinkIcon, Unlink } from 'lucide-react'; // Import icons including GitBranch, Link, Unlink\n// --- New: Import KnowledgeGraphViewer component ---import KnowledgeGraphViewer from '../components/KnowledgeGraphViewer';\n// --- End New ---\n\n// Access core modules from the global window object (for MVP simplicity)\n// In a real app, use React Context or dependency injection\ndeclare const window: any;\nconst knowledgeSync: KnowledgeSync = window.systemContext?.knowledgeSync; // Interacts with MemoryEngine (\u6C38\u4E45\u8A18\u61B6)\nconst authorityForgingEngine: any = window.systemContext?.authorityForgingEngine; // Use any for action recording (\u6B0A\u80FD\u935B\u9020)\nconst knowledgeGraphService: KnowledgeGraphService = window.systemContext?.knowledgeGraphService; // The Knowledge Graph Service\nconst systemContext: any = window.systemContext; // Access the full context for currentUser\n\n\n// Define available relation types (example)\nconst RELATION_TYPES = ['related', 'prerequisite', 'follow-up', 'contradicts', 'supports', 'example', 'derived_from'] as const;\ntype RelationType = typeof RELATION_TYPES[number];\n\n\nconst KnowledgeBase: React.FC = () => {\n  const [knowledgeRecords, setKnowledgeRecords] = useState<KnowledgeRecord[]>([]);\n  const [loading, setLoading] = useState(true);\n  const [error, setError] = useState<string | null>(null);\n  const [searchTerm, setSearchTerm] = useState('');\n  const [newQuestion, setNewQuestion] = useState('');\n  const [newAnswer, setNewAnswer] = useState('');\n  const [isSaving, setIsSaving] = useState(false);\n  const [editingRecord, setEditingRecord] = useState<KnowledgeRecord | null>(null);\n  const [expandedRecords, setExpandedRecords] = useState<Record<string, boolean>>({}); // State to track expanded records\n  const [useSemanticSearch, setUseSemanticSearch] = useState(false); // State to toggle semantic search\n  // --- New: State to toggle graph view ---  const [showGraph, setShowGraph] = useState(false);\n  // --- End New ---  // --- New: State for source filter in graph view ---  const [graphSourceFilter, setGraphSourceFilter] = useState<string>('');\n  const [availableSources, setAvailableSources] = useState<string[]>([]); // List of unique sources for filter\n  // --- End New ---\n  // --- New: State for managing relations ---  const [showAddRelationModal, setShowAddRelationModal] = useState(false);\n  const [availableRecordsForRelation, setAvailableRecordsForRelation] = useState<KnowledgeRecord[]>([]); // Records available to link\n  const [selectedSourceRecordId, setSelectedSourceRecordId] = useState<string | ''>(''); // Source record for new relation\n  const [selectedTargetRecordId, setSelectedTargetRecordId] = useState<string | ''>(''); // Target record for new relation\n  const [newRelationType, setNewRelationType] = useState<RelationType>('related'); // Type for new relation\n  const [isSavingRelation, setIsSavingRelation] = useState(false);\n  const [relationError, setRelationError] = useState<string | null>(null); // Error specific to relations\n  // --- End New ---\n\n  const fetchKnowledge = async (query = '', useSemantic = false) => {\n     const userId = systemContext?.currentUser?.id;\n     if (!knowledgeSync || !userId) {\n        setError(\"KnowledgeSync module not initialized or user not logged in.\");\n        setLoading(false);\n        return;\n    }\n    setLoading(true);\n    setError(null);\n    try {\n      // Uses MemoryEngine via KnowledgeSync\n      const records = query\n        ? await knowledgeSync.searchKnowledge(query, userId, useSemantic) // Pass userId and useSemantic\n        : await knowledgeSync.getAllKnowledgeForUser(userId); // Fetch all if no search term, pass userId\n\n      // --- New: Fetch relations for each record ---      // This is inefficient for a large number of records. A better approach is to fetch all relations\n      // and then map them to records client-side, or fetch relations only when a record is expanded.\n      // For MVP, let's fetch all relations and attach them to the records.\n      const relations = await knowledgeGraphService?.getRelations(userId) || [];\n      const recordsWithRelations = records.map(record => ({\n          ...record,\n          // Filter relations where this record is either source or target\n          relations: relations.filter(rel => rel.source_record_id === record.id || rel.target_record_id === record.id)\n      }));\n      setKnowledgeRecords(recordsWithRelations);\n      // --- End New ---\n\n      // --- New: Extract unique sources for filter dropdown ---      const sources = Array.from(new Set(records.map(record => record.source).filter(source => source !== undefined && source !== null)));\n      setAvailableSources(['', ...sources as string[]]); // Add empty option for 'All'\n      // --- End New ---\n    } catch (err: any) {\n      console.error('Error fetching knowledge:', err);\n      setError("], ["typescript\n// src/pages/KnowledgeBase.tsx\n// Knowledge Base Page (\u6C38\u4E45\u8A18\u61B6)\n// Displays and manages user's personal knowledge base.\n// --- New: Add UI for listing and managing knowledge records ---\n// --- New: Add UI for creating, editing, and deleting records ---\n// --- New: Add Realtime Updates for knowledge_records ---\n// --- New: Add UI for searching knowledge records (keyword/semantic) ---\n// --- New: Add Knowledge Graph Visualization (using React Flow) ---\n// --- Modified: Add source filter for graph visualization ---\n// --- Modified: Integrate KnowledgeGraphViewer component ---\n// --- Modified: Add source filter UI for the graph ---\n// --- New: Add UI for managing Knowledge Relations ---\n// --- New: Add UI for creating, editing, and deleting Relations ---\n// --- New: Add Realtime Updates for knowledge_relations ---\n\n\nimport React, { useEffect, useState, useCallback } from 'react'; // Import useCallback\nimport { KnowledgeSync } from '../modules/knowledgeSync'; // To fetch and manage records\nimport { AuthorityForgingEngine } from '../core/authority/AuthorityForgingEngine'; // Import AuthorityForgingEngine\nimport { KnowledgeGraphService } from '../core/wisdom/KnowledgeGraphService'; // To manage relations\nimport { KnowledgeRecord, KnowledgeRelation } from '../interfaces'; // Import interfaces, KnowledgeRelation\nimport ReactMarkdown from 'react-markdown'; // For rendering markdown\nimport { Loader2, Edit, Trash2, ChevronDown, ChevronUp, PlusCircle, Save, XCircle, Search, Zap, GitBranch, Link as LinkIcon, Unlink } from 'lucide-react'; // Import icons including GitBranch, Link, Unlink\n// --- New: Import KnowledgeGraphViewer component ---\\\nimport KnowledgeGraphViewer from '../components/KnowledgeGraphViewer';\n// --- End New ---\\\n\n\n// Access core modules from the global window object (for MVP simplicity)\n// In a real app, use React Context or dependency injection\ndeclare const window: any;\nconst knowledgeSync: KnowledgeSync = window.systemContext?.knowledgeSync; // Interacts with MemoryEngine (\u6C38\u4E45\u8A18\u61B6)\nconst authorityForgingEngine: any = window.systemContext?.authorityForgingEngine; // Use any for action recording (\u6B0A\u80FD\u935B\u9020)\nconst knowledgeGraphService: KnowledgeGraphService = window.systemContext?.knowledgeGraphService; // The Knowledge Graph Service\nconst systemContext: any = window.systemContext; // Access the full context for currentUser\n\n\n// Define available relation types (example)\nconst RELATION_TYPES = ['related', 'prerequisite', 'follow-up', 'contradicts', 'supports', 'example', 'derived_from'] as const;\ntype RelationType = typeof RELATION_TYPES[number];\n\n\nconst KnowledgeBase: React.FC = () => {\n  const [knowledgeRecords, setKnowledgeRecords] = useState<KnowledgeRecord[]>([]);\n  const [loading, setLoading] = useState(true);\n  const [error, setError] = useState<string | null>(null);\n  const [searchTerm, setSearchTerm] = useState('');\n  const [newQuestion, setNewQuestion] = useState('');\n  const [newAnswer, setNewAnswer] = useState('');\n  const [isSaving, setIsSaving] = useState(false);\n  const [editingRecord, setEditingRecord] = useState<KnowledgeRecord | null>(null);\n  const [expandedRecords, setExpandedRecords] = useState<Record<string, boolean>>({}); // State to track expanded records\n  const [useSemanticSearch, setUseSemanticSearch] = useState(false); // State to toggle semantic search\n  // --- New: State to toggle graph view ---\\\n  const [showGraph, setShowGraph] = useState(false);\n  // --- End New ---\\\n  // --- New: State for source filter in graph view ---\\\n  const [graphSourceFilter, setGraphSourceFilter] = useState<string>('');\n  const [availableSources, setAvailableSources] = useState<string[]>([]); // List of unique sources for filter\n  // --- End New ---\\\n\n  // --- New: State for managing relations ---\\\n  const [showAddRelationModal, setShowAddRelationModal] = useState(false);\n  const [availableRecordsForRelation, setAvailableRecordsForRelation] = useState<KnowledgeRecord[]>([]); // Records available to link\n  const [selectedSourceRecordId, setSelectedSourceRecordId] = useState<string | ''>(''); // Source record for new relation\n  const [selectedTargetRecordId, setSelectedTargetRecordId] = useState<string | ''>(''); // Target record for new relation\n  const [newRelationType, setNewRelationType] = useState<RelationType>('related'); // Type for new relation\n  const [isSavingRelation, setIsSavingRelation] = useState(false);\n  const [relationError, setRelationError] = useState<string | null>(null); // Error specific to relations\n  // --- End New ---\\\n\n\n  const fetchKnowledge = async (query = '', useSemantic = false) => {\n     const userId = systemContext?.currentUser?.id;\n     if (!knowledgeSync || !userId) {\n        setError(\\\"KnowledgeSync module not initialized or user not logged in.\\\");\n        setLoading(false);\n        return;\n    }\n    setLoading(true);\n    setError(null);\n    try {\n      // Uses MemoryEngine via KnowledgeSync\n      const records = query\n        ? await knowledgeSync.searchKnowledge(query, userId, useSemantic) // Pass userId and useSemantic\n        : await knowledgeSync.getAllKnowledgeForUser(userId); // Fetch all if no search term, pass userId\n\n      // --- New: Fetch relations for each record ---\\\n      // This is inefficient for a large number of records. A better approach is to fetch all relations\n      // and then map them to records client-side, or fetch relations only when a record is expanded.\n      // For MVP, let's fetch all relations and attach them to the records.\n      const relations = await knowledgeGraphService?.getRelations(userId) || [];\n      const recordsWithRelations = records.map(record => ({\n          ...record,\n          // Filter relations where this record is either source or target\n          relations: relations.filter(rel => rel.source_record_id === record.id || rel.target_record_id === record.id)\n      }));\n      setKnowledgeRecords(recordsWithRelations);\n      // --- End New ---\\\n\n\n      // --- New: Extract unique sources for filter dropdown ---\\\n      const sources = Array.from(new Set(records.map(record => record.source).filter(source => source !== undefined && source !== null)));\n      setAvailableSources(['', ...sources as string[]]); // Add empty option for 'All'\n      // --- End New ---\\\n\n    } catch (err: any) {\n      console.error('Error fetching knowledge:', err);\n      setError("])));
Failed;
to;
load;
knowledge;
records: $;
{
    err.message;
}
");\n    } finally {\n      setLoading(false);\n    }\n  };\n\n  useEffect(() => {\n    // Fetch data when the component mounts or when the user changes or filters change\n    if (systemContext?.currentUser?.id) {\n        fetchKnowledge(searchTerm, useSemanticSearch); // Fetch with current search term and semantic toggle state\n    }\n\n    // --- New: Subscribe to realtime updates for knowledge_records and knowledge_relations ---    let unsubscribeRecordInsert: (() => void) | undefined;\n    let unsubscribeRecordUpdate: (() => void) | undefined;\n    let unsubscribeRecordDelete: (() => void) | undefined;\n    let unsubscribeRelationInsert: (() => void) | undefined;\n    let unsubscribeRelationUpdate: (() => void) | undefined;\n    let unsubscribeRelationDelete: (() => void) | undefined;\n\n\n    if (knowledgeSync?.context?.eventBus && knowledgeGraphService?.context?.eventBus) { // Check if services and their EventBuses are available\n        const eventBus = knowledgeSync.context.eventBus; // Assuming both services use the same EventBus instance\n        const userId = systemContext?.currentUser?.id;\n\n        // Subscribe to knowledge record events (refetch all to update list and relations)\n        unsubscribeRecordInsert = eventBus.subscribe('knowledge_record_insert', (payload: KnowledgeRecord) => {\n            if (payload.user_id === userId) {\n                console.log('KnowledgeBase received knowledge_record_insert event:', payload);\n                fetchKnowledge(searchTerm, useSemanticSearch); // Refetch all data\n            }\n        });\n\n        unsubscribeRecordUpdate = eventBus.subscribe('knowledge_record_update', (payload: KnowledgeRecord) => {\n             if (payload.user_id === userId) {\n                 console.log('KnowledgeBase received knowledge_record_update event:', payload);\n                 fetchKnowledge(searchTerm, useSemanticSearch); // Refetch all data\n             }\n         });\n\n        unsubscribeRecordDelete = eventBus.subscribe('knowledge_record_delete', (payload: { id: string, userId: string }) => {\n             if (payload.userId === userId) {\n                 console.log('KnowledgeBase received knowledge_record_delete event:', payload);\n                 fetchKnowledge(searchTerm, useSemanticSearch); // Refetch all data\n             }\n         });\n\n        // Subscribe to knowledge relation events (refetch all to update relations displayed with records)\n        unsubscribeRelationInsert = eventBus.subscribe('knowledge_relation_insert', (payload: KnowledgeRelation) => {\n             if (payload.user_id === userId) {\n                 console.log('KnowledgeBase received knowledge_relation_insert event:', payload);\n                 fetchKnowledge(searchTerm, useSemanticSearch); // Refetch all data\n             }\n         });\n\n         unsubscribeRelationUpdate = eventBus.subscribe('knowledge_relation_update', (payload: KnowledgeRelation) => {\n             if (payload.user_id === userId) {\n                 console.log('KnowledgeBase received knowledge_relation_update event:', payload);\n                 fetchKnowledge(searchTerm, useSemanticSearch); // Refetch all data\n             }\n         });\n\n          unsubscribeRelationDelete = eventBus.subscribe('knowledge_relation_delete', (payload: { relationId: string, userId: string }) => {\n             if (payload.userId === userId) {\n                 console.log('KnowledgeBase received knowledge_relation_delete event:', payload);\n                 fetchKnowledge(searchTerm, useSemanticSearch); // Refetch all data\n             }\n         });\n    }\n    // --- End New ---\n\n    return () => {\n        // Unsubscribe on component unmount\n        unsubscribeRecordInsert?.();\n        unsubscribeRecordUpdate?.();\n        unsubscribeRecordDelete?.();\n        unsubscribeRelationInsert?.();\n        unsubscribeRelationUpdate?.();\n        unsubscribeRelationDelete?.();\n    };\n\n  }, [searchTerm, systemContext?.currentUser?.id, knowledgeSync, useSemanticSearch, knowledgeGraphService]); // Refetch when search term, user, services, or semantic toggle changes\n\n\n  const handleSearch = (e: React.FormEvent) => {\n    e.preventDefault();\n     const userId = systemContext?.currentUser?.id;\n     if (!userId) return; // Should be protected by route, but safety check\n\n    // searchTerm state update already triggers fetch via useEffect\n     // Simulate recording user action (Part of \u6B0A\u80FD\u935B\u9020 / \u516D\u5F0F\u5967\u7FA9: \u89C0\u5BDF)\n    authorityForgingEngine?.recordAction({\n        type: 'web:kb:search',\n        details: { query: searchTerm, useSemantic: useSemanticSearch },\n        context: { platform: 'web', page: 'knowledge' },\n        user_id: userId, // Associate action with user\n    });\n  };\n\n  const handleSaveKnowledge = async (e: React.FormEvent) => {\n      e.preventDefault();\n       const userId = systemContext?.currentUser?.id;\n       if (!knowledgeSync || !userId) {\n            setError(\"KnowledgeSync module not initialized or user not logged in.\");\n            return;\n        }\n      if (!newQuestion.trim() || !newAnswer.trim()) {\n          alert('Please enter both question and answer.');\n          return;\n      }\n\n      setIsSaving(true);\n      setError(null);\n      try {\n          // Uses MemoryEngine via KnowledgeSync\n          const savedRecord = await knowledgeSync.saveKnowledge(newQuestion, newAnswer, userId); // Pass userId\n          if (savedRecord) {\n              console.log('New record saved:', savedRecord);\n              setNewQuestion('');\n              setNewAnswer('');\n              // Refetch data is now handled by realtime listener\n               // Simulate recording user action (Part of \u6B0A\u80FD\u935B\u9020 / \u516D\u5F0F\u5967\u7FA9: \u89C0\u5BDF)\n                authorityForgingEngine?.recordAction({\n                    type: 'web:kb:save',\n                    details: { recordId: savedRecord.id, question: savedRecord.question },\n                    context: { platform: 'web', page: 'knowledge' },\n                    user_id: userId, // Associate action with user\n                });\n          } else {\n               setError('Failed to save knowledge record.');\n          }\n      } catch (err: any) {\n          console.error('Error saving knowledge:', err);\n          setError(";
Failed;
to;
save;
knowledge;
record: $;
{
    err.message;
}
");\n      } finally {\n          setIsSaving(false);\n      }\n  };\n\n  const handleEditClick = (record: KnowledgeRecord) => {\n      setEditingRecord(record);\n      setNewQuestion(record.question);\n      setNewAnswer(record.answer);\n  };\n\n  const handleUpdateKnowledge = async (e: React.FormEvent) => {\n      e.preventDefault();\n       const userId = systemContext?.currentUser?.id;\n      if (!knowledgeSync || !editingRecord || !userId) return; // Safety checks\n\n      if (!newQuestion.trim() || !newAnswer.trim()) {\n          alert('Please enter both question and answer.');\n          return;\n      }\n\n      setIsSaving(true);\n      setError(null);\n      try {\n          // Uses MemoryEngine via KnowledgeSync\n          const updatedRecord = await knowledgeSync.updateKnowledge(editingRecord.id, {\n              question: newQuestion,\n              answer: newAnswer,\n          }, userId); // Pass userId\n          if (updatedRecord) {\n              console.log('Record updated:', updatedRecord);\n              setEditingRecord(null);\n              setNewQuestion('');\n              setNewAnswer('');\n              // Refetch data is now handled by realtime listener\n               // Simulate recording user action (Part of \u6B0A\u80FD\u935B\u9020 / \u516D\u5F0F\u5967\u7FA9: \u89C0\u5BDF)\n                authorityForgingEngine?.recordAction({\n                    type: 'web:kb:update',\n                    details: { recordId: updatedRecord.id, question: updatedRecord.question },\n                    context: { platform: 'web', page: 'knowledge' },\n                    user_id: userId, // Associate action with user\n                });\n          } else {\n              setError('Failed to update knowledge record.');\n          }\n      } catch (err: any) {\n          console.error('Error updating knowledge:', err);\n          setError(";
Failed;
to;
update;
knowledge;
record: $;
{
    err.message;
}
");\n      } finally {\n          setIsSaving(false);\n      }\n  };\n\n  const handleDeleteKnowledge = async (recordId: string) => {\n       const userId = systemContext?.currentUser?.id;\n       if (!knowledgeSync || !userId || !confirm(";
Are;
you;
sure;
you;
want;
to;
delete record;
$;
{
    recordId;
}
")) return; // Safety checks\n\n       setError(null);\n       try {\n           // Uses MemoryEngine via KnowledgeSync\n           const success = await knowledgeSync.deleteKnowledge(recordId, userId); // Pass userId\n           if (success) {\n               console.log('Record deleted:', recordId);\n               // State update handled by realtime listener\n                alert('Knowledge record deleted successfully!');\n                 // Simulate recording user action (Part of \u6B0A\u80FD\u935B\u9020 / \u516D\u5F0F\u5967\u7FA9: \u89C0\u5BDF)\n                authorityForgingEngine?.recordAction({\n                    type: 'web:kb:delete',\n                    details: { recordId: recordId },\n                    context: { platform: 'web', page: 'knowledge' },\n                    user_id: userId, // Associate action with user\n                });\n           } else {\n               setError('Failed to delete knowledge record.');\n           }\n       } catch (err: any) {\n           console.error('Error deleting knowledge:', err);\n           setError(";
Failed;
to;
delete knowledge;
record: $;
{
    err.message;
}
");\n       }\n  };\n\n   const toggleExpandRecord = (recordId: string) => {\n       setExpandedRecords(prevState => ({\n           ...prevState,\n           [recordId]: !prevState[recordId]\n       }));\n   };\n\n    // --- New: Handle Add Relation ---    const handleOpenAddRelationModal = () => {\n        setShowAddRelationModal(true);\n        setSelectedSourceRecordId('');\n        setSelectedTargetRecordId('');\n        setNewRelationType('related');\n        setRelationError(null);\n        // Populate available records list (all current records)\n        setAvailableRecordsForRelation(knowledgeRecords);\n    };\n\n    const handleCloseAddRelationModal = () => {\n        setShowAddRelationModal(false);\n        setSelectedSourceRecordId('');\n        setSelectedTargetRecordId('');\n        setNewRelationType('related');\n        setRelationError(null);\n        setAvailableRecordsForRelation([]); // Clear list\n    };\n\n    const handleCreateRelation = async (e: React.FormEvent) => {\n        e.preventDefault();\n        const userId = systemContext?.currentUser?.id;\n        if (!knowledgeGraphService || !userId || !selectedSourceRecordId || !selectedTargetRecordId || !newRelationType) {\n            setRelationError(\"KnowledgeGraphService module not initialized, user not logged in, or required fields are empty.\");\n            return;\n        }\n\n        setIsSavingRelation(true);\n        setRelationError(null);\n        try {\n            // Create the relation\n            const createdRelation = await knowledgeGraphService.createRelation(selectedSourceRecordId, selectedTargetRecordId, newRelationType, userId); // Pass sourceId, targetId, type, userId\n\n            if (createdRelation) {\n                alert(";
Relation;
created;
successfully: $;
{
    createdRelation.source_record_id;
}
- > $;
{
    createdRelation.target_record_id;
}
($);
{
    createdRelation.relation_type;
}
");\n                console.log('Created new relation:', createdRelation);\n                handleCloseAddRelationModal(); // Close modal\n                // State update handled by realtime listener\n                 // Simulate recording user action\n                authorityForgingEngine?.recordAction({\n                    type: 'web:kb:create_relation',\n                    details: { relationId: createdRelation.id, source: createdRelation.source_record_id, target: createdRelation.target_record_id, type: createdRelation.relation_type },\n                    context: { platform: 'web', page: 'knowledge' },\n                    user_id: userId, // Associate action with user\n                });\n            } else {\n                setRelationError('Failed to create relation.');\n            }\n        } catch (err: any) {\n            console.error('Error creating relation:', err);\n            setRelationError(";
Failed;
to;
create;
relation: $;
{
    err.message;
}
");\n        } finally {\n            setIsSavingRelation(false);\n        }\n    };\n\n    const handleDeleteRelation = async (relationId: string) => {\n        const userId = systemContext?.currentUser?.id;\n        if (!knowledgeGraphService || !userId) {\n            alert(\"KnowledgeGraphService module not initialized or user not logged in.\");\n            return;\n        }\n        if (!confirm(";
Are;
you;
sure;
you;
want;
to;
delete this;
relation ? ")) return;\n\n        setError(null); // Clear main error\n        try {\n            // Delete the relation\n            const success = await knowledgeGraphService.deleteRelation(relationId, userId); // Pass relationId and userId\n\n            if (success) {\n                console.log('Relation deleted:', relationId);\n                // State update handled by realtime listener\n                 alert('Relation deleted successfully!');\n                 // Simulate recording user action\n                authorityForgingEngine?.recordAction({\n                    type: 'web:kb:delete_relation',\n                    details: { relationId },\n                    context: { platform: 'web', page: 'knowledge' },\n                    user_id: userId, // Associate action with user\n                });\n            } else {\n                setError('Failed to delete relation.');\n                alert('Failed to delete relation.');\n            }\n        } catch (err: any) {\n            console.error('Error deleting relation:', err);\n            setError(" : ;
Failed;
to;
delete relation;
$;
{
    err.message;
}
");\n            alert(";
Failed;
to;
delete relation;
$;
{
    err.message;
}
");\n        }\n    };\n    // --- End New ---\n\n   // Ensure user is logged in before rendering content\n  if (!systemContext?.currentUser) {\n       // This case should ideally be handled by ProtectedRoute, but as a fallback:\n       return (\n            <div className=\"container mx-auto p-4 flex justify-center\">\n               <div className=\"bg-neutral-800/50 p-8 rounded-lg shadow-xl w-full max-w-md text-center text-neutral-300\">\n                   <p>Please log in to view your knowledge base.</p>\n               </div>\n            </div>\n       );\n  }\n\n\n  return (\n    <div className=\"container mx-auto p-4\">\n      <div className=\"bg-neutral-800/50 p-6 rounded-lg shadow-xl\">\n        <h2 className=\"text-3xl font-bold text-blue-400 mb-6\">Knowledge Base (\u6C38\u4E45\u8A18\u61B6)</h2>\n        <p className=\"text-neutral-300 mb-8\">Store, search, and manage your knowledge records. This is a core part of your OmniKey's memory.</p>\n\n        {/* Search Form */}\n        <form onSubmit={handleSearch} className=\"mb-8 p-4 bg-neutral-700/50 rounded-lg\">\n          <h3 className=\"text-xl font-semibold text-blue-300 mb-3\">Search Knowledge</h3>\n          <div className=\"flex gap-4 items-center\">\n            <input\n              id=\"search\"\n              type=\"text\"\n              className=\"flex-grow p-2 rounded-md bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500\"\n              value={searchTerm}\n              onChange={(e) => setSearchTerm(e.target.value)}\n              placeholder=\"Search questions or answers...\"\n              disabled={loading} // Disable search button while loading\n            />\n            <button\n              type=\"submit\"\n              className=\"px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed\"\n              disabled={loading} // Disable search button while loading\n            >\n              {loading ? <Loader2 size={18} className=\"animate-spin\"/> : <Search size={18} className=\"inline-block mr-1\"/>)}\n              Search\n            </button>\n             {searchTerm && (\n                <button\n                    type=\"button\"\n                    onClick={() => setSearchTerm('')}\n                    className=\"px-6 py-2 bg-neutral-600 text-white font-semibold rounded-md hover:bg-neutral-700 transition\"\n                    disabled={loading}\n                >\n                    Clear\n                </button>\n             )}\n             {/* Semantic Search Toggle */}\n             <button\n                 type=\"button\"\n                 className={";
text - sm;
font - semibold;
px - 3;
py - 2;
rounded - md;
transition;
disabled: opacity - 50;
disabled: cursor - not - allowed;
$;
{
    useSemanticSearch ? 'bg-blue-500 text-white' : 'bg-neutral-200 text-neutral-700 dark:bg-neutral-700 dark:text-neutral-300';
}
"}\n                 onClick={() => setUseSemanticSearch(!useSemanticSearch)}\n                 disabled={loading} // Disable toggle while searching\n             >\n                 <Zap size={18} className=\"inline-block mr-1\"/> {useSemanticSearch ? 'Semantic ON' : 'Semantic OFF'}\n             </button>\n          </div>\n        </form>\n\n        {/* Add/Edit Form */}        <div className=\"mb-8 p-4 bg-neutral-700/50 rounded-lg\">\n            <h3 className=\"text-xl font-semibold text-blue-300 mb-3\">{editingRecord ? 'Edit Knowledge Record' : 'Add New Knowledge'}</h3>\n             <form onSubmit={editingRecord ? handleUpdateKnowledge : handleSaveKnowledge}>\n                <div className=\"mb-4\">\n                    <label htmlFor=\"question\" className=\"block text-neutral-300 text-sm font-semibold mb-2\">Question:</label>\n                    <input\n                        id=\"question\"\n                        type=\"text\"\n                        className=\"w-full p-2 rounded-md bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500\"\n                        value={newQuestion}\n                        onChange={(e) => setNewQuestion(e.target.value)}\n                        placeholder=\"Enter question\"\n                        disabled={isSaving}\n                    />\n                </div>\n                <div className=\"mb-4\">\n                    <label htmlFor=\"answer\" className=\"block text-neutral-300 text-sm font-semibold mb-2\">Answer:</label>\n                     <textarea\n                        id=\"answer\"\n                        className=\"w-full p-2 rounded-md bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500\"\n                        value={newAnswer}\n                        onChange={(e) => setNewAnswer(e.target.value)}\n                        placeholder=\"Enter answer (Markdown supported)\"\n                        rows={6}\n                        disabled={isSaving}\n                     />\n                </div>\n                <div className=\"flex gap-4\">\n                    <button\n                        type=\"submit\"\n                        className=\"px-6 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed\"\n                        disabled={isSaving || !newQuestion.trim() || !newAnswer.trim()}\n                    >\n                        {isSaving ? <Loader2 size={18} className=\"animate-spin\"/> : (editingRecord ? <Save size={18} className=\"inline-block mr-1\"/> : <PlusCircle size={18} className=\"inline-block mr-1\"/>)}                        {isSaving ? (editingRecord ? 'Save Changes' : 'Save Knowledge') : (editingRecord ? 'Save Changes' : 'Save Knowledge')}                    </button>\n                    {editingRecord && (\n                        <button\n                            type=\"button\"\n                            onClick={() => { setEditingRecord(null); setNewQuestion(''); setNewAnswer(''); setError(null); }}                            className=\"px-6 py-2 bg-neutral-600 text-white font-semibold rounded-md hover:bg-neutral-700 transition\"                            disabled={isSaving}                        >\n                            <XCircle size={18} className=\"inline-block mr-1\"/> Cancel Edit\n                        </button>\n                    )}\n                </div>\n           </form>\n             {error && isSaving === false && ( // Show save/update error only after it finishes\n                 <p className=\"text-red-400 text-sm mt-4\">Error: {error}</p>\n             )}        </div>\n\n        {/* New: Graph View Toggle and Filter */}        <div className=\"mb-8 p-4 bg-neutral-700/50 rounded-lg\">\n             <div className=\"flex justify-between items-center mb-4\">\n                 <h3 className=\"text-xl font-semibold text-blue-300 flex items-center gap-2\"><GitBranch size={20}/> Knowledge Graph (\u667A\u6167\u4E4B\u6A39)</h3>\n                 <button\n                     className={";
px - 6;
py - 3;
rounded - md;
transition;
$;
{
    showGraph ? 'bg-blue-500 text-white' : 'bg-neutral-200 text-neutral-700 dark:bg-neutral-700 dark:text-neutral-300';
}
disabled: opacity - 50;
disabled: cursor - not - allowed(templateObject_2 || (templateObject_2 = __makeTemplateObject(["}\n                     onClick={() => setShowGraph(!showGraph)}\n                     disabled={loading} // Disable toggle while loading\n                 >\n                     {showGraph ? 'Hide Graph View' : 'Show Graph View'}\n                 </button>\n             </div>\n             {showGraph && (\n                 <div className=\"mt-4\">\n                     <label htmlFor=\"sourceFilter\" className=\"block text-neutral-300 text-sm font-semibold mb-2\">Filter by Source:</label>\n                     <select\n                         id=\"sourceFilter\"\n                         className=\"p-2 rounded-md bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500\"\n                         value={graphSourceFilter}\n                         onChange={(e) => setGraphSourceFilter(e.target.value)}\n                         disabled={loading} // Disable filter while loading\n                     >\n                         <option value=\"\">All Sources</option>\n                         {availableSources.map(source => (\n                             <option key={source} value={source}>{source}</option>\n                         ))}\n                     </select>\n                 </div>\n             )}        </div>\n        {/* End New */}\n        {/* Knowledge List or Graph View */}        {showGraph ? (\n             // --- New: Render KnowledgeGraphViewer when showGraph is true ---             <div className=\"p-4 bg-neutral-700/50 rounded-lg\">\n                 {/* Pass the current user ID and source filter to the graph viewer */}                 {systemContext?.currentUser?.id && <KnowledgeGraphViewer userId={systemContext.currentUser.id} sourceFilter={graphSourceFilter} />}\n             </div>\n             // --- End New ---        ) : (\n             // --- Existing Knowledge List --- (Show when showGraph is false)             <div className=\"p-4 bg-neutral-700/50 rounded-lg\">\n                 <h3 className=\"text-xl font-semibold text-blue-300 mb-3\">\n                     {searchTerm ? "], ["}\n                     onClick={() => setShowGraph(!showGraph)}\n                     disabled={loading} // Disable toggle while loading\n                 >\n                     {showGraph ? 'Hide Graph View' : 'Show Graph View'}\n                 </button>\n             </div>\n             {showGraph && (\n                 <div className=\\\"mt-4\\\">\n                     <label htmlFor=\\\"sourceFilter\\\" className=\\\"block text-neutral-300 text-sm font-semibold mb-2\\\">Filter by Source:</label>\n                     <select\n                         id=\\\"sourceFilter\\\"\n                         className=\\\"p-2 rounded-md bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500\\\"\n                         value={graphSourceFilter}\n                         onChange={(e) => setGraphSourceFilter(e.target.value)}\n                         disabled={loading} // Disable filter while loading\n                     >\n                         <option value=\\\"\\\">All Sources</option>\n                         {availableSources.map(source => (\n                             <option key={source} value={source}>{source}</option>\n                         ))}\n                     </select>\n                 </div>\n             )}\\\n        </div>\n        {/* End New */}\\\n\n        {/* Knowledge List or Graph View */}\\\n        {showGraph ? (\n             // --- New: Render KnowledgeGraphViewer when showGraph is true ---\\\n             <div className=\\\"p-4 bg-neutral-700/50 rounded-lg\\\">\n                 {/* Pass the current user ID and source filter to the graph viewer */}\\\n                 {systemContext?.currentUser?.id && <KnowledgeGraphViewer userId={systemContext.currentUser.id} sourceFilter={graphSourceFilter} />}\n             </div>\n             // --- End New ---\\\n        ) : (\n             // --- Existing Knowledge List --- (Show when showGraph is false)\\\n             <div className=\\\"p-4 bg-neutral-700/50 rounded-lg\\\">\n                 <h3 className=\\\"text-xl font-semibold text-blue-300 mb-3\\\">\n                     {searchTerm ? "])));
Search;
Results;
for (; ; )
    ;
"${searchTerm}\"` : 'All Knowledge Records'};
h3 >
    { loading: loading } && !isSaving ? ( // Show loading only if not currently saving/updating
<p className/>) : ;
"text-neutral-400\">Loading knowledge records...</p>;
error && !editingRecord && !isSaving ? ( // Show main error if not in create/edit mode
<p className/>) : ;
"text-red-400\">Error: {error}</p>;
knowledgeRecords.length === 0 ? (<p className/>) : ;
"text-neutral-400\">{searchTerm ? 'No records found matching your search.' : 'No records in the knowledge base yet.'}</p>;
(<ul className/>);
"space-y-4\">;
{
    knowledgeRecords.map(function (record) { return (<li key={record.id} className/>); }, "bg-neutral-600/50 p-4 rounded-md border-l-4 border-blue-500\">
        < div, className = , "flex justify-between items-center\">
        < h4, className = , "font-semibold text-blue-200 mb-1\">Q: {record.question}</h4>
        < button, onClick = {}(), toggleExpandRecord(record.id));
}
className = ;
"text-neutral-400 hover:text-white transition\">;
{
    expandedRecords[record.id] ? <ChevronUp size={20}/> : <ChevronDown size={20}/>;
}
button >
;
div >
    { /* Answer (Collapsible) */};
{
    expandedRecords[record.id] && (());
    <div className/>;
    "mt-2 border-t border-neutral-600 pt-2\">
        < div;
    className = ;
    "text-neutral-300 text-sm prose prose-invert max-w-none\"> {/* Use prose for markdown styling */}\
                                      <ReactMarkdown>{record.answer}</ReactMarkdown>;
    div >
    ;
    div >
    ;
}
<small className/>;
"text-neutral-400 text-xs block mt-2\">;
ID: {
    record.id;
}
 | Created;
{
    new Date(record.timestamp).toLocaleString();
}
{
    record.source && " | Source: ".concat(record.source);
}
{
    record.dev_log_details && " | Dev Log Type: ".concat(record.dev_log_details.type);
}
small >
    { /* New: Relations Display */};
{
    expandedRecords[record.id] && record.relations && record.relations.length > 0 && (());
    <div className/>;
    "mt-4 border-t border-neutral-600 pt-4\">
        < h5;
    className = ;
    "text-neutral-300 text-sm font-semibold mb-2\">Relations:</h5>
        < ul;
    className = ;
    "space-y-2\">;
    {
        record.relations.map(function (relation) { return (<li key={relation.id} className/>); }, ("p-2 bg-neutral-700/50 rounded-md text-neutral-300 text-xs flex justify-between items-center\">), { relation: relation, : .source_record_id === record.id ? '->' : '<-' }, { relation: relation, : .relation_type }, { relation: relation, : .source_record_id === record.id ? 'to' : 'from' }, { relation: relation, : .source_record_id === record.id ? relation.target_record_id : relation.source_record_id }, span >
            { /* Delete Relation Button */}, <button className/>, "px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed\", onClick = {}(), handleDeleteRelation(relation.id));
    }
    disabled = { isSavingRelation: isSavingRelation } // Disable while saving any relation
        >
            <Trash2 size={12} className/>;
    "inline-block mr-1\"/> Delete;
    button >
    ;
    li >
    ;
}
ul >
;
div >
;
{ /* End New */ }
{ /* Record Actions */ }
<div className/>;
"mt-3 flex gap-2\">
    < button;
className = ;
"px-3 py-1 text-xs bg-yellow-600 text-white rounded hover:bg-yellow-700 transition\";
onClick = {}();
handleEditClick(record);
disabled = { isSaving: isSaving };
    >
        <Edit size={16} className/>;
"inline-block mr-1\"/> Edit;
button >
    <button className/>;
"px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed\";
onClick = {}();
handleDeleteKnowledge(record.id);
disabled = { isSaving: isSaving };
    >
        <Trash2 size={16} className/>;
"inline-block mr-1\"/> Delete;
button >
    { /* TODO: Add Copy button (Part of 權能鍛造: 觀察 - record action) */};
div >
;
li >
;
ul >
;
div >
;
{ /* New: Add Relation Modal */ }
{
    showAddRelationModal && (());
    <div className/>;
    "fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50\">
        < div;
    className = ;
    "bg-neutral-800 p-8 rounded-lg shadow-xl w-full max-w-md max-h-[90%] flex flex-col\"> {/* Added flex-col and max-height */}\
                     <div className=\"flex justify-between items-center mb-4\">
        < h3;
    className = ;
    "text-xl font-semibold text-blue-300\">Add Knowledge Relation</h3>
        < button;
    type = ;
    "button\";
    onClick = { handleCloseAddRelationModal: handleCloseAddRelationModal };
    className = ;
    "text-neutral-400 hover:text-white transition\"\
                             disabled={isSavingRelation}\
                         >
        < XCircle;
    size = { 24:  } /  >
    ;
    button >
    ;
    div >
        <p className/>;
    "text-neutral-300 text-sm mb-4\">Define a relationship between two knowledge records.</p>
        < form;
    onSubmit = { handleCreateRelation: handleCreateRelation };
    className = ;
    "flex-grow flex flex-col overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-700 pr-2\"> {/* Added flex-grow, flex-col, overflow, pr-2 */}\
                         <div className=\"mb-4\">
        < label;
    htmlFor = ;
    "sourceRecord\" className=\"block text-neutral-300 text-sm font-semibold mb-2\">Source Record:</label>
        < select;
    id = ;
    "sourceRecord\";
    className = ;
    "w-full p-2 rounded-md bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm\";
    value = { selectedSourceRecordId: selectedSourceRecordId };
    onChange = {}(e);
    setSelectedSourceRecordId(e.target.value);
}
disabled = { isSavingRelation: isSavingRelation };
required
    >
        <option value/>;
"\">-- Select Source Record --</option>;
{
    availableRecordsForRelation.map(function (record) { return (<option key={record.id} value={record.id}>{record.question.substring(0, 50)}... ({record.id.substring(0, 8)}...)</option>); });
}
select >
;
div >
    <div className/>;
"mb-4\">
    < label;
htmlFor = ;
"targetRecord\" className=\"block text-neutral-300 text-sm font-semibold mb-2\">Target Record:</label>
    < select;
id = ;
"targetRecord\";
className = ;
"w-full p-2 rounded-md bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm\";
value = { selectedTargetRecordId: selectedTargetRecordId };
onChange = {}(e);
setSelectedTargetRecordId(e.target.value);
disabled = { isSavingRelation: isSavingRelation };
required
    >
        <option value/>;
"\">-- Select Target Record --</option>;
{
    availableRecordsForRelation.map(function (record) { return (<option key={record.id} value={record.id}>{record.question.substring(0, 50)}... ({record.id.substring(0, 8)}...)</option>); });
}
select >
;
div >
    <div className/>;
"mb-4\">
    < label;
htmlFor = ;
"relationType\" className=\"block text-neutral-300 text-sm font-semibold mb-2\">Relation Type:</label>
    < select;
id = ;
"relationType\";
className = ;
"w-full p-2 rounded-md bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm\";
value = { newRelationType: newRelationType };
onChange = {}(e);
setNewRelationType(e.target.value);
disabled = { isSavingRelation: isSavingRelation };
required
    >
        { RELATION_TYPES: RELATION_TYPES, : .map(function (type) { return (<option key={type} value={type}>{type.replace(/_/g, ' ')}</option>); }) };
select >
;
div >
    { /* TODO: Add input for relation details if needed */};
{
    relationError && !isSavingRelation && ( // Show create error only after it finishes
    <p className/>);
    "text-red-400 text-sm mt-4\">Error: {relationError}</p>;
}
form >
    <div className/>;
"flex gap-4 justify-end mt-4 flex-shrink-0\"> {/* Added flex-shrink-0 */}\
                         <button;
type = ;
"button\";
onClick = { handleCloseAddRelationModal: handleCloseAddRelationModal };
className = ;
"px-6 py-2 bg-neutral-600 text-white font-semibold rounded-md hover:bg-neutral-700 transition\";
disabled = { isSavingRelation: isSavingRelation };
    >
        Cancel;
button >
    <button type/>;
"submit\" form=\"create-relation-form\" // Link button to form by ID;
className = ;
"px-6 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed\";
disabled = { isSavingRelation: isSavingRelation } || !selectedSourceRecordId || !selectedTargetRecordId || !newRelationType || selectedSourceRecordId === selectedTargetRecordId;
    >
        { isSavingRelation: isSavingRelation, 'Creating...': 'Create Relation' };
button >
;
div >
;
div >
;
div >
;
{ /* End New */ }
div >
;
div >
;
;
;
exports.default = KnowledgeBase;
""(templateObject_3 || (templateObject_3 = __makeTemplateObject([""], [""])));
var templateObject_1, templateObject_2, templateObject_3;
