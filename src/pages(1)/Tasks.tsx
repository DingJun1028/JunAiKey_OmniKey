```typescript
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
          setError(`Failed to load tasks: ${err.message}`);
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
            // setError(`Failed to load data for action editor: ${err.message}`);
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
                alert(`Task \"${createdTask.description}\" created successfully!`);
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
            } else {
                setError('Failed to create task.');
            }
        } catch (err: any) {
            console.error('Error creating task:', err);
            setError(`Failed to create task: ${err.message}`);
        } finally {
            setIsSavingTask(false);
        }
    };

    const handleCancelCreate = () => {
        setIsCreatingTask(false);
        setNewTaskDescription('');
        setNewTaskSteps([]);
        setError(null); // Clear error when cancelling
    };

    const handleAddStepToNewTask = () => {
        const newStep: Omit<TaskStep, 'id' | 'task_id' | 'status' | 'result' | 'error' | 'start_timestamp' | 'end_timestamp'> = {
            step_order: newTaskSteps.length, // Assign order based on current number of steps
            description: '',
            action: { type: 'log', details: { message: '' } }, // Default action
        };
        setNewTaskSteps([...newTaskSteps, newStep]);
    };

    const handleRemoveStepFromNewTask = (index: number) => {
        const updatedSteps = newTaskSteps.filter((_, i) => i !== index);
        // Re-order steps after removal
        const reorderedSteps = updatedSteps.map((step, i) => ({ ...step, step_order: i }));
        setNewTaskSteps(reorderedSteps);
    };

    // --- Modified: Handle New Task Step Change using ActionEditor's onChange payload ---
    const handleNewTaskStepChange = (index: number, newAction: TaskStep['action']) => {
        const updatedSteps = [...newTaskSteps];
        // Update the action property of the specific step
        updatedSteps[index].action = newAction;
        // Note: Description is handled by a separate input field above the ActionEditor
        setNewTaskSteps(updatedSteps);
    };
    // --- End Modified ---
    // --- End New ---

    // --- New: Handle Edit Task ---
    const handleEditTaskClick = (task: Task) => {
        setEditingTask(task);
        setEditingTaskDescription(task.description);
        // Note: Editing steps is complex and deferred for MVP. Only description is editable here.
        setError(null); // Clear previous errors when starting edit
    };

    const handleUpdateTask = async (e: React.FormEvent) => {
        e.preventDefault();
        const userId = systemContext?.currentUser?.id;
        if (!selfNavigationEngine || !editingTask || !userId) return; // Safety checks

        if (!editingTaskDescription.trim()) {
            alert('Please enter a task description.');
            return;
        }

        setIsUpdatingTask(true);
        setError(null);
        try {
            const updates: Partial<Omit<Task, 'id' | 'user_id' | 'steps' | 'creation_timestamp'>> = {
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
        } catch (err: any) {
            console.error('Error updating task:', err);
            setError(`Failed to update task: ${err.message}`);
        } finally {
            setIsUpdatingTask(false);
        }
    };

    const handleCancelEdit = () => {
        setEditingTask(null);
        setEditingTaskDescription('');
        setError(null);
    };
    // --- End New ---


   const handleDeleteTask = async (taskId: string) => {
       const userId = systemContext?.currentUser?.id;
       if (!selfNavigationEngine || !userId) {
           alert("SelfNavigationEngine module not initialized or user not logged in.");
           return;
       }
       if (!confirm(`Are you sure you want to delete this task? This will also delete all associated steps.`)) return;

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
       } catch (err: any) {
           console.error('Error deleting task:', err);
           setError(`Failed to delete task: ${err.message}`);
           alert(`Failed to delete task: ${err.message}`);
       } finally {
           setIsDeleting(null); // Reset deleting state
       }
   };

    // --- New: Handle Task Execution Actions ---
    const handleStartTask = async (taskId: string) => {
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
        } catch (err: any) {
            console.error('Error starting task:', err);
            setError(`Failed to start task: ${err.message}`);
        } finally {
            setIsStarting(null); // State updated by event listener, but reset local flag
        }
    };

    const handlePauseTask = async (taskId: string) => {
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
        } catch (err: any) {
            console.error('Error pausing task:', err);
            setError(`Failed to pause task: ${err.message}`);
        } finally {
            setIsPausing(null); // State updated by event listener, but reset local flag
        }
    };

    const handleResumeTask = async (taskId: string) => {
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
        } catch (err: any) {
            console.error('Error resuming task:', err);
            setError(`Failed to resume task: ${err.message}`);
        } finally {
            setIsResuming(null); // State updated by event listener, but reset local flag
        }
    };

    const handleCancelTask = async (taskId: string) => {
        const userId = systemContext?.currentUser?.id;
        if (!selfNavigationEngine || !userId) {
            alert("SelfNavigationEngine module not initialized or user not logged in.");
            return;
        }
        if (!confirm(`Are you sure you want to cancel this task?`)) return;

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
        } catch (err: any) {
            console.error('Error cancelling task:', err);
            setError(`Failed to cancel task: ${err.message}`);
        } finally {
            setIsCancelling(null); // State updated by event listener, but reset local flag
        }
    };
    // --- End New ---

    // --- New: Handle Link Task to KR ---
    const handleOpenLinkKrModal = (task: Task) => {
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
            } else {
                setLinkKrError('Failed to link task to Key Result.');
            }
        } catch (err: any) {
            console.error('Error linking task to KR:', err);
            setLinkKrError(`Failed to link task: ${err.message}`);
        } finally {
            setIsLinkingKr(false);
        }
    };

    const handleUnlinkTaskFromKr = async (task: Task) => {
         const userId = systemContext?.currentUser?.id;
         if (!selfNavigationEngine || !userId || !task.linked_kr_id) {
             alert("SelfNavigationEngine module not initialized, user not logged in, or task is not linked to a KR.");
             return;
         }
         if (!confirm(`Are you sure you want to unlink this task from its Key Result?`)) return;

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
         } catch (err: any) {
             console.error('Error unlinking task from KR:', err);
             setError(`Failed to unlink task: ${err.message}`);
             alert(`Failed to unlink task: ${err.message}`);
         } finally {
             setIsLinkingKr(false);
         }
    };
    // --- End New ---


   // Ensure user is logged in before rendering content
  if (!systemContext?.currentUser) {
       // This case should ideally be handled by ProtectedRoute, but as a fallback:
       return (
            <div className="container mx-auto p-4 flex justify-center">
               <div className="bg-neutral-800/50 p-8 rounded-lg shadow-xl w-full max-w-md text-center text-neutral-300">
                   <p>Please log in to view your tasks.</p>
               </div>
            </div>
       );
  }


  return (
    <div className="container mx-auto p-4">
      <div className="bg-neutral-800/50 p-6 rounded-lg shadow-xl">
        <h2 className="text-3xl font-bold text-blue-400 mb-6">Task Management (自我導航)</h2>
        <p className="text-neutral-300 mb-8">Manage your automated tasks and track their execution progress.</p>

        {/* Form for creating new tasks */}
        {!isCreatingTask && !editingTask && ( // Only show create button if not creating or editing
            <div className="mb-8 p-4 bg-neutral-700/50 rounded-lg">
                 <h3 className="text-xl font-semibold text-blue-300 mb-3">Create New Task</h3>
                 <button
                     className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition disabled:opacity-50"
                     onClick={() => { setIsCreatingTask(true); setError(null); }}
                     disabled={isSavingTask || isUpdatingTask || isStarting !== null || isPausing !== null || isResuming !== null || isCancelling !== null || isDeleting !== null}
                 >
                     <PlusCircle size={20} className="inline-block mr-2"/> Create Task
                 </button>
            </div>
        )}

        {isCreatingTask && !editingTask && ( // Show create form if creating and not editing
             <div className="mb-8 p-4 bg-neutral-700/50 rounded-lg">
                 <h3 className="text-xl font-semibold text-blue-300 mb-3">New Task</h3>
                 <form onSubmit={handleCreateTask}>
                    <div className="mb-4">
                        <label htmlFor="newTaskDescription" className="block text-neutral-300 text-sm font-semibold mb-2">Description:</label>
                        <input
                            id="newTaskDescription"
                            type="text"
                            className="w-full p-2 rounded-md bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={newTaskDescription}
                            onChange={(e) => setNewTaskDescription(e.target.value)}
                            placeholder="Enter task description (e.g., Sync GitHub Repo)"
                            disabled={isSavingTask}
                            required
                        />
                    </div>
                     {/* Task Steps for New Task */}
                     <div className="mb-4 p-3 bg-neutral-600/50 rounded-md">
                         <h4 className="text-neutral-300 text-sm font-semibold mb-2">Steps:</h4>
                         <ul className="space-y-3">
                             {newTaskSteps.map((step, index) => (
                                 <li key={index} className="p-3 bg-neutral-700/50 rounded-md border-l-2 border-blue-600">
                                     <div className="flex justify-between items-center mb-2">
                                         <span className="text-sm font-medium text-neutral-300">Step {index + 1}</span>
                                          <button
                                             type="button"
                                             onClick={() => handleRemoveStepFromNewTask(index)}
                                             className="text-red-400 hover:text-red-600 transition disabled:opacity-50"
                                             disabled={isSavingTask}
                                          >
                                              <MinusCircle size={18} />
                                          </button>
                                     </div>
                                     <div className="mb-2">
                                         <label htmlFor={`new-step-desc-${index}`} className="block text-neutral-400 text-xs font-semibold mb-1">Description:</label>
                                         <input
                                             id={`new-step-desc-${index}`}
                                             type="text"
                                             className="w-full p-1 rounded-md bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                                             value={step.description}
                                             onChange={(e) => {
                                                 const updatedSteps = [...newTaskSteps];
                                                 updatedSteps[index].description = e.target.value;
                                                 setNewTaskSteps(updatedSteps);
                                             }}
                                             placeholder="e.g., Pull latest changes"
                                             disabled={isSavingTask}
                                             required
                                         />
                                     </div>
                                      {/* --- Modified: Use ActionEditor component here --- */}
                                      <div className="mb-2">
                                         <h5 className="block text-neutral-400 text-xs font-semibold mb-1">Action:</h5>
                                         <ActionEditor
                                             action={step.action}
                                             onChange={(newAction) => handleNewTaskStepChange(index, newAction)}
                                             disabled={isSavingTask}
                                             availableRunes={availableRunes}
                                             availableAbilities={availableAbilities}
                                             availableGoals={availableGoals} // Pass available goals
                                         />
                                      </div>
                                      {/* --- End Modified --- */}
                                </li>
                             ))}
                         </ul>
                          <button
                             type="button"
                             onClick={handleAddStepToNewTask}
                             className="mt-4 px-4 py-2 text-sm bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition disabled:opacity-50"
                             disabled={isSavingTask}
                          >
                              <PlusCircle size={16} className="inline-block mr-1"/> Add Step
                          </button>
                     </div>

                    <button
                        type="submit"
                        className="px-6 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isSavingTask || !newTaskDescription.trim() || newTaskSteps.length === 0}
                    >
                        {isSavingTask ? 'Creating...' : 'Save Task'}
                    </button>
                     <button
                        type="button"
                        onClick={handleCancelCreate}
                        className="px-6 py-2 bg-neutral-600 text-white font-semibold rounded-md hover:bg-neutral-700 transition"
                        disabled={isSavingTask}
                    >
                        Cancel
                    </button>
               </form>
                 {error && isSavingTask === false && ( // Show create error only after it finishes
                     <p className="text-red-400 text-sm mt-4">Error: {error}</p>
                 )}
            </div>
        )}

        {/* Form for editing a task */}
        {editingTask && ( // Show edit form if editing
             <div className="mb-8 p-4 bg-neutral-700/50 rounded-lg">
                 <h3 className="text-xl font-semibold text-blue-300 mb-3">Edit Task: {editingTask.description}</h3>
                 <form onSubmit={handleUpdateTask}>
                    <div className="mb-4">
                        <label htmlFor="editingTaskDescription" className="block text-neutral-300 text-sm font-semibold mb-2">Description:</label>
                        <input
                            id="editingTaskDescription"
                            type="text"
                            className="w-full p-2 rounded-md bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={editingTaskDescription}
                            onChange={(e) => setEditingTaskDescription(e.target.value)}
                            placeholder="Edit task description"
                            disabled={isUpdatingTask}
                            required
                        />
                    </div>
                    {/* TODO: Add UI for editing steps (complex: add/remove/update steps) */}
                    {editingTask.steps && editingTask.steps.length > 0 && ((
                         <div className="mb-4 p-3 bg-neutral-600/50 rounded-md">
                             <h4 className="text-neutral-300 text-sm font-semibold mb-2">Steps (View Only in MVP Edit):</h4>
                             <ul className="space-y-2">
                                 {editingTask.steps.map((step, index) => (
                                     <li key={step.id} className={`p-3 rounded-md border-l-2 ${step.status === 'completed' ? 'border-green-600' : step.status === 'failed' ? 'border-red-600' : step.status === 'in-progress' ? 'border-blue-600' : 'border-neutral-600'} bg-neutral-700/50`}>
                                         <p className="text-sm font-medium text-neutral-300">Step {index + 1}: {step.description}</p>
                                         <p className="text-neutral-400 text-xs">Status: {step.status} | Action: {step.action.type}</p>
                                     </li>
                                 ))}\
                             </ul>
                         </div>
                    ))}\
                     {editingTask.steps && editingTask.steps.length === 0 && ((
                          <div className="mb-4 p-3 bg-neutral-600/50 rounded-md">
                              <p className="text-neutral-400 text-sm">No steps defined for this task yet.</p>
                          </div>
                     ))}\

                    <div className="flex gap-4">
                        <button
                            type="submit"
                            className="px-6 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isUpdatingTask || !editingTaskDescription.trim()}
                        >
                            {isUpdatingTask ? 'Saving...' : 'Save Changes'}
                        </button>
                         <button
                            type="button"
                            onClick={handleCancelEdit}
                            className="px-6 py-2 bg-neutral-600 text-white font-semibold rounded-md hover:bg-neutral-700 transition"
                            disabled={isUpdatingTask}
                        >
                            Cancel
                        </button>
                    </div>
                 {error && isUpdatingTask === false && ( // Show save error only after it finishes
                     <p className="text-red-400 text-sm mt-4">Error: {error}</p>
                 )}\
               </form>
            </div>
        )}\


        {/* Tasks List */}
        <div className="p-4 bg-neutral-700/50 rounded-lg">
            <h3 className="text-xl font-semibold text-blue-300 mb-3">Your Tasks ({tasks.length})</h3>
            {loading && !isSavingTask && !isUpdatingTask ? ( // Show loading only if not currently saving/updating
              <p className="text-neutral-400">Loading tasks...</p>
            ) : error && !isCreatingTask && !editingTask ? ( // Show main error if not in create/edit mode
                 <p className="text-red-400">Error: {error}</p>
            ) : tasks.length === 0 ? (
              <p className="text-neutral-400">No tasks found yet. Create one using the form above.</p>
            ) : (
              <ul className="space-y-4">
                {tasks.map((task) => (
                  <li key={task.id} className={`bg-neutral-600/50 p-4 rounded-md border-l-4 ${getTaskStatusColor(task.status).replace('text-', 'border-')}`}>
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <Target size={20} className="text-blue-400"/>
                            <h4 className={`font-semibold mb-1 ${getTaskStatusColor(task.status)}`}>{task.description}</h4>
                        </div>
                         <button onClick={() => toggleExpandTask(task.id)} className="text-neutral-400 hover:text-white transition">
                            {expandedTasks[task.id] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}\
                         </button>
                    </div>
                    <p className="text-neutral-300 text-sm">Status: <span className={getTaskStatusColor(task.status)}>{task.status}</span></p>
                    {task.linked_kr_id && (
                         <p className="text-neutral-300 text-sm flex items-center gap-1">
                             <Target size={14}/> Linked to KR: {task.linked_kr_id}
                         </p>
                    )}
                    {task.error && task.status === 'failed' && (
                         <p className="text-red-400 text-sm mt-1">Error: {task.error}</p>
                    )}
                    <small className="text-neutral-400 text-xs block mt-1">
                        ID: {task.id} | Created: {new Date(task.creation_timestamp).toLocaleString()}
                         {task.start_timestamp && ` | Started: ${new Date(task.start_timestamp).toLocaleString()}`}\
                         {task.completion_timestamp && ` | Finished: ${new Date(task.completion_timestamp).toLocaleString()}`}\
                         {task.status === 'in-progress' && ` | Current Step: ${task.current_step_index + 1}/${task.steps.length}`}\
                    </small>

                    {/* Task Steps (Collapsible) */}\
                    {expandedTasks[task.id] && task.steps && task.steps.length > 0 && ((\
                        <div className="mt-4 border-t border-neutral-600 pt-4">
                            <h5 className="text-neutral-300 text-sm font-semibold mb-2">Steps:</h5>
                            <ul className="space-y-2">
                                {task.steps.map((step, index) => (
                                    <li key={step.id} className={`p-3 rounded-md border-l-2 ${step.status === 'completed' ? 'border-green-600' : step.status === 'failed' ? 'border-red-600' : step.status === 'in-progress' ? 'border-blue-600' : 'border-neutral-600'} bg-neutral-700/50`}>
                                        <p className="text-sm font-medium text-neutral-300">Step {index + 1}: {step.description}</p>
                                        <p className="text-neutral-400 text-xs">Status: {step.status} | Action: {step.action.type}</p>
                                         {step.error && step.status === 'failed' && (
                                             <p className="text-red-400 text-xs mt-1">Error: {step.error}</p>
                                         )}\
                                         {/* TODO: Display step result if available */}\
                                    </li>
                                ))}\
                            </ul>
                        </div>
                    ))}\
                     {expandedTasks[task.id] && (!task.steps || task.steps.length === 0) && ((\
                          <div className="mt-4 border-t border-neutral-600 pt-4">
                              <p className="text-neutral-400 text-sm">No steps defined for this task yet.</p>
                          </div>
                     ))}\

                    {/* Task Actions */}\
                    <div className="mt-4 flex flex-wrap gap-2"> {/* Use flex-wrap for smaller screens */}\
                         {/* Start Button */}\
                         {(task.status === 'idle' || task.status === 'completed' || task.status === 'failed' || task.status === 'cancelled') && ((\
                             <button
                                 className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                 onClick={() => handleStartTask(task.id)}
                                 disabled={isStarting !== null || isPausing !== null || isResuming !== null || isCancelling !== null || isDeleting !== null}\
                             >
                                 {isStarting === task.id ? <Loader2 size={16} className="inline-block mr-1 animate-spin"/> : <Play size={16} className="inline-block mr-1"/>)}\
                                 {isStarting === task.id ? 'Starting...' : 'Start'}\
                             </button>
                         ))}\
                          {/* Pause Button */}\
                         {task.status === 'in-progress' && ((\
                             <button
                                 className="px-3 py-1 text-sm bg-yellow-600 text-white rounded hover:bg-yellow-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                 onClick={() => handlePauseTask(task.id)}
                                 disabled={isStarting !== null || isPausing !== null || isResuming !== null || isCancelling !== null || isDeleting !== null}\
                             >
                                 {isPausing === task.id ? <Loader2 size={16} className="inline-block mr-1 animate-spin"/> : <Pause size={16} className="inline-block mr-1"/>)}\
                                 {isPausing === task.id ? 'Pausing...' : 'Pause'}\
                             </button>
                         ))}\
                          {/* Resume Button */}\
                         {task.status === 'paused' && ((\
                             <button
                                 className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                 onClick={() => handleResumeTask(task.id)}
                                 disabled={isStarting !== null || isPausing !== null || isResuming !== null || isCancelling !== null || isDeleting !== null}\
                             >
                                 {isResuming === task.id ? <Loader2 size={16} className="inline-block mr-1 animate-spin"/> : <Play size={16} className="inline-block mr-1"/>)}\
                                 {isResuming === task.id ? 'Resuming...' : 'Resume'}\
                             </button>
                         ))}\
                          {/* Cancel Button */}\
                         {(task.status === 'pending' || task.status === 'in-progress' || task.status === 'paused') && ((\
                             <button
                                 className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                 onClick={() => handleCancelTask(task.id)}
                                 disabled={isStarting !== null || isPausing !== null || isResuming !== null || isCancelling !== null || isDeleting !== null}\
                             >
                                 {isCancelling === task.id ? <Loader2 size={16} className="inline-block mr-1 animate-spin"/> : <XCircle size={16} className="inline-block mr-1"/>)}\
                                 {isCancelling === task.id ? 'Cancelling...' : 'Cancel'}\
                             </button>
                         ))}\
                         {/* Edit Button */}\
                         <button
                            className="px-3 py-1 text-sm bg-yellow-600 text-white rounded hover:bg-yellow-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={() => handleEditTaskClick(task)}
                            disabled={isStarting !== null || isPausing !== null || isResuming !== null || isCancelling !== null || isDeleting !== null || !!editingTask}\
                         >
                            <Edit size={16} className="inline-block mr-1"/> Edit
                         </button>
                         {/* Delete Button */}\
                         <button
                            className="px-3 py-1 text-sm bg-red-800 text-white rounded hover:bg-red-900 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={() => handleDeleteTask(task.id)}
                            disabled={isStarting !== null || isPausing !== null || isResuming !== null || isCancelling !== null || isDeleting !== null || task.status === 'in-progress'}\
                         >
                            {isDeleting === task.id ? <Loader2 size={16} className="inline-block mr-1 animate-spin"/> : <Trash2 size={16} className="inline-block mr-1"/>)}\
                            {isDeleting === task.id ? 'Deleting...' : 'Delete'}
                         </button>
                         {/* New: Link/Unlink to KR Button */}\
                         {task.linked_kr_id ? ((\
                             <button
                                 className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                 onClick={() => handleUnlinkTaskFromKr(task)}
                                 disabled={isStarting !== null || isPausing !== null || isResuming !== null || isCancelling !== null || isDeleting !== null || isLinkingKr}\
                             >
                                 {isLinkingKr ? <Loader2 size={16} className="inline-block mr-1 animate-spin"/> : <Unlink size={16} className="inline-block mr-1"/>)}\
                                 {isLinkingKr ? 'Unlinking...' : 'Unlink KR'}\
                             </button>
                         )) : ((\
                             <button
                                 className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                 onClick={() => handleOpenLinkKrModal(task)}
                                 disabled={isStarting !== null || isPausing !== null || isResuming !== null || isCancelling !== null || isDeleting !== null || isLinkingKr || availableGoals.length === 0}\
                             >
                                 {isLinkingKr ? <Loader2 size={16} className="inline-block mr-1 animate-spin"/> : <LinkIcon size={16} className="inline-block mr-1"/>)}\
                                 {isLinkingKr ? 'Linking...' : 'Link to KR'}\
                             </button>
                         ))}\
                         {/* End New */}\
                    </div>
                  </li>
                ))}\
              </ul>
            )}\
        </div>

        {/* New: Link KR Modal */}\
        {showLinkKrModal && ((\
             <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                 <div className="bg-neutral-800 p-8 rounded-lg shadow-xl w-full max-w-md max-h-[90%] flex flex-col"> {/* Added flex-col and max-height */}\
                     <div className="flex justify-between items-center mb-4">
                         <h3 className="text-xl font-semibold text-blue-300">Link Task to Key Result</h3>
                         <button
                             type="button"
                             onClick={handleCloseLinkKrModal}
                             className="text-neutral-400 hover:text-white transition"
                             disabled={isLinkingKr}
                         >
                             <XCircle size={24} />
                         </button>
                     </div>
                     <p className="text-neutral-300 text-sm mb-4">Select a Key Result to link Task \"{showLinkKrModal.description}\" to.</p>

                     {availableGoals.length === 0 ? (
                         <div className="flex-grow text-neutral-400 overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-700 pr-2">
                             <p>No goals with Key Results found. Create goals on the Goals page first.</p>
                         </div>
                     ) : (
                         <div className="flex-grow overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-700 space-y-3 pr-2"> {/* Added pr-2 for scrollbar space */}\
                             {availableGoals.map(goal => (
                                 goal.key_results && goal.key_results.length > 0 && ((\
                                     <div key={goal.id} className="p-3 bg-neutral-700/50 rounded-md border-l-2 border-blue-600 space-y-2">
                                         <h4 className="text-neutral-300 text-sm font-semibold">Goal: {goal.description}</h4>
                                         <ul className="space-y-2">
                                             {goal.key_results.map(kr => (
                                                 <li key={kr.id} className="flex items-start gap-3 bg-neutral-800 p-2 rounded-md">
                                                     <input
                                                         type="radio"
                                                         id={`kr-${kr.id}`}
                                                         name="selectKrToLink"
                                                         className="form-radio h-4 w-4 text-blue-600 rounded border-neutral-600 bg-neutral-800 focus:ring-blue-500 mt-1"
                                                         value={kr.id}
                                                         checked={selectedKrToLink === kr.id}
                                                         onChange={(e) => setSelectedKrToLink(e.target.value)}
                                                         disabled={isLinkingKr}
                                                     />
                                                     <label htmlFor={`kr-${kr.id}`} className="flex-grow text-neutral-300 text-sm cursor-pointer">
                                                         <span className="font-semibold">KR:</span> {kr.description}
                                                         <span className="block text-neutral-400 text-xs mt-1">Progress: {kr.current_value} / {kr.target_value} {kr.unit}</span>
                                                     </label>
                                                 </li>
                                             ))}\
                                         </ul>
                                     </div>
                                 ))\
                             ))}\
                         </div>
                     )}\

                     {linkKrError && !isLinkingKr && ( // Show error only after linking finishes
                         <p className="text-red-400 text-sm mt-4">Error: {linkKrError}</p>
                     )}\

                     <div className="flex gap-4 justify-end mt-4 flex-shrink-0"> {/* Added flex-shrink-0 */}\
                         <button
                             type="button"
                             onClick={handleCloseLinkKrModal}
                             className="px-6 py-2 bg-neutral-600 text-white font-semibold rounded-md hover:bg-neutral-700 transition"
                             disabled={isLinkingKr}
                         >
                             Cancel
                         </button>
                         <button
                             type="button"
                             onClick={handleLinkTaskToKr}
                             className="px-6 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                             disabled={isLinkingKr || !selectedKrToLink}
                         >
                             {isLinkingKr ? 'Linking...' : 'Link Task'}
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

export default Tasks;
```