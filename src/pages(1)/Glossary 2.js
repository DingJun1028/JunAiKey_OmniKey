var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
""(__makeTemplateObject(["typescript\n// src/pages/Glossary.tsx\n// Glossary Page\n// Displays and manages glossary terms.\n// --- New: Add UI for creating, viewing, editing, and deleting Glossary Terms ---// --- New: Add Realtime Updates for Glossary Terms ---\nimport React, { useEffect, useState } from 'react';\nimport { GlossaryService } from '../core/glossary/GlossaryService';\nimport { AuthorityForgingEngine } from '../core/authority/AuthorityForgingEngine'; // Import AuthorityForgingEngine\nimport { GlossaryTerm } from '../interfaces';\nimport { BookOpen, ChevronDown, ChevronUp, Trash2, Edit, PlusCircle, MinusCircle, Save, Loader2, Info } from 'lucide-react'; // Import icons\n\n\n// Access core modules from the global window object (for MVP simplicity)\n// In a real app, use React Context or dependency injection\ndeclare const window: any;\nconst glossaryService: GlossaryService = window.systemContext?.glossaryService; // The Glossary (\u5B57\u5EAB) module\nconst authorityForgingEngine: any = window.systemContext?.authorityForgingEngine; // Use any for action recording (\u6B0A\u80FD\u935B\u9020)\nconst systemContext: any = window.systemContext; // Access the full context for currentUser\n\n\nconst Glossary: React.FC = () => {\n  const [terms, setTerms] = useState<GlossaryTerm[]>([]);\n  const [loading, setLoading] = useState(true);\n  const [error, setError] = useState<string | null>(null);\n  const [expandedTerms, setExpandedTerms] = useState<Record<string, boolean>>({}); // State to track expanded terms\n\n  // --- State for creating new term ---  const [isCreatingTerm, setIsCreatingTerm] = useState(false);\n  const [newTerm, setNewTerm] = useState('');\n  const [newDefinition, setNewDefinition] = useState('');\n  const [newRelatedConcepts, setNewRelatedConcepts] = useState<string[]>([]);\n  const [newPillarDomain, setNewPillarDomain] = useState('');\n  const [newIsPublic, setNewIsPublic] = useState(true); // Default to public\n  const [isSavingTerm, setIsSavingTerm] = useState(false);\n\n  // --- State for editing term ---  const [editingTerm, setEditingTerm] = useState<GlossaryTerm | null>(null);\n  const [editingTermText, setEditingTermText] = useState('');\n  const [editingDefinition, setEditingDefinition] = useState('');\n  const [editingRelatedConcepts, setEditingRelatedConcepts] = useState<string[]>([]);\n  const [editingPillarDomain, setEditingPillarDomain] = useState('');\n  const [editingIsPublic, setEditingIsPublic] = useState(true);\n  const [isUpdatingTerm, setIsUpdatingTerm] = useState(false);\n\n\n  const fetchTerms = async () => {\n       const userId = systemContext?.currentUser?.id;\n       if (!glossaryService || !userId) {\n            setError(\"GlossaryService module not initialized or user not logged in.\");\n            setLoading(false);\n            return;\n        }\n      setLoading(true);\n      setError(null); // Clear main error when fetching\n      try {\n          // Fetch terms for the current user (their private and all public)\n          const userTerms = await glossaryService.getTerms(userId); // Pass user ID\n          setTerms(userTerms);\n      } catch (err: any) {\n          console.error('Error fetching glossary terms:', err);\n          setError("], ["typescript\n// src/pages/Glossary.tsx\n// Glossary Page\n// Displays and manages glossary terms.\n// --- New: Add UI for creating, viewing, editing, and deleting Glossary Terms ---\\\n// --- New: Add Realtime Updates for Glossary Terms ---\\\n\nimport React, { useEffect, useState } from 'react';\nimport { GlossaryService } from '../core/glossary/GlossaryService';\nimport { AuthorityForgingEngine } from '../core/authority/AuthorityForgingEngine'; // Import AuthorityForgingEngine\nimport { GlossaryTerm } from '../interfaces';\nimport { BookOpen, ChevronDown, ChevronUp, Trash2, Edit, PlusCircle, MinusCircle, Save, Loader2, Info } from 'lucide-react'; // Import icons\n\n\n// Access core modules from the global window object (for MVP simplicity)\n// In a real app, use React Context or dependency injection\ndeclare const window: any;\nconst glossaryService: GlossaryService = window.systemContext?.glossaryService; // The Glossary (\\u5b57\\u5eab) module\nconst authorityForgingEngine: any = window.systemContext?.authorityForgingEngine; // Use any for action recording (\\u6b0a\\u80fd\\u935b\\u9020)\nconst systemContext: any = window.systemContext; // Access the full context for currentUser\n\n\nconst Glossary: React.FC = () => {\n  const [terms, setTerms] = useState<GlossaryTerm[]>([]);\n  const [loading, setLoading] = useState(true);\n  const [error, setError] = useState<string | null>(null);\n  const [expandedTerms, setExpandedTerms] = useState<Record<string, boolean>>({}); // State to track expanded terms\n\n  // --- State for creating new term ---\\\n  const [isCreatingTerm, setIsCreatingTerm] = useState(false);\n  const [newTerm, setNewTerm] = useState('');\n  const [newDefinition, setNewDefinition] = useState('');\n  const [newRelatedConcepts, setNewRelatedConcepts] = useState<string[]>([]);\n  const [newPillarDomain, setNewPillarDomain] = useState('');\n  const [newIsPublic, setNewIsPublic] = useState(true); // Default to public\n  const [isSavingTerm, setIsSavingTerm] = useState(false);\n\n  // --- State for editing term ---\\\n  const [editingTerm, setEditingTerm] = useState<GlossaryTerm | null>(null);\n  const [editingTermText, setEditingTermText] = useState('');\n  const [editingDefinition, setEditingDefinition] = useState('');\n  const [editingRelatedConcepts, setEditingRelatedConcepts] = useState<string[]>([]);\n  const [editingPillarDomain, setEditingPillarDomain] = useState('');\n  const [editingIsPublic, setEditingIsPublic] = useState(true);\n  const [isUpdatingTerm, setIsUpdatingTerm] = useState(false);\n\n\n  const fetchTerms = async () => {\n       const userId = systemContext?.currentUser?.id;\n       if (!glossaryService || !userId) {\n            setError(\"GlossaryService module not initialized or user not logged in.\");\n            setLoading(false);\n            return;\n        }\n      setLoading(true);\n      setError(null); // Clear main error when fetching\n      try {\n          // Fetch terms for the current user (their private and all public)\n          const userTerms = await glossaryService.getTerms(userId); // Pass user ID\n          setTerms(userTerms);\n      } catch (err: any) {\n          console.error('Error fetching glossary terms:', err);\n          setError("]));
Failed;
to;
load;
glossary;
terms: $;
{
    err.message;
}
");\n      } finally {\n          setLoading(false);\n      }\n  };\n\n  useEffect(() => {\n    // Fetch data when the component mounts or when the user changes\n    if (systemContext?.currentUser?.id) {\n        fetchTerms(); // Fetch all terms on initial load\n    }\n\n    // --- New: Subscribe to realtime updates for glossary table ---    let unsubscribeTermInsert: (() => void) | undefined;\n    let unsubscribeTermUpdate: (() => void) | undefined;\n    let unsubscribeTermDelete: (() => void) | undefined;\n\n\n    if (glossaryService?.context?.eventBus) { // Check if GlossaryService and its EventBus are available\n        const eventBus = glossaryService.context.eventBus;\n        const userId = systemContext?.currentUser?.id;\n\n        // Subscribe to term insert events\n        unsubscribeTermInsert = eventBus.subscribe('glossary_term_insert', (payload: GlossaryTerm) => {\n            // Add the new term if it's public or owned by the current user\n            if (payload.user_id === userId || payload.is_public) {\n                console.log('Glossary page received glossary_term_insert event:', payload);\n                // Add the new term and keep sorted by term alphabetically\n                setTerms(prevTerms => [...prevTerms, payload].sort((a, b) => a.term.localeCompare(b.term)));\n            }\n        });\n\n         // Subscribe to term update events\n         unsubscribeTermUpdate = eventBus.subscribe('glossary_term_update', (payload: GlossaryTerm) => {\n             // Update the specific term if it's public or owned by the current user\n             if (payload.user_id === userId || payload.is_public) {\n                 console.log('Glossary page received glossary_term_update event:', payload);\n                 // Update the specific term in the state\n                 setTerms(prevTerms => prevTerms.map(term => term.id === payload.id ? payload : term));\n             } else {\n                 // If a term the user could previously see (e.g., public) is updated to be private and not owned by them, remove it.\n                 // This scenario is less likely with typical RLS but good to handle.\n                 setTerms(prevTerms => prevTerms.filter(term => term.id !== payload.id));\n             }\n         });\n\n          // Subscribe to term delete events\n          unsubscribeTermDelete = eventBus.subscribe('glossary_term_delete', (payload: { termId: string, userId: string }) => {\n             // Remove the deleted term from the state if it was visible to the user\n             // We don't have the full term object here, so we just remove by ID.\n             // RLS should prevent the user from receiving delete events for terms they couldn't see anyway.\n             console.log('Glossary page received glossary_term_delete event:', payload);\n             setTerms(prevTerms => prevTerms.filter(term => term.id !== payload.termId));\n         });\n    }\n    // --- End New ---\n\n    return () => {\n        // Unsubscribe on component unmount\n        unsubscribeTermInsert?.();\n        unsubscribeTermUpdate?.();\n        unsubscribeTermDelete?.();\n    };\n\n  }, [systemContext?.currentUser?.id, glossaryService]); // Re-run effect when user ID or service changes\n\n\n    const toggleExpandTerm = (termId: string) => {\n        setExpandedTerms(prevState => ({\n            ...prevState,\n            [termId]: !prevState[termId]\n        }));\n    };\n\n    // --- New: Handle Create Term ---    const handleCreateTerm = async (e: React.FormEvent) => {\n        e.preventDefault();\n        const userId = systemContext?.currentUser?.id;\n        if (!glossaryService || !userId) {\n            alert(\"GlossaryService module not initialized or user not logged in.\");\n            return;\n        }\n        if (!newTerm.trim() || !newDefinition.trim()) {\n            alert('Please enter both term and definition.');\n            return;\n        }\n\n        setIsSavingTerm(true);\n        setError(null);\n        try {\n            const termDetails = {\n                term: newTerm,\n                definition: newDefinition,\n                related_concepts: newRelatedConcepts.map(c => c.trim()).filter(c => c), // Clean and filter empty concepts\n                pillar_domain: newPillarDomain.trim() || undefined, // Use undefined if empty\n                is_public: newIsPublic,\n            };\n\n            // Create the term\n            const createdTerm = await glossaryService.createTerm(termDetails, userId, newIsPublic); // Pass userId and isPublic\n\n            if (createdTerm) {\n                alert(";
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
authorityForgingEngine === null || authorityForgingEngine === void 0 ? void 0 : authorityForgingEngine.recordAction({
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
    setError("Failed to create glossary term: ".concat(err.message));
}
finally {
    setIsSavingTerm(false);
}
;
var handleCancelCreate = function () {
    setIsCreatingTerm(false);
    setNewTerm('');
    setNewDefinition('');
    setNewRelatedConcepts([]);
    setNewPillarDomain('');
    setNewIsPublic(true);
    setError(null); // Clear error when cancelling
};
// --- New: Handle Edit Term ---\
var handleEditTermClick = function (term) {
    setEditingTerm(term);
    setEditingTermText(term.term);
    setEditingDefinition(term.definition);
    setEditingRelatedConcepts(term.related_concepts || []);
    setEditingPillarDomain(term.pillar_domain || '');
    setEditingIsPublic(term.is_public);
    setError(null); // Clear previous errors when starting edit
};
var handleUpdateTerm = function (e) { return __awaiter(_this, void 0, void 0, function () {
    var userId, updates, updatedTerm, err_1;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                e.preventDefault();
                userId = (_a = systemContext === null || systemContext === void 0 ? void 0 : systemContext.currentUser) === null || _a === void 0 ? void 0 : _a.id;
                if (!glossaryService || !editingTerm || !userId)
                    return [2 /*return*/]; // Safety checks
                if (!editingTermText.trim() || !editingDefinition.trim()) {
                    alert('Please enter both term and definition.');
                    return [2 /*return*/];
                }
                setIsUpdatingTerm(true);
                setError(null);
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, 4, 5]);
                updates = {
                    term: editingTermText,
                    definition: editingDefinition,
                    related_concepts: editingRelatedConcepts.map(function (c) { return c.trim(); }).filter(function (c) { return c; }), // Clean and filter empty concepts
                    pillar_domain: editingPillarDomain.trim() || undefined, // Use undefined if empty
                    is_public: editingIsPublic, // Allow changing public status (requires admin RLS or specific policy)
                };
                return [4 /*yield*/, glossaryService.updateTerm(editingTerm.id, updates, userId)];
            case 2:
                updatedTerm = _b.sent();
                if (updatedTerm) {
                    console.log('Term updated:', updatedTerm);
                    setEditingTerm(null); // Close edit form
                    setEditingTermText('');
                    setEditingDefinition('');
                    setEditingRelatedConcepts([]);
                    setEditingPillarDomain('');
                    setEditingIsPublic(true);
                    // State update handled by realtime listener
                    alert("Glossary term \\\"".concat(updatedTerm.term, "\\\" updated successfully!"));
                    // Simulate recording user action
                    authorityForgingEngine === null || authorityForgingEngine === void 0 ? void 0 : authorityForgingEngine.recordAction({
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
                return [3 /*break*/, 5];
            case 3:
                err_1 = _b.sent();
                console.error('Error updating glossary term:', err_1);
                setError("Failed to update glossary term: ".concat(err_1.message));
                return [3 /*break*/, 5];
            case 4:
                setIsUpdatingTerm(false);
                return [7 /*endfinally*/];
            case 5: return [2 /*return*/];
        }
    });
}); };
var handleCancelEdit = function () {
    setEditingTerm(null);
    setEditingTermText('');
    setEditingDefinition('');
    setEditingRelatedConcepts([]);
    setEditingPillarDomain('');
    setEditingIsPublic(true);
    setError(null);
};
// --- End New ---\
var handleDeleteTerm = function (termId) { return __awaiter(_this, void 0, void 0, function () {
    var userId, success_1, err_2;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                userId = (_a = systemContext === null || systemContext === void 0 ? void 0 : systemContext.currentUser) === null || _a === void 0 ? void 0 : _a.id;
                if (!glossaryService || !userId) {
                    alert("GlossaryService module not initialized or user not logged in.\"););
                    return [2 /*return*/];
                }
                // Note: Users can only delete their *private* terms via this method in the service RLS.
                // If they try to delete a public term, the service will return false.
                if (!confirm("Are you sure you want to delete this glossary term? You can only delete your private terms."))
                    return [2 /*return*/];
                setError(null);
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, 4, 5]);
                return [4 /*yield*/, glossaryService.deleteTerm(termId, userId)];
            case 2:
                success_1 = _b.sent();
                if (success_1) {
                    console.log('Term deleted:', termId);
                    // State update handled by realtime listener
                    alert('Glossary term deleted successfully!');
                    // Simulate recording user action
                    authorityForgingEngine === null || authorityForgingEngine === void 0 ? void 0 : authorityForgingEngine.recordAction({
                        type: 'web:glossary:delete',
                        details: { termId: termId },
                        context: { platform: 'web', page: 'glossary' },
                        user_id: userId, // Associate action with user
                    });
                }
                else {
                    setError('Failed to delete glossary term. You can only delete your private terms.');
                    alert('Failed to delete glossary term. You can only delete your private terms.');
                }
                return [3 /*break*/, 5];
            case 3:
                err_2 = _b.sent();
                console.error('Error deleting glossary term:', err_2);
                setError("Failed to delete glossary term: ".concat(err_2.message));
                alert("Failed to delete glossary term: ".concat(err_2.message));
                return [3 /*break*/, 5];
            case 4:
                setLoading(false); // Ensure loading is false after delete attempt
                return [7 /*endfinally*/];
            case 5: return [2 /*return*/];
        }
    });
}); };
// Helper for related concepts input (simple comma-separated string for MVP)
var handleRelatedConceptsInputChange = function (e, isEditing) {
    var concepts = e.target.value.split(',').map(function (c) { return c.trim(); }).filter(function (c) { return c; });
    if (isEditing) {
        setEditingRelatedConcepts(concepts);
    }
    else {
        setNewRelatedConcepts(concepts);
    }
};
var getRelatedConceptsInputString = function (isEditing) {
    var concepts = isEditing ? editingRelatedConcepts : newRelatedConcepts;
    return concepts.join(', ');
};
// Ensure user is logged in before rendering content
if (!(systemContext === null || systemContext === void 0 ? void 0 : systemContext.currentUser)) {
    // This case should ideally be handled by ProtectedRoute, but as a fallback:
    return (<div className/>);
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
return (<div className/>);
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
    <div className/>;
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
    <div className/>;
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
        <p className/>);
        "text-red-400 text-sm mt-4\">Error: {error}</p>\
                     )}\
               </form>\
            </div>;
    }
    { /* Glossary List */ }
    <div className/>;
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
        <div className/>;
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
            <div className/>;
            "mb-4\">\
                                    <h5 className=\"text-neutral-300 text-sm font-semibold mb-2\">Related Concepts:</h5>\
                                    <p className=\"text-neutral-400 text-xs\">{term.related_concepts.join(', ')}</p>\
                                </div>\
                            ))}\
            ;
            div > ;
        }
        { /* Term Actions */ }
        <div className/>;
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
    ""(__makeTemplateObject([""], [""]));
}
