import { jsx as _jsx } from "react/jsx-runtime";
`` `typescript
// src/pages/Glossary.tsx
// Glossary Page
// Displays and manages glossary terms.
// --- New: Add UI for creating, viewing, editing, and deleting Glossary Terms ---\
// --- New: Add Realtime Updates for Glossary Terms ---\

import React, { useEffect, useState } from 'react';
import { GlossaryService } from '../core/glossary/GlossaryService';
import { AuthorityForgingEngine } from '../core/authority/AuthorityForgingEngine'; // Import AuthorityForgingEngine
import { GlossaryTerm } from '../interfaces';
import { BookOpen, ChevronDown, ChevronUp, Trash2, Edit, PlusCircle, MinusCircle, Save, Loader2, Info } from 'lucide-react'; // Import icons


// Access core modules from the global window object (for MVP simplicity)
// In a real app, use React Context or dependency injection
declare const window: any;
const glossaryService: GlossaryService = window.systemContext?.glossaryService; // The Glossary (\u5b57\u5eab) module
const authorityForgingEngine: any = window.systemContext?.authorityForgingEngine; // Use any for action recording (\u6b0a\u80fd\u935b\u9020)
const systemContext: any = window.systemContext; // Access the full context for currentUser


const Glossary: React.FC = () => {
  const [terms, setTerms] = useState<GlossaryTerm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedTerms, setExpandedTerms] = useState<Record<string, boolean>>({}); // State to track expanded terms

  // --- State for creating new term ---\
  const [isCreatingTerm, setIsCreatingTerm] = useState(false);
  const [newTerm, setNewTerm] = useState('');
  const [newDefinition, setNewDefinition] = useState('');
  const [newRelatedConcepts, setNewRelatedConcepts] = useState<string[]>([]);
  const [newPillarDomain, setNewPillarDomain] = useState('');
  const [newIsPublic, setNewIsPublic] = useState(true); // Default to public
  const [isSavingTerm, setIsSavingTerm] = useState(false);

  // --- State for editing term ---\
  const [editingTerm, setEditingTerm] = useState<GlossaryTerm | null>(null);
  const [editingTermText, setEditingTermText] = useState('');
  const [editingDefinition, setEditingDefinition] = useState('');
  const [editingRelatedConcepts, setEditingRelatedConcepts] = useState<string[]>([]);
  const [editingPillarDomain, setEditingPillarDomain] = useState('');
  const [editingIsPublic, setEditingIsPublic] = useState(true);
  const [isUpdatingTerm, setIsUpdatingTerm] = useState(false);


  const fetchTerms = async () => {
       const userId = systemContext?.currentUser?.id;
       if (!glossaryService || !userId) {
            setError("GlossaryService module not initialized or user not logged in.");
            setLoading(false);
            return;
        }
      setLoading(true);
      setError(null); // Clear main error when fetching
      try {
          // Fetch terms for the current user (their private and all public)
          const userTerms = await glossaryService.getTerms(userId); // Pass user ID
          setTerms(userTerms);
      } catch (err: any) {
          console.error('Error fetching glossary terms:', err);
          setError(`;
