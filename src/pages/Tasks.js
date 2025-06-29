"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
""(templateObject_1 || (templateObject_1 = __makeTemplateObject(["typescript\n// src/pages/Tasks.tsx\n// Tasks Page\n// Displays and manages user's automated tasks.\n// --- New: Create a page for the Tasks UI ---\n// --- New: Implement fetching and displaying tasks ---\n// --- New: Add UI for creating, editing, and deleting tasks ---\n// --- New: Implement realtime updates for tasks and task steps ---\n// --- New: Add UI for viewing task steps and their status ---\n// --- New: Add UI for manually starting, pausing, resuming, and cancelling tasks ---\n// --- New: Add UI for linking/unlinking tasks to Key Results ---\n// --- Modified: Use ActionEditor for creating task steps ---\n\n\nimport React, { useEffect, useState } from 'react';\nimport { SelfNavigationEngine } from '../core/self-navigation/SelfNavigationEngine'; // To fetch and manage tasks\nimport { GoalManagementService } from '../core/goal-management/GoalManagementService'; // To fetch goals/KRs for linking\nimport { AuthorityForgingEngine } from '../core/authority/AuthorityForgingEngine'; // Use for action recording\nimport { RuneEngraftingCenter } from '../core/rune-engrafting/SacredRuneEngraver'; // To fetch runes for ActionEditor\nimport { Task, TaskStep, Goal, KeyResult, Rune, ForgedAbility } from '../interfaces'; // Import types\nimport { Play, Pause, XCircle, RotateCcw, ChevronDown, ChevronUp, Trash2, Edit, PlusCircle, Save, Loader2, Info, Link as LinkIcon, Unlink, Target, MinusCircle } from 'lucide-react'; // Import icons including Link and Unlink, Loader2, Info, Target, MinusCircle\n\n// --- New: Import ActionEditor component ---\nimport ActionEditor from '../components/ActionEditor';\n// --- End New ---\n\n\n// Access core modules from the global window object (for MVP simplicity)\n// In a real app, use React Context or dependency injection\ndeclare const window: any;\nconst selfNavigationEngine: SelfNavigationEngine = window.systemContext?.selfNavigationEngine; // The Self-Navigation (\u81EA\u6211\u5C0E\u822A) pillar\nconst authorityForgingEngine: any = window.systemContext?.authorityForgingEngine; // Use any for action recording (\u6B0A\u80FD\u935B\u9020)\nconst goalManagementService: GoalManagementService = window.systemContext?.goalManagementService; // The Goal Management (\u76EE\u6A19\u7BA1\u7406) module\nconst sacredRuneEngraver: RuneEngraftingCenter = window.systemContext?.sacredRuneEngraver; // The Sacred Rune Engraver (\u8056\u7B26\u6587\u5320) pillar\nconst systemContext: any = window.systemContext; // Access the full context for currentUser\n\n\nconst Tasks: React.FC = () => {\n  const [tasks, setTasks] = useState<Task[]>([]); // State to hold tasks\n  const [loading, setLoading] = useState(true);\n  const [error, setError] = useState<string | null>(null);\n  const [expandedTasks, setExpandedTasks] = useState<Record<string, boolean>>({}); // State to track expanded tasks\n\n  // --- State for creating new task ---\n  const [isCreatingTask, setIsCreatingTask] = useState(false);\n  const [newTaskDescription, setNewTaskDescription] = useState('');\n  const [newTaskSteps, setNewTaskSteps] = useState<Omit<TaskStep, 'id' | 'task_id' | 'status' | 'result' | 'error' | 'start_timestamp' | 'end_timestamp'>[]>([]); // Steps for new task\n  const [isSavingTask, setIsSavingTask] = useState(false);\n  // --- End New ---\n\n  // --- State for editing task ---\n  const [editingTask, setEditingTask] = useState<Task | null>(null); // The task being edited\n  const [editingTaskDescription, setEditingTaskDescription] = useState('');\n  // Note: Editing steps is complex and deferred for MVP. Only description is editable here.\n  const [isUpdatingTask, setIsUpdatingTask] = useState(false);\n  // --- End New ---\n\n  // --- State for task execution actions ---\n  const [isStarting, setIsStarting] = useState<string | null>(null); // Track which task is starting\n  const [isPausing, setIsPausing] = useState<string | null>(null); // Track which task is pausing\n  const [isResuming, setIsResuming] = useState<string | null>(null); // Track which task is resuming\n  const [isCancelling, setIsCancelling] = useState<string | null>(null); // Track which task is cancelling\n  const [isDeleting, setIsDeleting] = useState<string | null>(null); // Track which task is being deleted\n  // --- End New ---\n\n  // --- New: State for linking tasks to KRs ---\n  const [showLinkKrModal, setShowLinkKrModal] = useState<Task | null>(null); // The task being linked\n  const [availableGoals, setAvailableGoals] = useState<Goal[]>([]); // Goals for KR selection\n  const [selectedKrToLink, setSelectedKrToLink] = useState<string | ''>(''); // Selected KR ID\n  const [isLinkingKr, setIsLinkingKr] = useState(false);\n  const [linkKrError, setLinkKrError] = useState<string | null>(null);\n  // --- End New ---\n\n  // --- New: States for data needed by ActionEditor ---\n  const [availableRunes, setAvailableRunes] = useState<Rune[]>([]);\n  const [availableAbilities, setAvailableAbilities] = useState<ForgedAbility[]>([]);\n  // availableGoals is already fetched for KR linking\n  // --- End New ---\n\n\n  const fetchTasks = async () => {\n       const userId = systemContext?.currentUser?.id;\n       if (!selfNavigationEngine || !userId) {\n            setError(\"SelfNavigationEngine module not initialized or user not logged in.\");\n            setLoading(false);\n            return;\n        }\n      setLoading(true);\n      setError(null); // Clear main error when fetching\n      try {\n          // Fetch tasks for the current user from SelfNavigationEngine (Part of \u81EA\u6211\u5C0E\u822A / \u96D9\u5411\u540C\u6B65\u9818\u57DF)\n          const userTasks = await selfNavigationEngine.getTasks(userId); // Pass user ID\n          setTasks(userTasks);\n      } catch (err: any) {\n          console.error('Error fetching tasks:', err);\n          setError("], ["typescript\n// src/pages/Tasks.tsx\n// Tasks Page\n// Displays and manages user's automated tasks.\n// --- New: Create a page for the Tasks UI ---\n// --- New: Implement fetching and displaying tasks ---\n// --- New: Add UI for creating, editing, and deleting tasks ---\n// --- New: Implement realtime updates for tasks and task steps ---\n// --- New: Add UI for viewing task steps and their status ---\n// --- New: Add UI for manually starting, pausing, resuming, and cancelling tasks ---\n// --- New: Add UI for linking/unlinking tasks to Key Results ---\n// --- Modified: Use ActionEditor for creating task steps ---\n\n\nimport React, { useEffect, useState } from 'react';\nimport { SelfNavigationEngine } from '../core/self-navigation/SelfNavigationEngine'; // To fetch and manage tasks\nimport { GoalManagementService } from '../core/goal-management/GoalManagementService'; // To fetch goals/KRs for linking\nimport { AuthorityForgingEngine } from '../core/authority/AuthorityForgingEngine'; // Use for action recording\nimport { RuneEngraftingCenter } from '../core/rune-engrafting/SacredRuneEngraver'; // To fetch runes for ActionEditor\nimport { Task, TaskStep, Goal, KeyResult, Rune, ForgedAbility } from '../interfaces'; // Import types\nimport { Play, Pause, XCircle, RotateCcw, ChevronDown, ChevronUp, Trash2, Edit, PlusCircle, Save, Loader2, Info, Link as LinkIcon, Unlink, Target, MinusCircle } from 'lucide-react'; // Import icons including Link and Unlink, Loader2, Info, Target, MinusCircle\n\n// --- New: Import ActionEditor component ---\nimport ActionEditor from '../components/ActionEditor';\n// --- End New ---\n\n\n// Access core modules from the global window object (for MVP simplicity)\n// In a real app, use React Context or dependency injection\ndeclare const window: any;\nconst selfNavigationEngine: SelfNavigationEngine = window.systemContext?.selfNavigationEngine; // The Self-Navigation (\u81EA\u6211\u5C0E\u822A) pillar\nconst authorityForgingEngine: any = window.systemContext?.authorityForgingEngine; // Use any for action recording (\u6B0A\u80FD\u935B\u9020)\nconst goalManagementService: GoalManagementService = window.systemContext?.goalManagementService; // The Goal Management (\u76EE\u6A19\u7BA1\u7406) module\nconst sacredRuneEngraver: RuneEngraftingCenter = window.systemContext?.sacredRuneEngraver; // The Sacred Rune Engraver (\u8056\u7B26\u6587\u5320) pillar\nconst systemContext: any = window.systemContext; // Access the full context for currentUser\n\n\nconst Tasks: React.FC = () => {\n  const [tasks, setTasks] = useState<Task[]>([]); // State to hold tasks\n  const [loading, setLoading] = useState(true);\n  const [error, setError] = useState<string | null>(null);\n  const [expandedTasks, setExpandedTasks] = useState<Record<string, boolean>>({}); // State to track expanded tasks\n\n  // --- State for creating new task ---\n  const [isCreatingTask, setIsCreatingTask] = useState(false);\n  const [newTaskDescription, setNewTaskDescription] = useState('');\n  const [newTaskSteps, setNewTaskSteps] = useState<Omit<TaskStep, 'id' | 'task_id' | 'status' | 'result' | 'error' | 'start_timestamp' | 'end_timestamp'>[]>([]); // Steps for new task\n  const [isSavingTask, setIsSavingTask] = useState(false);\n  // --- End New ---\n\n  // --- State for editing task ---\n  const [editingTask, setEditingTask] = useState<Task | null>(null); // The task being edited\n  const [editingTaskDescription, setEditingTaskDescription] = useState('');\n  // Note: Editing steps is complex and deferred for MVP. Only description is editable here.\n  const [isUpdatingTask, setIsUpdatingTask] = useState(false);\n  // --- End New ---\n\n  // --- State for task execution actions ---\n  const [isStarting, setIsStarting] = useState<string | null>(null); // Track which task is starting\n  const [isPausing, setIsPausing] = useState<string | null>(null); // Track which task is pausing\n  const [isResuming, setIsResuming] = useState<string | null>(null); // Track which task is resuming\n  const [isCancelling, setIsCancelling] = useState<string | null>(null); // Track which task is cancelling\n  const [isDeleting, setIsDeleting] = useState<string | null>(null); // Track which task is being deleted\n  // --- End New ---\n\n  // --- New: State for linking tasks to KRs ---\n  const [showLinkKrModal, setShowLinkKrModal] = useState<Task | null>(null); // The task being linked\n  const [availableGoals, setAvailableGoals] = useState<Goal[]>([]); // Goals for KR selection\n  const [selectedKrToLink, setSelectedKrToLink] = useState<string | ''>(''); // Selected KR ID\n  const [isLinkingKr, setIsLinkingKr] = useState(false);\n  const [linkKrError, setLinkKrError] = useState<string | null>(null);\n  // --- End New ---\n\n  // --- New: States for data needed by ActionEditor ---\n  const [availableRunes, setAvailableRunes] = useState<Rune[]>([]);\n  const [availableAbilities, setAvailableAbilities] = useState<ForgedAbility[]>([]);\n  // availableGoals is already fetched for KR linking\n  // --- End New ---\n\n\n  const fetchTasks = async () => {\n       const userId = systemContext?.currentUser?.id;\n       if (!selfNavigationEngine || !userId) {\n            setError(\"SelfNavigationEngine module not initialized or user not logged in.\");\n            setLoading(false);\n            return;\n        }\n      setLoading(true);\n      setError(null); // Clear main error when fetching\n      try {\n          // Fetch tasks for the current user from SelfNavigationEngine (Part of \u81EA\u6211\u5C0E\u822A / \u96D9\u5411\u540C\u6B65\u9818\u57DF)\n          const userTasks = await selfNavigationEngine.getTasks(userId); // Pass user ID\n          setTasks(userTasks);\n      } catch (err: any) {\n          console.error('Error fetching tasks:', err);\n          setError("])));
Failed;
to;
load;
tasks: $;
{
    err.message;
}
");\n      } finally {\n          setLoading(false);\n      }\n  };\n\n    // --- New: Fetch goals for KR linking ---    const fetchGoalsForLinking = async () => {\n        const userId = systemContext?.currentUser?.id;\n        if (!goalManagementService || !userId) {\n            console.warn(\"GoalManagementService module not initialized or user not logged in. Cannot fetch goals for linking.\");\n            setAvailableGoals([]);\n            return;\n        }\n        try {\n            // Fetch all goals for the user (including KRs)\n            const userGoals = await goalManagementService.getGoals(userId);\n            setAvailableGoals(userGoals);\n        } catch (err: any) {\n            console.error('Error fetching goals for linking:', err);\n            setAvailableGoals([]);\n        }\n    };\n    // --- End New ---\n    // --- New: Fetch data needed by ActionEditor ---\n    const fetchActionEditorData = async () => {\n        const userId = systemContext?.currentUser?.id;\n        if (!userId || !sacredRuneEngraver || !authorityForgingEngine || !goalManagementService) {\n             console.warn(\"Cannot fetch ActionEditor data: Core modules not initialized or user not logged in.\");\n             setAvailableRunes([]);\n             setAvailableAbilities([]);\n             // availableGoals is fetched separately\n             return;\n        }\n        try {\n            // Fetch available runes (user's and public)\n            const runes = await sacredRuneEngraver.listRunes(undefined, userId);\n            setAvailableRunes(runes);\n\n            // Fetch available abilities (user's and public)\n            const abilities = await authorityForgingEngine.getAbilities(undefined, userId);\n            setAvailableAbilities(abilities);\n\n            // availableGoals is fetched separately by fetchGoalsForLinking\n\n        } catch (err: any) {\n            console.error('Error fetching ActionEditor data:', err);\n            // Don't set a critical error for the whole page\n            // setError(";
Failed;
to;
load;
data;
for (action; editor; )
    : $;
{
    err.message;
}
");\n            setAvailableRunes([]);\n            setAvailableAbilities([]);\n        }\n    };\n    // --- End New ---\n\n\n  useEffect(() => {\n    // Fetch data when the component mounts or when the user changes\n    if (systemContext?.currentUser?.id) {\n        fetchTasks(); // Fetch all tasks on initial load\n        // --- New: Fetch goals for linking on initial load ---\n        fetchGoalsForLinking();\n        // --- New: Fetch data needed by ActionEditor ---\n        fetchActionEditorData();\n        // --- End New ---\n    }\n\n    // --- New: Subscribe to realtime updates for tasks and task_steps ---\n    let unsubscribeTaskInsert: (() => void) | undefined;\n    let unsubscribeTaskUpdate: (() => void) | undefined;\n    let unsubscribeTaskDelete: (() => void) | undefined;\n    let unsubscribeTaskStepInsert: (() => void) | undefined;\n    let unsubscribeTaskStepUpdate: (() => void) | undefined;\n    let unsubscribeTaskStepDelete: (() => void) | undefined;\n    // --- New: Subscribe to task execution status events ---\n    let unsubscribeTaskStarted: (() => void) | undefined;\n    let unsubscribeTaskCompleted: (() => void) | undefined;\n    let unsubscribeTaskFailed: (() => void) | undefined;\n    let unsubscribeTaskPaused: (() => void) | undefined;\n    let unsubscribeTaskResumed: (() => void) | undefined;\n    let unsubscribeTaskCancelled: (() => void) | undefined;\n    // --- End New ---\n\n\n    if (selfNavigationEngine?.context?.eventBus) { // Check if SelfNavigationEngine and its EventBus are available\n        const eventBus = selfNavigationEngine.context.eventBus;\n        const userId = systemContext?.currentUser?.id;\n\n        // Subscribe to task insert events\n        unsubscribeTaskInsert = eventBus.subscribe('task_insert', (payload: Task) => {\n            if (payload.user_id === userId) {\n                console.log('Tasks page received task_insert event:', payload);\n                // Add the new task and keep sorted by creation timestamp (newest first)\n                setTasks(prevTasks => [payload, ...prevTasks].sort((a, b) => new Date(b.creation_timestamp).getTime() - new Date(a.creation_timestamp).getTime()));\n            }\n        });\n         // Subscribe to task update events\n         unsubscribeTaskUpdate = eventBus.subscribe('task_updated', (payload: Task) => {\n             if (payload.user_id === userId) {\n                 console.log('Tasks page received task_updated event:', payload);\n                 // Update the specific task in the state\n                 setTasks(prevTasks => prevTasks.map(task => task.id === payload.id ? payload : task));\n             }\n         });\n          // Subscribe to task delete events\n          unsubscribeTaskDelete = eventBus.subscribe('task_delete', (payload: { taskId: string, userId: string }) => {\n             if (payload.userId === userId) {\n                 console.log('Tasks page received task_delete event:', payload);\n                 // Remove the deleted task from the state\n                 setTasks(prevTasks => prevTasks.filter(task => task.id !== payload.taskId));\n             }\n         });\n\n        // Subscribe to task step insert/update/delete events (refetch the task to update steps list)\n        unsubscribeTaskStepInsert = eventBus.subscribe('task_step_insert', (payload: TaskStep & { task_id: string, user_id: string }) => { // Payload includes task_id and user_id\n             if (payload.user_id === userId) {\n                 console.log('Tasks page received task_step_insert event:', payload);\n                 fetchTasks(); // Refetch data to update steps list\n             }\n         });\n         unsubscribeTaskStepUpdate = eventBus.subscribe('task_step_update', (payload: TaskStep & { task_id: string, user_id: string }) => { // Payload includes task_id and user_id\n             if (payload.user_id === userId) {\n                 console.log('Tasks page received task_step_update event:', payload);\n                 fetchTasks(); // Refetch data to update step details\n             }\n         });\n          unsubscribeTaskStepDelete = eventBus.subscribe('task_step_delete', (payload: { stepId: string, taskId: string, userId: string }) => { // Payload includes task_id and user_id\n             if (payload.userId === userId) {\n                 console.log('Tasks page received task_step_delete event:', payload);\n                 fetchTasks(); // Refetch data to remove step\n             }\n         });\n\n        // --- New: Subscribe to task execution status events ---\n        // These events are published by SelfNavigationEngine.executeTaskSteps\n        // They trigger a refetch of the task data to update the status displayed on the page\n        unsubscribeTaskStarted = eventBus.subscribe('task_in-progress', (payload: Task) => {\n             if (payload.user_id === userId) {\n                 console.log('Tasks page received task_in-progress event:', payload);\n                 fetchTasks(); // Refetch to update overall status\n             }\n         });\n         unsubscribeTaskCompleted = eventBus.subscribe('task_completed', (payload: Task) => {\n             if (payload.user_id === userId) {\n                 console.log('Tasks page received task_completed event:', payload);\n                 fetchTasks(); // Refetch to update overall status/timestamps\n             }\n         });\n          unsubscribeTaskFailed = eventBus.subscribe('task_failed', (payload: Task) => {\n             if (payload.user_id === userId) {\n                 console.log('Tasks page received task_failed event:', payload);\n                 fetchTasks(); // Refetch to update overall status/timestamps/error\n             }\n         });\n          unsubscribeTaskPaused = eventBus.subscribe('task_paused', (payload: Task) => {\n             if (payload.user_id === userId) {\n                 console.log('Tasks page received task_paused event:', payload);\n                 fetchTasks(); // Refetch to update overall status\n             }\n         });\n          unsubscribeTaskResumed = eventBus.subscribe('task_resumed', (payload: Task) => {\n             if (payload.user_id === userId) {\n                 console.log('Tasks page received task_resumed event:', payload);\n                 fetchTasks(); // Refetch to update overall status\n             }\n         });\n          unsubscribeTaskCancelled = eventBus.subscribe('task_cancelled', (payload: Task) => {\n             if (payload.user_id === userId) {\n                 console.log('Tasks page received task_cancelled event:', payload);\n                 fetchTasks(); // Refetch to update overall status\n             }\n         });\n        // --- End New ---\n\n\n    }\n    // --- End New ---\n\n\n    return () => {\n        // Unsubscribe on component unmount\n        unsubscribeTaskInsert?.();\n        unsubscribeTaskUpdate?.();\n        unsubscribeTaskDelete?.();\n        unsubscribeTaskStepInsert?.();\n        unsubscribeTaskStepUpdate?.();\n        unsubscribeTaskStepDelete?.();\n        // --- New: Unsubscribe from task execution status events ---\n        unsubscribeTaskStarted?.();\n        unsubscribeTaskCompleted?.();\n        unsubscribeTaskFailed?.();\n        unsubscribeTaskPaused?.();\n        unsubscribeTaskResumed?.();\n        unsubscribeTaskCancelled?.();\n        // --- End New ---\n    };\n\n  }, [systemContext?.currentUser?.id, selfNavigationEngine, goalManagementService, sacredRuneEngraver, authorityForgingEngine]); // Re-run effect when user ID or services change\n\n\n    const toggleExpandTask = (taskId: string) => {\n        setExpandedTasks(prevState => ({\n            ...prevState,\n            [taskId]: !prevState[taskId]\n        }));\n    };\n\n    const getTaskStatusColor = (status: Task['status']) => {\n        switch (status) {\n            case 'completed': return 'text-green-400';\n            case 'failed': return 'text-red-400';\n            case 'in-progress': return 'text-blue-400';\n            case 'paused': return 'text-yellow-400';\n            case 'cancelled': return 'text-neutral-400';\n            case 'pending': return 'text-neutral-300';\n            default: return 'text-neutral-300';\n        }\n    };\n\n    // --- New: Handle Create Task ---\n    const handleCreateTask = async (e: React.FormEvent) => {\n        e.preventDefault();\n        const userId = systemContext?.currentUser?.id;\n        if (!selfNavigationEngine || !userId || !newTaskDescription.trim() || newTaskSteps.length === 0) {\n            alert(\"SelfNavigationEngine module not initialized, user not logged in, or description/steps are empty.\");\n            return;\n        }\n        // Basic validation for steps (ensure description and action type are present)\n        for (const step of newTaskSteps) {\n            if (!step.description.trim() || !step.action?.type) {\n                alert('Please fill in description and select an action type for all steps.');\n                return;\n            }\n             // TODO: Add more specific validation for action details based on type\n        }\n\n        setIsSavingTask(true);\n        setError(null);\n        try {\n            // Create the task (Part of \u81EA\u6211\u5C0E\u822A / \u96D9\u5411\u540C\u6B65\u9818\u57DF)\n            const taskDetails: Omit<Task, 'id' | 'status' | 'current_step_index' | 'creation_timestamp' | 'start_timestamp' | 'completion_timestamp' | 'key_results'> = {\n                description: newTaskDescription.trim(),\n                user_id: userId, // Ensure user_id is included\n                // status, current_step_index, timestamps are set by the engine/DB\n                // key_results are linked via key_results table, not directly in task\n                linked_task_ids: [], // Tasks don't link to other tasks directly in this model, but can be linked to KRs\n            };\n\n            const createdTask = await selfNavigationEngine.createTask(taskDetails.description, newTaskSteps, userId); // Pass description, steps, userId\n\n            if (createdTask) {\n                alert(";
Task;
"${createdTask.description}\" created successfully!`);;
console.log('Created new task:', createdTask);
// Reset form
setNewTaskDescription('');
setNewTaskSteps([]);
setIsCreatingTask(false); // Hide form
// State update handled by realtime listener
// Simulate recording user action
authorityForgingEngine === null || authorityForgingEngine === void 0 ? void 0 : authorityForgingEngine.recordAction({
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
    setError("Failed to create task: ".concat(err.message));
}
finally {
    setIsSavingTask(false);
}
;
var handleCancelCreate = function () {
    setIsCreatingTask(false);
    setNewTaskDescription('');
    setNewTaskSteps([]);
    setError(null); // Clear error when cancelling
};
var handleAddStepToNewTask = function () {
    var newStep = {
        step_order: newTaskSteps.length, // Assign order based on current number of steps
        description: '',
        action: { type: 'log', details: { message: '' } }, // Default action
    };
    setNewTaskSteps(__spreadArray(__spreadArray([], newTaskSteps, true), [newStep], false));
};
var handleRemoveStepFromNewTask = function (index) {
    var updatedSteps = newTaskSteps.filter(function (_, i) { return i !== index; });
    // Re-order steps after removal
    var reorderedSteps = updatedSteps.map(function (step, i) { return (__assign(__assign({}, step), { step_order: i })); });
    setNewTaskSteps(reorderedSteps);
};
// --- Modified: Handle New Task Step Change using ActionEditor's onChange payload ---
var handleNewTaskStepChange = function (index, newAction) {
    var updatedSteps = __spreadArray([], newTaskSteps, true);
    // Update the action property of the specific step
    updatedSteps[index].action = newAction;
    // Note: Description is handled by a separate input field above the ActionEditor
    setNewTaskSteps(updatedSteps);
};
// --- End Modified ---
// --- End New ---
// --- New: Handle Edit Task ---
var handleEditTaskClick = function (task) {
    setEditingTask(task);
    setEditingTaskDescription(task.description);
    // Note: Editing steps is complex and deferred for MVP. Only description is editable here.
    setError(null); // Clear previous errors when starting edit
};
var handleUpdateTask = function (e) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, updates, updatedTask, err_1;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                e.preventDefault();
                userId = (_a = systemContext === null || systemContext === void 0 ? void 0 : systemContext.currentUser) === null || _a === void 0 ? void 0 : _a.id;
                if (!selfNavigationEngine || !editingTask || !userId)
                    return [2 /*return*/]; // Safety checks
                if (!editingTaskDescription.trim()) {
                    alert('Please enter a task description.');
                    return [2 /*return*/];
                }
                setIsUpdatingTask(true);
                setError(null);
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, 4, 5]);
                updates = {
                    description: editingTaskDescription.trim(),
                    // Note: Status, current_step_index, timestamps, linked_kr_id are not editable here in MVP
                };
                return [4 /*yield*/, selfNavigationEngine.updateTask(editingTask.id, updates, userId)];
            case 2:
                updatedTask = _b.sent();
                if (updatedTask) {
                    alert("Task \"".concat(updatedTask.description, "\" updated successfully!"));
                    console.log('Task updated:', updatedTask);
                    setEditingTask(null); // Close edit form
                    setEditingTaskDescription('');
                    // State update handled by realtime listener
                    // Simulate recording user action
                    authorityForgingEngine === null || authorityForgingEngine === void 0 ? void 0 : authorityForgingEngine.recordAction({
                        type: 'web:tasks:update',
                        details: { taskId: updatedTask.id, description: updatedTask.description },
                        context: { platform: 'web', page: 'tasks' },
                        user_id: userId, // Associate action with user
                    });
                }
                return [3 /*break*/, 5];
            case 3:
                err_1 = _b.sent();
                console.error('Error updating task:', err_1);
                setError("Failed to update task: ".concat(err_1.message));
                return [3 /*break*/, 5];
            case 4:
                setIsUpdatingTask(false);
                return [7 /*endfinally*/];
            case 5: return [2 /*return*/];
        }
    });
}); };
var handleCancelEdit = function () {
    setEditingTask(null);
    setEditingTaskDescription('');
    setError(null);
};
// --- End New ---
var handleDeleteTask = function (taskId) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, success_1, err_2;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                userId = (_a = systemContext === null || systemContext === void 0 ? void 0 : systemContext.currentUser) === null || _a === void 0 ? void 0 : _a.id;
                if (!selfNavigationEngine || !userId) {
                    alert("SelfNavigationEngine module not initialized or user not logged in.");
                    return [2 /*return*/];
                }
                if (!confirm("Are you sure you want to delete this task? This will also delete all associated steps."))
                    return [2 /*return*/];
                setIsDeleting(taskId); // Indicate which task is being deleted
                setError(null);
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, 4, 5]);
                return [4 /*yield*/, selfNavigationEngine.deleteTask(taskId, userId)];
            case 2:
                success_1 = _b.sent();
                if (success_1) {
                    console.log('Task deleted:', taskId);
                    // State update handled by realtime listener
                    alert('Task deleted successfully!');
                    // Simulate recording user action
                    authorityForgingEngine === null || authorityForgingEngine === void 0 ? void 0 : authorityForgingEngine.recordAction({
                        type: 'web:tasks:delete',
                        details: { taskId: taskId },
                        context: { platform: 'web', page: 'tasks' },
                        user_id: userId, // Associate action with user
                    });
                }
                return [3 /*break*/, 5];
            case 3:
                err_2 = _b.sent();
                console.error('Error deleting task:', err_2);
                setError("Failed to delete task: ".concat(err_2.message));
                alert("Failed to delete task: ".concat(err_2.message));
                return [3 /*break*/, 5];
            case 4:
                setIsDeleting(null); // Reset deleting state
                return [7 /*endfinally*/];
            case 5: return [2 /*return*/];
        }
    });
}); };
// --- New: Handle Task Execution Actions ---
var handleStartTask = function (taskId) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, err_3;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                userId = (_a = systemContext === null || systemContext === void 0 ? void 0 : systemContext.currentUser) === null || _a === void 0 ? void 0 : _a.id;
                if (!selfNavigationEngine || !userId) {
                    alert("SelfNavigationEngine module not initialized or user not logged in.");
                    return [2 /*return*/];
                }
                console.log("Attempting to start task: ".concat(taskId));
                // Simulate recording user action
                authorityForgingEngine === null || authorityForgingEngine === void 0 ? void 0 : authorityForgingEngine.recordAction({
                    type: 'web:tasks:start',
                    details: { taskId: taskId },
                    context: { platform: 'web', page: 'tasks' },
                    user_id: userId, // Associate action with user
                });
                setIsStarting(taskId); // Indicate which task is starting
                setError(null); // Clear previous errors
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, 4, 5]);
                // Call the SelfNavigationEngine method to start the task
                return [4 /*yield*/, selfNavigationEngine.startTask(taskId, userId)];
            case 2:
                // Call the SelfNavigationEngine method to start the task
                _b.sent(); // Pass taskId, userId
                return [3 /*break*/, 5];
            case 3:
                err_3 = _b.sent();
                console.error('Error starting task:', err_3);
                setError("Failed to start task: ".concat(err_3.message));
                return [3 /*break*/, 5];
            case 4:
                setIsStarting(null); // State updated by event listener, but reset local flag
                return [7 /*endfinally*/];
            case 5: return [2 /*return*/];
        }
    });
}); };
var handlePauseTask = function (taskId) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, err_4;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                userId = (_a = systemContext === null || systemContext === void 0 ? void 0 : systemContext.currentUser) === null || _a === void 0 ? void 0 : _a.id;
                if (!selfNavigationEngine || !userId) {
                    alert("SelfNavigationEngine module not initialized or user not logged in.");
                    return [2 /*return*/];
                }
                console.log("Attempting to pause task: ".concat(taskId));
                // Simulate recording user action
                authorityForgingEngine === null || authorityForgingEngine === void 0 ? void 0 : authorityForgingEngine.recordAction({
                    type: 'web:tasks:pause',
                    details: { taskId: taskId },
                    context: { platform: 'web', page: 'tasks' },
                    user_id: userId, // Associate action with user
                });
                setIsPausing(taskId); // Indicate which task is pausing
                setError(null); // Clear previous errors
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, 4, 5]);
                // Call the SelfNavigationEngine method to pause the task
                return [4 /*yield*/, selfNavigationEngine.pauseTask(taskId, userId)];
            case 2:
                // Call the SelfNavigationEngine method to pause the task
                _b.sent(); // Pass taskId, userId
                return [3 /*break*/, 5];
            case 3:
                err_4 = _b.sent();
                console.error('Error pausing task:', err_4);
                setError("Failed to pause task: ".concat(err_4.message));
                return [3 /*break*/, 5];
            case 4:
                setIsPausing(null); // State updated by event listener, but reset local flag
                return [7 /*endfinally*/];
            case 5: return [2 /*return*/];
        }
    });
}); };
var handleResumeTask = function (taskId) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, err_5;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                userId = (_a = systemContext === null || systemContext === void 0 ? void 0 : systemContext.currentUser) === null || _a === void 0 ? void 0 : _a.id;
                if (!selfNavigationEngine || !userId) {
                    alert("SelfNavigationEngine module not initialized or user not logged in.");
                    return [2 /*return*/];
                }
                console.log("Attempting to resume task: ".concat(taskId));
                // Simulate recording user action
                authorityForgingEngine === null || authorityForgingEngine === void 0 ? void 0 : authorityForgingEngine.recordAction({
                    type: 'web:tasks:resume',
                    details: { taskId: taskId },
                    context: { platform: 'web', page: 'tasks' },
                    user_id: userId, // Associate action with user
                });
                setIsResuming(taskId); // Indicate which task is resuming
                setError(null); // Clear previous errors
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, 4, 5]);
                // Call the SelfNavigationEngine method to resume the task
                return [4 /*yield*/, selfNavigationEngine.resumeTask(taskId, userId)];
            case 2:
                // Call the SelfNavigationEngine method to resume the task
                _b.sent(); // Pass taskId, userId
                return [3 /*break*/, 5];
            case 3:
                err_5 = _b.sent();
                console.error('Error resuming task:', err_5);
                setError("Failed to resume task: ".concat(err_5.message));
                return [3 /*break*/, 5];
            case 4:
                setIsResuming(null); // State updated by event listener, but reset local flag
                return [7 /*endfinally*/];
            case 5: return [2 /*return*/];
        }
    });
}); };
var handleCancelTask = function (taskId) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, err_6;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                userId = (_a = systemContext === null || systemContext === void 0 ? void 0 : systemContext.currentUser) === null || _a === void 0 ? void 0 : _a.id;
                if (!selfNavigationEngine || !userId) {
                    alert("SelfNavigationEngine module not initialized or user not logged in.");
                    return [2 /*return*/];
                }
                if (!confirm("Are you sure you want to cancel this task?"))
                    return [2 /*return*/];
                console.log("Attempting to cancel task: ".concat(taskId));
                // Simulate recording user action
                authorityForgingEngine === null || authorityForgingEngine === void 0 ? void 0 : authorityForgingEngine.recordAction({
                    type: 'web:tasks:cancel',
                    details: { taskId: taskId },
                    context: { platform: 'web', page: 'tasks' },
                    user_id: userId, // Associate action with user
                });
                setIsCancelling(taskId); // Indicate which task is cancelling
                setError(null); // Clear previous errors
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, 4, 5]);
                // Call the SelfNavigationEngine method to cancel the task
                return [4 /*yield*/, selfNavigationEngine.cancelTask(taskId, userId)];
            case 2:
                // Call the SelfNavigationEngine method to cancel the task
                _b.sent(); // Pass taskId, userId
                return [3 /*break*/, 5];
            case 3:
                err_6 = _b.sent();
                console.error('Error cancelling task:', err_6);
                setError("Failed to cancel task: ".concat(err_6.message));
                return [3 /*break*/, 5];
            case 4:
                setIsCancelling(null); // State updated by event listener, but reset local flag
                return [7 /*endfinally*/];
            case 5: return [2 /*return*/];
        }
    });
}); };
// --- End New ---
// --- New: Handle Link Task to KR ---
var handleOpenLinkKrModal = function (task) {
    setShowLinkKrModal(task);
    setSelectedKrToLink(''); // Clear previous selection
    // Available goals are fetched on page load
    setLinkKrError(null); // Clear previous errors
};
var handleCloseLinkKrModal = function () {
    setShowLinkKrModal(null);
    setSelectedKrToLink('');
    setLinkKrError(null);
};
var handleLinkTaskToKr = function () { return __awaiter(void 0, void 0, void 0, function () {
    var userId, updatedKr, err_7;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                userId = (_a = systemContext === null || systemContext === void 0 ? void 0 : systemContext.currentUser) === null || _a === void 0 ? void 0 : _a.id;
                if (!selfNavigationEngine || !userId || !showLinkKrModal || !selectedKrToLink) {
                    alert("SelfNavigationEngine module not initialized, user not logged in, or task/KR not selected.");
                    return [2 /*return*/];
                }
                setIsLinkingKr(true);
                setLinkKrError(null);
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, 4, 5]);
                return [4 /*yield*/, selfNavigationEngine.linkTaskToKeyResult(showLinkKrModal.id, selectedKrToLink, userId)];
            case 2:
                updatedKr = _b.sent();
                if (updatedKr) {
                    alert("Task \"".concat(showLinkKrModal.description, "\" linked to Key Result \"").concat(updatedKr.description, "\" successfully!"));
                    console.log('Task linked to KR:', showLinkKrModal.id, '->', updatedKr.id);
                    handleCloseLinkKrModal(); // Close modal
                    // State update handled by realtime listener (KR update event)
                    // Simulate recording user action
                    authorityForgingEngine === null || authorityForgingEngine === void 0 ? void 0 : authorityForgingEngine.recordAction({
                        type: 'web:tasks:link_to_kr',
                        details: { taskId: showLinkKrModal.id, krId: updatedKr.id },
                        context: { platform: 'web', page: 'tasks' },
                        user_id: userId, // Associate action with user
                    });
                }
                else {
                    setLinkKrError('Failed to link task to Key Result.');
                }
                return [3 /*break*/, 5];
            case 3:
                err_7 = _b.sent();
                console.error('Error linking task to KR:', err_7);
                setLinkKrError("Failed to link task: ".concat(err_7.message));
                return [3 /*break*/, 5];
            case 4:
                setIsLinkingKr(false);
                return [7 /*endfinally*/];
            case 5: return [2 /*return*/];
        }
    });
}); };
var handleUnlinkTaskFromKr = function (task) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, updatedKr, err_8;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                userId = (_a = systemContext === null || systemContext === void 0 ? void 0 : systemContext.currentUser) === null || _a === void 0 ? void 0 : _a.id;
                if (!selfNavigationEngine || !userId || !task.linked_kr_id) {
                    alert("SelfNavigationEngine module not initialized, user not logged in, or task is not linked to a KR.");
                    return [2 /*return*/];
                }
                if (!confirm("Are you sure you want to unlink this task from its Key Result?"))
                    return [2 /*return*/];
                setIsLinkingKr(true); // Reuse state for simplicity
                setError(null); // Clear main error
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, 4, 5]);
                return [4 /*yield*/, selfNavigationEngine.unlinkTaskFromKeyResult(task.id, task.linked_kr_id, userId)];
            case 2:
                updatedKr = _b.sent();
                if (updatedKr) {
                    alert("Task \"".concat(task.description, "\" unlinked from Key Result successfully!"));
                    console.log('Task unlinked from KR:', task.id, '->', updatedKr.id);
                    // State update handled by realtime listener (KR update event)
                    // Simulate recording user action
                    authorityForgingEngine === null || authorityForgingEngine === void 0 ? void 0 : authorityForgingEngine.recordAction({
                        type: 'web:tasks:unlink_from_kr',
                        details: { taskId: task.id, krId: updatedKr.id },
                        context: { platform: 'web', page: 'tasks' },
                        user_id: userId, // Associate action with user
                    });
                }
                return [3 /*break*/, 5];
            case 3:
                err_8 = _b.sent();
                console.error('Error unlinking task from KR:', err_8);
                setError("Failed to unlink task: ".concat(err_8.message));
                alert("Failed to unlink task: ".concat(err_8.message));
                return [3 /*break*/, 5];
            case 4:
                setIsLinkingKr(false);
                return [7 /*endfinally*/];
            case 5: return [2 /*return*/];
        }
    });
}); };
// --- End New ---
// Ensure user is logged in before rendering content
if (!(systemContext === null || systemContext === void 0 ? void 0 : systemContext.currentUser)) {
    // This case should ideally be handled by ProtectedRoute, but as a fallback:
    return (<div className="container mx-auto p-4 flex justify-center">
               <div className="bg-neutral-800/50 p-8 rounded-lg shadow-xl w-full max-w-md text-center text-neutral-300">
                   <p>Please log in to view your tasks.</p>
               </div>
            </div>);
}
return (<div className="container mx-auto p-4">
      <div className="bg-neutral-800/50 p-6 rounded-lg shadow-xl">
        <h2 className="text-3xl font-bold text-blue-400 mb-6">Task Management (自我導航)</h2>
        <p className="text-neutral-300 mb-8">Manage your automated tasks and track their execution progress.</p>

        {/* Form for creating new tasks */}
        {!isCreatingTask && !editingTask && ( // Only show create button if not creating or editing
    <div className="mb-8 p-4 bg-neutral-700/50 rounded-lg">
                 <h3 className="text-xl font-semibold text-blue-300 mb-3">Create New Task</h3>
                 <button className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition disabled:opacity-50" onClick={function () { setIsCreatingTask(true); setError(null); }} disabled={isSavingTask || isUpdatingTask || isStarting !== null || isPausing !== null || isResuming !== null || isCancelling !== null || isDeleting !== null}>
                     <PlusCircle size={20} className="inline-block mr-2"/> Create Task
                 </button>
            </div>)}

        {isCreatingTask && !editingTask && ( // Show create form if creating and not editing
    <div className="mb-8 p-4 bg-neutral-700/50 rounded-lg">
                 <h3 className="text-xl font-semibold text-blue-300 mb-3">New Task</h3>
                 <form onSubmit={handleCreateTask}>
                    <div className="mb-4">
                        <label htmlFor="newTaskDescription" className="block text-neutral-300 text-sm font-semibold mb-2">Description:</label>
                        <input id="newTaskDescription" type="text" className="w-full p-2 rounded-md bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500" value={newTaskDescription} onChange={function (e) { return setNewTaskDescription(e.target.value); }} placeholder="Enter task description (e.g., Sync GitHub Repo)" disabled={isSavingTask} required/>
                    </div>
                     {/* Task Steps for New Task */}
                     <div className="mb-4 p-3 bg-neutral-600/50 rounded-md">
                         <h4 className="text-neutral-300 text-sm font-semibold mb-2">Steps:</h4>
                         <ul className="space-y-3">
                             {newTaskSteps.map(function (step, index) { return (<li key={index} className="p-3 bg-neutral-700/50 rounded-md border-l-2 border-blue-600">
                                     <div className="flex justify-between items-center mb-2">
                                         <span className="text-sm font-medium text-neutral-300">Step {index + 1}</span>
                                          <button type="button" onClick={function () { return handleRemoveStepFromNewTask(index); }} className="text-red-400 hover:text-red-600 transition disabled:opacity-50" disabled={isSavingTask}>
                                              <MinusCircle size={18}/>
                                          </button>
                                     </div>
                                     <div className="mb-2">
                                         <label htmlFor={"new-step-desc-".concat(index)} className="block text-neutral-400 text-xs font-semibold mb-1">Description:</label>
                                         <input id={"new-step-desc-".concat(index)} type="text" className="w-full p-1 rounded-md bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm" value={step.description} onChange={function (e) {
                var updatedSteps = __spreadArray([], newTaskSteps, true);
                updatedSteps[index].description = e.target.value;
                setNewTaskSteps(updatedSteps);
            }} placeholder="e.g., Pull latest changes" disabled={isSavingTask} required/>
                                     </div>
                                      {/* --- Modified: Use ActionEditor component here --- */}
                                      <div className="mb-2">
                                         <h5 className="block text-neutral-400 text-xs font-semibold mb-1">Action:</h5>
                                         <ActionEditor action={step.action} onChange={function (newAction) { return handleNewTaskStepChange(index, newAction); }} disabled={isSavingTask} availableRunes={availableRunes} availableAbilities={availableAbilities} availableGoals={availableGoals} // Pass available goals
        />
                                      </div>
                                      {/* --- End Modified --- */}
                                </li>); })}
                         </ul>
                          <button type="button" onClick={handleAddStepToNewTask} className="mt-4 px-4 py-2 text-sm bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition disabled:opacity-50" disabled={isSavingTask}>
                              <PlusCircle size={16} className="inline-block mr-1"/> Add Step
                          </button>
                     </div>

                    <button type="submit" className="px-6 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed" disabled={isSavingTask || !newTaskDescription.trim() || newTaskSteps.length === 0}>
                        {isSavingTask ? 'Creating...' : 'Save Task'}
                    </button>
                     <button type="button" onClick={handleCancelCreate} className="px-6 py-2 bg-neutral-600 text-white font-semibold rounded-md hover:bg-neutral-700 transition" disabled={isSavingTask}>
                        Cancel
                    </button>
               </form>
                 {error && isSavingTask === false && ( // Show create error only after it finishes
        <p className="text-red-400 text-sm mt-4">Error: {error}</p>)}
            </div>)}

        {/* Form for editing a task */}
        {editingTask && ( // Show edit form if editing
    <div className="mb-8 p-4 bg-neutral-700/50 rounded-lg">
                 <h3 className="text-xl font-semibold text-blue-300 mb-3">Edit Task: {editingTask.description}</h3>
                 <form onSubmit={handleUpdateTask}>
                    <div className="mb-4">
                        <label htmlFor="editingTaskDescription" className="block text-neutral-300 text-sm font-semibold mb-2">Description:</label>
                        <input id="editingTaskDescription" type="text" className="w-full p-2 rounded-md bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500" value={editingTaskDescription} onChange={function (e) { return setEditingTaskDescription(e.target.value); }} placeholder="Edit task description" disabled={isUpdatingTask} required/>
                    </div>
                    {/* TODO: Add UI for editing steps (complex: add/remove/update steps) */}
                    {editingTask.steps && editingTask.steps.length > 0 && ((<div className="mb-4 p-3 bg-neutral-600/50 rounded-md">
                             <h4 className="text-neutral-300 text-sm font-semibold mb-2">Steps (View Only in MVP Edit):</h4>
                             <ul className="space-y-2">
                                 {editingTask.steps.map(function (step, index) { return (<li key={step.id} className={"p-3 rounded-md border-l-2 ".concat(step.status === 'completed' ? 'border-green-600' : step.status === 'failed' ? 'border-red-600' : step.status === 'in-progress' ? 'border-blue-600' : 'border-neutral-600', " bg-neutral-700/50")}>
                                         <p className="text-sm font-medium text-neutral-300">Step {index + 1}: {step.description}</p>
                                         <p className="text-neutral-400 text-xs">Status: {step.status} | Action: {step.action.type}</p>
                                     </li>); })}\
                             </ul>
                         </div>))}\
                     {editingTask.steps && editingTask.steps.length === 0 && ((<div className="mb-4 p-3 bg-neutral-600/50 rounded-md">
                              <p className="text-neutral-400 text-sm">No steps defined for this task yet.</p>
                          </div>))}\

                    <div className="flex gap-4">
                        <button type="submit" className="px-6 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed" disabled={isUpdatingTask || !editingTaskDescription.trim()}>
                            {isUpdatingTask ? 'Saving...' : 'Save Changes'}
                        </button>
                         <button type="button" onClick={handleCancelEdit} className="px-6 py-2 bg-neutral-600 text-white font-semibold rounded-md hover:bg-neutral-700 transition" disabled={isUpdatingTask}>
                            Cancel
                        </button>
                    </div>
                 {error && isUpdatingTask === false && ( // Show save error only after it finishes
        <p className="text-red-400 text-sm mt-4">Error: {error}</p>)}\
               </form>
            </div>)}\


        {/* Tasks List */}
        <div className="p-4 bg-neutral-700/50 rounded-lg">
            <h3 className="text-xl font-semibold text-blue-300 mb-3">Your Tasks ({tasks.length})</h3>
            {loading && !isSavingTask && !isUpdatingTask ? ( // Show loading only if not currently saving/updating
    <p className="text-neutral-400">Loading tasks...</p>) : error && !isCreatingTask && !editingTask ? ( // Show main error if not in create/edit mode
    <p className="text-red-400">Error: {error}</p>) : tasks.length === 0 ? (<p className="text-neutral-400">No tasks found yet. Create one using the form above.</p>) : (<ul className="space-y-4">
                {tasks.map(function (task) { return (<li key={task.id} className={"bg-neutral-600/50 p-4 rounded-md border-l-4 ".concat(getTaskStatusColor(task.status).replace('text-', 'border-'))}>
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <Target size={20} className="text-blue-400"/>
                            <h4 className={"font-semibold mb-1 ".concat(getTaskStatusColor(task.status))}>{task.description}</h4>
                        </div>
                         <button onClick={function () { return toggleExpandTask(task.id); }} className="text-neutral-400 hover:text-white transition">
                            {expandedTasks[task.id] ? <ChevronUp size={20}/> : <ChevronDown size={20}/>}\
                         </button>
                    </div>
                    <p className="text-neutral-300 text-sm">Status: <span className={getTaskStatusColor(task.status)}>{task.status}</span></p>
                    {task.linked_kr_id && (<p className="text-neutral-300 text-sm flex items-center gap-1">
                             <Target size={14}/> Linked to KR: {task.linked_kr_id}
                         </p>)}
                    {task.error && task.status === 'failed' && (<p className="text-red-400 text-sm mt-1">Error: {task.error}</p>)}
                    <small className="text-neutral-400 text-xs block mt-1">
                        ID: {task.id} | Created: {new Date(task.creation_timestamp).toLocaleString()}
                         {task.start_timestamp && " | Started: ".concat(new Date(task.start_timestamp).toLocaleString())}\
                         {task.completion_timestamp && " | Finished: ".concat(new Date(task.completion_timestamp).toLocaleString())}\
                         {task.status === 'in-progress' && " | Current Step: ".concat(task.current_step_index + 1, "/").concat(task.steps.length)}\
                    </small>

                    {/* Task Steps (Collapsible) */}\
                    {expandedTasks[task.id] && task.steps && task.steps.length > 0 && (())}\
                        <div className="mt-4 border-t border-neutral-600 pt-4">
                            <h5 className="text-neutral-300 text-sm font-semibold mb-2">Steps:</h5>
                            <ul className="space-y-2">
                                {task.steps.map(function (step, index) { return (<li key={step.id} className={"p-3 rounded-md border-l-2 ".concat(step.status === 'completed' ? 'border-green-600' : step.status === 'failed' ? 'border-red-600' : step.status === 'in-progress' ? 'border-blue-600' : 'border-neutral-600', " bg-neutral-700/50")}>
                                        <p className="text-sm font-medium text-neutral-300">Step {index + 1}: {step.description}</p>
                                        <p className="text-neutral-400 text-xs">Status: {step.status} | Action: {step.action.type}</p>
                                         {step.error && step.status === 'failed' && (<p className="text-red-400 text-xs mt-1">Error: {step.error}</p>)}\
                                         {/* TODO: Display step result if available */}\
                                    </li>); })}\
                            </ul>
                        </div>
                    ))}\
                     {expandedTasks[task.id] && (!task.steps || task.steps.length === 0) && (())}\
                          <div className="mt-4 border-t border-neutral-600 pt-4">
                              <p className="text-neutral-400 text-sm">No steps defined for this task yet.</p>
                          </div>
                     ))}\

                    {/* Task Actions */}\
                    <div className="mt-4 flex flex-wrap gap-2"> {/* Use flex-wrap for smaller screens */}\
                         {/* Start Button */}\
                         {(task.status === 'idle' || task.status === 'completed' || task.status === 'failed' || task.status === 'cancelled') && (())}\
                             <button className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed" onClick={function () { return handleStartTask(task.id); }} disabled={isStarting !== null || isPausing !== null || isResuming !== null || isCancelling !== null || isDeleting !== null}/>\
                             >
                                 {isStarting === task.id ? <Loader2 size={16} className="inline-block mr-1 animate-spin"/> : <Play size={16} className="inline-block mr-1"/>})}\
                                 {isStarting === task.id ? 'Starting...' : 'Start'}\
                             </button>
                         ))}\
                          {/* Pause Button */}\
                         {task.status === 'in-progress' && (())}\
                             <button className="px-3 py-1 text-sm bg-yellow-600 text-white rounded hover:bg-yellow-700 transition disabled:opacity-50 disabled:cursor-not-allowed" onClick={function () { return handlePauseTask(task.id); }} disabled={isStarting !== null || isPausing !== null || isResuming !== null || isCancelling !== null || isDeleting !== null}/>\
                             >
                                 {isPausing === task.id ? <Loader2 size={16} className="inline-block mr-1 animate-spin"/> : <Pause size={16} className="inline-block mr-1"/>})}\
                                 {isPausing === task.id ? 'Pausing...' : 'Pause'}\
                             </button>); })}\
                          {/* Resume Button */}\
                         {task.status === 'paused' && (())}\
                             <button className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed" onClick={function () { return handleResumeTask(task.id); }} disabled={isStarting !== null || isPausing !== null || isResuming !== null || isCancelling !== null || isDeleting !== null}/>\
                             >
                                 {isResuming === task.id ? <Loader2 size={16} className="inline-block mr-1 animate-spin"/> : <Play size={16} className="inline-block mr-1"/>})}\
                                 {isResuming === task.id ? 'Resuming...' : 'Resume'}\
                             </button>)})}\
                          {/* Cancel Button */}\
                         {(task.status === 'pending' || task.status === 'in-progress' || task.status === 'paused') && (())}\
                             <button className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed" onClick={function () { return handleCancelTask(task.id); }} disabled={isStarting !== null || isPausing !== null || isResuming !== null || isCancelling !== null || isDeleting !== null}/>\
                             >
                                 {isCancelling === task.id ? <Loader2 size={16} className="inline-block mr-1 animate-spin"/> : <XCircle size={16} className="inline-block mr-1"/>})}\
                                 {isCancelling === task.id ? 'Cancelling...' : 'Cancel'}\
                             </button>
                         ))}\
                         {/* Edit Button */}\
                         <button className="px-3 py-1 text-sm bg-yellow-600 text-white rounded hover:bg-yellow-700 transition disabled:opacity-50 disabled:cursor-not-allowed" onClick={function () { return handleEditTaskClick(task); }} disabled={isStarting !== null || isPausing !== null || isResuming !== null || isCancelling !== null || isDeleting !== null || !!editingTask}/>\
                         >
                            <Edit size={16} className="inline-block mr-1"/> Edit
                         </button>
                         {/* Delete Button */}\
                         <button className="px-3 py-1 text-sm bg-red-800 text-white rounded hover:bg-red-900 transition disabled:opacity-50 disabled:cursor-not-allowed" onClick={function () { return handleDeleteTask(task.id); }} disabled={isStarting !== null || isPausing !== null || isResuming !== null || isCancelling !== null || isDeleting !== null || task.status === 'in-progress'}/>\
                         >
                            {isDeleting === task.id ? <Loader2 size={16} className="inline-block mr-1 animate-spin"/> : <Trash2 size={16} className="inline-block mr-1"/>})}\
                            {isDeleting === task.id ? 'Deleting...' : 'Delete'}
                         </button>) /* New: Link/Unlink to KR Button */;
{ /* New: Link/Unlink to KR Button */ }
{
    task.linked_kr_id ? (()) : ;
    <button className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed" onClick={function () { return handleUnlinkTaskFromKr(task); }} disabled={isStarting !== null || isPausing !== null || isResuming !== null || isCancelling !== null || isDeleting !== null || isLinkingKr}>
                                 {isLinkingKr ? <Loader2 size={16} className="inline-block mr-1 animate-spin"/> : <Unlink size={16} className="inline-block mr-1"/>})}\
                                 {isLinkingKr ? 'Unlinking...' : 'Unlink KR'}\
                             </button>;
    (());
    <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed" onClick={function () { return handleOpenLinkKrModal(task); }} disabled={isStarting !== null || isPausing !== null || isResuming !== null || isCancelling !== null || isDeleting !== null || isLinkingKr || availableGoals.length === 0}>
                                 {isLinkingKr ? <Loader2 size={16} className="inline-block mr-1 animate-spin"/> : <LinkIcon size={16} className="inline-block mr-1"/>})}\
                                 {isLinkingKr ? 'Linking...' : 'Link to KR'}\
                             </button>;
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                 <div className="bg-neutral-800 p-8 rounded-lg shadow-xl w-full max-w-md max-h-[90%] flex flex-col"> {/* Added flex-col and max-height */}\
                     <div className="flex justify-between items-center mb-4">
                         <h3 className="text-xl font-semibold text-blue-300">Link Task to Key Result</h3>
                         <button type="button" onClick={handleCloseLinkKrModal} className="text-neutral-400 hover:text-white transition" disabled={isLinkingKr}>
                             <XCircle size={24}/>
                         </button>
                     </div>
                     <p className="text-neutral-300 text-sm mb-4">Select a Key Result to link Task \"{showLinkKrModal.description}\" to.</p>

                     {availableGoals.length === 0 ? (<div className="flex-grow text-neutral-400 overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-700 pr-2">
                             <p>No goals with Key Results found. Create goals on the Goals page first.</p>
                         </div>) : (<div className="flex-grow overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-700 space-y-3 pr-2"> {/* Added pr-2 for scrollbar space */}\
                             {availableGoals.map(function (goal) { return (goal.key_results && goal.key_results.length > 0 && (())); })}\
                                     <div key={goal.id} className="p-3 bg-neutral-700/50 rounded-md border-l-2 border-blue-600 space-y-2">
                                         <h4 className="text-neutral-300 text-sm font-semibold">Goal: {goal.description}</h4>
                                         <ul className="space-y-2">
                                             {goal.key_results.map(function (kr) { return (<li key={kr.id} className="flex items-start gap-3 bg-neutral-800 p-2 rounded-md">
                                                     <input type="radio" id={"kr-".concat(kr.id)} name="selectKrToLink" className="form-radio h-4 w-4 text-blue-600 rounded border-neutral-600 bg-neutral-800 focus:ring-blue-500 mt-1" value={kr.id} checked={selectedKrToLink === kr.id} onChange={function (e) { return setSelectedKrToLink(e.target.value); }} disabled={isLinkingKr}/>
                                                     <label htmlFor={"kr-".concat(kr.id)} className="flex-grow text-neutral-300 text-sm cursor-pointer">
                                                         <span className="font-semibold">KR:</span> {kr.description}
                                                         <span className="block text-neutral-400 text-xs mt-1">Progress: {kr.current_value} / {kr.target_value} {kr.unit}</span>
                                                     </label>
                                                 </li>); })}\
                                         </ul>
                                     </div>
                                 ))\
                             ))}\
                         </div>)}\

                     {linkKrError && !isLinkingKr && ( // Show error only after linking finishes
        <p className="text-red-400 text-sm mt-4">Error: {linkKrError}</p>)}\

                     <div className="flex gap-4 justify-end mt-4 flex-shrink-0"> {/* Added flex-shrink-0 */}\
                         <button type="button" onClick={handleCloseLinkKrModal} className="px-6 py-2 bg-neutral-600 text-white font-semibold rounded-md hover:bg-neutral-700 transition" disabled={isLinkingKr}>
                             Cancel
                         </button>
                         <button type="button" onClick={handleLinkTaskToKr} className="px-6 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed" disabled={isLinkingKr || !selectedKrToLink}>
                             {isLinkingKr ? 'Linking...' : 'Link Task'}
                         </button>
                     </div>
                 </div>
             </div>;
}
{ /* End New */ }
div >
;
div >
;
;
;
exports.default = Tasks;
""(templateObject_2 || (templateObject_2 = __makeTemplateObject([""], [""])));
var templateObject_1, templateObject_2;
