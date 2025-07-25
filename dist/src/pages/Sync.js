"use strict";
`` `typescript
// src/pages/Sync.tsx
// Sync Page
// Displays synchronization status and allows triggering sync operations.
// --- New: Add UI for viewing sync status and triggering sync ---\
// --- New: Add UI for triggering data type sync ---\
// --- New: Add UI for simulating Mobile Git sync ---\
// --- Modified: Display more detailed sync status and queue size ---\
// --- Modified: Add UI elements related to conflict resolution and background sync concepts ---\
// --- Modified: Update UI to reflect persistent queue concept ---\


import React, { useEffect, useState } from 'react';
import { SyncService } from '../modules/sync/SyncService';
import { AuthorityForgingEngine } from '../core/authority/AuthorityForgingEngine'; // Use for action recording
import { RefreshCcw, GitPullRequest, GitPush, GitMerge, Loader2, Info } from 'lucide-react'; // Import icons


// Define data types relevant to sync status display (should match SyncService's internal map keys)
const SYNCHRONIZABLE_DATA_TYPES = [
    'memoryEngine', // Knowledge Records
    'authorityForgingEngine', // User Actions, Abilities
    'selfNavigationEngine', // Tasks, Task Steps, Agentic Flows
    'runeEngraftingCenter', // Runes
    'goalManagementService', // Goals, Key Results
    'notificationService', // Notifications
    'analyticsService', // Analytics data (might be derived, sync might push local analytics)
    // Add other data types managed by services that need syncing
] as const; // Use 'as const' to create a tuple of literal strings

type SynchronizableDataType = typeof SYNCHRONIZABLE_DATA_TYPES[number];
type SyncStatus = 'idle' | 'syncing' | 'error' | 'unknown'; // Define SyncStatus type


// Access core modules from the global window object (for MVP simplicity)
// In a real app, use React Context or dependency injection
declare const window: any;
const syncService: SyncService = window.systemContext?.syncService; // The Sync Service (\u540c\u6b65\u670d\u52d9)
const authorityForgingEngine: any = window.systemContext?.authorityForgingEngine; // Use any for action recording (\u6b0a\u80fd\u935b\u9020)
const systemContext: any = window.systemContext; // Access the full context for currentUser


const Sync: React.FC = () => {
  const [overallSyncStatus, setOverallSyncStatus] = useState<SyncStatus>('unknown'); // Use SyncStatus type
  const [overallSyncStep, setOverallSyncStep] = useState<string | undefined>(undefined); // New state for overall step
  const [moduleSyncStatuses, setModuleSyncStatuses] = useState<Record<SynchronizableDataType, { status: SyncStatus, step?: string, timestamp?: number | undefined }>>(() => { // Use SyncStatus type, added step
      const initialStatuses: any = {};
      SYNCHRONIZABLE_DATA_TYPES.forEach(type => {\
          initialStatuses[type] = { status: 'unknown', step: undefined, timestamp: undefined };\
      });\
      return initialStatuses;\
  });\
  const [localQueueSize, setLocalQueueSize] = useState(0);\
  const [isSyncingAll, setIsSyncingAll] = useState(false);\
  const [isSimulatingGit, setIsSimulatingGit] = useState(false); // State for simulating Git sync\
  const [error, setError] = useState<string | null>(null);\
\
  // --- New: State for Data Type Sync ---\
  const [selectedDataType, setSelectedDataType] = useState<SynchronizableDataType | ''>('');\
  const [selectedDirection, setSelectedDirection] = useState<'up' | 'down' | 'bidirectional'>('bidirectional');\
  const [isSyncingDataType, setIsSyncingDataType] = useState(false);\
  // --- End New ---\
\
\
  const updateSyncStatuses = () => {\
      if (syncService) {\
          setOverallSyncStatus(syncService.getSyncStatus('system') || 'unknown');\
          setOverallSyncStep(syncService.getSyncStep('system')); // Get overall step\
          setLocalQueueSize(syncService.getLocalQueueSize()); // Get queue size\
          const updatedModuleStatuses: any = {};\
          SYNCHRONIZABLE_DATA_TYPES.forEach(type => {\
              updatedModuleStatuses[type] = {\
                  status: syncService.getSyncStatus(type) || 'unknown',\
                  step: syncService.getSyncStep(type), // Get module step\
                  timestamp: syncService.getLastSyncTimestamp(type),\
              };\
          });\
          setModuleSyncStatuses(updatedModuleStatuses);\
      } else {\
          setOverallSyncStatus('unknown');\
          setOverallSyncStep(undefined);\
          setLocalQueueSize(0);\
          const updatedModuleStatuses: any = {};\
           SYNC_DATA_TYPES.forEach(type => {\
              updatedStatuses[type] = { status: 'unknown', step: undefined, timestamp: undefined };\
          });\
          setModuleSyncStatuses(updatedStatuses);\
      }\
  };\
\
\
  useEffect(() => {\
    // Fetch initial data and set up listeners when the component mounts or user changes\
    if (systemContext?.currentUser?.id) {\
      updateSyncStatuses(); // Initial sync status check\
\
      // Subscribe to sync status changes\
      let unsubscribeSyncStarted: (() => void) | undefined;\
      let unsubscribeSyncCompleted: (() => void) | undefined;\
      let unsubscribeSyncError: (() => void) | undefined;\
      let unsubscribeSyncStatusUpdate: (() => void) | undefined;\
      let unsubscribeMobileGitSyncStatus: (() => void) | undefined;\
\
\
      if (syncService?.context?.eventBus) {\
          const eventBus = syncService.context.eventBus;\
\
           unsubscribeSyncStarted = eventBus.subscribe('sync_started', (payload: any) => {\
               if (payload.userId === systemContext?.currentUser?.id) {\
                   console.log('Sync page received sync_started event.');\
                   updateSyncStatuses(); // Update all statuses\
                   // Reset specific sync states if the started event matches\
                   if (payload.dataType === 'system') {\
                       setIsSyncingAll(true);\
                   } else {\
                       // If a specific data type sync starts, update its state\
                       // This requires tracking sync state per data type, which is complex.\
                       // For MVP, we only track the overall 'isSyncingAll' and 'isSyncingDataType' flags.\
                       // Let's just set the specific flag if the started event matches the selected type/direction.\
                       if (payload.dataType === selectedDataType && payload.direction === selectedDirection) {\
                            setIsSyncingDataType(true);\
                       }\
                   }\
               }\
           });\
            unsubscribeSyncCompleted = eventBus.subscribe('sync_completed', (payload: any) => {\
               if (payload.userId === systemContext?.currentUser?.id) {\
                   console.log('Sync page received sync_completed event.');\
                   updateSyncStatuses(); // Update all statuses\
                   // Reset specific sync states if the completed event matches\
                   if (payload.dataType === 'system') {\
                       setIsSyncingAll(false);\
                   } else {\
                        if (payload.dataType === selectedDataType && payload.direction === selectedDirection) {\
                            setIsSyncingDataType(false);\
                       }\\\
                   }\\\n               }\\\n           });\\\
            unsubscribeSyncError = eventBus.subscribe('sync_error', (payload: any) => {\\\
               if (payload.userId === systemContext?.currentUser?.id) {\\\
                   console.log('Sync page received sync_error event.');\\\
                   updateSyncStatuses(); // Update all statuses\\\
                    // Reset specific sync states if the error event matches\\\
                   if (payload.dataType === 'system') {\\\
                       setIsSyncingAll(false);\\\
                       setError(`;