Failed;
to;
load;
glossary;
terms: $;
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
        fetchTerms(); // Fetch all terms on initial load
    }

    // --- New: Subscribe to realtime updates for glossary table ---\
    let unsubscribeTermInsert: (() => void) | undefined;
    let unsubscribeTermUpdate: (() => void) | undefined;
    let unsubscribeTermDelete: (() => void) | undefined;


    if (glossaryService?.context?.eventBus) { // Check if GlossaryService and its EventBus are available
        const eventBus = glossaryService.context.eventBus;
        const userId = systemContext?.currentUser?.id;

        // Subscribe to term insert events
        unsubscribeTermInsert = eventBus.subscribe('glossary_term_insert', (payload: GlossaryTerm) => {
            // Add the new term if it's public or owned by the current user
            if (payload.user_id === userId || payload.is_public) {
                console.log('Glossary page received glossary_term_insert event:', payload);
                // Add the new term and keep sorted by term alphabetically
                setTerms(prevTerms => [...prevTerms, payload].sort((a, b) => a.term.localeCompare(b.term)));
            }
        });

         // Subscribe to term update events
         unsubscribeTermUpdate = eventBus.subscribe('glossary_term_update', (payload: GlossaryTerm) => {
             // Update the specific term if it's public or owned by the current user
             if (payload.user_id === userId || payload.is_public) {
                 console.log('Glossary page received glossary_term_update event:', payload);
                 // Update the specific term in the state
                 setTerms(prevTerms => prevTerms.map(term => term.id === payload.id ? payload : term));
             } else {
                 // If a term the user could previously see (e.g., public) is updated to be private and not owned by them, remove it.
                 // This scenario is less likely with typical RLS but good to handle.
                 setTerms(prevTerms => prevTerms.filter(term => term.id !== payload.id));
             }
         });

          // Subscribe to term delete events
          unsubscribeTermDelete = eventBus.subscribe('glossary_term_delete', (payload: { termId: string, userId: string }) => {
             // Remove the deleted term from the state if it was visible to the user
             // We don't have the full term object here, so we just remove by ID.
             // RLS should prevent the user from receiving delete events for terms they couldn't see anyway.
             console.log('Glossary page received glossary_term_delete event:', payload);
             setTerms(prevTerms => prevTerms.filter(term => term.id !== payload.termId));
         });
    }
    // --- End New ---\


    return () => {
        // Unsubscribe on component unmount
        unsubscribeTermInsert?.();
        unsubscribeTermUpdate?.();
        unsubscribeTermDelete?.();
    };

  }, [systemContext?.currentUser?.id, glossaryService]); // Re-run effect when user ID or service changes


    const toggleExpandTerm = (termId: string) => {
        setExpandedTerms(prevState => ({
            ...prevState,
            [termId]: !prevState[termId]
        }));
    };

    // --- New: Handle Create Term ---\
    const handleCreateTerm = async (e: React.FormEvent) => {
        e.preventDefault();
        const userId = systemContext?.currentUser?.id;
        if (!glossaryService || !userId) {
            alert(\"GlossaryService module not initialized or user not logged in.\");
            return;
        }
        if (!newTerm.trim() || !newDefinition.trim()) {
            alert('Please enter both term and definition.');
            return;
        }

        setIsSavingTerm(true);
        setError(null);
        try {
            const termDetails = {
                term: newTerm,
                definition: newDefinition,
                related_concepts: newRelatedConcepts.map(c => c.trim()).filter(c => c), // Clean and filter empty concepts
                pillar_domain: newPillarDomain.trim() || undefined, // Use undefined if empty
                is_public: newIsPublic,
            };

            // Create the term
            const createdTerm = await glossaryService.createTerm(termDetails, userId, newIsPublic); // Pass userId and isPublic

            if (createdTerm) {
                alert(`;
Glossary;
term;
"${createdTerm.term}\\\" created successfully!`);;
console.log('Created new term:', createdTerm);
// Reset form
setNewTerm('');
setNewDefinition('');
setNewRelatedConcepts([]);
setNewPillarDomain('');
setNewIsPublic(true); // Reset to default public
// State update handled by realtime listener
// Simulate recording user action
authorityForgingEngine?.recordAction({
    type: 'web:glossary:create',
    details: { termId: createdTerm.id, term: createdTerm.term, isPublic: createdTerm.is_public },
    context: { platform: 'web', page: 'glossary' },
    user_id: userId, // Associate action with user
});
{
    setError('Failed to create glossary term.');
}
try { }
catch (err) {
    console.error('Error creating glossary term:', err);
    setError(`Failed to create glossary term: ${err.message}`);
}
finally {
    setIsSavingTerm(false);
}
;
const handleCancelCreate = () => {
    setIsCreatingTerm(false);
    setNewTerm('');
    setNewDefinition('');
    setNewRelatedConcepts([]);
    setNewPillarDomain('');
    setNewIsPublic(true);
    setError(null); // Clear error when cancelling
};
// --- New: Handle Edit Term ---\
const handleEditTermClick = (term) => {
    setEditingTerm(term);
    setEditingTermText(term.term);
    setEditingDefinition(term.definition);
    setEditingRelatedConcepts(term.related_concepts || []);
    setEditingPillarDomain(term.pillar_domain || '');
    setEditingIsPublic(term.is_public);
    setError(null); // Clear previous errors when starting edit
};
const handleUpdateTerm = async (e) => {
    e.preventDefault();
    const userId = systemContext?.currentUser?.id;
    if (!glossaryService || !editingTerm || !userId)
        return; // Safety checks
    if (!editingTermText.trim() || !editingDefinition.trim()) {
        alert('Please enter both term and definition.');
        return;
    }
    setIsUpdatingTerm(true);
    setError(null);
    try {
        const updates = {
            term: editingTermText,
            definition: editingDefinition,
            related_concepts: editingRelatedConcepts.map(c => c.trim()).filter(c => c), // Clean and filter empty concepts
            pillar_domain: editingPillarDomain.trim() || undefined, // Use undefined if empty
            is_public: editingIsPublic, // Allow changing public status (requires admin RLS or specific policy)
        };
        // Update the term
        // Note: Users can only update their *private* terms via this method in the service RLS.
        // If they try to edit a public term, the service will return undefined.
        const updatedTerm = await glossaryService.updateTerm(editingTerm.id, updates, userId); // Pass termId, updates, userId
        if (updatedTerm) {
            console.log('Term updated:', updatedTerm);
            setEditingTerm(null); // Close edit form
            setEditingTermText('');
            setEditingDefinition('');
            setEditingRelatedConcepts([]);
            setEditingPillarDomain('');
            setEditingIsPublic(true);
            // State update handled by realtime listener
            alert(`Glossary term \\\"${updatedTerm.term}\\\" updated successfully!`);
            // Simulate recording user action
            authorityForgingEngine?.recordAction({
                type: 'web:glossary:update',
                details: { termId: updatedTerm.id, term: updatedTerm.term, isPublic: updatedTerm.is_public },
                context: { platform: 'web', page: 'glossary' },
                user_id: userId, // Associate action with user
            });
        }
        else {
            // This case happens if the term was not found or did not belong to the user (or was public)
            setError('Failed to update glossary term. You can only edit your private terms.');
        }
    }
    catch (err) {
        console.error('Error updating glossary term:', err);
        setError(`Failed to update glossary term: ${err.message}`);
    }
    finally {
        setIsUpdatingTerm(false);
    }
};
const handleCancelEdit = () => {
    setEditingTerm(null);
    setEditingTermText('');
    setEditingDefinition('');
    setEditingRelatedConcepts([]);
    setEditingPillarDomain('');
    setEditingIsPublic(true);
    setError(null);
};
// --- End New ---\
const handleDeleteTerm = async (termId) => {
    const userId = systemContext?.currentUser?.id;
    if (!glossaryService || !userId) {
        alert("GlossaryService module not initialized or user not logged in.\"););
        return;
    }
    // Note: Users can only delete their *private* terms via this method in the service RLS.
    // If they try to delete a public term, the service will return false.
    if (!confirm(`Are you sure you want to delete this glossary term? You can only delete your private terms.`))
        return;
    setError(null);
    try {
        // Delete the term
        const success = await glossaryService.deleteTerm(termId, userId); // Pass termId and userId
        if (success) {
            console.log('Term deleted:', termId);
            // State update handled by realtime listener
            alert('Glossary term deleted successfully!');
            // Simulate recording user action
            authorityForgingEngine?.recordAction({
                type: 'web:glossary:delete',
                details: { termId },
                context: { platform: 'web', page: 'glossary' },
                user_id: userId, // Associate action with user
            });
        }
        else {
            setError('Failed to delete glossary term. You can only delete your private terms.');
            alert('Failed to delete glossary term. You can only delete your private terms.');
        }
    }
    catch (err) {
        console.error('Error deleting glossary term:', err);
        setError(`Failed to delete glossary term: ${err.message}`);
        alert(`Failed to delete glossary term: ${err.message}`);
    }
    finally {
        setLoading(false); // Ensure loading is false after delete attempt
    }
};
// Helper for related concepts input (simple comma-separated string for MVP)
const handleRelatedConceptsInputChange = (e, isEditing) => {
    const concepts = e.target.value.split(',').map(c => c.trim()).filter(c => c);
    if (isEditing) {
        setEditingRelatedConcepts(concepts);
    }
    else {
        setNewRelatedConcepts(concepts);
    }
};
const getRelatedConceptsInputString = (isEditing) => {
    const concepts = isEditing ? editingRelatedConcepts : newRelatedConcepts;
    return concepts.join(', ');
};
// Ensure user is logged in before rendering content
if (!systemContext?.currentUser) {
    // This case should ideally be handled by ProtectedRoute, but as a fallback:
    return (_jsx("div", { className: true }));
    "container mx-auto p-4 flex justify-center\">
        < div;
    className = ;
    "bg-neutral-800/50 p-8 rounded-lg shadow-xl w-full max-w-md text-center text-neutral-300\">
        < p > Please;
    log in to;
    view;
    the;
    glossary.;
    p >
    ;
    div >
    ;
    div >
    ;
    ;
}
return (_jsx("div", { className: true }));
"container mx-auto p-4\">
    < div;
className = ;
"bg-neutral-800/50 p-6 rounded-lg shadow-xl\">
    < h2;
className = ;
"text-3xl font-bold text-blue-400 mb-6\">Glossary (\u5b57\u5eab)</h2>
    < p;
className = ;
"text-neutral-300 mb-8\">Manage terms and definitions for your Jun.Ai.Key system and personal knowledge.</p>;
{ /* Form for creating new terms */ }
{
    !editingTerm && ();
    _jsx("div", { className: true });
    "mb-8 p-4 bg-neutral-700/50 rounded-lg\">\
                 <h3 className=\"text-xl font-semibold text-blue-300 mb-3\">Add New Term</h3>\
                 <form onSubmit={handleCreateTerm}>\
                    <div className=\"mb-4\">\
                        <label htmlFor=\"newTerm\" className=\"block text-neutral-300 text-sm font-semibold mb-2\">Term:</label>\
                        <input\
                            id=\"newTerm\"\
                            type=\"text\"\
                            className=\"w-full p-2 rounded-md bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500\"\
                            value={newTerm}\
                            onChange={(e) => setNewTerm(e.target.value)}\
                            placeholder=\"Enter term (e.g., OmniKey)\"\
                            disabled={isSavingTerm}\
                            required\
                        />\
                    </div>\
                     <div className=\"mb-4\">\
                        <label htmlFor=\"newDefinition\" className=\"block text-neutral-300 text-sm font-semibold mb-2\">Definition:</label>\
                         <textarea\
                            id=\"newDefinition\"\
                            className=\"w-full p-2 rounded-md bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500\"\
                            value={newDefinition}\
                            onChange={(e) => setNewDefinition(e.target.value)}\
                            placeholder=\"Enter definition\"\
                            rows={4}\
                            disabled={isSavingTerm}\
                            required\
                         />\
                    </div>\
                     <div className=\"mb-4\">\
                        <label htmlFor=\"newRelatedConcepts\" className=\"block text-neutral-300 text-sm font-semibold mb-2\">Related Concepts (comma-separated):</label>\
                        <input\
                            id=\"newRelatedConcepts\"\
                            type=\"text\"\
                            className=\"w-full p-2 rounded-md bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm\"\
                            value={getRelatedConceptsInputString(false)}\
                            onChange={(e) => handleRelatedConceptsInputChange(e, false)}\
                            placeholder=\"e.g., Rune, Ability, Task\"\
                            disabled={isSavingTerm}\
                        />\
                    </div>\
                     <div className=\"mb-4\">\
                        <label htmlFor=\"newPillarDomain\" className=\"block text-neutral-300 text-sm font-semibold mb-2\">Pillar/Domain (Optional):</label>\
                        <input\
                            id=\"newPillarDomain\"\
                            type=\"text\"\
                            className=\"w-full p-2 rounded-md bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm\"\
                            value={newPillarDomain}\
                            onChange={(e) => setNewPillarDomain(e.target.value)}\
                            placeholder=\"e.g., Long-term Memory\"\
                            disabled={isSavingTerm}\
                        />\
                    </div>\
                     <div className=\"mb-4 flex items-center gap-2\">\
                         <input\
                             type=\"checkbox\"\
                             id=\"newIsPublic\"\
                             className=\"form-checkbox h-4 w-4 text-blue-600 rounded border-neutral-600 bg-neutral-800 focus:ring-blue-500\"\
                             checked={newIsPublic}\
                             onChange={(e) => setNewIsPublic(e.target.checked)}\
                             disabled={isSavingTerm}\
                         />\
                         <label htmlFor=\"newIsPublic\" className=\"text-neutral-300 text-sm\">Make Public</label>\
                     </div>\
        < button;
    type = ;
    "submit\"\
                        className=\"px-6 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed\"\
                        disabled={isSavingTerm || !newTerm.trim() || !newDefinition.trim()}\
                    >\
                        {isSavingTerm ? 'Saving...' : 'Add Term'}\
                    </button>\
                     {error && isSavingTerm === false && ( // Show create error only after it finishes
        < p;
    className = ;
    "text-red-400 text-sm mt-4\">Error: {error}</p>\
                     )}\
               </form>\
            </div>;
}
{ /* Form for editing a term */ }
{
    editingTerm && ();
    _jsx("div", { className: true });
    "mb-8 p-4 bg-neutral-700/50 rounded-lg\">\
                 <h3 className=\"text-xl font-semibold text-blue-300 mb-3\">Edit Term: {editingTerm.term}</h3>\
                 <form onSubmit={handleUpdateTerm}>\
                    <div className=\"mb-4\">\
                        <label htmlFor=\"editingTermText\" className=\"block text-neutral-300 text-sm font-semibold mb-2\">Term:</label>\
                        <input\
                            id=\"editingTermText\"\
                            type=\"text\"\
                            className=\"w-full p-2 rounded-md bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500\"\
                            value={editingTermText}\
                            onChange={(e) => setEditingTermText(e.target.value)}\
                            placeholder=\"Edit term\"\
                            disabled={isUpdatingTerm}\
                            required\
                        />\
                    </div>\
                     <div className=\"mb-4\">\
                        <label htmlFor=\"editingDefinition\" className=\"block text-neutral-300 text-sm font-semibold mb-2\">Definition:</label>\
                         <textarea\
                            id=\"editingDefinition\"\
                            className=\"w-full p-2 rounded-md bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500\"\
                            value={editingDefinition}\
                            onChange={(e) => setEditingDefinition(e.target.value)}\
                            placeholder=\"Edit definition\"\
                            rows={4}\
                            disabled={isUpdatingTerm}\
                            required\
                         />\
                    </div>\
                     <div className=\"mb-4\">\
                        <label htmlFor=\"editingRelatedConcepts\" className=\"block text-neutral-300 text-sm font-semibold mb-2\">Related Concepts (comma-separated):</label>\
                        <input\
                            id=\"editingRelatedConcepts\"\
                            type=\"text\"\
                            className=\"w-full p-2 rounded-md bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm\"\
                            value={getRelatedConceptsInputString(true)}\
                            onChange={(e) => handleRelatedConceptsInputChange(e, true)}\
                            placeholder=\"e.g., Rune, Ability, Task\"\
                            disabled={isUpdatingTerm}\
                        />\
                    </div>\
                     <div className=\"mb-4\">\
                        <label htmlFor=\"editingPillarDomain\" className=\"block text-neutral-300 text-sm font-semibold mb-2\">Pillar/Domain (Optional):</label>\
                        <input\
                            id=\"editingPillarDomain\"\
                            type=\"text\"\
                            className=\"w-full p-2 rounded-md bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm\"\
                            value={editingPillarDomain}\
                            onChange={(e) => setEditingPillarDomain(e.target.value)}\
                            placeholder=\"e.g., Long-term Memory\"\
                            disabled={isUpdatingTerm}\
                        />\
                    </div>\
                     <div className=\"mb-4 flex items-center gap-2\">\
                         <input\
                             type=\"checkbox\"\
                             id=\"editingIsPublic\"\
                             className=\"form-checkbox h-4 w-4 text-blue-600 rounded border-neutral-600 bg-neutral-800 focus:ring-blue-500\"\
                             checked={editingIsPublic}\
                             onChange={(e) => setEditingIsPublic(e.target.checked)}\
                             disabled={isUpdatingTerm}\
                         />\
                         <label htmlFor=\"editingIsPublic\" className=\"text-neutral-300 text-sm\">Make Public</label>\
                     </div>\
        < div;
    className = ;
    "flex gap-4\">\
                        <button\
                            type=\"submit\"\
                            className=\"px-6 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed\"\
                            disabled={isUpdatingTerm || !editingTermText.trim() || !editingDefinition.trim()}\
                        >\
                            {isUpdatingTerm ? 'Saving...' : 'Save Changes'}\
                        </button>\
                         <button\
                            type=\"button\"\
                            onClick={handleCancelEdit}\
                            className=\"px-6 py-2 bg-neutral-600 text-white font-semibold rounded-md hover:bg-neutral-700 transition\"\
                            disabled={isUpdatingTerm}\
                        >\
                            Cancel\
                        </button>\
                    </div>;
    {
        error && isUpdatingTerm === false && ( // Show save error only after it finishes
        _jsx("p", { className: true }));
        "text-red-400 text-sm mt-4\">Error: {error}</p>\
                     )}\
               </form>\
            </div>;
    }
    { /* Glossary List */ }
    _jsx("div", { className: true });
    "p-4 bg-neutral-700/50 rounded-lg\">\
            <h3 className=\"text-xl font-semibold text-blue-300 mb-3\">Terms</h3>\
            {loading ? (\
              <p className=\"text-neutral-400\">Loading glossary terms...</p>\
            ) : error && !isCreatingTerm && !editingTerm ? ( // Only show main error if not in create mode
        < p;
    className = ;
    "text-red-400\">Error: {error}</p>\
            ) : terms.length === 0 ? (\
              <p className=\"text-neutral-400\">No glossary terms found yet. Add one using the form above.</p>\
            ) : (\
              <ul className=\"space-y-4\">\
                {terms.map((term) => (\
                  <li key={term.id} className=\"bg-neutral-600/50 p-4 rounded-md border-l-4 border-blue-500\">\
                    <div className=\"flex justify-between items-center\">\
                        <div className=\"flex items-center gap-3\">\
                            <BookOpen size={20} className=\"text-blue-400\"/>\
                            <h4 className=\"font-semibold text-blue-200 mb-1\">{term.term}</h4>\
                        </div>\
                         <button onClick={() => toggleExpandTerm(term.id)} className=\"text-neutral-400 hover:text-white transition\">\
                            {expandedTerms[term.id] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}\
                         </button>\
                    </div>\
                    <p className=\"text-neutral-300 text-sm\">Definition: {term.definition.substring(0, 100)}{term.definition.length > 100 ? '...' : ''}</p>\
                    <small className=\"text-neutral-400 text-xs block mt-1\">\
                        ID: {term.id}\
                         {term.user_id && ` | Owner: ${term.user_id}`}\
                         {term.is_public ? ' | Public' : ' | Private'}\
                         {term.pillar_domain && ` | Domain: ${term.pillar_domain}`}\
                         {term.creation_timestamp && ` | Created: ${new Date(term.creation_timestamp).toLocaleString()}`}\
                         {term.last_updated_timestamp && ` | Last Updated: ${new Date(term.last_updated_timestamp).toLocaleString()}`}\
                    </small>\
    ;
    { /* Term Details (Collapsible) */ }
    {
        expandedTerms[term.id] && (());
        _jsx("div", { className: true });
        "mt-4 border-t border-neutral-600 pt-4\">\
                            {/* Full Definition */}\
                            <div className=\"mb-4\">\
                                <h5 className=\"text-neutral-300 text-sm font-semibold mb-2\">Full Definition:</h5>\
                                <p className=\"text-neutral-300 text-sm\">{term.definition}</p>\
                            </div>\
        ;
        { /* Related Concepts */ }
        {
            term.related_concepts && term.related_concepts.length > 0 && (());
            _jsx("div", { className: true });
            "mb-4\">\
                                    <h5 className=\"text-neutral-300 text-sm font-semibold mb-2\">Related Concepts:</h5>\
                                    <p className=\"text-neutral-400 text-xs\">{term.related_concepts.join(', ')}</p>\
                                </div>\
                            ))}\
            ;
            div > ;
        }
        { /* Term Actions */ }
        _jsx("div", { className: true });
        "mt-4 flex flex-wrap gap-2\"> {/* Use flex-wrap for smaller screens */}\
                         {/* Edit Button (Only show for user's own terms) */}\
                         {term.user_id === systemContext?.currentUser?.id && !term.is_public && ((\
                             <button\
                                className=\"px-3 py-1 text-sm bg-yellow-600 text-white rounded hover:bg-yellow-700 transition disabled:opacity-50 disabled:cursor-not-allowed\"\
                                onClick={() => handleEditTermClick(term)}\
                                disabled={!!editingTerm} // Disable while another term is being edited\
                             >\
                                <Edit size={16} className=\"inline-block mr-1\"/> Edit\
                             </button>\
                         ))}\
                         {/* Delete Button (Only show for user's own terms) */}\
                         {term.user_id === systemContext?.currentUser?.id && !term.is_public && ((\
                             <button\
                                className=\"px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed\"\
                                onClick={() => handleDeleteTerm(term.id)}\
                                disabled={!!editingTerm} // Disable while editing\
                             >\
                                <Trash2 size={16} className=\"inline-block mr-1\"/> Delete\
                             </button>\
                         ))}\
                         {/* TODO: Add Copy button (Part of \u516d\u5f0f\u5967\u7fa9: \u89c0\u5bdf - record action) */}\
                    </div>\
                  </li>\
                ))}\
              </ul>\
            )}\
        </div>;
        div >
        ;
        div >
        ;
        ;
    }
    ;
    export default Glossary;
    `` `;
}
