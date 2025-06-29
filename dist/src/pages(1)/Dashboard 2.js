"use strict";
`` `typescript
// src/pages/Dashboard.tsx
// Dashboard Page (\u5100\u8868\u677f)
// Provides an overview of the system status, including synchronization and recent activity.
// --- New: Create a page for the Dashboard UI ---
// --- New: Implement fetching and displaying sync status ---
// --- New: Add UI for triggering full sync ---
// --- New: Add UI for simulating Mobile Git sync ---
// --- Modified: Display more detailed sync status and queue size ---
// --- Modified: Add UI elements related to conflict resolution and background sync concepts ---
// --- Modified: Update UI to reflect persistent queue concept ---
// --- New: Fetch and display recent development logs ---
// --- New: Add Realtime Updates for sync status and dev logs ---


import React, { useEffect, useState } from 'react';
import { SyncService } from '../modules/sync/SyncService';
import { AuthorityForgingEngine } from '../core/authority/AuthorityForgingEngine';
import { KnowledgeSync } from '../modules/knowledgeSync'; // To fetch dev logs
import { KnowledgeRecord } from '../interfaces'; // For dev logs type
import { RefreshCcw, GitPullRequest, GitPush, GitMerge, Loader2, Info } from 'lucide-react'; // Import icons

// Access core modules from the global window object (for MVP simplicity)
// In a real app, use React Context or dependency injection
declare const window: any;
const syncService: SyncService = window.systemContext?.syncService; // The Sync Service (\u540c\u6b65\u670d\u52d9)
const authorityForgingEngine: AuthorityForgingEngine = window.systemContext?.authorityForgingEngine; // The Authority Forging (\u6b0a\u80fd\u935b\u9020) pillar
const knowledgeSync: KnowledgeSync = window.systemContext?.knowledgeSync; // The Knowledge Sync (\u77e5\u8b58\u540c\u6b65) module
const systemContext: any = window.systemContext; // Access the full context for currentUser

// Define data types relevant to sync status display
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


const Dashboard: React.FC = () => {
  const [overallSyncStatus, setOverallSyncStatus] = useState<SyncStatus>('unknown'); // Use SyncStatus type
  const [overallSyncStep, setOverallSyncStep] = useState<string | undefined>(undefined); // New state for overall step
  const [moduleSyncStatuses, setModuleSyncStatuses] = useState<Record<SynchronizableDataType, { status: SyncStatus, step?: string, timestamp?: number | undefined }>>(() => { // Use SyncStatus type, added step
      const initialStatuses: any = {};
      SYNCHRONIZABLE_DATA_TYPES.forEach(type => {
          initialStatuses[type] = { status: 'unknown', step: undefined, timestamp: undefined };
      });
      return initialStatuses;
  });
  const [localQueueSize, setLocalQueueSize] = useState(0);
  const [recentDevLogs, setRecentDevLogs] = useState<KnowledgeRecord[]>([]);
  const [loadingDevLogs, setLoadingDevLogs] = useState(true);
  const [isSyncingAll, setIsSyncingAll] = useState(false);
  const [isSimulatingGit, setIsSimulatingGit] = useState(false); // State for simulating Git sync
  const [error, setError] = useState<string | null>(null);


  const updateSyncStatuses = () => {
      if (syncService) {
          setOverallSyncStatus(syncService.getSyncStatus('system') || 'unknown');
          setOverallSyncStep(syncService.getSyncStep('system')); // Get overall step
          setLocalQueueSize(syncService.getLocalQueueSize()); // Get queue size
          const updatedModuleStatuses: any = {};
          SYNCHRONIZABLE_DATA_TYPES.forEach(type => {
              updatedModuleStatuses[type] = {
                  status: syncService.getSyncStatus(type) || 'unknown',
                  step: syncService.getSyncStep(type), // Get module step
                  timestamp: syncService.getLastSyncTimestamp(type),
              };
          });
          setModuleSyncStatuses(updatedModuleStatuses);
      } else {
          setOverallSyncStatus('unknown');
          setOverallSyncStep(undefined);
          setLocalQueueSize(0);
          const updatedModuleStatuses: any = {};
           SYNCHRONIZABLE_DATA_TYPES.forEach(type => {
              updatedStatuses[type] = { status: 'unknown', step: undefined, timestamp: undefined };
          });
          setModuleSyncStatuses(updatedStatuses);
      }
  };

  const fetchRecentDevLogs = async () => {
      const userId = systemContext?.currentUser?.id;
      if (!knowledgeSync || !userId) {
          // setError(\"KnowledgeSync module not initialized or user not logged in.\"); // Don't set error for just logs
          setLoadingDevLogs(false);
          return;
      }
      setLoadingDevLogs(true);
      setError(null); // Clear main error when fetching logs
      try {
          // Fetch all knowledge records for the user and filter for dev logs
          const allRecords = await knowledgeSync.getAllKnowledgeForUser(userId); // Pass userId
          const devLogs = allRecords.filter(record => record.source === 'dev-log');
          // Sort by timestamp descending
          devLogs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
          setRecentDevLogs(devLogs.slice(0, 10)); // Show only the 10 most recent
      } catch (err: any) {
          console.error('Error fetching dev logs:', err);
          // setError(`;