Full;
sync;
failed: $;
{
    payload.error;
}
`); // Display overall error\\\
                   } else {\\\
                        if (payload.dataType === selectedDataType && payload.direction === selectedDirection) {\\\
                            setIsSyncingDataType(false);\\\
                            setError(`;
$;
{
    payload.dataType;
}
sync;
failed: $;
{
    payload.error;
}
`); // Display data type error\\\
                       }\\\n                   }\\\n               }\\\n           });\\\
            // Listen for detailed status updates (including queue size changes)\\\
             unsubscribeSyncStatusUpdate = eventBus.subscribe('sync_status_update', (payload: any) => {\\\
                 if (payload.userId === systemContext?.currentUser?.id) {\\\
                     console.log('Sync page received sync_status_update event.');\\\
                     // Only update specific status/step if needed, or just trigger full status update\\\
                     updateSyncStatuses(); // Update all statuses including queue size\\\
                 }\\\n             });\\\
\
            // Listen for mobile git sync status updates specifically\\\
             unsubscribeMobileGitSyncStatus = eventBus.subscribe('mobile_git_sync_status', (payload: any) => {\\\
                 if (payload.userId === systemContext?.currentUser?.id) {\\\
                     console.log('Sync page received mobile_git_sync_status event:', payload);\\\
                     // Update UI state based on Git sync status\\\
                     if (payload.status === 'syncing') {\\\
                         setIsSimulatingGit(true);\\\
                     } else {\\\
                         setIsSimulatingGit(false);\\\
                     }\\\
                     // Optionally display the step message somewhere\\\
                     // setError(payload.status === 'error' ? payload.step : null); // Or handle Git errors separately\\\
                 }\\\n             });\\\
\
      }\\\n\\\n\\\n      return () => {\\\
        // Unsubscribe on component unmount\\\
        unsubscribeSyncStarted?.();\\\
        unsubscribeSyncCompleted?.();\\\
        unsubscribeSyncError?.();\\\
        unsubscribeSyncStatusUpdate?.();\\\
        unsubscribeMobileGitSyncStatus?.();\\\
      };\\\
\
    } else {\\\
        // Reset state if user logs out\\\
        setOverallSyncStatus('unknown');\\\
        setOverallSyncStep(undefined);\\\
        setLocalQueueSize(0);\\\
        const initialStatuses: any = {};\\\
           SYNC_DATA_TYPES.forEach(type => {\\\
              initialStatuses[type] = { status: 'unknown', step: undefined, timestamp: undefined };\\\
          });\\\
        setModuleSyncStatuses(initialStatuses);\\\
        setIsSyncingAll(false);\\\
        setIsSimulatingGit(false);\\\
        setError(null);\\\
        // Reset data type sync state\\\
        setSelectedDataType('');\\\
        setSelectedDirection('bidirectional');\\\
        setIsSyncingDataType(false);\\\
    }\\\n\\\n  }, [systemContext?.currentUser?.id, syncService, selectedDataType, selectedDirection]); // Re-run effect when user ID, syncService, or data type/direction changes\\\
\\\n\\\n  const handleSyncAll = async () => {\\\
      const userId = systemContext?.currentUser?.id;\\\
      if (!syncService || !userId) {\\\
          alert(\\\\\\\"SyncService module not initialized or user not logged in.\\\");\\\
          return;\\\
      }\\\n      console.log(`;
