import { jsx as _jsx } from "react/jsx-runtime";
`` `typescript
// src/pages/Goals.tsx
// Goals Page
// Displays and manages user's automated tasks.
// --- New: Create a page for the Tasks UI ---\
// --- New: Implement fetching and displaying tasks ---\
// --- New: Add UI for creating, editing, and deleting tasks ---\
// --- New: Implement realtime updates for tasks and task steps ---\
// --- New: Add UI for viewing task steps and their status ---\
// --- New: Add UI for manually starting, pausing, resuming, and cancelling tasks ---\
// --- New: Add UI for linking/unlinking tasks to Key Results ---\
// --- New: Create a page for the Goals UI ---\
// --- New: Implement fetching and displaying goals ---\
// --- New: Add UI for creating, editing, and deleting goals ---\
// --- New: Implement realtime updates for goals and key results ---\
// --- New: Add UI for creating, editing, and deleting key results ---\
// --- New: Display linked tasks for key results ---\
// --- New: Add UI for filtering goals by type and status ---\
// --- New: Add UI for manually updating KR progress ---\


import React, { useEffect, useState } from 'react';
import { SelfNavigationEngine } from '../core/self-navigation/SelfNavigationEngine'; // To fetch tasks (for linked tasks display)
import { GoalManagementService } from '../core/goal-management/GoalManagementService'; // To fetch and manage goals/KRs
import { AuthorityForgingEngine } from '../core/authority/AuthorityForgingEngine'; // Use for action recording
import { Task, TaskStep, Goal, KeyResult } from '../interfaces'; // Import types
import { Play, Pause, XCircle, RotateCcw, ChevronDown, ChevronUp, Trash2, Edit, PlusCircle, MinusCircle, Link as LinkIcon, Unlink, Target, Loader2, Info, MessageSquare, Globe, Zap, Bell, Filter, CalendarDays } from 'lucide-react'; // Import icons including Link and Unlink, Loader2, Info, MessageSquare, Globe, Zap, Bell, Target, Filter, CalendarDays


// Access core modules from the global window object (for MVP simplicity)
// In a real app, use React Context or dependency injection
declare const window: any;
const selfNavigationEngine: SelfNavigationEngine = window.systemContext?.selfNavigationEngine; // The Self-Navigation (自我導航) pillar
const authorityForgingEngine: any = window.systemContext?.authorityForgingEngine; // Use any for action recording (權能鍛造)
const goalManagementService: GoalManagementService = window.systemContext?.goalManagementService; // The Goal Management (目標管理) module
const systemContext: any = window.systemContext; // Access the full context for currentUser


// Define available goal types for filtering and creation
const GOAL_TYPES = ['smart', 'okr'] as const;
type GoalType = typeof GOAL_TYPES[number];

// Define available goal statuses for filtering
const GOAL_STATUSES = ['pending', 'in-progress', 'completed', 'cancelled'] as const;
type GoalStatus = typeof GOAL_STATUSES[number];

// Define available KR statuses for filtering (less common on goal list page, but useful)
const KR_STATUSES = ['on-track', 'at-risk', 'completed'] as const;
type KrStatus = typeof KR_STATUSES[number];


const Goals: React.FC = () => {
  const [goals, setGoals] = useState<Goal[]>([]); // State to hold goals
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedGoals, setExpandedGoals] = useState<Record<string, boolean>>({}); // State to track expanded goals

  // --- State for creating new goal ---\
  const [showCreateGoalModal, setShowCreateGoalModal] = useState(false);
  const [newGoalDescription, setNewGoalDescription] = useState('');
  const [newGoalType, setNewGoalType] = useState<GoalType>('smart');
  const [newGoalTargetDate, setNewGoalTargetDate] = useState(''); // Date string
  const [newKeyResults, setNewKeyResults] = useState<Omit<KeyResult, 'id' | 'goal_id' | 'status' | 'current_value' | 'linked_task_ids'>[]>([]); // For new OKR KRs
  const [isSavingGoal, setIsSavingGoal] = useState(false);
  const [createGoalError, setCreateGoalError] = useState<string | null>(null); // Error specific to goal creation
  // --- End New ---\

  // --- State for editing goal ---\
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null); // The goal being edited
  const [editingGoalDescription, setEditingGoalDescription] = useState('');
  const [editingGoalTargetDate, setEditingGoalTargetDate] = useState(''); // Date string
  const [isUpdatingGoal, setIsUpdatingGoal] = useState(false);
  const [editGoalError, setEditGoalError] = useState<string | null>(null); // Error specific to goal editing
  // --- End New ---\

  // --- New: State for editing Key Result ---\
  const [editingKr, setEditingKr] = useState<KeyResult | null>(null); // The KR being edited
  const [editingKrDescription, setEditingKrDescription] = useState('');
  const [editingKrTargetValue, setEditingKrTargetValue] = useState<number>(0);
  const [editingKrUnit, setEditingKrUnit] = useState('');
  const [isUpdatingKr, setIsUpdatingKr] = useState(false);
  const [editKrError, setEditKrError] = useState<string | null>(null); // Error specific to KR editing
  // --- End New ---\

  // --- New: State for manual KR progress update ---\
  const [updatingKrId, setUpdatingKrId] = useState<string | null>(null); // Track which KR is being updated manually
  const [krUpdateValue, setKrUpdateValue] = useState<string>(''); // Value for manual KR update input
  const [isManuallyUpdatingKr, setIsManuallyUpdatingKr] = useState(false); // Loading state for manual update
  const [manualKrUpdateError, setManualKrUpdateError] = useState<string | null>(null); // Error for manual update
  // --- End New ---\

  // --- New: State for filtering ---\
  const [filterType, setFilterType] = useState<GoalType | ''>(''); // Filter by type
  const [filterStatus, setFilterStatus] = useState<GoalStatus | ''>(''); // Filter by status
  // --- End New ---\


  const fetchGoals = async (typeFilter?: GoalType, statusFilter?: GoalStatus) => {
       const userId = systemContext?.currentUser?.id;
       if (!goalManagementService || !userId) {
            setError(\"GoalManagementService module not initialized or user not logged in.\");
            setLoading(false);
            return;
        }
      setLoading(true);
      setError(null); // Clear main error when fetching
      try {
          // Fetch goals for the current user from Supabase (Part of \u76ee\u6a19\u7ba1\u7406 / \u96d9\u5410\u540c\u6b65\u9818\u57df)\
          const userGoals = await goalManagementService.getGoals(userId, statusFilter); // Pass userId and statusFilter\
          // Apply type filter client-side for MVP if needed (or add to service method)\
          const filteredGoals = typeFilter ? userGoals.filter(goal => goal.type === typeFilter) : userGoals;\
          setGoals(filteredGoals);\\\
      } catch (err: any) {\\\
          console.error('Error fetching goals:', err);\\\
          setError(`;
