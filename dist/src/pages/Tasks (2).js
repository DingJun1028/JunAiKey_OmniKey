import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
`` `typescript
// src/pages/Tasks.tsx
// Tasks Page
// Displays and manages user's automated tasks.
// --- New: Create a page for the Tasks UI ---
// --- New: Implement fetching and displaying tasks ---
// --- New: Add UI for creating, editing, and deleting tasks ---
// --- New: Implement realtime updates for tasks and task steps ---
// --- New: Add UI for viewing task steps and their status ---
// --- New: Add UI for manually starting, pausing, resuming, and cancelling tasks ---
// --- New: Add UI for linking/unlinking tasks to Key Results ---
// --- Modified: Use ActionEditor for creating task steps ---


import React, { useEffect, useState } from 'react';
import { SelfNavigationEngine } from '../core/self-navigation/SelfNavigationEngine'; // To fetch and manage tasks
import { GoalManagementService } from '../core/goal-management/GoalManagementService'; // To fetch goals/KRs for linking
import { AuthorityForgingEngine } from '../core/authority/AuthorityForgingEngine'; // Use for action recording
import { RuneEngraftingCenter } from '../core/rune-engrafting/SacredRuneEngraver'; // To fetch runes for ActionEditor
import { Task, TaskStep, Goal, KeyResult, Rune, ForgedAbility } from '../interfaces'; // Import types
import { Play, Pause, XCircle, RotateCcw, ChevronDown, ChevronUp, Trash2, Edit, PlusCircle, Save, Loader2, Info, Link as LinkIcon, Unlink, Target, MinusCircle } from 'lucide-react'; // Import icons including Link and Unlink, Loader2, Info, Target, MinusCircle

// --- New: Import ActionEditor component ---
import ActionEditor from '../components/ActionEditor';
// --- End New ---


// Access core modules from the global window object (for MVP simplicity)
// In a real app, use React Context or dependency injection
declare const window: any;
const selfNavigationEngine: SelfNavigationEngine = window.systemContext?.selfNavigationEngine; // The Self-Navigation (自我導航) pillar
const authorityForgingEngine: any = window.systemContext?.authorityForgingEngine; // Use any for action recording (權能鍛造)
const goalManagementService: GoalManagementService = window.systemContext?.goalManagementService; // The Goal Management (目標管理) module
const sacredRuneEngraver: RuneEngraftingCenter = window.systemContext?.sacredRuneEngraver; // The Sacred Rune Engraver (聖符文匠) pillar
const systemContext: any = window.systemContext; // Access the full context for currentUser


const Tasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]); // State to hold tasks
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedTasks, setExpandedTasks] = useState<Record<string, boolean>>({}); // State to track expanded tasks

  // --- State for creating new task ---
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskSteps, setNewTaskSteps] = useState<Omit<TaskStep, 'id' | 'task_id' | 'status' | 'result' | 'error' | 'start_timestamp' | 'end_timestamp'>[]>([]); // Steps for new task
  const [isSavingTask, setIsSavingTask] = useState(false);
  // --- End New ---

  // --- State for editing task ---
  const [editingTask, setEditingTask] = useState<Task | null>(null); // The task being edited
  const [editingTaskDescription, setEditingTaskDescription] = useState('');
  // Note: Editing steps is complex and deferred for MVP. Only description is editable here.
  const [isUpdatingTask, setIsUpdatingTask] = useState(false);
  // --- End New ---

  // --- State for task execution actions ---
  const [isStarting, setIsStarting] = useState<string | null>(null); // Track which task is starting
  const [isPausing, setIsPausing] = useState<string | null>(null); // Track which task is pausing
  const [isResuming, setIsResuming] = useState<string | null>(null); // Track which task is resuming
  const [isCancelling, setIsCancelling] = useState<string | null>(null); // Track which task is cancelling
  const [isDeleting, setIsDeleting] = useState<string | null>(null); // Track which task is being deleted
  // --- End New ---

  // --- New: State for linking tasks to KRs ---
  const [showLinkKrModal, setShowLinkKrModal] = useState<Task | null>(null); // The task being linked
  const [availableGoals, setAvailableGoals] = useState<Goal[]>([]); // Goals for KR selection
  const [selectedKrToLink, setSelectedKrToLink] = useState<string | ''>(''); // Selected KR ID
  const [isLinkingKr, setIsLinkingKr] = useState(false);
  const [linkKrError, setLinkKrError] = useState<string | null>(null);
  // --- End New ---

  // --- New: States for data needed by ActionEditor ---
  const [availableRunes, setAvailableRunes] = useState<Rune[]>([]);
  const [availableAbilities, setAvailableAbilities] = useState<ForgedAbility[]>([]);
  // availableGoals is already fetched for KR linking
  // --- End New ---


  const fetchTasks = async () => {
       const userId = systemContext?.currentUser?.id;
       if (!selfNavigationEngine || !userId) {
            setError("SelfNavigationEngine module not initialized or user not logged in.");
            setLoading(false);
            return;
        }
      setLoading(true);
      setError(null); // Clear main error when fetching
      try {
          // Fetch tasks for the current user from SelfNavigationEngine (Part of 自我導航 / 雙向同步領域)
          const userTasks = await selfNavigationEngine.getTasks(userId); // Pass user ID
          setTasks(userTasks);
      } catch (err: any) {
          console.error('Error fetching tasks:', err);
          setError(`;