Attempting;
to;
sync;
all;
data;
for (user; ; )
    : $;
{
    userId;
}
`);\\\
       // Simulate recording user action (Part of \\\\u516d\\\\u5f0f\\\\u5967\\\\u7fa9: \\\\u89c0\\\\u5bdf)\\\
        authorityForgingEngine?.recordAction({\\\n            type: 'web:sync:sync_all',\\\
            details: {},\\\
            context: { platform: 'web', page: 'sync' },\\\
            user_id: userId, // Associate action with user\\\
        });\\\
\\\n      setIsSyncingAll(true);\\\
      setError(null);\\\
      try {\\\
          // Trigger full sync (Part of \\\\u96d9\\\\u5410\\\\u540c\\\\u6b65\\\\u9818\\\\u57df)\\\
          await syncService.syncAllData(userId); // Pass user ID\\\
          // Status and logs will be updated by listeners\\\
      } catch (err: any) {\\\
          console.error('Error during full sync:', err);\\\
          // Error is already set by updateSyncStatuses on sync_error event\\\
          // setError(`;
Full;
sync;
failed: $;
{
    err.message;
}
`);\\\
      } finally {\\\
          // setIsSyncingAll is reset by the sync_completed/sync_error event listeners for 'system'\\\
      }\\\n  };\\\
\\\n   const handleSimulateGit = async (direction: 'pull' | 'push' | 'bidirectional') => {\\\
       const userId = systemContext?.currentUser?.id;\\\
       if (!syncService || !userId) {\\\
           alert(\\\\\\\"SyncService module not initialized or user not logged in.\\\");\\\
           return;\\\
       }\\\n       console.log(`;
Attempting;
to;
simulate;
Git;
$;
{
    direction;
}
for (user; ; )
    : $;
{
    userId;
}
`);\\\
        // Simulate recording user action (Part of \\\\u516d\\\\u5f0f\\\\u5967\\\\u7fa9: \\\\u89c0\\\\u5bdf)\\\
        authorityForgingEngine?.recordAction({\\\n            type: `;
