```typescript
// src/pages/Scripts.tsx
// Scripts & Abilities Page (\u6b0a\u80fd\u935b\u9020)
// Displays and manages user's automated scripts (Abilities).
// --- Modified: Add UI for listing and managing abilities --
// --- Modified: Add UI for creating, editing, and deleting abilities --
// --- Modified: Implement realtime updates for abilities and user_actions --
// --- Modified: Use SacredRuneEngraver --
// --- Modified: Add UI for executing Ability methods --
// --- Modified: Add UI for structured trigger editing --
// --- Modified: Add UI for Ability Capacity display --
// --- Modified: Add example script in create form description --


import React, { useEffect, useState } from 'react';
import { AuthorityForgingEngine } from '../core/authority/AuthorityForgingEngine';
import { ForgedAbility, UserAction, Rune, Goal, KeyResult } from '../interfaces'; // Import Rune, Goal, KeyResult
import { Code, Play, Trash2, Edit, ChevronDown, ChevronUp, Clock, Zap, BarChart2, Info, PlusCircle, MinusCircle, Save, Loader2, Target } from 'lucide-react'; // Import icons including Target
// --- Modified: Import ActionEditor component --
import ActionEditor from '../components/ActionEditor';
// --- End Modified --


// Access core modules from the global window object (for MVP simplicity)
// In a real app, use React Context or dependency injection
declare const window: any;
const authorityForgingEngine: AuthorityForgingEngine = window.systemContext?.authorityForgingEngine; // The Authority Forging (\u6b0a\u80fd\u935b\u9020) pillar
const sacredRuneEngraver: any = window.systemContext?.sacredRuneEngraver; // Access SacredRuneEngraver for ActionEditor data
const goalManagementService: any = window.systemContext?.goalManagementService; // Access GoalManagementService for ActionEditor data
const systemContext: any = window.systemContext; // Access the full context for currentUser


const Scripts: React.FC = () => {
  const [abilities, setAbilities] = useState<ForgedAbility[]>([]);
  const [recentActions, setRecentActions] = useState<UserAction[]>([]);
  const [loadingAbilities, setLoadingAbilities] = useState(true);
  const [loadingActions, setLoadingActions] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedAbilities, setExpandedAbilities] = useState<Record<string, boolean>>({}); // State to track expanded abilities

  // --- State for creating new ability (using structured data) ---
  const [isCreatingAbility, setIsCreatingAbility] = useState(false);
  const [newAbilityName, setNewAbilityName] = useState('');
  const [newAbilityDescription, setNewAbilityDescription] = useState('');
  const [newAbilityScript, setNewAbilityScript] = useState('');
  // --- New: Structured Trigger State ---
  const [newAbilityTriggerType, setNewAbilityTriggerType] = useState('manual'); // Default trigger type
  const [newAbilityTriggerDetails, setNewAbilityTriggerDetails] = useState<any>({}); // Structured trigger details
  // --- End New ---
  const [isSavingAbility, setIsSavingAbility] = useState(false);


  // --- State for editing ability (using structured data) ---
  const [editingAbility, setEditingAbility] = useState<ForgedAbility | null>(null);
  const [editingAbilityName, setEditingAbilityName] = useState('');
  const [editingAbilityDescription, setEditingAbilityDescription] = useState('');
  const [editingAbilityScript, setEditingAbilityScript] = useState('');
  // --- New: Structured Trigger State (Edit) ---
  const [editingAbilityTriggerType, setEditingAbilityTriggerType] = useState('manual'); // Default trigger type
  const [editingAbilityTriggerDetails, setEditingAbilityTriggerDetails] = useState<any>({}); // Structured trigger details
  // --- End New ---
  const [isUpdatingAbility, setIsUpdatingAbility] = useState(false);


  const [executingAbility, setExecutingAbility] = useState<string | null>(null); // Track which ability is being executed
  const [executionResult, setExecutionResult] = useState<any>(null); // Result of the last executed ability
  const [showResultModal, setShowResultModal] = useState<boolean>(false); // Show result modal

  // --- New: State for editing rune configuration ---\
  const [editingRuneConfig, setEditingRuneConfig] = useState<Rune | null>(null); // The rune whose config is being edited\\\
  const [editingConfigJson, setEditingConfigJson] = useState(''); // JSON string of the config being edited\\\
  const [isSavingRuneConfig, setIsSavingRuneConfig] = useState(false);\\\
  const [runeConfigEditError, setRuneConfigEditError] = useState<string | null>(null); // Error specific to rune config editing\\\
  // --- End New ---\\\
\\\n  // --- New: State for executing Rune methods ---\\\n  const [showExecuteRuneModal, setShowExecuteRuneModal] = useState<Rune | null>(null);\\\n  const [selectedRuneMethod, setSelectedRuneMethod] = useState<string>('');\\\n  const [runeMethodParamsJson, setRuneMethodParamsJson] = useState('{}');\\\n  const [runeMethodParamsError, setRuneMethodParamsError] = useState<string | null>(null);\\\n  const [isExecutingRuneMethod, setIsExecutingRuneMethod] = useState(false);\\\n  const [runeMethodExecutionResult, setRuneMethodExecutionResult] = useState<any>(null);\\\n  const [runeMethodExecutionError, setRuneMethodExecutionError] = useState<string | null>(null);\\\
  // --- End New ---\\\n\\\n  // --- New: State for Ability Capacity ---\\\n  const [abilityCapacity, setAbilityCapacity] = useState<{ currentCost: number, capacity: number } | null>(null);\\\n  // --- End New ---\\\n\\\n  // --- New: States for data needed by ActionEditor ---\\\n  const [availableRunes, setAvailableRunes] = useState<Rune[]>([]);\\\n  const [availableAbilities, setAvailableAbilities] = useState<ForgedAbility[]>([]);\\\
  const [availableGoals, setAvailableGoals] = useState<Goal[]>([]); // Goals including Key Results\\\n  // --- End New ---\\\n\n\n  const fetchAbilities = async () => {\n       const userId = systemContext?.currentUser?.id;\n       if (!authorityForgingEngine || !userId) {\n            setError(\"AuthorityForgingEngine module not initialized or user not logged in.\");\n            setLoadingAbilities(false);\n            return;\n        }\n      setLoadingAbilities(true);\n      setError(null); // Clear main error when fetching\n      try {\n          // Fetch abilities for the current user (and public ones) from Supabase (Part of \\u96d9\\u5410\\u540c\\u6b65\\u9818\\u57df)\n          const userAbilities = await authorityForgingEngine.getAbilities(undefined, userId); // Pass user ID, no type filter for now\n          setAbilities(userAbilities);\n\n          // --- New: Fetch user's ability capacity ---\n          const capacity = await authorityForgingEngine.getUserAbilityCapacity(userId);\n          setAbilityCapacity(capacity);\n          // --- End New ---\n\n      } catch (err: any) {\n          console.error('Error fetching abilities:', err);\n          setError(`Failed to load abilities: ${err.message}`);\n      } finally {\n          setLoadingAbilities(false);\n      }\n  };\n\n   const fetchRecentActions = async () => {\n       const userId = systemContext?.currentUser?.id;\n       if (!authorityForgingEngine || !userId) {\n           // setError(\\\"AuthorityForgingEngine module not initialized or user not logged in.\\\"); // Don't set main error for just actions\n           setLoadingActions(false);\n           return;\n       }\n       setLoadingActions(true);\n       try {\n           // Fetch recent user actions for the current user (Part of \\u96d9\\u5410\\u540c\\u6b65\\u9818\\u57df)\n           const actions = await authorityForgingEngine.getRecentActions(userId, 20); // Get last 20 actions\n           setRecentActions(actions);\n       } catch (err: any) {\n           console.error('Error fetching recent actions:', err);\n           // setError(`Failed to load recent actions: ${err.message}`); // Don't set main error for just actions\n           setRecentActions([]); // Clear actions on error\n       } finally {\n           setLoadingActions(false);\n       }\n   };\n\n    // --- New: Fetch data needed by ActionEditor ---\n    const fetchActionEditorData = async () => {\n        const userId = systemContext?.currentUser?.id;\n        if (!userId || !sacredRuneEngraver || !authorityForgingEngine || !goalManagementService) {\n             console.warn(\"Cannot fetch ActionEditor data: Core modules not initialized or user not logged in.\");\n             setAvailableRunes([]);\n             setAvailableAbilities([]);\n             setAvailableGoals([]);\n             return;\n        }\n        try {\n            // Fetch available runes (user's and public)\n            const runes = await sacredRuneEngraver.listRunes(undefined, userId);\n            setAvailableRunes(runes);\n\n            // Fetch available abilities (user's and public)\n            const abilities = await authorityForgingEngine.getAbilities(undefined, userId);\n            setAvailableAbilities(abilities);\n\n            // Fetch available goals (including KRs) for linking\n            const goals = await goalManagementService.getGoals(userId);\n            setAvailableGoals(goals);\n\n        } catch (err: any) {\n            console.error('Error fetching ActionEditor data:', err);\n            // Don't set a critical error for the whole page\n            // setError(`Failed to load data for action editor: ${err.message}`);\n            setAvailableRunes([]);\n            setAvailableAbilities([]);\n            setAvailableGoals([]);\n        }\n    };\n    // --- End New ---\n\n\n  useEffect(() => {\n    // Fetch data when the component mounts or when the user changes\n    if (systemContext?.currentUser?.id) {\n        fetchAbilities(); // Fetch all abilities on initial load\n        fetchRecentActions(); // Fetch recent actions on initial load\n        // --- New: Fetch data needed by ActionEditor ---\n        fetchActionEditorData();\n        // --- End New ---\n    }\n\n    // --- New: Subscribe to realtime updates for abilities and user_actions ---\n    let unsubscribeAbilityForged: (() => void) | undefined;\n    let unsubscribeAbilityUpdated: (() => void) | undefined;\n    let unsubscribeAbilityDeleted: (() => void) | undefined;\n    let unsubscribeUserActionRecorded: (() => void) | undefined;\n\n\n    if (authorityForgingEngine?.context?.eventBus) { // Check if AuthorityForgingEngine and its EventBus are available\n        const eventBus = authorityForgingEngine.context.eventBus;\n        const userId = systemContext?.currentUser?.id;\n\n        // Subscribe to ability forged events\n        unsubscribeAbilityForged = eventBus.subscribe('ability_forged', (payload: ForgedAbility) => {\n            if (payload.user_id === userId) {\n                console.log('Scripts page received ability_forged event:', payload);\n                // Add the new ability and keep sorted by creation timestamp (newest first)\n                setAbilities(prevAbilities => [...prevAbilities, payload].sort((a, b) => new Date(b.creation_timestamp).getTime() - new Date(a.creation_timestamp).getTime()));\n                // Refetch capacity as a new ability was added\n                authorityForgingEngine.getUserAbilityCapacity(userId).then(setAbilityCapacity).catch(err => console.error('Error refetching capacity:', err));\n            }\n        });\n         // Subscribe to ability update events\n         unsubscribeAbilityUpdated = eventBus.subscribe('ability_updated', (payload: ForgedAbility) => {\n             if (payload.user_id === userId) {\n                 console.log('Scripts page received ability_updated event:', payload);\n                 // Update the specific ability in the state\n                 setAbilities(prevAbilities => prevAbilities.map(ability => ability.id === payload.id ? payload : ability));\n                 // Refetch capacity if capacity_cost might have changed (not editable in MVP, but for future)\n                 // authorityForgingEngine.getUserAbilityCapacity(userId).then(setAbilityCapacity).catch(err => console.error('Error refetching capacity:', err));\n             }\n         });\n          // Subscribe to ability delete events\n          unsubscribeAbilityDeleted = eventBus.subscribe('ability_deleted', (payload: { abilityId: string, userId: string }) => {\n             if (payload.userId === userId) {\n                 console.log('Scripts page received ability_deleted event:', payload);\n                 // Remove the deleted ability from the state\n                 setAbilities(prevAbilities => prevAbilities.filter(ability => ability.id !== payload.abilityId));\n                 // Refetch capacity as an ability was deleted\n                 authorityForgingEngine.getUserAbilityCapacity(userId).then(setAbilityCapacity).catch(err => console.error('Error refetching capacity:', err));\n             }\n         });\n\n        // Subscribe to user action recorded events\n        unsubscribeUserActionRecorded = eventBus.subscribe('user_action_recorded', (payload: UserAction) => {\n             if (payload.user_id === userId) {\n                 console.log('Scripts page received user_action_recorded event:', payload);\n                 // Add the new action, keep sorted by timestamp (newest first), and limit the list size\n                 setRecentActions(prevActions => [\n                     payload,\n                     ...prevActions.filter(action => action.id !== payload.id) // Ensure no duplicates if an update event is also published\n                 ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 20)); // Keep only the latest 20\n             }\n         });\n    }\n    // --- End New ---\n\n\n    return () => {\n        // Unsubscribe on component unmount\n        unsubscribeAbilityForged?.();\n        unsubscribeAbilityUpdated?.();\n        unsubscribeAbilityDeleted?.();\n        unsubscribeUserActionRecorded?.();\n    };\n\n  }, [systemContext?.currentUser?.id, authorityForgingEngine, sacredRuneEngraver, goalManagementService]); // Re-run effect when user ID or services change\n\n\n    const toggleExpandAbility = (abilityId: string) => {\n        setExpandedAbilities(prevState => ({\n            ...prevState,\n            [abilityId]: !prevState[abilityId]\n        }));\n    };\n\n   // --- New: Handle Create Ability (using structured data) ---\n   const handleCreateAbility = async (e: React.FormEvent) => {\n       e.preventDefault();\n       const userId = systemContext?.currentUser?.id;\n       if (!authorityForgingEngine || !userId) {\n           alert(\\\"AuthorityForgingEngine module not initialized or user not logged in.\\\");\n           return;\n       }\n       if (!newAbilityName.trim() || !newAbilityScript.trim()) {\n           alert('Please enter name and script.');\n           return;\n       }\n        // Basic validation for trigger details based on type\n        if (newAbilityTriggerType === 'keyword' && !newAbilityTriggerDetails?.value?.trim()) {\n            alert('Keyword trigger requires a keyword value.');\n            return;\n        }\n         if (newAbilityTriggerType === 'schedule' && !newAbilityTriggerDetails?.cron?.trim()) {\n            alert('Schedule trigger requires a cron expression.');\n            return;\n        }\n         if (newAbilityTriggerType === 'event' && !newAbilityTriggerDetails?.eventType?.trim()) {\n            alert('Event trigger requires an event type.');\n            return;\n        }\n\n\n       setIsSavingAbility(true);\n       setError(null);\n       try {\n           // Assemble the trigger object from structured state\n           const triggerObject = {\n               type: newAbilityTriggerType,\n               ...newAbilityTriggerDetails, // Include specific details\n           };\n\n           // Create the ability (Part of \\u6b0a\\u80fd\\u935b\\u9020 / \\u516d\\u5f0f\\u5967\\u7fa9: \\u751f\\u6210)\n           const newAbility = await authorityForgingEngine.manuallyForgeAbility(\n               newAbilityName,\n               newAbilityDescription,\n               newAbilityScript,\n               triggerObject, // Use the assembled trigger object\n               userId // Pass user ID\n           );\n\n           if (newAbility) {\n               // State update handled by realtime listener ('ability_forged' event)\n               alert(`Ability \\\"${newAbility.name}\\\" forged successfully!`);\n               console.log('Forged new ability:', newAbility);\n               setNewAbilityName('');\n               setNewAbilityDescription('');\n               setNewAbilityScript('');\n               // Reset trigger state\n               setNewAbilityTriggerType('manual');\n               setNewAbilityTriggerDetails({});\n               setIsCreatingAbility(false); // Hide form\n               // fetchAbilities(); // Refetch abilities - handled by listener\n                // Simulate recording user action (Part of \\u6b0a\\u80fd\\u935b\\u9020 / \\u516d\\u5f0f\\u5967\\u7fa9: \\u89c0\\u5bdf)\n                authorityForgingEngine?.recordAction({\n                    type: 'web:scripts:create',\n                    details: { abilityId: newAbility.id, name: newAbility.name },\n                    context: { platform: 'web', page: 'scripts' },\n                    user_id: userId, // Associate action with user\n                });\n           } else {\n               setError('Failed to forge ability.');\n           }\n       } catch (err: any) {\n           console.error('Error forging ability:', err);\n           setError(`Failed to forge ability: ${err.message}`);\n       } finally {\n           setIsSavingAbility(false);\n       }\n   };\n   // --- End New ---\n\n    // --- New: Handle Edit Ability (using structured data) ---\n    const handleEditAbilityClick = (ability: ForgedAbility) => {\n        setEditingAbility(ability);\n        setEditingAbilityName(ability.name);\n        setEditingAbilityDescription(ability.description || '');\n        setEditingAbilityScript(ability.script);\n        // Set structured trigger state from the ability object\n        setEditingAbilityTriggerType(ability.trigger?.type || 'manual');\n        // Copy trigger details, excluding the type\n        const { type, ...details } = ability.trigger || {};\n        setEditingAbilityTriggerDetails(details || {});\n        setError(null); // Clear previous errors when starting edit\n    };\n\n    const handleUpdateAbility = async (e: React.FormEvent) => {\n        e.preventDefault();\n        const userId = systemContext?.currentUser?.id;\n        if (!authorityForgingEngine || !editingAbility || !userId) return; // Safety checks\n\n        if (!editingAbilityName.trim() || !editingAbilityScript.trim()) {\n            alert('Please enter name and script.');\n            return;\n        }\n         // Basic validation for trigger details based on type\n        if (editingAbilityTriggerType === 'keyword' && !editingAbilityTriggerDetails?.value?.trim()) {\n            alert('Keyword trigger requires a keyword value.');\n            return;\n        }\n         if (editingAbilityTriggerType === 'schedule' && !editingAbilityTriggerDetails?.cron?.trim()) {\n            alert('Schedule trigger requires a cron expression.');\n            return;\n        }\n         if (editingAbilityTriggerType === 'event' && !editingAbilityTriggerDetails?.eventType?.trim()) {\n            alert('Event trigger requires an event type.');\n            return;\n        }\n\n\n        setIsUpdatingAbility(true);\n        setError(null);\n        try {\n            // Assemble the trigger object from structured state\n            const triggerObject = {\n                type: editingAbilityTriggerType,\n                ...editingAbilityTriggerDetails, // Include specific details\n            };\n\n            // Update the ability (Part of \\u6b0a\\u80fd\\u935b\\u9020 / \\u96d9\\u5410\\u540c\\u6b65\\u9818\\u57df)\n            const updatedAbility = await authorityForgingEngine.updateAbility(editingAbility.id, {\n                name: editingAbilityName,\n                description: editingAbilityDescription,\n                script: editingAbilityScript,\n                trigger: triggerObject, // Use the assembled trigger object\n            }, userId); // Pass userId\n\n            if (updatedAbility) {\n                console.log('Ability updated:', updatedAbility);\n                // State update handled by realtime listener ('ability_updated' event)\n                // Update the specific ability in the state immediately for better UX\n                setAbilities(prevAbilities => prevAbilities.map(ability => ability.id === updatedAbility.id ? updatedAbility : ability));\n                setEditingAbility(null); // Close edit form\n                setEditingAbilityName('');\n                setEditingAbilityDescription('');\n                setEditingAbilityScript('');\n                // Reset trigger state\n                setEditingAbilityTriggerType('manual');\n                setEditingAbilityTriggerDetails({});\n                // fetchAbilities(); // Refetch abilities - handled by listener\n                 // Simulate recording user action (Part of \\u6b0a\\u80fd\\u935b\\u9020 / \\u516d\\u5f0f\\u5967\\u7fa9: \\u89c0\\u5bdf)\n                authorityForgingEngine?.recordAction({\n                    type: 'web:scripts:update',\n                    details: { abilityId: updatedAbility.id, name: updatedAbility.name },\n                    context: { platform: 'web', page: 'scripts' },\n                    user_id: userId, // Associate action with user\n                });\n            } else {\n                setError('Failed to update ability.');\n            }\n        } catch (err: any) {\n            console.error('Error updating ability:', err);\n            setError(`Failed to update ability: ${err.message}`);\n        } finally {\n            setIsUpdatingAbility(false);\n        }\n    };\n\n    const handleCancelEdit = () => {\n        setEditingAbility(null);\n        setEditingAbilityName('');\n        setEditingAbilityDescription('');\n        setEditingAbilityScript('');\n        // Reset trigger state\n        setEditingAbilityTriggerType('manual');\n        setEditingAbilityTriggerDetails({});\n        setError(null);\n    };\n    // --- End New ---\n\n\n   const handleDeleteAbility = async (abilityId: string) => {\n       const userId = systemContext?.currentUser?.id;\n       if (!authorityForgingEngine || !userId) {\n           alert(\\\"AuthorityForgingEngine module not initialized or user not logged in.\\\");\n           return;\n       }\n       if (!confirm(`Are you sure you want to delete ability ${abilityId}?`)) return;\n\n       setError(null);\n       try {\n           // Delete the ability (Part of \\u96d9\\u5410\\u540c\\u6b65\\u9818\\u57df)\n           const success = await authorityForgingEngine.deleteAbility(abilityId, userId); // Pass user ID\n           if (success) {\n               console.log('Ability deleted:', abilityId);\n               // State update handled by realtime listener ('ability_deleted' event)\n               // fetchAbilities(); // Refetch abilities - handled by listener\n                // Simulate recording user action (Part of \\u6b0a\\u80fd\\u935b\\u9020 / \\u516d\\u5f0f\\u5967\\u7fa9: \\u89c0\\u5bdf)\n                authorityForgingEngine?.recordAction({\n                    type: 'web:scripts:delete',\n                    details: { abilityId },\n                    context: { platform: 'web', page: 'scripts' },\n                    user_id: userId, // Associate action with user\n                });\n           } else {\n               setError('Failed to delete ability.');\n           }\n       } catch (err: any) {\n           console.error('Error deleting ability:', err);\n           setError(`Failed to delete ability: ${err.message}`);\n       } finally {\n           // No specific loading state for delete, rely on main loading or individual item state if implemented\n       }\n   };\n\n    const handleExecuteAbility = async (ability: ForgedAbility) => {\n        const userId = systemContext?.currentUser?.id;\n        if (!authorityForgingEngine || !userId) {\n            alert(\"AuthorityForgingEngine module not initialized or user not logged in.\\\");\n            return;\n        }\n        console.log(`Attempting to execute ability: ${ability.name} (${ability.id})`);\n         // Simulate recording user action (Part of \\u6b0a\\u80fd\\u935b\\u9020 / \\u516d\\u5f0f\\u5967\\u7fa9: \\u884c\\u52d5)\n        authorityForgingEngine?.recordAction({\n            type: 'web:scripts:run',\n            details: { abilityId: ability.id, name: ability.name },\n            context: { platform: 'web', page: 'scripts' },\n            user_id: userId, // Associate action with user\n        });\n\n        setExecutingAbility(ability.id); // Indicate this ability is running\n        setExecutionResult(null); // Clear previous result\n        setShowResultModal(false); // Hide previous modal\n        setError(null); // Clear previous errors\n        try {\n            // Execute the ability (Part of \\u6b0a\\u80fd\\u935b\\u9020 / \\u516d\\u5f0f\\u5967\\u7fa9: \\u884c\\u52d5)\n            // For MVP, params are hardcoded or empty. A real UI might have a modal for params.\n            const result = await authorityForgingEngine.executeAbility(ability.id, userId, {}); // Pass user ID and empty params\n            console.log(`Ability \\\"${ability.name}\\\" executed. Result:`, result);\n            setExecutionResult(result); // Store the result\n            setShowResultModal(true); // Show result modal\n        } catch (err: any) {\n            console.error(`Error executing ability \\\"${ability.name}\\\":`, err);\\\n            setError(`Failed to execute ability \\\\\\\"${ability.name}\\\\\\\": ${err.message}`);\\\n            setExecutionResult({ status: 'error', message: err.message }); // Store error in result\\\n            setShowResultModal(true); // Show result modal even on error\\\n        } finally {\\\n            setExecutingAbility(null); // Reset executing state\\\n        }\\\n    };\\\n\\\n    // --- New: Handle Execute Rune Method ---\\\n    const handleExecuteRuneMethod = async (e: React.FormEvent) => {\\\n        e.preventDefault();\\\n        const userId = systemContext?.currentUser?.id;\\\n        if (!sacredRuneEngraver || !userId || !showExecuteRuneModal || !selectedRuneMethod) {\\\n            setRuneMethodParamsError(\\\\\\\"SacredRuneEngraver module not initialized, user not logged in, or rune/method not selected.\\\\\\\");\\\n            return;\\\n        }\\\n\\\n        // Validate JSON parameters\\\n        let params: any;\\\n        try {\\\n            params = JSON.parse(runeMethodParamsJson);\\\n            setRuneMethodParamsError(null); // Clear error if valid\\\n        } catch (err: any) {\\\n            setRuneMethodParamsError(`Invalid JSON parameters: ${err.message}`);\\\n            return; // Stop if JSON is invalid\\\n        }\\\n\\\n        setIsExecutingRuneMethod(true);\\\n        setRuneMethodExecutionResult(null); // Clear previous result\\\n        setRuneMethodExecutionError(null); // Clear previous error\\\n        setError(null); // Clear main error\\\n\\\n        console.log(`Attempting to execute rune method: ${showExecuteRuneModal.name}.${selectedRuneMethod} with params:`, params);\\\n         // Simulate recording user action\\\n        authorityForgingEngine?.recordAction({\\\n            type: 'web:agents:run_rune_method',\\\n            details: { runeId: showExecuteRuneModal.id, runeName: showExecuteRuneModal.name, method: selectedRuneMethod, params },\\\n            context: { platform: 'web', page: 'agents' },\\\n            user_id: userId, // Associate action with user\\\n        });\\\n\\\n\\\n        try {\\\n            // Call the SacredRuneEngraver method to execute the rune action\\\n            const result = await sacredRuneEngraver.executeRuneAction(showExecuteRuneModal.id, selectedRuneMethod, params, userId); // Pass runeId, actionName, params, userId\\\n\\\n            console.log(`Rune method executed. Result:`, result);\\\n            setRuneMethodExecutionResult(result); // Store the result\\\n\\\n        } catch (err: any) {\\\n            console.error(`[Rune] Error executing rune method ${showExecuteRuneModal.name}.${selectedRuneMethod}:`, err);\\\n            setRuneMethodExecutionError(`Failed to execute method: ${err.message}`);\\\n        } finally {\\\n            setIsExecutingRuneMethod(false);\\\n        }\\\n    };\\\n    // --- End New ---\\\n\\\n\\\n    // --- New: Helper to render structured trigger details form ---\\\n    const renderTriggerDetailsForm = (triggerType: string, triggerDetails: any, setTriggerDetails: (details: any) => void, disabled: boolean) => {\\\n        switch (triggerType) {\\\n            case 'manual':\\\n                return <p className=\\\"text-neutral-400 text-sm\\\">This ability is triggered manually.</p>;\\\n            case 'keyword':\\\n                return (\\\n                    <div className=\"mt-2 p-2 bg-neutral-600/50 rounded-md\">\\\n                        <label htmlFor=\\\"trigger-keyword-value\\\" className=\\\"block text-neutral-400 text-xs font-semibold mb-1\\\">Keyword:</label>\\\n                        <input\\\n                            id=\\\"trigger-keyword-value\\\"\\n                            type=\\\"text\\\"\\n                            className=\\\"w-full p-1 rounded-md bg-neutral-700 text-white border border-neutral-600 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm\\\"\\n                            value={triggerDetails?.value || ''}\\n                            onChange={(e) => setTriggerDetails({ ...triggerDetails, value: e.target.value })}\\n                            placeholder=\\\"e.g., run report\\\"\\n                            disabled={disabled}\\n                            required\\n                        />\\n                    </div>\\n                );\\n            case 'schedule':\\n                return (\\n                    <div className=\\\"mt-2 p-2 bg-neutral-600/50 rounded-md\\\">\\n                        <label htmlFor=\\\"trigger-schedule-cron\\\" className=\\\"block text-neutral-400 text-xs font-semibold mb-1\\\">Cron Expression:</label>\\n                        <input\\n                            id=\\\"trigger-schedule-cron\\\"\\n                            type=\\\"text\\\"\\n                            className=\\\"w-full p-1 rounded-md bg-neutral-700 text-white border border-neutral-600 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm\\\"\\n                            value={triggerDetails?.cron || ''}\\n                            onChange={(e) => setTriggerDetails({ ...triggerDetails, cron: e.target.value })}\\n                            placeholder=\\\"e.g., 0 * * * *\\\"\\n                            disabled={disabled}\\n                            required\\n                        />\\n                         <small className=\\\"text-neutral-400 text-xs block mt-1\\\">Standard cron format (e.g., `0 * * * *` for every hour).</small>\\n                    </div>\\n                );\\n            case 'event':\\n                return (\\n                    <div className=\\\"mt-2 p-2 bg-neutral-600/50 rounded-md\\\">\\n                        <label htmlFor=\\\"trigger-event-type\\\" className=\\\"block text-neutral-400 text-xs font-semibold mb-1\\\">Event Type:</label>\\n                        <input\\n                            id=\\\"trigger-event-type\\\"\\n                            type=\\\"text\\\"\\n                            className=\\\"w-full p-1 rounded-md bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm\\\"\\n                            value={triggerDetails?.eventType || ''}\\n                            onChange={(e) => setTriggerDetails({ ...triggerDetails, eventType: e.target.value })}\\n                            placeholder=\\\"e.g., task_completed\\\"\\n                            disabled={disabled}\\n                            required\\n                        />\\n                         <small className=\\\"text-neutral-400 text-xs block mt-1\\\">Triggered when this system event occurs.</small>\\n                    </div>\\n                );\\n            // Add cases for other trigger types (e.g., 'webhook', 'location', 'time')\\n            default:\\n                return (\\n                     <div className=\\\"mt-2 p-2 bg-neutral-600/50 rounded-md\\\">\\n                         <label htmlFor=\\\"trigger-details-json\\\" className=\\\"block text-neutral-400 text-xs font-semibold mb-1\\\">Trigger Details (JSON):</label>\\n                         <textarea\\n                             id=\\\"trigger-details-json\\\"\\n                             className={`w-full p-1 rounded-md bg-neutral-800 text-white border ${runeConfigEditError ? 'border-red-500' : 'border-neutral-600'} focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono text-xs`}\\n                             value={JSON.stringify(triggerDetails || {}, null, 2)}\\n                             onChange={(e) => {\\n                                 try {\\n                                     const parsed = JSON.parse(e.target.value); // Corrected: use 'parsed'\\n                                     setTriggerDetails(parsed); // Corrected: use 'parsed'\\n                                     // TODO: Clear any parsing error message if successful\\n                                 } catch (parseError) {\\n                                     console.error(\\\"Invalid JSON for trigger details:\\\", parseError);\\n                                     // TODO: Display an error message for invalid JSON\\n                                 }\\n                             }}\\n                             rows={3}\\n                             disabled={disabled}\\n                             required\\n                          />\\n                     </div>\\n                );\\n        }\n    };\\n    // --- End New ---\\n\n\n   // Ensure user is logged in before rendering content\n  if (!systemContext?.currentUser) {\n       // This case should ideally be handled by ProtectedRoute, but as a fallback:\n       return (\n            <div className=\\\"container mx-auto p-4 flex justify-center\\\">\\\n               <div className=\\\"bg-neutral-800/50 p-8 rounded-lg shadow-xl w-full max-w-md text-center text-neutral-300\\\">\\\n                   <p>Please log in to view your scripts and abilities.</p>\\\n               </div>\\\n            </div>\\\n       );\\\n  }\\\n\\\n\\\n  return (\\\n    <div className=\\\"container mx-auto p-4\\\">\\\n      <div className=\\\"bg-neutral-800/50 p-6 rounded-lg shadow-xl\\\">\\\n        <h2 className=\\\"text-3xl font-bold text-blue-400 mb-6\\\">Scripts & Abilities (\\u6b0a\\u80fd\\u935b\\u9020)</h2>\\\n        <p className=\\\"text-neutral-300 mb-8\\\">Manage your automated scripts (Abilities) and review recent system activity.</p>\\\n\\\n        {/* Ability Capacity Display */}\\\n        {abilityCapacity && ((\\\n             <div className=\\\"mb-8 p-4 bg-neutral-700/50 rounded-lg flex justify-between items-center\\\">\\\n                 <div>\\\n                     <h3 className=\\\"text-xl font-semibold text-blue-300 mb-1\\\">Ability Capacity</h3>\\\n                     <p className=\\\"text-neutral-300 text-sm\\\">\\\n                         Used: <span className=\\\"font-mono text-purple-300\\\">{abilityCapacity.currentCost}</span> / Total: <span className=\\\"font-mono text-purple-300\\\">{abilityCapacity.capacity}</span> units\\\n                     </p>\\\n                 </div>\\\n                 {/* TODO: Add button to increase capacity (e.g., link to billing/upgrade) */}\\\n             </div>\\\
        ))}\\\n\\\n        {/* Form for manually forging new abilities */}\\\
        {!editingAbility && (\\\n            <div className=\\\"mb-8 p-4 bg-neutral-700/50 rounded-lg\\\">\\\
                 <h3 className=\\\"text-xl font-semibold text-blue-300 mb-3\\\">Forge New Ability</h3>\\\
                 <form onSubmit={handleCreateAbility}>\\\
                    <div className=\\\"mb-4\\\">\\\
                        <label htmlFor=\\\"newAbilityName\\\" className=\\\"block text-neutral-300 text-sm font-semibold mb-2\\\">Name:</label>\\\
                        <input\\\
                            id=\\\"newAbilityName\\\"\\\
                            type=\\\"text\\\"\\\
                            className=\\\"w-full p-2 rounded-md bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500\\\"\\\
                            value={newAbilityName}\\\
                            onChange={(e) => setNewAbilityName(e.target.value)}\\\
                            placeholder=\\\"Enter ability name\\\"\\\
                            disabled={isCreatingAbility}\\\
                            required\\\
                        />\\\
                    </div>\\\
                     <div className=\\\"mb-4\\\">\\\
                        <label htmlFor=\\\"newAbilityDescription\\\" className=\\\"block text-neutral-300 text-sm font-semibold mb-2\\\">Description (Optional):</label>\\\
                        <input\\\
                            id=\\\"newAbilityDescription\\\"\\n                            type=\\\"text\\\"\\n                            className=\\\"w-full p-2 rounded-md bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500\\\"\\n                            value={newAbilityDescription}\\n                            onChange={(e) => setNewAbilityDescription(e.target.value)}\\n                            placeholder=\\\"Enter description\\\"\\n                            disabled={isCreatingAbility}\\n                        />\\n                    </div>\\n                    <div className=\\\"mb-4\\\">\\n                        <label htmlFor=\\\"newAbilityScript\\\" className=\\\"block text-neutral-300 text-sm font-semibold mb-2\\\">Script (JavaScript/TypeScript):</label>\\\n                         <textarea\\\n                            id=\\\"newAbilityScript\\\"\\\n                            className=\\\"w-full p-2 rounded-md bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-xs\\\"\\\n                            value={newAbilityScript}\\\n                            onChange={(e) => setNewAbilityScript(e.target.value)}\\\n                            placeholder={`// Write your script here\\n// Access system context via the 'context' object\\n// Example: Log a message\\ncontext.logInfo('Hello from my new ability!');\\n\\n// Example: Execute a Rune action (simulated)\\n// context.executeRuneAction('working-copy-rune', 'sync', { repo: 'my-repo' });\\n\\n// Example: Create a Knowledge Record\\n// context.saveKnowledge('What is this ability?', 'This ability logs a message and syncs a repo.');\\n\\n// Example: Send a UI notification\\n// context.sendNotification({ type: 'success', message: 'Ability finished!', channel: 'ui' });\\n\\n// Example: Update a Goal's Key Result progress\\n// context.updateGoalProgress('your-kr-id', 10); // Add 10 to current value\\n\\n// Scripts should be async if using await\\n// Example async function:\\n/*\\nasync function run() {\\n  context.logInfo('Starting async ability...');\\n  const result = await context.executeRuneAction('example-rune-id', 'someAction', { param: 'value' });\\n  context.logInfo('Rune action result:', result);\\n  return { status: 'done', result };\\n}\\nrun(); // Call the async function\\n*/\\n`}\\\n                            rows={8}\\\n                            disabled={isCreatingAbility}\\\n                            required\\\n                         />\\\n                    </div>\\\
                     {/* New: Structured Trigger Input */}\\\
                     <div className=\\\"mb-4 p-3 bg-neutral-600/50 rounded-md\\\">\\\
                        <h4 className=\\\"text-neutral-300 text-sm font-semibold mb-2\\\">Trigger:</h4>\\\
                         <div className=\\\"mb-2\\\">\\\
                            <label htmlFor=\\\"newAbilityTriggerType\\\" className=\\\"block text-neutral-400 text-xs font-semibold mb-1\\\">Type:</label>\\\
                            <select\\\
                                id=\\\"newAbilityTriggerType\\\"\\\
                                className=\\\"w-full p-1 rounded-md bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm\\\"\\\
                                value={newAbilityTriggerType}\\\
                                onChange={(e) => { setNewAbilityTriggerType(e.target.value); setNewAbilityTriggerDetails({}); }} // Reset details when type changes\\\
                                disabled={isCreatingAbility}\\\
                                required\\\
                            >\\\
                                <option value=\\\"manual\\\">manual</option>\\\
                                <option value=\\\"keyword\\\">keyword</option>\\\
                                <option value=\\\"schedule\\\">schedule</option>\\\
                                <option value=\\\"event\\\">event</option>\\\
                                {/* Add other trigger types as needed */}\\\
                            </select>\\\
                        </div>\\\
                         {/* Render structured form based on selected trigger type */}\\\
                         {renderTriggerDetailsForm(newAbilityTriggerType, newAbilityTriggerDetails, setNewAbilityTriggerDetails, isCreatingAbility)}\\\
                     </div>\\\
                     {/* End New */}\\\
                    <button\\\
                        type=\\\"submit\\\"\\\
                        className=\\\"px-6 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed\\\"\\\
                        disabled={isCreatingAbility || !newAbilityName.trim() || !newAbilityScript.trim() || (newAbilityTriggerType === 'keyword' && !newAbilityTriggerDetails?.value?.trim()) || (newAbilityTriggerType === 'schedule' && !newAbilityTriggerDetails?.cron?.trim()) || (newAbilityTriggerType === 'event' && !newAbilityTriggerDetails?.eventType?.trim())}\\\
                    >\\\
                        {isCreatingAbility ? 'Forging...' : 'Forge Ability'}\\\
                    </button>\\\
                     <button\\\
                        type=\\\"button\\\"\\\
                        onClick={handleCancelCreate}\\\
                        className=\\\"px-6 py-2 bg-neutral-600 text-white font-semibold rounded-md hover:bg-neutral-700 transition\\\"\\\
                        disabled={isCreatingAbility}\\\
                    >\\\
                        Cancel\\\
                    </button>\\\
               </form>\\\
                 {error && isCreatingAbility === false && ( // Show create error only after it finishes\\\
                     <p className=\\\"text-red-400 text-sm mt-4\\\">Error: {error}</p>\\\
                 )}\\\
            </div>\\\
        )}\\\
\\\
        {/* Form for editing an ability */}\\\
        {editingAbility && ( // Show edit form if editing\\\
             <div className=\\\"mb-8 p-4 bg-neutral-700/50 rounded-lg\\\">\\\
                 <h3 className=\\\"text-xl font-semibold text-blue-300 mb-3\\\">Edit Ability: {editingAbility.name}</h3>\\\
                 <form onSubmit={handleUpdateAbility}>\\\
                    <div className=\\\"mb-4\\\">\\\
                        <label htmlFor=\\\"editingAbilityName\\\" className=\\\"block text-neutral-300 text-sm font-semibold mb-2\\\">Name:</label>\\\
                        <input\\\
                            id=\\\"editingAbilityName\\\"\\n                            type=\\\"text\\\"\\n                            className=\\\"w-full p-2 rounded-md bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500\\\"\\n                            value={editingAbilityName}\\n                            onChange={(e) => setEditingAbilityName(e.target.value)}\\n                            placeholder=\\\"Edit ability name\\\"\\n                            disabled={isUpdatingAbility}\\n                            required\\n                        />\\n                    </div>\\n                     <div className=\\\"mb-4\\\">\\n                        <label htmlFor=\\\"editingAbilityDescription\\\" className=\\\"block text-neutral-300 text-sm font-semibold mb-2\\\">Description (Optional):</label>\\\n                        <input\\\n                            id=\\\"editingAbilityDescription\\\"\\n                            type=\\\"text\\\"\\n                            className=\\\"w-full p-2 rounded-md bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500\\\"\\n                            value={editingAbilityDescription}\\n                            onChange={(e) => setEditingAbilityDescription(e.target.value)}\\n                            placeholder=\\\"Edit description\\\"\\n                            disabled={isUpdatingAbility}\\n                        />\\n                    </div>\\n                    <div className=\\\"mb-4\\\">\\n                        <label htmlFor=\\\"editingAbilityScript\\\" className=\\\"block text-neutral-300 text-sm font-semibold mb-2\\\">Script (JavaScript/TypeScript):</label>\\\n                         <textarea\\\n                            id=\\\"editingAbilityScript\\\"\\n                            className=\\\"w-full p-2 rounded-md bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-xs\\\"\\n                            value={editingAbilityScript}\\n                            onChange={(e) => setEditingAbilityScript(e.target.value)}\\n                            rows={8}\\n                            disabled={isUpdatingAbility}\\n                            required\\n                         />\\\n                    </div>\\\
                     {/* New: Structured Trigger Input (Edit) */}\\\
                     <div className=\\\"mb-4 p-3 bg-neutral-600/50 rounded-md\\\">\\\
                        <h4 className=\\\"text-neutral-300 text-sm font-semibold mb-2\\\">Trigger:</h4>\\\
                         <div className=\\\"mb-2\\\">\\\
                            <label htmlFor=\\\"editingAbilityTriggerType\\\" className=\\\"block text-neutral-400 text-xs font-semibold mb-1\\\">Type:</label>\\\
                            <select\\\
                                id=\\\"editingAbilityTriggerType\\\"\\n                                className=\\\"w-full p-1 rounded-md bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm\\\"\\n                                value={editingAbilityTriggerType}\\\n                                onChange={(e) => { setEditingAbilityTriggerType(e.target.value); setEditingAbilityTriggerDetails({}); }} // Reset details when type changes\\\n                                disabled={isUpdatingAbility}\\\n                                required\\\n                            >\\\
                                <option value=\\\"manual\\\">manual</option>\\\
                                <option value=\\\"keyword\\\">keyword</option>\\\
                                <option value=\\\"schedule\\\">schedule</option>\\\
                                <option value=\\\"event\\\">event</option>\\\
                                {/* Add other trigger types as needed */}\\\
                            </select>\\\
                        </div>\\\
                         {/* Render structured form based on selected trigger type */}\\\
                         {renderTriggerDetailsForm(editingAbilityTriggerType, editingAbilityTriggerDetails, setEditingAbilityTriggerDetails, isUpdatingAbility)}\\\
                     </div>\\\
                     {/* End New */}\\\
                    <div className=\\\"flex gap-4\\\">\\\
                        <button\\\
                            type=\\\"submit\\\"\\\
                            className=\\\"px-6 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed\\\"\\\
                            disabled={isUpdatingAbility || !editingAbilityName.trim() || !editingAbilityScript.trim() || (editingAbilityTriggerType === 'keyword' && !editingAbilityTriggerDetails?.value?.trim()) || (editingAbilityTriggerType === 'schedule' && !editingAbilityTriggerDetails?.cron?.trim()) || (editingAbilityTriggerType === 'event' && !editingAbilityTriggerDetails?.eventType?.trim())}\\\
                        >\\\
                            {isUpdatingAbility ? 'Saving...' : 'Save Changes'}\\\
                        </button>\\\
                         <button\\\
                            type=\\\"button\\\"\\\
                            onClick={handleCancelEdit}\\n                            className=\\\"px-6 py-2 bg-neutral-600 text-white font-semibold rounded-md hover:bg-neutral-700 transition\\\"\\n                            disabled={isUpdatingAbility}\\n                        >\\\
                            Cancel\\\n                        </button>\\\
                    </div>\\\
                     {error && isUpdatingAbility === false && ( // Show save error only after it finishes\\\
                         <p className=\\\"text-red-400 text-sm mt-4\\\">Error: {error}</p>\\\
                     )}\\\
               </form>\\\
            </div>\\\
        )}\\\
\\\
\\\
        {/* Rune Configuration Edit Modal */}\\\
        {editingRuneConfig && (\\\
             <div className=\\\"fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50\\\">\\\
                 <div className=\\\"bg-neutral-800 p-8 rounded-lg shadow-xl w-full max-w-md\\\">\\\
                     <div className=\\\"flex justify-between items-center mb-4\\\">\\\
                         <h3 className=\\\"text-xl font-semibold text-blue-300 mb-4\\\">Edit Configuration for {editingRuneConfig.name}</h3>\\\
                         <button\\\
                             type=\\\"button\\\"\\\
                             onClick={handleCancelEditRuneConfig}\\\
                             className=\\\"text-neutral-400 hover:text-white transition\\\"\\\
                             disabled={isSavingRuneConfig}\\\
                         >\\\
                             <XCircle size={24} />\\\
                         </button>\\\
                     </div>\\\
                     <form onSubmit={handleSaveRuneConfig}>\\\
                         <div className=\\\"mb-4\\\">\\\
                             <label htmlFor=\\\"rune-config-json\\\" className=\\\"block text-neutral-300 text-sm font-semibold mb-2\\\">Configuration (JSON):</label>\\\
                             <textarea\\\
                                 id=\\\"rune-config-json\\\"\\\
                                 className={`w-full p-2 rounded-md bg-neutral-900 text-white border ${runeConfigEditError ? 'border-red-500' : 'border-neutral-700'} focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-xs`}\\\
                                 value={editingConfigJson}\\\
                                 onChange={(e) => {\\\
                                     setEditingConfigJson(e.target.value);\\\
                                     try {\\\
                                         JSON.parse(e.target.value);\\\
                                         setRuneConfigEditError(null); // Clear error if JSON is valid\\\
                                     } catch (err: any) {\\\
                                         setRuneConfigEditError(`Invalid JSON: ${err.message}`);\\\
                                     }\\\
                                 }}\\\
                                 rows={10}\\\
                                 disabled={isSavingRuneConfig}\\\
                                 required\\\
                             />\\\
                         </div>\\\
                         {runeConfigEditError && <p className=\\\"text-red-400 text-sm mb-4\\\">Error: {runeConfigEditError}</p>}\\\
                         <div className=\\\"flex gap-4 justify-end\\\">\\\
                             <button\\\
                                 type=\\\"button\\\"\\\
                                 onClick={handleCancelEditRuneConfig}\\\
                                 className=\\\"px-6 py-2 bg-neutral-600 text-white font-semibold rounded-md hover:bg-neutral-700 transition\\\"\\\
                                 disabled={isSavingRuneConfig}\\\
                             >\\\
                                 Close\\\
                             </button>\\\
                             <button\\\
                                 type=\\\"submit\\\"\\\
                                 className=\\\"px-6 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed\\\"\\\
                                 disabled={isSavingRuneConfig || !!runeConfigEditError} // Disable if saving or JSON is invalid\\\
                             >\\\
                                 {isSavingRuneConfig ? 'Saving...' : 'Save Configuration'}\\\
                             </button>\\\
                         </div>\\\
                     </form>\\\
                 </div>\\\
             </div>\\\
        )}\\\
\\\
        {/* Ability Execution Result Modal */}\\\
        {showResultModal && ((\\\
             <div className=\\\"fixed inset-0 bg-black bg-opacity50 flex justify-center items-center z-50\\\">\\\
                 <div className=\\\"bg-neutral-800 p-8 rounded-lg shadow-xl w-full max-w-md\\\">\\\
                     <h3 className=\\\"text-xl font-semibold text-blue-300 mb-4\\\">Ability Execution Result</h3>\\\
                     {executionResult ? (\\\
                         <pre className=\\\"bg-neutral-900 p-4 rounded-md text-neutral-200 text-xs font-mono overflow-x-auto max-h-64 scrollbar-thin scrollbar-thumb-neutral-700\\\">\\\
                             {JSON.stringify(executionResult, null, 2)}\\\
                         </pre>\\\
                     ) : (\\\
                         <p className=\\\"text-neutral-400\\\">No result available.</p>\\\
                     )}\\\
                     <div className=\\\"flex justify-end mt-6\\\">\\\
                         <button\\\
                             type=\\\"button\\\"\\\
                             onClick={() => { setShowResultModal(false); setExecutionResult(null); }}\\\
                             className=\\\"px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition\\\"\\\
                         >\\\
                             Close\\\
                         </button>\\\
                     </div>\\\
                 </div>\\\
             </div>\\\
        ))}\\\
\\\
        {/* New: Execute Rune Method Modal */}\\\
        {showExecuteRuneModal && ((\\\
             <div className=\\\"fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50\\\">\\\
                 <div className=\\\"bg-neutral-800 p-8 rounded-lg shadow-xl w-full max-w-md\\\">\\\
                     <div className=\\\"flex justify-between items-center mb-4\\\">\\\
                         <h3 className=\\\"text-xl font-semibold text-blue-300\\\">Execute Method on {showExecuteRuneModal.name}</h3>\\\
                         <button\\\
                             type=\\\"button\\\"\\\
                             onClick={() => { setShowExecuteRuneModal(null); setSelectedRuneMethod(''); setRuneMethodParamsJson('{}'); setRuneMethodParamsError(null); setRuneMethodExecutionResult(null); setRuneMethodExecutionError(null); }}\\\
                             className=\\\"text-neutral-400 hover:text-white transition\\\"\\\
                             disabled={isExecutingRuneMethod}\\\
                         >\\\
                             <XCircle size={24} />\\\
                         </button>\\\
                     </div>\\\
                     <p className=\\\"text-neutral-300 text-sm mb-4\\\">Select a method to execute and provide parameters.</p>\\\
                     <form onSubmit={handleExecuteRuneMethod}>\\\
                         <div className=\\\"mb-4\\\">\\\
                             <label htmlFor=\\\"runeMethodSelect\\\" className=\\\"block text-neutral-300 text-sm font-semibold mb-2\\\">Method:</label>\\\
                             <select\\\
                                 id=\\\"runeMethodSelect\\\"\\\
                                 className=\\\"w-full p-2 rounded-md bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500\\\"\\\
                                 value={selectedRuneMethod}\\\
                                 onChange={(e) => { setSelectedRuneMethod(e.target.value); setRuneMethodParamsJson('{}'); setRuneMethodParamsError(null); }} // Reset params when method changes\\\
                                 disabled={isExecutingRuneMethod}\\\
                                 required\\\
                             >\\\
                                 <option value=\\\"\\\">-- Select Method --</option>\\\
                                 {showExecuteRuneModal.manifest?.methods && Object.keys(showExecuteRuneModal.manifest.methods).map(methodName => (\\\
                                     <option key={methodName} value={methodName}>{methodName}</option>\\\
                                 ))}\\\
                             </select>\\\
                         </div>\\\
                          {selectedRuneMethod && (\\\
                              <div className=\\\"mb-4\\\">\\\
                                  <label htmlFor=\\\"runeMethodParamsJson\\\" className=\\\"block text-neutral-300 text-sm font-semibold mb-2\\\">Parameters (JSON):</label>\\\
                                   <textarea\\\
                                      id=\\\"runeMethodParamsJson\\\"\\\
                                      className={`w-full p-2 rounded-md bg-neutral-800 text-white border ${runeMethodParamsError ? 'border-red-500' : 'border-neutral-600'} focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-xs`}\\\
                                      value={runeMethodParamsJson}\\\
                                      onChange={(e) => {\\\
                                          setRuneMethodParamsJson(e.target.value);\\\
                                          try {\\\
                                              JSON.parse(e.target.value);\\\
                                              setRuneMethodParamsError(null); // Clear error if JSON is valid\\\
                                          } catch (err: any) {\\\
                                              setRuneMethodParamsError(`Invalid JSON: ${err.message}`);\\\
                                          }\\\
                                      }}\\\
                                      rows={6}\\\
                                      disabled={isExecutingRuneMethod}\\\
                                      required\\\
                                   />\\\
                                  {runeMethodParamsError && <p className=\\\"text-red-400 text-sm mt-1\\\">Error: {runeMethodParamsError}</p>}\\\
                              </div>\\\
                          )}\\\
\\\
                         {runeMethodExecutionResult && (\\\
                             <div className=\\\"mb-4\\\">\\\
                                 <h4 className=\\\"text-neutral-300 text-sm font-semibold mb-2\\\">Result:</h4>\\\
                                 <pre className=\\\"bg-neutral-900 p-4 rounded-md text-neutral-200 text-xs font-mono overflow-x-auto max-h-48 scrollbar-thin scrollbar-thumb-neutral-700\\\">\\\
                                     {JSON.stringify(runeMethodExecutionResult, null, 2)}\\\
                                 </pre>\\\
                             </div>\\\
                         )}\\\
                          {runeMethodExecutionError && (\\\
                             <div className=\\\"mb-4\\\">\\\
                                 <h4 className=\\\"text-neutral-300 text-sm font-semibold mb-2 text-red-400\\\">Error:</h4>\\\
                                 <pre className=\\\"bg-neutral-900 p-3 rounded-md text-red-200 text-xs font-mono overflow-x-auto max-h-48 scrollbar-thin scrollbar-thumb-neutral-700\\\">\\\
                                     {runeMethodExecutionError}\\\
                                 </pre>\\\
                             </div>\\\
                          )}\\\
\\\
                         <div className=\\\"flex gap-4 justify-end mt-4\\\">\\\
                             <button\\\
                                 type=\\\"button\\\"\\\
                                 onClick={() => { setShowExecuteRuneModal(null); setSelectedRuneMethod(''); setRuneMethodParamsJson('{}'); setRuneMethodParamsError(null); setRuneMethodExecutionResult(null); setRuneMethodExecutionError(null); }}\\\
                                 className=\\\"px-6 py-2 bg-neutral-600 text-white font-semibold rounded-md hover:bg-neutral-700 transition\\\"\\\
                                 disabled={isExecutingRuneMethod}\\\
                             >\\\
                                 Close\\\
                             </button>\\\
                             <button\\\
                                 type=\\\"submit\\\"\\\
                                 className=\\\"px-6 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed\\\"\\\
                                 disabled={isExecutingRuneMethod || !selectedRuneMethod || !!runeMethodParamsError} // Disable if executing, no method selected, or params JSON is invalid\\\
                             >\\\
                                 {isExecutingRuneMethod ? 'Executing...' : 'Execute'}\\\
                             </button>\\\
                         </div>\\\
                     </form>\\\
                 </div>\\\
             </div>\\\
        ))}\\\
        {/* End New */}\\\
\\\
      </div>\\\
    </div>\\\
  );\\\
};\\\
\\\nexport default Scripts;\\\
```