Failed;
to;
load;
tasks: $;
{
    err.message;
}
`);
      } finally {
          setLoading(false);
      }
  };

    // --- New: Fetch goals for KR linking ---\
    const fetchGoalsForLinking = async () => {
        const userId = systemContext?.currentUser?.id;
        if (!goalManagementService || !userId) {
            console.warn("GoalManagementService module not initialized or user not logged in. Cannot fetch goals for linking.");
            setAvailableGoals([]);
            return;
        }
        try {
            // Fetch all goals for the user (including KRs)
            const userGoals = await goalManagementService.getGoals(userId);
            setAvailableGoals(userGoals);
        } catch (err: any) {
            console.error('Error fetching goals for linking:', err);
            setAvailableGoals([]);
        }
    };
    // --- End New ---\

    // --- New: Fetch data needed by ActionEditor ---
    const fetchActionEditorData = async () => {
        const userId = systemContext?.currentUser?.id;
        if (!userId || !sacredRuneEngraver || !authorityForgingEngine || !goalManagementService) {
             console.warn("Cannot fetch ActionEditor data: Core modules not initialized or user not logged in.");
             setAvailableRunes([]);
             setAvailableAbilities([]);
             // availableGoals is fetched separately
             return;
        }
        try {
            // Fetch available runes (user's and public)
            const runes = await sacredRuneEngraver.listRunes(undefined, userId);
            setAvailableRunes(runes);

            // Fetch available abilities (user's and public)
            const abilities = await authorityForgingEngine.getAbilities(undefined, userId);
            setAvailableAbilities(abilities);

            // availableGoals is fetched separately by fetchGoalsForLinking

        } catch (err: any) {
            console.error('Error fetching ActionEditor data:', err);
            // Don't set a critical error for the whole page
            // setError(`;
Failed;
to;
load;
data;
for (action; editor; )
    : $;
{
    err.message;
}
`);
            setAvailableRunes([]);
            setAvailableAbilities([]);
        }
    };
    // --- End New ---


  useEffect(() => {
    // Fetch data when the component mounts or when the user changes
    if (systemContext?.currentUser?.id) {
        fetchTasks(); // Fetch all tasks on initial load
        // --- New: Fetch goals for linking on initial load ---
        fetchGoalsForLinking();
        // --- New: Fetch data needed by ActionEditor ---
        fetchActionEditorData();
        // --- End New ---
    }

    // --- New: Subscribe to realtime updates for tasks and task_steps ---
    let unsubscribeTaskInsert: (() => void) | undefined;
    let unsubscribeTaskUpdate: (() => void) | undefined;
    let unsubscribeTaskDelete: (() => void) | undefined;
    let unsubscribeTaskStepInsert: (() => void) | undefined;
    let unsubscribeTaskStepUpdate: (() => void) | undefined;
    let unsubscribeTaskStepDelete: (() => void) | undefined;
    // --- New: Subscribe to task execution status events ---
    let unsubscribeTaskStarted: (() => void) | undefined;
    let unsubscribeTaskCompleted: (() => void) | undefined;
    let unsubscribeTaskFailed: (() => void) | undefined;
    let unsubscribeTaskPaused: (() => void) | undefined;
    let unsubscribeTaskResumed: (() => void) | undefined;
    let unsubscribeTaskCancelled: (() => void) | undefined;
    // --- End New ---


    if (selfNavigationEngine?.context?.eventBus) { // Check if SelfNavigationEngine and its EventBus are available
        const eventBus = selfNavigationEngine.context.eventBus;
        const userId = systemContext?.currentUser?.id;

        // Subscribe to task insert events
        unsubscribeTaskInsert = eventBus.subscribe('task_insert', (payload: Task) => {
            if (payload.user_id === userId) {
                console.log('Tasks page received task_insert event:', payload);
                // Add the new task and keep sorted by creation timestamp (newest first)
                setTasks(prevTasks => [payload, ...prevTasks].sort((a, b) => new Date(b.creation_timestamp).getTime() - new Date(a.creation_timestamp).getTime()));
            }
        });
         // Subscribe to task update events
         unsubscribeTaskUpdate = eventBus.subscribe('task_updated', (payload: Task) => {
             if (payload.user_id === userId) {
                 console.log('Tasks page received task_updated event:', payload);
                 // Update the specific task in the state
                 setTasks(prevTasks => prevTasks.map(task => task.id === payload.id ? payload : task));
             }
         });
          // Subscribe to task delete events
          unsubscribeTaskDelete = eventBus.subscribe('task_delete', (payload: { taskId: string, userId: string }) => {
             if (payload.userId === userId) {
                 console.log('Tasks page received task_delete event:', payload);
                 // Remove the deleted task from the state
                 setTasks(prevTasks => prevTasks.filter(task => task.id !== payload.taskId));
             }
         });

        // Subscribe to task step insert/update/delete events (refetch the task to update steps list)
        unsubscribeTaskStepInsert = eventBus.subscribe('task_step_insert', (payload: TaskStep & { task_id: string, user_id: string }) => { // Payload includes task_id and user_id
             if (payload.user_id === userId) {
                 console.log('Tasks page received task_step_insert event:', payload);
                 fetchTasks(); // Refetch data to update steps list
             }
         });
         unsubscribeTaskStepUpdate = eventBus.subscribe('task_step_update', (payload: TaskStep & { task_id: string, user_id: string }) => { // Payload includes task_id and user_id
             if (payload.user_id === userId) {
                 console.log('Tasks page received task_step_update event:', payload);
                 fetchTasks(); // Refetch data to update step details
             }
         });
          unsubscribeTaskStepDelete = eventBus.subscribe('task_step_delete', (payload: { stepId: string, taskId: string, userId: string }) => { // Payload includes task_id and user_id
             if (payload.userId === userId) {
                 console.log('Tasks page received task_step_delete event:', payload);
                 fetchTasks(); // Refetch data to remove step
             }
         });

        // --- New: Subscribe to task execution status events ---
        // These events are published by SelfNavigationEngine.executeTaskSteps
        // They trigger a refetch of the task data to update the status displayed on the page
        unsubscribeTaskStarted = eventBus.subscribe('task_in-progress', (payload: Task) => {
             if (payload.user_id === userId) {
                 console.log('Tasks page received task_in-progress event:', payload);
                 fetchTasks(); // Refetch to update overall status
             }
         });
         unsubscribeTaskCompleted = eventBus.subscribe('task_completed', (payload: Task) => {
             if (payload.user_id === userId) {
                 console.log('Tasks page received task_completed event:', payload);
                 fetchTasks(); // Refetch to update overall status/timestamps
             }
         });
          unsubscribeTaskFailed = eventBus.subscribe('task_failed', (payload: Task) => {
             if (payload.user_id === userId) {
                 console.log('Tasks page received task_failed event:', payload);
                 fetchTasks(); // Refetch to update overall status/timestamps/error
             }
         });
          unsubscribeTaskPaused = eventBus.subscribe('task_paused', (payload: Task) => {
             if (payload.user_id === userId) {
                 console.log('Tasks page received task_paused event:', payload);
                 fetchTasks(); // Refetch to update overall status
             }
         });
          unsubscribeTaskResumed = eventBus.subscribe('task_resumed', (payload: Task) => {
             if (payload.user_id === userId) {
                 console.log('Tasks page received task_resumed event:', payload);
                 fetchTasks(); // Refetch to update overall status
             }
         });
          unsubscribeTaskCancelled = eventBus.subscribe('task_cancelled', (payload: Task) => {
             if (payload.user_id === userId) {
                 console.log('Tasks page received task_cancelled event:', payload);
                 fetchTasks(); // Refetch to update overall status
             }
         });
        // --- End New ---


    }
    // --- End New ---


    return () => {
        // Unsubscribe on component unmount
        unsubscribeTaskInsert?.();
        unsubscribeTaskUpdate?.();
        unsubscribeTaskDelete?.();
        unsubscribeTaskStepInsert?.();
        unsubscribeTaskStepUpdate?.();
        unsubscribeTaskStepDelete?.();
        // --- New: Unsubscribe from task execution status events ---
        unsubscribeTaskStarted?.();
        unsubscribeTaskCompleted?.();
        unsubscribeTaskFailed?.();
        unsubscribeTaskPaused?.();
        unsubscribeTaskResumed?.();
        unsubscribeTaskCancelled?.();
        // --- End New ---
    };

  }, [systemContext?.currentUser?.id, selfNavigationEngine, goalManagementService, sacredRuneEngraver, authorityForgingEngine]); // Re-run effect when user ID or services change


    const toggleExpandTask = (taskId: string) => {
        setExpandedTasks(prevState => ({
            ...prevState,
            [taskId]: !prevState[taskId]
        }));
    };

    const getTaskStatusColor = (status: Task['status']) => {
        switch (status) {
            case 'completed': return 'text-green-400';
            case 'failed': return 'text-red-400';
            case 'in-progress': return 'text-blue-400';
            case 'paused': return 'text-yellow-400';
            case 'cancelled': return 'text-neutral-400';
            case 'pending': return 'text-neutral-300';
            default: return 'text-neutral-300';
        }
    };

    // --- New: Handle Create Task ---
    const handleCreateTask = async (e: React.FormEvent) => {
        e.preventDefault();
        const userId = systemContext?.currentUser?.id;
        if (!selfNavigationEngine || !userId || !newTaskDescription.trim() || newTaskSteps.length === 0) {
            alert("SelfNavigationEngine module not initialized, user not logged in, or description/steps are empty.");
            return;
        }
        // Basic validation for steps (ensure description and action type are present)
        for (const step of newTaskSteps) {
            if (!step.description.trim() || !step.action?.type) {
                alert('Please fill in description and select an action type for all steps.');
                return;
            }
             // TODO: Add more specific validation for action details based on type
        }

        setIsSavingTask(true);
        setError(null);
        try {
            // Create the task (Part of 自我導航 / 雙向同步領域)
            const taskDetails: Omit<Task, 'id' | 'status' | 'current_step_index' | 'creation_timestamp' | 'start_timestamp' | 'completion_timestamp' | 'key_results'> = {
                description: newTaskDescription.trim(),
                user_id: userId, // Ensure user_id is included
                // status, current_step_index, timestamps are set by the engine/DB
                // key_results are linked via key_results table, not directly in task
                linked_task_ids: [], // Tasks don't link to other tasks directly in this model, but can be linked to KRs
            };

            const createdTask = await selfNavigationEngine.createTask(taskDetails.description, newTaskSteps, userId); // Pass description, steps, userId

            if (createdTask) {
                alert(`;
