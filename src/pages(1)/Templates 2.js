"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
""(templateObject_1 || (templateObject_1 = __makeTemplateObject(["typescript\n// src/pages/Templates.tsx\n// Templates Page\n// Displays and manages user-defined templates.\n// --- New: Create a page for the Templates UI ---\n// --- New: Implement fetching and displaying templates ---\n// --- New: Add UI for creating, editing, and deleting templates ---\n// --- New: Add Realtime Updates for templates ---\n// --- New: Add UI for filtering templates by type and tags ---\n// --- New: Add UI for using a template (placeholder) ---\n\n\nimport React, { useEffect, useState } from 'react';\nimport { TemplateService } from '../core/templates/TemplateService'; // To fetch and manage templates\nimport { AuthorityForgingEngine } from '../core/authority/AuthorityForgingEngine'; // Use for action recording\nimport { Template } from '../interfaces'; // Import Template type\nimport { BookOpen, ChevronDown, ChevronUp, Trash2, Edit, PlusCircle, Save, Loader2, Info, Tag, XCircle, Filter, Play } from 'lucide-react'; // Import icons including Filter, Play\n\n\n// Access core modules from the global window object (for MVP simplicity)\n// In a real app, use React Context or dependency injection\ndeclare const window: any;\nconst templateService: TemplateService = window.systemContext?.templateService; // The Template Service\nconst authorityForgingEngine: any = window.systemContext?.authorityForgingEngine; // Use any for action recording (\u6B0A\u80FD\u935B\u9020)\nconst systemContext: any = window.systemContext; // Access the full context for currentUser\n\n\n// Define available template types for filtering and creation\nconst TEMPLATE_TYPES = ['knowledge_record', 'task', 'agentic_flow', 'prompt', 'document'] as const;\ntype TemplateType = typeof TEMPLATE_TYPES[number];\n\n\nconst Templates: React.FC = () => {\n  const [templates, setTemplates] = useState<Template[]>([]); // State to hold templates\n  const [loading, setLoading] = useState(true);\n  const [error, setError] = useState<string | null>(null);\n  const [expandedTemplates, setExpandedTemplates] = useState<Record<string, boolean>>({}); // State to track expanded templates\n\n  // --- State for creating new template ---\n  const [showCreateModal, setShowCreateModal] = useState(false);\n  const [newTemplateName, setNewTemplateName] = useState('');\n  const [newTemplateDescription, setNewTemplateDescription] = useState('');\n  const [newTemplateType, setNewTemplateType] = useState<TemplateType>('prompt'); // Default type\n  const [newTemplateContent, setNewTemplateContent] = useState('{}'); // Content as JSON string\n  const [newTemplateIsPublic, setNewTemplateIsPublic] = useState(false);\n  const [newTemplateTags, setNewTemplateTags] = useState<string[]>([]);\n  const [isSavingTemplate, setIsSavingTemplate] = useState(false);\n  const [createError, setCreateError] = useState<string | null>(null); // Error specific to creation\n  const [newTemplateContentError, setNewTemplateContentError] = useState<string | null>(null); // Error for new template content JSON\n  // --- End New ---\n\n  // --- State for editing template ---\n  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null); // The template being edited\n  const [editingTemplateName, setEditingTemplateName] = useState('');\n  const [editingTemplateDescription, setEditingTemplateDescription] = useState('');\n  const [editingTemplateType, setEditingTemplateType] = useState<TemplateType>('prompt'); // Default type\n  const [editingTemplateContent, setEditingTemplateContent] = useState('{}'); // Content as JSON string\n  const [editingTemplateIsPublic, setEditingTemplateIsPublic] = useState(false);\n  const [editingTemplateTags, setEditingTemplateTags] = useState<string[]>([]);\n  const [isUpdatingTemplate, setIsUpdatingTemplate] = useState(false);\n  const [editingTemplateContentError, setEditingTemplateContentError] = useState<string | null>(null); // Error for editing template content JSON\n  // --- End New ---\n\n  // --- New: State for filtering ---\n  const [filterType, setFilterType] = useState<TemplateType | ''>(''); // Filter by type\n  const [filterTags, setFilterTags] = useState(''); // Filter by tags (comma-separated input)\n  const [filterTagsArray, setFilterTagsArray] = useState<string[]>([]); // Filter tags as array\n  // --- End New ---\n\n\n  const fetchTemplates = async (typeFilter?: TemplateType, tagsFilter?: string[]) => {\n       const userId = systemContext?.currentUser?.id;\n       if (!templateService || !userId) {\n            setError(\"TemplateService module not initialized or user not logged in.\");\n            setLoading(false);\n            return;\n        }\n      setLoading(true);\n      setError(null); // Clear main error when fetching\n      try {\n          // Fetch templates for the current user (their private and all public)\n          const userTemplates = await templateService.getTemplates(userId, typeFilter, tagsFilter); // Pass userId, typeFilter, tagsFilter\n          setTemplates(userTemplates);\n      } catch (err: any) {\n          console.error('Error fetching templates:', err);\n          setError("], ["typescript\n// src/pages/Templates.tsx\n// Templates Page\n// Displays and manages user-defined templates.\n// --- New: Create a page for the Templates UI ---\n// --- New: Implement fetching and displaying templates ---\n// --- New: Add UI for creating, editing, and deleting templates ---\n// --- New: Add Realtime Updates for templates ---\n// --- New: Add UI for filtering templates by type and tags ---\n// --- New: Add UI for using a template (placeholder) ---\n\n\nimport React, { useEffect, useState } from 'react';\nimport { TemplateService } from '../core/templates/TemplateService'; // To fetch and manage templates\nimport { AuthorityForgingEngine } from '../core/authority/AuthorityForgingEngine'; // Use for action recording\nimport { Template } from '../interfaces'; // Import Template type\nimport { BookOpen, ChevronDown, ChevronUp, Trash2, Edit, PlusCircle, Save, Loader2, Info, Tag, XCircle, Filter, Play } from 'lucide-react'; // Import icons including Filter, Play\n\n\n// Access core modules from the global window object (for MVP simplicity)\n// In a real app, use React Context or dependency injection\ndeclare const window: any;\nconst templateService: TemplateService = window.systemContext?.templateService; // The Template Service\nconst authorityForgingEngine: any = window.systemContext?.authorityForgingEngine; // Use any for action recording (\u6B0A\u80FD\u935B\u9020)\nconst systemContext: any = window.systemContext; // Access the full context for currentUser\n\n\n// Define available template types for filtering and creation\nconst TEMPLATE_TYPES = ['knowledge_record', 'task', 'agentic_flow', 'prompt', 'document'] as const;\ntype TemplateType = typeof TEMPLATE_TYPES[number];\n\n\nconst Templates: React.FC = () => {\n  const [templates, setTemplates] = useState<Template[]>([]); // State to hold templates\n  const [loading, setLoading] = useState(true);\n  const [error, setError] = useState<string | null>(null);\n  const [expandedTemplates, setExpandedTemplates] = useState<Record<string, boolean>>({}); // State to track expanded templates\n\n  // --- State for creating new template ---\n  const [showCreateModal, setShowCreateModal] = useState(false);\n  const [newTemplateName, setNewTemplateName] = useState('');\n  const [newTemplateDescription, setNewTemplateDescription] = useState('');\n  const [newTemplateType, setNewTemplateType] = useState<TemplateType>('prompt'); // Default type\n  const [newTemplateContent, setNewTemplateContent] = useState('{}'); // Content as JSON string\n  const [newTemplateIsPublic, setNewTemplateIsPublic] = useState(false);\n  const [newTemplateTags, setNewTemplateTags] = useState<string[]>([]);\n  const [isSavingTemplate, setIsSavingTemplate] = useState(false);\n  const [createError, setCreateError] = useState<string | null>(null); // Error specific to creation\n  const [newTemplateContentError, setNewTemplateContentError] = useState<string | null>(null); // Error for new template content JSON\n  // --- End New ---\n\n  // --- State for editing template ---\n  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null); // The template being edited\n  const [editingTemplateName, setEditingTemplateName] = useState('');\n  const [editingTemplateDescription, setEditingTemplateDescription] = useState('');\n  const [editingTemplateType, setEditingTemplateType] = useState<TemplateType>('prompt'); // Default type\n  const [editingTemplateContent, setEditingTemplateContent] = useState('{}'); // Content as JSON string\n  const [editingTemplateIsPublic, setEditingTemplateIsPublic] = useState(false);\n  const [editingTemplateTags, setEditingTemplateTags] = useState<string[]>([]);\n  const [isUpdatingTemplate, setIsUpdatingTemplate] = useState(false);\n  const [editingTemplateContentError, setEditingTemplateContentError] = useState<string | null>(null); // Error for editing template content JSON\n  // --- End New ---\n\n  // --- New: State for filtering ---\n  const [filterType, setFilterType] = useState<TemplateType | ''>(''); // Filter by type\n  const [filterTags, setFilterTags] = useState(''); // Filter by tags (comma-separated input)\n  const [filterTagsArray, setFilterTagsArray] = useState<string[]>([]); // Filter tags as array\n  // --- End New ---\n\n\n  const fetchTemplates = async (typeFilter?: TemplateType, tagsFilter?: string[]) => {\n       const userId = systemContext?.currentUser?.id;\n       if (!templateService || !userId) {\n            setError(\"TemplateService module not initialized or user not logged in.\");\n            setLoading(false);\n            return;\n        }\n      setLoading(true);\n      setError(null); // Clear main error when fetching\n      try {\n          // Fetch templates for the current user (their private and all public)\n          const userTemplates = await templateService.getTemplates(userId, typeFilter, tagsFilter); // Pass userId, typeFilter, tagsFilter\n          setTemplates(userTemplates);\n      } catch (err: any) {\n          console.error('Error fetching templates:', err);\n          setError("])));
Failed;
to;
load;
templates: $;
{
    err.message;
}
");\n      } finally {\n          setLoading(false);\n      }\n  };\n\n  useEffect(() => {\n    // Fetch data when the component mounts or when the user changes or filters change\n    if (systemContext?.currentUser?.id) {\n        fetchTemplates(filterType === '' ? undefined : filterType, filterTagsArray.length > 0 ? filterTagsArray : undefined); // Fetch with current filters\n    }\n\n    // --- New: Subscribe to realtime updates for templates table ---\n    let unsubscribeTemplateInsert: (() => void) | undefined;\n    let unsubscribeTemplateUpdate: (() => void) | undefined;\n    let unsubscribeTemplateDelete: (() => void) | undefined;\n\n\n    if (templateService?.context?.eventBus) { // Check if TemplateService and its EventBus are available\n        const eventBus = templateService.context.eventBus;\n        const userId = systemContext?.currentUser?.id;\n\n        // Subscribe to template insert events\n        unsubscribeTemplateInsert = eventBus.subscribe('template_insert', (payload: Template) => {\n            // Add the new template if it's public or owned by the current user and matches current filters\n            if ((payload.user_id === userId || payload.is_public) &&\n                (filterType === '' || payload.type === filterType) &&\n                (filterTagsArray.length === 0 || (payload.tags && payload.tags.some(tag => filterTagsArray.includes(tag))))\n            ) {\n                console.log('Templates page received template_insert event:', payload);\n                // Add the new template and keep sorted by name alphabetically\n                setTemplates(prevTemplates => [...prevTemplates, payload].sort((a, b) => a.name.localeCompare(b.name)));\n            }\n        });\n\n         // Subscribe to template update events\n         unsubscribeTemplateUpdate = eventBus.subscribe('template_update', (payload: Template) => {\n             // Update the specific template if it's public or owned by the current user and matches current filters\n             if ((payload.user_id === userId || payload.is_public) &&\n                 (filterType === '' || payload.type === filterType) &&\n                 (filterTagsArray.length === 0 || (payload.tags && payload.tags.some(tag => filterTagsArray.includes(tag))))\n             ) {\n                 console.log('Templates page received template_update event:', payload);\n                 // Update the specific template in the state\n                 setTemplates(prevTemplates => prevTemplates.map(template => template.id === payload.id ? payload : template));\n             } else {\n                 // If a template the user could previously see (e.g., public) is updated to be private and not owned by them,\n                 // or if it no longer matches the filters, remove it.\n                 setTemplates(prevTemplates => prevTemplates.filter(template => template.id !== payload.id));\n             }\n         });\n\n          // Subscribe to template delete events\n          unsubscribeTemplateDelete = eventBus.subscribe('template_delete', (payload: { templateId: string, userId: string }) => {\n             // Remove the deleted template from the state if it was visible to the user\n             // RLS should prevent the user from receiving delete events for templates they couldn't see anyway.\n             console.log('Templates page received template_delete event:', payload);\n             setTemplates(prevTemplates => prevTemplates.filter(template => template.id !== payload.templateId));\n         });\n    }\n    // --- End New ---\n\n\n    return () => {\n        // Unsubscribe on component unmount\n        unsubscribeTemplateInsert?.();\n        unsubscribeTemplateUpdate?.();\n        unsubscribeTemplateDelete?.();\n    };\n\n  }, [systemContext?.currentUser?.id, templateService, filterType, filterTagsArray]); // Re-run effect when user ID, service, or filters change\n\n\n    const toggleExpandTemplate = (templateId: string) => {\n        setExpandedTemplates(prevState => ({\n            ...prevState,\n            [templateId]: !prevState[templateId]\n        }));\n    };\n\n    // --- New: Handle Create Template ---\n    const handleOpenCreateModal = () => {\n        setShowCreateModal(true);\n        setNewTemplateName('');\n        setNewTemplateDescription('');\n        setNewTemplateType('prompt'); // Default type\n        setNewTemplateContent('{}'); // Default empty JSON\n        setNewTemplateIsPublic(false);\n        setNewTemplateTags([]);\n        setCreateError(null);\n        setNewTemplateContentError(null);\n    };\n\n    const handleCloseCreateModal = () => {\n        setShowCreateModal(false);\n        setNewTemplateName('');\n        setNewTemplateDescription('');\n        setNewTemplateType('prompt');\n        setNewTemplateContent('{}');\n        setNewTemplateIsPublic(false);\n        setNewTemplateTags([]);\n        setCreateError(null);\n        setNewTemplateContentError(null);\n    };\n\n    const handleCreateTemplate = async (e: React.FormEvent) => {\n        e.preventDefault();\n        const userId = systemContext?.currentUser?.id;\n        if (!templateService || !userId || !newTemplateName.trim() || newTemplateContent.trim() === '') {\n            setCreateError(\"TemplateService module not initialized, user not logged in, or name/content is empty.\");\n            return;\n        }\n\n        // Validate JSON content\n        let parsedContent: any;\n        try {\n            parsedContent = JSON.parse(newTemplateContent);\n            setNewTemplateContentError(null); // Clear error if valid\n        } catch (err: any) {\n            setNewTemplateContentError(";
Invalid;
JSON;
content: $;
{
    err.message;
}
");\n            return; // Stop if JSON is invalid\n        }\n\n        setIsSavingTemplate(true);\n        setCreateError(null);\n        try {\n            const templateDetails: Omit<Template, 'id' | 'created_at' | 'updated_at'> = {\n                name: newTemplateName.trim(),\n                description: newTemplateDescription.trim() || undefined,\n                type: newTemplateType,\n                content: parsedContent, // Use parsed JSON content\n                is_public: newTemplateIsPublic,\n                tags: newTemplateTags.map(tag => tag.trim()).filter(tag => tag),\n                user_id: userId, // Ensure user_id is included\n            };\n\n            // Create the template\n            const createdTemplate = await templateService.createTemplate(templateDetails, userId); // Pass templateDetails and userId\n\n            if (createdTemplate) {\n                alert(";
Template;
"${createdTemplate.name}\" created successfully!`);;
console.log('Created new template:', createdTemplate);
handleCloseCreateModal(); // Close modal
// State update handled by realtime listener
// Simulate recording user action
authorityForgingEngine === null || authorityForgingEngine === void 0 ? void 0 : authorityForgingEngine.recordAction({
    type: 'web:templates:create',
    details: { templateId: createdTemplate.id, name: createdTemplate.name, type: createdTemplate.type, isPublic: createdTemplate.is_public },
    context: { platform: 'web', page: 'templates' },
    user_id: userId, // Associate action with user
});
{
    setCreateError('Failed to create template.');
}
try { }
catch (err) {
    console.error('Error creating template:', err);
    setCreateError("Failed to create template: ".concat(err.message));
}
finally {
    setIsSavingTemplate(false);
}
;
// --- End New ---
// --- New: Handle Edit Template ---
var handleEditTemplateClick = function (template) {
    setEditingTemplate(template);
    setEditingTemplateName(template.name);
    setEditingTemplateDescription(template.description || '');
    setEditingTemplateType(template.type);
    setEditingTemplateContent(JSON.stringify(template.content || {}, null, 2)); // Content as JSON string
    setEditingTemplateIsPublic(template.is_public);
    setEditingTemplateTags(template.tags || []);
    setError(null); // Clear previous main errors
    setEditingTemplateContentError(null); // Clear previous content errors
};
var handleUpdateTemplate = function (e) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, parsedContent, updates, updatedTemplate, err_1;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                e.preventDefault();
                userId = (_a = systemContext === null || systemContext === void 0 ? void 0 : systemContext.currentUser) === null || _a === void 0 ? void 0 : _a.id;
                if (!templateService || !editingTemplate || !userId || editingTemplateContent.trim() === '')
                    return [2 /*return*/]; // Safety checks
                if (!editingTemplateName.trim()) {
                    alert('Please enter a template name.');
                    return [2 /*return*/];
                }
                try {
                    parsedContent = JSON.parse(editingTemplateContent);
                    setEditingTemplateContentError(null); // Clear error if valid
                }
                catch (err) {
                    setEditingTemplateContentError("Invalid JSON content: ".concat(err.message));
                    return [2 /*return*/]; // Stop if JSON is invalid
                }
                setIsUpdatingTemplate(true);
                setError(null);
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, 4, 5]);
                updates = {
                    name: editingTemplateName.trim(),
                    description: editingTemplateDescription.trim() || undefined,
                    type: editingTemplateType,
                    content: parsedContent, // Use parsed JSON content
                    is_public: editingTemplateIsPublic, // Allow changing public status (requires admin RLS or specific policy)
                    tags: editingTemplateTags.map(function (tag) { return tag.trim(); }).filter(function (tag) { return tag; }),
                };
                return [4 /*yield*/, templateService.updateTemplate(editingTemplate.id, updates, userId)];
            case 2:
                updatedTemplate = _b.sent();
                if (updatedTemplate) {
                    console.log('Template updated:', updatedTemplate);
                    setEditingTemplate(null); // Close edit form
                    setEditingTemplateName('');
                    setEditingTemplateDescription('');
                    setEditingTemplateType('prompt');
                    setEditingTemplateContent('{}');
                    setEditingTemplateIsPublic(false);
                    setEditingTemplateTags([]);
                    // State update handled by realtime listener
                    alert("Template \"".concat(updatedTemplate.name, "\" updated successfully!"));
                    // Simulate recording user action
                    authorityForgingEngine === null || authorityForgingEngine === void 0 ? void 0 : authorityForgingEngine.recordAction({
                        type: 'web:templates:update',
                        details: { templateId: updatedTemplate.id, name: updatedTemplate.name, type: updatedTemplate.type, isPublic: updatedTemplate.is_public },
                        context: { platform: 'web', page: 'templates' },
                        user_id: userId, // Associate action with user
                    });
                }
                else {
                    // This case happens if the template was not found or did not belong to the user (or was public)
                    setError('Failed to update template. You can only edit your private templates.');
                }
                return [3 /*break*/, 5];
            case 3:
                err_1 = _b.sent();
                console.error('Error updating template:', err_1);
                setError("Failed to update template: ".concat(err_1.message));
                return [3 /*break*/, 5];
            case 4:
                setIsUpdatingTemplate(false);
                return [7 /*endfinally*/];
            case 5: return [2 /*return*/];
        }
    });
}); };
var handleCancelEdit = function () {
    setEditingTemplate(null);
    setEditingTemplateName('');
    setEditingTemplateDescription('');
    setEditingTemplateType('prompt');
    setEditingTemplateContent('{}');
    setEditingTemplateIsPublic(false);
    setEditingTemplateTags([]);
    setError(null);
    setEditingTemplateContentError(null);
};
// --- End New ---
var handleDeleteTemplate = function (templateId) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, success_1, err_2;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                userId = (_a = systemContext === null || systemContext === void 0 ? void 0 : systemContext.currentUser) === null || _a === void 0 ? void 0 : _a.id;
                if (!templateService || !userId) {
                    alert("TemplateService module not initialized or user not logged in.\"););
                    return [2 /*return*/];
                }
                // Note: Users can only delete their *private* templates via this method in the service RLS.
                // If they try to delete a public template, the service will return false.
                if (!confirm("Are you sure you want to delete this template? You can only delete your private templates."))
                    return [2 /*return*/];
                setError(null);
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, 4, 5]);
                return [4 /*yield*/, templateService.deleteTemplate(templateId, userId)];
            case 2:
                success_1 = _b.sent();
                if (success_1) {
                    console.log('Template deleted:', templateId);
                    // State update handled by realtime listener
                    alert('Template deleted successfully!');
                    // Simulate recording user action
                    authorityForgingEngine === null || authorityForgingEngine === void 0 ? void 0 : authorityForgingEngine.recordAction({
                        type: 'web:templates:delete',
                        details: { templateId: templateId },
                        context: { platform: 'web', page: 'templates' },
                        user_id: userId, // Associate action with user
                    });
                }
                else {
                    setError('Failed to delete template. You can only delete your private templates.');
                    alert('Failed to delete template. You can only delete your private templates.');
                }
                return [3 /*break*/, 5];
            case 3:
                err_2 = _b.sent();
                console.error('Error deleting template:', err_2);
                setError("Failed to delete template: ".concat(err_2.message));
                alert("Failed to delete template: ".concat(err_2.message));
                return [3 /*break*/, 5];
            case 4:
                setLoading(false); // Ensure loading is false after delete attempt
                return [7 /*endfinally*/];
            case 5: return [2 /*return*/];
        }
    });
}); };
// --- New: Handle Tag Input Change ---
var handleTagInputChange = function (e, isEditing) {
    var tags = e.target.value.split(',').map(function (tag) { return tag.trim(); }).filter(function (tag) { return tag; });
    if (isEditing) {
        setEditingTemplateTags(tags);
    }
    else {
        setNewTemplateTags(tags);
    }
};
var getTagInputString = function (tags) {
    return (tags || []).join(', ');
};
// --- End New ---
// --- New: Handle Filter Tags Input Change ---
var handleFilterTagsInputChange = function (e) {
    setFilterTags(e.target.value);
    var tags = e.target.value.split(',').map(function (tag) { return tag.trim(); }).filter(function (tag) { return tag; });
    setFilterTagsArray(tags);
};
// --- End New ---
// --- New: Handle Use Template (Placeholder) ---
var handleUseTemplate = function (template) {
    var _a;
    console.log("Attempting to use template: ".concat(template.name, " (").concat(template.id, ")"));
    // Simulate recording user action
    var userId = (_a = systemContext === null || systemContext === void 0 ? void 0 : systemContext.currentUser) === null || _a === void 0 ? void 0 : _a.id;
    if (userId) {
        authorityForgingEngine === null || authorityForgingEngine === void 0 ? void 0 : authorityForgingEngine.recordAction({
            type: 'web:templates:use',
            details: { templateId: template.id, name: template.name, type: template.type },
            context: { platform: 'web', page: 'templates' },
            user_id: userId, // Associate action with user
        });
    }
    // TODO: Implement actual logic to use the template based on its type
    // This would involve sending a message to the appropriate agent (e.g., SelfNavigationAgent for tasks/flows)
    // or updating UI state (e.g., pre-filling a form for knowledge_record/prompt).
    alert("Simulating using template \"".concat(template.name, "\" (Type: ").concat(template.type, "). Actual usage logic is not yet implemented."));
    // Example: If type is 'prompt', maybe copy content to clipboard or pre-fill chat input
    // if (template.type === 'prompt' && typeof template.content === 'string') {
    //     navigator.clipboard.writeText(template.content).then(() => alert('Prompt copied to clipboard!')).catch(err => console.error('Failed to copy prompt:', err));
    // }
    // Example: If type is 'task', send message to SelfNavigationAgent
    // if (template.type === 'task' && typeof template.content === 'object') {
    //     systemContext?.messageBus?.sendMessage({ type: 'create_task', payload: template.content, recipient: 'self_navigation' });
    // }
};
// --- End New ---
// Ensure user is logged in before rendering content
if (!(systemContext === null || systemContext === void 0 ? void 0 : systemContext.currentUser)) {
    // This case should ideally be handled by ProtectedRoute, but as a fallback:
    return (<div className="container mx-auto p-4 flex justify-center">
               <div className="bg-neutral-800/50 p-8 rounded-lg shadow-xl w-full max-w-md text-center text-neutral-300">
                   <p>Please log in to view your templates.</p>
               </div>
            </div>);
}
return (<div className="container mx-auto p-4">
      <div className="bg-neutral-800/50 p-6 rounded-lg shadow-xl">
        <h2 className="text-3xl font-bold text-blue-400 mb-6">Templates (範本庫)</h2>
        <p className="text-neutral-300 mb-8">Manage your reusable templates for knowledge records, tasks, prompts, and workflows.</p>

        {/* New: Create New Template Button */}
        {!editingTemplate && (<div className="mb-8 p-4 bg-neutral-700/50 rounded-lg">
                 <h3 className="text-xl font-semibold text-blue-300 mb-3">Create New Template</h3>
                 <button className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition disabled:opacity-50" onClick={handleOpenCreateModal} disabled={isSavingTemplate || isUpdatingTemplate}>
                     <PlusCircle size={20} className="inline-block mr-2"/> Create Template
                 </button>
            </div>)}
        {/* End New */}

        {/* New: Filter Section */}
        <div className="mb-8 p-4 bg-neutral-700/50 rounded-lg">
             <h3 className="text-xl font-semibold text-blue-300 mb-3 flex items-center gap-2"><Filter size={20}/> Filter Templates</h3>
             <div className="flex flex-wrap items-center gap-4">
                 <div>
                     <label htmlFor="filterType" className="block text-neutral-300 text-sm font-semibold mb-1">Type:</label>
                     <select id="filterType" className="p-2 rounded-md bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500" value={filterType} onChange={function (e) { return setFilterType(e.target.value); }} disabled={loading}>
                         <option value="">All Types</option>
                         {TEMPLATE_TYPES.map(function (type) { return (<option key={type} value={type}>{type.replace(/_/g, ' ')}</option>); })}
                     </select>
                 </div>
                  <div>
                     <label htmlFor="filterTags" className="block text-neutral-300 text-sm font-semibold mb-1">Tags (comma-separated):</label>
                     <input id="filterTags" type="text" className="p-2 rounded-md bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" value={filterTags} onChange={handleFilterTagsInputChange} placeholder="e.g., daily, work" disabled={loading}/>
                 </div>
             </div>
        </div>
        {/* End New */}

        {/* Templates List */}
        <div className="p-4 bg-neutral-700/50 rounded-lg">
            <h3 className="text-xl font-semibold text-blue-300 mb-3">Your Templates ({templates.length})</h3>
            {loading && !isSavingTemplate && !isUpdatingTemplate ? ( // Show loading only if not currently saving/updating
    <p className="text-neutral-400">Loading templates...</p>) : error && !showCreateModal && !editingTemplate ? ( // Show main error if not in create/edit mode
    <p className="text-red-400">Error: {error}</p>) : templates.length === 0 ? (<p className="text-neutral-400">No templates found yet{filterType || filterTags ? ' matching your filters' : ''}. Create one using the form above.</p>) : (<ul className="space-y-4">
                {templates.map(function (template) {
            var _a, _b;
            return (<li key={template.id} className={"bg-neutral-600/50 p-4 rounded-md border-l-4 border-blue-500"}>
                    <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-3">
                            <BookOpen size={20} className="text-blue-400"/>
                            <h4 className="font-semibold text-blue-200">{template.name}</h4>
                        </div>
                         {/* Expand/Collapse Button */}
                         <div className="flex gap-2 items-center">
                             <button onClick={function () { return toggleExpandTemplate(template.id); }} className="text-neutral-400 hover:text-white transition">
                                {expandedTemplates[template.id] ? <ChevronUp size={20}/> : <ChevronDown size={20}/>}
                             </button>
                         </div>
                         {/* End New */}
                    </div>
                    <p className="text-neutral-300 text-sm mb-2">Type: {template.type.replace(/_/g, ' ').toUpperCase()}</p>
                    <p className="text-neutral-300 text-sm mb-2">{template.description || 'No description.'}</p>

                    {/* Content Preview (Collapsible) */}
                    {expandedTemplates[template.id] && ((<div className="mt-4 border-t border-neutral-600 pt-4">
                             <h5 className="text-neutral-300 text-sm font-semibold mb-2">Content:</h5>
                             <pre className="bg-neutral-800 p-3 rounded-md text-neutral-200 text-xs font-mono overflow-x-auto max-h-48 scrollbar-thin scrollbar-thumb-neutral-600">
                                 {JSON.stringify(template.content || {}, null, 2)}
                             </pre>
                         </div>))}
                    <small className="text-neutral-400 text-xs block mt-2">
                        ID: {template.id}
                         {template.user_id && " | Owner: ".concat(template.user_id)}
                         {template.is_public ? ' | Public' : ' | Private'}
                         {template.tags && template.tags.length > 0 && " | Tags: ".concat(template.tags.join(', '))}
                         {template.created_at && " | Created: ".concat(new Date(template.created_at).toLocaleString())}
                         {template.updated_at && " | Last Updated: ".concat(new Date(template.updated_at).toLocaleString())}
                    </small>

                    {/* Template Actions */}
                    <div className="mt-4 flex flex-wrap gap-2"> {/* Use flex-wrap for smaller screens */}
                         {/* New: Use Template Button */}
                         <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed" onClick={function () { return handleUseTemplate(template); }} disabled={isSavingTemplate || isUpdatingTemplate}>
                             <Play size={16} className="inline-block mr-1"/> Use Template (TODO)
                         </button>
                         {/* End New */}
                         {/* Edit Button (Only show for user's own templates) */}
                         {template.user_id === ((_a = systemContext === null || systemContext === void 0 ? void 0 : systemContext.currentUser) === null || _a === void 0 ? void 0 : _a.id) && !template.is_public && ((<button className="px-3 py-1 text-sm bg-yellow-600 text-white rounded hover:bg-yellow-700 transition disabled:opacity-50 disabled:cursor-not-allowed" onClick={function () { return handleEditTemplateClick(template); }} disabled={isSavingTemplate || isUpdatingTemplate}>
                                <Edit size={16} className="inline-block mr-1"/> Edit
                             </button>))}
                         {/* Delete Button (Only show for user's own templates) */}
                         {template.user_id === ((_b = systemContext === null || systemContext === void 0 ? void 0 : systemContext.currentUser) === null || _b === void 0 ? void 0 : _b.id) && !template.is_public && ((<button className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed" onClick={function () { return handleDeleteTemplate(template.id); }} disabled={isSavingTemplate || isUpdatingTemplate}>
                                <Trash2 size={16} className="inline-block mr-1"/> Delete
                             </button>))}
                         {/* TODO: Add Copy button (Part of 權能鍛造: 觀察 - record action) */}
                    </div>
                  </li>);
        })}\n              </ul>)}
        </div>

        {/* New: Create Template Modal */}
        {showCreateModal && ((<div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                 <div className="bg-neutral-800 p-8 rounded-lg shadow-xl w-full max-w-md max-h-[90%] flex flex-col"> {/* Added flex-col and max-height */}
                     <div className="flex justify-between items-center mb-4">
                         <h3 className="text-xl font-semibold text-blue-300">Create New Template</h3>
                         <button type="button" onClick={handleCloseCreateModal} className="text-neutral-400 hover:text-white transition" disabled={isSavingTemplate}>
                             <XCircle size={24}/>
                         </button>
                     </div>
                     <form onSubmit={handleCreateTemplate} className="flex-grow flex flex-col overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-700 pr-2"> {/* Added flex-grow, flex-col, overflow, pr-2 */}
                         <div className="mb-4">
                             <label htmlFor="newTemplateName" className="block text-neutral-300 text-sm font-semibold mb-2">Name:</label>
                             <input id="newTemplateName" type="text" className="w-full p-2 rounded-md bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500" value={newTemplateName} onChange={function (e) { return setNewTemplateName(e.target.value); }} placeholder="Enter template name" disabled={isSavingTemplate} required/>
                         </div>
                          <div className="mb-4">
                             <label htmlFor="newTemplateDescription" className="block text-neutral-300 text-sm font-semibold mb-2">Description (Optional):</label>
                             <textarea id="newTemplateDescription" className="w-full p-2 rounded-md bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500" value={newTemplateDescription} onChange={function (e) { return setNewTemplateDescription(e.target.value); }} placeholder="Enter description" rows={2} disabled={isSavingTemplate}/>
                         </div>
                         <div className="mb-4">
                             <label htmlFor="newTemplateType" className="block text-neutral-300 text-sm font-semibold mb-2">Type:</label>
                             <select id="newTemplateType" className="w-full p-2 rounded-md bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500" value={newTemplateType} onChange={function (e) { return setNewTemplateType(e.target.value); }} disabled={isSavingTemplate} required>
                                 {TEMPLATE_TYPES.map(function (type) { return (<option key={type} value={type}>{type.replace(/_/g, ' ')}</option>); })}
                             </select>
                         </div>
                          <div className="mb-4">
                             <label htmlFor="newTemplateContent" className="block text-neutral-300 text-sm font-semibold mb-2">Content (JSON):</label>
                              <textarea id="newTemplateContent" className={"w-full p-2 rounded-md bg-neutral-800 text-white border ".concat(newTemplateContentError ? 'border-red-500' : 'border-neutral-600', " focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-xs")} value={newTemplateContent} onChange={function (e) {
            setNewTemplateContent(e.target.value);
            try {
                JSON.parse(e.target.value);
                setNewTemplateContentError(null); // Clear error if JSON is valid
            }
            catch (err) {
                setNewTemplateContentError("Invalid JSON: ".concat(err.message));
            }
        }} rows={8} disabled={isSavingTemplate} required/>
                              {newTemplateContentError && <p className="text-red-400 text-xs mt-1">Error: {newTemplateContentError}</p>}
                          </div>
                           <div className="mb-4">
                             <label htmlFor="newTemplateTags" className="block text-neutral-300 text-sm font-semibold mb-2">Tags (comma-separated, Optional):</label>
                             <input id="newTemplateTags" type="text" className="w-full p-2 rounded-md bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" value={getTagInputString(newTemplateTags)} onChange={function (e) { return handleTagInputChange(e, false); }} placeholder="e.g., prompt, task, workflow" disabled={isSavingTemplate}/>
                         </div>
                          <div className="mb-4 flex items-center gap-2">
                              <input type="checkbox" id="newTemplateIsPublic" className="form-checkbox h-4 w-4 text-blue-600 rounded border-neutral-600 bg-neutral-800 focus:ring-blue-500" checked={newTemplateIsPublic} onChange={function (e) { return setNewTemplateIsPublic(e.target.checked); }} disabled={isSavingTemplate}/>
                              <label htmlFor="newTemplateIsPublic" className="text-neutral-300 text-sm">Make Public</label>
                          </div>

                         {createError && !isSavingTemplate && ( // Show create error only after it finishes
        <p className="text-red-400 text-sm mt-4">Error: {createError}</p>)}
                     </form>
                     <div className="flex gap-4 justify-end mt-4 flex-shrink-0"> {/* Added flex-shrink-0 */}
                         <button type="button" onClick={handleCloseCreateModal} className="px-6 py-2 bg-neutral-600 text-white font-semibold rounded-md hover:bg-neutral-700 transition" disabled={isSavingTemplate}>
                             Cancel
                         </button>
                         <button type="submit" form="create-template-form" // Link button to form by ID
     className="px-6 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed" disabled={isSavingTemplate || !newTemplateName.trim() || newTemplateContent.trim() === '{}' || !!newTemplateContentError}>
                             {isSavingTemplate ? 'Saving...' : 'Save Template'}
                         </button>
                     </div>
                 </div>
             </div>))}
        {/* End New */}

        {/* New: Edit Template Modal */}
        {editingTemplate && ((<div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                 <div className="bg-neutral-800 p-8 rounded-lg shadow-xl w-full max-w-md max-h-[90%] flex flex-col"> {/* Added flex-col and max-height */}
                     <div className="flex justify-between items-center mb-4">
                         <h3 className="text-xl font-semibold text-blue-300">Edit Template: {editingTemplate.name}</h3>
                         <button type="button" onClick={handleCancelEdit} className="text-neutral-400 hover:text-white transition" disabled={isUpdatingTemplate}>
                             <XCircle size={24}/>
                         </button>
                     </div>
                     <form onSubmit={handleUpdateTemplate} className="flex-grow flex flex-col overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-700 pr-2"> {/* Added flex-grow, flex-col, overflow, pr-2 */}
                         <div className="mb-4">
                             <label htmlFor="editingTemplateName" className="block text-neutral-300 text-sm font-semibold mb-2">Name:</label>
                             <input id="editingTemplateName" type="text" className="w-full p-2 rounded-md bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500" value={editingTemplateName} onChange={function (e) { return setEditingTemplateName(e.target.value); }} placeholder="Edit template name" disabled={isUpdatingTemplate} required/>
                         </div>
                          <div className="mb-4">
                             <label htmlFor="editingTemplateDescription" className="block text-neutral-300 text-sm font-semibold mb-2">Description (Optional):</label>
                             <textarea id="editingTemplateDescription" className="w-full p-2 rounded-md bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500" value={editingTemplateDescription} onChange={function (e) { return setEditingTemplateDescription(e.target.value); }} placeholder="Edit description" rows={2} disabled={isUpdatingTemplate}/>
                         </div>
                         <div className="mb-4">
                             <label htmlFor="editingTemplateType" className="block text-neutral-300 text-sm font-semibold mb-2">Type:</label>
                             <select id="editingTemplateType" className="w-full p-2 rounded-md bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500" value={editingTemplateType} onChange={function (e) { return setEditingTemplateType(e.target.value); }} disabled={isUpdatingTemplate} required>
                                 {TEMPLATE_TYPES.map(function (type) { return (<option key={type} value={type}>{type.replace(/_/g, ' ')}</option>); })}
                             </select>
                         </div>
                          <div className="mb-4">
                             <label htmlFor="editingTemplateContent" className="block text-neutral-300 text-sm font-semibold mb-2">Content (JSON):</label>
                              <textarea id="editingTemplateContent" className={"w-full p-2 rounded-md bg-neutral-800 text-white border ".concat(editingTemplateContentError ? 'border-red-500' : 'border-neutral-600', " focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-xs")} value={editingTemplateContent} onChange={function (e) {
            setEditingTemplateContent(e.target.value);
            try {
                JSON.parse(e.target.value);
                setEditingTemplateContentError(null); // Clear error if JSON is valid
            }
            catch (err) {
                setEditingTemplateContentError("Invalid JSON: ".concat(err.message));
            }
        }} rows={8} disabled={isUpdatingTemplate} required/>
                              {editingTemplateContentError && <p className="text-red-400 text-xs mt-1">Error: {editingTemplateContentError}</p>}
                          </div>
                           <div className="mb-4">
                             <label htmlFor="editingTemplateTags" className="block text-neutral-300 text-sm font-semibold mb-2">Tags (comma-separated, Optional):</label>
                             <input id="editingTemplateTags" type="text" className="w-full p-2 rounded-md bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" value={getTagInputString(editingTemplateTags)} onChange={function (e) { return handleTagInputChange(e, true); }} placeholder="e.g., prompt, task, workflow" disabled={isUpdatingTemplate}/>
                         </div>
                          <div className="mb-4 flex items-center gap-2">
                              <input type="checkbox" id="editingTemplateIsPublic" className="form-checkbox h-4 w-4 text-blue-600 rounded border-neutral-600 bg-neutral-800 focus:ring-blue-500" checked={editingTemplateIsPublic} onChange={function (e) { return setEditingTemplateIsPublic(e.target.checked); }} disabled={isUpdatingTemplate}/>
                              <label htmlFor="editingTemplateIsPublic" className="text-neutral-300 text-sm">Make Public</label>
                          </div>

                         {error && !isUpdatingTemplate && ( // Show save error only after it finishes
        <p className="text-red-400 text-sm mt-4">Error: {error}</p>)}
                     </form>
                     <div className="flex gap-4 justify-end mt-4 flex-shrink-0"> {/* Added flex-shrink-0 */}
                         <button type="button" onClick={handleCancelEdit} className="px-6 py-2 bg-neutral-600 text-white font-semibold rounded-md hover:bg-neutral-700 transition" disabled={isUpdatingTemplate}>
                             Cancel
                         </button>
                         <button type="submit" form="edit-template-form" // Link button to form by ID
     className="px-6 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed" disabled={isUpdatingTemplate || !editingTemplateName.trim() || editingTemplateContent.trim() === '{}' || !!editingTemplateContentError}>
                             {isUpdatingTemplate ? 'Saving...' : 'Save Changes'}
                         </button>
                     </div>
                 </div>
             </div>))}
        {/* End New */}

      </div>
    </div>);
;
exports.default = Templates;
""(templateObject_2 || (templateObject_2 = __makeTemplateObject([""], [""])));
var templateObject_1, templateObject_2;