web: sync: simulate_git_$;
{
    direction;
}
`,\\\
            details: { direction },\\\
            context: { platform: 'web', page: 'sync' },\\\
            user_id: userId, // Associate action with user\\\
        });\\\
\\\n       setIsSimulatingGit(true); // Indicate simulation is running\\\
       setError(null); // Clear previous errors\\\
       try {\\\
           // Trigger simulated mobile Git sync via SyncService (Part of \\\\u96d9\\\\u5410\\\\u540c\\\\u6b65\\\\u9818\\\\u57df)\\\
           // The SyncService will record a dev log in the KB and publish status events\\\
           await syncService.syncMobileGitRepo(userId, direction, { repoUrl: 'simulated/mobile/repo' }); // Pass user ID and simulated details\\\
           // Status will be updated by the 'mobile_git_sync_status' listener\\\
       } catch (err: any) {\\\
           console.error(`;
Error;
simulating;
Git;
$;
{
    direction;
}
`, err);\\\
           setError(`;
Simulated;
Git;
$;
{
    direction;
}
failed: $;
{
    err.message;
}
`);\\\
       } finally {\\\
           setIsSimulatingGit(false); // Ensure state is reset on error\\\
       }\\\n   };\\\
\\\n    // --- New: Handle Data Type Sync ---\\\n    const handleSyncDataType = async (e: React.FormEvent) => {\\\
        e.preventDefault();\\\
        const userId = systemContext?.currentUser?.id;\\\
        if (!syncService || !userId || !selectedDataType || !selectedDirection) {\\\
            alert(\\\\\\\"SyncService module not initialized, user not logged in, or data type/direction not selected.\\\");\\\
            return;\\\
        }\\\n        console.log(`;
Attempting;
to;
$;
{
    selectedDirection;
}
sync;
data;
type: $;
{
    selectedDataType;
}
for (user; ; )
    : $;
{
    userId;
}
`);\\\
         // Simulate recording user action\\\
        authorityForgingEngine?.recordAction({\\\n            type: 'web:sync:sync_data_type',\\\
            details: { dataType: selectedDataType, direction: selectedDirection },\\\
            context: { platform: 'web', page: 'sync' },\\\
            user_id: userId,\\\
        });\\\
\\\n        setIsSyncingDataType(true); // Indicate this specific sync is running\\\
        setError(null); // Clear previous errors\\\
        try {\\\
            // Trigger data type sync via SyncService\\\
            await syncService.syncDataType(selectedDataType, userId, selectedDirection); // Pass userId, dataType, direction\\\
            // Status will be updated by listeners\\\
        } catch (err: any) {\\\
            console.error(`;
Error;
syncing;
data;
`, err);\\\
            setError(`;