Failed;
to;
load;
development;
logs: $;
{
    err.message;
}
`); // Don't set error for just logs
          setRecentDevLogs([]); // Clear actions on error
      } finally {
          setLoadingDevLogs(false);
      }
  };


  useEffect(() => {
    // Fetch initial data and set up listeners when the component mounts or user changes
    if (systemContext?.currentUser?.id) {
      updateSyncStatuses(); // Initial sync status check
      fetchRecentDevLogs(); // Fetch initial dev logs

      // Subscribe to sync status changes
      let unsubscribeSyncStarted: (() => void) | undefined;
      let unsubscribeSyncCompleted: (() => void) | undefined;
      let unsubscribeSyncError: (() => void) | undefined;
      let unsubscribeSyncStatusUpdate: (() => void) | undefined;
      let unsubscribeMobileGitSynced: (() => void) | undefined;


      if (syncService?.context?.eventBus) {
          const eventBus = syncService.context.eventBus;

           unsubscribeSyncStarted = eventBus.subscribe('sync_started', (payload: any) => {
               if (payload.userId === systemContext?.currentUser?.id) {
                   console.log('Dashboard received sync_started event.');
                   updateSyncStatuses(); // Update all statuses
                   // Reset specific sync states if the started event matches
                   if (payload.dataType === 'system') {
                       setIsSyncingAll(true);
                   }
               }
           });
            unsubscribeSyncCompleted = eventBus.subscribe('sync_completed', (payload: any) => {
               if (payload.userId === systemContext?.currentUser?.id) {
                   console.log('Dashboard received sync_completed event.');
                   updateSyncStatuses(); // Update all statuses
                   // Reset specific sync states if the completed event matches
                   if (payload.dataType === 'system') {
                       setIsSyncingAll(false);
                   }
                   // If knowledge sync completed, refetch dev logs
                   if (payload.dataType === 'memoryEngine' || payload.dataType === 'system') {
                       fetchRecentDevLogs();
                   }
               }
           });
            unsubscribeSyncError = eventBus.subscribe('sync_error', (payload: any) => {
               if (payload.userId === systemContext?.currentUser?.id) {
                   console.log('Dashboard received sync_error event.');
                   updateSyncStatuses(); // Update all statuses
                    // Reset specific sync states if the error event matches
                   if (payload.dataType === 'system') {
                       setIsSyncingAll(false);
                       setError(`;