Failed;
to;
load;
goals: $;
{
    err.message;
}
`);\\\
      } finally {\\\
          setLoading(false);\\\
      }\\\
  };\\\
\\\
  useEffect(() => {\\\n    // Fetch data when the component mounts or when the user changes or filters change\\\n    if (systemContext?.currentUser?.id) {\\\n        fetchGoals(filterType === '' ? undefined : filterType, filterStatus === '' ? undefined : filterStatus); // Fetch with current filters\\\n    }\\\n\\\n    // --- New: Subscribe to realtime updates for goals and key_results ---\\\n    let unsubscribeGoalInsert: (() => void) | undefined;\\\n    let unsubscribeGoalUpdate: (() => void) | undefined;\\\n    let unsubscribeGoalDelete: (() => void) | undefined;\\\n    let unsubscribeKrInsert: (() => void) | undefined;\\\n    let unsubscribeKrUpdate: (() => void) | undefined;\\\n    let unsubscribeKrDelete: (() => void) | undefined;\\\
\\\n\\\n    if (goalManagementService?.context?.eventBus) { // Check if GoalManagementService and its EventBus are available\\\n        const eventBus = goalManagementService.context.eventBus;\\\n        const userId = systemContext?.currentUser?.id;\\\
\\\n        // Subscribe to goal insert events\\\n        unsubscribeGoalInsert = eventBus.subscribe('goal_insert', (payload: Goal) => {\\\n            if (payload.user_id === userId && (filterType === '' || payload.type === filterType) && (filterStatus === '' || payload.status === filterStatus)) { // Apply filters\\\n                console.log('Goals page received goal_insert event:', payload);\\\n                // Add the new goal and keep sorted by creation timestamp (newest first)\\\n                setGoals(prevGoals => [payload, ...prevGoals].sort((a, b) => new Date(b.creation_timestamp).getTime() - new Date(a.creation_timestamp).getTime()));\\\n            }\\\n        });\\\n         // Subscribe to goal update events\\\n         unsubscribeGoalUpdate = eventBus.subscribe('goal_updated', (payload: Goal) => {\\\n             if (payload.user_id === userId) {\\\n                 console.log('Goals page received goal_updated event:', payload);\\\n                 // Update the specific goal in the state if it matches filters, otherwise remove it\\\n                 if ((filterType === '' || payload.type === filterType) && (filterStatus === '' || payload.status === filterStatus)) {\\\n                     setGoals(prevGoals => prevGoals.map(goal => goal.id === payload.id ? payload : goal));\\\n                 } else {\\\n                     setGoals(prevGoals => prevGoals.filter(goal => goal.id !== payload.id));\\\n                 }\\\n             }\\\n         });\\\n          // Subscribe to goal delete events\\\n          unsubscribeGoalDelete = eventBus.subscribe('goal_delete', (payload: { goalId: string, userId: string }) => {\\\n             if (payload.userId === userId) {\\\n                 console.log('Goals page received goal_delete event:', payload);\\\n                 // Remove the deleted goal from the state\\\n                 setGoals(prevGoals => prevGoals.filter(goal => goal.id !== payload.goalId));\\\n             }\\\n         });\\\n\\\n        // Subscribe to key result insert events\\\n        unsubscribeKrInsert = eventBus.subscribe('key_result_insert', (payload: KeyResult & { goal_id: string, user_id: string }) => { // Payload includes goal_id and user_id\\\n             if (payload.user_id === userId) {\\\n                 console.log('Goals page received key_result_insert event:', payload);\\\n                 // Add the new KR to the correct goal if the goal is currently displayed and matches filters\\\n                 setGoals(prevGoals =>\\\n                     prevGoals.map(goal =>\\\n                         goal.id === payload.goal_id && (filterType === '' || goal.type === filterType) && (filterStatus === '' || goal.status === filterStatus)\\\n                             ? { ...goal, key_results: [...(goal.key_results || []), payload] }\\\n                             : goal\\\n                     )\\\n                 );\\\n             }\\\n        });\\\n         // Subscribe to key result update events\\\n         unsubscribeKrUpdate = eventBus.subscribe('key_result_updated', (payload: KeyResult & { goal_id: string, user_id: string }) => { // Payload includes goal_id and user_id\\\n             if (payload.user_id === userId) {\\\n                 console.log('Goals page received key_result_updated event:', payload);\\\n                 // Update the specific KR within the specific goal if the goal is currently displayed and matches filters\\\n                 setGoals(prevGoals =>\\\n                     prevGoals.map(goal =>\\\n                         goal.id === payload.goal_id && (filterType === '' || goal.type === filterType) && (filterStatus === '' || goal.status === filterStatus)\\\n                             ? { ...goal, key_results: goal.key_results?.map(kr => kr.id === payload.id ? payload : kr) }\\\n                             : goal\\\n                     )\\\n                 );\\\n             }\\\n         });\\\n          // Subscribe to key result delete events\\\n          unsubscribeKrDelete = eventBus.subscribe('key_result_delete', (payload: { krId: string, goalId: string, userId: string }) => { // Payload includes goal_id and user_id\\\n             if (payload.userId === userId) {\\\n                 console.log('Goals page received key_result_delete event:', payload);\\\n                 // Remove the deleted KR from the correct goal if the goal is currently displayed and matches filters\\\n                 setGoals(prevGoals =>\\\n                     prevGoals.map(goal =>\\\n                         goal.id === payload.goalId && (filterType === '' || goal.type === filterType) && (filterStatus === '' || goal.status === filterStatus)\\\n                             ? { ...goal, key_results: goal.key_results?.filter(kr => kr.id !== payload.krId) }\\\n                             : goal\\\n                     )\\\n                 );\\\n             }\\\n         });\\\n    }\\\n    // --- End New ---\\\n\\\n\\\n    return () => {\\\n        // Unsubscribe on component unmount\\\n        unsubscribeGoalInsert?.();\\\n        unsubscribeGoalUpdate?.();\\\n        unsubscribeGoalDelete?.();\\\n        unsubscribeKrInsert?.();\\\n        unsubscribeKrUpdate?.();\\\n        unsubscribeKrDelete?.();\\\
    };\\\n\\\n  }, [systemContext?.currentUser?.id, goalManagementService, filterType, filterStatus]); // Re-run effect when user ID, service, or filters change\\\
\\\
\\\
    const toggleExpandGoal = (goalId: string) => {\\\
        setExpandedGoals(prevState => ({\\\
            ...prevState,\\\
            [goalId]: !prevState[goalId]\\\
        }));\\\
    };\\\
\\\
    const getGoalStatusColor = (status: Goal['status']) => {\\\
        switch (status) {\\\
            case 'completed': return 'text-green-400';\\\
            case 'failed': return 'text-red-400';\\\
            case 'in-progress': return 'text-blue-400';\\\
            case 'cancelled': return 'text-neutral-400';\\\
            case 'pending': return 'text-neutral-300';\\\
            default: return 'text-neutral-300';\\\
        }\\\
    };\\\
\\\
     const getKrStatusColor = (status: KeyResult['status']) => {\\\
        switch (status) {\\\
            case 'completed': return 'text-green-400';\\\
            case 'at-risk': return 'text-red-400';\\\
            case 'on-track': return 'text-blue-400';\\\
            default: return 'text-neutral-300';\\\
        }\\\
    };\\\
\\\
    // --- New: Handle Create Goal ---\\\
    const handleOpenCreateGoalModal = () => {\\\
        setShowCreateGoalModal(true);\\\
        setNewGoalDescription('');\\\
        setNewGoalType('smart');\\\
        setNewGoalTargetDate('');\\\
        setNewKeyResults([]);\\\
        setCreateGoalError(null);\\\
    };\\\
\\\
    const handleCloseCreateGoalModal = () => {\\\
        setShowCreateGoalModal(false);\\\
        setNewGoalDescription('');\\\
        setNewGoalType('smart');\\\
        setNewGoalTargetDate('');\\\
        setNewKeyResults([]);\\\
        setCreateGoalError(null);\\\
    };\\\
\\\
    const handleCreateGoal = async (e: React.FormEvent) => {\\\
        e.preventDefault();\\\
        const userId = systemContext?.currentUser?.id;\\\
        if (!goalManagementService || !userId || !newGoalDescription.trim() || (newGoalType === 'smart' && !newGoalTargetDate) || (newGoalType === 'okr' && newKeyResults.length === 0)) {\\\
            setCreateGoalError(\\\"GoalManagementService module not initialized, user not logged in, or required fields are empty.\\\");\\\
            return;\\\
        }\\\
\\\
        // Basic validation for KR details if OKR\\\
        if (newGoalType === 'okr') {\\\
            for (const kr of newKeyResults) {\\\
                if (!kr.description.trim() || kr.target_value === undefined || kr.unit === undefined) {\\\
                    setCreateGoalError('Please fill in description, target value, and unit for all Key Results.');\\\
                    return;\\\
                }\\\
            }\\\
        }\\\
\\\
        setIsSavingGoal(true);\\\
        setCreateGoalError(null);\\\
        try {\\\
            const goalDetails: Omit<Goal, 'id' | 'status' | 'creation_timestamp' | 'key_results'> = {\\\
                user_id: userId, // Ensure user_id is included\\\
                description: newGoalDescription.trim(),\\\
                type: newGoalType,\\\
                target_completion_date: newGoalType === 'smart' ? newGoalTargetDate : undefined,\\\
                linked_task_ids: [], // Initialize empty array\\\
            };\\\
\\\
            // Create the goal and its key results\\\
            const createdGoal = await goalManagementService.createGoal(goalDetails, newKeyResults, userId); // Pass goalDetails, keyResults, userId\\\
\\\
            if (createdGoal) {\\\
                alert(`;