$;
{
    selectedDataType;
}
sync;
failed: $;
{
    err.message;
}
`);\\\
        } finally {\\\
            // setIsSyncingDataType is reset by the sync_completed/sync_error event listeners for the specific data type\\\
        }\\\n    };\\\
    // --- End New ---\\\n\\\n\\\n  // Ensure user is logged in before rendering content\\\
  if (!systemContext?.currentUser) {\\\
       // This case should ideally be handled by ProtectedRoute, but as a fallback:\\\
       return (\\\
            <div className=\\\"container mx-auto p-4 flex justify-center\\\">\\\
               <div className=\\\"bg-neutral-800/50 p-8 rounded-lg shadow-xl w-full max-w-md text-center text-neutral-300\\\">\\\
                   <p>Please log in to view synchronization status.</p>\\\
               </div>\\\
            </div>\\\
       );\\\
  }\\\n\\\n\\\n  return (\\\
    <div className=\\\"container mx-auto p-4\\\">\\\
      <div className=\\\"bg-neutral-800/50 p-6 rounded-lg shadow-xl\\\">\\\
        <h2 className=\\\"text-3xl font-bold text-blue-400 mb-6\\\">Synchronization (\\u540c\\u6b65\\u670d\\u52d9)</h2>\\\
        <p className=\\\"text-neutral-300 mb-8\\\">Monitor and manage data synchronization across your devices and platforms.</p>\\\
\\\n        {/* Overall Synchronization Status */}\\\
        <div className=\\\"mb-8 p-4 bg-neutral-700/50 rounded-lg flex justify-between items-center\\\">\\\
            <div>\\\
                <h3 className=\\\"text-xl font-semibold text-blue-300 mb-1\\\">Overall Synchronization Status</h3>\\\
                <p className=\\\"text-neutral-300 text-sm\\\">\\\
                    Status: <span className={overallSyncStatus === 'syncing' ? 'text-yellow-400' : overallSyncStatus === 'error' ? 'text-red-400' : overallSyncStatus === 'idle' ? 'text-green-400' : 'text-neutral-400'}>{overallSyncStatus.toUpperCase()}</span>\\\
                </p>\\\
                 {overallSyncStep && (\\\
                     <p className=\\\"text-neutral-400 text-xs mt-1\\\">\\\
                         Step: {overallSyncStep}\\\
                     </p>\\\
                 )}\\\
                 {syncService?.getLastSyncTimestamp('system') && ( // Use system timestamp for overall\\\
                    <p className=\\\"text-neutral-400 text-xs mt-1\\\">\\\
                        Last Synced: {new Date(syncService.getLastSyncTimestamp('system')!).toLocaleString()}\\\
                    </p>\\\
                )}\\\
                 {/* Display Queue Size */}\\\
                 <p className=\\\"text-neutral-400 text-xs mt-1 flex items-center gap-1\\\">\\\
                     <Info size={14}/> Local Change Queue: <span className=\\\"font-mono text-blue-300\\\">{localQueueSize}</span> pending items (Persistent) {/* Added Persistent */}\\\
                 </p>\\\
            </div>\\\
             <button\\\n                className=\\\"px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed\\\"\\\n                onClick={handleSyncAll}\\\n                disabled={isSyncingAll || overallSyncStatus === 'syncing'} // Disable if already syncing\\\n             >\\\n                 <RefreshCcw size={18} className={`;