Full;
sync;
failed: $;
{
    payload.error;
}
`); // Display overall error
                   }
               }
           });
            // Listen for detailed status updates (including queue size changes)
             unsubscribeSyncStatusUpdate = eventBus.subscribe('sync_status_update', (payload: any) => {
                 if (payload.userId === systemContext?.currentUser?.id) {
                     console.log('Dashboard received sync_status_update event.');
                     // Only update specific status/step if needed, or just trigger full status update
                     updateSyncStatuses(); // Update all statuses including queue size
                 }
             });

            // Listen for mobile git sync events specifically to refetch dev logs
             unsubscribeMobileGitSynced = eventBus.subscribe('mobile_git_synced', (payload: any) => {
                if (payload.userId === systemContext?.currentUser?.id) {
                    console.log('Dashboard received mobile_git_synced event.');
                    fetchRecentDevLogs(); // Refetch dev logs after git sync
                }
             });

      }


      return () => {
        // Unsubscribe on component unmount
        unsubscribeSyncStarted?.();
        unsubscribeSyncCompleted?.();
        unsubscribeSyncError?.();
        unsubscribeSyncStatusUpdate?.();
        unsubscribeMobileGitSynced?.();
      };

    } else {
        // Reset state if user logs out
        setOverallSyncStatus('unknown');
        setOverallSyncStep(undefined);
        setLocalQueueSize(0);
        const initialStatuses: any = {};
           SYNCHRONIZABLE_DATA_TYPES.forEach(type => {
              initialStatuses[type] = { status: 'unknown', step: undefined, timestamp: undefined };
          });
        setModuleSyncStatuses(initialStatuses);
        setRecentDevLogs([]);
        setLoadingDevLogs(false);
        setIsSyncingAll(false);
        setIsSimulatingGit(false);
        setError(null);
    }

  }, [systemContext?.currentUser?.id, syncService, knowledgeSync]); // Re-run effect when user ID, syncService, or knowledgeSync changes


  const handleSyncAll = async () => {
      const userId = systemContext?.currentUser?.id;
      if (!syncService || !userId) {
          alert(\"SyncService module not initialized or user not logged in.\");
          return;
      }
      console.log(`;
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
`);
       // Simulate recording user action (Part of \u516d\u5f0f\u5967\u7fa9: \u89c0\u5bdf)
        authorityForgingEngine?.recordAction({\
            type: 'web:dashboard:sync_all',\
            details: { userId },\
            context: { platform: 'web', page: 'dashboard' },\
            user_id: userId, // Associate action with user\
        });

      setIsSyncingAll(true);
      setError(null);
      try {
          // Trigger full sync (Part of \u96d9\u5410\u540c\u6b65\u9818\u57df)
          await syncService.syncAllData(userId); // Pass user ID
          // Status and logs will be updated by listeners
      } catch (err: any) {
          console.error('Error during full sync:', err);
          // Error is already set by updateSyncStatuses on sync_error event
          // setError(`;
Full;
sync;
failed: $;
{
    err.message;
}
`);
      } finally {
          // setIsSyncingAll is reset by the sync_completed/sync_error event listeners for 'system'
      }
  };

   const handleSimulateGit = async (direction: 'pull' | 'push' | 'bidirectional') => {
       const userId = systemContext?.currentUser?.id;
       if (!syncService || !userId) {
           alert(\"SyncService module not initialized or user not logged in.\");
           return;
       }
       console.log(`;
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
`);
        // Simulate recording user action (Part of \u516d\u5f0f\u5967\u7fa9: \u89c0\u5bdf)
        authorityForgingEngine?.recordAction({\
            type: `;
web: dashboard: simulate_git_$;
{
    direction;
}
`,\
            details: { direction, userId },\
            context: { platform: 'web', page: 'dashboard' },\
            user_id: userId, // Associate action with user\
        });

       setIsSimulatingGit(true); // Use a single state for simplicity, or separate states for pull/push
       setError(null);
       try {
           // Trigger simulated mobile Git sync via SyncService (Part of \u96d9\u5410\u540c\u6b65\u9818\u57df)
           // The SyncService will record a dev log in the KB and publish status events
           await syncService.syncMobileGitRepo(userId, direction, { repoUrl: 'simulated/mobile/repo' }); // Pass user ID and simulated details
           // Dev logs will be refetched by the listener
       } catch (err: any) {
           console.error(`;
