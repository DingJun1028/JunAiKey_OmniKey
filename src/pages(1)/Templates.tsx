```typescript
// src/pages/Templates.tsx
// Templates Page
// Displays and manages user-defined templates.
// --- New: Create a page for the Templates UI ---
// --- New: Implement fetching and displaying templates ---
// --- New: Add UI for creating, editing, and deleting templates ---
// --- New: Add Realtime Updates for templates ---
// --- New: Add UI for filtering templates by type and tags ---
// --- New: Add UI for using a template (placeholder) ---


import React, { useEffect, useState } from 'react';
import { TemplateService } from '../core/templates/TemplateService'; // To fetch and manage templates
import { AuthorityForgingEngine } from '../core/authority/AuthorityForgingEngine'; // Use for action recording
import { Template } from '../interfaces'; // Import Template type
import { BookOpen, ChevronDown, ChevronUp, Trash2, Edit, PlusCircle, Save, Loader2, Info, Tag, XCircle, Filter, Play } from 'lucide-react'; // Import icons including Filter, Play


// Access core modules from the global window object (for MVP simplicity)
// In a real app, use React Context or dependency injection
declare const window: any;
const templateService: TemplateService = window.systemContext?.templateService; // The Template Service
const authorityForgingEngine: any = window.systemContext?.authorityForgingEngine; // Use any for action recording (權能鍛造)
const systemContext: any = window.systemContext; // Access the full context for currentUser


// Define available template types for filtering and creation
const TEMPLATE_TYPES = ['knowledge_record', 'task', 'agentic_flow', 'prompt', 'document'] as const;
type TemplateType = typeof TEMPLATE_TYPES[number];


const Templates: React.FC = () => {
  const [templates, setTemplates] = useState<Template[]>([]); // State to hold templates
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedTemplates, setExpandedTemplates] = useState<Record<string, boolean>>({}); // State to track expanded templates

  // --- State for creating new template ---
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState('');
  const [newTemplateDescription, setNewTemplateDescription] = useState('');
  const [newTemplateType, setNewTemplateType] = useState<TemplateType>('prompt'); // Default type
  const [newTemplateContent, setNewTemplateContent] = useState('{}'); // Content as JSON string
  const [newTemplateIsPublic, setNewTemplateIsPublic] = useState(false);
  const [newTemplateTags, setNewTemplateTags] = useState<string[]>([]);
  const [isSavingTemplate, setIsSavingTemplate] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null); // Error specific to creation
  const [newTemplateContentError, setNewTemplateContentError] = useState<string | null>(null); // Error for new template content JSON
  // --- End New ---

  // --- State for editing template ---
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null); // The template being edited
  const [editingTemplateName, setEditingTemplateName] = useState('');
  const [editingTemplateDescription, setEditingTemplateDescription] = useState('');
  const [editingTemplateType, setEditingTemplateType] = useState<TemplateType>('prompt'); // Default type
  const [editingTemplateContent, setEditingTemplateContent] = useState('{}'); // Content as JSON string
  const [editingTemplateIsPublic, setEditingTemplateIsPublic] = useState(false);
  const [editingTemplateTags, setEditingTemplateTags] = useState<string[]>([]);
  const [isUpdatingTemplate, setIsUpdatingTemplate] = useState(false);
  const [editingTemplateContentError, setEditingTemplateContentError] = useState<string | null>(null); // Error for editing template content JSON
  // --- End New ---

  // --- New: State for filtering ---
  const [filterType, setFilterType] = useState<TemplateType | ''>(''); // Filter by type
  const [filterTags, setFilterTags] = useState(''); // Filter by tags (comma-separated input)
  const [filterTagsArray, setFilterTagsArray] = useState<string[]>([]); // Filter tags as array
  // --- End New ---


  const fetchTemplates = async (typeFilter?: TemplateType, tagsFilter?: string[]) => {
       const userId = systemContext?.currentUser?.id;
       if (!templateService || !userId) {
            setError("TemplateService module not initialized or user not logged in.");
            setLoading(false);
            return;
        }
      setLoading(true);
      setError(null); // Clear main error when fetching
      try {
          // Fetch templates for the current user (their private and all public)
          const userTemplates = await templateService.getTemplates(userId, typeFilter, tagsFilter); // Pass userId, typeFilter, tagsFilter
          setTemplates(userTemplates);
      } catch (err: any) {
          console.error('Error fetching templates:', err);
          setError(`Failed to load templates: ${err.message}`);
      } finally {
          setLoading(false);
      }
  };

  useEffect(() => {
    // Fetch data when the component mounts or when the user changes or filters change
    if (systemContext?.currentUser?.id) {
        fetchTemplates(filterType === '' ? undefined : filterType, filterTagsArray.length > 0 ? filterTagsArray : undefined); // Fetch with current filters
    }

    // --- New: Subscribe to realtime updates for templates table ---
    let unsubscribeTemplateInsert: (() => void) | undefined;
    let unsubscribeTemplateUpdate: (() => void) | undefined;
    let unsubscribeTemplateDelete: (() => void) | undefined;


    if (templateService?.context?.eventBus) { // Check if TemplateService and its EventBus are available
        const eventBus = templateService.context.eventBus;
        const userId = systemContext?.currentUser?.id;

        // Subscribe to template insert events
        unsubscribeTemplateInsert = eventBus.subscribe('template_insert', (payload: Template) => {
            // Add the new template if it's public or owned by the current user and matches current filters
            if ((payload.user_id === userId || payload.is_public) &&
                (filterType === '' || payload.type === filterType) &&
                (filterTagsArray.length === 0 || (payload.tags && payload.tags.some(tag => filterTagsArray.includes(tag))))
            ) {
                console.log('Templates page received template_insert event:', payload);
                // Add the new template and keep sorted by name alphabetically
                setTemplates(prevTemplates => [...prevTemplates, payload].sort((a, b) => a.name.localeCompare(b.name)));
            }
        });

         // Subscribe to template update events
         unsubscribeTemplateUpdate = eventBus.subscribe('template_update', (payload: Template) => {
             // Update the specific template if it's public or owned by the current user and matches current filters
             if ((payload.user_id === userId || payload.is_public) &&
                 (filterType === '' || payload.type === filterType) &&
                 (filterTagsArray.length === 0 || (payload.tags && payload.tags.some(tag => filterTagsArray.includes(tag))))
             ) {
                 console.log('Templates page received template_update event:', payload);
                 // Update the specific template in the state
                 setTemplates(prevTemplates => prevTemplates.map(template => template.id === payload.id ? payload : template));
             } else {
                 // If a template the user could previously see (e.g., public) is updated to be private and not owned by them,
                 // or if it no longer matches the filters, remove it.
                 setTemplates(prevTemplates => prevTemplates.filter(template => template.id !== payload.id));
             }
         });

          // Subscribe to template delete events
          unsubscribeTemplateDelete = eventBus.subscribe('template_delete', (payload: { templateId: string, userId: string }) => {
             // Remove the deleted template from the state if it was visible to the user
             // RLS should prevent the user from receiving delete events for templates they couldn't see anyway.
             console.log('Templates page received template_delete event:', payload);
             setTemplates(prevTemplates => prevTemplates.filter(template => template.id !== payload.templateId));
         });
    }
    // --- End New ---


    return () => {
        // Unsubscribe on component unmount
        unsubscribeTemplateInsert?.();
        unsubscribeTemplateUpdate?.();
        unsubscribeTemplateDelete?.();
    };

  }, [systemContext?.currentUser?.id, templateService, filterType, filterTagsArray]); // Re-run effect when user ID, service, or filters change


    const toggleExpandTemplate = (templateId: string) => {
        setExpandedTemplates(prevState => ({
            ...prevState,
            [templateId]: !prevState[templateId]
        }));
    };

    // --- New: Handle Create Template ---
    const handleOpenCreateModal = () => {
        setShowCreateModal(true);
        setNewTemplateName('');
        setNewTemplateDescription('');
        setNewTemplateType('prompt'); // Default type
        setNewTemplateContent('{}'); // Default empty JSON
        setNewTemplateIsPublic(false);
        setNewTemplateTags([]);
        setCreateError(null);
        setNewTemplateContentError(null);
    };

    const handleCloseCreateModal = () => {
        setShowCreateModal(false);
        setNewTemplateName('');
        setNewTemplateDescription('');
        setNewTemplateType('prompt');
        setNewTemplateContent('{}');
        setNewTemplateIsPublic(false);
        setNewTemplateTags([]);
        setCreateError(null);
        setNewTemplateContentError(null);
    };

    const handleCreateTemplate = async (e: React.FormEvent) => {
        e.preventDefault();
        const userId = systemContext?.currentUser?.id;
        if (!templateService || !userId || !newTemplateName.trim() || newTemplateContent.trim() === '') {
            setCreateError("TemplateService module not initialized, user not logged in, or name/content is empty.");
            return;
        }

        // Validate JSON content
        let parsedContent: any;
        try {
            parsedContent = JSON.parse(newTemplateContent);
            setNewTemplateContentError(null); // Clear error if valid
        } catch (err: any) {
            setNewTemplateContentError(`Invalid JSON content: ${err.message}`);
            return; // Stop if JSON is invalid
        }

        setIsSavingTemplate(true);
        setCreateError(null);
        try {
            const templateDetails: Omit<Template, 'id' | 'created_at' | 'updated_at'> = {
                name: newTemplateName.trim(),
                description: newTemplateDescription.trim() || undefined,
                type: newTemplateType,
                content: parsedContent, // Use parsed JSON content
                is_public: newTemplateIsPublic,
                tags: newTemplateTags.map(tag => tag.trim()).filter(tag => tag),
                user_id: userId, // Ensure user_id is included
            };

            // Create the template
            const createdTemplate = await templateService.createTemplate(templateDetails, userId); // Pass templateDetails and userId

            if (createdTemplate) {
                alert(`Template \"${createdTemplate.name}\" created successfully!`);
                console.log('Created new template:', createdTemplate);
                handleCloseCreateModal(); // Close modal
                // State update handled by realtime listener
                 // Simulate recording user action
                authorityForgingEngine?.recordAction({
                    type: 'web:templates:create',
                    details: { templateId: createdTemplate.id, name: createdTemplate.name, type: createdTemplate.type, isPublic: createdTemplate.is_public },
                    context: { platform: 'web', page: 'templates' },
                    user_id: userId, // Associate action with user
                });
            } else {
                setCreateError('Failed to create template.');
            }
        } catch (err: any) {
            console.error('Error creating template:', err);
            setCreateError(`Failed to create template: ${err.message}`);
        } finally {
            setIsSavingTemplate(false);
        }
    };
    // --- End New ---

    // --- New: Handle Edit Template ---
    const handleEditTemplateClick = (template: Template) => {
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

    const handleUpdateTemplate = async (e: React.FormEvent) => {
        e.preventDefault();
        const userId = systemContext?.currentUser?.id;
        if (!templateService || !editingTemplate || !userId || editingTemplateContent.trim() === '') return; // Safety checks

        if (!editingTemplateName.trim()) {
            alert('Please enter a template name.');
            return;
        }

        // Validate JSON content
        let parsedContent: any;
        try {
            parsedContent = JSON.parse(editingTemplateContent);
            setEditingTemplateContentError(null); // Clear error if valid
        } catch (err: any) {
            setEditingTemplateContentError(`Invalid JSON content: ${err.message}`);
            return; // Stop if JSON is invalid
        }

        setIsUpdatingTemplate(true);
        setError(null);
        try {
            const updates: Partial<Omit<Template, 'id' | 'user_id' | 'created_at' | 'updated_at'>> = {
                name: editingTemplateName.trim(),
                description: editingTemplateDescription.trim() || undefined,
                type: editingTemplateType,
                content: parsedContent, // Use parsed JSON content
                is_public: editingTemplateIsPublic, // Allow changing public status (requires admin RLS or specific policy)
                tags: editingTemplateTags.map(tag => tag.trim()).filter(tag => tag),
            };

            // Update the template
            // Note: Users can only update their *private* templates via this method in the service RLS.
            // If they try to edit a public template, the service will return undefined.
            const updatedTemplate = await templateService.updateTemplate(editingTemplate.id, updates, userId); // Pass templateId, updates, userId

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
                 alert(`Template \"${updatedTemplate.name}\" updated successfully!`);
                 // Simulate recording user action
                authorityForgingEngine?.recordAction({
                    type: 'web:templates:update',
                    details: { templateId: updatedTemplate.id, name: updatedTemplate.name, type: updatedTemplate.type, isPublic: updatedTemplate.is_public },
                    context: { platform: 'web', page: 'templates' },
                    user_id: userId, // Associate action with user
                });
            } else {
                // This case happens if the template was not found or did not belong to the user (or was public)
                setError('Failed to update template. You can only edit your private templates.');
            }
        } catch (err: any) {
            console.error('Error updating template:', err);
            setError(`Failed to update template: ${err.message}`);
        } finally {
            setIsUpdatingTemplate(false);
        }
    };

    const handleCancelEdit = () => {
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


   const handleDeleteTemplate = async (templateId: string) => {
       const userId = systemContext?.currentUser?.id;
       if (!templateService || !userId) {
           alert(\"TemplateService module not initialized or user not logged in.\");
           return;
       }
       // Note: Users can only delete their *private* templates via this method in the service RLS.
       // If they try to delete a public template, the service will return false.
       if (!confirm(`Are you sure you want to delete this template? You can only delete your private templates.`)) return;

       setError(null);
       try {
           // Delete the template
           const success = await templateService.deleteTemplate(templateId, userId); // Pass templateId and userId
           if (success) {
               console.log('Template deleted:', templateId);
               // State update handled by realtime listener
                alert('Template deleted successfully!');
                 // Simulate recording user action
                authorityForgingEngine?.recordAction({
                    type: 'web:templates:delete',
                    details: { templateId },
                    context: { platform: 'web', page: 'templates' },
                    user_id: userId, // Associate action with user
                });
           } else {
               setError('Failed to delete template. You can only delete your private templates.');
               alert('Failed to delete template. You can only delete your private templates.');
           }
       } catch (err: any) {
           console.error('Error deleting template:', err);
           setError(`Failed to delete template: ${err.message}`);
           alert(`Failed to delete template: ${err.message}`);
       } finally {
           setLoading(false); // Ensure loading is false after delete attempt
       }
   };

    // --- New: Handle Tag Input Change ---
    const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>, isEditing: boolean) => {
        const tags = e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag);
        if (isEditing) {
            setEditingTemplateTags(tags);
        } else {
            setNewTemplateTags(tags);
        }
    };

    const getTagInputString = (tags: string[] | undefined) => {
        return (tags || []).join(', ');
    };
    // --- End New ---

    // --- New: Handle Filter Tags Input Change ---
    const handleFilterTagsInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilterTags(e.target.value);
        const tags = e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag);
        setFilterTagsArray(tags);
    };
    // --- End New ---

    // --- New: Handle Use Template (Placeholder) ---
    const handleUseTemplate = (template: Template) => {
        console.log(`Attempting to use template: ${template.name} (${template.id})`);
         // Simulate recording user action
        const userId = systemContext?.currentUser?.id;
        if (userId) {
             authorityForgingEngine?.recordAction({
                type: 'web:templates:use',
                details: { templateId: template.id, name: template.name, type: template.type },
                context: { platform: 'web', page: 'templates' },
                user_id: userId, // Associate action with user
            });
        }

        // TODO: Implement actual logic to use the template based on its type
        // This would involve sending a message to the appropriate agent (e.g., SelfNavigationAgent for tasks/flows)
        // or updating UI state (e.g., pre-filling a form for knowledge_record/prompt).
        alert(`Simulating using template \"${template.name}\" (Type: ${template.type}). Actual usage logic is not yet implemented.`);

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
  if (!systemContext?.currentUser) {
       // This case should ideally be handled by ProtectedRoute, but as a fallback:
       return (
            <div className="container mx-auto p-4 flex justify-center">
               <div className="bg-neutral-800/50 p-8 rounded-lg shadow-xl w-full max-w-md text-center text-neutral-300">
                   <p>Please log in to view your templates.</p>
               </div>
            </div>
       );
  }


  return (
    <div className="container mx-auto p-4">
      <div className="bg-neutral-800/50 p-6 rounded-lg shadow-xl">
        <h2 className="text-3xl font-bold text-blue-400 mb-6">Templates (範本庫)</h2>
        <p className="text-neutral-300 mb-8">Manage your reusable templates for knowledge records, tasks, prompts, and workflows.</p>

        {/* New: Create New Template Button */}
        {!editingTemplate && (
            <div className="mb-8 p-4 bg-neutral-700/50 rounded-lg">
                 <h3 className="text-xl font-semibold text-blue-300 mb-3">Create New Template</h3>
                 <button
                     className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition disabled:opacity-50"
                     onClick={handleOpenCreateModal}
                     disabled={isSavingTemplate || isUpdatingTemplate}
                 >
                     <PlusCircle size={20} className="inline-block mr-2"/> Create Template
                 </button>
            </div>
        )}
        {/* End New */}

        {/* New: Filter Section */}
        <div className="mb-8 p-4 bg-neutral-700/50 rounded-lg">
             <h3 className="text-xl font-semibold text-blue-300 mb-3 flex items-center gap-2"><Filter size={20}/> Filter Templates</h3>
             <div className="flex flex-wrap items-center gap-4">
                 <div>
                     <label htmlFor="filterType" className="block text-neutral-300 text-sm font-semibold mb-1">Type:</label>
                     <select
                         id="filterType"
                         className="p-2 rounded-md bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                         value={filterType}
                         onChange={(e) => setFilterType(e.target.value as TemplateType | '')}
                         disabled={loading}
                     >
                         <option value="">All Types</option>
                         {TEMPLATE_TYPES.map(type => (
                             <option key={type} value={type}>{type.replace(/_/g, ' ')}</option>
                         ))}
                     </select>
                 </div>
                  <div>
                     <label htmlFor="filterTags" className="block text-neutral-300 text-sm font-semibold mb-1">Tags (comma-separated):</label>
                     <input
                         id="filterTags"
                         type="text"
                         className="p-2 rounded-md bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                         value={filterTags}
                         onChange={handleFilterTagsInputChange}
                         placeholder="e.g., daily, work"
                         disabled={loading}
                     />
                 </div>
             </div>
        </div>
        {/* End New */}

        {/* Templates List */}
        <div className="p-4 bg-neutral-700/50 rounded-lg">
            <h3 className="text-xl font-semibold text-blue-300 mb-3">Your Templates ({templates.length})</h3>
            {loading && !isSavingTemplate && !isUpdatingTemplate ? ( // Show loading only if not currently saving/updating
              <p className="text-neutral-400">Loading templates...</p>
            ) : error && !showCreateModal && !editingTemplate ? ( // Show main error if not in create/edit mode
                 <p className="text-red-400">Error: {error}</p>
            ) : templates.length === 0 ? (
              <p className="text-neutral-400">No templates found yet{filterType || filterTags ? ' matching your filters' : ''}. Create one using the form above.</p>
            ) : (
              <ul className="space-y-4">
                {templates.map((template) => (
                  <li key={template.id} className={`bg-neutral-600/50 p-4 rounded-md border-l-4 border-blue-500`}>
                    <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-3">
                            <BookOpen size={20} className="text-blue-400"/>
                            <h4 className="font-semibold text-blue-200">{template.name}</h4>
                        </div>
                         {/* Expand/Collapse Button */}
                         <div className="flex gap-2 items-center">
                             <button onClick={() => toggleExpandTemplate(template.id)} className="text-neutral-400 hover:text-white transition">
                                {expandedTemplates[template.id] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                             </button>
                         </div>
                         {/* End New */}
                    </div>
                    <p className="text-neutral-300 text-sm mb-2">Type: {template.type.replace(/_/g, ' ').toUpperCase()}</p>
                    <p className="text-neutral-300 text-sm mb-2">{template.description || 'No description.'}</p>

                    {/* Content Preview (Collapsible) */}
                    {expandedTemplates[template.id] && ((
                         <div className="mt-4 border-t border-neutral-600 pt-4">
                             <h5 className="text-neutral-300 text-sm font-semibold mb-2">Content:</h5>
                             <pre className="bg-neutral-800 p-3 rounded-md text-neutral-200 text-xs font-mono overflow-x-auto max-h-48 scrollbar-thin scrollbar-thumb-neutral-600">
                                 {JSON.stringify(template.content || {}, null, 2)}
                             </pre>
                         </div>
                    ))}
                    <small className="text-neutral-400 text-xs block mt-2">
                        ID: {template.id}
                         {template.user_id && ` | Owner: ${template.user_id}`}
                         {template.is_public ? ' | Public' : ' | Private'}
                         {template.tags && template.tags.length > 0 && ` | Tags: ${template.tags.join(', ')}`}
                         {template.created_at && ` | Created: ${new Date(template.created_at).toLocaleString()}`}
                         {template.updated_at && ` | Last Updated: ${new Date(template.updated_at).toLocaleString()}`}
                    </small>

                    {/* Template Actions */}
                    <div className="mt-4 flex flex-wrap gap-2"> {/* Use flex-wrap for smaller screens */}
                         {/* New: Use Template Button */}
                         <button
                             className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                             onClick={() => handleUseTemplate(template)}
                             disabled={isSavingTemplate || isUpdatingTemplate}
                         >
                             <Play size={16} className="inline-block mr-1"/> Use Template (TODO)
                         </button>
                         {/* End New */}
                         {/* Edit Button (Only show for user's own templates) */}
                         {template.user_id === systemContext?.currentUser?.id && !template.is_public && ((
                             <button
                                className="px-3 py-1 text-sm bg-yellow-600 text-white rounded hover:bg-yellow-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={() => handleEditTemplateClick(template)}
                                disabled={isSavingTemplate || isUpdatingTemplate}
                             >
                                <Edit size={16} className="inline-block mr-1"/> Edit
                             </button>
                         ))}
                         {/* Delete Button (Only show for user's own templates) */}
                         {template.user_id === systemContext?.currentUser?.id && !template.is_public && ((
                             <button
                                className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={() => handleDeleteTemplate(template.id)}
                                disabled={isSavingTemplate || isUpdatingTemplate}
                             >
                                <Trash2 size={16} className="inline-block mr-1"/> Delete
                             </button>
                         ))}
                         {/* TODO: Add Copy button (Part of 權能鍛造: 觀察 - record action) */}
                    </div>
                  </li>
                ))}\n              </ul>
            )}
        </div>

        {/* New: Create Template Modal */}
        {showCreateModal && ((
             <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                 <div className="bg-neutral-800 p-8 rounded-lg shadow-xl w-full max-w-md max-h-[90%] flex flex-col"> {/* Added flex-col and max-height */}
                     <div className="flex justify-between items-center mb-4">
                         <h3 className="text-xl font-semibold text-blue-300">Create New Template</h3>
                         <button
                             type="button"
                             onClick={handleCloseCreateModal}
                             className="text-neutral-400 hover:text-white transition"
                             disabled={isSavingTemplate}
                         >
                             <XCircle size={24} />
                         </button>
                     </div>
                     <form onSubmit={handleCreateTemplate} className="flex-grow flex flex-col overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-700 pr-2"> {/* Added flex-grow, flex-col, overflow, pr-2 */}
                         <div className="mb-4">
                             <label htmlFor="newTemplateName" className="block text-neutral-300 text-sm font-semibold mb-2">Name:</label>
                             <input
                                 id="newTemplateName"
                                 type="text"
                                 className="w-full p-2 rounded-md bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                 value={newTemplateName}
                                 onChange={(e) => setNewTemplateName(e.target.value)}
                                 placeholder="Enter template name"
                                 disabled={isSavingTemplate}
                                 required
                             />
                         </div>
                          <div className="mb-4">
                             <label htmlFor="newTemplateDescription" className="block text-neutral-300 text-sm font-semibold mb-2">Description (Optional):</label>
                             <textarea
                                 id="newTemplateDescription"
                                 className="w-full p-2 rounded-md bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                 value={newTemplateDescription}
                                 onChange={(e) => setNewTemplateDescription(e.target.value)}
                                 placeholder="Enter description"
                                 rows={2}
                                 disabled={isSavingTemplate}
                             />
                         </div>
                         <div className="mb-4">
                             <label htmlFor="newTemplateType" className="block text-neutral-300 text-sm font-semibold mb-2">Type:</label>
                             <select
                                 id="newTemplateType"
                                 className="w-full p-2 rounded-md bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                 value={newTemplateType}
                                 onChange={(e) => setNewTemplateType(e.target.value as TemplateType)}
                                 disabled={isSavingTemplate}
                                 required
                             >
                                 {TEMPLATE_TYPES.map(type => (
                                     <option key={type} value={type}>{type.replace(/_/g, ' ')}</option>
                                 ))}
                             </select>
                         </div>
                          <div className="mb-4">
                             <label htmlFor="newTemplateContent" className="block text-neutral-300 text-sm font-semibold mb-2">Content (JSON):</label>
                              <textarea
                                 id="newTemplateContent"
                                 className={`w-full p-2 rounded-md bg-neutral-800 text-white border ${newTemplateContentError ? 'border-red-500' : 'border-neutral-600'} focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-xs`}
                                 value={newTemplateContent}
                                 onChange={(e) => {
                                     setNewTemplateContent(e.target.value);
                                     try {
                                         JSON.parse(e.target.value);
                                         setNewTemplateContentError(null); // Clear error if JSON is valid
                                     } catch (err: any) {
                                         setNewTemplateContentError(`Invalid JSON: ${err.message}`);
                                     }
                                 }}
                                 rows={8}
                                 disabled={isSavingTemplate}
                                 required
                              />
                              {newTemplateContentError && <p className="text-red-400 text-xs mt-1">Error: {newTemplateContentError}</p>}
                          </div>
                           <div className="mb-4">
                             <label htmlFor="newTemplateTags" className="block text-neutral-300 text-sm font-semibold mb-2">Tags (comma-separated, Optional):</label>
                             <input
                                 id="newTemplateTags"
                                 type="text"
                                 className="w-full p-2 rounded-md bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                 value={getTagInputString(newTemplateTags)}
                                 onChange={(e) => handleTagInputChange(e, false)}
                                 placeholder="e.g., prompt, task, workflow"
                                 disabled={isSavingTemplate}
                             />
                         </div>
                          <div className="mb-4 flex items-center gap-2">
                              <input
                                  type="checkbox"
                                  id="newTemplateIsPublic"
                                  className="form-checkbox h-4 w-4 text-blue-600 rounded border-neutral-600 bg-neutral-800 focus:ring-blue-500"
                                  checked={newTemplateIsPublic}
                                  onChange={(e) => setNewTemplateIsPublic(e.target.checked)}
                                  disabled={isSavingTemplate}
                              />
                              <label htmlFor="newTemplateIsPublic" className="text-neutral-300 text-sm">Make Public</label>
                          </div>

                         {createError && !isSavingTemplate && ( // Show create error only after it finishes
                             <p className="text-red-400 text-sm mt-4">Error: {createError}</p>
                         )}
                     </form>
                     <div className="flex gap-4 justify-end mt-4 flex-shrink-0"> {/* Added flex-shrink-0 */}
                         <button
                             type="button"
                             onClick={handleCloseCreateModal}
                             className="px-6 py-2 bg-neutral-600 text-white font-semibold rounded-md hover:bg-neutral-700 transition"
                             disabled={isSavingTemplate}
                         >
                             Cancel
                         </button>
                         <button
                             type="submit" form="create-template-form" // Link button to form by ID
                             className="px-6 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                             disabled={isSavingTemplate || !newTemplateName.trim() || newTemplateContent.trim() === '{}' || !!newTemplateContentError}
                         >
                             {isSavingTemplate ? 'Saving...' : 'Save Template'}
                         </button>
                     </div>
                 </div>
             </div>
        ))}
        {/* End New */}

        {/* New: Edit Template Modal */}
        {editingTemplate && ((
             <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                 <div className="bg-neutral-800 p-8 rounded-lg shadow-xl w-full max-w-md max-h-[90%] flex flex-col"> {/* Added flex-col and max-height */}
                     <div className="flex justify-between items-center mb-4">
                         <h3 className="text-xl font-semibold text-blue-300">Edit Template: {editingTemplate.name}</h3>
                         <button
                             type="button"
                             onClick={handleCancelEdit}
                             className="text-neutral-400 hover:text-white transition"
                             disabled={isUpdatingTemplate}
                         >
                             <XCircle size={24} />
                         </button>
                     </div>
                     <form onSubmit={handleUpdateTemplate} className="flex-grow flex flex-col overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-700 pr-2"> {/* Added flex-grow, flex-col, overflow, pr-2 */}
                         <div className="mb-4">
                             <label htmlFor="editingTemplateName" className="block text-neutral-300 text-sm font-semibold mb-2">Name:</label>
                             <input
                                 id="editingTemplateName"
                                 type="text"
                                 className="w-full p-2 rounded-md bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                 value={editingTemplateName}
                                 onChange={(e) => setEditingTemplateName(e.target.value)}
                                 placeholder="Edit template name"
                                 disabled={isUpdatingTemplate}
                                 required
                             />
                         </div>
                          <div className="mb-4">
                             <label htmlFor="editingTemplateDescription" className="block text-neutral-300 text-sm font-semibold mb-2">Description (Optional):</label>
                             <textarea
                                 id="editingTemplateDescription"
                                 className="w-full p-2 rounded-md bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                 value={editingTemplateDescription}
                                 onChange={(e) => setEditingTemplateDescription(e.target.value)}
                                 placeholder="Edit description"
                                 rows={2}
                                 disabled={isUpdatingTemplate}
                             />
                         </div>
                         <div className="mb-4">
                             <label htmlFor="editingTemplateType" className="block text-neutral-300 text-sm font-semibold mb-2">Type:</label>
                             <select
                                 id="editingTemplateType"
                                 className="w-full p-2 rounded-md bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                 value={editingTemplateType}
                                 onChange={(e) => setEditingTemplateType(e.target.value as TemplateType)}
                                 disabled={isUpdatingTemplate}
                                 required
                             >
                                 {TEMPLATE_TYPES.map(type => (
                                     <option key={type} value={type}>{type.replace(/_/g, ' ')}</option>
                                 ))}
                             </select>
                         </div>
                          <div className="mb-4">
                             <label htmlFor="editingTemplateContent" className="block text-neutral-300 text-sm font-semibold mb-2">Content (JSON):</label>
                              <textarea
                                 id="editingTemplateContent"
                                 className={`w-full p-2 rounded-md bg-neutral-800 text-white border ${editingTemplateContentError ? 'border-red-500' : 'border-neutral-600'} focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-xs`}
                                 value={editingTemplateContent}
                                 onChange={(e) => {
                                     setEditingTemplateContent(e.target.value);
                                     try {
                                         JSON.parse(e.target.value);
                                         setEditingTemplateContentError(null); // Clear error if JSON is valid
                                     } catch (err: any) {
                                         setEditingTemplateContentError(`Invalid JSON: ${err.message}`);
                                     }
                                 }}
                                 rows={8}
                                 disabled={isUpdatingTemplate}
                                 required
                              />
                              {editingTemplateContentError && <p className="text-red-400 text-xs mt-1">Error: {editingTemplateContentError}</p>}
                          </div>
                           <div className="mb-4">
                             <label htmlFor="editingTemplateTags" className="block text-neutral-300 text-sm font-semibold mb-2">Tags (comma-separated, Optional):</label>
                             <input
                                 id="editingTemplateTags"
                                 type="text"
                                 className="w-full p-2 rounded-md bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                 value={getTagInputString(editingTemplateTags)}
                                 onChange={(e) => handleTagInputChange(e, true)}
                                 placeholder="e.g., prompt, task, workflow"
                                 disabled={isUpdatingTemplate}
                             />
                         </div>
                          <div className="mb-4 flex items-center gap-2">
                              <input
                                  type="checkbox"
                                  id="editingTemplateIsPublic"
                                  className="form-checkbox h-4 w-4 text-blue-600 rounded border-neutral-600 bg-neutral-800 focus:ring-blue-500"
                                  checked={editingTemplateIsPublic}
                                  onChange={(e) => setEditingTemplateIsPublic(e.target.checked)}
                                  disabled={isUpdatingTemplate}
                              />
                              <label htmlFor="editingTemplateIsPublic" className="text-neutral-300 text-sm">Make Public</label>
                          </div>

                         {error && !isUpdatingTemplate && ( // Show save error only after it finishes
                             <p className="text-red-400 text-sm mt-4">Error: {error}</p>
                         )}
                     </form>
                     <div className="flex gap-4 justify-end mt-4 flex-shrink-0"> {/* Added flex-shrink-0 */}
                         <button
                             type="button"
                             onClick={handleCancelEdit}
                             className="px-6 py-2 bg-neutral-600 text-white font-semibold rounded-md hover:bg-neutral-700 transition"
                             disabled={isUpdatingTemplate}
                         >
                             Cancel
                         </button>
                         <button
                             type="submit" form="edit-template-form" // Link button to form by ID
                             className="px-6 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                             disabled={isUpdatingTemplate || !editingTemplateName.trim() || editingTemplateContent.trim() === '{}' || !!editingTemplateContentError}
                         >
                             {isUpdatingTemplate ? 'Saving...' : 'Save Changes'}
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

export default Templates;
```