inline - block;
mr - 1;
$;
{
    isSyncingAll || overallSyncStatus === 'syncing' ? 'animate-spin' : '';
}
`} />\\\n                 {isSyncingAll ? 'Syncing All...' : 'Sync All Data Now'}\\\n             </button>\\\
        </div>\\\n\\\n         {/* Module Synchronization Statuses */}\\\n         <div className=\\\"mb-8 p-4 bg-neutral-700/50 rounded-lg\\\">\\\n             <h3 className=\\\"text-xl font-semibold text-blue-300 mb-3\\\">Module Synchronization Statuses</h3>\\\
             {loading ? (\\\n                 <p className=\\\"text-neutral-400\\\">Loading module statuses...</p>\\\
             ) : error && overallSyncStatus !== 'error' ? ( // Only show module error if overall is not already error\\\
                 <p className=\\\"text-red-400\\\">Error: {error}</p>\\\
             ) : (\\\
                 <div className=\\\"grid grid-cols-1 md:grid-cols-2 gap-4\\\">\\\
                     {SYNCHRONIZABLE_DATA_TYPES.map(type => (\\\
                         <div key={type} className=\\\"p-3 bg-neutral-600/50 rounded-md\\\">\\\
                             <p className=\\\"text-neutral-300 text-sm font-semibold mb-1\\\">\\\
                                 {/* Display user-friendly names for data types */}\\\
                                 {type === 'memoryEngine' ? 'Knowledge Base' :\\\
                                  type === 'authorityForgingEngine' ? 'Scripts & Abilities' :\\\
                                  type === 'selfNavigationEngine' ? 'Tasks & Flows' :\\\
                                  type === 'runeEngraftingCenter' ? 'Agents & Runes' :\\\
                                  type === 'goalManagementService' ? 'Goals' :\\\
                                  type === 'notificationService' ? 'Notifications' :\\\
                                  type === 'analyticsService' ? 'Analytics Data' :\\\
                                  type}\\\
                             </p>\\\
                             <p className=\\\"text-neutral-400 text-xs\\\">\\\
                                 Status: <span className={moduleSyncStatuses[type]?.status === 'syncing' ? 'text-yellow-400' : moduleSyncStatuses[type]?.status === 'error' ? 'text-red-400' : moduleSyncStatuses[type]?.status === 'idle' ? 'text-green-400' : 'text-neutral-400'}>{moduleSyncStatuses[type]?.status.toUpperCase() || 'UNKNOWN'}</span>\\\
                             </p>\\\
                              {moduleSyncStatuses[type]?.step && (\\\
                                 <p className=\\\"text-neutral-400 text-xs mt-1\\\">\\\
                                     Step: {moduleSyncStatuses[type].step}\\\
                                 </p>\\\
                             )}\\\
                             {moduleSyncStatuses[type]?.timestamp && ( // Use optional chaining\\\
                                 <p className=\\\"text-neutral-400 text-xs mt-1\\\">\\\
                                     Last Synced: {new Date(moduleSyncStatuses[type].timestamp!).toLocaleString()}\\\
                                 </p>\\\
                             )}\\\
                         </div>\\\
                     ))}\\\
                 </div>\\\
             )}\\\
         </div>\\\
\\\n        {/* New: Data Type Sync */}\\\
        <div className=\\\"mb-8 p-4 bg-neutral-700/50 rounded-lg\\\">\\\
            <h3 className=\\\"text-xl font-semibold text-blue-300 mb-3\\\">Synchronize Specific Data Type</h3>\\\
            <form onSubmit={handleSyncDataType}>\\\
                <div className=\\\"flex flex-wrap items-center gap-4 mb-4\\\">\\\
                    <div>\\\
                        <label htmlFor=\\\"dataTypeSelect\\\" className=\\\"block text-neutral-300 text-sm font-semibold mb-1\\\">Data Type:</label>\\\
                        <select\\\
                            id=\\\"dataTypeSelect\\\"\\\
                            className=\\\"p-2 rounded-md bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500\\\"\\\
                            value={selectedDataType}\\\
                            onChange={(e) => setSelectedDataType(e.target.value as SynchronizableDataType)}\\\
                            disabled={isSyncingDataType}\\\
                            required\\\
                        >\\\
                            <option value=\\\"\\\">-- Select Data Type --</option>\\\
                            {SYNCHRONIZABLE_DATA_TYPES.map(type => (\\\
                                <option key={type} value={type}>\\\
                                    {type === 'memoryEngine' ? 'Knowledge Base' :\\\
                                     type === 'authorityForgingEngine' ? 'Scripts & Abilities' :\\\
                                     type === 'selfNavigationEngine' ? 'Tasks & Flows' :\\\
                                     type === 'runeEngraftingCenter' ? 'Agents & Runes' :\\\
                                     type === 'goalManagementService' ? 'Goals' :\\\
                                     type === 'notificationService' ? 'Notifications' :\\\
                                     type === 'analyticsService' ? 'Analytics Data' :\\\
                                     type}\\\
                                </option>\\\
                            ))}\\\
                        </select>\\\
                    </div>\\\
                    <div>\\\
                        <label htmlFor=\\\"directionSelect\\\" className=\\\"block text-neutral-300 text-sm font-semibold mb-1\\\">Direction:</label>\\\
                        <select\\\
                            id=\\\"directionSelect\\\"\\\
                            className=\\\"p-2 rounded-md bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500\\\"\\\
                            value={selectedDirection}\\\
                            onChange={(e) => setSelectedDirection(e.target.value as 'up' | 'down' | 'bidirectional')}\\\
                            disabled={isSyncingDataType}\\\
                            required\\\
                        >\\\
                            <option value=\\\"bidirectional\\\">Bidirectional</option>\\\
                            <option value=\\\"up\\\">Upload (Local to Cloud)</option>\\\
                            <option value=\\\"down\\\">Download (Cloud to Local)</option>\\\
                        </select>\\\
                    </div>\\\
                </div>\\\
                 <button\\\n                    type=\\\"submit\\\"\\\n                    className=\\\"px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed\\\"\\\n                    disabled={isSyncingDataType || !selectedDataType || !selectedDirection}\\\
                 >\\\
                     {isSyncingDataType ? <Loader2 size={18} className=\\\"inline-block mr-1 animate-spin\\\"/> : <RefreshCcw size={18} className=\\\"inline-block mr-1\\\"/>)}\\\
                     {isSyncingDataType ? 'Syncing...' : 'Sync Selected'}\\\
                 </button>\\\
            </form>\\\
             {error && isSyncingDataType === false && ( // Show sync error only after it finishes\\\
                 <p className=\\\"text-red-400 text-sm mt-4\\\">Error: {error}</p>\\\
             )}\\\
        </div>\\\
        {/* End New */}\\\
\\\n\\\n        {/* Simulated Mobile Git Sync */}\\\
        <div className=\\\"mb-8 p-4 bg-neutral-700/50 rounded-lg\\\">\\\
            <h3 className=\\\"text-xl font-semibold text-blue-300 mb-3\\\">Simulated Mobile Git Sync</h3>\\\
            <p className=\\\"text-neutral-300 text-sm mb-4\\\">Simulate synchronizing your mobile Git repository. This action is recorded as a development log.</p>\\\
            <div className=\\\"flex flex-wrap gap-4\\\"> {/* Use flex-wrap for smaller screens */}\\\
                <button\\\n                    className=\\\"flex-1 px-6 py-2 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed\\\"\\\n                    onClick={() => handleSimulateGit('pull')}\\\n                    disabled={isSimulatingGit}\\\n                >\\\n                    <GitPullRequest size={18} className={`;