Error;
simulating;
Git;
$;
{
    direction;
}
`, err);
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
`);
       } finally {
           setIsSimulatingGit(false);
       }
   };


  // Ensure user is logged in before rendering content
  if (!systemContext?.currentUser) {
       // This case should ideally be handled by ProtectedRoute, but as a fallback:
       return (
            <div className=\"container mx-auto p-4 flex justify-center\">
               <div className=\"bg-neutral-800/50 p-8 rounded-lg shadow-xl w-full max-w-md text-center text-neutral-300\">
                   <p>Please log in to view the dashboard.</p>
               </div>
            </div>
       );
  }


  return (
    <div className=\"container mx-auto p-4\">
      <div className=\"bg-neutral-800/50 p-6 rounded-lg shadow-xl\">
        <h2 className=\"text-3xl font-bold text-blue-400 mb-6\">Dashboard (\u5100\u8868\u677f)</h2>
        <p className=\"text-neutral-300 mb-8\">Overview of your Jun.Ai.Key system status and recent activity.</p>

        {/* Overall Synchronization Status */}
        <div className=\"mb-8 p-4 bg-neutral-700/50 rounded-lg flex justify-between items-center\">
            <div>
                <h3 className=\"text-xl font-semibold text-blue-300 mb-1\">Overall Synchronization Status</h3>
                <p className=\"text-neutral-300 text-sm\">
                    Status: <span className={overallSyncStatus === 'syncing' ? 'text-yellow-400' : overallSyncStatus === 'error' ? 'text-red-400' : overallSyncStatus === 'idle' ? 'text-green-400' : 'text-neutral-400'}>{overallSyncStatus.toUpperCase()}</span>
                </p>
                 {overallSyncStep && (
                     <p className=\"text-neutral-400 text-xs mt-1\">
                         Step: {overallSyncStep}
                     </p>
                 )}
                 {syncService?.getLastSyncTimestamp('system') && ( // Use system timestamp for overall
                    <p className=\"text-neutral-400 text-xs mt-1\">
                        Last Synced: {new Date(syncService.getLastSyncTimestamp('system')!).toLocaleString()}
                    </p>
                )}
                 {/* Display Queue Size */}
                 <p className=\"text-neutral-400 text-xs mt-1 flex items-center gap-1\">
                     <Info size={14}/> Local Change Queue: <span className=\"font-mono text-blue-300\">{localQueueSize}</span> pending items (Persistent) {/* Added Persistent */}
                 </p>
            </div>
             <button
                className=\"px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed\"
                onClick={handleSyncAll}
                disabled={isSyncingAll || overallSyncStatus === 'syncing'} // Disable if already syncing
             >
                 <RefreshCcw size={18} className={`;
inline - block;
mr - 1;
$;
{
    isSyncingAll || overallSyncStatus === 'syncing' ? 'animate-spin' : '';
}
`} />
                 {isSyncingAll ? 'Syncing All...' : 'Sync All Data Now'}
             </button>
        </div>

         {/* Module Synchronization Statuses */}
         <div className=\"mb-8 p-4 bg-neutral-700/50 rounded-lg\">
             <h3 className=\"text-xl font-semibold text-blue-300 mb-3\">Module Synchronization Statuses</h3>
             {loading ? (
                 <p className=\"text-neutral-400\">Loading module statuses...</p>
             ) : error && overallSyncStatus !== 'error' ? ( // Only show module error if overall is not already error
                 <p className=\"text-red-400\">Error: {error}</p>
             ) : (
                 <div className=\"grid grid-cols-1 md:grid-cols-2 gap-4\">
                     {SYNCHRONIZABLE_DATA_TYPES.map(type => (
                         <div key={type} className=\"p-3 bg-neutral-600/50 rounded-md\">
                             <p className=\"text-neutral-300 text-sm font-semibold mb-1\">
                                 {/* Display user-friendly names for data types */}
                                 {type === 'memoryEngine' ? 'Knowledge Base' :
                                  type === 'authorityForgingEngine' ? 'Scripts & Abilities' :
                                  type === 'selfNavigationEngine' ? 'Tasks & Flows' :
                                  type === 'runeEngraftingCenter' ? 'Agents & Runes' :
                                  type === 'goalManagementService' ? 'Goals' :
                                  type === 'notificationService' ? 'Notifications' :
                                  type === 'analyticsService' ? 'Analytics Data' :
                                  type}
                             </p>
                             <p className=\"text-neutral-400 text-xs\">
                                 Status: <span className={moduleSyncStatuses[type]?.status === 'syncing' ? 'text-yellow-400' : moduleSyncStatuses[type]?.status === 'error' ? 'text-red-400' : moduleSyncStatuses[type]?.status === 'idle' ? 'text-green-400' : 'text-neutral-400'}>{moduleSyncStatuses[type]?.status.toUpperCase() || 'UNKNOWN'}</span>
                             </p>
                              {moduleSyncStatuses[type]?.step && (
                                 <p className=\"text-neutral-400 text-xs mt-1\">
                                     Step: {moduleSyncStatuses[type].step}
                                 </p>
                             )}
                             {moduleSyncStatuses[type]?.timestamp && ( // Use optional chaining
                                 <p className=\"text-neutral-400 text-xs mt-1\">
                                     Last Synced: {new Date(moduleSyncStatuses[type].timestamp!).toLocaleString()}
                                 </p>
                             )}
                         </div>
                     ))}
                 </div>
             )}
         </div>

        {/* Simulated Mobile Git Sync */}
        <div className=\"mb-8 p-4 bg-neutral-700/50 rounded-lg\">
            <h3 className=\"text-xl font-semibold text-blue-300 mb-3\">Simulated Mobile Git Sync</h3>
            <p className=\"text-neutral-300 text-sm mb-4\">Simulate synchronizing your mobile Git repository. This action is recorded as a development log.</p>
            <div className=\"flex flex-wrap gap-4\"> {/* Use flex-wrap for smaller screens */}
                <button
                    className=\"flex-1 px-6 py-2 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed\"
                    onClick={() => handleSimulateGit('pull')}
                    disabled={isSimulatingGit}
                >
                    <GitPullRequest size={18} className={`;
inline - block;
mr - 1;
$;
{
    isSimulatingGit ? 'animate-pulse' : '';
}
`} />
                    {isSimulatingGit ? 'Pulling...' : 'Simulate Git Pull'}
                </button>
                 <button
                    className=\"flex-1 px-6 py-2 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed\"
                    onClick={() => handleSimulateGit('push')}
                    disabled={isSimulatingGit}
                 >
                    <GitPush size={18} className={`;
inline - block;
mr - 1;
$;
{
    isSimulatingGit ? 'animate-pulse' : '';
}
`} />
                    {isSimulatingGit ? 'Pushing...' : 'Simulate Git Push'}
                 </button>
                 <button
                    className=\"flex-1 px-6 py-2 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed\"
                    onClick={() => handleSimulateGit('bidirectional')}
                    disabled={isSimulatingGit}
                 >
                    <GitMerge size={18} className={`;
inline - block;
mr - 1;
$;
{
    isSimulatingGit ? 'animate-pulse' : '';
}
`} />
                    {isSimulatingGit ? 'Syncing...' : 'Simulate Git Sync'}
                 </button>
            </div>
             {error && isSimulatingGit === false && ( // Show simulation error only after it finishes
                 <p className=\"text-red-400 text-sm mt-4\">Error: {error}</p>
             )}
        </div>


        {/* Recent Development Logs */}
        <div className=\"p-4 bg-neutral-700/50 rounded-lg\">
            <h3 className=\"text-xl font-semibold text-blue-300 mb-3\">Recent Development Logs</h3>
            {loadingDevLogs ? (
                <p className=\"text-neutral-400\">Loading development logs...</p>
            ) : recentDevLogs.length === 0 ? (
                <p className=\"text-neutral-400\">No recent development logs found.</p>
            ) : (
                <ul className=\"space-y-3\">
                    {recentDevLogs.map(log => (
                        <li key={log.id} className=\"bg-neutral-600/50 p-3 rounded-md border-l-4 border-orange-500\">
                            <p className=\"text-sm font-semibold text-orange-200 mb-1\">{log.question}</p>
                            <p className=\"text-neutral-300 text-sm\">{log.answer.substring(0, 150)}{log.answer.length > 150 ? '...' : ''}</p>
                            <small className=\"text-neutral-400 text-xs block mt-1\">
                                Timestamp: {new Date(log.timestamp).toLocaleString()}
                                {log.dev_log_details?.type && ` | Type;
$;
{
    log.dev_log_details.type;
}
`}
                                {log.dev_log_details?.repo_url && ` | Repo;
$;
{
    log.dev_log_details.repo_url;
}
`}
                            </small>
                        </li>
                    ))}
                </ul>
            )}
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
` ``;