Goal;
"${createdGoal.description}\\\\\\\" created successfully!`);\\\
                console.log('Created new goal:', createdGoal);\\\
                handleCloseCreateGoalModal(); // Close modal\\\
                // State update handled by realtime listener\\\
                 // Simulate recording user action\\\
                authorityForgingEngine?.recordAction({\\\
                    type: 'web:goals:create',\\\
                    details: { goalId: createdGoal.id, description: createdGoal.description, type: createdGoal.type },\\\
                    context: { platform: 'web', page: 'goals' },\\\
                    user_id: userId, // Associate action with user\\\
                });\\\
            } else {\\\
                setCreateGoalError('Failed to create goal.');\\\
            }\\\
        } catch (err: any) {\\\
            console.error('Error creating goal:', err);\\\
            setCreateGoalError(`Failed to create goal: ${err.message}`);\\\
        } finally {\\\
            setIsSavingGoal(false);\\\
        }\\\
    };\\\
\\\
    const handleAddKrToNewGoal = () => {\\\
        const newKr: Omit<KeyResult, 'id' | 'goal_id' | 'status' | 'current_value' | 'linked_task_ids'> = {\\\
            description: '',\\\
            target_value: 0,\\\
            unit: '',\\\
        };\\\
        setNewKeyResults([...newKeyResults, newKr]);\\\
    };\\\
\\\
    const handleRemoveKrFromNewGoal = (index: number) => {\\\
        setNewKeyResults(newKeyResults.filter((_, i) => i !== index));\\\
    };\\\
\\\
    const handleNewKrChange = (index: number, field: keyof Omit<KeyResult, 'id' | 'goal_id' | 'status' | 'current_value' | 'linked_task_ids'>, value: any) => {\\\
        const updatedKrs = [...newKeyResults];\\\
        (updatedKrs[index] as any)[field] = value; // Type assertion needed for dynamic field access\\\
        setNewKeyResults(updatedKrs);\\\
    };\\\
    // --- End New ---\\\
\\\
    // --- New: Handle Edit Goal ---\\\
    const handleEditGoalClick = (goal: Goal) => {\\\
        setEditingGoal(goal);\\\
        setEditingGoalDescription(goal.description);\\\
        setEditingGoalTargetDate(goal.target_completion_date || '');\\\
        // Note: Goal type and KRs are not editable in this modal for MVP\\\
        setEditGoalError(null); // Clear previous errors when starting edit\\\
    };\\\
\\\
    const handleUpdateGoal = async (e: React.FormEvent) => {\\\
        e.preventDefault();\\\
        const userId = systemContext?.currentUser?.id;\\\
        if (!goalManagementService || !editingGoal || !userId) return; // Safety checks\\\
\\\
        if (!editingGoalDescription.trim()) {\\\
            alert('Please enter a goal description.');\\\
            return;\\\
        }\\\
        if (editingGoal.type === 'smart' && !editingGoalTargetDate) {\\\
             alert('SMART goal requires a target completion date.');\\\
             return;\\\
        }\\\
\\\
        setIsUpdatingGoal(true);\\\
        setEditGoalError(null);\\\
        try {\\\
            const updates: Partial<Omit<Goal, 'id' | 'user_id' | 'creation_timestamp' | 'key_results'>> = {\\\
                description: editingGoalDescription.trim(),\\\
                target_completion_date: editingGoal.type === 'smart' ? editingGoalTargetDate : undefined,\\\
                // Note: Status, type, linked_task_ids are not editable here in MVP\\\
            };\\\
\\\
            // Update the goal\\\
            const updatedGoal = await goalManagementService.updateGoal(editingGoal.id, updates, userId); // Pass goalId, updates, userId\\\
\\\
            if (updatedGoal) {\\\
                alert(`Goal \\\\\\\"${updatedGoal.description}\\\\\\\" updated successfully!`);\\\
                console.log('Goal updated:', updatedGoal);\\\
                setEditingGoal(null); // Close edit form\\\
                setEditingGoalDescription('');\\\
                setEditingGoalTargetDate('');\\\
                // State update handled by realtime listener\\\
                 // Simulate recording user action\\\
                authorityForgingEngine?.recordAction({\\\
                    type: 'web:goals:update',\\\
                    details: { goalId: updatedGoal.id, description: updatedGoal.description },\\\
                    context: { platform: 'web', page: 'goals' },\\\
                    user_id: userId, // Associate action with user\\\
                });\\\
            }\\\
        } catch (err: any) {\\\
            console.error('Error updating goal:', err);\\\
            setEditGoalError(`Failed to update goal: ${err.message}`);\\\
        } finally {\\\
            setIsUpdatingGoal(false);\\\
        }\\\
    };\\\
\\\
    const handleCancelEditGoal = () => {\\\
        setEditingGoal(null);\\\
        setEditingGoalDescription('');\\\
        setEditingGoalTargetDate('');\\\
        setEditGoalError(null);\\\
    };\\\
    // --- End New ---\\\
\\\
    // --- New: Handle Edit Key Result ---\\\
    const handleEditKrClick = (kr: KeyResult) => {\\\
        setEditingKr(kr);\\\
        setEditingKrDescription(kr.description);\\\
        setEditingKrTargetValue(kr.target_value);\\\
        setEditingKrUnit(kr.unit || '');\\\
        setEditKrError(null); // Clear previous errors\\\
    };\\\
\\\
    const handleUpdateKr = async (e: React.FormEvent) => {\\\
        e.preventDefault();\\\
        const userId = systemContext?.currentUser?.id;\\\
        if (!goalManagementService || !editingKr || !userId) return; // Safety checks\\\
\\\
        if (!editingKrDescription.trim() || editingKrTargetValue === undefined || editingKrUnit.trim() === '') {\\\
            alert('Please enter description, target value, and unit for Key Result.');\\\
            return;\\\
        }\\\
\\\
        setIsUpdatingKr(true);\\\
        setEditKrError(null);\\\
        try {\\\
            const updates: Partial<Omit<KeyResult, 'id' | 'goal_id' | 'status' | 'current_value' | 'linked_task_ids'>> = {\\\
                description: editingKrDescription.trim(),\\\
                target_value: editingKrTargetValue,\\\
                unit: editingKrUnit.trim(),\\\
                // Note: Status, current_value, linked_task_ids are not editable here\\\
            };\\\
\\\
            // Update the Key Result\\\
            const updatedKr = await goalManagementService.updateKeyResult(editingKr.id, updates, userId); // Pass krId, updates, userId\\\
\\\
            if (updatedKr) {\\\
                alert(`Key Result \\\\\\\"${updatedKr.description}\\\\\\\" updated successfully!`);\\\
                console.log('Key Result updated:', updatedKr);\\\
                setEditingKr(null); // Close edit form\\\
                setEditingKrDescription('');\\\
                setEditingKrTargetValue(0);\\\
                setEditingKrUnit('');\\\
                // State update handled by realtime listener\\\
                 // Simulate recording user action\\\
                authorityForgingEngine?.recordAction({\\\
                    type: 'web:goals:update_kr',\\\
                    details: { krId: updatedKr.id, description: updatedKr.description },\\\
                    context: { platform: 'web', page: 'goals' },\\\
                    user_id: userId, // Associate action with user\\\
                });\\\
            }\\\
        } catch (err: any) {\\\
            console.error('Error updating Key Result:', err);\\\
            setEditKrError(`Failed to update Key Result: ${err.message}`);\\\
        } finally {\\\
            setIsUpdatingKr(false);\\\
        }\\\
    };\\\
\\\
    const handleCancelEditKr = () => {\\\
        setEditingKr(null);\\\
        setEditingKrDescription('');\\\
        setEditingKrTargetValue(0);\\\
        setEditingKrUnit('');\\\
        setEditKrError(null);\\\
    };\\\
    // --- End New ---\\\
\\\
    // --- New: Handle Add Key Result to Existing Goal ---\\\
    const handleAddKrToGoal = async (goalId: string) => {\\\
        const userId = systemContext?.currentUser?.id;\\\
        if (!goalManagementService || !userId || !goalId) {\\\
            alert(\\\"GoalManagementService module not initialized, user not logged in, or goal ID is missing.\\\");\\\
            return;\\\
        }\\\
\\\
        const krDescription = prompt('Enter description for the new Key Result:');\\\
        if (!krDescription) return; // Cancel if no description\\\
\\\
        const krTargetValueStr = prompt('Enter target value for the new Key Result:');\\\
        if (!krTargetValueStr) return; // Cancel if no target value\\\
        const krTargetValue = parseFloat(krTargetValueStr);\\\
        if (isNaN(krTargetValue)) {\\\
             alert('Invalid target value. Please enter a number.');\\\
             return;\\\
        }\\\
\\\
        const krUnit = prompt('Enter unit for the new Key Result (e.g., %, count, dollars):');\\\
        if (!krUnit) return; // Cancel if no unit\\\
\\\
        setIsSavingGoal(true); // Use goal saving state for simplicity\\\
        setError(null); // Clear main error\\\
        try {\\\
            const krDetails: Omit<KeyResult, 'id' | 'goal_id' | 'status' | 'current_value' | 'linked_task_ids'> = {\\\
                description: krDescription.trim(),\\\
                target_value: krTargetValue,\\\
                unit: krUnit.trim(),\\\
            };\\\
\\\
            // Add the Key Result to the goal\\\
            const createdKr = await goalManagementService.addKeyResultToGoal(goalId, krDetails, userId); // Pass goalId, krDetails, userId\\\
\\\
            if (createdKr) {\\\
                alert(`Key Result \\\\\\\"${createdKr.description}\\\\\\\" added successfully to goal!`);\\\
                console.log('Added new KR:', createdKr);\\\
                // State update handled by realtime listener\\\
                 // Simulate recording user action\\\
                authorityForgingEngine?.recordAction({\\\
                    type: 'web:goals:add_kr',\\\
                    details: { goalId: goalId, krId: createdKr.id, description: createdKr.description },\\\
                    context: { platform: 'web', page: 'goals' },\\\
                    user_id: userId, // Associate action with user\\\
                });\\\
            }\\\
        } catch (err: any) {\\\
            console.error('Error adding Key Result:', err);\\\
            setError(`Failed to add Key Result: ${err.message}`);\\\
            alert(`Failed to add Key Result: ${err.message}`);\\\
        } finally {\\\
            setIsSavingGoal(false);\\\
        }\\\
    };\\\
    // --- End New ---\\\
\\\
    // --- New: Handle Delete Key Result ---\\\
    const handleDeleteKr = async (krId: string) => {\\\
        const userId = systemContext?.currentUser?.id;\\\
        if (!goalManagementService || !userId) {\\\
            alert(\\\"GoalManagementService module not initialized or user not logged in.\\\");\\\
            return;\\\
        }\\\
        if (!confirm(`Are you sure you want to delete this Key Result?`)) return;\\\
\\\
        setIsUpdatingKr(true); // Use KR updating state for simplicity\\\
        setError(null); // Clear main error\\\
        try {\\\
            // Delete the Key Result\\\
            const success = await goalManagementService.deleteKeyResult(krId, userId); // Pass krId and userId\\\
\\\
            if (success) {\\\
                console.log('Key Result deleted:', krId);\\\
                // State update handled by realtime listener\\\
                 alert('Key Result deleted successfully!');\\\
                 // Simulate recording user action\\\
                authorityForgingEngine?.recordAction({\\\
                    type: 'web:goals:delete_kr',\\\
                    details: { krId },\\\
                    context: { platform: 'web', page: 'goals' },\\\
                    user_id: userId, // Associate action with user\\\
                });\\\
            }\\\
        } catch (err: any) {\\\
            console.error('Error deleting Key Result:', err);\\\
            setError(`Failed to delete Key Result: ${err.message}`);\\\
            alert(`Failed to delete Key Result: ${err.message}`);\\\
        } finally {\\\
            setIsUpdatingKr(false);\\\
        }\\\
    };\\\
    // --- End New ---\\\
\\\
    // --- New: Handle Manual KR Progress Update ---\\\
    const handleManualKrUpdate = async (kr: KeyResult) => {\\\
        const userId = systemContext?.currentUser?.id;\\\
        if (!goalManagementService || !userId) {\\\
            alert(\\\"GoalManagementService module not initialized or user not logged in.\\\");\\\
            return;\\\
        }\\\
\\\
        const newValueStr = prompt(`Enter new current value for Key Result \\\\\\\"${kr.description}\\\\\\\" (Current: ${kr.current_value} ${kr.unit}, Target: ${kr.target_value} ${kr.unit}):`);\\\
        if (newValueStr === null) return; // Cancel if prompt is cancelled\\\
\\\
        const newValue = parseFloat(newValueStr);\\\
        if (isNaN(newValue)) {\\\
             alert('Invalid value. Please enter a number.');\\\
             return;\\\
        }\\\
\\\
        setIsManuallyUpdatingKr(true); // Indicate manual update is running\\\
        setManualKrUpdateError(null); // Clear previous errors\\\
        setUpdatingKrId(kr.id); // Track which KR is being updated\\\
\\\
        try {\\\
            // Call the GoalManagementService method to update KR progress\\\
            const updatedKr = await goalManagementService.updateKeyResultProgress(kr.id, newValue, userId);\\\
\\\
            if (updatedKr) {\\\
                alert(`Key Result \\\\\\\"${updatedKr.description}\\\\\\\" progress updated to ${updatedKr.current_value} ${updatedKr.unit}. Status: ${updatedKr.status}.`);\\\
                console.log('Manual KR progress updated:', updatedKr);\\\
                // State update handled by realtime listener\\\
                 // Simulate recording user action\\\
                authorityForgingEngine?.recordAction({\\\
                    type: 'web:goals:manual_update_kr_progress',\\\
                    details: { krId: updatedKr.id, description: updatedKr.description, newValue: updatedKr.current_value },\\\
                    context: { platform: 'web', page: 'goals' },\\\
                    user_id: userId, // Associate action with user\\\
                });\\\
            }\\\
        } catch (err: any) {\\\
            console.error('Error manually updating KR progress:', err);\\\
            setManualKrUpdateError(`Failed to update progress: ${err.message}`);\\\
            alert(`Failed to update progress: ${err.message}`);\\\
        } finally {\\\
            setIsManuallyUpdatingKr(false);\\\
            setUpdatingKrId(null);\\\
        }\\\
    };\\\
    // --- End New ---\\\
\\\
\\\
   // Ensure user is logged in before rendering content\\\
  if (!systemContext?.currentUser) {\\\
       // This case should ideally be handled by ProtectedRoute, but as a fallback:\\\
       return (\\\
            <div className=\"container mx-auto p-4 flex justify-center\">\\\
               <div className=\"bg-neutral-800/50 p-8 rounded-lg shadow-xl w-full max-w-md text-center text-neutral-300\">\\\
                   <p>Please log in to view your goals.</p>\\\
               </div>\\\
            </div>\\\
       );\\\
  }\\\
\\\
\\\
  return (\\\
    <div className=\"container mx-auto p-4\">\\\
      <div className=\"bg-neutral-800/50 p-6 rounded-lg shadow-xl\">\\\
        <h2 className=\"text-3xl font-bold text-blue-400 mb-6\">Goal Management (\\\\u76ee\\\\u6a19\\\\u7ba1\\\\u7406)</h2>\\\
        <p className=\"text-neutral-300 mb-8\">Define, track, and manage your personal goals and key results.</p>\\\
\\\n        {/* New: Create New Goal Button */}\\\n        {!editingGoal && !editingKr && !showCreateGoalModal && ( // Only show create button if not creating/editing goal or KR\\\n            <div className=\"mb-8 p-4 bg-neutral-700/50 rounded-lg\">\\\n                 <h3 className=\"text-xl font-semibold text-blue-300 mb-3\">Create New Goal</h3>\\\n                 <button\\\n                     className=\"px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition disabled:opacity-50\"\n                     onClick={handleOpenCreateGoalModal}\\\n                     disabled={isSavingGoal || isUpdatingGoal || isUpdatingKr || isManuallyUpdatingKr}\\\n                 >\\\n                     <PlusCircle size={20} className=\"inline-block mr-2\"/> Create Goal\\\n                 </button>\\\n            </div>\\\n        )}\\\n        {/* End New */}\\\n\\\n        {/* New: Filter Section */}\\\n        <div className=\"mb-8 p-4 bg-neutral-700/50 rounded-lg\">\\\n             <h3 className=\"text-xl font-semibold text-blue-300 mb-3 flex items-center gap-2\\\"><Filter size={20}/> Filter Goals</h3>\\\n             <div className=\"flex flex-wrap items-center gap-4\">\\\n                 <div>\\\n                     <label htmlFor=\"filterType\" className=\"block text-neutral-300 text-sm font-semibold mb-1\">Type:</label>\\\n                     <select\\\n                         id=\"filterType\"\\\n                         className=\"p-2 rounded-md bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500\"\n                         value={filterType}\\\n                         onChange={(e) => setFilterType(e.target.value as GoalType | '')}\\\n                         disabled={loading}\\\n                     >\\\n                         <option value=\"\">All Types</option>\\\n                         {GOAL_TYPES.map(type => (\\\n                             <option key={type} value={type}>{type.replace(/_/g, ' ').toUpperCase()}</option>\\\n                         ))}\\\n                     </select>\\\n                 </div>\\\n                  <div>\\\n                     <label htmlFor=\"filterStatus\" className=\"block text-neutral-300 text-sm font-semibold mb-1\">Status:</label>\\\n                     <select\\\n                         id=\"filterStatus\"\\\n                         className=\"p-2 rounded-md bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500\"\n                         value={filterStatus}\\\n                         onChange={(e) => setFilterStatus(e.target.value as GoalStatus | '')}\\\n                         disabled={loading}\\\n                     >\\\n                         <option value=\"\">All Statuses</option>\\\n                         {GOAL_STATUSES.map(status => (\\\n                             <option key={status} value={status}>{status.replace(/_/g, ' ').toUpperCase()}</option>\\\
                         ))}\\\
                     </select>\\\
                 </div>\\\
             </div>\\\
        </div>\\\
        {/* End New */}\\\
\\\
        {/* Goals List */}\\\
        <div className=\"p-4 bg-neutral-700/50 rounded-lg\">\\\
            <h3 className=\"text-xl font-semibold text-blue-300 mb-3\">Your Goals ({goals.length})</h3>\\\
            {loading && !isSavingGoal && !isUpdatingGoal && !isUpdatingKr && !isManuallyUpdatingKr ? ( // Show loading only if not currently saving/updating\\\
              <p className=\"text-neutral-400\">Loading goals...</p>\\\
            ) : error && !showCreateGoalModal && !editingGoal && !editingKr ? ( // Show main error if not in any modal\\\
                 <p className=\"text-red-400\">Error: {error}</p>\\\
            ) : goals.length === 0 ? (\\\
              <p className=\"text-neutral-400\">No goals found yet{filterType || filterStatus ? ' matching your filters' : ''}. Create one using the form above.</p>\\\
            ) : (\\\
              <ul className=\"space-y-4\">\\\
                {goals.map((goal) => (\\\
                  <li key={goal.id} className={`bg-neutral-600/50 p-4 rounded-md border-l-4 ${getGoalStatusColor(goal.status).replace('text-', 'border-')}`}>\
                    <div className=\"flex justify-between items-center\">\
                        <div className=\"flex items-center gap-3\">\
                            <Target size={20} className=\"text-blue-400\"/>\
                            <h4 className={`font-semibold mb-1 ${getGoalStatusColor(goal.status)}`}>{goal.description}</h4>\
                        </div>\
                         <button onClick={() => toggleExpandGoal(goal.id)} className=\"text-neutral-400 hover:text-white transition\">\
                            {expandedGoals[goal.id] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}\
                         </button>\
                    </div>\
                    <p className=\"text-neutral-300 text-sm\">Type: {goal.type.toUpperCase()} | Status: <span className={getGoalStatusColor(goal.status)}>{goal.status}</span></p>\
                    {goal.target_completion_date && <p className=\"text-neutral-300 text-sm\">Target Date: {new Date(goal.target_completion_date).toLocaleDateString()}</p>}\
                    <small className=\"text-neutral-400 text-xs block mt-1\">\
                        ID: {goal.id} | Created: {new Date(goal.creation_timestamp).toLocaleString()}\
                    </small>\
\
                    {/* Key Results (Collapsible) */}\
                    {expandedGoals[goal.id] && goal.type === 'okr' && ((\
                        <div className=\"mt-4 border-t border-neutral-600 pt-4\">\
                            <div className=\"flex justify-between items-center mb-3\">\
                                <h5 className=\"text-neutral-300 text-sm font-semibold\">Key Results ({goal.key_results?.length || 0})</h5>\
                                {/* New: Add KR Button */}\
                                <button\
                                    className=\"px-4 py-1 text-xs bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed\"\
                                    onClick={() => handleAddKrToGoal(goal.id)}\
                                    disabled={isSavingGoal || isUpdatingGoal || isUpdatingKr || isManuallyUpdatingKr}\
                                >\
                                    <PlusCircle size={14} className=\"inline-block mr-1\"/> Add KR\
                                </button>\
                                {/* End New */}\
                            </div>\
                            {goal.key_results && goal.key_results.length > 0 ? (\
                                <ul className=\"space-y-3\">\
                                    {goal.key_results.map((kr) => (\
                                        <li key={kr.id} className={`p-3 rounded-md border-l-2 ${getKrStatusColor(kr.status).replace('text-', 'border-')} bg-neutral-700/50`}>\
                                            <div className=\"flex justify-between items-center mb-1\">\
                                                <p className=\"text-sm font-medium text-neutral-300\">KR: {kr.description}</p>\
                                                <small className={`text-xs font-semibold ${getKrStatusColor(kr.status)}`}>{kr.status.toUpperCase()}</small>\
                                            </div>\
                                            <p className=\"text-neutral-400 text-xs\">Progress: {kr.current_value} / {kr.target_value} {kr.unit}</p>\
                                            <small className=\"text-neutral-400 text-xs block mt-1\">\
                                                ID: {kr.id}\
                                            </small>\
                                            {/* New: Linked Tasks for KR */}\
                                            {kr.linked_task_ids && kr.linked_task_ids.length > 0 && ((\
                                                 <div className=\"mt-2 pt-2 border-t border-neutral-600 text-xs\">\
                                                     <h6 className=\"text-neutral-400 font-semibold mb-1\">Linked Tasks:</h6>\
                                                     <ul className=\"list-disc list-inside text-neutral-400\">\
                                                         {kr.linked_task_ids.map(taskId => (\
                                                             <li key={taskId} className=\"text-xs\">Task ID: {taskId}</li>\
                                                         ))}\
                                                     </ul>\
                                                      <small className=\"text-neutral-500 mt-1 block\">Tasks linked to this KR contribute to its progress (if configured).</small>\
                                                 </div>\
                                            ))}\
                                            {/* End New */}\
                                            {/* New: KR Actions */}\
                                            <div className=\"mt-3 flex gap-2\"> {/* Use flex-wrap for smaller screens */}\
                                                 {/* Manual Update Progress Button */}\
                                                 <button\
                                                     className=\"px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed\"\
                                                     onClick={() => handleManualKrUpdate(kr)}\
                                                     disabled={isSavingGoal || isUpdatingGoal || isUpdatingKr || isManuallyUpdatingKr}\
                                                 >\
                                                     {isManuallyUpdatingKr && updatingKrId === kr.id ? <Loader2 size={14} className=\"inline-block mr-1 animate-spin\"/> : <Edit size={14} className=\"inline-block mr-1\"/>)}\
                                                     {isManuallyUpdatingKr && updatingKrId === kr.id ? 'Updating...' : 'Update Progress'}\
                                                 </button>\
                                                 {/* Edit KR Button */}\
                                                 <button\
                                                    className=\"px-3 py-1 text-xs bg-yellow-600 text-white rounded hover:bg-yellow-700 transition disabled:opacity-50 disabled:cursor-not-allowed\"\
                                                    onClick={() => handleEditKrClick(kr)}\
                                                    disabled={isSavingGoal || isUpdatingGoal || isUpdatingKr || isManuallyUpdatingKr}\
                                                 >\
                                                    <Edit size={14} className=\"inline-block mr-1\"/> Edit\
                                                 </button>\
                                                 {/* Delete KR Button */}\
                                                 <button\
                                                    className=\"px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed\"\
                                                    onClick={() => handleDeleteKr(kr.id)}\\;