inline - block;
mr - 1;
$;
{
    isSimulatingGit ? 'animate-pulse' : '';
}
`} />\\\
                    {isSimulatingGit ? 'Pulling...' : 'Simulate Git Pull'}\\\
                </button>\\\
                 <button\\\n                    className=\\\"flex-1 px-6 py-2 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed\\\"\\\n                    onClick={() => handleSimulateGit('push')}\\\n                    disabled={isSimulatingGit}\\\n                 >\\\
                    <GitPush size={18} className={`;
inline - block;
mr - 1;
$;
{
    isSimulatingGit ? 'animate-pulse' : '';
}
`} />\\\
                    {isSimulatingGit ? 'Pushing...' : 'Simulate Git Push'}\\\
                 </button>\\\
                 <button\\\n                    className=\\\"flex-1 px-6 py-2 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed\\\"\\\n                    onClick={() => handleSimulateGit('bidirectional')}\\\n                    disabled={isSimulatingGit}\\\n                 >\\\
                    <GitMerge size={18} className={`;
inline - block;
mr - 1;
$;
{
    isSimulatingGit ? 'animate-pulse' : '';
}
`} />\\\
                    {isSimulatingGit ? 'Syncing...' : 'Simulate Git Sync'}\\\
                 </button>\\\
            </div>\\\
             {error && isSimulatingGit === false && ( // Show simulation error only after it finishes\\\
                 <p className=\\\"text-red-400 text-sm mt-4\\\">Error: {error}</p>\\\
             )}\\\
        </div>\\\
\\\n        {/* New: Conflict Resolution & Background Sync Concepts */}\\\
        <div className=\\\"mb-8 p-4 bg-neutral-700/50 rounded-lg\\\">\\\
            <h3 className=\\\"text-xl font-semibold text-blue-300 mb-3\\\">Advanced Sync Concepts</h3>\\\
            <div className=\\\"space-y-4\\\">\\\
                <div>\\\
                    <h4 className=\\\"text-neutral-300 text-lg font-semibold mb-2 flex items-center gap-2\\\"><Info size={20}/> Conflict Resolution (Codex Harmony)</h4>\\\
                    <p className=\\\"text-neutral-400 text-sm\\\">When changes are made to the same data on different devices before syncing, conflicts can occur. Jun.Ai.Key uses strategies (like Last Write Wins or CRDTs) to automatically resolve most conflicts. Manual review might be needed for complex cases.</p>\\\
                    {/* TODO: Add UI to view/resolve manual conflicts if implemented */}\\\
                </div>\\\
                <div>\\\
                    <h4 className=\\\"text-neutral-300 text-lg font-semibold mb-2 flex items-center gap-2\\\"><Info size={20}/> Background Sync (Invisible Hand)</h4>\\\
                    <p className=\\\"text-neutral-400 text-sm\\\">Synchronization often happens automatically in the background when your device is connected to the internet, ensuring your data is always up-to-date without manual intervention. You can configure sync frequency and conditions (e.g., Wi-Fi only) in Settings (TODO).</p>\\\
                    {/* TODO: Add UI for background sync settings */}\\\
                </div>\\\
            </div>\\\
        </div>\\\
        {/* End New */}\\\
\\\n\\\n        {/* TODO: Add options for configuring sync (e.g., frequency, wifi only) */}\\\
        {/* TODO: Add UI for viewing sync history/logs */}\\\
\\\n      </div>\\\
    </div>\\\
  );\\\
};\\\
\\nexport default Sync;\\\
` ``;