Task;
"${createdTask.description}\" created successfully!`);;
console.log('Created new task:', createdTask);
// Reset form
setNewTaskDescription('');
setNewTaskSteps([]);
setIsCreatingTask(false); // Hide form
// State update handled by realtime listener
// Simulate recording user action
authorityForgingEngine?.recordAction({
    type: 'web:tasks:create',
    details: { taskId: createdTask.id, description: createdTask.description },
    context: { platform: 'web', page: 'tasks' },
    user_id: userId, // Associate action with user
});
{
    setError('Failed to create task.');
}
try { }
catch (err) {
    console.error('Error creating task:', err);
    setError(`Failed to create task: ${err.message}`);
}
finally {
    setIsSavingTask(false);
}
;
const handleCancelCreate = () => {
    setIsCreatingTask(false);
    setNewTaskDescription('');
    setNewTaskSteps([]);
    setError(null); // Clear error when cancelling
};
const handleAddStepToNewTask = () => {
    const newStep = {
        step_order: newTaskSteps.length, // Assign order based on current number of steps
        description: '',
        action: { type: 'log', details: { message: '' } }, // Default action
    };
    setNewTaskSteps([...newTaskSteps, newStep]);
};
const handleRemoveStepFromNewTask = (index) => {
    const updatedSteps = newTaskSteps.filter((_, i) => i !== index);
    // Re-order steps after removal
    const reorderedSteps = updatedSteps.map((step, i) => ({ ...step, step_order: i }));
    setNewTaskSteps(reorderedSteps);
};
// --- Modified: Handle New Task Step Change using ActionEditor's onChange payload ---
const handleNewTaskStepChange = (index, newAction) => {
    const updatedSteps = [...newTaskSteps];
    // Update the action property of the specific step
    updatedSteps[index].action = newAction;
    // Note: Description is handled by a separate input field above the ActionEditor
    setNewTaskSteps(updatedSteps);
};
// --- End Modified ---
// --- End New ---
// --- New: Handle Edit Task ---
const handleEditTaskClick = (task) => {
    setEditingTask(task);
    setEditingTaskDescription(task.description);
    // Note: Editing steps is complex and deferred for MVP. Only description is editable here.
    setError(null); // Clear previous errors when starting edit
};
const handleUpdateTask = async (e) => {
    e.preventDefault();
    const userId = systemContext?.currentUser?.id;
    if (!selfNavigationEngine || !editingTask || !userId)
        return; // Safety checks
    if (!editingTaskDescription.trim()) {
        alert('Please enter a task description.');
        return;
    }
    setIsUpdatingTask(true);
    setError(null);
    try {
        const updates = {
            description: editingTaskDescription.trim(),
            // Note: Status, current_step_index, timestamps, linked_kr_id are not editable here in MVP
        };
        // Update the task (Part of 自我導航 / 雙向同步領域)
        const updatedTask = await selfNavigationEngine.updateTask(editingTask.id, updates, userId); // Pass taskId, updates, userId
        if (updatedTask) {
            alert(`Task \"${updatedTask.description}\" updated successfully!`);
            console.log('Task updated:', updatedTask);
            setEditingTask(null); // Close edit form
            setEditingTaskDescription('');
            // State update handled by realtime listener
            // Simulate recording user action
            authorityForgingEngine?.recordAction({
                type: 'web:tasks:update',
                details: { taskId: updatedTask.id, description: updatedTask.description },
                context: { platform: 'web', page: 'tasks' },
                user_id: userId, // Associate action with user
            });
        }
    }
    catch (err) {
        console.error('Error updating task:', err);
        setError(`Failed to update task: ${err.message}`);
    }
    finally {
        setIsUpdatingTask(false);
    }
};
const handleCancelEdit = () => {
    setEditingTask(null);
    setEditingTaskDescription('');
    setError(null);
};
// --- End New ---
const handleDeleteTask = async (taskId) => {
    const userId = systemContext?.currentUser?.id;
    if (!selfNavigationEngine || !userId) {
        alert("SelfNavigationEngine module not initialized or user not logged in.");
        return;
    }
    if (!confirm(`Are you sure you want to delete this task? This will also delete all associated steps.`))
        return;
    setIsDeleting(taskId); // Indicate which task is being deleted
    setError(null);
    try {
        // Delete the task (Part of 自我導航 / 雙向同步領域)
        const success = await selfNavigationEngine.deleteTask(taskId, userId); // Pass taskId and userId
        if (success) {
            console.log('Task deleted:', taskId);
            // State update handled by realtime listener
            alert('Task deleted successfully!');
            // Simulate recording user action
            authorityForgingEngine?.recordAction({
                type: 'web:tasks:delete',
                details: { taskId },
                context: { platform: 'web', page: 'tasks' },
                user_id: userId, // Associate action with user
            });
        }
    }
    catch (err) {
        console.error('Error deleting task:', err);
        setError(`Failed to delete task: ${err.message}`);
        alert(`Failed to delete task: ${err.message}`);
    }
    finally {
        setIsDeleting(null); // Reset deleting state
    }
};
// --- New: Handle Task Execution Actions ---
const handleStartTask = async (taskId) => {
    const userId = systemContext?.currentUser?.id;
    if (!selfNavigationEngine || !userId) {
        alert("SelfNavigationEngine module not initialized or user not logged in.");
        return;
    }
    console.log(`Attempting to start task: ${taskId}`);
    // Simulate recording user action
    authorityForgingEngine?.recordAction({
        type: 'web:tasks:start',
        details: { taskId },
        context: { platform: 'web', page: 'tasks' },
        user_id: userId, // Associate action with user
    });
    setIsStarting(taskId); // Indicate which task is starting
    setError(null); // Clear previous errors
    try {
        // Call the SelfNavigationEngine method to start the task
        await selfNavigationEngine.startTask(taskId, userId); // Pass taskId, userId
        // Status update handled by event listener
    }
    catch (err) {
        console.error('Error starting task:', err);
        setError(`Failed to start task: ${err.message}`);
    }
    finally {
        setIsStarting(null); // State updated by event listener, but reset local flag
    }
};
const handlePauseTask = async (taskId) => {
    const userId = systemContext?.currentUser?.id;
    if (!selfNavigationEngine || !userId) {
        alert("SelfNavigationEngine module not initialized or user not logged in.");
        return;
    }
    console.log(`Attempting to pause task: ${taskId}`);
    // Simulate recording user action
    authorityForgingEngine?.recordAction({
        type: 'web:tasks:pause',
        details: { taskId },
        context: { platform: 'web', page: 'tasks' },
        user_id: userId, // Associate action with user
    });
    setIsPausing(taskId); // Indicate which task is pausing
    setError(null); // Clear previous errors
    try {
        // Call the SelfNavigationEngine method to pause the task
        await selfNavigationEngine.pauseTask(taskId, userId); // Pass taskId, userId
        // Status update handled by event listener
    }
    catch (err) {
        console.error('Error pausing task:', err);
        setError(`Failed to pause task: ${err.message}`);
    }
    finally {
        setIsPausing(null); // State updated by event listener, but reset local flag
    }
};
const handleResumeTask = async (taskId) => {
    const userId = systemContext?.currentUser?.id;
    if (!selfNavigationEngine || !userId) {
        alert("SelfNavigationEngine module not initialized or user not logged in.");
        return;
    }
    console.log(`Attempting to resume task: ${taskId}`);
    // Simulate recording user action
    authorityForgingEngine?.recordAction({
        type: 'web:tasks:resume',
        details: { taskId },
        context: { platform: 'web', page: 'tasks' },
        user_id: userId, // Associate action with user
    });
    setIsResuming(taskId); // Indicate which task is resuming
    setError(null); // Clear previous errors
    try {
        // Call the SelfNavigationEngine method to resume the task
        await selfNavigationEngine.resumeTask(taskId, userId); // Pass taskId, userId
        // Status update handled by event listener
    }
    catch (err) {
        console.error('Error resuming task:', err);
        setError(`Failed to resume task: ${err.message}`);
    }
    finally {
        setIsResuming(null); // State updated by event listener, but reset local flag
    }
};
const handleCancelTask = async (taskId) => {
    const userId = systemContext?.currentUser?.id;
    if (!selfNavigationEngine || !userId) {
        alert("SelfNavigationEngine module not initialized or user not logged in.");
        return;
    }
    if (!confirm(`Are you sure you want to cancel this task?`))
        return;
    console.log(`Attempting to cancel task: ${taskId}`);
    // Simulate recording user action
    authorityForgingEngine?.recordAction({
        type: 'web:tasks:cancel',
        details: { taskId },
        context: { platform: 'web', page: 'tasks' },
        user_id: userId, // Associate action with user
    });
    setIsCancelling(taskId); // Indicate which task is cancelling
    setError(null); // Clear previous errors
    try {
        // Call the SelfNavigationEngine method to cancel the task
        await selfNavigationEngine.cancelTask(taskId, userId); // Pass taskId, userId
        // Status update handled by event listener
    }
    catch (err) {
        console.error('Error cancelling task:', err);
        setError(`Failed to cancel task: ${err.message}`);
    }
    finally {
        setIsCancelling(null); // State updated by event listener, but reset local flag
    }
};
// --- End New ---
// --- New: Handle Link Task to KR ---
const handleOpenLinkKrModal = (task) => {
    setShowLinkKrModal(task);
    setSelectedKrToLink(''); // Clear previous selection
    // Available goals are fetched on page load
    setLinkKrError(null); // Clear previous errors
};
const handleCloseLinkKrModal = () => {
    setShowLinkKrModal(null);
    setSelectedKrToLink('');
    setLinkKrError(null);
};
const handleLinkTaskToKr = async () => {
    const userId = systemContext?.currentUser?.id;
    if (!selfNavigationEngine || !userId || !showLinkKrModal || !selectedKrToLink) {
        alert("SelfNavigationEngine module not initialized, user not logged in, or task/KR not selected.");
        return;
    }
    setIsLinkingKr(true);
    setLinkKrError(null);
    try {
        // Call the SelfNavigationEngine method to link the task to the KR
        const updatedKr = await selfNavigationEngine.linkTaskToKeyResult(showLinkKrModal.id, selectedKrToLink, userId); // Pass taskId, krId, userId
        if (updatedKr) {
            alert(`Task \"${showLinkKrModal.description}\" linked to Key Result \"${updatedKr.description}\" successfully!`);
            console.log('Task linked to KR:', showLinkKrModal.id, '->', updatedKr.id);
            handleCloseLinkKrModal(); // Close modal
            // State update handled by realtime listener (KR update event)
            // Simulate recording user action
            authorityForgingEngine?.recordAction({
                type: 'web:tasks:link_to_kr',
                details: { taskId: showLinkKrModal.id, krId: updatedKr.id },
                context: { platform: 'web', page: 'tasks' },
                user_id: userId, // Associate action with user
            });
        }
        else {
            setLinkKrError('Failed to link task to Key Result.');
        }
    }
    catch (err) {
        console.error('Error linking task to KR:', err);
        setLinkKrError(`Failed to link task: ${err.message}`);
    }
    finally {
        setIsLinkingKr(false);
    }
};
const handleUnlinkTaskFromKr = async (task) => {
    const userId = systemContext?.currentUser?.id;
    if (!selfNavigationEngine || !userId || !task.linked_kr_id) {
        alert("SelfNavigationEngine module not initialized, user not logged in, or task is not linked to a KR.");
        return;
    }
    if (!confirm(`Are you sure you want to unlink this task from its Key Result?`))
        return;
    setIsLinkingKr(true); // Reuse state for simplicity
    setError(null); // Clear main error
    try {
        // Call the SelfNavigationEngine method to unlink the task from the KR
        const updatedKr = await selfNavigationEngine.unlinkTaskFromKeyResult(task.id, task.linked_kr_id, userId); // Pass taskId, krId, userId
        if (updatedKr) {
            alert(`Task \"${task.description}\" unlinked from Key Result successfully!`);
            console.log('Task unlinked from KR:', task.id, '->', updatedKr.id);
            // State update handled by realtime listener (KR update event)
            // Simulate recording user action
            authorityForgingEngine?.recordAction({
                type: 'web:tasks:unlink_from_kr',
                details: { taskId: task.id, krId: updatedKr.id },
                context: { platform: 'web', page: 'tasks' },
                user_id: userId, // Associate action with user
            });
        }
    }
    catch (err) {
        console.error('Error unlinking task from KR:', err);
        setError(`Failed to unlink task: ${err.message}`);
        alert(`Failed to unlink task: ${err.message}`);
    }
    finally {
        setIsLinkingKr(false);
    }
};
// --- End New ---
// Ensure user is logged in before rendering content
if (!systemContext?.currentUser) {
    // This case should ideally be handled by ProtectedRoute, but as a fallback:
    return (_jsx("div", { className: "container mx-auto p-4 flex justify-center", children: _jsx("div", { className: "bg-neutral-800/50 p-8 rounded-lg shadow-xl w-full max-w-md text-center text-neutral-300", children: _jsx("p", { children: "Please log in to view your tasks." }) }) }));
}
return (_jsxs("div", { className: "container mx-auto p-4", children: [_jsxs("div", { className: "bg-neutral-800/50 p-6 rounded-lg shadow-xl", children: [_jsx("h2", { className: "text-3xl font-bold text-blue-400 mb-6", children: "Task Management (\u81EA\u6211\u5C0E\u822A)" }), _jsx("p", { className: "text-neutral-300 mb-8", children: "Manage your automated tasks and track their execution progress." }), !isCreatingTask && !editingTask && ( // Only show create button if not creating or editing
                _jsxs("div", { className: "mb-8 p-4 bg-neutral-700/50 rounded-lg", children: [_jsx("h3", { className: "text-xl font-semibold text-blue-300 mb-3", children: "Create New Task" }), _jsxs("button", { className: "px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition disabled:opacity-50", onClick: () => { setIsCreatingTask(true); setError(null); }, disabled: isSavingTask || isUpdatingTask || isStarting !== null || isPausing !== null || isResuming !== null || isCancelling !== null || isDeleting !== null, children: [_jsx(PlusCircle, { size: 20, className: "inline-block mr-2" }), " Create Task"] })] })), isCreatingTask && !editingTask && ( // Show create form if creating and not editing
                _jsxs("div", { className: "mb-8 p-4 bg-neutral-700/50 rounded-lg", children: [_jsx("h3", { className: "text-xl font-semibold text-blue-300 mb-3", children: "New Task" }), _jsxs("form", { onSubmit: handleCreateTask, children: [_jsxs("div", { className: "mb-4", children: [_jsx("label", { htmlFor: "newTaskDescription", className: "block text-neutral-300 text-sm font-semibold mb-2", children: "Description:" }), _jsx("input", { id: "newTaskDescription", type: "text", className: "w-full p-2 rounded-md bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500", value: newTaskDescription, onChange: (e) => setNewTaskDescription(e.target.value), placeholder: "Enter task description (e.g., Sync GitHub Repo)", disabled: isSavingTask, required: true })] }), _jsxs("div", { className: "mb-4 p-3 bg-neutral-600/50 rounded-md", children: [_jsx("h4", { className: "text-neutral-300 text-sm font-semibold mb-2", children: "Steps:" }), _jsx("ul", { className: "space-y-3", children: newTaskSteps.map((step, index) => (_jsxs("li", { className: "p-3 bg-neutral-700/50 rounded-md border-l-2 border-blue-600", children: [_jsxs("div", { className: "flex justify-between items-center mb-2", children: [_jsxs("span", { className: "text-sm font-medium text-neutral-300", children: ["Step ", index + 1] }), _jsx("button", { type: "button", onClick: () => handleRemoveStepFromNewTask(index), className: "text-red-400 hover:text-red-600 transition disabled:opacity-50", disabled: isSavingTask, children: _jsx(MinusCircle, { size: 18 }) })] }), _jsxs("div", { className: "mb-2", children: [_jsx("label", { htmlFor: `new-step-desc-${index}`, className: "block text-neutral-400 text-xs font-semibold mb-1", children: "Description:" }), _jsx("input", { id: `new-step-desc-${index}`, type: "text", className: "w-full p-1 rounded-md bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm", value: step.description, onChange: (e) => {
                                                                    const updatedSteps = [...newTaskSteps];
                                                                    updatedSteps[index].description = e.target.value;
                                                                    setNewTaskSteps(updatedSteps);
                                                                }, placeholder: "e.g., Pull latest changes", disabled: isSavingTask, required: true })] }), _jsxs("div", { className: "mb-2", children: [_jsx("h5", { className: "block text-neutral-400 text-xs font-semibold mb-1", children: "Action:" }), _jsx(ActionEditor, { action: step.action, onChange: (newAction) => handleNewTaskStepChange(index, newAction), disabled: isSavingTask, availableRunes: availableRunes, availableAbilities: availableAbilities, availableGoals: availableGoals })] })] }, index))) }), _jsxs("button", { type: "button", onClick: handleAddStepToNewTask, className: "mt-4 px-4 py-2 text-sm bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition disabled:opacity-50", disabled: isSavingTask, children: [_jsx(PlusCircle, { size: 16, className: "inline-block mr-1" }), " Add Step"] })] }), _jsx("button", { type: "submit", className: "px-6 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed", disabled: isSavingTask || !newTaskDescription.trim() || newTaskSteps.length === 0, children: isSavingTask ? 'Creating...' : 'Save Task' }), _jsx("button", { type: "button", onClick: handleCancelCreate, className: "px-6 py-2 bg-neutral-600 text-white font-semibold rounded-md hover:bg-neutral-700 transition", disabled: isSavingTask, children: "Cancel" })] }), error && isSavingTask === false && ( // Show create error only after it finishes
                        _jsxs("p", { className: "text-red-400 text-sm mt-4", children: ["Error: ", error] }))] })), editingTask && ( // Show edit form if editing
                _jsxs("div", { className: "mb-8 p-4 bg-neutral-700/50 rounded-lg", children: [_jsxs("h3", { className: "text-xl font-semibold text-blue-300 mb-3", children: ["Edit Task: ", editingTask.description] }), _jsxs("form", { onSubmit: handleUpdateTask, children: [_jsxs("div", { className: "mb-4", children: [_jsx("label", { htmlFor: "editingTaskDescription", className: "block text-neutral-300 text-sm font-semibold mb-2", children: "Description:" }), _jsx("input", { id: "editingTaskDescription", type: "text", className: "w-full p-2 rounded-md bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500", value: editingTaskDescription, onChange: (e) => setEditingTaskDescription(e.target.value), placeholder: "Edit task description", disabled: isUpdatingTask, required: true })] }), editingTask.steps && editingTask.steps.length > 0 && ((_jsxs("div", { className: "mb-4 p-3 bg-neutral-600/50 rounded-md", children: [_jsx("h4", { className: "text-neutral-300 text-sm font-semibold mb-2", children: "Steps (View Only in MVP Edit):" }), _jsxs("ul", { className: "space-y-2", children: [editingTask.steps.map((step, index) => (_jsxs("li", { className: `p-3 rounded-md border-l-2 ${step.status === 'completed' ? 'border-green-600' : step.status === 'failed' ? 'border-red-600' : step.status === 'in-progress' ? 'border-blue-600' : 'border-neutral-600'} bg-neutral-700/50`, children: [_jsxs("p", { className: "text-sm font-medium text-neutral-300", children: ["Step ", index + 1, ": ", step.description] }), _jsxs("p", { className: "text-neutral-400 text-xs", children: ["Status: ", step.status, " | Action: ", step.action.type] })] }, step.id))), "\\"] })] }))), "\\", editingTask.steps && editingTask.steps.length === 0 && ((_jsx("div", { className: "mb-4 p-3 bg-neutral-600/50 rounded-md", children: _jsx("p", { className: "text-neutral-400 text-sm", children: "No steps defined for this task yet." }) }))), "\\", _jsxs("div", { className: "flex gap-4", children: [_jsx("button", { type: "submit", className: "px-6 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed", disabled: isUpdatingTask || !editingTaskDescription.trim(), children: isUpdatingTask ? 'Saving...' : 'Save Changes' }), _jsx("button", { type: "button", onClick: handleCancelEdit, className: "px-6 py-2 bg-neutral-600 text-white font-semibold rounded-md hover:bg-neutral-700 transition", disabled: isUpdatingTask, children: "Cancel" })] }), error && isUpdatingTask === false && ( // Show save error only after it finishes
                                _jsxs("p", { className: "text-red-400 text-sm mt-4", children: ["Error: ", error] })), "\\"] })] })), "\\", _jsxs("div", { className: "p-4 bg-neutral-700/50 rounded-lg", children: [_jsxs("h3", { className: "text-xl font-semibold text-blue-300 mb-3", children: ["Your Tasks (", tasks.length, ")"] }), loading && !isSavingTask && !isUpdatingTask ? ( // Show loading only if not currently saving/updating
                        _jsx("p", { className: "text-neutral-400", children: "Loading tasks..." })) : error && !isCreatingTask && !editingTask ? ( // Show main error if not in create/edit mode
                        _jsxs("p", { className: "text-red-400", children: ["Error: ", error] })) : tasks.length === 0 ? (_jsx("p", { className: "text-neutral-400", children: "No tasks found yet. Create one using the form above." })) : (_jsxs("ul", { className: "space-y-4", children: [tasks.map((task) => (_jsxs("li", { className: `bg-neutral-600/50 p-4 rounded-md border-l-4 ${getTaskStatusColor(task.status).replace('text-', 'border-')}`, children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx(Target, { size: 20, className: "text-blue-400" }), _jsx("h4", { className: `font-semibold mb-1 ${getTaskStatusColor(task.status)}`, children: task.description })] }), _jsxs("button", { onClick: () => toggleExpandTask(task.id), className: "text-neutral-400 hover:text-white transition", children: [expandedTasks[task.id] ? _jsx(ChevronUp, { size: 20 }) : _jsx(ChevronDown, { size: 20 }), "\\"] })] }), _jsxs("p", { className: "text-neutral-300 text-sm", children: ["Status: ", _jsx("span", { className: getTaskStatusColor(task.status), children: task.status })] }), task.linked_kr_id && (_jsxs("p", { className: "text-neutral-300 text-sm flex items-center gap-1", children: [_jsx(Target, { size: 14 }), " Linked to KR: ", task.linked_kr_id] })), task.error && task.status === 'failed' && (_jsxs("p", { className: "text-red-400 text-sm mt-1", children: ["Error: ", task.error] })), _jsxs("small", { className: "text-neutral-400 text-xs block mt-1", children: ["ID: ", task.id, " | Created: ", new Date(task.creation_timestamp).toLocaleString(), task.start_timestamp && ` | Started: ${new Date(task.start_timestamp).toLocaleString()}`, "\\", task.completion_timestamp && ` | Finished: ${new Date(task.completion_timestamp).toLocaleString()}`, "\\", task.status === 'in-progress' && ` | Current Step: ${task.current_step_index + 1}/${task.steps.length}`, "\\"] }), "\\", expandedTasks[task.id] && task.steps && task.steps.length > 0 && (()), "\\", _jsxs("div", { className: "mt-4 border-t border-neutral-600 pt-4", children: [_jsx("h5", { className: "text-neutral-300 text-sm font-semibold mb-2", children: "Steps:" }), _jsxs("ul", { className: "space-y-2", children: [task.steps.map((step, index) => (_jsxs("li", { className: `p-3 rounded-md border-l-2 ${step.status === 'completed' ? 'border-green-600' : step.status === 'failed' ? 'border-red-600' : step.status === 'in-progress' ? 'border-blue-600' : 'border-neutral-600'} bg-neutral-700/50`, children: [_jsxs("p", { className: "text-sm font-medium text-neutral-300", children: ["Step ", index + 1, ": ", step.description] }), _jsxs("p", { className: "text-neutral-400 text-xs", children: ["Status: ", step.status, " | Action: ", step.action.type] }), step.error && step.status === 'failed' && (_jsxs("p", { className: "text-red-400 text-xs mt-1", children: ["Error: ", step.error] })), "\\", "\\"] }, step.id))), "\\"] })] }), "))}\\", expandedTasks[task.id] && (!task.steps || task.steps.length === 0) && (()), "\\", _jsx("div", { className: "mt-4 border-t border-neutral-600 pt-4", children: _jsx("p", { className: "text-neutral-400 text-sm", children: "No steps defined for this task yet." }) }), "))}\\", "\\", _jsxs("div", { className: "mt-4 flex flex-wrap gap-2", children: [" ", "\\", "\\", (task.status === 'idle' || task.status === 'completed' || task.status === 'failed' || task.status === 'cancelled') && (()), "\\", _jsx("button", { className: "px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed", onClick: () => handleStartTask(task.id), disabled: isStarting !== null || isPausing !== null || isResuming !== null || isCancelling !== null || isDeleting !== null }), "\\ >", isStarting === task.id ? _jsx(Loader2, { size: 16, className: "inline-block mr-1 animate-spin" }) : _jsx(Play, { size: 16, className: "inline-block mr-1" }), ")}\\", isStarting === task.id ? 'Starting...' : 'Start', "\\"] }), "))}\\", "\\", task.status === 'in-progress' && (()), "\\", _jsx("button", { className: "px-3 py-1 text-sm bg-yellow-600 text-white rounded hover:bg-yellow-700 transition disabled:opacity-50 disabled:cursor-not-allowed", onClick: () => handlePauseTask(task.id), disabled: isStarting !== null || isPausing !== null || isResuming !== null || isCancelling !== null || isDeleting !== null }), "\\ >", isPausing === task.id ? _jsx(Loader2, { size: 16, className: "inline-block mr-1 animate-spin" }) : _jsx(Pause, { size: 16, className: "inline-block mr-1" }), ")}\\", isPausing === task.id ? 'Pausing...' : 'Pause', "\\"] }, task.id))), "\\", "\\", task.status === 'paused' && (()), "\\", _jsx("button", { className: "px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed", onClick: () => handleResumeTask(task.id), disabled: isStarting !== null || isPausing !== null || isResuming !== null || isCancelling !== null || isDeleting !== null }), "\\ >", isResuming === task.id ? _jsx(Loader2, { size: 16, className: "inline-block mr-1 animate-spin" }) : _jsx(Play, { size: 16, className: "inline-block mr-1" }), ")}\\", isResuming === task.id ? 'Resuming...' : 'Resume', "\\"] })), ")}\\", "\\", (task.status === 'pending' || task.status === 'in-progress' || task.status === 'paused') && (()), "\\", _jsx("button", { className: "px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed", onClick: () => handleCancelTask(task.id), disabled: isStarting !== null || isPausing !== null || isResuming !== null || isCancelling !== null || isDeleting !== null }), "\\ >", isCancelling === task.id ? _jsx(Loader2, { size: 16, className: "inline-block mr-1 animate-spin" }) : _jsx(XCircle, { size: 16, className: "inline-block mr-1" }), ")}\\", isCancelling === task.id ? 'Cancelling...' : 'Cancel', "\\"] }), "))}\\", "\\", _jsx("button", { className: "px-3 py-1 text-sm bg-yellow-600 text-white rounded hover:bg-yellow-700 transition disabled:opacity-50 disabled:cursor-not-allowed", onClick: () => handleEditTaskClick(task), disabled: isStarting !== null || isPausing !== null || isResuming !== null || isCancelling !== null || isDeleting !== null || !!editingTask }), "\\ >", _jsx(Edit, { size: 16, className: "inline-block mr-1" }), " Edit"] }), "\\", _jsx("button", { className: "px-3 py-1 text-sm bg-red-800 text-white rounded hover:bg-red-900 transition disabled:opacity-50 disabled:cursor-not-allowed", onClick: () => handleDeleteTask(task.id), disabled: isStarting !== null || isPausing !== null || isResuming !== null || isCancelling !== null || isDeleting !== null || task.status === 'in-progress' }), "\\ >", isDeleting === task.id ? _jsx(Loader2, { size: 16, className: "inline-block mr-1 animate-spin" }) : _jsx(Trash2, { size: 16, className: "inline-block mr-1" }), ")}\\", isDeleting === task.id ? 'Deleting...' : 'Delete'] })) /* New: Link/Unlink to KR Button */;
{ /* New: Link/Unlink to KR Button */ }
{
    task.linked_kr_id ? (()) : ;
    _jsxs("button", { className: "px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed", onClick: () => handleUnlinkTaskFromKr(task), disabled: isStarting !== null || isPausing !== null || isResuming !== null || isCancelling !== null || isDeleting !== null || isLinkingKr, children: [isLinkingKr ? _jsx(Loader2, { size: 16, className: "inline-block mr-1 animate-spin" }) : _jsx(Unlink, { size: 16, className: "inline-block mr-1" }), ")}\\", isLinkingKr ? 'Unlinking...' : 'Unlink KR', "\\"] });
    (());
    _jsxs("button", { className: "px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed", onClick: () => handleOpenLinkKrModal(task), disabled: isStarting !== null || isPausing !== null || isResuming !== null || isCancelling !== null || isDeleting !== null || isLinkingKr || availableGoals.length === 0, children: [isLinkingKr ? _jsx(Loader2, { size: 16, className: "inline-block mr-1 animate-spin" }) : _jsx(LinkIcon, { size: 16, className: "inline-block mr-1" }), ")}\\", isLinkingKr ? 'Linking...' : 'Link to KR', "\\"] });
}
{ /* End New */ }
div >
;
li >
;
ul >
;
div >
    { /* New: Link KR Modal */};
{
    showLinkKrModal && (());
    _jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50", children: _jsxs("div", { className: "bg-neutral-800 p-8 rounded-lg shadow-xl w-full max-w-md max-h-[90%] flex flex-col", children: [" ", "\\", _jsxs("div", { className: "flex justify-between items-center mb-4", children: [_jsx("h3", { className: "text-xl font-semibold text-blue-300", children: "Link Task to Key Result" }), _jsx("button", { type: "button", onClick: handleCloseLinkKrModal, className: "text-neutral-400 hover:text-white transition", disabled: isLinkingKr, children: _jsx(XCircle, { size: 24 }) })] }), _jsxs("p", { className: "text-neutral-300 text-sm mb-4", children: ["Select a Key Result to link Task \\\"", showLinkKrModal.description, "\\\" to."] }), availableGoals.length === 0 ? (_jsx("div", { className: "flex-grow text-neutral-400 overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-700 pr-2", children: _jsx("p", { children: "No goals with Key Results found. Create goals on the Goals page first." }) })) : (_jsxs("div", { className: "flex-grow overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-700 space-y-3 pr-2", children: [" ", "\\", availableGoals.map(goal => (goal.key_results && goal.key_results.length > 0 && (()))), "\\", _jsxs("div", { className: "p-3 bg-neutral-700/50 rounded-md border-l-2 border-blue-600 space-y-2", children: [_jsxs("h4", { className: "text-neutral-300 text-sm font-semibold", children: ["Goal: ", goal.description] }), _jsxs("ul", { className: "space-y-2", children: [goal.key_results.map(kr => (_jsxs("li", { className: "flex items-start gap-3 bg-neutral-800 p-2 rounded-md", children: [_jsx("input", { type: "radio", id: `kr-${kr.id}`, name: "selectKrToLink", className: "form-radio h-4 w-4 text-blue-600 rounded border-neutral-600 bg-neutral-800 focus:ring-blue-500 mt-1", value: kr.id, checked: selectedKrToLink === kr.id, onChange: (e) => setSelectedKrToLink(e.target.value), disabled: isLinkingKr }), _jsxs("label", { htmlFor: `kr-${kr.id}`, className: "flex-grow text-neutral-300 text-sm cursor-pointer", children: [_jsx("span", { className: "font-semibold", children: "KR:" }), " ", kr.description, _jsxs("span", { className: "block text-neutral-400 text-xs mt-1", children: ["Progress: ", kr.current_value, " / ", kr.target_value, " ", kr.unit] })] })] }, kr.id))), "\\"] })] }, goal.id), "))\\ ))}\\"] })), "\\", linkKrError && !isLinkingKr && ( // Show error only after linking finishes
                _jsxs("p", { className: "text-red-400 text-sm mt-4", children: ["Error: ", linkKrError] })), "\\", _jsxs("div", { className: "flex gap-4 justify-end mt-4 flex-shrink-0", children: [" ", "\\", _jsx("button", { type: "button", onClick: handleCloseLinkKrModal, className: "px-6 py-2 bg-neutral-600 text-white font-semibold rounded-md hover:bg-neutral-700 transition", disabled: isLinkingKr, children: "Cancel" }), _jsx("button", { type: "button", onClick: handleLinkTaskToKr, className: "px-6 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed", disabled: isLinkingKr || !selectedKrToLink, children: isLinkingKr ? 'Linking...' : 'Link Task' })] })] }) });
}
{ /* End New */ }
div >
;
div >
;
;
;
export default Tasks;
`` `;