disabled = { isSavingGoal } || isUpdatingGoal || isUpdatingKr || isManuallyUpdatingKr;
    > ;
_jsx(Trash2, { size: 14, className: true });
"inline-block mr-1\"/> Delete\
                                                 </button>\
                                            </div>\
                                            {/* End New */}\
                                        </li>\
                                    ))}\
                                </ul>\
                            ) : (\
                                <p className=\"text-neutral-400 text-sm\">No Key Results defined for this OKR goal yet.</p>\
                            )}\
                        </div>\
                    ))}\
                     {expandedGoals[goal.id] && goal.type === 'smart' && ((\
                          <div className=\"mt-4 border-t border-neutral-600 pt-4\">\
                              <p className=\"text-neutral-400 text-sm\">SMART goals do not have Key Results.</p>\
                          </div>\
                     ))}\
\
                    {/* Goal Actions */}\
                    <div className=\"mt-4 flex flex-wrap gap-2\"> {/* Use flex-wrap for smaller screens */}\
                         {/* TODO: Add buttons for Start, Pause, Resume, Cancel Goal (if applicable) */}\
                         {/* Edit Goal Button */}\
                         <button\
                            className=\"px-3 py-1 text-sm bg-yellow-600 text-white font-semibold rounded-md hover:bg-yellow-700 transition disabled:opacity-50 disabled:cursor-not-allowed\"\
                            onClick={() => handleEditGoalClick(goal)}\
                            disabled={isSavingGoal || isUpdatingGoal || isUpdatingKr || isManuallyUpdatingKr}\
                         >\
                            <Edit size={16} className=\"inline-block mr-1\"/> Edit Goal\
                         </button>\
                         {/* Delete Goal Button */}\
                         <button\
                            className=\"px-3 py-1 text-sm bg-red-800 text-white font-semibold rounded-md hover:bg-red-900 transition disabled:opacity-50 disabled:cursor-not-allowed\"\
                            onClick={() => handleDeleteGoal(goal.id)}\
                            disabled={isSavingGoal || isUpdatingGoal || isUpdatingKr || isManuallyUpdatingKr}\
                         >\
                            <Trash2 size={16} className=\"inline-block mr-1\"/> Delete Goal\
                         </button>\
                         {/* TODO: Add Copy button (Part of \u6b0a\u80fd\u935b\u9020: \u89c0\u5bdf - record action) */}\
                    </div>\
                  </li>\
                ))}\
              </ul>\
            )}\
        </div>\
\
        {/* New: Create Goal Modal */}\
        {showCreateGoalModal && ((\
             <div className=\"fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50\">\
                 <div className=\"bg-neutral-800 p-8 rounded-lg shadow-xl w-full max-w-md max-h-[90%] flex flex-col\"> {/* Added flex-col and max-height */}\
                     <div className=\"flex justify-between items-center mb-4\">\
                         <h3 className=\"text-xl font-semibold text-blue-300\">Create New Goal</h3>\
                         <button\
                             type=\"button\"\
                             onClick={handleCloseCreateGoalModal}\
                             className=\"text-neutral-400 hover:text-white transition\"\
                             disabled={isSavingGoal}\
                         >\
                             <XCircle size={24} />\
                         </button>\
                     </div>\
                     <form onSubmit={handleCreateGoal} className=\"flex-grow flex flex-col overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-700 pr-2\"> {/* Added flex-grow, flex-col, overflow, pr-2 */}\
                         <div className=\"mb-4\">\
                             <label htmlFor=\"newGoalDescription\" className=\"block text-neutral-300 text-sm font-semibold mb-2\">Description:</label>\
                             <input\
                                 id=\"newGoalDescription\"\
                                 type=\"text\"\
                                 className=\"w-full p-2 rounded-md bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500\"\
                                 value={newGoalDescription}\
                                 onChange={(e) => setNewGoalDescription(e.target.value)}\
                                 placeholder=\"Enter goal description\"\
                                 disabled={isSavingGoal}\
                                 required\
                             />\
                         </div>\
                          <div className=\"mb-4\">\
                             <label htmlFor=\"newGoalType\" className=\"block text-neutral-300 text-sm font-semibold mb-2\">Type:</label>\
                             <select\
                                 id=\"newGoalType\"\
                                 className=\"w-full p-2 rounded-md bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm\"\
                                 value={newGoalType}\
                                 onChange={(e) => { setNewGoalType(e.target.value as GoalType); setNewKeyResults([]); }} // Reset KRs when type changes\
                                 disabled={isSavingGoal}\
                                 required\
                             >\
                                 {GOAL_TYPES.map(type => (\
                                     <option key={type} value={type}>{type.toUpperCase()}</option>\
                                 ))}\
                             </select>\
                         </div>\
                         {newGoalType === 'smart' && (\
                             <div className=\"mb-4\">\
                                 <label htmlFor=\"newGoalTargetDate\" className=\"block text-neutral-300 text-sm font-semibold mb-2\">Target Completion Date:</label>\
                                 <input\
                                     id=\"newGoalTargetDate\"\
                                     type=\"date\"\
                                     className=\"w-full p-2 rounded-md bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500\"\
                                     value={newGoalTargetDate}\
                                     onChange={(e) => setNewGoalTargetDate(e.target.value)}\
                                     disabled={isSavingGoal}\
                                     required\
                                 />\
                             </div>\
                         )}\
                          {newGoalType === 'okr' && ((\
                              <div className=\"mb-4 p-3 bg-neutral-600/50 rounded-md\">\
                                  <h4 className=\"text-neutral-300 text-sm font-semibold mb-2\">Key Results:</h4>\
                                  <ul className=\"space-y-3\">\
                                      {newKeyResults.map((kr, index) => (\
                                          <li key={index} className=\"p-3 bg-neutral-700/50 rounded-md border-l-2 border-blue-600\">\
                                              <div className=\"flex justify-between items-center mb-2\">\
                                                  <span className=\"text-sm font-medium text-neutral-300\">Key Result {index + 1}</span>\
                                                   <button\
                                                      type=\"button\"\
                                                      onClick={() => handleRemoveKrFromNewGoal(index)}\
                                                      className=\"text-red-400 hover:text-red-600 transition disabled:opacity-50\"\
                                                      disabled={isSavingGoal}\
                                                   >\
                                                       <MinusCircle size={18} />\
                                                   </button>\
                                              </div>\
                                              <div className=\"mb-2\">\
                                                  <label htmlFor={`new-kr-desc-${index}`} className=\"block text-neutral-400 text-xs font-semibold mb-1\">Description:</label>\
                                                  <input\
                                                      id={`new-kr-desc-${index}`}\
                                                      type=\"text\"\
                                                      className=\"w-full p-1 rounded-md bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm\"\
                                                      value={kr.description}\
                                                      onChange={(e) => handleNewKrChange(index, 'description', e.target.value)}\\;
placeholder = ;
"e.g., Increase website traffic\"\
                                                      disabled={isSavingGoal}\
                                                      required\
                                                  />\
                                              </div>\
                                               <div className=\"mb-2 grid grid-cols-2 gap-2\">\
                                                   <div>\
                                                       <label htmlFor={`new-kr-target-${index}`} className=\"block text-neutral-400 text-xs font-semibold mb-1\">Target Value:</label>\
                                                       <input\
                                                           id={`new-kr-target-${index}`}\
                                                           type=\"number\"\
                                                           step=\"0.1\"\
                                                           className=\"w-full p-1 rounded-md bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm\"\
                                                           value={kr.target_value}\
                                                           onChange={(e) => handleNewKrChange(index, 'target_value', parseFloat(e.target.value))}\
                                                           disabled={isSavingGoal}\
                                                           required\
                                                       />\
                                                   </div>\
                                                    <div>\
                                                       <label htmlFor={`new-kr-unit-${index}`} className=\"block text-neutral-400 text-xs font-semibold mb-1\">Unit:</label>\
                                                       <input\
                                                           id={`new-kr-unit-${index}`}\
                                                           type=\"text\"\
                                                           className=\"w-full p-1 rounded-md bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm\"\
                                                           value={kr.unit || ''}\
                                                           onChange={(e) => handleNewKrChange(index, 'unit', e.target.value)}\
                                                           placeholder=\"e.g., %\"\
                                                           disabled={isSavingGoal}\
                                                           required\
                                                       />\
                                                   </div>\
                                               </div>\
                                          </li>\
                                      ))}\
                                  </ul>\
                                   <button\
                                      type=\"button\"\
                                      onClick={handleAddKrToNewGoal}\
                                      className=\"mt-4 px-4 py-2 text-sm bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition disabled:opacity-50\"\
                                      disabled={isSavingGoal}\
                                   >\
                                       <PlusCircle size={16} className=\"inline-block mr-1\"/> Add Key Result\
                                   </button>\
                              </div>\
                          ))}\
\
                         {createGoalError && !isSavingGoal && ( // Show create error only after it finishes\
                             <p className=\"text-red-400 text-sm mt-4\">Error: {createGoalError}</p>\
                         )}\
                     </form>\
                     <div className=\"flex gap-4 justify-end mt-4 flex-shrink-0\"> {/* Added flex-shrink-0 */}\
                         <button\
                             type=\"button\"\
                             onClick={handleCloseCreateGoalModal}\
                             className=\"px-6 py-2 bg-neutral-600 text-white font-semibold rounded-md hover:bg-neutral-700 transition\"\
                             disabled={isSavingGoal}\
                         >\
                             Cancel\
                         </button>\
                         <button\
                             type=\"submit\" form=\"create-goal-form\" // Link button to form by ID\
                             className=\"px-6 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed\"\
                             disabled={isSavingGoal || !newGoalDescription.trim() || (newGoalType === 'smart' && !newGoalTargetDate) || (newGoalType === 'okr' && newKeyResults.length === 0) || (newGoalType === 'okr' && newKeyResults.some(kr => !kr.description.trim() || kr.target_value === undefined || kr.unit === undefined))}\
                         >\
                             {isSavingGoal ? 'Saving...' : 'Save Goal'}\
                         </button>\
                     </div>\
                 </div>\
             </div>\
        ))}\
        {/* End New */}\
\
        {/* New: Edit Goal Modal */}\
        {editingGoal && ((\
             <div className=\"fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50\">\
                 <div className=\"bg-neutral-800 p-8 rounded-lg shadow-xl w-full max-w-md max-h-[90%] flex flex-col\"> {/* Added flex-col and max-height */}\
                     <div className=\"flex justify-between items-center mb-4\">\
                         <h3 className=\"text-xl font-semibold text-blue-300\">Edit Goal: {editingGoal.description}</h3>\
                         <button\
                             type=\"button\"\
                             onClick={handleCancelEditGoal}\
                             className=\"text-neutral-400 hover:text-white transition\"\
                             disabled={isUpdatingGoal}\
                         >\
                             <XCircle size={24} />\
                         </button>\
                     </div>\
                     <form onSubmit={handleUpdateGoal} className=\"flex-grow flex flex-col overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-700 pr-2\"> {/* Added flex-grow, flex-col, overflow, pr-2 */}\
                         <div className=\"mb-4\">\
                             <label htmlFor=\"editingGoalDescription\" className=\"block text-neutral-300 text-sm font-semibold mb-2\">Description:</label>\
                             <input\
                                 id=\"editingGoalDescription\"\
                                 type=\"text\"\
                                 className=\"w-full p-2 rounded-md bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500\"\
                                 value={editingGoalDescription}\
                                 onChange={(e) => setEditingGoalDescription(e.target.value)}\
                                 placeholder=\"Edit goal description\"\
                                 disabled={isUpdatingGoal}\
                                 required\
                             />\
                         </div>\
                          {editingGoal.type === 'smart' && (\
                              <div className=\"mb-4\">\
                                  <label htmlFor=\"editingGoalTargetDate\" className=\"block text-neutral-300 text-sm font-semibold mb-2\">Target Completion Date:</label>\
                                  <input\
                                      id=\"editingGoalTargetDate\"\
                                      type=\"date\"\
                                      className=\"w-full p-2 rounded-md bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500\"\
                                      value={editingGoalTargetDate}\
                                      onChange={(e) => setEditingGoalTargetDate(e.target.value)}\
                                      disabled={isUpdatingGoal}\
                                      required\
                                  />\
                              </div>\
                          )}\
                         {/* Note: Goal type and KRs are not editable in this modal for MVP */}\
                         {editingGoal.type === 'okr' && editingGoal.key_results && editingGoal.key_results.length > 0 && ((\
                             <div className=\"mb-4 p-3 bg-neutral-600/50 rounded-md\">\
                                 <h4 className=\"text-neutral-300 text-sm font-semibold mb-2\">Key Results (View Only in MVP Edit):</h4>\
                                 <ul className=\"space-y-2\">\
                                     {editingGoal.key_results.map((kr, index) => (\
                                         <li key={kr.id} className={`p-3 rounded-md border-l-2 ${getKrStatusColor(kr.status).replace('text-', 'border-')} bg-neutral-700/50`}>\
                                             <p className=\"text-sm font-medium text-neutral-300\">KR {index + 1}: {kr.description}</p>\
                                             <p className=\"text-neutral-400 text-xs\">Progress: {kr.current_value} / {kr.target_value} {kr.unit}</p>\
                                         </li>\
                                     ))}\
                                 </ul>\
                             </div>\
                         ))}\
\
                         {editGoalError && !isUpdatingGoal && ( // Show save error only after it finishes\
                             <p className=\"text-red-400 text-sm mt-4\">Error: {editGoalError}</p>\
                         )}\
                     </form>\
                     <div className=\"flex gap-4 justify-end mt-4 flex-shrink-0\"> {/* Added flex-shrink-0 */}\
                         <button\
                             type=\"button\"\
                             onClick={handleCancelEditGoal}\
                             className=\"px-6 py-2 bg-neutral-600 text-white font-semibold rounded-md hover:bg-neutral-700 transition\"\
                             disabled={isUpdatingGoal}\
                         >\
                             Cancel\
                         </button>\
                         <button\
                             type=\"submit\" form=\"edit-goal-form\" // Link button to form by ID\
                             className=\"px-6 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed\"\
                             disabled={isUpdatingGoal || !editingGoalDescription.trim() || (editingGoal.type === 'smart' && !editingGoalTargetDate)}\
                         >\
                             {isUpdatingGoal ? 'Saving...' : 'Save Changes'}\
                         </button>\
                     </div>\
                 </div>\
             </div>\
        ))}\
        {/* End New */}\
\
        {/* New: Edit Key Result Modal */}\
        {editingKr && ((\
             <div className=\"fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50\">\
                 <div className=\"bg-neutral-800 p-8 rounded-lg shadow-xl w-full max-w-md max-h-[90%] flex flex-col\"> {/* Added flex-col and max-height */}\
                     <div className=\"flex justify-between items-center mb-4\">\
                         <h3 className=\"text-xl font-semibold text-blue-300\">Edit Key Result: {editingKr.description}</h3>\
                         <button\
                             type=\"button\"\
                             onClick={handleCancelEditKr}\
                             className=\"text-neutral-400 hover:text-white transition\"\
                             disabled={isUpdatingKr}\
                         >\
                             <XCircle size={24} />\
                         </button>\
                     </div>\
                     <form onSubmit={handleUpdateKr} className=\"flex-grow flex flex-col overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-700 pr-2\"> {/* Added flex-grow, flex-col, overflow, pr-2 */}\
                         <div className=\"mb-4\">\
                             <label htmlFor=\"editingKrDescription\" className=\"block text-neutral-300 text-sm font-semibold mb-2\">Description:</label>\
                             <input\
                                 id=\"editingKrDescription\"\
                                 type=\"text\"\
                                 className=\"w-full p-2 rounded-md bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500\"\
                                 value={editingKrDescription}\
                                 onChange={(e) => setEditingKrDescription(e.target.value)}\
                                 placeholder=\"Edit KR description\"\
                                 disabled={isUpdatingKr}\
                                 required\
                             />\
                         </div>\
                          <div className=\"mb-4 grid grid-cols-2 gap-2\">\
                              <div>\
                                  <label htmlFor=\"editingKrTargetValue\" className=\"block text-neutral-300 text-sm font-semibold mb-1\">Target Value:</label>\
                                  <input\
                                      id=\"editingKrTargetValue\"\
                                      type=\"number\"\
                                      step=\"0.1\"\
                                      className=\"w-full p-1 rounded-md bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm\"\
                                      value={editingKrTargetValue}\
                                      onChange={(e) => setEditingKrTargetValue(parseFloat(e.target.value))}\
                                      disabled={isUpdatingKr}\
                                      required\
                                  />\
                              </div>\
                               <div>\
                                  <label htmlFor=\"editingKrUnit\" className=\"block text-neutral-300 text-sm font-semibold mb-1\">Unit:</label>\
                                  <input\
                                      id=\"editingKrUnit\"\
                                      type=\"text\"\
                                      className=\"w-full p-1 rounded-md bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm\"\
                                      value={editingKrUnit}\
                                      onChange={(e) => setEditingKrUnit(e.target.value)}\
                                      placeholder=\"e.g., %\"\
                                      disabled={isUpdatingKr}\
                                      required\
                                  />\
                              </div>\
                          </div>\
                         {/* Note: Status, current_value, linked_task_ids are not editable here */}\
                         <div className=\"mb-4 p-3 bg-neutral-600/50 rounded-md\">\
                             <h4 className=\"text-neutral-300 text-sm font-semibold mb-2\">Current Status & Progress (View Only):</h4>\
                             <p className=\"text-neutral-400 text-xs\">Status: {editingKr.status.toUpperCase()}</p>\
                             <p className=\"text-neutral-400 text-xs\">Current Value: {editingKr.current_value}</p>\
                             {editingKr.linked_task_ids && editingKr.linked_task_ids.length > 0 && (\
                                 <div className=\"mt-2\">\
                                     <h6 className=\"text-neutral-400 font-semibold mb-1\">Linked Tasks:</h6>\
                                     <ul className=\"list-disc list-inside text-neutral-400 text-xs\">\
                                         {editingKr.linked_task_ids.map(taskId => (\
                                             <li key={taskId}>Task ID: {taskId}</li>\
                                         ))}\
                                     </ul>\
                                 </div>\
                             )}\
                         </div>\
\
                         {editKrError && !isUpdatingKr && ( // Show save error only after it finishes\
                             <p className=\"text-red-400 text-sm mt-4\">Error: {editKrError}</p>\
                         )}\
                     </form>\
                     <div className=\"flex gap-4 justify-end mt-4 flex-shrink-0\"> {/* Added flex-shrink-0 */}\
                         <button\
                             type=\"button\"\
                             onClick={handleCancelEditKr}\
                             className=\"px-6 py-2 bg-neutral-600 text-white font-semibold rounded-md hover:bg-neutral-700 transition\"\
                             disabled={isUpdatingKr}\
                         >\
                             Cancel\
                         </button>\
                         <button\
                             type=\"submit\" form=\"edit-kr-form\" // Link button to form by ID\
                             className=\"px-6 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed\"\
                             disabled={isUpdatingKr || !editingKrDescription.trim() || editingKrTargetValue === undefined || editingKrUnit.trim() === ''}\
                         >\
                             {isUpdatingKr ? 'Saving...' : 'Save Changes'}\
                         </button>\
                     </div>\
                 </div>\
             </div>\
        ))}\
        {/* End New */}\
\
      </div>\
    </div>\
  );\n};\n\nexport default Goals;\n```;
